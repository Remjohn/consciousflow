---
type: modular-prd
module: PRD-05
title: CBCS Law28 - Adaptive Coaching Engine and Challenge Architecture
author: John (Product Manager)
date: 2026-05-06
status: Source of Truth
version: 6.0
dependencies:
  - docs/prd/prd.md (Foundation PRD - CA-5, CA-5B, FR-APR-02, FR-APR-09)
  - docs/prd/modules/PRD_INDEX.md
  - docs/prd/modules/PRD_01_CCP_Platform_Strategy.md
  - docs/prd/modules/PRD_04_CVE_Experience_Design.md
  - docs/prd/modules/PRD_08_Conscious_Primitives.md
source_documents:
  - lab/CCP APRIL Updates/01_Architecture_PRDs/Law28_CBCS_Program_Architecture_Brief.md
  - lab/CCP APRIL Updates/01_Architecture_PRDs/Communication_Skill_Ladder_Architecture.md
  - lab/CCP APRIL Updates/04_Voice_Doctrines/Voice_First_Experience_Doctrine.md
  - lab/CCP APRIL Updates/05_Core_Experience/Experience_Primitive_Registry_Spec.md
  - lab/CCP update/CCP_CBCS_CPSC_V3.docx.md
  - lab/CCP update/CCP_Evolution_Architecture_Report_V2.docx.md
  - lab/CCP update/CCP_Architecture_V5.0.docx.md
  - docs/prd/prd.md
active_primitives:
  meaning_plane: [PSY, VOC, ACT, REF]
  experience_plane: [FRC, FBK, PRG, SAF, PER]
capability_areas: [CA-5, CA-5B, FR-APR-02, FR-APR-09, FR-GA]
---

# PRD-05: CBCS Law28 - Adaptive Coaching Engine and Challenge Architecture

**Version:** 6.0 | **Status:** Source of Truth | **Date:** 2026-05-06

---

## 1. Purpose and Architectural Claim

This module defines the Conscious Behavioral Change System as the adaptive coaching engine of CCP, with Law28 Public Speaking as its flagship program instance.

The architectural claim is:

**Law28 is not a separate product. It is a CBCS program built on the same behavioral, relational, and evidence-capture architecture that later powers coach-deployed client programs.**

That means PRD-05 is not only about a speaking challenge. It is about how the platform:

- diagnoses communication weakness,
- delivers daily or near-daily behavioral rituals,
- captures real evidence of change,
- updates the user's evolving profile,
- decides when to intensify, pause, recover, or celebrate,
- and turns the full process into a measurable adaptive coaching engine.

The reason this matters is simple: most challenge products are glorified content calendars. CBCS is supposed to be something else entirely. It is a **self-coding coaching system** where each ritual creates behavioral, biometric, and relational intelligence that makes the next intervention more precise.

Law28 is the strongest initial crucible because it captures three forms of value at once:

1. **Proof of change** - through FR61-style communication metrics and voice evidence.
2. **Content exhaust** - through usable recordings, reactions, drills, and public-facing proof.
3. **Strategic intelligence** - through transcripts, change talk, intimacy signals, coping trajectory shifts, and challenge progression history.

The module therefore governs:

- the adaptive challenge architecture,
- the biometric and psychological evidence model,
- the relationship intelligence layer,
- the 28-command operating suite,
- the dashboard and Telegram operating model,
- and the logic by which challenge participation becomes both transformation and data infrastructure.

PRD-05 also inherits several hard strategic corrections from the newer architecture:

- live roleplay is no longer central,
- async-first repetition is the true growth engine,
- the coach should experience continuity through Telegram and AFFiNE, not through extra surfaces,
- the experience layer from PRD-04 must shape how the coaching logic is actually felt,
- and the challenge must improve the human, not merely produce compliance.

---

## 2. Core Architecture and Runtime Model

### 2.1 The CBCS Universal Model

CBCS should be understood as a universal self-coding transformation engine. Across any program, the user performs some meaningful behavior, the system captures evidence, and the evidence updates the user's identity and intervention model.

In Law28, the behavior is communication. The user records:

- a response,
- a speaking drill,
- a pitch,
- a reframe,
- a storytelling fragment,
- or a reaction.

That single act simultaneously becomes:

- training evidence,
- coaching input,
- and potential content output.

### 2.1A Dual-Program Architecture

CBCS operates in two distinct program modes that share architecture but do not share data.

| Mode | Participant | Purpose | Data Owner |
|---|---|---|---|
| **CCP Program** | the coach themselves | improve the coach's own communication, speaking, delivery, and authority | CCP platform |
| **Coach CBCS Program** | the coach's clients or members | improve the client's habits, accountability, and growth within the coach's own program | the coach tenant |

This distinction matters because the same runtime can power both programs while serving very different ownership and optimization goals.

CCP Program data should make the coach's own ecosystem better:

- better content
- better reactions
- better webinar delivery
- better authority proof

Coach CBCS Program data should make the coach's offer and audience understanding better:

- better client segmentation
- better message resonance
- better program adaptation
- better testimonial pools

**Data Isolation Rule**

CCP Program data and Coach CBCS Program data must never mix at the storage, query, or intelligence layer.

What is shared:

- the 4-engine runtime
- progression logic
- biometric scoring architecture
- accountability pairing logic
- Sunday Postcard generation
- Silent Testimonial Builder

What must remain isolated:

- intelligence graphs
- benchmark baselines
- testimonial pools
- progress archives
- dashboard visibility
- operator review permissions

### 2.1B Zero-Config Client Onboarding

