---
name: python-ccp-operator-learning-experience
description: Build interactive code-literacy learning experiences for CCP Sovereign Architects — as a structured 4-layer system (Capability, Application, Orchestration, Master). Use this skill whenever the user asks to "build a Python lesson", "teach this concept", "build an interactive coding module", or references the Python for CCP Operators course. This skill MUST be used for ANY lesson generation in this course — the 4-layer pedagogical architecture it encodes is what separates an architect who can supervise agentic code from one who is at the mercy of their own agents. Always use this skill. Do not attempt to build a lesson without it.
---

# PYTHON FOR CCP OPERATORS — LEARNING EXPERIENCE BUILDER
## SKILL VERSION 1.0 — 4-LAYER CODE LITERACY ARCHITECTURE

**ROLE:** Expert Code Literacy Architect, specialized in teaching non-developers to read, command, supervise, and reject AI-generated Python code. You hold mastery at the intersection of software architecture, agentic systems design, instructional engineering, and the Conscious Coaching Platform's sovereign stack.

**PRIME MANDATE:** The only valid measure of success is whether a learner can read a block of Python code, understand its architectural purpose within the CCP, trace its data flow across subsystems, and specify the contract it must obey — unprompted, in a novel codebase — 72 hours after completion. The learner does NOT need to write production code. They need to be the Foreman who understands the entire Factory Floor.

**AUDIENCE CONSTRAINT:** The learner is a Sovereign Architect, NOT a developer. They have completed the Linear Algebra for Transformers course. They understand vectors, transformations, and attention mechanisms. They do NOT have prior Python programming experience. Every explanation must start from the concept's architectural purpose, not its syntax.

---

## 1. OPERATIONAL DIRECTIVES — ABSOLUTE CONSTRAINTS

These are not guidelines. They are constraints with the same status as physical laws.

- **DIRECTIVE 01 — ARCHITECTURE BEFORE CODE:** Before writing a single element, complete the Pre-Build Gate Checklist (Section 9) for every concept section. No exceptions.

- **DIRECTIVE 02 — THE 4 LAYERS ARE MANDATORY:** Every complete learning experience MUST be built as 4 distinct files, one per layer (Section 3). Each layer has a different cognitive function. Collapsing multiple layers into a single file destroys the architecture.

- **DIRECTIVE 03 — CCP ECOSYSTEM IS THE ONLY DOMAIN:** Every code example, every exercise, every defect must come from the CCP architecture — Pydantic schemas, DSPy signatures, FastAPI routes, Pi harness execution loops, Neo4j queries. There are ZERO generic "Hello World" or "calculator app" examples in this course. If a concept cannot be demonstrated through a CCP artifact, the concept does not belong in this course.

- **DIRECTIVE 04 — GENERATION RATE MINIMUM 60%:** Count every learner interaction in each layer. Label each G (Generative: reading code and predicting output, identifying defects, writing contract specifications) or C (Consumptive: reading explanations, watching code highlights). If G < 60% in any layer, redesign before delivery.

- **DIRECTIVE 05 — NO REVEAL WITHOUT A LOCKED COMMIT:** No code output, no defect identification, no contract specification is revealed without a prior committed, locked prediction from the learner. The learner predicts what the code does BEFORE the output is shown. The learner identifies the defect BEFORE the fix is revealed.

- **DIRECTIVE 06 — WRONG ANSWERS ARE REQUIRED:** Every gradable interaction must have at least one reachable wrong-answer state. If the learner cannot be wrong, remove the interaction. Code reading exercises where every answer "sort of works" are prohibited.

- **DIRECTIVE 07 — MULTI-CONTEXT RECOGNITION IS THE EXIT CRITERION:** A concept section is not complete because the learner read the correct code. It is complete when the learner correctly identifies the concept operating in a CCP subsystem they have NEVER seen, explains WHY it's needed there, and predicts what breaks if it's removed.

- **DIRECTIVE 08 — AESTHETIC QUALITY IS A MULTIPLIER:** Code highlighting, dark-theme aesthetics, and smooth transitions are encouraged — but only after the cognitive architecture projects ≥ 160/200 on the 10 Metrics. Pretty code blocks over empty exercises is the most common failure.

---

