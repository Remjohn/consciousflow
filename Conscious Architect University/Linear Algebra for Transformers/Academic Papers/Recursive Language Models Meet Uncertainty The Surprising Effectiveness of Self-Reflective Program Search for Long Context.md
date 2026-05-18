## Recursive Language Models Meet Uncertainty: The Surprising Effectiveness of Self-Reflective Program Search for Long Context

Keivan Alizadeh [∗] Parshin Shojaee _[∗]_ Minsik Cho Mehrdad Farajtabar


Apple


**Abstract**


Long-context handling remains a core challenge for language models: even with extended
context windows, models often fail to reliably extract, reason over, and use the information
across long contexts. Recent works like Recursive Language Models (RLMs) have approached
this challenge by agentic way of decomposing long contexts into recursive sub-queries through
programmatic interaction at inference. While promising, the success of RLMs critically depends
on how these trajectories of context-interaction programs are selected, which has remained
unexplored. In this paper, we study this problem and introduce Self-Reflective Program Search
for Long Context (SRLM), a framework that augments programming-based context interaction
with uncertainty-aware self-reflection. SRLM leverages three intrinsic signals: self consistency,
reasoning trace length, and verbalized confidence. These serve as complementary indicators of
a model’s internal uncertainty, and the model uses them to evaluate and compare candidate
context-interaction programs. Extensive experiments across diverse benchmark datasets, context
lengths, and backbone models, show that SRLM consistently outperforms state-of-the-art baselines, yielding up to 22% improvement over RLMs under the same time budget. Our findings show
that recursion itself is not the primary driver of performance in RLMs, and a simple self-reflective
program search can match or surpass RLM without requiring self-query or explicit recursion
mechanisms. We find that for context lengths within the model’s context window, RLMs with
recursion often degrade performance relative to the base model, whereas SRLM yields consistent
and robust gains across both short and long contexts. We also find that RLM is less effective
in tasks with semantically intensive nature, where heuristic program search is insufficient and
broader contextual understanding is required, while self-reflection in SRLM provides a semantic
signal that better steers reasoning in these challenging long-context scenarios.

### **1 Introduction**


Large language models are increasingly deployed in settings where long-context understanding is not
optional but unavoidable. Modern applications from deep research agents [27] and web browsing
systems [10] to coding assistants [31] and self-improving agents [78] routinely demand reasoning over
hundreds of thousands to millions of tokens spanning documents, logs, repositories, and interaction
histories. Despite rapid progress in extending models’ context windows, effective utilization of long
contexts still remains challenging. Empirical studies show that even in frontier models with very
large context windows, performance degrades with context length in ways that are well-documented
but not yet solved: models lose track of salient details, fail to reliably extract, integrate, and


∗Equal contribution.
Correspondence to {pshojaee, kalizadehvahid, farajtabar}@apple.com


1


Figure 1: **Overview** **of** **SRLM**, a framework that augments programmatic context interaction
reasoning with uncertainty-aware self-reflection. The language model operates in a self-query
execution programming environment where the context is externalized as a variable, and generates
programs that query and interact with context. Meanwhile, three complementary uncertainty
signals (self-consistency, reasoning trace length, and verbalized confidence) are used to guide
self-reflective programming trajectory selection without external supervision, enabling more robust
and semantically grounded long-context reasoning.


reason over relevant information across distant positions, and are easily distracted by irrelevant
content [40, 24, 15].
The research community has approached this challenge from several angles. One direction has
been to target this problem at the model level for example through architecture sparsity mechanisms [57, 21, 36], state-space models [22, 12, 61], retrieval-based hybrid models [32, 62], or KV cache
compression [18], reducing the effective cost of processing long sequences. Another direction has been
at the data and training level where models are specifically trained on longer sequences or curating
corpora that reward reasoning over long-horizons [20, 80]. A more recent promising direction treats
long-context reasoning as a search problem at inference-time, leaving the model unchanged and
instead restructuring how it interacts with context [66, 78]. Chunking and summarization pipelines
break long contexts into manageable pieces; retrieval systems surface relevant passages on demand;
and agent-style frameworks issue iterative queries over the context, building up answers through a
sequence of focused interactions.
Recursive Language Models (RLMs) [75] represent the current state of the art in this inference-time
context handling paradigm. Instead of processing long context with millions of tokens directly with
model, RLM treats the context as an external variable within a programming environment, and
allows the model to generate programs that query, slice, and recursively interact with the context.
By externalizing context interaction with program execution, RLM has shown to extend the model’s
effective reasoning horizon beyond what prompting typically allows.
However, this framing introduces a largely unexplored dimension of the problem. The quality of longcontext reasoning in RLM is governed not only by the model’s capacity to process extended context,
but also by the mechanism used to select trajectories of context-interaction programs. At each step,


2


the model must decide which context segment to inspect, how to formulate intermediate self-queries,
what sub-questions to pose, and how to aggregate these programming steps and partial results.
The final prediction is therefore highly sensitive to the specific program trajectory instantiated
during context interaction reasoning. Despite this, RLM currently predominantly rely on fixed
recursion schemes, lacking a principled mechanism for evaluating and selecting among alternative
reasoning trajectories. This raises a central question: _Is_ _recursion_ _itself_ _the_ _key_ _ingredient_ _for_
_long-context_ _reasoning,_ _or_ _is_ _the_ _real_ _bottleneck_ _how_ _we_ _select_ _among_ _candidate_ _interaction_ _programs_
_under_ _uncertainty?_
In this work, we investigate this question and introduce Self-Reflective Program Search for Long
Context Method ( **SRLM** ), a framework that augments programming-based context interaction
with uncertainty-aware self-reflection (Figure 1). SRLM leverages three complementary signals
(self-consistency, reasoning length, and verbalized confidence) as proxies for the model’s internal
uncertainty, enabling principled comparison of context-interaction trajectories through model’s
self-reflection without requiring external supervision. Through extensive comparison experiments
across diverse benchmarks, varying context lengths, and multiple backbone models, we observe that
SRLM consistently outperforms state-of-the-art baselines, yielding up to 22% improvement over
RLM under the same wall-clock time budget.
Beyond empirical improvements, our analysis provides several insights into programming-based
context-interaction frameworks like RLM and its key components. First, we find that recursion
is not the primary driver of performance. A simple self-reflective program search can match or
even surpass RLM without relying on explicit recursion or self-query mechanisms. Second, the
recursive self-query procedure is often more sensitive to context-length variations than self-reflection.
In particular, when the context length falls within the model’s native context window, recursive
RLM reasoning can degrade performance relative to the base model, whereas SRLM yields more
robust and consistent improvements across both short and long contexts. Finally, we observe that
RLM is less effective on semantically intensive tasks where heuristic program search is insufficient.
In such settings, the uncertainty-aware self-reflection mechanism in SRLM provides a higher-level
semantic signal that more effectively steers reasoning. Together, these findings reposition recursion
as one component of long-context reasoning rather than its defining feature, and suggest that
uncertainty-aware self-reflection may serve as a simple yet effective alternative for building robust
context-interaction frameworks.
More broadly, our goal in this paper is not just introducing a novel method but to better understand
programming-based context-interaction frameworks and the role of their core components. Our study
highlights the critical importance of programming trajectory selection in long-context interaction
and suggests that improving how models explore and evaluate candidate interaction programs may
be as important as extending context length itself. We hope that these findings help guide the
development of richer and more reliable long-context reasoning frameworks in future work.
Our key contributions are as follows:


- We introduce SRLM, a simple framework for long-context reasoning that augments programmingbased context interaction with uncertainty-aware self-reflection. SRLM exploits three complementary uncertainty signals (self-consistency, reasoning trace length, and verbalized confidence) to
enable principled comparison and selection of context-interaction programming trajectories.


- We demonstrate that across diverse benchmarks, and multiple backbone models, SRLM consistently outperforms state-of-the-art baselines, achieving up to a 22% improvement over RLM under
the same wall-clock time budget.


- We uncover that recursion is not the primary driver of RLM’s performance, and a simple selfreflective program search can match or surpass recursion without the explicit self-query mechanism.


3


- We find that RLM’s recursive procedure is sensitive to context length, mostly performing worse
than the base model within the model’s native context window, whereas SRLM delivers more
robust improvements across both short and long contexts.


- We identify a systematic failure mode of RLM on semantically intensive tasks and show that
self-reflection provides a richer steering signal than heuristic-based recursive program search in
these settings.

### **2 Methodology**


**2.1** **Problem** **Formulation**


Let _q_ denote a natural language query and _C_ = ( _c_ 1 _, c_ 2 _, . . ., cN_ ) a long context of _N_ tokens, where
_N_ _≫_ _L_ with _L_ being the model’s effective context window. Rather than feeding _C_ directly to model,
we follow [75] and treat context as an _external_ _variable_ accessible within a sandboxed execution
programming environment. A context-interaction program _p_ = ( _p_ 1 _, p_ 2 _, . . ., pT_ ) is a sequence of _T_
executable operations, e.g., slicing, querying, or aggregating over _C_, each generated autoregressively
and executed in the REPL, producing an intermediate execution state: _et_ = Exec( _pt,_ _et−_ 1 _,_ _C_ ) _,_
where _e_ 0 = ∅. The terminal step yields the program output out( _p_ ) _∈A_ over answer space _A_ . A
key distinction from [75] is that SRLM does _not_ require programs to instantiate explicit self-query
sub-calls or recursive model invocations as tool calls. This decouples quality of context interaction
from the structure of recursion, and shifts the focus of long-context reasoning improvement to the
selection mechanism over candidate context-interaction program trajectories.


**2.2** **SRLM:** **Self-Reflective** **Program** **Search** **for** **Long** **Context**


Given query _q_ and context _C_, _K_ candidate programs are independently selected from the model
policy _πθ_ : _p_ [(] _[k]_ [)] _∼_ _πθ_ ( _· | q,_ _C_ ) _,_ _k_ = 1 _, . . ., K._ Each _p_ [(] _[k]_ [)] constitutes a distinct reasoning trajectory
over _C_, differing in which context segments are inspected, how sub-problems are decomposed, and
the confidence with which intermediate conclusions are drawn. We propose a self-reflective program
search approach for long-context reasoning that draws on three complementary uncertainty signals:
_sampling-based_ _uncertainty_ _(self-consistency)_, _semantic_ _uncertainty_ _(verbalized_ _confidence)_, and
_behavioral_ _uncertainty_ _(reasoning_ _trace_ _length)_ . Notably, all these three signals are derived from the
model’s own generation process, requiring no verifier, reward model, or external labeled data.


**2.2.1** **Uncertainty** **Signals**


**Sampling-based** **Uncertainty** **(Self-Consistency).** As per [58], a natural first-order uncertainty
quantification arises directly from the sampling distribution over programs. Given _K_ independent
draws from _πθ_, the empirical frequency of any candidate answer _a_ _∈A_ serves as an estimate
of the model’s marginal confidence in that answer, i.e., prob( _a_ ) = _K_ 1 - _Kk_ =1 **[1]** �out( _p_ [(] _[k]_ [)] ) = _a_ - _≈_
P _πθ_ �out( _p_ ) = _a_ _|_ _q, C_ �. The plurality answers _a_ ˆ = arg max _a∈A_ prob( _a_ ) maximize this empirical
confidence, and we retain the consistent candidate set as the subset of programs that agree with
_a_ ˆ: _S_ = - _p_ [(] _[k]_ [)] _∈P_ : out( _p_ [(] _[k]_ [)] ) = _a_ ˆ� _⊆P_ . This step performs implicit verification through selfconsistency [64], however, self-consistency is a coarse uncertainty signal that operates only at
the level of final outputs and is insensitive to the quality of the trajectory that produced them.
Programs in _S_ may share the same answer _a_ ˆ, yet may differ substantially in how they arrived at it:
which context segments they inspected, how confidently they resolved each sub-problem, and how


4


much deliberation they required. Selecting reliably among these candidates demands finer-grained
uncertainty measures.


**Semantic** **Uncertainty** **(Verbalized** **Confidence).** Inspired by [68], to obtain a step-level
semantic uncertainty signal, we elicit the model’s own assessment of its confidence at each intermediate
generation step _t_ . Specifically, we append a structured instruction to the model’s prompt, requiring
it to report a confidence score for each step in a standardized format `{"confidence":` _νt_ [(] _[k]_ [)] `}` _,_ _νt_ [(] _[k]_ [)] _∈_
(0 _,_ 100] _,_ where the model is instructed to be precise and nuanced in its self-assessment. This elicitation
yields a per-step confidence _νt_ [(] _[k]_ [)] reflecting the model’s self-assessed certainty over its intermediate
conclusion at step _t_ [68]. Normalizing to the unit interval and aggregating in log-space over the full

                               -                                trace, we define the verbalized confidence score of program _p_ [(] _[k]_ [)] as VC( _p_ [(] _[k]_ [)] ) = [�] _t_ _[T]_ =1 [ (] _[k]_ [)] [log] _νt_ [(] _[k]_ [)] _/_ 100 _≤_

