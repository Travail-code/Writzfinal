// Visual identity helpers for the /key pages.
// Purely cosmetic: nothing here changes game data or any URL.

export type GameAccent = {
  hue: number;
  color: string;
  soft: string;
  ring: string;
  wash: string;
};

/** Stable pseudo-random hue derived from the slug (same game => same color). */
export function hueFromSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100003;
  }
  return hash % 360;
}

export function accentFor(slug: string): GameAccent {
  const hue = hueFromSlug(slug);
  return {
    hue,
    color: `hsl(${hue} 88% 68%)`,
    soft: `hsl(${hue} 88% 68% / 0.16)`,
    ring: `hsl(${hue} 88% 68% / 0.34)`,
    wash: `hsl(${hue} 88% 68% / 0.07)`,
  };
}

/** Up to two letters used inside the monogram tile. */
export function initialsFor(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** "Auto Farm · Devil Fruits" => ["Auto Farm", "Devil Fruits"] */
export function featuresFromTag(tag: string): string[] {
  return tag
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
}
