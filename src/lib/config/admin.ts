// Admin and Premium User Configuration

// Admin emails - loaded from environment variable
// Set ADMIN_EMAILS in .env.local as comma-separated list: "admin1@example.com,admin2@example.com"
export const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS
      .replace(/\\n/g, '') // Remove literal \n if present
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0)
  : []

// Check if an email is an admin
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Get user's effective plan based on email, subscription, and trial status
export function getEffectivePlan(
  email: string | null | undefined,
  dbPlan: string = 'free',
  trialEndsAt: Date | null = null
): 'free' | 'standard' {
  // 1. Admins always get standard plan (highest priority)
  if (isAdminEmail(email)) {
    return 'standard'
  }

  // 2. Active Stripe subscription
  if (dbPlan === 'standard') {
    return 'standard'
  }

  // 3. Active trial period
  if (trialEndsAt && new Date(trialEndsAt) > new Date()) {
    return 'standard'
  }

  return 'free'
}

// Plan limits
export const PLAN_LIMITS = {
  free: {
    experiences: 3,
    esGenerationsPerMonth: 3,
    interviewSessionsPerMonth: 5,
  },
  standard: {
    experiences: Infinity,
    esGenerationsPerMonth: 30,
    interviewSessionsPerMonth: 60,
  },
}

// Get plan limits for a user
export function getPlanLimits(
  email: string | null | undefined,
  dbPlan: string = 'free',
  trialEndsAt: Date | null = null
) {
  const effectivePlan = getEffectivePlan(email, dbPlan, trialEndsAt)
  return PLAN_LIMITS[effectivePlan]
}

// Helper to calculate remaining trial days
export function getRemainingTrialDays(trialEndsAt: Date | null | undefined): number | null {
  if (!trialEndsAt) return null
  const now = new Date()
  const endDate = new Date(trialEndsAt)
  if (endDate <= now) return 0
  const diffTime = endDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Check if user is on active trial
export function isOnTrial(trialEndsAt: Date | null | undefined): boolean {
  if (!trialEndsAt) return false
  return new Date(trialEndsAt) > new Date()
}
