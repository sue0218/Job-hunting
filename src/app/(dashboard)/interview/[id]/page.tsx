import { notFound } from 'next/navigation'
import { getInterviewSession } from '@/lib/actions/interview-sessions'
import { getExperience } from '@/lib/actions/experiences'
import { InterviewChatContent } from './interview-chat-content'

export default async function InterviewChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await getInterviewSession(id)

  if (!session) {
    notFound()
  }

  // Get linked experience if exists
  const experience = session.experienceId
    ? await getExperience(session.experienceId)
    : null

  return <InterviewChatContent session={session} experience={experience} />
}
