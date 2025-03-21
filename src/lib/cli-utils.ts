// CLI-specific utilities to replace Raycast dependencies
import type { Toast as RaycastToast } from '@raycast/api';

type ToastStyle = RaycastToast.Style;

export function getPreferenceValues<T extends { apiToken: string }>(): T {
  return {
    apiToken: process.env.YNAB_TOKEN || ''
  } as T;
}

export function showToast(params: { title: string; message?: string; style?: ToastStyle }) {
  const { title, message, style = 'animated' } = params;
  console.log(`[${style}] ${title}${message ? `: ${message}` : ''}`);
}

export function captureException(error: unknown) {
  console.error('Error:', error);
}

export const Toast = {
  Style: {
    Failure: 'failure' as ToastStyle,
    Success: 'success' as ToastStyle,
    Animated: 'animated' as ToastStyle
  }
}; 