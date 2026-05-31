import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import Injury from '@/models/Injury';
import { notFound } from 'next/navigation';
import { InjuryForm } from '../../InjuryForm';

export default async function EditInjuryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();

  const [injuryDoc, players] = await Promise.all([
    Injury.findById(id).lean(),
    prisma.player.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  if (!injuryDoc) return notFound();

  // Konwersja ObjectId na string dla komponentu klienckiego
  const injury = {
    ...injuryDoc,
    _id: injuryDoc._id?.toString(),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Kontuzję</h1>
      <InjuryForm initialData={injury as any} players={players} />
    </div>
  );
}
