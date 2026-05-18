# Lesson 7: Change of Basis — Exposure / Intuition Layer

## 1. The Same Player, Different Scouting Reports

You are a football scout. You watch the same 23-year-old midfielder play three matches. You write three scouting reports — each using a different measurement system:

**Report 1 (Physical Stats):**
- Speed: 8/10
- Strength: 6/10
- Endurance: 9/10

**Report 2 (Positional Value):**
- Offensive contribution: 7/10
- Defensive contribution: 5/10
- Transitional impact: 8/10

**Report 3 (Intelligence Metrics):**
- Decision-making: 9/10
- Spatial awareness: 8/10
- Anticipation: 7/10

Three reports. Three entirely different sets of numbers. Same player. The player didn't change between reports. The MEASUREMENT SYSTEM changed.

Each measurement system is a **basis** — a set of axes (dimensions) that define HOW you describe something. Speed/Strength/Endurance is one basis. Offense/Defense/Transition is another. Decision-making/Awareness/Anticipation is a third.

The critical insight: **no basis is "correct."** Each captures different aspects of the same underlying reality. The best basis depends on the QUESTION you're trying to answer:
- "Can this player press for 90 minutes?" → Physical basis answers directly
- "Should we play him as a #10 or a #6?" → Positional Value basis answers directly
- "Will he make our team smarter?" → Intelligence basis answers directly

This is change of basis. The same object — the same vector describing this player — exists independently of how you measure it. Switching between measurement systems is switching between bases. And the mathematical operation that converts coordinates from one basis to another is a matrix multiplication.

## 2. What IS a Basis?

In the mathematical sense, a basis is a set of INDEPENDENT DIRECTIONS that span the entire space you're working in.

In 2D, the standard basis is two perpendicular arrows:
- $\mathbf{e}_1 = [1, 0]$ — the "east" direction
- $\mathbf{e}_2 = [0, 1]$ — the "north" direction

Every point in the 2D plane can be described as a combination of these two directions: $\mathbf{v} = a \cdot \mathbf{e}_1 + b \cdot \mathbf{e}_2 = [a, b]$.

But the standard basis is not special. You could choose ANY two independent directions as your basis:
- $\mathbf{b}_1 = [1, 1]$ — the "northeast" direction
- $\mathbf{b}_2 = [1, -1]$ — the "southeast" direction

These two directions ALSO span the entire 2D plane. Every point can be expressed as a combination of $\mathbf{b}_1$ and $\mathbf{b}_2$ — just with different coefficients than in the standard basis.

### Worked Example: Same Point, Two Descriptions

Consider the vector $\mathbf{v} = [4, 2]$ in the standard basis. This means: "go 4 units east, then 2 units north."

Now express the SAME point in the new basis $B = \{\mathbf{b}_1 = [1,1], \mathbf{b}_2 = [1,-1]\}$:

We need coefficients $c_1, c_2$ such that $c_1 \cdot [1,1] + c_2 \cdot [1,-1] = [4, 2]$.

This gives us two equations:
- $c_1 + c_2 = 4$ (x-component)
- $c_1 - c_2 = 2$ (y-component)

Solving: $c_1 = 3$, $c_2 = 1$.

So $\mathbf{v}$ in the standard basis = $[4, 2]$. The same $\mathbf{v}$ in basis $B$ = $[3, 1]$.

**Different numbers. Same point.** The vector hasn't moved. We just switched the coordinate system we use to describe it.

## 3. Why This Matters for AI

At this point you might wonder: why would anyone bother switching between coordinate systems? If the point is the same, who cares which numbers describe it?

The answer: **some bases make problems EASY, and other bases make the same problems HARD.**

### The Transformer's Internal Basis

When you feed the word "bank" into a Transformer, the embedding layer maps it to a vector in $\mathbb{R}^{768}$ (or $\mathbb{R}^{2048}$, depending on the model). This vector has 768 numbers — coordinates in the embedding space.

But what do those 768 numbers MEAN?

In the embedding layer's basis, the dimensions roughly correspond to learned features: word frequency, grammatical role, general semantic associations. Dimension 47 might encode "how formal is this word?" Dimension 312 might encode "is this word associated with money?" But you DON'T KNOW which dimension encodes what, because the model LEARNED its own basis during pre-training.

By the time the token passes through 24 Transformer layers, the representation has been transformed through 24 successive basis changes. At layer 24, the same "bank" token might have a representation where:
- Dimension 47 now encodes "contextual probability of meaning 'financial institution'"
- Dimension 312 now encodes "contextual probability of appearing before 'account' vs 'river'"

**Each Transformer layer operates in its own learned basis.** The weight matrices $W_Q^l$, $W_K^l$, $W_V^l$ at layer $l$ are basis-change operators — they convert the residual stream representation into the query, key, and value representations that layer $l$ is optimized to work with.

