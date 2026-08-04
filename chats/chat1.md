# Afiya Muslim Medics Welfare App

_Started 2026-08-04 15:14 UTC_

---

## User

Create a two ended anonymous welfare mobile app for muslim medics southampton where students can submits concerns/worries/issues privately and it can be responded to privately without other students seeing. Use netlify for front end and supabase for backend and github for repos. Call it Afiya

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- deliverable: Interactive prototype only (recommended)
- platform_shape: Phone mockup (iOS-style frame)
- two_ends: Yes, that's it
- anonymity_model: Student gets a random anon ID/code at submission to check for replies later (no account)
- concern_categories: Yes, include category selection
- screens: Onboarding / welcome + reassurance about privacy, Submit a concern form, My concern thread (student side, view replies), Welfare team inbox (list of concerns), Welfare team single-concern reply view, Settings / how anonymity works page
- welfare_team_naming: Welfare Team
- tone: Warm, gentle, reassuring
- branding: Yes, feature the logo on splash/header

## Assistant

_[tool: copy_starter_component]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: copy_files]_

_[tool: read_file]_

_[tool: image_metadata]_

_[tool: dc_write]_

Let me verify it renders and interacts correctly.

_[tool: ready_for_verification]_

Built Afiya as an interactive two-phone prototype: student app (submit → anon code → thread) on the left, Welfare Team app (inbox → reply/resolve) on the right, sharing state so you can submit on one side and answer on the other live. Uses the Classical design system tokens and your Muslim Medics Southampton logo. It's a design prototype only — actual Netlify/Supabase/GitHub deployment would be a follow-up dev step.

## User

I think the text is too small.

## Assistant

_[tool: str_replace_edit]_

Now bump the JS-generated styles (chip labels, message bubbles, filter tabs, tabular code/time):

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Bumped text sizes throughout both phone screens (body copy, tags, buttons, inputs, list snippets) for better readability.

## User

button text seems too small

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Bumped all button text to 16px with more padding.

## User

Will the student app and welfare app require two different backends and two different netlify pages?

## Assistant

No — one Supabase backend (single `concerns`/`replies` tables) and it can be one Netlify site with two routes (e.g. `/` for students, `/welfare` gated by login), or two separate Netlify sites pointing at the same Supabase project if you want them fully separate deployments/domains. Either works; splitting into two sites just adds isolation, not a requirement.

## User

how do we protect people from accessing the welfare team app

## Assistant

Add authentication in front of the welfare routes: Supabase Auth (email/password or magic link) restricted to a fixed allowlist of welfare-team emails, plus Supabase Row Level Security policies so only authenticated welfare-team users can read/write the concerns/replies tables — the anonymous student side only ever gets an insert-only policy keyed to its own code, never read access to the full table. If it's one Netlify site, gate the `/welfare` route with that auth check (redirect to login if no valid session); if it's a separate site, put the same auth + RLS in front of it. This is backend work for whoever builds it from this prototype, not something the design file itself does.

## User

Use this as the transparent logo

## User

Make the logo bigger and at the top

## User

Make the logo bigger and at the top

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Made the top logo larger (140px). It was already the first element at the top of the page.

## User

Make the logo within the student app bigger

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Bumped the welcome screen logo to 130px.

## User

make the logo within the student app higher up

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Moved the welcome screen content up (top-aligned instead of centered) so the logo sits higher.

## User

move the welcome screen content back to where it was. Only the logo should move up

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Reverted the container to its original centered layout and pulled just the logo up with a negative margin.

## User

Bring the logo up so it's just under the island

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

_[tool: screenshot]_

_[tool: eval_js]_

_[tool: screenshot]_

The logo isn't visible near the dynamic island yet — it's still centered lower down. Let me check the top of the phone frame.

_[tool: eval_js]_

_[tool: screenshot]_

The margin-top:-140px pulled it up but there's still a gap below the island; it's centered content pushing down due to justify-content:center. Let me tighten further and reduce the gap to sit right under the island.

_[tool: str_replace_edit]_

_[tool: screenshot]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: screenshot]_

Good, it's now sitting just under the dynamic island.

_[tool: ready_for_verification]_

Logo now sits just under the dynamic island on the welcome screen.

## User

How do I change the app logo

## Assistant

You can either drag-and-drop a new image onto the logo directly in the editor (click it, then replace), or attach the new logo file here and tell me — I'll swap the `assets/mms-logo-transparent.png` reference for you.

## User

Does the welfare team app need a login

## Assistant

Yes — since it shows every student's concerns and replies, it needs to sit behind a real login (Supabase Auth) restricted to approved welfare-team members, not be openly reachable like the student side. The current prototype doesn't include a login screen since it's a design mockup; I can add one to the design if you want it shown, and it'll need to be built for real in the actual app.

## User

add one to the design

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now add the login screen markup and a logout link on the inbox header:

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Now add a logout link next to the "new" badge in the inbox header:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added a Welfare Team login screen (email/password, no real auth wired since this is a design prototype) that shows before the inbox, plus a "Log out" link in the inbox header to get back to it.

