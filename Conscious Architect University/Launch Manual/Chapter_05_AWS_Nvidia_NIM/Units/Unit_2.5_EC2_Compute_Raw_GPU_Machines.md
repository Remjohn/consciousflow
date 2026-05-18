# Unit 2.5: EC2 Compute — Raw GPU Machines

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** AWS is just a "server in the cloud." This belief is a fundamental barrier to system architect mastery. In reality, AWS is a collection of 200+ programmable APIs that manage the materialization of infrastructure. You are not "renting a machine"; you are writing a compute contract.

Think of it like **myelination** in the human nervous system. Myelin is the insulating layer that forms around nerves, allowing electrical impulses to transmit quickly and efficiently along the nerve cells. In our CCP architecture, the EC2 GPU instance is the myelin. Without it, the agentic signals—the scripts, the logic, the intent—move too slowly to be viable. We move from the "unmyelinated" drag of third-party API latency to the high-speed "myelinated" propagation of sovereign on-disk compute. By owning the GPU, we ensure that every cinematic "thought" is rendered at the hardware's maximum theoretical limit, bypassing the shared-resource congestion of the rental world. We bridge the gap between abstract instruction and physical reality.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

NVIDIA GPU instances on AWS (G6 and G5 families) are the primary engines for the CCP. While standard CPU instances (like the t3 class) process data sequentially through General Purpose cores, GPUs utilize thousands of **CUDA cores** and specialized **Tensor Cores** to process matrices in parallel. For Generative AI, the Tensor Core is the critical primitive, specifically designed for the high-speed matrix multiplication required by Large Language Models and Diffusion pipelines.

The 2026 production standard for AI inference is the **G6 family**, featuring the **NVIDIA L4 GPU**. The L4 provides 24GB of high-bandwidth VRAM, which is the "threshold of viability" for our CMF. In the world of model weights, VRAM (Video RAM) is more important than raw compute speed. A model like FLUX.1 (T2I) or Wan 2.2 (I2V) requires its entire weights collection to be loaded into VRAM for low-latency inference. If a model requires 30GB of VRAM and you only provide 24GB, the system will fail (OOM - Out of Memory). NIM containers optimize this by using **TensorRT-LLM engines**, which quantize these weights into 4-bit or 8-bit formats, allowing a 30GB model to fit comfortably into the L4’s 24GB footprint.

Understanding the **Spot Instance** market is the difference between profit and bankruptcy. Spot instances allow you to bid on unused AWS capacity for up to 70-90% savings. Because our CCP operates on a **batch-oriented schedule** (Chapter 12), we don't need "Always-On" GPUs. We request a Spot G6 instance, process our 10-video weekly batch in 2 hours, and terminate.

## 📂 OUR CODE (100-200 words)

Our existing configuration in `cmf/apps/cmf-assembler/config.py` is currently hard-wired for the RunningHub proxy layer. At line 35, the `vram_tier` is set to a default of "48GB", assuming third-party availability.

```python
# config.py, line 35
# WHY: This tier currently assumes we are renting a 48GB A6000 
# from RunningHub. In this unit, we prepare the ground to 
# swap this for our own G6 (24GB) or G6e (48GB) instances.
vram_tier = os.environ.get("RUNNINGHUB_VRAM_TIER", "48GB")
```

Furthermore, in `cmf/apps/cmf-assembler/pipeline_commander.py` (line 378+), we track the cost of generation based on fixed logical rates.

```python
# pipeline_commander.py, line 387
# WHY: These costs ($0.02, $0.06) are based on third-party pricing. 
# Once our EC2 G6 instances are live, we will update these to 
# reflect our actual G6 Spot hourly rate divided by batch duration.
base_cost = beat_count * (COST_T2I_PER_KEYFRAME + COST_I2V_PER_CLIP)
```

`⚠️ BUILD REQUIRED — src/ccp/services/cloud_compute_driver.py`: Currently, our system lacks a direct driver to programmatically spin up EC2 instances from a Python hook. We will build this in Course 05 to automate the batch schedule described in Chapter 12.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi/Claude Code/Gemini CLI:**
> Use the AWS CLI to launch a single `g6.xlarge` instance in the `us-east-1` region. Use the "NVIDIA Deep Learning AMI (Ubuntu 22.04)" as the base. Configure the instance with a 100GB gp3 root volume. Assign the IAM Role created in Unit 2.2 (`CCPInfrastructureRole`) to the instance. Ensure the instance is launched as a **Spot Instance** with a maximum price set to the current on-demand rate. Return the exact `aws ec2 run-instances` command with all necessary flags for a one-click deployment. After the instance is launched, provide the command to SSH into it using the `ccp-keypair` created earlier.

## ⌨️ TERMINAL (50-100 words)

```bash
# Launch the G6 GPU instance (Spot)
aws ec2 run-instances --image-id ami-0123456789abcdef0 --count 1 \
  --instance-type g6.xlarge --key-name ccp-keypair --region us-east-1 \
  --instance-market-options '{"MarketType":"spot"}' \
  --iam-instance-profile Name=CCPInfrastructureRole \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":100,"VolumeType":"gp3"}}]'

# Get the Public IP
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].PublicIpAddress" --output text

# Connect to the instance
ssh -i ccp-keypair.pem ubuntu@<PUBLIC_IP>

# Verify GPU availability
nvidia-smi
# Expected: NVIDIA-SMI 5XX.XX ... Tesla L4 ... 24576MiB
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Select AMI:** Log into the AWS Console and search for "NVIDIA Deep Learning AMI". Note the Image ID (AMI ID) for your region (e.g., `us-east-1`).
2.  **Verify IAM Role:** Ensure the `CCPInfrastructureRole` created in Unit 2.2 has the `AmazonS3FullAccess` and `CloudWatchLogsFullAccess` policies attached.
3.  **Run the Prompt:** Copy the prompt from the section above into your AI agent (Pi or Claude Code) to generate the tailored `run-instances` command.
4.  **Execute Launch:** Paste the generated AWS CLI command into your local terminal.
5.  **Wait for Initialization:** Wait 3-5 minutes for the instance to reach the "Running" state and for status checks to pass and drivers to settle.
6.  **Retrieve Public IP:** Run the `describe-instances` command from the Terminal section to get your instance's IP.
7.  **Connect via SSH:** Use the provided SSH command to log into the remote machine.
8.  **GPU Handshake:** Once logged in, run `nvidia-smi` to confirm that the NVIDIA L4 (G6) hardware is detected and the drivers are functioning properly.

## ✅ VERIFY (30-50 words)

Run `nvidia-smi` on your remote EC2 instance. The command must return a table showing the **NVIDIA L4** (for G6) or **A10G** (for G5) GPU with roughly **24GB** of VRAM available. If the table appears correctly, the GPU compute layer is active.

## 🔗 BRIDGE (30-50 words)

Unit 2.6: ECS Container Orchestration builds on this by showing you how to wrap this raw machine in a managed container service—ensuring your NIM containers auto-restart and health-check themselves without manual SSH management.

<!-- FACT-CHECK: "AWS G6 instances 2026" → NVIDIA L4 GPUs with 24GB VRAM, production standard for inference. -->
<!-- FACT-CHECK: "AWS Spot savings 2026" → Up to 90% advertised, 60-75% typical for GPU workloads. -->
<!-- FACT-CHECK: "NVIDIA Deep Learning AMI" → Ubuntu-based AMI pre-loaded with drivers and CUDA, version 5XX+ standard. -->
