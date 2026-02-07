'use server'

import { db } from '@/lib/db/client'
import { experiences, type Experience } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getCurrentUserId, getOrCreateUser } from './user'
import { revalidatePath } from 'next/cache'
import {
  createExperienceSchema,
  updateExperienceSchema,
  quickCreateExperienceSchema,
  uuidSchema,
  type CreateExperienceInput,
  type UpdateExperienceInput,
  type QuickCreateExperienceInput,
} from '@/lib/validations'
import { enforceQuotaForUser } from '@/lib/quota/service'
import { QuotaExceededError } from '@/lib/quota/types'
import { checkAndQualifyReferral } from './referral'
import { trackEvent } from '@/lib/events'
import { auth } from '@clerk/nextjs/server'

// Convert YYYY-MM format to YYYY-MM-01 for PostgreSQL date type
function normalizeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  // If already YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  // If YYYY-MM format, append -01
  if (/^\d{4}-\d{2}$/.test(dateStr)) return `${dateStr}-01`
  return dateStr
}

export async function getExperiences(): Promise<Experience[]> {
  const userId = await getCurrentUserId()

  return db.query.experiences.findMany({
    where: eq(experiences.userId, userId),
    orderBy: [desc(experiences.updatedAt)],
  })
}

export async function getExperience(id: string): Promise<Experience | null> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return null
  }

  const userId = await getCurrentUserId()

  const result = await db.query.experiences.findFirst({
    where: eq(experiences.id, validatedId.data),
  })

  if (!result || result.userId !== userId) {
    return null
  }

  return result
}

export async function createExperience(data: CreateExperienceInput): Promise<Experience> {
  // Validate input
  const validated = createExperienceSchema.parse(data)

  // Get user and check quota before creating
  const user = await getOrCreateUser()
  await enforceQuotaForUser(user.id, user.email, user.plan, 'experience', user.trialEndsAt)

  const userId = user.id

  const [created] = await db.insert(experiences).values({
    ...validated,
    periodStart: normalizeDate(validated.periodStart),
    periodEnd: normalizeDate(validated.periodEnd),
    userId,
  }).returning()

  // Track event and check referral milestone
  const { userId: clerkId } = await auth()
  if (clerkId) {
    await trackEvent('experience_created', clerkId, { experienceId: created.id })
    // Check if referral milestone is now met (experience + ES)
    await checkAndQualifyReferral(clerkId)
  }

  revalidatePath('/experiences')
  return created
}

export async function quickCreateExperience(
  data: QuickCreateExperienceInput
): Promise<{ id: string } | { error: string }> {
  try {
    const validated = quickCreateExperienceSchema.parse(data)

    const user = await getOrCreateUser()
    await enforceQuotaForUser(user.id, user.email, user.plan, 'experience', user.trialEndsAt)

    const [created] = await db.insert(experiences).values({
      title: validated.title,
      category: validated.category,
      rawNotes: validated.rawNotes,
      userId: user.id,
    }).returning()

    const { userId: clerkId } = await auth()
    if (clerkId) {
      await trackEvent('experience_created', clerkId, { experienceId: created.id, source: 'onboarding' })
      await checkAndQualifyReferral(clerkId)
    }

    revalidatePath('/experiences')
    revalidatePath('/dashboard')
    return { id: created.id }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: '入力内容を確認してください' }
    }
    if (error instanceof QuotaExceededError) {
      return { error: error.message }
    }
    return { error: '経験の登録に失敗しました' }
  }
}

export async function updateExperience(
  id: string,
  data: UpdateExperienceInput
): Promise<Experience | null> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return null
  }

  // Validate input
  const validated = updateExperienceSchema.parse(data)

  const userId = await getCurrentUserId()

  // Verify ownership
  const existing = await db.query.experiences.findFirst({
    where: eq(experiences.id, validatedId.data),
  })

  if (!existing || existing.userId !== userId) {
    return null
  }

  const [updated] = await db
    .update(experiences)
    .set({
      ...validated,
      periodStart: validated.periodStart !== undefined ? normalizeDate(validated.periodStart) : undefined,
      periodEnd: validated.periodEnd !== undefined ? normalizeDate(validated.periodEnd) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(experiences.id, validatedId.data))
    .returning()

  revalidatePath('/experiences')
  revalidatePath(`/experiences/${validatedId.data}`)
  return updated
}

export async function deleteExperience(id: string): Promise<boolean> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return false
  }

  const userId = await getCurrentUserId()

  // Verify ownership
  const existing = await db.query.experiences.findFirst({
    where: eq(experiences.id, validatedId.data),
  })

  if (!existing || existing.userId !== userId) {
    return false
  }

  await db.delete(experiences).where(eq(experiences.id, validatedId.data))

  revalidatePath('/experiences')
  return true
}
