# Deploying the CKRT site to GitHub Pages

One-time setup. After this, every push to `main` auto-publishes to https://ckrt.org.

## 1. Create the GitHub repository

1. Sign in to GitHub and create a **new repository** (e.g. `ckrt-website`).
   - It can be **public** (recommended — GitHub Pages is free for public repos) or
     private (Pages on private repos requires a paid plan).
   - Do **not** add a README/license from GitHub — this folder already has files.
2. Connect this local folder and push (run in this directory):

   ```powershell
   git remote add origin https://github.com/<your-username>/ckrt-website.git
   git add -A
   git commit -m "Initial CKRT website"
   git push -u origin main
   ```

   > The `_private/` folder is git-ignored and will **not** be uploaded.

## 2. Turn on GitHub Pages

In the repo on GitHub: **Settings → Pages**

- **Source:** "Deploy from a branch"
- **Branch:** `main`, folder `/ (root)` → **Save**

GitHub builds the site (Jekyll runs automatically) and gives you a temporary URL like
`https://<your-username>.github.io/ckrt-website/`.

## 3. Point the ckrt.org domain at GitHub Pages

The repo already includes a `CNAME` file containing `ckrt.org`, so GitHub knows the
intended custom domain. You just need to set DNS **at your domain registrar** (wherever
you bought ckrt.org).

Create these records for the apex domain `ckrt.org`:

**A records** (host: `@`):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**AAAA records** (host: `@`, IPv6 — optional but recommended):
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**CNAME record** for the `www` subdomain (host: `www`):
```
<your-username>.github.io
```

Then in **Settings → Pages → Custom domain**, confirm `ckrt.org` is entered, and once
DNS propagates (minutes to a few hours), tick **Enforce HTTPS**.

> Verify DNS from PowerShell: `nslookup ckrt.org` should return the four GitHub IPs above.

## 4. Optional — preview the site locally

GitHub renders the site for you, so local preview is optional. If you want it, install
Ruby + Jekyll and run `bundle exec jekyll serve` (a `Gemfile` is included). On Windows,
[RubyInstaller](https://rubyinstaller.org/) is the easiest route. Ask Claude to walk you
through it if needed.
