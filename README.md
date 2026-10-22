# Sean Avila Music

Official website for Sean Avila, country music artist. One plain HTML page, one stylesheet, and one small script that loads show dates from a Google Sheet. No build step.

## Structure

```
index.html        The whole site (home, music, shows, Instagram)
css/style.css     Styles
js/shows.js       Fetches show dates from the Google Sheet and renders them
assets/images/    Photos
```

## Before launch

The Spotify player is pointed at Sean's artist page and all Instagram links go to
@seansacoustics. No placeholders remain.

Show dates come from a Google Sheet, so adding a show is a matter of typing a row.
See "Show dates" below for the one-time setup.

## Show dates

The shows section is filled in by `js/shows.js`, which reads a Google Sheet that
has been published to the web as CSV. Past dates are hidden automatically. While
the sheet is loading the page says "Checking for upcoming dates". If the sheet has
no upcoming dates, the "No shows on the calendar" block is shown. If the sheet can't
be reached (or takes more than 12 seconds), a short "couldn't be loaded" message
with an Instagram link is shown instead, so a slow connection never looks like an
empty calendar. Without JavaScript, only the "No shows" block is visible.

### One-time setup

1. In Google Sheets, create a sheet with this header row in row 1:

   | date       | venue           | city                | time    | tickets                     |
   |------------|-----------------|---------------------|---------|-----------------------------|
   | 2026-11-14 | The Saddle Rack | Fremont, California | 8:00 PM | https://example.com/tickets |

   Column order doesn't matter and headers are case-insensitive. `time` and
   `tickets` are optional. Enter dates as `YYYY-MM-DD` (select the column and set
   Format > Number > Plain text first so Sheets doesn't reformat them; `M/D/YYYY`
   also works if it does).

2. File > Share > Publish to web. Under Link, choose the tab with the shows and
   pick "Comma-separated values (.csv)". Click Publish and copy the link. This is
   separate from normal sharing: the data at that link is public, which is fine
   for show dates, but don't put anything else on that tab.

3. Open `js/shows.js` and paste the link in place of `PASTE_PUBLISHED_CSV_LINK_HERE`.
   Commit and push.

To let Sean add dates himself, share the sheet with his Google account as an editor.

### Day to day

Add a row per show. Rows with a past date or an empty venue are ignored, so there is
no need to delete old shows. Google caches the published CSV, so edits can take up
to about five minutes to show on the site.

## Local preview

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Hosting on GitHub Pages with the Namecheap domain

1. Push this repo to GitHub. In the repo, go to Settings > Pages, set Source to
   "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
2. Add a file named `CNAME` at the repo root containing only the domain, for example
   `seanavila.com` (already added). Commit and push.
3. In Namecheap, open the domain > Advanced DNS and add these records:

   | Type  | Host | Value                 |
   |-------|------|-----------------------|
   | A     | @    | 185.199.108.153       |
   | A     | @    | 185.199.109.153       |
   | A     | @    | 185.199.110.153       |
   | A     | @    | 185.199.111.153       |
   | CNAME | www  | `<github-username>.github.io.` |

   Remove any default parking records Namecheap added for `@` and `www`.
4. Back in GitHub Settings > Pages, enter the custom domain, wait for the DNS check
   to pass, then tick "Enforce HTTPS". DNS can take up to an hour to settle.

## Photos

`assets/images/` holds only web-sized copies: the hero background at 1920px wide,
the two portraits at 720px wide, and a 1200 by 630 link-preview image. Full-resolution
originals live in `assets/originals/`, which git ignores, so they stay local and never
get served.
