import { prisma } from '@/lib/prisma';
import { InjuryForm } from '../InjuryForm';

export default async function NewInjuryPage() {
  const players = await prisma.player.findMany({
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: { id: true, firstName: true, lastName: true },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Kontuzję</h1>
      <InjuryForm players={players} />
    </div>
  );
}
