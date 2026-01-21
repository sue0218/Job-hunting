import { getEsDocuments } from '@/lib/actions/es-documents'
import { EsDocumentsList } from './es-documents-list'

export default async function EsPage() {
  const esDocuments = await getEsDocuments()

  return <EsDocumentsList initialDocuments={esDocuments} />
}
