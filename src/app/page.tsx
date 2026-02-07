import { LandingHeader } from '@/components/landing/landing-header'
import { HeroSection } from '@/components/landing/hero-section'
import { PainPointsSection } from '@/components/landing/pain-points-section'
import { CoreValueSection } from '@/components/landing/core-value-section'
import { ComparisonSection } from '@/components/landing/comparison-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { StickyCTA } from '@/components/landing/sticky-cta'
import { ExitIntentModal } from '@/components/landing/exit-intent-modal'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <PainPointsSection />
      <CoreValueSection />
      <SocialProofSection />
      <ComparisonSection />
      <PricingSection />
      <CtaSection />
      <LandingFooter />
      <StickyCTA />
      <ExitIntentModal />
    </div>
  )
}
