'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Language } from '@/lib/i18n';

export function SquadValueChart({ language = 'pl', valuations = [] }: { language?: Language; valuations?: Array<{ year: number; value: number }> }) {
  const data = (valuations ?? []).map((v) => ({ year: String(v.year), value: v.value }));
  const title = language === 'pl' ? 'Historia wartości składu' : 'Squad value history';
  const subtitle = language === 'pl' ? 'Wartość w milionach EUR' : 'Value in million EUR';
  const delta = language === 'pl' ? '+8.2% vs zeszły rok' : '+8.2% vs last year';
  const tooltipSeries = language === 'pl' ? 'Wartość składu' : 'Squad value';
  const tooltipUnit = language === 'pl' ? 'mln' : 'M';

  // compute display numbers
  const latest = data.length > 0 ? data[data.length - 1].value : 0;
  const prev = data.length > 1 ? data[data.length - 2].value : 0;
  const deltaPct = prev > 0 ? Math.round(((latest - prev) / prev) * 1000) / 10 : 0;

  return (
    <Card className="border-border/40 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <CardDescription className="mt-1 text-xs">{subtitle}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{latest} mln €</p>
            <p className="mt-0.5 text-xs text-emerald-400">{deltaPct >= 0 ? `+${deltaPct}% vs last year` : `${deltaPct}% vs last year`}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#ffffff' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#ffffff' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(v) => {
                const numericValue = typeof v === 'number' ? v : Number(v ?? 0);
                return [`${numericValue} ${tooltipUnit}`, tooltipSeries];
              }}
            />
            {/** optional reference line at latest value */}
            {latest > 0 && <ReferenceLine y={latest} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />}
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
