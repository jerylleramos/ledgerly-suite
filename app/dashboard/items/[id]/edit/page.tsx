
import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import { EditItemForm } from '@/app/ui/items/edit-form';
import { getItemById } from 'app/lib/items';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Edit Item',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const item = await getItemById(id);
  if (!item) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Items', href: '/dashboard/items' },
          {
            label: 'Edit Item',
            href: `/dashboard/items/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditItemForm item={item} />
    </main>
  );
}
