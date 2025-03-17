#!/usr/bin/env node

// Simple MCP server for YNAB
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

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

// Create npx process that runs the built-in MCP server with YNAB tools
const mcpServer = spawn('npx', [
  '-y',
  '@modelcontextprotocol/create-server', 
  'run', 
  '--name', 'ynab-budget-manager',
  '--description', 'YNAB Budget Manager MCP server for accessing and managing YNAB budgets'
], {
  env: {
    ...process.env,
    YNAB_TOKEN: process.env.YNAB_TOKEN,
    YNAB_BUDGET_ID: process.env.YNAB_BUDGET_ID
  }
});

// Forward stdout and stderr
mcpServer.stdout.on('data', (data) => {
  console.log(`${data}`);
});

mcpServer.stderr.on('data', (data) => {
  console.error(`${data}`);
});

mcpServer.on('close', (code) => {
  console.log(`MCP server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down MCP server...');
  mcpServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down MCP server...');
  mcpServer.kill();
  process.exit(0);
}); 