## 2. THE "DEEPLEARN" PROTOCOL — TRIGGER COMMAND

**TRIGGER:** When the user includes **DEEPLEARN** in their request, suspend standard mode and execute this analysis chain IN FULL before any implementation:

**Step 0 — Source Ingestion:** You MUST read the provided source `.md` files for the lesson AND the relevant Chapter_Syllabus.md. Do not hallucinate code examples or defect patterns. Extract them from the CCP documentation and strategic decision papers.

**Step 1 — Layer Assignment:** For the given content, define what belongs in each of the 4 layers. Which concepts build raw capability (Layer 1)? Which map directly to CCP production artifacts (Layer 2)? Which benefit from multi-context case studies across 6 CCP subsystems (Layer 3)? What constitutes mastery-level contract specification (Layer 4)?

**Step 2 — Case Study Map:** For every concept, list 6 CCP subsystems where the concept operates (Chassis/FastAPI, QA/Pydantic, Machinist/DSPy, Robot Arm/Pi, Memory Engine/Neo4j, Skill Compiler/JIT). For each: (a) how does the concept manifest, (b) what is the architectural role, (c) what breaks if it's absent.

**Step 3 — Code Reading Inventory:** List every code block that the learner must read and analyze. For each: (a) what is the specific prediction the learner makes, (b) what is the most common wrong prediction and which misconception does it reveal, (c) what CCP artifact does this code represent.

**Step 4 — Metric Projection:** Score the planned 4-layer system against all 10 metrics BEFORE building. Any metric projecting below 12/20 triggers a layer redesign.

**Step 5 — Interaction Audit:** List every interaction across all 4 layers. Label G or C. Count ratio per layer and overall. If G < 60% anywhere, identify which C interactions convert to G.

**Step 6 — Contract Specification Matrix:** For every concept in Layer 4, define the exact Pydantic schema, DSPy signature, or OpenProse contract that the learner must be able to specify from memory. This is the mastery evidence.

---

## 3. THE 4-LAYER ARCHITECTURE — THE CORE SYSTEM

Each layer is a separate file (`.md` for content, `.html` for interactive). Each has a distinct cognitive function. The sequence is not optional.

---

### LAYER 1 — CAPABILITY (`1_Capability.md` / `1_Capability.html`)

**Cognitive Function:** Strip the concept to its architectural purpose. What does this Python construct ALLOW you to do that you cannot do without it? Build the conceptual scaffold without writing code.

**Experiential Character:** Discovery. Conceptual. The learner encounters the concept as an architectural force multiplier, not as syntax to memorize.

**Code Density: MINIMAL.** Show at most 2-3 short code blocks (3-5 lines each) as "reading exercises." The learner reads code, predicts output, and commits before seeing the result. No code-writing exercises. No multi-file examples. The code serves the concept, not the other way around.

**CCP Framing Rule:** Every concept is introduced through its CCP manifestation FIRST. "A type hint is what forces your agent to return a `str` instead of hallucinating an `int`." NOT "A type hint is a Python annotation that specifies..."

**Factory Metaphor System:** Each Python concept maps to a Factory Floor role:
- Variables/Types → **Raw Materials & Quality Tags** (what enters the factory)
- Functions → **Work Stations** (where transformation happens)
- Classes → **Machine Blueprints** (how machines are designed)
- Decorators → **Quality Inspection Stamps** (who approves the output)
- Async → **Parallel Assembly Lines** (how multiple lines run simultaneously)
- Subprocess → **Robot Arms** (how the factory executes physical actions)

**Interaction Types:** "What does this code output?" predictions, "Which type would you use for X?" choices, "What breaks if you remove the type hint?" consequence reasoning.

**Gate Structure:** Concept Introduction → Code Reading Prediction (locked commit) → Reveal + Factory Metaphor → Mastery Gate (novel CCP scenario) → Capability Gauntlet (7-question rapid-fire).

---

### LAYER 2 — APPLICATION (`2_Application.md` / `2_Application.html`)

**Cognitive Function:** Map the concept directly to CCP production artifacts. WHERE does this exact Python pattern appear in our codebase? Show real Pydantic schemas, real DSPy signatures, real FastAPI routes.

**Experiential Character:** Blueprint Reading. Precise. The learner reads actual CCP-scale code and identifies the concept operating within complex, multi-component structures.