When a coach launches a CBCS program for their own clients, the onboarding should be near-zero-config.

The expected path is:

1. the coach selects or clones a program template
2. the system generates a Telegram invite link
3. the client taps the link and enters the bot
4. the client records a `60`-second baseline
5. the system scores the baseline, creates the client profile, and assigns the right starting track

The same logic should apply, with different ownership, when CCP onboards a coach into their own improvement program.

### 2.2 The Six-Stage Coaching Logic

At the broadest level, CBCS follows this sequence:

```text
assessment
-> assembly
-> priming
-> action
-> evidence
-> shift
```

This sequence is important because the coaching engine is not random conversation. It has to move the user through a structured transformation cadence:

- assess where they are,
- assemble the right intervention container,
- prime readiness,
- trigger behavior,
- capture proof,
- update the model and next step.

### 2.3 The Four Runtime Engines

For implementation clarity, PRD-05 treats CBCS as four interacting runtime engines:

| Engine | Purpose |
|---|---|
| **Diagnostic Engine** | classify current weakness, state, track, and readiness |
| **Ritual Engine** | generate and deliver the next challenge action or reflection |
| **Evidence Engine** | capture transcript, biomarkers, signals, and behavioral completion |
| **Relationship Engine** | manage intimacy, trust, re-engagement, and permission logic |

These four engines together replace the shallow "challenge content calendar" model. They make CBCS adaptive, not merely scheduled.

### 2.4 The Law28 Program as a CBCS Instance

Law28 should be treated as a CBCS program instance with:

- communication-specific diagnostic dimensions,
- speaking-specific ritual types,
- FR61 communication evidence,
- challenge-specific scoring and progression,
- and a specific signature style mandate centered on conviction, clarity, pause architecture, anti-hedging, and authority.

The important rule is that Law28 uses the same underlying intelligence laws that later coach-owned programs will use. This makes it both a product and a proving ground.

### 2.5 The Daily Runtime Chain

A standard CBCS / Law28 daily loop should look like:

```text
state check
-> route selection
-> daily prompt or drill
-> user recording or reflection
-> transcription and scoring
-> context update
-> next-step feedback
-> continuity memory update
```

This is the core engine of compounding improvement. Each repetition is both a coaching act and a data update.

### 2.6 Async-First, Human-Meaningful Progression

PRD-05 must obey the async-first correction from the skill ladder. Law28 and other CBCS programs should prioritize:

- solo or paired asynchronous drills,
- replayable scoring,
- recovery without scheduling failure,
- and content-producing practice.

Live elements may exist as occasional escalations, but they should not govern the center of the coaching architecture.

### 2.7 Adaptive Layers Inside the 28-Day Hook

The 28-day frame should be treated as a commitment container and narrative arc, not as proof that every user should receive the same chronological drill map.

Internally, CBCS should think in adaptive layers:

- **Foundation:** willingness to record, anti-hedging, early conviction
- **Structure:** better claims, cleaner sequencing, stronger opening and closing
- **Nuance:** storytelling, warmth, contrast, humor, emotional pacing
- **Command:** pressure tolerance, public authority, stronger situational leadership

This preserves the commercial simplicity of a 28-day challenge while allowing the intelligence engine to behave like an actual coach rather than a calendar.

### 2.8 The Weekly Rhythm Principle

Even with adaptive layering, the challenge still benefits from a broad weekly rhythm. The base default should remain:

- `4` active days
- `1` reflection day
- `2` recovery or lower-intensity days

This rhythm matters because a communication challenge without recovery becomes shame-producing, while a challenge without enough repetition becomes forgettable. The rhythm gives the system a stable metabolic cadence without making it rigid.

---

## 3. Data Contracts, Schemas, and Registry Dependencies

### 3.1 Three-Layer Context Premise Architecture

One of the most important clarifications from the Law28 brief is that there are three distinct data layers:

| Layer | Owner | What It Learns |
|---|---|---|
| **Layer 1: Conscious Elite Context Premise** | CCP | intelligence about coaches who are our users |
| **Layer 2: Coach CCP Container** | coach tenant | intelligence about that coach's own clients |
| **Layer 3: Universal Voice DNA Stream** | profile-bound / tenant-bound | voice and communication evolution data |

PRD-05 must respect this separation. The coaching engine is not allowed to flatten these into one shared context pool.

### 3.1A Client Intelligence Layer and Maturity

PRD-05 should also explicitly preserve the older Client Intelligence Layer maturity model.

For coaching contexts, three tiers matter:

- **Tier 1**
  research-only or cold-start intelligence
- **Tier 2**
  session-transcript-informed intelligence
- **Tier 3**
  full CBCS plus session plus journal plus behavior integration

The coaching engine should know which tier it is operating with because that changes:

- how confident it should be
- how personalized it can safely become
- how hard it should infer patterns
- and whether it is coaching from evidence or approximation

Cold-start honesty is important. A Tier 1 user should not receive false-confidence intimacy pretending the system knows more than it does.

### 3.2 Core CBCS Objects

PRD-05 should standardize the following runtime objects:

| Object | Purpose |
|---|---|
| **AssessmentPacket** | baseline diagnostic result, voice and state intake |
| **CapacityTrackAssignment** | Recovery / Foundation / Growth / Momentum / Peak classification |
| **RitualPromptPacket** | today's drill, reflection, or intervention and why now |
| **VoiceEvidencePacket** | transcript, FR61 metrics, timestamps, linguistic markers |
| **ContextPremiseUpdate** | graph write containing new entities, beliefs, fears, identity cues |
| **RelationshipSignalPacket** | SPT stage, intimacy index, change talk, search-phase flags |
| **ProgramProgressRecord** | streak, level, day, benchmark deltas, completion state |
| **DormancyRecoveryPacket** | comeback timing, prompt, and state assumptions |

