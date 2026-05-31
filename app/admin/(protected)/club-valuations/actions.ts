'use server';

import { connectToDatabase } from '@/lib/mongoose';
import ClubValuation from '@/models/ClubValuation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveClubValuationAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string | null;
  const clubIdStr = formData.get('clubId') as string;
  const yearStr = formData.get('year') as string;
  const valueStr = formData.get('value') as string;
  const currencyStr = (formData.get('currency') as string) || 'EUR';

  if (!clubIdStr || !yearStr || !valueStr) {
    throw new Error('Dostarcz wymagane dane (Klub, Rok, Wartość).');
  }

  const data = {
    clubId: Number(clubIdStr),
    year: Number(yearStr),
    value: Number(valueStr),
    currency: currencyStr,
  };

  if (idStr) {
    await ClubValuation.findByIdAndUpdate(idStr, data);
  } else {
    // Check for duplicates
    const exist = await ClubValuation.findOne({ clubId: data.clubId, year: data.year });
    if (exist) {
      throw new Error(`Wycena dla tego klubu w roku ${data.year} już istnieje!`);
    }
    await ClubValuation.create(data);
  }

  revalidatePath('/admin/club-valuations');
  redirect('/admin/club-valuations');
}

export async function deleteClubValuationAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await ClubValuation.findByIdAndDelete(idStr);

  revalidatePath('/admin/club-valuations');
}
