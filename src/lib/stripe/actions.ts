'use server'

import Stripe from 'stripe'
import { stripe, isStripeConfigured, PLANS } from './config'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getOrCreateUser } from '@/lib/actions/user'
import { logger } from '@/lib/logger'

export async function createCheckoutSession(): Promise<{ url: string | null; error?: string }> {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID_STANDARD

  logger.info('Stripe config check', {
    hasSecretKey: !!secretKey,
    secretKeyPrefix: secretKey?.substring(0, 10),
    hasPriceId: !!priceId,
    priceIdValue: priceId,
    isConfigured: isStripeConfigured(),
  })

  if (!isStripeConfigured()) {
    logger.error('Stripe not configured', {
      secretKey: secretKey ? `${secretKey.substring(0, 10)}...` : 'undefined',
      priceId: priceId || 'undefined',
    })
    return { url: null, error: 'Stripe is not configured' }
  }

  try {
    const user = await getOrCreateUser()

    // Check if user already has a Stripe customer ID
    let customerId = user.stripeCustomerId

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          clerkId: user.clerkId,
        },
      })
      customerId = customer.id

      // Save customer ID to database
      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, user.id))
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS.standard.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return { url: session.url }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error('Failed to create checkout session', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { url: null, error: `Failed to create checkout session: ${errorMessage}` }
  }
}

export async function createPortalSession(): Promise<{ url: string | null; error?: string }> {
  if (!isStripeConfigured()) {
    return { url: null, error: 'Stripe is not configured' }
  }

  try {
    const user = await getOrCreateUser()

    if (!user.stripeCustomerId) {
      return { url: null, error: 'No subscription found' }
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return { url: session.url }
  } catch (error) {
    logger.error('Failed to create portal session', error)
    return { url: null, error: 'Failed to create portal session' }
  }
}

export async function getSubscriptionStatus(): Promise<{
  plan: 'free' | 'standard'
  status?: string
  currentPeriodEnd?: Date
}> {
  try {
    const user = await getOrCreateUser()

    // If we have subscription info in DB, check it
    if (user.plan === 'standard' && user.stripeSubscriptionId) {
      if (isStripeConfigured()) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
          expand: ['latest_invoice'],
        })
        const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null
        return {
          plan: 'standard',
          status: subscription.status,
          currentPeriodEnd: latestInvoice?.period_end
            ? new Date(latestInvoice.period_end * 1000)
            : undefined,
        }
      }
      return { plan: 'standard' }
    }

    // If DB says 'free' but user has a Stripe customer ID, check Stripe directly
    // This handles cases where webhook didn't update the DB
    if (user.stripeCustomerId && isStripeConfigured()) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1,
      })

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0]

        // Sync to database (webhook might have failed)
        await db
          .update(users)
          .set({
            plan: 'standard',
            stripeSubscriptionId: subscription.id,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))

        logger.info('Synced subscription status from Stripe', {
          userId: user.id,
          subscriptionId: subscription.id,
        })

        // Get period end from the first item
        const firstItem = subscription.items?.data?.[0]
        return {
          plan: 'standard',
          status: subscription.status,
          currentPeriodEnd: firstItem?.current_period_end
            ? new Date(firstItem.current_period_end * 1000)
            : undefined,
        }
      }
    }

    return { plan: 'free' }
  } catch (error) {
    logger.error('Failed to get subscription status', error)
    return { plan: 'free' }
  }
}

/**
 * Manually sync subscription status from Stripe
 * Use this if webhook didn't properly update the database
 */
export async function syncSubscriptionFromStripe(): Promise<{
  success: boolean
  plan: 'free' | 'standard'
  message: string
}> {
  if (!isStripeConfigured()) {
    return { success: false, plan: 'free', message: 'Stripe is not configured' }
  }

  try {
    const user = await getOrCreateUser()

    if (!user.stripeCustomerId) {
      return { success: true, plan: 'free', message: 'No Stripe customer ID' }
    }

    // Get all active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0]

      await db
        .update(users)
        .set({
          plan: 'standard',
          stripeSubscriptionId: subscription.id,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))

      logger.info('Manual subscription sync: upgraded to standard', {
        userId: user.id,
        subscriptionId: subscription.id,
      })

      return {
        success: true,
        plan: 'standard',
        message: `Subscription synced: ${subscription.id}`,
      }
    } else {
      // No active subscription, ensure we're on free
      if (user.plan === 'standard') {
        await db
          .update(users)
          .set({
            plan: 'free',
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))

        logger.info('Manual subscription sync: downgraded to free', {
          userId: user.id,
        })
      }

      return { success: true, plan: 'free', message: 'No active subscription found' }
    }
  } catch (error) {
    logger.error('Failed to sync subscription from Stripe', error)
    return {
      success: false,
      plan: 'free',
      message: error instanceof Error ? error.message : 'Sync failed',
    }
  }
}
