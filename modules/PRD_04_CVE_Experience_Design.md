---
type: modular-prd
module: PRD-04
title: CVE Experience Design - Voice-First and Async Continuity Architecture
author: John (Product Manager)
date: 2026-05-06
status: Source of Truth
version: 6.0
dependencies:
  - docs/prd/prd.md (Foundation PRD - CA-1, CA-5, FR-APR-04, FR-APR-05, FR-APR-07)
  - docs/prd/modules/PRD_INDEX.md
  - docs/prd/modules/PRD_01_CCP_Platform_Strategy.md
  - docs/prd/modules/PRD_08_Conscious_Primitives.md
source_documents:
  - lab/CCP APRIL Updates/04_Voice_Doctrines/Voice_First_Experience_Doctrine.md
  - lab/CCP APRIL Updates/01_Architecture_PRDs/Communication_Skill_Ladder_Architecture.md
  - lab/CCP APRIL Updates/05_Core_Experience/Experience_Primitive_Registry_Spec.md
  - lab/CCP APRIL Updates/05_Core_Experience/Primitive_Conscious_Orchestration_Architecture.md
  - lab/CCP APRIL Updates/05_Core_Experience/Primitive_Crosswalk_Map.md
  - lab/CCP APRIL Updates/05_Core_Experience/Conscious_Reactions_Experience_Primitive_Orchestration_Architecture.md
  - lab/CCP APRIL Updates/05_Core_Experience/Conscious_Reactions_Source_of_Truth.md
  - lab/CCP APRIL Updates/02_MCDA_Synthesis/MCDA_Voice_First_Experience_Synthesis.md
  - lab/CCP APRIL Updates/02_MCDA_Synthesis/Telegram_Mini_App_Virality_MCDA.md
  - lab/CCP update/CCP_Evolution_Architecture_Report_V2.docx.md
  - lab/CCP update/CCP_Architecture_V5.0.docx.md
active_primitives:
  meaning_plane: [VOC, ACT, BUS]
  experience_plane: [TRG, FRC, FBK, PRG, SAF, PER, SOC]
capability_areas: [CA-1, CA-5, FR-APR-04, FR-APR-05, FR-APR-07]
---

# PRD-04: CVE Experience Design - Voice-First and Async Continuity Architecture

**Version:** 6.0 | **Status:** Source of Truth | **Date:** 2026-05-06

---

## 1. Purpose and Architectural Claim

This module defines the product-experience plane of CCP.

It governs how the platform feels, how users enter it, how they continue through it, how the system speaks, how practice becomes habitual, how friction is removed, and how trust is built without over-explaining the machinery backstage.

The architectural claim is:

**CCP wins not only because it generates strong content or strong coaching intelligence, but because the experience of using it feels unusually human, clear, low-friction, and worth returning to.**

This is why `PRD-04` exists separately from the content and media modules. PRD-02 governs how meaning is compiled. PRD-03 governs how that meaning is rendered visually and sonically. PRD-04 governs how the user encounters the system at all:

- how a prompt arrives,
- how a voice note feels,
- how a score is revealed,
- how a challenge becomes a daily habit,
- how Telegram and the Mini App become one continuity surface,
- how coaching practice becomes enjoyable,
- how one interaction becomes the reason to return tomorrow.

The module inherits several hard truths established across the April architecture work:

1. **Voice notes are not a support feature.** They are the experience driver layer.
2. **Async-first surfaces scale better than synchronous-first events.**
3. **The user should never have to understand the backend to feel the product quality.**
4. **Experience primitives are a distinct system from meaning primitives.**
5. **Adoption acceleration is one of the moats.**

The system is therefore not merely a chatbot, not merely a coaching app, and not merely a content backend. It is a **voice-first communication operating environment** in which daily participation, emotional guidance, scoring, challenge progression, and content exhaust all reinforce each other.

This module must support four simultaneous business truths:

- the coach should feel guided, not managed,
- the experience should produce better communication, not only better assets,
- the surfaces should stay inside AFFiNE and Telegram rather than multiplying apps,
- and the system should increasingly sell itself through felt quality rather than explanation.

---

## 2. Core Architecture and Runtime Model

### 2.1 The Experience Plane

PRD-08 formalized the separation between the meaning plane and the experience plane. This module is the primary implementation surface for the experience plane.

The meaning plane asks:

- what should the coach say?
- what truth, tension, or transformation should be extracted?
- what coalition of primitives should drive the content?

The experience plane asks:

- why should the coach join right now?
- does the next step feel obvious enough to take?
- does the score feel meaningful?
- does the comeback feel natural after failure?
- does the product feel premium, alive, and personal?

This module therefore treats experience primitives as implementation law for:

- flows,
- UI states,
- timing,
- prompts,
- scoring rituals,
- safety signals,
- comeback logic,
- social propagation,
- and continuity.

### 2.2 The Two-Touchpoint Runtime

PRD-01 locked the platform to exactly two client-facing surfaces:

- **Telegram**
- **AFFiNE**

PRD-04 governs how the experience should distribute across them:

| Surface | Experience Role |
|---|---|
| **Telegram** | relational continuity, voice notes, challenge flow, reaction prompts, score nudges, sharing, immediate participation |
| **AFFiNE** | memory visibility, progress context, operator intervention, dashboard review, structured delivery, longer-lived artifacts |

