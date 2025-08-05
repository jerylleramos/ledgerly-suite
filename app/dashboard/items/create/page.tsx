import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import { CreateItemForm } from '@/app/ui/items/create-form';

export default function CreateItemPage() {
  return (
    <main>
        <Breadcrumbs
        breadcrumbs={[
            { label: 'Items', href: '/dashboard/items' },
            {
            label: 'Create Item',
            href: '/dashboard/items/create',
            active: true,
            },
        ]}
        />
        <CreateItemForm />
    </main>
  );
}
