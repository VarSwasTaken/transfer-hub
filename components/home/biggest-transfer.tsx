import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { PlayerAvatar } from '@/components/media/entity-media';

const positionLabelPL: Record<string, string> = {
  GOALKEEPER: 'Bramkarz',
  DEFENDER: 'Obrońca',
  MIDFIELDER: 'Pomocnik',
  FORWARD: 'Napastnik',
};

export async function BiggestTransfer() {
  // Pobierz największy transfer
  const transfer = await prisma.transfer.findFirst({
    orderBy: { fee: 'desc' },
    select: {
      id: true,
      fee: true,
      transferType: true,
      createdAt: true,
      player: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          position: true,
          club: { select: { name: true, logoUrl: true } },
        },
      },
      fromClub: { select: { name: true, logoUrl: true } },
      toClub: { select: { name: true, logoUrl: true } },
    },
  });

  if (!transfer || !transfer.player) {
    return null;
  }

  const player = transfer.player;
  const feeValue = transfer.fee ? `€ ${(Number(transfer.fee) / 1_000_000).toFixed(0)} mln` : 'Brak';

  return (
    <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-linear-to-r from-emerald-950/60 to-card/60 relative">
      <div className="absolute inset-0 opacity-10">
        <Image src="/images/transfers-background.jpeg" alt="" fill className="object-cover object-center" />
      </div>
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <PlayerAvatar firstName={player.firstName} lastName={player.lastName} imageUrl={player.imageUrl} className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded" />
          <div>
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Transfer dnia
            </p>
            <p className="font-bold text-foreground">
              {player.firstName} {player.lastName} &rarr; {transfer.toClub?.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {transfer.fromClub?.name} &middot; {positionLabelPL[player.position] ?? player.position}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{feeValue}</p>
            <p className="text-xs text-muted-foreground">szacowana kwota</p>
          </div>
          <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" asChild>
            <Link href={`/players/${player.id}`}>
              Profil <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
