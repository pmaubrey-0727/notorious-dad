// Daily nudge: who in the band hasn't ticked their availability?
// Reads the band from Firebase (read-only) and sends the organiser ONE push message via ntfy.
// Runs on a schedule from GitHub Actions (see reminders/README.md). Needs Node 18+.

const { FIREBASE_DB, BAND_ID, NTFY_TOPIC } = process.env;
const NTFY_URL = (process.env.NTFY_URL || 'https://ntfy.sh').replace(/\/+$/, '');
const STALE_DAYS = process.env.STALE_DAYS === undefined ? 14 : +process.env.STALE_DAYS;   // 0 = only nag people who never ticked

for (const [k, v] of Object.entries({ FIREBASE_DB, BAND_ID, NTFY_TOPIC })) {
  if (!v) { console.error(`Missing ${k}. Add it as a repository secret.`); process.exit(1); }
}

const fail = msg => { console.error(msg); process.exit(1); };

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Dublin' });   // YYYY-MM-DD
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

const res = await fetch(`${FIREBASE_DB.replace(/\/+$/, '')}/bands/${BAND_ID}.json`).catch(e => fail(`Could not reach Firebase: ${e.cause?.code || e.message}`));
if (!res.ok) fail(`Firebase answered ${res.status}`);
const band = await res.json();
if (!band || !band.meta) { console.error('No band found at that ID. Check the BAND_ID secret.'); process.exit(1); }

const members = Array.from(band.meta.members || []);
const avail = band.avail || {};
const cutoff = STALE_DAYS > 0 ? Date.now() - STALE_DAYS * 864e5 : 0;

const waiting = [];
members.forEach((name, i) => {
  const rec = avail[i], who = name || `Member ${i + 1}`;
  if (!rec) waiting.push(`${who} (hasn't ticked yet)`);
  else if (cutoff && !(rec.ts > cutoff)) waiting.push(`${who} (last updated ${Math.round((Date.now() - rec.ts) / 864e5)}d ago)`);
});

if (!waiting.length) { console.log('Everyone is up to date. Nothing sent.'); process.exit(0); }

const gigs = Array.from(band.meta.gigs || []).filter(g => g && g.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
let text = 'Still waiting on:\n' + waiting.map(w => '- ' + w).join('\n');
if (gigs.length) text += `\n\nNext gig: ${gigs[0].name}, ${daysBetween(today, gigs[0].date)} days away.`;

const out = await fetch(`${NTFY_URL}/${encodeURIComponent(NTFY_TOPIC)}`, {
  method: 'POST',
  headers: { Title: "Who hasn't ticked", Tags: 'bell' },
  body: text,
}).catch(e => fail(`Could not reach ntfy: ${e.cause?.code || e.message}`));
if (!out.ok) fail(`ntfy answered ${out.status}`);
console.log('Sent:\n' + text);
