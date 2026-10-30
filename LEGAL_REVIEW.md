# Lore Privacy Policy and Terms: legal review

**This is not legal advice.** It is a working review for Ankith to take to a licensed attorney. It compares what the
pages say with what the code does, flags legal risk, and proposes text. A lawyer should confirm every legal
conclusion, especially the state laws on minors, which change often and several of which are in litigation.

Reviewed:

- `lore-landing` (this repo): `privacy/index.html`, `terms/index.html`, `vercel.json`, `memory/memory.js`.
- `Lasp10/grouphost` at branch `claude/amazing-ritchie-09z23u` (commit `47a22bc`): `host/legal_pages.py`,
  `CLAUDE.md`, `host/forget_everywhere.py`, `host/consent.py`, `host/teen_mode.py`, `host/network/gate.py`,
  `host/invite_gate.py`, `host/sendblue.py`, `host/engine.py` (STOP handling lives here), `host/google_connector.py`,
  `host/composio_mail.py`, `host/card_visitor.py`, `host/a2a.py`, `host/ledger.py`, `host/db.py`, `ENV.md`, plus
  `host/lore_card.py`, `host/outreach.py`, `host/computer_lane.py`, `host/invites.py`, `host/get_started.py`,
  `host/quiet.py`, `host/profiles.py`, `host/splits.py`, `host/waitlist.py`, `infra/aws/ecs.tf` where a claim led there.

All line numbers are for grouphost at commit `47a22bc` unless marked `lore-landing`.

