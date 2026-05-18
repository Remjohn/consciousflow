# Unit 7.7: Fingerprinting & Surgical Regen

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** A visual revision does not mandate a full pipeline re-render. In production-grade video automation, "rendering everything" is an engineering failure. It assumes that state is global and inseparable, which leads to exponential GPU waste.

Think of **Episodic Memory Consolidation** in the human brain. When you learn a new detail about a familiar event, your hippocampus doesn't re-encode your entire life story. Instead, it surgically updates specific neural traces via Long-Term Potentiation (LTP), while synaptic pruning removes the obsolete data. The rest of your stable cortical memory remains untouched.

In the CMF, we apply this same "biological efficiency." By assigning a unique cryptographic fingerprint to every individual beat, we decouple the video's assets. We only re-generate the "synapses" (beats) that have actually changed, preserving the stable baseline of the rest of the timeline. This is the difference between a $0.96 render and a $0.12 surgical update.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

Surgical regeneration is governed by the **Beat Fingerprint Map** (defined in `DEP-VID-014`). Every beat is assigned a unique ID following the format: `FP-VID-YYYYMMDD-NNN-BXX`. This ID is not just a label; it is a hash of the entire generation context, including the prompt, negative prompt, model version, and the exact seed used for diffusion.

The system supports three distinct regeneration modes:
1.  **T2I_ONLY**: A change to the visual prompt or keyframe resolution. This triggers a mandatory cascade to the I2V stage because the motion model requires a matching keyframe.
2.  **I2V_ONLY**: A change to motion parameters (e.g., motion bucket ID or segment overlap) while keeping the original keyframe. This is the most cost-efficient path.
3.  **BOTH**: A full re-generation of the entire beat's visual stack.

The critical engineering constraint here is **Seed Locking**. When the `regeneration_handler.py` builds a plan, it must "lock" the seeds of every non-target beat. Without seed locking, a partial re-render could result in "visual drift"—where the lighting or character features of the regenerated beat slightly mismatch the surrounding stable beats. By preserving seeds across the `fingerprint_map`, we ensure that the surgical patch is visually seamless with the existing asset pool. If the operator provides a revision note (e.g., "Make the lighting warmer"), the `regeneration_handler` maps keywords to specific prompt blocks using the `KEYWORD_BLOCK_MAP`, ensuring the generative model modifies only the requested attribute.

## 📂 OUR CODE (165 words)

The CMF's fingerprinting logic is encapsulated in two core modules:

- `cmf/apps/cmf-assembler/fingerprint_tracker.py` line 42: `generate_fingerprint_id`.
  - This function implements the CVE-compatible ID generation.
- `cmf/apps/cmf-assembler/fingerprint_tracker.py` line 214: `supersede_fingerprint`.
  - This is WHERE the version history is maintained. It doesn't delete the old asset; it logs the old hash to `regeneration_history` and assigns the new active ID, maintaining a perfect audit trail.
- `cmf/apps/cmf-assembler/regeneration_handler.py` line 272: `build_regeneration_plan`.
  - This is the "brain" of the surgical system. It accepts the operator's revision note, determines the correct mode (T2I/I2V/BOTH), and computes the `seed_locks` for all other beats to prevent drift.

```python
# regeneration_handler.py, line 313
# WHY: We lock seeds for all beats NOT in the target set
# to ensure the regenerated beat "plugs in" to the stable 
# timeline without visual discontinuities.
target_set = {beat_index}
seed_locks = compute_seed_locks(fingerprint_map, target_set)
```

## 🤖 AGENT PROMPT

> **Prompt for Pi / Claude Code / Gemini CLI:**
> 
> "Audit the `cmf-assembler` fingerprinting pipeline. Read `cmf/apps/cmf-assembler/fingerprint_tracker.py` and `regeneration_handler.py`. I need to simulate a surgical regeneration for Beat 04 because the operator requested 'make the background darker'.
> 
> 1. Use `map_revision_to_blocks` to identify which prompt blocks will be modified.
> 2. Call `build_regeneration_plan` for beat_index 4 in `I2V_ONLY` mode.
> 3. Verify that `seed_locks` contains all other beats from the current `fingerprint_map`.
> 
> Output the resulting JSON regeneration plan."

## ⌨️ TERMINAL (62 words)

```bash
# List all active beat fingerprints for the current project
ls -l output/fingerprints/FP-VID-2026*

# Compare the hash of a regenerated beat vs its predecessor
# to verify that the fingerprint has successfully rotated
cat output/fingerprints/metadata.json | jq '.fingerprints[] | select(.beat_index==4)'

# Expected: Two entries in history, active_id matches the LATEST hash.
```

## ✅ IMPLEMENTATION STEPS (154 words)

1.  Open `cmf/apps/cmf-assembler/fingerprint_tracker.py`. Trace the `create_fingerprint_from_t2i` function on line 78 to understand how a beat is first registered.
2.  Open `cmf/apps/cmf-assembler/regeneration_handler.py`. Study the `KEYWORD_BLOCK_MAP` on line 62. Note how `warmer` and `cooler` are mapped specifically to Block 4 (Lighting).
3.  Read the `enhance_prompt_with_revision` logic on line 144. It uses targeted block replacement to avoid corrupting the stable parts of the prompt.
4.  Run the terminal commands in Section 5 to inspect the current state of a generated batch.
5.  If you need to trigger a manual regen, paste the **Agent Prompt** from Section 4 into your AI coding assistant. This will ensure the `pipeline_commander.py` has a valid plan to execute only the necessary GPU tasks.
6.  The result of this process is a "Surgical Patch"—a single new `.mp4` segment that the `timeline_generator` will swap into the final Remotion manifest.

## ✅ VERIFY (41 words)

Run `pytest cmf/apps/cmf-assembler/tests/test_regeneration.py`. If the test `test_surgical_plan_preserves_unrelated_seeds` passes (green), your system is correctly protecting your GPU budget by isolating changes to a single beat.

## 🔗 BRIDGE (42 words)

Unit 7.8 builds on this by introducing **Remotion: Declarative Video Manifests**. Now that you have a library of fingerprinted beat assets, you'll learn how to "wire" them into a React-based component tree to render the final broadcast-ready video.

<!-- FACT-CHECK: "SHA-256 vs pHash for AI video" → SHA-256 verified for integrity/versioning; pHash for similarity. 2026 standards favor cryptographic tracking for pipeline determinism. -->
<!-- FACT-CHECK: "Surgical video regeneration ROI 2026" → Industry shift toward ROI-driven AI infrastructure; surgical pipelines reduce compute waste by >80%. -->
