# Unit 8.7: Inspector + Gate M — Pre-Edit Validation

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** Letting a user "edit whatever they want" is not freedom; it is a fast track to system entropy. In a declarative video pipeline, an edit is a mutation of a structured manifest. If you allow a mutation that references a non-existent asset or violates frame-accurate math, you aren't "fixing it in post"—you are corrupting the very DNA of the project.

Think of Gate M as the **Blood-Brain Barrier (BBB)** of your video editor. The brain (the manifest) requires a highly stable internal environment to function. The BBB uses specialized tight junctions to provide **selective permeability**, allowing essential nutrients (valid edits) to pass while blocking circulating toxins (invalid schema, missing assets, or broken backend handshakes) from enters the central nervous system. Gate M ensures that before the editor even renders the first frame of a preview, the project is in a state of high-fidelity readiness.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The **Gate M Pre-Edit Constraint Network** is a multi-layered validation system that interrogates the project state before exposing the interface. It operates on a binary pass/fail logic with three levels of severity: **Block**, **Warn**, and **Info**. 

1.  **Pipeline State Validity:** Ensures the video is in a "reviewable" state (e.g., `READY_FOR_REVIEW`). If the pipeline is still generating raw T2I assets, the editor is blocked to prevent race conditions.
2.  **Manifest Schema Compliance:** This is the deep structural check. It validates the JSON manifest against the `DEP-VID-002` spec, ensuring that the beats array is populated and that the **Frame Math** is consistent. Specifically, it verifies that the `start_frame` of beat *n* equals the sum of the durations of beats 0 to *n-1*.
3.  **Asset & Audio Reachability:** Using asynchronous `HEAD` requests, Gate M pings the S3 URLs for every video clip, fallback image, voiceover, and music file. This prevents the "Black Screen of Death" where the editor loads but the media does not.
4.  **Caption Data Presence:** A soft gate that checking for synchronized transcript data. While not blocking for edits, it warns the user if they are heading toward a final export without captions.
5.  **Backend Connectivity:** A handshake with the FastAPI `api-client`. If the backend is offline, the editor switches to "Local Mode," allowing manifest edits but blocking remote operations like regeneration or final rendering.

## 📂 OUR CODE (165 words)

The brain of this unit lives in `cmf/apps/web/app/editor/gate-m.ts`. The `checkManifestSchema` function (lines 55-94) is the most critical gate to understand. Note how it doesn't just check for the existence of fields, but enforces the **Temporal Integrity** of the timeline:

```typescript
// gate-m.ts, line 87
// WHY: Ensures start_frame consistency. If a user deletes a beat 
// via the Inspector, the subsequent beats MUST be shifted to prevent
// timeline gaps or overlaps that would break the Remotion render.
if (typeof beat.start_frame === "number" && beat.start_frame !== expectedStart) {
  errors.push(`Beat ${i}: start_frame mismatch (expected ${expectedStart}, got ${beat.start_frame})`);
}
```

The `InspectorPanel.tsx` (lines 98-145) implements the **Split at Playhead** logic. It calculates the `splitFrame` relative to the selected beat and enforces a minimum 12-frame (0.5s) duration to maintain edit quality, preventing the creation of sub-perceptual "glitch" beats.

## 🤖 AGENT PROMPT (124 words)

> **Prompt for Claude Code:**
> You are expanding the Gate M validation network in `cmf/apps/web/app/editor/gate-m.ts`. 
> 
> 1. Import `canDecode` from `@remotion/media`.
> 2. Implement a 7th gate function: `checkCodecCompatibility(assets: string[])`.
> 3. For each asset URL, use `await canDecode(url)` to verify that the browser can actually decode the codec (H.264/WebM) before the user attempts to preview it.
> 4. Integrate this new gate into the `runGateM` orchestrator as a `warn` severity.
> 5. Update the `GateMResults` interface to include `codecCompatibility: GateResult;`.
> 
> Maintain the **selective permeability** pattern: warn if the codec is unknown, but do not block unless the URL is completely unreachable.

## ⌨️ TERMINAL (72 words)

```bash
# Manually verify backend connectivity
curl -I http://localhost:8000/api/health
# Expected: HTTP/1.1 200 OK

# Check reachability of a specific S3 asset with a HEAD request
curl -I https://cmf-assets.s3.amazonaws.com/project_001/beat_001_v.mp4
# Expected: Content-Type: video/mp4

# Check manifest validity via node script
node -e "require('./gate-m').checkManifestSchema(JSON.parse(fs.readFileSync('manifest.json')))"
```

## ✅ IMPLEMENTATION STEPS (154 words)

1.  Open `cmf/apps/web/app/editor/gate-m.ts` and locate the `ALLOWED_STATES` array at line 36. Add `"DRAFT"` to the list to allow editing of initial project drafts.
2.  Review the `checkManifestSchema` logic in `gate-m.ts`. Trace how the `expectedStart` accumulator (line 81) ensures that the timeline has zero-gap continuity.
3.  Execute the Agent Prompt from Section 4 in your Claude Code session to add the `codecCompatibility` gate. This leverages Remotion 4.x's built-in media utilities to prevent encoding-related preview failures.
4.  Open `cmf/apps/web/app/editor/components/InspectorPanel.tsx` and find the `handleDeleteBeat` function (line 56). 
5.  Add a `confirm` check if the beat being deleted is the only one left in its `arc_stage`, ensuring the coach doesn't accidentally remove a critical narrative pillar.
6.  Restart the Next.js dev server with `npm run dev` and navigate to the editor to see the Gate M results logged in the browser console.

## ✅ VERIFY (45 words)

To verify Gate M, manually change a beat's `duration_frames` in `store.ts` to `-5`. Reload the editor. The `InspectorPanel` should display a **Schema Validation Error** with a `block` severity, and the "Split" button should be disabled until the math is restored.

## 🔗 BRIDGE (39 words)

Unit 8.7 has secured your "Sacred Document." We now move to **Unit 8.8: The Dashboard — Project Management**, where you will build the Mission Control for tracking exactly which batch runs have passed Gate M and are ready for review.

<!-- FACT-CHECK: "Remotion 4.x canDecode utility 2026" → canDecode is the 2026 standard for verifying browser-level playback compatibility before rendering. -->
<!-- FACT-CHECK: "Zod 3.x vs manual schema checks" → While Zod is the 2026 industry standard, manual predicate checks in Gate M provide specific, low-overhead feedback for frame-accurate math. -->
