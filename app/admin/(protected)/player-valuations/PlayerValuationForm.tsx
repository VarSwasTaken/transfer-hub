'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { savePlayerValuationAction } from './actions';

type FormState = {
  error?: string;
} | null;

async function actionWrapper(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await savePlayerValuationAction(formData);
    return null;
  } catch (error: Error | unknown) {
    return { error: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania.' };
  }
}

type PlayerValuationInitialData = {
  _id?: string;
  playerId?: number;
  year?: number;
  month?: number;
  value?: number;
  currency?: string;
} | null;

export function PlayerValuationForm({ initialData, players }: { initialData?: PlayerValuationInitialData; players: { id: number; firstName: string; lastName: string }[] }) {
  const [state, formAction, isPending] = useActionState(actionWrapper, null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <form action={formAction} className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col gap-4">
      {initialData?._id && <input type="hidden" name="id" value={initialData._id.toString()} />}

      {state?.error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Zawodnik *</label>
        <select name="playerId" defaultValue={initialData?.playerId || ''} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="" disabled>
            Wybierz zawodnika...
          </option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Rok *</label>
          <input name="year" type="number" min="1900" max="2100" defaultValue={initialData?.year || currentYear} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Miesiąc (1-12) *</label>
          <input name="month" type="number" min="1" max="12" defaultValue={initialData?.month || currentMonth} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Wartość (w mln) *</label>
          <input name="value" type="number" step="0.01" min="0" defaultValue={initialData?.value || '0'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Waluta *</label>
          <input name="currency" type="text" defaultValue={initialData?.currency || 'EUR'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Link href="/admin/player-valuations" className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors text-sm font-medium">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md transition-colors text-sm font-medium disabled:opacity-50">
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>
    </form>
  );
}
