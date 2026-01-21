import { getExperiences } from '@/lib/actions/experiences'
import { NewEsForm } from './new-es-form'

export default async function NewEsPage() {
  const experiences = await getExperiences()

  return <NewEsForm experiences={experiences} />
}
