'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveClubAction(formData: FormData) {
  const idStr = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const budgetStr = formData.get('budget') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const leagueIdStr = formData.get('leagueId') as string;

  if (!name || !leagueIdStr) {
    throw new Error('Nazwa i przypisanie do ligi są wymagane');
  }

  const leagueId = Number(leagueIdStr);
  const budget = budgetStr ? Number(budgetStr) : 0;

  try {
    if (idStr) {
      await prisma.club.update({
        where: { id: Number(idStr) },
        data: { name, budget, logoUrl, leagueId },
      });
    } else {
      await prisma.club.create({
        data: { name, budget, logoUrl, leagueId },
      });
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      throw new Error('Klub o takiej nazwie już istnieje.');
    }
    throw error;
  }

  revalidatePath('/admin/clubs');
  redirect('/admin/clubs');
}

export async function deleteClubAction(formData: FormData) {
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await prisma.club.delete({
    where: { id: Number(idStr) },
  });

  revalidatePath('/admin/clubs');
}
