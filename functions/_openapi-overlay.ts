// Per-operation summaries overlaid onto the live OpenAPI spec by
// functions/openapi.json.ts, keyed by operationId. The upstream spec
// (api.descanto.com/v1/openapi.json) has unique operationIds and typed
// schemas but sparse descriptions; this fills the gaps so LLM
// function-calling formats get a description for every operation.
// Existing upstream summaries/descriptions always win.

export const operationSummaries: Record<string, string> = {
  listDesktops: "List all desktops in the authenticated organization, with lifecycle state and metadata.",
  createDesktop: "Create a new persistent desktop. Pick a tier (small/default/large) and billing mode; returns the live desktop.",
  getDesktop: "Get one desktop by id, including its current lifecycle state.",
  updateDesktop: "Update a desktop's mutable settings (e.g. name).",
  destroyDesktop: "Permanently destroy a desktop and its state. Returns an operation handle to poll.",
  listDir: "List a directory inside the desktop's filesystem.",
  getDisplay: "Get the desktop's current display geometry (resolution).",
  setDisplay: "Set the desktop's display geometry (resolution).",
  execCommand: "Run a shell command inside an awake desktop, blocking or detached; returns stdout/stderr/exit code or a process id.",
  statFile: "Get file metadata (size, mode, mtime) without reading contents.",
  readFile: "Read a file from the desktop's filesystem; supports ranged reads for large files.",
  writeFile: "Write a file into the desktop's filesystem; supports chunked transfer for large files.",
  deleteFile: "Delete a file from the desktop's filesystem.",
  forkDesktop: "Fork a desktop into an identical copy from its current state; the parent is never modified. Returns an operation handle.",
  listGenerations: "List a desktop's generation (snapshot) history, newest first.",
  hibernateDesktop: "Hibernate an awake desktop: full memory snapshot preserved, compute billing stops. Returns an operation handle.",
  sendInput: "Send a batch of mouse/keyboard input events to the desktop's GUI in a single round trip.",
  getProcess: "Get the status and output of a detached (background) process started via exec.",
  restoreDesktop: "Restore a desktop to an earlier generation. Branching semantics: nothing is destroyed. Returns an operation handle.",
  takeScreenshot: "Capture a screenshot of the desktop's current display.",
  wakeDesktop: "Wake a hibernated desktop; resumes with memory, processes, and logins intact in ~0.5s. Returns an operation handle.",
  listApiKeys: "List the organization's API keys (metadata only, never secrets).",
  createApiKey: "Create a new API key for the organization; the secret is returned once.",
  revokeApiKey: "Revoke an API key immediately.",
  getMe: "Get the authenticated organization and key context for the current bearer token.",
  getOperation: "Poll (or long-poll) an operation handle returned by wake/hibernate/destroy/fork/restore.",
  listWebhooks: "List the organization's webhook endpoints.",
  createWebhook: "Register a webhook endpoint for desktop lifecycle events (HMAC-signed deliveries).",
  deleteWebhook: "Delete a webhook endpoint.",
  listWebhookDeliveries: "List delivery attempts for a webhook, including response codes and retries.",
};
