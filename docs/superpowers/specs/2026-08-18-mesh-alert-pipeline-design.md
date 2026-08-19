# MESH Alert Pipeline — Design

Status: Design reviewed and revised live with founder across 2026-08-18 (initial design) and 2026-08-19 (spec review + Dispatch-intake extension added). All open items resolved as of 2026-08-19. Ready for `writing-plans` pending final founder go-ahead.

## Purpose

Replace the hand-edited MESH alert spreadsheet with a structured, file-based alert store inside `nw-mesh-server`, with a CLI/script intake path and single-channel Discord posting. Explicitly **not** doing per-Settlement Discord routing yet.

## Architecture

New modules added to the existing `nw-mesh-server` repo, alongside (not replacing) `server.js`. No new runtime dependencies — repo currently only has `ws`; everything below is doable with Node built-ins (`fs`, `readline`, `https`) plus a `.env` loader.

```
nw-mesh-server/
  config/
    settlements.js     — validated settlement list (id, name, grid) — no color/routing
                          includes: oasis (6-F1), amber_post (6-G2), saltline (6-H1),
                          raven (6-G1, covert — display name uses "Raven" as a font-glyph
                          workaround; "Haven" is the same place, not a separate settlement)
    factions.js         — Thorne Administration (CTN-1, #C41E3A), Pacifica Rising (#4A9B8E)
  data/
    alerts.json          — the alert store (JSON array), replaces the spreadsheet
  lib/
    alertStore.js        — read/append/validate alerts.json
    discord.js            — formats + posts one alert to the webhook
  scripts/
    push-alert.js         — the CLI/script entry point
  .env.example             — DISCORD_WEBHOOK_URL=
```

## Data Flow

1. Founder drafts alert text in chat with Claude.
2. Founder (or Claude, on instruction) runs `node scripts/push-alert.js` — either with flags (`--settlement oasis --faction thorne_administration --cycle 65 --category covenant --message "..."`) or bare, dropping into interactive prompts for whatever flags are missing. Both modes supported (flags take priority; anything missing is prompted for).
3. `push-alert.js` validates settlement/faction against the config lists, builds the alert record, appends it to `data/alerts.json` via `alertStore.js`.
4. `discord.js` posts it to the single configured webhook as an embed: faction color as the embed's side color, faction name + category shown as tags, cycle number and timestamp included.
5. No live WebSocket relay involvement — this is a separate, persistent-archive concern from the ephemeral MESH overlay relay on port 3001.

## Alert Schema

```
{
  id: string (generated, e.g. timestamp-based),
  settlement: "oasis" | "amber_post" | "saltline" | "raven",
  faction: "thorne_administration" | "pacifica_rising",
  cycle: number,
  category: string,
  alertTypeTag: string,
  status: "draft" | "active" | "resolved" | "archived",
  // NOTE: this is the alert's OWN lifecycle once it's already in alerts.json —
  // distinct from the Dispatch tab's editorial Status column (Draft/Revise/
  // Approved/Live, see Extension below), which governs whether an entry is
  // allowed to reach this schema at all. Similar-looking words, different axis.
  timestamp: ISO string (auto-set on creation),
  message: string (validated <= 240 chars, per the canon MESH Alert format rule — max 3 lines)
}
```

**Resolved (2026-08-19):**

1. **Raven included, but never posts to Discord.** "Haven" and "Raven" are the same settlement — "Raven" is the working display name, adopted as a font-glyph workaround (the production font doesn't render "H" properly). Raven is a covert/SEALED destination in canon. Raven-tagged alerts are written to `alerts.json` as normal (both the manual CLI path and the Dispatch/Approved path) but the Discord-post step is skipped for `settlement == "raven"` — status still updates normally (including the Dispatch tab's auto-`Live` flip), it just holds internally rather than going out publicly.
2. **`category` vs `alertTypeTag` — both kept, category now explicitly sourced from existing canon.** `category` is not a new invented enum — it's pulled directly from the established MESH Update Bar taxonomy in `Story Content System.md`'s Extract Map: `community` | `covenant` | `mesh` | `oasis`. `alertTypeTag` remains a separate, freer short tag (e.g. `SIREN`, `TRANSMISSION`) for the specific alert flavor, which the Update Bar bucket doesn't capture.

## Error Handling

Webhook failures (network/Discord down) do not lose the alert — it is written to `alerts.json` *before* the Discord post is attempted. The CLI reports post failure clearly so a failed post can be retried without re-drafting or re-entering the alert.

## Testing

