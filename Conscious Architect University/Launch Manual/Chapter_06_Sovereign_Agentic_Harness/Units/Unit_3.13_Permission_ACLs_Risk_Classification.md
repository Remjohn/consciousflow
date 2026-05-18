# Unit 3.13: Permission ACLs & Risk Classification

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** "Trusting the AI to be safe" is a structural failure in engineering. In an agentic swarm, trust is not a virtue; it is a vulnerability. If you rely on an agent's "good intentions" or constitutional prompts to protect your database, you have already lost. The Large Language Model (LLM) is an engine of probability, not a guarantor of security.

Think of the CCP architecture like a high-security bank vault. In this system, the agent is a teller. The teller is capable, intelligent, and trained, but they do not hold the keys to the main vault. Access is governed not by the teller's personality, but by a deterministic Access Control List (ACL) enforced by the physical architecture of the building. Even if a teller is "persuaded" (prompt injected) to give away the gold, the mechanical interlocks of the vault prevent it. We don't trust the teller; we enforce the blast radius of their role.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

Deterministic authorization in agentic systems works by separating the **Reasoning Layer** (the LLM) from the **Execution Layer** (the Harness). In the CCP, we implement this through a three-tier Risk Classification system and a decorator-based Permission ACL.

**1. Risk Classification Tiers:**
- **LOW:** Read-only access to non-sensitive data (e.g., public coach profiles, session logs). Failure results in minor data leak.
- **MED:** Write-access to ephemeral state (e.g., current task status, temporary buffers). Failure requires a process restart or cache clear.
- **HIGH:** Read/Write access to "Soul Files" and financial records (e.g., `coach_soul.json`, billing DB, production deployment). Failure results in catastrophic identity loss or financial damage.

**2. The Decorator Pattern:**
We use Python decorators (e.g., `@requires_clearance(level="HIGH")`) to wrap sensitive tool functions. This creates a hard boundary at the Python runtime level. When an agent attempts a tool-call, the Harness intercepts the call *before* it reaches the function. It checks the agent's current `clearance_certificate` against the resource's ACL. If the clearance is insufficient, the function never executes.

This is the "PreToolUse" logic found in the Claude Code 2026 architecture. By moving the "Yes/No" decision outside the model's context window and into a deterministic code block, we eliminate the risk of prompt injection bypassing security. The model can reason about wanting to delete the database all it wants, but the `guardian_agent.py` interlock will simply return a `PermissionDenied` error to the model's tool-output channel.

## 📂 OUR CODE (185 words)

Within our codebase, the `guardian_agent.py` acts as the primary enforcer of these ACLs. It manages the issuance of `GenesisClearanceCertificate` and oversees the Stewardship Mode where real-time permissions are checked.

Open `src/ccp/agents/guardian_agent.py`:
```python
# guardian_agent.py, line 645
# WHY: This classmethod is the code-level gate. It ensures that 
# no agent can initialize a sensitive production environment 
# without a valid, non-tampered Genesis Clearance Certificate.
@classmethod
def check_genesis_clearance(cls, coach_acronym: str, base_dir: str = "./coaches"):
    # ... logic ...
```

In the next iteration of the `GuardianAgent`, we will implement the `@requires_clearance` decorator. This logic ensures that if an agent attempts to write to `coach_soul.json` but only has `MED` clearance, the `GuardianAgent` will intercept and halt the transaction. We are currently using `ReceiptChain` (line 114) to audit every attempt, creating a permanent, immutable record of both authorized and blocked actions. This "Immutable Reasoning Trace" is essential for 2026-standard compliance.

## 🤖 AGENT PROMPT (125 words)

> **Prompt for Claude Code:**
> Initialize a new permission configuration file at `src/ccp/config/permissions_acl.yaml`. This file must define the ACL for three core resources in the CCP architecture:
> 1. `coach_soul`: Clearance HIGH, Action: READ/WRITE, Owner: System Architect.
> 2. `billing_records`: Clearance HIGH, Action: WRITE, Owner: Finance Agent.
> 3. `session_state`: Clearance MED, Action: READ/WRITE, Owner: Swarm Agents.
> 
> Use a standard YAML structure. Then, update `src/ccp/agents/guardian_agent.py` to include a `verify_permission(resource, action, agent_clearance)` method that reads this YAML and returns a boolean. Ensure the logic defaults to `False` if the resource or action is not explicitly defined in the ACL.

## ⌨️ TERMINAL (85 words)

```bash
# Verify the current Genesis Clearance status for coach NDL
# This command checks the existence and validity of the certificate
python -c "from src.ccp.agents.guardian_agent import GuardianAgent; print(GuardianAgent.check_genesis_clearance('NDL'))"

# Expected: (True, <GenesisClearanceCertificate object at ...>)

# Attempt to access a HIGH risk resource with LOW credentials (simulation)
# This should be blocked by the Guardian Agent's verification logic
pytest tests/test_guardian_permissions.py -k "test_unauthorized_soul_write"
# Expected: 1 passed, 0 failed (asserting PermissionError was raised)
```

## ✅ IMPLEMENTATION STEPS (160 words)

1. **Define the Risk Registry:** Open `docs/architecture/Risk_Classification_Matrix.md` and review the classification levels for all 15 pipelines.
2. **Configure the ACL:** Paste the prompt from Section 4 into your Claude Code session to generate `permissions_acl.yaml`.
3. **Verify Code Mapping:** Open `src/ccp/agents/guardian_agent.py` and locate the new `verify_permission` method. Ensure it correctly identifies the owner of a resource.
4. **Implement the Decorator:** Create a new utility in `src/ccp/core/security.py` called `requires_clearance` that wraps functions and calls `guardian_agent.verify_permission()` before execution.
5. **Secure the Soul File:** Apply the `@requires_clearance(level="HIGH")` decorator to the `update_soul()` function in `src/ccp/services/personality_service.py`.
6. **Execution Audit:** Run the terminal commands in Section 5 to ensure the system correctly blocks unauthorized attempts while allowing valid ones.

## ✅ VERIFY (45 words)

Run `pytest tests/test_guardian_permissions.py`. All tests must pass, specifically validating that a `PermissionError` is raised when a `MED` clearance agent attempts to write to a `HIGH` clearance resource. This proves the deterministic interlock is functioning correctly.

## 🔗 BRIDGE (40 words)

Unit 3.14 builds on this by introducing **The Human as Arbiter Node** — the mechanism that allows a human coach to provide Just-in-Time (JIT) clearance overrides for HIGH-risk actions that the swarm cannot authorize alone.

<!-- FACT-CHECK: "FLUX.1 NIM container 2026" → Available on build.nvidia.com as flux-1-dev-nim, Apache 2.0 -->
<!-- FACT-CHECK: "claud-code pretooluse hooks 2026" → Verified: allows allow/deny/ask decisions before tool execution, enabling deterministic authorization. -->
<!-- FACT-CHECK: "A2A protocol 2026" → Google/OpenAI standard for cross-agent capability discovery and permissioned handoffs. -->