These objects allow the system to be deterministic where needed while still using probabilistic reasoning inside extraction and adaptation.

### 3.3 FR61 Evidence Contract

The speaking-evidence packet should minimally capture:

- conviction density,
- hedge frequency,
- pause architecture,
- pitch stability,
- selected stylometric indicators,
- trend deltas from baseline,
- and notable raw language anchors.

Law28 uses this not only as proof but as progression logic. A user should not advance simply because days passed. They should progress because the evidence says the current weakness has improved enough to tolerate the next layer.

### 3.4 Relationship Intelligence Objects

CBCS also depends on a richer relational layer:

- **ChangeTalkRecord** using DARN-CAT logic,
- **SPTStageRecord** for Social Penetration depth,
- **ICTPositionRecord** for Information Coping Trajectory,
- **SearchPhaseFlag** for high-receptivity windows,
- **TelegramIntimacyIndex** for relationship strength,
- **TransportationScore** for coach-originated voice messages used in deeper persuasion or transition moments.

These are not marketing luxuries. They are how the coaching system knows whether to push, slow down, invite, or remain silent.

### 3.4A Transcript and Journal Calibration

Relationship intelligence should not be limited to one-off interaction readings.

CBCS should explicitly calibrate from:

- session transcripts
- challenge recordings
- journal entries
- coach voice-note responses
- and continuity behavior over time

This is what lets the system graduate from Tier 1 assumptions toward Tier 2 and Tier 3 intelligence.

It also gives the engine a better basis for:

- permission timing
- dropout interpretation
- next-drill precision
- and challenge-to-deeper-program transitions

### 3.5 Primitive Dependencies

PRD-05 relies strongly on:

- meaning primitives from Psychological Diagnostics, Voice & Audio Intimacy, Performance & Delivery, and Trust-Transfer;
- experience primitives from Feedback & Scoring, Progression & Mastery, Friction & Flow, Safety & Trust, and Personalization.

In practice this means:

- scores must teach,
- drills must feel survivable,
- comeback must preserve dignity,
- and the system must sound like a guide rather than an evaluator robot.

### 3.6 The 28-Command Operating Layer

The 28-command suite should be treated as a native operating surface for the coaching engine. It is not auxiliary admin garnish. It exposes the intelligence of the system in a way that keeps the product usable inside Telegram.

The suite includes four layers:

- participant commands,
- coach operations commands,
- sales and marketing intelligence commands,
- architect/operator commands.

This command layer is one of the practical reasons the system can stay lightweight on the surface while still being deep.

### 3.7 Command-Tier Design Logic

The command layer should follow three laws:

1. **collapse complexity rather than expose it**
2. **map every command to a real underlying intelligence object**
3. **show only the commands appropriate to the actor's role**

This is especially important for coaches. Telegram commands should let them operate a sophisticated intelligence engine without making them think like system administrators.

---

## 4. The Architectural Correction PRD-05 Enforces

This module exists to correct five major failures in ordinary challenge systems.

### 4.1 Error One: Calendar-Based Progression

Typical challenges advance by date. CBCS should advance by evidence and readiness. If a participant is still crippled by hedging or unstable authority, it is architecturally wrong to escalate them just because it is "Day 8."

### 4.2 Error Two: Dead Intake Forms

Traditional onboarding captures shallow self-report data once, then never truly updates the model. CBCS replaces that with living evidence through repeated voice and behavior. A single voice recording can reveal more than many checkboxes.

### 4.3 Error Three: Treating Silence as a Generic Churn Metric

Silence should be treated as a clinical or strategic signal, not merely an analytics event. A user can disappear because they are ashamed, confused, exhausted, doubtful, or re-triggered. Recovery must be contextual.

### 4.4 Error Four: Coaching Without Relational Permission

Commercial or deeper intervention should not arrive before the relationship can hold it. That is why SPT, intimacy, coping position, and search-phase signals matter. PRD-05 must keep these permission gates real.

### 4.5 Error Five: Separating Transformation from Content and Intelligence

In CBCS, the challenge should not produce only compliance. It should produce:

- visible improvement,
- better future targeting,
- stronger coach intelligence,
- and public-proof-worthy artifacts where appropriate.

This is one of the big differences between CBCS and a generic accountability bot.

---

## 5. Deep Mechanism: Why the Coaching Engine Works

### 5.1 Self-Coding Through Behavior

The core mechanism is that behavior itself becomes training data. The user does not simply "do the challenge." By doing it, they teach the system:

- what kind of fear they carry,
- where they hesitate linguistically,
- how they respond to pressure,
- what kind of narrative strength they already have,
- and how their voice changes over time.

This is why CBCS becomes more precise through use.

### 5.2 Capacity Tracks

Atlas-style Capacity Tracks matter because not every user should receive the same load. CBCS must be able to distinguish:

- Recovery,
- Foundation,
- Growth,
- Momentum,
- Peak.

These tracks determine intensity, pacing, recovery needs, and permissible escalation. This stops the system from treating all motivation problems as equal.

### 5.3 FR61 and Behavioral Evidence

The speaking program becomes compelling because it can show change. FR61-type metrics are powerful not just because they are measurable, but because they convert fuzzy self-perception into undeniable progression. When the user sees:

- hedging decrease,
- pause architecture improve,
- conviction rise,
- voice stability strengthen,

the identity shift stops being hypothetical.

