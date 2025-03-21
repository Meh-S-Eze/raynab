import { AI } from "@raycast/api";
import { z } from "zod";
import { getBudgetSummary } from "../lib/api";
import { formatToReadableAmount } from "@lib/utils";

// Shared input schema for both Raycast and CLI
const inputSchema = z.object({});

// Shared business logic
async function executeBudgetSummary() {
  const { income, budgeted, activity } = await getBudgetSummary();
  
  return {
    income: formatToReadableAmount({ amount: income }),
    budgeted: formatToReadableAmount({ amount: budgeted }),
    activity: formatToReadableAmount({ amount: activity })
  };
}

// Export for both Raycast and direct usage
export async function getBudgetSummaryTool() {
  const data = await executeBudgetSummary();
  
  return {
    success: true,
    message: `Budget Summary for Current Month:
• Income: ${data.income}
• Budgeted: ${data.budgeted}
• Activity: ${data.activity}`,
    data
  };
}

// Raycast tool wrapper
export default async function Command() {
  return getBudgetSummaryTool();
}

Command.schema = inputSchema;
Command.description = "Get budget summary showing income, budgeted amount, and activity for current month";

// CLI support when run directly
if (require.main === module) {
  getBudgetSummaryTool()
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(console.error);
}

export const confirmation = async () => ({
  message: "Retrieve current month's budget summary?"
}); 