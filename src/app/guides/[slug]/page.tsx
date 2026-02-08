import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, CheckCircle, Sparkles } from 'lucide-react'
import { getAllGuideSlugs, getGuideBySlug, guides } from './guide-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) return {}

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: 'article',
      url: `https://gakuchika-bank.com/guides/${guide.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
    alternates: {
      canonical: `https://gakuchika-bank.com/guides/${guide.slug}`,
    },
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()

  const relatedGuides = guide.relatedSlugs
    .map((s) => guides[s])
    .filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.metaTitle,
    description: guide.metaDescription,
    url: `https://gakuchika-bank.com/guides/${guide.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'ガクチカバンクAI',
      url: 'https://gakuchika-bank.com',
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold">ガクチカバンクAI</span>
          </Link>
          <Button size="sm" asChild>
            <Link href="/sign-up">無料で始める</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="mb-4">
            <Link
              href="/"
              className="text-sm text-primary hover:underline"
            >
              ← トップページに戻る
            </Link>
          </div>
          <Badge className="mb-4">ガクチカ書き方ガイド</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {guide.heroTitle}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {guide.heroDescription}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Sections */}
          <div className="space-y-10">
            {guide.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {section.heading}
                </h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {section.content.split('\n').map((line, j) => {
                    if (line.startsWith('**') && line.includes('**:')) {
                      const [bold, rest] = line.split('**:', 2)
                      return (
                        <p key={j} className="mb-2">
                          <strong>{bold.replace(/\*\*/g, '')}</strong>:{rest}
                        </p>
                      )
                    }
                    if (line.match(/^\d\./)) {
                      return (
                        <p key={j} className="mb-2 pl-4">
                          {line}
                        </p>
                      )
                    }
                    if (line === '') return <br key={j} />
                    return <p key={j} className="mb-2">{line}</p>
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* STAR Example */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              STAR形式の例文
            </h2>
            <Card className="border-primary/20">
              <CardContent className="pt-6 space-y-4">
                {[
                  { label: 'S - Situation（状況）', text: guide.starExample.situation, color: 'bg-blue-100 text-blue-800' },
                  { label: 'T - Task（課題）', text: guide.starExample.task, color: 'bg-green-100 text-green-800' },
                  { label: 'A - Action（行動）', text: guide.starExample.action, color: 'bg-amber-100 text-amber-800' },
                  { label: 'R - Result（結果）', text: guide.starExample.result, color: 'bg-purple-100 text-purple-800' },
                ].map((item) => (
                  <div key={item.label}>
                    <Badge className={item.color} variant="secondary">
                      {item.label}
                    </Badge>
                    <p className="mt-2 text-slate-700 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              書く時のポイント
            </h2>
            <div className="space-y-3">
              {guide.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">
                  AIでガクチカからESを自動生成しませんか？
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  ガクチカバンクAIなら、あなたの経験をSTAR形式で登録するだけで、
                  AIが企業の設問に合わせたESを自動生成します。手書きで2時間かかっていたESが5分で完成。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link href="/sign-up">
                      <Sparkles className="mr-2 h-4 w-4" />
                      無料で始める
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/">
                      <BookOpen className="mr-2 h-4 w-4" />
                      詳しく見る
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Guides */}
          {relatedGuides.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                関連するガイド
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedGuides.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/guides/${related.slug}`}
                    className="group p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <p className="font-medium text-slate-900 group-hover:text-primary mb-1">
                      {related.title}
                    </p>
                    <span className="text-sm text-primary flex items-center gap-1">
                      読む <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-primary">
            ガクチカバンクAI
          </Link>
          {' '}— 経験を資産に、ESも面接もブレない就活
        </div>
      </footer>
    </div>
  )
}
