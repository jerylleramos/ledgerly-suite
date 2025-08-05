import { z } from 'zod';

export const ItemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required.' }).max(100),
  description: z.string().max(300).optional().or(z.literal('')),
  price: z.coerce.number().gt(0, { message: 'Price must be greater than 0.' }),
  unit: z.string().max(20).optional().or(z.literal('')),
});
export const CreateItem = ItemFormSchema.omit({ id: true });
export const UpdateItem = ItemFormSchema.omit({ id: true });
export type Item = z.infer<typeof ItemFormSchema>;
