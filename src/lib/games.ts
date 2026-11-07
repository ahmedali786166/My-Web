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

export const FEATURED_GAME_ID = 'g0';

export const starterGames: Game[] = [
  {
    id: FEATURED_GAME_ID,
    title: 'Amitabh Bachan Meme Game',
    slug: 'amitabh-bachan-meme-game',
    description:
      'The legendary Amitabh Bachan takes flight. Dodge blazing fire pillars, chase the high score and unlock meme voice lines in this high-octane Bollywood Flappy game.',
    category: 'Meme Games',
    thumbnail: 'https://shahenshah-meme-game.vercel.app/icons/share-preview.jpg',
    gameUrl: 'https://shahenshah-meme-game.vercel.app/',
    gameType: 'iframe',
    instructions:
      'Tap, click or press Space to flap. Thread the gaps between the fire pillars and keep flying for as long as possible to beat your best score.',
    controls: 'Click / tap / Space to flap. Fullscreen and reload are available in the game player.',
    published: true,
    featured: true,
    createdAt: '2026-11-06',
    playCount: 0,
    seoTitle: 'Amitabh Bachan Meme Game | Ahmed Arcade',
    seoDescription:
      'Play the Amitabh Bachan Meme Game, a high-octane Bollywood Flappy challenge, right here on Ahmed Arcade.',
  },
];

const KEY = 'ahmed-arcade-games-v3';

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
