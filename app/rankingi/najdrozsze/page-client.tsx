'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { normalizeLanguage, getTranslations, type Language } from '@/lib/i18n';
import { Shield, ArrowLeft, ArrowRight, Filter, X } from 'lucide-react';

import type { TopPlayerItem } from '@/lib/services/rankings';

const POSITIONS = ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'];
const POSITION_NAMES: Record<string, { pl: string; en: string }> = {
  GOALKEEPER: { pl: 'Bramkarz', en: 'Goalkeeper' },
  DEFENDER: { pl: 'Obrońca', en: 'Defender' },
  MIDFIELDER: { pl: 'Pomocnik', en: 'Midfielder' },
  FORWARD: { pl: 'Napastnik', en: 'Forward' },
};

export default function TopPlayersPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get('page') || '1', 10);
  const selectedPosition = (searchParams?.get('position') || '') as string;

  const [language, setLanguage] = useState<Language>('pl');
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<TopPlayerItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ui-language') : null;
    const normalized = normalizeLanguage(stored);
    setLanguage(normalized);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleLanguageChange = () => {
      const stored = localStorage.getItem('ui-language');
      const normalized = normalizeLanguage(stored);
      setLanguage(normalized);
    };
    window.addEventListener('language-changed', handleLanguageChange);
    return () => window.removeEventListener('language-changed', handleLanguageChange);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...(selectedPosition && { position: selectedPosition }),
        });

        const response = await fetch(`/api/v1/rankings/top-players?${params}`);
        const result = await response.json();
        setData(result.data || []);
        setTotalPages(result.meta?.totalPages || 0);
      } catch (error) {
        console.error('Error fetching top players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted, page, selectedPosition]);

  if (!mounted) return null;

  const t = getTranslations(language).rankings;
  const currentUrl = `/rankings/most-expensive-players`;

  const handlePositionFilter = (position: string) => {
    const params = new URLSearchParams({ ...(position && { position }) });
    window.location.href = `${currentUrl}?${params}`;
  };

  const clearFilters = () => {
    window.location.href = currentUrl;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.topPlayers}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.topPlayersDesc}</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border/40 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-emerald-400" />
            {t.filters}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">{t.position}</label>
              <select value={selectedPosition} onChange={(e) => handlePositionFilter(e.target.value)} className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-emerald-400/50 focus:border-emerald-400 focus:outline-none">
                <option value="">{t.all}</option>
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {POSITION_NAMES[pos][language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedPosition && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                {POSITION_NAMES[selectedPosition][language]}
                <button onClick={clearFilters} className="ml-1 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="px-6 py-8 text-center text-muted-foreground">{t.loading}</div>
          ) : data.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">{t.noData}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">{t.player}</th>
                    <th className="px-4 py-3">{t.position}</th>
                    <th className="px-4 py-3">{t.club}</th>
                    <th className="px-4 py-3 text-center">{t.marketValue}</th>
                    <th className="px-4 py-3 text-center">{t.age}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {data.map((player) => (
                    <tr key={player.id} className="hover:bg-emerald-500/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-emerald-400">{player.rank}</td>
                      <td className="px-4 py-3">
                        <Link href={`/players/${player.id}`} className="flex items-center gap-2 group text-sm hover:text-emerald-400 transition-colors">
                          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-emerald-600 to-emerald-800 text-xs font-bold text-white shrink-0">
                            {player.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={player.imageUrl} alt={`${player.firstName} ${player.lastName}`} className="h-full w-full object-cover" />
                            ) : (
                              `${player.firstName?.[0] ?? ''}${player.lastName?.[0] ?? ''}`.toUpperCase()
                            )}
                          </div>
                          <span className="truncate group-hover:underline">
                            {player.firstName} {player.lastName}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">{POSITION_NAMES[player.position][language]}</td>
                      <td className="px-4 py-3">
                        {player.club ? (
                          <Link href={`/clubs/${player.club.id}`} className="flex items-center gap-2 group text-sm text-foreground hover:text-emerald-400 transition-colors">
                            {player.club.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={player.club.logoUrl} alt={player.club.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Shield className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                            <span className="truncate group-hover:underline">{player.club.name}</span>
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-400">{player.marketValue}</td>
                      <td className="px-4 py-3 text-center text-sm text-muted-foreground">{player.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t.page} {page} {t.of} {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => {
                const params = new URLSearchParams({
                  page: (page - 1).toString(),
                  ...(selectedPosition && { position: selectedPosition }),
                });
                window.location.href = `${currentUrl}?${params}`;
              }}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => {
                const params = new URLSearchParams({
                  page: (page + 1).toString(),
                  ...(selectedPosition && { position: selectedPosition }),
                });
                window.location.href = `${currentUrl}?${params}`;
              }}
              className="gap-1"
            >
              {t.next}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