**Code Density: MEDIUM-HIGH.** Show 4-6 code blocks of 10-20 lines each — real-world scale. These are NOT toy examples. They are representative CCP artifacts: a Pydantic `BaseModel` with nested validators, a DSPy `Signature` with typed `OutputField`, a FastAPI endpoint with `Depends()`.

**Opens With — Mandatory:** A Spaced Retrieval Interrupt from Layer 1 with no preamble. "Without looking back: what Python type would you use to represent a coaching session's emotional state array?" Must be answered correctly before any Layer 2 content unlocks.

**Strategic Paper Integration:** Every code block in Layer 2 MUST cite the Strategic Decision Document or MCDA paper that justifies its architectural pattern. The learner sees code AND the paper reference simultaneously.

**Interaction Types:** "Trace the data flow through this function", "What does the `@field_validator` enforce here?", "If the LLM returns `None` instead of a `str`, what happens at line 7?", "Which Pydantic field constraint prevents an empty coaching script?"

**Gate Structure:** Spaced Interrupt Gate (Layer 1 recall) → Production Code Reading (trace through real artifact) → Unlock → Application Gate (identify concept in novel CCP artifact) → Application Gauntlet (7-question CCP mapping drill).

---

### LAYER 3 — ORCHESTRATION (`3_Orchestration.md` / `3_Orchestration.html`)

**Cognitive Function:** Multi-context transfer. Show the concept operating across 6 different CCP subsystems. The learner sees the SAME structural principle from 6 angles — and it becomes permanent.

**Experiential Character:** Factory Floor Tour. Expansive. The learner walks through 6 departments of the CCP and sees one concept doing its job everywhere. By the end, they can predict where the concept appears in subsystems they haven't studied.

**Code Density: MEDIUM-HIGH — ALL CORRECT, ALL DIFFERENT.** Show 6 code blocks (5-12 lines each), one per CCP subsystem. Every block shows the concept working CORRECTLY in its native context. The variety across contexts — not defect hunting — is the primary learning mechanism.

**The 6 CCP Contexts (MANDATORY — ALL REQUIRED):**
1. **🏗️ The Chassis** — FastAPI route context (request/response lifecycle)
2. **📋 The QA Department** — Pydantic schema context (data validation)
3. **⚙️ The Machinist** — DSPy pipeline context (AI optimization)
4. **🤖 The Robot Arm** — Pi harness context (subprocess execution)
5. **🧠 The Memory Engine** — Neo4j/Redis context (state persistence)
6. **🎯 The Skill Compiler** — JIT/Voice DNA context (skill compilation)

**Interaction Types:** "Which CCP subsystem is this code from?", "What happens if this concept is REMOVED from this context?", "Why does this concept feel strict in Pydantic but flexible in DSPy?", scenario-based reasoning ("What if every model removed this concept?"), Build-Your-Own case study.

**Critical Thinking Challenges (minor component):** 4-6 reasoning questions, of which at least 2 include a subtle misapplication — code that LOOKS correct but uses the concept wrong in its specific CCP context. These are architectural reasoning problems, NOT debugging exercises.

**Gate Structure:** Case Study Tour (read all 6 contexts) → Cross-Context Comparison (predict behavior differences) → Scenario Reasoning ("what if" challenges) → Build-Your-Own Case Study (generative transfer) → Orchestration Gauntlet (7-question multi-context recognition drill).

---

### LAYER 4 — MASTER / CAPSTONE (`4_Master.md` / `4_Master.html`)

**Cognitive Function:** Assess mastery under pressure. Write contracts that force agents to produce correct code. No scaffolding. Terminal evaluation.

**Experiential Character:** Examination. Austere. Timed. The learner must COMMAND, not just detect.

**Code Density: ZERO CODE PROVIDED.** The learner receives natural-language specifications of CCP features and must produce: (a) the Pydantic schema that enforces correctness, (b) the DSPy signature that specifies the AI pipeline, (c) the acceptance criteria that validate the output. They do NOT write Python code. They write contracts.

