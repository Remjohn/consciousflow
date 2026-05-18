# Unit 2.7: AWS CLI Mastery

## 🧠 THE SCIENCE (135 words)

**UNLEARN:** The AWS Management Console is the "real" AWS. It is not. The GUI is a cortical layer—a slow, visual, and highly interpretive interface prone to the "illusion of the interface." The real AWS is a lattice of APIs.

Think of the relationship between your spinal cord and your prefrontal cortex. When you touch a hot stove, your spinal cord executes a withdrawal reflex before your conscious brain even registers the pain. This is a deterministic, high-speed, hardwired circuit. In the CCP architecture, the AWS CLI is your spinal cord. It bypasses the "thinking" (manual clicking) and executes deterministic reflexes—provisioning S3 buckets, starting GPU instances, and rotating IAM keys—with millisecond precision. Mastery of the CLI means moving from a slow, error-prone visual user to a high-speed, API-native architect who treats infrastructure as code.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

In 2026, AWS CLI v2 is the standard for programmatic interaction. It operates on three primitives: **Service**, **Operation**, and **Parameters**. For the CCP, the CLI is not just for one-off tasks; it is the transport layer for our `pipeline_commander.py` and the target for our upcoming `ccp-*` command suite.

Key technical pillars of CLI mastery include:
- **Profiles & Credentials**: Using `~/.aws/credentials` to switch between `ccp-production` and `ccp-staging` roles without re-authenticating. This ensures strict isolation between development and production environments.
- **Regions & Endpoints**: Latency follows the laws of physics. Operating the CMF in `eu-west-1` while your S3 buckets are in `us-east-1` introduces "transit drag" into your batch processing. CLI mastery requires explicitly pinning regions to prevent resource fragmentation.
- **The Query Engine (JMESPath)**: AWS APIs return massive JSON payloads. Native filtering using `--query` (client-side) and `--filters` (server-side) is the difference between a 20MB payload and a single Boolean value. We use JMESPath to extract exact state values—like the `CapacityBlockId` for a reserved H100 instance.
- **Output Determinism**: We prioritize `text` or `json` output for our scripts. While `table` output is human-readable, it is structurally opaque to agents. Our harness commands rely on `json` to parse state and execute subsequent state transitions in the 16-state CMF machine.

## 📂 OUR CODE (158 words)

The CMF logic is designed to be infrastructure-aware, even before we build the full automation harness.

- `cmf/apps/cmf-assembler/pipeline_commander.py` line 378: `compute_generation_cost`.
  ```python
  # pipeline_commander.py, line 378
  # WHY: Cost tracking is local here, but the VERIFICATION
  # of these costs requires CLI calls to 'aws ce' (Cost Explorer).
  # The CLI bridge ensures our local state matches the AWS reality.
  ```
- `src/ccp/services/circuit_breaker.py` (⚠️ BUILD REQUIRED): This service will use CLI-native wrappers to check for "Runaway GPU Spend" by querying current hourly usage and tripping the circuit if specific budget thresholds are crossed via `aws budgets`.
- `config.py` line 12: AWS Region and Profile mapping.
  ```python
  # config.py, line 12
  # WHY: Hardcoding regions kills portability. We sync this
  # with the AWS CLI default profile to ensure environment parity.
  ```

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Pi/Claude Code:**
> "Create a shell script `scripts/check-gpu-health.sh` that uses the AWS CLI to:
> 1. Query the status of all G5/P4d instances in the current region.
> 2. Use a JMESPath query (`--query`) to extract only the InstanceId, State, and LaunchTime.
> 3. Filter for instances with the tag `Project: CCP`.
> 4. If any instances are in the 'running' state for more than 4 hours, output a WARNING with the total uptime in minutes. 
> This script will eventually be integrated into the `ccp-health-check` harness command in Chapter 04. Use `json` output format for parsing reliability."

## ⌨️ TERMINAL (84 words)

```bash
# Configure the CCP production profile
aws configure --profile ccp-production

# Search for GPU-ready Capacity Block offerings (2026 specific)
aws ec2 describe-capacity-block-offerings --capacity-unit "vcpu" \
  --instance-type "p5.48xlarge" --instance-count 1 \
  --query 'CapacityBlockOfferings[0].CapacityBlockOfferingId'

# List all S3 assets with a specific tag
aws s3api list-objects --bucket cmf-production-assets \
  --query 'Contents[?contains(Key, `project_gamma`)].Key'
```

## ✅ IMPLEMENTATION STEPS (142 words)

1. **Verify CLI Version**: Run `aws --version` and ensure you are on version 2.15+ (2026 standard).
2. **Setup Profiles**: Create two profiles in `~/.aws/config`: `[profile ccp-dev]` and `[profile ccp-prod]`. This enforces the "Church and State" separation of environments.
3. **Master JMESPath**: Execute `aws iam get-user --query 'User.Arn' --output text`. This simple command proves you can extract a deep key from a complex object without manual parsing.
4. **Build the Monitor**: Paste the Agent Prompt from Section 4 into your terminal (if using Claude Code) or Pi. Review the generated `check-gpu-health.sh`.
5. **Simulate Discovery**: Use `aws ec2 describe-instances --filters "Name=instance-type,Values=g5.*"` to find your visual inference machines. Trace the output to ensure you can see the tags we defined in the spec.

## ✅ VERIFY (48 words)

Run `aws ec2 describe-instances --query 'Reservations[*].Instances[*].InstanceId' --output text`. If the command returns either a clean list of IDs or a blank line (no instances) without a JSON error, your profile and query engine are functional.

## 🔗 BRIDGE (40 words)

Unit 2.8 builds on this CLI mastery by introducing **What is Nvidia NIM**—the first containerized microservice you will deploy and manage using the CLI skills you just hardwired into your spinal cord.

<!-- FACT-CHECK: "AWS CLI version 2026" → Standard for all new features. version 1 in maintenance. -->
<!-- FACT-CHECK: "JMESPath filtering 2026" → Still the native query engine for AWS CLI v2. -->
<!-- FACT-CHECK: "Capacity Block CLI 2026" → `aws ec2 describe-capacity-block-offerings` is the verified command for GPU reservations. -->
