# Lesson 8: Eigen-Everything — Mechanistic / Transformer Layer

## 1. Formal Definition

### Eigenvalue and Eigenvector

For a square matrix $A \in \mathbb{R}^{n \times n}$, a scalar $\lambda \in \mathbb{R}$ (or $\mathbb{C}$) is an **eigenvalue** of $A$ if there exists a non-zero vector $\mathbf{v} \in \mathbb{R}^n$ such that:

$$A\mathbf{v} = \lambda\mathbf{v}$$

The vector $\mathbf{v}$ is the corresponding **eigenvector**. The set of all eigenvectors for a given $\lambda$, together with the zero vector, forms the **eigenspace** $E_\lambda = \text{null}(A - \lambda I)$.

### Characteristic Polynomial

Rearranging the eigenvalue equation:

$$(A - \lambda I)\mathbf{v} = \mathbf{0}$$

For non-trivial solutions ($\mathbf{v} \neq \mathbf{0}$), the matrix $(A - \lambda I)$ must be singular:

$$\det(A - \lambda I) = 0$$

This determinant is a polynomial of degree $n$ in $\lambda$ — the **characteristic polynomial**:

$$p(\lambda) = \det(A - \lambda I) = (-1)^n \lambda^n + c_{n-1}\lambda^{n-1} + \cdots + c_1\lambda + c_0$$

The roots of this polynomial are the eigenvalues.

### Diagonalization

If $A$ has $n$ linearly independent eigenvectors $\mathbf{v}_1, \dots, \mathbf{v}_n$ with eigenvalues $\lambda_1, \dots, \lambda_n$, then:

$$A = PDP^{-1}$$

where:
- $P = [\mathbf{v}_1 | \mathbf{v}_2 | \cdots | \mathbf{v}_n]$ — the matrix whose columns are eigenvectors
- $D = \text{diag}(\lambda_1, \lambda_2, \dots, \lambda_n)$ — the diagonal matrix of eigenvalues

In the eigenvector basis, $A$ IS $D$ — a diagonal matrix where each dimension scales independently.

### Spectral Theorem (Symmetric Matrices)

For symmetric matrices ($A = A^T$):
1. ALL eigenvalues are real (not complex)
2. Eigenvectors corresponding to distinct eigenvalues are ORTHOGONAL
3. $A$ is always diagonalizable: $A = Q\Lambda Q^T$ where $Q$ is orthogonal ($Q^TQ = I$)

This theorem is critical because many Transformer-relevant matrices are symmetric: $W^TW$, $WW^T$, the Hessian $H$, and covariance matrices. For these matrices, eigenanalysis is always well-defined, all eigenvalues are real, and the eigenvectors form an orthonormal basis.

## 2. Derivation: Computing Eigenvalues and Eigenvectors

### 2×2 Complete Example

$$A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$$

**Step 1: Characteristic polynomial**

$$\det(A - \lambda I) = \det\begin{bmatrix} 4-\lambda & 2 \\ 1 & 3-\lambda \end{bmatrix} = (4-\lambda)(3-\lambda) - 2 \cdot 1$$

$$= 12 - 4\lambda - 3\lambda + \lambda^2 - 2 = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2) = 0$$

**Eigenvalues:** $\lambda_1 = 5$, $\lambda_2 = 2$

**Step 2: Find eigenvectors**

For $\lambda_1 = 5$:
$$(A - 5I)\mathbf{v} = \begin{bmatrix} -1 & 2 \\ 1 & -2 \end{bmatrix}\mathbf{v} = \mathbf{0}$$

Row 1: $-v_1 + 2v_2 = 0 \Rightarrow v_1 = 2v_2$

Choose $v_2 = 1$: $\mathbf{v}_1 = [2, 1]^T$

For $\lambda_2 = 2$:
$$(A - 2I)\mathbf{v} = \begin{bmatrix} 2 & 2 \\ 1 & 1 \end{bmatrix}\mathbf{v} = \mathbf{0}$$

Row 1: $2v_1 + 2v_2 = 0 \Rightarrow v_1 = -v_2$

Choose $v_2 = 1$: $\mathbf{v}_2 = [-1, 1]^T$

**Step 3: Verify**

$A\mathbf{v}_1 = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}\begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 10 \\ 5 \end{bmatrix} = 5 \begin{bmatrix} 2 \\ 1 \end{bmatrix}$ ✓