This is why embeddings are "uninterpretable." You print 768 numbers: [0.234, -0.891, 0.447, ...]. These ARE coordinates — but in the model's learned basis, not a human-readable basis. To interpret the embedding, you'd need to find the ROTATION that converts from the model's basis to a human-readable basis like [happy, sad, formal, casual, technical, emotional, ...].

**Interpretability research IS basis discovery.** Researchers probe the model to find directions in the embedding space that correspond to human concepts. When they find one — "this direction corresponds to 'toxicity'" — they've identified one axis of a human-interpretable basis. The model's internal basis may not cleanly separate these concepts, which is why interpretability is hard.

## 4. The Change of Basis Matrix

The operation that converts coordinates from one basis to another is a MATRIX MULTIPLICATION.

Given:
- Basis $B = \{\mathbf{b}_1, \mathbf{b}_2\}$ (old basis)
- Standard basis $S = \{\mathbf{e}_1, \mathbf{e}_2\}$ (new basis)
- A vector $\mathbf{v}$ with coordinates $[c_1, c_2]_B$ in basis $B$

The change-of-basis matrix $P$ from $B$ to $S$ has columns that are the old basis vectors expressed in the new basis. Since $\mathbf{b}_1 = [1, 1]$ and $\mathbf{b}_2 = [1, -1]$ are already in standard coordinates:

$$P = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$$

To convert: $[\mathbf{v}]_S = P \cdot [\mathbf{v}]_B = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} 3 \\ 1 \end{bmatrix} = \begin{bmatrix} 4 \\ 2 \end{bmatrix}$

Confirmation: $[3, 1]$ in basis $B$ = $[4, 2]$ in the standard basis. ✓

The change of basis IS a matrix multiplication — the same operation from Lesson 5. Every time you multiply a vector by a matrix, you can think of it as changing the coordinate system. The matrix's COLUMNS define the new axes.

### Going Back

The inverse matrix $P^{-1}$ converts in the other direction:

$$P^{-1} = \frac{1}{2}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$$

$$P^{-1} \begin{bmatrix} 4 \\ 2 \end{bmatrix} = \frac{1}{2}\begin{bmatrix} 6 \\ 2 \end{bmatrix} = \begin{bmatrix} 3 \\ 1 \end{bmatrix}$$

You can always go back. Basis changes are INVERTIBLE — no information is lost. This guarantees that switching coordinate systems is a lossless operation.

## 5. The Residual Stream — The Universal Basis

Now the infrastructure breakthrough. In a Transformer, the residual stream is the running sum of all layer contributions:

$$\mathbf{h}_l = \mathbf{h}_0 + \sum_{k=1}^{l} \text{Attention}_k(\mathbf{h}_{k-1}) + \text{MLP}_k(\mathbf{h}_{k-1})$$

Each attention layer needs its own Key and Value representations:
$$\mathbf{k}_{l,t} = W_K^l \cdot \mathbf{h}_{l-1,t} \quad \quad \mathbf{v}_{l,t} = W_V^l \cdot \mathbf{h}_{l-1,t}$$

These weight matrices $W_K^l$ and $W_V^l$ are FIXED after training. They are constant transformation matrices that convert from the residual stream's basis into layer $l$'s key and value bases.

**KV-Direct's insight (Paper #51, scored 91/100):** If you store $\mathbf{h}_{l-1,t}$ (the residual stream vector — 5KB per token), you can RECOMPUTE $\mathbf{k}_{l,t}$ and $\mathbf{v}_{l,t}$ for ANY layer $l$ on demand — because $W_K^l$ is a fixed, known matrix. Storing K and V separately for all 24 layers requires 136KB per token. Storing just the residual stream requires 5KB.

$$\text{Compression ratio} = \frac{136\text{KB}}{5\text{KB}} = 27\times$$

**And the reconstruction is BIT-IDENTICAL** — zero information loss. Because $W_K^l$ is deterministic, $\mathbf{k}_{l,t} = W_K^l \cdot \mathbf{h}_{l-1,t}$ always produces the exact same result.

