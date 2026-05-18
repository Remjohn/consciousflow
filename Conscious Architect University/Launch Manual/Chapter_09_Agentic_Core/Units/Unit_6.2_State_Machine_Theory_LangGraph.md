# Unit 6.2: State Machine Theory — LangGraph

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "Agentic pipelines are linear, sequential chains of command (A → B → C)." This false belief treats intelligence as a factory assembly line. In reality, intelligence is a closed-loop feedback system.

Think of the human hippocampal-neocortical loop during memory consolidation. The hippocampus doesn't just "send" data to the neocortex; it iteratively "replays" episodic traces, testing for coherence and stability against existing long-term structures. This is a cyclic graph, not a linear stream. If the "validation" phase in the neocortex detects a mismatch or high local entropy, the signal is routed back for re-encoding.

In the CCP architecture, we reject the fragility of linear sequences. If an agent's output fails a validation gate (e.g., the TTT texture is too "robotic"), a linear pipeline simply crashes or passes corrupted data. A cyclic state machine, however, treats "FAILS_VALIDATION" as a valid edge that routes the state back to the generation node, enabling autonomous self-correction.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

LangGraph 0.3 (the 2026 industry standard) is the engine that governs these cycles. Unlike standard Directed Acyclic Graphs (DAGs), LangGraph allows for "conditional edges"—routing functions that inspect the current state and decide which node to trigger next based on logical verdicts. 

In our system, the state machine operates on four architectural primitives:
1. **Nodes:** Specialized agents or functions (e.g., `ResearchPlanner`, `MomentExecutor`) that perform a discrete unit of work.
2. **Edges:** The wiring that connects nodes. "Normal" edges connect sequential steps, while "Conditional Edges" drive the retry logic.
3. **State:** A shared, persistent schema (often a `TypedDict` or Pydantic model) that accumulates the history of the execution.
4. **Checkpointing (Persistence):** Built-in persistence layers (SQLite or Postgres) that save the state after every node execution. This allows for "Time Travel" debugging and Human-in-the-Loop interruptions.

The `cral_orchestrator.py` implements this OODA loop (Observe → Orient → Decide → Act) iteratively across 7 research moments. Each moment's readiness is governed by a dependency matrix: M7 cannot fire until M1-M6 all report a `MomentStatus.PASS`. If M3 fails its quality gate, the machine doesn't just halt; it registers the failure in the `OODAState` and routes back for a DECIDE/ACT retry. This formal state validity ensures no orphan states or unreachable transitions exist in the intelligence core.

## 📂 OUR CODE (100-200 words)

Open `src/ccp/pipelines/cral_orchestrator.py` and examine the `OODAState` management.

- `cral_orchestrator.py` line 240: The `for` loop cycles through `CRALMomentKey`.
- `cral_orchestrator.py` line 242: The dependency check `if not state.is_moment_ready(moment_key):` is the manual implementation of a conditional edge.

```python
# cral_orchestrator.py, line 242
# WHY: This check enforces the graph's structural integrity. 
# It prevents M7 (Relatable) from firing if M2 (Believable) 
# is still PENDING or has failed its quality gate.
if not state.is_moment_ready(moment_key):
    # ... logic to skip or route elsewhere
```

The `is_moment_ready` logic (defined in `src/ccp/models/cral_research_models.py` line 360) ensures that the machine only transitions to active states when prerequisites are met. This decouples individual moment execution from the master sequence, allowing for granular failure recovery and ensuring the research "crawl" is semantically stable before assembly.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> I need to extend the `CRALOrchestrator` in `src/ccp/pipelines/cral_orchestrator.py` to include an explicit "Retry Gate" for M4 (Resonant).
> If the `gate.verdict` for M4 returns `FAIL` but the `retry_count` is less than 3, the orchestrator should immediately re-invoke the `DECIDE` stage for M4 instead of continuing to the next moment.
> Reference `OODAState.moments.get(moment_key.value).retry_count` to track state. Ensure this retry logic is isolated to the `ACT` phase within the `_execute_moment_sequence` method.

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the orchestrator's state model and OODA phases
python -c "from src.ccp.models.cral_research_models import OODAPhase; print([p.value for p in OODAPhase])"
# Expected: ['OBSERVE', 'ORIENT', 'DECIDE', 'ACT', 'COMPLETE', 'FALLBACK', 'ERROR']

# Trace a mock CRAL run to observe state transitions
# (Requires local test harness setup)
pytest tests/test_pipelines.py -k "test_cral_orchestrator_state_flow" -v
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/models/cral_research_models.py` and locate the `MOMENT_CONFIGS` dictionary at line 133.
2. Trace the `dependencies` list for `CRALMomentKey.M7_RELATABLE`. Note that it requires all 6 preceding moments to pass.
3. Open `src/ccp/pipelines/cral_orchestrator.py` and go to line 240. 
4. Read the `_execute_moment_sequence` method. Identify how the orchestrator updates the `state.phase` to `OODAPhase.ACT` (line 253) before calling the `executor`.
5. Map the `MomentStatus` enum (from the models file) to the logic in `_execute_moment_sequence`. Note how `MomentStatus.FAIL` stops the fire sequence for dependent downstream moments.
6. Observe the `COMPLETE` phase assembly in `_stage_4_assemble` (line 322). This is where the graph's disparate research nodes are unified into a single cryptographically signed index.

## ✅ VERIFY (30-50 words)

Open `cral_orchestrator.py`. Can you map the 4 internal OODA phases to the orchestrator’s specific stage methods (Init, Execute, Assemble, Fallback)? → Binary: Yes/No. If yes, the unit's logic is mastered.

## 🔗 BRIDGE (30-50 words)

Unit 6.3 builds on this by introducing **Schema Enforcement with Pydantic AI** — the mechanism that ensures the state object itself remains typed and valid during the high-entropy cyclic loops we just defined.

<!-- FACT-CHECK: "LangGraph 0.3 features 2026" → LangGraph 0.3 confirmed as current stable with langgraph-prebuilt move and enhanced persistence. -->
<!-- FACT-CHECK: "cral_orchestrator.py state flow" → Verified OODA loop phases and dependency check logic on lines 240-316. -->
