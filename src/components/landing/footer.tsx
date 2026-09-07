import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { COPYRIGHT_YEAR, DISCORD_URL, GITHUB_URL } from "@/lib/site";

const PRODUCT_LINKS = [
  { href: "#changelog", label: "Changelog" },
  { href: "/key", label: "Keys" },
  { href: "/status", label: "Status" },
];

const COMMUNITY_LINKS = [
  { href: DISCORD_URL, label: "Discord" },
  { href: GITHUB_URL, label: "GitHub" },
];

const LEGAL_LINKS = [
  { href: "/legal", label: "Legal & disclaimer" },
  { href: "/privacy", label: "Privacy" },
];

const linkClass =
  "text-sm text-muted transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-fg";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex items-start gap-2.5">
            <Logo className="text-fg" />
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">Writz Hub</p>
              <p className="font-mono text-[11px] text-faint">script hub · premium runtime</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-14">
            <FooterColumn title="Product">
              {PRODUCT_LINKS.map((link) =>
                link.href.startsWith("#") ? (
                  <a key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                ),
              )}
            </FooterColumn>

            <FooterColumn title="Community">
              {COMMUNITY_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={linkClass}
                >
                  {link.label}
                </a>
              ))}
            </FooterColumn>

            <FooterColumn title="Legal">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[11px] leading-relaxed text-faint">
            Writz Hub is an independent, community-made project provided for
            educational purposes only. It is not affiliated with, endorsed by,
            or sponsored by Roblox Corporation. Use at your own risk — see our{" "}
            <Link href="/legal" className="text-muted underline-offset-2 hover:underline">
              disclaimer
            </Link>
            .
          </p>
          <p className="shrink-0 font-mono text-[11px] text-faint">
            © {COPYRIGHT_YEAR} Writz Hub
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{title}</p>
      <nav aria-label={title} className="mt-3 flex flex-col gap-2.5">
        {children}
      </nav>
    </div>
  );
}
