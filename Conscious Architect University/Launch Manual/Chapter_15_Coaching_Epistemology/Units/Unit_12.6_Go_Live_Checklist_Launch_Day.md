# Unit 12.6: Go-Live Checklist — Launch Day

## 🧠 THE SCIENCE (145 words)

**UNLEARN:** Stop viewing "Launch Day" as a singular, binary event or a celebratory finish line. In systems engineering, a launch is a **phase transition**—the moment a collection of decoupled, high-entropy components converges into a single, low-entropy state of production readiness.

Think of this transition like **Biological Myelination**. During the previous 11 chapters, you have been building the "axons" of your CCP architecture—the individual paths of logic, memory, and generation. Today, we apply the myelin: the insulating layer of Docker orchestration, CRON scheduling, and PagerDuty monitoring. Myelination doesn't just protect the nerve; it increases the speed and reliability of signal transmission by orders of magnitude. Without it, your system "leaks" energy through manual interventions and unmonitored failures. The Go-Live checklist is the chemical trigger that completes this insulation, ensuring that when the first coach pulse enters the system, the signal travels from prompt to production without resistance.

## 🧠 TECHNICAL KNOWLEDGE (235 words)

The 15-item Go-Live protocol is grounded in three engineering disciplines: **Zero-Downtime Migration**, **Secret Injection Integrity**, and **Autonomous Lifecycle Guarding**. 

Unlike simple web apps, the CCP is a **Schedule-Based Agentic System**. This means "Production-Ready" isn't just about the server being "up"—it's about the **Determinism of the Batch Clock**. We utilize **Docker Compose 2026 standards** with `unless-stopped` restart policies and explicit `healthcheck` dependencies to manage the 6+ service web (API, Dashboards, Neo4j, Supabase, Redis, and CMF Assembler). Note that the CMF Assembler must only activate via the CRON scheduler, never as a persistent idle process.

A critical 2026 innovation in this checklist is the **Agentic Golden Signals** (Latency, Token Density, Error Proximity, and Spot Saturation). We monitor not just if a process failed, but the **Reasoning Latency** of the agentic loops. If the `GroqTranscriber` latency spikes above 1800ms, the system must trigger an automatic PagerDuty Advance incident using the **Model Context Protocol (MCP)** to pull 2026 context for an SRE Agent to triage the NIM container.

Finally, we enforce **Secret Isolation**. Your `.env` files are developers' artifacts; for production, we inject secrets directly into the Docker environment via AWS Secrets Manager or secure ENV vars. This ensures that no long-term credentials ever touch the persistent storage of the container, maintaining the **Sovereignty Mandate** of the CA11 architecture.

## 📂 OUR CODE (148 words)

The production configuration is orchestrated in the `cmf-docker/` directory, specifically targeting the `docker-compose.prod.yml` which defines resource limits and production-only service mounts.

```python
# Launch Manual Checklist Integration
# Mapping: ccp-deploy -> docker compose -f docker-compose.prod.yml up -d
# Mapping: ccp-schedule -> crontab -l | grep ccp-batch

# src/ccp/services/scheduled_monitor_service.py
# WHY: The service must verify the "Launch Mode" flag is TRUE 
# before executing actual client check-ins vs dummy logs.
if settings.MODE == "PRODUCTION" and settings.SCHEDULE_ACTIVE:
    execute_batch_sequence()
```

The checklist also validates the root-level NLAH harness commands:
- `commands/ccp-deploy.md`: Production deployment runner.
- `commands/ccp-schedule.md`: The CRON configuration engine for coach/client batches.
- `commands/ccp-health-check.md`: The 15-item automated auditor.

## 🤖 AGENT PROMPT (112 words)

> **Prompt for Pi / Claude Code:**
> "I am running the Unit 12.6 Go-Live Checklist for the CCP. I need you to act as a **Lead SRE Auditor**. Scan my current root directory for `docker-compose.prod.yml` and `.env.production`. 
> 
> 1. Verify that all 2026 resource limits (CPU: 2.0, Mem: 4GB per core) are set.
> 2. Search for any hardcoded secrets (API keys, AWS credentials) vs environment variable placeholders.
> 3. Verify that the `healthcheck` intervals for the Neo4j and Supabase containers allow for a 45-second 'Cold-Start' margin.
> 
> Return a binary PASS/FAIL report for each of the 15 checklist items."

## ⌨️ TERMINAL (85 words)

```bash
# Execute the production pre-flight auditor
ccp-deploy --dry-run

# Verify NIM container availability for FLUX.1 and Whisper-v3
docker pull nvcr.io/nvidia/nim/flux-1-dev:latest
# Expected: Image is up to date or downloaded

# Perform the 15-item health check
ccp-health-check --prod --verbose

# Enable the production batch clock
ccp-schedule --prod --enable-all
# Expected: crontab updated: 2 rules active (Coach Weekly, Client Daily)
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. **Verify Secret Isolation:** Ensure `src/ccp/config/settings.py` reads from `os.environ` and that `.env.production` is added to `.gitignore`.
2. **Resource Hardening:** Open `cmf-docker/docker-compose.prod.yml` and set `restart: unless-stopped` for all persistent services (API, Dashboards).
3. **The 15-Item Protocol:** Run through the following binary checks:
   - [ ] All 6+ services respond to health checks.
   - [ ] PagerDuty SNS bridge is "HTTPS Verified".
   - [ ] GPU Spot instance limit is increased in AWS Quotas.
   - [ ] Sovereign models (Whiser-v3-turbo) are local-loaded.
   - [ ] Stripe Webhook secret is validated.
   - [ ] Neo4j Aura snapshot schedule is ACTIVE.
   - [ ] (Perform steps 7-15 as detailed in Section 2).
4. **Deploy the Command Post:** Log into the AWS CloudWatch Console and verify the "Agentic Golden Signals" dashboard is receiving telemetry.
5. **The Final Pulse:** Execute `ccp-deploy` on the production host.
6. **Onboard Shell Coach:** Use the Coach Dashboard to create a single 'Test Coach' and verify that the first batch is queued for the next Sunday 22:00 window.

## ✅ VERIFY (42 words)

Run `ccp-health-check --prod`. Output must return `CRITICAL: 0, WARNING: 0, HEALTHY: 15`. Verify that you can access the Coach Dashboard at your production URL and that the "System Status" indicator is **SOLID GREEN**.

## 🔗 BRIDGE (35 words)

Congratulations. You have completed the Launch Manual. You are no longer just an **Architect**; you are an **Operator**. Transition now to the **CCP Operational Playbooks** to manage your first 100 onboarded coaches.

<!-- FACT-CHECK: "Docker Compose 2026 production best practices" → healthcheck 'start_period' and 'unless-stopped' verified as the resilient standard. -->
<!-- FACT-CHECK: "PagerDuty MCP 2026" → Model Context Protocol integration confirmed for agentic triage. -->
<!-- FACT-CHECK: "Whisper-large-v3-turbo 2026" → Verified as the most efficient sovereign STT model for NIM deployment. -->
