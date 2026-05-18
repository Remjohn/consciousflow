# Unit 8.6: Export Engineering — Codec & Bitrate

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Video quality is not a fixed property of a file. It is a relationship between bandwidth, compute power, and human perception. The goal of export engineering is not to "save the best file," but to achieve the "Just-Noticeable Difference" (JND) threshold while minimizing the delivery cost.

Think of it like **Materials Science — Choosing the Structural Alloy for the Load.** In structural engineering, you don't use high-tensile carbon fiber for a garden fence, and you don't use heavy cast iron for a satellite. You select the alloy based on the stress it will endure. H.264 is our universal carbon steel — heavy, but it works everywhere. AV1 is our 2026 carbon fiber — incredibly light (low bandwidth) but requires high-tech "forging" (compute-heavy encoding) to produce.

In the CMF pipeline, we don't just "render MP4." We engineer platform-specific manifests. A YouTube 4K upload requires a "sturdier alloy" (higher bitrate) than an Instagram Reel viewed on a mobile data connection. Choosing the wrong "alloy" either breaks the bridge (buffer/lag) or wastes the budget (excessive bandwidth).

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

In 2026, the Video Automation Operator must balance three primary codecs: **H.264 (AVC)**, **H.265 (HEVC)**, and **AV1**. While H.264 remains the universal fallback with 99% device reach, AV1 has become the 2026 efficiency standard, offering 30-50% better compression. However, the trade-off is encoding complexity; AV1 requires significantly more VRAM and CPU cycles during the render phase.

We implement **Bitrate Ladders** to solve the delivery problem. A bitrate ladder is a set of platform-specific encoding targets:
- **YouTube (16:9):** Targets 18-24 Mbps (4K) using H.265 or AV1 to maintain high-fidelity textures.
- **Instagram/TikTok (9:16):** Targets 8-12 Mbps using H.264 for maximum mobile compatibility and fast loading.
- **LinkedIn (16:9/1:1):** Targets 5-8 Mbps, prioritizing text legibility (captions) over high-motion fluidity.

The **Remotion CLI** (`npx remotion render`) serves as our headless forge. By passing specific flags like `--codec`, `--crf` (Constant Rate Factor), and `--video-bitrate`, we control the "structural integrity" of the final file. CRF is our primary quality control: a value of 18 is visually lossless, while 28 offers a balanced trade-off for social distribution. In our sovereign architecture, we avoid proprietary cloud encoders, running these CLI commands on our own Nvidia NIM-optimized containers to ensure manifest-to-video determinism.

## 📂 OUR CODE (100-200 words)

The UI for these engineering decisions lives in `cmf/apps/web/app/editor/components/ExportModal.tsx`. This component surfaces the `PLATFORM_PRESETS` which map directly to our 2026 bitrate ladder strategy.

```typescript
// ExportModal.tsx, line 27
// WHY: We define platform-specific presets that govern resolution, 
// frame rate, and codec BEFORE sending the job to the backend.
const PLATFORM_PRESETS: Record<string, PlatformPreset> = {
  "tiktok-9x16": {
    label: "TikTok / YouTube Shorts / Reels (9:16)",
    width: 1080,
    height: 1920,
    fps: 30,
    codec: "h264", // Safe fallback for mobile social platforms
  },
  // ...
};
```

The actual "forging" happens in `cmf/apps/cmf-assembler/render_orchestrator.py`.

```python
# render_orchestrator.py, line 257
# WHY: The orchestrator constructs the metadata payload that the 
# Remotion CLI uses to set internal FFmpeg flags (--crf, --video-bitrate).
return {
    "render_id": render_id,
    "quality_tier": quality_tier,
    "codec": preset["codec"],
    "bitrate_kbps": preset["bitrate_kbps"],
    "crf": preset["crf"],
}
```

🔧 **EXTEND** — Modify `ExportModal.tsx` to include an "Experimental: AV1" codec option for the "Final" quality tier to utilize 2026 compression efficiency.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> 
> Create a new configuration file at `cmf/apps/cmf-assembler/presets/bitrate_ladder_2026.json` that defines standard bitrate targets for YouTube (16:9, 4K, 24Mbps), Instagram (9:16, 1080p, 10Mbps), and LinkedIn (16:9, 1080p, 6Mbps). Then, modify `render_orchestrator.py` to import this JSON and use it to populate the `bitrate_kbps` field based on the `selected_preset` passed from the `ExportModal.tsx`. Ensure that if the codec is set to `av1`, the `crf` is adjusted to 24 to account for the increased compression efficiency.

## ⌨️ TERMINAL (50-100 words)

```bash
# Manually test a high-efficiency AV1 render for YouTube 4K
npx remotion render src/index.tsx MyComp out/final.mp4 \
  --codec=av1 --crf=24 --video-bitrate=18M

# Verify the codec of the generated file
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 out/final.mp4
# Expected: av1
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  Open `ExportModal.tsx` and identify the `PLATFORM_PRESETS` object (line 27).
2.  Add a new entry for `youtube-4k` targeting 3840x2160 at 24fps with the `av1` codec.
3.  Paste the prompt from Section 4 into your Claude Code session to generate the `bitrate_ladder_2026.json` and update the `render_orchestrator.py` logic.
4.  In `ExportModal.tsx`, locate the `handleStartExport` function (line 129). Ensure the `qualityTier` and `selectedPreset` are correctly passed to the `startRender` API call.
5.  Open `render_orchestrator.py` and verify that the `build_render_job` function (line 219) correctly extracts the new bitrate values from your ladder JSON.
6.  Restart the `cmf-assembler` service to load the new presets.

## ✅ VERIFY (30-50 words)

Open the Video Editor, click **Export**, select the **YouTube 4K (AV1)** preset, and trigger the render. Once complete, check the `VIDEO_RENDER` receipt in your project directory. Does the `codec` field say `av1`? → **Yes/No**.

## 🔗 BRIDGE (30-50 words)

Unit 8.7 builds on this by introducing **Inspector + Gate M**, our pre-edit validation system that ensures your manifest is architecturally sound before you waste expensive GPU cycles on the complex exports we just configured.

<!-- FACT-CHECK: "AV1 status 2026" → AV1 is now supported by all major browsers (Chrome, Safari 17+, Firefox) and utilized by YouTube/Netflix as primary efficient codec. -->
<!-- FACT-CHECK: "Remotion 4.x CLI flags" → Remotion 4.x supports --codec=av1 and --video-bitrate flags for granular control. -->
