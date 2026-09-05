---
license: cc-by-4.0
language:
- ru
- en
pretty_name: SHAR Production Brief Taxonomy and Synthetic Examples
size_categories:
- n<1K
tags:
- production-planning
- synthetic
- taxonomy
configs:
- config_name: taxonomy
  data_files:
  - split: train
    path: data/taxonomy.jsonl
- config_name: briefs
  data_files:
  - split: train
    path: data/briefs.jsonl
---

# SHAR production planning dataset · 1.0.0

Dataset release 1.0.0. Authored taxonomy and synthetic data: [CC-BY-4.0](LICENSE-CC-BY-4.0). Code, JSON Schemas and documentation: [MIT](LICENSE). [License boundaries and attribution](LICENSE-STATUS.md). [Русский](README.ru.md).

## Dataset purpose

A small bilingual vocabulary and fixture set for production-brief interfaces, documentation and completeness-validator demonstrations. It contains **18 authored taxonomy records** (methods, tasks, deliverables and channels) and **8 synthetic briefs** (four fictional scenarios in RU/EN). It is not a market study, ML benchmark, production cost dataset or evidence of client outcomes. `train` is the loader split name only; no evaluation split or training efficacy is claimed.

The four scenarios concern a fictional reusable container, stationery campaign, community workshop and exhibition space. They deliberately omit real brands, clients, contact information, assets and prices. Paired languages are translations of scenarios, not eight independent observations.

## Provenance and composition

Created 2026-09-05 through AI-assisted editorial drafting for SHAR owner review, using the public brief concepts in [SHAR's planning schema](https://sharprod.com/schemas/agent-brief.schema.json) and [brief guide](https://sharprod.com/journal/video-production-brief.html). Text is newly authored; protected MCP schemas and private customer records were not copied. This is a proposed instructional classification, not a claim of industry consensus or completed human expert review.

Each canonical JSONL row carries stable `id`, `version`, `origin`, `method`, `created_at`, `source_urls`, `license_status`, `license`, `attribution` and `attribution_url`. Taxonomy records add category and RU/EN labels/definitions; briefs add language, title, taxonomy IDs, `is_client_project:false`, and the nested brief. **No measured records or public business-fact records are included.** Source URLs explain the conceptual basis; they are not citations proving that synthetic projects occurred.

`taxonomy.schema.json` and `briefs.schema.json` define each row. `data/examples.json` is a derived browser projection, not a separate dataset; full provenance stays in JSONL and this card. IDs remain stable across text corrections; breaking field or semantic changes require a version update and migration notes.

## Local loading

Python 3.10+:

```sh
python -m pip install -r requirements-test.txt
python tests/load_huggingface.py
```

Direct usage, from this directory:

```python
from datasets import load_dataset
taxonomy = load_dataset('json', data_files='data/taxonomy.jsonl', split='train')
briefs = load_dataset('json', data_files='data/briefs.jsonl', split='train')
print(briefs[0]['brief']['objective'])
```

This loads local files without Hub credentials. Arrow may infer ISO date strings as datetime values; normalize these back to YYYY-MM-DD before passing loaded briefs to the JavaScript validator. The canonical JSONL and browser JSON preserve strings. The supplied test validates every row against JSON Schema, rejects missing-ID/wrong-provenance records and checks equality after the Hugging Face Arrow roundtrip with inferred date/datetime values normalized back to ISO dates. `node --test tests/dataset.test.mjs` additionally validates every brief with the companion `../production-brief/validator.mjs`, checks term references and browser projection equality. Keep the two sibling kits together for that cross-kit test; the Python loader works independently.

## Limitations and responsible use

The set is small, curated and intentionally narrow: RU/EN, commercial video planning, broad method categories. It is unsuitable for pricing, legal approval, factual client attribution, production-quality scoring or statistically meaningful model evaluation. A valid brief can still be unrealistic, incomplete in substance or legally unusable. Budget text is a placeholder, never SHAR pricing. Source fields should not be interpreted as measured evidence. Human review is required before a commercial estimate or publication.

No remote submission, tracking or model calls are included. Do not add private client briefs or NDA assets without separate rights and redaction review. Attribution: “SHAR Production, Production Planning Taxonomy and Synthetic Briefs, v1.0.0, https://sharprod.com/, CC BY 4.0.” Retain attribution and license notices and indicate changes when sharing adaptations.

## Release and contact

Owner: SHAR Production. Commercial path: prepare a brief, review requirements, then independently use [SHAR contact](https://sharprod.com/contact.html). GitHub namespace `Ares3333333/production-brief-schema` is owner-authorized. A Hugging Face dataset URL is not assigned here; GitHub publication and any later Hub publication must each be verified separately. Rerun tests and include license/attribution files in the reviewed payload, then verify both configurations and the rendered dataset card on any authorized Hub deployment. Local loading is not a Hub publication.
