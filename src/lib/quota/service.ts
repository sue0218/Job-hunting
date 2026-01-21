import { db } from '@/lib/db/client'
import { experiences, esDocuments, interviewSessions } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'
import { getEffectivePlan, PLAN_LIMITS } from '@/lib/config/admin'
import { QuotaExceededError, type QuotaType, type QuotaCheckResult } from './types'

/**
 * Get the start of the current month for quota calculations
 */
function getMonthStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Get current usage counts for a user
 */
export async function getCurrentUsage(userId: string): Promise<{
  experiences: number
  esGenerationsThisMonth: number
  interviewSessionsThisMonth: number
}> {
  const monthStart = getMonthStart()

  // Count experiences (total)
  const userExperiences = await db.query.experiences.findMany({
    where: eq(experiences.userId, userId),
    columns: { id: true },
  })

  // Count ES documents created this month
  const monthlyEsDocs = await db.query.esDocuments.findMany({
    where: and(
      eq(esDocuments.userId, userId),
      gte(esDocuments.createdAt, monthStart)
    ),
    columns: { id: true },
  })

  // Count interview sessions created this month
  const monthlySessions = await db.query.interviewSessions.findMany({
    where: and(
      eq(interviewSessions.userId, userId),
      gte(interviewSessions.createdAt, monthStart)
    ),
    columns: { id: true },
  })

  return {
    experiences: userExperiences.length,
    esGenerationsThisMonth: monthlyEsDocs.length,
    interviewSessionsThisMonth: monthlySessions.length,
  }
}

/**
 * Check quota for a specific user (internal function)
 */
export async function checkQuotaForUser(
  userId: string,
  email: string,
  dbPlan: string,
  quotaType: QuotaType
): Promise<QuotaCheckResult> {
  const plan = getEffectivePlan(email, dbPlan)
  const limits = PLAN_LIMITS[plan]
  const usage = await getCurrentUsage(userId)

  let current: number
  let limit: number

  switch (quotaType) {
    case 'experience':
      current = usage.experiences
      limit = limits.experiences
      break
    case 'es_generation':
      current = usage.esGenerationsThisMonth
      limit = limits.esGenerationsPerMonth
      break
    case 'interview_session':
      current = usage.interviewSessionsThisMonth
      limit = limits.interviewSessionsPerMonth
      break
  }

  const remaining = Math.max(0, limit - current)
  const allowed = current < limit

  return {
    allowed,
    current,
    limit,
    remaining,
    plan,
  }
}

/**
 * Enforce quota for a specific user - throws QuotaExceededError if limit reached
 */
export async function enforceQuotaForUser(
  userId: string,
  email: string,
  dbPlan: string,
  quotaType: QuotaType
): Promise<void> {
  const result = await checkQuotaForUser(userId, email, dbPlan, quotaType)

  if (!result.allowed) {
    throw new QuotaExceededError(quotaType, result.current, result.limit)
  }
}

/**
 * Get all quota information for a user
 */
export async function getQuotaStatusForUser(
  userId: string,
  email: string,
  dbPlan: string
): Promise<{
  plan: 'free' | 'standard'
  experiences: QuotaCheckResult
  esGenerations: QuotaCheckResult
  interviewSessions: QuotaCheckResult
}> {
  const plan = getEffectivePlan(email, dbPlan)
  const limits = PLAN_LIMITS[plan]
  const usage = await getCurrentUsage(userId)

  return {
    plan,
    experiences: {
      allowed: usage.experiences < limits.experiences,
      current: usage.experiences,
      limit: limits.experiences,
      remaining: Math.max(0, limits.experiences - usage.experiences),
      plan,
    },
    esGenerations: {
      allowed: usage.esGenerationsThisMonth < limits.esGenerationsPerMonth,
      current: usage.esGenerationsThisMonth,
      limit: limits.esGenerationsPerMonth,
      remaining: Math.max(0, limits.esGenerationsPerMonth - usage.esGenerationsThisMonth),
      plan,
    },
    interviewSessions: {
      allowed: usage.interviewSessionsThisMonth < limits.interviewSessionsPerMonth,
      current: usage.interviewSessionsThisMonth,
      limit: limits.interviewSessionsPerMonth,
      remaining: Math.max(0, limits.interviewSessionsPerMonth - usage.interviewSessionsThisMonth),
      plan,
    },
  }
}
