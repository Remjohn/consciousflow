# Unit 2.6: ECS Container Orchestration

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Amazon Elastic Container Service (ECS) is not just a "Docker runner." ECS is a **Managed State Machine** that strictly enforces your infrastructure's health and configuration over time. While Docker Compose runs simple, static groups of containers, ECS operates as the central nervous system of your sovereign cloud, constantly reconciling your "Desired State" with the "Current Reality" of your hardware.

Think of an ant colony organized by pheromone trails: the queen (the ECS Scheduler) doesn't issue individual commands to every ant (container). Instead, she establishes chemical signals (Task Definitions) that define the behavior and resource requirements of the foragers (NIM microservices). When an ant fails or a trail is broken, the system doesn't panic; it simply re-allocates a new worker to fulfill the specific pheromone signature. In our CMF architecture, ECS ensures that if an NVIDIA NIM container crashes due to a VRAM OOM (Out-of-Memory) error, the orchestrator detects the state failure and immediately provisions a fresh instance, ensuring the batch pipeline remains uninterrupted.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

ECS operates on four fundamental primitives: **Clusters**, **Task Definitions**, **Tasks**, and **Services**. A Cluster is your logical grouping of computing resources—in our case, the G5 and P4d EC2 instances. The Task Definition is the blueprint: it defines which Docker image to pull (e.g., `nvcr.io/nim/meta/llama-3.1-8b-instruct`), how much CPU/Memory to allocate, and critically, its **Resource Requirements**. For NVIDIA NIM, we must explicitly request a GPU type resource; without this, the container will never see the underlying A10G or A100 hardware.

In 2026, we utilize **ECS on EC2** rather than Fargate for our sovereign GPU layer. While Fargate offers serverless simplicity, it lacks the raw GPU pass-through and driver-level control required for NIM's TensorRT optimizations. By running ECS on EC2, we maintain direct access to the NVIDIA Container Toolkit and NVML (NVIDIA Management Library), allowing our agents to monitor real-time VRAM consumption.

Furthermore, we employ **Capacity Providers** to manage our "Batch-Oriented" scaling. Since the CCP is not 24/7, our ECS cluster is configured to scale to zero. When a `ccp-batch` command is triggered, the ECS Scheduler signals the Capacity Provider to launch a Spot Instance, register it to the cluster, and then place the NIM Task. This orchestration prevents us from paying for idle GPU hours, a cornerstone of our cost-engineering mastery.

## 📂 OUR CODE (100-200 words)

The ECS orchestration logic is defined by how we map our local Docker environments to the AWS cloud.

- `cmf/cmf-docker/docker-compose.yml`: This is our local testing mirror. We use this to verify NIM entrypoints before pushing to the AWS Elastic Container Registry (ECR).
- `cmf/apps/cmf-assembler/pipeline_commander.py` line 442: The CMF state machine interacts with the ECS API here to monitor task health before transitioning a project from `QUEUE` to `RENDER`.
- `cmf/apps/cmf-assembler/config.py`: Contains the `ECS_CLUSTER_NAME` and `TASK_DEFINITION_ARN` variables that wire our Python logic to the AWS orchestration layer.

```python
# pipeline_commander.py, line 442
# WHY: We check 'lastStatus' from the ECS task to ensure the NIM 
# container is fully 'RUNNING' and its health check on port 8000 
# is green before sending the first inference request.
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi/Claude Code:**
> Act as an AWS Infrastructure Engineer. I need to create a production-grade ECS Task Definition in JSON format for the `nvidia-nim-flux-dev` container. It should target the `G5.xlarge` instance tier. 
> 
> Requirements:
> 1. Use `awsvpc` network mode.
> 2. Specify 1 GPU in `resourceRequirements`.
> 3. Map container port 8000 to host port 8000.
> 4. Include environment variables for `NGC_API_KEY` (placeholder) and `NIM_CACHE_PATH` at `/opt/nim/cache`.
> 5. Configure a `healthCheck` that runs `curl -f http://localhost:8000/v1/health/ready || exit 1`.
> 6. Use the `awslogs` driver for CloudWatch logging.

## ⌨️ TERMINAL (50-100 words)

```bash
# Create the ECS Cluster for CMF operations
aws ecs create-cluster --cluster-name cmf-gpu-cluster

# Register the NIM Task Definition (assuming you have the JSON from the prompt)
aws ecs register-task-definition --cli-input-json file://nim-task-def.json

# Verify the cluster is active
aws ecs describe-clusters --clusters cmf-gpu-cluster --query "clusters[0].status"
# Expected: "ACTIVE"

# List registered task definitions
aws ecs list-task-definitions --family-prefix nvidia-nim
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Initialize Cluster:** Execute the `aws ecs create-cluster` command to establish the logical boundary for your batch GPU compute.
2.  **Generate Task Blueprint:** Copy the agent prompt from Section 4 into your AI coding assistant to generate the `nim-task-def.json` file.
3.  **Register Definition:** Run the registration command in Section 5 to upload your blueprint to AWS. This does not start a container; it merely stores the "Desired State."
4.  **Audit Codebase:** Open `cmf/apps/cmf-assembler/config.py` and update the `TASK_DEFINITION_ARN` with the value returned from step 3.
5.  **Verify IAM Permissions:** Ensure the ECS Task Role has `s3:PutObject` access for the `cmf-production-assets` bucket you created in Unit 2.3.
6.  **Simulate Deployment:** Manually run a task using `aws ecs run-task --cluster cmf-gpu-cluster --task-definition [ARN]` to verify the NIM container successfully initializes on a G5 instance.

## ✅ VERIFY (30-50 words)

`aws ecs list-tasks --cluster cmf-gpu-cluster` → returns at least one Task ARN with a `lastStatus` of `RUNNING`. This proves your orchestration logic can successfully provision and monitor a live NIM container on AWS.

## 🔗 BRIDGE (30-50 words)

Unit 2.7 builds on this orchestration mastery by introducing **AWS CLI Mastery**—the advanced terminal techniques required to chain these commands into the automated deployment scripts that power our sovereign automation engine.

<!-- FACT-CHECK: "AWS ECS GPU support 2026" → Confirmed. ECS on EC2 remains the mandatory path for GPU pass-through, while Fargate remains CPU-only or restricted to Inferentia/Trainium. -->
<!-- FACT-CHECK: "NVIDIA NIM Health Check" → Standard endpoint /v1/health/ready verified on build.nvidia.com documentation. -->
