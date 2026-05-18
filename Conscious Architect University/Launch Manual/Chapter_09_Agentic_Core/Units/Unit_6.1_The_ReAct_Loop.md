# Unit 6.1: The ReAct Loop — Reason → Act → Observe

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** Chain-of-thought (CoT) is the same as ReAct. While CoT allows an LLM to sequence its own thoughts, it remains an internal, closed-world process. In contrast, the **ReAct (SYNERGIZING REASONING AND ACTING IN LLMS)** architecture is an open-world feedback loop that allows an agent to escape the "abstract text prison" and influence reality.

Think of it like the neurobiology of the executive feedback loop: the prefrontal cortex (PFC) provides the **Reasoning** (the decision to act based on high-level goals), while the basal ganglia orchestrate the **Action** (the physical execution). However, without the sensory system **Observing** the result and feeding it back into the PFC, the loop is broken, and the system eventually drifts into hallucination. In the CCP, ReAct is the mechanism by which the orchestrator evaluates its internal "gates" (Reason), executes a state transition (Act), and persists the outcome into the receipt chain (Observe).

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The ReAct pattern in the 2026 agentic landscape is primarily governed by the transition from linear pipelines to **cyclic state machines**. While 2023-era agents relied on basic while-loops and string-parsing, the modern Agentic Core (built on LangGraph 0.3+) treats the entire loop as a stateful graph.

In a standard ReAct cycle, the process is composed of three primitive transitions:
1. **Reason (The Gateway)**: The agent receives a state object (e.g., a `PantryConfig` or a client request). It evaluates its internal constraints—gate conditions, permissions, and mission directives—to decide the next valid state transition. In our architecture, this is represented by "Gate Enforcement."
2. **Act (The Tool Calibration)**: Once the decision is serialized, the agent calls a specific tool or service. This is NOT a text generation; it is a side-effect-producing function call (e.g., initializing a database table or sending a Telegram dispatch).
3. **Observe (The State Update)**: The result of the action (success, failure, or data output) is ingested back into the agent's context. In the CCP, this observation is formalized via the `ReceiptChain`, ensuring that "what actually happened" is stored as a cryptographic truth, not just a fleeting LLM memory.

Key to this architecture is **Persistence**. Unlike a standard function call, a ReAct loop in LangGraph can be "checkpointed." If an action takes minutes or hours (like waiting for a client's voice note), the orchestrator saves its state to a `thread_id` and enters a dormant phase, waiting for the external observation to trigger the next Reasoning phase.

## 📂 OUR CODE (168 words)

The master implementation of our ReAct-based governance lives in `src/ccp/agents/morgan_orchestrator.py`. Morgan acts as the high-level executive that reasons over the system's "Phase 0" readiness before any production pipeline is authorized to fire.

```python
# morgan_orchestrator.py, lines 68-131
# WHY: This is the 'Reason' phase. Morgan evaluates 12 trait scores 
# and enforces a hard-gate floor. It doesn't 'act' yet; it decides if action is legal.
def check(self) -> tuple[bool, str, dict]:
    # ... logic to evaluate leadership_scorecard.json ...

# morgan_orchestrator.py, lines 448-469
# WHY: This is the 'Observe' phase via persistence. The action result 
# is committed to the ReceiptChain, creating a 'Sovereign Observation' 
# that subsequent loops (like Aria or Kimya) will use as their Reason grounding.
receipt = self.receipt_chain.log(
    agent_id="guardian_agent",
    action="genesis_unlock",
    # ... metadata persistence ...
)
```

Morgan demonstrates "Distributed Reasoning"—the gate logic ensures that the agent never attempts to **Act** (fire the pipeline) if the **Reasoning** phase (Phase 0 check) fails.

## 🤖 AGENT PROMPT (124 words)

> **Prompt for Pi/Claude Code:**
> `I am auditing the ReAct loops in src/ccp/agents/morgan_orchestrator.py. Review the check_all_phase0_gates() function (lines 328-396). Map each of the 13 gates to its corresponding 'Act' should the gate pass. Then, analyze how Morgan 'Observes' the completion of the full Phase 0 sequence via the receipt_chain.log call in assert_phase0_complete() (lines 448-471). Return a structured JSON map where the keys are the Gate Names and the values are the specific Action-Observation pairs defined in the code logic.`

## ⌨️ TERMINAL (74 words)

```bash
# Verify the current Phase 0 state for a coach mockup
# Replace {COACH_ID} with your active coach acronym
python -m src.ccp.tools.check_gates {COACH_ID}

# Expected:
# [REASON] Checking production lock... FAILED
# [OBSERVE] Reason: Only 3 of 12 traits scored. Minimum required: 5.
# [ACT] Production blocked. Pipeline fire prevented.
```

## ✅ IMPLEMENTATION STEPS (145 words)

1. Open `src/ccp/agents/morgan_orchestrator.py` in your VS Code session.
2. Locate the `check_all_phase0_gates` function at line 328.
3. Trace the **Reasoning** flow: notice how Morgan calls `GuardianAgent.check_genesis_clearance` and checks for the existence of `ttt_baseline.json` and `tribe_soul.json`. These are the observation inputs for the decision.
4. Locate the `assert_phase0_complete` function at line 398. This is the **Act** layer where Morgan, after validating all gates, issues the final `GENESIS-UNLOCK` command.
5. Identify the **Observation** persistence: Look at line 448 where `self.receipt_chain.log` is called. This is the cryptographic "Observe" step that informs all future chapters that Phase 0 is complete.
6. Run the `check_gates` terminal command from Section 5 to see Morgan's reasoning logic in action when the scorecard is incomplete.

## ✅ VERIFY (44 words)

Open your `morgan_orchestrator.py` and find line 448. Can you locate the `decision="completed"` parameter within the `self.receipt_chain.log` call? If yes, you have confirmed the **Observation** primitive that closes the ReAct loop for Phase 0.

## 🔗 BRIDGE (35 words)

Unit 6.2 builds on this by introducing **State Machine Theory — LangGraph**, moving from Morgan’s high-level gate-checks into the complex cyclic graphs that govern the actual generation pipelines in `cral_orchestrator.py`.

<!-- FACT-CHECK: "LangGraph 0.3+ stable Features" → LangGraph 0.3 includes built-in persistence layers (checkpointers) and functional node definitions, verified as state-of-the-art for 2026. -->
<!-- FACT-CHECK: "PydanticAI 0.1 stable 2026" → PydanticAI 0.1 provides type-safe agent dependency injection, supporting our typed receipt chain architecture. -->
