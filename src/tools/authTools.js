"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_PATH = path_1.default.join(process.env.HOME || '', '.config', 'raynab');
const TOKEN_PATH = path_1.default.join(CONFIG_PATH, 'token.json');
/**
 * Authenticates with YNAB using a personal access token
 */
async function authenticate(params) {
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
        return {
            success: false,
            message: 'Authentication failed: ' + error.message
        };
    }
}
