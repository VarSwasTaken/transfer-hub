import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteTransferAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';
import { AdminSearchInput } from '@/components/admin/admin-search-input';

const PAGE_SIZE = 10;

export default async function TransfersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
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

  const [totalCount, transfers] = await Promise.all([
    prisma.transfer.count({ where: whereClause }),
    prisma.transfer.findMany({
      where: whereClause,
      include: { player: true, fromClub: true, toClub: true },
      orderBy: { date: 'desc' },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL');
  };

  const transferTypeMap: Record<string, string> = {
    PERMANENT: 'Definitywny',
    LOAN: 'Wypożyczenie',
    FREE: 'Wolny',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Transfery</h1>
        <Link href="/admin/transfers/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Transfer
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
              <th className="px-6 py-3 font-medium text-sm">Data</th>
              <th className="px-6 py-3 font-medium text-sm">Zawodnik</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Z (Klub)</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Do (Klub)</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Typ</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Kwota</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transfers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {transfers.map((item) => (
              <tr key={item.id} className="hover:bg-accent/20">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.date)}</td>
                <td className="px-6 py-4 font-medium">
                  {item.player.firstName} {item.player.lastName}
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">{item.fromClub?.name || 'Brak'}</td>
                <td className="px-6 py-4 text-center font-medium">{item.toClub.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-muted px-2 py-1 rounded text-xs font-semibold text-muted-foreground uppercase">{transferTypeMap[item.transferType] || item.transferType}</span>
                </td>
                <td className="px-6 py-4 text-right text-emerald-600 font-medium">{item.fee.toString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/transfers/${item.id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteTransferAction}>
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
            <Link href={`/admin/transfers?page=${currentPage - 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/transfers?page=${currentPage + 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
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
