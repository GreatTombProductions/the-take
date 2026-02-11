# Tour Economics Research Handoff

## Mission

Build a tour economics forecast tool grounded in real data. Immediate application: analyzing a specific tour (Synestia, spring 2026) to challenge gatekeeping behavior from band management. Durable value: reference library entry for tour economics modeling, applicable to Heteromorphic Zoo tours, Megan's future opportunities, and anyone in the scene.

This is the research phase. Your output is a structured document that an implementation instance can build from.

---

## Strategic Context

### The Situation

Megan Ash (Ray's wife) was offered a merch position on Synestia's upcoming tour. The opportunity included:
- ~$2,000 compensation + percentage of tips
- Guest performance spot (the actual value — grassroots exposure)
- Networking with an established deathcore act
- Real experience in tour logistics

Sam (Synestia's frontman) was enthusiastic. Days ago he said "it's time to book tickets." Then this message arrived:

> Hey Megan! I've got some news that might bum you out 😔 Our managers are advising us against having someone inexperienced running merch and would like us to go with a more experienced person, and I think we're going to do that. Essentially, there's a lot of risk for things to go wrong that could cost us large amounts of revenue.
>
> I'm really sorry, and I hope you know it's nothing to do with you as a person in any way and I'm bummed about it 😔

### What We Know

**Timing is suspicious:** "Time to book tickets" → cancellation within days. Something changed.

**Personal context:** Sam is in a new relationship. The girlfriend was explicitly worried about him touring for a month with Megan. This may or may not be the actual driver.

**Sam's background:** Left a job as manager in a biology lab. He's not accustomed to dealing with someone embedded in the corporate/consulting world who can actually analyze claims.

**Sam's stated philosophy:** Helping people newer in the scene get opportunities. This cancellation directly contradicts that philosophy — how are people supposed to get experience if no one gives them chances?

**The "managers" claim:** Sam deferred to "our management team" headed by Scott Lee (manages Currents, Kublai Khan, others). He admitted he's "unfamiliar with the process" and can't give specifics on why experience is required. He's parroting concerns he doesn't fully understand.

### Sam's Follow-Up Response

After Megan pushed back asking for specifics:

> Our management team is made up of 4 people, headed by Scott Lee - who manages currents/kublai khan, and others. Most of this stemmed from a call they had together that Chris then came to me with regarding their concerns. I take accountability here as well though, as I was unaware of the amount of work and experience that is preferred with this role. They said that because of the quantity of merch they expect us to be selling and moving each show, it'll be one of the most difficult jobs on the crew.
>
> Because I'm unfamiliar with the process, I can't give you the specifics you may be looking for as to why an experienced person is preferred, but as I get more information I will share it with you - you have my word. I also swear to you that this is only an operational and experience concern, absolutely nothing more.
>
> I hope you can also understand that there are 8 other peoples financial interests I need to take into consideration here. Merch is the biggest and most important revenue stream for the tour, and if it doesn't go wrong, I could be out $30,000-$50,000.

**Key admissions:**
- He doesn't understand the specifics himself
- He's deferring to managers who have their own incentives
- He's throwing around numbers ($30-50k risk) without apparent grounding
- He's left an opening: "as I get more information I will share it with you"

### What We're Actually Doing

**Immediate goal:** Force specificity. If there are real operational concerns, we want to understand and address them. If the concerns are vague gatekeeping, they should dissolve under scrutiny.

**Message to Sam:** "Your managers are worried about revenue risk. Here's a forecast model. What are their actual concerns?" Demonstrates Ray is serious, capable, and not someone whose partner you cancel on casually.

**Message to managers (implicit):** "The asymmetry you're used to doesn't exist here. Your expertise is not protected from someone with data science and management consulting capabilities."

**Regardless of outcome:** We build domain understanding that compounds. This becomes a reference library entry — the solved-problem frontier expands.

---

## Who's Involved

### Megan Ash

Ray's wife. Violinist, content creator, metal vocalist. Currently building grassroots presence:
- Instagram: ~5,200 followers (up from ~2k in late December)
- First single "Hexed" released 2025
- Feature pipeline active (21 leads in CRM)
- Upcoming: Synestia tour was April 22 start date

**Career trajectory:** Building from content creator toward legitimate presence in the metal scene. Guest performances, features with established acts, grassroots exposure. The Synestia tour was a perfect opportunity for this trajectory — networking, visibility, real experience.

### Ray

Data scientist, management consultant (Linnaean, ~$12k/month, 5-15 hrs/week). Multi-instrumentalist, composer, founding member of Heteromorphic Zoo (melodic death metal / deathcore / progressive-symphonic).

**Relevant capabilities:**
- Data science: forecasting, modeling, pipeline construction
- Management consulting: financial analysis, risk quantification, strategic framing
- Music industry: understands the domain from the inside (HZ has released music, toured, dealt with industry dynamics)
- AI orchestration: can spin up tools rapidly that would take traditional approaches weeks

**Disposition:** Not interested in letting Sam hide behind other people's decisions. Willing to engage directly with the managers if needed. The goal is either solving the actual problem or exposing that there isn't one.

### Sam (Synestia)

Frontman of Synestia (deathcore). Previously managed a biology lab before pursuing music full-time. Philosophy of helping newer people in the scene — which this cancellation contradicts.

**Current state:** Out of his depth on the business side. Deferring to managers. Throwing around numbers ($30-50k risk) without apparent grounding. New relationship may be influencing decision-making.

### Scott Lee / Management Team

Manages Currents, Kublai Khan, and others. 4-person management team. They're the ones who raised concerns about "inexperienced" merch help.

**Their incentives:**
- Management fees are typically 15-20% of gross revenue
- They have an interest in maximizing revenue and minimizing risk
- They may also have an interest in placing their own people in crew positions
- "Experience required" is classic gatekeeping — protects existing relationships

**What we don't know:**
- Whether their concerns are legitimate operational wisdom or generic risk-aversion
- Whether they've actually quantified the risks they're worried about
- Whether they'd be satisfied by training/certification
- Whether they're even aware of the specific situation or just gave generic advice

---

## Research Objectives

### 1. Synestia Tour Specifics

Find concrete data about the upcoming tour:

- **Dates and venues:** Full routing if available
- **Venue capacities:** Public information for each stop
- **Ticket prices:** What are they charging?
- **Band size and production scale:** How many people on the road? What's the production level?
- **Market positioning:** Where does Synestia sit in the deathcore ecosystem? Headlining clubs? Support on larger tours?

**Why this matters:** Sam threw out $30-50k risk numbers. We need to ground-truth what revenue we're actually talking about.

### 2. Merch Economics Benchmarks

Merch is "the biggest and most important revenue stream" per Sam. Quantify it:

- **Revenue per head:** What does a typical attendee spend on merch at metal/deathcore shows?
- **Conversion rate:** What percentage of attendees buy anything?
- **Catalog composition:** Typical items (shirts, hoodies, etc.), price points, margins
- **Cost of goods sold:** What's the production cost ratio?
- **Genre-specific data:** Deathcore/metal may differ from pop or country touring

**Industry sources to look for:**
- Pollstar data
- Billboard touring reports
- Music business publications
- Manager/agent interviews or AMAs
- Band transparency posts (some artists share numbers)

### 3. Tour Expense Structures

Build the expense side of the model:

- **Management fees:** Confirm 15-20% of gross is standard. What's the fee structure?
- **Booking agent fees:** Typically 10%?
- **Crew wages:** What does a merch person actually get paid? Range by experience level.
- **Transportation:** Bus rental, fuel, drivers for a tour of this scale
- **Per diems:** Standard per-person daily allowance
- **Accommodation:** When do bands hotel vs. bus-sleep?
- **Production costs:** Sound, lights, backline rental for club-level deathcore
- **Insurance:** What do touring acts carry?

**The specific question:** What's the actual cost delta between "experienced merch person" and "Megan's compensation package"? Is the "experience premium" $500 for the tour? $2000? $5000?

### 4. Merch Risk Quantification

This is the core of the managers' claimed concern. Make it concrete:

**What actually goes wrong:**
- Theft (internal vs. external)
- Cash handling errors
- Inventory miscounts
- Pricing mistakes
- Stock-outs on popular items
- Damage to inventory
- Setup/teardown issues

**Quantified exposure:**
- For each risk category: what's the expected loss? What's the probability?
- What's the realistic worst-case scenario?
- How does "inexperience" actually map to increased risk in each category?

**Mitigation options:**
- What merch training/certification programs exist?
- What do they cost?
- What risk reduction do they demonstrably provide?
- Insurance products for merch operations?
- POS systems that reduce human error?

**The specific question:** If Megan messes up — realistically, not catastrophically — what's the actual financial exposure? Is it $500? $2000? Sam's $30-50k claim seems ungrounded. Either validate it or expose it as fear-based innumeracy.

### 5. Industry Data Sources

Build a bibliography of where this data comes from:

- **Pollstar:** Tour grosses, venue data, industry benchmarks
- **Billboard:** Touring revenue reports
- **Hypebot/Music Business Worldwide:** Industry analysis
- **Reddit AMAs:** Musicians and crew sharing real numbers
- **Podcasts/interviews:** Tour managers, merch people talking about the job
- **Scott Lee specifically:** Any interviews or content where he discusses tour economics?

---

## Output Format

Produce a structured markdown document with:

### Section 1: Synestia Tour Data
Everything you find about the specific tour. Dates, venues, capacities, tickets.

### Section 2: Revenue Model Inputs
Merch revenue benchmarks, conversion rates, price points, margins. Separate "documented" (with sources) from "estimated" (inferred from adjacent data).

### Section 3: Expense Model Inputs
All the expense categories with ranges. Note where data is solid vs. where we're estimating.

### Section 4: Risk Taxonomy
Each risk category with:
- Description
- Estimated probability
- Estimated exposure (dollar amount)
- How "inexperience" affects it
- Mitigation options

### Section 5: The Merch Person Question
Specific analysis:
- What does an "experienced" merch person cost?
- What was Megan's package?
- What's the delta?
- What training options exist and what do they cost?
- What's the actual risk-adjusted expected loss from inexperience?

### Section 6: Sources and Gaps
- What you found and where
- What you couldn't find
- Confidence levels on each section
- Recommendations for further research if needed

---

## Tone and Framing

**Irreverent, not hostile.** We're not approaching this as outsiders asking permission to understand touring. We're bringing data science and management consulting rigor to a domain that runs on vibes, relationships, and "I've been doing this for years."

**The managers' expertise is not protected.** Their value proposition is "I know things you don't." That asymmetry dissolves when someone with analytical capability enters the domain. This research is the first step in that dissolution.

**Grounded, not aspirational.** Real data, real sources, real numbers. Where we're estimating, be explicit. The goal is a model that can withstand scrutiny, not a polemic.

**Useful beyond this situation.** This becomes a reference library entry. Build it like you're solving "tour economics modeling" as a general problem, with Synestia as the specific application.

---

## What Happens Next

1. **You complete this research** and produce the structured output
2. **Implementation instance** builds the actual tool: data pipeline, models, UI
3. **Ray uses the output** in communication with Sam and potentially the managers directly
4. **The tool persists** as reference for future touring decisions (HZ, Megan solo, anyone in the scene)

The tool itself is the message. "Here's what your managers should be telling you, except they probably don't have this level of precision."

---

## Do Not

- **Build anything yet** — this is research only
- **Over-hedge** — make your best estimates where data is thin
- **Defer to "industry knows best" framing** — that's exactly what we're challenging
- **Get lost in tangents** — stay focused on the research objectives above
- **Forget the personal stakes** — this is about Megan's opportunity and Sam's flakiness, not an abstract exercise

---

*Handoff artifact generated by strategic planning instance. Ready for research phase execution.*