### 5.4 Daily Persuasion and the Sunday Postcard

The system should not "sell" the user once and then assume inertia will carry them. Each day should reconnect the activity to the user's own reasons.

The Sunday Postcard is especially powerful because it compresses:

- challenge progress,
- speaking evidence,
- identity commentary,
- and a challenger-style interpretation of the week.

This turns the week into a narrativized, emotionally legible event rather than a silent metric log.

### 5.5 Relationship Intelligence as Coaching Permission

The relationship layer matters because good coaching and good commercial timing both depend on trust and readiness. Change talk, SPT, ICT, intimacy, and search-phase detection together create a much more intelligent permission model than "they clicked a few times, so sell them."

PRD-05 should inherit the older live-psychometric mindset here without inheriting the heavier, more synchronous operating assumptions that no longer scale.

The engine should keep asking:

- how ready is this person for challenge?
- how defended are they right now?
- how much directness can they metabolize?
- are we seeing a search-phase opportunity or a shutdown pattern?

Those questions should be continuously updated from behavior rather than frozen at intake.

### 5.6 Accountability and Social Retention

The platform should use partner accountability and cohort logic carefully. Not as the main central training mechanism, but as reinforcement:

- accountability partner visibility,
- local streak pressure,
- cohort events when useful,
- and friend-like retention structure.

This makes the challenge harder to quietly abandon.

### 5.7 Adaptive Layers Instead of Rigid Weeks

Even if Law28 uses a 28-day marketing frame, its real architecture should be adaptive layers rather than fixed topic weeks. This preserves the commercial simplicity of the challenge while allowing the intelligence engine to behave correctly.

### 5.8 Audit-to-Challenge Conversion Logic

The audit-first flow is one of the strongest mechanisms in the module. The user should not encounter the challenge as a random offer. They should encounter it as the natural response to a diagnosed weakness.

That means the path is:

- voice sample,
- diagnosis,
- felt recognition,
- challenge as the next logical experiment.

This sequence is powerful because it turns sales into continuation. The challenge feels less like a purchase and more like a way to resolve something the user has now felt in themselves.

### 5.9 The Sunday Postcard as Narrative Compression

The Sunday Postcard should be treated as more than a report. It is a weekly compression ritual that:

- narrates the week's transformation,
- marks progress in a memorable tone,
- gives the user a challenger-style interpretation of their own behavior,
- and creates a unit of social proof when appropriate.

It is one of the clearest examples of CBCS turning data into identity-shaping experience.

### 5.10 Silent Testimonial Builder

CBCS should not only improve humans. It should silently accumulate proof that the improvement happened.

This must work for both:

- **CCP Programs**
  where the coach is the participant
- **Coach CBCS Programs**
  where the coach's own clients or members are the participants

The capture logic is the same.
The data owner and permission surface are different.

**Trigger events for testimonial capture**

The testimonial builder should activate when events such as these occur:

- benchmark score jump beyond configured threshold
- challenge completion
- weekly streak milestone
- public recognition event
- coach or pastor flags a visible breakthrough
- first-win event where a metric crosses a tier boundary

**Capture mechanics**

When a trigger fires, the system should:

1. send a warm voice prompt acknowledging the win
2. request a `30-90` second voice reflection
3. optionally request a screenshot or image showing the change
4. tag the capture with trigger type, benchmark delta, program week, emotional state, and active primitive context
5. assemble the narrative object:
   - voice capture
   - before/after benchmark visual
   - screenshot or image if present
   - branded wrapper for the coach or program
6. present the assembled proof to the coach for review
7. ask permission for:
   - private archive only
   - close community sharing
   - public sharing

**Mini App testimonial recording**

The Telegram Mini App should also support a standalone testimonial recording path:

- real voice
- real face or image
- system-prompted at the right moment
- formatted as a shareable proof card or short proof object

The testimonial should not be treated as a separate marketing task.
It is a natural byproduct of visible progress.

### 5.11 User Cards - Collectible Progress Identity

The Sunday Postcard should remain the private, challenger-style weekly reflection object.

Alongside it, CBCS should support a second artifact:

the **User Card**.

This is a collectible, identity-bearing card object inspired by game and sports-card logic.

The card should contain:

- avatar or profile image
- user name and program identity
- tier badge
- primary stats such as conviction, pacing, clarity, authority
- weekly delta arrows
- streak counter
- strongest primitive or signature strength
- card color tied to progression tier
- community rank when relevant

**Example color progression**

- Foundation -> Bronze / earth
- Structure -> Silver / steel
- Nuance -> Gold / warm glow
- Command -> Platinum / white-hot
- Sovereign -> Prismatic / holographic

**Weekly sharing ritual**

At the defined program cadence, participants should be able to share updated cards into:

- a community gallery
- a Telegram feed
- direct peer accountability threads

This creates:

- visual proof of change
- healthy identity pressure
- collectible return motivation
- and stronger community narrative

The User Card is the public identity artifact.
The Sunday Postcard is the private interpretive coaching artifact.
They serve different emotional jobs and should coexist.

---

## 6. Implementation Stack and Systems Biology

### 6.1 The Four Engines in Practice

The four runtime engines should be implemented as coordinated but separable services:

| Engine | Main Jobs |
|---|---|
| **Diagnostic Engine** | assess, classify, detect track, detect risk, detect readiness |
| **Ritual Engine** | choose drill, schedule reflection, build daily or weekly flow |
| **Evidence Engine** | transcribe, score, extract, update graph, store deltas |
| **Relationship Engine** | manage intimacy, comeback, permission, partner visibility, escalation |

This helps prevent one giant opaque coaching loop.

