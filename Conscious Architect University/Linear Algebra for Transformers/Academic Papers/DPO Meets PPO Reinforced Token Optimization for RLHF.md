## DPO Meets PPO: Reinforced Token Optimization for RLHF

Han Zhong [∗†] Zikang Shan _[†]_ Guhao Feng _[†]_ Wei Xiong [‡] Xinle Cheng _[†]_

Li Zhao [§] Di He _[†]_ Jiang Bian _[§]_ Liwei Wang _[†]_


April 2024; Revised: May 2025


**Abstract**


In the classical Reinforcement Learning from Human Feedback (RLHF) framework, Proximal
Policy Optimization (PPO) is employed to learn from sparse, sentence-level rewards—a challenging scenario in traditional deep reinforcement learning. Despite the great successes of PPO in the
alignment of large language models, its open-source implementation is still largely sub-optimal. To
address these issues, we introduce a framework that models RLHF problems as a Markov decision
process (MDP), enabling the capture of fine-grained token-wise information. Under this framework, we introduce an algorithm Reinforced Token Optimization ( `RTO` ), which learns the tokenwise reward function from preference data and performs policy optimization based on this learned
token-wise reward signal.Theoretically, `RTO` is proven to have the capability of finding the nearoptimal policy sample-efficiently. For its practical implementation, `RTO` innovatively integrates
Direct Preference Optimization (DPO) and PPO. DPO, originally derived from sparse sentence
rewards, surprisingly provides us with a token-wise characterization of response quality, which is
seamlessly incorporated into our subsequent PPO training stage. Extensive experiments demonstrate that `RTO` performs better than PPO and other direct preference learning algorithms. In
particular, RTO outperforms PPO by 7.5 points on the AlpacaEval 2 benchmark and by 4.1 points
on Arena-Hard. Our code and models are available at [https://github.com/zkshan2002/RTO.](https://github.com/zkshan2002/RTO)

### **1 Introduction**


Reinforcement Learning from Human Feedback (RLHF) has emerged as a key technique for aligning foundation models with human values and preferences (Christiano et al., 2017; Ziegler et al., 2019). It has
been pivotal in enabling Large Language Models (LLMs) to produce more helpful, harmless, and honest
responses (Bai et al., 2022), as demonstrated in significant applications such as ChatGPT (OpenAI, 2023),
Claude (Anthropic, 2023), and Gemini (Team et al., 2023). The classical RLHF pipeline (Ziegler et al., 2019;
Ouyang et al., 2022) consists of two steps: (i) Reward training from human feedback, where the learner learns
the reward function based on preference data, typically through Maximum Likelihood Estimation (MLE).
(ii) Reward-based RL training, where the learner employs the seminal deep RL algorithm Proximal Policy
Optimization (PPO; Schulman et al., 2017) to optimize the reward learned in the previous step.
Despite the success of this framework in the aforementioned powerful closed-source LLMs, the training
of PPO is known to be unstable and sample-inefficient (Choshen et al., 2019). While researchers have made
efforts to propose alternative approaches to the PPO algorithm, with notable examples like rejection sampling
fine-tuning (Dong et al., 2023; Gulcehre et al., 2023), direct preference learning algorithms (Rafailov et al.,
2023; Zhao et al., 2023; Azar et al., 2023), there is little evidence that these newly proposed approaches alone
can make the state-of-the-art LLMs. Therefore, improving the performance of the PPO algorithm in the
context of RLHF is still an important research direction that is largely under-explored.
After examining the open-source implementation of PPO, we identify that one potential reason for the
sub-optimal performance of PPO is the mismatch between the formulation of RLHF and the nature of PPO.
Specifically, in the existing framework (Ouyang et al., 2022; Bai et al., 2022), RLHF is formulated as a _bandit_,


∗The first three authors contributed equally. Email to _{_ `hanzhong,` `shanzikang` _}_ `@stu.pku.edu.cn`
†Peking University
‡University of Illinois Urbana-Champaign
§Microsoft Research Asia


1


Figure 1: In the MDP framework of RLHF, `RTO` uses DPO to derive a token-level reward function and then
applies PPO to enhance it. This approach is significantly different from the traditional RLHF process, which
employs PPO to improve sentence-level rewards under the bandit framework of RLHF.


where the entire response sentence is considered to be an action, and the reward is sentence-level, evaluating
only the overall quality of the response. However, PPO is designed for multi-step RL problems modeled
as _Markov_ _decision_ _processes_ (MDPs), requiring a token-wise reward assignment to each step. In typical
implementations of PPO (e.g., [OpenRLHF and TRL), besides the regularization reward function assigned to](https://github.com/OpenRLHF/OpenRLHF)
each token to ensure the fine-tuned LLM stays close to the supervised fine-tuning (SFT) model, the learned
sentence-level reward is only distributed to the last token, while other tokens receive zero learned reward.
See (2.3) for the formal mathematical description. Clearly, there is a separation in terms of the assignment
strategies of the regularization reward and the learned reward. Meanwhile, while it is generally believed
that a fine-grained characterization with token-wise feedback can provide more information, in practice, it
is also challenging to collect effective token-wise feedback for human conversations and use it in the MLE
process. Consequently, the construction of token-wise reward signals also remains largely under-explored in
the literature of RLHF.


**1.1** **Our** **Contributions**


In this work, we aim to address the aforementioned issues by developing an RLHF framework with a finegrained token-wise reward characterization, establishing the mathematical foundation, and advancing practical algorithmic designs. The key contributions of this work are summarized as follows.


  - We propose a framework that models RLHF as an MDP, offering a more precise token-wise characterization of the LLM’s generation process. Furthermore, we provide theoretical insights into why the
token-wise MDP formulation is superior to the previous sentence-level bandit formulation of RLHF.


  - Under the MDP formulation of RLHF, we introduce Reinforced Token Optimization ( `RTO` ), which
extracts token-wise reward signals from offline preference data and subsequently performs RL training
with respect to the learned token-wise rewards. Using MLE as the token-wise reward learning oracle,
we prove that `RTO` can learn a near-optimal policy in a sample-efficient manner.


  - Moving toward the practical implementation of `RTO`, we adopt a novel token-wise reward extraction
approach from direct preference optimization (DPO; Rafailov et al., 2023). By assigning this DPO-based
token-wise reward function to each token and then optimizing with PPO. `RTO` demonstrates superior
performance compared to both PPO and direct preference learning baselines such as DPO (Rafailov
et al., 2023), R-DPO (Park et al., 2024), and SimPO (Meng et al., 2024). In particular, RTO achieves
a 7.5-point improvement on the AlpacaEval 2 benchmark and a 4.1-point improvement on Arena-Hard.
Additionally, `RTO` exhibits strong data scaling properties compared to PPO    - (i) reaching PPO-level
performance with only 1 _/_ 8 of the data and (ii) continuing to improve as more data is added, whereas
PPO saturates early.


In summary, under the MDP formulation of RLHF, we develop a new principled RLHF algorithm, `RTO`,
that leverages token-wise reward signals derived from offline preference data using DPO, and subsequently
performs PPO training to optimize the token-wise rewards. The pipeline of `RTO` is visualized in Figure 1.


2


**1.2** **Related** **Works**


We review the works that are mostly related to our project in this subsection. Due to the space constraint,
we refer interested readers to the survey (Casper et al., 2023) for a more comprehensive overview of RLHF.


**RLHF** **algorithm.** The classic RLHF framework is established in Christiano et al. (2017); Ziegler et al.
(2019) and further developed in Ouyang et al. (2022); Bai et al. (2022), where the latter can be viewed
as the results of the preliminary versions of Chat-GPT and Claude. PPO (Schulman et al., 2017) is the
default choice for all these projects and its effectiveness has been showcased in the resulting revolutionary
foundation language models. However, as we mentioned in the introduction, tuning the PPO algorithm to its
best performance requires extensive efforts and resources are often unavailable to the open-source community.
Motivated by this, researchers have made efforts to develop alternative approaches to the PPO algorithm. As
a direct extension of the best-of-n inference (Nakano et al., 2021), rejection sampling fine-tuning is proposed
by Dong et al. (2023); Gulcehre et al. (2023); Wang et al. (2024), which prompts the LLM to generate _n_
responses per prompt and uses a learned reward function to rank the responses and fine-tune the model on
those with high rewards. Besides, inspired by the reward-conditioned training in RL literature (Chen et al.,
2021), Hu et al. (2023); Yang et al. (2024a) develop conditional SFT to avoid the reward learning. Another
line of work aims to skip the reward modeling step and may be referred to as the direct preference learning
approach (Zhao et al., 2023; Rafailov et al., 2023; Azar et al., 2023; Tang et al., 2024). Among them, the
direct preference optimization (DPO) algorithm is the most popular one, mostly due to its innovative idea:
_your_ _language_ _model_ _is_ _secretly_ _a_ _reward_ _model_ . In particular, according to the reward benchmark (Lambert
et al., 2024), the DPO-aligned algorithm often admits a competing ranking accuracy as a reward function.
We will formally discuss the principle of DPO in Appendix C.1, which also partly motivates our methods.
After these, there are also many tasks that consider the variants of this direct preference learning approach by
increasing the training steps (Xiong et al., 2023; Hoang Tran, 2024) and consider the more general preference
signal sources (Ye et al., 2024; Rosset et al., 2024). Although all these recently proposed algorithms achieve
promising results, there is little evidence that these algorithms alone without PPO can make state-of-the-art
LLMs. Therefore, understanding PPO and improving its performance in the context of foundation model
alignment is still an important research direction.


**Theoretical** **study** **of** **RLHF.** The theoretical study of RLHF may date back to the dueling bandit and
dueling RL (e.g., Yue et al., 2012; Saha, 2021; Faury et al., 2020; Bengs et al., 2021; Pacchiano et al., 2021;
Chen et al., 2022; Zhu et al., 2023; Wang et al., 2023; Zhan et al., 2023a,b), where the reward maximization
problem is considered in the face of preference signals, instead of the absolute reward signals. However, the
reward maximization framework admits a greedy and deterministic optimal policy, which deviates from the
principle of generative AI. Meanwhile, instead of the original reward function, the most widely used learning
target is a Kullback-Leibler (KL)-regularized one. In recognition of the above issues, Xiong et al. (2023) first
formally formulates the RLHF as the reverse-KL constrained contextual bandit in offline, online, and hybrid
settings, and proposes sample-efficient algorithms in different settings accordingly. Beyond the reward-based
framework under the Bradley-Terry model, Azar et al. (2023); Ye et al. (2024) consider the RLHF under a
general preference oracle, and motivate the algorithmic design in a KL-regularized minimax game between
two LLMs. In particular, Azar et al. (2023) proposes the first sample-efficient planning algorithm, and Ye
et al. (2024) designs the sample-efficient learning algorithms in offline and online settings. Notably, as these
studies of the KL-regularized framework align with the practical applications closely, the theoretical insights
naturally motivate practically powerful algorithms like GSHF (Xiong et al., 2023), Nash-MD (Azar et al.,
2023), and DNO (Rosset et al., 2024). However, we remark that Xiong et al. (2023); Azar et al. (2023); Ye
et al. (2024) are still confined to the bandit setting, thus differing from the MDP formulation presented in
this paper.


**Improving** **PPO** **in** **the** **context** **of** **RLHF.** Although some works (e.g., Uesato et al., 2022; Lightman
et al., 2023; Yang et al., 2024b) use token-wise or step-wise information to enhance the performance of LLMs,
such as their reasoning ability, we will not discuss them in detail here. Instead, we will focus on comparing
our work with others that aim to improve the PPO in RLHF. In particular, Li et al. (2023b) and Ahmadian
et al. (2024) state that the PPO is not the best fit for RLHF because of the sentence-level reward and
deterministic transition, and argue that the reinforce-style (Williams, 1992) algorithms perform better. Wu


3


et al. (2024) proposes to construct several separate reward functions for different goals and use the linear
combination of them to guide the PPO training, but the separate models are still confined to the sentence
level. Similarly, Jang et al. (2023) extends the PPO to the multi-objective optimization scenario, but still
uses the sentence-level modeling. Chan et al. (2024) shares similar insights that aim to improve PPO via a
dense reward. They still follow the two-staged RLHF framework to model the reward function via MLE of
the Bradley-Terry model and assume that the learned reward is based on the transformer (Vaswani et al.,
2017). Then, they propose to use the attention value to redistribute the final scalar reward on a token level.
In comparison, while sharing similar insights about using a token-wise reward, our techniques to obtain the
dense signal and mathematical motivation are fundamentally different.


**Concurrent** **and** **Subsequent** **work.** We notice several concurrent and independent works by Rafailov
et al. (2023); Zeng et al. (2024); Meng et al. (2024). Rafailov et al. (2024) also provides a token-wise MDP
formulation for RLHF. Their work shares the same insight as ours, namely that “DPO implicitly optimizes
the token-wise reward”. Based on this insight, they improve the efficiency of search-based algorithms. In
contrast, we propose a new algorithm `RTO` that leverages the token-wise reward functions to enhance the
performance of PPO. In addition, our work provides a theoretical foundation for the unique advantages of
token-wise MDP and its sample-efficient learning. Meanwhile, Zeng et al. (2024) and Meng et al. (2024)
introduce two direct preference learning algorithms (token-wise DPO and SimPO). Unlike these approaches,
our focus is on improving PPO-based RL training by leveraging token-wise rewards. We include these two
algorithms as baselines to demonstrate the superior performance of `RTO` . Finally, following our work, Cui et al.
(2025); Yin et al. (2025) utilizes implicit rewards in RL training to enhance chat and reasoning capabilities,
highlighting the broad applicability of our method.


**1.3** **Notation**


Given a set _X_, we denote the collection of distributions over _X_ by ∆( _X_ ). We use 1 _{·}_ to denote the indicator
function. For any positive integer _h_, we use the notation _y_ 1: _h_ to denote the sequence _{y_ 1 _, y_ 2 _, . . ., yh}_ . For
any two distributions _P, Q ∈_ ∆( _X_ ), we define the KL divergence as



KL( _P_ _∥Q_ ) = - _P_ ( _x_ ) log - _P_ ( _x_ )

_Q_ ( _x_ )
_x∈X_




_._


### **2 Preliminaries**

In this section, we introduce the standard RLHF paradigm. Let _x_ _∈X_ denote the prompt sampled from a
distribution _ρ_ _∈_ ∆( _X_ ), and _y_ = ( _y_ 1 _, y_ 2 _, . . ., yh, . . ._ ) be the corresponding response, which is a sequence of
tokens generated by LLMs, where _yi_ represents the _i_ -th token. In practice, it is widely assumed (Christiano
et al., 2017; Ziegler et al., 2019; Bai et al., 2022; Ouyang et al., 2022; Touvron et al., 2023) that the preference
signal is generated according to the Bradley-Terry (BT) model (Bradley and Terry, 1952):


P( _y_ [1] _≻_ _y_ [2] _|x, y_ [1] _, y_ [2] ) = exp( _r_ ( _x, y_ [1] ))        - _r_ ( _x, y_ [1] ) _−_ _r_ ( _x, y_ [2] )� _,_ (2.1)
exp( _r_ ( _x, y_ [1] )) + exp( _r_ ( _x, y_ [2] )) [=] _[ σ]_


where _σ_ ( _z_ ) = 1 _/_ (1+exp( _−z_ )) is the sigmoid function, and _r_ is a ground-truth reward function defined at the
**sentence** **level** . In other words, the reward function _r_ only evaluates the overall performance of the entire
response. The classical RLHF pipeline (Ziegler et al., 2019; Ouyang et al., 2022) typically consists of two
steps: reward training from human feedback and reward-based RL training. In the first step, the learner is
given a dataset _D_ = _{_ ( _x, y_ _[w]_ _, y_ _[l]_ ) _}_, where _y_ _[w]_ denotes the preferred response over the _y_ _[l]_ . The reward function
is learned through Maximal Likelihood Estimation (MLE) on this dataset _D_ :


_r_ MLE = argmax E( _x,yw,yl_ ) _∼D_             - log             - _σ_ ( _r_ ( _x, y_ _[w]_ ) _−_ _r_ ( _x, y_ _[l]_ ))�� _._ (2.2)
_r_


In the second step, the learned reward _r_ MLE from the previous step is optimized while ensuring that the
updated language model (LLM) does not deviate significantly from the reference model _π_ ref, usually selected
as a supervised fine-tuned (SFT) LLM. This is because reward optimization along usually leads to reward


4


hacking (Casper et al., 2023), meaning that the LLM will utilize the imperfection of the reward model and
chase for a high reward but with a poor performance at the same time. Formally, the LLM is optimized with
respect to the learned reward _r_ MLE with a KL-regularized term:




_,_



_π_ - = argmax E _x∼ρ,y∼π_ ( _·|x_ )
_π_




_r_ MLE( _x, y_ ) _−_ _β_ log _[π]_ [(] _[y][ |][ x]_ [)]

_π_ ref ( _y | x_ )



where _β_ _>_ 0 is an appropriate KL penalty coefficient. This KL-regularized target is widely adopted in
practice (Christiano et al., 2017; Ziegler et al., 2019; Ouyang et al., 2022; Bai et al., 2022; Rafailov et al.,
2023) to balance reward optimization and the goal of staying close to the reference policy. Another primary
technical reason is that this regularization ensures that the framework admits a stochastic optimal policy, as
compared to the deterministic greedy reward maximizer. The policy optimization step is typically achieved by
PPO (Schulman et al., 2017), a seminal deep RL algorithm for solving multi-step decision-making problems
and its implementation requires a reward signal at each step (corresponding to each token in the context
of LLMs). To this end, given a prompt _x_ and a response _y_ = _y_ 1: _H_ containing _H_ tokens, existing opensource implementations of PPO assign the sentence-level reward _r_ MLE( _x, y_ ) to the last token and optimize
the following reward:



_r_ ppo( _x, y_ 1: _h_ ) =




- _π_ ( _yh | x,y_ 1: _h−_ 1)
0 _−_ _β_ log _π_ ref ( _yh | x,y_ 1: _πh_ ( _−y_ 1 _h_ ) _| x,y_ 1: _h−_ 1) if _h ≤_ _H_ _−_ 1 _,_ (2.3)

_r_ MLE( _x, y_ ) _−_ _β_ log _π_ ref ( _yh | x,y_ 1: _h−_ 1) if _h_ = _H,_



where _π_ is the current policy to be improved. However, it is well known that sparse rewards can make learning
more difficult compared to dense rewards (Andrychowicz et al., 2017). One natural solution is to design dense
token-wise rewards used for PPO training, but this is beyond the scope of the current bandit formulation
for RLHF and motivates us to provide a framework with more fine-grained token-wise characterization that
enables the use of token-wise rewards.

### **3 Formulation for RLHF: From Bandit to MDP**


In this section, we introduce our MDP formulation for RLHF. Section 3.1 describes how to characterize RLHF
using token-wise MDPs in the context of LLMs. Section 3.2, we provide the learning objective under this
framework. Lastly, Section 3.3 demonstrates the advantages of the token-wise MDP formulation compared
to the sentence-wise bandit formulation.


**3.1** **MDP** **Formulation** **for** **RLHF**


We model the RLHF problem as a Markov decision process (MDP), which is denoted as a tuple _M_ =
( _S, A, P, r, ρ, H_ ). Here _S_ is the state space, _A_ is the action space, _P_ : _S_ _× A_ _→_ ∆( _S_ ) is the transition
kernel, _r_ denotes the reward function, _ρ_ signifies the initial state distribution and _H_ is the maximal number
of interaction steps. A (Markov) policy in MDPs _π_ : _S_ _→_ ∆( _A_ ) is a mapping from state to a distribution over
actions. The interaction between the environment _M_ and the agent can be described as follows. Initially,
the starting state _s_ 1 is sampled from the initial distribution _ρ_ . At the _h_ -th step, the agent observes the state
_sh_ and selects an action _ah_ based on its policy. The environment then transits to the next state _sh_ +1, which
is sampled from the distribution _P_ ( _· | sh, ah_ ). This interaction continues until a certain ending condition is
satisfied, which will be triggered within _H_ steps.
In the standard text generation process of large language models (LLMs), each state _sh_ = ( _x, y_ 1: _h−_ 1)
includes the prompt _x_ and all response tokens produced up to that point. Each action _ah_ = _yh_ represents a
token from the vocabulary. The transition kernel _P_ is usually known and deterministic, meaning that given
tokens _sh_ = ( _x, y_ 1: _h−_ 1) and _ah_ = _yh_, the environment will transition to _sh_ +1 = ( _x, y_ 1: _h_ ). The policy _π_ maps
all the observed tokens so far to a distribution over the vocabulary. It is important to note that the policy
captures the autoregressive nature of LLMs, i.e., _π_ ( _y_ 1: _h | x_ ) = [�] _i_ _[h]_ =1 _[π]_ [(] _[y][i][ |][ x, y]_ [1:] _[h][−]_ [1][) for any] _[ h]_ [.] [Due to this, we]
may refer to it as an autoregressive policy to differentiate it from policies defined in other ways. Moreover,
_r_ : _S_ _× A_ _→_ R represents the token-wise reward. The maximum number of tokens that can be generated,
_H_, characterizes the length limit for LLM outputs. Each generated text ends with a special end-of-sentence
token `EoS`, which terminates the generation process.


5


In our MDP formulation for RLHF, we also model the preference signal using BT model (Bradley and
Terry, 1952), but replace the sentence-level reward function in (2.1) with token-wise reward functions. In
specific, for any trajectory pair _τ_ [1] = _{_ ( _s_ [1] _h_ _[, a]_ [1] _h_ [)] _[}][H]_ _h_ =1 [and] _[τ]_ [ 2] [=] _[ {]_ [(] _[s]_ [2] _h_ _[, a]_ [2] _h_ [)] _[}][H]_ _h_ =11, the preference is specified by



exp( [�] _[H]_ _h_ =1 _[r]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [))]      -      - _H_

= _σ_
exp( [�] _[H]_ _h_ =1 _[r]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [)) + exp(][�] _h_ _[H]_ =1 _[r]_ [(] _[s]_ _h_ [2] _[, a]_ [2] _h_ [))] _h_ =1



