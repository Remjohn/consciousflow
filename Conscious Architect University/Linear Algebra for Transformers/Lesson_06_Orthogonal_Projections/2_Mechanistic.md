# Lesson 6: Orthogonal Projections — Mechanistic / Transformer Layer

## 1. Formal Definition

For a vector $\mathbf{A} \in \mathbb{R}^n$ and a non-zero direction vector $\mathbf{B} \in \mathbb{R}^n$, the orthogonal projection of $\mathbf{A}$ onto $\mathbf{B}$ is defined as:
$$\text{proj}_{\mathbf{B}}(\mathbf{A}) = \left( \frac{\mathbf{A} \cdot \mathbf{B}}{||\mathbf{B}||^2} \right) \mathbf{B}$$

This projects a vector onto a one-dimensional line (the direction of $\mathbf{B}$).

**Subspace Projection:**
In deep learning, we rarely project onto a single line. We project onto dense, multi-dimensional geometric spaces (subspaces). 
If $S$ is a $k$-dimensional subspace of $\mathbb{R}^n$ spanned by an orthogonal basis $\{\mathbf{u}_1, \mathbf{u}_2, \dots, \mathbf{u}_k\}$, the projection of $\mathbf{A}$ onto $S$ is the sum of its projections onto each basis vector:
$$\text{proj}_S(\mathbf{A}) = \sum_{i=1}^{k} \left( \frac{\mathbf{A} \cdot \mathbf{u}_i}{||\mathbf{u}_i||^2} \right) \mathbf{u}_i$$

If the basis vectors are *orthonormal* (they are mutually perpendicular and all have length 1, so $||\mathbf{u}_i||^2 = 1$), the denominator vanishes, and the subspace formula simplifies radically:
$$\text{proj}_S(\mathbf{A}) = \sum_{i=1}^{k} (\mathbf{A} \cdot \mathbf{u}_i) \mathbf{u}_i$$

**The Residual:**
The orthogonal residual, denoted $\mathbf{A}^\perp$, is the specific part of $\mathbf{A}$ that is perfectly perpendicular to the target vector or subspace. It is found via subtraction:
$$\mathbf{A}^\perp = \mathbf{A} - \text{proj}_S(\mathbf{A})$$

## 2. Derivation: The Least-Squares Truth

Why is the formula exactly $\left( \frac{\mathbf{A} \cdot \mathbf{B}}{\mathbf{B} \cdot \mathbf{B}} \right) \mathbf{B}$? 
This formula is not an arbitrary geometric convention; it is the mathematical solution to an optimization problem.

Imagine you have a destination vector $\mathbf{A}$, but you are only allowed to travel along the line created by vector $\mathbf{B}$. What is the closest you can possibly get to $\mathbf{A}$?

You are looking for a scalar $\alpha$ such that the vector $\alpha\mathbf{B}$ minimizes the distance to $\mathbf{A}$.
We want to minimize the squared error: $||\mathbf{A} - \alpha\mathbf{B}||^2$

To find the minimum, we must enforce the condition that the error vector (the residual, $\mathbf{A} - \alpha\mathbf{B}$) is perfectly perpendicular to the path $\mathbf{B}$. Mathematically, perpendicular vectors have a dot product of zero (Lesson 2).
$$(\mathbf{A} - \alpha\mathbf{B}) \cdot \mathbf{B} = 0$$
$$\mathbf{A} \cdot \mathbf{B} - \alpha(\mathbf{B} \cdot \mathbf{B}) = 0$$
$$\alpha = \frac{\mathbf{A} \cdot \mathbf{B}}{\mathbf{B} \cdot \mathbf{B}}$$

This is why we say an orthogonal projection finds the **Least-Squares Approximation**. It finds the mathematically optimal shadow that is physically as close to the real vector as the subspace allows.

## 3. Operational Mechanics: Attention as Subspace Projection

Inside the Transformer architecture, the $W_Q, W_K,$ and $W_V$ matrices are not just multiplying numbers; they are learned orthogonal projection operators mapping data from the 768-dimensional residual stream down into 64-dimensional learned subspaces.

1.  **$W_Q$ (Query Matrix):** Projects the current token's raw embedding onto the specific 64-dimensional "Search Subspace" that this head cares about.
2.  **$W_K$ (Key Matrix):** Projects previous embeddings onto the "Identity Subspace".
3.  **$W_V$ (Value Matrix):** Projects previous embeddings onto the "Extraction Subspace".

Notice what happens next. The attention score is derived by a dot product: $\mathbf{Q} \cdot \mathbf{K}^T$. The model is computing the alignment between two vectors *that have already been orthogonally projected*. The head is ignoring 704 dimensions of noise, isolating the exact 64 dimensions of context that align, and scaling the resulting value.

