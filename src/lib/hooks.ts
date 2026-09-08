"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

/* ------------------------------------------------------------------ */
/* Mount detection                                                     */
/* ------------------------------------------------------------------ */

const subscribeToNothing = () => () => {};

/** `false` pendant le rendu serveur / la première passe, `true` après hydratation. */
export function useMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Media queries                                                       */
/* ------------------------------------------------------------------ */

// Un seul MediaQueryList natif par requête : `getSnapshot` est appelé très
// souvent par React, il ne doit surtout pas allouer un nouvel objet à
// chaque appel (c'était le cas avant : `window.matchMedia(query).matches`).
const mqlCache = new Map<string, MediaQueryList>();

function getMediaQueryList(query: string): MediaQueryList {
  let mql = mqlCache.get(query);
  if (!mql) {
    mql = window.matchMedia(query);
    mqlCache.set(query, mql);
  }
  return mql;
}

type MediaQueryFns = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

const fnsCache = new Map<string, MediaQueryFns>();

function getMediaQueryFns(query: string): MediaQueryFns {
  let fns = fnsCache.get(query);
  if (!fns) {
    fns = {
      subscribe: (onStoreChange) => {
        const mql = getMediaQueryList(query);
        mql.addEventListener("change", onStoreChange);
        return () => mql.removeEventListener("change", onStoreChange);
      },
      getSnapshot: () => getMediaQueryList(query).matches,
    };
    fnsCache.set(query, fns);
  }
  return fns;
}

function useMediaQuery(query: string) {
  const { subscribe, getSnapshot } = getMediaQueryFns(query);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

/**
 * Détecte les écrans tactiles (smartphones, tablettes).
 */
export function useIsTouchDevice() {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}

/**
 * `true` quand les animations décoratives sont pertinentes :
 * pointeur précis, mouvement autorisé, viewport desktop.
 */
export function useRichMotion() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  
  // Désactive les animations lourdes sur mobile et écrans tactiles pour les performances
  return fine && !reduced && !isMobile && !isTouch;
}

/* ------------------------------------------------------------------ */
/* Intersection observer partagé                                       */
/* ------------------------------------------------------------------ */

type ObserverEntry = {
  io: IntersectionObserver;
  callbacks: Map<Element, () => void>;
};

// Avant : un IntersectionObserver par composant `Reveal` (des dizaines sur
// la home). Maintenant : un seul observer partagé par couple
// (threshold, rootMargin).
const observerRegistry = new Map<string, ObserverEntry>();

function getSharedObserver(threshold: number, rootMargin: string): ObserverEntry {
  const key = `${threshold}|${rootMargin}`;
  let entry = observerRegistry.get(key);
  if (!entry) {
    const callbacks = new Map<Element, () => void>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const observed of entries) {
          if (observed.isIntersecting) callbacks.get(observed.target)?.();
        }
      },
      { threshold, rootMargin },
    );
    entry = { io, callbacks };
    observerRegistry.set(key, entry);
  }
  return entry;
}

/**
 * Passe à `true` la première fois que l'élément entre dans le viewport,
 * puis arrête de l'observer (animation d'entrée jouée une seule fois).
 */
export function useInView<T extends Element>(options?: {
  threshold?: number;
  rootMargin?: string;
}): { ref: RefObject<T | null>; inView: boolean } {
  const threshold = options?.threshold ?? 0.14;
  const rootMargin = options?.rootMargin ?? "0px 0px -8% 0px";
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    // Navigateur sans IntersectionObserver : on affiche au tick suivant
    // (jamais de setState synchrone dans le corps d'un effet).
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(id);
    }

    const { io, callbacks } = getSharedObserver(threshold, rootMargin);
    const reveal = () => {
      setInView(true);
      io.unobserve(el);
      callbacks.delete(el);
    };

    callbacks.set(el, reveal);
    io.observe(el);

    return () => {
      io.unobserve(el);
      callbacks.delete(el);
    };
  }, [threshold, rootMargin, inView]);

  return { ref, inView };
}
