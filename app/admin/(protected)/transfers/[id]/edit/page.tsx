import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { TransferForm } from '../../TransferForm';

export default async function EditTransferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [transfer, players, clubs] = await Promise.all([
    prisma.transfer.findUnique({ where: { id: Number(id) } }),
    prisma.player.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.club.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  if (!transfer) return notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Transfer</h1>
      <TransferForm initialData={transfer as unknown as React.ComponentProps<typeof TransferForm>['initialData']} players={players} clubs={clubs} />
    </div>
  );
}
