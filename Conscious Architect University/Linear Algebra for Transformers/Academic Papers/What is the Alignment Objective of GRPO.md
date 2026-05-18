## **What is the Alignment Objective of GRPO?**

Milan Vojnovic and Se-Young Yun [*]


**Abstract**


In this note, we examine the aggregation of preferences achieved by the Group Relative Policy


Optimisation (GRPO) algorithm, a reinforcement learning method used to train advanced artificial


intelligence models such as DeepSeek-R1-Zero and DeepSeekMath [DeepSeek-AI et al., 2025, Shao


et al., 2024]. The GRPO algorithm trains a policy using a reward preference model, which is computed


by sampling a set of outputs for a given context, observing the corresponding rewards, and applying


shift-and-scale normalisation to these reward values. Additionally, it incorporates a penalty function


to discourage deviations from a reference policy.


We present a framework that enables us to characterise the stationary policies of the GRPO al

gorithm. This analysis reveals that the aggregation of preferences differs fundamentally from stan

dard logarithmic pooling, which is implemented by other approaches such as RLHF. The precise form


of preference aggregation arises from the way the reward preference model is defined and from the


penalty function, which we show to essentially correspond to the reverse Kullback–Leibler (KL) diver

gence between the aggregation policy and the reference policy.


Interestingly, we demonstrate that for groups of size two, the reward preference model corresponds


to pairwise comparison preferences, similar to those in other alignment methods based on pairwise


comparison feedback. We provide explicit characterisations of the aggregate preference for binary


questions, for groups of size two, and in the limit of large group size. This provides insights into


the dependence of the aggregate preference on parameters such as the regularisation constant and the


confidence margin of question answers.


Finally, we discuss the aggregation of preferences obtained by modifying the GRPO algorithm to


use direct KL divergence as the penalty or to use rewards without scale normalisation.

### **1 Introduction**


The recently developed advanced artificial intelligence model, DeepSeek R1, has demonstrated remark

able performance in solving complex reasoning tasks, logic problems, and other step-by-step problems


DeepSeek-AI et al. [2025]. At its core, the system employs reinforcement learning, specifically the Group


Relative Policy Optimisation (GRPO) algorithm, originally proposed in Shao et al. [2024]. The objective


*M. Vojnovic is with the Department of Statistics, London School of Economics, London, UK, `m.vojnovic@lse.ac.uk` . S. Yun


is with KAIST AI, Seoul, South Korea, `yunseyoung@kaist.ac.kr` .


1


is to train a language model using reinforcement learning, where feedback preferences serve as a re

ward signal alongside a reference language model. This process can be viewed as aligning the reward


maximisation preference and the reference model’s preference. For example, the rewards may be ac

curacy indicators computed through a rule-based reward system, determining whether a response to a


given question is correct. In this note, we refer to responses as outputs and questions as contexts. GRPO


extends the previously proposed Proximal Policy optimisation (PPO) algorithm [Schulman et al., 2017]


in several ways: it introduces a novel method for computing the advantage of outputs in a given con

text by sampling a group of outputs, and it incorporates a new regulariser based on an estimator of the


Kullback-Leibler (KL) divergence to bias the policy towards a reference policy model.


In this note, we examine the GRPO algorithm, focusing on its alignment properties and their rela

tionship to other alignment algorithms.


**Group** **Relative** **Policy** **optimisation** **(GRPO)** For a context _q_ sampled from a distribution _µ_, the

GRPO algorithm samples a group of outputs _o_ 1, . . ., _oG_ from an old policy _πθ_ old ( _·_ _|_ _q_ ), observes their

corresponding rewards _r_ 1, . . ., _rG_, and uses this information, along with a given reference policy _π_ ref( _· |_

_q_ ), to define the objective function for selecting a new policy. This new policy _πθ_ aims to maximise the


following objective:



_G_
### ∑

_i_ =1




       
- _A_ ˜ _i_ ( _θ_ ) _−_ _βDi_ ( _θ_ )�



_JGRPO_ ( _θ_ ) = **E** i.i.d.
_q∼µ_, _{oi}i_ _[G]_ =1 _∼_ _πθ_ old ( _·|q_ )




1
_G_



(1)



with
_A_ ˜ _i_ ( _θ_ ) = min        - _πθ_ ( _oi_ _|_ _q_ )
_πθ_ old ( _oi_ _|_ _q_ ) _[A][i]_ [, clip] _[ϵ]_




- _πθ_ ( _oi_ _|_ _q_ ) - _Ai_
_πθ_ old ( _oi_ _|_ _q_ )




,




_[|]_ _[q]_ [)]
_Di_ ( _θ_ ) = _[π]_ [ref][(] _[o][i]_




[ref][(] _[o][i]_ _[|]_ _[q]_ [)] _[π]_ [ref][(] _[o][i]_ _[|]_ _[q]_ [)]

_πθ_ ( _oi_ _|_ _q_ ) _[−]_ [log] _πθ_ ( _oi_ _|_ _q_ )



_πθ_ ( _oi_ _|_ _q_ ) _[−]_ [1,]



where _G_ is an integer-valued hyperparameter greater than or equal to two, and _ϵ_ and _β_ are positive
valued hyperparameters. The function clip _ϵ_ ( _x_ ) outputs _x_ if 1 _−_ _ϵ_ _≤_ _x_ _≤_ 1 + _ϵ_, 1 _−_ _ϵ_ if _x_ _<_ 1 _−_ _ϵ_, and

1 + _ϵ_ if _x_ _>_ 1 + _ϵ_ . Additionally, _Ai_ represents the advantage corresponding to the output _oi_ within the


group, defined as:

_Ai_ = _[r][i][ −]_ [mean][(] _[r]_ [1][, . . .,] _[ r][G]_ [)] . (2)

std( _r_ 1, . . ., _rG_ )


              Here, mean( _r_ 1, . . ., _rG_ ) [def] = (1/ _G_ ) ∑ _i_ _[G]_ =1 _[r][i]_ [ and std][(] _[r]_ [1][, . . .,] _[ r][G]_ [)] [def] = (1/ _G_ ) ∑ _i_ _[G]_ =1 [(] _[r][i][ −]_ [mean][(] _[r]_ [1][, . . .,] _[ r][G]_ [))][2][.] [In]

Equation (2), we define _Ai_ = 0/0 _≡_ 0 in the case where _r_ 1 = _· · ·_ = _rG_ .


The objective in (1) consists of two terms: a _reward_ _preference_ _model_ and a _reference-policy_ _divergence_


_penalty_ . The reward preference model is designed to favour outputs that achieve a higher reward rel

ative to other outputs within the group. The reference-policy divergence penalty discourages policies


from deviating excessively from the reference policy. The decomposition of the objective function into


a reward preference model and a reference-policy divergence penalty is a common approach in various


alignment algorithms, with key differences arising in how these terms are specifically defined.


2


The definition of the advantage values in Equation (2), which is equivalent to



_Ai_ =



_G_ 1 [∑] _[G]_ _j_ =1 [(] _[r][i]_ _[−]_ _[r][j]_ [)]

- 1 [,]
2 _G_ [2] [∑] _[G]_ _j_ =1 [∑] _k_ _[G]_ =1 [(] _[r][j][ −]_ _[r][k]_ [)][2]



applies shift and scale normalisation. Using shift normalisation with a baseline is a standard technique


for variance reduction in reinforcement learning, particularly when the average reward is used as the


baseline [Sutton and Barto, 2018]. While scale normalisation is perhaps less common in reinforcement


learning, both shift and scale normalisation are widely used in machine learning. Importantly, these


normalisation techniques ensure that the advantage terms remain invariant under shift and scale trans

formations of the input rewards.


Both the reward preference model and the reference-policy divergence penalty of GRPO differ from


those used in some well-known alignment approaches, which we discuss in the following section.


**1.1** **Related work**


In this section, we review two existing alignment approaches, which we use as baselines to compare


their alignment objectives with that of the GRPO algorithm.


**Reinforcement Learning from Human Feedback (RLHF)** The standard RLHF paradigm [Christiano


et al., 2017, Stiennon et al., 2020] consists of two main steps: learning the reward model and optimising


the policy using the learned reward model. In the first step, the reward model _rϕ_ ( _·_ _|_ _q_ ) is trained on a


dataset containing examples of human preferences in the form of pairwise comparisons of outputs for


given contexts. In the second step, the objective is to find a policy that maximises the following objective


function:

_JRLHF_ ( _θ_ ) = **E** _q∼µ_, _o∼πθ_ ( _·|q_ )[ _rϕ_ ( _o_ _|_ _q_ )] _−_ _β_ **E** _q∼µ_ [KL( _πθ_ ( _· |_ _q_ ) _||_ _π_ ref( _· |_ _q_ ))] (3)


where _π_ ref( _· |_ _q_ ) is a reference model policy and KL( _π_ _||_ _π_ _[′]_ ) is the Kullback-Leibler divergence between

two distributions _π_ and _π_ _[′]_, KL( _π_ _||_ _π_ _[′]_ ) = **E** _x∼π_ [log( _π_ ( _x_ )/ _π_ _[′]_ ( _x_ ))]. The objective function in (3) is


optimised by using PPO [Schulman et al., 2017] or similar optimisation approaches. PPO is an actor

critic RL algorithm that is used in the RL fine-tuning stage of LLMs [Ouyang et al., 2022].


The RLHF can be seen as an approach for aggregating a reward preference and a reference-policy


preference according to:

1

_πθ_ ( _o_ _|_ _q_ ) = _Z_ [1] _q_ _π_ ref( _o_ _|_ _q_ ) _e_ _β_ _[r][ϕ]_ [(] _[o][|][q]_ [)] (4)


where _Zq_ is a normalisation constant. This follows directly by choosing _πθ_ ( _·_ _|_ _q_ ) that maximises the


RLHF objective function (3). The aggregate preference distribution in (4) follows the logarithmic opin

ion pooling form [Genest et al., 1984]. Logarithmic opinion pooling is a method for aggregating mul

tiple probability distributions into a single consensus distribution, where the consensus distribution is


proportional to some weighted geometric average of the individual distributions. Specifically, (4) de

fines the consensus distribution as a weighted geometric average of the reference-policy distribution


3


_π_ ref( _·_ _|_ _q_ ) and the Luce’s choice [Luce, 1959] distribution _e_ _[r][ϕ]_ [(] _[o][|][q]_ [)] / ∑ _o′ e_ _[r][ϕ]_ [(] _[o][′][|][q]_ [)] parametrised with the

reward values, with the respective weights of values 1 and 1/ _β_ .


**Nash Learning from Human Feedback (NLHF)** NLHF is an alignment approach introduced in [Munos


et al., 2024], where the reward preference model is defined in terms of pairwise preferences over outputs

for a given context. Specifically, the preference of an output _o_ over another output _o_ _[′]_, given a context

_q_, is expressed as a value _P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) in the range [0, 1]. The pairwise preferences are assumed to