The practical rule is:

**Telegram carries motion. AFFiNE carries memory.**

The user should feel one experience, not two disconnected products.

### 2.3 The Four Surface Ladder

The new experience center is the async-first communication skill ladder:

1. **Law28 Public Speaking**
2. **Webinar Sales Delivery**
3. **Networking Conversations Mastery (OFAP)**
4. **Social Co-Creations Charisma / Conscious Reactions**

PRD-04 does not define the full internals of each skill surface. It defines the shared experience laws that make all four usable daily:

- low-friction entry,
- clear next action,
- voice-led continuity,
- visible progress,
- natural recovery,
- and content-producing participation.

### 2.4 The Experience Runtime Chain

Most high-value CCP interactions should follow a common chain:

```text
trigger
-> orientation
-> action invitation
-> participation / recording
-> score / feedback reveal
-> next-step invitation
-> continuity memory
-> comeback or replay
```

This chain is more important than any single feature surface. If the chain is smooth, many experiences can succeed. If the chain is clumsy, even strong features underperform.

### 2.5 Async-First Default

The product must be designed on the assumption that:

- scheduling friction kills repetition,
- repetition is required for growth,
- and growth must be tied to daily or near-daily usable experiences.

This means the default should be:

- asynchronous reaction,
- asynchronous practice,
- asynchronous challenge flow,
- asynchronous accountability,
- asynchronous share-and-response loops.

Live features may exist later as escalation, but they should not define the center of the experience architecture.

### 2.6 Voice-First as the Primary Driver

The strongest experiential medium in CCP is voice.

Voice carries:

- authority,
- regulation,
- intimacy,
- timing,
- reassurance,
- correction,
- and branded human feel.

That means the main runtime logic should assume that key emotional transitions happen best through voice notes or voice-led prompts rather than only through text panels.

### 2.7 The First-Session Architecture

The first session is disproportionately important. It should create a fast felt result before the user has to understand the system deeply.

The first-session architecture should therefore optimize for:

- one obvious action,
- one meaningful output,
- one emotionally satisfying reveal,
- one clear next step.

Examples of valid first-session outcomes:

- a first Conscious Reaction with a credible score,
- a short Law28 speaking drill with benchmark feedback,
- a clean webinar-delivery micro exercise with one useful correction,
- a networking-prep intervention that feels immediately applicable.

The product should not spend the first session teaching the whole architecture. It should let the user feel:

- clarity,
- relevance,
- quality,
- and momentum.

---

## 3. Data Contracts, Schemas, and Registry Dependencies

### 3.1 Experience Primitive Registry Dependency

PRD-04 is the primary product module that should consume the Experience Primitive Registry directly.

The registry supplies:

- trigger timing logic,
- friction reduction rules,
- trust and premium framing primitives,
- feedback and scoring rituals,
- progression and replay mechanics,
- safe failure and recovery primitives,
- personalization and identity moves,
- social spread and status structures.

Every serious spec in this module should identify which experience primitives it relies on and whether they are:

- core loop primitives,
- moment primitives,
- accent primitives,
- or safeguard primitives.

### 3.2 Core Experience Objects

PRD-04 should standardize the following runtime objects:

| Object | Purpose |
|---|---|
| **ExperienceStatePacket** | current user state, stage, momentum level, safety profile, active surface |
| **VoicePromptPacket** | voice-note job, tone target, sonic bed class, timing rules, CTA style |
| **ActionInvitationPacket** | what action the user is being asked to take and why now |
| **ScoreRevealPacket** | score payload, explanation mode, growth delta, next-step logic |
| **ContinuityMemoryRecord** | what happened, what the user felt, what should come next |
| **ComebackProtocolPacket** | recovery timing, emotional job, restart ease, shame-avoidance logic |
| **ExperienceEvaluationPacket** | fidelity to primitives, user behavior, retention effect, quality outcome |

These objects should be readable by agents and deterministic services alike. They allow voice notes, Mini App states, AFFiNE dashboards, and follow-up logic to behave coherently rather than improvising each experience from scratch.

### 3.3 Voice Prompt Contract

The `VoicePromptPacket` should minimally include:

- `emotional_job`: orient, relieve, validate, invite, redirect, celebrate
- `surface`: Telegram message, challenge milestone, score reveal, share follow-up
- `tone_profile`
- `length_class`
- `sonic_palette_class`
- `clarity_priority`
- `next_step`
- `forbidden_moves`
- `coach_identity_constraints`

This packet matters because voice quality is too central to be governed by loose prompting alone.

### 3.4 Experience Telemetry

PRD-04 should also define the experience telemetry layer. Important events include:

- topic opened,
- prompt played,
- reaction started,
- reaction completed,
- score revealed,
- share sent,
- vote received,
- comeback prompt opened,
- challenge day completed,
- upgrade invitation opened.

These events should not exist for vanity analytics alone. They support experience evaluation and later primitive benchmarking.

### 3.5 Crosswalk Dependency

Some territories require both meaning and experience coordination. Examples:

- intimacy in voice notes,
- persuasion pacing,
- premium trust in score reveals,
- humor in reaction modes,
- contrast in first prompts.

