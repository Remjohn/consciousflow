# Unit 06.07: Wiring the Scheduled Voice Tracking

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** An agentic assistant is not a 24/7 chatbot. In the CCP architecture, constant accessibility is a therapeutic failure. The presence of a persistent chat interface induces dependency and prevents the client from internalizing the coach's authority. 

Think of this like **Circadian Rhythms and Synaptic Scaling** in the human brain. The neocortex does not simply absorb information at a linear rate; it requires periods of "downscaling"—specifically during slow-wave sleep—to prune weak synaptic connections and consolidate high-leverage ones. If the brain were "always-on" without rest, it would succumb to catastrophic interference and informational obesity. 

Our **4+1+2 template** (4 Active Rituals, 1 Reflection Point, 2 Rest Days) mirrors this biological mandate. We physically block the system on Rest Days to force the client to operate on their own "psychological capital," consolidating the week's interventions. We don't wait for the client to speak; we trigger the session based on a program-dependent cadence, ensuring the coach's voice remains the dominant rhythmic driver in the client's life.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The Scheduled Voice Tracking loop is the primary mechanism for maintaining the "High-Frequency Accountability" required for behavioral change. Unlike a standard RAG-based chatbot, this system is **cron-triggered and state-dependent**. 

The architecture operates in a four-stage asynchronous pipeline:
1.  **Cadence Enforcement:** The `JournalingCronCheck` queries the `PantryConfig` to determine if today is an eligible "Active" or "Reflection" day. It checks for **Rest Day Blocking** (Stage 1) and verifies the **Weekly Quota** (e.g., 2x or 3x/week) has not been exceeded.
2.  **Trajectory Mapping (Atlas):** If approved, the **Atlas agent** maps the client's current `CapacityTrack` (Recovery, Foundation, Growth, Momentum, Peak) and `MoodState` to a specific `ArtisanDirective`. A critical safety constraint here is **Anti-Escalation**: we physically block any progression beyond the Foundation track for the first 14 days of a program (`ANTI_ESCALATION_MIN_DAYS`), regardless of the client's self-reported "Motivation."
3.  **Generative Assembly:** The **Artisan agent** builds a program-specific prompt (DEP-ENG-024) limited strictly to ≤75 words to maximize friction and clarity. 
4.  **Async Processing (Whisper):** Once the client responds with a voice note, the system triggers the `GroqTranscriber`. Using **Whisper Large-v3-Turbo** on Groq's LPU infrastructure, we achieve 216x real-time transcription speeds. This allows us to ingest the audio, process it through the 4-agent pipeline (Aria, Kimya, Guardian, Vidye), and return a response within a 5-second window.

## 📂 OUR CODE (100-200 words)

The logic for this windowed interaction lives across three primary files:

- `src/ccp/services/dynamic_journaling_engine.py`: This is the brain of the loop.
  ```python
  # dynamic_journaling_engine.py, line 228
  # WHY: The Anti-escalation gate prevents premature psychological challenge.
  # If the client is < 14 days in, they are LOCKED to Foundation track.
  if current_day < ANTI_ESCALATION_MIN_DAYS and capacity_track in high_intensity:
      capacity_track = CapacityTrack.FOUNDATION
      escalation_blocked = True
  ```
- `src/ccp/models/onboarding_prerequisite_models.py`: Defines the `PantryConfig`, a per-coach configuration object that isolates check-in frequencies and Rest Day indices (ADR-01).
- `src/ccp/services/groq_transcriber.py`: Handles the async STT layer. Note line 50: we use `whisper-large-v3-turbo` to ensure the sub-5s response target is met without sacrificing accuracy for the Aria processor.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Pi:**
> "I need to audit the scheduling logic in `src/ccp/services/dynamic_journaling_engine.py`. 
> 
> 1. Verify that `JournalingCronCheck.is_rest_day()` correctly identifies Saturday (6) and Sunday (7) by default.
> 2. Implement a new test case in a temporary `tests/test_cadence.py` file that attempts to trigger a `DynamicJournalingEngine.generate()` call on a Rest Day (Day 7) and asserts that the returned value is `None` with the reason `REST_DAY_BLOCKED`.
> 3. Use the `PantryConfig` for coach 'EMI' with a `journaling_frequency` of 3.
> 
> Ensure the test doesn't actually call any external APIs like Groq or Gemini; mock all external dependencies."

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the Groq transcription service is healthy
# (Requires GROQ_API_KEY to be set in .env)
python -m src.ccp.services.groq_transcriber --test-file tests/assets/test_voice_note.ogg

# Search for the anti-escalation constant definition
grep -r "ANTI_ESCALATION_MIN_DAYS" src/ccp/models/

# Expected Output:
# src/ccp/models/onboarding_prerequisite_models.py:25: ANTI_ESCALATION_MIN_DAYS = 14
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  **Configure the Pantry:** Open `src/ccp/models/onboarding_prerequisite_models.py` and verify `DEFAULT_REST_DAYS` includes 3 (Wednesday) and 7 (Sunday). This establishes our 4+1+2 baseline.
2.  **Audit the Gate:** Open `src/ccp/agents/morgan_orchestrator.py` and search for `gate_manual_trigger` (line 240). Note that this gate *must* be the first logic check in every production loop to repel manual trigger attempts (AC4 compliance).
3.  **Run the Cadence Test:** Execute the prompt from Section 4 in your Claude Code console. This will generate a unit test to prove that the **Cron Trigger Check** successfully blocks checks on Rest Days.
4.  **Verify the Anti-Escalation:** In `dynamic_journaling_engine.py`, locate `AtlasTrajectoryMapper.map` (line 213). Ensure the `escalation_blocked` flag is correctly emitted when a client on day 10 attempts to enter the "Growth" track.
5.  **Test Transcription:** Run the terminal command from Section 5 using a small sample `.ogg` file to verify the Whisper v3 turbo integration.

## ✅ VERIFY (30-50 words)

`pytest tests/test_cadence.py` → all green. This proves the system correctly identifies and blocks prompts on Rest Days, enforcing the **4+1+2 structural integrity** of the coaching program.

## 🔗 BRIDGE (30-50 words)

Unit 07 Chapter 06 is now complete. We have wired the agentic core to the client's calendar. Chapter 07: The CMF Pipeline builds on this by taking the transcriptions we just generated and transforming them into visual cinematic feedback.

---
<!-- FACT-CHECK: "Whisper large-v3-turbo Groq performance 2026" → Benchmarked at 216x real-time, 4 decoder layers vs 32 in full model, < 5s latency for voice notes. -->
<!-- FACT-CHECK: "LangGraph 0.3 persistence 2026" → Core feature using Checkpointers and thread_id for state recovery in cyclic graphs. -->
