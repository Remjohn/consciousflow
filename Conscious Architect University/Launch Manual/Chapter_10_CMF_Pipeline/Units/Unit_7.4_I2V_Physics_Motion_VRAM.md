# Unit 07.04: I2V Physics — Motion & VRAM

## 🧠 THE SCIENCE (145 words)

**UNLEARN:** Motion in AI video is not a free byproduct of "better models." In 2026, motion remains the most computationally expensive primitive in the CMF pipeline.

Think of the human brain during REM sleep. The hippocampus doesn't just replay memories; it consolidates episodic traces—discrete 2D snapshots—into the neocortical long-term storage as continuous temporal narratives. If the "VRAM" of the hippocampal-neocortical loop is insufficient, the dream becomes fragmented, losing its temporal logic. This is **Latent Drift**.

In the CMF, Image-to-Video (I2V) is the act of forcing a static latent representation to evolve across a time dimension. We are not "animating" an image; we are predicting the next $N$ states of a probability field. This requires extreme memory bandwidth to maintain consistency. Without the **VRAM Cascade**, the system suffers from "temporal hallucinations"—where pixels lose their identity between frame 1 and frame 48.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

The physics of I2V are governed by the **VRAM-Time Constraint**. In the CMF architecture, we deploy a tiered execution model based on available GPU memory:

1.  **24GB Tier (RTX 4090/Wan-5B):** Optimized for 4-second "Micro-Beats." Perfect for rapid cuts but prone to coherence failure on complex human motion.
2.  **48GB Tier (RTX 6000 Ada/Wan-14B):** The CMF standard. Supports 8-second clips with high temporal stability. This is the **proxy-plus** target.
3.  **80GB Tier (H100/H200):** Reservoir for 16-second "Master Shots." Used only when the arc stage requires a slow, cinematic reveal.

To bridge these clips, we use **Segment Overlap Physics**. A 12-second beat cannot be generated in one pass on a 48GB card. Our pipeline generates two 7-second segments with a **6-frame overlap**. Within this overlap, the `timeline_generator.py` executes a cross-fade where the latent noise of Segment A is mathematically dissolved into Segment B, preventing the "jump-cut" jarring common in naive concatenations.

Motion is controlled via the **Motion Bucket ID** (or Motion Intensity parameter in Wan 2.2). This is a scalar value (0-255) that acts as a temperature setting for the model's optical flow calculation. A low bucket ID (1-40) produces subtle breathing or slow-pan movement; a high ID (180-255) forces aggressive action. If the motion intensity exceeds the model's capability, the CMF triggers a **Ken Burns Fallback**, shifting from generative motion to geometric scaling to preserve brand integrity.

## 📂 OUR CODE (185 words)

Open `cmf/apps/cmf-assembler/i2v_client.py` and observe the VRAM enforcement and segmentation logic:

```python
# i2v_client.py, line 89
# WHY: Implements Segment Overlap Physics. If a video beat is 12s, 
# it splits into segments with a 6-frame buffer for cross-fading.
def compute_segments(duration_sec, fps=24, max_frames=96, overlap_frames=6):
    ...
```

```python
# i2v_client.py, line 229
# WHY: Enforces the VRAM Tier. The CMF refuses to run I2V on 24GB
# if the project requires 48GB stability (proxy-plus).
async def verify_proxy_plus(config: RunningHubConfig):
    ...
```

```python
# i2v_client.py, line 499
# WHY: The Safety Valve. If I2V generation fails 3x, the system
# generates a Ken Burns pan/zoom to keep the production moving.
def build_ken_burns_fallback(keyframe_url, beat_index, duration_sec):
    ...
```

The `resolve_motion_preset` function (line 74) is where the **Arc Stage** (from Chapter 6) determines the motion intensity. "The Witness" arc stages typically resolve to low-motion bucket IDs to maintain a contemplative, high-status atmospheric feel.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Pi/Claude Code:**
> Execute a logic audit of `cmf/apps/cmf-assembler/i2v_client.py`. I need to ensure that the `SEGMENT_OVERLAP_FRAMES` (currently set at 6 at line 46) is correctly utilized in the `compute_segments` function. If the `total_frames` is exactly 1 frame over `max_frames`, verify that it doesn't create a legacy 1-frame segment that breaks the cross-fade. 
> 
> Furthermore, extend the `check_service_availability_with_retries` function (line 516) to log the specific `vram_tier_used` when a failure occurs, assisting in the **VRAM Cascade** debugging. Output only the modified functions.

## ⌨️ TERMINAL (85 words)

```bash
# Verify the RunningHub proxy-plus endpoint connectivity
curl -I http://localhost:8188/proxy-plus/prompt
# Expected: HTTP/1.1 200 OK (or 405 if POST only)

# Run the I2V client segment test to verify overlap logic
python -m pytest tests/test_i2v_client.py -v -k "test_segment_overlap"
# Expected: PASSED [100%]

# Check current VRAM allocation for the running NIM container
nvidia-smi --query-gpu=memory.total,memory.used --format=csv
```

## ✅ IMPLEMENTATION STEPS (165 words)

1.  **Configure Proxy-Plus:** Open `config/runninghub_config.yaml` and ensure the `proxy_plus_url` points to your 48GB/80GB instance.
2.  **Audit the Overlap:** Run the terminal command for `test_segment_overlap`. Trace `i2v_client.py` line 137 to see how `current_start` uses `overlap_frames` to rewind the frame pointer for the next segment.
3.  **Validate Motion Presets:** Navigate to `cmf/apps/cmf-assembler/schemas/dep_vid_010_i2v_motion_preset_library.yaml`. Verify that "The Witness" arc presets have `motion_bucket_id` values between 10 and 60.
4.  **Test the Fallback:** In `i2v_client.py`, temporarily hardcode `consecutive_failures = 3` at line 537. Run a test render and verify that the output JSON contains `status: "KEN_BURNS_FALLBACK"`.
5.  **Review the Cascade:** Read `FR-VID-03 §7` in the tech docs to understand why we choose Ken Burns over a low-VRAM 24GB model (Hint: Consistency over complexity).

## ✅ VERIFY (45 words)

Run `pytest tests/test_i2v_client.py`. If all 12 tests pass, particularly the `test_vram_tier_enforcement`, your I2V client is correctly wired to respect the physics of your hardware stack. Binary Result: All Green / FAIL.

## 🔗 BRIDGE (40 words)

Unit 07.04 secured the motion. But motion needs a map. Unit 07.05 builds that map: **ComfyUI Architecture — Workflow JSON**. You will learn how to translate these motion intensity floats into the actual graph nodes that execute the diffusion.

<!-- FACT-CHECK: "Wan 2.2 VRAM requirements 2026" → Wan 2.2 14B requires 48GB VRAM for stable I2V, 5B runs on 20GB+ with GGUF. -->
<!-- FACT-CHECK: "Motion Intensity parameters 2026" → Modern I2V models use a 0-1 motion scale or 1-255 bucket IDs to modulate optical flow guidance. -->
