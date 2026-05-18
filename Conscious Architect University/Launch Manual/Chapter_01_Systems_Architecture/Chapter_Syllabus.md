# Chapter 01: Systems Architecture (The Mental Models)

**Chapter Goal:** Trace the full CCP + CMF architecture from first principles, map every major subsystem, and identify every gap that prevents launch
**Mastery Track:** CCP System Architect
**Launch Track:** Nothing deployed — pure comprehension. But you now see the WHOLE system and its SCHEDULE-BASED operational model
**Prerequisites:** None — this is where it starts
**Estimated Time:** 6-8 hours

---

## CCP/CMF Reality Anchor

You govern a 76-agent cognitive-behavioral intelligence matrix (the CCP) and its autonomous programmatic video factory (the CMF). Together they serve transformation coaches by automating client psychology analysis, content generation, and video production. **Critically, the CCP is NOT a 24/7 chatbot.** It operates on schedules: weekly content batches, daily accountability voice tracking (3-5 messages per session), and on-demand dashboard access. GPU instances spin up for batch processing then spin down. Only the dashboards (Video Editor + AFFiNE) and API endpoints are always-on. This chapter is the satellite view — before you touch a single line of code, you must understand WHAT you're building, WHY each piece exists, HOW it operates operationally, and WHERE the structural gaps are.

---

## Codebase Map

| File | Location | Size | Status |
|------|----------|------|--------|
| `morgan_orchestrator.py` | `src/ccp/agents/` | 37KB | ✅ EXISTS |
| `cral_orchestrator.py` | `src/ccp/pipelines/` | 24KB | ✅ EXISTS |
| `pipeline_commander.py` | `cmf/apps/cmf-assembler/` | 24KB | ✅ EXISTS |
| `guardian_agent.py` | `src/ccp/agents/` | 32KB | ✅ EXISTS |
| `ttt_enforcement_pipeline.py` | `src/ccp/pipelines/` | 14KB | ✅ EXISTS |
| `context_premise_extraction_service.py` | `src/ccp/services/` | 18KB | ✅ EXISTS |
| `voice_dna_pipeline.py` | `src/ccp/pipelines/` | 28KB | ✅ EXISTS |
| `failure_prevention_gates.py` | `src/ccp/services/` | 22KB | ✅ EXISTS |
| `affine_workspace_provisioner.py` | `src/ccp/services/` | 32KB | ✅ EXISTS |
| `scheduled_monitor.py` | `src/ccp/agents/` | 17KB | ✅ EXISTS |

**Files referenced: 10** ✅

---

## Science Sources

| Source | Location | Type |
|--------|----------|------|
| `prd.md` (236KB) | `docs/prd/` | Master PRD |
| `CCP_Technical_Architecture.md` (14KB) | `docs/architecture/` | Architecture spec |
| `CCP_System_Documentation.md` (24KB) | `docs/` | System documentation |
| `Infrastructure_AWS_NIM_Deployment_Spec.md` (35KB) | `docs/architecture/` | Deployment architecture |
| `Final_Architecture_Stress_Test_Documentation.md` (45KB) | `docs/architecture/` | Stress test results |
| `CMF_Pipeline_Documentation.md` (29KB) | `cmf/` | CMF pipeline spec |
| `PROMPT_Spec_Build.md` (133KB) | `docs/architecture/` | Master build specification |
| `FR15_Scheduled_Monitor_Agent_Tech_Spec.md` (15KB) | `docs/architecture/` | Scheduler architecture |

---

## Fact-Check Registry

| Technology | Search Source | 2026 Finding |
|------------|--------------|-------------|
| LangGraph | Web search | LangGraph 0.3+ stable, cyclic state graphs, conditional edges, persistence |
| Remotion | Web search | Remotion 4.x stable, React-to-video, `@remotion/player` for browser preview |
| Neo4j | Web search | Neo4j 5.x, supports hypergraph-like patterns via multi-relationship queries |
| AFFiNE | Web search | AFFiNE 0.19+, open-source, CRDT-native, BlockSuite editor framework |

---

## Unit Map

