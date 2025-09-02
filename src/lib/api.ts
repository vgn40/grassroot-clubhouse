// Simple API client for authentication
export const apiClient = {
  async post(path: string, data?: Record<string, any>) {
    const response = await fetch(`/api${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secureStorage.getToken() && {
          Authorization: `Bearer ${secureStorage.getToken()}`
        }),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
};

// Simple secure storage for tokens
export const secureStorage = {
  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
  
  removeToken() {
    localStorage.removeItem('auth_token');
  }
};