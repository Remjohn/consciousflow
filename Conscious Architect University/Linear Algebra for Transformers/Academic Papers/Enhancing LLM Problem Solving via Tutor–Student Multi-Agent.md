## **Enhancing LLM Problem Solving via Tutor–Student Multi-Agent** **Interaction**

Nurullah Eymen Ozdemir [¨] [1] and Erhan Oztop [1] _[,]_ [2]



_**Abstract**_ **— Human** **cognitive** **development** **is** **shaped** **not** **only**
**by** **individual** **effort** **but** **by** **structured** **social** **interaction,** **where**
**role-based** **exchanges** **such** **as** **those** **between** **a** **tutor** **and** **a**
**learner,** **enable** **solutions** **that** **neither** **could** **achieve** **alone.**
**Inspired** **by** **these** **developmental** **principles,** **we** **ask** **the** **ques-**
**tion** **whether** **a** **tutor-student** **multi-agent** **system** **can** **create** **a**
**synergistic** **effect** **by** **pushing** **Large** **Language** **Model** **(LLM)**
**beyond** **what** **it** **can** **do** **within** **existing** **frameworks.** **To** **test** **the**
**idea,** **we** **adopt** **autonomous** **coding** **problem** **domain** **where** **two**
**agents** **instantiated** **from** **the** **same** **LLM** **assigned** **asymmetric**
**roles: a student agent generates and iteratively refines solutions,**
**while** **a** **tutor** **agent** **provides** **structured** **evaluative** **feedback**
**without** **access** **to** **ground-truth** **answers.** **In** **our** **proposed**
**framework (PETITE), we aim to extract better problem-solving**
**performance** **from** **one** **model** **by** **structuring** **its** **interaction**
**through** **complementary** **roles,** **rather** **than** **relying** **on** **stronger**
**supervisory** **models** **or** **heterogeneous** **ensembles.** **Our** **model**
**is** **evaluated** **on** **the** **APPS** **coding** **benchmark** **against** **state-**
**of-the-art** **approaches** **of** **Self-Consistency,** **Self-Refine,** **Multi-**
**Agent** **Debate,** **and** **Multi-Agent** **Review.** **The** **results** **show**
**that** **our** **model** **achieves** **similar** **or** **higher** **accuracy** **while**
**consuming** **significantly** **fewer** **tokens.** **These** **results** **suggest**
**that** **developmentally** **grounded** **role-differentiated** **interaction**
**structures provide a principled and resource-efficient paradigm**
**for** **enhancing** **LLM** **problem-solving** **through** **structured** **peer-**
**like** **interactions.**
_**Index**_ _**Terms—**_ **Peer** **Tutoring,** **Scaffolding,** **Large** **Language**
**Models,** **Multi-Agent** **Systems,** **Code** **Generation**


I. INTRODUCTION


A central principle of developmental science is that cognitive growth does not occur in isolation, but emerges
through structured social interaction [1], [2]. The concept
of the zone of proximal development (ZPD) [1] captures
this idea by positing that learners can exceed their independent capabilities when supported by appropriate guidance

[3]. While the concept is typically framed in terms of a
more knowledgeable other, peer tutoring research shows
that structured role differentiation among similarly skilled
learners can also produce significant learning gains, even
in the absence of capability asymmetry [6]. This effect
can be understood through role specialization: adopting an
evaluative role promotes analytical reasoning, which in turn
supports more effective solution generation. More generally,
one-on-one tutoring is widely recognized as one of the


This work is under review for conference appearance.
1Nurullah Eymen ¨Ozdemir and Erhan Oztop is with Ozyegin
University, Istanbul, Turkiye eymen.ozdemir@ozu.edu.tr,
erhan.oztop@ozyegin.edu.tr
2Erhan Oztop is also affiliated affiliated with Symbiotic Intelligent Systems Research Center, Institute for Open and Transdisciplinary, Research Initiatives, The University of Osaka, Japan.
erhan.oztop@otri.osaka-u.ac.jp



