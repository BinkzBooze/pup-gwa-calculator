'use client';

import { createSubject } from '@/app/actions/subjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, PlusCircle } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';

const VALID_GRADES = [
  '1.0', '1.25', '1.5', '1.75',
  '2.0', '2.25', '2.5', '2.75',
  '3.0', '5.0', 'Inc', 'W',
];

type FormState = { error: string | null };

const initialState: FormState = { error: null };

function AddSubjectFormInner({
  termId,
  onSuccess,
}: {
  termId: string;
  onSuccess: () => void;
}) {
  const gradeRef = useRef<string>('1.0');

  async function action(_prev: FormState, formData: FormData): Promise<FormState> {
    const code = (formData.get('code') as string | null)?.trim();
    const units = formData.get('units') as string | null;
    const grade = gradeRef.current;

    if (!code) return { error: 'Course code is required.' };
    const unitsNum = Number(units);
    if (!units || isNaN(unitsNum) || unitsNum < 1 || unitsNum > 6)
      return { error: 'Units must be a number between 1 and 6.' };
    if (!grade) return { error: 'Please select a grade.' };

    try {
      await createSubject(termId, code, unitsNum, grade);
      onSuccess();
      return { error: null };
    } catch {
      return { error: 'Failed to add subject. Please try again.' };
    }
  }

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1">
        <Label htmlFor={`code-${termId}`} className="text-xs font-medium text-muted-foreground">
          Course Code
        </Label>
        <Input
          id={`code-${termId}`}
          name="code"
          placeholder="e.g. MATH 101"
          required
          disabled={isPending}
          className="h-8 font-mono text-sm"
        />
      </div>
      <div className="flex flex-col gap-1 w-20">
        <Label htmlFor={`units-${termId}`} className="text-xs font-medium text-muted-foreground">
          Units
        </Label>
        <Input
          id={`units-${termId}`}
          name="units"
          type="number"
          placeholder="3"
          min={1}
          max={6}
          required
          disabled={isPending}
          className="h-8 text-sm text-center"
        />
      </div>
      <div className="flex flex-col gap-1 w-28">
        <Label htmlFor={`grade-${termId}`} className="text-xs font-medium text-muted-foreground">
          Grade
        </Label>
        <Select
          defaultValue="1.0"
          onValueChange={(v) => { if (v) gradeRef.current = v; }}
          disabled={isPending}
        >
          <SelectTrigger id={`grade-${termId}`} className="h-8 text-sm">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            {VALID_GRADES.map((g) => (
              <SelectItem key={g} value={g} className="font-mono text-sm">
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="h-8 gap-1.5 bg-[#800000] text-white hover:bg-[#660000] shrink-0"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <PlusCircle className="h-3.5 w-3.5" />
        )}
        Add
      </Button>
      {state.error && (
        <p className="w-full text-xs text-destructive mt-1" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

export default function AddSubjectForm({ termId }: { termId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-[#800000]/40 hover:bg-[#800000]/5 hover:text-[#800000]"
      >
        <PlusCircle className="h-4 w-4" />
        Add Subject
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-[#800000]/20 bg-[#800000]/5 px-4 py-3">
      <AddSubjectFormInner
        termId={termId}
        onSuccess={() => setOpen(false)}
      />
    </div>
  );
}
