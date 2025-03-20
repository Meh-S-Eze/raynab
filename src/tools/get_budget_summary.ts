import { Tool } from "@raycast/api";
import { getBudgetSummary } from "../lib/api";
import { formatToReadableAmount } from "@lib/utils";

type Input = Record<string, never>; // Empty object type since this tool takes no parameters

/**
 * Get budget summary for current month
 */
export default async function Command() {
  try {
    const summary = await getBudgetSummary();
    
    if (!summary) {
      return {
        error: true,
        message: "Could not retrieve budget summary. Please make sure you have selected a budget in YNAB."
      };
    }

    const formatAmount = (amount: number) => formatToReadableAmount({
      amount,
      currency: summary.currency_format,
      prefixNegativeSign: true
    });

    return {
      success: true,
      data: {
        income: formatAmount(summary.income),
        budgeted: formatAmount(summary.budgeted),
        activity: formatAmount(summary.activity)
      },
      message: `Budget Summary for Current Month:
• Income: ${formatAmount(summary.income)}
• Budgeted: ${formatAmount(summary.budgeted)}
• Activity: ${formatAmount(summary.activity)}`
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "An unknown error occurred while fetching the budget summary."
    };
  }
}

// Add confirmation to show what will be retrieved
export const confirmation: Tool.Confirmation<Input> = async () => {
  return {
    message: "Retrieve current month's budget summary?"
  };
}; 