most effective instructional formats [4], largely due to the
availability of continuous, structured feedback during interaction, which improves learning regardless of whether it is
provided by a more knowledgeable tutor or a peer [5]. Taken
together, these studies suggest that guided interaction, role
differentiation, and continuous evaluation are key concepts
of human learning and development.
These developmental principles have inspired a growing
body of work in artificial intelligence and machine learning. Developmental robotics [8], [9] explores how artificial
agents can acquire human-like learning behaviors through
sensorimotor and social interaction. Similarly, cognitive apprenticeship frameworks [7] have shaped the design of AI
tutoring systems that make expert reasoning explicit to
support learning. Despite these connections, recent advances
in Large Language Model (LLM) multi-agent systems have
yet to incorporate principles from developmental learning,
leaving the potential benefits of structuring interaction design
based on human cognitive development largely unexplored.
To investigate whether developmentally inspired interaction structures can improve LLM performance, we instantiate
the approach in the context of autonomous code generation.
We design a multi-agent setup in which two agents assume
complementary roles: a student that generates and iteratively
refines solutions, and a tutor that evaluates and provides
guidance. This setup enables controlled analysis of how role
differentiation and iterative feedback influence performance
within an LLM-based system.
While LLMs have demonstrated strong capabilities in
automated code generation [10], [11], they still struggle to
achieve consistently high accuracy on complex algorithmic
problems, especially at smaller model scales. Current approaches to improving LLM performance include enhanced
prompting strategies such as Chain-of-Thought reasoning

[12], sampling-based methods like Self-Consistency [13],
and iterative refinement frameworks such as Self-Refine

[14], as well as multi-agent systems including Multi-Agent
Debate [17], [18] and MARS [19]. While these methods
have shown gains on several benchmarks, our experiments
indicate that they can be fragile, often failing to improve
performance and in some cases degrading accuracy in code
generation tasks, where the solution space is open-ended
and correctness admits many valid implementations. Among
existing approaches, many employ symmetric or consensusdriven interaction patterns [17], [18] that do not explicitly
capture interaction dynamics inspired by human learning.
MARS [19] introduces asymmetric roles but still relies on
agreement among parallel reviewers, incurring substantial


Fig. 1. The proposed PETITE framework and considered baseline architectures. (a) In PETITE a student (coder) generates solutions and a tutor (helper)
provides feedback in an iterative loop, producing the final accepted solution. (b) MARS introduces structured roles, including coder, reviewer, and metareviewer agents, to perform hierarchical evaluation and refinement. (c) Self-Consistency samples multiple independent solutions and selects the most
consistent one. (d) Self-Refine employs a single LLM that iteratively generates, critiques, and refines its own solution. (e) Multi-Agent Debate (MAD)
enables multiple agents to iteratively exchange solutions and feedback until reaching consensus.



token overhead despite incorporating an early stopping mechanism. To our knowledge, these methods do not adopt roledifferentiated, serial scaffolding structures commonly studied
in human learning [4], [3], [6].


Beyond adherence to developmental principles, our approach is also motivated by a common observation in human problem-solving: when writing code, individuals often
overlook errors in their own solutions, yet readily identify
similar mistakes when evaluating others’ work. This asymmetry between generative and evaluative processes is well
documented in peer tutoring research [6]. Evaluation engages
analytical attention to correctness, edge cases and logical
consistency, which is suppressed during the generative process of constructing a solution. We hypothesize that a similar
asymmetry applies to LLMs: a single model, when prompted
to evaluate code rather than generate it, may detect errors
it would miss. If so, structuring the interaction between
a generator and an evaluator roles could yield systematic
performance without increasing model capacity.


We introduce our PETITE ( **Pe** er **T** utoring **I** nspired **T** oken**E** fficient) framework and instantiate it for code generation,
a multi-agent system that balances performance gains with
token efficiency. PETITE instantiates two functionally differentiated roles: _Student/Coder_ _Agent_ is responsible for
generating and refining code solutions based on the problem
description and received feedback while _Tutor/Helper_ _Agent_
evaluates the student’s solutions, identifies errors, logical
gaps and edge cases, and provides structured feedback to
guide improvements. A key innovation of PETITE is its
serial usage of helper agent with asymmetric role assignment.
Unlike traditional iterative approaches that execute a fixed
number of refinement rounds, PETITE terminates when the
tutor agent determines that the solution is correct. This



adaptive termination naturally allocates more computational
resources to harder problems while efficiently resolving
simpler ones and reduces unnecessary token consumption,
mirroring the differential pacing observed in human cognitive
development.
Our contributions are as follows:


_•_ We propose a peer tutoring inspired LLM framework
(PETITE), instantiated in code generation domain, a
multi-agent system that uses structured role-based interaction for iterative code refinement.

_•_ We show that asymmetric tutor–student role separation,
motivated by peer tutoring and scaffolding theory, provides an effective alternative to symmetric debate or
parallel review architectures, even with identical agent
capabilities.

_•_ We introduce an early-stopping mechanism based on
tutor evaluation without ground truth, enabling adaptive
control of computational resources.

_•_ We evaluate PETITE on the APPS benchmark, demonstrating competitive accuracy with significantly lower
token usage than existing methods.


II. RELATED WORK


_A._ _Prompting_ _Strategies_ _for_ _Code_ _Generation_


