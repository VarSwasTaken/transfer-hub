import { prisma } from '@/lib/prisma';
import { ClubForm } from '../ClubForm';

export default async function NewClubPage() {
  const leagues = await prisma.league.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Klub</h1>
      <ClubForm leagues={leagues} />
    </div>
  );
}
