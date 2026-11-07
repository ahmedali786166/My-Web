import type { FormEvent, ReactNode } from 'react';
import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  Menu,
  X,
  ArrowUpRight,
  Play,
  Flame,
  Sparkles,
  Heart,
  Clock3,
  ChevronRight,
  Gamepad,
  Joystick,
  PartyPopper,
  MonitorPlay,
  Share2,
  Maximize,
  ExternalLink,
  Shield,
  Plus,
  Trash2,
  Edit3,
  LogIn,
  Star,
  Zap,
} from 'lucide-react';
import { categories, FEATURED_GAME_ID, getGames, saveGames, starterGames, type Game } from './lib/games';
import { auth, db, firebaseReady } from './lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  increment,
  updateDoc,
} from 'firebase/firestore';
import GameOverlayModal from './components/GameOverlayModal';
import AdsterraAd from './components/AdsterraAd';

const icons = [Gamepad2, PartyPopper, Star, Flame, Zap, MonitorPlay, Joystick, Gamepad];

type GameModalValue = {
  activeGame: Game | null;
  openGame: (game: Game) => void;
  closeGame: () => void;
};

const GameModalContext = createContext<GameModalValue | null>(null);

function useGameModal() {
  const value = useContext(GameModalContext);
  if (!value) throw new Error('useGameModal must be used inside GameModalContext');
  return value;
}

function useLibrary() {
  const [games, setGames] = useState<Game[]>(getGames);
  useEffect(() => {
    if (!firebaseReady || !db) return;
    return onSnapshot(collection(db, 'games'), (snapshot) => {
      if (!snapshot.empty) setGames(snapshot.docs.map((entry) => entry.data() as Game));
    });
  }, []);
  const update = (next: Game[]) => {
    setGames(next);
    saveGames(next);
  };
  return { games, update };
}

function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate('/games?search=' + encodeURIComponent(q));
    setOpen(false);
  };
  return (
    <header className="header">
      <div className="nav wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Gamepad2 size={23} />
          </span>
          <span>
            AHMED<span className="gradient-text"> ARCADE</span>
            <small>PLAY MORE. LAUGH HARDER.</small>
          </span>
        </Link>
        <nav className={open ? 'nav-links show' : 'nav-links'}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/games" onClick={() => setOpen(false)}>
            Games
          </NavLink>
          <a href="/#discover" onClick={() => setOpen(false)}>
            Discover
          </a>
          <a href="/#trending" onClick={() => setOpen(false)}>
            Trending
          </a>
          <a href="/#categories" onClick={() => setOpen(false)}>
            Categories
          </a>
          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>
        </nav>
        <form className="nav-search" onSubmit={submit}>
          <Search size={16} />
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search games..." />
          <button aria-label="Search">
            <ArrowUpRight size={15} />
          </button>
        </form>
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Gamepad2 />
            </span>
            <span>
              AHMED<span className="gradient-text"> ARCADE</span>
              <small>PLAY MORE. LAUGH HARDER.</small>
            </span>
          </Link>
          <p>Small games. Big laughs. Zero boring moments.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/dmca">DMCA</Link>
          <Link to="/admin">Owner</Link>
        </div>
        <span className="copyright">© {new Date().getFullYear()} Ahmed Arcade. Made for fun.</span>
      </div>
    </footer>
  );
}

