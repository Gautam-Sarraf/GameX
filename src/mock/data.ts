import { User, Tournament, Organizer, Notification, ForumPost, Achievement, Badge, Activity, Participant, BracketMatch } from '../types';

// Games supported
export const GAMES = [
  'Counter-Strike 2',
  'Valorant',
  'League of Legends',
  'Dota 2',
  'Fortnite',
  'Apex Legends',
  'Rocket League',
  'Overwatch 2'
];

export const COUNTRIES = ['US', 'DE', 'KR', 'SE', 'UA', 'FR', 'PL', 'BR', 'CA', 'JP', 'KR', 'CN'];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Alpha Tester', icon: 'zap', description: 'Joined during the Alpha phase', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800' },
  { id: 'b2', name: 'Tournament Champion', icon: 'trophy', description: 'Won at least one tournament', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800' },
  { id: 'b3', name: 'High Roller', icon: 'dollar-sign', description: 'Participated in $10k+ prize pool events', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
  { id: 'b4', name: 'Verified Pro', icon: 'check-circle', description: 'Officially verified esports athlete', color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
  { id: 'b5', name: 'Community Pillar', icon: 'users', description: 'Highly active in forums and discussions', color: 'text-purple-400 bg-purple-950/40 border-purple-800' }
];

export const ACHIEVEMENTS: Achievement[] = Array.from({ length: 30 }).map((_, i) => {
  const titles = [
    'First Blood', 'First Victory', 'Scrim Master', 'Tournament Champion', 'Glory Hunter',
    'Streak Builder', 'Unstoppable', 'Veteran Racer', 'Sharp Shooter', 'Tactician',
    'Immortal', 'Wealthy Challenger', 'Loyal Competitor', 'Socializer', 'Leaderboard Star',
    'Organizer Friend', 'Decisive Win', 'Clutch King', 'XP Grinder', 'Badges Collector',
    'Community Voice', 'Feedback Provider', 'No Entry Fee', 'Team Captain', 'Strategist',
    'Flawless Runner', 'Comeback King', 'Apex Predator', 'Global Elite', 'Dota Legend'
  ];
  
  const descriptions = [
    'Register for your first tournament on GameX.',
    'Win your first competitive match.',
    'Play 10 custom games or community matches.',
    'Win a featured tournament championship.',
    'Reach top 3 in any high-stakes tournament.',
    'Achieve a 5-match winning streak.',
    'Achieve a 10-match winning streak.',
    'Compete in 15 Rocket League tournaments.',
    'Get 100 headshots in Counter-Strike 2.',
    'Play 20 matches in Valorant.',
    'Reach Level 50 on GameX.',
    'Earn a total of $5,000 in prize pools.',
    'Participate in tournaments for 3 consecutive months.',
    'Add 10 friends to your friends list.',
    'Reach the Top 10 on the player leaderboard.',
    'Join a tournament hosted by a verified organizer.',
    'Win a match without dropping a single round.',
    'Win a match in overtime/decider round.',
    'Reach 10,000 total Experience Points.',
    'Equip 3 badges on your profile page.',
    'Create 5 forum discussions under Community.',
    'Submit feedback or report a bug.',
    'Win a tournament that had zero entry fee.',
    'Register and lead a team in a 5v5 tournament.',
    'Complete a tournament layout setup as an organizer.',
    'Win a tournament without losing a single game.',
    'Win a match after trailing by a large margin.',
    'Reach Apex Predator rank in Apex tournaments.',
    'Reach Global Elite matching in CS2 tournaments.',
    'Win a Dota 2 tournament of Tier-1 organizer.'
  ];

  const unlocked = i < 8; // First 8 are unlocked
  const max = [1, 1, 10, 1, 3, 5, 10, 15, 100, 20, 50, 5000, 3, 10, 10, 1, 1, 1, 10000, 3, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1][i];
  const progress = unlocked ? max : Math.floor(Math.random() * max);

  return {
    id: `ach-${i + 1}`,
    title: titles[i % titles.length],
    description: descriptions[i % descriptions.length],
    icon: unlocked ? 'check' : 'lock',
    unlockedAt: unlocked ? new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString() : undefined,
    progress,
    maxProgress: max
  };
});

// 1. Generate 15 Organizers
export const ORGANIZERS: Organizer[] = Array.from({ length: 15 }).map((_, i) => {
  const names = [
    'FACEIT Official', 'Challengermode Esports', 'Riot Games League', 'ESL Gaming',
    'PGL Esports', 'Blast Premier', 'DreamHack Arena', 'WePlay Academy',
    'Epic Esports', 'Cyber Gaming League', 'Gamers Club', 'Red Bull Esports',
    'Intel Extreme', 'VALORANT Champions Tour', 'Community Esports Cup'
  ];
  return {
    id: `org-${i + 1}`,
    name: names[i],
    logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(names[i])}`,
    bio: `Premier tournament organizer bringing professional grade esports tournaments to players of all skill levels. Specializing in ${GAMES[i % GAMES.length]}.`,
    verified: i < 8,
    followers: Math.floor(Math.random() * 5000) + 120,
    tournamentsCount: Math.floor(Math.random() * 30) + 5
  };
});

// 2. Generate 40 Players
export const PLAYERS: User[] = Array.from({ length: 40 }).map((_, i) => {
  const usernames = [
    'Slayer99', 'FragLord', 'HeadshotHero', 'ShadowWalk', 'GamerPro', 'ViperStrike', 'AeroMaster', 'DunkMachine',
    'DotaGod', 'LoLQueen', 'ApexPredator', 'FortniteKing', 'NoobMaster69', 'ClutchKing', 'TenzClone', 's1mpleFans',
    'ZywOoJr', 'FakerLegacy', 'ShroudApprentice', 'NinjaVibe', 'ChallengerX', 'EsportTitan', 'TacticalGamer', 'RushBOnly',
    'MidOrFeed', 'JunglerPro', 'SpikePlanter', 'AceOperator', 'WallBangPro', 'SmokeQue', 'FlashBang', 'OneTapKing',
    'GhostAim', 'SilentWalk', 'SniperStar', 'ReflexGod', 'SpeedRunner', 'GoalGetter', 'CSGoat', 'ValorMaster'
  ];

  const badges = [
    BADGES[0], // Alpha Tester
    ...(i % 3 === 0 ? [BADGES[1]] : []),
    ...(i % 4 === 0 ? [BADGES[2]] : []),
    ...(i % 5 === 0 ? [BADGES[3]] : []),
    ...(i % 7 === 0 ? [BADGES[4]] : [])
  ];

  const playerAchievements = ACHIEVEMENTS.map(ach => {
    const isUnlocked = Math.random() > 0.6;
    return {
      ...ach,
      unlockedAt: isUnlocked ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() : undefined,
      progress: isUnlocked ? ach.maxProgress : Math.floor(Math.random() * ach.maxProgress)
    };
  });

  const matchesPlayed = Math.floor(Math.random() * 300) + 20;
  const matchesWon = Math.floor(matchesPlayed * (0.45 + Math.random() * 0.25));
  const winRate = parseFloat(((matchesWon / matchesPlayed) * 100).toFixed(1));
  const tournamentWins = Math.floor(matchesWon * 0.05);

  const activities: Activity[] = [
    {
      id: `act-${i}-1`,
      type: 'level_up',
      title: 'Level Up!',
      description: `Reached Level ${Math.floor(matchesPlayed / 15) + 1}`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `act-${i}-2`,
      type: 'match_played',
      title: 'Match Played',
      description: `Competed in a ${GAMES[i % GAMES.length]} match`,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  if (tournamentWins > 0) {
    activities.unshift({
      id: `act-${i}-0`,
      type: 'tournament_win',
      title: 'Tournament Winner!',
      description: `Won the ${GAMES[i % GAMES.length]} Challenger Cup`,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return {
    id: `usr-${i + 1}`,
    username: usernames[i],
    email: `${usernames[i].toLowerCase()}@esportbrawl.com`,
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${usernames[i]}`,
    banner: '/assets/images/background-profile.png',
    walletAddress: i % 2 === 0 ? `0x${Array.from({ length: 40 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` : undefined,
    country: COUNTRIES[i % COUNTRIES.length],
    bio: `Hardcore gamer. Professional competitor. Esports enthusiast. Specialized in competitive ${GAMES[i % GAMES.length]}. Add me for scrims!`,
    tags: ['Competitive', 'Tactician', 'LFG', GAMES[i % GAMES.length]],
    badges,
    achievements: playerAchievements,
    xp: matchesPlayed * 100 + matchesWon * 50,
    level: Math.floor(matchesPlayed / 15) + 1,
    rank: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'][Math.min(7, Math.floor(matchesWon / 25))],
    winRate,
    matchesPlayed,
    matchesWon,
    tournamentWins,
    followers: Math.floor(Math.random() * 1000) + 12,
    following: Math.floor(Math.random() * 200) + 5,
    friendsCount: Math.floor(Math.random() * 50) + 2,
    recentActivity: activities
  };
});

// The current authenticated user session
export const CURRENT_USER: User = {
  ...PLAYERS[0],
  id: 'usr-current',
  username: 'GamerX_Pro',
  email: 'gamerx_pro@esportbrawl.com',
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamerx',
  walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  bio: 'Lead host & Competitive Valorant player. Grinding matches daily, looking to register teams for upcoming cups!',
  xp: 12500,
  level: 18,
  rank: 'Diamond III',
  winRate: 64.2,
  matchesPlayed: 148,
  matchesWon: 95,
  tournamentWins: 4,
  followers: 485,
  following: 120,
  friendsCount: 38
};

// 3. Generate 50 Tournaments
export const TOURNAMENTS: Tournament[] = Array.from({ length: 50 }).map((_, i) => {
  const game = GAMES[i % GAMES.length];
  const organizer = ORGANIZERS[i % ORGANIZERS.length];
  const status: 'upcoming' | 'live' | 'completed' | 'draft' = 
    i < 15 ? 'upcoming' : 
    i < 25 ? 'live' : 
    i < 45 ? 'completed' : 'draft';

  const entryFee = i % 5 === 0 ? 0 : [5, 10, 20, 50][i % 4];
  const prizePool = [1000, 2500, 5000, 10000, 25000, 50000, 100000][i % 7];
  
  // Set dates
  const daysDiff = status === 'completed' ? -(i - 20) : status === 'live' ? 0 : (i - 10);
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + daysDiff);
  const startDate = dateObj.toISOString();

  // Pick participants
  const maxSlots = [8, 16, 32, 64][i % 4];
  const registeredCount = status === 'live' || status === 'completed' 
    ? maxSlots 
    : Math.floor(Math.random() * maxSlots);

  const participants: Participant[] = PLAYERS.slice(0, registeredCount).map((p, idx) => ({
    id: p.id,
    username: p.username,
    avatar: p.avatar,
    status: idx < registeredCount * 0.85 ? 'approved' : 'pending',
    joinedAt: new Date(dateObj.getTime() - (idx + 1) * 3600000).toISOString(),
    rank: p.rank
  }));

  // Setup brackets
  let bracket: BracketMatch[] = [];
  if (status === 'live' || status === 'completed') {
    const rounds = Math.log2(maxSlots);
    let matchId = 1;
    
    // Simple 8-slot bracket for UI demo
    const bracketSize = Math.min(8, maxSlots);
    const round1Count = bracketSize / 2;

    // Round 1
    const round1Matches: BracketMatch[] = Array.from({ length: round1Count }).map((_, mIdx) => {
      const p1User = participants[mIdx * 2];
      const p2User = participants[mIdx * 2 + 1];
      const p1Score = status === 'completed' ? Math.floor(Math.random() * 5) + 8 : status === 'live' ? Math.floor(Math.random() * 5) : null;
      const p2Score = status === 'completed' ? (p1Score !== null ? (p1Score > 10 ? p1Score - 2 : p1Score + 2) : 9) : status === 'live' ? Math.floor(Math.random() * 5) : null;
      
      let winner = null;
      if (status === 'completed' && p1Score !== null && p2Score !== null) {
        winner = p1Score > p2Score ? p1User?.username : p2User?.username;
      }

      return {
        id: `bm-${i}-${matchId++}`,
        round: 1,
        nextMatchId: `bm-${i}-${round1Count + Math.floor(mIdx / 2) + 1}`,
        p1: p1User ? { username: p1User.username, score: p1Score, avatar: p1User.avatar } : null,
        p2: p2User ? { username: p2User.username, score: p2Score, avatar: p2User.avatar } : null,
        winner,
        status: status === 'completed' ? 'completed' : 'live'
      };
    });

    // Round 2 (Semifinals)
    const round2Count = round1Count / 2;
    const round2Matches: BracketMatch[] = Array.from({ length: round2Count }).map((_, mIdx) => {
      const prev1 = round1Matches[mIdx * 2];
      const prev2 = round1Matches[mIdx * 2 + 1];
      
      const p1User = prev1?.winner ? participants.find(p => p.username === prev1.winner) : null;
      const p2User = prev2?.winner ? participants.find(p => p.username === prev2.winner) : null;
      
      const p1Score = status === 'completed' ? 16 : null;
      const p2Score = status === 'completed' ? 12 : null;
      
      return {
        id: `bm-${i}-${matchId++}`,
        round: 2,
        nextMatchId: `bm-${i}-${round1Count + round2Count + 1}`,
        p1: p1User ? { username: p1User.username, score: p1Score, avatar: p1User.avatar } : null,
        p2: p2User ? { username: p2User.username, score: p2Score, avatar: p2User.avatar } : null,
        winner: status === 'completed' ? p1User?.username || null : null,
        status: status === 'completed' ? 'completed' : 'scheduled'
      };
    });

    // Round 3 (Finals)
    const finalMatch: BracketMatch = {
      id: `bm-${i}-${matchId++}`,
      round: 3,
      nextMatchId: null,
      p1: status === 'completed' && round2Matches[0]?.winner 
        ? { username: round2Matches[0].winner, score: 3, avatar: participants.find(p => p.username === round2Matches[0].winner)?.avatar || '' } 
        : null,
      p2: status === 'completed' && round2Matches[1]?.winner 
        ? { username: round2Matches[1].winner, score: 1, avatar: participants.find(p => p.username === round2Matches[1].winner)?.avatar || '' } 
        : null,
      winner: status === 'completed' && round2Matches[0]?.winner ? round2Matches[0].winner : null,
      status: status === 'completed' ? 'completed' : 'scheduled'
    };

    bracket = [...round1Matches, ...round2Matches, finalMatch];
  }

  return {
    id: `trn-${i + 1}`,
    title: `${game} ${['Challenger Cup', 'Pro Masters', 'Elite Series', 'Winter Brawl', 'Arena Showdown', 'Regional Trials'][i % 6]} Vol.${Math.floor(i / 6) + 1}`,
    description: `Welcome to the official ${game} tournament hosted by ${organizer.name}. Join competitive teams battle for the supreme prize pool of $${prizePool.toLocaleString()}! Ensure you read all regulations and check in on Discord prior to matchmaking starting. Matches will be casted live.`,
    banner: `/assets/images/gallery-img-${(i % 4) + 1}.jpg`,
    game,
    prizePool,
    entryFee,
    maxSlots,
    registeredCount,
    organizerId: organizer.id,
    organizerName: organizer.name,
    organizerLogo: organizer.logo,
    status,
    startDate,
    rules: [
      'Be respectful to all opponents and organizers.',
      'No cheats, custom client modifications, or third-party exploits allowed.',
      'Check-in is required 30 minutes before the tournament start time.',
      'Disconnects: A remake is allowed if the disconnect occurs within the first 60 seconds.',
      'All teams must submit match screenshots upon completion for result approval.'
    ],
    schedule: [
      { stage: 'Check-in Opens', date: startDate.split('T')[0], time: '17:30 UTC' },
      { stage: 'Round 1 Bracket', date: startDate.split('T')[0], time: '18:00 UTC' },
      { stage: 'Semifinals Stage', date: startDate.split('T')[0], time: '19:30 UTC' },
      { stage: 'Grand Finals Cast', date: startDate.split('T')[0], time: '21:00 UTC' }
    ],
    prizes: [
      { rank: '1st Place', reward: `$${(prizePool * 0.6).toLocaleString()} (60%)` },
      { rank: '2nd Place', reward: `$${(prizePool * 0.3).toLocaleString()} (30%)` },
      { rank: '3rd Place', reward: `$${(prizePool * 0.1).toLocaleString()} (10%)` }
    ],
    participants,
    bracket,
    bookmarked: i % 7 === 0
  };
});