Chain-of-Thought (CoT) prompting [12] has proven effective for complex reasoning tasks by encouraging models to
generate intermediate reasoning steps before producing the
final answer. For code generation, CoT prompting guides
models to decompose problems, identify constraints, and
develop algorithmic strategies before implementation. While
CoT improves accuracy on reasoning-intensive problems, it
operates in a single inference pass and cannot correct errors
post-generation.


_B._ _Self-Consistency_ _and_ _Sampling_ _Methods_


Self-Consistency [13] addresses the limitation of singlepass generation by sampling multiple reasoning paths and
selecting the most consistent answer through majority voting.
For code generation, this involves generating multiple independent solutions and selecting based on output’s success
rate agreement. While effective, Self-Consistency’s computational cost scales linearly with the number of generation
repetitions, making it expensive for deployment scenarios.


_C._ _Iterative_ _Refinement_ _Approaches_


Self-Refine [14] proposes an iterative framework in which
a model generates an initial solution, critiques its own output,
and refines it based on the feedback. The same model alternates between solver and critic roles, enabling improvement
without additional training. Related work explores structured
self-evaluation mechanisms. Self-Reflection [16] studies the
impact of reflective reasoning steps on problem-solving performance, encouraging models to reconsider prior reasoning
before finalizing answers. Self-Verification [15] further separates solution generation and verification, introducing explicit
consistency or logic checks before refinement. Among these
methods, Self-Refine is the most appropriate baseline for
comparison with PETITE, as both rely on iterative feedbackdriven improvement.


_D._ _Multi-Agent_ _Systems_


Multi-Agent Debate (MAD) [17], [18] employs multiple
LLM instances that engage in structured debates to reach
consensus on complex problems. Each agent proposes solutions and critiques others’ proposals until agreement is
reached. While effective for reasoning tasks, MAD can be
token-intensive due to extended debate rounds.
MARS (Multi-Agent Review System) [19] introduces a
hierarchical review structure with multiple reviewers and a
meta-reviewer that synthesizes feedback. The solver then
refines solutions based on consolidated critiques. This structured approach improves feedback quality but increases token
consumption through multiple review phases and parallel
connection of the reviewers.


_E._ _Position_ _of_ _Our_ _Work_


In addition to increasing the success rate of solutions, PETITE distinguishes itself from existing approaches through
its focus on token efficiency without sacrificing accuracy.
While MAD and MARS employ symmetric agent interactions or consensus based structures, PETITE adopts an
asymmetric tutor-student paradigm that naturally models
the teaching-learning dynamic. The tutor provides targeted
feedback focused on correctness, logic gaps and edge cases,
while the student implements improvements.


III. METHODOLOGY


_A._ _Problem_ _Formulation_


A programming problem consists of a natural language
specification and a set of input–output test cases that define
the expected behavior of a correct solution. The goal is to



Fig. 2. A successful refinement interaction by our model is depicted. After
the initial response of the student agent, the tutor agent evaluated the code
generated and provided feedback to improve the student’s solution. At the
second iteration, tutor found the code regenerated by the student sufficient
and labeled the solution as ”Correct”.


generate a program that satisfies all provided test cases. We
conduct experiments on the APPS benchmark [20], where
each problem includes multiple input–output pairs. Fig. 2
shows an example refinement process with the problem
instance. Solution correctness is determined by the fraction
of test cases passed, as specified by the dataset. We also
report token efficiency, measured as the total number of tokens consumed across all inference calls during the solution
process.


_B._ _LLM_ _Prompts_ _for_ _PETITE_ _based_ _Code_ _Generation_


Our algorithm consists of two agents instantiated from the
same base LLM but with distinct system prompts defining
their roles:
_Student_ _Agent_ _System_ _Prompt:_


“You are a coder. When user asks you questions try
to solve them perfectly. Regarding the user’s feedbacks
update your answer. IMPORTANT: You are not allowed
to write anything else than code. Do not write manual
test cases. Ensure the final code satisfies all constraints.
Provide only the final code in a single code block.”


_Tutor_ _Agent_ _System_ _Prompt:_


“You are a coding assistant and expert in coding. Your
job is to evaluate the solver’s answer and find ALL
issues. Identify all errors, logical errors, syntax errors,
gaps, infinite loops, unclear reasoning, edge cases, range
issues. Provide constructive and actionable feedback.
Your output must include: 1) List of strengths (if any),
2) List of problems or weaknesses, 3) Clear instructions
on how to improve the solution, 4) At the end, state
‘Decision: Wrong’ if the code is wrong, ‘Decision:
Correct’ if the code is correct.”


_C._ _Early_ _Stopping_ _Mechanism_


