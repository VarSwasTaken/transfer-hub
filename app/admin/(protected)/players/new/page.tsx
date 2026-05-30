import { prisma } from '@/lib/prisma';
import { PlayerForm } from '../PlayerForm';

export default async function NewPlayerPage() {
  const [nationalities, clubs, agents] = await Promise.all([
    prisma.nationality.findMany({
      orderBy: { name_PL: 'asc' },
      select: { id: true, name_PL: true },
    }),
    prisma.club.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.agent.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Zawodnika</h1>
      <PlayerForm nationalities={nationalities} clubs={clubs} agents={agents} />
    </div>
  );
}
