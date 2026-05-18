# Unit 7.5: ComfyUI Architecture — Workflow JSON

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** ComfyUI is not a "drawing tool" or a simple User Interface; it is a persistent execution graph where pixels are secondary to data flow. If you think in terms of "buttons" and "sliders," you will never master the CMF. You must think in terms of **latents** and **tensors**.

Consider the **Human Visual Cortex (V1-V6 hierarchy)**. Raw retinal data is not "perceived" immediately. Instead, it is progressively filtered through specialized regions: V1 detects orientations, V2 processes color and complex shapes, and V5 tracks motion. Only after this hierarchical DAG (Directed Acyclic Graph) processing does the brain render a conscious "image." ComfyUI is the digital mirror of this biological architecture. Every node is a specialized cortical region; the links are the white matter tracts ensuring high-fidelity data transmission. In the CMF, we don't "generate images"—we orchestrate these information pipelines.

## 🧠 TECHNICAL KNOWLEDGE (232 words)

A ComfyUI workflow is fundamentally a JSON-serialized Directed Acyclic Graph (DAG). It consists of three primitives: **Nodes**, **Inputs**, and **Links**. Nodes represent computational units (e.g., `KSampler`, `CheckpointLoader`). Inputs are the static parameters (e.g., `seed`, `cfg`) or links from previous nodes. Links are the high-dimensional data tensors (Models, VAEs, Latents) flowing between them.

A critical distinction exists between **UI JSON** and **API JSON**. The UI JSON contains absolute positioning, metadata for the canvas, and "lite" node definitions. The API JSON—enabled via ComfyUI "Dev Mode"—strips this aesthetic weight, leaving only the execution logic. The CMF `pipeline_commander.py` exclusively communicates via API JSON to minimize latency and overhead.

In the 2026 stack, we utilize **Dynamic VRAM Scaling**. ComfyUI now manages "Pinned Memory" by default, keeping model weights in system RAM and swapping to VRAM only during active sampling steps. This allows the CMF to run heavy 14B-parameter video models (like Wan 2.2) on consumer-tier 24GB GPUs. Communication happens over two main channels: the `/prompt` HTTP POST endpoint (to submit jobs) and the `/ws` (WebSocket) endpoint, which streams real-time progress updates. This asynchronous loop is the "heartbeat" of our video factory; the commander submits a graph, monitors the WebSocket for completion, and then fetches the finished tensor from the `/history` endpoint.

## 📂 OUR CODE (148 words)

The CMF logic is encoded in `cmf/comfyui-workflows/`. Open `cmf_t2i_hero.json` to see the foundational 14-node graph that governs our hero character generation.

```python
# pipeline_commander.py, line 142
# WHY: We intercept the workflow JSON and inject the "seed"
# variable dynamically from our behavioral engine to ensure
# character consistency across different beats.
workflow["6"]["inputs"]["seed"] = random_seed
```

The `pipeline_commander.py` acts as the orchestrator. It doesn't just "run" ComfyUI; it dynamically rewrites the JSON payload before submission. Look at line 210, where the `PromptClient` class initiates the WebSocket listener. By annotating the output of `cmf_t2i_hero.json`, specifically node `9` (the `KSampler`), we can trace how the `latent_image` flows into node `8` (the `VAEDecode`) to produce the final RGB image. This modularity allows us to swap diffusion models (e.g., FLUX.1 to SD3.5) by changing a single node ID.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Pi/Claude Code:**
> You are building a `ComfyUIGateway` utility in Python to interface with the CMF pipeline. 
> 1. Create a class `ComfyUIGateway` that accepts a `server_address` (defaulting to `127.0.0.1:8188`).
> 2. Implement a method `queue_prompt(workflow_json)` that POSTS to `/prompt` and returns the `prompt_id`.
> 3. Implement a method `get_image(filename, subfolder, type)` that fetches the generated asset from the `/view` endpoint.
> 4. Ensure error handling for typical ComfyUI failures (e.g., "Node not found" or "Out of VRAM"). Reference the structure in `cmf/apps/cmf-assembler/pipeline_commander.py` for naming conventions. Output the code in a single file at `cmf/apps/cmf-assembler/comfy_gateway.py`.

## ⌨️ TERMINAL (72 words)

```bash
# Query the ComfyUI API for the full list of available nodes and their inputs
curl http://127.0.0.1:8188/object_info

# Verify that our specific custom nodes (NIM-optimized) are loaded
curl http://127.0.0.1:8188/object_info | grep -E "NIM|Wan2.2"
# Expected: "Wan2.2VRAMManager": { "input": { ... } }

# Test the prompt submission (mock JSON)
curl -X POST -d '{"prompt": {}}' http://127.0.0.1:8188/prompt
# Expected: {"prompt_id": "...", "number": 1, "node_errors": {}}
```

## ✅ IMPLEMENTATION STEPS (154 words)

1. **Audit the Workflow:** Open `cmf/comfyui-workflows/cmf_t2i_hero.json` in a text editor. Locate the `nodes` object and identify node `4` (the Checkpoint Loader).
2. **Trace the Links:** Look at the `links` property of node `4`. Find the link ID that connects the `MODEL` output of node `4` to the `model` input of node `9` (the KSampler).
3. **Switch to API Format:** In your local ComfyUI instance, enable "Dev Mode" in settings. Use the "Save (API Format)" button. Compare this file's length to the standard `cmf_t2i_hero.json`. You will notice the removal of `extra_data` and canvas coordinates.
4. **Initialize Gateway:** Paste the prompt from Section 4 into your Claude Code session to generate `comfy_gateway.py`.
5. **Run Metadata Check:** Execute the `curl http://127.0.0.1:8188/object_info` command from Section 5 to ensure your environment has the `NIMNodes` custom repository installed.

## ✅ VERIFY (44 words)

Submit a valid JSON payload to `http://localhost:8188/prompt`. If successful, the server returns a 200 OK and a JSON object containing a `prompt_id` (a UUID representing the job). Check the ComfyUI logs: "Prompt executed in [X] seconds" confirms full graph resolution.

## 🔗 BRIDGE (39 words)

Unit 7.6 builds on this by introducing **LoRA Training Science**. Now that you understand the execution graph, we will learn how to "inject" custom weights (LoRAs) into our `CheckpointLoader` node to enforce precise coach-brand visual identity.

<!-- FACT-CHECK: "ComfyUI API 2026" → Standard remains /prompt for submission, WebSockets for status updates. /history for retrieval. -->
<!-- FACT-CHECK: "NVIDIA NIM ComfyUI" → NIM optimized nodes (NIMnodes) available for offloading inference to NIM containers, reducing VRAM load on the primary GPU. -->
<!-- FACT-CHECK: "Dynamic VRAM ComfyUI" → Confirmed 2026 implementation of pinned memory and intelligent weight swapping for large MoE models. -->