0 _,_ where non-positivity follows from _νt_ [(] _[k]_ [)] _/_ 100 _∈_ (0 _,_ 1], and values closer to zero indicate globally
higher confidence across the trajectory. Unlike self-consistency, VC( _p_ [(] _[k]_ [)] ) is a semantic uncertainty
measure that captures how the model endorses each intermediate reasoning step as it progressively
builds toward the final answer. For more details of prompt used for this, check Appendix B.1.


**Behavioral Uncertainty (Reasoning Length).** While verbalized confidence relies on the model’s
explicit self-report at each step, we additionally exploit an implicit behavioral signal as the total
token length of the generated trace. Let _ℓ_ [(] _t_ _[k]_ [)] denote the number of reasoning and output tokens
at step _t_ ; we define Len( _p_ [(] _[k]_ [)] ) = [�] _t_ _[T]_ =1 [ (] _[k]_ [)] _[ℓ]_ _t_ [(] _[k]_ [)] _[.]_ [We] [interpret] [this] [quantity] [as] [a] [proxy] [for] [epistemic]
effort. Intuitively, when a model is uncertain, it tends to generate longer, more deliberative traces,
whereas confident and well-grounded reasoning is often associated with more concise outputs [13, 54].
Importantly, trace length provides a signal complementary to verbalized confidence [13]. Unlike
self-reported confidence scores, it requires no explicit elicitation and is derived solely from observable
generation statistics. As such, it offers an alternative fine-grained window into internal uncertainty
that is not directly subject to miscalibration in the model’s stated confidence.


**2.2.2** **Joint** **Uncertainty-guided** **Selection**


The three uncertainty signals (self-consistency, verbalized confidence, and trace length) are complementary proxies of model uncertainty, each capturing a distinct aspect of the model’s internal state.
As our empirical results demonstrate (Section 3.8), combining these signals yields a richer uncertainty
characterization that more effectively guides program search over long-context interaction programs
than any individual signal alone. Within the consistent candidate set _S_ (where self-consistency
has already been enforced), we unify the remaining two signals into a joint uncertainty score of
_s_ ( _p_ ) = VC( _p_ ) _·_ Len( _p_ ) where lower values of _s_ ( _p_ ) indicate better candidates. By construction,
_s_ ( _p_ ) _≤_ 0 since VC( _p_ ) _≤_ 0 and Len( _p_ ) _>_ 0. Intuitively, this score penalizes programs that express low
confidence or require excessively long reasoning traces—both indicators of uncertainty. The optimal
program is then selected as _p_ _[∗]_ = arg max _p∈S_ _s_ ( _p_ ) _,_ with final prediction _y_ ˆ = out( _p_ _[∗]_ ). Together, these
three uncertainty signals form a coherent, self-reflective framework that effectively guides program
search in SRLM without requiring any external supervision.


5


### **3 Experiments**

**3.1** **Datasets**


Following [75], we evaluate SRLM on three benchmarks spanning diverse long-context reasoning
tasks. **BrowseComp+** **(1K)** [10] is a multi-hop QA benchmark for DeepResearch [48] over a
verified offline corpus of 1,000 documents, where each question requires piecing together evidence
across multiple documents. Following [75, 56], we evaluate on 150 randomly sampled instances
and report accuracy. **OOLONG** **(131K)** [6] requires transformation and aggregation of input
chunks, scaling linearly in processing complexity with context length. We focus on the `trec_coarse`
split from OOLONG synthetic benchmark with context length 131K (50 tasks), and report scores
following the original paper. **LongBench-v2** **CodeQA** [3] is a multiple-choice code repository
understanding benchmark requiring reasoning over long-context of files in a codebase (50 tasks).
Beyond this, we conduct extended evaluations targeting the core research questions of this study.
To characterize how context length affects SRLM and RLM, we evaluate on the **full** **OOLONG**
**synthetic** **benchmark** ( `trec_coarse` split) across context lengths from 1K to 4M tokens ( _≈_ 650
tasks, 50 per length). To investigate the effect of task semantics and extend evaluation to tasks that
by nature require more semantic understanding rather than heuristic search over context, we also
evaluate on the **full** **LongBench-v2** benchmark across all domain categories beyond just CodeQA
( _≈_ 500 tasks), including domains like single document QA, multi-document QA, long in-context
learning, etc. For more details on statistics, context length distributions, and category breakdowns
of these datasets, check Appendix A.


**3.2** **Baselines**


We compare against a comprehensive set of task-agnostic inference-time baselines following [75].
**Base** **LLM** processes the full context in prompt without any programmatic inference scaffolding.
**CodeAct** **(+BM25)** [63] is a code-executing ReAct [71] agent that receives the full context directly
and is additionally equipped with a BM25 retriever [51] for context search as per [75, 30, 10].
**CodeAct** **(+sub-calls)** ablates the effect of context offloading as a variable in REPL by augmenting
the CodeAct baseline with the ability to invoke sub-calls from the language model. **Summary** **agent**
also follows [56, 66, 73] and iteratively compacts and summarizes context as the model window fills,
chunking documents that exceed the context limit. **RLM** [75] is the current state-of-the-art approach,
externalizing context as a variable in a REPL environment and issuing recursive self-queries; we
consider both the recursive variant (depth one) and the **no** **sub-calls** variant that disables this
self-query procedure. For each comparison across baseline methods, we use the same backbone
models and sampling parameters.


**3.3** **Experimental** **Setup**


In our experiments, we use two backbone LLMs: the open-weight Qwen3-Coder-480B-A35B [59] and
GPT-5 [55] with medium reasoning effort, with GPT-5-mini as the sub-model for the recursive calls
(as per [75]). SRLM operates in the same REPL environment as RLM and uses _K_ =8 candidate
trajectories for uncertainty-guided program search, with uncertainty signals defined in Section 2.
To ensure fair wall-clock time comparison across methods, we impose execution time limits of 600
seconds per each step of trajectory for all runs. We set a maximum of 30 program interaction
steps and a maximum generation length of 260K tokens for Qwen3-Coder-480B, with default API
parameters for GPT-5 and GPT-5-mini calls. For verbalized confidence elicitation, we augment the
original RLM prompt (As in [75]) with a suffix requesting the self-report of internal confidence in


6


Table 1: Performance comparison of SRLM against baselines on long-context benchmarks from [75].
Results report accuracy (%) on LongBench-v2 CodeQA, BrowseComp+ (1K documents), and
OOLONG (131K tokens). SRLM consistently outperforms all baselines, achieving up to 22%
improvement over RLM. _[∗]_ indicates context overflow; _[†]_ indicates our replication of results; and
**bold** shows best result per LLM backbone.


**Model** **LongBench-v2** **(CodeQA)** **BrowseComp+(1K)** **OOLONG** **(131K)**
Task Length _N_ (tokens) 23K-4.2M 6M-11M 131K


_Qwen3-Coder-480B_
Base Model 20 _._ 0 _[∗]_ 0 _._ 0 _[∗]_ 36 _._ 0
CodeAct (+ BM25) 24 _._ 0 _[∗]_ 12 _._ 7 38 _._ 0
CodeAct (+ sub-calls) 26 _._ 0 _[∗]_ 0 _._ 0 32 _._ 0
Summary agent 50 _._ 0 38 _._ 0 44 _._ 1


_GPT-5_
Base Model 24 _._ 0 _[∗]_ 0 _._ 0 _[∗]_ 44 _._ 0
CodeAct (+ BM25) 22 _._ 0 _[∗]_ 51 _._ 0 38 _._ 0
CodeAct (+ sub-calls) 24 _._ 0 _[∗]_ 0 _._ 0 _[∗]_ 40 _._ 0
Summary agent 58 _._ 0 70 _._ 5 46 _._ 0


a structured format, without modifying any other part of the prompt or reasoning procedure (see
Appendix B.1 for details). For final answer evaluation, we also use GPT-5-mini as a judge across all
datasets to robustly assess the correctness (check Appendix B.2 for details).


**3.4** **Main** **Results**


Table 1 compares SRLM with RLM and other baselines on the long-context benchmarks from [75].
Across all datasets and both backbone LLMs, SRLM consistently performs the best, improving
over the previous state-of-the-art RLM by up to 22%. Looking more closely, we find that the
effect of recursion is inconsistent across backbone models. For example, with Qwen3-Coder-480B,
recursion helps both RLM and SRLM, suggesting that decomposing the context into smaller subproblems through model’s self-query procedure as tool call can support long-context handling in
Qwen backbone. However, under GPT-5, recursion hurts performance and the variants without
sub-calls outperform their recursive counterparts in most cases. This might indicate that when the
backbone model is already strong at long-context reasoning, explicitly using self-query tool calls for
context-interaction may be unnecessary or even disruptive. In contrast, the self-reflection mechanism
in SRLM provides stable improvements across both of these backbones. Even without any sub-calls,
SRLM often outperforms recursive RLM. This suggests that guiding through model internals and
self-reflection may matter more than guiding through explicit recursive tool calls for the scope of
long context. We analyze these behaviors in greater detail in Section 3.5–3.7.


7


|SRLM SRLM|+|+28.5|5|
|---|---|---|---|
|0.9<br>-6.8<br>+5.4<br>-1.6<br><br>SRLM<br>(no sub-|~~+11.9~~+9.5<br> call)|+|19.5|
|<br>||||


|40<br>(pp)<br>30<br>Base<br>20<br>vs<br>10+<br>∆<br>0|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
|0<br>10<br>20<br>30<br>40<br>∆ vs Base (pp)<br>~~+~~|14.6<br>+|14.6<br>+|25.<br>+|7<br>15.2<br>|~~+31.~~<br>+|~~6~~<br>26.<br>|3<br>42.|544|7|
|0<br>10<br>20<br>30<br>40<br>∆ vs Base (pp)<br>~~+~~||-0.8||||||||
|0<br>10<br>20<br>30<br>40<br>∆ vs Base (pp)<br>~~+~~||||||||||





OOLONG (Qwen3-Coder-480B)



100


80

|60<br>Base Accuracy<br>40 RLM<br>RLM (no sub-call)<br>20 SRLM<br>SRLM (no sub-call)<br>0<br>1K 2K 4K 8K 16K 32K KKKK 1M 2M 4M<br>26365 421<br>521<br>Context Length|Col2|B<br>R<br>R|ase<br>LM<br>LM|(no|sub-c|all)|Col8|Col9|Col10|Col11|Col12|
|---|---|---|---|---|---|---|---|---|---|---|---|
|1K<br>2K<br>4K<br>8K<br>16K<br>32K<br>65K<br>131K<br>262K<br>524K<br>1M<br>2M<br>4M<br>Context Length<br>0<br>20<br>40<br>60<br>Accuracy<br>Base<br>~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)||S|~~RL~~<br>RL|~~M~~<br>M (n|o sub|-call)||||||
|1K<br>2K<br>4K<br>8K<br>16K<br>32K<br>65K<br>131K<br>262K<br>524K<br>1M<br>2M<br>4M<br>Context Length<br>0<br>20<br>40<br>60<br>Accuracy<br>Base<br>~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)||||||||||||



100


80


60


40


20


0




|100<br>30<br>RLM<br>RLM 80<br>20 (no sub-call) (pp) (%)<br>SRLM +28.5 60<br>SRLM (no sub-call) +19.5 Base Accuracy<br>10 +11.9+9.5 40<br>+5.4<br>-0.9 -1.6 vs<br>0 -6.8 20 ∆<br>0<br>< 131K 131K 1K 2K 4K 8K 16K 32K KKKK 1M 2M 4M<br>26365 421<br>521<br>Context Length Context Length|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|0<br>10<br>20<br>30<br>∆ vs Base (pp)<br>< 131K<br> 131K<br>Context Length<br>-0.9<br>-6.8<br>+5.4<br>-1.6<br>~~+11.9~~+9.5<br>+28.5<br>+19.5<br>RLM<br>RLM<br>(no sub-call)<br>SRLM<br>SRLM<br>(no sub-call)<br><br>1K<br>2K<br>4K<br>8K<br>16K<br>32K<br>65K<br>131K<br>262K<br>524K<br>1M<br>2M<br>4M<br>Context Length<br>0<br>20<br>40<br>60<br>80<br>100<br>Accuracy (%)|||||||||||||
|0<br>10<br>20<br>30<br>∆ vs Base (pp)<br>< 131K<br> 131K<br>Context Length<br>-0.9<br>-6.8<br>+5.4<br>-1.6<br>~~+11.9~~+9.5<br>+28.5<br>+19.5<br>RLM<br>RLM<br>(no sub-call)<br>SRLM<br>SRLM<br>(no sub-call)<br><br>1K<br>2K<br>4K<br>8K<br>16K<br>32K<br>65K<br>131K<br>262K<br>524K<br>1M<br>2M<br>4M<br>Context Length<br>0<br>20<br>40<br>60<br>80<br>100<br>Accuracy (%)|||||||||||||
|0<br>10<br>20<br>30<br>∆ vs Base (pp)<br>< 131K<br> 131K<br>Context Length<br>-0.9<br>-6.8<br>+5.4<br>-1.6<br>~~+11.9~~+9.5<br>+28.5<br>+19.5<br>RLM<br>RLM<br>(no sub-call)<br>SRLM<br>SRLM<br>(no sub-call)<br><br>1K<br>2K<br>4K<br>8K<br>16K<br>32K<br>65K<br>131K<br>262K<br>524K<br>1M<br>2M<br>4M<br>Context Length<br>0<br>20<br>40<br>60<br>80<br>100<br>Accuracy (%)|||||||||||||









