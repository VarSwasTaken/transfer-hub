'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="flex flex-1 min-h-[calc(100vh-220px)] items-center justify-center bg-background text-foreground">
      <form action={formAction} className="p-8 bg-card border border-border rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-500">Admin Login</h1>

        {state?.error && <div className="mb-4 p-3 bg-destructive/20 text-destructive-foreground rounded text-sm text-center border border-destructive/50">{state.error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Login</label>
          <input name="username" type="text" required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-muted-foreground">Hasło</label>
          <input name="password" type="password" required className="w-full border border-border bg-background text-foreground p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded transition-colors">
          Zaloguj
        </button>
      </form>
    </div>
  );
}
