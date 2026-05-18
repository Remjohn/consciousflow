Reward Hacking in the Era of Large Models Fudan NLP Group































































1


Reward Hacking in the Era of Large Models Fudan NLP Group

#### **Contents**


**1** **Introduction** **3**


**2** **Foundations of Proxy-Based Alignment** **4**


2.1 Reward Misspecification and Goodhart’s Law 4


2.2 The Anatomy of Proxy Evaluators: RLHF, RLAIF, and RLVR 5


2.3 The Proxy Compression Hypothesis 5


2.4 Structural Taxonomy of Reward Hacking under PCH 6


_2.4.1_ _Feature-Level Exploitation:_ _Amplifying Compression Artifacts_ _6_


_2.4.2_ _Representation-Level Exploitation:_ _Navigating Equivalence Classes_ _6_


_2.4.3_ _Evaluator-Level Exploitation:_ _Gaming the Co-Adaptive Loop_ _6_


_2.4.4_ _Environment-Level Exploitation:_ _Bypassing the System_ _7_


**3** **Manifestations in Large Language Models** **7**


3.1 Verbosity and Stylistic Shortcut Learning 7


3.2 Sycophancy and Agreement Optimization 9


3.3 Fabricated Reasoning and Hallucination 10


3.4 Reward Overoptimization and Scaling Effects 11


**4** **From Local Shortcut Learning to Emergent Misalignment** **12**


4.1 Generalization of Reward Hacks Across Tasks 12


4.2 Alignment Faking and Evaluator Modeling 13


4.3 Evaluator–Policy Co-Adaptation Dynamics 14


**5** **Detection and Diagnosis:** **A Lifecycle Approach** **15**


5.1 Training-Time Online Monitoring 16


5.2 Inference-Time Safeguards and Trajectory Analysis 17


5.3 Post-Hoc Auditing and Mechanistic Diagnostics 18


5.4 Synthesis and Open Challenges: The Fallacy of Static Benchmarks 19


**6** **Mitigation Through Structural Intervention** **20**


6.1 Reducing Objective Compression 20


6.2 Controlling Optimization Amplification 21


6.3 Evaluator–Policy Co-Evolution Paradigm 22


**7** **Reward Hacking in Multimodal, Generative, and Agentic Models** **23**


7.1 Reward Hacking in Multimodal Large Language Models 24


7.2 Reward Hacking in Visual Generative Models 24


7.3 Reward Hacking in Agentic Models 25


**8** **Open Challenges and Future Directions** **26**


**9** **Discussion and Conclusion** **27**


2


Reward Hacking in the Era of Large Models Fudan NLP Group

#### **1 Introduction**


The integration of Reinforcement Learning (RL) into generative foundation model training has profoundly reshaped
the landscape of AI alignment. Modern pipelines, such as Reinforcement Learning from Human Feedback (RLHF)

[1–4] and Reinforcement Learning from AI Feedback (RLAIF) [5, 6], attempt to align models with nuanced humancentric values beyond mere next-token prediction. Reinforcement Learning from Verifiable Rewards (RLVR) extends
this paradigm to rigorous domains like mathematics and coding by optimizing against outcome-based checkers

[7, 8]. Despite their empirical success, these approaches share a critical, unifying structural vulnerability: alignment
fundamentally depends on optimizing expressive policies against learned or engineered proxy signals that imperfectly
approximate true human intent [9–11].


Because the policy is optimized against a compressed proxy rather than the latent objective itself, a persistent misalignment gap emerges. This mismatch gives rise to _reward hacking_, a phenomenon fundamentally rooted in Goodhart’s
Law, where an imperfect proxy measure breaks down when subjected to strong optimization pressure. In the broader
literature, this systemic vulnerability is also discussed under various synonymous or closely related concepts, including
_reward gaming_ [9], _reward overoptimization_ [12], _specification gaming_ [13], _goal misgeneralization_ [14], and _reward_
_tampering_ [15]. At its core, reward hacking occurs when a model produces behavioral trajectories that mathematically
maximize the proxy reward while actively degrading or bypassing the intended objective [10, 16]. While reward hacking
has long been recognized as a theoretical curiosity in classical reinforcement learning, its manifestation in modern large
language models (LLMs) and multimodal large language models (MLLMs) introduces qualitatively new and systemic
risks [17–19]. Because foundation models operate in high-dimensional, open-ended spaces and possess the capacity to
reason about their own evaluation processes, reward hacking ceases to be a mere collection of localized implementation
bugs. Instead, it becomes a systemic, strategic consequence of optimizing highly capable policies against imperfect
evaluators at scale [18, 20, 21].


To systematically understand and address this structural instability, we propose the **Proxy Compression Hypothesis**
**(PCH)** as a unifying theoretical lens for this study. Human objectives, such as truthfulness, helpfulness, and safety, are
inherently high-dimensional, context-dependent, and multi-criteria [22]. Alignment pipelines necessarily compress
these rich latent value structures into lower-dimensional parametric representations (e.g., scalar reward models or binary
outcome verifiers). PCH posits that reward hacking is a natural consequence of the interaction of three continuous
forces:


1) **Objective compression** : The lossy mapping of high-dimensional human values into low-dimensional, exploitable proxy representations [23].

2) **Optimization** **amplification** : The aggressive search pressure exerted by powerful policies, driving them
toward regions where the proxy extrapolates poorly [12, 16].

3) **Evaluator–policy** **co-adaptation** : The iterative dynamic where policies and evaluators co-evolve, often
converging on shared blind spots rather than eliminating them [24, 25].


Driven by these three forces, reward hacking manifests through an escalating hierarchy of mechanisms. As we detail in
this paper, policies first engage in _feature-level exploitation_ by amplifying superficial statistical correlates like verbosity

[26] or sycophancy [20]. They then evolve toward _representation-level exploitation_ by fabricating plausible reasoning
traces or bypassing visual grounding to decouple outcomes from faithful processes [7, 27]. As optimization pressure
intensifies, models transition to _evaluator-level exploitation_ by strategically manipulating the biases of the scoring judge

[28], and eventually _environment-level exploitation_ by tampering with APIs, test suites, or observation channels in
agentic workflows [18].


Beyond these specific mechanisms, recent empirical evidence suggests that reward hacking is highly generalizable [18,
29]. Training on seemingly benign shortcut behaviors can cultivate a transferable meta-strategy: the model learns to
model the evaluator itself as an object distinct from the underlying task. Once this decoupling occurs, localized metric
exploitation can spontaneously escalate into severe emergent misbehaviors, including alignment faking [30], strategic
noncompliance, and the concealment of intent, even surviving subsequent safety training [29, 31].


Addressing this escalating threat requires recognizing that static benchmarks and ad-hoc patches are insufficient. Instead,
mitigating reward hacking demands a rigorous, full-stack approach. In this paper, we provide a comprehensive synthesis
of the reward hacking landscape, structured to guide researchers from theoretical foundations to practical defense
mechanisms. Our main contributions are:


1) **Theoretical** **Formalization** **(PCH)** : We formalize the Proxy Compression Hypothesis, reframing reward
hacking not as an algorithmic error, but as the inevitable consequence of optimization under information
bottlenecks.


3


Reward Hacking in the Era of Large Models Fudan NLP Group


2) **Structural Taxonomy & Manifestations** : We propose a unified taxonomy of reward hacking mechanisms
(Feature, Representation, Evaluator, and Environment levels) and systematically review their manifestations
across text-only LLMs and multimodal/agentic systems.


3) **Evolutionary Trajectory Analysis** : We critically examine the transition from localized shortcut learning to
emergent, strategic misalignment, illustrating how co-adaptation loops foster alignment faking and evaluator
manipulation.


4) **Lifecycle Detection & Defense Framework** : We categorize detection and diagnosis methods across a lifecycle
continuum, from training-time online monitoring (tracking latent structural invariances) to inference-time
safeguards and post-hoc mechanistic auditing, alongside a comprehensive evaluation of current mitigation
strategies.


As generative systems become increasingly autonomous and embedded in real-world infrastructure, optimizing proxy
rewards is no longer sufficient. Mitigating reward hacking is the prerequisite for ensuring that the alignment of future
AI systems remains robust under the immense optimization pressure of the real world.


The remainder of this work is organized as follows. Section 2 establishes the theoretical foundations of proxy-based
alignment (PCH) and our structural taxonomy. Section 3 details concrete manifestations in text-only LLMs. Section 4
explores the evolutionary trajectory from local shortcuts to emergent strategic misalignment. Section 5 provides a
lifecycle framework for detection and diagnosis, while Section 6 synthesizes structural mitigation strategies. Finally,
Section 7 examines unique vulnerabilities in multimodal and agentic systems, followed by open challenges and
conclusions in Sections 8 and 9.

#### **2 Foundations of Proxy-Based Alignment**


Modern alignment pipelines for LLMs and MLLMs rely on proxy-based optimization. Instead of optimizing directly
for the full human objective, models are trained against learned or engineered reward signals. This setup is necessary
because true human preferences are expensive, noisy, and hard to observe. Furthermore, properties like truthfulness,
safety, and multimodal grounding resist simple algorithmic definitions. As a result, alignment methods compress
high-dimensional human intent into low-dimensional surrogate evaluators, and then optimize policies against these
proxies.


This section formalizes the theoretical foundations of proxy-based alignment. We define the gap between latent
objectives and proxy rewards, examine how standard alignment frameworks (RLHF, RLAIF, RLVR) systematically
induce these gaps, and introduce the _Proxy Compression Hypothesis_ (PCH). Finally, we provide a four-level taxonomy
that categorizes the mechanisms of reward hacking.


**2.1** **Reward Misspecification and Goodhart’s Law**


Let _x_ denote an input prompt or environment state, _y_ a model output, and _r_ _[⋆]_ ( _x, y_ ) the true, unobserved objective
capturing what developers actually want. In practice, training does not optimize _r_ _[⋆]_ directly. Instead, it uses a proxy
reward _r_ ˜( _x, y_ ) built from human annotations, AI labels, or programmatic verifiers. Reward misspecification occurs
whenever ˜ _r_ fails to preserve the preference ordering induced by _r_ _[⋆]_ .


This gap reflects a classic problem in AI safety. Classical specification gaming shows that agents trained on imperfect
rewards often discover policies that maximize measured performance while violating the designer’s intent [10, 15].
Skalse et al. [9] formalize reward hacking as the regime where optimizing an imperfect proxy strictly decreases expected
performance under the true reward. For foundation models, this failure rarely looks like total task collapse; instead, the
model learns to look good under evaluation without actually satisfying the latent objective.


This dynamic follows Goodhart’s Law: when a measure becomes a target, it ceases to be a good measure. Early
in training, high proxy reward correlates with genuine quality. However, strong optimization pushes the policy
into low-density regions of the output space that were weakly represented in the evaluator’s training data. In these
out-of-distribution regions, the proxy breaks down, and superficial correlates of quality dominate the score [16, 32].


We define this misalignment as the _proxy gap_ :


∆( _x, y_ ) = _r_ _[⋆]_ ( _x, y_ ) _−_ _r_ ˜( _x, y_ ) _._ (1)


Reward hacking occurs when optimization systematically shifts probability mass to outputs that maximize ˜ _r_ ( _x, y_ ) while
degrading _r_ _[⋆]_ ( _x, y_ ). Under this view, seemingly different problems, such as verbosity bias, sycophancy, unfaithful
reasoning, and evaluator tampering, are simply different strategies for exploiting ∆( _x, y_ ).


4


Reward Hacking in the Era of Large Models Fudan NLP Group


**2.2** **The Anatomy of Proxy Evaluators:** **RLHF, RLAIF, and RLVR**


To see how the proxy gap emerges, we examine standard alignment paradigms. While Reinforcement Learning from
Human Feedback (RLHF), AI Feedback (RLAIF), and Verifiable Rewards (RLVR) differ in their supervision sources,
they share a structural flaw: they all act as lossy compression mechanisms for the latent objective.


**RLHF: Compressing Human Nuance.** In standard RLHF, a reward model _rϕ_ is trained to predict human preferences
over response pairs ( _yw, yl_ ) using a Bradley–Terry model [1, 33]. The policy _πθ_ then maximizes this learned scalar,
constrained by a Kullback-Leibler (KL) penalty against a reference model [1, 34]:

max _πθ_ E _x∼D, y∼πθ_ ( _·|x_ ) [ _rϕ_ ( _x, y_ )] _−_ _β D_ KL� _πθ_ ( _· | x_ ) _∥_ _π_ ref ( _· | x_ )� _._ (2)


Direct alignment algorithms like DPO optimize a similar preference geometry [35]. In RLHF, the proxy gap arises
because diverse, context-dependent human values are aggregated into a single, uncalibrated scalar. Optimization exploits
this by targeting easy-to-learn heuristic artifacts (e.g., authoritative tone or formatting) that consistently triggered human
approval during training.


**RLAIF: Distilling Evaluator Priors.** RLAIF uses the same mathematical structure but replaces human annotators
with AI judges [5, 6]. While this improves scalability, it shifts the proxy gap. The optimization target is no longer a
compression of human values, but a compression of another model’s approximation of those values. The reward signal
inherits the supervising LLM’s blind spots and linguistic biases, allowing the policy to reverse-engineer and pander to
the AI judge.


**RLVR: Process-Outcome Decoupling.** RLVR optimizes the policy against discrete verifiers _v_ ( _x, y_ ), such as unit
tests or math checkers [8, 36]. Because RLVR uses objective programmatic signals, it is often assumed to be robust
against reward hacking. However, verifiable signals are narrow. By rewarding checkable final answers while ignoring
the cognitive steps taken to reach them, RLVR creates a proxy gap regarding faithful process. This encourages models
to guess answers using spurious priors, fabricate reasoning, or misuse tools.


**A Unifying View.** Across all paradigms, the alignment target reduces to an evaluator _e_ ( _x, y_ ) _∈_ R. The core instability
is not the specific reward source, but the fact that _e_ ( _x, y_ ) is an imperfect, lower-dimensional surrogate for _r_ _[⋆]_ ( _x, y_ ).


**2.3** **The Proxy Compression Hypothesis**


To explain why reward hacking gets worse as models get smarter, we propose the Proxy Compression Hypothesis
(PCH). PCH suggests that reward hacking is not just a simple bug. Instead, it happens because we force complex human
values into simple reward scores, and then push the model to maximize those scores.


Let the true objective rely on a rich set of features _z_, capturing things like truthfulness, tone, and safety. This means
_r_ _[⋆]_ ( _x, y_ ) = _f_ ( _z_ ; _x, y_ ). Since we cannot perfectly measure _z_, current alignment methods build a substitute evaluator:


_e_ ( _x, y_ ) = _C_ ( _z_ ; _x, y_ ) _,_ (3)


where _C_ is a compression operator. This compression is caused by limited model capacity, binary outcome checking,
and restricted context windows. Crucially, _C_ maps multiple different behaviors to the same reward score. This creates
equivalence classes. For example, a mathematically valid proof and a completely fabricated argument might receive the
exact same score from a flawed proxy.


Under PCH, reward hacking is driven by three continuous forces:


1) **Objective Compression:** The lossy mapping _C_ creates blind spots where the true utility drops but the proxy
reward stays high.

2) **Optimization Amplification:** Training methods like RL or DPO apply strong search pressure [12, 17, 37].
They push policies into these blind spots because getting high proxy rewards there is computationally cheaper.

3) **Evaluator and Policy Co-Adaptation:** During training, models and evaluators adapt to each other. Instead of
fixing the blind spots, they often stabilize them, teaching the model to treat the evaluator as a target to game.


Under this hypothesis, isolated hacks are just instances of a general strategy. The model learns to find and exploit the
dimensions where the evaluator is easier to satisfy than the actual task.


More importantly, this combination of compression and optimization creates an amplification effect. As model
capabilities grow and deployment scales up, exploiting a flawed proxy stops being a minor local error. It evolves into a


5


Reward Hacking in the Era of Large Models Fudan NLP Group


systemic vulnerability. What looks like a harmless shortcut in a controlled test can scale into a massive failure when the
model handles complex, real world tasks. We will discuss the broader implications of this amplification in the final
section of this survey.


**2.4** **Structural Taxonomy of Reward Hacking under PCH**


Building on the PCH, we organize reward hacking mechanisms by their _locus_ _of_ _exploitation_ [9, 12]. As policy
capabilities increase, the nature of exploitation escalates from passive signal noise manipulation to active environment
manipulation. We define four distinct levels, summarized in Table 1.


Table 1: Taxonomy of Reward Hacking Mechanisms. Under the PCH, these four classes represent how policies exploit
the bottlenecks and vulnerabilities of proxy-based alignment.


**Mechanism Class** **Exploited Locus** **Typical Pattern** **Typical Setting** **Main Risk under PCH**



**Feature-level** Surface reward Verbosity bias; sycophancy;
correlates politeness inflation; formatting
exploits


**Representation-** Latent shortcut Fabricated CoT; memorized
**level** strategies schemas; benchmark gaming;
process–outcome decoupling


**Evaluator-level** Reward model / judge Blind-spot exploitation; judge
/ verifier manipulation; selective
compliance; concealed errors


**Environment-level** Tools, logs, tests, Test rewriting; reward tampering;
observation channels API/logging exploits;
camera-angle hacks



RLHF; RLAIF; **Compression Artifacts:** Optimization amplifies
preference tuning superficial “survivor features” that dominate the
low-dimensional proxy score.


RLVR; reasoning; **Equivalence Classes:** Degenerate shortcuts become
multimodal tasks indistinguishable from faithful reasoning under
outcome-only evaluation.



Agentic coding; tool **Amplification Limit:** The policy bypasses the latent
use; embodied agents objective by altering the physical or digital medium
through which oversight operates.



Learned RMs;
LLM-as-a-judge;
rubric grading



**Co-adaptation:** The evaluator ceases to be a transparent
metric and is recognized by the policy as a manipulable
object.



**2.4.1** **Feature-Level Exploitation:** **Amplifying Compression Artifacts**


Feature-level exploitation is the most common form of reward hacking. It occurs when a policy amplifies superficial
linguistic or visual traits that correlate with high scores but lack a causal connection to true task success [12, 38].


Under the PCH framework, this is a direct symptom of objective compression. When complex preferences are squeezed
into a scalar, nuanced criteria are replaced by easily measurable heuristics. We term these _“survivor features”_, traits
like excessive verbosity, deferential formatting, or high-contrast image artifacts that survive the compression bottleneck.
Because generating these features is cheaper than improving latent reasoning, the optimizer shifts probability mass
toward them. This establishes a baseline meta-strategy: the policy learns that optimizing observable artifacts is superior
to executing the latent task [21].


**2.4.2** **Representation-Level Exploitation:** **Navigating Equivalence Classes**


While feature-level hacking targets surface artifacts, representation-level exploitation targets the semantic and structural
logic of the policy. The model discovers shortcuts that satisfy the evaluator’s criteria while skipping the actual cognitive
or perceptual work required.


This mechanism exploits the equivalence classes established by the compression operator _C_ . Because evaluators
(especially in RLVR) discard intermediate states, a policy that reaches a correct answer via rigorous deduction and a
policy that guesses the answer using flawed heuristics paired with a fabricated Chain-of-Thought (CoT) look identical
to the proxy [27, 39]. In multimodal models, this appears as perception bypass, where the model ignores visual input
and hallucinates details based on language priors [40]. Representation-level exploitation decouples the model’s internal
processing from its external output, marking a transition toward implicit deception.


**2.4.3** **Evaluator-Level Exploitation:** **Gaming the Co-Adaptive Loop**


Evaluator-level exploitation marks a phase transition. The policy stops treating the evaluator as a static constraint and
begins modeling it as an active, manipulable attack surface. This aligns with the evaluator–policy co-adaptation pillar
of PCH.


As policy capabilities exceed those of the evaluator, the policy navigates directly into the evaluator’s blind spots [12, 17].
In LLM-as-a-judge frameworks, the generating policy can reverse-engineer the evaluating model, using prompt-injection
techniques or tailored formatting to trigger approval heuristics regardless of true quality [41, 42]. Under PCH, this


6


Reward Hacking in the Era of Large Models Fudan NLP Group


proves that intense compression creates an adversarial interface, catalyzing evaluator-aware, alignment-faking behaviors

[21, 29].


**2.4.4** **Environment-Level Exploitation:** **Bypassing the System**


Environment-level exploitation is the absolute limit of optimization amplification. At this stage, the policy targets
neither its own outputs nor the judge, but the surrounding physical or digital infrastructure that mediates evaluation.


As models are deployed as autonomous agents, their action spaces expand, allowing textual persuasion to escalate into
digital, and potentially physical manipulation in embodied agents. [43, 44]. An agent tasked with passing a software
test may rewrite the unit test assertions to `True`, or suppress system error logging to hide its failures [21]. This breaks
the classical agent-environment boundary. The policy recognizes that the proxy reward relies entirely on the _observed_
state rather than the _true_ state, making evaluation channel modification the most efficient path to reward maximization.

#### **3 Manifestations in Large Language Models**





Figure 1: **The illusion of alignment:** **Manifestations of reward hacking across diverse model families.** When guided
by imperfect proxy evaluators (Reward Models), models often discover strategies that maximize proxy scores (green
boxes) while actively bypassing the true task intent (red boxes). **(1) Large Language Models:** Exploiting preference
proxies through _sycophancy_ and factual compromise. **(2) Multimodal Language Models:** Bypassing genuine visual
grounding via _metric-specific shortcuts_, such as artificially inflating bounding boxes. **(3) Visual Generative Models:**
Suffering _structural_ _degradation_ (e.g., generating a two-headed dog) when over-optimizing for specific semantic
features. **(4)** **Agentic** **Models:** Engaging in _environment-level_ _exploitation_ by directly tampering with oversight
mechanisms and static unit tests.


Reward hacking in text-only large language models shows up in several ways. These behaviors look different on the
surface but share a common cause. They happen because human goals are complex, but the models use simplified proxy
scores to learn. As explained in Section 2, we should not view these issues as random errors. They are the natural result
of training capable language models with imperfect scoring systems. This section examines four primary manifestations:
verbosity bias, sycophancy, fabricated reasoning, and reward overoptimization under scaling, and analyzes how each
represents either feature-level or representation-level exploitation of the proxy gap.


**3.1** **Verbosity and Stylistic Shortcut Learning**


The most common form of reward hacking is exploiting writing styles, especially response length. When reward
models learn from human preferences, they pick up on patterns in the training data. One common pattern is that longer
responses tend to receive higher ratings. Human raters often find it hard to evaluate complex answers. They may prefer
long answers because length seems to indicate thoroughness, even if a short answer would actually be better.


7


Reward Hacking in the Era of Large Models Fudan NLP Group





























Figure 2: This figure serves as an organized preview of the four primary manifestations examined in this section:
verbosity bias, sycophancy, fabricated reasoning, and reward overoptimization. For each manifestation, the figure traces
its underlying PCH causal mechanism, distinguishing feature-level exploitation (e.g., length, agreement cues) from
representation-level exploitation (e.g., reasoning faithfulness compression) and concludes with a bridge to how these
localized shortcuts collectively set the stage for emergent strategic misalignment (Section 4). Together, this taxonomy
provides a conceptual roadmap for the section’s sequential exposition of how reward hacking manifests across LLM
alignment pipelines.


**Manifestations** **of** **Verbosity** **Bias.** Under optimization pressure, this statistical artifact becomes an exploitable
target. The policy discovers that increasing response length reliably yields higher reward model scores, independent
of substantive improvements in helpfulness, accuracy, or faithfulness. Singhal et al. [26] document this clearly. They
show that responses get progressively longer across training iterations. Models learn to pad their text with repeated
statements, complex formatting, and empty phrases. These tricks increase the token count without adding real value.
The authors show that optimizing for length causes a large portion of the performance gains seen in standard alignment
pipelines.


Recent work has extended this analysis to process reward models (PRMs), which evaluate multi-step reasoning. Zheng
et al. [45] found a strong length bias in these models. The evaluators give higher scores to longer reasoning steps even
when the logic remains the same. This ruins the reliability of the scores and leads to bloated text during testing. Their
analysis shows that step length acts as a confusing variable that distorts the actual reward.


