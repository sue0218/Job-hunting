'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db/client'
import {
  betaCampaigns,
  feedbackSubmissions,
  referrals,
  userEntitlements,
  eventLogs,
  rewardsLedger,
} from '@/lib/db/schema'
import { eq, sql, desc, and, gte } from 'drizzle-orm'
import { isAdminEmail } from '@/lib/config/admin'
import { logger } from '@/lib/logger'

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress
  return isAdminEmail(email)
}

/**
 * Get comprehensive admin stats
 */
export async function getAdminStats() {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return null
  }

  try {
    // Beta campaign stats
    const campaign = await db.query.betaCampaigns.findFirst({
      where: eq(betaCampaigns.key, process.env.BETA_CAMPAIGN_KEY || 'beta_standard_300_30d'),
    })

    // Feedback stats
    const feedbackStats = await db
      .select({
        total: sql<number>`count(*)`,
        avgNps: sql<number>`avg(nps)`,
        avgSatisfaction: sql<number>`avg(satisfaction)`,
      })
      .from(feedbackSubmissions)

    // Referral stats
    const referralStats = await db
      .select({
        total: sql<number>`count(*)`,
        pending: sql<number>`count(*) filter (where status = 'pending')`,
        qualified: sql<number>`count(*) filter (where status = 'qualified')`,
        rewarded: sql<number>`count(*) filter (where status = 'rewarded')`,
      })
      .from(referrals)

    // User entitlements stats
    const entitlementStats = await db
      .select({
        total: sql<number>`count(*)`,
        withTrial: sql<number>`count(*) filter (where trial_ends_at > NOW())`,
        withSurvey: sql<number>`count(*) filter (where survey_completed_at IS NOT NULL)`,
        fromReferral: sql<number>`count(*) filter (where invited_by_code IS NOT NULL)`,
      })
      .from(userEntitlements)

    // Rewards granted by type
    const rewardStats = await db
      .select({
        rewardType: rewardsLedger.rewardType,
        count: sql<number>`count(*)`,
        totalDays: sql<number>`sum(days)`,
      })
      .from(rewardsLedger)
      .groupBy(rewardsLedger.rewardType)

    // Recent events (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentEvents = await db
      .select({
        eventType: eventLogs.eventType,
        count: sql<number>`count(*)`,
      })
      .from(eventLogs)
      .where(gte(eventLogs.createdAt, sevenDaysAgo))
      .groupBy(eventLogs.eventType)
      .orderBy(desc(sql`count(*)`))

    return {
      campaign: campaign
        ? {
            enabled: campaign.enabled,
            maxSlots: campaign.maxSlots,
            claimedSlots: campaign.claimedSlots,
            remainingSlots: Math.max(0, campaign.maxSlots - campaign.claimedSlots),
          }
        : null,
      feedback: feedbackStats[0] ?? { total: 0, avgNps: 0, avgSatisfaction: 0 },
      referrals: referralStats[0] ?? { total: 0, pending: 0, qualified: 0, rewarded: 0 },
      entitlements: entitlementStats[0] ?? { total: 0, withTrial: 0, withSurvey: 0, fromReferral: 0 },
      rewards: rewardStats.reduce(
        (acc, r) => ({
          ...acc,
          [r.rewardType]: { count: Number(r.count), totalDays: Number(r.totalDays) },
        }),
        {} as Record<string, { count: number; totalDays: number }>
      ),
      recentEvents: recentEvents.map((e) => ({
        eventType: e.eventType,
        count: Number(e.count),
      })),
    }
  } catch (error) {
    logger.error('Failed to get admin stats', { error })
    return null
  }
}

/**
 * Get recent feedback submissions for review
 */
export async function getRecentFeedback(limit: number = 20) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return []
  }

  try {
    return await db.query.feedbackSubmissions.findMany({
      orderBy: [desc(feedbackSubmissions.createdAt)],
      limit,
    })
  } catch (error) {
    logger.error('Failed to get recent feedback', { error })
    return []
  }
}

/**
 * Get recent referrals
 */
export async function getRecentReferrals(limit: number = 20) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return []
  }

  try {
    return await db.query.referrals.findMany({
      orderBy: [desc(referrals.createdAt)],
      limit,
    })
  } catch (error) {
    logger.error('Failed to get recent referrals', { error })
    return []
  }
}

/**
 * Toggle beta campaign enabled status
 */
export async function toggleBetaCampaign(): Promise<{ success: boolean; enabled?: boolean }> {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false }
  }

  try {
    const campaignKey = process.env.BETA_CAMPAIGN_KEY || 'beta_standard_300_30d'
    const campaign = await db.query.betaCampaigns.findFirst({
      where: eq(betaCampaigns.key, campaignKey),
    })

    if (!campaign) {
      return { success: false }
    }

    const [updated] = await db
      .update(betaCampaigns)
      .set({ enabled: !campaign.enabled })
      .where(eq(betaCampaigns.key, campaignKey))
      .returning()

    return { success: true, enabled: updated.enabled }
  } catch (error) {
    logger.error('Failed to toggle beta campaign', { error })
    return { success: false }
  }
}
