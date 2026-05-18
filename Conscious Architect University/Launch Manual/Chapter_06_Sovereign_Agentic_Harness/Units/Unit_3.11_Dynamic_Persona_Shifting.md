# Unit 3.11: Dynamic Persona Shifting

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "One system prompt per agent." In the 2026 agentic paradigm, a static system prompt is a liability. It creates "Identity Dilution," where the model’s reasoning mean-reverts toward a generic average rather than maintaining the sharp epistemic edge required for specialized tasks.

Think of **Dynamic Persona Shifting** as the human capability for **Code-Switching**. A surgeon speaks differently to a colleague in the OR than to a child at a birthday party. This isn't just a change in "tone"; it's a shift in the entire cognitive register, vocabulary, and decision-making framework. This mirrors the **Prefrontal Cortex**'s ability to dynamically suppress irrelevant neural sub-networks when switching between tasks. 

In the CCP, we don't ask one agent to "be a coach and an editor." We use the Harness to dynamically inject the precise "Persona Module" (Skill) required for the current millisecond of execution. This keeps the agent's attention focused on the specific constraints of the task, ensuring the output remains surgically precise.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The architecture governing this shift is **Just-In-Time (JIT) Context Injection**. Instead of loading a massive, 100K-token global system prompt that describes every possible agent behavior, the Harness performs **Context Tree-Shaking**. It identifies the specific sub-task (e.g., "Story Diagnosis" or "Voice DNA Extraction") and injects only the relevant `SKILL.md` into the context window at the moment of execution.

This creates what we call **Epistemic Frames**. An Epistemic Frame is a structured, interpretive stance. When the Harness loads the `story-doctor` module, the model adopts a diagnostic frame, prioritizing narrative coherence and arc structures. When it shifts to the `compassionate-photographer`, it adopts an aesthetic frame, prioritizing visual emotion and lighting physics. 

The shift is event-driven. In the CMF pipeline, the **Decision Tree** inside the `story-doctor` parses the raw transcript and determines the optimal narrative arc. This decision is written to the `strategy_brief.json` as `selected_arc`. Downstream commands, like `ccf-hunt`, read this key and JIT-inject the corresponding Hunter persona (e.g., `witness-hunter`). This ensures that the model never "guesses" its identity; its identity is a deterministic byproduct of the project’s current state. This methodology eliminates "Context Rot"—the degradation of reasoning quality that occurs when irrelevant instructions pollute the model's active attention.

## 📂 OUR CODE (100-200 words)

The CCP’s "Persona Library" is externalized into the `cmf/skills/` directory. Each folder is a self-contained epistemic module.

- `cmf/skills/cmf/SKILL.md`: The master index of all 66 specialized personas, organized by family (Hunters, Analysts, Composers, etc.).
- `cmf/skills/cmf/core/story-doctor/SKILL.md`: The primary "routing agent." Note the Decision Tree in Phase 2 (lines 56-94) that maps transcript data to specific Hunter personas.

```python
# story-doctor/SKILL.md, line 63
# WHY: This hard-codes the persona shift based on the data. 
# If the speaker is "Client" and Before/After exists, we 
# FORCE the shift into the "Witness Hunter" persona.
IF speaker == "Client" AND has_before_after == true:
    → ARC = "The Witness"
    → HUNTER = "🔎 THE WITNESS HUNTER.md"
```

The Harness ensures that only the `witness-hunter` logic is loaded during the extraction phase, preventing "Arc Pollution" from other narrative styles.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> "I am currently working on a CMF project. Read the current `strategy_brief.json` in the project folder and identify the `selected_arc`. Based on that arc, search the `cmf/skills/cmf/` directory and find the matching Hunter skill. Perform a 'Persona Audit' by comparing the requirements in the Hunter's `SKILL.md` against our current `ARC_DIAGNOSIS.md` to ensure the Epistemic Frame matches the transcript's emotional texture."

## ⌨️ TERMINAL (50-100 words)

```bash
# Query the strategy brief for the active persona trigger
cat production/*/*_strategy_brief.json | jq '.selected_arc, .required_agents'

# List all available persona modules in the Hunters family
ls cmf/skills/cmf/hunters/

# Verify the Story Doctor's routing logic exists
grep -A 20 "Decision Tree" cmf/skills/cmf/core/story-doctor/SKILL.md
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Audit the Persona Index:** Open `cmf/skills/cmf/SKILL.md`. Notice how 66 specialized agents are decoupled from the core model. This is your "Persona Library."
2. **Trace the Decision Logic:** Open `cmf/skills/cmf/core/story-doctor/SKILL.md` and scroll to the "Decision Tree" (Phase 2). This is the "Switchboard" of the Harness.
3. **Identify Triggers:** Choose three different modules from the index (e.g., `witness-hunter`, `brand-avatar-builder`, `story-doctor`). 
4. **Map the Injection:** For each, identify what specific project signal triggers its injection. (e.g., Witness Arc selection, new project initialization, or music generation phase).
5. **Verify Isolation:** Open `cmf/skills/cmf/hunters/witness-hunter/SKILL.md`. Notice it contains NO mention of other arcs. It is a pure, isolated Epistemic Frame.

## ✅ VERIFY (30-50 words)

Open your `strategy_brief.json`. Does the `selected_arc` match the Hunter skill currently loaded by your `ccf-hunt` command? If the JSON says "The Witness" but you are using the "Breakthrough Hunter," your Epistemic Frame is mismatched.

## 🔗 BRIDGE (30-50 words)

Unit 3.12 builds on this by introducing **Prompt Caching Physics**. Now that you understand how we JIT-inject these 66 personas, you’ll learn how the Harness uses permanent cache IDs to ensure these shifts cost 90% less in tokens.

<!-- FACT-CHECK: "Dynamic Persona Shifting agentic AI 2026" → Modern agents use JIT context injection to adapt tone and logic real-time, reducing context rot (Source: Zignuts 2026 trends). -->
<!-- FACT-CHECK: "Context Tree-Shaking 2026" → Industry term for removing irrelevant context to optimize LLM reasoning (Source: Substack AI Architecture 2026). -->
