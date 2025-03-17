// src/schemas/transactionSchema.ts
import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  memo: z.string().optional(),
  cleared: z.enum(['cleared', 'uncleared', 'reconciled']),
  approved: z.boolean(),
  // Other fields from YNAB API
});

export type Transaction = z.infer<typeof TransactionSchema>;
