## **Recursive Models for Long-Horizon Reasoning**

**Chenxiao Yang** [1] **Nathan Srebro** [1] **Zhiyuan Li** [1]



**Abstract**


Modern language models reason within bounded
context, an inherent constraint that poses a fundamental barrier to long-horizon reasoning. We
identify recursion as a core principle for overcoming this barrier, and propose recursive models as
a minimal realization, where the model can recursively invoke itself to solve subtasks in isolated
contexts. We prove that any computable problem
admits a recursive decomposition in which each
subtask requires only exponentially smaller active context than standard autoregressive models;
this strictly surpasses any context management
approach confined to a single sequence, such as
summarization. We further generalize our framework to modern agentic systems with arbitrary
context processing and control flows, and prove
that recursive models can achieve optimal power
within this broader class. Experimentally, we
train a 3B model to reason recursively and evaluate on Boolean satisfiability, a task requiring
long-horizon combinatorial search, where it significantly outperforms frontier LLMs.


**1. Introduction**


Modern language models exhibit remarkable general problem solving power (Radford et al., 2018; 2019; Brown et al.,
2020; Achiam et al., 2023). Through extended thinking (Wei
et al., 2022; OpenAI, 2024; Guo et al., 2025) and agentic
systems (Yao et al., 2023; Shinn et al., 2023; Park et al.,
2023), they can handle increasingly complex tasks across
diverse domains. Nevertheless, these systems are subject
to a physical constraint: at every step, the model can only
attend to bounded-sized context window, strictly limiting
what can be computed in a single forward pass.


This has driven growing interest in effective context management. For instance, summarization compresses lengthy
reasoning traces into compact states, discarding no longer
needed history to free up space (Yang et al., 2025b; Yu


1Toyota Technological Institute at Chicago. Correspondence
to: Chenxiao Yang <chenxiao@ttic.edu>.


_arXiv preprint._



et al., 2025; Zhou et al., 2025; Yan et al., 2025); memoryaugmented approaches write and retrieve relevant information in external storage (Packer et al., 2024; Chhikara et al.,
2025; Suzgun et al., 2025; Xu et al., 2025); and in agentic
systems, subtasks are distributed across agents, each operating in its own context while collaborating toward a shared
goal (Hong et al., 2024; Wu et al., 2023; Li et al., 2023).


Yet questions remain: how do these different systems formally compare in their reasoning power? What core mechanisms, as scaffolding that wraps around the base generator,
can enable models to handle long-horizon tasks that are
otherwise impossible because of context constraints? And
are these mechanisms optimal? Despite the importance
of these questions, existing work lacks a formalization for
these questions to be answered systematically. Notable
related works are Yang et al. (2025b;c), which, however,
focus on summarization-based context management and
self-correction in diffusion language models respectively.


**In this work, we identify recursion as a core principle for**
**overcoming context constraints, and a source of power**
**exclusive to modern agentic systems.** In a broad sense, recursion refers to the application of a finite, static set of rules
to a target problem, that dynamically produces a potentially
infinite depth of behaviors that, though contextually isolated
from each other, contribute to the final solution.


We propose the simplest realization of this principle, which
we call **recursive model** . It consists of a single base LLM
as the generator, equipped with two minimal tools, **call**
and **return** . As illustrated in Figure 1c, the model can invoke itself: **call** creates an isolated context and the model
solves the subtask there independently; upon completion,
**return** discards the intermediate reasoning and passes
only the final answer back to the parent context. Since each
invoked model can itself invoke further calls, this enables
a deep context stack while keeping each individual context
bounded by the maximal context length. Similar ideas have
been explored in earlier and concurrent work (Lee & Kim,
2023; Prasad et al., 2024; Schroeder et al., 2025; Pan et al.,
2025; Zhang et al., 2025c; Sun et al., 2025; Zhang et al.,
2025a); see a comprehensive discussion in _§_ A.


One important observation is that the recursive model naturally induces a separation between **local** and **global** space:
the generator only needs to attend to the active context,



1


**Recursive Models for Long-Horizon Reasoning**


**Input** **Thoughts1** **Thoughts2** **Thoughts3** **Thoughts4** **Thoughts5** **Thoughts6** **Thoughts7** **. . .** **Thoughtsk** **Output** **Output**


**LLM Generator**


_(a)_ **Standard Autoregressive Model.** The model generates tokens sequentially, appending each to the current sequence until the context
limit is reached.

**Context Manager**



**LLM Generator** **LLM Generator** **LLM Generator**





_(b)_ **Single-Context Model.** The entire generation process operates within a single sequence. As a representative example, summarization
periodically compresses past reasoning into a compact summary and discards the original tokens.











































**Recursion (Root)**


_(c)_ **Recursive Model.** Unlike the previous two approaches, computation spans multiple isolated contexts. The model delegates subtasks
via call, each solved in a fresh context; return passes back only the result, discarding intermediate reasoning. This enables unbounded
recursion depth without growing any single context.


_Figure 1._ Overview of different context management strategies.



while inactive contexts in the context stack can be offloaded
to external storage and restored upon return. While this improves space efficiency, it seems to impose a strong requirement that problems must admit modular decompositions.
Do general computational problems possess such structure?
We show the answer is affirmative: **any computable prob-**
**lem inherently admits a recursive decomposition,** **and**
**furthermore, by doing so, the required context can be**
**reduced** **exponentially.** Specifically, we prove that with
local space _S_ ( _n_ ), recursive models can solve any problem requiring up to exp( _O_ ( _S_ ( _n_ ))) computation time. In
comparison, standard autoregressive models would require
context length exp( _O_ ( _S_ ( _n_ ))) to solve the same problems,
which is an exponential gap.


Recursion, however, is not the only approach for context
management. Consider **summarization** (Figure 1b), which
periodically compresses the context and discards old history
to keep the context window bounded. Unlike recursion,
summarization and indeed most existing strategies keep the
entire generation process within a single sequence. We
call these **single-context models** . Prior work (Yang et al.,
2025b) shows that with context length _S_ ( _n_ ), summarization
can solve all problems requiring _S_ ( _n_ ) space. We prove that
this is in fact optimal: **no single-context model, regardless**
**of** **its** **context** **management** **strategy,** **can** **surpass** **sum-**
**marization, which is, however, still strictly less powerful**
**than recursion** . Indeed, we show that even constant-depth
recursion (i.e., depth 1) suffices to match the optimum of all
single-context models. Moreover, deeper recursion breaks



through this ceiling, solving problems beyond what any
single-context approach can reach. This separates the power
of recursive models from those shallow counterparts (Sun
et al., 2025; Zhang et al., 2025a).


Modern agentic systems are unique in that they are no longer
confined to a single context: they can dynamically spawn
contextually isolated sub-agents to solve specialized subtasks independently, and the responses are integrated back,
processed, and used to determine the system’s next behavior.
This unique feature enables recursion in broader use cases.
While not all agentic systems possess this capability, we formalize a powerful family called **recursive agentic systems**,
which equip agentic systems with scaffoldings that create
a recursive control loop. The recursive model is the minimal realization of this family. We show that **any agentic**
**system that is recursive can reach the same power as re-**
**cursive models, enabling them to break through context**
**constraints far beyond standard approaches** . Yet, none
can surpass recursive models, suggesting that the recursive
model, despite its simplicity, is already optimally powerful
within this family.


Experimentally, we train Qwen2.5-3B-Instruct to perform
recursive reasoning on SAT, a canonical NP-complete problem that naturally admits recursive decomposition via backtracking search. The resulting model significantly outperforms non-recursive baselines while requiring significantly
smaller context.



2


**Recursive Models for Long-Horizon Reasoning**



**Algorithm 1** Autoregressive Generation, ARM _π_
**Input:** Input sequence **x** _∈_ Σ _[∗]_, next-token generator _π_ :
Σ _[∗]_ _→_ Σ, stopping condition stop : Σ _[∗]_ _→{_ 0 _,_ 1 _}_ .
1: **while** _¬_ stop( **x** ) **do**
2: Generate: _y_ _←_ _π_ ( **x** )
3: Append: **x** _←_ **x** _._ append( _y_ )
4: **return x**


**2. Recursive Models**


In this section, we formalize **recursive models** . Consider
a base language model _f_ : Σ _[∗]_ _→_ Σ _[∗]_ that maps an input
sequence to an output sequence over a finite vocabulary
Σ. A recursive model RCM _f_ extends _f_ by allowing it to
recursively invoke itself to solve subtasks in isolated contexts. In the following, we first define _f_ as an autoregressive
generator, then introduce the mechanisms that build RCM _f_ .


**Autoregressive** **Models.** Let _π_ : Σ _[∗]_ _→_ Σ be a nexttoken generator that maps a sequence **x** = ( _x_ 1 _, . . ., xn_ )
to the next token _xn_ +1. Autoregressive generation repeatedly appends _π_ ( **x** ) to **x** until a stopping condition
stop( **x** ) is met, inducing a sequence-to-sequence mapping
ARM _π_ : Σ _[∗]_ _→_ Σ _[∗]_ (see Algorithm 1). Common choices
for stop include encountering an end-of-sequence token or
reaching a maximum length; we will specify our choice
when defining recursive models below.


**Recursive Generation Process.** A standard sequence generator maintains only a single sequence as its state. To enable recursion, we extend this to a _context stack_ **S** _∈_ (Σ _[∗]_ ) [+],
a non-empty sequence of sequences. The top sequence
**S** [ _−_ 1] is the active context where generation occurs; **S** [: _−_ 1]
holds all suspended parent contexts awaiting results from
recursive calls, and _|_ **S** _|_ denotes the recursion depth.


At each step, the **sequence** **generator** _f_ : Σ _[∗]_ _→_ Σ _[∗]_

takes the top sequence **S** _t_ [ _−_ 1] and produces an extended
sequence; then the **context manager** _g_ : (Σ _[∗]_ ) [+] _×_ Σ _[∗]_ _→_
(Σ _[∗]_ ) [+] updates the stack based on this output:


**S** _t_ +1 = _g_ ( **S** _t, f_ ( **S** _t_ [ _−_ 1])) (1)


For autoregressive Transformers, _f_ = ARM _π_ as defined
above. The context manager _g_ is a parameter-free symbolic
rule that parses the output and updates the stack accordingly.


This interface decouples the recursion mechanism from
the base generator: the sequence generator _f_ can be any
language model, such as autoregressive Transformers or
diffusion language models (Austin et al., 2021; Lou et al.,
2024; Sahoo et al., 2024; Shi et al., 2024; Nie et al., 2025;
Yang et al., 2025c); the context manager _g_ can also be
instantiated in various ways. In this paper, we consider the
simplest instantiation: _f_ as an autoregressive model, and _g_
using only two tools: call and return.



**Algorithm 2** Recursive Model, RCM _f_
**Input:** Sequence **x** _∈_ Σ _[∗]_, language model _f_ : Σ _[∗]_ _→_ Σ _[∗]_ .

1: **while true:**
2: **y** _←_ _f_ ( **x** )
3: **if y** = **y** _[′]_ _◦⟨_ return _⟩_ **a** _⟨/_ return _⟩_ : **return a**
4: **if y** = **y** _[′]_ _◦⟨_ call _⟩_ **q** _⟨/_ call _⟩_ :
5: **x** _←_ **y** _[′]_ _._ append(RCM _f_ ( **q** ))


**Context Manager:** **Call and Return.** We assume the vocabulary Σ contains four special tokens _⟨_ call _⟩_, _⟨/_ call _⟩_,
_⟨_ return _⟩_, _⟨/_ return _⟩_ . The transition function _g_ recognizes two patterns formatted by these tokens, each triggering
a tool:


**(i)** **Call** : When the generated top sequence ends with
_⟨_ call _⟩_ **q** _⟨/_ call _⟩_, it extracts the content **q** _∈_ Σ _[∗]_ and
pushes it onto the context stack as a new context. The
prefix before the call block remains on the parent context.


**(ii)** **Return** : When the generated top sequence ends with
_⟨_ return _⟩_ **a** _⟨/_ return _⟩_, it pops the current context and
appends the content **a** _∈_ Σ _[∗]_ to the parent context. The
content before the return block is discarded.



Formally, let **y** := _f_ ( **S** [ _−_ 1]) denote the updated top
sequence produced by the generator, where the stopping condition stop( **x** ) triggers when **x** ends with a
_⟨_ call _⟩· · · ⟨/_ call _⟩_ or _⟨_ return _⟩· · · ⟨/_ return _⟩_ pattern.
The transition function _g_ (defined for any **S** _∈_ (Σ _[∗]_ ) [+] and
**y** _∈_ Σ _[∗]_ ) updates the context stack as _g_ ( **S** _,_ **y** ) =



**S** [: _−_ 1] _⊕_ [ **y** _[′]_ _,_ **q** ] **y** = **y** _[′]_ _◦⟨_ call _⟩_ **q** _⟨/_ call _⟩_







**S** [: _−_ 1] _⊕_ [ **y** _[′]_ _,_ **q** ] **y** = **y** _[′]_ _◦⟨_ call _⟩_ **q** _⟨/_ call _⟩_



**S** [: _−_ 2] _⊕_ [ **S** [ _−_ 2] _◦_ **a** ] **y** = **y** _[′]_ _◦⟨_ return _⟩_ **a** _⟨/_ return _⟩_

 **S** [: _−_ 1] _⊕_ [ **y** ] otherwise

(2)
where _⊕_ denotes list concatenation. The trigger conditions
are suffix-based: a tool fires only when the corresponding
pattern appears at the end of **y** .







**Overall Process.** To compute RCM _f_ ( **x** ) on input prompt
**x**, the context stack is initialized as **S** 0 = [ **x** ]. At each step,
the stack is updated via Equation (1). The computation
terminates when the model generates a return pattern at
depth one ( _|_ **S** _|_ = 1), and the returned content **a** is the final
output RCM _f_ ( **x** ). If the model enters an endless loop (e.g.,
the same context occurs twice), RCM _f_ ( **x** ) is undefined and
we denote it by RCM _f_ ( **x** ) = _⊥_ . In practice, we set a
maximum number of iterations as a safeguard. We provide a
simplified pseudocode in Algorithm 2; other implementation
details are discussed in _§_ B.3.


**2.1. Variants and Extensions**


We consider the following variants and extensions of the
basic recursive model.



3


**Recursive Models for Long-Horizon Reasoning**



**Variant 1:** **Prompt Prefixing.** In practice, it is often useful for the model to retain access to the original problem
throughout all recursive calls. We achieve this by prepending the root prompt **x** 0 to the input of _f_ at every step. Formally, Equation (2) becomes:


**S** _t_ +1 = _g_ ( **S** _t, f_ ( **x** 0 _◦_ **S** _t_ [ _−_ 1])) _,_ for _t ≥_ 1 (3)


Note that while this increases the context length by _|_ **x** 0 _|_,
the KV cache for **x** 0 can be precomputed and reused; the
overhead is the additional attention cost per generated token.


**Variant 2:** **Question Preservation.** In the basic formulation (Equation 3), upon return, information about what
subtask was asked is discarded. In practice, preserving the
subtask description can help the parent context track what
was solved. We achieve this by retaining **q** in the parent context at call time. Formally, when **s** = **s** _[′]_ _◦⟨_ call _⟩_ **q** _⟨/_ call _⟩_,
the call rule becomes:


**S** _t_ +1 = **S** _t_ [: _−_ 1] _⊕_ [ **s** _[′]_ _◦_ **q** _,_ **q** ] (4)


Though this does not increase expressive power (as will be
formalized), it is often practically useful as the model no
longer needs to include the question in its returned answer.


**Further Extensions.** The basic recursive model can be extended in several directions: (i) **heterogeneous model calls**,
where the model can invoke different specialized models
for different subtasks rather than always calling itself; (ii)
**tool use**, where the model can call external tools and APIs
in addition to recursive calls; (iii) **parallel subtasks**, where
multiple subtasks are generated and processed in parallel;
and (iv) **arbitrary context processing**, where the context
manager _g_ can perform arbitrary computation on the sequence before passing it to the base language model, e.g.,
concatenating instructions or performing additional parsing
and reorganization. We formalize these generalizations in a
generic framework of recursive agentic systems and extend
our theoretical results to them in _§_ 4.


In subsequent sections, we default to the basic recursive
model unless otherwise specified, but will additionally discuss the implications of these variants on theoretical results.


**3. Power of Deep Recursion**


Recursive calls provide a natural mechanism to solve complex tasks through decomposition. But do generic reasoning
tasks naturally admit such modular structure? And to what
extent can recursion reduce the required context length, or
enhance computational power given a limited one?


**3.1. Separation of Global and Local Spaces**


Unlike the standard generation process where context grows
monotonically, recursive models work on a stack of sequences, which gives rise to two natural resource measures:



**Definition 1** (Global and Local Space) **.** For a stack **S**, we
define the _global space_ and _local space_ respectively as:


GS( **S** ) :=    - _|_ **s** _|,_ LS( **S** ) := max (5)

**s** _∈_ **S** _[|]_ **[s]** _[|][,]_
**s** _∈_ **S**


where global space GS refers to the total number of tokens
across all sequences, and local space LS refers to the length
of the longest sequence.


This resource distinction is practically significant: the
**global** **space** corresponds to the total size of the current
stack (including suspended and active contexts). Suspended
contexts (i.e., all but the stack top) are temporarily inactive,
allowing their KV caches to be offloaded to external storage
(e.g., CPU memory or disk), which has virtually unlimited
capacity and thus imposes no practical limit on global space.


In contrast, **local space** is the maximum length of the active
context window throughout next-token generation. Unlike
suspended contexts, the active context must reside in GPU
memory during inference, making local space the practical
bottleneck. **We thus focus our analysis on the reasoning**
**power achievable under strict local space constraints.**


**RCM Complexity Class.** We formalize the computational
power of recursive models by defining the class of decision
problems they can solve under different resource constraints.

