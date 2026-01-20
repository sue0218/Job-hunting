import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <span className="text-xl font-bold text-primary">ShukatsuCraft</span>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">ログイン</Button>
            </Link>
            <Link href="/sign-up">
              <Button>無料で始める</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          就活を、もっとスマートに。
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
          経験を構造化し、ES作成・面接練習をAIがサポート。
          <br />
          短時間で「提出可能なES」と「面接で話せる回答」まで到達。
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">
              無料で始める
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              機能を見る
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">主な機能</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <BookOpen className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>経験DB</CardTitle>
              <CardDescription>
                部活、バイト、研究...あなたの経験をSTAR形式で構造化して管理
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>ES自動生成</CardTitle>
              <CardDescription>
                経験DBを基に、企業・設問に合わせたESを自動生成
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>面接練習</CardTitle>
              <CardDescription>
                AIが面接官役。経験に基づいた質問でリアルな練習が可能
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>整合性チェック</CardTitle>
              <CardDescription>ESと面接回答の矛盾を自動検出。一貫性のある就活を</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">使い方</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">経験を登録</h3>
              <p className="text-gray-600">
                部活動、アルバイト、研究活動など、あなたの経験をSTAR形式で整理
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">ESを生成</h3>
              <p className="text-gray-600">
                企業名と設問を入力するだけで、経験に基づいたESを自動生成
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">面接練習</h3>
              <p className="text-gray-600">AIと面接練習。フィードバックを受けて本番に備える</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">料金プラン</h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>就活を始めたばかりの方に</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">¥0</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  経験DB 3枚まで
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  ES生成 3回/月
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  面接練習 5回/月
                </li>
              </ul>
              <Link href="/sign-up" className="mt-6 block">
                <Button variant="outline" className="w-full">
                  無料で始める
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Standard</CardTitle>
                <span className="rounded-full bg-primary px-2 py-1 text-xs text-white">おすすめ</span>
              </div>
              <CardDescription>本格的に就活を進める方に</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">¥1,980</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  経験DB 無制限
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  ES生成 30回/月
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  面接練習 60回/月
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  整合性チェック
                </li>
              </ul>
              <Link href="/sign-up" className="mt-6 block">
                <Button className="w-full">今すぐ始める</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">就活を、もっとスマートに。</h2>
          <p className="mb-8 text-lg opacity-90">今すぐ無料で始めて、効率的な就活を実現しましょう。</p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary">
              無料で始める
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <p>&copy; 2026 ShukatsuCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
