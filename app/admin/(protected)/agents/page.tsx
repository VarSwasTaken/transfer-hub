import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteAgentAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';
import { AdminSearchInput } from '@/components/admin/admin-search-input';

const PAGE_SIZE = 10;

export default async function AgentsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const query = sp.q || '';

  const whereClause = query
    ? {
        OR: [{ name: { contains: query, mode: 'insensitive' as const } }, { agency: { contains: query, mode: 'insensitive' as const } }],
      }
    : {};

  const [totalCount, agents] = await Promise.all([
    prisma.agent.count({ where: whereClause }),
    prisma.agent.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { players: true },
        },
      },
      orderBy: { name: 'asc' },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Agenci</h1>
        <Link href="/admin/agents/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Agenta
        </Link>
      </div>

      <div className="mb-6">
        <AdminSearchInput placeholder="Szukaj po osobie lub agencji..." />
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">ID</th>
              <th className="px-6 py-3 font-medium text-sm">Osoba reprezentująca</th>
              <th className="px-6 py-3 font-medium text-sm">Agencja</th>
              <th className="px-6 py-3 font-medium text-sm">Ilość Zawodników</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {agents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {agents.map((item) => (
              <tr key={item.id} className="hover:bg-accent/20">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{item.agency || '-'}</td>
                <td className="px-6 py-4">{item._count.players}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/agents/${item.id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteAgentAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Strona {currentPage} z {totalPages} (łącznie: {totalCount})
        </span>
        <div className="flex gap-2">
          {currentPage > 1 ? (
            <Link href={`/admin/agents?page=${currentPage - 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/agents?page=${currentPage + 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              Następna <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              Następna <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