PRD-04 should use the primitive crosswalk to avoid reducing these to only UI or only content. The experience layer must know when it is carrying a meaning obligation.

### 3.5A Inherited Intelligence Substrates

PRD-04 should not behave as if the experience plane invents its own context from scratch.

The experience layer inherits critical routing and personalization context from still-valid deeper layers:

- **Client Intelligence Layer** maturity
- **Semantic Affinity Guard**
- **Audience Maturity**
- **Context Reasoning outputs**
- **Cultural Memory Map** implications when belonging and trust are at stake

This means a serious experience spec should be able to answer:

- how much does the system actually know about this user or cohort?
- what kind of depth is appropriate?
- what kind of framing is psychologically safe?
- what kind of prompt might accidentally intensify pain instead of easing it?

Without those inputs, the experience layer can look polished while still being strategically blind.

### 3.5B Archetype and Media Handoff Awareness

PRD-04 is not the author of scripts or media, but it must remain aware of archetype and media consequences.

The experience layer should know:

- which archetype container is active
- what emotional job that archetype is meant to perform
- whether the current moment is trying to generate reaction, teaching, authority, narrative, or conversion
- and what kind of output object is likely to be emitted later

This matters because experience surfaces shape the raw material that PRD-02 and PRD-03 later compile and render.

### 3.5C Relationship to the Semantic Discernment Architecture

PRD-04 now explicitly inherits the Semantic Discernment Architecture (SDA) doctrine defined in:

- `lab/semantic_discernment_architecture_content_engine_v_1.md`
- `lab/semantic_discernment_architecture_artifact_taxonomy_v_1.md`
- `lab/CCP APRIL Updates/05_Core_Experience/Perceptual_Primitives_Architecture.md`
- `lab/CCP APRIL Updates/05_Core_Experience/Matrix of Edging.md`

For the experience layer, SDA matters because a flow can feel smooth while still teaching the wrong meaning habits. Experience design therefore has to respect not only friction and delight, but also:

- which **Existential Invariants** are being activated,
- whether the flow is intensifying or softening the right pressure,
- whether the experience preserves or distorts the intended **Representation Geometry**,
- and what **Feedback Loops** or **Recursive Patterns** the interaction will train into the user over time.

This is especially important in high-charge territories such as:

- belonging and social proof,
- status-bearing score reveals,
- recovery after failure,
- accountability rituals,
- and premium trust cues around upgrades.

PRD-04 should therefore assume that experience quality is partly semantic governance. A locally effective nudge can still be wrong if it manufactures belonging, induces identity dependence, or conditions the user into a loop that feels engaging short-term but weakens long-loop trust.

### 3.6 Upgrade and Continuity State Contracts

The experience system should not treat monetization as a separate bolt-on layer. Upgrade readiness should be inferred from continuity states such as:

- repeated participation,
- score curiosity,
- positive response to celebration moments,
- explicit interest in better content outputs,
- willingness to share or invite.

This does not mean every session should sell. It means the system should know when the user is ripe for:

- staying on the challenge,
- moving into deeper continuity,
- or unlocking the fuller operating system.

That state logic belongs in the experience plane because it is shaped by trust, timing, and emotional readiness.

---

## 4. The Architectural Correction PRD-04 Enforces

This module exists to correct six major design mistakes.

### 4.1 Error One: Treating Voice as a Notification Layer

Voice notes should not behave like pleasant wrappers around app instructions. They are one of the main reasons the ecosystem feels alive. If they become generic reminders, the platform loses much of its premium human feel.

### 4.2 Error Two: Designing Around Live Intensity Instead of Daily Repetition

Synchronous roleplay rooms and synchronized events can feel impressive, but they introduce scheduling friction that weakens the real moat: repeated use, daily practice, and compounding data.

PRD-04 therefore de-centers live roleplay and synchronous-first events as core experience surfaces.

### 4.3 Error Three: Confusing Feature Richness with Experience Quality

More widgets, more tabs, and more options do not make the product feel better. What matters is:

- obvious entry,
- meaningful progression,
- emotionally intelligent follow-up,
- and premium clarity.

The system should feel light on the surface even when it is deep underneath.

### 4.4 Error Four: Forcing the User to Learn the System Before Feeling Value

The product should teach by use, not by onboarding lectures. The first sessions should deliver a felt result fast:

- a clear reaction,
- a better voice note,
- an intelligible score,
- a visible asset,
- or an emotionally satisfying next step.

This is why experience primitives matter. They help the system feel obvious and rewarding before it feels fully understood.

### 4.5 Error Five: Treating Recovery as an Afterthought

Users will miss days, hesitate, score lower than expected, or feel exposed. If comeback logic is weak, the system feels punishing. PRD-04 treats recovery as a core flow, not a support case.

### 4.6 Error Six: Explaining Instead of Letting the Experience Sell Itself

One of the strategic advantages of CCP is that quality can be felt directly. If the system orients clearly, delivers fast, scores well, and sounds alive, the user will often believe in it before fully understanding it. PRD-04 therefore prioritizes experience quality as a commercial mechanism, not just a UX nicety.

---

## 5. Deep Mechanism: Why the Experience Layer Works

### 5.1 The Six Emotional Jobs

The Voice-First Doctrine established the most important law in this module:

every voice note should do **one emotional job** extremely well.

