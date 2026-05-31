import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import Injury from '@/models/Injury';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteInjuryAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';

const PAGE_SIZE = 10;

export default async function InjuriesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);

  await connectToDatabase();

  const [totalCount, injuriesDocs] = await Promise.all([
    Injury.countDocuments({}),
    Injury.find({})
      .sort({ startDate: -1 })
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Retrieve players to display their names
  const playerIds = injuriesDocs.map((doc: any) => doc.playerId);
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    select: { id: true, firstName: true, lastName: true },
  });

  const getPlayerName = (playerId: number) => {
    const p = players.find((pl) => pl.id === playerId);
    if (!p) return `ID: ${playerId}`;
    return `${p.firstName} ${p.lastName}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Kontuzje</h1>
        <Link href="/admin/injuries/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Kontuzję
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">Data Rozpoczęcia</th>
              <th className="px-6 py-3 font-medium text-sm">Zawodnik</th>
              <th className="px-6 py-3 font-medium text-sm">Typ</th>
              <th className="px-6 py-3 font-medium text-sm">Status</th>
              <th className="px-6 py-3 font-medium text-sm">Złożoność</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {injuriesDocs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {injuriesDocs.map((item: any) => (
              <tr key={item._id.toString()} className="hover:bg-accent/20">
                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(item.startDate).toLocaleDateString('pl-PL')}</td>
                <td className="px-6 py-4 font-medium">{getPlayerName(item.playerId)}</td>
                <td className="px-6 py-4">{item.type_PL}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${item.status === 'Wyleczona' ? 'bg-emerald-500/20 text-emerald-500' : item.status === 'Rehabilitacja' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-destructive/20 text-destructive'}`}>{item.status}</span>
                </td>
                <td className="px-6 py-4 text-sm">{item.severity}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/injuries/${item._id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteInjuryAction}>
                      <input type="hidden" name="id" value={item._id.toString()} />
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
            <Link href={`/admin/injuries?page=${currentPage - 1}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/injuries?page=${currentPage + 1}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
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
