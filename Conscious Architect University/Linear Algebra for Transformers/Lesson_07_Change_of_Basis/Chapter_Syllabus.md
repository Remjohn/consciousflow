# Lesson 7: Change of Basis — Chapter Syllabus

## Lesson Declaration

**Mathematical Goal:** The student can represent the same vector in different coordinate systems (bases), compute the change-of-basis matrix, understand that the vector ITSELF doesn't change — only its description changes — and reason about why some bases make problems easier and others make them harder.

**Transformer Goal:** The student understands that each Transformer layer learns its OWN basis — its own coordinate system for meaning. The embedding layer represents words in one basis. By layer 12, the same token lives in a completely different basis that captures contextual relationships impossible to express in the original. The student grasps that embeddings are "uninterpretable" precisely because they're encoded in the MODEL'S basis, not a HUMAN-readable one.

**CCP Goal:** The student understands why KV-Direct (Paper #51) achieves 27× memory compression by storing residual stream vectors instead of full K/V caches — because the residual stream IS the universal basis from which all layer-specific K/V can be deterministically re-derived. Why RLKV (Paper #53) uses RL to discover which attention heads form the "reasoning basis" — the minimal set of heads sufficient for generative reasoning. And why Thinking Sparks (Paper #52) shows that post-training creates entirely NEW basis directions (heads) that didn't exist in the pre-trained model.

**Prerequisites:** Lessons 1-6. Particularly Lesson 6 (Projections — basis change = projecting onto new axes) and Lesson 5 (Matrix Multiplication — basis change IS a matrix operation).

**Estimated Time:** 5-6 hours across all 4 layers.

---

## The Core Narrative

A footballer performing brilliantly is the same footballer regardless of whether you rate them on a speed/strength scale or an offense/defense scale. The stats change. The player doesn't.

This is change of basis. The same vector — the same OBJECT in space — can be described using different coordinate systems. Switch from speed/strength axes to offense/defense axes and the numbers change completely, but the vector (the actual player) hasn't moved.

Why does this matter for Transformers? Because every layer of a Transformer operates in its own learned basis. At layer 0, the model represents "bank" using dimensons that roughly correspond to word frequency, grammatical role, and general semantics. By layer 12, the SAME token's vector now encodes contextual meaning: "financial institution" vs "river bank." The vector has been transformed into a DIFFERENT basis where contextual distinctions are prominent and superficial features are suppressed.

This is why embeddings are "uninterpretable." When you print a 768-dimensional vector, you see 768 numbers. But those numbers are coordinates in the MODEL'S learned basis — not a human-readable basis like [happy, sad, angry, formal]. To understand what the model encodes, you need to either (a) find the model's basis and translate, or (b) project onto interpretable directions (Lesson 6). Interpretability research IS basis discovery.

And here is the infrastructure breakthrough: KV-Direct (Paper #51) proves that Keys and Values at every layer are deterministic projections of the RESIDUAL STREAM. The residual stream is the universal basis — it carries ALL information. K and V at layer L are just basis changes FROM the residual stream INTO that layer's attention subspace. If you store the 5KB residual vector per token instead of the 136KB K/V pairs across all layers, you can re-derive ANY layer's K/V on demand with ZERO reconstruction error. 27× memory reduction, bit-identical outputs.

---

## CCP Research Paper Integration (3 Papers)

| # | Paper | Score | Role | Integration |
|---|-------|-------|------|-------------|
| 1 | **#52 Thinking Sparks — Emergent Attention Heads** | 92 | 🟢 Foundation | Post-training for complex reasoning (GRPO, distillation, SFT) sparks the EMERGENCE of new, functionally specialized attention heads. These heads didn't exist in the pre-trained model — they represent NEW BASIS DIRECTIONS in the model's representation space. The student sees: training doesn't just adjust existing basis vectors — it creates ENTIRELY NEW ONES. Distillation creates stable, cumulative basis expansions. GRPO creates dynamic, task-reward-searching basis adjustments. **Show:** How pre-trained Qwen-3.5 has no dedicated "coaching empathy" heads, but after GRPO training with CCV objectives, 3-5 new heads emerge that specifically activate on empathetic coaching constructions — these heads ARE new basis vectors in attention space. |
| 2 | **#53 RLKV — RL-Guided KV Cache Compression** | 90 | 🟡 Mechanism | RLKV uses reinforcement learning as a PROBE to discover which heads contribute to reasoning quality. The key insight: not all heads form the reasoning basis. Some heads are retrieval-only, some are formatting-only, some are genuinely reasoning-critical. RLKV discovers the MINIMAL REASONING BASIS — the smallest set of heads whose K/V cache must be preserved at full fidelity for reasoning to survive. All other heads can be compressed. **Show:** How RLKV tests each head's contribution by evicting its cache and measuring reasoning degradation. Heads that cause zero degradation when evicted = NOT part of the reasoning basis. Heads that cause catastrophic degradation = ESSENTIAL basis directions. The CCP protects these heads with full cache during 20+ turn Roleplay sessions. |
| 3 | **#51 KV-Direct — Residual Stream Is All You Need** | 91 | 🔴 Breakthrough | The residual stream is the UNIVERSAL BASIS from which all layer-specific K/V representations can be deterministically re-derived. KV-Direct stores one residual vector (5KB) per token instead of K/V pairs across all layers (136KB). The re-derivation is BIT-IDENTICAL — zero reconstruction error. Every eviction-based compression method (which operates IN a specific layer's basis) degrades to 5-28% quality. KV-Direct (which operates in the UNIVERSAL basis) maintains 100%. **Show:** The mathematical proof: K_l = residual_stream × W_K^l. V_l = residual_stream × W_V^l. Since W_K^l and W_V^l are fixed after training, knowing the residual stream = knowing ALL K/V at ALL layers. Storing the universal representation instead of 24 layer-specific representations = 27× compression. For the CCP's Pipecat Roleplay sessions: 20+ turns of full context at 5KB/token instead of 136KB/token. |

---

## 🔵 Exposure Layer — Content Directives

**Intuition Hook:** You rate a player two ways. System 1: speed=8, strength=6. System 2: offense=10, defense=4. Same player. Different numbers. Neither is "wrong" — they use different MEASUREMENT SYSTEMS. Now: which system is better? Depends on the question. If the coach asks "can they score?", the offense/defense basis answers directly. If the physio asks "can they sprint?", speed/strength answers directly. The best basis is the one that makes YOUR question easy to answer.

**Progressive Formalization Path:**
1. Same player, different stat systems — the player doesn't change, the numbers do
2. Standard basis: (1,0) and (0,1) — the most obvious axes
3. Alternative basis: (1,1) and (1,-1) — diagonal axes. Same 2D space, different coordinates
4. Change of basis = a matrix multiplication that converts coordinates from one system to another
5. Key insight: the BEST basis aligns its axes with the structure of the problem

**Worked Examples:**
1. **Simple basis change:** v = (2,0) in standard basis. New basis: b₁=(1,1), b₂=(1,-1). Express v in new basis: v = 1·b₁ + 1·b₂. New coordinates: (1,1). Same vector, different description.
2. **Why it matters:** In a problem about diagonal movement, the diagonal basis makes computation trivial — each component aligns with a meaningful direction.
3. **Model embedding example:** Word vector with coordinates (0.23, -0.81, 0.44, ...) in the model's basis. No human can read this. But if we could find the model's basis and translate to (happy: 0.1, formal: 0.8, technical: 0.6, ...), suddenly it's interpretable.

**Misconceptions to Address:**
1. ❌ "Changing basis changes the vector." → ✅ NEVER. The vector is a fixed point in space. Basis change only changes how you DESCRIBE it.
2. ❌ "There's one 'correct' basis." → ✅ No. Every basis is equally valid. Some are more USEFUL for specific tasks.
3. ❌ "Embeddings are in a 'standard' basis we can read." → ✅ Embeddings are in the model's LEARNED basis. Each dimension is a learned feature direction that may not correspond to any human concept.
4. ❌ "More basis vectors = more information." → ✅ No. In n dimensions, you need EXACTLY n independent basis vectors. More = redundant. Fewer = incomplete.

**Controlled Analogies:**
- ⚽ Speed/strength vs offense/defense — same player, different stat systems
- 🎵 Time domain vs frequency domain — same audio signal, different representation. Time basis makes editing easy. Frequency basis makes EQ easy. Same information, different basis.

**Compression Truth:** "A basis is a language for describing position. Changing basis is translation — the same idea in different words. Transformers learn their own languages for meaning, and interpretability is the work of translating from the model's language to ours."

---

## 🟡 Mechanistic Layer — Content Directives

**Formal Definition:** Given bases B = {b₁,...,bₙ} and C = {c₁,...,cₙ} for ℝⁿ, the change-of-basis matrix P from B to C satisfies: [v]_C = P[v]_B, where [v]_B denotes v's coordinates in basis B. P's columns = the basis vectors of B expressed in C's coordinates.

**Derivation Path:** Why matrices for basis change? Because expressing each old basis vector in the new coordinates IS a linear transformation. Each column of the change-of-basis matrix answers: "what does old basis vector j look like in the new system?" Stacked together, these answers form the matrix.

**Transformer Mapping:**
- **Layer-to-layer basis shift:** Each layer transforms the hidden state into a representation optimized for that layer's computation. Layer 1's basis might emphasize syntax. Layer 12's basis might emphasize semantics. Layer 24's basis might emphasize next-token prediction features.
- **Interpretability as basis discovery:** Probing = finding the basis where a concept (sentiment, toxicity, factuality) aligns with a single axis. If you find it, you can read the model's encoding of that concept directly.
- **Residual stream as universal basis:** The residual connection ensures ALL information from ALL layers is accumulated in a single vector. This vector is in a "universal basis" — it contains ALL information needed to re-derive any layer's specialized representation.
- **CCP Paper 1 (Thinking Sparks):** Show that GRPO training creates new heads = new basis directions in attention space. Pre-trained basis = generic text completion features. Post-trained basis = generic PLUS coaching-specific perceptual primitives (empathy detection, humor timing, conviction density). The basis EXPANDED through training.
- **CCP Paper 2 (RLKV):** Show how RL discovers the minimal reasoning basis. Full basis = all 32 heads. RL-discovered reasoning basis = 8-12 heads. The other 20-24 heads can be represented in a compressed basis (low-fidelity cache) without reasoning degradation. RLKV is performing BASIS SELECTION — identifying which basis directions matter.
- **CCP Paper 3 (KV-Direct):** Show the mathematical proof. residual_t = the universal representation of token t. K_l,t = residual_t × W_K^l. Since W_K^l is FIXED (a constant matrix after training), K_l,t is a deterministic PROJECTION (basis change) of residual_t into layer l's key basis. Store the universal basis representation → re-derive ANY layer's basis on demand. Zero error because the transformation is deterministic.

**Invariants:**
1. **Dimension preservation:** A valid basis change in ℝⁿ requires EXACTLY n independent basis vectors. Cannot gain or lose dimensions.
2. **Invertibility:** If P changes from B to C, then P⁻¹ changes from C back to B. You can always go back.
3. **Composition:** If P changes A→B and Q changes B→C, then QP changes A→C directly.

---

## 🟣 Analogy Layer — Content Directives

### ⚽ Sports
- **Basis =** rating system. Speed/strength is one basis. Offense/defense is another. Same player, different stats.
- **Good basis:** If scouting a striker, the offense/defense basis directly answers "is this player offensive?"
- **Bad basis:** If scouting a striker, the "height/shoe_size" basis tells you nothing useful.
- **Break:** Football ratings are somewhat arbitrary and correlated; pure bases are orthogonal.

### 🎮 Gaming
- **Basis =** stat system. STR/DEX/INT is one basis. Physical/Magical/Utility is another. A "battlemage" described as STR=5, DEX=3, INT=8 might be described as Physical=4, Magical=7, Utility=5 in the alternative basis.
- **Break:** Game stat systems are designed by humans; model bases are learned.

### 🎵 Music
- **Basis =** time domain vs frequency domain. The same audio clip described as amplitude-over-time OR as energy-per-frequency-band. Time basis: good for editing waveforms. Frequency basis: good for EQ, compression, mixing. Fourier transform = the CHANGE OF BASIS MATRIX between time and frequency.
- **Break:** Fourier transforms work on continuous functions; model basis changes work on finite vectors.

### 🧑‍🍳 Cooking
- **Basis =** ingredient-centered vs flavor-centered. A dish described as "500g chicken, 100g butter, 50g garlic" (ingredient basis) vs "umami=8, fat=7, pungent=6" (flavor basis). Same dish, different descriptions with different utility.
- **Break:** Ingredient-to-flavor mapping is non-linear (cooking changes the relationship).

### 🧠 Psychology
- **Basis =** Big Five vs MBTI vs Enneagram. The same person described in three different personality bases. Big Five gives 5 orthogonal coordinates. MBTI gives 4 dichotomous coordinates. Enneagram gives 9 categorical types. Each is a different basis for personality space.
- **Break:** These systems are not equivalent — they emphasize different aspects and have different granularity.

### 🤖 AI Content Engine
- **Basis =** model's learned embedding basis vs human-interpretable basis. The model's coordinates (0.23, -0.81, ...) mean nothing to humans. But if we could rotate to (happy=0.1, formal=0.8, ...), we could read the model's mind. Interpretability = finding the rotation matrix from model basis to human basis.
- **Break:** The model's basis may not have a clean rotation to human concepts — some model dimensions encode COMBINATIONS of human concepts.

---

## 🚀 Master Layer — Content Directives

**Integration Narrative:** Start with football rating systems. Formalize basis and change-of-basis matrix. Show all domains. Then the Transformer deep-dive: "Each layer operates in its own basis. The residual stream accumulates all bases into one universal representation. And here's the infrastructure breakthrough: KV-Direct proves that storing the universal basis (residual stream) instead of 24 layer-specific bases gives 27× compression with ZERO information loss."

**Paper Weaving (Section 9):**
- Start with Thinking Sparks (#52): "Training doesn't just adjust existing basis directions — it creates NEW ones. GRPO fine-tuning for coaching reasoning will create dedicated 'empathy detection' and 'humor timing' heads that simply don't exist in the pre-trained model. These are new basis vectors the model learned because the reward signal demanded them."
- Progress to RLKV (#53): "Not all heads are equal. RL discovers which heads form the reasoning basis and which are expendable. For the CCP's Pipecat Roleplay: protect the 8-12 reasoning-critical heads with full cache. Compress the remaining 20-24 heads. The model's reasoning quality survives because the essential basis directions are preserved."
- Culminate with KV-Direct (#51): "The residual stream is the Rosetta Stone of the Transformer. Every K and V at every layer is a deterministic basis change from this universal representation. Store one residual vector (5KB/token) instead of full K/V (136KB/token) and re-derive anything on demand. For the CCP: 20+ turn Roleplay sessions with complete context, no lossy eviction, at 27× less memory."

**Unlock Moment:** "Basis is language. The model speaks a language you can't read directly. But the math of basis change gives you the translation tools. And the residual stream — the universal basis — is the Transformer's internal truth: every specialized representation is just a rotation away from this single, universal encoding."

---

## Causal Bridge

**This lesson enables:** Lesson 8 (Eigen-Everything) reveals that every linear transformation has NATURAL basis directions — the eigenvectors — where the transformation acts by pure scaling. Without change of basis, the student cannot understand why eigenvectors are "natural" or why they simplify analysis.

**Without this lesson:** The student cannot understand why embeddings are uninterpretable, why the residual stream IS the universal representation, or why KV cache compression works. Every interpretability and compression technique operates on basis changes — without this lesson, they're all opaque.
