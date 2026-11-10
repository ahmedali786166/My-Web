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
  {
    id: 'g1',
    title: 'Bhag Modi Bhag: Meme Chase',
    slug: 'bhag-modi-bhag-meme-chase',
    description:
      'Modi is on the run and Monster ACP is right behind him. Dodge traffic, grab coins and survive the neon dusk highway in this wild 3D endless runner.',
    category: 'Meme Games',
    thumbnail: '/games/acp-meme-game.jpg',
    gameUrl: 'https://acp-meme-game.vercel.app/',
    gameType: 'iframe',
    instructions:
      'Use the left and right arrows to switch lanes, the up arrow to jump and the down arrow to roll. Grab coins, dodge traffic and keep all three hearts alive.',
    controls: '← → lanes · ↑ jump · ↓ roll · swipe on mobile. Fullscreen and reload are available in the game player.',
    published: true,
    featured: true,
    createdAt: '2026-11-10',
    playCount: 0,
    seoTitle: 'Bhag Modi Bhag: Meme Chase | Ahmed Arcade',
    seoDescription:
      'Play Bhag Modi Bhag: Meme Chase, a 3D endless runner where Modi escapes the Monster ACP, right here on Ahmed Arcade.',
  },
];

const KEY = 'ahmed-arcade-games-v4';

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
