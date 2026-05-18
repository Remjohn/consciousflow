# Unit 3.9: Hook Pipelines — Pre/Post/Stop

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "The model just runs until it's finished." False. A production-grade Harness never grants the model an uninterrupted execution path. This is the **Model-Only Fallacy**—the belief that prompt instructions are sufficient to govern behavior. In reality, prompts mean-revert; hooks enforce.

Think of it as **Bio-Electric Synaptic Gating**. In the human brain, neurons don't just fire randomly based on an "instruction" from the prefrontal cortex. Throughout the synaptic pathway, inhibitory interneurons act as "gates" (hooks). They monitor the signal's intensity and frequency *before* it crosses the synapse (PreToolUse), modulate the neurotransmitter release *during* the event (Tool Execution), and trigger long-term potentiation or depression *after* the signal passes (PostToolUse/Stop). 

Without these gates, the brain enters a state of excitotoxicity—uncontrolled, self-destructive firing. In the CCP, without hook pipelines, the agent enters **Cognitive Excitotoxicity**: executing unvalidated code, ignoring safety constraints, and hallucinating terminal states. Hooks are the inhibitory interneurons of your Harness.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The 2026 **Hook Pipeline Architecture** (formalized in the Claw Code standards) decomposes the agentic loop into four deterministic phases: **Context Assembly**, **Reasoning**, **Tool Execution**, and **Output Validation**. Hooks are the event-driven triggers that intercept the model's cognition at the transitional boundaries between these phases.

There are three primary hook events that govern the lifecycle:
1.  **`PreToolUse`**: Fires *after* the model decides to use a tool but *before* the tool actually executes. This is your primary defense layer. If a `PreToolUse` hook exits with code `2` or returns a `{"decision": "block"}` JSON, the tool call is instantly terminated, and the reason is fed back to the model for correction.
2.  **`PostToolUse`**: Fires after a tool successfully completes. This is used for "side-effect automation"—auto-formatting code, running `pytest` after a file edit, or logging the action to the **Receipt Chain**.
3.  **`Stop`**: Fires when the model decides to conclude the conversation. This is the **Assurance Gate**. A `Stop` interceptor can inspect the current state (e.g., `TASK.md`) and force the model to continue if the work is incomplete.

Handlers for these hooks come in four flavors: `command` (bash scripts), `http` (webhook notifications), `prompt` (lightweight LLM evaluation), and `agent` (full sub-agent spawning for deep verification). In the CCP, we prioritize `agent` handlers for complex reasoning gates and `command` handlers for deterministic system checks.

## 📂 OUR CODE (100-200 words)

The CCP harness logic is distributed across two critical files that implement these phases:

1.  `Conscious Architect University/Agentic Harness Engineer/Course_03_Advanced_Agentic_Route_Engineering/cbar_harness_integration_analysis.md`, §2: This document defines the **4-phase execution architecture** used to map CBAR (Constraint-Based Adversarial Reasoning) onto the harness. It specifically designates `PreToolUse` hooks as the **Reasoning Kernel** where CBAR tensions are resolved before any generation occurs.
2.  `src/ccp/services/pi_extension_harness.py`: This is our production Python harness.
    - **Line 83 (`run_interact_comp`)**: Implements the **Ambiguity Gate**—a `PreToolUse` pattern that halts execution if required DEP-IDs are missing.
    - **Line 279 (`run_till_done`)**: Implements the **Assurance Engine**—a `Stop` hook pattern that validates output schemas before concluding.
    - **Line 178 (`run_damage_control`)**: A self-healing loop triggered by tool execution failures (a `PostToolUse` error branch).

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi:**
> 
> Create a `PreToolUse` hook configuration in `.claude/settings.json` that gates the **JIT Compiler** tool. 
> 1. Use a `command` handler that checks if the `TOOL_INPUT_CODE` contains forbidden patterns (e.g., `os.environ.clear()`).
> 2. If forbidden patterns are found, echo a JSON block decision: `{"decision": "block", "reason": "Security Violation: JIT Compiler cannot clear environment variables."}`.
> 3. Ensure the matcher targets only the `JITCompiler` tool.
> 4. Use the following Bash script for the command:
> `if [[ "$TOOL_INPUT_CODE" == *"os.environ.clear()"* ]]; then echo '{"decision": "block", "reason": "Security Violation: JIT Compiler cannot clear environment variables."}'; exit 2; fi`

## ⌨️ TERMINAL (50-100 words)

```bash
# View all currently active hooks in the terminal browser
/hooks

# Test the JIT Compiler guardrail by attempting a forbidden action
# (Requires the JIT Compiler tool to be enabled)
python3 -c "import os; os.environ.clear()"
# Expected: Hook blocks execution and displays the reason from Section 4.

# Inspect the project-specific settings to verify hook persistence
cat .claude/settings.json | jq '.hooks.PreToolUse'
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/services/pi_extension_harness.py` and trace the `run_interact_comp` method at line 83. Note how it halts the pipeline if `coach_id` context is missing—this is a native Python implementation of a `PreToolUse` gate.
2. Run the `/hooks` command in your CLI to audit the default global hooks. 
3. Paste the **Agent Prompt** from Section 4 into your Pi Coding Agent session.
4. Verify that Pi creates (or updates) the `.claude/settings.json` file in the root of your workspace.
5. Manually inspect the file to ensure the `matcher` is set to `JITCompiler` and the `exit 2` logic is correctly escaped.
6. Attempt to run a script through the JIT Compiler that includes `os.environ.clear()` and confirm the harness repels the action with the designated reason.

## ✅ VERIFY (30-50 words)

Run `grep -C 5 "JITCompiler" .claude/settings.json`. If the output shows the `PreToolUse` hook with the `exit 2` block logic, the JIT guardrail is live. Run `/hooks` to confirm it is active in the current session.

## 🔗 BRIDGE (30-50 words)

Unit 3.10 builds on this by introducing **CBAR — The Harness's Immune System**, where we upgrade these simple `command` hooks into deep reasoning gates that resolve psychological and technical tensions before they ever reach the compiler.

<!-- FACT-CHECK: "Claude Code 2026 hook events" → PreToolUse, PostToolUse, and Stop are the standard lifecycle events in the March 2026 release. Handlers include command, http, prompt, and agent. -->
<!-- FACT-CHECK: "Claw Code hook standards 2026" → Claw Code parity confirms exit code 2 as the deterministic "block" signal for command handlers. -->
