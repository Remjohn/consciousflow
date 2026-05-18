# Lesson 11: Gradients & Sensitivity — Mechanistic / Transformer Layer

## 1. Formal Definition

The derivative of a scalar-valued function $f: \mathbb{R} \to \mathbb{R}$ at a point $x$ is defined as the limit of the difference quotient:

$$f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$$

This limit, when it exists, yields the instantaneous rate of change of $f$ at $x$. Geometrically, it is the slope of the unique tangent line to the curve $y = f(x)$ at the point $(x, f(x))$.

For a multi-variable function $f: \mathbb{R}^n \to \mathbb{R}$, the **partial derivative** with respect to the $i$-th variable is:

$$\frac{\partial f}{\partial x_i} = \lim_{h \to 0} \frac{f(x_1, \dots, x_i + h, \dots, x_n) - f(x_1, \dots, x_i, \dots, x_n)}{h}$$

All variables except $x_i$ are held constant. The partial derivative isolates the sensitivity along exactly one axis — this is the mathematical formalization of "one knob at a time."

The **gradient** is the vector that collects ALL partial derivatives:

$$\nabla f(\mathbf{x}) = \left[\frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \dots, \frac{\partial f}{\partial x_n}\right] \in \mathbb{R}^n$$

The gradient is NOT a scalar. It is a vector in the SAME space as the input $\mathbf{x}$. It points in the direction of steepest ascent of $f$, and its magnitude $||\nabla f||$ quantifies the maximum rate of increase.

The **gradient descent update rule** is:

$$\boldsymbol{\theta}_{\text{new}} = \boldsymbol{\theta}_{\text{old}} - \eta \nabla L(\boldsymbol{\theta})$$

where $\boldsymbol{\theta}$ is the parameter vector, $L$ is the loss function, and $\eta > 0$ is the learning rate. The negative sign ensures movement OPPOSITE to the gradient — downhill, toward lower loss.

## 2. Derivation: The Chain Rule and Backpropagation

### The Chain Rule

For composed functions $f(g(x))$, the derivative is:

$$\frac{d}{dx} f(g(x)) = f'(g(x)) \cdot g'(x)$$

In Leibniz notation: $\frac{df}{dx} = \frac{df}{dg} \cdot \frac{dg}{dx}$

This rule allows derivatives to **compose through layers**. A neural network IS a composed function: input → Layer 1 → Layer 2 → ... → Layer N → output. The chain rule decomposes the full derivative into a product of local derivatives at each layer.

### A Minimal Neural Network Derivation

Consider the simplest possible network: one input $x$, one weight $w$, one output $z = wx$, one target $t$, and squared error loss $L = (z - t)^2$.

**Forward pass:**
1. $z = wx$
2. $L = (z - t)^2$

**Backward pass (computing $\frac{\partial L}{\partial w}$):**

Apply the chain rule:
$$\frac{\partial L}{\partial w} = \frac{\partial L}{\partial z} \cdot \frac{\partial z}{\partial w}$$

Compute each piece:
- $\frac{\partial L}{\partial z} = 2(z - t)$ — how much does the loss change per unit change in output?
- $\frac{\partial z}{\partial w} = x$ — how much does the output change per unit change in weight?

Therefore:
$$\frac{\partial L}{\partial w} = 2(z - t) \cdot x$$

**Interpretation:** The gradient with respect to $w$ scales linearly with the error magnitude $(z - t)$ AND with the input $x$. Large inputs produce large gradients. Large errors produce large gradients. Zero error produces zero gradient — the weight should not change.

### Two-Layer Extension

Now stack two layers: $h = w_1 x$, then $z = w_2 h$, with loss $L = (z - t)^2$.

**Forward pass:**
1. $h = w_1 x$ (Layer 1 output)
2. $z = w_2 h$ (Layer 2 output)
3. $L = (z - t)^2$ (Loss)

**Backward pass for $w_2$:**
$$\frac{\partial L}{\partial w_2} = \frac{\partial L}{\partial z} \cdot \frac{\partial z}{\partial w_2} = 2(z - t) \cdot h$$

**Backward pass for $w_1$ (requires the FULL chain):**
$$\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial z} \cdot \frac{\partial z}{\partial h} \cdot \frac{\partial h}{\partial w_1} = 2(z - t) \cdot w_2 \cdot x$$

