'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveTransferRumorAction } from './actions';

type FormState = {
  error?: string;
} | null;

async function actionWrapper(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await saveTransferRumorAction(formData);
    return null;
  } catch (error: Error | unknown) {
    return { error: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania.' };
  }
}

type TransferRumorInitialData = {
  _id?: string;
  playerId?: number;
  fromClubId?: number | null;
  toClubId?: number | null;
  source?: string;
  credibility?: string;
  status?: string;
  rumorType?: string;
  rumoredFee?: number | null;
  rumoredLoanFee?: number | null;
  salaryExpectation?: number | null;
  contractYears?: number | null;
  currency?: string;
  links?: string[];
  notes_PL?: string;
  notes_EN?: string;
  publishedAt?: Date;
  expiresAt?: Date | null;
} | null;

export function TransferRumorForm({ initialData, players, clubs }: { initialData?: TransferRumorInitialData; players: { id: number; firstName: string; lastName: string }[]; clubs: { id: number; name: string }[] }) {
  const [state, formAction, isPending] = useActionState(actionWrapper, null);

  const formatInitialDate = (date?: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

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
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Ze Szeregu/Klubu (Z)</label>
          <select name="fromClubId" defaultValue={initialData?.fromClubId || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">-- Brak klubu --</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Klub Docelowy (Do)</label>
          <select name="toClubId" defaultValue={initialData?.toClubId || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">-- Brak klubu --</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Źródło Plotki *</label>
          <input name="source" type="text" defaultValue={initialData?.source || ''} required placeholder="np. Fabrizio Romano, Sky Sports" className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Wiarygodność *</label>
          <select name="credibility" defaultValue={initialData?.credibility || 'Medium'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Low">Niska</option>
            <option value="Medium">Średnia</option>
            <option value="High">Wysoka</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Status *</label>
          <select name="status" defaultValue={initialData?.status || 'Active'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Active">Aktywna</option>
            <option value="Confirmed">Potwierdzona</option>
            <option value="Denied">Zdementowana</option>
            <option value="Expired">Przedawniona</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Typ *</label>
          <select name="rumorType" defaultValue={initialData?.rumorType || 'Transfer'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Transfer">Transfer</option>
            <option value="Loan">Wypożyczenie</option>
            <option value="Swap">Wymiana</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Kwota Transferu (mln)</label>
          <input name="rumoredFee" type="number" step="0.01" min="0" defaultValue={initialData?.rumoredFee || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Oczekiwana Pensja (mln)</label>
          <input name="salaryExpectation" type="number" step="0.01" min="0" defaultValue={initialData?.salaryExpectation || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Data Publikacji *</label>
          <input name="publishedAt" type="date" defaultValue={formatInitialDate(initialData?.publishedAt || new Date())} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Wygasa (Opcjonalnie)</label>
          <input name="expiresAt" type="date" defaultValue={formatInitialDate(initialData?.expiresAt)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Notatki / Kontekst (PL)</label>
          <textarea name="notes_PL" defaultValue={initialData?.notes_PL || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Notatki / Kontekst (EN)</label>
          <textarea name="notes_EN" defaultValue={initialData?.notes_EN || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Linki (po przecinku)</label>
        <input name="links" type="text" placeholder="https://twitter.com/..., https://skysports.com/..." defaultValue={initialData?.links?.join(', ') || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Link href="/admin/transfer-rumors" className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors text-sm font-medium">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md transition-colors text-sm font-medium disabled:opacity-50">
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>
    </form>
  );
}
