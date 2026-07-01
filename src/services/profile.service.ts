import { User, Achievement } from '../types';
import { PLAYERS } from '../mock/data';
import { AuthService } from './auth.service';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

let inMemoryPlayers = [...PLAYERS];

export class ProfileService {
  static async getProfileByUsername(username: string): Promise<User | null> {
    await delay();
    
    // Check if it matches the current logged-in user
    const sessionUser = await AuthService.getCurrentUser();
    if (sessionUser && sessionUser.username.toLowerCase() === username.toLowerCase()) {
      return sessionUser;
    }
    
    const player = inMemoryPlayers.find(p => p.username.toLowerCase() === username.toLowerCase());
    return player || null;
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    await delay(700);
    const sessionUser = await AuthService.getCurrentUser();
    if (!sessionUser) {
      throw new Error('User session not active');
    }

    const updatedUser: User = {
      ...sessionUser,
      ...data,
      bio: data.bio !== undefined ? data.bio : sessionUser.bio,
      country: data.country !== undefined ? data.country : sessionUser.country,
      tags: data.tags !== undefined ? data.tags : sessionUser.tags,
      avatar: data.avatar !== undefined ? data.avatar : sessionUser.avatar,
      banner: data.banner !== undefined ? data.banner : sessionUser.banner
    };
    
    // Sync active session
    await AuthService.updateSession(updatedUser);
    
    // Sync in-memory list
    inMemoryPlayers = inMemoryPlayers.map(p => p.id === updatedUser.id ? updatedUser : p);
    
    return updatedUser;
  }

  static async getAchievements(userId: string): Promise<Achievement[]> {
    await delay();
    const sessionUser = await AuthService.getCurrentUser();
    if (sessionUser && (userId === sessionUser.id || userId === 'usr-current')) {
      return sessionUser.achievements;
    }
    const player = inMemoryPlayers.find(p => p.id === userId);
    return player ? player.achievements : [];
  }
}
