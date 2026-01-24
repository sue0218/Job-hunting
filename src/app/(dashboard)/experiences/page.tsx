import { getExperiences } from '@/lib/actions/experiences'
import { getUserEntitlement } from '@/lib/actions/beta'
import { getSubscriptionStatus } from '@/lib/stripe/actions'
import { ExperiencesList } from './experiences-list'

export default async function ExperiencesPage() {
  const [experiences, entitlement, subscription] = await Promise.all([
    getExperiences(),
    getUserEntitlement(),
    getSubscriptionStatus(),
  ])

  return (
    <ExperiencesList
      initialExperiences={experiences}
      trialEndsAt={entitlement?.trialEndsAt ?? null}
      dbPlan={subscription.plan}
    />
  )
}
