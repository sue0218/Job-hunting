import { notFound } from 'next/navigation'
import { getEsDocument } from '@/lib/actions/es-documents'
import { getExperiences } from '@/lib/actions/experiences'
import { EsDetailContent } from './es-detail-content'

export default async function EsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [document, experiences] = await Promise.all([
    getEsDocument(id),
    getExperiences(),
  ])

  if (!document) {
    notFound()
  }

  return <EsDetailContent document={document} experiences={experiences} />
}
