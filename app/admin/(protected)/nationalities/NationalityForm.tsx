'use client';

import { useActionState } from 'react';
import { saveNationalityAction } from './actions';
import Link from 'next/link';

export function NationalityForm({ initialData }: { initialData?: { id?: number; name: string; name_PL: string; flagUrl: string | null } | null }) {
  const [state, formAction] = useActionState(saveNationalityAction, null);

  return (
    <form action={formAction} className="bg-card border border-border p-6 rounded-lg shadow space-y-4">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {state?.error && <div className="p-3 bg-destructive/20 text-destructive-foreground rounded text-sm border border-destructive/50">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Nazwa (EN) *</label>
        <input name="name" defaultValue={initialData?.name || ''} required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Nazwa (PL) *</label>
        <input name="name_PL" defaultValue={initialData?.name_PL || ''} required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Link do flagi (URL)</label>
        <input name="flagUrl" defaultValue={initialData?.flagUrl || ''} className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-md transition-colors">
          Zapisz
        </button>
        <Link href="/admin/nationalities" className="bg-muted text-muted-foreground hover:text-foreground px-6 py-2 rounded-md transition-colors">
          Anuluj
        </Link>
      </div>
    </form>
  );
}
