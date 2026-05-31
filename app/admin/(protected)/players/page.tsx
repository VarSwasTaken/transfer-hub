import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deletePlayerAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';
import { AdminSearchInput } from '@/components/admin/admin-search-input';
import { getPlayerPositionAbbreviation } from '@/lib/utils';

const PAGE_SIZE = 10;

export default async function PlayersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);
  const query = sp.q || '';

  const whereClause = query
    ? {
        OR: [{ firstName: { contains: query, mode: 'insensitive' as const } }, { lastName: { contains: query, mode: 'insensitive' as const } }],
      }
    : {};

  const [totalCount, players] = await Promise.all([
    prisma.player.count({ where: whereClause }),
    prisma.player.findMany({
      where: whereClause,
      include: { nationality: true, club: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Zawodnicy</h1>
        <Link href="/admin/players/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Zawodnika
        </Link>
      </div>

      <div className="mb-6">
        <AdminSearchInput placeholder="Szukaj po nazwisku lub imieniu..." />
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">ID</th>
              <th className="px-6 py-3 font-medium text-sm">Zdjęcie</th>
              <th className="px-6 py-3 font-medium text-sm">Imię i Nazwisko</th>
              <th className="px-6 py-3 font-medium text-sm">Kraj</th>
              <th className="px-6 py-3 font-medium text-sm">Klub (Numer)</th>
              <th className="px-6 py-3 font-medium text-sm">Pozycja</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {players.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {players.map((item) => (
              <tr key={item.id} className="hover:bg-accent/20">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-8 h-8 object-cover rounded-full" /> : '-'}
                </td>
                <td className="px-6 py-4 font-medium">
                  {item.firstName} {item.lastName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item.nationality?.flagUrl && <img src={item.nationality.flagUrl} alt="" className="w-4 h-3 object-cover rounded-sm" />}
                    {item.nationality?.name_PL}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.club?.name || 'Brak klubu'} <span className="text-foreground ml-1">({item.shirtNumber})</span>
                </td>
                <td className="px-6 py-4">{getPlayerPositionAbbreviation(item.position)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/players/${item.id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deletePlayerAction}>
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
            <Link href={`/admin/players?page=${currentPage - 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/players?page=${currentPage + 1}${query ? `&q=${query}` : ''}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
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