Context Length





100


80


60


40


20


0


















|30 -5)|Col2|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
|0<br>10<br>20<br>30<br>|||||+30.|4+29.2|
|0<br>10<br>20<br>30<br>|-1.3-1.0<br>|-1.3-1.0<br>|+23.|424.|7||
|0<br>10<br>20<br>30<br>|-6.9-8|.1|||||


|30<br>20<br>10<br>0<br>10|Col2|Col3|Col4|+36+.233.4|Col6|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
|10<br>0<br>10<br>20<br>30<br>||||~~+36.2+33.4~~|~~+36.2+33.4~~|~~+36.~~|~~+36.~~|~~+36.~~|
|10<br>0<br>10<br>20<br>30<br>|+3.8+3.1|+3.8+3.1|+3.8+3.1|+23.|7+19.|9|||
|10<br>0<br>10<br>20<br>30<br>|~~-6.0~~|-12.0|||||||
|10<br>0<br>10<br>20<br>30<br>|||||||||



Context Length



Context Length



LongBench-v2 (Qwen3-Coder-480B)





Context Length



Context Length



Figure 2: Performance across context lengths on OOLONG and LongBench-v2 Full datasets: Line
plots show accuracy of SRLM, RLM, and the base LLM across context from thousands to millions of
tokens using GPT-5 **(left)** and Qwen3-Coder-480B **(right)** backbones. Bar plots show the average
performance gain over the base model, separated into contexts within ( _<_ 131K) and near/beyond
( _≥_ 131K) the native context window.


**3.5** **Robustness** **Across** **Context** **Lengths**


Next, we investigate how context length affects the behavior of each method. To this end, we
run additional experiments on the full LongBench-v2 and OOLONG datasets, covering contexts
from thousand to millions of tokens. Figure 2 compares SRLM, RLM, and the base LLM across
context lengths. We also demonstrate the performance gap relative to the base model (∆ vs. base),
separating results for shorter contexts well within the model’s context window ( _<_ 131K), and longer
contexts near or beyond the context limit ( _≥_ 131K). From these results, we observe several interesting
patterns. First, the advantage of SRLM becomes more pronounced as context length increases. On
longer contexts, SRLM consistently provides better gains over the base model than RLM. Second,
RLM is noticeably more sensitive to context length. On shorter contexts (for example <131K), RLM
often underperforms the base model, indicating that recursive decomposition may not be effective
on all contexts and can introduce unnecessary overhead when the context is already manageable. In
contrast, SRLM remains robust and provides more consistent gains over the base model on both
short and long contexts. For more detailed results over backbones and tasks, check Appendix C.1.


**3.6** **Is** **Recursion** **the** **Primary** **Driver** **of** **Performance** **in** **RLMs?**


One of the key motivations and a central question to this study is whether recursion is the main source
of gains in recursive language models (RLMs), particularly in long-context settings. Understanding
this can help toward guiding the design of more effective frameworks. Conceptually, recursion can be
viewed as a form of inference-time scaling through model as a tool use, i.e., the model decomposes
the problem into sub-queries and recursively calls itself as a tool to interact with different parts of


8


the context. In contrast, our self-reflective variant (SRLM without sub-calls) performs inference-time
scaling through model’s internals. Instead of explicitly issuing recursive tool sub-calls, it relies on
implicit uncertainty-guided self-reflection to revise and refine its context-interaction programs. To
study the above research question, we focus on the comparison of context-interaction recursive
programming (RLM with sub-calls) and self-reflective programming (SRLM without sub-calls) on
long-context settings ( _≥_ 131K tokens) across various datasets and backbones.


48


crease over RLM which runs only one trajectory. This

42

suggests that recursion may not be the best strategy 60

40

for inference-time scaling in long-context interactions,

50

38

