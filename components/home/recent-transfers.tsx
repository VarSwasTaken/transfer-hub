import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTransfersList } from '@/lib/services/transfers-list';
import { ClubLogo, PlayerAvatar } from '@/components/media/entity-media';

export async function RecentTransfers() {
  const result = await getTransfersList({ page: 1, limit: 5 });

  if (result.data.length === 0) {
    return null;
  }

  const TrendIcon = ({ type }: { type: string }) => {
    if (type === 'PERMANENT') return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
    if (type === 'LOAN') return <TrendingDown className="h-3.5 w-3.5 text-amber-400" />;
    return <Minus className="h-3.5 w-3.5 text-sky-400" />;
  };

  const formatFee = (fee: string, type: string) => {
    if (type === 'FREE') return 'Za darmo';
    const num = parseFloat(fee);
    if (isNaN(num) || num === 0) return '—';
    if (num >= 1000000) return `€${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `€${(num / 1000).toFixed(0)}k`;
    return `€${num}`;
  };

  const typeLabel = (type: string) => {
    if (type === 'PERMANENT') return 'Transfer';
    if (type === 'LOAN') return 'Wypożyczenie';
    return 'Wolny agent';
  };

  return (
    <Card className="bg-card/50 border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">Ostatnie transfery</CardTitle>
        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 -mr-2" asChild>
          <Link href="/transfers">
            Wszystkie <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {result.data.map((t) => (
            <Link key={t.id} href={`/players/${t.playerId}`} className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/30 group">
              <PlayerAvatar name={t.playerName} imageUrl={t.playerImageUrl} className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded" imageClassName="h-full w-full object-cover" />

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground group-hover:text-emerald-400 transition-colors truncate">{t.playerName}</span>
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t.playerPosition}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 min-w-0">
                    <ClubLogo name={t.fromClubName || 'Bez klubu'} logoUrl={t.fromClubLogoUrl} className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-none bg-muted" imageClassName="h-full w-full object-contain object-center" iconClassName="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{t.fromClubName || 'Bez klubu'}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 shrink-0" />
                  <div className="flex items-center gap-1 min-w-0">
                    <ClubLogo name={t.toClubName} logoUrl={t.toClubLogoUrl} className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-none bg-muted" imageClassName="h-full w-full object-contain object-center" iconClassName="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{t.toClubName}</span>
                  </div>
                </div>
              </div>

              {/* Fee + type */}
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1">
                  <TrendIcon type={t.transferType} />
                  <span className="text-sm font-semibold text-foreground">{formatFee(t.fee, t.transferType)}</span>
                </div>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground border-none">
                  {typeLabel(t.transferType)}
                </Badge>
              </div>

              {/* Date */}
              <div className="hidden md:block text-xs text-muted-foreground shrink-0 w-20 text-right">{new Date(t.date).toLocaleDateString('pl-PL')}</div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
