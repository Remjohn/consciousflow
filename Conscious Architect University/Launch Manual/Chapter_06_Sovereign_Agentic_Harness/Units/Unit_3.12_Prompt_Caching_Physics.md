# Unit 3.12: Prompt Caching Physics

## 🧠 THE SCIENCE (138 words)

**UNLEARN:** "Every request to an LLM is a clean slate where the model re-reads your entire prompt from scratch." False — this is a computationally naive assumption that leads to catastrophic cost scaling. In production-grade agentic systems, every request is a surgical continuation of a deterministic state.

Think of prompt caching like the cognitive indexing of the human hippocampus: the brain doesn't re-learn the alphabet every time you start reading a new sentence. It maintains a consolidated, precomputed index (the cache) of your current epistemic frame (the system prompt and conversation history) so it can focus resources entirely on the novel delta (the new message). 

In the CCP, we exploit the physics of the KV (Key-Value) cache to ensure that a 100-turn conversation costs nearly the same as a single turn. Without this "physics" layer, the Harness would collapse under its own token weight.

## 🧠 TECHNICAL KNOWLEDGE (236 words)

Prompt caching exploits the underlying attention mechanism's Key-Value (KV) tensors. When an LLM processes a prompt (the "prefill" phase), it computes mathematical relationships between every token. These computations are normally discarded after the first token is generated. Prompt caching preserves these KV tensors for stable, frequently repeated prefixes.

In the 2026 landscape, caching has bifurcated into two primary modes:
1. **Explicit Control (Anthropic Style):** Using `cache_control: {"type": "ephemeral"}` markers to manually define where a cacheable block ends. This is the gold standard for agentic long-term memory.
2. **Implicit/Automatic (Gemini/OpenAI Style):** The provider automatically detects prefix matches of 1024+ tokens and serves them from cache without developer intervention.

**The Economics of Physics:**
- **Cache Miss (Base):** ~$0.025 per 1K input tokens.
- **Cache Hit:** ~$0.0025 per 1K input tokens.
- **Latency:** TTFT (Time to First Token) drops from ~2.5s for a 100K token prompt to <300ms.

**The Prefix Law:** Caching is strictly prefix-dependent. If a single character at the start of your prompt changes (e.g., adding a timestamp or a dynamic turn counter), the entire cache breaks. To maintain "Cache Stability," we must strictly decouple the **Canonical Workspace** (the instructions and context that stay stable) from the **Ephemeral Input** (the user's latest command), ensuring the stable block is always 100% token-identical across turns.

## 📂 OUR CODE (168 words)

In the CCP codebase, cache stability is governed by the `MemoryFolder` extension within the Pi Extension Harness. This service prevents "cache thrashing" by periodically pruning dynamic history and re-stabilizing the prefix.

Open: `src/ccp/services/pi_extension_harness.py`

```python
# pi_extension_harness.py, line 122
def run_memory_folder(
    self,
    current_token_count: int,
    task_complete: bool = False,
    raw_history: str = "",
) -> MemoryFolderResult:
    # WHY: We trigger a 'fold' when the context exceeds 4000 tokens. 
    # By compressing long histories into a single summary, we reset 
    # the prompt prefix to a stable state, ensuring the NEXT turns
    # hit the provider's 1024+ token cache threshold consistently.
    should_fold = (
        current_token_count > MEMORY_FOLDER_TOKEN_THRESHOLD # Threshold: 4000
        or task_complete
    )
```

By maintaining a `MEMORY_FOLDER_TOKEN_THRESHOLD` (line 28), we ensure that the "Working Memory" does not grow indefinitely. Line 149 compresses history to 25% of its size, effectively "re-indexing" the cache so the harness remains cost-effective over long durations.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code:**
> Audit `src/ccp/services/pi_extension_harness.py` and implement a `CacheStabilityManager` class. This class must provide a `get_stable_prefix()` method that separates static system instructions (from `agent_config.py`) and cached context summaries from the volatile ephemeral user input. Ensure that the stable prefix always contains a suffix marker `[CACHE_STOP]` to facilitate explicit `cache_control` headers for providers like Anthropic. The output should handle the deduplication of system prompts to prevent cache misses caused by redundant instruction injection.

## ⌨️ TERMINAL (84 words)

```bash
# Verify the current token usage and cache performance of the harness
python -m src.ccp.debug.check_cache_efficiency --coach_id REM

# Expected Output:
# [CACHE-AUDIT] Context Prefix Length: 4682 tokens
# [CACHE-AUDIT] Cache Status: HIT (91% efficiency)
# [CACHE-AUDIT] Turn Cost (Estimated): $0.0028 (Base: $0.0270)
# Status: PHYSICS_OPTIMIZED
```

## ✅ IMPLEMENTATION STEPS (182 words)

1. **Read `src/ccp/services/pi_extension_harness.py`**: Trace the `run_memory_folder` method (lines 122-172). Understand how the `FOLD_AND_WRITE` action effectively clears the volatile buffer to protect the cached prefix.
2. **Execute the Agent Prompt**: Paste the prompt from Section 4 into your Claude Code session to generate the `CacheStabilityManager`.
3. **Configure Thresholds**: Open `src/ccp/models/pi_extension_models.py` and verify `MEMORY_FOLDER_TOKEN_THRESHOLD` is set to `4000`. This ensures we exceed the 2026 minimum cache block size (typically 1024 tokens) while staying below the performance degradation limit.
4. **Mock Turn Test**: Run the terminal command in Section 5 to verify that consecutive turns are correctly hitting the cache.
5. **Audit Logs**: Open the `ReceiptChain` logs in your AFFiNE dashboard (via `affine_client_workspace.py`) and verify that `MemoryFolder` is firing `action=FOLD_AND_WRITE` whenever the limit is breached. This "Breath" mechanism is what preserves the physics of your wallet.

## ✅ VERIFY (44 words)

Run `python -m src.ccp.debug.check_cache_efficiency`. If the `Cache Status` shows `HIT` with `efficiency > 85%` across 5 consecutive simulated turns, the unit's work is complete. You have achieved a 10x reduction in operational overhead.

## 🔗 BRIDGE (42 words)

Unit 3.12 taught you how to economize cognition. Unit 3.13 builds on this by introducing Permission ACLs & Risk Classification — the security layer that governs WHICH cached data each agent is allowed to access and modify within the Harness.

<!-- FACT-CHECK: "Prompt caching 2026 Anthropic cache_control" → Anthropic Claude 3.5/3.7+ supports explicit cache_control markers with 90% cost reduction. -->
<!-- FACT-CHECK: "LLM KV cache physics optimization" → Standard industry term for preserving attention tensors to reduce prefill compute. -->
<!-- FACT-CHECK: "Google Gemini prompt caching limit" → Gemini 1.5/2.0+ supports automatic caching for prefixes > 32k/1k depending on tier. -->
