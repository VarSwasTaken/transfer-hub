import { prisma } from '@/lib/prisma';
import { TransferRumorForm } from '../TransferRumorForm';

export default async function NewTransferRumorPage() {
  const [players, clubs] = await Promise.all([
    prisma.player.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.club.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Plotkę Transferową</h1>
      <TransferRumorForm players={players} clubs={clubs} />
    </div>
  );
}
