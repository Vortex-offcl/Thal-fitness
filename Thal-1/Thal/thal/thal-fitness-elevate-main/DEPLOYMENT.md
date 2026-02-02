SPA routing note

If you refresh a nested route (e.g. /floor-1) some static hosts will return a 404 because they try to fetch that path from the server.

What I added for better compatibility:

- A postbuild script that copies `dist/index.html` -> `dist/404.html` and creates `dist/_redirects` for Netlify. This ensures many static hosts (GitHub Pages, Netlify, etc.) serve the SPA fallback.
- A `public/_redirects` file so Netlify will serve `index.html` for all routes.
- A `vercel.json` with a rewrite rule for Vercel.
- Optional HashRouter support: set the Vite env variable `VITE_USE_HASH=true` to use `HashRouter` (URLs will look like `/#/floor-1`) if you can't configure rewrites on the hosting side.

How to use:

1. Build: `npm run build` (the `postbuild` script runs automatically and creates `dist/404.html` and `dist/_redirects`).
2. Deploy the contents of `dist` to your static host.
3. If your hosting provider requires a different configuration, see their docs for SPA rewrites (Netlify: use `/_redirects`, Vercel: `vercel.json`, GitHub Pages: ensure a `404.html` that serves the app).
