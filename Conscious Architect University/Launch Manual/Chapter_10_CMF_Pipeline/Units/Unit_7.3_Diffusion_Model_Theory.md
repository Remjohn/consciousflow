# Unit 07.03: Diffusion Model Theory

## 🧠 THE SCIENCE (140-160 words)

**UNLEARN:** Text-to-image (T2I) generation is not "AI magic" that retrieves images from a database. It is a rigorous process of iterative denoising in a compressed mathematical space.

Think of it through the lens of thermodynamics and the reversal of entropy. Imagine a crystal vase shattered into billions of microscopic dust particles — this is pure Gaussian noise. Diffusion is the mathematical "blueprint" that allows the system to reverse time, guiding every particle back into its precise position until the vase is restored. However, in our system, the "blueprint" is the text embedding. We aren't just reversing entropy; we are organizing it according to the specific semantic constraints of the CCP coaching script.

By Chapter 7, you understand that the CMF is a video factory. Efficient diffusion is the prerequisite for speed. If we attempted this in pixel space, your VRAM would choke; by operating in latent space, we "decouple" the heavy lifting from the final render, allowing for the 16-state pipeline to run at scale without thermal throttling.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Diffusion models operate on three core pillars: **Latent Space**, **Noise Schedules**, and **Classifier-Free Guidance (CFG)**.

First, the Latent Space. Instead of processing raw 1024x1024 pixels (which is computationally expensive), a Variational Autoencoder (VAE) compresses the image into a "latent" representation — a dense mathematical shorthand. This is where the model works, removing noise from a 128x128 latent grid that represents the high-dimensional features of the final image.

Second, the Noise Schedule. Models like FLUX.2 (the 2026 standard) use Flow-Matching to transition from pure noise to a structured image. Older models used linear or cosine schedules to determine how much noise to remove at each step. In the CMF, we prioritize schedules that lock in the "Compositional Skeleton" early (steps 1–10). If the high-level layout is wrong by step 10, the CLIP quality gate will trigger a regeneration before we waste GPU cycles on fine textures.

Third, CFG Scale. This is the "intensity" of the prompt's influence. A CFG of 1.0 lets the model's internal statistical bias take over; a CFG of 7.0–12.0 forces the model to adhere strictly to your visual prompts. In the CMF, we use a dynamic CFG: high for structural steps to ensure prompt adherence, and lower for final refinement to maintain "organic" textures without the "burnt" look of over-guidance.

Finally, CLIP Scoring acts as our pipeline's "immune system." CLIP (Contrastive Language-Image Pre-training) converts both your text prompt and the generated image into high-dimensional vectors. If the cosine similarity between these vectors is below our 0.6 threshold, the CMF refuses to pass the asset to the I2V stage.

## 📂 OUR CODE (100-200 words)

The "immune system" of our CMF pipeline is contained within `cmf/apps/cmf-assembler/t2i_quality_gate.py`. This file ensures that every dollar spent on I2V (Image-to-Video) is backed by a high-fidelity keyframe.

```python
# t2i_quality_gate.py, line 49
# WHY: We use the ViT-L/14 model to encode both the 2026 Visual Prompt
# and the generated keyframe into the same shared embedding space.
def score_prompt_adherence(image_path: str, prompt_text: str, clip_model: Any = None) -> float:
    # ... logic extracts vectors ...
    # Step 80: The dot product of normalized features returns the cosine similarity.
    similarity = (image_features @ text_features.T).item()
    return max(0.0, min(1.0, similarity))

# t2i_quality_gate.py, line 245
# WHY: Prompt adherence is weighted at 40% because if the image doesn't
# match the script, color quality (20%) and artifacts (15%) are irrelevant.
def compute_composite_score(dimension_scores: dict[str, float], weights: dict[str, float]) -> float:
    total = 0.0
    for dim, weight in weights.items():
        score = dimension_scores.get(dim, 0.0)
        total += weight * score
    return round(total, 4)
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi or Claude Code:**
> Expand `cmf/apps/cmf-assembler/t2i_quality_gate.py` to integrate PSSL (Perceptual Style & Style Language) validation. 
> 
> 1. In `score_pssl_coherence`, implement a check against the `lab/Color Psychology/foundation_hues.json` file.
> 2. The function must extract the dominant hex color from the keyframe and verify it is within a 15% Delta-E distance of the PSSL `foundation_hue` parameter.
> 3. If the distance exceeds 15%, return a `pssl_score` of < 0.4, which will trigger a regeneration in the pipeline commander.
> 4. Ensure the `DEFAULT_GATE_CONFIG` remains the source of truth for weights.

## ⌨️ TERMINAL (50-100 words)

```bash
# Register the T2I quality gate thresholds for the current project
python -m cmf.apps.cmf_assembler.t2i_quality_gate --config-audit

# Run a test score on a generated keyframe
# This simulates the internal CMF call to verify prompt adherence
python -m cmf.apps.cmf_assembler.t2i_quality_gate \
  --image ./output/beat_01_kf.png \
  --prompt "A coach standing in a high-contrast shadow, cyan highlights, 4k" \
  --threshold 0.65

# Expected: Verdict APPROVED | Composite Score: 0.72
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `cmf/apps/cmf-assembler/t2i_quality_gate.py` and navigate to the `DEFAULT_GATE_CONFIG` at line 31.
2. Audit the `weights` dictionary: ensure `prompt_adherence` is set to `0.40`. This enforces the "VDP-Native" standard where the narrative beat is the primary driver of visual success.
3. Trace the `score_prompt_adherence` function at line 49. Observe how `torch.no_grad()` is used to prevent memory leaks during batch processing — a critical constraint for the CMF "Scheduled Batch" architecture.
4. Execute the terminal commands in Section 5 to verify your local CLIP installation is using the `cuda` device (GPU) for inference. If it defaults to `cpu`, your pipeline latency will increase by 10x.
5. Paste the Agent Prompt from Section 4 into your coding agent to bridge the quality gate with our PSSL color psychology library.

## ✅ VERIFY (30-50 words)

Explain the state of a 30-step diffusion process at step 15. Your answer should identify that the global composition and layout are "locked," while high-frequency textures (skin pores, fabric weaves) are still being synthesized.

`pytest cmf/apps/cmf-assembler/t2i_quality_gate.py` → all green.

## 🔗 BRIDGE (30-50 words)

Unit 7.3 has decoded the physics of the static image. In **Unit 7.4: I2V Physics — Motion & VRAM**, we take these validated keyframes and introduce the temporal dimension, mastering the motion bucket IDs that transform static prompt adherence into cinematic motion.

<!-- FACT-CHECK: "FLUX.2 Dev NIM container 2026" → Available on build.nvidia.com as flux-2-dev-nim, Apache 2.0 -->
<!-- FACT-CHECK: "OpenAI CLIP ViT-L/14 2026" → Still the industrial standard for semantic fidelity in quality gating; SigLIP-L/16 used for faster 2026 inference fallback -->
<!-- FACT-CHECK: "Wan 2.2 MoE 2026" → Apache 2.0, natively supported by Nvidia NIM for high-fidelity I2V -->
