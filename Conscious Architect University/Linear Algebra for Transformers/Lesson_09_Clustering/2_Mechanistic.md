# Lesson 9: Distance Metrics & Clustering — Mechanistic / Transformer Layer

## 1. Formal Definition

**Distance Metrics**

Given two vectors $\mathbf{a}, \mathbf{b} \in \mathbb{R}^n$, a distance metric $d(\mathbf{a}, \mathbf{b})$ is a function $d: \mathbb{R}^n \times \mathbb{R}^n \rightarrow \mathbb{R}_{\geq 0}$ satisfying four axioms: non-negativity ($d(\mathbf{a}, \mathbf{b}) \geq 0$), identity of indiscernibles ($d(\mathbf{a}, \mathbf{b}) = 0 \iff \mathbf{a} = \mathbf{b}$), symmetry ($d(\mathbf{a}, \mathbf{b}) = d(\mathbf{b}, \mathbf{a})$), and the triangle inequality ($d(\mathbf{a}, \mathbf{c}) \leq d(\mathbf{a}, \mathbf{b}) + d(\mathbf{b}, \mathbf{c})$).

Three distance metrics are formally defined for this lesson:

1. **Euclidean Distance (L2 Norm of Difference):**
   $d_E(\mathbf{a}, \mathbf{b}) = ||\mathbf{a} - \mathbf{b}||_2 = \sqrt{\sum_{i=1}^{n} (a_i - b_i)^2}$

2. **Manhattan Distance (L1 Norm of Difference):**
   $d_M(\mathbf{a}, \mathbf{b}) = ||\mathbf{a} - \mathbf{b}||_1 = \sum_{i=1}^{n} |a_i - b_i|$

3. **Cosine Distance:**
   $d_C(\mathbf{a}, \mathbf{b}) = 1 - \frac{\mathbf{a} \cdot \mathbf{b}}{||\mathbf{a}||_2 \cdot ||\mathbf{b}||_2} = 1 - \frac{\sum_{i=1}^{n} a_i b_i}{\sqrt{\sum_{i=1}^{n} a_i^2} \cdot \sqrt{\sum_{i=1}^{n} b_i^2}}$
   Note: Cosine Similarity (the fraction itself) ranges over $[-1, 1]$. Cosine Distance is $1 - \text{similarity}$, ranging over $[0, 2]$.

**K-Means Clustering**

Given a dataset $\mathcal{X} = \{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N\}$ where each $\mathbf{x}_j \in \mathbb{R}^n$, and a specified integer $k$, K-Means partitions $\mathcal{X}$ into $k$ disjoint clusters $\{C_1, C_2, \dots, C_k\}$ by minimizing the Within-Cluster Sum of Squares (WCSS) objective:

$J = \sum_{j=1}^{k} \sum_{\mathbf{x} \in C_j} ||\mathbf{x} - \boldsymbol{\mu}_j||^2$

where $\boldsymbol{\mu}_j = \frac{1}{|C_j|} \sum_{\mathbf{x} \in C_j} \mathbf{x}$ is the centroid (arithmetic mean) of cluster $C_j$.

**Silhouette Score**

For a single data point $\mathbf{x}_i$ assigned to cluster $C_k$:
- Let $a(\mathbf{x}_i)$ = mean distance from $\mathbf{x}_i$ to all other points in $C_k$ (intra-cluster cohesion).
- Let $b(\mathbf{x}_i)$ = minimum over all clusters $C_m \neq C_k$ of the mean distance from $\mathbf{x}_i$ to all points in $C_m$ (nearest-cluster separation).

$s(\mathbf{x}_i) = \frac{b(\mathbf{x}_i) - a(\mathbf{x}_i)}{\max(a(\mathbf{x}_i), b(\mathbf{x}_i))}$

The Silhouette Score ranges over $[-1, 1]$. A value near $+1$ indicates $\mathbf{x}_i$ is well-clustered. A value near $0$ indicates $\mathbf{x}_i$ sits on a boundary. A value near $-1$ indicates $\mathbf{x}_i$ is misclassified.

