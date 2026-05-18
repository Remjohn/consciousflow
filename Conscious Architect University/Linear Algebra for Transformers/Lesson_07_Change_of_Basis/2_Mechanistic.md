# Lesson 7: Change of Basis — Mechanistic / Transformer Layer

## 1. Formal Definition

### Basis

A **basis** for $\mathbb{R}^n$ is a set of $n$ vectors $B = \{\mathbf{b}_1, \mathbf{b}_2, \dots, \mathbf{b}_n\}$ satisfying two properties:
1. **Linear independence:** No vector in the set can be expressed as a linear combination of the others.
2. **Spanning:** Every vector in $\mathbb{R}^n$ can be expressed as a linear combination of the basis vectors.

Together, these properties guarantee that every vector has a UNIQUE representation in basis $B$: for any $\mathbf{v} \in \mathbb{R}^n$, there exist unique coefficients $c_1, \dots, c_n$ such that:

$$\mathbf{v} = c_1 \mathbf{b}_1 + c_2 \mathbf{b}_2 + \cdots + c_n \mathbf{b}_n$$

The vector of coefficients $[c_1, c_2, \dots, c_n]^T$ is denoted $[\mathbf{v}]_B$ — the **coordinate representation** of $\mathbf{v}$ in basis $B$.

### Change of Basis Matrix

Given two bases for $\mathbb{R}^n$:
- $B = \{\mathbf{b}_1, \dots, \mathbf{b}_n\}$ (source basis)
- $C = \{\mathbf{c}_1, \dots, \mathbf{c}_n\}$ (target basis)

The **change-of-basis matrix** $P_{B \to C}$ satisfies:

$$[\mathbf{v}]_C = P_{B \to C} \cdot [\mathbf{v}]_B$$

Construction: Column $j$ of $P_{B \to C}$ is $[\mathbf{b}_j]_C$ — the source basis vector $\mathbf{b}_j$ expressed in the target basis $C$'s coordinates.

**When converting FROM an arbitrary basis $B$ TO the standard basis $S$:** The change-of-basis matrix has the basis vectors of $B$ as its columns:

$$P_{B \to S} = \begin{bmatrix} | & | & \cdots & | \\ \mathbf{b}_1 & \mathbf{b}_2 & \cdots & \mathbf{b}_n \\ | & | & \cdots & | \end{bmatrix}$$

**When converting FROM the standard basis $S$ TO an arbitrary basis $B$:** Use the inverse:

$$P_{S \to B} = P_{B \to S}^{-1}$$

### Orthogonal Bases

A basis is **orthogonal** if its vectors are mutually perpendicular: $\mathbf{b}_i \cdot \mathbf{b}_j = 0$ for $i \neq j$.

A basis is **orthonormal** if it is orthogonal AND each vector has unit length: $||\mathbf{b}_i|| = 1$.

For orthonormal bases, the change-of-basis matrix is an **orthogonal matrix** $Q$ satisfying $Q^T Q = I$, which means $Q^{-1} = Q^T$. The inverse is simply the transpose — no matrix inversion computation needed. This is computationally significant: matrix inversion is expensive, but transposition is essentially free.

## 2. Derivation: Why Matrix Multiplication IS Basis Change

Every matrix-vector multiplication $\mathbf{y} = M\mathbf{x}$ can be interpreted as a basis change.

**Column perspective:** The columns of $M$ tell you WHERE the standard basis vectors land after the transformation. Column $j$ = the image of $\mathbf{e}_j$. If you think of the columns as a NEW set of axes, then the multiplication $M\mathbf{x}$ = "take $x_1$ units of column 1 + $x_2$ units of column 2 + ..." = express $\mathbf{x}$'s coordinates in the basis defined by $M$'s columns.

This connects directly to Lesson 5 (Matrix Multiplication). Every linear transformation IS a basis change: it takes coordinates in one basis and produces coordinates in another.

### The Composition Rule

If $P$ converts from basis $A$ to basis $B$, and $Q$ converts from basis $B$ to basis $C$, then:

$$Q \cdot P \text{ converts from basis } A \text{ to basis } C$$