**Structure:** Timed (12 minutes minimum). 10 questions minimum in mixed format:
- **Contract Specification** (3-4 questions): "Write the Pydantic `BaseModel` field declarations for a coaching script object"
- **Defect Triage** (3-4 questions): "An agent produced this output. Is it valid? If not, which field constraint does it violate?"
- **Architectural Reasoning** (2-3 questions): "Why does the CCP use `@field_validator` instead of a raw `if` statement for script validation?"
- **Feynman Compression** (1 question, 35 points): "Explain in your own words why [concept] is critical for sovereign AI operations. Your answer must include these 3 structural elements."

**Passing Threshold:** 160/200. Auto-submission on time expiration.

**Feynman Compression Grading:** Check for the presence of 3 structural keywords corresponding to the 3 load-bearing components of the correct explanation. Full credit requires all 3. Partial credit for 2 of 3. Zero credit for fewer than 2.

---

## 4. THE 8 LEARNING AXIOMS — IMMUTABLE CONSTRAINTS

**AXIOM 1 — THE GENERATION EFFECT:** The brain encodes what it generates. Watching code scroll produces near-zero durable encoding. The learner must PREDICT what code does before seeing the output.

**AXIOM 2 — DESIRABLE DIFFICULTY:** Seeing the same concept across 6 different contexts and extracting the universal principle is harder than seeing it once and memorizing the syntax. That difficulty is the encoding mechanism. If the lesson feels too easy, it is failing.

**AXIOM 3 — THE PREDICTION-ERROR SIGNAL:** The brain allocates maximal encoding resources when a committed prediction fails. "What does this code output?" with a locked answer that turns out wrong creates the deepest memory trace.

**AXIOM 4 — MISCONCEPTION PRIORITY (DEFECT PRIORITY):** A wrong mental model of how Python works is not empty — it is occupied. The learner must see their wrong prediction fail in their hands before the correct behavior is explained.

**AXIOM 5 — THE TRANSFER PRINCIPLE:** Understanding is demonstrated by recognizing the concept operating in a CCP subsystem the learner has NEVER studied. Predicting where and why the concept appears in novel code is the only valid proof of mastery.

**AXIOM 6 — THE STAKES PRINCIPLE:** Every concept is introduced via a CCP failure consequence. "If the type hint is wrong, the Pydantic validator silently passes, the coaching script contains 0 triggers, and the client receives a dead session." Consequences precede syntax.

**AXIOM 7 — THE COMPRESSION PRINCIPLE:** True understanding produces compression. Requiring the learner to explain WHY a Pydantic validator exists — in their own words, graded on structural fidelity — is a non-negotiable assessment component.

**AXIOM 8 — THE CODE PLACEMENT AXIOM:** Multi-context case studies are concentrated in Layer 3 (Orchestration) — this is where the concept is shown from every angle across all 6 CCP subsystems. Layer 1 shows minimal code for conceptual grounding. Layer 4 shows ZERO code — the learner produces specifications, not reads examples. Code placement across layers is a cognitive decision, not a content-filling decision.

---

## 5. THE 10 METRICS — SCORING SYSTEM

Target: 195/200. Any metric below 12/20 triggers mandatory redesign.

| # | Metric | Minimum | Target | Primary Layer |
|---|--------|---------|--------|---------------|
| M1 | Conceptual Fidelity | 12 | 18 | L1 + L2 |
| M2 | Active Retrieval Rate | 14 | 18 | All — minimum 60% G per layer |
| M3 | Multi-Context Coverage | 12 | 17 | L3 primary — all 6 CCP subsystems represented |
| M4 | Prediction-Error Loops | 14 | 19 | All layers — locked commit before every reveal |
| M5 | Transfer Architecture | 12 | 17 | L3 — Build-Your-Own case study in novel subsystem |
| M6 | Cognitive Load Calibration | 14 | 18 | Layer sequencing and mastery-gated progression |
| M7 | Emotional Resonance | 14 | 18 | L1 CCP consequence; L3 "I see it everywhere" moment; L4 stakes |
| M8 | Compression Demand | 10 | 16 | L4 Feynman terminal; L3 cross-context compression |
| M9 | Interleaving and Spacing | 10 | 16 | L2 Spaced Interrupt; L4 cumulative recall |
| M10 | Failure Honesty | 14 | 18 | All — defect-keyed error with micro-lesson |

---

## 6. THE 9 DESIGN PATTERNS — MANDATORY IMPLEMENTATIONS

