
import { CreateButton, DeleteButton, UpdateButton } from '@/app/ui/common/buttons';
import { deleteItem } from 'app/lib/items';

export function CreateItem() {
  return <CreateButton href="/dashboard/items/create" label="New Item" />;
}

export function UpdateItem({ id }: { id: string }) {
  return <UpdateButton href={`/dashboard/items/${id}/edit`} />;
}

export function DeleteItem({ id }: { id: string }) {
  const handleDelete = () => {
    const deleteItemWithId = deleteItem.bind(null, id);
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '';
    form.style.display = 'none';
    const button = document.createElement('button');
    button.type = 'submit';
    form.appendChild(button);
    document.body.appendChild(form);
    form.onsubmit = (e) => {
      e.preventDefault();
      deleteItemWithId();
      document.body.removeChild(form);
    };
    button.click();
  };
  return <DeleteButton onDelete={handleDelete} />;
}