## 2. Derivation: Why the Formulas Exist

**Why Euclidean Distance Uses Squared Differences**

The structure of $d_E = \sqrt{\sum(a_i - b_i)^2}$ is not arbitrary. It emerges from the Pythagorean theorem generalized to $n$ dimensions. In $\mathbb{R}^2$, the distance between two points $(a_1, a_2)$ and $(b_1, b_2)$ is the hypotenuse of a right triangle with legs $(a_1 - b_1)$ and $(a_2 - b_2)$. The squaring ensures that negative and positive differences do not cancel each other — a gap of $-4$ is equally "far" as a gap of $+4$. The square root converts the accumulated squared units back to the original measurement scale. Each additional dimension adds one more leg to a hyper-Pythagorean triangle, extending the theorem naturally without structural change.

**Why the Centroid Is the Mean — A First-Principles Derivation**

The K-Means objective $J = \sum_j \sum_{\mathbf{x} \in C_j} ||\mathbf{x} - \boldsymbol{\mu}_j||^2$ seeks the centroid $\boldsymbol{\mu}_j$ that minimizes the total squared distance to all points in $C_j$. To derive the optimal $\boldsymbol{\mu}_j$, we take the partial derivative of $J$ with respect to $\boldsymbol{\mu}_j$ and set it to zero.

Let $f(\boldsymbol{\mu}) = \sum_{\mathbf{x} \in C_j} ||\mathbf{x} - \boldsymbol{\mu}||^2 = \sum_{\mathbf{x} \in C_j} \sum_{i=1}^{n} (x_i - \mu_i)^2$.

Taking the derivative with respect to $\mu_i$ for a single dimension $i$:

$\frac{\partial f}{\partial \mu_i} = \sum_{\mathbf{x} \in C_j} -2(x_i - \mu_i) = 0$

Solving: $\sum_{\mathbf{x} \in C_j} x_i = |C_j| \cdot \mu_i$

Therefore: $\mu_i = \frac{1}{|C_j|} \sum_{\mathbf{x} \in C_j} x_i$

This is the arithmetic mean along dimension $i$. Applying this across all $n$ dimensions yields $\boldsymbol{\mu}_j = \frac{1}{|C_j|} \sum_{\mathbf{x} \in C_j} \mathbf{x}$.

This formula could not have been different. Any other choice — the median, the mode, a weighted point — would yield a strictly higher value of $J$ for a given partition. The mean is the unique point that minimizes the sum of squared Euclidean distances. It is the least-squares optimal anchor, precisely because squaring is a convex function whose minimum is attained at the average.

**Why Cosine Similarity Normalizes the Dot Product**

Cosine Similarity = $\frac{\mathbf{a} \cdot \mathbf{b}}{||\mathbf{a}|| \cdot ||\mathbf{b}||}$. This is the Dot Product (Lesson 2) divided by the product of magnitudes (Lesson 1). The numerator $\mathbf{a} \cdot \mathbf{b} = \sum a_i b_i$ measures the total directional overlap between two vectors. But it is magnitude-dependent: doubling every component of $\mathbf{a}$ doubles the dot product without changing the angle. Dividing by both norms strips the magnitude entirely, isolating the angular component. The result equals $\cos(\theta)$, where $\theta$ is the geometric angle between the two vectors in $n$-dimensional space. This is a direct consequence of the geometric definition of the dot product: $\mathbf{a} \cdot \mathbf{b} = ||\mathbf{a}|| \cdot ||\mathbf{b}|| \cdot \cos(\theta)$.

## 3. Operational Mechanics: Step-by-Step Computation

The K-Means algorithm operates as a two-phase iterative loop. Below is the precise algorithmic decomposition that a GPU cluster executes.

