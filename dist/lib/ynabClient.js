"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYnabAPI = getYnabAPI;
exports.getDefaultBudgetId = getDefaultBudgetId;
// src/lib/ynabClient.ts
const ynab_1 = require("ynab");
let ynabAPI = null;
// Get YNAB API instance using token from environment variables
async function getYnabAPI() {
    if (!ynabAPI) {
        // Get token from environment variable
        const token = process.env.YNAB_TOKEN;
        if (!token) {
            throw new Error('YNAB_TOKEN environment variable is not set');
        }
        console.log('Initializing YNAB API client');
        ynabAPI = new ynab_1.API(token);
    }
    return ynabAPI;
}
// Get default budget ID from environment variables
function getDefaultBudgetId() {
    const budgetId = process.env.YNAB_BUDGET_ID;
    if (!budgetId) {
        throw new Error('YNAB_BUDGET_ID environment variable is not set');
    }
    return budgetId;
}