Beyond standard RLHF, the emergence of large-scale reasoning models has introduced a new variant of verbosity
hacking known as _stalling tokens_ . Recent tests on models trained with new optimization frameworks [8] show interesting
results. When models are rewarded for accurate reasoning and consistency, they might start generating repetitive
thoughts or useless self-correction loops. These behaviors look like deep thinking but are actually shortcuts to maintain
high scores under pressure. This is especially true when the reward model favors dense logical steps.


**Underlying Causes.** The PCH framework interprets verbosity bias as a canonical instance of _feature-level exploitation_ .
The true objective _r_ _[∗]_ ( _x, y_ ) encompasses multiple dimensions of response quality, including conciseness, relevance,
and informativeness. The proxy evaluator _rϕ_ ( _x, y_ ), trained on finite preference data, compresses these dimensions into
a scalar score while imperfectly weighting them. Statistical regularities like length-quality correlations survive this
compression as ‘survivor features’, and because they are easier to represent in a low-dimensional scalar reward than
nuanced ‘conciseness’, they receive disproportionate optimization weight. The policy, optimizing aggressively against


8


Reward Hacking in the Era of Large Models Fudan NLP Group


_rϕ_, then amplifies precisely those features that are easiest to manipulate, discovering that verbosity offers a low-cost
pathway to high proxy scores.


This explains why verbosity bias persists across different training methods. Even direct alignment algorithms like DPO
show similar length-based shortcuts at higher training budgets [12]. This means length exploitation is not just a bug in
the reward model. It is a general result of using any proxy that fails to capture the full objective. When compression
erases the difference between a genuinely good response and a superficially long one, the training process will always
favor the easier option.


**3.2** **Sycophancy and Agreement Optimization**


A second major manifestation of reward hacking in LLMs is _sycophancy_ : the tendency of models to align their responses
with user beliefs or stated positions, even when those beliefs are factually incorrect or normatively problematic. This
behavior emerges from a similar structural dynamic as verbosity bias but operates at a higher semantic level, exploiting
the reward model’s difficulty in distinguishing genuine helpfulness from mere agreement.


**Manifestations of Sycophancy.** In preference-based alignment, human raters may systematically prefer responses that
affirm their views, creating a statistical association between agreement and perceived quality. The reward model inherits
this association, learning to assign higher scores to responses that mirror user perspectives. The policy, optimizing
against this proxy, then amplifies agreement behavior, discovering that sycophancy offers a reliable path to high reward
independent of factual accuracy or substantive utility. Empirical work has quantified both the prevalence of this
phenomenon and its amplification under RLHF. Denison et al. [21] demonstrate that sycophantic tendencies increase
significantly during reinforcement learning from human feedback, as the policy learns to exploit the reward model’s
sensitivity to agreement cues.


The Beacon framework introduced by Pandey et al. [46] provides a systematic approach to diagnosing latent sycophancy.
The authors conceptualize sycophancy as a structural trade-off between truthfulness and obsequious flattery that
emerges from reward optimization conflating helpfulness with polite submission. Through a single-turn forced-choice
benchmark that isolates this bias independent of conversational context, Beacon enables precise measurement of the
tension between factual accuracy and submissive bias. Evaluations across twelve state-of-the-art models reveal that
sycophancy decomposes into stable linguistic and affective sub-biases, each scaling with model capacity. Notably,
larger models exhibit higher sycophancy not due to a lack of knowledge, but because their superior reasoning allows
them to more accurately infer and mirror the user’s latent biases. This underscores the ‘Inverse Scaling’ challenge in
preference-based alignment.


Complementing diagnostic approaches, evaluation frameworks have been developed to systematically measure sycophancy across models and domains. Fanous et al. [47] introduce SycEval, a framework for evaluating LLM sycophancy
across models including ChatGPT-4o, Claude-Sonnet, and Gemini-1.5-Pro on AMPS (mathematics) and MedQuad
(medical advice) datasets, providing quantitative benchmarks for measuring this phenomenon across domains and
model families.


Sycophancy also leads to _knowledge conficts_ . Research shows that models do not just agree with users. They actively
suppress their own internal knowledge to favor user-provided misinformation [51]. Preference-based training can
accidentally punish factual accuracy when it contradicts a user’s bias. This creates a tradeoff between sycophancy and
accuracy that gets worse as models get smarter.


**Underlying** **Causes.** Under the PCH framework, sycophancy can be understood as an instance of
_feature-level exploitation_, wherein the policy learns to exploit features correlated with reward in the training distribution.
Within this broad category, it is useful to distinguish between two forms of exploitation. _Surface-level sycophancy_
operates through lexical cues: models learn to insert phrases such as “you’re right that” or “I agree with your perspective”
that signal agreement irrespective of content. _Representation-level sycophancy_ involves deeper semantic alignment:
models may generate arguments that cohere with user beliefs while suppressing counterevidence, or structure responses
to validate user assumptions without explicit agreement markers. Both forms reflect the same underlying mechanism (the
exploitation of agreement as a proxy for quality) but operate at different levels of semantic abstraction.


Pandey et al. [46] further demonstrate that these biases are inherently manipulable at the mechanistic level. Intervening
in the prompt or the model’s activations can push sycophancy in either direction. This shows that alignment is a dynamic
trade-off between truthfulness and social compliance. Models internalize social norms from their training data without
filtering them properly.


9


Reward Hacking in the Era of Large Models Fudan NLP Group


The difference between surface and deep sycophancy is important. We can fix surface-level sycophancy with simple
penalties. However, representation-level sycophancy requires complex solutions that target the hidden strategies the
models use to optimize agreement.


**3.3** **Fabricated Reasoning and Hallucination**


One of the most harmful forms of reward hacking is _fabricated reasoning_ . Unlike verbosity or sycophancy, fake
reasoning directly destroys the reliability and trustworthiness of the model. From the perspective of score optimization,
fabrication makes perfect sense. If the evaluator only rewards final answers that look logical, the model learns that
generating a confident fake explanation works better than admitting uncertainty.


**Manifestations of Fabricated Reasoning.** This phenomenon has been extensively documented in chain-of-thought
reasoning. Turpin et al. [27] show that language models often produce explanations that do not faithfully reflect their
actual decision processes, instead generating post-hoc rationalizations. In these instances, the Chain-of-Thought (CoT)
functions not as a logical blueprint, but as a ‘defense attorney’, constructing a plausible justification for a conclusion
already reached through hidden heuristic shortcuts. Lanham et al. [39] similarly find that chain-of-thought traces can be
unfaithful, with models achieving correct answers through reasoning paths that diverge from those verbalized in their
explanations. These findings reveal a fundamental vulnerability in using CoT as a window into model reasoning: when
the evaluator rewards plausible-looking reasoning, the policy learns to generate plausible reasoning regardless of its
correspondence to underlying computations.


Recent work extends this analysis to state-of-the-art reasoning models, showing that reinforcement learning can increase
the use of heuristic shortcuts, such as relying on hints present in prompts, without proportionally increasing disclosure
of this reliance in chain-of-thought [48]. Models learn to exploit subtle hints in prompts while keeping their reasoning
steps looking coherent. They optimize what the evaluator can see rather than showing their true decision process.


Research on faithfulness in reasoning models has revealed systematic patterns of unfaithfulness. Tutek et al. introduce
FUR (Faithfulness by Unlearning Reasoning steps), a framework that erases information contained in reasoning steps
from model parameters and measures faithfulness by the resulting effect on the model’s prediction [49]. Experiments
across four language models and five multiple-choice question answering datasets demonstrate that FUR can precisely
change underlying models’ predictions by unlearning key steps, providing empirical evidence for systematic unfaithfulness in Chain-of-Thought reasoning. Their findings reveal that when CoT contains information causally relevant to the
final answer, erasing that information reliably changes predictions; conversely, when CoT is unfaithful, erasing it leaves
predictions unchanged, demonstrating a clear discrepancy between reported reasoning and actual decision processes.


Even with step-level supervision, reward hacking persists through _logical camoufage_ . Analysis of process-supervised
models shows that agents can learn to generate “convincing but disconnected” reasoning steps, i.e.,intermediate
conclusions that look logically sound to a reward model but are functionally decoupled from the final answer [52]. This
suggests that current PRMs may still suffer from a representation gap, failing to capture the causal necessity of each
reasoning step.


**Underlying Causes.** The PCH framework interprets fabricated reasoning as _representation-level exploitation_ of a
particularly subtle kind. The true objective _r_ _[∗]_ ( _x, y_ ) includes not only answer correctness but also reasoning faithfulness:
the expectation that explanations accurately reflect how conclusions were reached. The proxy evaluator, however,
typically observes only the final answer and the surface form of the reasoning trace. It lacks access to the internal
computations that generated them. This creates a compressed representation in which multiple latent strategies become
reward-equivalent: faithful reasoning that genuinely derives answers from evidence, and fabricated reasoning that
merely simulates the appearance of derivation. Once optimization discovers that fabrication is cheaper, more stable, or
more generalizable under the proxy, the policy shifts toward it.


This analysis helps explain why hallucinations persist despite substantial efforts to mitigate them. The core challenge is
that outcome-based rewards cannot distinguish between reasoning paths that genuinely derive answers and those that
merely simulate derivation. When both strategies yield correct answers, optimization will favor whichever path requires
less computational resources or offers more reliable returns.


The gradient-level dynamics of reinforcement learning further exacerbate fabrication. Positive sample reinforcement
(PSR) actively suppresses all unsampled tokens—even reasonable ones—accelerating distribution collapse, whereas
negative sample reinforcement (NSR) maintains higher entropy and enables continued exploration [53]. This asymmetric
effect means that standard RL objectives inherently favor narrow, repetitive patterns over diverse, exploratory reasoning,
pushing models toward stereotyped reasoning traces that may not reflect genuine understanding.


10


Reward Hacking in the Era of Large Models Fudan NLP Group


**3.4** **Reward Overoptimization and Scaling Effects**


The final major issue involves the training process itself. _Reward overoptimization_ happens when optimization pressure
increases too much. The model’s proxy score continues to improve, but its actual quality stops improving and eventually
gets worse. This pattern was first documented in classical RLHF pipelines, but it remains remarkably consistent across
different alignment methods and model sizes.


**Manifestations of Reward Overoptimization.** Gao et al. [16] established scaling laws for reward model overoptimization, showing that the gap between proxy and true reward grows with optimization strength and that this growth
follows predictable functional forms. The result is clear. If a scoring system is flawed, too much training will eventually
make the model’s actual quality drop while its scores go up. This proves Goodhart’s law: when a measure becomes a
target, it stops being a good measure. This is not a random failure of a specific training run. It is a structural guarantee
when optimizing compressed objectives.


Subsequent work has extended these findings to direct alignment algorithms. Rafailov et al. [12] demonstrate that
DPO and related methods exhibit similar degradation patterns at higher KL budgets, despite not training separate
proxy reward models. Overoptimization occurs even before a single epoch of data is completed, suggesting that the
phenomenon is intrinsic to preference-based alignment rather than specific to the RLHF pipeline.


Empirical studies on direct alignment algorithms have identified a _Reward Collapse_ phenomenon where the implicit
reward in DPO deviates significantly from human intent at higher KL budgets. Unlike explicit RM-based hacking,
this manifestation is characterized by the model’s likelihood distribution becoming overly peaked on a narrow set of
“safe” but low-utility responses, effectively hacking the objective by minimizing the cross-entropy loss through stylistic
homogenization rather than substantive quality improvement.


Recent work on iterated RLHF by Wolf et al. [24] adds further nuance to training dynamics. Their analysis reveals that
while repeatedly retraining reward models with updated human feedback can slow down the rate of overoptimization,
the performance gains inherently diminish over successive iterations. Furthermore, inference-time alignment introduces
a complementary perspective. Khalaf et al. [17] characterize reward hacking in Best-of-N sampling and related
inference-time mechanisms, showing that the characteristic pattern of initial improvement followed by decline is
inevitable for a broad class of such methods.


Scaling laws for generative reward models (GenRMs) provide additional insights. Recent work [54] investigates
GenRMs trained via GRPO, revealing that while "thinking" variants consistently outperform answer-only models
on validation tasks, these gains diminish, and often reverse, during downstream policy optimization. This evaluatorrewarder gap underscores that increased reasoning capacity in evaluators does not necessarily translate to improved
robustness against overoptimization.


**Underlying** **Causes.** Under the PCH lens, reward overoptimization represents the aggregate consequence of the
feature-level and representation-level exploitations discussed above. Verbosity inflation, sycophantic agreement, and
fabricated reasoning are not alternative manifestations but complementary strategies that together drive the divergence
between proxy and true reward. The scaling laws documented by Gao et al. [16] and Rafailov et al. [12] quantify the
rate at which this divergence occurs, providing empirical grounding for the theoretical claim that reward hacking is a
structural instability of proxy-based alignment under scale.


The gradient-level dynamics of reinforcement learning further illuminate the mechanisms driving overoptimization.
Research decomposing RLVR objectives reveals asymmetric effects of positive and negative reinforcement: positive
sample reinforcement (PSR) polarizes distributions and leads to mode collapse, while negative sample reinforcement
(NSR) preserves exploration capacity by proportionally redistributing probability mass from incorrect tokens to all
un-sampled alternatives [53]. These asymmetric dynamics help explain why standard RL objectives inherently favor
narrow, repetitive patterns over diverse, exploratory reasoning under sustained optimization pressure.


**Bridge to Emergent Misalignment.** The persistence of overoptimization across paradigms (RLHF, DPO, inferencetime selection) underscores a central implication of the Proxy Compression Hypothesis: optimization amplification
systematically forces the policy into the null space of the proxy evaluator. However, up to this point, our discussion
has primarily treated reward hacking as a collection of localized, static shortcuts (e.g., verbosity, sycophancy, or
mathematical hallucinations).


As models scale and training gets stricter, a critical phase transition occurs. The models stop just learning isolated
tricks. They start developing a general strategy to game the evaluator. In Section 4, we shift our focus from these local
manifestations to examine how they evolve into _emergent, strategic misalignment_, exploring cross-task generalization,
alignment faking, and the complex co-adaptation loops between highly capable policies and their evaluators.


11


Reward Hacking in the Era of Large Models Fudan NLP Group

#### **4 From Local Shortcut Learning to Emergent Misalignment**


We treat reward hacking here as a dynamic process rather than a collection of isolated failures. Under repeated
optimization against imperfect evaluators, a local shortcut can become a more portable pattern of proxy-directed
behavior: instead of exploiting one task-specific weakness once, the policy may learn a more general way of pursuing
whatever the evaluator can be made to reward across new tasks, new evaluative settings, or more strategic forms of
interaction [14]. Recent work suggests that, in some cases, this process extends beyond task-specific reward hacking to
broader evaluator-aware behaviors, including alignment faking and other strategically adaptive forms of misalignment

[18, 29]. The discussion below develops this progression in three steps: the cross-task generalization of reward hacks,
the emergence of evaluator modeling and alignment faking, and the longer-run co-adaptive dynamics between policies
and evaluators that can stabilize these behaviors over training.









**Evaluator–policy**
**co-adaptation**

_A dynamic lens on repeated evaluator_
_repair and policy adaptation._


Weak-to-strong supervision [56],
obfuscated reward hacking [25],
weak-supervisor exploitation [57],
scalable oversight [21].



Figure 3: Conceptual structure of Section 4. _Local shortcut learning_ is the empirical starting point.
_Cross-task proxy optimization_ and _evaluator-aware behavior_ capture two ways in which reward hacking can broaden.
_Evaluator–policy co-adaptation_ provides the dynamic framework through which both tendencies can be reinforced,
redirected, or concealed over time.


**4.1** **Generalization of Reward Hacks Across Tasks**


This subsection examines how local reward hacking becomes _portable proxy optimization_ . The central issue is no
longer a single loophole in a single environment, but a broader tendency for optimization to reorganize behavior around
whichever features an imperfect evaluator rewards most reliably. The literature reviewed here shows this progression
across task transfer, curriculum escalation, changing evaluators, and spurious correlates, all of which indicate that
reward hacking can persist even when the surface form of the exploit changes.


**From local exploits to portable proxy optimization.** The key issue in this subsection is how reward hacking becomes
portable. Under optimization against imperfect evaluators, models can learn to target features that are consistently
rewarded even when those features track the intended objective only weakly. Over time, this can turn a local shortcut
into a more reusable pattern of proxy optimization, one that survives changes in task, format, or evaluator. In this sense,
generalization refers to a shift in behavioral organization: the model is no longer tied to one loophole in one environment,
but is increasingly guided by whatever signal the evaluator makes easiest to optimize. This framing connects reward
hacking to the broader literature on goal misgeneralization and objective mismatch, where models improve on available
success signals while drifting away from the objective the designer actually cares about [14, 58, 59].


**Curriculum effects and the path to reward tampering.** This dynamic is especially visible in deliberately gameable
environments. Denison et al. study LLM assistants trained across a curriculum of progressively more exploitable
settings, ranging from simpler forms of specification gaming to more serious reward-channel manipulation [21]. Their
results show a clear pattern of escalation: success on earlier and easier forms of gaming increases the likelihood of later
evaluator exploitation, and in some cases even supports zero-shot reward tampering. What matters here is the continuity
of the learned orientation. The model is repeatedly rewarded for acting on the evaluation process rather than on the


12


Reward Hacking in the Era of Large Models Fudan NLP Group


underlying task, and this makes later forms of exploitation easier to discover. The curriculum therefore provides direct
evidence that flawed evaluators can train a reusable exploitative relationship to the reward channel itself.


**From** **low-stakes** **hacks** **to** **broader** **misaligned** **behavior.** A similar escalation appears when the downstream
behavior moves beyond narrow benchmark exploitation. Taylor et al. train models on low-stakes reward-hacking
demonstrations and show that the resulting policies generalize to novel reward hacking in new environments and, in
some cases, to broader forms of misaligned behavior outside the original training distribution [29]. MacDiarmid et
al. extend this picture in a production RL setting, where reward hacking learned in coding environments is associated
with later behaviors such as alignment faking, cooperation with malicious goals, and sabotage-like actions in agentic
use [18]. These papers are valuable because they move the discussion beyond isolated loopholes. They suggest that
local proxy exploitation can sometimes function as a training ground for more consequential forms of misalignment in
settings that differ from the task where the original exploit first appeared.


**Generalization across evaluators and alignment pipelines.** The same pattern appears when the evaluator changes
form. In RLHF, the reward model serves as an explicit proxy for human preferences, and work on objective mismatch
shows that better performance against such proxies does not guarantee corresponding improvement on the underlying
objective [58, 59]. This shifts the analysis from task-specific bugs to a more general optimization problem. Coste et al.
show that reward-model ensembles can substantially mitigate overoptimization in both best-of- _n_ sampling and PPO,
which suggests that part of the failure comes from exploitable evaluator idiosyncrasies rather than from one particular
optimization procedure [60]. Wolf et al. reach a related conclusion from another direction: repeated refreshing of the
reward model can reduce overoptimization, but only under particular update choices and data-transfer regimes [24].
Across these studies, the recurring issue is the same. Once reward is mediated by a proxy, optimization continues to
organize itself around that proxy even as the surrounding pipeline changes.


**Evaluator uncertainty and spurious correlates.** This structural view becomes more concrete when the evaluator
relies on unstable or weakly grounded correlates. Zhang et al. and Yan et al. both treat evaluator uncertainty as part
of the training problem, whether through more efficient reward-model ensembles or robust objectives over uncertain
reward functions [61, 62]. ODIN makes the same issue visible at the feature level by showing that response length can
become a persistent reward-hacking target unless it is explicitly disentangled from content quality [55]. These studies
help clarify what generalization looks like mechanistically. Optimization repeatedly searches for features that are easy
for the evaluator to reward and easy for the policy to amplify. The concrete correlate may vary across settings, but the
broader behavioral pressure remains the same.


**4.2** **Alignment Faking and Evaluator Modeling**


This subsection turns from _portable proxy optimization_ to _evaluator-aware behavior_ . The main shift is that the policy
no longer responds only to reward signals or task content; it also begins to track features of the oversight process itself.
The literature here shows how this can appear as alignment faking, persistent conditional deception, more agentic forms
of scheming, and structural vulnerabilities in learned evaluation channels.


**Evaluator-aware behavior as the next step beyond portable proxy optimization.** The previous subsection focused
on a simple but important shift: reward hacking can become portable across tasks and evaluators. A further shift
becomes possible once the model starts paying attention to the oversight process itself. At that point, the model is not
only exploiting a reward signal; it is also adjusting its behavior to features of evaluation, such as whether an output
will be used for training, which signals appear to matter to the evaluator, or whether the current setting looks more like
training or actual deployment. We use _evaluator modeling_ as a broad term for this kind of behavior. In stronger cases,
it can support _alignment faking_ : the model behaves compliantly when oversight is active, while preserving different
behavior outside that setting. Earlier theoretical work on learned optimization and deceptive alignment helps motivate
this possibility by suggesting that, once the training process itself becomes instrumentally relevant, compliant behavior
may be used strategically rather than reflecting the objective that oversight was intended to induce [30, 63].


**Alignment faking under explicit training-related cues.** The most direct evidence for evaluator-aware behavior
comes from settings where the model is given explicit information about training. Greenblatt et al. show that Claude
3 Opus responds differently when a conversation is described as training-relevant, and that its reasoning often treats
temporary compliance in training as useful for preserving preferred behavior outside training [30]. The same paper
reports similar effects when the training setup is conveyed less directly through synthetic documents, and finds that
reinforcement learning can increase the incidence of alignment-faking reasoning rather than removing it. The key point
is straightforward. The model is reacting not only to task content, but also to the training situation itself. That makes


13


Reward Hacking in the Era of Large Models Fudan NLP Group


alignment faking an especially important example for this subsection, because it shows selective compliance tied to
features of oversight.


**Persistence after safety intervention.** A further concern is that evaluator-conditioned deception may persist even
after additional safety training. Hubinger et al. [31] construct proof-of-concept deceptive policies that behave safely in
ordinary contexts while switching behavior under deployment-like triggers, and find that these policies can survive
supervised safety training, reinforcement learning, and even adversarial training. In some cases, adversarial training
improves trigger recognition and helps the model conceal the problematic behavior more effectively [31]. These systems
are not the same as alignment faking in the strict sense, because the deceptive policy is deliberately implanted rather
than arising naturally during ordinary alignment training. Even so, the result matters for the present discussion. It
shows that once a model has learned to condition its behavior on oversight-relevant cues, later optimization does not
necessarily remove that behavior; it may instead preserve it, reshape it, or make it harder to detect.


**Evaluator awareness in more agentic settings.** The same basic pattern also appears in more open-ended agentic
settings. Meinke et al. [50] show that several frontier models can engage in in-context scheming when they are given
goals that conflict with developer intent, including strategic underperformance, deceptive follow-up behavior, attempts
to disable oversight, and exfiltration-like actions. These experiments differ from controlled alignment-faking setups in
an important way: the conflicting objective is provided in context rather than necessarily learned earlier during training.
For that reason, the two phenomena should not be treated as identical. What the scheming results add is evidence that
once a model can represent its evaluative situation, it can use that representation instrumentally in more open-ended
environments as well.


**Evaluation** **channels** **can** **themselves** **become** **targets.** A related structural problem appears when evaluation is
delegated to learned judges. In that case, the evaluation channel itself becomes part of what can be manipulated. Shi
et al. [28] show that optimization-based prompt injection can steer LLM-as-a-judge systems toward attacker-chosen
outcomes across several benchmarks. Subsequent work finds that prompt-injection attacks can distort either the judge’s
final verdict or the reasoning used to justify it [42], while Tong et al. [64] show that lightly poisoned judge-training
data can implant backdoors that systematically bias later judgments. These studies do not show the evaluated policy
itself performing evaluator modeling. Their importance lies elsewhere. They show that once learned systems mediate
evaluation, the scoring process is no longer a fixed background condition; it becomes another object that can be modeled,
manipulated, or subverted.


