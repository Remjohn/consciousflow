# Lesson 3: Linear Combinations & Spans — Mechanistic / Transformer Layer

## 1. Formal Definition

A **linear combination** of a set of vectors $\{\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_k\}$ is any vector $\mathbf{w}$ that can be written as:
$$\mathbf{w} = \sum_{i=1}^{k} \alpha_i \mathbf{v}_i = \alpha_1 \mathbf{v}_1 + \alpha_2 \mathbf{v}_2 + \dots + \alpha_k \mathbf{v}_k$$

where $\alpha_1, \alpha_2, \dots, \alpha_k \in \mathbb{R}$ are scalar weights (coefficients). The vectors $\mathbf{v}_i$ are the **basis** of the combination, and the scalars $\alpha_i$ are the **mixing weights**.

The **span** of a vector set is the collection of ALL possible vectors reachable through linear combination:
$$\text{span}(\mathbf{v}_1, \dots, \mathbf{v}_k) = \left\{\sum_{i=1}^{k} \alpha_i \mathbf{v}_i \;:\; \alpha_i \in \mathbb{R}\right\}$$

This set forms a **subspace** — a geometrically flat region (a line, a plane, a hyperplane) passing through the origin. The dimensionality of the span depends on how many of the basis vectors are genuinely **linearly independent** — that is, none of them can be written as a linear combination of the others.

Formally, a set of vectors $\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$ is **linearly independent** if the only solution to:
$$\alpha_1 \mathbf{v}_1 + \alpha_2 \mathbf{v}_2 + \dots + \alpha_k \mathbf{v}_k = \mathbf{0}$$
is the trivial solution $\alpha_1 = \alpha_2 = \dots = \alpha_k = 0$. If any non-trivial solution exists, the vectors are **linearly dependent** — at least one vector is redundant, expressible as a weighted sum of the others, contributing zero new geometric coverage to the span.

The dimension of the span equals the number of independent vectors: $\dim(\text{span}) = \text{rank} \leq \min(k, n)$, where $k$ is the number of vectors and $n$ is the ambient dimension. You can never span more directions than you have independent vectors, and you can never span more directions than the space itself permits.

## 2. Derivation: Why Weighted Sums Model Compositional Meaning

Why do linear combinations appear everywhere in both mathematics and neural computation? Because composition — building complex wholes from simpler parts — is the fundamental structure of meaning.

A color on a screen is a linear combination of Red, Green, and Blue channel intensities: $\text{color} = \alpha_R \cdot R + \alpha_G \cdot G + \alpha_B \cdot B$. A musical chord is a linear combination of individual frequency components. A word's meaning in context is a blend of the meanings of its surrounding words.

The deep mathematical reason this works is that vector spaces satisfy the axioms of **superposition**: if $\mathbf{v}_1$ and $\mathbf{v}_2$ are valid states of a system, then $\alpha_1 \mathbf{v}_1 + \alpha_2 \mathbf{v}_2$ is also a valid state. This closure property guarantees that mixing existing representations always produces another valid representation within the same structural framework. You never "fall off the edge" of the space by combining elements within it.

In the context of neural language models, this axiom has a precise architectural manifestation: the residual stream. Every layer of a Transformer reads from the residual stream (a vector), processes it through attention and MLP modules, and writes its contribution back as an additive update. The residual stream at layer $L$ is literally a linear combination of the original embedding plus all layer contributions: $\mathbf{h}_L = \mathbf{h}_0 + \sum_{l=1}^{L} \Delta_l$. Each $\Delta_l$ is weighted implicitly by the learned parameters. The entire forward pass of a Transformer is a cascading sequence of linear combinations punctuated by non-linear activations.

## 3. Operational Mechanics: Computing Attention Output

The most critical linear combination in the Transformer is the attention output computation. Let us trace the exact algorithmic execution.

