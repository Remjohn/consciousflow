# Unit 11.4: Receipt Chain — Provenance Tracking

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** Logs are not evidence. In a high-stakes agentic architecture, a standard `.log` file is merely a collection of append-only text strings that any process with write-access can spoof. They are "witnesses" who can be bribed; they are not DNA.

Think of the "Pheromone Trail" in an ant colony. Each ant deposit determines the path for the next. If the chemical trace is broken, the entire colony halts to prevent divergence into unmapped, high-entropy terrain. The colony doesn't "guess" the path; it requires the physical chemical evidence of the previous ant's success. 

The Receipt Chain is our pheromone trail. It transforms our 76-agent cognitive-behavioral matrix from a "black box" into a mathematically provable lineage. Every agent must deposit a cryptographic receipt before the next can move. If the receipt is missing, the chain breaks—guaranteeing that no hallucinated or corrupted state can "fail-forward" into production.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The **Receipt Chain Guard Protocol (DEP-PROTO-010)** enforces deterministic data provenance across the entire JIT Compiler pipeline. It operates as a cryptographic linked-list where every node (Agent or Adapter) is legally bound to the **No-Bypass Rule**.

The core primitive is the **Node Receipt**. Unlike a standard log entry, a receipt contains four distinct SHA-256 blocks:
1.  **Input Payload Hash**: Proves exactly what data the agent received.
2.  **Output Payload Hash**: Proves exactly what data the agent produced.
3.  **Previous Receipt Hash**: The link to the upstream parent, creating the chain.
4.  **Deterministic Node Hash**: A unique signature derived from `timestamp + node_id + payload_checksum`.

The system uses **Pessimistic Locking**. At every handoff boundary, the **Receipt-Verification-Interceptor** checks the incoming payload for a valid `receipt_chain_hash`. If the hash is missing or structurally invalid (e.g., a "Shadow Agent" attempting to bypass security), the **Circuit Breaker** trips. 

This triggers an immediate **Quarantine**. The entire RAM state of the current execution batch is wrapped into a `QuarantineTicket` JSON object, partitioned strictly by `coach_id` to prevent cross-tenant data leaks (ADR-01). The pipeline is then physically killed. This ensures that the CCP never guesses; it only executes on verified evidence. For the operator, the **Forensic Audit Protocol (DEP-ENG-042)** allows backward traversal of these hashes to reconstruct exactly why a decision was made at 3:00 AM on a Tuesday.

## 📂 OUR CODE (142 words)

We orchestrate this protocol within `src/ccp/services/receipt_chain_guard.py`. Open this file and isolate the following logic:

- **Stage 1 (Generation)**: Lines 69–149. Note how `_hash_payload` (Line 410) ensures that we never store the massive raw payload in the ledger—only its 16-character SHA-256 slice to prevent database bloat.
- **Stage 2 (Verification)**: Lines 153–224. The `verify_handoff` method enforces the "No-Bypass Rule." Look at Line 203: we explicitly treat a `PARTIAL` success status as a binary `FALSE`. This prevents a degraded skill from leaking into the final assembly.
- **Stage 3 (Circuit Breaker)**: Lines 228–297. This is the emergency brake. It packages the `preserved_state` (Line 270)—such as expensive AI images already generated—into the quarantine ticket, saving compute costs during manual recovery.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code:**
> Inspect `src/ccp/services/receipt_chain_guard.py`. Create a new test utility at `tests/services/test_handoff_security.py` that mocks a "Shadow Agent" injection. 
> 
> 1. Use `ReceiptChainGuard` to generate a valid receipt for `Builder_Stage_1`.
> 2. Manually strip the `receipt_chain_hash` from the emitted payload.
> 3. Pass this "orphaned" payload to `verify_handoff` for `Assembler_Stage_0`.
> 4. Assert that the `chain_verified` boolean is `False` and the `verification_result` is `VerificationResult.MISSING_HASH`.
> 5. Finally, trigger `trip_circuit_breaker` and verify the `QuarantineTicket` contains the correct `coach_id`.

## ⌨️ TERMINAL (68 words)

```bash
# Verify the hashing utility stability (must produce identical hashes)
python -c "from src.ccp.services.receipt_chain_guard import ReceiptChainGuard; g = ReceiptChainGuard('ANA'); p = {'id': 1}; print(g._hash_payload(p) == g._hash_payload(p))"
# Expected: True

# Run the handoff security unit tests
pytest tests/services/test_handoff_security.py
# Expected: 1 passed
```

## ✅ IMPLEMENTATION STEPS (154 words)

1. Read `docs/architecture/FR21_Receipt_Chain_Guard_Tech_Spec.md` to understand the DEP-PROTO-010 compliance standards.
2. Initialize the `ReceiptChainGuard` within your session using your 3-character coach acronym.
3. Open `src/ccp/services/receipt_chain_guard.py` and review the `generate_receipt` method. Ensure you understand how the `payload_checksum` is extracted.
4. Execute the **Shadow Agent Test**: Paste the Agent Prompt from Section 4 into your Claude Code session to build the handoff security test.
5. Run the terminal commands in Section 5 to confirm that your local environment correctly enforces hash-linked verification.
6. Observe the generated `QuarantineTicket`. Can you identify the exact `failed_at_node` and `missing_upstream_receipt`?
7. Integrate the `check_ghost_variables` gate into your local `assembly_orchestrator.py` to intercept NULL field violations before they reach the LLM.

## ✅ VERIFY (44 words)

Run `pytest tests/services/test_handoff_security.py`. If the test passes, it proves the **Receipt Chain Guard** successfully intercepted an unverified payload and tripped the circuit breaker. This binary pass/fail check confirms your system is no longer a black box.

## 🔗 BRIDGE (36 words)

Unit 11.5 builds on this by introducing **Backup & Disaster Recovery**. We will learn how to automate the replication of these immutable receipt ledgers to S3, ensuring that even a total system failure cannot erase our evidence.

<!-- FACT-CHECK: "SHA-256 for data provenance 2026" → Still industry standard for non-quantum-critical hash chains. SHA-3 (Keccak) used as high-security alternative in AAT draft. -->
<!-- FACT-CHECK: "Agent Audit Trail (AAT) 2026" → IETF Draft published February 2026, focuses on JSON-LD based decision traceability. -->
