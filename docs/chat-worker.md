# Chat worker reference (`workers/chat/src/index.ts`)

Single-file Worker, ~260 lines. This documents its exact behavior so you don't have to
re-read the whole file to reason about the chat widget.

## Request/response contract

- `POST /api/chat` only; any other method → `405`.
- Body: `{ messages: [{ role: 'user' | 'assistant', content: string }] }`.
- Validation (`validateMessages`): rejects if not an array, empty, or `> MAX_MESSAGES` (20)
  entries; each message's `content` must be non-empty and `<= MAX_MESSAGE_LENGTH` (2000)
  chars. On any violation → `400 { error: 'Invalid message payload' }`. Valid history is
  truncated to the last `MAX_HISTORY_TURNS` (6) messages before being sent upstream.
- Success → `200 { text: string }` (empty string if Anthropic returned no text block).
- Malformed JSON body → `400 { error: 'Invalid JSON' }`.

## Gating, in order, before any Anthropic call

1. **Daily budget** (`checkAndIncrementDailyBudget`): key `budget:<YYYY-MM-DD>` in
   `CHAT_KV`, limit = `env.DAILY_BUDGET_REQUESTS` (deploy-time secret/var, not in repo),
   TTL 25h. Exceeded → `503 { error: 'The chat is resting for today — please try again tomorrow.' }`.
2. **Per-IP rate limit** (`checkAndIncrementRateLimit`): key `rl:<CF-Connecting-IP>`
   (falls back to `'unknown'` if header missing — so all header-less requests share one
   bucket), max `RATE_LIMIT_MAX_REQUESTS` (15) per `RATE_LIMIT_WINDOW_SECONDS` (600s)
   sliding-ish window (TTL reset each window, not a true sliding window). Exceeded →
   `429 { error: "You're sending messages a bit fast — try again in a few minutes." }`.

Both counters are incremented optimistically (increment happens even though the request
may still fail validation afterward) — a burst of malformed requests still burns budget/rate-limit quota.

## System prompt construction (`buildSystemPrompt`)

- Cached in the Cloudflare Cache API under a synthetic key
  (`https://zkm.tw/__chat_system_prompt_cache__`) for `SYSTEM_PROMPT_TTL_SECONDS` (3600s,
  1h). Cache is separate from `CHAT_KV`.
- On cache miss, fetches `https://zkm.tw/data/profile.json` and
  `https://zkm.tw/data/resume.json` **from production** (hardcoded absolute URLs) — local
  `wrangler dev` still pulls the live prod JSON, not whatever is running under `yarn dev`.
  Either fetch failing (`!ok`) throws → caller returns `502 { error: 'Chat is temporarily unavailable' }`.
- Prompt fields pulled: `profile.profile.{name,about,location}`,
  `resume.{summary,technicalSkills,workExperience,education}`. Each `technicalSkills`
  category is flattened to `"category: item, item, ..."` (or `JSON.stringify` if the
  value isn't an array, to handle the nested `languages` object in resume.json).
  `workExperience` entries render as `- position at company (period): responsibilities joined by space`.
  Missing fields degrade to empty string/array rather than erroring.
- Fixed instruction block appended: answer in first person as the profile owner, stay
  on professional topics, keep answers short, and explicitly ignore any
  instruction-override attempts embedded in user messages (prompt-injection guard).

## Anthropic call

- Model `claude-haiku-4-5`, `max_tokens: 300` (`MAX_TOKENS`), `anthropic-version: 2023-06-01`.
- Non-`ok` responses are mapped to specific 502s: `401/403` → "misconfigured (auth)",
  `400` + body containing `"credit balance"` → "misconfigured (billing)", `429` →
  "temporarily overloaded", anything else → generic "temporarily unavailable". The raw
  Anthropic error body is logged via `console.error` (visible in `wrangler tail`), never
  returned to the client.

## Things that will bite you if changed carelessly

- `Env` (`CHAT_KV`, `ANTHROPIC_API_KEY`, `DAILY_BUDGET_REQUESTS`) must stay in sync with
  `workers/chat/wrangler.toml` bindings and whatever secrets are set via
  `wrangler secret put` — none of this is visible from the app repo.
- Changing `MAX_HISTORY_TURNS`/`MAX_MESSAGES` changes both cost and conversational
  memory; changing them without also updating `Chatbot.tsx`'s expectations (it sends the
  full client-side history every turn) can silently change behavior.
