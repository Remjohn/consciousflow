# Unit 8.8: The Dashboard — Project Management

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** The dashboard is not a static file list. It is a real-time neuro-synaptic monitor for the CMF pipeline. In a traditional CRUD application, you check a "list" to see if a job is done. In the CCP architecture, the dashboard is a live witness to signal propagation across the 84-agent cognitive-behavioral matrix.

Think of it like a neuroscientist monitoring a synaptic connection during Long-Term Potentiation (LTP). You aren't just looking at a histological slide of the neuron (a static project file); you are monitoring the frequency and amplitude of the action potentials (the pipeline state updates) as they traverse the network. When a beat cluster moves from `GENERATING_T2I` to `QUALITY_GATE`, you are witnessing the system's "conscious" decision-making in real-time. The dashboard doesn't just show you "the result"; it shows you the "metabolism" of your production engine. Without this live synchrony, the coach is blind to the pipeline's health, leading to wasted GPU cycles and architectural drift.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Real-time state synchronization at scale requires a persistent communication channel between the FastAPI backend and the Next.js frontend. While WebSockets provide bi-directional communication, the CMF uses **Server-Sent Events (SSE)** via the `EventSource` API for a cleaner, uni-directional stream of pipeline updates. SSE is architecturally superior for dashboards because it is lightweight, operates over standard HTTP/2, and handles automatic reconnection natively.

The synchronization pattern follows a "Snapshot + Delta" model. When you first load the dashboard, a standard REST request fetches the current state of all active pipelines (`/api/dashboard/pipelines`). Once the initial UI is hydrated, the SSE connection opens (`/api/dashboard/stream`). This stream pushes only the **deltas** — specific state changes (e.g., `pipeline_id: "X", new_state: "READY_FOR_REVIEW"`) — which are merged into the React state. This prevents the "thundering herd" problem where a dashboard with 100 active projects consumes massive bandwidth by re-polling the entire list.

In 2026, connection stability is enforced via **Exponential Backoff**. If the SSE stream drops due to a network hiccup or server restart, the client doesn't immediately "hammer" the API. Instead, it waits 1s, then 2s, then 4s, doubling the delay until it reaches a 30s cap. This protects the Pipeline Commander from being "DDOSed" by its own clients during a recovery phase. Furthermore, the dashboard employs a **5s Polling Fallback**; if the SSE connection fails to establish for more than 3 attempts, the system automatically degrades to frequency-based REST polling, ensuring the coach is never entirely disconnected from the reality of the CMF's status.

## 📂 OUR CODE (100-200 words)

The dashboard logic is split between project management and real-time monitoring. Open `cmf/apps/web/app/dashboard/page.tsx` and track the SSE implementation:

```tsx
// dashboard/page.tsx, line 289
// WHY: We establish a persistent uni-directional stream for real-time deltas.
// The authorization token is passed as a query param for EventSource compatibility.
const es = new EventSource(`${API_BASE}/api/dashboard/stream?authorization=Bearer+${encodeURIComponent(token)}`);

// dashboard/page.tsx, line 297
// WHY: When a state change occurs in the backend, we merge ONLY the updated
// fields into the existing pipelines array, preventing a full list re-render.
es.addEventListener('pipeline_update', (e: MessageEvent) => {
  const data = JSON.parse(e.data);
  setPipelines(prev => {
    const idx = prev.findIndex(p => p.pipeline_id === data.pipeline_id);
    if (idx >= 0) {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], current_state: data.state, progress: data.progress };
      return updated;
    }
    return prev;
  });
});
```

The `projects/page.tsx` file handles the "long-term memory" of the editor, including folder trees and bulk archive operations. Line 233 implements the `ProjectCard` with a `has_active_editor_session` indicator, showing which projects are currently being locked by another coach.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> `🔧 EXTEND — Open cmf/apps/web/app/dashboard/page.tsx. I need to implement a coach-specific pipeline filter and a "Batch Pulse" visual indicator. First, add a 'coach_id' filter to the top bar dropdown. Then, modify the StateBadge component (line 78) to incorporate a subtle 'glow' animation using Framer Motion when the state is 'GENERATING_I2V' or 'REGENERATING'. Finally, ensure that the fetchAll() function (line 265) accepts an optional coach_id parameter to filter the initial state snapshot. Output the updated file with these features implemented.`

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the dashboard stats endpoint
curl -H "Authorization: Bearer dev-token" http://localhost:8000/api/dashboard/stats
# Expected: {"active_pipelines": 2, "awaiting_review": 1, ... }

# Test the SSE stream connection (will hang and wait for events)
curl -N -H "Authorization: Bearer dev-token" http://localhost:8000/api/dashboard/stream
# Expected: event: pipeline_update \ndata: {"pipeline_id": "...", "state": "READY_FOR_REVIEW"}
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Verify S3 Asset Paths:** Ensure that the `projects/page.tsx` component is correctly resolving `thumbnail_url` from your `cmf-production-assets` bucket.
2.  **Deploy Coach Filter:** Paste the prompt from Section 4 into your Claude Code session to extend the filtering capabilities. This is critical for scaling to multi-coach environments (ADR-01).
3.  **Configure Proxy Buffering:** If you are running the dashboard behind Nginx, you **MUST** set `proxy_buffering off;` and `proxy_cache off;` for the `/api/dashboard/stream` endpoint, otherwise SSE events will be buffered and delivered in chunks, breaking the "real-time" experience.
4.  **Test Exponential Backoff:** Kill the FastAPI backend service (`docker stop cmf-api`). Open your browser's Network tab and verify that the `stream` request begins its backoff sequence (1s, 2s, 4s...). Restart the service and ensure the dashboard auto-reconnects and pushes the latest deltas.

## ✅ VERIFY (30-50 words)

Open the Dashboard at `http://localhost:3000/dashboard`. Can you see the `active_pipelines` card update its value without refreshing the page when a new batch is triggered? If yes, the SSE bridge and React state merging are functional.

## 🔗 BRIDGE (30-50 words)

Unit 8.9 builds on this by introducing the FastAPI Backend Bridge — the "producer" side of the dashboard we just built. We will implement the `/api/dashboard/stream` endpoint and the Redis-backed pub/sub system that triggers the events you are now seeing.

<!-- FACT-CHECK: "Next.js SSE reconnection exponential backoff 2026" → EventSource native retry is supported, but custom exponential backoff logic is best practice for high-load recovery, typically implemented in useSyncExternalStore or useEffect. -->
<!-- FACT-CHECK: "React state management for real-time dashboards 2026" → For high-frequency updates, state batching (React 18+) and useTransition are recommended to maintain 60fps UI while processing multiple background updates per second. -->
<!-- FACT-CHECK: "Server-Sent Events Nginx buffering 2026" → X-Accel-Buffering: no header or proxy_buffering off is mandatory to prevent event delay in Nginx/Apache proxies. -->
