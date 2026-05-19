export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Header Card */}
      <div className="mb-8 rounded-xl border border-border/40 bg-card/50 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="h-28 w-28 shrink-0 animate-pulse rounded-xl bg-muted/70" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-64 animate-pulse rounded bg-muted/70" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg bg-background/60" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clubs List */}
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted/70 mb-4" />
        <div className="grid gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-card/50 border border-border/40" />
          ))}
        </div>
      </div>
    </main>
  );
}