The early stopping mechanism is triggered when the
tutor’s feedback includes the phrase “Decision: Correct,”
indicating that the current solution is considered satisfactory.
This decision is made solely based on the tutor agent’s
evaluation, without access to any ground-truth solution. This
mechanism improves efficiency by terminating the refinement process as soon as a correct solution is identified,
thereby reducing unnecessary token usage. It also helps
prevent performance degradation, since continued refinement
of an already correct solution may introduce new errors.
In addition, it enables adaptive allocation of computational
resources, as more iterations are naturally spent on harder
problems while simpler ones are resolved earlier.


_D._ _Iterative_ _Refinement_ _Process_


The PETITE process proceeds as shown in Alg. 1, the
procedure begins by initializing two separate conversation
contexts for the student and tutor agents, each with their
respective system prompts. The given problem description
is formatted and provided to both agents, ensuring that they
start from the same task context. At each iteration, the student
agent generates a candidate solution based on its current
conversation history. This solution is then passed to the tutor
agent, which evaluates it and produces structured feedback.
The tutor’s feedback includes both qualitative assessment and
a decision signal indicating whether the solution is correct. If
the tutor’s feedback contains the phrase “Decision: Correct,”
the process is terminated early, and the current solution is
returned. Importantly, this decision is made solely based
on the tutor agent’s internal evaluation, without access to
ground-truth answers. If the solution is not accepted, the
tutor’s feedback is appended to both agents’ contexts. The
student then uses this feedback to refine its previous attempt
in the next iteration. This iterative interaction continues until
a correct solution is identified or the maximum number of
iterations is reached.


**Algorithm** **1** PETITE Tutor-Student Algorithm


0: ( _St_, _Ft_ be ”Solution” and ”Feedback” generated at step _t_ )
1: **Input:** Problem description _P_, max iterations _T_
2: **Output:** Final solution _S_
3: Initialize student conversation _CS_ with system prompt
4: Initialize tutor conversation _CT_ with system prompt
5: _prompt ←_ FormatProblem( _P_ )
6: Append _prompt_ to _CS_ as user message
7: Append _prompt_ to _CT_ as assistant message
8: **for** _t_ = 1 to _T_ **do**
9: **if** _t >_ 1 **then**
10: Append _St−_ 1 to _CT_ as user message
11: _Ft_ _←_ TutorAgent.Generate( _CT_ ) _{_ Feedback _}_
12: **if** “Decision: Correct” in _Ft_ **then**
13: **break** _{_ Early stopping _}_
14: **end** **if**
15: Append _Ft_ to _CS_ as user message
16: Append _Ft_ to _CT_ as assistant message
17: **end** **if**
18: _St_ _←_ StudentAgent.Generate( _CS_ )
19: Append _St_ to _CS_ as assistant message
20: **end** **for**
21: **return** _St_



Fig. 3. Example of an ”Interview” level problem from META APP
database. Each problem entry contains the question body, associated metadata, input–output test pairs for evaluation (truncated for the sake of space).


_E._ _Token_ _Tracking_


To assess efficiency, we track token usage for both agents,
including input and output tokens at each iteration and
cumulative totals over the course of interaction. Token counts
are recorded separately for the student and tutor agents
to analyze computational cost and compare with baseline
methods.


IV. EXPERIMENTAL SETUP


_A._ _Benchmark_ _Dataset_


We evaluate on a subset of 100 problems randomly
sampled from the APPS benchmark [20], which consists
of coding problems sourced from competitive programming
platforms including META’s coding challenges. The problems span three difficulty levels determined by the META:
_Introductory_ (14%) level problems designed as basic programming concepts while _Interview_ (62%) level represents
technical interview difficulty and _Competition_ (24%) stands
for competitive programming level. Each problem includes a
natural language description, input/output specifications, and
multiple test cases for evaluation.Fig. 3 shows an example
problem instance with truncated input-output test pairs.


_B._ _Base_ _LLM_ _Model_ _Details_


All experiments use Qwen2.5-Coder-7B-Instruct [21] as
the base model, deployed with 4-bit quantization (NF4) to
enable efficient inference on consumer-grade hardware (RTX
4060 with 8GB VRAM). The maximum context length is set
to 4096 tokens, and the generation is limited to 2048 new
tokens per request. We use stochastic decoding with sampling
enabled (do sample=True) and a temperature in the range of
0.7 to 0.8.


_C._ _Baseline_ _Methods_


