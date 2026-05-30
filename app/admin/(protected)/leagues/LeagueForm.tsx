'use client';

import { useActionState } from 'react';
import { saveLeagueAction } from './actions';
import Link from 'next/link';

export function LeagueForm({ initialData, nationalities }: { initialData?: { id?: number; name: string; slug: string; logoUrl: string | null; nationalityId: number } | null; nationalities: { id: number; name_PL: string }[] }) {
  const [state, formAction] = useActionState(saveLeagueAction, null);

  return (
    <form action={formAction} className="bg-card border border-border p-6 rounded-lg shadow space-y-4">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {state?.error && <div className="p-3 bg-destructive/20 text-destructive-foreground rounded text-sm border border-destructive/50">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Nazwa *</label>
        <input name="name" defaultValue={initialData?.name || ''} required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Slug (element linku URL, np. &quot;premier-league&quot;) *</label>
        <input name="slug" defaultValue={initialData?.slug || ''} required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Kraj (Narodowość) *</label>
        <select name="nationalityId" defaultValue={initialData?.nationalityId || ''} required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none">
          <option value="" disabled>
            Wybierz kraj ligi...
          </option>
          {nationalities.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name_PL}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Link do logo (URL)</label>
        <input name="logoUrl" defaultValue={initialData?.logoUrl || ''} className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-md transition-colors">
          Zapisz
        </button>
        <Link href="/admin/leagues" className="bg-muted text-muted-foreground hover:text-foreground px-6 py-2 rounded-md transition-colors">
          Anuluj
        </Link>
      </div>
    </form>
  );
}