What I could not see: the production environment variables. Several findings depend on flags (`LORE_MINOR_RULES`,
`LORE_TEEN_MODE`, `LORE_GMAIL_PROVIDER`, `LORE_GOOGLE_PROVIDER`, `LORE_GATEKEEPER_LOGIN_ACCOUNT`,
`LORE_GOOGLE_FULL_SCOPES`). I used the code defaults and what the brief says ("minor rules are currently off in
prod"). Ankith should confirm the live values.

Redlined drafts are in `privacy/index.html` and `terms/index.html` on this branch. Insertions are underlined in
green, deletions struck in red, and a "Show clean copy" switch at the top hides the deletions. Placeholders in
`[BRACKETS]` need Ankith's answers (see the end of this file). Nothing here is on `main`.

---

## Risk summary

| # | Risk | Area | One line |
|---|------|------|----------|
| H1 | High | Minors | In prod, 13 to 17 year olds can publish a public profile anyone can message, be introduced to adults, and get no teen protections, while the pages promise a safer experience. |
| H2 | High | COPPA | When someone says they are under 13, Lore refuses entry but keeps their interview, messages and age, and can still waitlist them. |
| H3 | High | Companion chatbot laws | California SB 243 and New York's AI companion law may apply; the safeguards they require exist in `teen_mode.py` but are switched off. |
| H4 | High | Accuracy | The privacy page says "the people who run lore review requests" and the Terms say access is "in order of signup". In fact Lore's AI interview decides, and its call is final. |
| H5 | High | Accuracy | The pages say Lore always asks before it pays or buys. The code auto-approves steps the person's ask already covered and purchases under a spend limit they set. |
| H6 | High | Undisclosed processing | The intake can use the founder's own signed-in LinkedIn account, through an automated browser, to look up applicants. Not disclosed; likely against LinkedIn's terms. |
| H7 | High | Contract basics | No legal entity is named; the site domain (`loregroupchat.com`), the backend (`host.loresocial.net`) and the brand domain (`loresocial.net`) disagree; contact addresses may not match. |
| H8 | High | Accuracy | The static privacy page leaves out Composio's full-mailbox access and its one-year logs; the backend version includes them only when the flag is on. |
| M1 | Medium | Texts | Lore sends no STOP confirmation itself; the HELP reply has no email or phone; the Terms have no SMS program terms. |
| M2 | Medium | Texts | Lore texts people 1:1 unprompted (`outreach.py`) based on what they said in a group. Needs a clear consent basis and disclosure. |
| M3 | Medium | Accuracy | Lore-to-lore sharing is decided by the model with no code limit; the policy promises "only that result, and at most one short question and answer". |
| M4 | Medium | Accuracy | Things kept after "forget me everywhere" (the let-in mark, card handles, ban list) and several retention periods are not in the policy. |
| M5 | Medium | AI vendors | "We do not train on your content" depends on every direct model provider being on a no-training tier. Only OpenRouter has the no-training flag. |
| M6 | Medium | Sensitive data | Memory can hold health, sexuality and other sensitive facts. Washington's My Health My Data Act and similar laws may require separate consent. |
| M7 | Medium | Group chats | Everyone in a group, including people who never signed up, is recorded and sent to AI vendors. Wiretap-style claims (CIPA) are a live risk for chatbots. |
| M8 | Medium | Two versions | The backend's `/terms` (`host/legal_pages.py:430`) is a different contract from the static Terms. |
| M9 | Medium | Terms gaps | No terms for errands on websites, indemnity, AI output, community rules, copyright notices, or a dispute process beyond courts. |
| M10 | Medium | Tracking | Install invite emails carry open-tracking pixels and the site logs IP and user agent; the policy does not say so. |
| M11 | Medium | Google | Classroom data from students, and Gmail through Composio, need specific handling under Google's rules. |
| L1 | Low | Forms | Notice at collection on the waitlist and apply forms. |
| L2 | Low | Cookies | Cookie and local storage statement is thin. |
| L3 | Low | Breach | Breach notice wording. |
| L4 | Low | International | EU and UK users: transfer mechanism, representative, Article 22. |
| L5 | Low | Changes | "Using lore after an update means you accept it" is weak for material changes. |
| L6 | Low | Clean-up | Slack wording, internal docstring that contradicts deletion. |

---

## High risk

### H1. Minors on the network get no teen protections in production

**What the pages say.** Privacy, "Children and teens" (lore-landing `privacy/index.html:313-334`): teens need a
parent's permission, and "No contact from strangers without consent." The backend's own dashboard tells people
"lore profiles are for people 18 and over" (`host/lore_card.py:1483`) and shows an "I'm 18 or older" box
(`host/lore_card.py:1421`).

**What the code does.**

- `host/network/gate.py:14-17`: `minor_rules()` is off unless `LORE_MINOR_RULES=1`. Off, `age_state` returns
  `unknown` for everyone and `ok()` lets everyone into finds, intros, circles and asks (`gate.py:38-49`, `62-69`).
  The owner note at `gate.py:15` records the choice ("remove that hard guard of 18").
- `host/teen_mode.py:26-29`: teen mode is off unless `LORE_TEEN_MODE=1`. Off, there is no profile block for
  minors, no intro block, no romance block, no 3-hour AI reminder, and no crisis guidance (`teen_mode.py:9-17`).
- `host/lore_card.py:385-387`: the card age gate is off, so the "I'm 18 or older" box is optional and a known
  13 to 17 year old can publish a public profile that "anyone with the link can message".
- `host/invite_gate.py:985`: the interviewer is told to grade high schoolers "just as strict", and asks for
  screenshots of their LinkedIn, CV or resume (`invite_gate.py:979`). Lore collects work history from minors.

**Why it matters.**

- The FTC treats a privacy page that promises protections the product does not deliver as deception (FTC Act
  Section 5). "No contact from strangers" is true only in a narrow sense once a teen has a public profile.
- An invite-only network that lets adults find, ask and get introduced to 13 to 17 year olds is the core risk area
  for state minor online safety laws. Examples to check with counsel (status changes often, several are enjoined in
  part): California Age-Appropriate Design Code (largely enjoined in *NetChoice v. Bonta*), Maryland Kids Code (in
  effect), Vermont's Age-Appropriate Design Code, Texas SCOPE Act (HB 18), Utah Minor Protection in Social Media Act,
  Florida HB 3, Louisiana, Tennessee, Georgia, Mississippi HB 1126, Virginia's 2026 limits on minors' social media
  time, and Nebraska's age-appropriate design law. Many define "social media platform" broadly enough to reach a
  people-matching network, and several require age assurance, parental consent or default high-privacy settings for
  minors.
- Default settings matter: design codes require the most protective settings for known minors by default. Lore
  already knows a minor's stated age (`invite_gate.py:1501-1505` carries the interview age to the account).
- Product liability and negligence suits over adult-minor contact on social apps are rising regardless of statute.

**Recommendation (Ankith decides; the code changes are one-line flags).**

1. Turn the existing rules back on for *known* minors only, which keeps "no blockers" for adults and unknowns:
   `LORE_MINOR_RULES=1` (keep `LORE_NET_AGE_STRICT=0`) and `LORE_TEEN_MODE=1`. Known minors then get no public
   profile, no intros with adults, no strangers' messages, and the AI reminder and crisis rules.
2. Remove the "I'm 18 or older" box or make it mean something (`lore_card.py:1421`). Today it contradicts the
   13+ policy and does nothing.
3. Do not ask minors for CV or LinkedIn screenshots in the intake. Add to the interviewer guidance (persona, not
   code): for someone under 18, take a school or project example, not a CV or a profile screenshot.
4. If the rules stay off, rewrite the teen section so it promises only what is true. The draft gives both versions;
   the default draft assumes you turn the rules on.

**Suggested replacement text** (privacy, "Teens 13 to 17"):

> **Teens 13 to 17.** lore is open to teens 13 to 17 with a parent's or guardian's permission. When lore knows
> someone is under 18, because they told it their age or the interview found it, lore turns on teen settings:
> no public profile, no introductions to or from adults, no messages from people they do not know, no romantic
> or sexual content, a reminder every few hours that lore is an AI, and crisis resources (call or text 988 in the
> US) when someone seems unsafe. These settings stay on until the person tells lore they have turned 18.

If you keep the rules off, replace it with:

> **Teens 13 to 17.** lore is open to teens 13 to 17 with a parent's or guardian's permission. Teens use the
> same lore as adults: a teen can publish a public profile that anyone with the link can message, and can be
> introduced to other members, including adults, when both people say yes. Parents and guardians should talk with
> their teen about this before they join.

(Counsel will likely say the second version is not a safe place to land.)

### H2. Under-13 users: the refusal keeps their data

**What the code does.** `host/invite_gate.py:1434-1438`: if the interview recorded an age under 13, `let_in` is
refused, but "Nothing else changed; you can still record waitlist with your reason". The intake record (name,
school or work, what they want, links, age, sealed answers) stays in `invite_wait:<hash>`, and their 1:1 messages
stay in `messages`. Age is asked "only when it isn't plain" (`invite_gate.py:977`), so a child who does not state
an age is never asked. Group chats with children in them are not checked at all.

**What the page says.** Privacy `:315-317`: "If we learn that a user is under 13, we will delete their account and
their data and stop messaging them."

**Why it matters.** Under COPPA, once an operator has actual knowledge it is collecting personal information from a
child under 13 without verified parental consent, it must stop and delete. A stored interview that says "age: 11"
is actual knowledge. FTC COPPA penalties are per violation (currently over $50,000 each). Lore's marketing to
"students" makes a neutral age question at the start the safer design; a service that knows it reaches middle
schoolers can be treated as mixed audience.

**Code change needed so the policy is true** (grouphost):

1. In `carry_out` (`invite_gate.py:1434`), when the recorded age is under 13: do not offer waitlist. Delete the
   intake (`invite_gate.forget(db, who)`, the same call the STOP path uses at `engine.py:1584`), delete their 1:1
   messages and memory (the `forget_everywhere` sweep for that principal), keep only a one-way hash so the number
   is not re-interviewed for a cooling-off period, and send one plain line that lore is for 13 and up.
2. Ask every newcomer's age in the interview, neutrally (no hint of the right answer), instead of "only when it
   isn't plain". This is persona text in `GUIDE` (`invite_gate.py:977`), not a code rule.
3. Add an "under 13" path for groups: if a group member says they are under 13, Lore stops storing their messages
   in that group and deletes what it has. This needs an engineering design; flag it.

**Suggested replacement text** (privacy):

> **Nobody under 13 may use lore.** lore asks every new person their age before they join and does not let in
> anyone under 13. If someone tells lore they are under 13, lore stops, deletes what it collected from them, and
> does not text them again. If we learn in any other way that we have information from a child under 13, we delete
> it. If you think a child under 13 has used lore, email [PRIVACY EMAIL] and we will delete it.

### H3. AI companion and chatbot laws

**Facts.** Lore keeps a long relationship with each person, remembers personal details, sends unprompted
heads-ups (privacy `:90-91`, `host/outreach.py:1-8`), and runs on adaptive language models. `teen_mode.py` already
implements a 3-hour AI reminder and crisis guidance, but it is off (`teen_mode.py:26-29`).

**Why it matters.** California SB 243 (companion chatbots, in effect January 1, 2026) requires clear notice that
the user is talking to an AI, a published protocol for suicidal ideation and self-harm with crisis referrals, and,
for known minors, a reminder at least every three hours that the bot is an AI, plus steps against sexual content.
It gives a private right of action. New York's AI companion law (General Business Law Article 47, in effect November
2025) has similar crisis and disclosure duties. Both exclude bots used only for productivity or customer service;
Lore's social features, memory and proactive texts make the exclusion uncertain. California's BOT Act (Bus. and
Prof. Code 17940) also requires disclosure when a bot is used to influence a sale.

