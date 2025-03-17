// src/schemas/accountSchema.ts
import { z } from 'zod';

// Account schema for MCP tools
export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['checking', 'savings', 'cash', 'creditCard', 'lineOfCredit', 'otherAsset', 'otherLiability', 'mortgage', 'autoLoan', 'studentLoan', 'personalLoan', 'medicalDebt', 'otherDebt']),
  on_budget: z.boolean(),
  closed: z.boolean(),
  balance: z.number(),
  cleared_balance: z.number(),
  uncleared_balance: z.number(),
  transfer_payee_id: z.string().optional(),
  direct_import_linked: z.boolean().optional(),
  direct_import_in_error: z.boolean().optional(),
  deleted: z.boolean().optional()
});

// Schema for list accounts parameters
export const ListAccountsSchema = z.object({
  budget_id: z.string().optional(),
  include_closed: z.boolean().optional()
});

export type Account = z.infer<typeof AccountSchema>;
export type ListAccountsParams = z.infer<typeof ListAccountsSchema>;
