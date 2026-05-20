'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';

const POSITIONS: Record<string, { pl: string; en: string }> = {
  GOALKEEPER: { pl: 'Bramkarz', en: 'Goalkeeper' },
  DEFENDER: { pl: 'Obrońca', en: 'Defender' },
  MIDFIELDER: { pl: 'Pomocnik', en: 'Midfielder' },
  FORWARD: { pl: 'Napastnik', en: 'Forward' },
};

const formatTransferFee = (fee: string): string => {
  const num = Number(fee);
  if (num === 0) return 'Free';
  if (num >= 1000000) return `€${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `€${(num / 1000).toFixed(0)}K`;
  return `€${num}`;
};

interface TransfersClientProps {
  windowStart: string;
  windowEnd: string;
}

export default function TransfersClient({ windowStart, windowEnd }: TransfersClientProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get('page') || '1', 10);

  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          windowStart,
          windowEnd,
        });

        const response = await fetch(`/api/v1/transfers?${params}`);
        const result = await response.json();
        setData(result.data || []);
        setMeta(result.meta || {});
      } catch (error) {
        console.error('Error fetching transfers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, windowStart, windowEnd]);

  const buildQueryString = (pageNum: number) => {
    const query = new URLSearchParams();
    query.set('page', String(pageNum));
    return `/transfers?${query.toString()}`;
  };

  return (
    <>
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="px-6 py-8 text-center text-muted-foreground">Loading transfers...</div>
          ) : data.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">No transfers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3 text-center">Position</th>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">To</th>
                    <th className="px-4 py-3 text-center">Transfer Fee</th>
                    <th className="px-4 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {data.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-emerald-500/5 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/players/${transfer.playerId}`} className="flex items-center gap-2 group text-sm hover:text-emerald-400 transition-colors">
                          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-emerald-600 to-emerald-800 text-xs font-bold text-white shrink-0">
                            {transfer.playerImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={transfer.playerImageUrl} alt={transfer.playerName} className="h-full w-full object-cover" />
                            ) : (
                              `${transfer.playerName?.split(' ')[0]?.[0] ?? ''}${transfer.playerName?.split(' ')[1]?.[0] ?? ''}`.toUpperCase()
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="truncate group-hover:underline font-medium">{transfer.playerName}</span>
                            {transfer.playerNationalityFlag && (
                              <div className="mt-0.5 flex items-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={transfer.playerNationalityFlag} alt={transfer.playerNationalityName || 'nation'} className="h-3 w-4 rounded-sm shrink-0" />
                                {transfer.playerNationalityName && <span className="text-xs text-muted-foreground">{transfer.playerNationalityName}</span>}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{POSITIONS[transfer.playerPosition]?.pl || transfer.playerPosition}</td>
                      <td className="px-4 py-3">
                        {transfer.fromClubId ? (
                          <Link href={`/clubs/${transfer.fromClubId}`} className="flex items-center gap-2 group text-sm text-foreground hover:text-emerald-400 transition-colors">
                            {transfer.fromClubLogoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={transfer.fromClubLogoUrl} alt={transfer.fromClubName} className="h-5 w-5 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Shield className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                            <span className="truncate group-hover:underline">{transfer.fromClubName}</span>
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/clubs/${transfer.toClubId}`} className="flex items-center gap-2 group text-sm text-foreground hover:text-emerald-400 transition-colors">
                          {transfer.toClubLogoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={transfer.toClubLogoUrl} alt={transfer.toClubName} className="h-5 w-5 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <Shield className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          <span className="truncate group-hover:underline">{transfer.toClubName}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-400">{formatTransferFee(transfer.fee)}</td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">{new Date(transfer.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta?.totalPages && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href={buildQueryString(Math.max(1, page - 1))} className={page === 1 ? 'pointer-events-none opacity-50' : ''}>
            <Button variant="outline" size="icon" disabled={page === 1}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </span>
          </div>

          <Link href={buildQueryString(Math.min(meta.totalPages, page + 1))} className={page === meta.totalPages ? 'pointer-events-none opacity-50' : ''}>
            <Button variant="outline" size="icon" disabled={page === meta.totalPages}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
