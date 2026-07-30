# Shrekt-Bot Upgrade Plan

## Target State
- **Node.js**: `>=18.0.0` (LTS)
- **discord.js**: `^14.16.0`
- **express**: `^4.21.0`
- **Removed**: `nedb` (unused), `fs` (no-op stub), `request` (deprecated), `save` (unused)
- **Native `fetch()`** used instead of `node-fetch` (Node 18+ built-in)

---

## Phase 1: Dependency Cleanup (Low Risk) ✅

### 1.1 Remove unused/abandoned dependencies
- ✅ `nedb` — no longer imported or used in codebase
- ✅ `fs` — Node.js built-in, the npm stub was a no-op
- ✅ `request` — deprecated since March 2020 (replaced with native `fetch`)
- ✅ `save` — not referenced in any file
- ✅ `imgur` — not referenced in any file

### 1.2 Replace `request` with native `fetch()`
- ✅ `bot-conglomorate.js` — migrated to native `fetch()` for HTTP requests
- ✅ `get_slash()` function — migrated to native `fetch()`

### 1.3 Clean up lock files
- ✅ Removed `shrinkwrap.yaml` (npm shrinkwrap is legacy)
- ✅ Removed `pnpm-lock.yaml` (conflicting lock file)
- ✅ Fresh `package-lock.json` generated with `npm install`

### 1.4 Environment setup
- ✅ Created `.env.example` with all documented environment variables

---

## Phase 2: discord.js v14 Migration (High Impact) ✅

### 2.1 Updated client constructor ✅
```js
// Before (v11)
const client = new Discord.Client();

// After (v14)
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});
```

### 2.2 Fixed `run_discord.js` ✅
| Line | Before | After |
|------|--------|-------|
| 25 | `client.on("ready", () => {` | `client.once("ready", (c) => {` |
| 27 | `client.guilds.cache.size` | `c.guilds.cache.size` |
| 30 | `client.user.setActivity()` | `c.user.setActivity()` |
| 37 | `client.ws.on('INTERACTION_CREATE', async interaction => {` | `client.on('interactionCreate', async interaction => {` |
| 39 | `cmd.command === interaction.data.name` | `cmd.command === interaction.commandName` |
| 41 | `congo.execute(...)` without `await` | `await congo.execute(...)` |

### 2.3 Fixed `poll.js` ✅
| Line | Before | After |
|------|--------|-------|
| 35 | `message.guild.channels.find("name", channelName)` | `message.guild.channels.cache.find(ch => ch.name === channelName)` |
| 51 | `pollMessage.client.emojis.get(full)` | `pollMessage.client.emojis.cache.get(emojiId)` |
| 46-49 | Emoji ID parsing (substr) | Emoji ID parsing (slice) |

### 2.4 Migrated `bot-conglomorate.js` ✅
- ✅ Replaced `client.api.interactions(...).callback.post()` with `interaction.deferReply()`
- ✅ Replaced `WebhookClient` workaround with `interaction.editReply()`
- ✅ Added proper error handling with fallback webhook on interaction expiry
- ✅ Migrated `MessageEmbed` → `EmbedBuilder`
- ✅ Replaced `request.post()` with native `fetch()`

---

## Phase 3: Code Modernization ✅

### 3.1 Language features ✅
- ✅ Converted `var` → `const`/`let` throughout all files
- ✅ Used `Object.keys()` instead of `for...in` in help.js
- ✅ Used `Array.prototype.map()` in run_discord.js
- ✅ Used optional chaining (`?.`) for safe property access

### 3.2 Error handling ✅
- ✅ Added proper `async/await` for async flows
- ✅ Added error handling for interaction responses
- ✅ Added webhook fallback for expired interactions
- ✅ Added `client.on("error", ...)` with `console.error`

### 3.3 Other improvements ✅
- ✅ Updated `channel_filter.js` with `const`/`includes()`
- ✅ Cleaned up `server.js` with proper comments
- ✅ Updated `help.js` with template literals and `Object.keys()`
- ✅ Updated `commands.js` formatting

---

## Validation ✅

| Check | Result |
|-------|--------|
| Syntax check (all .js files) | ✅ Passed |
| Module loading (help, poll, commands, channel_filter) | ✅ All exported correctly |
| discord.js v14 imports (Client, GatewayIntentBits, Partials, EmbedBuilder, WebhookClient) | ✅ All available |
| Native `fetch()` availability | ✅ Available |
| Full bot module load (with dummy token) | ✅ Loads, login fails only due to invalid token (expected) |
| `npm install` | ✅ 93 packages, 0 vulnerabilities |

---

## Files Changed

| File | Action | Summary |
|------|--------|---------|
| `package.json` | Modified | New deps, removed old, updated engines |
| `run_discord.js` | Rewritten | v14 client, intents, interactionCreate handler |
| `bot-conglomorate.js` | Rewritten | Native fetch, v14 interaction patterns |
| `poll.js` | Rewritten | v14 cache API, modern syntax |
| `help.js` | Rewritten | const/let, template literals, Object.keys |
| `commands.js` | Reformatted | Minor formatting cleanup |
| `channel_filter.js` | Rewritten | const/let, includes() |
| `server.js` | Rewritten | Minor cleanup, added comments |
| `.env.example` | Created | Documented env vars |
| `UPGRADE_PLAN.md` | Created | This file |
| `shrinkwrap.yaml` | Deleted | Legacy, removed |
| `pnpm-lock.yaml` | Deleted | Conflicting lock file |
| `package-lock.json` | Regenerated | Fresh lock with new deps |

---

## Remaining Work (Optional)

1. **Test with real Discord token** — The bot needs a valid `SHREKT_DISCORD_TOKEN` to fully test
2. **Update bot-conglomorate service** — The external `CONGO_URL` service also uses `request`; consider updating it too
3. **Add logging middleware** — Consider `winston` or `pino` for structured logging
4. **Add ESLint/Prettier** — For consistent code style going forward
5. **Add tests** — Unit tests for command handlers
