'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { CreateItem, Item, UpdateItem } from './items-schema';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



export async function getItems() {
  try {
    const data = await sql<Item[]>`SELECT id, name, description, price, unit, created_at, updated_at FROM items ORDER BY created_at DESC`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch items.');
  }
}


export async function getItemById(id: string) {
  try {
    const data = await sql<Item[]>`SELECT id, name, description, price, unit, created_at, updated_at FROM items WHERE id = ${id} LIMIT 1`;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch item.');
  }
}

export async function createItem(prevState: any, formData: FormData) {
  const validatedFields = CreateItem.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    unit: formData.get('unit'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create item.',
    };
  }
  const { name, description, price, unit } = validatedFields.data;
  try {
    await sql`
      INSERT INTO items (name, description, price, unit)
      VALUES (${name}, ${description || ''}, ${price}, ${unit || ''})
    `;
  } catch {
    return { message: 'Database Error: Failed to create item.', errors: {} };
  }
  revalidatePath('/dashboard/items');
  redirect('/dashboard/items');
}

export async function updateItem(id: string, prevState: any, formData: FormData) {
  const validatedFields = UpdateItem.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    unit: formData.get('unit'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update item.',
    };
  }
  const { name, description, price, unit } = validatedFields.data;
  try {
    await sql`
      UPDATE items SET name = ${name}, description = ${description || ''}, price = ${price}, unit = ${unit || ''} WHERE id = ${id}
    `;
  } catch {
    return { message: 'Database Error: Failed to update item.', errors: {} };
  }

  revalidatePath('/dashboard/items');
  redirect('/dashboard/items');
}

export async function deleteItem(id: string) {
  await sql`DELETE FROM items WHERE id = ${id}`;
  revalidatePath('/dashboard/items');
}


