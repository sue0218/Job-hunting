'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          エラーが発生しました
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          ページの読み込み中にエラーが発生しました。しばらく待ってからもう一度お試しください。
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            もう一度試す
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            トップページに戻る
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-400">
            エラーコード: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
