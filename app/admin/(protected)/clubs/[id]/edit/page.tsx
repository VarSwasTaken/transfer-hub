import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ClubForm } from '../../ClubForm';

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [club, leagues] = await Promise.all([
    prisma.club.findUnique({ where: { id: Number(id) } }),
    prisma.league.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  if (!club) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Klub</h1>
      <ClubForm initialData={club} leagues={leagues} />
    </div>
  );
}
