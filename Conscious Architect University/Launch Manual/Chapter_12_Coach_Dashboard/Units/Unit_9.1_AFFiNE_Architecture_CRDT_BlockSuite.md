# Unit 9.1: AFFiNE Architecture — CRDT & BlockSuite

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Collaborative editing is not about "locking" files or "merging" versions. In a high-concurrency 83-agent swarm, traditional mutex locks or Git-style merges create fatal latency and state fragmentation. We must shift from deterministic locking to probabilistic convergence.

Think of the human hippocampal indexing system. The brain does not store a single, monolithic copy of a memory that must be "checked out" to be updated. Instead, memory traces are distributed across the neocortex as decentralized patterns. The hippocampus acts as the indexing engine, facilitating the convergence of these distributed traces into a coherent episodic memory. It doesn't lock the "work" memory; it allows multiple neural pathways to fire simultaneously, resolving the final "state" through synaptic weighting.

Conflict-free Replicated Data Types (CRDTs) are the mathematical implementation of this hippocampal indexing. They allow our 76 agents to write headlessly to the same AFFiNE page without ever waiting for a "lock," ensuring that the final state of the coach's dashboard always converges to a single, mathematically consistent truth.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The AFFiNE dashboard is built upon **BlockSuite**, a specialized editor framework designed for "local-first" collaboration. Unlike traditional editors that treat a document as a flat string of HTML or Markdown, BlockSuite abstracts the document into a **Node-based Block Tree**. Each element—a paragraph, an image, a CMF video preview, or a CBCS conversation thread—is a discrete block with its own unique identifier and state.

This state is synchronized using **Yjs**, a high-performance CRDT engine. Yjs represents the document as a shared data type (Map, Array, or Text) where every mutation is recorded as a "change set." When multiple agents (or the coach) edit the same block, Yjs applies these change sets in a commutative, associative, and idempotent manner. This guarantees that no matter the order in which updates arrive, every participant eventually sees the exact same document.

Powering the persistence layer is **OctoBase**, a Rust-built engine optimized for CRDT operations. OctoBase provides the "Source of Truth" storage, allowing the platform to function entirely offline with seamless background synchronization. For the CCP, the most critical component is `@blocksuite/store`. This is the headless data layer that allows our Python-based agents to manipulate the document state directly, bypassing the browser UI entirely. Inputs are serialized as update binaries, processed by the CRDT logic, and output as a synchronized document state visible to the coach.

## 📂 OUR CODE (100-200 words)

The strategic rationale for this architecture is codified in `docs/MCDA_AFFiNE_Integration_Analysis.md`. This document details why we retired Notion (ADR-02) in favor of the self-hosted AFFiNE fork.

The primary integration point is the upcoming `affine_sync.py` (referenced in `docs/prd/prd-update-CA11-quad-platform.md` at line 69). This service will orchestrate the "Thin Fork" strategy:
1. **Theme Layer:** Replace visual branding via a CSS/asset overlay without modifying the core engine.
2. **Headless Store Integration:** Use the `@blocksuite/store` JSON-RPC bridge to push agentic outputs.

```python
# affine_sync.py [PROTOTYPE CONCEPT]
# WHY: The Sync Service uses the headless CRDT store to perform
# idempotent writes, ensuring 76 agents don't cause DB locking.
def push_to_workspace(content_block, workspace_id):
    update_binary = encode_block_to_yjs(content_block)
    octobase_client.apply_update(workspace_id, update_binary)
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> I am implementing the "Thin Fork" strategy for our AFFiNE-based coach dashboard. Create a TypeScript utility script at `src/ccp/dashboard/headless_writer.ts` that uses the `@blocksuite/store` package to programmatically insert a "Session Recap" block into a given workspace ID. The script must initialize a `Doc` instance, register the standard BlockSuite schemas, and apply a Yjs update that adds a text block with the content: "Agentic Intelligence Layer: Synchronization Active." Reference the architectural patterns in `docs/MCDA_AFFiNE_Integration_Analysis.md` to ensure the metadata fields match our CCP telemetry requirements.

## ⌨️ TERMINAL (50-100 words)

```bash
# Clone the upstream AFFiNE repository (The Community Edition)
git clone https://github.com/toeverything/AFFiNE.git dashboard-fork

# Navigate to the self-hosted deployment directory
cd dashboard-fork/deploy/self-host

# Launch the primary stack (AFFiNE Server + PostgreSQL + Redis)
docker-compose up -d

# Verify OctoBase is responding on the default port
curl http://localhost:8080/health
# Expected: {"status": "ok", "version": "2026.x.x"}
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Review `docs/MCDA_AFFiNE_Integration_Analysis.md` to understand the 10 criteria that drove the transition from Notion to AFFiNE.
2. Open `docs/prd/prd-update-CA11-quad-platform.md` and read Section 2 (ADR-05) to internalize the "Thin Fork" strategy and the dual-layer data model (OctoBase + Supabase).
3. Execute the terminal commands in Section 5 to deploy a local instance of the AFFiNE self-hosted stack.
4. Verify that the Docker containers (affine-server, postgres, redis) are all in a "Healthy" state.
5. Use the Agent Prompt in Section 4 to generate the `headless_writer.ts` prototype, which demonstrates how agents will eventually write to the dashboard without a browser.
6. Access the dashboard UI at `http://localhost:3000` and create a manual workspace to verify that the BlockSuite editor loads correctly.

## ✅ VERIFY (30-50 words)

Run `docker ps` to ensure the `affine-server` is running. Use `curl -I http://localhost:3000` to verify a 200 OK response from the Web UI. Successful local deployment proves the architectural foundation is ready for branding.

## 🔗 BRIDGE (30-50 words)

Unit 9.2 builds on this structural foundation by introducing Workspace Provisioning — Coach Isolation. We will implement the logic that ensures every coach receives a unique, branded, and secure workspace environment during the Genesis Pipeline deployment.

<!-- FACT-CHECK: "BlockSuite 2026" → BlockSuite remains the core editor framework for AFFiNE, utilizing Yjs for CRDT-based collaboration as of 2024-2026 documentation. -->
<!-- FACT-CHECK: "OctoBase self-host" → Official Docker Compose deployment for self-hosting is the standard for data-sovereign AFFiNE instances. -->
<!-- FACT-CHECK: "Headless writes" → @blocksuite/store provides the necessary store and model APIs for headless state manipulation. -->
