'use server'

import { db } from '@/lib/db/client'
import { esDocuments, type EsDocument } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getCurrentUserId, getOrCreateUser } from './user'
import { revalidatePath } from 'next/cache'
import {
  createEsDocumentSchema,
  updateEsDocumentSchema,
  uuidSchema,
  type CreateEsDocumentInput,
  type UpdateEsDocumentInput,
} from '@/lib/validations'
import { enforceQuotaForUser } from '@/lib/quota/service'
import { checkAndQualifyReferral } from './referral'
import { trackEvent } from '@/lib/events'
import { auth } from '@clerk/nextjs/server'

export async function getEsDocuments(): Promise<EsDocument[]> {
  const userId = await getCurrentUserId()

  return db.query.esDocuments.findMany({
    where: eq(esDocuments.userId, userId),
    orderBy: [desc(esDocuments.updatedAt)],
  })
}

export async function getEsDocument(id: string): Promise<EsDocument | null> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return null
  }

  const userId = await getCurrentUserId()

  const result = await db.query.esDocuments.findFirst({
    where: eq(esDocuments.id, validatedId.data),
  })

  if (!result || result.userId !== userId) {
    return null
  }

  return result
}

export async function createEsDocument(data: CreateEsDocumentInput): Promise<EsDocument> {
  // Validate input
  const validated = createEsDocumentSchema.parse(data)

  // Get user and check quota before creating
  const user = await getOrCreateUser()
  await enforceQuotaForUser(user.id, user.email, user.plan, 'es_generation', user.trialEndsAt)

  const userId = user.id

  const [created] = await db.insert(esDocuments).values({
    ...validated,
    userId,
  }).returning()

  // Track event and check referral milestone
  const { userId: clerkId } = await auth()
  if (clerkId) {
    await trackEvent('es_generated', clerkId, { esId: created.id })
    // Check if referral milestone is now met (experience + ES)
    await checkAndQualifyReferral(clerkId)
  }

  revalidatePath('/es')
  return created
}

export async function updateEsDocument(
  id: string,
  data: UpdateEsDocumentInput
): Promise<EsDocument | null> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return null
  }

  // Validate input
  const validated = updateEsDocumentSchema.parse(data)

  const userId = await getCurrentUserId()

  // Verify ownership
  const existing = await db.query.esDocuments.findFirst({
    where: eq(esDocuments.id, validatedId.data),
  })

  if (!existing || existing.userId !== userId) {
    return null
  }

  const [updated] = await db
    .update(esDocuments)
    .set({
      ...validated,
      updatedAt: new Date(),
    })
    .where(eq(esDocuments.id, validatedId.data))
    .returning()

  revalidatePath('/es')
  revalidatePath(`/es/${validatedId.data}`)
  return updated
}

export async function deleteEsDocument(id: string): Promise<boolean> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return false
  }

  const userId = await getCurrentUserId()

  // Verify ownership
  const existing = await db.query.esDocuments.findFirst({
    where: eq(esDocuments.id, validatedId.data),
  })

  if (!existing || existing.userId !== userId) {
    return false
  }

  await db.delete(esDocuments).where(eq(esDocuments.id, validatedId.data))

  revalidatePath('/es')
  return true
}
