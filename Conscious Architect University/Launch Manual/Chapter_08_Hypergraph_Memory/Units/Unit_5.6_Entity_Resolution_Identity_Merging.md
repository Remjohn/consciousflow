# Unit 5.6: Entity Resolution & Identity Merging

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Each mention in a transcript is NOT a separate entity. Just because a client says "my dad" in session 1, "my father" in session 4, and "John Senior" in session 12 does not mean your hypergraph should have three distinct nodes. If you treat them as separate, your causal reasoning engine will fail to connect the childhood trauma associated with "Dad" to the current relationship conflict with "John Senior."

Think of this like the **Federal Census**. A census taker doesn't just record every name they hear; they must resolve every "Johnny," "John," and "Mr. Smith" at a specific address to a unique Social Security Number or UUID. In neuroscience, this mirrors the **Association Cortex**, which takes disparate sensory inputs—the smell of coffee, the heat of the cup, the sight of the dark liquid—and resolves them into a single coherent object perception. Without entity resolution, the CCP is "blind" to the continuity of the client’s internal world, treating a lifelong pattern as a series of disconnected accidents.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Entity Resolution (ER) in a 2026 agentic architecture is a multi-stage hybrid pipeline. We move beyond simple Levenshtein string distance to a structural, context-aware reconciliation process.

1.  **Blocking & Indexing:** To avoid comparing every node to every other node ($O(n^2)$), we use "blocking." We partition nodes into buckets based on shared coarse attributes or vector proximity. Using **Neo4j vector indexes** or **pgvector**, we quickly identify "candidate pairs" that are semantically similar.
2.  **Semantic Matching (LLM-as-a-Judge):** For each candidate pair, we pass the local sub-graph—the node’s properties and its immediate neighbors—to an LLM. The LLM acts as a semantic validator: "Are 'My Father' and 'John (the alcoholic)' the same person based on these 3 relationships?" This handles the nuance that traditional fuzzy matching misses.
3.  **Graph-Native Reconciliation:** We leverage the **Neo4j Graph Data Science (GDS)** library. Algorithms like **Weakly Connected Components (WCC)** cluster matches together. If Node A matches Node B, and Node B matches Node C, WCC identifies the entire cluster {A, B, C} as a single entity.
4.  **The Master Merge:** We use the `apoc.refactor.mergeNodes` procedure to collapse the cluster into a single **Canonical UUID**. This preserves all incoming and outgoing relationships, effectively "folding" the graph's redundant dimensions into a high-density knowledge core.

Failure to resolve entities leads to "Identity Fragmentation," where the LLM’s context window is filled with redundant facts, diluting the signal and increasing the risk of hallucinated contradictions.

## 📂 OUR CODE (100-200 words)

Our current extraction logic lives in `src/ccp/services/appraisal_extractor.py`. While this service is primarily focused on emotional DNA, it performs the critical "Entity Extraction" required for resolution.

```python
# src/ccp/services/appraisal_extractor.py, line 289
# WHY: We extract proper nouns as high-specificity stimulus markers. 
# These extracted strings are the "surface forms" that must be 
# resolved into canonical UUIDs in the next pipeline stage.
proper_nouns = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", text)

# line 301
# WHY: Specific references like "clause" or "policy" are often 
# entities in the client's work-life context that require 
# resolution to map systemic blockers across sessions.
specific_refs = re.findall(
    r"\b(\d{4}|\d+%|section \d|clause|regulation|policy|rule \d)\b",
    text, re.IGNORECASE,
)
```

`🔧 EXTEND —` We need to wrap these extracted strings in a `ResolutionTarget` object that carries the `session_id` and `timestamp`, allowing the ER pipeline to use temporal context to disambiguate two different "Johns" (e.g., a friend vs. a father).

## 🤖 AGENT PROMPT

> **Prompt for Pi / Claude Code:**
> "I need to implement an Entity Resolution script for our Neo4j hypergraph. 
> 
> 1. Read `src/ccp/services/appraisal_extractor.py` to see how we extract proper nouns.
> 2. Create a new file `src/ccp/services/entity_resolution_service.py`.
> 3. Write a Cypher query using `apoc.periodic.iterate` to find all nodes with the label `:Entity` where the `name` property is fuzzy-matched using `apoc.text.jaroWinklerDistance` > 0.85.
> 4. Use `apoc.refactor.mergeNodes` to merge these nodes, ensuring the `uuid` property is preserved from the oldest node and all relationships are consolidated.
> 5. Include a 'Human-in-the-Loop' flag that marks ambiguous matches (score 0.7-0.85) for manual review in the AFFiNE dashboard."

## ⌨️ TERMINAL

```bash
# Run the entity resolution Cypher script via the Neo4j CLI
cypher-shell -u neo4j -p your_password -f scripts/resolve_entities.cypher

# Expected Output:
# 28 nodes merged. 142 relationships updated. 
# 4 ambiguous matches flagged for review.
```

## ✅ IMPLEMENTATION STEPS

1.  **Extract Surface Forms:** Run the `AppraisalExtractor` in `appraisal_extractor.py` on a multi-session corpus to generate a list of extracted proper nouns.
2.  **Seed the Graph:** Use the `neo4j_graph_manager.py` (referenced in the Syllabus) to write these as raw `:Entity` nodes with a `surface_form` property.
3.  **Execute Blocking:** Run a Cypher query to identify entities sharing the same first 3 letters or the same `session_id`.
4.  **Run Resolution:** Paste the prompt from Section 4 into your agent to generate the `entity_resolution_service.py`.
5.  **Merge Cluster:** Execute the generated Cypher script to perform the `apoc.refactor.mergeNodes` operation on the Neo4j instance.
6.  **Update Registry:** Ensure the `launch_manual_unit_registry.md` at the root is updated to reflect the completion of Unit 5.6.

## ✅ VERIFY

Run this Cypher query:
`MATCH (e:Entity) WHERE e.name IN ["Dad", "Father"] RETURN count(e)`
→ **Binary Check:** If the count is `1`, the resolution is successful. If the count is `2`, the nodes remain fragmented and the ER logic failed.

## 🔗 BRIDGE

Unit 5.7 builds on this by introducing **Graph Pruning — The Physics of Forgetting**. Now that we have merged our entities into high-density nodes, we must prune the "noise" edges—low-weight connections that survived the merge—to ensure the traversal engine doesn't get lost in a "dense-graph" hallucination loop.

<!-- FACT-CHECK: "Neo4j APOC mergeNodes 2026" → apoc.refactor.mergeNodes remains the gold standard for node consolidation, supported in Neo4j 5.x and 2026 enterprise releases. -->
<!-- FACT-CHECK: "Entity Resolution hybrid LLM 2026" → State-of-the-art pipelines now use LLM-based verification (GPT-5/Claude 4/Gemini 2.x class) for the final matching decision to reduce false positives in high-stakes personal data. -->
