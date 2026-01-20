import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function InterviewPage() {
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">面接練習</h1>
          <p className="text-gray-500">AIと面接練習してフィードバックを受ける</p>
        </div>
        <Link href="/interview/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            セッション開始
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>面接練習を始めましょう</CardTitle>
          <CardDescription>
            AIが面接官役となり、経験DBやESを基にした質問を投げかけます。回答に対するフィードバックも受けられます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">まだセッション履歴がありません</p>
        </CardContent>
      </Card>
    </div>
  )
}
