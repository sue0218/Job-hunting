import { getSubscriptionStatus } from '@/lib/stripe/actions'
import { getExperiences } from '@/lib/actions/experiences'
import { getEsDocuments } from '@/lib/actions/es-documents'
import { getInterviewSessions } from '@/lib/actions/interview-sessions'
import { getUserEntitlement } from '@/lib/actions/beta'
import { BillingContent } from './billing-content'

export default async function BillingPage() {
  const [subscription, experiences, esDocuments, interviewSessions, entitlement] = await Promise.all([
    getSubscriptionStatus(),
    getExperiences(),
    getEsDocuments(),
    getInterviewSessions(),
    getUserEntitlement(),
  ])

  // Count this month's usage
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthlyEsCount = esDocuments.filter(
    doc => new Date(doc.createdAt) >= thisMonth
  ).length

  const monthlyInterviewCount = interviewSessions.filter(
    session => new Date(session.createdAt) >= thisMonth
  ).length

  return (
    <BillingContent
      subscription={subscription}
      experienceCount={experiences.length}
      monthlyEsCount={monthlyEsCount}
      monthlyInterviewCount={monthlyInterviewCount}
      trialEndsAt={entitlement?.trialEndsAt ?? null}
    />
  )
}