Those jobs are:

- **Orient**
- **Relieve**
- **Validate**
- **Invite**
- **Redirect**
- **Celebrate**

This matters because noisy multipurpose voice prompts feel synthetic and exhausting. Single-job messages feel crafted, useful, and memorable.

### 5.2 Continuation Should Be Easier Than Hesitation

Telegram continuity works when the next step is lower-friction than pausing to wonder what to do. This is one of the central experience laws for the platform.

The user should feel a flow like:

`brief -> react -> hear score -> see next move -> continue`

rather than:

`brief -> confusion -> menu choices -> hesitation -> drop-off`

This law is as important to conversion as it is to usability.

### 5.3 Experience Primitives as Adoption Mechanics

The registry work showed that experience primitives behave differently from content primitives. They govern:

- whether the first step feels easy enough,
- whether the score reveal feels prestigious instead of arbitrary,
- whether shame converts into replay,
- whether the system feels premium,
- whether sharing feels socially natural,
- and whether identity accumulates across sessions.

These are not cosmetic improvements. They directly influence:

- adoption,
- retention,
- conversion,
- and referral.

They also influence whether the system captures the right kind of raw material for later script and media generation.

If the experience creates:

- shame instead of confidence
- vagueness instead of specificity
- hesitation instead of expression
- or boredom instead of felt relevance

then even strong content and media systems later are forced to repair damage they should never have inherited.

### 5.4 The Async Advantage

Asynchronous participation gives CCP several structural benefits:

- more repetitions,
- lower scheduling failure,
- easier social propagation,
- stronger content extraction,
- cleaner comeback opportunities,
- and more agent-driven follow-up chances.

This is why the central experience logic should be built around:

- topic-based reactions,
- daily challenge loops,
- score-based improvement,
- and accountability pairings that do not require mutual scheduling.

### 5.5 Voice as Medium and Coaching

Voice is especially powerful because the medium itself trains the user.

The user does not only hear instructions. They hear:

- pacing,
- pause architecture,
- clarity,
- emotional control,
- sincerity,
- and authority.

That means the product experience is itself a teaching channel. Voice design is therefore product design, not merely media treatment.

### 5.6 Scoring as Reflection, Not Punishment

Score systems become sticky when they do three things:

- feel meaningful,
- teach something,
- and imply a next improvement path.

PRD-04 should treat score reveals as branded rituals, not just data dumps. A bad score should create:

- reflection,
- a viable comeback path,
- and belief that improvement is possible.

### 5.7 Social Propagation Through Value, Not Begging

The product's social behavior should emerge through:

- votes,
- reactions,
- supervisor pairing,
- jury logic,
- benchmark comparison,
- and visible improvement.

This gives the system a natural share reason without awkward referral asks. PRD-04 does not own the whole referral system, but it owns many of the experience conditions that make silent referral possible.

---

## 6. Implementation Stack and Systems Biology

### 6.1 Experience as a Behavioral Stack

The experience layer can be understood as a behavioral physiology:

| Biological Analogy | Experience Component | Function |
|---|---|---|
| Sensory system | trigger detection and topic relevance | notice when the right interaction should begin |
| Nervous system | Telegram and Mini App state flow | transmit the experience at low friction |
| Voice and breath | voice prompt engine and sonic palette | regulate tone, confidence, intimacy |
| Reward system | score reveals, streaks, wins, progress | reinforce continued participation |
| Immune system | safety signals, comeback logic, guardrails | prevent shame, confusion, distrust |
| Memory system | continuity memory, AFFiNE history, benchmark store | preserve progression and context |

This makes it easier to reason about why experience work deserves a full module. It is a real system, not a set of random UI improvements.

### 6.2 Telegram Mini App Platform

The Telegram Mini App and native Telegram chat should work together rather than compete.

The Mini App should handle:

- richer interaction surfaces,
- score visualizations,
- reaction recording states,
- vote and share flows,
- challenge progression surfaces,
- playful or branded visual logic.

Telegram chat and voice should handle:

- relational continuity,
- direct guidance,
- asynchronous follow-up,
- coach-feeling interaction,
- and low-friction next-step invitations.

### 6.3 Voice Prompt Engine

The voice prompt engine should manage:

- emotional job selection,
- voice DNA alignment,
- sonic bed choice,
- silence use,
- clarity and pacing targets,
- and fallback rules when audio would create more friction than value.

This engine should not be a loose text-to-speech wrapper. It should behave like a small broadcast composer.

### 6.4 Experience State Machine

PRD-04 should assume a state machine at the experience level. Core states include:

- not yet oriented,
- invited,
- ready to act,
- recording,
- waiting for score,
- scored,
- challenged,
- resting,
- comeback-eligible,
- continuity-active.

This allows both the backend and the experience primitives to work against a shared structure rather than fuzzy session assumptions.

### 6.5 Experimentation and Primitive Benchmarking

Because experience primitives are implementation law, they should become benchmarkable. The system should be able to compare:

- one score reveal ritual vs another,
- one comeback tone vs another,
- one entry brief structure vs another,
- one premium trust cue vs another.

This makes PRD-04 a key stepping stone toward agent-usable experience optimization.

### 6.6 De-Centering the Legacy Roleplay Surface

