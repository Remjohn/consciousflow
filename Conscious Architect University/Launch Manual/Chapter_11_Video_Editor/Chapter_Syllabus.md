# Chapter 08: The Video Editor (Extend YOUR Next.js App)

**Chapter Goal:** Wire and extend the existing 7-component video editor into a fully functional manifest editor with Remotion preview, beat-level review, AI copilot, and export pipeline
**Mastery Track:** Video Automation Operator
**Launch Track:** Video editor accessible at URL, connected to Pipeline Commander API, Remotion preview working, export pipeline live
**Prerequisites:** Chapter 7 (CMF Pipeline — the backend this editor controls)
**Estimated Time:** 14-18 hours

---

## CCP/CMF Reality Anchor

The video editor is the coach's window into the CMF pipeline. After the automated pipeline generates a video batch (weekly schedule), the coach opens the editor to review beat-level outputs, approve/reject segments, request AI-powered edits, and trigger final exports. This is an ALWAYS-ON dashboard (one of only 3 persistent services), not a batch process. The editor reads from S3 (where the CMF writes output) and writes back to the Pipeline Commander API.

---

## Codebase Map

| File | Location | Size | Status |
|------|----------|------|--------|
| `store.ts` | `cmf/apps/web/app/editor/` | ~10KB | ✅ EXISTS — Zustand state |
| `PreviewPanel.tsx` | `cmf/apps/web/app/editor/` | — | ✅ EXISTS |
| `TimelineContainer.tsx` | `cmf/apps/web/app/editor/` | ~13KB | ✅ EXISTS |
| `ReviewPanel.tsx` | `cmf/apps/web/app/editor/` | ~7KB | ✅ EXISTS |
| `CopilotPanel.tsx` | `cmf/apps/web/app/editor/` | ~12KB | ✅ EXISTS |
| `ExportModal.tsx` | `cmf/apps/web/app/editor/` | ~12KB | ✅ EXISTS |
| `InspectorPanel.tsx` | `cmf/apps/web/app/editor/` | — | ✅ EXISTS |
| `gate-m.ts` | `cmf/apps/web/app/editor/` | ~8KB | ✅ EXISTS |
| `api-client.ts` | `cmf/apps/web/app/editor/lib/` | ~9KB | ✅ EXISTS |
| `dashboard/page.tsx` | `cmf/apps/web/app/dashboard/` | ~18KB | ✅ EXISTS |
| `projects/page.tsx` | `cmf/apps/web/app/projects/` | ~31KB | ✅ EXISTS |

**Files referenced: 11** ✅

---

## Science Sources

| Source | Location | Type |
|--------|----------|------|
| `prd-update-visual-control-layer.md` (35KB) | `docs/prd/` | PRD update |
| Remotion 4.x documentation | Web search | External docs |
| `CMF_Pipeline_Documentation.md` (29KB) | `cmf/` | Pipeline spec |
| `FR-VIS-11_In_App_Image_Search_Panel_Tech_Spec.md` | `docs/architecture/` | In-app search |
| `FR-VIS-16_First_Frame_Composer_Tech_Spec.md` | `docs/architecture/` | Frame composition |

---

## Unit Map

