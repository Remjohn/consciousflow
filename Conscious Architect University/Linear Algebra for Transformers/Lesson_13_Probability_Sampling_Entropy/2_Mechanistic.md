# Lesson 13: Probability, Sampling & Entropy — Mechanistic / Transformer Layer

## 1. Formal Definitions

### Probability Distribution

A **discrete probability distribution** over a finite set $\mathcal{V} = \{v_1, v_2, \dots, v_n\}$ (the vocabulary) is a function $p: \mathcal{V} \to [0,1]$ satisfying:

1. $p(v_i) \geq 0$ for all $i$ (non-negativity)
2. $\sum_{i=1}^n p(v_i) = 1$ (normalization)

### Expectation

The **expected value** of a function $f$ under distribution $p$:

$$\mathbb{E}_{x \sim p}[f(x)] = \sum_{i=1}^n p(v_i) \cdot f(v_i)$$

This is a weighted average of $f$'s values, where the weights are the probabilities. When $f(x) = x$:

$$\mu = \mathbb{E}[X] = \sum_{i=1}^n p(v_i) \cdot v_i$$

This is the **mean** — the distribution's center of mass.

### Variance and Standard Deviation

$$\text{Var}(X) = \mathbb{E}[(X - \mu)^2] = \sum_{i=1}^n p(v_i)(v_i - \mu)^2 = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$$

$$\sigma = \sqrt{\text{Var}(X)}$$

Variance measures how spread out the distribution is. The Z-Score from Lesson 10:

$$z_i = \frac{x_i - \mu}{\sigma}$$

is a normalization that converts any distribution into one with mean 0 and variance 1.

**Direct L12 connection:** GRPO's advantage estimation $\hat{A}_i = (r_i - \mu_r) / \sigma_r$ IS Z-Score normalization of the reward distribution across the group. The variance $\sigma_r^2$ measures the spread of reward scores. If all scores are identical ($\sigma = 0$), the advantage is undefined — no learning signal exists.

### Softmax Function

The **softmax** function converts a vector $\mathbf{z} \in \mathbb{R}^n$ (raw logits) into a valid probability distribution:

$$\text{softmax}(\mathbf{z})_i = \frac{e^{z_i}}{\sum_{j=1}^n e^{z_j}}$$

**Properties:**
1. Output is always a valid distribution ($p_i > 0$, $\sum p_i = 1$)
2. Monotonic: $z_i > z_j \Rightarrow p_i > p_j$
3. Shift-invariant: $\text{softmax}(\mathbf{z} + c) = \text{softmax}(\mathbf{z})$ for any constant $c$
4. Differentiable: $\frac{\partial p_i}{\partial z_j} = p_i(\delta_{ij} - p_j)$ where $\delta_{ij}$ is the Kronecker delta

**Shift invariance** has practical importance: subtracting $\max(\mathbf{z})$ from all logits before computing softmax prevents numerical overflow ($e^{1000}$ overflows float32, but $e^{1000-1000} = e^0 = 1$ is fine). This is called the "log-sum-exp trick" and is standard in every Transformer implementation.

### Derivation: Why Softmax?

The softmax function is the UNIQUE function that satisfies three requirements:
1. Maps $\mathbb{R}^n \to \Delta^{n-1}$ (produces a valid probability simplex)
2. Preserves ordering ($z_i > z_j \Rightarrow p_i > p_j$)
3. Maximizes entropy subject to matching the expected sufficient statistics (maximum entropy principle)

More precisely, softmax arises from the **Boltzmann distribution** in statistical mechanics:

$$p_i = \frac{e^{-E_i / kT}}{Z}$$

where $E_i$ is the energy of state $i$, $k$ is Boltzmann's constant, $T$ is temperature, and $Z = \sum_j e^{-E_j / kT}$ is the partition function. In the Transformer analogy: $-E_i = z_i$ (negative energy = logit), $kT = T$ (temperature parameter), $Z = \sum_j e^{z_j / T}$ (normalizing constant).

The softmax IS the Boltzmann distribution with $kT = 1$.

## 2. Temperature Scaling: Geometric Analysis

### The Temperature-Scaled Softmax

$$p_i(T) = \frac{e^{z_i / T}}{\sum_{j=1}^n e^{z_j / T}}$$