Matrix multiplication composes basis changes. A Transformer with 24 layers performs 24 successive basis changes — and the composition of all 24 (if we ignore nonlinearities and residuals) would be a single matrix $W_{24} W_{23} \cdots W_1$ that converts directly from the input basis to the output basis.

### Similarity Transform — Describing a Transformation in a New Basis

If $T$ is a transformation described in the standard basis, and you want to describe the SAME transformation in basis $B$, the formula is:

$$T_B = P^{-1} T P$$

where $P$ is the change-of-basis matrix from $B$ to standard. This is called a **similarity transform**. The transformation $T$ doesn't change — only its description (its matrix representation) changes. This will become critical in Lesson 8 (Eigen-Everything), where the EIGENVECTOR basis is the one that makes every transformation look like pure scaling.

## 3. Operational Mechanics in the Transformer

### Layer-to-Layer Basis Transformation

Each Transformer layer applies two major operations:
1. **Multi-head attention** — basis change from residual stream to per-head query/key/value bases, then back
2. **MLP** — basis change into a higher-dimensional intermediate basis, then back

**Attention basis change (per head $h$ at layer $l$):**

$$\mathbf{q}_{l,h} = W_Q^{l,h} \cdot \mathbf{h}_{l-1}$$
$$\mathbf{k}_{l,h} = W_K^{l,h} \cdot \mathbf{h}_{l-1}$$
$$\mathbf{v}_{l,h} = W_V^{l,h} \cdot \mathbf{h}_{l-1}$$

Each $W_Q^{l,h} \in \mathbb{R}^{d_k \times d}$ is a projection (Lesson 6) that is simultaneously a basis change: it converts the residual stream's $d$-dimensional representation into the head's $d_k$-dimensional query basis.

The query and key vectors exist in a SHARED basis (the attention basis) where their dot product $\mathbf{q}^T \mathbf{k}$ is meaningful. The value vectors exist in a different basis — the value basis — optimized for carrying content information.

**MLP basis change:**

$$\text{MLP}(\mathbf{h}) = W_2 \cdot \sigma(W_1 \cdot \mathbf{h} + \mathbf{b}_1) + \mathbf{b}_2$$

$W_1 \in \mathbb{R}^{4d \times d}$ projects the $d$-dimensional residual stream into a $4d$-dimensional intermediate basis (4× expansion). This higher-dimensional basis provides more "room" for the nonlinearity $\sigma$ to separate features. $W_2 \in \mathbb{R}^{d \times 4d}$ projects back to the original $d$-dimensional basis.

The MLP round-trips through a higher-dimensional space — going up to 4d and back to d — because the nonlinear activation $\sigma$ needs the extra dimensions to carve out complex decision boundaries that don't exist in the lower-dimensional space.

### The Residual Stream as Universal Basis (KV-Direct)

The residual stream accumulates information from ALL layers:

$$\mathbf{h}_l = \mathbf{h}_0 + \sum_{k=1}^{l}(\text{Attn}_k + \text{MLP}_k)$$

The key insight is that $W_K^l$ and $W_V^l$ are FIXED deterministic matrices. Given the residual stream vector $\mathbf{h}_{l-1}$ at any position, the key at layer $l$ is:

$$\mathbf{k}_{l} = W_K^l \cdot \mathbf{h}_{l-1}$$

This is a DETERMINISTIC basis change. Knowing $\mathbf{h}_{l-1}$ = knowing $\mathbf{k}_l$ for ALL layers $l$ that use $\mathbf{h}_{l-1}$ as input.

**KV-Direct storage protocol:**
1. During generation, store $\mathbf{h}_{l-1,t} \in \mathbb{R}^d$ for each token $t$ (5KB per token for $d = 2560$)
2. When attention at layer $l$ needs $\mathbf{k}_{l,t}$: compute $W_K^l \cdot \mathbf{h}_{l-1,t}$ on-the-fly (one matrix-vector product)
3. No storage of $\mathbf{k}_{l,t}$ or $\mathbf{v}_{l,t}$ — they are derived from the universal representation

