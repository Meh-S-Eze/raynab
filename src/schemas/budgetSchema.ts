// src/schemas/budgetSchema.ts
import { z } from 'zod';

// Budget schema for MCP tools
export const BudgetSchema = z.object({
  id: z.string(),
  name: z.string(),
  last_modified_on: z.string().optional(),
  first_month: z.string().optional(),
  last_month: z.string().optional(),
  date_format: z.object({
    format: z.string()
  }).optional(),
  currency_format: z.object({
    iso_code: z.string(),
    example_format: z.string(),
    decimal_digits: z.number(),
    decimal_separator: z.string(),
    symbol_first: z.boolean(),
    group_separator: z.string(),
    currency_symbol: z.string(),
    display_symbol: z.boolean()
  }).optional()
});

// Schema for budget summary parameters
export const BudgetSummarySchema = z.object({
  include_accounts: z.boolean().optional()
});

// Schema for budget details parameters
export const BudgetDetailsSchema = z.object({
  budget_id: z.string().optional(),
  month: z.string().optional()
});

export type Budget = z.infer<typeof BudgetSchema>;
export type BudgetSummaryParams = z.infer<typeof BudgetSummarySchema>;
export type BudgetDetailsParams = z.infer<typeof BudgetDetailsSchema>;
