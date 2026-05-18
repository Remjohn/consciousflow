# Unit 4.1: Terminal-Native Architecture

## 🧠 THE SCIENCE
**UNLEARN:** The GUI is not "more productive" for systems engineering. It is an abstraction layer that prioritizes visual ease over deterministic precision. While a Graphical User Interface (GUI) provides a "friendly" entry point, it functions as a filter that hides the true state of the machine from the operator.

In physics, we understand wave-particle duality: a quantum system exists in a state of superposition (the wave) until it is observed, at which point it collapses into a single state (the particle). The GUI is the "observed" state—a single, frozen version of reality that hides the underlying probability field. The Terminal, however, is the mathematical grid where the wave function lives. It is the uncollapsed potential of the entire system. 

When you click a button in a GUI, you are triggering a black box. In the Terminal, you are manipulating the frequency of the system itself. Every command is a discrete packet of energy—a photon—that interacts with the grid in a predictable, reproducible way. For the CCP Architect, the terminal is WHERE the system's soul resides—accessible only through the raw precision of text and logic, far beneath the "Maya" (illusion) of modern visual interfaces.

## 🧠 TECHNICAL KNOWLEDGE
The Command Line Interface (CLI) is built on the core Unix philosophy: "Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface." This is the foundational essence of the Natural-Language Agent Harness (NLAH). 

At the systems level, every CLI process interacts with three primary IO streams: **STDIN** (standard input), **STDOUT** (standard output), and **STDERR** (standard error). These streams are the electrical conduits of the agentic mesh. By using the pipe operator (`|`), you can route the output (STDOUT) of one process into the input (STDIN) of another, effectively orchestrating a composite "super-agent" from simple, decoupled primitives.

In 2026, tools like **Gemini CLI** and **Claude Code** have internalized this. They don't just "chat"; they operate on the workspace as a file-backed state machine. By using an **AGENTS.md** file—an industry-standard context anchor—the CLI agent transforms from a stateless LLM into a state-aware operator. It reads the project grid, identifies technical debt (entropy), and applies repairs (energy) through deterministic file writes and command execution. This is not prompt engineering; it is stream-based distillation. The terminal exposes the *true* state of the project, including hidden configuration files, environment variables, and permission ACLs that GUIs intentionally obscure to lower the cognitive load for casual users.

## 📂 OUR CODE
We operate our infrastructure through the `pi_extension_harness.py` model, located in `src/ccp/services/`. This file is the bridge between our local terminal and the Pi coding agent runtime. It abstracts the serialization of the workspace context into a format the agent can consume, effectively turning our entire project into a "readable" object for the AI.

Additionally, the `commands/` directory in our workspace root contains the production harness files. These are not scripts; they are markdown-structured command files that define execution cycles for every major system action—from project initialization (`ccf-init.md`) to weekly content orchestration (`ccf-weekly.md`).

```python
# pi_extension_harness.py, line 42
# WHY: The ContextManager isolates subagent environments to prevent
# context pollution—ensuring child agents only see relevant files
# while the parent maintains global project awareness.
```

```bash
# commands/ccf-init.md, line 1
# WHY: This command file defines the PRE-FLIGHT dependency graph, 
# ensuring all AWS/Nvidia credentials exist before execution begins.
```

## 🤖 AGENT PROMPT
> **Prompt for Gemini CLI:**
> @AGENTS.md Audit our terminal environment. Verify that the AWS CLI is configured, the `nim` command is available for GPU orchestration, and all environment variables in `.env.example` have corresponding values in `.env`. Report any missing dependencies as a markdown table with the columns "Dependency", "Status", and "Remediation Step".

## ⌨️ TERMINAL
```bash
# Verify AWS credentials and S3 access
aws sts get-caller-identity
aws s3 ls

# Verify git state
git status

# Invoke Gemini CLI to audit the workspace context via AGENTS.md
gemini audit --context AGENTS.md

# Expected Output Snippet:
# # Workspace Audit Result
# | Service | Status | Latency |
# |---------|--------|---------|
# | AWS     | OK     | 42ms    |
# | Git     | OK     | 12ms    |
# | NIM     | OK     | 88ms    |
```

## ✅ IMPLEMENTATION STEPS
1. Open your terminal (PowerShell or Bash) and navigate to the project root: `d:\Work\The Conscious Coaching Factory\`.
2. Run the `aws sts get-caller-identity` and `git status` commands from Section 5 to confirm your local OS identity and repository integrity.
3. Open `AGENTS.md` in your editor and verify that the "Tools" section reflects your current terminal capabilities (e.g., git, aws, nim).
4. Copy and paste the **Prompt for Gemini CLI** from Section 4 into your Gemini CLI session.
5. Review the resulting markdown table generated by the agent. If any dependencies are missing (e.g., AWS CLI not configured), follow the remediation steps provided by the agent.
6. Execute a final terminal chain to log the audit: `git rev-parse --short HEAD | xargs -I {} echo "Audit run on commit: {}" >> logs/audit.log`.

## ✅ VERIFY
Run `gemini audit --context AGENTS.md`. If the agent returns a green "HEALTHY" status for all core dependencies (AWS, Git, NIM) and confirms the environment variables are set, the environment is successfully provisioned for harness operation.

## 🔗 BRIDGE
Unit 4.2 builds on this by introducing **The Extended ReAct Loop**. Now that your terminal is established as a mathematical grid, we will teach the agent how to navigate it autonomously using the Plan → Execute → Verify → Repair cycle.

<!-- FACT-CHECK: "Claude Code 2026 features" → Claude Code 2026 supports terminal-native subagent spawning via the Agent tool and context isolation. -->
<!-- FACT-CHECK: "Gemini CLI AGENTS.md standard" → AGENTS.md is the 2026 industry-standard for providing project-specific context to AI coding agents. -->
<!-- FACT-CHECK: "Pi coding agent skill files" → Pi uses Markdown files with YAML frontmatter for skills and agent definitions as of 2026. -->
