// src/schemas/accountSchema.ts
import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  // Other fields from YNAB API
});

export type Account = z.infer<typeof AccountSchema>;
