import { prisma } from '@/lib/prisma';
import { LeagueForm } from '../LeagueForm';

export default async function NewLeaguePage() {
  const nationalities = await prisma.nationality.findMany({
    orderBy: { name_PL: 'asc' },
    select: { id: true, name_PL: true },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Ligę</h1>
      <LeagueForm nationalities={nationalities} />
    </div>
  );
}
