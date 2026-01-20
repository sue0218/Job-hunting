import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export default function BillingPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プラン・課金</h1>
        <p className="text-gray-500">現在のプランと利用状況</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>現在のプラン</CardTitle>
            <Badge variant="secondary">Free</Badge>
          </div>
          <CardDescription>無料プランをご利用中です</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">経験DB:</span> 0 / 3 枚
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">ES生成:</span> 0 / 3 回（今月）
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">面接練習:</span> 0 / 5 回（今月）
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>就活を始めたばかりの方に</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">¥0</span>
              <span className="text-gray-500">/月</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                経験DB 3枚まで
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                ES生成 3回/月
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                面接練習 5回/月
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" disabled>
              現在のプラン
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Standard</CardTitle>
              <Badge>おすすめ</Badge>
            </div>
            <CardDescription>本格的に就活を進める方に</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">¥1,980</span>
              <span className="text-gray-500">/月</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                経験DB 無制限
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                ES生成 30回/月
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                面接練習 60回/月
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                整合性チェック
              </li>
            </ul>
            <Button className="mt-4 w-full">アップグレード</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