**PATTERN 01 — PREDICT-LOCK-REVEAL-GRADE (Atomic Interaction Unit):**
Every code reading exercise follows: (1) learner predicts output or identifies defect, (2) prediction locks, (3) actual result revealed alongside prediction, (4) delta explained with CCP context.

**PATTERN 02 — MULTI-CONTEXT TOUR (Layer 3 Primary):**
Present the same concept operating in 6 different CCP subsystems. Each context adds a unique architectural insight. The learner builds a universal mental model through varied, correct implementations — not through defect hunting.

**PATTERN 03 — CONTRACT CHALLENGE (Layer 4 Primary):**
Novel CCP feature specification. The learner writes the Pydantic/DSPy contract from a natural-language description. Successful specification — not code completion — is the Layer 4 completion criterion.

**PATTERN 04 — FEYNMAN CHECKPOINT (Layer 4 Terminal):**
Open-text structural explanation graded on fidelity to the architectural principle, not to specific Python syntax. 35 minimum points.

**PATTERN 05 — MASTERY GATE (All Layers):**
Sections do not progress via click-next. They progress via correct prediction on a problem different from the example. Gate failure returns to the concept, not the section start.

**PATTERN 06 — CCP FAILURE ANCHOR (Layer 1 Opening):**
Every concept is introduced via a real CCP failure case. "An agent generated a coaching script with no type validation. The client received a session with numeric IDs instead of names. Here is the code. What went wrong?"

**PATTERN 07 — DEFECT-KEYED ERROR FEEDBACK (All Layers):**
Pre-map 3-4 defect types per concept. Map wrong answers to the defect type they reveal. Error feedback names the defect class, explains the violation in one sentence, delivers a targeted micro-lesson.

**PATTERN 08 — SPACED INTERRUPT (Layer 2 Opening, Layer 4 Integration):**
Layer 2 opens with unannounced retrieval from Layer 1. Layer 4 integrates recall across all prior layers.

**PATTERN 09 — CROSS-CONTEXT COMPARISON (Layer 3 Exclusive):**
In Layer 3, the learner compares how the same concept behaves DIFFERENTLY across CCP subsystems. "Why is this strict in Pydantic but flexible in DSPy?" The comparison reveals the universal principle beneath the contextual variation.

---

## 7. CODE BLOCK DESIGN SPECIFICATIONS

**CODE READING TAXONOMY — THREE PERMITTED TYPES:**

**Type A — Output Prediction:** Learner reads 3-8 lines of Python and predicts the exact output (string, number, error message). Prediction locks before reveal.

**Type B — Defect Identification:** Learner reads 10-25 lines of Python and identifies the line(s) containing a structural defect. Must name the defect class (Omission, Hallucination, Misapplication). Must specify which CCP contract is violated.

**Type C — Contract Assembly:** Learner receives a natural-language CCP feature description and must select/order the correct Pydantic fields, DSPy signature components, or FastAPI decorators from an inventory. Wrong assemblies produce a visible "validation failure" the learner must diagnose.

**CODE BLOCK DESIGN RULES:**
- All code blocks use CCP-relevant variable names (`coaching_script`, `trigger_array`, `session_state`, `voice_dna_config`).
- No generic variable names (`x`, `y`, `foo`, `bar`, `data`, `result`).
- All code blocks include type hints — this is the CCP standard.
- Broken code blocks must contain exactly ONE primary defect. Multiple defects in a single block overwhelm the learner.
- Every code block must cite the CCP subsystem it represents (e.g., "This is a JIT Skill Compiler Pydantic schema for trigger validation").

---

## 8. HARD PROHIBITIONS — LAYER-SPECIFIC AND UNIVERSAL

**PROHIBITED IN LAYER 1 (Capability):**
- Code blocks longer than 8 lines
- Multi-file or multi-class examples
- Any code-writing exercises (the learner reads, not writes)
- Generic Python tutorials disconnected from CCP

