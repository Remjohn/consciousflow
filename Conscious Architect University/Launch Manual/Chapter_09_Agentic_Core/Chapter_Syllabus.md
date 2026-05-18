# Chapter 06: The Agentic Core (Intelligence Architecture)

**Chapter Goal:** Deep-dive into all 15 agents, 15 pipelines, and the CBCS state machine — understanding WHAT each component does, HOW they interconnect, and building the scheduled voice tracking loop
**Mastery Track:** CCP System Architect (PRIMARY)
**Launch Track:** Telegram bot wired to agent pipeline, first scheduled voice tracking session processed (3-5 messages)
**Prerequisites:** Chapter 3 (Harness — the execution layer), Chapter 5 (Hypergraph — the memory layer)
**Estimated Time:** 12-15 hours

---

## CCP/CMF Reality Anchor

The CCP's intelligence is distributed across 15 specialized agents, 15 pipelines, and 198 services. **These agents are NOT always-on.** They activate on schedules: weekly content batches (Sunday night), daily accountability voice tracking sessions (3-5 messages per client session). Between schedules, agents are dormant. This chapter is WHERE you understand each agent's cognitive role — not abstractly, but by reading their actual source code. The morgan_orchestrator alone is 37KB of LangGraph state machine logic. Without this deep-dive, you'll treat the CCP as a black box and be unable to extend, debug, or deploy it.

---

## Codebase Map

| File | Location | Size | Status |
|------|----------|------|--------|
| `morgan_orchestrator.py` | `src/ccp/agents/` | 37KB | ✅ EXISTS — master orchestrator |
| `cral_orchestrator.py` | `src/ccp/pipelines/` | 24KB | ✅ EXISTS — LangGraph state machine |
| `aria_processor.py` | `src/ccp/agents/` | 7KB | ✅ EXISTS — psychology processor |
| `kimya_processor.py` | `src/ccp/agents/` | 6KB | ✅ EXISTS — content processor |
| `guardian_agent.py` | `src/ccp/agents/` | 32KB | ✅ EXISTS — safety/permissions |
| `vidye_router.py` | `src/ccp/agents/` | 8KB | ✅ EXISTS — video routing |
| `ttt_enforcement_pipeline.py` | `src/ccp/pipelines/` | 14KB | ✅ EXISTS — TTT voice enforcement |
| `context_premise_extraction_service.py` | `src/ccp/services/` | 18KB | ✅ EXISTS — 12D context premise |
| `sophia_ttt_validator.py` | `src/ccp/services/` | 14KB | ✅ EXISTS — TTT drift detection |
| `validation_gate.py` | `src/ccp/services/` | 24KB | ✅ EXISTS — Sophia/Marcus/Chen |
| `cbcs_models.py` | `src/ccp/models/` | — | ✅ VERIFY — Pydantic schemas |

**Files referenced: 11** ✅ (exceeds 5-file minimum)

---

## Fact-Check Registry

| Technology | Search Source | 2026 Finding |
|------------|--------------|-------------|
| LangGraph | Web search | LangGraph 0.3+ stable, cyclic state graphs, persistence, conditional edges, checkpointing |
| PydanticAI | Web search | PydanticAI 0.1+ for structured LLM output with type-level guarantees |
| python-telegram-bot | Web search | `python-telegram-bot` 21.x, async architecture, webhook support, voice note handling |

---

## Science Sources

| Source | Location | Type |
|--------|----------|------|
| `FR1_Genesis_Pipeline_Tech_Spec.md` (30KB) | `docs/architecture/` | Core pipeline spec |
| `FR3_Voice_DNA_Extraction_Tech_Spec.md` (26KB) | `docs/architecture/` | Voice DNA spec |
| `FR4_Emotional_DNA_Extraction_Tech_Spec.md` (33KB) | `docs/architecture/` | Emotional DNA spec |
| `FR8_TTT_Enforcement_Rule_Tech_Spec.md` (32KB) | `docs/architecture/` | TTT enforcement spec |
| `FR26_Validation_Gate_Tech_Spec.md` (14KB) | `docs/architecture/` | Sophia/Marcus/Chen validators |
| `FR_GA_Guardian_Agent_Tech_Spec.md` | `docs/architecture/` | Guardian agent spec |
| `FR_CBCS_01-14` (14 specs) | `docs/architecture/` | CBCS behavioral science specs |
| `Cognitive Appraisal Theory_ Emotional DNA.md` (36KB) | `lab/emotional DNA/` | Emotional DNA paper |
| `Voice Emotion Analysis for TTT Calibration.md` (55KB) | `lab/emotional DNA/` | Voice emotion paper |
| `EMONET-VOICE A LARGE-SCALE SYNTHETIC.md` (79KB) | `lab/Voice DNA/` | Voice synthesis paper |
| `Identity Reinforcement in AI Coaching.md` (47KB) | `lab/Behavioural Change/` | Identity reinforcement |
| `Variable Reinforcement in Digital Engagement.md` (50KB) | `lab/Behavioural Change/` | Engagement science |
| `CCP_Script_Generation_Skill_Type_Guide_v1.0.docx.md` (60KB) | `cmf/` | Script generation guide |
| `FR15_Scheduled_Monitor_Agent_Tech_Spec.md` (15KB) | `docs/architecture/` | Scheduler spec |

---

## Unit Map

