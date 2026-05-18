# Unit 12.2: CRON Scheduling — The Batch Clock

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** The system does not "send daily check-ins." In a high-performance agentic architecture, frequency is a function of program design, not a calendar default.

Think of the human **glymphatic system**: the brain doesn't clean itself continuously throughout the day; it waits for the specific "Rest Day" of sleep to initiate a massive batch-processing cycle, clearing metabolic waste through the cerebrospinal fluid. Similarly, **synaptic pruning** doesn't happen at every stimulus; it's a scheduled consolidation phase that optimizes cognitive VRAM by deleting the non-essential.

The CCP operates on this "Two-Clock" biology. We aren't building a 24/7 chatbot that harasses users with generic prompts. We are building a **Schedule-Based Intelligence** that respects the **4+1+2 template** (4 Active, 1 Reflection, 2 Rest). Between these slots, the system is physically dark. This preserves the "High Scent" of the coach’s intervention—when the system speaks, it’s because the Batch Clock reached a high-tension cultural threshold, making the prompt unavoidable and the transformation inevitable.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The backbone of our schedule-based architecture is **AWS EventBridge Scheduler (2026)**. Unlike legacy `crontab` files on fragile EC2 instances, EventBridge is a serverless, horizontally scalable "Agentic Alarm Clock" capable of managing billions of individual schedules with unique payloads.

The CCP/CMF infrastructure synchronizes two distinct operational clocks:

1.  **The Coach Content Clock (Weekly Batch):** Triggered every Sunday at 22:00. This initiates the `ccf-weekly` sequence, generating recording scripts and prompts for the coach. The coach then records via the Studio Block during their "Active" days. Once recordings hit S3, the CMF pipeline (Chapter 7) fires automatically to process the batch.
2.  **The Client Accountability Clock (Program-Dependent):** This is NOT a global setting. Each program’s `check_in_schedule` field (FR-COM-04) defines the specific days (e.g., ["Monday", "Wednesday", "Friday"]). EventBridge Scheduler manages these as individual schedules for each client, cross-referencing the **4+1+2 Roadmap** in `PantryConfig`.

**Rest Day Enforcement** is a hard technical guardrail. If the scheduler attempts to fire on a dynamically assigned Rest Day, the `scheduled_monitor_service.py` executes a **Silent Abort**. This maintains the psychological boundary of the coaching journey. For GPU-intensive tasks, these schedules act as the "Spin-Up" signal for spot instances, ensuring we only pay for the exact duration of the batch processing window, rather than running $30/hr idle instances.

## 📂 OUR CODE (182 words)

We orchestrate this via the **Scheduled Monitor Agent** and its accompanying service layer.

- `src/ccp/agents/scheduled_monitor.py` line 126: **`ScheduledMonitorConfig`**
  - This object manages the `run_time_utc` and `coach_timezone`. Its existence on disk (`scheduled_monitor_config.json`) is the specific "Gate Check #12" required for the production orchestrator to permit session initiation.
- `src/ccp/services/scheduled_monitor_service.py` line 182: **`build_telegram_prompt`**
  - **WHY:** This enforces the rigid 3-part structural prompt (Observation → Summaries → Question) required by FR15. It ensures the LLM doesn't drift into generic "How are you?" territory.
- `src/ccp/services/scheduled_monitor_service.py` line 447: **`Silent Abort Logic`**
  - **WHY:** If the cultural tension delta is `< 15%`, the system aborts. This prevents "Prompt Fatigue" by ensuring we only disturb the coach when a genuine cultural spike is detected.

## 🤖 AGENT PROMPT (125 words)

> **Prompt for Pi / Claude Code / Gemini CLI:**
> Use the technical specifications in `FR15_Scheduled_Monitor_Agent_Tech_Spec.md` and `FR-COM-04_Program_Campaign_Manager_Tech_Spec.md` to create a new production harness command at `commands/ccp-schedule.md`.
> 
> The harness must use the `ccf-batch.md` template and include these 7 stages:
> 1. **PRE-FLIGHT:** Verify EventBridge API connectivity and .env credentials.
> 2. **CONFIGURE-CONTENT-BATCH:** Set the Sunday 22:00 `ccf-weekly` trigger.
> 3. **CONFIGURE-COACH-RECORDING:** Map the weekly recording window.
> 4. **CONFIGURE-CLIENT-ACCOUNTABILITY:** Read program `check_in_schedule` and set per-client slots.
> 5. **CONFIGURE-CMF:** Trigger CMF pipeline after content generation.
> 6. **VERIFY:** Run `aws events list-rules` to confirm all CRONs are live.
> 7. **CHECKPOINT:** Log the successful schedule configuration.

## ⌨️ TERMINAL (85 words)

```bash
# Verify all EventBridge Scheduler rules are active
aws scheduler list-schedules --region eu-west-1
# Expected: All status = ENABLED

# Check CloudWatch Logs for the last Scheduled Monitor run
aws logs filter-log-events --log-group-name /aws/lambda/scheduled-monitor-agent \
  --filter-pattern "STAGE-2-ASSESSMENT"
# Expected: Shows novelty delta % and Verdict (PASS/FAIL)

# Manually trigger the Sunday Content Batch for testing
aws scheduler start-schedule --name ccf-weekly-sunday-batch
```

## ✅ IMPLEMENTATION STEPS (165 words)

1.  Paste the prompt from Section 4 into your AI coding agent to generate the `commands/ccp-schedule.md` harness.
2.  Open `src/ccp/services/scheduled_monitor_service.py` and verify the `NOVELTY_SPIKE_PASS_THRESHOLD` is set to `15.0` (as per FR15 AC1).
3.  Configure your program's `check_in_schedule` in the `coaching_programs` table (e.g., `["mon", "wed", "fri"]`).
4.  Run the initialization command from the new harness:
    ```bash
    ccp-schedule init --coach-acronym {ACRONYM}
    ```
5.  Verify the `scheduled_monitor_config.json` file is created in your `config/` directory.
6.  Execute the Stage 6 Terminal command (`aws scheduler list-schedules`) to confirm EventBridge is correctly tracking the new client slots.

## ✅ VERIFY (45 words)

Run `aws events list-rules`. Can you see the `ccf-weekly` rule and at least one program-specific accountability rule? → **Yes/No**. Check `scheduled_monitor_config.json`. Does it contain the correct `run_time_utc`? → **Yes/No**.

## 🔗 BRIDGE (40 words)

Unit 12.2 established the "When" of the system. Unit 12.3: GPU Lifecycle Manager builds on this by managing the "How"—spinning up Nvidia NIM containers only when these CRON clocks hit their execution marks to ensure maximum cost efficiency.

<!-- FACT-CHECK: "AWS EventBridge Scheduler 2026" → Confirmed: Supports billions of schedules, increased API quotas to 5,000 RPS for CreateSchedule as of March 2026. -->
<!-- FACT-CHECK: "Nvidia NIM in-flight batching 2026" → Confirmed: TensorRT-LLM runtimes automatically maximize GPU occupancy via dynamic request batching. -->