**Definition** **2** (Recursive Model Complexity Class) **.**
For functions _S, D, T_ : N _→_ N, the class
RCM( _S_ ( _n_ ) _, D_ ( _n_ ) _, T_ ( _n_ )) [1] consists of all decision problems solvable by recursive models with constant-size,
_O_ (log _S_ ( _n_ ))-precision Transformers (defined in _§_ C), such
that for all inputs **x** _∈_ Σ _[n]_ :


1. **Local Space** : max _t_ LS( **S** _t_ ) _≤_ _S_ ( _n_ ) (the maximum sequence length is bounded by _S_ ( _n_ ));
2. **Recursion Depth** : max _t |_ **S** _t| ≤_ _D_ ( _n_ ) (the stack depth
is bounded by _D_ ( _n_ ));
3. **Total Steps** : _t ≤_ _T_ ( _n_ ) (the number of generated tokens
is bounded by _T_ ( _n_ )).


When no time constraint is imposed, we write it as
RCM( _S_ ( _n_ ) _, D_ ( _n_ )).


**Standard** **Complexity** **Classes.** To characterize the expressivity of recursive models, we compare with standard Turing machine complexity classes. We denote by
TIME( _T_ ( _n_ )) and SPACE( _S_ ( _n_ )) the classes of problems
solvable in _T_ ( _n_ ) time and _S_ ( _n_ ) space, respectively, and
TM( _S_ ( _n_ ) _, T_ ( _n_ )) := TIME( _T_ ( _n_ )) _∩_ SPACE( _S_ ( _n_ )) for
their intersection (see _§_ D for formal definitions).


1We slightly abuse notation: RCM (without subscript) denotes
the complexity class, while RCM _f_ (with subscript) denotes the
recursive model with base generator _f_ .



4


**Recursive Models for Long-Horizon Reasoning**



**3.2. Power of Deep Recursion (Main Result)**


Now we formally establish the computational power of
recursive models with unbounded recursion depth.

**Theorem 1** (Deep Recursive Models) **.** _For any S_ ( _n_ ) _≥_ _n,_
_recursive models can solve any problem in_ TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] )
_under local space constraint O_ ( _S_ ( _n_ )) _:_


TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _, ∞, ∞_ ) _._ (6)


Furthermore, if we only count the space _S_ ( _n_ ) _≤_ _n_ additional to the input length _n_, we have TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) _⊆_
RCM( _n_ + _O_ ( _S_ ( _n_ )) _, ∞, ∞_ ). Achieving this simulation requires recursion depth _T_ ( _n_ ) = 2 _[O]_ [(] _[S]_ [(] _[n]_ [))] and inflated total
steps 2 _[O]_ [(] _[T]_ [ (] _[n]_ [))] . However, if we allow an external memory
that caches previously computed subproblem answers and
recursive models to retrieve them when the same subproblem is called, the total steps reduce to _T_ ( _n_ ), matching the
original time complexity. We provide two proofs in _§_ E
and _§_ F: the first expresses Turing machine computation
as recursive functions, and the second simulates a more
powerful variant called alternating Turing machines (Arora
& Barak, 2009). The above results also apply to the two
variants discussed in _§_ 2.1.


This result has important implications as it suggests that **any**
**computable** **problem** **is** **modularizable,** **i.e.,** **inherently**
**admitting a recursive decomposition such that every sub-**
**task fits within a small active context.** By separating local
attention and global memory, recursion allows the model
to always reason within a bounded active context while information that is useful but not currently needed is stored
externally. This means the physical attention limit of modern LLMs is not a fundamental barrier for recursive models:
they can scale to extreme long-horizon tasks demanding
exponential computation.


**3.3. No Recursion and Shallow Recursion**


Next, we show that the depth of recursion is critical to the
power of recursive models, and shallow recursion strictly
makes the model less powerful, essentially degrading it to
other simpler context management approaches.


**Standard Autoregressive Models.** When _D_ ( _n_ ) = 1, no
recursive calls are made and the model reduces to standard
autoregressive models (a.k.a. CoT). While it is known that
with sufficiently many intermediate steps, autoregressive
models can solve any computable problem (Merrill & Sabharwal, 2024; Feng et al., 2024; Li et al., 2024; Yang et al.,
2025b), this comes at a significant cost:

**Theorem 2** (Standard Autoregressive Models / CoT) **.** _For_
_a standard autoregressive model (i.e., recursive model with_
_depth_ _D_ = 1 _)_ _with_ _local_ _space_ _O_ ( _S_ ( _n_ )) _,_ _S_ ( _n_ ) _≥_ _n,_ _we_



_have:_


TIME( _O_ ( _S_ ( _n_ ))) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _,_ 1) _,_ (7)


RCM( _O_ ( _S_ ( _n_ )) _,_ 1) _⊆_ TIME( _O_ ( _S_ [2] ( _n_ ))) _._ (8)

[�]


Both inclusions follow from Merrill & Sabharwal (2024)
(Eq. (1); the _O_ ( _·_ ) absorbs the polylogarithmic overhead

[�]
of simulating _O_ (log _S_ ( _n_ ))-precision arithmetic on a Turing
machine. Together, the two inclusions show that standard autoregression with context length _S_ ( _n_ ) (which determines the
total reasoning steps when _D_ ( _n_ ) = 1) can solve problems
up to TIME( _O_ ( _S_ ( _n_ ))), but strictly cannot reach problems
requiring time beyond _O_ ( _S_ [2] ( _n_ )).

[�]


Compared with Theorem 1, this reveals that **deep recursion**
**exponentially reduces the required local space**, as achieving RCM( _O_ ( _S_ ( _n_ )) _, ∞_ ) would require RCM(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] _,_ 1).
For instance, with polynomial context _S_ ( _n_ ) = poly( _n_ ),
standard models are confined to P, while recursive models
reach EXPTIME, which is beyond NP and PSPACE (under
standard assumptions).


**Constant-Depth Recursion.** Interestingly, we next show
that constant recursion depth can already improve the
model’s power, but is still confined to the power of singlecontext management strategies such as summarization:

**Theorem 3** (Constant-Depth Recursive Models) **.** _For any_
_S_ ( _n_ ) _≥_ _n, recursive models with constant recursion depth_
_D_ = _O_ (1) _and local space O_ ( _S_ ( _n_ )) _can solve any problem_
_in_ SPACE( _S_ ( _n_ )) _:_


SPACE( _S_ ( _n_ )) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _, O_ (1)) _._ (9)


_Moreover, for any T_ : N _→_ N _,_


TM( _S_ ( _n_ ) _, T_ ( _n_ )) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _, O_ (1) _, O_ ( _T_ ( _n_ ))) _._


This result shows that constant-depth recursion achieves
both space and time efficiency: the local space matches the
actual space complexity _S_ ( _n_ ), and the total number of generated tokens matches the time complexity _T_ ( _n_ ). The proof
relies on tail recursion optimization, which, however, does
not apply to the question preservation variant ( _§_ 2.1); for
that variant, constant depth offers no additional expressive
power.


Notably, this computational power is equivalent to that of
**summarization** (Yang et al., 2025b), an optimal singlecontext strategy that periodically compresses reasoning history to free up space (illustrated in Figure 1b). In fact, as
we will prove later ( _§_ 4), SPACE( _S_ ( _n_ )) is the _maximum_
expressive power it can achieve, **and constant-depth recur-**
**sion** **therefore** **offers** **no** **advantage** **over** **single-context**
**management strategies** .


Yet even this upper bound is exponentially weaker than
deep recursion: comparing with Theorem 1, there is a gap



5


**Algorithm 3** Summarization



**Recursive Models for Long-Horizon Reasoning**


**Algorithm 5** Mutual Recursion: PROVER & VERIFIER



**Input:** Input _x_, generator _f_, summarizer _g_, max length _L_ .

1: **while** _¬_ stop( _x_ ) **do**
2: _y_ _←_ _f_ ( _x_ ) _▷_ _generate_
3: **if** _|y| ≥_ _L_ : _x ←_ _g_ ( _y_ ) _▷_ _summarize_
4: **else** : _x ←_ _y_
5: **return** _x_


**Algorithm 4** Discrete Diffusion

**Input:** State _x ∈_ (Σ _∪{_ mask _}_ ) _[n]_, denoiser _f_, transition _g_ .

1: **while** _¬_ stop( _x_ ) **do**
2: _y_ _←_ _f_ ( _x_ ) _▷_ _predict mask-free tokens_
3: _x ←_ _g_ ( _x, y_ ) _▷_ _new masked sequence_
4: **return** _x_



**Input:** Goal _g_, seeds _s_ 1 _, . . ., sk_, prover _fp_, verifier _fv_ .

1: **def** PROVER( _g_ ):
2: **for** _i_ = 1 to _k_ :
3: _p ←_ _fp_ ( _g, si_ ) _▷_ _generate proof_
4: **if** VERIFIER( _g, p_ ) = correct:
5: **return** correct
6: **return** wrong _▷_ _all failed_
7:
8: **def** VERIFIER( _g, p_ ):
9: (status _, G_ ) _←_ _fv_ ( _g, p_ ) _▷_ _check proof_
10: **if** status _∈{_ correct _,_ wrong _}_ :
11: **return** status
12: **if** status = incomplete:
13: **return** _∧g′∈G_ PROVER( _g_ _[′]_ ) _▷_ _prove subgoals_



_Figure 2._ Example systems formalized as recursive agentic systems.



from SPACE( _S_ ( _n_ )) to TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ). For polynomial
context _S_ ( _n_ ) = poly( _n_ ), this is the gap between PSPACE
and EXPTIME, widely believed to be strict.


**4. Generalization to Agentic Systems**


Our recursive model captures a core principle: hierarchically
decompose tasks into contextually isolated subtasks. While
our implementation uses a minimal design, this principle
extends naturally to richer systems. Particularly, modern
agentic systems (Gao et al., 2025; Wang et al., 2024; Hong
et al., 2024; Wu et al., 2023) already exhibit key structural properties amenable to recursion: multiple specialized
agents handle isolated subtasks, mutual calling among components, and sophisticated orchestration coordinating the
system. In this section, we generalize to modern agentic
systems through **recursive agentic systems**, illustrate how
diverse systems fit within this framework, and prove that our
minimal recursive model, despite its simplicity, is already
optimally powerful among these richer designs.


**4.1. Formalizing Recursive Systems**


The orchestration layer of a recursive agentic system, which
we call a **scaffold**, wraps around base LLMs and controls
when to invoke generators, tools, and recursive calls. To
precisely characterize computational power, we formalize
scaffolds as oracle Turing machines (see _§_ I.3 for a formal
definition).


**Definition 3** (Recursive Agentic System) **.** A _recursive agen-_
_tic system_ is specified by a finite family of sequence generators _F_ = ( _f_ 1 _, . . ., fk_ ) (could be language models or external tools like Python) and _m_ _≥_ 1 scaffolds ( _S_ 1 _, . . ., Sm_ );
write _S_ := ( _S_ 1 _, . . ., Sm_ ). Each scaffold _Si_ is a deterministic oracle Turing machine that takes an input _x_ _∈_ Σ _[∗]_ and
produces an output in Σ _[∗]_ (or a failure symbol _⊥_ ), thereby



defining a partial function _ϕ_ _[S]_ _i_ _[,][F]_ : Σ _[∗]_ _→_ Σ _[∗]_ _∪{⊥}_ . During
execution, _Si_ may query:


1. _fℓ_ for any _ℓ_ _∈{_ 1 _, . . ., k}_ : generator oracles answering
_u �→_ _fℓ_ ( _u_ );
2. SELF _j_ for any _j_ _∈{_ 1 _, . . ., m}_ : recursion oracles that
invoke scaffold _Sj_, answering _u �→_ _ϕ_ _[S]_ _j_ _[,][F]_ ( _u_ ).


Intuitively, each scaffold _Si_ corresponds to a function in a
real-world agentic system, i.e., the outer Python code that
wraps around LLMs. It can process generator/tool responses
in any way, decide what to do next, and invoke other scaffolds, as long as the computation stays within a limit. This
framework also allows for multiple base generators, external
tools, and mutual recursion among scaffolds.


**Semantics via Least Fixpoint.** The above definition does
not directly specify the functions ( _ϕ_ _[S]_ 1 _[,][F]_ _, . . ., ϕ_ _[S]_ _m_ _[,][F]_ [)][, since]
each _ϕ_ _[S]_ _i_ _[,][F]_ involves the others. To obtain a rigorous definition, we solve a system of functional equations via
a least-fixpoint construction (Winskel, 1993). For fixed
( _S, F_ ), define a one-step operator **Φ** _S,F_ on candidate tuples _**ϕ**_ = ( _ϕ_ 1 _, . . ., ϕm_ ) by letting - **Φ** _S,F_ ( _**ϕ**_ )� _i_ [(] _[x]_ [)] [be] [the]

output of scaffold _Si_ on input _x_, where generator queries
are answered by _F_ and recursion queries SELF _j_ ( _u_ ) are answered by _ϕj_ ( _u_ ). The system semantics is then the least
fixed point _**ϕ**_ _[S][,][F]_ = **Φ** _S,F_ - _**ϕ**_ _[S][,][F]_ [�], which exists by Kleene’s
fixed-point theorem (see _§_ I.4 for details).


Our recursive model ( _§_ 2) corresponds to the special case
_m_ = 1, _k_ = 1: a single scaffold _S_ 1 that parses the generator _f_ 1’s output for call/return patterns and dispatches
to SELF1. This is the minimal scaffold that realizes full
recursive control flow. Below we give more examples of
recursive agentic systems.


**Example** **1:** **Summarization.** Standard summarization
fits this framework with _m_ = 1, _k_ = 2 (generator _f_, sum


6


**Recursive Models for Long-Horizon Reasoning**



marizer _g_ ). During generation, whenever output exceeds
a working memory limit _L_, the scaffold triggers the summarizer to compress the sequence; otherwise generation
continues. This repeats until termination (Algorithm 3).
The recursion oracle is never queried ( _D_ = 1).


**Example 2:** **Discrete Diffusion.** Diffusion-style generation can be viewed as a non-recursive system with _m_ = 1
and _D_ = 1: the scaffold maintains a length- _n_ state
_x_ _∈_ (Σ _∪{_ mask _}_ ) _[n]_ . The denoiser _f_ is an encoder-only
Transformer that, in a single forward pass, predicts maskfree tokens from a masked input. The scaffold then applies
a transition rule _g_ (e.g., overwrite or re-mask some positions) to obtain the next state. Iterating this refinement until
convergence yields the final sample (Algorithm 4).


**Example 3:** **Mutual Recursion between Prover and Veri-**
**fier.** Let scaffold A be PROVER, which queries the prover
generator _fp_ and calls VERIFIER; let scaffold B be VERIFIER, which queries the verifier generator _fv_ and calls
PROVER. PROVER attempts _k_ proofs using _fp_ with different seeds; if any is verified correct by VERIFIER, it returns
correct; otherwise returns wrong. VERIFIER checks
proof ( _g, p_ ) via _fv_ : returns correct/wrong if conclusive; if incomplete with missing subgoals _G_, it recursively calls PROVER on each and returns their conjunction
(Algorithm 5).


**4.2. Optimality of Recursive Models**


Given that even our minimal recursion yields strong computational gains ( _§_ 3), a natural question arises: is our minimal
recursive model already optimally powerful, or can more
sophisticated systems achieve strictly more under bounded
active context? We show that under bounded active context,
no recursive system, regardless of architectural sophistication, can surpass the minimal recursive model. Recursion
depth alone determines computational power.

**Definition 4** ( _L_ -bounded execution) **.** Fix a system ( _S, F_ )
with scaffolds _S_ = ( _S_ 1 _, . . ., Sm_ ) and induced partial functions _**ϕ**_ _[S][,][F]_ = ( _ϕ_ _[S]_ 1 _[,][F]_ _, . . ., ϕ_ _[S]_ _m_ _[,][F]_ [)] [(Definition] [3] [and] _[§]_ [I.4][).]
For an index _r_ _∈{_ 1 _, . . ., m}_, an input _x ∈_ Σ _[∗]_ and a bound
_L_ _∈_ N, we say that _evaluation_ _of_ _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ) _is_ _L-bounded_
if, in the recursive call graph induced by evaluating _ϕ_ _[S]_ _r_ _[,][F]_
starting from _x_, the total space (including work tapes and
oracle tapes) used by any scaffold invocation is at most _L_ .


The _L_ -bounded constraint plays the same role as the local space bound in Definition 1, generalized to arbitrary
systems.


**Unbounded Depth.** With this notion, we can state upper
bounds on what any recursive system can compute.

**Theorem** **4** (Upper bounds under _L_ -bounded executions
(unbounded recursion depth)) **.** _Fix_ _any_ _function_ _L_ ( _n_ ) _≥_



_n._ _Let_ ( _S, F_ ) _be_ _any_ _recursive_ _agentic_ _system._ _For_ _any_
_index r_ _∈{_ 1 _, . . ., m}, any language decided by ϕ_ _[S]_ _r_ _[,][F]_ _under_
_L_ ( _n_ ) _-bounded execution for input of length n (Definition 4)_
_lies_ _in_ DTIME _[F]_ [�] 2 _[O]_ [(] _[L]_ [(] _[n]_ [))][�] _._ _Here_ DTIME _[F]_ _denotes_ _the_
_usual relativized deterministic time class (§ I.3), viewing the_
_generator/tool family F_ _as an oracle family._


_In particular, if every oracle in F_ _is computable by a deter-_
_ministic (non-oracle) Turing machine in time_ 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] _and_
_work space O_ ( _L_ ( _n_ )) _on all queries of length at most L_ ( _n_ ) _,_
_then the language lies in_ TIME(2 _[O]_ [(] _[L]_ [(] _[n]_ [))] ) _._


