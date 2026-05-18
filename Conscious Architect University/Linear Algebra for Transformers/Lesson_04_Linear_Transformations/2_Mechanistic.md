# Lesson 4: Linear Transformations — Mechanistic / Transformer Layer

## 1. Formal Definition

A transformation $T: \mathbb{R}^n \rightarrow \mathbb{R}^m$ is **linear** if and only if it satisfies the following axioms for all vectors $\mathbf{v}, \mathbf{w} \in \mathbb{R}^n$ and all scalars $\alpha \in \mathbb{R}$:

**Additivity:** $T(\mathbf{v} + \mathbf{w}) = T(\mathbf{v}) + T(\mathbf{w})$

**Homogeneity:** $T(\alpha \mathbf{v}) = \alpha \cdot T(\mathbf{v})$

These two axioms combine into a single superposition requirement:
$$T(\alpha \mathbf{v} + \beta \mathbf{w}) = \alpha \cdot T(\mathbf{v}) + \beta \cdot T(\mathbf{w})$$

This states that a linear transformation commutes with linear combinations. The immediate consequence is the **Basis Sufficiency Theorem**: if $\{\mathbf{e}_1, \mathbf{e}_2, \dots, \mathbf{e}_n\}$ is a basis for $\mathbb{R}^n$, then knowing $T(\mathbf{e}_1), T(\mathbf{e}_2), \dots, T(\mathbf{e}_n)$ completely determines $T$ on every vector. Because any $\mathbf{v} = \sum_i v_i \mathbf{e}_i$, linearity gives:
$$T(\mathbf{v}) = \sum_i v_i \cdot T(\mathbf{e}_i)$$

The transformation's behavior on the entire space is fully encoded by its action on a finite set of basis vectors. This is why linear transformations can be represented as matrices (Lesson 5): the matrix columns ARE the transformed basis vectors.

Every linear transformation possesses two critical structural subsets:
- **Image (Range):** The set of all possible outputs. $\text{Im}(T) = \{T(\mathbf{v}) : \mathbf{v} \in \mathbb{R}^n\}$. Its dimension is the **rank** of $T$ — the number of independent output directions the transformation can produce.
- **Null Space (Kernel):** The set of all inputs mapped to zero. $\text{Ker}(T) = \{\mathbf{v} : T(\mathbf{v}) = \mathbf{0}\}$. Its dimension is the **nullity** — the number of independent directions the transformation completely destroys.

The **Rank-Nullity Theorem** states: $\text{rank}(T) + \text{nullity}(T) = n$. The dimensions you preserve plus the dimensions you destroy always equals the input dimension. No information is created; it is either preserved or annihilated.

## 2. Derivation: Why Linearity Enables Analysis

Why does artificial intelligence almost exclusively build its architectures from linear transformations (punctuated by non-linear activations)? The answer is analyzability.

If a transformation is linear, it satisfies basis sufficiency — meaning its complete behavior is encoded in a finite matrix. That matrix can be decomposed (SVD, eigendecomposition), its rank can be measured, its null space can be identified, its condition number can be evaluated. Every tool from centuries of mathematical analysis applies directly.

If a transformation is non-linear, none of these guarantees hold. The transformation's behavior on one input tells you nothing definitive about its behavior on another. It cannot be represented by a finite matrix. It cannot be cleanly decomposed or inverted. This is why Transformers are built as alternating sequences: linear operations (which provide structure, analyzability, and gradient flow) interleaved with minimal, carefully chosen non-linearities (which provide the compositional expressiveness that stacking requires).

The linear portions are where human engineers can reason about the model, inspect its learned representations, decompose its behavior into interpretable components, and intervene surgically. The non-linear portions are where the model gains the computational depth to express complex functions. The architecture is a deliberate tension between analyzability and expressiveness.

## 3. Operational Mechanics: Transformer Layer Anatomy

Inside a standard Transformer layer, a token embedding $\mathbf{x} \in \mathbb{R}^{768}$ undergoes the following sequence of transformations:

**Stage 1: Q/K/V Projections (Linear)**
Three learned weight matrices project the input into specialized subspaces:
$$\mathbf{Q} = W_Q \cdot \mathbf{x} \quad (768 \rightarrow 64)$$
$$\mathbf{K} = W_K \cdot \mathbf{x} \quad (768 \rightarrow 64)$$
$$\mathbf{V} = W_V \cdot \mathbf{x} \quad (768 \rightarrow 64)$$

Each projection is a linear transformation that compresses 768 dimensions down to 64 per attention head. The rank of $W_Q$ determines how many independent feature directions the Query can represent. The null space of $W_Q$ contains all input features invisible to the Query — the head literally cannot ask about dimensions in the null space.

