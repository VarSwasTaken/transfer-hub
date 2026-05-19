export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="h-10 w-64 animate-pulse rounded bg-muted/70 mb-2" />
        <div className="h-5 w-96 animate-pulse rounded bg-muted/70" />
      </div>

      {/* Leagues Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-lg bg-card/50 border border-border/40" />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded bg-muted/70" />
        <div className="h-5 w-32 animate-pulse rounded bg-muted/70" />
        <div className="h-10 w-10 animate-pulse rounded bg-muted/70" />
      </div>
    </main>
  );
}
