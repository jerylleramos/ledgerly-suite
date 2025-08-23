
import { fetchItemsPages } from '@/app/lib/items-data';
import Pagination from '@/app/ui/common/pagination';
import { lusitana } from '@/app/ui/fonts';
import { CreateItem } from '@/app/ui/items/buttons';
import { ItemsTable } from '@/app/ui/items/table';
import Search from '@/app/ui/search';
import { ItemsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

import type { PageProps } from '../../../.next/types/app/dashboard/items/page';

type ParamsType = { query?: string; page?: string };

export default async function ItemsPage({ searchParams }: PageProps) {
  let params: ParamsType | undefined = undefined;
  if (searchParams) {
    if (typeof (searchParams as Promise<ParamsType>).then === 'function') {
      params = await (searchParams as Promise<ParamsType>);
    } else {
      params = searchParams as ParamsType;
    }
  }
  const query = params?.query ?? '';
  const currentPage = Number(params?.page) || 1;
  const totalPages = await fetchItemsPages(query);
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Items</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search items..." />
        <CreateItem />
      </div>
      <Suspense key={query + currentPage} fallback={<ItemsTableSkeleton />}>
        <ItemsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

