# Unit 2.14: Migrating from RunningHub

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "Just change the URL." In systems architecture, changing a provider is rarely a matter of swapping a base URL; it is a structural refactoring of the transport layer's physics. RunningHub is a rental proxy—it introduces a middleman that manages polling, queuing, and GPU availability. When you migrate to a sovereign Nvidia NIM infrastructure, you are removing that middleman and assuming direct control over the request-response lifecycle.

Think of it like the transition from a specialized courier service to owning your own fleet of transport drones. With a courier (RunningHub), you hand over a package (input image) and wait for a callback or poll for status. You don't care how the drone flies or where it recharges. With your own fleet (NIM on AWS), you are the flight controller. You manage the startup sequence, the VRAM fuel levels, and the direct telemetry stream. This is the difference between *using* a service and *operating* a system. Sovereignty requires you to move from passive observation to active orchestration.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The RunningHub I2V client (`runninghub_client.py`) is architected around a 29KB layer of proxy-specific logic. Because RunningHub acts as a buffer, the client must implement complex polling loops, WebSocket monitoring, and error mapping to handle the proxy's internal states. Our sovereign Nvidia NIM implementation for Wan 2.2 or CogVideoX bypasses this entirely, utilizing a standardized, OpenAI-compatible API spec hosted directly on our EC2 GPU instances.

The NIM API spec for video generation in 2026 typically exposes a `/v1/video/generations` endpoint. Unlike the RunningHub `prompt` -> `history` -> `view` sequence, a NIM request is often a single POST operation that returns a unique `job_id` for asynchronous tracking or a direct stream of the generation metadata. The critical technical hurdle in this migration is the **VRAM-bound bottleneck**. Wan 2.2, utilizing a Mixture-of-Experts (MoE) architecture, requires precise VRAM allocation. While RunningHub hides the GPU tiering behind `/proxy/` and `/proxy-plus/` bifurcations, our sovereign system must explicitly map the `vram_tier_used` in `i2v_client.py` L229 to the correct EC2 instance (e.g., G5 vs. P4d) and ensure the NIM container's TensorRT engines are optimized for the target resolution (1080x1920). Failure to match these parameters results in immediate `CUDA Out of Memory` errors or failed inference, which was previously "absorbed" by the proxy service's retry logic.

## 📂 OUR CODE (100-200 words)

We are refactoring the I2V transport layer while preserving the core motion science.

- `cmf/apps/cmf-assembler/i2v_client.py` line 229:
  ```python
  # i2v_client.py, line 229
  # WHY: Preserving the VRAM tier enforcement is CRITICAL.
  # Previously, this checked for 'proxy-plus' availability.
  # Now, it must point to the P4d/G5 instance's NIM endpoint.
  async def verify_nim_availability(config: NIMConfig) -> tuple[bool, str]:
  ```
- `cmf/apps/cmf-assembler/runninghub_client.py` (29KB): This file is now marked for **DEPRECATION**. We are extracting the `_inject_node_info_list` pattern and moving it into a unified `nim_assembler.py` to handle the standardized JSON payload.

- `cmf/apps/cmf-assembler/pipeline_commander.py` line 378: We must update the cost tracking logic to account for raw GPU-seconds on AWS rather than RunningHub's flat $0.08/clip fee.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> `i2v_client.py` and `runninghub_client.py` are currently tethered to RunningHub. I need to migrate the I2V transport layer to target a sovereign Nvidia NIM endpoint at `http://gpu-worker-01:8000/v1/video/generations`. 
> 1. Create a new `NIMConfig` class in `config.py` that includes `NIM_I2V_ENDPOINT` and `NIM_API_KEY`.
> 2. In `i2v_client.py`, rewrite `_submit_single_i2v_job` to use `httpx.post` against the NIM endpoint.
> 3. Ensure the payload mapping matches the Wan 2.2 schema: `{"prompt": prompt, "image": keyframe_url, "num_frames": 81, "fps": 16}`.
> 4. Preserve the `compute_segments` and `assign_motion_parameters` logic exactly as they are—only the transport layer changes.

## ⌨️ TERMINAL (50-100 words)

```bash
# Test the sovereign NIM I2V endpoint with a sample frame
curl -X POST "http://localhost:8000/v1/video/generations" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Cinematic pan, high quality",
    "image": "https://r2.cmf-assets.com/test-keyframe.jpg",
    "num_frames": 81
  }'
# Expected: {"job_id": "vid-abc-123", "status": "processing"}

# Verify the I2V client unit tests pass with the new NIM transport
pytest tests/test_i2v_client.py -k "test_nim_submission"
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Environmental Shift**: Open `config.py` and add the `NIMConfig` dataclass. Replace `RUNNINGHUB_API_KEY` with your sovereign `NIM_API_KEY` in the `.env` file.
2. **Transport Rewrite**: Open `i2v_client.py`. Locate the `_submit_single_i2v_job` function (L319). Delete the RunningHub-specific `proxy_plus_url` logic.
3. **Payload Mapping**: Use the Agent Prompt from Section 4 to map our `job_config["motion_parameters"]` to the NIM-standardized Wan 2.2/CogVideoX JSON schema.
4. **VRAM Logic Update**: Update `verify_proxy_plus` (L229) to `verify_nim_status`. This function should now perform an OPTIONS or GET /health check on the NIM container.
5. **Cost Recalibration**: Update `pipeline_commander.py` L378 to use the new `COST_PER_GPU_SECOND` constant (derived from G5/P4d spot pricing) for the `DEP-VID-011` metadata.

## ✅ VERIFY (30-50 words)

Run `python -m cmf.apps.cmf-assembler.i2v_client`. If the `I2V_BATCH_SUBMIT` stage returns a valid `job_id` from your local NIM container instead of a RunningHub `prompt_id`, the migration is successful.

## 🔗 BRIDGE (30-50 words)

Unit 2.15 builds on this by introducing Batch Cost Engineering—now that we own the infrastructure, we need to build the monitor that calculates the precise cost of our GPU-seconds to prove our $0.96/video budget is holding.

<!-- FACT-CHECK: "Wan 2.2 NIM container API 2026" → Alibaba Wan 2.2 follows MoE architecture, typically deployed with OpenAI-compatible video endpoints (/v1/video/generations). Standard resolution for high-end I2V is 1080x1920 at 16 or 24 fps. -->
<!-- FACT-CHECK: "Nvidia NIM I2V 2026" → NIM containers use TensorRT-optimized engines, exposing standardized Swagger docs at /docs. Core I2V parameters: prompt, image, duration_frames. -->
