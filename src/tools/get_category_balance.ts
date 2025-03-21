import { AI } from "@raycast/api";
import { z } from "zod";
import { getCategoryBalance } from "../lib/api";
import { formatToReadableAmount } from "@lib/utils";
import { useLocalStorage } from "@raycast/utils";
import type { CurrencyFormat } from "../types";

// Shared input schema for both Raycast and CLI
const inputSchema = z.object({
  category_id: z.string()
});

// Shared business logic
async function executeGetCategoryBalance(params: z.infer<typeof inputSchema>) {
  const { value: currencyFormat } = useLocalStorage<CurrencyFormat | null>("activeBudgetCurrency", null);
  const { balance, activity, budgeted } = await getCategoryBalance(params.category_id);
  
  return {
    balance: formatToReadableAmount({ amount: balance, currency: currencyFormat, prefixNegativeSign: true }),
    activity: formatToReadableAmount({ amount: activity, currency: currencyFormat, prefixNegativeSign: true }),
    budgeted: formatToReadableAmount({ amount: budgeted, currency: currencyFormat, prefixNegativeSign: true })
  };
}

// Export for both Raycast and direct usage
export async function getCategoryBalanceTool(params: z.infer<typeof inputSchema>) {
  const validatedParams = inputSchema.parse(params);
  const result = await executeGetCategoryBalance(validatedParams);
  
  return {
    success: true,
    message: `Category Balance:
• Balance: ${result.balance}
• Activity: ${result.activity}
• Budgeted: ${result.budgeted}`,
    data: result
  };
}

// Raycast tool wrapper
export default async function Command(props: z.infer<typeof inputSchema>) {
  return getCategoryBalanceTool(props);
}

Command.schema = inputSchema;
Command.description = "Get category balance, activity and budgeted amount";

// CLI support when run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const params = {
    category_id: args[0]
  };
  
  getCategoryBalanceTool(params)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(console.error);
}

export const confirmation = async (input: z.infer<typeof inputSchema>) => ({
  message: `Get balance for category ${input.category_id}?`
}); 