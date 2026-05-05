'use client'

import { signIn, signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Loader2 } from 'lucide-react'
import { useActionState, useState } from 'react'

type FormState = { error: string | null }
const initialState: FormState = { error: null }

function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    if (!email || !password) return { error: 'Email and password are required.' }
    const result = await signIn(email, password)
    return result
  }

  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4 pt-4 pb-6">
        <div className="grid gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signin-password">Password</Label>
          <Input
            id="signin-password"
            name="password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
        {state.error && (
          <p className="text-sm text-destructive" role="alert">{state.error}</p>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          id="signin-submit"
          type="submit"
          disabled={isPending}
          className="w-full gap-2 bg-[#800000] text-white hover:bg-[#660000]"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign In
        </Button>
        <p className="text-sm text-muted-foreground">
          No account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-[#800000] hover:underline"
          >
            Create one
          </button>
        </p>
      </CardFooter>
    </form>
  )
}

function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const displayName = (formData.get('displayName') as string)?.trim()
    if (!email || !password) return { error: 'Email and password are required.' }
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' }
    const result = await signUp(email, password, displayName)
    return result
  }

  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4 pt-4 pb-6">
        <div className="grid gap-2">
          <Label htmlFor="signup-name">Display Name</Label>
          <Input
            id="signup-name"
            name="displayName"
            type="text"
            placeholder="e.g. Juan dela Cruz"
            disabled={isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isPending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            required
            disabled={isPending}
          />
        </div>
        {state.error && (
          <p className="text-sm text-destructive" role="alert">{state.error}</p>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          id="signup-submit"
          type="submit"
          disabled={isPending}
          className="w-full gap-2 bg-[#800000] text-white hover:bg-[#660000]"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-[#800000] hover:underline"
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </form>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      {/* Branding */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#800000]">
          <GraduationCap className="h-7 w-7 text-[#FFD700]" />
        </div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Polytechnic University of the Philippines GWA Calculator
        </p>
      </div>

      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Sign in to access your GWA dashboard.'
              : 'Start tracking your academic progress today.'}
          </CardDescription>
        </CardHeader>

        {mode === 'signin' ? (
          <SignInForm onSwitch={() => setMode('signup')} />
        ) : (
          <SignUpForm onSwitch={() => setMode('signin')} />
        )}
      </Card>
    </div>
  )
}
