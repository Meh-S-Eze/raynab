"use strict";
// src/tools/accountTools.ts
// Implement account tools
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccounts = void 0;
const ynabClient_1 = require("../lib/ynabClient");
const accountSchema_1 = require("../schemas/accountSchema");
/**
 * Lists accounts from the budget
 */
exports.listAccounts = {
    description: "List accounts from your YNAB budget",
    parameters: accountSchema_1.ListAccountsSchema,
    handler: async (params) => {
        try {
            const ynab = await (0, ynabClient_1.getYnabAPI)();
            const budgetId = params.budget_id || (0, ynabClient_1.getDefaultBudgetId)();
            console.log(`Fetching accounts for budget ${budgetId}`);
            const response = await ynab.accounts.getAccounts(budgetId);
            let accounts = response.data.accounts;
            // Filter out closed accounts if not explicitly included
            if (!params.include_closed) {
                accounts = accounts.filter(account => !account.closed);
            }
            // Format accounts for response
            return {
                success: true,
                accounts: accounts.map(account => ({
                    id: account.id,
                    name: account.name,
                    type: account.type,
                    on_budget: account.on_budget,
                    closed: account.closed,
                    balance: account.balance / 1000, // Convert from milliunits
                    cleared_balance: account.cleared_balance / 1000,
                    uncleared_balance: account.uncleared_balance / 1000,
                    transfer_payee_id: account.transfer_payee_id,
                    direct_import_linked: account.direct_import_linked,
                    direct_import_in_error: account.direct_import_in_error
                }))
            };
        }
        catch (error) {
            console.error('Error fetching accounts:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
};