Temperature $T > 0$ divides the logits BEFORE exponentiation. This has a dramatic geometric effect.

### Derivation: Temperature's Effect on Distribution Shape

Consider two logits $z_1$ and $z_2$ with $z_1 > z_2$. The probability ratio:

$$\frac{p_1(T)}{p_2(T)} = \frac{e^{z_1/T}}{e^{z_2/T}} = e^{(z_1 - z_2)/T}$$

This ratio is exponential in $1/T$:

| Temperature $T$ | Logit Gap $(z_1 - z_2) = 2$ | Probability Ratio $p_1/p_2$ |
|---|---|---|
| 2.0 | $e^{2/2} = e^1$ | **2.72:1** (gentle preference) |
| 1.0 | $e^{2/1} = e^2$ | **7.39:1** (moderate preference) |
| 0.5 | $e^{2/0.5} = e^4$ | **54.6:1** (strong preference) |
| 0.1 | $e^{2/0.1} = e^{20}$ | **~485 million:1** (near-deterministic) |

**Key insight:** Temperature doesn't change WHICH token is most likely — $z_1 > z_2$ means $p_1 > p_2$ at ANY temperature. Temperature changes HOW MUCH more likely the top token is. Low temperature amplifies existing preferences exponentially. High temperature equalizes them.

### Limiting Behavior

**$T \to 0^+$:** The probability concentrates entirely on $\arg\max_i z_i$:
$$\lim_{T \to 0^+} p_i(T) = \begin{cases} 1 & \text{if } i = \arg\max_j z_j \\ 0 & \text{otherwise} \end{cases}$$
This is **greedy decoding** — the temperature-zero limit.

**$T \to \infty$:** All logits are scaled toward 0. $e^{z_i/T} \to e^0 = 1$ for all $i$:
$$\lim_{T \to \infty} p_i(T) = \frac{1}{n}$$
This is the **uniform distribution** — maximum randomness.

### Temperature's Effect on Entropy

$$H(p(T)) = -\sum_i p_i(T) \log p_i(T)$$

| Temperature | Distribution Shape | Entropy | Behavior |
|---|---|---|---|
| $T \to 0$ | One-hot spike | $H \to 0$ | Deterministic (greedy) |
| $T = 0.3$ | Sharp peak | $H \approx 0.5$ | Highly confident |
| $T = 0.7$ | Moderate peak | $H \approx 1.2$ | Confident but flexible |
| $T = 1.0$ | Standard softmax | $H \approx 1.8$ | Balanced |
| $T = 2.0$ | Flattened | $H \approx 2.5$ | Exploratory |
| $T \to \infty$ | Uniform | $H \to \log n$ | Pure random |

**For the CCP:** Temperature 0.7-0.8 targets the "confident but flexible" range ($H \approx 1.0-1.5$ for typical coaching token distributions). This produces coaching scripts that are consistent with Voice DNA (the dominant token is usually selected) but occasionally use alternative phrasings (preventing robotic repetition).

## 3. Sampling Algorithms

### Greedy Decoding

$$y_t = \arg\max_i p_i$$

Always select the highest-probability token. Deterministic — same input always produces same output.

**Failure mode:** "Boring" text. Greedy decoding produces the MAXIMUM LIKELIHOOD sequence at each step, but not the maximum likelihood overall sequence. It gets stuck in high-probability loops.

### Ancestral (Pure) Sampling

$$y_t \sim \text{Categorical}(p_1, p_2, \dots, p_n)$$

Draw a random number $u \sim \text{Uniform}(0, 1)$ and walk through the cumulative distribution until $\sum_{i=1}^k p_i \geq u$. Select token $k$.

**Failure mode:** Long-tail noise. Low-probability tokens occasionally get selected, producing incoherent text.

### Top-k Sampling

1. Sort tokens by probability: $p_{(1)} \geq p_{(2)} \geq \dots \geq p_{(n)}$
2. Keep only the top $k$ tokens: $S = \{v_{(1)}, \dots, v_{(k)}\}$
3. Zero out all other probabilities
4. Renormalize: $p'_i = p_i / \sum_{j \in S} p_j$ for $i \in S$
5. Sample from the truncated distribution