as explicit self-querying and sub-calls introduce ad
|Col1|Col2|Col3|
|---|---|---|
||RLM<br>|RLM<br>|
||~~SRL~~<br>(no<br>Lon|~~M~~<br> sub-call)<br>gBench-v2<br>|
||OO<br>Bro<br>|LONG<br>wseComp+<br><br>|
||~~(1K~~||
||||
||||
||||


|Col1|Col2|Col3|Col4|Col5|Col6|
|---|---|---|---|---|---|
|||||||
|||||||
|||||||
|||||||
|||||||
|||||||
|||||||
|||||||



Time (min) Time (min)

gains. This trend is also reflected in Table 1 results.
In cases where recursion helps, most of the gains Figure 3: Accuracy versus cost pareto comparover the base model come from the programmatic ison of RLM and SRLM (no sub-call) on longcontext-interaction procedure rather than recursion. context settings of benchmarks under GPT-5
For example, on LongBench CodeQA with Qwen3- ( **left** ) and Qwen3-Coder-480B ( **right** ).
Coder-480B, performance improves from 20 to 53 _._ 8
with RLM without sub-calls, and only further to 59 _._ 8
with recursive sub-calls which can be obtained with SRLM without sub-calls as an alternative inference time scaling method, indicating that recursion contributes only marginal gains in long-context
frameworks.







50


48


46


44


42


40


38



90



80



70





60



50



Time (min)



Time (min)



Figure 3: Accuracy versus cost pareto comparison of RLM and SRLM (no sub-call) on longcontext settings of benchmarks under GPT-5
( **left** ) and Qwen3-Coder-480B ( **right** ).



**3.7** **Task** **Semantics** **and** **Limits** **of** **Recursion**



Beyond overall long-context performance, it is important to examine how recursion and self-reflection
behave across tasks of different natures. The tasks
studied in [75] (including OOLONG, BrowseComp+,
and LongBench-v2 Code Repository QA) are largely
search-oriented. For example, in the LongBench-v2
evaluation, experiments were restricted to the Code
QA category, where answering a question typically requires locating specific information across structured
repository files. These long contexts are modular
and well-organized, making them naturally suitable
for recursive and programmatic traversal. However,
LongBench-v2 covers a much broader set of domains
beyond code QA, including document QA, dialogue
history QA, in-context learning, and others. Many
of these tasks are less about finding relevant pieces
of information and more about understanding and
integrating evidence distributed throughout the entire
context. To better understand the robustness and


9



LongBench-v2 Domains



Code Repository



QA



QA













QA





















In-Context



Learning



Figure 4: Comparison of SRLM, RLM, and
Base LLM across LongBench-v2 domains (averaged across backbone models). In general,
SRLM variants show more consistent gains
on tasks with different semantic nature.


45


40


35


30



|OOLONG|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C|rb.<br>onf.<br>|+Tr<br>|ace<br>Len.|+Se<br>Con|lf-<br>sist.|SR|LM||
||||||||||


Verbalized Confidence



60


55


50





75


70


65


60



100


80


60


40


20



|LongBench-v2|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C|rb.<br>onf.<br>|+Tr<br>|ace<br>Len.|+Se<br>Con|lf-<br>sist.|SR|LM||
||||||||||
|36.7<br>i<br>|76.0<br>81<br>ment<br>Con|.6<br><br>V<br>s <br>ri|84.8<br>86.4<br>erbalize<br>acros<br>buti|88.3<br>d Co<br>s <br>n|90.7<br>9<br> nfidence<br>SRL<br> of e|2.9<br> <br>M<br>c|94.8<br>97.8<br>’s va<br> un|ri<br>|


signals guiding self-reflection in SRLM.

|BrowseComp+ (1K)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C|rb.<br>onf.<br>|+Tr<br>|ace<br>Len.|+Se<br>Con|lf-<br>sist.|SR|LM||
||||||||||
|26.6<br> (<br>nt<br>vi|61.2<br>72<br>aver<br>y sig<br>oral|.6<br><br>V<br>ag<br>n<br>un|78.1<br>81.8<br>erbalize<br>ed a<br>al an<br>cert|84.4<br>d Co<br>cro<br>d <br>ain|86.1<br>8<br> nfidence<br>ss b<br>their<br>ty a|8.0<br> <br>ac<br> c<br>s|90.7<br>96.0<br>kbon<br>omb<br>fne-g|e<br>in<br>r|



consistency of different methods across diverse long-context tasks, we extend our evaluation to these
additional LongBench-v2 domains.
Figure 4 shows the performance of each method by domain on LongBench-v2 dataset (averaged across
backbones). We observe that the impact of recursion varies substantially with task type. Recursion
is particularly more effective for structured, search-oriented tasks such as Code QA and Structured
Data QA, but less beneficial for more semantically demanding tasks like Dialogue History QA and
Document QA. In contrast, self-reflection in SRLM variants provides more consistent performance
gains across all task categories. By leveraging the model’s internal uncertainty signals, self-reflective
programming offers a stronger semantic steering mechanism for context interaction. This enables it
to adapt more effectively to tasks that require different levels and types of semantic understanding.


**3.8** **Ablation** **Study**


In this section, we perform ablations on the self-reflection mechanism of SRLM to understand
the contribution of its components. Figure 5 reports results on OOLONG, LongBench-v2, and
BrowseComp+ (1K) under long-context settings ( _≥_ 131K tokens), aggregated across model backbones
and runs with and without recursive sub-calls. SRLM leverages three complementary uncertainty
signals during self-reflection: (1) sampling-based self-consistency, (2) semantic uncertainty captured
through verbalized confidence, and (3) behavioral uncertainty measured by the length of the reasoning
trace. The top row of Figure 5 shows the impact of each component. As it can be observed, the
full SRLM configuration consistently outperforms variants using individual signals, indicating that
these uncertainty sources provide complementary benefits. The bottom row of Figure 5 examines
the relation between fine-grained uncertainty metrics (verbalized confidence and reasoning trace
length) and accuracy under bins with same samples. As it can be observed, performance depends
jointly on both signals, and their relation with accuracy is not strictly linear. In other words, high
confidence or short traces alone do not reliably indicate correctness, however, their combination
seem to provide a stronger self-reflection signal in the scope of long-context.


10


### **4 Related Works**

**Context** **Window** **Expansion** A widely adopted approach for handling long contexts in language
models has been to increase the maximum context window through architectural modifications or
training strategies. For example, advancements in positional encoding and attention scaling have
enabled models to process substantially longer inputs [9, 14, 43]. Beyond these techniques, several
architectural directions have been explored to further improve long-context scalability, including
sparsity-based mechanisms [57, 21, 36], state-space models [22, 12, 61], retrieval-augmented finetuning [32, 62], and key–value (KV) cache compression techniques [18]. Collectively, these methods
aim to improve the scalability of language models with respect to input length and enable effective
yet efficient inference over long contexts. Despite these advances, extending the context window
alone does not fully address the challenges of long-context reasoning. Recent empirical studies
show that model performance remains constrained by the effective context length. For example,
LongBench-v2 [3] finds that frontier models with extended context windows still struggle on realistic
long-context multitask benchmarks, achieving only modest improvements once input lengths exceed
certain context thresholds. These results suggest that scaling the context window, while helpful, is
insufficient to guarantee robust reasoning over very large contexts in real-world settings.


**Agentic** **Long-Context** **Approaches.** There has been an alternative line of research to complement earlier long-context handling approaches with inference-time strategies. Recent works
treat long-context as a procedural and agentic problem, leveraging LLMs as tools invoked through
programmatic strategies that iteratively interact with context. For example, Recursive Language
Model (RLM) [75] utilize this idea by treating the context and input prompt as a variable in an
external programming environment that can be decomposed, queried, and recursively processed
through program execution. RLMs show significant benefits over monolithic prompting and context summarization methods on several long-context benchmarks, demonstrating the effectiveness
of programmatic context interaction. Related approaches include code-execution agents, such as
CodeAct [63] which enable iterative code generation and execution for flexible search over context,
as well as summarization-based agents such as ReSum [66] that periodically compress interaction
histories in agentic web search. There are also existing works on memory-augmented agents that
introduce explicit long-term storage to better extract and retrieve salient information across long
interactions, e.g., Mem0 [11] and G-Memory [77]. While these agentic and programmatic approaches
to long-context tasks show promise, their decisions about what to read, summarize, or revisit
typically rely on surface-level heuristics rather than semantic understanding. Consequently, they
perform better at structurally localized tasks but struggle with semantically dense ones requiring
deep comprehension more than search.


**Long-Context** **Evaluation.** A growing body of work in literature has focused on evaluating LLMs
under long-context settings. Benchmarks such as LongBench [4], and its successor LongBench v2 [3]
evaluate realistic tasks involving long documents, dialogues, and codebases, revealing substantial
performance degradation as context length increases. Complementary benchmarks emphasize different
stressors. For example, Single Needle in a Haystack (S-NIAH) [25] tasks test retrieval robustness at
extreme lengths, where most of the context is irrelevant. In contrast, benchmarks like OOLONG [6]
explicitly target long-context reasoning and aggregation, requiring models to process and combine
information across all parts of the long iputs. BrowseComp [65] and BrowseComp-Plus [10] also
further extend the long-context evaluation to agentic and deep-research settings, where models must
persistently navigate, remember, and integrate information across many documents or browsing steps.


11


Collectively, these benchmarks show that long-context reasoning remains a ubiquitous challenge for
frontier models across a wide range of diverse and practically important tasks.


**Confidence** **Estimation** **in** **Large** **Language** **Models.** Estimating model confidence is an
important component for enabling reliable reasoning and self-correction in language models. A
growing body of work studies how uncertainty signals can be extracted from LLMs without requiring
additional fine-tuning. One line of work leverages multiple samples from the model’s predictive
distribution to estimate uncertainty via agreement across generations, commonly referred to as
sampling-based confidence or self-consistency [64, 35, 42]. In this setting, the empirical frequency
of an answer across sampled outputs provides a natural estimate of the model’s confidence in that
prediction. Another direction investigates the model’s ability to explicitly report its own uncertainty.
Several recent studies evaluate this called as verbalized confidence, where the model is prompted to
provide calibrated confidence scores alongside its predictions [68, 72]. Empirical comparisons suggest
that self-verbalized confidence can serve as a strong and more semantic zero-shot uncertainty estimator
and often outperforms approaches based solely on token probabilities or sampling statistics [58].
Other approaches estimate uncertainty using internal model signals such as token likelihoods [16]
or learned probes over hidden representations [76]. More recently, work in the reasoning literature
has identified behavioral signals in the generation process of recent frontier models that correlate
with model uncertainty. In particular, several studies observe that incorrect reasoning trajectories
tend to be longer and more deliberative than correct ones [44, 5]. This phenomenon suggests that
reasoning trace length can serve as an implicit proxy for epistemic uncertainty [13, 60]. While prior
work has primarily exploited this observation to improve reasoning efficiency or reduce unnecessary
deliberation [50, 23], it also provides a useful signal for identifying reliable reasoning trajectories. Our
work builds on these insights and leverages multiple complementary uncertainty signals, including
sampling-based consistency, verbalized confidence, and behavioral indicators from reasoning lengths,
to guide uncertainty-aware self-reflection during program search for long context interaction.

### **5 Conclusion**


In this paper, we study long-context reasoning through the perspective of context-interaction
programming. We introduce SRLM, a self-reflective program search framework that uses intrinsic
uncertainty signals—self-consistency, reasoning trace length, and verbalized confidence—to guide
how models interact with long contexts. Across diverse benchmarks, context lengths, and backbone
models, SRLM consistently improves performance, achieving gains of up to 22% over the prior
state-of-the-art approach RLM. Our analysis further suggests that recursive decomposition alone is
not the main factor behind the performance of Recursive Language Models (RLMs). Instead, the
improvements appear to stem from the external programmatic way of handling context interaction.
When guided by self-reflection, these programs provide a more reliable way for models to navigate
and reason over long contexts. In general, SRLM provides more consistent performance gains than
RLM across most settings. Notably, it improves performance not only in long-context scenarios but
also in shorter contexts within the model’s context window, where RLM has been observed to hurt
performance. SRLM is also more effective than RLM on semantically demanding problems that
require deeper contextual comprehension of the context beyond heuristic program search.
Additionally, in this paper, we have employed a relatively simple form of self-reflection based on
intrinsic uncertainty signals to guide programmatic context interaction. While effective, this design
represents a limitation of our approach and leaves room for future research. Future work could explore
richer forms of intrinsic self-reflection within programmatic context-interaction frameworks beyond


12


explicit recursive sub-calls, as well as designs that integrate decision-making with self-reflective signals
to enable earlier termination of reasoning and improved control over token usage. We hope these
findings highlight the importance of context-interaction programming for long-context reasoning
and suggest that leveraging models’ self-reflective signals is a promising direction for improving
long-context capabilities in language models.

### **References**


[1] Shengnan An, Zexiong Ma, Zeqi Lin, Nanning Zheng, and Jian-Guang Lou. Make your llm
fully utilize the context, 2024.


[2] N. N. Author. Suppressed for anonymity, 2021.


[3] Y Bai, S Tu, J Zhang, H Peng, X Wang, X Lv, S Cao, J Xu, L Hou, Y Dong, et al. Longbenchv2:
Towards deeper understanding and reasoning on realistic long-context multitasks. _ArXiv,_
_abs/2412.15204,_ _2024b._ _URL_ _https://api._ _semanticscholar._ _org/CorpusID_, 274859535, 2024.


[4] Yushi Bai, Xin Lv, Jiajie Zhang, Hongchang Lyu, Jiankai Tang, Zhidian Huang, Zhengxiao
Du, Xiao Liu, Aohan Zeng, Lei Hou, Yuxiao Dong, Jie Tang, and Juanzi Li. Longbench: A
bilingual, multitask benchmark for long context understanding, 2024.


[5] Marthe Ballon, Andres Algaba, and Vincent Ginis. The relationship between reasoning and
performance in large language models–o3 (mini) thinks harder, not longer. _arXiv_ _preprint_
_arXiv:2502.15631_, 2025.


[6] Amanda Bertsch, Adithya Pratapa, Teruko Mitamura, Graham Neubig, and Matthew R
Gormley. Oolong: Evaluating long context reasoning and aggregation capabilities. _arXiv_
_preprint_ _arXiv:2511.02817_, 2025.


[7] Eric Bigelow, Ari Holtzman, Hidenori Tanaka, and Tomer Ullman. Forking paths in neural text
generation, 2024.


[8] Shouyuan Chen, Sherman Wong, Liangjian Chen, and Yuandong Tian. Extending context
window of large language models via positional interpolation. _arXiv_ _preprint_ _arXiv:2306.15595_,
2023.


[9] Yukang Chen, Shengju Qian, Haotian Tang, Xin Lai, Zhijian Liu, Song Han, and Jiaya
Jia. Longlora: Efficient fine-tuning of long-context large language models. _arXiv_ _preprint_
_arXiv:2309.12307_, 2023.


[10] Zijian Chen, Xueguang Ma, Shengyao Zhuang, Ping Nie, Kai Zou, Andrew Liu, Joshua Green,
Kshama Patel, Ruoxi Meng, Mingyi Su, et al. Browsecomp-plus: A more fair and transparent
evaluation benchmark of deep-research agent. _arXiv_ _preprint_ _arXiv:2508.06600_, 2025.


[11] Prateek Chhikara, Dev Khant, Saket Aryan, Taranjeet Singh, and Deshraj Yadav. Mem0: Building production-ready ai agents with scalable long-term memory. _arXiv preprint arXiv:2504.19413_,
2025.


[12] Tri Dao and Albert Gu. Transformers are ssms: Generalized models and efficient algorithms
through structured state space duality. _arXiv_ _preprint_ _arXiv:2405.21060_, 2024.


13


[13] Siddartha Devic, Charlotte Peale, Arwen Bradley, Sinead Williamson, Preetum Nakkiran, and
Aravind Gollakota. Trace length is a simple uncertainty signal in reasoning models. _arXiv_
_preprint_ _arXiv:2510.10409_, 2025.


[14] Yiran Ding, Li Lyna Zhang, Chengruidong Zhang, Yuanyuan Xu, Ning Shang, Jiahang Xu, Fan
Yang, and Mao Yang. Longrope: Extending llm context window beyond 2 million tokens. _arXiv_
_preprint_ _arXiv:2402.13753_, 2024.


[15] Yufeng Du, Minyang Tian, Srikanth Ronanki, Subendhu Rongali, Sravan Bodapati, Aram
Galstyan, Azton Wells, Roy Schwartz, Eliu A Huerta, and Hao Peng. Context length alone
hurts llm performance despite perfect retrieval, 2025.


[16] Jinhao Duan, Hao Cheng, Shiqi Wang, Alex Zavalny, Chenan Wang, Renjing Xu, Bhavya
Kailkhura, and Kaidi Xu. Shifting attention to relevance: Towards the predictive uncertainty
quantification of free-form large language models. In _Proceedings_ _of_ _the_ _62nd_ _Annual_ _Meeting_ _of_
_the_ _Association_ _for_ _Computational_ _Linguistics_ _(Volume_ _1:_ _Long_ _Papers)_, pages 5050–5063, 2024.


[17] R. O. Duda, P. E. Hart, and D. G. Stork. _Pattern_ _Classification_ . John Wiley and Sons, 2nd
edition, 2000.


[18] Sabri Eyuboglu, Ryan Ehrlich, Simran Arora, Neel Guha, Dylan Zinsley, Emily Liu, Will Tennien,
Atri Rudra, James Zou, Azalia Mirhoseini, et al. Cartridges: Lightweight and general-purpose
long context representations via self-study. _arXiv_ _preprint_ _arXiv:2506.06266_, 2025.


[19] Sebastian Farquhar, Jannik Kossen, Lorenz Kuhn, and Yarin Gal. Detecting hallucinations in
large language models using semantic entropy. _Nature_, 630(8017):625–630, 2024.


[20] Yao Fu, Rameswar Panda, Xinyao Niu, Xiang Yue, Hannaneh Hajishirzi, Yoon Kim, and
Hao Peng. Data engineering for scaling language models to 128k context. _arXiv_ _preprint_
_arXiv:2402.10171_, 2024.


[21] Yizhao Gao, Zhichen Zeng, Dayou Du, Shijie Cao, Peiyuan Zhou, Jiaxing Qi, Junjie Lai, Hayden
Kwok-Hay So, Ting Cao, Fan Yang, et al. Seerattention: Learning intrinsic sparse attention in
your llms. _arXiv_ _preprint_ _arXiv:2410.13276_, 2024.


[22] Albert Gu and Tri Dao. Mamba: Linear-time sequence modeling with selective state spaces.
arxiv. _arXiv_ _preprint_ _arXiv:2312.00752_, 10, 2023.


[23] Michael Hassid, Gabriel Synnaeve, Yossi Adi, and Roy Schwartz. Don’t overthink it. preferring
shorter thinking chains for improved llm reasoning. _arXiv_ _preprint_ _arXiv:2505.17813_, 2025.


[24] Kelly Hong, Anton Troynikov, and Jeff Huber. Context rot: How increasing input tokens
impacts llm performance. Technical report, Chroma Research, July 2025.


[25] Cheng-Ping Hsieh, Simeng Sun, Samuel Kriman, Shantanu Acharya, Dima Rekesh, Fei Jia,
Yang Zhang, and Boris Ginsburg. Ruler: What’s the real context size of your long-context
language models? _arXiv_ _preprint_ _arXiv:2404.06654_, 2024.


[26] Chengsong Huang, Langlin Huang, Jixuan Leng, Jiacheng Liu, and Jiaxin Huang. CaTS:
Calibrated test-time scaling for efficient LLM inference. In _The_ _Fourteenth_ _International_
_Conference_ _on_ _Learning_ _Representations_, 2026.


14


[27] Yuxuan Huang, Yihang Chen, Haozheng Zhang, Kang Li, Huichi Zhou, Meng Fang, Linyi Yang,
Xiaoguang Li, Lifeng Shang, Songcen Xu, Jianye Hao, Kun Shao, and Jun Wang. Deep research
agents: A systematic examination and roadmap, 2025.


[28] Aaron Hurst, Adam Lerer, Adam P Goucher, Adam Perelman, Aditya Ramesh, Aidan Clark,
AJ Ostrow, Akila Welihinda, Alan Hayes, Alec Radford, et al. Gpt-4o system card. _arXiv_
_preprint_ _arXiv:2410.21276_, 2024.


[29] Aaron Jaech, Adam Kalai, Adam Lerer, Adam Richardson, Ahmed El-Kishky, Aiden Low, Alec
Helyar, Aleksander Madry, Alex Beutel, Alex Carney, et al. Openai o1 system card. _arXiv_
_preprint_ _arXiv:2412.16720_, 2024.


[30] Carlos E Jimenez, John Yang, Alexander Wettig, Shunyu Yao, Kexin Pei, Ofir Press, and
Karthik Narasimhan. Swe-bench: Can language models resolve real-world github issues? _arXiv_
_preprint_ _arXiv:2310.06770_, 2023.


[31] Carlos E. Jimenez, John Yang, Alexander Wettig, Shunyu Yao, Kexin Pei, Ofir Press, and
Karthik Narasimhan. Swe-bench: Can language models resolve real-world github issues?, 2024.


[32] Bowen Jin, Jinsung Yoon, Jiawei Han, and Sercan O Arik. Long-context llms meet rag:
Overcoming challenges for long inputs in rag. _arXiv_ _preprint_ _arXiv:2410.05983_, 2024.


[33] M. J. Kearns. _Computational_ _Complexity_ _of_ _Machine_ _Learning_ . PhD thesis, Department of
Computer Science, Harvard University, 1989.


[34] Jannik Kossen, Jiatong Han, Muhammed Razzak, Lisa Schut, Shreshth Malik, and Yarin Gal.
Semantic entropy probes: Robust and cheap hallucination detection in llms. _arXiv_ _preprint_
_arXiv:2406.15927_, 2024.


[35] Lorenz Kuhn, Yarin Gal, and Sebastian Farquhar. Semantic uncertainty: Linguistic invariances
for uncertainty estimation in natural language generation, 2023.


[36] Xunhao Lai, Jianqiao Lu, Yao Luo, Yiyuan Ma, and Xun Zhou. Flexprefill: A contextaware sparse attention mechanism for efficient long-sequence inference. _arXiv_ _preprint_
_arXiv:2502.20766_, 2025.


[37] P. Langley. Crafting papers on machine learning. In Pat Langley, editor, _Proceedings_ _of_ _the_
_17th_ _International_ _Conference_ _on_ _Machine_ _Learning_ _(ICML_ _2000)_, pages 1207–1216, Stanford,
CA, 2000. Morgan Kaufmann.


[38] Yuhong Li, Yingbing Huang, Bowen Yang, Bharat Venkitesh, Acyr Locatelli, Hanchen Ye,
Tianle Cai, Patrick Lewis, and Deming Chen. Snapkv: Llm knows what you are looking for
before generation. _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_, 37:22947–22970, 2024.


[39] Stephanie Lin, Jacob Hilton, and Owain Evans. Teaching models to express their uncertainty
in words, 2022.


[40] Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni,
and Percy Liang. Lost in the middle: How language models use long contexts, 2023.


[41] Qing Lyu, Kumar Shridhar, Chaitanya Malaviya, Li Zhang, Yanai Elazar, Niket Tandon,
Marianna Apidianaki, Mrinmaya Sachan, and Chris Callison-Burch. Calibrating large language
models with sample consistency, 2024.


15


[42] Potsawee Manakul, Adian Liusie, and Mark J. F. Gales. Selfcheckgpt: Zero-resource black-box
hallucination detection for generative large language models, 2023.


[43] Yansheng Mao, Yufei Xu, Jiaqi Li, Fanxu Meng, Haotong Yang, Zilong Zheng, Xiyuan Wang,
and Muhan Zhang. Lift: Improving long context understanding of large language models
through long input fine-tuning. _arXiv_ _preprint_ _arXiv:2502.14644_, 2025.


[44] Sara Vera Marjanović, Arkil Patel, Vaibhav Adlakha, Milad Aghajohari, Parishad
BehnamGhader, Mehar Bhatia, Aditi Khandelwal, Austin Kraft, Benno Krojer, Xing Han
Lù, et al. Deepseek-r1 thoughtology: Let’s think about llm reasoning. _arXiv_ _preprint_
_arXiv:2504.07128_, 2025.


[45] R. S. Michalski, J. G. Carbonell, and T. M. Mitchell, editors. _Machine_ _Learning:_ _An_ _Artificial_
_Intelligence_ _Approach,_ _Vol._ _I_ . Tioga, Palo Alto, CA, 1983.


[46] T. M. Mitchell. The need for biases in learning generalizations. Technical report, Computer
Science Department, Rutgers University, New Brunswick, MA, 1980.


[47] A. Newell and P. S. Rosenbloom. Mechanisms of skill acquisition and the law of practice. In
J. R. Anderson, editor, _Cognitive_ _Skills_ _and_ _Their_ _Acquisition_, chapter 1, pages 1–51. Lawrence
Erlbaum Associates, Inc., Hillsdale, NJ, 1981.


[48] OpenAI. Deep research. `[https://openai.com/index/introducing-deepresearch/](https://openai.com/index/introducing-deepresearch/)`, 2025.
AI-powered research assistant tool.


[49] Litu Ou, Kuan Li, Huifeng Yin, Liwen Zhang, Zhongwang Zhang, Xixi Wu, Rui Ye, Zile Qiao,
Pengjun Xie, Jingren Zhou, and Yong Jiang. Browseconf: Confidence-guided test-time scaling
for web agents, 2025.


[50] Yuxiao Qu, Matthew YR Yang, Amrith Setlur, Lewis Tunstall, Edward Emanuel Beeching,
Ruslan Salakhutdinov, and Aviral Kumar. Optimizing test-time compute via meta reinforcement
fine-tuning. _arXiv_ _preprint_ _arXiv:2503.07572_, 2025.


[51] Stephen Robertson and Hugo Zaragoza. _The_ _probabilistic_ _relevance_ _framework:_ _BM25_ _and_
_beyond_, volume 4. Now Publishers Inc, 2009.


[52] A. L. Samuel. Some studies in machine learning using the game of checkers. _IBM_ _Journal_ _of_
_Research_ _and_ _Development_, 3(3):211–229, 1959.


[53] Tobias Schnabel, Kiran Tomlinson, Adith Swaminathan, and Jennifer Neville. Lost in transmission: When and why llms fail to reason globally, 2025.


[54] Parshin Shojaee, Iman Mirzadeh, Keivan Alizadeh, Maxwell Horton, Samy Bengio, and Mehrdad
Farajtabar. The illusion of thinking: Understanding the strengths and limitations of reasoning
models via the lens of problem complexity. _arXiv_ _preprint_ _arXiv:2506.06941_, 2025.


[55] Aaditya Singh, Adam Fry, Adam Perelman, Adam Tart, Adi Ganesh, Ahmed El-Kishky, Aidan
McLaughlin, Aiden Low, AJ Ostrow, Akhila Ananthram, Akshay Nathan, Alan Luo, Alec Helyar,
Aleksander Madry, Aleksandr Efremov, Aleksandra Spyra, Alex Baker-Whitcomb, Alex Beutel,
Alex Karpenko, Alex Makelov, Alex Neitz, Alex Wei, Alexandra Barr, Alexandre Kirchmeyer,
Alexey Ivanov, Alexi Christakis, Alistair Gillespie, Allison Tam, Ally Bennett, Alvin Wan,
Alyssa Huang, Amy McDonald Sandjideh, Amy Yang, Ananya Kumar, Andre Saraiva, Andrea


16


Vallone, Andrei Gheorghe, Andres Garcia Garcia, Andrew Braunstein, Andrew Liu, Andrew
Schmidt, Andrey Mereskin, Andrey Mishchenko, Andy Applebaum, Andy Rogerson, Ann Rajan,
Annie Wei, Anoop Kotha, Anubha Srivastava, Anushree Agrawal, Arun Vijayvergiya, Ashley
Tyra, Ashvin Nair, Avi Nayak, Ben Eggers, Bessie Ji, Beth Hoover, Bill Chen, Blair Chen,
Boaz Barak, Borys Minaiev, Botao Hao, Bowen Baker, Brad Lightcap, Brandon McKinzie,
Brandon Wang, Brendan Quinn, Brian Fioca, Brian Hsu, Brian Yang, Brian Yu, Brian Zhang,
Brittany Brenner, Callie Riggins Zetino, Cameron Raymond, Camillo Lugaresi, Carolina Paz,
Cary Hudson, Cedric Whitney, Chak Li, Charles Chen, Charlotte Cole, Chelsea Voss, Chen
Ding, Chen Shen, Chengdu Huang, Chris Colby, Chris Hallacy, Chris Koch, Chris Lu, Christina
Kaplan, Christina Kim, CJ Minott-Henriques, Cliff Frey, Cody Yu, Coley Czarnecki, Colin
Reid, Colin Wei, Cory Decareaux, Cristina Scheau, Cyril Zhang, Cyrus Forbes, Da Tang,
Dakota Goldberg, Dan Roberts, Dana Palmie, Daniel Kappler, Daniel Levine, Daniel Wright,
Dave Leo, David Lin, David Robinson, Declan Grabb, Derek Chen, Derek Lim, Derek Salama,
Dibya Bhattacharjee, Dimitris Tsipras, Dinghua Li, Dingli Yu, DJ Strouse, Drew Williams,
Dylan Hunn, Ed Bayes, Edwin Arbus, Ekin Akyurek, Elaine Ya Le, Elana Widmann, Eli Yani,
Elizabeth Proehl, Enis Sert, Enoch Cheung, Eri Schwartz, Eric Han, Eric Jiang, Eric Mitchell,
Eric Sigler, Eric Wallace, Erik Ritter, Erin Kavanaugh, Evan Mays, Evgenii Nikishin, Fangyuan
Li, Felipe Petroski Such, Filipe de Avila Belbute Peres, Filippo Raso, Florent Bekerman, Foivos
Tsimpourlas, Fotis Chantzis, Francis Song, Francis Zhang, Gaby Raila, Garrett McGrath,
Gary Briggs, Gary Yang, Giambattista Parascandolo, Gildas Chabot, Grace Kim, Grace Zhao,
Gregory Valiant, Guillaume Leclerc, Hadi Salman, Hanson Wang, Hao Sheng, Haoming Jiang,
Haoyu Wang, Haozhun Jin, Harshit Sikchi, Heather Schmidt, Henry Aspegren, Honglin Chen,
Huida Qiu, Hunter Lightman, Ian Covert, Ian Kivlichan, Ian Silber, Ian Sohl, Ibrahim Hammoud,
Ignasi Clavera, Ikai Lan, Ilge Akkaya, Ilya Kostrikov, Irina Kofman, Isak Etinger, Ishaan Singal,
Jackie Hehir, Jacob Huh, Jacqueline Pan, Jake Wilczynski, Jakub Pachocki, James Lee, James
Quinn, Jamie Kiros, Janvi Kalra, Jasmyn Samaroo, Jason Wang, Jason Wolfe, Jay Chen, Jay
Wang, Jean Harb, Jeffrey Han, Jeffrey Wang, Jennifer Zhao, Jeremy Chen, Jerene Yang, Jerry
Tworek, Jesse Chand, Jessica Landon, Jessica Liang, Ji Lin, Jiancheng Liu, Jianfeng Wang, Jie
Tang, Jihan Yin, Joanne Jang, Joel Morris, Joey Flynn, Johannes Ferstad, Johannes Heidecke,
John Fishbein, John Hallman, Jonah Grant, Jonathan Chien, Jonathan Gordon, Jongsoo Park,
Jordan Liss, Jos Kraaijeveld, Joseph Guay, Joseph Mo, Josh Lawson, Josh McGrath, Joshua
Vendrow, Joy Jiao, Julian Lee, Julie Steele, Julie Wang, Junhua Mao, Kai Chen, Kai Hayashi,
Kai Xiao, Kamyar Salahi, Kan Wu, Karan Sekhri, Karan Sharma, Karan Singhal, Karen Li,
Kenny Nguyen, Keren Gu-Lemberg, Kevin King, Kevin Liu, Kevin Stone, Kevin Yu, Kristen
Ying, Kristian Georgiev, Kristie Lim, Kushal Tirumala, Kyle Miller, Lama Ahmad, Larry
Lv, Laura Clare, Laurance Fauconnet, Lauren Itow, Lauren Yang, Laurentia Romaniuk, Leah
Anise, Lee Byron, Leher Pathak, Leon Maksin, Leyan Lo, Leyton Ho, Li Jing, Liang Wu, Liang
Xiong, Lien Mamitsuka, Lin Yang, Lindsay McCallum, Lindsey Held, Liz Bourgeois, Logan
Engstrom, Lorenz Kuhn, Louis Feuvrier, Lu Zhang, Lucas Switzer, Lukas Kondraciuk, Lukasz
Kaiser, Manas Joglekar, Mandeep Singh, Mandip Shah, Manuka Stratta, Marcus Williams, Mark
Chen, Mark Sun, Marselus Cayton, Martin Li, Marvin Zhang, Marwan Aljubeh, Matt Nichols,
Matthew Haines, Max Schwarzer, Mayank Gupta, Meghan Shah, Melody Huang, Meng Dong,
Mengqing Wang, Mia Glaese, Micah Carroll, Michael Lampe, Michael Malek, Michael Sharman,
Michael Zhang, Michele Wang, Michelle Pokrass, Mihai Florian, Mikhail Pavlov, Miles Wang,
Ming Chen, Mingxuan Wang, Minnia Feng, Mo Bavarian, Molly Lin, Moose Abdool, Mostafa
Rohaninejad, Nacho Soto, Natalie Staudacher, Natan LaFontaine, Nathan Marwell, Nelson Liu,
Nick Preston, Nick Turley, Nicklas Ansman, Nicole Blades, Nikil Pancha, Nikita Mikhaylin,
Niko Felix, Nikunj Handa, Nishant Rai, Nitish Keskar, Noam Brown, Ofir Nachum, Oleg Boiko,


17


Oleg Murk, Olivia Watkins, Oona Gleeson, Pamela Mishkin, Patryk Lesiewicz, Paul Baltescu,
Pavel Belov, Peter Zhokhov, Philip Pronin, Phillip Guo, Phoebe Thacker, Qi Liu, Qiming
Yuan, Qinghua Liu, Rachel Dias, Rachel Puckett, Rahul Arora, Ravi Teja Mullapudi, Raz
Gaon, Reah Miyara, Rennie Song, Rishabh Aggarwal, RJ Marsan, Robel Yemiru, Robert Xiong,
Rohan Kshirsagar, Rohan Nuttall, Roman Tsiupa, Ronen Eldan, Rose Wang, Roshan James,
Roy Ziv, Rui Shu, Ruslan Nigmatullin, Saachi Jain, Saam Talaie, Sam Altman, Sam Arnesen,
Sam Toizer, Sam Toyer, Samuel Miserendino, Sandhini Agarwal, Sarah Yoo, Savannah Heon,
Scott Ethersmith, Sean Grove, Sean Taylor, Sebastien Bubeck, Sever Banesiu, Shaokyi Amdo,
Shengjia Zhao, Sherwin Wu, Shibani Santurkar, Shiyu Zhao, Shraman Ray Chaudhuri, Shreyas
Krishnaswamy, Shuaiqi, Xia, Shuyang Cheng, Shyamal Anadkat, Simón Posada Fishman, Simon
Tobin, Siyuan Fu, Somay Jain, Song Mei, Sonya Egoian, Spencer Kim, Spug Golden, SQ Mah,
Steph Lin, Stephen Imm, Steve Sharpe, Steve Yadlowsky, Sulman Choudhry, Sungwon Eum,
Suvansh Sanjeev, Tabarak Khan, Tal Stramer, Tao Wang, Tao Xin, Tarun Gogineni, Taya
Christianson, Ted Sanders, Tejal Patwardhan, Thomas Degry, Thomas Shadwell, Tianfu Fu,
Tianshi Gao, Timur Garipov, Tina Sriskandarajah, Toki Sherbakov, Tomer Kaftan, Tomo
Hiratsuka, Tongzhou Wang, Tony Song, Tony Zhao, Troy Peterson, Val Kharitonov, Victoria
Chernova, Vineet Kosaraju, Vishal Kuo, Vitchyr Pong, Vivek Verma, Vlad Petrov, Wanning
Jiang, Weixing Zhang, Wenda Zhou, Wenlei Xie, Wenting Zhan, Wes McCabe, Will DePue, Will
Ellsworth, Wulfie Bain, Wyatt Thompson, Xiangning Chen, Xiangyu Qi, Xin Xiang, Xinwei
Shi, Yann Dubois, Yaodong Yu, Yara Khakbaz, Yifan Wu, Yilei Qian, Yin Tat Lee, Yinbo
Chen, Yizhen Zhang, Yizhong Xiong, Yonglong Tian, Young Cha, Yu Bai, Yu Yang, Yuan Yuan,
Yuanzhi Li, Yufeng Zhang, Yuguang Yang, Yujia Jin, Yun Jiang, Yunyun Wang, Yushi Wang,
Yutian Liu, Zach Stubenvoll, Zehao Dou, Zheng Wu, and Zhigang Wang. Openai gpt-5 system
card, 2025.


[56] Weiwei Sun, Miao Lu, Zhan Ling, Kang Liu, Xuesong Yao, Yiming Yang, and Jiecao Chen.
Scaling long-horizon llm agent via context-folding, 2025.


[57] Jiaming Tang, Yilong Zhao, Kan Zhu, Guangxuan Xiao, Baris Kasikci, and Song Han. Quest:
Query-aware sparsity for efficient long-context llm inference. _arXiv_ _preprint_ _arXiv:2406.10774_,
2024.


[58] Linwei Tao, Yi-Fan Yeh, Minjing Dong, Tao Huang, Philip Torr, and Chang Xu. Revisiting
uncertainty estimation and calibration of large language models, 2025.


[59] Qwen Team. Qwen3 technical report, 2025.


[60] Arne Vanhoyweghen, Brecht Verbeken, Andres Algaba, and Vincent Ginis. Lexical hints of
accuracy in llm reasoning chains. _arXiv_ _preprint_ _arXiv:2508.15842_, 2025.


[61] Roger Waleffe, Wonmin Byeon, Duncan Riach, Brandon Norick, Vijay Korthikanti, Tri Dao,
Albert Gu, Ali Hatamizadeh, Sudhakar Singh, Deepak Narayanan, et al. An empirical study of
mamba-based language models. _arXiv_ _preprint_ _arXiv:2406.07887_, 2024.


[62] Weizhi Wang, Li Dong, Hao Cheng, Xiaodong Liu, Xifeng Yan, Jianfeng Gao, and Furu
Wei. Augmenting language models with long-term memory. _Advances_ _in_ _Neural_ _Information_
_Processing_ _Systems_, 36:74530–74543, 2023.


[63] Xingyao Wang, Yangyi Chen, Lifan Yuan, Yizhe Zhang, Yunzhu Li, Hao Peng, and Heng Ji.
Executable code actions elicit better llm agents. In _Forty-first_ _International_ _Conference_ _on_
_Machine_ _Learning_, 2024.


18


[64] Xuezhi Wang, Jason Wei, Dale Schuurmans, Quoc Le, Ed Chi, Sharan Narang, Aakanksha
Chowdhery, and Denny Zhou. Self-consistency improves chain of thought reasoning in language
models. _arXiv_ _preprint_ _arXiv:2203.11171_, 2022.


[65] Jason Wei, Zhiqing Sun, Spencer Papay, Scott McKinney, Jeffrey Han, Isa Fulford, Hyung Won
Chung, Alex Tachard Passos, William Fedus, and Amelia Glaese. Browsecomp: A simple yet
challenging benchmark for browsing agents. _arXiv_ _preprint_ _arXiv:2504.12516_, 2025.


[66] Xixi Wu, Kuan Li, Yida Zhao, Liwen Zhang, Litu Ou, Huifeng Yin, Zhongwang Zhang, Xinmiao
Yu, Dingchu Zhang, Yong Jiang, et al. Resum: Unlocking long-horizon search intelligence via
context summarization. _arXiv_ _preprint_ _arXiv:2509.13313_, 2025.


[67] Guangxuan Xiao, Yuandong Tian, Beidi Chen, Song Han, and Mike Lewis. Efficient streaming
language models with attention sinks. _arXiv_ _preprint_ _arXiv:2309.17453_, 2023.


[68] Miao Xiong, Zhiyuan Hu, Xinyang Lu, Yifei Li, Jie Fu, Junxian He, and Bryan Hooi. Can
llms express their uncertainty? an empirical evaluation of confidence elicitation in llms. _arXiv_
_preprint_ _arXiv:2306.13063_, 2023.


[69] Miao Xiong, Zhiyuan Hu, Xinyang Lu, Yifei Li, Jie Fu, Junxian He, and Bryan Hooi. Can llms
express their uncertainty? an empirical evaluation of confidence elicitation in llms, 2024.


[70] Daniel Yang, Yao-Hung Hubert Tsai, and Makoto Yamada. On verbalized confidence scores for
llms. _arXiv_ _preprint_ _arXiv:2412.14737_, 2024.


[71] Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik R Narasimhan, and Yuan
Cao. React: Synergizing reasoning and acting in language models. In _The_ _eleventh_ _international_
_conference_ _on_ _learning_ _representations_, 2022.


[72] Dongkeun Yoon, Seungone Kim, Sohee Yang, Sunkyoung Kim, Soyeon Kim, Yongil Kim, Eunbi
Choi, Yireun Kim, and Minjoon Seo. Reasoning models better express their confidence. _arXiv_
_preprint_ _arXiv:2505.14489_, 2025.


[73] Hongli Yu, Tinghong Chen, Jiangtao Feng, Jiangjie Chen, Weinan Dai, Qiying Yu, Ya-Qin
Zhang, Wei-Ying Ma, Jingjing Liu, Mingxuan Wang, et al. Memagent: Reshaping long-context
llm with multi-conv rl-based memory agent. _arXiv_ _preprint_ _arXiv:2507.02259_, 2025.


[74] Qingcheng Zeng, Weihao Xuan, Leyang Cui, and Rob Voigt. Thinking out loud: Do reasoning
models know when they’re right? In _Proceedings_ _of_ _the_ _2025_ _Conference_ _on_ _Empirical_ _Methods_
_in_ _Natural_ _Language_ _Processing_, pages 1394–1407, 2025.


[75] Alex L Zhang, Tim Kraska, and Omar Khattab. Recursive language models. _arXiv_ _preprint_
_arXiv:2512.24601_, 2025.


[76] Anqi Zhang, Yulin Chen, Jane Pan, Chen Zhao, Aurojit Panda, Jinyang Li, and He He.
Reasoning models know when they’re right: Probing hidden states for self-verification. _arXiv_
_preprint_ _arXiv:2504.05419_, 2025.


[77] Guibin Zhang, Muxin Fu, Guancheng Wan, Miao Yu, Kun Wang, and Shuicheng Yan. G-memory:
Tracing hierarchical memory for multi-agent systems. _arXiv_ _preprint_ _arXiv:2506.07398_, 2025.


19


[78] Qizheng Zhang, Changran Hu, Shubhangi Upasani, Boyuan Ma, Fenglu Hong, Vamsidhar
Kamanuru, Jay Rainton, Chen Wu, Mengmeng Ji, Hanchen Li, Urmish Thakker, James Zou,
and Kunle Olukotun. Agentic context engineering: Evolving contexts for self-improving language
models, 2025.


[79] Andrew Zhao, Daniel Huang, Quentin Xu, Matthieu Lin, Yong-Jin Liu, and Gao Huang. Expel:
Llm agents are experiential learners, 2024.


[80] Liang Zhao, Tianwen Wei, Liang Zeng, Cheng Cheng, Liu Yang, Peng Cheng, Lijie Wang,
Chenxia Li, Xuejie Wu, Bo Zhu, et al. Longskywork: A training recipe for efficiently extending
context length in large language models. _arXiv_ _preprint_ _arXiv:2406.00605_, 2024.


[81] Kunlun Zhu, Zijia Liu, Bingxuan Li, Muxin Tian, Yingxuan Yang, Jiaxun Zhang, Pengrui Han,
Qipeng Xie, Fuyang Cui, Weijia Zhang, Xiaoteng Ma, Xiaodong Yu, Gowtham Ramesh, Jialian
Wu, Zicheng Liu, Pan Lu, James Zou, and Jiaxuan You. Where llm agents fail and how they
can learn from failures, 2025.


[82] Younan Zhu, Linwei Tao, Minjing Dong, and Chang Xu. Mitigating object hallucinations in
large vision-language models via attention calibration, 2025.


20


### **A Details on Datasets**

**BrowseComp-Plus** [10] is a controlled evaluation benchmark for “deep research” agents: systems
that combine LLM reasoning with search/retrieval tools to answer complex, reasoning-intensive,
fact-seeking questions that require combining evidence across multiple sources. Unlike evaluations
that rely on live, opaque web search APIs, BrowseComp-Plus fixes the document corpus, enabling
reproducible experiments and clearer separation between retrieval failures and reasoning failures.
BrowseComp-Plus is derived from BrowseComp [65], a benchmark of challenging short-answer
browsing problems originally released by OpenAI. BrowseComp was intentionally designed around
short, verifiable answers to keep grading straightforward, even though the search process may be
difficult. The BrowseComp-Plus dataset is publicly available [∗] with queries, and the document
relevance judgments, including query text and per-query lists of evidence, gold, and negative
documents. To reduce benchmark leakage into training corpora of frontier language models and
discourage copying benchmark content, the dataset release is obfuscated (with query_id as the only
non-obfuscated field), and includes explicit anti-leakage canary mechanisms. To use the dataset, we
need to first decrypt the dataset as suggested [here.](https://huggingface.co/datasets/Tevatron/browsecomp-plus)
In our experiments, we use the “1K documents” evaluation setup, following [75]: for each question,
instead of performing live retrieval, we provide 1,000 randomly selected documents as the long
context, with the guarantee that the question’s gold and evidence documents exist within that subset;
we then evaluate on 150 randomly sampled questions and report accuracy (percentage of correct
final answers). The distribution of context length in terms of tokens across these 150 questions are
provided in Figure 6. In our setup, we compute robust accuracy using an LLM-as-Judge framework.
Instead of relying on exact string matching, the judge compares the model’s generated answer with
the provided ground truth using an evaluation prompt (see Section B.2), allowing for semantically
equivalent or string variations of an answer.


**OOLONG** [6] is a long-context benchmark designed to evaluate large-scale information aggregation.
It is motivated by the observation that many long-context benchmarks reduce to sparse retrieval
tasks (i.e., needle-in-a-haystack settings where most of the input is irrelevant noise). In contrast,
many real-world long-context tasks require processing a substantial portion of the context and
aggregating numerous small decisions to produce a final answer. OOLONG benchmark is divided
into two categories: OOLONG-synth, which consists of “naturalistic synthetic” tasks derived from
existing in-context learning classification datasets and enables controlled analysis of difficulty factors;
and OOLONG-real, which contains downstream aggregation questions over long-form conversational
transcripts, designed to be less easily decomposed into independent in-context learning examples.
In our experiments, we focus on the OOLONG-synth `trec_coarse` configuration, following [75].
We evaluate 650 tasks across context lengths ranging from 1K to 8M tokens (50 tasks per context
length as shown in Figure 6) and report accuracy following the benchmark’s original scoring protocol,
including exponential partial credit for numeric outputs. For categorical outputs (e.g., labels, dates,
user IDs, or comparisons), correctness is determined by exact match with the ground truth or by
judge-based equivalence assessment (with same prompt from Section B.2). For numeric outputs, the
score is computed as 0 _._ 75 _[|][y][−][y]_ [ˆ] _[|]_ which assigns partial credit as predictions approach the true value.
We use the publicly available dataset [†] together with the official open-source code [‡] for experiments.


**LongBench-v2** [3] is an extended version of the LongBench benchmark [4], designed to evaluate the


∗ `[https://huggingface.co/datasets/Tevatron/browsecomp-plus](https://huggingface.co/datasets/Tevatron/browsecomp-plus)`

  - `[https://huggingface.co/datasets/oolongbench/oolong-synth](https://huggingface.co/datasets/oolongbench/oolong-synth)`

  - `[https://github.com/abertsch72/oolong](https://github.com/abertsch72/oolong)`


21


50


40


30


20


10


0



|OOLONG|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>50<br>|
|||||||||||N =|650 ||Media|n = 66|K|
||||||||||||||||
||||||||||||||||
||||||||||||||||
||||||||||||||||


Context Length (tokens)



120


100


80


60


40


20


0





|BrowseComp+ (1K)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|
|36<br> <br>|36<br> <br>|36<br> <br>|36<br> <br>|||||||||||
||||||N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|N = 149 | Median = 7.3M|
|||||||||||||||
||||||20<br><br>|20<br><br>|20<br><br>|20<br><br>|20<br><br>|20<br><br>|20<br><br>|20<br><br>|20<br><br>|
|16|16|16|16|||~~19~~<br>~~19~~|~~19~~<br>~~19~~|~~19~~<br>~~19~~|~~19~~<br>~~19~~|~~19~~<br>~~19~~|~~19~~<br>~~19~~|~~19~~<br>~~19~~|~~19~~<br>~~19~~|
|16|16|16|16|||||||||||
|16|16|16||||||||||||
|||||||||11|11|11|11|11|11|
|||||||||||||||
|~~9~~|~~9~~|~~9~~|||||||5<br>6|5<br>6|5<br>6|5<br>6|5<br>6|
|~~9~~|~~9~~|||||||||||||
|3|3||||||||||1<br>1<br>1<br>2|1<br>1<br>1<br>2|1<br>1<br>1<br>2|
|3||||||||||||||
|3||||||||||||||


Context Length (tokens)



35


30


25


20


15


10


5


0







|LongBench-v2|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|
|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|129<br>N = 503 | Median = 99K<br>|||||||
|||||||||||
|88<br>|88<br>|88<br>|88<br>||87|87|87|87|87|
|88<br>|88<br>|||||||||
||||73|||||||
|||||||||||
|||||||47|47|47|47|
|||||||||||
|31|31||||||~~17~~<br>21|~~17~~<br>21|~~17~~<br>21|
|31||||||||||
||||||||||10|
|||||||||||


Context Length (tokens)



























Figure 6: Distribution of input context lengths across different benchmarks: OOLONG, LongBenchv2, and BrowseComp-Plus.


ability of large language models to perform reasoning and comprehension over diverse realistic long
contexts. To make evaluation more robust and less sensitive to generation formatting, the benchmark
standardizes tasks into multiple-choice questions (A/B/C/D), allowing consistent comparison across
models with different behaviors. LongBench-v2 contains 503 evaluation instances with context
lengths ranging from 8K to 4M tokens. The overall context length distribution of this dataset is
shown in Figure 6. The benchmark spans a wide spectrum of realistic long-context scenarios and is
organized into six task categories: single-document question answering, multi-document question
answering, long in-context learning, dialogue history understanding, code repository understanding,
and long structured data understanding. These categories collectively capture a diverse set of
long-context reasoning patterns, including extracting from and comprehending lengthy documents,
synthesizing and finding evidence across multiple sources, reasoning over extended conversational
histories, understanding large software repositories, and querying or aggregating information from
large structured tables. The detailed context length distributions for each of these domain categories
are provided in Figure 7.
To assess how different long-context methods generalize across diverse domains, we evaluate on all
task categories of the LongBench-v2 dataset in our experiments. This differs from prior work [75],
which focuses only on the CodeQA subset of the benchmark. Using the full benchmark enables
a more comprehensive evaluation of long-context capability across heterogeneous domains and
task semantics. In our experiments, we use the official LongBench-v2 dataset which is publicly
available [§] together with the benchmark’s open-source code for evaluation [¶] . Simialr to other datasets,
to evaluate correctness of answers in this benchmark, we also use the judge with prompt as in
Section B.2.

### **B Prompt Details**


**B.1** **Verbalized** **Confidence** **Elicitation**


At each intermediate generation step _t_ of every candidate program _p_ [(] _[k]_ [)], we elicit the model’s selfassessed confidence by appending a fixed structured instruction to the generation prompt. The
instruction is designed to (i) require the model to produce a parseable confidence score, (ii) enforce


§ `[https://huggingface.co/datasets/zai-org/LongBench-v2](https://huggingface.co/datasets/zai-org/LongBench-v2)`

  - `[https://github.com/THUDM/LongBench](https://github.com/THUDM/LongBench)`


22


LongBench-v2







50


40


30


20


10


0


10


8


6


4


2


0



|Col1|Col2|48|Single-Doc QA|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||~~48~~|45<br>N=175<br>|45<br>N=175<br>|45<br>N=175<br>|45<br>N=175<br>|45<br>N=175<br>|
|||||||||
|||||||||
||||||33|33|33|
|||||||||
||||~~18~~|||||
|15|15|||||12|12|
||||||||4|
|||||||||


|Code QA|Col2|Col3|Col4|Col5|Col6|Col7|10|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
||||||||~~10~~|||
|9|9|9|9|9|9|9||9<br>N=50|9<br>N=50|
|9|9|9||||||||
|||||6<br>6|6<br>6|6<br>6||||
|||||4||||||
|3<br>3|3<br>3|3<br>3||||||||
|3<br>3||||||||||
|||||||||||


Context Lengt (tokens)









35


30


25


20


15


10


5


0


17.5

15.0

12.5

10.0

7.5

5.0

2.5

0.0



25


20


15


10


5


0


10


8


6


4


2


0









|Col1|Col2|Col3|36 M|Multi-Doc QA|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
||||~~36~~<br>|||||
|||||N=125|N=125|N=125|N=125|
|||||||||
|19|19|19||21<br>~~23~~|21<br>~~23~~|21<br>~~23~~|21<br>~~23~~|
|19|19|19||21<br>~~23~~||||
|14|14|||||||
|||||||~~8~~|~~8~~|
|||||||||
||||||||~~3~~<br>1|
|||||||||


|Dial|Col2|Col3|19 logue|e History QA|
|---|---|---|---|---|
||||~~19~~<br>|~~N=39~~<br>|
||||||
||||||
|12|12|12|||
||||||
|||8|||
||||||
||||||
||||||


Context Lengt (tokens)
















|In-C|Col2|28 Conte|ext Learning|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||~~28~~<br>|N=81<br>|N=81<br>|N=81<br>|N=81<br>|N=81<br>|
|||||||||
|||||||||
||||16<br>|16<br>|16<br>|16<br>|16<br>|
|||||~~14~~|~~14~~|~~14~~|~~14~~|
|6|6||||~~8~~|~~8~~|~~8~~|
|2<br>5|||||2|||
|2<br>5||||||||


|Structur|Col2|Col3|Col4|11 red D|Data QA|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
|||||~~11~~<br>|~~N=33~~<br>|~~N=33~~<br>|~~N=33~~<br>|~~N=33~~<br>|
||||||||||
||||||||||
|7|7|7|7||7|7|7|7|
|7|7|7|||||||
||||||||||
|2|2|2||||2<br>2|2<br>2|2<br>2|
|1|1|||||||1|
|1|||||||||



Context Lengt (tokens)



























Figure 7: Context length distributions for different task categories in LongBench-v2 benchmark
dataset.


a consistent format across all steps and all programs, and (iii) encourage nuanced and calibrated
self-assessment rather than coarse or overconfident reporting. The following instruction is appended
verbatim to the model’s prompt for every generation. For the rare cases that the verbalized confidence
is not provided by model, the average of verbalized confidence of other steps in the same trajectory
is used to fill the gap.


**B.2** **Evaluation** **Judge**


To compute final task accuracy across all datasets used in our experiments, we employ an LLM-asJudge evaluation procedure. Many long-context benchmarks contain answers that may appear in
slightly different textual forms while still being semantically correct (e.g., variations in phrasing,
formatting differences, or additional explanatory details). Relying solely on exact string matching can
therefore incorrectly penalize some of the valid and semantically equivalent answers. To address this
issue, we use an automated judge model with the prompt below that compares the model-generated


23


responses with the ground-truth answer and determines correctness based on semantic equivalence
rather than strict lexical matching.




### **C Additional Results**

**C.1** **Detailed** **Results** **Across** **Context** **Lengths**


**Improvement** **over** **the** **base** **model.** In this section, we provide a more detailed view of the
context-length experiments summarized in Section 3.5. While the main paper presents aggregated
results for comparison to base across context splits and task domains in LongBench-v2 dataset,
Figure 8-11 show performance trends at a finer granularity across context-length bins and different
task categories. These additional results help illustrate how different approaches behave as the input
context grows from moderately long inputs to ver long multi-million token sequences. Figures 8 and 9
present the detailed improvement relative to the base model (∆ vs. base) for each context-length bin
on the OOLONG and LongBench-v2 benchmarks, respectively. Each bin contains approximately
the same number of evaluation instances to ensure fair comparison across context scales. The plots
report the performance difference between each method and the base model, allowing us to directly
observe whether a method improves or degrades performance at different context lengths. As it can
be shown, the context length is separated into contexts within (<131K) and near/beyond ( _≥_ 131K)
the model’s context window with the highlighted yellow background.
Consistent with the trends observed in Figure 2 in the main paper, the advantage of SRLM becomes


24


|OOLONG (GPT-5)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|Col21|Col22|Col23|Col24|Col25|Col26|Col27|Col28|Col29|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|<br><br>|||||||||
|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|||||||||
|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)||||||||||||||||||
||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||





40


20


0


60


40


20


0


20




|1K 2K 4K 8K 16K 32K 65K 131K 262K 524K 1M 2M 4M Context Length OOLONG (Qwen3-Coder-480B)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|Col21|Col22|Col23|Col24|Col25|Col26|Col27|Col28|Col29|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|RLM<br>RLM (no sub-call)<br>SRLM<br>SRLM (no sub-call)|||
||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||
||||||||||||||||||||||||||||||



Context Length


Figure 8: Performance gains over the base model across context lengths on the OOLONG benchmark.
Bars show accuracy change vs. base for each context-length bin. Results are shown for GPT-5 ( **top** )
and Qwen3-Coder-480B ( **bottom** ). The shaded yellow region marks contexts near or beyond the
context window limits ( _≥_ 131K tokens).


more pronounced at longer contexts. In both benchmarks and across both backbone models, the
improvement over the base model increases as context length grows. In contrast, RLM mostly
underperforms the base model at shorter context lengths, indicating that recursive decomposition
may introduce unnecessary overhead when the context already fits within the model’s window.


**Task-domain** **analysis.** To further understand how long-context methods behave across different
types of reasoning tasks, Figures 10 and 11 provide detailed breakdowns by task category for the
context analysis performance on LongBench-v2 benchmark. These plots report both the absolute
accuracy and the improvement relative to the base model across context lengths detailed for each
task domain. The results reveal that the benefits self-reflection in SRLM are consistent across
diverse tasks, including code repository understanding, single-document question answering, multidocument question answering, and long in-context learning. In particular, improvements become
more pronounces once the context length approaches or exceeds the context window limits of the
underlying model (shaded yellow region).


**C.2** **Detailed** **Ablation** **Results**


This section provides a detailed breakdown of the ablation experiments summarized in Section 3.8.
While the main paper reports aggregated results across recursive/nonrecursive runs and backbones,
the figures in this appendix present the results separately for each backbone model, dataset, and
execution setting. These analyses allow us to better understand how individual uncertainty signals
contribute to the performance of SRLM under different conditions.


25


80


60


40


20


0


60


40


20


0





|LongBench-v2 (GPT-5)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>||||
|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|RLM<br> <br>SRLM<br>|||||
|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~|~~RLM (no sub-call)~~<br>~~SRLM (no sub-call)~~||||||
||||||||||||||||||
||||||||||||||||||
||||||||||||||||||


Context Length


|LongBench-v2 (Qwen3-Coder-480B)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|||||||||||||||||||||
|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)||||
|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)|~~RLM~~<br>RLM (no sub-call)<br>~~SRLM~~<br>SRLM (no sub-call)||||||
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||



