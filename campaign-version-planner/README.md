# Campaign version planner · 0.1.0

Plan a concrete delivery matrix by duration, channel-specific aspect ratio and language. No dependencies, API, storage, quote, schedule promise or project submission. [Русский](README.ru.md).

## Run

Node 20+, from this directory:

```sh
node cli.mjs examples/valid.en.json
node cli.mjs examples/valid.ru.json csv ru > versions.csv
node --test tests/*.test.mjs
```

Exit 0: valid plan; 1: rejected input; 2: file/JSON/usage error. The CLI prints JSON errors even in CSV mode; check the exit code before treating redirected output as CSV. In CSV mode duplicate warnings go to stderr, so the successful stdout stream remains CSV. Files are capped at 256 KiB; input error messages can include file paths.

## Browser or Node API

```js
import { planCampaign, versionsToCsv, planToJson } from './planner.mjs';
const result = planCampaign({
  durations: [15, 30],
  channels: [
    { id: 'website', label: 'Website', aspectRatios: ['16:9'] },
    { id: 'social', label: 'Social', aspectRatios: ['9:16', '1:1'] }
  ],
  locales: ['ru', 'en']
}, { language: 'en' });
if (result.valid) {
  const csv = versionsToCsv(result.versions);
  const json = planToJson(result);
}
```

Serve planner.mjs over HTTP for browsers; it imports nothing. Pass parsed JSON, not arbitrary objects with getters/proxies. A UI should cap raw input at 256 KiB before parsing. `planCampaign` returns `{valid, errors, warnings, versions, total}`. Errors/warnings contain JSON Pointer `path`, stable `code` and RU/EN `message`. Failure emits zero versions, never a silently truncated plan. `planToJson` serializes the supplied result; it is not an input validator.

Each version contains `id`, `channelId`, `channelLabel`, `aspectRatio`, `locale`, `durationSeconds`. ID format is `v1__<channel>__<ratio with x>__<lowercase locale>__<seconds>s`. Sorting is channel, ratio, locale (ASCII lexical) and duration (numeric); reordered inputs have the same ordered versions. Labels do not change identity.

## Rules and assumptions

- Durations are **integer seconds 1–3600**, at most 100 input entries. Zero, fractions, NaN, infinity and numeric strings are rejected.
- Channels have lowercase slug IDs (up to 40 characters), optional safe labels (up to 80 Unicode code points) and **their own** 1–20 aspect ratios. Ratios have positive integer sides from 1 to 99. At most 100 channel entries.
- Locales are syntactic language tags with 2–3-letter roots and up to three 2–8-character subtags, max 35 characters; output is lowercase. At most 100 entries. This is not a registry validator and does not prove translation availability.
- Duplicate durations, case-normalized locales and identical ratio strings are removed with warnings. Repeated channel IDs merge formats only if their effective labels match exactly; conflicting labels fail. Missing label defaults to the ID. Equivalent mathematical ratios such as 1:1 and 2:2 remain distinct strings.
- Total = unique durations × unique locales × sum of each channel's unique ratios. **1000 versions passes; 1001+ fails.** No cross-channel ratio expansion is performed.
- Unknown fields, empty lists and labels containing controls, angle brackets or formula prefixes `= + - @` after leading whitespace are rejected. Labels never represent contact details or client metadata.

The input and output JSON Schemas document structural constraints. Duplicate merging, conflicting labels and the total cap are application rules; use the planner for final validation. Channel/ratio lists are **user assumptions**, not independently verified platform specifications. The planner does not infer current social-platform requirements, subtitles, resolutions, bitrates, rights, feasibility, costs or production lead times.

CSV uses fixed columns, CRLF lines and standard quoting for commas/quotes. `versionsToCsv` also rejects unsafe formula prefixes and control characters when given rows directly. It never opens a spreadsheet or writes files. JSON remains the full-fidelity format including warnings.

## Provenance and license

Newly authored planning code, schemas, tests and documentation: [MIT](LICENSE). Synthetic `examples/*.json` teaching fixtures: [CC-BY-4.0](LICENSE-CC-BY-4.0). [Attribution and boundaries](LICENSE-STATUS.md). No client projects, existing prices or private MCP source are included. This module is designed for the same `Ares3333333/production-brief-schema` product repository; it does not require another repository or a new service. Source readiness is separate from publication verification.

The existing brief profile's locales/aspectRatios can help a person draft this input, but do not identify per-channel formats; no automatic adapter guesses that mapping. Use the resulting matrix when reviewing deliverables, then discuss the brief through [SHAR contact](https://sharprod.com/contact.html). Nothing is sent automatically.

Optional browser verification: `node tests/browser-smoke.mjs` requires development-only Playwright and installed Microsoft Edge. The production module remains dependency-free. Internal evidence is excluded from the public payload.
