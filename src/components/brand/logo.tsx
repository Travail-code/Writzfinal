import { cn } from "@/lib/utils";

/**
 * Logo inline (SVG dans le markup) plutôt qu'un `<Image src="/logo.svg">`.
 * Gain : zéro requête réseau, zéro layout shift, et `next/image` n'apportait
 * rien ici puisqu'il était utilisé en `unoptimized`.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 rounded-md", className)}
    >
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <path
        d="M14 16L22.2 48h5.2L32 26.5 36.6 48H41.8L50 16h-5.4L39.2 40.5 33.2 16h-2.4L24.8 40.5 19.4 16H14z"
        className="fill-bg"
      />
    </svg>
  );
}

/** Logo + wordmark, réutilisé par la nav, le header des clés et le footer. */
export function Wordmark({
  className,
  logoClassName,
}: {
  className?: string;
  logoClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo className={cn("text-fg", logoClassName)} />
      <span className="font-display text-[15px] font-semibold tracking-tight">
        Writz Hub
      </span>
    </span>
  );
}
