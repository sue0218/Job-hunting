'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  User,
  Sparkles,
} from 'lucide-react'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { name: '経験DB', href: '/experiences', icon: BookOpen },
  { name: 'ES作成', href: '/es', icon: FileText },
  { name: '面接練習', href: '/interview', icon: MessageSquare },
  { name: 'プラン・課金', href: '/billing', icon: CreditCard },
  { name: '設定', href: '/settings', icon: Settings },
]

function isClerkConfigured(): boolean {
  if (typeof window === 'undefined') return false
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) return false
  return (key.startsWith('pk_test_') || key.startsWith('pk_live_')) && !key.includes('YOUR_')
}

function UserAvatar() {
  const [ClerkUserButton, setClerkUserButton] = useState<React.ComponentType<{ afterSignOutUrl: string }> | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const configured = isClerkConfigured()
    setIsConfigured(configured)

    if (configured) {
      import('@clerk/nextjs').then((mod) => {
        setClerkUserButton(() => mod.UserButton)
      })
    }
  }, [])

  if (!isConfigured || !ClerkUserButton) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <User className="h-4 w-4 text-primary" />
      </div>
    )
  }

  return <ClerkUserButton afterSignOutUrl="/" />
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">ガクチカバンク</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <UserAvatar />
          <span className="text-sm font-medium text-foreground">マイアカウント</span>
        </div>
      </div>
    </div>
  )
}