We compare our framework, PETITE against four baseline
approaches. (See Fig. 1.) In brief, the baselines’ operation
logic is as follows:
_Self-Consistency_ _(SC)_ : Generation of 10 independent solutions with mode-based selection. We report both 5-sample
and 10-sample consistency.
_Self-Refine_ _(SR)_ : Three-phase approach with Solver, Critic,
and Refiner roles operating sequentially for 2 iterations.
_Multi-Agent_ _Debate_ _(MAD)_ : Two debating agents generate
solutions and iteratively refine based on each other’s proposals until consensus (matching success rates) or maximum 10
rounds.
_MARS_ : Multi-agent review system with one solver, two parallel reviewers, and a meta-reviewer that synthesizes feedback.


_D._ _Evaluation_ _Metrics_


We evaluate performance using two complementary metrics. _Success_ _Rate_ is the percentage of test cases passed
per problem, averaged across the benchmark. _Improvement_
is defined as the difference between the success rate of the
final and initial solutions. As initial solutions vary due to high
sampling temperatures, _Improvement_ better reflects the effect
of the refinement process. To account for computational cost,
we measure _Token Consumption_ as the total number of input
and output tokens per problem, averaged over the dataset. We
also define an _Efficiency_ _Ratio_ as the success rate divided
by token consumption to quantify performance relative to
computational cost.


V. RESULTS


In this section, we compare PETITE with the baseline
methods on the APPS benchmark. All methods use the
same base LLM and generation settings (Section IV) to
ensure a fair comparison. We report effectiveness (success
rate and improvement) and efficiency (token consumption
and efficiency ratio), with results presented across overall
performance, difficulty levels, and token usage.


_A._ _Overall_ _Performance_ _Comparison_


The experimental results show that our framework, PETITE consistently outperforms or matches the baselines, with
MARS being the closest in terms of performance. Table
I summarizes the results across all methods. All methods
are evaluated under the same experimental setup, using
identical model configurations and decoding parameters (see



Section IV). The numbers in parentheses indicate methodspecific configurations: for Self-Consistency it implies number of repetitions; for Self-Refine and PETITE it indicates
number of maximum refinement iterations.


TABLE I


OVERALL PERFORMANCE AND EFFICIENCY (100 PROBLEMS)


**Method** **Success** **(%)** **Improve.** **Avg** **Tokens** **Efficiency**


Self-C. (5) 27.50 -2.88 5,407.48 5.09
Self-C. (10) 28.84 -1.71 10,831.37 2.66
Self-Refine (1) 29.45 _±_ 1.54 -0.46 5,398.70 5.45
Self-Refine (2) 27.59 _±_ 1.89 -2.32 15,285.50 1.80
MAD 28.97 _±_ 1.96 - 23,630.50 1.23
MARS 30.06 _±_ 2.65 -0.82 7,319.99 4.11
PETITE (1) 31.13 _±_ 2.48 0.34 **2,490.90** **12.50**
PETITE (2) **31.62** _±_ **2.29** **0.83** 5,277.20 5.99
PETITE (3) 31.24 _±_ 2.30 0.45 9,622.40 3.25


Inspecting results in Table I one can note that SelfConsistency exhibits diminishing returns as the number of
samples increases, with 10-sample consistency providing
only a marginal improvement over 5-sample consistency
while nearly doubling token usage. Similarly, increasing the
refinement depth in Self-Refine (from one to two iterations)
leads to performance degradation alongside a significant
increase in computational cost.
Our model, PETITE, demonstrates consistent performance
improvements across refinement iterations, with the twoiteration configuration achieving the highest overall success
rate (31.62%). Notably, even PETITE (1) outperforms several
multi-agent baselines while consuming considerably fewer
tokens. Additional iterations (PETITE (3)) increase computational cost without proportional gains, indicating that two
iterations offer the most favorable balance between accuracy
and efficiency. The Improvement column in the table indicates the difference between the final success rate and the
initial success rate of the corresponding method, capturing
the effectiveness of iterative refinement in enhancing solution
quality.


_B._ _Performance_ _by_ _Difficulty_


To better understand how each method performs across
different levels of problem complexity, we analyze results
based on difficulty categories defined in the APPS benchmark.


TABLE II

SUCCESS RATE (%) BY PROBLEM DIFFICULTY


**Method** **Intro** **Interview** **Comp**


Self-Consistency (5) 48.07 28.17 13.75
Self-Consistency (10) 49.58 28.94 16.50
Self-Refine (2) 38.50 _±_ 6.65 28.35 _±_ 2.27 19.28 _±_ 3.91
MAD **52.94** _±_ **5.62** 27.26 _±_ 2.47 19.39 _±_ 3.63
MARS 49.46 _±_ 5.83 29.01 _±_ 2.67 21.45 _±_ 4.31
PETITE (2) 52.68 _±_ 5.62 **30.77** _±_ **2.62** **21.50** _±_ **2.87**


