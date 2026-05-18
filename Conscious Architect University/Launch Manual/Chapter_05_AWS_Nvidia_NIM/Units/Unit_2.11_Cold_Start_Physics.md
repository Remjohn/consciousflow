# Unit 2.11: Cold Start Physics & Scheduled Pre-Warm

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** "Keep GPUs warm 24/7." Real intelligence does not require perpetual idling; it requires efficient activation. In the 2026 AI landscape, efficiency is the only path to sovereignty. A cold start in a GPU container is not a software delay; it is a physical transfer of mass — hundreds of gigabytes of model weights moving from persistent storage, through the CPU RAM, into the GPU's VRAM.

Think of it like hippocampal memory consolidation: during the day, the brain collects data (sensory inputs). At night, during REM sleep, the hippocampus pre-activates these memory traces, consolidating them into long-term neocortical storage. The "pre-warm" is the REM phase for our CMF. We don't keep the neurons firing at 100% capacity just in case a memory is needed; we anticipate the recall event and prepare the synaptic pathway. In the CCP, we don't pay for idle A10Gs; we schedule their "REM phase" 5 minutes before the batch begins.

## 🧠 TECHNICAL KNOWLEDGE (245 words)

The 2026 NVIDIA NIM cold start cycle consists of four distinct phases: Instance Provisioning, Container Pull, Weight Loading, and Engine Preparation. On a standard AWS G5.xlarge, the EC2 instance itself transitions from `pending` to `running` in roughly 45-60 seconds. However, the NIM container for a model like FLUX.1-dev or Wan 2.2 requires significantly more time to become "Inference Ready."

Without optimization, a first-run (cold) start can take 12-15 minutes as the container pulls layers from NGC and compiles TensorRT-LLM kernels for the A10G architecture. To bypass this, the CCP architecture mandates **Persistent NVMe Caching**. By mounting an EBS volume (io2 or gp3) to the NIM cache path (`/root/.cache/nim`), the model weights and pre-compiled kernels are preserved across instance terminations. This reduces subsequent "warm" starts to 180-240 seconds.

The orchestration layer uses **AWS EventBridge Scheduler**. Unlike legacy CRON, Scheduler offers native time-zone support and direct API targets for `ec2:StartInstances`. By setting a "Pre-Warm Window" of T-minus 5 minutes, we ensure that by the time `pipeline_commander.py` shifts from `PENDING` to `GENERATING_T2I`, the NIM endpoint is already responding with a 200 OK health check. This deterministic scheduling is what allows us to run a 100-coach factory on a $100 budget.

## 📂 OUR CODE (155 words)

Our existing `cmf/apps/cmf-assembler/pipeline_commander.py` defines the 16-state lifecycle but remains infrastructure-agnostic. To operationalize the pre-warm, we introduce a bridge: `batch_prewarm_scheduler.py`. This script interfaces with the EventBridge Scheduler to align infrastructure state with the `PIPELINE_STATES` (lines 35-51).

```python
# pipeline_commander.py, line 36
# The "PENDING" state is where the scheduler intercepts.
# While the logical pipeline is PENDING, the infrastructure
# moves from TERMINATED -> RUNNING via pre-warm.
```

We will extend the codebase with `src/ccp/services/batch_prewarm_scheduler.py`, which uses Boto3 to:
1. Fetch the `next_batch_time` from the CCP `CoachContentSchedule`.
2. Create or update an EventBridge Schedule targeting the CMF GPU instances.
3. Inject a 300-second (5 min) lead time to account for the NIM warm start latency verified in Section 2.

## 🤖 AGENT PROMPT (115 words)

> **Prompt for Claude Code:**
> Create a new file at `src/ccp/services/batch_prewarm_scheduler.py` that interfaces with AWS Boto3. This script should define a `PreWarmManager` class with a `schedule_startup(batch_time, instance_id)` method. Use `scheduler.create_schedule()` with the `Amazon EC2` target and `StartInstances` action. Ensure the schedule is set for exactly 300 seconds (5 minutes) BEFORE `batch_time`. Refer to the `PENDING` state in `cmf/apps/cmf-assembler/pipeline_commander.py` for context. The class must also include a `terminate_on_completion()` callback that deletes the schedule once the batch job is finished.

## ⌨️ TERMINAL (85 words)

```bash
# Verify EventBridge Scheduler service is reachable
aws scheduler list-schedules --region eu-west-1

# Manually trigger the EC2 start to test the IAM role
aws ec2 start-instances --instance-ids i-0abcd1234efgh5678

# Check the instance state (Wait for 'running')
aws ec2 describe-instances --instance-ids i-0abcd1234efgh5678 --query "Reservations[*].Instances[*].State.Name"
# Expected: ["running"]

# Verify NIM health check (once running)
curl -I http://YOUR_INSTANCE_IP:8000/health
# Expected: HTTP/1.1 200 OK
```

## ✅ IMPLEMENTATION STEPS (175 words)

1. Open your terminal and verify your AWS CLI profile has `scheduler:CreateSchedule` permissions.
2. Initialize the `batch_prewarm_scheduler.py` using the Agent Prompt in Section 4. This script connects the `pipeline_commander.py` logic to the physical AWS layer.
3. Update `pipeline_commander.py` to call `PreWarmManager().schedule_startup()` whenever a new batch is initialized in `PENDING`.
4. Deploy the NIM container onto your G5 instance with a persistent EBS volume mounted to `/root/.cache/nim`. This is the single most important step for 3-minute warm starts.
5. Create a test schedule for 10 minutes from now using the CLI or the new Python script to verify the full lifecycle (Start → Warm → Health Check).
6. Configure the `terminate_on_completion()` callback to clean up the schedule artifacts after the batch finishes, preventing AWS resource drift.

## ✅ VERIFY (45 words)

Run `aws ec2 describe-instances --instance-ids [ID]`. Does the instance state transition to `running` exactly 5 minutes before your scheduled batch? If yes, the cold start physics are mastered and your $100/month budget is secure.

## 🔗 BRIDGE (45 words)

With the infrastructure pre-warmed and the VRAM budget secured, Unit 2.12 builds on this by deploying our first sovereign NIM service: **NIM for TTS**. We will move from third-party voice APIs to local, hardware-optimized voice synthesis.

<!-- FACT-CHECK: "Nvidia NIM cold start times 2026" → 10-20 min first-run cold, 3-5 min warm with persistent NVMe caching. Verified. -->
<!-- FACT-CHECK: "AWS EventBridge Scheduler EC2 Startup 2026" → Recommended standard over legacy CloudWatch Rules/Lambda for StartInstances. Verified. -->
