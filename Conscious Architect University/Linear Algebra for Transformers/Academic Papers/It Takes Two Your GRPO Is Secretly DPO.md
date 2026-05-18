## **It Takes Two: Your GRPO Is Secretly DPO**

**Yihong Wu** [* 1] **Liheng Ma** [* 2 3] **Lei Ding** [4] **Muzhi Li** [5] **Xinyu Wang** [2] **Kejia Chen** [6] **Zhan Su** [1]

**Chenyang Huang** [7 8] **Zhanguang Zhang** [9] **Derek Li** [9] **Yingxue Zhang** [9] **Jian-Yun Nie** [1] **Mark Coates** [2]



**Abstract**


Group Relative Policy Optimization (GRPO) has
emerged as a prominent reinforcement learning
algorithm for post-training Large Language Models. Different from critic-based methods such as
PPO, GRPO estimates the advantage function using group-level statistics to reduce the variance
of policy gradient estimators. While the prevailing view attributes GRPO’s effectiveness to large
group sizes for accurate advantage estimation,
we propose a different perspective. In this work,
we demonstrate that the efficacy of GRPO stems
from its implicit contrastive objective in the optimization, which helps reduce variance via the
control variate method. This perspective establishes a fundamental connection between GRPO
and DPO, wherein group size influences only the
Monte Carlo estimators of the contrastive objective. To validate this, we investigate the minimal two-rollout case (2-GRPO), a configuration
permissible under the contrastive framework but
typically considered insufficient for baseline estimation. We provide a rigorous theoretical analysis
of 2-GRPO and empirically validate its effectiveness: 2-GRPO retains 98 _._ 1% of the performance
of 16-GRPO, while requiring only 12 _._ 5% of the
rollouts and 21% of the training time. This study
offers a new perspective for future algorithm design in LLM post-training.


**1. Introduction**


Reinforcement Learning (RL) has emerged as a central
paradigm for the post-training of Large Language Models (LLMs). Two critical functions are aligning model
outputs with human intent via RL with Human Feed

1Universite de Montr´ eal´ 2McGill University 3Mila - Quebec
AI Institute [4] University of Manitoba [5] The Chinese University of
Hong Kong [6] Zhejiang University [7] University of Alberta [8] Alberta
Machine Intelligence Institute (Amii) [9] Huawei Noah’s Ark Lab.
Correspondence to: Yihong Wu _<_ yihong.wu@umontreal.edu _>_,
Liheng Ma _<_ liheng.ma@mail.mcgill.ca _>_ .


_Preprint._ _February 2, 2026._



back (RLHF) (Ouyang et al., 2022) and enhancing reasoning capabilities through RL with Verifiable Rewards
(RLVR) (DeepSeek-AI, 2025). Among recent advances,
_Group Relative Policy Optimization_ (GRPO) (Shao et al.,
2024) is a prominent critic-free variant of _Proximal Policy_
_Optimization_ (PPO) (Schulman et al., 2017). Diverging
from PPO, which relies on an auxiliary critic network for
variance reduction, GRPO estimates the advantage function
by sampling a group of responses (rollouts) for a single
prompt and normalizing their rewards relative to the group
statistics. This design eliminates the memory and computational overhead of the value network while maintaining
strong performance across various reasoning tasks.


Conventional intuition suggests that GRPO’s efficacy is
strongly correlated with its group size, grounded in the
premise that larger sample sizes yield more accurate advantage estimates and lead to stronger post-trained LLMs.
However, this intuition overlooks the specific construction
of the group-relative gradient estimator in GRPO. First,
we demonstrate that GRPO intrinsically functions as contrastive learning (Chopra et al., 2005), sharing the same
underlying mechanism as _Direct Preference Optimization_
(DPO) (Rafailov et al., 2023). Second, we reveal that the
group of rollouts serves primarily to pair contrastive samples, rather than to enhance estimation accuracy. By leveraging the strong correlation within these pairs, GRPO, as a
control variate method (Johnson & Zhang, 2013), effectively
reduces the variance of the gradient estimator. This finding
challenges the prevailing view and opens a new design space
for RL algorithms in LLM post-training.


Following the contrastive perspective, we show that the
GRPO objective is a Monte Carlo estimator to approximate
the true contrastive gradients. The sample size primarily
affects the variance of the Monte Carlo estimator, while
the approximation itself remains unbiased. This observation provides a theoretical basis for reducing the computational cost generating large numbers of rollouts, without
altering the fundamental optimization behavior of GRPO.
Consequently, we propose the minimal two-rollout setting
(2-GRPO), a configuration previously regarded as inadequate for reward normalization (Student, 1908), yet well
aligned with the contrastive learning interpretation.



1


**It Takes Two:** **Your GRPO Is Secretly DPO**



We provide a theoretical analysis of the properties of 2GRPO and empirically evaluate its effectiveness and efficiency across a diverse set of models and tasks. Experimental results showcase that 2-GRPO attains performance
comparable to 16-GRPO, while significantly reducing training time. The effectiveness of 2-GRPO strongly supports
our central hypothesis that the power of GRPO arises primarily from its contrastive formulation, rather than from
accurate advantage estimation.


**2. Preliminary**


**2.1. Problem Setting and Notation**


Our work focuses on RL-based post-training of LLMs for
reasoning capabilities. The learning objective is to maximize the expected reward over the trajectory space:


_J_ ( _θ_ ) = E _q∼Q_ E _o∼πθ_ ( _·|q_ )[ _r_ ( _τ_ )] _,_ (1)


where _πθ_ denotes the policy model - an LLM with parameters _θ_ ; and _Q_ is the set of prompts, each consisting
of a question and necessary instructions [1] . Given an input prompt _q_ _∈Q_, the model generates the _i_ -th response
_oi_ = ( _oi,_ 1 _, . . ., oi,T_ ), where _oi,t_ is the token generated at
step _t ∈_ [0 _, T_ ] and _oi,<t_ denotes the sequence of preceding
tokens. A trajectory _τ_ = ( _q, o_ ) _∈T_ is defined as a concatenation of a prompt and its corresponding LLM-generated
response. In current RL post-training, the reward function
_r_ : _T_ _→_ R is typically defined at the trajectory level. Following previous work, we mainly focus on the setting of
verifiable rewards, where the responses can be verified as
correct ( _r_ = 1) or incorrect ( _r_ = 0).


**2.2. Advantage Estimation and Variance Reduction**


As an essential policy gradient method, **Vanilla Policy Gra-**
**dient** (VPG) (Williams, 1992) aims to maximize the gradient estimator:



where _Ai,t_ is a token-level advantage estimate and _b_ ( _q_ ) is an
additional critic network that estimates the reward baseline
independent of the sampled actions. A dominant algorithm
is **Proximal Policy Optimization** (PPO) (Schulman et al.,
2017):



_|oi|_

- min _{Ai,tρi,t, Ai,tCϵ_ ( _ρi,t_ ) _},_ (4)


_t_ =1



_J_ ( _θ_ ) = E
_q∼Q_
_oi∼πθ_ old



1
_|oi|_



_∇θ_ log _πθ_ ( _oi,t|oi,<t, q_ )

_t_ =0







 _._



_∇θJ_ ( _θ_ ) = E
_q∼Q_
_oi∼πθ_ old






 _ri_



_|oi|_




(2)
where _ri_ is the reward of ( _q, oi_ ).


**Advantage Estimation** Although effective, VPG usually
suffers from high gradient variance and training instability. Therefore, subsequent works (Schulman et al., 2015;
2017) utilize advantage estimates (Baird, 1993) to reduce
the variance of the policy gradient estimator:


_Ai,t_ = _ri −_ _b_ ( _q_ ) _,_ (3)


1Throughout this paper, we use the terms “prompt” and “question” interchangeably.



where _importance sampling and clipping_ are introduced to
further stabilize training [2] :