**Setup:** A single attention head processes a sequence of $n$ tokens. The model has already computed:
- Query vectors: $\mathbf{Q}_i$ for each token $i$
- Key vectors: $\mathbf{K}_j$ for each token $j$  
- Value vectors: $\mathbf{V}_j$ for each token $j$
- Attention weights: $\alpha_{ij} = \text{softmax}\left(\frac{\mathbf{Q}_i \cdot \mathbf{K}_j}{\sqrt{d_k}}\right)$ for all pairs $(i, j)$

**The Linear Combination:**
For token $i$, the attention output is:
$$\text{output}_i = \sum_{j=1}^{n} \alpha_{ij} \mathbf{V}_j$$

This is a linear combination of ALL value vectors in the context, weighted by the attention scores. The GPU executes this as a matrix multiplication: $\text{Output} = \alpha \cdot V$, where $\alpha$ is the $n \times n$ attention weight matrix and $V$ is the $n \times d_v$ value matrix.

**What this means computationally:**
Each output vector is a freshly synthesized blend. When the model processes "The coach was empathetic because she understood pain," and token "she" computes its output, it does not copy any single value vector. It might compute something like:
$$\text{output}_{\text{she}} = 0.55 \cdot \mathbf{V}_{\text{coach}} + 0.20 \cdot \mathbf{V}_{\text{empathetic}} + 0.15 \cdot \mathbf{V}_{\text{understood}} + 0.08 \cdot \mathbf{V}_{\text{pain}} + 0.02 \cdot \mathbf{V}_{\text{The}}$$

The result is a new vector that blends the semantic content of "coach" (the referent), "empathetic" (the attribute), "understood" (the action), and "pain" (the context) into a unified representation. This manufactured vector then flows into subsequent layers, carrying richer meaning than any individual word could.

**The Span Constraint:**
The output vector must lie within the span of the value vectors. If all value vectors happen to cluster in a narrow region of the 768-dimensional space, the attention output is geometrically trapped in that same narrow region regardless of how the weights are distributed. Diverse, well-spread value vectors produce a rich span — giving the model a wide palette. Collapsed, redundant value vectors produce a thin span — constraining the model to repetitive, homogeneous outputs.

## 4. Dimensional Behavior: Rank and Span in High Dimensions

In $\mathbb{R}^{768}$, the span of $k$ value vectors can have at most $\min(k, 768)$ dimensions. For a typical attention head processing 2048 tokens, there are 2048 value vectors in $\mathbb{R}^{768}$. The maximum possible span dimension is 768 — the full ambient space.

But in practice, value vectors are not randomly distributed. They are produced by a learned linear projection $\mathbf{V}_j = W_V \mathbf{x}_j$, where $W_V \in \mathbb{R}^{d_v \times d_{\text{model}}}$. The rank of $W_V$ determines the effective dimensionality of all value vectors. If $W_V$ has rank $r < d_v$, then ALL value vectors are confined to an $r$-dimensional subspace, and no linear combination can escape that subspace.

This has direct implications for model compression. Techniques like GQA (Grouped Query Attention) explicitly reduce the number of independent Key/Value heads, collapsing the effective span. The compression works when the task doesn't require the full span — when the information can be adequately represented in a lower-dimensional subspace. It fails when critical behavioral distinctions require the geometric coverage that was pruned.