$A\mathbf{v}_2 = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}\begin{bmatrix} -1 \\ 1 \end{bmatrix} = \begin{bmatrix} -2 \\ 2 \end{bmatrix} = 2 \begin{bmatrix} -1 \\ 1 \end{bmatrix}$ ✓

**Step 4: Diagonalization**

$$P = \begin{bmatrix} 2 & -1 \\ 1 & 1 \end{bmatrix}, \quad D = \begin{bmatrix} 5 & 0 \\ 0 & 2 \end{bmatrix}$$

$$A = PDP^{-1} = \begin{bmatrix} 2 & -1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} 5 & 0 \\ 0 & 2 \end{bmatrix}\begin{bmatrix} 2 & -1 \\ 1 & 1 \end{bmatrix}^{-1}$$

In the eigenvector basis, $A$ is just $D$ — pure scaling: stretch by 5 along $[2,1]$, stretch by 2 along $[-1,1]$.

### Power Computation Payoff

$A^{10}$ in the eigenvector basis:

$$A^{10} = PD^{10}P^{-1} = P\begin{bmatrix} 5^{10} & 0 \\ 0 & 2^{10} \end{bmatrix}P^{-1} = P\begin{bmatrix} 9{,}765{,}625 & 0 \\ 0 & 1{,}024 \end{bmatrix}P^{-1}$$

After 10 applications, the component along $\mathbf{v}_1$ has been amplified by ~10 million, while the component along $\mathbf{v}_2$ has only been amplified by ~1000. The dominant eigenvector's direction ($[2,1]$) overwhelmingly dominates the output — every input vector, regardless of initial direction, converges toward $[2,1]$ after repeated application.

## 3. Operational Mechanics: Eigenanalysis in Transformers

### Singular Value Decomposition (SVD)

For non-square matrices (like attention projections $W_Q \in \mathbb{R}^{d_k \times d}$), eigenvalue decomposition doesn't directly apply. The generalization is **SVD**:

$$W = U \Sigma V^T$$

where:
- $U \in \mathbb{R}^{m \times m}$ — left singular vectors (eigenvectors of $WW^T$)
- $\Sigma \in \mathbb{R}^{m \times n}$ — diagonal matrix of singular values $\sigma_i = \sqrt{\lambda_i(W^TW)}$
- $V \in \mathbb{R}^{n \times n}$ — right singular vectors (eigenvectors of $W^TW$)

The singular values $\sigma_i$ are the square roots of the eigenvalues of $W^TW$. They measure how much $W$ stretches along each orthogonal direction.

For LoRA (Lesson 6): the rank-$r$ approximation of $W$ keeps only the top $r$ singular values and their corresponding singular vectors. The approximation $W_r = U_r \Sigma_r V_r^T$ minimizes the reconstruction error $||W - W_r||$ over ALL rank-$r$ matrices. This is the Eckart-Young theorem — the optimal low-rank approximation is determined ENTIRELY by the eigenspectrum.

LoRA's effectiveness depends on the eigenspectrum: if the singular values decay rapidly (a few large values followed by many near-zero values), the weight matrix is effectively low-rank, and LoRA with $r = 4$ or $r = 8$ captures the essential behavior. If the singular values are all similar (flat spectrum), the weight matrix is truly high-rank, and LoRA cannot adequately approximate it.

### Attention Pattern Eigenanalysis (HeadKV #46)

For a specific attention head at a specific layer, the attention pattern is:

$$\alpha = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) \in \mathbb{R}^{T \times T}$$

This matrix is row-stochastic (each row sums to 1). Its eigenvalues lie in $[-1, 1]$ with the largest eigenvalue always being $\lambda_1 = 1$ (corresponding to the stationary distribution).

**HeadKV's eigenvalue-based importance metric:**

Define the **spectral concentration ratio**:

$$\text{SCR}(h) = \frac{\lambda_1}{\sum_{i=1}^k \lambda_i}$$

where $k$ is the number of top eigenvalues considered.

- High SCR → one eigenvalue dominates → focused retriever → CRITICAL head
- Low SCR → eigenvalues are spread → broad integrator → potentially redundant head

HeadKV ranks all heads by SCR and applies a compression budget:
1. Heads in the top quartile (highest SCR): full-precision KV cache
2. Heads in the middle quartiles: 8-bit quantized KV cache
3. Heads in the bottom quartile (lowest SCR): 4-bit quantized or evicted

