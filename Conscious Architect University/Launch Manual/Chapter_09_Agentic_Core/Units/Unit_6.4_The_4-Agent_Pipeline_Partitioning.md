# Unit 6.4: The 4-Agent Pipeline - Functional Partitioning

## 🧠 THE SCIENCE (135 words)

**UNLEARN:** AI agents are not "all-purpose chatbots" or generic reasoning wrappers. Thinking of an agent as a generalized conversationalist is the fastest way to build a brittle, hallucination-prone system that loses therapeutic authority.

In neuroscience, the cerebral cortex operates through **functional modularity**. Your brain does not process language in a single "speech area." Instead, it partitions cognition: **Broca’s area** handles the motor production of speech (sequential syntax), while **Wernicke’s area** handles the comprehension of meaning (semantic extraction). Damage to one leaves the other intact, proving that specialized modules are more robust than monolithic ones.

The CCP architecture mimics this cortical partitioning. By decoupling **Aria** (Psychological Extraction) from **Kimya** (Identity Elicitation), we prevent "cognitive bleed." Each agent is a specialized cluster of neurons designed to execute one cognitive function with 99% precision, rather than ten functions with 70% accuracy.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

At the engineering level, the CCP's 4-agent pipeline implements **Distributed Cognition**. In a monolithic LLM call, the model must simultaneously track the user's intent, the coach's identity, the psychological context, and the safety constraints. This creates high entropy in the attention mechanism, leading to "instruction drift."

The 4-agent pipeline (Aria, Kimya, Guardian, Vidye) solves this through **isolation of concern**:

1.  **Selective Activation:** We use **Vidye (Router)** as the "thalamus" of the system. It intercepts the incoming signal and routes it to the specific cognitive module needed. It does not think about psychology; it only classifies intent.
2.  **Schema-Driven I/O:** Each agent communicates through a strict Pydantic contract. **Aria** doesn't just "talk"; it outputs a `ContextPremise` JSON. This ensures that the downstream orchestrator (**Morgan**) receives structured data, not ambiguous prose.
3.  **State Persistence:** Using **LangGraph checkpointing**, we maintain the state of each agent independently. If the **Guardian** flags a permissions error (FR-GA), the state of **Aria's** extraction is already persisted in the `thread_id` buffer. We don't have to re-run the expensive extraction to fix a safety flag.

This architecture ensures **Sovereign Reliability**. Because agents are decoupled, you can upgrade Aria's underlying model (e.g., from Gemini Flash to a specialized medical-tuned 7B model) without re-writing a single line of Kimya's identity logic. This is true agentic engineering.

## 📂 OUR CODE (185 words)

The 4-agent pipeline is distributed across `src/ccp/agents/`. Trace the implementation of functional modularity in these files:

*   `src/ccp/agents/aria_processor.py` (lines 20-45): Note the `EXTRACTION_PROMPT`. Aria is purely a **Psychological Context Analyst**. It focuses on the 12D premise (fears, enemies, dreams) and Neo4j graph updates.
    ```python
    # aria_processor.py, line 75
    # WHY: Aria extracts 6 dimensions into a structured JSON
    # so the graph-manager can perform 2-hop traversal later.
    extracted = await self._extract_context(transcript)
    ```
*   `src/ccp/agents/kimya_processor.py` (lines 29-66): Kimya is the **Identity Architect**. It only runs during onboarding to distill the "Coach Soul."
*   `src/ccp/agents/guardian_agent.py` (lines 54-90): The **Guardian** handles the `GenesisStage` gates. It is the only agent with "kill" authority over the pipeline.
*   `src/ccp/agents/vidye_router.py` (lines 47-95): The router uses `Gemini-2.0-flash` for <500ms classification, ensuring the correct handler is invoked every time.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Gemini CLI:**
> I am auditing the `aria_processor.py` file. I need to ensure the `EXTRACTION_PROMPT` correctly maps to our 12-Dimensional Context Premise. 
> 1. Read `src/ccp/agents/aria_processor.py`.
> 2. Compare the `fears`, `enemies`, and `dreams` JSON keys to the technical requirement in `Chapter_Syllabus.md` Unit 6.5.
> 3. If any of the 12 dimensions are missing (e.g. Allies, Victories, Antagonists), propose an updated `EXTRACTION_PROMPT` that includes the full schema.
> 4. Ensure the output is strictly JSON as per the `AriaProcessor._extract_context` method requirements.

## ⌨️ TERMINAL (72 words)

```bash
# Test the Vidye Router's classification logic
# We mock a TelegramMessage to verify it routes audio to Aria
python -m pytest tests/test_agents.py -k "test_vidye_routing_voice"

# Expected:
# vidye_router.py:76 - Agent: vidye_router -> Action: classify_message -> Route: voice_note
# PASSED [100%]
```

## ✅ IMPLEMENTATION STEPS (145 words)

1.  **Audit the Thalamic Gate:** Open `src/ccp/agents/vidye_router.py`. Trace the `route()` method from line 54. Identify how it distinguishes between a `/start` command and a raw voice note.
2.  **Verify Schema Integrity:** Open `src/ccp/agents/aria_processor.py`. Locate the `EXTRACTION_PROMPT` (line 20). Verify that it returns `emotional_state` and `pattern_alert` as required in the `soul_resonance` service.
3.  **Inspect Genesis Gates:** Open `src/ccp/agents/guardian_agent.py`. Read the `STAGE_CONFIGS` dictionary (line 54). This is where the sequence of FR0A through FR0E is enforced.
4.  **Confirm Decoupling:** In `src/ccp/agents/kimya_processor.py`, find the `apply_to_soul` method. Notice how it takes an existing `CoachSoul` object and updates only the identity fields—leaving psychological context untouched. This confirms the functional isolation of the content agent.

## ✅ VERIFY (42 words)

Run the integration test: `python -m src.ccp.agents.vidye_router --test "I feel stuck"`. If the log shows `Route: general` and the `ReceiptChain` records the decision with a timestamp, the thalamic gate is functioning correctly.

## 🔗 BRIDGE (40 words)

Understanding the 4-agent pipeline is the prerequisite for **Unit 6.5: Context Engineering**. Now that you know WHO handles the data, you must learn HOW we distill the 12-Dimensional Premise that Aria feeds into our Neo4j memory graph.

<!-- FACT-CHECK: "LangGraph 0.3+ checkpointing persistence" → Confirmed. LangGraph 2026 uses managed checkpointers (InMemorySaver/PostgresSaver) for "super-step" state persistence within threads. -->
<!-- FACT-CHECK: "Cerebral Cortex functional modularity - Broca/Wernicke" → Confirmed. Broca's area (inferior frontal gyrus) vs Wernicke's area (posterior superior temporal gyrus) are classical examples of cognitive specialization in neurobiology. -->
