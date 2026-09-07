<div align="center">

# Writz Hub

**Landing page, key explorer and Lua loader for the Writz Hub Roblox script hub.**

Built with Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript

</div>

---

> [!IMPORTANT]
> Writz Hub is an independent, community-made project provided **for educational
> purposes only**. It is **not affiliated with, endorsed by, or sponsored by
> Roblox Corporation**. See [`/legal`](src/app/legal/page.tsx) for the full
> disclaimer.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | lint + typecheck + build (what CI runs) |

Requires **Node.js 20.9+**. No environment variables and no database are needed —
the site is fully static.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              Root layout, fonts, metadata
│   ├── page.tsx                Landing page (static)
│   ├── error.tsx               Error boundary
│   ├── global-error.tsx        Root layout error boundary
│   ├── not-found.tsx           404
│   ├── icon.svg                Favicon
│   ├── apple-icon.tsx          iOS icon (generated)
│   ├── opengraph-image.tsx     Social preview (generated)
│   ├── manifest.ts             PWA manifest
│   ├── robots.ts               robots.txt
│   ├── sitemap.ts              sitemap.xml
│   ├── api/health/             Uptime probe
│   ├── key/                    Key explorer + one page per game
│   ├── legal/  privacy/        Disclaimer & privacy policy
│   └── status/                 Service status
│
├── components/
│   ├── brand/                  Inline logo & wordmark
│   ├── keys/                   Key explorer UI
│   ├── landing/                Landing page sections
│   └── legal/                  Shared shell for legal pages
│
└── lib/
    ├── site.ts                 ⭐ Domain, socials, loadstring
    ├── games.ts                ⭐ Game list & key URLs
    ├── hub-meta.ts             Version, services, changelog
    ├── hooks.ts                Media queries, in-view observer
    ├── clipboard.ts            Copy-to-clipboard with fallbacks
    ├── game-style.ts           Per-game accent colours
    ├── utils.ts                `cn()` class merger
    └── (fonts live in src/fonts/, vendored .woff2)

public/
└── loader.lua                  The Lua executor served to clients
```

---

## Configuration

Almost everything you'll want to change lives in two files.

### `src/lib/site.ts` — domain, socials, loadstring

```ts
export const SITE_URL = "https://writzzzzzz.vercel.app";
export const DISCORD_URL = "https://discord.gg/writzhub";
export const GITHUB_URL = "https://github.com/writzhub";
```

`LOADER_URL` and `LOADSTRING` are derived from `SITE_URL`, so changing the domain
updates the loadstring, the sitemap, `robots.txt` and every canonical URL at once.

### `src/lib/games.ts` — the game list

```ts
{
  slug: "bloxfruits",                 // URL → /key/bloxfruits
  name: "Blox Fruits",                // Displayed name
  tag: "Auto Farm · Devil Fruits",    // Features, separated by "·"
  keyUrl: "https://…",                // ⚠️ Your real key link
}
```

Adding an entry automatically creates its page, its sitemap entry, its search
filter and its accent colour (derived from the slug hash).

> [!WARNING]
> The `keyUrl` values shipped in this repo are **placeholders**
> (`https://example.com/…`). Replace them with your real key links before
> deploying.

---

## The Lua loader

`public/loader.lua` is served at `/loader.lua` as `text/plain` and is what the
website's loadstring fetches:

```lua
loadstring(game:HttpGet("https://writzzzzzz.vercel.app/loader.lua"))()
```

> [!WARNING]
> `HUB_URL` inside `loader.lua` currently points at `loader.lua` itself, so the
> "Load Hub" button re-executes the loader instead of loading a hub. Split the
> loader (the executor UI) from the hub (the per-game scripts) and point
> `HUB_URL` at the latter.

---

## Design system

Tokens are declared in `src/app/globals.css` under `@theme` (Tailwind 4):

| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-fg` | `#f4f4f5` | Primary text |
| `--color-muted` | `#a8a8b3` | Secondary text |
| `--color-faint` | `#8b8b96` | Tertiary text (WCAG AA ≥ 4.5:1) |
| `--font-display` | Syne | Headings |
| `--font-sans` | IBM Plex Sans | Body |
| `--font-mono` | IBM Plex Mono | Code, labels |

Fonts are self-hosted: the `.woff2` files live in `src/fonts/` and are wired up
with `next/font/local`. This means **no third-party request at runtime** *and*
**no network dependency at build time** (unlike `next/font/google`, which would
fail the build if Google Fonts is unreachable).

Every decorative animation is disabled under `prefers-reduced-motion: reduce`,
and heavy effects (canvas particles, custom cursor, 3D tilt) are skipped on
touch devices and coarse pointers via the `useRichMotion()` hook.

---

## Security

Security headers are set in `next.config.ts` for every route:

- **Content-Security-Policy** — relaxed in development only (Turbopack HMR needs
  `unsafe-eval` and a websocket)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (2 years, preload)
- `Cross-Origin-Opener-Policy: same-origin`
- `Permissions-Policy` — camera, mic, geolocation, payment, USB all denied
- `poweredByHeader: false`

`frame-ancestors` / `X-Frame-Options` are intentionally **not** set so the app can
be embedded in the preview platform's iframe. Add them back for a hardened
production deployment.

---

## Deployment

The project deploys to Vercel with zero configuration: no environment variables,
no database, no runtime secrets.

```bash
npm run check    # run this before pushing
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every push and
pull request.

---

## License

[MIT](LICENSE) — see [`/legal`](src/app/legal/page.tsx) for the usage disclaimer.
