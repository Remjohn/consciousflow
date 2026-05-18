# Implementation Plan: Unit 10.2 (Social Penetration Theory — SPT Stages)

Authoring Unit 10.2 for Chapter 10 of the Conscious Architect University Launch Manual. This unit addresses the psychological framework of Social Penetration Theory (SPT) and its implementation as a quantitative "Intimacy Index" using LIWC-22 markers in the CCP orchestration layer.

## User Review Required

> [!IMPORTANT]
> This unit maps to `spt_stage_engine.py` and references high-fidelity science sources: `FR_CBCS_02`, `FR_CBCS_07`, and the `Variable Reinforcement` lab paper. The build target is the classification logic itself.

> [!NOTE]
> The content will strictly adhere to the **Eight-Section Expansion Protocol** and the **2026-accurate tech stack**, utilizing **LIWC-22** for psychological quantification.

## Proposed Changes

### [Launch Manual Content]

#### [NEW] [Unit_10.2_Social_Penetration_Theory_Stages.md](file:///d:/Work/The%20Conscious%20Coaching%20Factory/Conscious%20Architect%20University/Launch%20Manual/Chapter_10_Platform/Units/Unit_10.2_Social_Penetration_Theory_Stages.md)
Creation of the full unit content (700-1140 words) following the mandates of `launch_manual_governance_skill.md`:

- **Section 1: 🧠 THE SCIENCE** — Social Penetration Theory (Altman & Taylor), the "Onion Model," and the 4 stages of intimacy. **UNLEARN:** "Jump straight to deep coaching." **Analogy:** The Sanctuary Architecture (Outer Court → Inner Court → Holy of Holies) as a structural map for psychological access.
- **Section 2: 🧠 TECHNICAL KNOWLEDGE** — Mapping LIWC-22 markers (First Person Frequency, Emotional Complexity, Exclusive Words, Hedging) to SPT stages. Explanation of the 14-day vs. 30-day trailing windows and the "Triple-Condition Delivery Gate" logic.
- **Section 3: 📂 OUR CODE** — Direct mapping to `spt_stage_engine.py` (line 161+), specifically the `_resolve_stage` method and the LIWC thresholds.
- **Section 4: 🤖 AGENT PROMPT** — Prompt for unit testing the `SPTStageEngine` with synthetic LIWC scores.
- **Section 5: ⌨️ TERMINAL** — Execution of `pytest` for the stage engine.
- **Section 6: ✅ IMPLEMENTATION STEPS** — Sequential verification of the classification logic and threshold tuning.
- **Section 7: ✅ VERIFY** — Concrete binary check for stage transition using a mock client profile.
- **Section 8: 🔗 BRIDGE** — Transition to Unit 10.3 (Stripe Credits — Pay-Per-Use Economics).

## Open Questions

- No open questions. The technical specifications and science sources provide exhaustive detail.

## Verification Plan

### Automated Tests
- Word count verification (700-1140 range).
- Structural audit (8 sections mandatory).
- Fact-check verification via `<!-- FACT-CHECK: ... -->` comments.

### Manual Verification
- Code path verification for `spt_stage_engine.py`.
- Tone audit for "Warm Precision."