Context Length


Figure 9: Performance gains over the base model across context lengths on the LongBench-v2
benchmark. Bars show accuracy change vs. base for each context-length bin with balanced samples.
Results are shown for GPT-5 ( **top** ) and Qwen3-Coder-480B ( **bottom** ) backbones. The shaded
yellow region marks contexts near or beyond the context window limits ( _≥_ 131K tokens).


Figure 12 shows the detailed analysis for contribution of each uncertainty signal used in the
self-reflection mechanism of SRLM. The results are reported separately for GPT-5 and Qwen3Coder-480B backbones, as well as for runs with recursive sub-calls and runs without sub-calls.
Across all datasets and model backbones, the full SRLM configuration consistently achieves the best
performance. Variants that rely on individual uncertainty signals alone show smaller improvements
compared to the combination in SRLM for all the queries with context length _≥_ 131K. This
observation confirms that the three uncertainty signals capture complementary aspects of model
uncertainty during reasoning and this is true across all backbones and runs. The detailed plots also
reveal that the relative contribution of each signal can vary depending on the backbone model and
dataset. For example, reasoning trace length tends to provide stronger signals in some datasets,
whereas verbalized confidence tends to be more informative on others when the model’s internal
calibration is reliable. However, across all settings, combining the signals through the self-reflection
mechanism consistently provides the best performance.
Figure 13 further analyzes the interaction between fine-grained signals of verbalized confidence and
reasoning trace length. For this analysis, predictions are grouped into bins with approximately equal
numbers of samples based on their confidence scores and reasoning trace lengths. Each heatmap cell
reports the empirical accuracy obtained for a given combination of these two signals. The heatmaps
reveal several interesting patterns. For example, the relation between verbalized confidence and
accuracy is not strictly monotonic, i.e., predictions with high confidence do not always correspond
to correct answers. Similarly, shorter or longer reasoning traces alone do not reliably indicate
correctness. Instead, the highest accuracy regions often appear when both signals align and their
joint combination is considered. By jointly considering semantic uncertainty (verbalized confidence)


