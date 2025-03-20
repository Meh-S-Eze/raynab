import { z } from "zod";
import { Tool } from "@raycast/api";
import { fetchTransactions } from "../lib/api";
import { RaynabToolSchema } from "../lib/raynab-tools";
import { getPreferenceValues } from "@raycast/api";
import type { TransactionDetail } from "../types";

const { list_transactions } = RaynabToolSchema;
const { selectedBudgetId } = getPreferenceValues<{ selectedBudgetId: string }>();

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 1000); // YNAB stores amounts in milliunits
}

function formatTransaction(transaction: TransactionDetail): string {
  const date = new Date(transaction.date).toLocaleDateString();
  const amount = formatAmount(transaction.amount);
  const payee = transaction.payee_name || 'No payee';
  const category = transaction.category_name || 'Uncategorized';
  const memo = transaction.memo ? ` - ${transaction.memo}` : '';
  
  return `${date}: ${amount} to ${payee} (${category})${memo}`;
}

export default async function tool(input: z.infer<typeof list_transactions.parameters>) {
  try {
    const transactions = await fetchTransactions(selectedBudgetId, 'month');
    if (!transactions || transactions.length === 0) {
      return {
        message: "No transactions found for the current month.",
        transactions: []
      };
    }
    
    const formattedTransactions = transactions.map(formatTransaction);
    return {
      message: `Found ${transactions.length} transactions for the current month:`,
      transactions: formattedTransactions
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list transactions: ${error.message}`);
    }
    throw error;
  }
}

export const confirmation: Tool.Confirmation<z.infer<typeof list_transactions.parameters>> = async (input) => {
  return {
    message: `Are you sure you want to list transactions?`,
    info: [
      { name: "Since Date", value: input.since_date || "Not specified" }
    ]
  };
}; 