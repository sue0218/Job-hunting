// Admin and Premium User Configuration

// Admin emails - loaded from environment variable
// Set ADMIN_EMAILS in .env.local as comma-separated list: "admin1@example.com,admin2@example.com"
export const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : []

// Check if an email is an admin
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Get user's effective plan based on email
export function getEffectivePlan(email: string | null | undefined, dbPlan: string = 'free'): 'free' | 'standard' {
  // Admins always get standard plan
  if (isAdminEmail(email)) {
    return 'standard'
  }
  return dbPlan as 'free' | 'standard'
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
export function getPlanLimits(email: string | null | undefined, dbPlan: string = 'free') {
  const effectivePlan = getEffectivePlan(email, dbPlan)
  return PLAN_LIMITS[effectivePlan]
}