**Input:** Dataset $\mathcal{X} = \{\mathbf{x}_1, \dots, \mathbf{x}_N\}$, each $\mathbf{x}_j \in \mathbb{R}^n$. Integer $k$.

**Step 0: Initialization (K-Means++ Protocol)**
Standard K-Means selects $k$ initial centroids uniformly at random from the data. K-Means++ improves this:
1. Select $\boldsymbol{\mu}_1$ uniformly at random from $\mathcal{X}$.
2. For each subsequent centroid $\boldsymbol{\mu}_m$ ($m = 2, \dots, k$): compute $D(\mathbf{x})$ = distance from each point $\mathbf{x}$ to its nearest existing centroid. Select the next centroid with probability proportional to $D(\mathbf{x})^2$. Points far from all existing centroids are exponentially more likely to be chosen.
3. This guarantees initial centroids are well-spread, avoiding the degenerate case of multiple centroids landing in the same dense region.

**Step 1: Distance Matrix Computation (Assignment Preparation)**
The system constructs an $N \times k$ distance matrix $\mathbf{D}$ where entry $D_{ij} = d(\mathbf{x}_i, \boldsymbol{\mu}_j)$.
- For each of the $N$ data points, compute the distance to each of the $k$ centroids.
- Total operations: $N \times k \times n$ multiplications (for Euclidean: $n$ subtractions, $n$ squarings, 1 summation, 1 square root per pair).
- On a GPU, all $N \times k$ pairs are computed simultaneously in a single parallelized matrix operation.

**Step 2: Cluster Assignment (Argmin)**
For each data point $\mathbf{x}_i$, assign it to the cluster $C_j$ whose centroid $\boldsymbol{\mu}_j$ minimizes $D_{ij}$:
$\text{assignment}(i) = \arg\min_{j \in \{1, \dots, k\}} D_{ij}$
Each point belongs to exactly one cluster (hard assignment). Ties are broken arbitrarily.

**Step 3: Centroid Recomputation (Mean)**
For each cluster $C_j$, recompute the centroid as the component-wise mean of all assigned vectors:
$\boldsymbol{\mu}_j^{(\text{new})} = \frac{1}{|C_j|} \sum_{\mathbf{x} \in C_j} \mathbf{x}$
This is a linear combination with uniform weights $\frac{1}{|C_j|}$ (Lesson 3). The centroid shifts toward the true geometric center of its current membership.

**Step 4: Convergence Check**
Compare $\boldsymbol{\mu}_j^{(\text{new})}$ with $\boldsymbol{\mu}_j^{(\text{old})}$ for all $j$. If no centroid has moved beyond a tolerance $\epsilon$ (or if assignments have not changed), terminate. Otherwise, return to Step 1.

**What is preserved:** Dimensionality. Every centroid remains in $\mathbb{R}^n$. No dimensions are collapsed or created.
**What is combined:** All vectors within a cluster are averaged into a single representative.
**What is canceled:** Individual client identities within a cluster vanish — replaced by the centroid.
**What is multiplied:** The $1/|C_j|$ scalar distributes across all $n$ dimensions uniformly.

## 4. Structural and Dimensional Behavior

**Low Dimensions (2D/3D)**

In $\mathbb{R}^2$, K-Means clusters are visualizable as colored regions on a scatter plot. Voronoi boundaries appear as straight lines between centroids. Clusters are roughly circular under Euclidean distance. The student can manually verify correctness by inspection. Euclidean distances between 2D points are intuitive — they correspond to ruler measurements on paper.

In $\mathbb{R}^3$, Voronoi regions become polyhedral volumes. Clusters can be inspected via 3D scatter plots with rotation, but spatial judgment degrades. Boundary planes between centroids are still flat.

**High-Dimensional Spaces (Critical for AI)**

When clustering operates in $\mathbb{R}^{90}$ (LIWC-22 features from the CBCS pipeline) or $\mathbb{R}^{768}$ (Transformer embeddings), the geometric intuitions from 2D/3D collapse:

