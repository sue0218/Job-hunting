'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db/client'
import { referrals, userEntitlements, experiences, esDocuments, rewardsLedger } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { logger } from '@/lib/logger'
import { grantReward } from '@/lib/rewards'
import { trackEvent } from '@/lib/events'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { initializeUserEntitlement } from './beta'

const MAX_REFERRAL_BONUS = 5 // Maximum referrals that grant bonus

/**
 * Store invite code in cookie for later binding
 */
export async function storeInviteCode(code: string) {
  const cookieStore = await cookies()
  cookieStore.set('pending_invite_code', code, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

/**
 * Bind referral after signup (called during user initialization)
 */
export async function bindReferral(): Promise<{
  success: boolean
  inviterCode?: string
  error?: string
}> {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const cookieStore = await cookies()
    const inviteCode = cookieStore.get('pending_invite_code')?.value

    if (!inviteCode) {
      return { success: false, error: 'No invite code found' }
    }

    // Check if already referred
    const existingReferral = await db.query.referrals.findFirst({
      where: eq(referrals.referredClerkId, clerkId),
    })

    if (existingReferral) {
      // Clear cookie since user is already referred
      cookieStore.delete('pending_invite_code')
      return { success: true, inviterCode: existingReferral.inviteCode }
    }

    // Find the inviter by invite code
    const inviter = await db.query.userEntitlements.findFirst({
      where: eq(userEntitlements.inviteCode, inviteCode),
    })

    if (!inviter) {
      cookieStore.delete('pending_invite_code')
      return { success: false, error: 'Invalid invite code' }
    }

    // Don't allow self-referral
    if (inviter.clerkId === clerkId) {
      cookieStore.delete('pending_invite_code')
      return { success: false, error: 'Cannot refer yourself' }
    }

    // Create referral record
    await db.insert(referrals).values({
      inviterClerkId: inviter.clerkId,
      inviteCode,
      referredClerkId: clerkId,
      status: 'pending',
    })

    // Update user entitlement with invitedByCode
    await db
      .update(userEntitlements)
      .set({
        invitedByCode: inviteCode,
        updatedAt: new Date(),
      })
      .where(eq(userEntitlements.clerkId, clerkId))

    // Track event
    await trackEvent('referral_signup', clerkId, { inviteCode, inviterClerkId: inviter.clerkId })

    // Clear cookie
    cookieStore.delete('pending_invite_code')

    logger.info('Referral bound', { clerkId, inviteCode, inviterClerkId: inviter.clerkId })

    return { success: true, inviterCode: inviteCode }
  } catch (error) {
    logger.error('Failed to bind referral', {
      clerkId,
      error: error instanceof Error ? error.message : String(error),
    })
    return { success: false, error: 'Failed to bind referral' }
  }
}

/**
 * Check and qualify referral when milestones are met
 * Called after experience creation or ES creation
 */
export async function checkAndQualifyReferral(clerkId: string): Promise<void> {
  try {
    // Find pending referral for this user
    const referral = await db.query.referrals.findFirst({
      where: and(
        eq(referrals.referredClerkId, clerkId),
        eq(referrals.status, 'pending')
      ),
    })

    if (!referral) {
      return // No pending referral
    }

    // Check milestone M1: At least 1 experience
    const experienceResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(experiences)
      .innerJoin(userEntitlements, eq(experiences.userId, userEntitlements.clerkId))
      .where(eq(userEntitlements.clerkId, clerkId))

    // Actually we need to check by user ID from the users table
    // Let's simplify - check via entitlement's clerkId
    const userExperiences = await db.query.experiences.findMany({
      where: sql`user_id IN (SELECT id FROM users WHERE clerk_id = ${clerkId})`,
      limit: 1,
    })

    if (userExperiences.length < 1) {
      return // M1 not met
    }

    // Check milestone M2: At least 1 ES
    const userEs = await db.query.esDocuments.findMany({
      where: sql`user_id IN (SELECT id FROM users WHERE clerk_id = ${clerkId})`,
      limit: 1,
    })

    if (userEs.length < 1) {
      return // M2 not met
    }

    // Both milestones met - qualify the referral
    await db
      .update(referrals)
      .set({
        status: 'qualified',
        qualifiedAt: new Date(),
      })
      .where(eq(referrals.id, referral.id))

    // Track event
    await trackEvent('referral_qualified', clerkId, { referralId: referral.id })

    // Check if inviter has reached max bonus
    const inviterBonusCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(rewardsLedger)
      .where(and(
        eq(rewardsLedger.clerkId, referral.inviterClerkId),
        eq(rewardsLedger.rewardType, 'referral_bonus')
      ))

    const inviterCount = inviterBonusCount[0]?.count ?? 0

    if (inviterCount < MAX_REFERRAL_BONUS) {
      // Grant reward to inviter (+7 days)
      await grantReward({
        clerkId: referral.inviterClerkId,
        rewardType: 'referral_bonus',
        sourceId: clerkId, // Use referred user's ID as source
        days: 7,
        notes: `Referral from ${clerkId}`,
      })
    }

    // Grant reward to referred user (+7 days)
    await grantReward({
      clerkId,
      rewardType: 'referral_bonus',
      sourceId: referral.inviterClerkId,
      days: 7,
      notes: `Referred by ${referral.inviterClerkId}`,
    })

    // Update referral status to rewarded
    await db
      .update(referrals)
      .set({ status: 'rewarded' })
      .where(eq(referrals.id, referral.id))

    // Track event
    await trackEvent('referral_rewarded', clerkId, {
      referralId: referral.id,
      inviterClerkId: referral.inviterClerkId,
    })

    logger.info('Referral rewarded', {
      referralId: referral.id,
      referredClerkId: clerkId,
      inviterClerkId: referral.inviterClerkId,
    })
  } catch (error) {
    logger.error('Failed to check/qualify referral', {
      clerkId,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get user's invite stats
 */
export async function getInviteStats() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return null
  }

  try {
    let entitlement = await db.query.userEntitlements.findFirst({
      where: eq(userEntitlements.clerkId, clerkId),
    })

    // Auto-initialize entitlement for existing users
    if (!entitlement) {
      await initializeUserEntitlement(clerkId)
      entitlement = await db.query.userEntitlements.findFirst({
        where: eq(userEntitlements.clerkId, clerkId),
      })
      if (!entitlement) {
        return null
      }
    }

    // Count referrals
    const referralStats = await db
      .select({
        total: sql<number>`count(*)`,
        qualified: sql<number>`count(*) filter (where status IN ('qualified', 'rewarded'))`,
        rewarded: sql<number>`count(*) filter (where status = 'rewarded')`,
      })
      .from(referrals)
      .where(eq(referrals.inviterClerkId, clerkId))

    const stats = referralStats[0] ?? { total: 0, qualified: 0, rewarded: 0 }

    return {
      inviteCode: entitlement.inviteCode,
      totalReferrals: Number(stats.total),
      qualifiedReferrals: Number(stats.qualified),
      rewardedReferrals: Number(stats.rewarded),
      remainingBonusSlots: Math.max(0, MAX_REFERRAL_BONUS - Number(stats.rewarded)),
    }
  } catch (error) {
    logger.error('Failed to get invite stats', { clerkId, error })
    return null
  }
}
