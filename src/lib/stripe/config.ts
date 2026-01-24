import Stripe from 'stripe'

// Note: Logger cannot be used at module initialization time
// This warning only shows if the module is loaded with incorrect config
const stripeNotConfigured = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_xxxxx'

// Use a dummy key for build time if not configured
// This prevents build errors while allowing runtime checks
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    experiences: 3,
    esGenerationsPerMonth: 3,
    interviewSessionsPerMonth: 5,
  },
  standard: {
    name: 'Standard',
    price: 1980,
    priceId: process.env.STRIPE_PRICE_ID_STANDARD,
    experiences: Infinity,
    esGenerationsPerMonth: 30,
    interviewSessionsPerMonth: 60,
  },
} as const

export type PlanType = keyof typeof PLANS

export function isStripeConfigured(): boolean {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID_STANDARD

  return (
    secretKey !== undefined &&
    secretKey !== 'sk_test_xxxxx' &&
    priceId !== undefined &&
    priceId !== 'price_xxxxx'
  )
}
