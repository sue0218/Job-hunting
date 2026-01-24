import { getInterviewSessions, getMonthlyInterviewCount } from '@/lib/actions/interview-sessions'
import { getUserEntitlement } from '@/lib/actions/beta'
import { getSubscriptionStatus } from '@/lib/stripe/actions'
import { InterviewSessionsList } from './interview-sessions-list'

export default async function InterviewPage() {
  const [sessions, monthlyCount, entitlement, subscription] = await Promise.all([
    getInterviewSessions(),
    getMonthlyInterviewCount(),
    getUserEntitlement(),
    getSubscriptionStatus(),
  ])

  return (
    <InterviewSessionsList
      initialSessions={sessions}
      monthlyCount={monthlyCount}
      trialEndsAt={entitlement?.trialEndsAt ?? null}
      dbPlan={subscription.plan}
    />
  )
}
