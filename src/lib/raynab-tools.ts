import { z } from "zod";
import { Tool, Action } from "@raycast/api";
import { formatToReadableAmount } from "./utils";
import { CurrencyFormat } from "@srcTypes";

// Shared validators
const uuidSchema = z.string().uuid("Must be a valid UUID");
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((date) => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
  }, "Future dates are not permitted for regular transactions");

// Transaction schema for reuse
const transactionSchema = z.object({
  payee: z.string().min(1, "Payee name is required").max(50, "Payee name too long"),
  amount: z.number()
    .describe("Transaction amount in dollars (e.g., 10.50 for $10.50)")
    .refine((amount) => amount !== 0, "Amount cannot be zero")
    .refine(
      (amount) => Math.abs(amount) <= 999999999.99,
      "Amount exceeds maximum allowed (999,999,999.99)"
    ),
  category_id: uuidSchema.describe("Budget category UUID"),
  account_id: uuidSchema.describe("Account UUID"),
  date: dateSchema,
  memo: z.string().max(200, "Memo too long").optional().describe("Optional transaction memo"),
  import_id: z.string().max(36).optional().describe("Optional import ID for duplicate detection")
});

export const RaynabToolSchema = {
  create_transaction: {
    description: "Create a new transaction with amount, payee, and category",
    parameters: transactionSchema
  },
  get_budget_summary: {
    description: "Get budget summary showing income, budgeted amount, and activity for current month",
    parameters: z.object({})
  },
  list_transactions: {
    description: "List recent transactions with optional date filter",
    parameters: z.object({
      since_date: dateSchema.optional().describe("Filter transactions since date (YYYY-MM-DD)"),
      limit: z.number().min(1).max(50).optional().describe("Maximum number of transactions to return")
    })
  },
  get_category_balance: {
    description: "Get category balance, activity and budgeted amount",
    parameters: z.object({
      category_id: uuidSchema.describe("Category UUID to check")
    })
  }
} as const;

// Tool confirmations
export const confirmations: Record<keyof typeof RaynabToolSchema, Tool.Confirmation<any>> = {
  create_transaction: async (input) => {
    const amount = Math.abs(input.amount).toFixed(2);
    return {
      message: `Create a ${input.amount < 0 ? "spending" : "income"} transaction?`,
      info: [
        { name: "Amount", value: `$${amount}` },
        { name: "Payee", value: input.payee },
        { name: "Date", value: input.date },
        input.memo ? { name: "Memo", value: input.memo } : undefined
      ].filter(Boolean) as { name: string; value: string }[]
    };
  },
  get_budget_summary: async () => true,
  list_transactions: async () => true,
  get_category_balance: async () => true
};

// Export shared validators for reuse
export const validators = {
  uuidSchema,
  dateSchema,
  transactionSchema
}; 