// ============================================================
// LISTE DES JEUX — c'est ICI que tu changes les liens de clés.
// Remplace chaque "https://example.com/..." par ton vrai lien.
// ============================================================

export type Game = {
  slug: string;
  name: string;
  tag: string;
  keyUrl: string;
};

export const GAMES: Game[] = [
  {
    slug: "bloxfruits",
    name: "Blox Fruits",
    tag: "Auto Farm · Devil Fruits",
    keyUrl: "https://example.com/key-bloxfruits",
  },
  {
    slug: "petsimulator",
    name: "Pet Simulator 99",
    tag: "Auto Hatch · Auto Farm",
    keyUrl: "https://example.com/key-petsimulator",
  },
  {
    slug: "dahood",
    name: "Da Hood",
    tag: "Aimbot · ESP",
    keyUrl: "https://example.com/key-dahood",
  },
  {
    slug: "brookhaven",
    name: "Brookhaven RP",
    tag: "Premium · Tools",
    keyUrl: "https://example.com/key-brookhaven",
  },
  {
    slug: "arsenal",
    name: "Arsenal",
    tag: "Aimbot · Hitbox",
    keyUrl: "https://example.com/key-arsenal",
  },
  {
    slug: "towerofhell",
    name: "Tower of Hell",
    tag: "Auto Win · Speed",
    keyUrl: "https://example.com/key-towerofhell",
  },
  {
    slug: "mm2",
    name: "Murder Mystery 2",
    tag: "ESP · God Mode",
    keyUrl: "https://example.com/key-mm2",
  },
  {
    slug: "bladeball",
    name: "Blade Ball",
    tag: "Auto Parry",
    keyUrl: "https://example.com/key-bladeball",
  },
  {
    slug: "kinglegacy",
    name: "King Legacy",
    tag: "Auto Farm · Fruits",
    keyUrl: "https://example.com/key-kinglegacy",
  },
  {
    slug: "animedefenders",
    name: "Anime Defenders",
    tag: "Auto Farm · Auto Boss",
    keyUrl: "https://example.com/key-animedefenders",
  },
  {
    slug: "fruitbattlegrounds",
    name: "Fruit Battlegrounds",
    tag: "Auto Farm · Auto Spin",
    keyUrl: "https://example.com/key-fruitbattlegrounds",
  },
  {
    slug: "strongestbattlegrounds",
    name: "The Strongest Battlegrounds",
    tag: "Combat · Moves",
    keyUrl: "https://example.com/key-strongestbattlegrounds",
  },
];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}
