"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionSchema = exports.ListTransactionsSchema = exports.TransactionSchema = void 0;
// src/schemas/transactionSchema.ts
const zod_1 = require("zod");
// Transaction schema for MCP tools
exports.TransactionSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    date: zod_1.z.string(),
    amount: zod_1.z.number(),
    memo: zod_1.z.string().optional(),
    cleared: zod_1.z.enum(['cleared', 'uncleared', 'reconciled']).optional(),
    approved: zod_1.z.boolean().optional(),
    flag_color: zod_1.z.enum(['red', 'orange', 'yellow', 'green', 'blue', 'purple']).optional(),
    account_id: zod_1.z.string(),
    payee_id: zod_1.z.string().optional(),
    category_id: zod_1.z.string().optional(),
    transfer_account_id: zod_1.z.string().optional(),
    import_id: zod_1.z.string().optional()
});
// Schema for list transactions parameters
exports.ListTransactionsSchema = zod_1.z.object({
    budget_id: zod_1.z.string().optional(),
    account_id: zod_1.z.string().optional(),
    since_date: zod_1.z.string().optional(),
    type: zod_1.z.enum(['inflow', 'outflow']).optional(),
    category_id: zod_1.z.string().optional(),
    unreviewed_only: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().optional()
});
// Schema for create transaction parameters
exports.CreateTransactionSchema = zod_1.z.object({
    budget_id: zod_1.z.string().optional(),
    account_id: zod_1.z.string(),
    date: zod_1.z.string(),
    amount: zod_1.z.number(),
    payee_name: zod_1.z.string(),
    category_id: zod_1.z.string().optional(),
    memo: zod_1.z.string().optional(),
    cleared: zod_1.z.boolean().optional()
});
