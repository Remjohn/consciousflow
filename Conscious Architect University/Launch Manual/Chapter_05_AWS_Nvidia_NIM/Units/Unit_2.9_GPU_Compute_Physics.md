# Unit 2.9: GPU Compute Physics

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** High-performance AI is not just about raw compute power or the number of CUDA cores on a spec sheet. Most engineers believe that doubling the "Teraflops" doubles the speed of their pipeline. In reality, modern generative AI is trapped by the **Memory Wall**—the fundamental physical limit of how fast data can move between the memory and the processor.

Think of the **Metabolic Limit of a Cheetah**. A cheetah can accelerate to 60 mph in seconds because it has explosive muscle fiber (the CUDA/Tensor cores). However, it can only sustain this sprint for a few hundred yards. Its speed is not limited by its muscles, but by its heart and lungs (memory bandwidth) and its ability to pump oxygenated blood (data) to those muscles. If the heart cannot keep up, the muscles starve and the sprint fails.

Our 2026 CMF-Assembler is a "High-Metabolism" system. For models like Wan 2.2 and FLUX.1—which require massive parameter transfers for every frame—the bottleneck is not the calculate step; it is the data-delivery step. This physics constraint governs why we enforce strict VRAM tiers.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

To architect a sovereign infrastructure, you must master the three variables of the **Inference VRAM Budget**: Model Weights (the static footprint), Activations (intermediate calculations), and the KV Cache (the "context memory"). 

1.  **CUDA vs. Tensor Cores**: CUDA cores are general-purpose processors for parallel math. Tensor Cores are specialized "matrix multiplication" accelerators—the mechanical heart of the Transformer. While Blackwell GPUs offer massive TFLOPS gains, they are often underutilized because the **Memory Bandwidth** (GB/s) cannot feed them fast enough. In 2026, the jump from Hopper (HMB3 at ~3.35 TB/s) to Blackwell (HBM3e at ~8 TB/s) is the most significant upgrade for the CCP, as it directly increases the "heart rate" of our inference pulse.
2.  **The 24GB VRAM Threshold**: 24GB is the "Golden Ratio" for 2026 production. It comfortably fits FLUX.1-dev weight-sets at FP16 or quantized Wan 2.2 passes. However, high-resolution I2V generation (1080p, 5-second clips) creates an **Activation Spike** that can exceed 32GB. 
3.  **The Bandwidth Bottleneck**: When a model’s memory requirement exceeds the physical VRAM (e.g., trying to run a 48GB Wan 2.2 pass on a 24GB G5 instance), the system must "offload" weights to the CPU via PCIe. This reduces data transfer speeds from ~1,000 GB/s to ~32 GB/s—an instant 30x performance collapse. This is why our pipeline strictly enforces the 48GB tier for video tasks.

## 📂 OUR CODE (100-200 words)

The `i2v_client.py` is the sentinel that enforces these physical constraints. It prevents our pipeline from entering the "CPU Offload" death-spiral by validating infrastructure capability before submitting jobs.

**File:** `cmf/apps/cmf-assembler/i2v_client.py`
```python
# i2v_client.py, line 229
async def verify_proxy_plus(config: RunningHubConfig) -> tuple[bool, str]:
    # WHY: AC2 Compliance. We verify the '/proxy-plus/' endpoint (48GB VRAM)
    # is live. We explicitly REPEL fallback to 24GB (line 247) because 
    # the physics of 1080p I2V generation on Wan 2.2 makes 24GB 
    # computationally unstable for full-bitrate motion.
    if "proxy-plus" not in config.proxy_plus_url:
        return (False, "I2V_VRAM_INSUFFICIENT: proxy-plus endpoint not configured.")
```
Historically, engineers tried to "squeeze" models into smaller GPUs using aggressive quantization. Section 229 is the architectural embodiment of the **Sovereignty Principle**: owning the compute means knowing when to refuse a task that violates the physics of the hardware to preserve the integrity of the output.

## ✅ IMPLEMENTATION STEPS (100-200 words)

Perform this VRAM Budgeting Audit to verify your infrastructure matches your model requirements:

1.  **Calculate the Weight Footprint:** For Wan 2.2 (14B parameters), calculate the VRAM needed for FP16 weights. 
    *   *Formula: Parameters (billions) × Bytes per parameter (2 for FP16).*
    *   *Result: 14 × 2 = 28GB (Weights only).*
2.  **Add Activation Overhead:** Factor in an additional 30% for 1080p video activations (the memory spikes created during frame synthesis).
    *   *Result: 28GB + 8.4GB = 36.4GB.*
3.  **Compare Tiers:** Map this 36.4GB requirement against the AWS GPU Tier Map (see Unit 2.10). An G5.xlarge (24GB A10G) will fail this task without severe quality degradation through offloading.
4.  **Audit `i2v_client.py`:** Open line 247. Observe the string: `DO NOT fall back to 24GB`. This is the hard-coded enforcement of the physical calculation you just performed.
5.  **Verify Bandwidth:** Look up the theoretical bandwidth for an NVIDIA A10G (G5 instance) vs. an H100 (P5 instance). Note the 1.0 TB/s vs. 3.3 TB/s difference.

## ✅ VERIFY (30-50 words)

Run the calculation in Step 1. What is the minimum VRAM required for a 14B parameter model at FP16 including 30% activation overhead? **Answer: 36.4GB.** Confirm that our 48GB VRAM requirement in `i2v_client.py` provides the necessary buffer for OS overhead and KV caching.

## 🔗 BRIDGE (30-50 words)

Now that we understand the internal physics of the GPU, we must map these requirements to the actual cloud catalog. Unit 2.10 introduces the **AWS GPU Tier Map**, where we select the specific EC2 instances that provide the VRAM and Bandwidth we just calculated.

<!-- FACT-CHECK: "HBM3e bandwidth vs HBM3" → Blackwell B200 (HBM3e) achieves ~8 TB/s, while Hopper H100 (HBM3) achieves ~3.35 TB/s. Verified April 2026. -->
<!-- FACT-CHECK: "Wan 2.2 VRAM requirements" → 14B model requires ~28GB for FP16 weights, plus significant overhead for video activations. Verified April 2026. -->
<!-- FACT-CHECK: "Memory Wall in 2026" → Confirmed as the primary scaling bottleneck for LLM and Video inference. -->
