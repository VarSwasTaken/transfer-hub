'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { normalizeLanguage, getTranslations, type Language } from '@/lib/i18n';
import { TrendingUp, Trophy } from 'lucide-react';

export default function RankingsPage() {
  const [language, setLanguage] = useState<Language>('pl');
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return null;

  const t = getTranslations(language).rankings;

  const rankings = [
    {
      title: t.topPlayers,
      description: t.topPlayersDesc,
      href: '/rankings/most-expensive-players',
      icon: Trophy,
      color: 'from-emerald-600 to-emerald-800',
    },
    {
      title: t.clubValuations,
      description: t.clubValuationsDesc,
      href: '/rankings/most-expensive-clubs',
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-800',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground">{t.topPlayers}</h1>
        <p className="mt-2 text-muted-foreground">{language === 'pl' ? 'Przeglądaj rankingi zawodników i klubów' : 'Browse player and club rankings'}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rankings.map((ranking) => {
          const Icon = ranking.icon;
          return (
            <Link key={ranking.href} href={ranking.href}>
              <Card className="h-full border-border/40 bg-card/50 hover:border-emerald-500/50 hover:bg-card/70 transition-all cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${ranking.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-emerald-400 transition-colors">{ranking.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{ranking.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