**Stage 2: Attention Score Computation (Mixed)**
$\text{score} = \mathbf{Q} \cdot \mathbf{K}^T / \sqrt{d_k}$ — linear (dot product + scaling)
$\alpha = \text{softmax}(\text{score})$ — **non-linear** (exponential normalization)

The softmax is the first critical non-linearity. It converts raw dot product scores into a probability distribution, introducing competition between tokens — amplifying the strongest relationships and suppressing the weakest. Without this non-linearity, attention weights would be unconstrained and could not form the sharp, selective focus patterns that drive language understanding.

**Stage 3: Value Aggregation (Linear)**
$\text{output} = \sum_j \alpha_j \mathbf{V}_j$ — a linear combination of value vectors with softmax-computed weights. This is the mechanism from Lesson 3 operating inside the transformation pipeline.

**Stage 4: Feed-Forward Network (Linear + Non-Linear + Linear)**
$$\mathbf{h} = W_1 \cdot \text{output} \quad (768 \rightarrow 3072) \quad \text{[linear expansion]}$$
$$\mathbf{h}' = \text{GELU}(\mathbf{h}) \quad \text{[non-linear activation]}$$
$$\text{ffn\_out} = W_2 \cdot \mathbf{h}' \quad (3072 \rightarrow 768) \quad \text{[linear compression]}$$

The expansion via $W_1$ maps the representation into a higher-dimensional space where non-linear feature selection (GELU) can operate. GELU approximately zeros out weakly activated dimensions while passing strongly activated ones — acting as a learned feature gate. The compression via $W_2$ projects the gated features back to the original dimensionality.

**Stage 5: Residual Connection (Linear)**
$$\mathbf{x}_{\text{next}} = \mathbf{x} + \text{ffn\_out}$$

The residual connection adds the original input back to the transformed output. This is itself a linear operation (addition), and it provides a critical architectural guarantee: even if the layer's transformations are destructive or poorly learned, the original signal is preserved. The residual stream (the sum of all layer contributions from Lesson 3) passes through the entire network, accumulating updates without ever losing the original embedding.

## 4. Dimensional Behavior: Null Space and Rank

The Rank-Nullity Theorem has direct operational consequences for Transformer engineering.

For a $W_Q$ matrix mapping $\mathbb{R}^{768} \rightarrow \mathbb{R}^{64}$:
- Maximum possible rank: 64 (the output dimension)
- Null space dimension: at least $768 - 64 = 704$

This means the Q projection necessarily destroys at least 704 dimensions of input information. These 704 dimensions are the features the attention head cannot query — they are invisible to this head's computation. Different heads learn different $W_Q$ matrices with different null spaces, which is why multi-head attention works: each head "sees" a different 64-dimensional slice of the full 768-dimensional representation. Collectively, the heads cover complementary views.

When a head's null space accidentally contains a critical semantic feature (e.g., the feature encoding "negation"), that head becomes structurally blind to negation. It cannot produce attention patterns that distinguish "I am happy" from "I am not happy" because the distinguishing feature was annihilated by its projection. Diagnosing such failures requires analyzing which features lie in the null spaces of which heads — a direct application of the Rank-Nullity Theorem to interpretability.

In the feed-forward expansion ($768 \rightarrow 3072$), the transformation is injective — it has zero null space (rank 768, no information destroyed). The expansion creates a higher-dimensional canvas on which non-linear filtering can operate without forced information loss. The subsequent compression ($3072 \rightarrow 768$) reintroduces a null space of dimension $3072 - 768 = 2304$, selectively discarding the features that GELU deactivated.

## 5. Connection to the Linear Algebra System

Linear transformations are the central concept binding all previous and subsequent lessons:

- **Vectors (Lesson 1):** The inputs and outputs of every transformation.
- **Dot Product (Lesson 2):** The attention score computation is a dot product between two linearly transformed vectors (Q and K).
- **Linear Combinations (Lesson 3):** Every linear transformation maps a linear combination to a linear combination of the transformed parts. Attention output is a linear combination of value vectors.
- **Matrix Multiplication (Lesson 5):** Every linear transformation IS a matrix. The matrix encodes the transformation's complete behavior. Matrix multiplication IS function composition of transformations.
- **Change of Basis (Lesson 7):** Re-expressing a transformation in a different coordinate system. The transformation does not change; only its numerical description changes.
- **Eigendecomposition (Lesson 8):** Finding the special directions along which a transformation acts as pure scaling. These are the transformation's fundamental geometric axes.

## 6. Transformer and AI Mapping (Critical Architecture)

