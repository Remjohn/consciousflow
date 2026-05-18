# Chapter 08 Syllabus — Orchestration: DAG Teams & Hypergraph Memory

**Chapter Position:** Part II: The Agentic Orchestration Layer
**Prerequisite:** Chapter 07 (Skill Compilation & Context Engineering)
**Unlocks:** Chapter 09 (Agentic Core & Evaluator Mechanics)
**Primary Research Sources:** SemaClaw.md · Building Conscious Agents With Hypergraph Memory.md · Pi CEO Agents.md · My Pi Agent Teams.md · One Agent Is NOT ENOUGH.md · Replacing Prompts With Agentic Engineering.md

---

## Chapter Objective

The operator will implement the two core intelligence mechanisms that make a multi-agent team behave like a conscious, learning organization rather than a collection of stateless API calls: **DAG Teams** for deterministic multi-agent execution, and **Hypergraph Memory** for causal, experiential learning that compounds over time.

**Governing Principle:** Intelligence without memory is a goldfish. Memory without causal structure is a filing cabinet. Hypergraph Memory with DAG orchestration is a learning organization.

---

## Unit Index

### Unit 8.1 — Hybrid DAG Orchestration: LLM Planning + Deterministic Execution
**Source:** SemaClaw.md
**Core Teaching:**
- The two-phase hybrid model:
  - **Phase 1 (LLM Planning):** The Orchestrator generates a natural-language dependency graph — which agents depend on which outputs
  - **Phase 2 (Deterministic Execution):** The harness compiler converts the natural-language DAG into a strict executable graph with typed edges and failure contracts
- Why neither pure Swarms nor pure LangGraph works: Swarms hallucinate hand-offs; LangGraphs are too brittle
- Task decomposition patterns: sequential, parallel, conditional branches, and merge nodes
- Failure contracts: what happens when a DAG node fails — retry policy, fallback agent, escalation hook

**Deliverable:** CCP script generation DAG definition (5-node: IntentClassifier → DataOps → SwarmOrchestrator → HeavyCritic → Synthesizer)

---

### Unit 8.2 — Hypergraph Memory: Tripartite Memory Architecture
**Source:** Building Conscious Agents With Hypergraph Memory.md
**Core Teaching:**
- Moving beyond flat vector RAG: cosine similarity finds related tokens, not causes
- **Tripartite Memory:**
  - **Factual Memory:** Static knowledge graph — Voice DNA rules, CA11 laws, coach biographical data
  - **Working Memory:** The active context window for the current task
  - **Experiential Memory:** A hypergraph of past task executions, their outcomes, and their failure resolutions — the agent's lived experience
- Hyperedges encode *causal* relationships: "Client showed resistance (Tension primitive failed) → Coach used Humor pivot → Client re-engaged." This is not retrievable via cosine similarity. Only causal hypergraph traversal surfaces it.

**Deliverable:** Hypergraph schema for the CCP coaching session memory (node types, edge types, hyperedge format)

---

### Unit 8.3 — Experiential Memory & Damage Control Hooks
**Source:** Building Conscious Agents With Hypergraph Memory.md
**Core Teaching:**
- **Damage Control Hooks:** When the agent encounters a failure pattern that matches a past failure in Experiential Memory, it automatically injects the past resolution strategy into the active context window before attempting the task
- Flow GRPO (In-the-Flow Optimization): the agent receives reward signals *during* task execution, not just at the end — enabling mid-task course correction
- Ambiguity Checks (Interact Comp): before executing an ambiguous task node, the agent surfaces a clarifying question to the Orchestrator rather than hallucinating
- The anti-hallucination loop: Experiential Memory + Ambiguity Check + Damage Control Hook = a system that gets less wrong over time

**Deliverable:** Damage Control Hook integration spec for `experiential_memory.py`

---

### Unit 8.4 — CEO/Board Architecture: Strategic 1M-Context Agents
**Source:** Pi CEO Agents.md
**Core Teaching:**
- When to use a CEO-tier agent: complex, multi-session strategic analysis where the full 1M token context window is required (e.g., analyzing 60 sessions of client CBCS data to recommend a program restructure)
- Budget and time constraints: strategic agents operate under explicit token budgets and time limits to prevent context hoarding
- The Board model: multiple CEO-tier agents with different strategic perspectives (Coach Retention vs. Client Activation vs. Revenue Efficiency) debate and produce a synthesized recommendation
- Integration with the DAG: Board deliberation is a DAG node type — its output feeds Program Adaptation tasks

**Deliverable:** CEO/Board DAG node specification for the CCP program adaptation pipeline

---

### Unit 8.5 — Multi-Team Delegation Trees & JSONL Event Streaming
**Source:** My Pi Agent Teams.md · One Agent Is NOT ENOUGH.md
**Core Teaching:**
- The Three-Tier architecture in practice: Orchestrator → Lead Agents → Worker Agents
- Domain-bounded teams: Script Generation Team, Roleplay Moderation Team, CBCS Delivery Team — each with its own Lead
- How Lead agents spawn and manage Worker agents dynamically within a session
- **JSONL Event Streaming:** Every agent-to-agent message logged as `{from, to, message, timestamp, dag_node_id}` — the operator's complete observability layer
- The split-pane TUI: delegation tree on the left, event stream on the right, mission statement pinned at the top

**Deliverable:** CCP Multi-Team architecture diagram (3 teams, 9 workers, full delegation tree)

---

### Unit 8.6 — Difference Rewards & Credit Assignment (Shapley Values)
**Source:** Replacing Prompts With Agentic Engineering.md
**Core Teaching:**
- The problem with naive multi-agent reward: if Team A produces a good result, which of the 9 agents actually caused it?
- **Difference Rewards (MCDA Shapley Values):** Measure each agent's marginal contribution by comparing the team's performance with and without that agent's output
- **CCP Application:** After every script generation cycle, the Orchestrator calculates which sub-agent (IntentClassifier, DataOps, Critic, or Synthesizer) drove the quality delta. This updates their Skill Handbook reputation weight for future SkillOrchestra routing decisions.
- The virtuous cycle: Difference Rewards → Reputation Weights → Better SkillOrchestra routing → Better outputs → Better Difference Rewards

**Deliverable:** Difference Reward calculation function for `orchestrator_credit_assignment.py`

---

## Chapter Exit Gate

Practical deployment:
1. Define a 5-node CCP DAG with typed edges and failure contracts
2. Write a hypergraph schema entry for a past coaching session failure and its resolution
3. Configure a Damage Control Hook that activates when the failure pattern re-occurs
4. Trace a JSONL event stream log from a 3-agent script generation run and identify the agent with the highest Difference Reward
