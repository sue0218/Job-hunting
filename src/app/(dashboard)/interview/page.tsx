import { getInterviewSessions, getMonthlyInterviewCount } from '@/lib/actions/interview-sessions'
import { InterviewSessionsList } from './interview-sessions-list'

export default async function InterviewPage() {
  const sessions = await getInterviewSessions()
  const monthlyCount = await getMonthlyInterviewCount()

  return <InterviewSessionsList initialSessions={sessions} monthlyCount={monthlyCount} />
}
