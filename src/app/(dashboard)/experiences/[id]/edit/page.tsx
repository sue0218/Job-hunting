import { getExperience } from '@/lib/actions/experiences'
import { notFound } from 'next/navigation'
import { EditExperienceForm } from './edit-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditExperiencePage({ params }: PageProps) {
  const { id } = await params
  const experience = await getExperience(id)

  if (!experience) {
    notFound()
  }

  return <EditExperienceForm experience={experience} />
}
