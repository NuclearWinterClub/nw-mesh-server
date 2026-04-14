/**
 * NUCLEAR WINTER — Characters Sheet API
 * Google Apps Script — Web App
 *
 * SETUP:
 * 1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/1h7LrRXUAkHiWOSA7vJGg1bIvKoKK2SBZzmk3SkLdTPQ
 * 2. Extensions → Apps Script
 * 3. Paste this entire file, replacing any existing code
 * 4. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL
 * 6. Paste that URL into characters.html as the SCRIPT_URL constant
 *
 * SHEET COLUMNS (Characters tab — row 1 = headers, case-insensitive):
 *   Handle     — character name / callsign
 *   Faction    — Resistance, Covenant, Independent, Unknown, etc.
 *   Status     — Active, Inactive, MIA, Deceased, Unknown, etc.
 *   Role       — short description of their role (optional)
 *   Photo      — filename only, e.g. "forced-hand.jpg" (stored in website /photos/ folder)
 *   Bio        — full biography text
 *   Locked     — TRUE to show [CLASSIFIED] instead of bio
 *
 * Column order doesn't matter — headers are matched by name.
 */

const SHEET_NAME        = 'Characters';
const REGISTRATIONS_TAB = 'Registrations';

// ── GET: return Characters tab as JSON ──────────────────────────────
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ error: `Sheet "${SHEET_NAME}" not found` }, 404);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return jsonResponse([]);
    }

    // Normalize headers: trim whitespace, lowercase for matching
    const rawHeaders = data[0];
    const headers = rawHeaders.map(h => String(h).trim());

    const rows = data.slice(1)
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i];
        });
        return obj;
      })
      // Filter out completely empty rows (first column blank)
      .filter(row => row[headers[0]] !== '' && row[headers[0]] !== null && row[headers[0]] !== undefined);

    // Normalize the Locked field to a boolean
    const normalized = rows.map(row => {
      const out = {};
      for (const [k, v] of Object.entries(row)) {
        const key = k.trim();
        if (key.toLowerCase() === 'locked') {
          out[key] = (String(v).toUpperCase() === 'TRUE' || v === true);
        } else {
          out[key] = v;
        }
      }
      return out;
    });

    return jsonResponse(normalized);

  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ── POST: route by action field ──────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.action === 'log_fragment') return logFragment(payload);
    return handleRegistration(payload);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ── Fragment log: write to per-Settlement tab ────────────────────────
function logFragment(payload) {
  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = payload.grid || payload.settlement || 'MESH Log';
  let   sheet   = ss.getSheetByName(tabName);

  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Settlement', 'Date', 'Cycle', 'Grid', 'Type', 'Title', 'Content', 'Priority', 'Operator', 'Status']);
    sheet.setFrozenRows(1);
  }

  // Cycle number: weeks elapsed since Cycle 1 (March 25, 2025), zero-padded to 3 digits
  const CYCLE_ONE = new Date('2025-03-25T07:00:00Z'); // March 25, 2025 00:00 PDT
  const weeksSinceStart = Math.floor((new Date() - CYCLE_ONE) / (7 * 24 * 60 * 60 * 1000));
  const cycle = String(weeksSinceStart + 1).padStart(3, '0');

  sheet.appendRow([
    '',
    payload.settlement || '',
    payload.timestamp  || new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    cycle,
    payload.grid       || '',
    payload.cat        || '',
    payload.header     || '',
    payload.body       || '',
    payload.priority   || '',
    payload.operator   || '',
    '',
  ]);

  return jsonResponse({ success: true });
}

// ── Survivor registration: write to Registrations tab ───────────────
function handleRegistration(payload) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(REGISTRATIONS_TAB);

  if (!sheet) {
    sheet = ss.insertSheet(REGISTRATIONS_TAB);
    sheet.appendRow([
      'Timestamp', 'Handle', 'Email', 'Origin',
      'Brought', 'Roles', 'Source', 'Notes', 'Review Status'
    ]);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    payload.handle  || '',
    payload.email   || '',
    payload.origin  || '',
    payload.brought || '',
    Array.isArray(payload.roles) ? payload.roles.join(', ') : (payload.roles || ''),
    payload.source  || '',
    payload.notes   || '',
    'Pending'
  ]);

  return jsonResponse({ success: true });
}

function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
