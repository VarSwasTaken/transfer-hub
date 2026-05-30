import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PlayerForm } from '../../PlayerForm';

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [player, nationalities, clubs, agents] = await Promise.all([
    prisma.player.findUnique({ where: { id: Number(id) } }),
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

  if (!player) return notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Zawodnika</h1>
      <PlayerForm initialData={player as unknown as React.ComponentProps<typeof PlayerForm>['initialData']} nationalities={nationalities} clubs={clubs} agents={agents} />
    </div>
  );
}