### 6.2 Telegram-Native Operation

The main user-facing coaching loop should live natively in Telegram:

- `/today`
- `/submit`
- `/progress`
- `/partner`
- `/reflect`
- `/score`

Coach and operator commands extend this surface without forcing dashboard dependency. AFFiNE remains a memory and overview surface, but Telegram is where the flow is felt.

### 6.3 The Participant / Coach / Architect Command Split

The command layer should support three actor types:

- **participant:** act, reflect, review progress
- **coach:** intercept, view cohort, schedule events, see red flags
- **architect/operator:** inspect signals, review global patterns, steer program evolution

This role separation keeps power visible without flattening everyone into the same UI.

### 6.4 Dashboard Philosophy

PRD-05 should align with the Lean Dashboard Mandate. The coach should not be overwhelmed by raw biometrics and raw graph complexity. They should see:

- client card,
- progress ring,
- streak,
- conviction score,
- mood indicator,
- red flags,
- intercept action.

The full intelligence layer can exist behind that, but not as the default coach surface.

### 6.5 Evidence Pipeline Timing

The coaching loop should remain fast enough that continuity still feels conversational. This means:

- conversational routing under a couple of seconds for standard interactions,
- voice note ingestion and state update in a short enough window that the next reply still feels informed by what just happened,
- dormancy and crisis interventions fast enough to preserve trust and safety.

### 6.6 De-Centering Synchronous Touchpoints

The older architecture brief still included weekly synchronous touchpoints and a monthly outside event as non-negotiables. PRD-05 should preserve the value behind those ideas - social pressure, real execution, and identity anchoring - without treating live synchronization as mandatory at the center.

The corrected stance is:

- async daily repetition remains the core,
- live or group moments may exist as optional multipliers,
- but the program cannot depend on calendar coordination to work.

### 6.7 Accountability Architecture

Accountability in CBCS should operate through multiple layers:

| Layer | Function |
|---|---|
| **Self-accountability** | streaks, proof, score deltas, visible growth |
| **Partner accountability** | one peer can witness enough to care and encourage |
| **Coach accountability** | human intercept when the system detects a meaningful need |
| **System accountability** | the engine remembers what the user said mattered |

This layered structure is more resilient than simple nagging because it combines personal evidence, social reinforcement, and identity memory.

### 6.8 Recovery and Dormancy Protocols

Dormancy recovery should be tiered rather than repetitive. Example stages:

- a light orienting reminder,
- a more contextual re-entry invitation,
- an identity recall based on prior stated desire,
- and a human intercept threshold when silence follows meaningful prior engagement.

The goal is not to drag the user back mechanically. The goal is to make return feel possible without humiliation.

### 6.9 Dual Visibility: Coach View vs Internal View

The system should preserve a strict distinction between what the coach sees and what the internal intelligence layer sees.

The coach should see:

- enough to act,
- enough to care,
- enough to intervene,
- and enough to trust the progression.

The internal layer can see:

- full biometrics,
- trajectory shifts,
- cohort patterns,
- validator health,
- and aggregate challenge intelligence.

This distinction matters because a good coaching product should expose insight without dumping raw infrastructure on the user.

---

## 7. Workflow Integration Across the Platform

### 7.1 PRD-04 Experience Layer Dependency

PRD-05 depends on PRD-04 for:

- voice-note quality,
- comeback logic,
- friction reduction,
- and continuity design.

The coaching system should not invent those laws independently. It should inherit them.

### 7.1A Relationship to the Semantic Discernment Architecture

PRD-05 now explicitly inherits the Semantic Discernment Architecture (SDA) doctrine defined in:

- `lab/semantic_discernment_architecture_content_engine_v_1.md`
- `lab/semantic_discernment_architecture_artifact_taxonomy_v_1.md`
- `lab/CCP APRIL Updates/05_Core_Experience/Perceptual_Primitives_Architecture.md`
- `lab/CCP APRIL Updates/05_Core_Experience/Matrix of Edging.md`

For CBCS, this means the coaching engine must not only decide what intervention is effective. It must also decide what semantic direction that intervention reinforces. The coaching runtime therefore needs awareness of:

- active **Existential Invariants** in the user's current state,
- the **Representation Geometry** through which guidance is being framed,
- any **Emergent Contextual Invariants** specific to this coach, cohort, or moment,
- and any **Feedback Loops** or **Recursive Patterns** the system is strengthening through repetition.

This matters especially when CBCS is creating:

- identity commentary,
- comeback pressure,
- Sunday Postcards,
- User Cards,
- challenge escalation,
- and commercial timing decisions.

Good coaching is not only about getting the user to act. It is also about preserving agency, relational trust, and healthy identity movement while they act.

### 7.2 PRD-02 Content Factory Dependency

CBCS should feed the content system. Strong drills, reflections, and breakthroughs can become:

- source truth for public content,
- teaching assets,
- testimonial packets,
- or future webinar material.

This must be handled carefully by context and permissions, but the connection is strategically important.

### 7.3 PRD-03 Media Factory Dependency

Sunday Postcards, benchmark visuals, celebration clips, scorecards, and challenge proof objects should be renderable through the media layer. This gives the coaching engine more emotional weight and more shareability.

### 7.4 Conscious Reactions and the Skill Ladder

Law28 is not isolated. It forms the foundation for:

- Webinar Sales Delivery,
- Networking Conversations Mastery,
- and Conscious Reactions charisma work.

The user's speaking improvements should therefore feed forward into later surfaces.

### 7.5 CPSC and Commercial Readiness

