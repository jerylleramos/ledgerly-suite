const ITEMS_PER_PAGE = 6;
import postgres from 'postgres';
import { Item } from './items-schema';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchFilteredItems(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<Item[]>`
      SELECT id, name, description, price, unit, created_at, updated_at
      FROM items
      WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch items table.');
  }
}

export async function fetchItemsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*) FROM items WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`}`;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of items.');
  }
}
