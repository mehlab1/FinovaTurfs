interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
  loyaltyPoints: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export class AuthManager {
  private static instance: AuthManager;
  private state: AuthState = {
    user: null,
    token: null,
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private loadFromStorage() {
    const token = localStorage.getItem('finova_token');
    const userData = localStorage.getItem('finova_user');
    
    if (token && userData) {
      try {
        this.state = {
          token,
          user: JSON.parse(userData),
        };
      } catch {
        this.clearAuth();
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      this.state = {
        token: data.token,
        user: data.user,
      };

      localStorage.setItem('finova_token', data.token);
      localStorage.setItem('finova_user', JSON.stringify(data.user));
      
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    this.clearAuth();
  }

  private clearAuth() {
    this.state = { user: null, token: null };
    localStorage.removeItem('finova_token');
    localStorage.removeItem('finova_user');
  }

  isAuthenticated(): boolean {
    return !!this.state.token && !!this.state.user;
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && !!this.state.user?.isAdmin;
  }

  getUser(): User | null {
    return this.state.user;
  }

  getToken(): string | null {
    return this.state.token;
  }
}

export const auth = AuthManager.getInstance();
