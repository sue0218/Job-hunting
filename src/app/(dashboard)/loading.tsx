import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-gray-500">読み込み中...</p>
      </div>
    </div>
  )
}
