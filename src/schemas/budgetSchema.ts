// src/schemas/budgetSchema.ts
import { z } from 'zod';

export const BudgetSchema = z.object({
  id: z.string(),
  name: z.string(),
  // Other fields from YNAB API
});

export type Budget = z.infer<typeof BudgetSchema>;
