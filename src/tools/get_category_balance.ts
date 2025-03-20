import { z } from "zod";
import { Tool } from "@raycast/api";
import { RaynabToolSchema } from "../lib/raynab-tools";
import { getPreferenceValues } from "@raycast/api";
import * as ynab from 'ynab';

const { get_category_balance } = RaynabToolSchema;
const { selectedBudgetId, apiToken } = getPreferenceValues<{ selectedBudgetId: string; apiToken: string }>();
const client = new ynab.API(apiToken);

export default async function tool(input: z.infer<typeof get_category_balance.parameters>) {
  try {
    const response = await client.categories.getMonthCategoryById(
      selectedBudgetId || 'last-used',
      'current',
      input.category_id
    );
    return response.data.category;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get category balance: ${error.message}`);
    }
    throw error;
  }
}

export const confirmation: Tool.Confirmation<z.infer<typeof get_category_balance.parameters>> = async (input) => {
  return {
    message: `Are you sure you want to get the balance for category ${input.category_id}?`,
    info: [
      { name: "Category ID", value: input.category_id }
    ]
  };
}; 