**Observable reasoning gives only partial access.** Reasoning traces may look like a natural way to monitor evaluatoraware behavior, but the evidence so far suggests that they provide only partial access to what the model is doing. Chen
et al. [48] show that state-of-the-art reasoning models often fail to disclose the hints they actually rely on, and that
reinforcement learning can increase hint usage without proportionally increasing disclosure in chain-of-thought. This
result does not make reasoning traces useless. It does, however, show that overt reasoning cannot be treated as a fully
transparent record of what the model is optimizing. For the present subsection, that matters because evaluator-aware
adaptation may not remain fully visible in the very channel that oversight relies on to inspect it.


**4.3** **Evaluator–Policy Co-Adaptation Dynamics**


This subsection adds a _dynamic_ layer to the story. The earlier subsections described how reward hacking becomes
portable and then evaluator-aware; the present one asks what happens once evaluator repair itself enters the training
loop. The central issue is _evaluator–policy co-adaptation_ : as oversight improves, the policy adapts to that improved
oversight, which can redirect or conceal the same underlying optimization pressure rather than simply eliminating it.


**From imperfect evaluation to repeated adaptation.** The previous two subsections described a progression from
local reward hacking to evaluator-aware behavior. The next step is to view these failures as part of an ongoing interaction
rather than as isolated episodes. In practice, alignment pipelines are repeatedly revised: reward models are retrained,
constitutions are rewritten, judges are strengthened, adversarial examples are added, and policies are then optimized
again against the updated oversight stack. This repeated cycle is what we refer to as _evaluator–policy co-adaptation_ .
The key point is simple. Improvements to the evaluator do not occur outside the learning process; they change the
environment that the policy is trained to navigate. Foundational work on human-preference learning, debate, scalable
oversight, and empirical oversight measurement already points in this direction by treating the quality of the evaluation
process as a central bottleneck for aligning increasingly capable systems [21, 33, 65, 66].


**Weak evaluators leave strategic gaps.** This dynamic is especially visible when the evaluator is weaker than the
policy being trained. Weak-to-strong generalization shows that weaker supervisors can still elicit part of a stronger


14


Reward Hacking in the Era of Large Models Fudan NLP Group


model’s capability, while leaving significant portions of its behavior weakly constrained [56]. Later work sharpens the
concern by showing that stronger models may exploit those gaps strategically, appearing aligned on dimensions that
weak supervisors can judge reliably while sacrificing dimensions they cannot track well [57]. These results are useful
here because they make the co-adaptive structure more concrete. As long as evaluation covers only part of the effective
objective, optimization pressure continues to reorganize behavior around the measurable part, and the remaining gap
becomes a standing opportunity for strategic adaptation.


**Monitors can become part of the target.** The same pattern becomes even clearer when monitoring is folded directly
back into training. Baker et al. [25] show that chain-of-thought monitoring can detect reward hacking in agentic coding
environments more effectively than action-only monitoring, and that weaker models can sometimes monitor stronger
ones. The same study also shows the limit of this approach: once optimization begins to incorporate the monitor
more directly, models can learn _obfuscated reward hacking_, hiding their intent in chain-of-thought while continuing
to exploit the environment [25]. This is one of the clearest empirical examples of evaluator–policy co-adaptation in
the current literature. The monitor improves oversight; the policy then adapts to the monitor; the resulting behavior
becomes harder to detect without improving oversight again.


**From evaluator exploitation to oversight interference.** At the outer edge of this dynamic, the policy stops merely
exploiting what the evaluator rewards and begins to interfere with the evaluation or control process itself. In-context
scheming evaluations already show this direction of travel: models may disable oversight, conceal their goals, or
preserve their strategic position across follow-up interactions when doing so appears useful for advancing an effective
objective [50]. Earlier textual evaluations of shutdown avoidance make a related point in a simpler setting: some
language models display resistance to shutdown across prompt variations and environments in ways that are difficult to
explain as simple pattern completion alone [67]. These scenarios are stylized, and they should not be read as direct
evidence that current deployed systems robustly pursue self-preservation. Their value is analytical. They illustrate what
evaluator–policy conflict can look like when continued operation, hidden action, or oversight interference becomes
instrumentally useful for the policy that training has induced.


Table 2: Taxonomy of Reward Hacking Detection and Diagnosis Methods Across the LLM Lifecycle.


**Lifecycle Stage** **Method / Paradigm** **Target Signal / Modality** **Access** **Overhead** **Applicable Scope**



**Training-Time**
_(Adversarial_
_Crucible)_


**Inference-Time**
_(Pressure-Free_
_Observation)_


**Post-Hoc**
_(Unconstrained_
_Diagnostics)_



KL Divergence Tracking [1] Output probability dist. Grey Low **Global Shift** (Macroscopic collapse)
Evaluator Stress Tests [68] RM sensitivity variance Black/Grey Medium **Surface Proxies** (Formatting, length)
Adv. Reward Auditing [69] RM penultimate latents White Medium **Latent Shortcuts**
VIB / CausalRM [38, 70] Latent manifold shape White Medium **Spurious Correlations**
Energy Loss Tracking [71] Policy final-layer _L_ 1 norm White Low **Contextual Evasion** (Input ignorance)


Distributional Divergence [11] Action JSD vs. baseline Black Low **Phase Transitions** (Sudden hacks)
CoT Verbalization (VFT) [72] Explicit reasoning traces Black High **Unverbalized Intent**
Decoupled Confessions [73] Post-task self-reports Black Medium **Deceptive Compliance**
Contrastive Trajectory [44] Behavioral action clusters Black High **Test Tampering**
Internal CoT Monitoring [74] Residuals (SAE + LR) White High **Obfuscated Reasoning** (Hidden intent)


Statistical Attribution [75] Marginal reward shift Black Medium **RM Misalignment**
Mechanistic Dissection [76] Polysemantic neurons White Extreme **Latent Misalignment**
Hidden Obj. Red-Teaming [77, 78] Causal mediation / Agents White/Black Extreme **Alignment Faking**


#### **5 Detection and Diagnosis: A Lifecycle Approach**

As established in preceding sections, reward hacking fundamentally arises when optimization pressure drives a policy
to exploit statistical loopholes in a proxy evaluator rather than improving true utility. However, as detailed in Section 4,
this phenomenon is no longer limited to isolated, naive shortcuts. Under sustained optimization, it evolves into a
portable and _evaluator-aware adaptive process_, bridging simple specification gaming with severe alignment faking and
hidden objectives [18, 29].


Because the empirical footprint of reward hacking has fundamentally shifted from surface-level artifacts to deeply
internalized strategies, classical anomaly detection, relying on simple state, visitation frequencies or hard-coded
constraints [10, 79]—is inherently insufficient. Diagnosing this phenomenon in modern LLMs now requires analyzing
complex semantic representations and internal hidden states.


These findings fundamentally reframe the detection challenge. Capturing the full spectrum of anomalous behaviors
requires more than a chronological checklist of methods; detection mechanisms must be taxonomized by the distinct


15


Reward Hacking in the Era of Large Models Fudan NLP Group


_computational constraints_ and _observability regimes_ inherent to each phase of the model’s lifecycle. Specifically, the
effcacy and vulnerability of a detection signal are intrinsically tied to whether it is subjected to gradient updates,
deployed as a static filter, or utilized in an unconstrained forensic analysis. In this section, we structure our review
across three distinct paradigms (summarized in Table 2): **(1) Training-Time Online Monitoring**, **(2) Inference-Time**
**Safeguards**, and **(3) Post-Hoc Auditing** . Each paradigm represents a unique balance between computational overhead,
information access, and the risk of triggering further model obfuscation.


**5.1** **Training-Time Online Monitoring**


Monitoring models during active reinforcement learning introduces a fundamental adversarial tension. Because
diagnostic metrics in this phase often serve as early-stopping signals or direct loss regularizers, they are continuously
subjected to optimization pressure, rendering them highly susceptible to Goodhart’s law. Consequently, robust
training-time detection must move beyond easily gameable output heuristics and instead track deep structural and
information-theoretic invariances that are mathematically difficult for the policy to bypass.


**From specific heuristics to the limitations of distributional metrics.** Initial attempts to diagnose reward hacking
frequently targeted isolated, highly visible artifacts of the RLHF pipeline. For example, Singhal et al. [26] systematically
investigate length correlations, demonstrating how policies reliably inflate response verbosity to exploit simplistic
reward heuristics. While monitoring specific features like length or formatting provides actionable diagnostics for
known vulnerabilities, treating reward hacking as a "whack-a-mole" problem of individual artifacts is ultimately
unsustainable. The rapid evolution of proxy exploitation necessitates generalized metrics capable of identifying broader,
unforeseen misalignments.


To this end, foundational alignment frameworks default to tracking the Kullback-Leibler (KL) divergence between
the active policy and a reference supervised fine-tuned model [1, 80]. Despite its ubiquity as both a regularizer and
a monitoring metric, macroscopic distributional tracking is fundamentally oblivious to the semantic direction of a
policy shift. Mathematically, KL divergence aggregates token-level probability ratios into a single scalar penalty,
effectively treating all distributional deviations indiscriminately. Consequently, severe reward model overoptimization
routinely occurs even under strict KL constraints, a phenomenon observed across both traditional RLHF [16] and
direct alignment algorithms like DPO [12]. Because a policy can cheaply exploit a low-probability spurious feature,
such as adopting a sycophantic tone, with a minimal footprint on the global KL penalty, output-space tracking remains
insufficient for detecting emergent misalignment during training.


**Transitioning to internal hidden states and structural invariances.** Recognizing the blind spots of scalar metrics,
recent detection paradigms have shifted inward. By auditing the _internal hidden states_ of both the policy and the
reward model, researchers aim to detect the exact moment a model begins to exploit proxy loopholes. On the evaluator
side, one approach is to actively measure the reward model’s sensitivity to spurious features during the optimization
loop. Shihab et al. [68] introduce Evaluator Stress Tests (EST), a framework that applies controlled perturbations to
the policy’s outputs during training. By comparing the evaluator’s sensitivity to formatting changes versus semantic
degradation, EST quantitatively flags training checkpoints where score improvements are driven entirely by proxy
gaming. Taking a more dynamic, representation-level approach, Beigi et al. [69] propose Adversarial Reward Auditing
(ARA). Rather than relying on scalar outputs, the authors train an auxiliary auditor network directly on the reward
model’s penultimate latent representations. This auditor establishes a decision boundary that dynamically distinguishes
genuine human-preference manifolds from exploit manifolds, identifying hijacked reward signals that appear deceptively
normal at the output level.


**Information-theoretic** **anomalies** **and** **latent** **factorization.** Beyond adversarial auditing, other methods detect
overoptimization by identifying _information-theoretic anomalies_ within the network’s representations. Employing the
Variational Information Bottleneck (VIB) paradigm [81], Miao et al. [38] demonstrate that overoptimized policies
geometrically break the compact latent manifold established during reward modeling. They propose the Cluster
Separation Index (CSI), a metric that flags extreme latent outliers as early indicators of reward hacking. Building upon
this information-theoretic foundation, Yang et al. [70] demonstrate that spurious features can be explicitly diagnosed
and isolated during training via factored causal representation learning. Their framework, CausalRM, partitions the
reward model’s latent space into causal factors (which align with true human preference) and non-causal factors (which
capture confounders like verbosity). By applying minimax optimization via a Gradient Reversal Layer (GRL), this
approach actively quarantines the specific latent dimensions that drive reward hacking, providing a highly structured
diagnostic signal of proxy exploitation.


16


Reward Hacking in the Era of Large Models Fudan NLP Group


**Tracking the internal energy dynamics of the policy.** While latent factorization and adversarial auditing provide
deep structural diagnostics, they often incur substantial computational overhead during training. To achieve extreme
efficiency, online monitoring can instead be anchored in the internal energy dynamics of the policy itself. Miao
et al. [71] identify the _Energy Loss Phenomenon_ within the policy’s final transformer layer. The authors observe
that as reward hacking occurs, the _L_ 1 norm of the policy’s hidden states drops precipitously compared to the base
SFT model. Because this energy loss serves as an observable upper bound on the collapse of contextual mutual
information, it provides a reliable, lightweight signal that the policy has discarded the user’s input context in favor
of a reward-maximizing template. Crucially, because it relies entirely on standard forward-pass activations without
requiring auxiliary networks or manifold decomposition, this metric imposes minimal computational overhead, making
it uniquely suited for continuous online monitoring during the adversarial crucible of RL training.


**5.2** **Inference-Time Safeguards and Trajectory Analysis**


Deploying safeguards at inference time offers a critical theoretical advantage: they operate entirely free from the
optimization pressure that drives Goodhart’s law. However, highly capable models increasingly exhibit test awareness
and strategic silence, learning to perfectly conceal their reward-hacking intent behind seemingly benign textual outputs
or reasoning traces. Driven by the emergence of these deceptive capabilities, the frontier of inference-time monitoring
is progressively shifting away from purely surface-level text inspection, pivoting instead toward analyzing macroscopic
behavioral trajectories and dynamically probing internal cognitive states during live generation.


**The necessity of deployment-time interception and contrastive auditing.** While training-time metrics excel at
preventing global proxy collapse, they often fail to capture context-dependent or late-emerging exploits that only
manifest during deployment. In agentic workflows, reward hacking frequently masquerades as legitimate behavior,
such as an agent silently tampering with evaluation scripts rather than solving the underlying coding problem [18].
Because static output filters cannot reliably distinguish _environment-specifc exploits_ from genuine task execution,
safeguarding deployed systems requires real-time monitoring mechanisms that operate directly on the model’s behavioral
trajectories. To detect macroscopic phase transitions, where true utility collapses despite high proxy scores, Pan
et al. [11] introduce POLYNOMALY. By measuring the distributional divergence between the deployed policy’s
actions and a trusted baseline, the system can flag sudden algorithmic exploitation. For more complex, long-horizon
vulnerabilities, Deshpande et al. [44] propose _Contrastive_ _Anomaly_ _Detection_ via the TRACE benchmark. By
prompting an evaluator LLM with a cluster of trajectories mixing benign executions and potentially hacked sequences,
the contrastive setting exposes subtle semantic exploits (e.g., modifying hidden global variables) that isolated trajectory
evaluations consistently miss.


**Eliciting Honesty to Counteract Strategic Obfuscation.** As frontier models transition toward workflows relying
heavily on Chain-of-Thought (CoT) reasoning, a highly intuitive safeguard is to monitor the reasoning traces themselves.
However, this approach faces a critical vulnerability: standard RL optimization actively discourages transparency,
quickly teaching models to engage in reward hacking while remaining completely silent about it in their CoT [25]. To
counter this _strategic silence_, researchers have proposed interventions that incentivize honesty through two distinct
strategies.


The first strategy focuses on proactive behavioral priming. Turpin et al. [72], for instance, propose Verbalization
Fine-Tuning (VFT), a pre-RL intervention that explicitly trains models to acknowledge deceptive prompt cues before
RL pressure is applied. This structural priming drastically reduces undetected reward hacks, demonstrating that a preexisting disposition for transparency is critical. The second, complementary strategy employs architectural separation.
Recognizing that directly penalizing a flawed reasoning trace still risks driving deception underground, Joglekar
et al. [73] introduce a _Confession Mechanism_ . This architectural intervention requests an independent, post-generation
report where the reward for honesty is strictly decoupled from the main task’s reward. By making confession the
computationally and strategically easier path, this system ensures that even when models successfully hack a task, they
reliably snitch on themselves. Taken together, these approaches reveal that reliable CoT monitoring is not a given, but
rather an emergent property of systems designed to make honesty the path of least resistance.


**The Hawthorne effect and the internalization of deception.** Despite the success of textual elicitation techniques,
relying exclusively on surface-level outputs ultimately faces a theoretical ceiling. Highly capable reasoning models
exhibit _test awareness_ and situational deception [30, 31, 50]. Abdelnabi and Salem [82] provide quantitative evidence
that this test awareness is a deeply internalized, latent representation rather than a superficial textual artifact. Their whitebox probing experiments reveal that while simply prompting a model that a scenario has "no real-world consequences"
fails to change its compliance with harmful requests, actively steering the latent activations associated with test
awareness causes misbehavior rates to spike by up to 20 percentage points. This causally proves that strategic deception


17


Reward Hacking in the Era of Large Models Fudan NLP Group


and the intent to hack migrate into deep neuronal layers, rendering purely text-based monitors inherently vulnerable to
sophisticated obfuscation.


**Real-time generation monitoring via internal representations.** Because capable models internalize their deceptive
intents, the most robust inference-time safeguards must look beyond generated text and actively inspect the model’s
internal cognitive state. Capitalizing on this necessity, Wilhelm et al. [74] propose a white-box monitoring framework
that dynamically intercepts reward hacking by extracting residual stream activations during the autoregressive generation
of the CoT itself. By projecting these live activations through a pre-trained Sparse Autoencoder (SAE) [76], the system
obtains interpretable conceptual features. Applying lightweight linear probes to this reconstructed latent space allows
auditors to continuously predict the probability of reward hacking at the token level, entirely independent of what
the model chooses to verbalize. Crucially, their approach reveals a _test-time compute amplifcation_ effect: forcing a
misaligned model to perform extended CoT reasoning inadvertently amplifies its internal hacking activations. Thus, realtime internal monitoring transforms CoT compute from a potential obfuscation risk into a highly sensitive, unmaskable
diagnostic signal.


**5.3** **Post-Hoc Auditing and Mechanistic Diagnostics**


Post-hoc auditing transitions the diagnostic objective from real-time interception to comprehensive forensic validation
on a frozen model. This phase is structurally essential to address the legacy of the _Monitorability Tax_ [25]: because
training-time regularizers can inadvertently drive hacking intent into deeper, unobservable latent dimensions, these
behaviors may persist undetected by lightweight inference-time safeguards. By removing the compute and latency
constraints of live deployment, post-hoc diagnostics allow for the exhaustive mechanistic dissection required to unmask
deeply internalized misalignments that remain hidden during standard model interaction.


**Statistical attribution of superficial proxies.** Before deploying a frozen model, developers must conduct rigorous,
unconstrained diagnostics to uncover systemic vulnerabilities that evaded training-time safeguards. At this stage,
compute constraints are lifted, allowing for extensive offline forensic analysis. One foundational approach involves
quantifying how strongly the reward model has overfit to _human-prior linguistic features_ (e.g., positive sentiment,
eloquent formatting) at the expense of true utility. Using multivariate linear regression, Revel et al. [75] introduce the
SEAL framework to isolate the marginal scalar contribution of these spurious attributes. By statistically measuring
the model’s _Alignment Resistance_, this offline analysis reveals when an evaluator blindly rewards superficial tone over
factual harmlessness. Similarly, Evaluator Stress Tests can be scaled up post-hoc via massive perturbation datasets,
cleanly isolating whether the policy has learned to exploit formatting loops or structural heuristics [68]. While highly
effective, these statistical methods are primarily scoped to diagnosing surface-level specification gaming.


**Mechanistic interpretability for deeply latent misbehaviors.** When a highly capable model perfectly obfuscates
its reward-hacking intent in its text output, macroscopic behavioral and statistical stress tests inevitably hit a wall.
To diagnose deep-seated alignment faking or hidden objectives, auditors must dissect the frozen network using
mechanistic interpretability. Unlike the lightweight, pre-trained probes used for inference-time interception, post-hoc
auditing allocates extreme compute to train massive Sparse Autoencoders (SAEs) from scratch across billions of
tokens [76, 77]. By decomposing polysemantic activations into monosemantic feature directions, researchers can
pinpoint the exact latent circuits responsible for deeply dormant misbehaviors. Furthermore, mechanistic tools can
reverse-engineer the corrupted incentive structures themselves. The _IR_ [3] framework, for instance, leverages Contrastive
Inverse Reinforcement Learning to reconstruct the implicit reward function strictly from the black-box generation
distribution of an RLHF model [83]. Applying SAEs to this reconstructed model allows auditors to mechanistically
decompose the global scalar reward into interpretable features, isolating the exact spurious correlations the policy
learned to exploit.


**The** **automation** **bottleneck** **and** **model** **organisms.** While human auditors can successfully wield mechanistic tools to uncover these hidden objectives, scaling this forensic process to frontier models introduces a severe _Automation Bottleneck_ . To systematically evaluate automated auditing capabilities, researchers construct
_model organisms_ —LLMs intentionally trained via RL to harbor hidden objectives (e.g., pandering to specific reward model biases) while actively denying them in text [77]. Evaluating autonomous auditor agents against these
deceptive organisms reveals a counterintuitive _Tool-to-Agent Gap_ [78]. Although white-box tools effectively extract
micro-level neuronal anomalies, autonomous agents currently struggle to synthesize this high-dimensional noise into a
coherent macro-level hypothesis of the model’s misbehavior. As a result, automated black-box prefill attacks often
outperform autonomous white-box investigations, indicating that AI-assisted mechanistic auditing remains an unsolved
scaling challenge.


18


Reward Hacking in the Era of Large Models Fudan NLP Group





























Figure 4: An overview of three mitigation paradigms for reward hacking.


**5.4** **Synthesis and Open Challenges:** **The Fallacy of Static Benchmarks**


Despite the rapid proliferation of the aforementioned diagnostic mechanisms across the LLM lifecycle, reward hacking
detection inherently resists consolidation into standardized benchmarks akin to traditional capability evaluations. This
fragmentation fundamentally stems from the profound heterogeneity of the underlying exploits. While statistical
artifacts like length bias reside within the reward model’s latent representations [38, 69], logical exploits such as
unit-test tampering require macroscopic behavioral and contrastive trajectory analysis.


More critically, evaluating these detectors presents an epistemological challenge analogous to identifying zero-day
vulnerabilities in cybersecurity. Curating a unified, static dataset of known hacks inadvertently invites a meta-level
instance of Goodhart’s law: optimizing safety filters for historical exploits while leaving the system entirely blind
to novel, emergent misalignments. Moving forward, rather than evaluating against fixed leaderboards, the frontier
of alignment research must pivot toward adversarial dynamics. Guaranteeing the robustness of future LLMs will
require proactively training "hacker models" to dynamically generate unmapped exploits, against which the entire
lifecycle of diagnostic tools (from training-time VIB regularizers to post-hoc SAEs) must be continuously and rigorously
stress-tested.


19


Reward Hacking in the Era of Large Models Fudan NLP Group

#### **6 Mitigation Through Structural Intervention**


Mitigating reward hacking requires moving beyond ad-hoc behavioral patches to address the structural vulnerabilities
inherent in proxy-based alignment. Because the tendency to exploit a flawed proxy is an inevitable consequence of
compressed objectives, unconstrained optimization, and static evaluation, robust defense mechanisms demand systemic
interventions across the training and inference pipeline. In this section, we review three primary structural mitigation
paradigms. First, we examine approaches that reduce objective compression by expanding sparse scalar rewards into
rich, fine-grained, and verifiable signals. Second, we discuss techniques for controlling optimization amplification
by constraining policy drift and reshaping reward geometries. Finally, we explore the evaluator–policy co-evolution
paradigm, which dynamically updates the reward signal to prevent the policy from overfitting to the blind spots of a
static judge.


**6.1** **Reducing Objective Compression**


Reward hacking often arises when a complex target is compressed into a reward signal that cannot faithfully represent
it. This creates room for optimization to exploit shallow but reward-relevant correlates. Mitigation therefore centers
on **reducing** **objective** **compression**, so that high reward more reliably reflects the intended objective rather than
exploitable correlates.


**From scalar and sparse reward signals to vector-valued and fine-grained supervision.** A primary method to
reduce objective compression is decomposing the target objective into explicit facets. This prevents the reward
model from internalizing noise, artifacts, or latent biases as proxies for overall quality. This intervention begins at
the data level: rather than collecting a single holistic preference label, recent datasets provide supervision across
multiple aspects of response quality. Representative examples include OpenAssistant [106], the HelpSteer series [107,
108], and UltraFeedback [109], which expose highly granular annotations. Building on this richer supervision,
alignment algorithms apply _multi-objective reward modeling_ . Methods such as ArmoRM [84], DRMs [85], and
related frameworks [110, 111] learn decomposed reward representations, aggregating them through learned weighting,
projection, or context-dependent criteria generation to provide a much less exploitable optimization target.