The April modularization index still references the old WebRTC roleplay engine as `FR-APR-05`, but this module must keep the updated strategic stance clear:

- live roleplay may remain as a marginal or later-surface escalation,
- but it is no longer a central experience architecture bet,
- and the platform should prioritize async skill experiences that compound daily.

This prevents the module from inheriting outdated focus.

### 6.7 Voice Note Composition Rules

The voice-note engine should follow several hard composition rules:

1. **One emotional job only.**
2. **Write for the distracted ear.**
3. **Keep the voice as the lead instrument.**
4. **Use silence deliberately when reflection is the point.**
5. **Never let sonic decoration outrank clarity.**
6. **Prefer second-person immediacy over abstract motivational phrasing.**

In practice, this means a good voice note should sound closer to a micro-broadcast from a thoughtful guide than to a chatbot reading product copy. This is a major adoption lever because many users will judge the entire sophistication of the ecosystem from a small number of audio interactions.

### 6.8 Sonic Palette Governance

The experience layer should maintain a small controlled sonic palette, not an ever-expanding folder of random sounds. The palette should include:

- calm and reassuring beds,
- momentum beds,
- reflective beds,
- celebratory beds,
- rare transition stings,
- very limited contextual punctuation.

The goal is recognizability and premium feel, not spectacle. Sonic palette governance should therefore live at the doctrine level, not be improvised per feature.

---

## 7. Workflow Integration Across the Platform

### 7.1 Law28 and Daily Practice

For Law28, PRD-04 governs:

- onboarding warmth,
- daily drill framing,
- benchmark reveal experience,
- comeback after missed days,
- celebration of visible progress,
- and the premium feel of daily participation.

The surface should feel like personal training, not homework.

### 7.2 Webinar Sales Delivery

For webinars, this module governs:

- pre-session voice orientation,
- frictionless transitions into practice,
- persuasive performance feedback,
- challenge continuity between builds,
- and how instructional exercises are made engaging enough to repeat.

### 7.3 OFAP and Networking Mastery

For networking, PRD-04 governs:

- confidence-building prompts,
- low-friction field prep,
- reflection capture after real interactions,
- and how offline experiences are brought back into continuity memory.

The platform does not simulate every conversation. It prepares and metabolizes them.

### 7.4 Conscious Reactions

For Conscious Reactions, PRD-04 governs the experience substrate:

- entry timing,
- brief clarity,
- reaction readiness,
- score reveal quality,
- recovery after weak takes,
- vote and share comfort,
- and social participation without confusion.

PRD-06 will define the full product logic of Conscious Reactions. PRD-04 defines the experience laws it must obey.

The bridge to PRD-02 and PRD-03 should be explicit here.

Conscious Reactions is not only a participation surface. It is one of the main raw-material capture systems for:

- reaction takes
- score-bearing delivery evidence
- argument fragments
- debate branches
- proof of authority

Those captures later become script and media inputs, so the Mini App experience should be designed to elicit material that is both humanly valuable and computationally useful.

### 7.5 CBCS and Accountability

For CBCS, this module helps make accountability feel:

- supportive,
- precise,
- alive,
- and non-clinical.

Voice-note timing, challenge continuity, score explanation, and comeback logic all live here even when the deeper coaching system lives in PRD-05.

### 7.5A User Card Gallery and Sharing Experience

PRD-04 should explicitly support the public-facing experience layer for CBCS User Cards.

The card itself is defined in PRD-05.
This module defines how it is felt and shared.

The experience should support:

- a community gallery view inside the Mini App
- weekly or program-defined card reveal rituals
- reactions such as celebrate, support, challenge, or compare
- clear distinction between private coaching artifacts and public identity artifacts

The key UX rule is that the User Card should feel collectible and status-bearing, not like a report screenshot.

That means:

- premium templates
- clear tier color progression
- visible stat movement
- and easy share surfaces for Telegram, WhatsApp, and story-style distribution

This gallery layer should strengthen belonging and return behavior without making users feel exposed or judged.

### 7.6 AFFiNE Operator View

AFFiNE should show the operator:

- where clients are stuck,
- what stage they are in,
- what score changes occurred,
- which experience states are failing,
- and where a human intercept is worth doing.

This lets human intervention remain precise rather than noisy.

### 7.7 Challenge Transition Design

The movement from:

- first experience,
- to lead magnet,
- to speaking & learning,
- to coach os

should feel like natural deepening, not like a funnel trap. That means the transition moments need to be designed around:

- proof already felt,
- score or benchmark curiosity,
- visible progress,
- real next-step usefulness,
- and reduction of uncertainty.

The worst possible version is a hard commercial jump that feels unrelated to the immediately preceding experience. The best version is when the user thinks: "I can already feel the value, so of course I want more of this."

### 7.8 Human Intercept as Experience Safety Valve

One of CCP's quiet advantages is that the human coach or operator can still intervene. PRD-04 should preserve this as an experience safety valve.

The system should surface when a human intercept is worth doing:

- after unusual hesitation,
- after a meaningful breakthrough,
- after repeated low-confidence performance,
- after a strong public win,
- or when the user is near upgrade or dropout thresholds.

This keeps the product from feeling either fully manual or coldly automatic. It lets automation create scale while still leaving room for meaningful human presence.

---

