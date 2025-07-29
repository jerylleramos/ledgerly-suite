"use client";

import { createCustomer, State } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { useActionState, useState } from "react";

export default function Form() {
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(
    async (prevState: typeof initialState, formData: FormData) => await createCustomer(prevState, formData),
    initialState
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    // No longer required
  }

  return (
    <form action={formAction} onSubmit={handleFormSubmit}>
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
              <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border" />
              <button type="button" className="text-xs text-red-500 underline" onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}>Remove</button>
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
        <Button type="submit">Create Customer</Button>
      </div>
      {state.message && (
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      )}
    </form>
  );
}
