export default function PlaceholderPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Moduł w budowie</h1>
      </div>
      <div className="bg-card border border-border p-6 rounded-lg shadow">
        <p className="text-muted-foreground">
          Ta tabela nie ma jeszcze zaimplementowanego swojego widoku CRUD. Zobacz <b>/admin/nationalities</b> jako wzór pełnego, działającego modułu dodawania, edycji i usuwania.
        </p>
      </div>
    </div>
  );
}
