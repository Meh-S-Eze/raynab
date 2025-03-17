"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetSchema = void 0;
// src/schemas/budgetSchema.ts
const zod_1 = require("zod");
exports.BudgetSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    // Other fields from YNAB API
});
