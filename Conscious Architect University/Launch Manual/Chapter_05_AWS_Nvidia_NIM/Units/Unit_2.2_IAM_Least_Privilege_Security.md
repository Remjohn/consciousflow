# Unit 2.2: IAM & Least-Privilege Security

## 🧠 THE SCIENCE (142 words)

**UNLEARN:** "Administrative access is the default for a solo engineer." 

In the development of a sovereign cognitive architecture, identity is not a "login"—it is your system's Major Histocompatibility Complex (MHC). In immunology, MHC molecules sit on the surface of every cell, presenting fragments of proteins to the immune system. This allows the body to distinguish between "self" and "hostile non-self." If a cell fails to present the correct MHC marker, it is immediately neutralized. 

IAM (Identity and Access Management) is the MHC of your AWS infrastructure. Every API call, every GPU instance spin-up, and every S3 read must present a cryptographic "marker" that proves not just WHO it is, but what it is AUTHORIZED to touch. By enforcing the Principle of Least Privilege (PoLP), we ensure that even if one component of our CMF pipeline is compromised, the "infection" cannot spread to the rest of your sovereign data.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

AWS IAM operates through a hierarchy of three primitives: **Identities** (Users/Roles), **Policies** (JSON permissions), and **Service Tokens** (Short-lived credentials).

In 2026, the industry has effectively deprecated long-term IAM Users with static access keys in favor of **IAM Roles**. A Role is an identity that is intended to be assumed by anyone who needs it—whether that is a human architect or an EC2 GPU instance. When an instance "assumes" a role, the AWS Security Token Service (STS) issues temporary, rotating credentials that expire in as little as 15 minutes. This eliminates the "hardcoded key" vulnerability that destroys 90% of amateur cloud deployments.

Policies are the mathematical logic of your security. Defined in JSON, they consist of five key elements:
- **Effect:** Allow or Deny. (Deny always wins).
- **Action:** The specific API call (e.g., `s3:GetObject`).
- **Resource:** The ARN (Amazon Resource Name) of the target (e.g., `arn:aws:s3:::cmf-assets/*`).
- **Condition:** Metadata constraints (e.g., "only allow if IP is X" or "only allow if MFA is active").

For our CMF, we use **Service-Linked Roles**. We don't want our `pipeline_commander.py` to have "S3 Full Access." We want it to have `s3:PutObject` access ONLY to the specific bucket where our cinematic outputs live. This creates a blast radius of zero.

## 📂 OUR CODE (145 words)

Currently, our pipeline relies on a legacy authentication pattern that we must evolve for sovereignty. 

Look at `cmf/apps/cmf-assembler/config.py`:
```python
# config.py, line 33
# WHY: This relies on a static environment variable (RUNNINGHUB_API_KEY).
# Transitioning to sovereign infra means replacing this static secret 
# with an IAM Role that is automatically injected into the EC2 environment.
api_key = os.environ["RUNNINGHUB_API_KEY"]
```

Also, trace `cmf/apps/cmf-assembler/pipeline_commander.py` at line 378. 
```python
# pipeline_commander.py, line 378
# WHY: Cost tracking is where security meets the P&L. 
# We track USD spend per state transition to ensure our infrastructure 
# is operating within the "Sovereignty Margin."
def compute_generation_cost(beat_count: int, regeneration_count: int = 0) -> float:
```
Sovereignty is not just about ownership; it is about the **financial security** of your compute credits.

## 🤖 AGENT PROMPT (118 words)

> **Prompt for Pi / Claude Code:**
> I am configuring a sovereign GPU infrastructure for the CMF pipeline. I need to create a JSON IAM Policy that follows the Principle of Least Privilege. 
> 
> The policy should:
> 1. Allow `s3:PutObject`, `s3:GetObject`, and `s3:ListBucket` for the resource `arn:aws:s3:::cmf-production-assets/*`.
> 2. Allow `ec2:DescribeInstances` and `ec2:StartInstances` for instances tagged with `Project=CCP`.
> 3. Explicitly `Deny` any action outside the `eu-west-1` region.
> 
> Output ONLY the raw JSON policy. Do not include introductory text. Ensure the policy is compatible with the 2026 AWS IAM API spec.

## ⌨️ TERMINAL (72 words)

```bash
# Verify your current identity and confirm you are NOT using the root account
aws sts get-caller-identity
# Expected: "Arn": "arn:aws:iam::123456789012:user/YourName"

# List existing roles to ensure no naming collisions
aws iam list-roles --query 'Roles[?contains(RoleName, `CMF`)].RoleName'

# Check if the CCP-Sovereign-Policy already exists
aws iam get-policy --policy-arn arn:aws:iam::aws:policy/CCP-Sovereign-Policy 2>/dev/null || echo "Build Required"
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Verify Session Architecture:** Run the terminal commands in Section 5. If `get-caller-identity` returns your root account, STOP. Create an IAM Administrator user first and log in with those credentials. Use the **Launch Manual Governance Skill** to ensure your profile is scoped correctly.
2. **Generate Scoped Policy:** Copy the prompt from Section 4 and paste it into your agent (Pi or Claude). Save the resulting JSON as `cmf-sovereign-policy.json`.
3. **Create the IAM Role:** Use the CLI to create a new role named `CMF-Pipeline-Operator`. Setting the "Trust Relationship" to allow `ec2.amazonaws.com` to assume it.
4. **Attach Policy:** Attach the JSON policy from step 2 to your new role.
5. **Simulate:** Use the **IAM Policy Simulator** in the AWS Console to test if your role can delete a bucket. It should return **Implicit Deny**.

## ✅ VERIFY (45 words)

Run `aws iam get-role --role-name CMF-Pipeline-Operator`. 
The command must return the Role metadata including the `AssumeRolePolicyDocument`. 
Then run `aws sts get-caller-identity`. 
The ARN must show your scoped user, never the root account. 

## 🔗 BRIDGE (40 words)

Unit 2.3 builds on this identity foundation by introducing **S3 Object Storage**. Now that your system has a "Self" (the IAM Role), we will build the "Library" where that role has exclusive, sovereign permission to write our cinematic assets.

<!-- FACT-CHECK: "AWS IAM Best Practices 2026" → Roles-only identity via Identity Center, short-lived STS tokens mandated, Access Analyzer V2 automated policy generation. -->
<!-- FACT-CHECK: "STS token expiry 2026" → Standard minimum duration is 15 minutes, maximum 12 hours for assume-role. -->