**Memory comparison for a 24-layer model with $d = 2560$, $d_k = 128$, all 32 heads:**
- Standard KV cache: $24 \text{ layers} \times 2 \text{ (K+V)} \times 32 \text{ heads} \times 128 \times 2 \text{ bytes} = 393\text{KB/token}$
- KV-Direct: $2560 \times 2 \text{ bytes} = 5\text{KB/token}$
- Compression: $\sim 78\times$ (even higher than the paper's 27× for their specific model)

The EXACT compression ratio depends on model architecture, but the principle is universal: the residual stream carries ALL information that layer-specific representations need. Storing the universal basis representation is always more efficient than storing derived, layer-specific representations.

## 4. Structural Behavior

### Dimension Preservation

A valid basis change in $\mathbb{R}^n$ preserves dimensionality. The change-of-basis matrix $P \in \mathbb{R}^{n \times n}$ is square and invertible. You cannot gain or lose dimensions through a basis change.

However, the attention projections $W_Q^{l,h} \in \mathbb{R}^{d_k \times d}$ with $d_k < d$ are NOT full basis changes — they are projections (Lesson 6) that reduce dimension. They represent the model's choice to focus on a $d_k$-dimensional subspace of the full $d$-dimensional residual stream.

### Composition and Associativity

Basis changes compose via matrix multiplication:
$$P_{A \to C} = P_{B \to C} \cdot P_{A \to B}$$

Composition is associative: $(P_3 P_2) P_1 = P_3 (P_2 P_1)$. The order of multiplication matters (non-commutative), but the grouping doesn't.

A 24-layer Transformer's full forward transformation is:
$$\text{Output} = W_{\text{unembed}} \cdot f_{24}(f_{23}(\cdots f_1(\mathbf{h}_0) \cdots))$$

Each $f_l$ contains basis changes (projections, MLPs) and nonlinearities. Without nonlinearities, this would collapse to a single matrix multiplication — a single basis change. The nonlinearities prevent this collapse, forcing each layer to add genuinely new computational capacity.

### Orthogonality in Attention

Multi-head attention distributes the $d$-dimensional space across $H$ heads, each with a $d_k = d/H$-dimensional subspace. Ideally, these subspaces are ORTHOGONAL — each head operates in its own independent "room" within the full attention space.

In practice, head subspaces overlap. RLKV (Paper #53) exploits this: overlapping heads contain REDUNDANT information. Compressing a redundant head causes minimal quality loss because its information is partially recoverable from other heads. Only heads with UNIQUE basis directions (non-overlapping subspaces) are critical.

## 5. Connection to the Linear Algebra System

| Lesson | Connection to Basis Change |
|--------|---------------------------|
| **L1 (Vectors)** | Coordinates are basis-dependent. The SAME vector has different coordinate representations in different bases. |
| **L2 (Dot Product)** | The dot product is basis-invariant for orthonormal bases: $\mathbf{x} \cdot \mathbf{y}$ gives the same value regardless of which orthonormal basis you compute in. |
| **L3 (Linear Combinations)** | A vector's representation in a new basis IS a linear combination of the new basis vectors. |
| **L4 (Transformations)** | Every linear transformation can be viewed as a basis change: the columns of the transformation matrix define the new axes. |
| **L5 (Matrix Multiplication)** | Change of basis IS matrix multiplication. Every matrix-vector product converts coordinates between bases. |
| **L6 (Projections)** | Projections are dimension-reducing "basis changes" — they map to a subspace and discard information orthogonal to that subspace. |
| **L8 (Eigen-Everything)** | Eigenvectors provide the NATURAL basis for a transformation — the basis where the transformation acts as pure scaling. |

## 6. Transformer and AI Mapping

### Interpretability as Basis Discovery

Probing is the search for a change-of-basis matrix from the model's learned representation to a human-readable basis.

**Linear probing:** Train a matrix $P$ such that $P \cdot \mathbf{h}_l = t$ where $t$ is a human-readable label (e.g., sentiment score, part-of-speech tag). If $P$ achieves high accuracy, it means the model's representation at layer $l$ encodes the target concept in a direction accessible via linear projection. The matrix $P$ IS a change-of-basis operation that rotates from "model coordinates" to "[sentiment axis]."

**Concept directions:** "The direction of toxicity" in embedding space. If subtracting the vector for "kind" and adding the vector for "hostile" reliably transforms text representations, then the vector (hostile - kind) defines a basis direction for toxicity. This direction is one axis of a human-interpretable basis.

For the CCP: finding the "direction of conviction" in the model's representation space would enable direct manipulation without reward-based training. If we can identify $\mathbf{v}_\text{conviction}$, then $\mathbf{h}' = \mathbf{h} + \alpha \mathbf{v}_\text{conviction}$ (Lesson 1, vector addition) directly increases the model's conviction in generated text. This is CCV steering — and it IS a basis-guided operation.

### Pre-trained vs Post-trained Bases (Thinking Sparks #52)

Pre-training establishes the initial basis structure: 32 generic attention heads with broad, overlapping feature detection patterns. The basis directions are optimized for next-token prediction — a universal task.

Post-training (GRPO, SFT, distillation) MODIFIES this basis:
- **GRPO** adds new basis directions dynamically — specialized heads that activate for reward-relevant features
- **SFT/Distillation** adds new basis directions stably — heads that specialize based on demonstration data

The resulting basis is a SUPERSET of the pre-trained basis: all original directions are preserved (the base model's knowledge persists) plus new directions for task-specific capabilities (coaching empathy, conviction detection, humor timing).

### RLKV: Basis Selection Under Resource Constraints (Paper #53)

During long Pipecat Roleplay sessions, GPU memory is finite. Storing full KV cache for all 32 heads is infeasible beyond a certain context length. RLKV solves this by selecting the MINIMAL basis — the smallest set of heads whose KV cache fully supports reasoning quality:

1. **Full basis:** All 32 heads → 100% reasoning quality, 100% memory cost
2. **RLKV basis:** 8-12 selected heads → 98%+ reasoning quality, 25-37% memory cost
3. **Compressed remaining heads:** 4-bit quantization → additional memory savings

The selection criterion is the composite RL reward: $r = \alpha \cdot \text{accuracy} + (1-\alpha) \cdot (1-\text{cache\_cost})$. The gradient (Lesson 11) teaches the gating mechanism which heads to protect and which to compress.

## 7. Deep Worked Examples

### Example 1: Basis Change in 2D (Manual Computation)

**Given:**
- Standard basis: $S = \{[1,0], [0,1]\}$
- Custom basis: $B = \{[2,1], [-1,3]\}$
- Vector: $\mathbf{v} = [5, 7]_S$ (in standard coordinates)

**Task:** Find $[\mathbf{v}]_B$ — the same vector expressed in basis $B$.

**Step 1:** Construct the change-of-basis matrix $P_{B \to S}$ (columns = basis vectors of $B$ in standard coords):
$$P = \begin{bmatrix} 2 & -1 \\ 1 & 3 \end{bmatrix}$$

**Step 2:** We need $P^{-1}$ to convert FROM standard TO basis $B$:
$$P^{-1} = \frac{1}{2(3) - (-1)(1)} \begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix} = \frac{1}{7} \begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix}$$

**Step 3:** Apply:
$$[\mathbf{v}]_B = P^{-1} [5, 7]^T = \frac{1}{7} \begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix} \begin{bmatrix} 5 \\ 7 \end{bmatrix} = \frac{1}{7} \begin{bmatrix} 22 \\ 9 \end{bmatrix} = \begin{bmatrix} 22/7 \\ 9/7 \end{bmatrix}$$

