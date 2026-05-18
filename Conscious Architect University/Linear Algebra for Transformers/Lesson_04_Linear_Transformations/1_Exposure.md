# Lesson 4: Linear Transformations — Exposure Layer

## 1. Introduction: The System Changes the Player

Forget mathematics for a moment. You are Simone Inzaghi, the manager of Inter Milan. You have a squad of 25 players. Each player possesses a raw statistical profile — a vector of attributes like speed, passing accuracy, tactical intelligence, aggression, and stamina. These raw attribute vectors do not change between matches. Barella's speed stat does not fluctuate when you shift from a 3-5-2 to a 4-3-3.

But watch what happens on the pitch. When Inzaghi deploys a 3-5-2 counter-attacking system, Barella plays as a relentless box-to-box engine — his speed and stamina attributes are amplified, his creative passing is moderately utilized, and his defensive duties are heavily emphasized. When Inzaghi switches to a 4-3-3 possession-dominant system, the exact same Barella transforms — his creative passing is now maximally deployed, his defensive contribution is diminished, and his speed serves a different tactical function entirely.

The raw input (Barella's stat vector) is identical. The output (his on-field behavioral profile) is completely different. What changed? The system. The tactical framework applied a consistent rule to every player's attributes, reshaping their raw capabilities into situational behaviors. The system is a **transformation**.

Now observe a critical property of this transformation. If Barella's speed is doubled (say he has an extraordinary day and performs at 200% physical capacity), the system amplifies his behavioral output proportionally — he covers twice the ground in the counter-attack. If you field Barella and Çalhanoğlu together, the system transforms their combined statistical input into a combined behavioral output that equals what you would get if you transformed each player's stats individually and then added the results. The system does not introduce chaotic, unpredictable interactions between players' raw attributes. It applies the same consistent reshaping rule to every input.

This consistency — where scaling the input scales the output proportionally, and transforming a combination equals combining the transformations — is the mathematical definition of a **linear transformation**. It is a structured, predictable rule that takes any vector from one space and maps it to a vector in another space, preserving the fundamental relationships of addition and scaling.

Inside a Transformer neural network, every single layer applies exactly this type of operation. Your token embedding enters a layer as a 768-dimensional vector. The layer applies a learned linear transformation — rotating, stretching, compressing, and projecting that vector into a new configuration that encodes richer contextual information. The output is a new vector in the same 768-dimensional space, but now carrying meaning that the input alone could not express. The Q, K, and V projection matrices (from Lesson 2) are each individual linear transformations. The feed-forward network inside each layer applies two more. The entire Transformer is a carefully composed stack of these transformations, interleaved with non-linear activations that prevent the stack from collapsing into a single operation.

And here is the insight that separates a casual developer from a Sovereign Architect: these transformations are not passive conduits. They have an immune system. If you inject a steering vector that is geometrically misaligned with the model's learned transformation structure, the downstream layers will actively counter-correct your intervention, rotating the hidden state back toward its pre-trained geometric equilibrium. Understanding transformations is not academic — it is the prerequisite for effective, durable model steering.

## 2. Core Question of the Concept

At its core, the concept of Linear Transformations answers: **"What does it mean to systematically reshape a vector in a way that is consistent, predictable, and fully analyzable — and why does this consistency make neural networks both powerful and steerable?"**

## 3. Progressive Formalization

A **transformation** $T$ is simply a function that takes a vector as input and produces a vector as output: $T: \mathbb{R}^n \rightarrow \mathbb{R}^m$. It maps vectors from one space (possibly of dimension $n$) into another space (possibly of dimension $m$).

A transformation is **linear** if and only if it satisfies two strict axioms for all vectors $\mathbf{v}, \mathbf{w}$ and all scalars $\alpha$:

**Axiom 1 — Additivity (Superposition):**
$$T(\mathbf{v} + \mathbf{w}) = T(\mathbf{v}) + T(\mathbf{w})$$
Transforming a combination equals combining the transformations. If you know how the system handles Barella and how it handles Çalhanoğlu independently, you can predict exactly how it handles them together.

**Axiom 2 — Homogeneity (Scaling):**
$$T(\alpha \mathbf{v}) = \alpha \cdot T(\mathbf{v})$$
Scaling the input scales the output by the same factor. If a player runs twice as fast, the system produces twice the behavioral output along that dimension. No surprise non-linear effects appear.

These two axioms collapse into a single combined requirement:
$$T(\alpha \mathbf{v} + \beta \mathbf{w}) = \alpha \cdot T(\mathbf{v}) + \beta \cdot T(\mathbf{w})$$

This says: a linear transformation commutes with linear combinations. And this is the property that makes it powerful for analysis. If you know what $T$ does to a set of basis vectors, you automatically know what it does to every single vector in the entire space — because every vector is a linear combination of basis vectors (Lesson 3), and linearity lets you compute the transformation by transforming each basis vector independently and combining the results.

**What is NOT linear?**

Consider the transformation $T(\mathbf{v}) = \mathbf{v} + (1, 1)$ — shifting every vector by a constant offset.
Test: $T(\mathbf{v} + \mathbf{w}) = (\mathbf{v} + \mathbf{w}) + (1,1)$. But $T(\mathbf{v}) + T(\mathbf{w}) = \mathbf{v} + (1,1) + \mathbf{w} + (1,1) = \mathbf{v} + \mathbf{w} + (2,2)$.
These are not equal. The constant shift gets doubled when you transform individually and add. Additivity is violated. Shifts are NOT linear.

Consider $T(\mathbf{v}) = v_1^2$ — squaring the first component.
$T(2\mathbf{v}) = (2v_1)^2 = 4v_1^2$, but $2T(\mathbf{v}) = 2v_1^2$. These are not equal. Squaring breaks homogeneity. Polynomial operations are NOT linear.

Rotations, on the other hand, ARE linear. Rotating every vector in the plane by 45 degrees preserves both addition and scaling. You can rotate a sum or sum rotated vectors — the result is identical. This is critically important for AI steering: a rotation changes the direction of a vector without changing its magnitude. It reshapes what the model says without altering how strongly it says it.

## 4. Geometric Interpretation

Linear transformations reshape geometric space in structured, visualizable ways. Understanding the types of reshaping gives deep intuition about what Transformer layers actually do.

**Scaling (Stretching/Compressing):**
$T(\mathbf{v}) = 3\mathbf{v}$ stretches every vector to triple its length. $T(\mathbf{v}) = 0.5\mathbf{v}$ compresses everything to half size. The directions stay identical; only magnitude changes. In a Transformer, this corresponds to amplifying or dampening the activation strength of a representation without changing its semantic identity.

**Rotation:**
$T$ rotates every vector by a fixed angle. Lengths are perfectly preserved. Directions change uniformly. In the Transformer context, a rotation applied to a token embedding changes the semantic content (rotating "formal" toward "informal") while preserving the activation norm — meaning the model's confidence level stays unchanged. This is why Paper #35 (Selective Steering) specifically uses norm-preserving rotations rather than additive injections.

**Projection:**
$T$ drops a vector onto a lower-dimensional subspace — like projecting a 3D object's shadow onto a 2D floor. This is destructive: information about the missing dimension is permanently lost. The Q, K, V projections in attention are exactly this — they compress the 768-dimensional token embedding down to 64 dimensions per head. The transformation deliberately destroys 704 dimensions of information, keeping only the 64 that are relevant for that head's specific cognitive task.

**Shearing:**
$T$ skews the space, dragging one axis while leaving others fixed. This creates oblique, non-perpendicular outputs from perpendicular inputs. Feed-forward layers frequently implement shearing-like transformations, mixing information across feature dimensions.

**The Null Space — What Gets Destroyed:**
Every linear transformation has a **null space**: the set of all input vectors that get mapped to the zero vector. If a vector lies in the null space of $T$, the transformation completely annihilates it — that information is irretrievably gone. In a Transformer head, the null space of $W_Q$ represents all input features that the head's Query simply cannot see. Understanding what a transformation destroys is as important as understanding what it preserves.

## 5. Basic Worked Examples

**Example 1: Scaling is Linear**
$T(\mathbf{v}) = 2\mathbf{v}$.
Test additivity: $T(\mathbf{v} + \mathbf{w}) = 2(\mathbf{v} + \mathbf{w}) = 2\mathbf{v} + 2\mathbf{w} = T(\mathbf{v}) + T(\mathbf{w})$. ✅
Test homogeneity: $T(\alpha\mathbf{v}) = 2(\alpha\mathbf{v}) = \alpha(2\mathbf{v}) = \alpha T(\mathbf{v})$. ✅
Scaling passes both axioms. It is linear.

**Example 2: Translation (Shift) Breaks Linearity**
$T(\mathbf{v}) = \mathbf{v} + (3, 0)$.
Test: $T(\mathbf{0}) = (0,0) + (3,0) = (3,0)$.
But for any linear transformation, $T(\mathbf{0})$ MUST equal $\mathbf{0}$ (because $T(\mathbf{0}) = T(0 \cdot \mathbf{v}) = 0 \cdot T(\mathbf{v}) = \mathbf{0}$).
Since $T(\mathbf{0}) \neq \mathbf{0}$, this transformation is definitively NOT linear. Shifts violate the fundamental property that linear transformations must fix the origin. This is why Transformers use residual connections (addition after transformation) rather than baking constant offsets into the transformation itself — the transformation stays clean and linear; the offset is handled separately.

**Example 3: 90° Rotation is Linear**
$T(x, y) = (-y, x)$ rotates every vector 90° counterclockwise.
Test additivity: $T((x_1+x_2, y_1+y_2)) = (-(y_1+y_2), x_1+x_2) = (-y_1-y_2, x_1+x_2)$
$T(x_1,y_1) + T(x_2,y_2) = (-y_1,x_1) + (-y_2,x_2) = (-y_1-y_2, x_1+x_2)$. ✅ Equal.
Test homogeneity: $T(\alpha x, \alpha y) = (-\alpha y, \alpha x) = \alpha(-y, x) = \alpha T(x,y)$. ✅
Rotation is linear. Critically: $||\mathbf{v}|| = ||T(\mathbf{v})||$. The length does not change. This is a **norm-preserving** transformation — it changes direction without changing magnitude.

**Example 4: A Transformer Layer is a Composite**
A single Transformer layer applies a sequence of operations:
1. $\mathbf{Q} = W_Q \cdot \mathbf{x}$ — linear transformation (projection to query space)
2. $\mathbf{K} = W_K \cdot \mathbf{x}$ — linear transformation (projection to key space)
3. $\mathbf{V} = W_V \cdot \mathbf{x}$ — linear transformation (projection to value space)
4. $\alpha = \text{softmax}(\mathbf{Q} \cdot \mathbf{K}^T / \sqrt{d_k})$ — **NON-linear** (the exponential in softmax)
5. $\text{output} = \sum \alpha_j \mathbf{V}_j$ — linear combination
6. $\mathbf{h} = \text{GELU}(W_1 \cdot \text{output})$ — NON-linear (activation function)
7. $\text{final} = W_2 \cdot \mathbf{h}$ — linear transformation
8. $\text{residual output} = \text{input} + \text{final}$ — linear (addition)

The layer is a cascade of linear and non-linear operations. The non-linear steps (Softmax, GELU) are essential — without them, the entire stack of 24 layers would mathematically collapse into a single linear transformation, because composing linear functions always yields another linear function. Non-linearity gives the network the ability to compute genuinely new, complex functions at each depth level.

## 6. Edge Cases and Extremes

**The Identity Transformation:**
$T(\mathbf{v}) = \mathbf{v}$. The transformation that does absolutely nothing. It satisfies both axioms trivially. In the Transformer, the residual connection effectively provides an "identity bypass" — even if the attention and MLP transformations are destructive or noisy, the original input is preserved via addition: $\text{output} = \mathbf{v} + T(\mathbf{v})$. If $T$ produces garbage, the original signal survives.

**The Zero Transformation:**
$T(\mathbf{v}) = \mathbf{0}$ for all inputs. This maps everything to the origin. It is technically linear (it satisfies both axioms). But it is information-destroying — the null space is the entire input space. Nothing survives. In practice, if an attention head's projection matrices degenerate to near-zero during training, that head becomes a zero transformation — functionally dead, passing no useful information forward. This is what head pruning exploits: identifying and removing zero-like heads that contribute nothing.

**Near-Singular Compression:**
When a transformation compresses a high-dimensional input into a much lower-dimensional output (e.g., 768 → 64 in the Q projection), it necessarily destroys information. The 704 dimensions that are dropped lie in the null space. If the transformation is poorly learned, it might accidentally drop critical semantic dimensions instead of irrelevant ones. When a model exhibits bizarre attention patterns, one diagnostic is to examine whether the Q/K projections are accidentally destroying the very features that should drive attention.

## 7. Light Analogy Support

**The RPG Class System:**
In an RPG, a "class specialization" is a transformation applied to your base character stats. A Ranger transformation takes your raw attributes and produces modified stats: $T_{\text{ranger}}(\text{STR}, \text{DEX}, \text{INT}) = (0.5 \cdot \text{STR}, 2.0 \cdot \text{DEX}, 0.3 \cdot \text{INT})$. The Ranger class amplifies Dexterity, moderately reduces Strength, and heavily suppresses Intelligence. A Mage transformation does the opposite: $T_{\text{mage}} = (0.3 \cdot \text{STR}, 0.5 \cdot \text{DEX}, 2.0 \cdot \text{INT})$. Same base character, different class transformation, completely different output build. If you "dual class" (apply both transformations in sequence), you get a composition: $T_{\text{mage}} \circ T_{\text{ranger}}$ — a combined transformation that is itself linear.

**The Equalizer (EQ) Curve:**
In audio engineering, a parametric EQ is a linear transformation applied to the frequency spectrum. It takes the raw recording's frequency vector — amplitudes across Sub-Bass, Low-Mids, High-Mids, Treble — and reshapes it. Boosting bass by 6dB and cutting treble by 3dB is a linear transformation: scaling specific frequency dimensions by constant factors. The EQ preserves addition (processing two tracks separately and summing equals summing first and processing). Non-linear effects like compression and distortion are NOT EQ — they break the linear axioms.

## 8. Common Misconceptions

**Misconception 1: "Linear means it moves in a straight line."**
*Why it feels right:* The word "linear" contains "line."
*The Reality:* In mathematics, "linear" means "preserves addition and scaling." A rotation is linear even though it changes directions dramatically. A 768→64 projection is linear even though it crushes dimensionality. The word refers to structural consistency, not geometric straightness.

**Misconception 2: "Non-linear operations are errors or flaws in the architecture."**
*Why it feels right:* If linearity means predictability, non-linearity sounds like chaos.
*The Reality:* Non-linearity is the most essential ingredient in deep learning. Without the GELU activation between feed-forward layers, stacking 80 Transformer layers would produce a model mathematically identical to a single layer. Non-linearity is what makes depth meaningful — each layer computes genuinely new features that could not be expressed by any single linear pass. The Transformer is powerful precisely because it alternates linear transformations (learnable, analyzable) with non-linear activations (enabling compositional depth).

**Misconception 3: "If a transformation preserves the vector's length, it does nothing useful."**
*Why it feels right:* We associate "action" with visible change in magnitude.
*The Reality:* A norm-preserving rotation is one of the most powerful operations for behavioral steering. It changes the direction of a vector (what the model encodes) without changing the magnitude (how strongly it encodes it). This means you can shift the model from "aggressive" to "empathetic" without altering the model's confidence level. Paper #35 (Selective Steering) exploits this property explicitly — using rotations rather than additive interventions to preserve activation norms.

## 9. Mini Checkpoint Questions

1. **Is the operation $T(\mathbf{v}) = ||\mathbf{v}|| \cdot (1, 0)$ (mapping every vector to a horizontal vector with the same length) a linear transformation? Test both axioms.**

2. **A Transformer layer applies $W_Q$ to project a 768D embedding into a 64D query space. What happens to the 704 "lost" dimensions? Are they recoverable?**

3. **You inject a steering vector at layer 10. By layer 20, the model's hidden state has returned almost exactly to where it would have been without the injection. What geometric phenomenon explains this, and which CCP paper documents it?**

4. **If you compose two linear transformations — first a 90° rotation, then a 2× scaling — is the result linear? What about the reverse order: first scale, then rotate?**

## 10. Core Insight Compression

A linear transformation is a consistent, predictable rule for reshaping vectors. It preserves the fundamental algebraic structure of addition and scaling, which means: if you understand what it does to a set of basis vectors, you understand what it does to everything. Every Transformer layer IS a learned linear transformation (interleaved with essential non-linear activations). And the definitive architectural insight is this: these transformations are not passive pipes — they are active geometric operators that enforce the model's learned structure.

**A linear transformation reshapes meaning. The Transformer is a stack of them. And if you understand which layers reshape which features, you can steer the model surgically — by rotating, not adding; by targeting discriminative layers, not all layers; by working WITH the transformation geometry, not against it.**
