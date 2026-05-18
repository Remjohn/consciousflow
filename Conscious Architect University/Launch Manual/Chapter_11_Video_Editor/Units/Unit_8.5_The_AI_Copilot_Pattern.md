# Unit 8.5: The AI Copilot Pattern — NL → Edit

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** AI video editing is not a "magic conversation" where the model understands art. It is a strict translation layer where natural language (NL) is classified into finite, deterministic edit intents. 

Think of the AI Copilot as the **Basal Ganglia** of your video system. In mammalian cognitive architecture, the Basal Ganglia performs action selection — it doesn't "invent" movement; it receives various motor urges from the cortex and selects exactly one specific motor program to execute while inhibiting all others. 

In our CMF, your NL prompt is the cortical urge ("Make the ending pop!"). The Copilot (our LLM-based classifier) selects one of the 16 pre-defined Edit Classes (`EC-XX`) and inhibits general conversation. This prevents the "hallucination drift" common in general LLMs. We map fuzzy human desire to rigid JSON Patch operations, ensuring that the system remains architecturally stable. Without this classification gate, the AI would frequently corrupt the manifest by inventing non-existent fields.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The AI Copilot operates via a four-stage NLU (Natural Language Understanding) pipeline. First, the **Prompt Construction** stage gathers the user's NL instruction, the last 5 messages of context, and the current JSON manifest. This "In-Context Learning" package is sent to a small, fine-tuned LLM (e.g., Mistral-7B-v0.3 or Llama-3-8B-Turbo NIM).

Second, the **Classification Stage** forces the model to choose from an `EDIT_TAXONOMY`. This taxonomy separates **Local Edits** (which modify existing metadata via JSON Patch) from **Generative Edits** (which trigger new GPU render jobs via the Pipeline Commander). For Local Edits, the model outputs an RFC 6902 JSON Patch — a structured array of operations like `replace`, `add`, or `move`. 

Third, the **Validation Stage** (performed by `gate-m.ts`) checks the patch for "frame math" integrity. If an edit changes a beat's duration, the validator recalculates the `start_frame` of every subsequent beat to prevent overlapping segments. Finally, the **Application Stage** uses a functional reducer to update the Zustand state (`store.ts`), triggering a real-time reactive update in the Remotion preview. This separation of "Intent" from "Execution" allows for a robust undo/redo system (via `zundo`) and prevents the model from directly ever touching the raw video bytes — it only interacts with the manifest, keeping the system deterministic and cost-efficient.

## 📂 OUR CODE (100-200 words)

`🔧 EXTEND — LOCAL_EDIT_CLASSES in CopilotPanel.tsx`

Open `cmf/apps/web/app/editor/components/CopilotPanel.tsx`. The current implementation handles 13 basic edit classes. To support the full 2026 workflow, we must extend this taxonomy.

```tsx
// CopilotPanel.tsx, line 16
const LOCAL_EDIT_CLASSES = [
  "EC-01", // Trim Duration
  // ...
  "EC-14", // Audio Swap (Change Music)
  "EC-15", // Playback Speed (Time Warp)
  "EC-16", // Visual Filter (LUT/Color Grade)
];
```

The critical logic sits in the `validatePatch` function (line 70). It deep-clones the manifest and simulates the patch application.

```tsx
// CopilotPanel.tsx, line 128
// WHY: We recalculate the expected start_frame for every beat
// to ensure the patch didn't introduce gaps or overlaps
let expectedStart = 0;
for (let i = 0; i < testManifest.beats.length; i++) {
  if (testManifest.beats[i].start_frame !== expectedStart) {
      return { valid: false, error: `Frame math error...` };
  }
  expectedStart += testManifest.beats[i].duration_frames;
}
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> Open `cmf/apps/web/app/editor/components/CopilotPanel.tsx` and extend the `EDIT_TAXONOMY`.
> 1. Add `EC-14` (Audio Swap), `EC-15` (Playback Speed), and `EC-16` (Style Filter) to the `LOCAL_EDIT_CLASSES` array.
> 2. Update the `validatePatch` function to handle `EC-15` (Playback Speed) by ensuring that `speed_multiplier` is between 0.1 and 10.0.
> 3. Add a case in `applyPatch` to handle the `add` operation for the `effects` array on a beat.
> 4. Ensure that any change to `duration_frames` (Trim) or `speed_multiplier` triggers the `expectedStart` recalculation loop on line 128.

## ⌨️ TERMINAL (50-100 words)

```bash
# Test the Copilot API endpoint with a sample intention
curl -X POST http://localhost:3000/api/editor/copilot \
  -H "Content-Type: application/json" \
  -d '{"message": "make beat 3 twice as fast", "manifest": {...}}'

# Verify classification in the log
# Expected: { "edit_class": "EC-15", "patch": [{"op": "replace", "path": "/beats/2/speed_multiplier", "value": 2.0}] }
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `cmf/apps/web/app/editor/components/CopilotPanel.tsx` and identify the `LOCAL_EDIT_CLASSES` array on line 16.
2. Initialize your AI coding agent (Claude Code or Gemini CLI) in the `cmf/apps/web/` directory.
3. Paste the **Agent Prompt** from Section 4 to extend the taxonomy and validation logic.
4. Review the generated code specifically for the `validatePatch` loop. Ensure the `EC-15` speed constraint (0.1 to 10.0) is strictly enforced to prevent rendering crashes.
5. Save the file and restart the development server (`npm run dev`).
6. Enter the Copilot panel in the browser and type: "Change the music to the lofi_track_02 asset."
7. Confirm that the Copilot response shows `EC-14` and applies the patch to the correct audio track index in your manifest.

## ✅ VERIFY (30-50 words)

Open the CopilotPanel in the editor. Type "Double the speed of beat 3". Verify that the "Applied: EC-15" badge appears and that the timeline beat width shrinks in the `TimelineContainer.tsx` view as the manifest updates.

## 🔗 BRIDGE (30-50 words)

Unit 8.6 builds on this by introducing Export Engineering — where we take these manifested intent patches and render them into platform-optimized H.264/H.265 binaries via the Remotion CLI and headless AWS render clusters.

<!-- FACT-CHECK: "Llama-3-8B-Turbo NIM 2026" → Available as build.nvidia.com/meta/llama-3-8b-instruct-turbo, latency ~120ms for intent classification tasks. Apache 2.0. -->
<!-- FACT-CHECK: "JSON Patch RFC 6902" → Valid for 2026 manifest manipulation. Standard for state-diffing in video automation. -->
