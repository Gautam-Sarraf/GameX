export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  banner: string;
  walletAddress?: string;
  country: string;
  bio: string;
  tags: string[];
  badges: Badge[];
  achievements: Achievement[];
  xp: number;
  level: number;
  rank: string;
  winRate: number;
  matchesPlayed: number;
  matchesWon: number;
  tournamentWins: number;
  followers: number;
  following: number;
  friendsCount: number;
  recentActivity: Activity[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO string if unlocked
  progress: number; // current progress
  maxProgress: number; // target progress
}

export interface Activity {
  id: string;
  type: 'tournament_win' | 'match_played' | 'level_up' | 'badge_earned' | 'tournament_registered';
  title: string;
  description: string;
  timestamp: string;
}

export interface Organizer {
  id: string;
  name: string;
  logo: string;
  bio: string;
  verified: boolean;
  followers: number;
  tournamentsCount: number;
}

export interface Participant {
  id: string;
  username: string;
  avatar: string;
  status: 'pending' | 'approved';
  joinedAt: string;
  rank?: string;
}

export interface BracketMatch {
  id: string;
  round: number;
  nextMatchId: string | null;
  p1: { username: string; score: number | null; avatar: string } | null;
  p2: { username: string; score: number | null; avatar: string } | null;
  winner: string | null;
  status: 'scheduled' | 'live' | 'completed';
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  banner: string;
  game: string;
  prizePool: number;
  entryFee: number;
  maxSlots: number;
  registeredCount: number;
  organizerId: string;
  organizerName: string;
  organizerLogo?: string;
  status: 'upcoming' | 'live' | 'completed' | 'draft';
  startDate: string;
  rules: string[];
  schedule: { stage: string; date: string; time: string }[];
  prizes: { rank: string; reward: string }[];
  participants: Participant[];
  bracket?: BracketMatch[];
  bookmarked?: boolean;
}

export interface Notification {
  id: string;
  type: 'registration_approved' | 'tournament_started' | 'achievement_unlocked' | 'organizer_announcement' | 'match_ready';
  title: string;
  message: string;
  status: 'unread' | 'read';
  timestamp: string;
  tournamentId?: string;
}

export interface ForumComment {
  id: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  authorUsername: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: 'Trending' | 'Latest' | 'Tournament Posts' | 'Announcements';
  tags: string[];
  likes: number;
  comments: ForumComment[];
  timestamp: string;
}
