/*
  Loads upcoming shows from a Google Sheet published as CSV and renders them
  into the shows section. The section's data-shows attribute tracks the state
  (loading, ready, empty, error) and the CSS shows the matching message.

  Sheet columns (header row, any order, case-insensitive):
    date     Show date as YYYY-MM-DD, e.g. 2026-11-14
    venue    Venue name
    city     City and state, e.g. Fremont, California
    time     Optional, free text, e.g. 8:00 PM
    tickets  Optional, full URL to the ticket page
*/

(function () {
  var SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrm3g3L5_9WOA-wGDGofFTxhQhCrkVYxjRlwDb2-GaQPDkddT-drZ5-MW3wX1KuZ73Wad4m5DlTbTW/pub?gid=0&single=true&output=csv';

  var TIMEOUT_MS = 12000;

  var section = document.getElementById('shows');
  var list = document.querySelector('.shows-list');
  if (!section || !list) return;

  var configured = SHEET_CSV_URL.indexOf('http') === 0;
  if (!configured) { setState('empty'); return; }

  setState('loading');

  var controller = typeof AbortController === 'function' ? new AbortController() : null;
  var timer = setTimeout(function () { if (controller) controller.abort(); }, TIMEOUT_MS);

  fetch(SHEET_CSV_URL, { cache: 'no-store', signal: controller ? controller.signal : undefined })
    .then(function (res) {
      if (!res.ok) throw new Error('Sheet request failed: ' + res.status);
      return res.text();
    })
    .then(function (text) {
      var shows = parseCsv(text).map(toShow).filter(isUpcoming);
      shows.sort(function (a, b) { return a.date - b.date; });
      if (!shows.length) { setState('empty'); return; }
      list.innerHTML = '';
      shows.forEach(function (show) { list.appendChild(render(show)); });
      setState('ready');
    })
    .catch(function (err) {
      console.warn('Could not load shows:', err);
      setState('error');
    })
    .then(function () { clearTimeout(timer); });

  function setState(state) {
    section.setAttribute('data-shows', state);
  }

  // Minimal RFC 4180 parser: handles quoted fields, embedded commas, and
  // doubled quotes. Returns an array of objects keyed by the header row.
  function parseCsv(text) {
    var rows = [], row = [], field = '', inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { field += c; }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field); field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        rows.push(row); row = [];
      } else {
        field += c;
      }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }

    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var obj = {};
      headers.forEach(function (h, idx) { obj[h] = (r[idx] || '').trim(); });
      return obj;
    });
  }

  function toShow(row) {
    return {
      date: parseDate(row.date),
      venue: row.venue || '',
      city: row.city || '',
      time: row.time || '',
      tickets: row.tickets || ''
    };
  }

  // Accepts YYYY-MM-DD. Also tolerates M/D/YYYY in case the sheet is set to
  // US date formatting. Builds a local-time date so the day doesn't shift.
  function parseDate(s) {
    if (!s) return null;
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
    var d = new Date(s);
    return isNaN(d) ? null : d;
  }

  function isUpcoming(show) {
    if (!show.date || !show.venue) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return show.date >= today;
  }

  function render(show) {
    var li = el('li', 'show');

    var date = el('div', 'show-date');
    date.appendChild(el('span', 'show-month', show.date.toLocaleString('en-US', { month: 'short' })));
    date.appendChild(el('span', 'show-day', String(show.date.getDate())));
    li.appendChild(date);

    var info = el('div', 'show-info');
    info.appendChild(el('h3', 'show-venue', show.venue));
    var place = [show.city, show.time].filter(Boolean).join(' · ');
    if (place) info.appendChild(el('p', 'show-place', place));
    li.appendChild(info);

    if (show.tickets && /^https?:\/\//i.test(show.tickets)) {
      var action = el('div', 'show-action');
      var a = el('a', 'button button-small', 'Tickets');
      a.href = show.tickets;
      a.target = '_blank';
      a.rel = 'noopener';
      action.appendChild(a);
      li.appendChild(action);
    }

    return li;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
})();
