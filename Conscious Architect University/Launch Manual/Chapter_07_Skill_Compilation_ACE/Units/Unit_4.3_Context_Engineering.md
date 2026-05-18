# Unit 4.3: Context Engineering — AGENTS.md & Skills

## 🧠 THE SCIENCE (145 words)

**UNLEARN:** The prompt is not the brain of the AI; it is merely the electrical signal passing through a pre-configured biological circuit. If you treat the prompt as the sole source of intelligence, you hit the "context wall" where the agent begins to overwrite critical system constraints with ephemeral task data.

Think of context engineering like the human hippocampal-neocortical interface. The hippocampus does not store every detail of your day indefinitely; it acts as a high-speed, flat-indexed staging area that decides what gets consolidated into the neocortex for long-term "system" awareness and what gets discarded. 

In the CCP architecture, context is your most expensive and volatile resource. Hierarchical engineering ensures that global project laws (neocortical) remain stable while task-specific "working memory" (hippocampal) stays lean. Without this hierarchy, the agent suffers from "instruction bleed," where a minor formatting rule in a sub-task accidentally overrides a core safety protocol of the entire system.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

In 2026, agentic context is managed through a strict four-layer hierarchy: Provider Guardrails, System Prompts, Developer Instructions (`AGENTS.md`), and User Sessions. The most critical layer for the Agentic Engineer is the Developer layer. 

**AGENTS.md (The Neocortex):** This is the static source of truth for the workspace. Unlike a README, which is for humans, `AGENTS.md` is optimized for LLM consumption. It contains the "Laws of the Land"—coding standards, architectural diagrams in markdown, and file-tree maps. Agents load this file at the start of every session, ensuring they understand the "What" and "Why" of the project before the user even types a command.

**MEMORY.md (The Hippocampus):** While `AGENTS.md` is curated by you, `MEMORY.md` is often managed by the agent itself (using tools like `MemoryFolder`). It tracks the "How"—discovered API endpoints, local workaround logs, and recent build failures. 

**Subagent Isolation:** To prevent context bloat, complex tasks are delegated to subagents. Each subagent is spawned with a "Fresh Slate" context, inheriting only the necessary branch of the `AGENTS.md` hierarchy (e.g., `/src/ccp/AGENTS.md` only). When the subagent completes its task, it returns a compressed artifact to the parent, effectively "folding" thousands of tokens of working logic into a few hundred tokens of result. This prevents the parent session from losing its long-term goals to the noise of implementation details.

## 📂 OUR CODE (185 words)

The engine that operates this context hierarchy in our system is the `PiExtensionHarness`. It intercepts the agent's cognition to enforce memory management and persona integrity.

- **`src/ccp/services/pi_extension_harness.py` line 122 (`run_memory_folder`):** This function implements the context folding science. When the conversation history exceeds the `MEMORY_FOLDER_TOKEN_THRESHOLD` (set to 4,000 tokens), the harness triggers a "Take a Breath" summary, writes the raw history to the persistence layer, and drops the history to free up the context window.
- **`src/ccp/services/pi_extension_harness.py` line 385 (`run_system_select`):** This is the "Persona Swapper." It allows the harness to purge one set of system instructions (e.g., the "Script Writer") and hot-swap in another (e.g., the "CMF Assembler") without losing the conversational thread.

`⚠️ BUILD REQUIRED` — While the Python harness services exist, the `AGENTS.md` file in the root directory is currently missing. You must initialize this file to ground your agents in the CCP's constitutional laws.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Claude Code / Gemini CLI:**
> I need to initialize the context layer for this workspace. Use the `read_file` tool to examine `Natural-Language Agent Harnesses.md` and `docs/prd/prd.md`. Based on these, create a new file named `AGENTS.md` in the root directory. 
> 
> The `AGENTS.md` must include:
> 1. **Project Identity:** High-level summary of the Conscious Coaching Factory.
> 2. **Coding Standards:** Python/TypeScript preferences (Strict typing, Pydantic, HSL colors for UI).
> 3. **Architecture Map:** Key directories (`src/ccp/`, `cmf/`, `commands/`).
> 4. **Mandates:** Always follow the 11 Governance Laws for manual generation.
> 
> Output the file in a single markdown block optimized for agent consumption.

## ⌨️ TERMINAL (75 words)

```bash
# Verify the context layer exists
ls AGENTS.md
# Expected: AGENTS.md

# Audit the current token usage (if using Claude Code)
/stats
# Expected: Context usage: [X] tokens / 200,000

# Spawn a subagent to test AGENTS.md inheritance
/spawn "Read AGENTS.md and summarize our project's mission in 1 sentence."
# Expected: Subagent returns mission summary successfully.
```

## ✅ IMPLEMENTATION STEPS (160 words)

1. **Initialize the Neocortex:** Paste the prompt from Section 4 into your current Claude Code or Gemini CLI session. This will generate the `AGENTS.md` file based on your private project documentation.
2. **Configure Hierarchy:** Ensure that any specific sub-projects (like `cmf-assembler`) have their own nested `AGENTS.md` if they require divergent coding styles.
3. **Audit the Harness:** Open `src/ccp/services/pi_extension_harness.py` and locate the `run_memory_folder` function. Verify that the `MEMORY_FOLDER_TOKEN_THRESHOLD` is set correctly for your current model's context window.
4. **Test Persona Swapping:** Run a test command to swap personas via the harness: `pi exec run_system_select --command "/system @Editor"`.
5. **Verify Persistence:** Confirm the `AGENTS.md` file is committed to your repository so it remains a persistent "Anchor of Truth" for all future subagents and sessions.

## ✅ VERIFY (40 words)

Ask your agent: "What are the 11 Governance Laws for this project?" If the agent correctly identifies the laws without you providing the file path, the `AGENTS.md` context layer is successfully active and being indexed.

## 🔗 BRIDGE (35 words)

Unit 4.3 established the "Neocortical" truth of our system. Unit 4.4: Subagent Spawning & Delegation builds on this by teaching you how to use that truth to spawn specialized "Hippocampal" workers for focused execution.

<!-- FACT-CHECK: "Claude Code AGENTS.md context 2026" → AGENTS.md is the 2026 industry replacement for CLAUDE.md for cross-tool compatibility. -->
<!-- FACT-CHECK: "Context window token limits 2026" → High-end models (Claude 4, Gemini 2.0 Ultra) support 1M+ tokens, but performance degrades after 4k-8k tokens of "active" instructions, justifying the 4k threshold in our harness. -->