be antisymmetric, meaning that _P_ ( _o_ _[′]_ _≻_ _o_ _|_ _q_ ) = 1 _−P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ). Given the pairwise preferences

_P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) and a reference policy _π_ ref( _·_ _|_ _q_ ) for each context _q_, the aggregation of preferences is


defined as the symmetric Nash equilibrium of a two-player zero-sum game. The expected payoff for a

player deploying the mixed strategy _π_ against a player deploying the mixed-strategy _π_ _[′]_, is given by:



_π_ ref( _o_ _[′]_ _|_ _q_ )



_JNLHF_ ( _π_, _π_ _[′]_ ) = **E** _q∼µ_, _o∼π_ ( _·|q_ ), _o′∼π′_ ( _·|q_ )




- _[|]_ _[q]_ [)]
_P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) _−_ _β_ log _[π]_ [(] _[o]_




_[π]_ [(] _[o]_ _[|]_ _[q]_ [)] _[π][′]_ [(] _[o][′]_ _[|]_ _[q]_ [)]

_π_ ref( _o_ _|_ _q_ ) [+] _[ β]_ [ log] _π_ ref( _o_ _[′]_ _|_ _q_




(5)



where _β_ is a positive-valued hyperparameter. The NLHF two-player zero-sum game has a unique Nash


equilibrium, which is also the limit point of a mirror-descent iterative computation algorithm [Munos


et al., 2024].


A notable difference between NLHF and RLHF is that NLHF observes reward preferences as pair

wise comparisons of outputs, whereas RLHF expresses preferences as absolute reward vaues assigned


to individual outputs. It can be easily shown that the solution to the NLHF game satisfies:


1

_π_ ( _o_ _|_ _q_ ) = _Z_ [1] _q_ _π_ ref( _o_ _|_ _q_ ) _e_ _β_ **[E]** _o_ _[′]_ _∼π_ ( _·|q_ ) [[] _[P]_ [(] _[o][≻][o][′][|][q]_ [)]]


where _Zq_ is a normalisation constant. Notably, this can also be interpreted as a logarithmic pooling of


distributions, where the geometric averaging weights depend on _π_ .


**1.2** **Summary of our findings**


Our findings can be summarised in the following points:


 - We present a framework for analysing the stationary policies of the GRPO algorithm, expressing


the reward preference model and the reference-policy divergence penalty in a way that reveals


their fundamental role in aligning preferences. This framework clarifies the contribution of indi

vidual components and their relationship to previously proposed algorithms for preference aggre

gation.


 - We show that preference aggregation in GRPO corresponds to scaling the reference probability of


an output, given a context, by a function that increases with the expected advantage of the output


relative to the expected advantage of a randomly chosen group of outputs from the aggregate


probability distribution. This form of preference aggregation differs from the logarithmic pooling


used in methods such as RLHF.


4


 - For groups of size two, we show that the reward preference model corresponds to pairwise com

parison preferences, where comparisons involve point rewards for outputs in a pair, given a con

text. In the limit of large group sizes, the reward preference model converges to the expected


reward normalised by the standard deviation of the reward of an output sampled from the previ

ous policy.


 - Regarding the reference-policy divergence penalty, we find that for stationary policies, GRPO’s


penalty is essentially equivalent to the reverse KL divergence between the new candidate policy


and the reference policy. It is unclear whether this was the intended design, as the penalty was


originally motivated as an estimator of the direct KL divergence. The fact that the penalty effec

tively corresponds to the reverse KL divergence plays a key role in shaping how preferences are


aggregated.


 - We derive explicit closed-form expressions for the stationary policies in the case of binary ques

tions, for groups of size two, and in the asymptotic limit of large groups. Preference aggregation


follows a nonlinear transformation of the reference probability distribution, favouring the more


rewarding answer. Notably, for groups of size two, the more rewarding answer is guaranteed to


have an aggregate probability at least as large as a value dependent solely on the ratio of the reg

ularisation constant to the confidence margin of the question answers—approaching 1 for small


values of this ratio. In the limit of large groups, this dependence reduces to the regularisation


constant alone. This suggests that for practical choices of the regularisation constant, such as the

default value of 0.04 used in TRL (Transformer Reinforcement Learning) by Hugging Face [1], pref

erence aggregation may predominantly reflect the reward preference.


 - Finally, we discuss the implications of adjusting the reference-policy divergence penalty to align


with the direct KL divergence or using only shift normalisation for the reward preference model.


The former adjustment results in logarithmic opinion pooling, and we present an example where


the aggregate preference may not be unique. The latter adjustment aligns the reward preference


with that of RLHF. Combining both adjustments leads to an aggregation of preferences consistent


with the principles of RLHF.


**1.3** **Additional assumptions**


For the optimisation problem to be well defined, we make the following assumptions. For every con
text _q_, the domain of the distribution _πθ_ ( _·_ _|_ _q_ ) is assumed to be contained within the support of the

distribution _π_ ref( _·_ _|_ _q_ ). This ensures that for every output _o_ in the domain of _πθ_ ( _·_ _|_ _q_ ), we have

_π_ ref( _o_ _|_ _q_ ) _>_ 0. Without this condition, the reference-policy divergence penalty would become infi
nite whenever _π_ ref( _o_ _|_ _q_ ) = 0 and _πθ_ ( _o_ _|_ _q_ ) _>_ 0 for some output _o_ and context _q_ .


Our study focuses on characterising the stationary policies of the GRPO algorithm; therefore, we


ignore the clipping function in the GRPO objective function. A stationary policy is a collection of dis

1 `[https://huggingface.co/docs/trl/main/en/grpo_trainer#trl.GRPOConfig](https://huggingface.co/docs/trl/main/en/grpo_trainer#trl.GRPOConfig)`


5


tributions _πθ⋆_ ( _·_ _|_ _q_ ) such that _θ_ _[⋆]_ maximises _JGRPO_ ( _θ_ ) over _θ_, assuming that _πθ_ old _≡_ _πθ∗_ . Ignoring the

clipping function is also justified when running the policy gradient algorithm with the GRPO objective


function using a sufficiently small step size, ensuring that the new and old policies remain within an

_ϵ_ -relative difference, i.e., _|πθ_ ( _o_ _|_ _q_ ) _−_ _πθ_ old ( _o_ _|_ _q_ ) _| ≤_ _ϵπθ_ old ( _o_ _|_ _q_ ), for all _o_ and _q_ .

### **2 The alignment objective of the GRPO algorithm**


In this section, we analyse the alignment objective of the GRPO algorithm. We begin by examining the


reward preference model and the reference-policy divergence penalty separately, before discussing the


alignment objective as a whole.


**2.1** **The reward preference model**


We consider a more general setting than in Section 1, where the reward _r_ is allowed to be stochastic for


any given output _o_ and context _q_ . Let _r_ ( _o_ _|_ _q_ ) denote the expected value of the reward for output _o_ under


context _q_ . The case of deterministic rewards is a special case, where, for each output _o_ under a context


_q_, the reward takes a deterministic value _r_ ( _o_ _|_ _q_ ). Recall that we ignore the clipping function term in the


objective function, as our focus is on characterising stationary policies. Hence, we consider the reward


preference given by:



_G_
### ∑

_i_ =1



_πθ_ ( _oi_ _|_ _q_ )
_πθ_ old ( _oi_ _|_ _q_ ) _[A][i]_







_RG_ ( _θ_ _|_ _q_ ) [def] = **E** _{oi}iG_ =1i.i.d. _∼_ _πθ_ old ( _·|q_ )




1
_G_



.



The GRPO’s reward preference model can be expressed as follows. Let _PG_ ( _o_ _|_ _{oi_ _[′][}]_ _i_ _[G]_ = _[−]_ 1 [1][,] _[ q]_ [)] [denote]

the group-relative preference of output _o_ over outputs _o_ 1 _[′]_ [, . . .,] _[ o]_ _G_ _[′]_ _−_ 1 [for a given context] _[ q]_ [.] [For any condi-]

tional distribution _π_ _[′]_ ( _·_ _|_ _q_ ) for a given context _q_, let _PG_ ( _o_ _|_ _π_ _[′]_ ( _·_ _|_ _q_ ), _q_ ) be the expected group-relative


preference of output _o_ for a given context _q_, i.e.,

_PG_ ( _o_ _|_ _π_ _[′]_ ( _· |_ _q_ ), _q_ ) [def] = **E** _o_ 1 _[′]_ [,...,] _[o]_ _G_ _[′]_ _−_ 1i.i.d. _∼_ _π_ _[′]_ ( _·|q_ ) [[] _[P][G]_ [(] _[o]_ _[| {][o]_ _i_ _[′][}]_ _i_ _[G]_ = _[−]_ 1 [1][,] _[ q]_ [)]][.]


It can be readily observed that the GRPO’s reward preference model can be expressed as:


_RG_ ( _θ_ _|_ _q_ ) = **E** _o∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _|_ _πθ_ old ( _· |_ _q_ ), _q_ )] (6)


