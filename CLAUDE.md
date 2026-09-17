# Claude map

## Architecture
Static multi-page Lore marketing site: plain HTML entry pages plus shared `lore-widget.css` and `lore-widget.js`. It has no build system. Public forms post to the production grouphost service; every page is directly deployable from the repository.

## Map
- `index.html` - main landing page and primary product/install CTA.
- `try/index.html`, `waitlist/index.html` - onboarding/waitlist entry points and qualification form.
- `apply/index.html` - site-native application form.
- `memory/index.html`, `memory/memory.js` - public read-only memory experience.
- `demo/`, `v7/`, `k.html` - demo/investor-specific surfaces; preserve their audience intent.
- `ai-agent-for-slack/`, `ai-teammate-for-slack/`, `slack-memory/`, `for-startup-teams/` - search-intent landing pages.
- `privacy/`, `terms/` - legal pages.
- `lore-widget.css`, `lore-widget.js` - shared visual/component behavior.
- `robots.txt`, `sitemap.xml`, `llms.txt` - discovery metadata.

## Conventions
- Keep pages static and dependency-free unless explicitly assigned otherwise.
- Use relative shared-asset paths that work from nested directories.
- Production API host is `https://lore-host.d.onjrnm.link`; do not reintroduce stale Render URLs.
- Slack install CTA should point to the production `/slack/install` route when assigned; do not invent OAuth URLs.
- Forms must preserve every field, show success only after a confirmed stored response, and avoid duplicate submission.
- Do not expose secrets, admin tokens, private memory, or test data in client code.
- No paid services/cards. Make narrow, audience-safe edits.
- Visual changes require desktop and mobile pixel inspection before completion.

## Interface contracts
Raise-loop backend contracts live with `Lasp10/grouphost`, not in this static repo. The canonical handoff artifact is `lore-raise-loop-interface-contracts.md` supplied with the task/session. This repo should consume only stable public URLs and user-facing states; do not duplicate backend schemas here.

## Run and test
No install/build step. Serve from repo root:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/` and each changed nested route. Check links/assets, form request payload/outcome, browser console, and mobile/desktop screenshots. Useful static checks:
```bash
rg -n 'onrender.com|lore-host.d.onjrnm.link|/slack/install' .
find . -name '*.html' -print
```
