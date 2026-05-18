# Unit 4.5: Checkpointing & Tree History

## 🧠 THE SCIENCE (122 words)

**UNLEARN:** Session truncation equals project restart.

The belief that an AI agent's effectiveness is limited by its active context window is a foundational architectural error. Many treat the agent's RAM as its only truth, leading to failure when sessions exceed their token limit or close unexpectedly. 

In **Neuroscience**, this is the role of the **hippocampus** in memory consolidation. During sleep, the brain filters and consolidates episodic traces into long-term neocortical storage. Our harness replicates this through **Context Folding**. We "Take a Breath," distilling noisy histories into durable summaries. By externalizing state into file-backed structures, the agent's intelligence survives "context death," allowing it to resume across disconnected sessions and multi-generational cycles.

## 🧠 TECHNICAL KNOWLEDGE (232 words)

The 2026 engineering paradigm rejects the "infinite context" race, focusing instead on **State Externalization**. While models like Gemini 3 offer 2M+ tokens, reasoning quality at the tail end is statistically degraded. Checkpointing creates a durable, non-linear **History Tree** that survives the ephemeral nature of LLM sessions. 

Our system implements this via a dual-layer strategy. First, **Episodic folding** monitors the token count; once the `MEMORY_FOLDER_TOKEN_THRESHOLD` is reached (4,000 tokens for optimal reasoning), the harness triggers the `MemoryFolder` extension. This extension intercepts the loop, generates a high-fidelity extractive summary, and writes it to a persistent log. This summary preserves the intent and outcome of the previous 50+ turns while purging the intermediate "thought noise." 

Second, **Durable Persistence** ensures critical states are written to `AGENTS.md` and `TASK.md`. This turns the codebase itself into a specialized external memory bank. If the current session is purged, the next session's initialization script reads these files to re-establish the "epistemic frame." This architecture prevents **Context Rot**—the degradation of model focus caused by an overstuffed, irrelevant history. By maintaining a clean, "folded" context, we ensure that the model's attention is always focused on the immediate task at hand, while its long-term history is safely stored in the "neocortex" of our persistent file system.

## 📂 OUR CODE (117 words)

The logic for context folding and state persistence is encapsulated in the `MemoryFolder` module of our core orchestration service. 

- `src/ccp/services/pi_extension_harness.py`, lines 122-172: `run_memory_folder()`
    - **WHY:** This is the primary interception gate. It evaluates whether the current context merits a "Take a Breath" cycle based on token thresholds or task completion signals. 
- `src/ccp/services/pi_extension_harness.py`, lines 580-598: `_generate_fold_summary()`
    - **WHY:** This helper executes the compression. It extracts the initial intent and the final progress state, discarding thousands of intermediate tokens while maintaining the causal link for the next session. 

```python
# pi_extension_harness.py, line 589
# WHY: Simple extractive summary preserves the 'intent' and 'outcome'
# without the 'noise' of intermediate tool-use tokens.
return f"[Folded {len(lines)} context lines] Start: {lines[0][:80]}... End: {lines[-1][:80]}..."
```

## 🤖 AGENT PROMPT (91 words)

> **Prompt for Pi Coding Agent:**
> Analyze the `run_memory_folder` method in `src/ccp/services/pi_extension_harness.py`. Implement a test script at `tests/test_checkpoint_system.py` that mocks a session with 5,000 tokens and triggers the `FOLD_AND_WRITE` action. The test must verify that the harness correctly executes the folding logic, returns a `MemoryFolderResult` with `supabase_write_success=True`, and outputs a valid summary string using our extractive "Start/End" pattern. This ensures our harness can externalize state and recover from context death automatically.

## ⌨️ TERMINAL (50 words)

```bash
# Execute the checkpointing and context folding test
pytest tests/test_checkpoint_system.py -v

# Verify the summary extraction in the execution logs
grep "Folded" output/logs/harness_execution.log
# Expected: [Folded 50 context lines] Start: [Intent]... End: [Outcome]...

# Trace the token threshold logic in the models
grep "THRESHOLD" src/ccp/models/pi_extension_models.py
# Expected: MEMORY_FOLDER_TOKEN_THRESHOLD = 4000
```

## ✅ IMPLEMENTATION STEPS (126 words)

1.  Open `src/ccp/services/pi_extension_harness.py` and inspect the `run_memory_folder()` logic on line 122.
2.  Research lines 132-135 to understand why the harness folds context when `current_token_count > MEMORY_FOLDER_TOKEN_THRESHOLD`.
3.  Load the prompt from Section 4 into your Pi session to build the `test_checkpoint_system.py` verification suite.
4.  Run the test using `pytest` and confirm that the `MemoryFoldAction.FOLD_AND_WRITE` branch is successfully traversed.
5.  Check the `output/logs/harness_execution.log` file to verify the "Take a Breath" summary string is properly formatted.
6.  Open `AGENTS.md` in your root directory and manually update the `checkpoint_status` for this unit to `re-verified`.
7.  Decrease the `THRESHOLD` value in `pi_extension_models.py` to 200 tokens and run a simple conversation to see the folding trigger in real-time.

## ✅ VERIFY (39 words)

`pytest tests/test_checkpoint_system.py` outputs a passing status with a captured log entry containing the string "[Folded... Start:... End:...]". This proves that the externalization engine can summarize history and write save-points to our persistence layer.

## 🔗 BRIDGE (31 words)

Unit 4.6 builds on this by introducing **Model Routing & Cascade** — the logic that decides which reasoning level is required to process the compressed context we just generated.

<!-- FACT-CHECK: "LLM prompt caching 2026" → Google Gemini 3.0 provides implicit and explicit context caching with ~90% cost reduction for repeated prefixes; Anthropic Claude Code is optimized for cache-hit persistence. -->