*1. Concentration of Measure:* In high dimensions, all pairwise Euclidean distances converge toward a constant. The distance from any given point to its nearest neighbor approaches the distance to its farthest neighbor. Formally, for $n$-dimensional unit-norm random vectors, $\frac{d_{\max} - d_{\min}}{d_{\min}} \rightarrow 0$ as $n \rightarrow \infty$. This means that raw Euclidean distance becomes a weaker discriminative signal. Clustering in 90D requires more data points per cluster to overcome this geometric compression.

*2. Near-Orthogonality:* In $\mathbb{R}^{768}$, random vectors are almost certainly nearly perpendicular. Cosine distance becomes critical because it measures the small angular deviations that carry real semantic information, while Euclidean distance sees everything as roughly equidistant.

*3. Feature Sparsity and Dominance:* When features have vastly different scales (e.g., "Message Count" ranges [0, 500] while "Intimacy Index" ranges [0, 1]), un-normalized Euclidean distance is dominated entirely by the high-magnitude features. The algorithm becomes blind to low-range features. Z-Score normalization ($z_i = (x_i - \mu) / \sigma$) centers each dimension at zero with unit variance, equalizing their contribution to the distance computation. Without normalization, clustering in high dimensions fails silently — producing geometrically valid but semantically meaningless partitions.

*4. The Curse of Dimensionality for Cluster Validity:* As dimensionality grows, the volume of the space grows exponentially. A fixed number of data points becomes exponentially sparse. Sample sizes must grow exponentially with $n$ to maintain cluster density. In practice, dimensionality reduction (PCA projection from Lesson 6) is applied before clustering to compress the feature space to its most informative principal components.

## 5. Connection to the Linear Algebra System

K-Means is not an isolated algorithm. It is a direct operational application of the linear algebra primitives from Lessons 1–6:

- **Vectors (Lesson 1):** Every data point and every centroid is a vector in $\mathbb{R}^n$. The entire algorithm operates exclusively on vectors.
- **Dot Product (Lesson 2):** Cosine Similarity is the normalized dot product. It measures directional alignment between the client vector and each centroid vector. The dot product appears explicitly in the numerator of the Cosine formula.
- **Linear Combinations (Lesson 3):** The centroid $\boldsymbol{\mu}_j = \frac{1}{|C_j|} \sum \mathbf{x}$ is a linear combination of all cluster members with uniform coefficients $\alpha_i = \frac{1}{|C_j|}$. The centroid is literally the algebraic average — the most fundamental linear combination.
- **Spans and Subspaces (Lesson 3):** The set of all possible centroids for a given cluster lies within the convex hull (and specifically, the span) of the data points. The centroid cannot escape the subspace generated by its members.
- **Projections (Lesson 6):** PCA projection, used to reduce dimensionality before clustering, projects high-dimensional data onto an orthogonal basis of principal components. This is the least-squares optimal projection (Lesson 6) applied to the entire dataset simultaneously.
- **Linear Transformations (Lesson 4):** Z-Score normalization is a linear transformation: $z = (x - \mu)/\sigma$ applies a shift (subtract the mean vector) and a scale (divide by the standard deviation vector). Normalization is a linear map that reorganizes the geometry of the feature space.

The student should see: K-Means is the assembly line where all prior linear algebra tools converge to solve a single applied problem.

## 6. Transformer / AI Mapping (Critical Architecture)

### 1. Embeddings and Distance in Feature Space

In a Transformer, every token is mapped to a dense vector $\mathbf{e} \in \mathbb{R}^{768}$ via the embedding layer. These embeddings live in a learned feature space where geometric distance encodes semantic relationship. Clustering over these embeddings groups tokens (or sequences) by semantic similarity. The CRAL Research Engine pre-clusters 10,000 article embeddings into 50 cluster centroids, enabling the retrieval pipeline to search only the nearest cluster instead of the full index — transforming $O(N)$ search into $O(k + N/k)$.

### 2. Attention Mechanism and Distance Metrics

