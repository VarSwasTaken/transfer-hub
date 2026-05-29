import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RecentTransfers } from '@/components/home/recent-transfers';
import { TopPlayers } from '@/components/home/top-players';
import { TopClubs } from '@/components/home/top-clubs';
import { HotRumours } from '@/components/home/hot-rumours';
import { InjuredPlayers } from '@/components/home/injured-players';
import { HottestRumour } from '@/components/home/hottest-rumour';
import { BiggestTransfer } from '@/components/home/biggest-transfer';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-stadium.jpg" alt="Stadion piłkarski" fill className="object-cover object-center opacity-20" priority />
          <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance mb-3">
              Rynek transferowy
              <span className="text-emerald-400"> w jednym miejscu</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">Śledź transfery, monitoruj wyceny zawodników i analizuj rynek piłkarski w czasie rzeczywistym.</p>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Popularne:</span>
              {[
                { label: 'Wolni agenci', href: '/free-agents' },
                { label: 'Ekstraklasa', href: '/leagues' },
                { label: 'Premier League', href: '/leagues' },
                { label: 'Rankingi', href: '/rankings' },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-xs rounded-full border border-border/50 bg-card/50 px-3 py-1 text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transfer dnia */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — wide column (transfer dnia + najgorętsza plotka + gorące plotki + ostatnie transfery + kontuzjowani) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <BiggestTransfer />
            <HottestRumour />
            <HotRumours />
            <RecentTransfers />
            <InjuredPlayers />
          </div>

          {/* RIGHT — sidebar (top wyceny + top kluby) */}
          <div className="flex flex-col gap-6">
            <TopPlayers />
            <TopClubs />
          </div>
        </div>
      </main>
    </div>
  );
}
