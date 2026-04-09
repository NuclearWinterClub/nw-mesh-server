# Nuclear Winter — MESH Server

**Nuclear Winter Club** is a post-apocalyptic themed industrial and dark electronic music stream and live event. The world is set in a near-future wasteland where survivors gather around a pirate broadcast called the Oasis signal. Every stream is a live transmission from inside that world — with factions, lore, characters, and a community built around the fiction.

This repo is the **MESH server**: the real-time relay backbone that pushes in-world text fragments (called transmissions) from operators and Discord directly onto the live stream overlay.

---

## What This Does

The MESH server runs three services simultaneously:

- **WebSocket server** (port `3001`) — overlay clients in OBS connect here and receive fragment broadcasts in real time
- **HTTP trigger API** (port `3002`) — authenticated POST/GET endpoints for firing fragments from external tools, bots, or scripts
- **Discord bot** — monitors `#oasis-broadcast` and broadcasts any message posted there as a fragment to the overlay

When a fragment is broadcast, it appears as a styled text overlay on the live stream.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Discord bot token ([create one here](https://discord.com/developers/applications))
  - Bot requires the **Message Content Intent** enabled in the Discord developer portal
  - Bot must be invited to your server with `Read Messages` and `Add Reactions` permissions
- The bot must be a member of the Discord server with access to `#oasis-broadcast`

---

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create your `.env` file**

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DISCORD_TOKEN=your_discord_bot_token_here
STREAM_KEY=your_stream_key_here
```

- `DISCORD_TOKEN` — your Discord bot token from the developer portal
- `STREAM_KEY` — a secret passphrase used to authenticate HTTP trigger requests; choose anything

**3. Run the server**

```bash
npm start
```

You should see:

```
☢  NUCLEAR WINTER — MESH SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   WebSocket : ws://localhost:3001
   HTTP      : http://localhost:3002
   Discord   : #oasis-broadcast
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Signal active. Oasis broadcasting.
```

---

## HTTP API

All endpoints require `key` set to your `STREAM_KEY`.

### `GET /` — Status check
```
curl http://localhost:3002/
```

### `GET /cmd` — Fire a preset command fragment
```
curl "http://localhost:3002/cmd?key=YOUR_KEY&command=!oasis"
```

Available commands: `!oasis`, `!mesh`, `!covenant`, `!dance`, `!bunker`, `!operator`, `!feral`, `!dolly`

### `POST /trigger` — Fire a custom fragment
```bash
curl -X POST http://localhost:3002/trigger \
  -H "Content-Type: application/json" \
  -d '{"key":"YOUR_KEY","cat":"mesh","header":"SIGNAL UPDATE","body":"All nodes holding."}'
```

Available categories: `mesh`, `covenant`, `resource`, `community`, `oasis`, `survivor`, `alert`

### `POST /survivor` — Post a survivor message
```bash
curl -X POST http://localhost:3002/survivor \
  -H "Content-Type: application/json" \
  -d '{"key":"YOUR_KEY","username":"Feral","message":"Still out here. Signal is weak but holding."}'
```

---

## Discord Message Format

Messages in `#oasis-broadcast` are automatically broadcast as fragments.

**Plain message** — sent as a `MESH // SURVIVOR` fragment with the sender's display name as the header.

**Categorized message** — prefix with `[category]`:
```
[mesh] FIELD REPORT :: All nodes are active. The signal holds.
```
Format: `[category] Header Text :: Body text`

If no `Header :: Body` separator is used, the sender's name becomes the header and the full message is the body.

---

## OBS Integration

Add a Browser Source in OBS pointed at the MESH overlay URL. The overlay connects to `ws://localhost:3001` and displays incoming fragments on screen.

The server must be running before OBS loads the browser source, or the overlay will show a disconnected state until it reconnects.