**Constant** **Depth.** When recursion depth is further
bounded to a constant, an even tighter space bound holds:

**Theorem** **5** (Upper bounds under _L_ -bounded executions
(constant recursion depth)) **.** _Fix_ _any_ _function_ _L_ ( _n_ ) _≥_ _n._
_Let_ ( _S, F_ ) _be_ _any_ _recursive_ _agentic_ _system._ _For_ _any_ _in-_
_dex_ _r_ _∈{_ 1 _, . . ., m},_ _if_ _ϕ_ _[S]_ _r_ _[,][F]_ _decides_ _a_ _language_ _under_
_L_ ( _n_ ) _-bounded execution for input of length n (Definition 4)_
_and_ _the_ _recursion_ _stack_ _depth_ _is_ _D_ ( _n_ ) = _O_ (1) _through-_
_out evaluation of ϕ_ _[S]_ _r_ _[,][F]_ _, then the decided language lies in_
DSPACE _[F]_ [�] _O_ ( _L_ ( _n_ ))� _._


_In particular, if every oracle in F_ _is computable by a deter-_
_ministic (non-oracle) Turing machine in time_ 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] _and_
_work space O_ ( _L_ ( _n_ )) _on all queries of length at most L_ ( _n_ ) _,_
_then the language lies in_ DSPACE( _O_ ( _L_ ( _n_ ))) _._


See _§_ K for the proofs.


From a practical standpoint, **recursion** **is** **what** **enables**
**agentic systems to break through the context barrier**, fundamentally separating them from single-context approaches
that remain confined to SPACE( _S_ ( _n_ )). Yet **sophisticated**
**multi-agent** **orchestration** **offers** **no** **additional** **power**
**over the simple call/return mechanism** ; the minimal
recursive model is already the canonical choice.


**5. Experiments**


We validate the effectiveness of recursive models by training base LLMs on tasks requiring long-horizon reasoning.
Below we describe the setup (§5.1) and present results.


**5.1. Experimental Setup**


**Training.** We train recursive models via supervised finetuning on generated reasoning traces. Since the model conditions only on the top sequence of the stack at each step,
we apply standard next-token prediction loss on these active
contexts. Formally, let ( **S** 0 _,_ **S** 1 _, . . .,_ **S** _T_ ) be the contextstack states visited during a trace, and let _yt_ _∈_ Σ be the
ground-truth next token appended to **S** _t−_ 1[ _−_ 1] at step _t_ .
The training objective is:



_L_ ( _θ_ ) = _−_



_T_

- log _pθ_ - _yt_ _|_ **S** _t−_ 1[ _−_ 1]� _._ (10)


_t_ =1



7


**Recursive Models for Long-Horizon Reasoning**



_Table 1._ Accuracy (%) on SAT instances. Baseline results from
Wei et al. (2025). Ours is fine-tuned from Qwen2.5-3B-Instruct.


**Model** **Easy** **Medium** **Hard**


_Random Baseline_ _50.0_ _50.0_ _50.0_


DeepSeek-Distill-14B 84.3 55.2 46.4
LLaMA3.3-70B 65.1 58.1 52.9
Qwen3-235B 88.0 64.8 51.4
GPT-4o 69.9 55.2 48.8


Recursive Model (ours) 98 95 64


In other words, at each step the model predicts only the
newly generated tokens within the current stack frame, without seeing other sequences in the stack.


**Dataset.** We evaluate on SAT, a canonical NP-complete
problem: given _n_ Boolean variables and _m_ clauses (each
a disjunction of literals), determine whether there exists
an assignment to the variables such that the entire formula
evaluates to true. Worst-case reasoning trajectories grow
exponentially, yet with call and return, each local context stays linear. SAT admits a natural recursive solution:
pick an unassigned variable, try setting it to true; if a clause
becomes unsatisfied, backtrack and try false. We encode
each branch as call and each backtrack as return. We
adopt instances from Wei et al. (2025), converted to natural language puzzles, and generate reasoning traces in our
recursive format. Details appear in _§_ B.1.


**Implementation.** We make two practical adaptations.
First, upon return, we preserve the subtask description
and answer in the parent context so the parent knows what
was asked and solved. Second, we prepend the root problem
to every recursive context so all subtasks retain access to
the global objective. See _§_ B.3 for details.


**5.2. Results**


**Accuracy.** We fine-tune Qwen2.5-3B-Instruct with our
recursive framework (see _§§_ B.1 and B.2 for data splits and
training details) and compare against frontier LLMs with
standard prompting, including GPT-4o, LLaMA3.3-70B,
and Qwen3-235B. As Table 1 shows, these larger models
struggle on SAT, with accuracy dropping as difficulty increases. In contrast, our recursive model, despite being
orders of magnitude smaller, achieves 98% on easy and 95%
on medium instances, substantially outperforming baselines.
Notably, we train on easy and medium instances, yet the
model still reaches 64% on hard instances, suggesting that
the recursive decomposition strategy learned from simpler
problems can transfer to harder ones beyond the training
distribution.


**Context Efficiency.** Recursive models also enjoy context
efficiency. Define _trajectory length_ as the total tokens gen


10 [6]


10 [5]


10 [4]


10 [3]


2 4 6 8 10 12 14 16 18 20
Number of Variables


_Figure 3._ Trajectory length vs. active context length.


erated across all recursive calls, and _active context length_
as the maximum context actually used at any step. Figure 3
shows that trajectory length grows rapidly with problem
size, while active context length stays bounded. This gap
widens as problems become harder, highlighting the benefit
of recursive decomposition: the model can explore deep
search trees without exceeding its context limit.


**6. Discussion**


**6.1. Inference Efficiency**


Recursion significantly reduces inference cost by decoupling stack capacity from attention cost. Any single-context
model, even those with proper context management strategies such as summarization, must attend to all preceding
tokens in the sequence, incurring _O_ ( _|_ **x** _t|_ ) FLOPs with KV
cache at each step _t_ . In contrast, recursive models bound
the active context to _|_ **S** _t_ [ _−_ 1] _| ≤_ LS( **S** _t_ ), therefore requiring
only _O_ (LS( **S** _t_ )) FLOPs per token. This is a GS( **S** _t_ ) _/_ LS( **S** _t_ )
times speedup over the baseline that works on a single sequence, and larger speedup compared with standard CoT
that does not manage the context at all. To achieve this
speedup, we assume in implementation, KV caches of suspended contexts are stored in external storage and restored
upon return, avoiding recomputation.


**6.2. Heterogeneous Model Selection and Tool-Use**


The recursive structure of recursive models naturally supports heterogeneous model selection (Ye et al., 2025; Zhang
et al., 2025b; Agashe et al., 2025): instead of always calling
itself, the model can invoke different models to handle different subtasks, such as larger models for complex reasoning
and smaller models for routine operations. This strikes a
natural tradeoff between capability and cost, allowing the
overall expense and latency to scale with actual task complexity rather than being dominated by the most expensive
model in the system.


**6.3. Error Accumulation**


A potential risk of recursive models is error accumulation:
mistakes in subtasks may propagate and corrupt the final



Trajectory (avg)
Trajectory (max)



Context (avg)
Context (max)



8


**Recursive Models for Long-Horizon Reasoning**



answer, especially as recursion depth grows. This concern,
however, is not unique to recursion: if CoT produces the
same long trajectory as recursive models, a single mistake
could propagate as well. Moreover, recursive models offer
partial mitigation that CoT lacks: upon return, the intermediate reasoning within a subtask is discarded, so errors
made there do not pollute sibling or parent computations.


**7. Related Work**


**Recursion in Language Modeling.** Some prior work has
explored the idea of recursion in language models. However,
these approaches are limited in several ways. **First**, many
methods only support shallow recursion (depth = 1) or
context folding (Sun et al., 2025; Zhang et al., 2025a; Pan
et al., 2025), which we prove in Theorem 3 to be no more
powerful than summarization-based single-context models.
**Second**, many rely on prompting frozen models to follow
recursive patterns (Schroeder et al., 2025; Prasad et al., 2024;
Zhang et al., 2025c). **Third**, prior work often targets specific
scenarios: arithmetic with fixed recursive patterns (Lee &
Kim, 2023), rigid Planner-Executor architectures (Prasad
et al., 2024; Zhang et al., 2025c), or context extension via
input chunking (Zhang et al., 2025a). This paper provides
a general formalization of recursive models, both in its
simplest form and generalized form in agentic systems. Our
theoretical analysis highlights the critical role of recursion
depth: constant-depth recursion offers no advantage over
single-context models, whereas unbounded depth unlocks
exponentially greater computational power.


**Recursion in Classical Computation Theory.** Although
the idea that recursion depth and local space are fundamental
computational resources has classical roots (Savitch, 1977;
Ginsburg et al., 1967; Aho, 1969; Engelfriet, 1991; Savitch,
1970), our work introduces recursion as an explicit design
principle for Transformer-based reasoning and proves that
constant-depth Transformers can realize the per-step logic
at each recursion level (see _§_ A for detailed discussion).
More broadly, our results suggest that scaling LLM reasoning need not rely solely on extending context length: a
lightweight recursive scaffold that requires no architectural
changes can leverage bounded context exponentially more
efficiently. Just as recursion transformed programming from
flat instruction sequences to modular, composable programs,
it may similarly transform LLM reasoning from monolithic
chain-of-thought into structured, hierarchical computation.


**LLM-based Agentic Systems.** LLM-based agentic systems (see Gao et al. (2025); Wang et al. (2024) and references therein) have emerged as a powerful paradigm for
complex task solving. One key feature that distinguishes
agentic systems from standard LLMs is _modularity_ : complex problems are decomposed into modular subtasks, each
handled by an agent operating in its own isolated context,



and agents collaborate to produce the final solution. These
principles are precisely what make recursion realizable in
agentic systems.


**Context Management.** Various strategies have been proposed for context management, including _summarization_
that compresses context into compact representations (Yang
et al., 2025b; Yu et al., 2025; Zhou et al., 2025; Yan et al.,
2025; Wu et al., 2025), and _memory augmentation_ that maintains explicit external storage for retrieval (Packer et al.,
2024; Chhikara et al., 2025; Suzgun et al., 2025; Xu et al.,
2025). Despite the practical importance of context management, formal analysis of what strategies are effective remains limited. Notable exceptions are Yang et al. (2025b;c),
but they focus on summarization and diffusion models respectively.


**8. Conclusion**


We identify recursion as a core principle for overcoming
context constraints and propose recursive models as a minimal yet powerful realization. We show that recursion exponentially reduces the required context length compared to
single-context approaches, and this power is optimal among
all recursive agentic systems. Experiments on SAT validate
that even a small model trained with recursive reasoning can
significantly outperform frontier LLMs.


**Impact Statement**


This paper presents a theoretical understanding of recursive models and suggests an approach to enhance the longhorizon reasoning capabilities of language models. We do
not foresee any direct negative societal impact from this
work, unless AI systems are employed for unethical purposes, which is a general concern applicable to all advances
in machine learning.


**References**


Achiam, J., Adler, S., Agarwal, S., Ahmad, L., Akkaya, I.,
Aleman, F. L., Almeida, D., Altenschmidt, J., Altman, S.,
Anadkat, S., et al. Gpt-4 technical report. _arXiv preprint_
_arXiv:2303.08774_, 2023.


Agashe, S., Wong, K., Tu, V., Yang, J., Li, A., and Wang,
X. E. Agent S2: A compositional generalist-specialist
framework for computer use agents. _arXiv_ _preprint_
_arXiv:2504.00906_, 2025.


Aho, A. V. Nested stack automata. _Journal of the ACM_, 16
(3):383–406, 1969.


Arora, S. and Barak, B. _Computational complexity:_ _a mod-_
_ern approach_ . Cambridge University Press, 2009.



9


**Recursive Models for Long-Horizon Reasoning**



Austin, J., Johnson, D. D., Ho, J., Tarlow, D., and van den
Berg, R. Structured denoising diffusion models in discrete state-spaces. In _Advances_ _in_ _Neural_ _Information_
_Processing Systems_, volume 34, pp. 17981–17993, 2021.


Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J. D.,
Dhariwal, P., Neelakantan, A., Shyam, P., Sastry, G.,
Askell, A., et al. Language models are few-shot learners.
_Advances in neural information processing systems_, 33:
1877–1901, 2020.


Chandra, A. K., Kozen, D. C., and Stockmeyer, L. J. Alternation. _Journal of the ACM_, 28(1):114–133, 1981.


