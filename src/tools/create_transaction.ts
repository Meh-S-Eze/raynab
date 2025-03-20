import { z } from "zod";
import { Tool } from "@raycast/api";
import { createTransaction } from "../lib/api";
import type { NewTransaction } from "../types";
import { RaynabToolSchema } from "../lib/raynab-tools";
import { getPreferenceValues } from "@raycast/api";

const { create_transaction } = RaynabToolSchema;
const { selectedBudgetId } = getPreferenceValues<{ selectedBudgetId: string }>();

export default function tool(input: z.infer<typeof create_transaction.parameters>) {
  return createTransaction(selectedBudgetId, input);
}

export const confirmation: Tool.Confirmation<z.infer<typeof create_transaction.parameters>> = async (input) => {
  return {
    message: `Are you sure you want to create a transaction of ${Math.abs(input.amount)} for ${input.payee}?`,
    info: [
      { name: "Amount", value: input.amount.toString() },
      { name: "Payee", value: input.payee },
      { name: "Date", value: input.date }
    ]
  };
}; 