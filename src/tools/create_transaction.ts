import { AI } from "@raycast/api";
import { z } from "zod";
import { createTransaction } from "../lib/api";
import { formatToReadableAmount } from "@lib/utils";
import { useLocalStorage } from "@raycast/utils";
import type { CurrencyFormat } from "../types";

// Shared input schema for both Raycast and CLI
const inputSchema = z.object({
  amount: z.number(),
  payee_name: z.string().optional(),
  category_id: z.string().optional(),
  memo: z.string().optional(),
  date: z.string().optional()
});

// Shared business logic
async function executeCreateTransaction(params: z.infer<typeof inputSchema>) {
  const { value: currencyFormat } = useLocalStorage<CurrencyFormat | null>("activeBudgetCurrency", null);
  const transaction = await createTransaction("last-used", params);
  
  if (!transaction) {
    throw new Error("Failed to create transaction");
  }

  return {
    id: transaction.id,
    amount: formatToReadableAmount({ 
      amount: transaction.amount,
      currency: currencyFormat,
      prefixNegativeSign: true
    }),
    payee: transaction.payee_name || "Unknown Payee",
    category: transaction.category_name || "Uncategorized",
    date: transaction.date
  };
}

// Export for both Raycast and direct usage
export async function createTransactionTool(params: z.infer<typeof inputSchema>) {
  const validatedParams = inputSchema.parse(params);
  const result = await executeCreateTransaction(validatedParams);
  
  return {
    success: true,
    message: `Created transaction: ${result.amount} to ${result.payee} on ${result.date}`,
    data: result
  };
}

// Raycast tool wrapper
export default async function Command(props: z.infer<typeof inputSchema>) {
  return createTransactionTool(props);
}

Command.schema = inputSchema;
Command.description = "Create a new transaction with amount, payee, and category";

// CLI support when run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const params = {
    amount: parseFloat(args[0]),
    payee_name: args[1],
    category_id: args[2],
    memo: args[3],
    date: args[4]
  };
  
  createTransactionTool(params)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(console.error);
}

export const confirmation = async (input: z.infer<typeof inputSchema>) => {
  const { value: currencyFormat } = useLocalStorage<CurrencyFormat | null>("activeBudgetCurrency", null);
  const amount = formatToReadableAmount({ 
    amount: input.amount,
    currency: currencyFormat,
    prefixNegativeSign: true
  });
  const payee = input.payee_name || "Unknown Payee";
  return {
    message: `Create transaction: ${amount} to ${payee}?`
  };
}; 