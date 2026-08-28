# PF Compass engineering guide

- Preserve the product thesis: a citizen-first preflight and recovery experience, not a generic EPFO redesign or chatbot.
- Read `docs/PROJECT_MEMORY.md` before major product or architectural changes.
- Use synthetic data only. Never connect to real government systems, credentials, or undocumented APIs; never imply government endorsement.
- Keep business/domain logic separate from UI and avoid unnecessary dependencies or infrastructure.
- Prefer focused, incremental changes and do not rewrite unrelated code.
- Keep the experience mobile-first, accessible, calm, and written in plain language.
- Run relevant lint, type, and build checks after significant changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
