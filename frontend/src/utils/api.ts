/**
 * API Utility Functions
 * Handles HTTP requests using XMLHttpRequest (as per assignment requirements)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Make HTTP request using XMLHttpRequest
 * Required by assignment for form validation
 */
export function makeRequest<T>(
  method: string,
  endpoint: string,
  data?: any,
  token?: string
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_URL}${endpoint}`;

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({ data: response });
        } catch (e) {
          resolve({ error: 'Invalid response format' });
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          resolve({ error: error.detail || 'Request failed' });
        } catch (e) {
          resolve({ error: `Request failed with status ${xhr.status}` });
        }
      }
    };

    xhr.onerror = function () {
      resolve({ error: 'Network error occurred' });
    };

    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}

/**
 * Validate form input using AJAX XMLHttpRequest
 * Returns true if valid, error message if invalid
 */
export async function validateQuestionInput(message: string): Promise<{ valid: boolean; error?: string }> {
  // Client-side validation
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Question cannot be blank' };
  }

  if (message.length > 1000) {
    return { valid: false, error: 'Question is too long (max 1000 characters)' };
  }

  return { valid: true };
}

// Auth functions
export const authApi = {
  register: (username: string, email: string, password: string) =>
    makeRequest('POST', '/auth/register', { username, email, password }),

  login: (username: string, password: string) =>
    makeRequest<{ access_token: string; token_type: string }>('POST', '/auth/login', { username, password }),

  me: (token: string) =>
    makeRequest('GET', '/auth/me', null, token),
};

// Question functions
export const questionApi = {
  getAll: () =>
    makeRequest('GET', '/questions'),

  create: (message: string, username: string = 'Guest', token?: string) =>
    makeRequest('POST', '/questions', { message, username }, token),

  updateStatus: (questionId: number, status: string, token: string) =>
    makeRequest('PATCH', `/questions/${questionId}/status`, { status }, token),

  addAnswer: (questionId: number, message: string, username: string = 'Guest', token?: string) =>
    makeRequest('POST', `/questions/${questionId}/answers`, { message, username }, token),
};
