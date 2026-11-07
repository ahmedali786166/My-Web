export type Game = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  gameUrl: string;
  gameType: 'iframe' | 'direct';
  instructions: string;
  controls: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  playCount: number;
  seoTitle: string;
  seoDescription: string;
};

const art = (a: string) =>
  `https://images.unsplash.com/${a}?auto=format&fit=crop&w=900&q=82&sat=12`;

export const FEATURED_GAME_ID = 'g0';

export const starterGames: Game[] = [
  {
    id: FEATURED_GAME_ID,
    title: 'Shahenshah Flappy Ops 👑',
    slug: 'shahenshah-flappy-ops',
    description:
      'The legendary Shahenshah takes flight. Dodge blazing pillars, chase the high score and unlock meme voice lines in this high-octane desi Flappy adventure.',
    category: 'Meme Games',
    thumbnail: 'https://shahenshah-meme-game.vercel.app/icons/share-preview.jpg',
    gameUrl: 'https://shahenshah-meme-game.vercel.app/',
    gameType: 'iframe',
    instructions:
      'Tap, click or press Space to flap. Thread the gaps between the fire pillars and keep the Shahenshah airborne for as long as possible.',
    controls: 'Click / tap / Space to flap. Fullscreen and reload are available in the game player.',
    published: true,
    featured: true,
    createdAt: '2026-11-06',
    playCount: 0,
    seoTitle: 'Shahenshah Flappy Ops 👑 | Ahmed Arcade',
    seoDescription:
      'Play Shahenshah Flappy Ops, a high-octane Bollywood meme Flappy Bird game, right here on Ahmed Arcade.',
  },
  {
    id: 'g1',
    title: 'Amitabh Bachchan Meme Game',
    slug: 'amitabh-meme-game',
    description:
      'A dramatic, over-the-top reaction challenge inspired by classic Bollywood energy. Tap into the chaos and chase your best score.',
    category: 'Bollywood',
    thumbnail: art('photo-1511512578047-dfb367046420'),
    gameUrl: '',
    gameType: 'iframe',
    instructions:
      'Game file not connected yet. Add a hosted game URL in the owner dashboard to make this title playable.',
    controls: 'Configured by the game developer.',
    published: true,
    featured: true,
    createdAt: '2026-10-28',
    playCount: 0,
    seoTitle: 'Amitabh Meme Game | Ahmed Arcade',
    seoDescription: 'A Bollywood-inspired meme game concept on Ahmed Arcade.',
  },
  {
    id: 'g2',
    title: 'SRK Funny Game',
    slug: 'srk-funny-game',
    description:
      'A playful Bollywood-style mini-game concept packed with dramatic moments and silly challenges.',
    category: 'Bollywood',
    thumbnail: art('photo-1542751371-adc38448a05e'),
    gameUrl: '',
    gameType: 'iframe',
    instructions:
      'Game file not connected yet. Add a hosted game URL in the owner dashboard to make this title playable.',
    controls: 'Configured by the game developer.',
    published: true,
    featured: true,
    createdAt: '2026-10-30',
    playCount: 0,
    seoTitle: 'SRK Funny Game | Ahmed Arcade',
    seoDescription: 'A light-hearted Bollywood parody game concept.',
  },
  {
    id: 'g3',
    title: 'Angry Teacher Simulator',
    slug: 'angry-teacher-simulator',
    description:
      'Survive classroom madness, dodge surprise tests and keep your virtual classroom under control.',
    category: 'Funny Challenges',
    thumbnail: art('photo-1493711662062-fa541f1f4a1e'),
    gameUrl: '',
    gameType: 'iframe',
    instructions:
      'Game file not connected yet. Add a hosted game URL in the owner dashboard to make this title playable.',
    controls: 'Configured by the game developer.',
    published: true,
    featured: true,
    createdAt: '2026-10-31',
    playCount: 0,
    seoTitle: 'Angry Teacher Simulator | Ahmed Arcade',
    seoDescription: 'A funny classroom challenge game concept.',
  },
  {
    id: 'g4',
    title: 'Pakistani Rishta Game',
    slug: 'pakistani-rishta-game',
    description:
      'Navigate funny family questions and unexpected rishta conversations in this desi comedy concept.',
    category: 'Desi Comedy',
    thumbnail: art('photo-1511882150382-421056c89033'),
    gameUrl: '',
    gameType: 'iframe',
    instructions:
      'Game file not connected yet. Add a hosted game URL in the owner dashboard to make this title playable.',
    controls: 'Configured by the game developer.',
    published: true,
    featured: true,
    createdAt: '2026-11-01',
    playCount: 0,
    seoTitle: 'Pakistani Rishta Game | Ahmed Arcade',
    seoDescription: 'A desi family-comedy game concept.',
  },
  {
    id: 'g5',
    title: 'Chai Wala Simulator',
    slug: 'chai-wala-simulator',
    description: 'Run a tiny virtual chai stall, serve customers and keep the tea flowing.',
    category: 'Simulation',
    thumbnail: art('photo-1511512578047-dfb367046420'),
    gameUrl: '',
    gameType: 'iframe',
    instructions:
      'Game file not connected yet. Add a hosted game URL in the owner dashboard to make this title playable.',
    controls: 'Configured by the game developer.',
    published: true,
    featured: false,
    createdAt: '2026-11-03',
    playCount: 0,
    seoTitle: 'Chai Wala Simulator | Ahmed Arcade',
    seoDescription: 'A casual chai stall simulator concept.',
  },
  {
    id: 'g6',
    title: 'Sigma Boy Challenge',
    slug: 'sigma-boy-challenge',
    description:
      'A quick-fire arcade challenge with ridiculous tasks, big reactions and replayable rounds.',
    category: 'Meme Games',
    thumbnail: art('photo-1535223289827-42f1e9919769'),
    gameUrl: '',
    gameType: 'iframe',
    instructions:
      'Game file not connected yet. Add a hosted game URL in the owner dashboard to make this title playable.',
    controls: 'Configured by the game developer.',
    published: true,
    featured: false,
    createdAt: '2026-11-05',
    playCount: 0,
    seoTitle: 'Sigma Boy Challenge | Ahmed Arcade',
    seoDescription: 'A fast meme-inspired arcade challenge concept.',
  },
];

const KEY = 'ahmed-arcade-games-v2';

export function getGames(): Game[] {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? (JSON.parse(stored) as Game[]) : starterGames;
  } catch {
    return starterGames;
  }
}

export function saveGames(games: Game[]) {
  localStorage.setItem(KEY, JSON.stringify(games));
}

export const categories = [
  'All Games',
  'Meme Games',
  'Bollywood',
  'Desi Comedy',
  'Funny Challenges',
  'Casual',
  'Simulation',
  'Arcade',
];
