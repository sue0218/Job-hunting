import { getEsDocuments } from '@/lib/actions/es-documents'
import { getUserEntitlement } from '@/lib/actions/beta'
import { getSubscriptionStatus } from '@/lib/stripe/actions'
import { EsDocumentsList } from './es-documents-list'

export default async function EsPage() {
  const [esDocuments, entitlement, subscription] = await Promise.all([
    getEsDocuments(),
    getUserEntitlement(),
    getSubscriptionStatus(),
  ])

  return (
    <EsDocumentsList
      initialDocuments={esDocuments}
      trialEndsAt={entitlement?.trialEndsAt ?? null}
      dbPlan={subscription.plan}
    />
  )
}
