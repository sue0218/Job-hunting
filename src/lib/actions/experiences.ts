'use server'

import { db } from '@/lib/db/client'
import { experiences, type Experience } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getCurrentUserId, getOrCreateUser } from './user'
import { revalidatePath } from 'next/cache'
import {
  createExperienceSchema,
  updateExperienceSchema,
  uuidSchema,
  type CreateExperienceInput,
  type UpdateExperienceInput,
} from '@/lib/validations'
import { enforceQuotaForUser } from '@/lib/quota/service'
import { QuotaExceededError } from '@/lib/quota/types'

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
  await enforceQuotaForUser(user.id, user.email, user.plan, 'experience')

  const userId = user.id

  const [created] = await db.insert(experiences).values({
    ...validated,
    periodStart: normalizeDate(validated.periodStart),
    periodEnd: normalizeDate(validated.periodEnd),
    userId,
  }).returning()

  revalidatePath('/experiences')
  return created
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
