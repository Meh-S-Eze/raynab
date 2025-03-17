"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
require("dotenv/config"); // Load environment variables from .env file
const sdk_1 = require("@modelcontextprotocol/sdk");
const transactionTools = __importStar(require("./tools/transactionTools"));
const accountTools = __importStar(require("./tools/accountTools"));
const budgetTools = __importStar(require("./tools/budgetTools"));
async function main() {
    // Log environment variables (redacted for security)
    console.log(`YNAB API Token: ${process.env.YNAB_TOKEN ? '****' : 'Not found'}`);
    console.log(`YNAB Budget ID: ${process.env.YNAB_BUDGET_ID ? '****' : 'Not found'}`);
    // Create MCP server instance
    const server = (0, sdk_1.createServer)({
        name: 'raynab',
        version: '1.0.0',
        description: 'MCP server for YNAB budget management'
    });
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
}
main().catch(error => {
    console.error('Server error:', error);
    process.exit(1);
});
