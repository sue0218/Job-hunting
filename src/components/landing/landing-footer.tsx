import Link from 'next/link'
import { Database } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Database className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground">
              ガクチカバンクAI
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">ガクチカ書き方ガイド:</span>
            <Link href="/guides/gakuchika-baito" className="transition-colors hover:text-foreground">バイト</Link>
            <Link href="/guides/gakuchika-circle" className="transition-colors hover:text-foreground">サークル</Link>
            <Link href="/guides/gakuchika-zemi" className="transition-colors hover:text-foreground">ゼミ</Link>
            <Link href="/guides/gakuchika-bukatsu" className="transition-colors hover:text-foreground">部活</Link>
            <Link href="/guides/gakuchika-internship" className="transition-colors hover:text-foreground">インターン</Link>
            <Link href="/guides/gakuchika-nai" className="transition-colors hover:text-foreground">ガクチカがない</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/tokushoho"
              className="transition-colors hover:text-foreground"
            >
              特定商取引法に基づく表記
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ガクチカバンクAI. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
