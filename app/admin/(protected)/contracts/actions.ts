'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveContractAction(formData: FormData) {
  const idStr = formData.get('id') as string | null;
  const playerIdStr = formData.get('playerId') as string;
  const startDateStr = formData.get('startDate') as string;
  const endDateStr = formData.get('endDate') as string;
  const salaryStr = formData.get('salary') as string;
  const releaseClauseStr = formData.get('releaseClause') as string;

  if (!playerIdStr || !startDateStr || !endDateStr || !salaryStr) {
    throw new Error('Dostarcz wymagane dane (Głównemu zawodnikowi, daty oraz pensję).');
  }

  const data = {
    playerId: Number(playerIdStr),
    startDate: new Date(startDateStr),
    endDate: new Date(endDateStr),
    salary: Number(salaryStr),
    releaseClause: releaseClauseStr ? Number(releaseClauseStr) : null,
  };

  if (idStr) {
    await prisma.contract.update({
      where: { id: Number(idStr) },
      data,
    });
  } else {
    await prisma.contract.create({
      data,
    });
  }

  revalidatePath('/admin/contracts');
  redirect('/admin/contracts');
}

export async function deleteContractAction(formData: FormData) {
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await prisma.contract.delete({
    where: { id: Number(idStr) },
  });

  revalidatePath('/admin/contracts');
}
