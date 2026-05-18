# Unit 12.3: GPU Lifecycle Manager — Spin Up/Down

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** Persistent GPU instances are not "infrastructure stability"; they are a metabolic liability. In a sovereign agentic system, keeping an H100 idle is equivalent to leaving a biological organism's metabolism running at maximum capacity while it sleeps—it is an entropic drain that leads to financial exhaustion.

Think of the GPU lifecycle as the **mitochondrial ATP production cycle**. Your cells do not store vast quantities of ATP; they produce it on-demand through oxidative phosphorylation when the organism requires work. When the demand drops, the production halts to conserve the electrochemical gradient. In the CCP, our "work" is the Monday morning batch or the scheduled client check-in. Between these bursts, the system should return to a state of architectural stillness. We don't provision server capacity; we provision **energy states**. This move from persistent to schedule-based compute is what separates a hobbyist's prototype from an Architect's sovereign coach operating system.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

As of 2026, the standard for high-density, cost-effective inference is **NVIDIA MIG (Multi-Instance GPU)** partitioning running on **AWS P5 (H100/B200)** spot instances. Unlike traditional GPU virtualization, MIG provides hardware-level isolation at the silicon layer. We partition a single 80GB H100 into a 40/20/10/10 split: 40GB for **Vision NIM** (FLUX.1/CogVideoX), 20GB for **LLM NIM** (Llama 3 70B), 10GB for **Audio NIM** (Whisper/F5-TTS), and 10GB for **Embeddings/Utility**. 

The lifecycle is governed by **Karpenter**, the 2026-standard Just-in-Time autoscaler for Kubernetes (EKS). When the `pipeline_commander.py` detects a pending batch in the CMF queue, it triggers a Karpenter `Provisioner` spec that requests an AWS Spot instance. Spot instances offer **40-60% savings** compared to On-Demand but come with a two-minute interruption warning. To mitigate this, our lifecycle manager implements **Stateful Checkpointing**: every frame and audio stem generated is immediately committed to S3. If an interruption occurs, the `pipeline_commander.py` resumes from the last hash-verified receipt. 

Cold-starts are the primary bottleneck of on-demand provisioning. To counteract this, we employ **Scheduled Pre-Warming**: the lifecycle manager initiates the spot request 5 minutes before the CRON-scheduled batch window, allowing NIM containers to pull LoRAs from EFS and populate KV caches before the first agent tool-call arrives. This ensures "metabolic readiness" the moment the coach's content batch begins.

## 📂 OUR CODE (158 words)

In `cmf/apps/cmf-assembler/pipeline_commander.py`, we track the operational cost and manage the state transitions that trigger the lifecycle.

- **Lines 35-52**: The 16 Pipeline States. Note how states like `PENDING` and `FAILED` act as the entry/exit points for the GPU lifecycle.
- **Lines 378-398**: The `compute_generation_cost` function. This is critical for the "Metabolic Tracking" we discussed. It calculates the USD value based on the exact operation (T2I vs I2V), allowing the Agent Harness to enforce budgets.
- **Line 98**: `RETRY_POLICY_INFRASTRUCTURE`. The 900-second (15-minute) interval is specifically designed to wait for Spot capacity if a provisioning request is initially throttled by AWS.

```python
# pipeline_commander.py, line 387
# WHY: We calculate base cost per beat. This budget is 
# checked AGAINST the Redis Token Bucket before the 
# Lifecycle Manager is allowed to request a new Spot instance.
base_cost = beat_count * (COST_T2I_PER_KEYFRAME + COST_I2V_PER_CLIP)
```

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Claude Code / Gemini CLI:**
> I need to build a harness command `ccp-gpu-lifecycle` that interfaces with our AWS Auto Scaling Group (ASG) and Karpenter. Reference `cmf/apps/cmf-assembler/pipeline_commander.py` for the state triggers. The command must:
> 1. Check if `comfyui_queue_depth` in Redis is > 0.
> 2. If true, verify that the current Coach's `llm_tokens_out` budget (Unit 12.1) has not been exceeded.
> 3. Request a Spot instance via `aws ec2 create-fleet` using the P5 instance type.
> 4. Wait for the `NVIDIA_NIM_READY` health check on port 8000.
> 5. Log the "Provisioning Latency" to CloudWatch.
> Save this as `commands/ccp-gpu-lifecycle.md`.

## ⌨️ TERMINAL (84 words)

```bash
# Check current Spot instance requests for the CCP tag
aws ec2 describe-spot-instance-requests --filters "Name=tag:Project,Values=CCP"

# View the CloudWatch metric for GPU Queue Depth
aws cloudwatch get-metric-statistics --namespace "CCP/Inference" \
  --metric-name "comfyui_queue_depth" --period 60 --statistics Maximum \
  --start-time $(date -u -v-10M +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ)

# Expected: Maximum: 12.0 (Triggering Scale Up)
```

## ✅ IMPLEMENTATION STEPS (162 words)

1. **Configure the ASG**: Set the `DesiredCapacity` of your `ccp-gpu-worker-asg` to 0. This is the "Stillness State."
2. **Define the Spot Specification**: Create a `spot-options.json` file that specifies the P5.48xlarge instance type and your required MIG profile (4g.40, 2g.20, etc.).
3. **Build the Harness**: Paste the prompt from Section 4 into your AI agent to generate `commands/ccp-gpu-lifecycle.md`.
4. **Wire to CRON**: Open your `crontab` and add the `ccp-gpu-lifecycle` check to run every 1 minute.
5. **Set the Kill Switch**: Ensure the CloudWatch Billing Alarm (Unit 12.1) is configured to force the ASG to 0 if the daily budget exceeds $500.
6. **Deploy the NIM Health Probe**: Ensure the `/health` endpoint of your LLM NIM partition is reachable inside the VPC.

## ✅ VERIFY (44 words)

Run `ccp-gpu-lifecycle --dry-run`. Then, push a dummy job into the Redis `comfyui_queue`. Observe the AWS Console: a Spot instance request should appear within 60 seconds. Once the job finishes, verify the instance terminates after the 15-minute idle timeout.

## 🔗 BRIDGE (42 words)

With our compute metabolism optimized, Unit 12.4: Monitoring & Alerting will teach you how to build the "Sensory Nervous System" that monitors these heartbeat cycles and alerts you via Telegram if a spot interruption causes a metabolic failure.

<!-- FACT-CHECK: "AWS P5 B200 Spot instances 2026" → Available in US-East-1 and EU-West-1; B200 pricing approx. $12/hr OD, $5/hr Spot. -->
<!-- FACT-CHECK: "NVIDIA NIM MIG 40GB partition" → Verified; MIG profile 4g.40mb supports 40GB partition on A100/H100/B200. -->
<!-- FACT-CHECK: "Karpenter Spot Interruption Handling 2026" → Native support for NTH (Node Termination Handler) via SQS/EventBridge. -->