**Recommendation.** Ask counsel whether Lore is a "companion chatbot". Either way, cheap steps: turn teen mode on
(H1), make the crisis guidance in `teen_mode.BRIEF` part of the base persona for everyone, keep the first-text AI
disclosure, and publish the crisis protocol.

**Suggested text** (new privacy and Terms section "lore is an AI"):

> lore is an AI, not a person. It says so when you first text it and whenever you ask. If you tell lore you are
> thinking about hurting yourself or someone else, lore will point you to people who can help right away, such as
> the 988 Suicide and Crisis Lifeline (call or text 988 in the US), and it does not replace them. lore is not a
> therapist, doctor or emergency service.

### H4. Who decides admission is misdescribed

**What the code does.** `host/invite_gate.py:1-15`: Lore's model runs the interview and calls `decide_entry`
(`let_in`, `waitlist`, `need_more`). `invite_gate.py:997`: "decide_entry carries out your call at once and it is
final." The founder can override from the console (`invite_gate.py:5`). Anyone with no invite and no vouch is
always waitlisted (`invite_gate.py:1439-1444`). STOP during the interview forgets it (`engine.py:1580-1585`).

**What the pages say.**

- Privacy `:163-165`: "the people who run lore review requests". Not accurate.
- Privacy `:118-120`: "lore does not use your information to make decisions about you that have legal or similarly
  significant effects". Admission to a social network is probably not "similarly significant" under GDPR or state
  laws, but the next sentence ("people still decide for themselves") is wrong for admission.
- Terms `:355`: "Access is limited and given in order of signup." Not accurate.

**Why it matters.** Misdescribing an automated decision is a deception risk. If EU or UK users can join, GDPR
Article 22 and the transparency duties in Articles 13 and 15 require explaining automated decisions and offering
human review where they have significant effects. Colorado's AI Act (now effective June 30, 2026) covers
"consequential decisions" (education, employment and similar); admission to Lore likely is not one, but the
interview grades students on their achievements, so ask counsel.

