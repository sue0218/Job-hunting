'use client'

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'

function isValidClerkKey(key: string | undefined): boolean {
  if (!key) return false
  // Clerk keys start with pk_test_ or pk_live_ followed by actual key content
  return key.startsWith('pk_test_') || key.startsWith('pk_live_')
}

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If no valid Clerk key, render children without ClerkProvider
  if (!isValidClerkKey(publishableKey) || publishableKey?.includes('YOUR_')) {
    return <>{children}</>
  }

  return <ClerkProviderBase>{children}</ClerkProviderBase>
}
