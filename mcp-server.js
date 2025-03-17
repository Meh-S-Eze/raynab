// mcp-server.js - Simple MCP server using existing JS files
require('dotenv').config();

// Import MCP SDK directly from server module
const { Server } = require('@modelcontextprotocol/sdk/lib/server');

// Log environment variables (redacted for security)
console.log(`YNAB API Token: ${process.env.YNAB_TOKEN ? '****' : 'Not found'}`);
console.log(`YNAB Budget ID: ${process.env.YNAB_BUDGET_ID ? '****' : 'Not found'}`);

// Attempt to load tools
let transactionTools, accountTools, budgetTools, authTools;

try {
  transactionTools = require('./src/tools/transactionTools.js');
  accountTools = require('./src/tools/accountTools.js');
  budgetTools = require('./src/tools/budgetTools.js');
  authTools = require('./src/tools/authTools.js');
  
  console.log('Successfully loaded tool modules');
} catch (error) {
  console.error('Error loading tool modules:', error);
  process.exit(1);
}

// Create MCP server instance
console.log('Creating MCP server...');
const server = new Server({
  name: 'raynab',
  version: '1.0.0',
  description: 'MCP server for YNAB budget management'
});

try {
  // Register transaction tools  
  if (transactionTools && transactionTools.listTransactions) {
    console.log('Registering listTransactions tool');
    server.registerTool('listTransactions', transactionTools.listTransactions);
  }
  
  if (transactionTools && transactionTools.createTransaction) {
    console.log('Registering createTransaction tool');
    server.registerTool('createTransaction', transactionTools.createTransaction);
  }
  
  // Register account tools
  if (accountTools && accountTools.listAccounts) {
    console.log('Registering listAccounts tool');
    server.registerTool('listAccounts', accountTools.listAccounts);
  }
  
  // Register budget tools
  if (budgetTools && budgetTools.listBudgets) {
    console.log('Registering listBudgets tool');
    server.registerTool('listBudgets', budgetTools.listBudgets);
  }
  
  if (budgetTools && budgetTools.getBudgetDetails) {
    console.log('Registering getBudgetDetails tool');
    server.registerTool('getBudgetDetails', budgetTools.getBudgetDetails);
  }
  
  // Register auth tools
  if (authTools && authTools.authenticate) {
    console.log('Registering authenticate tool');
    server.registerTool('authenticate', authTools.authenticate);
  }
  
  // Start the server
  console.log('Starting Raynab MCP server...');
  
  // Use stdio transport
  const { StdioServerTransport } = require('@modelcontextprotocol/sdk/lib/server/stdio');
  const transport = new StdioServerTransport();
  
  // Listen with the transport
  server.listen(transport);
  console.log('Raynab MCP server started and listening');
} catch (error) {
  console.error('Error setting up MCP server:', error);
  process.exit(1);
} 