For the CCP: during a 20-turn Roleplay session, HeadKV's eigenvalue-based ranking automatically identifies which heads carry unique, high-impact information (the Thinking Sparks from Lesson 7/12) and protects their cache, while compressing heads that contribute only broad, approximable context.

### Weight Matrix Eigenstructure — Feature Direction Discovery

The matrix $M = W_Q W_K^T \in \mathbb{R}^{d_k \times d_k}$ determines which input feature combinations produce the strongest attention signal. Its eigendecomposition:

$$M = W_Q W_K^T = P_M D_M P_M^{-1}$$

The dominant eigenvector $\mathbf{v}_1$ of $M$ is the **feature direction of maximum sensitivity** — the input pattern that produces the strongest dot product response in this head's QK mechanism.

If $\mathbf{v}_1$ aligns with:
- Emotional valence features → the head is an emotion detector
- Syntactic structure features → the head is a grammar checker
- Positional encoding features → the head is a distance tracker
- Coaching-specific features (post GRPO training) → the head is a Thinking Spark

This connects eigenanalysis to interpretability (Lesson 7): **finding the eigenvectors of $W_Q W_K^T$ IS interpretability.** Each eigenvector is a "natural feature direction" of the attention head — one axis of the head's internal coordinate system.

### Hessian Eigenvalues — Training Stability and Learning Rate Bounds

The Hessian $H \in \mathbb{R}^{n \times n}$ is the matrix of second partial derivatives of the loss function:

$$H_{ij} = \frac{\partial^2 L}{\partial \theta_i \partial \theta_j}$$

$H$ is symmetric, so its eigenvalues are real and its eigenvectors are orthogonal (Spectral Theorem).

**Eigenvalue interpretation:**
- $\lambda_i > 0$: the loss curves UPWARD in direction $\mathbf{v}_i$ — local minimum along this axis
- $\lambda_i < 0$: the loss curves DOWNWARD — local maximum along this axis
- $\lambda_i = 0$: flat — the loss is insensitive to movement along this axis

**At a local minimum:** ALL eigenvalues are positive. The Hessian is positive definite.

**At a saddle point:** SOME eigenvalues are positive and SOME are negative. The point is a minimum in some directions and a maximum in others.

**Maximum safe learning rate:**

$$\eta_{\max} = \frac{2}{\lambda_{\max}(H)}$$

If $\eta > \eta_{\max}$, gradient descent OSCILLATES along the direction of $\lambda_{\max}$ — the updates overshoot the minimum in that direction. This is the formal, eigenvalue-based explanation for the divergence catastrophe from Lesson 11.

**Condition number:**

$$\kappa(H) = \frac{\lambda_{\max}(H)}{\lambda_{\min}(H)}$$

- $\kappa \approx 1$: the loss landscape has similar curvature in all directions. A single learning rate works well for all parameters. SGD is efficient.
- $\kappa \gg 1$: the loss landscape has drastically different curvatures. Some directions need tiny steps (high curvature), others need large steps (low curvature). A single learning rate cannot satisfy both. Adam optimizer addresses this with per-parameter adaptive rates. ALLoRA (Lesson 11) addresses this specifically for LoRA's B and A matrices.

## 4. Structural Behavior

### Eigenvalue Properties as Invariants

| Property | Formula | Meaning |
|----------|---------|---------|
| **Trace** | $\text{tr}(A) = \sum \lambda_i$ | Sum of eigenvalues = sum of diagonal entries |
| **Determinant** | $\det(A) = \prod \lambda_i$ | Product of eigenvalues = overall scaling factor |
| **Spectral radius** | $\rho(A) = \max |\lambda_i|$ | Maximum amplification factor |
| **Rank** | $\text{rank}(A)$ = number of non-zero $\lambda_i$ | Effective dimensionality |
| **Condition number** | $\kappa = \lambda_{\max}/\lambda_{\min}$ | Difficulty of the optimization problem |

These properties are **basis-invariant**: they produce the same values regardless of which coordinate system you compute in. The trace of a matrix in the standard basis equals the trace in the eigenvector basis (which is just $\sum \lambda_i$ since the diagonal entries ARE the eigenvalues).

### Symmetric vs Non-Symmetric in Transformers