**Verify:** $(22/7)[2,1] + (9/7)[-1,3] = [44/7, 22/7] + [-9/7, 27/7] = [35/7, 49/7] = [5, 7]$ ✓

### Example 2: KV-Direct On-Demand Re-derivation

**Setup:** Model has $d = 4$, layer $l$ has $W_K^l = \begin{bmatrix} 0.5 & -0.3 & 0.2 & 0.1 \\ 0.1 & 0.4 & -0.2 & 0.3 \end{bmatrix}$

Stored residual stream vector: $\mathbf{h}_t = [0.8, -0.6, 0.3, 0.9]^T$

**Re-derivation:**
$$\mathbf{k}_{l,t} = W_K^l \cdot \mathbf{h}_t = \begin{bmatrix} 0.5(0.8) + (-0.3)(-0.6) + 0.2(0.3) + 0.1(0.9) \\ 0.1(0.8) + 0.4(-0.6) + (-0.2)(0.3) + 0.3(0.9) \end{bmatrix}$$

$$= \begin{bmatrix} 0.4 + 0.18 + 0.06 + 0.09 \\ 0.08 - 0.24 - 0.06 + 0.27 \end{bmatrix} = \begin{bmatrix} 0.73 \\ 0.05 \end{bmatrix}$$

This computation is ONE matrix-vector multiplication — the same operation the model performs during a standard forward pass. The overhead is negligible: recomputing a key/value pair is a fraction of the compute already spent on attention. But the memory savings are dramatic: one 4D vector stored instead of 2D key + 2D value per layer × number of layers.