## 8. Self-Translation, Compounding, and Learning Memory

### 8.1 Experience Produces Content and Data

The system's best experiences should naturally yield:

- better communication,
- better trust,
- better data,
- and better content.

This is one of the strongest product advantages. The coach is not forced into a separate content workflow. By participating in challenge, reaction, webinar, or networking drills, they generate content exhaust and benchmark memory automatically.

### 8.2 Continuity Memory

Every meaningful interaction should leave behind continuity memory:

- what happened,
- what the user felt,
- what score changed,
- what next step was invited,
- and what should happen if they do nothing.

This enables much smarter follow-up than generic reminders.

### 8.3 Experience Memory as Product Learning

As the system runs, it should learn:

- what kinds of prompts get entered,
- what kinds of score reveals cause replay,
- what kinds of comeback messages reduce shame best,
- what kinds of share mechanics feel natural,
- what kinds of sonic choices increase trust,
- what kinds of entry surfaces create the strongest perceived quality.

This creates a second learning loop parallel to content learning. It is part of the moat.

### 8.4 Signature Style Formation

Experience design contributes directly to the user's signature style because it shapes:

- how often they practice,
- how they hear strong communication modeled,
- how they reflect on their own speaking,
- how often they get to retry,
- and how much emotionally relevant repetition they receive.

This means PRD-04 is not only about usability. It is part of pedagogy.

### 8.5 Agent-Usable Experience Metadata

Eventually the experience layer should become queryable by agents:

- which comeback protocols work best for low-confidence users?
- which entry mechanics fit a church vs a coach use case?
- which score reveal primitives improve replay in Conscious Reactions?
- which tone profiles help webinar users continue?

This is where primitive-based internal usage becomes operational.

### 8.6 Adoption Acceleration as a First-Class Output

One of the most important realizations in the April architecture is that adoption acceleration is itself a system output. A strong experience should not only complete a task. It should make the next use more likely.

That means every high-quality experience should ideally increase at least one of:

- confidence to return,
- curiosity about scores,
- desire to share,
- belief in the platform's quality,
- willingness to continue the challenge,
- readiness to hear the next voice note.

If an experience works tactically but does not improve future willingness, it is not yet operating at the level of a moat.

---

## 9. Validation, Benchmarks, and Quality Gates

### 9.1 Core Validation Questions

Every experience flow should answer yes to these:

1. Is the next action obvious?
2. Does the experience feel low-friction enough to continue?
3. Does the voice layer sound premium, helpful, and alive?
4. Does the score or feedback create clarity rather than confusion?
5. Is there a believable comeback path after hesitation or failure?
6. Does the flow strengthen trust and perceived product quality?

If not, the flow is not ready.

### 9.2 Required Validators

| Validator | Purpose |
|---|---|
| **Emotional Job Validator** | ensure each voice note does one job clearly |
| **Friction Validator** | catch multi-step confusion, dead-end states, or excessive cognitive load |
| **Trust and Premium Validator** | catch generic or cheap-feeling interactions |
| **Score Meaning Validator** | ensure score reveal has interpretation and next-step clarity |
| **Comeback Validator** | ensure missed or weak sessions still have recovery dignity |
| **Surface Continuity Validator** | ensure Telegram and AFFiNE tell one coherent story |

### 9.3 Benchmark Metrics

The experience layer should track:

- entry rate,
- action completion rate,
- reaction completion rate,
- score reveal open rate,
- comeback rate,
- day-7 retention,
- voice prompt completion rate,
- share or vote participation rate,
- upgrade signal after quality moments,
- perceived premium trust.

These metrics should be tied back to primitive choices over time.

### 9.4 Acceptance Thresholds

At minimum:

| Metric | Minimum Standard |
|---|---|
| obvious next action | required |
| no critical friction dead ends | required |
| emotional job clarity | required |
| score reveal interpretability | high confidence |
| comeback path present | required |
| Telegram / AFFiNE continuity coherence | pass |

The system should not ship experience flows that are merely functional but emotionally flat or confusing.

### 9.5 Quality Control as Commercial Architecture

Experience quality is part of monetization. When users feel:

- guided,
- relieved,
- accurately scored,
- personally addressed,
- and surprised by speed and polish,

they stop needing a long explanation of why the product matters. That is why PRD-04 quality control is also commercial quality control.

### 9.6 Lower-Score Experience Primitives Still Matter

As with other registries, lower-MCDA primitives may still matter as:

- accent moves,
- moment shapers,
- emotional punctuation,
- failure softeners,
- latency masks,
- or premium detail layers.

They should not be discarded just because they do not dominate a top-line MCDA table.

This is especially true in voice-first systems, where tiny details in timing, relief, and phrasing can determine whether the whole experience feels handcrafted or forgettable.

---

## 10. Risk Mitigation

### 10.1 Voice Becoming Generic Risk

**Risk:** Voice notes drift into generic motivational AI.

**Mitigation:** use explicit emotional jobs, voice DNA alignment, sonic restraint, and validator rules against multi-job rambling.

### 10.2 Async Becoming Emotionally Flat Risk

**Risk:** Asynchronous surfaces scale but lose intensity and connection.

**Mitigation:** use voice-first continuity, reflective scoring, visible progression, and social/accountability structures to keep the experience alive.