// 4. Generate 100 Notifications
export const NOTIFICATIONS: Notification[] = Array.from({ length: 100 }).map((_, i) => {
  const types: Notification['type'][] = [
    'registration_approved', 'tournament_started', 'achievement_unlocked',
    'organizer_announcement', 'match_ready'
  ];
  const type = types[i % types.length];
  const trn = TOURNAMENTS[i % TOURNAMENTS.length];

  let title = '';
  let message = '';

  switch (type) {
    case 'registration_approved':
      title = 'Registration Approved';
      message = `Your team has been approved for the tournament "${trn.title}"!`;
      break;
    case 'tournament_started':
      title = 'Tournament Live';
      message = `The tournament "${trn.title}" has started! Check your bracket slot now.`;
      break;
    case 'achievement_unlocked':
      const ach = ACHIEVEMENTS[i % ACHIEVEMENTS.length];
      title = 'Achievement Unlocked 🏆';
      message = `Congratulations! You unlocked the achievement: "${ach.title}".`;
      break;
    case 'organizer_announcement':
      title = 'New Announcement';
      message = `Organizer ${trn.organizerName} posted an update: "Server slots have been reset. Rematches scheduled."`;
      break;
    case 'match_ready':
      title = 'Match Ready';
      message = `Your match for "${trn.title}" is ready. Connect your game client now!`;
      break;
  }

  const dateObj = new Date();
  dateObj.setHours(dateObj.getHours() - i);

  return {
    id: `notif-${i + 1}`,
    type,
    title,
    message,
    status: i < 5 ? 'unread' : 'read',
    timestamp: dateObj.toISOString(),
    tournamentId: trn.id
  };
});

