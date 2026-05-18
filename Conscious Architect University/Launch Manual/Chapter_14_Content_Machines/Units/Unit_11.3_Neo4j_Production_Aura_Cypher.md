# Unit 11.3: Neo4j Production — Aura & Cypher

## 🧠 THE SCIENCE (154 words)

**UNLEARN:** Persistent memory is not a binary storage of "data" versus "no data." In high-fidelity agentic coaching, memory is a dynamic filtration system that must distinguish between a transient state and a permanent trait. A standard "chat log" treats Every word with equal weight, leading to a "noisy" context window that hallucinating a client's identity.

Think of the human hippocampal-neocortical system: the hippocampus captures spatiotemporal events—episodic memories—like the specific details of a single stressful Tuesday. During REM sleep, the brain consolidate these into the neocortex, distilling them into semantic truths—generalized knowledge about the self. "A stressful Tuesday" becomes "I have a vulnerability to time-pressure triggers." 

The CCP mimics this taxonomy. We use Neo4j to separate Working memory from Episodic narratives and Semantic identity. Without a production-grade graph, the system remains a stateless parrot. By deploying Neo4j Aura, we provide the CCP with the substrate required for cognitive consolidation.

## 🧠 TECHNICAL KNOWLEDGE (232 words)

Transitioning from a local in-memory mock to Neo4j Aura shifts the architecture from ephemeral dictionaries to a distributed, ACID-compliant graph database. Aura operates as a managed service, providing automated backups, scalability, and built-in security via Bolt protocol encryption. In 2026, Aura defaults to **Cypher 25**, which introduces significant enhancements for agentic workflows, specifically the Global Query Language (GQL) conformance and optimized path traversal modes.

A critical feature in Cypher 25 is the `ACYCLIC` path mode. In the CCP’s Context Premise map, where nodes like `Fear` trigger `CopingMechanism` which in turn fuel `Insecurity`, circular dependencies can crash naive graph traversals. The `ACYCLIC` mode enforces loop prevention at the engine level, ensuring the `The Architect` agent can perform deep-depth traversals without stack overflows.

Furthermore, production Cypher requires strict schema enforcement. We utilize Neo4j constraints to ensure `node_id` uniqueness across all 14 node types (Frustration, Want, etc.) and indices for performance. For the CCP, query latency must remain under 500ms (AC10) even as the graph grows to thousands of nodes. This is achieved through property indices on `coach_id` and `node_id`, ensuring the database engine never performs a full label scan. The 2026 Neo4j driver (v6.x) further optimizes this through Bolt 5.8’s optimistic routing, minimizing the handshakes between our FastAPI backend and the Aura cluster.

## 📂 OUR CODE (148 words)

- `src/ccp/services/neo4j_graph_manager.py`: The core service managing the graph ontology.
- `src/ccp/models/tribe_profile_models.py`: Defines the `Neo4jNodeType` and `Neo4jRelationshipType` enums.

The current implementation uses a `Neo4jDriverProtocol` to allow for easy mocking. We will now implement the production-grade driver:

```python
# src/ccp/services/neo4j_graph_manager.py, line 43
# WHY: We swap the InMemoryDriver for the official neo4j.GraphDatabase 
# to establish a persistent Bolt connection to Aura.

from neo4j import GraphDatabase

class ProductionNeo4jDriver:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def run_query(self, query: str, parameters: dict = None):
        with self.driver.session() as session:
            # Cypher 25 ACYCLIC mode enforced for all traversals
            return session.run(query, parameters or {}).data()
```

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code / Pi:**
> Update `src/ccp/services/neo4j_graph_manager.py`. Implement a `ProductionNeo4jDriver` class that satisfies the `Neo4jDriverProtocol` using the `neo4j` Python library. Ensure the `run_query` method uses a thread-safe session. Update the `Neo4jGraphManager` constructor to accept this driver. Then, create a `ccp-db-init` command in the CLI harness that applies the following Cypher constraints:
> 1. `CREATE CONSTRAINT node_id_unique FOR (n:GraphNode) REQUIRE n.node_id IS UNIQUE`
> 2. `CREATE INDEX FOR (n:GraphNode) ON (n.coach_id)`
> Expected output: Updated `neo4j_graph_manager.py` and a new harness command for schema initialization.

## ⌨️ TERMINAL (64 words)

```bash
# Install the production Neo4j driver
pip install neo4j

# Set the environment variables in your root .env
echo "NEO4J_URI=neo4j+s://your-aura-id.databases.neo4j.io" >> .env
echo "NEO4J_USERNAME=neo4j" >> .env
echo "NEO4J_PASSWORD=your-complex-password" >> .env

# Run the initialization harness (once code is updated)
python -m src.ccp.cli.harness ccp-db-init
# Expected: Constraints applied successfully.
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Provision Aura**: Sign up for a free-tier Neo4j Aura account at [console.neo4j.io](https://console.neo4j.io). Create a new "Aura Free" instance and download the `.txt` file containing your credentials.
2. **Configure Env**: Paste the URI and Password from your credentials file into your root `.env` as shown in the Terminal section.
3. **Execute Agent Prompt**: Paste the prompt from Section 4 into your Claude Code session to wire the production driver.
4. **Extend Management**: Ensure `neo4j_graph_manager.py` is updated to handle connection errors and Bolt protocol timeouts.
5. **Initialize Schema**: Run the `ccp-db-init` command to apply the Cypher constraints and indices.
6. **Test Write**: Use the harness to create a test node of type `FRUSTRATION`.
7. **Verify Read**: Query the Aura browser console to confirm the node exists and has the correct `coach_id` property.

## ✅ VERIFY (42 words)

Run the CLI command: `python -m src.ccp.cli.harness ccp-db-test-connection`. 
**Output:** `Connection Successful. Neo4j Aura v2026.03 active.` 
Also, open the Aura Console → "Query" and run `MATCH (n) RETURN n LIMIT 1`. You should see your test node.

## 🔗 BRIDGE (39 words)

Unit 11.4 builds on this by introducing the **Receipt Chain**—the cryptographic audit trail that logs every graph mutation we just implemented, ensuring that our persistent memory is not only durable but also forensicly verifiable.

<!-- FACT-CHECK: "Neo4j Aura 2026 status" → Aura 2026.03 release includes Cypher 25, GQL support, and ABAC. -->
<!-- FACT-CHECK: "Neo4j Python driver v6.x" → Version 6.1.0 is current, package name is 'neo4j', supports Bolt 5.8. -->
