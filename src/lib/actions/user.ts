'use server'

import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { stripe, isStripeConfigured } from '@/lib/stripe/config'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'

export async function getOrCreateUser() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  // Check if user exists
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  })

  if (existing) {
    return existing
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

  return newUser
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
