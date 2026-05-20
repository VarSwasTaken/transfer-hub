'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Search, Filter, X, Shield } from 'lucide-react';
import { normalizeLanguage, type Language } from '@/lib/i18n';
import { useEffect } from 'react';

type PlayerListItem = {
  id: number;
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: string;
  marketValue: string;
  imageUrl: string | null;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  } | null;
  club: {
    id: number;
    name: string;
    logoUrl: string | null;
    league: {
      id: number;
      name: string;
      slug: string;
    } | null;
  } | null;
};

type Meta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

const POSITIONS = [
  { value: 'GOALKEEPER', labelPL: 'Bramkarz', labelEN: 'Goalkeeper' },
  { value: 'DEFENDER', labelPL: 'Obrońca', labelEN: 'Defender' },
  { value: 'MIDFIELDER', labelPL: 'Pomocnik', labelEN: 'Midfielder' },
  { value: 'FORWARD', labelPL: 'Napastnik', labelEN: 'Forward' },
];

const SORT_OPTIONS = [
  { value: 'lastName', labelPL: 'Nazwisko (A-Z)', labelEN: 'Last Name (A-Z)' },
  { value: 'marketValue', labelPL: 'Wartość rynkowa', labelEN: 'Market Value' },
  { value: 'createdAt', labelPL: 'Najnowsi', labelEN: 'Newest' },
];

const translations = {
  pl: {
    title: 'Zawodnicy',
    subtitle: 'Przeglądaj bazę',
    players: 'zawodników z całego świata',
    showing: 'Wyświetlanie',
    found: 'zawodników',
    search: 'Szukaj po imieniu lub nazwisku...',
    searchBtn: 'Szukaj',
    position: 'Pozycja',
    allPositions: 'Wszystkie pozycje',
    sortBy: 'Sortuj po',
    sortOrder: 'Kierunek',
    ascending: 'Rosnąco',
    descending: 'Malejąco',
    apply: 'Zastosuj',
    clearFilters: 'Wyczyść filtry',
    activeFilters: 'Aktywne filtry:',
    page: 'Strona',
    of: 'z',
    noPlayers: 'Nie znaleziono zawodników',
    tryChanging: 'Spróbuj zmienić kryteria wyszukiwania lub filtry',
    player: 'Zawodnik',
    shirt: '#',
    value: 'Wartość',
    club: 'Klub',
    league: 'Liga',
    nationality: 'Kraj',
  },
  en: {
    title: 'Players',
    subtitle: 'Browse database of',
    players: 'players from around the world',
    showing: 'Showing',
    found: 'players',
    search: 'Search by first or last name...',
    searchBtn: 'Search',
    position: 'Position',
    allPositions: 'All positions',
    sortBy: 'Sort by',
    sortOrder: 'Order',
    ascending: 'Ascending',
    descending: 'Descending',
    apply: 'Apply',
    clearFilters: 'Clear filters',
    activeFilters: 'Active filters:',
    page: 'Page',
    of: 'of',
    noPlayers: 'No players found',
    tryChanging: 'Try changing search criteria or filters',
    player: 'Player',
    shirt: '#',
    value: 'Value',
    club: 'Club',
    league: 'League',
    nationality: 'Country',
  },
};

