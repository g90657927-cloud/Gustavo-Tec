export type TechCategory = 
  | 'Todas'
  | 'Inteligência Artificial'
  | 'Hardware & Chips'
  | 'Dev & Open Source'
  | 'Cibersegurança'
  | 'Mobile & Gadgets'
  | 'Espaço & Robótica'
  | 'Cloud & Web3';

export type UserRole = 
  | 'Administrador'
  | 'Moderador'
  | 'Editor de Notícias'
  | 'Membro VIP'
  | 'Dev Full-Stack'
  | 'Engenheiro de IA'
  | 'Entusiasta de Tecnologia'
  | 'Analista de Segurança'
  | 'Especialista em Hardware'
  | 'Designer de Produto';

export interface RoleChangeLog {
  id: string;
  targetUserId: string;
  targetUserName: string;
  targetUserEmail: string;
  previousRole: UserRole;
  newRole: UserRole;
  changedByEmail: string;
  changedByName: string;
  timestamp: number;
  reason?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio: string;
  location?: string;
  techStack: string[];
  badges: string[];
  favoriteCategories: TechCategory[];
  joinedAt: string;
  accentColor: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  bookmarkedNewsIds: string[];
  commentsCount: number;
  likesCount: number;
}

export interface NewsAuthor {
  name: string;
  avatar: string;
  role: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: TechCategory;
  author: NewsAuthor;
  publishedAt: string;
  timestamp: number;
  readTime: string;
  imageUrl: string;
  likes: number;
  views: number;
  breaking?: boolean;
  trending?: boolean;
  tags: string[];
  commentsCount: number;
  source: string;
  sourceUrl?: string;
  sourceDomain?: string;
  keyTakeaways?: string[];
}

export interface CommentReaction {
  type: 'like' | 'fire' | 'brain' | 'rocket';
  count: number;
  userReacted?: boolean;
}

export interface NewsComment {
  id: string;
  newsId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: string;
    badge?: string;
  };
  content: string;
  createdAt: string;
  timestamp: number;
  likes: number;
  reactions?: {
    fire: number;
    brain: number;
    rocket: number;
  };
  userLiked?: boolean;
  replies?: NewsComment[];
}

export interface BreakingAlert {
  id: string;
  title: string;
  category: string;
  time: string;
  isUrgent: boolean;
}

export type DeviceViewMode = 'desktop' | 'tablet' | 'mobile';

export interface FootballMatch {
  id: string;
  league: string;
  leagueCountry: string;
  leagueIcon?: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'LIVE' | 'FINISHED' | 'SCHEDULED' | 'HT' | 'POSTPONED';
  minute?: number;
  timeString: string;
  date: string;
  venue?: string;
  events?: {
    id: string;
    minute: number;
    type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'VAR' | 'SUBSTITUTION' | 'PENALTY';
    team: 'home' | 'away';
    player: string;
    assistOrDetail?: string;
  }[];
  stats?: {
    possession: [number, number]; // [home, away]
    shotsOnTarget: [number, number];
    totalShots: [number, number];
    corners: [number, number];
    fouls: [number, number];
    yellowCards: [number, number];
    redCards: [number, number];
  };
  flashscoreUrl?: string;
  isFavorite?: boolean;
}

export interface FootballStanding {
  rank: number;
  team: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface OnlineChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  userBadge?: string;
  userEmail?: string;
  message: string;
  timestamp: number;
  formattedTime: string;
  operatorTag?: string; // e.g. 'DIGI 10G', 'Vodafone 5G', 'MEO Altice', 'NOS', etc.
  likes?: number;
  likedBy?: string[];
  replyTo?: {
    id: string;
    userName: string;
    messageSnippet: string;
  };
}

export interface NotificationAlert {
  id: string;
  type: 'urgent_news' | 'network_change' | 'weather_alert' | 'goal_alert' | 'system';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  severity: 'high' | 'medium' | 'info';
  icon?: string;
  actionTab?: 'news' | 'weather' | 'football' | 'tools' | 'gemini' | 'community' | 'messages';
  data?: any;
}
