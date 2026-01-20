import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, MessageSquare, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-500">就活の進捗状況を確認しましょう</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">経験DB</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 3</div>
            <p className="text-xs text-muted-foreground">Freeプラン上限</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ES作成</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 3</div>
            <p className="text-xs text-muted-foreground">今月の残り回数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">面接練習</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 5</div>
            <p className="text-xs text-muted-foreground">今月の残り回数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">整合性</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">良好</div>
            <p className="text-xs text-muted-foreground">矛盾なし</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">今日のおすすめタスク</h2>
        <Card>
          <CardHeader>
            <CardTitle>経験DBを作成しましょう</CardTitle>
            <CardDescription>
              まずは自分の経験を整理することから始めましょう。部活動、アルバイト、研究活動など、あなたの経験をSTAR形式で登録できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/experiences/new"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              経験を登録する
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">最近のアクティビティ</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">まだアクティビティはありません</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
