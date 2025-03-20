import { z } from "zod";
import { Tool } from "@raycast/api";
import { createTransaction } from "../lib/api";
import { RaynabToolSchema } from "../lib/raynab-tools";
import { getPreferenceValues } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import { formatToReadableAmount, formatToYnabAmount } from "@lib/utils";
import { CurrencyFormat } from "@srcTypes";

const { create_transaction } = RaynabToolSchema;
const { selectedBudgetId } = getPreferenceValues<{ selectedBudgetId: string }>();

export default async function tool(input: z.infer<typeof create_transaction.parameters>) {
  try {
    const { value: activeBudgetCurrency } = useLocalStorage<CurrencyFormat | null>('activeBudgetCurrency', null);
    
    // Convert amount to YNAB format
    const ynabAmount = formatToYnabAmount(input.amount, activeBudgetCurrency);
    
    // Create transaction with formatted amount
    const result = await createTransaction(selectedBudgetId, {
      ...input,
      amount: ynabAmount
    });

    if (!result) {
      throw new Error('Failed to create transaction');
    }

    // Format response with proper currency formatting
    const formattedAmount = formatToReadableAmount({
      amount: ynabAmount,
      currency: activeBudgetCurrency,
      prefixNegativeSign: true
    });

    return {
      success: true,
      data: {
        transactionId: result.id,
        amount: formattedAmount,
        approved: result.approved
      },
      message: `Created a ${input.amount > 0 ? 'income' : 'expense'} transaction of ${formattedAmount}`
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
    throw error;
  }
}

export const confirmation: Tool.Confirmation<z.infer<typeof create_transaction.parameters>> = async (input) => {
  const { value: activeBudgetCurrency } = useLocalStorage<CurrencyFormat | null>('activeBudgetCurrency', null);
  const formattedAmount = formatToReadableAmount({
    amount: formatToYnabAmount(input.amount, activeBudgetCurrency),
    currency: activeBudgetCurrency,
    prefixNegativeSign: true
  });

  return {
    message: `Are you sure you want to create a transaction of ${formattedAmount} for ${input.payee}?`,
    info: [
      { name: "Amount", value: formattedAmount },
      { name: "Payee", value: input.payee },
      { name: "Date", value: input.date }
    ]
  };
}; 