# Unit 2.10: AWS GPU Tier Map

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "The biggest GPU is always the safest choice." Most junior architects believe that over-provisioning (renting a P5.48xlarge for a simple TTS task) is a valid insurance policy against failure. In sovereign infrastructure, this is a capital leak. Over-provisioning is not "safety"—it is an inefficient waste of the system's lifeblood (capital).

Think of the **Supply Hive** in entomology. An ant colony survives through extreme specialization. They do not send a Heavy Soldier to forage for seeds; they send a light-weight worker. The Soldier remains in the barracks, consuming minimal resources until a predator appears. If the hive sent Soldiers for every foraging run, it would exhaust its food stores before winter.

The CCP Architect must operate like the Hive Queen: matching the precise metabolic cost of the hardware to the specific energy requirement of the task. We distinguish between "Light Foraging" (TTS/STT) and "Heavy Combat" (I2V/SVD). Mastering this tier map is what allows us to run a $21,600/month pipeline for under $100.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The AWS GPU catalog is divided into two primary families for our 2026 stack: the **G-Series** (Graphics/Inference) and the **P-Series** (Performance/Training). 

1.  **The G-Series (Inference Tier)**: 
    *   **G5 (NVIDIA A10G, 24GB)**: The "Workhorse" for T2I. Ideal for FLUX.1-dev and high-fidelity image generation.
    *   **G6 (NVIDIA L4, 24GB)**: Optimized for energy efficiency and TTS/STT workloads. It has a lower TFLOPS count than G5 but is significantly cheaper for audio processing.
    *   **G6e (NVIDIA L40S, 48GB)**: The "Sweet Spot" for I2V. 48GB of VRAM allows for high-res video synthesis without the extreme costs of the P-series.
2.  **The P-Series (Heavyweight Tier)**:
    *   **P4d (NVIDIA A100, 40GB/80GB)**: Necessary for deep LoRA training or high-context video batches where bandwidth (HBM3) is the primary requirement.
    *   **P5 (NVIDIA H100/H200, 80GB)**: State-of-the-art for 2026. Only utilized in the CCP for large-scale cluster parallelization of the 76-agent cognitive matrix.
3.  **Financial Architecture**: 
    *   **Spot Instances**: We utilize Spot for 90% of our batch runs. Since our CMF is checkpoint-native (TD3), an interruption is handled by simply resuming from the last beat receipt. 
    *   **Capacity Blocks**: For 2026, we reserve GPU windows in advance for major "Broadcast Cycles" to ensure availability when Spot capacity is tight.

Selecting the wrong tier results in a "32x Cost Explosion"—the difference between a $1.01/hr Spot G5 and a $32.77/hr On-Demand P4d.

## 📂 OUR CODE (100-200 words)

The `pipeline_commander.py` abstracts these costs into a deterministic model. It does not calculate live AWS billing; it calculates the *expected metabolic cost* of the operation to ensure the batch remains within the client's budget.

**File:** `cmf/apps/cmf-assembler/pipeline_commander.py`
```python
# pipeline_commander.py, line 84
# WHY: These unit costs reflect the 'G5-Spot' pricing model.
# If the architect switches to P5-OnDemand, these constants 
# must be updated to prevent the pipeline from lying.
COST_T2I_PER_KEYFRAME = 0.02
COST_I2V_PER_CLIP = 0.06

# pipeline_commander.py, line 378
def compute_generation_cost(beat_count: int, regeneration_count: int = 0) -> float:
    # Recalculates total usd based on the tiers defined in the constants.
    base_cost = beat_count * (COST_T2I_PER_KEYFRAME + COST_I2V_PER_CLIP)
    ...
```
The commander tracks this cost at `total_generation_cost_usd` (Line 188). Before the CCP allows a final render, it validates that the metabolic spend hasn't exceeded the the contract ceiling.

## ⌨️ TERMINAL (50-100 words)

```bash
# Query AWS for available GPU instances and their VRAM (MiB)
aws ec2 describe-instance-types \
  --filters "Name=gpu-info.gpu-count,Values=1" \
  --query "InstanceTypes[].[InstanceType, GpuInfo.Gpus[0].Name, GpuInfo.Gpus[0].MemoryInfo.SizeInMiB]" \
  --output table

# Expected:
# ----------------------------------------
# |  g5.xlarge  |  A10G   |  24576       |
# |  g6e.xlarge |  L40S   |  49152       |
# |  p4d.24xl. |  A100   |  40960       |
# ----------------------------------------
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

Follow these steps to map your CMF tasks to the 2026 AWS Tier Map:

1.  Run the terminal command above to verify which instances are available in your AWS Region (e.g., `us-east-1` has higher Spot availability than `af-south-1`).
2.  Create your "CMF Metabolic Table" in your project notes:
    *   **TTS (Voice DNA)** → G6 (L4)
    *   **STT (Whisper)** → G6 (L4)
    *   **T2I (FLUX.1)** → G5 (A10G)
    *   **I2V (Wan 2.2)** → G6e (L40S) or P4d (A100)
3.  Open `pipeline_commander.py` and verify the `COST_*` constants at Line 84. Ensure they match your current AWS region's Spot pricing.
4.  Visit the **AWS Spot Instance Advisor**. Check the "Frequency of Interruption" for G5 and G6e instances. Note that if it is >20%, you must ensure your `checkpoint_path` logic (Line 190) is robust.
5.  Audit the `i2v_client.py` Line 229 once more. Confirm that the `verify_proxy_plus` check is effectively a check for G6e or P4d instance capability (48GB+).

## ✅ VERIFY (30-50 words)

Which EC2 instance type provides exactly 48GB of VRAM and represents the "Sweet Spot" for our Wan 2.2 I2V tasks? **Answer: G6e.** If you can identify this instance in your `aws ec2 describe-instance-types` output, your tier map is live.

## 🔗 BRIDGE (30-50 words)

Now that we have matched our tasks to the correct hardware tiers, we must address the "Cold Start" reality. Unit 2.11 introduces **Cold Start Physics & Scheduled Pre-Warm**, where we learn how to trigger these instances to spin up exactly 5 minutes before a batch, ensuring they are warm and ready for inference without idling on the clock.

<!-- FACT-CHECK: "AWS G6e instances" → NVIDIA L40S GPUs (48GB GDDR6) confirmed available in April 2026. -->
<!-- FACT-CHECK: "AWS G6 instances" → NVIDIA L4 GPUs confirmed as energy-efficient audio/inference choice. -->
<!-- FACT-CHECK: "Spot savings 2026" → Confirmed up to 90% for G-series, slightly lower (70-80%) for P-series due to demand. -->