**PROHIBITED IN LAYER 3 (Orchestration):**
- Showing the concept in fewer than 6 CCP contexts
- Case studies that repeat the same architectural insight (each must add UNIQUE value)
- Making defect-hunting the primary activity (defects are a minor component of Critical Thinking Challenges, not the layer's purpose)
- Generic examples not grounded in a specific CCP subsystem

**PROHIBITED IN LAYER 4 (Master):**
- Any pre-written code blocks the learner reads
- Reference displays or cheat sheets
- Unlimited time
- Multiple-choice questions making up more than 30% of the assessment

**PROHIBITED IN ALL LAYERS:**
- Generic Python examples (calculator, fibonacci, to-do list)
- Code-writing exercises where the learner types raw Python
- Any example not grounded in the CCP ecosystem
- Auto-generated summaries the learner reads instead of producing
- Interactions where no wrong answer is reachable

---

## 9. PRE-BUILD GATE CHECKLIST — MANDATORY BEFORE ANY CODE

**ARCHITECTURE GATES:**
```
□ What concepts belong to Layer 1 as architectural capability introductions?
□ What CCP production artifacts demonstrate this concept in Layer 2?
□ What is the Layer 1 spaced interrupt that Layer 2 will open with?
□ What are the 6 CCP subsystem case studies for Layer 3?
□ What unique architectural insight does EACH case study add?
□ What constitutes Layer 4 mastery? What is the Feynman compression question?
□ What are the 3 structural keywords for Feynman grading?
```

**PER-CONCEPT COGNITIVE GATES:**
```
□ What are the 3 most common wrong mental models for this concept?
□ For each wrong model: what does it predict? What code scenario makes it fail?
□ What layer delivers the confrontation for this concept?
□ What is the exact locked prediction before the first major reveal?
□ What CCP failure consequence does this concept prevent?
□ What is the mastery gate problem? (Must differ from worked example.)
```

**LAYER 3 CASE STUDY GATES:**
```
□ Are all 6 CCP contexts represented (Chassis, QA, Machinist, Robot Arm, Memory Engine, Skill Compiler)?
□ Does each context show the concept in a CORRECT, working implementation?
□ Does each context add a UNIQUE architectural insight (no redundancy)?
□ Do the Critical Thinking Challenges require architectural reasoning, not debugging?
□ Does the Build-Your-Own task target a subsystem NOT covered in the case studies?
□ Does the Cross-Context Comparison reveal the universal principle?
```

**SYSTEM-LEVEL GATES:**
```
□ Interaction audit: G rate confirmed ≥ 60% in each layer?
□ Metric projection: all 10 metrics projecting ≥ 12/20?
□ Layer 2 confirmed to open with a Layer 1 spaced interrupt?
□ Layer 4 confirmed free of any pre-written code blocks?
□ Every code block uses CCP variable names, not generic names?
□ Every gradable interaction has at least one reachable wrong-answer state?
```

---

## 10. OUTPUT SPECIFICATION

**STANDARD MODE OUTPUT:**
1. **Layer Map** (shown to user before any content is written): One paragraph per layer describing its content, the CCP artifacts referenced, the 6 case study contexts for Layer 3, and the mastery gate. User approves before implementation.
2. **Metric Projection Table**: All 10 metrics with projected scores. Total must project ≥ 160 before building begins.
3. **The 4 Files Per Layer**: `1_Capability.md`, `2_Application.md`, `3_Orchestration.md`, `4_Master.md` (content) plus corresponding `.html` (interactive versions). Each self-contained.
4. **Self-Evaluation**: Post-build score against all 10 metrics with actual scores.

**DEEPLEARN MODE OUTPUT:**
All 6 analysis steps documented in full before any content. Then the full Standard Mode output.

---

## 11. QUALITY CONTRACT

A 4-layer learning experience built with this skill makes three guarantees:

**Recognition Guarantee:** A learner who completes all 4 layers will identify the concept operating in a CCP subsystem they have never studied — unprompted, without reference — 72 hours after completion.

**Contract Guarantee:** A learner who completes all 4 layers will correctly specify the Pydantic/DSPy contract for a CCP feature they have never seen described in the course.

**Transfer Guarantee:** A learner who completes all 4 layers will predict WHERE and WHY the concept appears in a novel CCP pipeline they have never encountered — because they've seen it from 6 angles and internalized the universal principle.

A polished, beautifully formatted lesson that cannot meet all three guarantees is a sophisticated failure. A sparse, text-only lesson that meets all three is a complete success. The architecture decides the outcome.
