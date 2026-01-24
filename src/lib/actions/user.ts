'use server'

import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db/client'
import { users, userEntitlements } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { stripe, isStripeConfigured } from '@/lib/stripe/config'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'
import { initializeUserEntitlement, checkAndEnrollBeta } from './beta'
import { bindReferral } from './referral'
import { trackEvent } from '@/lib/events'

export type UserWithEntitlement = {
  id: string
  clerkId: string
  email: string
  name: string | null
  plan: 'free' | 'standard'
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
  trialEndsAt: Date | null
}

export async function getOrCreateUser(): Promise<UserWithEntitlement> {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  // Check if user exists
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  })

  if (existing) {
    // Also get entitlement for trialEndsAt
    const entitlement = await db.query.userEntitlements.findFirst({
      where: eq(userEntitlements.clerkId, clerkId),
    })
    return {
      ...existing,
      plan: existing.plan as 'free' | 'standard',
      trialEndsAt: entitlement?.trialEndsAt ?? null,
    }
  }

  // Create new user
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses[0]?.emailAddress || ''
  const name = clerkUser?.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
    : null

  const [newUser] = await db.insert(users).values({
    clerkId,
    email,
    name,
  }).returning()

  // Initialize user entitlement (invite code, etc.)
  await initializeUserEntitlement(clerkId)

  // Track signup event
  await trackEvent('user_signup', clerkId, { email })

  // Bind referral if invite code cookie exists
  const referralResult = await bindReferral()
  if (referralResult.success && referralResult.inviterCode) {
    logger.info('New user referred by', { clerkId, inviterCode: referralResult.inviterCode })
  }

  // Auto-enroll in beta if slots available
  const betaResult = await checkAndEnrollBeta()
  if (betaResult.enrolled) {
    logger.info('New user auto-enrolled in beta', { clerkId })
    await trackEvent('beta_enrolled', clerkId, { source: 'auto_enroll' })
  }

  // Get entitlement for trialEndsAt (might have been set by beta enrollment)
  const entitlement = await db.query.userEntitlements.findFirst({
    where: eq(userEntitlements.clerkId, clerkId),
  })

  return {
    ...newUser,
    plan: newUser.plan as 'free' | 'standard',
    trialEndsAt: entitlement?.trialEndsAt ?? null,
  }
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getOrCreateUser()
  return user.id
}

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Cancel Stripe subscription if exists
    if (user.stripeSubscriptionId && isStripeConfigured()) {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId)
        logger.info('Stripe subscription canceled for account deletion', {
          userId: user.id,
          subscriptionId: user.stripeSubscriptionId,
        })
      } catch (stripeError) {
        logger.error('Failed to cancel Stripe subscription during account deletion', stripeError)
        // Continue with deletion even if Stripe cancellation fails
      }
    }

    // Delete user from database (cascade delete handles related records via foreign keys)
    // This will delete: experiences, esDocuments, interviewSessions,
    // interviewTurns, consistencyChecks, quotaUsage
    await db.delete(users).where(eq(users.id, user.id))

    // Delete user from Clerk
    try {
      const clerk = await clerkClient()
      await clerk.users.deleteUser(clerkId)
      logger.info('Clerk user deleted', { clerkId })
    } catch (clerkError) {
      // Log but don't fail - DB user is already deleted
      logger.error('Failed to delete Clerk user', clerkError)
    }

    logger.info('User account deleted', { userId: user.id, clerkId })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    logger.error('Failed to delete account', error)
    return { success: false, error: 'アカウントの削除に失敗しました' }
  }
}

export async function completeOnboarding(): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, error: 'Not authenticated' }
    }

    await db
      .update(users)
      .set({ onboardingCompleted: true, updatedAt: new Date() })
      .where(eq(users.clerkId, clerkId))

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    logger.error('Failed to complete onboarding', error)
    return { success: false, error: 'オンボーディングの完了に失敗しました' }
  }
}
