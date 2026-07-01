import { User } from '../types';
import { CURRENT_USER } from '../mock/data';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  private static userSession: User | null = CURRENT_USER;

  static async getCurrentUser(): Promise<User | null> {
    await delay();
    return this.userSession;
  }

  static async login(email: string): Promise<User> {
    await delay(600);
    this.userSession = {
      ...CURRENT_USER,
      email,
      username: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(email)}`
    };
    return this.userSession;
  }

  static async logout(): Promise<void> {
    await delay(300);
    this.userSession = null;
  }

  static async updateSession(updatedUser: User): Promise<User> {
    await delay();
    this.userSession = updatedUser;
    return this.userSession;
  }
}
