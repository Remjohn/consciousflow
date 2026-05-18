# Lesson 6: Orthogonal Projections — Chapter Syllabus

## Lesson Declaration

**Mathematical Goal:** The student can project a vector onto another vector (or subspace), decompose a vector into parallel and perpendicular components, interpret the projection formula (proj_B(A) = (A·B/|B|²)B), and understand projection as EXTRACTING the part of a signal that lives in a specific direction.

**Transformer Goal:** The student understands that Q, K, V projections ARE projections — they extract specific aspects of the input embedding by projecting it onto learned subspaces. Attention itself is a form of soft projection: instead of hard-selecting one direction, it soft-projects onto a weighted mixture of directions.

**CCP Goal:** The student grasps that activation steering works by PROJECTING the hidden state onto desired/undesired concept directions. CASAL (Paper #27) uses contrastive projection to amortize hallucination reduction. SV-RAG (Paper #36) uses hidden-state projections as retrieval vectors. KV Cache Steering (Paper #28) INJECTS pre-computed reasoning projections directly into the Key/Value cache, forcing the model to reason along chosen directions.

**Prerequisites:** Lesson 1-5. Particularly Lesson 2 (Dot Product — projection uses it) and Lesson 5 (Matrix Multiplication — projection matrices).

**Estimated Time:** 5-6 hours across all 4 layers.

---

## The Core Narrative

You have a vector — the full representation of a concept in embedding space. But you don't always want ALL of it. Sometimes you want to isolate just ONE aspect. How empathetic is this coaching response? How much toxicity exists in this text? How strongly does this embedding point toward "motivation" vs. "despair"?

Projection answers exactly this question. It takes a vector A and a direction B, and extracts the PART of A that aligns with B. Like shining a light on an object and looking at the shadow it casts on a specific wall — the shadow IS the projection.

The formula is surprisingly simple: take the dot product of A and B (how aligned are they?), normalize by B's magnitude (so the result doesn't depend on B's scale), and scale B by that amount. The result is a vector in B's direction whose length tells you "how much of A lives here."

Now the architectural insight: the Q, K, V matrices in attention ARE projection matrices. W_Q projects the input embedding onto a "what am I looking for?" subspace. W_K projects onto a "what kind of information do I contain?" subspace. W_V projects onto a "what value do I carry?" subspace. These are LEARNED projections — the model discovered which aspects of the embedding to extract for each role.

And activation steering? When you compute the "toxicity direction" and project a hidden state onto it, the projection's magnitude tells you how toxic the current representation is. Subtract the projection → remove the toxicity component. Add a projection along a different direction → inject a new concept. This is surgery on meaning — precise, directional, and mathematically exact.

---

## CCP Research Paper Integration (3 Papers)

| # | Paper | Score | Role | Integration |
|---|-------|-------|------|-------------|
| 1 | **#27 CASAL — Contrastive Amortized Steering** | 92 | 🟢 Foundation | CASAL reduces hallucination by computing the difference between "grounded" and "hallucinated" hidden states as a contrastive vector, then PROJECTING future hidden states onto this vector to measure their hallucination risk. Per-token contrastive projection is too expensive, so CASAL AMORTIZES: it pre-computes contrastive bounds based on the input context window, deploying a single efficient projection. **Show:** How CASAL projects hidden state h onto the hallucination direction d_hall: score = (h · d_hall / ||d_hall||²). High score = hallucination risk. The projection magnitude IS the risk metric. Amortization = computing one projection matrix for the full context instead of per-token projections. |
| 2 | **#36 SV-RAG — LoRA-Contextualizing for Long Documents** | 87 | 🟡 Mechanism | SV-RAG leverages the INTERNAL hidden states of the model as dense retrieval vectors. Instead of using final-layer embeddings (which lose nuance), it projects Hidden state → retrieval space and Hidden state → generation space using dual-LoRA structures. The retrieval projection extracts the "what is this about?" component. The generation projection extracts the "how should I express this?" component. **Show:** How the CCP could use SV-RAG's dual-projection to handle Trivianar history: project each WebSocket response's hidden state onto a retrieval subspace → efficient similarity search over thousands of past interactions without token bloat. |
| 3 | **#28 KV Cache Steering** | 94 | 🔴 Breakthrough | KV Cache Steering injects pre-calculated reasoning pathways DIRECTLY into the Key-Value projections of small models during decoding. This forces the model to attend to reasoning patterns it could never generate from its own parameters. The student sees: the K and V caches are PROJECTION OUTPUTS — they are the projected representations that attention uses to determine relevance (K) and extract content (V). Injecting pre-computed vectors into these projections IS forcing the model to reason along specific directions. **Show:** How Qwen-3B's attention, without KV injection, computes shallow Q·K projections that miss complex CA11 evaluation logic. WITH KV injection, the pre-computed reasoning vectors in K and V force the dot products to align with the desired reasoning pattern. The model doesn't "learn" CA11 — the projections CONTAIN CA11 reasoning, and the model's attention mechanism is forced to follow them. |

---

## 🔵 Exposure Layer — Content Directives

**Intuition Hook:** You're running diagonally across the pitch — forward AND sideways. Your coach only cares about forward progress. How do you measure JUST the forward component? You project your movement onto the forward direction. The projection tells you: "this much of your motion is useful, the rest is drift."

**Progressive Formalization Path:**
1. Shadow metaphor: shine a light behind a vector, the shadow on a wall IS the projection
2. Two components: parallel (useful, aligned) + perpendicular (leftover, independent)
3. Formula: proj_B(A) = (A·B / |B|²) × B
4. Breaking it down: A·B = raw alignment (from Lesson 2), |B|² = normalization, × B = put it back in B's direction
5. Result: a vector in B's direction whose length = how much of A aligns with B

**Worked Examples:**
1. **Horizontal extraction:** A = (3,4), B = (1,0). proj_B(A) = (3·1+4·0)/(1)(1,0) = 3·(1,0) = (3,0). Isolated the horizontal component.
2. **Full alignment:** A = (4,4), B = (1,1). proj_B(A) = (4+4)/(1+1) × (1,1) = 4·(1,1) = (4,4). Full projection = original vector (A is entirely in B's direction).
3. **Perpendicular:** A = (1,0), B = (0,1). proj_B(A) = 0·(0,1) = (0,0). Zero projection — A has NOTHING in B's direction.

**Misconceptions to Address:**
1. ❌ "Projection reduces a vector." → ✅ Projection DECOMPOSES — it splits into aligned + perpendicular. The parallel part IS the projection. The perpendicular part is the RESIDUAL (A − proj_B(A)).
2. ❌ "Projecting onto a vector and taking the dot product are the same." → ✅ Dot product gives a SCALAR (a number). Projection gives a VECTOR (in B's direction). The scalar becomes the coefficient of the projection vector.
3. ❌ "Projection only works in 2D." → ✅ The formula works in ANY dimension. Projecting a 768D embedding onto a "toxicity direction" gives a 768D vector whose magnitude measures toxicity.
4. ❌ "Projection destroys information." → ✅ Not if you keep the residual. A = proj_B(A) + perpendicular_component. Total information is preserved in the decomposition.

**Controlled Analogies:**
- ⚽ Forward progress of a diagonal run
- 🎵 Extracting just the bass frequencies from a full mix = projecting the audio spectrum onto the bass band

**Compression Truth:** "Projection isolates the component of a vector that lives in a specific direction. It's how you extract features, measure concepts, and surgically modify representations — by decomposing meaning into measurable, independent dimensions."

---

## 🟡 Mechanistic Layer — Content Directives

**Formal Definition:** The orthogonal projection of vector A onto vector B: proj_B(A) = (A · B / ||B||²) B. Onto a subspace S with orthonormal basis {u₁, ..., u_k}: proj_S(A) = Σᵢ (A · uᵢ) uᵢ. The residual: A⊥ = A − proj_S(A) is perpendicular to S.

**Derivation Path:** WHY this formula? We want a vector p in B's direction that is as close to A as possible. Minimizing ||A − αB||² with respect to α: take derivative, set to zero, solve → α = A·B/||B||². This is the LEAST-SQUARES solution — projection finds the closest point in the subspace.

**Transformer Mapping:**
- **W_Q, W_K, W_V as projection matrices:** Each 768×64 matrix projects the 768D input onto a 64D subspace. W_Q extracts the "query" aspect, W_K extracts the "key" aspect, W_V extracts the "value" aspect. These subspaces are LEARNED.
- **Activation steering as projection manipulation:** To remove a concept: subtract the projection onto the concept direction. new = old − proj_concept(old). To add a concept: add α × concept_direction.
- **Layer-wise concept presence:** For each layer, project the hidden state onto a concept direction (e.g., "sarcasm"). The projection magnitude at each layer reveals: when does the model START encoding sarcasm? When does it COMMIT to it?
- **CCP Paper 1 (CASAL):** Show amortized hallucination detection. contrastive_direction = mean(grounded_states) − mean(hallucinated_states). For token t: hallucination_score = proj(h_t, contrastive_direction). Amortization: compute a single projection matrix P = d·dᵀ/||d||² and apply P·h for all tokens in the window.
- **CCP Paper 2 (SV-RAG):** Show the dual-LoRA projection architecture. LoRA_retriever projects hidden states onto "what-is-this" space. LoRA_generator projects onto "how-to-express" space. The retrieval projection enables efficient similarity search over the CCP's cbcs_interaction_logs without exploding context windows.
- **CCP Paper 3 (KV Cache Steering):** Show that K_cache[layer_l] = X · W_K^l — each key IS a projection output. Injecting pre-computed K vectors = placing synthetic "beacons" in projection space. When the model's query Q dot-products with these injected keys, the attention is FORCED to attend to the synthetic reasoning pattern. The values V at those positions carry the desired reasoning content.

**Invariants:**
1. **Idempotency:** proj(proj(A)) = proj(A). Projecting twice changes nothing — you're already in the subspace.
2. **Orthogonal residual:** (A − proj_B(A)) · B = 0. The leftover is TRULY perpendicular.
3. **Pythagorean:** ||A||² = ||proj_B(A)||² + ||A − proj_B(A)||². No energy is created or destroyed — it's redistributed.

---

## 🟣 Analogy Layer — Content Directives

### ⚽ Sports
- **Projection =** isolating specific skills from overall performance. A midfielder with stats (speed=7, vision=9, strength=5, stamina=8). Project onto "playmaker direction" (0, 1, 0, 0) → score = 9. This player's playmaker component is 9.
- **High:** Player naturally aligned with the role → large projection
- **Zero:** Player has no relevant skill → zero projection (wrong role assignment)
- **Break:** Real skills correlate and interact; projection assumes independence

### 🎮 Gaming
- **Projection =** stat check. The game tests "how much INT does this character have?" by projecting the full stat vector onto the INT axis. High projection = pass the check. Zero = fail.
- **Break:** RPG checks often involve thresholds and dice rolls — not pure projections

### 🎵 Music
- **Projection =** EQ band extraction. "How much bass is in this mix?" = project the frequency spectrum onto the 20-200Hz band. The projection magnitude = bass energy. Subtracting the projection = removing the bass.
- **Break:** Frequency bands aren't perfectly orthogonal in real audio (leakage)

### 🧑‍🍳 Cooking
- **Projection =** isolating a flavor dimension. "How salty is this dish?" = project the flavor profile onto the salt axis. The projection magnitude = saltiness level. To reduce salt: subtract the projection (add citric acid to counteract).
- **Break:** Flavor perception is non-linear and context-dependent

### 🧠 Psychology
- **Projection =** measuring a specific trait. Given a person's full Big Five vector, project onto Extraversion to get their extraversion score. The perpendicular component = everything that's NOT extraversion.
- **Break:** Psychological traits are measured through questionnaires, not vector projections directly

### 🤖 AI Content Engine
- **Projection =** concept extraction from embeddings. "How much toxicity is in this text?" Project the text embedding onto the toxicity direction. Magnitude = toxicity score. Subtract projection = detoxify. This is the EXACT mechanism behind activation steering for content control in the CCP.
- **Break:** Concept directions aren't perfectly linear in real embedding spaces — some concepts curve through activation space

---

## 🚀 Master Layer — Content Directives

**Integration Narrative:** Start with forward progress extraction. Formalize the projection formula. Show all 6 domains. Then: "In Transformers, Q/K/V projections extract specific aspects of meaning. In steering, projections measure and modify concepts. CASAL uses projection to detect hallucination. SV-RAG uses dual projections for retrieval and generation. And KV Cache Steering injects pre-computed projections to FORCE reasoning in small models."

**Paper Weaving (Section 9):**
- Start with CASAL (#27): "Hallucination detection = projecting hidden states onto the grounded-vs-hallucinated direction. The magnitude IS the risk score. But computing per-token projections is expensive, so CASAL amortizes: one projection matrix for the entire context window."
- Progress to SV-RAG (#36): "The CCP handles thousands of coaching interactions. SV-RAG's dual-LoRA architecture projects hidden states into two spaces: one for efficient retrieval (what is this?) and one for faithful generation (how to express it?). No context window explosion."
- Culminate with KV Cache Steering (#28): "The breakthrough: you don't need to TEACH Qwen-3B complex reasoning. You can INJECT pre-computed reasoning pathways directly into its K and V projections. The model's attention mechanism is FORCED to follow the injected reasoning pattern. This is how the CCP gives SLMs the reasoning capacity of larger models at sovereign compute cost."

**Unlock Moment:** "Projection is surgical extraction. It lets you ask 'how much X is in this representation?' and get a precise, computable answer. And by adding or subtracting projections, you perform surgery on meaning — removing toxicity, injecting empathy, forcing reasoning paths — all with the same mathematical operation you learned to extract the forward component of a diagonal run."

---

## Causal Bridge

**This lesson enables:** Lesson 7 (Change of Basis) extends projection from "onto one direction" to "onto an entire new coordinate system." Without projection, basis change is abstract. With it, the student sees: changing basis = projecting onto each new axis.

**Without this lesson:** The student cannot understand how steering vectors are extracted (contrastive pairs → difference → concept direction), how concept probes work (project onto concept direction → measure activation), or how KV Cache Steering forces reasoning. Projection is the TOOL for all interpretability and interventional work.
