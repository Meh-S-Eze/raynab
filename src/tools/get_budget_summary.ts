import { Tool } from "@raycast/api";
import { getBudgetSummary } from "../lib/api";

type Input = Record<string, never>; // Empty object type since this tool takes no parameters

/**
 * Get budget summary for current month
 */
export default async function Command() {
  const summary = await getBudgetSummary();
  return summary;
}

// Add confirmation to show what will be retrieved
export const confirmation: Tool.Confirmation<Input> = async () => {
  return {
    message: "Retrieve current month's budget summary?"
  };
}; 