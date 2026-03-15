import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isCurrentUserAdmin, getOverviewStats } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  FileText,
  Mic,
  BookOpen,
  TrendingUp,
  Gift,
  ChevronRight,
} from 'lucide-react'

export const maxDuration = 30

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    redirect('/dashboard')
  }

  const stats = await getOverviewStats()

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
        <p className="text-muted-foreground mt-1">システム全体の統計</p>
      </div>

      {!stats ? (
        <p className="text-muted-foreground">統計情報の取得に失敗しました</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(stats.users.total)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+{Number(stats.users.last7d)}</span> (7日)
                  {' / '}
                  <span className="text-green-600">+{Number(stats.users.last30d)}</span> (30日)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">経験DB</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(stats.experiences.total)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+{Number(stats.experiences.last7d)}</span> (7日)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">ES生成</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(stats.esDocuments.total)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+{Number(stats.esDocuments.last7d)}</span> (7日)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI面接</CardTitle>
                <Mic className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(stats.interviews.total)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  完了: {Number(stats.interviews.completed)}
                  {' / '}
                  <span className="text-green-600">+{Number(stats.interviews.last7d)}</span> (7日)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                最新の登録ユーザー
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentUsers.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{user.name || '名前未設定'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{user.plan}</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(user.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">ユーザーはまだいません</p>
              )}
            </CardContent>
          </Card>

          {/* Link to Beta Campaign */}
          <Link href="/admin/beta">
            <Card className="transition-colors hover:border-primary hover:bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>ベータキャンペーン</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">先着枠・報酬・紹介・フィードバック</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
            </Card>
          </Link>
        </>
      )}
    </div>
  )
}
