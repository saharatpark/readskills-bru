# ReadSkills BRU — Project Handoff

> Last updated: 2026-09-22 · Last shipped bundle: **update41.bundle**
> Written for: anyone (human or a future Claude session) picking up this project next.

---

## 1. What this project is

**ReadSkills BRU** is a static HTML/CSS/JS single-page web app that delivers an English reading-skills course (Course 2031103) for Buriram Rajabhat University students. It implements a detailed Lesson Plan spec (6 Units / Lesson Plans) through a stepper-based Topic → Activity navigation UI — one Activity visible at a time, Previous/Next buttons, never scroll-only.

**The master plan for the entire site (all 6 Units) is `docs/blueprint/BLUEPRINT.md`.** Read that first before touching content — it has the full Unit-by-Unit scope for both modules, the exact strategy/game names to use for Units 3–6, and a short list of standing rules. This handoff document is about *process and current state*; the blueprint is about *what the finished product should contain*.

---

## 2. Repo layout

```
/home/claude/readskills-bru/
├── index.html                    # The app (~7,200 lines). Single source of truth for markup.
├── style.css                     # All styles.
├── app.js                        # All JS (navigation, quiz logic, progress tracking).
├── ReadSkills-BRU-Review.html    # Standalone build: index.html with style.css/app.js inlined.
│                                  # Rebuild this after EVERY content/code change (see §4).
├── docs/
│   ├── HANDOFF.md                # This file.
│   └── blueprint/
│       ├── BLUEPRINT.md          # Master content/structure spec for all 6 Units. READ FIRST.
│       ├── 01-web-structure-blueprint.png
│       ├── 02-internal-content-scope-activity-map.png
│       └── 03-screen-flow-mockup.png
└── update*.bundle                # Old bundle artifacts left in the working dir; harmless, gitignored-ish
                                   # clutter from past sessions. Not part of the app.
```

There is no build step and no dependencies — it's plain HTML/CSS/JS opened directly in a browser (`file://` works fine).

---

## 3. ⚠️ Critical constraint: this sandbox cannot push to GitHub

Every session working on this repo runs inside a cloud sandbox whose git proxy **rejects direct pushes** to the real GitHub remote (`403 access denied — not in this session's authorized repository set`). This is not fixable from inside the sandbox. The workflow is:

1. Do the work, commit locally as normal (`git add`, `git commit`).
2. `git bundle create updateN.bundle main` (increment N from the last one used).
3. `git bundle verify updateN.bundle` — always verify before sending.
4. Copy the bundle to `/mnt/user-data/outputs/` and deliver it with `SendUserFile`.
5. Tell the user to run, on **their own machine**, in their local clone (currently at `C:\Users\66631\Desktop\readskills-bru-push`):
   ```
   git pull updateN.bundle main
   git push origin main
   ```

The user will periodically see an automated **stop-hook message** saying "There are N unpushed commit(s) on branch 'main'." — this is expected and harmless as long as the latest bundle has already been sent; it just means the user hasn't run the pull/push commands yet on their machine. Don't treat it as a new problem each time; just remind them of the pull/push commands and move on.

