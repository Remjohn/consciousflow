# Unit 8.3: Timeline Architecture — Tracks & Frames

## 🧠 THE SCIENCE (135 words)

**UNLEARN:** A video timeline is not just a "scrollbar" or a UI convenience. It is a frame-accurate coordinate system. In traditional editors, you "watch" a video; in the Conscious Movie Factory, you "observe" a deterministic state machine.

Think of it like the motor cortex orchestrating the timing of muscle firing patterns. The brain doesn't just send a generic "move arm" signal; it must synchronize hundreds of motor units across a precise temporal window (neural oscillatory synchronization) to ensure the movement is fluid and the hand reaches its target coordinate.

If the timing is off by 50ms, the hand misses. If the CMF timeline is off by 1 frame (41ms at 24fps), the caption appears before the word is spoken, and the "Identity Shock" of the video is broken. The timeline is the synchronous clock that locks our AI-generated visuals, audio stems, and word-level typography into a single coherent reality.

## 🧠 TECHNICAL KNOWLEDGE (230 words)

The CMF timeline operates on the primitive unit of the **Frame**. In a frame-accurate system, every event is an entry in a massive discrete coordinate map where `X = frame_index`.

1. **Frame Math:** Every duration in our manifest (DEP-VID-002) is calculated using the formula: `frames = seconds * fps`. At 24 frames per second (fps), a 5-second beat is exactly 120 frames. This is a non-negotiable architectural constant.
2. **Track Layering:** The timeline implements a three-track architecture:
    - **Visual Track (Primary):** A sequence of beats, each mapping a VCP to a specific `video_clip_url`.
    - **Audio Track (Synchronous):** Two parallel layers (Voiceover and Music) where the volume is modulated by a per-frame `ducking_curve` array.
    - **Caption Track (Overlay):** High-density word blocks positioned using Whisper's word-level timestamps.
3. **The Playhead Node:** The playhead acts as the "Observer Node" in our state machine. Its `currentFrame` position is the reactive trigger for the `@remotion/player`. When you move the playhead, you aren't just scrolling; you are updating the `inputProps` of the Remotion Composition, forcing a frame-accurate re-render of the entire virtual camera.
4. **Zoom Mechanics:** Zoom is the translation of **Time (Frames)** to **Space (Pixels)**. `pixelsPerFrame` is the conversion factor. A zoom level of 1.0 might mean 2 pixels per frame, while 10.0 allows you to see individual frames for surgical trimming—a requirement for high-fidelity beat alignment.

## 📂 OUR CODE (145 words)

The timeline is implemented in `cmf/apps/web/app/editor/components/TimelineContainer.tsx`. Its core engine is the `pixelsPerFrame` memoized calculation and the `updateManifest` mutation logic.

```typescript
// TimelineContainer.tsx, line 243
// WHY: We translate zoomLevel (user preference) into the physical 
// coordinate space pixelsPerFrame to drive all track layouts.
const pixelsPerFrame = useMemo(() => Math.max(0.1, zoomLevel * 2), [zoomLevel]);

// TimelineContainer.tsx, line 251
// WHY: Manifest mutation ensures our timeline is the single source of truth.
// We enforce a 12-frame (0.5s) minimum to prevent sub-perceptual beat errors.
const newDuration = Math.max(12, beat.duration_frames + deltaFrames);
```

🔧 **EXTEND:** You will extend this file to include frame-accurate audio waveforms on the Music track, ensuring visual parity with the heard volume.

## 🤖 AGENT PROMPT (125 words)

> **Prompt for Claude Code:**
> In our existing `cmf/apps/web/app/editor/components/TimelineContainer.tsx`, we need to implement frame-accurate audio waveform rendering for the `MusicTrack`. 
> 
> 1. Use `@remotion/media-utils`'s `useAudioData` and `visualizeAudioWaveform` to fetch data from `manifest.audio.music_path`.
> 2. Create a `WaveformRenderer` component that takes `audioData`, `currentFrame`, and `fps`.
> 3. Use `visualizeAudioWaveform` with `numberOfSamples: 128` to calculate amplitudes for a 2-second "lookahead" window at the playhead.
> 4. Render these amplitudes as a SVG `<polyline>` inside the `music-track` div.
> 5. Ensure the waveform color matches our `resolution` arc color (`#3498db`) with 40% opacity.
> 6. Re-calculate the waveform reactively as the `playheadFrame` from the Zustand store updates.

## ⌨️ TERMINAL (65 words)

```bash
# Install the Remotion media utilities for waveform visualization
npm install @remotion/media-utils

# Verify the web app's dev server is running
npm run dev

# Search for the Ducking curve in the manifest to verify audio state
grep -A 5 "ducking_curve" public/projects/manifest.json
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Install Dependencies:** Run the `npm install` command from Section 5 to add frame-accurate media utilities.
2. **Bind the Playhead:** Open `TimelineContainer.tsx` and verify that `handleTimelineClick` correctly updates the Zustand store's `playheadFrame`.
3. **Draft the Waveform Engine:** Paste the prompt from Section 4 into your AI coding assistant (Claude Code or Gemini CLI) to build the `DuckingOverlay` and waveform logic.
4. **Map the Music Track:** Locate the `music-track` `div` (line 375). Ensure it receives the `audioData` from the `useAudioData` hook.
5. **Synchronize Zoom:** Ensure your new waveform component respects the `pixelsPerFrame` constant so the audio visual aligns exactly with the beat blocks.
6. **Enforce Frame Math:** If trimming a beat, verify that `handleTrimEnd` correctly recalculates the `start_frame` for all subsequent clips in the timeline.

## ✅ VERIFY (45 words)

Open the CMF Editor in your browser. Scrub the playhead across a beat transition. Does the waveform accurately reflect the music swell? Does the @remotion/player update the preview frame-by-frame with zero latency? If yes, the coordinate system is locked.

## 🔗 BRIDGE (40 words)

Unit 8.3 established our spatial coordinate system. Unit 8.4 builds on this by introducing the **Beat-Level Review Pattern**—bridging our timeline edits with the Pipeline Commander's authority to approve or regenerate surgical segments of the video.

<!-- FACT-CHECK: "Remotion 4.x visualizeAudioWaveform 2026" → Verified stable in @remotion/media-utils, supports useWindowedAudioData for large files. -->
<!-- FACT-CHECK: "Frame-accurate web timelines 2026" → Industry standard now uses React + SVG/Canvas for sub-millisecond playhead sync via Web Audio API. -->
