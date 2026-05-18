# Unit 1.3: The CCP Architecture Deep-Dive

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** High-performance systems are not built with "all-in-one" generalist components. In the agentic world, a single LLM trying to manage every task is a source of high entropy and low reliability.

The CCP is architected on the principle of **Specialization in Swarm Intelligence**. When agents are decoupled and given narrow, irreducible domains of authority, the system gains robustness. If one agent fails, the others hold the line. This is the difference between a brittle monolithic application and a resilient agentic matrix.

Think of the **Formicidae (Ant) colony**: the colony's intelligence doesn't reside in a single "Generalist Ant." Instead, it emerges from specialized roles—scouts find food, soldiers defend the nest, and workers maintain the infrastructure. Pheromone trails (our **Receipt Chain**) act as the decentralized communication layer, allowing the swarm to navigate complex environments without a central "brain" micromanaging every movement. Like an ant colony, the CCP's 76-agent matrix relies on specialized experts who do one thing with 100% precision.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The CCP Architecture is a multi-layered matrix of specialized agents, each governed by a specific operational lifecycle. It is critical to understand that the system follows a **Schedule-Based Operational Model**, not a 24/7 chatbot paradigm.

1.  **The Orchestration Layer (Morgan & Guardian):** The **Guardian Agent** governs the "Genesis Mode"—the initial 5-phase onboarding of a coach. Once the "Genesis Clearance Certificate" is issued, authority hands off to the **Morgan Orchestrator**. Morgan is the gatekeeper of the "Phase 0" production unlock, ensuring that subsequent generation batches only run when the identity and behavioral models are verified.
2.  **The Observation Layer (Scheduled Monitor):** This agent is the system's "Scout." It activates on a daily cadence (typically 6:00 AM) to monitor community channels. It doesn't just "read" content; it cross-references it against defined cultural mythologies to generate **DARN-CAT** coaching triggers.
3.  **The Enforcement Layer:** All agents operate under the "C-11 Persona Masking Gate." This technical constraint ensures agent names never appear in API payloads or prompts, preventing "Meta-leakage" where the LLM starts discussing its own architecture instead of focusing on the client.

This specialization prevents "Prompt Bloat." Our agents use narrow, high-density prompts that are optimized for their specific task, significantly reducing latency and increasing the determinism of the output.

## 📂 OUR CODE (100-200 words)

The architecture's hand-offs and specialized roles are visible in the core agent definitions:

- `src/ccp/agents/guardian_agent.py` line 235: `run_genesis()`
  ```python
  # WHY: Implements the sequential Genesis Mode (FR0A-FR0E). 
  # This agent's ONLY job is to reach the certificate-issued state, 
  # after which it transitions to Stewardship Mode.
  ```
- `src/ccp/agents/morgan_orchestrator.py` line 240: `gate_manual_trigger()`
  ```python
  # WHY: Enforces the schedule-based model (AC4). 
  # It explicitly BLOCKS human-initiated triggers, returning a canned 
  # response that forces the system back into its batch-processing cadence.
  ```
- `src/ccp/agents/scheduled_monitor.py` line 194: `ScheduledMonitorAgent`
  ```python
  # WHY: The specialized "Scout" that initiates production cycles. 
  # It is the ONLY agent allowed to start a production session, 
  # ensuring that coaching is always context-driven (DARN-CAT).
  ```

## ✅ IMPLEMENTATION STEPS (100-200 words)

To grasp the deep-dive architecture, you will trace the transition of authority from the Setup phase to the Production phase.

1. Open `guardian_agent.py` and analyze the `STAGE_CONFIGS` dictionary starting at line 54. Identify how each stage (FR0A to FR0E) has specific "quality_gates" and "dep_ids_produced."
2. Find the `run_genesis` method (line 235). Notice how the code enforces a "FAILED verdict" halt—this is the balancing loop we learned in Unit 1.1.
3. Switch to `morgan_orchestrator.py` (line 328). Trace the 13 gates. Notice how Gate #12 (line 387) explicitly checks for the existence of the `scheduled_monitor_config.json`.
4. Open `scheduled_monitor.py` and find `initialize` (line 223). This method writes the very config file that Morgan requires to authorize production.
5. Identify the `_DARN_CAT_GENERATION_PROMPT` at line 53. Observe how it restricts the agent to *only* return valid JSON, enforcing the "specialization" mandate.

## ✅ VERIFY (30-50 words)

Trace the `scheduled_monitor_config.json` from its creation in `scheduled_monitor.py` to its verification in `morgan_orchestrator.py`. Does the monitor config being "live" act as the required key for Morgan to unlock Phase 1? → **Yes/No**.

## 🔗 BRIDGE (30-50 words)

Unit 1.4 shifts focus from the behavioral orchestrators of the CCP to the high-throughput programmatic video factory: the CMF. We will explore how it renders the agents' insights into cinematic reality through a 3-phase deterministic pipeline.

<!-- FACT-CHECK: "Ant colony specialization roles agentic AI" → The "Ant Colony Optimization" (ACO) algorithm is a classic example of swarm intelligence frequently cited in 2026 decentralized agentic architectures. -->
<!-- FACT-CHECK: "DARN-CAT motivational interviewing" → DARN-CAT (Desire, Ability, Reasons, Need, Commitment, Activation, Taking Steps) remains the clinical gold standard for the "Change Talk" phase of Motivational Interviewing. -->
