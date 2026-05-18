# Unit 7.1: The Pipeline Commander — 16 States

## 🧠 THE SCIENCE

**UNLEARN:** The pipeline is not a linear script. If you treat it as a sequence of function calls, your system will crumble at the first T2I quality failure. In autonomous video production, the pipeline is a **Finite State Machine (FSM)**. 

Consider the neurobiology of the human brain during sleep. It transitions between Non-REM and REM states based on neurochemical thresholds—a biological FSM designed for memory consolidation. If a noise interrupts the cycle, the brain doesn’t restart its entire 8-hour process; it checkpoints the current state of consolidation and resumes from the most stable point. 

Our CMF Pipeline operates on this same principle of **Stateful Survivability**. The "Pipeline Commander" ensures that if state 9 (Generating Captions) fails, the system doesn't re-bill you for the GPU time spent on states 1 through 8. It halts, checkpoints, and picks up exactly where it left off, protecting both your cost-per-minute and your architectural sanity.

## 🧠 TECHNICAL KNOWLEDGE

The Pipeline Commander (FR-VID-09) is the structural kernel of the CMF. It orchestrates 16 distinct states that define the lifecycle of a video shot, from a raw beat cluster to a published asset. This architecture is defined by **Strict Adjacency**—no state can transition to another unless it is explicitly permitted in the `VALID_TRANSITIONS` map. This prevents "state drift," where a system might attempt to render a final video before the quality gates have validated the source imagery.

There are three primary archetypes of states in our 16-state model:
1. **Parallel Execution States**: `GENERATING_T2I` and `PROCESSING_AUDIO` run simultaneously to maximize GPU utilization and reduce wait times. The Commander uses non-blocking logic to ensure both tracks complete before moving to the next gate.
2. **Deterministic Quality Gates**: `QUALITY_GATE` and `READY_FOR_REVIEW` act as "immune system" nodes. They are the only states allowed to trigger the `REGENERATING` or `FAILED` paths if specific threshold metrics (like CLIP scores or human rejection) are met.
3. **Immutable Checkpoints**: On every successful transition, the Commander serializes the entire project manifest—including SHA-256 fingerprints of every asset—to a persistent JSON store. This is the **Checkpoint/Resume** protocol. If the worker node vanishes mid-render, the next available node reads the checkpoint and restores the exact state history, total cost tracking, and beat approvals without data loss. 

## 📂 OUR CODE

Reference the state machine definition in `cmf/apps/cmf-assembler/pipeline_commander.py`.

```python
# pipeline_commander.py, line 58
# WHY: This map is the constitutional law of the pipeline.
# It enforces that the pipeline cannot skip Quality Gates (state 40)
# to ensure every frame is CLIP-validated before I2V motion synthesis.
VALID_TRANSITIONS: dict[str, set[str]] = {
    "PENDING": {"GENERATING_T2I", "PROCESSING_AUDIO", "FAILED"},
    "GENERATING_T2I": {"QUALITY_GATE", "FAILED"},
    # ...
    "QUALITY_GATE": {"GENERATING_T2I", "GENERATING_I2V", "FAILED"},
}

# pipeline_commander.py, line 406
# WHY: Periodic serialization ensures that even in a 'spot instance'
# termination event, the state of the 45-minute render is preserved.
def serialize_checkpoint(state: dict, checkpoint_dir: str) -> str:
    # Logic to dump the current 16-state context to disk
```

## 🤖 AGENT PROMPT

> **Prompt for Gemini CLI:**
> Review the 16 states in `cmf/apps/cmf-assembler/pipeline_commander.py` and identify the transition logic from `READY_FOR_REVIEW` to `REGENERATING`. Generate a test script `check_commander.py` that initializes a pipeline in the `PENDING` state and attempts an illegal transition directly to `RENDERING_FINAL`. The test should assert that `validate_transition` returns `False` for this jump.

## ⌨️ TERMINAL

```bash
# Initialize a mock pipeline state for verification
python3 -c "import cmf.apps.cmf_assembler.pipeline_commander as pc; state = pc.run_pipeline_init('cluster_001', 'proj_01', 5); print(state['state']['current_state'])"
# Expected: PENDING

# Verify the 16 states are correctly defined within the codebase
grep -A 20 "PIPELINE_STATES =" cmf/apps/cmf-assembler/pipeline_commander.py
```

## ✅ IMPLEMENTATION STEPS

1. Open `cmf/apps/cmf-assembler/pipeline_commander.py` and navigate to line 35 to identify the 16 `PIPELINE_STATES`.
2. Trace the `VALID_TRANSITIONS` map on line 58. Identify the specific states that can transition to `FAILED`. Note that almost every operational state has a `FAILED` escape hatch.
3. Locate the `transition_state` function (line 197). Annotate how it mutates the `state_history` list to create a linear audit trail of every transition.
4. Read the `serialize_checkpoint` function (line 406). This is the logic that protects your batch jobs from infrastructure failure.
5. Identify the constant `AUTO_APPROVE_THRESHOLD = 0.8` on line 88. This is where the Commander decides whether a human needs to intervene based on the automated quality gate score.

## ✅ VERIFY

Open `pipeline_commander.py`. Can you identify the three states that are allowed to trigger the `FAILED` state? **Binary Check:** Yes/No. The audit trail in `state_history` must show the `entered_at` timestamp for every transition.

## 🔗 BRIDGE

Unit 7.2 builds on this by deep-diving into **Audio Physics — Whisper + Demucs**. Now that the Commander has authorized the `PROCESSING_AUDIO` state, we must engineer the engine that actually isolates the coach's voice from the music bed.

<!-- FACT-CHECK: "FSM best practices for AI video 2026" → Shift to operational engineering confirmed. Quality gates (CLIP scoring) are the standard for 2026 pipelines. -->
<!-- FACT-CHECK: "Infinite state machine video production 2026" → Modular FSMs are preferred over linear DAGs for handling non-deterministic cost-intensive regenerations. -->
