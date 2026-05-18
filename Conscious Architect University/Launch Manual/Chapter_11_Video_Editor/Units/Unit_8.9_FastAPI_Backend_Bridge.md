# Unit 8.9: FastAPI Backend Bridge

## 🧠 THE SCIENCE

**UNLEARN:** The frontend doesn't "talk" to the pipeline or S3 directly. In a production-grade agentic architecture, any direct connection from the browser to your infrastructure is a catastrophic security breach waiting to happen. If your `api-client.ts` holds AWS Access Keys or your S3 bucket is `public-read`, you have already lost.

Think of the FastAPI backend as the **Sanctuary Architecture** of the ancient Tabernacle. The Video Editor (frontend) is the Outer Court—where users interact. The FastAPI backend is the Holy Place—a secure buffer layer where mediation, ritual (validation), and identification happen. The CMF Pipeline and S3 buckets are the Most Holy Place, accessible ONLY by the High Priest (the FastAPI backend) through a specific, temporary veil (Presigned URLs).

This mediation is the core of our **Data Sovereignty** claim. By routing every request through a Fargate-hosted FastAPI bridge, we ensure that no client PII ever reaches the LLM NIMs without being scrubbed, and no raw S3 credentials ever touch the coach's local machine.

## 🧠 TECHNICAL KNOWLEDGE

The FastAPI Backend Bridge operates as a stateless orchestration layer between the Next.js frontend and the GPU-bound CMF pipeline. It solves three critical production problems:

1.  **Credential Isolation (Presigned URLs):** Instead of making S3 buckets public, the FastAPI backend uses the Boto3 library to generate **S3 Presigned URLs**. These are temporary (60-minute) cryptographic signatures that allow the browser to PUT/GET a specific object without knowing the root bucket credentials. This ensures the "veil" remains intact between the Outer Court and the Most Holy Place.
2.  **Resource Governance (Token Buckets):** Every request to the `api-client.ts` is gated by a **Redis Token Bucket** algorithm. Before a coach can trigger a FLUX regeneration, FastAPI checks Redis (MIG Partition D) to see if their daily `image_generation_seconds` quota is exhausted. This prevents "rogue loops"—where a buggy agent might accidentally consume $400 in GPU credits in minutes.
3.  **Stateful Buffer (PII Scrubbing):** When a client voice note arrives, FastAPI intercepts the raw transcript from Whisper and runs it through the **Presidio NER (Named Entity Recognition)** model. It replaces "John Doe" with `[CLIENT_NAME]` before the text ever reaches the Llama-3 NIM. The real-world mapping stays in our private RDS (PostgreSQL) and only "rehydrates" at the very moment of delivery to the coach.

This 2026-standard architecture ensures that even if the frontend is compromised, the primary compute assets and sensitive data stores remain isolated behind the VPC-gated FastAPI service.

## 📂 OUR CODE

Our existing client-side implementation is found in `cmf/apps/web/app/editor/api-client.ts`. It acts as the TypeScript interface to our FastAPI Holy Place.

```typescript
// api-client.ts, line 295
// WHY: We perform a 3-second timeout health check to ensure the
// Fargate task is warm BEFORE attempting heavy manifest fetches.
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// api-client.ts, line 74
// WHY: Manifest updates use standard HTTP PATCH with JSON Patch ops.
// This allows the AI Copilot to modify specific beats without 
// re-sending the entire 1.2MB manifest over the wire.
export async function patchManifest(
  videoId: string,
  patch: JsonPatchOp[]
): Promise<CMFManifest> {
  const res = await fetch(`${BASE_URL}/api/editor/${encodeURIComponent(videoId)}/manifest`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(patch),
  });
  return handleResponse<CMFManifest>(res);
}
```

🔧 **EXTEND** — We need to add the `fetchPipelineStatus` function to `api-client.ts` to map to the new `/api/pipeline/status` endpoint for batch monitoring.

## 🤖 AGENT PROMPT

> **Prompt for Gemini CLI:**
> I need to extend the FastAPI backend and the Next.js editor client to support batch status monitoring. 
> 
> 1. In the FastAPI backend (located at `cmf/api/main.py`), create a new GET endpoint `/api/pipeline/status` that returns the current state of the Celery worker queue and the `comfyui_queue_depth` from Redis.
> 2. In `cmf/apps/web/app/editor/api-client.ts`, add a new export function `fetchPipelineStatus()` that calls this endpoint and returns a `PipelineStatus` object with `queue_depth: number` and `workers_active: boolean`.
> 
> Ensure the endpoint is protected by the `verify_token` dependency and logs the `coach_id` to CloudWatch.

## ⌨️ TERMINAL

```bash
# Test the status endpoint directly via CLI
curl -X GET "http://localhost:8000/api/pipeline/status" \
  -H "Authorization: Bearer ${JWT_TOKEN}"

# Expected Output:
# {"status": "healthy", "queue_depth": 0, "active_workers": 2}

# Monitor the logs for the Fargate bridge
aws logs tail /ecs/ccp-fastapi-bridge --follow
```

## ✅ IMPLEMENTATION STEPS

1.  Paste the prompt from Section 4 into your Gemini CLI session to generate the backend endpoint and frontend client function.
2.  Open `cmf/api/main.py` and verify that the new status route imports `get_redis_client` to check the queue depth.
3.  Open `api-client.ts` and ensure `fetchPipelineStatus` uses the `authHeaders()` helper to send the JWT.
4.  In the editor's Dashboard, wire the status indicator to call `fetchPipelineStatus` every 30 seconds (standard polling for batch monitoring).
5.  Deploy the updated FastAPI container to ECS Fargate using the CMF deploy script.

## ✅ VERIFY

Run `curl -I http://localhost:8000/api/pipeline/status`. If the response is `200 OK` and contains a JSON body with `queue_depth`, the backend bridge is successfully mediating pipeline state to the editor.

## 🔗 BRIDGE

Now that the bridge between the editor and the CMF infrastructure is secure and monitored, we move to Chapter 9: The AFFiNE Dashboard, where we will build the persistent workspace where these manifests are archived and collaborative coaching begins.

<!-- FACT-CHECK: "FastAPI 2026 best practices" → Recommended use of multi-stage Docker slim images, non-root users, and Uvicorn/Gunicorn. ALB health checks against /health mandatory for ECS Fargate. -->
<!-- FACT-CHECK: "S3 Presigned URLs Boto3 2026" → Still standard for secure temporary access. Recommended expiration < 3600s for high-security environments. -->
