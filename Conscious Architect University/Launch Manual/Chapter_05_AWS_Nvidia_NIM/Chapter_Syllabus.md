# Chapter 02: AWS Foundations + Nvidia NIM (Sovereign Infrastructure)

**Chapter Goal:** Deploy a sovereign GPU infrastructure on AWS with Nvidia NIM containers running ComfyUI, TTS, and I2V — replacing all third-party rental services
**Mastery Track:** CCP System Architect + Agentic Engineer
**Launch Track:** AWS account configured, S3 buckets live, NIM containers deployed, ComfyUI + MOSS-TTS + I2V running on YOUR hardware
**Prerequisites:** Chapter 1 (Systems Architecture)
**Estimated Time:** 20-25 hours

---

## CCP/CMF Reality Anchor

Every GPU-intensive operation in the CMF — image generation, video synthesis, voice cloning, audio transcription — currently runs through third-party proxied services (RunningHub, external ComfyUI). This is a sovereignty failure: someone else controls your uptime, your pricing, and your model versions. This chapter replaces ALL external GPU dependencies with Nvidia NIM containers on AWS EC2 GPU instances. **Critically, GPU instances are NOT persistent.** They spin up on schedule (weekly content batch, daily voice tracking), process the batch, and terminate. Only dashboards and databases are always-on. This batch-oriented GPU model is the difference between $21,600/month (always-on) and ~$100/month (batch spot).

---

## Codebase Map

| File | Location | Size | Status |
|------|----------|------|--------|
| `i2v_client.py` | `cmf/apps/cmf-assembler/` | 21KB | ✅ EXISTS — proxies through RunningHub, must be migrated to NIM |
| `runninghub_client.py` | `cmf/apps/cmf-assembler/` | 29KB | ✅ EXISTS — RunningHub dependency, must be REPLACED |
| `pipeline_commander.py` | `cmf/apps/cmf-assembler/` | 24KB | ✅ EXISTS — cost tracking at line 378, GPU scheduling |
| `audio_engine.py` | `cmf/apps/cmf-assembler/` | 25KB | ✅ EXISTS — Whisper STT, Demucs source separation |
| `t2i_quality_gate.py` | `cmf/apps/cmf-assembler/` | 19KB | ✅ EXISTS — CLIP scoring for T2I output |
| `voice_dna_pipeline.py` | `src/ccp/pipelines/` | 28KB | ✅ EXISTS — TTS integration, must migrate to NIM TTS |
| `circuit_breaker.py` | `src/ccp/services/` | — | ⚠️ VERIFY — cold start protection |
| `config.py` | `cmf/apps/cmf-assembler/` | 2KB | ✅ EXISTS — environment config |
| `cmf-docker/` | `cmf/` | directory | ✅ EXISTS — Docker configs for ComfyUI |
| `comfyui-workflows/` | `cmf/` | 15 JSON files | ✅ EXISTS — all 15 ComfyUI workflow definitions |
| `download_all_models.sh` | `cmf/` | 3KB | ✅ EXISTS — model download script |

**Files referenced: 11** ✅ (exceeds 5-file minimum)

---

## Fact-Check Registry

| Technology | Search Source | 2026 Finding |
|------------|--------------|-------------|
| AWS EC2 GPU instances | AWS docs | P4d (A100 80GB), P5 (H100 80GB), G5 (A10G 24GB), G6 (L4 24GB). Spot savings up to 90%. Capacity Blocks available |
| Nvidia NIM containers | build.nvidia.com | NIM containers available for LLMs, T2I (FLUX), vision models. Self-hosted via NGC with `nvcr.io` registry. Free tier up to 16 GPUs |
| NIM + ComfyUI integration | Web search | ComfyUI connects to NIM via API nodes (NIMnodes). NIM deploys as separate container, ComfyUI calls it over HTTP at `localhost:8000` |
| Whisper large-v3-turbo | HuggingFace | `openai/whisper-large-v3-turbo` — MIT license, word-level timestamps, available on HF |
| FLUX.2 T2I | HuggingFace | FLUX.2 series (Dev, Pro, Flex, Klein). FLUX.1-dev still widely used. Exceptional photorealism + text rendering |
| Wan 2.2 / CogVideoX I2V | HuggingFace | Wan 2.2 (MoE architecture, top performer), CogVideoX-5B (mature ecosystem, LoRA support), HunyuanVideo (13B, cinematic) |
| MOSS-TTS / F5-TTS / Kokoro | HuggingFace | MOSS-TTS: production-grade family for complex apps. F5-TTS: best voice cloning. Kokoro-82M: fastest/lightest (CPU viable) |
| Demucs source separation | HuggingFace | `facebook/demucs` — MIT license, 4-stem separation (vocals, drums, bass, other) |

