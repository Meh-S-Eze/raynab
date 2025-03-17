// src/tools/transactionTools.ts
import { z } from 'zod';
import { getYnabAPI, getDefaultBudgetId } from '../lib/ynabClient';
import { 
  Transaction, 
  ListTransactionsParams, 
  ListTransactionsSchema,
  CreateTransactionParams,
  CreateTransactionSchema
} from '../schemas/transactionSchema';
import { TransactionDetail } from 'ynab';

/**
 * Lists transactions based on specified filters
 */
export const listTransactions = {
  description: "List transactions from your YNAB budget",
  parameters: ListTransactionsSchema,
  handler: async (params: ListTransactionsParams) => {
    try {
      const ynab = await getYnabAPI();
      const budgetId = params.budget_id || getDefaultBudgetId();
  
      console.log(`Fetching transactions for budget ${budgetId}`);
      const response = await ynab.transactions.getTransactions(budgetId, params.since_date);
      let transactions = response.data.transactions;
  
      // Apply filters if specified
      if (params.account_id) {
        transactions = transactions.filter((t: TransactionDetail) => t.account_id === params.account_id);
      }
  
      if (params.type === 'inflow') {
        transactions = transactions.filter((t: TransactionDetail) => t.amount >= 0);
      } else if (params.type === 'outflow') {
        transactions = transactions.filter((t: TransactionDetail) => t.amount < 0);
      }
  
      if (params.category_id) {
        transactions = transactions.filter((t: TransactionDetail) => t.category_id === params.category_id);
      }
  
      if (params.unreviewed_only) {
        transactions = transactions.filter((t: TransactionDetail) => !t.approved);
      }
  
      // Apply limit if specified
      if (params.limit && params.limit > 0) {
        transactions = transactions.slice(0, params.limit);
      }
  
      // Format transactions for response
      return {
        success: true,
        transactions: transactions.map((t: TransactionDetail) => ({
          id: t.id,
          date: t.date,
          amount: t.amount / 1000, // Convert from milliunits
          memo: t.memo,
          payee_name: t.payee_name,
          category_name: t.category_name,
          account_name: t.account_name,
          cleared: t.cleared,
          approved: t.approved,
          flag_color: t.flag_color
        }))
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

/**
 * Creates a new transaction
 */
export const createTransaction = {
  description: "Create a new transaction in your YNAB budget",
  parameters: CreateTransactionSchema,
  handler: async (params: CreateTransactionParams) => {
    try {
      const ynab = await getYnabAPI();
      const budgetId = params.budget_id || getDefaultBudgetId();
  
      console.log(`Creating transaction in budget ${budgetId}`);
      const response = await ynab.transactions.createTransaction(budgetId, {
        transaction: {
          account_id: params.account_id,
          date: params.date,
          amount: Math.round(params.amount * 1000), // Convert to milliunits
          payee_name: params.payee_name,
          category_id: params.category_id,
          memo: params.memo,
          cleared: params.cleared ? 'cleared' : 'uncleared'
        }
      });
  
      return {
        success: true,
        transaction: {
          id: response.data.transaction.id,
          date: response.data.transaction.date,
          amount: response.data.transaction.amount / 1000, // Convert from milliunits
          payee_name: response.data.transaction.payee_name,
          category_id: response.data.transaction.category_id,
          memo: response.data.transaction.memo
        }
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Implement other transaction functions based on existing command files
