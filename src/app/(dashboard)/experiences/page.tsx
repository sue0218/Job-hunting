import { getExperiences } from '@/lib/actions/experiences'
import { ExperiencesList } from './experiences-list'

export default async function ExperiencesPage() {
  const experiences = await getExperiences()

  return <ExperiencesList initialExperiences={experiences} />
}
