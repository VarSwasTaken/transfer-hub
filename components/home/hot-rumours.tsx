import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { listTransferRumors } from '@/lib/services/transfer-rumors';

function ReliabilityBar({ value: credibility }: { value: string }) {
  const numValue = credibility === 'High' ? 85 : credibility === 'Low' ? 40 : 65;
  const color = numValue >= 80 ? 'bg-emerald-500' : numValue >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${numValue}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground">{numValue}%</span>
    </div>
  );
}

export async function HotRumours() {
  const { items } = await listTransferRumors({ page: 1, limit: 5 });

  if (items.length === 0) {
    return null;
  }

  const playerIds = items.map((r) => r.playerId);
  const clubIds = items.flatMap((r) => [r.fromClubId, r.toClubId]).filter((id): id is number => typeof id === 'number');

  const [players, clubs] = await Promise.all([
    prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, firstName: true, lastName: true, position: true, imageUrl: true, nationality: { select: { flagUrl: true } } },
    }),
    prisma.club.findMany({
      where: { id: { in: clubIds } },
      select: { id: true, name: true, logoUrl: true },
    }),
  ]);

  const playerMap = new Map(players.map((p) => [p.id, p]));
  const clubMap = new Map(clubs.map((c) => [c.id, c]));

  return (
    <Card className="bg-card/50 border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          Gorące plotki
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 -mr-2" asChild>
          <Link href="/transfers/rumours">
            Wszystkie <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {items.map((r) => {
            const player = playerMap.get(r.playerId);
            const fromClub = r.fromClubId ? clubMap.get(r.fromClubId) : null;
            const toClub = r.toClubId ? clubMap.get(r.toClubId) : null;
            const playerFlag = player?.nationality?.flagUrl || '';

            return (
              <Link key={r.id} href={`/players/${r.playerId}`} className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted/30 transition-colors group">
                <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded overflow-hidden">
                  {player?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={player.imageUrl} alt={`${player.firstName} ${player.lastName}`} className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-orange-600 to-orange-800 text-white text-xs font-bold flex items-center justify-center">{player ? `${player.firstName[0]}${player.lastName[0]}`.toUpperCase() : '??'}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground group-hover:text-emerald-400 transition-colors truncate">{player ? `${player.firstName} ${player.lastName}` : `Zawodnik #${r.playerId}`}</span>
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{player?.position || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    {fromClub && (
                      <>
                        {fromClub.logoUrl && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={fromClub.logoUrl} alt={fromClub.name} className="h-full w-full object-contain" />
                          </div>
                        )}
                        <span>{fromClub.name}</span>
                      </>
                    )}
                    {fromClub && toClub && <ArrowRight className="h-3 w-3 shrink-0" />}
                    {toClub && (
                      <>
                        {toClub.logoUrl && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={toClub.logoUrl} alt={toClub.name} className="h-full w-full object-contain" />
                          </div>
                        )}
                        <span>{toClub.name}</span>
                      </>
                    )}
                  </div>
                  <ReliabilityBar value={r.credibility} />
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-semibold text-foreground">{r.rumoredFee ? `€${(r.rumoredFee / 1_000_000).toFixed(0)}M` : '—'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.publishedAt).toLocaleDateString('pl-PL')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
