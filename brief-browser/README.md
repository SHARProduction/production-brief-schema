# SHAR brief checker 0.1.0

Browser-only RU/EN production brief completeness checker. Uses the shared production-brief validator/schema and production-dataset synthetic examples; no independent business database and no pricing calculation. Runs without login, analytics, storage, upload, AI or backend. Editing uses JSON; errors identify field paths. Validation cannot establish feasibility, legal rights or creative quality.

## Local build and verification

Requires Node 20+ and adjacent `production-brief` and `production-dataset` directories. From this folder:

```sh
node build.mjs
node test.mjs
```

Tests need Playwright and installed Microsoft Edge. Install Playwright as a local test dependency or set `PLAYWRIGHT_MODULE` to its absolute module directory. Evidence and screenshots stay in `evidence/`, outside `dist/`. Serve `dist/` over localhost HTTP using any static server; ES modules cannot reliably run using file://. No runtime npm dependencies.

`dist/` has an explicit allowlist and release SHA-256 inventory. Do not upload this private parent repository or evidence. The JSON editor never persists text; downloads are local and user initiated. Changing language preserves the entered brief and translates validation. Example load replaces editor text as visibly disclosed. A changed brief invalidates the previous result. JSON download requires a valid brief; validation report contains no brief text.

## Deployment (not executed)

State: LOCAL_READY. Source publication to `Ares3333333/production-brief-schema` is owner-authorized; actual publication is verified separately. Code, documentation and schemas are [MIT](LICENSE); embedded synthetic examples are [CC-BY-4.0](LICENSE-CC-BY-4.0), including their generated JavaScript representation. Retain the [attribution and boundary notice](LICENSE-STATUS.md) in every dist deployment. Cloud hosting account/namespace, eligibility, terms and costs require their own confirmed deployment authorization. No paid services or account purchases are authorized by this package. Ongoing cost: no AI, server or database calls; hosting cost unverified until an account/plan is chosen. Maintainer: SHAR repository owner. Release upkeep: rebuild/test when shared schema or examples change.

Cloudflare Pages Direct Upload accepts prebuilt assets. After approval, upload only the contents of `dist/` using the dashboard's Direct Upload workflow; retain `_headers`. Record deployment URL/id, date and `release.json` hash. Direct Upload cannot later switch to Git integration within the same project. See [official instructions](https://developers.cloudflare.com/pages/get-started/direct-upload/) (checked 2026-09-05).

Hugging Face alternative: create an approved Static HTML Space, copy only `dist/` files into its root and add the following README metadata. `_headers` is Cloudflare-specific; the HTML CSP still blocks data connections on other hosts. Do not add `frame-ancestors` to the meta policy; HF embeds the app. Verify real Space operation and platform-added requests separately.

```yaml
---
title: SHAR Production Brief Checker
sdk: static
app_file: index.html
---
```

Static SDK metadata follows [Hugging Face documentation](https://huggingface.co/docs/hub/spaces-sdks-static) (checked 2026-09-05). The content is an authored utility with synthetic examples, not a measured ML benchmark.

First-deploy acceptance: open actual public URL in desktop/mobile; load RU/EN examples, validate a missing-field case, download report, inspect console/network, contact link, response MIME types and CSP. HTTP 200 alone does not pass. Record exact URL/version/owner/date only then as PUBLISHED_VERIFIED. The contact path `https://sharprod.com/contact.html` returned HEAD 200 on 2026-09-05; brief data is never included in that link.

Indexing: this draft explicitly uses `noindex,follow` and no fabricated canonical. At approved first publication choose one primary URL; remove noindex only after updating sources with the approved canonical. Keep additional full mirrors noindex rather than pretending they are independent products. No main-site robots/canonical changes are needed.

Rollback: archive the prior verified `dist/` and release manifest before publishing. Redeploy that complete artifact to the same Cloudflare project; for HF revert the isolated Space asset commit. Re-run positive/negative smoke checks and compare release hashes. If first release fails, remove/disable that new surface; do not change SHAR DNS or main hosting. Never roll back by uploading files from the private repo root.