Notice: the gradient for $w_1$ passes through $w_2$. The deeper the layer, the more weight matrices the gradient must travel through. This is backpropagation — the chain rule applied systematically from output to input, layer by layer.

### Matrix Formulation (Connecting to Lesson 5)

In a full Transformer layer, the "weights" are matrices and the "inputs" are vectors. The forward pass for a single linear layer is:

$$\mathbf{z} = W\mathbf{x} + \mathbf{b}$$

The gradient of the loss with respect to the weight matrix is:

$$\frac{\partial L}{\partial W} = \frac{\partial L}{\partial \mathbf{z}} \cdot \mathbf{x}^T$$

And the gradient that propagates BACKWARD to the previous layer is:

$$\frac{\partial L}{\partial \mathbf{x}} = W^T \cdot \frac{\partial L}{\partial \mathbf{z}}$$

**This is THE critical equation.** The backward gradient = the TRANSPOSE of the weight matrix multiplied by the gradient from above. Backpropagation IS matrix multiplication (Lesson 5) applied in reverse. The transpose $W^T$ "reverses" the transformation, sending the error signal back through the layer in the direction it came from.

For a Transformer with 64 layers, backpropagation executes 64 sequential transposed matrix multiplications. Each multiplication passes the gradient one layer deeper. And here lies the instability:

- If the weight matrices have singular values consistently greater than 1, the gradient GROWS exponentially through layers — **exploding gradients**. Training diverges.
- If the singular values are consistently less than 1, the gradient SHRINKS exponentially — **vanishing gradients**. Deep layers receive near-zero update signals and fail to learn.

Layer Normalization, residual connections, and careful weight initialization exist specifically to keep the singular values of these gradient-propagating matrices near 1 — maintaining signal strength across the full depth of the network.

## 3. Operational Mechanics: Step-by-Step Gradient Computation

Let us trace gradient computation through a concrete Transformer scenario relevant to CCP production.

**Setup:** We have a simplified attention head with learned weight matrices $W_Q$, $W_K$, $W_V$ ∈ $\mathbb{R}^{4 \times 4}$. Input sequence: 2 tokens, each a 4-dimensional vector. The model produces an output, and the loss $L$ measures deviation from a target coaching response.

**Step 1: Forward Pass Through Attention**

Input vectors: $\mathbf{x}_1 = [0.5, 0.3, -0.2, 0.8]$, $\mathbf{x}_2 = [0.1, 0.7, 0.4, -0.1]$

Compute queries, keys, values:
- $\mathbf{q}_i = W_Q \mathbf{x}_i$ — project into query space
- $\mathbf{k}_i = W_K \mathbf{x}_i$ — project into key space
- $\mathbf{v}_i = W_V \mathbf{x}_i$ — project into value space

Attention score: $\alpha_{ij} = \text{softmax}\left(\frac{\mathbf{q}_i^T \mathbf{k}_j}{\sqrt{d_k}}\right)$

Output: $\mathbf{o}_i = \sum_j \alpha_{ij} \mathbf{v}_j$ — weighted combination of value vectors (Lesson 3)

**Step 2: Loss Computation**

The model's output $\mathbf{o}_i$ is compared to the target coaching response via:
$$L = \frac{1}{2} ||\mathbf{o} - \mathbf{t}||^2$$

**Step 3: Backward Pass — Gradient Flow**

The gradient flows backward through the attention mechanism:

1. **∂L/∂o:** The gradient at the output = $(\mathbf{o} - \mathbf{t})$ — the error vector.

2. **∂L/∂V:** Since $\mathbf{o} = \alpha \mathbf{v}$ (linear in V), the gradient with respect to value vectors is modulated by the attention weights. Tokens that received HIGH attention weights receive LARGE gradient signals — they contributed most to the output, so they're most responsible for the error.

3. **∂L/∂α:** The gradient with respect to attention weights flows through the softmax. Here is where a critical bottleneck emerges. The softmax function has a gradient that SATURATES: when one attention weight approaches 1.0 (the model is attending exclusively to one token), the softmax gradient approaches zero. The model becomes "stuck" — it cannot un-attend. This is the attention saturation problem, and it affects CCV steering: if the model has already locked attention onto one pattern, the gradient for re-steering is nearly zero.

4. **∂L/∂W_Q, ∂L/∂W_K:** These gradients flow through the QK^T dot product. By the chain rule, the gradient for $W_Q$ involves the key vectors, and the gradient for $W_K$ involves the query vectors — the two weight matrices are coupled through the attention mechanism.

