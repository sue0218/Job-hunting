import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isCurrentUserAdmin } from '@/lib/actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  BarChart3,
  Settings,
  Gift,
  MessageSquare,
  Share2,
  ChevronRight,
} from 'lucide-react'

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin()

  if (!isAdmin) {
    redirect('/dashboard')
  }

  const adminSections = [
    {
      title: 'ベータキャンペーン',
      description: '先着300名キャンペーンの管理・統計',
      href: '/admin/beta',
      icon: Gift,
      stats: '先着枠・報酬・紹介状況',
    },
  ]

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
        <p className="text-muted-foreground mt-1">
          システム全体の管理と統計
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:border-primary hover:bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.stats}</p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Placeholder for future admin features */}
        <Card className="h-full border-dashed opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="mt-4">分析ダッシュボード</CardTitle>
            <CardDescription>利用統計・LLMコスト分析</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="h-full border-dashed opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="mt-4">ユーザー管理</CardTitle>
            <CardDescription>ユーザー一覧・プラン管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
