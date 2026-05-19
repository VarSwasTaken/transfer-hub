'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type LeagueProfileData = {
  id: number;
  name: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  } | null;
  stats: {
    clubCount: number;
    playerCount: number;
    totalMarketValue: string;
    avgMarketValue: string;
  };
  clubs: Array<{
    id: number;
    name: string;
    logoUrl: string | null;
    budget: string | null;
    playerCount: number;
  }>;
};

function formatCurrency(value: string | null): string {
  if (!value) return 'N/A';
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B €`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M €`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K €`;
  return `${num.toFixed(0)} €`;
}

export function LeagueProfileView({ league }: { league: LeagueProfileData }) {
  const logoSrc = league.logoUrl?.trim() || null;
  const logoIsExternal = logoSrc ? /^https?:\/\//i.test(logoSrc) : false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Card */}
      <div className="mb-8 rounded-xl border border-border/40 bg-card/50 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Logo */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-600 to-slate-800 shadow-lg">
            {logoSrc ? (
              logoIsExternal ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt={league.name} className="h-full w-full object-cover object-center" />
              ) : (
                <Image src={logoSrc} alt={league.name} fill className="object-cover object-center" />
              )
            ) : (
              <span className="text-lg font-bold text-white">{league.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{league.name}</h1>
                {league.nationality && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/30">
                    {league.nationality.flagUrl && <img src={league.nationality.flagUrl} alt={league.nationality.name} className="w-5 h-3 rounded-sm object-cover" />}
                    <span className="text-sm text-muted-foreground">{league.nationality.name}</span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-2">
                <div className="p-2 rounded-lg bg-background/40 border border-border/20">
                  <p className="text-xs text-muted-foreground">Kluby</p>
                  <p className="text-lg font-bold text-emerald-400">{league.stats.clubCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-background/40 border border-border/20">
                  <p className="text-xs text-muted-foreground">Zawodnicy</p>
                  <p className="text-lg font-bold text-sky-400">{league.stats.playerCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-background/40 border border-border/20">
                  <p className="text-xs text-muted-foreground">Całkowita wycena</p>
                  <p className="text-sm font-bold text-amber-400">{formatCurrency(league.stats.totalMarketValue)}</p>
                </div>
                <div className="p-2 rounded-lg bg-background/40 border border-border/20">
                  <p className="text-xs text-muted-foreground">Średnia wycena</p>
                  <p className="text-sm font-bold text-purple-400">{formatCurrency(league.stats.avgMarketValue)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clubs List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Kluby w lidze ({league.stats.clubCount})</h2>
        <div className="grid gap-4">
          {league.clubs.map((club) => (
            <Link key={club.id} href={`/clubs/${club.id}`}>
              <Card className="hover:border-emerald-500/40 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {/* Club Logo */}
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted border border-border/30">{club.logoUrl ? <img src={club.logoUrl} alt={club.name} className="h-full w-full object-cover object-center" /> : <span className="text-sm font-bold text-muted-foreground">{club.name.substring(0, 2).toUpperCase()}</span>}</div>

                    {/* Club Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">{club.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span>
                          Zawodnicy: <span className="text-foreground font-medium">{club.playerCount}</span>
                        </span>
                        <span>
                          Budget: <span className="text-foreground font-medium">{formatCurrency(club.budget)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-muted-foreground group-hover:text-emerald-400 transition-colors">→</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