5. **∂L/∂W_V:** This gradient is the cleanest — it flows through a simple linear projection, unaffected by the softmax bottleneck. This is why Value projections are often the easiest to fine-tune successfully.

**Step 4: Weight Update**

Each weight matrix receives its accumulated gradient and updates:
$$W_Q \leftarrow W_Q - \eta \frac{\partial L}{\partial W_Q}$$

Identical updates for $W_K$ and $W_V$.

## 4. Structural and Dimensional Behavior

### Gradient Magnitude Asymmetry in LoRA

LoRA (Lesson 6) decomposes a weight update as $\Delta W = BA$, where $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times d}$. The gradients for B and A are:

$$\frac{\partial L}{\partial B} = \frac{\partial L}{\partial \Delta W} \cdot A^T \quad \quad \frac{\partial L}{\partial A} = B^T \cdot \frac{\partial L}{\partial \Delta W}$$

Because $B$ and $A$ have different dimensions and different initialization schemes, the magnitudes $||\nabla_B L||$ and $||\nabla_A L||$ can differ by an order of magnitude. ALLoRA (Paper #3) empirically measured this asymmetry and found:

- The B matrix (output projection) receives gradient magnitudes 5-10× larger than A
- A uniform learning rate causes B to overshoot while A underfits
- Asymmetric learning rates ($\eta_B < \eta_A$) equalize the effective step sizes and prevent catastrophic forgetting of the base model's capabilities

The mathematical principle: **equal learning rates on unequal gradient landscapes produce unequal parameter movements.** Stability requires matching the step size to the local curvature of each parameter's loss surface.

### The Hessian — Second-Order Curvature Information

The gradient tells you the SLOPE. The **Hessian matrix** tells you the CURVATURE — how fast the slope is changing.

$$H_{ij} = \frac{\partial^2 L}{\partial \theta_i \partial \theta_j}$$

The Hessian is a matrix of second partial derivatives. Its eigenvalues reveal the curvature along different directions:

- **Large positive eigenvalue:** Sharp curvature — the loss changes rapidly in this direction. A small step overshoots. This direction needs a small learning rate.
- **Small positive eigenvalue:** Gentle curvature — the loss changes slowly. A larger step is safe.
- **Near-zero eigenvalue:** Flat direction — the loss is almost insensitive to movement here. This parameter direction doesn't matter much.
- **Negative eigenvalue:** You're at a saddle point in this direction — moving this way would DECREASE loss even though the first-order gradient is zero.

The Curvature-Aligned Probing paper (#8, scored 168/200) uses the Hessian eigenspectrum to detect training instabilities BEFORE they cause divergence. If the maximum eigenvalue of the Hessian exceeds a critical threshold, the learning rate is too large for the current landscape curvature. The probe detects this and triggers a learning rate reduction.

For CCP production: during Voice DNA fine-tuning, monitoring the Hessian eigenspectrum can predict whether the LoRA training will diverge before it actually does — enabling preemptive parameter adjustment.

## 5. Connection to the Linear Algebra System

The gradient is the point where every prior lesson converges:

| Lesson | Connection to Gradients |
|--------|------------------------|
| **L1 (Vectors)** | The gradient ∇L IS a vector in ℝⁿ where n = number of parameters |
| **L2 (Dot Product)** | The directional derivative ∇L · d measures loss change along direction d |
| **L3 (Linear Combinations)** | The gradient of a linear combination = linear combination of gradients |
| **L4 (Transformations)** | Backpropagation through a layer IS the transpose of its forward transformation |
| **L5 (Matrix Multiplication)** | ∂L/∂x = Wᵀ · (∂L/∂z) — backward gradient is transposed matrix multiplication |
| **L6 (Projections)** | LoRA constrains gradients to a rank-r subspace projection |
| **L7 (Change of Basis)** | The gradient in one basis relates to the gradient in another via the change-of-basis matrix |
| **L9-L10 (Clustering/Normalization)** | Z-Score normalization of rewards (used in GRPO, Lesson 12) is a gradient preprocessing step |

## 6. Transformer and AI Mapping

### Backpropagation Through the Full Transformer Stack

A Transformer with $N$ layers computes:

$$\mathbf{h}_0 = \text{Embed}(\text{tokens})$$
$$\mathbf{h}_l = \mathbf{h}_{l-1} + \text{Attention}_l(\mathbf{h}_{l-1}) + \text{MLP}_l(\mathbf{h}_{l-1}), \quad l = 1, \dots, N$$
$$\hat{y} = \text{Unembed}(\mathbf{h}_N)$$
$$L = \text{CrossEntropy}(\hat{y}, y_{\text{target}})$$

The residual connection ($\mathbf{h}_l = \mathbf{h}_{l-1} + \text{stuff}$) is critical for gradient flow. Without it, the gradient for layer 1's weights must pass through N-1 matrix multiplications — risking exponential decay. WITH the residual connection, the gradient has a "highway": it can flow directly from the loss to any layer via the residual stream, bypassing intermediate layers. This is why residual connections exist — they solve the vanishing gradient problem for deep networks.

### Attention Gradient Saturation

When the softmax output concentrates (one attention weight approaches 1.0):

$$\frac{\partial \text{softmax}(\mathbf{s})_i}{\partial s_j} = \text{softmax}(\mathbf{s})_i (\delta_{ij} - \text{softmax}(\mathbf{s})_j)$$

If $\text{softmax}_k \approx 1$ and all others $\approx 0$, the Jacobian matrix becomes nearly zero everywhere. The gradient cannot propagate through the attention mechanism effectively. The model is "attention-locked."

This directly impacts CCV steering: if the model has already committed to attending to one token pattern, the gradient signal for re-distributing attention is nearly zero. CCV injection at this phase (the "anchor" phase in Paper #40) produces negligible behavioral change. Injection during the "preplan" phase — when attention weights are diffuse and the softmax Jacobian is non-degenerate — produces maximum effect.

### RISER's Gradient-Trained Router (Paper #34)

RISER's meta-router makes a compositional decision at inference time: "Given this input context, what mixture of cognitive steering primitives should I compose?"

The router is parameterized by weights $\phi$ and trained via GRPO (detailed in Lesson 12). During training:

1. The router observes input context $\mathbf{c}$
2. Produces a mixture vector $\mathbf{m} = f_\phi(\mathbf{c})$ over steering primitives
3. The composite steering vector $\mathbf{v}_{\text{steer}} = \sum_k m_k \mathbf{p}_k$ is injected
4. The output is scored by a reward function
5. The gradient $\nabla_\phi R$ tells the router: "increase the weight of primitives that contributed to high reward; decrease those that didn't"

This is gradient ascent on the reward function — maximizing quality instead of minimizing loss. The gradient's direction tells RISER which primitives to amplify. The gradient's magnitude tells RISER how confident this signal is.

## 7. Deep Worked Examples

### Example 1: LoRA Gradient Asymmetry (ALLoRA Diagnosis)

**Setup:** LoRA rank $r = 4$, base model dimension $d = 768$. $B \in \mathbb{R}^{768 \times 4}$, $A \in \mathbb{R}^{4 \times 768}$. Training on Voice DNA coaching scripts.

**Observation during training:**
- Epoch 1-5: Loss decreases smoothly
- Epoch 6: Loss suddenly spikes by 300%
- Epoch 7: Model outputs become gibberish

**Diagnosis via gradient magnitudes:**
- $||\nabla_B L||_F = 0.003$ (stable, moderate gradient)
- $||\nabla_A L||_F = 0.041$ (13× larger than B)
- With uniform learning rate $\eta = 0.001$:
  - Effective step for B: $0.001 \times 0.003 = 3 \times 10^{-6}$ ✓ (conservative)
  - Effective step for A: $0.001 \times 0.041 = 4.1 \times 10^{-5}$ ✗ (overshooting)

**ALLoRA fix:**
- $\eta_B = 0.001$ (keep as-is)
- $\eta_A = 0.001 / 13 = 0.000077$ (reduce proportionally to gradient ratio)
- Both matrices now receive the same effective step size
- Result: training stabilizes, Voice DNA fidelity improves 12% over uniform baseline

### Example 2: Sensitivity-Based CCV Injection Timing

**Setup:** A 12-layer Transformer processes a coaching prompt. We want to inject a "Socratic Questioning" steering vector. At which token position does injection produce maximum behavioral change?

**Method:** Compute the gradient of the attention distance metric (WAAD) with respect to the residual stream at each position:

$$\text{Sensitivity}_t = \left|\left|\frac{\partial \text{WAAD}}{\partial \mathbf{h}_t}\right|\right|$$

**Results:**

| Token Position | Token | WAAD Sensitivity | Phase |
|---|---|---|---|
| 1-3 | "The client" | 0.2 | Low — processing syntax |
| 4-6 | "feels stuck" | 1.8 | **HIGH — emotional content detection** |
| 7-9 | "because they" | 0.4 | Low — connective tissue |
| 10-13 | "fear judgment" | 2.1 | **HIGHEST — core emotional valence** |
| 14-16 | "from others" | 0.3 | Low — trailing context |

**Decision:** Inject the Socratic Questioning CCV vector at positions 10-13, where the model is maximally sensitive to emotional content. Injection here produces 5× stronger behavioral shift than injection at positions 1-3.

This is the Preplan-Anchor principle: the gradient of the sensitivity metric TELLS you when to intervene.

## 8. Edge Case Analysis

### When the Gradient Vanishes

In very deep networks, the gradient for early layers can become negligibly small:
$$\frac{\partial L}{\partial W_1} = \frac{\partial L}{\partial \mathbf{h}_N} \prod_{l=2}^{N} \frac{\partial \mathbf{h}_l}{\partial \mathbf{h}_{l-1}} \cdot \frac{\partial \mathbf{h}_1}{\partial W_1}$$

If each intermediate Jacobian $\frac{\partial \mathbf{h}_l}{\partial \mathbf{h}_{l-1}}$ has spectral radius $< 1$, the product of N-1 such terms decays exponentially. For N = 64 layers, even a spectral radius of 0.95 produces: $0.95^{63} \approx 0.039$. The gradient reaching layer 1 is 3.9% of the gradient at layer 64.

**CCP Impact:** During LoRA fine-tuning of Qwen-3.5, LoRA adapters applied to early layers receive weaker gradient signals. This is why many LoRA configurations only adapt the later layers — the gradient is stronger there.

### When the Gradient Explodes

Conversely, if spectral radii consistently exceed 1:
$1.05^{63} \approx 21.6$ — the gradient at layer 1 is 21× the gradient at layer 64.

Gradient clipping (forcing $||\nabla L|| \leq c$ for some threshold $c$) prevents parameter updates from becoming catastrophically large. This is a hard constraint on the gradient's magnitude, applied after backpropagation but before the parameter update.

### Zero Gradient at Saddle Points

At a saddle point, $\nabla L = \mathbf{0}$, but the Hessian has both positive and negative eigenvalues. The model appears "stuck" — the gradient provides no useful direction. Stochastic gradient descent (SGD) naturally perturbs the model off saddle points because the gradient is computed on random mini-batches, introducing noise that pushes the model in random directions. Saddle points are unstable equilibria under SGD — like balancing a ball on a knife edge, any perturbation sends it rolling.

## 9. Invariants: The Core Laws

1. **The gradient points uphill.** Always. By mathematical definition, $\nabla f$ points in the direction of maximum increase of $f$. Gradient descent OPPOSES this direction.

2. **The chain rule composes.** For any composition of differentiable functions, the derivative of the composition = the product of individual derivatives. This is not an approximation; it is exact. Backpropagation relies on this exactness.

3. **Zero gradient ≠ optimum.** $\nabla f = \mathbf{0}$ occurs at minima (good), maxima (bad), AND saddle points (treacherous). In high dimensions, saddle points exponentially outnumber true minima.

4. **Linearity of the gradient operator.** $\nabla(\alpha f + \beta g) = \alpha \nabla f + \beta \nabla g$. The gradient distributes over sums and scales with constants. This is why gradients from multiple loss terms can be independently computed and added — crucial for multi-objective training (e.g., RLKV's composite reward: accuracy × cache efficiency).

## 10. Minimal Analogy Support

**The Compass and the Terrain Map:**

Imagine gradient descent as hiking with a compass that only tells you the direction of steepest slope directly beneath your feet. The learning rate is your stride length. Backpropagation is the procedure for re-calibrating the compass — it measures how the terrain at your feet traces back to the geological formations deep underground (the deep layers of the network). The Hessian is a topographic survey of the immediate area — it tells you whether you're in a smooth valley (you can take longer strides) or on a knife-edge ridge (you need extremely cautious steps).

When LoRA constrains you to a subspace (Lesson 6), it's as if someone built a rail track on the mountainside. You can only move along the rail. The gradient projected onto the rail's direction IS the only gradient that matters. The rest — the gradient components perpendicular to the rail — are mechanically ignored.
