# ReadSkills BRU — Project Handoff

> Last updated: 2026-09-20 · Last shipped bundle: **update37.bundle** (commit `223b3d9`)
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

**Bundle numbering so far:** update2 through update37 have been sent (see `/mnt/user-data/outputs/*.bundle` for what's still on disk; not everything from update1–33 survived cleanup, but that doesn't matter — each bundle contains the FULL history up to that point, so only the latest one the user hasn't pulled yet matters). **Next bundle should be `update38`.**

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

- **Unit 2 Topic 4 (Main Idea Challenge) passages have no images**, unlike Unit 1 Topic 5 which has 3. Flagged to the user twice; no decision yet on whether to add them.
- **User asked (last message before this handoff) whether to extend the div-closing-bug audit to the remaining screens**: Practice & Quiz module and Learning Progress module haven't been checked for the same nesting bug class yet. Worth doing before considering the app "fully audited."
- **Units 3–6** are Locked placeholders only (card exists with correct name/tags per the blueprint, no real content). Building these out is the next big body of work; use `BLUEPRINT.md` §3.2/§4.2/§5.3 for exact scope and naming per unit.
- **Practice & Quiz / Learning Progress modules** haven't been cross-checked against `BLUEPRINT.md` §5/§6 for scope completeness (games list, tracked metrics) — only Reading Lessons + Reading Strategies have been audited so far.

---

## 8. How to resume work in a fresh session

1. Read this file, then `docs/blueprint/BLUEPRINT.md`.
2. `cd /home/claude/readskills-bru && git log --oneline -5` to see the last commit and confirm the working tree matches what's described here.
3. If the user reports a bug, reproduce it live with Playwright before touching code — every real bug found this session was confirmed live, not just inferred from reading source.
4. After fixing: run the checklist in §6, rebuild `ReadSkills-BRU-Review.html`, commit both, bundle (`updateN+1`), verify, send via `SendUserFile`, and give the user the `git pull ... && git push origin main` command for their local clone.
5. Update this handoff file (§5 bug log, §7 open items, bundle number in the header) as part of that same commit whenever you close out a notable piece of work — keep it current, don't let it drift.
