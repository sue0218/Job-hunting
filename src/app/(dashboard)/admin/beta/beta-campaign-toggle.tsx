'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toggleBetaCampaign } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'

interface BetaCampaignToggleProps {
  enabled: boolean
}

export function BetaCampaignToggle({ enabled: initialEnabled }: BetaCampaignToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleBetaCampaign()
      if (result.success && result.enabled !== undefined) {
        setEnabled(result.enabled)
        router.refresh()
      }
    })
  }

  return (
    <Button
      size="sm"
      variant={enabled ? 'default' : 'outline'}
      onClick={handleToggle}
      disabled={isPending}
      className="h-6 text-xs"
    >
      {isPending ? '...' : enabled ? '有効' : '無効'}
    </Button>
  )
}
