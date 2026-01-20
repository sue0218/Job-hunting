import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function ExperiencesPage() {
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">経験DB</h1>
          <p className="text-gray-500">あなたの経験をSTAR形式で管理</p>
        </div>
        <Link href="/experiences/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>経験を登録しましょう</CardTitle>
          <CardDescription>
            部活動、アルバイト、研究活動など、あなたの経験をSTAR形式（状況・課題・行動・結果）で整理できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">まだ経験が登録されていません</p>
        </CardContent>
      </Card>
    </div>
  )
}
