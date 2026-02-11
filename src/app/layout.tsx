import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ClerkProviderWrapper } from '@/components/providers/clerk-provider'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ガクチカバンクAI - 経験を資産に、ESも面接もブレない就活',
  description:
    'ガクチカを1回登録すれば、何社でも使える。STAR形式で経験を整理し、AIがES生成・面接練習・整合性チェックまで一気通貫でサポート。',
  keywords: ['ガクチカ', '就活', 'ES', '面接練習', 'AI', 'エントリーシート', 'STAR', 'ガクチカ 書き方', '就活対策'],
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://gakuchika-bank.com',
  },
  metadataBase: new URL('https://gakuchika-bank.com'),
  openGraph: {
    title: 'ガクチカバンクAI - 経験を資産に、ESも面接もブレない就活',
    description:
      'ガクチカを1回登録すれば、何社でも使える。STAR形式で経験を整理し、AIがES生成・面接練習・整合性チェックまで一気通貫でサポート。',
    siteName: 'ガクチカバンクAI',
    url: 'https://gakuchika-bank.com',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ガクチカバンクAI - 経験を資産に、ESも面接もブレない就活',
    description:
      'ガクチカを1回登録すれば何社でも使える。AIがES生成・面接練習・整合性チェックまで一気通貫サポート。',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        <ClerkProviderWrapper>
          {children}
          <Toaster />
        </ClerkProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
