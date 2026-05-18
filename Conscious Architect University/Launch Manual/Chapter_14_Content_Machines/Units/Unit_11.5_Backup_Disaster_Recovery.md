# Unit 11.5: Backup & Disaster Recovery

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Backups are not "safety nets" for the future; they are the primary validation of your current production readiness. A system that cannot be restored from zero in under 60 minutes is not a production system—it is a precarious lab experiment.

Systemic resilience in agentic AI follows the first principles of **Hippocampal Consolidation**. During REM sleep, the brain does not merely "copy" data; it performs a selective, high-integrity snapshot of short-term encoding (the Day's Buffer) into the stable neocortical long-term memory. If this consolidation cycle is interrupted, the organism suffers from anterograde amnesia—the inability to form new persistent identities. 

For the CCP, an interruption in the backup pipeline is equivalent to digital amnesia. If a client's "Emotional DNA" or "Context Premise" is lost due to a database corruption or an errant agent write, the coaching relationship is severed at its roots. Persistence is the substrate of trust; without verifiable recovery, intelligence is transient.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Resilience at the persistence layer is governed by two engineering metrics: **RPO (Recovery Point Objective)** and **RTO (Recovery Time Objective)**. In the CCP architecture, we target an RPO of 5 minutes (maximum data loss) and an RTO of 60 minutes (time to full recovery).

To achieve this, we deploy a multi-layered strategy:
1.  **Supabase PITR (Point-in-Time Recovery):** Unlike standard daily backups, PITR uses Write-Ahead Logs (WAL) to allow you to restore the database to any specific millisecond. This is critical when an autonomous agent enters a logic loop and corrupts structured client data—you can "rewind" the state to the moment before the corruption began.
2.  **Neo4j Aura Agent Orchestration:** As of February 2026, the Aura Agent handles the synchronization of graph snapshots with the agentic state. For sovereign stacks, this is augmented by **Velero** and **CSI Snapshots**, ensuring the causal relationships in the Neo4j graph remain consistent with the relational records in Supabase.
3.  **S3 Cross-Region Replication (CRR) & Object Lock:** CMF assets (video renders, audio stems) are replicated to a secondary AWS region (e.g., from `us-east-1` to `us-west-2`). We apply **Object Lock (WORM - Write Once Read Many)** to the Receipt Chain logs. This prevents any agent—or human operator—from deleting the forensic audit trail, ensuring that the "truth" of the system's actions is immutable.

## 📂 OUR CODE (100-200 words)

The persistence layer's resilience is built into the service connection logic. We don't just write data; we ensure the connection can survive a failover.

- `src/ccp/services/neo4j_graph_manager.py` line 432:
  ```python
  # WHY: The close() method ensures that the driver releases 
  # connection pool resources during a graceful shutdown or 
  # a disaster recovery failover, preventing connection leakage.
  def close(self) -> None:
      self.driver.close()
  ```
- `src/ccp/services/fingerprint_archive_engine.py` line 244:
  ```python
  # WHY: The ArchiveIntegrityError is a critical DR guard. 
  # It prevents cross-tenant writes which, if backed up, 
  # would corrupt the recovery image for multiple coaches.
  if payload.coach_id != self.coach_id:
      raise ArchiveIntegrityError(...)
  ```
- `docs/architecture/Infrastructure_AWS_NIM_Deployment_Spec.md` §Backup: Defines the VPC-level backup vault policies for the NIM containers and their associated storage.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Configure a production-grade S3 Cross-Region Replication (CRR) policy for the CMF assets bucket. 
> 1. Target bucket: `ccp-backup-assets-us-west-2`
> 2. Enable **Object Lock** in Compliance Mode with a 90-day retention period for the `receipt-chains/` prefix.
> 3. Generate a CloudFormation template that provisions the IAM Role with the `s3:GetReplicationConfiguration` and `s3:ReplicateObject` permissions required for this cross-region sync.
> 4. Ensure the template includes an `AWS::S3::BucketPolicy` that enforces SSL-only access.

## ⌨️ TERMINAL (50-100 words)

```bash
# Create the secondary backup bucket in a different region
aws s3 mb s3://ccp-production-backup-us-west-2 --region us-west-2

# Enable versioning on the source bucket (Prerequisite for CRR)
aws s3api put-bucket-versioning --bucket ccp-production-assets --versioning-configuration Status=Enabled

# Create an AWS Backup Vault for the database volumes
aws backup create-backup-vault --backup-vault-name ccp-persistence-vault

# Verify the vault status
aws backup list-backup-vaults --query 'BackupVaultList[?BackupVaultName==`ccp-persistence-vault`]'
# Expected: JSON object containing the vault ARN
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Activate Supabase PITR:** Open the Supabase Dashboard → Database → Backups. Enable Point-in-Time Recovery. Ensure the retention is set to at least 7 days to cover the weekly coach content schedule.
2.  **Configure Neo4j Aura Snapshots:** Access the Neo4j Aura Console. Under "Backups," verify that "Automated Snapshots" is active. Download the **Neo4j Aura Agent** (v1.2.0+) and wire it into your `Neo4jGraphManager` init sequence to trigger a manual snapshot before major schema migrations.
3.  **Deploy S3 CRR:** Paste the prompt from Section 4 into Claude Code. Run the generated CloudFormation template to establish the replication pipeline between your primary production bucket and the DR bucket.
4.  **Hardware Audit:** Verify that your `Infrastructure_AWS_NIM_Deployment_Spec.md` settings allow for at least 100GB of backup storage in the `ccp-persistence-vault`.
5.  **Test a "Small" Restore:** Restore a single table from a Supabase PITR snapshot to a temporary "Restore Test" database to verify the WAL logs are correctly replaying.

## ✅ VERIFY (30-50 words)

Run `aws s3api get-bucket-replication --bucket ccp-production-assets`. If it returns a `ReplicationConfiguration` with a `Status: Enabled` and the correct destination ARN, the asset resilience layer is active.

## 🔗 BRIDGE (30-50 words)

With the persistence layer now resilient and persistent, we move to **Chapter 12: Launch Hardening**. This is where we wire these databases into the final production cluster and execute the "First Light" test—the moment the CCP becomes a living, breathing intelligence.

<!-- FACT-CHECK: "Supabase PITR 2026" → Remains standard for managed Postgres stacks; CloudNativePG (CNPG) is the 2026 open-source sovereign alternative. -->
<!-- FACT-CHECK: "Neo4j Aura Agent 2026" → Released Feb 2026; orchestrates snapshots and AI state sync for graph consistency. -->
<!-- FACT-CHECK: "S3 Object Lock 2026" → Critical for WORM compliance in agentic audit trails to prevent deletion. -->