// 5. Generate Forum Posts (Community)
export const COMMUNITY_POSTS: ForumPost[] = Array.from({ length: 25 }).map((_, i) => {
  const titles = [
    'Is the new CS2 patch favoring the defenders too much?',
    'Upcoming Valorant Open tournament registration opens tomorrow!',
    'How do I improve my tracking in Apex Legends? Looking for guides.',
    'Dota 2 patch discussion: Top tier mid lane champions in 7.35b',
    'GameX Update: Multi-stage organizers dashboards are live!',
    'Rocket League freestyle competition - Clip submissions thread',
    'Tips for hosting a clean local LAN tourney with 16 teams',
    'LFG: Diamond Valorant squad for ESL cup next weekend',
    'Dota 2: Standard tournament rulebook suggestions for organizers',
    'Is it worth starting in competitive Fortnite in 2026?'
  ];

  const contents = [
    'Discussing the recent updates on CS2. The utility adjustments feel very defensive. What do you all think?',
    'Make sure your squad registers by 6 PM tomorrow. We are limited to 32 slots only, free entry, $5k pool.',
    'I have been struggling in mid-range battles on Apex. My mouse sensitivity is 800 DPI at 1.2 in-game. Help!',
    'Mage items got buffed heavily. Stormcrafter is extremely strong. Who is your default pick now?',
    'We are excited to share that users hosting tournaments can now manage, approve, or export participants directly.',
    'Drop your best goals in the comments. The most upvoted clip wins 500 GameX coins!',
    'Running a local setup in Munich. Need help with matchmaking API servers configuration to sync results.',
    'Need a sentinel and an initiator player. Must be Diamond II+, speaking English, available 18:00 UTC.',
    'Here is the standard templates for match limits, pause allowances, and tiebreaker procedures.',
    'With the new map layouts and mechanics, competitive builds are very different. Let\'s evaluate.'
  ];

  const tags = [['CS2', 'Meta', 'Discussion'], ['Valorant', 'Tourney'], ['Apex', 'Help', 'Aiming'], ['Dota2', 'Patch'], ['Update', 'Platform'], ['RocketLeague', 'Freestyle'], ['LAN', 'Help'], ['LFG', 'Valorant'], ['Dota2', 'Rules'], ['Fortnite', 'Strategy']][i % 10];

  const author = PLAYERS[i % PLAYERS.length];
  const postDate = new Date();
  postDate.setDate(postDate.getDate() - (i % 5));

  const comments = Array.from({ length: i % 4 }).map((_, cIdx) => {
    const cAuthor = PLAYERS[(i + cIdx + 5) % PLAYERS.length];
    return {
      id: `comm-${i}-${cIdx}`,
      authorUsername: cAuthor.username,
      authorAvatar: cAuthor.avatar,
      content: `I agree with this point. Especially regarding ${tags[0]}. Also, check out recent matches.`,
      timestamp: new Date(postDate.getTime() + (cIdx + 1) * 7200000).toISOString()
    };
  });

  return {
    id: `post-${i + 1}`,
    authorUsername: author.username,
    authorAvatar: author.avatar,
    title: titles[i % titles.length] + (i > 9 ? ` [Part ${Math.floor(i / 10) + 1}]` : ''),
    content: contents[i % contents.length],
    category: i % 4 === 0 ? 'Announcements' : i % 3 === 0 ? 'Tournament Posts' : i % 2 === 0 ? 'Trending' : 'Latest',
    tags,
    likes: Math.floor(Math.random() * 150) + 5,
    comments,
    timestamp: postDate.toISOString()
  };
});
