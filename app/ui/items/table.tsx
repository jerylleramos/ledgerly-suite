
import { fetchFilteredItems } from '@/app/lib/items-data';
import { ClientTable } from '@/app/ui/items/client-table';

// Async server component for Suspense
export async function ItemsTable({ query, currentPage }: { query: string; currentPage: number }) {
  const items = await fetchFilteredItems(query, currentPage);
  return <ClientTable items={items} />;
}
