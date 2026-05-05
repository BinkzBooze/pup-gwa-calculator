'use client';

import { createTerm } from '@/app/actions/terms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { useActionState, useState } from 'react';

type FormState = { error: string | null };
const initialState: FormState = { error: null };

function AddTermForm({ onSuccess }: { onSuccess: () => void }) {
  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    const title = (formData.get('title') as string | null)?.trim();
    if (!title) return { error: 'Please enter a semester name.' };
    try {
      await createTerm(title);
      onSuccess();
      return { error: null };
    } catch {
      return { error: 'Failed to create semester. Please try again.' };
    }
  }

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="term-title" className="text-sm font-medium">
          Semester Name
        </Label>
        <Input
          id="term-title"
          name="title"
          placeholder="e.g. 1st Semester, AY 2024-2025"
          required
          disabled={isPending}
          className="text-sm"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Summer terms can be entered as &quot;Summer, AY 2024-2025&quot;.
        </p>
      </div>

      {state.error && (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <DialogFooter>
        <Button
          type="submit"
          disabled={isPending}
          className="gap-1.5 bg-[#800000] text-white hover:bg-[#660000] w-full sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          Add Semester
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AddTermButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            id="add-term-button"
            className="gap-2 bg-[#800000] text-white hover:bg-[#660000] shadow-md"
          />
        }
      >
        <PlusCircle className="h-4 w-4" />
        Add Semester
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add New Semester</DialogTitle>
          <DialogDescription>
            Enter the name of the academic term you want to track.
          </DialogDescription>
        </DialogHeader>
        <AddTermForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
