'use server'

import { db } from '@/lib/db/client'
import { rewardsLedger, userEntitlements } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { logger } from '@/lib/logger'
import { trackEvent } from '@/lib/events'

// Reward types
export type RewardType = 'beta_enroll' | 'survey_bonus' | 'referral_bonus'

interface GrantRewardParams {
  clerkId: string
  rewardType: RewardType
  sourceId: string
  days: number
  notes?: string
}

interface GrantRewardResult {
  granted: boolean
  alreadyExists: boolean
  error?: string
}

/**
 * Grant a reward to a user (idempotent via unique constraint)
 * Automatically extends the trial period
 */
export async function grantReward(params: GrantRewardParams): Promise<GrantRewardResult> {
  const { clerkId, rewardType, sourceId, days, notes } = params

  try {
    // Try to insert - unique constraint will prevent duplicates
    await db.insert(rewardsLedger).values({
      clerkId,
      rewardType,
      sourceId,
      days,
      notes,
    })

    // Extend trial period
    await extendTrial(clerkId, days, rewardType)

    // Track the event
    await trackEvent(
      rewardType === 'beta_enroll' ? 'beta_enrolled' :
      rewardType === 'survey_bonus' ? 'feedback_reward_granted' :
      'referral_rewarded',
      clerkId,
      { days, sourceId }
    )

    logger.info('Reward granted', { clerkId, rewardType, sourceId, days })

    return { granted: true, alreadyExists: false }
  } catch (error) {
    // Check if it's a unique constraint violation
    if (isUniqueViolation(error)) {
      logger.info('Reward already exists (idempotent)', { clerkId, rewardType, sourceId })
      return { granted: false, alreadyExists: true }
    }

    logger.error('Failed to grant reward', {
      error: error instanceof Error ? error.message : String(error),
      params,
    })

    return {
      granted: false,
      alreadyExists: false,
      error: error instanceof Error ? error.message : 'Failed to grant reward',
    }
  }
}

/**
 * Extend user's trial period by specified days
 */
async function extendTrial(clerkId: string, days: number, source: string): Promise<void> {
  // Check if user entitlement exists
  const existing = await db.query.userEntitlements.findFirst({
    where: eq(userEntitlements.clerkId, clerkId),
  })

  if (!existing) {
    // This shouldn't happen if user was properly initialized
    logger.warn('User entitlement not found, cannot extend trial', { clerkId })
    return
  }

  const now = new Date()
  const currentTrialEnd = existing.trialEndsAt ? new Date(existing.trialEndsAt) : null

  let newTrialEnd: Date

  if (!currentTrialEnd || currentTrialEnd < now) {
    // No active trial or expired - start from now
    newTrialEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  } else {
    // Active trial - extend from current end
    newTrialEnd = new Date(currentTrialEnd.getTime() + days * 24 * 60 * 60 * 1000)
  }

  await db
    .update(userEntitlements)
    .set({
      trialEndsAt: newTrialEnd,
      trialSource: source,
      updatedAt: new Date(),
    })
    .where(eq(userEntitlements.clerkId, clerkId))

  logger.info('Trial extended', { clerkId, days, newTrialEnd: newTrialEnd.toISOString() })
}

/**
 * Check if error is a unique constraint violation
 */
function isUniqueViolation(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>
    // PostgreSQL unique violation code
    if (err.code === '23505') return true
    // Check message patterns
    if (typeof err.message === 'string') {
      const msg = err.message.toLowerCase()
      if (msg.includes('unique') || msg.includes('duplicate')) return true
    }
  }
  return false
}

/**
 * Get total reward days for a user
 */
export async function getTotalRewardDays(clerkId: string): Promise<number> {
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(days), 0)`,
    })
    .from(rewardsLedger)
    .where(eq(rewardsLedger.clerkId, clerkId))

  return result[0]?.total ?? 0
}

/**
 * Get all rewards for a user
 */
export async function getUserRewards(clerkId: string) {
  return db.query.rewardsLedger.findMany({
    where: eq(rewardsLedger.clerkId, clerkId),
    orderBy: (rewards, { desc }) => [desc(rewards.grantedAt)],
  })
}
