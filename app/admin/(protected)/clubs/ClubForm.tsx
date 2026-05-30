'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveClubAction } from './actions';

type FormState = {
  error?: string;
} | null;

async function actionWrapper(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await saveClubAction(formData);
    return null;
  } catch (error: Error | unknown) {
    return { error: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania klubu.' };
  }
}

export function ClubForm({ initialData, leagues }: { initialData?: { id?: number; name?: string; budget?: { toString: () => string }; logoUrl?: string | null; leagueId?: number } | null; leagues: { id: number; name: string }[] }) {
  const [state, formAction, isPending] = useActionState(actionWrapper, null);

  return (
    <form action={formAction} className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col gap-4">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      {state?.error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Nazwa Klubu *</label>
        <input name="name" type="text" defaultValue={initialData?.name} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Liga *</label>
        <select name="leagueId" defaultValue={initialData?.leagueId || ''} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="" disabled>
            Wybierz ligę...
          </option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Budżet (w milionach/walucie, domyślnie: 0)</label>
        <input name="budget" type="number" step="0.01" defaultValue={initialData?.budget?.toString()} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">URL Herbu / Logo</label>
        <input name="logoUrl" type="url" defaultValue={initialData?.logoUrl || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Link href="/admin/clubs" className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors text-sm font-medium">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md transition-colors text-sm font-medium disabled:opacity-50">
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>
    </form>
  );
}
