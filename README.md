# Ahmed Arcade

Live: https://ahmed-arcade.vercel.app
Repository: https://github.com/ahmedali786166/My-Web

A React + TypeScript + Vite browser-game portal with a dark neon design, an
embedded featured game, catalogue discovery, guest favourites, a Firebase owner
dashboard and Adsterra placements.

## Features

- **Featured game + overlay player** — *Shahenshah Flappy Ops 👑* runs from
  `https://shahenshah-meme-game.vercel.app/` inside a responsive modal with
  fullscreen, reload and close controls.
- **Local games folder** — drop HTML5 games into `public/games/` and point the
  admin dashboard at `/games/<folder>/index.html`.
- **Adsterra slots** — reusable `src/components/AdsterraAd.tsx` injects banner
  scripts safely (sequential injection, cleanup on unmount). Slots render above
  the header, as an in-feed neon card in the game grids, and in the overlay
  footer. Slots stay hidden in production until their env key exists.
- **Firebase** — email/password owner sign-in and Firestore game management.
  When the `games` collection is empty, the starter catalogue is seeded on the
  first successful owner login.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_*` | Firebase web-app config (Auth + Firestore) |
| `VITE_SITE_URL` | Canonical site URL |
| `VITE_ADSTERRA_ENABLED` | Set `false` to disable all ad injection |
| `VITE_ADSTERRA_HOME_BANNER` | Header leaderboard `invoke.js` URL or bare ad key |
| `VITE_ADSTERRA_GAME_BANNER` | In-feed rectangle `invoke.js` URL or bare ad key |
| `VITE_ADSTERRA_MODAL_BANNER` | Game overlay footer strip `invoke.js` URL or bare ad key |

Never commit `.env`.

## Firebase setup

1. Create a Firebase project and register a Web app.
2. Enable **Email/Password** in Authentication and create the owner account in
   the Firebase Console (public sign-up is intentionally absent).
3. Create Firestore.
4. Copy `.env.example` to `.env` and add the web-app values.
5. `firestore.rules` already targets the owner email `ahmedalisohu3@gmail.com`;
   publish it in the Firebase Console.
6. Sign in at `/admin`. If the `games` collection is empty it is seeded with the
   starter catalogue, including the featured game.

For a hardened production setup, move the owner check to Firebase custom claims
instead of the starter email rule.

## Adsterra

The component accepts either a full `https://…/invoke.js` URL or a bare ad key
in each env variable. Only embed ad code you are authorized to use, and review
Adsterra's placement and consent requirements for your region.

## Deployment

The included `vercel.json` builds with Vite and rewrites unknown paths to
`index.html` for client-side routing. Deploy with:

```bash
npx vercel --prod --yes --name ahmed-arcade
```

Set the same environment variables in the Vercel project. Update
`VITE_SITE_URL`, `public/sitemap.xml` and `public/robots.txt` with the final
domain.

## Before production launch

- Replace placeholder thumbnails and legal text with owned/licensed assets.
- Add Adsterra keys and complete a consent/privacy review.
- Consider backend-verified play counts (the UI increments Firestore directly).
- Run browser and device QA on the deployed domain.
