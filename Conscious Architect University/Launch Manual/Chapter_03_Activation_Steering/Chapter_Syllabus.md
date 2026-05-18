# Chapter 03 Syllabus — Activation Steering & Dual-Stack Fine-Tuning

**Chapter Position:** Part I: The Sovereign Physics & Perception Layer
**Prerequisite:** Chapter 02 (Transformer Physics)
**Unlocks:** Chapter 04 (Matrix of Edging & Perceptual Primitives)
**Primary Research Sources:** CCV_Concepts_Deep_Dive.md · RISER · AUSteer · HYPERSteer · WAS · EAST · ALLoRA · SparseGrad · Selective Steering · ESR · LoRA Learns Less · LoRA vs FFT

---

## Chapter Objective

The operator will implement the full **Dual-Stack Fine-Tuning + Activation Steering** architecture. This chapter is the engineering core of the sovereign model layer. By the end, the operator knows exactly **how to encode Voice DNA into model weights** (LoRA/SparseGrad), **how to dynamically steer agent cognition** (RISER, AUSteer, WAS), and how to protect the system from both coherence collapse and adversarial counter-steering.

**Governing Principle:** Steer the Cognition. Prompt the Procedure. Never confuse the two.

---

## Unit Index

### Unit 3.1 — The Dual-Stack Mandate: Why LoRA Is Not Enough
**Source:** LoRA Learns Less & Forgets Less · LoRA vs FFT: An Illusion of Equivalence · Fragile Knowledge Width Pruning
**Core Teaching:**
- LoRA operates in a mathematically constrained low-rank subspace: ideal for *stylistic adaptation*, catastrophic for *encyclopedic knowledge injection*
- **The Mandate:** LoRA on Attention blocks for Voice DNA. SparseGrad on MLP blocks for format compliance. RAG + Neo4j for factual knowledge. Never blend these layers.
- Width pruning of MLP blocks paradoxically *improves* instruction-following (+46-75% IFEval) — pruned SLMs become sharper execution engines

**Deliverable:** Dual-Stack data segregation table (what goes in LoRA, what goes in Neo4j, what goes in SparseGrad)

---

### Unit 3.2 — ALLoRA & SparseGrad: Precision Fine-Tuning Without Forgetting
**Source:** ALLoRA · SparseGrad
**Core Teaching:**
- **ALLoRA:** Adaptively adjusts the per-matrix learning rate of A and B LoRA matrices based on gradient variance. Prevents catastrophic forgetting of base model reasoning while locking in high-volatility CCV stylistic overlays.
- **SparseGrad:** Converts MLP layer gradients into sparse structure — only ~1% of MLP neurons remain significant. Outperforms LoRA on MLP blocks with identical memory requirements.
- Combined strategy for Qwen-3.5: ALLoRA on attention → Voice DNA styles. SparseGrad on MLP → JSON format compliance.

**Deliverable:** Training configuration blueprint for Qwen-3.5 (ALLoRA + SparseGrad dual application)

---

### Unit 3.3 — The Mechanics of Combinatorial Controlled Variation (CCV)
**Source:** CCV_Concepts_Deep_Dive.md · Combinatorial Controlled Variation paper
**Core Teaching:**
- Disentangling semantic concepts into orthogonal control vectors (Tone, Pedagogy, Formality, Mood State)
- The 22-archetype × 4-mood-state matrix — building without centroid behavioral averaging
- A Unified LoRA Variant Taxonomy: rank allocation strategies for CCV-specific adaptation
- **The Key Promise:** A fully trained CCV Qwen-3.5 drops prompt payload by ~2,300 tokens per JIT compile

**Deliverable:** CCV vector space diagram (orthogonal axis layout for 22 archetypes)

---

### Unit 3.4 — High-Precision Latent Control: AUSteer & Selective Steering
**Source:** AUSteer (Fine-Grained Activation Steering) · Selective Steering (Norm-Preserving Control)
**Core Teaching:**
- **AUSteer:** Abandons block-level steering entirely. Isolates intervention to specific Atomic Units (individual heads or neurons) responsible for a given concept. Eliminates "generation collapse" from blunt steering.
- **Selective Steering:** Calculates discriminative threshold per layer. Only applies norm-preserving rotations at layers where contrastive features are maximally opposed. Zero coherence collapse guaranteed.
- Combined: AUSteer identifies *what* to steer. Selective Steering identifies *where* to apply it safely.

**Deliverable:** CCP steering precision protocol (AUSteer target selection → Selective Steering layer validation)

---

### Unit 3.5 — Dynamic Controllers & HyperNetworks: WAS & HYPERSteer
**Source:** WAS (Weighted Activation Steering) · HYPERSteer
**Core Teaching:**
- **WAS:** Static steering vectors fail contextually. WAS trains a lightweight adapter that reads the current prompt and outputs dynamic, layer-specific weight scalars. Amplifies steering only when context requires it.
- **HYPERSteer:** A secondary Hypernetwork conditioned by natural language prompts generates precise activation manipulation weights end-to-end — enabling infinite CCV variant combinations without manual vector extraction.
- **CCP Application:** WAS runs on the FastAPI transit layer, dynamically adapting CA11 coaching constraints based on real-time Telegram WebSocket inputs. HYPERSteer automates CCV variant generation for the 22-archetype library.

**Deliverable:** FastAPI CCV Router integration diagram (RISER + WAS + Preplan-Anchor alignment)

---

### Unit 3.6 — EAST & Endogenous Resistance: Mastering the Confidence Loop
**Source:** EAST (Entropic Activation Steering) · ESR (Endogenous Steering Resistance)
**Core Teaching:**
- **ESR:** Models self-correct against semantically incongruent steering vectors. If CCV mood vectors are injected at the wrong geometry, they wash out by the final layer.
- **EAST:** Directly manipulates the entropy of the predictive distribution at specific hidden layers. Injects controlled uncertainty at the confidence vector to break agent overconfidence loops.
- **CCP Application:** EAST is the mechanism the Pipecat AI Moderator uses during Roleplay interrupts. When an agent locks into a hallucinated coaching action, EAST forces exploration of alternative reasoning branches.

**Deliverable:** Confidence entropy injection spec for the Pipecat AI Moderator

---

### Unit 3.7 — RISER: The Ultimate FastAPI CCV Router
**Source:** RISER (Orchestrating Latent Reasoning Skills for Adaptive Activation Steering)
**Core Teaching:**
- RISER trains a meta-router that dynamically analyzes token context and activates a curated mixture of latent cognitive primitives — blending, scaling, and terminating interventions token-by-token
- **CCP Application:** RISER is the central nervous system of the FastAPI transit layer. It reads Mood State Resonance variables (Interrupts, Empathy, Socratic Logic) from the Telegram WebSocket and composes the exact psychological response vector needed to convert a CBCS user in real time.
- Integration with Preplan-Anchor: RISER aligns its intervention timing to the model's intrinsic preplan token to guarantee perceptual primitive activation fires correctly.

**Deliverable:** RISER integration blueprint for `fastapi_transit_layer.py`

---

## Chapter Exit Gate

The operator must pass a practical exercise:
1. Specify which fine-tuning method (ALLoRA, SparseGrad, or standard LoRA) applies to each of the 3 training tasks: Voice DNA style, JSON format compliance, CA11 reasoning
2. Trace a RISER intervention from Telegram WebSocket input → FastAPI → Activation Vector → Pipecat Moderator response
3. Explain why ESR requires semantic congruence and how Selective Steering prevents norm distortion
4. Explain why HYPERSteer is necessary to scale from 4 CCV archetypes to 22+