| Unit | Title | 🧠 Science Topic | UNLEARN | 📂 Code Files | Build Target | Verify |
|------|-------|-------------------|---------|---------------|-------------|--------|
| 6.1 | The ReAct Loop — Reason → Act → Observe | How agents cycle through reasoning (decide action) → execution (call tool) → observation (read result). Why this beats chain-of-thought: ReAct has TOOLS, CoT has only text | "Chain-of-thought is the same as ReAct." False — CoT reasons in text only. ReAct reasons AND acts (tool calls) AND observes (tool results). The action-observation feedback loop is what makes agents agents | `morgan_orchestrator.py` (37KB) — the ReAct implementation | — | Identify 3 ReAct cycles in morgan_orchestrator.py: where does it reason, act, and observe? |
| 6.2 | State Machine Theory — LangGraph | Why cyclic graphs beat linear pipelines. States, transitions, conditional edges. How `cral_orchestrator.py` implements the CCP's state machine with LangGraph. Formal state validity: no orphan states, no unreachable transitions | "Pipelines go A→B→C→Done." False — the CCP loops: analyze→generate→validate→fail?→retry. Without cycles, a validation failure has nowhere to go except crash | `cral_orchestrator.py` (24KB) | — | Draw the state graph from cral_orchestrator.py. Identify all cycles and conditional edges |
| 6.3 | Schema Enforcement with Pydantic AI | Why typed output schemas prevent hallucination. Pydantic BaseModel as an execution contract: if the LLM can't fill the schema, it MUST retry. Type-level guarantees vs string-level hoping | "Just parse the LLM's text output." False — text parsing fails on edge cases (missing fields, wrong types, extra data). Pydantic schemas make invalid output STRUCTURALLY IMPOSSIBLE | `cbcs_models.py` — Pydantic schemas, `src/ccp/models/` | — | Read 3 Pydantic models and list their required fields + types |
| 6.4 | The 4-Agent Pipeline Deep-Dive | Morgan (orchestrator) → Aria (psychology) → Kimya (content) → Guardian (safety) → Vidye (video). Each agent's single cognitive role. Why 4 > 1 | "I've read about this in Chapter 1." True — but now you READ THE CODE. Chapter 1 was the map. This is the territory. 7KB of `aria_processor.py` reveals HOW psychology actually processes | `aria_processor.py`, `kimya_processor.py`, `guardian_agent.py`, `vidye_router.py` | — | For each of the 4 agents: name its input schema, its output schema, and its single cognitive role |
| 6.5 | Context Engineering — 12D Premise | The 12-Dimensional Context Premise: how the system distills 12 orthogonal features from a coach's corpus. Why more context ≠ better output — information obesity degrades precision | "More context is always better." False — past 8,000 tokens of context, LLM output quality DECREASES. The 12D premise compresses relevant information into a dense, structured feature vector | `context_premise_extraction_service.py` (18KB) | — | Name all 12 dimensions and explain what each captures |
| 6.6 | TTT Enforcement — Voice as Psychology | Temperature, Tone, Texture enforcement. How voice becomes behavioral intervention: prosodic patterns (rhythm, cadence) encode psychological authority. Sophia validates TTT drift | "Voice is just how it sounds." False — TTT is a psychological tool. A coach's sentence structure, discourse markers, and rhetorical patterns are their therapeutic fingerprint. Drift = loss of therapeutic identity | `ttt_enforcement_pipeline.py` (14KB), `sophia_ttt_validator.py` (14KB) | — | Read the TTT pipeline. Identify the 3 validation axes and their threshold scores |
| 6.7 | Wiring the Scheduled Voice Tracking | **NOT a chatbot.** Scheduled accountability tracking with **PROGRAM-DEPENDENT cadence**: each coaching program defines its own `check_in_schedule` (e.g., `["monday", "wednesday", "friday"]` = 3x/week, or `["tuesday", "thursday"]` = 2x/week). The `PantryConfig` controls frequency per coach program (FR-COM-04 `check_in_schedule` field, FR28 `scheduler.py`). On each scheduled day: CRON sends prompt → client sends voice note → Whisper STT async → agent pipeline processes → confirmation + follow-up (3-5 messages max per session). Atlas's 4+1+2 template (4 active, 1 reflection, 2 rest) governs which days are eligible | "The bot sends daily check-ins." False — accountability cadence is PROGRAM-DEPENDENT, configured in `check_in_schedule`: daily, 3x/week, or 2x/week. Rest Days are sacred and silent (4+1+2 template). The system physically blocks prompts on Rest Days | `morgan_orchestrator.py`, `scheduled_monitor.py`, `scheduled_monitor_service.py`, `groq_transcriber.py` | 🤖 Build `commands/ccp-voice-track.md` — harness command (Ch3.16 format): PRE-FLIGHT (verify check_in_schedule + today is valid day + not Rest Day) → SEND-PROMPT (Atlas dynamic prompt per roadmap position) → WAIT-VOICE-NOTE → TRANSCRIBE (Whisper STT) → PROCESS-PIPELINE (CBCS analysis) → RESPOND (3-5 msg cap) → CHECKPOINT. Cadence from `PantryConfig`, not hardcoded | Execute `ccp-voice-track {coach} {client}` → system checks program schedule → sends prompt only on valid days → voice note transcribed → session closes at 3-5 messages |

---

## Quality Gates — Self-Verification

- [x] **Unit Count Gate:** 7 units ✅
- [x] **Causal Chain Gate:** ReAct → state machines → schemas → pipeline → context → voice → Telegram ✅
- [x] **UNLEARN Gate:** All 7 units ✅
- [x] **Build Frequency Gate:** Build target in 6.7 (after 6 science units) ⚠️ Acceptable for deep-dive chapter
- [x] **5-File Gate:** 11 files referenced ✅