function GameCard({ game }: { game: Game }) {
  const { openGame } = useGameModal();
  const [fav, setFav] = useState(() =>
    JSON.parse(localStorage.getItem('aa-favs') || '[]').includes(game.id)
  );
  const toggle = () => {
    const favorites: string[] = JSON.parse(localStorage.getItem('aa-favs') || '[]');
    const next = fav ? favorites.filter((id) => id !== game.id) : [...favorites, game.id];
    localStorage.setItem('aa-favs', JSON.stringify(next));
    setFav(!fav);
  };
  return (
    <article className="game-card">
      <div className="card-image">
        <Link to={'/games/' + game.slug} aria-label={game.title}>
          <img src={game.thumbnail} alt={game.title} loading="lazy" />
        </Link>
        <span className="card-shade" />
        <span className="category-tag">{game.category}</span>
        {game.featured && <span className="featured-tag">FEATURED</span>}
        {game.gameUrl ? (
          <button type="button" className="play-overlay" onClick={() => openGame(game)}>
            <Play fill="currentColor" size={20} /> Play now
          </button>
        ) : (
          <Link to={'/games/' + game.slug} className="play-overlay">
            View details
          </Link>
        )}
      </div>
      <div className="card-info">
        <div>
          <Link to={'/games/' + game.slug} className="game-title">
            {game.title}
          </Link>
          <p>{game.description.slice(0, 68)}…</p>
        </div>
        <button className={fav ? 'heart active' : 'heart'} onClick={toggle} aria-label="Favorite">
          <Heart size={17} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}

function SectionTitle({
  eyebrow,
  title,
  sub,
  to = '/games',
}: {
  eyebrow: string;
  title: string;
  sub: string;
  to?: string;
}) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">
          <i />
          {eyebrow}
        </span>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <Link className="view-all" to={to}>
        View all <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function Categories({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  return (
    <div className="category-row">
      {categories.map((category, index) => {
        const Icon = icons[index];
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={selected === category ? 'category-chip selected' : 'category-chip'}
          >
            <Icon size={17} />
            {category}
          </button>
        );
      })}
    </div>
  );
}

function Home() {
  const { games } = useLibrary();
  const { openGame } = useGameModal();
  const [category, setCategory] = useState('All Games');
  const live = games.filter((game) => game.published);
  const featured = live.filter((game) => game.featured);
  const fresh = [...live].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const trending = [...live]
    .filter((game) => game.playCount > 0)
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 4);
  const filtered = category === 'All Games' ? live : live.filter((game) => game.category === category);
  const showTrending = live.length > 1 && trending.length > 0;
  const heroGame =
    live.find((game) => game.id === FEATURED_GAME_ID && game.gameUrl) ??
    live.find((game) => game.gameUrl) ??
    featured[0] ??
    live[0];

  return (
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="hero-kicker">
            <Sparkles size={14} /> YOUR NEW FAVOURITE DISTRACTION
          </span>
          <h1>
            PLAY MEMES.
            <br />
            <span className="gradient-text">LIVE THE CHAOS.</span>
          </h1>
          <p>
            Discover hilarious meme games, crazy challenges and unforgettable gaming moments. Your
            next favourite game is one click away.
          </p>
          <div className="hero-actions">
            {heroGame && (
              <button type="button" className="btn primary" onClick={() => openGame(heroGame)}>
                <Play fill="currentColor" size={16} /> PLAY NOW
              </button>
            )}
            <Link to="/games" className="btn secondary">
              Explore games <ArrowUpRight size={17} />
            </Link>
            {showTrending && (
              <a href="#trending" className="btn ghost">
                Discover trending <Flame size={16} />
              </a>
            )}
          </div>
          <div className="hero-proof">
            <span>
              <i className="proof-dot" /> Fresh chaos, regularly
            </span>
            <span>
              <Gamepad2 size={15} /> Free browser games
            </span>
            {heroGame && (
              <span className="hero-live">
                <Play size={13} /> {heroGame.title} is live
              </span>
            )}
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="portal">
            <div className="portal-core">
              <Gamepad2 size={100} strokeWidth={1.15} />
            </div>
          </div>
          <div className="float-card fc-one">
            <span>✦</span>
            <b>MEME MODE</b>
            <small>ACTIVATED</small>
          </div>
          <div className="float-card fc-two">
            <span>GG</span>
            <b>GOOD VIBES</b>
            <small>ONLY HERE</small>
          </div>
          <div className="spark s1">✦</div>
          <div className="spark s2">✧</div>
        </div>
        <div className="hero-bottom">
          <span>SCROLL TO EXPLORE</span>
          <div />
        </div>
      </section>

      <section className="wrap section" id="discover">
        <SectionTitle
          eyebrow="THE GOOD STUFF"
          title="FEATURED GAMES"
          sub="Handpicked games worth your time."
        />
        <div className="game-grid">
          {featured.length ? (
            featured.slice(0, 4).map((game, index) => (
              <Fragment key={game.id}>
                <GameCard game={game} />
                {(index === 1 || (featured.length === 1 && index === 0)) && (
                  <AdsterraAd placement="grid" variant="card" />
                )}
              </Fragment>
            ))
          ) : (
            <Empty text="No featured games yet. Check back soon." />
          )}
        </div>
      </section>

      <section className="section section-muted" id="categories">
        <div className="wrap">
          <SectionTitle
            eyebrow="PICK YOUR VIBE"
            title="BROWSE CATEGORIES"
            sub="Whatever your mood, there's a game for it."
          />
          <Categories selected={category} onSelect={setCategory} />
          {live.length > 1 && (
            <div className="game-grid category-results">
              {filtered.slice(0, 4).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
              {!filtered.length && <Empty text="No games in this category yet." />}
            </div>
          )}
        </div>
      </section>

      {showTrending && (
        <section className="wrap section" id="trending">
          <SectionTitle
            eyebrow="THE CROWD FAVOURITES"
            title="TRENDING RIGHT NOW"
            sub="Sorted by real recorded plays. No made-up hype."
          />
          <div className="game-grid">
            {trending.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </section>
      )}

      {fresh.length > 1 && (
        <section className="wrap section">
          <SectionTitle
            eyebrow="JUST DROPPED"
            title="FRESHLY RELEASED"
            sub="The latest additions to the arcade."
          />
          <div className="game-grid">
            {fresh.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      <section className="wrap cta-band">
        <div>
          <span className="eyebrow">
            <Sparkles size={13} /> THE ARCADE IS YOURS
          </span>
          <h2>
            Got five minutes?
            <br />
            <span className="gradient-text">Make them legendary.</span>
          </h2>
          <p>Jump into something silly. You deserve a break.</p>
        </div>
        <Link to="/games" className="btn primary">
          Find your game <ArrowUpRight size={17} />
        </Link>
      </section>
    </main>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <Gamepad2 size={28} />
      <p>{text}</p>
    </div>
  );
}

function GamesPage() {
  const { games } = useLibrary();
  const [search, setSearch] = useState(new URLSearchParams(location.search).get('search') || '');
  const [cat, setCat] = useState('All Games');
  const [sort, setSort] = useState('newest');
  const list = useMemo(() => {
    let result = games.filter((game) => game.published);
    if (cat !== 'All Games') result = result.filter((game) => game.category === cat);
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((game) =>
        (game.title + ' ' + game.description + ' ' + game.category).toLowerCase().includes(query)
      );
    }
    return result.sort((a, b) =>
      sort === 'popular'
        ? b.playCount - a.playCount
        : sort === 'az'
          ? a.title.localeCompare(b.title)
          : b.createdAt.localeCompare(a.createdAt)
    );
  }, [games, cat, search, sort]);

  return (
    <main className="wrap page-pad">
      <div className="page-heading">
        <span className="eyebrow">
          <i /> THE ARCADE LIBRARY
        </span>
        <h1>
          FIND YOUR <span className="gradient-text">NEXT OBSESSION.</span>
        </h1>
        <p>Search, explore and discover your next favourite distraction.</p>
      </div>
      <div className="filters">
        <div className="big-search">
          <Search />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles, descriptions or categories…"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={17} />
            </button>
          )}
        </div>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest first</option>
          <option value="popular">Most played</option>
          <option value="az">A to Z</option>
        </select>
      </div>
      <Categories selected={cat} onSelect={setCat} />
      <div className="results-line">
        {list.length} {list.length === 1 ? 'GAME' : 'GAMES'} FOUND
      </div>
      {list.length ? (
        <div className="game-grid all-grid">
          {list.map((game, index) => (
            <Fragment key={game.id}>
              <GameCard game={game} />
              {(index === 2 || (list.length <= 3 && index === list.length - 1)) && (
                <AdsterraAd placement="grid" variant="card" />
              )}
            </Fragment>
          ))}
        </div>
      ) : (
        <Empty text="No games match that search. Try another keyword or category." />
      )}
    </main>
  );
}

function GamePage() {
  const { slug } = useParams();
  const { games } = useLibrary();
  const { openGame } = useGameModal();
  const game = games.find((entry) => entry.slug === slug);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (!game) return;
    const recent = JSON.parse(localStorage.getItem('aa-recent') || '[]').filter(
      (id: string) => id !== game.id
    );
    localStorage.setItem('aa-recent', JSON.stringify([game.id, ...recent].slice(0, 12)));
    if (firebaseReady && db) {
      updateDoc(doc(db, 'games', game.id), { playCount: increment(1) }).catch(() => {});
    } else {
      const stored = getGames();
      const index = stored.findIndex((entry) => entry.id === game.id);
      if (index >= 0) {
        stored[index].playCount += 1;
        saveGames(stored);
      }
    }
  }, [game?.id]);

  if (!game || !game.published) return <NotFound />;

  const share = () => navigator.clipboard?.writeText(location.href);

  return (
    <main className="wrap page-pad game-detail">
      <div className="crumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/games">Games</Link>
        <ChevronRight size={14} />
        <span>{game.title}</span>
      </div>
      <div className="game-detail-head">
        <div>
          <span className="eyebrow">
            <i />
            {game.category}
          </span>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
        </div>
        <div className="detail-actions">
          {game.gameUrl && (
            <button type="button" className="btn primary" onClick={() => openGame(game)}>
              <Play fill="currentColor" size={16} /> PLAY NOW
            </button>
          )}
          <button className="btn secondary" onClick={share}>
            <Share2 size={16} /> Share game
          </button>
        </div>
      </div>
      <div className="player-shell">
        <div className="player-top">
          <span>
            <i /> GAME WINDOW
          </span>
          <div>
            {game.gameUrl && (
              <a href={game.gameUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> Open externally
              </a>
            )}
            <button
              onClick={() => {
                const element = document.getElementById('game-frame');
                if (element?.requestFullscreen) element.requestFullscreen();
              }}
            >
              <Maximize size={15} /> Fullscreen
            </button>
          </div>
        </div>
        <div className="player-area" id="game-frame">
          {game.gameUrl ? (
            <>
              <iframe
                title={game.title}
                src={game.gameUrl}
                loading="lazy"
                allow="fullscreen; autoplay; gamepad"
                onLoad={() => setLoaded(true)}
              />
              {!loaded && <div className="player-loading">Loading game…</div>}
            </>
          ) : (
            <div className="not-connected">
              <div className="not-connected-icon">
                <Gamepad2 size={38} />
              </div>
              <h3>Game file not connected yet</h3>
              <p>
                This is a game listing, not a playable file. The owner needs to add a valid hosted
                game URL in the admin dashboard.
              </p>
              <Link to="/contact" className="text-link">
                Know a game to add? Contact us <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="game-meta-grid">
        <section className="info-panel">
          <h3>How to play</h3>
          <p>{game.instructions}</p>
        </section>
        <section className="info-panel">
          <h3>Controls</h3>
          <p>{game.controls}</p>
        </section>
      </div>
      <div className="detail-bottom">
        <span>
          <Clock3 size={15} /> Added {new Date(game.createdAt).toLocaleDateString()}
        </span>
        <span>
          <Play size={15} /> {game.playCount} recorded plays
        </span>
      </div>
    </main>
  );
}

function Admin() {
  const { games, update } = useLibrary();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Game | null>(null);

  useEffect(() => {
    if (auth) return onAuthStateChanged(auth, setUser);
  }, []);

  const seeded = useRef(false);
  useEffect(() => {
    if (!user || !firebaseReady || !db || seeded.current) return;
    seeded.current = true;
    const database = db;
    (async () => {
      const snapshot = await getDocs(collection(database, 'games'));
      if (!snapshot.empty) return;
      await Promise.all(starterGames.map((game) => setDoc(doc(database, 'games', game.id), game)));
    })().catch(() => {});
  }, [user]);

  const blank: Game = {
    id: crypto.randomUUID(),
    title: '',
    slug: '',
    description: '',
    category: 'Meme Games',
    thumbnail: '',
    gameUrl: '',
    gameType: 'iframe',
    instructions: '',
    controls: '',
    published: false,
    featured: false,
    createdAt: new Date().toISOString().slice(0, 10),
    playCount: 0,
    seoTitle: '',
    seoDescription: '',
  };
  const [form, setForm] = useState<Game>(blank);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (!auth) throw new Error('Firebase is not configured. Add your Firebase environment variables first.');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (authError: any) {
      setError(authError.message);
    }
  };

  const persist = async (game: Game) => {
    if (game.gameUrl) {
      try {
        const url = new URL(game.gameUrl);
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error();
      } catch {
        setError('Enter a valid http(s) game URL, or leave it blank until a game is hosted.');
        return;
      }
    }
    const next = games.some((entry) => entry.id === game.id)
      ? games.map((entry) => (entry.id === game.id ? game : entry))
      : [...games, game];
    update(next);
    if (firebaseReady && db) await setDoc(doc(db, 'games', game.id), game);
    setEditing(null);
    setForm(blank);
  };

  if (!user) {
    return (
      <main className="wrap page-pad admin-page">
        <div className="admin-login">
          <div className="admin-icon">
            <Shield />
          </div>
          <span className="eyebrow">OWNER ACCESS</span>
          <h1>
            ADMIN <span className="gradient-text">GATE.</span>
          </h1>
          <p>Sign in with the Firebase owner account. Public registration is disabled.</p>
          <form onSubmit={login}>
            <label>
              Email
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button className="btn primary full">
              Sign in <LogIn size={16} />
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {!firebaseReady && (
            <p className="setup-note">
              Firebase isn't configured yet. Create a Firebase project, copy .env.example to .env and
              add your web app credentials.
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="wrap page-pad admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">CONTROL ROOM</span>
          <h1>
            GAME <span className="gradient-text">MANAGER.</span>
          </h1>
        </div>
        <button className="btn secondary" onClick={() => signOut(auth!)}>
          Sign out
        </button>
      </div>
      <div className="admin-stats">
        <div>
          <b>{games.length}</b>
          <span>Total listings</span>
        </div>
        <div>
          <b>{games.filter((game) => game.published).length}</b>
          <span>Published</span>
        </div>
        <div>
          <b>{games.reduce((sum, game) => sum + game.playCount, 0)}</b>
          <span>Recorded plays</span>
        </div>
      </div>
      <div className="admin-editor">
        <h2>{editing ? 'Edit game' : 'Add a game'}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            persist(form);
          }}
          className="admin-form"
        >
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                  slug: event.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, ''),
                })
              }
            />
          </label>
          <label>
            Slug
            <input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.slice(1).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Thumbnail URL
            <input
              value={form.thumbnail}
              onChange={(event) => setForm({ ...form, thumbnail: event.target.value })}
              placeholder="https://…"
            />
          </label>
          <label className="wide">
            Description
            <textarea
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <label className="wide">
            Hosted game URL
            <input
              value={form.gameUrl}
              onChange={(event) => setForm({ ...form, gameUrl: event.target.value })}
              placeholder="https://… or /games/my-game/index.html"
            />
          </label>
          <label>
            Instructions
            <textarea
              value={form.instructions}
              onChange={(event) => setForm({ ...form, instructions: event.target.value })}
            />
          </label>
          <label>
            Controls
            <textarea
              value={form.controls}
              onChange={(event) => setForm({ ...form, controls: event.target.value })}
            />
          </label>
          <label>
            SEO title
            <input value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
          </label>
          <label>
            SEO description
            <input
              value={form.seoDescription}
              onChange={(event) => setForm({ ...form, seoDescription: event.target.value })}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => setForm({ ...form, published: event.target.checked })}
            />{' '}
            Published
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm({ ...form, featured: event.target.checked })}
            />{' '}
            Featured
          </label>
          <div className="wide form-actions">
            <button className="btn primary">
              {editing ? 'Save changes' : 'Add game'} <Plus size={16} />
            </button>
            {editing && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setEditing(null);
                  setForm(blank);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="admin-list">
        <h2>Existing games</h2>
        {games.map((game) => (
          <div className="admin-row" key={game.id}>
            <img src={game.thumbnail} alt="" />
            <div>
              <b>{game.title}</b>
              <small>
                {game.slug} · {game.playCount} plays · {game.published ? 'Published' : 'Draft'}
              </small>
            </div>
            <button
              onClick={() => {
                setEditing(game);
                setForm(game);
              }}
              aria-label="Edit"
            >
              <Edit3 size={17} />
            </button>
            <button
              className="danger"
              onClick={async () => {
                if (confirm('Delete this game?')) {
                  update(games.filter((entry) => entry.id !== game.id));
                  if (firebaseReady && db) await deleteDoc(doc(db, 'games', game.id));
                }
              }}
              aria-label="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function Legal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="wrap page-pad legal">
      <span className="eyebrow">AHMED ARCADE</span>
      <h1>{title}</h1>
      {children}
    </main>
  );
}

function NotFound() {
  return (
    <main className="wrap page-pad not-found">
      <span className="eyebrow">404 / LOST IN THE ARCADE</span>
      <h1>
        THIS LEVEL <span className="gradient-text">DOESN'T EXIST.</span>
      </h1>
      <p>Looks like this page wandered off. Let's get you back in the game.</p>
      <Link to="/" className="btn primary">
        Back to home <ArrowUpRight size={16} />
      </Link>
    </main>
  );
}

export default function App() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const openGame = useCallback((game: Game) => {
    if (game.gameUrl) setActiveGame(game);
  }, []);
  const closeGame = useCallback(() => setActiveGame(null), []);
  const modalValue = useMemo(
    () => ({ activeGame, openGame, closeGame }),
    [activeGame, openGame, closeGame]
  );

  return (
    <GameModalContext.Provider value={modalValue}>
      <div className="top-ad">
        <div className="wrap">
          <AdsterraAd placement="header" />
        </div>
      </div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:slug" element={<GamePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/about"
          element={
            <Legal title="ABOUT THE ARCADE">
              <p>
                Ahmed Arcade is an independent browser-gaming destination for meme culture, desi
                humour and quick casual fun. We are not affiliated with any celebrity, film studio
                or third-party game publisher. Parody concepts are presented for entertainment.
              </p>
            </Legal>
          }
        />
        <Route
          path="/contact"
          element={
            <Legal title="CONTACT US">
              <p>
                For game submissions, copyright concerns, feedback or general questions, email the
                owner directly. We usually reply within a couple of days.
              </p>
              <a className="contact-mail" href="mailto:ahmedalisohu3@gmail.com">
                ahmedalisohu3@gmail.com <ArrowUpRight size={16} />
              </a>
            </Legal>
          }
        />
        <Route
          path="/privacy"
          element={
            <Legal title="PRIVACY POLICY">
              <p>
                This starter site stores guest favourites and recently played game IDs in your
                browser's local storage. If Firebase is configured, game catalogue and play-count
                data may be stored in Firestore and owner sign-in is handled by Firebase
                Authentication. Configure analytics, cookies, retention, contact details and
                applicable jurisdiction before publishing this policy.
              </p>
            </Legal>
          }
        />
        <Route
          path="/terms"
          element={
            <Legal title="TERMS & CONDITIONS">
              <p>
                Use the site lawfully and respectfully. Game availability depends on third-party
                hosted content. Do not upload content you do not own or have permission to
                distribute. The site is provided as-is; review and customize these terms with your
                own business details before launch.
              </p>
            </Legal>
          }
        />
        <Route
          path="/dmca"
          element={
            <Legal title="COPYRIGHT & DMCA">
              <p>
                Ahmed Arcade respects intellectual property. If you believe material hosted or
                linked here infringes your copyright, send the exact URL, a description of the
                copyrighted work, your contact details and a good-faith statement to{' '}
                <a className="inline-link" href="mailto:ahmedalisohu3@gmail.com">
                  ahmedalisohu3@gmail.com
                </a>
                .
              </p>
            </Legal>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <GameOverlayModal game={activeGame} onClose={closeGame} />
    </GameModalContext.Provider>
  );
}
