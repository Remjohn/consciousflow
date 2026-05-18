# Unit 7.10: The Constraint Gate Network

## 🧠 THE SCIENCE (148 words)

**UNLEARN:** Never assume that "AI knows best" regarding output quality. If you let a diffusion model or an I2V engine decide what is "good enough" for your brand, you are outsourcing your visual sovereignty to a statistical average. The model has no concept of "quality" or "cost"—it only has a concept of "probability."

Think of the **Thalamus** in the human brain. It acts as the ultimate sensory gatekeeper, filtering approximately 99% of all incoming sensory data (visual, auditory, somatic) before it ever reaches the cerebral cortex for conscious processing. Without the Thalamus, your brain would be overwhelmed by the "noise" of every skin cell touching your clothes or every background hum in the room.

In the CMF, the **Constraint Gate Network** is our Thalamus. It rejects the "noise" of off-prompt generations and low-SNR audio BEFORE they reach the expensive "cortex" of final rendering ($0.96/video). We enforce quality at the source to protect the pipeline's integrity.

## 🧠 TECHNICAL KNOWLEDGE (234 words)

The CMF architecture utilizes a multi-layered validation system known as "Quality at Source." Every transition between pipeline stages is guarded by a specific **Gate** that answers binary validation questions. If a gate returns `False`, the pipeline halts or triggers a surgical regeneration, preventing the "cascading failure" effect where a bad keyframe ruins a 16-second I2V render.

We categorize these into six primary gate archetypes:
1.  **T2I Quality Gate:** Uses **CLIP (Contrastive Language-Image Pre-training)** cosine similarity scoring. We project the visual prompt text and the generated image into a shared latent space and measure the vector angle. A score below 0.6 indicates "semantic drift."
2.  **I2V Motion Gate:** Validates motion bucket IDs and camera motion presets against the narrative arc stage. A "Climax" beat must not have "Gentle Drift" motion.
3.  **Audio SNR Gate:** Estimates the Signal-to-Noise Ratio using RMS noise floor analysis. If the voiceover is too noisy (SNR < 20dB), the pipeline automatically triggers **Demucs** source separation.
4.  **Caption Legibility Gate:** Enforces WCAG AA contrast ratios (4.5:1) between text/shadow and validates reading speed (minimum 100ms per word).
5.  **Timeline Continuity Gate:** Ensures the frame count of individual beats matches the total manifest duration to prevent black-frame flickers.
6.  **Cost Budget Gate:** Monitors the cumulative GPU spend per project, halting at the $5.00 ceiling to prevent infinite regeneration loops.

## 📂 OUR CODE (182 words)

In our codebase, the gates are isolated into the `gates/` directory and specialized scoring modules to keep the `pipeline_commander.py` clean.

*   `cmf/apps/cmf-assembler/t2i_quality_gate.py`: This is the heavy lifter. It implements the weighted scoring system (Prompt Adherence: 40%, Composition: 20%, PSSL: 25%, Artifacts: 15%).
    ```python
    # t2i_quality_gate.py, line 49
    # WHY: CLIP cosine similarity is our primary metric for 
    # ensuring the AI didn't "hallucinate" a different scene.
    similarity = (image_features @ text_features.T).item()
    ```
*   `cmf/apps/cmf-assembler/gates/gate_f.py`: Validates motion feasibility.
    ```python
    # gate_f.py, line 68
    # WHY: The motion IS the emotion. We reject camera moves
    # that undermine the narrative arc's current stage.
    if camera_motion in invalid_motions:
        return (False, f"Beat {beat_idx}: motion contradicts arc stage")
    ```
*   `cmf/apps/cmf-assembler/audio_engine.py`: Defines the SNR threshold.
    ```python
    # audio_engine.py, line 33
    # WHY: 20dB is the professional threshold for clean speech.
    # Below this, we force AI-based source separation.
    SNR_THRESHOLD_DB = 20.0
    ```

## 🤖 AGENT PROMPT (124 words)

> **Prompt for Claude Code / Gemini CLI:**
> "I need to add a new 'Gaze Vector' validation to the T2I Quality Gate. Open `cmf/apps/cmf-assembler/t2i_quality_gate.py` and implement `score_gaze_direction(image_path)`. This function should use the verified open-source `nvidia/nvclip` NIM container to ensure the character's eyes are focused on the camera (0.8 score) or in the direction of the specified 'Gaze' PSSL parameter. After implementation, update `DEFAULT_GATE_CONFIG` to include `gaze_direction` in the weights, redistributing 5% from `composition_quality`. Then, add a corresponding test case in `cmf/apps/cmf-assembler/tests/test_quality_gate.py` that mocks a 'sideways glance' failing the gate."

## ⌨️ TERMINAL (74 words)

```bash
# Run the entire gate validation test suite
pytest cmf/apps/cmf-assembler/tests/test_gate_*.py

# Force a T2I Quality Gate check on a specific image
# This allows you to calibrate thresholds before a large batch
python -m cmf.apps.cmf-assembler.t2i_quality_gate --image ./temp/beat_01.png --prompt "A coach in a dark studio"

# Expected: Verdict: APPROVED (Score: 0.742)
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Audit Thresholds:** Open `t2i_quality_gate.py` and review `DEFAULT_GATE_CONFIG` on line 31. Verify the `threshold` is set to `0.6` for photorealistic projects. 
2. **Review Motion Constraints:** Open `gates/gate_f.py` and inspect `ARC_MOTION_VIOLATIONS` on line 60. Ensure the mapping between arc stages (climax, hook, resolution) and camera motions is correct for your brand.
3. **Validate SNR Logic:** Open `audio_engine.py` and trace `compute_snr_db` on line 91. Note how it uses `astats` to estimate the noise floor.
4. **Trigger a Failure:** Run a test with a deliberately mismatched prompt (e.g., prompt for a "Red car" while providing an image of a "Blue dog").
5. **Verify Receipt:** Verify that the gate failure is logged in the `receipt_chain` directory, preventing the I2V stage from ever starting.

## ✅ VERIFY (42 words)

Run `pytest cmf/apps/cmf-assembler/tests/test_quality_gate.py`. If all scoring dimensions (adherence, composition, pssl, artifacts) return green, the gate network is calibrated and protecting your GPU budget.

## 🔗 BRIDGE (39 words)

You have mastered the Video Factory. Now it's time to build the interface where you will operate it. Unit 8.1 introduces the **CMF Video Editor Architecture**—the Next.js dashboard where these gate results come to life.

<!-- FACT-CHECK: "NV-CLIP NIM container 2026" → Available on build.nvidia.com as nv-clip-nim, optimized via TensorRT/Triton. -->
<!-- FACT-CHECK: "Whisper large-v3-turbo" → whisper-large-v3-turbo on HuggingFace, 8x faster than large-v3, MIT license. -->
<!-- FACT-CHECK: "Demucs SNR 20dB" → Industry standard for source separation triggers in automated pipelines. -->
