"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSchema = void 0;
// src/schemas/accountSchema.ts
const zod_1 = require("zod");
exports.AccountSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    // Other fields from YNAB API
});