While PRD-09 will own the wider commercial layer, PRD-05 owns several of the gates that commercial logic depends on:

- intimacy,
- SPT stage,
- coping position,
- change talk,
- search-phase readiness.

This makes CBCS a strategic intelligence engine as much as a coaching one.

### 7.6 Church and Community Adaptation

Because CBCS is a general adaptive program engine, its architecture should also support later verticals like churches and communities:

- accountability programs,
- speaking and testimony programs,
- youth or kids progression programs,
- community participation ladders.

The adaptive engine is more reusable than a speaking challenge alone.

### 7.7 Weekly Intelligence and Program Steering

CBCS should generate weekly intelligence not only for the user but for the operator and architect:

- which drills are producing the strongest score lift,
- which days create drop-off,
- where shame or avoidance clusters,
- what recovery prompts rescue most effectively,
- which challenge moments create the best content exhaust,
- and where progression logic may be too weak or too harsh.

This keeps the challenge evolving as a living system rather than calcifying into static curriculum.

---

## 8. Self-Translation, Compounding, and Learning Memory

### 8.1 One Challenge, Three Outputs

Every serious challenge action should ideally produce:

1. **behavioral progress**
2. **content exhaust**
3. **queryable intelligence**

That is the compounding logic that makes the system commercially and pedagogically stronger than a simple challenge app.

### 8.2 Voice DNA and Identity Shift Archive

Over time, CBCS should create a living archive of communication change:

- baseline recordings,
- growth deltas,
- repeated linguistic tendencies,
- courage and hesitation signatures,
- and visible breakthrough moments.

This archive is part of the value. It turns subjective growth into something inspectable.

### 8.3 Swarm and Program Optimization

Aggregated challenge data should help improve:

- which drills create the fastest conviction lift,
- where most drop-offs occur,
- which prompts yield more useful recordings,
- which comeback protocols rescue more users,
- which partner or cohort structures improve retention.

This turns CBCS into a learning system rather than a frozen curriculum.

### 8.4 The Sunday Bot Meeting / Memory Escalation Principle

The architecture synthesis work emphasized that important repeated patterns should not stay trapped in isolated coaching sessions. CBCS should be able to elevate useful repeated intelligence into broader strategic memory so the ecosystem can get smarter.

This is one of the most important reasons challenge data matters beyond the challenge itself.

### 8.5 Agent-Usable Coaching Metadata

Eventually, agents should be able to query:

- who is stuck at hedging?
- who has high conviction but weak structure?
- who is socially ready but commercially hesitant?
- which drills produce the best transformation for specific profiles?

This is how PRD-05 becomes not only an experience module but a reusable coaching intelligence substrate.

### 8.6 The Strategic Dividend of Coaching Data

Challenge participation yields a strategic dividend far beyond retention. Compared with static intake forms, repeated voice-based coaching data produces:

- sharper segmentation,
- stronger persuasion intelligence,
- better future challenge design,
- richer source material for content,
- and clearer proof that the platform changes real communication behavior.

That is why improving the coaching engine improves the whole CCP flywheel.

### 8.7 From Personal Challenge to Coach Deployment

Law28 also acts as the proving ground for future coach deployment. When a coach goes through the challenge personally, they do not merely understand the concept intellectually. They accumulate:

- lived proof,
- visible before/after evidence,
- richer empathy for future users,
- and practical trust in the engine.

That makes later deployment into their own programs much stronger, because they are no longer selling theory. They are selling an experience they already survived and benefited from.

This also improves operator quality. A coach who has felt the friction, relief, score anxiety, comeback moments, and proof events firsthand is much better equipped to intervene intelligently when their own users hit the same thresholds.

That lived familiarity is a compounding operational advantage over time.

---

## 9. Validation, Benchmarks, and Quality Gates

### 9.1 Core Validation Questions

Every CBCS / Law28 flow should answer yes to these:

1. Did the challenge action feel relevant to the user's current state?
2. Did the system capture enough evidence to justify the next step?
3. Did the user receive an interpretable signal of progress?
4. Does the comeback path preserve dignity after failure or silence?
5. Are relationship-sensitive transitions gated by real permission signals?
6. Is the challenge producing better communication rather than rote compliance?

### 9.2 Required Validators

| Validator | Purpose |
|---|---|
| **Track Fit Validator** | ensure load and ritual fit the user's capacity track |
| **Evidence Integrity Validator** | ensure scores and transcripts are tied to real submissions |
| **Voice and Progress Validator** | ensure progression claims are backed by deltas |
| **Relationship Permission Validator** | block premature escalation or commercial pressure |
| **Recovery Validator** | ensure dormancy or low-score users still have humane re-entry |
| **Program Coherence Validator** | ensure Law28 remains a skill-building engine, not a random drill pile |

### 9.3 Benchmark Metrics

The coaching engine should track:

- day-1 to day-7 retention,
- day-7 to day-28 retention,
- conviction score improvement,
- hedge-frequency reduction,
- comeback rate after missed days,
- partner visibility or cohort contribution rate where used,
- challenge completion,
- content exhaust generation,
- and future upgrade readiness indicators.

### 9.4 Acceptance Thresholds

At minimum:

| Metric | Minimum Standard |
|---|---|
| clear next ritual | required |
| evidence packet after participation | required |
| interpretable score or reflection | required |
| recovery path after silence | required |
| no escalation without permission gates | required |
| visible progress over time | required |

If a user can complete many days without any felt sense of growth, the system failed even if the database is full.

This is especially important for Law28. The user must be able to feel that their speech is becoming more stable, more direct, or more confident. If progression is only visible to the internal analytics layer, the challenge becomes informationally rich but experientially weak.