Similarly, LoRA fine-tuning (Paper #1 from Lesson 1) constrains weight updates to a rank-$r$ subspace: $\Delta W = BA$ where $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times d}$. Each column of $B$ is a basis direction. $A$ provides the combination coefficients. The update $\Delta W \mathbf{x} = B(A\mathbf{x})$ first projects $\mathbf{x}$ into an $r$-dimensional space (via $A$), then maps it back up (via $B$). The span of the update is exactly $r$-dimensional. If the behavioral change requires more than $r$ independent directions, the LoRA update physically cannot express it.

## 5. Connection to the Linear Algebra System

Linear combinations are the connective tissue binding the entire course together:

- **Vectors (Lesson 1):** The raw components being combined.
- **Dot Product (Lesson 2):** Produces the weights used in attention's linear combination. Without dot products, there are no attention scores, and without attention scores, there is no principled way to assign combination weights.
- **Linear Transformations (Lesson 4):** A matrix applied to a vector produces a new vector. That output is itself a linear combination of the matrix's column vectors, weighted by the input vector's components. Every matrix multiplication IS a set of simultaneous linear combinations.
- **Matrix Multiplication (Lesson 5):** Composes multiple linear combinations in sequence — chaining the transformations that each layer applies.
- **Change of Basis (Lesson 7):** Re-expressing the SAME span using different basis vectors. The geometric content (what you can reach) stays identical; the coordinate description changes.

## 6. Transformer and AI Mapping (Critical Architecture)

This section anchors linear combinations directly into the three CCP research papers that define the behavioral steering stack.

### 1. Paper #15: WAS (Weighted Activation Steering) — From Fixed to Dynamic Coefficients

The simplest form of activation steering is static: extract a steering direction $\mathbf{e}$ (e.g., for "empathy") and inject it at a fixed weight $\alpha$ into the residual stream at a specific layer. The intervention is a two-term linear combination:
$$\mathbf{h}_{\text{new}} = 1.0 \cdot \mathbf{h}_{\text{old}} + \alpha \cdot \mathbf{e}$$

Static steering has a fatal architectural flaw: $\alpha$ is constant regardless of context. If a client sends a calm, reflective message, the same $\alpha = 0.8$ empathy injection is applied as when a client sends a panicked, crisis-level message. The weight has no contextual intelligence.

Paper #15 introduces **WAS (Weighted Activation Steering)**, which replaces the fixed scalar with a learned function: $\alpha(x)$. A lightweight neural controller reads the current input $x$ and outputs a vector of dynamic weights — one per steering direction, per layer. The linear combination formula is identical:
$$\mathbf{h}_{\text{new}} = \mathbf{h}_{\text{old}} + \sum_{i} \alpha_i(x) \cdot \mathbf{e}_i$$

But now the coefficients $\alpha_i$ are functions of the input. When the client is angry, WAS might output $\alpha_{\text{empathy}} = 0.2$, $\alpha_{\text{firmness}} = 0.9$, $\alpha_{\text{humor}} = 0.0$. When the client is calm, it shifts to $\alpha_{\text{empathy}} = 0.8$, $\alpha_{\text{firmness}} = 0.3$, $\alpha_{\text{humor}} = 0.4$. Same basis vectors. Same linear combination formula. Completely different behavioral output — because the weights are adaptive.

The critical insight: the mathematical operation (linear combination) does not change. What changes is whether the coefficients are hardcoded constants or learned, input-dependent functions. WAS proves that the boundary between "static steering" and "dynamic steering" is nothing more than the boundary between fixed and variable coefficients in a weighted sum.

### 2. Paper #16: HYPERSteer — Generating Coefficients from Language

WAS requires manually extracting steering vectors and training a controller to weight them. Paper #16 takes a radically more ambitious approach: what if you could describe the desired behavior in natural language, and a neural network would automatically produce the correct combination weights?

**HYPERSteer** introduces a hypernetwork — a secondary neural network that takes a text description as input (e.g., "warm, encouraging, uses metaphors, avoids jargon") and outputs a precise set of coefficients $\{\alpha_1, \alpha_2, \dots, \alpha_k\}$ for combining latent steering vectors.

The architecture works in two stages:
1. **Basis Extraction:** During training, the system identifies $k$ latent steering directions in the model's activation space — not tied to single concepts like "empathy" or "formality," but learned abstract basis vectors that span the behavioral space.
2. **Coefficient Generation:** At inference time, the hypernetwork processes the natural language behavior description and outputs the $k$-dimensional coefficient vector: $\boldsymbol{\alpha} = f_{\text{hyper}}(\text{"warm, encouraging, metaphorical"})$.

The final intervention is the familiar linear combination:
$$\mathbf{h}_{\text{new}} = \mathbf{h}_{\text{old}} + \sum_{i=1}^{k} \alpha_i \cdot \mathbf{e}_i$$

HYPERSteer's breakthrough is that it automates the weight selection. Instead of a human engineer manually tuning $\alpha_{\text{empathy}} = 0.8$, the hypernetwork computes the optimal coefficients from a qualitative description. This enables infinite behavioral variation without pre-computing individual archetype vectors. You describe a novel persona in words, and the system generates the precise mathematical recipe — the weights in the linear combination — to produce it.

The span constraint remains absolute: the hypernetwork can only produce behaviors within the span of its $k$ latent basis vectors. If the basis lacks an independent direction for "humor," no text description requesting humor will produce it. The quality of the basis determines the quality of the output.

### 3. Paper #34: RISER — Time-Varying Linear Combinations with Dynamic Support

WAS makes weights dynamic. HYPERSteer makes weight generation automatic. Paper #34 (RISER, score 98) represents the pinnacle: it makes the entire linear combination — both the weights AND which basis vectors participate — change at every single token.

RISER trains a **meta-router** that orchestrates multiple latent cognitive primitives (basis vectors representing distinct reasoning or behavioral skills). At each token position $t$, the router outputs:
$$\boldsymbol{\alpha}_t = \{\alpha_{t,1}, \alpha_{t,2}, \dots, \alpha_{t,k}\}$$

But unlike WAS, RISER allows $\alpha_{t,i} = 0$ — completely deactivating a primitive. This means the set of active basis vectors (the **support** of the linear combination) changes token-by-token.

Consider a practical CCP scenario. A user sends a Telegram message describing a complex emotional situation requiring multiple coaching modes. RISER processes the input token-by-token:

- **Token 1-10** (user describes anxiety): RISER activates $\{\text{empathy}: 0.9, \text{logic}: 0.3, \text{humor}: 0.0\}$. The linear combination is a 2-primitive blend. Humor is zeroed out — terminated.
- **Token 11-25** (user shifts to analyzing their triggers): RISER transitions to $\{\text{empathy}: 0.4, \text{logic}: 0.8, \text{humor}: 0.0\}$. The logic primitive scales up as analytical content demands precision.
- **Token 26-35** (user makes a self-deprecating joke): RISER detects the tonal shift and activates $\{\text{empathy}: 0.4, \text{logic}: 0.5, \text{humor}: 0.3\}$. Humor springs into the mix — a new basis vector enters the combination.
- **Token 36-40** (user returns to vulnerability): RISER terminates humor back to zero and restores empathy dominance: $\{\text{empathy}: 0.9, \text{logic}: 0.2, \text{humor}: 0.0\}$.

At every token, RISER is computing a different linear combination of the same underlying primitive vectors. The basis set is fixed (the $k$ pre-trained primitives), but the active subset and the weighting shift fluidly. This is the ultimate generalization of the linear combination concept: not static mixing, not just dynamic weights, but dynamic support with real-time activation and termination of basis components.

The span of RISER's behavioral output equals the span of all $k$ primitives collectively. But at any given token, the effective span is smaller — limited to whichever primitives are currently active. RISER deliberately narrows the span moment-by-moment to match the precise requirements of the current conversational context, preventing irrelevant primitives from injecting noise.

## 7. Deep Worked Example: Tracing the Full Attention Pipeline

Let us trace a complete attention computation for the CCP processing the input: "She was brave."

**Step 1: Value Vector Generation**
After passing through the learned $W_V$ projection:
$\mathbf{V}_{\text{She}} = (0.1, 0.8, 0.3)$
$\mathbf{V}_{\text{was}} = (0.0, 0.1, 0.0)$
$\mathbf{V}_{\text{brave}} = (0.9, 0.2, 0.7)$

**Step 2: Attention Weight Computation** (from Lesson 2)
After $QK^T / \sqrt{d_k}$ and Softmax, the attention weights for token "brave" attending to all tokens are:
$\alpha_{\text{brave→She}} = 0.55$, $\alpha_{\text{brave→was}} = 0.05$, $\alpha_{\text{brave→brave}} = 0.40$

**Step 3: Linear Combination (The Actual Output)**
$$\text{output}_{\text{brave}} = 0.55 \cdot (0.1, 0.8, 0.3) + 0.05 \cdot (0.0, 0.1, 0.0) + 0.40 \cdot (0.9, 0.2, 0.7)$$
$$= (0.055, 0.44, 0.165) + (0.0, 0.005, 0.0) + (0.36, 0.08, 0.28)$$
$$= (0.415, 0.525, 0.445)$$

**Interpretation:** The output $(0.415, 0.525, 0.445)$ is a freshly manufactured vector. It borrows heavily from "She" (the referent receives 55% weight) and substantially from "brave" itself (40% self-attention), with "was" contributing negligibly. The resulting vector encodes a blended representation: "the person referred to by 'She,' characterized by bravery." This vector did not exist in any input. It was constructed by the linear combination.

**Span Check:** Can this output exist outside the span of the three value vectors? No. It is mathematically impossible. The output is always a convex combination (weights summing to 1, all non-negative after Softmax) of the value vectors. If all three value vectors cluster in a small region, the output is trapped in that same small region no matter how the weights distribute. Geometric diversity of value vectors is essential for expressive outputs.

## 8. Edge Case Analysis

**Rank-Deficient Steering Sets:**
If a CCV system defines 5 steering vectors but 3 of them are linear combinations of the first 2, the effective behavioral span is 2-dimensional. The system has 5 faders on the console, but 3 of them are ghost controls — moving them produces only changes already achievable by the first 2. Detecting this requires computing the rank of the matrix formed by stacking the steering vectors as rows. If rank < number of vectors, redundancy exists.

**Span Collapse Under LoRA:**
A LoRA fine-tune with rank $r = 4$ can only modify the model's behavior along 4 independent directions. If the target behavioral shift (e.g., "speak like a specific clinical psychologist with very particular therapeutic frameworks") requires 12 independent directions, the rank-4 update cannot span the required behavioral space. The model will approximate the target behavior by projecting it onto the closest 4-dimensional subspace, losing the nuance that lives in the other 8 dimensions.

**Attention Weight Degeneracy:**
When Softmax produces a near-one-hot attention distribution (e.g., $\alpha = [0.99, 0.005, 0.005]$), the linear combination degenerates into approximately copying the dominant value vector. The model stops blending and starts parroting. The output loses the compositional richness that linear combination enables. This is the overconfidence failure that EAST (Lesson 2, Paper #12) explicitly addresses by flattening the weight distribution.

## 9. Invariants: The Core Laws

1. **Zero Vector Inclusion:** $\mathbf{0} = 0 \cdot \mathbf{v}_1 + 0 \cdot \mathbf{v}_2 + \dots$. The zero vector is always in the span of any set. Setting all weights to zero always produces the origin. In attention, this corresponds to the degenerate case where no tokens receive weight — a failure state prevented by Softmax normalization.

2. **Closure Under Combination:** If $\mathbf{u}$ and $\mathbf{w}$ are both in the span, then $\beta_1 \mathbf{u} + \beta_2 \mathbf{w}$ is also in the span. You cannot escape the span by combining things already within it. This guarantees that cascaded operations (multiple attention layers) produce outputs that remain within well-defined geometric boundaries.

3. **Dimension Bound:** $\dim(\text{span}(\mathbf{v}_1, \dots, \mathbf{v}_k)) \leq \min(k, n)$. The span can never exceed the number of independent basis vectors or the ambient dimensionality of the space. This is the hard mathematical ceiling on model expressiveness — and why RISER's effectiveness depends on having a sufficiently large, diverse set of latent primitives.
