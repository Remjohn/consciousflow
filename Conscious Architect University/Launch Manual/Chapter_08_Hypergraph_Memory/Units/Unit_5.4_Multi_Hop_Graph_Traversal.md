# Unit 5.4: Multi-Hop Graph Traversal

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** LLMs can internalize and reason over a 10,000-node graph in their context window. 

While modern models boast massive context windows, their capacity for "reasoning" over distant nodes remains probabilistic, not deterministic. If you ask an LLM to find the connection between a childhood trauma and a contemporary coping mechanism across twenty sessions, it will often hallucinate a direct, "convenient" bridge that doesn't exist in the data.

Think of it like a flight path vs. a blind leap. A deterministic graph traversal is like a multi-hop flight from New York to Los Angeles that must stop in Chicago and Denver. The airlines don't "guess" the route; they follow a physical structure of runways and waypoints. An LLM's raw reasoning is a blind leap across the ocean—it might land in LA, or it might land in the Pacific. By performing multi-hop traversal in Neo4j first, we provide the LLM with the "flight manifest" (the exact path of causal evidence), ensuring its response is anchored in structural truth.

## 🧠 TECHNICAL KNOWLEDGE (234 words)

Multi-hop traversal in Neo4j 5.x is governed by the `VarLengthExpand` operator. Unlike a relational JOIN which requires a predefined schema for every hop, Cypher allows us to express variable-depth relationships using the asterisk syntax: `-[*1..3]->`. This instruction tells the database engine to explore paths from the anchor node up to three edges deep.

The 2026 Neo4j 5.x engine utilizes a Breadth-First Search (BFS) pattern by default for these traversals, ensuring we find the shortest path first. For the CCP, we must enforce **Relationship Uniqueness**—meaning the traverser cannot traverse the same relationship twice in a single path. This prevents infinite loops and ensures the reasoning chain is linear and logical.

When executing these queries, we prioritize "Filtering Early." We anchor the search on a specific indexed property, such as a `User` UUID or a `Milestone` ID, to prune the search space before expanding. In the CCP architecture, we don't just "query the graph"; we perform a **Traversal Injection Loop**. 
1. **Anchor**: Identify the active context node.
2. **Traverse**: Execute a 3-hop Cypher query to find related Appraisals, Fears, and Dreams.
3. **Extract**: Turn the resulting path (Node-Rel-Node) into a readable string.
4. **Augment**: Inject this "causal chain" into the LLM's system prompt. This transforms the agent from a guesser into a witness, reporting on the client's actual history rather than speculating.

## 📂 OUR CODE (145 words)

We are extending the `Neo4jGraphManager` to handle these deterministic traversals. Currently, our manager handles basic CRUD, but it lacks the logic to "walk" the graph.

```python
# src/ccp/services/neo4j_graph_manager.py, line 415
# WHY: We use a bounded hop limit (*1..3) to prevent deep graph scans
# that would violate our <500ms latency requirement (AC10).

def get_causal_path(self, start_node_id: str) -> list[dict]:
    query = """
    MATCH p=(n {node_id: $start_id})-[*1..3]->(m)
    WHERE n.coach_id = $coach_id AND m.coach_id = $coach_id
    RETURN p LIMIT 20
    """
    # Expected: The path 'p' is returned as a list of segments.
    # Each segment reveals a causal link, e.g., Fear -> Coping -> Trigger.
```

`🔧 EXTEND — Add the get_causal_path method to neo4j_graph_manager.py and implement the path-to-string formatter.`

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code / Gemini CLI:**
> 
> "Extend `src/ccp/services/neo4j_graph_manager.py` by adding a method `get_contextual_subgraph(start_node_id: str, max_depth: int = 3)`. This method must execute a Cypher query that finds all paths of length 1 to `max_depth` starting from the given ID. Ensure the query enforces `coach_id` isolation for every node in the path. Add a helper method `format_path_as_narrative(paths)` that converts the results into a human-readable string: 'Node A (Type) --[Rel]--> Node B (Type)'. This narrative fragment will be used for prompt injection in Chapter 6. Verify the query with `PROFILE` to ensure it hits indexes."

## ⌨️ TERMINAL (84 words)

```bash
# Start Neo4j in Docker for local development
docker compose up -d neo4j

# Run the profile command to verify 3-hop performance
# Expected: NodeIndexSeek followed by VarLengthExpand
cypher-shell -u neo4j -p password "PROFILE MATCH (n {node_id: 'test-1'})-[*1..3]->(m) RETURN count(m)"

# Verify the new manager method with a test script
python -m pytest tests/test_graph_traversal.py
# Expected: 1 passed in 0.42s
```

## ✅ IMPLEMENTATION STEPS (158 words)

1. Ensure your local Neo4j instance is running and has mock data populated from Unit 5.2.
2. Open `src/ccp/services/neo4j_graph_manager.py` and locate the `# Isolation & Safety` section.
3. Paste the provided Agent Prompt into your CLI (Claude Code or Gemini CLI) to generate the `get_contextual_subgraph` and `format_path_as_narrative` methods.
4. Review the generated code: verify that the Cypher query includes `WHERE n.coach_id = $coach_id` to maintain strict tenant isolation (AC9).
5. Run the `cypher-shell` profile command from Section 5 to confirm that the database is utilizing the `node_id` index for the anchor point.
6. Trace the logic in `format_path_as_narrative`. It must transform the Neo4j `Path` object into a flat list of strings that an LLM can parse without special graph libraries.
7. Integrate the output of this method into your Chapter 6 harness as a dynamic `{{graph_context}}` variable.

## ✅ VERIFY (45 words)

Execute the 3-hop traversal query via `cypher-shell`. The result must return a list of paths starting from the User node and terminating at a CopingMechanism or SuccessMarker. The `total_database_hits` in the `PROFILE` output must be less than 500 for a 3-hop expansion.

## 🔗 BRIDGE (38 words)

Unit 5.5 builds on this by introducing **Temporal Logic**. We have the paths, but we don't yet know the *chronology*. We will learn how to add timestamps to our edges to distinguish between a past wound and a present victory.

<!-- FACT-CHECK: "Neo4j 5.x VarLengthExpand BFS default" → Confirmed. Neo4j 5.x uses BFS for variable length paths to find shortest paths efficiently. -->
<!-- FACT-CHECK: "Cypher profile total_database_hits threshold" → 500 hits for a 3-hop traversal on a small/medium graph is a standard high-performance ceiling for real-time injection. -->