P( _τ_ [1] _≻_ _τ_ [2] ) = exp( [�] _[H]_ _h_ =1 _[r]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [))]




- _r_ ( _s_ [1] _h_ _[, a]_ [1] _h_ [)] _[ −]_


_h_ =1



_H_ 
- _r_ ( _s_ [2] _h_ _[, a]_ [2] _h_ [)] _._ (3.1)


_h_ =1



Compared to literature that formulates the RLHF problem as a contextual dueling bandit, a subtle difference
is that the policy in the contextual dueling bandit maps a prompt to a distribution over sentences, which
does not capture the autoregressive nature of LLMs. In contrast, our MDP formulation precisely captures
this nature. We defer the discussion of these two types of policies in Section C.2. More importantly, the main
difference is that the reward function in the MDP formulation is defined on a token level, which contrasts
significantly with the sentence-level reward in the contextual dueling bandit. We discuss the advantages of
token-level rewards in Section 3.3.


**3.2** **Learning** **Objective**


Different from classical RL literature, where the sole goal is to maximize the reward function, the objective
of RLHF is to maximize the reward function while ensuring that the learned policy does not deviate too
much from the reference model (e.g., SFT model) too much. Inspired by this and the formulation of entropyregularized MDPs (Williams and Peng, 1991; Ziebart, 2010), for any policy _π_, we define its corresponding
regularized value-function by




    _s_ 1 = _s_ _,_ (3.2)
�����



_Vβ_ _[π]_ [(] _[s]_ [;] _[ r]_ [) =][ E] _[π]_



_∞_




_h_ =1




_r_ ( _sh, ah_ ) _−_ _β ·_ log _[π]_ [(] _[a][h][ |][ s][h]_ [)]

_π_ ref ( _ah | sh_ )



where the expectation E _π_ is taken with respect to the randomness incurred by the policy _π_ . Here the
summation ends when a certain condition is met. In particular, since we assume that the maximal length
of the generated responses of LLMs is at most _H_, the summation in (3.2) is taken at most _H_ steps. In the
remaining part of this paper, we may use [�] _h_ _[∞]_ =1 [and] [�] _h_ _[H]_ =1 [interchangeably,] [as] [they] [mostly] [have] [the] [same]
meaning. The regularized Q-function _Q_ _[π]_ _β_ [of] [a] [policy] _[π]_ [is] [related] [to] [the] [regularized] [value] [function] _[V]_ _β_ _[π]_ [as]


_Q_ _[π]_ _β_ [(] _[s, a]_ [;] _[ r]_ [) =] _[ r][β]_ [(] _[s, a]_ [) +][ E] _s_ _[′]_ _∼P_ ( _· | s,a_ ) [[] _[V]_ _β_ _[π]_ [(] _[s][′]_ [;] _[ r]_ [)]] _[,]_ _Vβ_ _[π]_ [(] _[s]_ [;] _[ r]_ [) =][ E] _a∼π_ ( _· | s_ ) [[] _[−][β]_ [ log] _[ π]_ [(] _[a][ |][ s]_ [) +] _[ Q][π]_ _β_ [(] _[s, a]_ [;] _[ r]_ [)]] _[,]_ (3.3)


where we denote _rβ_ ( _s, a_ ) = _r_ ( _s, a_ ) + _β_ log _π_ ref ( _a | s_ ). Moreover, when it is clear from the context, we may
omit the dependency of the ground-truth reward function _r_ in _Q_ _[π]_ _β_ [(] _[s, a]_ [;] _[ r]_ [)] _[, V]_ _β_ _[π]_ [(] _[s]_ [;] _[ r]_ [)] [and] [use] [the] [shorthand]
_Q_ _[π]_ _β_ [(] _[s, a]_ [)] _[, V]_ _β_ _[π]_ [(] _[s]_ [).] [The regularized optimal policy] _[ π]_ _β_ _[∗]_ [is the policy that maximizes the regularized value function]
defined in (3.2), and its corresponding optimal Q-function and value function are denoted as _Q_ _[∗]_ _β_ [and] _[V]_ _β_ _[∗]_ [,]
respectively. By (3.3), it can be shown that


_πβ_ _[∗]_ [(] _[a][ |][ s]_ [) = exp] _[{]_ [(] _[Q][∗]_ _β_ [(] _[s, a]_ [)] _[ −]_ _[V]_ _β_ _[∗]_ [(] _[s]_ [))] _[/β][}][.]_ (3.4)


Our learning objective is to find a near-optimal policy _π_, and its optimality gap is measured by the following

                      suboptimality gap:


SubOpt( _π_ �) = E _s∼ρ_ [ _Vβ_ _[∗]_ [(] _[s]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[s]_ [)] =] _[ V]_ _β_ _[∗]_ [(] _[ρ]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [)] _[,]_ (3.5)


where we use the shorthand _Vβ_ _[π]_ [(] _[ρ]_ [)] [=] [E] _[s][∼][ρ]_ [[] _[V]_ _β_ _[π]_ [(] _[s]_ [)]] [for] [any] [policy] _[π]_ [.] [For] [ease] [of] [presentation,] [we] [define]
the state visitation measure _d_ _[π]_ ( _s_ ) = E _s_ 1 _∼ρ_ [ [�] _[∞]_ _h_ =1 [P][(] _[s][t]_ [=] _[s][ |][ s]_ [1][)]] [and] [the] [state-action] [visitation] [measure]
_d_ _[π]_ ( _s, a_ ) = E _s_ 1 _∼ρ_ [ [�] _[∞]_ _h_ =1 [P][(] _[s][h]_ [=] _[s, a][h]_ [=] _[a][ |][ s]_ [1][)].] [We] [also] [use] [the] [shorthand] _[d][∗]_ [=] _[d][π]_ _β_ _[∗]_ to further simplify the
notation.


1In fact, these two trajectories can have different lengths, say _τ_ 1 = _{_ ( _s_ 1 _h_ _[, a]_ [1] _h_ [)] _[}][H]_ _h_ =1 [1] [and] _[τ]_ [ 2] [=] _[ {]_ [(] _[s]_ [2] _h_ _[, a]_ [2] _h_ [)] _[}][H]_ _h_ =1 [2] [with] [1] _[ ≤]_ _[H]_ [1] _[, H]_ [2] _[≤]_
_H_ . These trajectories can be extended to length _H_ by assuming that the state ending with `EoS` is absorbing and yields zero
reward. This modification is to simplify the mathematical formulation and does not affect the problem modeling in (3.1). For
the sake of clarity, the following theoretical discussion may focus on length- _H_ trajectories.


6


Figure 2: An illustration of our efficient learning algorithm for the token-wise reward setting with _A_ = 2,
_H_ = 3, and _ξ_ = 1. Here _∗_ and _†_ represent real numbers between 0 and 1/8. We do not specify their exact
values as they do not influence the optimal path. All nodes in _N_ are colored red, while other nodes are blue,
with the optimal leaf node 1 _/_ 2 emphasized in dark blue. Each node _y_ 1: _h_ is labelled with _π_ _[∗]_ ( _y_ 1: _h | x_ ). If a
non-optimal path (response) is selected, one red node in _N_ will be identified, and all paths containing this
node will be deleted. Here we visualize the process of choosing a path ending with _∗_, _†_, and 1 _/_ 4, respectively.
At most _A_ [min] _[{][ξ]_ [+1] _[,H][}]_ = 4 samples are needed to identify the optimal response.


**3.3** **Advantages** **of** **Token-Wise** **MDP** **over** **Sentence-Wise** **Bandit**


Intuitively, the distinction between token-based and trajectory-based rewards reflects the difference between
sparse and dense reward settings. In the sparse reward scenario, exploration proves to be more challenging.
To illustrate this, we focus on the deterministic MDP with an action set size of _A_ = _|A|_ . We employ an
autoregressive policy _π_ _[∗]_ to represent the policy of a powerful LLM, such as GPT-4. Fixing a prompt _x_, given
responses ( _y_ [1] = _y_ 1: [1] _H_ _[, y]_ [2] [=] _[ y]_ 1: [2] _H_ [),] [the] [evaluation] [provided] [by] _[π][∗]_ [is]


_π_ _[∗]_ ( _y_ [1] _| x_ )
P( _y_ [1] _≻_ _y_ [2] _| x, y_ 1 _, y_ 2) =
_π_ _[∗]_ ( _y_ [1] _| x_ ) + _π_ _[∗]_ ( _y_ [2] _| x_ ) _[.]_


By comparing this with the BT models of bandit in (2.1) and of our MDP formulation in (3.1), we observe
that the sentence-wise reward _rs_ and token-wise as _rt_ can be specified by


_rs_ ( _x, y_ ) = log _π_ _[∗]_ ( _y | x_ ) _,_ _rt_ (( _x, y_ 1: _h−_ 1) _, yh_ ) = log _π_ _[∗]_ ( _yh | x, y_ 1: _h−_ 1) _._ (3.6)


Intuitively, the responses that powerful LLMs tend to choose have higher rewards. In addition, it is straightforward to show that _rs_ ( _x, y_ ) = [�] _h_ _[H]_ =1 _[r][t]_ [((] _[x, y]_ [1:] _[h][−]_ [1][)] _[, y][h]_ [).] [We] [also] [make] [the] [following] [natural] [assumption.]

**Assumption** **3.1.** There exists a response _y_ = _y_ 1: _H_ satisfying _π_ _[∗]_ ( _y | x_ ) _≥_ _A_ _[−][ξ]_ .


