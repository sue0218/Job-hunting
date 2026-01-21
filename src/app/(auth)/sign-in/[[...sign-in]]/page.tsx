'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) return false
  return (key.startsWith('pk_test_') || key.startsWith('pk_live_')) && !key.includes('YOUR_')
}

function ClerkNotConfigured() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>認証設定が必要です</CardTitle>
        <CardDescription>
          Clerkの設定が完了していません。開発者は以下の手順で設定を行ってください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>
            <a
              href="https://dashboard.clerk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Clerk Dashboard
            </a>
            でアカウントを作成
          </li>
          <li>新規アプリケーションを作成</li>
          <li>API KeysからPublishable keyとSecret keyを取得</li>
          <li>.env.localファイルに設定</li>
        </ol>
        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" className="w-full">
              ホームに戻る
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return <ClerkNotConfigured />
  }

  return <SignIn />
}
