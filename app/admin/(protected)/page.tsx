export default async function AdminPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-4 text-emerald-500">Admin Dashboard</h1>
      <div className="bg-card border border-border p-6 rounded-lg shadow">
        <p className="text-muted-foreground mb-4">Witaj w panelu administratora. Z menu po lewej stronie wybierz tabelę, którą chcesz zarządzać.</p>
      </div>
    </div>
  );
}
