// src/tools/authTools.ts
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.env.HOME || '', '.config', 'raynab');
const TOKEN_PATH = path.join(CONFIG_PATH, 'token.json');

/**
 * Authenticates with YNAB using a personal access token
 */
export async function authenticate(params: { token: string }) {
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
    return {
      success: false,
      message: 'Authentication failed: ' + error.message
    };
  }
}