| Unit | Title | 🧠 Science Topic | UNLEARN | 📂 Code Files | 📄 Science Sources | Build Target | Verify |
|------|-------|-------------------|---------|---------------|-------------------|-------------|--------|
| 8.1 | Manifest = Project File | Why JSON manifests beat binary project formats (Premiere .prproj). Deterministic diffing, version control, AI-manipulable structure | "Video projects need proprietary formats." False — a JSON manifest is git-diffable, AI-readable, and pipeline-composable. Binary formats are opaque prisons | `store.ts` — Zustand state management | `prd-update-visual-control-layer.md` §Manifest Schema | — | Open `store.ts` and identify the manifest schema shape |
| 8.2 | @remotion/player — Zero-Cost Preview | React composition rendering: video IS a React component tree. `@remotion/player` renders frames in the browser without encoding. Why this is architecturally superior to canvas-based editors | "Video preview requires real-time rendering." False — Remotion renders React components as frames. Preview IS a React app — no video codec needed until export | `PreviewPanel.tsx` | Remotion 4.x docs (web search) | 🤖 Wire PreviewPanel to real Remotion composition | `@remotion/player` renders a beat cluster in the preview panel |
| 8.3 | Timeline Architecture — Tracks & Frames | Track structure (audio, visual, caption tracks), playhead sync, zoom levels, frame math (fps × seconds = frames). How `TimelineContainer.tsx` implements multi-track layout | "Timelines are just scrollbars." False — a timeline is a frame-accurate coordinate system. Zoom, track layering, and playhead sync are precision engineering problems | `TimelineContainer.tsx` (13KB) | `prd-update-visual-control-layer.md` §Timeline | 🤖 Extend with audio waveform visualization | Audio waveform renders on the audio track in the timeline |
| 8.4 | Beat-Level Review — Quality Gate Pattern | Approve/reject at the beat level, not the video level. Quality gate pattern: each beat passes through review before assembly. Batch review workflow after weekly CMF generation | "Review the whole video or nothing." False — beat-level review lets you approve 80% and re-generate only the 20% that failed. Surgical quality control | `ReviewPanel.tsx` (7KB) | `CMF_Pipeline_Documentation.md` §Quality Gates | 🤖 Wire to Pipeline Commander API for re-generation requests | Click "regenerate" on a beat → Pipeline Commander receives re-gen request |
| 8.5 | The AI Copilot Pattern — NL → Edit | Natural language → classified edit intent → JSON Patch (for metadata) or regeneration request (for visuals). Edit taxonomy: timing, caption, visual, audio, style | "AI edits are free-form." False — the copilot classifies NL into a finite edit taxonomy. "Make this brighter" → style_adjustment → patch manifest. Structured classification prevents hallucinated edits | `CopilotPanel.tsx` (12KB) | `prd-update-visual-control-layer.md` §AI Copilot | 🤖 Extend edit taxonomy with 3 new edit types | Copilot classifies "change the music" into an audio_edit intent |
| 8.6 | Export Engineering — Codec & Bitrate | H.264 vs H.265 vs VP9. Bitrate ladders for platform targets (YouTube 4K, Instagram 9:16, LinkedIn 16:9). Remotion CLI for headless rendering | "Just export as MP4." False — each platform has optimal codec, bitrate, aspect ratio, and duration constraints. A single export = 3+ platform-specific renders | `ExportModal.tsx` (12KB) | Remotion docs — `npx remotion render` | 🤖 Wire to render orchestrator for platform-specific exports | Export button triggers `render_orchestrator.py` → video file in S3 |
| 8.7 | Inspector + Gate M — Pre-Edit Validation | Pre-edit validation: check asset availability, schema conformance, timeline consistency BEFORE allowing edits. Gate M as the editor's immune system | "Let the user edit whatever they want." False — editing a reference to a non-existent asset corrupts the manifest. Gate M validates before allowing modification | `InspectorPanel.tsx`, `gate-m.ts` (8KB) | `prd-update-visual-control-layer.md` §Gate M | — | Read Gate M. List 3 validation checks it performs |
| 8.8 | The Dashboard — Project Management | Project listing, pipeline status monitoring, batch completion tracking. The coach's home screen after weekly CMF batch runs | "The dashboard is just a file list." False — the dashboard shows pipeline STATE: which batches ran, which beats need review, which exports are pending. It's mission control for the CMF | `dashboard/page.tsx` (18KB), `projects/page.tsx` (31KB) | `prd-update-visual-control-layer.md` §Dashboard | 🤖 Extend with coach-specific pipeline status view | Dashboard shows batch status for the current coach's projects |
| 8.9 | FastAPI Backend Bridge | REST patterns for editor↔pipeline communication. Presigned S3 URLs for asset loading. WebSocket for pipeline status updates | "The frontend calls the pipeline directly." False — the editor talks to a FastAPI backend that mediates S3 access (presigned URLs), pipeline commands, and auth. Direct pipeline access would expose AWS credentials | `api-client.ts` (9KB) | `Infrastructure_AWS_NIM_Deployment_Spec.md` §API Layer | 🤖 Build missing API endpoints for pipeline commands | `curl /api/pipeline/status` → returns batch processing status |

---

## Quality Gates

- [x] **Unit Count Gate:** 9 units ✅
- [x] **5-File Gate:** 11 files referenced ✅
- [x] **Science Sources Gate:** 5 documents mapped ✅
- [x] **Schedule-Based Gate:** Units 8.4 and 8.8 correctly reflect weekly batch model ✅