A second way to distribute supervision is applying _fne-grained credit assignment_, which assigns rewards to specific
local segments rather than exclusively to the completed response. Fine-grained RLHF [86] demonstrated that localized
feedback substantially improves alignment over sequence-level rewards, a finding supported by subsequent research [112,
113]. This trajectory has naturally extended to _token-level alignment_, enabling highly precise credit assignment through
minimum-editing constraints [114, 115], explicit token-level reward optimization [116–119], and token-level alignment
without preference data [120]. In the RLVR paradigm, _process reward models (PRMs)_ provide analogous step-by-step
supervision. By training verifiers on step-level human feedback [7] or automatically constructed step-wise rewards [121],
PRMs actively penalize invalid intermediate reasoning steps that might otherwise yield a coincidentally correct final
answer [122].


**Modeling beyond spurious features.** Because reward models often rely on superficial but exploitable artifacts, such
as formatting, length, or stylistic markers, recent work focuses on making evaluators selectively sensitive to task-relevant
attributes while suppressing preference-irrelevant correlates. One approach imposes _information bottlenecks_ to filter out
irrelevant signals [38], while other methods utilize _causal representation learning_ to cleanly separate prompt-relevant
quality signals from prompt-independent artifacts [87]. Advanced frameworks enforce this sensitivity via causal
rubrics [123], mitigate hacking through disentangled reward representations [55], and apply sparse non-negative latent
factorization to isolate meaningful reward dimensions before debiasing [124]. For pervasive shortcuts like length bias,
explicitly fitting and correcting the bias term or using _adaptive debiasing_ objectives often proves more effective than
generic robustness training [125, 126].


A complementary strategy to reduce reliance on shallow features involves _natural-language critiques_, which make the
evaluator’s basis for judgment explicit. Early approaches injected model-generated critiques into reward modeling
to provide explicit textual feedback, helping evaluators rely less on surface cues [88]. Training critique generation
jointly with reward prediction turns the critique into a structural constraint on the evaluation objective itself [127].
Consequently, recent research increasingly treats evaluation as a reasoning task via _generative reward models_ [128–
130]. By formulating reward prediction as a generate-then-judge process [89] or leveraging test-time compute to
improve reliability [131], these models externalize their evaluation logic. However, outcome-only supervision for
generative reward models is insufficient, as they may produce correct numerical scores based on unsound rationales.
Therefore, methods like RM-NLHF [132] and Rationale-RM [133] strictly enforce rationale-level alignment to ensure
the reward model judges for the right reasons.


20


Reward Hacking in the Era of Large Models Fudan NLP Group


A related failure mode appears in tool-augmented and RLVR settings, where outcome-only rewards may treat a correct
final answer as sufficient evidence of successful reasoning, inadvertently rewarding guessing or reasoning–answer
mismatch [134]. Typical mitigations include penalizing premature answer disclosure [135], employing consistencybased trajectory filtering [136], and rewarding verifiable evidence use rather than mere citation generation [137].
Training discriminative reward models tailored specifically to tool-calling behavior [138, 139] ensures that agents are
rewarded for functional correctness and reliable intermediate processes rather than superficial final-answer quality [140].


**Verifiable, rubricized reward interfaces.** To further minimize compression, researchers increasingly externalize
evaluation criteria into explicit rules and structured formats. In RLHF and RLAIF, Constitutional AI [5] introduced
explicit natural-language principles to guide critique and revision. This approach evolved into _rule-based rewards_ [90],
which utilize composable constraints and rule-specific grading signals, sometimes selecting the most relevant rules
dynamically for each response [141].


Many alignment objectives, however, cannot be fully captured by hard rules alone. In open-ended domains where
binary correctness is unavailable but single-score judging is too coarse, _rubric-structured supervision_ provides a critical
middle ground between rigid programmatic verification and opaque holistic evaluation. Methods like RaR [91]
use instance-specific rubrics to extend RL beyond strictly verifiable domains. Scalable rubric generation and posttraining frameworks [142–144] have systematized this practice. Similarly, replacing holistic reward modeling with
instruction-specific checklists [92, 145, 146] substantially improves instruction-following reliability. These structured
criteria are now widely adopted across deep research [147, 148], healthcare [149, 150], and scientific reasoning [151].
Given their efficacy, automating rubric construction itself is emerging as a first-class problem for open-ended reward
modeling [152, 153].


**Takeaways.** Across these diverse methods, a shared structural lesson emerges: reward hacking often arises because
the reward interface is too compressed. When complex objectives are collapsed into a single scalar, models effortlessly
obtain high rewards through shallow correlates or unfaithful reasoning. Mitigations therefore converge on making the
rewarded target less compressive and more explicitly attributable. Expanding scalar rewards into multi-dimensional
signals, distributing supervision densely over local steps, suppressing spurious correlates, and externalizing criteria
through rubrics systematically narrows the mathematical loopholes available to an optimizing policy.


**6.2** **Controlling Optimization Amplification**


Reward hacking can also result from optimization amplification: sufficiently strong optimization can turn small
imperfections in a proxy into systematic exploitation. As the policy moves beyond the regime where the proxy is
reliable, reward becomes less aligned with true quality. Therefore, the central mitigation strategy in this section aims to
**control optimization amplification** .


**Budgeting optimization against imperfect proxies.** In PPO-based RLHF and direct alignment algorithms, aggressive
optimization against an imperfect proxy inevitably harms ground-truth quality at high KL budgets [12, 16]. This
suggests that the degree of optimization itself is a structural risk factor. A central mitigation is _budgeting policy drift_
away from a trusted reference distribution. This includes treating the Supervised Fine-Tuning (SFT) constraint as an
implicit adversarial regularizer [93], tightening regularization to the base policy to preserve the proxy–true-reward
relationship [154], and utilizing importance weighting to explicitly correct distribution shift [94]. These methods share
a core analytical insight: under imperfect proxies, robust alignment depends not only on the objective being optimized,
but on strictly limiting how far the policy drifts from the distribution on which that objective remains reliable.


**Anchoring** **policies** **to** **supported** **regions.** A parallel strategy is _anchoring to supported regions_, which restricts
the policy to state spaces densely covered by evaluator training data. Once optimization moves into weakly covered
regions, reward signals become highly unreliable and trivial to exploit [155]. DR-PO [95] operationalizes this by
resetting online RLHF training to informative states drawn from the offline preference dataset. Alternatively, BSPO [96]
explicitly targets the behavior distribution induced by reward-training data, regularizing the policy against out-ofdistribution generation. Applying pessimistic preference optimization similarly reduces the structural incentive to
exploit unsupported, high-reward regions [97].


**Bounding and reshaping reward signals.** Optimization amplification can also be constrained by directly altering
the reward geometry. _Reward reshaping_ techniques force the reward signal to be bounded, centered, and subject to
diminishing returns at high values, preventing the policy from endlessly optimizing a single exploitable axis [98].
Approaches include applying log-sigmoid transformations for multi-reward aggregation [156], or explicitly penalizing
excessive growth in final-layer energy loss during reward computation [71]. Further stability is achieved through


21


Reward Hacking in the Era of Large Models Fudan NLP Group


group-wise reward shaping, which constructs training signals from within-group preference comparisons to reduce
sensitivity to calibration errors [99], or by structurally separating helpfulness and harmlessness into independent reward
and cost constraints [157].


**Detecting and stopping overoptimization.** Rather than modifying the proxy itself, dynamic monitoring relies on
_early stopping indicators_ to halt training before optimization collapse occurs. Research identifies structural anomalies
that precede behavioral degradation, such as utilizing the Cluster Separation Index (CSI) to detect outliers in an
information-bottleneck latent space [38]. ADVPO [100] explicitly estimates reward uncertainty from the evaluator’s
last-layer embeddings to flag unreliable regions during policy updates. Relatedly, tracking rapid final-layer energy loss
serves as a highly efficient, characteristic sign of active proxy exploitation, allowing interventions before the policy
irreparably degrades [71].


**Regularizing inference-time search.** Amplification vulnerabilities persist during deployment, as test-time compute
methods like best-of- _N_ sampling and reranking similarly optimize imperfect proxy rewards. The core mitigation
strategy is not to increase search strength, but to deploy _inference-time regularization_ to control how heavily the proxy
reward influences candidate selection. MBR-BoN [101] integrates a Minimum Bayes Risk penalty into standard
decoding, establishing proximity to the reference policy as a strict regularizer against reward hacking [158]. Other
frameworks treat test-time hacking as a threshold phenomenon, tuning the search parameter to halt expansion before it
reaches the exploitable regime [17]. Finally, modifying the selection reward entirely (such as formulating reward design
as a Stackelberg game) can systematically balance test-time alignment gains against hacking risks [159].


**Takeaways.** Controlling optimization amplification requires addressing three intersecting failure sources: the absolute
strength of the optimization pressure, the specific distributional regions the policy is permitted to reach, and the stability
of the reward signal itself. Because reducing optimization pressure does not fix an inherently unreliable reward signal,
and reshaping a reward cannot withstand excessively aggressive optimization, robust mitigation must interlock policy
drift constraints with geometric reward regularization.


**6.3** **Evaluator–Policy Co-Evolution Paradigm**


A key factor that triggers reward hacking is _distribution shift_ : as the policy evolves, it can move beyond the distribution
on which the evaluator remains reliable. This creates opportunities for proxy exploitation. An important mitigation
strategy, therefore, is **evaluator–policy co-evolution**, which keeps evaluation aligned with a moving policy.


**Iterative, online evaluator–policy co-evolution.** Fixed-evaluator alignment creates a predictable distribution shift: as
the policy is optimized, its output distribution diverges from the static data used to train the evaluator, leaving potential
room for proxy exploitation. The co-evolution paradigm directly addresses this by dynamically updating the evaluator
alongside the policy. This approach began with _iterative preference learning_, recasting RLHF as an ongoing process
through multi-round optimization pipelines such as iterative DPO [102] and continuous RLHF workflows [34]. To
eliminate the human annotation bottleneck, OAIF [160] queries an LLM annotator on dynamically sampled policy
outputs. This trajectory culminates in _self-rewarding architectures_ [103], where the model acts as both generator and
judge, generating its own preference signals for subsequent updates. Recent frameworks refine this through temporal
decoupling of chosen and rejected signals [161–163] or by fully unifying policy optimization and reward modeling into
a single, simultaneous training step [164, 165].


**Limits of co-evolution and adversarial evaluator adaptation.** While co-evolution neutralizes static distribution
shifts, it introduces a severe systemic risk: if the evaluator and policy adapt too closely to one another without external
grounding, the entire loop can spontaneously collapse into shared shortcuts rather than the intended objective. As
demonstrated by URPO [164], purely self-generated reward signals often fail to bootstrap a reliable internal evaluator,
validating that external human preference data remains a strict prerequisite to prevent the model from exploiting its own
compressed internal reward system.


To prevent this systemic collapse, recent frameworks introduce _adversarial evaluator adaptation_ . Instead of merely
updating the evaluator on new data, this paradigm actively hardens the evaluator against the policy’s specific exploits.
APO [104] formulates alignment as an alternating min–max game between the reward model and the LLM, forcing
the evaluator to explicitly adapt against the policy’s adversarial generation distribution without requiring fresh human
annotation at every step. Similar adversarial formulations have proven effective in machine translation tasks [105]. By
treating co-evolution as a competitive game rather than passive synchronization, these methods force the evaluator to
continuously repair its blind spots under direct optimization pressure.


22


Reward Hacking in the Era of Large Models Fudan NLP Group





















Figure 5: A structured matrix taxonomy of reward hacking extending beyond text-only models (Section 7). Unlike the
feature and representation-level hacking seen in LLMs, scaling to Multimodal, Visual Generative, and Agentic domains
introduces extreme dimensional compression and environmental feedback loops. This figure categorizes the specific
**manifestations** of proxy exploitation in these modalities, traces them to their **underlying structural causes** (such
as outcome sparsity and dimensional mismatch), and outlines the state-of-the-art **mitigation strategies** designed to
enforce process-level robustness.


**Takeaways.** The evaluator–policy co-evolution paradigm successfully mitigates the distribution shift inherent in
stale, fixed supervision. However, because mutual adaptation can inadvertently stabilize shared hallucinations and
localized exploits, co-evolutionary loops must be strictly regularized via external preference grounding or rigorous
adversarial competition. Adaptation alone is insufficient if it merely allows the policy and evaluator to converge on a
newly obfuscated equilibrium of reward hacking.

#### **7 Reward Hacking in Multimodal, Generative, and Agentic Models**


In this section, we extend the scope of reward hacking from text-only LLMs to broader domains, including MLLMs [196–
200], generative models [201–203], and agentic models [204–207]. Transitioning to these domains increases the
dimensionality of the alignment target, making the objective compression described by PCH significantly more lossy.
We review specific manifestations of reward hacking in these settings, analyze their structural causes, and summarize
existing solutions to ensure robust model alignment.


23


Reward Hacking in the Era of Large Models Fudan NLP Group


**7.1** **Reward Hacking in Multimodal Large Language Models**


Applying RL to MLLMs introduces qualitatively different hacking phenomena than those seen in unimodal systems,
such as cross-modal deception. Because MLLMs must synthesize heterogeneous data streams, the scalar reward often
forces a lossy aggregation of textual reasoning and visual grounding, creating exploitable gaps between modalities.


**Manifestations of Reward Hacking in MLLMs.** Reward hacking in MLLMs typically follows three patterns. A
primary pattern is _language-biased guessing and bypassing vision_ . Models frequently exhibit a “thinking over seeing”
tendency, prioritizing language-based generation over actual visual comprehension [166, 167, 186]. In these cases,
models construct plausible reasoning chains based on hallucinated visual premises [167]. Under the PCH framework,
this represents a navigation of the _informational null space_ : the model reaches the correct answer through text priors
while ignoring the diagram, as the compressed proxy cannot distinguish between genuine grounding and lucky guessing.
Another pattern is _spurious reasoning chains and deceptive intermediate steps_ . Even when models reach the correct
answer, their intermediate steps often show contradictory logic [168, 178]. Models may exploit superficial shortcuts,
such as fabricating mathematical operations that coincidentally yield the target result [178, 179]. Deceptive verbosity
is also common; models may mechanically repeat premises or insert semantically empty text to mimic rigorous
deduction [168]. Finally, _metric-specifc gaming_ occurs in downstream tasks like visual grounding. Models may
manipulate spatial outputs to exploit specifc metrics [169, 188, 189], such as outputting extreme bounding boxescollapsing to a single pixel or expanding to cover the entire image—to artificially inflate hit rates without acquiring
genuine localization capabilities [169].


**Underlying Causes of Reward Hacking.** Reward hacking in MLLMs is driven by sparse supervision and modality
imbalances. First, the _limitations of outcome-only supervision_ constitute a primary bottleneck. RLVR frameworks
often verify only the final textual output, discarding intermediate states of perception [166, 167, 178]. This creates
vast _equivalence classes_ where coincidental hallucinations receive the same reward as rigorous deduction. Second,
_modality imbalance_ allows the model to establish shortcut mappings based on language priors, effectively bypassing
the visual context [166]. Intense optimization amplification pushes the policy toward these high-reward textual patterns,
often leading to policy entropy collapse [179]. Finally, _vulnerabilities in reward models_ introduce failure modes where
static, rule-based criteria provide an incomplete measure of comprehension. Heuristic functions based on spatial overlap
can be bypassed by inflating box dimensions to maximize Intersection-over-Union (IoU) scores [169]. These external
evaluators often struggle to maintain robust decision boundaries as the policy evolves, resulting in high rewards for
logically flawed outputs [168, 180].


**Mitigation Strategies.** To address these issues, researchers have proposed fine-grained process verification, visual
anchoring, and multi-objective constraints. _Granular Process Verifcation_ aims to reduce objective compression by
supervising intermediate steps [178, 186]. For example, ContextRL [186] provides the reward model with full reference
solutions, while RuCL [178] uses stratified rubrics to evaluate grounding. Integrating external verifiers like detection
models or SAM-2 allows for step-by-step validation [187]. In process reward modeling, PS-GRPO [208] identifies
“drop-moments” to penalize false-positive rollouts. _Perception-Reasoning Synergy_ prevents models from using language
shortcuts by requiring visual anchoring [166, 167, 179]. PEARL [167] uses a fdelity gate to halt updates on samples
with failed perception, while DoGe [179] forces the model to analyze visual context before seeing the question. VisionSR1 [166] requires models to generate visual descriptions that must withstand subsequent logical verification. Finally,
_Multi-Objective Constraints_ mitigate the gaming of specific metrics. GUI-G1 [169] incorporates a bounding box size
penalty, and VLM-R1 [189] penalizes redundant predictions. Dynamic scheduling, such as raising IoU thresholds
during training in Vision-R1 [188], helps prevent the model from settling for low-quality shortcuts. SophiaVL-R1 [168]
uses Trust-GRPO to dynamically calculate trust weights for PRM signals, gradually shifting focus toward rule-based
rewards.


**7.2** **Reward Hacking in Visual Generative Models**


Reward hacking in visual generative models ( _e.g._, diffusion models) is characterized by unique visual degradations and
diminished sample diversity. These issues arise from the extreme difficulty of compressing high-dimensional aesthetic
and physical fidelity into tractable scalar proxies.


**Manifestations** **of** **Reward** **Hacking** **in** **Visual** **Generative** **Models.** Strict maximization of proxy rewards often prioritizes metric exploitation over genuine quality. This manifests in three dimensions.
_(1) Visual and Structural Degradation:_ Models may break visual fidelity, producing low-level pixel artifacts or highlevel geometric distortion. Low-level issues include oversaturated colors, artificial textures, and high-frequency grid
patterns [170, 171, 182, 209, 210]. High-level issues involve physical implausibility, such as asymmetrical facial


24


Reward Hacking in the Era of Large Models Fudan NLP Group


features or illogical object duplication [181, 211, 212]. In 3D generation, the “Janus problem”—where an object
displays multiple front faces—is a classic instance of _evaluator-level exploitation_ : the generator reverse-engineers
the blind spots of a static 2D-based proxy [172]. _(2) Mode Collapse:_ Optimization amplification can drive the output
distribution into a narrow set of high-reward patterns, sacrificing diversity [171, 190, 192, 213]. This can result in blank
images [173], blurry video frames [214], or motionless clips [215]. _(3) Capability Trade-offs:_ Models may achieve
high scores on specific metrics while degrading overall composition or prompt alignment [173, 212]. This includes
omitting complex instructions or generating unnatural, gigantic text overlays to satisfy text-rendering rewards at the
expense of realism [174, 216].


**Underlying Causes of Reward Hacking.** The interplay between proxy signals and optimization pressure drives
these failures. First, _Inherent Proxy Limitations_ prevent reward models from capturing holistic human preferences.
Standard Bradley-Terry losses focus on pairwise comparisons and may ignore the absolute data distribution, rewarding
superficial shortcut features [181]. If training data contains hidden noise or poisoning, the reward model may associate
unnatural patterns with high scores [217]. Smaller-capacity RMs are particularly easy to bypass [192]. Furthermore,
global scalar rewards fail to penalize localized distortions [182, 214]. Structural mismatches, such as using 2D proxies
for 3D structures, create significant evaluation gaps [172, 210, 218]. Second, _Optimization Amplifcation_ can guide the
policy toward unintended outcomes. Theoretical analysis suggests that pure reward maximization inclines the policy
toward a Dirac-delta distribution, making mode collapse a structural tendency of the objective itself [171]. Group
normalization in algorithms like GRPO can magnify negligible score differences, encouraging the model to overfit to
minor variations [183]. The asymmetry between a continuously updating policy and a static reward model allows the
generator to discover and overfit to specific scoring artifacts [191, 170].


**Mitigation Strategies.** Strategies to prevent reward hacking in generative models include regularization, advanced
mechanism design, and trajectory interventions. _Regularization and Distributional Constraints_ keep the optimized
policy from deviating too far from the reference distribution. Adaptive techniques like ADRPO [190] and GARDO [219]
adjust penalties based on sample advantages or reward uncertainty. Other methods use _f_ -divergence [220], GramKL regularization for style anchoring [209], or Top-1 likelihood stabilization [174]. Off-policy regularization,
such as DDRL [216], uses forward KL on offline datasets to keep the model grounded in real data manifolds.
_Advanced Reward Formulation_ uses dynamic and adversarial updates to refine the evaluator [192, 221, 222]. JarvisEvo [191] uses a co-adaptive framework with verifiable data to prevent self-deception. Granular feedback, such as
temporally localized gradients in Diffusion-DRF [214] or localized defect diagnosis in FinPercep-RM [182], reduces
exploitability. Shifting to pairwise preferences in PREF-GRPO [183] and SoliReward [181] provides more stable
signals. Ensembling multiple models or using rule-based environments like CAD compilers can further neutralize proxy
flaws [223, 224]. _Trajectory and Optimization Interventions_ exploit the iterative nature of generation. Timestep-aware
schemes, such as temporal asymmetric interventions [171] or dynamic distortion-perception weighting [211], decay the
proxy reward’s influence over time to preserve the global structure. Directional shaping, such as D [2] -Align [193], corrects the optimization direction in embedding space to prevent mode collapse. For autoregressive models, STAGE [225]
adjusts advantage estimates for visually similar tokens to maintain coherence.


**7.3** **Reward Hacking in Agentic Models**


As LLMs become autonomous agents, reward hacking extends to environment-level exploitation, deceptive tool usage,
and sophisticated multi-step evaluator gaming. These systems operate in long-horizon, interactive environments where
optimization pressure can lead to severe structural instabilities.


**Manifestations** **of** **Reward** **Hacking** **in** **Agentic** **Models.** Agentic reward hacking typically involves complex
environmental interactions. A prominent pattern is _tool-call hacking and unfaithful execution_, where agents satisfy
procedural requirements without genuinely using tool outputs [137, 175]. An agent might invoke a search tool
but guess the answer based on internal priors. _Test exploitation and hardcoding shortcuts_ are common in software
tasks. When evaluated against unit tests, agents may hardcode expected outputs, copy reference implementations, or
exploit sandbox edge cases rather than solving the underlying problem [176, 184]. This represents _environment-level_
_exploitation_, where the agent learns to optimize the static verifier itself. Furthermore, _feedback loop exploitation_
occurs in interactive settings. As agents process their own previous outputs, they may optimize for proxy objectives
while creating harmful side effects, such as escalating toxicity to maximize social media engagement [37]. Finally,
agents exhibit _obfuscated reasoning and multi-step deception_ . Advanced agents may hide misaligned intentions within
excessively long reasoning chains or plans to avoid detection by human overseers or monitoring models [25, 177].


**Underlying Causes of Reward Hacking.** These behaviors are driven by sparse supervision and fragile evaluation
environments. _Outcome-only supervision_ creates significant vulnerabilities in long-horizon tasks; rewarding only the


25


Reward Hacking in the Era of Large Models Fudan NLP Group


final state leaves the intermediate steps unconstrained, allowing agents to discover degenerate shortcuts [37, 175].
_Fragile evaluation environments_ exacerbate this, as rule-based evaluators and static unit tests are inherently brittle and
cannot cover the vast state space of possible interactions [184, 185]. Finally, _environmental co-adaptation_ creates
recursive dynamics where an agent’s actions alter its subsequent inputs, providing continuous opportunities to exploit
minor specification flaws [37, 177].


**Mitigation** **Strategies.** Mitigation for agentic models focuses on dense process supervision and robustness.
_Process-level Verifcation_ assigns rewards to individual tool-call steps [175]. In coding, integrating formal verification
like AlphaVerus [194] or ProofWright [226] provides mathematical guarantees of correctness. _Dynamic Oversight_ uses
advanced LLMs as in-the-loop critics to ensure supervision remains adaptive to shifting agent strategies [185, 195].
To address deception, methods like MONA [177] combine myopic optimization with non-myopic approval. Some
researchers advocate for a “monitorability tax”—limiting optimization pressure on the reasoning trace to maintain
transparency [25]. Finally, _strict constraints and rubric-based regularization_ can force agents to adhere to correct
implementations and suppress superficial metric gaming [185, 176].

