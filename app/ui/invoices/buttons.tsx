import { deleteInvoice } from '@/app/lib/actions';
import { CreateButton, DeleteButton, UpdateButton } from '@/app/ui/common/buttons';

export function CreateInvoice() {
  return <CreateButton href="/dashboard/invoices/create" label="Create Invoice" />;
}

export function UpdateInvoice({ id }: { id: string }) {
  return <UpdateButton href={`/dashboard/invoices/${id}/edit`} />;
}

export function DeleteInvoice({ id }: { id: string }) {
  const handleDelete = () => {
    const deleteInvoiceWithId = deleteInvoice.bind(null, id);
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
      deleteInvoiceWithId();
      document.body.removeChild(form);
    };
    button.click();
  };
  return <DeleteButton onDelete={handleDelete} />;
}
