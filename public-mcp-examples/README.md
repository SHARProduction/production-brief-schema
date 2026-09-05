# SHAR public MCP examples 0.1.0

Runnable client examples for SHAR Production's existing anonymous read-only endpoint. No server, account, token, database or runtime package installation. Node 20+.

```sh
node --test test.mjs
node example.mjs list
node example.mjs brief
node example.mjs deliverables
node example.mjs methods
```

Each example command makes one POST to the fixed `https://mcp.sharprod.com/public`. `list` discovers tool names/read-only annotations; `brief` calls `get_brief_requirements` in English; `deliverables` calls `get_deliverables` for `service.ai-video`; `methods` compares `ai` and `cgi`. The three tool examples print the returned public data and lineage to your terminal. Do not redirect output into an unreviewed public fact mirror. No arbitrary endpoint, tool name, service ID, user brief or client data is accepted. Other action names fail locally.

Protocol compatibility: `2026-07-28`, `Accept: application/json, text/event-stream`, JSON content type, `mcp-protocol-version`, `mcp-method`, `mcp-name` on tools/call, and `_meta` protocol/client metadata. This example supports the endpoint's observed JSON response profile only; it explicitly rejects SSE. It is not a general-purpose MCP SDK. A changed server profile must be reviewed rather than silently accepted.

Requests have a 10-second timeout, configurable in `createClient` from 1 to 30000 ms; streamed responses are capped at 2 MiB; redirects are rejected. JSON-RPC version/id/result, public `structuredContent.ok`, tool errors and read-only discovery annotations are validated. Invalid HTTP/media/envelope/oversize/timeout responses fail with an error. The injectable fetch implementation is for offline unit tests; the CLI always uses native fetch. No auth headers or write calls exist.

`node live-check.mjs` makes exactly four read-only calls and saves compact evidence locally. The receipt includes only action names, read-only annotations, error state, lineage and response-contract keys; no large business-fact dump. Run only when a live check is intended. Offline tests make no network calls.

Status: LOCAL_READY. Newly authored code and documentation are [MIT](LICENSE); see [scope](LICENSE-STATUS.md). GitHub source publication to `Ares3333333/production-brief-schema` is owner-authorized; public availability is verified separately. Maintainer: SHAR repository owner. Usage has no paid API key dependency; local connectivity and the public endpoint must remain available. Do not infer an SLA. Public publication must use a reviewed file allowlist, never the private parent repository. See [HANDOFF-GUIDE.md](HANDOFF-GUIDE.md) for SHAR's proposed production workflow.

## По-русски

Это готовые клиентские примеры для существующего публичного MCP SHAR, а не новый сервер. Нужен Node 20+. Команды выше показывают инструменты, требования к брифу, комплект сдачи AI-video и сравнение AI/CGI. Данные запроса заранее заданы; запросы выполняются на английском. Полный пользовательский бриф, токены и личные данные вводить не требуется.

`node --test test.mjs` проверяет код без сети. `node example.mjs brief` делает один реальный запрос и печатает публичный ответ. `node live-check.mjs` делает четыре запроса; запускайте его только при необходимости свежей проверки. Ошибки входа, протокола, тайм-аута и размера приводят к остановке, а не к подмене результата. Лимит ответа 2 МиБ выбран после наблюдения большого ответа сравнения методов; это техническое ограничение примера.

Бизнес-факты принадлежат Website Registry. `lineage` описывает источник ответа, не доказывает, что локальный HEAD сайта развёрнут в production. Ничего не отправляется продюсеру автоматически. Переход к обсуждению проекта: [контакты SHAR](https://sharprod.com/contact.html).

Владелец утвердил MIT для нового кода/документации и GitHub-публикацию в `Ares3333333/production-brief-schema`. Состоявшаяся публикация проверяется отдельно. Нельзя публиковать весь приватный репозиторий. При изменении публичного контракта обновите тесты и повторите ограниченную проверку; исходные цены в этом пакете не хранятся.
