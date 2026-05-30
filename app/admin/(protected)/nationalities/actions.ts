'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteNationalityAction(formData: FormData) {
  const id = Number(formData.get('id'));

  if (id) {
    try {
      await prisma.nationality.delete({ where: { id } });
    } catch (e) {
      console.error(e);
      // w prawdziwej rpodukcji zwrocilibysmy error via useActionState
    }
  }

  revalidatePath('/admin/nationalities');
}

export async function saveNationalityAction(prevState: { error: string } | null, formData: FormData) {
  const id = formData.get('id') ? Number(formData.get('id')) : null;
  const name = formData.get('name') as string;
  const name_PL = formData.get('name_PL') as string;
  const flagUrl = formData.get('flagUrl') as string;

  if (!name || !name_PL) return { error: 'Nazwy (PL i EN) są wymagane.' };

  try {
    if (id) {
      await prisma.nationality.update({
        where: { id },
        data: { name, name_PL, flagUrl: flagUrl || null },
      });
    } else {
      await prisma.nationality.create({
        data: { name, name_PL, flagUrl: flagUrl || null },
      });
    }
  } catch (e: unknown) {
    console.error(e);
    return { error: 'Błąd podczas zapisu do bazy danych. Prawdopodobnie nazwa już istnieje.' };
  }

  revalidatePath('/admin/nationalities');
  redirect('/admin/nationalities');
}
