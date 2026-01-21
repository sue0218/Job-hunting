'use server'

import Stripe from 'stripe'
import { stripe, isStripeConfigured, PLANS } from './config'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getOrCreateUser } from '@/lib/actions/user'
import { logger } from '@/lib/logger'

export async function createCheckoutSession(): Promise<{ url: string | null; error?: string }> {
  if (!isStripeConfigured()) {
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
    logger.error('Failed to create checkout session', error)
    return { url: null, error: 'Failed to create checkout session' }
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

    return { plan: 'free' }
  } catch (error) {
    logger.error('Failed to get subscription status', error)
    return { plan: 'free' }
  }
}
