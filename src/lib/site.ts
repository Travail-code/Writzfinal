// ============================================================
// CONSTANTES GLOBALES DU SITE
// C'est ICI que tu changes le domaine, les liens sociaux et
// le loadstring. Tout le reste du projet lit ces valeurs.
// ============================================================

/** Domaine officiel du site déployé (sans slash final). */
export const SITE_URL = "https://writzzzzzz.vercel.app";

export const SITE_NAME = "Writz Hub";

export const SITE_DESCRIPTION =
  "Writz Hub — premium script hub for Roblox. One keyless loadstring, compatible with Xeno, Solara, Delta, Wave and more.";

/** Liens externes (change-les pour tes vrais liens). */
export const DISCORD_URL = "https://discord.gg/writzhub";
export const GITHUB_URL = "https://github.com/writzhub";

/** URL du loader Lua servi depuis /public. */
export const LOADER_URL = `${SITE_URL}/loader.lua`;

/** Le loadstring affiché partout sur le site. */
export const LOADSTRING = `loadstring(game:HttpGet("${LOADER_URL}"))()`;

/** Année courante, pour le copyright du footer. */
export const COPYRIGHT_YEAR = new Date().getFullYear();
