# Unit 7.8: Remotion — Declarative Video Manifests

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** Video editing does not require a GUI timeline, a playhead, or a mouse. In the CMF pipeline, a "video" is not a static binary file until the final millisecond of production; it is a live, declarative React component tree. 

Think of it like the Genetic Code: DNA is the ultimate declarative manifest. It doesn't contain the "muscle" or the "neuron" itself; it contains the instructions (the manifest) that, when expressed through the cellular machinery (the render engine), produce the protein-based "frame." Just as a single mutation in a DNA sequence can change an entire phenotype without requiring the reconstruction of the entire genome from scratch, our Remotion manifests allow us to "mutate" a single beat cluster while the rest of the timeline remains biochemically stable. This shift from imperative manual editing to declarative code-based composition is what allows the CMF to scale to thousands of unique videos.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

Remotion operates by abstracting video frames into the React DOM. Instead of a linear stream of pixels, we manage a state-driven hierarchy of `<Composition>`, `<Sequence>`, and `<Video>` components. This architecture permits "time-traveling" through the video using the `useCurrentFrame()` hook, which allows any UI component to know exactly where it is in the total duration.

The Remotion CLI (v4.x in 2026) is the "machinery" that executes these manifests. It spawns a headless browser environment, injects the manifest state, and captures the resulting frames. The pipeline doesn't just "hit record"; it orchestrates a massive parallelization of frame capture across VRAM-optimized containers.

Key constraints govern this process:
1. **Determinism:** Every frame must render identically given the same frame index and manifest state. We strictly forbid `Math.random()` or `Date.now()` within Remotion components, ensuring bit-perfect consistency between preview and final render.
2. **Layer Isolation:** Audio, visual, and caption layers are computed as separate sequences within the manifest. This decoupling allows the `timeline_generator.py` to update the background music without touching the frame-accuracy of the TTT voice layers.
3. **The Manifest (DEP-VID-002):** A strictly versioned JSON object representing the "truth" of the video. It includes FPS, resolution (preset-based), and an array of beats. Each beat contains a `start_frame`, `duration_frames`, and the resolved S3 URLs for the visual assets. If a beat lacks an I2V video URL, the orchestrator triggers the Ken Burns fallback sequence automatically.

## 📂 OUR CODE (182 words)

In our CMF assembler, the manifest assembly is a multi-stage process that ensures 100% frame-accuracy between the script and the output.

- `cmf/apps/cmf-assembler/beat_cluster_parser.py`, line 200:
  ```python
  # WHY: frames = ceil(duration_sec * fps). We always round UP to the 
  # nearest frame to prevent "micro-gaps" (black frames) between beats.
  duration_frames = ceil(duration_sec * fps)
  ```
- `cmf/apps/cmf-assembler/timeline_generator.py`, line 759:
  ```python
  # WHY: The manifest dictionary is the DEP-VID-002 source of truth.
  # It defines the composition template (arc-specific) and maps
  # resolved S3 URLs from the fingerprint tracker to specific frame ranges.
  manifest = {
      "manifest_id": manifest_id,
      "composition_template": f"cmf-{parsed_result.get('arc_type', 'default')}",
      "beats": resolved_beats,
      "audio": audio
  }
  ```
- `cmf/apps/cmf-assembler/render_orchestrator.py`, line 34:
  ```python
  # WHY: 3-tier quality presets (preview/review/final) allow us to 
  # optimize GPU cost. We render 540p for developer previews 
  # ($0.04/render) vs 1080p for final launch ($0.48/render).
  QUALITY_PRESETS = { ... }
  ```

## 🤖 AGENT PROMPT (115 words)

> **Prompt for Claude Code / Gemini CLI:**
> I need to audit the Remotion manifest generation logic in `cmf/apps/cmf-assembler/timeline_generator.py`. Analyze the `assemble_manifest` function starting at line 720. Verify that it correctly implements the DEP-VID-002 spec, specifically ensuring that:
> 1. The `ducking_curve` from the audio engine is correctly mapped to the `audio` object.
> 2. The `composition_template` is dynamically assigned based on the `arc_type`.
> 3. The `resolved_beats` array preserves the frame-accurate start/duration timings computed by the `beat_cluster_parser.py`.
> 4. If any beat has `asset_status == "ASSET_MISSING"`, the status is set to `ASSEMBLED_WITH_GAPS`.
> Provide a summary of any logic drift and a suggested fix for the `manifest_id` generation pattern if it doesn't match `MAN-VID-YYYYMMDD-NNN`.

## ⌨️ TERMINAL (85 words)

```bash
# Preview the manifest structure in the terminal
cat cmf/apps/cmf-assembler/receipt_MANIFEST_ASSEMBLY_*.json | jq '.output_payload.beats[0]'

# Execute a preview render via Remotion CLI (2026 Syntax)
# This assumes the manifest.json is exported to the remotion folder
npx remotion render src/index.tsx CMF_Preview out/preview.mp4 \
    --props=manifest.json \
    --codec=h264 \
    --scale=0.5 # Render at 50% scale for speed

# Expected: [Remotion] Rendered frame 240/240 (100%)
# Expected: [Remotion] Video saved to out/preview.mp4
```

## ✅ IMPLEMENTATION STEPS (164 words)

1. Open `cmf/apps/cmf-assembler/beat_cluster_parser.py`. Trace the `compute_frame_timings` function (line 185) to ensure you understand how durations transition into absolute frame indices.
2. Open `timeline_generator.py` and locate `resolve_asset_urls` (line 630). Verify that the S3 sanitization logic correctly filters out non-HTTPS URLs before they hit the manifest.
3. Run the "Agent Prompt" from Section 4 in your coding environment to identify if the current manifest assembly logic has drifted from the 2026 tech spec.
4. If drift is found, apply the suggested fixes to `timeline_generator.py` to ensure the `ducking_curve` validation matches the total frame count.
5. Create a test manifest by running a dummy pipeline pass and verify the output JSON in the `receipts/` directory.
6. Open the manifest JSON and manually verify that `beat_index: 0` starts at `start_frame: 0` and that subsequent beats are contiguous (no frame overlapping or gaps).

## ✅ VERIFY (44 words)

Run the following command to check the manifest's structural integrity:
`cat receipts/MANIFEST_ASSEMBLY_*.json | jq '.output_payload.status'`
→ **Expected:** `"ASSEMBLED"` (or `"ASSEMBLED_WITH_GAPS"`)
Also, verify that the `total_frames` value equals the sum of all `duration_frames` in the `beats` array.

## 🔗 BRIDGE (38 words)

Unit 7.8 proved that video is code. Unit 7.9, **Caption Typography — Karaoke Sync**, builds on this by leveraging the frame-accurate timestamps we just generated to anchor dynamic, high-engagement text layers directly onto the Remotion timeline.

<!-- FACT-CHECK: "Remotion 4.x CLI 2026" → Supports --codec, --scale, and --props for dynamic JSON injection. Default h264. Verified on remotion.dev. -->
<!-- FACT-CHECK: "Remotion Composition JSON 2026" → DEP-VID-002 standardizes beat-to-sequence mapping. -->