**Suggested replacement text** (privacy, new "How you join" section):

> **How you join.** lore is invite-only. When you first text lore, it interviews you with a few questions about who
> you are, what you are working on and who you want to meet, and it may ask for a photo or screenshot of your work.
> lore's AI decides from your answers whether to let you in now, put you on the waitlist, or ask more. A member's
> invite or vouch is required; without one you go on the waitlist. You can ask for a person at lore to review a
> decision by texting "talk to a human" or emailing [CONTACT EMAIL], and you can be considered again when you have
> something new to show. We keep your interview answers until you are let in or ask us to delete them, and we use
> them only to decide on your request and to draft your profile if you are let in.

Terms: replace "Access is limited and given in order of signup" with the invite-only text in the Terms draft.

### H5. "Approval before it pays or buys" is not always true

**What the code does.**

- `host/computer_lane.py:2256-2259`: "A held step the person's own ask told Lore to do (send it, submit it, sign me
  up) goes ahead when the decision model is sure", recorded as approval from the ask. Payments and purchases are
  excluded from this path.
- `host/computer_lane.py:2357-2361`: a held step goes ahead without asking again if it is the very step they said yes
  to, "or (b) it is a purchase at or under the spend limit they set themselves" (`agent_reply.py:777`,
  `owner_rules.set_spend_limit`). Up to six steps per yes (`computer_lane.py:2328`).
- Errands can sign in with a saved login and reach a checkout that uses a card stored at that site
  (`computer_lane.py:3196-3199`).

**What the pages say.** Privacy `:17-18` and `:113-114`: lore asks "before it sends an email, posts, books, pays or
buys anything for you." Terms `:367`: "it stops for your approval before it sends, posts, books or buys anything."

**Why it matters.** This is a factual promise about money. A charge the person did not expect, after a page that said
Lore always asks, is a deception claim and a chargeback dispute. It also matters for the Terms' liability allocation.

**Suggested replacement text** (privacy short version and AI section):

