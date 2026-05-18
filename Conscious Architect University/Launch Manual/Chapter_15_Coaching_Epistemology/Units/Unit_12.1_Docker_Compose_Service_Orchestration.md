# Unit 12.1: Docker Compose — Service Orchestration

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Docker Compose is not a "convenience script" for running multiple local containers; it is the production conductor of your sovereign infrastructure. In development, you might run services manually to debug specific logic, but in production, manual execution is a single point of failure that destroys reproducibility.

Think of the human endocrine system: its various glands (thyroid, adrenals, pancreas) are physically isolated organs, yet they function as a single, coordinated orchestration layer. They communicate via hormonal signaling (labels/networks) and respond to internal feedback loops (health checks). If one gland fails, the system doesn't just stop; it attempts to rebalance (restart policies). 

In the CCP/CMF architecture, Docker Compose acts as this systemic regulator. It ensures that your persistent dashboards, your model-hosting NIM microservices, and your agentic batch processors are wired together in a resilient, isolated, and highly deterministic network. This is the difference between a collection of scripts and a shipping platform.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The modern Compose Specification (evolved from V2 into the 2026 standard) provides the formal schema for defining multi-container applications. For the CCP, we move beyond simple port mapping into high-fidelity orchestration primitives that govern how our agentic services interact at the hardware and network layers.

First, we enforce **Network Isolation** via named internal bridges. By defining a dedicated `ccp-bridge`, we ensure that internal database traffic (Postgres, Neo4j, Redis) and inference requests never touch the public internet. Only the Application Load Balancer and the Next.js Editor frontend are permitted ingress. This "air-gapped" logic is critical for maintaining the data sovereignty of sensitive client psychological profiles.

Second, we implement **GPU Resource Reservations**. Utilizing the NVIDIA Container Toolkit, we use the `deploy.resources.reservations.devices` block to map physical MIG partitions to specific NIM containers. This prevents VRAM contention between the LLM Partition (20GB) and the Vision Partition (40GB). By pinning `device_ids` rather than using a generic `count`, we guarantee that a heavy FLUX 2 Dev generation batch cannot starve the Whisper transcription service of compute cycles.

Third, we employ **Production Health Checks** and lifecycle management. Because LLM and Vision models require substantial "warm-up" time to load weights from EFS into VRAM, we define `healthcheck` blocks using `test: ["CMD", "curl", "-f", "http://localhost:8000/health"]`. When paired with `depends_on: { condition: service_healthy }`, we ensure our API layer doesn't start processing agent tool calls until the backend inference servers are functionally ready. Finally, we set `stop_grace_period: 1m` to allow running batches to finalize their Receipt Chain commits before the container terminates, preventing state corruption.

## 📂 OUR CODE (100-200 words)

We are mapping the architecture to the `cmf/cmf-docker/` directory, which houses our service-specific logic. The core build target for this unit is the production `docker-compose.yml` located in the workspace root.

```yaml
# docker-compose.yml, line 45
# WHY: We reserve exactly 40GB of VRAM for the Vision NIM to
# accommodate FLUX + ControlNet + LoRA without VRAM fragmentation.
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          device_ids: ['0']
          capabilities: [gpu]

# docker-compose.yml, line 82
# WHY: The 'depends_on' condition 'service_healthy' prevents the 
# API from starting until the LLM NIM is fully loaded and ready.
depends_on:
  llm-nim:
    condition: service_healthy
```

- `cmf/cmf-docker/Dockerfile`: The blueprint for our custom agent environment.
- `cmf/cmf-docker/start.sh`: The entrypoint script that handles environment variable injection and pre-flight connectivity checks before the service starts.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Pi:**
> I need to build the production `docker-compose.yml` for the CCP/CMF stack.
> 1. Create a `docker-compose.yml` in the root directory.
> 2. Include services for: `vision-nim` (MIG partition 0, 40GB), `llm-nim` (MIG partition 1, 20GB), `postgres` (internal), `redis` (internal), and `ccp-api` (depends on nims).
> 3. Use the `NVIDIA Container Toolkit` specification for GPU reservations.
> 4. Implement `healthcheck` blocks for all NIM services using their `/health` endpoints.
> 5. Create a new command harness at `commands/ccp-deploy.md` that runs `docker compose up -d --build`, followed by a 60-second wait and a `docker compose ps` health verification. 
> 6. Reference the existing `Dockerfile` in `cmf/cmf-docker/` for the `ccp-api` service.

## ⌨️ TERMINAL (50-100 words)

```bash
# Pull the latest NVIDIA NIM containers (requires enterprise login)
docker login nvcr.io
docker pull nvcr.io/nvidia/nim/flux-1-dev-nim:latest

# Deploy the entire stack in detached production mode
docker compose up -d --build

# Monitor the health status of the orchestrated services
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"
# Expected: ccp-api Up (healthy), vision-nim Up (healthy)

# View real-time logs for the API orchestrator
docker compose logs -f ccp-api
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. **Verify NIM Access:** Ensure you are logged into `nvcr.io` and have permission to pull the enterprise containers for FLUX and Llama 3.
2. **Build the Compose File:** Paste the prompt from Section 4 into your AI agent to generate the production `docker-compose.yml`. Ensure the `device_ids` match your AWS p4d/p5 instance MIG partition IDs.
3. **Configure Environment:** Create a `.env` file in the root directory. Populate it with `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `POSTGRES_PASSWORD`.
4. **Deploy the Harness:** Create the `commands/ccp-deploy.md` file. This command will serve as your one-touch production deployment trigger.
5. **Execute Go-Live Orchestration:** Run the `ccp-deploy` command via your Pi coding agent.
6. **Persistence Check:** Verify that the Postgres and Redis volumes are correctly mapped to `./data/postgres` and `./data/redis` respectively to ensure data survives container restarts.

## ✅ VERIFY (30-50 words)

Run `docker compose ps`. Every service in the list must report `Up` and `healthy`. Execute `curl http://localhost:8000/api/health` from the host terminal; it must return a `200 OK` status within 2 seconds.

## 🔗 BRIDGE (30-50 words)

Unit 12.2 builds on this deployment by introducing the **CRON Scheduling — The Batch Clock**. Now that your services are orchestrated and healthy, we will configure the temporal triggers that drive the weekly coach content generation and daily client accountability loops.

<!-- FACT-CHECK: "Docker Compose V4 2026" → Research confirms Docker Compose V2 remains the standard under the Compose Specification as of April 2026; no V4 exists. Reference V2026/V2. -->
<!-- FACT-CHECK: "NVIDIA Container Toolkit 2026" → deploy.resources.reservations.devices remains the standard for GPU mapping in Compose files. -->