### 1. Paper #19: ESR (Endogenous Steering Resistance) — The Geometric Immune System

The most dangerous misconception in activation steering is that the model passively accepts injected vectors. Paper #19 proves it does not.

When a steering vector $\mathbf{s}$ is injected at layer $L$, the modified hidden state is $\mathbf{h}_L' = \mathbf{h}_L + \alpha \cdot \mathbf{s}$. This vector then passes through the transformations of layers $L+1, L+2, \dots, L+N$. Each subsequent layer applies its learned linear transformation, which was trained on the natural distribution of hidden states at that depth.

If $\mathbf{s}$ is geometrically congruent with the model's learned internal geometry — meaning it lies within the typical activation manifold at layer $L$ — the downstream transformations treat it as natural variation and propagate it forwards faithfully.

If $\mathbf{s}$ is geometrically incongruent — meaning it pushes the hidden state into a region of activation space that the model has never encountered during training — the downstream transformations actively counter-correct. The learned weight matrices at layers $L+1$ through $L+N$ implicitly encode the statistical structure of their expected inputs. Anomalous activations get progressively rotated back toward the pre-trained centroid by the successive application of learned transformations.

Concretely: inject a blunt empathy steering vector at layer 8 of a Qwen-3.5 model. Measure the hidden state at layers 9, 12, 16, 20, 24. Paper #19 shows that the component of the hidden state corresponding to the steering injection decays exponentially. By layer 20, the hidden state has nearly returned to its pre-intervention trajectory. The model's own transformations washed out the intervention — not through any explicit "immune system" module, but simply because the learned linear transformations at each layer implicitly project activations back onto the manifold of states they were trained to process.

The engineering implication is absolute: effective steering vectors must be designed to lie within the model's learned representation geometry. They must be compatible with the downstream transformations or they will be annihilated. This is why contrastive extraction methods (which derive steering vectors from the model's own internal states) work far better than arbitrary directional injections.

### 2. Paper #42: Fragile Knowledge — Width Pruning Sharpens Compliance

The feed-forward network in each Transformer layer is a linear transformation $W_1$ followed by GELU followed by $W_2$. The columns of $W_1$ define the features that the MLP can activate. Each column is one feature direction. The full MLP transformation maps the 768D input into a 3072D intermediate space (via $W_1$), applies non-linear gating, and compresses back (via $W_2$).

Paper #42 discovers a profound dichotomy when pruning the columns of $W_1$ (reducing the intermediate width):

- **Factual knowledge** (storing specific facts like "Paris is the capital of France") is distributed across many MLP columns — it is broad, fragile, and dies first when columns are removed.
- **Instruction-following compliance** (adhering to output format, JSON structure, markdown formatting) is concentrated in a small number of dedicated columns — it is narrow, robust, and survives aggressive pruning.

When you prune 50% of MLP width, the transformation's output space shrinks dramatically. The broad, distributed knowledge representations collapse. But the narrow, concentrated format-compliance features remain intact. The result is a model that cannot recall trivia but follows formatting instructions with +46-75% improved precision.

This validates the CCP's Dual-Stack architecture: externalize factual knowledge to Neo4j (the Conscious Memory Library), and deploy width-pruned SLMs whose streamlined transformations execute format-perfect output without the noise of stored knowledge interfering. The MLP transformation becomes sharper by becoming narrower — projecting onto the compliance dimensions with reduced distraction from knowledge dimensions.

### 3. Paper #35: Selective Steering — Norm-Preserving Rotations at Discriminative Layers

Standard activation steering adds a vector: $\mathbf{h}' = \mathbf{h} + \alpha \cdot \mathbf{s}$. This changes both the direction AND the magnitude of the hidden state. The norm $||\mathbf{h}'||$ differs from $||\mathbf{h}||$. This norm distortion propagates through subsequent layers, potentially destabilizing the model's activation statistics and causing downstream transformations to behave erratically.

Paper #35 introduces a fundamentally different intervention: instead of adding a vector, apply a **rotation**. A rotation is a linear transformation that changes direction while perfectly preserving magnitude: $||\mathbf{h}'|| = ||\mathbf{h}||$. The hidden state is rotated from its current direction (e.g., "informal") toward the target direction (e.g., "formal") without any magnitude distortion.

The second innovation is **layer selectivity**. Not all layers are equally relevant to every behavioral trait. Paper #35 computes a discriminative score per layer by measuring how much each layer's activations differ between contrastive text pairs (e.g., formal vs. informal examples). The layer with the maximum contrastive separation is the single most effective intervention point for that specific trait.

