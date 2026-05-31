'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveContractAction } from './actions';

type FormState = {
  error?: string;
} | null;

async function actionWrapper(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await saveContractAction(formData);
    return null;
  } catch (error: Error | unknown) {
    return { error: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania kontraktu.' };
  }
}

type ContractInitialData = {
  id?: number;
  playerId?: number;
  startDate?: Date;
  endDate?: Date;
  salary?: { toString: () => string };
  releaseClause?: { toString: () => string } | null;
} | null;

export function ContractForm({ initialData, players }: { initialData?: ContractInitialData; players: { id: number; firstName: string; lastName: string }[] }) {
  const [state, formAction, isPending] = useActionState(actionWrapper, null);

  const formatInitialDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <form action={formAction} className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col gap-4">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

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
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Data od *</label>
          <input name="startDate" type="date" defaultValue={formatInitialDate(initialData?.startDate)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Data do *</label>
          <input name="endDate" type="date" defaultValue={formatInitialDate(initialData?.endDate)} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Pensja (Roczna/Waluta) *</label>
          <input name="salary" type="number" step="0.01" defaultValue={initialData?.salary?.toString() || ''} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Klauzula odstępnego (opcjonalnie)</label>
          <input name="releaseClause" type="number" step="0.01" defaultValue={initialData?.releaseClause?.toString() || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Link href="/admin/contracts" className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors text-sm font-medium">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md transition-colors text-sm font-medium disabled:opacity-50">
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>
    </form>
  );
}
