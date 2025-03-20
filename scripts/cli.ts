#!/usr/bin/env node

import { program } from 'commander';
import { getBudgetSummary, fetchTransactions, getCategoryBalance, createTransaction } from '../src/lib/api';
import { formatToReadableAmount, formatToYnabAmount } from '../src/lib/utils';
import type { NewTransaction } from '../src/types';

interface ListTransactionsOptions {
  since?: string;
  limit?: string;
}

interface CategoryBalanceOptions {
  categoryId: string;
}

interface CreateTransactionOptions {
  amount: string;
  payee_name?: string;
  date?: string;
  memo?: string;
  category_id?: string;
}

// Reuse existing business logic but provide CLI interface
program
  .version('1.0.0')
  .description('YNAB CLI Tool Adapter');

program
  .command('get-budget-summary')
  .description('Get budget summary for current month')
  .action(async () => {
    try {
      const summary = await getBudgetSummary();
      if (!summary) {
        console.error('Could not retrieve budget summary. Please make sure you have selected a budget in YNAB.');
        process.exit(1);
      }
      console.log(JSON.stringify(summary, null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

program
  .command('list-transactions')
  .description('List recent transactions')
  .option('-s, --since <date>', 'Only show transactions since date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Limit number of transactions', '50')
  .action(async (options: ListTransactionsOptions) => {
    try {
      const { transactions, currency_format } = await fetchTransactions(options.since);
      if (!transactions || transactions.length === 0) {
        console.log('No transactions found for the specified period.');
        return;
      }
      const formatted = transactions
        .slice(0, parseInt(options.limit || '50'))
        .map(t => ({
          date: t.date,
          amount: formatToReadableAmount({ amount: t.amount, currency: currency_format, prefixNegativeSign: true }),
          payee: t.payee_name || 'No payee',
          category: t.category_name || 'Uncategorized',
          memo: t.memo || '',
          approved: t.approved
        }));
      console.log(JSON.stringify(formatted, null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

program
  .command('get-category-balance')
  .description('Get balance for a specific category')
  .requiredOption('-c, --category-id <id>', 'Category ID')
  .action(async (options: CategoryBalanceOptions) => {
    try {
      const result = await getCategoryBalance(options.categoryId);
      if (!result) {
        console.error('Could not retrieve category balance. Please make sure you have selected a budget in YNAB.');
        process.exit(1);
      }
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

program
  .command('create-transaction')
  .description('Create a new transaction')
  .requiredOption('-a, --amount <number>', 'Transaction amount')
  .option('-p, --payee-name <string>', 'Payee name')
  .option('-d, --date <date>', 'Transaction date (YYYY-MM-DD)', new Date().toISOString().split('T')[0])
  .option('-m, --memo <string>', 'Transaction memo')
  .option('-c, --category-id <string>', 'Category ID')
  .action(async (options: CreateTransactionOptions) => {
    try {
      const transaction: NewTransaction = {
        amount: parseFloat(options.amount),
        payee_name: options.payee_name,
        date: options.date || new Date().toISOString().split('T')[0],
        memo: options.memo,
        category_id: options.category_id
      };
      
      const result = await createTransaction('last-used', transaction);
      if (!result) {
        console.error('Failed to create transaction');
        process.exit(1);
      }
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

program.parse(process.argv); 