The combined protocol:
1. Identify the target behavioral trait (e.g., "formality").
2. Compute the contrastive discriminative score at each layer using paired examples.
3. Select the top-scoring layers (e.g., layers 12-16 show maximum formality separation).
4. At those layers only, apply a norm-preserving rotation that moves the hidden state toward the formal direction.
5. Leave all other layers completely untouched.

The result: the model's formality shifts cleanly. JSON compliance (which is handled by different layers, typically deeper in the network) remains perfectly intact. The activation norm stays stable, preventing downstream transformations from destabilizing. And because rotation IS a linear transformation, it composes cleanly with the model's existing learned transformations — working WITH them rather than against them.

This is the mathematical synthesis of the entire lesson: understanding that Transformer layers are linear transformations, understanding that these transformations enforce geometric structure (ESR), understanding that their width controls the knowledge-compliance tradeoff (Fragile Knowledge), and understanding that effective intervention means applying the right TYPE of transformation (rotation, not addition) at the right LOCATION (discriminative layers) to produce surgical, stable behavioral modifications.

## 7. Deep Worked Example: Steering Vector Survival

Track a steering intervention through three consecutive Transformer layers.

**Setup:** At layer 10, inject steering vector $\mathbf{s} = (0.5, 0.3, -0.2)$ (3D simplified) with weight $\alpha = 1.0$.

**Layer 10 output:** $\mathbf{h}_{10}' = \mathbf{h}_{10} + \mathbf{s} = (2.0, 1.0, 0.5) + (0.5, 0.3, -0.2) = (2.5, 1.3, 0.3)$

**Layer 11 transformation** (learned rotation + slight compression):
Suppose $T_{11}$ rotates the state and mildly projects toward the pre-trained manifold.
$\mathbf{h}_{11}' = T_{11}(2.5, 1.3, 0.3) = (2.3, 1.1, 0.45)$
Without intervention: $T_{11}(2.0, 1.0, 0.5) = (2.0, 1.0, 0.48)$
Steering component surviving: $(2.3-2.0, 1.1-1.0, 0.45-0.48) = (0.3, 0.1, -0.03)$

**Layer 12 transformation:**
$\mathbf{h}_{12}' = T_{12}(2.3, 1.1, 0.45) = (2.15, 1.02, 0.47)$
Without intervention: $T_{12}(2.0, 1.0, 0.48) = (2.0, 1.0, 0.48)$
Steering component surviving: $(0.15, 0.02, -0.01)$

**Observation:** The steering signal $(0.5, 0.3, -0.2)$ has decayed to $(0.15, 0.02, -0.01)$ — losing approximately 90% of its magnitude over just two layers. This is ESR in action. The learned transformations at layers 11-12 are implicitly projecting the anomalous activation back onto the natural manifold. By layer 16, the intervention would be almost completely washed out.

**Fix:** If Paper #35's rotation method had been used instead of additive injection, the intervention would compose coherently with the downstream rotations, experiencing far less decay because it respects the norm structure that downstream layers expect.

## 8. Edge Case Analysis

**Residual Stream as Immune Shield:**
The residual connection $\mathbf{x}_{\text{next}} = \mathbf{x} + T(\mathbf{x})$ provides a counterbalance to ESR. Even if layer $L+1$'s transformation $T$ washes out the steering component, the residual connection re-adds the original (steered) hidden state. This creates a tug-of-war: the transformation fights the steer, but the residual preserves it. The net effect depends on the relative magnitudes — which is why steering weight $\alpha$ must be carefully calibrated.

**Compositional Collapse:**
If all 24 Transformer layers were purely linear (no GELU, no Softmax), the composition $T_{24} \circ T_{23} \circ \dots \circ T_1$ would collapse mathematically into a single linear transformation. 24 layers would be equivalent to 1 layer. This is the fundamental reason non-linear activations are mandatory — they break the compositional closure of linear maps, allowing each layer to compute genuinely new features.

## 9. Invariants: The Core Laws

1. **Basis Sufficiency:** A linear transformation is fully determined by its action on any basis. Know $T(\mathbf{e}_i)$ for all basis vectors → know $T(\mathbf{v})$ for all vectors. This is why matrices work: the matrix columns ARE the transformed basis vectors.

2. **Composition Closure:** If $T_1$ and $T_2$ are both linear, then $T_2 \circ T_1$ (apply $T_1$ then $T_2$) is also linear. This is why stacking Transformer layers works — the composite is still a structured, analyzable operation (within each linear segment).

3. **Rank-Nullity Conservation:** $\text{rank}(T) + \text{nullity}(T) = n$. Information is either preserved (rank) or destroyed (nullity). The transformation cannot create information from nothing. Understanding what lies in the null space tells you exactly what the model has chosen to ignore.
