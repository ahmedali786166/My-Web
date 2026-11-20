# Ahmed Arcade

Live: https://ahmedplay.tech
Repository: https://github.com/ahmedali786166/My-Web

A React + TypeScript + Vite browser-game portal with a dark neon design, an
embedded featured game, catalogue discovery, guest favourites and a Firebase
owner dashboard.

## Features

- **Featured game + overlay player** — *Amitabh Bachan Meme Game* runs from
  `https://shahenshah-meme-game.vercel.app/` inside a responsive modal with
  fullscreen, reload and close controls.
- **Local games folder** — drop HTML5 games into `public/games/` and point the
  admin dashboard at `/games/<folder>/index.html`.
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

Never commit `.env`.

## Firebase setup

1. Create a Firebase project and register a Web app.
2. Enable **Email/Password** in Authentication and create the owner account in
   the Firebase Console (public sign-up is intentionally absent).
3. Create Firestore.
4. Copy `.env.example` to `.env` and add the web-app values.
5. `firestore.rules` already targets the owner email `ahmedalisohu3@gmail.com`.
   Publish it in the Firebase Console, or from the CLI after `firebase login`:
   `npx firebase-tools deploy --only firestore:rules` (config is in
   `firebase.json`).
6. Sign in at `/admin`. If the `games` collection is empty it is seeded with the
   starter catalogue, including the featured game.

For a hardened production setup, move the owner check to Firebase custom claims
instead of the starter email rule.

## Ads

All third-party ad code was removed. If you add a new network later, place its
script at the extreme top or bottom of the layout with a clear safe gap from
any game canvas, and never let it overlay gameplay.

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
- Complete an ad consent/privacy review before re-adding any ad network.
- Consider backend-verified play counts (the UI increments Firestore directly).
- Run browser and device QA on the deployed domain.
