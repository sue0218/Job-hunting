'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteAccount } from '@/lib/actions/user'
import { Loader2 } from 'lucide-react'

export function DangerZone() {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signOut } = useClerk()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteAccount()

      if (result.success) {
        // Sign out and redirect to home
        await signOut()
        router.push('/')
      } else {
        setError(result.error || 'アカウントの削除に失敗しました')
        setIsDeleting(false)
      }
    } catch {
      setError('予期せぬエラーが発生しました')
      setIsDeleting(false)
    }
  }

  const isConfirmValid = confirmText === '削除する'

  return (
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">アカウント削除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    この操作により、以下のデータがすべて完全に削除されます：
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    <li>経験DBのすべてのカード</li>
                    <li>作成したすべてのES</li>
                    <li>面接練習の履歴</li>
                    <li>有料プランのサブスクリプション（自動キャンセル）</li>
                  </ul>
                  <p className="font-medium text-red-600 mt-4">
                    この操作は取り消せません。
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Label htmlFor="confirm-delete" className="text-sm">
                  確認のため「削除する」と入力してください
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="削除する"
                  className="mt-2"
                  disabled={isDeleting}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={!isConfirmValid || isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      削除中...
                    </>
                  ) : (
                    'アカウントを削除'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
