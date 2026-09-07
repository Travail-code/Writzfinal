import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

type MediaQueryFns = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

const mediaQueryCache = new Map<string, MediaQueryFns>();

function getMediaQueryFns(query: string): MediaQueryFns {
  let fns = mediaQueryCache.get(query);
  if (!fns) {
    fns = {
      subscribe: (onStoreChange) => {
        const mq = window.matchMedia(query);
        mq.addEventListener("change", onStoreChange);
        return () => mq.removeEventListener("change", onStoreChange);
      },
      getSnapshot: () => window.matchMedia(query).matches,
    };
    mediaQueryCache.set(query, fns);
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
