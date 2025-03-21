import { AI } from "@raycast/api";
import { z } from "zod";
import { fetchTransactions } from "../lib/api";
import { formatToReadableAmount, time } from "@lib/utils";
import type { TransactionDetail, CurrencyFormat } from "../types";

// Shared input schema for both Raycast and CLI
const inputSchema = z.object({
  since_date: z.string().optional(),
  limit: z.number().optional()
});

// Format transaction for display
function formatTransaction(transaction: TransactionDetail, currencyFormat?: CurrencyFormat | null) {
  const date = time(transaction.date).format("MMM D");
  const amount = formatToReadableAmount({ 
    amount: transaction.amount,
    currency: currencyFormat,
    prefixNegativeSign: true
  });
  const payee = transaction.payee_name || "Unknown Payee";
  const category = transaction.category_name || "Uncategorized";
  const memo = transaction.memo ? ` (${transaction.memo})` : "";
  const status = transaction.cleared === "cleared" ? "✓" : "⋯";
  const icon = transaction.amount < 0 ? "↑" : "↓";
  
  return `${icon} ${date}: ${amount} to ${payee} (${category})${memo} ${status}`;
}

// Shared business logic
async function executeListTransactions(params: z.infer<typeof inputSchema>) {
  const { transactions, currency_format } = await fetchTransactions(params.since_date);
  return transactions.map(t => formatTransaction(t, currency_format));
}

// Export for both Raycast and direct usage
export async function listTransactions(params: z.infer<typeof inputSchema>) {
  const validatedParams = inputSchema.parse(params);
  const results = await executeListTransactions(validatedParams);
  
  return {
    success: true,
    message: `Found ${results.length} transactions:`,
    transactions: results
  };
}

// Raycast tool wrapper
export default async function Command(props: z.infer<typeof inputSchema>) {
  return listTransactions(props);
}

Command.schema = inputSchema;
Command.description = "List recent transactions";

// CLI support when run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const params = {
    since_date: args[0],
    limit: args[1] ? parseInt(args[1], 10) : undefined
  };
  
  listTransactions(params)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(console.error);
}

export const confirmation = async (input: z.infer<typeof inputSchema>) => {
  const dateStr = input.since_date || "all time";
  const limitStr = input.limit ? ` (limited to ${input.limit} transactions)` : "";
  return {
    message: `List transactions since ${dateStr}${limitStr}?`
  };
}; 