### 10.3 Friction Creep Risk

**Risk:** As more features are added, the experience becomes confusing.

**Mitigation:** enforce one primary next action per state, run friction audits, and keep experience primitives tied to every spec.

### 10.4 Over-Gamification Risk

**Risk:** Mechanics feel manipulative or childish for coaches and serious communities.

**Mitigation:** keep gamification grounded in growth, proof, and status-through-improvement rather than artificial reward theater.

### 10.5 Shame and Drop-Off Risk

**Risk:** Users who miss days or score poorly feel exposed and leave.

**Mitigation:** make redemption, forgiveness, and comeback pathways first-class flows rather than apology copy added later.

### 10.6 Surface Fragmentation Risk

**Risk:** Telegram and AFFiNE begin to feel like separate products.

**Mitigation:** keep one continuity memory model and explicit handoff logic between relational flow and structured memory.

### 10.7 Legacy Architectural Drift Risk

**Risk:** Old assumptions about synchronous events, roleplay centrality, or overly complex UI re-enter the system.

**Mitigation:** lock async-first, voice-first, and two-touchpoint discipline as module-level laws and review new specs against them.

### 10.8 Invisible Value Failure Risk

**Risk:** The backend gets stronger but users do not feel the benefit.

**Mitigation:** treat experience quality as the final delivery surface for all hidden intelligence. If the user cannot feel the quality quickly, the architecture is incomplete.

---

*This document is one of 9 modular PRD modules. Consult PRD_INDEX.md for the complete module registry, cross-reference tables, and agent loading protocol.*


---

## ERA 3 BROWNFIELD ANALYSIS (Functional Requirements)

# Functional Requirements: PRD-04 CVE Experience Design

This document details the functional requirements for the **PRD-04 CVE Experience Design** module, applying the Era 3 (Core-24) Brownfield structural analysis.

---

## 1. Needs to be Built (New Features & Updates)

### 1.1 The Async-First Default (Four Surface Ladder)
*   **WHAT feature needs to be built OR Updated:** Shift the primary experience layer to four async-first skill surfaces (Law28 Public Speaking, Webinar Sales Delivery, Networking Mastery, Conscious Reactions) that compound daily. Move definitively away from high-friction live/synchronous events.
*   **WHICH Primitives are actively engaging:** PRG (Progression Mechanics), FRC (Friction & Flow Management), FBK (Feedback & Scoring).
*   **WHY it needs to be built OR Updated:** Live synchronous events (like roleplay rooms) create massive scheduling friction that kills repetition. Growth is intrinsically tied to daily, low-friction, usable experiences.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Increases repetitions, dramatically lowers drop-off, enables easier social propagation, and produces stronger content extraction exhaust naturally. It builds a behavioral moat.
*   **WHAT does not need to be built:** The foundational Telegram Mini App continuity logic and the async reaction architectures.
*   **WHY it's already perfect how it is (PROOF):** Exists and spec'd natively in `FR-COM-03_Telegram_Code_Onboarding_Agent_Tech_Spec.md`, `FR_CBCS_07_Telegram_Intimacy_Index_Tech_Spec.md`, and the Conscious Reactions architecture documents.

### 1.2 Two-Touchpoint Runtime & Telegram Mini App Companion
*   **WHAT feature needs to be built OR Updated:** Lock the entire user experience into exactly two sovereign surfaces. **AFFiNE** serves as the Coach's command center (memory, asset approval, Studio Broadcasting). **Telegram** serves as the Audience's execution surface (motion, voice notes). Crucially, complex UI interactions (like Webinars, Polls, Payments, and Quizzes) must be handled by a native **Telegram Mini App Companion**.
*   **WHICH Primitives are actively engaging:** FRC (Friction Management), SAF (Safety & Trust), TRG (Triggers).
*   **WHY it needs to be built OR Updated:** Forcing the user to learn a standalone custom app, or forcing them to leave Telegram for a browser to watch a webinar or make a payment introduces fatal friction. The Telegram Mini App keeps them inside the chat while providing a rich visual overlay.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** The user feels one continuous "Invisible App". They consume broadcasts, take polls, submit voice-note questions, and seamlessly pay for upgrades without ever leaving their Telegram conversation with the coach's AI assistant.
*   **WHAT does not need to be built:** The AFFiNE embedded dashboard structure and Telegram bot/Mini App integrations.
*   **WHY it's already perfect how it is (PROOF):** Completely specified and built across `FR-CA11-02_AFFiNE_Sync_Service_Tech_Spec.md`, `FR-CA11-10_Excalidraw_Embedded_Workspace_Tech_Spec.md`, and `FR-CA11-03_Client_Workspace_Provisioning_Tech_Spec.md`.

