// mcp-server.mjs - Simple MCP server using ES modules
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log environment variables (redacted for security)
console.log(`YNAB API Token: ${process.env.YNAB_TOKEN ? '****' : 'Not found'}`);
console.log(`YNAB Budget ID: ${process.env.YNAB_BUDGET_ID ? '****' : 'Not found'}`);

// Define mock tools for initial testing
const mockTools = {
  listTransactions: {
    description: "List transactions from your YNAB budget",
    parameters: {
      type: "object",
      properties: {
        budget_id: { type: "string" },
        account_id: { type: "string" },
        since_date: { type: "string" }
      }
    },
    handler: async (params) => {
      console.log('Called listTransactions with params:', params);
      return {
        success: true,
        transactions: [
          {
            id: 'mock-transaction-1',
            date: '2025-03-10',
            amount: 42.50,
            memo: 'Test transaction',
            payee_name: 'Test Payee',
            category_name: 'Food'
          }
        ]
      };
    }
  },
  
  listAccounts: {
    description: "List accounts from your YNAB budget",
    parameters: {
      type: "object",
      properties: {
        budget_id: { type: "string" },
        include_closed: { type: "boolean" }
      }
    },
    handler: async (params) => {
      console.log('Called listAccounts with params:', params);
      return {
        success: true,
        accounts: [
          {
            id: 'mock-account-1',
            name: 'Checking',
            type: 'checking',
            balance: 1000.00
          }
        ]
      };
    }
  },
  
  listBudgets: {
    description: "List all available YNAB budgets",
    parameters: {
      type: "object",
      properties: {
        include_accounts: { type: "boolean" }
      }
    },
    handler: async (params) => {
      console.log('Called listBudgets with params:', params);
      return {
        success: true,
        budgets: [
          {
            id: process.env.YNAB_BUDGET_ID || 'mock-budget-1',
            name: 'My Budget'
          }
        ]
      };
    }
  }
};

// Create MCP server instance
console.log('Creating MCP server...');
const server = new Server({
  name: 'raynab',
  version: '1.0.0',
  description: 'MCP server for YNAB budget management'
});

try {
  // Register tools
  for (const [name, tool] of Object.entries(mockTools)) {
    console.log(`Registering ${name} tool`);
    server.registerTool(name, tool);
  }
  
  // Start the server
  console.log('Starting Raynab MCP server...');
  const transport = new StdioServerTransport();
  server.listen(transport);
  console.log('Raynab MCP server started and listening');
} catch (error) {
  console.error('Error setting up MCP server:', error);
  process.exit(1);
} 