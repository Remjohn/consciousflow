# Unit 4.9: Command File Anatomy — The Harness File Format

## 🧠 THE SCIENCE (154 words)

**UNLEARN:** Automation in an agentic workflow is NOT about writing better Python scripts. It is about writing better *natural language contracts*.

In the traditional paradigm, "automation" meant delegating execution to a CPU. In the Natural-Language Agent Harness (NLAH) paradigm, automation means delegating *stochastic decision-making* to an LLM. Because the LLM is the runtime, your command files are not code—they are high-fidelity instruction sets that define the "logic of an expert."

Think of the Command File as **mRNA (Messenger RNA)**. In biological systems, the ribosome (the harness) does not "know" how to build a complex protein; it simply reads the mRNA's instructions and assembles the amino acids in a deterministic order. The mRNA is the portable instruction set that can be read by any ribosome in any cell. Similarly, a `.md` command file is a portable instruction set that any tool-capable LLM (the harness) can execute to produce a specific architectural artifact.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

An NLAH Command File is a structured Markdown document that bridges the gap between human intent and autonomous execution. It comprises 8 distinct structural primitives designed to repel drift and enforce state persistence:

1.  **YAML Frontmatter:** Defines the command `name` and `description`. This is the "header file" that allows the harness to index the command library.
2.  **Slash Command Header:** (e.g., `# /ccp-init {arg}`) provides a standardized entry point for the operator.
3.  **Turbo Annotations:** (e.g., `// turbo-all`) signals to the harness that it has authorization to auto-run safe tool calls without waiting for human approval.
4.  **Base Variables:** Hardcoded paths (`SKILLS_BASE`, `DOCS_BASE`) that ground the agent in the specific workspace directory structure.
5.  **Externalized State (`write_todos()`):** This is the most critical innovation. By calling `write_todos()` at every step, the agent saves its progress to a file-backed JSON object outside its context window. This prevents "context death" from causing the agent to forget what it has finished.
6.  **Step Execution Protocol (SEP):** A recursive pattern of `Update (in_progress) → Execute → Verify → Update (completed)`. This ensures that no step is skipped and every action is validated.
7.  **Pre-Flight DAGs:** Dependency tables that define what MUST exist before execution (e.g., `.env` files, API keys) and providing `If Missing` recovery paths.
8.  **The Bridge (`🔗 NEXT`):** A deterministic handoff to the next command in the pipeline, ensuring the workflow remains a continuous chain rather than isolated fragments.

## 📂 OUR CODE (142 words)

We manage our entire production harness as a series of `.md` files in the `commands/` directory. These files are not "documentation" for humans; they are "source code" for the agent.

Analyze **`commands/ccf-init.md`** (lines 1-32):
```
# ccf-init.md, line 1-4
# WHY: The YAML metadata allows the harness (Claw/Gemini)
# to index this file as a searchable "slash command" in the environment.

# ccf-init.md, line 22-29
# WHY: write_todos() externalizes the agent's internal plan.
# If the session crashes or the context window truncates, 
# the agent reads the todo state on restart to resume instantly.
```

Analyze **`commands/ccf-weekly.md`** (lines 17-48):
This file demonstrates the "Pre-Flight" pattern. Notice how it checks for the existence of `config.yaml` before proceeding. This is **Dependency DAG** theory applied to natural language instructions.

## 🤖 AGENT PROMPT (124 words)

> **Prompt for [Claude Code/Gemini CLI]:**
> "Analyze the structure of `commands/ccf-init.md` and `commands/ccf-weekly.md`. Using their exact structural patterns (YAML frontmatter, slash header, `// turbo-all`, and `write_todos()` state management), generate a skeleton file for a new command called `ccp-health-check.md`. 
>
> Requirements:
> 1. Include a PRE-FLIGHT step that checks for the existence of `.env` and `src/ccp/`.
> 2. Include 3 empty steps: `CHECK-DATABASES`, `CHECK-AGENTS`, and `REPORT`.
> 3. Use the `write_todos` Step Execution Protocol for every step.
> 4. Ensure the `// turbo-all` annotation is present.
> 
> Save the result to `commands/ccp-health-check.md` once the scaffolding is correct."

## ✅ IMPLEMENTATION STEPS (165 words)

1.  **Deconstruct the Template:** Open `commands/ccf-init.md`. Scroll to Section 0 (line 17). Note how the agent is explicitly commanded: `DO NOT PROCEED until you have called write_todos`. This is "Negative Space Loading"—preventing the agent from being too eager.
2.  **Identify State Persistence:** Look at `commands/ccf-weekly.md`. Notice the `CHECKPOINT` steps. These ensure that the state of the CCP (recorded in `config.yaml`) is updated synchronously with the harness's progress. 
3.  **Scaffold the Command:** Copy the `🤖 AGENT PROMPT` from Section 4 and paste it into your Gemini CLI or Claude Code terminal.
4.  **Review the Artifact:** Open the newly created `commands/ccp-health-check.md`. Verify that it mimics the structural rigidity of the `ccf-*` templates. 
5.  **Audit the Protocol:** Confirm that every step transition in your new command triggers a `write_todos` call. If it doesn't, the command is "soft" and prone to drift during long execution cycles.

## ✅ VERIFY (42 words)

Open `commands/ccp-health-check.md`. Does it contain the `// turbo-all` annotation AND a `write_todos()` call in the initialization section (Step 0)? If yes, the anatomy is correct. If no, re-run the prompt from Section 4.

## 🔗 BRIDGE (47 words)

Unit 4.10 builds on this anatomy by actually authoring the logic inside `ccp-health-check.md`. You have built the skeleton; next, you will give it the "nervous system"—the specific tool calls and validation logic that prove your CCP system is online and healthy.

<!-- FACT-CHECK: "Markdown as executable DSL 2026" → Validated. 2026 trends show Markdown (specifically with YAML/external state) as the standard for portable agent logic. -->
<!-- FACT-CHECK: "write_todos state persistence" → Validated. Externalized state via file-backed JSON (like write_todos) is the primary method for maintaining idempotency in long-range agentic workflows (2026). -->
