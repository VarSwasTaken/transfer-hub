'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteLeagueAction(formData: FormData) {
  const id = Number(formData.get('id'));

  if (id) {
    try {
      await prisma.league.delete({ where: { id } });
    } catch (e) {
      console.error('Cannot delete league', e);
    }
  }

  revalidatePath('/admin/leagues');
}

export async function saveLeagueAction(prevState: { error: string } | null, formData: FormData) {
  const id = formData.get('id') ? Number(formData.get('id')) : null;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const logoUrl = formData.get('logoUrl') as string;
  const nationalityIdString = formData.get('nationalityId') as string;
  const nationalityId = nationalityIdString ? Number(nationalityIdString) : null;

  if (!name || !slug || !nationalityId) return { error: 'Nazwa, slug i kraj są wymagane.' };

  try {
    if (id) {
      await prisma.league.update({
        where: { id },
        data: { name, slug, logoUrl: logoUrl || null, nationalityId },
      });
    } else {
      await prisma.league.create({
        data: { name, slug, logoUrl: logoUrl || null, nationalityId },
      });
    }
  } catch (e: unknown) {
    console.error(e);
    return { error: 'Błąd zapisu do bazy danych. Prawdopodobnie liga lub slug już istnieje.' };
  }

  revalidatePath('/admin/leagues');
  redirect('/admin/leagues');
}