Self-attention computes $\text{Attention}(Q, K, V) = \text{Softmax}(QK^\top / \sqrt{d_k})V$. The $QK^\top$ term computes the raw dot product between the Query vector of one token and the Key vector of every other token. This dot product is an un-normalized similarity score, directly related to Euclidean distance through the identity: $||\mathbf{q} - \mathbf{k}||^2 = ||\mathbf{q}||^2 + ||\mathbf{k}||^2 - 2\mathbf{q} \cdot \mathbf{k}$. Maximizing the dot product is equivalent to minimizing the squared Euclidean distance when norms are held constant. Attention is therefore a continuous, differentiable form of nearest-neighbor assignment — the same fundamental operation as K-Means' cluster assignment step, but with soft (probabilistic) weights instead of hard (binary) assignments.

### 3. Linear Projections and Feature Space Engineering

The $W_Q$, $W_K$, $W_V$ matrices in self-attention are learned linear projections that transform raw embeddings into specialized distance-computation spaces. The model learns to project tokens so that semantically related tokens land close together in the Q-K space. This is directly analogous to the feature engineering step in clustering pipelines: choosing which transformed features to compute distances over determines the semantic meaning of the resulting clusters. Badly chosen features (or badly trained projection matrices) produce geometrically valid but semantically useless groupings.

### 4. Similarity and Relevance in CCP Pipelines

In the CBCS pipeline, clustering replaces real-time LLM reasoning with pre-computed geometric assignments. The flow is:

```
Telegram Voice Note → Whisper STT → LIWC-22 Feature Extraction → 90-D Vector
→ Z-Score Normalization → PCA (90D → 20D) → K-Means Assignment
→ Cluster Label Written to Neo4j → JIT Compiler Reads Label as Constraint
```

The JIT Skill Compiler does not receive raw text. It receives: `CLUSTER_ID = 2, CENTROID = [0.8, -0.4, 0.2, ...], DISTANCE_TO_CENTROID = 0.31`. This deterministic coordinate replaces thousands of tokens of raw context, reducing prompt payload by approximately 2,300 tokens while simultaneously eliminating hallucination risk.

### 5. Finetuning, Activation Steering, and Cluster Drift

