import { prisma } from '@/lib/prisma';
import { ClubValuationForm } from '../ClubValuationForm';

export default async function NewClubValuationPage() {
  const clubs = await prisma.club.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Wycenę Klubu</h1>
      <ClubValuationForm clubs={clubs} />
    </div>
  );
}
