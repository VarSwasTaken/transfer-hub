'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveAgentAction(formData: FormData) {
  const idStr = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const agency = formData.get('agency') as string;

  if (!name) {
    throw new Error('Dostarcz nazwę (Osoba / Firma).');
  }

  const data = {
    name,
    agency: agency || null,
  };

  if (idStr) {
    await prisma.agent.update({
      where: { id: Number(idStr) },
      data,
    });
  } else {
    await prisma.agent.create({
      data,
    });
  }

  revalidatePath('/admin/agents');
  redirect('/admin/agents');
}

export async function deleteAgentAction(formData: FormData) {
  const idStr = formData.get('id') as string;
  if (!idStr) return;

  await prisma.agent.delete({
    where: { id: Number(idStr) },
  });

  revalidatePath('/admin/agents');
}
