import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import PlayerValuation from '@/models/PlayerValuation';
import { notFound } from 'next/navigation';
import { PlayerValuationForm } from '../../PlayerValuationForm';

export default async function EditPlayerValuationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();

  const [valuationDoc, players] = await Promise.all([
    PlayerValuation.findById(id).lean(),
    prisma.player.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  if (!valuationDoc) return notFound();

  // Konwersja ObjectId na string dla komponentu klienckiego
  const valuation = {
    ...valuationDoc,
    _id: valuationDoc._id?.toString(),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Wycenę Zawodnika</h1>
      <PlayerValuationForm initialData={valuation as any} players={players} />
    </div>
  );
}
