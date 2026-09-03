# Getting Notorious D.A.D. online

You need a web address so the share links work for people who don't have the file. Pick one of the two below — the first takes about a minute.

---

## Option A — Netlify Drop (fastest, no account needed to start)

1. Go to **https://app.netlify.com/drop**
2. Drag the whole **`notorious-dad-site`** folder onto the page. Not the files inside it — the folder itself.
3. Wait about ten seconds. You get a URL like `https://sparkly-crumble-123abc.netlify.app`.
4. That's it. Open it on your phone to check it works.

To keep the URL permanently, make a free Netlify account when it offers — otherwise the site can expire. In **Site settings → Change site name** you can make it something like `notorious-dad.netlify.app`.

**To update it later:** drag the folder onto the same site's Deploys tab. Then bump `CACHE` in `sw.js` (see Updating, below) or phones will keep showing the old version.

---

## Option B — GitHub Pages (permanent, free, a bit more setup)

1. Create a new public repository on GitHub, e.g. `notorious-dad`.
2. Upload the **contents** of `notorious-dad-site` to the root of the repo — `index.html` must sit at the top level, not inside a subfolder.
3. **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save.
4. After a minute or two it's live at `https://<your-username>.github.io/notorious-dad/`

---

## Once it's live

**Send the band the app URL first**, and tell them to install it:

- **iPhone (Safari):** tap **Share ⬆** → **Add to Home Screen**
- **Android (Chrome):** tap **⋮** → **Install app** (or *Add to Home screen*)

The app shows this prompt itself the first time someone opens it in a browser.

Then, from your own copy, use **Share → 01 Paste the flyer** to send the setup link. That link carries the line-up, the date window, the slot times and the gigs, so everyone starts from the same page.

### The flow, start to finish

1. You set the window and add the gigs, then send the **setup link**.
2. Everyone opens it, picks their name on **My time**, taps their slots.
3. Each of them hits **Share → 02** and sends you their short code.
4. You paste the codes into **Share → 03** and hit Merge.
5. **Slots** now shows the real picture. Lock practices in with 📌.
6. Send **Share → 04**, the full calendar link, so everyone sees the agreed nights.

---

## Updating the app later

The site is a plain static folder. Edit `index.html`, re-upload, and **bump the cache version** so installed phones pick up the change:

```js
// sw.js, line 3
const CACHE = 'notorious-dad-v4';   // was v3
```

Without that bump, anyone who installed it keeps the cached copy.

---

## What's in here

| File | What it does |
|---|---|
| `index.html` | The entire app — logic, styling, everything |
| `manifest.webmanifest` | Makes it installable, sets the name, icon and full-screen behaviour |
| `sw.js` | Offline cache. The app works in a basement with no signal |
| `icon-192.png` / `icon-512.png` | Home-screen icons |
| `icon-maskable-512.png` | Android adaptive icon (safe zone respected) |
| `apple-touch-icon.png` | iOS home-screen icon |
| `favicon-32.png` | Browser tab icon |

## Notes worth knowing

- **No server, no accounts, no database.** Availability lives on each person's own phone. Nothing is uploaded anywhere, which is why the codes exist — they're how data moves between phones.
- **Fonts** (Anton, Archivo Black, Space Mono) load from Google Fonts on first open, then get cached for offline use. If they ever fail to load, the app falls back to condensed system faces and still works.
- **The date window looks after itself.** It starts today, rolls forward daily, and stretches to cover your furthest booked gig plus a week. You set only a minimum horizon.
- **Nothing resets anyone's ticks.** Availability is keyed to real dates, so window, slot and line-up changes are all safe.
- **Changing slot *times*** (say Evening to 7pm) is safe and breaks nothing.
