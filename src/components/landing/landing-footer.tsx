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
            <Link href="/guides/gakuchika-volunteer" className="transition-colors hover:text-foreground">ボランティア</Link>
            <Link href="/guides/gakuchika-ryugaku" className="transition-colors hover:text-foreground">留学</Link>
            <Link href="/guides/gakuchika-programming" className="transition-colors hover:text-foreground">プログラミング</Link>
            <Link href="/guides/gakuchika-gakugyo" className="transition-colors hover:text-foreground">学業</Link>
            <Link href="/guides/gakuchika-kenkyuu" className="transition-colors hover:text-foreground">研究</Link>
            <Link href="/guides/gakuchika-leadership" className="transition-colors hover:text-foreground">リーダーシップ</Link>
            <Link href="/guides/gakuchika-nai" className="transition-colors hover:text-foreground">ガクチカがない</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">書き方・対策ガイド:</span>
            <Link href="/guides/gakuchika-star" className="transition-colors hover:text-foreground">STAR形式</Link>
            <Link href="/guides/gakuchika-200ji" className="transition-colors hover:text-foreground">200字</Link>
            <Link href="/guides/gakuchika-400ji" className="transition-colors hover:text-foreground">400字</Link>
            <Link href="/guides/gakuchika-mensetsu" className="transition-colors hover:text-foreground">面接対策</Link>
            <Link href="/guides/es-kakikata" className="transition-colors hover:text-foreground">ES書き方</Link>
            <Link href="/guides/es-jiko-pr" className="transition-colors hover:text-foreground">自己PR</Link>
            <Link href="/guides/es-shibou-douki" className="transition-colors hover:text-foreground">志望動機</Link>
            <Link href="/guides/shinsotsu-mensetsu" className="transition-colors hover:text-foreground">面接質問集</Link>
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
