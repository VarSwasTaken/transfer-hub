'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveInjuryAction } from './actions';

type FormState = {
  error?: string;
} | null;

async function actionWrapper(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await saveInjuryAction(formData);
    return null;
  } catch (error: Error | unknown) {
    return { error: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania.' };
  }
}

type InjuryInitialData = {
  _id?: string;
  playerId?: number;
  type_PL?: string;
  type_EN?: string;
  severity?: string;
  startDate?: Date;
  expectedReturnDate?: Date | null;
  actualReturnDate?: Date | null;
  status?: string;
  description_PL?: string;
  description_EN?: string;
  treatment_PL?: string;
  treatment_EN?: string;
  reportedBy?: string;
} | null;

export function InjuryForm({ initialData, players }: { initialData?: InjuryInitialData; players: { id: number; firstName: string; lastName: string }[] }) {
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
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Typ Kontuzji (PL) *</label>
          <input name="type_PL" type="text" defaultValue={initialData?.type_PL || ''} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Typ Kontuzji (EN) *</label>
          <input name="type_EN" type="text" defaultValue={initialData?.type_EN || ''} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Oczekiwany czas (Złożoność) *</label>
          <select name="severity" defaultValue={initialData?.severity || 'Średnia'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Lekka">Lekka</option>
            <option value="Średnia">Średnia</option>
            <option value="Poważna">Poważna</option>
            <option value="Krytyczna">Krytyczna</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Status *</label>
          <select name="status" defaultValue={initialData?.status || 'W trakcie leczenia'} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="W trakcie leczenia">W trakcie leczenia</option>
            <option value="Rehabilitacja">Rehabilitacja</option>
            <option value="Wyleczona">Wyleczona</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Data Początkowa *</label>
          <input name="startDate" type="date" defaultValue={formatInitialDate(initialData?.startDate || new Date())} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Przewidywany Powrót</label>
          <input name="expectedReturnDate" type="date" defaultValue={formatInitialDate(initialData?.expectedReturnDate)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Faktyczny Powrót</label>
          <input name="actualReturnDate" type="date" defaultValue={formatInitialDate(initialData?.actualReturnDate)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Opis (PL)</label>
          <textarea name="description_PL" defaultValue={initialData?.description_PL || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Opis (EN)</label>
          <textarea name="description_EN" defaultValue={initialData?.description_EN || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Leczenie (PL)</label>
          <textarea name="treatment_PL" defaultValue={initialData?.treatment_PL || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Leczenie (EN)</label>
          <textarea name="treatment_EN" defaultValue={initialData?.treatment_EN || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Zgłoszone Przez</label>
        <input name="reportedBy" type="text" defaultValue={initialData?.reportedBy || ''} className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Link href="/admin/injuries" className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors text-sm font-medium">
          Anuluj
        </Link>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md transition-colors text-sm font-medium disabled:opacity-50">
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </div>
    </form>
  );
}
