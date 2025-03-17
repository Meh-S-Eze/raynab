"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
// src/schemas/transactionSchema.ts
const zod_1 = require("zod");
exports.TransactionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    date: zod_1.z.string(),
    amount: zod_1.z.number(),
    memo: zod_1.z.string().optional(),
    cleared: zod_1.z.enum(['cleared', 'uncleared', 'reconciled']),
    approved: zod_1.z.boolean(),
    // Other fields from YNAB API
});
