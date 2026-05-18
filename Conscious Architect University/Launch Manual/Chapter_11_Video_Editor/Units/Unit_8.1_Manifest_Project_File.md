# Unit 8.1: Manifest = Project File

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** Video projects require proprietary, binary "master files" (like .prproj or .aep) to maintain state. In the automated world of the CMF, a video project is NOT a file; it is a **Deterministic Manifest**.

Think of the **Hippocampus** during episodic memory consolidation: it does not store high-resolution "video files" of your experiences. Instead, it maintains a flat, associative index of pointers to distributed traces across the neocortex. When you remember a scene, the hippocampus "renders" the experience by firing those pointers in a specific temporal sequence, reconstructing the memory from raw data.

A JSON manifest is the CMF's hippocampus. It contains the temporal instructions (points of interest, timing, asset references) that allow our Remotion engine to reconstruct the exact same video across any GPU instance, anywhere, every time. The manifest is git-diffable, AI-manipulable, and perfectly stateless.

## 🧠 TECHNICAL KNOWLEDGE (232 words)

In our architecture, we move from "Editing" (manipulating pixels) to **"State Management"** (manipulating metadata). This is expressed by the functional formula: `Video = f(React Code + JSON Manifest)`. 

The `CMFManifest` is a hierarchical JSON structure that serves as the single source of truth for the entire rendering pipeline. It consists of three primary layers:
1.  **Global Metadata:** Project IDs, dimensions (1080x1920 for 9:16), FPS (usually 30), and total frame counts.
2.  **The Beat Array:** A sequential list of `ManifestBeat` objects. Each beat defines its `start_frame`, `duration_frames`, and visual asset pointers (S3 URLs or local paths). This allows for **deterministic diffing**—if you change the timing of beat #4, you are only changing a single integer in a JSON file, not "re-exporting" a project.
3.  **Layer Tracks:** Parallel definitions for Audio (voiceover + music with volume ducking curves) and Captions (word-level anchors with millisecond precision).

Because the format is standard JSON, we gain **Stateless Interoperability**. The Next.js Editor can manipulate the JSON state using Zustand, save it to a PostgreSQL database, and then pass it to a headless Remotion CLI (running on an AWS Lambda or EC2 instance) for final encoding. There is no proprietary lock-in, and absolutely no data loss between the coach's review and the final render.

## 📂 OUR CODE (148 words)

Our editor manages this manifest through two critical locations:

1.  **`cmf/apps/web/app/editor/store.ts`**: The Zustand store that holds the `manifest` object in memory. It uses the `temporal` (zundo) middleware to provide a 50-step undo/redo stack without complex state-tracking logic.
    ```typescript
    // store.ts, line 50
    // WHY: The manifest is the authoritative state. Every edit (timing, asset swap)
    // triggers a manifest update, which the Remotion Player then re-renders.
    manifest: CMFManifest | null;
    ```

2.  **`cmf/packages/remotion-compositions/src/CMFComposition.tsx`**: The TypeScript interface defining the "law" of what a manifest must look like.
    ```typescript
    // CMFComposition.tsx, line 62
    // WHY: This interface ensures type-safety across the editor (Frontend)
    // and the render engine (Backend), preventing corrupt manifests.
    export interface CMFManifest { ... }
    ```

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code / Gemini CLI:**
> 
> "I need to add a debugging feature to our editor store. Open `cmf/apps/web/app/editor/store.ts` and add a new action called `downloadManifest`. This action should take the current `manifest` state, serialize it to a JSON string with 2-level indentation, and trigger a browser download for a file named `manifest-[video_id].json`. Ensure you use a Blob and `window.URL.createObjectURL` for the download logic. This will allow coaches to manually archive their project state before the weekly batch rotation."

## ✅ IMPLEMENTATION STEPS (142 words)

1.  **Open `cmf/packages/remotion-compositions/src/CMFComposition.tsx`**: Locate the `CMFManifest` interface (line 62). Trace how it requires a `beats` array.
2.  **Audit `ManifestBeat`**: See how each beat is defined by frames (`start_frame`, `duration_frames`), not seconds. This is the precision layer required for Remotion's frame-accurate rendering engine.
3.  **Open `cmf/apps/web/app/editor/store.ts`**: Find the `useEditorStore` (line 123). Notice how the `temporal` middleware only tracks the `manifest` key for undo/redo (line 232), ignoring volatile UI state like `zoom_level`.
4.  **Trace the Update Loop**: Find the `setManifest` action (line 133). Every single UI interaction in the editor—from dragging a clip to typing a caption—must eventually call this function to update the central state.

## ✅ VERIFY (44 words)

Identify these 3 mandatory fields in the `CMFManifest` interface within `CMFComposition.tsx`: `project_id`, `fps`, and `beats`. If you can locate these and describe their data types (String, Number, Array), your understanding of the project structure is validated.

## 🔗 BRIDGE (36 words)

Unit 8.2 builds on this by introducing **@remotion/player — Zero-Cost Preview**, which explains how the Remotion engine consumes this JSON manifest to render a live, high-fidelity video preview directly in the coach's browser.

<!-- FACT-CHECK: "Remotion 4.x JSON manifest" → Remotion 4.x relies on Zod schemas for type-safe props, integrated with the Studio for live JSON editing. -->
<!-- FACT-CHECK: "Zustand zundo middleware" → Temporal middleware (zundo) is the standard 2026 path for undo/redo state in React stores. -->