**Bundle numbering so far:** update2 through update41 have been sent (see `/mnt/user-data/outputs/*.bundle` for what's still on disk; not everything from update1–33 survived cleanup, but that doesn't matter — each bundle contains the FULL history up to that point, so only the latest one the user hasn't pulled yet matters). **update38 has been confirmed pulled and pushed to GitHub by the user.** update39, update40, and update41 have been shipped but not yet confirmed pulled. **Next bundle should be `update42`.**

Also: always rebuild `ReadSkills-BRU-Review.html` (see the inline script pattern used throughout git history — read `style.css`/`app.js`/`index.html`, inline them, write the combined file) and commit it in its own `chore:` commit right after any content/code fix commit, before bundling. The user previews this file directly to sanity-check changes without needing to run anything.

---

## 4. Architecture: the Topic → Activity navigation system

This is the most important — and most bug-prone — piece of the app, so understand it before editing content.

- `ACTIVITY_MAP` (in `app.js`) is keyed by `unit` (1 or 2 so far) → `topicIdx` (1–6) → an ordered array of `{id, label}`. Each `id` refers to an existing HTML element carrying `class="... activity-view"`.
- CSS: `.activity-view { display: none }`, `.activity-view.active { display: block }` (see `style.css`).
- `openTopicActivity(unit, topicIdx, activityIndex)` toggles the `active` class on exactly the activities listed for that Topic in `ACTIVITY_MAP` — nothing else.
- **The single most important structural rule:** every `.activity-view` element for a given Topic must be a direct **sibling** of the others in that Topic, all at the same DOM depth, inside the Topic's `.topic-content-pane > .content-block` wrapper. If one is accidentally nested inside another (via a misplaced or missing closing `</div>`), two failure modes are possible depending on which one lost its `active` class:
  - The **nested child stays permanently visible** regardless of which Activity is selected (content leaks onto every page) — this is the bug class fixed for Topic 1's Mock Article diagram (`update34`).
  - The **nested child becomes permanently invisible** even when it has the `active` class itself, because a `display:none` ancestor hides the whole subtree — this is the bug class fixed for Topic 3 and Topic 4's final "Reading Practice" activity, which rendered a completely blank screen (`update36`).
- **How this happens in practice:** copy-pasting a content block and forgetting to copy its closing `</div>`, or adding a new Activity block after an existing one without checking the existing one's own closing tag first. A whole-document tag-balance check will NOT catch this — the document stays perfectly well-formed (every open tag has a matching close), it's just closed in the *wrong place*. You have to check actual nesting depth per intended sibling group.
- **How to verify this systematically** (method developed and used this session, worth reusing for Units 3–6): parse the whole file with Python's `html.parser.HTMLParser`, track a tag stack with line numbers, record `(open_line, depth, close_line)` for every element carrying `class="activity-view"`, then assert all Activities belonging to the same Topic have identical depth. A one-liner "any long matching block found between one file's text and another" via `difflib.SequenceMatcher` was also used to confirm Reading Lessons and Reading Strategies never share real paragraph text (only shared UI boilerplate should match). No script from this session was saved into the repo (they lived in the sandbox's temp directory and don't persist between sessions) — recreate the tag-depth tracker fresh next time using the description above; it's about 25 lines of Python.
- After any structural HTML edit, also re-verify live in a browser (Playwright headless Chromium is available in the sandbox at `/opt/pw-browsers/chromium`) by walking every Activity of every Topic and asserting exactly one `.activity-view.active` element is actually visible (`offsetParent !== null`) at a time — static parsing alone caught the *cause* but a live browser check is what proved the *effect* (blank screen / duplicated content) both before and after the fix.

Other important globals in `app.js`:
- `currentLessonUnit`, `currentActivityIndex1` / `currentActivityIndex2` — per-unit state, correctly namespaced (not a source of past bugs).
- `openLessonDetail(unitId)` — entry point when a user picks a Unit from the Reading Lessons hub. **This had its own bug (fixed in `update35`)**: it only ever showed the requested unit's hub/reader views and never hid the other unit's — because `.unit-hub-wrap` has no default `display:none` (relies entirely on inline styles set by JS). Fixed by adding `resetAllUnitViews()`, called at the top of `openLessonDetail()`, which unconditionally hides both units' hub-views and clears both units' reader-view `active` classes before showing the requested one. **If a Unit 3+ hub/reader view pair is added later, `resetAllUnitViews()` must be extended to include it**, or the exact same cross-unit leak bug will reappear.

---

## 5. Bug log — what's been found and fixed this session (chronological)

| Bundle | Bug | Root cause | Fix |
|---|---|---|---|
| `update34` | Mock Article diagram (Renewable Energy) visible on every Topic 1 activity | `t1-part1`'s closing `</div>` was misplaced right after the Text Features table, orphaning the mock-article block as a sibling of the pane instead of inside the activity-view | Moved the closing `</div>` to after the mock-article block |
| `update35` | Opening Unit 2 showed Unit 1's hub content underneath it; returning to Unit 1 after visiting a Unit 2 topic showed Unit 2's reader view still active | `openLessonDetail()` never hid the *other* unit's views | Added `resetAllUnitViews()`, called first in `openLessonDetail()` |
| `update36` | Topic 3 and Topic 4's final "Reading Practice" activity rendered a **completely blank screen** | `t2-part6` and `t3-part5` were each missing their own closing `</div>`, nesting the next activity (`t2-part7`, `t3-part6`) inside them; a stray extra `</div>` further down (mis-indented, a tell-tale leftover) then closed `unit1-reader-view` one level early | Added the missing closing divs; removed the now-redundant stray ones |
| `update37` | (not a bug) — saved the 3 official blueprint images + `BLUEPRINT.md` as permanent project reference | — | — |
| `update38` | (not a bug) — added `docs/HANDOFF.md` and the `readskills-bru-handoff` skill ("read handoff" / "เขียน handoff" commands) | — | — |
| `update39` | Blueprint-alignment gap (not a structural bug): Unit 2 Reading Lessons Topic 2 ("Skimming & Scanning Strategies") was teaching the strategy's full theory (definitions, a Skimming-vs-Scanning comparison table, a "when to use" table, two worked examples) inside the Reading Lessons module — content whose *role* duplicates what Reading Strategies Unit 2 already owns (BLUEPRINT.md §4.1's What/Why/When/How/Worked-Example sequence lives in `strat2-a2`/`strat2-a3`). Wording wasn't verbatim identical (a `difflib` text-diff had already cleared it), but teaching full strategy theory in Reading Lessons violates BLUEPRINT.md §1's "Reading Lessons ไม่สอนทฤษฎีกลยุทธ์แบบเต็ม ๆ" rule. Found while auditing Unit 1/2 content scope against the blueprint per the owner's request. | `u2t2-learn`'s theory block (definitions, comparison table, when-to-use table, eye-focus diagram, "why it matters" box, 2 worked examples) was too close in role to the Strategies module's own coverage | Trimmed `u2t2-learn` to a 2-sentence bilingual recap + a clickable cross-link (`onclick="openStrategyDetail(2)"`) into Reading Strategies Unit 2 for the full explanation, plus the existing "where you'll apply this" pointer to Topics 4/5. Left `u2t2-practice`'s 7 exercises untouched (application exercises belong in Reading Lessons). Verified: activity-view depth audit clean (topic2-pane-2-intro/u2t2-learn/u2t2-practice all depth 8), live click-through confirms the cross-link opens `screen-strategy-detail-2`, exercise count unchanged (7), full QA suite clean. |
| `update40` | User reported (4 screenshots, "ไม่มีข้อมูล เช็คให้ละเอียด" — "no content, check thoroughly") that Unit 2 Topic 1 and Topic 2's **Introduction** step showed only the title/badge header, then jumped straight to "3/3 activities viewed" and Previous/Next — no body content in between. Confirmed live: `topic2-pane-1-intro` and `topic2-pane-2-intro` really were empty except for the `<h3>`/badge header. This is a **content-authoring gap**, not the div-nesting structural bug (depth audit for these panes was already clean) — unlike every other Topic Introduction pane in the app (Unit 1's 6, and Unit 2 Topics 4/5/6), which all have a `.bilingual-block` intro paragraph before the header closes. A 3rd instance of the same gap was found during the audit: `topic2-pane-3-intro` was equally empty (not reported by the user, since their screenshots only covered Topics 1–2, but it's the identical pattern). | `topic2-pane-1-intro`, `topic2-pane-2-intro`, and `topic2-pane-3-intro` contained only the `<h3>` title + stage badge, with zero body content — an authoring omission from whenever those Topics were built, not a bug introduced by a later edit. | Added a short bilingual `.bilingual-block` intro (2 short EN/TH paragraph pairs: what the topic teaches + why it matters + a pointer to Learn/Practice) to all three panes, matching the style/length already used in Unit 2 Topics 4–6's intros. `u2t1-learn`/`u2t2-learn`/`u2t3-learn` (the deeper theory) were left untouched — the new intro text is a short hook, not a duplicate of Learn's content. Verified: whole-document tag-balance check clean (0 mismatches, empty stack at EOF), live Playwright walk of all 6 Unit 2 Topic Introductions confirms each now renders real text (lengths 961–2506 chars, previously 0 for Topics 1–3), full click-audit re-run clean (2085 clicks, 0 page errors — unchanged from prior baseline). |
| `update41` | (open item closed, not a bug) User asked to finally add images to Unit 2 Topic 4 ("Main Idea Challenge") passages — flagged twice before as an open item since Unit 1 Topic 5 has 3 passage images but Unit 2 Topic 4 had none. User's instructions: match the existing visual style, and each image must relate to its passage's content. Note: no image-generation tool or external stock-photo fetch is available in this sandbox, and the 3 existing Unit 1 images are embedded photographs — sourcing look-alike stock photos was not possible, so 3 original flat-illustration graphics were hand-drawn with Python/Pillow instead (laptop video-call grid for "Online Learning Platforms"; a night-market food cart with steam and food bowls for "Street Food Culture in Thailand"; an underwater scene with fish, bubbles, and drifting microplastic particles/a bottle for "Microplastics in the Ocean"), using the app's existing purple/pink pastel + teal palette so they sit consistently alongside the rest of the UI. | Unit 2 Topic 4's `t2u-p1`/`t2u-p2`/`t2u-p3` passages had no `.passage-img-wrap` block at all, unlike every passage in Unit 1 Topic 5. | Generated 3 PNGs (1200×700, ~45–55KB each) with Pillow, base64-embedded them as `<div class="passage-img-wrap"><img class="passage-img" ...><div class="passage-img-caption">...` blocks — identical markup pattern to the existing Unit 1 Topic 5 images (`alt`, `onerror="this.style.display='none'"`, a Thai caption + "Figure B{n}.1" label) — inserted right after each passage's "ก่อนอ่าน" guided-q block, before the vocabulary box. Verified: whole-document tag-balance check clean, live Playwright walk confirms all 3 images are present with correct src/caption/active-pane placement, and a component-level screenshot of each `.passage-img-wrap` visually confirms correct rendering (image renders, caption overlay legible). Full click-audit re-run clean (2085 clicks, 0 page errors — unchanged from baseline). This closes the "Unit 2 Topic 4 has no images" open item from `update39`/`update40`. |

**Content-alignment work done earlier this session** (before the bug-hunting above): Unit 1 was cross-checked against the source Word doc `ReadSkills_Unit1_Web_Content_Package_FINAL_PLUS_QuizBank_1.docx` (uploaded by the user; extracted text cached at `/tmp/docx_full.txt` in that session — will need re-uploading/re-extracting if needed again, it wasn't saved into the repo) and several additions were made: the Unit 1 Learning Map infographic, a Strategy Application Passage + Prediction Quiz (5 items) + Integrated Reading Strategies Quiz (10 items) in Reading Strategies, a bonus mind-map + 4 exercises in Topic 4, and 6 bonus review questions in Topic 6. All answer keys were verified against the doc. Two literal-quote-in-`onclick` bugs were caught and fixed before shipping (`&quot;` escaping issue — a previously-seen recurring bug class in this codebase, see the older git history: `4dc3858`, `29a076d`, `9ead329`).

**Outstanding/unverified from that alignment pass:** the "why this strategy works" research-rationale callout (Anderson & Pearson 1984; Grabe & Stoller 2020) added to the Reading Strategies page technically goes slightly beyond the source doc's guidance, which says that research/pedagogy background "does not need to appear as a full theory section on the student website" (it's dev/instructor notes). It's short and simplified, not a violation, but the user was offered the option to remove it and hasn't responded either way — leave as-is unless asked to remove it.

---

## 6. Testing checklist to re-run after any structural change

None of these scripts persist in the repo (they were throwaway Playwright/Python scripts in the sandbox's temp dir), but they're cheap to recreate. Re-run the equivalent of all of these before shipping any bundle that touches `index.html` or `app.js`:

1. **Whole-document HTML tag balance** — parse with `HTMLParser`, assert 0 mismatch errors and empty stack at EOF.
2. **Duplicate `id` scan** — regex `id="([^"]+)"`, assert no id appears twice.
3. **Activity-view depth audit** — the tag-depth tracker described in §4; assert all Activities within a Topic share the same depth (catches the nesting bug class before it ever reaches a browser).
4. **Orphan sweep** — for every `.dg-wrap`, `.exercise-box`, `.trap-box`, `.concept-box`, `.interactive-preview-sim` inside a `.topic-content-pane`, assert `el.closest('.activity-view')` is non-null (catches leaked content outside any gating wrapper).
5. **Full walk-through** (Playwright) — for every Unit × Topic × Activity combination, call `openTopicActivity(unit, topic, idx)` and assert exactly one `.activity-view.active` element has `offsetParent !== null`, and that it's the expected one for the current unit (also assert the *other* unit's hub/reader views stay hidden throughout).
6. **Click audit** — programmatically invoke every `.ex-opt` button's `onclick` handler across the whole app and assert zero JS errors (catches unescaped-quote-in-onclick bugs, a recurring issue in this codebase).
7. **Completion-tracking audit** — walk to the last Activity of every Topic in both directions (open-only vs. actually-navigated-to) and confirm `completedTopics`/`completedTopics2` only flip to `true` on real navigation, never just on open (this was a past bug, `c1b8ca5`).
8. Take at least one full-page screenshot of anything you changed visually and actually look at it — static checks catch structure, not "does this look right."

---

## 7. Open items / not yet done

- **Unit 2 Topic 4 (Main Idea Challenge) passages now have images** (added in `update41` — 3 original Pillow-generated flat illustrations, one per passage, matching the app's purple/pink/teal palette; see bug log above). Closed.
- **The div-closing-bug audit HAS been extended to Practice & Quiz (screen-d), the Interactive Quiz screen, and Learning Progress (screen-e)** — none of them use the `.activity-view` stepper pattern at all (they're flat static/list screens), so they carry zero risk of this bug class. Confirmed by counting `.activity-view` usages document-wide (60 total, all already accounted for in Reading Lessons Units 1–2 and the Unit 2 Strategy stepper) — no other screen needs this check.
- **User explicitly deprioritized Practice & Quiz module work** to focus effort on Reading Lessons + Reading Strategies for Units 1–2 instead. Two minor observations were logged but intentionally left unfixed per that instruction: the Practice & Quiz hub's "Unit 3 · In Progress" card label doesn't match Reading Lessons' "Locked" labeling for Unit 3 (it links into the Unit 1 interactive quiz, not a Unit 3 one); Learning Progress (screen-e) shows hardcoded demo numbers rather than real localStorage-derived progress. Do not act on these unless the user asks.
- **Content-scope alignment audit against BLUEPRINT.md**, requested explicitly by the owner: went topic-by-topic through Unit 1 and Unit 2's Reading Lessons + Reading Strategies content. Found and fixed one gap (`update39`, see bug log above — Unit 2 Topic 2 was teaching strategy theory that belongs to Reading Strategies). No other scope violations found: Unit 1's Topic 1 (Text Features) correctly stays in "identify" mode vs. Reading Strategies' "how to use it" mode; Unit 2 Topics 1, 3, 4, 5, 6 all stay within their Reading-Lessons-only scope per BLUEPRINT.md §3.2 (none of them overlap with the Unit 2 Strategy scope, which is Skimming & Scanning only). Consider Unit 1–2 content-scope alignment fully verified as of `update39`.
- **Units 3–6** are Locked placeholders only (card exists with correct name/tags per the blueprint, no real content). Building these out is the next big body of work; use `BLUEPRINT.md` §3.2/§4.2/§5.3 for exact scope and naming per unit.
- **Practice & Quiz / Learning Progress modules** haven't been cross-checked against `BLUEPRINT.md` §5/§6 for scope completeness (games list, tracked metrics) — only Reading Lessons + Reading Strategies have been audited so far.

---

## 8. How to resume work in a fresh session

1. Read this file, then `docs/blueprint/BLUEPRINT.md`.
2. `cd /home/claude/readskills-bru && git log --oneline -5` to see the last commit and confirm the working tree matches what's described here.
3. If the user reports a bug, reproduce it live with Playwright before touching code — every real bug found this session was confirmed live, not just inferred from reading source.
4. After fixing: run the checklist in §6, rebuild `ReadSkills-BRU-Review.html`, commit both, bundle (`updateN+1`), verify, send via `SendUserFile`, and give the user the `git pull ... && git push origin main` command for their local clone.
5. Update this handoff file (§5 bug log, §7 open items, bundle number in the header) as part of that same commit whenever you close out a notable piece of work — keep it current, don't let it drift.
