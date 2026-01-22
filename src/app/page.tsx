import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, MessageSquare, CheckCircle, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ガクチカバンクAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">AIで就活を効率化</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              就活を、もっと
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                スマート
              </span>
              に。
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              ガクチカを1回登録すれば、何社でも使える。
              <br className="hidden sm:block" />
              AIがES生成・面接練習・整合性チェックまで一気通貫でサポート。
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="w-full shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:w-auto">
                  無料で始める
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  機能を見る
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>安全なデータ管理</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24時間利用可能</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span>最新AI搭載</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">主な機能</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              就活に必要な機能をすべて一つのプラットフォームで。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group cursor-pointer border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">経験DB</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  部活、バイト、研究...あなたの経験をSTAR形式で構造化して管理
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group cursor-pointer border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">ES自動生成</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  経験DBを基に、企業・設問に合わせたESを自動生成
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group cursor-pointer border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">面接練習</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  AIが面接官役。経験に基づいた質問でリアルな練習が可能
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group cursor-pointer border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">整合性チェック</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  ESと面接回答の矛盾を自動検出。一貫性のある就活を
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-gradient-to-b from-background to-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">使い方</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              3ステップで就活準備を効率化
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/25">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">経験を登録</h3>
              <p className="text-muted-foreground">
                部活動、アルバイト、研究活動など、あなたの経験をSTAR形式で整理
              </p>
              {/* Connector line for desktop */}
              <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-gradient-to-r from-primary/50 to-transparent md:block" />
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/25">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">ESを生成</h3>
              <p className="text-muted-foreground">
                企業名と設問を入力するだけで、経験に基づいたESを自動生成
              </p>
              {/* Connector lines for desktop */}
              <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-gradient-to-l from-primary/50 to-transparent md:block" />
              <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-gradient-to-r from-primary/50 to-transparent md:block" />
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/25">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">面接練習</h3>
              <p className="text-muted-foreground">
                AIと面接練習。フィードバックを受けて本番に備える
              </p>
              {/* Connector line for desktop */}
              <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-gradient-to-l from-primary/50 to-transparent md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">料金プラン</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              無料で始めて、必要に応じてアップグレード
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card className="relative border-2 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>就活を始めたばかりの方に</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-foreground">¥0</span>
                  <span className="text-muted-foreground">/月</span>
                </div>
                <ul className="mb-8 space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    経験DB 3枚まで
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    ES生成 3回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    面接練習 5回/月
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button variant="outline" className="w-full">
                    無料で始める
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-primary shadow-xl shadow-primary/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-primary to-blue-500 px-4 py-1 text-sm font-medium text-white shadow-lg">
                  おすすめ
                </span>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl">Standard</CardTitle>
                <CardDescription>本格的に就活を進める方に</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-foreground">¥1,980</span>
                  <span className="text-muted-foreground">/月</span>
                </div>
                <ul className="mb-8 space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-medium">経験DB 無制限</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    ES生成 30回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    面接練習 60回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    整合性チェック
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button className="w-full shadow-lg shadow-primary/25">
                    今すぐ始める
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-600 py-24 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">就活を、もっとスマートに。</h2>
          <p className="mb-10 text-lg text-white/90">
            今すぐ無料で始めて、効率的な就活を実現しましょう。
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="shadow-xl transition-all hover:scale-105">
              無料で始める
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">ガクチカバンクAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 ガクチカバンクAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
