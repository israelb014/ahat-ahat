'use strict';

/* ============================================================
   אחת אחת — מעקב בלחיצה אחת
   ============================================================ */

const APP_VERSION = '1.0.0';
const STORAGE_KEY = 'ahat-ahat-v1';
const MAX_BUTTONS = 10;
const DAY_MS = 86400000;

/* ---------- Palette & units ---------- */

const PALETTE = [
  '#FF6B5B', // coral
  '#FFB547', // amber
  '#B5E05A', // lime
  '#3DDC97', // mint
  '#2EC4C9', // teal
  '#4EA8FF', // sky
  '#7C7CFF', // indigo
  '#B57BFF', // violet
  '#FF6FB5', // pink
  '#D9B48F', // sand
];
const C = {
  coral: PALETTE[0], amber: PALETTE[1], lime: PALETTE[2], mint: PALETTE[3], teal: PALETTE[4],
  sky: PALETTE[5], indigo: PALETTE[6], violet: PALETTE[7], pink: PALETTE[8], sand: PALETTE[9],
};

const UNITS = ['מ"ל', 'גרם', 'דקות', 'קומות', 'פעמים', ''];

/* ---------- Icons (inline SVG, 24x24 stroke) ---------- */

const ICONS = {
  bottle: '<path d="M9.5 2.5h5M10.5 2.5v3L8 9v11a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 20V9l-2.5-3.5v-3"/><path d="M8 13h4M8 16.5h4"/>',
  cup: '<path d="M5 4h14l-1.6 15.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8z"/><path d="M5.6 9.5c2.2-1 4.3 1 6.4 0s4.2-1 6.4 0"/>',
  diaper: '<path d="M3 6.5h18v3.5c0 5-4 9.5-9 9.5S3 15 3 10z"/><path d="M3 10.5c2.5 0 4 1.5 4.6 4M21 10.5c-2.5 0-4 1.5-4.6 4"/><path d="M9 6.5v2M15 6.5v2"/>',
  moon: '<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
  pill: '<path d="M10.5 20.5a5 5 0 0 1-7-7l6.5-6.5a5 5 0 0 1 7 7z"/><path d="M7 10l7 7"/>',
  note: '<path d="M14.5 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-10z"/><path d="M14 3v5.5h6M8 13h8M8 17h5"/>',
  plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18M3.5 9h17M3.5 15h17"/>',
  tree: '<path d="M12 21.5v-5"/><path d="M12 2.5 18 10h-3l4 6.5H5L9 10H6z"/>',
  screen: '<rect x="2.5" y="4" width="19" height="12.5" rx="2.5"/><path d="M8.5 21h7M12 16.5V21"/>',
  toilet: '<path d="M6 2.5h5.5V10H6z"/><path d="M4 10h16c0 4.2-3.6 7.5-8 7.5S4 14.2 4 10z"/><path d="M9 17.2 8 21.5h8l-1-4.3"/>',
  drop: '<path d="M12 2.8s6.8 7.2 6.8 12.2a6.8 6.8 0 0 1-13.6 0C5.2 10 12 2.8 12 2.8z"/><path d="M9 15.5a3 3 0 0 0 3 3"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  stairs: '<path d="M3 20.5h5v-5h4.5v-5H17v-5h4"/>',
  bike: '<circle cx="5.5" cy="16.5" r="3.7"/><circle cx="18.5" cy="16.5" r="3.7"/><path d="M5.5 16.5 9 9h6.5l3 7.5M9 9l3.5 7.5h-7M13.5 5.5h3L15.5 9"/>',
  walk: '<circle cx="13.5" cy="4.2" r="1.9"/><path d="M8.5 21.5 11 15l3 2.8v3.7M7 11.5l3-3.6 3.6.6 2 3.6 2.8 1M11 15l1.8-6.5"/>',
  heart: '<path d="M12 20.5s-8.5-5-8.5-11.2A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.7c0 6.2-8.5 11.2-8.5 11.2z"/>',
  star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.4l-5.6 3 1.1-6.3L3 9.7l6.2-.9z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
};
const ICON_ORDER = ['bottle', 'cup', 'diaper', 'moon', 'sun', 'pill', 'note', 'plate', 'ball', 'tree',
  'screen', 'toilet', 'drop', 'dumbbell', 'stairs', 'bike', 'walk', 'heart', 'star', 'plus'];
const ICON_NAMES = {
  bottle: 'בקבוק', cup: 'כוס', diaper: 'טיטול', moon: 'ירח', sun: 'שמש', pill: 'תרופה', note: 'הערה',
  plate: 'צלחת', ball: 'כדור', tree: 'עץ', screen: 'מסך', toilet: 'אסלה', drop: 'טיפה', dumbbell: 'משקולת',
  stairs: 'מדרגות', bike: 'אופניים', walk: 'הליכה', heart: 'לב', star: 'כוכב', plus: 'פלוס',
};

const UI = {
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z"/>',
  chart: '<path d="M4 20h16"/><path d="M7 16v-5M12 16V6M17 16v-8"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  chevPrev: '<path d="m9 6 6 6-6 6"/>',   // RTL: previous points right
  chevNext: '<path d="m15 6-6 6 6 6"/>',  // RTL: next points left
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  edit: '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12.5A1.5 1.5 0 0 0 8 21h8a1.5 1.5 0 0 0 1.5-1.5L18.5 7M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  download: '<path d="M12 3.5v12M7 11l5 5 5-5M4.5 20.5h15"/>',
  upload: '<path d="M12 16V4M7 8.5l5-5 5 5M4.5 20.5h15"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tap: '<circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8.5" opacity=".45"/>',
};

