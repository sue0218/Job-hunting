'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
}

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
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
        <User className="h-4 w-4 text-gray-500" />
      </div>
    )
  }

  return <ClerkUserButton afterSignOutUrl="/" />
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex items-center gap-4">
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
