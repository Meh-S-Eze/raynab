#!/usr/bin/env node

import { program } from 'commander';
import { fetchTransactions, getBudgetSummary, getCategoryBalance, createTransaction } from '../src/lib/api';
import { formatToReadableAmount } from '../src/lib/utils';

// Reuse existing business logic directly
program
  .version('1.0.0')
  .description('YNAB Tool CLI');

program
  .command('list-transactions')
  .description('List recent transactions')
  .option('-s, --since <date>', 'Only show transactions since date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Limit number of transactions', '10')
  .action(async (options) => {
    try {
      // Use the exact same business logic as the Raycast tool
      const { transactions, currency_format } = await fetchTransactions(options.since);
      
      if (!transactions || transactions.length === 0) {
        console.log('No transactions found for the specified period.');
        return;
      }
      
      const formatted = transactions
        .slice(0, parseInt(options.limit))
        .map(t => ({
          date: t.date,
          amount: formatToReadableAmount({ 
            amount: t.amount, 
            currency: currency_format,
            prefixNegativeSign: true 
          }),
          payee: t.payee_name || 'No payee',
          category: t.category_name || 'Uncategorized',
          memo: t.memo || '',
          approved: t.approved ? '✓' : '⚠️'
        }));

      console.log(JSON.stringify(formatted, null, 2));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv); 