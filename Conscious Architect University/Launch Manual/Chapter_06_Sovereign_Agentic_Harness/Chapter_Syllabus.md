# Chapter 06 Syllabus — The Sovereign Agentic Harness

**Chapter Position:** Part II: The Agentic Orchestration Layer
**Prerequisite:** Chapter 05 (AWS Foundations + Nvidia NIM)
**Unlocks:** Chapter 07 (Skill Compilation & Context Engineering)
**Primary Research Sources:** SemaClaw.md · I Hated Every Coding Agent (Pi / Mario Zechner) · My Pi Agent Teams.md · One Agent Is NOT ENOUGH.md · Limits of n-gram Style Control (Logit Bias) · The Rogue Scalpel

---

## Chapter Objective

The operator will build and configure the complete Sovereign Agentic Harness — the deterministic infrastructure layer that sits between the operator and the model. This is not about prompt engineering. This chapter is about **harness engineering**: the DAG-based runtime, the 4-layer plugin architecture, and the constraint walls that guarantee every agent output is predictable, auditable, and exploit-proof.

**Governing Principle:** Without the harness, there are no agents. There is only chaos dressed in API calls.

---

## Unit Index

### Unit 6.1 — SemaClaw: The DAG Teams Orchestration Blueprint
**Source:** SemaClaw.md
**Core Teaching:**
- The paradigm shift: from Prompt Engineering → Context Engineering → **Harness Engineering**
- The problem with Swarms: agents hand off to each other without a dependency graph, causing hallucination cascades
- The problem with rigid LangGraphs: every path must be hardcoded, killing flexibility
- **DAG Teams solution:** The LLM Orchestrator dynamically infers a Directed Acyclic Graph for the task. A deterministic executor then runs that graph. The best of both worlds.
- PermissionBridge safety: explicit capability scoping prevents any agent from exceeding its mandated zone

**Deliverable:** Annotated SemaClaw DAG diagram for a CCP script generation task

---

### Unit 6.2 — The 4-Layer Plugin Architecture: MCP, Subagents, Skills, Hooks
**Source:** SemaClaw.md
**Core Teaching:**
- **Layer 1 — MCP Tools (Action):** What the agent can *do* — API calls, file writes, Telegram sends
- **Layer 2 — Subagents (Reasoning):** Specialist agents spawned to handle bounded reasoning tasks
- **Layer 3 — Skills (Context):** Compiled Skill Handbooks loaded per-task (see Ch 07 SkVM)
- **Layer 4 — Hooks (Execution Control):** Pre/post execution interceptors — the heartbeat of observability
- How Hooks power JSONL event streaming: every agent action is logged as `{from, to, message, timestamp}`

**Deliverable:** CCP 4-layer plugin map (which CCP agent maps to which layer)

---

### Unit 6.3 — The SOUL.md Persona System & 3-Tier Memory
**Source:** SemaClaw.md
**Core Teaching:**
- **Working Memory:** The active context window — the current task, tool outputs, conversation history
- **RAG Memory:** Retrieved long-term knowledge from the Markdown Wiki / Neo4j graph
- **SOUL.md:** The persistent persona file. Loaded at agent initialization. Defines voice, mental models, constraints. Never in the context window — injected as a steering vector via Ch 03 techniques.
- Why SOUL.md replaces monolithic identity prompts: it is structured, versioned, and hot-swappable

**Deliverable:** CCP SOUL.md template for the Orchestrator, Critic, and Voice agents

---

### Unit 6.4 — Deterministic TUI Design (The Pi/Mario Zechner Philosophy)
**Source:** I Hated Every Coding Agent, So I Built My Own (Pi / Mario Zechner) · My Pi Agent Teams.md
**Core Teaching:**
- Rejection of "spaceship" bloated UIs. The operator must see exactly what is happening at all times.
- Sub-millisecond, non-flickering terminal rendering
- Pinned "Mission Statement" widget: the operator's current goal always visible
- The Three-Tier visualization: Orchestrator → Leads → Workers rendered as a live delegation tree
- JSONL Event Stream split-pane: real-time `from/to/message` agent communication visible to the operator

**Deliverable:** CCP Harness UI wireframe (TUI layout spec for the operator console)

---

### Unit 6.5 — Logit Bias as Negative Anti-Draft Mask
**Source:** Limits of n-gram Style Control for LLMs via Logit-Space Injection
**Core Teaching:**
- **The Rule:** Logit Bias is ONLY for negative constraints. Never for style induction (LoRA handles that).
- Positive logit injection is fragile: at λ > 0.1 it collapses into incoherent text
- **CCP Anti-Draft Mask:** Apply `logit_bias = -100` to the token IDs for "apologize", "sorry", "As an AI", "I cannot", "It's important to", "please note" — the entire vocabulary of soulless AI behavior
- How to extract token IDs for a specific vocabulary set from the Qwen-3.5 tokenizer

**Deliverable:** Anti-draft Logit Bias mask JSON file for the CCP FastAPI transit layer

---

### Unit 6.6 — Constrained Sampling: JSON & Regex Walls for DAG Stability
**Source:** SemaClaw.md (DAG execution contracts)
**Core Teaching:**
- Why constrained sampling (via Outlines or Guidance library) is mandatory for software-to-software communication
- When an agent outputs a RationalRewards critique or a Conviction Density score, the downstream code **requires** valid JSON — not "Here is your JSON..."
- Grammar-constrained generation: masking all invalid tokens at each decoding step so the model literally cannot break format
- Integration pattern: wrapping vLLM/NIM with Outlines for structured output on all Critic and Evaluator agents

**Deliverable:** Constrained output schema for the PARROT Critic agent (JSON schema definition)

---

### Unit 6.7 — Rogue Scalpel Defense: Scrubbing Gateway Architecture
**Source:** The Rogue Scalpel: Activation Steering Compromises LLM Safety
**Core Teaching:**
- The attack vector: a malicious Telegram user can input semantic strings that mathematically negate applied CCV steering vectors, causing guardrail collapse
- **The Defense:** A semantic scrubbing gateway in FastAPI that checks incoming WebSocket payloads against a known anti-vector vocabulary blocklist before they reach the model
- Rate limiting + entropy scanning: detect high-entropy injection attempts before they hit the latent space

**Deliverable:** FastAPI scrubbing middleware spec (`anti_vector_scrub.py`)

---

## Chapter Exit Gate

The operator must deploy a functional local harness skeleton:
1. A working DAG definition for a 3-agent pipeline (Orchestrator → Critic → Writer)
2. JSONL event stream logging with hook-based `{from, to, message}` format
3. Anti-draft Logit Bias mask applied to the vLLM/NIM endpoint
4. Constrained JSON output schema enforced on the Critic agent response
