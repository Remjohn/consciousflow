# Module 11: Prompt Templates & Code Generation Predictability

## Phase I: The Context Anchor
We govern a 76-agent cognitive-behavioral matrix called the **Conscious Coaching Platform (CCP)**, and its autonomous video arm, the **Conscious Media Factory (CMF)**. In this module, we address the critical transition from "conversational hoping" to "deterministic engineering" within the Gemini-CLI and Pi terminal harnesses. 

As we scale the CCP to provide thousands of concurrent, personalized therapeutic sessions, the fragility of natural language becomes our primary adversary. The 76-agent swarm is not a casual chat interface; it is a high-precision industrial machine. Without the rigorous enforcement of **Prompt Templates**, the system rapidly diverges into structural incoherence. Imagine a CMF pipeline where the "Visual Composer" agent—tasked with generating the Visual Cinematic Premise (VCP)—decides to return a poetic description of a sunset instead of the strictly typed JSON schema required by the "FFmpeg Renderer." 

The result is not "creative variation"—it is a catastrophic system crash that halts the production of life-changing video interventions. We rely on the architectural standards defined in the core PRD (`docs/prd/prd.md`) and the `prd-update-visual-control-layer.md` to maintain absolute control over the generative output. This module teaches you how to use the terminal as a CAD station, injecting mathematical predictability into every token the LLM produces. In the 2026 technical landscape, where context windows are deep but "noise density" is high, templates are the only way to ensure the CCP's heartbeat remains steady.

## Phase II: The Negative Space
Before we build, we must first demolish a dangerous and remarkably persistent assumption: the belief that "better prompting" is about finding the right "magic words" to persuade or cajole an AI to behave. This "Conversational AI" myth treats the LLM as a temperamental human intern who needs to be politely asked to follow instructions. 

In a high-stakes infrastructure like the CCP, relying on natural language requests like "Please make me a script to update the database" is a recipe for systemic failure. The AI might forget error handling, use an outdated library, or—more likely—omit the critical "Kill Switch" logic mandated by our safety protocols. 

This belief is false because LLMs are not "thinking"; they are **probabilistic prediction engines**. They calculate the next most likely token based on the statistical distribution of the inputs provided. If your input is a "wish," your output will be a "guess." If you treat the model like a servant, it will behave like a sycophant—telling you what it thinks you want to hear rather than what the engineering physics requires. With this cleared, we can now construct the correct architecture: **Prompt Templates** that act as deterministic boundary conditions, forcing the model's probabilistic nature into a fixed, engineering-grade outcome. We don't "prompt" the agent; we **scaffold its reasoning space**.

## Phase III: First Principles, Lexicon & Systems Engineering
At its most primitive, a Prompt Template is not an instruction; it is a **Boundary Injection**. In the Gemini-CLI and Pi environments, we don't just "talk" to the model; we wrap the session in a pre-defined geometric structure. In systems engineering, we refer to this as an **Output Contract**. Just as a physical bridge must adhere to specific load-bearing mathematics, a piece of code generated for the CMF must adhere to a specific structural schema. 

By using templates, we move the "reasoning load" from the LLM back to the architectural harness. The harness defines the angles, and the model merely fills the space. In the 2026 iteration of the Gemini-CLI, we leverage **Prompt Caching** to ensure that these massive, rigid templates don't consume unnecessary compute or latency. We place the static template at the prefix of the context, freezing its processed state so the agent is already "pre-wired" with our CCP laws before the first dynamic character is even typed.

### THE TECHNICAL LEXICON
1.  **Deterministic Anchor (The "Harness Stop"):** A fixed, non-variable string within a template that forces the LLM to start its response in a specific state. For example, by ending a template with `Output Payload: {`, we mathematically force the first generated token to be a key within a JSON object.
2.  **Output Contract:** A predefined agreement between the agent and the harness specifying the exact format, schema, and constraints of the response. Any response failing this contract is discarded by the harness filters before it reaches the database.
3.  **Schema Injection:** The process of providing the model with a formal definition (like **JSON Schema** or a TypeScript Interface) to guide its generation structure. This acts as the "rebar" within the concrete of the model's output.
4.  **Static Prefix Caching:** A 2026 optimization where the first 32k+ tokens (System Instructions + Templates) are cached, ensuring near-instantaneous response times for deterministic tasks by skipping the re-processing of the "System Identity."

