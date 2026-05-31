import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteContractAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';
import { AdminSearchInput } from '@/components/admin/admin-search-input';

const PAGE_SIZE = 10;

export default async function ContractsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const query = sp.q || '';

  const whereClause = query
    ? {
        player: {
          OR: [{ firstName: { contains: query, mode: 'insensitive' as const } }, { lastName: { contains: query, mode: 'insensitive' as const } }],
        },
      }
    : {};

  const [totalCount, contracts] = await Promise.all([
    prisma.contract.count({ where: whereClause }),
    prisma.contract.findMany({
      where: whereClause,
      include: { player: true },
      orderBy: { endDate: 'desc' },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Kontrakty</h1>
        <Link href="/admin/contracts/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Kontrakt
        </Link>
      </div>

      <div className="mb-6">
        <AdminSearchInput placeholder="Szukaj po nazwisku zawodnika..." />
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">ID</th>
              <th className="px-6 py-3 font-medium text-sm">Zawodnik</th>
              <th className="px-6 py-3 font-medium text-sm">Okres</th>
              <th className="px-6 py-3 font-medium text-sm">Pensja</th>
              <th className="px-6 py-3 font-medium text-sm">Klauzula</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contracts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {contracts.map((item) => (
              <tr key={item.id} className="hover:bg-accent/20">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4 font-medium">
                  {item.player.firstName} {item.player.lastName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm">
                    <span>Od: {formatDate(item.startDate)}</span>
                    <span className="text-muted-foreground">Do: {formatDate(item.endDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-emerald-600 font-medium">{item.salary.toString()}</td>
                <td className="px-6 py-4 text-muted-foreground">{item.releaseClause ? item.releaseClause.toString() : '-'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/contracts/${item.id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteContractAction}>
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
            <Link href={`/admin/contracts?page=${currentPage - 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/contracts?page=${currentPage + 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
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
