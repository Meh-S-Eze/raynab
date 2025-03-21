// Import types from Raycast for type compatibility
import type { Toast as RaycastToast } from '@raycast/api';

// Import utilities based on environment
const {
  getPreferenceValues,
  showToast,
  captureException,
  Toast
}: {
  getPreferenceValues: <T extends { apiToken: string }>(args?: any) => T;
  showToast: (params: { title: string; message?: string; style?: RaycastToast.Style }) => void;
  captureException: (error: unknown) => void;
  Toast: { Style: typeof RaycastToast.Style };
} = process.env.RAYCAST_MODE === 'false'
  ? require('./cli-utils')
  : require('@raycast/api');

import * as ynab from 'ynab';
import { displayError, isYnabError } from './errors';
import type { Period, BudgetSummary, SaveTransaction, NewTransaction } from '@srcTypes';
import { time } from './utils';
import { SaveScheduledTransaction } from 'ynab';
import { useLocalStorage } from '@raycast/utils';

function getApiToken(): string {
  const { apiToken } = getPreferenceValues();
  if (!apiToken) {
    throw new Error('YNAB API token not found');
  }
  return apiToken;
}

function logMessage(title: string, message?: string, style?: RaycastToast.Style) {
  if (process.env.RAYCAST_MODE === 'false') {
    console.log(`[${style || 'info'}] ${title}${message ? ': ' + message : ''}`);
  } else {
    showToast({ title, message, style });
  }
}

function handleError(error: unknown, defaultMessage: string): never {
  if (process.env.RAYCAST_MODE === 'false') {
    console.error('Error:', error);
  } else {
    captureException(error);
  }

  if (isYnabError(error)) {
    const { title, message } = displayError(error, defaultMessage);
    logMessage(title, message, Toast.Style.Failure);
    throw new Error(message);
  } else {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logMessage('Something went wrong', errorMessage, Toast.Style.Failure);
    throw error;
  }
}

const apiToken = getApiToken();
const client = new ynab.API(apiToken);

export async function fetchBudgets() {
  try {
    const budgetsResponse = await client.budgets.getBudgets();
    const budgets = budgetsResponse.data.budgets;

    const allBudgets: BudgetSummary[] = budgets.map(({ id, name, last_modified_on, currency_format }) => {
      return { id, name, last_modified_on, currency_format };
    });

    return allBudgets;
  } catch (error) {
    return handleError(error, 'Failed to fetch budgets');
  }
}

export async function fetchBudget(selectedBudgetId: string) {
  try {
    const budgetResponse = await client.budgets.getBudgetById(selectedBudgetId);
    const { months, currency_format } = budgetResponse.data.budget;

    return { months, currency_format };
  } catch (error) {
    return handleError(error, 'Failed to fetch budget');
  }
}

export async function fetchCategoryGroups(selectedBudgetId: string) {
  try {
    const categoriesResponse = await client.categories.getCategories(selectedBudgetId);
    const categoryGroups = categoriesResponse.data.category_groups;
    return categoryGroups;
  } catch (error) {
    return handleError(error, 'Failed to fetch categories');
  }
}

export async function fetchPayees(selectedBudgetId: string) {
  try {
    const payeesResponse = await client.payees.getPayees(selectedBudgetId);
    const payees = payeesResponse.data.payees;
    return payees;
  } catch (error) {
    return handleError(error, 'Failed to fetch payees');
  }
}

export async function fetchAccounts(selectedBudgetId: string) {
  try {
    const accountsResponse = await client.accounts.getAccounts(selectedBudgetId || 'last-used');
    const accounts = accountsResponse.data.accounts;

    return accounts;
  } catch (error) {
    return handleError(error, 'Failed to fetch accounts');
  }
}