**Activation Steering via Projection Manipulation:**
If you want to alter a model's behavior, you do not need to retrain a 768x768 matrix. You construct a conceptual vector $\mathbf{C}$ (e.g., the direction separating "sarcasm" from "sincerity"). 
During inference, at a specific layer, you intercept the hidden state $\mathbf{h}$. 
1. To *erase* sarcasm: $\mathbf{h}_{\text{new}} = \mathbf{h} - \text{proj}_{\mathbf{C}}(\mathbf{h})$
2. To *force* sarcasm: $\mathbf{h}_{\text{new}} = \mathbf{h} + \gamma\mathbf{C}$ (where $\gamma$ is an amplified coefficient).
This is surgical manipulation of the residual stream.

## 4. Dimensional Behavior: Compressing Truth

When we use a projection matrix $P$, we are mapping from high dimensional space down to a subspace. As discussed in Lesson 5, the matrix $P$ has a Null Space.

When you project a 768-dimensional vector down to a 1D concept line (e.g. evaluating "Toxicity"), you are explicitly forcing 767 dimensions of context into the null space. All grammar, syntax, intent, and identity are annihilated. You are left *only* with the magnitude of toxicity.

If you track a token's hidden state as it moves up through the 24 layers of the model, and project it onto the "Sarcasm" concept vector at each layer, you can literally watch the model "think". At Layer 1, the projection magnitude is 0 (grammar processing). By Layer 12, the magnitude surges to 3.5 (the model recognizes the sarcastic semantic context). By Layer 24, it drops to 1.0 (the model converts semantic understanding into token prediction formats). The projection isolates a concept so you can track its presence across depth.

## 5. Connection to the LA System

- **Lesson 2 (Dot Product):** The engine of projection. The dot product captures the directional similarity; projection turns that scalar similarity back into a geometric vector.
- **Lesson 3 (Spans):** In subspace projection, we are finding the single vector *within the span* of the basis that is closest to our target vector.
- **Lesson 5 (Matrix Ops):** Projection can be written entirely as a matrix operation. If matrix $U$ contains orthonormal columns spanning subspace $S$, the projection matrix is simply $P = UU^T$. So $UU^T \mathbf{A}$ computes the subspace projection in a single hardware step.

## 6. Transformer and AI Mapping (Critical Architecture)

### 1. Paper #27: CASAL (Contrastive Amortized Steering)

Large Language Models hallucinate. Traditional truth-checking requires running separate verification models or expansive retrieval protocols per generated token. Paper #27 solves this through Orthogonal Projection.

**The Concept Metric:**
The researchers first find the "hallucination direction." They pass paired grounded and hallucinated statements through the model, capturing the hidden states $\mathbf{h}_{\text{grounded}}$ and $\mathbf{h}_{\text{hallucinated}}$. They subtract them to find the direction pointing from truth to fiction:
$$\mathbf{d}_{\text{hall}} = \text{mean}(\mathbf{h}_{\text{hallucinated}}) - \text{mean}(\mathbf{h}_{\text{grounded}})$$

**The Projection:**
At generation time, for a given token represented by hidden state $\mathbf{h}_t$, the network computes the hallucination risk by orthogonally projecting the hidden state onto the hallucination direction:
$$\text{Risk Score} = \mathbf{h}_t \cdot \frac{\mathbf{d}_{\text{hall}}}{||\mathbf{d}_{\text{hall}}||^2}$$
*(Notice this is the scalar fraction of the projection formula).*

If the projection shadow is long, the hidden state is veering deeply into hallucination territory, and CASAL dynamically steers the generation back.

**The Amortization Trick:**
Doing this token-by-token is computationally brutal. Instead, CASAL computes a single Projection Matrix based on the pre-filled context window, reducing a continuous search into a single, amortized matrix multiplication $P_{hall} \mathbf{x}$.

### 2. Paper #36: SV-RAG (State Vector Retrieval-Augmented Generation)

In the CCP, logging historical interactions in a massive Neo4j database results in a retrieval problem. If a user says *"I feel like I did last August,"* the system must search vast history logs. Traditional RAG uses the final layer embedding of the prompt for similarity search. But final layer embeddings are "token prediction" vectors, not "semantic context" vectors.

Paper #36 (SV-RAG) fixes this by targeting internal hidden states using dual Low-Rank Projection matrices.

1. **The Retrieval Projection ($P_{\text{ret}}$):** Extracts the "What is this?" component. This LoRA projection maps internal hidden states deep into a dense mathematical similarity subspace optimized *purely* for Neo4j vector search.
2. **The Generation Projection ($P_{\text{gen}}$):** Extracts the "How do I express this?" component. This projection prepares the state for the decoding output.

By keeping these projection spaces strictly mathematically orthogonal, SV-RAG separates "finding internal data" from "writing words," avoiding catastrophic context explosion and improving retrieval recall for long-session client logging.

### 3. Paper #28: KV Cache Steering

This is arguably the most radical interventional technique in modern CCP architecture.

