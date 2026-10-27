# Daily "who hasn't ticked" push message

Every morning a GitHub Actions job reads the band from Firebase and, if anyone has not ticked
(or has not updated in 14 days), sends **you** one push message. If everyone is up to date it
sends nothing. It only reads the database; it never writes.

## One-time setup (about 15 minutes)

**1. Install ntfy on your phone** (free, no account): search "ntfy" in the App Store / Google Play.
In the app, tap **+** and subscribe to a topic with a long random name nobody could guess, e.g.
`dad-practice-7k2m9qx4wz`. The topic name is the only password, so treat it like one.

**2. Find your band ID.** In the app: **⚙ Settings → Live sync**. The line at the bottom says
`Band ID …`. Copy it.

**3. Add three repository secrets.** On GitHub: the repo → **Settings → Secrets and variables →
Actions → New repository secret**. Add:

| Name | Value |
|---|---|
| `FIREBASE_DB` | your database URL, `https://notorious-dad-default-rtdb.firebaseio.com` |
| `BAND_ID` | the band ID from step 2 |
| `NTFY_TOPIC` | the topic name from step 1 |

Never put these values in a file in the repo. The repo is public.

**4. Add the workflow.** On GitHub: **Add file → Create new file**, name it
`.github/workflows/who-hasnt-ticked.yml`, paste in the contents of `reminders/who-hasnt-ticked.yml`,
and commit.

**5. Test it.** **Actions** tab → "Who hasn't ticked" → **Run workflow**. A message should land on
your phone within a few seconds (if anyone is waiting).

## Good to know

- **Timing.** It is scheduled for 08:00 UTC. GitHub can start scheduled jobs late when it is busy,
  so treat it as "around 8-9am".
- **60-day pause.** GitHub may switch scheduled workflows off after about 60 days with no activity
  in the repo. If the messages stop, open the Actions tab and re-enable it.
- **Failures.** If the band ID is wrong or Firebase is unreachable the job fails and GitHub emails you.
- **Quiet days.** To only nag people who have never ticked, add an env line `STALE_DAYS: 0` in the
  workflow. The default is 14 days.
- **Changing the band.** If you ever make a new band link (Settings → Switch live sync off, then Go
  live), update the `BAND_ID` secret.