where, specifically,

_PG_ ( _o_ _| {oi_ _[′][}]_ _i_ _[G]_ = _[−]_ 1 [1][,] _[ q]_ [)] [def] = **E**    - _r_ 1 _−_ stdmean( _r_ 1, _r_ ( _r_ 21, . . .,, _r_ 2, . . ., _rG_ ) _rG_ ) _|_ _o_ 1 = _o_, _o_ 2 = _o_ 1 _[′]_ [, . . .,] _[ o][G]_ [=] _[o]_ _G_ _[′]_ _−_ 1 [,] _[ q]_    

where the expectation is with respect to the distributions of rewards given their corresponding outputs


and the context. For the case of deterministic rewards, we have

_PG_ ( _o_ _| {oi_ _[′][}]_ _i_ _[G]_ = _[−]_ 1 [1][,] _[ q]_ [) =] _[r]_ [(] _[o]_ _[|]_ _[q]_ [)] std _[ −]_ ( [mean] _r_ ( _o_ _|_ _q_ [(] ) _[r]_, [(] _r_ _[o]_ ( _[|]_ _o_ 1 _[′][q]_ [)] _[|]_ [,] _[ r][q]_ [)][(][, . . .,] _[o]_ 1 _[′]_ _[|]_ _[q][ r]_ [)][(][, . . .,] _[o]_ _G_ _[′]_ _−_ 1 _[ r]_ [(] _[|][o][q]_ _G_ _[′]_ [))] _−_ 1 _[|]_ _[q]_ [))] .


It is insightful to consider two extreme cases, one in which the group size is the smallest possible


value of two outputs, and the other where the group size becomes asymptotically large.


6


**Groups** **of** **size** **two** For the case where each group consists of a pair of outputs, it can be readily


verified that for every pair of outputs _oi_ and _oj_, the advantage terms take the following values:


_Ai_ = sign( _ri −_ _rj_ ) and _Aj_ = _−Ai_ .


Notably, the reward preference model accounts only for the relative preference between pairs of


outputs—that is, which output in a pair has a higher reward—while remaining invariant to the abso

lute values of the rewards. This is due to the way the advantage terms are defined, and, in particular,


normalisation by the standard deviation.

The group-relative preference _P_ 2( _o_ _|_ _{o_ _[′]_ _}_, _q_ ) corresponds to the pairwise preference _P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ),

defined as _P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) = **P** [ _ri_ _>_ _rj_ _|_ _oi_ = _o_, _oj_ = _o_ _[′]_, _q_ ]. In the case of deterministic rewards,

_P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) takes the value of 1 if _r_ ( _o_ _|_ _q_ ) _> r_ ( _o_ _[′]_ _|_ _q_ ) and the value of 0 otherwise.


The general expression for the expected reward preference model, given in Equation (6), specialised


for groups of size two, can be written as:


_R_ 2( _θ_ ) = **E** _q∼µ_, _o∼πθ_ ( _·|q_ ), _o′∼πθ_ old ( _·|q_ )[ _P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) _−P_ ( _o_ _[′]_ _≻_ _o_ _|_ _q_ )].


If the pairwise preferences are asymmetric, meaning that _P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ ) + _P_ ( _o_ _[′]_ _≻_ _o_ _|_ _q_ ) = 1, then


_R_ 2( _θ_ ) = 2 **E** _q∼µ_, _o∼πθ_ ( _·|q_ ), _o′∼πθ_ old ( _·|q_ )[ _P_ ( _o_ _≻_ _o_ _[′]_ _|_ _q_ )] _−_ 1.


Perhaps interestingly, we observe that the reward preference model corresponds to that of the NLHF


model, as given in Equation (5), up to non-essential multiplicative and additive constants.


i.i.d.
**The limit of large group size** By the law of large numbers, for _r_ 1, . . ., _rG_ _∼_ _πθ_ old ( _· |_ _q_ ), we have


lim _[|]_ _[q]_ [)]][,]
_G→_ ∞ [mean][(] _[r]_ [1][, . . .,] _[ r][G]_ [) =][ E] _[o][∼][π][θ]_ [old] [(] _[·|][q]_ [)][[] _[r]_ [(] _[o]_


and


lim _[σ]_ [(] _[π][θ]_ [old] [(] _[· |]_ _[q]_ [))][,]
_G→_ ∞ [std][(] _[r]_ [1][, . . .,] _[ r][G]_ [) =]

where _σ_ ( _πθ_ old ( _· |_ _q_ )) [2] is the variance of the reward for an output according to the distribution _πθ_ old ( _· |_ _q_ ).

In the case of the limit of large group size, the reward preference model corresponds to:


_R_ ∞( _θ_ _|_ _q_ ) = E _o∼πθ_ ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] _−_ E _o∼πθ_ old ( _o|q_ )[ _r_ ( _o_ _|_ _q_ )] .

_σ_ ( _πθ_ old ( _· |_ _q_ ))


**2.2** **The reference-policy divergence penalty**


We consider the reference-policy divergence penalty in the GRPO’s objective function given in Equa

tion (1). To this end, for an arbitrary context _q_, we consider:



_G_
### ∑ Di ( θ )

_i_ =1







_D_ ( _θ_ _|_ _q_ ) [def] = **E** _{oi}iG_ =1i.i.d. _∼_ _πθ_ old ( _·|q_ )


7




1
_G_



. (7)


According to Shao et al. [2024], the reference-policy divergence penalty is defined as an estimator of the

KL divergence between _πθ_ ( _·_ _|_ _q_ ) and _π_ ref( _· |_ _q_ ), specifically using as inspiration an estimator discussed


in Schulman [2020]. It can be readily observed that


_D_ ( _θ_ _|_ _q_ ) = KL0( _πθ_ ( _· |_ _q_ ) _||_ _π_ ref( _· |_ _q_ ); _πθ_ old ( _· |_ _q_ ))



where




           - _π∗_ ( _x_ )
KL0( _π_ _||_ _π_ _[∗]_ ; _π_ _[′]_ ) [def] = **E** _x∼π′_ _π_ ( _x_ )





_−_ 1.




- 
_−_ **E** _x∼π′_ log _[π]_ _π_ _[∗]_ ( [(] _x_ _[x]_ ) [)]



Indeed, the GRPO’s reference-policy divergence penalty is an unbiased estimator of the KL diver
gence KL( _πθ_ ( _·_ _|_ _q_ ) _||_ _π_ ref( _·_ _|_ _q_ )) in the case where _πθ_ ( _·_ _|_ _q_ ) = _πθ_ old ( _·_ _|_ _q_ ), but not in general. More

importantly, for optimisation purposes, it is the gradient of the reference policy divergence that matters,


and the two divergences have different gradients.

The gradient of KL0( _πθ_ ( _· |_ _q_ ) _||_ _π_ ref( _· |_ _q_ ); _πθ_ old ( _· |_ _q_ )) with respect to _πθ_ ( _· |_ _q_ ) is given as:


_∂_ _[|]_ _[q]_ [)] 1
_∂πθ_ ( _o_ _|_ _q_ ) [KL][0][(] _[π][θ]_ [(] _[· |]_ _[q]_ [)] _[ ||]_ _[π]_ [ref][(] _[· |]_ _[q]_ [)][;] _[ π][θ]_ [old] [(] _[· |]_ _[q]_ [)) =] _[ −][π][θ]_ [old] [(] _[o]_ _[|]_ _[q]_ [)] _[π]_ _π_ [ref] _θ_ ( _o_ [(] _[o]_ _|_ _q_ ) [2] [+] _[ π][θ]_ [old] [(] _[o]_ _[|]_ _[q]_ [)] _πθ_ ( _o_ _|_ _q_ ) [.] [(8)]


For the KL divergence, we have


_∂_ _[|]_ _[q]_ [)]

