import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProviderWrapper } from '@/components/providers/clerk-provider'
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
  keywords: ['ガクチカ', '就活', 'ES', '面接練習', 'AI', 'エントリーシート', 'STAR'],
  openGraph: {
    title: 'ガクチカバンクAI',
    description: '経験を資産に、ESも面接もブレない就活',
    siteName: 'ガクチカバンクAI',
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
        <ClerkProviderWrapper>
          {children}
          <Toaster />
        </ClerkProviderWrapper>
      </body>
    </html>
  )
}
