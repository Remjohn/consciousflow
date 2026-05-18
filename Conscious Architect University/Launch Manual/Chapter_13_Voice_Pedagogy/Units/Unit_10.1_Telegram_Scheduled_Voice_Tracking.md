# Unit 10.1: Telegram Scheduled Voice Tracking

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** The CCP Telegram bot is not a "chatbot" or a real-time conversational agent. While it appears interactive, it is architecturally a **Scheduled Accountability Tracker**. Treat it not as an open-ended dialogue partner, but as a proactive systems-monitoring extension of the coach's intent.

From First Principles, this unit leverages **Sensemaking Theory** (Weick, 1995) to shift the production burden. In traditional coaching, the coach must "make sense" of a blank slate. By providing a cultural tension *first*, the agent provides a coherent environment for the coach's certainty to have immediate, high-scent meaning.

Think of the **Prefrontal Cortex (PFC)**: it doesn't react to every synaptic fire in the brain. It acts as an executive planner, monitoring internal states and external signals to initiate deliberate actions at configured intervals. Our **Scheduled Monitor Agent** functions as the PFC of the CCP, cross-referencing audience discourse until a novelty threshold is reached, then initiating a "High-Scent Directive" to the coach. This ensures every production session is tethered to reality, not just whim.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

In 2026, the architectural standard for high-scale agentic communication is **Push-based Webhooks**, not Long Polling. Long polling requires a persistent connection that consumes unnecessary CPU cycles and fails to scale horizontally. Webhooks, conversely, allow our platform to remain **Stateless and Event-Driven**. When a Telegram update arrives, it triggers a discrete FastAPI execution, processes the payload, and terminates—minimizing costs in our pay-per-use credit environment.

The core engineering constraint of the platform is the **Novelty Assessment Gate (Stage 2)**. To prevent "notification fatigue," the agent compares current scraped discourse against the **Cultural Memory Map (CMM, DEP-ENG-023)**. We enforce a strict **>15% Frequency Spike Threshold**. If a topic is already well-documented or lacks a significant recent surge in audience attention, the gate returns a `FAIL` verdict and silent-aborts the daily message.

Furthermore, we enforce **AC4: The Only Initiator**. To maintain the high-fidelity signal of the CCP, manual trigger paths are blocked in production. A session only begins when the system identifies a tension, prompts the coach, and ingests a valid 15-word response. We deliberately cap these sessions at **3-5 messages**. This creates a "Dopamine Closure Loop"—the client or coach receives a prompt, takes a specific action, and the session closes. This prevents the "Infinite Scroll" effect of standard chatbots, maintaining the professional isolation required for sovereign coaching.

## 📂 OUR CODE (100-200 words)

The platform's proactive initiation is controlled by three primary files in the `src/ccp/` hierarchy. Each is wired to ensure the 4-stage monitoring pipeline executes without cross-tenant drift.

- `src/ccp/agents/scheduled_monitor.py` line 194: The **ScheduledMonitorAgent** class. This is the daily initiator that implements the persona masking gate (no agent names in prompts) and the 3-part Telegram delivery format.
- `src/ccp/services/scheduled_monitor_service.py` line 123: The `assess_tension_novelty` function.
  ```python
  # scheduled_monitor_service.py, line 135
  # WHY: Chronic topics with no >15% spike trigger a FAIL verdict. 
  # This enforces AC1 Novelty Gate, preventing the bot from becoming 
  # generic noise for the coach.
  ```
- `src/ccp/services/groq_transcriber.py` line 41: Handles the asynchronous STT for the coach's response.
  ```python
  # groq_transcriber.py, line 50
  # WHY: We use whisper-large-v3-turbo on Groq to achieve sub-second 
  # transcription latency, ensuring the coach feels an immediate 
  # "hand-off" to the research pipeline.
  ```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi / Claude Code:**
> You are an Agentic Systems Engineer. I need to harden the Platform's interaction loop. 
> Modify `src/ccp/services/scheduled_monitor_service.py` to include a `SessionInteractionGate`. 
> 1. In `process_coach_response`, add a counter that tracks the number of messages exchanged in the current `trigger_id` context.
> 2. If the count exceeds 5, the method must return a `SessionInitiationResult` labeled `AUTO_CLOSE_LIMIT_REACHED`. 
> 3. Add a specialized Telegram message explaining: "This session has reached its high-fidelity limit. Results are now being synthesized in your AFFiNE workspace."
> 4. Ensure no further messages are processed for this specific `trigger_id` until a new daily monitor cycle occurs.

## ⌨️ TERMINAL (50-100 words)

```bash
# Securely store your Telegram and Groq tokens in AWS Secrets Manager
aws secretsmanager create-secret --name ccp/platform/v1 --secret-string '{"TELEGRAM_TOKEN":"your_token","GROQ_API_KEY":"your_key"}'

# Verify the webhook endpoint status (FastAPI backend must be running)
curl -X GET https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
# Expected: "url": "https://api.consciouscoaching.app/telegram/webhook", "has_custom_certificate": false

# Test the Groq transcription latency from a local sample
# Expected result in < 1000ms
python -m src.ccp.services.groq_transcriber --test ./tests/samples/voice_note.ogg
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Configure the Daily Initiator:** Open `scheduled_monitor.py` and set the `run_time_utc` to match your coach's peak creative window (typically 06:00 - 08:00 AM local).
2.  **Wire the Community Targets:** Update `tribe_soul.json` with the RSS feeds or subreddit URLs for the coach's specific audience community. This serves as the primary input for Stage 1 scraping.
3.  **Activate the Webhook:** Use the provided terminal command to register your production URL with the Telegram Bot API. Ensure SSL is active; Telegram will reject non-HTTPS endpoints.
4.  **Integrate the 3-5 Message Gate:** Execute the **Agent Prompt** from Section 4 to inject the interaction limit logic into `scheduled_monitor_service.py`. This prevents the bot from drifting into low-value, open-ended conversation.
5.  **Run the Novelty Test:** Manually trigger Stage 2 with a known "chronic" topic. Verify the system returns a `silent_abort` and does NOT send a Telegram message.

## ✅ VERIFY (30-50 words)

Run the end-to-end integration test: `pytest tests/test_platform.py -k test_scheduled_prompt_flow`. **Binary Pass:** Bot sends a 3-part observation prompt -> Voice note is transcribed -> Session Initiation Signal (M2) is emitted to the CRAL Orchestrator. 

## 🔗 BRIDGE (30-50 words)

Unit 10.1 established the scheduled initiation loop. Unit 10.2 builds on this by introducing **Social Penetration Theory (SPT)**—defining exactly how deep the bot’s 3rd part (the Closing Question) can push based on the client's current intimacy stage.

<!-- FACT-CHECK: "Telegram Bot API webhooks standard 2026" → Webhooks confirmed as the production standard for serverless/high-scale architectures in 2026. -->
<!-- FACT-CHECK: "Whisper-large-v3-turbo Groq 2026 status" → Confirmed as the performance leader for < 1s inference in voice-note transcription pipelines. -->
