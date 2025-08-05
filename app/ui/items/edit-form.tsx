'use client';
import { Item } from 'app/lib/items-schema';

import { updateItem } from 'app/lib/items';
import { useActionState } from 'react';
import { Button } from '../button';

type ItemFormErrors = {
  name?: string[];
  description?: string[];
  price?: string[];
  unit?: string[];
};

export function EditItemForm({ item }: { item: Item }) {
  if (!item.id) throw new Error('Item id is required');
  const initialState: { message: string; errors: ItemFormErrors } = { message: '', errors: {} };
  // Bind the item id to the updateItem action
  const updateItemWithId = updateItem.bind(null, item.id as string);
  const [state, formAction, isPending] = useActionState(updateItemWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
            defaultValue={item.name}
            maxLength={100}
            required
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name && state.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="description-error"
            defaultValue={item.description || ''}
            maxLength={300}
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description && state.errors.description.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">Price *</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min={0.01}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="price-error"
            defaultValue={item.price}
            required
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price && state.errors.price.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        {/* Unit */}
        <div className="mb-4">
          <label htmlFor="unit" className="mb-2 block text-sm font-medium">Unit</label>
          <input
            id="unit"
            name="unit"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="unit-error"
            defaultValue={item.unit || ''}
            maxLength={20}
          />
          <div id="unit-error" aria-live="polite" aria-atomic="true">
            {state.errors?.unit && state.errors.unit.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        {state.message && <div className="text-red-500 text-sm mb-2">{state.message}</div>}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
