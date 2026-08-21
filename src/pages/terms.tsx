import { LegalPage } from "./legal";

export function TermsPage() {
  return (
    <LegalPage eyebrow="LEGAL" title="Terms of service" updated="August 21, 2026">
      <p>
        These terms govern your use of Descanto, the cloud desktop platform operated by DV CENTRAL HOLDINGS LTD (trading as Descanto,
        71-75 Shelton Street, Covent Garden, London WC2H 9JQ, United Kingdom) at descanto.com and its
        subdomains, including the API at api.descanto.com and desktops served under canto.host. By creating an account
        or using an API key you agree to them. Descanto is in early access: capacity is provisioned manually and the
        service is offered as-is while we build toward general availability.
      </p>

      <h2>The service</h2>
      <p>
        Descanto provides persistent Linux desktops that hibernate when idle and wake on demand, driven by a REST API,
        SDKs, a CLI, and an MCP server. Desktops are isolated microVMs; what you install and run inside them is your
        responsibility. We may update, add, or retire features during early access, and we'll communicate breaking API
        changes through versioned routes and the changelog.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Keep your API keys secret. Anything done with your key is attributed to your organization.</li>
        <li>Use desktops lawfully. No malware distribution, unauthorized access to third-party systems, denial-of-service traffic, spam, or cryptomining.</li>
        <li>Agents acting on your behalf are your responsibility — automation does not dilute accountability for what a desktop does.</li>
        <li>Respect resource limits of your tier; sustained abuse of shared infrastructure may lead to throttling or suspension after notice where practical.</li>
      </ul>

      <h2>Billing</h2>
      <p>
        Pricing is published at descanto.com/pricing. Hourly desktops are metered only while awake and responsive —
        cold starts, snapshot writes, and our own slowness are never billed. Monthly desktops bill a flat commitment per
        billing period. Overage beyond a plan's included usage is strictly opt-in.
      </p>

      <h2>Your data</h2>
      <p>
        Desktop contents, snapshots, and generation history belong to you. We keep hibernated state so your desktops can
        resume exactly where they left off; destroying a desktop deletes its state on our schedule for backups and
        replicas. Our handling of personal data is described in the <a href="/privacy">privacy policy</a>.
      </p>

      <h2>Warranty and liability</h2>
      <p>
        During early access the service is provided without uptime guarantees or warranties of any kind, to the maximum
        extent permitted by law. Our total liability for any claim is limited to the amounts you paid us in the three
        months preceding the claim. Nothing in these terms excludes liability that cannot lawfully be excluded.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may revise these terms as the product matures; material changes will be announced with reasonable notice and
        the date above updated. Continued use after a change takes effect constitutes acceptance. Questions, disputes,
        or notices: <a href="mailto:hello@descanto.com">hello@descanto.com</a>.
      </p>
    </LegalPage>
  );
}