_[q]_ [)] _[ ||]_ _[π]_ [ref][(] _[· |]_ _[q]_ [)) =] _[ −]_ [log] _[π]_ [ref][(] _[o]_ (9)
_∂πθ_ ( _o_ _|_ _q_ ) [KL][(] _[π][θ]_ [(] _[· |]_ _πθ_ ( _o_ _|_ _q_ ) [+][ 1.]

We observe that the gradients In Equations (8) and (9) are different even in the case where _πθ_ old ( _·_ _|_

_q_ ) = _πθ_ ( _· |_ _q_ ), in which case


_∂_ _[|]_ _[q]_ [)]

_[q]_ [)] _[ ||]_ _[π]_ [ref][(] _[· |]_ _[q]_ [)][;] _[ π][θ]_ [old] [(] _[· |]_ _[q]_ [)) =] _[ −]_ _[π]_ [ref][(] _[o]_ (10)
_∂πθ_ ( _o_ _|_ _q_ ) [KL][0][(] _[π][θ]_ [(] _[· |]_ _πθ_ ( _o_ _|_ _q_ ) [+][ 1]


which is linear in the probability ratio _π_ ref( _o_ _|_ _q_ )/ _πθ_ ( _o_ _|_ _q_ ), rather than logarithmic, as in the gradient


of the KL divergence in Equation (9).

It is noteworthy that the gradient of the reference-policy divergence penalty, when _πθ_ old ( _·_ _|_ _q_ ) =

_πθ_ ( _· |_ _q_ ), is equivalent to the gradient of the _reverse KL divergence_ between _πθ_ ( _· |_ _q_ ) and _π_ ref( _· |_ _q_ ), i.e.,



KLRev( _πθ_ ( _· |_ _q_ ) _||_ _π_ ref( _· |_ _q_ )) = KL( _π_ ref( _· |_ _q_ ) _||_ _πθ_ ( _· |_ _q_ )) = **E** _o∼π_ ref( _·|q_ )


up to a non-essential additive constant. Indeed, it holds:



�log _[π]_ [ref][(] _[o]_ _[|]_ _[q]_ [)]

_πθ_ ( _o_ _|_ _q_ )




,



_∂_ _[|]_ _[q]_ [)]

_[q]_ [)] _[ ||]_ _[π]_ [ref][(] _[· |]_ _[q]_ [)) =] _[ −]_ _[π]_ [ref][(] _[o]_
_∂πθ_ ( _o_ _|_ _q_ ) [KL][rev][(] _[π][θ]_ [(] _[· |]_ _πθ_ ( _o_ _|_ _q_ )


which is equal to the gradient in Equation (10) up to an additive constant of value 1. This additive


constant is non-essential for determining stationary policies.


**2.3** **The alignment objective and stationary policies**


Having discussed the reward preference model and the reference-policy divergence penalty components


of the GRPO’s objective function, we now consider the objective function and its stationary policies.


From our preceding discussion, we have:


_JGRPO_ ( _θ_ ) = **E** _q∼µ_ [ _JGRPO_ ( _πθ_ ( _· |_ _q_ ) _|_ _q_ )],


8


where


_JGRPO_ ( _πθ_ ( _· |_ _q_ ) _|_ _q_ ) = **E** _o∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _|_ _πθ_ old ( _· |_ _q_ ), _q_ )] _−_ _β_ KL0( _πθ_ ( _· |_ _q_ ) _||_ _π_ ref( _· |_ _q_ ); _πθ_ old ( _· |_ _q_ )).


For each context _q_ and any previous policy _πθ_ old ( _·_ _|_ _q_ ), we consider the maxima of the following

nonlinear programming problem:


maximise _JGRPO_ ( _πθ_ ( _· |_ _q_ ) _|_ _q_ )
over _πθ_ ( _· |_ _q_ )
subject to _πθ_ ( _o_ _|_ _q_ ) _≥_ 0, _∀o_
∑ _o πθ_ ( _o_ _|_ _q_ ) = 1.


Since our focus is on characterising stationary policies, we consider the maxima of the optimisa
tion problem when _πθ_ old ( _·_ _|_ _q_ ) = _πθ_ ( _·_ _|_ _q_ ). By the Karush-Kuhn-Tucker (KKT) optimality condi
tions [Ruszczynski, 2006], for every output _o_ and context _q_, for each maximum, it either holds that



_πθ_ ( _o_ _|_ _q_ ) = 0 or

   


1 _−_ _PG_ ( _o_ _|_ _πθ_ ( _· |_ _q_ ), _q_ ) _−_ **E** _o′∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _[′]_ _|_ _πθ_ ( _· |_ _q_ ), _q_ )]



_πθ_ ( _o_ _|_ _q_ ) = _π_ ref( _o_ _|_ _q_ ). (11)







_β_



The details are provided in Appendix A.

Note that for every context _q_ and output _o_ such that _πθ_ ( _o_ _|_ _q_ ) _>_ 0, it must hold:


_PG_ ( _o_ _|_ _πθ_ ( _· |_ _q_ ), _q_ ) _<_ **E** _o′∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _[′]_ _|_ _πθ_ ( _· |_ _q_ ), _q_ )] + _β_ .


Thus, the expected group-relative preference for any output selected with positive probability under


a stationary policy is within an additive constant of _β_ of the expected group-relative preference of a


randomly chosen output under the same stationary policy.


We can rewrite Equation (11) as:



_πθ_ ( _o_ _|_ _q_ ) = _g_




_PG_ ( _o_ _|_ _πθ_ ( _· |_ _q_ ), _q_ ) _−_ **E** _o′∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _[′]_ _|_ _πθ_ ( _· |_ _q_ ), _q_ )]


_β_





_π_ ref( _o_ _|_ _q_ ).



where _g_ ( _x_ ) [def] = 1/(1 _−_ _x_ ). We observe that the aggregation of preferences is different than logarithmic


pooling.



**Groups of size two** For groups of size two, (11) corresponds to:

    - _[′]_ _[′]_



1 _−_ **P** _o′∼πθ_ ( _·|q_ )[ _r_ _> r_ _[′]_ _|_ _o_ ] _−_ **P** _o′∼πθ_ ( _·|q_ )[ _r_ _< r_ _[′]_ _|_ _o_ ]



_πθ_ ( _o_ _|_ _q_ ) = _π_ ref( _o_ _|_ _q_ ) (12)







_β_



where _r_ and _r_ _[′]_ are respective rewards of outputs _o_ and _o_ _[′]_, under context _q_ .



**The limit of large groups** For the limit of large group sizes, (11) corresponds to:

      - _[′]_       


1 _−_ _r_ ( _o_ _|_ _q_ ) _−_ **E** _o′∼πθ_ ( _·|q_ )[ _r_ ( _o_ _[′]_ _|_ _q_ )]



_πθ_ ( _o_ _|_ _q_ ) = _π_ ref( _o_ _|_ _q_ ). (13)







_βσ_ ( _πθ_ ( _· |_ _q_ ))



9


Figure 1: GRPO’s preference aggregation for the case of binary questions with two answers, _a_ or _b_, and

groups of size two: _πθ_ ( _a |_ _q_ ) versus _π_ ref( _a |_ _q_ ) for the answer _a_ where _P_ ( _a ≻_ _b_ ) _> P_ ( _b ≻_ _a_ ).


Note that the scale normalisation of the rewards with the standard deviation _σ_ ( _πθ_ ( _·_ _|_ _q_ )) can be inter
preted as using an effective regularisation constant of _βσ_ ( _πθ_ ( _· |_ _q_ )) for the reference-penalty divergence

penalty. For a policy _πθ_ ( _·_ _|_ _q_ ) that is more concentrated on placing its mass on a single output, the

smaller the deviation _σ_ ( _πθ_ ( _· |_ _q_ )), and, thus, a smaller effective weight is placed on the reference-policy


divergence penalty than on the reward preference maximisation.

Equation (11) is a fixed-point equation for _πθ_ ( _·_ _|_ _q_ ) for any group size, while (12) and (13) are the


corresponding conditions for the case of groups of size two and the limit of large groups. A distribution

_πθ_ ( _·_ _|_ _q_ ) satisfying these fixed-point equations can be obtained in a closed-form in some cases. We


demonstrate this in the next section for the case of binary questions, with groups of either size two or


asymptotically large group size. This provides insights into some of the properties of the preference


aggregation according to the GRPO criteria.


**2.3.1** **Binary questions**


**Groups** **of** **size** **two** Consider a question (context) _q_ that has two possible answers (outputs), _a_ or _b_,


and groups of size two. Without loss of generality, assume that _P_ ( _a_ _≻_ _b_ _|_ _q_ ) _>_ _P_ ( _b_ _≻_ _a_ _|_ _q_ ). Then, we



have





 - _β_
1 _−_
_γa_, _b_


10



�2
+ 4 _[β]_ _π_ ref( _a |_ _q_ )

_γa_, _b_






 (14)



_πθ_ ( _a |_ _q_ ) = [1] 2





_β_
1 _−_ +
_γa_, _b_


def
where _γa_, _b_ = _P_ ( _a_ _≻_ _b_ _|_ _q_ ) _−P_ ( _b_ _≻_ _a_ _|_ _q_ ) is the (signed) confidence margin of question answers. [2] In

the case of a tie, i.e., when _P_ ( _a ≻_ _b |_ _q_ ) = _P_ ( _b ≻_ _a |_ _q_ ), it holds _πθ_ ( _· |_ _q_ ) = _π_ ref( _· |_ _q_ ).

The value of _πθ_ ( _a_ _|_ _q_ ) depends only on the ratio _β_ / _γa_, _b_ and _π_ ref( _a_ _|_ _q_ ). We may regard the ratio

_β_ / _γa_, _b_ as the effective regularisation constant of the reference-policy divergence penalty. As expected,