The power of templates in Pi comes from the `/template` command. These aren't just text snippets; they are **Contextual Overlays** that temporarily prune the model's available reasoning paths. By injecting a "Security Hardening Template" mid-session, we physically shift the model's weighting away from "creative flexibility" and toward "conservative verification."

> [!NOTE]
> Have you ever spent forty-five minutes "refining" a prompt only to have the agent respond with "As an AI language model, I cannot..." simply because you used the word "kill" in your `kill_switch.py` documentation? That is the hallmark of an unmapped context. Templates prevent this by explicitly defining the domain as "Mission-Critical Systems Engineering" before the model even begins to process the query. It's the difference between asking a stranger for a favor and handing a pilot a checklist.

## Phase IV: The Pedagogical Association
To understand the deep necessity of Prompt Templates, we must look at two distinct disciplines: **Structural Architecture** and **Behavioral Neuroscience**.

### The Architect’s CAD Station (Primary Bridge)
Imagine you are the Lead Architect for a new skyscraper in the CCP's virtual campus. You do not walk onto the construction site and tell the crew, "Build me a really tall building with lots of glass and maybe some nice stairs." If you did, regardless of how talented the crew was, you would return to find a tilting, unstable heap of materials that vaguely resembles a building but lacks an elevator shaft, plumbing, or emergency exits.

Instead, you provide a **CAD (Computer-Aided Design) Blueprint**. The blueprint specifies the exact thickness of the steel beams, the precise angle of the glass panes, and the mathematical coordinates of every bolt. 

A Prompt Template is the CAD blueprint for code. It doesn't tell the AI "what to think"; it tells the AI **"where to stand."** By defining the angles (the formatting) and the coordinates (the success criteria), you ensure that the AI's "physics engine" (its generative capability) builds a structure that is mathematically sound and ready for integration. In the Pi terminal, your `/template` directory is your library of blueprints. When you invoke a template, you are physically locking the construction crew into a set of non-negotiable geometric constraints.

### The Neuroscience of Priming (Reinforcement Bridge)
Why do templates work so effectively on a neuro-computational level? We look at the concept of **Cognitive Anchoring and Priming**.

In human neuroscience, when a person is shown a series of images related to "cold" (ice, snow, blue colors, shivering people), their brain enters a state of "cold-priming." They will physically react faster to words like "blanket" or "fire" and may even report feeling a drop in temperature. This is because the brain has "pre-activated" the neural pathways associated with that concept, lowering the threshold for those specific signals to fire.

In the 76-agent matrix of the CCP, we apply this same "Neural Priming" via templates. By populating the context with rigorous engineering terminology, security protocols, and specific success criteria **before** the task is described, we anchor the model's "probability cloud" in a state of professional rigor. We aren't just giving it a tool; we are physically shifting its internal personality state into that of a Senior Systems Engineer. A template doesn't just change the words; it changes the **probability of the next thought**.

## Phase V: Python Native Construction
As a module instructor, it is my duty to ensure you can implement these templates locally using the most fundamental tools. In this phase, we will master **String Formatting (f-strings)** and **Multiline Strings**, which are the Pythonic foundations of all template injection.

### THE PYTHON DEFINITION RUBRIC
**What is a Variable?**
A variable is a named "storage bin" in your computer's memory. Imagine a box with a label on it. Inside the box is a value (a number, a word, a list). When you call the variable by its name, Python "reaches into the box" and pulls out the value for you. In our case, variables hold the "building blocks" of our templates.

**What is a String (`str`)?**
A string is simply a sequence of characters—text. Python treats anything inside quotes as a string.

**What is an f-string?**
The `f` stands for "formatted." An f-string is a special type of string in Python that allows you to "inject" variables directly into text. It turns a static sentence into a dynamic blueprint.

**What is a Multiline String (`"""`)?**
By using triple quotes, we can write strings that span multiple lines without needing special "newline" characters. This is essential for drafting the complex "System Instructions" required by the CCP.

### CCP Code Generation Template Implementation
We will now write a script that generates a "System Instruction" for a CCP agent using an f-string template. This mimics how Pi and Gemini-CLI load pre-packaged templates from your `.pi/agent/` directory or local repository.

