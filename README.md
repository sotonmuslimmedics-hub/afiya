# Afiya

A two-ended anonymous welfare line for Muslim Medics Southampton. Students share a
concern with no name attached; the Welfare Team reads and replies privately.
No sign-up for students — a random code (e.g. `AFY-3F9A2B1C4D`) is the only way
back into a thread.

This repo is the real implementation, built from the prototype exported by
Claude Design (see `project/Afiya.dc.html` and `chats/` for the original design
brief and iteration history).

- **Frontend:** React + TypeScript + Vite, deployed to Netlify
- **Backend:** Supabase (Postgres + Auth)
- **Routes:** `/` … student app · `/welfare` … Welfare Team app (behind Supabase
  Auth login), one Netlify site, one Supabase project

## How anonymity is enforced

- Students never authenticate. The public (anon) API key has **no direct
  read/write access** to the `concerns` or `replies` tables — Postgres Row
  Level Security blocks it entirely.
- All student actions (submit a concern, look up a thread by code, send a
  follow-up) go through Postgres functions (`supabase/migrations/0001_afiya_schema.sql`)
  that look up exactly one row matching the code the caller supplied. There is
  no query path that returns more than one student's concern.
- Codes are 10 random hex characters generated with a cryptographic RNG
  (16^10 ≈ 1.1 trillion combinations) — not practical to guess.
- Welfare Team members are ordinary Supabase Auth users. There's no public
  sign-up; you create their accounts yourself (see below), and any
  authenticated user can read the inbox and reply.

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/0001_afiya_schema.sql`. It
   creates the `concerns`/`replies` tables, RLS policies, and the RPC
   functions the frontend calls.
3. Under **Project Settings → API**, copy the **Project URL** and **anon
   public key** — these are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Under **Authentication → Providers**, make sure **Email** sign-in is
   enabled and disable public self sign-up (**Authentication → Settings →
   "Allow new users to sign up"** → off), since Welfare Team accounts should
   only be created by an admin.
5. Add each Welfare Team member as a user under **Authentication → Users →
   Add user** (set an email + password, or send them an invite). That's the
   entire access-control mechanism for `/welfare` — anyone you add there can
   log in and read the inbox.

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   Build command `npm run build`, publish directory `dist` (already set in
   `netlify.toml`).
3. Under **Site configuration → Environment variables**, add
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values from
   Supabase above.
4. Deploy. Students use the site root; the Welfare Team signs in at
   `/welfare`.

## Project structure

```
src/
  lib/            Supabase client, typed API wrapper, categories, status labels
  pages/student/  Welcome, Submit, Submitted (code reveal), Find my thread, Thread, How it works
  pages/welfare/  Login, Inbox, Detail, RequireAuth guard
  styles/         Classical design system tokens + app layout, ported from the
                   Claude Design export
supabase/
  migrations/     Schema, RLS policies, RPC functions (source of truth for the backend)
```

## Original design bundle

`chats/` and `project/` are the untouched handoff from Claude Design — the
design brief, iteration history, and the HTML/CSS/JS prototype this app was
built from. They're kept for reference; the prototype's iOS phone-frame
mockup was just how the design tool previewed both apps side by side, so the
real app here is a normal responsive mobile web page rather than a fake
device bezel.
