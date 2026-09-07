import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";
import { DISCORD_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal & disclaimer",
  description:
    "Terms of use, disclaimer and DMCA contact for Writz Hub. Independent project, provided for educational purposes, not affiliated with Roblox Corporation.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms & disclaimer"
      updatedAt="2026-09-07"
      intro={`Please read this page before downloading or running anything from ${SITE_NAME}. By using this website or the loader, you accept the terms below.`}
    >
      <LegalSection title="1. No affiliation with Roblox">
        <p>
          {SITE_NAME} is an independent, community-made project. It is{" "}
          <strong className="text-fg">not affiliated with, endorsed by, sponsored by, or
          approved by</strong>{" "}
          Roblox Corporation. &ldquo;Roblox&rdquo; and all related names, logos and game
          titles are trademarks of their respective owners and are used here only
          descriptively, to identify the games a script targets.
        </p>
      </LegalSection>

      <LegalSection title="2. Educational purpose only">
        <p>
          All scripts, loaders and code published here are provided{" "}
          <strong className="text-fg">for educational and research purposes only</strong> —
          to study how Lua runtimes, UI libraries and script loaders work.
        </p>
        <p>
          We do not encourage you to use them on live services. Running third-party
          scripts in an online game is very likely to violate that platform&rsquo;s
          terms of service.
        </p>
      </LegalSection>

      <LegalSection title="3. Use at your own risk">
        <p>Using this software may result in, among other things:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>temporary or permanent suspension of your game account;</li>
          <li>loss of in-game progress, items or currency;</li>
          <li>instability or crashes of the game client.</li>
        </ul>
        <p>
          You are solely and entirely responsible for how you use this software and
          for any consequence that follows.
        </p>
      </LegalSection>

      <LegalSection title="4. No warranty">
        <p>
          The software is provided <strong className="text-fg">&ldquo;as is&rdquo;</strong>,
          without warranty of any kind, express or implied, including but not limited
          to the warranties of merchantability, fitness for a particular purpose and
          non-infringement.
        </p>
        <p>
          In no event shall the authors or copyright holders be liable for any claim,
          damages or other liability, whether in an action of contract, tort or
          otherwise, arising from, out of or in connection with the software or its
          use.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-party key providers">
        <p>
          Some games require a key obtained through a third-party provider. Those
          pages are operated by external companies: they have their own terms,
          their own privacy policies and their own advertising. We do not control
          them and we are not responsible for their content or behaviour.
        </p>
        <p>
          Never enter a password, a payment method or personal information on a key
          page. A legitimate key page never asks for them.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>You agree not to use this website or its content to:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>harass, harm or defraud other players;</li>
          <li>distribute malware, stealers or backdoored builds under our name;</li>
          <li>resell, rebrand or monetise the loader without permission.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Age requirement">
        <p>
          This website is not directed at children. If you are under the age of
          digital consent in your country (13 to 16 depending on jurisdiction), do
          not use this site.
        </p>
      </LegalSection>

      <LegalSection title="8. Takedown & DMCA">
        <p>
          If you are a rights holder and believe that content hosted here infringes
          your rights, contact us and we will review and, where appropriate, remove
          the content promptly. Please include the URL concerned, a description of
          the work, and your contact details.
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

      <LegalSection title="9. Changes to these terms">
        <p>
          We may update this page at any time. The &ldquo;last updated&rdquo; date at
          the top always reflects the current version. Continuing to use the site
          after a change means you accept the new terms.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
