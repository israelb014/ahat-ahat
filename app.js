'use strict';

/* ============================================================
   אחת אחת — מעקב בלחיצה אחת
   ============================================================ */

const APP_VERSION = '1.1.0';
const STORAGE_KEY = 'ahat-ahat-v1';
const MAX_BUTTONS = 10;
const DAY_MS = 86400000;

/* ---------- Palette & units ---------- */

const PALETTE = [
  '#FF7A50', // orange
  '#3D8FD6', // blue
  '#F2B21B', // yellow
  '#7A6CF0', // purple
  '#33B36F', // green
  '#FF5FA8', // pink
  '#14B8A6', // teal
  '#E5484D', // red
  '#A0785A', // brown
  '#9AA0AD', // gray
];
const C = {
  orange: PALETTE[0], blue: PALETTE[1], yellow: PALETTE[2], purple: PALETTE[3], green: PALETTE[4],
  pink: PALETTE[5], teal: PALETTE[6], red: PALETTE[7], brown: PALETTE[8], gray: PALETTE[9],
};
// Colors saved by v1.0 map to their closest v1.1 palette color when displayed
const LEGACY_COLORS = {
  '#FF6B5B': C.orange, '#FFB547': C.yellow, '#B5E05A': C.green, '#3DDC97': C.green, '#2EC4C9': C.teal,
  '#4EA8FF': C.blue, '#7C7CFF': C.purple, '#B57BFF': C.purple, '#FF6FB5': C.pink, '#D9B48F': C.brown,
  '#6B7285': C.gray,
};
const displayColor = hex => LEGACY_COLORS[String(hex).toUpperCase()] || hex || C.gray;

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
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
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
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
const icon = (name, cls) => svg(ICONS[name] || ICONS.star, cls);
const ui = (name, cls) => svg(UI[name], cls);

/* ---------- Templates ---------- */

const MEALS = ['בוקר', 'צהריים', 'ערב', 'נשנוש'];
const DIAPER = { label: 'טיטול', icon: 'diaper', color: C.yellow, options: ['פיפי', 'קקי', 'שניהם'], defaultOption: 'פיפי' };
const SLEEP = { label: 'שינה', kind: 'duration', startLabel: 'נרדם', endLabel: 'קם', icon: 'moon', color: C.purple };
const MISC = { label: 'תרופה/שונות', icon: 'pill', color: C.pink };

