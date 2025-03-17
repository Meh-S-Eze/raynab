// src/lib/ynabClient.ts
import { API } from 'ynab';

let ynabAPI: API | null = null;

// Get YNAB API instance using token from environment variables
export async function getYnabAPI(): Promise<API> {
  if (!ynabAPI) {
    // Get token from environment variable
    const token = process.env.YNAB_TOKEN;

    if (!token) {
      throw new Error('YNAB_TOKEN environment variable is not set');
    }
    
    console.log('Initializing YNAB API client');
    ynabAPI = new API(token);
  }
  return ynabAPI;
}

// Get default budget ID from environment variables
export function getDefaultBudgetId(): string {
  const budgetId = process.env.YNAB_BUDGET_ID;
  if (!budgetId) {
    throw new Error('YNAB_BUDGET_ID environment variable is not set');
  }
  return budgetId;
}
