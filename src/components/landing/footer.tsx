import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "#changelog", label: "Changelog" },
  { href: "/key", label: "Keys" },
  { href: "/status", label: "Status" },
  { href: "https://discord.gg/writzhub", label: "Discord", external: true },
  { href: "https://github.com/writzhub", label: "GitHub", external: true },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={32} height={32} className="size-8 rounded-md" unoptimized />
          <div>
            <p className="font-display text-sm font-semibold tracking-tight">Writz Hub</p>
            <p className="font-mono text-[11px] text-faint">script hub · premium runtime</p>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-fg"
              >
                {link.label}
              </a>
            ) : link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-fg"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-fg"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <p className="font-mono text-[11px] text-faint">© 2026 Writz Hub</p>
      </div>
    </footer>
  );
}
