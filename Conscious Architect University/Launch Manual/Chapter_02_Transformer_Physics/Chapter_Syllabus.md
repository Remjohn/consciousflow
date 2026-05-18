# Chapter 02 Syllabus — Transformer Physics & Latent Inference

**Chapter Position:** Part I: The Sovereign Physics & Perception Layer
**Prerequisite:** Chapter 01 (Systems Architecture)
**Unlocks:** Chapter 03 (Activation Steering)
**Primary Research Sources:** Attention Heads Survey · Preplan-and-Anchor · Residual Stream Duality · Thinking Sparks · KV-Direct · RLKV · Endogenous Steering Resistance

---

## Chapter Objective

The operator must understand the *physical substrate* of every tool they will use in Chapters 03-15. This chapter dismantles the black box. By the end, the operator knows exactly where in the transformer stack their interventions will land, which heads to target, why KV cache explodes in long sessions, and what happens when RL training "sparks" new reasoning circuits.

**Governing Principle:** You cannot steer what you cannot see. Activation Steering without Transformer Physics is astrology.

---

## Unit Index

### Unit 2.1 — What Are Transformers Actually Doing?
**Source:** Endogenous Steering Resistance paper
**Core Teaching:**
- The token prediction loop: input → embedding → residual stream → attention → MLP → logits
- What "next-token prediction" really means at a geometric level (vectors in high-dimensional space)
- **Endogenous Steering Resistance (ESR):** Models actively push back against misaligned latent interventions in subsequent layers. This is why blunt steering collapses into garbage. Introduces the concept that steering vectors must be *semantically congruent* with the internal representation geometry to persist.

**Deliverable:** Conceptual diagram of the residual stream depth-axis

---

### Unit 2.2 — Attention Head Anatomy: Induction & Reasoning Heads
**Source:** Attention Heads of Large Language Models: A Survey
**Core Teaching:**
- The four cognitive stages mapped to head types:
  1. **Knowledge Recalling Heads** — retrieve stored Voice DNA
  2. **In-Context Identification Heads** — parse the Roleplay/Telegram input
  3. **Latent Reasoning Heads** — evaluate CA11 constraints
  4. **Expression Preparation Heads** — format the final script output
- Induction heads, copy-suppression heads, and retrieval heads as distinct functional circuits
- **Why this matters for CCP:** We target Activation Steering interventions at specific head *types*, not arbitrary layers. This prevents the coherence collapse that destroyed previous blunt-vector approaches.

**Deliverable:** CCP Attention Head Targeting Matrix (which head type, which task)

---

### Unit 2.3 — The Preplan-and-Anchor Rhythm
**Source:** Attention Illuminates LLM Reasoning: The Preplan-and-Anchor Rhythm
**Core Teaching:**
- Every complex generation follows a `[PREPLAN token] → [ANCHOR token] → [reasoning chain]` pattern
- Windowed Average Attention Distance (WAAD) and Future Attention Influence (FAI) as measurable signals
- **CCP Application:** The model "finds the funny" or "finds the tension" at the Preplan-Anchor transition point. CCV steering vectors must be injected *before* the preplan token forms to guarantee the correct perceptual primitive activates.

**Deliverable:** CCV injection timing diagram mapped to the Preplan-Anchor rhythm

---

### Unit 2.4 — The Residual Stream Duality
**Source:** Residual Stream Duality in Modern Transformer Architectures
**Core Teaching:**
- Two independent axes: **sequence position** (self-attention) and **layer depth** (residual addition)
- Information accumulates along the depth axis via fixed, additive operations
- **CCP Application:** Informs layer selection for Activation Steering. CCV vectors must be applied at the layer depth where the target concept's residual representation is *maximally discriminative*. Injecting too early = absorbed. Too late = overridden by MLP normalization.

**Deliverable:** Layer selection heuristic for CCV vector injection

---

### Unit 2.5 — KV Cache Physics & Core Compression
**Source:** KV-Direct, RLKV, HeadKV papers
**Core Teaching:**
- What the KV Cache is: pre-computed key-value pairs stored across every layer for every token
- Why it explodes: a 20-turn Roleplay session on Pipecat can generate 136 KB/token of KV data
- **KV-Direct:** Recomputes KV pairs from the residual stream checkpoint (5 KB/token, 27× reduction, zero reconstruction error)
- **RLKV:** Uses RL to identify which heads are reasoning-critical → full cache protection. The rest → compressed.
- **HeadKV:** Per-head cache allocation based on retrieval vs. reasoning importance

**Deliverable:** KV Cache budget allocation table for a 20-turn Pipecat coaching session

---

### Unit 2.6 — Thinking Sparks: How RL Training Grows Reasoning Heads
**Source:** Thinking Sparks: Emergent Attention Heads in Reasoning Models During Post Training
**Core Teaching:**
- SFT/distillation: gradually *adds* stable reasoning heads (cumulative)
- GRPO: operates in *dynamic search mode* — few heads activated, evaluated, pruned by reward signal
- **"Think on/off" models do NOT have dedicated thinking heads** — they use broader, less efficient compensatory circuits
- **CCP Application:** When we apply GRPO to Qwen-3.5 for Conviction Density and humor triggering, we will develop DEDICATED perceptual heads. These must be identified and protected via RLKV. Monitors head emergence during every RL training checkpoint.

**Deliverable:** RL training checkpoint monitoring protocol for head emergence

---

## Chapter Exit Gate

The operator must pass a written exercise explaining:
1. Which of the 4 head types handles Voice DNA recall vs. CA11 constraint evaluation
2. Why steering at the wrong layer causes coherence collapse
3. How Preplan-Anchor timing determines perceptual primitive activation
4. Why KV-Direct eliminates the 20-turn session latency problem without lossy eviction