> lore does not send, post, book, pay or buy anything for you unless you said yes: either in your request ("book
> it", "send it") or when lore shows you the step and asks. If you set a spending limit, lore can complete a
> purchase at or under that limit that you asked for without asking again. lore never uses a card unless it is
> saved in your own account on that website, and it never moves money between people; split payments are links
> you tap yourself.

Terms: see "Errands lore does for you" in the Terms draft (authority, your approval, spending limits, who is
responsible).

**Code change (optional, safer):** require a fresh yes for any purchase over a small default (for example $0) until
the person sets a limit, and show the limit in the dashboard. If that is already the default, the text above is
accurate.

### H6. The intake uses the founder's LinkedIn login on applicants

**What the code does.** `host/invite_gate.py:20-22` and `ENV.md:479`: with `LORE_GATEKEEPER_LOGIN_ACCOUNT` set, a
read-only `use_computer` errand fills the founder's saved `linkedin.com` login to view an applicant's LinkedIn
profile; views are counted (`invite_gate.py:959`).

**Why it matters.**

- Not disclosed anywhere. The privacy page says Lore collects "the email, name and answers you type in" for joining.
- LinkedIn's User Agreement (section 8.2) bans bots and automated access to profiles and using another's account
  to scrape. The founder's personal account is exposed to suspension, and LinkedIn has sued scrapers.
- It applies to minors too (H1).

**Recommendation.** Turn it off (unset `LORE_GATEKEEPER_LOGIN_ACCOUNT`). Use only what the applicant shows (their
screenshot) and public pages that do not need a sign-in. If you keep it, disclose it and get counsel's view on the
LinkedIn terms.

**Suggested text** (inside "How you join"): "To check what you tell us, lore may read links you give it and public
web pages about you." Delete the signed-in check; do not describe it as acceptable.

### H7. No legal entity, and domains and contacts disagree

**Facts.**

- The pages name "the team that runs lore" in Sacramento (privacy `:25-28`, Terms has no party at all).
- Site canonical URLs are `www.loregroupchat.com` (lore-landing `privacy/index.html:1`); `vercel.json` rewrites to
  `host.loresocial.net`; `CLAUDE.md` says the API host is `host.loregroupchat.com`; the brand is moving to
  `loresocial.net`.
- Contacts: `privacy@loregroupchat.com`, `legal@loregroupchat.com`. Confirm these inboxes exist and are read.
- The HELP text points to `loregroupchat.com` by default (`host/sendblue.py:191`).

**Why it matters.** A contract needs a party. Without an entity, Ankith is personally the counterparty and personally
liable. Privacy laws (CCPA, GDPR) require the business's identity and contact details. Mismatched domains also fail
Google's OAuth verification and carrier (10DLC / Sendblue) reviews.

**Recommendation.** Form the entity before scaling; use one domain; put the entity name and a mailing address in both
pages and the HELP reply. The drafts use `[COMPANY LEGAL NAME]`, `[MAILING ADDRESS]`, `[DOMAIN]`, `[PRIVACY EMAIL]`
and `[LEGAL EMAIL]` placeholders.

### H8. Composio and full Gmail access missing on the static page

**What the code does.** `host/legal_pages.py:382-405` adds a Composio section to the backend's `/privacy` only while a
Composio flag is on, saying Composio's Google app asks for "full access to your mailbox" (`:390`) and keeps each
action's request and answer "for up to a year" (`:398`). The static page (lore-landing `privacy/index.html:214-215`)
says only "Composio, only if lore connects your Gmail through Composio". The Composio toolkits can also cover
Outlook, Notion, Dropbox, OneDrive, Todoist and Zoom (`ENV.md:119-121`).

**Why it matters.** Google's API Services User Data Policy requires the privacy policy to disclose accurately what
Google data is accessed and with whom it is shared. A full-mailbox grant plus a year of logs at a third party is
material. The two pages also say different things, which undercuts both.

**Recommendation and code change.** Put the Composio paragraph on the static page permanently (worded "when you
connect through Composio"), and list every toolkit that can be turned on. Then make the backend `/privacy` and
`/terms` routes redirect to the static pages (`host/legal_pages.py:473-484`) so there is one text.

**Suggested text:** see "Connections through Composio" in the privacy draft.

---

## Medium risk

### M1. Texting rules (TCPA and CTIA)

**What the code does.**

- STOP and its variants (STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT) as a whole message opt the number out and
  are stored permanently (`host/engine.py:1414`, `:1572-1587`; `host/sendblue.py:236-252`). Lore sends no
  confirmation itself ("no reply", `engine.py:1573`). START and UNSTOP opt back in (`engine.py:1588-1605`).
- In a group, STOP only makes Lore stop answering or texting that person from that group (`host/quiet.py:172-176`,
  `engine.py:1425-1440`). They still see the group's messages, including Lore's.
- HELP and INFO get a fixed reply: "Lore: an AI assistant you text. Help: loregroupchat.com. Msg & data rates may
  apply. Reply STOP to opt out." (`sendblue.py:186-193`).
- The sign-in page has a good consent line (`host/get_started.py:210-212`). Most people start by texting Lore first.

**Why it matters.** CTIA's messaging principles and carrier rules expect a one-time opt-out confirmation, a HELP
reply with a support email or toll-free number, and program terms (who is texting, message frequency, rates, how
to stop). Sendblue sends over iMessage, which is not a carrier channel, but messages can fall back to SMS and
Sendblue enforces carrier-style rules (the code records a Sendblue "SpamRule" opt-out at `outreach.py:33`). The TCPA
and state laws (Florida FTSA, Oklahoma, Maryland) apply to texts to phone numbers whatever the app.

**Code changes.**

1. Confirm with Sendblue whether it sends the STOP confirmation. If it does not, send one fixed line on the first
   STOP: "lore: you're opted out and won't get more texts. Reply START to resume." (This is the legal text the owner
   rules allow, like HELP.)
2. Set `LORE_HELP_CONTACT` to "[SUPPORT EMAIL]" and add the company name, for example: "lore by [COMPANY]: an AI
   assistant you text. Help: [SUPPORT EMAIL]. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt
   out."
3. Make sure quiet hours (8 a.m. to 8 p.m. recipient local time, per Florida and Oklahoma) apply to every unprompted
   text, not only some.

**Suggested Terms text:** see "Text messages" in the Terms draft.

### M2. Unprompted 1:1 texts from group conversations

**What the code does.** `host/outreach.py:1-8`, `:169-227`: when someone says something in a group that their own
assistant could help with, a model decides and Lore texts them 1:1 "unasked". Only people who "use Lore"
(`outreach.py:178`, `used_lore`) and are not opted out (`:151-165`) are texted; at most 20 a day per line and never
after two unanswered (`:33-39`). Separately, at most one proactive heads-up a day in a 1:1 (privacy `:90-91`).

**Why it matters.** These are texts the person did not ask for. Consent to get replies is not always consent to get
new conversation-starters. The bigger risk is perception: people may find it invasive that a group remark triggered
a private text.

**Recommendation.** Disclose it plainly (draft does), offer an off switch ("lore, don't text me first"), and make sure
`used_lore` means the person texted Lore 1:1 or signed up, not only that they wrote in a group.

### M3. What crosses between people's Lores

**What the code does.** `host/a2a.py:10-14`: after the owner's 2026-10-29 change, "each lore is given the facts ...
and decides what to pass; code keeps only room isolation ... the spend ceiling and injection labeling. Nothing it
writes or reads is cut to a length." The candidate's whole 1:1 context is read by their own Lore's calls
(`a2a.py:16-18`). A free-form `message` type exists (`a2a.py:8`). Logged fields are kept 90 days, then counts only
(`a2a.py:22-24`, `:38`).

**What the page says.** Privacy `:156-160`: "Only that result, and at most one short question and answer, pass
between the two lores." That is a hard promise the code no longer enforces.

**Suggested replacement text:**

> **What passes between lores.** When someone's lore asks yours about a request, your lore reads the request
> against what you have told it, privately, and decides what to say back, guided by rules to share only what the
> request needs and never your contact details, private notes or anything you asked it to keep private. Your lore
> passes on your own answer in your words. A model makes these choices, so it can make mistakes; you can set rules
> for what your lore turns down, and you can see and correct what it shared. We keep the content of these exchanges
> for 90 days, then only counts.

**Code change (recommended):** a structured "may share" list is cheap insurance: let the model choose from typed
fields (fit verdict, one question, the person's own reply) and drop anything outside them. This is a hard guard of
the "room isolation" kind the owner rules allow.

### M4. What survives deletion, and missing retention periods

Missing or inaccurate in privacy `:228-244`:

| Data | Where | What the policy should say |
|------|-------|----------------------------|
| "Was let in" mark, a keyed hash of the phone | `invite_gate.py:24-27`, `forget_everywhere.py:379-386` | Kept after deletion unless you ask; lets you come back without a new invite. |
| Card handles (slug and account id) | `forget_everywhere.py:523-524` | Kept so nobody takes over your old link. |
| Ban list | `forget_everywhere.py:493-494` | Disclosed already ("the ban stays"). OK. |
| Interview / waitlist record (sealed answers, screenshots, decision reason) | `invite_gate.py:41-44` | Kept until let in, STOP, or deletion request. Not in the policy at all. |
| Lore-to-lore exchange content | `a2a.py:22-24` | 90 days, then counts. |
| Teen flags and stated age | `teen_mode.py:38-40` | Kept with the account; deleted with it (`forget_everywhere.py:277`). |
| Approval records | `consent.py:24-38` | Policy says fingerprints, deleted with your account; code agrees (`forget_everywhere.py:128`). OK. |
| Invite email open pixels, site page views (IP, user agent) | `forget_everywhere.py:517-519` | Not disclosed; give a period. |
| Backups | n/a | "limited time" should be a number (for example 35 days). |
| Website forms | `forget_everywhere.py:512-516`; `waitlist.py:71-81` stores IP and user agent | Add IP and user agent; give a period. |

### M5. "No training on your content" depends on vendor tiers

**Facts.** `ENV.md:430`: every OpenRouter request carries `data_collection: deny`. Direct providers (Anthropic,
Gemini, Groq, Mistral, Cloudflare Workers AI, Baseten; `ENV.md:33`, `:169`) and search vendors (Tavily, Exa, Jina,
TinyFish) are called with their own terms. Some free tiers (for example the Gemini API free tier) allow the
provider to use content to improve its products.

**Why it matters.** "We do not use your content to train AI models" is about Lore; readers will take it to cover
Lore's vendors. If a vendor trains on it, the promise is misleading.

**Recommendation.** Confirm each direct provider is on a paid or zero-retention tier, or route through OpenRouter only.
Keep the draft's narrower wording: "We do not train AI models on your content, and we use AI providers only on terms
that do not let them train on it" (true only after the check).

### M6. Sensitive and health data in memory

Memory keeps whatever people say (privacy `:42-49`), which will include health, mental health, sexuality,
immigration and similar facts about members and about third parties in groups. Washington's My Health My Data Act
applies to any business that collects consumer health data of Washington consumers, has no size threshold, needs
consent before collecting, a separate consumer health data privacy policy, and gives a private right of action.
Nevada's SB 370 is similar. CPRA treats several of these as sensitive personal information.

**Recommendation.** Ask counsel whether to (a) add a Consumer Health Data Privacy Policy and an in-chat consent, or
(b) tell the model not to save health facts as memory unless the person asks it to remember them. The draft adds a
"Sensitive information" paragraph either way.

### M7. People in groups who never signed up

Lore receives and stores every message in a group it is in (privacy `:40-41`, `:64-65`) and sends them to AI vendors.
Non-users never accepted the Terms. Plaintiffs have used the California Invasion of Privacy Act against website
chatbots whose vendors read chats. Lore is a visible participant, which helps, but non-users may not know an AI
vendor is reading.

**Recommendation.** When Lore joins a group, its first line should say it is an AI, it remembers what is said in the
group, and anyone can say "lore forget this group" or remove it. Keep the Terms promise that the person who adds
Lore tells the group. The draft adds this to both pages.

### M8. Two different Terms

`host/legal_pages.py:430-452` serves a different, shorter Terms at `/terms` on the backend ("explicit approval in
the chat", no liability cap, no governing law). Two contracts with different terms invite a court to pick the one
worse for you. **Code change:** redirect the backend `/privacy` and `/terms` to the static pages, or render the same
file.

### M9. Terms gaps

Missing: who the parties are, eligibility for a social network, errands on websites (Lore acting as your agent,
compliance with sites' terms, your responsibility), spending limits, AI output (ownership, accuracy, no reliance),
community rules for a people network (no harassment, no contacting minors for sexual or romantic purposes, no fake
identities, no scraping members), reporting and blocking, indemnity, copyright complaints (DMCA agent), feedback,
third-party services (Apple, Google, Sendblue), export and sanctions, assignment, severability, entire agreement,
notices, and an informal dispute step that actually has a time period.

Arbitration and class waiver: a business choice. Pros: limits class action exposure (for example TCPA and CIPA class
claims, which are the biggest dollar risks above). Cons: mass arbitration fees, and contracts with minors can be
disaffirmed, so arbitration is weaker against teen users. The draft includes an arbitration clause with a small
claims carve-out, an opt-out window and a mass-filing batch process, in a separate clearly marked section Ankith can
drop.

### M10. Tracking pixels and analytics

`forget_everywhere.py:517-519` lists `growth_pixel_tokens`, `growth_pixel_opens` (IP, user agent) for install
invite emails, and `growth_page_views` (IP, user agent). The privacy page says only "pages viewed" and "We do not use
advertising cookies or third-party ad trackers." Email open tracking is not an ad tracker, but it should be
disclosed. The draft adds it.

### M11. Google: Classroom and Composio

- Classroom scopes (`host/google_connector.py:501-504`) read a student's courses and coursework. Most students are
  minors. Google Workspace for Education domains let admins block third-party apps, and schools may require a data
  privacy agreement. Disclose that Lore reads Classroom only for the student's own requests, and do not use
  Classroom data for the network (matching or intros).
- Gmail through Composio means Composio's Google app holds the grant; Lore's Limited Use statement should also say
  Lore does not let Composio use the data except to provide the connection (the draft does).
- Restricted scopes (`gmail.modify`) require Google's security assessment before public launch
  (`google_connector.py:24-26`, `:36-39`). Keep them test-only until then, as the code does.

---

## Low risk

**L1. Notice at collection on forms.** Waitlist and apply forms should link the privacy page next to the submit
button: "By submitting, you agree to our Terms and Privacy Policy." CCPA requires a notice at or before collection
if CCPA applies.

**L2. Cookies and local storage.** The memory page stores a chat id in `localStorage`
(lore-landing `memory/memory.js:5`); the dashboard uses a sign-in cookie. The draft adds a short "Cookies and similar
technology" section.

**L3. Breach notice.** Change "as the law requires" to "without unreasonable delay and as the law requires, by text or
email". Most state laws set 30 to 60 day outer limits.

**L4. EU and UK.** If EU or UK users can join: name a transfer mechanism (EU-US Data Privacy Framework if certified,
otherwise Standard Contractual Clauses), consider an Article 27 representative, explain the automated admission
decision and offer human review (H4), and note the EU AI Act's transparency duty to tell people they are talking to an
AI. If not, say lore is for people in the United States and block non-US numbers at the interview. The draft assumes
US only, with the EU text kept as an alternative.

**L5. Changes.** "Using lore after an update means you accept it" (Terms `:400`) is weak for material changes,
especially arbitration. The draft gives 14 days' notice by text and asks for a yes for changes to dispute terms.

**L6. Clean-up.**

- Slack sentences can be shortened now that Slack is off (`CLAUDE.md`, owner 2026-10-28).
- `host/consent.py:8` says approval rows are never deleted; `forget_everywhere.py:128` deletes them. Fix the
  docstring so nobody "fixes" the code the wrong way.
- The backend support page says STOP is "honored by the carrier network" (`legal_pages.py:461-463`); Lore honors it
  itself. Fix the wording.

---

## US state privacy laws (CCPA/CPRA and others)

- **Does CCPA apply?** Only above $26.625M revenue (2025 figure, indexed), or buying, selling or sharing data of
  100,000+ California consumers, or half of revenue from selling or sharing. Lore probably is not covered today. Other
  state laws (Virginia, Colorado, Connecticut, Texas, Oregon and more) have similar thresholds; Texas and Nebraska
  apply to small businesses only for sale of sensitive data. Keeping the rights section is still wise: it is what
  users expect, and you will cross the 100,000 line quickly as a network.
- **Sale and share.** Lore does not sell or share for cross-context ads. Correct as written. Note: introducing
  members to each other is a disclosure the person directs, which is not a "sale".
- **Sensitive personal information.** Login credentials, message and email contents (where Lore is not the intended
  recipient, such as Gmail), and health facts. Use only to provide the service, so no "limit" link is needed. The
  draft keeps that.
- **Minors.** Several state laws require opt-in consent to sell data of teens (13 to 15 under CCPA; under 18 in some
  states) and ban targeted ads to minors. Lore does neither. Keep the promise.
- **Automated decisions.** California's new ADMT rules (compliance from 2027) cover significant decisions about
  finance, housing, education, employment and health care. Admission to Lore is likely outside, but the interview
  grades students; ask counsel.
- **Universal opt-out.** The GPC statement is fine.

---

## Terms: section by section

| Topic | Today | Draft |
|-------|-------|-------|
| Parties | none | [COMPANY LEGAL NAME], a [STATE] [ENTITY TYPE] |
| Invite-only and waitlist | "order of signup" (wrong) | invite or vouch plus AI interview, waitlist, no right to access, human review on request |
| Eligibility | 13+, parental permission | same, plus one account per person, true identity, US only (or EU text) |
| AI output | "can be wrong" | output is yours to use, no reliance, no professional advice, AI disclosure, crisis line |
| Errands on websites | one sentence | you authorize lore as your agent, your approvals and spend limit, sites' terms, your accounts, we are not a party to your purchases |
| Payments | "free in beta" | free now; usage limits; any paid plan will have its own terms and your consent |
| Network rules | brief | community rules, minors protections, reporting, blocking |
| Content and IP | basic | your content, license to run lore, feedback, our IP, copyright complaints |
| Text messages | one line | program terms (frequency, rates, STOP, HELP, carriers not liable) |
| Termination | basic | ours and yours, what happens to data |
| Disclaimers, liability | present | kept; cap $100; carve-outs where the law requires |
| Indemnity | none | added, narrow |
| Disputes | Sacramento courts | informal 60-day step, then either courts (default) or arbitration (optional block) |
| Changes | "using it means you accept" | notice, and a yes for dispute changes |
| Contact | legal@ | [LEGAL EMAIL], [MAILING ADDRESS] |

---

## Code changes so the policy is true (all in grouphost; none are made by this branch)

| # | Change | Where | Finding |
|---|--------|-------|---------|
| 1 | Set `LORE_MINOR_RULES=1` and `LORE_TEEN_MODE=1` in prod (known minors only) | ECS task env | H1, H3 |
| 2 | Remove or enforce the "I'm 18 or older" box | `host/lore_card.py:1421`, `:1483` | H1 |
| 3 | On a stated age under 13: delete intake and messages, no waitlist, one plain line | `host/invite_gate.py:1434-1438` | H2 |
| 4 | Ask every newcomer's age neutrally (persona text) | `host/invite_gate.py:977` | H2 |
| 5 | Unset `LORE_GATEKEEPER_LOGIN_ACCOUNT` | ECS task env | H6 |
| 6 | Default purchases to a fresh yes until the person sets a limit (if not already) | `host/computer_lane.py:2357-2361` | H5 |
| 7 | Redirect backend `/privacy` and `/terms` to the static pages | `host/legal_pages.py:473-484` | H8, M8 |
| 8 | STOP confirmation line (if Sendblue does not send one) | `host/engine.py:1572-1587` | M1 |
| 9 | `LORE_HELP_CONTACT` = support email, company name in HELP | `host/sendblue.py:189-193`, ECS env | M1, H7 |
| 10 | "Don't text me first" setting for outreach and heads-ups | `host/outreach.py` | M2 |
| 11 | Typed "may share" fields for lore-to-lore | `host/a2a.py` | M3 |
| 12 | Confirm no-training tiers for every direct model and search vendor | vendor accounts | M5 |
| 13 | Group join line: AI, remembers, how to forget | first group message | M7 |
| 14 | Retention: prune pixel opens, page views and waitlist IPs after a set period | `host/waitlist.py`, growth tables | M4, M10 |
| 15 | Fix docstrings (`consent.py:8`, support page STOP wording) | `host/consent.py`, `host/legal_pages.py:462` | L6 |

---

## Short summary

The two pages are well written and mostly match the code on data collected, deletion, Google Limited Use and AI
processing. The serious gaps are about **minors** (teen protections are off in production while the pages imply
they are on, and the under-13 refusal keeps the child's data), about **who decides** (an AI interview with a final
call, not "people who review requests" or "order of signup"), about **approvals** (auto-approved steps and purchases
under a spend limit), and about **undisclosed processing** (the founder's LinkedIn sign-in on applicants, Composio's
full-mailbox access and logs, tracking pixels). Fixing the minors and under-13 issues takes two env flags and one
small code change. The rest is mostly text, which the redlined drafts on this branch supply. Also missing: a legal
entity, one domain, SMS program terms, and errands and community rules in the Terms.

## Questions only Ankith can answer

1. **Company entity:** what is the legal name and type (for example "Lore Social, Inc., a Delaware corporation")?
   If there is none yet, do you plan to form one before launch?
2. **Address:** what mailing address should appear on both pages (a registered agent or virtual address is fine)?
3. **Governing state:** California (where you are) or the entity's state? Do you want arbitration with a class
   waiver, or courts?
4. **Contact emails:** which addresses are monitored: privacy@, legal@, support@? On which domain (`loresocial.net`
   or `loregroupchat.com`)?
5. **Domain:** is `loresocial.net` the canonical domain now? The site still says `loregroupchat.com`.
6. **EU and UK users:** are they allowed? If not, should the interview refuse non-US numbers?
7. **Minors:** will you turn on `LORE_MINOR_RULES` and `LORE_TEEN_MODE` for known minors? If not, are you
   comfortable with the plainer teen text in H1 and the legal risk counsel will describe?
8. **LinkedIn check:** is `LORE_GATEKEEPER_LOGIN_ACCOUNT` set in production? Will you turn it off?
9. **Composio:** which Composio flags are on in production (Gmail, Google Super, Outlook, Notion, Dropbox, OneDrive,
   Todoist, Zoom)?
10. **Spending:** what is the default spend limit, and can an errand ever buy without a fresh yes when no limit is
    set?
11. **Model vendors:** are Gemini, Groq, Mistral, Cloudflare and Baseten on paid or zero-retention tiers?
12. **Sendblue:** does Sendblue send the STOP confirmation itself?
13. **Paid plans:** any plan to charge members, or to charge for the network, in the next six months?
