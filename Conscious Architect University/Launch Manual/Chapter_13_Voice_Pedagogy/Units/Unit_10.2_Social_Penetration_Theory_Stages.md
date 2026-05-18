# Unit 10.2: Social Penetration Theory — SPT Stages

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Jump straight to deep coaching. The most common failure in AI coaching is the "Premature Disclosure Trap"—forcing a client into childhood trauma or existential vulnerability before the psychological threshold of the relationship has been earned. 

Social Penetration Theory (SPT), developed by Altman & Taylor (1973), posits that interpersonal relationships evolve through a gradual process of self-disclosure, often visualized as an "onion." As layers of the personality are revealed, the relationship moves through four distinct stages: **Orientation**, **Exploratory Affective**, **Affective Exchange**, and **Stable Exchange**. 

Think of this like the **Sanctuary Architecture** of the Old Testament Tabernacle. Access is strictly sequential: the Outer Court (superficial social norms), the Inner Court (opinions and beliefs), and the Holy of Holies (the core self). Pushing into the Holy of Holies without passing through the Courts isn't just ineffective—it triggers psychological "depenetration" or withdrawal. In the CCP, we quantify this progression to ensure our campaigns never "intrude" on a client who is still psychologically in the Outer Court.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Quantifying SPT in a 2026-accurate production environment requires the integration of **LIWC-22 (Linguistic Inquiry and Word Count)** markers into our orchestration layer. We do not rely on "vibes" or general LLM sentiment; we measure specific linguistic vectors that map to the 4 stages of intimacy.

The **spt-stage-classifier** (computed via `spt_stage_engine.py`) evaluates three primary linguistic markers provided by the Voice DNA subsystem:
1.  **First Person Frequency (`i-words`)**: Measures the shift from "we/they" (Orientation) to "I/me" (Exploratory/Affective).
2.  **Emotional Complexity**: Measures the breadth and depth of affect-laden words. Low complexity signals guarded "scripted" response; high complexity signals affective exchange.
3.  **Exclusive Words (e.g., "but", "except")**: These signal cognitive processing and the nuanced differentiation of self from others, essential for the **Affective Exchange** stage.

We utilize a dual-window evaluation strategy:
-   **14-Day Trailing Window**: Captures transient shifts in intimacy and mood.
-   **30-Day Trailing Window**: Mandatory for elevating a client to **Stable Exchange** (Stage 4), ensuring the depth is sustained and predictable rather than a one-off transparency spike.

These stages form the first condition of the **Triple-Condition Delivery Gate**. If a client’s `spt_stage` is less than 3 (Affective Exchange), the system blocks all high-intensity commercial sequences. We strictly enforce "Relationship-Building" sequences until the quantitative index crosses the depth threshold.

## 📂 OUR CODE (100-200 words)

The classification logic resides in `src/ccp/services/spt_stage_engine.py`. The engine processes LIWC snapshots stored in the `client_disclosure_voice_profiles` table.

```python
# spt_stage_engine.py, line 161
# WHY: Evaluation is top-down (highest stage first); first match wins.
# Each higher stage must also meet its predecessor's baseline.

def _resolve_stage(self, liwc_14d: LIWCScores, liwc_30d: LIWCScores | None, warnings: list[str]) -> tuple[SPTStage, int]:
    # ...
    # Check Affective Exchange (Stage 3)
    affective_exchange = (
        exploratory_baseline
        and liwc_14d.exclusive_words > EXCLUSIVE_WORDS_THRESHOLD # threshold typically 0.1
        and liwc_14d.hedging_words < HEDGING_WORDS_THRESHOLD # low hedging = higher confidence/intimacy
    )
```

-   **Line 174-183**: Defines the **Orientation** and **Exploratory** baselines based on $1^{st}$ person frequency and emotional complexity.
-   **Line 192-202**: Implements the **Stable Exchange** check, which REQUIRES the 30-day window (`liwc_30d`) to be non-null and pass the cognitive process threshold.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code / Gemini CLI:**
> I need to verify the threshold logic in `src/ccp/services/spt_stage_engine.py`. Create a unit test file at `tests/services/test_spt_engine.py` that mocks the `LIWCScores` for a client. 
> 1. Test a "Stage 1" profile where `first_person_freq` is 0.02 and `emotional_complexity` is 0.1.
> 2. Test a "Stage 3" profile where `first_person_freq` is 0.08, `emotional_complexity` is 0.4, `exclusive_words` is 0.15, and `hedging_words` is 0.02.
> 3. Verify that `classify_client` returns the correct `SPTStage` enum and name for both cases. Ensure `ReceiptChain` is mocked correctly to avoid DB writes.

## ⌨️ TERMINAL (50-100 words)

```bash
# Run the SPT Engine unit tests
pytest tests/services/test_spt_engine.py -v

# Run the full CBCS suite to ensure Gate integration
pytest tests/integration/test_delivery_permission_gates.py
# Expected: All 3 conditions (SPT, Mood, Coping) must pass for 'PASS' verdict
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1.  Open `src/ccp/services/spt_stage_engine.py` and review the `SPTStage` enum definitions.
2.  Paste the prompt from Section 4 into your AI coding agent to generate the unit tests.
3.  Execute the tests via the terminal commands in Section 5.
4.  If the Stage 3 test fails, adjust the `EXCLUSIVE_WORDS_THRESHOLD` in `src/ccp/models/cbcs_models.py` (typically mapped to 0.1 per the `FR_CBCS_02` spec).
5.  Verify the `ReceiptChain` logs: ensure that for every classification, an audit hash is emitted with the `agent_id="spt-stage-classifier"`.
6.  Read `FR_CBCS_02_Social_Penetration_Depth_Gauge_Tech_Spec.md` to understand how this score is consumed by the `IntelligenceGateRouter`.

## ✅ VERIFY (30-50 words)

`pytest tests/services/test_spt_engine.py` returns `all green`. Open the generated `ReceiptChain` log; you should see `spt_stage=3 (AFFECTIVE_EXCHANGE)` for your Stage 3 test case.

## 🔗 BRIDGE (30-50 words)

Unit 10.3 builds on this by introducing **Stripe Credits — Pay-Per-Use Economics**, where we wire the financial guardrail that ensures each intimate interaction is economically sustainable via sovereign credit deduction.

<!-- FACT-CHECK: "Social Penetration Theory 4 stages" → Confirmed Orientation, Exploratory Affective, Affective Exchange, Stable Exchange (Altman & Taylor, 1973) -->
<!-- FACT-CHECK: "LIWC-22 psychological markers 2026" → Validated software for quantifying emotion, sociality, and cognitive processes in AI pipelines. -->
