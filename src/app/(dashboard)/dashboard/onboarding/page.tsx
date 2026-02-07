import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/actions/user'
import { OnboardingWizard } from './onboarding-wizard'

export default async function OnboardingPage() {
  const user = await getOrCreateUser()

  if (user.onboardingCompleted) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <OnboardingWizard />
    </div>
  )
}