26


and behavioral uncertainty (reasoning trace characteristics), SRLM is able to provide more reliable
self-reflection for context-interaction programs in the scope of long-context.


27


100


80


60


40


20


0


100


80


60


40


20


100


80


60


40


20


100


80


60


40


20


0



|Col1|Col2|Col3|Col4|Col5|Col6|
|---|---|---|---|---|---|
|||||||
|||||||
|||||||
|||||||
|||||||


Context Length

|Col1|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
||||||
||||||
||||||



Context Length

|Col1|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
||||||
||||||
||||||
||||||



Context Length

|Col1|Col2|Col3|Col4|Col5|Col6|
|---|---|---|---|---|---|
|||||||
|||||||
|||||||
|||||||



Context Length



100


80


60


40


20


0


100


80


60


40


20


100


80


60


40


20


100


80


60


40


20


0



|Col1|Col2|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
||||||||
||||||||
||||||||
||||||||
||||||||


Context Length

|Col1|Col2|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
||||||||
||||||||
||||||||



Context Length

|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||||||||
|||||||||
|||||||||
|||||||||



Context Length

|Col1|Col2|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
||||||||
||||||||
||||||||
||||||||



Context Length



Figure 10: Accuracy versus context length across LongBench-v2 task categories. Results for GPT-5
( **left** ) and Qwen3-Coder-480B ( **right** ) backbones, with each subplot showing performance across
context scales for a specific task domain.


