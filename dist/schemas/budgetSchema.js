"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetDetailsSchema = exports.BudgetSummarySchema = exports.BudgetSchema = void 0;
// src/schemas/budgetSchema.ts
const zod_1 = require("zod");
// Budget schema for MCP tools
exports.BudgetSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    last_modified_on: zod_1.z.string().optional(),
    first_month: zod_1.z.string().optional(),
    last_month: zod_1.z.string().optional(),
    date_format: zod_1.z.object({
        format: zod_1.z.string()
    }).optional(),
    currency_format: zod_1.z.object({
        iso_code: zod_1.z.string(),
        example_format: zod_1.z.string(),
        decimal_digits: zod_1.z.number(),
        decimal_separator: zod_1.z.string(),
        symbol_first: zod_1.z.boolean(),
        group_separator: zod_1.z.string(),
        currency_symbol: zod_1.z.string(),
        display_symbol: zod_1.z.boolean()
    }).optional()
});
// Schema for budget summary parameters
exports.BudgetSummarySchema = zod_1.z.object({
    include_accounts: zod_1.z.boolean().optional()
});
// Schema for budget details parameters
exports.BudgetDetailsSchema = zod_1.z.object({
    budget_id: zod_1.z.string().optional(),
    month: zod_1.z.string().optional()
});
