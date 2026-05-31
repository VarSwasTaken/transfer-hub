'use server';

import { connectToDatabase } from '@/lib/mongoose';
import Injury from '@/models/Injury';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveInjuryAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string | null;
  const playerIdStr = formData.get('playerId') as string;
  const type_PL = formData.get('type_PL') as string;
  const type_EN = formData.get('type_EN') as string;
  const severity = formData.get('severity') as 'Lekka' | 'Średnia' | 'Poważna' | 'Krytyczna';
  const startDateStr = formData.get('startDate') as string;
  const expectedReturnDateStr = formData.get('expectedReturnDate') as string;
  const actualReturnDateStr = formData.get('actualReturnDate') as string;
  const status = formData.get('status') as 'W trakcie leczenia' | 'Rehabilitacja' | 'Wyleczona';
  const description_PL = formData.get('description_PL') as string;
  const description_EN = formData.get('description_EN') as string;
  const treatment_PL = formData.get('treatment_PL') as string;
  const treatment_EN = formData.get('treatment_EN') as string;
  const reportedBy = formData.get('reportedBy') as string;

  if (!playerIdStr || !type_PL || !type_EN || !severity || !startDateStr || !status) {
    throw new Error('Dostarcz wymagane dane (Zawodnik, Typy, Złożoność, Data Początkowa, Status).');
  }

  const data = {
    playerId: Number(playerIdStr),
    type_PL,
    type_EN,
    severity,
    startDate: new Date(startDateStr),
    expectedReturnDate: expectedReturnDateStr ? new Date(expectedReturnDateStr) : null,
    actualReturnDate: actualReturnDateStr ? new Date(actualReturnDateStr) : null,
    status,
    description_PL: description_PL || null,
    description_EN: description_EN || null,
    treatment_PL: treatment_PL || null,
    treatment_EN: treatment_EN || null,
    reportedBy: reportedBy || null,
  };

  if (idStr) {
    await Injury.findByIdAndUpdate(idStr, data);
  } else {
    await Injury.create(data);
  }

  revalidatePath('/admin/injuries');
  redirect('/admin/injuries');
}

export async function deleteInjuryAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await Injury.findByIdAndDelete(idStr);

  revalidatePath('/admin/injuries');
}
