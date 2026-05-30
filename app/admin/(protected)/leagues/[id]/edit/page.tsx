import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { LeagueForm } from '../../LeagueForm';

export default async function EditLeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [league, nationalities] = await Promise.all([
    prisma.league.findUnique({ where: { id: Number(id) } }),
    prisma.nationality.findMany({
      orderBy: { name_PL: 'asc' },
      select: { id: true, name_PL: true },
    }),
  ]);

  if (!league) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Ligę</h1>
      <LeagueForm initialData={league} nationalities={nationalities} />
    </div>
  );
}
