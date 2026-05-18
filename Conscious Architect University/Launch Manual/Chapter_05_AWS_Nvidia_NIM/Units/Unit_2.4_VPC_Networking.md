# Unit 2.4: VPC & Networking — The Sovereign Sanctuary

## 🧠 THE SCIENCE (145 words)

**UNLEARN:** Connectivity is not convenience. In the legacy cloud paradigm, we are taught to "just open the ports" to get the API working. This is a topological sin. Convenience is the precursor to compromise. A sovereign system is defined not by what it lets in, but by what it successfully repels.

Think of your VPC through the lens of Sanctuary Architecture — specifically the ancient Tabernacle. It was not a single room, but a nested series of boundary layers designed to protect a central presence. The **Outer Court** is your Public Subnet; it is where the world interacts with your Gateway. The **Holy Place** is your Private Subnet; it is where the labor of inference occurs, shielded from the common noise of the public internet. The **Holy of Holies** is your isolated GPU instance or database, accessible only via a single, consecrated path. We do not build networks to "connect" everything; we build them to isolate the sacred core from the profane exterior. In the CMF, your models are the presence; the VPC is the wall.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

The Amazon Virtual Private Cloud (VPC) is the "mathematical grid" upon which your infrastructure is projected. It begins with a **CIDR Block** (Classless Inter-Domain Routing), typically `10.0.0.0/16`, providing 65,536 private IP addresses. This space is then partitioned into **Subnets**.

For a sovereign CMF, we enforce a strict **Dual-Tier topology**:
1.  **Public Subnets**: Attached to an **Internet Gateway (IGW)**. These host your Load Balancers or jump boxes. Any instance here has a public IP and is vulnerable to the "background radiation" of the internet.
2.  **Private Subnets**: No direct route to the IGW. These host your Nvidia NIM containers. They communicate with the world via a **NAT Gateway** (for egress) or, preferably, **VPC Endpoints** (for internal AWS services).

In 2026, the critical optimization for GPU workloads is the **S3 Gateway Endpoint**. Because NIM containers must pull GBs of model weights (FLUX, Wan 2.2) from S3, routing this traffic through a NAT Gateway is a cost catastrophe ($0.045/GB). An S3 Gateway Endpoint creates a transparent, zero-cost, high-bandwidth tunnel directly to the S3 API. 

Security is enforced via **Security Groups (SG)** — stateful firewalls that wrap each instance. For the CMF, we isolate "East-West" traffic: the ComfyUI container (port 8188) should only accept traffic from the Pipeline Commander, and the NIM container (port 8000) should only accept traffic from the VPC-internal CIDR.

## 📂 OUR CODE (160 words)

The network configuration is currently abstracted into environment variables defined in our configuration layer.

- `cmf/apps/cmf-assembler/config.py` line 34: 
  ```python
  # config.py, line 34
  # WHY: Currently points to RunningHub's public URL. 
  # In Chapter 2 (Unit 2.14), we will pivot this to a private 
  # VPC endpoint (e.g., http://nim.cmf.internal:8000) once 
  # our internal DNS and VPC are provisioned.
  base_url = os.environ.get("RUNNINGHUB_BASE_URL", "https://www.runninghub.ai")
  ```

- `cmf/apps/cmf-assembler/config.py` line 52:
  ```python
  # config.py, line 52
  # WHY: Defines the base for asset storage. When our S3 
  # Gateway Endpoint is live, this path maps across the 
  # AWS backbone rather than the public internet.
  asset_storage_base = os.environ.get("CMF_ASSET_STORAGE", "./assets")
  ```

`⚠️ BUILD REQUIRED` — Our infrastructure-as-code (Terraform/CloudFormation) for the VPC does not yet exist. We will provision the foundations via the AWS CLI in this unit.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Pi/Claude Code/Gemini CLI:**
> I need to provision the networking foundations for my sovereign CMF infrastructure. Create a series of AWS CLI commands that:
> 1. Create a VPC named `cmf-vpc` with CIDR `10.0.0.0/16`.
> 2. Create one Public Subnet (10.0.1.0/24) and one Private Subnet (10.0.2.0/24) in the current region.
> 3. Create an Internet Gateway and attach it to the VPC.
> 4. Create a Route Table for the public subnet and add a route to `0.0.0.0/0` via the IGW.
> 5. Create an S3 Gateway Endpoint for the VPC and associate it with both subnets.
> 6. Create a Security Group named `cmf-nim-sg` that allows inbound TCP 8000 and 8188 ONLY from within the VPC CIDR (10.0.0.0/16).
> Output the commands as a single script with comments.

## ⌨️ TERMINAL (90 words)

```bash
# Create the VPC and capture the ID
vpc_id=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'VPC.VpcId' --output text)
# Expected: vpc-0a1b2c3d4e5f6g7h8

# Create the S3 Gateway Endpoint (Cost Optimization)
aws ec2 create-vpc-endpoint --vpc-id $vpc_id --service-name com.amazonaws.eu-west-1.s3 --query 'VpcEndpoint.VpcEndpointId'
# Expected: vpce-0123456789abcdef0

# Tag the VPC for sovereignty tracking
aws ec2 create-tags --resources $vpc_id --tags Key=Name,Value=cmf-vpc Key=Project,Value=SovereignCMF
```

## ✅ IMPLEMENTATION STEPS (150 words)

1. **Provision the VPC Grid**: Paste and run the Agent Prompt from Section 4 in your CLI agent. This will generate the full sequence of subnets, gateways, and routing tables.
2. **Execute the Script**: Run the commands provided by the agent. Crucially, note the `VpcId` and `SubnetId` for the Private Subnet; you will need these to launch your GPU instances in Unit 2.5.
3. **Configure the S3 Gateway**: Ensure the S3 Endpoint is associated with your Private Subnet's Route Table. This ensures that when the MOSS-TTS or FLUX NIM container starts, it pulls weights over the AWS backbone for free.
4. **Harden Security Groups**: Verify `cmf-nim-sg` permits port 8000 only from `10.0.0.0/16`. This prevents the "Holy of Holies" from being scanned by public bots.
5. **Verify DNS**: Ensure `enableDnsHostnames` and `enableDnsSupport` are set to `true` on your VPC.

## ✅ VERIFY (40 words)

Run `aws ec2 describe-vpc-endpoints --filters Name=vpc-id,Values=$VPC_ID`. 
**Outcome:** You should see an entry for `s3` with `State: available`. This confirms your model weight "fast lane" is live and your VPC is provisioned.

## 🔗 BRIDGE (40 words)

Unit 2.5 builds on this sanctuary by introducing **EC2 Compute — Raw GPU Machines**. We will launch our first G5 instance into the Private Subnet we just built, ensuring our "consecrated Presence" is shielded by the VPC's walls.

<!-- FACT-CHECK: "S3 Gateway Endpoint cost 2026" → Still free, confirmed via AWS Pricing docs -->
<!-- FACT-CHECK: "AWS PrivateLink for ECR" → Required for image pulls in private subnets without NAT, confirmed 2026 architecture -->
