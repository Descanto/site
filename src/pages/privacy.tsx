import { LegalPage } from "./legal";

export function PrivacyPage() {
  return (
    <LegalPage eyebrow="LEGAL" title="Privacy policy" updated="August 21, 2026">
      <p>
        Descanto ("we", "us") operates Canto, a cloud desktop platform for computer-use agents, at descanto.com and its
        subdomains. This policy explains what we collect, why, and what we never do with it. The short version: we
        collect the minimum needed to run the service and answer your messages, we don't sell data, and the contents of
        your desktops are yours.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account and contact data.</strong> When you request early access, use the contact form, or create an
          account, we collect what you submit: name, email address, and anything you write in the message or use-case
          fields. Early-access signups are also added to our mailing audience so we can tell you when your desktops are
          ready.
        </li>
        <li>
          <strong>Service and billing data.</strong> Operating Canto produces operational records: desktop metadata
          (tier, lifecycle state, timestamps), API request logs, and metering records used for billing. Metering counts
          awake time only.
        </li>
        <li>
          <strong>Website data.</strong> The marketing site sets no tracking cookies and runs no third-party analytics.
          A single localStorage key remembers your light/dark theme choice and never leaves your browser. Our hosting
          provider (Cloudflare) keeps standard edge logs — IP address, user agent, requested URL — for security and
          abuse prevention.
        </li>
      </ul>

      <h2>What we don't do</h2>
      <ul>
        <li>We do not sell or rent personal data to anyone.</li>
        <li>We do not read the contents of your desktops except when required to debug an issue you've reported, and with your consent.</li>
        <li>We do not use your desktop contents or your prompts to train models.</li>
      </ul>

      <h2>Processors we rely on</h2>
      <p>
        We use a small set of infrastructure providers to run the service: Cloudflare (hosting, DNS, and edge network)
        and Resend (transactional email for the contact form and early-access list). Each receives only the data needed
        for its function.
      </p>

      <h2>Retention and your rights</h2>
      <p>
        Contact-form messages live in our inbox and are kept as ordinary correspondence. Early-access records are kept
        until you're onboarded or ask to be removed. Operational logs rotate on short schedules. You can ask us at any
        time to access, correct, or delete personal data we hold about you, or to unsubscribe from the early-access
        list — email <a href="mailto:hello@descanto.com">hello@descanto.com</a> and we'll act on it promptly. If we
        change this policy materially, we'll update the date above and note it in our news feed.
      </p>
    </LegalPage>
  );
}
