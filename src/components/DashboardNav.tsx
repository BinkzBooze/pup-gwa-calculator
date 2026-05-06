'use client'

import UserDropdown from '@/components/UserDropdown'
import { GraduationCap, Link2 } from 'lucide-react'
import { useState } from 'react'

export default function DashboardNav({
  displayName,
  email,
  isPublic,
  userId,
  readOnly = false,
}: {
  displayName: string | null
  email?: string
  isPublic: boolean
  userId?: string
  readOnly?: boolean
}) {
  const [copied, setCopied] = useState(false)

  async function copyShareLink() {
    if (!userId) return
    const url = `${window.location.origin}/share/${userId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-[#800000] shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Title */}
        <div className="flex items-center gap-2 min-w-0 shrink-0 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/20 ring-2 ring-[#FFD700]/50">
            <GraduationCap className="h-5 w-5 text-[#FFD700]" />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-poppins text-sm font-extrabold uppercase tracking-tight text-white">
              BINKZ
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share link copy button — only when public and not readOnly */}
          {isPublic && !readOnly && userId && (
            <button
              id="copy-share-link-button"
              onClick={copyShareLink}
              className="flex items-center gap-1.5 rounded-full bg-[#FFD700]/20 p-2 text-xs font-medium text-[#FFD700] ring-1 ring-[#FFD700]/40 transition-colors hover:bg-[#FFD700]/30 sm:px-3 sm:py-1"
              title="Copy shareable link"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Share Link'}</span>
              {copied && <span className="sm:hidden text-[10px]">!</span>}
            </button>
          )}

          {/* Public profile indicator (readOnly view) */}
          {isPublic && readOnly && (
            <span className="hidden items-center gap-1.5 rounded-full bg-[#FFD700]/20 px-3 py-1 text-xs font-medium text-[#FFD700] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700] animate-pulse" />
              Public Profile
            </span>
          )}

          {/* User dropdown (only shown when not in readOnly/public-share mode) */}
          {!readOnly ? (
            <UserDropdown displayName={displayName} email={email} />
          ) : (
            /* Read-only: show display name statically */
            <span className="text-sm font-medium text-white/90">
              {displayName ?? 'Student'}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
