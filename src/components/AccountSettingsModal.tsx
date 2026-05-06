'use client'

import { deleteAccount, updateDisplayName, updatePassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useState, useTransition } from 'react'

/* ── Display name section ─────────────────────────────────── */
type NameState = { error: string | null; success: boolean }
const nameInit: NameState = { error: null, success: false }

function DisplayNameForm({ currentName }: { currentName: string | null }) {
  const [nameValue, setNameValue] = useState(currentName ?? '')

  async function action(_prev: NameState, formData: FormData): Promise<NameState> {
    const name = formData.get('name') as string
    const result = await updateDisplayName(name)
    return { error: result.error, success: !result.error }
  }
  const [state, formAction, isPending] = useActionState(action, nameInit)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-display-name" className="text-sm font-medium">
          Display Name
        </Label>
        <Input
          id="account-display-name"
          name="name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          placeholder="Your name"
          required
          disabled={isPending}
          className="text-sm"
        />
      </div>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      {state.success && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" /> Name updated successfully.
        </p>
      )}
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="self-end gap-1.5 bg-[#800000] text-white hover:bg-[#660000]"
      >
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Name
      </Button>
    </form>
  )
}


/* ── Password section ─────────────────────────────────────── */
type PwState = { error: string | null; success: boolean; timestamp?: number }
const pwInit: PwState = { error: null, success: false }

function PasswordForm() {
  async function action(_prev: PwState, formData: FormData): Promise<PwState> {
    const current = formData.get('current') as string
    const pw = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    // Client-side validation
    if (pw !== confirm) {
      return { error: 'New passwords do not match.', success: false, timestamp: Date.now() }
    }

    const result = await updatePassword(current, pw, confirm)
    return { 
      error: result.error, 
      success: !result.error,
      timestamp: result.error ? Date.now() : _prev.timestamp 
    }
  }
  const [state, formAction, isPending] = useActionState(action, pwInit)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-current-password" className="text-sm font-medium">
          Current Password
        </Label>
        <Input
          key={`current-${state.timestamp}`}
          id="account-current-password"
          name="current"
          type="password"
          placeholder="Required to change password"
          required
          disabled={isPending}
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-new-password" className="text-sm font-medium">
          New Password
        </Label>
        <Input
          key={`new-${state.timestamp}`}
          id="account-new-password"
          name="password"
          type="password"
          placeholder="Minimum 6 characters"
          required
          minLength={6}
          disabled={isPending}
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-confirm-password" className="text-sm font-medium">
          Confirm New Password
        </Label>
        <Input
          key={`confirm-${state.timestamp}`}
          id="account-confirm-password"
          name="confirm"
          type="password"
          placeholder="Re-enter new password"
          required
          disabled={isPending}
          className="text-sm"
        />
      </div>
      {state.error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
          <TriangleAlert className="h-3.5 w-3.5" /> {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" /> Password updated successfully.
        </p>
      )}
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="self-end gap-1.5 bg-[#800000] text-white hover:bg-[#660000]"
      >
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Update Password
      </Button>
    </form>
  )
}


/* ── Delete account section ───────────────────────────────── */
const CONFIRM_PHRASE = 'DELETE MY ACCOUNT'

function DeleteAccountSection() {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isConfirmed = typed.trim() === CONFIRM_PHRASE

  function handleOpen() {
    setTyped('')
    setError(null)
    setConfirmOpen(true)
  }

  function handleDelete() {
    if (!isConfirmed) return
    startTransition(async () => {
      const result = await deleteAccount()
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
      // On success the Server Action calls redirect('/auth') automatically.
    })
  }

  return (
    <>
      {/* Danger zone trigger */}
      <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm font-semibold text-destructive">Danger Zone</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all your academic data. This action cannot be undone.
        </p>
        <Button
          id="delete-account-open-btn"
          variant="destructive"
          size="sm"
          className="self-start mt-1"
          onClick={handleOpen}
        >
          Delete Account
        </Button>
      </div>

      {/* Confirmation dialog — nested inside AccountSettingsModal's Dialog */}
      <Dialog open={confirmOpen} onOpenChange={(o) => { if (!isPending) setConfirmOpen(o) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all your semesters, and all your subjects.{' '}
              <strong className="text-foreground">This cannot be undone.</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-1">
            <p className="text-sm text-muted-foreground">
              To confirm, type{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-bold text-foreground">
                {CONFIRM_PHRASE}
              </code>{' '}
              below.
            </p>
            <Input
              id="delete-account-confirm-input"
              value={typed}
              onChange={(e) => { setTyped(e.target.value); setError(null) }}
              placeholder={CONFIRM_PHRASE}
              disabled={isPending}
              className="font-mono text-sm"
              autoComplete="off"
              spellCheck={false}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              id="delete-account-confirm-btn"
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmed || isPending}
              className="gap-1.5"
            >
              {isPending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</>
                : 'Yes, Delete Forever'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


/* ── Modal wrapper ────────────────────────────────────────── */
export default function AccountSettingsModal({
  open,
  onOpenChange,
  currentName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <DisplayNameForm currentName={currentName} />
          <Separator />
          <PasswordForm />
          <Separator />
          <DeleteAccountSection />
        </div>
      </DialogContent>
    </Dialog>
  )
}