When the CCP fine-tunes Qwen-3.5 via LoRA (Paper #1, MCDA Audit), the weight updates shift the embedding space. This means the pre-computed cluster centroids become stale — they were derived from the old embedding geometry. After any fine-tuning operation, the clustering pipeline must be re-executed on the new embedding space. This is Concept Drift at the model level.

The Guardian Agent monitors this via the Silhouette Score. If steered CCV vectors push certain token embeddings away from their original cluster centroids, the average Silhouette drops. The system detects that the mathematical structure of the behavioral archetypes has been disrupted by the model update and flags the operator for re-clustering.

Activation steering (RISER, Paper #34 from the LoRA MCDA) operates in the same geometric space as clustering. A steering vector $\mathbf{v}_{\text{steer}}$ added to the residual stream shifts the token's position in feature space. If this shift crosses a cluster boundary — moving from the "Empathetic" centroid region to the "Confrontational" centroid region — the coaching behavior transitions sharply. Understanding that activation steering is a translation operation in the same space where clusters partition behavior gives the Sovereign Architect precise control over the pipeline's personality.

## 7. Deep Worked Examples

**Example 1: Full CBCS Clustering Pipeline (4D)**

Four CCP clients are described by four LIWC-22 features (normalized via Z-Score):
- **x₁** = [ 1.2, -0.5, 0.8, -0.3]  (High analytic language, low emotional tone, high insight words, low social references)
- **x₂** = [ 1.0, -0.8, 0.9, -0.1]
- **x₃** = [-0.9, 1.5, -0.4, 1.2]  (Low analytic, high emotional, low insight, high social)
- **x₄** = [-0.7, 1.3, -0.6, 0.9]

Initialize K-Means++ with k=2. First centroid: $\boldsymbol{\mu}_1 = \mathbf{x}_1 = [1.2, -0.5, 0.8, -0.3]$. Second centroid (maximally distant): $\boldsymbol{\mu}_2 = \mathbf{x}_3 = [-0.9, 1.5, -0.4, 1.2]$.

**Iteration 1 — Assign:**
$d(\mathbf{x}_1, \boldsymbol{\mu}_1) = 0$. $d(\mathbf{x}_1, \boldsymbol{\mu}_2) = \sqrt{(2.1)^2 + (-2.0)^2 + (1.2)^2 + (-1.5)^2} = \sqrt{4.41 + 4.0 + 1.44 + 2.25} = \sqrt{12.1} \approx 3.48$. Assign x₁ → C₁.

$d(\mathbf{x}_2, \boldsymbol{\mu}_1) = \sqrt{0.04 + 0.09 + 0.01 + 0.04} = \sqrt{0.18} \approx 0.42$. $d(\mathbf{x}_2, \boldsymbol{\mu}_2) \approx 3.22$. Assign x₂ → C₁.

$d(\mathbf{x}_3, \boldsymbol{\mu}_1) \approx 3.48$. $d(\mathbf{x}_3, \boldsymbol{\mu}_2) = 0$. Assign x₃ → C₂.

$d(\mathbf{x}_4, \boldsymbol{\mu}_1) \approx 3.10$. $d(\mathbf{x}_4, \boldsymbol{\mu}_2) = \sqrt{0.04 + 0.04 + 0.04 + 0.09} = \sqrt{0.21} \approx 0.46$. Assign x₄ → C₂.

C₁ = {x₁, x₂}. C₂ = {x₃, x₄}.

**Iteration 1 — Recompute:**
$\boldsymbol{\mu}_1 = \frac{1}{2}([1.2, -0.5, 0.8, -0.3] + [1.0, -0.8, 0.9, -0.1]) = [1.1, -0.65, 0.85, -0.2]$
$\boldsymbol{\mu}_2 = \frac{1}{2}([-0.9, 1.5, -0.4, 1.2] + [-0.7, 1.3, -0.6, 0.9]) = [-0.8, 1.4, -0.5, 1.05]$

**Iteration 2:** Reassignment produces identical clusters. Convergence.

*CCP Interpretation:* Cluster 1 captures "Analytical Processors" — high insight language, low emotional display, low social reference. The JIT Compiler assigns these clients the Socratic intervention protocol. Cluster 2 captures "Emotional Connectors" — high emotional tone, high social reference, low analytical framing. The JIT Compiler assigns the Empathetic Validation protocol. The Guardian Agent stores both centroids in Neo4j for weekly Silhouette monitoring.

**Example 2: Silhouette Score Computation**

Using the same final clusters:
For x₁ in C₁: $a(\mathbf{x}_1) = d(\mathbf{x}_1, \mathbf{x}_2) \approx 0.42$ (mean intra-cluster distance). $b(\mathbf{x}_1) = \frac{1}{2}(d(\mathbf{x}_1, \mathbf{x}_3) + d(\mathbf{x}_1, \mathbf{x}_4)) \approx \frac{1}{2}(3.48 + 3.10) = 3.29$ (mean distance to nearest other cluster).

$s(\mathbf{x}_1) = \frac{3.29 - 0.42}{\max(0.42, 3.29)} = \frac{2.87}{3.29} \approx 0.87$

This is an excellent score — x₁ is tightly bound to its cluster and far from the alternative. An average Silhouette score above 0.70 across all clients indicates strong cluster structure. If this drops below 0.40, the Guardian Agent fires a Concept Drift alert.

## 8. Edge Case Analysis

**When WCSS Becomes Zero**
If $k = N$ (every point is its own cluster), $J = 0$. Each centroid sits exactly on its sole data point. This is mathematically perfect but operationally useless — no generalization, no archetype discovery.

**When WCSS Is Maximal**
If $k = 1$, the single centroid is the global mean, and $J$ equals the total variance of the dataset. This represents the worst possible clustering — everything in one undifferentiated mass.

**Convergence to Local Minima**
K-Means is guaranteed to converge, but not to the global minimum of $J$. With adversarial initialization, two centroids can both land in the same dense region, leaving a separate cluster entirely unrepresented. The resulting partition has high $J$ even though a much better solution exists. K-Means++ mitigates this with probability-weighted spread initialization, and running the algorithm multiple times with different seeds allows selection of the best result.

**Degenerate Clusters (Empty Clusters)**
If during reassignment no point is closest to centroid $\boldsymbol{\mu}_j$, the cluster becomes empty. The mean of zero points is undefined. Implementations typically re-seed the orphaned centroid randomly from the dataset or from the cluster with highest variance.

**Feature Dominance Without Normalization**
If feature 1 ranges over [0, 10000] and feature 2 ranges over [0, 1], Euclidean distance is entirely dominated by feature 1. A difference of 100 on feature 1 contributes 10000 to the squared distance; a maximum difference of 1.0 on feature 2 contributes only 1. The algorithm physically cannot detect variation on feature 2. Z-Score normalization ($z = (x - \mu)/\sigma$) rescales each dimension independently, ensuring equal geometric contribution.

## 9. Invariants / Core Laws

1. **Monotonic Convergence of J:** The WCSS objective $J$ is non-increasing across iterations. Each assignment step assigns every point to its nearest centroid (minimizing $J$ given fixed centroids). Each recomputation step moves centroids to the mean (minimizing $J$ given fixed assignments). Since $J$ has a finite lower bound of zero and decreases monotonically, the algorithm must terminate in a finite number of steps.
   *Why it holds:* Both sub-steps independently minimize the same convex objective from different directions. No step can increase $J$.

2. **Hard Assignment Partition:** Every data point belongs to exactly one cluster at every iteration. $\{C_1, C_2, \dots, C_k\}$ form a disjoint partition of $\mathcal{X}$: $C_i \cap C_j = \emptyset$ for $i \neq j$, and $\bigcup_{j=1}^{k} C_j = \mathcal{X}$.
   *Why it holds:* The argmin over distances assigns each point to a unique nearest centroid (with tie-breaking). No point is unassigned; no point is double-assigned.

3. **Centroid Within Convex Hull:** The centroid $\boldsymbol{\mu}_j$ always lies within the convex hull of its cluster's points. The arithmetic mean of a set of vectors is a convex combination (coefficients sum to 1, all non-negative). Therefore, the centroid can never escape the geometric boundary defined by its members.
   *Why it holds:* The centroid is a linear combination with coefficients $1/|C_j|$, which are all positive and sum to 1. By definition, this is a convex combination.

4. **Symmetry of Euclidean Distance:** $d_E(\mathbf{a}, \mathbf{b}) = d_E(\mathbf{b}, \mathbf{a})$ always. Cluster assignment from A's perspective to centroid B produces the same distance as from B to A. This guarantees that the distance matrix $\mathbf{D}$ is consistent regardless of computation order.
   *Why it holds:* $(a_i - b_i)^2 = (b_i - a_i)^2$ for all $i$.

## 10. Minimal Analogy Support

**The Postal Sorting Facility:**
A postal center receives millions of packages daily. Each package has a destination ZIP code (a multi-component vector encoding region, city, and street). The sorting facility runs K-Means: it defines $k$ distribution hubs (centroids), assigns every package to the nearest hub by geographic distance, then periodically adjusts hub locations to minimize total delivery distance. Without clustering, every package would need individual routing computation. With clustering, the system assigns packages in bulk to regional hubs, and each hub handles last-mile routing independently. The total computational load drops by orders of magnitude — the same principle that allows the CCP to pre-route 500 clients via 4 behavioral archetypes instead of running 500 individual AI inference sessions.
