'use client';
import { Item } from 'app/lib/items-schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../button';

export function DeleteItemDialog({ item }: { item: Item }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/items/${item.id}/delete`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to delete item');
      router.push('/items');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Delete Item</h2>
      <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{item.name}</span>?</p>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex gap-2">
        <Button onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
        <Button onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
