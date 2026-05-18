# Unit 2.15: Batch Cost Engineering & Spot Pricing

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** GPU compute is not a "utility" like electricity that you pay for by the second. In a sovereign AI factory, GPU compute is a **raw commodity** subject to market volatility, capacity blocks, and arbitrage. Paying "On-Demand" prices for inference is not an engineering choice; it is a sovereignty tax paid to providers for the illusion of 24/7 availability.

To master the CCP, you must think like a thermal engineer managing **Heat Dissipation and Entropy**. In thermodynamics, a system that tries to maintain a constant, high-energy state (Always-On) requires continuous work and generates massive waste heat (cost). A **Batch-Oriented** system, however, operates like a thermal buffer: it accumulates "potential work" (queued video beats) and then discharges that energy in a high-intensity burst (the Batch Run) before returning to a zero-energy state. 

By decompressing the "Real-Time Drift" of chatbots into the "Batch Sovereignty" of the CMF, we decouple our operational costs from the passage of time. We only pay for the **seconds of work**, not the **hours of idle existence**. This is the First Principle of Agentic Economics: solve for the batch, and the margin solves itself.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The AWS Spot Market is a real-time auction for spare EC2 capacity. For the CCP System Architect, the Spot market represents the ultimate "Sovereignty Dividend." While On-Demand pricing for a **G5.xlarge (A10G)** might sit at $1.21/hr, the Spot price frequently clears at $0.34/hr—a 72% discount. For **G6.xlarge (L4)** instances, the newer 2026 standard for efficient inference, the margin is even tighter.

However, Spot instances are **preemptible**. AWS can reclaim the hardware with a two-minute warning. This is why the CMF is engineered for **State Persistence and Resumability**. If a Spot instance is reclaimed mid-render, the `pipeline_commander.py` state machine ensures the job is not lost; it simply re-queues and resumes from the last successful checkpoint on the next available instance.

We categorize costs into three tiers:
1. **Fixed Infrastructure:** The "Brain" (PostgreSQL, Neo4j, FastAPI) — always on, low cost.
2. **Scheduled Compute:** Weekly content batches — high intensity, Spot-driven, predictable duration.
3. **On-Demand Burst:** Urgent client voice tracking — typically handles on a per-invocation basis or short-lived "Capacity Blocks."

By 2026, **EC2 Capacity Blocks for ML** allow us to reserve GPU time in 1-hour increments for specific batch windows, guaranteeing uptime without the $21,600/month "Always-On" penalty. We optimize for **GPU-Seconds per Video** ($0.96 average) rather than **Server-Hours**. If your video takes 48 seconds to render, we refuse to pay for the 59 minutes and 12 seconds of idle time that a standard rental service includes in their markup.

## 📂 OUR CODE (100-200 words)

The `pipeline_commander.py` is the financial governor of the CMF. It doesn't just track progress; it calculates the "Generation Debt" incurred by every state transition.

```python
# pipeline_commander.py, line 83-85
# WHY: Hard-coded cost metrics ensure the system can calculate 
# burn rates WITHOUT calling external AWS Cost Explorer APIs per-beat.
COST_T2I_PER_KEYFRAME = 0.02
COST_I2V_PER_CLIP = 0.06

# pipeline_commander.py, line 378
# WHY: This function sums the base cost (first generation) plus 
# the 'Regeneration Tax' (failed gates). It enforces accountability: 
# Every time an agent fails a Quality Gate, the cost is logged.
def compute_generation_cost(beat_count: int, regeneration_count: int = 0) -> float:
    base_cost = beat_count * (COST_T2I_PER_KEYFRAME + COST_I2V_PER_CLIP)
    regen_cost = regeneration_count * (COST_T2I_PER_KEYFRAME + COST_I2V_PER_CLIP)
    return round(base_cost + regen_cost, 2)
```

🔧 **EXTEND** — Add a logic block to `pipeline_commander.py` that checks the current EC2 billing mode (Spot vs On-Demand) and applies a 0.3x multiplier to the `total_generation_cost_usd` when running on Spot hardware. This ensures the dashboard reflects actual infrastructure spend, not theoretical maximums.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> 
> Create a new utility script at `src/ccp/tools/batch_calculator.py` that calculates the projected cost of a CMF batch. The script should:
> 1. Read the current Spot price for `g5.xlarge` and `g6.xlarge` using the `aws ec2 describe-spot-price-history` command.
> 2. Accept a `--beats` argument representing the total number of video beats in the queue.
> 3. Calculate: (Projected Rendering Time per Beat × Total Beats) × Current Spot Price.
> 4. Compare this against a flat $1.50/video benchmark (proprietary competitor rate).
> 5. Output a "Sovereignty Savings Report" highlighting the total USD saved.
> 
> Reference `pipeline_commander.py` for the per-beat cost constants to ensure alignment.

## ⌨️ TERMINAL (50-100 words)

```bash
# Check the last 3 hours of Spot pricing for G6 (L4) instances in your region
aws ec2 describe-spot-price-history \
    --instance-types g6.xlarge \
    --product-descriptions "Linux/UNIX" \
    --start-time $(date -u -v-3H +%Y-%m-%dT%H:%M:%SZ) \
    --query "SpotPriceHistory[*].{Price:SpotPrice,Time:Timestamp}" \
    --output table

# Configure an AWS Budget alert to trigger if monthly spend exceeds $50
# This is your "Circuit Breaker" against runaway GPU instances
aws budgets create-budget --account-id $(aws sts get-caller-identity --query Account --output text) \
    --budget file://aws_config/budget_definition.json
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Audit `pipeline_commander.py` L378:** Open the file and verify the `compute_generation_cost` function. Ensure it accurately reflects the 2026 costs for NIM-hosted FLUX and Wan 2.2 models.
2. **Deploy the `batch_calculator.py`:** Paste the prompt from Section 4 into your agent and create the projection tool. 
3. **Configure AWS Billing Alerts:** Use the Terminal command in Section 5 to set a hard $50 threshold. This prevents a misconfigured loop or a zombie P4d instance from draining your account while you sleep.
4. **Spot Check:** Run `aws ec2 describe-spot-price-history` for your target region (e.g., `us-east-1` or `eu-west-1`). Identify the Availability Zone with the lowest current price.
5. **Simulate a Batch:** Execute `python src/ccp/tools/batch_calculator.py --beats 100`. Verify that the "Sovereignty Savings" exceed $80 compared to renting from RunPod or Replicate.

## ✅ VERIFY (30-50 words)

Run `python src/ccp/tools/batch_calculator.py --beats 10`. If the script outputs a "Sovereignty Savings Report" with a USD value, your economic tracking layer is live. Open your AWS Console and confirm the Budget Alert is status: `OK`.

## 🔗 BRIDGE (30-50 words)

Unit 2.15 concludes the Infrastructure Chapter. Now that we have mastered the physics and economics of sovereign GPU compute, Unit 3.1 begins the exploration of the **NLAH (Natural Language Agent Harness)**—where we move from building the engine to programming the intelligence that drives it.

<!-- FACT-CHECK: "AWS G6 Spot Pricing April 2026" → G6 (L4 GPU) instances are the 2026 standard for batch inference, replacing G5 in most performance-per-dollar metrics. Spot rates remain ~70-90% lower than On-Demand. -->
<!-- FACT-CHECK: "NVIDIA NIM FLUX.1 cost per image 2026" → Proprietary APIs charge ~$0.04-0.10. NIM self-hosting on G6 Spot brings this down to ~$0.002-0.005. -->
