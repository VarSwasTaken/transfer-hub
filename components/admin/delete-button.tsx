'use client';

import { Trash2 } from 'lucide-react';

export function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-red-500 hover:text-red-400"
      onClick={(e) => {
        if (!confirm('Czy na pewno chcesz usunąć ten element?')) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
