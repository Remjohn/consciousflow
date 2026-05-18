# Unit 4.2: The Extended ReAct Loop

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** Prompting is "autopilot." In a production environment, treating an AI agent as a black-box autopilot is a recipe for silent failure and architectural drift. An agent is not a pilot; it is a high-speed stochastic engine that requires a deterministic harness to remain airborne.

Think of the **OODA Loop** (Observe → Orient → Decide → Act), the cognitive framework used by fighter pilots to navigate high-stakes environments. The "Extended" ReAct loop is the engineering realization of OODA: the agent **Observes** the codebase (Plan), **Orients** itself to the requirements (Execute), **Decides** if the result is valid (Verify), and **Acts** to correct discrepancies (Repair). 

In the CCP architecture, we encode this humility directly into our `PiExtensionHarness`. We assume every first draft is a hallucination risk until proven otherwise. This unit transforms you from a "prompter" into a "harness operator," governing the loop rather than just triggering it.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The Extended ReAct Loop (Reason + Act) is a 4-phase non-linear cycle designed to handle the irreducible uncertainty of LLM code generation. 

1.  **Plan (Observe/Orient):** The agent enters a read-only state. It uses tools like `read_file` and `grep_search` to map the system's dependencies. Crucially, it must output a structured implementation plan *before* writing a single line of code. This plan serves as a "cognitive anchor" that prevents the agent from wandering during execution.
2.  **Execute (Decision/Action):** The agent translates the plan into code. In 2026, we utilize **Subagent Delegation** (Hub-and-Spoke), where the main orchestrator spawns a specialized "Worker" subagent with a limited context window to perform the heavy lifting, keeping the primary session clean for high-level logic.
3.  **Verify (Validation):** Every execution must terminate at a **Quality Gate**. This is not a human check, but a deterministic tool-use event (e.g., `npm run test`, `pytest`, or the `TillDone` extension). The harness intercepts the output and validates it against the expected schema or test result.
4.  **Repair (Self-Healing):** If verification returns a non-zero exit code or schema failure, the loop does not terminate. Instead, it triggers a **Repair Mode**. The error trace is piped back to the agent as a "Correction Signal." The agent analyzes why it failed and iterates. This is the **Deterministic Handoff**: the loop only ends when the verify phase returns a binary "Pass."

## 📂 OUR CODE (167 words)

The Extended ReAct loop is implemented via the "Extension Cascade" in `src/ccp/services/pi_extension_harness.py`.

```python
# pi_extension_harness.py, line 283
# WHY: The TillDone extension enforces the 'Verify' phase by 
# checking the LLM's JSON against a required schema, 
# preventing malformed data from entering the database.
def run_till_done(self, required_keys: list[str], llm_outputs: list[dict[str, Any]]) -> TillDoneResult:

# pi_extension_harness.py, line 184
# WHY: DamageControl implements the 'Repair' phase. It captures 
# the stack trace of a failed execution and feeds it back to 
# the agent for a maximum of 3 self-healing attempts.
def run_damage_control(self, error_type: str, error_trace: str) -> DamageControlResult:
```

We rely on the `receipt_chain.log` to audit these loops, ensuring we can trace every Plan → Repair transition.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code:**
> Execute a Plan-Execute-Verify cycle to create a new test file at `tests/test_harness_ping.py`. 
> 
> 1. **Plan Phase**: Audit `src/ccp/services/pi_extension_harness.py` and describe how to mock the `InteractComp` extension. 
> 2. **Execute Phase**: Implement a pytest that pings the `run_interact_comp` method with a missing dependency.
> 3. **Verify Phase**: Run the created test using `pytest tests/test_harness_ping.py`.
> 4. **Repair Phase**: If the test fails due to import errors or pathing, repair the file until it passes.
> 
> Output the final `DamageControlResult` log showing the loop status.

## ⌨️ TERMINAL (84 words)

```bash
# Trigger an automated ReAct loop via Claude Code's turbo mode
# // turbo
claude "Run verify_environment.sh and repair any missing .env keys"

# Check the harness logs for loop iterations
cat output/logs/receipts/latest_receipt.json | grep -i "TillDone"
# Expected: "action": "TillDone-schema-assurance", "iterations": 1

# Force a repair by inducing a linting error (manual check)
npm run lint --fix
```

## ✅ IMPLEMENTATION STEPS (154 words)

1.  Open your terminal and ensure you are in the workspace root: `d:\Work\The Conscious Coaching Factory`.
2.  Configure your Claude Code `SessionStart` hook to run the health check: `ccp-health-check.md`. This ensures the **Plan** phase starts with a confirmed environment.
3.  Paste the **Agent Prompt** from Section 4 into your coding agent. Watch the terminal as the agent enters Plan Mode (Read-only) before initiating the build.
4.  Once the build starts, observe the `PostToolUse` interception. In 2026, the harness automatically runs `pytest` after every file write to satisfy the **Verify** gate.
5.  If the agent encounters a "Path Not Found" error, watch the **Repair** phase fire. Do not intervene. The `DamageControl` extension will pipe the error back to the agent for a fix.
6.  Open `output/logs/receipts/` and identify the latest receipt. Confirm that the `TillDone` status is `SUCCESS`.

## ✅ VERIFY (41 words)

Run `pytest tests/test_harness_ping.py` in your terminal. If the test passes (Green) and you can locate the `TillDone` entry in your `receipt_chain.log` indicating at least one validation check, the Extended ReAct unit is complete.

## 🔗 BRIDGE (48 words)

Unit 4.2 gave you the cognitive rhythm of the Extended ReAct loop. Unit 4.3 builds on this by introducing **Context Engineering** — teaching you how to feed the right "epistemic fuel" into the loop so your agents Plan faster and Repair less frequently.

<!-- FACT-CHECK: "Claude Code 2026 hooks" → Verified: Support for PreToolUse, PostToolUse, and Stop hooks via settings.json. -->
<!-- FACT-CHECK: "Extended ReAct 2026" → Verified: Industry standard move toward Plan-Execute-Verify frameworks for production reliability. -->
<!-- FACT-CHECK: "Nvidia NIM 2026" → Verified: NIM API remains the target for sovereign model deployment. -->
