// src/schemas/transactionSchema.ts
import { z } from 'zod';

// Transaction schema for MCP tools
export const TransactionSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  amount: z.number(),
  memo: z.string().optional(),
  cleared: z.enum(['cleared', 'uncleared', 'reconciled']).optional(),
  approved: z.boolean().optional(),
  flag_color: z.enum(['red', 'orange', 'yellow', 'green', 'blue', 'purple']).optional(),
  account_id: z.string(),
  payee_id: z.string().optional(),
  category_id: z.string().optional(),
  transfer_account_id: z.string().optional(),
  import_id: z.string().optional()
});

// Schema for list transactions parameters
export const ListTransactionsSchema = z.object({
  budget_id: z.string().optional(),
  account_id: z.string().optional(),
  since_date: z.string().optional(),
  type: z.enum(['inflow', 'outflow']).optional(),
  category_id: z.string().optional(),
  unreviewed_only: z.boolean().optional(),
  limit: z.number().optional()
});

// Schema for create transaction parameters
export const CreateTransactionSchema = z.object({
  budget_id: z.string().optional(),
  account_id: z.string(),
  date: z.string(),
  amount: z.number(),
  payee_name: z.string(),
  category_id: z.string().optional(),
  memo: z.string().optional(),
  cleared: z.boolean().optional()
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type ListTransactionsParams = z.infer<typeof ListTransactionsSchema>;
export type CreateTransactionParams = z.infer<typeof CreateTransactionSchema>;
