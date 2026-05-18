# Unit 3.7: Hierarchical Context & Pheromone Trails

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "Just stuff everything into the system prompt." Massive context windows are a trap. In 2026, we know that "Lost in the Middle" effects and context poisoning degrade an agent's reasoning capability linearly as irrelevant noise increases. An agent with 200k tokens of unpruned history is an agent with a diluted focus.

Think of an ant colony. An individual ant doesn't store the entire map of the forest in its head. Instead, it relies on "Pheromone Trails"—persistent, chemical markers left in the environment. Future ants (subsequent agent turns) don't need to know every failed path; they only need to sense the most recent, highest-intensity trail to perform the next correct action.

In the CCP, the "head" is the Ephemeral Context (the current turn), while the "trails" are stored in our Neo4j ontology. This unit teaches you how to manage this 4-level gravity well, ensuring the agent always has the signal it needs without the noise that distracts it.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The CCP manages context hygiene through a strict 4-Level Memory Hierarchy. Level 1 is **Voice DNA**: the foundational, immutable identity of the coach that governs every output. Level 2 is the **Coach Profile**: the specific program parameters and strategic mandates. Level 3 is the **Client Session**: the multi-day history of client interactions. Level 4 is the **Ephemeral Override**: the immediate task-specific instructions for the current turn.

When an agent executes a task, we use **Context Forking** to protect the integrity of the primary session. A fork (`/fork`) creates a branched context at a specific point in time. If an agent's sub-task (like generating a complex script) results in an error or hallucination, we simply delete the fork. This prevents "Context Poisoning"—where a previous error corrupts the agent's future logic—ensuring the main "trunk" of the conversation remains pristine.

In production, we optimize this through **Information Discipline**. Instead of passing raw history, the `context_premise_extraction_service` distills previous turns into a high-fidelity "Premise Map." This map is written to our Neo4j graph as our version of pheromone trails. Subsequent agent turns perform a JIT (Just-In-Time) retrieval from this graph, injecting only the necessary context fractals. This maximizes the signal-to-noise ratio, reduces token costs by up to 90% via prompt caching, and ensures the agent operates with the precision of a surgical tool rather than a generic chatbot.

## 📂 OUR CODE (100-200 words)

Our context management logic lives in `src/ccp/services/context_premise_extraction_service.py`. This service ensures that we never "ghost" previous client insights but store them as searchable state.

```python
# context_premise_extraction_service.py, line 49
class HallucinationGate:
    """FR29 §4 Stage 2: Drop any ContextDimensionEntry without exact_quote.
    AC2: If the extractor produced an entity not verbatim traceable to the
    transcript, it is dropped — not returned as None, not annotated.
    """
```

```python
# context_premise_extraction_service.py, line 401
# Stage 3: Neo4j Ontology Update
# This is WHERE the 'pheromone trail' is actually written.
# We don't just 'remember' the insight; we persist it into 
# the coach-scoped graph (ADR-01).
graph_latency = self._graph.write(
    extraction=extraction,
    coach_id=self.coach_id,
)
```

The `HallucinationGate` is our defense against context poisoning. If the extraction agent cannot point to an `exact_quote`, the insight is discarded. This ensures our "pheromone trails" are built on reality, not hallucinations.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Open `src/ccp/services/context_premise_extraction_service.py` and analyze the `run_pipeline` method. Notice how Stage 1 (Whisper) failure triggers a fallback to the `previous_extraction` (line 348). Write a new test file `tests/test_context_fallback.py` that simulates a Whisper timeout (`WHISPER_TIMEOUT_MS`) and verifies that the service correctly returns the `previous_extraction` with `transcript_null=True`. This proves our context-persistence strategy survives API-level failures.

## ⌨️ TERMINAL (50-100 words)

```bash
# Run the context fallback test
pytest tests/test_context_fallback.py -v

# Expected:
# tests/test_context_fallback.py::test_whisper_timeout_fallback PASSED
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/services/context_premise_extraction_service.py`.
2. Locate the `run_pipeline` method starting at line 310. Trace the logic from Stage 1 through Stage 3.
3. Identify the `HallucinationGate` at line 48. Understand why we require an `exact_quote` for every "pheromone" we write to the graph.
4. Review the `ContextGraphUpdateAdapter` at line 235. Notice how we scope the Neo4j client to the `coach_id` to prevent cross-coach data leakage (ADR-01).
5. Paste the prompt from Section 4 into your Claude Code session to generate the fallback test.
6. Run the test in Section 5 to verify that even when the "ears" (Whisper) fail, the "memory" (Context Persistence) maintains the system state.

## ✅ VERIFY (30-50 words)

Draw the 4-Level Memory Hierarchy on a piece of paper. Label each level (Voice DNA, Coach Profile, Client Session, Ephemeral Override). Can you identify which level the `context_premise_extraction_service` writes to? (Answer: Level 3).

## 🔗 BRIDGE (30-50 words)

Unit 3.8 builds on this by introducing Token Economics & Query Engine Design—teaching you how to set hard budgets for these context injections so your "pheromone trails" don't accidentally bankrupt your production deployment.

<!-- FACT-CHECK: "Claude Code /fork command" -> Introduced in 2025/2026, standard for context hygiene. "LLM lost in the middle 256k tokens" -> Still an issue in 2026; structured context retrieval (JIT) is the engineering standard solution. "Neo4j agentic memory" -> Common pattern for persistent ontologies in agent swarms. -->