function svg(inner, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
const icon = (name, cls) => svg(ICONS[name] || ICONS.star, cls);
const ui = (name, cls) => svg(UI[name], cls);

/* ---------- Templates ---------- */

const MEALS = ['בוקר', 'צהריים', 'ערב', 'נשנוש'];
const DIAPER = { label: 'טיטול', icon: 'diaper', color: C.amber, options: ['פיפי', 'קקי', 'שניהם'], defaultOption: 'פיפי' };
const SLEEP = { label: 'שינה', kind: 'duration', startLabel: 'נרדם', endLabel: 'קם', icon: 'moon', color: C.indigo };
const MISC = { label: 'תרופה/שונות', icon: 'pill', color: C.pink };

const TEMPLATES = {
  baby: {
    name: 'תינוק 0-1', icon: 'bottle', color: C.coral,
    buttons: [
      { label: 'אכל', icon: 'bottle', color: C.coral, amount: 120, unit: 'מ"ל' },
      { label: 'שתה', icon: 'cup', color: C.sky, amount: 30, unit: 'מ"ל' },
      DIAPER, SLEEP, MISC,
    ],
  },
  toddler: {
    name: 'פעוט 1-3', icon: 'ball', color: C.lime,
    buttons: [
      { label: 'ארוחה', icon: 'plate', color: C.lime, options: MEALS, defaultOption: 'בוקר' },
      { label: 'שתה', icon: 'cup', color: C.sky, amount: 100, unit: 'מ"ל' },
      DIAPER, SLEEP, MISC,
    ],
  },
  kid: {
    name: 'ילד 3+', icon: 'star', color: C.amber,
    buttons: [
      { label: 'שירותים', icon: 'toilet', color: C.teal },
      { label: 'פספוס', icon: 'drop', color: C.amber },
      { label: 'משחק בחצר', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'tree', color: C.mint },
      { label: 'מסך', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'screen', color: C.violet },
      { label: 'ארוחה', icon: 'plate', color: C.coral, options: MEALS, defaultOption: 'בוקר' },
      MISC,
    ],
  },
  senior: {
    name: 'קשיש', icon: 'heart', color: C.pink,
    buttons: [
      { label: 'תרופות', icon: 'pill', color: C.pink, options: ['בוקר', 'צהריים', 'ערב'], defaultOption: 'בוקר' },
      { label: 'שתה', icon: 'cup', color: C.sky, amount: 200, unit: 'מ"ל' },
      { label: 'שירותים', icon: 'toilet', color: C.teal },
      { label: 'הליכה', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'walk', color: C.lime },
      { label: 'ארוחה', icon: 'plate', color: C.amber },
      { label: 'לחץ דם', icon: 'heart', color: C.coral },
    ],
  },
  sport: {
    name: 'ספורט', icon: 'dumbbell', color: C.sky,
    buttons: [
      { label: 'מים', icon: 'drop', color: C.sky, amount: 250, unit: 'מ"ל' },
      { label: 'משקולות', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'dumbbell', color: C.coral },
      { label: 'מדרגות', icon: 'stairs', color: C.amber, amount: 5, unit: 'קומות' },
      { label: 'רכיבה', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'bike', color: C.mint },
      { label: 'ארוחת חלבון', icon: 'plate', color: C.violet, amount: 30, unit: 'גרם' },
    ],
  },
  empty: { name: 'ריק', icon: 'plus', color: C.sand, buttons: [] },
};

/* ---------- Utils ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtTime = ts => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtDur = ms => { const m = Math.max(0, Math.round(ms / 60000)); return `${Math.floor(m / 60)}:${pad(m % 60)}`; };
const fmtNum = n => (Math.round(n * 10) / 10).toLocaleString('he-IL');
const startOfDay = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
const addDays = (ts, n) => { const d = new Date(ts); d.setDate(d.getDate() + n); return startOfDay(d.getTime()); };
const hexRgb = hex => { const h = hex.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(','); };
const colorVars = hex => `--c:${hex};--c-rgb:${hexRgb(hex)}`;
const wrapLabel = s => esc(s).replace(/\//g, '/<wbr>');
const unitText = (amount, unit) => unit ? `${fmtNum(amount)} ${unit}` : fmtNum(amount);

/* ---------- State ---------- */

const defaultState = () => ({ version: 1, currentProfileId: null, profiles: [], events: [] });

function isValidState(s) {
  return !!s && typeof s === 'object' && s.version === 1 &&
    Array.isArray(s.profiles) && Array.isArray(s.events) &&
    s.profiles.every(p => p && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.buttons)) &&
    s.events.every(e => e && typeof e.id === 'string' && typeof e.start === 'number');
}

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isValidState(s)) return s;
  } catch (e) { /* ignore */ }
  return defaultState();
}

let state = loadState();

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { toast('השמירה נכשלה — אין מקום פנוי'); }
}

function currentProfile() {
  return state.profiles.find(p => p.id === state.currentProfileId) || state.profiles[0] || null;
}

function makeButton(def = {}) {
  const kind = def.kind === 'duration' ? 'duration' : 'instant';
  return {
    id: uid(),
    label: def.label || '',
    kind,
    startLabel: kind === 'duration' ? (def.startLabel || 'התחיל') : '',
    endLabel: kind === 'duration' ? (def.endLabel || 'סיים') : '',
    color: def.color || PALETTE[0],
    icon: def.icon || 'star',
    amount: def.amount ?? null,
    unit: def.unit || '',
    options: [...(def.options || [])],
    defaultOption: def.defaultOption || (def.options && def.options[0]) || null,
  };
}

function createProfile(name, templateKey) {
  const t = TEMPLATES[templateKey] || TEMPLATES.empty;
  const p = { id: uid(), name, template: templateKey, buttons: t.buttons.map(makeButton) };
  state.profiles.push(p);
  state.currentProfileId = p.id;
  save();
  return p;
}

const activeEvent = (profileId, buttonId) =>
  state.events.find(e => e.profileId === profileId && e.buttonId === buttonId && e.kind === 'duration' && e.end == null);

function closeActiveEvents(profileId, buttonIds) {
  const now = Date.now();
  state.events.forEach(e => {
    if (e.profileId === profileId && e.kind === 'duration' && e.end == null && (!buttonIds || buttonIds.includes(e.buttonId))) e.end = now;
  });
}

function newEvent(p, b, now) {
  return {
    id: uid(), profileId: p.id, buttonId: b.id, label: b.label, kind: b.kind,
    start: now, end: null,
    amount: b.unit ? (b.amount ?? null) : null,
    unit: b.unit || '',
    option: b.options.length ? (b.defaultOption || b.options[0]) : null,
    note: '',
  };
}

/* ---------- UI state ---------- */

let tab = 'main';
let viewDay = startOfDay(Date.now());

