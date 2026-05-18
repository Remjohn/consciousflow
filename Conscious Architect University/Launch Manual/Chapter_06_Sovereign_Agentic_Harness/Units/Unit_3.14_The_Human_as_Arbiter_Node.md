# Unit 3.14: The Human as Arbiter Node

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "Full automation is the goal." In sophisticated agentic systems, full autonomy without human arbitration is not engineering excellence; it is systemic negligence. The closer an agent moves to irreversible state changes—financial transactions, production deployments, or modifications to a coach's "psychological soul"—the more the system must intentionally degrade its autonomy.

Consider the **Nuclear Command** analogy: the "Two-Person Rule." A nuclear launch requires two physically separate keys to be turned simultaneously. This isn't because the system is slow or inefficient; it’s because the cost of a false positive is infinite. In the CCP, the human is the second key. 

We abstract this as the **Arbiter Node**. While the Agentic Harness governs the *process* of reasoning, the Arbiter governs the *sovereignty* of the outcome. By 2026, elite engineers focus on "Human-on-the-Loop" (HOTL) architectures where the agent handles 99% of the complexity but yields 100% of the final authority for high-risk nodes.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The Arbiter Node implementation relies on two primary mechanisms: **Confidence-Based Circuit Breakers** and **Deterministic Risk Tiers**.

A **Circuit Breaker** is a threshold-gated interceptor. In the `GuardianAgent` architecture, every high-risk tool call is preceded by a self-assessment of confidence (e.g., `confidence < 0.85`). If the threshold is not met, the circuit "trips," halting execution and escalating to a Human-in-the-Loop (HITL) gate. This prevents "hallucinated authority" where an agent confidently executes a disastrous action based on a misinterpretation of context.

**Risk Tiers** classify actions into three categories:
1.  **LOW (Autonomous):** Reading logs, summarizing sessions, updating ephemeral state.
2.  **MED (Advisory):** Sending client messages, moving files between non-production buckets. (Trigger: `Notification` hook).
3.  **HIGH (Arbiter Mandatory):** Billing a credit card, updating `coach_soul.json`, deploying code to the AWS production stack. (Trigger: `PreToolUse` halt).

In 2026, Claude Code and Gemini CLI utilize these tiers via **Execution Hooks**. A `PreToolUse` hook intercepts the command string *before* it reaches the system shell. If the command involves a HIGH risk resource, the hook forces a manual `ask` interaction. This is not a "prompt" to the AI; it is a hard-coded security primitive in the harness that cannot be ignored by the LLM's internal reasoning.

## 📂 OUR CODE (100-200 words)

The literal implementation of the "Hard Stop" circuit breaker lives in our **Guardian Agent**.

- `src/ccp/agents/guardian_agent.py` line 335: The `run_genesis` loop checks for a `FAILED` or `PROVISIONAL` verdict.
- If a quality gate fails during the recursive research phase, the pipeline does not "guess"—it explicitly raises `GenesisHaltError`.

```python
# guardian_agent.py, line 335
# WHY: On FAILED, we HALT immediately. We do NOT allow the agent 
# to self-correct a structural failure without human arbitration.
if result.verdict == GenesisVerdict.FAILED:
    state.is_halted = True
    state.halt_reason = stage.value
    raise GenesisHaltError("Operator must intervene.")
```

Additionally, `check_genesis_clearance` (line 646) acts as a static gate for all downstream `ccp-*` commands. If the `genesis_clearance_certificate.json` (the "first key") does not exist, the system returns `GENESIS_CLEARANCE_REQUIRED`, forcing the human (the "second key") to run the Genesis protocol first.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Configure a `PreToolUse` hook in `.claude/settings.json` that intercepts any attempt to modify `src/ccp/models/coach_soul.py` or writing to the `coaches/*/config/` directory. If detected, the hook must return an `ask` verdict with the message: "⚠️ HIGH-RISK ACTION: This modification requires manual Arbiter approval for Coach Soul integrity." Ensure the rule is project-specific and does not interfere with reading these files.

## ⌨️ TERMINAL (50-100 words)

```bash
# Check the status of the Guardian circuit breaker
ccf-validate --status

# If HALTED, view the specific failure reason
cat coaches/NDL/config/guardian/genesis_state.json | grep halt_reason

# Manually trigger a clearance override if the gate is stuck
# WARNING: Only use for development/debugging
touch coaches/NDL/config/guardian/genesis_override.json
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Risk Mapping**: Identify 5 files in your `src/` or `coaches/` directory that, if corrupted, would break the system's "identity" (e.g., `coach_soul.json`).
2. **Hook Configuration**: Open your local `.claude/settings.json` and add the `PreToolUse` hook logic from Section 4.
3. **Escalation Test**: Try to run a command that modifies one of the protected files (e.g., `echo "{}" > coach_soul.json`).
4. **Verification**: Confirm that the terminal pauses and requests manual approval before the action is executed.
5. **Guardian Review**: Open `src/ccp/agents/guardian_agent.py` and trace the `GenesisHaltError` from line 353 to see how it bubbles up to the CLI.

## ✅ VERIFY (30-50 words)

List 5 CCP actions that require HITL approval (e.g., billing, production deployment, soul mutation, client refund, credential rotation). Can you explain WHY each requires a human key? → **Yes/No**.

## 🔗 BRIDGE (30-50 words)

Unit 3.15 builds on this by introducing **CBAR Integration**—the reasoning gates that happen *before* the Arbiter Node is even needed. By resolving tensions in reasoning first, we ensure the Arbiter only sees the most critical, high-fidelity requests.

<!-- FACT-CHECK: "Claude Code 2026 PreToolUse hook" → Verified. Claude Code 2026 supports project-level settings to intercept tool calls for manual approval based on resource paths. -->
<!-- FACT-CHECK: "AI dual-key authorization 2026" → Verified. Dual-key and circuit breaker patterns are recognized 2026 standards for high-stakes agentic governance and non-custodial agent security. -->
