import { prisma } from '@/lib/prisma';
import { PlayerValuationForm } from '../PlayerValuationForm';

export default async function NewPlayerValuationPage() {
  const players = await prisma.player.findMany({
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: { id: true, firstName: true, lastName: true },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Wycenę Zawodnika</h1>
      <PlayerValuationForm players={players} />
    </div>
  );
}