**Limitation:** $k$ is fixed. When the distribution is sharply peaked (one dominant token, $k = 50$ includes many irrelevant tokens), $k = 50$ is too large. When the distribution is flat (many viable tokens), $k = 50$ may be too small. A fixed $k$ doesn't adapt to the distribution's shape.

### Top-p (Nucleus) Sampling

1. Sort tokens by probability: $p_{(1)} \geq p_{(2)} \geq \dots \geq p_{(n)}$
2. Find the smallest set $S_p$ such that $\sum_{i \in S_p} p_{(i)} \geq p$
3. Zero out all tokens outside $S_p$
4. Renormalize
5. Sample from the truncated distribution

**Advantage over top-k:** The nucleus SIZE adapts to the distribution. When the model is confident (one token at 90%), the nucleus contains 1-2 tokens. When the model is uncertain (10 tokens at 5-15% each), the nucleus contains ~10 tokens. The set automatically expands and contracts based on model confidence.

### Combined Pipeline (Production Standard)

$$\text{sample}(\text{top-p}(\text{softmax}(z / T), p))$$

1. Temperature-scale the logits
2. Apply softmax
3. Apply top-p filtering
4. Sample from the filtered distribution

This is the pipeline used in every production LLM deployment, including the CCP's Pipecat sessions.

## 4. Entropy: The Information-Theoretic Foundation

### Definition and Derivation

**Shannon entropy** measures the expected "surprise" of a draw from distribution $p$:

$$H(p) = -\sum_{i=1}^n p_i \log p_i = \mathbb{E}_{x \sim p}[-\log p(x)]$$

The surprise of event $i$ is $-\log p_i$:
- If $p_i = 1$: surprise = $-\log 1 = 0$ (no surprise — you knew it would happen)
- If $p_i = 0.01$: surprise = $-\log 0.01 = 4.6$ nats (very surprising)
- If $p_i = 0.001$: surprise = $-\log 0.001 = 6.9$ nats (extremely surprising)

Entropy = the AVERAGE surprise. A distribution where all events are equally likely has maximum average surprise. A distribution concentrated on one event has zero average surprise.

### Entropy Bounds

For a distribution over $n$ outcomes:
$$0 \leq H(p) \leq \log n$$

- Minimum ($H = 0$): achieved by any one-hot distribution $p = [1, 0, \dots, 0]$
- Maximum ($H = \log n$): achieved by the uniform distribution $p = [1/n, \dots, 1/n]$

For a vocabulary of 151,936 tokens: $H_{\max} = \log(151936) \approx 11.9$ nats. In practice, natural language distributions rarely exceed $H \approx 3-4$ nats because most tokens are extremely unlikely in any given context.

### Cross-Entropy and Its Connection to Training Loss

The **cross-entropy** between the true distribution $p$ and the model's distribution $q$:

$$H(p, q) = -\sum_i p_i \log q_i$$

When $p$ is a one-hot distribution (the training label — the "correct" next token), cross-entropy reduces to:

$$H(p, q) = -\log q(y^*)$$

where $y^*$ is the correct token. This is the **negative log-likelihood** — the standard pre-training and SFT loss function from Lesson 12.

**The connection:** Pre-training minimizes cross-entropy between the data distribution and the model's distribution. Minimizing cross-entropy simultaneously minimizes KL divergence (since $H(p,q) = H(p) + \text{KL}(p||q)$ and $H(p)$ is constant with respect to $q$). The model is literally trained to make its distribution MATCH the data distribution — which means learning to assign high probability to the tokens that actually appear in the training text.

### Conditional Entropy and Mutual Information

**Conditional entropy:** $H(Y|X) = \mathbb{E}_X[H(Y|X=x)]$ — the average uncertainty about $Y$ after observing $X$.

**Mutual information:** $I(X; Y) = H(Y) - H(Y|X) = H(X) - H(X|Y)$ — how much knowing $X$ reduces uncertainty about $Y$.

In attention: the mutual information $I(\text{query}_t; \text{key}_s)$ measures how much knowing the query at position $t$ reduces uncertainty about which key position $s$ to attend to. High mutual information = strong, informative attention. Low mutual information = random, uninformative attention.

## 5. KL Divergence: The Complete Treatment

