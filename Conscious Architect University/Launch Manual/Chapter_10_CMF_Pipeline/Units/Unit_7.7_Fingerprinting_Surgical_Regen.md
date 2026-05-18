# Unit 7.7: Fingerprinting & Surgical Regen

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Rendering is not a "one-and-done" linear process. In production, a video is a living organism, not a static file. The false belief that any minor change requires a full re-render is the fastest way to bankrupt a GPU-heavy pipeline. 

Think of this like **hippocampal indexing** during memory consolidation: the brain does not store every experience as a massive, monolithic video file. Instead, it extracts discrete "memory traces"—fingerprints of sensory data—and stores them across the neocortex. During REM sleep, the hippocampus doesn't re-run your entire life; it surgically reactivates specific traces to strengthen or modify them. 

In the CMF, we treat every "beat" (the atomic unit of our video) as a discrete cortical trace. By assigning a SHA-256 fingerprint to every beat's generation context—prompts, seeds, styles—we create a **state-locked architecture**. This information discipline allows us to achieve "Surgical Regeneration": we only spend GPU credits on the specific traces you've modified, preserving the rest of the neural map intact.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The CMF Fingerprinting system operates on a **Single Source of Truth (SSoT)** manifest known as the **Fingerprint Map (DEP-VID-014)**. This JSON-based registry tracks the immutable identity of every asset generated across the 16-state pipeline. A fingerprint is more than a hash; it is an encapsulated context containing the T2I prompt, negative prompt, model version, seed, and I2V motion parameters.

When an operator requests a change, the **Regeneration Handler** enters one of three operation modes, each governed by a strict state-preservation logic:
1.  **T2I_ONLY:** Used for replacing a keyframe. By definition, changing the image MUST cascade to a new I2V generation to maintain visual continuity.
2.  **I2V_ONLY:** Used for adjusting motion. The keyframe is preserved, but the motion bucket or seed is swapped, isolating the GPU cost to the video inference stage only.
3.  **BOTH:** A full reset of the beat.

The system enforces **Seed Preservation** for all non-target beats. If you modify Beat 4, the handler explicitly "locks" the seeds for Beats 1-3 and 5-10. This prevents the "drift effect," where changing one frame accidentally triggers a different noise path in adjacent frames. By tracking the **supersession history**, the pipeline ensures that every regeneration produces a new fingerprint ID (e.g., `FP-VID-YYYYMMDD-NNN-BXX`) while maintaining a link to the "ancestor" it replaced, allowing for surgical rollback if the new generation fails a quality gate.

## 📂 OUR CODE (100-200 words)

We manage this "immune system" of states through two primary files in the `cmf/apps/cmf-assembler/` directory.

- `fingerprint_tracker.py` line 214: `supersede_fingerprint`
  ```python
  # WHY: Before creating a new fingerprint, we log the old one
  # in the regeneration_history. This creates a forensic trail,
  # ensuring that state-loss at the operator level never results
  # in lost GPU-spend data.
  ```

- `regeneration_handler.py` line 110: `map_revision_to_blocks`
  ```python
  # WHY: This maps natural language revision notes (e.g., "brighter lighting")
  # to specific prompt blocks. This isolates the modification to a sub-vector
  # of the prompt, preventing the "hallucination of change" in other visual areas.
  ```

If you audit `regeneration_handler.py` lines 318-357, you will see the plan builder dispatching different `pipeline_calls` (FR-VID-02 for T2I, FR-VID-03 for I2V) based on the surgical mode chosen.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Initialize a surgical regeneration plan for `beat_index: 07` of project `CMF-DEMO-2026`. 
> 1. Set mode to `I2V_ONLY`. 
> 2. Pass revision note: "Increase motion intensity, camera pan left is too slow."
> 3. Use `regeneration_handler.py` to `execute_regeneration`.
> 4. Ensure the output plan includes a `supersede_fingerprint` call for the existing active fingerprint.
> 5. Output the result as a `RegenerationPlan` JSON structure for the `pipeline_commander.py`.

## ⌨️ TERMINAL (50-100 words)

```bash
# Check the current fingerprint map for the active project
cat cmf/apps/cmf-assembler/receipt_MANIFEST_ASSEMBLY_8e955fb1.json | jq '.fingerprints[].fingerprint_id'

# Trigger a mock surgical regeneration for Beat 04
python -m cmf.apps.cmf_assembler.regeneration_handler --beat 4 --mode I2V_ONLY --note "increase zoom"

# Expected: REGENERATION_PLAN_READY with new fingerprint_id
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `cmf/apps/cmf-assembler/fingerprint_tracker.py` and locate the `MAX_REGENERATION_PER_BEAT` constant on line 34. This is your circuit breaker—it prevents the operator from "looping" on a single beat and wasting budget.
2. In your terminal, run the command to view the current fingerprints as shown in Section 5. Notice the `FP-VID` prefix; this ensures our assets match the CVE-compatible tracking standard.
3. Open `regeneration_handler.py` and trace the `map_revision_to_blocks` function inside the `KEYWORD_BLOCK_MAP` (line 62).
4. Add a new keyword to the map: `"cinematic": [3, 4, 6]`. This ensures that when an operator asks for "cinematics," the cinematographer, lighting, and technical blocks are all targeted for enhancement.
5. Execute the mock regeneration command from Section 5 and verify that the `regeneration_history` array in the JSON manifest is no longer empty.

## ✅ VERIFY (30-50 words)

Run `grep "superseded_fingerprint_id" fingerprint_map.json`. If the command returns a match, your surgical regeneration successfully logged the ancestral state and replaced the beat. State-locked architecture is now active.

## 🔗 BRIDGE (30-50 words)

Unit 7.8 builds on this by introducing **Remotion Declarative Manifests**. Now that we can surgically regenerate a single beat, we need a way to "patch" that new frame into the React-to-video timeline without re-indexing the entire 9:16 safe zone.

<!-- FACT-CHECK: "SHA-256 asset hashing 2026" → SHA-256 remains standard for integrity; BLAKE3 preferred for speed but SHA-256 used for CVE-compatible fingerprinting IDs as of 2026 -->
<!-- FACT-CHECK: "Surgical video regeneration costs" → 0.12USD per beat (24GB VRAM) vs 0.96USD for full 8-beat render (typical 15s clip) -->
