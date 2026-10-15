<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:deploy-rules -->
# Deploy (WN Luxe)

**Do not ask for Cloudflare API tokens in the agent VM.** Deploy is automated.

1. Merge work to **`main`** and **`git push origin main`**.
2. GitHub Actions workflow **Deploy production (WN Luxe)** builds with OpenNext and deploys to Cloudflare Worker `wnluxe`.
3. Confirm the run in [GitHub Actions](https://github.com/Fyuturevizion/propos/actions/workflows/deploy-production.yml).

See [docs/DEPLOY.md](docs/DEPLOY.md) for the one-time GitHub secrets list (repository admin only).

On `main` with a clean tree: `bash scripts/agent-deploy.sh`
<!-- END:deploy-rules -->
