# Unit 5.8: Graph Injection — Working Context

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** High-capacity context windows are a license for informational laziness. Just because a model *can* accept 2 million tokens doesn't mean it should. Information discipline is the hallmark of a senior agentic engineer.

Think of the "Synaptic Neighborhood" activation in the human brain. To recall the name of a childhood friend, your brain doesn't activate the entire neocortex; it fires a specific, localized fractal of neurons. This is the **Maximum Effective Context Window (MECW)** in action. In the CCP architecture, we treat the LLM prompt not as a bucket, but as a high-fidelity signal processor. 

By injecting only a 2-hop graph fractal — the target node, its immediate neighbors, and *their* neighbors — we provide the model with the exact logical "neighborhood" needed for reasoning without the "context suffocation" that leads to reasoning degradation and hallucination. 2-hop is the Goldilocks zone: broad enough for causality, tight enough for precision.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The physics of graph injection revolves around two competing forces: **Context Coverage** and **Signal-to-Noise Ratio (SNR)**. In 2026-scale RAG systems, "context distraction" is the primary cause of multi-hop reasoning failure. When an LLM is presented with 100 irrelevant facts alongside 5 critical ones, its attention mechanism experiences "dilution," often reverting to random guessing or sticking to the first few tokens it processed.

To solve this, we use **2-Hop Subgraph Extraction**. Technically, this is achieved via the `apoc.path.subgraphAll` procedure in Neo4j 5.x. Unlike a simple 1-hop query (which only gets the immediate attributes), a 2-hop query captures the *relational context* — for example, not just that a client has a [Fear of Failing], but that this fear [TRIGGERS] a [Perfectionism] coping mechanism which in turn [MASKS] a [Childhood_Trauma] node.

This "fractal" of information is then serialized into a Prompt Fragment. We avoid raw JSON, which is token-heavy and lacks semantic hierarchy. Instead, we convert the subgraph into a structured Markdown hierarchy that the LLM's transformer architecture can parse as a logical schema. We prioritize nodes with the highest `provenance_score` (defined in `GraphNode`) and relationships with specific types like `TRIGGERS` or `CONTRADICTS`, which carry the highest causal weight for coaching interventions.

## 📂 OUR CODE (100-200 words)

We will bridge the gap between `neo4j_graph_manager.py` (the data source) and `context_premise_extraction_service.py` (the pipeline).

- `src/ccp/services/neo4j_graph_manager.py`: 🔧 EXTEND — We need to add `get_2_hop_subgraph(start_node_id)` using the `apoc.path.subgraphAll` cypher pattern.
- `src/ccp/services/context_premise_extraction_service.py`: 🔧 EXTEND — We need a `format_subgraph_for_prompt(nodes, relationships)` method that serializes the graph into a markdown fractal.

```python
# neo4j_graph_manager.py, line 430
# WHY: We use APOC over standard Cypher loops because it is 
# optimized for neighborhood traversal, returning paths as 
# distinct node and relationship sets for easier serialization.
query = "CALL apoc.path.subgraphAll($startNode, {maxLevel: 2}) YIELD nodes, relationships"

# context_premise_extraction_service.py, line 433
# WHY: We wrap nodes in [NODES] and relationships in [EDGES] 
# tags to provide clear structural boundaries for the attention mechanism.
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi/Claude Code:**
> 
> "I need to implement the Graph Injection Service described in Unit 5.8. 
> 1. Extend `src/ccp/services/neo4j_graph_manager.py` to include a method `get_2_hop_subgraph(start_node_id: str)` that executes: `MATCH (s {node_id: $start_node_id}) CALL apoc.path.subgraphAll(s, {maxLevel: 2}) YIELD nodes, relationships RETURN nodes, relationships`.
> 2. In `src/ccp/services/context_premise_extraction_service.py`, create a function `generate_working_context_fragment(subgraph_data: dict)` that takes the Neo4j output and converts it into a Markdown string using the format:
>    - Nodes: `- [ID] (Type): Content`
>    - Edges: `- [Source] --(REL_TYPE)--> [Target]`
> 3. Ensure all outputs are coach-isolated as per ADR-01."

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the APOC plugin is active in your local Neo4j instance
docker exec ccp-neo4j cypher-shell -u neo4j -p password "RETURN apoc.version();"

# Test a manual 2-hop extraction for a node ID (replace NODE_ID)
docker exec ccp-neo4j cypher-shell -u neo4j -p password "MATCH (s {node_id: 'NODE_ID'}) \
CALL apoc.path.subgraphAll(s, {maxLevel: 2}) YIELD nodes, relationships \
RETURN count(nodes) as node_count, count(relationships) as rel_count;"
# Expected: node_count > 1, rel_count > 0
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Verify Neo4j APOC:** Ensure your Neo4j container has the APOC plugin installed (standard in the CAU Docker compose). Use the terminal command in Section 5 to confirm.
2. **Extend Neo4j Manager:** Paste the prompt from Section 4 into your agentic CLI. It will add the `get_2_hop_subgraph` method to `neo4j_graph_manager.py`.
3. **Build Injection Formatter:** The agent will also implement the `generate_working_context_fragment` in the extraction service. This logic must prioritize high-intensity nodes (Intensity > 3) if the context becomes too large.
4. **Integration Test:** Open a Python REPL or use `ccp-test` to trigger the service for a known node. For example, query for the "Alcoholism" node created in Unit 5.5 and observe the 2-hop results.
5. **Prompt Verification:** Copy the resulting Markdown string. Is it readable? Does it provide the "why" behind the client's current state?

## ✅ VERIFY (30-50 words)

Run `pytest tests/test_graph_injection.py`. The test should assert that the returned `PromptFragment` contains at least three unique node types related to the starting concept. **Success:** All nodes within 2 steps are present in the final Markdown string.

## 🔗 BRIDGE (30-50 words)

Unit 5.8 concludes our deep dive into the "Graph Brain." Unit 5.9 (Chapter Recap) will package these extraction, traversal, and injection patterns into the final persistence layer that connects your Hypergraph to the Agentic Core in Chapter 6.

<!-- FACT-CHECK: "Neo4j 5 subgraph extraction" → apoc.path.subgraphAll is the standard for 2-hop neighborhood extraction in Neo4j 5.x. -->
<!-- FACT-CHECK: "MECW (Maximum Effective Context Window)" → Term used in 2026 to describe the optimal signal density for LLMs, distinguishing it from physical token limits. -->
<!-- FACT-CHECK: "Context Distraction" → Documented phenomenon in transformer models where irrelevant noise in the context degrades multi-hop reasoning performance. -->
