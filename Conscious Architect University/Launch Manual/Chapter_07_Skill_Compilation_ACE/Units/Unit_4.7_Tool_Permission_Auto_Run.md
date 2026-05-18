# Unit 4.7: Tool Permission & Auto-Run

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "Automation is a binary toggle between 'on' and 'off'." In production systems, total autonomy is a security vulnerability, while total manual review is a productivity bottleneck. The architect's goal is not to eliminate human-in-the-loop (HITL) gates, but to automate the *filtering* of those gates based on risk thresholds.

Think of this as the **Basal Ganglia Gating** mechanism in your brain. The thalamus — the brain's "relay station" — is constantly primed to execute motor programs (commands). However, the basal ganglia acts as a sophisticated permission gate. It maintains a tonic "brake" on the thalamus (the indirect pathway). Only when the cortical input (the context) signals high reward and low risk does the basal ganglia release that brake (disinhibition), allowing the motor program to "auto-run." 

In your agentic harness, you must architect the same inhibitory controls. We do not want an agent that auto-approves `docker system prune` just because it wants to clean up space; we want a system that auto-runs `ls` but enforces a neurological "No-Go" on destructive commands without human oversight.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

In the 2026 terminal-native paradigm, AI agents inherit the full permissions of the user account running the process. This means your harness can technically delete your entire cloud infrastructure as easily as it can list a directory. To govern this, we implement **Risk Classification Tiers**:

1.  **READ (Safe):** Commands that perform extraction or analysis without state mutation (e.g., `git status`, `ls`, `aws s3 ls`, `grep`). These are typically cleared for autonomous execution.
2.  **WRITE (Caution):** Commands that modify local state or code (e.g., `git commit`, `mkdir`, `npm install`). These require high confidence or "Plan Mode" review.
3.  **DELETE/MGMT (Restricted):** High-blast-radius commands (e.g., `rm -rf`, `aws ec2 terminate-instances`, `terraform destroy`). These should NEVER be cleared for auto-run.

The **Gemini CLI** (v0.34+) enforces this via the `SafeToAutoRun` parameter. When an agent proposes a command, the internal safety gate evaluates the command's risk score. If `SafeToAutoRun=true` is passed by the developer (via a `// turbo` hint in a workflow), the CLI bypasses the interactive prompt.

Conversely, **Claude Code** implements the `// turbo` and `// turbo-all` annotation protocol within markdown-based skill and workflow files. An annotation of `// turbo` above a specific step signals to the runtime that the user has pre-authorized this specific "motor program." If the annotation is missing, the harness defaults to a hardware-interrupted "Pause for Approval" state, protecting the workspace from context-driven hallucinations that might lead to destructive tool use.

## 📂 OUR CODE (100-200 words)

The production harness uses a hierarchical directory called `.agents/workflows/` to store these pre-authorized "motor programs." By externalizing these instructions into markdown files with explicit turbo annotations, we decouple the *logic* of the workflow from the *authority* to execute it.

```markdown
# .agents/workflows/security_audit.md
# WHY: This workflow is pre-authorized for safe 
# read-only operations but requires human gating for 
# any remediation that deletes resources.

1. List all active containers
// turbo
run_command(CommandLine="docker ps --all")

2. Identify orphaned images
// turbo
run_command(CommandLine="docker images -f 'dangling=true' -q")

3. DELETE orphaned images (MANUAL GATE)
# No turbo annotation here. The harness MUST 
# pause for human approval before execution.
run_command(CommandLine="docker rmi $(docker images -f 'dangling=true' -q)")
```

⚠️ **BUILD REQUIRED** — You must initialize the `.agents/workflows/` directory in your workspace root as the repository for these gated instructions.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for [Pi/Claude Code/Gemini CLI]:**
> Create a new directory at `.agents/workflows/`. Inside it, create a file named `harness_onboarding.md`. The workflow must check if the AWS CLI is configured by running `aws sts get-caller-identity`, check for Docker status via `docker --version`, and finally attempt to delete a dummy file `tmp/test_delete.txt`. Annotate the first two steps with `// turbo` but leave the third step unannotated to enforce a manual safety gate.

## ⌨️ TERMINAL (50-100 words)

```bash
# Initialize the target directory
mkdir -p .agents/workflows

# Run a workflow file via your harness
# Expected: Steps marked // turbo execute instantly. 
# Steps without annotations pause for [Y/n] confirmation.
claude workflow .agents/workflows/harness_onboarding.md

# To force SafeToAutoRun on all steps (DANGEROUS)
# Only use this in isolated sandboxes.
gemini workflow .agents/workflows/harness_onboarding.md --turbo-all
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Initialize the Workflow Repository:** Create the `.agents/workflows/` directory in your project root. This is the "Basal Ganglia" of your workspace, storing the gated programs.
2.  **Author the Gated Workflow:** Paste the prompt from Section 4 into your coding agent. Ensure the generated `harness_onboarding.md` has the `// turbo` annotations only on the non-destructive observation steps.
3.  **Execute via the Harness:** Run the workflow using the `claude workflow` or `gemini` command. 
4.  **Observe the Gating Behavior:** Verify that the agent handles the `aws` and `docker` checks autonomously. When it reaches the `rm` command for the dummy file, ensure the harness pauses and presents you with the code/command for review before proceeding.
5.  **Refine Risk Tiers:** Open the workflow and try adding `// turbo` to the delete step. Run it again and notice how the "brake" is released—this is the power of the `// turbo` protocol, and it must be used with architectural discipline.

## ✅ VERIFY (30-50 words)

Run `claude workflow .agents/workflows/harness_onboarding.md`. If the `ls` or `version` checks execute without prompting but the `rm` step requires a manual `Y` input, your permission gating is correctly configured.

## 🔗 BRIDGE (30-50 words)

Unit 4.7 established the security gates for our commands. Unit 4.8: Packaging Harness Extensions builds on this by showing you how to turn these isolated workflows into portable, reusable **Skill Files** that travel with your project.

<!-- FACT-CHECK: "Claude Code // turbo annotation 2026" → // turbo and // turbo-all confirmed for autonomous execution in 2026. -->
<!-- FACT-CHECK: "Gemini CLI SafeToAutoRun 2026" → SafeToAutoRun=true confirmed as the flag for bypassing human approval in Gemini CLI v0.34+. -->