_πθ_ ( _a_ _|_ _q_ ) is decreasing in _β_ . It converges to the value 1 as _β_ _→_ 0, and converges to _π_ ref( _a_ _|_ _q_ ) as

_β_ _→_ ∞. Specifically, _πθ_ ( _a_ _|_ _q_ ) = - _π_ ref( _a |_ _q_ ) for _β_ = _γa_, _b_ . Moreover, as expected, _πθ_ ( _a_ _|_ _q_ ) increases

in the confidence margin _γa_, _b_, as larger confidence margin means larger reward preference for answer

_a_ . As expected, the value of _πθ_ ( _a_ _|_ _q_ ) increases in _π_ ref( _a_ _|_ _q_ ). It is noteworthy that this dependence

is continuous except at _π_ ref( _a_ _|_ _q_ ) = 0 where it is discontinuous whenever _β_ _<_ _γa_, _b_ . Recall that when

_π_ ref( _a_ _|_ _q_ ) = 0, then _πθ_ ( _a_ _|_ _q_ ) = 0 as the domain of _πθ_ ( _·_ _|_ _q_ ) is contained in the support of _π_ ref( _·_ _|_ _q_ ).


See Figure 1 for an illustration.


It is worth noting that it holds


              - _β_               _πθ_ ( _a |_ _q_ ) _≥_ max 1 _−_, _π_ ref( _a |_ _q_ ) .
_γa_, _b_


Hence, if _β_ is small enough relative to the confidence margin _γa_, _b_, the value of _πθ_ ( _a_ _|_ _q_ ) is close to 1, no

matter what the value of _π_ ref( _a |_ _q_ ) is.

In the case of deterministic rewards such that _r_ ( _a_ _|_ _q_ ) _>_ _r_ ( _b_ _|_ _q_ ), _P_ ( _a_ _≻_ _b_ _|_ _q_ ) = 1, and thus


_γa_, _b_ = 1. The preference aggregation depends solely on the comparison of the rewards. This means that

the relative preference between the two possible answers, _a_ and _b_, is determined by which one has the


higher reward, rather than the absolute values of those rewards. Consequently, the model is invariant


to the absolute magnitude of the rewards and is instead focused on the ranking of the rewards. This


property is in line with the idea that the preference aggregation is driven by the order of rewards (i.e.,


a relative comparison), rather than their actual values. Thus, the model focuses on the relative ranking


between alternatives and ignores any scale or offset in the reward values themselves.


**The limit of large group size** For a question _q_ with answers _a_ or _b_ such that _r_ ( _a_ _|_ _q_ ) _>_ _r_ ( _b_ _|_ _q_ ), in the


limit of large group size, we have

_πθ_ ( _a |_ _q_ ) = [2] _[β]_ [2] _[π]_ [ref][(] _[a][ |]_ _[q]_ [) +][ 1][ +] �12 +(1 4 + _β β_ [2] _π_ [2] ref) ( _a |_ _q_ )(1 _−_ _π_ ref( _a |_ _q_ )) . (15)


Intuitively, when _r_ ( _a |_ _q_ ) = _r_ ( _b |_ _q_ ), then _πθ_ ( _· |_ _q_ ) = _π_ ref( _· |_ _q_ ).


A notable difference from the case of groups of size two is that the aggregation of preferences de
pends solely on _π_ ref( _·_ _|_ _q_ ), the regularisation constant _β_, and the comparison of the expected rewards

_r_ ( _a_ _|_ _q_ ) and _r_ ( _b_ _|_ _q_ ). The aggregation of preferences is more biased towards the reward preference than

for the case of groups of size two. The dependence on _π_ ref( _a_ _|_ _q_ ) is discontinuous at _π_ ref( _a_ _|_ _q_ ) = 0 for

every _β >_ 0. See an illustration in Figure 2. It can be readily noted that


               - 1               _πθ_ ( _a |_ _q_ ) _≥_ max 1 + _β_ [2] [,] _[ π]_ [ref][(] _[a][ |]_ _[q]_ [)] .


2For simplicity of notation, in _γa_, _b_, we omit the indication of dependency on the context _q_ .


11


Figure 2: GRPO’s preference aggregation for the case of binary questions with two answers, _a_ or _b_, in

the limit of large group size: _πθ_ ( _a |_ _q_ ) versus _π_ ref( _a |_ _q_ ) for the answer _a_ where _r_ ( _a |_ _q_ ) _> r_ ( _b |_ _q_ ).


Comparing with the bound for groups of size two, for the case of deterministic rewards, we observe

that _πθ_ ( _q_ _|_ _q_ ) is now lower bounded by 1/(1 + _β_ [2] ) while for the case of groups of size two, it is lower

bounded by 1 _−_ _β_ . The lower bound 1/(1 + _β_ [2] ) is larger than 1 _−_ _β_, for every _β >_ 0.

### **3 Extensions**


The GRPO’s alignment objective can naturally be extended in different directions by redefining the


reward preference model or the reference-policy divergence penalty. Here, we discuss some different


variants.


**Using the direct KL divergence penalty** As noted, as far as the stationary policies are concerned, the

GRPO’s reference-policy divergence penalty is essentially the reverse KL divergence between _πθ_ ( _·_ _|_ _q_ )

and _π_ ref( _· |_ _q_ ). We can easily convert the reference-policy divergence penalty to correspond to the direct


KL divergence between the two distributions. This can be done by the standard importance sampling


trick for Monte Carlo estimation by redefining the penalty terms in the GRPO objective as follows:



_Di_ ( _θ_ ) = _πθ_ ( _oi_ _|_ _q_ )
_πθ_ old ( _oi_ _|_ _q_ )




- _π_ ref( _oi_ _|_ _q_ ) _[π]_ [ref][(] _[o][i]_ _[|]_ _[q]_ [)] - .
_πθ_ ( _oi_ _|_ _q_ ) _[−]_ [log] _πθ_ ( _oi_ _|_ _q_ ) _[−]_ [1]



With this new definition, the expected reference-policy divergence penalty defined in Equation (7) corre
sponds to the KL divergence between _πθ_ ( _· |_ _q_ ) and _π_ ref( _· |_ _q_ ), i.e. _D_ ( _θ_ _|_ _q_ ) = KL( _πθ_ ( _· |_ _q_ ) _||_ _π_ ref( _· |_ _q_ )).


12


Figure 3: Preference aggregation according to GRPO’s reward preference model and direct KL diver

gence penalty, for the case of binary questions with two possible answers, _a_ or _b_, and groups of size two:

_πθ_ ( _a_ _|_ _q_ ) versus _π_ ref( _a_ _|_ _q_ ) for the answer _a_ where _r_ ( _a_ _|_ _q_ ) _>_ _r_ ( _b_ _|_ _q_ ). A notable difference from the

GRPO’s alignment results, shown in Figure 1, is a lack of discontinuity at _π_ ref( _a |_ _q_ ) = 0.


The resulting aggregation of preferences satisfies:



_πθ_ ( _o_ _|_ _q_ ) = _Z_ [1] _q_ _e_



_πθ_ ( _o_ _|_ _q_ ) = [1]



_PG_ ( _o|πθ_ ( _·|q_ ), _q_ )

_β_ _π_ ref( _o_ _|_ _q_ )



where _Zq_ is a normalisation constant.


For groups of size two, this aggregation of preference is akin to the NLHF alignment objective.


Specifically, for binary questions, with two possible answers, _a_ or _b_, it holds



_πθ_ ( _a |_ _q_ ) = _Z_ [1] _q_ _e_



_γa_, _b_

2 _β_ _π_ ref( _a |_ _q_ )



where _Zq_ is a normalisation constant, given as _Zq_ = _e_ _[γ][a]_ [,] _[b]_ [/][(][2] _[β]_ [)] _π_ ref( _a_ _|_ _q_ ) + _e_ _[−][γ][a]_ [,] _[b]_ [/][(][2] _[β]_ [)] (1 _−_ _π_ ref( _a_ _|_ _q_ )).

Here, recall that _γa_, _b_ = _P_ ( _a ≻_ _b |_ _q_ ) _−P_ ( _b ≻_ _a |_ _q_ ), which we first defined in Section 2.3.1. See Figure 3


for an illustration.


For the limit of a large group size, given _a_ and _b_ such that _r_ ( _a_ _|_ _q_ ) _>_ _r_ ( _b_ _|_ _q_ ), the optimal value of

_πθ_ ( _a_ _|_ _q_ ) is 1 if _β_ is sufficiently small. If _β_ is sufficiently large, there exist two values of _πθ_ ( _a_ _|_ _q_ ) that


maximise the objective function if _β_ is sufficiently large. See Appendix B.2 for details.


**Shift-only** **normalisation** Consider the GRPO’s reward preference model with shift-normalised re

wards and without using scale-normalisation. Hence, we consider the advantage terms defined as

_Ai_ = _ri −_ mean( _r_ 1, . . ., _rG_ ). Then, we have




           -           **E** _o∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _|_ _πθ_ old ( _· |_ _q_ ), _q_ )] = 1 _−_ _G_ [1] ( **E** _o∼πθ_ ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] _−_ **E** _o∼πθ_ old ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )]).


13


This results in a reward preference model similar to that of the RLHF alignment approach, but replacing


the reward model with a sample mean estimate of the rewards. Combining the two extensions, we


obtain aggregation of preferences similar to that of the RLHF alignment objective.

### **References**


P. F. Christiano, J. Leike, T. B. Brown, M. Martic, S. Legg, and D. Amodei. Deep reinforcement learn

