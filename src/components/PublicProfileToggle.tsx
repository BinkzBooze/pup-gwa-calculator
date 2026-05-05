'use client'

import { toggleProfileVisibility } from '@/app/actions/profile'
import { Switch } from '@/components/ui/switch'
import { Globe, Loader2 } from 'lucide-react'
import { useTransition } from 'react'

export default function PublicProfileToggle({ isPublic }: { isPublic: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <label
      id="public-profile-toggle"
      className="flex cursor-pointer select-none items-center gap-2.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      ) : (
        <Globe className={`h-3.5 w-3.5 ${isPublic ? 'text-emerald-600' : 'text-muted-foreground'}`} />
      )}
      <span className={isPublic ? 'text-emerald-700' : 'text-muted-foreground'}>
        {isPublic ? 'Public' : 'Private'}
      </span>
      <Switch
        checked={isPublic}
        disabled={isPending}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            await toggleProfileVisibility(checked)
          })
        }}
        className="data-checked:bg-emerald-500"
        aria-label="Toggle public profile"
      />
    </label>
  )
}
