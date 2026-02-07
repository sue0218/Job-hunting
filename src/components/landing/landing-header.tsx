import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Database } from 'lucide-react'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-[48px] max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Database className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            ガクチカバンクAI
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              ログイン
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
              無料で始める
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