### 9.5 Lower-Score Primitives Still Matter

Some primitives that seem secondary in aggregate scoring may matter strongly here as:

- safety and dignity moves,
- challenge recovery moves,
- public-proof amplifiers,
- or intimacy-preserving details.

The coaching layer should not overfit only to the loudest metrics.

### 9.6 Quality Control as Commercial and Clinical Trust

PRD-05 is unusual because its quality gates serve both transformation and revenue. If the challenge works visibly, coaches believe in it, clients trust it, and later offers or deeper continuity become much easier. If the challenge feels generic or arbitrary, both therapeutic trust and commercial trust collapse.

---

## 10. Risk Mitigation

### 10.1 Calendar Completion Without Real Change Risk

**Risk:** Users finish days but do not improve materially.

**Mitigation:** gate progression by evidence and track-specific readiness rather than by time alone.

### 10.2 Over-Scoring and Shame Risk

**Risk:** The biometric layer makes users feel judged instead of guided.

**Mitigation:** keep scoring interpretive, use PRD-04 recovery and emotional-job laws, and design score reveals as reflection plus next step.

### 10.3 Dormancy Spiral Risk

**Risk:** Silence leads to shame, which leads to more silence.

**Mitigation:** treat dormancy as a first-class clinical signal, use contextual recovery prompts, and avoid generic guilt messaging.

### 10.4 Relational Overreach Risk

**Risk:** The system pushes commercial or vulnerable prompts before psychological permission exists.

**Mitigation:** enforce SPT, intimacy, coping, and search-phase gates as deterministic boundaries.

### 10.5 Data Boundary Confusion Risk

**Risk:** The three-layer context architecture becomes blurred and causes data contamination.

**Mitigation:** keep role-based routing strict and auditable at middleware and schema level.

### 10.6 Sync-Dependency Regression Risk

**Risk:** Weekly group logic or old roleplay instincts slowly become required again.

**Mitigation:** lock async-first repetition as the central success engine and treat live touchpoints as optional multipliers only.

### 10.7 Intelligence Without Usefulness Risk

**Risk:** The system captures huge amounts of data without making the next intervention better.

**Mitigation:** require every major evidence object to feed either progression, recovery, content translation, or strategic segmentation.

### 10.8 Challenge Feeling Like Homework Risk

**Risk:** The program becomes dutiful but uninspiring.

**Mitigation:** preserve voice-first delivery, Sunday Postcards, visible proof of change, and the challenge identity frame that makes progress feel like becoming someone stronger.

The practical test is simple: after a hard week, the user should still feel that returning gives them dignity, direction, and usable evidence - not just another unfinished task.

---

*This document is one of 9 modular PRD modules. Consult PRD_INDEX.md for the complete module registry, cross-reference tables, and agent loading protocol.*


---

## ERA 3 BROWNFIELD ANALYSIS (Functional Requirements)

# Functional Requirements: PRD-05 CBCS Law28

This document details the functional requirements for the **PRD-05 CBCS Law28** module, applying the Era 3 (Core-24) Brownfield structural analysis to construct a true adaptive coaching engine.

---

## 1. Needs to be Built (New Features & Updates)

### 1.1 The Four Runtime Engines (Adaptive Coaching Logic)
*   **WHAT feature needs to be built OR Updated:** Shift the architecture from a monolithic chatbot to four distinct, coordinated services: the Diagnostic Engine, Ritual Engine, Evidence Engine, and Relationship Engine.
*   **WHICH Primitives are actively engaging:** PSY (Psychological Diagnostics), PRG (Progression Mechanics), FRC (Friction & Flow Management).
*   **WHY it needs to be built OR Updated:** A monolithic challenge bot acts as a static schedule, failing to respond to actual user growth. By separating diagnostics from evidence capture and relationship management, we prevent the system from becoming a giant, opaque, rigid loop.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Allows the system to become a *self-coding coaching engine*. User behavior itself becomes the training data, making the next intervention significantly more precise and personalized without adding manual coaching load.
*   **WHAT does not need to be built:** The foundational assessment logic, habit architectures, and dormancy protocols.
*   **WHY it's already perfect how it is (PROOF):** These engines are structurally defined and built across `FR_CBCS_12_Coping_Diagnostic_Invitation_Engine_Tech_Spec.md`, `FR_CBCS_09_Habit_Architecture_Module_Tech_Spec.md`, and `FR_CBCS_13_Counterfactual_Activation_Window_Tech_Spec.md`.

### 1.2 Adaptive Layers (Replacing Rigid Calendar Weeks)
*   **WHAT feature needs to be built OR Updated:** Progression through the challenge must be gated by continuous FR61 voice evidence and track-specific readiness, rather than simply advancing users because a day has passed on the calendar.
*   **WHICH Primitives are actively engaging:** FBK (Feedback & Scoring rituals), PRG (Progression Mechanics).
*   **WHY it needs to be built OR Updated:** Typical challenges advance purely by date. If a user is still crippled by hedging or unstable authority on "Day 7", it is architecturally wrong and detrimental to escalate them to the next conceptual layer.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Ensures that challenge completion equals *real* communication change, rather than rote compliance. The program maintains high therapeutic and commercial integrity.
*   **WHAT does not need to be built:** The underlying FR61 voice evidence extraction and assessment pipelines.
*   **WHY it's already perfect how it is (PROOF):** These pipelines exist natively inside `FR61_Jim_Rohn_Voice_Coach_Engine_Tech_Spec.md` and `FR3_Voice_DNA_Extraction_Tech_Spec.md`.

