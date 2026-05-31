import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/lib/mongoose';
import ClubValuation from '@/models/ClubValuation';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteClubValuationAction } from './actions';
import { DeleteButton } from '@/components/admin/delete-button';

const PAGE_SIZE = 10;

export default async function ClubValuationsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page) || 1);

  await connectToDatabase();

  const [totalCount, valuationsDocs] = await Promise.all([
    ClubValuation.countDocuments({}),
    ClubValuation.find({})
      .sort({ year: -1 })
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Retrieve clubs to display their names
  const clubIds = valuationsDocs.map((doc: any) => doc.clubId);
  const clubs = await prisma.club.findMany({
    where: { id: { in: clubIds } },
    select: { id: true, name: true },
  });

  const getClubName = (clubId: number) => {
    const c = clubs.find((cl) => cl.id === clubId);
    if (!c) return `ID: ${clubId}`;
    return c.name;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Wyceny Klubów</h1>
        <Link href="/admin/club-valuations/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
          Dodaj Wycenę
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">Zaktualizowano (MongoDB)</th>
              <th className="px-6 py-3 font-medium text-sm">Klub</th>
              <th className="px-6 py-3 font-medium text-sm text-center">Rok</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Wartość</th>
              <th className="px-6 py-3 font-medium text-sm text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {valuationsDocs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                  Brak danych
                </td>
              </tr>
            )}
            {valuationsDocs.map((item: any) => (
              <tr key={item._id.toString()} className="hover:bg-accent/20">
                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(item.updatedAt || item.createdAt || '').toLocaleDateString('pl-PL')}</td>
                <td className="px-6 py-4 font-medium">{getClubName(item.clubId)}</td>
                <td className="px-6 py-4 text-center">{item.year}</td>
                <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                  {item.value} {item.currency}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/club-valuations/${item._id}/edit`} className="text-blue-500 hover:text-blue-400">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteClubValuationAction}>
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
            <Link href={`/admin/club-valuations?page=${currentPage - 1}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Poprzednia
            </span>
          )}
          {currentPage < totalPages ? (
            <Link href={`/admin/club-valuations?page=${currentPage + 1}`} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
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
