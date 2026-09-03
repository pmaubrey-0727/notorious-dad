# Turning on live sync

Right now availability moves around by codes. This replaces that: everyone opens one link, taps their slots, and it appears on everyone else's phone in about a second. They can change it whenever they like — no re-sending anything.

You only do this once. Nobody else in the band does any of it.

**Time needed:** about ten minutes. **Cost:** nothing — five people ticking calendars sits far inside Firebase's free tier.

---

## 1. Make a Firebase project

1. Go to **https://console.firebase.google.com** and sign in with any Google account.
2. Click **Create a project**.
3. Name it `notorious-dad`. Continue.
4. **Turn Google Analytics off** — you don't need it and it adds questions. Continue.
5. Wait for it to build, then **Continue** into the project.

## 2. Create the database

1. In the left sidebar, open **Databases & Storage → Realtime Database** (older consoles put it under **Build → Realtime Database**). Make sure it says *Realtime Database*, not *Firestore* — they're different products and this app uses the first one.
2. Click **Create Database**.
3. Pick a location near you (`europe-west1` if you're in Ireland).
4. When it asks about security rules, choose **Start in locked mode**. Locked mode blocks everything until step 3, which is exactly what you want — don't pick test mode, it opens the database to the world and expires after 30 days.
5. You now have a URL at the top of the page like:

   ```
   https://notorious-dad-default-rtdb.europe-west1.firebasedatabase.app
   ```

   **Copy it.** That's the only thing the app needs.

## 3. Paste the security rules

Click the **Rules** tab, delete what's there, paste this in, and hit **Publish**:

```json
{
  "rules": {
    "bands": {
      "$bandId": {
        ".read":  "$bandId.length >= 16",
        ".write": "$bandId.length >= 16",
        "meta": {
          ".validate": "newData.hasChildren(['band','members','start','days','slots'])",
          "band":     { ".validate": "newData.isString() && newData.val().length < 60" },
          "start":    { ".validate": "newData.isString() && newData.val().length == 10" },
          "days":     { ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= 120" },
          "$other":   { ".validate": true }
        },
        "avail": {
          "$member": {
            ".validate": "newData.hasChildren(['cells','ts'])",
            "cells": { ".validate": "newData.isString() && newData.val().length < 2000" },
            "ts":    { ".validate": "newData.isNumber()" },
            "name":  { ".validate": "newData.isString() && newData.val().length < 40" },
            "$other":{ ".validate": false }
          }
        },
        "locked": { ".validate": "newData.hasChildren() || !newData.exists()" },
        "$other": { ".validate": false }
      }
    },
    "$other": { ".read": false, ".write": false }
  }
}
```

**What these do:** they confine everything to `/bands/<id>`, require a band ID of at least 16 characters (the app generates 18 random ones), cap the size of anything written, and reject any field the app doesn't use. Nobody can read or write anything outside a band ID they already know.

**What they don't do:** they don't stop someone who *has* your band link from editing it. That link is the key. For five people organising practice that's the right trade — but don't post it publicly, and if it ever leaks, hit **Switch live sync off** in Settings and **Go live** again to get a fresh band ID.

## 4. Switch it on in the app

1. Open your GitHub Pages URL on your phone or laptop. It must be the web address, not the local file — live sync is disabled on `file://`.
2. Go to **⚙ Settings → Live sync**.
3. Paste the database URL from step 2.
4. Check the line-up, the date window and your gigs are how you want them — **these are what everyone else will get**.
5. Hit **Go live**.

You'll land on the Share screen with a band link.

## 5. Send the band the link

Send **one link** to the other four. That's the whole thing. They open it, pick their name, and tap. Their availability appears on your screen by itself.

Tell them to add it to their home screen too — the app prompts them.

---

## Living with it

**The status dot** sits under the band name in the header:

| | |
|---|---|
| **Live** (yellow, slow pulse) | Connected, everything's syncing |
| **Syncing…** (fast pulse) | A write is in flight |
| **No signal** (red) | Offline. Your taps are saved and will send themselves when you're back |
| **Codes only** (grey) | Live sync isn't on |

**Nobody has to be online at the same time.** Tick whenever; it lands whenever.

**Editing later just works.** Tap a slot again and everyone's view updates. The Settings and Share screens both show *"Ron · 2d ago"* so you can see whose availability has gone stale before a gig.

**Changing the window, the slots or the line-up is safe.** Availability is stored against real dates, so widening the window, switching a time slot on or off, or adding a member leaves every existing tick where it was. Dropping someone removes only their availability.

**Locked practices sync too**, so when you 📌 a night the whole band sees it booked.

**If it all goes wrong:** Settings → **Switch live sync off** puts you back on codes with nothing lost. Your own ticks live on your phone regardless.

---

## Costs, honestly

Firebase's free Spark plan gives 1GB stored, 10GB/month downloaded and 100 simultaneous connections. A band of five uses roughly 2KB of storage, a few hundred KB a month, and five connections. You will not get near a bill.

The Spark plan has **no overage billing** — there's no card on file, so it cannot silently start charging you. If you somehow hit a limit it stops working until the month rolls over, rather than sending an invoice.
