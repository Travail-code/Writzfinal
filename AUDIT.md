# Audit complet — Writz Hub

> Rapport de lecture du projet. **Aucun fichier de code n'a été modifié.**
> Date : 2026-09-07 · Branche : `arena/01a07bbb-writzfinal`

---

## 0. État de santé actuel

| Vérification | Résultat |
|---|---|
| `npx tsc --noEmit` | ✅ 0 erreur |
| `npx eslint .` | ⚠️ 0 erreur, 1 warning (`no-page-custom-font` dans `layout.tsx`) |
| `npm run build` | ✅ Compile en ~8s, 17 pages générées |
| Taille du code | ~3 900 lignes (src + public) |

**La base technique est saine.** Le code est propre, bien commenté, typé strict, avec de vraies attentions rares (`prefers-reduced-motion`, fallback clipboard, rate-limit, cleanup des `rAF`/listeners). Les problèmes sont surtout : **du contenu placeholder**, **une logique métier absente**, et **des manques d'infra**.

Stack : Next.js 16.3.4 (App Router + Turbopack) · React 19.2 · Tailwind CSS 4 · TypeScript 5.9 · lucide-react.

---

## 1. 🔴 BLOQUANTS — le site ne « fonctionne » pas vraiment

### 1.1 Tous les liens de clés sont des faux liens
`src/lib/games.ts` — les **12 jeux** pointent vers `https://example.com/key-xxx`.

Le bouton « Get Key » sur `/key/bloxfruits`, `/key/dahood`, etc. envoie l'utilisateur sur une page morte. C'est le cœur du produit et il est non fonctionnel.

➡️ À faire : remplacer par tes vrais liens (Linkvertise / Lootlabs / Work.ink / ton propre système).

### 1.2 `loader.lua` boucle sur lui-même
`public/loader.lua` ligne 13 :
```lua
local HUB_URL = "https://writzzzzzz.vercel.app/loader.lua"
```
Or le loadstring affiché sur le site (`src/components/landing/download.ts`) est :
```lua
loadstring(game:HttpGet("https://writzzzzzz.vercel.app/loader.lua"))()
```
→ **C'est la même URL.** Le bouton « Load Hub » télécharge et exécute… le loader lui-même. Il détruit son propre GUI et le recrée. **Il ne charge jamais de hub.**

De plus, le loader :
- ne connaît **aucun** des 12 jeux de `games.ts` ;
- n'a **aucune** vérification de clé, alors que tout le site parle de « key system, one key per device, valid 24h » ;
- n'a aucune détection de `game.PlaceId` pour charger le bon script.

