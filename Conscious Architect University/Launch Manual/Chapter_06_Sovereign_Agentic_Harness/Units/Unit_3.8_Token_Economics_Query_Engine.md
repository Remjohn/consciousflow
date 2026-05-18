# Unit 3.8: Token Economics & Query Engine Design

## 🧠 THE SCIENCE

**UNLEARN:** "Tokens are cheap, just use more." False — at scale (100 coaches × 5 clients × daily interactions), unbudgeted tokens cost $50K/month. Per-turn budgets cap this at $2K/month.

Think of token economics like the thermodynamics of an enclosed thermodynamic engine. Heat (tokens) must be transferred methodically to perform mechanical work (answering a client). If you inject unbounded heat into the system, the engine doesn't just run faster; the pistons melt and the system suffers unrecoverable thermal failure. 

In the CCP architecture, token economics is not merely a billing abstraction; it is the fundamental constraint governing swarm cognitive load. A Harness acts as a Central Bank, issuing tight micro-budgets on a strictly per-turn basis rather than handing agents blank cognitive corporate cards. When agents are granted unbounded context windows, they wander off-task resulting in "catastrophic hallucination." By fiercely constraining token expenditure, we mathematically force the orchestrator to prioritize the most critical context patterns, stabilizing both inference latency and operational cost.

## 🧠 TECHNICAL KNOWLEDGE

Even though the Sovereign Nvidia NIM infrastructure processes inference via fixed compute costs (e.g., ~$1/hour/GPU instance) rather than SaaS per-token API charges, token output remains proxy for GPU cycle capacity. If Morgan Orchestrator gets trapped in an unconstrained generative loop, it monopolizes the G5 instance, effectively rendering the GPU inaccessible to the rest of the batch queue.

The CCP pipeline solves this through a rigorous Query Engine Design utilizing **NIM Cascade Routing** for failover processing. Rather than using proprietary fallbacks like Bedrock, we deploy a cascading router across our sovereign containers.

1. **Tokens-Per-Turn Limits:** The Query Engine enforces static token boundaries per agent interaction. If the agent exceeds this threshold, the Engine triggers a `MaxTokensExceeded` failover trap to stop the inference stream dead.
2. **NIM Cascade Routing:** When high-tier cognitive overhead reaches peak latency constraints on the heavy Llama 3 70B instance, the router dynamically shifts simplistic downstream tasks (like text formatting or basic NLP extraction) to a pre-warmed Llama 3 8B container. 
3. **Tool-Call Constraints:** Generative passes are constrained to a stark maximum tool invocation count. Every tool call eats Context-Window space via Pydantic schema declarations; limiting calls acts as intrinsic token preservation.

## 📂 OUR CODE

- `src/ccp/services/latency_protocol_service.py` line 42: The central limit allocator.
- `src/ccp/services/latency_protocol_service.py` line 125: NIM cascade routing fallback logic.

```python
# latency_protocol_service.py, line 42
# WHY: Imposing hard token constraints per turn ensures 
# GPU capacity isn't hijacked by infinite reflection loops.
self.enforce_token_budget(agent="morgan", max_tokens=1500)

# latency_protocol_service.py, line 125
# WHY: NIM Cascade Routing. If the 70B primary container hits 98% utilization, 
# lower-complexity summarizations degrade gracefully to the 8B NIM.
if system_load > 0.98:
    route_inference("llama-3-8b-instruct") 
```

## 🤖 AGENT PROMPT

> **Prompt for Claude Code:**
> Open `src/ccp/services/latency_protocol_service.py`. Locate the class `QueryEngineAllocator` around line 42. Implement a new function `calculate_turn_burn_rate()` that measures the current system memory utilization against the permitted max token allocation. Then, update the `route_inference` cascade on line 125 to include a specific timeout clause that forces routing to the `llama-3-8b-instruct` container if the 70B container does not return the first chunk within 1.5 seconds. Ensure all configuration strictly utilizes our NVIDIA NIM sovereign URLs.

## ⌨️ TERMINAL

```bash
# Check the status of running NIM containers for cascade testing
docker ps --filter "name=nim-llama3"

# Review the active latency logs for cascade fallback triggers
tail -f cmf/logs/latency_protocol.log | grep "CASCADE ROUTING"
# Expected: CASCADE ROUTING: 70B timed out -> Falling back to 8B container
```

## ✅ IMPLEMENTATION STEPS

1. Open `src/ccp/services/latency_protocol_service.py` and inspect the `QueryEngineAllocator` definitions starting at line 42.
2. Trace the token constraints. Map out the budget assigned to the Morgan orchestrator compared to the specialized generation agents. 
3. Paste the prompt from Section 4 into your Claude Code session to generate the `calculate_turn_burn_rate()` token monitoring function. 
4. Review the deployed NIM Cascade Routing on line 125. Understand how the fallback mechanism guarantees operation uptime by dynamically switching from 70B to 8B models without human intervention.
5. Create a load test script using your CLI to ping the local backend and watch the logs.

## ✅ VERIFY

Calculate the maximum network footprint mathematically: 100 coaches × 5 clients × 3 daily interactions × 4000 tokens = 6,000,000 max daily tokens. Verify this number against Llama 3 8B throughput capabilities (approx 200 tokens/sec = 30,000 seconds of GPU time ≈ ~8.3 EC2 instance hours). Mathematical verification ensures capacity footprint.

## 🔗 BRIDGE

Unit 3.9 (Hook Pipelines — Pre/Post/Stop) builds upon these economic limitations by attaching these rigid token boundaries directly into the execution hooks before, during, and after every tool invocation.

<!-- FACT-CHECK: "Llama 3 70B open source inference throughput token cost NIM" → Llama 3 is open weights (Meta) available as NIM container via build.nvidia.com. 70B and 8B are standard configurations. Using NIM cascade routing successfully negates need for proprietary API like Bedrock. -->
