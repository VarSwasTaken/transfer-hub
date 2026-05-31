import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getTopPlayers } from '@/lib/services/rankings';
import { PlayerAvatar } from '@/components/media/entity-media';
import { getPlayerPositionAbbreviation } from '@/lib/utils';

export async function TopPlayers() {
  const result = await getTopPlayers({ page: 1, limit: 5 });

  if (result.data.length === 0) {
    return null;
  }

  const MAX = Math.max(...result.data.map((p) => (p.marketValue ? parseInt(p.marketValue.replace(/[^0-9]/g, '')) : 0))) || 180;

  return (
    <Card className="bg-card/50 border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          Top wyceniani piłkarze
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 -mr-2" asChild>
          <Link href="/rankings/most-expensive-players">
            Więcej <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result.data.map((p, i) => {
          const valueNum = p.marketValue ? parseInt(p.marketValue.replace(/[^0-9]/g, '')) : 0;
          return (
            <Link key={p.id} href={`/players/${p.id}`} className="group flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-muted-foreground text-right shrink-0">{i + 1}</span>
              <PlayerAvatar firstName={p.firstName} lastName={p.lastName} imageUrl={p.imageUrl} tone="orange" className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded" imageClassName="h-full w-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground group-hover:text-emerald-400 transition-colors truncate">
                    {p.firstName} {p.lastName}
                  </span>
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{getPlayerPositionAbbreviation(p.position)}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                  {p.nationality?.flagUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.nationality.flagUrl} alt={p.nationality.name} className="h-3.5 w-5 shrink-0 rounded-sm object-cover" />
                  ) : (
                    <div className="h-3.5 w-5 shrink-0 rounded-sm bg-muted" />
                  )}
                  <span className="truncate">{p.nationality?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Progress value={(valueNum / MAX) * 100} className="h-1 flex-1 bg-muted [&>div]:bg-amber-500" />
                  <span className="ml-2 shrink-0 text-xs font-semibold text-amber-400">{p.marketValue}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