---

## Open-Source Model Registry

| Task | Model | License | NIM Available? | HuggingFace Link |
|------|-------|---------|---------------|------------------|
| T2I | FLUX.2-dev / FLUX.1-dev | Open weights | ✅ (via NIM blueprint) | `black-forest-labs/FLUX.1-dev` |
| I2V | Wan 2.2 | Apache 2.0 | ✅ | `Wan-AI/Wan2.2-T2V-14B` |
| I2V (fallback) | CogVideoX-5B | Apache 2.0 | ✅ | `THUDM/CogVideoX-5b` |
| TTS (voice cloning) | F5-TTS | MIT | ⚠️ Self-hosted | `SWivid/F5-TTS` |
| TTS (production) | MOSS-TTS family | Apache 2.0 | ⚠️ Self-hosted | `mosi-ai/MOSS-TTS` |
| TTS (lightweight) | Kokoro-82M | Apache 2.0 | ⚠️ Self-hosted | `hexgrad/Kokoro-82M` |
| STT | Whisper large-v3-turbo | MIT | ✅ (via NIM) | `openai/whisper-large-v3-turbo` |
| Source Separation | Demucs | MIT | ⚠️ Self-hosted | `facebook/demucs` |

**Proprietary services PROHIBITED:** ElevenLabs ❌, RunPod ❌, Midjourney ❌

---

## Science Sources

| Source | Location | Type |
|--------|----------|------|
| `AWS Certified Cloud Practitioner Slides v2.11.0.md` | workspace root | AWS certification guide |
| `ultimate-aws-certified-cloud-practitioners-exam-guide...md` | workspace root | AWS exam guide |
| `NVIDIA-Certified Associate AI Infrastructure and Operations (NCA AIIO) Free Study Course.md` | workspace root | NVIDIA certification |
| `[Webinar] Custom iClone to AI Image Workflow_ Set Up Flux 1 Dev on Cloud GPU.md` | workspace root | FLUX deployment tutorial |
| `Infrastructure_AWS_NIM_Deployment_Spec.md` (35KB) | `docs/architecture/` | Our deployment spec |
| `How to Train a FLUX.2 LoRA with AI Toolkit.md` (33KB) | `lab/LoRa papers/` | FLUX LoRA training |

---

## Unit Map

### Section A: AWS Foundations (Units 2.1-2.7)

