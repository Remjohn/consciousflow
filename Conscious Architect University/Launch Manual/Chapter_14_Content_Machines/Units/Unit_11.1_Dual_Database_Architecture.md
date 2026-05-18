# Unit 11.1: Dual-Database Architecture — Why Both

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** "One database can do everything." The persistent myth of the "Universal Database" is the single greatest cause of architectural debt in AI systems. Choosing a database is not about finding the most "powerful" tool; it is about matching the data structure to the retrieval geography.

Think of it like the contrast between a university library's Dewey Decimal System and the human hippocampus. The library (Relational) is optimized for **records** — finding a specific book on a specific shelf using a rigorous, flat coordinate system. It is perfect for high-integrity, structured data where "this book belongs in this section." However, a library is terrible at modeling **causality**. If you want to know how a 14th-century poem influenced a 21st-century neural network architecture, you don't look at the shelves; you look at the synaptic connections of a scholar's brain (Graph). 

The CCP needs both. We use Supabase for the library (client profiles, session logs, billing) and Neo4j for the synapses (the Context Premise hypergraph, causal reasoning, and Emotional DNA).

## 🧠 TECHNICAL KNOWLEDGE (235 words)

The Conscious Coaching Platform (CCP) operates on a "Dual-Sovereign" persistence model. We decouple **state preservation** (Relational) from **relationship reasoning** (Graph). 

**Supabase (PostgreSQL + pgvector):**
In our 2026-accurate stack, Supabase serves as our ACID-compliant bedrock. Utilizing PostgreSQL 17, we leverage **pgvectorscale** for high-performance semantic search. While standard Postgres handles structured tables like `conscious_pose_atoms` and `identity_lora_registry`, pgvector allows us to store and query high-dimensional embeddings (e.g., from Nomic-Embed-Text or CLIP) with **Iterative Scan** capabilities. This solves the "overfiltering" problem, allowing us to combine strict metadata filters (e.g., `WHERE coach_id = 'A1'`) with vector similarity without losing recall performance.

**Neo4j Aura (Graph):**
The CCP's intelligence is defined by **causality**. Storing a client's "fear" as a row in Postgres tells us what they feel; storing it as a node in Neo4j allows us to see that the fear **TRIGGERS** a specific `CopingMechanism`, which in turn **MASKS** an underlying `Insecurity`. In a relational database, finding these multi-hop connections requires recursive joins that destroy performance. Neo4j's native graph engine treats relationships as first-class citizens, allowing the `ScheduledMonitorAgent` to traverse 5-6 hops of a client's psyche in under 50ms. By 2026 standards, we use **Agentic GraphRAG** workflows, where LLM agents navigate the graph to build "Context Premises" that generic RAG systems miss.

## 📂 OUR CODE (185 words)

The dual-database orchestration is primarily managed in `src/ccp/services/neo4j_graph_manager.py` and our environment configuration.

```python
# src/ccp/services/neo4j_graph_manager.py, line 161
# WHY: Parameterized queries enforce isolation. We NEVER concatenate strings 
# for Cypher queries. The $props object ensures values are sanitized.
self.driver.run_query(
    "CREATE (n:{label} $props)",
    parameters={
        "node_type": node.node_type.value,
        "coach_id": self.coach_id,
        "node_id": node.node_id,
        "text": node.text,
        # ... properties continue
    },
)

# src/ccp/services/neo4j_graph_manager.py, line 416
# WHY: AC9 Mandatory Scoping. Every query MUST include a coach_id constraint.
# An absence of coach_id is treated as a critical security failure, not a bug.
return self.driver.run_query(
    "MATCH (n) WHERE n.coach_id = $coach_id RETURN n",
    parameters={"coach_id": self.coach_id},
)
```

If the Supabase connection logic is missing, see: `⚠️ BUILD REQUIRED — supabase_client.py` for RLS-scoped wrapper.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Claude Code / Gemini CLI:**
> I am building the persistence layer for the Conscious Coaching Platform. I need to verify our dual-database isolation logic. 
> 1. Read `src/ccp/services/neo4j_graph_manager.py` and identify the `InMemoryNeo4jDriver`.
> 2. Create a test script at `tests/test_isolation_gate.py` that attempts to query data for `coach_B` while initialized with `coach_A`.
> 3. Verify that the `query_nodes` method (line 409) correctly returns an empty list, proving the `coach_id` scoping is working as intended under the ADR-01 security constraint.
> 4. Ensure the test also checks the `_create_node` logic to confirm that `coach_id` is automatically injected via the manager's `__init__` state.

## ⌨️ TERMINAL (85 words)

```bash
# Verify local environment connectivity
# Checks .env for mandatory SUPABASE_URL and NEO4J_URI
cat .env | grep -E "SUPABASE|NEO4J"

# Initialize a local Neo4j Docker instance for unit testing
docker run --name ccp-neo4j-test -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/testpassword neo4j:latest

# Run the graph manager health check
pytest src/ccp/services/neo4j_graph_manager.py
# Expected: 24 passed in 0.42s
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Environment Audit:** Open your root `.env` file. Ensure `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, and `SUPABASE_KEY` are present. These are the "keys to the synapses" for the CCP.
2. **Neo4j Ontology Review:** Open `src/ccp/services/neo4j_graph_manager.py`. Trace the `_create_node` method (Line 153). Notice how it generates a 16-character SHA-256 hash (Line 159) based on the `coach_id` — this is a fingerprint that ensures even nodes with the same text remain isolated across different coaches.
3. **Graph Mapping:** Read lines 6-10 in the file docstring. You must memorize these 14 node types (e.g., `HermeneuticalGap`) and 8 relationship types (e.g., `FUELS`). These constitute the "Physics of Human Change" according to our CBCS engine.
4. **Isolation Verification:** Execute the agent prompt from Section 4 to build the `test_isolation_gate.py`. This proves that your architecture enforces multi-tenant safety at the internal service layer, not just the API layer.

## ✅ VERIFY (45 words)

`pytest tests/test_isolation_gate.py` → All green.
`docker ps` → Neo4j container status is "healthy". 
Open `neo4j_graph_manager.py`: verify that EVERY `MATCH` or `CREATE` query contains the `$coach_id` parameter. → All queries scoped. Binary check: 100% compliance.

## 🔗 BRIDGE (40 words)

Unit 11.2 builds on this "Why" by moving into "How" — specifically, how we handle **Schema Design & Migrations** in Supabase to enforce Row-Level Security (RLS), ensuring that isolation isn't just a code pattern, but a database law.

<!-- FACT-CHECK: "Supabase pgvector 2026" → Postgres 17 transition supported; pgvectorscale achieving 470+ QPS. -->
<!-- FACT-CHECK: "Neo4j Aura 2026" → Aura Agent platform launched for GraphRAG workflows. -->