_[|][ o][i,<t][, q]_ [)]
_ρi,t_ = _[π][θ]_ [(] _[o][i,t]_ (5)

_πθ_ old ( _oi,t_ _| oi,<t, q_ )


in which, _πθ_ old is the policy used to generate trajectories,
while _πθ_ denotes the current policy being optimized. The
term _Cϵ_ ( _x_ ) represents the clipping function within the interval [1 _−_ _ϵ,_ 1 + _ϵ_ ].


To eliminate the substantial computational overhead and
memory demands of the critic network, several studies (Li
et al., 2024; Ahmadian et al., 2024; Shao et al., 2024) propose estimating the baseline without a critic network. Specifically, as a prevailing technique, GRPO estimates the advantage in PPO using the reward statistics from a group of
generated responses:

_Ai,t_ = _[r][i][ −]_ [mean][(] **[r]** [)] _,_ (6)

std( **r** ) + _ϵ_


where _ri_ is the reward for response _oi_ given query _q_, and
**r** denotes the vector of rewards for _G_ sampled responses
associated with _q_ . A small constant _ϵ_ is included to ensure
numerical stability. GRPO computes the averaged policy
gradient over a group, rather than a single rollout as in PPO.


**2.3. Variance Reduction of Policy Gradient Estimates**


Given a prompt, consider the random variable (r.v.) of
the reward _r_ (which can be replaced by the advantage _a_ ) and the r.v. of the policy gradient _**g**_ (corresponding to _|o_ 1 _i|_ - _|to_ =0 _i|_ _[∇][θ]_ [ log] _[ π][θ]_ [(] _[o][i,t][|][o][i,<t][, q]_ [)] [in] [VPG] [or]

_|o_ 1 _i|_ - _|toi|_ _∇θρi,t_ in PPO/GRPO). [3] Since E[ _**g**_ ] = 0 over all
potential actions, the variance of the product of these r.v.’s
can be written as:


Var( _r ·_ _**g**_ ) = Var( _**g**_ ) �Var( _r_ ) + (E[ _r_ ]) [2][�]



The interaction term is typically dominated by outliers and
can be ignored when importance sampling and clipping are


2In this work, we omit the KL-divergence term from the discussion, as it primarily serves as a regularizer and does not alter
the core optimization behavior.
3See Appx. B.3 for more discussion.



+ Cov( _r_ [2] _,_ _**g**_ [2] ) _−_ (Cov( _r,_ _**g**_ )) [2]

 - ��  Interaction term



_._ (7)



2


**It Takes Two:** **Your GRPO Is Secretly DPO**



applied, as the gradient is bounded in a small region. [4] Previous work (Baird, 1993; Schulman et al., 2015; 2016; 2017)
shows that replacing raw rewards with advantage functions
effectively reduces variance, leading to more stable and
improved RL optimization.


**2.4. Contrastive Loss for Sequences and DPO**


The **contrastive** **loss** **objective** (Chopra et al., 2005) has
been a powerful learning paradigm in (self-)supervised
learning, ranging from 1-vs-1 (one positive and one negative) objectives (Rendle et al., 2009) to 1-vs- _N_ (Oord et al.,
2018) and _N_ -vs- _M_ variants (Frosst et al., 2019). To facilitate our analysis in the context of LLMs, we formalize the
contrastive loss objective for sequences.

**Definition 2.1** (Contrastive Loss for Sequences) **.** Let _πθ_ be
a probabilistic model and _D_ be a data distribution. Consider
an anchor sequence **x** _∼D_, and let _D_ [+] ( _· |_ **x** ) and _D_ _[−]_ ( _· |_ **x** )
denote the conditional distributions for positive and negative samples, respectively. Let _yt_ denote the _t_ -th token of
sequence _**y**_ . A differentiable loss function _L_ is defined as
_contrastive_ if its gradient satisfies the following form:




1
_G_ [+] _q_



**3. Bridging GRPO and DPO with Contrastive**
**Learning**


At first glance, the objectives of GRPO and DPO appear distinct for different RL settings. We show that, via the bridge
of contrastive learning, the gradient forms of GRPO and
DPO share the same underlying mechanism. This finding
provides a new theoretical analysis (Sec. 4) and motivates a
more efficient yet effective algorithm (Sec. 5).


**3.1. GRPO: N-vs-M Contrastive Learning**


We demonstrate that GRPO effectively functions as a dynamic _N_ -vs- _M_ contrastive learning framework, where the
group size _G_ = _N_ + _M_ is fixed, but the specific values of _N_
(positive samples) and _M_ (negative samples) are dynamic
based on the sampled responses. Let _G_ [+] _q_ [and] _[ G]_ _q_ _[−]_ [denote]
the counts of correct and incorrect trajectories, respectively.
The GRPO objective function can be formulated as:


_J_ GRPO( _θ, G_ ) = E[ _q∼Q_ ; _{o_ + _j_ _[,o]_ _k_ _[−][}]_ _j,k_ _[G]_ _[∼][π][θ]_ old [(] _[·|][q]_ [)][]]



1
_|o_ [+] _j_ _[|]_







_|o_ [+] _j_ _[|]_

- _Cϵ_ [+]

_t_ =1




- _πθ_ ( _o_ [+] _j,t_ _[|][o]_ [+] _j,<t_ _[, q]_ [)]

_πθ_ old ( _o_ [+] _j,t_ _[|][o]_ [+] _j,<t_ _[, q]_ [)]



_G_ [+] _q_



_j_ =1



(8)




Var� _G_ ( _q_ )







_∇θL_ = _−_ E
_**x**_ _∼D_



E
_**y**_ [+] _∼D_ [+]



_|_ _**y**_ [+] _|_

- _c_ [+] _t_ _[∇][θ][π][θ]_ [(] _**[y]**_ _t_ [+] _[|]_ _**[y]**_ _<t_ [+] _[,]_ _**[ x]**_ [)]

_t_ =1




- �� positive







_G_ _[−]_ _q_



_k_ =1



1
_|o_ _[−]_ _k_ _[|]_



_|o_ _[−]_ _k_ _[|]_

- _Cϵ_ _[−]_

_t_ =1




- _πθ_ ( _o_ _[−]_ _k,t_ _[|][o][−]_ _k,<t_ _[, q]_ [)]

_πθ_ old( _o_ _[−]_ _k,t_ _[|][o][−]_ _k,<t_ _[, q]_ [)]








_−_ E
_**y**_ _[−]_ _∼D_ _[−]_



_|_ _**y**_ _[−]_ _|_ 
- _c_ _[−]_ _t_ _[∇][θ][π][θ]_ - _**y**_ _t_ _[−][|]_ _**[y]**_ _<t_ _[−]_ _[,]_ _**[ x]**_ 
_t_ =1



_,_



1

_−_
_G_ _[−]_ _q_



_,_



where _c_ [+] _t_ [and] _[ c]_ _t_ _[−]_ [are token-level coefficients depending on]
the specific loss design.


We adopt token-level coefficients for generality, as sequencelevel coefficients can be recovered as a special case. Furthermore, the number of _positive_ ( _N_ ) and _negative_ ( _M_ ) samples
of each data point may vary depending on the specific designs, serving as a _Monte Carlo estimator_ to approximate
the true gradient in Eq. (8).


**Direct Preference Optimization (DPO) (Rafailov et al.,**
**2023)** is a dominant offline RLHF algorithms for LLMs:




  - ��   negative

(10)
where _o_ [+] _j_ [and] _[ o]_ _k_ _[−]_ [denote rollouts with correct and incorrect]
outcomes, respectively. Denoting _p_ ˆ _θ_ old _,q_ = _G_ [+] _q_ _[/G]_ [, the term]
Var� _G_ ( _q_ ) = (1 _−_ _p_ ˆ _θ_ old _,q_ )ˆ _pθ_ old _,q_ is the empirical variance of
the _G_ sampled trajectories from the true Bernoulli( _p_ old _,q_ )
under the RLVR setting. [5] For simplicity, we denote the
upper and lower clippings as _Cϵ_ [+][(] _[x]_ [)] [=] [min[] _[x,]_ [ 1 +] _[ ϵ]_ []][ and]
_Cϵ_ _[−]_ [(] _[x]_ [) = max[] _[x,]_ [ 1] _[ −]_ _[ϵ]_ []][, respectively.]


The formulation in Eq. (10) provides the foundation for
the following proposition, with a proof provided in Appendix B.2. Despite the sophisticated algorithm design of
GRPO, this proposition unveils its _contrastive_ nature.


**Proposition 3.1.** _The maximization of the GRPO objective_
_is equivalent to the minimization of an N_ _-vs-M_ _contrastive_
_loss estimator._


**3.2. GRPO is Secretly doing DPO**


Given the inherent contrastive nature of DPO and the above
analysis of GRPO, we can recognize that GRPO and DPO
optimize the same underlying objective: increasing the likelihood of preferred trajectories relative to non-preferred


5In subsequent parts, we omit the subscript _θ_ old of _p_ for brevity.



_L_ DPO = _−_ E
( _q,o_ [+] _,o_ _[−]_ ) _∼D_ DPO




- log _σ_ _β_ log _[π]_ [(] _[o]_ [+] _[|][q]_ [)]

_π_ ( _o_ _[−]_ _|q_ )



��
_,_ (9)



where _π_ ( _·|q_ ) ≜ _ππ_ ref _θ_ (( _·|·|qq_ )) [and the question and response se-]
quences ( _q, o_ [+] _, o_ _[−]_ ) _∼D_ DPO are from human-annotated
preference data. It is easy to show that DPO is a 1-vs-1
contrastive learning. We provide Lemma B.1 and its proof
in Appx. B.4 for a reference. When extending offline RL
to the online setting, the log-likelihood term is typically
replaced by its importance-sampling counterpart to improve
training stability, as in the transition from VPG (Williams,
1992) to PPO (Schulman et al., 2017).


4The comprehensive related work is provided in Appx. A.



3


**It Takes Two:** **Your GRPO Is Secretly DPO**



ones. Their differences arise primarily from the training
regimes (online v.s. offline) and, consequently, from how
preference signals are obtained.


**Importance** **Sampling** **v.s.** **Log-likelihood** : Following
most autoregressive language models, DPO describes the objective function with the log-likelihood term log _π_ ( _o_ [+] _|q_ ) _−_
log _π_ ( _o_ _[−]_ _|q_ ). For online RL, GRPO utilizes the importance
sampling technique, which is a surrogate objective of the
log-likelihood. In the gradient form of objective, the importance sampling term is equivalent to the log-likelihood
term with correction coefficients. We provide a detailed
discussion in Appx. B.3.


**Number** **of** **Positive** **and** **Negative** **Examples.** DPO
adopts a 1-vs-1 contrastive formulation, where each positive–
negative pair is predefined by an offline, human-annotated
preference dataset. In contrast, GRPO operates in an online
RL setting, where the responses are generated online by the
policy given a prompt and the preferences are given by the
reward model. Consequently, GRPO inherently induces a
dynamic _N_ -vs- _M_ contrastive objective within a group of
_G_ = _N_ + _M_ trajectories, where the numbers of positive
and negative samples are dynamic based on the rewards of
sampled responses. If a trajectory group fails to form a valid
contrastive set (i.e., all trajectories have positive or negative
rewards) the group contributes no learning signal due to
zero-valued advantages in Eq. (6).


Note that varying the number of positive and negative samples (e.g., 1-vs-1 or _N_ -vs- _M_ ) merely alters the sample size
used in the Monte Carlo estimators to approximate the underlying positive and negative gradients defined in Eq. (8).
These connections reveal that GRPO is _de facto_ performing
direct preference optimization in an online RL setting by
explicitly constructing a contrastive objective.


**4. Rethinking** _**Group**_ **in GRPO**


While GRPO is typically characterized as a critic-free approximation of PPO, we argue that this advantage-based
perspective obscures its true mechanism. In this section, we
re-interpret variance reduction of GRPO via the contrastive
objective. We demonstrate that **GRPO’s** **efficacy** **arises**
**from a group-based gradient estimator that implicitly**
**minimizes variance through contrastive pairs.**


**4.1. Limitation of Advantage Estimate for GRPO**


Variance reduction is a central challenge in policy gradient
methods, where the stochasticity of environmental returns
necessitates the use of a baseline (Schulman et al., 2016;
Li et al., 2024). Previous approaches, such as PPO, rely on
a learned value function _Vϕ_ ( _s_ ) to serve as a low-variance
proxy for the expected return, thereby isolating the advantage _A_ ( _s, a_ ) = _r_ _−_ _Vϕ_ ( _s_ ). The efficacy of this method



hinges on the critic’s ability to generalize and provide a
stable baseline across diverse states.


In contrast, GRPO eschews a learned critic in favor of a
Monte Carlo approximation, estimating the baseline using the mean reward of a group of _G_ sampled outputs:
_b_ _≈_ _G_ 1 - _Gi_ =1 _[r][i]_ [.] [From] [a] [classical] [estimation] [perspective,]
this approach is theoretically suboptimal, as the group mean
fluctuates dynamically based on the specific stochastic realization of the current batch. This has led to the common
belief that GRPO necessitates a large group size _G_ . However, this suboptimal nature is inevitable.


Indeed, empirical results contradict this intuition (Hu, 2025;
DeepSeek-AI, 2025; Sheng et al., 2025), showing that
GRPO performs even better in reasoning tasks compared
to other baselines with more accurate baseline estimation,
e.g., PPO, ReMax (Li et al., 2024), and RLOO (Ahmadian
et al., 2024). This suggests that treating the group mean
merely as a “poor man’s critic” overlooks the benefit of the
well-designed group-based gradient estimator.


**4.2. Variance Reduction via Contrastive Objective**


To clarify the role of grouping in GRPO, we offer an alternative explanation for its variance reduction mechanism. We
argue that GRPO’s effectiveness does not arise from accurate advantage estimation, but from **constructing groups**
**that induce a contrastive learning signal** . **Groups that**
**fail to form such contrasts are discarded in GRPO** . For
analytical clarity, we focus on the RLVR setting.


Consider a generalized form of the gradient within a group:



where _**g**_ ¯ [+] := _G_ 1 [+] - _Gj_ =1 _**[g]**_ _j_ [+] [and] _**[g]**_ [¯] _[−]_ [:=] _G_ 1 _[−]_ - _Gj_ =1 _**[g]**_ _j_ _[−]_ [rep-]

resent the average gradients for the positive and negative
groups, respectively. We interpret _**g**_ ¯ [+] as the virtual positive
gradient and _**g**_ ¯ _[−]_ as the virtual negative gradient. The terms
_G_ [+] (1 _−_ _b_ ) and _G_ _[−]_ _b_ act as weighting coefficients for these
positive and negative components.

Moreover, ˆ _**g**_ _∝_ (¯ _**g**_ [+] _−_ _c_ _**g**_ ¯ _[−]_ ), where _c_ = _G_ [+] _G_ (1 _[−]_ _−b_ _b_ ) [.] [In GRPO,]

the baseline _b_ = _[G]_ _G_ [+] [, allowing the estimator being simpli-]

fied to a proportional contrastive form: _**g**_ ˆ _∝_ (¯ _**g**_ [+] _−_ _**g**_ ¯ _[−]_ ).
We demonstrate that this contrastive gradient formulation
functions as a control variate method, where the coefficients
serve to control the variance of the estimator.



_**g**_ ˆ = [1]

_G_



_G_
�( _ri −_ _b_ ) _**g**_ _i,_ (11)


_i_ =1



where _**g**_ _i_ := _∇θπθ_ ( _oi|q_ ) and _b_ is a reward baseline. By
separating the samples into positive and negative subgroups,
this form can be rewritten as:

_**g**_ ˆ = [1]     - _G_ [+] (1 _−_ _b_ )¯ _**g**_ [+] _−_ _G_ _[−]_ _b_ _**g**_ ¯ _[−]_ [�] _,_ (12)

_G_



_Gj_ =1 [+] _**[g]**_ _j_ [+] [and] _**[g]**_ [¯] _[−]_ [:=] _G_ 1 _[−]_ - _Gj_ _[−]_



where _**g**_ ¯ [+] := _G_ 1 [+] - _Gj_ [+]



4


**It Takes Two:** **Your GRPO Is Secretly DPO**



**Proposition** **4.1.** _Let_ _πθ_ _denote_ _the_ _policy_ _model._ _Let_

_o_ [+] _∼_ _πθ_ [+][(] _[·|][q]_ [)] _[and]_ _[o][−]_ _[∼]_ _[π]_ _θ_ _[−]_ [(] _[·|][q]_ [)] _[denote]_ _[random]_ _[vari-]_
_ables representing a positive sample and a negative sam-_
_ple,_ _respectively._ _Let_ _**g**_ [+] = _∇θ_ log _πθ_ ( _o_ [+] _|q_ ) _,_ _**g**_ _[−]_ =
_∇θ_ log _πθ_ ( _o_ _[−]_ _|q_ ) _and_ _ρ_ _denote_ _the_ _correlation_ _coefficient_
_of_ _**g**_ [+] _and_ _**g**_ _[−]_ _._ _If_ Cov( _**g**_ [+] _,_ _**g**_ _[−]_ ) _>_ 0 _and_ 0 _≤_ _c_ _≤_
2 [Cov(] Var( _**[g]**_ [+] _**g**_ _[−][,]_ _**[g]**_ ) _[−]_ [)] _,_ _then_ Var( _**g**_ [+] _−_ _c_ _**g**_ _[−]_ ) _≤_ Var( _**g**_ [+] ) _._ _Specifi-_

_cally, if c_ = [Cov(] Var( _**[g]**_ [+] _**g**_ _[−][,]_ _**[g]**_ ) _[−]_ [)] _, then_


Var( _**g**_ [+] _−_ _c_ _**g**_ _[−]_ ) = �1 _−_ _ρ_ [2][�] Var( _**g**_ [+] ) _,_ (13)


_where Var_ ( _·_ ) _and Cov_ ( _·, ·_ ) _denotes the corresponding traces_
_of var/cov matrices for gradient vectors._


This proposition (proof in Appx. B.5) shows that, when
the coefficient _c_ lies within an appropriate range, the variance of the gradient estimator can be reduced. This result
follows directly the control variate method, a variance reduction technique widely used in Monte Carlo estimation and
stochastic gradient optimization (Johnson & Zhang, 2013).


A key implication of Proposition 4.1 is that the degree
of variance reduction depends on the correlation between
positive and negative samples. In LLM post-training, the
positive sample _o_ [+] and the negative sample _o_ _[−]_ are generated by the same model conditioned on the same prompt
_q_, which typically induces a nontrivial correlation between
them. This proposition also indicates that GRPO may be
ineffective when samples are generated independently at
random, such as in RL training from scratch.


**5. Minimalist RL: 2-GRPO**


Building on our contrastive interpretation of GRPO, we
view the positive and negative examples within a group as
the samples used for Monte Carlo estimation of the true
positive and negative gradients. Motivated by the fact that
Monte Carlo integration remains unbiased regardless of
sample size, we introduce GRPO with a group size of two
(2-GRPO). This approach is the minimum of GRPO capable
of producing a contrastive effect. It substantially reduces
computational overhead by minimizing redundant rollouts
without introducing bias into the gradient estimation. In
this section, we also provide rigorous theoretical analyses
to justify the validity of 2-GRPO.


**5.1. Introduce 2-GRPO**


2-GRPO is formally defined as:

_J_ GRPO( _θ, G_ ) = E[ _q∼Q_ ;( _o_ 1 _,o_ 2) _∼πθ_ old ( _·|q_ )]



_|o_ 1 _|_

- _Cϵ_ [+]


_t_ =1




- _πθ_ ( _o_ 1 _,t|o_ 1 _,<t, q_ )
_πθ_ old ( _o_ 1 _,t|o_ 1 _,<t, q_ )



(14)







1 ( _r_ 1 = _r_ 2) _·_ [1]

2




1
_|o_ 1 _|_



For the simplicity of notation, without loss of generality, we
assume _o_ 1 to be the positive sample and _o_ 2 to be the negative sample when their rewards are not the same. In other
words, the advantage estimation of 2-GRPO is a flawed normalization: _A_ [+] = 1 _, A_ _[−]_ = _−_ 1 for a positive-negative pair
and _A_ [+] = _A_ _[−]_ = 0 otherwise. **This formulation directly**
**constructs** **an** **online** **RL** **variant** **of** **direct** **preference**
**optimization as in DPO.**


According to the prevailing understanding of GRPO, this
configuration is infeasible (See Appx. B.1). A group size of
two is typically expected to fail in reward baseline estimates
(high sensitivity to individual realizations) and in advantage
normalization (statistically degenerate). However, this is
completely feasible from our contrastive interpretation.


**5.2. Advantage Shaping in Stochastic Optimization**


Standard GRPO relies on the empirical success rate _p_ ˆ _q_ to
estimate the true correctness probability _pq_ for advantage assignment, relying on larger group sizes for accuracy. While
this mechanism appears degenerate in 2-GRPO, we show
that, through the lens of stochastic optimization, 2-GRPO
implicitly estimates the advantage.


**Proposition 5.1.** _Given a constant p ∈_ (0 _,_ 1) _and a small_
_positive constant ϵ, we consider two scenarios below:_


_i.i.d._

- _**Case**_ _**1**_ _:_ _Consider_ _X_ 1 _, · · ·_ _, X_ 2 _N_ _∼_ _Bernoulli_ ( _p_ ) _._ _Let_
_Yi_ = _Xσ_ ˆ _i_ + _−ϵµ_ ˆ _[,]_ _[where]_ _[µ]_ [ˆ] = 21 _N_ �2 _i_ =1 _N_ _[X][i]_ _[and]_ _[σ]_ [ˆ] =

~~�~~ 21 _N_ �2 _i_ =1 _N_ [(] _[X][i][ −]_ _[µ]_ [ˆ][)][2] _[.]_ _[Then, it follows that]_


_x −_ _p_
_ϵ_ lim _→_ 0 _N_ [lim] _→∞_ [E][[] _[Y][i][|][X][i]_ [=] _[ x]_ [] =] ~~�~~ _p_ (1 _−_ _p_ ) _._ (15)


- _**Case**_ _**2**_ _:_ _Consider_ _N_ _pairs_ _of_ ( _Xi,_ 1 _, Xi,_ 2) _with_ _each_

_Xi,j_ _i.i.d.∼_ _Bernoulli_ ( _p_ ) _._ _Let_ _Yi,j_ = _Xσi,j_ ˆ _i_ + _−ϵµ_ ˆ _i_ _[,]_ _[where]_

_µ_ ˆ _i_ = 2 [1] [(] _[X][i,]_ [1][ +] _[ X][i,]_ [2][)] _[ and]_ _[σ]_ [ˆ] _[i]_ [=]  - 12 �2 _j_ =1 [(] _[X][i,j]_ _[−]_ _[µ]_ [ˆ] _[i]_ [)][2] _[.]_

_Then, it follows that_


lim [=] _[ x]_ [] =] _[ x][ −]_ _[p.]_ (16)
_ϵ→_ 0 _N_ [lim] _→∞_ [E][[] _[Y][i,j][|][X][i,j]_


_Term_ lim _ϵ→_ 0 _,N_ _→∞_ E[ _Yi,j|Xi,j_ = _x_ ] _differs_ _from_
lim _ϵ→_ 0 _,N_ _→∞_ E[ _Yi|Xi_ = _x_ ] _by a scaling factor_ ~~_√_~~ 1

_p_ (1 _−p_ ) _[.]_


In Proposition 5.1 (proof in Appx. B.6), **Case 1** corresponds
to regular GRPO with sufficiently large group size. In this
case, E[ _Yi|Xi_ = 1] and E[ _Yi|Xi_ = 0] are, respectively,
the advantage estimates of positive and negative trajectories given a prompt, dependent on the success probability
_pq_ . A large _G_ will lead to a better estimate of the success probability _pq_ . **Case 2** corresponds to 2-GRPO, where
E[ _Yi,j|Xi,j_ = 1] and E[ _Yi,j|Xi,j_ = 0] are advantage estimates, which are also dependent on the success rate _pq_,
amortizing over multiple stochastic updates.




- [�]

_,_



1

_−_
_|o_ 2 _|_



_|o_ 2 _|_

- _Cϵ_ _[−]_


_t_ =1




- _πθ_ ( _o_ 2 _,t|o_ 2 _,<t, q_ )
_πθ_ old ( _o_ 2 _,t|o_ 2 _,<t, q_ )



5


**It Takes Two:** **Your GRPO Is Secretly DPO**



2-GRPO produces advantage estimates that differ from standard GRPO solely by a scaling factor; this factor is effectively a design choice. Whether such a scaling is beneficial
remains an open question (Li et al., 2025).


**5.3. Variance of Gradient Estimate in Mini-Batch**


Beyond the inherent variance reduction mechanisms of PPO
and GRPO, it is generally understood that using a larger
group of rollouts yields a lower-variance policy gradient
estimate. However, this perspective overlooks the practicalities of mini-batch optimization. In this section, we
analyze the practical gradient variance within a mini-batch
setting. To facilitate this discussion, we focus strictly on the
optimization phase and treat the sampled rollouts as fixed
training data for notational simplicity.


Firstly, we can provide a definition of gradient variance,
followed by a lemma for empirical gradient estimation.


**Definition 5.2** (Variance Gradient Estimate in Mini-Batch) **.**
Without loss of generality, let _{_ _**x**_ _i}_ _[B]_ _i_ =1 [be a batch of] _[ B]_ [ ran-]
dom variables (r.v.’s), where each _**x**_ _i_ is i.i.d. _**x**_ _∼D_, and let
_**g**_ ( _**x**_ _i_ ) = _∇θLθ_ ( _**x**_ _i_ ) denote the gradient of _Lθ_ ( _**x**_ _i_ ) w.r.t. _θ_ .
Define the empirical batch gradient _**g**_ ˆ _B_ = _B_ 1 - _Bi_ =1 _**[g]**_ [(] _**[x]**_ _[i]_ [)][.]
Note that _**g**_ ( _**x**_ _i_ ) and _**g**_ ˆ _B_ are dependent r.v.’s of _**x**_ _i_ and
_{_ _**x**_ _i}_ _[B]_ _i_ =1 [,] [respectively.] [We] [denote] [the] [expectation] [of] [the]
gradient _**g**_ ¯ = E _**x**_ _∼D_ [ _**g**_ ( _**x**_ )]. The variance of the gradient
estimate over the batch is then defined as:



Var(ˆ _**g**_ _B_ ) = Var _{_ _**x**_ _i}Bi_ [(ˆ] _**[g]**_ _[B]_ [) =][ E] _[{]_ _**[x]**_ _[i][}]_ _i_ _[B]_




(ˆ _**g**_ _B_ _−_ _**g**_ ¯) [2][�] _._ (17)



**Lemma** **5.3.** _Let_ _{_ _**x**_ _i}_ _[B]_ _i_ =1 [1] _[,][ {]_ _**[x]**_ _[i][}][B]_ _i_ =1 [2] _[be]_ _[two]_ _[batches]_ _[of]_ _[B]_ [1]
_and B_ 2 _r.v.’s, respectively. Let_ ˆ _gB_ 1 _,_ ˆ _gB_ 2 _denote the empirical_
_batch gradients of these two batches, respectively._ _If B_ 1 _<_
_B_ 2 _, then_ Var[ˆ _gB_ 1] _>_ Var[ˆ _gB_ 2] _._


While decreasing the group size in Eq. (10) appears to increase the gradient variance for each individual prompt, this
conclusion overlooks the total number of rollouts optimized
across all prompts in a mini-batch.


In Lemma 5.3 (proof in Appx. B.7), we show that a larger
batch size _B_ naturally leads to a lower variance of the gradient. Note that _B_ is the **number of rollouts** in each minibatch rather than the **number of prompts** .


The actual calculation of GRPO is:



_G_

- _Aijπθ_ [GRPO] ( _oij|qj_ ) _,_ (18)


_i_ =1



1
_J_ �GRPO( _θ, G, Q_ ) = _QG_


where



_Q_



_j_ =1







and _Q_ is the number of prompts in the mini-batch, and the
batch size w.r.t the number of rollouts is _B_ = _QG_ . When we
decrease _G_, we can increase _Q_ to compensate to retain the
same _B_ in a mini-batch. Since the total number of prompts
in the dataset is fixed, increasing _Q_ does not increase the
total computational cost per training epoch.


**5.4. Exploration on Hard Questions**


A common concern with using a small group size in GRPO
(e.g., _G_ = 2) is insufficient exploration on difficult questions. Such questions often require multiple attempts to
yield a correct answer, which is necessary to form a valid
contrastive signal. With a smaller group, the likelihood of
sampling a correct response in a single iteration may appear
lower, potentially raising concerns about degraded learning.


Under a fixed computational budget, 2-GRPO and 16-GRPO
explore approximately the same total number of rollouts
across all training epochs – the overall probability of sampling a correct answer under 2-GRPO is not lower than
16-GRPO, according to the Proposition 5.4.


**Proposition** **5.4.** _Let_ _pi_ _∈_ [0 _,_ 1] _denote_ _the_ _probability_
_that a single rollout under the policy πi produces a correct_
_answer._ _Then:_


_1._ _The probability of obtaining at least one correct answer_
_in_ 2 _m independent rollouts with policy π_ 0 _is_


_P_ 2 _m_ = 1 _−_ (1 _−_ _p_ 0) [2] _[m]_ _._ (19)


_2._ _The_ _probability_ _of_ _obtaining_ _at_ _least_ _one_ _correct_ _an-_
_swer_ _when_ _performing_ _m_ _consecutive_ _trials_ _of_ 2 _inde-_
_pendent_ _rollouts_ _each,_ _with_ _the_ _corresponding_ _policy_

[ _π_ 0 _, π_ 1 _, · · ·_ _, πm−_ 1] _is_


_Pm×_ 2 = 1 _−_  - (1 _−pi_ ) [2] _≥_ 1 _−_ (1 _−p_ 0) [2] _[m]_ = _P_ 2 _m_


_i_ =0 _,···m−_ 1

(20)
_when we have pi_ _≥_ _p_ 0 _, ∀i >_ 0 _._


_Note_ _that_ _the_ _assumption_ _pi_ _≥_ _p_ 0 _, ∀i_ _>_ 0 _is_ _prevailing,_
_as_ _we_ _assume_ _that_ _the_ _reasoning_ _ability_ _of_ _LLM_ _can_ _be_
_improved by RL post-training._


Proposition 5.4 suggests that for difficult questions, 2-GRPO
does not degrade in effectiveness compared to 16-GRPO
given the same budget of the total number of rollouts in
whole training process. Notably, due to its higher frequency
of policy updates, 2-GRPO may yield a higher probability of
generating correct outputs for hard questions. It is also more
adaptive, allowing it to capture nuanced update requirements
for varying inputs. This observation also extends to PPO
with the standard single-rollout implementations per epoch
against multi-rollout variants.



_πθ_ [GRPO] ( _o|q_ ) = _G_ [1]



_G_



_i_ =1



1
_|oi|_



_|oi|_

- _Cϵ_


_t_ =1




- _πθ_ ( _oi,t|oi,<t, q_ )
_Ai,t_
_πθ_ old ( _oi,t|oi,<t, q_ )



6


**It Takes Two:** **Your GRPO Is Secretly DPO**



**6. Experiments**


**6.1. Experiment Details**


**Tasks and Training Framework** Following prior studies,
we consider mathematical tasks as representative instances
of RLVR to verify our hypothesis, given their demonstrated
transferability to a broad range of other tasks (Yu et al.,
2025). For training, we adopt the _verl_ framework (Sheng
et al., 2025) and utilize the built-in implementation of
GRPO (Shao et al., 2024) as the baseline algorithm.


**Goal of Experiment** Building on the theoretical justification for 2-GRPO, we seek to empirically assess its validity
in RLVR. We anticipate that _**2-GRPO**_ _**will**_ _**exhibit**_ _**better**_
_**efficiency**_ —with respect to computational resources and/or
wall-clock time—while maintaining the comparable performance as regular GRPO (16-GRPO).


**Datasets,** **Baselines** **and** **Hyper-parameters** We provide the details of datasets, baselines and hyper-parameter
choices in Appx. C.1.


**6.2. Main Experiments on Math Reasoning**


As shown in Table 1, 2-GRPO requires at least 70% less
wall-clock time than 16-GRPO while achieving comparable performance. The models are post-trained on MATH
and DAPO-Math-Sub datasets and evaluated on five widelyused math reasoning benchmarks, representing an out-ofdistribution evaluation. This setting imposes stringent requirements on the generalization ability of the post-trained
models. Notably, **2-GRPO is optimized with only 0.15 mil-**
**lion generated rollouts** [6] **, which is just 12.5% of the 1.2**
**million rollouts utilized by 16-GRPO, and consumes only**
**21.0% of the training time of 16-GRPO, while achieving**
**98.1% of its average performance.** These results provide
strong corroboration of our theoretical finding that reducing group size preserves performance while substantially
improving efficiency.


**6.3. Further Study:** **2-GRPO with Resampling**


Due to its binary contrastive nature, 2-GRPO inherently
discards a subset of generated rollouts when the policy exhibits exceptionally strong performance on the training set.
This behavior can limit the effective utilization of generated data and may, in turn, impact the peak performance
achievable by 2-GRPO. A simple remedy is to introduce a
resampling mechanism during generation whenever a group
of rollouts is discarded, following the strategy adopted in
DAPO (Yu et al., 2025). Although this approach incurs additional computation to improve data utilization, the overhead


6Appx. C.2 discusses the relationship between the total number
of rollouts and computational cost.



is negligible compared to the efficiency gains provided by
2-GRPO. We compare 2-GRPO with resampling against
standard 16-GRPO in a prolonged training setting, demonstrating that 2-GRPO with resampling achieves superior
performance while requiring less wall-clock time (Fig. 1).


0.70


0.68



0.66


0.64


0.62


0.60


0.58


0.56



|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||
|||||||~~2-GRPO~~<br>16-GRPO|~~RS~~<br>|
|||||||||


0 100 200 300 400 500
Time (mins)



_Figure_ _1._ 2-GRPO+ReSampling v.s. 16-GRPO - Test Scores
(Pass@1) v.s. Wall-clock time on MATH Dataset. Curves are post
simple-moving-average (SMA) with window-size=4.


0.52


0.50



0.48


0.46


0.44


0.42


0.40



|Col1|Col2|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
||||||||
||||||||
||||||||
||||||||
||||||||
||||||||
|||||||2-GRPO<br>|
||||||||
|||||||~~16-GRPO~~|


0 50 100 150 200
Time (min)



_Figure 2._ 2-GRPO v.s. 16-GRPO – Accuracy v.s. Wall-clock time
on Geometry3K test set. Curves are post-SMA (W=4).


0.6


0.4



0.2


0.0


0.2


0.4


0.6



|Col1|Col2|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
||||||||
||||||||
||||||||
||||||||
||||||||
||||||||
||||||~~2-GR~~<br>16-GR|~~O~~<br>PO|


Time (h)



_Figure 3._ 2-GRPO v.s. 16-GRPO – Reward v.s. Wall-clock time
on code-r1-12k test set. Curves are post-SMA (W=4).



7


**It Takes Two:** **Your GRPO Is Secretly DPO**


_Table 1._ 2-GRPO v.s. 16-GRPO: post-trained on MATH/DAPO-Math-Sub and evaluated on five mathematical reasoning benchmarks.
M/P@32 stands for Mean@32 and Pass@32. _G_ is the group size. ∆ denotes the difference 16 _→_ 2. **2-GRPO uses only 12.5% of the**
**total rollouts and 21.0% of the training time of 16-GRPO, while achieving 98.1% of its average performance** .


**M/P@32** _↑_ _G_ **Time (h)** _↓_ **MATH-500** **AMC 2023** **Minerva Math** **AIME 2025** **Olympiad Bench**


_Post-training on MATH dataset_


w/o          - 31.83 / 81.92 34.30 / 79.23 5.33 / 28.91 3.64 / 22.31 15.40 / 37.16



Qwen-1.5B


Qwen-7B


DS-1.5B


Qwen-1.5B


Qwen-7B



2 2.05 69.28 / 87.43 49.53 / 81.76 16.25 / 33.26 9.48 / 32.88 22.31 / 37.24


16 8.53 70.24 / 87.24 51.25 / 83.46 16.84 / 33.46 10.10 / 35.82 23.11 / 37.82


∆ -75.96% -0.96 / +0.19 -1.71 / -1.70 -0.59 / -0.19 -0.62 / -2.94 -0.80 / -0.58


w/o - 47.16 / 85.95 38.36 / 85.29 5.99 / 31.10 5.00 / 25.17 9.83 / 34.30


2 2.43 75.23 / 89.77 64.60 / 81.53 23.13 / 38.45 12.81 / 38.85 26.39 / 40.20


16 9.30 75.90 / 88.24 61.79 / 80.77 22.81 / 37.68 13.23 / 34.22 25.99 / 40.11


∆ -73.87% -0.67 / +1.53 +2.81 / +0.76 +0.32 / +0.77 -0.42 / +4.63 +0.40 / 0.09


w/o - 65.11 / 84.90 44.14 / 73.86 14.64 / 32.80 22.40 / 42.79 20.07 / 33.23


2 7.07 74.36 / 88.85 56.95 / 88.63 21.28 / 38.34 24.89 / 46.79 33.69 / 45.86


16 38.40 75.98 / 89.16 58.91 / 87.26 21.76 / 38.29 26.97 / 56.36 35.39 / 47.05


∆ -81.6% -1.62 / -0.31 -1.96 / +1.38 -0.48 / -0.05 -2.08 / -9.56 -1.70 / -1.19


_Post-training on DAPO-Math-Sub dataset_


w/o - 31.83 / 81.92 34.30 / 79.23 5.33 / 28.91 3.64 / 22.31 15.40 / 37.16


2 2.12 68.81 / 87.36 52.19 / 85.77 16.79 / 33.61 8.13 / 29.33 23.52 / 39.29


16 13.30 70.66 / 87.04 56.56 / 85.54 18.00 / 34.16 9.58 / 32.31 24.56 / 39.19


∆ -84.06% -1.85 / +0.32 -4.37 / +0.23 -1.21 / +0.71 -2.50 / -2.98 -1.04 / +0.10


w/o - 47.16 / 85.95 38.36 / 85.29 5.99 / 31.10 5.00 / 25.17 9.83 / 34.30


2 3.63 77.43 / 90.51 64.84 / 91.59 21.95 / 38.05 14.58 / 33.03 29.86 / 45.24


16 17.68 77.35 / 88.79 69.69 / 87.31 24.45 / 40.04 14.27 / 33.73 28.86 / 39.84


∆ -79.47% +0.08 / +1.72 -4.85 / +4.28 -2.50 / -1.99 +0.31 / -0.70 +1.00 / +5.4



**6.4. 2-GRPO Performance on Other Tasks**


We extend our experiments with 2-GRPO to additional
RLVR tasks beyond Math reasoning, including Vision Reasoning (Geometric3K, Fig. 2) and Code Generation (CodeR1, Fig. 3). The results demonstrate that 2-GRPO is effective across these diverse tasks, highlighting its broader
applicability.


**7. Limitation**


Our analysis focuses on the RLVR setting, a key paradigm
for LLM post-training. However, real-physical scenarios
often involve continuous reward signals. While we believe
our contrastive analytical framework can be extended to
such settings, which requires further theoretical analysis
and empirical validation, and is left for future work.



**8. Conclusion**


In this work, we revisit GRPO and reveal its fundamental
connection to DPO, demonstrating that it effectively functions as a contrastive learning objective. We argue that the
primary utility of the group mechanism is not for accurate
advantage estimation, as in the prevailing view, but rather
the efficient construction of contrastive signals. Leveraging this insight, we introduce 2-GRPO, a minimal variant
utilizing only two rollouts. While this setting represents
a degenerate case for traditional advantage estimation, it
remains theoretically robust within our contrastive framework. Empirically, 2-GRPO achieves performance comparable to 16-GRPO while significantly reducing the computational overhead of sample generation in RL training. These
findings validate our hypothesis and offer a more efficient
paradigm for designing RL algorithms for LLMs. More
broadly, while our derivation focuses on GRPO, the insights
presented here can extend to a broader class of group-based
RL algorithms.



8


**It Takes Two:** **Your GRPO Is Secretly DPO**



**Impact Statement**


This paper presents work whose goal is to advance the field
of machine learning, specifically for the field of Large Language Models post-training and Reinforcement Learning.
There are many potential societal consequences of our work,
none of which we feel must be specifically highlighted here.


**References**


Ahmadian, A., Cremer, C., Galle, M., Fadaee, M., Kreutzer,´
J., Pietquin, O., Ust [¨] un, A., and Hooker, S.¨ Back to basics:
Revisiting reinforce style optimization for learning from
human feedback in llms. In _Proc._ _Annu._ _Meet._ _Assoc._
_Comput. Linguist._, 2024.


Bai, S., Chen, K., Liu, X., Wang, J., Ge, W., Song, S., Dang,
K., Wang, P., Wang, S., Tang, J., et al. Qwen2. 5-vl
technical report. _arXiv preprint arXiv:2502.13923_, 2025.


Baird, Leemon C., I. Advantage updating. Technical report,
Wright Laboratory, 1993.


Chen, T., Kornblith, S., Norouzi, M., and Hinton, G. A
simple framework for contrastive learning of visual representations. In _Proc. Int. Conf. Mach. Learn._, 2020.


Chopra, S., Hadsell, R., and LeCun, Y. Learning a similarity
metric discriminatively, with application to face verification. In _Proc. IEEE Comput. Soc. Conf. Comput. Vis._
_Pattern Recognit._, 2005.


Chu, X., Huang, H., Zhang, X., Wei, F., and Wang, Y. Gpg:
A simple and strong reinforcement learning baseline for
model reasoning. _arXiv preprint arXiv:2504.02546_, 2025.


DeepSeek-AI. Deepseek-r1: Incentivizing reasoning capability in llms via reinforcement learning, 2025.


Flet-Berliac, Y., Grinsztajn, N., Strub, F., Choi, E., Wu, B.,
Cremer, C., Ahmadian, A., Chandak, Y., Azar, M. G.,
Pietquin, O., et al. Contrastive policy gradient: Aligning
llms on sequence-level scores in a supervised-friendly
fashion. In _Proc. Conf. Empir. Methods Nat. Lang. Pro-_
_cess._, 2024.


Frosst, N., Papernot, N., and Hinton, G. Analyzing and
improving representations with the soft nearest neighbor
loss. In _Proc. Int. Conf. Mach. Learn._, 2019.


Goyal, P., Dollar,´ P., Girshick, R., Noordhuis, P.,
Wesolowski, L., Kyrola, A., Tulloch, A., Jia, Y., and
He, K. Accurate, large minibatch sgd: Training imagenet
in 1 hour. _arXiv preprint arXiv:1706.02677_, 2017.


He, C., Luo, R., Bai, Y., Hu, S., Thai, Z., Shen, J., Hu, J.,
Han, X., Huang, Y., Zhang, Y., Liu, J., Qi, L., Liu, Z., and
Sun, M. OlympiadBench: A challenging benchmark for



promoting AGI with olympiad-level bilingual multimodal
scientific problems. In _Proc. Annu. Meet. Assoc. Comput._
_Linguist._, 2024.


He, K., Fan, H., Wu, Y., Xie, S., and Girshick, R. Momentum contrast for unsupervised visual representation
learning. In _Proc. IEEE/CVF Conf. Comput. Vis. Pattern_
_Recognit._, 2020.


Hejna, J., Rafailov, R., Sikchi, H., Finn, C., Niekum, S.,
Knox, W. B., and Sadigh, D. Contrastive preference
learning: learning from human feedback without rl. _arXiv_
_preprint arXiv:2310.13639_, 2023.


Hendrycks, D., Burns, C., Kadavath, S., Arora, A., Basart,
S., Tang, E., Song, D., and Steinhardt, J. Measuring mathematical problem solving with the math dataset. In _Adv._
_Neural Inf. Process. Syst. (Track Datasets Benchmarks)_,
2021.


Hu, J. Reinforce++: A simple and efficient approach
for aligning large language models. _arXiv_ _preprint_
_arXiv:2501.03262_, 2025.


Johnson, R. and Zhang, T. Accelerating stochastic gradient descent using predictive variance reduction. In _Adv._
_Neural Inf. Process. Syst._, 2013.


Kingma, D. P. Adam: A method for stochastic optimization.
_arXiv preprint arXiv:1412.6980_, 2014.


Lewkowycz, A., Andreassen, A., Dohan, D., Dyer, E.,
Michalewski, H., Ramasesh, V., Slone, A., Anil, C.,
Schlag, I., Gutman-Solo, T., et al. Solving quantitative
reasoning problems with language models. In _Adv. Neural_
_Inf. Process. Syst._, 2022.


Li, G., Lin, M., Galanti, T., Tu, Z., and Yang, T. Disco: Reinforcing large reasoning models with discriminative constrained optimization. _arXiv preprint arXiv:2505.12366_,
2025.


Li, Z., Xu, T., Zhang, Y., Lin, Z., Yu, Y., Sun, R., and Luo,
Z.-Q. Remax: a simple, effective, and efficient reinforcement learning method for aligning large language models.
In _Proc. Int. Conf. Mach. Learn._, 2024.


Liu, J. and Zhang, L. Code-r1: Reproducing r1 for code with
reliable rewards. [https://github.com/ganler/](https://github.com/ganler/code-r1)
[code-r1, 2025.](https://github.com/ganler/code-r1)


Lu, P., Gong, R., Jiang, S., Qiu, L., Huang, S., Liang, X.,
and Zhu, S.-c. Inter-gps: Interpretable geometry problem
solving with formal language and symbolic reasoning. In
_Proceedings of the 59th Annual Meeting of the Associa-_
_tion for Computational Linguistics and the 11th Interna-_
_tional Joint Conference on Natural Language Processing_
_(Volume 1:_ _Long Papers)_, pp. 6774–6786, 2021.



9


**It Takes Two:** **Your GRPO Is Secretly DPO**



Lv, X., Chen, K., Sun, H., Bai, X., Zhang, M., and Liu, H.
The hidden link between rlhf and contrastive learning.
_arXiv preprint arXiv:2506.22578_, 2025.


Oord, A. v. d., Li, Y., and Vinyals, O. Representation learning with contrastive predictive coding. _arXiv_ _preprint_
_arXiv:1807.03748_, 2018.


Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C.,
Mishkin, P., Zhang, C., Agarwal, S., Slama, K., Ray, A.,
et al. Training language models to follow instructions
with human feedback. In _Adv. Neural Inf. Process. Syst._,
2022.


Pang, L. and Jin, R. On the theory and practice of grpo:
A trajectory-corrected approach with fast convergence.
_arXiv preprint arXiv:2508.02833_, 2025.


Rafailov, R., Sharma, A., Mitchell, E., Manning, C. D.,
Ermon, S., and Finn, C. Direct preference optimization:
Your language model is secretly a reward model. In _Adv._
_Neural Inf. Process. Syst._, 2023.


Rendle, S., Freudenthaler, C., Gantner, Z., and SchmidtThieme, L. Bpr: Bayesian personalized ranking from
implicit feedback. In _Proc. Conf. Uncertain. Artif. Intell._,
2009.


Schulman, J., Levine, S., Abbeel, P., Jordan, M., and Moritz,
P. Trust region policy optimization. In _Proc. Int. Conf._
_Mach. Learn._, 2015.


Schulman, J., Moritz, P., Levine, S., Jordan, M., and Abbeel,
P. High-dimensional continuous control using generalized advantage estimation. In _Proc._ _Int._ _Conf._ _Learn._
_Represent._, 2016.


Schulman, J., Wolski, F., Dhariwal, P., Radford, A., and
Klimov, O. Proximal policy optimization algorithms.
_arXiv preprint arXiv:1707.06347_, 2017.


Shao, Z., Wang, P., Zhu, Q., Xu, R., Song, J., Bi, X., Zhang,
H., Zhang, M., Li, Y., Wu, Y., et al. Deepseekmath: Pushing the limits of mathematical reasoning in open language
models. _arXiv preprint arXiv:2402.03300_, 2024.


Sheng, G., Zhang, C., Ye, Z., Wu, X., Zhang, W., Zhang,
R., Peng, Y., Lin, H., and Wu, C. Hybridflow: A flexible
and efficient rlhf framework. In _Proc. Eur. Conf. Comput._
_Syst._, 2025.


Student. The probable error of a mean. _Biometrika_, pp.
1–25, 1908.


Wang, T. and Isola, P. Understanding contrastive representation learning through alignment and uniformity on the
hypersphere. In _Proc. Int. Conf. Mach. Learn._, 2020.



Williams, R. J. Simple statistical gradient-following algorithms for connectionist reinforcement learning. _Machine_
_learning_, 8(3):229–256, 1992.


Wu, Y., Zhang, L., Mo, F., Zhu, T., Ma, W., and Nie, J.Y. Unifying graph convolution and contrastive learning
in collaborative filtering. In _Proc. ACM SIGKDD Conf._
_Knowl. Discov. Data Min._, 2024.


Wu, Y., Ma, L., Li, M., Zhou, J., Ding, L., Hao, J., Leung,
H.-f., King, I., Zhang, Y., and Nie, J.-Y. Advancing multiagent rag system with minimalist reinforcement learning.
In _Proc. Int. Conf. Auton. Agents Multi-Agent Syst._, 2026.


Yang, A., Yang, B., Zhang, B., Hui, B., Zheng, B., Yu, B.,
Li, C., Liu, D., Huang, F., Wei, H., Lin, H., Yang, J., Tu,
J., Zhang, J., Yang, J., Yang, J., Zhou, J., Lin, J., Dang,
K., Lu, K., Bao, K., Yang, K., Yu, L., Li, M., Xue, M.,
Zhang, P., Zhu, Q., Men, R., Lin, R., Li, T., Tang, T., Xia,
T., Ren, X., Ren, X., Fan, Y., Su, Y., Zhang, Y., Wan,
Y., Liu, Y., Cui, Z., Zhang, Z., and Qiu, Z. Qwen2.5
Technical Report, January 2025.


Yu, Q., Zhang, Z., Zhu, R., Yuan, Y., Zuo, X., Yue, Y.,
Dai, W., Fan, T., Liu, G., Liu, L., et al. Dapo: An opensource llm reinforcement learning system at scale. In _Adv._
_Neural Inf. Process. Syst._, 2025.


Zhang, L., Wang, B., Qiu, X., Reddy, S., and Agrawal, A.
REARANK: Reasoning re-ranking agent via reinforcement learning. In _Proc. 2025 Conf. Empir. Methods Nat._
_Lang. Process._, 2025a.


Zhang, R., Arora, D., Mei, S., and Zanette, A. Speed-rl:
Faster training of reasoning models via online curriculum
learning. _arXiv preprint arXiv:2506.09016_, 2025b.


Zhao, Y., Liu, Y., Liu, J., Chen, J., Wu, X., Hao, Y., Lv, T.,
Huang, S., Cui, L., Ye, Q., et al. Geometric-mean policy
optimization. _arXiv preprint arXiv:2507.20673_, 2025.


Zheng, C., Liu, S., Li, M., Chen, X.-H., Yu, B., Gao,
C., Dang, K., Liu, Y., Men, R., Yang, A., et al.
Group sequence policy optimization. _arXiv_ _preprint_
_arXiv:2507.18071_, 2025a.


Zheng, H., Zhou, Y., Bartoldson, B. R., Kailkhura, B., Lai,
F., Zhao, J., and Chen, B. Act only when it pays: Efficient
reinforcement learning for llm reasoning via selective
rollouts. _arXiv preprint arXiv:2506.02177_, 2025b.


Zheng, Y., Lu, J., Wang, S., Feng, Z., Kuang, D., and Xiong,
Y. Easyr1: An efficient, scalable, multi-modality rl training framework, 2025c.


Zhu, L., Guan, Y., Liang, D., Ju, J., Luo, Z., Qin, B., Luan,
J., Liu, Y., and Bai, X. Shuffle-r1: Efficient rl framework
for multimodal large language models via data-centric
dynamic shuffle. _arXiv preprint arXiv:2508.05612_, 2025.



10


**It Takes Two:** **Your GRPO Is Secretly DPO**


**Appendix**


**A. Related Work**


**A.1. Contrastive Learning and LLM Alignment**


Contrastive learning is the cornerstone of self-supervised representation learning (Wang & Isola, 2020; He et al., 2020; Chen
et al., 2020; Wu et al., 2024). The fundamental objective is to minimize the distance between anchor and positive samples in
the representation space while maximizing the distance between the anchor and negative samples. Given this contrastive
nature, the framework shares structural similarity with DPO, which conducts preference learning by increasing the likelihood
of preferred completions relative to dispreferred ones. While recent literature explores the theoretical connections between
RLHF and contrastive learning (Hejna et al., 2023; Flet-Berliac et al., 2024; Lv et al., 2025), our work establishes a formal
link between GRPO and DPO through a contrastive lens. This provides a unified analytical framework for understanding
alignment. Specifically, we attribute the efficacy of GRPO to the construction of contrastive pairs, which serves as a control
variate to reduce the variance of the gradient estimator. This analysis offers generalizable insights to broader alignment
algorithms.


**A.2. Adaptive Rollouts in RLVR**


RL post-training has demonstrated significant success in enhancing LLM performance across diverse domains (Wu et al.,
2026; Zhang et al., 2025a). Unlike SFT, RL requires the model to generate online samples during training. Although
modern frameworks integrate high-throughput inference engines such as vLLM and SGLang, the autoregressive nature of
LLMs ensures that the generation phase remains a primary computational bottleneck. This challenge is exacerbated by the
common intuition that LLM-based RL often necessitates large group sizes to achieve good performance. To mitigate this
overhead, recent studies have proposed selective or adaptive sampling techniques to reduce the number of rollouts without
compromising performance (Zheng et al., 2025b; Zhang et al., 2025b; Zhu et al., 2025). Within this context, 2-GRPO serves
as a robust baseline. Furthermore, our contrastive analysis of GRPO opens a new design space for developing efficient
sampling algorithms in RLVR.


**B. Theorems**


**B.1. Mean Estimation with Samples** _n_ = 2


The instability of normalization with extremely small samples is a well-documented phenomenon in classical statistics,
dating back to the seminal work of _William Sealy Gosset_ (published under the pen name _Student_ ) (Student, 1908). For a
sample size of _n_ = 2, the degrees of freedom _df_ = 1 result in a normalization factor that follows a Cauchy distribution.
Such small-sample estimates of variance are highly skewed, leading to normalized outputs with infinite variance and no
defined mean, undermining the goal of statistical stability.


**B.2. Reveal GRPO as Contrastive Learning**


_Proof of Proposition 3.1._ In the RLVR setting, rewards are binary, which leads to binary advantages given a prompt. Let
_A_ [+] _q_ _[, A]_ _q_ _[−]_ [denote the positive and negative advantage, respectively.] [From Eq. (][6][), we can have]



1 _−_ _p_ ˆ _q_
_A_ [+] _q_ [=] - _p_ ˆ _q_ (1 _−_ _p_ ˆ _q_ ) =




1 _−_ _p_ ˆ _q_

_,_
_p_ ˆ _q_




~~�~~

0 _−_ _p_ ˆ _q_ _p_ ˆ _q_
_A_ _[−]_ _q_ [=] - _p_ ˆ _q_ (1 _−_ _p_ ˆ _q_ ) = _−_ 1 _−_ _p_ ˆ _q_ _._



(21)



The clipping function is



clip( _x,_ 1 _−_ _ϵ,_ 1 + _ϵ_ ) =








_x,_ _|x −_ 1 _| ≤_ _ϵ_

1 _−_ _ϵ,_ _x <_ 1 _−_ _ϵ_ _,_ (22)

1 + _ϵ,_ _x >_ 1 + _ϵ_







which means that _x_ will be assigned to 1 _−_ _ϵ_ (1 + _ϵ_ ) if _x_ is less (greater) than 1 _−_ _ϵ_ (1 + _ϵ_ ). For simplifying notation, let


11


**It Takes Two:** **Your GRPO Is Secretly DPO**


_Cϵ_ [+][(] _[x]_ [) = min[] _[x,]_ [ 1 +] _[ ϵ]_ []][ and] _[ C]_ _ϵ_ _[−]_ [= max[] _[x,]_ [ 1] _[ −]_ _[ϵ]_ []][.]


The key derivation of rewriting GRPO objective is as follows:


_J_ GRPO( _θ_ )



_|oi|_

- _Cϵ_


_t_ =1




- _πθ_ ( _oi,t|oi,<t, q_ )
_πθ_ old( _oi,t|oi,<t, q_ ) _[A][i,t]_




_,_



1

= E _q∼Q_
_{oi}_ _[G]_ _i_ =1 _[∼][π][θ]_ old [(] _[·|][q]_ [)] _G_

= E _q∼Q_



_G_



_i_ =1



1
_|oi|_



_{oj_ _}_ _[G]_ _j_ =1 [+] _[∼][π]_ _θ_ [+] old [(] _[·|][q]_ [)]

_{ok}_ _[G]_ _k_ =1 _[−]_ _[∼][π]_ _θ_ _[−]_ old [(] _[·|][q]_ [)]




- _πθ_ ( _oj,t|oj,<t, q_ )
_πθ_ old( _oj,t|oj,<t, q_ )



_G_ _[−]_



_k_ =1



1
_|ok|_




+




- []

 _,_



_|ok|_

- _A_ _[−]_ _k_ _[C]_ _ϵ_ _[−]_

_t_ =1




- _πθ_ ( _ok,t|ok,<t, q_ )
_πθ_ old( _ok,t|ok,<t, q_ )



1

_G_



 _G_ [+]

 

_j_ =1



1
_|oj|_



_|oj_ _|_

- _A_ [+] _j_ _[C]_ _ϵ_ [+]

_t_ =1



_|oj_ _|_




= E _q∼Q_

_{oj_ _}_ _[G]_ _j_ =1 [+] _[∼][π]_ _θ_ [+] old [(] _[·|][q]_ [)]

_{ok}_ _[G]_ _k_ =1 _[−]_ _[∼][π]_ _θ_ _[−]_ old [(] _[·|][q]_ [)]



(23)



_G_ _[−]_

- 1

_|ok|_

_k_ =1



_|ok|_

- _Cϵ_ _[−]_

_t_ =1




- _πθ_ ( _ok,t|ok,<t, q_ )
_πθ_ old( _ok,t|ok,<t, q_ )



_G_ [+] 1
_A_ [+] _q_ _G_ _G_ [+]



_G_ [+]



_j_ =1



1
_|oj|_




- _G_ _[−]_ 1
+ _A_ _[−]_ _q_ _G_ _G_ _[−]_



_|oj_ _|_

- _Cϵ_ [+]

_t_ =1




- _πθ_ ( _oj,t|oj,<t, q_ )
_πθ_ old( _oj,t|oj,<t, q_ )




_,_



= E _q∼Q_

_{oj_ _}_ _[G]_ _j_ =1 [+] _[∼][π]_ _θ_ [+] old [(] _[·|][q]_ [)]

_{ok}_ _[G]_ _k_ =1 _[−]_ _[∼][π]_ _θ_ _[−]_ old [(] _[·|][q]_ [)]



_G_ [+]



_j_ =1



1
_|oj|_



_G_ _[−]_



_k_ =1




- []

 _._



_|oj_ _|_

- _Cϵ_ [+]

_t_ =1




- _πθ_ ( _oj,t|oj,<t, q_ ) - _−_ 1
_πθ_ old( _oj,t|oj,<t, q_ ) _G_ _[−]_



1
_|ok|_



_|ok|_

- _Cϵ_ _[−]_

_t_ =1




- _πθ_ ( _ok,t|ok,<t, q_ )
_πθ_ old( _ok,t|ok,<t, q_ )




~~�~~
Var� _G_ ( _q_ )





 [1]

_G_ [+]



The second equation is obtained by dividing the trajectories into two groups: positive and negative. The third equation
is obtained by the fact that all positive advantages are the same and that all negative advantages are the same. Since




[+]  - 1 _−p_ ˆ

_G_ [=] _p_ ˆ




_[G]_ [+]
_A_ [+]



_−p_ ˆ _p_ ˆ _[p]_ [ˆ][ =] ~~�~~ (1 _−_ _p_ ˆ)ˆ _p_ and _A_ _[−]_ _[G]_ _G_ _[−]_



_A_ [+] _[G]_ _G_ [=] 1 _−p_ ˆ _p_ ˆ _[p]_ [ˆ][ =] ~~�~~ (1 _−_ _p_ ˆ)ˆ _p_ and _A_ _[−]_ _[G]_ _G_ [=] _[ −]_ ~~�~~ (1 _−_ _p_ ˆ)ˆ _p_, we obtain Eq. (10). When _G →∞_, we have the following

facts:
lim [=] _[ ∞]_ _[,]_
_G→∞_ _[G]_ [+]



lim
_G→∞_ _[G][−]_ [=] _[ ∞]_



lim
_G→∞_




~~�~~ (1 _−_ _p_ ˆ)ˆ _p_ = �(1 _−_ _p_ ) _p,_



1
lim
_G_ [+] _→∞_ _G_ [+]


1
lim
_G_ _[−]_ _→∞_ _G_ _[−]_



_G_ [+]


_f_ ( _oj_ ) = E _oj_ _∼Oθ_ + _[f]_ [(] _[o][j]_ [)] _[,]_
_j_ =1


_G_ _[−]_


_f_ ( _ok_ ) = E _ok∼Oθ−_ _[f]_ [(] _[o][k]_ [)] _[ .]_
_k_ =1



Then the GRPO objective has the following gradient w.r.t. parameter _θ_ :


_∇θJ_ GRPO =



_G_ [+] _q_ _|o_ [+] _j_ _[|]_

- 

_j_ =1 _t_



1 _[ϵ]_ _j,t_ _[∇][θ][π][θ]_ [(] _[o]_ [+] _j,t_ _[|][o]_ [+] _j,<t_ _[, q]_ [)] 1

_|o_ [+] _j_ _[|][π][θ]_ old [(] _[o]_ [+] _j,t_ _[|][o]_ [+] _j,<t_ _[, q]_ [)] _[−]_ _G_ _[−]_ _q_



_G_ _[−]_ _q_ _o_ _[−]_ _k_

- 

_k_ =1 _t_



1 _[ϵ]_
_k,t_ _[∇][θ][π][θ]_ [(] _[o][−]_ _k,t_ _[|][o][−]_ _k,<t_ _[, q]_ [)]

_|o_ _[−]_ _k_ _[|][π][θ]_ [old][(] _[o]_ _k,t_ _[−]_ _[|][o][−]_ _k,<t_ _[, q]_ [)]








 
E Var� _G_ ( _q_ )
_q∼Q_




1
_G_ [+] _q_



(24)


(25)


(26)




   1

= E
_q∼Q_ _G_ [+] _q_



_G_ [+] _q_ _|o_ [+] _j_ _[|]_

- - _c_ ( _o_ [+] _j,t_ _[|][o]_ [+] _j,<t_ _[, q]_ [)] _[∇][θ][π][θ]_ [(] _[o]_ [+] _j,t_ _[|][o]_ [+] _j,<t_ _[, q]_ [)]

_j_ =1 _t_




_−_ [1]

_G_ _[−]_ _q_



_G_ _[−]_ _q_



_k_ =1



_|o_ _[−]_ _k_ _[|]_

- _c_ ( _o_ _[−]_ _k,t_ _[|][o][−]_ _k,<t_ _[, q]_ [)] _[∇][θ][π][θ]_ [(] _[o][−]_ _k,t_ _[|][o][−]_ _k,<t_ _[, q]_ [)]

_t_



_|o_ _[−]_ _k_ _[|]_









- �� Positive


12




- �� Negative


**It Takes Two:** **Your GRPO Is Secretly DPO**

_√_
where 1 _[ϵ]_ _j,t_ [is an indicator function if the token] _[ o][j,t]_ [ is clipped and] _[ c]_ [(] _[o][i,t][|][o][i,<t][, q]_ [) :=] _|oi|πθ_ oldVar(�( _oi,tq_ ) _|_ 1 _oi,<t_ _[ϵ]_ _i,t_ _,q_ ) [.] [Compare Eq. (][26][)]

with Def. 2.1, the derivative of GRPO is a Monte Carlo estimator of contrastive derivative.


**B.3. Further Discussion on Importance Sampling and the Log-likelihood Term**


Most autoregressive LLMs adopt causal probability modelling as log _πθ_ ( _o|q_ ) = log _πθ_ ( _ot|o<t, q_ ). This decomposition

[�]
leads to the following trajectory-level form to describe the gradient of token probabilities:



_∇θ_ log _πθ_ ( _o|q_ ) =            

_t_


DPO follows a similar structural derivation.



1
(27)
_πθ_ ( _ot|o<t, q_ ) _[∇][θ][π][θ]_ [(] _[o][t][|][o][<t][, q]_ [)] _[ .]_



It is worth mentioning that the importance sampling in PPO can be viewed as a natural extension of such gradient form for
online on/off-policy RL (Schulman et al., 2017). However, the token-level importance sampling in PPO and vanilla GRPO
often obscures this direct connection at the trajectory level.


Recent subsequent variants of GRPO (Zheng et al., 2025a; Zhao et al., 2025; Pang & Jin, 2025), e.g., GSPO and TIC-GRPO,
utilize sequence-level importance sampling. This formulation allows us to draw a direct connection between importance
sampling and the log-likelihood terms:



_∇θ_ _πθ_ ( _o | q_ ) _πθ_ ( _o | q_ )
_πθ_ old( _o | q_ ) [=] _πθ_ old( _o | q_ )






_t_



1

_[|][ o][<t][, q]_ [)] _[ .]_ (28)
_πθ_ ( _ot_ _| o<t, q_ ) _[∇][θ][π][θ]_ [(] _[o][t]_



It is straightforward to see from the gradient form that the importance sampling term adjusts the Log-likelihood term by a
coefficient _πθπ_ old _θ_ ( _o_ ( _|oq|_ ) _q_ ) [.] [The token-level importance sampling in PPO and GRPO behaves similarly by applying token-level]
correction.


The clipping applied on top of importance sampling is a minor additional modification, which we do not elaborate on here.


**B.4. Proof of Lemma B.1**


**Lemma B.1.** _The DPO loss is a_ 1 _-vs-_ 1 _contrastive loss estimator._


_Proof of Lemma B.1._ The DPO loss (Eq. (9)) has the following derivatives:



_∇θL_ DPO = _−β_ E

[( _q,o_ [+] _,o_ _[−]_ ) _∼D_ DPO]




- - - [�]
_σ_ (ˆ _rθ_ ( _q, o_ _[−]_ ) _−_ _r_ ˆ _θ_ ( _q, o_ [+] )) _∇θ_ log _πθ_ ( _o_ [+] _|q_ ) _−∇θ_ log _πθ_ ( _o_ _[−]_ _|q_ )




(29)


(30)



= _−_ E

[( _q,o_ [+] _,o_ _[−]_ ) _∼D_ DPO]




- _|o_ + _|_

 - _c_ ( _o_ [+] _t_ _[|][o]_ _<t_ [+] _[, q]_ [)] _[∇][θ][π][θ]_ [(] _[o]_ [+] _t_ _[|][o]_ _<t_ [+] _[, q]_ [)]

_t_


 - ��  Positive




_−_



_|o_ _[−]_ _|_

- _c_ ( _o_ _[−]_ _t_ _[|][o]_ _<t_ _[−]_ _[, q]_ [)] _[∇][θ][π][θ]_ [(] _[o][−]_ _t_ _[|][o]_ _<t_ _[−]_ _[, q]_ [)]

_t_


- �� Negative




_[π][θ]_ [(] _[y][|][x]_ [)] _[βσ]_ [(ˆ] _[r][θ]_ [(] _[q,o][−]_ [)] _[−][r]_ [ˆ] _[θ]_ [(] _[q,o]_ [+][))]

_π_ ref( _y|x_ ) [; and] _[ c]_ [(] _[o][t][|][o][<t][, q]_ [) :=] _πθ_ ( _o|q_ )



where ˆ _rθ_ = _β_ ( _x, y_ ) log _[π][θ]_ [(] _[y][|][x]_ [)]



_πθ_ ( _o|q_ ) _[θ]_, aligning with Def. 2.1.



**B.5. Proof of Proposition 4.1**



_Proof._



Var( _**g**_ [+] _−_ _c_ _**g**_ _[−]_ ) = Var( _**g**_ [+] ) + _c_ [2] Var( _**g**_ _[−]_ ) _−_ 2 _c_ Cov( _**g**_ [+] _,_ _**g**_ _[−]_ ) _,_

= Var( _**g**_ [+] ) _−_ [Cov][2][(] _**[g]**_ [+] _[,]_ _**[ g]**_ _[−]_ [)] _,_

Var( _**g**_ _[−]_ )

= (1 _−_ _ρ_ [2] )Var( _**g**_ [+] ) _._



The first equation is obtained by the definition of variance. The second equation is obtained by substituting _c_ = [Cov(] Var( _**[g]**_ [+] _**g**_ _[−][,]_ _**[g]**_ ) _[−]_ [)] .



The third equation is hold because _ρ_ = ~~_√_~~ Cov( _**g**_ [+] _,_ _**g**_ _[−]_ ) [On the other hand, consider] _[ f]_ [(] _[c]_ [) =] _[ c]_ [2][Var(] _**[g]**_ _[−]_ [)] _[−]_ [2] _[c]_ [Cov(] _**[g]**_ [+] _[,]_ _**[ g]**_ _[−]_ [)][.]

Var( _**g**_ [+] )Var( _**g**_ _[−]_ ) [.]



If 0 _≤_ _c ≤_ 2 [Cov] Var( [2][(] _**[g]**_ _**g**_ [+] _[−][,]_ _**[g]**_ ) _[−]_ [)], then _f_ ( _c_ ) _≤_ 0.



13


**It Takes Two:** **Your GRPO Is Secretly DPO**


**B.6. Proof of Proposition 5.1**

_Proof._ **Case** **1.** Notice that _σ_ ˆ = - 21 _N_ �2 _kN_ =1 [(] _[X][k][ −]_ _[µ]_ [ˆ][)][2] [=] - _µ_ ˆ(1 _−_ _µ_ ˆ) and _µ_ ˆ = 21 _N_ �2 _kN_ =1 _[X][k]_ [.] [Fix] [an] [index] _[i]_ [and]
condition on the event _{Xi_ = _x}_ with _x_ _∈{_ 0 _,_ 1 _}_ . In this case, by the strong law of large numbers and the continuous
mapping theorem, we have _µ_ ˆ _a.s.→_ _p_ and _σ_ ˆ _a.s.→_ - _p_ (1 _−_ _p_ ). Thus, it follows that


_x −_ _p_
_ϵ_ lim _→_ 0 _N_ [lim] _→∞_ [E][[] _[Y][i]_ _[|][ X][i]_ [=] _[ x]_ [] =]                         - _p_ (1 _−_ _p_ ) _._


**Case 2.** When _Xi,_ 1 = _Xi,_ 2, we have _Xi,j_ = _µ_ ˆ _i_ and _Yi,j_ = 0 for any _j_ _∈{_ 1 _,_ 2 _}_ . When _Xi,_ 1 = _Xi,_ 2, we have _µ_ ˆ _i_ = 0 _._ 5,
_σ_ ˆ _i_ = 0 _._ 5, and _Yi,j_ = [2] _[X]_ 1+2 _[i,j]_ _[−]_ _ϵ_ [1] _[.]_ [ By the law of total expectation, it follows that]


_−p_

E [ _Yi,j_ _| Xi,j_ = 1] = [1] _[ −]_ _[p]_ E [ _Yi,j_ _| Xi,j_ = 0] =

1 + 2 _ϵ_ _[,]_ 1 + 2 _ϵ_ _[.]_


Thus, we have
_ϵ_ lim _→_ 0 [E][[] _[Y][i,j]_ _[|][ X][i,j]_ [=] _[ x]_ [] =] _[ x][ −]_ _[p.]_


**B.7. Proof of Lemma 5.3**


_Proof of Lemma 5.3._



_**g**_ ( _**x**_ _i_ )

_i_ =1







Var(ˆ _**g**_ _B_ ) = Var _{_ _**x**_ _i}Bi_ =1




1

_B_



_B_




(31)



_._
_B_



= [1]

_B_ [2]



_B_





- Var _**x**_ _i_ ( _**g**_ ( _**x**_ _i_ )) = [Var] _**[x]**_ _B_ [(] _**[g]**_ [(] _**[x]**_ [))]

_i_ =1



where the second and third equalities are obtained by the properties of independence and identity in i.i.d. data, respectively.
By the above equation, increasing _B_ decreases Var.


**C. Experiments**


**C.1. Experiment Details**


**Dataset and Baselines** For math reasoning task, following prior work (Chu et al., 2025), we employ Qwen2.5-Math-1.5B
(Qwen-1.5B) and Qwen2.5-Math-7B (Qwen-7B) (Yang et al., 2025) as base models. Both models are post-trained via RL on
the MATH (Hendrycks et al., 2021) and DAPO-Math-17k (Yu et al., 2025) datasets, and evaluated on MATH-500 (Hendrycks
et al., 2021), AMC23, Minerva Math (Lewkowycz et al., 2022), AIME-2025, and OlympiadBench (He et al., 2024). For
DAPO-Math-17k dataset, we randomly sample 7.5k questions from the original data to form a subset for training in
order to align with the size of MATH. In addition, we assess the proposed method on DeepSeek-R1-Distill-Qwen-1.5B
(DS-1.5B) (DeepSeek-AI, 2025), which is post-trained on MATH. Owing to computational constraints, we do not extend its
post-training to DAPO-Math-17k. All 1.5B models are trained on 4 GPUs. Qwen-7B is trained on 8 GPUs. We evaluate
model performance using two metrics: Mean@32, the average accuracy across 32 i.i.d. samples, and Pass@32, which
measures whether a problem is solved in at least one of those 32 attempts.


For visual reasoning task, we use EasyR1 (Zheng et al., 2025c) framework, Qwen2.5-7B (Bai et al., 2025) as the base
model, and Geometric3K (Lu et al., 2021) as the dataset. For code generation task, we use Code-R1 (Liu & Zhang, 2025)
framework, Qwen2.5-7B-Instruct-1M as the base model, and code-r1-12k [7] as the dataset. Both visual reasoning and code
generation tasks are conducted on 8 GPU.


7https://huggingface.co/datasets/ganler/code-r1-12k


14


**It Takes Two:** **Your GRPO Is Secretly DPO**


**Hyper-parameters** We mainly follow the default configuration of the _verl_ framework. For sampling parameters in training
generation, we set temperature to 1, top-p to 1 to encourage exploration, sequence length to 4096 for Qwen-series model
and 8192 for DS-1.5B. For sampling parameters in test generation, we set temperature to 0.7, top-p to 0.8, top-k to 20 and
sequence length to 4096 for all models. For optimization, training employs the Adam optimizer (Kingma, 2014) with a
constant learning rate and a linear warm-up over the first 10 steps. For GRPO hyper-parameters, we set the clip ratio high
to 0 _._ 28 and clip ratio lower to 0 _._ 2 following DAPO (Yu et al., 2025). All models are trained for 10 epochs. The baseline
method, 16-GRPO, is trained with batch sizes of 32 (32 prompts and 16 rollouts per prompt) and a learning rate 1 _×_ 10 _[−]_ [6] .
As discussed in Sec. 5.3, we trained 2-GRPO with a larger batch size of 256 (256 prompts and 2 rollouts per prompt). Both
case will have 512 rollouts in each mini-batch of training. Since we have fewer update steps due to the larger batch size, we
adjust the learning rate of 2-GRPO to 8 _×_ 10 _[−]_ [6] based on the linear relationship of learning rate and batch size (Goyal et al.,
2017).


**C.2. The Connection Between Training Rollouts and Computational Cost**


In Sec. 6.2, the total number of rollouts generated and utilized during training is adopted as a metric for comparing the
computational cost of different methods.


The rationale for this choice is as follows. A principled measure of computational cost in the context of RL post-training
is the number of floating-point operations (FLOPs) performed. Unlike wall-clock time, which is susceptible to variations
arising from software implementation details (e.g., optimization of training libraries) and hardware characteristics (e.g.,
GPU/CPU architecture, I/O throughput), FLOPs provide a more direct and stable measure of computational effort.


For a fixed base model and the same type of RL algorithm (GRPO in our case), the FLOPs required for a single forward or
backward pass with one input prompt can be considered constant, for both the generation and training phases. Accordingly,
the total number of rollouts executed during training is directly proportional to the FLOPs executed, thereby serving as a
theoretically justified and consistent proxy for computational cost.


**D. Additional Experiments**


**D.1. Sensitivity Study**


In this section, we provide an ablation study across different group-sizes in GRPO without the scaling term. We visualize
the curve of rewards on the training and test sets of MATH dataset.


We conducted a sensitivity study on GRPO without the scaling term, varying group size while keeping training epochs
constant. As shown in Fig. 4, all group sizes follow a similar optimization trend. Notably, the total number of rollouts
(#prompts _×_ #epochs _×_ #rollouts-per-group) indeed correlates with training rewards.


However, the 4- and 8-rollout variants exhibit slightly wider generation gaps on the test set. We hypothesize that this
phenomenon stems from fluctuations in the number of positive and negative examples within the Monte Carlo estimators
compared to the 2-GRPO baseline. This suggests that the 2-rollout configuration may provide an intrinsic stabilizing effect
during optimization. We leave a more in-depth investigation to future work, which could yield further insights into designing
group-relative RL algorithms.


**D.2. The Impact of Scaling Term in GRPO**


We additionally compare 16-GRPO with 16-CTR-GRPO (i.e., GRPO with the scaling term) to serve as a baseline in the
sensitivity study.


**E. The Use of Large Language Models (LLMs)**


We used LLMs to polish the writing.


15


0.80


0.75


0.70


0.65


0.60


0.55


0.50


0.45


0.40



|Col1|Col2|Col3|Col4|
|---|---|---|---|
|||||
|||||
|||||
|||||
|||||
||||G=16<br>|
||||G=8<br>~~G=4~~|
||||G=2|


0 50 100 150 200 250
Time (mins)


_(a)_ Training Reward during post-training.



**It Takes Two:** **Your GRPO Is Secretly DPO**


0.70


0.68



|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||||||||
|||||||||
|||||||||
|||||||||
||||||||G=16<br>~~=8~~|
||||||||G=4<br>|
||||||||~~=2~~|


0 50 100 150 200 250
Time (mins)


_(b)_ Evaluation score on the Test set.



0.66


0.64


0.62


0.60


0.58


0.56



_Figure 4._ Sensitivity Study of Group Sizes on CTR-GRPO at MATH dataset (10ep). Curves are post simple-moving-average (SMV) with
window-size=4 for better visualization, respectively. 2-GRPO is equivalent to 2-CTR-GRPO.


0.70


0.68


0.66



0.64


0.62


0.60


0.58


0.56



|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||
|||||||CTR<br>16-|-GRPO<br>GRPO|


0 20 40 60 80 100 120
Step



_Figure 5._ Test-scores of 16-GRPO and 16-CTR-GRPO on MATH dataset; Curves are post-SMV (W=4) for better visualization


16


