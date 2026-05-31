import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import ClubValuation from '@/models/ClubValuation';
import { notFound } from 'next/navigation';
import { ClubValuationForm } from '../../ClubValuationForm';

export default async function EditClubValuationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();

  const [valuationDoc, clubs] = await Promise.all([
    ClubValuation.findById(id).lean(),
    prisma.club.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
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
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Wycenę Klubu</h1>
      <ClubValuationForm initialData={valuation as any} clubs={clubs} />
    </div>
  );
}
