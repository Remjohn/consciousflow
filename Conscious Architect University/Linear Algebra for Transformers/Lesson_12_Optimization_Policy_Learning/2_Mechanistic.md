# Lesson 12: Optimization & Policy Learning — Mechanistic / Transformer Layer

## 1. Formal Definition

### The Policy

A **policy** $\pi_\theta(y|x)$ is a probability distribution over output sequences $y$ given input $x$, parameterized by the model's weights $\theta$. In a Transformer, the policy decomposes autoregressively:

$$\pi_\theta(y|x) = \prod_{t=1}^{T} \pi_\theta(y_t | x, y_{<t})$$

Each factor $\pi_\theta(y_t | x, y_{<t})$ is the softmax output at position $t$ — the model's probability of generating token $y_t$ given the prompt $x$ and all previously generated tokens $y_{<t}$. The policy IS the model. "Training the policy" IS "training the model." The terms are interchangeable.

### The Objective Function

The GRPO objective maximizes expected clipped advantage over groups of sampled outputs:

$$J_{\text{GRPO}}(\theta) = \mathbb{E}_{x \sim D} \left[ \frac{1}{G} \sum_{i=1}^{G} \frac{1}{T_i} \sum_{t=1}^{T_i} \min\left(w_{i,t}(\theta) \hat{A}_i, \; \text{clip}(w_{i,t}(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_i\right) \right] - \beta \; \text{KL}(\pi_\theta || \pi_{\text{ref}})$$

where:

- $G$ = group size (number of sampled responses per prompt)
- $T_i$ = length of response $i$
- $w_{i,t}(\theta) = \frac{\pi_\theta(y_{i,t} | x, y_{i,<t})}{\pi_{\theta_{\text{old}}}(y_{i,t} | x, y_{i,<t})}$ — the importance ratio at token $t$
- $\hat{A}_i = \frac{r(x, y_i) - \mu_r}{\sigma_r}$ — Z-Score normalized advantage for response $i$
- $\epsilon$ — clipping parameter (typically 0.1–0.2)
- $\beta$ — KL penalty coefficient
- $\text{KL}(\pi_\theta || \pi_{\text{ref}})$ — KL divergence from the reference policy (prevents catastrophic divergence from the base model)

### The Update Rule

$$\theta \leftarrow \theta + \eta \nabla_\theta J_{\text{GRPO}}(\theta)$$

Gradient **ascent** (plus sign) — maximizing reward, not minimizing loss.

## 2. Derivation: From PPO to GRPO

### The PPO Baseline Problem

Proximal Policy Optimization (PPO) — the algorithm that trained ChatGPT — uses a VALUE NETWORK $V_\phi(x)$ to estimate the baseline (expected reward from state $x$). The advantage is:

$$A_{\text{PPO}} = r(x, y) - V_\phi(x)$$

This requires simultaneously training TWO neural networks: the policy $\pi_\theta$ and the value function $V_\phi$. Training two networks creates:
- **Double the memory cost** — both networks must be stored in GPU memory
- **Instability** — the value function's accuracy directly affects gradient quality. An inaccurate value function provides noisy baselines, producing noisy advantages, leading to noisy gradient updates.
- **Hyperparameter sensitivity** — the value function has its own learning rate, architecture, and training schedule that must be tuned independently.

### GRPO's Innovation: Group-Relative Baselines (DeepSeekMath, Section 4.1)

GRPO eliminates the value network entirely. Instead of estimating the expected reward from a learned value function, GRPO computes the baseline FROM THE GROUP ITSELF:

$$\text{baseline} = \mu_r = \frac{1}{G}\sum_{j=1}^{G} r(x, y_j)$$

For $G$ sampled responses, the mean reward IS the baseline. The advantage becomes:

$$\hat{A}_i = \frac{r(x, y_i) - \mu_r}{\sigma_r}$$

**Why this works mathematically:** The mean of the group is an unbiased estimator of the expected reward $\mathbb{E}[r(x, y)]$ — exactly what the value network was trying to approximate. As $G$ increases, the sample mean becomes a more precise estimator. With $G = 16$, the standard error of the mean is $\sigma / \sqrt{16} = \sigma / 4$ — the baseline estimate has 4× less noise than a single sample, without requiring a separate network.

**The variance normalization** ($\div \sigma_r$) serves two purposes:
1. **Scale invariance:** Whether rewards range [0, 1] or [0, 10,000], the advantages have unit variance. The gradient magnitude is independent of the reward scale.
2. **Numerical stability:** Without normalization, large reward variances produce large gradient magnitudes that can cause training divergence.

This is Z-Score normalization from Lesson 10 — the same operation that standardizes data for clustering. In GRPO, it standardizes rewards for policy optimization.

### The Clipping Derivation

Without clipping, the PPO/GRPO objective would be:

$$J(\theta) = \mathbb{E}[w(\theta) \hat{A}]$$

If $\hat{A} > 0$ (good response) and $w(\theta)$ is unrestricted, the optimizer will drive $w$ toward infinity — the model will assign near-certainty to this specific response, destroying diversity and overwriting all other capabilities. This is the "mode collapse" failure mode.

The clipping mechanism constrains the effective ratio:

$$J_{\text{clip}}(\theta) = \mathbb{E}\left[\min\left(w \hat{A}, \;\text{clip}(w, 1-\epsilon, 1+\epsilon) \hat{A}\right)\right]$$

The $\min$ operator is critical. For positive advantages ($\hat{A} > 0$):
- The unclipped term $w \hat{A}$ grows without bound as $w$ increases
- The clipped term $\text{clip}(w, 1-\epsilon, 1+\epsilon) \hat{A}$ caps at $(1+\epsilon) \hat{A}$
- The $\min$ selects the clipped term whenever $w > 1+\epsilon$
- **Effect:** The gradient contribution is ZERO once $w$ exceeds $1+\epsilon$. The model has already shifted enough toward this response.

For negative advantages ($\hat{A} < 0$):
- The unclipped term $w \hat{A}$ becomes more negative as $w$ increases (more penalizing)
- The clipped term caps the penalty at $(1+\epsilon) \hat{A}$
- The $\min$ selects the more negative (unclipped) term when $w > 1+\epsilon$
- **Effect:** There is no cap on how much the model can DECREASE the probability of bad responses. Clipping is asymmetric — it limits improvement speed but not degradation speed.

This asymmetry encodes a safety principle: "Be cautious about amplifying good behavior (might be a lucky sample). Be aggressive about suppressing bad behavior (bad is reliably bad)."

### The KL Divergence Penalty

GRPO adds a penalty for diverging too far from the reference policy $\pi_{\text{ref}}$ (the model before RL training):

$$\text{KL}(\pi_\theta || \pi_{\text{ref}}) = \mathbb{E}_{y \sim \pi_\theta}\left[\log \frac{\pi_\theta(y|x)}{\pi_{\text{ref}}(y|x)}\right]$$

This is the **reverse KL divergence** — a critical distinction identified by Paper #2 (What is the Alignment Objective of GRPO?, scored 195/200).

Forward KL $\text{KL}(\pi_{\text{ref}} || \pi_\theta)$ is **mode-covering**: it forces $\pi_\theta$ to assign non-zero probability wherever $\pi_{\text{ref}}$ has probability. The result is a broad, diverse output distribution.

Reverse KL $\text{KL}(\pi_\theta || \pi_{\text{ref}})$ is **mode-seeking**: it allows $\pi_\theta$ to collapse toward a subset of the reference distribution. The result is a focused, high-quality but less diverse output.

GRPO uses reverse KL (mode-seeking), which explains why RL-trained models produce more focused, deterministic outputs than SFT-only models. This is intentional for the CCP: Voice DNA fine-tuning should produce consistently coach-like outputs, not a broad distribution that occasionally sounds like the coach.

### The GRPO-DPO Equivalence (Paper #3, scored 192/200)

The "It Takes Two" paper proves that with $G = 2$:

$$J_{\text{GRPO},G=2}(\theta) \approx J_{\text{DPO}}(\theta)$$

**Derivation sketch:** When $G = 2$, the Z-Score normalization reduces to:
- $\hat{A}_1 = \frac{r_1 - (r_1+r_2)/2}{\text{std}} = \frac{r_1 - r_2}{2 \cdot \text{std}}$ — proportional to the reward difference
- $\hat{A}_2 = \frac{r_2 - (r_1+r_2)/2}{\text{std}} = \frac{r_2 - r_1}{2 \cdot \text{std}}$ — the negative of $\hat{A}_1$

One response gets a positive advantage, the other gets a negative advantage. The magnitude is proportional to the reward DIFFERENCE — which is exactly what DPO optimizes. The GRPO update makes the better response more likely and the worse response less likely — which IS pairwise preference learning.

**Production implication (compute reduction):** 2-GRPO retains 98.1% of 16-GRPO's performance while requiring only 12.5% of the rollout compute. For CCP Voice DNA training: generate 2 coaching scripts per prompt instead of 16, with < 2% quality degradation. This reduces training compute by 87.5%.

## 3. Operational Mechanics: Step-by-Step GRPO Execution

Let us trace one complete GRPO training step for CCP Voice DNA fine-tuning.

### Setup

- Model: Qwen-3.5 with LoRA adapters (rank 8) on attention layers
- Prompt: "The client has expressed frustration about feeling stuck in their career despite consistent effort."
- Group size: $G = 4$
- Clipping: $\epsilon = 0.2$
- KL coefficient: $\beta = 0.04$

### Step 1: Sample $G$ Responses

The model generates 4 coaching scripts using temperature sampling ($T = 0.8$):

**Response 1:** "Let's sit with that frustration for a moment. Feeling stuck despite effort isn't a sign of failure—it's a sign that you've outgrown your current strategy. The effort was never wasted. It built the foundation. Now we need to redirect it. What would happen if you applied the same effort in a completely different direction?"

**Response 2:** "That sounds really tough. Career frustrations are common and you're not alone. Many people feel this way. Have you considered talking to a career coach or updating your resume? Sometimes small changes can make a big difference."

**Response 3:** "Here's what I need you to hear: effort without precision is noise. You've been working hard—I believe you. But hard work in the wrong direction is just expensive distraction. We're going to audit your effort. Every hour you spent last week—where did it go? Not where you THINK it went. Where it ACTUALLY went. Then we rebuild."

**Response 4:** "I understand the frustration. It's important to remember that career growth is rarely linear. Sometimes periods of apparent stagnation are actually periods of consolidation. Be patient with yourself."

### Step 2: Score Each Response

The CCP reward function evaluates:

| Response | Conviction Density (0-10) | Mood-State Resonance (0-10) | Voice DNA Fidelity (0-10) | Total $r$ |
|---|---|---|---|---|
| R1 | 7 | 8 | 7 | **7.33** |
| R2 | 2 | 5 | 1 | **2.67** |
| R3 | 9 | 7 | 9 | **8.33** |
| R4 | 3 | 6 | 2 | **3.67** |

### Step 3: Compute Advantages (Z-Score — L10)

$$\mu_r = \frac{7.33 + 2.67 + 8.33 + 3.67}{4} = 5.50$$

$$\sigma_r = \sqrt{\frac{(7.33-5.50)^2 + (2.67-5.50)^2 + (8.33-5.50)^2 + (3.67-5.50)^2}{4}} = 2.42$$

Advantages:
- $\hat{A}_1 = (7.33 - 5.50) / 2.42 = +0.76$ (above average)
- $\hat{A}_2 = (2.67 - 5.50) / 2.42 = -1.17$ (significantly below average)
- $\hat{A}_3 = (8.33 - 5.50) / 2.42 = +1.17$ (significantly above average)
- $\hat{A}_4 = (3.67 - 5.50) / 2.42 = -0.76$ (below average)

Response 3 is the strongest performer. Response 2 is the weakest.

### Step 4: Compute Importance Ratios (L1.5)

For each token in each response, compute $w_{i,t} = \pi_\theta / \pi_{\theta_\text{old}}$. At the start of training (first step), $\theta = \theta_\text{old}$, so all ratios are exactly 1.0. After one gradient step, the ratios deviate.

Example after one update — Response 3, word "audit" (a high-conviction word that the gradient amplifies):
- $\pi_{\theta_\text{old}}(\text{"audit"} | \text{context}) = 0.03$ (3% probability before update)
- $\pi_\theta(\text{"audit"} | \text{context}) = 0.045$ (4.5% probability after update)
- $w = 0.045 / 0.03 = 1.50$ — the model has already shifted 50% toward generating "audit"

### Step 5: Clip (L4)

$\text{clip}(1.50, 0.8, 1.2) = 1.2$

The raw ratio of 1.50 exceeds the upper bound $(1 + \epsilon = 1.2)$. Clipping caps it at 1.2. The model has already shifted enough toward "audit" — further amplification is blocked for this step.

The clipped objective contribution for this token:
$$\min(1.50 \times 1.17, \; 1.2 \times 1.17) = \min(1.755, \; 1.404) = 1.404$$

The clipped value (1.404) is used rather than the unclipped value (1.755), reducing the gradient magnitude by 20%.

### Step 6: Gradient Ascent (L11)

The total objective value is computed across all tokens in all responses. The gradient $\nabla_\theta J_{\text{GRPO}}$ is computed via backpropagation. The parameter update:

$$\theta \leftarrow \theta + \eta \nabla_\theta J_{\text{GRPO}}(\theta)$$

**Net effect of this single step:**
- Tokens from Response 3 (Â = +1.17) become MORE likely — the model learns to generate assertive, audit-oriented coaching language
- Tokens from Response 2 (Â = -1.17) become LESS likely — the model unlearns generic, actionless platitudes
- Response 1 (Â = +0.76) receives moderate amplification
- Response 4 (Â = -0.76) receives moderate suppression

After thousands of such steps, the model converges to a policy that reliably generates Response 3-quality scripts — high conviction, high Voice DNA fidelity, contextually resonant.

## 4. Structural and Dimensional Behavior

### The Reward-Policy Coupling

The reward function $r$ and the policy $\pi_\theta$ are coupled through the gradient:

$$\frac{\partial J}{\partial \theta} \propto \hat{A} \cdot \nabla_\theta \log \pi_\theta(y|x)$$

The $\nabla_\theta \log \pi_\theta(y|x)$ term is called the **score function** — it tells the gradient in which direction to shift the parameters to increase the log-probability of response $y$. The advantage $\hat{A}$ modulates this: positive advantage means "shift toward this response," negative means "shift away."

When $\hat{A} = 0$ (average response), the gradient contribution is zero — the model doesn't change from an average-quality output. Only ABOVE-AVERAGE and BELOW-AVERAGE outputs produce learning signal.

### Multi-Objective Reward Composition

The CCP's composite reward function:

$$r = w_1 \cdot \text{CD} + w_2 \cdot \text{MSR} + w_3 \cdot \text{VDF}$$

produces a gradient:

$$\nabla_\theta r = w_1 \nabla_\theta \text{CD} + w_2 \nabla_\theta \text{MSR} + w_3 \nabla_\theta \text{VDF}$$

Each component contributes its own gradient direction. The weights $w_1, w_2, w_3$ determine the relative importance. If $w_3 = 0.5$ (Voice DNA Fidelity is most important), the gradient is dominated by $\nabla_\theta \text{VDF}$ — the model prioritizes sounding like the coach over conviction or resonance.

Crucially, these gradient components may be PARTIALLY OPPOSING. Increasing Conviction Density (more declarative, assertive language) might decrease Mood-State Resonance (if the client needs gentle empathy, not provocation). The parameter vector navigates a multi-dimensional tradeoff surface, and the weights define the architect's preferred balance point.

### Group Size and Variance

The group size $G$ controls the precision-compute tradeoff:

| Group Size $G$ | Baseline Precision | Compute Cost | Suitable For |
|---|---|---|---|
| 2 | Low (single comparison) | Minimal (2 forward passes) | DPO-equivalent; subjective qualities |
| 4 | Moderate | 4× inference | Standard LoRA training |
| 8 | Good | 8× inference | Production-grade Voice DNA |
| 16 | High | 16× inference | Maximum exploration; initial training |
| 64+ | Diminishing returns | Prohibitive | Research only |

The "It Takes Two" paper (#3) empirically showed $G = 2$ retains 98.1% of $G = 16$ performance on math benchmarks, suggesting diminishing returns beyond small group sizes. For CCP Voice DNA Training: start with $G = 8$ for the initial GRPO phase, then reduce to $G = 2$ once the policy stabilizes.

## 5. Connection to the Linear Algebra System

The complete curriculum composition in $J_{\text{GRPO}}$:

| Component | Equation | Prior Lesson |
|-----------|----------|-------------|
| **Output generation** | $y_i \sim \pi_\theta(\cdot|x)$ | Autoregressive decoding |
| **Reward scoring** | $r(x, y_i) \in \mathbb{R}$ | Scalar-valued evaluation |
| **Z-Score advantage** | $\hat{A}_i = \frac{r_i - \mu}{\sigma}$ | **L10:** Normalization / Clustering |
| **Importance ratio** | $w = \pi_\theta / \pi_{\theta_\text{old}}$ | **L1.5:** Trigonometric ratios |
| **Clipping** | $\text{clip}(w, 1-\epsilon, 1+\epsilon)$ | **L4:** Bounded transformations |
| **Policy gradient** | $\nabla_\theta \log \pi_\theta$ | **L11:** Gradient computation |
| **Matrix backpropagation** | $\partial L / \partial W = W^T (\partial L / \partial z)$ | **L5:** Matrix multiplication |
| **LoRA subspace constraint** | $\Delta W = BA$ | **L6:** Projection into low-rank subspace |
| **Steering vector composition** | $v_\text{steer} = \sum m_k p_k$ | **L3:** Linear combinations |
| **KL divergence** | $\text{KL}(\pi_\theta || \pi_\text{ref})$ | **L2:** Alignment measure between distributions |

Every equation in GRPO traces back to a prior lesson. The curriculum was designed as a dependency graph culminating here.

## 6. Transformer and AI Mapping

### The Full Training Lifecycle

**Phase 1: Pre-training (Gradient Descent on Cross-Entropy)**

$$L_{\text{PT}} = -\sum_{t=1}^{T} \log \pi_\theta(y_t | y_{<t})$$

The model learns to predict the next token. Gradient descent minimizes prediction error. The model acquires language competence — grammar, factual knowledge, reasoning patterns — from terabytes of text. This phase requires thousands of GPU-hours and produces a "raw" model that is competent but undirected.

**Phase 2: Supervised Fine-Tuning (Gradient Descent on Demonstration Data)**

$$L_{\text{SFT}} = -\sum_{t=1}^{T} \log \pi_\theta(y_t^* | x, y_{<t}^*)$$

where $y^*$ is a human-written demonstration. The model learns to follow instructions and produce helpful outputs. SFT narrows the behavioral distribution from "all possible text" to "helpful, instructive text." But SFT produces the AVERAGE of the demonstration distribution — including mediocre examples.

**Phase 3: Reinforcement Learning (Gradient Ascent on Reward)**

$$\theta \leftarrow \theta + \eta \nabla_\theta J_{\text{GRPO}}(\theta)$$

GRPO shifts the distribution from "average demonstration quality" to "above-average quality" by amplifying well-rewarded behaviors and suppressing poorly-rewarded ones. This is the phase that produces the distinctive "feel" of modern models — the coherence, the reasoning depth, the refusal to produce harmful content.

For the CCP, these three phases compose into a production pipeline:
1. **Pre-trained Qwen-3.5** — general linguistic competence
2. **SFT on coaching scripts** — learns the FORM of coaching dialogue
3. **GRPO with CCV reward** — learns the QUALITY of coaching dialogue, developing Voice DNA-specific Thinking Sparks (Paper #52)

### Thinking Sparks: RL-Driven Architectural Emergence (Paper #52)

During GRPO training, the reward gradient doesn't just adjust weight magnitudes — it reorganizes the attention mechanism:

**Pre-RL state:** All 32 attention heads perform generic text processing. Head activation patterns are diffuse and task-generic.

**During GRPO training:**
1. The reward signal for Conviction Density flows backward through the attention heads
2. Heads that happen to activate on high-conviction language receive positive gradient signals
3. These heads strengthen their attention patterns for conviction-related features
4. Over thousands of steps, 3-5 heads specialize into "conviction detectors" — Thinking Sparks
5. Simultaneously, heads that activate on low-conviction filler language receive negative gradients
6. These heads either de-specialize or shift to other tasks

**Post-RL state:** 3-5 functionally specialized heads exist that DIDN'T exist before training:
- "Conviction Head" — activates maximally on declarative, authoritative assertions
- "Empathy Head" — activates on emotional mirroring and validation constructions
- "Humor Head" — activates on incongruity patterns and punchline structures

The key distinction from SFT:
- **SFT** adds heads cumulatively and stably — learning from demonstrations
- **GRPO** adds heads dynamically — heads are activated, evaluated against reward, and pruned or reinforced iteratively. This "search" process is more compute-intensive but discovers novel architectural features that no demonstration data contained.

### RLKV: Multi-Objective Reward Engineering (Paper #53)

RLKV's composite reward function demonstrates multi-objective optimization:

$$r_{\text{RLKV}} = \alpha \cdot \text{reasoning\_accuracy}(h) + (1 - \alpha) \cdot (1 - \text{cache\_cost}(h))$$

where $h$ indexes attention head gating decisions.

The gradient $\nabla_h r_{\text{RLKV}}$ has two components:
1. $\alpha \nabla_h \text{accuracy}$ — "which heads, when preserved, maintain reasoning quality?"
2. $(1-\alpha) \nabla_h (1 - \text{cache\_cost})$ — "which heads, when compressed, save the most memory?"

The parameter $\alpha$ controls the tradeoff. At $\alpha = 1.0$: protect all reasoning heads at any cache cost. At $\alpha = 0.0$: minimize cache at any reasoning cost. The optimal $\alpha$ depends on the deployment constraint — for Pipecat Roleplay sessions requiring sub-800ms latency with 20+ turns of context, $\alpha \approx 0.7$ provides the best balance.

The gradient navigates this tradeoff automatically: it finds the set of heads where compressing them saves maximum cache while sacrificing minimum reasoning quality. This is the Pareto frontier of the reasoning-compression tradeoff.

### DPO: The Implicit Reward Function

DPO's objective:

$$L_{\text{DPO}}(\theta) = -\mathbb{E}_{(x, y_w, y_l)}\left[\log \sigma\left(\beta \left[\log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right]\right)\right]$$

The inner expression $\log \frac{\pi_\theta(y|x)}{\pi_\text{ref}(y|x)}$ is the **implicit reward**:

$$r_{\text{implicit}}(x, y) = \beta \log \frac{\pi_\theta(y|x)}{\pi_{\text{ref}}(y|x)}$$

This is Paper #7's (Bootstrapping Language Models with DPO Implicit Rewards, scored 170/200) key insight: a DPO-trained model contains an implicit reward function that can be EXTRACTED and used for further training. The model IS a reward model — its log-probability ratio relative to the reference encodes which outputs it considers "good."

For CCP production: after DPO training on humor preferences, the implicit reward $r_{\text{implicit}}$ can be extracted and used as a scoring function for subsequent GRPO rounds. No separate reward model needs to be trained for humor — the DPO-trained model's own probabilities encode the humor preference.

## 7. Deep Worked Examples

### Example 1: Training Step with Gradient Accumulation

**Scenario:** GRPO training of Voice DNA LoRA, batch of 2 prompts, $G = 4$ per prompt.

**Prompt A:** "Client expresses fear of starting a business"
- Responses: $r = [8, 4, 9, 5]$
- $\mu = 6.5$, $\sigma = 2.06$
- Advantages: $[+0.73, -1.21, +1.21, -0.73]$

**Prompt B:** "Client struggles with work-life balance"
- Responses: $r = [6, 7, 3, 8]$
- $\mu = 6.0$, $\sigma = 1.87$
- Advantages: $[0.00, +0.53, -1.60, +1.07]$

**Combined gradient:** The gradient from Prompt A and Prompt B are summed (gradient accumulation — Lesson 1, vector addition). The net gradient reflects the average policy improvement direction across both prompts.

Response A3 (Â = +1.21) and Response B4 (Â = +1.07) have the strongest positive signals — the model shifts toward their stylistic patterns. Response B3 (Â = -1.60) has the strongest negative signal — the model strongly shifts away from its patterns.

**Parameter update per LoRA matrix:**
- $\Delta A = \eta_A \cdot \nabla_A J_{\text{GRPO}}$ — using ALLoRA's asymmetric rate
- $\Delta B = \eta_B \cdot \nabla_B J_{\text{GRPO}}$ — using ALLoRA's asymmetric rate
- $\theta \leftarrow \theta + \Delta$

### Example 2: Reward Hacking Detection

**Scenario:** After 500 GRPO steps, the reward score has increased from 5.0 to 9.2. But qualitative review reveals the model is generating REPETITIVE responses — every coaching script begins with "Here's what I need you to hear:" (the coach's signature phrase) and repeats it 3-4 times per response.

**Diagnosis:** The Voice DNA Fidelity reward component gives high scores for responses containing the coach's signature phrases. The model has discovered that REPEATING these phrases maximizes the fidelity score without producing genuinely good content.

**Gradient analysis:** The gradient consistently points toward tokens containing signature phrases. The advantage for responses with repeated phrases is always positive because the fidelity score dominates the reward.

**Fix options:**
1. **Reward function redesign:** Add a REPETITION PENALTY to the reward: $r = r_\text{base} - \lambda \cdot \text{repetition\_score}$. The gradient now penalizes repetition.
2. **KL constraint tightening:** Increase $\beta$ in the KL penalty. This keeps the model closer to the reference policy, which doesn't exhibit pathological repetition.
3. **Training truncation:** Stop training at step 300 (before reward hacking onset) and use the step-300 checkpoint.

This example demonstrates WHY "more RL training ≠ better model" and why the CCP's JIT Critic includes human-in-the-loop validation.

## 8. Edge Case Analysis

### When $G = 1$: GRPO Degenerates

With a single sample, $\mu = r_1$ and $\sigma = 0$. The advantage $\hat{A} = (r_1 - r_1) / 0$ = undefined. GRPO with $G = 1$ is mathematically ill-defined. At least 2 samples are needed for the Z-Score to be computable. This is why $G = 2$ is the absolute minimum — and why it reduces to DPO.

### When All Rewards Are Equal

If all $G$ responses receive the same reward score: $r_1 = r_2 = \dots = r_G$, then $\mu = r$ and $\sigma = 0$. Again, the Z-Score is undefined. The gradient is zero — the model receives no learning signal. This occurs when the reward function lacks discriminative power (all responses are equally "good" or equally "mediocre"). The fix: design reward functions with sufficient dynamic range to differentiate between responses.

### When $\epsilon \to 0$: No Policy Change Allowed

As the clipping parameter approaches zero, $\text{clip}(w, 1-\epsilon, 1+\epsilon) \to \text{clip}(w, 1, 1) = 1$. The clipped ratio is always 1, regardless of the actual ratio. The gradient contribution is exactly $\hat{A}$ for every token — the importance ratio is irrelevant. This effectively reverts to REINFORCE without importance sampling. The model can only take infinitesimal policy steps.

### When $\beta \to \infty$: KL Penalty Dominates

As $\beta$ increases, the KL penalty overwhelms the reward signal. $J_{\text{GRPO}} \approx -\beta \text{KL}(\pi_\theta || \pi_\text{ref})$. The optimizer drives $\pi_\theta \to \pi_\text{ref}$ — the policy reverts to the reference model. No learning occurs. The model is "frozen" by the KL constraint. Typical $\beta$ values: 0.01–0.1.

## 9. Invariants: The Core Laws

1. **The clipping bound guarantees safe updates.** By constraining $w \in [1-\epsilon, 1+\epsilon]$, no single training example can change the policy by more than $\epsilon$ per step (in probability ratio terms). This is a formal, mathematical guarantee of training stability.

2. **Z-Score normalization ensures scale invariance.** Whether rewards are in [0, 1] or [0, 10,000], the advantages have zero mean and unit variance. The gradient magnitude is independent of the reward scale.

3. **The min operator is conservative.** $\min(w\hat{A}, \text{clip}(w)\hat{A})$ always selects the more pessimistic estimate of improvement. For positive advantages: the clipped (capped) value. For negative advantages: the unclipped (uncapped penalty) value.

4. **Gradient linearity in rewards.** $\nabla_\theta J_{\text{GRPO}}$ is linear in the advantages $\hat{A}$. Doubling all rewards doubles the gradient magnitude (before normalization). Z-Score normalization eliminates this dependency, making the gradient invariant to reward scale.

5. **Reverse KL is mode-seeking.** The KL penalty $\text{KL}(\pi_\theta || \pi_\text{ref})$ pulls $\pi_\theta$ toward the modes (peaks) of $\pi_\text{ref}$, not toward covering its full support. The trained policy becomes more focused, not more diverse.

## 10. Minimal Analogy Support

**The Football Season:**

Imagine GRPO as an entire football season of tactical refinement. Each matchday, the coach generates $G$ tactical configurations (game plans). The results (wins, draws, losses, xG) provide the reward signal. The advantage = how much each configuration outperformed the season average. The clipping = "never change more than 20% of the tactical setup between matches." The KL penalty = "never deviate so far from the base formation that you forget how to defend." Over 38 matches, the strategy converges to a locally optimal tactical identity — the team's signature style.

DPO is the simpler version: show the coach two match recordings and ask "which performance was better?" No scores needed — just preference. Over many such comparisons, the tactical preferences converge.

The difference between GRPO and DPO is the difference between a data-driven xG analysis (rich numerical signal from multiple matches) and a pundit's binary hot-take ("Chelsea were better than Arsenal today"). Both contain information. One is richer but more expensive to compute.