Every eviction-based KV cache compression method (which operates within a specific layer's basis, deciding which tokens to keep and which to discard) degrades quality by 5-28%. KV-Direct (which operates in the UNIVERSAL basis — the residual stream) maintains 100% quality. The superiority is not a matter of degree. It is a category difference — lossless basis-level storage vs. lossy within-basis token selection.

For the CCP's Pipecat Roleplay sessions: 20+ turns of full conversational context at 5KB per token instead of 136KB per token. No lossy eviction. No degraded coaching quality at turn 15. The residual stream IS the universal memory format.

## 6. Thinking Sparks — RL Creates New Basis Directions

Thinking Sparks (Paper #52) introduces a concept that bridges change of basis to reinforcement learning (Lessons 11-12):

Before RL training, the pre-trained model's attention space has a certain basis — 32 generic attention heads, each performing general text processing. These heads define 32 "directions" in attention space.

After GRPO training with a reasoning-specific reward:
- 3-5 new functionally specialized heads EMERGE
- These heads represent NEW BASIS DIRECTIONS in the model's attention space
- They didn't exist before training — RL CREATED them by shaping existing capacity into new functional pathways

**Distillation (SFT)** adds basis directions STABLY and CUMULATIVELY — learning from demonstration data, each new capability adds heads that persist.

**GRPO** adds basis directions DYNAMICALLY — heads are iteratively activated, evaluated against reward, and pruned or reinforced. Some heads emerge temporarily during training and disappear by convergence. Others become permanent fixtures.

For the CCP: after GRPO training with Voice DNA rewards, the model's attention space EXPANDS to include dedicated "coaching empathy" heads, "conviction detection" heads, and "humor timing" heads. These are new basis vectors in the mathematical sense — new independent directions that the pre-trained model lacked.

## 7. RLKV — RL Discovers the Minimal Reasoning Basis

RLKV (Paper #53) performs a different operation: instead of creating new basis directions, it discovers which EXISTING directions matter.

A model with 32 attention heads has a 32-dimensional "head space." Each head contributes to the output along its own basis direction. RLKV tests each head's contribution:

1. Evict Head $k$'s KV cache
2. Measure reasoning quality degradation
3. If degradation > threshold → Head $k$ is PART of the reasoning basis
4. If degradation ≈ 0 → Head $k$ is NOT part of the reasoning basis

After testing all 32 heads, RLKV discovers the **minimal reasoning basis**: the smallest set of heads (typically 8-12) whose KV cache must be preserved at full fidelity for reasoning to survive. The remaining 20-24 heads can be compressed to lower precision without measurable quality loss.

This is BASIS SELECTION — identifying which axes of the 32-dimensional head space carry critical information and which carry redundancy. The RL reward function (composite of reasoning accuracy and cache efficiency) trains the gating mechanism to make this selection optimally.

For the CCP: after RLKV identifies the 8-12 reasoning-critical heads:
- These heads get full-precision KV cache (top priority)
- The Thinking Sparks from GRPO training are automatically included (they contribute to coaching reasoning quality)
- The remaining heads get 4-bit quantized cache (lossy but tolerable)
- Result: sub-800ms Pipecat latency with 20+ turns of context

## 8. Misconceptions

**❌ "Changing basis changes the vector."**
✅ NEVER. The vector is a fixed geometric object — a point in space. Changing basis only changes how you DESCRIBE that point. The coordinates change. The vector doesn't move. This is like translating a sentence from English to Japanese — the meaning (the vector) is preserved; only the representation (the words, the coordinates) changes.

**❌ "There's one 'correct' basis."**
✅ Every valid basis describes the same space equally faithfully. The standard basis $\{[1,0], [0,1]\}$ has no mathematical privilege over any other orthogonal basis. The choice of basis is a DESIGN DECISION — pick the basis that makes your computation easiest.

**❌ "Embeddings are in a standard, human-readable basis."**
✅ Embeddings are in the model's LEARNED basis. Each dimension is a learned feature direction that may combine multiple human concepts in ways humans never designed. Dimension 47 might encode a mixture of "formality + technical domain + sentence position" — no single human label describes it.

**❌ "More basis vectors = more information."**
✅ In $n$-dimensional space, you need EXACTLY $n$ independent basis vectors. Adding more creates redundancy (dependent vectors). Using fewer creates incompleteness (you can't reach certain points). The basis must be exactly the right size — no more, no less.

**❌ "The model stores K/V separately because they're different data."**
✅ K and V at every layer are DETERMINISTIC TRANSFORMATIONS of the same residual stream vector. They appear "different" because they're expressed in different layer-specific bases. But they contain NO independent information beyond what the residual stream already holds. Storing them separately is redundant; storing the residual stream is sufficient.

## 9. Compression Truth

> **A basis is a set of measurement axes that define how you describe positions in a space. Changing basis = translating between measurement systems. The object doesn't change; the description does. Transformers learn their own bases at every layer. The residual stream is the universal basis from which all layer-specific representations can be recovered. And interpretability is the search for the rotation matrix that converts the model's learned basis into a human-readable one.**

In the Mechanistic Layer, you will see the formal algebra: change-of-basis matrices, their inverses, and the composition rule. In the Analogy Layer, you will recognize basis changes in football scouting, music frequency analysis, cooking, gaming, psychology, and the CCP's own interpretability challenges. In the Master Layer, you will connect basis changes to KV-Direct's 27× compression, RLKV's minimal reasoning basis discovery, and Thinking Sparks' RL-driven basis expansion.

The model speaks a language you can't read directly. But the mathematics of basis change gives you the translation tools.
