# Unit 5.7: Graph Pruning — Physics of Forgetting

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** High-fidelity memory is not about perfect storage; it is about perfect retrieval. The false belief that "more data equals a smarter agent" is the fastest path to architectural collapse. In a production hypergraph, an unpruned memory is a noisy, high-latency hallucination engine that eventually drowns the signal in a sea of irrelevant artifacts.

Think of the adolescent brain. Between the ages of 12 and 20, the human brain undergoes massive **synaptic pruning**, deleting up to 40% of its weakest neural connections. This isn't a loss of intelligence; it is the physical mechanism of optimization. By removing the "background noise" of childhood learning, the brain increases the myelination and speed of the remaining pathways. In the CCP, we mimic this biological "Physics of Forgetting." If a node represents a fleeting mention with no recurring pattern, or if an edge has not been traversed in 180 days, it must be pruned. Forgetting isn't a bug; it is the CCP’s way of strengthening what truly matters.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

In a Neo4j-based hypergraph, pruning is the process of maintaining the **Small-World Network** property. Without it, the "degrees of separation" between nodes increase, and Cypher traversals (like a 3-hop reasoning chain) become exponentially more expensive in terms of both compute time and token cost. We manage this via three primary technical metrics:

1.  **Degree Centrality (Orphan Detection):** A node with a degree of zero is functionally dead memory. It consumes storage but provides zero context for traversal. These are typical "hallucination seeds" left over from failed extraction attempts.
2.  **Relative Edge Weight (Frequency):** We track the number of times a relationship is mentioned or reinforced. If an edge stays at `weight: 1` for three months, it is ephemeral noise. If it reaches `weight: 10`, it is a "highway" of client identity.
3.  **Temporal Decay (TTL):** Using the Neo4j APOC library, we implement a Time-to-Live (TTL) mechanism. By applying a `:TTL` label and an `expireAt` timestamp property (Unix epoch), we enable a low-priority background process to automatically delete "expired" episodic data.

The failure mode of an unpruned system is **Context Rot**. When the LLM processes a 2-hop graph injection, it might receive 50 facts, 40 of which are outdated or irrelevant. This noise lowers the "Attention Weight" the model places on the 10 critical facts, leading to a breakdown in coach-client alignment. Pruning ensures the signal-to-noise ratio remains high.

## 📂 OUR CODE (180 words)

The pruning engine resides in the `MemoryTierPromotionService`, which governs the lifecycle of data from episodic to semantic tiers. We extend this service to handle "Stale Decay" and "Orphan Reaping."

- **File:** `src/ccp/services/memory_tier_promotion_service.py`
- **Function:** `check_stale_decay` (Lines 388-410)

```python
# memory_tier_promotion_service.py, line 397
# WHY: The age_days calculation prevents "zombie proposals" from 
# clogging the governance queue. If an operator hasn't 
# approved a pattern within 30 days, it is pruned to maintain queue health.
age_days = (ref - proposal.first_observed).days
if age_days > STALE_DECAY_DAYS:
    self._queue.remove(proposal.proposal_id)
```

⚠️ **BUILD REQUIRED** — While the proposal queue has decay logic, the Neo4j graph nodes currently lack a global `:TTL` reapper. We must extend the `MemoryTierPromotionService` with an `apply_forgetting_policy()` method that executes the graph-side deletions for orphan nodes and low-weight ephemeral edges.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Gemini CLI / Claude Code:**
>
> I need to extend the `MemoryTierPromotionService` in `src/ccp/services/memory_tier_promotion_service.py` to implement the "Physics of Forgetting." 
>
> 1. Add a method `apply_forgetting_policy(self, max_orphan_age_days: int = 180)` that uses the `neo4j_client` to:
>    - Remove all nodes with `:Episodic` label that have `degree = 0` and are older than `max_orphan_age_days`.
>    - Apply the `:TTL` label and set an `expireAt` property (now + 6 months) to any node with `occurrence_count < 3` that has not been updated in 90 days.
> 2. Ensure this is logged to the `receipt_chain` under the `Deletion-Orchestrator` agent.
> 3. Reference `neo4j_graph_manager.py` for any Cypher query abstractions.

## ⌨️ TERMINAL (85 words)

```bash
# Manually audit nodes that are candidates for pruning
# This Cypher query finds episodic nodes with 0 connections
cypher-shell -u neo4j -p password "MATCH (n:Episodic) WHERE size((n)--()) = 0 RETURN n.label, n.first_observed LIMIT 20"

# Check the current count of nodes with the TTL label
cypher-shell -u neo4j -p password "MATCH (n:TTL) RETURN count(n) as expired_candidates"
# Expected: expired_candidates | 0 (if not yet configured)

# Force a clean-up of expired nodes via APOC
cypher-shell -u neo4j -p password "CALL apoc.ttl.expire()"
```

## ✅ IMPLEMENTATION STEPS (160 words)

1.  **Configure APOC TTL:** Open your Neo4j configuration (`neo4j.conf`) and ensure `apoc.ttl.enabled=true` and `apoc.ttl.schedule=1h` are set. This enables the background "reaper" process.
2.  **Extend the Service:** Open `src/ccp/services/memory_tier_promotion_service.py`. Paste the prompt from Section 4 into your AI agent session to generate the `apply_forgetting_policy` method.
3.  **Define Thresholds:** In `src/ccp/models/onboarding_prerequisite_models.py`, ensure `MAX_ORPHAN_AGE_DAYS` is defined (default: 180) to govern the "forgetting" speed.
4.  **Wire to Nightly Sweep:** Navigate to your main orchestrator or cron job and add `promotion_service.apply_forgetting_policy()` after the `run_pattern_sweep()` call.
5.  **Audit Logs:** Ensure the `receipt_chain.log` correctly attributes the deletions to the `Deletion-Orchestrator` agent. This provides a clear audit trail of *why* specific data was forgotten.

## ✅ VERIFY (45 words)

Run the manual audit Cypher query from Section 5. Before pruning, note the count of degree-zero nodes. Run `apply_forgetting_policy()`. Re-run the query. The count should be zero. The outcome is binary: did the orphans disappear? → **Yes/No**.

## 🔗 BRIDGE (40 words)

Unit 5.8 builds on this by introducing **Graph Injection — Working Context**. Now that we have a lean, pruned graph, we can efficiently extract the "2-hop radius" around the client's current emotional topic and inject it into the prompt without blowing the token budget.


<!-- FACT-CHECK: "Neo4j APOC TTL 2026" → APOC Core remains the standard for TTL in Neo4j 5.x/2026 via `apoc.ttl.expire`. `apoc.ttl.enabled=true` is mandatory in configuration. -->
<!-- FACT-CHECK: "Synaptic pruning rate" → Neuroscience confirms approx 40% loss in synaptic density from childhood to adulthood, optimizing for signal fidelity. -->
