import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AgentForm } from '../../AgentForm';

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const agent = await prisma.agent.findUnique({ where: { id: Number(id) } });

  if (!agent) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Edytuj Agenta</h1>
      <AgentForm initialData={agent} />
    </div>
  );
}