## 8. Edge Cases

### When the Basis Change Matrix is Near-Singular

If the change-of-basis matrix $P$ has a very small determinant ($\det(P) \approx 0$), the basis vectors are nearly parallel. In this case:
- The inverse $P^{-1}$ has enormous entries
- Small numerical errors in the coordinates get amplified massively
- The basis is "ill-conditioned" — it's technically valid but practically unusable

In Transformers, attention heads that learn nearly parallel feature directions suffer from this problem: their combined contribution is numerically unstable. Weight decay regularization pushes the model away from ill-conditioned bases during training.

### Non-Square Basis Changes (Projections)

Attention projections $W_Q^{l,h} \in \mathbb{R}^{d_k \times d}$ with $d_k < d$ are non-square matrices. They perform dimension-reducing basis changes — projections into a subspace. These are NOT invertible: information is lost in the projection.

The output projection $W_O^{l,h} \in \mathbb{R}^{d \times d_k}$ maps back to the full-dimensional space. But $W_O W_Q \neq I$ — the round-trip through the projection is not identity. The information discarded by $W_Q$ is gone permanently.

### Compositional Explosion

For a 24-layer Transformer with 32 heads per layer, the total number of distinct basis changes per forward pass is:
- $24 \times 32 = 768$ Q projections
- $24 \times 32 = 768$ K projections
- $24 \times 32 = 768$ V projections
- $24 \times 32 = 768$ O projections
- $24$ MLP up-projections
- $24$ MLP down-projections
- Total: $>\!3,000$ basis changes per forward pass

This is why Transformer models are computationally expensive: each basis change is a matrix multiplication, and there are thousands of them per token.

## 9. Invariants: The Core Laws

1. **Dimension preservation:** A valid basis change in $\mathbb{R}^n$ requires EXACTLY $n$ independent basis vectors. Cannot gain or lose dimensions.

2. **Invertibility:** Every basis change is invertible. If $P$ converts $A \to B$, then $P^{-1}$ converts $B \to A$. The information is preserved completely.

3. **Composition:** If $P$ converts $A \to B$ and $Q$ converts $B \to C$, then $QP$ converts $A \to C$. Matrix multiplication composes basis changes.

4. **Dot product invariance (orthonormal bases):** For orthonormal bases, $\mathbf{x} \cdot \mathbf{y}$ gives the same value regardless of which orthonormal basis the computation is performed in. The dot product is a geometric quantity — basis-independent.

5. **Deterministic recovery (KV-Direct):** If the change-of-basis matrix is fixed (as $W_K^l$ is after training), the basis change is deterministic. Knowing the input = knowing the output. No information is added or lost.

## 10. Minimal Analogy Support

**The Rosetta Stone:**

The Rosetta Stone carried the same decree in three writing systems: Egyptian hieroglyphs, Demotic script, and Ancient Greek. The MEANING (the vector) was identical. The REPRESENTATION (the coordinates in each writing system's "basis") was completely different. The stone itself was the "change-of-basis matrix" — it allowed scholars to convert between representations.

The Transformer's residual stream IS the Rosetta Stone. It carries the universal meaning from which any layer's specialized representation (its "writing system") can be derived. KV-Direct stores the Rosetta Stone and re-translates on demand instead of storing every translation separately.
