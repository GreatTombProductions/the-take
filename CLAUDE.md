# the-take/ — Tour Economics & Music Industry Analysis

## What This Is

A data-driven toolkit for understanding tour economics — built because someone tried to gatekeep Ray's wife out of an opportunity using vague claims and made-up numbers, and didn't expect to encounter someone who could check their math.

**This is not an academic exercise.** There are real stakes, real people, and a real deadline. Work accordingly.

---

## The Situation

Megan Ash was offered a merch position on Synestia's spring 2026 tour (Shadow of Intent headlining, 21 dates). The deal: ~$2,000 + tips + a guest performance spot — the performance spot being the actual value for her career trajectory.

Sam (Synestia's frontman) enthusiastically agreed, said "time to book tickets," then reversed days later claiming his managers (Scott Lee's team — manages Currents, Kublai Khan) advised against "someone inexperienced." He cited $30,000-$50,000 in potential losses. He admitted he doesn't understand the specifics himself.

**The $30-50K claim doesn't survive arithmetic.** Synestia's total merch revenue as an opener on this tour is $15-25K gross. The risk-adjusted expected loss from inexperience is $1,500-3,500. The research document proves this. The "experience" objection is either innumerate gatekeeping, a social gate (managers placing their own people), or cover for a personal issue (Sam's new girlfriend was explicitly worried about him touring with Megan for a month).

---

## Project State

### Completed
- **[TOUR_ECONOMICS_RESEARCH_HANDOFF.md](TOUR_ECONOMICS_RESEARCH_HANDOFF.md)** — Strategic planning artifact. Full context on the situation, the people involved, and the research objectives.
- **[TOUR_ECONOMICS_RESEARCH.md](TOUR_ECONOMICS_RESEARCH.md)** — Complete research document. 21-date routing with venue capacities, merch economics benchmarks, expense models, quantified risk taxonomy, forensic analysis of the $30-50K claim, message frameworks, and implementation parameters.
- **[app/](app/)** — Interactive tour economics forecast tool (React + TypeScript + Tailwind). Per-venue revenue/expense breakdown, 3 scenario modes (conservative/mid/steelman), risk analysis, merch person comparison, mid-tour calibration with localStorage persistence. Run: `cd app && npm run dev`

### Next Phase
- **Steelman integration** — DT precedent research (first tour supporting SOI, Nuclear Blast signing) suggests Synestia's gross merch could be $40-55K, not just $15-25K. The app's steelman scenario covers this, but the research docs need updating to incorporate the DT parallel and Chris Wiseman ecosystem analysis.
- **Deployment** — Static site hosting for shareable URL. Currently local-only.
- **Data refinement** — Verify routing mileage with GPS data, confirm venue merch cut policies, research Synestia's actual merch catalog for tour.

### Not Priorities (available but not driving work)
- **Message drafting** — Frameworks exist in Appendix A. The real message needs Ray's voice and strategic judgment on tone. Will happen when the timing is right, not as a project deliverable.
- **Reference library entry** — Generalizing beyond Synestia. Valuable but deferred — the data model serves this purpose once it exists.

---

## How to Work Here

**Be direct.** This project exists because someone was not direct. Don't soften findings. Don't hedge where the data is clear. If a claim is innumerate, say it's innumerate. If a risk is negligible, say it's negligible. Precision is the weapon.

**Be fast.** There is a conversation in progress with Sam. He said he'd share more information. The window for responding with a model — rather than just emotions — is open now. Speed matters.

**Be thorough but not academic.** Every data point should serve the argument or the tool. If you're researching something and can't connect it to "does this help Megan's case or build the tour economics model," stop and redirect.

**Assume competence.** Ray is a data scientist and management consultant who understands financial modeling, risk quantification, and strategic communication. Megan is building a career in music and understands the scene. Neither needs things dumbed down. The audience for the *tool output* includes Sam (who does need things spelled out) and potentially his managers (who will try to poke holes — the model needs to withstand scrutiny from people who do this for a living).

**Don't defer to "industry knows best."** The entire point of this project is that industry expertise is not protected knowledge. It's just domain data that hasn't been systematically organized. We're organizing it. The managers' value proposition is "I know things you don't" — that asymmetry is what we're dissolving.

**The constraint bundle matters more than the code.** The research document, the parameter schema, the risk taxonomy — these are the durable assets. Any implementation can be regenerated from them. Protect the thinking, not the artifacts.

---

## Key Numbers (from research)

| Metric | Value | Source Confidence |
|--------|-------|-------------------|
| Tour dates | 21 (Apr 23 – May 20, 2026) | HIGH |
| Median venue capacity | ~900 | HIGH |
| Synestia bill position | Opener (4th of 4) | HIGH |
| Estimated gross merch (tour) | $15,000-$25,000 | MEDIUM |
| Risk-adjusted loss from inexperience | $1,500-$3,500 | MEDIUM |
| Show guarantees (est. w/ SL leverage) | $2,950 ($140/show avg) | MEDIUM |
| Sam's claimed risk | $30,000-$50,000 | DEBUNKED |
| Experienced merch person cost | $2,100-$4,200 | MEDIUM |
| Megan's package cost | ~$2,000 + tips | HIGH |
| Net delta (Megan vs. experienced) | Within $1,200 either direction | HIGH |
| Training investment to close gap | $0-$500, 2-3 days | HIGH |

---

## Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file. Project orientation. |
| `TOUR_ECONOMICS_RESEARCH_HANDOFF.md` | Strategic context, people involved, research objectives. Read this to understand *why* this project exists. |
| `TOUR_ECONOMICS_RESEARCH.md` | Complete research output. 6 sections + 2 appendices. The data backbone. |
| `MERCH_RISK_RESEARCH.md` | Deep-dive merch risk taxonomy. 12 sections covering every failure mode, quantified exposure, mitigation, and forensic analysis of the $30-50K claim. |
| `app/` | Interactive forecast tool. `src/types.ts` (data model), `src/data/synestia-spring-2026.ts` (tour instance), `src/engine.ts` (calculation engine). React + Vite + Tailwind. |

---

## Broader Context

This lives in Ray's primary workspace (`greattomb/`). Megan's career trajectory is tracked in the CRM (`apps/scheme-crm/`). Ray's own band Heteromorphic Zoo will also benefit from the tour economics model. The music industry analysis capability compounds — every tour, every opportunity, every negotiation gets sharper.

The tool itself is the message. Not "please reconsider." Not "this isn't fair." But: "Here's what your managers should be telling you, except they probably don't have this level of precision. We do."
