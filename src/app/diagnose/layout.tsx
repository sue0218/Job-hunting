import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ガクチカ完成度診断 | ガクチカバンクAI',
  description: '8つのチェック項目であなたのガクチカの完成度を無料診断。弱点がわかれば、対策も見える。登録不要・30秒で完了。',
  openGraph: {
    title: 'ガクチカ完成度診断 | ガクチカバンクAI',
    description: '8つのチェック項目であなたのガクチカの完成度を無料診断。弱点がわかれば、対策も見える。',
    type: 'website',
    url: 'https://gakuchika-bank.com/diagnose',
    siteName: 'ガクチカバンクAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ガクチカ完成度診断 | ガクチカバンクAI',
    description: '8つのチェック項目であなたのガクチカの完成度を無料診断。弱点がわかれば、対策も見える。',
  },
}

export default function DiagnoseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
