import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function EsPage() {
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ES作成</h1>
          <p className="text-gray-500">経験DBを基にESを自動生成</p>
        </div>
        <Link href="/es/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            ES生成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ESを作成しましょう</CardTitle>
          <CardDescription>
            企業名、設問、文字数を指定して、経験DBを基にESを自動生成できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">まだESが作成されていません</p>
        </CardContent>
      </Card>
    </div>
  )
}
