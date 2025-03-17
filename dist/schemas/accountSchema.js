"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAccountsSchema = exports.AccountSchema = void 0;
// src/schemas/accountSchema.ts
const zod_1 = require("zod");
// Account schema for MCP tools
exports.AccountSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.enum(['checking', 'savings', 'cash', 'creditCard', 'lineOfCredit', 'otherAsset', 'otherLiability', 'mortgage', 'autoLoan', 'studentLoan', 'personalLoan', 'medicalDebt', 'otherDebt']),
    on_budget: zod_1.z.boolean(),
    closed: zod_1.z.boolean(),
    balance: zod_1.z.number(),
    cleared_balance: zod_1.z.number(),
    uncleared_balance: zod_1.z.number(),
    transfer_payee_id: zod_1.z.string().optional(),
    direct_import_linked: zod_1.z.boolean().optional(),
    direct_import_in_error: zod_1.z.boolean().optional(),
    deleted: zod_1.z.boolean().optional()
});
// Schema for list accounts parameters
exports.ListAccountsSchema = zod_1.z.object({
    budget_id: zod_1.z.string().optional(),
    include_closed: zod_1.z.boolean().optional()
});
