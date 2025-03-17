// src/index.ts
import 'dotenv/config'; // Load environment variables from .env file
import * as MCP from '@modelcontextprotocol/sdk';
import * as transactionTools from './tools/transactionTools';
import * as accountTools from './tools/accountTools';
import * as budgetTools from './tools/budgetTools';
import * as authTools from './tools/authTools';

async function main() {
  // Log environment variables (redacted for security)
  console.log(`YNAB API Token: ${process.env.YNAB_TOKEN ? '****' : 'Not found'}`);
  console.log(`YNAB Budget ID: ${process.env.YNAB_BUDGET_ID ? '****' : 'Not found'}`);

  // Create MCP server instance
  const server = new MCP.Server({
    name: 'raynab',
    version: '1.0.0',
    description: 'MCP server for YNAB budget management'
  });

  try {
    // Register transaction tools
    server.registerTool('listTransactions', transactionTools.listTransactions);
    server.registerTool('createTransaction', transactionTools.createTransaction);
    
    // Register account tools
    server.registerTool('listAccounts', accountTools.listAccounts);
    
    // Register budget tools
    server.registerTool('listBudgets', budgetTools.listBudgets);
    server.registerTool('getBudgetDetails', budgetTools.getBudgetDetails);
    
    // Start the server
    console.log('Starting Raynab MCP server...');
    server.listen();
    console.log('Raynab MCP server started');
  } catch (error) {
    console.error('Error setting up MCP server:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Server error:', error);
  process.exit(1);
});
