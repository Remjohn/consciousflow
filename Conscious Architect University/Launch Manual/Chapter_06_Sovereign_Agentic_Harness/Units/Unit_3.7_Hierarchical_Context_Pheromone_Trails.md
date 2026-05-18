# Unit 3.7: Hierarchical Context & Pheromone Trails

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Just stuffing everything into the system prompt guarantees intelligence. False. 200K tokens of context doesn't mean 200K *useful* tokens. Context pollution degrades reasoning; models suffer from "context rot" when force-fed irrelevant history.

Think of it like an ant colony laying **pheromone trails**. An ant doesn't memorize the entire forest map; it follows the immediate chemical gradient left by its peers. When a food source is exhausted, the pheromone evaporates, preventing the colony from chasing dead ends. 

In agentic systems, hierarchical context acts as our pheromone trail. We do not inject a client's entire life story into every interaction. Instead, we extract structured premises and inject only the relevant fractals into the agent's working memory at runtime. This forces the model to reason along high-probability paths (strong pheromones) without hallucinating connections to irrelevant past data. The hierarchy ensures persistent state survives context truncation, giving the CMF its long-term operational continuity.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Advanced systems in 2026 are defined by tiered memory architectures. Instead of relying on naive vector similarity (RAG), which often surfaces semantically similar but structurally irrelevant data, the CCP utilizes a deterministic **4-Level Context Hierarchy**:

1. **Voice DNA**: The permanent archetype and syntactic rules of the coach. Rarely changes.
2. **Coach Profile**: The semantic knowledge base of the coach's methodologies.
3. **Client Session**: The episodic logs of recent interactions.
4. **Ephemeral Override**: The immediate context vector for the current turn, which overrides lower tiers.

This is governed by **Context Forking**. When an agent runs, it evaluates `fork=true` (inherit parent context) versus `fork=false` (isolation). `fork=false` prevents cross-contamination between unrelated tasks, ensuring the agent operates within a strictly bounded "working memory" tier. 

The mechanism that populates this hierarchy is **Premise Extraction**. Rather than storing raw transcripts, the pipeline distills audio into discrete, structured facts. To combat LLM hallucination during this distillation, we enforce a strict grounding mechanism: every extracted premise must be irrevocably tied to an exact, verbatim utterance. If an agent infers a psychological state without an explicit quote, the data is dropped before it can pollute the Neo4j graph. This "extract and condense" loop mirrors human memory consolidation, converting volatile, short-term session data into durable, graph-backed semantic memory.

## 📂 OUR CODE (100-200 words)

The hierarchical distillation is orchestrated in `src/ccp/services/context_premise_extraction_service.py`. This service converts raw Whisper transcripts into grounded `ContextDimensionEntry` rows.

```python
# context_premise_extraction_service.py, line 57
class HallucinationGate:
    @staticmethod
    def filter(entries: list[ContextDimensionEntry]) -> list[ContextDimensionEntry]:
        # WHY: If Aria hallucinates an emotional premise without an 
        # exact, verbatim quote from the client, we silently drop it.
        # This prevents context rot from entering the Neo4j graph.
        return [e for e in entries if e.exact_quote and e.exact_quote.strip()]
```

```python
# context_premise_extraction_service.py, line 259
# WHY: The ContextGraphUpdateAdapter merges ONLY the grounded entries
# into the coach-scoped Neo4j graph. This establishes the durable, 
# long-term "pheromone trail" that future agents will selectively query.
for entry in extraction.evidence_grounded_entries_only:
    self._client.merge_context_entry(...)
```

The pipeline strictly enforces a 5000ms latency budget, guaranteeing that updates to the persistent memory layer do not block the active conversational turn.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Open `src/ccp/services/context_premise_extraction_service.py`. The `_simulate_extraction` method currently extracts psychological triggers, but we need to track somatic (physical) markers to populate a new hierarchy branch. Add a new conditional block that detects the verbatim phrase "I haven't slept" and creates a `ContextDimensionEntry` with `dimension=ContextDimension.SOMATIC_MARKER`, `label="sleep_deprivation"`, and `confidence=0.95`. Ensure it passes the `HallucinationGate`.

## ⌨️ TERMINAL (50-100 words)

```bash
# Run the extraction service tests to verify the HallucinationGate
pytest src/ccp/services/tests/test_context_premise_extraction.py -k test_hallucination_gate

# Expected:
# PASSED [100%]
# (Entries without exact_quote are confirmed dropped)
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/services/context_premise_extraction_service.py` and navigate to the `ContextPremiseExtractionService.run_pipeline` method (line 310).
2. Trace the data flow: Stage 1 (`WhisperTranscriptionAdapter`) generates the raw episodic data. Stage 2 (`AriaExtractionAdapter`) distills it into structured premises.
3. Observe the `HallucinationGate` at line 57. Notice how it acts as a filter to protect the persistent context hierarchy from hallucinated "context rot."
4. Notice how Stage 3 (`ContextGraphUpdateAdapter`) commits the cleaned data to durable memory, establishing the pheromone trail.
5. Paste the prompt from Section 4 into your Claude Code session to extend the simulation stubs with a new `SOMATIC_MARKER` dimension.
6. Verify your implementation by running the test.

## ✅ VERIFY (30-50 words)

Open `context_premise_extraction_service.py`. Can you physically point to the line of code that prevents an inferred, non-quoted emotion from permanently polluting the user's graph memory? → Yes, `HallucinationGate.filter` at line 61.

## 🔗 BRIDGE (30-50 words)

Unit 3.8 builds on this by exploring Token Economics & Query Engine Design. Now that we have a structured hierarchy of context, we must explicitly budget how many tokens an agent is allowed to spend traversing it during a single turn.

<!-- FACT-CHECK: "agentic AI hierarchical context management 2026 pheromone trails memory hierarchy" → Confirmed 2026 industry movement towards tiered memory architectures (working, episodic, semantic) and dynamic routing to prevent context pollution (from Letta/Zep memory frameworks). -->
