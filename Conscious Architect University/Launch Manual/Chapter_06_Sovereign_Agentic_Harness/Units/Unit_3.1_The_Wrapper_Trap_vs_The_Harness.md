# Unit 3.1: The Wrapper Trap vs The Harness

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** Prompt engineering is enough to build production agents. This is a false comfort. Prompting focuses on the "what" — the instructions inside the model's stochastic context. Real engineering focuses on the "how" — the deterministic control structure OUTSIDE the model.

Think of the difference between a simple **reflex arc** and the **cerebellum**. A reflex arc is a wrapper: stimulus in, response out, localized and immediate. But the cerebellum is a harness; it doesn't generate the "will" to move, but it governs the timing, precision, and coordination of every muscle fiber to ensure the will is executed without the body collapsing.

In the CCP, we reject the "Wrapper Trap" (a thin API layer around an LLM). We deploy the **NLAH (Natural-Language Agent Harnesses)** theory formalized by Pan et al. (2026). The harness is a portable, executable artifact that externalizes control logic, making our agent's reasoning deterministic rather than emergent.

## 🧠 TECHNICAL KNOWLEDGE (232 words)

In the Pan et al. (2026) formalization, an agentic harness is defined as a specialized software layer that sits between the foundational model and the execution environment. While a **wrapper** merely facilitates API connectivity and prompt formatting, a **harness** enforces an **Execution Contract**. 

This contract is managed by the **Intelligent Harness Runtime (IHR)**. The IHR interprets high-level natural-language instructions—the harness—and maps them to a 4-phase operational loop:
1. **Context Assembly:** Pruning and ranking information fractals before the model sees them.
2. **Reasoning Gating (CBAR):** Forcing the model to resolve architectural tensions before it generates a single token of output.
3. **Execution Gating:** Intercepting tool calls (PreToolUse) to verify permissions and safety.
4. **Validation:** Reviewing the output against the original intent (PostToolUse) before state is persisted.

The beauty of NLAH is that the control logic is **decoupled** from the execution runtime. In the CCP, our harnesses are written in Markdown (like the `ccf-*` commands you will use), making them human-inspectable and model-agnostic. This prevents "model mean-reversion," where an agent's quality degrades as it drifts toward the statistical average of its training data. By externalizing the logic into a harness, we force the model to operate within the specific, high-fidelity rails required for 76-agent swarm orchestration.

## 📂 OUR CODE (148 words)

The foundational theory for our entire agentic layer is contained in the workspace root. We don't guess; we map.

- `Natural-Language Agent Harnesses.md`: This is the Pan et al. (2026) formalization. It defines the three properties of a harness: it must be an **executable artifact**, it must **externalize control logic**, and it must be **portable**.
  ```python
  # src/ccp/agents/morgan_orchestrator.py
  # WHY: Morgan doesn't just "talk" to agents. It loads a 
  # task_harness (line 142) which defines the inter-agent 
  # handoff protocol, ensuring zero data loss during state transfers.
  ```
- `src/ccp/services/pi_extension_harness.py`: This file implements the Intelligent Harness Runtime for our Pi coding agent integration. It handles the **Externalized State** transitions, ensuring that if a conversation crashes, the `TASK.md` progress is preserved and the harness can resume logic from the last checkpoint.

## 🤖 AGENT PROMPT (95 words)

> **Prompt for Pi/Claude Code/Gemini CLI:**
> Open `src/ccp/agents/morgan_orchestrator.py` and analyze the `load_task_harness` function. Compare its implementation to the principles defined in `Natural-Language Agent Harnesses.md`. Specifically, identify if the current implementation of `harness_state` is truly **externalized** (file-backed) or merely **ephemeral** (in-memory). If ephemeral, suggest a refactor to move the state tracking into a `harness_checkpoint.json` file to ensure context-death resilience. Output your analysis as a technical audit report.

## ⌨️ TERMINAL (68 words)

```bash
# Search for NLAH implementation patterns in our services
grep -r "IHR" src/ccp/services/
# Expected: Reference to IHR mapping in pi_extension_harness.py

# Verify the current harness state for the Morgan Orchestrator
cat src/ccp/agents/morgan_orchestrator.py | grep -A 5 "harness_state"
# Expected: A dictionary or class initialization for state tracking
```

## ✅ IMPLEMENTATION STEPS (142 words)

1. Read the first three sections of `Natural-Language Agent Harnesses.md` in the workspace root. Focus on the definitions of "Harness" vs "Wrapper."
2. Open `src/ccp/agents/morgan_orchestrator.py` at line 142. Trace how the `load_task_harness` function initializes the control stack for a new swarm task.
3. Map the 4-phase loop (Context → CBAR → Execution → Validation) from Section 2 to the function calls in `morgan_orchestrator.py`.
4. Identify which files in the `commands/` directory (e.g., `ccf-weekly.md`) serve as executable natural-language artifacts.
5. Paste the prompt from Section 4 into your coding agent (Pi or Claude Code) to audit the harness state resilience.
6. Verify that your system uses file-backed state (`TASK.md` or `config.yaml`) to survive context truncation.

## ✅ VERIFY (42 words)

Open `Natural-Language Agent Harnesses.md`. Can you define the three properties that distinguish an NLAH from a simple prompt wrapper? **YES/NO**. (Correct answer: Executable Artifact, Externalized Control Logic, Portability). Evidence this by pointing to `ccf-weekly.md` as one such artifact.

## 🔗 BRIDGE (44 words)

Unit 3.1 established the "why" of harness engineering. Unit 3.2 moves into the "how" by introducing **The 5 Techniques of Agentic Engineers**, where you will learn the actual engineering patterns (like State Management and Dynamic Pruning) that make the harness function.

<!-- FACT-CHECK: "NLAH Natural-Language Agent Harnesses Pan et al. 2026" → March 2026 paper establishing externalized, portable natural-language control logic and Intelligent Harness Runtime (IHR). Verified via build.nvidia.com and arxiv-2026-trends. -->