28


25


20


20


20


40




|0<br>0<br>0<br>0<br>0<br>0|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|Col21|Col22|Col23|Col24|Col25|Col26|Col27|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|0<br>0<br>0<br>0<br>0<br>0|||||||||||||||||||||||||||
|0<br>0<br>0<br>0<br>0<br>0|||||||||||||||||||||||||||
|0<br>0<br>0<br>0<br>0<br>0|||||||||||||||||||||||||||
|0<br>0<br>0<br>0<br>0<br>0|||||||||||||||||||||||||||


|Code Repository Understanding (Qwen3-Coder-480B)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|Col21|Col22|Col23|Col24|Col25|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
||||||||||||||||||||||||||
||||||||||||||||||||||||||
||||||||||||||||||||||||||
||||||||||||||||||||||||||
||||||||||||||||||||||||||


|Col1|41K 85K 162K 371K 704K 1M 2M 3M Context Length Single-Document QA (GPT-5)|Col3|Col4|Col5|Col6|Col7|Col8|M|Col10|Col11|
|---|---|---|---|---|---|---|---|---|---|---|
|20<br>0<br>20<br>40|||||||||||
|20<br>0<br>20<br>40|||||||||||
|20<br>0<br>20<br>40|||||||||||
|20<br>0<br>20<br>40|||||||||||
|20<br>0<br>20<br>40|||||||||||


