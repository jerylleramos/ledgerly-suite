

import { fetchFilteredItems, fetchItemsPages } from '@/app/lib/items-data';
import Pagination from '@/app/ui/common/pagination';
import { lusitana } from '@/app/ui/fonts';
import { CreateItem } from '@/app/ui/items/buttons';
import { Table } from '@/app/ui/items/table';
import Search from '@/app/ui/search';

export default async function ItemsPage({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchItemsPages(query);
  const items = await fetchFilteredItems(query, currentPage);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Items</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search items..." />
        <CreateItem />
      </div>
      <Table items={items} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

