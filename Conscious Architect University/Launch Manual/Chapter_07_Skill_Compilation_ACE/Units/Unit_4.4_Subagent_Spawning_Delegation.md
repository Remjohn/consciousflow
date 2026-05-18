# Unit 4.4: Subagent Spawning & Delegation

## 🧠 THE SCIENCE (152 words)

**UNLEARN:** "Do everything in one conversation." The belief that keeping a single continuous thread with an AI agent increases its "understanding" is a technical fallacy. In reality, every turn in a monolithic conversation increases the entropy of the context window. As the history grows, the model's attention mechanism (KV caching) becomes diluted, leading to "context drift" where the agent forgets initial constraints or hallucinates previous state.

Think of an ant colony: it does not function as a single giant ant. It operates through **specialized castes**. The *Honeypot ants* (Myrmecocystus) serve as living storage vessels, while *Scout ants* specialize in exploration and pheromone signaling. They do not share the same physical space or metabolic burden at all times. 

In the CCP/CMF architecture, we apply this entomological principle through **Context Isolation**. We spawn subagents for "noise-heavy" tasks—like scanning hundreds of files or searching documentation—so the parent orchestrator's context remains pristine, focused entirely on the high-level system logic.

## 🧠 TECHNICAL KNOWLEDGE (234 words)

Subagent spawning is the architectural act of delegating a discrete, scoped task to a new LLM instance with a "forked" context. In 2026-era harnesses like Claude Code or Gemini CLI, this is typically governed by the `Agent` tool (formerly `Task`). When the orchestrator invokes a subagent, it passes a `fork_context=true` flag. This ensures the subagent inherits the necessary workspace metadata (like `AGENTS.md`) but starts with a fresh conversation history.

The Subagent Lifecycle follows a strict four-phase protocol:
1. **Spawn**: The parent defines the subagent's role (e.g., @coder, @reviewer, @searcher) and provides a specific instruction set.
2. **Task Execution**: The subagent operates in an isolated sandbox. It has access to tools (read/write/search) but cannot modify the parent's current conversation state or memory. This prevents "messy" intermediate steps from polluting the orchestrator's attention.
3. **Artifact Serialization**: Upon completion, the subagent summarizes its findings into a structured artifact (e.g., a `.md` file or JSON object).
4. **Handoff & Termination**: The subagent returns the artifact to the parent and immediately shuts down. This "stateless" execution ensures the parent only receives the **signal**, never the **noise**.

Failure to use subagents results in "Token Inflation," where the cost of every turn increases geometrically as the conversation history expands. Subagents decouple task complexity from orchestration cost, allowing the CCP to scale to thousands of files without degrading model performance.

## 📂 OUR CODE (148 words)

In the CCP codebase, we implement the subagent pattern within the `PiExtensionHarness`.

- `src/ccp/services/pi_extension_harness.py` lines 336-380: The `run_team_orchestrator` function.
- This logic manages the spawning of 3 parallel agents (Specialists) to produce drafts with different temperatures.

```python
# src/ccp/services/pi_extension_harness.py, line 348
# WHY: DraftRL pattern. We generate multiple specialized outputs
# in parallel isolation, then return them for consensus.
# This prevents the primary orchestrator from seeing the 
# "failed" or "discarded" drafts, keeping its context clean.
```

If you examine the `ParallelDraft` dataclass in the same file, you will see how we isolate the `draft_text` from the `TeamOrchestratorResult`. We are essentially creating a temporary "swarm" that collapses back into a single result once the mission is complete.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code:**
> `spawn_subagent(role="CodeAuditor", task="Audit all files in Conscious Architect University/Launch Manual/Units/ for L1-L11 governance compliance. Specifically check for forbidden vocabulary in Section 1 and Section 2. Return the results as a new artifact: 'docs/audits/governance_check_{date}.md'. Do not output the full audit log to the terminal; only return the final artifact location.")`
>
> **Expected Output:**
> The subagent will run, scan the directory, and return: `Subagent CodeAuditor completed. Artifact created: docs/audits/governance_check_2026-04-04.md`. Your main context remains clear for the next architectural instruction.

## ⌨️ TERMINAL (72 words)

```bash
# Trigger a subagent-based documentation audit
claude @auditor "Scan units/ for forbidden vocabulary"

# Monitor the active subagent process
claude agents list
# Expected: auditor (ID: sub-4k29) — Status: RUNNING

# Once completed, view the returned artifact
cat docs/audits/governance_check_*.md
# Expected: [L1: PASS] [L2: PASS] ...
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. Open `src/ccp/services/pi_extension_harness.py` and locate the `run_team_orchestrator` method at line 336. Observe how the `ParallelDraft` objects are initialized without polluting the `PiExtensionHarness` state.
2. In your terminal, define a new subagent role in `.claude/agents/` (if using Claude Code) or refer to the `AGENTS.md` context for Gemini CLI.
3. Use the **Agent Prompt** from Section 4 to delegate a documentation audit. 
4. While the subagent is "scanning," notice that you can still ask your primary agent questions about system architecture—the subagent's heavy I/O operations are happening in a separate "forked" context.
5. Receive the artifact from the subagent.
6. Verify that your primary conversation history does not contain the individual file contents the subagent just scanned. You have successfully decoupled **Task Execution** from **Context Management**.

## ✅ VERIFY (38 words)

Run `claude history`. Is the subagent's file-scanning output present in your main history? If **No**, and the artifact exists in `docs/audits/`, the unit is complete. You have achieved Context Isolation.

## 🔗 BRIDGE (42 words)

Unit 4.4 taught us how to distribute tasks to subagents to prevent context death. Unit 4.5 builds on this by introducing **Checkpointing & Tree History**—the mechanism that ensures these isolated artifacts survive across session restarts and context truncations.

<!-- FACT-CHECK: "Claude Code 2026 subagent spawn tool" → Claude Code identifies subagents via `@` role prefixes and the `Agent` tool in the runtime environment. -->
<!-- FACT-CHECK: "fork_context parameter in 2026 LLM harnesses" → Common parameter in modern Agentic Runtimes to inherit AGENTS.md/CLAUDE.md without inheriting chat history. -->