| Matrix | Symmetric? | Eigenvalues | Eigenvectors | Use |
|--------|-----------|-------------|--------------|-----|
| $W^TW$ | ✅ Yes | Real, ≥ 0 | Orthogonal | Singular values, LoRA analysis |
| Hessian $H$ | ✅ Yes | Real | Orthogonal | Curvature, learning rate bounds |
| Covariance $\Sigma$ | ✅ Yes | Real, ≥ 0 | Orthogonal | PCA (Lesson 9-10) |
| Attention $\alpha$ | ❌ No | In [-1,1] | Not necessarily orthogonal | Head function type (HeadKV) |
| Weight $W$ | ❌ No | Can be complex | Not necessarily orthogonal | Feature sensitivity |
| $W_QW_K^T$ | ❌ Generally no | Can be complex | Not necessarily orthogonal | Attention feature direction |

For non-symmetric matrices, use SVD rather than eigendecomposition for guaranteed real, positive singular values and orthogonal singular vectors.

### Eigenvalue Decay and Effective Rank

For a matrix with eigenvalues $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_n$, the **effective rank** measures how many eigenvalues are "significant":

$$r_{\text{eff}} = \frac{\left(\sum_i \lambda_i\right)^2}{\sum_i \lambda_i^2}$$

- If one eigenvalue dominates ($\lambda_1 \gg \lambda_2, \dots$): $r_{\text{eff}} \approx 1$
- If all eigenvalues are equal: $r_{\text{eff}} = n$

For LoRA: the effective rank of a weight matrix's update indicates the minimum LoRA rank $r$ needed for faithful approximation. If $r_{\text{eff}} = 4$, then LoRA with $r = 4$ captures essentially all of the update's meaningful content. If $r_{\text{eff}} = 64$, LoRA with $r = 4$ loses significant information.

## 5. Connection to the Linear Algebra System

| Lesson | Connection to Eigenvalues |
|--------|--------------------------|
| **L1 (Vectors)** | Eigenvectors ARE vectors — points in the same space as the inputs |
| **L2 (Dot Product)** | For symmetric matrices, eigenvectors are orthogonal: $\mathbf{v}_i \cdot \mathbf{v}_j = 0$ for $i \neq j$ |
| **L3 (Linear Combinations)** | Any vector can be expressed as a linear combination of eigenvectors. The coefficients determine how each eigenmode contributes. |
| **L4 (Transformations)** | Eigenvectors are the directions where a transformation acts "purely" — no rotation, only scaling |
| **L5 (Matrix Multiplication)** | Diagonalization factors $A = PDP^{-1}$ — three matrix multiplications that decompose complexity |
| **L6 (Projections)** | PCA projects data onto the top eigenvectors of the covariance matrix. LoRA's effectiveness depends on the eigenspectrum of $\Delta W$. |
| **L7 (Change of Basis)** | Eigenvectors ARE the natural basis. Diagonalization IS expressing $A$ in its eigenvector basis. |
| **L9-10 (Clustering)** | PCA = eigendecomposition of the covariance matrix. K-Means on PCA-reduced data operates in the top eigenspace. |
| **L11 (Gradients)** | Hessian eigenvalues determine curvature, learning rate bounds, and gradient stability |
| **L12 (GRPO)** | Loss landscape geometry (sharp vs flat minima) is determined by Hessian eigenspectrum |

## 6. Deep Worked Examples

### Example 1: HeadKV Importance Ranking

**Setup:** A 4-token sequence processed by two attention heads.

**Head A attention matrix:**
$$\alpha_A = \begin{bmatrix} 0.9 & 0.05 & 0.03 & 0.02 \\ 0.85 & 0.08 & 0.04 & 0.03 \\ 0.88 & 0.06 & 0.03 & 0.03 \\ 0.91 & 0.04 & 0.03 & 0.02 \end{bmatrix}$$

Every row overwhelmingly attends to token 1. The dominant eigenvalue will be near 1.0, and the remaining eigenvalues will be near 0.

**Eigenvalues of $\alpha_A$:** $[0.97, 0.02, 0.008, 0.002]$

SCR = $0.97 / (0.97 + 0.02 + 0.008 + 0.002) = 0.97$ — extremely focused.

**Head B attention matrix:**
$$\alpha_B = \begin{bmatrix} 0.30 & 0.25 & 0.20 & 0.25 \\ 0.28 & 0.22 & 0.28 & 0.22 \\ 0.24 & 0.26 & 0.24 & 0.26 \\ 0.26 & 0.24 & 0.26 & 0.24 \end{bmatrix}$$

Attention is spread roughly equally across all tokens.

**Eigenvalues of $\alpha_B$:** $[0.99, 0.04, -0.02, -0.01]$

