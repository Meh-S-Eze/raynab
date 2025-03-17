"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.AuthenticateSchema = void 0;
// src/tools/authTools.ts
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_PATH = path_1.default.join(process.env.HOME || '', '.config', 'raynab');
const TOKEN_PATH = path_1.default.join(CONFIG_PATH, 'token.json');
// Schema for authenticate parameters
exports.AuthenticateSchema = zod_1.z.object({
    token: zod_1.z.string()
});
/**
 * Authenticates with YNAB using a personal access token
 */
exports.authenticate = {
    description: "Authenticate with YNAB using a personal access token",
    parameters: exports.AuthenticateSchema,
    handler: async (params) => {
        try {
            // Ensure config directory exists
            if (!fs_1.default.existsSync(CONFIG_PATH)) {
                fs_1.default.mkdirSync(CONFIG_PATH, { recursive: true });
            }
            // Store token securely (in production, use a more secure method)
            fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify({ token: params.token }), {
                mode: 0o600 // Read/write for owner only
            });
            return {
                success: true,
                message: 'Authentication successful'
            };
        }
        catch (error) {
            console.error('Authentication error:', error);
            return {
                success: false,
                message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
};
