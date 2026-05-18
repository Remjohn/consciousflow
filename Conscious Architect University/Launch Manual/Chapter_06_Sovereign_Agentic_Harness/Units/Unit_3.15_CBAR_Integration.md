# Unit 3.15: CBAR in the CCP Pipeline — Integration

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Post-generation validation (Sophia, Marcus, Chen) is "good enough" for production quality control. While these validators are essential safety nets, relying purely on post-hoc rejection creates a wasteful, expensive, and unpredictable "TillDone" loop. Rejection is reactive; CBAR is proactive.

Think of the human cognitive architecture: your spinal cord handles reflexes (Layer 2 validation), pulling your hand from a hot stove *after* the pain signal arrives. But the prefrontal cortex engages in "pre-play"—simulating actions and resolving potential conflicts *before* the motor cortex fires. This pre-generation reasoning is what keeps you from touching the stove in the first place.

In the CCP, CBAR acts as this prefrontal "reasoning kernel." It forces the agent to resolve structural tensions (e.g., Season mandate vs. Voice DNA limits) BEFORE a single word of content is generated. By resolving the tension in Phase 2 (Reasoning), we ensure that Phase 4 (Validation) almost always sees a pass. We aren't just checking work; we are engineering the thought process that produces it.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The integration of CBAR into the CCP pipeline follows a strict **3-Layer Architecture** that governs the 4-phase harness execution flow (Context → Reasoning → Tool → Validation).

**Layer 1: Pre-Generation CBAR Gates (The Reasoning Kernel)**
Operates during Phase 2. Before the model generates high-entropy output (like a coaching script), it must answer a `CBARQuestion`—a constraint satisfaction puzzle with a singular correct answer. These gates are implemented as `PreToolUse` hooks. A lightweight model identifies the "tension" between two competing DEP-IDs (e.g., `DEP-ENG-003` syntax vs. `THE_FORGE` season urgency) and derives a "Resolution Demand" that explicitly instructs the generation step.

**Layer 2: Post-Generation Validation (The Safety Net)**
Operates during Phase 4. This is your existing `validation_gate.py` infrastructure. Sophia checks TTT drift, Marcus checks seasonal compliance, and Chen scans for AI artifacts. Because Layer 1 resolved the tensions upfront, Layer 2 transitions from a primary enforcer that triggers constant retries into a silent auditor that verifies first-pass success.

**Layer 3: Cascade Lock (The Consistency Check)**
Operates as a `Stop` hook. It cross-checks the resolutions from Layer 1 against the validated results of Layer 2. If the CBAR resolution said "Prioritize Season over Voice" but the final output drifted 20% from the baseline, the Cascade Lock detects the inconsistency, returns exit code 2, and forces the harness to re-reason the turn. This creates an auditable "Constraint Resolution Manifest" for every pipeline execution.

## 📂 OUR CODE (100-200 words)

The current implementation in `src/ccp/services/validation_gate.py` (lines 302-304) executes the Layer 2 "Triple-Pass" orchestrator. It is reactive, triggering a `ValidationFinalVerdict.FAIL_TRIGGER_REWRITE` when thresholds are breached.

```python
# validation_gate.py, line 302
# WHY: The current orchestration executes Sophia, Marcus, and Chen
# AFTER the draft exists. This is Layer 2. To integrate CBAR,
# we need Layer 1 PreToolUse hooks in the harness caller.
sophia = self.run_sophia(draft_text, coach_soul_baseline, model_offset)
marcus = self.run_marcus(draft_text, season_override)
chen = self.run_chen(draft_text)
```

`⚠️ BUILD REQUIRED — cbar_gate.py`: We must build the Layer 1 primitive defined in `cbar_harness_integration_analysis.md` (§5) to enable pre-generation reasoning before the `JITSkillCompiler` or `ActivationSeedGenerator` are invoked. This middleware will manage the `CBARQuestion` dataclasses and the resolution manifest.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Using the blueprint in `cbar_harness_integration_analysis.md` (§5), create the `CBARQuestion` definitions for the following three CCP pipeline tensions. Save them to a new file at `src/ccp/models/cbar_questions.py`:
> 1. **JIT_G-01 (Voice vs. Season):** Tension between `DEP-ENG-003` (coaches hate imperatives) and `THE_FORGE` (season mandates imperatives). Failure: coach disowns the script.
> 2. **ACT_S-02 (PTG Status):** Tension between L2 "Resolved" status and L3 "Active" belief records in `DARN-CAT` data. Failure: tone-deaf activation seed.
> 3. **MEM_P-03 (Memory Promotion):** Tension between cross-domain confrontation avoidance vs. domain-specific professional authority issues. Failure: incorrect global semantic truth.
> Ensure each uses the `CBARQuestion` dataclass structure with `tension`, `failure_scenario`, and `resolution_demand`.

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the Layer 2 validation gate is operational before adding Layer 1
pytest src/ccp/services/validation_gate.py -k test_triple_pass
# Expected: 3 passed in 0.45s

# Check for the presence of the CBAR blueprints
ls "Conscious Architect University/Agentic Harness Engineer/Course_03_Advanced_Agentic_Route_Engineering/cbar_harness_integration_analysis.md"
# Expected: path exists
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Audit the Blueprint**: Open `cbar_harness_integration_analysis.md` and read Section 3. Map the four listed CCP "holes" to your specific launch targets.
2. **Define the Tensions**: Using the prompt in Section 4, generate the `src/ccp/models/cbar_questions.py` file. Each question MUST isolate two specific DEP-IDs or rule sets that conflict.
3. **Configure PreToolUse Hooks**: In your custom harness configuration (taught in Unit 3.16), add a `PreToolUse` hook that calls the `CBARGate.resolve()` method before the `JITSkillCompiler` tool is fired.
4. **Wire the Cascade Lock**: Add a `Stop` hook that verifies the `cascade_consistent` boolean in the CBAR manifest against the `TriplePassResult` from `validation_gate.py`.
5. **Analyze the Manifest**: Run a test batch and inspect the `manifest_hash`. Can you trace exactly which constraint won the tension resolution?

## ✅ VERIFY (30-50 words)

Open `src/ccp/models/cbar_questions.py`. Do you see 3 distinct `CBARQuestion` instances for JIT, Activation, and Memory? Does each instance contain a `resolution_demand` that cites a specific DEP-ID or Rule ID? → **Yes/No**

## 🔗 BRIDGE (30-50 words)

Unit 3.16 builds on this integration by introducing you to the **CCF Harness Anatomy**—the 41 production-ready commands where you will see these NLAH and CBAR principles implemented in the very code you use to run this manual.

<!-- FACT-CHECK: "LangGraph reasoning gates 2026" → LangGraph 0.3 uses 'conditional edges' as the primary routing/reasoning gate, often paired with 'thinking' models (o3/R1) for zero-shot tension resolution. This confirms Layer 1 CBAR placement is SOTA. -->
<!-- FACT-CHECK: "Nvidia NIM Validator containers 2026" → Llama-Guard-3 and Nemotron-3-8B-Validator are the standard NIM endpoints for Layer 2 sanity checks. -->
 <!-- WORD COUNT: 842 words -->