➡️ À faire : séparer `loader.lua` (l'exécuteur/injecteur) de `hub.lua` (le vrai hub avec les scripts par jeu), et faire pointer `HUB_URL` sur `hub.lua`.

### 1.3 Le compteur de copies est cassé en production
`src/lib/copy-store.ts` écrit dans `/tmp/writz-hub-copies.json`.

Sur Vercel (serverless), `/tmp` est :
- **éphémère** (effacé à chaque cold start),
- **non partagé** entre les instances lambda.

→ Le compteur va **descendre**, **remonter**, afficher des valeurs différentes selon le visiteur. Idem pour le rate-limit (`Map` en mémoire, réinitialisée à chaque instance).

➡️ À faire : Vercel KV / Upstash Redis (gratuit) ou Neon Postgres. Ironiquement le `package.json` s'appelle encore `nextjs-postgresql-template`.

### 1.4 Le compteur peut être gonflé/vidé trivialement
`src/app/api/copy/route.ts` : `POST` sans body, sans vérification d'`Origin`, sans token.
```bash
for i in $(seq 1 1000); do curl -X POST https://.../api/copy; done
```
Le rate-limit est de 5/10s **par IP**, contournable avec un proxy ou un `X-Forwarded-For` forgé (l'en-tête est lu tel quel).

➡️ À faire : vérifier l'`Origin`/`Referer`, utiliser l'IP fournie par la plateforme, et durcir la fenêtre.

---

## 2. 🟠 IMPORTANT — crédibilité & contenu

### 2.1 Fautes d'anglais visibles en page d'accueil
`src/components/landing/features.tsx` :

| Actuel | Problème |
|---|---|
| « Keyless bug only for the hub after you can found game have key system but not all. » | Incompréhensible |
| « Fast hub, 0 lag, we update that » | Bancal |
| « We use our library system work on every game » | Grammaire |
| « Dark panel, classic theme, Small UI and rly cool » | « rly » = SMS |

`src/lib/hub-meta.ts` : « Every exec **suport** » → *support*.
`src/components/landing/stats.tsx` : label « execution » en minuscule alors que les 3 autres sont capitalisés (`Users`, `Scripts`, `Executors`).

➡️ C'est ce que voit un visiteur dans les 5 premières secondes. À réécrire en priorité.

### 2.2 Liens sociaux morts
`src/components/landing/footer.tsx` :
- `https://discord.gg/writzhub`
- `https://github.com/writzhub`

Probablement inexistants. Un lien Discord mort = zéro communauté et zéro confiance.

### 2.3 Chiffres inventés
`stats.tsx` : `17 526 Users`, `158 Scripts`, `1.0M execution`, `12 Executors`.
Le hub ne contient aucun script pour l'instant → « 158 Scripts » est un mensonge vérifiable.

➡️ Soit les brancher sur du réel (le compteur de copies existe déjà !), soit les baisser à des valeurs honnêtes.

### 2.4 La page `/status` est purement décorative
`src/app/status/page.tsx` affiche « All systems operational » et « Updated just now » **en dur** depuis `SERVICES` dans `hub-meta.ts`. Si le site tombe, la page status dira quand même que tout va bien.

Et `src/app/api/health/route.ts` (`{ ok: true }`) **n'est appelé nulle part**.

➡️ À faire : faire fetch `/api/health` + un ping du CDN, et afficher un vrai timestamp.

---

## 3. 🟡 PERFORMANCE

### 3.1 La home est en `force-dynamic` pour rien
`src/app/page.tsx` :
```ts
export const dynamic = "force-dynamic";
```
→ Aucune mise en cache CDN, SSR à **chaque** requête, juste pour afficher un compteur… que `hero.tsx` **re-fetch quand même côté client** (`useEffect` → `fetch("/api/copy")`).

C'est du travail fait deux fois, et ça coûte tout le bénéfice du static. Sortir le `force-dynamic` ferait passer `/` de `ƒ (Dynamic)` à `○ (Static)`.

### 3.2 Google Fonts en `<link>` (le warning ESLint)
`src/app/layout.tsx` charge 3 familles (Syne, IBM Plex Sans, IBM Plex Mono) via `<link>` runtime → +2 connexions externes, FOUT/CLS, et dépendance réseau tierce.

➡️ `next/font/google` fait de l'auto-hosting, du preload et du `size-adjust` (zéro CLS). Bonus : ça permettrait de retirer `fonts.googleapis.com` du CSP.

### 3.3 `useMediaQuery` recrée un `MediaQueryList` à chaque snapshot
`src/components/landing/hooks.ts` :
```ts
getSnapshot: () => window.matchMedia(query).matches
```
`getSnapshot` est appelé très souvent par React. Chaque appel crée un nouvel objet natif. Il faudrait mémoriser le `MediaQueryList` une fois par query.

### 3.4 Beaucoup d'`IntersectionObserver`
`Reveal` / `WordReveal` créent **un observer par instance** (il y en a des dizaines sur la home). Un observer partagé unique serait plus léger.

### 3.5 3 boucles d'animation simultanées sur desktop
`ambient-bg` (canvas 72 particules + rAF), `custom-cursor` (rAF), `hub-mockup` (listener scroll). Le canvas se coupe bien sur `visibilitychange` 👍, mais le curseur non. Sur laptop c'est de la batterie.

### 3.6 `<Image unoptimized>` sur des SVG
`nav.tsx`, `footer.tsx`, `hero.tsx` utilisent `next/image` avec `unoptimized` sur `/logo.svg`. Autant inliner le SVG (0 requête) ou utiliser un `<img>` — `next/image` n'apporte rien ici.

---

## 4. 🟢 ACCESSIBILITÉ

### 4.1 Contraste insuffisant
`--color-faint: #71717a` sur `--color-bg: #0a0a0a` ≈ **3.9:1**.
WCAG AA demande **4.5:1** pour du texte < 18px — et cette couleur est utilisée partout en 10–11px (`text-[10px] text-faint`). ➡️ Monter vers `#8a8a93` minimum.

### 4.2 Le curseur custom cache le vrai curseur
`globals.css` : `html.has-custom-cursor * { cursor: none !important; }`
→ Plus de curseur texte (`I-beam`) dans les champs, plus de `pointer` sur les liens. Pour un utilisateur avec des troubles moteurs ou visuels, c'est pénalisant. Prévoir un moyen de le désactiver.

### 4.3 Le skip-link saute le contenu principal
`landing-page.tsx` : le lien « Skip to content » pointe sur `#features`, ce qui **saute le hero entier** (donc le bouton Copy, qui est l'action principale). Il devrait viser `<main>`.

### 4.4 Menu mobile incomplet
`nav.tsx` : pas de focus-trap, pas de fermeture à la touche `Escape`, les liens hors-écran restent focusables quand le menu est fermé (`invisible opacity-0` seulement, pas `inert`).

### 4.5 Boutons décoratifs non annoncés
`hub-mockup.tsx` : le bouton « Execute Auto Farm » et les items de la sidebar sont de vrais `<button>` cliquables qui ne font rien de réel → confusion pour un lecteur d'écran. Ils mériteraient `aria-hidden` ou une mention « aperçu ».

### 4.6 Hiérarchie de titres
Sur `/key/[game]` : `h1` (nom du jeu) → `h2` « Other games » → mais chaque `GameCard` rend aussi un `h2`. Les cartes devraient être en `h3`.

---

## 5. 🔵 SEO & PARTAGE

### 5.1 Aucune image Open Graph
`src/app/layout.tsx` n'a **ni `openGraph` ni `twitter`**. Quand quelqu'un colle le lien sur Discord (= 90 % du trafic pour un script hub), il n'y a **aucune preview**, juste une ligne de texte grise.

➡️ Le plus gros gain marketing du projet pour 20 lignes de code. Next 16 permet même un `opengraph-image.tsx` généré dynamiquement (avec le nom du jeu sur chaque page `/key/[game]` !).

### 5.2 Pas de `title.template`
Chaque page redéfinit manuellement `"… · Writz Hub"`. Un `title: { default: "Writz Hub", template: "%s · Writz Hub" }` éviterait les oublis.

### 5.3 Favicon SVG uniquement
Pas d'`apple-touch-icon.png`, pas de `icon-192/512.png`. Safari iOS et certains crawlers ne lisent pas le SVG.

### 5.4 Pas de `manifest.json`
Pas d'installation PWA / raccourci écran d'accueil.

### 5.5 Pas de JSON-LD
Un schema `SoftwareApplication` + `FAQPage` améliorerait nettement l'affichage Google.

### 5.6 `robots.txt` statique
`public/robots.txt` marche, mais `src/app/robots.ts` resterait synchronisé automatiquement avec le `BASE_URL` de `sitemap.ts` (aujourd'hui l'URL est écrite en dur à **3 endroits** : `layout.tsx`, `sitemap.ts`, `robots.txt`, + 2 fois dans le Lua).

---

## 6. ⚙️ CONFIGURATION & SÉCURITÉ

### 6.1 Le CSP risque de casser le mode dev
`next.config.ts` applique `script-src 'self' 'unsafe-inline'` sur **toutes** les routes, y compris en développement. Turbopack/HMR utilise `eval()` → sans `'unsafe-eval'`, le hot-reload peut être bloqué localement. À conditionner sur `process.env.NODE_ENV`.

### 6.2 `'unsafe-inline'` en script-src
Ça neutralise une bonne partie de la protection XSS du CSP. Next 16 supporte les **nonces** via middleware — c'est la vraie solution.

### 6.3 Manques dans `next.config.ts`
- `poweredByHeader: false` (masquer `X-Powered-By: Next.js`)
- `compress: true` (par défaut, mais explicite = mieux)
- Pas de `X-Frame-Options` — c'est **volontaire et bien commenté** pour la preview 👍, mais en prod il faudrait le remettre.

### 6.4 `package.json`
- Nom encore `nextjs-postgresql-template` (template non renommé)
- Pas de `engines` (version Node)
- Pas de `packageManager` (versions npm/pnpm cohérentes en CI)
- Pas de `version`, pas de `description`

### 6.5 Fichiers manquants à la racine
Aucun **`README.md`**, **`LICENSE`**, **`.env.example`**, **`CONTRIBUTING.md`**.
Un repo GitHub public sans README, c'est le premier réflexe négatif d'un visiteur.

---

## 7. 🧹 QUALITÉ DE CODE & DETTE TECHNIQUE

### 7.1 Logique clipboard dupliquée
`hero.tsx` (`copy()`) et `keys/loadstring-mini.tsx` (`copy()`) implémentent **exactement** la même cascade clipboard API → `execCommand` → sélection manuelle, en ~50 lignes chacun.
➡️ Extraire un hook `useCopyToClipboard()` dans `src/lib/`.

### 7.2 `hero.tsx` fait 394 lignes
C'est le plus gros fichier React du projet et il mélange : animation de scramble du titre, compteur de copies, logique clipboard, système d'onglets, faux terminal, styles CSS inline. ➡️ Découper en `<ExecutorPanel>`, `<CopyCounter>`, `<ScrambleTitle>`.

### 7.3 CSS inline dans un composant
`hero.tsx` termine par un bloc `<style>{...}</style>` (keyframes `fadeSlide`, `spin3d`). Ces règles devraient être dans `globals.css` avec les 700 autres lignes.

### 7.4 `globals.css` fait 723 lignes
Monolithique. Découpable en `base.css` / `animations.css` / `keys.css`.

### 7.5 Deux headers différents
`landing/nav.tsx` et `keys/keys-header.tsx` font le même travail (logo + scroll detection) avec deux implémentations distinctes. Le `keys-header` a même un bug mineur : `group-hover:-translate-x-0.5` sur la flèche alors que le parent n'a pas la classe `group`.

### 7.6 Composants clients sans `"use client"`
11 fichiers (`hero.tsx`, `nav.tsx`, `stats.tsx`, `reveal.tsx`, `custom-cursor.tsx`, `hub-mockup.tsx`…) utilisent des hooks React **sans** la directive. Ça marche uniquement parce que `landing-page.tsx` la porte et propage la frontière. Mais si un jour tu importes `<Stats />` depuis un Server Component → crash au build. ➡️ Ajouter la directive partout où il y a des hooks.

### 7.7 Contenu figé en dur
`hub-mockup.tsx` liste `NAV = ["Home", "Universal", "Blox Fruits", "Pet Sim", "Da Hood"]` — dupliqué manuellement depuis `games.ts`. Si tu ajoutes un jeu, la maquette ne suit pas.

### 7.8 Zéro test, zéro CI
Pas de `vitest`/`playwright`, pas de `.github/workflows/`. Un workflow de 15 lignes (`lint` + `typecheck` + `build`) éviterait de casser la prod.

---

## 8. ⚖️ JURIDIQUE / RISQUE

⚠️ Le projet distribue un **exploit loader Roblox** avec aimbot, ESP, god mode. C'est une violation directe des Roblox Terms of Use.

Risques concrets :
- **GitHub** peut recevoir un DMCA/abuse report de Roblox Corp → repo supprimé
- **Vercel** peut suspendre le déploiement (AUP)
- Le domaine `writzzzzzz.vercel.app` peut être blacklisté par Discord/Chrome Safe Browsing

Il n'y a actuellement **aucun disclaimer, aucune page Terms, aucune Privacy Policy** — alors que le site collecte de l'IP (rate-limit) et qu'il n'y a pas de bannière cookies/RGPD.

➡️ Minimum vital : une page `/legal` avec disclaimer « educational purposes only », et un `/privacy` expliquant le traitement de l'IP.

---

## 9. ➕ CE QUE TU POURRAIS RAJOUTER (features)

**Impact fort / effort faible**
1. **Images Open Graph dynamiques** par jeu — preview Discord magnifique
2. **README + LICENSE** — crédibilité immédiate
3. **Recherche partageable** : mettre `?q=blox` dans l'URL sur `/key` (aujourd'hui le filtre est perdu au refresh)
4. **Bouton « Copier » sur `/key/[game]`** qui copie le loadstring **et** ouvre le lien clé
5. **`error.tsx` + `loading.tsx`** — actuellement une erreur serveur donne l'écran blanc par défaut de Next
6. **FAQ** (« Ça marche sur mobile ? », « C'est un virus ? », « Comment obtenir une clé ? ») — très demandé sur ce type de site, et excellent pour le SEO

**Impact fort / effort moyen**
7. **Vrai hub Lua** avec détection `game.PlaceId` et chargement du script du bon jeu
8. **Système de clés réel** (génération, HWID, expiration 24h) — actuellement tout est du texte
9. **Compteur persistant** (Vercel KV) + stats réelles branchées dessus
10. **Page `/scripts`** listant les fonctionnalités par jeu (aujourd'hui `tag` ne contient que 2 mots)
11. **Widget Discord** live (membres en ligne) dans le footer
12. **Mode clair / sombre** — tout est hardcodé en dark

**Bonus**
13. **i18n FR/EN** (tu es francophone, une partie de ton audience aussi)
14. **Analytics** (Vercel Analytics ou Plausible) — savoir ce que les gens cliquent vraiment
15. **PWA / manifest** — installable sur mobile
16. **Changelog automatisé** depuis les tags Git au lieu de `hub-meta.ts`
17. **Vidéo/GIF de démo** dans la section Showcase à la place de la maquette statique

---

## 10. 🎯 PLAN D'ACTION SUGGÉRÉ

### Sprint 1 — « le site ne ment plus » (1–2 h)
1. Remplacer les 12 `keyUrl` `example.com` → vrais liens
2. Corriger les fautes d'anglais (`features.tsx`, `hub-meta.ts`, `stats.tsx`)
3. Corriger ou retirer les liens Discord/GitHub morts
4. Ajouter `openGraph` + `twitter` dans `layout.tsx` + une image OG
5. Écrire un `README.md`

### Sprint 2 — « ça marche vraiment » (½ journée)
6. Séparer `loader.lua` et `hub.lua`, corriger `HUB_URL`
7. Brancher le compteur sur Vercel KV / Upstash
8. Retirer `force-dynamic` de la home
9. Passer les fonts en `next/font/google`
10. Ajouter `error.tsx` + `loading.tsx`

### Sprint 3 — polish (½ journée)
11. Extraire `useCopyToClipboard`, découper `hero.tsx`
12. Ajouter `"use client"` sur les 11 fichiers concernés
13. Corriger le contraste `--color-faint`, le skip-link, le menu mobile
14. Rendre `/status` réellement dynamique via `/api/health`
15. Ajouter le workflow GitHub Actions (lint + typecheck + build)

### Sprint 4 — croissance
16. FAQ + JSON-LD + OG dynamiques par jeu
17. Vrai système de clés
18. Analytics + page légale

---

## Résumé en une phrase

**Le contenant est excellent, le contenu est vide.** Tu as une vitrine très bien codée (animations soignées, accessibilité partiellement pensée, build propre) posée sur un produit qui n'existe pas encore : les liens de clés sont factices, le loader Lua tourne en rond, les stats sont inventées et le compteur ne persiste pas. La priorité absolue n'est pas de refactorer le code — c'est de **rendre vrai** ce que le site promet.