Normally, SLMs act as causal reasoning engines restricted by their size. A 3B parameter model lacks the geometric space to learn complex reasoning paths (like the 14-step CA11 assessment logic). During decoding, its $W_Q$ queries look for relevant context, and its $W_K$ keys respond based on what the SLM learned in pre-training.

Paper #28 asks: What if we don't try to teach the SLM reasoning? What if we *force* the attention mechanism to project onto synthetic reasoning paths?

**The Intervention:**
The researchers pre-compute $\mathbf{K}_{\text{synthetic}}$ and $\mathbf{V}_{\text{synthetic}}$ vectors generated by a massive model (like Opus or GPT-4) executing the complex reasoning task.
During the SLM's forward pass, they intercept the projection process. They inject these massive-model reasoning vectors directly into the SLM's KV Cache.

When the SLM computes its attention projection ($\mathbf{Q}_{\text{SLM}} \cdot \mathbf{K}_{\text{cache}}$), it hits the synthetic reasoning beacons. The geometric projection is so strong that it forces the SLM's attention heads to pull entirely from the injected reasoning paths. The model is forced to project its generation logic onto the advanced rationale injected into the KV cache. This gifts a sovereign, locally hosted 3B model the reasoning geometry of a 1T parameter frontier model.

## 7. Deep Worked Example: Subtracting Toxicity

Let's track a surgical intervention at Layer 8. 

**Setup:**
We have identified the conceptual vector for Toxicity: $\mathbf{T} = (-2, 4, 3)$
The current token's hidden state vector is: $\mathbf{h} = (5, 6, -1)$

**Step 1: Calculate the dot product (alignment)**
$\mathbf{h} \cdot \mathbf{T} = (5 \times -2) + (6 \times 4) + (-1 \times 3) = -10 + 24 - 3 = 11$
There is a positive alignment. Toxicity is present.

**Step 2: Normalize by squared magnitude of T**
$||\mathbf{T}||^2 = (-2)^2 + 4^2 + 3^2 = 4 + 16 + 9 = 29$
The scalar coefficient is: $\frac{11}{29} \approx 0.38$

**Step 3: Calculate the Orthogonal Projection (The Toxic Component)**
$\text{proj}_{\mathbf{T}}(\mathbf{h}) = 0.38 \times (-2, 4, 3) = (-0.76, 1.52, 1.14)$
This vector represents *only the toxic context* contained in the hidden state.

**Step 4: Steering Intervention — The Orthogonal Residual**
We subtract the toxic component from the original hidden state to get the clean residual ($\mathbf{h}^\perp$):
$\mathbf{h}_{\text{clean}} = \mathbf{h} - \text{proj}_{\mathbf{T}}(\mathbf{h})$
$\mathbf{h}_{\text{clean}} = (5, 6, -1) - (-0.76, 1.52, 1.14)$
$\mathbf{h}_{\text{clean}} = (5.76, 4.48, -2.14)$

**Verification:**
If the steering worked, $\mathbf{h}_{\text{clean}}$ should be totally orthogonal (perpendicular) to the Toxicity direction $\mathbf{T}$. Let's dot product them to check:
$\mathbf{h}_{\text{clean}} \cdot \mathbf{T} = (5.76 \times -2) + (4.48 \times 4) + (-2.14 \times 3)$
$= -11.52 + 17.92 - 6.42 = -0.02$ *(Effectively 0 due to rounding)*

The intervention was a perfect success. Toxicity was mathematically annihilated while maximizing the preservation of the original semantic intent (least-squares distance).

## 8. Edge Case Analysis

**Non-Linear Representation Constraints:**
A major edge case in activation steering is that "concepts" in Transformer embedding spaces are not always perfectly linear straight lines. If "Sarcasm" curves intricately through the 768D manifold, a strictly linear orthogonal projection will only capture the first-order approximation (the tangent) of that curve. Steering via pure linear projection is highly effective, but it breaks down on hyper-entangled, deeply contextual semantic nuances that require manifold untangling rather than straight-line projections.

## 9. Invariants: The Core Laws

1.  **Idempotency:** $\text{proj}(\text{proj}(\mathbf{A})) = \text{proj}(\mathbf{A})$. A projection matrix squared is equal to itself ($P^2 = P$). Once you flatten a vector against a wall, flattening the shadow changes nothing.
2.  **Orthogonality of Residual:** $\mathbf{A}^\perp \cdot \mathbf{B} = 0$. The residual component is mathematically guaranteed to share absolutely zero dimensional overlap with the target vector. You cannot leak signal into the orthogonal residual.
3.  **The Pythagorean Theorem holds:** $||\mathbf{A}||^2 = ||\text{proj}_{\mathbf{B}}(\mathbf{A})||^2 + ||\mathbf{A}^\perp||^2$. The "energy" (magnitude squared) of the original vector is perfectly conserved and conserved across the split components.
