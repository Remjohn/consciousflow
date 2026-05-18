# Unit 12.5: Load Testing — 100×5 Target

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Scaling is not a linear multiplier of success; it is a search for the first physical wall. The common fallacy is that "if it works for 1 coach, it works for 100." In complex agentic systems, scaling 100 concurrently active coaches with 5 clients each (500 active threads) reveals a physics of **Contention** that is invisible at low volume.

Think of it like an Ant Colony Foraging Bottleneck. A single ant finding a sugar cube is a linear success path. However, when 10,000 ants attempt to traverse the same pheromone trail and enter the hive simultaneously, the hive entrance (S3/GPU Gateway) and the pheromone trail (Database Bus) become physically congested. Even if the sugar (compute) is infinite, the throughput is limited by the geometry of the access points. In the CCP, scaling doesn't just mean more CPU; it means widening the "gates" of S3 request rates and database connection pools to prevent the systemic stall that occurs when 100 batches hit the same prefix at 22:00 Sunday night.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

To survive the 100×5 target, you must architect for the **Three Gorges of Scaling**:

1.  **S3 Prefixing & Throttling:** Amazon S3 supports 3,500 PUT/POST/DELETE and 5,500 GET/HEAD requests per second **per prefix**. If 100 concurrent batches attempt to upload 50 files each to the same `s3://ccp-production/uploads/` directory, you risk 503 Slow Down errors. The solution is **Key Partitioning**: prepending `coach_id` to every path (e.g., `s3://ccp-production/[coach_id]/uploads/`) ensures requests are distributed across the S3 index, bypassing the single-prefix bottleneck.
2.  **Database Connection Pooling:** Every batch request consumes a connection to Supabase (PostgreSQL) and Neo4j. At 100 concurrent batches, the "One Connection Per Request" model will exhaust the `max_connections` limit, causing fatal `ConnectionTimeout` errors. You must implement **Connection Pooling** (via `PgBouncer` or `pool_size` settings) to recycle connections across short-lived agent tasks.
3.  **GPU Replica Management:** NVIDIA NIM microservices scale best through horizontal replication rather than vertically scaling a single instance's VRAM. Each NIM container has a fixed `max_batch_size` and KV Cache limit. At high concurrency, you must monitor `gpu_cache_usage_perc` and spawn additional NIM replicas. The 2026 standard utilizes **In-flight Batching (IFB)**, allowing the engine to interleave requests from multiple coaches into a single GPU pass, maximizing throughput while minimizing idle time between token generations.

## 📂 OUR CODE (100-200 words)

The primary throttle for mass-concurrency lives in `cmf/apps/cmf-assembler/pipeline_commander.py`. Because the CCP operates on a schedule-based batch model, the commander must govern how many batches are allowed to enter the active "Gorge" at once.

```python
# cmf/apps/cmf-assembler/pipeline_commander.py, line 94
# WHY: This limit acts as a systemic surge protector.
# If set to 100 with insufficient DB pooling, the system crashes.
# We tune this based on the measured bottleneck of the S3/GPU interface.
DEFAULT_CONCURRENT_LIMIT = 3
```

- `pipeline_commander.py`, line 460: `create_job_queue()` — The engine that converts the Sunday night "Mass Surge" into a stable, sequential stream of work based on the `concurrent_limit`.
- `pipeline_commander.py`, line 511: `dequeue_next()` — The gatekeeper that prevents over-provisioning and database exhaustion by checking the active processing count before authorizing a new batch.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> I need to execute a production stress test for 100 concurrent coach batches. Create a load-test script at `scripts/stress_test_100.py` that:
> 1. Imports `enqueue_job` and `create_job_queue` from `cmf/apps/cmf-assembler/pipeline_commander.py`.
> 2. Spawns 100 mock `pipeline_id` instances with `beat_count=10`.
> 3. Enqueues all 100 jobs into a primary queue with `concurrent_limit` temporarily set to 20.
> 4. Monitors the `get_queue_status` and logs the time to completion.
> 5. Reports any `ConnectionTimeout` or `S3 Throttling` errors encountered during the sweep.

## ⌨️ TERMINAL (50-100 words)

```bash
# Update the concurrent limit for the Stress Test
# Edit pipeline_commander.py line 94 to reflect target concurrency (e.g. 20)

# Run the Load Test script
python scripts/stress_test_100.py

# Monitor S3 request metrics (verify prefix distribution)
aws cloudwatch get-metric-statistics --namespace AWS/S3 --metric-name PutRequests \
  --dimensions Name=BucketName,Value=ccf-production-assets --start-time 2026-04-04T10:00:00Z \
  --end-time 2026-04-04T11:00:00Z --period 60 --statistics Sum
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Prefix Hardening:** Open `cmf/apps/cmf-assembler/pipeline_commander.py`. Ensure all S3 upload keys are generated with the `coach_id` as the top-level prefix.
2.  **Pool Verification:** Verify that your `DATABASE_URL` uses the `pgbouncer=true` parameter or that your repository layer implements a connection pool with `max_overflow=20`.
3.  **NIM Replica Scaling:** Use `docker compose scale nim-t2i=3` to provide multiple GPU entry points before starting the test.
4.  **Execute Stress Test:** Paste the Agent Prompt from Section 4 to generate the stress test script. Run it using the terminal command provided.
5.  **Identify Bottleneck:** Watch the logs. If you see `503 Slow Down`, your S3 prefixing is failing. If you see `Too many connections`, your DB pool is too small. If you see high `TTFT` (Time to First Token), you need more NIM replicas.

## ✅ VERIFY (30-50 words)

Execute the 100-job stress test. All 100 jobs must transition to `COMPLETED` on the ledger within 4 hours. Confirm via `tail -f logs/pipeline.log` that zero `503` or `Timeout` errors occurred.

## 🔗 BRIDGE (30-50 words)

Unit 12.6 concludes this chapter with the Go-Live Checklist — the final 15-item binary verification that marks the transition from our hardened test environment to the live production platform.

<!-- FACT-CHECK: "S3 3,500 PUT / 5,500 GET limits 2026" → Confirmed via AWS S3 Performance docs. Prefixing is the primary scaling mechanism. -->
<!-- FACT-CHECK: "NVIDIA NIM In-flight Batching 2026" → Confirmed via NVIDIA developer docs. IFB is standard for high-concurrency LLM inference. -->
<!-- FACT-CHECK: "NIM gpu_cache_usage_perc metric 2026" → Standard metric for NIM scaling via Prometheus/Grafana. -->
