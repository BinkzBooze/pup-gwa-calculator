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
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'

type FormState = {
  error: string | null
  fieldErrors?: Record<string, string>
  email?: string
  displayName?: string
  timestamp?: number
}
const initialState: FormState = { error: null }

function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    
    const fieldErrors: Record<string, string> = {}
    if (!email) fieldErrors.email = 'Email is required.'
    if (!password) fieldErrors.password = 'Password is required.'
    
    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors, email, timestamp: Date.now() }
    }

    const result = await signIn(email, password)
    
    if (result?.error) {
      return { 
        error: result.error, 
        email, 
        timestamp: Date.now(),
        fieldErrors: result.error.toLowerCase().includes('credential') || result.error.toLowerCase().includes('invalid')
          ? { email: ' ', password: ' ' }
          : undefined
      }
    }
    
    router.refresh()
    return { error: null, timestamp: Date.now() }
  }

  const [state, formAction, isPending] = useActionState(action, initialState)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (state.email !== undefined) {
      setEmail(state.email)
    }
  }, [state.email, state.timestamp])

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4 pt-4 pb-6">
        <div className="grid gap-2">
          <Label 
            htmlFor="signin-email" 
            className={state.fieldErrors?.email ? 'text-destructive' : ''}
          >
            Email
          </Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={state.fieldErrors?.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state.fieldErrors?.email && state.fieldErrors.email !== ' ' && (
            <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label 
            htmlFor="signin-password"
            className={state.fieldErrors?.password ? 'text-destructive' : ''}
          >
            Password
          </Label>
          <Input
            key={`pw-${state.timestamp}`}
            id="signin-password"
            name="password"
            type="password"
            required
            disabled={isPending}
            className={state.fieldErrors?.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state.fieldErrors?.password && state.fieldErrors.password !== ' ' && (
            <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
          )}
        </div>
        {state.error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {state.error}
          </p>
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
  const router = useRouter()
  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const displayName = (formData.get('displayName') as string)?.trim()
    
    const fieldErrors: Record<string, string> = {}
    if (!email) fieldErrors.email = 'Email is required.'
    if (!password) fieldErrors.password = 'Password is required.'
    else if (password.length < 6) fieldErrors.password = 'Password must be at least 6 characters.'
    
    if (password && confirmPassword && password !== confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match.'
    } else if (password && !confirmPassword) {
      fieldErrors.confirmPassword = 'Please confirm your password.'
    }
    
    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors, email, displayName, timestamp: Date.now() }
    }

    const result = await signUp(email, password, displayName || '')
    
    if (result?.error) {
      return { 
        error: result.error, 
        email, 
        displayName, 
        timestamp: Date.now(),
        fieldErrors: result.error.toLowerCase().includes('email') 
          ? { email: 'Email already in use or invalid.' } 
          : undefined
      }
    }
    
    router.refresh()
    return { error: null, timestamp: Date.now() }
  }

  const [state, formAction, isPending] = useActionState(action, initialState)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (state.email !== undefined) setEmail(state.email)
    if (state.displayName !== undefined) setDisplayName(state.displayName)
  }, [state.email, state.displayName, state.timestamp])

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4 pt-4 pb-6">
        <div className="grid gap-2">
          <Label 
            htmlFor="signup-name"
            className={state.fieldErrors?.displayName ? 'text-destructive' : ''}
          >
            Display Name
          </Label>
          <Input
            id="signup-name"
            name="displayName"
            type="text"
            placeholder="e.g. Juan dela Cruz"
            disabled={isPending}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={state.fieldErrors?.displayName ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state.fieldErrors?.displayName && (
            <p className="text-xs text-destructive">{state.fieldErrors.displayName}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label 
            htmlFor="signup-email"
            className={state.fieldErrors?.email ? 'text-destructive' : ''}
          >
            Email
          </Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={state.fieldErrors?.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label 
            htmlFor="signup-password"
            className={state.fieldErrors?.password ? 'text-destructive' : ''}
          >
            Password
          </Label>
          <Input
            key={`pw-signup-${state.timestamp}`}
            id="signup-password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            required
            disabled={isPending}
            className={state.fieldErrors?.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state.fieldErrors?.password && (
            <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label 
            htmlFor="signup-confirm-password"
            className={state.fieldErrors?.confirmPassword ? 'text-destructive' : ''}
          >
            Confirm Password
          </Label>
          <Input
            key={`pw-confirm-${state.timestamp}`}
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            required
            disabled={isPending}
            className={state.fieldErrors?.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>
        {state.error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {state.error}
          </p>
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
