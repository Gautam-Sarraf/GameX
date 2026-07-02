import { Tournament, Participant, BracketMatch } from '../types';
import { TOURNAMENTS, PLAYERS } from '../mock/data';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Keep tournaments in memory for mock session state
let inMemoryTournaments = [...TOURNAMENTS];

export class TournamentService {
  static async getTournaments(): Promise<Tournament[]> {
    await delay();
    return inMemoryTournaments;
  }

  static async getTournamentById(id: string): Promise<Tournament | null> {
    await delay();
    const tournament = inMemoryTournaments.find(t => t.id === id);
    return tournament || null;
  }

  static async createTournament(data: Partial<Tournament>): Promise<Tournament> {
    await delay(800);
    const newId = `trn-${inMemoryTournaments.length + 1}`;
    
    const getGameBanner = (gameName: string) => {
      const name = gameName.toLowerCase();
      if (name.includes('counter-strike') || name.includes('cs2') || name.includes('cs:go')) {
        return '/assets/images/gallery-img-1.jpg';
      }
      if (name.includes('valorant')) {
        return '/assets/images/gallery-img-2.jpg';
      }
      if (name.includes('league of legends') || name.includes('lol')) {
        return '/assets/images/gallery-img-3.jpg';
      }
      if (name.includes('dota')) {
        return '/assets/images/gallery-img-4.jpg';
      }
      if (name.includes('fortnite')) {
        return '/assets/images/gallery-img-1.jpg';
      }
      if (name.includes('apex')) {
        return '/assets/images/gallery-img-2.jpg';
      }
      if (name.includes('rocket league')) {
        return '/assets/images/gallery-img-3.jpg';
      }
      if (name.includes('overwatch')) {
        return '/assets/images/gallery-img-4.jpg';
      }
      return '/assets/images/hero-banner.jpg';
    };

    const selectedGame = data.game || 'Counter-Strike 2';
    const bannerPath = getGameBanner(selectedGame);

    // Default mock structures
    const newTournament: Tournament = {
      id: newId,
      title: data.title || 'New Tournament',
      description: data.description || '',
      banner: bannerPath,
      game: selectedGame,
      prizePool: data.prizePool || 0,
      entryFee: data.entryFee || 0,
      maxSlots: data.maxSlots || 16,
      registeredCount: 0,
      organizerId: 'usr-current',
      organizerName: 'GamerX_Pro',
      status: 'draft', // defaults to draft
      startDate: data.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      rules: data.rules && data.rules.length > 0 ? data.rules : [
        'Be respectful to opponents.',
        'Cheating is strictly prohibited.',
        'Match check-in is required 30 minutes before starts.'
      ],
      schedule: data.schedule || [
        { stage: 'Check-in Opens', date: (data.startDate || '').split('T')[0], time: '17:30 UTC' },
        { stage: 'Round 1 Bracket', date: (data.startDate || '').split('T')[0], time: '18:00 UTC' }
      ],
      prizes: data.prizes || [
        { rank: '1st Place', reward: `60% of Prize Pool` },
        { rank: '2nd Place', reward: `30% of Prize Pool` },
        { rank: '3rd Place', reward: `10% of Prize Pool` }
      ],
      participants: []
    };

    inMemoryTournaments.unshift(newTournament);
    return newTournament;
  }

  static async registerForTournament(tournamentId: string, user: { id: string; username: string; avatar: string; rank?: string }): Promise<Tournament> {
    await delay(600);
    inMemoryTournaments = inMemoryTournaments.map(t => {
      if (t.id === tournamentId) {
        if (t.participants.some(p => p.id === user.id)) return t;
        const newParticipant: Participant = {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          status: 'pending', // registers as pending first
          joinedAt: new Date().toISOString(),
          rank: user.rank
        };
        return {
          ...t,
          registeredCount: t.registeredCount + 1,
          participants: [...t.participants, newParticipant]
        };
      }
      return t;
    });

    return inMemoryTournaments.find(t => t.id === tournamentId)!;
  }

