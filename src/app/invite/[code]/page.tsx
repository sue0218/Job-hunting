import { redirect } from 'next/navigation'
import { db } from '@/lib/db/client'
import { userEntitlements } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Database,
  CheckCircle,
  ArrowRight,
  Gift,
  Shield,
  FileText,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { cookies } from 'next/headers'

interface InvitePageProps {
  params: Promise<{ code: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params

  // Validate invite code
  const inviter = await db.query.userEntitlements.findFirst({
    where: eq(userEntitlements.inviteCode, code),
  })

  if (!inviter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">無効な招待コード</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-muted-foreground">
              この招待リンクは無効か、期限切れです。
            </p>
            <Link href="/sign-up">
              <Button>通常登録へ進む</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Store invite code in cookie
  const cookieStore = await cookies()
  cookieStore.set('pending_invite_code', code, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Database className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ガクチカバンクAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.2),transparent)]" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 text-sm shadow-sm">
              <Gift className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">友達からの招待</span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <span className="block text-green-600">+7日間</span>
              <span className="block mt-2">無料で使える特典付き</span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              招待リンクから登録すると、あなたと紹介してくれた友達の両方に
              <br />
              <strong className="text-foreground">+7日間の無料期間</strong>がプレゼントされます！
            </p>

            {/* CTA */}
            <Link href={`/sign-up?ref=invite&code=${code}`}>
              <Button
                size="lg"
                className="group h-14 w-full max-w-sm rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 text-lg font-semibold shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40 sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  今すぐ登録して特典をゲット
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            {/* Trust Signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>クレジットカード不要</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>30秒で登録完了</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                <span>自動課金なし</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-t bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              ガクチカバンクAIでできること
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">経験DB</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  STAR形式で経験を構造化。何社でも使い回せる資産に
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">ES自動生成</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  経験DBからESを自動生成。毎回ゼロから書かなくていい
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">AI面接練習</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  経験に基づいた深堀り質問で本番に強くなる
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">整合性チェック</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ESと面接の矛盾を自動検出。一貫した回答で信頼される
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-gradient-to-br from-green-600 via-green-600 to-emerald-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            招待特典付きで今すぐ始めよう
          </h2>
          <p className="mb-8 text-white/80">
            登録後、経験1つ + ES1つを作成するとあなたも友達も+7日間！
          </p>
          <Link href={`/sign-up?ref=invite&code=${code}`}>
            <Button size="lg" variant="secondary" className="shadow-xl transition-all hover:scale-105">
              今すぐ無料で始める
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Database className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">ガクチカバンクAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 ガクチカバンクAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
