'use client'

import { signOut } from '@/app/actions/auth'
import AccountSettingsModal from '@/components/AccountSettingsModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function UserDropdown({
  displayName,
  email,
}: {
  displayName: string | null
  email: string | undefined
}) {
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const initials = (displayName ?? email ?? 'S')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/60" />
          }
        >
          {/* Avatar initials circle */}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD700]/30 text-[10px] font-bold text-[#FFD700]">
            {initials}
          </span>
          <span className="hidden sm:inline">{displayName ?? 'Student'}</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/60" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          {/*
            Use a plain <div> for the user info header.
            DropdownMenuLabel maps to @base-ui's Menu.GroupLabel which requires
            a Menu.Group parent context — using it bare causes a runtime crash.
          */}
          <div className="px-2 py-2 border-b border-border mb-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {displayName ?? 'Student'}
            </p>
            {email && (
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            )}
          </div>

          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Account Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="gap-2 cursor-pointer"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await signOut()
                router.refresh()
              })
            }
          >
            <LogOut className="h-4 w-4" />
            {isPending ? 'Signing out…' : 'Sign Out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rendered outside the dropdown portal to avoid nested portal issues */}
      <AccountSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        currentName={displayName}
      />
    </>
  )
}