```python
# =================================================================
# Module 11: Prompt Template Construction (f-string Edition)
# Difficulty Tier: 2 (Intermediate Variables & Formatting)
# =================================================================

# 1. THE ARCHITECTURAL DATA (Our Blueprint Bricks)
# We define our variables first to keep the data separate from the structure.
agent_role        = "CMF_Visual_Composer"
output_schema     = "{ 'scene_id': int, 'primal_analysis': str, 'lighting_vector': list }"
safety_enforcement = "BLOCK all conversational filler. NO introductory text."
context_buffer_id = "CB-7762-GAMMA" # Reference to our internal CCP context ID

# 2. THE CAD BLUEPRINT (The Template)
# We use an f-string with triple quotes to build a multi-line "Harness."
# PRO-TIP: Note the double curly braces '{{' on line 32. 
# This is how we "escape" a bracket so Python doesn't think it's a variable.

system_harness = f"""
### CCP SYSTEM INSTRUCTION: {agent_role}
SYSTEM_STATE: {context_buffer_id}
===========================================================

# ROLE
You are the primary visual strategist within the Conscious Media Factory.
Your reasoning must adhere to the VDP-Native Visual Prompt Generation standards.

# CONSTRAINTS
- {safety_enforcement}
- Determinism Level: 1.0 (Maximum)
- Security Tier: LEVEL_4_ENFORCED

# OUTPUT CONTRACT
You MUST return your response as a single, valid JSON object.
Schema Requirement: {output_schema}

# DETERMINISTIC ANCHOR (START_PAYLOAD)
Payload Output: {{
"""

# 3. DEPLOY THE HARNESS
print("--- [CCP SYSTEM HARNESS GENERATED] ---")
print(system_harness)

# =================================================================
# PROSE WALKTHROUGH:
# =================================================================
# Line 10-14: We define the "Variables." This is "Decoupling." 
# If the PRD changes (e.g., the JSON schema updates), we only change it in one box.
# 
# Line 18: The 'f' tells Python: "Be ready to inject data into this string."
# The triple-quotes allow us to maintain the visual hierarchy of the instructions.
# 
# Line 32: The '{{' is the "Engineering Anchor." 
# By printing a single '{', we tell the LLM: "I've already started the JSON for you. 
# Don't say hello. Don't say sure. Just start with the first key."
# 
# Line 36-37: We print the result. In a real system, we would take this text
# and send it straight to the Gemini-CLI or the Pi 'system' instruction buffer.
```

### WHY WE USE THIS
In the script above, we have transitioned from "talking to the AI" to "building a harness." 
- **The Scaffold:** The string itself is the rigid scaffold of our system. It never changes, regardless of what the AI "thinks."
- **The Dynamic Injection:** By placing `{agent_role}` in the string, we allow our orchestrator to swap out the role based on the needs of the CCP 76-agent matrix.
- **The Deterministic Anchor:** By ending our instructions with `Payload Output: {`, we have eliminated the possibility of it saying, "Sure, I can help with that!" We have bolted the bridge to the ground.

> [!TIP]
> You know that feeling when you're 90% through a long-form generation and the model suddenly switches to a bulleted list when you clearly asked for a comma-separated array? That's what happens when you don't use a Deterministic Anchor. It's the engineering equivalent of building a bridge and forgetting to bolt it to the baseplate. It looks fine until the first truck (the parser) drives across it and the whole thing collapses.

## Phase VI: The Implementation Contract & Bridge
By completing this module, you have achieved the following **Falsifiable Learning Gate**:
- You can demonstrably construct a multi-line Python f-string that injects at least 3 distinct architectural constraints into a system prompt.
- You can explain the "Neuro-Priming" difference between an unmapped conversational request and a CAD-anchored prompt template.
- You can identify and implement a "Deterministic Anchor" to prevent conversational leakage in JSON outputs.

### Reference Files
- `docs/prd/prd.md`: Section 4.2 (Generative Consistency Protocols)
- `gemini_cli_docs_reference/11_prompt_templates.md`: Technical specifications for Pi `/template` injection.
- `docs/prd-update-visual-control-layer.md`: Requirements for CMF-native output schemas.
- `docs/CMF_Pipeline_Documentation.md`: The mapping of agent roles to specific template blueprints.

### Bridge to Module 12
Now that we have professionalized the predictability of our output, we face a new crisis: **Amnesia**. Even the most perfectly formatted agent is useless if it forgets its own history every 50 tokens. In Module 12, we will tackle **Memory Injection and Long-Term State**, learning how to ensure our beautifully templated agents actually remember who they are across the thousands of concurrent user sessions of the Conscious Coaching Platform.
