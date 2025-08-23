import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-10 items-center rounded-lg bg-maroon-dark px-4 text-sm font-medium text-white transition-colors hover:bg-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-dark"
    >
      <span className="hidden md:block">{label}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button type="button" onClick={onDelete} className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}
