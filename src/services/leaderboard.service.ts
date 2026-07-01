import { User, Organizer } from '../types';
import { PLAYERS, ORGANIZERS } from '../mock/data';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export class LeaderboardService {
  static async getTopPlayers(limit = 10, criteria: 'xp' | 'wins' | 'winRate' = 'xp'): Promise<User[]> {
    await delay();
    const sorted = [...PLAYERS].sort((a, b) => {
      if (criteria === 'wins') {
        return b.tournamentWins - a.tournamentWins;
      }
      if (criteria === 'winRate') {
        return b.winRate - a.winRate;
      }
      return b.xp - a.xp;
    });
    return sorted.slice(0, limit);
  }

  static async getTopOrganizers(limit = 10): Promise<Organizer[]> {
    await delay();
    const sorted = [...ORGANIZERS].sort((a, b) => b.followers - a.followers);
    return sorted.slice(0, limit);
  }
}
