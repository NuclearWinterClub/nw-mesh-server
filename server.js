require('dotenv').config();
const { WebSocketServer } = require('ws');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const express = require('express');
const http = require('http');

const CONFIG = {
  PORT:             parseInt(process.env.MESH_PORT)      || 3001,
  HTTP_PORT:        parseInt(process.env.MESH_HTTP_PORT) || 3002,
  DISCORD_TOKEN:    process.env.DISCORD_TOKEN,
  DISCORD_CHANNEL:  process.env.DISCORD_CHANNEL         || 'oasis-broadcast',
  STREAM_KEY:       process.env.STREAM_KEY,
  SETTLEMENT_NAME:  process.env.SETTLEMENT_NAME          || 'The Oasis',
  SETTLEMENT_GRID:  process.env.SETTLEMENT_GRID          || '6-F1',
};

const CATEGORIES = {
  mesh:      { label: 'MESH // NETWORK',       priority: 'low'  },
  covenant:  { label: 'MESH // COVENANT',      priority: 'high' },
  resource:  { label: 'MESH // RESOURCE',      priority: 'low'  },
  community: { label: 'MESH // COMMUNITY',     priority: 'low'  },
  oasis:     { label: `${process.env.SETTLEMENT_NAME || 'OASIS'} // TRANSMISSION`, priority: 'low'  },
  survivor:  { label: 'MESH // SURVIVOR',      priority: 'low'  },
  alert:     { label: 'MESH // ALERT',         priority: 'high' },
};

const COMMAND_FRAGMENTS = {
  '!oasis':    { cat: 'oasis',    header: 'OASIS SIGNAL',    body: 'You have found the frequency. Nuclear Winter is broadcasting. Survivors — you are not alone tonight.' },
  '!mesh':     { cat: 'mesh',     header: 'MESH STATUS',     body: 'MESH network stability nominal. All primary nodes active. Signal holding.' },
  '!covenant': { cat: 'covenant', header: 'COVENANT ACTIVITY', body: 'Covenant signal traffic detected on monitored frequencies. Maintain radio discipline. Stay dark.' },
  '!dance':    { cat: 'oasis',    header: 'DIRECTIVE',       body: 'The Covenant told you the world was dead. The music says otherwise. Dance accordingly.' },
  '!bunker':   { cat: 'community',header: 'BUNKER STATUS',   body: 'All sectors holding. Community intact. The signal reaches further than they know.' },
  '!operator': { cat: 'oasis',    header: '#WHOISTHEOPERATOR', body: 'The Operator holds the frequency. Who — or what — chose them remains an open question. As it should.' },
  '!feral':    { cat: 'community',header: 'FIELD REPORT',    body: 'Feral is active in the field. Status: moving. Purpose: her own. Oasis is watching.' },
  '!dolly':    { cat: 'community',header: 'ARCHIVE ENTRY',   body: 'Dolly has filed a new entry. The community memory grows. Nothing is forgotten here.' },
};