SCR = $0.99 / (0.99 + 0.04 + 0.02 + 0.01) = 0.93$ — still dominated by $\lambda_1 = 1$ (which is always the case for stochastic matrices), but the GAP between $\lambda_1$ and $\lambda_2$ is much smaller for Head A ($0.97 - 0.02 = 0.95$) than for Head B ($0.99 - 0.04 = 0.95$). A more discriminative metric: the **spectral gap** $\lambda_1 - \lambda_2$.

In practice, HeadKV uses the entropy of the eigenvalue distribution:

$$H_{\text{spectral}} = -\sum_i \frac{|\lambda_i|}{\sum_j |\lambda_j|} \log \frac{|\lambda_i|}{\sum_j |\lambda_j|}$$

Low entropy → concentrated spectrum → focused head → PROTECT.
High entropy → flat spectrum → diffuse head → COMPRESS.

**HeadKV Decision:**
- Head A: spectral entropy = 0.15 → **Protect** (full-precision KV cache)
- Head B: spectral entropy = 0.92 → **Compress** (4-bit quantized KV cache)

### Example 2: Adversarial Vulnerability Analysis (Rogue Scalpel)

**Setup:** A coaching head's Value projection $W_V$ has been analyzed. Its SVD reveals:

$$W_V = U \Sigma V^T$$

Top 3 singular values: $\sigma_1 = 4.2, \sigma_2 = 2.1, \sigma_3 = 0.8$

The dominant right singular vector $\mathbf{v}_1$ (the input direction of maximum sensitivity) has high alignment with the word "trust" in the embedding space: $\mathbf{v}_1 \cdot \text{embed}(\text{"trust"}) = 0.87$.

**Adversarial attack construction:**

An attacker crafts a prompt that includes the token "trust" in a context designed to maximally activate this direction. The perturbation's effect on the attention output:

$$\Delta \mathbf{o} = W_V \cdot \delta = U \Sigma V^T \delta$$

If $\delta$ is aligned with $\mathbf{v}_1$ (the dominant right singular vector), the output perturbation magnitude is:

$$||\Delta \mathbf{o}|| = \sigma_1 ||\delta|| = 4.2 ||\delta||$$

If $\delta$ is aligned with $\mathbf{v}_3$ (a minor singular vector):

$$||\Delta \mathbf{o}|| = \sigma_3 ||\delta|| = 0.8 ||\delta||$$

The attacker gets $4.2 / 0.8 = 5.25\times$ more impact per unit perturbation along the dominant direction. This is why adversarial attacks preferentially target eigenvector-aligned perturbations — maximum behavioral change per unit of detectable input modification.

**Guardian Agent defense:**
1. Pre-compute $\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3$ for each critical head's $W_V$
2. For incoming prompts, compute alignment: $c_k = ||\text{proj}_{\mathbf{v}_k}(\mathbf{x})||$
3. If $c_1 / \text{mean}(c_k) > \tau_{\text{alert}}$, the input has a suspiciously large component along the vulnerability direction
4. Flag for review before allowing the prompt to reach the coaching model

### Example 3: Hessian-Based Learning Rate Selection

**Setup:** During LoRA fine-tuning of Qwen-3.5 for Voice DNA, the top Hessian eigenvalue is monitored:

| Epoch | $\lambda_{\max}(H)$ | $\eta_{\max} = 2/\lambda_{\max}$ | Actual $\eta$ | Status |
|-------|---------------------|----------------------------------|---------------|--------|
| 1 | 50 | 0.04 | 0.001 | ✅ Safe ($\eta \ll \eta_{\max}$) |
| 5 | 200 | 0.01 | 0.001 | ✅ Safe (just barely) |
| 10 | 800 | 0.0025 | 0.001 | ⚠️ Warning ($\eta$ approaching $\eta_{\max}$) |
| 12 | 2500 | 0.0008 | 0.001 | ❌ DANGER ($\eta > \eta_{\max}$!) |

At epoch 12, the curvature has sharpened to the point where the current learning rate exceeds the stability bound. Without intervention, the next gradient step will overshoot the minimum along the sharpest curvature direction.

**Curvature-Aligned Probing action:** Reduce $\eta$ to $0.0005$ (below $\eta_{\max} = 0.0008$). Training stabilizes.

This is eigenvalue analysis as a REAL-TIME MONITORING TOOL — not just theory, but an operational safety check during CCP Voice DNA training.

