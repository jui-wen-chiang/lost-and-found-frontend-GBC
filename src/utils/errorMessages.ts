import axios from 'axios';

/**
 * Extract a user-friendly error message from an API error.
 * Detects 403 (auth required) specifically.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again later.'): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      return 'You need to sign in to access this content.';
    }
    if (error.response?.status === 401) {
      return 'Your session has expired. Please sign in again.';
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response?.status && error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
  }
  return fallback;
}

export function isAuthError(error: unknown): boolean {
  return axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401);
}