By the pigeon-hole principle, there must be a response _y_ such that _π_ _[∗]_ ( _y | x_ ) _≥_ _A_ _[−][H]_, implying that _ξ_ _≤_ _H_ .
In practice, _ξ_ is usually much smaller than _H_ because the language model tends to choose the optimal response
rather than making a random guess. Now, we define the interaction protocol and the sample complexity. The
learner can determine a response _y_ = _y_ 1: _H_ and receive either _rs_ ( _x, y_ ) or _{rt_ (( _x, y_ 1: _h−_ 1) _, yh_ ) _}_ _[H]_ _h_ =1 [,] [depending]
on whether the sentence-level reward or the token-wise reward is used. The sample complexity is defined
as the number of responses and corresponding reward signals that need to be gathered to find the optimal
response _y_ _[∗]_ = _y_ 1: _[∗]_ _H_ [with] [length] _[H]_ [.]


**Proposition** **3.2.** Suppose Assumption 3.1 holds. In the setting where only the sentence-wise reward _rs_
in (3.6) is accessible, finding the optimal response _y_ _[∗]_ requires a sample complexity of _A_ _[H]_ . However, if tokenreward signals _rt_ in (3.6) are available, there exists an algorithm that can find the optimal policy with sample
complexity _A_ [min] _[{][ξ]_ [+1] _[,H][}]_ .


_Proof._ If only the sentence-level reward _rs_ is available, the learner must try every possible response and
determine the optimal one by ranking the collected sentence-level reward signals, resulting in a sample


7


complexity of _A_ _[H]_ . Instead, we consider a binary tree with depth _H_ + 1, where each node is indexed by
some token sequence _y_ 1: _h_ and has _A_ children _{_ ( _y_ 1: _h, yh_ +1) _}yh_ +1 _∈A_ . All _A_ _[H]_ leaf nodes denote a unique
prompt-response pair ( _x, y_ 1: _H_ ). We define two disjoint node sets:

_N_ =   - _y_ 1: _h_ : _π_ _[∗]_ ( _y_ 1: _h | x_ ) _< A_ _[−][ξ]_ _, π_ _[∗]_ ( _y_ 1: _h−_ 1 _| x_ ) _≥_ _A_ _[−][ξ]_ [�] _,_ _N_ _[∗]_ [�] _y_ 1: _H_ : _π_ _[∗]_ ( _y_ 1: _H | x_ ) _≥_ _A_ _[−][ξ]_ [�] _._ (3.7)


Our key observations are that (i) each path must contain a node in _N_ or _N_ _[∗]_, (ii) the path containing the
node in _N_ is suboptimal; and (iii) _|N_ _∪N_ _[∗]_ _|_ _≤_ _A_ _[ξ]_ [+1] . The exploration strategy is to query a new path that
does not contain the nodes in _N_ _∪N_ _[′]_ that have been visited. Since each query of a new path (response with
length _H_ ) can identify a new additional node in _N ∪N_ _[∗]_, after at least _A_ _[ξ]_ [+1] queries, we collect a set of paths
where each node in _N_ _∪N_ _[∗]_ belongs to one of the paths. Finally, ranking all gathered rewards of the node in
_N_ _[∗]_ identifies the optimal _y_ _[∗]_ = _y_ 1: _[∗]_ _H_ [.] [Together with the fact that there exists as most] _[ A][H]_ [nodes, we finish the]
proof of Theorem 3.2. To facilitate understanding, we visualize a simplified learning process in Figure 2.


Since _ξ_ _≪_ _H_ typically holds in practice, the gap between _A_ _[H]_ and _A_ [min] _[{][ξ]_ [+1] _[,H][}]_ is deemed large. Hence,
Proposition 3.2 reveals the significant separation of sample complexity between two types of reward signals,
providing theoretical insights into the superiority of the token-wise MDP formulation over the sentence-wise
bandit formulation.

### **4 Reinforced Token Optimization**


Motivated by Section 3, we tackle RLHF by treating it as an MDP problem. Under this MDP framework,
we aim to develop an algorithmic framework that fully utilizes the token-level information. To this end,
we develop the Reinforced Token Optimization ( `RTO` ) algorithm. At a high level, `RTO` consists of two main
steps: (i) token-wise reward learning, where `RTO` learns a token-wise reward based on the preference data;
and (ii) optimizing token-wise reward through RL training methods such as PPO. In Section 4.1, we provide
a theoretically grounded version of `RTO` with guaranteed sample complexity. To align more closely with
practice, we present a practical implementation of `RTO` in Section 4.2.


**4.1** **Theoretical** **Version** **with** **Sample** **Complexity** **Guarantee**


We focus on the offline setting and assume the access to an offline dataset _D_ = _{_ ( _τ_ _[w]_ _, τ_ _[l]_ ) _}_ that contains several
trajectory pairs, where _τ_ _[w]_ = _{_ ( _s_ _[w]_ _h_ _[, a]_ _h_ _[w]_ [)] _[}]_ _h_ _[H]_ =1 [is] [preferred] [over] _[τ][ l]_ [=] _[{]_ [(] _[s][l]_ _h_ _[, a][l]_ _h_ [)] _[}][H]_ _h_ =1 [.] [Each] [pair] [of] [trajectories]
shares the same initial state/prompt (i.e., _s_ _[w]_ 1 [=] _[s][l]_ 1 [),] [but] [differs] [in] [the] [subsequent] [tokens.] [We] [also] [assume]
that the reward function is linear, and our following results are ready to be extended to general function
approximation (Chen et al., 2022; Wang et al., 2023; Zhan et al., 2023a).


**Assumption** **4.1** (Linear Reward) **.** We assume that the reward function _r_ is linear, i.e., _r_ ( _s, a_ ) = _ϕ_ ( _s, a_ ) _[⊤]_ _θ_ _[∗]_

for some known feature _ϕ_ : _S_ _× A_ _→_ R _[d]_ and unknown vector _θ_ _[∗]_ _∈_ R _[d]_ . We also assume that _∥ϕ_ ( _·, ·_ ) _∥_ 2 _≤_ _L_
and _∥θ_ _[∗]_ _∥_ 2 _≤_ _B_ .


Following the standard reward learning pipeline (Ouyang et al., 2022), we learn the reward function via
maximum likelihood estimation (MLE). Specifically, if we parametrize the reward function by _θ_, then the
MLE is given by



_H_

- - [��]

_rθ_ ( _s_ _[l]_ _h_ _[, a][l]_ _h_ [)] _._ (4.1)

_h_ =1



_θ_ MLE = argmax _LD_ ( _θ_ ) _,_ where _LD_ ( _θ_ ) = _∥θ∥_ 2 _≤B_ ( _τ_ _[w]_ _,τ_ _[l]_ ) _∈D_




- - - - _[H]_
log _σ_ _rθ_ ( _s_ _[w]_ _h_ _[, a]_ _h_ _[w]_ [)] _[ −]_

_h_ =1



Inspired by previous literature in offline RL (Jin et al., 2021; Rashidinejad et al., 2021; Xiong et al., 2022;
Zhu et al., 2023; Zhan et al., 2023a), given the MLE _θ_ MLE, we construct the pessimistic token-wise reward
estimation as

_r_ �( _s, a_ ) = _ϕ_ ( _s, a_ ) _[⊤]_ _θ_ MLE _−_ _ϱ · ∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1 _[,]_ (4.2)

where Σ _D_ = [�] ( _τ_ [1] _,τ_ [2] ) _∈D_ [[][�] _[H]_ _h_ =1 [(] _[ϕ]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [)] _[ −]_ _[ϕ]_ [(] _[s]_ [2] _h_ _[, a]_ [2] _h_ [))(][�] _[H]_ _h_ =1 [(] _[ϕ]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [)] _[ −]_ _[ϕ]_ [(] _[s]_ [2] _h_ _[, a]_ [2] _h_ [)))] _[⊤]_ [] +] _[λI][d]_ [,] _[λ >]_ [ 0 is a tuning]

parameter, and _ϱ_ is a problem-dependent coefficient will be specified in Theorem 4.2 and (A.2). Finally, `RTO`
outputs the optimal policy _π_ - with respect to _r_ �, i.e., _π_ - = argmax _π Vβ_ _[π]_ [(] _[s]_ [;][ �] _[r]_ [)] [for] [any] _[s][ ∈S]_ [.] [The] [pseudocode] [of]
`RTO` is given in Algorithm 1.


8


**Algorithm** **1** Reinforced Token Optimization (Theoretical Version)

1: **Input:** Offline dataset _D_, _λ >_ 0, _β_ _>_ 0, and problem dependent coefficient _ϱ_ .
2: Compute _θ_ MLE based on _D_ by maximizing the loglikelihood given in (4.1).
3: Calculate the pessimistic reward _r_ via (4.2). _▷_ token-wise reward learning

               4: Compute the corresponding optimal policy _π_ with respect to _r_ . _▷_ optimizing token-wise reward

                   -                   5: **Output:** policy _π_ .

        

**Algorithm** **2** Reinforced Token Optimization (Practical Version)

1: **Input:** Offline dataset _D_, parameters _β_ 1 _, β_ 2 _>_ 0, DPO algorithm `DPO`, and PPO trainer `PPO-Update` .
2: Compute _π_ dpo _←_ `DPO` ( _D_ ) and let _π_ 0 = _π_ ref as the reference model.
3: **for** _t_ = 1 _, . . ., T_ **do**
4: Get a batch of samples _Dt_ from the dataset _D_ but we only keep the prompts.
5: For each prompt _x ∈Dt_, generate a response _y_ _∼_ _πt−_ 1( _· | x_ ).
6: Calculate the token-wise reward _r_ rto for each pair ( _x, y_ ) by (4.7). _▷_ token-wise reward learning

7: _πt_ _←_ `PPO-Update` ( _πt−_ 1 _, r_ rto _, {_ ( _x, y_ ) _}x∈Dt_ ). _▷_ optimizing token-wise reward
8: **end** **for**
9: **Output:** policy _πT_ .


_√_
**Theorem** **4.2.** Suppose Assumption 4.1 holds. For _β_ _>_ 0, _λ_ _>_ 0, _δ_ _∈_ (0 _,_ 1), if we choose _ϱ_ = _O_ ( _d_ )

[�]

(see (A.2)), then the output policy _π_ of Algorithm 1 satisfies

              
SubOpt( _π_ �) _≤_ 2 _ϱ ·_ E( _s,a_ ) _∼d∗_ [�] _∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1� _−_ _β ·_ E _s∼d_ _[∗]_ [�] KL� _πβ_ _[∗]_ [(] _[· |][ s]_ [)] _[∥][π]_ [�][(] _[· |][ s]_ [)] �� _._


_Proof._ See Appendix A for a detailed proof.


The first term in Theorem 4.2 measures how well the offline dataset covers the trajectory generated by the
policy _πβ_ _[∗]_ [.] [Typically, this term decreases at a rate of] _[ |D|][−]_ [1] _[/]_ [2] [under the mild partial coverage assumption (][Jin]
et al., 2021; Uehara and Sun, 2021; Xiong et al., 2022; Zhu et al., 2023; Zhan et al., 2023a), where _|D|_ is the
size of the offline dataset. The second KL term is always negative, and it arises from the goal of learning a
regularized value. We also remark that our algorithm relies on the known transition kernel to compute the
exact optimal policy with respect to _r_ . While this is natural in the context of large language models, we

               provide insights on how to extend our findings to stochastic regularized MDPs and the variant of our `RTO`
algorithm in Appendix B.
There have also been previous works (Pacchiano et al., 2021; Chen et al., 2022; Wang et al., 2023; Li
et al., 2023c; Zhan et al., 2023a) studying RLHF under the MDP framework, also known as dueling RL and
preference-based RL. However, these works do not consider the KL constraint, which is an essential component
of RLHF. Furthermore, they do not explicitly emphasize the superiority of the MDP framework over the
contextual dueling bandit problem in the context of LLMs, and their proposed algorithms lack practical
implementation. In contrast, we will provide a practical implementation of our algorithm, demonstrating the
practicality of our approach.


**4.2** **Practical** **Implementation**


In this subsection, we shift our focus to developing a practical version of `RTO` . The key challenge in implementing `RTO` in Algorithm 1 lies in learning the token-wise reward to be optimized from the offline data. In
the most popular frameworks outlined in Instruct-GPT (Ouyang et al., 2022), Claude (Bai et al., 2022), and
LlaMA2 (Touvron et al., 2023) projects replace the last layer of the LLM with a linear layer for a scalar
output and maximize the log-likelihood as in (2.2). However, this approach gives only a sentence-level reward.
To bridge the gap in the literature, we present our practical version of `RTO` in Algorithm 2, which features a
novel calculation of token-wise reward. Our key observation is that, given a trajectory _τ_ = _{_ ( _sh, ah_ ) _}_ _[H]_ _h_ =1 [,] [we]


9


have




- _H_ _β_ log _πβ_ _[∗]_ [(] _[a][h]_ _[|][ s][h]_ [)]

_π_ ref ( _ah | sh_ ) [=]
_h_ =1


=



_H_

- _r_ ( _sh, ah_ ) _−_ _Vβ_ _[∗]_ [(] _[s]_ [1][) +]

_h_ =1



_H_

- - _Q_ _[∗]_ _β_ [(] _[s][h][, a][h]_ [)] _[ −]_ _[V]_ _β_ _[∗]_ [(] _[s][h]_ [)] _[ −]_ [log] _[ π]_ [ref] [(] _[a][h]_ _[|][ s][h]_ [)] 
_h_ =1



_H−_ 1

- �E _s′∼P_ ( _· | sh,ah_ )[ _Vβ_ _[∗]_ [(] _[s][′]_ [)]] _[ −]_ _[V]_ _β_ _[∗]_ [(] _[s][h]_ [+1][)] 
_h_ =1



_,_ (4.3)




                            - ��                             ( _⋆_ )


where the first equality uses the closed-form of optimal policy _πβ_ _[∗]_ [(] _[a][ |][ s]_ [) = exp] _[{]_ [(] _[Q][∗]_ _β_ [(] _[s, a]_ [)] _[ −]_ _[V]_ _β_ _[∗]_ [(] _[s]_ [))] _[/β][}]_ [ in (][3.4][),]
and the second equality follows from the fact that _Q_ _[π]_ _β_ [(] _[s, a]_ [)] [=] _[r][β]_ [(] _[s, a]_ [) +][ E] _[s][′][∼P]_ [(] _[· |][ s,a]_ [)][[] _[V]_ _β_ _[π]_ [(] _[s][′]_ [)]] [in] [(][3.3][)] [with]
_rβ_ ( _s, a_ ) = _r_ ( _s, a_ ) + _β_ log _π_ ref ( _a | s_ ). We focus on the typical LLM generation scenario where the transition
kernel is deterministic. Then we have ( _⋆_ ) = 0 in (4.3), yielding that



_H_

- _r_ ( _sh, ah_ ) =


_h_ =1




- _H_ _β_ log _πβ_ _[∗]_ [(] _[a][h]_ _[|][ s][h]_ [)] _β_ _[∗]_ [(] _[s]_ [1][)] _[.]_

_π_ ref ( _ah | sh_ ) [+] _[ V]_
_h_ =1



Building upon this result and combining it with the definition of the BT model in (3.1), for any trajectory
pair _{τ_ _[j]_ = _{_ ( _s_ _[j]_ _h_ _[, a][j]_ _h_ [)] _[}]_ _h_ _[H]_ =1 _[}]_ _j_ [2] =1 [satisfying] _[s]_ [1] 1 [=] _[ s]_ 1 [2][,] [we] [have]




- _H_ _πβ_ _[∗]_ [(] _[a]_ [1] _h_ _[|][ s]_ _h_ [1] [)]

_β_ log
_h_ =1 _π_ ref ( _a_ [1] _h_ _[|][ s]_ _h_ [1] [)] _[−]_




_._ (4.4)




     - _H_

   P( _τ_ [1] _≻_ _τ_ [2] ) = _σ_ _r_ ( _s_ [1] _h_ _[, a]_ _h_ [1] [)] _[ −]_


_h_ =1



_H_ - - _H_

- _r_ ( _s_ [2] _h_ _[, a]_ _h_ [2] [)] = _σ_ 

_h_ =1 _h_ =1



_H_





- _H_ _πβ_ _[∗]_ [(] _[a]_ [2] _h_ _[|][ s]_ _h_ [2] [)]

