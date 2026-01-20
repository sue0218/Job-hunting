import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-500">アカウント設定とデータ管理</p>
      </div>

      {/* Account Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>アカウント設定</CardTitle>
          <CardDescription>プロフィールとアカウント情報を管理</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            プロフィールの編集はClerkの設定画面から行えます。
          </p>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>データエクスポート</CardTitle>
          <CardDescription>登録した経験DBやESをエクスポート</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">データをエクスポート</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">危険な操作</CardTitle>
          <CardDescription>この操作は取り消せません</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">アカウントを削除</p>
              <p className="text-sm text-gray-500">
                すべてのデータが完全に削除されます。この操作は取り消せません。
              </p>
            </div>
            <Button variant="destructive">アカウント削除</Button>
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <div className="mt-8 space-y-2 text-sm text-gray-500">
        <p>
          <a href="#" className="underline hover:text-gray-700">
            利用規約
          </a>
        </p>
        <p>
          <a href="#" className="underline hover:text-gray-700">
            プライバシーポリシー
          </a>
        </p>
        <p>
          <a href="#" className="underline hover:text-gray-700">
            捏造防止方針
          </a>
        </p>
      </div>
    </div>
  )
}
