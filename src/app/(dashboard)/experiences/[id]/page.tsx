import { getExperience } from '@/lib/actions/experiences'
import { notFound } from 'next/navigation'
import { ExperienceDetail } from './experience-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params
  const experience = await getExperience(id)

  if (!experience) {
    notFound()
  }

  return <ExperienceDetail experience={experience} />
}
