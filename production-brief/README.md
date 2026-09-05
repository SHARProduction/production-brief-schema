# SHAR production brief · 1.0.0

Release 1.0.0. [Русский](README.ru.md). Code, documentation and JSON Schemas: [MIT](LICENSE). Synthetic JSON examples: [CC-BY-4.0](LICENSE-CC-BY-4.0). See [license boundaries and attribution](LICENSE-STATUS.md). Owner-authorized repository: `Ares3333333/production-brief-schema`; publication is verified separately.

Prepare a complete video-production brief before a human estimate. This tool checks structure, length and required fields. It does not evaluate creative quality, approve rights, calculate a quote, send a lead or call MCP.

## Run

Node.js 20+; no install and no runtime dependencies. From this folder:

```sh
node cli.mjs examples/valid.en.json en
node cli.mjs examples/invalid.json ru
node --test tests/*.test.mjs
```

Exit codes: 0 valid, 1 validation failure, 2 file/JSON/usage failure. Input file limit: 256 KiB. CLI diagnostics contain file paths on input errors; avoid putting personal data in file names.

Browser ES module (serve both files over HTTP):

```js
import { validateBrief } from './validator.mjs';
const result = validateBrief(value, { language: 'en' });
// { valid: false, errors: [{ path: '/objective', code: 'required', message: '…' }] }
```

Copy `validator.mjs` and `schema.mjs` together. No network requests, storage, telemetry or submission. UI callers should limit input size to 256 KiB before JSON.parse. Pass parsed JSON objects; arbitrary JS accessors/proxies are outside this interface.

## Contract and provenance

`brief.schema.json` is JSON Schema draft 2020-12; `schema.mjs` is an equivalent browser representation checked by tests. Required fields: objective, audience, deliverables, channels, launchDate, budgetContext, rightsConstraints. Optional: references, locales, aspectRatios, notes. Extra fields are rejected. `launchDate` is a real Gregorian date; dates in the past remain structurally valid. Human scheduling feasibility is separate.

The field concepts are reused from SHAR's public [planning schema](https://sharprod.com/schemas/agent-brief.schema.json) and [brief guide](https://sharprod.com/journal/video-production-brief.html). This standalone completeness profile adds nonblank text/items, positive ratios and HTTP(S)-only reference URLs without credentials. It is **not** the MCP schema or a drop-in replacement for the existing public planning contract. References are never fetched; no guarantee is made that a URL is reachable or public. Generic JSON Schema validators must enable format assertion; `x-no-credentials` is an application rule enforced by this validator. This module implements the keywords used here, not a general-purpose JSON Schema engine.

Dates, project details and budget context in examples are fictional; none is a client record or a SHAR price. There are no protected MCP schemas, credentials, private snapshots, customer files, named clients or performance claims in this release.

## Next step

Use the prepared brief for human review via [SHAR contact](https://sharprod.com/contact.html). Sending is an explicit action on that site. The existing [video cost calculator](https://sharprod.com/production-tools/video-cost-calculator/) remains the pricing-planning tool; this package does not duplicate it.

The companion dataset is a separate release kit; the validator runs independently. Before release, rerun tests and publish only reviewed files together with LICENSE, LICENSE-CC-BY-4.0 and LICENSE-STATUS.md. Internal evidence is excluded from the public payload.
