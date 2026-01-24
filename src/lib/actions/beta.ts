'use server'

import { db } from '@/lib/db/client'
import { betaCampaigns, userEntitlements, rewardsLedger } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { logger } from '@/lib/logger'
import { grantReward } from '@/lib/rewards'
import { trackEvent } from '@/lib/events'
import { nanoid } from 'nanoid'

const BETA_CAMPAIGN_KEY = process.env.BETA_CAMPAIGN_KEY || 'beta_standard_300_30d'

/**
 * Get beta campaign status (public)
 */
export async function getBetaCampaignStatus() {
  try {
    const campaign = await db.query.betaCampaigns.findFirst({
      where: eq(betaCampaigns.key, BETA_CAMPAIGN_KEY),
    })

    if (!campaign) {
      return {
        enabled: false,
        remainingSlots: 0,
        maxSlots: 0,
        claimedSlots: 0,
      }
    }

    return {
      enabled: campaign.enabled,
      remainingSlots: Math.max(0, campaign.maxSlots - campaign.claimedSlots),
      maxSlots: campaign.maxSlots,
      claimedSlots: campaign.claimedSlots,
    }
  } catch (error) {
    logger.error('Failed to get beta campaign status', { error })
    return {
      enabled: false,
      remainingSlots: 0,
      maxSlots: 0,
      claimedSlots: 0,
    }
  }
}

/**
 * Claim a beta slot for the current user
 * Called after user signs up through the beta page
 */
export async function claimBetaSlot(): Promise<{
  success: boolean
  alreadyClaimed?: boolean
  error?: string
}> {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Use transaction for race condition safety
    return await db.transaction(async (tx) => {
      // 1. Check if already claimed (idempotent)
      const existing = await tx.query.rewardsLedger.findFirst({
        where: and(
          eq(rewardsLedger.clerkId, clerkId),
          eq(rewardsLedger.rewardType, 'beta_enroll'),
          eq(rewardsLedger.sourceId, BETA_CAMPAIGN_KEY)
        ),
      })

      if (existing) {
        return { success: true, alreadyClaimed: true }
      }

      // 2. Check campaign availability with row lock
      const [campaign] = await tx
        .select()
        .from(betaCampaigns)
        .where(eq(betaCampaigns.key, BETA_CAMPAIGN_KEY))
        .for('update')

      if (!campaign || !campaign.enabled) {
        await trackEvent('beta_slot_full', clerkId, { reason: 'disabled' })
        return { success: false, error: 'キャンペーンは終了しました' }
      }

      if (campaign.claimedSlots >= campaign.maxSlots) {
        await trackEvent('beta_slot_full', clerkId, { reason: 'full' })
        return { success: false, error: '先着枠は満員になりました' }
      }

      // Check date range if set
      const now = new Date()
      if (campaign.startsAt && now < new Date(campaign.startsAt)) {
        return { success: false, error: 'キャンペーンはまだ開始されていません' }
      }
      if (campaign.endsAt && now > new Date(campaign.endsAt)) {
        return { success: false, error: 'キャンペーンは終了しました' }
      }

      // 3. Claim the slot
      await tx
        .update(betaCampaigns)
        .set({ claimedSlots: sql`claimed_slots + 1` })
        .where(eq(betaCampaigns.key, BETA_CAMPAIGN_KEY))

      // 4. Grant reward (30 days) - this will also extend trial
      const result = await grantReward({
        clerkId,
        rewardType: 'beta_enroll',
        sourceId: BETA_CAMPAIGN_KEY,
        days: 30,
        notes: 'Beta campaign enrollment',
      })

      if (!result.granted && !result.alreadyExists) {
        throw new Error(result.error || 'Failed to grant reward')
      }

      logger.info('Beta slot claimed', { clerkId, campaignKey: BETA_CAMPAIGN_KEY })

      return { success: true }
    })
  } catch (error) {
    logger.error('Failed to claim beta slot', {
      clerkId,
      error: error instanceof Error ? error.message : String(error),
    })
    return {
      success: false,
      error: 'ベータ登録に失敗しました。もう一度お試しください。',
    }
  }
}

/**
 * Initialize user entitlement record (called on first login)
 */
export async function initializeUserEntitlement(clerkId: string): Promise<void> {
  try {
    // Check if already exists
    const existing = await db.query.userEntitlements.findFirst({
      where: eq(userEntitlements.clerkId, clerkId),
    })

    if (existing) {
      return // Already initialized
    }

    // Generate unique invite code (8 characters)
    const inviteCode = nanoid(8).toUpperCase()

    await db.insert(userEntitlements).values({
      clerkId,
      inviteCode,
    })

    logger.info('User entitlement initialized', { clerkId, inviteCode })
  } catch (error) {
    logger.error('Failed to initialize user entitlement', {
      clerkId,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get user's entitlement info
 */
export async function getUserEntitlement() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return null
  }

  try {
    return await db.query.userEntitlements.findFirst({
      where: eq(userEntitlements.clerkId, clerkId),
    })
  } catch (error) {
    logger.error('Failed to get user entitlement', { clerkId, error })
    return null
  }
}

/**
 * Check if user should auto-enroll in beta on first login
 */
export async function checkAndEnrollBeta(): Promise<{
  enrolled: boolean
  alreadyEnrolled: boolean
}> {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return { enrolled: false, alreadyEnrolled: false }
  }

  // Initialize entitlement if not exists
  await initializeUserEntitlement(clerkId)

  // Check beta campaign status
  const campaign = await getBetaCampaignStatus()
  if (!campaign.enabled || campaign.remainingSlots <= 0) {
    return { enrolled: false, alreadyEnrolled: false }
  }

  // Try to claim
  const result = await claimBetaSlot()

  if (result.alreadyClaimed) {
    return { enrolled: false, alreadyEnrolled: true }
  }

  return { enrolled: result.success, alreadyEnrolled: false }
}