/* ---------- Rendering: shell ---------- */

function renderShell() {
  const p = currentProfile();
  $('#profileName').textContent = p ? p.name : '';
  $$('.tab').forEach(t => {
    const on = t.dataset.tab === tab;
    t.classList.toggle('on', on);
    t.setAttribute('aria-current', on ? 'page' : 'false');
  });
}

function render() {
  renderShell();
  const view = $('#view');
  const p = currentProfile();
  if (!p) { view.innerHTML = ''; return; }
  if (tab === 'main') view.innerHTML = mainHTML(p);
  else if (tab === 'data') view.innerHTML = dataHTML(p);
  else view.innerHTML = settingsHTML(p);
  view.dataset.tab = tab;
  if (tab === 'data') requestAnimationFrame(() => $$('.ring-prog', view).forEach(r => r.classList.add('in')));
}

function switchTab(t) {
  if (t === tab) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  tab = t;
  if (t === 'data') viewDay = startOfDay(Date.now());
  window.scrollTo(0, 0);
  const view = $('#view');
  view.classList.remove('enter');
  render();
  void view.offsetWidth;
  view.classList.add('enter');
}

/* ---------- Main screen ---------- */

function tapButtonHTML(p, b, i) {
  const act = b.kind === 'duration' ? activeEvent(p.id, b.id) : null;
  return `
  <button class="tap ${b.kind === 'duration' ? 'is-duration' : ''} ${act ? 'active' : ''}" style="${colorVars(b.color)};--i:${i}" data-action="press" data-id="${b.id}" aria-pressed="${act ? 'true' : 'false'}">
    <svg class="tap-ring" aria-hidden="true"><rect class="tap-ring-track" x="2" y="2" rx="22" pathLength="100"/><rect class="tap-ring-run" x="2" y="2" rx="22" pathLength="100"/></svg>
    <span class="tap-ic">${icon(b.icon)}</span>
    <span class="tap-label">${wrapLabel(b.label)}</span>
    ${b.kind === 'duration' ? `<span class="tap-action">${esc(act ? b.endLabel : b.startLabel)}</span>` : ''}
  </button>`;
}

function mainHTML(p) {
  if (!p.buttons.length) {
    return `
    <section class="empty-state card">
      <div class="empty-ic">${ui('tap')}</div>
      <h2>אין עדיין כפתורים</h2>
      <p>הוסיפו כפתורים בהגדרות, או החילו תבנית מוכנה.</p>
      <button class="btn btn-primary" data-action="goto-settings">${ui('gear')}<span>להגדרות</span></button>
    </section>`;
  }
  return `<section class="grid">${p.buttons.map((b, i) => tapButtonHTML(p, b, i)).join('')}</section>`;
}

function press(el) {
  const p = currentProfile();
  const b = p && p.buttons.find(x => x.id === el.dataset.id);
  if (!b) return;
  const now = Date.now();
  if (b.kind === 'duration') {
    const act = activeEvent(p.id, b.id);
    if (act) act.end = now;
    else state.events.push(newEvent(p, b, now));
    const on = !act;
    el.classList.toggle('active', on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
    const a = $('.tap-action', el);
    if (a) a.textContent = on ? b.endLabel : b.startLabel;
  } else {
    state.events.push(newEvent(p, b, now));
  }
  save();
  if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) { /* ignore */ } }
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
}

/* ---------- Data screen ---------- */