| Unit | Title | 🧠 Science Topic | UNLEARN | 📂 Code Files | Build Target | Verify |
|------|-------|-------------------|---------|---------------|-------------|--------|
| 2.1 | Cloud Computing First Principles | What AWS is: API-driven infrastructure. Regions, AZs, shared responsibility. The sovereignty principle — own the compute contract | "AWS is just a server in the cloud." False — it's 200+ programmable services accessible via API. You're not renting a machine — you're programming infrastructure | AWS docs reference | — | Can you explain the shared responsibility model in one sentence? |
| 2.2 | IAM & Least-Privilege Security | Users, roles, policies, service roles. The identity layer that protects everything. EC2 role → S3 access chain | "One admin account is fine." False — a single compromised root account = total infrastructure loss. Least-privilege = each service gets ONLY the permissions it needs | — | ⌨️ Create IAM user, service role, scoped policy | `aws sts get-caller-identity` → returns your IAM user ARN |
| 2.3 | S3 Object Storage — CMF Asset Layer | Buckets, keys (not folders), presigned URLs, lifecycle policies, CORS. Where ALL CMF assets live | "S3 has folders." False — S3 is a flat key-value store. Slashes in keys are cosmetic | `pipeline_commander.py` L312, `api-client.ts` L87 | ⌨️ Create S3 bucket, configure CORS, upload test file | `aws s3 ls s3://cmf-production-assets/` → lists objects |
| 2.4 | VPC & Networking | Subnets (public/private), security groups, NAT gateways. How GPU instances communicate securely without exposing ports | "Just open all ports." False — public GPU instances get crypto-mined within hours. Security groups = firewall rules per-port per-source | — | ⌨️ Create VPC, public+private subnets, security group for SSH only | `aws ec2 describe-vpcs` → shows your VPC |
| 2.5 | EC2 Compute — Raw GPU Machines | Instance types, AMIs, key pairs, SSH. The raw machine that runs your NIM containers | "All instances are the same." False — GPU instances (P4d, G5) cost 10-100x more than CPU instances. Wrong instance = wasted budget or failed inference | — | ⌨️ Launch G5.xlarge, SSH in, run `nvidia-smi` | SSH into instance → `nvidia-smi` shows A10G GPU |
| 2.6 | ECS Container Orchestration | Task definitions, services, Fargate vs EC2 launch type. How Docker containers become managed production services | "Docker Compose is enough for production." False — Docker Compose has no auto-restart, no health checks, no scaling. ECS adds the production reliability layer | `cmf-docker/` | ⌨️ Create ECS cluster, register task definition | `aws ecs list-clusters` → shows your cluster |
| 2.7 | AWS CLI Mastery | Profiles, regions, output formats, `--query` for JMESPath filtering. The terminal IS your cloud console | "The AWS web console is easier." False — the console is Maya (illusion). The CLI is the mathematical grid — deterministic, scriptable, automatable | — | ⌨️ CLI workflow: create → describe → modify → delete | Chain 3 CLI commands that create, list, and delete an S3 bucket |

### Section B: Nvidia NIM on AWS (Units 2.8-2.15)