ing from human preferences. In _Proceedings_ _of_ _the_ _31st_ _International_ _Conference_ _on_ _Neural_ _Information_


_Processing Systems_, NIPS’17, page 4302–4310, Red Hook, NY, USA, 2017. Curran Associates Inc.


DeepSeek-AI, D. Guo, D. Yang, H. Zhang, J. Song, R. Zhang, R. Xu, Q. Zhu, S. Ma, P. Wang, X. Bi,


X. Zhang, X. Yu, Y. Wu, Z. F. Wu, Z. Gou, Z. Shao, Z. Li, Z. Gao, A. Liu, B. Xue, B. Wang, B. Wu,


B. Feng, C. Lu, C. Zhao, C. Deng, C. Zhang, C. Ruan, D. Dai, D. Chen, D. Ji, E. Li, F. Lin, F. Dai, F. Luo,


G. Hao, G. Chen, G. Li, H. Zhang, H. Bao, H. Xu, H. Wang, H. Ding, H. Xin, H. Gao, H. Qu, H. Li,


J. Guo, J. Li, J. Wang, J. Chen, J. Yuan, J. Qiu, J. Li, J. L. Cai, J. Ni, J. Liang, J. Chen, K. Dong, K. Hu,


K. Gao, K. Guan, K. Huang, K. Yu, L. Wang, L. Zhang, L. Zhao, L. Wang, L. Zhang, L. Xu, L. Xia,


M. Zhang, M. Zhang, M. Tang, M. Li, M. Wang, M. Li, N. Tian, P. Huang, P. Zhang, Q. Wang, Q. Chen,


Q. Du, R. Ge, R. Zhang, R. Pan, R. Wang, R. J. Chen, R. L. Jin, R. Chen, S. Lu, S. Zhou, S. Chen, S. Ye,


S. Wang, S. Yu, S. Zhou, S. Pan, S. S. Li, S. Zhou, S. Wu, S. Ye, T. Yun, T. Pei, T. Sun, T. Wang, W. Zeng,


W. Zhao, W. Liu, W. Liang, W. Gao, W. Yu, W. Zhang, W. L. Xiao, W. An, X. Liu, X. Wang, X. Chen,


X. Nie, X. Cheng, X. Liu, X. Xie, X. Liu, X. Yang, X. Li, X. Su, X. Lin, X. Q. Li, X. Jin, X. Shen, X. Chen,


X. Sun, X. Wang, X. Song, X. Zhou, X. Wang, X. Shan, Y. K. Li, Y. Q. Wang, Y. X. Wei, Y. Zhang, Y. Xu,


Y. Li, Y. Zhao, Y. Sun, Y. Wang, Y. Yu, Y. Zhang, Y. Shi, Y. Xiong, Y. He, Y. Piao, Y. Wang, Y. Tan, Y. Ma,


Y. Liu, Y. Guo, Y. Ou, Y. Wang, Y. Gong, Y. Zou, Y. He, Y. Xiong, Y. Luo, Y. You, Y. Liu, Y. Zhou, Y. X.


Zhu, Y. Xu, Y. Huang, Y. Li, Y. Zheng, Y. Zhu, Y. Ma, Y. Tang, Y. Zha, Y. Yan, Z. Z. Ren, Z. Ren, Z. Sha,


Z. Fu, Z. Xu, Z. Xie, Z. Zhang, Z. Hao, Z. Ma, Z. Yan, Z. Wu, Z. Gu, Z. Zhu, Z. Liu, Z. Li, Z. Xie,


Z. Song, Z. Pan, Z. Huang, Z. Xu, Z. Zhang, and Z. Zhang. DeepSeek-R1: Incentivizing Reasoning


Capability in LLMs via Reinforcement Learning, 2025. URL `[https://arxiv.org/abs/2501.12948](https://arxiv.org/abs/2501.12948)` .


C. Genest, S. Weerahandi, and J. V. Zidek. Aggregating opinions through logarithmic pooling. _Theory_


_and Decision_, 17(1):61–70, 1984.


R. Luce. _Individual Choice Behavior:_ _A Theoretical Analysis_ . Wiley, 1959.


R. Munos, M. Valko, D. Calandriello, M. Gheshlaghi Azar, M. Rowland, Z. D. Guo, Y. Tang, M. Geist,


T. Mesnard, C. Fiegel, A. Michi, M. Selvi, S. Girgin, N. Momchev, O. Bachem, D. J. Mankowitz, D. Pre

cup, and B. Piot. Nash learning from human feedback. In R. Salakhutdinov, Z. Kolter, K. Heller,


A. Weller, N. Oliver, J. Scarlett, and F. Berkenkamp, editors, _Proceedings of the 41st International Confer-_


_ence on Machine Learning_, volume 235 of _Proceedings of Machine Learning Research_, pages 36743–36768.


PMLR, 21–27 Jul 2024. URL `[https://proceedings.mlr.press/v235/munos24a.html](https://proceedings.mlr.press/v235/munos24a.html)` .


14


L. Ouyang, J. Wu, X. Jiang, D. Almeida, C. L. Wainwright, P. Mishkin, C. Zhang, S. Agarwal, K. Slama,


A. Ray, J. Schulman, J. Hilton, F. Kelton, L. Miller, M. Simens, A. Askell, P. Welinder, P. Christiano,


J. Leike, and R. Lowe. Training language models to follow instructions with human feedback. In


_Proceedings_ _of_ _the_ _36th_ _International_ _Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_, NIPS ’22, Red


Hook, NY, USA, 2022. Curran Associates Inc.


A. Ruszczynski. _Nonlinear Optimization_ . Princeton University Press, USA, 2006.


J. Schulman. Approximating KL divergence, 2020. URL `[http://joschu.net/blog/kl-approx.html](http://joschu.net/blog/kl-approx.html)` .


J. Schulman, F. Wolski, P. Dhariwal, A. Radford, and O. Klimov. Proximal policy optimization algo

rithms, 2017. URL `[https://arxiv.org/abs/1707.06347](https://arxiv.org/abs/1707.06347)` .


Z. Shao, P. Wang, Q. Zhu, R. Xu, J. Song, X. Bi, H. Zhang, M. Zhang, Y. K. Li, Y. Wu, and D. Guo.


DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models, 2024.


URL `[https://arxiv.org/abs/2402.03300](https://arxiv.org/abs/2402.03300)` .


N. Stiennon, L. Ouyang, J. Wu, D. M. Ziegler, R. Lowe, C. Voss, A. Radford, D. Amodei, and P. Chris

tiano. Learning to summarize from human feedback. In _Proceedings of the 34th International Conference_


_on Neural Information Processing Systems_, NIPS ’20, Red Hook, NY, USA, 2020. Curran Associates Inc.


R. S. Sutton and A. G. Barto. _Reinforcement Learning: An Introduction_ . A Bradford Book, Cambridge, MA,


USA, 2018.

### **A Stationary policies**


We consider the following optimisation problem:


maximise _JGRPO_ ( _πθ_ ( _· |_ _q_ ) _|_ _q_ )
over _πθ_ ( _· |_ _q_ )
subject to _πθ_ ( _o_ _|_ _q_ ) _≥_ 0, _∀o_
∑ _o πθ_ ( _o_ _|_ _q_ ) = 1.


By the KKT conditions, if _πθ_ ( _·_ _|_ _q_ ) is a local optimum, then there exist constants _γo_ and _λ_ such that,


for all _o_, the following conditions hold:


stationarity: _∂πθ∂_ ( _o|q_ ) _[J][GRPO]_ [(] _[π][θ]_ [(] _[· |]_ _[q]_ [)] _[ |]_ _[q]_ [)] _[ −]_ _[λ]_ [ +] _[ γ][o]_ [=][ 0,]

non-negativity: _γ_ 0 _≥_ 0, and,
complementary slackness: _γoπθ_ ( _o_ _|_ _q_ ) = 0.


Therefore, either _πθ_ ( _o_ _|_ _q_ ) = 0, or _πθ_ ( _o_ _|_ _q_ ) _>_ 0 and




           - _[|]_ _[q]_ [)] 1
_PG_ ( _o_ _|_ _πθ_ old ( _· |_ _q_ ), _q_ ) _−_ _β_ _−πθ_ old ( _o_ _|_ _q_ ) _[π]_ _π_ [ref] _θ_ ( _o_ [(] _[o]_ _|_ _q_ ) [2] [+] _[ π][θ]_ [old] [(] _[o]_ _[|]_ _[q]_ [)] _πθ_ ( _o_ _|_ _q_ )


Under the condition _πθ_ ( _· |_ _q_ ) = _πθ_ old ( _· |_ _q_ ), we have





_−_ _λ_ = 0.




    - _[|]_ _[π][θ]_ [(] _[· |]_ _[q]_ [)][,] _[ q]_ [)] _[ −]_ _[λ]_