const TEMPLATES = {
  baby: {
    name: 'תינוק 0-1', icon: 'bottle', color: C.orange,
    buttons: [
      { label: 'אכל', icon: 'bottle', color: C.orange, amount: 120, unit: 'מ"ל' },
      { label: 'שתה', icon: 'cup', color: C.blue, amount: 30, unit: 'מ"ל' },
      DIAPER, SLEEP, MISC,
    ],
  },
  toddler: {
    name: 'פעוט 1-3', icon: 'ball', color: C.green,
    buttons: [
      { label: 'ארוחה', icon: 'plate', color: C.green, options: MEALS, defaultOption: 'בוקר' },
      { label: 'שתה', icon: 'cup', color: C.blue, amount: 100, unit: 'מ"ל' },
      DIAPER, SLEEP, MISC,
    ],
  },
  kid: {
    name: 'ילד 3+', icon: 'star', color: C.yellow,
    buttons: [
      { label: 'שירותים', icon: 'toilet', color: C.teal },
      { label: 'פספוס', icon: 'drop', color: C.yellow },
      { label: 'משחק בחצר', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'tree', color: C.green },
      { label: 'מסך', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'screen', color: C.purple },
      { label: 'ארוחה', icon: 'plate', color: C.orange, options: MEALS, defaultOption: 'בוקר' },
      MISC,
    ],
  },
  senior: {
    name: 'קשיש', icon: 'heart', color: C.pink,
    buttons: [
      { label: 'תרופות', icon: 'pill', color: C.pink, options: ['בוקר', 'צהריים', 'ערב'], defaultOption: 'בוקר' },
      { label: 'שתה', icon: 'cup', color: C.blue, amount: 200, unit: 'מ"ל' },
      { label: 'שירותים', icon: 'toilet', color: C.teal },
      { label: 'הליכה', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'walk', color: C.green },
      { label: 'ארוחה', icon: 'plate', color: C.yellow },
      { label: 'לחץ דם', icon: 'heart', color: C.red },
    ],
  },
  sport: {
    name: 'ספורט', icon: 'dumbbell', color: C.blue,
    buttons: [
      { label: 'מים', icon: 'drop', color: C.blue, amount: 250, unit: 'מ"ל' },
      { label: 'משקולות', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'dumbbell', color: C.red },
      { label: 'מדרגות', icon: 'stairs', color: C.yellow, amount: 5, unit: 'קומות' },
      { label: 'רכיבה', kind: 'duration', startLabel: 'התחיל', endLabel: 'סיים', icon: 'bike', color: C.green },
      { label: 'ארוחת חלבון', icon: 'plate', color: C.brown, amount: 30, unit: 'גרם' },
    ],
  },
  empty: { name: 'ריק', icon: 'plus', color: C.gray, buttons: [] },
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
const colorVars = hex => { const c = displayColor(hex); return `--c:${c};--c-rgb:${hexRgb(c)}`; };
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

let sub = null; // settings inner page: null | 'button' | 'template'

/* ---------- Rendering: shell ---------- */

const weekdayName = ts => new Date(ts).toLocaleDateString('he-IL', { weekday: 'long' });

function headerHTML(small, title) {
  return `
  <header class="phead">
    <div class="phead-text">
      <span class="phead-small">${esc(small)}</span>
      <h1>${esc(title)}</h1>
    </div>
    <button class="circle-btn" data-action="open-drawer" aria-label="פרופילים">${ui('menu')}</button>
  </header>`;
}

function backHTML(title) {
  return `
  <header class="phead sub">
    <button class="back-btn" data-action="back"><span class="circle-btn">${ui('chevPrev')}</span><span>הגדרות</span></button>
    <h1>${esc(title)}</h1>
  </header>`;
}

const sq = (iconName, color, cls = '') => `<span class="sq ${cls}" style="${colorVars(color)}">${icon(iconName)}</span>`;

function renderShell() {
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
  else if (sub === 'button' && draft) { view.innerHTML = '<div id="btnEditor"></div>'; renderButtonEditor(); }
  else if (sub === 'template') view.innerHTML = templatePageHTML(p);
  else view.innerHTML = settingsHTML(p);
  view.dataset.tab = tab;
  if (tab === 'data') requestAnimationFrame(() => $$('.ring-prog', view).forEach(r => r.classList.add('in')));
}

function fadeView() {
  const view = $('#view');
  view.classList.remove('enter');
  void view.offsetWidth;
  view.classList.add('enter');
}

function switchTab(t) {
  if (t === tab && !sub) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  tab = t;
  sub = null;
  draft = null;
  if (t === 'data') viewDay = startOfDay(Date.now());
  window.scrollTo(0, 0);
  render();
  fadeView();
}

function openSub(name) {
  sub = name;
  window.scrollTo(0, 0);
  render();
  fadeView();
}

function closeSub() {
  sub = null;
  draft = null;
  window.scrollTo(0, 0);
  render();
  fadeView();
}

/* ---------- Main screen ---------- */

function tapButtonHTML(p, b) {
  const dur = b.kind === 'duration';
  const act = dur ? activeEvent(p.id, b.id) : null;
  return `
  <button class="row tap ${dur ? 'is-duration' : ''} ${act ? 'active' : ''}" style="${colorVars(b.color)}" data-action="press" data-id="${b.id}" aria-pressed="${act ? 'true' : 'false'}">
    ${sq(b.icon, b.color)}
    <span class="row-title tap-label">${wrapLabel(act ? b.endLabel : b.label)}</span>
    <span class="tap-end" aria-hidden="true">
      ${dur
        ? `<span class="act-idle">${ui('play')}</span><span class="act-on"><i class="live-dot"></i></span>`
        : `<span class="act-idle">${ui('plus')}</span><span class="act-on">${ui('check')}</span>`}
    </span>
  </button>`;
}

function mainHTML(p) {
  const head = headerHTML(weekdayName(Date.now()), p.name);
  if (!p.buttons.length) {
    return `${head}
    <section class="group empty-state">
      <p class="empty-title">אין עדיין כפתורים</p>
      <p class="empty-text">הוסיפו כפתורים בהגדרות, או החילו תבנית מוכנה.</p>
      <button class="btn-primary" data-action="goto-settings">להגדרות</button>
    </section>`;
  }
  return `${head}<section class="group">${p.buttons.map(b => tapButtonHTML(p, b)).join('')}</section>`;
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
    $('.tap-label', el).innerHTML = wrapLabel(on ? b.endLabel : b.label);
  } else {
    state.events.push(newEvent(p, b, now));
    clearTimeout(el._doneTimer);
    el.classList.add('done');
    el._doneTimer = setTimeout(() => el.classList.remove('done'), 700);
  }
  save();
  if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) { /* ignore */ } }
}

