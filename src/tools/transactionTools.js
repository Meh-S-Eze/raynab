"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactions = listTransactions;
const ynabClient_1 = require("../lib/ynabClient");
/**
 * Lists transactions based on specified filters
 */
async function listTransactions(options) {
    const ynab = await (0, ynabClient_1.getYnabAPI)();
    // Get transactions using the existing code from listTransactions.tsx
    // but adapted for MCP response format
    // ...
    return {
        transactions: [
        // Format transactions for Claude to understand
        ]
    };
}
// Implement other transaction functions based on existing command files
