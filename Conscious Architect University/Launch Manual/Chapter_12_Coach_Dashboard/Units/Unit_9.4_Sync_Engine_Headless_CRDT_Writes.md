# Unit 9.4: Sync Engine — Headless CRDT Writes

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Agents need a browser to edit AFFiNE. Many developers wrongly assume that interacting with a block-based editor requires simulating a DOM or running a headless browser. In the CCP architecture, this is a costly fallacy. The dashboard is not a visual canvas that agents "click"; it is a distributed data structure that agents "patch."

Think of this like **the neurobiology of memory consolidation**. During REM sleep, the hippocampus does not "open a browser" to write to the neocortex. Instead, it transmits discrete, compressed neural patterns—synaptic updates—that are integrated into the existing long-term memory structure. Multiple brain regions contribute these updates simultaneously, yet the "neocortical document" remains consistent without a central lock.

We use **Conflict-free Replicated Data Types (CRDTs)** to achieve this same feat. As 76 agents generate content, tracking data, and session recaps, they emit Yjs binary updates. These updates are mathematically guaranteed to converge on the same state, regardless of the order in which they arrive at the sync engine.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The AFFiNE dashboard is built on **BlockSuite**, which uses **Yjs** as its core synchronization engine. Yjs is a high-performance CRDT implementation that treats the document as a shared type (Text, Map, or Array). When an agent writes to the dashboard, it isn't sending a "Save" command for the whole file; it is emitting a **State Vector** and a set of **Update Binaries**.

The architectural flow is: **Input (Agent Output) → Serialization (BlockSuite Adapter) → Update Propagation (Yjs) → Persistence (Postgres)**. The `affine_sync.py` service acts as a "Headless Peer" in this network. It receives standard JSON payloads from the CCP agents, converts them into Yjs-compatible operations, and pushes them to the self-hosted AFFiNE instance.

The primary engineering challenge in 2026 is memory overhead. Running a full Yjs document model in a server-side Python environment can lead to OOM (Out of Memory) errors if the document history is large. To solve this, our sync engine utilizes **Idempotent Write Operations**. By using the **Universal Asset ID** as a key, the engine first queries the state vector to see if a block already exists. If it does, the engine generates a "Diff" update rather than a full document rewrite. This decoupled architecture ensures that even with 76 agents writing concurrently, the database avoids the "Deadlock of the Commons" found in traditional SQL-locking note apps.

## 📂 OUR CODE (100-200 words)

We orchestrate these headless writes through two primary services: `src/ccp/services/affine_sync.py` and `src/ccp/services/studio_block_service.py`.

- **`affine_sync.py`**, line 163: The `IdempotencyEngine` uses the Universal Asset ID to decide between `create_entry` or `update_entry`. This prevents the "Duplicate Block" failure mode common in async agentic pipelines.
- **`affine_sync.py`**, line 216: The `RetryEngine` enforces a 5-step exponential backoff (5s to 80s). This is critical for 2026 production stability; when the AFFiNE instance is under heavy batch-processing load, agents must "back off" to allow the Yjs state to stabilize.
- **`studio_block_service.py`**, line 273: `extract_text_blocks` demonstrates how the system reads *from* the CRDT structure, stripping non-text metadata to feed the Teleprompter.

```python
# affine_sync.py, line 187
# WHY: We query by Asset ID BEFORE writing to ensure 
# idempotency. This is the "Selective Permeability" gate
# described in the tech spec.
existing = await self._client.query_by_asset_id(
    workspace_id=workspace_id,
    section_id=section_id,
    asset_id=asset_id,
)
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> 
> Examine `src/ccp/services/affine_sync.py`. Implement a production-ready `RetryEngine` that incorporates the `SYNC_BACKOFF_SCHEDULE` from `ca11_models`. Ensure the `execute_with_retry` method correctly handles `SyncErrorType.MAX_RETRIES_EXCEEDED` by logging a final 'FAILED' status to the `affine_sync_events` table in Supabase. The implementation must follow the L10 Fact-Check regarding Yjs binary serialization and ensure that every retry attempt is recorded in the Receipt Chain Guard.

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the sync service health check
curl -X GET http://localhost:8000/health
# Expected: {"status": "healthy", "service": "affine_sync", "version": "2.0.26"}

# Trigger a manual content push for testing
curl -X POST http://localhost:8000/push/content -H "Content-Type: application/json" -d @tests/fixtures/test_payload.json

# Check the sync event log in Supabase
psql $DATABASE_URL -c "SELECT status, retry_count FROM affine_sync_events ORDER BY timestamp DESC LIMIT 1;"
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Provision the Sync Infrastructure:** Run the SQL block in `affine_sync.py` (lines 64-88) against your Supabase instance to create the `affine_sync_events` table and the `delivery_target` feature flag.
2. **Configure Environment Variables:** Set `AFFINE_API_TOKEN` and `AFFINE_BASE_URL` in your `.env` file. These are the credentials `Pierre` (the agent) uses to authenticate with the dashboard.
3. **Hardening the Sync Engine:** Open `affine_sync.py` and implement the `AFFiNEClient` placeholders (lines 113-156). Use the `httpx` library to wire these to the AFFiNE GraphQL API endpoints.
4. **Deploy the Webhook:** Ensure the `/webhook/canva-approve` endpoint is exposed to your local tunnel (e.g., ngrok) so you can receive events from the Canva App.
5. **Calibrate Idempotency:** Run the manual test in the Terminal section. Verify that pushing the same `asset_id` twice results in `was_update: True` on the second attempt.

## ✅ VERIFY (30-50 words)

Run `pytest tests/test_sync_engine.py`. The test suite must simulate three concurrent agent writes to a single page and assert that the Yjs state converges into three distinct, ordered blocks without data loss or "Overwrite Collisions."

## 🔗 BRIDGE (30-50 words)

Unit 9.4 has equipped you with a headless, CRDT-native delivery pipeline. In **Chapter 10: The Platform**, we migrate from this isolated service to the Global Platform—wiring these dashboard events to the Telegram nervous system for real-time client notifications.

<!-- FACT-CHECK: "AFFiNE BlockSuite Yjs status 2026" → BlockSuite remains Yjs-native; server-side manipulation via adapters is the recommended pattern for memory efficiency. -->
<!-- FACT-CHECK: "Universal Asset ID idempotency" → Industry standard for distributed write consistency in agentic workflows. -->
