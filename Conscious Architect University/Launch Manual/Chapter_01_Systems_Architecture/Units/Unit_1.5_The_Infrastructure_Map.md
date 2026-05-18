# Unit 1.5: The Infrastructure Map

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Infrastructure is not a "hosting cost" or a background detail. It is the physical substrate of consciousness. In the human brain, the "grey matter" performs the compute, but the "white matter" — the colossal network of myelinated axons — provides the infrastructure that enables information to travel between regions. Without the white matter, the brain is a collection of isolated, useless islands.

In the CCP, our infrastructure (AWS, NIM, Neo4j) is the white matter. We adhere to the **Sovereignty Principle**: we do not rent logic from proprietary SaaS providers (like ElevenLabs or OpenAI) because doing so surrenders our "neural pathways" to a third party who can sever them at any moment. By deploying our own NVIDIA NIM containers on AWS, we own the physical substrate of our agents' intelligence. This unit maps that substrate, distinguishing between the "always-on" persistence of our databases and the "on-demand" batch compute of our GPU inference layers.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The CCP/CMF operational architecture is a hybrid of three distinct persistence and compute tiers:

1.  **The Persistent State Layer (Always-On):** Supabase (PostgreSQL) and Neo4j (Graph) run 24/7. Supabase handles relational data (coach configs, check-in schedules, billing), while Neo4j stores the high-dimensional hypergraph of client psychology. These are "low-compute, high-availability" services.
2.  **The Interface Layer (Always-On):** The AFFiNE Dashboard and the Video Editor (Next.js) are persistently accessible via URL. They provide the "Command & Control" interface for the coach.
3.  **The Batch Compute Layer (On-Demand):** This is the high-cost tier. In early 2026, the "Inference Famine" has driven GPU costs to peak levels. To survive, the CMF operates on a **Spot-Native Architecture**. We do not run persistent A100/H200 instances. Instead, we use AWS EC2 Capacity Blocks and Spot Instances that spin up for scheduled weekly batches, process the queue using NVIDIA NIM containers, and terminate immediately upon completion.

NVIDIA NIM is our "Intelligence Hub." We use `flux-1-dev-nim` for visual generation and `f5-tts-nim` for voice synthesis. These containers are optimized for the Blackwell and Hopper architectures prevalent in 2026, providing up to 5x the throughput of raw PyTorch deployments. However, because Spot Instances can be reclaimed with a 2-minute notice, our pipeline code (Unit 1.4) must implement rigorous checkpointing to ensure no render state is lost during an infrastructure interruption.

## 📂 OUR CODE (100-200 words)

Infrastructure is managed through two primary service layers that bridge the gap between deployment and logic:

1.  **Workspace Provisioning:** Open `src/ccp/services/affine_workspace_provisioner.py`. Trace the registration logic starting at line 585.
    ```python
    # affine_workspace_provisioner.py, line 597
    # WHY: Registers the newly provisioned sovereign dashboard URL 
    # directly into the Supabase coach_config table, ensuring 
    # the client interface is mapped to the persistent DB state.
    self.supabase.table("coach_config").update(
        {"affine_workspace_id": workspace_id, "affine_workspace_url": workspace_url}
    ).eq("coach_id", self.coach_id).execute()
    ```
2.  **Failure Gates:** Open `src/ccp/services/failure_prevention_gates.py`. Look at the initialization at line 80.
    ```python
    # failure_prevention_gates.py, line 81
    # WHY: Enforces ADR-01 Coach Isolation at the infrastructure level.
    # Every gate check is strictly scoped to a coach's acronym, 
    # preventing cross-silo data leakage in our multi-tenant AWS environment.
    self.coach_acronym = coach_acronym.upper()
    ```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Pi / Gemini CLI:**
> I am auditing the infrastructure readiness for Unit 1.5 of the CCP. Please perform a structural check on the `cmf/cmf-docker/` directory. 
> 
> 1. List all `Dockerfile` and `docker-compose.yml` files found.
> 2. Verify if there are specific configuration files for NVIDIA NIM containers (e.g., `.env.nim` or `nim_config.yaml`).
> 3. Check `affine_workspace_provisioner.py` and confirm that the Supabase table names match the ones defined in the `MIGRATION_SQL` variable (line 781).
> 
> Report any missing environment variables required for AWS/S3 connectivity.

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify S3 bucket for CMF assets exists and is reachable
aws s3 ls s3://cmf-production-assets --region eu-west-1

# Check for active GPU Capacity Blocks in your region
aws ec2-capacity-block describe-capacity-block-offerings --region us-east-1 \
  --instance-type p5.48xlarge

# Test database connectivity (replace with your Supabase URL)
curl -X GET "https://your-project.supabase.co/rest/v1/coach_config?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
# Expected: 200 OK (even if list is empty)
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

To map your infrastructure for launch, follow these steps:

1.  **Configure AWS CLI:** Ensure your terminal environment is authenticated with a role that has `S3FullAccess` and `EC2DescribeCapacityBlocks` permissions.
2.  **Environment Audit:** Open `cmf/cmf-docker/` and verify the `docker-compose.yml` contains service definitions for both the `cmf-assembler` and the `nim-inference-proxy`.
3.  **Run Migrations:** Execute the `MIGRATION_SQL` found at line 781 of `affine_workspace_provisioner.py` in your Supabase SQL editor. This adds the `affine_workspace_id` columns necessary for the dashboard bridge.
4.  **Connectivity Test:** Run the terminal commands from Section 5 to confirm that your logic (the code) can actually talk to your substrate (the infrastructure).
5.  **NIM Verification:** Visit [build.nvidia.com](https://build.nvidia.com/models) and verify that `FLUX.1` and `F5-TTS` NIM containers are available for your current NVIDIA AI Enterprise license tier.

## ✅ VERIFY (30-50 words)

`aws s3 ls s3://cmf-production-assets` → Bucket exists.
`SELECT affine_workspace_id FROM coach_config` (in SQL Editor) → Column exists.
Pass = Infra is reachable and schema-aligned.

## 🔗 BRIDGE (30-50 words)

With the infrastructure substrate mapped, we have reached the final step of Chapter 01. Unit 1.6: **Gap Analysis — What's Missing** will audit our entire 1100+ file repository against these mental models to identify the exact code gaps we must fill in the coming chapters.

<!-- FACT-CHECK: "NVIDIA NIM FLUX.1 2026 status" → Available as flux-1-dev-nim and flux-1-schnell-nim via NVIDIA AI Enterprise catalog. -->
<!-- FACT-CHECK: "AWS Capacity Blocks 2026 price hike" → Confirmed 15% increase in baseline H200 reservation costs as of April 2026 reviews. -->
<!-- FACT-CHECK: "Neo4j 5.x 2026" → Support for Parallel Runtime and K-Hop query optimizations (up to 1000x speedup) is standard as of 5.15+. -->
