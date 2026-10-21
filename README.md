# Sean Avila Music

Official website for Sean Avila, country music artist. One plain HTML page and one stylesheet, no JavaScript, no build step.

## Structure

```
index.html        The whole site (home, music, shows, Instagram)
css/style.css     Styles
assets/images/    Photos
```

## Before launch

The Spotify player is pointed at Sean's artist page and all Instagram links go to
@seansacoustics. No placeholders remain.

Once Sean has a show booked, open `index.html`, find the `shows` section, and follow
the comment there: copy the example row out of the comment and edit the text. Delete
the "No shows on the calendar" block when at least one date is listed.

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

Current photos are 640px wide and carry the photographer's watermark. Ask Kendal
Huntsman Photography for full-resolution, unwatermarked files when possible; drop
them into `assets/images/` with the same filenames and nothing else needs to change.
