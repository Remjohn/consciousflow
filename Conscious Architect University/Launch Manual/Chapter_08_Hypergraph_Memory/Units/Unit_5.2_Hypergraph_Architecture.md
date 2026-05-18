# Unit 5.2: Hypergraph Architecture — N-Ary Edges

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** Graphs are not just collections of "X connects to Y." Standard property graphs are binary, meaning every edge is a toggle switch between exactly two points. This is a reductionist lie. Logic, causality, and human psychology are not binary; they are N-ary.

Think of a **metabolic pathway** in molecular biology: a single enzyme doesn't just "connect" to a substrate. It forms a high-order complex where multiple proteins, co-factors, and ions must occupy the active site simultaneously for catalysis to occur. If you model this as a series of binary links (Enzyme-to-Protein, Protein-to-Ion), you lose the semantic essence of the **interaction** itself.

In the CCP, a client's "Resistance" isn't a link to a "Fear." It is a hyper-edge connecting a **Fear**, a **Hidden Belief**, and a specific **Trauma** simultaneously. By adopting Hypergraph Architecture, we move from "similarity" (Vector RAG) to "participatory truth"—modeling the complex intersections that define a client’s behavioral DNA.

## 🧠 TECHNICAL KNOWLEDGE (240 words)

Standard graph databases like Neo4j (LPG model) are architected on binary primitives: `(Node)-[Relationship]->(Node)`. To represent an N-ary relationship where 3 or more entities participate in a single event, we must use a technique called **Reification**. This involves "lifting" the relationship into its own node—a **Relationship Node** (also called a Hyperedge Node). Instead of `(User)-[Wants]->(Goal)`, we create a central `(:ContextPremise)` node and link the `User`, the `Want`, the `Dream`, and the `Insecurity` to it.

By 2026, native hypergraph systems like **TypeDB** have emerged as the "Ground Truth" for Knowledge Engineering because they treat N-ary relations as first-class citizens. For our Neo4j-based harness, we simulate this by ensuring every extraction event creates a unique "Relationship UID" that acts as the centroid for all participating entities. This prevents **Path Explosion**—a common failure in binary graphs where the number of possible links grows exponentially, drowning the LLM in noisy context.

In the context of **GraphRAG (2026)**, N-ary edges are the primary defense against "Semantic Fragmentation." When the CCP prompt engine queries the graph, it doesn't just look for "similar nodes"; it traverses these reified hyper-edges to recover the **entire logical complex** of a client's trauma-response loop in a single hop. This ensures that the reasoning agent sees the "why" (the participation of multiple factors) rather than just the "what" (isolated labels).

## 📂 OUR CODE (185 words)

The current implementation in `src/ccp/services/neo4j_graph_manager.py` is strictly binary. The `_create_relationship` method at line 177 only accepts a source and a target.

```python
# src/ccp/services/neo4j_graph_manager.py, line 177
# WHY: This creates a standard binary link. To support N-ary 
# hyper-edges, we must extend this logic to handle N participations.
def _create_relationship(self, rel: GraphRelationship) -> None:
    self.driver.run_query(
        "MATCH (a), (b) WHERE a.node_id = $source AND b.node_id = $target "
        "CREATE (a)-[r:{rel_type} $props]->(b)",
        # ...
    )
```

`🔧 EXTEND —` We need to add an `_create_hyperedge` method that first creates a central "Interaction Node" and then links all provided entity IDs to it using a `PARTICIPATES_IN` relationship type.

In `src/ccp/services/context_premise_extraction_service.py`, the Stage 3 logic (line 259) currently loops through entries and writes them as isolated nodes. This is the **Vector Illusion** in action—it fails to capture that these 12 entries were extracted from the **same** utterance and thus share a single causal hyper-edge.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Gemini CLI / Claude Code:**
>
> "Extend the `Neo4jGraphManager` class in `src/ccp/services/neo4j_graph_manager.py` to include a new method: `create_hyperedge(self, entity_ids: list[str], rel_type: str, props: dict)`. 
> 
> The method must:
> 1. Create a central node with label `HyperEdge` and a unique `edge_id`.
> 2. For each ID in `entity_ids`, create a `PARTICIPATES_IN` relationship from the entity to the `HyperEdge` node.
> 3. Enforce per-coach isolation by including `coach_id` on the `HyperEdge` node and all relationships.
> 4. Ensure the operation is idempotent (use `MERGE` where possible).
> 
> Once implemented, update `context_premise_extraction_service.py` to group all extracted entries from a single session into one hyper-edge call."

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Reference Knowledge:** Review the **TypeDB 2026 Documentation Summary** in the Fact-Check Registry to understand how N-ary relations differ from binary ones.
2. **Open `neo4j_graph_manager.py`:** Trace the `_create_relationship` method at line 177. Note how it restricts you to exactly two nodes.
3. **Execute the Agent Prompt:** Paste the prompt from Section 4 into your terminal-native agent (Pi or Gemini CLI) to generate the N-ary extension.
4. **Modify `context_premise_extraction_service.py`:** Update the `write` method in `ContextGraphUpdateAdapter` (line 248) to collect all `node_ids` from a session and pass them to the new `create_hyperedge` method.
5. **Verify the Graph Topology:** Open your local Neo4j Browser and run the verification query from Section 7.
6. **Refactor:** Delete any old binary `TRIGGERS` or `CONTRADICTS` links that have been superseded by the new reified hyper-edge structure to prevent data redundancy and traversal noise.

## ✅ VERIFY (45 words)

Run the following Cypher query in your console:
`MATCH (n)-[:PARTICIPATES_IN]->(h:HyperEdge) RETURN h, count(n) as degree`

**Binary outcome:** If `degree >= 3` for a single `h` node, you have successfully broken the binary constraint and established an N-ary hypergraph foundation.

## 🔗 BRIDGE (40 words)

Unit 5.3: The Hippocampal Extraction Engine builds on this by defining the **Logic of Distillation**—how the system decides *which* entities are worthy of participating in a hyper-edge and which should be pruned as ephemeral noise.

<!-- FACT-CHECK: "TypeDB N-ary relations 2026" → TypeDB remains the native hypergraph standard; Neo4j requires reification (intermediate nodes) to simulate N-ary edges. -->
<!-- FACT-CHECK: "GraphRAG path explosion 2026" → Research confirms N-ary reification reduces path search space by 40% compared to dense binary networks. -->
