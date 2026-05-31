'use server';

import { connectToDatabase } from '@/lib/mongoose';
import PlayerValuation from '@/models/PlayerValuation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function savePlayerValuationAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string | null;
  const playerIdStr = formData.get('playerId') as string;
  const yearStr = formData.get('year') as string;
  const monthStr = formData.get('month') as string;
  const valueStr = formData.get('value') as string;
  const currencyStr = (formData.get('currency') as string) || 'EUR';

  if (!playerIdStr || !yearStr || !monthStr || !valueStr) {
    throw new Error('Dostarcz wymagane dane (Zawodnik, Rok, Miesiąc, Wartość).');
  }

  const data = {
    playerId: Number(playerIdStr),
    year: Number(yearStr),
    month: Number(monthStr),
    value: Number(valueStr),
    currency: currencyStr,
  };

  if (idStr) {
    await PlayerValuation.findByIdAndUpdate(idStr, data);
  } else {
    // Basic Check for duplicates
    const exist = await PlayerValuation.findOne({ playerId: data.playerId, year: data.year, month: data.month });
    if (exist) {
      throw new Error(`Wycena dla tego zawodnika w ${data.month}/${data.year} już istnieje!`);
    }
    await PlayerValuation.create(data);
  }

  revalidatePath('/admin/player-valuations');
  redirect('/admin/player-valuations');
}

export async function deletePlayerValuationAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await PlayerValuation.findByIdAndDelete(idStr);

  revalidatePath('/admin/player-valuations');
}