| Unit | Title | 🧠 Science Topic | UNLEARN | 📂 Code Files | 📄 Science Sources | Build Target | Verify |
|------|-------|-------------------|---------|---------------|-------------------|-------------|--------|
| 1.1 | Systems Thinking & Feedback Loops | **Systems Thinking** (Meadows): Feedback loops (reinforcing vs balancing), emergence, leverage points. The CCP as a complex adaptive system where client behavioral data feeds back into content generation | "The CCP is a linear pipeline." False — it's a cyclic system where outputs (client responses) feed back into inputs (next-session content) | `morgan_orchestrator.py`, `cral_orchestrator.py` | `prd.md` §System Overview, `CCP_Technical_Architecture.md` | — | Draw the 3 major feedback loops in the CCP on paper |
| 1.2 | First Principles — The 4 Primitives | **First Principles Thinking**: Decompose the CCP to its irreducible primitives — Voice (TTT), State (CBCS), Identity (Context Premise), Delivery (CMF). Everything else is composition of these 4 | "You need to understand all 198 services." False — you need 4 primitives. The 198 services implement compositions of Voice, State, Identity, and Delivery | `ttt_enforcement_pipeline.py`, `context_premise_extraction_service.py`, `voice_dna_pipeline.py` | `CCP_System_Documentation.md`, `FR8_TTT_Enforcement_Rule_Tech_Spec.md`, `FR29_Context_Premise_Extraction_Tech_Spec.md` | — | Name the 4 primitives and identify which services implement each |
| 1.3 | The CCP Architecture Deep-Dive | The 4-agent pipeline (Morgan→Aria→Kimya→Guardian→Vidye), CBCS behavioral engine, 15 pipelines, why specialization beats generalization. The scheduled operational model: batch processing, NOT 24/7 | "The CCP runs 24/7 like a chatbot." False — agents activate on SCHEDULES (weekly batches, daily voice tracking of 3-5 messages per session). GPUs spin up, process, spin down | `morgan_orchestrator.py` (37KB), `guardian_agent.py` (32KB), `scheduled_monitor.py` (17KB), all 15 agents | `CCP_Technical_Architecture.md`, `FR15_Scheduled_Monitor_Agent_Tech_Spec.md`, `prd.md` §Operational Model | — | Trace a user voice note through all 4 agents. Describe WHEN this flow activates (schedule, not always-on) |
| 1.4 | The CMF Architecture Deep-Dive | The 3-phase video pipeline (Audio→Visual→Assembly), 9 modules, 13-arc routing, Pipeline Commander as 16-state machine, 480 tests. Batch production mode: content generated weekly, NOT per-request | "Video is rendered in one pass." False — the CMF decomposes video into 3 independent phases that can fail, checkpoint, and retry independently. Content batches run weekly | `CMF_Pipeline_Documentation.md`, `pipeline_commander.py`, `audio_engine.py`, `beat_cluster_parser.py` | `CMF_Pipeline_Documentation.md` (29KB), `PROMPT_Spec_Build.md` §CMF Architecture, `docs/prd/prd.md` §FR-VID | — | Name all 3 phases, the entry module, the 3 constraint gates, and the batch schedule |
| 1.5 | The Infrastructure Map | What runs WHERE: AWS (compute), Nvidia NIM (GPU inference — ON-DEMAND), Supabase (relational — always-on), Neo4j (graph — always-on), AFFiNE (dashboard — always-on), Telegram (delivery — webhook). The sovereignty principle: own your compute | "Everything runs 24/7 on expensive GPUs." False — only dashboards and databases run persistently. GPU instances spin up for scheduled batches then terminate. Telegram uses webhooks (serverless) | `affine_workspace_provisioner.py`, `failure_prevention_gates.py`, `cmf-docker/` | `Infrastructure_AWS_NIM_Deployment_Spec.md` (35KB), `Final_Architecture_Stress_Test_Documentation.md` | — | Draw the infrastructure map: label persistent (always-on) vs scheduled (batch-only) services |
| 1.6 | Gap Analysis — What's Missing | Audit every subsystem: EXISTS (code), SPEC'd (tech spec but no code), MISSING (neither). Map every gap to a Launch Manual chapter. Identify the 5 most critical build targets for launch | "The codebase is ready to launch." False — 198 services exist but lack production wiring: Docker Compose, IAM, S3 buckets, monitoring, billing, CRON schedulers | All files from 1.1-1.5 + `docs/architecture/` full spec list (148 files) | `Final_Architecture_Stress_Test_Documentation.md`, `prd.md` | — | List 5 specific gaps and which chapter addresses each |

---

## Quality Gates — Self-Verification

- [x] **Unit Count Gate:** 6 units ✅
- [x] **Causal Chain Gate:** Systems thinking → primitives → CCP → CMF → infra → gaps ✅
- [x] **UNLEARN Gate:** All 6 units ✅ (including schedule-based corrections in 1.3, 1.4, 1.5)
- [x] **Code Mapping Gate:** 10 files referenced ✅
- [x] **Science Sources Gate:** 8 documents mapped ✅
- [x] **Schedule-Based Gate:** Units 1.3, 1.4, 1.5 correctly reflect batch operational model ✅
- [x] **5-File Gate:** 10 codebase + 8 science sources ✅