Table II presents the success rates of different methods
across problem difficulty levels, as defined by META’s


APPS benchmark. The benchmark categorizes problems into
Introductory, Interview, and Competition levels, with the
interview set being the most populated and most representative of real-world coding scenarios. PETITE demonstrates
particularly strong performance on Introductory problems
(52.68%), which are typically well-handled by the initial
student responses and therefore require minimal refinement.
On the Interview set, PETITE achieves the largest improvement relative to initial responses (30.77%), reflecting
the effectiveness of the tutor-student iterative process for
problems of moderate complexity, where targeted feedback
can meaningfully increase solution quality. Performance on
Competition problems (21.50%) remains competitive, although the inherent difficulty of these problems limits the
gains achievable even with iterative refinement.


_C._ _Token_ _Consumption_ _Analysis_

In addition to accuracy, computational cost, measured
via token consumption, is an important factor in evaluating
LLM-based methods. To assess efficiency, we compare token
consumption across methods and problem difficulty levels.
Table III summarizes the average token usage for each
method. It can be seen that PETITE, demonstrates consistent
token efficiency across all difficulty levels. Notably, on introductory problems, it consumes 3,078 tokens, substantially
fewer than MARS (5,525) and MAD (15,251).


TABLE III

AVERAGE TOKEN CONSUMPTION BY DIFFICULTY


**Method** **Intro** **Interview** **Comp** **Overall**


Self-Consistency (5) 4,195 5,482 **5,923** 5,407
Self-Consistency (10) 8,373 10,964 11,924 10,831
Self-Refine (2) 12,828 15,413 16,390 15,286
MAD 15,251 26,767 20,415 23,631
MARS 5,525 7,244 8,563 7,320
PETITE (2) **3,078** **5,040** 7,174 **5,277**


For Interview problems, the most representative realworld problem pool, PETITE uses 5,040 tokens, achieving a
reduction of approximately 81% compared to MAD (26,767)
and 67% compared to Self-Refine (15,413) with better performance as shown in Table II. For Competition problems,
PETITE requires 7,174 tokens, markedly fewer than SelfRefine (16,390) and MAD (20,415) still keeping its higher
efficiency and performance in this challenging problem set.


VI. DISCUSSION

Our results highlight how structuring interaction between
agents affects both performance and efficiency in code generation tasks. PETITE framework, implemented within code
generation domain, consistently achieves strong performance
while maintaining low token consumption. This behavior
can be attributed to its serial interaction pattern, where a
student agent generates solutions and a tutor agent evaluates
them and provides targeted feedback. This separation of roles
allows the model to focus on generation and evaluation as
distinct processes, leading to more stable refinement across
iterations.



We observe that a small number of refinement steps is
sufficient to capture most of the gains. Through empirical
evaluation, we found that two refinement iterations provide
the best balance between accuracy and token efficiency;
additional iterations (three or four) did not yield consistent
improvements relative to their computational cost. We further explored temperature settings between 0.5 and 0.9 and
observed that a temperature of 0.8 produced the best performance. Lower temperatures often led to similar solution patterns and recurring mistakes, while slightly higher randomness introduced beneficial diversity that occasionally enabled
improved refinements. Although resetting the tutor’s conversation history at each iteration would further reduce token
usage, we retained cumulative context to preserve the conceptual integrity of the tutor–student interaction. By adopting
sequential refinement, PETITE mitigates consensus-driven
drift toward suboptimal solutions, in contrast to parallel
or debate-based approaches that can exhibit ill-convergence
due to premature or unstable agreement. Combined with
the decision-based early stopping mechanism, this design
strengthens token efficiency while maintaining competitive
performance relative to alternative multi-agent approaches.
The asymmetric tutor–student interaction in our framework provides a more controlled alternative. By assigning
distinct responsibilities to each agent, the framework avoids
the need for consensus and instead focuses on iterative
improvement guided by evaluation. Feedback flows in a
single direction, which simplifies the interaction and reduces
the risk of circular reasoning. The tutor’s decision also
provides a natural stopping point, allowing the system to
adapt its computation based on problem difficulty. Reviewerbased approaches such as MARS benefits role asymmetry
similar to our approach, however, the primary distinction lies
in reviewer coordination. MARS utilizes multiple reviewers
in parallel, whereas PETITE applies feedback in a serial
manner. This parallel structure increases token consumption
per case, even in their minimal configuration consisting of
two reviewers and one meta-reviewer. Consequently, the use
of multiple reviewers in parallel increases computational cost
and may still lead to convergence toward broadly acceptable
but not necessarily optimal solutions.
Despite these advantages, several limitations remain. The
effectiveness of our approach depends on the reliability of
the tutor agent’s judgments. If the tutor incorrectly marks a
solution as correct, the process may terminate prematurely
and reduce overall accuracy. In addition, the evaluation is
conducted on a subset of the APPS benchmark, and while
it provides a representative range of problem difficulties,
it may not capture all characteristics of real-world coding tasks. Finally, both agents are instantiated from the
same base model, which limits the diversity of perspectives
compared to heterogeneous or ensemble-based approaches.
These limitation translate to possible future work to be
undertaken. One direction is to explore heterogeneous agent
configurations, where the tutor and student are based on
different models. Another direction is to develop more reliable stopping criteria, potentially by incorporating confidence