_β_ log
_h_ =1 _π_ ref ( _a_ [2] _h_ _[|][ s]_ _h_ [2] [)]



An interesting observation is that, based on the autoregressive nature of policies, (4.4) aligns with the learning
objective of DPO proposed by Rafailov et al. (2023), but under the token-level MDP instead of the sentencelevel bandit setup. Similar to the bandit setting where the learning objective is equivalent to a BT model with
_πβ_ _[∗]_ [(] _[y][ |][ x]_ [)]
sentence-wise reward _r_ _[∗]_ ( _x, y_ ) = _β_ log _π_ ref ( _y | x_ ) [(][Rafailov] [et] [al.][,] [2023][),] [(][4.4][)] [shows] [that] [the] [learning] [objective]
in token-wise MDP equivalents to a BT model with a token-wise reward function

_πβ_ _[∗]_ [(] _[a][h]_ _[|][ s][h]_ [)] _πβ_ _[∗]_ [(] _[y][h]_ _[|][ x, y]_ [1:] _[h][−]_ [1][)]
_r_ _[∗]_ ( _sh_ = ( _x, y_ 1: _h−_ 1) _, ah_ = _yh_ ) = _β_ log (4.5)
_π_ ref ( _ah | sh_ ) [=] _[ β]_ [ log] _π_ ref ( _yh | x, y_ 1: _h−_ 1) _[,]_


where _x_ is the prompt, _y_ 1: _h−_ 1 is the tokens generated so far, and _yh_ is the token chosen at the current step.
In contrast to the previous PPO implementation with sparse reward in (2.3), we will assign the token-wise
reward function defined in (4.5) to each step. Formally, for any _h_, we define