|41K 85K 162K 371K 704K 1M 2M 3M Context Length Single-Document QA (Qwen3-Coder-480B)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|Single-Document QA (Qwen3-Coder-480B)|
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||
|||||||||


|30|1 1 3 Context Length Multi-Document QA (GPT-5)|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|Col21|Col22|Col23|Col24|Col25|Col26|Col27|Col28|Col29|Col30|Col31|Col32|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||
|20<br>10<br>0<br>10<br>20<br>||||||||||||||||||||||||||||||||


|15K 19K 27K 55K 90K 119K 169K 389K|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|Col20|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|1<br>1<br>3<br>Context Length<br><br><br><br>Multi-Document QA (Qwen3-Coder-480B)|
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||
|||||||||||||||||||||


|12K 23K 39K 51K 69K 122K 205K 489K Context Length 20 Long In-context Learning (GPT-5)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)|
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)||||||||||||||
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)||||||||||||||
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)||||||||||||||
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)||||||||||||||
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)||||||||||||||
|0<br>0<br>0<br>0<br>0<br>Long In-context Learning (GPT-5)||||||||||||||


|12K 23K 39K 51K 69K 122K 205K 489K Context Length Long In-context Learning (Qwen3-Coder-480B)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|Col13|Col14|Col15|Col16|Col17|Col18|Col19|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|Long In-context Learning (Qwen3-Coder-480B)|
||||||||||||||||||||
||||||||||||||||||||
||||||||||||||||||||
||||||||||||||||||||
||||||||||||||||||||
||||||||||||||||||||
||||||||||||||||||||



Results for GPT-5 ( **left** ) and Qwen3-Coder-480B ( **right** ), with each subplot showing performance
change across context scales for a specific task domain.


29


97.5


95.0


92.5


90.0


87.5


85.0


82.5


60


55


50


45


40


100


95


90


85


50


45


40


35



75


70


65


60


55


57.5


55.0


52.5


50.0


47.5


45.0


42.5


65


60


55


55


50


45


40









|(a) Recursive LongBench-v2|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|V<br>C|erb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br>|+S<br>Co|elf-<br>nsist.|SR|LM||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|V<br>C|erb.<br>onf.<br><br>(b)|+Tr<br><br> N|ace<br>Len.<br><br>o Sub<br>Long|+S<br>Co<br>-c<br>en|elf-<br>nsist.<br>all<br>ch-v2|SR|LM||
|V<br>C|||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C|rb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br><br>|+S<br>Con|elf-<br>sist.<br><br>(no|SR<br> sub-|LM<br> call)||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C<br>g<br>n<br>|rb.<br>onf.<br><br>nals <br>es on<br>**ith**|+Tr<br><br> in<br> <br> re|ace<br>Len.<br><br><br> SR<br>OOL<br>curs|+S<br>Con<br>L<br>O<br>ive|elf-<br>sist.<br><br>(no<br>M ’s <br>NG, <br> sub|SR<br> sub-<br> se<br>Lo<br>-c|LM<br> call)<br>lf-re<br>ngB<br>alls;|f<br>en<br>**(**|
|Ve<br>C<br>g<br>n<br>|||||||||


30


|55 OOLONG|OOLONG|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||rb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br><br>|+S<br>Con|elf-<br>sist.|SR|LM||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||rb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br><br><br>OO|+S<br>Con<br>LO|elf-<br>sist.<br>NG|SR|LM||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||erb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br>|+S<br>Co|elf-<br>nsist.<br>(no|SR<br> sub-|LM<br> call)||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||||||||||
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||erb.<br>onf.<br>|+Tr<br><br>bl<br>w<br>it|ace<br>Len.<br>|+S<br>Co<br>n <br>Co<br>t|elf-<br>sist.<br>|SR<br> sub-<br>c<br>8<br>|LM<br> call)|nt<br>a<br>|
|+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>50<br>55<br>Accuracy (%)<br>GPT-5<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>35<br>40<br>45<br>Accuracy (%)<br>Qwen3-Coder-480B<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>35<br>40<br>45<br>50<br>Accuracy (%)<br>GPT-5<br>OOLONG<br>+Verb.<br>Conf.<br>+Trace<br>Len.<br>+Self-<br>Consist.<br>SRLM<br>(no sub-call)<br>25<br>30<br>35<br>40<br>Accuracy (%)<br>Qwen3-Coder-480B<br>Figure 12: Ablation of uncertaint<br>GPT-5 and Qwen3-Coder-480B ba<br>benchmarks with context _≥_131K.||2: A<br>nd Q<br>ks|2: A<br>nd Q<br>ks|atio<br>en3-<br>h co|atio<br>en3-<br>h co|(no<br>of un<br>der-4<br>xt|(no<br>of un<br>der-4<br>xt|<br>ertai<br>0B b<br>31K|<br>ertai<br>0B b<br>31K|


|BrowseComp+ (1K)|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|
|---|---|---|---|---|---|---|---|---|
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|V<br>C|erb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br>|+S<br>Con|elf-<br>sist.|SR|LM||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|V<br>C|erb.<br>onf.<br>|+Tr<br><br>B|ace<br>Len.<br><br>rowseC|+S<br>Con<br>om|elf-<br>sist.<br>p+ (1|SR<br> K)|LM||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C|rb.<br>onf.<br>|+Tr<br>|ace<br>Len.<br><br>|+S<br>Con|elf-<br>sist.<br><br>(no|SR<br> sub-|LM<br> call)||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
||||||||||
|Ve<br>C<br>n<br>2<br>|rb.<br>onf.<br>|+Tr<br><br>ch<br>d <br>**ut**|ace<br>Len.<br><br>|+S<br>Con<br>m.<br>se<br>rs|elf-<br>sist.<br><br>(no|SR<br> sub-<br>su<br>p<br>ub|LM<br> call)|or<br><br>s.|
|Ve<br>C<br>n<br>2<br>|me<br>, an<br>**itho**|me<br>, an<br>**itho**|anis<br>Brow<br> recu|anis<br>Brow<br> recu|Re<br>Com<br>ive s|Re<br>Com<br>ive s|lts f<br>+ (1K<br>-call|lts f<br>+ (1K<br>-call|
|Ve<br>C<br>n<br>2<br>|||||||||


BrowseComp+ (1K)


Verbalized Confidence


BrowseComp+ (1K)


Verbalized Confidence



OOLONG


Verbalized Confidence


OOLONG


Verbalized Confidence



(a) Recursive

LongBench-v2


Verbalized Confidence


(b) No Sub-call

LongBench-v2


Verbalized Confidence



100


80


60


40


20


0


80


60


40


20


0



Figure 13: Analysis of the relationship between verbalized confidence, reasoning length, and accuracy.
Heatmaps show accuracy across equal-sample bins of confidence (x-axis) and reasoning length
(y-axis). Results are reported for GPT-5 and Qwen3-Coder-480B backbones on the OOLONG,
LongBench-v2, and BrowseComp+ (1K) benchmarks with context _≥_ 131K. **(a)** **With** recursive
sub-calls; **(b)** **Without** recursive sub-calls.


31