/* ---------- Data screen ---------- */

function dayLabel(ts) {
  const today = startOfDay(Date.now());
  if (ts === today) return 'היום';
  if (ts === addDays(today, -1)) return 'אתמול';
  return weekdayName(ts);
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
      groups.set(e.buttonId, { id: e.buttonId, label: e.label || 'כפתור שנמחק', color: C.gray, icon: 'note', kind: e.kind || (e.end != null ? 'duration' : 'instant'), unit: e.unit || '', options: [], evs: [], deleted: true });
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

const timesText = n => `${n} ${n === 1 ? 'פעם' : 'פעמים'}`;

function miniRingHTML(pct) {
  return `
  <svg class="mini-ring" viewBox="0 0 22 22" aria-hidden="true">
    <circle class="ring-track" cx="11" cy="11" r="8.5" pathLength="100"/>
    ${pct > 0 ? `<circle class="ring-prog" cx="11" cy="11" r="8.5" pathLength="100" style="--off:${100 - pct * 100}"/>` : ''}
  </svg>`;
}

function summaryRowHTML(s) {
  let value;
  const amountMain = s.hasAmount && s.unit && s.unit !== 'פעמים';
  if (s.kind === 'duration') value = `${fmtDur(s.dur)} ש'`;
  else if (amountMain) value = unitText(s.amount, s.unit);
  else value = timesText(s.count);
  const subs = [];
  if (s.kind === 'duration' || amountMain) subs.push(timesText(s.count));
  const opts = s.opts.filter(([, n]) => n > 0 || s.options.length);
  if (opts.length) subs.push(opts.map(([o, n]) => `${esc(o)} ${n}`).join(' · '));
  return `
  <div class="row sum ${s.count ? '' : 'zero'}" style="${colorVars(s.color)}">
    ${sq(s.icon, s.color)}
    <span class="row-main">
      <span class="row-title">${esc(s.label)}</span>
      ${subs.length ? `<span class="row-sub">${subs.join(' · ')}</span>` : ''}
    </span>
    <span class="sum-val">${esc(value)}</span>
    ${miniRingHTML(s.pct)}
  </div>`;
}

function eventMeta(p, e) {
  const b = p.buttons.find(x => x.id === e.buttonId);
  return {
    label: b ? b.label : (e.label || 'כפתור שנמחק'),
    color: b ? b.color : C.gray,
    icon: b ? b.icon : 'note',
    kind: e.kind || (b ? b.kind : 'instant'),
  };
}

function timelineHTML(p, evs) {
  if (!evs.length) {
    return `<div class="group"><div class="row empty-row">${ui('clock')}<span>אין רישומים ביום הזה</span></div></div>`;
  }
  const now = Date.now();
  const items = evs.slice().sort((a, b) => b.start - a.start).map(e => {
    const m = eventMeta(p, e);
    const inline = [];
    if (typeof e.amount === 'number' && e.unit) inline.push(esc(unitText(e.amount, e.unit)));
    if (e.option) inline.push(esc(e.option));
    let durLine = '';
    if (m.kind === 'duration') {
      durLine = e.end != null
        ? `<span class="row-sub">${fmtTime(e.start)}–${fmtTime(e.end)} · ${fmtDur(e.end - e.start)} ש'</span>`
        : `<span class="row-sub live" style="${colorVars(m.color)}"><i class="live-dot"></i>פעיל · ${fmtDur(now - e.start)} ש'</span>`;
    }
    return `
    <button class="row tl-item" data-action="edit-event" data-id="${e.id}">
      <time>${fmtTime(e.start)}</time>
      ${sq(m.icon, m.color, 'sm')}
      <span class="row-main">
        <span class="row-title">${esc(m.label)}${inline.length ? ` <span class="tl-inline">${inline.join(' · ')}</span>` : ''}</span>
        ${durLine}
        ${e.note ? `<span class="row-sub tl-note">${esc(e.note)}</span>` : ''}
      </span>
      ${ui('chevNext', 'row-chev')}
    </button>`;
  });
  return `<div class="group">${items.join('')}</div>`;
}

function dataHTML(p) {
  const today = startOfDay(Date.now());
  const evs = eventsForDay(p, viewDay);
  const sums = summarize(p, evs);
  return `
  ${headerHTML(weekdayName(Date.now()), p.name)}
  <div class="daypick">
    <button class="circle-btn" data-action="day-prev" aria-label="יום קודם">${ui('chevPrev')}</button>
    <div class="daypick-label"><b>${esc(dayLabel(viewDay))}</b><small>${dayDate(viewDay)}</small></div>
    <button class="circle-btn" data-action="day-next" aria-label="יום הבא" ${viewDay >= today ? 'disabled' : ''}>${ui('chevNext')}</button>
  </div>
  ${sums.length ? `<h2 class="gtitle">סיכום</h2><section class="group">${sums.map(summaryRowHTML).join('')}</section>` : ''}
  <h2 class="gtitle">ציר זמן</h2>
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
    <div class="sheet-head">
      ${sq(m.icon, m.color, 'lg')}
      <div><h2>${esc(m.label)}</h2><small>${esc(dayDate(e.start))}</small></div>
    </div>
    <form class="form" id="eventForm" autocomplete="off">
      <div class="group">
        <label class="row noicon"><span class="row-title">${isDur ? 'התחלה' : 'שעה'}</span><input class="row-input time" type="time" name="start" value="${timeInputValue(e.start)}" required></label>
        ${isDur ? `<label class="row noicon"><span class="row-title">סיום</span><input class="row-input time" type="time" name="end" value="${timeInputValue(e.end)}"></label>` : ''}
        ${showAmount ? `<label class="row noicon"><span class="row-title">כמות</span><span class="row-input-wrap"><input class="row-input" type="number" inputmode="decimal" step="any" min="0" name="amount" value="${e.amount ?? ''}" placeholder="0">${e.unit ? `<i>${esc(e.unit)}</i>` : ''}</span></label>` : ''}
      </div>
      ${isDur && e.end == null ? '<p class="footnote">סיום ריק = עדיין פעיל</p>' : ''}
      ${options.length ? `<h3 class="gtitle">אפשרות</h3><div class="seg wrap">${options.map(o => `
        <label class="seg-opt"><input type="radio" name="option" value="${esc(o)}" ${o === e.option ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>` : ''}
      <h3 class="gtitle">הערה</h3>
      <div class="group"><textarea name="note" rows="3" placeholder="${m.label === 'לחץ דם' ? 'למשל 120/80' : 'הערה חופשית'}">${esc(e.note || '')}</textarea></div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">שמירה</button>
        <button type="button" class="btn-danger" data-action="delete-event" data-id="${e.id}">מחיקת הרישום</button>
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
  const t = TEMPLATES[p.template] || TEMPLATES.empty;
  return `
  ${headerHTML(p.name, 'הגדרות')}

  <h2 class="gtitle">כפתורים <span>${n}/${MAX_BUTTONS}</span></h2>
  <section class="group">
    ${p.buttons.map((b, i) => `
    <div class="row brow" role="button" tabindex="0" data-action="btn-edit" data-id="${b.id}">
      ${sq(b.icon, b.color)}
      <span class="row-main">
        <span class="row-title">${esc(b.label)}</span>
        <span class="row-sub">${b.kind === 'duration' ? `משך · ${esc(b.startLabel)} / ${esc(b.endLabel)}` : 'רגעי'}${b.unit && b.amount != null ? ` · ${esc(unitText(b.amount, b.unit))}` : ''}${b.options.length ? ` · ${b.options.length} אפשרויות` : ''}</span>
      </span>
      <span class="reorder">
        <button class="mini-btn" data-action="btn-up" data-id="${b.id}" aria-label="למעלה" ${i === 0 ? 'disabled' : ''}>${ui('up')}</button>
        <button class="mini-btn" data-action="btn-down" data-id="${b.id}" aria-label="למטה" ${i === n - 1 ? 'disabled' : ''}>${ui('down')}</button>
      </span>
      ${ui('chevNext', 'row-chev')}
    </div>`).join('')}
    <button class="row add-row" data-action="btn-add" ${n >= MAX_BUTTONS ? 'disabled' : ''}>
      <span class="sq plain">${ui('plus')}</span>
      <span class="row-title">${n >= MAX_BUTTONS ? 'הגעתם למקסימום של 10 כפתורים' : 'הוסף כפתור'}</span>
    </button>
  </section>

  <h2 class="gtitle">פרופיל</h2>
  <section class="group">
    <label class="row noicon"><span class="row-title">שם</span><input class="row-input" type="text" id="profileNameInput" value="${esc(p.name)}" maxlength="30" enterkeyhint="done"></label>
    <button class="row noicon" data-action="open-templates">
      <span class="row-title">החלת תבנית</span>
      <span class="row-value">${esc(t.name)}</span>
      ${ui('chevNext', 'row-chev')}
    </button>
    <button class="row noicon danger-row" data-action="delete-profile"><span class="row-title">מחיקת הפרופיל</span></button>
  </section>

  <h2 class="gtitle">גיבוי</h2>
  <section class="group">
    <button class="row" data-action="export"><span class="sq plain">${ui('download')}</span><span class="row-title">ייצא לקובץ</span>${ui('chevNext', 'row-chev')}</button>
    <button class="row" data-action="import"><span class="sq plain">${ui('upload')}</span><span class="row-title">ייבא מקובץ</span>${ui('chevNext', 'row-chev')}</button>
  </section>
  <p class="footnote">הנתונים נשמרים רק במכשיר הזה. ייבוא מחליף את כל הנתונים.</p>

  <footer class="version">אחת אחת · v${APP_VERSION}</footer>`;
}

function templatePageHTML(p) {
  return `
  ${backHTML('החלת תבנית')}
  <section class="group">
    ${Object.entries(TEMPLATES).map(([k, t]) => `
    <button class="row tpl-row ${k === p.template ? 'on' : ''}" data-action="apply-template" data-tpl="${k}">
      ${sq(t.icon, t.color)}
      <span class="row-main">
        <span class="row-title">${esc(t.name)}</span>
        <span class="row-sub">${t.buttons.length ? t.buttons.map(b => esc(b.label)).join(' · ') : 'בונים לבד'}</span>
      </span>
      <span class="row-check">${ui('check')}</span>
    </button>`).join('')}
  </section>
  <p class="footnote">החלת תבנית מחליפה את כל הכפתורים של הפרופיל. הרישומים נשמרים.</p>`;
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
  if (sub) closeSub(); else render();
}

/* ---------- Button editor (inner page) ---------- */

let draft = null;

function openButtonEditor(id) {
  const p = currentProfile();
  if (!id && p.buttons.length >= MAX_BUTTONS) return;
  const b = id ? p.buttons.find(x => x.id === id) : null;
  draft = b ? JSON.parse(JSON.stringify(b)) : makeButton({ color: PALETTE[p.buttons.length % PALETTE.length], icon: 'star' });
  draft._isNew = !b;
  draft.color = displayColor(draft.color);
  if (!draft.startLabel) draft.startLabel = 'התחיל';
  if (!draft.endLabel) draft.endLabel = 'סיים';
  openSub('button');
}

function renderButtonEditor() {
  const host = $('#btnEditor');
  if (!host) return;
  const d = draft;
  const top = window.scrollY;
  host.innerHTML = `
    ${backHTML(d._isNew ? 'כפתור חדש' : 'עריכת כפתור')}
    <form class="form" id="buttonForm" autocomplete="off">
      <section class="group">
        <div class="row preview" id="prevRow" style="${colorVars(d.color)}">
          <span class="sq" id="prevIc">${icon(d.icon)}</span>
          <span class="row-title" id="prevLabel">${esc(d.label || 'ללא שם')}</span>
          <span class="tap-end">${d.kind === 'duration' ? ui('play') : ui('plus')}</span>
        </div>
      </section>

      <section class="group">
        <label class="row noicon"><span class="row-title">שם</span><input class="row-input" type="text" data-f="label" value="${esc(d.label)}" maxlength="18" placeholder="למשל: אכל" required></label>
        <div class="row noicon"><span class="row-title">סוג</span>
          <div class="seg small">
            <button type="button" class="seg-btn ${d.kind === 'instant' ? 'on' : ''}" data-kind="instant">רגעי</button>
            <button type="button" class="seg-btn ${d.kind === 'duration' ? 'on' : ''}" data-kind="duration">משך</button>
          </div>
        </div>
        ${d.kind === 'duration' ? `
        <label class="row noicon"><span class="row-title">שם להתחלה</span><input class="row-input" type="text" data-f="startLabel" value="${esc(d.startLabel)}" maxlength="12" placeholder="נרדם"></label>
        <label class="row noicon"><span class="row-title">שם לסיום</span><input class="row-input" type="text" data-f="endLabel" value="${esc(d.endLabel)}" maxlength="12" placeholder="קם"></label>` : ''}
      </section>

      <h2 class="gtitle">צבע</h2>
      <section class="group padded">
        <div class="swatches">${PALETTE.map(c => `<button type="button" class="swatch ${c === d.color ? 'on' : ''}" style="${colorVars(c)}" data-color="${c}" aria-label="צבע ${c}"></button>`).join('')}</div>
      </section>

      <h2 class="gtitle">אייקון</h2>
      <section class="group padded">
        <div class="icons" style="${colorVars(d.color)}">${ICON_ORDER.map(k => `<button type="button" class="icon-pick ${k === d.icon ? 'on' : ''}" data-icon="${k}" aria-label="${ICON_NAMES[k]}" title="${ICON_NAMES[k]}">${icon(k)}</button>`).join('')}</div>
      </section>

      <h2 class="gtitle">כמות</h2>
      <section class="group">
        <label class="row noicon"><span class="row-title">ברירת מחדל</span><input class="row-input" type="number" inputmode="decimal" step="any" min="0" data-f="amount" value="${d.amount ?? ''}" ${d.unit ? '' : 'disabled'} placeholder="${d.unit ? '0' : '—'}"></label>
        <label class="row noicon"><span class="row-title">יחידה</span><select class="row-select" data-f="unit">${UNITS.map(u => `<option value="${esc(u)}" ${u === d.unit ? 'selected' : ''}>${u ? esc(u) : 'ללא'}</option>`).join('')}</select>${ui('down', 'row-chev')}</label>
      </section>

      <h2 class="gtitle">אפשרויות <span>לא חובה</span></h2>
      <section class="group">
        ${d.options.map((o, i) => `
        <div class="row opt-row">
          <label class="opt-default" title="ברירת מחדל"><input type="radio" name="defopt" value="${i}" ${o === d.defaultOption ? 'checked' : ''}><span>${ui('check')}</span></label>
          <input class="row-input start" type="text" data-opt="${i}" value="${esc(o)}" maxlength="14" placeholder="אפשרות ${i + 1}">
          <button type="button" class="mini-btn" data-del-opt="${i}" aria-label="הסרה">${ui('close')}</button>
        </div>`).join('')}
        <button type="button" class="row add-row" data-add-opt><span class="sq plain">${ui('plus')}</span><span class="row-title">הוסף אפשרות</span></button>
      </section>
      ${d.options.length ? '<p class="footnote">הסימון מגדיר את ברירת המחדל שנרשמת בלחיצה</p>' : ''}

      <div class="form-actions">
        <button type="submit" class="btn-primary">שמירה</button>
        ${d._isNew ? '' : `<button type="button" class="btn-danger" data-action="btn-delete" data-id="${d.id}">מחיקת הכפתור</button>`}
      </div>
    </form>`;
  window.scrollTo(0, top);
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
      $('#prevRow').setAttribute('style', colorVars(d.color));
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
    const row = inp.closest('.row');
    row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake');
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
  closeSub();
}

/* ---------- Profile actions ---------- */

function renameProfile() {
  const p = currentProfile();
  const inp = $('#profileNameInput');
  if (!p || !inp) return;
  const v = inp.value.trim();
  if (!v) { inp.value = p.name; return; }
  if (v === p.name) return;
  p.name = v;
  save();
  const small = $('.phead-small');
  if (small) small.textContent = p.name;
  renderDrawer();
  toast('השם עודכן');
}

async function applyTemplate(key) {
  const p = currentProfile();
  const t = TEMPLATES[key];
  if (!t) return;
  const ok = await confirmDialog(`להחיל את התבנית "${t.name}"?`, 'כל הכפתורים הנוכחיים של הפרופיל יוחלפו. הרישומים הקיימים יישמרו.', 'החלפה');
  if (!ok) return;
  closeActiveEvents(p.id);
  p.template = key;
  p.buttons = t.buttons.map(makeButton);
  save();
  closeSub();
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
  sub = null;
  render();
  renderDrawer();
}

function selectProfile(id) {
  state.currentProfileId = id;
  save();
  closeDrawer();
  viewDay = startOfDay(Date.now());
  sub = null;
  draft = null;
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
    sub = null;
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
    <button class="row pitem ${on ? 'on' : ''}" data-action="select-profile" data-id="${p.id}" aria-current="${on}">
      <span class="avatar" style="${colorVars(t.color)}">${esc([...p.name.trim()][0] || '?')}</span>
      <span class="row-title">${esc(p.name)}</span>
      <span class="row-check">${ui('check')}</span>
    </button>`;
  }).join('') + `
    <button class="row add-row" data-action="add-profile"><span class="sq plain round">${ui('plus')}</span><span class="row-title">הוסף פרופיל</span></button>`;
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
      ${cancellable ? `<button class="circle-btn ob-close" data-action="close-onboard" aria-label="סגירה">${ui('close')}</button>` : ''}
      <h1>${first ? 'אחת אחת' : 'פרופיל חדש'}</h1>
      <p class="ob-sub">${first ? 'מעקב בלחיצה אחת. בואו ניצור את הפרופיל הראשון.' : 'שם וסוג — וזהו.'}</p>
      <form id="obForm" autocomplete="off">
        <input type="text" class="field-input" id="obName" maxlength="30" placeholder="שם, למשל: נועה" aria-label="שם">
        <h2 class="gtitle">סוג</h2>
        <section class="group">
          ${Object.entries(TEMPLATES).map(([k, t]) => `
          <button type="button" class="row tpl-row tpl ${k === obTemplate ? 'on' : ''}" data-tpl="${k}">
            ${sq(t.icon, t.color)}
            <span class="row-main">
              <span class="row-title">${esc(t.name)}</span>
              <span class="row-sub">${t.buttons.length ? t.buttons.map(b => esc(b.label)).join(' · ') : 'בונים לבד'}</span>
            </span>
            <span class="row-check">${ui('check')}</span>
          </button>`).join('')}
        </section>
        <button type="submit" class="btn-primary">יצירה</button>
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
    sub = null;
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
}

/* ---------- Confirm sheet & toast ---------- */

function confirmDialog(title, text, okLabel = 'אישור') {
  return new Promise(resolve => {
    const d = $('#dialog');
    $('#dialogTitle').textContent = title;
    $('#dialogText').textContent = text;
    $('#dialogOk').textContent = okLabel;
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    const done = v => {
      d.classList.remove('open');
      d.setAttribute('aria-hidden', 'true');
      $('#dialogOk').onclick = $('#dialogCancel').onclick = $('.dialog-backdrop').onclick = null;
      resolve(v);
    };
    $('#dialogOk').onclick = () => done(true);
    $('#dialogCancel').onclick = () => done(false);
    $('.dialog-backdrop').onclick = () => done(false);
    setTimeout(() => $('#dialogCancel').focus(), 50);
  });
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
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
    case 'back': closeSub(); break;
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
    case 'open-templates': openSub('template'); break;
    case 'apply-template': applyTemplate(el.dataset.tpl); break;
    case 'delete-profile': deleteProfile(); break;
    case 'export': exportData(); break;
    case 'import': $('#importFile').value = ''; $('#importFile').click(); break;
  }
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Enter' && ev.target.id === 'profileNameInput') { ev.preventDefault(); ev.target.blur(); }
  if (ev.key === 'Enter' && ev.target.matches('.brow[role="button"]')) { ev.preventDefault(); openButtonEditor(ev.target.dataset.id); }
  if (ev.key === 'Escape') {
    if ($('#dialog').classList.contains('open')) $('#dialogCancel').click();
    else if ($('#sheet').classList.contains('open')) closeSheet();
    else if ($('#drawer').classList.contains('open')) closeDrawer();
  }
});

document.addEventListener('change', ev => {
  if (ev.target.id === 'profileNameInput') renameProfile();
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
  $$('[data-ic]').forEach(el => { el.innerHTML = ui(el.dataset.ic); });
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