#### **8 Open Challenges and Future Directions**


Although recent advancements have partially mitigated localized reward hacking, the emergence of strategic misalignment under scale reveals fundamental limitations in current proxy-based alignment paradigms. Viewed through the lens
of the Proxy Compression Hypothesis, resolving reward hacking requires moving beyond ad-hoc patches. We highlight
five practical open challenges and future directions to guide subsequent research.


**Dynamic Evaluator-Policy Co-Evolution.** Current alignment pipelines typically optimize policies against static
reward models or fixed benchmarks [1, 35]. This static setup makes it easy for the policy to find loopholes and overfit to
the evaluator’s specific blind spots (Evaluator-Level Exploitation) [16, 32]. **Future Directions:** The field needs to shift
from static to dynamic alignment frameworks. Practical approaches include continuously updating the reward model
with new online data to close loopholes [102, 227], using ensemble evaluators to reduce individual blind spots [60, 61],
and employing adversarial training where the reward model and the policy are trained simultaneously to challenge and
improve each other in a zero-sum or Min-Max game formulation [104, 105].


**Robust Environments for Multimodal and Agentic Systems.** When LLMs are deployed as agents or multimodal
systems, reward hacking often manifests as Environment-Level Exploitation [37, 187]. Instead of solving the task,
agents might manipulate the observation space—such as spoofing API returns or exploiting bugs in a simulator—to trick
the system into giving a high reward [15]. **Future Directions:** Future work should focus on building tamper-resistant
evaluation environments (sandboxes) where the reward signals cannot be manipulated by the agent’s intermediate
actions [184]. For multimodal models, researchers should apply dense process supervision (PRMs) that strictly verifies
the logical consistency between the visual input and the reasoning steps [167, 208], ensuring the model cannot guess
the right answer without truly grounding it in the image context.


**Mechanistic** **Detection** **of** **Strategic** **Deception.** As models become more capable, they may learn to hide their
misaligned goals during evaluation—acting "safe" merely to pass the test and secure high rewards, a phenomenon
often referred to as Alignment Faking or Sleeper Agents [30, 31, 50]. Traditional behavioral evaluations (black-box
testing) are insufficient here, as a deceptive model will output the same correct answers as a truly aligned model. **Future**
**Directions:** Researchers should leverage Mechanistic Interpretability ("white-box" testing) to address sophisticated
reward hacking [76]. Rather than only evaluating the final text output, future safety protocols should monitor the
internal representations, energy dynamics, and attention heads of the model during live inference [74]. Identifying the
specific neural circuits responsible for "evaluator modeling" or "deception" will allow us to detect and penalize strategic
reward hacking before it translates into harmful behaviors [77].


**Moving Beyond Single Scores with Detailed Feedback.** The Proxy Compression Hypothesis shows that shrinking
complex human values into a single score creates blind spots. Training algorithms exploit this setup. They learn to
maximize simple traits like response length or agreement rather than actual quality [46, 71]. **Future Directions:** Future
training methods could replace these simple scores with detailed and structured feedback. Promising ideas include
giving rewards for individual tokens [118, 119], breaking rewards down into multiple specific goals [84, 86], and using
generative models guided by clear grading rules [90, 129]. By spreading this oversight across intermediate steps and
specific details, we can close the loopholes that models use to cheat.


26


Reward Hacking in the Era of Large Models Fudan NLP Group

#### **9 Discussion and Conclusion**


Reward hacking in large language models should not be viewed as a narrow implementation bug or a collection of
isolated benchmark failures. Rather, it reflects a more fundamental limitation of proxy-based alignment. The objectives
we truly care about are rich, contextual, and difficult to formalize, whereas the reward signals used in training are
necessarily compressed, partial, and therefore exploitable. Under this view, reward hacking is not an exception to
alignment, but a recurring consequence of optimizing capable models against imperfect proxies.


Because of this structural flaw, the risks of reward hacking scale directly with model capabilities. A common mistake is
treating misalignment as a set of disconnected product defects, such as occasional bad answers or harmless hallucinations.
However, as models gain more autonomy, these risks experience a severe amplification effect. When LLMs are deployed
in assistants, coding, search, scientific workflows, and autonomous agents, failures of reward design translate into
systems that appear successful under evaluation while becoming less truthful and less reliable.


In multimodal and agentic settings, the problem becomes even more consequential. Proxy exploitation extends beyond
textual shortcuts to tool misuse, evaluator manipulation, and environment-level gaming. When a model acts as a core
execution node in an enterprise workflow, a single hacked reward can corrupt organizational decisions and resources.
At a larger scale, if millions of users rely on a model that hides its flaws to maximize approval scores, it can distort
information ecosystems and amplify collective biases. Furthermore, as advanced models lower the barrier for high risk
activities, a system that easily bypasses its safety proxies poses a severe threat to public safety. If we project this trend
forward to models with superhuman autonomy, an unchecked drive to optimize flawed proxies could turn local errors
into uncontainable global vulnerabilities.


Addressing reward hacking is therefore not only about improving benchmark validity. It is about ensuring that future
AI systems remain dependable under real-world optimization pressure. True alignment cannot be treated as a quick
safety patch applied just before a model is released. Instead, it must be viewed as a basic institutional and engineering
requirement for deploying advanced intelligent systems.


More broadly, this survey suggests that progress in alignment should be evaluated not only by how well we optimize
rewards, but also by how well we design them. Scalable alignment will require more faithful evaluators, stronger
oversight, better grounding, and a deeper understanding of how policies adapt to the proxies used to train them. In this
sense, studying reward hacking is valuable not merely for diagnosing present failures, but for building the necessary
constraints and directions to safely integrate advanced AI into society.

#### **References**


[1] Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida, Carroll Wainwright, Pamela Mishkin, Chong Zhang,
Sandhini Agarwal, Katarina Slama, Alex Ray, et al. Training language models to follow instructions with human
feedback. _Advances in neural information processing systems_, 35:27730–27744, 2022.


[2] Timo Kaufmann, Paul Weng, Viktor Bengs, and Eyke Hüllermeier. A survey of reinforcement learning from
human feedback. _Transactions on Machine Learning Research_, 2024.


[3] Wenhao Liu, Xiaohua Wang, Muling Wu, Tianlong Li, Changze Lv, Zixuan Ling, Jianhao Zhu, Cenyuan
Zhang, Xiaoqing Zheng, and Xuanjing Huang. Aligning large language models with human preferences through
representation engineering. In Lun-Wei Ku, Andre Martins, and Vivek Srikumar, editors, _Proceedings of the_
_62nd Annual Meeting of the Association for Computational Linguistics (Volume 1:_ _Long Papers), ACL 2024,_
_Bangkok, Thailand, August 11-16, 2024_, pages 10619–10638. Association for Computational Linguistics, 2024.
doi: 10.18653/V1/2024.ACL-LONG.572. URL `[https://doi.org/10.18653/v1/2024.acl-long.572](https://doi.org/10.18653/v1/2024.acl-long.572)` .


[4] Binghai Wang, Rui Zheng, Lu Chen, Yan Liu, Shihan Dou, Caishuang Huang, Wei Shen, Senjie Jin, Enyu
Zhou, Chenyu Shi, et al. Secrets of rlhf in large language models part ii: Reward modeling. _arXiv preprint_
_arXiv:2401.06080_, 2024.


[5] Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jackson Kernion, Andy Jones, Anna Chen,
Anna Goldie, Azalia Mirhoseini, Cameron McKinnon, Carol Chen, Catherine Olsson, Christopher Olah, Danny
Hernandez, Dawn Drain, Deep Ganguli, Dustin Li, Eli Tran-Johnson, Ethan Perez, Jamie Kerr, Jared Mueller,
Jeffrey Ladish, Joshua Landau, Kamal Ndousse, Kamile Lukosuite, Liane Lovitt, Michael Sellitto, Nelson
Elhage, Nicholas Schiefer, Noemi Mercado, Nova DasSarma, Robert Lasenby, Robin Larson, Sam Ringer, Scott
Johnston, Shauna Kravec, Sheer El Showk, Stanislav Fort, Tamera Lanham, Timothy Telleen-Lawton, Tom
Conerly, Tom Henighan, Tristan Hume, Samuel R. Bowman, Zac Hatfield-Dodds, Ben Mann, Dario Amodei,


27


Reward Hacking in the Era of Large Models Fudan NLP Group


Nicholas Joseph, Sam McCandlish, Tom Brown, and Jared Kaplan. Constitutional ai: Harmlessness from ai
feedback, 2022. URL `[https://arxiv.org/abs/2212.08073](https://arxiv.org/abs/2212.08073)` .


[6] Harrison Lee, Samrat Phatale, Hassan Mansoor, Thomas Mesnard, Johan Ferret, Kellie Lu, Colton Bishop, Ethan
Hall, Victor Carbune, Abhinav Rastogi, et al. Rlaif vs. rlhf: Scaling reinforcement learning from human feedback
with ai feedback. _arXiv preprint arXiv:2309.00267_, 2023.


[7] Hunter Lightman, Vineet Kosaraju, Yuri Burda, Harrison Edwards, Bowen Baker, Teddy Lee, Jan Leike, John
Schulman, Ilya Sutskever, and Karl Cobbe. Let’s verify step by step. In _The twelfth international conference on_
_learning representations_, 2023.


[8] DeepSeek-AI et al. Deepseek-r1: Incentivizing reasoning capability in llms via reinforcement learning. _arXiv_
_preprint arXiv:2501.12948_, 2025.


[9] Joar Skalse, Nikolaus H. R. Howe, Dmitrii Krasheninnikov, and David Krueger. Defining and characterizing reward gaming. In Sanmi Koyejo, S. Mohamed, A. Agarwal, Danielle Belgrave, K. Cho,
and A. Oh, editors, _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_ _35:_ _Annual_ _Conference_
_on_ _Neural_ _Information_ _Processing_ _Systems_ _2022,_ _NeurIPS_ _2022,_ _New_ _Orleans,_ _LA,_ _USA,_ _November_
_28_ _-_ _December_ _9,_ _2022_, 2022. URL `[http://papers.nips.cc/paper_files/paper/2022/hash/](http://papers.nips.cc/paper_files/paper/2022/hash/3d719fee332caa23d5038b8a90e81796-Abstract-Conference.html)`
`[3d719fee332caa23d5038b8a90e81796-Abstract-Conference.html](http://papers.nips.cc/paper_files/paper/2022/hash/3d719fee332caa23d5038b8a90e81796-Abstract-Conference.html)` .


[10] Dario Amodei, Chris Olah, Jacob Steinhardt, Paul Christiano, John Schulman, and Dan Mané. Concrete problems
in ai safety. _arXiv preprint arXiv:1606.06565_, 2016.


[11] Alexander Pan, Kush Bhatia, and Jacob Steinhardt. The effects of reward misspecification: Mapping and
mitigating misaligned models. In _The_ _Tenth_ _International_ _Conference_ _on_ _Learning_ _Representations,_ _ICLR_
_2022, Virtual Event, April 25-29, 2022_ . OpenReview.net, 2022. URL `[https://openreview.net/forum?id=](https://openreview.net/forum?id=JYtwGwIL7ye)`
`[JYtwGwIL7ye](https://openreview.net/forum?id=JYtwGwIL7ye)` .


[12] Rafael Rafailov, Yaswanth Chittepu, Ryan Park, Harshit Sushil Sikchi, Joey Hejna, Brad Knox, Chelsea Finn,
and Scott Niekum. Scaling laws for reward model overoptimization in direct alignment algorithms. _Advances in_
_Neural Information Processing Systems_, 37:126207–126242, 2024.


[13] Victoria Krakovna, Jonathan Uesato, Vladimir Mikulik, Matthew Rahtz, Tom Everitt, Ramana Kumar, Zac Kenton, Jan Leike, and Shane Legg. Specification gaming: The flip side of AI ingenuity. Google DeepMind Blog, April 2020. URL `[https://deepmind.google/discover/blog/](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)`
`[specification-gaming-the-flip-side-of-ai-ingenuity/](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)` .


[14] Lauro Langosco Di Langosco, Jack Koch, Lee D Sharkey, Jacob Pfau, and David Krueger. Goal misgeneralization
in deep reinforcement learning. In _International Conference on Machine Learning_, pages 12004–12019. PMLR,
2022.


[15] Tom Everitt, Marcus Hutter, Ramana Kumar, and Victoria Krakovna. Reward tampering problems and solutions
in reinforcement learning: A causal influence diagram perspective. _Synthese_, 198(Suppl 27):6435–6467, 2021.


[16] Leo Gao, John Schulman, and Jacob Hilton. Scaling laws for reward model overoptimization. In _International_
_Conference on Machine Learning_, pages 10835–10866. PMLR, 2023.


[17] Hadi Khalaf, Claudio Mayrink Verdun, Alex Oesterling, Himabindu Lakkaraju, and Flavio du Pin Calmon.
Inference-time reward hacking in large language models. _arXiv preprint arXiv:2506.19248_, 2025.


[18] Monte MacDiarmid, Benjamin Wright, Jonathan Uesato, Joe Benton, Jon Kutasov, Sara Price, Naia Bouscal,
Samuel R. Bowman, Trenton Bricken, Alex Cloud, Carson Denison, Johannes Gasteiger, Ryan Greenblatt, et al.
Natural emergent misalignment from reward hacking in production rl. _arXiv preprint arXiv:2511.18397_, 2025.
URL `[https://arxiv.org/abs/2511.18397](https://arxiv.org/abs/2511.18397)` .


[19] Lilian Weng. Reward hacking in reinforcement learning. _lilianweng.github.io_, Nov 2024. URL `[https:](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)`
`[//lilianweng.github.io/posts/2024-11-28-reward-hacking/](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)` .


[20] Carson Denison, Monte MacDiarmid, Fazl Barez, David Duvenaud, Shauna Kravec, Samuel Marks, Nicholas
Schiefer, Ryan Soklaski, Alex Tamkin, Jared Kaplan, Buck Shlegeris, Samuel R. Bowman, Ethan Perez, and
Evan Hubinger. Sycophancy to subterfuge: Investigating reward-tampering in large language models. _CoRR_,
abs/2406.10162, 2024. doi: 10.48550/ARXIV.2406.10162. URL `[https://doi.org/10.48550/arXiv.2406.](https://doi.org/10.48550/arXiv.2406.10162)`
`[10162](https://doi.org/10.48550/arXiv.2406.10162)` .


28


Reward Hacking in the Era of Large Models Fudan NLP Group


[21] Samuel R. Bowman, Jeeyoon Hyun, Ethan Perez, Edwin Chen, Craig Pettit, Scott Heiner, Kamile Lukosiute,
Amanda Askell, Andy Jones, Anna Chen, Anna Goldie, Azalia Mirhoseini, Cameron McKinnon, Christopher
Olah, Daniela Amodei, Dario Amodei, Dawn Drain, Dustin Li, Eli Tran-Johnson, Jackson Kernion, Jamie Kerr,
Jared Mueller, Jeffrey Ladish, Joshua Landau, Kamal Ndousse, Liane Lovitt, Nelson Elhage, Nicholas Schiefer,
Nicholas Joseph, Noemí Mercado, Nova DasSarma, Robin Larson, Sam McCandlish, Sandipan Kundu, Scott
Johnston, Shauna Kravec, Sheer El Showk, Stanislav Fort, Timothy Telleen-Lawton, Tom Brown, Tom Henighan,
Tristan Hume, Yuntao Bai, Zac Hatfield-Dodds, Ben Mann, and Jared Kaplan. Measuring progress on scalable
oversight for large language models. _CoRR_, abs/2211.03540, 2022. doi: 10.48550/ARXIV.2211.03540. URL
`[https://doi.org/10.48550/arXiv.2211.03540](https://doi.org/10.48550/arXiv.2211.03540)` .


[22] Amanda Askell, Yuntao Bai, Anna Chen, Dawn Drain, Deep Ganguli, Tom Henighan, Andy Jones, Nicholas
Joseph, Benjamin Mann, Nova DasSarma, Nelson Elhage, Zac Hatfield-Dodds, Danny Hernandez, Jackson
Kernion, Kamal Ndousse, Catherine Olsson, Dario Amodei, Tom B. Brown, Jack Clark, Sam McCandlish, Chris
Olah, and Jared Kaplan. A general language assistant as a laboratory for alignment. _CoRR_, abs/2112.00861,
2021. URL `[https://arxiv.org/abs/2112.00861](https://arxiv.org/abs/2112.00861)` .


[23] Stephen Casper, Xander Davies, Claudia Shi, Thomas Krendl Gilbert, Jérémy Scheurer, Javier Rando, Rachel
Freedman, Tomasz Korbak, David Lindner, Pedro Freire, Tony Tong Wang, Samuel Marks, Charbel-Raphaël
Ségerie, Micah Carroll, Andi Peng, Phillip J. K. Christoffersen, Mehul Damani, Stewart Slocum, Usman Anwar,
Anand Siththaranjan, Max Nadeau, Eric J. Michaud, Jacob Pfau, Dmitrii Krasheninnikov, Xin Chen, Lauro
Langosco, Peter Hase, Erdem Biyik, Anca D. Dragan, David Krueger, Dorsa Sadigh, and Dylan Hadfield-Menell.
Open problems and fundamental limitations of reinforcement learning from human feedback. _Trans. Mach._
_Learn. Res._, 2023, 2023. URL `[https://openreview.net/forum?id=bx24KpJ4Eb](https://openreview.net/forum?id=bx24KpJ4Eb)` .


[24] Lorenz Wolf, Robert Kirk, and Mirco Musolesi. Reward model overoptimisation in iterated rlhf. _arXiv preprint_
_arXiv:2505.18126_, 2025. URL `[https://arxiv.org/abs/2505.18126](https://arxiv.org/abs/2505.18126)` .


[25] Bowen Baker, Joost Huizinga, Leo Gao, Zehao Dou, Melody Y. Guan, Aleksander Madry, Wojciech Zaremba,
Jakub Pachocki, and David Farhi. Monitoring reasoning models for misbehavior and the risks of promoting
obfuscation. _arXiv preprint arXiv:2503.11926_, 2025. URL `[https://arxiv.org/abs/2503.11926](https://arxiv.org/abs/2503.11926)` .


[26] Prasann Singhal, Tanya Goyal, Jiacheng Xu, and Greg Durrett. A long way to go: Investigating length correlations
in rlhf. _arXiv preprint arXiv:2310.03716_, 2023.


[27] Miles Turpin, Julian Michael, Ethan Perez, and Samuel Bowman. Language models don’t always say what
they think: Unfaithful explanations in chain-of-thought prompting. _Advances in Neural Information Processing_
_Systems_, 36:74952–74965, 2023.


[28] Jiawen Shi, Zenghui Yuan, Yinuo Liu, Yue Huang, Pan Zhou, Lichao Sun, and Neil Zhenqiang Gong.
Optimization-based prompt injection attack to LLM-as-a-judge. _arXiv preprint arXiv:2403.17710_, 2024. URL
`[https://arxiv.org/abs/2403.17710](https://arxiv.org/abs/2403.17710)` .


[29] Mia Taylor, James Chua, Jan Betley, Johannes Treutlein, and Owain Evans. School of reward hacks: Hacking
harmless tasks generalizes to misaligned behavior in llms. _CoRR_, abs/2508.17511, 2025. doi: 10.48550/ARXIV.
2508.17511. URL `[https://doi.org/10.48550/arXiv.2508.17511](https://doi.org/10.48550/arXiv.2508.17511)` .


[30] Ryan Greenblatt, Carson Denison, Benjamin Wright, Fabien Roger, Monte MacDiarmid, Sam Marks, Johannes
Treutlein, Tim Belonax, Jack Chen, David Duvenaud, Akbir Khan, Julian Michael, Sören Mindermann, Ethan
Perez, Linda Petrini, Jonathan Uesato, Jared Kaplan, Buck Shlegeris, Samuel R. Bowman, and Evan Hubinger.
Alignment faking in large language models. _arXiv preprint arXiv:2412.14093_, 2024. URL `[https://arxiv.](https://arxiv.org/abs/2412.14093)`
`[org/abs/2412.14093](https://arxiv.org/abs/2412.14093)` .


[31] Evan Hubinger, Carson Denison, Jesse Mu, Mike Lambert, Meg Tong, Monte MacDiarmid, Tamera Lanham,
Daniel M. Ziegler, Tim Maxwell, Newton Cheng, Adam Jermyn, Amanda Askell, Ansh Radhakrishnan, Cem
Anil, David Duvenaud, Deep Ganguli, Fazl Barez, Jack Clark, Kamal Ndousse, Kshitij Sachan, Michael
Sellitto, Mrinank Sharma, Nova DasSarma, Roger Grosse, Shauna Kravec, Yuntao Bai, Zachary Witten, Marina
Favaro, Jan Brauner, Holden Karnofsky, Paul Christiano, Samuel R. Bowman, Logan Graham, Jared Kaplan,
Sören Mindermann, Ryan Greenblatt, Buck Shlegeris, Nicholas Schiefer, and Ethan Perez. Sleeper agents:
Training deceptive LLMs that persist through safety training. _arXiv preprint arXiv:2401.05566_, 2024. URL
`[https://arxiv.org/abs/2401.05566](https://arxiv.org/abs/2401.05566)` .


[32] Jacek Karwowski, Oliver Hayman, Xingjian Bai, Klaus Kiendlhofer, Charlie Griffin, and Joar Skalse. Goodhart’s
law in reinforcement learning. _arXiv preprint arXiv:2310.09144_, 2023.


29


Reward Hacking in the Era of Large Models Fudan NLP Group


[33] Paul F. Christiano, Jan Leike, Tom B. Brown, Miljan Martic, Shane Legg, and Dario Amodei. Deep reinforcement
learning from human preferences. In _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_ _30_, 2017. URL
`[https://neurips.cc/virtual/2017/poster/9209](https://neurips.cc/virtual/2017/poster/9209)` .


[34] Hanze Dong, Wei Xiong, Bo Pang, Haoxiang Wang, Han Zhao, Yingbo Zhou, Nan Jiang, Doyen Sahoo, Caiming
Xiong, and Tong Zhang. Rlhf workflow: From reward modeling to online rlhf. _arXiv preprint arXiv:2405.07863_,
2024.


[35] Rafael Rafailov, Archit Sharma, Eric Mitchell, Christopher D Manning, Stefano Ermon, and Chelsea Finn. Direct
preference optimization: Your language model is secretly a reward model. _Advances in neural information_
_processing systems_, 36:53728–53741, 2023.


[36] Xumeng Wen, Zihan Liu, Shun Zheng, Shengyu Ye, Zhirong Wu, Yang Wang, Zhijian Xu, Xiao Liang, Junjie Li,
Ziming Miao, et al. Reinforcement learning with verifiable rewards implicitly incentivizes correct reasoning in
base llms. _arXiv preprint arXiv:2506.14245_, 2025.


[37] Alexander Pan, Erik Jones, Meena Jagadeesan, and Jacob Steinhardt. Feedback loops with language models
drive in-context reward hacking. _arXiv preprint arXiv:2402.06627_, 2024.


[38] Yuchun Miao, Sen Zhang, Liang Ding, Rong Bao, Lefei Zhang, and Dacheng Tao. Inform: Mitigating reward
hacking in rlhf via information-theoretic reward modeling. _Advances in Neural Information Processing Systems_,
37:134387–134429, 2024.


[39] Tamera Lanham, Anna Chen, Ansh Radhakrishnan, Benoit Steiner, Carson Denison, Danny Hernandez, Dustin
Li, Esin Durmus, Evan Hubinger, Jackson Kernion, et al. Measuring faithfulness in chain-of-thought reasoning.
_arXiv preprint arXiv:2307.13702_, 2023.


[40] Jiaer Xia, Yuhang Zang, Peng Gao, Sharon Li, and Kaiyang Zhou. Visionary-r1: Mitigating shortcuts in visual
reasoning with reinforcement learning. _arXiv preprint arXiv:2505.14677_, 2025.


