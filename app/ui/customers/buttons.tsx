import { deleteCustomer } from '@/app/lib/actions';
import { CreateButton, DeleteButton, UpdateButton } from '@/app/ui/common/buttons';

export function CreateCustomer() {
  return <CreateButton href="/dashboard/customers/create" label="Create Customer" />;
}

export function UpdateCustomer({ id }: { id: string }) {
  return <UpdateButton href={`/dashboard/customers/${id}/edit`} />;
}

export function DeleteCustomer({ id }: { id: string }) {
  const handleDelete = () => {
    const deleteCustomerWithId = deleteCustomer.bind(null, id);
    // Create a form and submit it programmatically
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
      deleteCustomerWithId();
      document.body.removeChild(form);
    };
    button.click();
  };
  return <DeleteButton onDelete={handleDelete} />;
}
