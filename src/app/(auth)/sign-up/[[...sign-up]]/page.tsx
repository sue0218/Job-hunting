'use client'

import { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Sparkles } from 'lucide-react'

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

function TermsAgreement({ onAgree }: { onAgree: () => void }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">ガクチカバンクAI</CardTitle>
        <CardDescription>
          アカウントを作成する前に、以下の規約をご確認ください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            本サービスをご利用いただくには、以下の規約に同意していただく必要があります。
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link 
                href="/terms" 
                target="_blank"
                className="text-primary hover:underline font-medium"
              >
                利用規約 →
              </Link>
            </li>
            <li>
              <Link 
                href="/privacy" 
                target="_blank"
                className="text-primary hover:underline font-medium"
              >
                プライバシーポリシー →
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="terms"
            className="text-sm leading-relaxed cursor-pointer"
          >
            <Link href="/terms" target="_blank" className="text-primary hover:underline">
              利用規約
            </Link>
            および
            <Link href="/privacy" target="_blank" className="text-primary hover:underline">
              プライバシーポリシー
            </Link>
            を読み、同意します。
          </label>
        </div>

        <Button
          onClick={onAgree}
          disabled={!agreed}
          className="w-full"
          size="lg"
        >
          同意してアカウント作成へ進む
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function SignUpPage() {
  const [hasAgreed, setHasAgreed] = useState(false)

  if (!isClerkConfigured()) {
    return <ClerkNotConfigured />
  }

  if (!hasAgreed) {
    return <TermsAgreement onAgree={() => setHasAgreed(true)} />
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <SignUp />
      <p className="text-xs text-muted-foreground max-w-sm text-center">
        登録を完了することで、
        <Link href="/terms" target="_blank" className="text-primary hover:underline">利用規約</Link>
        および
        <Link href="/privacy" target="_blank" className="text-primary hover:underline">プライバシーポリシー</Link>
        に同意したものとみなされます。
      </p>
    </div>
  )
}