_π_ ref( _o_ _|_ _q_ ) = 1 _−_ _[P][G]_ [(] _[o]_

_β_


15




_πθ_ ( _o_ _|_ _q_ ).


By using the constraint ∑ _o′ πθ_ ( _o_ _[′]_ _|_ _q_ ) = 1, we have

  


1 _−_ _PG_ ( _o_ _|_ _πθ_ ( _· |_ _q_ ), _q_ ) _−_ **E** _o′∼πθ_ ( _·|q_ )[ _PG_ ( _o_ _[′]_ _|_ _πθ_ ( _· |_ _q_ ), _q_ )]



_πθ_ ( _o_ _|_ _q_ ) = _π_ ref( _o_ _|_ _q_ ),







_β_



which is the condition shown in Equation (11).

### **B Binary questions**


**B.1** **The GRPO’s alignment objective**


**Groups of size two** We first consider the reward preference model part of the objective. Note that


**E** _o∼πθ_ ( _·|q_ )[ _P_ 2( _o_ _|_ _πθ_ old ( _· |_ _q_ ), _q_ )] = _πθ_ ( _a |_ _q_ ) _πθ_ old ( _b |_ _q_ ) **E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _a_, _o_ 2 = _b_, _q_ ]

+ _πθ_ ( _b |_ _q_ ) _πθ_ old ( _a |_ _q_ ) **E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _b_, _o_ 2 = _a_, _q_ ]

= _πθ_ ( _a |_ _q_ ) _πθ_ old ( _b |_ _q_ ) **E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _a_, _o_ 2 = _b_, _q_ ]

_−πθ_ ( _b |_ _q_ ) _πθ_ old ( _a |_ _q_ ) **E** [sign( _r_ 2 _−_ _r_ 1) _|_ _o_ 1 = _b_, _o_ 2 = _a_, _q_ ]

= _πθ_ ( _a |_ _q_ ) _πθ_ old ( _b |_ _q_ ) **E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _a_, _o_ 2 = _b_, _q_ ]

_−πθ_ ( _b |_ _q_ ) _πθ_ old ( _a |_ _q_ ) **E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _a_, _o_ 2 = _b_, _q_ ]

= ( _πθ_ ( _a |_ _q_ ) _πθ_ old ( _b |_ _q_ ) _−_ _πθ_ ( _b |_ _q_ ) _πθ_ old ( _a |_ _q_ )) _×_

_×_ **E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _a_, _o_ 2 = _b_, _q_ ].


Next, note that


_πθ_ ( _a |_ _q_ ) _πθ_ old ( _b |_ _q_ ) _−_ _πθ_ ( _b |_ _q_ ) _πθ_ old ( _a |_ _q_ ) = _πθ_ ( _a |_ _q_ )(1 _−_ _πθ_ old ( _a |_ _q_ )) _−_ (1 _−_ _πθ_ ( _a |_ _q_ )) _πθ_ old ( _a |_ _q_ )

= _πθ_ ( _a |_ _q_ ) _−_ _πθ_ old ( _a |_ _q_ ),


and

**E** [sign( _r_ 1 _−_ _r_ 2) _|_ _o_ 1 = _a_, _o_ 2 = _b_, _q_ ] = _γa_, _b_,


where

def
_γa_, _b_ = _P_ ( _a ≻_ _b |_ _q_ ) _−P_ ( _b ≻_ _a |_ _q_ ).


Hence, we have


**E** _o∼πθ_ ( _·|q_ )[ _P_ 2( _o_ _|_ _πθ_ old ( _· |_ _q_ ), _q_ )] = _γa_, _b_ ( _πθ_ ( _a |_ _q_ ) _−_ _πθ_ old ( _a |_ _q_ )). (16)


Combining this with the reference-policy divergence penalty, we have


_JGRPO_ ( _πθ_ ( _a |_ _q_ ) _|_ _q_ ) = _γa_, _bπθ_ ( _a |_ _q_ )




 - _[q]_ [)]
_−β_ _πθ_ old ( _a |_ _q_ ) _[π]_ [ref][(] _[a][ |]_




[ref][(] _[a][ |]_ _[q]_ [)] _[q]_ [)]

_[q]_ [))] [1] _[ −]_ _[π]_ [ref][(] _[a][ |]_
_πθ_ ( _a |_ _q_ ) [+ (][1] _[ −]_ _[π][θ]_ [old] [(] _[a][ |]_ 1 _−_ _πθ_ ( _a |_ _q_ )



_θ_ old _πθ_ ( _a |_ _q_ ) _[θ]_ [old] 1 _−_ _πθ_ ( _a |_ _q_ )

+ _πθ_ old ( _a |_ _q_ ) log( _πθ_ ( _a |_ _q_ )) + (1 _−_ _πθ_ old ( _a |_ _q_ )) log(1 _−_ _πθ_ ( _a |_ _q_ ))� + const.



16


Taking the first derivative with respect to _πθ_ ( _a |_ _q_ ), we obtain:

_dJGRPOdπ_ ( _θπ_ ( _θa_ ( _|a |q_ ) _q_ ) _|_ _q_ ) = _γa_, _b_




_[a][ |]_ _[q]_ [)] _[π]_ [ref][(] _[a][ |]_ _[q]_ [)] _[q]_ [))(][1] _[ −]_ _[π]_ [ref][(] _[a][ |]_ _[q]_ [))]

+ [(][1] _[ −]_ _[π][θ]_ [old] [(] _[a][ |]_
_πθ_ ( _a |_ _q_ ) [2] (1 _−_ _πθ_ ( _a |_ _q_ )) [2]




  - _[q]_ [)] _[π]_ [ref][(] _[a][ |]_ _[q]_ [)]
_−β_ _−_ _[π][θ]_ [old] [(] _[a][ |]_



(1 _−_ _πθ_ ( _a |_ _q_ )) [2]




_[q]_ [)]
+ _[π][θ]_ [old] [(] _[a][ |]_



1 _−_ _πθ_ ( _a |_ _q_ )




_[θ]_ [old] [(] _[a][ |]_ _[q]_ [)] _[q]_ [)]

_πθ_ ( _a |_ _q_ ) _[−]_ [1] 1 _[ −]_ _−_ _[π]_ _π_ _[θ]_ [old] _θ_ ( _a_ [(] _|_ _[a][ |]_ _q_ )




,



which for the case where _πθ_ old ( _· |_ _q_ ) = _πθ_ ( _· |_ _q_ ) simplifies to:


_d_ _[q]_ [)] _[ −]_ _[π]_ [ref][(] _[a][ |]_ _[q]_ [)]

_[q]_ [)] _[ |]_ _[q]_ [) =] _[γ][a]_ [,] _[b][ −]_ _[β]_ _[π][θ]_ [(] _[a][ |]_
_dπθ_ ( _a |_ _q_ ) _[J][GRPO]_ [(] _[π][θ]_ [(] _[a][ |]_ _πθ_ ( _a |_ _q_ )(1 _−_ _πθ_ ( _a |_ _q_ )) [.]


Setting the derivative to zero, we obtain


_[q]_ [)] _[ −]_ _[π]_ [ref][(] _[a][ |]_ _[q]_ [)]
_β_ _[π][θ]_ [(] _[a][ |]_ _[γ][a]_ [,] _[b]_ [.] (17)

_πθ_ ( _a |_ _q_ )(1 _−_ _πθ_ ( _a |_ _q_ )) [=]


Now, clearly for the case where _γa_, _b_ = 0, we have _πθ_ ( _a_ _|_ _q_ ) = _π_ ref( _a_ _|_ _q_ ). For the case where _γa_, _b_ = 0,


by simple rearrangements, it can be shown that Equation (17) is equivalent to the following quadratic


equation:




    - _β_    - _β_
_πθ_ ( _a |_ _q_ ) [2] _−_ 1 _−_ _πθ_ ( _a |_ _q_ ) _−_ _π_ ref( _a |_ _q_ ) = 0.
_γa_, _b_ _γa_, _b_



For the case _γa_, _b_ _>_ 0, this quadratic equation has a unique non-negative solution given as:





 - _β_
1 _−_
_γa_, _b_



�2 - _β_
+ 4 _[β]_ _π_ ref( _a |_ _q_ ) + 1 _−_

_γa_, _b_ _γa_, _b_




- []






_πθ_ ( _a |_ _q_ ) = 2 [1]










�2
+ 4 _[β]_



which corresponds to the asserted equation in Equation (14).


**The limit of large group size** Note that


_r_ ( _a |_ _q_ ) _−_ **E** _o∼πθ_ old ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] = (1 _−_ _πθ_ old ( _a |_ _q_ ))( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ )),


_r_ ( _b |_ _q_ ) _−_ **E** _o∼πθ_ old ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] = _πθ_ old ( _a |_ _q_ )( _r_ ( _b |_ _q_ ) _−_ _r_ ( _a |_ _q_ )),


and

_σ_ ( _πθ_ old ( _· |_ _q_ )) [2] = ( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ )) [2] _πθ_ old ( _a |_ _q_ )(1 _−_ _πθ_ old ( _a |_ _q_ )).


It follows that



_r_ ( _a |_ _q_ ) _−_ **E** _o∼πθ_ old ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] =

_σ_ ( _πθ_ old ( _· |_ _q_ ))




- 1 _−_ _πθ_ old ( _a |_ _q_ ) sign( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ )).

_πθ_ old ( _a |_ _q_ )



and
_r_ ( _b |_ _q_ ) _−_ **E** _o∼πθ_ old ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] = _−_

_σ_ ( _πθ_ old ( _· |_ _q_ ))




_πθ_ old ( _a |_ _q_ ) _[q]_ [)] _[ −]_ _[r]_ [(] _[b][ |]_ _[q]_ [))][.]
1 _−_ _πθ_ old ( _a |_ _q_ ) [sign][(] _[r]_ [(] _[a][ |]_


17


Hence, we have

**E** _o∼πθ_ ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )] _−_ **E** _o∼πθ_ old ( _·|q_ )[ _r_ ( _o_ _|_ _q_ )]

