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

// ── POST: receive survivor registration, write to Registrations tab ─
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss      = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create the Registrations sheet
    let sheet = ss.getSheetByName(REGISTRATIONS_TAB);
    if (!sheet) {
      sheet = ss.insertSheet(REGISTRATIONS_TAB);
      sheet.appendRow([
        'Timestamp', 'Handle', 'Email', 'Origin',
        'Brought', 'Roles', 'Source', 'Notes', 'Review Status'
      ]);
      // Freeze header row
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

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