Chhikara, P., Khant, D., Aryan, S., Singh, T., and Yadav, D. Mem0: Building production-ready ai agents
with scalable long-term memory, 2025. URL [https:](https://arxiv.org/abs/2504.19413)
[//arxiv.org/abs/2504.19413.](https://arxiv.org/abs/2504.19413)


Engelfriet, J. Iterated stack automata and complexity classes.
_Information and Computation_, 95(1):21–75, 1991.


Feng, G., Zhang, B., Gu, Y., Ye, H., He, D., and Wang, L.
Towards revealing the mystery behind chain of thought: a
theoretical perspective. _Advances in Neural Information_
_Processing Systems_, 36, 2024.


Gao, H.-a., Geng, J., Hua, W., Hu, M., Juan, X., Liu, H., Liu,
S., Qiu, J., Qi, X., Wu, Y., et al. A survey of self-evolving
agents: On path to artificial super intelligence. _arXiv_
_preprint arXiv:2507.21046_, 2025.


Ginsburg, S., Greibach, S. A., and Harrison, M. A. Oneway stack automata. _Journal of the ACM_, 14(2):389–418,
1967.


Guo, D., Yang, D., Zhang, H., Song, J., Zhang, R., Xu, R.,
Zhu, Q., Ma, S., Wang, P., Bi, X., et al. Deepseek-r1: Incentivizing reasoning capability in llms via reinforcement
learning. _arXiv preprint arXiv:2501.12948_, 2025.


Hong, S., Zheng, X., Chen, J., Cheng, Y., Wang, J., Zhang,
C., Wang, Z., Yau, S. K. S., Lin, Z., Zhou, L., et al.
Metagpt: Meta programming for a multi-agent collaborative framework. In _ICLR_, 2024.


Lee, S. and Kim, G. Recursion of thought: A divide-andconquer approach to multi-context reasoning with language models. _arXiv preprint arXiv:2306.06891_, 2023.


Li, G., Hammoud, H. A. A. K., Itani, H., Khizbullin, D., and
Ghanem, B. Camel: Communicative agents for "mind"
exploration of large language model society. In _NeurIPS_,
2023.


Li, Z., Liu, H., Zhou, D., and Ma, T. Chain of thought empowers transformers to solve inherently serial problems.
_arXiv preprint arXiv:2402.12875_, 2024.



Lou, A., Meng, C., and Ermon, S. Discrete diffusion modeling by estimating the ratios of the data distribution. In
_International_ _Conference_ _on_ _Machine_ _Learning_, 2024.
[URL https://arxiv.org/abs/2310.16834.](https://arxiv.org/abs/2310.16834)


Merrill, W. and Sabharwal, A. The expresssive power of
transformers with chain of thought. _International Confer-_
_ence on Learning Representations_, 2024.


Merrill, W., Sabharwal, A., and Smith, N. A. Saturated
transformers are constant-depth threshold circuits. _Trans-_
_actions of the Association for Computational Linguistics_,
10:843–856, 2022.


Nie, S., Zhu, F., You, Z., Zhang, X., Ou, J., Hu, J., Zhou, J.,
Lin, Y., Wen, J.-R., and Li, C. Large language diffusion
models, 2025.


OpenAI. Learning to reason with llms, September 2024. URL [https://openai.com/index/](https://openai.com/index/learning-to-reason-with-llms/)
[learning-to-reason-with-llms/.](https://openai.com/index/learning-to-reason-with-llms/)


Packer, C., Wooders, S., Lin, K., Fang, V., Patil, S. G.,
Stoica, I., and Gonzalez, J. E. Memgpt: Towards llms
as operating systems, 2024. URL [https://arxiv.](https://arxiv.org/abs/2310.08560)
[org/abs/2310.08560.](https://arxiv.org/abs/2310.08560)


Pan, J., Li, X., Lian, L., Snell, C., Zhou, Y., Yala, A., Darrell, T., Keutzer, K., and Suhr, A. Learning adaptive
parallel reasoning with language models. _arXiv preprint_
_arXiv:2504.15466_, 2025.


Park, J. S., O’Brien, J., Cai, C. J., Morris, M. R., Liang,
P., and Bernstein, M. S. Generative agents: Interactive
simulacra of human behavior. In _UIST_, pp. 1–22, 2023.


Prasad, A., Koller, A., Hartmann, M., Clark, P., Sabharwal,
A., Bansal, M., and Khot, T. Adapt: As-needed decomposition and planning with language models. In _Findings of_
_the Association for Computational Linguistics:_ _NAACL_
_2024_, pp. 4226–4252, 2024.


Radford, A., Narasimhan, K., Salimans, T., Sutskever, I.,
et al. Improving language understanding by generative
pre-training. 2018.


Radford, A., Wu, J., Child, R., Luan, D., Amodei, D.,
Sutskever, I., et al. Language models are unsupervised
multitask learners. _OpenAI blog_, 1(8):9, 2019.


Sahoo, S. S., Arriola, M., Schiff, Y., Gokaslan, A., Marroquin, E. M., Chiu, J. T., Rush, A. M., and Kuleshov,
V. Simple and effective masked diffusion language models. In _The Thirty-eighth Annual Conference on Neural_
_Information_ _Processing_ _Systems_, 2024. URL [https:](https://openreview.net/forum?id=L4uaAR4ArM)
[//openreview.net/forum?id=L4uaAR4ArM.](https://openreview.net/forum?id=L4uaAR4ArM)



10


**Recursive Models for Long-Horizon Reasoning**



Savitch, W. J. Relationships between nondeterministic and
deterministic tape complexities. _Journal_ _of_ _Computer_
_and System Sciences_, 4(2):177–192, 1970.


Savitch, W. J. Recursive Turing machines. _International_
_Journal of Computer Mathematics_, 6(1):3–31, 1977.


Schroeder, P., Morgan, N. W., Luo, H., and Glass, J. Thread:
Thinking deeper with recursive spawning. In _Proceedings_
_of the 2025 Conference of the Nations of the Americas_
_Chapter of the Association for Computational Linguistics:_
_Human Language Technologies (Volume 1:_ _Long Papers)_,
pp. 8418–8442, 2025.


Shi, J., Han, K., Wang, Z., Doucet, A., and Titsias, M. K.
Simplified and generalized masked diffusion for discrete
data. In _Advances_ _in_ _Neural_ _Information_ _Processing_
_Systems_, volume 37, 2024.


Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., and
Yao, S. Reflexion: Language agents with verbal reinforcement learning. _Advances_ _in_ _Neural_ _Information_
_Processing Systems_, 36:8634–8652, 2023.


Sun, W., Lu, M., Ling, Z., Liu, K., Yao, X., Yang, Y., and
Chen, J. Scaling long-horizon llm agent via contextfolding, 2025. URL [https://arxiv.org/abs/](https://arxiv.org/abs/2510.11967)
[2510.11967.](https://arxiv.org/abs/2510.11967)


Suzgun, M., Yuksekgonul, M., Bianchi, F., Jurafsky, D.,
and Zou, J. Dynamic cheatsheet: Test-time learning
with adaptive memory. _arXiv preprint arXiv:2504.07952_,
2025.


Wang, L., Ma, C., Feng, X., Zhang, Z., Yang, H., Zhang, J.,
Chen, Z., Tang, J., Chen, X., Lin, Y., Zhao, W. X., Wei,
Z., and Wen, J. A survey on large language model based
autonomous agents. _Frontiers of Computer Science_, 18,
2024.


Wei, A., Wu, Y., Wan, Y., Suresh, T., Tan, H., Zhou,
Z., Koyejo, S., Wang, K., and Aiken, A. Satbench:
Benchmarking llms’ logical reasoning via automated
puzzle generation from sat formulas. _arXiv_ _preprint_
_arXiv:2505.14615_, 2025.


Wei, J., Wang, X., Schuurmans, D., Bosma, M., Xia, F., Chi,
E., Le, Q. V., Zhou, D., et al. Chain-of-thought prompting
elicits reasoning in large language models. _Advances in_
_neural information processing systems_, 35:24824–24837,
2022.


Winskel, G. _The_ _formal_ _semantics_ _of_ _programming_ _lan-_
_guages:_ _an introduction_ . MIT press, 1993.


Wu, Q., Bansal, G., Zhang, J., Wu, Y., Li, B., Zhu, E., Jiang,
L., Zhang, X., Zhang, S., Liu, J., Awadallah, A. H., White,
R. W., Burger, D., and Wang, C. Autogen: Enabling nextgen llm applications via multi-agent conversation, 2023.



Wu, X., Li, K., Zhao, Y., Zhang, L., Ou, L., Yin, H., Zhang,
Z., Yu, X., Zhang, D., Jiang, Y., Xie, P., Huang, F., Cheng,
M., Wang, S., Cheng, H., and Zhou, J. Resum: Unlocking
long-horizon search intelligence via context summarization, 2025. [URL https://arxiv.org/abs/2509.](https://arxiv.org/abs/2509.13313)
[13313.](https://arxiv.org/abs/2509.13313)


Xu, W., Mei, K., Gao, H., Tan, J., Liang, Z., and Zhang, Y.
A-mem: Agentic memory for llm agents. _arXiv preprint_
_arXiv:2502.12110_, 2025.


Yan, S., Yang, X., Huang, Z., Nie, E., Ding, Z., Li, Z.,
Ma, X., Schütze, H., Tresp, V., and Ma, Y. Memoryr1: Enhancing large language model agents to manage
and utilize memories via reinforcement learning. _arXiv_
_preprint arXiv:2508.19828_, 2025.


Yang, A., Yang, B., Zhang, B., Hui, B., Zheng, B., Yu, B.,
Li, C., Liu, D., Huang, F., Wei, H., Lin, H., Yang, J., Tu,
J., Zhang, J., Yang, J., Yang, J., Zhou, J., Lin, J., Dang,
K., Lu, K., Bao, K., Yang, K., Yu, L., Li, M., Xue, M.,
Zhang, P., Zhu, Q., Men, R., Lin, R., Li, T., Tang, T., Xia,
T., Ren, X., Ren, X., Fan, Y., Su, Y., Zhang, Y., Wan,
Y., Liu, Y., Cui, Z., Zhang, Z., and Qiu, Z. Qwen2.5
technical report, 2025a. [URL https://arxiv.org/](https://arxiv.org/abs/2412.15115)
[abs/2412.15115.](https://arxiv.org/abs/2412.15115)


Yang, C., Srebro, N., McAllester, D., and Li, Z. Pencil: Long thoughts with short memory. _arXiv_ _preprint_
_arXiv:2503.14337_, 2025b.


Yang, C., Zhou, C., Wipf, D., and Li, Z. On powerful ways
to generate: Autoregression, diffusion, and beyond. _arXiv_
_preprint arXiv:2510.06190_, 2025c.


Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan,
K., and Cao, Y. React: Synergizing reasoning and acting
in language models. In _ICLR_, 2023.


Ye, R., Liu, X., Wu, Q., Pang, X., Yin, Z., Bai, L., et al.
X-mas: Towards building multi-agent systems with heterogeneous llms. _arXiv preprint arXiv:2505.16997_, 2025.


Yu, H., Chen, T., Feng, J., Chen, J., Dai, W., Yu, Q., Zhang,
Y.-Q., Ma, W.-Y., Liu, J., Wang, M., et al. Memagent: Reshaping long-context llm with multi-conv rl-based memory agent. _arXiv preprint arXiv:2507.02259_, 2025.


Zhang, A. L., Kraska, T., and Khattab, O. Recursive language models. _arXiv preprint arXiv:2512.24601_, 2025a.


Zhang, G., Chen, K., Wan, G., Chang, H., Cheng, H., et al.
Evoflow: Evolving diverse agentic workflows on the fly.
_arXiv preprint arXiv:2502.07373_, 2025b.


Zhang, Z., Chen, T., Xu, W., Pentland, A., and Pei, J. Recap:
Recursive context-aware reasoning and planning for large
language model agents. _arXiv preprint arXiv:2510.23822_,
2025c.



11


**Recursive Models for Long-Horizon Reasoning**


Zhou, Z., Qu, A., Wu, Z., Kim, S., Prakash, A., Rus, D.,
Zhao, J., Low, B. K. H., and Liang, P. P. Mem1: Learning
to synergize memory and reasoning for efficient longhorizon agents. _arXiv preprint arXiv:2506.15841_, 2025.


12


**Recursive Models for Long-Horizon Reasoning**


**A. Recursion in Classical Computation Theory**


The idea that recursion depth and local space are fundamental computational resources has deep roots in classical theory.
Most directly related to our work, Savitch (1977) formally extended Turing machines with recursive subroutine calls—each
call receives its own workspace and returns a result to the caller, mirroring the call/return and context-stack mechanism of
our recursive models. Savitch studied the time and storage overhead of recursion, showing that _t_ steps of a recursive TM
can be simulated in _O_ ( _t_ ) steps on a multitape TM, and used this framework to re-derive the NSPACE( _S_ ) _⊆_ DSPACE( _S_ [2] )
result of Savitch’s theorem (Savitch, 1970)—whose proof is itself a recursive subroutine with bounded stack depth, where
recursion depth times per-level workspace yields the total space upper bound, foreshadowing our local-vs-global space
decomposition. The key difference is that Savitch’s recursive TM reads one tape cell per step ( _O_ (1) communication), and
therefore already captures SPACE( _S_ ) without needing deep recursion. Our recursive model replaces the TM head with a
bounded-context Transformer that attends to all _S_ ( _n_ ) tokens per step; it is this architectural constraint that makes deep
recursion necessary to recover the same computational power. Stack automata (Ginsburg et al., 1967) extend pushdown
automata by allowing the head to read within the stack, and nested stack automata (Aho, 1969) further allow the creation and
destruction of substacks, yielding a stack-of-stacks mechanism reminiscent of our context stack. Engelfriet (1991) studied
iterated (higher-order) pushdown storages and established an iterated-exponential hierarchy in computational power as the
storage order increases—a phenomenon consistent with our Theorem 1 and Theorem 3. The alternation theorem (Chandra
et al., 1981), which we directly use in our proofs, connects alternating computation to space complexity via a recursive
evaluation of configuration games.


Our contribution relative to this classical line of work is twofold. First, we introduce recursion as an explicit design
principle for Transformer-based reasoning, formalizing how bounded-context language models can overcome their attention
bottleneck through recursive self-invocation. Second, we prove _Transformer realizability_ : a fixed constant-depth, constantsize Transformer with _O_ (log _S_ ( _n_ )) precision can implement the per-step logic at each recursion level, serving as the
transition function of a recursive machine. This bridges the classical recursion-theoretic framework with the concrete
capabilities of modern neural architectures.


**B. Experimental Setup**


**B.1. Data Generation**


We directly use the SAT instances from Wei et al. (2025), which are Boolean formulas in conjunctive normal form (CNF).
Each instance is converted to a natural language puzzle where variables map to real-world entities and clauses become
narrative constraints. The dataset contains instances of varying difficulty based on the number of clauses: easy (4–19
clauses), medium (20–30 clauses), and hard (31–50 clauses).


For each instance, we generate a recursive reasoning trace by running the DPLL algorithm. At each step, the algorithm
picks an unassigned variable and tries assigning it to True. After each assignment, we check for conflicts: either a clause
becomes empty (directly violated), or unit clauses force the same variable to both True and False. If a conflict is detected,
the algorithm backtracks and tries False. We emit <call> when branching and <return> when returning. These traces
are used for supervised fine-tuning.


For training, we select only easy and medium instances with at most 15 variables. For evaluation, we randomly sample 100
held-out instances from each difficulty level (easy, medium, hard) without any filtering.


**B.2. Training Configuration**


We fine-tune from Qwen2.5-3B-Instruct (Yang et al., 2025a), a decoder-only Transformer with 3 billion parameters. We
use the AdamW optimizer with a learning rate of 1 _×_ 10 _[−]_ [5] and cosine decay schedule. The batch size is 16 with gradient
checkpointing enabled. We train for 10 epochs with a maximum context length of 4096 tokens (left truncation for sequences
exceeding this limit). Training is conducted on 2 _×_ NVIDIA H200 GPUs and takes approximately 8 hours.


**B.3. Implementation**


When <call> is generated, only the reasoning before the tag is preserved in the parent context; the tag content becomes
the child’s current_task. When <return> is generated, the subtask description and return value are appended to the
parent context in the format “ _subtask_desc_ . The answer is: _result_ .” while the intermediate reasoning within the subtask is


13


**Recursive Models for Long-Horizon Reasoning**


discarded. Each context is wrapped with the following template:


[Instructions]
Solve problems recursively. Use <call> </call> to decompose
the problem and <return> </return> to return the answer.


[Root Problem]
{root_problem}


[Current Task]
{current_task}


The root_problem field contains the original problem statement and remains constant across all recursion levels. The
current_task field contains the subtask description for the current level (equal to root_problem at the top level).


**B.4. Sample Problems**


Each training sample consists of three parts: user (the prompt), assistant_prefix (previous reasoning to continue
from), and assistant_content (the target to predict). Below we show two representative turns.


**Example 1:** **<call> at root level.** The model analyzes clauses and branches on a variable:


# user

[Instructions]
Solve problems recursively. Use <call> </call> to decompose the problem and <return> </
return> to return the answer.


[Root Problem]
Five scientists--Alice, Bob, Carol, Dave, and Eve--are considering whether to join a new
research project. Each scientist makes an independent decision about their
participation. They may choose to join or not join the project regardless of others'
choices.


Conditions:
1. Either Alice joins the project or Carol does not join.
2. Either Alice does not join or Carol joins.
3. Either Alice joins or Carol joins.
4. Either Alice does not join or Carol does not join.
5. Either Carol does not join or Eve does not join.


Is there a way to assign decisions so all these conditions are satisfied?


[Current Task]
Is there a way to assign decisions so all these conditions are satisfied?


# assistant_prefix
(empty)


# assistant_content
Condition 1:
Clause: (Alice v ~Carol)
(no simplification needed)
-> (not unit)
Condition 2:
Clause: (~Alice v Carol)
(no simplification needed)
-> (not unit)
Condition 3:
Clause: (Alice v Carol)
(no simplification needed)
-> (not unit)
Condition 4:
Clause: (~Alice v ~Carol)
(no simplification needed)


14


**Recursive Models for Long-Horizon Reasoning**


-> (not unit)
Condition 5:
Clause: (~Carol v ~Eve)
(no simplification needed)
-> (not unit)
No unit clause found. Unassigned: [Alice, Carol, Eve]
Try Alice = True
<call>Alice=True</call>


**Example 2:** **<return> at leaf node.** The model detects a contradiction and returns:


# user

[Instructions]
Solve problems recursively. Use <call> </call> to decompose the problem and <return> </
return> to return the answer.


[Root Problem]
Five scientists--Alice, Bob, Carol, Dave, and Eve--are considering whether to join a new
research project. Each scientist makes an independent decision about their
participation. They may choose to join or not join the project regardless of others'
choices.


Conditions:
1. Either Alice joins the project or Carol does not join.
2. Either Alice does not join or Carol joins.
3. Either Alice joins or Carol joins.
4. Either Alice does not join or Carol does not join.
5. Either Carol does not join or Eve does not join.


Is there a way to assign decisions so all these conditions are satisfied?


[Current Task]
Alice=True, Carol=True


# assistant_prefix
(empty)


# assistant_content
Given: Alice=True, Carol=True
Condition 1:
Clause: (Alice v ~Carol)
-> satisfied
Condition 2:
Clause: (~Alice v Carol)
-> satisfied
Condition 3:
Clause: (Alice v Carol)
-> satisfied
Condition 4:
Clause: (~Alice v ~Carol)
Simplify as: () -> CONFLICT
Contradiction!
<return>No</return>


**Example 3:** **<call> with prefix (backtracking).** After trying Alice=True and receiving “No”, the model backtracks and
tries Alice=False:


# user

[Instructions]
Solve problems recursively. Use <call> </call> to decompose the problem and <return> </
return> to return the answer.


[Root Problem]


15


**Recursive Models for Long-Horizon Reasoning**


Five scientists--Alice, Bob, Carol, Dave, and Eve--are considering whether to join a new
research project. Each scientist makes an independent decision about their
participation. They may choose to join or not join the project regardless of others'
choices.


Conditions:
1. Either Alice joins the project or Carol does not join.
2. Either Alice does not join or Carol joins.
3. Either Alice joins or Carol joins.
4. Either Alice does not join or Carol does not join.
5. Either Carol does not join or Eve does not join.


Is there a way to assign decisions so all these conditions are satisfied?


[Current Task]
Is there a way to assign decisions so all these conditions are satisfied?


# assistant_prefix
Condition 1:
Clause: (Alice v ~Carol)
(no simplification needed)
-> (not unit)
Condition 2:
Clause: (~Alice v Carol)
(no simplification needed)
-> (not unit)
Condition 3:
Clause: (Alice v Carol)
(no simplification needed)
-> (not unit)
Condition 4:
Clause: (~Alice v ~Carol)
(no simplification needed)
-> (not unit)
Condition 5:
Clause: (~Carol v ~Eve)
(no simplification needed)
-> (not unit)
No unit clause found. Unassigned: [Alice, Carol, Eve]
Try Alice = True
Alice=True. The answer is: No.


# assistant_content
Try Alice = False
<call>Alice=False</call>


**C. Transformer Architecture**


We define the decoder-only Transformer architecture used throughout this paper. Let Σ be a finite vocabulary and _d_ be the
hidden dimension.


**Token and Positional Embeddings.** A _token embedding_ TE : Σ _→_ R _[d]_ maps each token to a _d_ -dimensional vector. A
_positional embedding_ PE : N [+] _→_ R _[d]_ encodes position information. For an input sequence ( _x_ 1 _, . . ., xn_ ) _∈_ Σ _[n]_, the initial
embedding at position _i_ is _h_ [(0)] _i_ = TE( _xi_ ) + PE( _i_ ).


**Attention.** For query, key, and value vectors ( _q, kj, vj_ ) _[n]_ _j_ =1 [where] _[ q, k][j]_ _[∈]_ [R] _[d][k]_ [and] _[ v][j]_ _[∈]_ [R] _[d][v]_ [, the attention output with]
temperature _β_ _>_ 0 is:



Attn _β_ ( _q, {kj, vj}_ _[n]_ _j_ =1 [) =]



_n_

- _αjvj,_ where _α_ = softmax _β_ �( _q · kj_ ) _[n]_ _j_ =1� _,_ (11)


_j_ =1


16


**Recursive Models for Long-Horizon Reasoning**


and [softmax _β_ ( _z_ )] _i_ = exp( _zi/β_ ) _/_ [�] _j_ [exp(] _[z][j][/β]_ [)][.]


**Average-Hard Attention (AHA).** Taking the zero-temperature limit _β_ _→_ 0 yields average-hard attention (Merrill et al.,
2022), which uniformly averages over the maximum-scoring positions:



AHA( _q, {kj, vj}_ _[n]_ _j_ =1 [) =] [1]

_|A|_




- _vj,_ where _A_ = arg max (12)

_j∈_ [ _n_ ] _[⟨][q, k][j][⟩][.]_
_j∈A_



AHA involves only comparisons and uniform averaging, which can be computed exactly in finite precision. All theoretical
results in this paper use AHA.


**Multi-Head** **Self-Attention.** A _multi-head_ _self-attention_ layer with _H_ heads is parametrized by projection matrices
_WQ_ _[h][, W]_ _K_ _[ h]_ _[, W]_ _V_ _[ h]_ _[∈]_ [R] _[d][k][×][d]_ [ and] _[ W][ h]_ _O_ _[∈]_ [R] _[d][×][d][k]_ [for] _[ h][ ∈]_ [[] _[H]_ []][.] [For embeddings][ (] _[h]_ [1] _[, . . ., h][n]_ [)][, the output at position] _[ n]_ [ is:]



MHA( _h_ 1 _, . . ., hn_ ) =



_H_

- _WO_ _[h]_ _[·]_ [ AHA] - _WQ_ _[h][h][n][,][ {][W]_ _K_ _[ h]_ _[h][j][, W]_ _V_ _[ h][h][j][}]_ _j_ _[n]_ =1� _._ (13)

_h_ =1



For decoder-only (causal) Transformers, position _n_ attends only to positions _j_ _≤_ _n_ .


**Feed-Forward Layer.** A _feed-forward_ layer with width _d_ ff and activation _σ_ is defined as:


FF( _h_ ) = _W_ 2 _· σ_ ( _W_ 1 _· h_ + _b_ 1) + _b_ 2 _,_ (14)


where _W_ 1 _∈_ R _[d]_ [ff] _[×][d]_, _W_ 2 _∈_ R _[d][×][d]_ [ff], and _b_ 1 _, b_ 2 are bias terms.


**Transformer Layer.** A single _Transformer layer_ combines multi-head attention and feed-forward with residual connections:
TF( _h_ 1 _, . . ., hn_ ) = FF( _h_ [˜] _n_ ) + _h_ [˜] _n,_ where _h_ [˜] _n_ = MHA( _h_ 1 _, . . ., hn_ ) + _hn._ (15)


**Next-Token Predictor.** An _L_ -layer decoder-only Transformer defines a next-token predictor _fθ_ : Σ _[∗]_ _→_ Σ as:



(16)
_x_ _[,]_



_fθ_ ( _x_ 1 _, . . ., xn_ ) = arg max
_x∈_ Σ




- _W_ dec _· h_ [(] _n_ _[L]_ [)]



where _h_ [(] _n_ _[L]_ [)] is the final-layer embedding at position _n_, computed by stacking _L_ Transformer layers on top of the initial
embeddings, and _W_ dec _∈_ R _[|]_ [Σ] _[|×][d]_ is the decoding matrix.


**Precision.** We say a Transformer has _O_ (log _S_ ( _n_ )) _precision_ if all intermediate numerical values (embeddings, attention
scores, and feed-forward activations) are rational numbers _p/q_ with _|p|, |q| ≤_ _S_ ( _n_ ) _[C]_ for a universal constant _C_, where _S_ ( _n_ )
is the local space bound, i.e., the input sequence length to the Transformer. Equivalently, each value is representable in
_O_ (log _S_ ( _n_ )) bits, and all arithmetic is exact with no rounding. This precision model is consistent with Yang et al. (2025b):
operations such as seq_sum over _S_ ( _n_ ) indicator values produce results bounded by _S_ ( _n_ ), seq_max preserves input
magnitudes, and rightmost_exact_match concentrates attention on a single position, all within _O_ (log _S_ ( _n_ ))-bit
exact arithmetic.


**D. Single-Tape Turing Machine**


A single-tape Turing machine operates on an infinite tape indexed by Z, where each cell holds a symbol from a finite
tape alphabet Γ. A read/write head moves along the tape, and a finite set of control states governs the machine’s behavior.
Formally, a Turing machine is a 7-tuple TM = (Γ _, b, Q, q_ 0 _, δ, Q_ acc _, Q_ rej), where _b ∈_ Γ is the blank symbol; _q_ 0 _∈_ _Q_ is the
initial state; _δ_ : ( _Q \_ ( _Q_ acc _∪_ _Q_ rej)) _×_ Γ _→_ _Q ×_ Γ _× {−_ 1 _,_ 0 _,_ +1 _}_ is the transition function; and _Q_ acc _, Q_ rej _⊆_ _Q_ are disjoint
accepting and rejecting states.


**Execution.** Given input _x ∈_ (Γ _\ {b}_ ) _[n]_, the tape is initialized with _x_ in cells 0 _, . . ., n −_ 1 and blanks elsewhere; the head
starts at position 0 in state _q_ 0. At each step, the machine reads the symbol _a_ under the head, computes ( _q_ _[′]_ _, w, d_ ) = _δ_ ( _q, a_ ),
writes _w_, moves the head by _d_ _∈{−_ 1 _,_ 0 _,_ +1 _}_, and transitions to state _q_ _[′]_ . The machine halts upon entering _Q_ acc _∪_ _Q_ rej,
outputting 1 (accept) or 0 (reject) accordingly.


17


**Recursive Models for Long-Horizon Reasoning**


**Normalization.** To ensure configurations are well-defined for all _t ≤_ _T_ ( _n_ ), we extend _δ_ to halting states by making them
self-loops: for all _q_ _∈_ _Q_ acc _∪_ _Q_ rej and _a ∈_ Γ, define _δ_ ( _q, a_ ) := ( _q, a,_ 0). This does not change the language decided by TM.


**Complexity Classes.** The _time complexity T_ (TM _, x_ ) is the number of steps before halting. The _space complexity S_ (TM _, x_ )
is the number of distinct tape cells visited. A Turing machine TM _decides_ a language _L ⊆_ Σ _[∗]_ if it halts on all inputs and
accepts exactly those in _L_ . The complexity classes are defined as:


TIME( _f_ ( _n_ )) = _{L_ : _∃_ TM deciding _L_ with _T_ (TM _, x_ ) _≤_ _f_ ( _|x|_ ) for all _x},_ (17)


SPACE( _f_ ( _n_ )) = _{L_ : _∃_ TM deciding _L_ with _S_ (TM _, x_ ) _≤_ _f_ ( _|x|_ ) for all _x}._ (18)


**E. Proof of Theorem 1**


**Theorem** **6** (Deep Recursive Models, Formal) **.** _For_ _any_ _S_ ( _n_ ) _≥_ _n,_ _recursive_ _models_ _can_ _solve_ _any_ _problem_ _in_
TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) _under local space constraint O_ ( _S_ ( _n_ )) _:_


TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _, ∞, ∞_ ) _._ (19)


The proof proceeds in two parts: **(1)** we define mutually recursive functions that compute TM configurations and prove their
correctness; **(2)** we analyze the resource consumption (local space, recursion depth, and runtime). We further provides a
sketch for constructing the Transformer but the detailed implementation is omitted. An alternative proof via Alternating
Turing Machines appears in Appendix F, which includes the detailed implementation for the corresponding Transformer.


**E.1. Recursive Construction**


Let TM = (Γ _, b, Q, q_ 0 _, δ, Q_ acc _, Q_ rej) be a single-tape Turing machine. We use time _t_ to denote the number of transitions
already executed: _t_ = 0 is the initial configuration, and transitioning from _t_ to _t_ + 1 executes the _t_ -th transition.


**Configuration.** A _configuration_ of TM at time _t_ is a triple _ct_ = ( _qt, τt, pt_ ) where:


- _qt_ _∈_ _Q_ is the control state at time _t_ ;


- _τt_ : Z _→_ Γ is the _tape contents_ at time _t_, mapping each cell index to a symbol, with _τt_ ( _i_ ) = _b_ (the blank symbol) for all
but finitely many _i_ ;


- _pt_ _∈_ Z is the head position at time _t_ .


For a tape _τ_ and position _p_, we write _τ_ [ _p_ _�→_ _w_ ] for the tape that agrees with _τ_ everywhere except at position _p_, where it
holds symbol _w_ . The initial configuration is _c_ 0 = ( _q_ 0 _, τ_ 0 _,_ 0) where _τ_ 0( _i_ ) = _x_ [ _i_ ] for 0 _≤_ _i < n_ and _τ_ 0( _i_ ) = _b_ otherwise.


**Recursive** **functions.** We define the following mutually recursive functions that compute the components of _ct_ . Let
_x ∈_ (Γ _\ {b}_ ) _[n]_ be the input.


- STATE( _x, t_ ) _∈_ _Q_ : returns the control state _qt_


- POS( _x, t_ ) _∈_ Z: returns the head position _pt_


- CELL( _x, t, p_ ) _∈_ Γ: returns the tape symbol _τt_ ( _p_ ) at position _p_


- SYMBOL( _x, t_ ) _∈_ Γ: returns the symbol under the head _τt_ ( _pt_ )


- RUN( _x, t_ ) _∈{_ 0 _,_ 1 _}_ : starting from time _t_, simulate until halting and return accept (1) or reject (0)


**Algorithm.** The following five algorithms present the pseudocode for these mutually recursive functions. The transition
function _δ_ is assumed to be hardcoded into the model parameters. We fix a constant _c >_ 0 such that the Turing machine TM
deciding _L_ halts within _T_ ( _n_ ) := 2 _[c][·][S]_ [(] _[n]_ [)] steps on all inputs of length _n_ .


18


**Recursive Models for Long-Horizon Reasoning**


**Algorithm 6** STATE( _x, t_ ) _→_ _qt_ _∈_ _Q_


1: **if** _t_ = 0 **then return** _q_ 0
2: ( _q_ _[′]_ _, w, d_ ) _←_ _δ_ (STATE( _x, t −_ 1) _,_ SYMBOL( _x, t −_ 1))
3: **return** _q_ _[′]_


**Algorithm 7** POS( _x, t_ ) _→_ _pt_ _∈_ Z


1: **if** _t_ = 0 **then return** 0
2: ( _q_ _[′]_ _, w, d_ ) _←_ _δ_ (STATE( _x, t −_ 1) _,_ SYMBOL( _x, t −_ 1))
3: **return** POS( _x, t −_ 1) + _d_


**Algorithm 8** CELL( _x, t, p_ ) _→_ _τt_ ( _p_ ) _∈_ Γ


1: **if** _t_ = 0 **then return** _x_ [ _p_ ] if 0 _≤_ _p < |x|_ else _b_
2: _p_ prev _←_ POS( _x, t −_ 1)
3: **if** _p ̸_ = _p_ prev **then return** CELL( _x, t −_ 1 _, p_ ) _▷_ recurse
4: ( _q_ _[′]_ _, w, d_ ) _←_ _δ_ (STATE( _x, t −_ 1) _,_ SYMBOL( _x, t −_ 1))
5: **return** _w_ _▷_ symbol written at _t −_ 1


**Algorithm 9** SYMBOL( _x, t_ ) _→_ _τt_ ( _pt_ ) _∈_ Γ


1: **return** CELL( _x, t,_ POS( _x, t_ ))


**Algorithm 10** RUN( _x, t_ ) _→{_ 0 _,_ 1 _}_


1: _q_ _←_ STATE( _x, t_ )
2: **if** _q_ _∈_ _Q_ acc **then return** 1 _▷_ accept
3: **if** _q_ _∈_ _Q_ rej **then return** 0 _▷_ reject
4: **return** RUN( _x, t_ + 1) _▷_ continue


The decision procedure is DECIDE( _x_ ) := RUN( _x,_ 0). Since _L ∈_ TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ), the TM halts within _T_ = 2 _[c][·][S]_ [(] _[n]_ [)] steps,
so RUN terminates and correctly outputs accept/reject. We now show that the recursive semantics faithfully tracks the TM’s
behavior.


**Lemma 7** (Correctness of Recursive Semantics) **.** _Let qt, pt, τt_ _denote the true state, head position, and tape contents of_ TM
_at time t._ _For every input x, every t ≥_ 0 _, and every position p ∈_ Z _:_


_1._ STATE( _x, t_ ) = _qt_


_2._ POS( _x, t_ ) = _pt_


_3._ CELL( _x, t, p_ ) = _τt_ ( _p_ )


_4._ SYMBOL( _x, t_ ) = _τt_ ( _pt_ )


_Proof._ By induction on _t_ .


_Base case (t_ = 0 _):_ By the TM initialization semantics, _q_ 0 is the initial state, _p_ 0 = 0, and _τ_ 0( _p_ ) = _x_ [ _p_ ] for 0 _≤_ _p_ _<_ _n_
and _τ_ 0( _p_ ) = _b_ otherwise. These match the base cases of our recursive functions. For claim (4), SYMBOL( _x,_ 0) =
CELL( _x,_ 0 _,_ POS( _x,_ 0)) = _τ_ 0(0) = _τ_ 0( _p_ 0).


_Inductive step (t ≥_ 1 _):_ Assume the claims hold for time _t −_ 1. By definition and the induction hypothesis:


SYMBOL( _x, t −_ 1) = CELL( _x, t −_ 1 _,_ POS( _x, t −_ 1)) = _τt−_ 1( _pt−_ 1) (20)


19


**Recursive Models for Long-Horizon Reasoning**


Let ( _q_ _[′]_ _, w, d_ ) := _δ_ (STATE( _x, t_ _−_ 1) _,_ SYMBOL( _x, t_ _−_ 1)) be the transition output. By the induction hypothesis,
STATE( _x, t_ _−_ 1) = _qt−_ 1, so the transition _δ_ ( _qt−_ 1 _, τt−_ 1( _pt−_ 1)) computed by the algorithm is exactly the transition
taken by TM at step _t −_ 1. Thus:


- STATE( _x, t_ ) = _q_ _[′]_ = _qt_ (the new state from _δ_ )


- POS( _x, t_ ) = _pt−_ 1 + _d_ = _pt_ (head moves by _d_ )


- CELL( _x, t, p_ ) = _τt_ ( _p_ ): only cell _pt−_ 1 changes to _w_ ; others unchanged


- SYMBOL( _x, t_ ) = CELL( _x, t,_ POS( _x, t_ )) = _τt_ ( _pt_ )


This completes the induction.


**E.2. Resource Analysis**


We analyze three resources: local space (per-context length), recursion depth (call stack height), and total runtime (number
of recursive calls).


**Local Space.** Each recursive frame must store the following data:


- _Input x_ : length _n_


- _Time parameter t_ _[′]_ : _O_ (log _t_ ) bits in binary representation


- _Position parameter p_ (for CELL): since the head moves at most 1 cell per step, _|p| ≤_ _t_, so _|_ bin( _p_ ) _|_ = _O_ (log _t_ )


- _State q_ _∈_ _Q_, _symbol a ∈_ Γ, _move direction d ∈{−_ 1 _,_ 0 _,_ +1 _}_ : _O_ (1) bits (finite sets)


- _Returned answers from subcalls_ : state ( _O_ (1)), position ( _O_ (log _t_ )), symbol ( _O_ (1))


Crucially, each context makes only _O_ (1) nested calls before returning. When a callee returns, the call/return mechanism
removes its entire context from the stack and appends only the returned value to the caller’s context. This prevents
accumulation of intermediate results. Thus, each context has length _O_ ( _n_ + log _t_ ). In Theorem 6, _t ≤_ _T_ ( _n_ ) = 2 _[c][·][S]_ [(] _[n]_ [)], so
log _t ≤_ _c · S_ ( _n_ ). Since _S_ ( _n_ ) _≥_ _n_, the local space bound is _O_ ( _n_ + _S_ ( _n_ )) = _O_ ( _S_ ( _n_ )).


**Recursion Depth.** For the inner functions (STATE _,_ POS _,_ CELL _,_ SYMBOL): each call with time parameter _t_ recursively
invokes only subcalls with parameter _t −_ 1. Thus, starting from _t_ = _T_ ( _n_ ), the recursion depth is _O_ ( _T_ ( _n_ )).


For the outer decision procedure RUN: even without assuming any tail-call optimization, the additional stack height
contributed by iterating through time steps 0 _,_ 1 _, . . ._ is at most _O_ ( _T_ ( _n_ )). Each RUN( _x, t_ ) calls STATE( _x, t_ ), which itself
has depth _O_ ( _t_ ).


Overall, the maximum recursion depth is _O_ ( _T_ ( _n_ )) = _O_ (2 _[c][·][S]_ [(] _[n]_ [)] ).


**Time Complexity (Total Subroutine Invocations).** We measure runtime by the total number of subroutine invocations
across all recursive contexts. Since the Transformer _fθ_ has constant size and each invocation produces at most _O_ ( _S_ ( _n_ ))
tokens, this differs from the total token count by at most an _O_ ( _S_ ( _n_ )) factor.


For each routine F _∈{_ STATE _,_ POS _,_ CELL _,_ SYMBOL _,_ RUN _}_, let _T_ F( _t_ ) denote the worst-case total number of subroutine
invocations triggered by evaluating F( _x, t_ ) (for CELL, we also maximize over _p ∈_ Z). From Algorithms 1–5:


_T_ STATE( _t_ ) _≤T_ STATE( _t −_ 1) + _T_ SYMBOL( _t −_ 1) + _O_ (1) _,_ (21)

_T_ POS( _t_ ) _≤T_ POS( _t −_ 1) + _T_ STATE( _t −_ 1) + _T_ SYMBOL( _t −_ 1) + _O_ (1) _,_ (22)

_T_ CELL( _t_ ) _≤T_ POS( _t −_ 1) + max� _T_ CELL( _t −_ 1) _,_ _T_ STATE( _t −_ 1) + _T_ SYMBOL( _t −_ 1)� + _O_ (1) _,_ (23)

_T_ SYMBOL( _t_ ) _≤T_ POS( _t_ ) + _T_ CELL( _t_ ) + _O_ (1) _,_ (24)

_T_ RUN( _t_ ) _≤T_ STATE( _t_ ) + _T_ RUN( _t_ + 1) + _O_ (1) _._ (25)


To simplify these coupled recurrences, we define two dominant quantities:


_V_ ( _t_ ) := max           - _T_ STATE( _t_ ) _,_ _T_ POS( _t_ )� _,_ _C_ ( _t_ ) := _T_ CELL( _t_ ) _._ (26)


20


**Recursive Models for Long-Horizon Reasoning**


By equation 24, _T_ SYMBOL( _t_ ) _≤_ _V_ ( _t_ ) + _C_ ( _t_ ) + _O_ (1). Substituting into equation 21–equation 23 yields:


_V_ ( _t_ ) _≤_ 3 _V_ ( _t −_ 1) + _C_ ( _t −_ 1) + _O_ (1) _,_


_C_ ( _t_ ) _≤_ 3 _V_ ( _t −_ 1) + _C_ ( _t −_ 1) + _O_ (1) _._



Therefore,

           - _V_ ( _t_ )
_C_ ( _t_ )




- �3 1
_⪯_
3 1



�� _V_ ( _t −_ 1)�

+ _O_ (1) _,_ (27)

_C_ ( _t −_ 1)



whose spectral radius is 4. Hence _V_ ( _t_ ) _, C_ ( _t_ ) = _O_ (4 _[t]_ ).


Finally, if the simulated Turing machine halts within _T_ ( _n_ ) steps, then RUN( _x,_ 0) performs at most _T_ ( _n_ ) iterations, each
invoking STATE( _x, t_ ) once. Using equation 25:



_T_ RUN(0) _≤_



_T_ ( _n_ )

- _T_ STATE( _t_ ) = _O_ ( _V_ ( _T_ ( _n_ ))) = _O_ (4 _[T]_ [ (] _[n]_ [)] ) _._ (28)


_t_ =0



For _T_ ( _n_ ) = 2 _[c][·][S]_ [(] _[n]_ [)], this becomes 4 _[T]_ [ (] _[n]_ [)] = 2 [2] _[T]_ [ (] _[n]_ [)] = 2 [2][Θ(] _[S]_ [(] _[n]_ [))], i.e., double exponential in _S_ ( _n_ ). Since each invocation
produces at most _O_ ( _S_ ( _n_ )) tokens, the total generated tokens remain 2 [2][Θ(] _[S]_ [(] _[n]_ [))] .


This double-exponential runtime does _not_ affect the RCM( _·, ·_ ) membership statement, which constrains only local space
and recursion depth. To reduce runtime to 2 _[O]_ [(] _[S]_ [(] _[n]_ [))], one can augment the simulation with memoization: caching results of
STATE( _x, t_ _[′]_ ) in external storage ensures each subproblem is computed only once.


**E.3. Transformer Construction**


We sketch how a Transformer can implement the recursive simulation described above. The key insight is that each step
of Algorithms 1–5 involves only: (i) parsing a bounded-length prefix to identify the function and arguments, (ii) counting
delimiters to determine the current phase, (iii) performing constant-size table lookups ( _δ_, _Q_ acc, _Q_ rej), and (iv) emitting
tokens for calls/returns.


E.3.1. SETUP


**Token Vocabulary.** We define the following special tokens:


- _Function tokens_ : _⟨_ STATE _⟩_, _⟨_ POS _⟩_, _⟨_ CELL _⟩_, _⟨_ SYMBOL _⟩_, _⟨_ RUN _⟩_ indicate which recursive function is being invoked.


- _Control tokens_ : _⟨_ call _⟩_, _⟨/_ call _⟩_, _⟨_ return _⟩_, _⟨/_ return _⟩_ mark the boundaries of recursive calls and returns.


- _Separator_ _tokens_ : _⟨_ sep _⟩_ separates arguments within a call; [SEP] is an internal delimiter that separates cached
intermediate results within a context.


- _Data tokens_ : Tokens from Γ (tape alphabet), _Q_ (states), and binary digits _{_ 0 _,_ 1 _}_ for encoding integers.


**Context Format.** Each function-call frame is a single sequence (context) whose prefix contains the input arguments, and
whose suffix progressively caches intermediate results from subcalls. A typical context has the form:


_⟨F_ _⟩⟨_ sep _⟩_ arg1 _⟨_ sep _⟩_ arg2           - _⟨_ sep _⟩_ arg3           - [SEP] _z_ 1 [SEP] _z_ 2 _· · ·_ (29)


where _⟨F_ _⟩_ is the function token (e.g., _⟨_ STATE _⟩_ ), and each _zi_ is either a returned value from a recursive call or an internally
produced constant-size token. Recursive calls are wrapped as _⟨_ call _⟩⟨F_ _⟩⟨_ sep _⟩· · · ⟨/_ call _⟩_ . Returns are encoded as
_⟨_ return _⟩_ [SEP] **v** _⟨/_ return _⟩_ —note that the payload begins with [SEP]. Thus, when a subcall finishes, the caller
receives the payload [SEP] **v** appended to its context, so each completed subcall contributes exactly one [SEP] delimiter
to the caller’s phase cache.


**Transformer Behavior.** The Transformer _fθ_ decides what to do next by inspecting only: (i) which function token _⟨F_ _⟩_
begins the context, (ii) whether the time argument is zero (via a bit-scan), and (iii) how many [SEP] delimiters have already
appeared (the “phase”). This is a standard finite-phase construction: each function needs only a constant number of phases
to implement the corresponding algorithmic step. Specifically, _fθ_ executes the logic specified in Algorithms 1–5:


21


**Recursive Models for Long-Horizon Reasoning**


1. **Base case** : If _t_ = 0 (detected by checking if bin( _t_ ) is all zeros), output _⟨_ return _⟩_ [SEP] **v** 0 _⟨/_ return _⟩_ where **v** 0 is
the base case value ( _q_ 0, 0, _x_ [ _p_ ] or _b_, depending on the function).


2. **Recursive case** : If _t >_ 0, the Transformer performs the following operations depending on the function token:


  - _⟨_ **STATE** _⟩_ : (i) compute _t −_ 1 via binary decrement; (ii) call _⟨_ STATE _⟩_ and _⟨_ SYMBOL _⟩_ with ( _x, t −_ 1) to obtain _qt−_ 1
and _at−_ 1; (iii) compute _δ_ ( _qt−_ 1 _, at−_ 1) via lookup table to get ( _q_ _[′]_ _, w, d_ ); (iv) return _q_ _[′]_ .

  - _⟨_ **POS** _⟩_ : (i) compute _t −_ 1; (ii) call _⟨_ STATE _⟩_ and _⟨_ SYMBOL _⟩_ with ( _x, t −_ 1); (iii) compute _δ_ to get _d_ ; (iv) call _⟨_ POS _⟩_
with ( _x, t −_ 1) to get _pt−_ 1; (v) compute _pt−_ 1 + _d_ via binary addition; (vi) return _pt_ .

  - _⟨_ **CELL** _⟩_ : (i) compute _t −_ 1; (ii) call _⟨_ POS _⟩_ with ( _x, t −_ 1) to get _pt−_ 1; (iii) compare _p_ with _pt−_ 1: if _p ̸_ = _pt−_ 1, recurse
by calling _⟨_ CELL _⟩_ with ( _x, t −_ 1 _, p_ ); otherwise (iv) call _⟨_ STATE _⟩_ and _⟨_ SYMBOL _⟩_ with ( _x, t −_ 1), compute _δ_ to get _w_,
and return _w_ .

  - _⟨_ **SYMBOL** _⟩_ : call _⟨_ POS _⟩_ with ( _x, t_ ) to get _pt_, then call _⟨_ CELL _⟩_ with ( _x, t, pt_ ) and return the result.

  - _⟨_ **RUN** _⟩_ : (i) call _⟨_ STATE _⟩_ with ( _x, t_ ) to get _qt_ ; (ii) check if _qt_ _∈_ _Q_ acc _∪_ _Q_ rej: if _qt_ _∈_ _Q_ acc, return 1; if _qt_ _∈_ _Q_ rej, return
0; otherwise (iii) compute _t_ + 1 via binary increment and call _⟨_ RUN _⟩_ with ( _x, t_ + 1).


3. **Return** **processing** : When a _⟨/_ return _⟩_ token is encountered, the context manager _g_ pops the current frame and
appends the payload [SEP] **v** to the parent context, automatically incrementing the parent’s phase count.


**Transformer construction.** It remains to verify that the next-token policy described above is implementable by a fixed
constant-depth, constant-size Transformer with _O_ (log _S_ ( _n_ )) precision. The recursive functions STATE, POS, CELL,
SYMBOL, and RUN reduce to the following primitive operations:


(a) Parsing the context to identify the function token _⟨F_ _⟩_ and extract arguments;


(b) Phase counting via seq_sum: counting the number of [SEP] delimiters to determine the current computation phase;


(c) Binary arithmetic: increment ( _t_ _�→_ _t_ + 1) and decrement ( _t_ _�→_ _t −_ 1) of the time parameter, and position updates
( _p ± d_ ), using seq_max for bit-scans;


(d) Cache retrieval via rightmost_exact_match: retrieving previously computed values from the context;


(e) Finite lookups of _δ_, _Q_ acc, _Q_ rej (hard-coded into parameters).


All primitive operations (a)–(e) above are already established in Appendix G of Yang et al. (2025b); our construction
differs only in the choice of special tokens and parsing format. We refer readers to that paper for the detailed Transformer
implementation. A complete construction using an alternative approach (via Alternating Turing Machines) appears in
Appendix F.


**F. Proof of Theorem 1 via Alternating Turing Machine**


This section gives an alternative proof of Theorem 1. The proof follows the classical characterization TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) =
ASPACE( _O_ ( _S_ ( _n_ ))) (Chandra–Kozen–Stockmeyer) and then realizes the resulting AND/OR computation using the
call/return recursion mechanism, with the per-step logic implemented by a constant-depth Transformer via FullAccess Sequence Processing (FASP) (Yang et al., 2025b).


**F.1. Alternating Turing Machines and** ASPACE


An _alternating Turing machine_ (ATM) is a nondeterministic Turing machine _A_ = (Γ _, b, Q, q_ 0 _,_ ∆ _, Q_ acc _, Q_ rej) whose nonhalting states are partitioned into _existential_ and _universal_ states: _Q \_ ( _Q_ acc _∪_ _Q_ rej) = _Q∃_ _∪_ [˙] _Q∀_ . The transition relation is a
finite set
∆ _⊆_ ( _Q \_ ( _Q_ acc _∪_ _Q_ rej)) _×_ Γ _× Q ×_ Γ _× {−_ 1 _,_ 0 _,_ +1 _}._ (30)


Each tuple ( _q, a, q_ _[′]_ _, a_ _[′]_ _, d_ ) _∈_ ∆ specifies: in state _q_ reading symbol _a_, the machine may transition to state _q_ _[′]_, write _a_ _[′]_ on the
current cell, and move the head by _d_ _∈{−_ 1 _,_ 0 _,_ +1 _}_ . For a configuration _c_ = ( _q, τ, p_ ) (state _q_, tape contents _τ_ : Z _→_ Γ,
head position _p_ ), the set of successor configurations is


Succ( _c_ ) := _{_ ( _q_ _[′]_ _, τ_ [ _p �→_ _a_ _[′]_ ] _, p_ + _d_ ) : ( _q, τ_ ( _p_ ) _, q_ _[′]_ _, a_ _[′]_ _, d_ ) _∈_ ∆ _},_ (31)


22


**Recursive Models for Long-Horizon Reasoning**


where _τ_ [ _p_ _�→_ _a_ _[′]_ ] denotes the tape with symbol at position _p_ updated to _a_ _[′]_ . Since we assume exactly two successors, we
index them as Succ0( _c_ ) and Succ1( _c_ ). For _i_ _∈{_ 0 _,_ 1 _}_, let _δi_ ( _c_ ) := ( _qi_ _[′][, w][i][, d][i]_ [)][ denote the] _[ i]_ [-th applicable transition tuple]
(i.e., ( _q, τ_ ( _p_ ) _, qi_ _[′][, w][i][, d][i]_ [)] _[ ∈]_ [∆][), so that][ Succ] _[i]_ [(] _[c]_ [) = (] _[q]_ _i_ _[′][, τ]_ [[] _[p][ �→]_ _[w][i]_ []] _[, p]_ [ +] _[ d][i]_ [)][.]



**Acceptance** **Semantics.** Fix an input _x_ and let _c_ start( _x_ ) be the start configuration. Assuming _A_ is a _decider_ (every
branch halts), the acceptance value Win( _c_ ) _∈{_ 0 _,_ 1 _}_ is defined recursively over the computation tree: if _c_ halts in _Q_ acc then
Win( _c_ ) = 1; if in _Q_ rej then Win( _c_ ) = 0; if _c_ is non-halting with state in _Q∃_, then Win( _c_ ) = [�] _c_ _[′]_ _∈_ Succ( _c_ ) [Win][(] _[c][′]_ [)][; if in] _[ Q][∀]_ [,]



Win( _c_ ) = 1; if in _Q_ rej then Win( _c_ ) = 0; if _c_ is non-halting with state in _Q∃_, then Win( _c_ ) = [�] _c_ _[′]_ _∈_ Succ( _c_ ) [Win][(] _[c][′]_ [)][; if in] _[ Q][∀]_ [,]

then Win( _c_ ) = [�] _c_ _[′]_ _∈_ Succ( _c_ ) [Win][(] _[c][′]_ [)][.] [The machine accepts] _[ x]_ [ iff][ Win][(] _[c]_ [start][(] _[x]_ [)) = 1][.]



_c_ _[′]_ _∈_ Succ( _c_ ) [Win][(] _[c][′]_ [)][.] [The machine accepts] _[ x]_ [ iff][ Win][(] _[c]_ [start][(] _[x]_ [)) = 1][.]



**Alternating Space.** The class ASPACE( _S_ ( _n_ )) consists of languages decidable by an ATM that visits at most _O_ ( _S_ ( _n_ ))
tape cells along every branch.


**Lemma 8** (Chandra–Kozen–Stockmeyer characterization) **.** _For any space-constructible S_ ( _n_ ) _≥_ _n,_


TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) = ASPACE( _O_ ( _S_ ( _n_ ))) _._ (32)


_Proof._ This is the classical _alternation theorem_ (Chandra et al., 1981); see also standard textbook treatments (Arora &
Barak, 2009).


**F.2. Recursive Construction**


Fix a space-constructible _S_ ( _n_ ) _≥_ _n_ and a language _L ∈_ TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ). By Lemma 8, there exists an ATM _A_ deciding
_L_ in space _O_ ( _S_ ( _n_ )). Deciding _x_ reduces to evaluating Win( _c_ start( _x_ )). Since _A_ is fixed, we assume w.l.o.g. that every
non-halting configuration has _exactly two_ successors (by padding missing successors with reject for existential states and
accept for universal states, and converting bounded fanout to binary). We denote the two successors by Succ0( _c_ ) and
Succ1( _c_ ).


**Configuration.** A _configuration_ of _A_ is a triple _c_ = ( _q, τ, p_ ) where _q_ _∈_ _Q_ is the control state, _τ_ : Z _→_ Γ is the tape
contents, and _p ∈_ Z is the head position. Since _A_ uses _O_ ( _S_ ( _n_ )) space, each reachable configuration can be encoded as a
token sequence Embed( _c_ ) of length _O_ ( _S_ ( _n_ )); the precise encoding is described in _§_ F.3.


**Recursive functions.** We define the following functions for evaluating configurations:


- STEP( _c, i_ ) _∈{_ configurations _}_ : returns the _i_ -th successor Succ _i_ ( _c_ ) for _i ∈{_ 0 _,_ 1 _}_


- HALTING( _c_ ) _∈{_ 0 _,_ 1 _, ⊥}_ : returns 1 if _c ∈_ _Q_ acc, 0 if _c ∈_ _Q_ rej, _⊥_ otherwise


- TYPE( _c_ ) _∈{∃, ∀}_ : returns the alternation type of non-halting configuration _c_


- COMB( _c, b_ 0 _, b_ 1) _∈{_ 0 _,_ 1 _}_ : returns _b_ 0 _∨_ _b_ 1 if TYPE( _c_ ) = _∃_, else _b_ 0 _∧_ _b_ 1


- EVAL( _c_ ) _∈{_ 0 _,_ 1 _}_ : evaluates Win( _c_ ) recursively


**Algorithm.** The following algorithm presents the pseudocode for EVAL:


**Algorithm 11** EVAL( _c_ ) _→_ _b ∈{_ 0 _,_ 1 _}_


1: **if** HALTING( _c_ ) = 1 **then return** 1 _▷_ accept
2: **if** HALTING( _c_ ) = 0 **then return** 0 _▷_ reject
3: _b_ 0 _←_ EVAL(STEP( _c,_ 0)) _▷_ evaluate first successor
4: _b_ 1 _←_ EVAL(STEP( _c,_ 1)) _▷_ evaluate second successor
5: **return** COMB( _c, b_ 0 _, b_ 1) _▷_ AND/OR combination


**Correctness.** By structural induction on the computation tree:


- _Base case:_ If _c_ is halting, EVAL( _c_ ) returns 1 iff _c ∈_ _Q_ acc, which equals Win( _c_ ) by definition.


23


**Recursive Models for Long-Horizon Reasoning**


- _Inductive_ _step:_ If _c_ is non-halting, by IH, _bi_ = EVAL(STEP( _c, i_ )) = Win(Succ _i_ ( _c_ )) for _i_ _∈{_ 0 _,_ 1 _}_ . Then
COMB( _c, b_ 0 _, b_ 1) computes the correct AND/OR combination based on TYPE( _c_ ), matching the definition of Win( _c_ ).


Thus EVAL( _c_ start( _x_ )) = Win( _c_ start( _x_ )), correctly deciding whether _A_ accepts _x_ .


**Resource analysis.** Each recursive frame stores the configuration encoding Embed( _c_ ) ( _O_ ( _S_ ( _n_ )) tokens), the returned bits
_b_ 0 _, b_ 1 ( _O_ (1) bits), and call/return delimiters ( _O_ (1) tokens), yielding local space _O_ ( _S_ ( _n_ )) per context. For recursion depth,
an ATM using _O_ ( _S_ ( _n_ )) space has at most 2 _[O]_ [(] _[S]_ [(] _[n]_ [))] distinct configurations (finite control _×_ head position _×_ tape contents).
Because _A_ is a decider, the configuration graph is acyclic—a cycle would induce an infinite branch. Hence the maximum
recursion depth is bounded by the number of reachable configurations: 2 _[O]_ [(] _[S]_ [(] _[n]_ [))] .


**F.3. Preliminaries and Setup**


To implement the recursive evaluation with a Transformer, we first introduce how to represent Turing machine configurations
as token sequences that the Transformer can process.


**Update tokens.** We encode configurations using _update tokens_ . Let Σupd := _Q ×_ Γ _× {−_ 1 _,_ 0 _,_ +1 _}_ be the set of update
tokens, where each token ( _q_ _[′]_ _, w, d_ ) represents: “write _w_ at the current head cell, move by _d_, and set state to _q_ _[′]_ ”.


**Update** **operator.** For a configuration _c_ = ( _q, τ, p_ ), define the _update_ _operator_ Update( _c,_ ( _q_ _[′]_ _, w, d_ )) := ( _q_ _[′]_ _, τ_ [ _p_ _�→_
_w_ ] _, p_ + _d_ ), and extend it to sequences by Update( _c, x_ 1: _k_ ) := Update(Update( _c, x_ 1: _k−_ 1) _, xk_ ). Let _c_ blank := ( _q_ 0 _, b_ [Z] _,_ 0)
denote the blank configuration (initial state, all-blank tape, head at origin).


**Translational equivalence.** Two configurations _c_ 1 = ( _q, τ_ 1 _, p_ 1) and _c_ 2 = ( _q, τ_ 2 _, p_ 2) are _translationally equivalent_, written
_c_ 1 _∼_ _c_ 2, if there exists _k_ _∈_ Z such that _τ_ 1( _i_ ) = _τ_ 2( _i −_ _k_ ) for all _i_ and _p_ 1 = _p_ 2 + _k_ . Intuitively, they differ only by a shift in
absolute tape coordinates. This relation preserves halting status and successor structure.


**Configuration** **embedding.** The embedding Embed : ( _Q ×_ Γ [Z] _×_ Z) _→_ Σ _[∗]_ upd [maps] [a] [configuration] _[c]_ [=] [(] _[q, τ, p]_ [)] [to]
the canonical token sequence that “walks through” the non-blank tape region. Formally, for a tape _τ_, define _ℓ_ ( _τ_ ) :=
min( _{_ 0 _} ∪{i_ : _τ_ ( _i_ ) _̸_ = _b}_ ) and _r_ ( _τ_ ) := max( _{_ 0 _} ∪{i_ : _τ_ ( _i_ ) _̸_ = _b}_ ) as the left and right boundaries of the non-blank region.
Then Embed( _c_ ) is a sequence of tokens ( _q, ai, di_ ) where each _ai_ is the tape symbol at position _ℓ_ ( _τ_ ) + [�] _j<i_ _[d][j]_ [and the]

moves _di_ _∈{−_ 1 _,_ 0 _,_ +1 _}_ are chosen so that the sequence “walks through” the interval [ _ℓ_ ( _τ_ ) _, r_ ( _τ_ )] and ends with the head
aligned to _p_ . By construction, Update( _c_ blank _,_ Embed( _c_ )) _∼_ _c_ . (Note: while many token sequences can produce the same
configuration, Embed is a _deterministic_ function that outputs a canonical representation.)


Since the ATM uses _O_ ( _S_ ( _n_ )) space, _|_ Embed( _c_ ) _|_ = _O_ ( _S_ ( _n_ )) for all reachable configurations. Each transition tuple
_δi_ ( _c_ ) = ( _qi_ _[′][, w][i][, d][i]_ [)] _[∈]_ [Σ][upd] [is] [a] [single] [update] [token.] [Appending] _[δ][i]_ [(] _[c]_ [)] [to] [Embed][(] _[c]_ [)] [yields] [an] [update] [sequence] [that]
represents the successor up to translation: Update( _c_ blank _,_ Embed( _c_ ) _◦_ _δi_ ( _c_ )) _∼_ Succ _i_ ( _c_ ). Define the canonicalization
operator Canon : Σ _[∗]_ upd _[→]_ [Σ] upd _[∗]_ [by][ Canon][(] _[z]_ [) :=][ Embed][(][Update][(] _[c]_ [blank] _[, z]_ [))][.] [Then][ Canon][(][Embed][(] _[c]_ [)) =][ Embed][(] _[c]_ [)][ and]


Embed(Succ _i_ ( _c_ )) = Canon(Embed( _c_ ) _◦_ _δi_ ( _c_ )) _._ (33)


**F.4. Transformer Construction**


We now describe how the Transformer autoregressively generates tokens to implement the recursive evaluation.


**Call/return mechanism.** As in the primary proof, we use control tokens _⟨_ call _⟩, ⟨/_ call _⟩, ⟨_ return _⟩, ⟨/_ return _⟩_ to
implement recursion:


CALL( _c_ ) := _⟨_ call _⟩_ Embed( _c_ ) _⟨/_ call _⟩,_ RET( _b_ ) := _⟨_ return _⟩_ _b ⟨/_ return _⟩._ (34)


Completing CALL( _c_ ) pushes Embed( _c_ ) as a child context and removes the call block from the parent; completing RET( _b_ )
pops and appends _b_ to the parent.


**Evaluation transcript.** For a configuration _c_ = ( _q, τ, p_ ), we describe the step-by-step token generation. Recall that for
non-halting _c_, there are exactly two applicable transitions yielding successors _ci_ := STEP( _c, i_ ) with _bi_ := Win( _ci_ ).


24


**Recursive Models for Long-Horizon Reasoning**


For non-halting _c_, the active context cycles through three phases:


step 1 step 2 step 3
Embed( _c_ ) _−−−→_ Embed( _c_ ) _b_ 0 _−−−→_ Embed( _c_ ) _b_ 0 _b_ 1 _−−−→_ return _._ (35)


In step 1, the generator emits CALL( _c_ 0), where the call payload is the canonical embedding Embed( _c_ 0) =
Canon(Embed( _c_ ) _◦_ _δ_ 0( _c_ )); the child returns _b_ 0. In step 2, similarly for _c_ 1. In step 3, it emits RET(COMB( _c, b_ 0 _, b_ 1)).
We now describe each step in detail.


_Halting case:_ If _c_ is halting, the context is Embed( _c_ ) and the generator emits RET(Win( _c_ )).


_Non-halting case:_ If _c_ is non-halting, let _ci_ := Update( _c, δi_ ( _c_ )) = Succ _i_ ( _c_ ) for _i ∈{_ 0 _,_ 1 _}_ :


1. **Context:** Embed( _c_ ) _→_ **Generate:** CALL( _c_ 0); child recurses and returns _b_ 0.

The generator first computes the update token _δ_ 0( _c_ ) _∈_ Σupd and then emits CALL( _c_ 0) whose payload is the canonical
embedding Embed( _c_ 0) = Canon(Embed( _c_ ) _◦_ _δ_ 0( _c_ )). The child recursively evaluates _c_ 0 and returns _b_ 0 = Win( _c_ 0).
After return, the parent context becomes Embed( _c_ ) _b_ 0.


2. **Context:** Embed( _c_ ) _b_ 0 _→_ **Generate:** CALL( _c_ 1); child recurses and returns _b_ 1.

Similarly, the generator emits CALL( _c_ 1) with payload Embed( _c_ 1) = Canon(Embed( _c_ ) _◦_ _δ_ 1( _c_ )). The child returns
_b_ 1 = Win( _c_ 1). After return, the parent context becomes Embed( _c_ ) _b_ 0 _b_ 1.


3. **Context:** Embed( _c_ ) _b_ 0 _b_ 1 _→_ **Generate:** RET(COMB( _c, b_ 0 _, b_ 1)).

With both results _b_ 0 _, b_ 1 available, the generator computes COMB( _c, b_ 0 _, b_ 1) (AND if _c ∈_ _Q∀_, OR if _c ∈_ _Q∃_ ) and emits
the return block, completing the evaluation of _c_ .


**Transformer construction.** It remains to verify that the next-token policy is implementable by a fixed constant-depth,
constant-size Transformer with _O_ (log _S_ ( _n_ )) precision. The recursive evaluation of EVAL( _c_ ) reduces to the following
primitive operations:


(a) Parsing the configuration embedding prefix Embed( _c_ ) to extract the current state _q_ (reading the state component of any
update token in Embed( _c_ ));


(b) Halting and alternation-type detection: checking _q_ _∈_ _Q_ acc _∪_ _Q_ rej and _q_ _∈_ _Q∃_ vs. _q_ _∈_ _Q∀_ (constant-size set
membership);


(c) Computing the head position _p_ as a prefix sum of moves in Embed( _c_ ) (via seq_sum);


(d) Retrieving the scanned symbol _a_ = _τ_ ( _p_ ) via a “rightmost match” query: find the most recent update token in Embed( _c_ )
that wrote to position _p_ (via rightmost_exact_match);

(e) Computing the successor transition _δi_ ( _c_ ) = ( _qi_ _[′][, w][i][, d][i]_ [)][ via finite lookup on][ (] _[q, a]_ [)][ (hard-coded into parameters);]


(f) Computing COMB( _c, b_ 0 _, b_ 1): AND/OR of returned bits based on alternation type (local gates);


(g) Canonicalization: generating the call payload Embed( _ci_ ) = Canon(Embed( _c_ ) _◦_ _δi_ ( _c_ )) for _i ∈{_ 0 _,_ 1 _}_ . This re-embeds
the successor configuration by walking through the updated tape using (c) and (d) with the new state _qi_ _[′]_ [, new head]
position _p_ + _di_, and tape symbol _wi_ at position _p_ . The output length is _|_ Embed( _ci_ ) _|_ = _O_ ( _S_ ( _n_ )).


All primitive operations (a)–(g) above are already established in Appendix G of Yang et al. (2025b); our construction
differs only in the choice of special tokens and parsing format. We refer readers to that paper for the detailed Transformer
implementation.


**Conclusion.** By FASP-to-Transformer compilation (Yang et al., 2025b), the next-token rule can be implemented by a
fixed constant-depth Transformer _fθ_ with _O_ (log _S_ ( _n_ )) precision. The recursive model with generator _fθ_ decides _L_ with
local space _O_ ( _S_ ( _n_ )) and recursion depth 2 _[O]_ [(] _[S]_ [(] _[n]_ [))] . Therefore _L ∈_ RCM( _O_ ( _S_ ( _n_ )) _,_ 2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ), completing the alternative
proof of Theorem 1.


**G. Proof of Theorem 2**


_Proof._ Both inclusions are a direct corollary of the chain-of-thought characterization in Merrill & Sabharwal (2024).
When _D_ = 1 (no recursive calls), the recursive model reduces to standard autoregressive generation: the sequence grows


25


**Recursive Models for Long-Horizon Reasoning**


monotonically until the model emits a return token, so the local space bound _O_ ( _S_ ( _n_ )) directly limits the total number of
generated tokens to _O_ ( _S_ ( _n_ )). Setting _t_ ( _n_ ) = Θ( _S_ ( _n_ )) in their Eq. (1) and using _S_ ( _n_ ) _≥_ _n_ yields TIME( _O_ ( _S_ ( _n_ ))) _⊆_
RCM( _O_ ( _S_ ( _n_ )) _,_ 1) and RCM( _O_ ( _S_ ( _n_ )) _,_ 1) _⊆_ TIME( _O_ ( _S_ [2] ( _n_ ))), where the _O_ ( _·_ ) absorbs the polylogarithmic overhead

[�] [�]
from simulating _O_ (log _S_ ( _n_ ))-precision arithmetic on a Turing machine.


**H. Proof of Theorem 3**


**Theorem 9** (Constant-Depth Recursive Models, Formal) **.** _For any S_ ( _n_ ) _≥_ _n, recursive models with constant recursion_
_depth D_ = _O_ (1) _and local space O_ ( _S_ ( _n_ )) _can solve any problem in_ SPACE( _S_ ( _n_ )) _:_


SPACE( _S_ ( _n_ )) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _, O_ (1)) _._ (36)


_Moreover, for any T_ : N _→_ N _,_


TM( _S_ ( _n_ ) _, T_ ( _n_ )) _⊆_ RCM( _O_ ( _S_ ( _n_ )) _, O_ (1) _, O_ ( _T_ ( _n_ ))) _._ (37)


_Proof._ Fix any language _L_ _∈_ SPACE( _O_ ( _S_ ( _n_ ))) and let TM = (Γ _, b, Q, q_ 0 _, δ, Q_ acc _, Q_ rej) be a deterministic single-tape
Turing machine deciding _L_ using at most _c · S_ ( _n_ ) tape cells on inputs of length _n_ . We construct a constant-size Transformer
_fθ_ ( _L_ ) such that the recursive model with _fθ_ ( _L_ ) simulates TM with recursion depth _D_ = 2 and local space _O_ ( _S_ ( _n_ )) in a
time- and space-efficient manner.


**Configuration.** A _configuration_ of TM is a triple _c_ = ( _q, τ, p_ ) where:


- _q_ _∈_ _Q_ is the current control state;


- _τ_ : Z _→_ Γ is the _tape contents_, a function mapping each cell index to a symbol, with _τ_ ( _i_ ) = _b_ (the blank symbol) for all
but finitely many _i_ ;


- _p ∈_ Z is the head position.


For a tape _τ_ and position _p_, we write _τ_ [ _p_ _�→_ _w_ ] for the tape that agrees with _τ_ everywhere except at position _p_, where it
holds symbol _w_ .


**Update tokens and the update operator.** Let Σupd := _Q_ _×_ Γ _×{−_ 1 _,_ 0 _,_ +1 _}_ . We interpret a token _x_ = ( _q_ _[′]_ _, w, d_ ) _∈_ Σupd
as an _update_ : “write _w_ at the current head cell, move by _d_, and set the control state to _q_ _[′]_ ”. For a configuration _c_ = ( _q, τ, p_ ),
define
Update( _c,_ ( _q_ _[′]_ _, w, d_ )) := ( _q_ _[′]_ _, τ_ [ _p �→_ _w_ ] _, p_ + _d_ ) _,_ (38)


and extend Update to sequences _x_ 1: _k_ _∈_ Σ _[∗]_ upd [by][ Update][(] _[c, x]_ [1:] _[k]_ [) :=][ Update][(][Update][(] _[c, x]_ [1:] _[k][−]_ [1][)] _[, x][k]_ [)][.] [We also extend] _[ δ]_ [ to]
configurations by _δ_ ( _q, τ, p_ ) := _δ_ ( _q, τ_ ( _p_ )).


**Translational equivalence.** Two configurations _c_ 1 = ( _q, τ_ 1 _, p_ 1) and _c_ 2 = ( _q, τ_ 2 _, p_ 2) are _translationally equivalent_, written
_c_ 1 _∼_ _c_ 2, if there exists _k_ _∈_ Z such that _τ_ 1( _i_ ) = _τ_ 2( _i −_ _k_ ) for all _i ∈_ Z and _p_ 1 = _p_ 2 + _k_ . Intuitively, two configurations are
translationally equivalent if they differ only by a shift in absolute tape coordinates, while their control state, tape contents,
and the head’s relative position within the tape are identical. This relation preserves the next update and halting status:
_c_ 1 _∼_ _c_ 2 _⇒_ _δ_ ( _c_ 1) = _δ_ ( _c_ 2).


**Configuration embedding.** For a tape _τ_, define _ℓ_ ( _τ_ ) := min( _{_ 0 _}∪{i_ : _τ_ ( _i_ ) _̸_ = _b}_ ) and _r_ ( _τ_ ) := max( _{_ 0 _}∪{i_ : _τ_ ( _i_ ) _̸_ = _b}_ ).
The embedding Embed : ( _Q ×_ Γ [Z] _×_ Z) _→_ Σ _[∗]_ upd [maps a configuration] _[ c]_ [=] [(] _[q, τ, p]_ [)][ to a sequence][ (] _[x]_ [1] _[, . . ., x][m]_ [)][ where]
each _xi_ = ( _q, ai, di_ ), with _ai_ being the tape symbol at position _ℓ_ ( _τ_ ) + [�] _j<i_ _[d][j]_ [and] _[ d][i]_ _[∈{−]_ [1] _[,]_ [ 0] _[,]_ [ +1] _[}]_ [ chosen so that the]
sequence “walks through” the non-blank interval [ _ℓ_ ( _τ_ ) _, r_ ( _τ_ )] and ends with the head aligned to _p_ . Let _c_ blank := ( _q_ 0 _, b_ [Z] _,_ 0)
be the blank configuration. Then Update( _c_ blank _,_ Embed( _c_ )) _∼_ _c_ . (Note: while many token sequences can produce the
same configuration, Embed is a _deterministic_ function that outputs a canonical representation; the proof only requires
Update( _c_ blank _,_ Embed( _c_ )) _∼_ _c_ .)


Since TM is space-bounded, _|_ Embed( _c_ ) _|_ = _O_ ( _S_ ( _n_ )) for all reachable configurations. Let _N_ := _C · S_ ( _n_ ) for a sufficiently
large constant _C_ such that _|_ Embed( _c_ ) _| ≤_ _N_ for every reachable configuration.


26


**Recursive Models for Long-Horizon Reasoning**


**Depth-1 frame.** The depth-1 frame is the outermost frame and serves as a “dispatcher”. Its role is simple: whenever its
suffix matches _⟨_ call _⟩_ _w_ for some string _w_, it emits the closing token _⟨/_ call _⟩_, which triggers a push of a new depth-2
frame with content _w_ . This mechanism enables tail-call elimination: when the depth-2 frame returns an open call-prefix, the
depth-1 frame completes the call and activates a fresh depth-2 frame.


**Depth-2 frame.** The depth-2 frame is the active simulation frame. It stores


Frame( _z, u_ ) := _z ◦⟨_ sep _⟩◦_ _u,_ (39)


where _z_ _∈_ Σ _[∗]_ upd [is the] _[ summarized history]_ [ (the embedding of all past computation) and] _[ u][ ∈]_ [Σ] upd _[∗]_ [is the] _[ new trace]_ [ (updates]
generated since the last summarization). The current simulated configuration is recovered by


_c_ _[∗]_ := Conf( _z, u_ ) := Update( _c_ blank _, z ◦_ _u_ ) _,_ (40)


where the delimiter _⟨_ sep _⟩_ is ignored by Update.


**Next-token** **policy** **(simulation** **vs.** **summarization).** Given Frame( _z, u_ ), let _c_ _[∗]_ = ( _q_ _[∗]_ _, τ_ _[∗]_ _, p_ _[∗]_ ) = Conf( _z, u_ ). The
next-token policy operates as follows:


(i) **Halting:** If _q_ _[∗]_ _∈_ _Q_ acc (resp. _Q_ rej), emit _⟨_ return _⟩_ 1 _⟨/_ return _⟩_ (resp. _⟨_ return _⟩_ 0 _⟨/_ return _⟩_ ) and halt.

(ii) **Simulation mode:** If _q_ _[∗]_ _∈/_ _Q_ acc _∪_ _Q_ rej and _|u|_ _<_ 2 _N_, emit the single update token _δ_ ( _c_ _[∗]_ ) _∈_ Σupd. This appends
exactly one TM step to the new trace _u_ .


(iii) **Summarization** **mode:** If _|u|_ = 2 _N_, compute the summarized state _z_ _[′]_ := Embed( _c_ _[∗]_ ) and emit
_⟨_ return _⟩⟨_ call _⟩_ Frame( _z_ _[′]_ _, ϵ_ ) _⟨/_ return _⟩_ . Under the recursive-model stack semantics, this returns an open callprefix to the depth-1 frame, which then emits _⟨/_ call _⟩_ and activates a new depth-2 frame Frame( _z_ _[′]_ _, ϵ_ ).


**Correctness and resource analysis.** We now verify that the construction is correct and analyze its resource consumption:
local space _O_ ( _S_ ( _n_ )), recursion depth 2, and token efficiency _O_ ( _T_ ) where _T_ is the number of TM steps.


**Correctness.** We maintain the invariant that at all times the depth-2 frame represents the current TM configuration (up to
translation): after _t_ simulated steps since the last summarization, Conf( _z, u_ ) _∼_ _ct_, where _ct_ is the true TM configuration after
_t_ steps. The base case follows from Update( _c_ blank _,_ Embed( _c_ 0)) _∼_ _c_ 0. In simulation mode, emitting _δ_ (Conf( _z, u_ )) advances
the configuration by one Update, matching one TM transition since _δ_ is invariant under _∼_ . In summarization mode, replacing
( _z, u_ ) by (Embed(Conf( _z, u_ )) _, ϵ_ ) preserves the represented configuration since Update( _c_ blank _,_ Embed(Conf( _z, u_ ))) _∼_
Conf( _z, u_ ). Thus the model returns the correct accept/reject decision.


**Local space.** During simulation, the depth-2 frame has length _|z|_ + 1 + _|u|_ _≤_ _N_ + 1 + 2 _N_ = 3 _N_ + 1 = _O_ ( _S_ ( _n_ )).
During summarization, the return payload contributes at most _|z_ _[′]_ _|_ + _O_ (1) = _O_ ( _S_ ( _n_ )) additional tokens, so local space
remains _O_ ( _S_ ( _n_ )). The stack height is always at most 2.



**Token efficiency.** Each TM step produces exactly one emitted update token in simulation mode. A summarization happens
once every 2 _N_ simulated steps and emits at most _|z_ _[′]_ _|_ + _O_ (1) _≤_ _N_ + _O_ (1) tokens. If TM halts after _T_ steps, the total
number of emitted tokens is




  - _T_
_T_ + _O_
2 _N_





_·_ ( _N_ + _O_ (1)) = _O_ ( _T_ ) _,_ (41)



which is linear in _T_ .


**Transformer construction.** It remains to verify that the next-token policy is implementable by a fixed constant-depth,
constant-size Transformer with _O_ (log _n_ ) precision. Both _δ_ ( _·_ ) and Embed( _·_ ) reduce to the following primitive operations:


(a) Parsing the summarized history _z_ and new trace _u_ (fixed-format tokenized strings);


(b) Computing the head position as a prefix sum of moves in _z ◦_ _u_ (arithmetic on _O_ (log _S_ ( _n_ ))-bit integers);


(c) Retrieving the current tape symbol via a “rightmost match” query: for a given head position, find the most recent update
token in _z ◦_ _u_ that wrote to that cell;


27


**Recursive Models for Long-Horizon Reasoning**


(d) A finite lookup of _δ_ (hard-coded into parameters).


All primitive operations (a)–(d) above are already established in Appendix G of Yang et al. (2025b); our construction
differs only in the choice of special tokens and parsing format. We refer readers to that paper for the detailed Transformer
implementation.


Hence, for arbitrary _L ∈_ SPACE( _O_ ( _S_ ( _n_ ))), we have _L ∈_ RCM( _O_ ( _S_ ( _n_ )) _,_ 2).


**I. Preliminaries for Section 4**


**I.1. Strings**


Fix a finite token alphabet Σ. We write Σ _[∗]_ for the set of all finite token strings and _|x|_ for the length of _x ∈_ Σ _[∗]_ . For a length
bound _L_, define Σ _≤L_ := _{z_ _∈_ Σ _[∗]_ : _|z| ≤_ _L}_ . Note that _|_ Σ _≤L| ≤_ [�] _[L]_ _i_ =0 _[|]_ [Σ] _[|][i]_ [= 2] _[O]_ [(] _[L]_ [)][.]


**I.2. Polynomial-Time Generators**


A generator _f_ is _polynomial-time_ if there exists a deterministic Turing machine that computes _f_ ( _x_ ) from _x_ in time
poly( _|x|_ + _|f_ ( _x_ ) _|_ ). A generator family _F_ = ( _f_ 1 _, . . ., fk_ ) is polynomial-time if each _fℓ_ is polynomial-time.


**I.3. Oracle Turing Machine**


A _deterministic oracle Turing machine_ (OTM) is a deterministic multi-tape Turing machine equipped with, for each oracle
name _o_ in a finite index set _N_, an _oracle query tape_ and an _oracle answer tape_ . Each oracle is a total function _Oo_ : Σ _[∗]_ _→_ Σ _[∗]_ .


**Query/Answer Mechanism.** When the machine enters a distinguished _query state q_ ask _,o_, the string currently written on
the oracle- _o_ query tape (from cell 0 to the first blank) is taken as the query _u_ . In one transition, the oracle answer tape is
overwritten with _Oo_ ( _u_ ) (starting at cell 0), and the machine enters a distinguished _return state q_ ret _,o_ .


**Resource** **Measures.** Time counts ordinary TM transitions (including transitions into and out of query/return states).
Space counts the number of distinct tape cells visited on _work tapes_ (excluding the read-only input tape and oracle tapes).


**Relativized Complexity Classes.** For a fixed oracle family Ω= ( _O_ 1 _, . . ., Ok_ ):


TIME [Ω] ( _f_ ( _n_ )) = _{L_ : _∃_ OTM with access to Ω deciding _L_ in _O_ ( _f_ ( _n_ )) time _},_ (42)

SPACE [Ω] ( _f_ ( _n_ )) = _{L_ : _∃_ OTM with access to Ω deciding _L_ in _O_ ( _f_ ( _n_ )) work space _}._ (43)


**Alternating Turing Machines.** An _alternating Turing machine_ (ATM) extends a nondeterministic TM by labeling each
state as either _existential_ ( _∃_ ) or _universal_ ( _∀_ ). At an _∃_ -state, the machine accepts if _some_ successor configuration accepts; at
a _∀_ -state, it accepts if _all_ successor configurations accept. We write ASPACE( _S_ ( _n_ )) for the class of languages decidable by
an ATM using space _O_ ( _S_ ( _n_ )).


**Space-Constructibility.** A function _S_ : N _→_ N is _space-constructible_ if there exists a TM that, on input 1 _[n]_, computes
_S_ ( _n_ ) in binary using _O_ ( _S_ ( _n_ )) space. Common functions like _n_, _n_ [2], 2 _[n]_ are space-constructible.


**I.4. Least-Fixpoint Semantics for Recursive Agentic Systems**


We now give the formal construction of the semantics for a recursive agentic system ( _S, F_ ) where _S_ = ( _S_ 1 _, . . ., Sm_ ) are
scaffolds and _F_ = ( _f_ 1 _, . . ., fk_ ) are generators. Recall from the main text that each scaffold _Si_ may query two types of
oracles: _fℓ_ for _ℓ_ _∈{_ 1 _, . . ., k}_ (generator oracles), and SELF _j_ for _j_ _∈{_ 1 _, . . ., m}_ (recursion oracles).


**Partial Functions and Order.** Let Σ _[∗]_ _⊥_ [=] [Σ] _[∗]_ _[∪{⊥}]_ [, where] _[ ⊥]_ [denotes “undefined.”] [Let] _[ P]_ [=] _[{][F]_ [:] [Σ] _[∗]_ _[→]_ [Σ] _[∗]_ _⊥_ _[}]_ [ be the]
set of partial functions. We order _P_ by _extension_ : _F_ _⊑_ _G_ iff for all _x_ _∈_ Σ _[∗]_, either _F_ ( _x_ ) = _⊥_ or _F_ ( _x_ ) = _G_ ( _x_ ). The
pair ( _P, ⊑_ ) forms a complete partial order with least element _⊥P_ (the everywhere-undefined function). For tuples, define
_P_ [(] _[m]_ [)] = ( _P_ ) _[m]_ with componentwise order; the least element is _⊥_ [(] _[m]_ [)] = ( _⊥P_ _, . . ., ⊥P_ ).


28


**Recursive Models for Long-Horizon Reasoning**


**One-Step Operator.** Define **Φ** _S,F_ : _P_ [(] _[m]_ [)] _→P_ [(] _[m]_ [)] as follows. Given **F** = ( _F_ 1 _, . . ., Fm_ ) _∈P_ [(] _[m]_ [)], the _i_ -th component
**Φ** _S,F_ ( **F** ) _i_ is defined by: on input _x_ _∈_ Σ _[∗]_, simulate _Si_ on _x_ with generator queries _fℓ_ answered by _F_ and each SELF _j_
answered by _Fj_ . If any queried _Fj_ ( _u_ ) = _⊥_, the simulation halts and returns _⊥_ ; otherwise, **Φ** _S,F_ ( **F** ) _i_ ( _x_ ) is the output of the
simulation.


_ω_ **-Continuity and Existence.** The operator **Φ** _S,F_ is _ω_ -continuous (Scott-continuous) on the pointed CPO ( _P_ [(] _[m]_ [)] _, ⊑_ ):
each scaffold execution, if it terminates, makes only finitely many recursion queries, hence depends only on a finite
stage of any increasing chain of approximants. By Kleene’s fixed-point theorem, the least fixpoint **F** _[∗]_ = lfp( **Φ** _S,F_ ) =

- _n<ω_ **[Φ]** _S_ _[n]_ _,F_ [(] _[⊥]_ [(] _[m]_ [)][)] _[ ∈P]_ [(] _[m]_ [)] [exists.]


**Semantics.** The semantics of the system ( _S, F_ ) is defined as **F** _[∗]_ = ( _F_ 1 _[∗][, . . ., F]_ _m_ _[ ∗]_ [)][.] [Intuitively,] _[ F][ ∗]_ _i_ [(] _[x]_ [)][ is the output of]
running scaffold _Si_ on input _x_, where all recursive calls are resolved according to the least fixpoint.


**I.5. Chandra–Kozen–Stockmeyer Characterization**


**Lemma** **10** (Alternating-space characterization of exponential time) **.** _For_ _any_ _space-constructible_ _S_ ( _n_ ) _≥_ _n,_
ASPACE( _O_ ( _S_ ( _n_ ))) = TIME(2 _[O]_ [(] _[S]_ [(] _[n]_ [))] ) _._


_Proof._ This is a classical result. The key insight is that an alternating TM using space _S_ has at most 2 _[O]_ [(] _[S]_ [)] configurations,
and a deterministic simulation can explore the entire game tree in time 2 _[O]_ [(] _[S]_ [)] via dynamic programming.


**J. Proof of Theorem 4**


_Proof of Theorem 4._ Fix _n_, an index _r_ _∈{_ 1 _, . . ., m}_, and input _x ∈_ Σ _[n]_, and write _L_ := _L_ ( _n_ ) and _D_ := Σ _≤L_ . Let **Φ** _S,F_
be the one-step operator from Appendix I.4. Under _L_ -boundedness (Definition 4) of the evaluation of _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ), every
generator argument/return and every recursion argument/return that appears during evaluation lies in _D_ .


**Time upper bound (oracle form).** Let **Φ** [(] _S_ _[≤]_ _,F_ _[L]_ [)] [be the same one-step operator as] **[ Φ]** _[S][,][F]_ [, except that each scaffold simulation]
is run with an explicit _L_ -space cutoff (counting work plus oracle tapes): if the simulation exceeds _L_ total tape cells, it aborts
and returns _⊥_ . Since the call graph of the evaluation of _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ) is _L_ -bounded, this cutoff never triggers on any scaffold
invocation that influences _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ), so _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ) equals the stabilized ( _r, x_ ) entry of the least fixpoint of **Φ** [(] _S_ _[≤]_ _,F_ _[L]_ [)][.]


We compute this least fixpoint by performing Kleene iteration on the finite restriction to _D_ . Define a table-valued sequence
( _**ϕ**_ _t_ ) _t≥_ 0 where each _**ϕ**_ _t_ is a tuple of partial maps _D_ _→_ _D ∪{⊥}_ (one component per scaffold), with _**ϕ**_ 0 = _⊥_ [(] _[m]_ [)] and
_**ϕ**_ _t_ +1 = **Φ** [(] _S_ _[≤]_ _,F_ _[L]_ [)][(] _**[ϕ]**_ _[t]_ [)][ restricted to inputs in] _[ D]_ [.] [Because the restriction domain is finite and the order is by extension, each]
table entry can change at most once (from _⊥_ to a defined value), so the sequence stabilizes after at most _m · |D|_ iterations.


To update one table entry, we simulate one one-step scaffold run on an input _q_ _∈_ _D_, answering generator/tool queries
by oracle access to _F_ and answering recursion queries SELF _j_ ( _u_ ) by table lookup of _**ϕ**_ _t_ . By construction of **Φ** [(] _S_ _[≤]_ _,F_ _[L]_ [)][, each]
such update halts within exp( _O_ ( _L_ )) transitions and costs exp( _O_ ( _L_ )) time. There are _m · |D|_ = 2 _[O]_ [(] _[L]_ [)] entries and at most
_m · |D|_ = 2 _[O]_ [(] _[L]_ [)] iterations, so the total oracle-machine running time is 2 _[O]_ [(] _[L]_ [)] . The stabilized table entry corresponding to
( _r, x_ ) equals _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ), proving TIME _[F]_ (2 _[O]_ [(] _[L]_ [(] _[n]_ [))] ).


**Eliminating the oracle.** Now assume additionally that each oracle in _F_ is computable by a deterministic (non-oracle)
TM in time 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] and work space _O_ ( _L_ ( _n_ )) on all queries of length at most _L_ ( _n_ ). We simulate the above oracle TM
by a plain TM, replacing each oracle query by running the corresponding oracle-computing TM on the query string and
writing its output back before resuming the simulation. Since the oracle TM runs for at most 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] steps, it makes at
most 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] oracle queries. Thus the total time is 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] _·_ 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] = 2 _[O]_ [(] _[L]_ [(] _[n]_ [))], proving TIME(2 _[O]_ [(] _[L]_ [(] _[n]_ [))] ).


