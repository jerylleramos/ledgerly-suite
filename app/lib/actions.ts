'use server';

import { signIn } from '@/auth';
import { put } from '@vercel/blob';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    name?: string[];
    email?: string[];
    photo?: string[];
  };
  message: string;
};
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Type for the shape returned by NextAuth signIn when redirect: false
type SignInResult = {
  error?: string | null;
  ok?: boolean;
  status?: number;
  url?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';
  const callbackUrl = formData.get('redirectTo')?.toString() ?? '/dashboard';

  try {
    // Call signIn with redirect: false so we can control the final redirect server-side
    const result = await signIn('credentials', { redirect: false, email, password, callbackUrl });

    // `signIn` may return an object with { error, ok, status, url }
    if (!result) return 'Invalid credentials.';

    const signInResult = result as SignInResult;

    // If the provider returned an error, show a friendly message
    if (signInResult.error) {
      const err = signInResult.error;
      if (err === 'CredentialsSignin' || err.toLowerCase().includes('credentials')) {
        return 'Invalid credentials.';
      }
      return err || 'Failed to sign in.';
    }

    // Successful sign in: perform server-side redirect to the validated URL
    const url = signInResult.url ?? callbackUrl;
    redirect(url);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields  = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data ?? {};
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert the new invoice into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    // Database error
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data ?? {};
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

// --- Customer Form Schema ---
const CustomerFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  photo: z.any().optional(),
});

const CreateCustomer = CustomerFormSchema.omit({ id: true });
const UpdateCustomer = CustomerFormSchema.omit({ id: true });

// --- Customer Actions ---
export async function createCustomer(prevState: State, formData: FormData) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    photo: formData.get('photo'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors ?? {},
      message: 'Missing or invalid fields. Failed to create customer.',
    };
  }
  const { name, email, photo } = validatedFields.data;
  let imageUrl = '';
  if (photo && typeof photo === 'object' && 'name' in photo && photo.size > 0) {
    try {
      // Upload file to Vercel Blob
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN environment variable is not set');
        return { message: 'Image upload is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.', errors: {} };
      }
      const fileName = `${Date.now()}-${photo.name}`;
      console.log(`Uploading file: ${fileName}`);
      const blob = await put(`customers/${fileName}`, photo, {
        access: 'public',
      });
      imageUrl = blob.url;
      console.log(`File uploaded successfully to: ${imageUrl}`);
    } catch (error) {
      console.error('Failed to upload image:', error);
      return { message: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`, errors: {} };
    }
  }
  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${imageUrl})
    `;
  } catch {
    return { message: 'Database Error: Failed to create customer.', errors: {} };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    photo: formData.get('photo'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors ?? {},
      message: 'Missing or invalid fields. Failed to update customer.',
    };
  }
  const { name, email, photo } = validatedFields.data;
  let imageUrl = '';
  let updateImage = false;
  let removeImage = false;
  
  if (photo && typeof photo === 'object' && 'name' in photo && photo.size > 0) {
    try {
      // Upload file to Vercel Blob
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN environment variable is not set');
        return { message: 'Image upload is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.', errors: {} };
      }
      const fileName = `${Date.now()}-${photo.name}`;
      console.log(`Uploading file: ${fileName}`);
      const blob = await put(`customers/${fileName}`, photo, {
        access: 'public',
      });
      imageUrl = blob.url;
      console.log(`File uploaded successfully to: ${imageUrl}`);
      updateImage = true;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return { message: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`, errors: {} };
    }
  } else if (photo === null || photo === '' || (typeof photo === 'string' && photo.length === 0)) {
    // If photo is explicitly removed (input cleared), set image_url to null/empty
    removeImage = true;
  }
  
  try {
    if (updateImage) {
      await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}, image_url = ${imageUrl}
        WHERE id = ${id}
      `;
    } else if (removeImage) {
      await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}, image_url = ''
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}
        WHERE id = ${id}
      `;
    }
  } catch {
    return { message: 'Database Error: Failed to update customer.', errors: {} };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath('/dashboard/customers');
}