const wss = new WebSocketServer({ port: CONFIG.PORT });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[MESH] Update Bar connected. Active connections: ${clients.size}`);
  ws.on('close', () => { clients.delete(ws); console.log(`[MESH] Disconnected. Active: ${clients.size}`); });
  ws.on('error', () => clients.delete(ws));
  ws.send(JSON.stringify({ type: 'status', message: 'MESH server connected.' }));
});

function broadcast(fragment) {
  const payload = JSON.stringify({ type: 'fragment', ...fragment });
  let sent = 0;
  clients.forEach(ws => { if (ws.readyState === 1) { ws.send(payload); sent++; } });
  console.log(`[MESH] Broadcast to ${sent} client(s): [${fragment.cat}] ${fragment.header}`);
  logToSheet(fragment);
}

// ── SHEET LOGGING ─────────────────────────────────────────────────
const SHEET_SCRIPT_URL = process.env.SHEET_SCRIPT_URL || '';

function logToSheet(fragment) {
  if (!SHEET_SCRIPT_URL) return;
  const payload = JSON.stringify({
    action:     'log_fragment',
    settlement: CONFIG.SETTLEMENT_NAME,
    grid:       CONFIG.SETTLEMENT_GRID,
    timestamp:  new Date().toLocaleString('en-US', { timeZone: process.env.SETTLEMENT_TIMEZONE || 'America/Los_Angeles' }),
    cat:        fragment.cat   || '',
    header:     fragment.header || '',
    body:       fragment.body   || '',
    priority:   fragment.priority || 'low',
    operator:   fragment.operator || '',
  });

  fetch(SHEET_SCRIPT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    payload,
  }).catch(err => console.warn('[MESH] Sheet log failed:', err.message));
}
// ─────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ status: 'MESH server active', clients: clients.size, uptime: Math.floor(process.uptime()) + 's' }));

app.get('/cmd', (req, res) => {
  const { key, command } = req.query;
  if (key !== CONFIG.STREAM_KEY) return res.status(401).send('Invalid key');
  if (command && COMMAND_FRAGMENTS[command]) {
    broadcast({ ...COMMAND_FRAGMENTS[command] });
    return res.send('Signal transmitted.');
  }
  res.send('Unknown command.');
});

app.post('/trigger', (req, res) => {
  const { key, command, cat, header, body, username } = req.body;
  if (key !== CONFIG.STREAM_KEY) return res.status(401).json({ error: 'Invalid stream key' });
  if (command && COMMAND_FRAGMENTS[command]) {
    broadcast({ ...COMMAND_FRAGMENTS[command] });
    return res.json({ ok: true });
  }
  if (cat && header && body) {
    const catConfig = CATEGORIES[cat] || CATEGORIES.community;
    broadcast({ cat, label: catConfig.label, header: header.toUpperCase(), body, priority: catConfig.priority, duration: 15000 });
    return res.json({ ok: true });
  }
  res.status(400).json({ error: 'Missing fields' });
});

app.post('/survivor', (req, res) => {
  const { key, username, message } = req.body;
  if (key !== CONFIG.STREAM_KEY) return res.status(401).json({ error: 'Invalid key' });
  if (!username || !message) return res.status(400).json({ error: 'Missing fields' });
  broadcast({ cat: 'survivor', label: 'MESH // SURVIVOR', header: username.toUpperCase(), body: message.substring(0, 200), priority: 'low', duration: 15000 });
  res.json({ ok: true });
});

const httpServer = http.createServer(app);
httpServer.listen(CONFIG.HTTP_PORT, () => console.log(`[HTTP] Trigger server on port ${CONFIG.HTTP_PORT}`));

// ── STARTUP BANNER ────────────────────────────────────────────────
console.log('');
console.log('☢  NUCLEAR WINTER — MESH SERVER');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`   Settlement : ${CONFIG.SETTLEMENT_NAME} [${CONFIG.SETTLEMENT_GRID}]`);
console.log(`   WebSocket  : ws://localhost:${CONFIG.PORT}`);
console.log(`   HTTP       : http://localhost:${CONFIG.HTTP_PORT}`);
console.log(`   Discord    : #${CONFIG.DISCORD_CHANNEL}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`   Signal active. ${CONFIG.SETTLEMENT_NAME} broadcasting.`);
console.log('');

// ── DISCORD ───────────────────────────────────────────────────────
const PLACEHOLDER_TOKEN = 'your_discord_bot_token_here';
if (!CONFIG.DISCORD_TOKEN || CONFIG.DISCORD_TOKEN === PLACEHOLDER_TOKEN) {
  console.log('[DISCORD] No token configured — Discord integration disabled.');
} else {
  const discord = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

  discord.once(Events.ClientReady, (client) => {
    console.log(`[DISCORD] Bot online as ${client.user.tag}`);
    console.log(`[DISCORD] Watching: #${CONFIG.DISCORD_CHANNEL}`);
  });

  discord.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;
    if (message.channel.name !== CONFIG.DISCORD_CHANNEL) return;
    const content = message.content.trim();
    const username = message.member?.displayName || message.author.username;
    const prefixMatch = content.match(/^\[(\w+)\]\s*(.+)/s);
    let frag;
    if (prefixMatch) {
      const cat = prefixMatch[1].toLowerCase();
      const body = prefixMatch[2].trim();
      const catConfig = CATEGORIES[cat] || CATEGORIES.community;
      const headerMatch = body.match(/^([^:]{3,40})\s*::\s*(.+)/s);
      frag = {
        cat: Object.keys(CATEGORIES).includes(cat) ? cat : 'community',
        label: catConfig.label,
        header: headerMatch ? headerMatch[1].trim().toUpperCase() : username.toUpperCase(),
        body: headerMatch ? headerMatch[2].trim() : body,
        priority: catConfig.priority,
        duration: 15000
      };
    } else {
      frag = { cat: 'survivor', label: 'MESH // SURVIVOR', header: username.toUpperCase(), body: content.substring(0, 200), priority: 'low', duration: 15000 };
    }
    broadcast(frag);
    message.react('📡').catch(() => {});
    console.log(`[DISCORD] Fragment from ${username}: [${frag.cat}] ${frag.header}`);
  });

  discord.on(Events.Error, (err) => console.error('[DISCORD] Error:', err.message));
  discord.login(CONFIG.DISCORD_TOKEN).catch(err => console.error('[DISCORD] Login failed:', err.message));
}
