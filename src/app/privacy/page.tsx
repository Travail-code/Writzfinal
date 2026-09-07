import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";
import { DISCORD_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy policy for Writz Hub: no accounts, no cookies, no tracking, no analytics. What the server logs and what third-party key pages may collect.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title="Privacy policy"
      updatedAt="2026-09-07"
      intro={`Short version: ${SITE_NAME} has no accounts, sets no cookies, and runs no analytics or tracking scripts. Here is the long version.`}
    >
      <LegalSection title="1. What we do NOT collect">
        <ul className="ml-4 list-disc space-y-1.5">
          <li>No user accounts, no sign-up, no password.</li>
          <li>No cookies — the site sets none, first-party or third-party.</li>
          <li>No analytics, no tracking pixel, no advertising network.</li>
          <li>No fingerprinting, no cross-site profiling.</li>
          <li>No email address, no name, no payment information.</li>
        </ul>
        <p>
          The site is fully static: your browser downloads pages and nothing is
          sent back to us as you browse.
        </p>
      </LegalSection>

      <LegalSection title="2. Server logs">
        <p>
          The site is hosted on Vercel. Like any web host, their infrastructure
          records technical request logs — IP address, timestamp, requested URL,
          user agent — for security, abuse prevention and debugging. These logs
          are generated and retained by the host, not by us, and we do not use
          them to build any profile.
        </p>
        <p>
          See{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer noopener"
            className="text-fg underline-offset-4 hover:underline"
          >
            Vercel&rsquo;s privacy policy
          </a>{" "}
          for details.
        </p>
      </LegalSection>

      <LegalSection title="3. Fonts and external resources">
        <p>
          Fonts are self-hosted and served from our own domain: no request is
          made to Google Fonts or any other third-party CDN while you browse the
          site. No external resource can therefore observe your visit.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party key pages">
        <p>
          When you click &ldquo;Get Key&rdquo;, you leave this website and land on a
          third-party provider. Those services{" "}
          <strong className="text-fg">do</strong> typically use cookies, advertising
          and device identifiers. Their practices are governed by their own privacy
          policy, which we neither control nor endorse.
        </p>
        <p>
          Never enter a password, a payment method or personal data on such a page.
        </p>
      </LegalSection>

      <LegalSection title="5. Data we store about you">
        <p>
          <strong className="text-fg">None.</strong> There is no database, no user
          record and no persistent identifier associated with your visit. Nothing is
          stored in your browser&rsquo;s localStorage or sessionStorage.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p>
          Under the GDPR and similar regulations you have the right to access,
          correct, delete and port your personal data, and to object to its
          processing. Since we hold no personal data about you, there is in practice
          nothing to access or erase — but you can still contact us with any
          question.
        </p>
        <p>
          Contact:{" "}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-fg underline-offset-4 hover:underline"
          >
            our Discord server
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Children">
        <p>
          We do not knowingly collect data from anyone, including children. See our{" "}
          <Link href="/legal" className="text-fg underline-offset-4 hover:underline">
            age requirement
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Changes">
        <p>
          If this policy changes, the &ldquo;last updated&rdquo; date at the top of
          the page changes with it.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
