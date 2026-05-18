# Unit 4.11: Authoring `ccp-onboard` — The Coach Onboarding Command

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Onboarding is a manual administrative hurdle. This is the first lie of the "Agency" model. In the CCP architecture, onboarding is the mathematical extraction of a coach’s soul from raw data. It is not an interview; it is an audit.

Think of **Long-Term Potentiation (LTP)** in neuroscience. LTP is the persistent strengthening of synapses based on recent patterns of activity—essentially, how the brain encodes a memory or a skill. When a coach speaks, writes, or teaches, they fire a specific "cognitive signature." By aggregating 20,000+ words of transcripts, we aren't just reading text; we are identifying the high-frequency synaptic patterns that define their worldview. 

Authoring the `ccp-onboard` command allows us to myelinate this extraction process. We move from the slow, deliberate "prefrontal" effort of manual setup to the "basal ganglia" efficiency of automated orchestration. We are building the machinery that transforms raw, unorganized experience into a structured digital persona capable of autonomous coaching.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The `ccp-onboard` command is a **Natural-Language Agent Harness (NLAH)** artifact. Unlike a traditional Python script that requires rigid syntax, an NLAH command orchestrates the reasoning capability of a model like Gemini 2.5 Pro or Claude 3.7 to execute a multi-stage pipeline with deterministic precision. It treats the LLM as the CPU and the markdown file as the instruction set.

The onboarding pipeline follows six distinct architectural stages:
1.  **PRE-FLIGHT:** Validates that the raw transcripts exist and meet the 20K word threshold for high-fidelity extraction.
2.  **SOUL-EXTRACT:** A First Principles decomposition that distills the coach’s core values, belief systems, and "unlearn" triggers into a structured `soul_values.json`.
3.  **VOICE-DNA:** Analyzes prosody, lexicon, and tonal markers to configure the TTT (Text-to-Thought) and STT (Speech-to-Text) parameters.
4.  **TRIBE-PROFILE:** Cross-references the coach’s content against audience data (Reddit, social comments) to define the ideal client archetype.
5.  **WORKSPACE-INIT:** Provisions the persistent infrastructure—creating the Supabase relational records and the Neo4j knowledge graph nodes.
6.  **TELEGRAM-CONFIG:** Generates the bot token and schedules the check-in cadence in the `config.yaml`.

By formalizing these stages into a harness command, we ensure that every coach onboarded to the CCP receives the same level of architectural integrity. We avoid "configuration drift" where different coaches have slightly different configurations, making the system unmaintainable at scale.

## 📂 OUR CODE (100-200 words)

To build `ccp-onboard.md`, we anchor our architecture in the existing command templates. We do not invent the wheel; we extend the lineage.

- `commands/ccf-init.md`: This is your structural ancestor. It provides the protocol for directory creation, `write_todos()` state persistence, and pre-flight validation logic.
- `commands/ccf-soul-extract.md`: This file contains the actual extraction prompts used in the CMF pipeline. We will wrap these prompts into our `ccp-onboard` stages.

```javascript
// Example from ccf-init.md, adapted for ccp-onboard
// WHY: We use externalized state (todos) so the agent can 
// recover from a context window truncation or a terminal crash.
write_todos({
  todos: [
    { id: "pre-flight", description: "Verify Transcripts", status: "completed" },
    { id: "soul-extract", description: "Running Soul Extraction", status: "in_progress" }
  ]
});
```

The `ccp-onboard` command will inherit the `// turbo-all` annotation, allowing the harness to auto-approve safe infrastructure tasks while pausing for critical "soul" validation.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Gemini CLI:**
> "I need to author a new NLAH command called `commands/ccp-onboard.md`. This command must mirror the structure of `commands/ccf-init.md` but for the Coach Onboarding pipeline. Implement the 6-stage pipeline: PRE-FLIGHT (verify transcripts), SOUL-EXTRACT (extract soul_values.json), VOICE-DNA (extract voice_dna.json), TRIBE-PROFILE (audience analysis), WORKSPACE-INIT (Supabase/Neo4j provisioning), and TELEGRAM-CONFIG (bot setup). Ensure all steps use `write_todos()` for state tracking and include a PRE-FLIGHT table that warns the operator if audience data is missing. Create the file now."

## ⌨️ TERMINAL (50-100 words)

```bash
# Create the command file from the prompt output
touch commands/ccp-onboard.md

# Verify the template is valid markdown and accessible
cat commands/ccp-onboard.md | head -n 20

# Run a test execution for a dummy coach to verify the pre-flight logic
# Expected: Harness identifies missing transcripts and pauses
gemini run commands/ccp-onboard.md --args "test-coach"
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  Open `commands/ccf-init.md` and `commands/ccf-soul-extract.md` in your editor to use as reference templates.
2.  Paste the **Agent Prompt** from Section 4 into your Gemini CLI or Claude Code session.
3.  Review the generated `commands/ccp-onboard.md` file. Ensure it includes the `# /ccp-onboard {coach_name}` header and the `// turbo-all` annotation.
4.  Verify the **PRE-FLIGHT** section contains the transcript word-count check (minimum 20,000 words).
5.  Verify the **WORKSPACE-INIT** section points to the correct Supabase and Neo4j connection strings found in your `.env` file.
6.  Test the command by running the "Terminal" command from Section 5. If the agent fails to identify the missing transcripts, refine the prompt and regenerate.

## ✅ VERIFY (30-50 words)

Run `gemini run commands/ccp-onboard.md --args "val-coach"`. The agent must successfully:
1. Initialize the todo list.
2. Verify existing transcripts.
3. Update `config.yaml` with `status: onboarded`.
Final state check: `grep "status: onboarded" Production/val-coach/config.yaml` → returns match.

## 🔗 BRIDGE (30-50 words)

Unit 4.11 completes our operation of the CLI harness. Now that we can onboard a coach with a single command, we need a place to store their complex, interconnected wisdom. Unit 5.1 begins **Chapter 05: Hypergraph Memory**, where we build the Neo4j graph we just provisioned.

<!-- FACT-CHECK: "NLAH terminal-native 2026" → Standardized as the dominant orchestration pattern for agentic workflows. -->
<!-- FACT-CHECK: "Neo4j Supabase integration 2026" → MCP (Model Context Protocol) is the primary transport layer for this integration. -->
