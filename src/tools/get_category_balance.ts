import { Tool } from "@raycast/api";
import { getCategoryBalance } from "../lib/api";
import { formatToReadableAmount } from "@lib/utils";

type Input = {
  category_id: string;
};

export default async function Command(input: Input) {
  try {
    const result = await getCategoryBalance(input.category_id);

    if (!result) {
      return {
        error: true,
        message: "Could not retrieve category balance. Please make sure you have selected a budget in YNAB."
      };
    }

    const formatAmount = (amount: number) => formatToReadableAmount({
      amount,
      currency: result.currency_format,
      prefixNegativeSign: true
    });

    const icon = result.balance > 0 ? '🟢' : result.balance < 0 ? '🔴' : '⚪️';

    return {
      success: true,
      data: {
        categoryId: result.id,
        name: result.name,
        balance: formatAmount(result.balance),
        activity: formatAmount(result.activity),
        budgeted: formatAmount(result.budgeted)
      },
      message: `${icon} Category "${result.name}":
• Balance: ${formatAmount(result.balance)}
• Activity this month: ${formatAmount(result.activity)}
• Budgeted: ${formatAmount(result.budgeted)}`
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "An unknown error occurred while fetching the category balance."
    };
  }
}

export const confirmation: Tool.Confirmation<Input> = async (input) => {
  if (!input.category_id) {
    return {
      error: true,
      message: "Please provide a category ID to check the balance."
    };
  }
  
  return {
    message: `Get balance for category ${input.category_id}?`,
    info: [
      { name: "Category ID", value: input.category_id }
    ]
  };
}; 