function dayLabel(ts) {
  const today = startOfDay(Date.now());
  if (ts === today) return 'היום';
  if (ts === addDays(today, -1)) return 'אתמול';
  const d = new Date(ts);
  const wd = d.toLocaleDateString('he-IL', { weekday: 'long' });
  return wd;
}
function dayDate(ts) {
  const d = new Date(ts);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

function eventsForDay(p, day) {
  const end = addDays(day, 1);
  return state.events.filter(e => e.profileId === p.id && e.start >= day && e.start < end);
}

function summarize(p, evs) {
  const now = Date.now();
  const groups = new Map();
  p.buttons.forEach(b => groups.set(b.id, { id: b.id, label: b.label, color: b.color, icon: b.icon, kind: b.kind, unit: b.unit, options: [...b.options], evs: [] }));
  evs.slice().sort((a, b) => a.start - b.start).forEach(e => {
    if (!groups.has(e.buttonId)) {
      groups.set(e.buttonId, { id: e.buttonId, label: e.label || 'כפתור שנמחק', color: '#6B7285', icon: 'note', kind: e.kind || (e.end != null ? 'duration' : 'instant'), unit: e.unit || '', options: [], evs: [], deleted: true });
    }
    groups.get(e.buttonId).evs.push(e);
  });
  const list = [...groups.values()].map(g => {
    const s = { ...g, count: g.evs.length, amount: 0, hasAmount: false, dur: 0, opts: [] };
    const optCounts = new Map(g.options.map(o => [o, 0]));
    g.evs.forEach(e => {
      if (typeof e.amount === 'number' && e.unit) { s.amount += e.amount; s.hasAmount = true; if (!s.unit) s.unit = e.unit; }
      if (g.kind === 'duration') s.dur += (e.end ?? now) - e.start;
      if (e.option) optCounts.set(e.option, (optCounts.get(e.option) || 0) + 1);
    });
    s.opts = [...optCounts.entries()];
    return s;
  });
  const maxCount = Math.max(1, ...list.filter(s => s.kind !== 'duration').map(s => s.count));
  list.forEach(s => {
    s.pct = s.kind === 'duration' ? Math.min(1, s.dur / DAY_MS) : s.count / maxCount;
  });
  return list;
}

function ringHTML(s) {
  let main, sub;
  if (s.kind === 'duration') { main = fmtDur(s.dur); sub = 'שעות'; }
  else if (s.hasAmount && s.unit && s.unit !== 'פעמים') { main = fmtNum(s.amount); sub = s.unit; }
  else { main = String(s.count); sub = s.count === 1 ? 'פעם' : 'פעמים'; }
  const off = 100 - s.pct * 100;
  return `
  <div class="ring">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle class="ring-track" cx="50" cy="50" r="42" pathLength="100"/>
      ${s.pct > 0 ? `<circle class="ring-prog" cx="50" cy="50" r="42" pathLength="100" style="--off:${off}"/>` : ''}
    </svg>
    <div class="ring-val"><b>${esc(main)}</b><small>${esc(sub)}</small></div>
  </div>`;
}

function summaryCardHTML(s, i) {
  const showCount = s.kind === 'duration' || (s.hasAmount && s.unit && s.unit !== 'פעמים');
  const opts = s.opts.filter(([, n]) => n > 0 || s.options.length);
  return `
  <article class="sum card ${s.count ? '' : 'zero'} ${s.deleted ? 'deleted' : ''}" style="${colorVars(s.color)};--i:${i}">
    ${ringHTML(s)}
    <div class="sum-label"><span class="sum-ic">${icon(s.icon)}</span>${esc(s.label)}</div>
    ${showCount ? `<div class="sum-sub">${s.count} ${s.count === 1 ? 'פעם' : 'פעמים'}</div>` : ''}
    ${opts.length ? `<div class="sum-opts">${opts.map(([o, n]) => `<span class="chip ${n ? '' : 'dim'}">${esc(o)} <b>${n}</b></span>`).join('')}</div>` : ''}
  </article>`;
}

function eventMeta(p, e) {
  const b = p.buttons.find(x => x.id === e.buttonId);
  return {
    label: b ? b.label : (e.label || 'כפתור שנמחק'),
    color: b ? b.color : '#6B7285',
    icon: b ? b.icon : 'note',
    kind: e.kind || (b ? b.kind : 'instant'),
  };
}

function timelineHTML(p, evs) {
  if (!evs.length) {
    return `<div class="tl-empty card">${ui('clock')}<span>אין רישומים ביום הזה</span></div>`;
  }
  const now = Date.now();
  const items = evs.slice().sort((a, b) => b.start - a.start).map((e, i) => {
    const m = eventMeta(p, e);
    const bits = [];
    if (e.option) bits.push(`<span class="chip">${esc(e.option)}</span>`);
    if (typeof e.amount === 'number' && e.unit) bits.push(`<span>${esc(unitText(e.amount, e.unit))}</span>`);
    if (m.kind === 'duration') {
      bits.push(e.end != null
        ? `<span>${fmtTime(e.start)}–${fmtTime(e.end)} · ${fmtDur(e.end - e.start)} שעות</span>`
        : `<span class="live"><i></i>פעיל · ${fmtDur(now - e.start)} שעות</span>`);
    }
    return `
    <li style="${colorVars(m.color)};--i:${i}">
      <button class="tl-item" data-action="edit-event" data-id="${e.id}">
        <time>${fmtTime(e.start)}</time>
        <span class="tl-dot">${icon(m.icon)}</span>
        <span class="tl-main">
          <span class="tl-title">${esc(m.label)}</span>
          ${bits.length ? `<span class="tl-meta">${bits.join('')}</span>` : ''}
          ${e.note ? `<span class="tl-note">${esc(e.note)}</span>` : ''}
        </span>
        ${ui('chevNext', 'tl-go')}
      </button>
    </li>`;
  });
  return `<ol class="timeline">${items.join('')}</ol>`;
}

function dataHTML(p) {
  const today = startOfDay(Date.now());
  const evs = eventsForDay(p, viewDay);
  const sums = summarize(p, evs);
  return `
  <h1 class="page-title">נתונים</h1>
  <div class="daypick card">
    <button class="icon-btn" data-action="day-prev" aria-label="יום קודם">${ui('chevPrev')}</button>
    <div class="daypick-label"><b>${esc(dayLabel(viewDay))}</b><small>${dayDate(viewDay)}</small></div>
    <button class="icon-btn" data-action="day-next" aria-label="יום הבא" ${viewDay >= today ? 'disabled' : ''}>${ui('chevNext')}</button>
  </div>
  ${sums.length ? `<section class="sums">${sums.map(summaryCardHTML).join('')}</section>` : ''}
  <h2 class="section-title">ציר זמן</h2>
  ${timelineHTML(p, evs)}`;
}

/* ---------- Event editor ---------- */

function timeInputValue(ts) { return ts == null ? '' : fmtTime(ts); }
function applyTime(baseTs, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(baseTs);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

function openEventEditor(id) {
  const p = currentProfile();
  const e = state.events.find(x => x.id === id);
  if (!e) return;
  const m = eventMeta(p, e);
  const b = p.buttons.find(x => x.id === e.buttonId);
  const options = b && b.options.length ? b.options.slice() : [];
  if (e.option && !options.includes(e.option)) options.push(e.option);
  const showAmount = !!e.unit || typeof e.amount === 'number';
  const isDur = m.kind === 'duration';

  openSheet(`
    <div class="sheet-head" style="${colorVars(m.color)}">
      <span class="sheet-ic">${icon(m.icon)}</span>
      <div><h2>${esc(m.label)}</h2><small>${esc(dayDate(e.start))}</small></div>
    </div>
    <form class="form" id="eventForm" autocomplete="off">
      <div class="row2">
        <label class="field"><span>${isDur ? 'התחלה' : 'שעה'}</span><input type="time" name="start" value="${timeInputValue(e.start)}" required></label>
        ${isDur ? `<label class="field"><span>סיום</span><input type="time" name="end" value="${timeInputValue(e.end)}"><em>${e.end == null ? 'ריק = עדיין פעיל' : ''}</em></label>` : ''}
      </div>
      ${showAmount ? `<label class="field"><span>כמות</span><div class="with-unit"><input type="number" inputmode="decimal" step="any" min="0" name="amount" value="${e.amount ?? ''}">${e.unit ? `<i>${esc(e.unit)}</i>` : ''}</div></label>` : ''}
      ${options.length ? `<fieldset class="field"><span>אפשרות</span><div class="seg wrap">${options.map(o => `
        <label class="seg-opt"><input type="radio" name="option" value="${esc(o)}" ${o === e.option ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div></fieldset>` : ''}
      <label class="field"><span>הערה</span><textarea name="note" rows="3" placeholder="${m.label === 'לחץ דם' ? 'למשל 120/80' : 'הערה חופשית'}">${esc(e.note || '')}</textarea></label>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">${ui('check')}<span>שמירה</span></button>
        <button type="button" class="btn btn-ghost-danger" data-action="delete-event" data-id="${e.id}">${ui('trash')}<span>מחיקה</span></button>
      </div>
    </form>`);

  $('#eventForm').addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const st = f.get('start');
    if (!st) return;
    const newStart = applyTime(e.start, st);
    let newEnd = e.end;
    if (isDur) {
      const en = f.get('end');
      if (en) {
        newEnd = applyTime(newStart, en);
        if (newEnd < newStart) newEnd += DAY_MS;
      } else {
        newEnd = null;
        // only one active event per button
        if (e.end != null && activeEvent(e.profileId, e.buttonId)) newEnd = e.end;
      }
    }
    e.start = newStart;
    e.end = newEnd;
    if (showAmount) {
      const a = String(f.get('amount') ?? '').trim();
      e.amount = a === '' ? null : Math.max(0, Number(a));
      if (Number.isNaN(e.amount)) e.amount = null;
    }
    if (options.length) e.option = f.get('option') || e.option;
    e.note = String(f.get('note') || '').trim();
    save();
    closeSheet();
    render();
  });
}

async function deleteEvent(id) {
  const ok = await confirmDialog('למחוק את הרישום?', 'לא ניתן לשחזר אחרי מחיקה.', 'מחיקה');
  if (!ok) return;
  state.events = state.events.filter(e => e.id !== id);
  save();
  closeSheet();
  render();
}

/* ---------- Settings screen ---------- */

function settingsHTML(p) {
  const n = p.buttons.length;
  return `
  <h1 class="page-title">הגדרות</h1>

  <h2 class="section-title">כפתורים <small>${n}/${MAX_BUTTONS}</small></h2>
  <section class="card list">
    ${n ? p.buttons.map((b, i) => `
    <div class="brow" style="${colorVars(b.color)}">
      <span class="brow-ic">${icon(b.icon)}</span>
      <span class="brow-main">
        <b>${esc(b.label)}</b>
        <small>${b.kind === 'duration' ? `משך · ${esc(b.startLabel)} / ${esc(b.endLabel)}` : 'רגעי'}${b.unit && b.amount != null ? ` · ${esc(unitText(b.amount, b.unit))}` : ''}${b.options.length ? ` · ${b.options.length} אפשרויות` : ''}</small>
      </span>
      <span class="brow-act">
        <button class="icon-btn sm" data-action="btn-up" data-id="${b.id}" aria-label="למעלה" ${i === 0 ? 'disabled' : ''}>${ui('up')}</button>
        <button class="icon-btn sm" data-action="btn-down" data-id="${b.id}" aria-label="למטה" ${i === n - 1 ? 'disabled' : ''}>${ui('down')}</button>
        <button class="icon-btn sm" data-action="btn-edit" data-id="${b.id}" aria-label="עריכה">${ui('edit')}</button>
        <button class="icon-btn sm danger" data-action="btn-delete" data-id="${b.id}" aria-label="מחיקה">${ui('trash')}</button>
      </span>
    </div>`).join('') : `<p class="list-empty">אין כפתורים בפרופיל הזה</p>`}
    <button class="btn btn-soft list-add" data-action="btn-add" ${n >= MAX_BUTTONS ? 'disabled' : ''}>${ui('plus')}<span>${n >= MAX_BUTTONS ? 'הגעתם למקסימום של 10 כפתורים' : 'הוסף כפתור'}</span></button>
  </section>

  <h2 class="section-title">פרופיל</h2>
  <section class="card pad">
    <label class="field"><span>שם הפרופיל</span>
      <div class="inline"><input type="text" id="profileNameInput" value="${esc(p.name)}" maxlength="30"><button class="btn btn-soft" data-action="rename-profile">שמירה</button></div>
    </label>
    <label class="field"><span>החלת תבנית</span>
      <div class="inline">
        <select id="templateSelect">${Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}" ${k === p.template ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>
        <button class="btn btn-soft" data-action="apply-template">החל</button>
      </div>
      <em>מחליף את כל הכפתורים של הפרופיל. הרישומים נשמרים.</em>
    </label>
    <button class="btn btn-ghost-danger full" data-action="delete-profile">${ui('trash')}<span>מחיקת הפרופיל</span></button>
  </section>

  <h2 class="section-title">גיבוי</h2>
  <section class="card pad backup">
    <button class="btn btn-soft" data-action="export">${ui('download')}<span>ייצא לקובץ</span></button>
    <button class="btn btn-soft" data-action="import">${ui('upload')}<span>ייבא מקובץ</span></button>
    <em>הנתונים נשמרים רק במכשיר הזה. ייבוא מחליף את כל הנתונים.</em>
  </section>

  <footer class="version">אחת אחת · v${APP_VERSION}</footer>`;
}

function moveButton(id, dir) {
  const p = currentProfile();
  const i = p.buttons.findIndex(b => b.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= p.buttons.length) return;
  [p.buttons[i], p.buttons[j]] = [p.buttons[j], p.buttons[i]];
  save();
  render();
}

async function deleteButton(id) {
  const p = currentProfile();
  const b = p.buttons.find(x => x.id === id);
  if (!b) return;
  const ok = await confirmDialog(`למחוק את "${b.label}"?`, 'הרישומים הקיימים יישארו במסך הנתונים.', 'מחיקה');
  if (!ok) return;
  closeActiveEvents(p.id, [b.id]);
  p.buttons = p.buttons.filter(x => x.id !== id);
  save();
  render();
}

/* ---------- Button editor ---------- */

let draft = null;

function openButtonEditor(id) {
  const p = currentProfile();
  if (!id && p.buttons.length >= MAX_BUTTONS) return;
  const b = id ? p.buttons.find(x => x.id === id) : null;
  draft = b ? JSON.parse(JSON.stringify(b)) : makeButton({ color: PALETTE[p.buttons.length % PALETTE.length], icon: 'star' });
  draft._isNew = !b;
  if (!draft.startLabel) draft.startLabel = 'התחיל';
  if (!draft.endLabel) draft.endLabel = 'סיים';
  openSheet(`<div id="btnEditor"></div>`);
  renderButtonEditor();
}

function renderButtonEditor() {
  const host = $('#btnEditor');
  if (!host) return;
  const d = draft;
  const scroller = $('#sheetBody');
  const top = scroller.scrollTop;
  host.innerHTML = `
    <div class="sheet-head" style="${colorVars(d.color)}">
      <span class="sheet-ic" id="prevIc">${icon(d.icon)}</span>
      <div><h2>${d._isNew ? 'כפתור חדש' : 'עריכת כפתור'}</h2><small id="prevLabel">${esc(d.label || 'ללא שם')}</small></div>
    </div>
    <form class="form" id="buttonForm" autocomplete="off">
      <label class="field"><span>שם</span><input type="text" data-f="label" value="${esc(d.label)}" maxlength="18" placeholder="למשל: אכל" required></label>

      <div class="field"><span>סוג</span>
        <div class="seg">
          <button type="button" class="seg-btn ${d.kind === 'instant' ? 'on' : ''}" data-kind="instant">רגעי</button>
          <button type="button" class="seg-btn ${d.kind === 'duration' ? 'on' : ''}" data-kind="duration">משך</button>
        </div>
      </div>
      ${d.kind === 'duration' ? `
      <div class="row2">
        <label class="field"><span>שם להתחלה</span><input type="text" data-f="startLabel" value="${esc(d.startLabel)}" maxlength="12" placeholder="נרדם"></label>
        <label class="field"><span>שם לסיום</span><input type="text" data-f="endLabel" value="${esc(d.endLabel)}" maxlength="12" placeholder="קם"></label>
      </div>` : ''}

      <div class="field"><span>צבע</span>
        <div class="swatches">${PALETTE.map(c => `<button type="button" class="swatch ${c === d.color ? 'on' : ''}" style="${colorVars(c)}" data-color="${c}" aria-label="צבע">${ui('check')}</button>`).join('')}</div>
      </div>

      <div class="field"><span>אייקון</span>
        <div class="icons" style="${colorVars(d.color)}">${ICON_ORDER.map(k => `<button type="button" class="icon-pick ${k === d.icon ? 'on' : ''}" data-icon="${k}" aria-label="${ICON_NAMES[k]}" title="${ICON_NAMES[k]}">${icon(k)}</button>`).join('')}</div>
      </div>

      <div class="row2">
        <label class="field"><span>כמות ברירת מחדל</span><input type="number" inputmode="decimal" step="any" min="0" data-f="amount" value="${d.amount ?? ''}" ${d.unit ? '' : 'disabled'} placeholder="${d.unit ? '0' : '—'}"></label>
        <label class="field"><span>יחידה</span><select data-f="unit">${UNITS.map(u => `<option value="${esc(u)}" ${u === d.unit ? 'selected' : ''}>${u ? esc(u) : 'ללא'}</option>`).join('')}</select></label>
      </div>

      <div class="field"><span>אפשרויות <em class="inline-em">לא חובה</em></span>
        <div class="opts">
          ${d.options.map((o, i) => `
          <div class="opt-row">
            <label class="opt-default" title="ברירת מחדל"><input type="radio" name="defopt" value="${i}" ${o === d.defaultOption ? 'checked' : ''}><span>${ui('check')}</span></label>
            <input type="text" data-opt="${i}" value="${esc(o)}" maxlength="14" placeholder="אפשרות ${i + 1}">
            <button type="button" class="icon-btn sm danger" data-del-opt="${i}" aria-label="הסרה">${ui('close')}</button>
          </div>`).join('')}
          <button type="button" class="btn btn-soft sm" data-add-opt>${ui('plus')}<span>הוסף אפשרות</span></button>
          ${d.options.length ? `<em>הסימון מגדיר את ברירת המחדל שנרשמת בלחיצה</em>` : ''}
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">${ui('check')}<span>שמירה</span></button>
        <button type="button" class="btn" data-action="close-sheet">ביטול</button>
      </div>
    </form>`;
  scroller.scrollTop = top;
  bindButtonEditor();
}

function bindButtonEditor() {
  const form = $('#buttonForm');
  const d = draft;
  form.addEventListener('input', ev => {
    const t = ev.target;
    if (t.dataset.f) {
      if (t.dataset.f === 'amount') d.amount = t.value === '' ? null : Number(t.value);
      else d[t.dataset.f] = t.value;
      if (t.dataset.f === 'label') $('#prevLabel').textContent = t.value || 'ללא שם';
    }
    if (t.dataset.opt != null) {
      const i = Number(t.dataset.opt);
      const wasDefault = d.options[i] === d.defaultOption;
      d.options[i] = t.value;
      if (wasDefault) d.defaultOption = t.value;
    }
    if (t.name === 'defopt') d.defaultOption = d.options[Number(t.value)];
  });
  form.addEventListener('change', ev => {
    if (ev.target.dataset.f === 'unit') {
      d.unit = ev.target.value;
      if (!d.unit) d.amount = null;
      renderButtonEditor();
    }
  });
  form.addEventListener('click', ev => {
    const k = ev.target.closest('[data-kind]');
    if (k) { d.kind = k.dataset.kind; renderButtonEditor(); return; }
    const c = ev.target.closest('[data-color]');
    if (c) {
      d.color = c.dataset.color;
      $$('.swatch', form).forEach(s => s.classList.toggle('on', s === c));
      $('.sheet-head').setAttribute('style', colorVars(d.color));
      $('.icons', form).setAttribute('style', colorVars(d.color));
      return;
    }
    const ic = ev.target.closest('[data-icon]');
    if (ic) {
      d.icon = ic.dataset.icon;
      $$('.icon-pick', form).forEach(s => s.classList.toggle('on', s === ic));
      $('#prevIc').innerHTML = icon(d.icon);
      return;
    }
    if (ev.target.closest('[data-add-opt]')) {
      d.options.push('');
      if (d.options.length === 1) d.defaultOption = '';
      renderButtonEditor();
      const inputs = $$('[data-opt]');
      inputs[inputs.length - 1]?.focus();
      return;
    }
    const del = ev.target.closest('[data-del-opt]');
    if (del) {
      const i = Number(del.dataset.delOpt);
      const removed = d.options.splice(i, 1)[0];
      if (removed === d.defaultOption) d.defaultOption = d.options[0] ?? null;
      renderButtonEditor();
    }
  });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    saveDraft();
  });
}

function saveDraft() {
  const d = draft;
  const p = currentProfile();
  const label = (d.label || '').trim();
  if (!label) {
    const inp = $('[data-f="label"]');
    inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake');
    inp.focus();
    return;
  }
  const seen = new Set();
  const options = d.options.map(o => o.trim()).filter(o => o && !seen.has(o) && seen.add(o));
  let def = (d.defaultOption || '').trim();
  if (!options.includes(def)) def = options[0] || null;
  const out = {
    id: d.id,
    label,
    kind: d.kind,
    startLabel: d.kind === 'duration' ? (d.startLabel.trim() || 'התחיל') : '',
    endLabel: d.kind === 'duration' ? (d.endLabel.trim() || 'סיים') : '',
    color: d.color,
    icon: d.icon,
    amount: d.unit && d.amount != null && !Number.isNaN(d.amount) ? Math.max(0, d.amount) : null,
    unit: d.unit || '',
    options,
    defaultOption: def,
  };
  if (d._isNew) {
    if (p.buttons.length >= MAX_BUTTONS) return;
    p.buttons.push(out);
  } else {
    const i = p.buttons.findIndex(b => b.id === d.id);
    const prev = p.buttons[i];
    if (prev.kind === 'duration' && out.kind !== 'duration') closeActiveEvents(p.id, [prev.id]);
    p.buttons[i] = out;
  }
  save();
  closeSheet();
  render();
}

/* ---------- Profile actions ---------- */

function renameProfile() {
  const p = currentProfile();
  const v = $('#profileNameInput').value.trim();
  if (!v) { $('#profileNameInput').value = p.name; return; }
  p.name = v;
  save();
  renderShell();
  renderDrawer();
  toast('השם עודכן');
}

async function applyTemplate() {
  const p = currentProfile();
  const key = $('#templateSelect').value;
  const t = TEMPLATES[key];
  const ok = await confirmDialog(`להחיל את התבנית "${t.name}"?`, 'כל הכפתורים הנוכחיים של הפרופיל יוחלפו. הרישומים הקיימים יישמרו.', 'החלפה');
  if (!ok) return;
  closeActiveEvents(p.id);
  p.template = key;
  p.buttons = t.buttons.map(makeButton);
  save();
  render();
  toast('התבנית הוחלה');
}

async function deleteProfile() {
  const p = currentProfile();
  const ok1 = await confirmDialog(`למחוק את "${p.name}"?`, 'כל הכפתורים והרישומים של הפרופיל יימחקו.', 'המשך');
  if (!ok1) return;
  const ok2 = await confirmDialog('בטוח לגמרי?', 'זו מחיקה סופית. אי אפשר לשחזר.', 'מחיקה סופית');
  if (!ok2) return;
  state.profiles = state.profiles.filter(x => x.id !== p.id);
  state.events = state.events.filter(e => e.profileId !== p.id);
  state.currentProfileId = state.profiles[0]?.id || null;
  save();
  if (!state.profiles.length) { render(); openOnboard(false); return; }
  tab = 'main';
  render();
  renderDrawer();
}

function selectProfile(id) {
  state.currentProfileId = id;
  save();
  closeDrawer();
  viewDay = startOfDay(Date.now());
  render();
  renderDrawer();
}

/* ---------- Backup ---------- */

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const d = new Date();
  const name = `ahat-ahat-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('הקובץ נוצר');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    let s;
    try { s = JSON.parse(reader.result); } catch (e) { s = null; }
    if (!isValidState(s)) { toast('הקובץ לא תקין'); return; }
    const ok = await confirmDialog('לייבא מהקובץ?', `כל הנתונים הנוכחיים יוחלפו (${s.profiles.length} פרופילים, ${s.events.length} רישומים).`, 'ייבוא');
    if (!ok) return;
    if (!s.profiles.some(p => p.id === s.currentProfileId)) s.currentProfileId = s.profiles[0]?.id || null;
    state = s;
    save();
    tab = 'main';
    render();
    renderDrawer();
    if (!state.profiles.length) openOnboard(false);
    toast('הנתונים יובאו');
  };
  reader.readAsText(file);
}

/* ---------- Drawer ---------- */

function renderDrawer() {
  const cur = currentProfile();
  $('#drawerList').innerHTML = state.profiles.map(p => {
    const t = TEMPLATES[p.template] || TEMPLATES.empty;
    const on = cur && p.id === cur.id;
    return `
    <button class="pitem ${on ? 'on' : ''}" data-action="select-profile" data-id="${p.id}" style="${colorVars(t.color)}" aria-current="${on}">
      <span class="pitem-ic">${icon(t.icon)}</span>
      <span class="pitem-main"><b>${esc(p.name)}</b><small>${esc(t.name)} · ${p.buttons.length} כפתורים</small></span>
      <span class="pitem-check">${ui('check')}</span>
    </button>`;
  }).join('');
}

function openDrawer() {
  renderDrawer();
  const d = $('#drawer');
  d.classList.add('open');
  d.setAttribute('aria-hidden', 'false');
}
function closeDrawer() {
  const d = $('#drawer');
  d.classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
}

/* ---------- Onboarding / add profile ---------- */

let obTemplate = 'baby';

function openOnboard(cancellable) {
  obTemplate = 'baby';
  const ob = $('#onboard');
  const first = !state.profiles.length;
  ob.innerHTML = `
    <div class="ob-inner">
      ${cancellable ? `<button class="icon-btn ob-close" data-action="close-onboard" aria-label="סגירה">${ui('close')}</button>` : ''}
      <div class="ob-logo">${logoSVG()}</div>
      <h1>${first ? 'אחת אחת' : 'פרופיל חדש'}</h1>
      <p class="ob-sub">${first ? 'מעקב בלחיצה אחת. בואו ניצור את הפרופיל הראשון.' : 'שם וסוג — וזהו.'}</p>
      <form id="obForm" autocomplete="off">
        <label class="field"><span>שם</span><input type="text" id="obName" maxlength="30" placeholder="למשל: נועה"></label>
        <div class="field"><span>סוג</span>
          <div class="tpl-grid">
            ${Object.entries(TEMPLATES).map(([k, t], i) => `
            <button type="button" class="tpl ${k === obTemplate ? 'on' : ''}" data-tpl="${k}" style="${colorVars(t.color)};--i:${i}">
              <span class="tpl-ic">${icon(t.icon)}</span>
              <b>${esc(t.name)}</b>
              <small>${t.buttons.length ? t.buttons.map(b => esc(b.label)).join(' · ') : 'בונים לבד'}</small>
            </button>`).join('')}
          </div>
        </div>
        <button type="submit" class="btn btn-primary full big">${ui('check')}<span>יצירה</span></button>
      </form>
    </div>`;
  ob.classList.add('open');
  ob.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
  $('#obForm').addEventListener('submit', ev => {
    ev.preventDefault();
    const name = $('#obName').value.trim() || TEMPLATES[obTemplate].name;
    createProfile(name, obTemplate);
    closeOnboard();
    closeDrawer();
    tab = 'main';
    render();
    renderDrawer();
  });
  ob.addEventListener('click', obClick);
}

function obClick(ev) {
  const t = ev.target.closest('[data-tpl]');
  if (!t) return;
  obTemplate = t.dataset.tpl;
  $$('.tpl', $('#onboard')).forEach(x => x.classList.toggle('on', x === t));
}

function closeOnboard() {
  const ob = $('#onboard');
  ob.classList.remove('open');
  ob.setAttribute('aria-hidden', 'true');
  ob.removeEventListener('click', obClick);
  document.body.classList.remove('locked');
}

function logoSVG() {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF8A6B"/><stop offset="1" stop-color="#8A8CFF"/></linearGradient></defs>
    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"/>
    <circle class="logo-arc" cx="60" cy="60" r="46" fill="none" stroke="url(#lg)" stroke-width="12" stroke-linecap="round" pathLength="100" transform="rotate(-90 60 60)"/>
    <circle cx="60" cy="60" r="20" fill="url(#lg)"/>
  </svg>`;
}

/* ---------- Sheet ---------- */

function openSheet(html) {
  $('#sheetBody').innerHTML = html;
  $('#sheetBody').scrollTop = 0;
  const s = $('#sheet');
  s.classList.add('open');
  s.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
}
function closeSheet() {
  const s = $('#sheet');
  s.classList.remove('open');
  s.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('locked');
  draft = null;
}

/* ---------- Confirm dialog & toast ---------- */

function confirmDialog(title, text, okLabel = 'אישור') {
  return new Promise(resolve => {
    const d = $('#dialog');
    $('#dialogTitle').textContent = title;
    $('#dialogText').textContent = text;
    $('#dialogOk').textContent = okLabel;
    $('#dialogIc').innerHTML = ui('alert');
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    const done = v => {
      d.classList.remove('open');
      d.setAttribute('aria-hidden', 'true');
      $('#dialogOk').onclick = $('#dialogCancel').onclick = null;
      resolve(v);
    };
    $('#dialogOk').onclick = () => done(true);
    $('#dialogCancel').onclick = () => done(false);
    setTimeout(() => $('#dialogCancel').focus(), 50);
  });
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.innerHTML = `${ui('check')}<span>${esc(msg)}</span>`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ---------- Events ---------- */

document.addEventListener('click', ev => {
  const tabBtn = ev.target.closest('.tab');
  if (tabBtn) { switchTab(tabBtn.dataset.tab); return; }
  const el = ev.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const id = el.dataset.id;
  switch (el.dataset.action) {
    case 'press': press(el); break;
    case 'open-drawer': openDrawer(); break;
    case 'close-drawer': closeDrawer(); break;
    case 'select-profile': selectProfile(id); break;
    case 'add-profile': openOnboard(true); break;
    case 'close-onboard': closeOnboard(); break;
    case 'goto-settings': switchTab('settings'); break;
    case 'day-prev': viewDay = addDays(viewDay, -1); render(); break;
    case 'day-next': if (viewDay < startOfDay(Date.now())) { viewDay = addDays(viewDay, 1); render(); } break;
    case 'edit-event': openEventEditor(id); break;
    case 'delete-event': deleteEvent(id); break;
    case 'close-sheet': closeSheet(); break;
    case 'btn-up': moveButton(id, -1); break;
    case 'btn-down': moveButton(id, 1); break;
    case 'btn-edit': openButtonEditor(id); break;
    case 'btn-delete': deleteButton(id); break;
    case 'btn-add': openButtonEditor(null); break;
    case 'rename-profile': renameProfile(); break;
    case 'apply-template': applyTemplate(); break;
    case 'delete-profile': deleteProfile(); break;
    case 'export': exportData(); break;
    case 'import': $('#importFile').value = ''; $('#importFile').click(); break;
  }
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Enter' && ev.target.id === 'profileNameInput') { ev.preventDefault(); renameProfile(); }
  if (ev.key === 'Escape') {
    if ($('#dialog').classList.contains('open')) $('#dialogCancel').click();
    else if ($('#sheet').classList.contains('open')) closeSheet();
    else if ($('#drawer').classList.contains('open')) closeDrawer();
  }
});

$('#importFile').addEventListener('change', ev => {
  const f = ev.target.files && ev.target.files[0];
  if (f) importData(f);
});

// Keep live durations fresh on the data screen
setInterval(() => {
  if (tab === 'data' && !$('#sheet').classList.contains('open') && viewDay === startOfDay(Date.now()) &&
      state.events.some(e => e.kind === 'duration' && e.end == null)) render();
}, 30000);

// Other tab/window changed storage
window.addEventListener('storage', ev => {
  if (ev.key === STORAGE_KEY) { state = loadState(); render(); renderDrawer(); }
});

/* ---------- Boot ---------- */

function boot() {
  $('#menuBtn').innerHTML = ui('menu');
  $$('[data-ic]').forEach(el => { el.innerHTML = ui(el.dataset.ic); });
  $$('[data-ic-btn]').forEach(el => { el.innerHTML = ui(el.dataset.icBtn); });
  $('.drawer-add').innerHTML = `${ui('plus')}<span>הוסף פרופיל</span>`;
  if (state.profiles.length && !state.profiles.some(p => p.id === state.currentProfileId)) {
    state.currentProfileId = state.profiles[0].id;
    save();
  }
  render();
  if (!state.profiles.length) openOnboard(false);

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}

boot();
