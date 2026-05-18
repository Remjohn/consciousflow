# Unit 10.4: The Onboarding Flow — User → Client

## 🧠 THE SCIENCE (155 words)

**UNLEARN:** Onboarding is a manual, administrative checklist. In the CCP architecture, onboarding is a high-fidelity "Metamorphosis" where a digital stranger is structurally transformed into a known client profile. If you treat onboarding as a form-filling exercise, you trigger the "Administrative Withdrawal" response in clients, killing the dopamine loop before it begins.

Think of this transition like a "Rite of Passage" in liturgical architecture. The user begins in the *Narthex* (the Telegram bot), a public-facing portico. Through the act of sending their first voice note, they cross the threshold into the *Sanctuary* (their private Workspace). This isn't just data entry; it is the ontological creation of their identity within your system.

By applying Social Penetration Theory (SPT), we ensure the first interaction matches their "Orientation" stage. We don't ask for deep secrets yet; we capture their "Voice DNA" (TTT baseline) to calibrate the system to their unique frequency, ensuring every subsequent prompt feels like an echo of their own soul.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

The onboarding flow operates as a 5-step state machine triggered by the Telegram `/start` command. In 2026, we utilize **Telegram Webhooks** rather than long-polling to achieve sub-second response times. When a user joins via a coach's deep-link (e.g., `t.me/CCPBot?start=COACH_ID`), the `ClientOnboarding` service initiates the lifecycle.

1. **Identity Birth:** The system generates a unique **Person ID** (e.g., `CCC-1234`) and provisions a **User Node** in Neo4j. This node is the root of their cognitive graph, mapping their future breakthroughs and resistance patterns.
2. **Voice DNA Capture:** The client is prompted for a 30-second "Introduction." Their response (Opus-encoded OGG) is intercepted by the **Telegram Bot API Local Server**. We use **FFmpeg** to convert this to 16kHz WAV and pass it to a local **Nvidia NIM container running Whisper large-v3-turbo**.
3. **TTT Extraction:** The `TTTBaselineExtractor` analyzes the transcription and audio physics (pitch, pace, pauses) to create the initial "Voice Fingerprint." This prevents identity spoofing and sets the "Warmth Threshold" for the agent's responses.
4. **Workspace Provisioning:** The `AFFiNEWorkspaceProvisioner` calls the BlockSuite API to create a single-tenant, private workspace pre-loaded with the program's `PantryConfig` templates.
5. **Scheduled Ritualization:** Finally, the `RitualScheduler` wires the client into the **EventBridge Scheduler**, setting the first accountability clock based on the program's defined cadence (e.g., Tuesdays and Thursdays at 08:00).

## 📂 OUR CODE (145 words)

Our implementation is centered in `src/ccp/services/client_onboarding.py`. This service orchestrates the transition from raw Telegram payload to a fully provisioned client.

Reference: `client_onboarding.py`, lines 31-87:
```python
# client_onboarding.py, line 41
# WHY: We must assign a deterministic Person ID early to act as 
# the foreign key across Neo4j, Supabase, and AFFiNE.
person_id = self._assign_person_id(telegram_user)

# client_onboarding.py, line 47
# WHY: The Neo4j User Node must exist BEFORE workspace 
# provisioning to allow the Provisioner to link the workspace URL 
# back to the graph identity.
graph.create_user(person_id=person_id, ...)

# client_onboarding.py, line 58
# WHY: Onboarding is NOT complete until the first session is scheduled.
# This prevents "orphan clients" who join but are never prompted.
scheduler = RitualScheduler(coach_acronym=self.coach_acronym)
```

⚠️ **BUILD REQUIRED —** The `_capture_voice_dna` method must be added to handle the STT-to-Fingerprint extraction logic.

## 🤖 AGENT PROMPT (120 words)

> **Prompt for Pi / Claude Code:**
> `EXTEND` the file `src/ccp/services/client_onboarding.py` to include a new async method `capture_voice_dna(file_uuid: str)`. This method must:
> 1. Use the `GroqTranscriber` (already at `src/ccp/services/groq_transcriber.py`) to get the STT output from the `.wav` file at `/tmp/{file_uuid}.wav`.
> 2. Pass the transcription to our `TTTBaselineExtractor` (at `src/ccp/services/ttt_baseline_extractor.py`) to generate the `VoiceFingerprint`.
> 3. Save the resulting fingerprint JSON to `coaches/{coach_acronym}/clients/{person_id}/voice_dna.json`.
> 4. Update the Neo4j User node with the `has_voice_dna: true` property.
> Ensure you use `asyncio` for the transcription call to keep the onboarding loop responsive.

## ⌨️ TERMINAL (65 words)

```bash
# Verify the onboarding service can resolve the coach registry
python -m src.ccp.services.client_onboarding --test-registry

# Simulate a Telegram /start event for a test user
# Replace COACH_ID with your acronym (e.g., RJ)
# Expected: Welcome message generated in coach's voice tone
python scripts/test_onboarding.py --coach RJ --user_id 12345

# Check if the Neo4j node was created
cypher-shell "MATCH (u:User {telegram_id: '12345'}) RETURN u.person_id"
```

## ✅ IMPLEMENTATION STEPS (142 words)

1. **Wire the Webhook:** Ensure your Telegram Bot is set to webhook mode pointing to your FastAPI `onboarding/` endpoint.
2. **Extend the Service:** Run the **Agent Prompt** from Section 4 to implement the `capture_voice_dna` method in `client_onboarding.py`.
3. **Provisioning Logic:** Open `src/ccp/services/affine_workspace_provisioner.py` and verify that the `create_client_workspace` function correctly receives the `person_id`.
4. **Test the Loop:** Execute the `test_onboarding.py` script from the terminal.
5. **Verify the Graph:** Use the Cypher command in Section 5 to confirm the `User` node exists.
6. **Verify the Schedule:** Check the `coaches/{coach}/config/ritual_config.json` to ensure the cron string (e.g., `0 8 * * 2,4`) has been calculated for the new client.

## ✅ VERIFY (45 words)

Run `pytest tests/test_onboarding.py`. The test passes if:
1. A welcome message is returned.
2. A unique Person ID is assigned.
3. A Neo4j node is created.
4. An AFFiNE workspace provisioning request is logged in the `ReceiptChain`.

## 🔗 BRIDGE (32 words)

With the client now provisioned and scheduled, we must ensure their data persists through structural failures. Unit 11.1 introduces the **Dual-Database Architecture**, the bedrock of our high-availability persistence layer.

<!-- FACT-CHECK: "Telegram Bot API webhook limits 2026" → Standard limits remain, but Local API Server is standard for larger media and increased throughput. -->
<!-- FACT-CHECK: "Whisper large-v3-turbo 2026" → Available as a NIM container on build.nvidia.com, optimized for sub-100ms latency on H100/L40S GPUs. -->
<!-- FACT-CHECK: "Neo4j 6.0 GQL standards" → Full support for ISO GQL standard enables more portable property graph queries. -->