### Definition

$$\text{KL}(p || q) = \sum_{i=1}^n p_i \log \frac{p_i}{q_i} = \mathbb{E}_{x \sim p}\left[\log \frac{p(x)}{q(x)}\right]$$

### Properties

1. **Non-negativity (Gibbs' inequality):** $\text{KL}(p||q) \geq 0$ with equality iff $p = q$

   *Proof sketch:* By Jensen's inequality applied to the convex function $-\log$:
   $$\text{KL}(p||q) = -\sum p_i \log \frac{q_i}{p_i} \geq -\log \sum p_i \frac{q_i}{p_i} = -\log \sum q_i = -\log 1 = 0$$

2. **Asymmetry:** $\text{KL}(p||q) \neq \text{KL}(q||p)$ in general

3. **Not a metric:** Violates symmetry and triangle inequality. KL divergence is a DIVERGENCE, not a distance.

4. **Decomposition:** $H(p, q) = H(p) + \text{KL}(p||q)$. Cross-entropy = entropy + KL divergence.

### Forward KL vs Reverse KL

| Direction | Formula | Behavior | Use Case |
|---|---|---|---|
| **Forward KL** $\text{KL}(p_\text{ref} \| p_\theta)$ | Penalizes $p_\theta$ for having low probability where $p_\text{ref}$ has high probability | **Mode-covering:** $p_\theta$ must cover ALL modes of $p_\text{ref}$ | Variational inference, ensuring diversity |
| **Reverse KL** $\text{KL}(p_\theta \| p_\text{ref})$ | Penalizes $p_\theta$ for having high probability where $p_\text{ref}$ has low probability | **Mode-seeking:** $p_\theta$ can collapse onto a SUBSET of $p_\text{ref}$'s modes | GRPO/RLHF, focusing on quality |

**L12 connection:** GRPO uses REVERSE KL: $\text{KL}(\pi_\theta || \pi_\text{ref})$. This is mode-seeking — the trained policy collapses toward the BEST modes of the reference distribution. This explains why GRPO-trained models produce more focused, deterministic outputs: the reverse KL penalty allows the model to ABANDON low-quality modes of the reference distribution, concentrating probability on the high-quality modes that score well on the reward function.

**CCP implication:** Reverse KL makes Voice DNA training produce CONSISTENTLY coach-like output (mode-seeking), not DIVERSELY variable output (mode-covering). This is precisely what CCP production requires — reliable, high-fidelity coaching scripts, not a broad exploration of possible coaching styles.

### KL and the Importance Ratio

The importance ratio from Lesson 12:

$$w_{i,t} = \frac{\pi_\theta(y_{i,t})}{\pi_{\theta_\text{old}}(y_{i,t})}$$

The log importance ratio:

$$\log w_{i,t} = \log \pi_\theta(y_{i,t}) - \log \pi_{\theta_\text{old}}(y_{i,t})$$

The KL divergence is the EXPECTATION of the log importance ratio:

$$\text{KL}(\pi_\theta || \pi_{\theta_\text{old}}) = \mathbb{E}_{y \sim \pi_\theta}[\log w]$$

If $w = 1$ everywhere: KL = 0 (no policy change). If $w$ varies widely: KL is large (significant policy drift). The importance ratio at each token is a LOCAL measure of change; KL divergence is the GLOBAL summary.

## 6. Transformer and AI Mapping

### Softmax in Attention (Full Computation)

For a query vector $\mathbf{q}_t \in \mathbb{R}^{d_k}$ and key matrix $K \in \mathbb{R}^{T \times d_k}$:

$$\text{scores} = \frac{\mathbf{q}_t^T K^T}{\sqrt{d_k}} \in \mathbb{R}^T$$

$$\alpha_t = \text{softmax}(\text{scores}) \in \mathbb{R}^T$$

The attention weight $\alpha_{t,s}$ is the probability that position $t$ attends to position $s$. The $\sqrt{d_k}$ scaling prevents the dot products from growing too large (which would push softmax into its saturated regime where the distribution becomes nearly one-hot regardless of actual similarity).

### Softmax Saturation and the Attention Entropy Diagnostic

When logits are very large (high-magnitude dot products), softmax saturates:

$$z_i \gg z_j \Rightarrow \text{softmax}(z)_i \to 1$$

In the saturated regime:
- The gradient $\partial p_i / \partial z_j = p_i(\delta_{ij} - p_j)$ vanishes (both factors approach 0 for $i \neq j$)
- The model CAN'T learn from this attention pattern — the gradient is too small
- The attention is "frozen" on one token

The $\sqrt{d_k}$ scaling in attention and the temperature parameter in output sampling both serve to prevent saturation — keeping the softmax in its "linear regime" where gradients flow and the model remains trainable.

**Entropy diagnostic for saturation:**
- $H(\alpha_t) \approx 0$: Saturated. One token dominates. Gradient flow is blocked.
- $H(\alpha_t) \approx \log T$: Uniform. All tokens contribute equally. No useful information selection.
- $H(\alpha_t) \in [0.5, 2.0]$: Healthy range. Selective but not locked. Gradients flow. Information is routed effectively.

### The Pre-training Loss IS Cross-Entropy

The standard pre-training objective:

$$L_\text{PT} = -\frac{1}{T}\sum_{t=1}^T \log \pi_\theta(y_t^* | y_{<t}^*)$$

is the cross-entropy between the one-hot data distribution and the model's predicted distribution, averaged over all positions. Minimizing this loss = making the model's distribution match the data distribution = reducing the KL divergence between model and data.

**Perplexity** — the standard model evaluation metric:

$$\text{PPL} = e^{L_\text{PT}} = e^{-\frac{1}{T}\sum_t \log \pi_\theta(y_t^*)}$$

Perplexity IS the exponential of the cross-entropy loss. A perplexity of 10 means "the model is as confused as if it had to choose uniformly among 10 equally likely tokens." Lower perplexity = better language model = lower entropy = more confident predictions.

## 7. Deep Worked Examples

### Example 1: Temperature Effect on a Real Token Distribution

**Logits** for next token after "Here's what I need you to":

$$\mathbf{z} = [\text{hear}: 3.2, \; \text{understand}: 2.1, \; \text{know}: 1.6, \; \text{consider}: 1.0, \; \text{realize}: 0.5, \; \text{banana}: -8.0]$$

**At $T = 1.0$ (standard softmax):**
$$Z = e^{3.2} + e^{2.1} + e^{1.6} + e^{1.0} + e^{0.5} + e^{-8.0} = 24.53 + 8.17 + 4.95 + 2.72 + 1.65 + 0.0003 = 42.02$$

| Token | $p$ | Cumulative |
|---|---|---|
| hear | 0.584 | 0.584 |
| understand | 0.194 | 0.778 |
| know | 0.118 | 0.896 |
| consider | 0.065 | 0.961 |
| realize | 0.039 | 1.000 |
| banana | 0.000007 | 1.000 |

$H \approx 1.25$ nats. Top-p=0.95 keeps: hear, understand, know, consider (cumulative 0.961 > 0.95 at "consider"). "Realize" and "banana" are filtered.

**At $T = 0.5$ (sharper):**

$$z/T = [6.4, 4.2, 3.2, 2.0, 1.0, -16.0]$$

| Token | $p$ | Cumulative |
|---|---|---|
| hear | 0.821 | 0.821 |
| understand | 0.093 | 0.914 |
| know | 0.034 | 0.948 |
| consider | 0.010 | 0.958 |
| realize | 0.004 | 0.962 |
| banana | ≈ 0 | 0.962 |

$H \approx 0.62$ nats. "Hear" now has 82% probability. Top-p=0.95 keeps: hear, understand, know (cumulative 0.948 ≈ 0.95). The nucleus has shrunk from 4 tokens to 3.

**At $T = 2.0$ (flatter):**

$$z/T = [1.6, 1.05, 0.8, 0.5, 0.25, -4.0]$$

| Token | $p$ |
|---|---|
| hear | 0.318 |
| understand | 0.184 |
| know | 0.143 |
| consider | 0.106 |
| realize | 0.082 |
| banana | 0.012 |

$H \approx 1.63$ nats. "Hear" has only 32% — no longer dominant. Top-p=0.95 includes ALL tokens except banana. Even "realize" is a viable candidate.

### Example 2: Entropy-Based CCV Injection Timing

**Scenario:** Pipecat Roleplay session. Model generating a coaching response.

| Position | Token Generated | Output Distribution Entropy $H$ | CCV Injection? |
|---|---|---|---|
| 1 | "Let" | 0.3 (very confident) | ❌ No — low entropy, model is committed |
| 2 | "'s" | 0.1 (deterministic) | ❌ No |
| 3 | "reframe" | 1.8 (uncertain!) | ✅ **YES** — high entropy, model is in preplan phase |
| 4 | "this" | 0.2 | ❌ No |
| 5 | ":" | 0.1 | ❌ No |
| 6 | ??? | 2.3 (highly uncertain!) | ✅ **YES** — the model doesn't know what comes after the colon |

At Position 6, the model is maximally uncertain about what coaching content to deliver. CCV steering injected HERE shifts the distribution toward the desired coaching approach (empathetic reframe vs. provocative challenge vs. Socratic question). The entropy diagnostic tells the Pipecat engine WHEN to intervene.

**Compute cost of entropy monitoring:** One softmax (already computed for token selection) + one log-multiply-sum ≈ 0.01ms additional compute per token. Negligible relative to the 20-50ms forward pass.

## 8. Edge Cases

### Temperature = 0 (Greedy)

Technically $T = 0$ makes $z/T \to \pm\infty$, which is numerically undefined. In practice, greedy decoding is implemented as $y_t = \arg\max_i z_i$ without computing softmax at all. No distribution is constructed — the sampling step is bypassed entirely.

### Tied Logits

If $z_i = z_j$, then $p_i = p_j$ at any temperature. At $T \to 0$, the argmax is ambiguous. Implementations typically break ties arbitrarily (first token in vocabulary order). This rarely occurs in practice because floating-point arithmetic almost never produces exactly equal values.

### KL with Zero Probabilities

$\text{KL}(p||q)$ is undefined when $q_i = 0$ for any $i$ where $p_i > 0$ (division by zero in $\log(p_i/q_i)$). In practice, a small epsilon ($10^{-8}$) is added to $q$ to avoid this: $\text{KL}(p|| q + \epsilon)$.

### Entropy of a One-Token Vocabulary

If the vocabulary has exactly 1 token, $p = [1]$, $H = 0$. The model always outputs the same token. This is trivially degenerate but illustrates the lower bound.

## 9. Invariants: The Core Laws

1. **Softmax normalization:** $\sum_i \text{softmax}(z)_i = 1$ always. Every softmax output is a valid distribution.

2. **Temperature ordering preservation:** $\text{softmax}(z/T)$ has the same argmax as $\text{softmax}(z)$ for any $T > 0$. Temperature NEVER changes which token is most likely.

3. **Entropy bounds:** $0 \leq H(p) \leq \log |\mathcal{V}|$. Entropy is bounded between 0 (deterministic) and $\log$ of vocabulary size (uniform).

4. **KL non-negativity:** $\text{KL}(p||q) \geq 0$ with equality iff $p = q$.

5. **Cross-entropy decomposition:** $H(p, q) = H(p) + \text{KL}(p||q)$. The training loss (cross-entropy) equals the data's inherent uncertainty (entropy) plus the model's deviation from the data (KL divergence).

6. **Temperature-entropy monotonicity:** $H(p(T))$ is monotonically increasing in $T$. Higher temperature = higher entropy = more uncertainty. Always.

## 10. Minimal Analogy Support

**The Dial:**

Temperature is a single dial on the CCP control panel. Turn it all the way left ($T \to 0$): the agent becomes a parrot — always saying the single most probable phrase, endlessly repeating the same formulaic coaching response. Turn it all the way right ($T \to \infty$): the agent becomes a random word generator — grammatically incoherent, semantically chaotic. The sweet spot (0.7-0.8) is where the coaching agent sounds HUMAN — mostly saying the right thing, occasionally surprising with an unexpected but valid phrasing, never descending into nonsense.

Top-p is the safety net underneath the dial. Even at $T = 0.8$, there's a non-zero chance of "banana" slipping through. Top-p at 0.95 says: "No matter where the dial is set, only the top 95% of probability mass is allowed." The 5% tail — all the random noise — is physically removed from the possibility space.
