import { dataService, type User } from './data';

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
      const result = await dataService.login(username, password);
      
      if (result) {
        this.state = {
          token: result.token,
          user: result.user,
        };

        localStorage.setItem('finova_token', result.token);
        localStorage.setItem('finova_user', JSON.stringify(result.user));
        
        return true;
      }
      
      return false;
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
