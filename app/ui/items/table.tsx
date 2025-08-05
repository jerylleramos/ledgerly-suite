
"use client";
import { Item } from 'app/lib/items-schema';
import { formatPrice } from '../../lib/utils';
import { DeleteItem, UpdateItem } from './buttons';

interface TableProps {
  items: Item[];
}

export function Table({ items }: TableProps) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Mobile view */}
              <div className="md:hidden">
                {items?.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p className="font-medium">{item.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{item.unit}</p>
                      </div>
                      <p className="text-lg font-bold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <UpdateItem id={item.id as string} />
                      <DeleteItem id={item.id as string} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop table */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th className="px-4 py-5 font-medium">Name</th>
                    <th className="px-3 py-5 font-medium">Price</th>
                    <th className="px-3 py-5 font-medium">Unit</th>
                    <th className="px-4 py-5 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        {item.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {formatPrice(item.price)}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {item.unit}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex gap-2">
                          <UpdateItem id={item.id as string} />
                          <DeleteItem id={item.id as string} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
