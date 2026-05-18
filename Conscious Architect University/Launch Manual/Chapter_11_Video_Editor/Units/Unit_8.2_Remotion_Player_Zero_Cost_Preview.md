# Unit 8.2: @remotion/player — Zero-Cost Preview

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** Video preview requires a playback engine that renders a flat video codec (like H.264 or MP4) in real-time. This is a legacy constraint. In the Conscious Model Factory (CMF) architecture, we discard the concept of a "render first, watch later" loop for our internal dashboard. 

Think of this like the hippocampal-neocortical interaction in human memory consolidation. A memory is not a fixed MP4 file stored in the temporal lobe. Instead, it is a dynamic neuronal ensemble: a specific firing pattern across millions of synapses that reconstructs the experience each time it is recalled. When you "remember" an event, your brain doesn't play a file; it re-activates the network. 

Similarly, Remotion treats video as a **dynamic React component tree**. The "Player" is not a video decoder; it is a specialized React renderer that orchestrates the firing of your component ensemble at exactly 30 or 60 frames per second. By treating video as code rather than pixels, we achieve "Zero-Cost Preview"—meaning the coach can iterate on complex cinematic beats without spending a single GPU render credit or waiting for an encoding queue.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

At the systems level, `@remotion/player` operates as a React-based viewport into the CMF manifest. Unlike traditional HTML5 `<video>` tags that expect a stream of compressed bits, the Remotion Player expects a `component` (the visual template) and `inputProps` (the data manifest). 

The processing pipeline follows a **Frame-Synchronous Orchestration** model:
1.  **State Injection:** The `store.ts` (Zustand) updates the `manifest` state whenever an edit occurs.
2.  **Prop Propagation:** The `manifest` is passed into the `Player` via the `inputProps` prop.
3.  **Frame Calculation:** The Player calculates the current `frame` based on the playhead's `seek` position or playback speed.
4.  **Composition Rendering:** The `CMFComposition` component (from our `@cmf/remotion-compositions` package) receives the `frame` number via the `useCurrentFrame()` hook and renders the matching DOM/SVG/Canvas elements in the browser.

The architectural beauty of this approach is that it leverage's the browser's native hardware acceleration (GPU) for DOM rendering while remaining entirely deterministic. Because every visual is a React component, we can perform "Surgical Regeneration": if a coach changes a single word in a caption, only that React component re-renders. We don't re-encode the entire video. 

**Constraints & Failure Modes:** The primary constraint is **VRAM Overload**. If the coach stacks 50+ 4K image layers with heavy CSS filters (blur, drop-shadow) or Three.js 3D models, the browser's UI thread may drop frames during preview. This is why our "Zero-Cost" model still requires a baseline GPU (e.g., RTX 3060+) for the editor's dashboard.

## 📂 OUR CODE (145 words)

- `cmf/apps/web/app/editor/components/PreviewPanel.tsx` line 38: The implementation of the `<Player>` component.
- `cmf/apps/web/app/editor/store.ts` line 156: The `setPlayheadFrame` action that binds the player's timeline to the editor's global state.

```typescript
// PreviewPanel.tsx, lines 38-45
// WHY: We wire the manifest directly into the Player's inputProps.
// This ensures that the preview is always reactive to the Zustand store.
<Player
  ref={playerRef}
  component={CMFComposition}
  inputProps={{ manifest }} // The dynamic CMF manifest
  fps={manifest.fps}
  durationInFrames={manifest.total_frames}
  // ...
/>
```

```typescript
// store.ts, line 156
// WHY: Updating the global playhead allows other components 
// (like the Timeline and Inspector) to sync with the video preview.
setPlayheadFrame: (frame) => set((state) => ({
  session: { ...state.session, playhead_frame: frame },
})),
```

## 🤖 AGENT PROMPT (112 words) — OPTIONAL

> **Prompt for Claude Code / Gemini CLI:**
> I need to extend the `@remotion/player` integration in `cmf/apps/web/app/editor/components/PreviewPanel.tsx`. 
> 
> **Goal:** Implement keyboard shortcuts for the video player to improve the coach's editing efficiency.
> 1. Use a standard `useEffect` with a `keydown` listener.
> 2. `Space`: Toggle play/pause using `playerRef.current.toggle()`.
> 3. `ArrowRight`: Seek forward 1 second (`manifest.fps` frames).
> 4. `ArrowLeft`: Seek backward 1 second.
> 5. `[` or `]`: Seek to the start/end of the current selected beat (calculate using `manifest.beats[session.selected_beat_index]`).
> 
> Ensure you prevent default browser behavior for Space to stop the page from scrolling.

## ⌨️ TERMINAL (68 words) — OPTIONAL

```bash
# Start the Remotion Studio for isolated testing of compositions
cd cmf/packages/remotion-compositions
npx remotion studio

# The studio allows you to mock 'inputProps' (the CMF manifest) 
# and see frame-accurate renders before they go into the main Editor app.
# Expected: "Remotion Studio started on http://localhost:3000"
```

## ✅ IMPLEMENTATION STEPS (152 words)

1.  **Initialize the Player:** Open `cmf/apps/web/app/editor/components/PreviewPanel.tsx` and ensure the `@remotion/player` is imported alongside the `CMFComposition`.
2.  **State Binding:** Use the `useEditorStore` selector to pull the current `manifest` and the `setPlayheadFrame` action.
3.  **Configure Component:** Pass the `CMFComposition` (from our inner package) to the `component` prop of the Player. This is your "Ensemble" that will render the manifest data.
4.  **Memoize Props:** Wrap the `manifest` passed into `inputProps` in a `useMemo` (or rely on the fact that the store object only updates on mutation) to prevent jittery re-renders of the video tree.
5.  **Enable Controls:** Set the `controls` prop to `true` to enable the built-in Remotion UI for scrubbing and volume.
6.  **Verify Sync:** Add the `onFrameChange` listener to the Player to call `setPlayheadFrame`, ensuring the global playhead remains synchronized with the visual preview.

## ✅ VERIFY (42 words)

Open the Video Editor in your browser. Move the playhead in the Remotion Player.
**Check:** Does the "playhead_frame" value in the `preview-controls` div below the video update in real-time? → **Yes/No**. If Yes, the bridge is live.

## 🔗 BRIDGE (45 words)

Unit 8.2 established the **Visual Window**—the ability to see what our code is thinking. In **Unit 8.3: Timeline Architecture**, we build the **Temporal Spine**: the multi-track coordinate system that allows the coach to orchestrate those visuals with frame-accurate precision.

<!-- FACT-CHECK: "Remotion 4.x player best practices 2026" → Remotion 4.0 moved to a more efficient rendering model using specialized concurrency handles. Memoizing inputProps and avoiding frequent Player re-renders remains the gold standard for performance. Verified on remotion.dev documentation. -->
