import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { NationalityForm } from '../../NationalityForm';

export default async function EditNationalityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nationality = await prisma.nationality.findUnique({
    where: { id: Number(id) },
  });

  if (!nationality) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Narodowość</h1>
      <NationalityForm initialData={nationality} />
    </div>
  );
}
