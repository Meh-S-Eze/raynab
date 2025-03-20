import { Tool } from "@raycast/api";
import { fetchTransactions } from "../lib/api";
import { formatToReadableAmount, time } from "@lib/utils";
import type { TransactionDetail } from "../types";

type Input = {
  since_date?: string;
  limit?: number;
};

function formatTransaction(transaction: TransactionDetail, currencyFormat: any): string {
  const date = time(transaction.date).format('LL');
  const amount = formatToReadableAmount({ 
    amount: transaction.amount, 
    currency: currencyFormat,
    prefixNegativeSign: true 
  });
  const icon = transaction.amount > 0 ? '🟢' : '🔴';
  const payee = transaction.payee_name || 'No payee';
  const category = transaction.category_name || 'Uncategorized';
  const memo = transaction.memo ? ` - ${transaction.memo}` : '';
  const status = transaction.approved ? '✓' : '⚠️';
  
  return `${icon} ${date}: ${amount} to ${payee} (${category})${memo} ${status}`;
}

export default async function Command(input: Input) {
  try {
    const { transactions, currency_format } = await fetchTransactions(input.since_date);
    
    if (!transactions || transactions.length === 0) {
      return {
        message: "No transactions found for the specified period.",
        transactions: []
      };
    }
    
    const formattedTransactions = transactions
      .slice(0, input.limit || 50)
      .map(t => formatTransaction(t, currency_format));

    return {
      message: `Found ${formattedTransactions.length} transactions:`,
      transactions: formattedTransactions
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "An unknown error occurred while fetching transactions."
    };
  }
}

export const confirmation: Tool.Confirmation<Input> = async (input) => {
  return {
    message: `List transactions${input.since_date ? ` since ${input.since_date}` : ''}?`,
    info: [
      input.since_date ? { name: "Since Date", value: input.since_date } : undefined,
      input.limit ? { name: "Limit", value: input.limit.toString() } : undefined
    ].filter(Boolean) as { name: string; value: string }[]
  };
}; 