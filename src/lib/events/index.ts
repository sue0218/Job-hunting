'use server'

import { db } from '@/lib/db/client'
import { eventLogs } from '@/lib/db/schema'
import { logger } from '@/lib/logger'

// Event types for type safety
export type EventType =
  // Beta campaign events
  | 'beta_enrolled'
  | 'beta_slot_full'
  // Feedback events
  | 'feedback_submitted'
  | 'feedback_reward_granted'
  // Referral events
  | 'referral_link_created'
  | 'referral_signup'
  | 'referral_qualified'
  | 'referral_rewarded'
  // Usage events
  | 'experience_created'
  | 'es_generated'
  | 'interview_started'
  | 'interview_completed'
  // Auth events
  | 'user_signup'
  | 'user_login'
  // Subscription events
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'trial_started'
  | 'trial_expired'

/**
 * Track an event to the event_logs table
 * Non-blocking - errors are logged but don't throw
 */
export async function trackEvent(
  eventType: EventType,
  clerkId?: string | null,
  properties?: Record<string, unknown>
): Promise<void> {
  try {
    await db.insert(eventLogs).values({
      userId: clerkId ?? undefined,
      eventType,
      eventData: properties ?? {},
    })
  } catch (error) {
    // Log but don't throw - event tracking should never break the app
    logger.error('Failed to track event', {
      eventType,
      clerkId,
      properties,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Track multiple events in a batch
 */
export async function trackEvents(
  events: Array<{
    eventType: EventType
    clerkId?: string | null
    properties?: Record<string, unknown>
  }>
): Promise<void> {
  try {
    await db.insert(eventLogs).values(
      events.map(e => ({
        userId: e.clerkId ?? undefined,
        eventType: e.eventType,
        eventData: e.properties ?? {},
      }))
    )
  } catch (error) {
    logger.error('Failed to track batch events', {
      count: events.length,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
