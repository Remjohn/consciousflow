# Unit 1.4: The CMF Architecture Deep-Dive

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Video is not rendered in a single pass. The belief that a video file is a monolithic entity created by one command is a fallacy that leads to brittle architecture. In a production-grade factory, a video is a composite outcome of three independent, asynchronous, and checkpoint-governed phases.

Think of the Conscious Movie Factory (CMF) like the biological process of **Protein Synthesis**. The transcript is your DNA. First, **Transcription** (Phase 1) occurs: the system extracts high-fidelity "mRNA" (the production script and visual premises). Next, **Translation** (Phase 2) takes place: the raw prompts are "translated" into individual amino acids (static images, audio stems, and motion clips via NVIDIA NIM or Suno). Finally, **Folding** (Phase 3) is the assembly: the 9 modules of the CMF assembler fold these disparate assets into a functional, 1080p cinematic structure. 

If your folding process (assembly) fails, you don't need to re-transcribe the entire DNA (Phase 1). You simply re-fold the existing components. This modularity is why the CMF is a factory, not just a script.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The CMF operates across 9 modules governed by a **16-state lifecycle machine** implemented in the `pipeline_commander.py`. The architecture follows a strict **Scheduled Batch Model**: unlike a real-time chatbot, the CMF is optimized for weekly content batches where 10-20 videos are generated, reviewed, and rendered in a single "shift" to maximize GPU efficiency.

Phase 3 (Automated Video Pipeline) is where the "folding" happens. It starts with the **Audio Engine (FR-VID-06)** and **T2I Generation (FR-VID-02)** running in parallel—a technical decision that saves ~15s per video. The system then passes through **Gate D** (T2I validation) into the **T2I Quality Gate (FR-VID-04)**, which uses CLIP-based scoring (~100ms per image) to decide if a keyframe passes or needs regeneration. 

If keyframes are approved, the **I2V Generation (FR-VID-03)** module invokes 48GB VRAM NVIDIA NIM containers to animate the stills. Every beat is then **Fingerprinted (FR-VID-05)** to enable surgical regeneration—if a client rejects the movement in Beat 3, the system only re-runs the I2V module for that specific beat, preserving the T2I keyframe and audio. The **Manifest Assembler (FR-VID-01)** then compiles these into a declarative Remotion JSON, which the **Caption Engine (FR-VID-07)** and **Remotion Renderer (FR-VID-08)** finally consume to output the 3-tier render levels (Preview 540p → Review 720p → Final 1080p).

## 📂 OUR CODE (100-200 words)

The orchestration logic lives in `cmf/apps/cmf-assembler/pipeline_commander.py`. open this file and locate the `PIPELINE_STATES` list around **line 35**.

Note the `VALID_TRANSITIONS` dictionary starting at **line 58**:
```python
# pipeline_commander.py, line 58
# WHY: This explicit state machine (TD1) replaces an event bus.
# It ensures that we NEVER attempt to aggregate a manifest
# (Gate E) before the audio engine (Gate I) has provided the
# exact timecodes needed for beat-sync.
VALID_TRANSITIONS: dict[str, set[str]] = {
    "PENDING": {"GENERATING_T2I", "PROCESSING_AUDIO", "FAILED"},
    "PROCESSING_AUDIO": {"AUDIO_COMPLETE", "FAILED"},
    "AUDIO_COMPLETE": {"ASSEMBLING_MANIFEST", "FAILED"},
    # ...
}
```

Also, review `cmf/apps/cmf-assembler/beat_cluster_parser.py`. This is where the **Beat Cluster JSON** is transformed into the **Remotion Manifest**. The parser enforces **Gate E** constraints around frame continuity and asset alignment, preventing "black frame" bugs before they reach the renderer.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi / Claude Code:**
> `Review the CMF pipeline states in D:/Work/The Conscious Coaching Factory/cmf/apps/cmf-assembler/pipeline_commander.py. Identify the specific lines in the transition logic that handle 'REGENERATING'. Create a markdown table showing the possible recovery paths for a FAILED state based on the current implementation of the State Machine. If no recovery paths exist for 'FAILED', suggest a code modification to line 75 that would allow a 'FAILED' state to transition back to 'PENDING' for a retry.`

## ⌨️ TERMINAL (50-100 words)

```bash
# List the available CMF assembler modules and their tech specs
ls cmf/apps/cmf-assembler/ | grep .py
# Expected: audio_engine.py, pipeline_commander.py, render_orchestrator.py...

# Run the unit tests for the Pipeline Commander to verify the 16 states
pytest cmf/apps/cmf-assembler/tests/test_pipeline_commander.py
# Expected: 87 passed in 4.2s (FR-VID-09 Coverage)

# Check the manifest assembly logic
pytest cmf/apps/cmf-assembler/tests/test_beat_cluster_parser.py
# Expected: 60 passed (Gate E Coverage)
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Trace the Narrative (Phase 1):** Trace how a project starts with `/cmf-diagnose` (Arc logic) and ends with `final_script.json`.
2. **Audit Asset Generation (Phase 2):** Open `SCENES_BATCH.json` and see how it maps authorized prompts to T2I and I2V generation scripts.
3. **Trace the Assembler (Phase 3):**
   - Open `pipeline_commander.py`.
   - Start at the `PENDING` state and trace the parallel split into `GENERATING_T2I` and `PROCESSING_AUDIO`.
   - Identify the "Point of No Return": The transition from `READY_FOR_REVIEW` to `RENDERING_FINAL`.
4. **Identify the Gates:** Map the 6 constraint gates (D, E, F, I, K, L) to their respective modules in `cmf/apps/cmf-assembler/gates/`.
5. **Analyze the Batch Schedule:** Read the `PRD.md` section on **Scheduled Batching** to understand why CMF operates on a weekly clock rather than real-time.

## ✅ VERIFY (30-50 words)

Can you name all 3 phases of the CMF pipeline, identify the "Point of No Return" in the state machine, and list the resolution/tier map for the 3-tier render system (Preview/Review/Final)? → Yes/No.

## 🔗 BRIDGE (30-50 words)

Unit 1.5 builds on this by introducing **The Infrastructure Map**—moving from the logical "folding" of codes to the physical "foundations" of AWS compute, Nvidia GPUs, and sovereign databases where this code actually executes.

<!-- FACT-CHECK: "NVIDIA NIM models 2026" → FLUX.1 NIM available. LTX-Video and Wan 2.2 supported via community pipelines/ComfyUI. -->
<!-- FACT-CHECK: "Remotion 4.x stability 2026" → v4.0.443 stable, introduced 'Remotion Skills' in Jan 2026. -->
<!-- FACT-CHECK: "CLIP vs VLM 2026" → CLIP remains the 2026 baseline for coarse semantic filtering due to 100ms latency. -->
