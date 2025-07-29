"use client";

import { State, updateCustomer } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import Image from "next/image";
import { useActionState, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  image_url?: string | null;
};

export default function EditCustomerForm({ customer }: { customer: Customer }) {
  const initialState: State = { message: '', errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(
    async (prevState: typeof initialState, formData: FormData) => await updateCustomerWithId(prevState, formData),
    initialState
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(customer.image_url || null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={customer.name}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="email-error"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Photo Upload */}
        <div className="mb-4">
          <label htmlFor="photo" className="mb-2 block text-sm font-medium">
            Photo <span className="text-red-500">*</span>
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500"
            aria-describedby="photo-error"
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <div className="flex items-center gap-2 mt-2">
              <Image src={photoPreview} alt="Current" width={80} height={80} className="h-20 w-20 rounded-full object-cover border" />
              <button type="button" className="text-xs text-red-500 underline" onClick={() => { setPhotoPreview(null); }}>Remove</button>
            </div>
          )}
          <div id="photo-error" aria-live="polite" aria-atomic="true">
            {state.errors?.photo &&
              state.errors.photo.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Update Customer</Button>
      </div>
      {state.message && (
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      )}
    </form>
  );
}
