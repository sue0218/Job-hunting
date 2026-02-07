'use server'

import { db } from '@/lib/db/client'
import { consistencyChecks, experiences, esDocuments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getOrCreateUser } from './user'
import { getEffectivePlan } from '@/lib/config/admin'
import { checkConsistency, checkESConsistency, checkInterviewConsistency, type ConsistencyCheckResult } from '@/lib/llm/consistency-service'
import { revalidatePath } from 'next/cache'

export async function runConsistencyCheck(): Promise<ConsistencyCheckResult> {
  const user = await getOrCreateUser()
  const plan = getEffectivePlan(user.email, user.plan, user.trialEndsAt)

  // Get all user's experiences
  const userExperiences = await db.query.experiences.findMany({
    where: eq(experiences.userId, user.id),
  })

  // Get all user's ES documents
  const userEsDocuments = await db.query.esDocuments.findMany({
    where: eq(esDocuments.userId, user.id),
  })

  const expData = userExperiences.map(exp => ({
    title: exp.title,
    situation: exp.situation,
    task: exp.task,
    action: exp.action,
    result: exp.result,
    skills: exp.skills,
  }))

  const esData = userEsDocuments.map(es => ({
    question: es.question,
    content: es.editedContent || es.generatedContent || '',
  }))

  const result = await checkConsistency(expData, esData, undefined, plan)

  // Save check result to database
  await db.insert(consistencyChecks).values({
    userId: user.id,
    targetType: 'all',
    issues: result.issues,
  })

  revalidatePath('/dashboard')
  return result
}

export async function runESConsistencyCheck(esId: string): Promise<ConsistencyCheckResult> {
  const user = await getOrCreateUser()
  const plan = getEffectivePlan(user.email, user.plan, user.trialEndsAt)

  // Get the ES document
  const esDoc = await db.query.esDocuments.findFirst({
    where: eq(esDocuments.id, esId),
  })

  if (!esDoc || esDoc.userId !== user.id) {
    return {
      hasIssues: false,
      issues: [],
      summary: 'ES文書が見つかりません。',
    }
  }

  // Get user's experiences
  const userExperiences = await db.query.experiences.findMany({
    where: eq(experiences.userId, user.id),
  })

  const expData = userExperiences.map(exp => ({
    title: exp.title,
    situation: exp.situation,
    task: exp.task,
    action: exp.action,
    result: exp.result,
    skills: exp.skills,
  }))

  const result = await checkESConsistency(
    expData,
    esDoc.editedContent || esDoc.generatedContent || '',
    esDoc.question,
    plan
  )

  // Save check result
  await db.insert(consistencyChecks).values({
    userId: user.id,
    targetType: 'es',
    targetId: esId,
    issues: result.issues,
  })

  revalidatePath(`/es/${esId}`)
  return result
}

export async function getLatestConsistencyCheck(): Promise<{
  result: ConsistencyCheckResult | null
  checkedAt: Date | null
}> {
  const user = await getOrCreateUser()

  const latest = await db.query.consistencyChecks.findFirst({
    where: eq(consistencyChecks.userId, user.id),
    orderBy: [desc(consistencyChecks.createdAt)],
  })

  if (!latest) {
    return { result: null, checkedAt: null }
  }

  return {
    result: {
      hasIssues: Array.isArray(latest.issues) && latest.issues.length > 0,
      issues: (latest.issues as ConsistencyCheckResult['issues']) || [],
      summary: '',
    },
    checkedAt: latest.createdAt,
  }
}
