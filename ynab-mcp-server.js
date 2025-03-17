#!/usr/bin/env node

// YNAB MCP server with actual YNAB API integration
require('dotenv').config();
const ynab = require('ynab');
const { createMCPServer } = require('@modelcontextprotocol/create-server');

// Log info
console.log('Starting YNAB MCP server...');
console.log(`YNAB_TOKEN: ${process.env.YNAB_TOKEN ? '****' : 'Not set'}`);
console.log(`YNAB_BUDGET_ID: ${process.env.YNAB_BUDGET_ID ? '****' : 'Not set'}`);

// Check if environment variables are set
if (!process.env.YNAB_TOKEN) {
  console.error('Error: YNAB_TOKEN environment variable is not set');
  process.exit(1);
}

if (!process.env.YNAB_BUDGET_ID) {
  console.error('Error: YNAB_BUDGET_ID environment variable is not set');
  process.exit(1);
}

// Initialize YNAB API
const ynabAPI = new ynab.API(process.env.YNAB_TOKEN);
const defaultBudgetId = process.env.YNAB_BUDGET_ID;

// Define YNAB tools
const tools = {
  // Transaction tools
  listTransactions: {
    description: "List transactions from your YNAB budget",
    parameters: {
      type: "object", 
      properties: {
        budget_id: { type: "string", description: "The budget ID (uses default if not specified)" },
        account_id: { type: "string", description: "Filter by account ID" },
        since_date: { type: "string", description: "Filter by date (YYYY-MM-DD)" },
        type: { type: "string", enum: ["inflow", "outflow"], description: "Filter by transaction type" }
      }
    },
    handler: async (params) => {
      try {
        console.log('Called listTransactions with params:', params);
        const budgetId = params.budget_id || defaultBudgetId;
        
        const response = await ynabAPI.transactions.getTransactions(budgetId, params.since_date);
        let transactions = response.data.transactions;
        
        // Apply filters if specified
        if (params.account_id) {
          transactions = transactions.filter(t => t.account_id === params.account_id);
        }
        
        if (params.type === 'inflow') {
          transactions = transactions.filter(t => t.amount >= 0);
        } else if (params.type === 'outflow') {
          transactions = transactions.filter(t => t.amount < 0);
        }
        
        // Format and return transactions
        return {
          success: true,
          transactions: transactions.map(t => ({
            id: t.id,
            date: t.date,
            amount: t.amount / 1000, // Convert from milliunits
            memo: t.memo,
            payee_name: t.payee_name,
            category_name: t.category_name,
            account_name: t.account_name,
            cleared: t.cleared,
            approved: t.approved
          }))
        };
      } catch (error) {
        console.error('Error in listTransactions:', error);
        return {
          success: false,
          error: error.message || 'Unknown error occurred'
        };
      }
    }
  },
  
  createTransaction: {
    description: "Create a new transaction in your YNAB budget",
    parameters: {
      type: "object",
      required: ["amount", "payee_name", "account_id"],
      properties: {
        budget_id: { type: "string", description: "The budget ID (uses default if not specified)" },
        account_id: { type: "string", description: "The account ID for the transaction" },
        date: { type: "string", description: "Transaction date (YYYY-MM-DD)" },
        amount: { type: "number", description: "Amount in dollars (positive for inflow, negative for outflow)" },
        payee_name: { type: "string", description: "Name of the payee" },
        category_id: { type: "string", description: "Category ID (optional)" },
        memo: { type: "string", description: "Optional memo text" }
      }
    },
    handler: async (params) => {
      try {
        console.log('Called createTransaction with params:', params);
        const budgetId = params.budget_id || defaultBudgetId;
        
        // Convert dollar amount to milliunits
        const amountInMilliunits = Math.round(params.amount * 1000);
        
        const response = await ynabAPI.transactions.createTransaction(budgetId, {
          transaction: {
            account_id: params.account_id,
            date: params.date || new Date().toISOString().split('T')[0],
            amount: amountInMilliunits,
            payee_name: params.payee_name,
            category_id: params.category_id,
            memo: params.memo || '',
            cleared: 'uncleared'
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
        console.error('Error in createTransaction:', error);
        return {
          success: false,
          error: error.message || 'Unknown error occurred'
        };
      }
    }
  },
  
  // Account tools
  listAccounts: {
    description: "List accounts from your YNAB budget",
    parameters: {
      type: "object",
      properties: {
        budget_id: { type: "string", description: "The budget ID (uses default if not specified)" },
        include_closed: { type: "boolean", description: "Include closed accounts" }
      }
    },
    handler: async (params) => {
      try {
        console.log('Called listAccounts with params:', params);
        const budgetId = params.budget_id || defaultBudgetId;
        
        const response = await ynabAPI.accounts.getAccounts(budgetId);
        let accounts = response.data.accounts;
        
        // Filter closed accounts if not explicitly included
        if (!params.include_closed) {
          accounts = accounts.filter(account => !account.closed);
        }
        
        return {
          success: true,
          accounts: accounts.map(account => ({
            id: account.id,
            name: account.name,
            type: account.type,
            balance: account.balance / 1000, // Convert from milliunits
            cleared_balance: account.cleared_balance / 1000,
            uncleared_balance: account.uncleared_balance / 1000,
            on_budget: account.on_budget,
            closed: account.closed
          }))
        };
      } catch (error) {
        console.error('Error in listAccounts:', error);
        return {
          success: false,
          error: error.message || 'Unknown error occurred'
        };
      }
    }
  },
  
  // Budget tools
  getBudgetSummary: {
    description: "Get a summary of your YNAB budget",
    parameters: {
      type: "object",
      properties: {
        budget_id: { type: "string", description: "The budget ID (uses default if not specified)" },
        month: { type: "string", description: "Month in YYYY-MM format (uses current month if not specified)" }
      }
    },
    handler: async (params) => {
      try {
        console.log('Called getBudgetSummary with params:', params);
        const budgetId = params.budget_id || defaultBudgetId;
        
        // Get current month if not specified
        const month = params.month 
          ? `${params.month}-01`
          : new Date().toISOString().slice(0, 7) + '-01';
        
        // Get budget details
        const budgetResponse = await ynabAPI.budgets.getBudgetById(budgetId);
        const budget = budgetResponse.data.budget;
        
        // Find the month details
        const monthDetail = budget.months.find(m => m.month === month);
        
        if (!monthDetail) {
          return {
            success: false,
            error: `No budget data available for ${month}`
          };
        }
        
        return {
          success: true,
          summary: {
            name: budget.name,
            month: monthDetail.month,
            currency_format: budget.currency_format,
            budgeted: monthDetail.budgeted / 1000,
            activity: monthDetail.activity / 1000,
            to_be_budgeted: monthDetail.to_be_budgeted / 1000,
            age_of_money: budget.age_of_money,
            category_groups: budget.category_groups
              .filter(group => !group.deleted && !group.hidden)
              .map(group => ({
                id: group.id,
                name: group.name,
                categories: group.categories
                  .filter(category => !category.deleted && !category.hidden)
                  .map(category => {
                    const monthCategory = monthDetail.categories
                      .find(c => c.id === category.id);
                    
                    return {
                      id: category.id,
                      name: category.name,
                      budgeted: monthCategory ? monthCategory.budgeted / 1000 : 0,
                      activity: monthCategory ? monthCategory.activity / 1000 : 0,
                      balance: monthCategory ? monthCategory.balance / 1000 : 0
                    };
                  })
              }))
          }
        };
      } catch (error) {
        console.error('Error in getBudgetSummary:', error);
        return {
          success: false,
          error: error.message || 'Unknown error occurred'
        };
      }
    }
  }
};

// Create the server
createMCPServer({
  name: 'ynab-budget-manager',
  version: '1.0.0',
  description: 'YNAB Budget Manager MCP server for accessing and managing YNAB budgets',
  tools
});

console.log('YNAB MCP server is running with actual API integration'); 