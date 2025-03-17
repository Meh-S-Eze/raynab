// src/lib/ynabClient.ts
import { API } from 'ynab';

let ynabAPI: API | null = null;
let token: string | null = null;

// Need to replace Raycast's preference storage with MCP-compatible storage
export async function getYnabAPI(): Promise<API> {
  if (!ynabAPI) {
    // Replace with MCP storage mechanism
    // const preferences = getPreferenceValues<Preferences>();
    // token = preferences.personalAccessToken;

    if (!token) {
      throw new Error('No authentication token available');
    }
    ynabAPI = new API(token);
  }
  return ynabAPI;
}