_πβ_ _[∗]_ [(] _[y][h]_ _[|][ x, y]_ [1:] _[h][−]_ [1][)]
_β_ 1 log _[π]_ [(] _[y][h][ |][ x, y]_ [1:] _[h][−]_ [1][)]
_π_ ref ( _yh | x, y_ 1: _h−_ 1) _[−]_ _[β]_ [2][ log] _π_ ref ( _yh | x, y_ 1: _h−_ 1




[dpo][(] _[y][h][ |][ x, y]_ [1:] _[h][−]_ [1][)] _[π]_ [(] _[y][h][ |][ x, y]_ [1:] _[h][−]_ [1][)]

_π_ ref ( _yh | x, y_ 1: _h−_ 1) _[−]_ _[β]_ [2][ log] _π_ ref ( _yh | x, y_ 1: _h−_ 1




_[π]_ [(] _[y][h][ |][ x, y]_ [1:] _[h][−]_ [1][)] _[π]_ [dpo][(] _[y][h][ |][ x, y]_ [1:] _[h][−]_ [1][)]

_π_ ref ( _yh | x, y_ 1: _h−_ 1) _[≈]_ _[β]_ [1][ log] _π_ ref ( _yh | x, y_ 1: _h−_ 1)



_π_ ref ( _yh | x, y_ 1: _h−_ 1) _π_ ref ( _yh | x, y_ 1: _h−_ 1) _π_ ref ( _yh | x, y_ 1: _h−_ 1) _π_ ref ( _yh | x, y_ 1: _h−_ 1)

(4.6)
as the token-wise reward, where _β_ 1 and _β_ 2 are tuning parameters, and _π_ is the current policy to be updated.
In the last step of (4.6), we use _π_ dpo, the policy learned by DPO, as a proxy for the unknown _πβ_ _[∗]_ [.] [Finally,]
we employ PPO to optimize the following token-wise reward _r_ rto



_r_ rto( _x, y_ 1: _h_ ) =




- _β_ 1 log _[π]_ [dpo][(] _[y][h][ |][ x,y]_ [1:] _[h][−]_ [1][)]



_β_ 1 log _[π]_ [dpo][(] _[y][h][ |][ x,y]_ [1:] _[h][−]_ [1][)]




[dpo][(] _[y][h][ |][ x,y]_ [1:] _[h][−]_ [1][)] _π_ ( _yh | x,y_ 1: _h−_ 1)

_π_ ref ( _yh | x,y_ 1: _h−_ 1) _[−]_ _[β]_ [2][ log] _π_ ref ( _yh | x,y_ 1: _h−_ 1) if _h ≤_ _H_ _−_ 1 _,_




[dpo] ref [(] _[y]_ _h_ _[h][ |][ x,y]_ 1: [1:] _h_ _[h]_ _−_ _[−]_ 1 [1][)] _π_ ref( _yh |h x,y_ 1:1: _h−h−_ 1)1 (4.7)

_π_ ref ( _yh | x,y_ 1: _h−_ 1) _[−]_ _[β]_ [2][ log] _π_ ref ( _yh | x,y_ 1: _h−_ 1) [+] _[ β]_ [3] _[ ·][ r]_ [MLE][(] _[x, y]_ [1:] _[H]_ [)] if _h_ = _H,_



where _β_ 3 _≥_ 0 is a tuning parameter and _r_ MLE represents a sentence-level reward. This additional sentencelevel reward helps prevent responses from becoming either extremely long or extremely short. This aligns
with the observation that ensemble rewards can effectively mitigate the overoptimization issues (Coste et al.,
2023). We also remark that the sentence-level reward _r_ MLE can be much smaller in magnitude compared
to both the policy model (actor) and DPO reward model, making the overall computational cost of RTO
_comparable_ to the standard RLHF pipeline: The lower cost of using a much smaller critic in PPO compensates
for both the small extra cost required by DPO than reward model, and the training and serving of the tiny
reward model. For parameter selection, _β_ 3 can be set to 1 when _r_ MLE is included. This choice is without
loss of generality, as the key factor is the ratio of _β_ 3 to _β_ 1 and _β_ 2, rather than its absolute value. _β_ 2 can
be chosen similarly in standard PPO configurations. The only extra hyperparameter _β_ 1 can be set small to
prevent the DPO reward from dominating, thereby requiring minimum tuning.


10


|Method<br>Metric<br>SFT DPO R-DPO SimPO TDPO PPO RTO|Method|
|---|---|
|Metric<br>Method<br>SFT<br>DPO<br>R-DPO<br>SimPO<br>TDPO<br>PPO<br>RTO|SFT<br>DPO<br>R-DPO<br>SimPO<br>TDPO<br>PPO<br>RTO|
|AE (LC)<br>AE (WR)<br>AH (SC)<br>AH (WR)|13.22<br>17.40<br>18.34<br>25.46<br>20.13<br>19.47<br>**27.00**<br>8.58<br>12.23<br>12.03<br>20.20<br>11.97<br>12.89<br>**22.45**<br>9.2<br>13.2<br>14.2<br>14.5<br>13.2<br>16.2<br>**20.3**<br>8.9<br>13.8<br>14.1<br>15.2<br>12.3<br>15.6<br>**21.4**|


Table 1: AlpacaEval 2 ( **AE** ) and Arena-Hard ( **AH** ) results.

### **5 Experiments**


In this section, we conduct comprehensive alignment experiments to verify the effectiveness of `RTO` .


**5.1** **Benchmark** **Results**


We present a thorough comparison of RTO with PPO and other widely used direct preference learning
algorithms on popular benchmarks to highlight RTO’s strong performance.


**Task,** **Data,** **and** **Evaluation.** To assess the overall quality of generated text responses across multiple
dimensions (e.g., helpfulness, accuracy, and clarity), we employ the dataset [UltraFeedback](https://huggingface.co/datasets/HuggingFaceH4/ultrafeedback_binarized) (Cui et al., 2023)
that contains comprehensive human feedback annotations on model outputs. We evaluate models using two
established benchmarks: AlpacaEval 2 (Li et al., 2023a) and Arena-Hard (Li et al., 2024). These benchmarks
assess various conversational abilities across different types of queries. For AlpacaEval 2, we report both
standard win rates (WR) and length-controlled win rates (LC). For Arena-Hard, we present the WR along
with its style-controlled (SC) version. Both LC and SC are specifically designed to mitigate verbosity bias
of llm judge.


**Implementation** **Details** **of** **RTO** **and** **Baselines.** We employ Llama-3-8B (Dubey et al., 2024) as the
base model. For our comparative analysis, we implement several baselines. All subsequent models are
initialized with an [open-source](https://huggingface.co/OpenRLHF/Llama-3-8b-sft-mixture) **SFT** model Dong et al. (2024) that fine-tunes Llama-3-8B with a diverse
mixture of high-quality data. We further train a **DPO** model, which finetunes the SFT model using the
positive/negative preference data. Besides these two RL-free algorithms, we compare three RLHF algorithms
relying on RL training. The first one is the standard **PPO** algorithm, which directly optimizes sentencelevel 8B reward in (2.3). Our proposed **RTO** algorithm leverages both token-wise signals from the DPO
model and an additional 1B sentence-wise reward _r_ MLE to compute the RTO reward specified in (4.7). The
policy is then trained to align with human preferences using PPO updates, as detailed in Algorithm 2. For
a comprehensive comparison, we include the length-controlled version of DPO, referred to as **R-DPO** (Park
et al., 2024), along with two preference learning algorithms introduced in concurrent and independent works:
**SimPO** (Meng et al., 2024) and token-wise DPO ( **TDPO** ) (Zeng et al., 2024), as baselines. We include
more details in appendix D.


**RTO** **Outperforms** **PPO** **and** **Other** **Direct** **Preference** **Learning** **Algorithms.** As demonstrated
in Table 1, while all evaluated algorithms show improvement over the base SFT model, our `RTO` algorithm
achieves superior performance across all benchmarks. Specifically, `RTO` outperforms PPO by achieving a
7.53% higher win rate in the AlpacaEval 2 LC benchmark and a 4.1% higher win rate in the Arena-Hard SC
benchmark. These results highlight the effectiveness of incorporating token-wise reward (dense reward) into
PPO training. Furthermore, when compared to the leading preference learning baselines, `RTO` demonstrates
improvements of 2 and 4 points in the AlpacaEval 2 LC benchmark and the Arena-Hard SC benchmark,
respectively.


**5.2** **In-depth** **Analysis** **of** **RTO** **Performance**


In this subsection, we provide a detailed analysis of RTO. First, we examine the influence of reward granularity
by comparing the performance of RL training based on different reward types. Next, we demonstrate that


11


the token-wise reward (provided by DPO) primarily serves as reward shaping, which contributes significantly
to RTO’s success. Finally, we investigate RTO’s sample efficiency to support our theoretical findings.



**The** **Influence** **of** **Reward** **Granularity.** We
analyze three reward granularity settings by redistributing token-level rewards used in RTO: (i)
**RTO**, where rewards are assigned to each token;
(ii) **Semi-RTO**, where the rewards of all tokens
in each sentence are reassigned to their delimiter,
and (iii) **DDPO**, where all rewards are delayed
and assigned to the EoS token. Table 3 and Figure 4(a) clearly demonstrates that denser rewards
lead to better performance.



AlpacaEval 2 Arena-Hard
Method

LC WR SC WR


RTO 27.00 **22.45** **20.3** **21.4**
Semi-RTO 23.77 19.17 19.0 19.7
DDPO 21.09 13.06 13.1 12.1
RS-PPO **27.52** 21.69 19.2 19.9


Figure 3: Benchmark results of ablations studies.



**Reward** **Shaping** **via** **DPO** **Reward** **is** **the**
**Key** **to** **RTO’s** **Success.** We demonstrate that the superior performance of `RTO` is not primarily due
to replacing the reward model trained with MLE with the implicit reward from DPO. Instead, its advantage
lies in its role as a reward-shaping mechanism. To illustrate this, we compare RTO and DPPO with another
setup, **RS-PPO**, where the reward matches _r_ rto in (4.7), except for subtracting the DPO implicit reward
_β_ 1 log _[π]_ _π_ [dpo] ref ( [(] _y_ _[y]_ _|_ _[|]_ _x_ _[x]_ ) [)] [from] [the] [last] [token.] [This] [adjustment] [results] [in] [a] [total] [reward] [equivalent] [to] _[r]_ [MLE][(] _[x, y]_ [),] [ef-]

fectively employing the DPO token-wise implicit reward for reward shaping. From Table 3 and Figure 4(b),
we observe that the main contribution of the DPO reward to improving RL training lies in reward shaping
rather than altering the total reward through its exact value.


**Sample** **Efficiency** **of** **RTO.** To validate the theoretical claims in Theorem 4.2, which guarantees the
provable sample efficiency of `RTO`, and Proposition 3.2, which demonstrates that `RTO` is more efficient than
PPO due to its use of token-wise rewards instead of sentence-wise rewards, we conducted experiments using
only a fraction of the full dataset. These experiments evaluated the ability of `RTO` and PPO to learn an effective
policy with limited data. As shown in Figure 4(c), `RTO` matches PPO’s performance using only about 1 _/_ 8 of
the data and ultimately surpasses PPO’s final performance. Additionally, `RTO` exhibits superior data scaling
behavior compared to PPO — `RTO` continues to improve with more data, while PPO’s performance saturates
early.



(a) Effect of different reward granularity.



(b) Effect of reward shaping. (c) Data scaling behavior of PPO and
RTO.



Figure 4: (a) and (b) show the obtained reward of _r_ MLE throughout training. (c) shows the AlpacaEval 2
performance of PPO and RTO when trained on fractions of samples.


**Additional** **Experiments.** To showcase the applicability of `RTO`, we conducted additional experiments
demonstrating: (i) its effectiveness **beyond** **PPO** by incorporating the learned token-wise reward function into REINFORCE-type algorithms (Williams, 1992; Hu, 2025), yielding significant improvements (Appendix E), and (ii) its utility for diverse alignment tasks beyond dialogue, such as text **summarization**
(V¨olske et al., 2017) (Appendix F).


12


### **6 Conclusion**

In this work, we propose an MDP formulation for RLHF that better characterizes token-wise information,
along with theoretical insights demonstrating its superiority. Building upon this formulation, we introduce a
novel algorithm called Reinforced Token Optimization ( `RTO` ), which leverages token-wise rewards to improve
the policy. `RTO` is shown to be both provably sample-efficient and practical. Our practical implementation
involves a novel token-wise reward learning approach via DPO, followed by optimization using PPO. This
innovative combination of DPO and PPO allows `RTO` to effectively utilize token-level information and significantly improve the performance of baselines. Furthermore, our research opens up several intriguing future
directions, such as designing alternative methods for learning token-wise rewards beyond DPO and exploring
other RL algorithms for optimizing token-level rewards besides PPO.

### **References**


Agarwal, A., Kakade, S. M., Lee, J. D. and Mahajan, G. (2021). On the theory of policy gradient methods:
Optimality, approximation, and distribution shift. _The_ _Journal_ _of_ _Machine_ _Learning_ _Research_, **22** 4431–
4506.


Ahmadian, A., Cremer, C., Gall´e, M., Fadaee, M., Kreutzer, J., Ust¨un, [¨] A. and Hooker, S. (2024). Back to
basics: Revisiting reinforce style optimization for learning from human feedback in llms. _arXiv_ _preprint_
_arXiv:2402.14740_ .


Andrychowicz, M., Wolski, F., Ray, A., Schneider, J., Fong, R., Welinder, P., McGrew, B., Tobin, J.,
Pieter Abbeel, O. and Zaremba, W. (2017). Hindsight experience replay. _Advances_ _in_ _neural_ _informa-_
_tion_ _processing_ _systems_, **30** .


Anthropic (2023). Introducing claude.
```
 https://www.anthropic.com/index/introducing-claude

```

Azar, M. G., Rowland, M., Piot, B., Guo, D., Calandriello, D., Valko, M. and Munos, R. (2023). A general
theoretical paradigm to understand learning from human preferences. _arXiv_ _preprint_ _arXiv:2310.12036_ .


Bai, Y., Jones, A., Ndousse, K., Askell, A., Chen, A., DasSarma, N., Drain, D., Fort, S., Ganguli, D.,
Henighan, T. et al. (2022). Training a helpful and harmless assistant with reinforcement learning from
human feedback. _arXiv_ _preprint_ _arXiv:2204.05862_ .


Bengs, V., Busa-Fekete, R., El Mesaoudi-Paul, A. and H¨ullermeier, E. (2021). Preference-based online learning with dueling bandits: A survey. _The_ _Journal_ _of_ _Machine_ _Learning_ _Research_, **22** 278–385.


Biderman, S., Schoelkopf, H., Anthony, Q. G., Bradley, H., O’Brien, K., Hallahan, E., Khan, M. A.,
Purohit, S., Prashanth, U. S., Raff, E. et al. (2023). Pythia: A suite for analyzing large language models
across training and scaling. In _International_ _Conference_ _on_ _Machine_ _Learning_ . PMLR.


Bradley, R. A. and Terry, M. E. (1952). Rank analysis of incomplete block designs: I. the method of paired
comparisons. _Biometrika_, **39** 324–345.


Cai, Q., Yang, Z., Jin, C. and Wang, Z. (2020). Provably efficient exploration in policy optimization. In
_International_ _Conference_ _on_ _Machine_ _Learning_ . PMLR.


Casper, S., Davies, X., Shi, C., Gilbert, T. K., Scheurer, J., Rando, J., Freedman, R., Korbak, T.,
Lindner, D., Freire, P. et al. (2023). Open problems and fundamental limitations of reinforcement learning
from human feedback. _arXiv_ _preprint_ _arXiv:2307.15217_ .


Cen, S., Cheng, C., Chen, Y., Wei, Y. and Chi, Y. (2022). Fast global convergence of natural policy gradient
methods with entropy regularization. _Operations_ _Research_, **70** 2563–2578.


Chan, A. J., Sun, H., Holt, S. and van der Schaar, M. (2024). Dense reward for free in reinforcement learning
from human feedback. _arXiv_ _preprint_ _arXiv:2402.00782_ .


13


Chen, L., Lu, K., Rajeswaran, A., Lee, K., Grover, A., Laskin, M., Abbeel, P., Srinivas, A. and Mordatch, I.
(2021). Decision transformer: Reinforcement learning via sequence modeling. _Advances_ _in_ _neural_ _infor-_
_mation_ _processing_ _systems_, **34** 15084–15097.


Chen, X., Zhong, H., Yang, Z., Wang, Z. and Wang, L. (2022). Human-in-the-loop: Provably efficient
preference-based reinforcement learning with general function approximation. In _International_ _Confer-_
_ence_ _on_ _Machine_ _Learning_ . PMLR.


Choshen, L., Fox, L., Aizenbud, Z. and Abend, O. (2019). On the weaknesses of reinforcement learning for
neural machine translation. _arXiv_ _preprint_ _arXiv:1907.01752_ .


Christiano, P. F., Leike, J., Brown, T., Martic, M., Legg, S. and Amodei, D. (2017). Deep reinforcement
learning from human preferences. _Advances_ _in_ _neural_ _information_ _processing_ _systems_, **30** .


Coste, T., Anwar, U., Kirk, R. and Krueger, D. (2023). Reward model ensembles help mitigate overoptimization. _arXiv_ _preprint_ _arXiv:2310.02743_ .


Cui, G., Yuan, L., Ding, N., Yao, G., Zhu, W., Ni, Y., Xie, G., Liu, Z. and Sun, M. (2023). Ultrafeedback:
Boosting language models with high-quality feedback.


Cui, G., Yuan, L., Wang, Z., Wang, H., Li, W., He, B., Fan, Y., Yu, T., Xu, Q., Chen, W., Yuan, J.,
Chen, H., Zhang, K., Lv, X., Wang, S., Yao, Y., Peng, H., Cheng, Y., Liu, Z., Sun, M., Zhou, B. and
Ding, N. (2025). Process reinforcement through implicit rewards.


Dong, H., Xiong, W., Goyal, D., Zhang, Y., Chow, W., Pan, R., Diao, S., Zhang, J., SHUM, K. and
Zhang, T. (2023). RAFT: Reward ranked finetuning for generative foundation model alignment. _Transac-_
_tions_ _on_ _Machine_ _Learning_ _Research_ .


Dong, H., Xiong, W., Pang, B., Wang, H., Zhao, H., Zhou, Y., Jiang, N., Sahoo, D., Xiong, C. and Zhang, T.
(2024). Rlhf workflow: From reward modeling to online rlhf.


Dubey, A., Jauhri, A., Pandey, A., Kadian, A., Al-Dahle, A., Letman, A., Mathur, A., Schelten, A.,
Yang, A., Fan, A. et al. (2024). The llama 3 herd of models. _arXiv_ _preprint_ _arXiv:2407.21783_ .


Faury, L., Abeille, M., Calauz`enes, C. and Fercoq, O. (2020). Improved optimistic algorithms for logistic
bandits. In _International_ _Conference_ _on_ _Machine_ _Learning_ . PMLR.


Gulcehre, C., Paine, T. L., Srinivasan, S., Konyushkova, K., Weerts, L., Sharma, A., Siddhant, A.,
Ahern, A., Wang, M., Gu, C. et al. (2023). Reinforced self-training (rest) for language modeling. _arXiv_
_preprint_ _arXiv:2308.08998_ .


Hoang Tran, B. H., Chris Glaze (2024). Snorkel-mistral-pairrm-dpo.
```
 https://huggingface.co/snorkelai/Snorkel-Mistral-PairRM-DPO

```

Hu, J. (2025). Reinforce++: A simple and efficient approach for aligning large language models. _arXiv_
_preprint_ _arXiv:2501.03262_ .


Hu, J., Tao, L., Yang, J. and Zhou, C. (2023). Aligning language models with offline reinforcement learning
from human feedback. _arXiv_ _preprint_ _arXiv:2308.12050_ .


Hu, J., Wu, X., Zhu, Z., Xianyu, Wang, W., Zhang, D. and Cao, Y. (2024). Openrlhf: An easy-to-use,
scalable and high-performance rlhf framework. _arXiv_ _preprint_ _arXiv:2405.11143_ .


Huang, J., Yardim, B. and He, N. (2024). On the statistical efficiency of mean-field reinforcement learning
with general function approximation. In _International_ _Conference_ _on_ _Artificial_ _Intelligence_ _and_ _Statistics_ .
PMLR.


Jang, J., Kim, S., Lin, B. Y., Wang, Y., Hessel, J., Zettlemoyer, L., Hajishirzi, H., Choi, Y. and
Ammanabrolu, P. (2023). Personalized soups: Personalized large language model alignment via post-hoc
parameter merging. _arXiv_ _preprint_ _arXiv:2310.11564_ .


14


Jin, Y., Yang, Z. and Wang, Z. (2021). Is pessimism provably efficient for offline rl? In _International_
_Conference_ _on_ _Machine_ _Learning_ . PMLR.


Kakade, S. and Langford, J. (2002). Approximately optimal approximate reinforcement learning. In _Proceed-_
_ings_ _of_ _the_ _Nineteenth_ _International_ _Conference_ _on_ _Machine_ _Learning_ .


Kingma, D. P. (2014). Adam: A method for stochastic optimization. _arXiv_ _preprint_ _arXiv:1412.6980_ .


Lambert, N., Pyatkin, V., Morrison, J., Miranda, L., Lin, B. Y., Chandu, K., Dziri, N., Kumar, S., Zick, T.,
Choi, Y. et al. (2024). Rewardbench: Evaluating reward models for language modeling. _arXiv_ _preprint_
_arXiv:2403.13787_ .


Li, T., Chiang, W.-L., Frick, E., Dunlap, L., Wu, T., Zhu, B., Gonzalez, J. E. and Stoica, I. (2024). From
crowdsourced data to high-quality benchmarks: Arena-hard and benchbuilder pipeline. _arXiv_ _preprint_
_arXiv:2406.11939_ .


Li, X., Zhang, T., Dubois, Y., Taori, R., Gulrajani, I., Guestrin, C., Liang, P. and Hashimoto, T. B. (2023a).
Alpacaeval: An automatic evaluator of instruction-following models. `[https://github.com/tatsu-lab/](https://github.com/tatsu-lab/alpaca_eval)`
`[alpaca_eval](https://github.com/tatsu-lab/alpaca_eval)` .


Li, Z., Xu, T., Zhang, Y., Yu, Y., Sun, R. and Luo, Z.-Q. (2023b). Remax: A simple, effective, and efficient
reinforcement learning method for aligning large language models. _arXiv_ _e-prints_ arXiv–2310.


Li, Z., Yang, Z. and Wang, M. (2023c). Reinforcement learning with human feedback: Learning dynamic
choices via pessimism. _arXiv_ _preprint_ _arXiv:2305.18438_ .


Lightman, H., Kosaraju, V., Burda, Y., Edwards, H., Baker, B., Lee, T., Leike, J., Schulman, J.,
Sutskever, I. and Cobbe, K. (2023). Let’s verify step by step. _arXiv_ _preprint_ _arXiv:2305.20050_ .


Liu, Q., Chung, A., Szepesv´ari, C. and Jin, C. (2022). When is partially observable reinforcement learning
not scary? In _Conference_ _on_ _Learning_ _Theory_ . PMLR.


Liu, Z., Lu, M., Xiong, W., Zhong, H., Hu, H., Zhang, S., Zheng, S., Yang, Z. and Wang, Z. (2023). Maximize to explore: One objective function fusing estimation, planning, and exploration. In _Thirty-seventh_
_Conference_ _on_ _Neural_ _Information_ _Processing_ _Systems_ .


Meng, Y., Xia, M. and Chen, D. (2024). Simpo: Simple preference optimization with a reference-free reward.
_arXiv_ _preprint_ _arXiv:2405.14734_ .


Nakano, R., Hilton, J., Balaji, S., Wu, J., Ouyang, L., Kim, C., Hesse, C., Jain, S., Kosaraju, V.,
Saunders, W. et al. (2021). Webgpt: Browser-assisted question-answering with human feedback. _arXiv_
_preprint_ _arXiv:2112.09332_ .


OpenAI (2023). Gpt-4 technical report. _ArXiv_, **abs/2303.08774** .


Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C., Mishkin, P., Zhang, C., Agarwal, S., Slama, K.,
Ray, A. et al. (2022). Training language models to follow instructions with human feedback. _Advances_ _in_
_Neural_ _Information_ _Processing_ _Systems_, **35** 27730–27744.


Pacchiano, A., Saha, A. and Lee, J. (2021). Dueling rl: reinforcement learning with trajectory preferences.
_arXiv_ _preprint_ _arXiv:2111.04850_ .


Park, R., Rafailov, R., Ermon, S. and Finn, C. (2024). Disentangling length from quality in direct preference
optimization. _arXiv_ _preprint_ _arXiv:2403.19159_ .


Rafailov, R., Hejna, J., Park, R. and Finn, C. (2024). From _r_ to _q_ _[∗]_ : Your language model is secretly a
q-function. _arXiv_ _preprint_ _arXiv:2404.12358_ .


Rafailov, R., Sharma, A., Mitchell, E., Ermon, S., Manning, C. D. and Finn, C. (2023). Direct preference
optimization: Your language model is secretly a reward model. _arXiv_ _preprint_ _arXiv:2305.18290_ .


15


Rashidinejad, P., Zhu, B., Ma, C., Jiao, J. and Russell, S. (2021). Bridging offline reinforcement learning
and imitation learning: A tale of pessimism. _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_, **34**
11702–11716.


Rosset, C., Cheng, C.-A., Mitra, A., Santacroce, M., Awadallah, A. and Xie, T. (2024). Direct nash optimization: Teaching language models to self-improve with general preferences. _arXiv_ _preprint_ _arXiv:2404.03715_ .


Saha, A. (2021). Optimal algorithms for stochastic contextual preference bandits. _Advances_ _in_ _Neural_ _Infor-_
_mation_ _Processing_ _Systems_, **34** 30050–30062.


Schulman, J., Wolski, F., Dhariwal, P., Radford, A. and Klimov, O. (2017). Proximal policy optimization
algorithms. _arXiv_ _preprint_ _arXiv:1707.06347_ .


Tang, Y., Guo, Z. D., Zheng, Z., Calandriello, D., Munos, R., Rowland, M., Richemond, P. H., Valko, M.,
Pires, B. A. [´] and Piot, B. (2024). Generalized preference optimization: A unified approach to offline alignment. _arXiv_ _preprint_ _arXiv:2402.05749_ .


Team, G., Anil, R., Borgeaud, S., Wu, Y., Alayrac, J.-B., Yu, J., Soricut, R., Schalkwyk, J., Dai, A. M.,
Hauth, A. et al. (2023). Gemini: a family of highly capable multimodal models. _arXiv_ _preprint_
_arXiv:2312.11805_ .


Touvron, H., Martin, L., Stone, K., Albert, P., Almahairi, A., Babaei, Y., Bashlykov, N., Batra, S.,
Bhargava, P., Bhosale, S. et al. (2023). Llama 2: Open foundation and fine-tuned chat models. _arXiv_
_preprint_ _arXiv:2307.09288_ .


Uehara, M. and Sun, W. (2021). Pessimistic model-based offline reinforcement learning under partial coverage. _arXiv_ _preprint_ _arXiv:2107.06226_ .


Uesato, J., Kushman, N., Kumar, R., Song, F., Siegel, N., Wang, L., Creswell, A., Irving, G. and Higgins, I.
(2022). Solving math word problems with process-and outcome-based feedback. _arXiv_ _preprint_
_arXiv:2211.14275_ .


Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, �L. and Polosukhin, I.
(2017). Attention is all you need. _Advances_ _in_ _neural_ _information_ _processing_ _systems_, **30** .


V¨olske, M., Potthast, M., Syed, S. and Stein, B. (2017). Tl; dr: Mining reddit to learn automatic summarization. In _Proceedings_ _of_ _the_ _Workshop_ _on_ _New_ _Frontiers_ _in_ _Summarization_ .


Wang, H., Lin, Y., Xiong, W., Yang, R., Diao, S., Qiu, S., Zhao, H. and Zhang, T. (2024). Arithmetic control
of llms for diverse user preferences: Directional preference alignment with multi-objective rewards. _arXiv_
_preprint_ _arXiv:2402.18571_ .


Wang, Y., Liu, Q. and Jin, C. (2023). Is rlhf more difficult than standard rl? _arXiv_ _preprint_
_arXiv:2306.14111_ .


Williams, R. J. (1992). Simple statistical gradient-following algorithms for connectionist reinforcement learning. _Machine_ _learning_, **8** 229–256.


Williams, R. J. and Peng, J. (1991). Function optimization using connectionist reinforcement learning algorithms. _Connection_ _Science_, **3** 241–268.


Wu, T., Yang, Y., Zhong, H., Wang, L., Du, S. and Jiao, J. (2022). Nearly optimal policy optimization with
stable at any time guarantee. In _International_ _Conference_ _on_ _Machine_ _Learning_ . PMLR.


Wu, Z., Hu, Y., Shi, W., Dziri, N., Suhr, A., Ammanabrolu, P., Smith, N. A., Ostendorf, M. and
Hajishirzi, H. (2024). Fine-grained human feedback gives better rewards for language model training.
_Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_, **36** .


Xiong, W., Dong, H., Ye, C., Wang, Z., Zhong, H., Ji, H., Jiang, N. and Zhang, T. (2023). Iterative preference learning from human feedback: Bridging theory and practice for rlhf under kl-constraint. In _ICLR_
_2024_ _Workshop_ _on_ _Mathematical_ _and_ _Empirical_ _Understanding_ _of_ _Foundation_ _Models_ .


16


Xiong, W., Zhong, H., Shi, C., Shen, C., Wang, L. and Zhang, T. (2022). Nearly minimax optimal offline
reinforcement learning with linear function approximation: Single-agent mdp and markov game. _arXiv_
_preprint_ _arXiv:2205.15512_ .


Yang, R., Pan, X., Luo, F., Qiu, S., Zhong, H., Yu, D. and Chen, J. (2024a). Rewards-in-context:
Multi-objective alignment of foundation models with dynamic preference adjustment. _arXiv_ _preprint_
_arXiv:2402.10207_ .


Yang, S., Zhang, S., Xia, C., Feng, Y., Xiong, C. and Zhou, M. (2024b). Preference-grounded token-level
guidance for language model fine-tuning. _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_, **36** .


Ye, C., Xiong, W., Zhang, Y., Jiang, N. and Zhang, T. (2024). A theoretical analysis of nash learning from
human feedback under general kl-regularized preference. _arXiv_ _preprint_ _arXiv:2402.07314_ .


Yin, Y., Yang, S., Xie, Y., Yang, Z., Sun, Y., Awadalla, H., Chen, W. and Zhou, M. (2025). Segmenting text
and learning their rewards for improved rlhf in language model. _arXiv_ _preprint_ _arXiv:2501.02790_ .


Yue, Y., Broder, J., Kleinberg, R. and Joachims, T. (2012). The k-armed dueling bandits problem. _Journal_
_of_ _Computer_ _and_ _System_ _Sciences_, **78** 1538–1556.


Zeng, Y., Liu, G., Ma, W., Yang, N., Zhang, H. and Wang, J. (2024). Token-level direct preference optimization. _arXiv_ _preprint_ _arXiv:2404.11999_ .


Zhan, W., Uehara, M., Kallus, N., Lee, J. D. and Sun, W. (2023a). Provable offline reinforcement learning
with human feedback. _arXiv_ _preprint_ _arXiv:2305.14816_ .


Zhan, W., Uehara, M., Sun, W. and Lee, J. D. (2023b). How to query human feedback efficiently in rl? _arXiv_
_preprint_ _arXiv:2305.18505_ .


Zhang, T. (2023). _Mathematical_ _analysis_ _of_ _machine_ _learning_ _algorithms_ . Cambridge University Press.


Zhao, Y., Joshi, R., Liu, T., Khalman, M., Saleh, M. and Liu, P. J. (2023). Slic-hf: Sequence likelihood
calibration with human feedback. _arXiv_ _preprint_ _arXiv:2305.10425_ .


Zhong, H., Xiong, W., Zheng, S., Wang, L., Wang, Z., Yang, Z. and Zhang, T. (2022). Gec: A unified framework for interactive decision making in mdp, pomdp, and beyond. _arXiv_ _preprint_ _arXiv:2211.01962_ .


Zhong, H. and Zhang, T. (2024). A theoretical analysis of optimistic proximal policy optimization in linear
markov decision processes. _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_, **36** .


Zhu, B., Jiao, J. and Jordan, M. I. (2023). Principled reinforcement learning with human feedback from
pairwise or _k_ -wise comparisons. _arXiv_ _preprint_ _arXiv:2301.11270_ .


Ziebart, B. D. (2010). _Modeling_ _purposeful_ _adaptive_ _behavior_ _with_ _the_ _principle_ _of_ _maximum_ _causal_ _entropy_ .
Carnegie Mellon University.


Ziegler, D. M., Stiennon, N., Wu, J., Brown, T. B., Radford, A., Amodei, D., Christiano, P. and Irving, G.
(2019). Fine-tuning language models from human preferences. _arXiv_ _preprint_ _arXiv:1909.08593_ .


17


### **A Proof of Theorem 4.2**

Recall that the visitation measure of policy _π_ is



_d_ _[π]_ ( _s_ ) = E _s_ 1 _∼ρ_



_∞_

- 

P( _st_ = _s | s_ 1) _,_ _d_ _[π]_ ( _s, a_ ) = E _s_ 1 _∼ρ_

_h_ =1



_∞_

- 
 
P( _sh_ = _s, ah_ = _a | s_ 1) _._ (A.1)

_h_ =1



_∞_


 


Under this notation, we can rewrite the value function in (3.2) as


_Vβ_ _[π]_ [(] _[ρ]_ [) =][ E] ( _s,a_ ) _∼d_ _[π]_ [�] _r_ ( _s, a_ ) _−_ KL� _π_ ( _· | s_ ) _∥π_ ref ( _· | s_ )�� _._


For simplicity, we will use the shorthand _d_ _[∗]_ = _d_ _[π]_ _β_ _[∗]_ .


_Proof_ _of_ _Theorem_ _4.2._ Our proof relies on the following standard MLE analysis.


**Lemma** **A.1** (MLE Analysis) **.** It holds with probability 1 _−_ _δ_ that



_∥θ_ MLE _−_ _θ_ _[∗]_ _∥_ Σ _D_ _≤_ _ϱ_ := _C ·_




~~�~~ _d_ log(1 _/δ_ )

+ _λB_ [2] _,_ (A.2)
Υ



where _C_ is an absolute constant and Υ = 1 _/_ (2 + exp( _−_ 2 _HLB_ ) + exp(2 _HLB_ )).


_Proof._ See e.g., Faury et al. (2020); Pacchiano et al. (2021); Zhu et al. (2023) for a detailed proof.


Back to the proof of Theorem 4.2, we first decompose the suboptimality gap defined in (3.5) as


SubOpt( _π_ �) = _Vβ_ _[∗]_ [(] _[ρ]_ [;] _[ r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [;] _[ r]_ [)]

= E( _s,a_ ) _∼d∗_ [�] _r_ ( _s, a_ ) _−_ _β ·_ KL� _πβ_ _[∗]_ [(] _[· |][ s]_ [)] _[∥][π]_ [ref] [(] _[· |][ s]_ [)] �� _−_ �E( _s,a_ ) _∼dπ_      -      - _r_ ( _s, a_ ) _−_ _β ·_ KL� _π_ �( _· | s_ ) _∥π_ ref ( _· | s_ )���



= E( _s,a_ ) _∼d∗_ [ _r_ ( _s, a_ ) _−_ _r_ �( _s, a_ )]

 - ��  Term(i)



_πβ_ _[∗]_

+ E( _s,a_ ) _∼dπ_ - [ _r_ �( _s, a_ ) _−_ _r_ ( _s, a_ )] + _Vβ_ [(] _[ρ]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [)]

 - ��  -  - ��  Term(ii) Term(iii)



_._ (A.3)



Then we analyze these three terms respectively.


**Term** **(i).** Recall that the pessimistic reward _r_ defined in (4.2) takes the form

                   
_r_ �( _s, a_ ) = _ϕ_ ( _s, a_ ) _[⊤]_ _θ_ MLE _−_ _ϱ · ∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1 _[.]_


Then we can rewrite Term (i) in (A.3) as


Term(i) = E( _s,a_ ) _∼d∗_ [�] _ϕ_ ( _s, a_ ) _[⊤]_ ( _θ_ _[∗]_ _−_ _θ_ MLE) + _ϱ · ∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1�

_≤_ E( _s,a_ ) _∼d∗_ [�] _∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1 _[· ∥][θ][∗]_ _[−]_ _[θ]_ [MLE] _[∥]_ [Σ] _[D]_ [+] _[ ϱ][ · ∥][ϕ]_ [(] _[s, a]_ [)] _[∥]_ [Σ] _[−]_ _D_ [1]         
_≤_ 2 _ϱ ·_ E( _s,a_ ) _∼d∗_ [�] _∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1� _,_ (A.4)


where the first inequality is obtained by Cauchy-Schwarz inequality, and the last inequality follows from
Lemma A.1.


**Term** **(ii).** Similar to the derivation of (A.4), we have


Term(ii) = E( _s,a_ ) _∼dπ_          -          - _ϕ_ ( _s, a_ ) _[⊤]_ ( _θ_ MLE _−_ _θ_ _[∗]_ ) _−_ _ϱ · ∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1�

_≤_ E( _s,a_ ) _∼dπ_         -         - _∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1 _[· ∥][θ]_ [MLE] _[ −]_ _[θ][∗][∥]_ [Σ] _[D]_ _[−]_ _[ϱ][ · ∥][ϕ]_ [(] _[s, a]_ [)] _[∥]_ [Σ] _[−]_ _D_ [1]         
_≤_ 0 _,_ (A.5)


where the first inequality uses Cauchy-Schwarz inequality, and the last inequality is implied by Lemma A.1.


18


**Term** **(iii).** To handle this term, we introduce the following performance difference lemma for MDP with
KL constraint.


**Lemma** **A.2** (Performance Different Lemma) **.** For any reward function _r_ and policy pair ( _π, π_ _[′]_ ), it holds
that


_Vβ_ _[π]_ [(] _[ρ]_ [;] _[ r]_ [)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[ρ]_ [;] _[ r]_ [) =][ E] ( _s,a_ ) _∼d_ _[π]_ [[] _[Q][π]_ _β_ _[′]_ [(] _[s, a]_ [;] _[ r]_ [)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [;] _[ r]_ [)] _[ −]_ _[β]_ [ log] _[ π]_ [(] _[a][ |][ s]_ [)]] _[.]_


_Proof._ See Appendix A.1 for a detailed proof.


When _β_ = 0, the regularized MDP becomes the standard MDP, and Lemma A.2 reduces to the standard
performance difference lemma (Kakade and Langford, 2002). Applying Lemma A.2 to Term (iii) in (A.3),
we have


Term(iii) = E( _s,a_ ) _∼d∗_ [ _Q_ _[π]_ _β_ [�][(] _[s, a]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[s]_ [;][ �] _[r]_ [)] _[ −]_ _[β]_ [ log] _[ π]_ _β_ _[∗]_ [(] _[a][ |][ s]_ [)]]

= E( _s,a_ ) _∼d∗_ [ _β_ log � _π_ ( _a | s_ ) _−_ _β_ log _πβ_ _[∗]_ [(] _[a][ |][ s]_ [)]]

= _−β ·_ E _s∼d∗_ [�] KL� _πβ_ _[∗]_ [(] _[· |][ s]_ [)] _[∥][π]_ [�][(] _[· |][ s]_ [)] �� _,_ (A.6)


where the second equality follows from the fact that _π_ - is the optimal policy with respect to _Vβ_ _[π]_ [(] _[s]_ [;][ �] _[r]_ [)] [and]
the expression of optimal policy _π_ �( _a | s_ ) = exp _{_ ( _Q_ _[π]_ _β_ [�][(] _[s, a]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[s]_ [;][ �] _[r]_ [))] _[/β][}]_ [in] [(][3.4][),] [and] [the] [last] [equality] [is]
obtained by the definition of KL divergence.


**Finishing** **the** **Proof.** Plugging (A.4), (A.5), and (A.6) into (A.3), we obtain that


SubOpt( _π_ �) _≤_ 2 _ϱ ·_ E( _s,a_ ) _∼d∗_ [�] _∥ϕ_ ( _s, a_ ) _∥_ Σ _−D_ 1� _−_ _β ·_ E _s∼d∗_ [�] KL� _πβ_ _[∗]_ [(] _[· |][ s]_ [)] _[∥][π]_ [�][(] _[· |][ s]_ [)] �� _,_


which finishes the proof of Theorem 4.2.


**Remark** **A.3.** If we do not have access to the exact optimal policy _π_ with respect to _r_, we can use the policy

                           -                           optimization algorithms to find a near-optimal optimal policy _π_ . In such case, Term (iii) in (A.5) becomes

                         
_Vβπβ_ _[∗]_ [(] _[ρ]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [) =] _[ V]_ _βπβ_ _[∗]_ [(] _[ρ]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [) +] _[ V]_ _β_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [),] [and] [we] [need] [to] [handle] [the] [additional] [error]
term _Vβ_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [;][ �] _[r]_ [).] [This] [type] [of] [error] [analysis] [has] [been] [established] [for] [NPG] [(][Agarwal] [et] [al.][,] [2021][;]
Cen et al., 2022) and PPO (Cai et al., 2020; Wu et al., 2022; Zhong and Zhang, 2024).


**A.1** **Proof** **of** **Lemma** **A.2**


_Proof_ _of_ _Lemma_ _A.2._ Without loss of generality, we assume that the initial state is a fixed state _s_ 1 _∈S_ . For
simplicity, we also omit the dependency of _r_ in the regularized Q-function and value function. First, we have


_Vβ_ _[π]_ [(] _[s]_ [1][)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [1][) =] _[ V]_ _β_ _[π]_ [(] _[s]_ [1][)] _[ −]_ [E] _a_ 1 _∼π_ ( _· | s_ 1)� _rβ_ ( _s_ 1 _, a_ 1) + E _s_ 2 _∼P_ ( _· | s_ 1 _,a_ 1)[ _Vβ_ _[π][′]_ [(] _[s]_ [2][)]]       



- �� ( _⋆_ )



(A.7)
_,_



+ E _a_ 1 _∼π_ ( _· | s_ 1)[ _Q_ _[π]_ _β_ _[′]_ [(] _[s]_ [1] _[, a]_ [1][)]] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [1][)]

 - ��  ( _⋆⋆_ )



where we uses the equality _Q_ _[π]_ _β_ _[′]_ [(] _[s]_ [1] _[, a]_ [1][) =] _[ r][β]_ [(] _[s]_ [1] _[, a]_ [1][) +][ E] _[s]_ 2 _[∼P]_ [(] _[· |][ s]_ 1 _[,a]_ 1 [)][[] _[V]_ _β_ _[π][′]_ [(] _[s]_ [2][)]] [in] [(][3.3][)] [with] _[r][β]_ [(] _[s, a]_ [) =] _[ r]_ [(] _[s, a]_ [) +]
_β_ log _π_ ref ( _a | s_ ). By (3.3), we further have


_Vβ_ _[π]_ [(] _[s]_ [1][) =][ E] _a_ 1 _∼π_ ( _· | s_ 1) [[] _[−][β]_ [ log] _[ π]_ [(] _[a]_ [1] _[|][ s]_ [1][) +] _[ Q][π]_ _β_ [(] _[s]_ [1] _[, a]_ [1][)]]

= E _a_ 1 _∼π_ ( _· | s_ 1)� _−_ _β_ log _π_ ( _a_ 1 _| s_ 1) + _rβ_ ( _s_ 1 _, a_ 1) + E _s_ 2 _∼P_ ( _· | s_ 1 _,a_ 1)[ _Vβ_ _[π]_ [(] _[s]_ [2][)]]          - _._


Plugging this into Term ( _⋆_ ) of (A.7), we have


( _⋆_ ) = E _a_ 1 _∼π_ ( _· | s_ 1)� _−_ _β_ log _π_ ( _a_ 1 _| s_ 1) + E _s_ 2 _∼P_ ( _· | s_ 1 _,a_ 1)[ _Vβ_ _[π]_ [(] _[s]_ [2][)]]   - _−_ E _a_ 1 _∼π_ ( _· | s_ 1)�E _s_ 2 _∼P_ ( _· | s_ 1 _,a_ 1)[ _Vβ_ _[π][′]_ [(] _[s]_ [2][)]]   
= E _a_ 1 _∼π_ ( _· | s_ 1)[ _−β_ log _π_ ( _a_ 1 _| s_ 1)] + E _s_ 2 _∼d_ _[π]_ 2 [[] _[V]_ _β_ _[π]_ [(] _[s]_ [2][)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [2][)]] _[,]_ (A.8)


19


where we use _d_ _[π]_ _h_ [(] _[s]_ [)] [to] [denote] [the] [visitation] [measure] [at] [the] _[h][−]_ [th] [step.] [Meanwhile,] [we] [rewrite] [(] _[⋆⋆]_ [)] [in] [(][A.7][)]
as

( _⋆⋆_ ) = E _a_ 1 _∼π_ ( _· | s_ 1)[ _Q_ _[π]_ _β_ _[′]_ [(] _[s]_ [1] _[, a]_ [1][)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [1][)]] _[.]_ (A.9)


Plugging (A.8) and (A.9) into (A.7), we have


_Vβ_ _[π]_ [(] _[s]_ [1][)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [1][) =][ E] _[s]_ 2 _[∼][d][π]_ 2 [[] _[V]_ _β_ _[π]_ [(] _[s]_ [2][)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [2][)] +][ E] ( _s_ 1 _,a_ 1) _∼d_ _[π]_ 1 [[] _[Q]_ _β_ _[π][′]_ [(] _[s]_ [1] _[, a]_ [1][)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [1][)] _[ −]_ _[β]_ [ log] _[ π]_ [(] _[a]_ [1] _[|][ s]_ [1][)]]

= _· · ·_



=



_∞_


E( _sh,ah_ ) _∼d_ _[π]_ _h_ [[] _[Q]_ _β_ _[π][′]_ [(] _[s][h][, a][h]_ [)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s][h]_ [)] _[ −]_ _[β]_ [ log] _[ π]_ [(] _[a][h]_ _[|][ s][h]_ [)]]
_h_ =1



= E( _s,a_ ) _∼dπ_ [ _Q_ _[π]_ _β_ _[′]_ [(] _[s, a]_ [)] _[ −]_ _[V]_ _β_ _[π][′]_ [(] _[s]_ [)] _[ −]_ _[β]_ [ log] _[ π]_ [(] _[a][ |][ s]_ [)]] _[,]_


where we use E( _sh,ah_ ) _∼d_ _[π]_ _h_ [to denote][ E] _[s][h][∼][d]_ _h_ _[π][,a][h][∼][π]_ [(] _[· |][ s][h]_ [)][ and the definition of] _[ d][π]_ [in (][A.1][).] [Therefore, we conclude]
the proof of Lemma A.2.

### **B Variants of Reinforced Token Optimization**


Different from Algorithm 1 where the learner constructs a pessimistic reward estimation and then outputs
its corresponding optimal policy. Indeed, we can also perform pessimistic planning with respect to the value
function to find the near-optimal policy:

_π_       - = argmax _π_ min _θ∈_ Θ �(E( _s,a_ ) _∼dπ_ [ _ϕ_ ( _s, a_ )]) _[⊤]_ _θ −_ _β ·_ E _s∼dπ_ [�] KL� _π_ ( _· | s_ ) _∥π_ ref ( _· | s_ )��� _,_ (B.1)


where Θ = _{∥θ∥_ 2 _≤_ _B_ : _∥θ −_ _θ_ MLE _∥_ Σ _D_ _≤_ _ϱ}_ and _θ_ MLE is given in (4.1). Here _ϱ_ is the problem-dependent
constant in (A.2) and Σ _D_ = [�] ( _τ_ [1] _,τ_ [2] ) _∈D_ [[][�] _[H]_ _h_ =1 [(] _[ϕ]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [)] _[ −]_ _[ϕ]_ [(] _[s]_ [2] _h_ _[, a]_ [2] _h_ [))(][�] _[H]_ _h_ =1 [(] _[ϕ]_ [(] _[s]_ _h_ [1] _[, a]_ [1] _h_ [)] _[ −]_ _[ϕ]_ [(] _[s]_ [2] _h_ _[, a]_ [2] _h_ [)))] _[⊤]_ [] +] _[ λI][d]_ [is]
the covariance matrix. For policy _π_ in (B.1), we have the following theoretical guarantee.

              


_√_
**Theorem** **B.1.** Suppose Assumption 4.1 holds. For _β_ _>_ 0, _λ_ _>_ 0, _δ_ _∈_ (0 _,_ 1), if we choose _ϱ_ = _O_ (

[�]



**Theorem** **B.1.** Suppose Assumption 4.1 holds. For _β_ _>_ 0, _λ_ _>_ 0, _δ_ _∈_ (0 _,_ 1), if we choose _ϱ_ = _O_ ( _d_ ) (see

[�]

(A.2)), then the output policy _π_ of (B.1) satisfies

            
SubOpt( _π_ �) _≤_ 2 _ϱ · ∥_ E( _s,a_ ) _∼d∗_ [ _ϕ_ ( _s, a_ )] _∥_ Σ _−D_ 1 _[.]_


_Proof_ _of_ _Theorem_ _B.1._ For ease of presentation, we define


_V_       - _β_ _[π]_ [(] _[ρ]_ [) = min] �(E( _s,a_ ) _∼dπ_ [ _ϕ_ ( _s, a_ )]) _[⊤]_ _θ −_ _β ·_ E _s∼dπ_ [�] KL� _π_ ( _· | s_ ) _∥π_ ref ( _· | s_ )��� _._
_θ∈_ Θ


By Lemma A.1, we know that _θ_ _[∗]_ _∈_ Θ with probability 1 _−_ _δ_ . This implies that


_V_       - _β_ _[π]_ [�][(] _[ρ]_ [)] _[ ≤]_ [(][E] ( _s,a_ ) _∼d_ _[π]_ [�] [[] _[ϕ]_ [(] _[s, a]_ [)])] _[⊤][θ][∗]_ _[−]_ _[β][ ·]_ [ E] _s∼d_ _[π]_ [�] �KL� _π_ �( _· | s_ ) _∥π_ ref ( _· | s_ )�� = _Vβ_ _[π]_ [�][(] _[ρ]_ [)] _[.]_ (B.2)


Meanwhile, by (B.1), we have

_V_                  - _βπβ_ _[∗]_ [(] _[ρ]_ [)] _[ ≤]_ _[V]_ [�] _β_ _[π]_ [�][(] _[ρ]_ [)] _[.]_ (B.3)


Combining (B.2) and (B.3), we obtain

_V_                  - _βπβ_ _[∗]_ [(] _[ρ]_ [)] _[ ≤]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [)] _[.]_


Plugging this into the definition of the suboptimality gap in (3.5), we have

SubOpt( _π_ �) = _Vβ_ _[∗]_ [(] _[ρ]_ [)] _[ −]_ _[V]_ _β_ _[π]_ [�][(] _[ρ]_ [)] _[ ≤]_ _[V]_ _β_ _[∗]_ [(] _[ρ]_ [)] _[ −]_ _[V]_ [�] _βπβ_ _[∗]_ [(] _[ρ]_ [)]


Now we introduce the notation of _θ_ :

[�]



_θ_ - = argmin
_θ∈_ Θ



�(E( _s,a_ ) _∼d∗_ [ _ϕ_ ( _s, a_ )]) _[⊤]_ _θ −_ _β ·_ E _s∼d∗_ [�] KL� _πβ_ _[∗]_ [(] _[· |][ s]_ [)] _[∥][π]_ [ref] [(] _[· |][ s]_ [)] ��� _._


20


Under this notation, we further obtain that


SubOpt( _π_ �) _≤_ E( _s,a_ ) _∼d∗_ [( _θ_ _[∗]_ _−_ _θ_ [�] ) _[⊤]_ _ϕ_ ( _s, a_ )]

= E( _s,a_ ) _∼d∗_ [( _θ_ _[∗]_ _−_ _θ_ MLE) _[⊤]_ _ϕ_ ( _s, a_ )] + E( _s,a_ ) _∼d∗_ [( _θ_ MLE _−_ _θ_ [�] ) _[⊤]_ _ϕ_ ( _s, a_ )]

_≤_         - _∥θ_ MLE _−_ _θ_ _[∗]_ _∥_ Σ _D_ + _∥θ_ MLE _−_ _θ_ [�] _∥_ Σ _D_         - _· ∥_ E( _s,a_ ) _∼d∗_ [ _ϕ_ ( _s, a_ )] _∥_ Σ _−D_ 1
_≤_ 2 _ϱ · ∥_ E( _s,a_ ) _∼d∗_ [ _ϕ_ ( _s, a_ )] _∥_ Σ _−D_ 1 _[,]_


where the second inequality uses Cauchy-Schwarz inequality, and the last inequality is obtained by Lemma A.1.
Therefore, we conclude the proof of Theorem B.1.


**Remark** **B.2** (Extension to Unknown Transitions) **.** In (B.1), we assume that the transition kernel is known
so that we can compute the state distribution _d_ _[π]_ induced by the policy _π_ . Although this is natural in LLMs,
we briefly sketch the extension to the unknown transition setting. Following Zhan et al. (2023a), which is
inspired by previous works on standard reward-based RL theory (Uehara and Sun, 2021; Liu et al., 2022;
Zhong et al., 2022; Liu et al., 2023; Huang et al., 2024), we can also construct a confidence set for the
transition kernel




 

( _τ_ [1] _,τ_ [2] ) _∈D_




  Θ _P_ = _P_ : 

( _τ_ [1] _,τ_ [2] ) _∈D_



2

- log _P_ ( _τ_ _[i]_ ) _≥_ max

_i_ =1 _P_ 


2 
- log _P_ ( _τ_ _[i]_ ) _−_ _ζ_ _,_

[�]
_i_ =1



where _P_ ( _τ_ ) is the probability of observing the trajectory _τ_ under the transition _P_ and _ζ_ is a tuning parameter.
With a proper choice of _ζ_, one can also show that _P_ _∈_ Θ _P_ with high probability. Then we can perform the
following pessimistic planning



_π_ = argmax min

- _π_ _θ∈_ Θ _,P ∈_ Θ _P_



�(E( _s,a_ ) _∼d_ _[π]_ _P_ [[] _[ϕ]_ [(] _[s, a]_ [)])] _[⊤][θ][ −]_ _[β][ ·]_ [ E] _[s][∼][d]_ _P_ _[π]_ �KL� _π_ ( _· | s_ ) _∥π_ ref ( _· | s_ )�� [�] _,_



where _d_ _[π]_ _P_ [denotes] [the] [state] [distribution] [induced] [by] [policy] _[π]_ [under] [the] [environment] _[P]_ [.] Combining the
analysis of Theorem B.1 and previous work on offline RL (Uehara and Sun, 2021; Zhan et al., 2023a), we
can also establish a similar result to Theorem B.1, but with an additional estimation error for the transition
kernel part. As this part is standard and not the focus of our work, we omit it for simplicity.

### **C Additional Discussions**


**C.1** **Direct** **Preference** **Optimization**


Direct Preference Optimization (DPO) is a representative algorithm of the direct preference learning algorithm (Rafailov et al., 2023; Zhao et al., 2023; Azar et al., 2023; Tang et al., 2024). From a high level,
these type of algorithms aim to skip the reward modeling and learn directly from the preference data, hence
the name direct preference learning. In this section, we introduce the mathematical principle of DPO for
completeness.
We first recall that in the original two-staged learning paradigm, we aim to optimize the following KLregularized target:




_,_ (C.1)



_π_ - = argmax E _x∼ρ,y∼π_ ( _·|x_ )
_π_




_r_ MLE( _x, y_ ) _−_ _β_ log _[π]_ [(] _[y][ |][ x]_ [)]

_π_ ref ( _y | x_ )



where _r_ MLE is the MLE of the BT model on the offline preference dataset _D_ obtained via



_r_ MLE = argmax
_r_




 - log _σ_ - _r_ ( _x, y_ _[w]_ ) _−_ _r_ ( _x, y_ _[l]_ )� _._ (C.2)


( _x,y_ _[w]_ _,y_ _[l]_ ) _∈D_



One notable feature of this KL-constrained optimization problem is that it admits a closed-form solution, as
summarized in the following lemma.


21


**Lemma** **C.1** (Solution of KL-regularized Optimization (Proposition 7.16 and Theorem 15.3 of Zhang
(2023))) **.** Given a loss functional with respect to _π_ ( _· | x_ ), written as




     E _y∼π_ ( _· | x_ ) _−_ _r_ ( _x, y_ ) _−_ _β_ log _[π]_ _π_ [ref] ( _y_ [(] _|_ _[y]_ _x_ _[ |][ x]_ ) [)]




- - - 1 ��
= _β ·_ KL _π_ ( _y | x_ ) _π_ ref ( _y | x_ ) exp _,_
��� _β_ _[r]_ [(] _[x, y]_ [)]



the minimizer of the loss functional is _πr_ ( _y | x_ ) _∝_ _π_ ref ( _y | x_ ) exp - _β_ 1 _[r]_ [(] _[x, y]_ [)] �, also known as Gibbs distribution.


Therefore, for any fixed reward function _r_, it leads to a closed-form policy:


1                     - 1                     _πr_ ( _y | x_ ) = _,_
_Z_ ( _x_ ) _[π]_ [ref] [(] _[y][ |][ x]_ [) exp] _β_ _[r]_ [(] _[x, y]_ [)]



_y_ _[′][ π]_ [ref] [(] _[y][′][ |][ x]_ [) exp(] _β_ [1]



where _Z_ ( _x_ ) = [�]



_β_ [1] _[r]_ [(] _[x, y][′]_ [))] [is] [the] [normalization] [constant.] [Then,] [we] [can] [solve] [the] [reward] [as]



_r_ ( _x, y_ ) = _β_ log _[π][r]_ [(] _[y][ |][ x]_ [)] (C.3)

_π_ ref ( _y | x_ ) [+] _[ β]_ [ log] _[ Z]_ [(] _[x]_ [)] _[.]_



We can plug (C.3) into (C.2) to get




_[π][r]_ [(] _[y][w][ |][ x]_ [)] _[π][r]_ [(] _[y][l][ |][ x]_ [)]

_π_ ref ( _y_ _[w]_ _| x_ ) _[−]_ _[β]_ [ log] _π_ ref ( _y_ _[l]_ _| x_ )



_π_ ref ( _y_ _[l]_ _| x_ )



_π_ = argmax

_πr_




     
 - log _σ_ _β_ log _[π][r]_ [(] _[y][w][ |][ x]_ [)]

_π_ ref ( _y_ _[w]_ _| x_

( _x,y_ _[w]_ _,y_ _[l]_ ) _∈D_








_._ (C.4)



Clearly, if _r_ is the solution of (C.2), the _πr_ is the solution of (C.4). On the other hand, if _π_ is optimal for
the DPO target in (C.4), then, the induced implicit reward _β_ log _ππ_ ref( _y_ ( _|y x | x_ ) ) [is] [optimal] [for] [(][C.2][).]
Interestingly, while the DPO is derived from the sentence-level reward function and BT model, the implicit
reward naturally gives a token-wise characterization of the prompt-response pair and can be leveraged as a
dense reward signal for the PPO training.


**C.2** **Autoregressive** **Policy**


For the policy defined in a contextual dueling bandit setting, it maps from a prompt to a complete sentence.
For ease of presentation, we call this type of policy the _predetermined_ _policy_ since it determines the entire
sentence regardless of the generation process. In contrast, the Markov policy defined in the MDP formulation
generates responses autoregressively: it considers not only the prompt but also the tokens generated so far.
By definition, the Markov policy is at least as good as the policy that determines the whole sentence based
solely on the prompt. In deterministic MDPs, the optimal action sequence is predetermined given the initial
state, which demonstrates the equivalence of these two types of policies. However, for stochastic MDPs, the
Markov policy is strictly more expressive than the predetermined policy. The transition can be stochastic for
various reasons. For example, if the LLM uses an external search engine, the next state _sh_ +1 depends not
only on the current tokens ( _x, y_ 1: _h_ ) but also on the text generated by the external search engine _π_ _[′]_ ( _· | x, y_ 1: _h_ ),
making it stochastic. Moreover, RLHF may have applications in other scenarios, such as robotics (Christiano
et al., 2017), where the transition kernel is stochastic. To clarify, we distinguish these two types of policies
in the following proposition.


**Proposition** **C.2.** There exists an MDP such that the value of any predetermined policy is at least 0 _._ 5 less
than that of optimal Markov/autoregressive policy.


_Proof._ We construct an MDP _M_ with state space _S_ = _{s_ 0 _, s_ 1 _, s_ 2 _}_, action space _A_ = _{a_ 1 _, a_ 2 _}_, horizon _H_ = 2,
fixed initial state _s_ 0. The reward _r_ and transition kernel _P_ are given by


_r_ ( _si, aj_ ) = 1 _{i_ = _j},_ _P_ ( _s_ 1 _| s_ 0 _, aj_ ) = _P_ ( _s_ 2 _| s_ 0 _, aj_ ) = 0 _._ 5 _,_ _∀_ ( _i, j_ ) _∈{_ 0 _,_ 1 _,_ 2 _} × {_ 1 _,_ 2 _}._


It is straightforward to see that the optimal autoregressive policy achieves a value of 1. In contrast, any
predetermined policy only achieves a value of 0 _._ 5. This completes the proof.


22


### **D Implementation Details**

**Training** **Pipeline** Our experiments start with an open-source SFT model [OpenRLHF/Llama-3-8b-sft-](https://huggingface.co/OpenRLHF/Llama-3-8b-sft-mixture)
[mixture.](https://huggingface.co/OpenRLHF/Llama-3-8b-sft-mixture) For baseline PPO, we first train a reward model from this SFT model, then use it as both the
reward function and the initialization of critic, following the standard practice. For other baselines, we
directly train from this SFT model. For RTO, we also train an 1B reward model, initialized with [Llama-3.2-](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct)
[1B-Instruct.](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) Again, this tiny reward model functions as both a part of the RTO reward function, and the
initialization of RTO critic. All preference learning uses a [binarized](https://huggingface.co/datasets/HuggingFaceH4/ultrafeedback_binarized) version of the UltraFeedback dataset,
while all reinforcement learning uses a [prompt-only](https://huggingface.co/datasets/weqweasdas/ultra_train) version.


**Training** **hyperparameters** We use Adam optimizer (Kingma, 2014) across all experiments with varying
learning rates, (0 _._ 9 _,_ 0 _._ 95) betas and no weight decay. We apply a cosine learning rate schedule with 3%
warming steps and 10% minimum learning rate. All experiments use a single epoch, since we do not observe
much gains from further training. Additionally, we set the max sequence length to 2048. We include all other
method-specific hyperparameters in the tables below.


**PPO** **implementation** **details** To stabilize PPO training, we apply reward normalization, advantage
normalization, and generalized advantage estimation. We use larger learning rate for critic, and use a similar
clipped surrogate objective for critic learning. These tricks are implemented by the [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) (Hu et al.,
2024) repo.



**Reward** **Model** (UltraFeedback)


Learning Rate 1e-6
Batch Size 128
Maximum Sequence Length 2048


**PPO** (UltraFeedback)


Actor Learning Rate 8e-7
Critic Learning Rate 9e-6
Batch Size 128
Maximum Prompt Length 1024
Maximum Response Length 1024
PPO Update Step 8
PPO Clip Coefficient _ϵ_ 0.2
GAE _λ_ 0.95
KL Coefficient ( _β_ ) 0.01



**DPO** (UltraFeedback)


Learning Rate 5e-7
Batch Size 256
Maximum Sequence Length 2048
KL Coefficient ( _β_ ) 0.1


**RTO** (UltraFeedback)


Actor Learning Rate 5e-7
Critic Learning Rate 9e-6
Batch Size 128
Maximum Prompt Length 1024
Maximum Response Length 1024
PPO Update Step 8
PPO Clip Coefficient _ϵ_ 0.2
GAE _λ_ 0.95
DPO Reward Rescale ( _β_ 1) 0.05
KL Coefficient ( _β_ 2) 0.01
Reward Rescale ( _β_ 3) 1



**Benchmark** **decoding** **hyperparameters** For AlpacaEval 2, we sample with temperature 0.7 and max
generation length 4096. For Arena-Hard, we use the default greedy decoding. Both settings apply for all
methods.


**Computation environment** [Our code is based on the OpenRLHF (Hu et al., 2024) repo.](https://github.com/OpenRLHF/OpenRLHF) Our experiments
is conducted on 8 80G A100 GPUs. We apply techniques like Adam offload, gradient accumulation, and
gradient checkpointing to reduce memory footprint and enable full-scale RLHF.


23


**Baselines** (UltraFeedback)


Learning Rate 5e-7
Batch Size 256
Maximum Sequence Length 2048
R-DPO KL Coefficient ( _β_ ) 0.1
R-DPO Length Penalty ( _α_ ) 0.001
SimPO Scale ( _β_ ) 2.5
SimPO Margin ( _γ_ ) 0.5
TDPO KL Coefficient ( _β_ ) 0.1
TDPO KL Penalty Rescale ( _α_ ) 0.2


**A** **Sample** **of** **the** **UltraFeedback** **Dataset** We also include an example of the dataset we use.
**Prompt:**


Which animal has two hands, a hyrax or a dog?


**Chosen** **response:** Neither a hyrax nor a dog has hands. Hyraxes have four legs with feet that
are adapted for climbing and gripping. Similarly, dogs also have four legs with paws. The term
”hands” is usually reserved for primates, such as humans, which have opposable thumbs and
fingers.


**Rejected** **response:** Thank you for your question. I’m happy to help you with that! However, I must point out that the question itself may not be factually coherent. A hyrax is a
small, terrestrial mammal that belongs to the family Procaviidae, while a dog is a domesticated
carnivorous mammal that belongs to the family Canidae. Neither of these animals have two hands.


Instead, I suggest rephrasing the question to ensure it is factually accurate. For example,
”Which animal has four legs, a hyrax or a dog?” would be a more appropriate and factual
question.


Please let me know if there’s anything else I can assist you with!

### **E Additional Experiments on REINFORCE-type Algorithm**


Our proposed dense reward demonstrates broad applicability beyond PPO and functions independently of
the specific reinforcement learning algorithm used in RLHF. To demonstrate this versatility, we evaluated
RTO with an alternative REINFORCE-type algorithm (Williams, 1992), specifically REINFORCE++ (RPP;
Hu, 2025). Unlike PPO, RPP does not use a critic network and relies solely on vanilla discounted returns
without any value baseline. We include our hyperparameter selections below.


Method
Metric

SFT DPO PPO RTO (PPO) RPP RTO (RPP)


AE (LC) 13.22 17.40 19.47 **27.00** 18.28 24.71
AE (WR) 8.58 12.23 12.89 22.45 13.91 **23.11**
AH (SC) 9.2 13.2 16.2 **20.3** 13.4 18.8
AH (WR) 8.9 13.8 15.6 21.4 15.4 **21.8**


Table 2: AlpacaEval 2 ( **AE** ) and Arena-Hard ( **AH** ) results.

As shown in Table 2, we observe that: (a) the idea of using token-wise reward in RTO remains highly
effective when applied to RPP, supporting our claim; and (b) RPP performs worse than PPO, especially in
complex scenarios, potentially due to the critic in PPO capturing fine-grained information that aids learning.


24


**RPP**


Actor Learning Rate 5e-7
Batch Size 128
Maximum Prompt Length 1024
Maximum Response Length 1024
PPO Update Step 8
PPO Clip Coefficient _ϵ_ 0.2
GAE _λ_ 0.95
KL Coefficient ( _β_ ) 0.01



**RTO** **(RPP)**


Actor Learning Rate 5e-7
Batch Size 128
Maximum Prompt Length 1024
Maximum Response Length 1024
PPO Update Step 8
PPO Clip Coefficient _ϵ_ 0.2
GAE _λ_ 0.95
DPO Reward Rescale ( _β_ 1) 0.05
KL Coefficient ( _β_ 2) 0.01
Reward Rescale ( _β_ 3) 1



|Win Rate|RTO DPO SFT PPO DPPO|
|---|---|
|RTO<br>DPO<br>SFT<br>PPO<br>DPPO|0.50<br>**0.61**<br>**0.67**<br>**0.67**<br>**0.67**<br>**0.39**<br>0.50<br>0.58<br>0.59<br>0.50<br>**0.33**<br>0.42<br>0.50<br>0.59<br>0.49<br>**0.33**<br>0.41<br>0.41<br>0.50<br>0.40<br>**0.33**<br>0.50<br>0.51<br>0.60<br>0.50|


Table 3: Win rates between each pair of models evaluated by GPT-4. The value in line _i_ column _j_ represents
the win rate of the model in row _i_ against the model in column _j_ .

### **F Additional Experiments on Summarization Task**


**F.1** **Experimental** **Setup**


**Tasks** **and** **Data.** We consider the **Summarization** task (V¨olske et al., 2017), where the model is required to generate a concise summary for a given post from the Reddit forum. Specifically, we fine-tune
the foundational model using the Reddit TL;DR summarization dataset (V¨olske et al., 2017), where each
data point comprises a post _x_ and its corresponding summary _y_ . Subsequently, we align the model with
human preferences using its [preference](https://huggingface.co/datasets/openai/summarize_from_feedback) version, where each data point comprises a post and two summaries,
with preferences annotated by humans. To facilitate readers, we provide examples of the TL;DR datasets in
Appendix F.2. We employ the open-sourced Pythia-2.8B model (Biderman et al., 2023) as the backbone for
this task.


**Evaluation.** We primarily assess the alignment performance of various methods using GPT-4. The GPT-4
evaluation harnesses the capabilities of GPT-4 itself and has been shown to align well with human evaluations
(Rafailov et al., 2023). For the same prompt, we provide GPT-4 with two responses generated by two different
models and ask it to determine which one is superior. We then calculate the win rates, following Rafailov
et al. (2023). The prompts for GPT-4 evaluation are presented in Appendix F.4. For each GPT-4 evaluation,
we use 100 samples.


**Win** **Rates.** Table 3 presents the performance of our method on the TL;DR dataset. We can see that the
model trained by `RTO` outperforms all other baselines. Specifically, we achieve a win rate of 61% over the DPO
algorithm evaluated by GPT-4. This illustrates the effectiveness of the `RTO` algorithm in a real-world text
summarization task. All these empirical findings demonstrate the token-wise reward mechanism’s advantage
in improving model performance.


**Ablation** **Studies** **on** **Temperatures.** We further compare the model trained by `RTO` to other baselines
on both datasets across different temperatures. In Figure 5, we present the results for these methods as we
vary the temperature. We can observe that the `RTO` model consistently demonstrates superior performance
compared to other baselines, highlighting its robustness across different temperatures.


25


0.50


0.45


0.40


0.35


0.30


0.25



Summarization Win Rate v.s. RTO


0.0 0.2 0.4 0.6 0.8 1.0
Temperature



Figure 5: Win rates of RTO across different sampling temperatures



0.4


0.2


0.0


0.2


0.4



0 50 100 150 200
Iterations



Figure 6: The reward curve of DPPO and RTO during training. The reward is given by the implicit reward
model _β_ log _[π]_ _π_ [dpo] ref ( [(] _y_ _[y]_ _|_ _[ |]_ _x_ _[ x]_ ) [)] [optimized] [by] [DPO.] [The] [x-axis] [represents] [the] [training] [steps,] [and] [the] [y-axis] [represents]

the reward values.


**Optimization** **Process** **Curves.** To further investigate the benefits of the token-wise reward mechanism
in the optimization process, we compare the estimated reward during the training period in Figure 6. In this
figure, the x-axis represents the training iterations. The y-axis represents the reward given by the implicit
reward model derived from the DPO model (the reward model used in training) per batch. As we can see, in
one epoch (roughly corresponds to 240 PPO training iterations in Figure 6), the reward of the model trained
by `RTO` on TL;DR can achieve about 0 _._ 4, while the reward of the model trained by DPPO is roughly _−_ 0 _._ 2.
The results demonstrate that the token-wise reward mechanism significantly enhances the training process,
leading to a remarkably higher reward.


26


**F.2** **Examples** **of** **Datasets**


**Prompt:**


SUBREDDIT: r/AskReddit
TITLE: Reddit, what event drove you to cry in the bathroom at work?
POST: Yesterday, I finally became that girl who goes into the bathroom to cry while at work.


I work at a domestic violence shelter, and normally I’m pretty capable of brushing things
off. I’m somewhat ashamed to say that it was not secondhand truama that led me to weep in
the bathroom stall like a little girl, but my coworkers. It had been a rough day, which are pretty
normal around here, but it was a tolerable level of rougness. My patience was wearing thin and I
just wanted to go to the support group for advocates and take a breather.


Unfortunately, my coworker decided at that time to demand that I clean one of the recently
vacated rooms. Not just clean it, but DEEP clean it. I’m not talking clean-it-like-your-parentsare-coming-home-after-a-weekend-away type clean. I mean, she wanted it hospital-grade clean.
She wanted to be able to perform surgery on any surface of that room. The checklist she gave
me- handwritten of course- had at least thirty tasks on it. For a dorm-sized room.


I lost it, guys. I just completely lost my shit. I told her that I would be happy to help
clean that room, but she was absolutely off her rocker if she thought I was going to spend the
next four hours cleaning by myself. She was incensed at my apparent refusal, and though I tried
to reiterate that I would do it, but not alone, she started screaming for the lead advocate to put
me in my place.


Well, the lead advocate just didn’t want to deal with the situation and told me to just do
it. I was absolutely frustrated, appalled, and overwhelmed. And so...I went into the bathroom
and cried. Then I went and cleaned the stupid room.
TL;DR:


**Chosen** **response:** I was stressed, my lazy coworker demanded I clean every speck of dust from
a room alone, I lost my shit, my supervisor sided with my coworker.


**Rejected** **response:** Coworker thinks it’s okay to ask me to clean a room she thinks is a
dumpster, so I cried. Then I cleaned it.


**F.3** **Training** **Configurations** **of** **TL;DR**


We provide the training configuration of SFT, DPO, PPO, DPPO, and RTO below. In the table of the
training configuration of the standard PPO algorithm, we also present the configuration of training the
reward model used in the PPO algorithm.



**SFT** (TL;DR)


Optimizer AdamW
Learning Rate 1e-5
Batch Size 32
Epochs 1


Table 4: Configurations for supervise fine-tuning.



**DPO** (TL;DR)


Optimizer AdamW
Learning Rate 5e-6
KL Coefficient ( _β_ ) 0.1
Batch Size 32
Epochs 1


Table 5: Configurations for DPO.



27


**PPO** (TL;DR)


Optimizer (PPO) Adam
Optimizer (Reward Model) AdamW
Mini Batch Size in PPO 16
Init KL Coefficient ( _β_ ) 0.03
Learning Rate (PPO) 3e-6
Learning Rate (Reward Model) 3e-6
Batch Size Per PPO Iteration 256
Epochs of PPO Update Per Iteration 2
Batch Size (Reward Model) 128
Training Epochs (PPO and Reward Model) 1
Maximum Sequence Length 512


Table 6: Configurations for standard PPO. We also present
the configuration of training the reward model used in the
PPO algorithm in this table.


**F.4** **Evaluation** **Details**



**RTO** **and** **DPPO** (TL;DR)


Optimizer Adam
Learning Rate 3e-6
Training Epochs 1
Mini Batch Size in PPO 16
DPO KL Coefficient _β_ 1 0.1
Init KL Coefficient _β_ 2 (RTO) 0.05
Init KL Coefficient _β_ 2 (DPPO) 0.05
Batch Size Per PPO Iteration 256
Maximum Sequence Length 512
Epochs of PPO Update Per Iteration 2


Table 7: Configurations for RTO and DPPO.



Following the previous work (Rafailov et al., 2023), for evaluations utilizing GPT-4, completions are sampled
by top- _p_ sampling method with temperature of _τ_ = 0 _._ 9 and _p_ = 0 _._ 99 for 100 prompts. To mitigate any
positional bias inherent in GPT-4’s responses, we ensure that the order of completions within each pair is
randomized. The version of the GPT-4 we used is GPT-4-0613, and the specific prompt utilized for GPT-4
evaluation is detailed as follows.


**Prompt** **for** **GPT-4** **evaluation** **in** **summarization** **task.**


Which of the following summaries does a better job of summarizing the most important points in the
given forum post, without including unimportant or irrelevant details? A good summary is both precise
and concise.
Post: `<the` `forum` `post>`
Summary A: `<either` `the` `test` `method` `or` `baseline>`
Summary B: `<the` `other` `summarization>`
FIRST provide a one-sentence comparison of the two summaries, explaining which you prefer and why.
SECOND, on a new line, state only ”A” or ”B” to indicate your choice. Your response should use the
format:
Comparison: `<one-sentence` `comparison` `and` `explanation>`
Comparison:
Preferred: `<"A"` `or` `"B">`


Table 8: Prompt for GPT-4 evaluation in summarization task.


28


