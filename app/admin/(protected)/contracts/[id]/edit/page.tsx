import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ContractForm } from '../../ContractForm';

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [contract, players] = await Promise.all([
    prisma.contract.findUnique({ where: { id: Number(id) } }),
    prisma.player.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  if (!contract) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Kontrakt</h1>
      <ContractForm initialData={contract as unknown as React.ComponentProps<typeof ContractForm>['initialData']} players={players} />
    </div>
  );
}
