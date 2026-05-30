import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-emerald-500">Admin Dashboard</h1>
      <div className="bg-card border border-border p-6 rounded-lg shadow">
        <p className="text-muted-foreground mb-4">Witaj w panelu administratora. Będzie on wkrótce rozbudowany.</p>
        <form
          action={async () => {
            'use server';
            const cookieStore = await cookies();
            cookieStore.delete('admin_token');
            redirect('/admin/login');
          }}
        >
          <button type="submit" className="mt-4 px-4 py-2 bg-destructive/90 text-destructive-foreground hover:bg-destructive rounded transition-colors">
            Wyloguj
          </button>
        </form>
      </div>
    </div>
  );
}
