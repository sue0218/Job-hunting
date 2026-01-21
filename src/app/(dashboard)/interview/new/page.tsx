import { getExperiences } from '@/lib/actions/experiences'
import { NewInterviewForm } from './new-interview-form'

export default async function NewInterviewPage() {
  const experiences = await getExperiences()

  return <NewInterviewForm experiences={experiences} />
}