estimation into the tutor’s decisions. Improving the quality
of tutor feedback through additional training methods, such
as preference-based DPO (Direct Preference Optimization),
may also lead to further gains. More broadly, adapting the
interaction structure based on problem difficulty could help
allocate computational resources more effectively.


VII. CONCLUSION


In this study, we proposed a developmental scaffolding
framework PETITE inspired by peer tutoring interaction
and instantiated it in the autonomous coding domain, a
lightweight multi-agent system in which both tutor and
student agents are derived from the same base LLM. Rather
than relying on stronger supervisory models, distillation
pipelines, or heterogeneous ensembles, the framework improves performance through structured internal interaction
based on role differentiation. A key aspect of our approach
is its asymmetric, serial refinement mechanism combined
with decision-based early stopping. By separating generative
and evaluative processes into distinct roles, the framework
leverages the model’s capacity for critical assessment in a
way that is not typically engaged during solution generation alone. The tutor provides targeted, correctness-oriented
feedback, while the student focuses on solution synthesis,
enabling iterative improvement without external supervision
or consensus across multiple agents.
Empirical results on the APPS benchmark show that
PETITE achieves competitive success rates among iterative
multi-agent approaches while using substantially fewer tokens than debate-based and multi-reviewer systems. These
findings support the hypothesis that structuring interaction
within a single model, through role separation, can yield performance gains while maintaining computational efficiency.
More broadly, this work shows the benefit of grounding
LLM-based problem-solving systems in principles from developmental science. Rather than treating multi-agent design
as an engineering heuristic, our results suggest that such developmentally motivated interaction structures can serve as a
principled basis for improving learning and problem solving
under resource constraints. This perspective points toward
integrating insights from human cognitive development into
the design of more efficient and adaptable AI systems.


ACKNOWLEDGMENT


This work was supported by JSPS KAKENHI Grants
numbered JP23K24926 and JP25H01236. We thank the
developers of the APPS benchmark and the Qwen model
team.


REFERENCES


[1] L. S. Vygotsky, _Mind_ _in_ _Society:_ _The_ _Development_ _of_ _Higher_ _Psycho-_
_logical_ _Processes_ . Cambridge, MA: Harvard University Press, 1978.

[2] J. Piaget, _The_ _Origins_ _of_ _Intelligence_ _in_ _Children_ . New York: International Universities Press, 1952.

[3] D. Wood, J. S. Bruner, and G. Ross, “The role of tutoring in problem
solving,” _Journal_ _of_ _Child_ _Psychology_ _and_ _Psychiatry_, vol. 17, no. 2,
pp. 89–100, 1976.

[4] B. S. Bloom, “The 2 sigma problem: The search for methods of
group instruction as effective as one-to-one tutoring,” _Educational_
_Researcher_, vol. 13, no. 6, pp. 4–16, 1984.




[5] P. Black and D. Wiliam, “Assessment and classroom learning,” _As-_
_sessment_ _in_ _Education:_ _Principles,_ _Policy_ _&_ _Practice_, vol. 5, no. 1,
pp. 7–74, 1998.

[6] K. J. Topping, “Trends in peer learning,” _Educational Psychology_, vol.
25, no. 6, pp. 631–645, 2005.

[7] A. Collins, J. S. Brown, and S. E. Newman, “Cognitive apprenticeship:
Teaching the crafts of reading, writing, and mathematics,” in _Knowing,_
_Learning,_ _and_ _Instruction:_ _Essays_ _in_ _Honor_ _of_ _Robert_ _Glaser_, L. B.
Resnick, Ed. Hillsdale, NJ: Erlbaum, 1989, pp. 453–494.

[8] A. Cangelosi and M. Schlesinger, _Developmental_ _Robotics:_ _From_
_Babies_ _to_ _Robots_ . Cambridge, MA: MIT Press, 2015.

