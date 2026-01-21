import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24 mt-1" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Skeleton className="h-6 w-24" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-16 w-3/4 rounded-lg" />
          </div>
          <div className="flex gap-2 justify-end">
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-24 w-3/4 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-6">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
