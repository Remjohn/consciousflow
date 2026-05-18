# Unit 3.3: Swarm Mechanics — Entomology of Agents

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "One powerful agent can do everything." This is the Monolithic Fallacy. In the early days of LLMs, we believed that increasing the context window and parameters would eventually lead to an "omniscient" agent that could handle every task from research to rendering. This is false. 

Think of the **Trophallaxis** and task specialization in an ant colony. A single ant does not "know" how to build the entire nest, forage for food, and protect the queen simultaneously. Instead, the colony functions as a **Swarm**, where individual agents are physiologically tuned to specific roles—foraging, nursing, or defense—and communicate via chemical pheromones.

In Agentic Engineering, we apply this **Entomological Model** because LLMs suffer from "Cognitive Tunneling" when burdened with too many concurrent constraints. Research shows that model output quality suffers a sharp noise-floor drop once an agent is forced to manage more than **four concurrent responsibilities**. By decomposing the CCP into 76 specialized agents, we ensure each agent operates with maximum focus and zero "contextual noise."

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The architecture of the CCP Swarm is built on the **Hub-and-Spoke Orchestration** model, also known as the Orchestrator-Worker pattern. At the center of this swarm is the **Queen Bee (The Orchestrator)**, who maintains the high-level plan and meta-cognition while delegating specific, isolated tasks to **Specialist Agents (The Workers)**.

Communication between these agents is governed by the **Agent2Agent (A2A) Protocol**. In 2026, this protocol has standardized how agents discover each other's capabilities through **Agent Cards**—machine-readable JSON manifests (`.well-known/agent.json`) that define an agent's identity, skills, and interaction modalities. Instead of passing raw, unstructured text (which loses 30-40% of data density via the "Telephone Game" effect), agents exchange **Strict JSON Payloads**.

To prevent recursive loops and task drift, the Orchestrator uses **Hook Pipelines** (PreToolUse/PostToolUse/Stop). These hooks function as programmable middleware that validates a subagent's intent before execution and verifies its output against the original delegation contract. If a subagent attempts an unauthorized action or fails to meet the quality gate, the Orchestrator intercepts the failure and routes it to a recovery path or a Human-In-The-Loop (HITL) node. This modular isolation ensures that even if one agent in the swarm "hallucinates," the blast radius is contained within its specific sub-task, leaving the overall system state intact.

## 📂 OUR CODE (100-200 words)

The heart of our swarm orchestration is located at `src/ccp/agents/morgan_orchestrator.py`. This file implements the "Queen Bee" logic that coordinates the 13 production unlock conditions required to move from Phase 0 to Phase 1.

```python
# src/ccp/agents/morgan_orchestrator.py, line 274
# WHY: The MorganOrchestrator class acts as the central hub. 
# It doesn't perform the extraction itself; it calls the 
# Guardian, Kimya, and Emmanuel agents as specialists.

# src/ccp/agents/morgan_orchestrator.py, line 489
# WHY: This check enforces AC4—manual triggers are blocked.
# This ensures that our swarm ONLY activates on its 
# scheduled rhythm, preventing chaotic, unbudgeted runs.

# src/ccp/agents/morgan_orchestrator.py, line 448
# WHY: On successful coordination, Morgan issues a 
# 'GENESIS-UNLOCK' receipt. This is a persistent state 
# artifact that survives the "context death" of the current agent turn.
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> I need to extend the specialized capability of our swarm. Open `src/ccp/agents/governance_ministers.py` and analyze the existing `MinisterOfIdentity` class. 
> 
> Create a new specialized agent class `MinisterOfTiming` that inherits from the base `GovernanceMinister` class. This agent's sole responsibility is to evaluate if the current `CulturalMemoryMap` contains a "High Tensity" trigger that matches the current timestamp's season. 
> 
> Follow the A2A protocol: ensure the output is a valid JSON schema that can be handed back to `morgan_orchestrator.py`. Ensure no agent names appear in the payload (C-11 Persona Masking).

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the orchestrator's gate status for a specific coach
python -m src.ccp.agents.morgan_orchestrator --check-gates --coach-acronym JPI

# Expected: Gate 'leadership_scorecard' -> PASS (12/12 traits)
# Expected: Gate 'cultural_memory_map' -> FAIL (requires operator confirmation)

# List all specialized agents currently registered in the swarm
ls src/ccp/agents/ | grep _agent.py
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/agents/morgan_orchestrator.py` and scroll to line 328: `check_all_phase0_gates`. 
2. Trace the code as it calls `GuardianAgent.check_genesis_clearance`. Notice how Morgan doesn't check the certificate; she asks a specialist to do it and interprets the boolean result.
3. Identify the **JSON Serialization** points. Look at how `receipt_chain.log` (line 448) captures the `metadata` dictionary. This is the A2A transition where reasoning lives forever as structured data.
4. Locate the **C-11 Persona Masking Gate** on line 302. Observe the regex pattern that strips agent names like "Morgan" or "Kimya" from outbound payloads. This is a critical security constraint.
5. Create a test file `tests/test_swarm_handoff.py` and use the Agent Prompt from Section 4 to build the `MinisterOfTiming` specialist.

## ✅ VERIFY (30-50 words)

Run `python -m src.ccp.agents.morgan_orchestrator --check-gates`. If at least 5 of the 13 gates show a PASS/FAIL status based on your local `config/` files, the Hub-and-Spoke orchestration is functioning correctly.

## 🔗 BRIDGE (30-50 words)

Unit 3.4 builds on this by introducing **Skills Systems & MCP Protocol**, showing you HOW these specialized agents actually "learn" their tools and how we gate those tools using the Model Context Protocol to prevent tool-overload.

<!-- FACT-CHECK: "Agent2Agent protocol 2026" → Google A2A protocol is now a Linux Foundation standard for cross-framework agent communication (Agent Cards, JSON-RPC 2.0). -->
<!-- FACT-CHECK: "Claude Code 2026 subagents" → Claude Code 2026 utilizes a hub-and-spoke model with isolated context windows (up to 200k tokens) and background monitor tools. -->
<!-- FACT-CHECK: "LLM Cognitive Load limiting constraints" → 2024-2025 research indicates that LLM reasoning performance (GPQA/MMLU) degrades significantly beyond 4-5 simultaneous system constraints. -->
