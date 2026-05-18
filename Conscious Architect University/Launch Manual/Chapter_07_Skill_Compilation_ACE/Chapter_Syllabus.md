# Chapter 07 Syllabus — Skill Compilation & Context Engineering

**Chapter Position:** Part II: The Agentic Orchestration Layer
**Prerequisite:** Chapter 06 (Sovereign Agentic Harness)
**Unlocks:** Chapter 08 (Orchestration: DAG Teams & Hypergraphs)
**Primary Research Sources:** SkVM.md · SkillOrchestra.md · Agentic Context Engineering.md · My Pi Agent Teams.md

---

## Chapter Objective

The operator will implement the intelligence layer that sits *inside* the harness: dynamic skill compilation, Pareto-optimal agent routing, and self-evolving context playbooks. This chapter transforms the harness from a static pipeline into a **learning orchestration system** that gets sharper with every execution cycle.

**Governing Principle:** A harness without compiled skills is a racing car with deflated tires. Skills are the fuel. Routing is the transmission. Context Engineering is the driver who keeps improving.

---

## Unit Index

### Unit 7.1 — SkVM: Skills as Code, LLMs as Processors
**Source:** SkVM.md
**Core Teaching:**
- The core insight: raw skill text injected into a prompt behaves inconsistently across different models. The same "coaching skill" executed by Qwen-3.5 vs. Gemma-4 produces radically different outputs.
- **SkVM treats skills as code and LLMs as heterogeneous processors.** The skill must be compiled to match the target processor's capability profile.
- Analysis of 118,000 skills revealed 26 primitive capabilities — each model-harness pair supports a distinct subset
- AOT Compilation: before the task starts, the Orchestrator determines *which* capabilities the skill requires and *which* the target NIM supports — then compiles a capability-matched version

**Deliverable:** Capability profile matrix for our CCP NIMs (Qwen-3.5 vs. Gemma-4 vs. Kimi-K2)

---

### Unit 7.2 — AOT Capability Profiling & JIT Skill Solidification
**Source:** SkVM.md
**Core Teaching:**
- **AOT Phase:** Capability-based compilation, environment binding, concurrency extraction — all executed before the agent receives the task
- **JIT Phase:** Runtime — the skill is executed, token consumption and failure patterns are monitored. If performance degrades, SkVM triggers adaptive recompilation on the fly.
- **CCP Application:** When the JIT Skill Compiler dispatches a "persuasion script" skill to Qwen-3.5, it first compiles the skill down to: only the primitives Qwen-3.5 reliably supports. This eliminates the hallucinated capability gaps that caused our earlier pipeline failures.
- Token reduction: compiled skills use 40-60% fewer tokens than raw skill text

**Deliverable:** JIT Skill Compiler integration spec for `jit_skill_compiler.py`

---

### Unit 7.3 — SkillOrchestra: Pareto-Optimal Agent Routing
**Source:** SkillOrchestra.md
**Core Teaching:**
- The failure mode of existing routers: input-level routers make coarse query-level decisions that ignore how task requirements evolve mid-execution
- The RL router failure: routing collapse — the RL agent learns to always call the strongest (most expensive) option regardless of task complexity
- **SkillOrchestra solution:** Learns fine-grained skills from execution experience, models agent-specific competence *and cost* under those skills, then selects the Pareto-optimal agent at deployment — 22.5% performance improvement at 700× lower learning cost than RL routers
- Domain Boundaries: strict enforcement that no agent operates outside its validated competence zone

**Deliverable:** CCP Skill Handbook definition (which agent handles which skill domain with which cost tier)

---

### Unit 7.4 — Agentic Context Engineering: The Generator-Reflector-Curator Triad
**Source:** Agentic Context Engineering.md
**Core Teaching:**
- **The Problem:** Monolithic fixed system prompts breed "Context Collapse": iterative rewrites erode domain insights over time. "Brevity Bias": the model drops critical nuance to produce concise summaries.
- **ACE Framework:**
  - **Generator:** Proposes new context additions based on task performance
  - **Reflector:** Audits the proposed addition for accuracy and relevance
  - **Curator:** Applies incremental delta updates — never overwrites the full context
- Contexts become evolving playbooks that accumulate, refine, and organize strategies without catastrophic forgetting

**Deliverable:** ACE integration spec for the CCP Orchestrator's system prompt evolution pipeline

---

### Unit 7.5 — Preventing Context Collapse via Delta-Update Playbooks
**Source:** Agentic Context Engineering.md
**Core Teaching:**
- Delta-update format: `[ADD: new_insight]`, `[REFINE: existing_section → updated_version]`, `[REMOVE: obsolete_rule]`
- Structured, incremental updates that preserve the full knowledge graph while adding new entries
- **CCP Application:** The Voice DNA prompt for each coach persona is managed as an ACE playbook — never overwritten, only delta-updated. After 50 coaching sessions, the prompt has evolved to perfectly capture the coach's edge cases without losing any foundational constraints.
- Version tagging: every delta carries a timestamp and session ID for full auditability

**Deliverable:** ACE playbook format template for the CCP Coach Voice DNA system prompt

---

### Unit 7.6 — Command File Anatomy: The Harness File Format
**Source:** My Pi Agent Teams.md · I Hated Every Coding Agent.md
**Core Teaching:**
- The CCP command file format: structured Markdown that the harness parses as executable instructions
- Anatomy of a command file: `# MISSION`, `## CONTEXT`, `## CONSTRAINTS`, `## TOOLS`, `## OUTPUT_SCHEMA`
- How the harness reads a command file and constructs the DAG from its structure
- The 7 CCP command files: `ccp-health-check`, `ccp-onboard`, `ccp-voice-track`, `ccp-onboard-client`, `ccp-deploy`, `ccp-schedule` + Pipeline DAG
- Live practice: the operator writes and executes a custom command file against the local harness

**Deliverable:** All 7 CCP command files authored and validated against the harness parser

---

## Chapter Exit Gate

Practical execution:
1. Compile a "coaching persuasion" skill for Qwen-3.5 using SkVM capability profiles
2. Route 3 different task types through SkillOrchestra and verify Pareto-optimal agent selection
3. Run 5 ACE delta-update cycles on a Voice DNA playbook and inspect the evolution log
4. Write and execute a new custom harness command file end-to-end
