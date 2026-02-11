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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'ガクチカバンクAI',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      url: 'https://gakuchika-bank.com',
      description:
        'ガクチカを1回登録すれば何社でも使える。AIがES自動生成・面接練習・整合性チェックまで一気通貫サポート。',
      offers: [
        {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY',
          name: 'Free',
          description: '経験DB 3件、ES生成 10回/月、面接練習 5回/月',
        },
        {
          '@type': 'Offer',
          price: '1980',
          priceCurrency: 'JPY',
          name: 'Standard',
          description: '経験DB無制限、ES生成 30回/月、面接練習 60回/月',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'ガクチカバンクAIとは何ですか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ガクチカバンクAIは、就活生向けのAI支援サービスです。ガクチカをSTAR形式で1回登録すれば、AIがES自動生成・面接練習・整合性チェックまで一気通貫でサポートします。',
          },
        },
        {
          '@type': 'Question',
          name: '無料で使えますか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'はい、無料プランでは経験DB 3件、ES生成 10回/月、面接練習 5回/月が利用できます。有料プラン（月額¥1,980）では経験DB無制限、ES生成 30回/月、面接練習 60回/月に拡大します。',
          },
        },
        {
          '@type': 'Question',
          name: '無料プランから有料プランへの切り替えは簡単ですか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'はい、ダッシュボードから1クリックでアップグレードできます。',
          },
        },
        {
          '@type': 'Question',
          name: 'ChatGPTとの違いは何ですか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ChatGPTは汎用AIのため、毎回経験を入力し直す必要があります。ガクチカバンクAIは経験を一度登録すれば何社でも使い回せ、ES・面接・整合性チェックが連動するため、一貫性のある就活対策が可能です。',
          },
        },
        {
          '@type': 'Question',
          name: 'ES生成にはどれくらい時間がかかりますか？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '経験を登録済みの場合、ES生成は約30秒〜1分で完了します。手書きで2時間かかっていたESが5分以内に作成可能です。',
          },
        },
      ],
    },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