No formal test suite planned — small internal tool. Manual smoke test instead: push one real alert end-to-end (file write + Discord post) and confirm both succeed.

## Explicitly Out of Scope (this iteration)

- Per-Settlement Discord channel routing (single channel only, for now)
- Settlement colors/icons (only faction gets visual identity in the Discord embed)
- Migrating existing spreadsheet history into `alerts.json` (not discussed yet — flag before assuming either way)
- Automated tests
- Any changes to the existing WebSocket relay (`server.js`, ports 3001/3002)

## Extension (2026-08-19) — Dispatch Draft Intake from Google Sheet

Adds a second intake path alongside the manual CLI: polling a tab in the founder's existing MESH tracking spreadsheet for editorially-approved "Dispatch" entries, auto-publishing them.

**Source confirmed:** `https://docs.google.com/spreadsheets/d/1h7LrRXUAkHiWOSA7vJGg1bIvKoKK2SBZzmk3SkLdTPQ` — the **Chapter_ID / Canon_Notes tab** (the vault's actual "plot points" tab: `the-drift`, `the-holy-war`, `the-contingency`, etc.). This is a different tab from the main MESH alert log tab read earlier in this design process (`ID | Content | Cycle | Date | Status | Type | Title`, Status values `Hold`/`Live`/`Pending`) — that tab is the OBS-facing broadcast queue and is **not** touched by this extension.

**Columns on the Chapter_ID tab, existing + new:**

| Column | Status | Notes |
|---|---|---|
| `ID` | existing | row id |
| `Chapter_ID` | existing | slug, e.g. `the-drift` |
| `Title` | existing | doubles as the alert's headline/tag — same role `Title` plays on the MESH alert tab |
| `Content` | existing | the Dispatch draft text — maps to `message` |
| `Status` | existing, **new values added** | `Draft` → `Revise` (editor loop) → `Approved` (founder-only; not permission-enforced yet, see below) → pipeline posts + logs → pipeline auto-sets `Live` (reuses the existing terminal value already used by the 9 real chapters — keeps the poll idempotent, no new vocabulary needed for "done") |
| `Canon_Notes` | existing | internal editorial notes, never published |
| `Settlement` | **new** | optional; maps to alert schema `settlement` |
| `Faction` | **new** | optional; maps to alert schema `faction` |
| `Cycle` | **new** | maps to alert schema `cycle` |
| `Category` | **new** | maps to alert schema `category` (same 7-value real vocabulary: `mesh`/`critical`/`covenant`/`resource`/`community`/`oasis`/`operator`) |
| `Author` | **new** | which Contributing Editor drafted it. No permission system exists yet (no Contributing Editors are onboarded currently) — this field exists so enforcement ("only the founder can set Approved") can be added later without another schema change. |

**Contributing Editor concept — reserved, not built:** No real permission-checking exists in this iteration (no auth infra). The `Author` column and the `Draft`/`Revise` vs `Approved` split establish the *shape* of the future workflow (editors can move Draft↔Revise; only the founder actually flips to Approved) as a convention, not an enforced rule, until real editors are onboarded.

**Pipeline behavior:**

1. Poll the Chapter_ID tab (interval TBD at implementation time) for rows with `Status = Approved`.
2. For each: build an alert record (`content`→message, plus settlement/faction/cycle/category/status/timestamp) and append to `data/alerts.json` via the same `alertStore.js` used by the manual CLI path.
3. Post to the same single Discord webhook, same embed format (faction color, category/faction tags) as the manual path — same `discord.js` module, no duplicate logic.
4. On success, write `Live` back to that row's `Status` cell in the sheet (requires write access to the sheet, not just read).

**Deferred — website story-feed publish target:** leave an explicit placeholder hook (e.g. an unimplemented `publishToWebsite()` no-op in `discord.js`'s sibling module, or a TODO-stubbed function called alongside the Discord post) for a future website integration. Not filled in now — the website/hosting target is actively changing. Building against the current setup would be wasted/wrong work; the hook exists so wiring in the new site later doesn't require touching the approval-detection logic again.

**New technical prerequisite, not previously in scope:** this requires real Google Sheets API access (read the Status/Content/etc. cells, write back `Live`) — a service account or OAuth credential, not yet set up anywhere in `nw-mesh-server`. This is a real implementation cost to size properly in the implementation plan, separate from the manual-CLI path which has zero external-auth dependencies.

## Next Step

All open items resolved as of 2026-08-19. No code has been written yet, per the brainstorming hard gate. Once the founder gives final go-ahead on this written spec, proceed to `writing-plans` for the implementation plan.