[9] J. Weng, J. McClelland, A. Pentland, O. Sporns, I. Stockman, M.
Sur, and E. Thelen, “Autonomous mental development by robots and
animals,” _Science_, vol. 291, no. 5504, pp. 599–600, 2001.

[10] M. Chen, J. Tworek, H. Jun, Q. Yuan, H. P. de Oliveira Pinto, J.
Kaplan, H. Edwards, Y. Burda, N. Joseph, G. Brockman, A. Ray, R.
Puri, G. Krueger, M. Petrov, H. Khlaaf, G. Sastry, P. Mishkin, B. Chan,
S. Gray, N. Ryder, M. Pavlov, A. Power, L. Kaiser, M. Bavarian, C.
Winter, P. Tillet, F. P. Such, D. Cummings, M. Plappert, F. Chantzis,
E. Barnes, A. Herbert-Voss, W. H. Guss, A. Nichol, A. Paino, N.
Tezak, J. Tang, I. Babuschkin, S. Balaji, S. Jain, W. Saunders, C.
Hesse, A. N. Carr, J. Leike, J. Achiam, V. Misra, E. Morikawa, A.
Radford, M. Knight, M. Brundage, M. Murati, K. Mayer, P. Welinder,
B. McGrew, D. Amodei, S. McCandlish, I. Sutskever, and W. Zaremba,
“Evaluating large language models trained on code,” arXiv preprint
arXiv:2107.03374, 2021.

[11] Y. Li, D. Choi, J. Chung, N. Kushman, J. Schrittwieser, R. Leblond,
T. Eccles, J. Keeling, F. Gimeno, A. Dal Lago, T. Hubert, P. Choy, C.
de Masson d’Autume, I. Babuschkin, X. Chen, P.-S. Huang, J. Welbl,
S. Gowal, A. Cherepanov, J. Molloy, D. J. Mankowitz, E. Sutherland
Robson, P. Kohli, N. de Freitas, K. Kavukcuoglu, and O. Vinyals,
“Competition-level code generation with AlphaCode,” Science, vol.
378, no. 6624, pp. 1092–1097, 2022.

[12] J. Wei, X. Wang, D. Schuurmans, M. Bosma, B. Ichter, F. Xia, E. Chi,
Q. Le, and D. Zhou, “Chain-of-thought prompting elicits reasoning in
large language models,” in Advances in Neural Information Processing
Systems, vol. 35, pp. 24824–24837, 2022.

[13] X. Wang, J. Wei, D. Schuurmans, Q. Le, E. Chi, S. Narang, A.
Chowdhery, and D. Zhou, “Self-consistency improves chain of thought
reasoning in language models,” in International Conference on Learning Representations, 2023.

[14] A. Madaan, N. Tandon, P. Gupta, S. Halber, L. Gao, S. Wiegreffe, U.
Alon, N. Dziri, S. Prabhumoye, Y. Yang, S. Gupta, B. P. Majumder,
K. Hermann, S. Welleck, A. Yazdanbakhsh, and P. Clark, “Selfrefine: Iterative refinement with self-feedback,” in Advances in Neural
Information Processing Systems, vol. 36, 2023.

[15] Y. Weng, M. Zhu, F. Xia, B. Li, S. He, K. Liu, and J. Zhao,
“Large language models are better reasoners with self-verification,” in
Findings of the Association for Computational Linguistics: EMNLP
2023, pp. 2550–2575, 2023.

[16] M. Renze and E. Guven, “Self-reflection in LLM agents: Effects
on problem-solving performance,” arXiv preprint arXiv:2405.06682,
2024.

[17] T. Liang, Z. He, W. Jiao, X. Wang, Y. Wang, R. Wang, Y. Yang, Z. Tu,
and S. Shi, “Encouraging divergent thinking in large language models
through multi-agent debate,” arXiv preprint arXiv:2305.14325, 2023.

[18] Y. Du, S. Li, A. Torralba, J. B. Tenenbaum, and I. Mordatch, “Improving factuality and reasoning in language models through multiagent
debate,” arXiv preprint arXiv:2305.14325, 2023.

[19] L. Du, M. Ding, J. Tang, and W. Chen, “MARS: Multi-Agent
Review and Refinement for Code Generation,” arXiv preprint
arXiv:2409.12186, 2024.

[20] D. Hendrycks, S. Basart, S. Kadavath, M. Mazeika, A. Arora, E.
Guo, C. Burns, S. Puranik, H. He, D. Song, and J. Steinhardt,
“Measuring coding challenge competence with APPS,” in Proceedings
of the Neural Information Processing Systems Track on Datasets and
Benchmarks, 2021.

[21] Qwen Team, “Qwen2.5-Coder Technical Report,” arXiv preprint
arXiv:2409.12186, 2024.


