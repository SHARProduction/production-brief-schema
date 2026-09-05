# SHAR Production tools

Practical, versioned tools for preparing a commercial video brief: a schema and validator, bilingual planning data, a browser checker and examples for SHAR's existing public MCP. These tools help structure a conversation with a producer; they do not provide a binding quote, verify legal rights or submit a project.

Published by [SHAR Production](https://sharprod.com/). Live surfaces: [browser brief checker](https://production-brief-browser.bullolaya.workers.dev/) and [Hugging Face dataset](https://huggingface.co/datasets/SHARProduction/production-brief-taxonomy).

## Start here

| Module | Purpose | Run |
|---|---|---|
| [Production brief](production-brief/README.md) | Validate required fields and get readable errors | `node production-brief/cli.mjs production-brief/examples/valid.en.json en` |
| [RU/EN taxonomy and examples](production-dataset/README.md) | Load18 authored concepts and8 synthetic briefs | `python production-dataset/tests/load_huggingface.py` |
| [Browser checker](brief-browser/README.md) | Check a brief locally in a browser; no upload or analytics | `node brief-browser/build.mjs`, then serve `brief-browser/dist/` over HTTP |
| [Public MCP examples](public-mcp-examples/README.md) | Retrieve current public requirements and deliverables | `node public-mcp-examples/example.mjs brief` |
| [Campaign version planner](campaign-version-planner/README.md) | Expand channel formats, durations and locales into a delivery matrix | `node campaign-version-planner/cli.mjs campaign-version-planner/examples/valid.en.json` |

Node.js20+; validator has no runtime dependencies. Dataset loading requires the test dependencies documented in its README. Browser builds reuse the same schema and synthetic examples.

## Tests

```sh
node --test production-brief/tests/*.test.mjs production-dataset/tests/*.test.mjs public-mcp-examples/test.mjs
python -m pip install -r production-dataset/requirements-test.txt
python production-dataset/tests/load_huggingface.py
```

The public client examples contact only `https://mcp.sharprod.com/public`. Offline unit tests do not contact it. To run a deliberate bounded live check, follow the module README. No new MCP server or protected submission endpoint is included.

## Data and licenses

New code and documentation: [MIT](LICENSE). Authored taxonomy and synthetic examples: [CC-BY-4.0](production-dataset/LICENSE-CC-BY-4.0); attribution details and scope are recorded per module. Synthetic examples are fictional, not client projects, training results, market measurements or evidence of business performance. The licenses do not grant rights to SHAR client images, videos or third-party trademarks.

[SHAR Production](https://sharprod.com/) owns the project. Current service information comes from SHAR's Website Registry/public website, not a handwritten price list in this repository. For a project discussion, use the [existing contact page](https://sharprod.com/contact.html); your local brief is not sent automatically. The existing [cost calculator](https://sharprod.com/production-tools/video-cost-calculator/) remains a separate planning resource.

## По-русски

Набор рабочих инструментов SHAR Production: проверка заполненности брифа, русско-английская таксономия, синтетические примеры и клиент публичного MCP. Проверка структуры не заменяет смету, творческое решение, согласование прав или приёмку. Браузерный инструмент обрабатывает текст локально и не отправляет заявку. Русская документация находится в каждом модуле.

Изменения полей/семантики требуют версионирования и повторных тестов. Не присылайте клиентские брифы, личные данные или закрытые материалы в публичные issues. Сообщайте о дефектах на синтетическом воспроизводимом примере. Публичный релиз содержит только перечисленные в `release-manifest.json` файлы; перед использованием сверяйте версию и ограничения.
