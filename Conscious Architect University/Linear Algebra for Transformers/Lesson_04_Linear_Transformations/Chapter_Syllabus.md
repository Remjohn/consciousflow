# Lesson 4: Linear Transformations — Chapter Syllabus

## Lesson Declaration

**Mathematical Goal:** The student can define what makes a transformation "linear" (preserves addition and scaling), understand that every linear transformation maps vectors to vectors in a structured, predictable way, and distinguish linear from non-linear operations.

**Transformer Goal:** The student understands that EACH LAYER of a Transformer performs a linear transformation on every token's vector — taking the 768-dimensional input embedding and producing a 768-dimensional output. The Q, K, V projections (W_Q, W_K, W_V multiplied by the input) are all linear transformations. The student grasps: "a Transformer is a STACK of learned linear transformations with non-linear activations between them."

**CCP Goal:** The student understands why Endogenous Steering Resistance (Paper #19) exists — the model RESISTS transformations that are misaligned with its learned geometric structure. Why MLP pruning (Paper #42) IMPROVES instruction-following — because removing fragile knowledge makes the linear transformations sharper. And why Selective Steering (Paper #35) applies norm-preserving rotations only at discriminative layers — because not all layers' transformations are equally relevant to the target behavior.

**Prerequisites:** Lesson 1 (Vectors), Lesson 2 (Dot Product), Lesson 3 (Linear Combinations — a transformation produces combinations).

**Estimated Time:** 5-6 hours across all 4 layers.

---

## The Core Narrative

You know what vectors are. You know how to measure their similarity and combine them. Now the critical question: how do you systematically CHANGE a vector?

Not randomly — structurally. A linear transformation takes any vector and produces a new vector following a CONSISTENT rule. If you double the input, the output doubles. If you combine two inputs and transform the result, you get the same thing as transforming each input separately and then combining. This consistency is what makes linear transformations so powerful: they are PREDICTABLE. And predictable transformations can be learned, composed, and analyzed.

This is exactly what a Transformer layer does. Your token embedding enters the layer as a vector in 768-dimensional space. The layer applies a learned transformation — rotating, stretching, projecting the vector into a new configuration that captures a richer representation of meaning. The output is a NEW vector in the SAME space, but now encoding contextual information that the input didn't have.

But here is the thing the textbooks don't tell you: the model's transformations have an immune system. Paper #19 (ESR) proves that models ACTIVELY RESIST transformations that don't align with their internal geometry. If you try to force a steering vector that contradicts the model's learned representation structure, the next layers will counter-correct it back toward the pre-trained centroid. Your intervention gets washed out. This means activation steering is NOT just "add a vector and hope." You must understand the model's transformation geometry to steer it effectively — or the model's own linear transformations will undo your work.

---

## CCP Research Paper Integration (3 Papers)

| # | Paper | Score | Role | Integration |
|---|-------|-------|------|-------------|
| 1 | **#19 ESR — Endogenous Steering Resistance** | 89 | 🟢 Foundation | ESR reveals that models possess an intrinsic geometric "immune system." When a steering vector is injected that is misaligned with the internal representation geometry, subsequent layers' TRANSFORMATIONS actively counter-act the intervention, self-correcting back to the pre-trained centroid. The student sees: linear transformations aren't passive pipes — they are ACTIVE geometric operators that enforce the model's learned structure. **Show:** How a blunt empathy steering vector injected at layer 8 gets progressively washed out by the transformations in layers 9-24, because its direction is incongruent with the learned transformation geometry at those depths. |
| 2 | **#42 Fragile Knowledge — Width Pruning Dichotomy** | 86 | 🟡 Mechanism | Pruning MLP width (removing columns from the transformation matrices) DESTROYS factual knowledge but IMPROVES instruction-following by +46-75%. The student needs to see WHY: MLP matrices compute non-linear transformations. Pruning removes the parametric knowledge dimensions but sharpens the FORMAT COMPLIANCE dimensions. The linear transformation becomes NARROWER but MORE PRECISE on structural tasks. This validates the CCP's Dual-Stack: Neo4j for knowledge, SLMs for execution. **Show:** How a Qwen-3.5 MLP transformation matrix, post-pruning, loses the ability to recall trivia but gains sharper instruction compliance — because the transformation's output space collapses onto the FORMAT dimensions, eliminating noise from knowledge dimensions. |
| 3 | **#35 Selective Steering — Norm-Preserving Control** | 95 | 🔴 Breakthrough | Selective Steering calculates the discriminative threshold PER LAYER, applying steering ONLY to layers where the contrastive features are maximally opposed. The intervention uses NORM-PRESERVING ROTATIONS — transformations that change direction without changing magnitude. The student now sees: effective steering is not addition (which changes norm) but ROTATION (which preserves it). And the LAYER SELECTION is possible because each layer's transformation has a known discriminative profile. **Show:** How Selective Steering identifies that layers 12-16 are maximally discriminative for "formality" in Qwen-3.5, applies a rotation (not addition!) at those layers that moves the activation toward formal style, and leaves all other layers untouched — preserving JSON compliance because the affected layers are NOT the format-compliance layers. |

---

## 🔵 Exposure Layer — Content Directives

**Intuition Hook:** You are a coach. You have 11 players with known abilities. Your SYSTEM (4-4-2, 3-5-2, counter-attack) transforms each player's behavior. Same player, different system = different output. The system IS a transformation. And if it's a LINEAR transformation, then: (1) a player twice as aggressive produces twice the offensive output, and (2) two players combined and then transformed give the same result as two players transformed separately and then combined.

**Progressive Formalization Path:**
1. "A rule that takes vectors in and outputs vectors out" — the transformation concept
2. Linear means: T(αv) = αT(v) and T(v + w) = T(v) + T(w)
3. Why does linearity matter? Because it means the transformation is PREDICTABLE — you can analyze inputs separately and combine results
4. Non-linear examples: squaring (T(2v) ≠ 2T(v)), adding constants (T(v) = v + 1 breaks linearity)
5. Preview: every linear transformation can be represented by a MATRIX (Lesson 5)

**Worked Examples:**
1. **Scaling = linear:** T(v) = 2v. Check: T(v+w) = 2(v+w) = 2v+2w = T(v)+T(w). ✅
2. **Shift = NOT linear:** T(v) = v + (1,1). Check: T(v+w) = v+w+(1,1) but T(v)+T(w) = v+(1,1)+w+(1,1) = v+w+(2,2). ❌ Shifts break linearity.
3. **Rotation = linear:** Rotating all vectors by 45° preserves addition and scaling. You can rotate a sum or sum rotated vectors — same result.

**Misconceptions to Address:**
1. ❌ "Linear means 'in a line.'" → ✅ Linear means "preserves addition and scaling." A rotation is linear even though it changes directions.
2. ❌ "A Transformer layer is one transformation." → ✅ Each layer contains MULTIPLE transformations: W_Q, W_K, W_V (all linear), softmax (non-linear), output projection (linear). The layer is a composite.
3. ❌ "Non-linear = bad." → ✅ Non-linearity (ReLU, GELU, softmax) is ESSENTIAL. Without it, stacking 100 linear layers would collapse into a single linear transformation. Non-linearity makes deep learning DEEP.
4. ❌ "If a transformation doesn't change the vector's length, it does nothing." → ✅ Rotations preserve length but completely change direction. This is the most important type of transformation for steering — it changes WHAT the model says without changing HOW STRONGLY it says it.

**Controlled Analogies:**
- ⚽ Coaching system as transformation: same players (input vectors), different system = different behavior (output vectors)
- 🎮 Character class system: the "ranger class" transformation boosts DEX and speed, reduces INT. Every character enters → a modified version exits.

**Compression Truth:** "A linear transformation is a consistent rule for reshaping meaning. Every Transformer layer IS one. And if you understand which layers transform which features, you can steer the model by intervening at the right layer with the right rotation."

---

## 🟡 Mechanistic Layer — Content Directives

**Formal Definition:** A transformation T: ℝⁿ → ℝᵐ is LINEAR if and only if for all vectors v, w ∈ ℝⁿ and all scalars α ∈ ℝ: (1) T(v + w) = T(v) + T(w) [additivity], (2) T(αv) = αT(v) [homogeneity]. Equivalently: T(αv + βw) = αT(v) + βT(w).

**Derivation Path:** These two properties combine into a single requirement: the transformation commutes with linear combinations. This means: if you know what T does to a BASIS, you know what it does to EVERY vector. Because every vector is a linear combination of basis vectors, and linearity means you can transform each basis vector separately and combine the results.

**Transformer Mapping:**
- **W_Q, W_K, W_V:** The projection matrices that transform the input embedding into Query, Key, and Value spaces. Each is a linear transformation from ℝ^768 → ℝ^64 (per head).
- **Feed-forward layers:** Each layer has W₁ (expand from 768 to 3072) and W₂ (contract from 3072 back to 768). Both are linear transformations with a non-linear activation (GELU) between them.
- **The residual connection:** output = input + T(input). This adds the transformed version TO the original — ensuring information from earlier layers is never lost.
- **CCP Paper 1 (ESR):** Show that when a steering vector is geometrically incongruent with the model's learned transformations, subsequent layers' T_next functions actively rotate the hidden state BACK toward the pre-trained manifold. The model's own transformations fight the steer. CCV vectors must be designed within the model's representation geometry to survive downstream transformations.
- **CCP Paper 2 (Fragile Knowledge):** Show MLP transformations as width-d matrices. Pruning columns = reducing the input dimensionality of the transformation. Factual knowledge lives in broad, distributed dimensions; format compliance lives in concentrated, local dimensions. Pruning removes the broad dimensions first → knowledge dies, compliance sharpens.
- **CCP Paper 3 (Selective Steering):** Show the key innovation: instead of ADDING a steering vector (which changes ||hidden_state||), apply a ROTATION (which preserves ||hidden_state||). Rotations ARE linear transformations. They change direction without magnitude distortion. And they're applied ONLY at layers where a discriminative test finds maximum contrastive separation.

**Invariants:**
1. **Basis sufficiency:** A linear transformation is FULLY determined by its action on a basis. If you know T(e₁), T(e₂), ..., T(eₙ), you know T(v) for ALL v.
2. **Composition is linear:** If T₁ and T₂ are both linear, then T₂ ∘ T₁ (apply T₁ first, then T₂) is also linear. This is WHY stacking Transformer layers works.
3. **Null space:** The set of vectors mapped to 0 by T (the "null space") tells you what information the transformation DESTROYS. If a head has a big null space, it ignores a lot of information.

---

## 🟣 Analogy Layer — Content Directives

### ⚽ Sports
- **Transformation =** tactical system. Input: raw player stats. Output: on-field behavior.
- **High alignment:** Players whose stats match the system → transformation amplifies their strengths
- **Zero:** Players with orthogonal skill sets to the system → transformation produces no useful output (benched)
- **Negative:** Players whose style directly contradicts the system → transformation diminishes them (misfit)
- **Break:** Real coaching has non-linear feedback loops (morale, fatigue, rivalries)

### 🎮 Gaming
- **Transformation =** class specialization buff. Input: base stats. Output: class-modified stats. A "mage transformation" boosts INT, reduces STR. A "warrior transformation" does the opposite. COMPOSITION: dual-classing = applying two transformations in sequence.
- **Break:** Games have hard caps and non-linear scaling curves

### 🎵 Music
- **Transformation =** EQ or effects chain. Input: raw recording. Output: processed sound. An EQ that boosts bass and cuts treble IS a linear transformation on the frequency vector. Reverb and compression are non-linear.
- **Break:** Audio effects include time-domain operations that pure linear algebra doesn't capture

### 🧑‍🍳 Cooking
- **Transformation =** cooking method. Input: raw ingredient profile. Output: cooked flavor profile. Roasting TRANSFORMS garlic: harsh → sweet, raw → mellow. It preserves structure (garlic stays garlic) but changes the emphasis.
- **Break:** Cooking chemistry is deeply non-linear (Maillard reaction, caramelization)

### 🧠 Psychology
- **Transformation =** therapeutic intervention. Input: pre-therapy personality profile. Output: post-therapy profile. A good therapy transforms the person's trait expression — reduces Neuroticism, maintains Openness. The transformation is consistent: two clients with the same starting profile get the same output.
- **Break:** Real therapy is highly non-linear and context-dependent

### 🤖 AI Content Engine
- **Transformation =** each Transformer layer. Input: token embedding at layer L. Output: token embedding at layer L+1. The SEQUENCE of layers IS a composition of transformations. 24 layers = 24 transformations applied in order. And each one is LEARNED — the model discovered which transformation to apply at each depth to produce the best final representation.
- **Break:** Self-attention is position-dependent (different per token). The MLP is position-independent (same for all tokens).

---

## 🚀 Master Layer — Content Directives

**Integration Narrative:** Start with the coaching system metaphor — input players, apply system, get behavior. Formalize linearity. Show all 6 domains. Then: "Every Transformer layer IS a learned linear transformation (plus non-linear activation). 24 layers = 24 transformations COMPOSED. And here's the sovereign insight: these transformations have an immune system. ESR proves the model fights misaligned interventions. Selective Steering proves you must use ROTATIONS, not additions, and only at the right layers. And Fragile Knowledge proves that pruning the transformation matrices can IMPROVE performance by removing noise dimensions."

**Paper Weaving (Section 9):**
- Start with ESR (#19): "Your steering vector must be geometrically congruent with the model's learned transformation geometry. If it isn't, the model's own transformations will wash it out. This is why casual 'just add a vector' steering often fails."
- Progress to Fragile Knowledge (#42): "Pruning MLP transformation matrices removes knowledge dimensions but SHARPENS format compliance. The CCP's Dual-Stack exploits this: Neo4j holds knowledge, the SLM's pruned transformations execute format-perfect output."
- Culminate with Selective Steering (#35): "The solution: apply NORM-PRESERVING ROTATIONS (not additions!) only at layers where the target behavior is maximally discriminative. This is geometrically informed steering — working WITH the model's transformation structure, not against it."

**Unlock Moment:** "A Transformer is not a black box. It is a composition of learned linear transformations — each one reshaping meaning space in a structured, analyzable way. And if you understand which layers reshape which features, you can intervene surgically: rotate, not add. Preserve norms. Target discriminative layers. Work WITH the transformation geometry, not against it."

---

## Causal Bridge

**This lesson enables:** Lesson 5 (Matrix Multiplication) shows that every linear transformation CAN and MUST be represented as a matrix. Without understanding what transformations DO, the matrix is just a grid of numbers. With this lesson, the matrix becomes a RECIPE for a specific transformation.

**Without this lesson:** The student sees weight matrices as opaque parameter blocks. They cannot reason about WHY pruning helps, WHY ESR exists, or WHY layer selection matters for steering. The Transformer remains a stack of inexplicable multiplications.