| Unit | Title | 🧠 Science Topic | UNLEARN | 📂 Code Files | Build Target | Verify |
|------|-------|-------------------|---------|---------------|-------------|--------|
| 2.8 | What is Nvidia NIM | Containerized AI inference microservices. NGC catalog, NIM API spec (OpenAI-compatible). NIM vs raw Docker: pre-optimized TensorRT engines | "NIM is just Docker." False — NIM containers include TensorRT-optimized inference engines, curated model weights, and standardized API endpoints. Raw Docker gives you none of this | `build.nvidia.com/models` reference | — | Can you explain the 3 things NIM adds on top of Docker? |
| 2.9 | GPU Compute Physics | CUDA cores vs Tensor cores. VRAM budgets (why 24GB fails for I2V but works for T2I). Memory bandwidth bottleneck | "More GPU = faster." False — inference is VRAM-bound, not compute-bound. A model that needs 48GB VRAM will crash on a 24GB GPU regardless of CUDA core count | `i2v_client.py` L229 — VRAM tier enforcement | — | Calculate VRAM needed for: FLUX.1-dev, CogVideoX-5B, Whisper-v3-turbo |
| 2.10 | AWS GPU Tier Map | P4d (A100 80GB), P5 (H100 80GB), G5 (A10G 24GB), G6 (L4 24GB). Pricing, spot vs on-demand. Which tier for which CMF task | "Just pick the biggest GPU." False — G5 (A10G) handles T2I at $1.01/hr. P4d (A100) handles I2V at $32.77/hr. Wrong tier = 32x cost explosion | — | ⌨️ `aws ec2 describe-instance-types` filtered for NVIDIA | Table: map each CMF task (T2I, I2V, TTS, STT) to correct GPU tier |
| 2.11 | Cold Start Physics & Scheduled Pre-Warm | Why GPU containers take 15-20s to warm (model weight loading). Scheduled pre-warm: CRON triggers instance startup 5 min before batch. NOT always-on keep-warm — batch-oriented | "Keep GPUs warm 24/7." False — scheduled pre-warm starts the instance 5 min before a batch run, loads model weights, then processes the batch. After batch completion, the instance terminates. No $30/hr idle costs | `pipeline_commander.py` — scheduling logic | 🤖 Build `batch_prewarm_scheduler.py` | CRON triggers → instance starts → health check passes → batch runs → instance terminates |
| 2.12 | NIM for TTS — Deploying Voice | Deploy MOSS-TTS/F5-TTS/Kokoro as a containerized service on EC2. API endpoint for voice cloning and synthesis | "Use ElevenLabs API." PROHIBITED — sovereign infrastructure means YOUR model, YOUR container, YOUR GPU | `voice_dna_pipeline.py` — TTS integration points | 🤖 NIM TTS container deployed on G5 | `curl TTS_ENDPOINT/synthesize -d '{"text":"test"}'` → returns audio |
| 2.13 | NIM for ComfyUI — Visual Factory | Deploy ComfyUI + FLUX + your 15 workflows on NIM-connected EC2. NIMnodes for API bridging | "ComfyUI needs a desktop GPU." False — ComfyUI runs headless in Docker. NIM provides the optimized inference backend. Your 15 existing workflow JSONs work unchanged | `cmf-docker/`, `comfyui-workflows/*.json` (all 15), `download_all_models.sh` | 🤖 ComfyUI + NIM deployed, all 15 workflows tested | Submit workflow JSON via API → generated image returned in S3 |
| 2.14 | Migrating from RunningHub | Rewrite the I2V client: remove RunningHub proxy, point to your NIM-hosted Wan 2.2/CogVideoX endpoint. Preserve the VRAM tier fallback logic | "Just change the URL." False — the RunningHub client has 29KB of proxy-specific logic (polling, status tracking, error mapping) that must be restructured for NIM's streaming API | `i2v_client.py` (21KB), `runninghub_client.py` (29KB) | 🤖 NIM I2V client replaces RunningHub | Generate a 4-second I2V clip via NIM endpoint → video in S3 |
| 2.15 | Batch Cost Engineering & Spot Pricing | GPU-seconds per batch (not per hour). Weekly content batch cost: ~$3-8 (spot G5 × 2-3 hours). Daily voice tracking: ~$0.10/client/day. Per-video cost: $0.96. Spot vs on-demand savings. Why batch + spot = 200x cheaper than always-on | "GPU costs are unpredictable." False — batch cost = (spot price × batch duration × instances). Weekly batch on G5 spot: ~$3. Monthly for 100 coaches: ~$100. NOT $21,600 (always-on). The pipeline commander tracks cost per state at L378 | `pipeline_commander.py` L378 — cost tracking | Configure AWS Budget alert + batch cost calculator | `aws ce get-cost-and-usage` → shows batch-level GPU spend. Calculator matches actual |

---

## Key Unit Elaborations

**Unit 2.13 (NIM for ComfyUI):** This is the most complex build. The student deploys ComfyUI as a Docker service, connects it to a FLUX NIM container via NIMnodes, loads all 15 existing workflow JSONs, and runs `download_all_models.sh` to pull models. The existing `cmf-docker/` directory has partial configs that need extension for NIM integration.

**Unit 2.14 (RunningHub Migration):** The `runninghub_client.py` (29KB) and `i2v_client.py` (21KB) contain RunningHub-specific polling logic, status mapping, and error handling. The migration preserves the VRAM tier enforcement logic at `i2v_client.py` L229 but restructures the HTTP transport layer for NIM's streaming API.

---

## Quality Gates — Self-Verification

- [x] **Unit Count Gate:** 15 units ✅ (between 4-15)
- [x] **Causal Chain Gate:** AWS foundations → NIM theory → NIM deployment → migration ✅
- [x] **UNLEARN Gate:** Every unit has a contrastive statement ✅
- [x] **Code Mapping Gate:** All files named with exact paths ✅
- [x] **Build Frequency Gate:** Section A has build targets in 2.2-2.7, Section B in 2.11-2.14 ✅
- [x] **Verify Gate:** Every unit has binary observable ✅
- [x] **5-File Gate:** 11 files referenced ✅
- [x] **Fact-Check Gate:** 8 technologies web-searched ✅
- [x] **Open-Source Gate:** 8 open-source models, zero proprietary ✅