  static async toggleBookmark(tournamentId: string): Promise<Tournament> {
    await delay(200);
    inMemoryTournaments = inMemoryTournaments.map(t => {
      if (t.id === tournamentId) {
        return { ...t, bookmarked: !t.bookmarked };
      }
      return t;
    });
    return inMemoryTournaments.find(t => t.id === tournamentId)!;
  }

  // Dashboard Operations for Organizers
  static async approveParticipant(tournamentId: string, participantId: string): Promise<Tournament> {
    await delay(300);
    inMemoryTournaments = inMemoryTournaments.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          participants: t.participants.map(p => p.id === participantId ? { ...p, status: 'approved' } : p)
        };
      }
      return t;
    });
    return inMemoryTournaments.find(t => t.id === tournamentId)!;
  }

  static async rejectParticipant(tournamentId: string, participantId: string): Promise<Tournament> {
    await delay(300);
    inMemoryTournaments = inMemoryTournaments.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          registeredCount: Math.max(0, t.registeredCount - 1),
          participants: t.participants.filter(p => p.id !== participantId)
        };
      }
      return t;
    });
    return inMemoryTournaments.find(t => t.id === tournamentId)!;
  }

  static async removeParticipant(tournamentId: string, participantId: string): Promise<Tournament> {
    return this.rejectParticipant(tournamentId, participantId);
  }

  static async publishTournament(tournamentId: string): Promise<Tournament> {
    await delay(500);
    inMemoryTournaments = inMemoryTournaments.map(t => {
      if (t.id === tournamentId) {
        return { ...t, status: 'upcoming' };
      }
      return t;
    });
    return inMemoryTournaments.find(t => t.id === tournamentId)!;
  }
  
  static async startTournament(tournamentId: string): Promise<Tournament> {
    await delay(500);
    inMemoryTournaments = inMemoryTournaments.map(t => {
      if (t.id === tournamentId) {
        // Generate a basic 4-player or 8-player mock bracket based on approved participants
        const approved = t.participants.filter(p => p.status === 'approved');
        const count = approved.length >= 8 ? 8 : approved.length >= 4 ? 4 : 2;
        const matches: BracketMatch[] = [];
        let matchId = 1;

        if (count >= 4) {
          // Semi finals (Round 1)
          matches.push({
            id: `bm-${t.id}-1`,
            round: 1,
            nextMatchId: `bm-${t.id}-3`,
            p1: { username: approved[0]?.username || 'TBD', score: null, avatar: approved[0]?.avatar || '' },
            p2: { username: approved[1]?.username || 'TBD', score: null, avatar: approved[1]?.avatar || '' },
            winner: null,
            status: 'live'
          });
          matches.push({
            id: `bm-${t.id}-2`,
            round: 1,
            nextMatchId: `bm-${t.id}-3`,
            p1: { username: approved[2]?.username || 'TBD', score: null, avatar: approved[2]?.avatar || '' },
            p2: { username: approved[3]?.username || 'TBD', score: null, avatar: approved[3]?.avatar || '' },
            winner: null,
            status: 'live'
          });
          // Finals (Round 2)
          matches.push({
            id: `bm-${t.id}-3`,
            round: 2,
            nextMatchId: null,
            p1: null,
            p2: null,
            winner: null,
            status: 'scheduled'
          });
        } else {
          // Direct Finals
          matches.push({
            id: `bm-${t.id}-1`,
            round: 1,
            nextMatchId: null,
            p1: { username: approved[0]?.username || 'TBD', score: null, avatar: approved[0]?.avatar || '' },
            p2: { username: approved[1]?.username || 'TBD', score: null, avatar: approved[1]?.avatar || '' },
            winner: null,
            status: 'live'
          });
        }

        return { ...t, status: 'live', bracket: matches };
      }
      return t;
    });
    return inMemoryTournaments.find(t => t.id === tournamentId)!;
  }
}