_σ_ ( _πθ_ old ( _· |_ _q_ ))








 sign( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ )). (18)




_πθ_ old ( _a |_ _q_ )
1 _−_ _πθ_ old ( _a |_ _q_ )



=



1
 - _πθ_ ( _a |_ _q_ ) _−_
_πθ_ old ( _a |_ _q_ )(1 _−_ _πθ_ old ( _a |_ _q_ ))



The objective function is as follows:


1
_JGRPO_ ( _πθ_ ( _a |_ _q_ ) _|_ _q_ ) = - sign( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ )) _πθ_ ( _a |_ _q_ )
_πθ_ old ( _a |_ _q_ )(1 _−_ _πθ_ old ( _a |_ _q_ ))

_−β_         - _πθ_ old ( _a |_ _q_ ) _π_ ref( _a |_ _q_ ) + [(][1] _[ −]_ _[π][θ]_ [old] [(] _[a][ |]_ _[q]_ [))(][1] _[ −]_ _[π]_ [ref][(] _[a][ |]_ _[q]_ [))]
_πθ_ ( _a |_ _q_ ) 1 _−_ _πθ_ ( _a |_ _q_ )

+ _πθ_ old ( _a |_ _q_ ) log( _πθ_ ( _a |_ _q_ )) + (1 _−_ _πθ_ old ( _a |_ _q_ )) log(1 _−_ _πθ_ ( _a |_ _q_ )))� + const.


The derivative of _JGRPO_ ( _πθ_ ( _· |_ _q_ )) with respect to _πθ_ ( _a |_ _q_ ), evaluated at _πθ_ ( _a |_ _q_ ) such that _πθ_ old ( _· |_

_q_ ) = _πθ_ ( _· |_ _q_ ), is equal to:


_d_ 1
_dπθ_ ( _a |_ _q_ ) _[J][GRPO]_ [(] _[π][θ]_ [(] _[a][ |]_ _[q]_ [)] _[ |]_ _[q]_ [)] =    - _πθ_ old ( _a |_ _q_ )(1 _−_ _πθ_ old ( _a |_ _q_ )) sign( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ ))

_[q]_ [)] _[ −]_ _[π]_ [ref][(] _[a][ |]_ _[q]_ [)]
_−β_ _[π][θ]_ [(] _[a][ |]_

_πθ_ ( _a |_ _q_ )(1 _−_ _πθ_ ( _a |_ _q_ ))


which when set to zero yields


         _β_ ( _πθ_ ( _a |_ _q_ ) _−_ _π_ ref( _a |_ _q_ )) = _πθ_ ( _a |_ _q_ )(1 _−_ _πθ_ ( _a |_ _q_ ))sign( _r_ ( _a |_ _q_ ) _−_ _r_ ( _b |_ _q_ )).


Clearly, if _r_ ( _a |_ _q_ ) = _r_ ( _b |_ _q_ ), then _πθ_ ( _a |_ _q_ ) = _π_ ref( _a |_ _q_ ). If _r_ ( _a |_ _q_ ) _> r_ ( _b |_ _q_ ), then


            _β_ ( _πθ_ ( _a |_ _q_ ) _−_ _π_ ref( _a |_ _q_ )) = _πθ_ ( _a |_ _q_ )(1 _−_ _πθ_ ( _a |_ _q_ )). (19)


This is equivalent to the following quadratic equation:


(1 + _β_ [2] ) _πθ_ ( _a |_ _q_ ) [2] _−_ (2 _β_ [2] _π_ ref( _a |_ _q_ ) + 1) _πθ_ ( _a |_ _q_ ) + _β_ [2] _π_ ref( _a |_ _q_ ) [2] = 0.


Since by (19), _πθ_ ( _a_ _|_ _q_ ) _≥_ _π_ ref( _a_ _|_ _q_ ), the quadratic equation has a unique solution satisfying the latter


condition, which is given as follows:

_πθ_ ( _a |_ _q_ ) = [2] _[β]_ [2] _[π]_ [ref][(] _[a][ |]_ _[q]_ [) +][ 1][ +] �12 +(1 4 + _β β_ [2] _π_ [2] ref) ( _a |_ _q_ )(1 _−_ _π_ ref( _a |_ _q_ )) .


This shows that Equation (15) holds.


**B.2** **Using direct KL divergence penalty**


**Groups of size two** We consider the GRPO reward preference model with the reference-policy diver
gence penalty according to the KL divergence between _πθ_ ( _·_ _|_ _q_ ) and _π_ ref( _·_ _|_ _q_ ). The reward preference


part of the objective is as given in Equation (16). The objective function is given as follows:


_J_ ( _πθ_ ( _a |_ _q_ ) _|_ _q_ ) = _γa_, _bπθ_ ( _a |_ _q_ ) _−_ _β_ KL( _πθ_ ( _a |_ _q_ ) _||_ _π_ ref( _a |_ _q_ ))) + const


18


where _K_ ( _p ||_ _p_ _[′]_ ) denotes the KL divergence between two Bernoulli distributions with means _p_ and _p_ _[′]_ .


It readily follows that



_d_   -   - _[q]_ [)]

_[q]_ [)] _[ |]_ _[q]_ [) =] _[γ][a]_ [,] _[b][ −]_ _[β]_ log ( _[π][θ]_ [(] _[a][ |]_
_dπθ_ ( _a |_ _q_ ) _[J]_ [ (] _[π][θ]_ [(] _[· |]_ _π_ ref( _a |_ _q_ )




- _−_ log - 1 _−_ _πθ_ ( _a |_ _q_ )
1 _−_ _π_ ref( _a |_ _q_ )



��
.



By setting the derivative to zero, we obtain

_πθ_ ( _a |_ _q_ ) = _Z_ [1] _q_ _e_



_γa_, _b_

2 _β_ _π_ ref( _a |_ _q_ )



where _Zq_ is the normalisation constant, given as _Zq_ = _e_ _[γ][a]_ [,] _[b]_ [/][(][2] _[β]_ [)] _π_ ref( _a |_ _q_ ) + _e_ _[−][γ][a]_ [,] _[b]_ [/][(][2] _[β]_ [)] (1 _−_ _π_ ref( _a |_ _q_ )).


**The limit of large group size** In this case, the reward preference model component of the objective is


as given in Equation (18). The objective function is given as:


_γ_ ˜ _a_, _b_
_J_ ( _πθ_ ( _a |_ _q_ ) _|_ _q_ ) =  - _πθ_ ( _a |_ _q_ ) _−_ _β_ KL( _πθ_ ( _a |_ _q_ ) _||_ _π_ ref( _a |_ _q_ )) + const
_πθ_ old ( _a |_ _q_ )(1 _−_ _πθ_ old ( _a |_ _q_ ))


where _γ_ ˜ _a_, _b_ = sign( _r_ ( _a |_ _b_ ) _> r_ ( _b |_ _q_ )).

The derivative of _J_ ( _πθ_ ( _a |_ _q_ ) _|_ _q_ ) with respect to _πθ_ ( _a |_ _q_ ), is given as:



_dJ_ ( _dππθθ_ (( _aa | |qq_ )) _|_ _q_ ) = - _πθ_ old ( _a |_ _q_ )( _γ_ ˜1 _a −_, _b_ _πθ_ old ( _a |_ _q_ )) _−_ _β_ �log - 1 _−πθπ_ ( _θa_ ( _|a |q_ ) _q_ )




- _−_ log - _π_ ref( _a |_ _q_ )
1 _−_ _π_ ref( _a |_ _q_ )



��
.



Without loss of generality, consider the case where _γ_ ˜ _a_, _b_ = 1. Under the condition _πθ_ old ( _· |_ _q_ ) = _πθ_ ( _· |_

_q_ ), we obtain:
_d_

_[q]_ [)] _[ |]_ _[q]_ [) =] _[β][h]_ [(] _[π][θ]_ [(] _[a][ |]_ _[q]_ [))]
_dπθ_ ( _a |_ _q_ ) _[J]_ [ (] _[π][θ]_ [(] _[a][ |]_



where



1       - _x_

_h_ ( _x_ ) = _β_ [1] - _x_ (1 _−_ _x_ ) _[−]_ [log] 1 _−_ _x_



_β_ [1] - _x_ (11 _−_ _x_ ) _[−]_ [log] - 1 _−x_ _x_




- + log - _π_ ref( _a |_ _q_ )
1 _−_ _π_ ref( _a |_ _q_ )




.



It can be readily verified that the function _h_ ( _x_ ) decreases on (0, _x_ _[∗]_ ] and increases on [ _x_ _[∗]_, 1) where _x_ _[∗]_ =

(1 + �1 _−_ 1/(1 + _β_ [2] ))/2. Moreover, lim _x↑_ 0 _h_ ( _x_ ) = ∞ and lim _x↓_ 1 _h_ ( _x_ ) = ∞.

If _β_ is small enough, then _h_ ( _x_ ) _>_ 0 for every _x_ _∈_ [0, 1]. In this case, the objective function is max
imised at _πθ_ ( _a_ _|_ _q_ ) = 1. On the other hand, if _β_ is sufficiently large, then there exist two values of

_πθ_ ( _a |_ _q_ ) that satisfy _h_ ( _πθ_ ( _a |_ _q_ )) = 0.


19


