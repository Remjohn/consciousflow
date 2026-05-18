# Unit 4.6: Model Routing & Cascade

## 🧠 THE SCIENCE (146 words)

**UNLEARN:** You do not "always use the best model." The habit of routing every request to a massive frontier reasoning model is not only financially reckless but structurally inefficient—it is the equivalent of calling a neurosurgeon to put on a Band-Aid. 

Think of it through the lens of **Entomology**: in an ant colony, specialized roles (scouts, foragers, workers, and warriors) are assigned based on the task's complexity and "cost" to the colony. A colony that sends its largest warriors to forage for single seeds would collapse under its own metabolic weight. In an agentic harness, this is **Cognitive Triage**. We categorize every human prompt into a "task tier" before the model ever sees it. By routing simple data extraction to a lightweight "mini" model and reserving the expensive reasoning tiers for complex engineering logic, we achieve the **Hive Mind Efficiency** required to scale a multi-agent system like the CCP without bankrupting the operator.

## 🧠 TECHNICAL KNOWLEDGE (236 words)

In 2026, the performance of an agent is no longer defined by a single benchmark score, but by its **Risk-Adjusted Inference Portfolio**. This architecture relies on a three-tier routing taxonomy that matches task complexity to model capability:

1.  **Level-1 (Fast/Cheap):** Routine classification, simple parsing, and extraction. These are routed to open-source "mini" models or edge-running weights.
2.  **Level-2 (Generation):** Drafting text, formatting code snippets, and standard conversational responses. This uses standard "Pro" tier models.
3.  **Level-3 (Reasoning/Logic):** Architectural planning, complex debugging, and multi-step math. These are routed to "Reasoning" models utilizing test-time compute.

A critical 2026 finding is the **Price Reversal Phenomenon**: while Level-1 models have the lowest per-token cost, using them for Level-3 tasks results in *higher* total system costs. A "cheap" model that fails the task three times, requires human escalation, or produces a bug that crashes downstream renders is 20x more expensive than a reasoning model that gets it right on the first turn. 

Our harness implements this via the `ModelRouter`. It intercepts the `TaskType` signal (defined by the orchestration layer) and hot-swaps the model endpoint mid-loop. This ensures that the agent utilizes the "High-Reasoning" tier only when the epistemic difficulty crosses a specific threshold, while defaulting to the "Fast/Cheap" tier for routine context folder operations. This creates a **Cascade Effect**—if a cheap model fails a schema validation gate (Unit 4.5), the system automatically "escalates" the retry to a higher-tier model for repair.

## 📂 OUR CODE (142 words)

The model routing logic is encapsulated in the `ModelRouter` extension point within the core harness service.

- `src/ccp/services/pi_extension_harness.py`, lines 240-273: `run_model_router()`
    - **WHY:** This function acts as the "Traffic Controller." It checks the `task_type` and selects the model from the `_MODEL_ROUTING_TABLE`.
- `src/ccp/models/pi_extension_models.py`, lines 40-51: `_MODEL_ROUTING_TABLE`
    - **WHY:** This is the configuration layer. It maps the `ModelTier` (Ultra-High, Reasoning, Fast-Cheap) to the specific 2026 model identifiers (e.g., GPT-4o, o3-mini).

```python
# pi_extension_harness.py, line 256
# WHY: Decouples the 'logic of needing a Tier' from the 'choice of specific model'. 
# This allows us to swap providers (OpenAI → Anthropic → Gemini) without changing code.
decision = ModelRouterDecision(task_type=task_type)
decision.selected_model = registry.get(decision.selected_tier, "gpt-4o")
```

## 🤖 AGENT PROMPT (108 words)

> **Prompt for Pi Coding Agent:**
> Review `src/ccp/services/pi_extension_harness.py` and `src/ccp/models/pi_extension_models.py`. Create a new test script at `tests/test_model_routing.py` that executes the `run_model_router()` function for three distinct `TaskType` values: `STRATEGY_PLANNING`, `CODE_GENERATION`, and `DATA_EXTRACTION`. The test must verify that each task is routed to the correct `ModelTier` and returns the expected model ID from the configuration table. Use the `ReceiptChain` to confirm that the routing decision is logged correctly with the appropriate rationale. This proves our harness can dynamically optimize cost and intelligence based on task complexity.

## ⌨️ TERMINAL (62 words)

```bash
# Execute the model routing verification test
pytest tests/test_model_routing.py -v

# Check the execution logs to see the routing Rationales
grep "Routed to" output/logs/harness_execution.log
# Expected: decision=ROUTED_TO_REASONING, metadata={"stage_name": "STAGE-EXT-ModelRouter"}
```

## ✅ IMPLEMENTATION STEPS (152 words)

1.  Open `src/ccp/models/pi_extension_models.py` and analyze the `ModelTier` and `TaskType` enums.
2.  Research the current `_MODEL_ROUTING_TABLE` implementation. Note how it maps `STRATEGY` tasks to the highest tier.
3.  Paste the prompt from Section 4 into your Pi Coding Agent session to generate the `test_model_routing.py` unit test.
4.  Run the test using the terminal command in Section 5.
5.  Try to "Force an escalation": Modify the test to simulate a failure in a Level-2 task and see if the harness correctly recommends a Level-3 fallback.
6.  Open `AGENTS.md` and update your architectural notes. Add a section for "Inference Budgeting" documenting your findings on the Price Reversal Phenomenon.
7.  Verify that your local `.env` contains the API keys for at least two different providers to test cross-model routing capability.

## ✅ VERIFY (48 words)

`pytest tests/test_model_routing.py` → all green. The output shows `ModelRouterDecision` logs mapping `STRATEGY_PLANNING` to the `ULTRA_HIGH` tier and `DATA_EXTRACTION` to the `FAST_CHEAP` tier. This confirms the harness can perform cognitive triage across the inference portfolio.

## 🔗 BRIDGE (45 words)

Unit 4.7 builds on this by introducing **Tool Permission & Auto-Run** — the safety layer that decides whether the model we just routed to is allowed to execute the code it generates, enforcing the `SafeToAutoRun` boundaries based on the risk-tier of the model.

<!-- FACT-CHECK: "Router model benchmarks 2026" → Bifrost and Inworld routers in early 2026 show that dynamic routing reduces TCO by 35-50% while maintaining >95% of 'all-frontier' reasoning quality. -->
