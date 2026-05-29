import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { listTransferRumors } from '@/lib/services/transfer-rumors';

export async function HottestRumour() {
  const { items } = await listTransferRumors({ page: 1, limit: 1 });

  if (items.length === 0) {
    return null;
  }

  const rumor = items[0];

  const [player, fromClub, toClub] = await Promise.all([
    prisma.player.findUnique({
      where: { id: rumor.playerId },
      select: { firstName: true, lastName: true, imageUrl: true, position: true },
    }),
    rumor.fromClubId ? prisma.club.findUnique({ where: { id: rumor.fromClubId }, select: { name: true } }) : null,
    rumor.toClubId ? prisma.club.findUnique({ where: { id: rumor.toClubId }, select: { name: true } }) : null,
  ]);

  const playerInitials = player ? `${player.firstName[0]}${player.lastName[0]}`.toUpperCase() : '??';
  const playerName = player ? `${player.firstName} ${player.lastName}` : `Zawodnik #${rumor.playerId}`;
  const fromClubName = fromClub?.name ?? 'N/A';
  const toClubName = toClub?.name ?? 'N/A';
  const fee = rumor.rumoredFee ? `€ ${(rumor.rumoredFee / 1_000_000).toFixed(0)} mln` : 'Brak';

  const credibilityPercent = rumor.credibility === 'High' ? 85 : rumor.credibility === 'Low' ? 40 : 65;

  return (
    <div className="rounded-xl overflow-hidden border border-orange-500/20 bg-linear-to-r from-orange-950/60 to-card/60 relative">
      <div className="absolute inset-0 opacity-10">
        <Image src="/images/transfer-bg.jpg" alt="" fill className="object-cover object-center" />
      </div>
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-10 items-center justify-center rounded bg-orange-500 text-white font-bold text-sm shrink-0 overflow-hidden">
            {player?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.imageUrl} alt={playerName} className="h-full w-full object-cover" />
            ) : (
              playerInitials
            )}
          </div>
          <div>
            <p className="text-xs text-orange-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Najgorętsza plotka
            </p>
            <p className="font-bold text-foreground">
              {playerName} &rarr; {toClubName}
            </p>
            <p className="text-sm text-muted-foreground">
              {fromClubName} &middot; {player?.position ?? 'N/A'} &middot; wiarygodność: {credibilityPercent}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-400">{fee}</p>
            <p className="text-xs text-muted-foreground">szacowana kwota</p>
          </div>
          <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10" asChild>
            <Link href={`/players/${rumor.playerId}`}>
              Profil <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
