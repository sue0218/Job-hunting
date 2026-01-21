import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/config'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { logger } from '@/lib/logger'

// Simple in-memory idempotency store
// In production, use Redis or database for persistence across instances
const processedEvents = new Map<string, number>()
const EVENT_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function cleanupOldEvents() {
  const now = Date.now()
  for (const [eventId, timestamp] of processedEvents.entries()) {
    if (now - timestamp > EVENT_TTL_MS) {
      processedEvents.delete(eventId)
    }
  }
}

function isEventProcessed(eventId: string): boolean {
  // Cleanup old events periodically (1% chance per request)
  if (Math.random() < 0.01) {
    cleanupOldEvents()
  }
  return processedEvents.has(eventId)
}

function markEventProcessed(eventId: string): void {
  processedEvents.set(eventId, Date.now())
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || webhookSecret === 'whsec_xxxxx') {
    logger.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    logger.error('Webhook signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotency check - skip if already processed
  if (isEventProcessed(event.id)) {
    logger.info('Skipping already processed event', { eventId: event.id, type: event.type })
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          const customerId = session.customer as string

          // Find user by Stripe customer ID and update plan
          await db
            .update(users)
            .set({
              plan: 'standard',
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, customerId))

          logger.info('User upgraded to standard plan', { customerId })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Update subscription status
        if (subscription.status === 'active') {
          await db
            .update(users)
            .set({
              plan: 'standard',
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, customerId))
          logger.info('Subscription activated', { customerId, subscriptionId: subscription.id })
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await db
            .update(users)
            .set({
              plan: 'free',
              updatedAt: new Date(),
            })
            .where(eq(users.stripeCustomerId, customerId))
          logger.info('Subscription deactivated', { customerId, status: subscription.status })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Downgrade to free plan
        await db
          .update(users)
          .set({
            plan: 'free',
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(users.stripeCustomerId, customerId))

        logger.info('User downgraded to free plan', { customerId })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        logger.warn('Payment failed for customer', { customerId, invoiceId: invoice.id })
        // Optionally send notification to user
        break
      }
    }

    // Mark event as processed after successful handling
    markEventProcessed(event.id)

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook handler error', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
