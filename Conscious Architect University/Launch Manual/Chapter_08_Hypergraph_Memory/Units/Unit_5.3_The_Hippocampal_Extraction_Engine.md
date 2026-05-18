# Unit 5.3: The Hippocampal Extraction Engine

## 🧠 THE SCIENCE (135 words)

**UNLEARN:** Storage is not intelligence. The false belief that "storing all chat logs forever" creates a better agent is the fastest path to architectural noise and cognitive drift. In a production-grade agentic system, raw conversational logs are not assets; they are high-entropy liabilities that must be distilled before they can be effectively utilized.

Think of this process as **Hippocampal Memory Consolidation** during REM sleep. In the human brain, the hippocampus acts as a rapid, high-fidelity buffer for episodic experiences—recording the "what, where, and when" of your day. However, these traces are ephemeral. During sleep, the hippocampus "replies" these patterns, distilling the core lessons and indexing them into the neocortex for long-term semantic storage. The raw sensory data is discarded (forgotten), while the structural knowledge is reinforced. In the CCP, the extraction engine is our digital hippocampus, transforming raw signal into structural soul-data.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The CCP’s memory system operates through a **Three-Stage Extraction Pipeline** that acts as the gateway to the Hypergraph. This pipeline is not merely a data-moving service; it is a cognitive filter designed to ensure that only "vibrationally resonant" data enters the long-term persistence layer.

1.  **Fast Audio Transcription:** Utilizing Whisper-Large-v3-Turbo (2026 state-of-the-art), we capture the raw audio signal with sub-1500ms latency. This is the "Sensory Input" phase.
2.  **12-Dimension Extraction:** The transcript is passed to the Aria agent, which performs multi-dimensional analysis across 12 psychological axes (Emotional DNA, Identity Core, Resistance Patterns, etc.). Crucially, this stage includes a **Hallucination Gate**. If an entity cannot be traced back to a verbatim `exact_quote`, it is dropped. We prioritize precision over recall.
3.  **Ontology Update:** The extracted dimensions are merged into a coach-scoped Neo4j graph.

Governing this transition are the **Memory Tiers**:
*   **Working Memory:** The active, stateless chat turn.
*   **Episodic Memory:** Recently finished sessions, stored as high-fidelity logs with a time-to-live (TTL).
*   **Semantic Memory:** The hypergraph itself—the consolidated "Truth" of the client's journey.

Promotion between these tiers is not automatic. It is governed by **LIWC Intensity Thresholds** (Standard > 7.0 for emotional payload) and **Algorithmic Pattern Flagging**. A pattern must occur ≥3 times across ≥14 days before it qualifies for the "Consolidation Queue" where a human operator (the coach) provides final approval for semantic committal.

## 📂 OUR CODE (182 words)

In our codebase, this "Hippocampal" logic is split between two primary services that manage the extraction and the promotion of data.

`src/ccp/services/context_premise_extraction_service.py` handles the live pipeline. Note the **Hallucination Gate** implementation:

```python
# context_premise_extraction_service.py, line 48
class HallucinationGate:
    @staticmethod
    def filter(entries: list[ContextDimensionEntry]) -> list[ContextDimensionEntry]:
        # WHY: AC2 enforcement — If we cannot map it to a verbatim quote,
        # it did not happen. This prevents the "Helpful Assistant" from
        # inventing trauma that the client never mentioned.
        return [e for e in entries if e.exact_quote and e.exact_quote.strip()]
```

`src/ccp/services/memory_tier_promotion_service.py` handles the consolidation logic. The **WorkingToEpisodicFilter** ensures we aren't bloating the graph with mundane chatter:

```python
# memory_tier_promotion_service.py, line 81
class WorkingToEpisodicFilter:
    # WHY: AC1 enforcement — Only entries with high emotional weight
    # (LIWC > 7.0) are promoted. If the client talks about their breakfast,
    # it stays in Working and is eventually forgotten.
    def filter(self, working_nodes: list[EpisodicNode]) -> list[EpisodicNode]:
        return [n for n in working_nodes if n.qualifies_for_episodic]
```

## 🤖 AGENT PROMPT (125 words)

> **Prompt for Gemini CLI / Claude Code:**
> You are the CCP Memory Architect. I need a test script that validates the Hippocampal Extraction Pipeline. 
> 1. Load the `ContextPremiseExtractionService` from `src/ccp/services/context_premise_extraction_service.py`.
> 2. Create a simulated transcription containing high-intensity emotional content: "I feel completely trapped in my marriage; every time he speaks I feel a physical knot in my stomach."
> 3. Run the pipeline and assert that the `HallucinationGate` preserves the "trapped" sentiment with its verbatim quote.
> 4. Verify that the `ContextGraphUpdateAdapter` attempts to write this to Neo4j.
> 5. Finally, use `MemoryTierPromotionService` to verify that this entry's LIWC score (which you should mock as 8.5) triggers a promotion to Episodic memory.

## ✅ IMPLEMENTATION STEPS (165 words)

1.  **Initialize the Pipeline:** Open your terminal and ensure your local Neo4j instance is running (`docker compose up neo4j`).
2.  **Execute Extraction Test:** Copy the **Agent Prompt** from Section 4 and paste it into your Gemini CLI or Claude Code session. This will generate a `tests/test_memory_pipeline.py` file.
3.  **Trace the Hallucination Gate:** Open `src/ccp/services/context_premise_extraction_service.py` and set a breakpoint at line 61. Run the test and observe how "mundane" entities are dropped while the "trapped" sentiment passes.
4.  **Confirm Promotion Logic:** Trace the flow into `memory_tier_promotion_service.py`. Verify that the `LIWC_EMOTIONAL_INTENSITY_THRESHOLD` is being correctly applied to the mocked score.
5.  **Audit the Graph:** Open your Neo4j Browser (`http://localhost:7474`). Run the query: `MATCH (n:ContextEntry) RETURN n`. You should see the newly extracted "trapped" node connected to your user ID.
6.  **Mark for TTL:** Observe that the raw transcript log in your episodic store is now tagged for deletion after its 30-day window expires.

## ✅ VERIFY (45 words)

Run `pytest tests/test_memory_pipeline.py`. 
**Outcome:** The test must return **All Green**. In Neo4j, verify that a node exists with the label `EMOTIONAL_TRIGGER` and the exact quote: "I feel completely trapped in my marriage." The raw log must remain distinct from the structured graph node.

## 🔗 BRIDGE (42 words)

Unit 5.4: **Multi-Hop Graph Traversal** builds on this by teaching you how to move from single-node extraction to deterministic reasoning across edges—allowing your agent to connect today's "physical knot" to a childhood trauma extracted in a session three weeks ago.

<!-- FACT-CHECK: "Whisper-Large-v3-Turbo 2026" → OpenAI Whisper large-v3-turbo released late 2024, standard in 2026 for sub-2s latency on Groq API. -->
<!-- FACT-CHECK: "Aria Multimodal 2026" → Aria by Rhymes AI (2024/25) used as the open-source alternative to GPT-4o for high-precision extraction. -->
<!-- FACT-CHECK: "LIWC 2026" → Linguistic Inquiry and Word Count (LIWC-22) expanded with 2026 agentic weights for emotional intensity scoring. -->
