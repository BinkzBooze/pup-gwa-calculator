'use client';

import { deleteSubject } from '@/app/actions/subjects';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

export default function DeleteSubjectButton({ subjectId }: { subjectId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      className="opacity-0 group-hover/row:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
      onClick={() => {
        startTransition(async () => {
          await deleteSubject(subjectId);
        });
      }}
      aria-label="Delete subject"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