## 7. Edge Cases

### Complex Eigenvalues

Rotation matrices have complex eigenvalues: $\lambda = e^{\pm i\theta}$. For pure rotation by angle $\theta$:

$$R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$$

Eigenvalues: $\lambda = \cos\theta \pm i\sin\theta = e^{\pm i\theta}$

$|\lambda| = 1$ — the eigenvalue has unit magnitude. There is no stretching. The transformation is pure rotation. No real eigenvectors exist because no real direction is preserved.

In Transformers, complex eigenvalues can appear in non-symmetric weight matrices. However, the products that matter most for analysis ($W^TW$, Hessian, covariance) are symmetric and always have real eigenvalues.

### Repeated Eigenvalues

A matrix can have eigenvalues with algebraic multiplicity > 1 (repeated roots of the characteristic polynomial). Example:

$$A = \begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix}$$

Eigenvalue $\lambda = 3$ with multiplicity 2. This is a scalar multiple of the identity — it scales EVERY direction by 3. Every non-zero vector is an eigenvector. The eigenspace is the entire $\mathbb{R}^2$.

### Defective Matrices (Non-Diagonalizable)

Some matrices don't have enough independent eigenvectors for diagonalization:

$$A = \begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$$

Eigenvalue $\lambda = 3$ with multiplicity 2, but only ONE independent eigenvector $[1, 0]^T$. This matrix is **defective** — it cannot be diagonalized. The Jordan normal form provides an alternative decomposition.

In practice, defective matrices are rare in Transformer analysis because the matrices of interest (especially symmetric ones) are always diagonalizable.

### Numerical Instability for Nearly Equal Eigenvalues

When two eigenvalues are very close ($\lambda_1 \approx \lambda_2$), their eigenvectors become numerically unstable — small perturbations in the matrix produce large rotations of the eigenvectors. The eigenvalues themselves remain stable, but the eigenvector directions become unreliable.

For HeadKV: if two eigenvalues of an attention matrix are nearly identical, the corresponding "directions of attention focus" are poorly defined. The head doesn't have a clear focus direction — it's genuinely ambiguous about where to attend. This head is a natural compression candidate.

## 8. Invariants: The Core Laws

1. **Trace equals sum of eigenvalues:** $\text{tr}(A) = \lambda_1 + \lambda_2 + \cdots + \lambda_n$. This holds for ALL square matrices, regardless of whether they're diagonalizable.

2. **Determinant equals product of eigenvalues:** $\det(A) = \lambda_1 \lambda_2 \cdots \lambda_n$. If any eigenvalue is zero, the determinant is zero — the matrix is singular.

3. **Symmetric matrices have real eigenvalues:** If $A = A^T$, then all $\lambda_i \in \mathbb{R}$. Eigenvectors for distinct eigenvalues are orthogonal.

4. **Spectral radius bounds matrix norm:** $\rho(A) \leq ||A||$ for any matrix norm. The spectral radius is the asymptotic growth rate of $||A^n||^{1/n}$.

5. **Eigenvalues of $A^n$ are $\lambda_i^n$:** Powers of matrices raise eigenvalues to the same power. This is why a single eigenvalue $> 1$ causes exponential growth.

6. **Similar matrices have identical eigenvalues:** If $B = P^{-1}AP$ (change of basis), then $A$ and $B$ have the same eigenvalues. Eigenvalues are a property of the transformation, not the coordinate system.

## 9. Minimal Analogy Support

**The Resonant Frequency Model:**

A guitar string has natural vibration modes — frequencies where the string vibrates in pure, simple patterns (standing waves). The fundamental frequency has the largest amplitude (dominant eigenvalue). Harmonics have progressively smaller amplitudes (smaller eigenvalues).

Pluck the string at a resonant frequency and you get a pure tone — a single eigenvector of the vibration operator. Pluck it at an arbitrary point and you get a COMPLEX vibration that is a mixture of all resonant modes — a sum of eigenvectors weighted by their excitation coefficients.

Analyzing the complex vibration = eigendecomposition. Finding the resonant modes = finding the eigenvectors. Measuring their amplitudes = finding the eigenvalues. This is literally what the Fourier Transform does — and it IS an eigendecomposition of the time-shift operator.

In Transformers: attention patterns are the "vibrations," and eigenanalysis decomposes them into pure modes — each mode representing one focused information flow direction (a single eigenvector of the attention matrix).