export async function fetchTransactions(sinceDate?: string) {
  try {
    const budgetResponse = await client.budgets.getBudgetById('last-used');
    const { budget } = budgetResponse.data;
    
    const transactionsResponse = await client.transactions.getTransactions('last-used');
    
    const transactions = transactionsResponse.data.transactions;
    // Filter by date if provided
    const filteredTransactions = sinceDate 
      ? transactions.filter(t => t.date >= sinceDate)
      : transactions;
    // Sort by date, newest first
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return {
      transactions: filteredTransactions,
      currency_format: budget.currency_format
    };
  } catch (error) {
    handleError(error, 'Failed to fetch transactions');
  }
}

export async function fetchScheduledTransactions(selectedBudgetId: string) {
  try {
    const scheduledTransactionsResponse = await client.scheduledTransactions.getScheduledTransactions(selectedBudgetId);
    const transactions = scheduledTransactionsResponse.data.scheduled_transactions;

    return transactions;
  } catch (error) {
    return handleError(error, 'Failed to fetch scheduled transactions');
  }
}

export async function updateTransaction(selectedBudgetId: string, transactionId: string, data: SaveTransaction) {
  try {
    const updateResponse = await client.transactions.updateTransaction(selectedBudgetId || 'last-used', transactionId, {
      transaction: data,
    });
    const { transaction: updatedTransaction } = updateResponse.data;
    return updatedTransaction;
  } catch (error) {
    return handleError(error, 'Failed to update transaction');
  }
}

export async function createTransaction(selectedBudgetId: string, transactionData: NewTransaction) {
  try {
    const transactionCreationResponse = await client.transactions.createTransaction(selectedBudgetId || 'last-used', {
      transaction: transactionData,
    });

    if (transactionCreationResponse.data.duplicate_import_ids) throw `Transcation already exists`;

    const createdTransaction = transactionCreationResponse.data.transaction;

    return createdTransaction;
  } catch (error) {
    return handleError(error, 'Failed to create transaction');
  }
}

export async function deleteTransaction(selectedBudgetId: string, transactionId: string) {
  try {
    const updateResponse = await client.transactions.deleteTransaction(selectedBudgetId || 'last-used', transactionId);

    const { transaction: deletedTransaction } = updateResponse.data;
    return deletedTransaction;
  } catch (error) {
    return handleError(error, 'Failed to delete transaction');
  }
}

export async function createScheduledTransaction(selectedBudgetId: string, transactionData: SaveScheduledTransaction) {
  try {
    const transactionCreationResponse = await client.scheduledTransactions.createScheduledTransaction(
      selectedBudgetId || 'last-used',
      {
        scheduled_transaction: transactionData,
      },
    );

    const createdTransaction = transactionCreationResponse.data.scheduled_transaction;

    return createdTransaction;
  } catch (error) {
    return handleError(error, 'Failed to create scheduled transaction');
  }
}

export async function updateCategory(selectedBudgetId: string, categoryId: string, data: { budgeted: number }) {
  try {
    const updateResponse = await client.categories.updateMonthCategory(
      selectedBudgetId || 'last-used',
      'current',
      categoryId,
      {
        category: data,
      },
    );
    const updatedCategory = updateResponse.data;
    return updatedCategory;
  } catch (error) {
    return handleError(error, 'Failed to update category');
  }
}

export async function getBudgetSummary() {
  try {
    // Always use 'last-used' which is supported by the YNAB API
    const budgetResponse = await client.budgets.getBudgetById('last-used');
    const { months, currency_format } = budgetResponse.data.budget;
    
    if (!months || months.length === 0) {
      throw new Error('No budget months found. Please make sure you have a budget set up in YNAB.');
    }
    
    // Get current month's data
    const currentMonth = months[months.length - 1];
    
    return {
      income: currentMonth.income,
      budgeted: currentMonth.budgeted,
      activity: currentMonth.activity,
      currency_format
    };
  } catch (error) {
    return handleError(error, 'Failed to fetch budget summary');
  }
}

export async function getCategoryBalance(categoryId: string) {
  try {
    const budgetResponse = await client.budgets.getBudgetById('last-used');
    const { budget } = budgetResponse.data;
    
    const category = budget.categories?.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    
    return {
      ...category,
      currency_format: budget.currency_format
    };
  } catch (error) {
    return handleError(error, 'Failed to fetch category balance');
  }
}
