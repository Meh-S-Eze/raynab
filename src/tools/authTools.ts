// src/tools/authTools.ts
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.env.HOME || '', '.config', 'raynab');
const TOKEN_PATH = path.join(CONFIG_PATH, 'token.json');

// Schema for authenticate parameters
export const AuthenticateSchema = z.object({
  token: z.string()
});

export type AuthenticateParams = z.infer<typeof AuthenticateSchema>;

/**
 * Authenticates with YNAB using a personal access token
 */
export const authenticate = {
  description: "Authenticate with YNAB using a personal access token",
  parameters: AuthenticateSchema,
  handler: async (params: AuthenticateParams) => {
    try {
      // Ensure config directory exists
      if (!fs.existsSync(CONFIG_PATH)) {
        fs.mkdirSync(CONFIG_PATH, { recursive: true });
      }

      // Store token securely (in production, use a more secure method)
      fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token: params.token }), {
        mode: 0o600 // Read/write for owner only
      });

      return {
        success: true,
        message: 'Authentication successful'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
};
