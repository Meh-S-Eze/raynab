// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import * as transactionTools from './tools/transactionTools';
import * as accountTools from './tools/accountTools';
import * as budgetTools from './tools/budgetTools';
import * as authTools from './tools/authTools';

async function main() {
  // Create MCP server instance
  const server = new Server({
    name: 'raynab',
    version: '1.0.0',
    description: 'MCP server for YNAB budget management'
  });

  // Register transaction tools
  server.registerTool('listTransactions', transactionTools.listTransactions);
  server.registerTool('createTransaction', transactionTools.createTransaction);
  // Register other tools...

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.listen(transport);
  console.log('Raynab MCP server started');
}

main().catch(console.error);
