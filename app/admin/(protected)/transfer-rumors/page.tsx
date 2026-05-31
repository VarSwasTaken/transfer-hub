import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import TransferRumor from '@/models/TransferRumor';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteTransferRumorAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';

const PAGE_SIZE = 10;

export default async function TransferRumorsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);

  await connectToDatabase();

  const [totalCount, rumorsDocs] = await Promise.all([
    TransferRumor.countDocuments({}),
    TransferRumor.find({})
      .sort({ publishedAt: -1 })
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Retrieve players and clubs
  const playerIds = rumorsDocs.map((doc: any) => doc.playerId).filter(Boolean);
  const clubIds = [...rumorsDocs.map((doc: any) => doc.fromClubId), ...rumorsDocs.map((doc: any) => doc.toClubId)].filter(Boolean);

  const [players, clubs] = await Promise.all([
    prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.club.findMany({
      where: { id: { in: clubIds } },
      select: { id: true, name: true },
    }),
  ]);

  const getPlayerName = (playerId: number) => {
    const p = players.find((pl) => pl.id === playerId);
    if (!p) return `ID: ${playerId}`;
    return `${p.firstName} ${p.lastName}`;
  };

  const getClubName = (clubId?: number | null) => {
    if (!clubId) return '-';
    const c = clubs.find((cl) => cl.id === clubId);
    return c ? c.name : `ID: ${clubId}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Plotki Transferowe</h1>
        <Link href="/admin/transfer-rumors/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Plotkę
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">Data Publ.</th>
              <th className="px-6 py-3 font-medium text-sm">Zawodnik</th>
              <th className="px-6 py-3 font-medium text-sm">Transfer (Z - Do)</th>
              <th className="px-6 py-3 font-medium text-sm">Źródło</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Status</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rumorsDocs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {rumorsDocs.map((item: any) => (
              <tr key={item._id.toString()} className="hover:bg-accent/20">
                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(item.publishedAt).toLocaleDateString('pl-PL')}</td>
                <td className="px-6 py-4 font-medium">{getPlayerName(item.playerId)}</td>
                <td className="px-6 py-4 text-sm">
                  {getClubName(item.fromClubId)} &rarr; {getClubName(item.toClubId)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {item.source} <br />
                  <span className="text-xs text-muted-foreground">({item.credibility})</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${item.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-500' : item.status === 'Active' ? 'bg-blue-500/20 text-blue-500' : item.status === 'Denied' ? 'bg-destructive/20 text-destructive' : 'bg-muted/50 text-muted-foreground'}`}>{item.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/transfer-rumors/${item._id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteTransferRumorAction}>
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
            <Link href={`/admin/transfer-rumors?page=${currentPage - 1}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/transfer-rumors?page=${currentPage + 1}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
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
