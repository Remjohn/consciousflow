# Unit 5.5: Temporal Logic — Chronological Edges

## 🧠 THE SCIENCE (135 words)

**UNLEARN:** A hypergraph is NOT a static snapshot of knowledge. In most RAG systems, data is treated as "eternal," leading to a catastrophic loss of causality. If you store a client's "depression" as a static node without a temporal anchor, the system will conflate who the client *was* three years ago with who they *are* today. 

Think of this like **Stratigraphy** in geology. Each layer of sediment encodes a specific era; the deeper the layer, the older the event. You cannot understand the evolution of a landscape by mixing all the dirt into a single bucket. Similarly, the human brain uses **Time Cells** in the hippocampus to "timestamp" episodic memories, allowing us to distinguish between a resolved trauma and an active wound. In the CCP, temporal logic is our "geological record." We use chronological edges to map the **Causal Chain** from past struggle to future growth, ensuring the coaching engine never treats a victory as a current crisis.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

Mapping time in a 2026 hypergraph architecture requires moving beyond the legacy "Time Tree" anti-pattern. Historically, developers created complex hierarchies of `Year -> Month -> Day` nodes, which caused massive performance bottlenecks due to "pointer chasing" and relationship hotspots. Modern best practices instead leverage **Native Temporal Properties** combined with **B-Tree High-Performance Indexing**.

In our Neo4j implementation, every relationship that represents a state change (such as `[Alcoholic]-->(PRECEDES)-->[Sober]`) or an episodic event (such as a coaching check-in) carries a `DateTime` property. This allows the Cypher engine to perform lightning-fast range scans—identifying all relevant context within a specific 48-hour window—without traversing a manual tree. 

Crucially, we maintain the **Causal Chain** using the `:NEXT` relationship pattern. This creates a directed linked list between chronologically adjacent events for a specific entity. By following the `:NEXT` path, the CCP can trace the "velocity" of a client's change, detecting whether a behavioral pattern is accelerating or decaying. 

We also implement **Temporal Validity Gates** using `validFrom` and `validTo` properties on edges. This prevents "Future Leakage," ensuring that when the agent queries the graph for context related to a specific past session, it only sees the world as it existed *at that moment*. This is the engineering foundation of deterministic empathy: the ability to see the client's past through the lens of their then-current reality.

## 📂 OUR CODE (142 words)

Our primary implementation of temporal logic lives in the `src/ccp/services/four_axis_matching_engine.py` service. This engine evaluates structural congruence across four dimensions, with the fourth being **Temporal Position**.

```python
# four_axis_matching_engine.py, line 549
# WHY: We score the temporal axis to ensure coach triggers match 
# the client's current PTG (Post-Traumatic Growth) status.
# A "Resolved" coach trigger must align with a "Pre-PTG" audience segment.
def _score_temporal_position(
    self, trigger: dict[str, Any], coord: L3StructuralCoordinate
) -> AxisScore:

# line 577
# WHY: This condition enforces chronological causality. If the coach 
# has resolved a trauma (resolved_dual_layer) and the audience shows 
# temporal indicators of being "currently inside" the struggle, 
# we have a CONGRUENT match.
if coach_ptg == "resolved_dual_layer" and has_temporal_evidence:
    return AxisScore(..., congruence=AxisCongruence.CONGRUENT, score=SCORE_EXACT)
```

`🔧 EXTEND —` We need to refactor `_score_temporal_position` to ingest a `lookback_duration` from the `PantryConfig`, allowing the engine to decay the importance of older, resolved nodes during the matching process.

## 🤖 AGENT PROMPT

> **Prompt for Gemini CLI / Claude Code:**
> "I need to extend the `FourAxisMatchingEngine` in `src/ccp/services/four_axis_matching_engine.py` to support duration-aware temporal filtering.
> 
> 1.  Modify the `_score_temporal_position` method to accept an optional `reference_time` (defaulting to the current UTC time).
> 2.  Update the logic to calculate the `Duration` between the node's `timestamp` property and the `reference_time`.
> 3.  Implement a 'Temporal Decay' function where matches lose 0.1 score for every 6 months of distance from the `reference_time`, unless the node is marked with a `:PERMANENT` label.
> 4.  Write a Cypher query utility in `src/ccp/services/neo4j_graph_manager.py` called `get_chronological_chain(entity_id)` that returns the full `:NEXT` relationship path for a specific UUID, sorted by the `DateTime` property."

## ⌨️ TERMINAL (84 words)

```bash
# Create a B-Tree index on the timestamp property for fast chronological range scans
cypher-shell -u neo4j -p your_pass "CREATE INDEX node_timestamp_idx FOR (n:Event) ON (n.timestamp)"

# Verify the index status (Wait for ONLINE status)
cypher-shell -u neo4j -p your_pass "SHOW INDEXES"

# Test a range query: find all client 'Insights' from the last 7 days
cypher-shell -u neo4j -p your_pass "MATCH (i:Insight) WHERE i.timestamp >= datetime() - duration('P7D') RETURN i.text"
```

## ✅ IMPLEMENTATION STEPS (165 words)

1.  **Initialize Temporal Indexes:** Run the `CREATE INDEX` command from the Terminal section to ensure Neo4j is optimized for date-time range queries.
2.  **Audit the Matching Engine:** Open `src/ccp/services/four_axis_matching_engine.py` and identify line 549. Observe how `coach_ptg` is currently compared to `temporal_position_evidence` without raw timestamp arithmetic.
3.  **Deploy the Temporal Extension:** Paste the prompt from Section 4 into your agent (Pi, Claude, or Gemini) to generate the refactored temporal logic and the `:NEXT` chain utility.
4.  **Wire the Chain:** Update your extraction service to include a `MERGE` statement in Cypher that links the new event node to the previous one using the `:NEXT` relationship (e.g., `MATCH (last:Event {entity_id: $id}) WHERE NOT (last)-[:NEXT]->() CREATE (last)-[:NEXT]->(new:Event {...})`).
5.  **Configure Lookback:** Update your system configuration to set a `GLOBAL_LOOKBACK_PERIOD` (e.g., `P2Y` for 2 years), ensuring the engine ignores prehistoric data that has been pruned from the active context.

## ✅ VERIFY (42 words)

Run this Cypher query:
`MATCH (a:Event)-[r:NEXT]->(b:Event) RETURN a.timestamp, b.timestamp`
→ **Binary Check:** If `b.timestamp` is consistently greater than `a.timestamp` across all results, the chronological chain is intact and temporal causality is enforced.

## 🔗 BRIDGE (39 words)

Unit 5.6: Entity Resolution & Identity Merging builds directly on this by using temporal anchors to disambiguate identical names—ensuring that "John" the 1998 bully is never confused with "John" the 2026 client, despite the shared surface form.

<!-- FACT-CHECK: "Neo4j 5.x temporal indexes 2026" → Neo4j 5.x introduced optimized B-Tree and Range indexes for DateTime types, moving away from legacy point-in-time tree structures. -->
<!-- FACT-CHECK: "Cypher duration logic 2026" → The duration data type in Cypher remains the standard for temporal arithmetic (ISO 8601 duration format), supported in building.nvidia.com graph containers. -->
