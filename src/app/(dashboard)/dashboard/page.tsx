import { getExperiences } from '@/lib/actions/experiences'
import { getEsDocuments } from '@/lib/actions/es-documents'
import { getInterviewSessions } from '@/lib/actions/interview-sessions'
import { getLatestConsistencyCheck } from '@/lib/actions/consistency-checks'
import { getOrCreateUser } from '@/lib/actions/user'
import { getUserEntitlement } from '@/lib/actions/beta'
import { DashboardContent } from './dashboard-content'
import { OnboardingModal } from '@/components/onboarding/onboarding-modal'

export default async function DashboardPage() {
  const [user, experiences, esDocuments, interviewSessions, consistencyCheck, entitlement] = await Promise.all([
    getOrCreateUser(),
    getExperiences(),
    getEsDocuments(),
    getInterviewSessions(),
    getLatestConsistencyCheck(),
    getUserEntitlement(),
  ])

  // Show onboarding for new users who haven't completed it
  // and don't have any experiences yet
  const showOnboarding = !user.onboardingCompleted && experiences.length === 0

  // Calculate interview stats
  const completedInterviews = interviewSessions.filter(s => s.status === 'completed')
  const ratingsSum = completedInterviews.reduce((sum, s) => sum + (s.rating || 0), 0)
  const averageRating = completedInterviews.length > 0
    ? ratingsSum / completedInterviews.length
    : null

  // Get recent items (last 5)
  const recentInterviews = interviewSessions.slice(0, 5)
  const recentEs = esDocuments.slice(0, 5)

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
    <>
      {showOnboarding && <OnboardingModal />}
      <DashboardContent
        experienceCount={experiences.length}
        esCount={monthlyEsCount}
        interviewCount={monthlyInterviewCount}
        consistencyCheck={consistencyCheck}
        averageRating={averageRating}
        completedInterviewCount={completedInterviews.length}
        recentInterviews={recentInterviews.map(s => ({
          id: s.id,
          title: s.title,
          rating: s.rating,
          status: s.status,
          createdAt: s.createdAt,
        }))}
        recentEs={recentEs.map(es => ({
          id: es.id,
          title: es.title,
          companyName: es.companyName,
          status: es.status,
          createdAt: es.createdAt,
        }))}
        trialEndsAt={entitlement?.trialEndsAt ?? null}
        hasCompletedFeedback={!!entitlement?.surveyCompletedAt}
        dbPlan={user.plan}
      />
    </>
  )
}