### 1.3 Voice Prompt Engine (Single Emotional Job)
*   **WHAT feature needs to be built OR Updated:** Implement a strictly governed Voice Prompt Engine where every voice note performs exactly *one* emotional job (Orient, Relieve, Validate, Invite, Redirect, Celebrate) using a controlled sonic palette.
*   **WHICH Primitives are actively engaging:** VOC (Voice & Audio Intimacy), VSG (Visual & Sonic Guidance), TRG (Triggers).
*   **WHY it needs to be built OR Updated:** Treating voice as a mere notification layer (text-to-speech reading product copy) sounds robotic and destroys the premium human feel of the ecosystem.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Ensures the voice notes act as a direct coaching channel. The medium itself trains the user through pacing, pause architecture, and authority, creating an immersive "Theatre of the Mind."
*   **WHAT does not need to be built:** The base voice synthesis pipelines and Voice DNA extractors.
*   **WHY it's already perfect how it is (PROOF):** Covered extensively in `FR-VID-06_Audio_Engine_Tech_Spec.md` and the existing Voice DNA extraction specs (`FR3_Voice_DNA_Extraction_Tech_Spec.md`).

### 1.4 Continuity Memory & Comeback Protocols
*   **WHAT feature needs to be built OR Updated:** Establish a first-class flow for user recovery after hesitation, missed days, or low scores without inducing shame.
*   **WHICH Primitives are actively engaging:** FBK (Feedback & Scoring rituals), SAF (Safety & Trust), PRG (Progression).
*   **WHY it needs to be built OR Updated:** If comeback logic is weak or treated as an afterthought, the system feels punishing. Users drop off permanently after a single failure to avoid exposure.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Converts shame into replay. Maintains the retention moat by naturally accommodating human hesitation.
*   **WHAT does not need to be built:** The core progression tracking and diagnostic logic.
*   **WHY it's already perfect how it is (PROOF):** Structurally defined in `FR30_Dormancy_Recovery_Tech_Spec.md` and `FR_CBCS_13_Counterfactual_Activation_Window_Tech_Spec.md`.

### 1.5 SDA-Aware Experience Integrity
*   **WHAT feature needs to be built OR Updated:** Add SDA-aware experience governance so score reveals, comeback flows, social participation loops, and premium trust cues explicitly reference `lab/semantic_discernment_architecture_content_engine_v_1.md`, `lab/semantic_discernment_architecture_artifact_taxonomy_v_1.md`, `lab/CCP APRIL Updates/05_Core_Experience/Perceptual_Primitives_Architecture.md`, and `lab/CCP APRIL Updates/05_Core_Experience/Matrix of Edging.md`.
*   **WHICH Primitives are actively engaging:** FBK (Feedback & Scoring), SAF (Safety & Trust), SOC (Social Dynamics), PRG (Progression), PER (Personalization).
*   **WHY it needs to be built OR Updated:** Experience flows can accidentally create manipulative belonging, brittle status hunger, or identity-fragile recovery loops even when the UX looks polished.
*   **SO WHAT (the benefit of this in the CCP ecosystem):** Makes PRD-04 responsible not only for smoothness but for the kind of person and social field the product is training. This gives CCP more accurate evals and stronger long-loop trust.
*   **WHAT does not need to be built:** The existing continuity, prompt, and state-machine infrastructure.
*   **WHY it's already perfect how it is (PROOF):** The infrastructure for prompts, recovery, and state flow already exists; Wave 0 adds SDA interpretation and guardrails to those existing flows.

---

## 2. Inventory of Specs for CURRENT RELEVANT CCP FEATURES

The following technical specifications map to the foundational capabilities that act as the irreducible core of PRD-04. **These do NOT need to be built from scratch**; they are already architected, perfect as they are, and ready for deployment.

### Telegram & Continuity Architecture
*   `FR-COM-03_Telegram_Code_Onboarding_Agent_Tech_Spec.md`
*   `FR_CBCS_07_Telegram_Intimacy_Index_Tech_Spec.md`
*   `FR-CA11-03_Client_Workspace_Provisioning_Tech_Spec.md`

### AFFiNE Memory Surfaces
*   `FR-CA11-02_AFFiNE_Sync_Service_Tech_Spec.md`
*   `FR-CA11-10_Excalidraw_Embedded_Workspace_Tech_Spec.md`

### Voice Engine Foundations
*   `FR-VID-06_Audio_Engine_Tech_Spec.md`
*   `FR3_Voice_DNA_Extraction_Tech_Spec.md`

### Comeback & Dormancy Logic
*   `FR30_Dormancy_Recovery_Tech_Spec.md`
*   `FR_CBCS_13_Counterfactual_Activation_Window_Tech_Spec.md`

---

## 3. MARKED AS OBSOLETE (For System Removal)

The following capabilities have been superseded by the Core-24 brownfield update and should be permanently removed from the active system architecture. This forms the Master Deletion Inventory for CVE Experience Design:

*   **[OBSOLETE] Legacy Synchronous Roleplay & Live Rooms:** The WebRTC multi-party routing and synchronous practice environments are fully deprecated in favor of the Async-First "Four Surface Ladder".
    *   *Deletion Targets:* `src/ccp/services/guest_join_service.py`, `tests/integration/test_ca11_fr21_guest_join.py`, and `docs/architecture/FR-CA11-21_Studio_Guest_Join_Tech_Spec.md`.
*   **[OBSOLETE] Generic Text-To-Speech (TTS) Notification Relays:** The platform abandons flat, string-based notifications that do not carry the coach's Voice DNA.
    *   *Modification Targets:* Flat `_send_telegram_notification` string dispatchers (e.g., in `src/ccp/services/affine_client_workspace.py`) must be refactored to pass through the new Voice Prompt Engine so they serve exactly one emotional job.
