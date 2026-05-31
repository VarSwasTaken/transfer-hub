import { prisma } from '@/lib/prisma';
import { ContractForm } from '../ContractForm';

export default async function NewContractPage() {
  const players = await prisma.player.findMany({
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: { id: true, firstName: true, lastName: true },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Kontrakt</h1>
      <ContractForm players={players} />
    </div>
  );
}