export function PlayersListView({ players, meta }: { players: PlayerListItem[]; meta: Meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>('pl');
  const [mounted, setMounted] = useState(false);

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedPosition, setSelectedPosition] = useState(searchParams.get('position') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'lastName');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [showFilters, setShowFilters] = useState(false);

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

  const t = translations[language];

  const updateParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchInput) {
      params.set('search', searchInput);
    }

    if (selectedPosition) {
      params.set('position', selectedPosition);
    }

    if (sortBy && sortBy !== 'lastName') {
      params.set('sortBy', sortBy);
    }

    if (sortOrder && sortOrder !== 'asc') {
      params.set('sortOrder', sortOrder);
    }

    params.set('page', '1');

    router.push(`/players?${params.toString()}`);
  }, [searchInput, selectedPosition, sortBy, sortOrder, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams();
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedPosition('');
    setSortBy('lastName');
    setSortOrder('asc');
    router.push('/players');
  };

  const formatMarketValue = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    if (num >= 1_000_000) {
      return `€${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `€${(num / 1_000).toFixed(0)}K`;
    }
    return `€${num}`;
  };

  const getPositionLabel = (position: string) => {
    const pos = POSITIONS.find((p) => p.value === position);
    return language === 'pl' ? pos?.labelPL : pos?.labelEN;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '??';
  };

  const hasActiveFilters = searchInput || selectedPosition || sortBy !== 'lastName' || sortOrder !== 'asc';

  if (!mounted) return null;

  const buildPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (searchInput) params.set('search', searchInput);
    if (selectedPosition) params.set('position', selectedPosition);
    if (sortBy !== 'lastName') params.set('sortBy', sortBy);
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
    params.set('page', pageNum.toString());
    return `/players?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.subtitle} {meta.totalItems} {t.players}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input type="text" placeholder={t.search} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {t.searchBtn}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </form>

        {/* Results Info */}
        {players.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {t.showing} <span className="font-semibold text-foreground">{players.length}</span> {t.found} ({language === 'pl' ? 'strona' : 'page'} {meta.page}/{meta.totalPages})
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <Card className="border border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {/* Position Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.position}</label>
                  <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="">{t.allPositions}</option>
                    {POSITIONS.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {language === 'pl' ? pos.labelPL : pos.labelEN}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.sortBy}</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {language === 'pl' ? opt.labelPL : opt.labelEN}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.sortOrder}</label>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="asc">{t.ascending}</option>
                    <option value="desc">{t.descending}</option>
                  </select>
                </div>

                {/* Apply Filters Button */}
                <div className="flex flex-col items-stretch gap-2 sm:col-span-1 lg:col-span-2">
                  <Button onClick={updateParams} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {t.apply}
                  </Button>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      {t.clearFilters}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">{t.activeFilters}</span>
            {searchInput && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-600">
                {language === 'pl' ? 'Szukaj' : 'Search'}: {searchInput}
              </span>
            )}
            {selectedPosition && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-600">
                {t.position}: {getPositionLabel(selectedPosition)}
              </span>
            )}
            {(sortBy !== 'lastName' || sortOrder !== 'asc') && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-600">{SORT_OPTIONS.find((o) => o.value === sortBy)?.[language === 'pl' ? 'labelPL' : 'labelEN']}</span>}
          </div>
        )}
      </div>

      {/* Players List */}
      {players.length > 0 ? (
        <>
          <Card className="border-border/40 bg-card/50 mb-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20 bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t.player}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t.position}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t.club}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t.league}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{t.nationality}</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">{t.value}</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/players/${player.id}`} className="flex items-center gap-3 group">
                          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-emerald-600 to-emerald-800 text-xs font-bold text-white shrink-0">{player.imageUrl ? <img src={player.imageUrl} alt={`${player.firstName} ${player.lastName}`} className="h-full w-full object-cover object-center" /> : getInitials(player.firstName, player.lastName)}</div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground group-hover:text-emerald-400 transition-colors truncate">
                              {player.firstName} {player.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t.shirt}
                              {player.shirtNumber}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-600">{getPositionLabel(player.position)}</span>
                      </td>
                      <td className="px-4 py-3">
                        {player.club ? (
                          <Link href={`/clubs/${player.club.id}`} className="flex items-center gap-2 group text-sm text-foreground hover:text-emerald-400 transition-colors">
                            {player.club.logoUrl ? (
                              <img src={player.club.logoUrl} alt={player.club.name} className="h-6 w-6 rounded object-cover shrink-0" />
                            ) : (
                              <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="truncate group-hover:underline">{player.club.name}</span>
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {player.club?.league ? (
                          <Link href={`/leagues/${player.club.league.slug}`} className="text-sm text-foreground hover:text-emerald-400 transition-colors hover:underline">
                            {player.club.league.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {player.nationality ? (
                          <div className="flex items-center gap-2">
                            {player.nationality.flagUrl && <img src={player.nationality.flagUrl} alt={player.nationality.name} className="w-4 h-3 rounded-sm object-cover" />}
                            <span className="text-sm text-muted-foreground">{player.nationality.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-emerald-400">{formatMarketValue(player.marketValue)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Link href={buildPaginationUrl(meta.page - 1)} className={meta.page === 1 ? 'pointer-events-none opacity-50' : ''}>
                <Button variant="outline" size="icon" disabled={meta.page === 1}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t.page} {meta.page} {t.of} {meta.totalPages}
                </span>
              </div>

              <Link href={buildPaginationUrl(meta.page + 1)} className={meta.page === meta.totalPages ? 'pointer-events-none opacity-50' : ''}>
                <Button variant="outline" size="icon" disabled={meta.page === meta.totalPages}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">{t.noPlayers}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.tryChanging}</p>
              <Button onClick={handleClearFilters} variant="outline">
                {t.clearFilters}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