### 1.3 Dual-Program Architecture & Data Isolation
*   **WHAT feature needs to be built OR Updated:** Enforce strict data isolation between the intelligence gathered from the "CCP Program" (coaches improving their own communication) and the "Coach CBCS Program" (a coach's clients taking a deployed program).
*   **WHICH Primitives are actively engaging:** SAF (Safety & Trust), REF (Referral & Trust-Transfer).
*   **WHY it needs to be built OR Updated:** Mixing a coach's self-improvement performance data with their clients' performance data destroys tenant boundaries, causing dangerous intelligence contamination and violating privacy.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Allows the exact same core runtime to power both the B2B and B2C experiences securely, providing a massive compounding operational advantage.
*   **WHAT does not need to be built:** The multi-tenant workspace provisioning and data routing logic.
*   **WHY it's already perfect how it is (PROOF):** Specified entirely in `FR-CA11-01_Coach_Workspace_Provisioning_Tech_Spec.md` and `FR49_Single_Tenant_Deployment_Tech_Spec.md`.

### 1.4 Silent Testimonial Builder & User Cards
*   **WHAT feature needs to be built OR Updated:** Automatically trigger the capture of voice reflections, screenshots, and progress snapshots when benchmark deltas cross success thresholds. Generate public-facing User Cards and branded proof objects from this data.
*   **WHICH Primitives are actively engaging:** REF (Referral & Trust-Transfer), FBK (Feedback & Scoring).
*   **WHY it needs to be built OR Updated:** When testimonials are treated as a separate, manual marketing task, they introduce high friction and are rarely completed by users.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Turns visible user progress natively into collectible, identity-bearing artifacts and public marketing proof, eliminating awkward referral asks and fueling organic growth.
*   **WHAT does not need to be built:** The core social proof intelligence and content translation architectures.
*   **WHY it's already perfect how it is (PROOF):** Completely spec'd in `FR57_Social_Proof_Intelligence_Engine_Tech_Spec.md` and `FR11_Activation_Event_Seed_Construction_Tech_Spec.md`.

### 1.5 SDA-Aware Coaching Interpretation
*   **WHAT feature needs to be built OR Updated:** Add SDA-aware interpretation to CBCS diagnostics, relationship framing, User Cards, Sunday Postcards, and escalation logic, explicitly inheriting `lab/semantic_discernment_architecture_content_engine_v_1.md`, `lab/semantic_discernment_architecture_artifact_taxonomy_v_1.md`, `lab/CCP APRIL Updates/05_Core_Experience/Perceptual_Primitives_Architecture.md`, and `lab/CCP APRIL Updates/05_Core_Experience/Matrix of Edging.md`.
*   **WHICH Primitives are actively engaging:** PSY (Psychological Diagnostics), FBK (Feedback & Scoring), REF (Referral & Trust-Transfer), SAF (Safety & Trust Signals), PRG (Progression).
*   **WHY it needs to be built OR Updated:** A coaching intervention can improve compliance or short-term energy while still distorting identity, misreading local invariants, or reinforcing an unhealthy loop.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Makes CBCS a meaning-aware coaching engine rather than only an adaptive behavior engine. It improves evaluation quality and prevents relational or identity drift from being mistaken for progress.
*   **WHAT does not need to be built:** The existence of the four CBCS runtime engines or their telemetry substrate.
*   **WHY it's already perfect how it is (PROOF):** The core engines already exist; the missing piece is SDA-aware interpretation and validation over their decisions.

---

## 2. Inventory of Specs for CURRENT RELEVANT CCP FEATURES

The following technical specifications map to the foundational capabilities that act as the irreducible core of PRD-05. **These do NOT need to be built from scratch**; they are already architected, perfect as they are, and ready for deployment.

### CBCS Habit & Diagnostic Engine
*   `FR_CBCS_09_Habit_Architecture_Module_Tech_Spec.md`
*   `FR_CBCS_12_Coping_Diagnostic_Invitation_Engine_Tech_Spec.md`
*   `FR_CBCS_13_Counterfactual_Activation_Window_Tech_Spec.md`

### FR61 Evidence & Voice Architecture
*   `FR61_Jim_Rohn_Voice_Coach_Engine_Tech_Spec.md`
*   `FR3_Voice_DNA_Extraction_Tech_Spec.md`

### Data Isolation & Tenant Routing
*   `FR-CA11-01_Coach_Workspace_Provisioning_Tech_Spec.md`
*   `FR49_Single_Tenant_Deployment_Tech_Spec.md`

### Social Proof & Testimonial Extraction
*   `FR57_Social_Proof_Intelligence_Engine_Tech_Spec.md`
*   `FR11_Activation_Event_Seed_Construction_Tech_Spec.md`

---

## 3. MARKED AS OBSOLETE (For System Removal)

The following capabilities have been superseded by the Core-24 brownfield update and must be permanently removed or heavily refactored to protect the integrity of the adaptive coaching engine. This forms the Master Deletion Inventory for CBCS Law28:

*   **[OBSOLETE] Static Form-Based Intake Services:** The system completely abandons one-off, "dead" intake questionnaires. Initial state is now established through continuous `FR61` voice evidence and the Zero-Config Telegram tracking flow.
*   **[MODIFY] Generic Notion Content Calendars:** Static Notion schedulers (specifically `src/ccp/services/notion_content_builder.py`) are fundamentally incompatible with Adaptive Layers. They can no longer be used as chronological gatekeepers that blindly advance users to the next challenge day; they must be modified to act solely as a memory dashboard while the CBCS adaptive layer handles all progression logic.