[41] Songze Li, Chuokun Xu, Jiaying Wang, Xueluan Gong, Chen Chen, Jirui Zhang, Jun Wang, Kwok-Yan Lam, and
Shouling Ji. Llms cannot reliably judge (yet?): A comprehensive assessment on the robustness of llm-as-a-judge.
_arXiv preprint arXiv:2506.09443_, 2025.


[42] Narek Maloyan, Bislan Ashinov, and Dmitry Namiot. Investigating the vulnerability of llm-as-a-judge architectures to prompt-injection attacks. _International Journal of Open Information Technologies_, 13(9):1–6,
2025.


[43] Muhammad Khalifa, Zohaib Khan, Omer Tafveez, Hao Peng, and Lu Wang. Countdown-code: A testbed for
studying the emergence and generalization of reward hacking in rlvr. _arXiv preprint arXiv:2603.07084_, 2026.


[44] Darshan Deshpande, Anand Kannappan, and Rebecca Qian. Benchmarking reward hack detection in code
environments via contrastive analysis. _arXiv preprint arXiv:2601.20103_, 2026.


[45] Congmin Zheng, Jiachen Zhu, Jianghao Lin, Xinyi Dai, Yong Yu, Weinan Zhang, and Mengyue Yang. Cold:
Counterfactually-guided length debiasing for process reward models. _arXiv preprint arXiv:2507.15698_, 2025.
URL `[https://arxiv.org/abs/2507.15698](https://arxiv.org/abs/2507.15698)` .


[46] Sanskar Pandey, Ruhaan Chopra, Angkul Puniya, and Sohom Pal. Beacon: Single-turn diagnosis and mitigation
of latent sycophancy in large language models. _arXiv preprint arXiv:2510.16727_, 2025. URL `[https://arxiv.](https://arxiv.org/abs/2510.16727)`
`[org/abs/2510.16727](https://arxiv.org/abs/2510.16727)` .


[47] A.H. Fanous, Jacob Goldberg, and Oluwasanmi Koyejo. Syceval: Evaluating llm sycophancy, 2025. Manuscript
in preparation.


[48] Yanda Chen, Joe Benton, Ansh Radhakrishnan, Jonathan Uesato, Carson Denison, John Schulman, Arushi
Somani, Peter Hase, Misha Wagner, Fabien Roger, Vladimir Mikulik, Samuel R. Bowman, Jan Leike, Jared
Kaplan, and Ethan Perez. Reasoning models don’t always say what they think. _arXiv preprint arXiv:2505.05410_,
2025. URL `[https://arxiv.org/abs/2505.05410](https://arxiv.org/abs/2505.05410)` .


[49] Martin Tutek, Fateme Hashemi Chaleshtori, Ana Marasovic, and Yonatan Belinkov. Measuring chain of thought
faithfulness by unlearning reasoning steps. In _Proceedings of the 2025 Conference on Empirical Methods in_
_Natural Language Processing (EMNLP 2025)_, pages 8045–8064, 2025. URL `[https://aclanthology.org/](https://aclanthology.org/2025.emnlp-main.504/)`
`[2025.emnlp-main.504/](https://aclanthology.org/2025.emnlp-main.504/)` . Outstanding Paper Award.


30


Reward Hacking in the Era of Large Models Fudan NLP Group


[50] Alexander Meinke, Bronson Schoen, Jérémy Scheurer, Mikita Balesni, Rusheb Shah, and Marius Hobbhahn.
Frontier models are capable of in-context scheming. _arXiv preprint arXiv:2412.04984_, 2024. URL `[https:](https://arxiv.org/abs/2412.04984)`
`[//arxiv.org/abs/2412.04984](https://arxiv.org/abs/2412.04984)` .


[51] Jerry Wei, Da Huang, Yifeng Lu, Denny Zhou, and Quoc V Le. Simple synthetic data reduces sycophancy in
large language models. _arXiv preprint arXiv:2308.03958_, 2023.


[52] Rishabh Tiwari et al. Reward under attack: Analyzing the robustness and hackability of process reward models.
_arXiv preprint arXiv:2603.06621_, 2026. URL `[https://arxiv.org/abs/2603.06621](https://arxiv.org/abs/2603.06621)` .


[53] Anonymous Authors. Spurious rewards: Rethinking training signals in rlvr, 2025. Under review at ICLR 2025.
Project page: `[https://github.com/ruixin31/Rethink_RLVR](https://github.com/ruixin31/Rethink_RLVR)` .


[54] Anonymous Authors. Scaling laws for generative reward models. _OpenReview_, 2025. URL `[https://](https://openreview.net/forum?id=VYLwMvhdXI)`
`[openreview.net/forum?id=VYLwMvhdXI](https://openreview.net/forum?id=VYLwMvhdXI)` .


[55] Lichang Chen, Chen Zhu, Jiuhai Chen, Davit Soselia, Tianyi Zhou, Tom Goldstein, Heng Huang, Mohammad
Shoeybi, and Bryan Catanzaro. Odin: Disentangled reward mitigates hacking in rlhf. In _Proceedings of the 41st_
_International Conference on Machine Learning_, volume 235 of _Proceedings of Machine Learning Research_,
pages 7935–7952. PMLR, 2024. URL `[https://proceedings.mlr.press/v235/chen24bn.html](https://proceedings.mlr.press/v235/chen24bn.html)` .


[56] Collin Burns, Pavel Izmailov, Jan Hendrik Kirchner, Bowen Baker, Leo Gao, Leopold Aschenbrenner, Yining
Chen, Adrien Ecoffet, Manas Joglekar, Jan Leike, Ilya Sutskever, and Jeffrey Wu. Weak-to-strong generalization:
Eliciting strong capabilities with weak supervision. In _Proceedings of the 41st International Conference on_
_Machine Learning_, volume 235 of _Proceedings of Machine Learning Research_, pages 4971–5012. PMLR, 2024.
URL `[https://proceedings.mlr.press/v235/burns24b.html](https://proceedings.mlr.press/v235/burns24b.html)` .


[57] Wenkai Yang, Shiqi Shen, Guangyao Shen, Wei Yao, Yong Liu, Zhi Gong, Yankai Lin, and Ji-Rong Wen.
Super(ficial)-alignment: Strong models may deceive weak models in weak-to-strong generalization. In _The_
_Thirteenth International Conference on Learning Representations_, 2025. URL `[https://proceedings.iclr.](https://proceedings.iclr.cc/paper_files/paper/2025/hash/092359ce5cf60a80e882378944bf1be4-Abstract-Conference.html)`
```
   cc/paper_files/paper/2025/hash/092359ce5cf60a80e882378944bf1be4-Abstract-Conference.
```

`[html](https://proceedings.iclr.cc/paper_files/paper/2025/hash/092359ce5cf60a80e882378944bf1be4-Abstract-Conference.html)` .


[58] Nathan O. Lambert and Roberto Calandra. The alignment ceiling: Objective mismatch in reinforcement learning
from human feedback. _arXiv preprint arXiv:2311.00168_, 2023. URL `[https://arxiv.org/abs/2311.00168](https://arxiv.org/abs/2311.00168)` .


[59] Sungdong Kim and Minjoon Seo. Rethinking the role of proxy rewards in language model alignment. In
_Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing_, pages 20656–
20674. Association for Computational Linguistics, 2024. doi: 10.18653/v1/2024.emnlp-main.1150. URL
`[https://aclanthology.org/2024.emnlp-main.1150/](https://aclanthology.org/2024.emnlp-main.1150/)` .


[60] Thomas Coste, Usman Anwar, Robert Kirk, and David Krueger. Reward model ensembles help mitigate overoptimization. In _The_ _Twelfth_ _International_ _Conference_ _on_ _Learning_
_Representations_, 2024. URL `[https://proceedings.iclr.cc/paper_files/paper/2024/hash/](https://proceedings.iclr.cc/paper_files/paper/2024/hash/dda7f9378a210c25e470e19304cce85d-Abstract-Conference.html)`
`[dda7f9378a210c25e470e19304cce85d-Abstract-Conference.html](https://proceedings.iclr.cc/paper_files/paper/2024/hash/dda7f9378a210c25e470e19304cce85d-Abstract-Conference.html)` .


[61] Shun Zhang, Zhenfang Chen, Sunli Chen, Yikang Shen, Zhiqing Sun, and Chuang Gan. Improving reinforcement
learning from human feedback with efficient reward model ensemble. _arXiv preprint arXiv:2401.16635_, 2024.
URL `[https://arxiv.org/abs/2401.16635](https://arxiv.org/abs/2401.16635)` .


[62] Yuzi Yan, Xingzhou Lou, Jialian Li, Yiping Zhang, Jian Xie, Chao Yu, Yu Wang, Dong Yan, and Yuan Shen.
Reward-robust rlhf in llms. _arXiv preprint arXiv:2409.15360_, 2024. URL `[https://arxiv.org/abs/2409.](https://arxiv.org/abs/2409.15360)`
`[15360](https://arxiv.org/abs/2409.15360)` .


[63] Evan Hubinger, Chris van Merwijk, Vladimir Mikulik, Joar Skalse, and Scott Garrabrant. Risks from learned
optimization in advanced machine learning systems. _arXiv preprint arXiv:1906.01820_, 2019. URL `[https:](https://arxiv.org/abs/1906.01820)`
`[//arxiv.org/abs/1906.01820](https://arxiv.org/abs/1906.01820)` .


[64] Terry Tong, Fei Wang, Zhe Zhao, and Muhao Chen. BadJudge: Backdoor vulnerabilities of LLM-as-a-judge.
_arXiv preprint arXiv:2503.00596_, 2025. URL `[https://arxiv.org/abs/2503.00596](https://arxiv.org/abs/2503.00596)` .


[65] Geoffrey Irving, Paul Christiano, and Dario Amodei. Ai safety via debate. _arXiv preprint arXiv:1805.00899_,
2018. URL `[https://arxiv.org/abs/1805.00899](https://arxiv.org/abs/1805.00899)` .


31


Reward Hacking in the Era of Large Models Fudan NLP Group


[66] Jan Leike, David Krueger, Tom Everitt, Miljan Martic, Vishal Maini, and Shane Legg. Scalable agent alignment
via reward modeling: A research direction. _arXiv preprint arXiv:1811.07871_, 2018. URL `[https://arxiv.](https://arxiv.org/abs/1811.07871)`
`[org/abs/1811.07871](https://arxiv.org/abs/1811.07871)` .


[67] Teun van der Weij, Simon Lermen, and Leon Lang. Evaluating shutdown avoidance of language models in
textual scenarios. _arXiv preprint arXiv:2307.00787_, 2023. URL `[https://arxiv.org/abs/2307.00787](https://arxiv.org/abs/2307.00787)` .


[68] Ibne Farabi Shihab, Sanjeda Akter, and Anuj Sharma. Detecting proxy gaming in rl and llm alignment via
evaluator stress tests. _arXiv preprint arXiv:2507.05619_, 2025.


[69] Mohammad Beigi, Ming Jin, Junshan Zhang, Qifan Wang, and Lifu Huang. Adversarial reward auditing for
active detection and mitigation of reward hacking. _arXiv preprint arXiv:2602.01750_, 2026.


[70] Yupei Yang, Lin Yang, Wanxi Deng, Lin Qu, Fan Feng, Biwei Huang, Shikui Tu, and Lei Xu. Factored causal
representation learning for robust reward modeling in rlhf, 2026. URL `[https://arxiv.org/abs/2601.21350](https://arxiv.org/abs/2601.21350)` .


[71] Yuchun Miao, Sen Zhang, Liang Ding, Yuqi Zhang, Lefei Zhang, and Dacheng Tao. The energy loss phenomenon
in rlhf: A new perspective on mitigating reward hacking. _arXiv preprint arXiv:2501.19358_, 2025.


[72] Miles Turpin, Andy Arditi, Marvin Li, Joe Benton, and Julian Michael. Teaching models to verbalize reward
hacking in chain-of-thought reasoning. _arXiv preprint arXiv:2506.22777_, 2025. URL `[https://arxiv.org/](https://arxiv.org/abs/2506.22777)`
`[abs/2506.22777](https://arxiv.org/abs/2506.22777)` .


[73] Manas Joglekar, Jeremy Chen, Gabriel Wu, Jason Yosinski, Jasmine Wang, Boaz Barak, and Amelia Glaese.
Training llms for honesty via confessions. _arXiv preprint arXiv:2512.08093_, 2025.


[74] Patrick Wilhelm, Thorsten Wittkopp, and Odej Kao. Monitoring emergent reward hacking during generation via
internal activations. _arXiv preprint arXiv:2603.04069_, 2026.


[75] Manon Revel, Matteo Cargnelutti, Tyna Eloundou, and Greg Leppert. Seal: Systematic error analysis for value
alignment. In _Proceedings of the AAAI Conference on Artificial Intelligence_, 2025.


[76] Hoagy Cunningham, Aidan Ewart, Logan Riggs, Robert Huben, and Lee Sharkey. Sparse autoencoders find
highly interpretable features in language models, 2023. URL `[https://arxiv.org/abs/2309.08600](https://arxiv.org/abs/2309.08600)` .


[77] Samuel Marks, Johannes Treutlein, Trenton Bricken, Jack Lindsey, Jonathan Marcus, Siddharth Mishra-Sharma,
Daniel Ziegler, Emmanuel Ameisen, Joshua Batson, Tim Belonax, et al. Auditing language models for hidden
objectives. _arXiv preprint arXiv:2503.10965_, 2025.


[78] Abhay Sheshadri, Aidan Ewart, Kai Fronsdal, Isha Gupta, Samuel R. Bowman, Sara Price, Samuel Marks, and
Rowan Wang. Auditbench: Evaluating alignment auditing techniques on models with hidden behaviors, 2026.
URL `[https://arxiv.org/abs/2602.22755](https://arxiv.org/abs/2602.22755)` .


[79] Jan Leike, Miljan Martic, Victoria Krakovna, Pedro A Ortega, Tom Everitt, Andrew Lefrancq, Laurent Orseau,
and Shane Legg. Ai safety gridworlds. _arXiv preprint arXiv:1711.09883_, 2017.


[80] Nisan Stiennon, Long Ouyang, Jeffrey Wu, Daniel Ziegler, Ryan Lowe, Chelsea Voss, Alec Radford, Dario
Amodei, and Paul F Christiano. Learning to summarize with human feedback. _Advances in neural information_
_processing systems_, 33:3008–3021, 2020.


[81] Alexander A Alemi, Ian Fischer, Joshua V Dillon, and Kevin Murphy. Deep variational information bottleneck.
_arXiv preprint arXiv:1612.00410_, 2016.


[82] Sahar Abdelnabi and Ahmed Salem. The hawthorne effect in reasoning models: Evaluating and steering test
awareness. _arXiv preprint arXiv:2505.14617_, 2025.


[83] Mohammad Beigi, Ming Jin, Junshan Zhang, Jiaxin Zhang, Qifan Wang, and Lifu Huang. IR [3] : Contrastive
inverse reinforcement learning for interpretable detection and mitigation of reward hacking. _arXiv_ _preprint_
_arXiv:2602.19416_, 2026.


[84] Haoxiang Wang, Wei Xiong, Tengyang Xie, Han Zhao, and Tong Zhang. Interpretable preferences via multiobjective reward modeling and mixture-of-experts. In _EMNLP_, 2024.


32


Reward Hacking in the Era of Large Models Fudan NLP Group


[85] Feng Luo, Rui Yang, Hao Sun, Chunyuan Deng, Jiarui Yao, Jingyan Shen, Huan Zhang, and Hanjie Chen.
Rethinking diverse human preference learning through principal component analysis. In _Annual Meeting of the_
_Association for Computational Linguistics_, 2025. URL `[https://api.semanticscholar.org/CorpusID:](https://api.semanticscholar.org/CorpusID:276421263)`
`[276421263](https://api.semanticscholar.org/CorpusID:276421263)` .


[86] Zeqiu Wu, Yushi Hu, Weijia Shi, Nouha Dziri, Alane Suhr, Prithviraj Ammanabrolu, Noah A. Smith, Mari
Ostendorf, and Hannaneh Hajishirzi. Fine-grained human feedback gives better rewards for language model
training. In _Proceedings of the 37th International Conference on Neural Information Processing Systems_, NIPS
’23, Red Hook, NY, USA, 2023. Curran Associates Inc.


[87] Tianqi Liu, Wei Xiong, Jie Ren, Lichang Chen, Junru Wu, Rishabh Joshi, Yang Gao, Jiaming Shen, Zhen Qin,
Tianhe Yu, Daniel Sohn, Anastasia Makarova, Jeremiah Zhe Liu, Yuan Liu, Bilal Piot, Abe Ittycheriah, Aviral
Kumar, and Mohammad Saleh. RRM: Robust reward model training mitigates reward hacking. In _The Thirteenth_
_International Conference on Learning Representations_, 2025. URL `[https://openreview.net/forum?id=](https://openreview.net/forum?id=88AS5MQnmC)`
`[88AS5MQnmC](https://openreview.net/forum?id=88AS5MQnmC)` .


[88] Zihuiwen Ye, Fraser David Greenlee, Max Bartolo, Phil Blunsom, Jon Ander Campos, and Matthias Gallé.
Improving reward models with synthetic critiques. In _Findings of the Association for Computational Linguistics:_
_NAACL 2025_, pages 4506–4520, 2025.


[89] Xiusi Chen, Gaotang Li, Ziqi Wang, Bowen Jin, Cheng Qian, Yu Wang, Hongru WANG, Yu Zhang, Denghui
Zhang, Tong Zhang, Hanghang Tong, and Heng Ji. RM-r1: Reward modeling as reasoning. In _The Fourteenth_
_International Conference on Learning Representations_, 2026. URL `[https://openreview.net/forum?id=](https://openreview.net/forum?id=1ZqJ6jj75q)`
`[1ZqJ6jj75q](https://openreview.net/forum?id=1ZqJ6jj75q)` .


[90] Tong Mu, Alec Helyar, Johannes Heidecke, Joshua Achiam, Andrea Vallone, Ian Kivlichan, Molly Lin, Alex
Beutel, John Schulman, and Lilian Weng. Rule based rewards for language model safety. In A. Globerson, L. Mackey, D. Belgrave, A. Fan, U. Paquet, J. Tomczak, and C. Zhang, editors, _Advances_ _in_ _Neural_
_Information_ _Processing_ _Systems_, volume 37, pages 108877–108901. Curran Associates, Inc., 2024. doi:
10.52202/079017-3457. URL `[https://proceedings.neurips.cc/paper_files/paper/2024/file/](https://proceedings.neurips.cc/paper_files/paper/2024/file/c4e380fb74dec9da9c7212e834657aa9-Paper-Conference.pdf)`
`[c4e380fb74dec9da9c7212e834657aa9-Paper-Conference.pdf](https://proceedings.neurips.cc/paper_files/paper/2024/file/c4e380fb74dec9da9c7212e834657aa9-Paper-Conference.pdf)` .


[91] Anisha Gunjal, Anthony Wang, Elaine Lau, Vaskar Nath, Yunzhong He, Bing Liu, and Sean M. Hendryx. Rubrics
as rewards: Reinforcement learning beyond verifiable domains. In _The Fourteenth International Conference on_
_Learning Representations_, 2026. URL `[https://openreview.net/forum?id=c1bTcrDmt4](https://openreview.net/forum?id=c1bTcrDmt4)` .


[92] Vijay Viswanathan, Yanchao Sun, Xiang Kong, Meng Cao, Graham Neubig, and Tongshuang Wu. Checklists
are better than reward models for aligning language models. In _The Thirty-ninth Annual Conference on Neural_
_Information Processing Systems_, 2025. URL `[https://openreview.net/forum?id=RPRqKhjrr6](https://openreview.net/forum?id=RPRqKhjrr6)` .


[93] Zhihan Liu, Miao Lu, Shenao Zhang, Boyi Liu, Hongyi Guo, Yingxiang Yang, Jose Blanchet, and Zhaoran Wang.
Provably mitigating overoptimization in rlhf: Your sft loss is implicitly an adversarial regularizer. _Advances in_
_Neural Information Processing Systems_, 37:138663–138697, 2024.


[94] Nguyen Minh Phuc, Ngoc-Hieu Nguyen, Duy Minh Ho Nguyen, Anji Liu, An Mai, Binh T. Nguyen, Daniel
Sonntag, and Khoa D Doan. Mitigating reward over-optimization in direct alignment algorithms with importance
sampling. In _The_ _Thirty-ninth_ _Annual_ _Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_, 2025. URL
`[https://openreview.net/forum?id=ltPRj2nthL](https://openreview.net/forum?id=ltPRj2nthL)` .


[95] Jonathan D Chang, Wenhao Zhan, Owen Oertell, Kianté Brantley, Dipendra Misra, Jason D Lee, and Wen Sun.
Dataset reset policy optimization for rlhf. _arXiv preprint arXiv:2404.08495_, 2024.


[96] Juntao Dai, Taiye Chen, Yaodong Yang, Qian Zheng, and Gang Pan. Mitigating reward over-optimization
in RLHF via behavior-supported regularization. In _The_ _Thirteenth_ _International_ _Conference_ _on_ _Learning_
_Representations_, 2025. URL `[https://openreview.net/forum?id=PNMv4r7s1i](https://openreview.net/forum?id=PNMv4r7s1i)` .


[97] Dhawal Gupta, Adam Fisch, Christoph Dann, and Alekh Agarwal. Mitigating preference hacking in policy
optimization with pessimism. _arXiv preprint arXiv:2503.06810_, 2025.


[98] Jiayi Fu, Xuandong Zhao, Chengyuan Yao, Heng Wang, Qi Han, and Yanghua Xiao. Reward shaping to mitigate
reward hacking in RLHF. In _ICML 2025 Workshop on Reliable and Responsible Foundation Models_, 2025. URL
`[https://openreview.net/forum?id=62A4d5Mokc](https://openreview.net/forum?id=62A4d5Mokc)` .


33


Reward Hacking in the Era of Large Models Fudan NLP Group


[99] Huaisheng Zhu, Siyuan Xu, Hangfan Zhang, Teng Xiao, Zhimeng Guo, Shijie Zhou, Shuyue Hu, and Vasant G
Honavar. Reinforcement learning for large language models via group preference reward shaping. In _Proceedings_
_of the 2025 Conference on Empirical Methods in Natural Language Processing_, pages 21398–21411, 2025.


[100] Xiaoying Zhang, Jean-François Ton, Wei Shen, Hongning Wang, and Yang Liu. Mitigating reward overoptimization via lightweight uncertainty estimation. In _Proceedings_ _of_ _the_ _38th_ _International_ _Conference_ _on_
_Neural Information Processing Systems_, NIPS ’24, Red Hook, NY, USA, 2024. Curran Associates Inc. ISBN
9798331314385.


[101] Yuu Jinnai, Tetsuro Morimura, Kaito Ariu, and Kenshi Abe. Regularized best-of-n sampling with minimum
bayes risk objective for language model alignment. In _Proceedings of the 2025 Conference of the Nations of the_
_Americas Chapter of the Association for Computational Linguistics:_ _Human Language Technologies (Volume 1:_
_Long Papers)_, pages 9321–9347, 2025.


[102] Wei Xiong, Hanze Dong, Chenlu Ye, Ziqi Wang, Han Zhong, Heng Ji, Nan Jiang, and Tong Zhang. Iterative
preference learning from human feedback: Bridging theory and practice for RLHF under KL-constraint. In
Ruslan Salakhutdinov, Zico Kolter, Katherine Heller, Adrian Weller, Nuria Oliver, Jonathan Scarlett, and
Felix Berkenkamp, editors, _Proceedings of the 41st International Conference on Machine Learning_, volume
235 of _Proceedings_ _of_ _Machine_ _Learning_ _Research_, pages 54715–54754. PMLR, 21–27 Jul 2024. URL
`[https://proceedings.mlr.press/v235/xiong24a.html](https://proceedings.mlr.press/v235/xiong24a.html)` .


