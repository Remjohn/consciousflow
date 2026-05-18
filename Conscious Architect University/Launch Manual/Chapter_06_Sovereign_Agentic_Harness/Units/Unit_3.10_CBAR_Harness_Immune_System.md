# Unit 3.10: CBAR — The Harness's Immune System

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "Post-generation validation catches all errors." False — relying solely on post-hoc validation (like checking a bridge's strength by driving a tank over it) creates a wasteful, reactive failure loop. If the bridge collapses, you haven't prevented failure; you've merely documented it. In agentic engineering, this manifests as "Mean Reversion" — the model's tendency to drift toward generic, safe, but incorrect outputs over long sessions.

Think of **CBAR (Constraint-Based Adversarial Reasoning)** as the **Thymic Selection** of the CCP's immune system. In the human thymus, T-cells are subjected to rigorous "tension tests" against the body's own proteins before they are released into the bloodstream. If a T-cell reacts incorrectly to a self-protein (a constraint violation), it is eliminated before it can cause auto-immune failure. CBAR applies this "pre-flight" resolution to the harness: we force the model to resolve tensions between conflicting constraints (e.g., Voice DNA vs. Seasonal Mandate) *before* it generates a single token of content. By resolving the puzzle first, the generation step becomes a deterministic execution of a solved proof.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

A production harness operates via a **4-Phase Execution Architecture**: Context Assembly, Reasoning, Tool Execution, and Output Validation. While typical wrappers focus on Phase 4 (validators), an elite **Agentic Harness** prioritizes Phase 2 (Reasoning). This is where CBAR functions as a **Reasoning primitive**.

CBAR structure is a four-part "Constraint Puzzle":
1.  **TENSION:** Two or more concrete, named constraints that conflict (e.g., "The coach never uses imperatives" vs. "The Season mandate requires direct instructions").
2.  **FAILURE SCENARIO:** A specific description of what breaks downstream if this tension is not resolved (e.g., "The JIT Compiler produces Forge-style content that fails Sophia’s TTT drift check, triggering a 2,000-token retry loop").
3.  **RESOLUTION DEMAND:** A forced derivation that the model must perform to find the "Singular Correct Answer" (e.g., "Derive a non-imperative construction that conveys Forge-level urgency using the coach’s preferred syntax").
4.  **DOWNSTREAM PROOF:** How the resolution will be verified by the next module.

In 2026, frontier harnesses implement these gates as **PreToolUse hooks**. Using a lightweight "Adversary" model, the harness intercepts the execution flow. If the resolution is inconsistent, the hook returns **Exit Code 2**, blocking the tool call and feeding the failure back to the agent as a context update. This "immune response" ensures that by the time the primary model generates content, the "answer space" has been mechanically narrowed to only high-fidelity possibilities.

## 📂 OUR CODE (100-200 words)

- `d:\Work\The Conscious Coaching Factory\Conscious Architect University\Agentic Harness Engineer\Course_03_Advanced_Agentic_Route_Engineering\cbar_harness_integration_analysis.md`: This is the full specification for integrating CBAR into the CCP harness. It details the 3-layer architecture (Pre-generation gates, Post-generation validators, and Cascade locks).
- `src/ccp/services/failure_prevention_gates.py` (Lines 161-231): **Gate 1 — Structural Congruence.** This is a proto-CBAR implementation that checks axis scores BEFORE emission.
  ```python
  # failure_prevention_gates.py, line 169
  # WHY: AC1 enforces that any zero axis on the match result
  # results in an immediate FAIL, preventing tone-deaf triggers.
  # This is the "Hard Constraint" phase of a CBAR gate.
  ```
- `src/ccp/services/failure_prevention_gates.py` (Lines 237-309): **Gate 2 — Language Drift.** Lemmatized tribal term verification ensures we are mathematically tethered to the coach's lexicon.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi / Claude Code:**
> Initialize a CBAR Gate configuration for the JIT Skill Compiler. Define a `CBARQuestion` for the tension between **DEP-ENG-003 (Coach Voice DNA: No Imperatives)** and **DEP-ENG-011 (Season Mandate: Forge-level Urgency)**. 
> 
> Include:
> - **TENSION:** Explain the conflict between the coach's syntactic preference and the season's rhetorical requirements.
> - **FAILURE SCENARIO:** Describe how this causes a "TillDone" retry loop in the FR26 Validation Gate.
> - **RESOLUTION DEMAND:** Task the model with deriving "Urgent-Passive" or "Urgent-Query" constructions.
> - **DOWNSTREAM PROOF:** Sophia TTT drift < 10% AND Marcus Season compliance = PASS.

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the current Failure Prevention Gate logic
pytest src/tests/test_failure_prevention_gates.py -v

# Run the Gate 1 check specifically to see structural congruence in action
pytest src/tests/test_failure_prevention_gates.py -k "test_gate_1"
# Expected: 2 passed in 0.45s 

# Check for Language Drift (Gate 2) logs
cat logs/failure_prevention.log | grep "Gate 2"
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  Read `cbar_harness_integration_analysis.md` §2-4 to understand the 3-layer CBAR architecture.
2.  Open `failure_prevention_gates.py` and trace the execution from `run_gate_1` (line 161) to `emit_certificate` (line 315).
3.  Identify a new "Tension" in your current build (e.g., a specific Coach Rule vs. a Client's current SPT Stage).
4.  Write a formal CBAR definition for this tension following the 4-part structure (Tension, Failure Scenario, Resolution Demand, Downstream Proof).
5.  Paste the **Agent Prompt** from Section 4 into your Pi or Claude Code session to generate the Python implementation of this gate.
6.  Inject the generated gate into the `PreToolUse` hook layer of your custom harness settings.

## ✅ VERIFY (30-50 words)

Run the CBAR gate 5 times against the same tension. Does it yield a **consistent resolution** that allows the subsequent generation to pass both Sophia and Marcus validators on the first try? Trace the **Constraint Resolution Manifest** (JSON) to confirm.

## 🔗 BRIDGE (30-50 words)

Unit 3.11 builds on this by introducing **Dynamic Persona Shifting** — the technique for JIT-injecting specific cognitive frames once CBAR has resolved which constraints must dominate the current execution context.

<!-- FACT-CHECK: "CBAR AI safety 2026" → State-of-the-art focuses on "CoT Controllability," where models struggle to follow constraints in intermediate reasoning without structural enforcement like CBAR. -->
<!-- FACT-CHECK: "Claude Code hooks 2026" → PreToolUse hooks with Exit Code 2 are the industry standard for blocking tool calls based on reasoning gate failures. -->
<!-- FACT-CHECK: "Nvidia NIM 2026" → NIM pipelines support standard tool-calling APIs that can be intercepted by hook-based harnesses for deterministic validation. -->