**K. Proof of Theorem 5**


_Proof of Theorem 5._ Fix an index _r_ _∈{_ 1 _, . . ., m}_ . Assume the recursion stack depth is _D_ ( _n_ ) = _O_ (1) throughout evaluation
of _ϕ_ _[S]_ _r_ _[,][F]_ ( _x_ ) on every length- _n_ input _x_ . We decide the language by directly simulating the recursive evaluation in a depth-first
manner on an oracle TM with access to _F_ . The simulator maintains the full local configuration of the currently active scaffold


29


**Recursive Models for Long-Horizon Reasoning**


simulation (including its work tapes and the bounded oracle query/answer content), and pushes/pops such configurations on
a stack when encountering recursion-oracle calls/returns. By _L_ ( _n_ )-boundedness, each call frame requires _O_ ( _L_ ( _n_ )) space to
store, and by assumption there are _O_ (1) frames simultaneously. Thus the simulation uses _O_ ( _L_ ( _n_ )) work space, proving
membership in SPACE _[F]_ ( _O_ ( _L_ ( _n_ ))).


**Eliminating the oracle.** Now assume additionally that each oracle in _F_ is computable by a deterministic (non-oracle)
TM in time 2 _[O]_ [(] _[L]_ [(] _[n]_ [))] and work space _O_ ( _L_ ( _n_ )) on all queries of length at most _L_ ( _n_ ). We simulate the above oracle TM
by a plain TM, replacing each oracle query by running the corresponding oracle-computing TM on the query string and
then resuming the simulation. Reusing _O_ ( _L_ ( _n_ )) work space for each oracle computation, the overall work space remains
_O_ ( _L_ ( _n_ )), proving SPACE( _O_ ( _L_ ( _n_ ))).


30


