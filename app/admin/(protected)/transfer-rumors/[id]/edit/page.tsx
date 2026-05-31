import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import TransferRumor from '@/models/TransferRumor';
import { notFound } from 'next/navigation';
import { TransferRumorForm } from '../../TransferRumorForm';

export default async function EditTransferRumorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();

  const [rumorDoc, players, clubs] = await Promise.all([
    TransferRumor.findById(id).lean(),
    prisma.player.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.club.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  if (!rumorDoc) return notFound();

  const rumor = {
    ...rumorDoc,
    _id: rumorDoc._id?.toString(),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Plotkę Transferową</h1>
      <TransferRumorForm initialData={rumor as any} players={players} clubs={clubs} />
    </div>
  );
}