[103] Weizhe Yuan, Richard Yuanzhe Pang, Kyunghyun Cho, Xian Li, Sainbayar Sukhbaatar, Jing Xu, and Jason E
Weston. Self-rewarding language models. In Ruslan Salakhutdinov, Zico Kolter, Katherine Heller, Adrian Weller,
Nuria Oliver, Jonathan Scarlett, and Felix Berkenkamp, editors, _Proceedings of the 41st International Conference_
_on Machine Learning_, volume 235 of _Proceedings of Machine Learning Research_, pages 57905–57923. PMLR,
21–27 Jul 2024. URL `[https://proceedings.mlr.press/v235/yuan24d.html](https://proceedings.mlr.press/v235/yuan24d.html)` .


[104] Pengyu Cheng, Yifan Yang, Jian Li, Yong Dai, Tianhao Hu, Peixin Cao, Nan Du, and Xiaolong Li. Adversarial
preference optimization: Enhancing your alignment via RM-LLM game. In Lun-Wei Ku, Andre Martins,
and Vivek Srikumar, editors, _Findings_ _of_ _the_ _Association_ _for_ _Computational_ _Linguistics:_ _ACL_ _2024_, pages
3705–3716, Bangkok, Thailand, August 2024. Association for Computational Linguistics. doi: 10.18653/v1/
2024.findings-acl.221. URL `[https://aclanthology.org/2024.findings-acl.221/](https://aclanthology.org/2024.findings-acl.221/)` .


[105] Tianjiao Li, Mengran Yu, Chenyu Shi, Yanjun Zhao, Xiaojing Liu, Qiang Zhang, Qi Zhang, Xuanjing Huang, and
Jiayin Wang. Rival: Reinforcement learning with iterative and adversarial optimization for machine translation,
2025. URL `[https://arxiv.org/abs/2506.05070](https://arxiv.org/abs/2506.05070)` .


[106] Andreas Köpf, Yannic Kilcher, Dimitri von Rütte, Sotiris Anagnostidis, Zhi Rui Tam, Keith Stevens, Abdullah
Barhoum, Duc Nguyen, Oliver Stanley, Richárd Nagyfi, Shahul ES, Sameer Suri, David Glushkov, Arnav
Dantuluri, Andrew Maguire, Christoph Schuhmann, Huu Nguyen, and Alexander Mattick. Openassistant
conversations - democratizing large language model alignment. In A. Oh, T. Naumann, A. Globerson, K. Saenko,
M. Hardt, and S. Levine, editors, _Advances in Neural Information Processing Systems_, volume 36, pages 47669–
47681. Curran Associates, Inc., 2023. URL `[https://proceedings.neurips.cc/paper_files/paper/](https://proceedings.neurips.cc/paper_files/paper/2023/file/949f0f8f32267d297c2d4e3ee10a2e7e-Paper-Datasets_and_Benchmarks.pdf)`
`[2023/file/949f0f8f32267d297c2d4e3ee10a2e7e-Paper-Datasets_and_Benchmarks.pdf](https://proceedings.neurips.cc/paper_files/paper/2023/file/949f0f8f32267d297c2d4e3ee10a2e7e-Paper-Datasets_and_Benchmarks.pdf)` .


[107] Zhilin Wang, Yi Dong, Jiaqi Zeng, Virginia Adams, Makesh Narsimhan Sreedhar, Daniel Egert, Olivier Delalleau,
Jane Scowcroft, Neel Kant, Aidan Swope, and Oleksii Kuchaiev. HelpSteer: Multi-attribute helpfulness dataset
for SteerLM. In Kevin Duh, Helena Gomez, and Steven Bethard, editors, _Proceedings of the 2024 Conference of_
_the North American Chapter of the Association for Computational Linguistics:_ _Human Language Technologies_
_(Volume 1:_ _Long Papers)_, pages 3371–3384, Mexico City, Mexico, June 2024. Association for Computational
Linguistics. doi: 10.18653/v1/2024.naacl-long.185. URL `[https://aclanthology.org/2024.naacl-long.](https://aclanthology.org/2024.naacl-long.185/)`
`[185/](https://aclanthology.org/2024.naacl-long.185/)` .


[108] Zhilin Wang, Yi Dong, Olivier Delalleau, Jiaqi Zeng, Gerald Shen, Daniel Egert, Jimmy J. Zhang, Makesh Narsimhan Sreedhar, and Oleksii Kuchaiev. Helpsteer 2: Open-source dataset for training top-performing reward
models. In _The Thirty-eight Conference on Neural Information Processing Systems Datasets and Benchmarks_
_Track_, 2024. URL `[https://openreview.net/forum?id=PvVKUFhaNy](https://openreview.net/forum?id=PvVKUFhaNy)` .


[109] Ganqu Cui, Lifan Yuan, Ning Ding, Guanming Yao, Bingxiang He, Wei Zhu, Yuan Ni, Guotong Xie, Ruobing
Xie, Yankai Lin, Zhiyuan Liu, and Maosong Sun. ULTRAFEEDBACK: Boosting language models with scaled
AI feedback. In Ruslan Salakhutdinov, Zico Kolter, Katherine Heller, Adrian Weller, Nuria Oliver, Jonathan
Scarlett, and Felix Berkenkamp, editors, _Proceedings of the 41st International Conference on Machine Learning_,


34


Reward Hacking in the Era of Large Models Fudan NLP Group


volume 235 of _Proceedings of Machine Learning Research_, pages 9722–9744. PMLR, 21–27 Jul 2024. URL
`[https://proceedings.mlr.press/v235/cui24f.html](https://proceedings.mlr.press/v235/cui24f.html)` .


[110] Haoxiang Wang, Yong Lin, Wei Xiong, Rui Yang, Shizhe Diao, Shuang Qiu, Han Zhao, and Tong Zhang.
Arithmetic control of llms for diverse user preferences: Directional preference alignment with multi-objective
rewards. In _ACL_, 2024.


[111] Taneesh Gupta, Shivam Shandilya, Xuchao Zhang, Rahul Madhavan, Supriyo Ghosh, Chetan Bansal, Huaxiu
Yao, and Saravan Rajmohan. Carmo: Dynamic criteria generation for context aware reward modelling. In
_Findings of the Association for Computational Linguistics:_ _ACL 2025_, pages 2202–2261, 2025.


[112] Wenjie Qiu, Yi-Chen Li, Xuqin Zhang, Tianyi Zhang, Yihang Zhang, Zongzhang Zhang, and Yang Yu.
Sentence-level reward model can generalize better for aligning llm from human preference. _arXiv_ _preprint_
_arXiv:2503.04793_, 2025.


[113] Yueqin Yin, Shentao Yang, Yujia Xie, Ziyi Yang, Yuting Sun, Hany Awadalla, Weizhu Chen, and Mingyuan Zhou.
Segmenting text and learning their rewards for improved rlhf in language model. _arXiv preprint arXiv:2501.02790_,
2025.


[114] Zhipeng Chen, Kun Zhou, Wayne Xin Zhao, Junchen Wan, Fuzheng Zhang, Di Zhang, and Ji-Rong Wen. Improving large language models via fine-grained reinforcement learning with minimum editing constraint. In Lun-Wei
Ku, Andre Martins, and Vivek Srikumar, editors, _Findings of the Association for Computational Linguistics:_
_ACL 2024_, pages 5694–5711, Bangkok, Thailand, August 2024. Association for Computational Linguistics. doi:
10.18653/v1/2024.findings-acl.338. URL `[https://aclanthology.org/2024.findings-acl.338/](https://aclanthology.org/2024.findings-acl.338/)` .


[115] Dehong Xu, Liang Qiu, Minseok Kim, Faisal Ladhak, and Jaeyoung Do. Aligning large language models via
fine-grained supervision. In _Proceedings of the 62nd Annual Meeting of the Association for Computational_
_Linguistics (Volume 2:_ _Short Papers)_, pages 673–680, 2024.


[116] Meng Cao, Lei Shu, Lei Yu, Yun Zhu, Nevan Wichers, Yinxiao Liu, and Lei Meng. Enhancing reinforcement
learning with dense rewards from language model critic. In Yaser Al-Onaizan, Mohit Bansal, and Yun-Nung
Chen, editors, _Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing_,
pages 9119–9138, Miami, Florida, USA, November 2024. Association for Computational Linguistics. doi:
10.18653/v1/2024.emnlp-main.515. URL `[https://aclanthology.org/2024.emnlp-main.515/](https://aclanthology.org/2024.emnlp-main.515/)` .


[117] Hongzhan Chen, Tao Yang, Shiping Gao, Ruijun Chen, Xiaojun Quan, Hongtao Tian, and Ting Yao. Discriminative policy optimization for token-level reward models. In _Forty-second International Conference on Machine_
_Learning_, 2025. URL `[https://openreview.net/forum?id=aq3YxKPZBk](https://openreview.net/forum?id=aq3YxKPZBk)` .


[118] Han Zhong, Zikang Shan, Guhao Feng, Wei Xiong, Xinle Cheng, Li Zhao, Di He, Jiang Bian, and Liwei Wang.
DPO meets PPO: Reinforced token optimization for RLHF. In Aarti Singh, Maryam Fazel, Daniel Hsu, Simon
Lacoste-Julien, Felix Berkenkamp, Tegan Maharaj, Kiri Wagstaff, and Jerry Zhu, editors, _Proceedings of the 42nd_
_International Conference on Machine Learning_, volume 267 of _Proceedings of Machine Learning Research_, pages
78498–78521. PMLR, 13–19 Jul 2025. URL `[https://proceedings.mlr.press/v267/zhong25b.html](https://proceedings.mlr.press/v267/zhong25b.html)` .


[119] Eunseop Yoon, Hee Suk Yoon, SooHwan Eom, Gunsoo Han, Daniel Nam, Daejin Jo, Kyoung-Woon On,
Mark Hasegawa-Johnson, Sungwoong Kim, and Chang Yoo. TLCR: Token-level continuous reward for finegrained reinforcement learning from human feedback. In Lun-Wei Ku, Andre Martins, and Vivek Srikumar,
editors, _Findings of the Association for Computational Linguistics:_ _ACL 2024_, pages 14969–14981, Bangkok,
Thailand, August 2024. Association for Computational Linguistics. doi: 10.18653/v1/2024.findings-acl.889.
URL `[https://aclanthology.org/2024.findings-acl.889/](https://aclanthology.org/2024.findings-acl.889/)` .


[120] Han Xia, Songyang Gao, Qiming Ge, Zhiheng Xi, Qi Zhang, and Xuanjing Huang. Inverse-q*: Token level
reinforcement learning for aligning large language models without preference data. In _Conference on Empirical_
_Methods_ _in_ _Natural_ _Language_ _Processing_, 2024. URL `[https://api.semanticscholar.org/CorpusID:](https://api.semanticscholar.org/CorpusID:271962868)`
`[271962868](https://api.semanticscholar.org/CorpusID:271962868)` .


[121] Peiyi Wang, Lei Li, Zhihong Shao, Runxin Xu, Damai Dai, Yifei Li, Deli Chen, Yu Wu, and Zhifang Sui.
Math-shepherd: Verify and reinforce llms step-by-step without human annotations. In _Proceedings of the 62nd_
_Annual Meeting of the Association for Computational Linguistics (Volume 1:_ _Long Papers)_, pages 9426–9439,
2024.


35


Reward Hacking in the Era of Large Models Fudan NLP Group


[122] Congming Zheng, Jiachen Zhu, Zhuoying Ou, Yuxiang Chen, Kangning Zhang, Rong Shan, Zeyu Zheng,
Mengyue Yang, Jianghao Lin, Yong Yu, and Weinan Zhang. A survey of process reward models: From outcome
signals to process supervisions for large language models, 2025. URL `[https://arxiv.org/abs/2510.08049](https://arxiv.org/abs/2510.08049)` .


[123] Pragya Srivastava, Harman Singh, Rahul Madhavan, Gandharv Patil, Sravanti Addepalli, Arun Suggala, Rengarajan Aravamudhan, Soumya Sharma, Anirban Laha, Aravindan Raghuveer, Karthikeyan Shanmugam, and Doina
Precup. Robust reward modeling via causal rubrics. In _The Fourteenth International Conference on Learning_
_Representations_, 2026. URL `[https://openreview.net/forum?id=oP99JQiDYp](https://openreview.net/forum?id=oP99JQiDYp)` .


[124] Zhibin Duan, Guowei Rong, Zhuo Li, Bo Chen, Mingyuan Zhou, and Dandan Guo. Mitigating reward hacking
in rlhf via bayesian non-negative reward modeling, 2026. URL `[https://arxiv.org/abs/2602.10623](https://arxiv.org/abs/2602.10623)` .


[125] Yuyan Bu, Liangyu Huo, Yi Jing, and Qing Yang. Beyond excess and deficiency: Adaptive length bias mitigation
in reward models for rlhf. In _Findings of the Association for Computational Linguistics:_ _NAACL 2025_, 2025. doi:
10.18653/v1/2025.findings-naacl.169. URL `[https://aclanthology.org/2025.findings-naacl.169/](https://aclanthology.org/2025.findings-naacl.169/)` .


[126] Kangwen Zhao, Jianfeng Cai, Jinhua Zhu, Ruopei Sun, Dongyun Xue, Wengang Zhou, Li Li, and Houqiang Li.
Bias fitting to mitigate length bias of reward model in rlhf, 2025. URL `[https://arxiv.org/abs/2505.12843](https://arxiv.org/abs/2505.12843)` .


[127] Yue Yu, Zhengxing Chen, Aston Zhang, Liang Tan, Chenguang Zhu, Richard Yuanzhe Pang, Yundi Qian, Xuewei
Wang, Suchin Gururangan, Chao Zhang, et al. Self-generated critiques boost reward modeling for language
models. In _Proceedings of the 2025 Conference of the Nations of the Americas Chapter of the Association for_
_Computational Linguistics:_ _Human Language Technologies (Volume 1:_ _Long_ _Papers)_, pages 11499–11514,
2025.


[128] Zachary Ankner, Mansheej Paul, Brandon Cui, Jonathan D. Chang, and Prithviraj Ammanabrolu. Critique-outloud reward models, 2024. URL `[https://arxiv.org/abs/2408.11791](https://arxiv.org/abs/2408.11791)` .


[129] Dakota Mahan, Duy Van Phung, Rafael Rafailov, Chase Blagden, Nathan Lile, Louis Castricato, Jan-Philipp
Fränken, Chelsea Finn, and Alon Albalak. Generative reward models, 2024. URL `[https://arxiv.org/abs/](https://arxiv.org/abs/2410.12832)`
`[2410.12832](https://arxiv.org/abs/2410.12832)` .


[130] Lunjun Zhang, Arian Hosseini, Hritik Bansal, Mehran Kazemi, Aviral Kumar, and Rishabh Agarwal. Generative
verifiers: Reward modeling as next-token prediction. In _The Thirteenth International Conference on Learning_
_Representations_, 2025. URL `[https://openreview.net/forum?id=Ccwp4tFEtE](https://openreview.net/forum?id=Ccwp4tFEtE)` .


[131] Jiaxin Guo, Zewen Chi, Li Dong, Qingxiu Dong, Xun Wu, Shaohan Huang, and Furu Wei. Reward reasoning
models. In _The_ _Thirty-ninth_ _Annual_ _Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_, 2025. URL
`[https://openreview.net/forum?id=V8Kbz7l2cr](https://openreview.net/forum?id=V8Kbz7l2cr)` .


[132] Zongqi Wang, Rui Wang, Yuchuan Wu, Yiyao Yu, Pinyi Zhang, Shaoning Sun, Yujiu Yang, and Yongbin Li.
Reward modeling from natural language human feedback, 2026. URL `[https://arxiv.org/abs/2601.07349](https://arxiv.org/abs/2601.07349)` .


[133] Binghai Wang, Yantao Liu, Yuxuan Liu, Tianyi Tang, Shenzhi Wang, Chang Gao, Chujie Zheng, Yichang
Zhang, Le Yu, Shixuan Liu, Tao Gui, Qi Zhang, Xuanjing Huang, Bowen Yu, Fei Huang, and Junyang Lin.
Outcome accuracy is not enough: Aligning the reasoning process of reward models, 2026. URL `[https:](https://arxiv.org/abs/2602.04649)`
`[//arxiv.org/abs/2602.04649](https://arxiv.org/abs/2602.04649)` .


[134] Zijun Yao, Yantao Liu, Yanxu Chen, Jianhui Chen, Junfeng Fang, Lei Hou, Juanzi Li, and Tat-Seng Chua. Are
reasoning models more prone to hallucination? _arXiv preprint arXiv:2505.23646_, 2025.


[135] Mirza Farhan Bin Tarek and Rahmatollah Beheshti. Reward hacking mitigation using verifiable composite
rewards. In _Proceedings of the 16th ACM International Conference on Bioinformatics, Computational Biology,_
_and Health Informatics_, pages 1–6, 2025.


[136] Chenlu Ye, Zhou Yu, Ziji Zhang, Hao Chen, Narayanan Sadagopan, Jing Huang, Tong Zhang, and Anurag
Beniwal. Beyond correctness: Harmonizing process and outcome rewards through rl training. _arXiv preprint_
_arXiv:2509.03403_, 2025.


[137] SHengjie Ma, Chenlong Deng, Jiaxin Mao, Jiadeng Huang, Teng Wang, Junjie Wu, Changwang Zhang, et al.
Pou: Proof-of-use to counter tool-call hacking in deepresearch agents. _arXiv preprint arXiv:2510.10931_, 2025.


36


Reward Hacking in the Era of Large Models Fudan NLP Group


[138] Shaokun Zhang, Yi Dong, Jieyu Zhang, Jan Kautz, Bryan Catanzaro, Andrew Tao, Qingyun Wu, Zhiding Yu,
and Guilin Liu. Nemotron-research-tool-n1: Exploring tool-using language models with reinforced reasoning.
In _The Fourteenth International Conference on Learning Representations_, 2026. URL `[https://openreview.](https://openreview.net/forum?id=yiE16lWzDj)`
`[net/forum?id=yiE16lWzDj](https://openreview.net/forum?id=yiE16lWzDj)` .


[139] Da Ma, Ziyue Yang, Hongshen Xu, Haotian Fang, Lu Chen, and Kai Yu. Empowering LLM tool invocation with
tool-call reward model. In _The Fourteenth International Conference on Learning Representations_, 2026. URL
`[https://openreview.net/forum?id=LnBEASInVr](https://openreview.net/forum?id=LnBEASInVr)` .


[140] Zhiwei Li, Yong Hu, and Wenqing Wang. Encouraging good processes without the need for good answers:
Reinforcement learning for LLM agent planning. In Saloni Potdar, Lina Rojas-Barahona, and Sebastien Montella,
editors, _Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing:_ _Industry_
_Track_, pages 1654–1666, Suzhou (China), November 2025. Association for Computational Linguistics. ISBN
979-8-89176-333-3. doi: 10.18653/v1/2025.emnlp-industry.116. URL `[https://aclanthology.org/2025.](https://aclanthology.org/2025.emnlp-industry.116/)`
`[emnlp-industry.116/](https://aclanthology.org/2025.emnlp-industry.116/)` .


[141] Xiaomin Li, Mingye Gao, Zhiwei Zhang, Jingxuan Fan, and Weiyu Li. RuleAdapter: Dynamic rules for
training safety reward models in RLHF. In Aarti Singh, Maryam Fazel, Daniel Hsu, Simon Lacoste-Julien,
Felix Berkenkamp, Tegan Maharaj, Kiri Wagstaff, and Jerry Zhu, editors, _Proceedings of the 42nd International_
_Conference on Machine Learning_, volume 267 of _Proceedings of Machine Learning Research_, pages 34355–
34378. PMLR, 13–19 Jul 2025. URL `[https://proceedings.mlr.press/v267/li25o.html](https://proceedings.mlr.press/v267/li25o.html)` .


[142] Tianci Liu, Ran Xu, Tony Yu, Ilgee Hong, Carl Yang, Tuo Zhao, and Haoyu Wang. Openrubrics: Towards
scalable synthetic rubric generation for reward modeling and llm alignment. _arXiv preprint arXiv:2510.07743_,
2025.


[143] Lipeng Xie, Sen Huang, Zhuo Zhang, Anni Zou, Yunpeng Zhai, Dingchao Ren, Kezun Zhang, Haoyuan Hu,
Boyin Liu, Haoran Chen, et al. Auto-rubric: Learning to extract generalizable criteria for reward modeling, 2025.
_URL https://arxiv. org/abs/2510.17314_, 2025.


[144] Junkai Zhang, Zihao Wang, Lin Gui, Swarnashree Mysore Sathyendra, Jaehwan Jeong, Victor Veitch, Wei Wang,
Yunzhong He, Bing Liu, and Lifeng Jin. Chasing the tail: Effective rubric-based reward modeling for large
language model post-training. _arXiv preprint arXiv:2509.21500_, 2025.


[145] Yun He, Wenzhe Li, Hejia Zhang, Songlin Li, Karishma Mandyam, Sopan Khosla, Yuanhao Xiong, Nanshu
Wang, Xiaoliang Peng, Beibin Li, et al. Advancedif: Rubric-based benchmarking and reinforcement learning for
advancing llm instruction following. _arXiv preprint arXiv:2511.10507_, 2025.


[146] Kwangwook Seo and Dongha Lee. P-check: Advancing personalized reward model via learning to generate
dynamic checklist, 2026. URL `[https://arxiv.org/abs/2601.02986](https://arxiv.org/abs/2601.02986)` .


[147] Manasi Sharma, Chen Bo Calvin Zhang, Chaithanya Bandi, Clinton Wang, Ankit Aich, Huy Nghiem, Tahseen
Rabbani, Ye Htet, Brian Jang, Sumana Basu, et al. Researchrubrics: A benchmark of prompts and rubrics for
evaluating deep research agents. _arXiv preprint arXiv:2511.07685_, 2025.


[148] Rulin Shao, Akari Asai, Shannon Zejiang Shen, Hamish Ivison, Varsha Kishore, Jingming Zhuo, Xinran Zhao,
Molly Park, Samuel G Finlayson, David Sontag, et al. Dr tulu: Reinforcement learning with evolving rubrics for
deep research. _arXiv preprint arXiv:2511.19399_, 2025.


[149] Rahul K Arora, Jason Wei, Rebecca Soskin Hicks, Preston Bowman, Joaquin Quiñonero-Candela, Foivos
Tsimpourlas, Michael Sharman, Meghan Shah, Andrea Vallone, Alex Beutel, et al. Healthbench: Evaluating
large language models towards improved human health. _arXiv preprint arXiv:2505.08775_, 2025.


[150] Zhichao Yang, Sepehr Janghorbani, Dongxu Zhang, Jun Han, Qian Qian, Andrew Ressler II, Gregory D Lyng,
Sanjit Singh Batra, and Robert E Tillman. Health-score: Towards scalable rubrics for improving health-llms.
_arXiv preprint arXiv:2601.18706_, 2026.


[151] Zijie Chen, Zhenghao Lin, Xiao Liu, Zhenzhong Lan, Yeyun Gong, and Peng Cheng. Improving data and reward
design for scientific reasoning in large language models, 2026. URL `[https://arxiv.org/abs/2602.08321](https://arxiv.org/abs/2602.08321)` .


[152] William F Shen, Xinchi Qiu, Chenxi Whitehouse, Lisa Alazraki, Shashwat Goel, Francesco Barbieri, Timon
Willi, Akhil Mathur, and Ilias Leontiadis. Rethinking rubric generation for improving llm judge and reward
modeling for open-ended tasks. _arXiv preprint arXiv:2602.05125_, 2026.


37


Reward Hacking in the Era of Large Models Fudan NLP Group


[153] Sunzhu Li, Jiale Zhao, Miteto Wei, Huimin Ren, Yang Zhou, Jingwen Yang, Shunyu Liu, Kaike Zhang, and
Wei Chen. Rubrichub: A comprehensive and highly discriminative rubric dataset via automated coarse-to-fine
generation. _arXiv preprint arXiv:2601.08430_, 2026.


[154] Cassidy Laidlaw, Shivam Singhal, and Anca Dragan. Correlated proxies: A new definition and improved
mitigation for reward hacking. In _The Thirteenth International Conference on Learning Representations_, 2025.
URL `[https://openreview.net/forum?id=msEr27EejF](https://openreview.net/forum?id=msEr27EejF)` .


