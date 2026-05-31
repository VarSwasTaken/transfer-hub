'use server';

import { connectToDatabase } from '@/lib/mongoose';
import TransferRumor from '@/models/TransferRumor';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveTransferRumorAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string | null;
  const playerIdStr = formData.get('playerId') as string;
  const fromClubIdStr = formData.get('fromClubId') as string;
  const toClubIdStr = formData.get('toClubId') as string;
  const source = formData.get('source') as string;
  const credibility = formData.get('credibility') as 'Low' | 'Medium' | 'High';
  const status = formData.get('status') as 'Active' | 'Confirmed' | 'Denied' | 'Expired';
  const rumorType = formData.get('rumorType') as 'Transfer' | 'Loan' | 'Swap';
  const rumoredFeeStr = formData.get('rumoredFee') as string;
  const rumoredLoanFeeStr = formData.get('rumoredLoanFee') as string;
  const salaryExpectationStr = formData.get('salaryExpectation') as string;
  const contractYearsStr = formData.get('contractYears') as string;
  const currency = (formData.get('currency') as string) || 'EUR';
  const notes_PL = formData.get('notes_PL') as string;
  const notes_EN = formData.get('notes_EN') as string;
  const publishedAtStr = formData.get('publishedAt') as string;
  const expiresAtStr = formData.get('expiresAt') as string;
  const linksStr = formData.get('links') as string;

  if (!playerIdStr || !source || !publishedAtStr || !credibility || !status || !rumorType) {
    throw new Error('Dostarcz wymagane dane (Zawodnik, Żródło, Data Publikacji, Wiarygodność, Status, Typ).');
  }

  const data = {
    playerId: Number(playerIdStr),
    fromClubId: fromClubIdStr ? Number(fromClubIdStr) : null,
    toClubId: toClubIdStr ? Number(toClubIdStr) : null,
    source,
    credibility,
    status,
    rumorType,
    rumoredFee: rumoredFeeStr ? Number(rumoredFeeStr) : null,
    rumoredLoanFee: rumoredLoanFeeStr ? Number(rumoredLoanFeeStr) : null,
    salaryExpectation: salaryExpectationStr ? Number(salaryExpectationStr) : null,
    contractYears: contractYearsStr ? Number(contractYearsStr) : null,
    currency,
    notes_PL: notes_PL || null,
    notes_EN: notes_EN || null,
    publishedAt: new Date(publishedAtStr),
    expiresAt: expiresAtStr ? new Date(expiresAtStr) : null,
    links: linksStr
      ? linksStr
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean)
      : [],
  };

  if (idStr) {
    await TransferRumor.findByIdAndUpdate(idStr, data);
  } else {
    await TransferRumor.create(data);
  }

  revalidatePath('/admin/transfer-rumors');
  redirect('/admin/transfer-rumors');
}

export async function deleteTransferRumorAction(formData: FormData) {
  await connectToDatabase();
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await TransferRumor.findByIdAndDelete(idStr);

  revalidatePath('/admin/transfer-rumors');
}
