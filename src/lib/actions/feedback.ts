'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db/client'
import { feedbackSubmissions, userEntitlements } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { logger } from '@/lib/logger'
import { grantReward } from '@/lib/rewards'
import { trackEvent } from '@/lib/events'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const feedbackSchema = z.object({
  nps: z.number().min(0).max(10),
  satisfaction: z.number().min(1).max(5),
  bestFeature: z.string().optional(),
  goodText: z.string().max(1000).optional(),
  improveText: z.string().max(1000).optional(),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

/**
 * Submit feedback and grant +7 days reward
 */
export async function submitFeedback(input: FeedbackInput): Promise<{
  success: boolean
  alreadySubmitted?: boolean
  error?: string
}> {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Validate input
    const validated = feedbackSchema.parse(input)

    // Check if user already completed feedback
    const entitlement = await db.query.userEntitlements.findFirst({
      where: eq(userEntitlements.clerkId, clerkId),
    })

    if (entitlement?.surveyCompletedAt) {
      return { success: false, alreadySubmitted: true, error: 'アンケートは既に回答済みです' }
    }

    // Insert feedback
    const [feedback] = await db.insert(feedbackSubmissions).values({
      clerkId,
      nps: validated.nps,
      satisfaction: validated.satisfaction,
      bestFeature: validated.bestFeature,
      goodText: validated.goodText,
      improveText: validated.improveText,
    }).returning()

    // Mark survey as completed
    await db
      .update(userEntitlements)
      .set({
        surveyCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userEntitlements.clerkId, clerkId))

    // Grant +7 days reward (idempotent)
    await grantReward({
      clerkId,
      rewardType: 'survey_bonus',
      sourceId: feedback.id,
      days: 7,
      notes: `NPS: ${validated.nps}, Satisfaction: ${validated.satisfaction}`,
    })

    // Track event
    await trackEvent('feedback_submitted', clerkId, {
      nps: validated.nps,
      satisfaction: validated.satisfaction,
      bestFeature: validated.bestFeature,
    })

    logger.info('Feedback submitted', { clerkId, feedbackId: feedback.id })

    revalidatePath('/dashboard')
    revalidatePath('/feedback')

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: '入力内容に問題があります' }
    }
    logger.error('Failed to submit feedback', {
      clerkId,
      error: error instanceof Error ? error.message : String(error),
    })
    return { success: false, error: 'フィードバックの送信に失敗しました' }
  }
}

/**
 * Check if user has already submitted feedback
 */
export async function hasFeedbackSubmitted(): Promise<boolean> {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return false
  }

  const entitlement = await db.query.userEntitlements.findFirst({
    where: eq(userEntitlements.clerkId, clerkId),
  })

  return !!entitlement?.surveyCompletedAt
}