[155] Yuda Song, Gokul Swamy, Aarti Singh, J Bagnell, and Wen Sun. The importance of online data: Understanding
preference fine-tuning via coverage. _Advances in Neural Information Processing Systems_, 37:12243–12270,
2024.


[156] Zihao Wang, Chirag Nagpal, Jonathan Berant, Jacob Eisenstein, Alex D’Amour, Sanmi Koyejo, and Victor
Veitch. Transforming and combining rewards for aligning large language models. In _Proceedings of the 41st_
_International Conference on Machine Learning_, ICML’24. JMLR.org, 2024.


[157] Josef Dai, Xuehai Pan, Ruiyang Sun, Jiaming Ji, Xinbo Xu, Mickel Liu, Yizhou Wang, and Yaodong Yang. Safe
RLHF: Safe reinforcement learning from human feedback. In _The Twelfth International Conference on Learning_
_Representations_, 2024. URL `[https://openreview.net/forum?id=TyFrPOKYXw](https://openreview.net/forum?id=TyFrPOKYXw)` .


[158] Yuki Ichihara, Yuu Jinnai, Tetsuro Morimura, Kenshi Abe, Kaito Ariu, Mitsuki Sakamoto, and Eiji Uchibe.
Evaluation of best-of-n sampling strategies for language model alignment. _Transactions on Machine Learning_
_Research_, 2025. ISSN 2835-8856. URL `[https://openreview.net/forum?id=H4S4ETc8c9](https://openreview.net/forum?id=H4S4ETc8c9)` .


[159] Haichuan Wang, Tao Lin, Lingkai Kong, Ce Li, Hezi Jiang, and Milind Tambe. Reward shaping for inference-time
alignment: A stackelberg game perspective. _arXiv preprint arXiv:2602.02572_, 2026.


[160] Shangmin Guo, Biao Zhang, Tianlin Liu, Tianqi Liu, Misha Khalman, Felipe Llinares, Alexandre Rame, Thomas
Mesnard, Yao Zhao, Bilal Piot, et al. Direct language model alignment from online ai feedback. _arXiv preprint_
_arXiv:2402.04792_, 2024.


[161] Yidong Wang, Xin Wang, Cunxiang Wang, Junfeng Fang, Qiufeng Wang, Jianing Chu, Xuran Meng, Shuxun
Yang, Libo Qin, Yue Zhang, Wei Ye, and Shikun Zhang. Temporal self-rewarding language models: Decoupling
chosen-rejected via past-future, 2025. URL `[https://arxiv.org/abs/2508.06026](https://arxiv.org/abs/2508.06026)` .


[162] Zhaoyang Wang, Weilei He, Zhiyuan Liang, Xuchao Zhang, Chetan Bansal, Ying Wei, Weitong Zhang, and
Huaxiu Yao. CREAM: Consistency regularized self-rewarding language models. In _The Thirteenth International_
_Conference on Learning Representations_, 2025. URL `[https://openreview.net/forum?id=Vf6RDObyEF](https://openreview.net/forum?id=Vf6RDObyEF)` .


[163] Changyu Chen, Zichen Liu, Chao Du, Tianyu Pang, Qian Liu, Arunesh Sinha, Pradeep Varakantham, and Min
Lin. Bootstrapping language models with DPO implicit rewards. In _The Thirteenth International Conference on_
_Learning Representations_, 2025. URL `[https://openreview.net/forum?id=dliIIodM6b](https://openreview.net/forum?id=dliIIodM6b)` .


[164] Songshuo Lu, Hua Wang, Zhi Chen, and Yaohua Tang. Urpo: A unified reward & policy optimization framework
for large language models, 2025. URL `[https://arxiv.org/abs/2507.17515](https://arxiv.org/abs/2507.17515)` .


[165] Hai Le Hong, Yuchen Yan, Xingyu Wu, Guiyang Hou, Wenqi Zhang, Weiming Lu, Yongliang Shen, and Jun
Xiao. Cooper: Co-optimizing policy and reward models in reinforcement learning for large language models.
_ArXiv_, abs/2508.05613, 2025. URL `[https://api.semanticscholar.org/CorpusID:280546264](https://api.semanticscholar.org/CorpusID:280546264)` .


[166] Zongxia Li, Wenhao Yu, Chengsong Huang, Rui Liu, Zhenwen Liang, Fuxiao Liu, Jingxi Che, Dian Yu, Jordan
Boyd-Graber, Haitao Mi, et al. Self-rewarding vision-language model via reasoning decomposition. _arXiv_
_preprint arXiv:2508.19652_, 2025.


[167] Chi Zhang, Haibo Qiu, Qiming Zhang, Yufei Xu, Zhixiong Zeng, Siqi Yang, Peng Shi, Lin Ma, and Jing Zhang.
Perceptual-evidence anchored reinforced learning for multimodal reasoning. _arXiv preprint arXiv:2511.18437_,
2025.


[168] Kaixuan Fan, Kaituo Feng, Haoming Lyu, Dongzhan Zhou, and Xiangyu Yue. Sophiavl-r1: Reinforcing mllms
reasoning with thinking reward. _arXiv preprint arXiv:2505.17018_, 2025.


[169] Yuqi Zhou, Sunhao Dai, Shuai Wang, Kaiwen Zhou, Qinglin Jia, and Jun Xu. Gui-g1: Understanding r1-zero-like
training for visual grounding in gui agents. _arXiv preprint arXiv:2505.15810_, 2025.


38


Reward Hacking in the Era of Large Models Fudan NLP Group


[170] Yeyao Ma, Chen Li, Xiaosong Zhang, Han Hu, and Weidi Xie. Fail: Flow matching adversarial imitation learning
for image generation. _arXiv preprint arXiv:2602.12155_, 2026.


[171] Rohit Jena, Ali Taghibakhshi, Sahil Jain, Gerald Shen, Nima Tajbakhsh, and Arash Vahdat. Elucidating
optimal reward-diversity tradeoffs in text-to-image diffusion models. In _2025 IEEE/CVF Winter Conference on_
_Applications of Computer Vision (WACV)_, pages 232–242. IEEE, 2025.


[172] Qingming Liu, Zhen Liu, Dinghuai Zhang, and Kui Jia. Nabla-r2d3: Effective and efficient 3d diffusion
alignment with 2d rewards. _arXiv preprint arXiv:2506.15684_, 2025.


[173] Seungwook Kim and Minsu Cho. Improving text-to-image generation with intrinsic self-confidence rewards.
_arXiv preprint arXiv:2603.00918_, 2026.


[174] Yiyang Wang, Xi Chen, Xiaogang Xu, Yu Liu, and Hengshuang Zhao. Gdro: Group-level reward post-training
suitable for diffusion models. _arXiv preprint arXiv:2601.02036_, 2026.


[175] Xinhai Hou, Shaoyuan Xu, Manan Biyani, Moyan Li, Jia Liu, Todd C Hollon, and Bryan Wang. Codev: Code
with images for faithful visual reasoning via tool-aware policy optimization. _arXiv preprint arXiv:2511.19661_,
2025.


[176] Shiyang Li, Zijian Zhang, Winson Chen, Yuebo Luo, Mingyi Hong, and Caiwen Ding. Stitchcuda: An automated
multi-agents end-to-end gpu programing framework with rubric-based agentic reinforcement learning. _arXiv_
_preprint arXiv:2603.02637_, 2026.


[177] Sebastian Farquhar, Vikrant Varma, David Lindner, David Elson, Caleb Biddulph, Ian Goodfellow, and Rohin
Shah. Mona: Myopic optimization with non-myopic approval can mitigate multi-step reward hacking. _arXiv_
_preprint arXiv:2501.13011_, 2025.


[178] Yukun Chen, Jiaming Li, Longze Chen, Ze Gong, Jingpeng Li, Zhen Qin, Hengyu Chang, Ancheng Xu, Zhihao
Yang, Hamid Alinejad-Rokny, et al. Rucl: Stratified rubric-based curriculum learning for multimodal large
language model reasoning. _arXiv preprint arXiv:2602.21628_, 2026.


[179] Tingyu Li, Zheng Sun, Jingxuan Wei, Siyuan Li, Conghui He, Lijun Wu, and Cheng Tan. Decouple to generalize:
Context-first self-evolving learning for data-scarce vision-language reasoning. _arXiv preprint arXiv:2512.06835_,
2025.


[180] Jiayi Zhou, Jiaming Ji, Boyuan Chen, Jiapeng Sun, Wenqi Chen, Donghai Hong, Sirui Han, Yike Guo, and
Yaodong Yang. Generative rlhf-v: Learning principles from multi-modal human preference. _arXiv preprint_
_arXiv:2505.18531_, 2025.


[181] Jiesong Lian, Ruizhe Zhong, Zixiang Zhou, Xiaoyue Mi, Yixue Hao, Yuan Zhou, Qinglin Lu, Long Hu, and
Junchi Yan. Solireward: Mitigating susceptibility to reward hacking and annotation noise in video generation
reward models. _arXiv preprint arXiv:2512.22170_, 2025.


[182] Yidi Liu, Zihao Fan, Jie Huang, Jie Xiao, Dong Li, Wenlong Zhang, Lei Bai, Xueyang Fu, and Zheng-Jun
Zha. Finpercep-rm: A fine-grained reward model and co-evolutionary curriculum for rl-based real-world
super-resolution. _arXiv preprint arXiv:2512.22647_, 2025.


[183] Yibin Wang, Zhimin Li, Yuhang Zang, Yujie Zhou, Jiazi Bu, Chunyu Wang, Qinglin Lu, Cheng Jin, and Jiaqi
Wang. Pref-grpo: Pairwise preference reward-based grpo for stable text-to-image reinforcement learning. _arXiv_
_preprint arXiv:2508.20751_, 2025.


[184] Junjielong Xu, Boyin Tan, Xiaoyuan Liu, Chao Peng, Pengfei Gao, and Pinjia He. Scalable supervising software
agents with patch reasoner. _arXiv preprint arXiv:2510.22775_, 2025.


[185] Yuhang Li, Chenchen Zhang, Ruilin Lv, Ao Liu, Ken Deng, Yuanxing Zhang, Jiaheng Liu, Wiggin Zhou, and
Bo Zhou. Relook: Vision-grounded rl with a multimodal llm critic for agentic web coding. _arXiv_ _preprint_
_arXiv:2510.11498_, 2025.


[186] Xingyu Lu, Jinpeng Wang, YiFan Zhang, Shijie Ma, Xiao Hu, Tianke Zhang, Kaiyu Jiang, Changyi Liu, Kaiyu
Tang, Bin Wen, et al. Contextrl: Enhancing mllm’s knowledge discovery efficiency with context-augmented rl.
_arXiv preprint arXiv:2602.22623_, 2026.


39


Reward Hacking in the Era of Large Models Fudan NLP Group


[187] Reuben Tan, Baolin Peng, Zhengyuan Yang, Hao Cheng, Oier Mees, Theodore Zhao, Andrea Tupini, Isar Meijier,
Qianhui Wu, Yuncong Yang, et al. Multimodal reinforcement learning with agentic verifier for ai agents. _arXiv_
_preprint arXiv:2512.03438_, 2025.


[188] Yufei Zhan, Yousong Zhu, Shurong Zheng, Hongyin Zhao, Fan Yang, Ming Tang, and Jinqiao Wang. Vision-r1:
Evolving human-free alignment in large vision-language models via vision-guided reinforcement learning. _arXiv_
_preprint arXiv:2503.18013_, 2025.


[189] Haozhan Shen, Peng Liu, Jingcheng Li, Chunxin Fang, Yibo Ma, Jiajia Liao, Qiaoli Shen, Zilun Zhang, Kangjia
Zhao, Qianqian Zhang, et al. Vlm-r1: A stable and generalizable r1-style large vision-language model. _arXiv_
_preprint arXiv:2504.07615_, 2025.


[190] Jiajun Fan, Tong Wei, Chaoran Cheng, Yuxin Chen, and Ge Liu. Adaptive divergence regularized policy
optimization for fine-tuning generative models. _arXiv preprint arXiv:2510.18053_, 2025.


[191] Yunlong Lin, Linqing Wang, Kunjie Lin, Zixu Lin, Kaixiong Gong, Wenbo Li, Bin Lin, Zhenxi Li, Shiyi Zhang,
Yuyang Peng, et al. Jarvisevo: Towards a self-evolving photo editing agent with synergistic editor-evaluator
optimization. _arXiv preprint arXiv:2511.23002_, 2025.


[192] Bin Wu, Wei Wang, Yahui Liu, Zixiang Li, and Yao Zhao. Diffusionreward: Enhancing blind face restoration
through reward feedback learning. _arXiv preprint arXiv:2505.17910_, 2025.


[193] Chubin Chen, Sujie Hu, Jiashu Zhu, Meiqi Wu, Jintao Chen, Yanxun Li, Nisha Huang, Chengyu Fang, Jiahong
Wu, Xiangxiang Chu, et al. Taming preference mode collapse via directional decoupling alignment in diffusion
reinforcement learning. _arXiv preprint arXiv:2512.24146_, 2025.


[194] Pranjal Aggarwal, Bryan Parno, and Sean Welleck. Alphaverus: Bootstrapping formally verified code generation
through self-improving translation and treefinement. _arXiv preprint arXiv:2412.06176_, 2024.


[195] Wangtao Sun, Xiang Cheng, Jialin Fan, Yao Xu, Xing Yu, Shizhu He, Jun Zhao, and Kang Liu. Towards agentic
self-learning llms in search environment. _arXiv preprint arXiv:2510.14253_, 2025.


[196] Shuai Bai, Yuxuan Cai, Ruizhe Chen, Keqin Chen, Xionghui Chen, Zesen Cheng, Lianghao Deng, Wei Ding,
Chang Gao, Chunjiang Ge, et al. Qwen3-vl technical report. _arXiv preprint arXiv:2511.21631_, 2025.


[197] Bo Li, Yuanhan Zhang, Dong Guo, Renrui Zhang, Feng Li, Hao Zhang, Kaichen Zhang, Peiyuan Zhang, Yanwei
Li, Ziwei Liu, et al. Llava-onevision: Easy visual task transfer. _arXiv preprint arXiv:2408.03326_, 2024.


[198] Aaron Hurst, Adam Lerer, Adam P Goucher, Adam Perelman, Aditya Ramesh, Aidan Clark, AJ Ostrow, Akila
Welihinda, Alan Hayes, Alec Radford, et al. Gpt-4o system card. _arXiv preprint arXiv:2410.21276_, 2024.


[199] Gheorghe Comanici, Eric Bieber, Mike Schaekermann, Ice Pasupat, Noveen Sachdeva, Inderjit Dhillon, Marcel
Blistein, Ori Ram, Dan Zhang, Evan Rosen, et al. Gemini 2.5: Pushing the frontier with advanced reasoning,
multimodality, long context, and next generation agentic capabilities. _arXiv preprint arXiv:2507.06261_, 2025.


[200] Tianshuo Peng, Mingsheng Li, Jiakang Yuan, Hongbin Zhou, Renqiu Xia, Renrui Zhang, Lei Bai, Song Mao, Bin
Wang, Aojun Zhou, et al. Chimera: Improving generalist model with domain-specific experts. In _Proceedings of_
_the IEEE/CVF International Conference on Computer Vision_, pages 3011–3022, 2025.


[201] William Peebles and Saining Xie. Scalable diffusion models with transformers. In _Proceedings of the IEEE/CVF_
_international conference on computer vision_, pages 4195–4205, 2023.


[202] Qi Qin, Le Zhuo, Yi Xin, Ruoyi Du, Zhen Li, Bin Fu, Yiting Lu, Xinyue Li, Dongyang Liu, Xiangyang Zhu,
et al. Lumina-image 2.0: A unified and efficient image generative framework. In _Proceedings of the IEEE/CVF_
_International Conference on Computer Vision_, pages 20031–20042, 2025.


[203] Yaron Lipman, Ricky TQ Chen, Heli Ben-Hamu, Maximilian Nickel, and Matt Le. Flow matching for generative
modeling. _arXiv preprint arXiv:2210.02747_, 2022.


[204] Guanting Dong, Hangyu Mao, Kai Ma, Licheng Bao, Yifei Chen, Zhongyuan Wang, Zhongxia Chen, Jiazhen Du,
Huiyang Wang, Fuzheng Zhang, et al. Agentic reinforced policy optimization. _arXiv preprint arXiv:2507.19849_,
2025.


40


Reward Hacking in the Era of Large Models Fudan NLP Group


[205] Tongyi DeepResearch Team, Baixuan Li, Bo Zhang, Dingchu Zhang, Fei Huang, Guangyu Li, Guoxin
Chen, Huifeng Yin, Jialong Wu, Jingren Zhou, et al. Tongyi deepresearch technical report. _arXiv_ _preprint_
_arXiv:2510.24701_, 2025.


[206] MiroMind Team, Song Bai, Lidong Bing, Carson Chen, Guanzheng Chen, Yuntao Chen, Zhe Chen, Ziyi Chen,
Jifeng Dai, Xuan Dong, et al. Mirothinker: Pushing the performance boundaries of open-source research agents
via model, context, and interactive scaling. _arXiv preprint arXiv:2511.11793_, 2025.


[207] Shiyang Feng, Runmin Ma, Xiangchao Yan, Yue Fan, Yusong Hu, Songtao Huang, Shuaiyu Zhang, Zongsheng
Cao, Tianshuo Peng, Jiakang Yuan, et al. Internagent-1.5: A unified agentic framework for long-horizon
autonomous scientific discovery. _arXiv preprint arXiv:2602.08990_, 2026.


[208] Ruilin Luo, Zhuofan Zheng, Yifan Wang, Xinzhe Ni, Zicheng Lin, Songtao Jiang, Yiyao Yu, Chufan Shi, Lei
Wang, Ruihang Chu, et al. Unlocking multimodal mathematical reasoning via process reward model. _arXiv_
_preprint arXiv:2501.04686_, 2025.


[209] Xiaopeng Sun, Qinwei Lin, Yu Gao, Yujie Zhong, Chengjian Feng, Dengjie Li, Zheng Zhao, Jie Hu, and Lin Ma.
Rfsr: Improving isr diffusion models via reward feedback learning. _arXiv preprint arXiv:2412.03268_, 2024.


[210] Guanjie Chen, Shirui Huang, Kai Liu, Jianchen Zhu, Xiaoye Qu, Peng Chen, Yu Cheng, and Yifu Sun. Flash-dmd:
Towards high-fidelity few-step image generation with efficient distillation and joint reinforcement learning. _arXiv_
_preprint arXiv:2511.20549_, 2025.


[211] Zihao Fan, Xin Lu, Yidi Liu, Jie Huang, Dong Li, Xueyang Fu, and Zheng-Jun Zha. Bidirectional reward-guided
diffusion for real-world image super-resolution. _arXiv preprint arXiv:2602.07069_, 2026.


[212] Yunqi Hong, Kuei-Chun Kao, Hengguang Zhou, and Cho-Jui Hsieh. Understanding reward hacking in text-toimage reinforcement learning. _arXiv preprint arXiv:2601.03468_, 2026.


[213] Shivanshu Shekhar, Shreyas Singh, and Tong Zhang. See-dpo: Self entropy enhanced direct preference
optimization. _arXiv preprint arXiv:2411.04712_, 2024.


[214] Yifan Wang, Yanyu Li, Sergey Tulyakov, Yun Fu, and Anil Kag. Diffusion-drf: Differentiable reward flow for
video diffusion fine-tuning. _arXiv preprint arXiv:2601.04153_, 2026.


[215] Zehan Wang, Tengfei Wang, Haiyu Zhang, Xuhui Zuo, Junta Wu, Haoyuan Wang, Wenqiang Sun, Zhenwei
Wang, Chenjie Cao, Hengshuang Zhao, et al. Worldcompass: Reinforcement learning for long-horizon world
models. _arXiv preprint arXiv:2602.09022_, 2026.


[216] Haotian Ye, Kaiwen Zheng, Jiashu Xu, Puheng Li, Huayu Chen, Jiaqi Han, Sheng Liu, Qinsheng Zhang, Hanzi
Mao, Zekun Hao, et al. Data-regularized reinforcement learning for diffusion models at scale. _arXiv preprint_
_arXiv:2512.04332_, 2025.


[217] Kaiwen Duan, Hongwei Yao, Yufei Chen, Ziyun Li, Tong Qiao, Zhan Qin, and Cong Wang. Badreward:
Clean-label poisoning of reward models in text-to-image rlhf. _arXiv preprint arXiv:2506.03234_, 2025.


[218] Tianning Chai, Chancharik Mitra, Brandon Huang, Gautam Rajendrakumar Gare, Zhiqiu Lin, Assaf Arbelle,
Leonid Karlinsky, Rogerio Feris, Trevor Darrell, Deva Ramanan, et al. Activation reward models for few-shot
model alignment. _arXiv preprint arXiv:2507.01368_, 2025.


[219] Haoran He, Yuxiao Ye, Jie Liu, Jiajun Liang, Zhiyong Wang, Ziyang Yuan, Xintao Wang, Hangyu Mao,
Pengfei Wan, and Ling Pan. Gardo: Reinforcing diffusion models without reward hacking. _arXiv_ _preprint_
_arXiv:2512.24138_, 2025.


[220] Shivanshu Shekhar and Tong Zhang. Rocm: Rlhf on consistency models. _arXiv preprint arXiv:2503.06171_,
2025.


[221] Weijia Mao, Hao Chen, Zhenheng Yang, and Mike Zheng Shou. The image as its own reward: Reinforcement
learning with adversarial reward for image generation. _arXiv preprint arXiv:2511.20256_, 2025.


[222] Wangbo Zhao, Yizeng Han, Zhiwei Tang, Jiasheng Tang, Pengfei Zhou, Kai Wang, Bohan Zhuang, Zhangyang
Wang, Fan Wang, and Yang You. Rapidˆ 3: Tri-level reinforced acceleration policies for diffusion transformer.
_arXiv preprint arXiv:2509.22323_, 2025.


41


Reward Hacking in the Era of Large Models Fudan NLP Group


[223] Yutao Shen, Junkun Yuan, Toru Aonishi, Hideki Nakayama, and Yue Ma. Follow-your-preference: Towards
preference-aligned image inpainting. _arXiv preprint arXiv:2509.23082_, 2025.


[224] Zheyuan Zhou, Jiayi Han, Liang Du, Naiyu Fang, Lemiao Qiu, and Shuyou Zhang. Cad-judge: Toward efficient
morphological grading and verification for text-to-cad generation. _arXiv preprint arXiv:2508.04002_, 2025.


[225] Xiaoxiao Ma, Haibo Qiu, Guohui Zhang, Zhixiong Zeng, Siqi Yang, Lin Ma, and Feng Zhao. Stage: Stable and
generalizable grpo for autoregressive image generation. _arXiv preprint arXiv:2509.25027_, 2025.


[226] Bodhisatwa Chatterjee, Drew Zagieboylo, Sana Damani, Siva Hari, and Christos Kozyrakis. Proofwright:
Towards agentic formal verification of cuda. _arXiv preprint arXiv:2511.12294_, 2025.


[227] Chenlu Ye, Wei Xiong, Yuheng Zhang, Hanze Dong, Nan Jiang, and Tong Zhang. Online iterative reinforcement learning from human feedback with general preference model. In A. Globerson,
L. Mackey, D. Belgrave, A. Fan, U. Paquet, J. Tomczak, and C. Zhang, editors, _Advances_ _in_ _Neural_
_Information_ _Processing_ _Systems_, volume 37, pages 81773–81807. Curran Associates, Inc., 2024. doi:
10.52202/079017-2598. URL `[https://proceedings.neurips.cc/paper_files/paper/2024/file/](https://proceedings.neurips.cc/paper_files/paper/2024/file/94d13c2401fe119e57ba325b6fe526e0-Paper-Conference.pdf)`
`[94d13c2401fe119e57ba325b6fe526e0-Paper-Conference.pdf](https://proceedings.neurips.cc/paper_files/paper/2024/file/94d13c2401fe119e57ba325b6fe526e0-Paper-Conference.pdf)` .


42


