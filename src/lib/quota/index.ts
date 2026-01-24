'use server'

import { getOrCreateUser } from '@/lib/actions/user'
import {
  checkQuotaForUser,
  enforceQuotaForUser,
  getQuotaStatusForUser,
} from './service'
import type { QuotaType, QuotaCheckResult } from './types'

// Re-export types
export { QuotaExceededError, type QuotaType, type QuotaCheckResult } from './types'

/**
 * Check if current user can perform a quota-limited action
 */
export async function checkQuota(quotaType: QuotaType): Promise<QuotaCheckResult> {
  const user = await getOrCreateUser()
  return checkQuotaForUser(user.id, user.email, user.plan, quotaType, user.trialEndsAt)
}

/**
 * Enforce quota for current user - throws QuotaExceededError if limit reached
 */
export async function enforceQuota(quotaType: QuotaType): Promise<void> {
  const user = await getOrCreateUser()
  return enforceQuotaForUser(user.id, user.email, user.plan, quotaType, user.trialEndsAt)
}

/**
 * Get all quota information for current user (dashboard display)
 */
export async function getQuotaStatus(): Promise<{
  plan: 'free' | 'standard'
  experiences: QuotaCheckResult
  esGenerations: QuotaCheckResult
  interviewSessions: QuotaCheckResult
}> {
  const user = await getOrCreateUser()
  return getQuotaStatusForUser(user.id, user.email, user.plan, user.trialEndsAt)
}
