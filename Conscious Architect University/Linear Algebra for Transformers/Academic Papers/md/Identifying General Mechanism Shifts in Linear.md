## **Identifying General Mechanism Shifts in Linear** **Causal Representations**

**Tianyu Chen** _[∗]_ **Kevin Bello** _[†‡]_ **Francesco Locatello** _[⋄]_ **Bryon Aragam** _[†]_ **Pradeep Ravikumar** _[‡]_

_∗_ Department of Statistics and Data Sciences, University of Texas at Austin

_†_ Booth School of Business, University of Chicago

_‡_ Machine Learning Department, Carnegie Mellon University
_⋄_ Institute of Science and Technology Austria


**Abstract**


We consider the linear causal representation learning setting where we observe a
linear mixing of _d_ unknown latent factors, which follow a linear structural causal
model. Recent work has shown that it is possible to recover the latent factors as well
as the underlying structural causal model over them, up to permutation and scaling,
provided that we have at least _d_ environments, each of which corresponds to perfect
interventions on a single latent node (factor). After this powerful result, a key open
problem faced by the community has been to relax these conditions: allow for
coarser than perfect single-node interventions, and allow for fewer than _d_ of them,
since the number of latent factors _d_ could be very large. In this work, we consider
precisely such a setting, where we allow a smaller than _d_ number of environments,
and also allow for very coarse interventions that can very coarsely _change_ _the_
_entire_ _causal_ _graph_ _over_ _the_ _latent_ _factors_ . On the flip side, we relax what we
wish to extract to simply the _list of nodes that have shifted between one or more_
_environments_ . We provide a surprising identifiability result that it is indeed possible,
under some very mild standard assumptions, to identify the set of shifted nodes. Our
identifiability proof moreover is a constructive one: we explicitly provide necessary
and sufficient conditions for a node to be a shifted node, and show that we can check
these conditions given observed data. Our algorithm lends itself very naturally to
the sample setting where instead of just interventional distributions, we are provided
datasets of samples from each of these distributions. We corroborate our results
on both synthetic experiments as well as an interesting psychometric dataset. The
[code can be found at https://github.com/TianyuCodings/iLCS.](https://github.com/TianyuCodings/iLCS)


**1** **Introduction**


The objective of learning disentangled representations is to separate the different factors that contribute
to the variation in the observed data, resulting in a representation that is easier to understand and
manipulate [3]. Traditional methods for disentanglement [e.g., 19, 20, 7, 9, 26] aim to make the
latent variables independent of each other.


Consider the setting of linear independent component analysis (ICA) [19], that is, the observed
variables _X_ _∈_ R _[p]_ are generated through the process _X_ = _GZ_, where _Z_ _∈_ R _[d]_ are _latent_ factors,
and _G_ _∈_ R _[p][×][d]_ is an _unknown_ “mixing” matrix. Under the key assumption that _Z_ has statistically
independent components, and under some additional mild assumptions, landmark results in linear
ICA show that it is possible to recover the latent variables _Z_ up to permutation and scaling [13, 19].


1Emails: tianyuchen@utexas.edu, kbello@cs.cmu.edu


38th Conference on Neural Information Processing Systems (NeurIPS 2024).


However, what if instead of independent sources _Z_ we have a _structural causal model_ (SCM, [37, 38])
over them? For instance, if the latent factors correspond to biomarkers in a biology context, or root
causes in a root cause analysis context, then we expect there to be rich associations between them.
Indeed, this question is central in the burgeoning field of causal representation learning (CRL)

[39, 51], where we are interested in extracting the latent factors and causal associations between them
given raw data.


Let us look at the simplest CRL setting where the latent variables _Z_ follow a _linear_ SCM, that is,
_Z_ = _AZ_ + Ω1 _/_ 2 _ϵ_, where _A ∈_ R _d×d_ encodes a directed acyclic graph (DAG), Ω is a diagonal matrix
that controls the scale of noise variances, and _ϵ_ is some noise vector with zero-mean and unit-variance
independent components. In such a case, _Z_ is a linear mixing of independent components _ϵ_, that is,
_Z_ = _B_ _[−]_ [1] _ϵ_, where _B_ = Ω _−_ 1 _/_ 2( _Id −_ _A_ ) succinctly encodes the SCM and _Id_ is the identity matrix of
dimension R _[d][×][d]_ . We then have _X_ = _GB_ _[−]_ [1] _ϵ_ so that ICA can only recover _BG_ _[†]_ up to permutation
and scaling, which does not suffice to recover the SCM _B_ since the mixing function _G_ is unknown.


Recently, Seigal et al. [40] showed that given the interventional distributions arising from _perfect_
_interventions_ on _each_ latent variable in _Z_, we can recover the SCM over _Z_ up to permutation. But
there are two caveats to this: (a) it is difficult to obtain perfect single-node interventions that only
intervene on a single factor in _Z_ ; and (b) it is difficult to obtain _d_ number of such perfect interventional
distributions or environments.


We are interested in the setting where we do not have perfect interventions: we allow for far more
general interventions that can quite coarsely change the SCM, namely, _soft_ and _hard_ interventions,
interventions targeting _single_ or _multiple_ nodes, as well as interventions capable of _adding_ or _removing_
parent nodes and _reversing_ edges. Moreover, we do not need as many as _d_ of these.


Our goal, however, is not to recover the entire SCM over _Z_ but simply to recover those nodes _Z_ that
have incurred shifts or changes between the different interventional distributions. This is closely
related to root cause analysis [5, 6, 21, 33], which aims to identify the origins of the observed changes
in a joint distribution. In addition, understanding the sources of distribution shifts—that is, localizing
invariant/shifted conditional distributions—can benefit downstream tasks such as domain adaptation

[30], and domain generalization [36, 55].


**Contributions.** Our work sits at the intersection of linear CRL [40, 23] and _direct estimation_ of
causal mechanism shifts [52, 14]. The key contribution of this work is to show that it is possible to
identify the _latent_ sources of distribution shifts in multiple datasets while _bypassing_ the estimation
of the mixing function _G_ and the SCM _B_ over the latent variables, under very general types of
interventions. More concretely, we make the following set of contributions:


1. **Identifiability:** We show that we can identify the shifted latent factors even under more
general types of interventions. (Section 4.1).

2. **Algorithm:** We also provide an scalable algorithm that implements our identifiability result
to infer such shifted latent factors even in the practical scenarios where we are not given the
entire coarse interventional distributions but merely finite samples from each (Section 4.2).

3. **Experiments:** We corroborate our results on both synthetic experiments (Section 5.1) as
well as an interesting psychometric dataset (Section 5.2).


**2** **Related Work**


**Causal representation learning.** In contrast to our setting, which focuses on identifying shifted
nodes in the latent representation, existing methods in CRL aim to recover _both_ the latent causal
graph and the mixing function. Previous works have studied identifiability in various settings, such
as latent linear SEMs with linear mixing [40], and with nonlinear mixing [4]; latent nonlinear
SEMs with finite degree polynomial mixing [1], and with linear mixing [48]; and nonlinear SEMs
with nonlinear mixing [50, 49, 23, 22]. Although these studies ensure the identifiability of causal
graphs (up to permutation and scaling ambiguities), they generally rely on the assumption that
_each_ _latent_ _variable_ is intervened upon in at least one environment, necessitating access to at
least _d_ interventional distributions. Moreover, the aforementioned works assume specific types of
interventions, such as hard/soft interventions and single-node interventions, and restrict changes
in interventional distributions, disallowing edge reversals or the addition of new edges. The most


2


recent work [23] enables causal representation learning under general interventions in latent linear
SEMs with linear mixing. However, this approach still requires the assumption that the number
of environments _K_ is at least equal to the number of latent nodes _d_ and that there are at least
Θ( _d_ [2] ) interventions. If the objective is to detect variables with general mechanism changes across
multiple environments—environments that may lack a consistent topological order and sufficient
interventions or environments—using existing CRL methods to recover each latent graph becomes
overly restrictive or even infeasible. In contrast, we present a more flexible approach, enabling the
identification of shifted variables without assuming restrictive interventions per environment or a
consistent topological order of the latent graphs.


**Direct estimation of mechanism shifts.** The problem of directly estimating causal mechanism
changes _without_ estimating the causal graphs has also been explored in various settings in the regime
in which the causal variables are observable. Wang et al. [52] and Ghoshal et al. [14] have focused
on identifying structural differences, assuming linear SEMs as environments, and proposing methods
that take advantage of variations in the precision matrices. More recently, Chen et al. [10] studied
this problem for nonlinear additive noise models, assuming that the environments originate from
soft/hard interventions and leverage recent work in causal discovery via score matching. Finally,
the concept of detecting/localizing feature shifts between two distributions has also been discussed
in [27], although from a non-causal perspective. To our knowledge, there is a gap in the literature
regarding the study of these objectives when considering latent causal variables. We address this gap
by proposing a novel approach for directly detecting mechanism shifts within the latent SCMs.


**Independent component analysis.** The application of independent component analysis (ICA) [12]
in the realm of causal discovery has seen significant developments. Linear ICA [19] and its nonlinear
counterpart [20] have been instrumental in causal discovery [35, 44, 53] and more recently in causal
latent discovery [23]. Beyond these established applications, our work uncovers a novel use of ICA,
namely, identifying shifted nodes within the latent linear SCMs.


Given the relevance of ICA for our approach, we briefly recap it next. ICA considers the following
setting: _X_ = _Wϵ_ where _X_ _∈_ R _[p]_, _ϵ ∈_ R _[d]_, _p ≥_ _d_ . A key assumption in ICA is that each component
of _ϵ_ is independent. Given only observations of _X_, the goal of ICA is to estimate both _W_ and _ϵ_ . The
objective function typically aims to maximize negentropy or non-Gaussianity, with further details
given in [19]. The identifiability results of ICA can be summarized as follows.


**Theorem 1** (Theorems 3,4 in [13]) **.** _If every component of ϵ is independent and at most one component_
_is Gaussian distributed, with W_ _being full column rank, then ICA can estimate W_ _up to a permutation_
_and scaling of each column, and ϵ can be recovered for some permutation up to scaling for each_
_component._ _Furthermore, as noted in [19], if_ E[ _ϵ_ [2] _i_ [] = 1] _[,][ ∀][i][ ∈]_ [[] _[d]_ []] _[, the estimated][ W]_ _[and][ ϵ][ will have]_
_ambiguities only in permutation and sign._ _Formally, this means_


_X_ = _Wϵ_ = ( _WP_ _[T]_ _D_ )( _DPϵ_ ) _,_


_where P_ _is a permutation matrix and D is a diagonal matrix with diagonal entries ±_ 1 _._ _Then, the_
_best estimate given by ICA is WP_ _[T]_ _D and DPϵ._


**3** **Problem Setting**


Consider a random vector _X_ in R _[p]_ that is a linear mixing of _d_ latent variables _Z_ = ( _Z_ 1 _, . . ., Zd_ ):


_X_ = _GZ._


Here the latent variables in _Z_ follows a linear SCM [37, 38], that is,


_Z_ = _AZ_ + Ω1 _/_ 2 _ϵ_


where _A_ _∈_ R _[d][×][d]_ corresponds to a DAG _G_ such that _Ajk_ = 0 iff there exists an edge _j_ _→_ _k_ in
the DAG _G_ ; Ω _∈_ R _[d][×][d]_ is a diagonal matrix with positive entries, and _ϵ_ _∈_ R _[d]_ is a random vector
with independent components with mean zero and variance one, i.e., that Cov( _ϵ_ ) = _Id_ . Denoting
_B_ = Ω _[−]_ [1] _[/]_ [2] ( _Id −_ _A_ ), we have that:
_Z_ = _B_ _[−]_ [1] _ϵ._


3


_G_ fixed but allow for generalized interventions to _Z_ . That is, for environment _k_ _∈_ [ _K_ ] we have,


_X_ [(] _[k]_ [)] = _GZ_ [(] _[k]_ [)] _,_


where _Z_ [(] _[k]_ [)] = _A_ [(] _[k]_ [)] _Z_ [(] _[k]_ [)] + (Ω [(] _[k]_ [)] )1 _/_ 2 _ϵ_ ( _k_ ). Similarly, we have _Z_ ( _k_ ) = ( _B_ ( _k_ )) _−_ 1 _ϵ_ ( _k_ ), where _B_ ( _k_ ) =
(Ω [(] _[k]_ [)] ) _[−]_ [1] _[/]_ [2] ( _Id −_ _A_ [(] _[k]_ [)] ).


Notably, we allow generalized interventions that allow for _A_ [(] _[k]_ [)] to be arbitrary, which includes _soft_ and
_hard_ interventions, interventions targeting _single_ or _multiple_ nodes, as well as interventions capable
of _adding_ or _removing_ parent nodes and _reversing_ edges. This contrasts with the existing literature
on CRL, where single-node soft/hard interventions are the standard assumption [50, 40, 4, 1]. See
Figure 1, for a toy example of what we aim to estimate.

**Remark 1.** _Since we allow for general types of interventions, we can take any of the given environ-_
_ments as the canonical “observational” distribution with respect to which we observe interventions,_
_or simply that we observe k interventions of an unknown observational distribution._ _This is a clear_
_distinction from the standard setting in CRL [1, 50, 48, 23] which requires to know which environment_
_is a suitable observational distribution._


To develop our identifiability result and algorithm, we will make additional assumptions on the noise
distributions of the linear SEMs.
**Assumption A** (Noise Assumptions) **.** _For any environment k_ _∈_ [ _K_ ] _, let ϵ_ [(] _[k]_ [)] = ( _ϵ_ [(] 1 _[k]_ [)] _[, . . ., ϵ]_ _d_ [(] _[k]_ [)][)] _[ be]_
_the vector of d independent noises with_ Cov( _ϵ_ [(] _[k]_ [)] ) = _Id._ _We have:_


_1._ _Identically distributed across environments:_ P( _ϵ_ [(] _[k]_ [)] ) = P( _ϵ_ [(] _[k][′]_ [)] ) _, for all k_ _[′]_ = _k._


_2._ _Non-Gaussianity:_ _At most one noise component ϵ_ [(] _i_ _[k]_ [)] _is Gaussian distributed._


_3._ _Pairwise differences:_ _For any i ̸_ = _j, we have_ P( _ϵ_ [(] _i_ _[k]_ [)] ) _̸_ = P( _ϵ_ [(] _j_ _[k]_ [)][)] _[ and]_ [ P][(] _[ϵ]_ _i_ [(] _[k]_ [)] ) _̸_ = P( _−ϵ_ [(] _j_ _[k]_ [)][)] _[.]_


Assumption A.1 is usually assumed for learning causal models from multiple environments [31, 4].
Assumption A.2 is typically made in causal discovery methods, as detailed in seminal works such
as [43, 42, 19, 45] and is considered a more realistic assumption [34]. Assumption A.3 is generally
satisfied in a generic sense; that is, when probability distributions on the real line are randomly
selected, they are pairwise different with probability one. This assumption is also adopted in [47, 23].


**Assumption B** (Test Function) **.** _We assume access to a test function ψ that maps each noise r.v._ _to_ R
_s.t._ _ψ_ ( _ϵ_ [(] _i_ _[k]_ [)] ) = _ψ_ ( _−ϵ_ [(] _i_ _[k]_ [)] ) _, and ψ_ ( _ϵ_ [(] _i_ _[k]_ [)] ) _̸_ = _ψ_ ( _ϵ_ [(] _j_ _[k]_ [)][)] _[ if][ ϵ]_ _i_ [(] _[k]_ [)] _and ϵ_ [(] _j_ _[k]_ [)] _are not identically distributed._


4


This assumption states that we can access a test function that can help differentiate the noise
components. One coarse example is _ψ_ ( _y_ ) = P( _|y|_ _≤_ 1). This assumption is introduced to better
understand our method workflow in Section 4, but it is not completely necessary. We discuss how to
relax this assumption in Appendix C. Next, we formally define a mechanism shift.

**Definition 1** (Latent Mechanism Shifts) **.** _Let_ PA( _Zi_ [(] _[k]_ [)] ) _denote the set of parents of Zi_ [(] _[k]_ [)] _._ _A latent_
_variable Zi_ _is called a latent shifted node within environments k and k_ _[′]_ _, if and only if:_

P( _Zi_ [(] _[k]_ [)] _|_ PA( _Zi_ [(] _[k]_ [)] )) _̸_ = P( _Zi_ [(] _[k][′]_ [)] _|_ PA( _Zi_ [(] _[k][′]_ [)] )) _._
**Remark 2.** _Following Definition 1, Zi_ _is a latent shifted node between environments k and k_ _[′]_ _if:_ _(1)_
_The i-th rows of A_ [(] _[k]_ [)] _and A_ [(] _[k][′]_ [)] _are different; (2)_ Ω [(] _ii_ _[k]_ [)] = Ω [(] _ii_ _[k][′]_ [)] _; or (3) both._


Definition 1 aligns with those previously discussed in [52, 14, 10], with the key difference that we
consider changes in the causal mechanisms of the latent causal variables. However, note that our
results also contribute to the setting in which causal variables are observable considering that the
mixing function is the identity matrix, that is, _G_ = _Id_ .


**4** **Identifying Shifts in Latent Causal Mechanisms**


Following the setup outlined in the previous section, our focus now turns to developing an algorithm
to identify latent shifted nodes, given data from multiple environments. First, note that we can write
the overall model as a linear ICA problem, where, for any environment _k_, the observation _X_ [(] _[k]_ [)] is a
linear combination of independent components _ϵ_ [(] _[k]_ [)] . Specifically, we have

_X_ [(] _[k]_ [)] = _GZ_ [(] _[k]_ [)] = _G_ ( _B_ [(] _[k]_ [)] ) _[−]_ [1] _ϵ_ [(] _[k]_ [)]


Under the mild conditions given in Assumption A, from classical ICA identifiability results stated in
Theorem 1, we can identify _G_ ( _B_ [(] _[k]_ [)] ) _[−]_ [1] up to permutation and sign flip. Let _M_ [(] _[k]_ [)] = _B_ [(] _[k]_ [)] _H_ where
_H_ = _G_ _[†]_ . Then, we can only identify _M_ [(] _[k]_ [)] up to permutation and sign flip, which does not suffice to
identify the latent SCM encoded in _B_ [(] _[k]_ [)] . In sum, what we can only obtain from ICA is

_M_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] _B_ [(] _[k]_ [)] _H_


where _P_ [(] _[k]_ [)] is a permutation matrix, and _D_ [(] _[k]_ [)] is a diagonal matrix with _−_ 1 or +1 on its diagonal. As
Seigal et al. [40] points out, it is not possible to identify _B_ [(] _[k]_ [)] further given _generalized interventions_ .
Our first result is that our present mild assumptions suffice to infer shifted nodes.
**Theorem 2** (Identifiability) **.** _Given access to K_ _≥_ 2 _environments, assume that A and B hold for all_
_environments._ _Then, all latent shifted nodes are identifiable._


An interesting facet of our identifiability result is that it is _constructive_ . In the next subsection we
will provide an explicit algorithm to infer the shifted nodes and prove the main theorem above.


**4.1** **Constructive identifiability**


Consider _ϵ_ [(] _[k]_ [)] = _B_ [(] _[k]_ [)] _HX_ [(] _[k]_ [)] and _ϵ_ ~~[(]~~ _[k]_ [)] = _M_ [(] _[k]_ [)] _X_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] _B_ [(] _[k]_ [)] _HX_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] _ϵ_ [(] _[k]_ [)],
where _ϵ_ ~~[(]~~ _[k]_ [)] and _M_ [(] _[k]_ [)] are the output of ICA, which contain the permutation and sign flip ambiguities
given by _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] .


Obtaining a consistent ordering of the noise components across all environments is equivalent to
finding _P_ [(] _[k]_ [)] . Under Assumption B, and without loss of generality, we consider that ( _ϵ_ [(] 1 _[k]_ [)] _[, . . ., ϵ]_ _d_ [(] _[k]_ [)][)]
are in increasing order with respect to their _ψ_ values. Since _ψ_ is invariant to sign flip, we can calculate
_ψ_ ( _ϵ_ ~~[(]~~ _i_ _[k]_ [)] ) for all _i ∈_ [ _d_ ] and sort the calculated _ψ_ values in increasing order. Let _P_ [(] _[k]_ [)] denote the sorting
permutation with respect to _ψ_, so that post-sorting, we get _P_ [(] _[k]_ [)] _ϵ_ ~~[(]~~ _[k]_ [)] .
**Remark 3.** _In Appendix C, we discuss how to relax the assumption on the test function ψ._

**Proposition 1.** _P_ [(] _[k]_ [)] = - _P_ [(] _[k]_ [)][�] _[T]_ _, i.e., P_ [(] _[k]_ [)] _is the inverse permutation of the ICA scrambling._


From Proposition 1, we thus find that we can unscramble the permutation _P_ [(] _[k]_ [)] by sorting with respect
to _ψ_ . We get _P_ [(] _[k]_ [)] _ϵ_ ~~[(]~~ _[k]_ [)] = _P_ _[k]_ _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] _ϵ_ [(] _[k]_ [)] = _D_ [(] _[k]_ [)] _ϵ_ [(] _[k]_ [)] from the above proposition. In other words,
we can extract _ϵ_ [(] _[k]_ [)] = _D_ [(] _[k]_ [)] _ϵ_ [(] _[k]_ [)] via _M_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _M_ [(] _[k]_ [)] = _D_ [(] _[k]_ [)] _B_ [(] _[k]_ [)] _H_ = _D_ [(] _[k]_ [)] _M_ [(] _[k]_ [)] after ICA and
        - [�]
sorting by _ψ_ .


5


**Proposition 2.** _Given access to K_ _≥_ 2 _environments, assume that A holds._ _Then, Zi is identified as_
_a latent non-shifted node between environments k and k_ _[′]_ _if and only if Mi_ [(] _[k]_ [)] = _Mi_ [(] _[k][′]_ [)] _, where Mi_ [(] _[k]_ [)]
_represents the i-th row of M_ [(] _[k]_ [)] _, and M_ [(] _[k]_ [)] = _B_ [(] _[k]_ [)] _H._


All formal proofs are given in Appendix E. Our next result shows the identifiability of shifted nodes
in the unscrambled matrix _M_ [(] _[k]_ [)] .

[�]
**Theorem 3.** _Zi_ _is identified as a non-shifted node if and only if_ _M_ [�] _i_ [(] _[k]_ [)] = _M_ [�] _i_ [(] _[k][′]_ [)] _or_ _M_ [�] _i_ [(] _[k]_ [)] = _−M_ [�] _i_ [(] _[k][′]_ [)] _._


We can summarize this in the following algorithm, which proves Theorem 2:


 - Perform ICA to obtain _M_ [(] _[k]_ [)] and _ϵ_ ~~[(]~~ _[k]_ [)] with input _X_ [(] _[k]_ [)] .

 - Sort by _ψ_ to get the permutation _P_ [(] _[k]_ [)] and compute _M_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _M_ [(] _[k]_ [)] and _ϵ_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _ϵ_ ~~[(]~~ _[k]_ [)] .

[�]                                  
 - Check the condition on _{M_ [�] _i_ [(] _[k]_ [)] : _k_ _∈_ [ _K_ ] _}_ to detect if _Zi_ is a shifted node, as prescribed by
Theorem 3.


**4.2** **Finite-sample algorithm**


Thus far, we have considered the population setting where we are given the entire interventional
distributions. In practice, we are given samples from each of these interventional distributions, so that
we have _K_ datasets, one for each of the interventional distributions. The overall algorithm is given
next in Alg. 1 (see illustration in Appendix B) with detailed explanations following the algorithm.


**Algorithm 1** iLCS: **I** dentifying **L** atent **C** ausal Mechanisms **S** hifts


**Require:** Datasets _{_ _**X**_ [(] _[k]_ [)] _}_ _[K]_ _k_ =1 [and threshold] _[ α]_ [ (e.g., 0.5)]
Calculate covariance matrix Σ [(] _[k]_ [)] from _**X**_ [(] _[k]_ [)] for all k
_d_ = max
_k_ =1 _,...,K_ [rank][(Σ][(] _[k]_ [)][)]



**for** _k_ = 1 _, . . ., K_ **do**



//Step 1: _**ϵ**_ ~~[(]~~ _[k]_ [)] is samples from _ϵ_ ~~[(]~~ _[k]_ [)]



_**ϵ**_ ~~[(]~~ _[k]_ [)] _, M_ [(] _[k]_ [)] _←_ ICA( _**X**_ [(] _[k]_ [)] _, d_ )
Calculate _ψ_ [�] ( _**ϵ**_ ~~[(]~~ _[k]_ [)] ) = [ _ψ_ [�] ( _**ϵ**_ ~~[(]~~ 1 _[k]_ [)][)] _[,]_ _[ψ]_ [�][(] _**[ϵ]**_ 2 ~~[(]~~ _[k]_ [)][)] _[, . . .,]_ _[ψ]_ [�][(] _**[ϵ]**_ _d_ ~~[(]~~ _[k]_ [)][)]]
//Step 2
sorted_idx _←_ argsort( _ψ_ ( _**ϵ**_ ~~[(]~~ _[k]_ [)] ))

[�]



_M_  - [(] _[k]_ [)] _←_ _M_ [(] _[k]_ [)] [sorted_idx _,_ :]
Initialize _S_ [(] _[k,k][′]_ [)] = _∅_, for all _k_ = _k_ _[′]_
**for** _i_ = 1 _, . . ., d_ **do**



**for** _k_ = _k_ _[′]_ **do**



Calculate _L_ _[k,k][′]_



_i_
// Step 3
**if** _L_ _[k,k][′]_ _> α_



**if** _Li_ _> α_ **then**

_S_ [(] _[k,k][′]_ [)] _←_ _S_ [(] _[k,k][′]_ [)] _∪{i}_
**Ensure:** All latent shifted nodes _S_ = ( _S_ [(] _[k,k][′]_ [)] ) _k,k′_



**Step 1:** We perform ICA with samples from _X_ [(] _[k]_ [)] to extract _M_ [(] _[k]_ [)] and samples from _ϵ_ ~~[(]~~ _[k]_ [)] .
**Remark 4** (Estimation of _d_ .) **.** _One missing component in using ICA in practice is that, along with_
_samples from X_ [(] _[k]_ [)] _, we need to input the number of latent nodes d, which need to be estimated from_
_samples._ _Define_ Σ [(] _[k]_ [)] = E[ _X_ [(] _[k]_ [)] _X_ [(] _[k]_ [)] _[T]_ ] = _G_ ( _B_ [(] _[k]_ [)] ) _[−]_ [1] ( _B_ [(] _[k]_ [)] ) _[−][T]_ _G_ _[T]_ _._ _Since all matrices are full rank,_
_it follows that d_ = _rank_ (Σ [(] _[k]_ [)] ) _, where_ Σ [(] _[k]_ [)] _can be estimated by the sample covariance matrix._ _Thus,_
_d can also be estimated by the rank of the sample covariance matrix._


**Step 2:** We compute the empirical expectation of _ψ_ on samples from _ϵ_ ~~[(]~~ _[k]_ [)], which by law of large
number arguments, converges to its population expectation, which is _ψ_ ( _ϵ_ ~~[(]~~ _[k]_ [)] ). We use the sorted order
of the empirical expectations to sort the noise components, unscrambling the noise components as
earlier, to get _M_ [(] _[k]_ [)] and samples from _ϵ_ [(] _[k]_ [)] .

[�]         

6


**Step 3:** Here, we explicitly construct a test statistic to check the condition on _{M_ [�] _i_ [(] _[k]_ [)] : _k_ _∈_ [ _K_ ] _}_ to
detect if _Zi_ is a shifted node. Note that from our Theorem 3, there is a non-shift node _Zi_ between
environments _k_ and _k_ _[′]_ if and only if _M_ [�] _i_ [(] _[k]_ [)] = _±M_ [�] _i_ [(] _[k][′]_ [)] . Accordingly, we define a test statistic:

_L_ _[k,k]_ _i_ _[′]_ = [min] _∥M_ [�] _[{∥]_ _i_ [(] _[k]_ _M_ [)][�] _∥_ 1 _i_ [(] + _[k]_ [)] _∥±M_ [�] _M_ [�] _i_ [(] _i_ _[k]_ [(] _[k][′]_ [)] _[′]_ [)] _∥∥_ 11



It can be seen that _L_ _[k,k]_ _i_ _[′]_ = 0 if and only if _M_ [�] _i_ [(] _[k]_ [)] = _±M_ [�] _i_ [(] _[k][′]_ [)], which implies node _Zi_ is not shifted

between environments _k_ and _k_ _[′]_ . Thus, in step three of the algorithm above, for each coordinate
_i ∈_ [ _d_ ], we check if there exists _k_ = _k_ _[′]_ such that _L_ _[k,k][′]_ _> α_ for a given threshold _α_ . If such a _k_ = _k_ _[′]_



It can be seen that _L_ _[k,k][′]_



_i ∈_ [ _d_ ], we check if there exists _k_ = _k_ _[′]_ such that _L_ _[k,k]_ _i_ _> α_ for a given threshold _α_ . If such a _k_ = _k_ _[′]_

exists, we include _i_ in the list of shifted nodes.


Algorithm 1 is consistent with the ground truth set of shifted nodes as _n_ approaches infinity. Empirical
evidence supporting this claim is presented in Figure 2, which shows that with a sufficiently large
sample size, all shifted nodes are correctly identified, and the F1 score reaches 1. Further theoretical
discussion on the sample complexity of our method can be found in Appendix D.







1.0


0.8


0.6


0.4


0.2











N ×10 [4]



N ×10 [4]



N ×10 [4]



Figure 2: Illustration of the efficacy of our method in accurately identifying latent shifted nodes as
the sample size increases, for ER2 graphs. In the first subplot, for a latent graph with _d_ = 5 nodes, we
examine scenarios with observed dimensions _p_ = 10 _,_ 20 _,_ 40 and plot their corresponding F1 scores
against the number of samples _n_ . It is observed that the F1 score approaches 1 with a sufficiently
large sample size. Detailed experimental procedures and results are discussed in Section 5.


**5** **Experiments**


In this section, we investigate the performance of our method in synthetic and real-world data.


**5.1** **Synthetic Data**


In our setup, each noise component _ϵi_ is sampled from a generalized normal distribution with the
probability density function given by _p_ ( _ϵi_ ) _∝_ exp _{−|ϵi|_ _[i]_ _}_, where _i_ = 1 _,_ 2 _, . . ., d_ . In this noise
generation process, the noise vector _ϵ_ adheres to the condition _ψ_ ( _ϵi_ ) _<_ _ψ_ ( _ϵj_ ) for all _i_ _<_ _j_ if we
choose _ψ_ ( _y_ ) = P( _|y| ≤_ 1). Following the methodology similar to that in [40], we start by sampling
either an Erd˝os-Rényi (ER) or Scale-Free (SF) graph with _d_ nodes and an expected edge count of
_md_, where _m_ _∈{_ 2 _,_ 4 _,_ 6 _}_, denoted as _ERm_ or _SFm_ . The observed space dimension _p_ is set to
2 _d_ . For each graph, the weights are independently sampled from Unif _±_ [0 _._ 25 _,_ 1] and the diagonal
entries of Ω from Unif[2 _,_ 4]. In each environment _k_, 15% of the nodes are randomly selected for
shifting. The new weights _A_ [(] _i_ _[k]_ [)] for the shifted node _i_, and the new entries of Ω [(] _[k]_ [)], specifically Ω [(] _ii_ _[k]_ [)][,]
are independently sampled from Unif[6 _,_ 8]. The mixing function _G_ is independently generated from
Unif[ _−_ 0 _._ 25 _,_ 0 _._ 25].

Empirically, we have observed that the following formulation of _L_ _[k,k]_ _i_ _[′]_ leads to improved results:

_Li_ _[k,k][′]_ = _∥_ _[∥|]_ _M_ [�] _M_ [�] _i_ [(] _[k]_ _i_ [(][)] _[k]_ _∥_ [)] _| −|_ 1 + _∥M_ [�] _M_ [�] _i_ [(] _[k]_ _i_ [(] _[′][k]_ [)] _[′]_ _|∥_ [)] _∥_ 11 _,_


7


Table 1: Performance metrics for shifted node detection across various graph configurations, sample
sizes _n_ = 10 [6] .


Graph Type _p_ _d_ Precision Recall F1 Score Time (s)


ER2 10 5 1.000 1.000 1.000 1.23
20 10 1.000 1.000 1.000 3.84
40 20 0.933 0.833 0.873 10.34
60 30 0.680 0.700 0.689 20.06
80 40 0.610 0.600 0.605 30.59


ER4 20 10 1.000 1.000 1.000 3.89
40 20 0.933 0.933 0.933 9.39
60 30 0.617 0.600 0.607 30.83
80 40 0.610 0.617 0.613 32.08


SF2 10 5 0.900 0.900 0.900 1.64
20 10 1.000 1.000 1.000 3.84
40 20 0.807 0.833 0.817 15.85
60 30 0.730 0.750 0.739 22.12
80 40 0.667 0.667 0.667 30.29


SF4 20 10 1.000 1.000 1.000 3.13
40 20 0.967 0.900 0.927 15.12
60 30 0.725 0.700 0.711 29.79
80 40 0.539 0.533 0.535 30.84


where _|M_ [�] _i_ [(] _[k]_ [)] _|_ denotes the element-wise absolute value of the vector _M_ [�] _i_ [(] _[k]_ [)] . We will utilized the new
formula of _L_ _[k,k]_ _i_ _[′]_ to detect shifts in the following experiment. Then we explore sample sizes _n_ from

500 to 10 [6], using the observed samples _X_ [(] _[k]_ [)] as input. The parameter _α_ is set to 0 _._ 2 for _d_ _≤_ 10
and 0 _._ 5 for higher dimensions, reflecting the increased complexity in estimating larger dimensional
latent graphs and thus necessitating a higher tolerance for _L_ 1 norm differences in detecting shifted
nodes. For each setting, we independently generate 10 datasets and take the average of the metrics.
The results for _n_ = 10 [6] are shown in Table 1, and the asymptotic consistency results for specific _p_
values are illustrated in Figure 2. In addition to the causal representative setting, our method can also
directly identify mechanism shifts in a fully observed setting, where _G_ = _I_ . We further compare
our method’s results in this fully observed setting against the baseline DCI [52], which addresses
direct mechanism shifts in linear settings. The results of this comparison are provided in Appendix F,
demonstrating that our method outperforms DCI in most settings.


**5.2** **Psychometrics Data**


We evaluate our method using a dataset related to the Five Factor Model, also known as the Big Five
personality traits [16, 15, 32]. This model is a widely accepted framework, comprising five broad
dimensions that encapsulate the diversity of human personality traits. These dimensions are _Openness_
_to Experience, Conscientiousness, Extraversion, Agreeableness_, and _Neuroticism_ .


The dataset utilized in our study was gathered through an interactive online personality test available
on OpenPsychometrics.org, a nonprofit endeavor aimed at educating the public about psychology
while collecting data for psychological research [1] . This dataset encompasses responses to 50 questions,
with 10 questions dedicated to each of the five personality dimensions. Participants responded to
each question on a scale from 1 to 5. Additionally, the dataset includes demographic information,
such as race, age, gender, and country, comprising a total of 19,719 observations.


**Question formalization and data processing.** In this study, we hypothesize the existence of 5
latent nodes, each representing one of the five personality dimensions, believed to be causally related.
The score responses to the 50 questions form our observed space. Our main goal is to determine
whether variations in personality dimensions can be observed across genders, thus treating gender as
one environment ( _K_ = 2). Additionally, we investigate potential personality shifts across countries,
selecting the US and UK for analysis due to they have the most observations in our dataset. The
only preprocessing step undertaken involves the removal of observations with missing values and the


1The data can be downloaded via the link: [https://www.kaggle.com/datasets/](https://www.kaggle.com/datasets/lucasgreenwell/ocean-five-factor-personality-test-responses/data)
[lucasgreenwell/ocean-five-factor-personality-test-responses/data](https://www.kaggle.com/datasets/lucasgreenwell/ocean-five-factor-personality-test-responses/data)


8


normalization of data to fit within the [0 _,_ 1] range, achieved by adjusting according to the maximum
and minimum values observed. The research question we have formalized in this study is not derived
from any data competition. It aligns with interests explored in existing psychological literature

[25, 8, 46, 29], yet our investigation is distinguished by a unique analytical framework.


**Labeling latent nodes.** Prior to detecting shifted nodes, it is essential to assign semantics to each
node. This process involves conducting interventions on each component of the noise vector to aid in
labeling the latent nodes. Given that the noise components are distinct for each latent node, labeling
the noise effectively equates to labeling the latent nodes.


Initially, we apply ICA to the data for males, followed by getting post-sorting _M_ _[male]_ and _**ϵ**_ _[male]_

[�]                                                  as outlined in our methodology. Subsequently, we perform interventions on each noise component,
setting each to 0 sequentially, and then re-mixing the intervened noise vector using ( _M_ [�] _[male]_ ) _[†]_ . By
examining the impact of these interventions on the observation space — specifically, identifying
which question scores undergo significant changes — we can assign appropriate semantic labels

                                 
|Extraversion|Neuroticism|
|---|---|
|Agreeableness|Conscientiousness|
|Openness|Before Intervention<br>After Intervention|



**Shifted nodes detection.** To identify shifted personality dimensions across gender, we computed
_L_ _[male,female]_ _i_ for each latent node, obtaining values of _{_ 0 _._ 074 _,_ 0 _._ 0497 _,_ 0 _._ 078 _,_ 0 _._ 638 _,_ 0 _._ 633 _}_ . Setting
a tolerance threshold _α_ = 0 _._ 5 to accommodate real data estimation variances, we observed that
the last two nodes exhibit significantly higher _L_ _[male,female]_ _i_ scores, surpassing _α_, and thus are
considered shifted. These nodes correspond to the labels _Neuroticism_ and _Extraversion_ . Consistent
with existing psychological literature, women have been found to score higher in _Neuroticism_ than
men [25, 8, 46, 29], while men scored higher in the Activity subcomponent of _Extraversion_ [8].
This discovery aligns with the findings in psychology literature. To further validate our method’s
effectiveness, a similar analysis was conducted across countries, comparing the UK and the US,
which have the most observations in our dataset. The computed _L_ _[US,UK]_ _i_ for each latent node was
_{_ 0 _._ 302 _,_ 0 _._ 258 _,_ 0 _._ 109 _,_ 0 _._ 189 _,_ 0 _._ 088 _}_ . All values fell below _α_, indicating no latent node shifts between


9


these two countries. This finding is also in agreement with existing studies that personality exhibits
stability across countries and cultures [25, 24, 11].


**6** **Concluding Remarks**


In this study, we demonstrated that latent mechanism shifts are identifiable, up to a permutation,
within the framework of linear latent causal structures and linear mixing functions. Furthermore,
we introduced an algorithm, grounded in ICA, designed to detect these shifts. Our method offers a
broader applicability to various types of interventions compared to CRL framework. Unlike shift
detection methods where node variables are directly observable, our approach extends to scenarios
where latent variables remain unobserved. A promising future direction consists of adapting our
methodology to nonlinear transformations, which could address more complex, practical challenges,
such as identifying latent mechanism shifts in real-world image data.


**References**


[1] Ahuja, K., Mahajan, D., Wang, Y. and Bengio, Y. [2023], Interventional causal representation
learning, _in_ ‘International conference on machine learning’, PMLR, pp. 372–407.


[2] Auddy, A. and Yuan, M. [2023], ‘Large dimensional independent component analysis: Statistical
optimality and computational tractability’, _arXiv preprint arXiv:2303.18156_ .


[3] Bengio, Y., Courville, A. and Vincent, P. [2013], ‘Representation learning: A review and new
perspectives’, _IEEE transactions on pattern analysis and machine intelligence_ **35** (8), 1798–
1828.


[4] Buchholz, S., Rajendran, G., Rosenfeld, E., Aragam, B., Schölkopf, B. and Ravikumar, P.

[2023], ‘Learning linear causal representations from interventions under general nonlinear
mixing’, _arXiv preprint arXiv:2306.02235_ .


[5] Budhathoki, K., Janzing, D., Bloebaum, P. and Ng, H. [2021], Why did the distribution change?,
_in_ ‘International Conference on Artificial Intelligence and Statistics’, PMLR, pp. 1666–1674.


[6] Budhathoki, K., Minorics, L., Blöbaum, P. and Janzing, D. [2022], Causal structure-based
root cause analysis of outliers, _in_ ‘International Conference on Machine Learning’, PMLR,
pp. 2357–2369.


[7] Burgess, C. P., Higgins, I., Pal, A., Matthey, L., Watters, N., Desjardins, G. and Lerchner, A.

[2018], ‘Understanding disentangling in _β_ -vae’, _arXiv preprint arXiv:1804.03599_ .


[8] Chapman, B. P., Duberstein, P. R., Sörensen, S. and Lyness, J. M. [2007], ‘Gender differences in
five factor model personality traits in an elderly cohort’, _Personality and individual differences_
**43** (6), 1594–1603.


[9] Chen, R. T., Li, X., Grosse, R. B. and Duvenaud, D. K. [2018], ‘Isolating sources of disentanglement in variational autoencoders’, _Advances in neural information processing systems_
**31** .


[10] Chen, T., Bello, K., Aragam, B. and Ravikumar, P. [2023], ‘iSCAN: Identifying Causal Mechanism Shifts among Nonlinear Additive Noise Models’, _Advances_ _in_ _Neural_ _Information_
_Processing Systems_ .


[11] Cohen, E. H. and Deuling, J. K. [2014], ‘Structural analysis of the abridged big five circumplex:
A comparison among gender and ethnic groups’, _Bulletin of Sociological Methodology/Bulletin_
_de Méthodologie Sociologique_ **122** (1), 63–86.


[12] Comon, P. [1994], ‘Independent component analysis, a new concept?’, _Signal_ _processing_
**36** (3), 287–314.


[13] Eriksson, J. and Koivunen, V. [2004], ‘Identifiability, separability, and uniqueness of linear ica
models’, _IEEE signal processing letters_ **11** (7), 601–604.


[14] Ghoshal, A., Bello, K. and Honorio, J. [2019], ‘Direct learning with guarantees of the difference
dag between structural equation models’, _arXiv preprint arXiv:1906.12024_ .


[15] Goldberg, L. R. [1992], ‘The development of markers for the big-five factor structure.’, _Psycho-_
_logical assessment_ **4** (1), 26.


10


[16] Goldberg, L. R. [2013], An alternative “description of personality”: The big-five factor structure,
_in_ ‘Personality and Personality Disorders’, Routledge, pp. 34–47.


[17] Hyvarinen, A. [1999], ‘Fast and robust fixed-point algorithms for independent component
analysis’, _IEEE transactions on Neural Networks_ **10** (3), 626–634.


[18] Hyvärinen, A., Hurri, J., Hoyer, P. O., Hyvärinen, A., Hurri, J. and Hoyer, P. O. [2009],
_Independent component analysis_, Springer.


[19] Hyvärinen, A. and Oja, E. [2000], ‘Independent component analysis: algorithms and applications’, _Neural networks_ **13** (4-5), 411–430.


[20] Hyvärinen, A. and Pajunen, P. [1999], ‘Nonlinear independent component analysis: Existence
and uniqueness results’, _Neural networks_ **12** (3), 429–439.


[21] Ikram, A., Chakraborty, S., Mitra, S., Saini, S., Bagchi, S. and Kocaoglu, M. [2022], ‘Root cause
analysis of failures in microservices through causal discovery’, _Advances in Neural Information_
_Processing Systems_ **35**, 31158–31170.


[22] Jiang, Y. and Aragam, B. [2023], ‘Learning nonparametric latent causal graphs with unknown
interventions’, _arXiv preprint arXiv:2306.02899_ .


[23] Jin, J. and Syrgkanis, V. [2023], ‘Learning causal representations from general environments:
Identifiability and intrinsic ambiguity’, _arXiv preprint arXiv:2311.12267_ .


[24] Jolijn Hendriks, A., Perugini, M., Angleitner, A., Ostendorf, F., Johnson, J. A., De Fruyt, F.,
Hˇrebíˇcková, M., Kreitler, S., Murakami, T., Bratko, D. et al. [2003], ‘The five-factor personality
inventory: cross-cultural generalizability across 13 countries’, _European journal of personality_
**17** (5), 347–373.


[25] Kajonius, P. and Mac Giolla, E. [2017], ‘Personality traits across countries: Support for
similarities rather than differences’, _PloS one_ **12** (6), e0179646.


[26] Kim, H. and Mnih, A. [2018], Disentangling by factorising, _in_ ‘International Conference on
Machine Learning’, PMLR, pp. 2649–2658.


[27] Kulinski, S., Bagchi, S. and Inouye, D. I. [2020], ‘Feature shift detection: Localizing which features have shifted via conditional distribution tests’, _Advances in neural information processing_
_systems_ **33**, 19523–19533.


[28] Li, C., Shen, X. and Pan, W. [2023], ‘Nonlinear causal discovery with confounders’, _Journal of_
_the American Statistical Association_ pp. 1–10.


[29] Löckenhoff, C. E., Chan, W., McCrae, R. R., De Fruyt, F., Jussim, L., De Bolle, M., Costa Jr,
P. T., Sutin, A. R., Realo, A., Allik, J. et al. [2014], ‘Gender stereotypes of personality: Universal
and accurate?’, _Journal of cross-cultural psychology_ **45** (5), 675–694.


[30] Magliacane, S., Van Ommen, T., Claassen, T., Bongers, S., Versteeg, P. and Mooij, J. M. [2018],
‘Domain adaptation by using causal inference to predict invariant conditional distributions’,
_Advances in neural information processing systems_ **31** .


[31] Mameche, S., Kaltenpoth, D. and Vreeken, J. [2024], ‘Learning causal models under independent changes’, _Advances in Neural Information Processing Systems_ **36** .


[32] Matthews, G., Deary, I. J. and Whiteman, M. C. [2003], _Personality traits_, Cambridge University
Press.


[33] Misiakos, P., Wendler, C. and Püschel, M. [2024], ‘Learning dags from data with few root
causes’, _Advances in Neural Information Processing Systems_ **36** .


[34] Montagna, F., Noceti, N., Rosasco, L., Zhang, K. and Locatello, F. [2023], ‘Causal discovery
with score matching on additive models with arbitrary noise’, _arXiv:2304.03265_ .


[35] Monti, R. P., Zhang, K. and Hyvärinen, A. [2020], Causal discovery with general non-linear
relationships using non-linear ica, _in_ ‘Uncertainty in Artificial Intelligence’, PMLR, pp. 186–
195.


[36] Muandet, K., Balduzzi, D. and Schölkopf, B. [2013], Domain generalization via invariant
feature representation, _in_ ‘International conference on machine learning’, PMLR, pp. 10–18.


[37] Pearl, J. [2009], _CAUSALITY: Models, Reasoning, and Inference_, 2nd edn, Cambridge University
Press.


11


[38] Peters, J., Janzing, D. and Schölkopf, B. [2017], _Elements of causal inference:_ _foundations and_
_learning algorithms_, The MIT Press.

[39] Schölkopf, B., Locatello, F., Bauer, S., Ke, N. R., Kalchbrenner, N., Goyal, A. and Bengio, Y.

[2021], ‘Toward causal representation learning’, _Proceedings of the IEEE_ **109** (5), 612–634.

[40] Seigal, A., Squires, C. and Uhler, C. [2022], ‘Linear causal disentanglement via interventions’,
_arXiv preprint arXiv:2211.16467_ .

[41] Shen, H., Jegelka, S. and Gretton, A. [2009], ‘Fast kernel-based independent component
analysis’, _IEEE Transactions on Signal Processing_ **57** (9), 3498–3511.

[42] Shimizu, S., Hoyer, P. O. and Hyvärinen, A. [2009], ‘Estimation of linear non-gaussian acyclic
models for latent factors’, _Neurocomputing_ **72** (7-9), 2024–2027.

[43] Shimizu, S., Hoyer, P. O., Hyvärinen, A., Kerminen, A. and Jordan, M. [2006], ‘A linear
non-gaussian acyclic model for causal discovery.’, _Journal_ _of_ _Machine_ _Learning_ _Research_
**7** (10).

[44] Shimizu, S., Hyvarinen, A., Kano, Y. and Hoyer, P. O. [2012], ‘Discovery of non-gaussian linear
causal models using ica’, _arXiv preprint arXiv:1207.1413_ .

[45] Silva, R., Scheines, R., Glymour, C., Spirtes, P. and Chickering, D. M. [2006], ‘Learning the
structure of linear latent variable models.’, _Journal of Machine Learning Research_ **7** (2).

[46] Soto, C. J., John, O. P., Gosling, S. D. and Potter, J. [2011], ‘Age differences in personality
traits from 10 to 65: Big five domains and facets in a large cross-sectional sample.’, _Journal of_
_personality and social psychology_ **100** (2), 330.

[47] Sturma, N., Squires, C., Drton, M. and Uhler, C. [2023], ‘Unpaired multi-domain causal
representation learning’, _arXiv preprint arXiv:2302.00993_ .

[48] Varici, B., Acarturk, E., Shanmugam, K., Kumar, A. and Tajer, A. [2023], ‘Score-based causal
representation learning with interventions’, _arXiv preprint arXiv:2301.08230_ .

[49] Varıcı, B., Acartürk, E., Shanmugam, K. and Tajer, A. [2023], ‘General identifiability and
achievability for causal representation learning’, _arXiv preprint arXiv:2310.15450_ .

[50] von Kügelgen, J., Besserve, M., Wendong, L., Gresele, L., Keki´c, A., Bareinboim, E., Blei,
D. M. and Schölkopf, B. [2023], ‘Nonparametric identifiability of causal representations from
unknown interventions’, _arXiv preprint arXiv:2306.00542_ .

[51] Wang, Y. and Jordan, M. I. [2021], ‘Desiderata for representation learning: A causal perspective’,
_arXiv preprint arXiv:2109.03795_ .

[52] Wang, Y., Squires, C., Belyaeva, A. and Uhler, C. [2018], ‘Direct estimation of differences in
causal graphs’, _Advances in neural information processing systems_ **31** .

[53] Wu, P. and Fukumizu, K. [2020], Causal mosaic: Cause-effect inference via nonlinear ica and
ensemble method, _in_ ‘International Conference on Artificial Intelligence and Statistics’, PMLR,
pp. 1157–1167.

[54] Yang, M., Liu, F., Chen, Z., Shen, X., Hao, J. and Wang, J. [2021], Causalvae: Disentangled
representation learning via neural structural causal models, _in_ ‘Proceedings of the IEEE/CVF
conference on computer vision and pattern recognition’, pp. 9593–9602.

[55] Zhang, H., Zhang, Y.-F., Liu, W., Weller, A., Schölkopf, B. and Xing, E. P. [2022], Towards principled disentanglement for domain generalization, _in_ ‘Proceedings of the IEEE/CVF Conference
on Computer Vision and Pattern Recognition’, pp. 8024–8034.


12


**SUPPLEMENTARY MATERIAL**
**Identifying General Mechanism Shifts in Linear Causal Representations**


**A** **Limitations and Broader Impacts**


Limitations of this work include the need to relax the noise assumption and to consider similar
settings under nonlinear mixing functions. These are promising directions to explore in the CRL field.
The broader impact of this work is that CRL methods can be used to identify mechanism shifts and
determine root causes, which can be utilized in the biological field to find disease genes or biomarkers.
Currently, the negative impacts of this method are not clear.


**B** **Illustration of our algorithm**













Rearrange


Rearrange




|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
|||||||||||
|||||||||||
|||||||||||
|||||||||||


|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
|||||||||||
|||||||||||
|||||||||||
|||||||||||


|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|
|---|---|---|---|---|---|---|---|---|---|
|||||||||||
|||||||||||
|||||||||||
|||||||||||



Figure 4: Overview of our method: For each context _k_, given the data _**X**_ [(] _[k]_ [)], our method involves
three main steps. First, we apply ICA to each dataset to estimate _**ϵ**_ [(] _[k]_ [)] and _M_ [(] _[k]_ [)] . Second, we calculate
_ψ_ ( _ϵ_ [(] _[k]_ [)] ) = _{ψ_ ( _ϵ_ [(] 1 _[k]_ [)][)] _[, ψ]_ [(] _[ϵ]_ [(] 2 _[k]_ [)][)] _[, . . ., ψ]_ [(] _[ϵ]_ _d_ [(] _[k]_ [)][)] _[}]_ [for] [each] [noise] [component,] [sort] [these] [components] [in]
increasing order, and correspondingly arrange the rows of _M_ [(] _[k]_ [)] . Third, we compare the sorted rows
of _M_ [(] _[k]_ [)] to identify the shifted nodes.


**C** **Discussion on Test Function**


In Assumption B, we assume that there exists a test function _ψ_ and that we can access it. Here we
discuss ways to relax it. Recall that in Section 4.1, _ψ_ is utilized to sort the noise component _ϵ_ ~~[(]~~ _[k]_ [)] to
ensure that the post-sorting noise vector _ϵ_ [(] _[k]_ [)] has a consistent order across all environments.
                     

An alternative approach to achieve this is to use distribution matching. We take the noise vector in
the first environment as a reference and align all other noise vectors post-sorting with the reference
vector. To do this, we can use a distribution distance metric _D_ . First, define a signed permutation
space as


_Sd_ = _{S_ = _PD_ _| P_ is a permutation matrix _, D_ is a diagonal matrix with _Dii_ _∈{−_ 1 _,_ 1 _}}_


Then, solve the optimization problem:


min
_S∈Sd_ _[D]_ [(] _[ϵ]_ ~~[(]~~ [1)] _[, S][ϵ]_ ~~[(]~~ _[k]_ [)][)]


where _D_ can be any distribution distance, such as Kullback-Leibler divergence. In Assumption A, we
assume pair-wise different noise component, thus the optimization questions have minimums value 0
if and only if each noise component of _ϵ_ ~~[(]~~ [1)] and _Sϵ_ ~~[(]~~ _[k]_ [)] have the same distribution, thus help us align
the noise component order. We solve this optimization problem for each environment _k_ _≥_ 2, thus
obtaining _P_ [(] _[k]_ [)] . All following steps in our algorithm remain the same when using this alternative
approach.


One small gap remains: even though all post-sorting noise vectors have a consistent order with _ϵ_ ~~[(]~~ [1)],
_ϵ_ ~~[(]~~ [1)] is not the ground truth order of _ϵ_ [(1)] . This ambiguity cannot be eliminated, consistent with the
nature of the CRL method, and is the same with other CRL methods, such as [40, 28]. Fortunately,
the ground truth order is not so important in practice. What people mainly care about is the semantic
label for each latent node. Some CRL generative models, such as [54], may be helpful for performing
fake interventions and manually assigning semantic labels. However, this is beyond the scope of this
paper, and we will not discuss it further.


Even though the distribution matching optimization method offers greater flexibility, it is computationally expensive. First, note that the cardinality _|Sd|_ = _d_ ! _×_ 2 _[d]_, which represents a vast search space
when _d_ is large. Furthermore, calculating _D_ ( _·, ·_ ) is generally computationally intensive. For example,
the KL method requires density estimation, and the Maximum Mean Discrepancy (MMD) method
necessitates the computation of pairwise distances among samples. These challenges render this
alternative difficult to implement. Consequently, we opt to use the _ψ_ function to facilitate efficient
sorting, but it may need carefully design.


**D** **Discussion on Sample Complexity**


The sample complexity of our method must be considered from two perspectives: one involves using
ICA to estimate ¯ _ϵ_ [(] _[k]_ [)] and _M_ [(] _[k]_ [)], and the other pertains to utilizing ¯ _ϵ_ [(] _[k]_ [)] and a test function to sort the
rows of _M_ [(] _[k]_ [)] . Since the sorting step depends on the choice of test function, we assume for simplicity
that _M_ [(] _[k]_ [)] is already sorted by the ground truth order. Thus, we only focus on the asymptotic behavior
of _M_ [(] _[k]_ [)], which closely relates to the properties of the ICA estimator.

[�]

There are various algorithms for solving ICA [18, 17, 41]; each algorithm exhibits different asymptotic
statistical properties. If we apply the findings in Auddy and Yuan [2], we assume that the estimated
ICA unmixing function has the following statistical accuracy:
**Theorem 4.** _If the sample size n ≥_ _g_ ( _d, δ_ ) _, then with probability at least_ 1 _−_ _h_ ( _n, d, δ, ϵ_ ) _, we have:_

_l_ ( _M_ [�] _i_ [(] _[k]_ [)] _−_ _Mi_ [(] _[k]_ [)] ) _≤_ _C · p_ ( _d, n_ ) _f_ ( _δ_ ) _,_

_where_ _M_ [�] _i_ [(] _[k]_ [)] _represents the i-th row of the estimated unmixing function M_ [(] _[k]_ [)] _, C_ _is a constant, and_
_p,_ _f_ _,_ _g,_ _and_ _h_ _are_ _known_ _functions._ _For_ _instance,_ _in_ _Auddy_ _and_ _Yuan_ _[2],_ _p_ ( _d, n_ ) = - _d/n_ _and_
_f_ ( _δ_ ) = �log(1 _/δ_ ) _._ _Here, l denotes the loss function, and the L_ 2 _norm can serve as an option._


Under this theorem, for two environments _k_ and _k_ _[′]_, if node _i_ does not shift, we have:


_||M_ [�] _i_ _[k]_ _[−]_ _M_ [�] _i_ _[k][′][||]_ [2] _[≤||]_ _M_ [�] _i_ _[k]_ _[−]_ _[M][i][||]_ [2] [+] _[ ||]_ _M_ [�] _i_ _[k][′]_ _−_ _Mi||_ 2 _≤_ 2 _· C · p_ ( _d, n_ ) _f_ ( _δ_ )


with a probability of at least 1 _−_ 2 _h_ ( _n, d, δ, ϵ_ ). Thus, by setting the threshold _α_ as 2 _· C · p_ ( _d, n_ ) _f_ ( _δ_ ),
we can control the false discovery rate to be at most 2 _h_ ( _n, d, δ, ϵ_ ). A similar sample complexity
theorem can be extended to cases involving more than two environments, as long as the statistical
properties of the ICA solution are known.


14


**E** **Detailed Proofs**


**E.1** **Proof of Proposition 2**


**Lemma 1.** _Under problem setting, for any x, y_ _∈_ R _[d][×]_ [1] _, the equation x_ _[T]_ _H_ = _y_ _[T]_ _H_ _holds if and_
_only if x_ = _y._


_Proof._ Given that _G_ possesses full column rank, it follows that _H_ = _G_ _[†]_ has full row rank. Consequently, the null space of _H_ _[T]_ is _{_ 0 _}_ . Therefore, if _x_ _[T]_ _H_ = _y_ _[T]_ _H_, it implies _H_ _[T]_ ( _x −_ _y_ ) = 0. This
leads to the conclusion that _x −_ _y_ = 0, which in turn implies _x_ = _y_ .


_Proof of Proposition 2._ Recall that _B_ [(] _[k]_ [)] = (Ω _[k]_ ) _[−]_ 2 [1] ( _Id −_ _A_ [(] _[k]_ [)] ). Since _A_ [(] _[k]_ [)] is a weighted adjacency

matrix, its diagonal entries are zero. Thus,


              -              - _−_ 2 [1] ( _k_ )
_Bij_ [(] _[k]_ [)] = _−_ Ω [(] _ii_ _[k]_ [)] _Aij_ if _i ̸_ = _j,_


             -              - _−_ 2 [1]
_Bii_ [(] _[k]_ [)] = Ω [(] _ii_ _[k]_ [)] if _i_ = _j._


Under Definition 1, if node _Zi_ is shifted, it implies either 1) Ω [(] _ii_ _[k]_ [)] = Ω [(] _ii_ _[k][′]_ [)], 2) _A_ [(] _i_ _[k]_ [)] = _A_ [(] _i_ _[k][′]_ [)], or 3)
both conditions hold. In scenarios 1) and 3), _Bii_ [(] _[k]_ [)] = _Bii_ [(] _[k][′]_ [)], resulting in _Bi_ [(] _[k]_ [)] = _Bi_ [(] _[k][′]_ [)] . In scenario
2), while Ω [(] _ii_ _[k]_ [)] = Ω [(] _ii_ _[k][′]_ [)], there exists a _j_ _∈_ [ _d_ ] such that _A_ [(] _ij_ _[k]_ [)] = _A_ [(] _ij_ _[k][′]_ [)][, leading to] _[ B]_ _i_ [(] _[k]_ [)] = _Bi_ [(] _[k][′]_ [)] . If

node _Zi_ is not shifted, then _A_ [(] _i_ _[k]_ [)] = _A_ [(] _i_ _[k][′]_ [)] and Ω [(] _ii_ _[k]_ [)] = Ω [(] _ii_ _[k][′]_ [)], implying _Bi_ [(] _[k]_ [)] = _Bi_ [(] _[k][′]_ [)] . Therefore,
_Zi_ is shifted if and only if _Bi_ [(] _[k]_ [)] = _Bi_ [(] _[k][′]_ [)] . According to Lemma 1, _Bi_ [(] _[k]_ [)] = _Bi_ [(] _[k][′]_ [)] if and only if
_Bi_ [(] _[k]_ [)] _H_ = _Bi_ [(] _[k][′]_ [)] _H_, which is equivalent to _Mi_ [(] _[k]_ [)] = _Mi_ [(] _[k][′]_ [)] .

In conclusion, _Zi_ is shifted if and only if _Mi_ [(] _[k]_ [)] = _Mi_ [(] _[k][′]_ [)] .


**E.2** **Proof of Theorem 3**


**Lemma 2.** _Under problem setting, it is not possible for an intervention on the latent node Zi to result_
_in Mi_ [(] _[k]_ [)] = _−Mi_ [(] _[k][′]_ [)] _._


_Proof._ We prove this by contradiction. Suppose that _Mi_ [(] _[k]_ [)] = _−Mi_ [(] _[k][′]_ [)] . According to Lemma 1, this
would imply _Bi_ [(] _[k]_ [)] = _−Bi_ [(] _[k][′]_ [)] . However, we know _B_ [(] _[k]_ [)] = (Ω [(] _[k]_ [)] ) _[−]_ [1] ( _Id −_ _A_ [(] _[k]_ [)] ) where _A_ [(] _[k]_ [)] is the
weight matrix for a DAG. Since _A_ [(] _ii_ _[k]_ [)] = 0, it follows that _Bii_ [(] _[k]_ [)] = (Ω [(] _[k]_ [)] ) _[−]_ _ii_ [1][.] [Therefore, both] _[ B]_ _ii_ [(] _[k]_ [)]
and _Bii_ [(] _[k][′]_ [)] are positive. It is impossible for _Bi_ [(] _[k]_ [)] to be equal to _−Bi_ [(] _[k][′]_ [)] . Consequently, the scenario
where _Mi_ [(] _[k]_ [)] = _−Mi_ [(] _[k][′]_ [)] cannot occur.


_Proof of Theorem 3._ Recall from the data generation process that


_M_ [(] _[k]_ [)] _X_ [(] _[k]_ [)] = _ϵ_ [(] _[k]_ [)] _._


When input _X_ [(] _[k]_ [)] to ICA, we have _M_ [(] _[k]_ [)] = _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] _M_ [(] _[k]_ [)] and _ϵ_ ~~[(]~~ _[k]_ [)] = _P_ [(] _[k]_ [)] _D_ [(] _[k]_ [)] _ϵ_ [(] _[k]_ [)] . Without loss
of generality, we assume that _ϵ_ [(] _[k]_ [)] is ordered increasingly with respect to _ψ_ . Thus, post sorting with
respect to _ψ_, we eliminate the ambiguity of _P_ [(] _[k]_ [)], and we get _M_ [(] _[k]_ [)] = _D_ [(] _[k]_ [)] _M_ [(] _[k]_ [)] and _ϵ_ [(] _[k]_ [)] = _D_ [(] _[k]_ [)] _ϵ_ [(] _[k]_ [)] .

[�]                                     
We are now ready to prove that _Zi_ is not shifted if and only if _M_ [�][(] _[k]_ [)] = _±M_ [�][(] _[k][′]_ [)] . This immediately
implies that if _Zi_ is not shifted, then _Mi_ [(] _[k]_ [)] = _Mi_ [(] _[k][′]_ [)], thus satisfying _M_ [�][(] _[k]_ [)] = _±M_ [�][(] _[k][′]_ [)] .

If _M_ [�][(] _[k]_ [)] = _±M_ [�][(] _[k][′]_ [)], there are two cases: _Mi_ [(] _[k]_ [)] = _Mi_ [(] _[k][′]_ [)] or _Mi_ [(] _[k]_ [)] = _−Mi_ [(] _[k][′]_ [)] . We prove in Lemma
2 that the scenario _Mi_ [(] _[k]_ [)] = _−Mi_ [(] _[k][′]_ [)] cannot exist. The only surviving situation is _Mi_ [(] _[k]_ [)] = _Mi_ [(] _[k][′]_ [)],
which indicates that _Zi_ is not shifted.


15


**F** **Experiments on Synthetic Data Compared with DCI**


As described in Section 5.1, instead of generating the mixing function _G_ from Unif[ _−_ 0 _._ 25 _,_ 0 _._ 25],
we set _G_ = _I_, such that _X_ = _Z_ and _Z_ can be directly observed. In this setup, finding general
interventions in linear causal representations reduces to identifying general interventions in linear
SEM, a setting for which the existing method DCI [52] is designed. Table 2 presents the performance
comparison between our method and DCI under these conditions, demonstrating that our method
outperforms DCI in most cases.






|Graph Type|d|Method Precision Recall F1|
|---|---|---|
|ER 2|5|DCI<br>0.60<br>0.60<br>0.60<br>Ours<br>0.80<br>0.80<br>0.80|
|ER 2|10|DCI<br>0.87<br>1.00<br>0.92<br>Ours<br>1.00<br>1.00<br>1.00|
|ER 2|15|DCI<br>0.74<br>1.00<br>0.84<br>Ours<br>0.66<br>1.00<br>0.78|
|ER 4|10|DCI<br>0.83<br>1.00<br>0.89<br>Ours<br>1.00<br>1.00<br>1.00|
|ER 4|15|DCI<br>0.71<br>1.00<br>0.81<br>Ours<br>0.62<br>0.93<br>0.73|
|SF 2|5|DCI<br>0.70<br>0.80<br>0.73<br>Ours<br>1.00<br>1.00<br>1.00|
|SF 2|10|DCI<br>0.67<br>1.00<br>0.79<br>Ours<br>1.00<br>1.00<br>1.00|
|SF 2|15|DCI<br>0.65<br>1.00<br>0.78<br>Ours<br>0.70<br>0.93<br>0.78|
|SF 4|5|DCI<br>0.60<br>0.60<br>0.60<br>Ours<br>0.80<br>0.80<br>0.80|
|SF 4|10|DCI<br>0.77<br>1.00<br>0.85<br>Ours<br>1.00<br>1.00<br>1.00|
|SF 4|15|DCI<br>0.56<br>0.93<br>0.68<br>Ours<br>0.67<br>1.00<br>0.79|



Table 2: Comparison of Precision, Recall, and F1 scores for different graph types, _d_ values, and
methods between our method and DCI.


**G** **Additional Information on Real Data**


This section provides detailed information on the procedures employed in analyzing the real dataset.


**Preprocessing** The initial dataset comprised 19,719 observations, which can be
downloaded from [https://www.kaggle.com/datasets/lucasgreenwell/](https://www.kaggle.com/datasets/lucasgreenwell/ocean-five-factor-personality-test-responses/data)
[ocean-five-factor-personality-test-responses/data.](https://www.kaggle.com/datasets/lucasgreenwell/ocean-five-factor-personality-test-responses/data) In the preprocessing phase, any observation with a missing value in any column was excluded, leaving a total of
19,710 observations for further analysis. Subsequently, we applied max-min value normalization to
the scores of each question, ensuring that all scores were normalized to fall within the range [0 _,_ 1].
This normalization step is crucial for achieving uniformity in the data scale, thereby facilitating
accurate analysis and comparison across the dataset.


**Labeling the Noise** To derive meaningful psychological insights, it is crucial to assign semantic
labels to all latent nodes. Given that the noise components are pairwise distinct and unique to the
latent node _Zi_, we consider intervening on each noise component, then remixing and observing
the changes in the observational space. This approach enables us to assign semantic labels to both
the noise components and their corresponding latent nodes. We utilize observations from the male
dataset as the reference context, which comprises 7,603 observations. Following the initial step of our
method, we obtain the sorted _M_ _[male]_ and _ϵ_ _[male]_ . The mixing function _G_ is derived from ( _M_ [�] _[male]_ ) _[†]_ .

[�]                   

16


To identify the semantic label for the first component of _ϵ_, we set its corresponding noise vector
                            component to 0, effectively nullifying the first component of _ϵ_ _[male]_ . This intervention yields an

                       estimated noise matrix samples from - _ϵ_ _[male]_ _inv_ [,] [denoted] [as] _**[ϵ]**_ [�] _inv_ _[male]_ [.] [The] [intervened] [reconstruction,]
_**X**_ _inv_ _[male]_ = _G_ ( _**ϵ**_ - _[male]_ _intv_ [)] _[T]_ [, and the original score distribution,] _**[ X]**_ _[male]_ [=] _[ G]_ [(] _**[ϵ]**_ [�] _[male]_ [)] _[T]_ [, allow us to compare]
question scores pre- and post-intervention. Figure 7 plots these distributions, revealing significant
shifts for questions pertaining to the _Agreeableness_ dimension, with minimal impact on other scores,
thereby identifying the first noise component as _Agreeableness_ . This process is replicated for the
second through fifth columns of _**ϵ**_ _[male]_, with results illustrated in Figures 9, 8, 5, and 6. Each plot
demonstrates that interventions result in significant distribution changes for questions related to a
single personality dimension, with negligible effects on others. Consequently, we label these noise
components as _Openness_, _Conscientiousness_, _Extraversion_, and _Neuroticism_, respectively. These
labels will be used for all the following analysis.


**Shifted Nodes Detection** We then applied our method to data from the male and female contexts.
The calculated _L_ _[male,female]_ _i_ values are _{_ 0 _._ 074 _,_ 0 _._ 0497 _,_ 0 _._ 078 _,_ 0 _._ 638 _,_ 0 _._ 633 _}_ . Based on these results,
we identify shifts in the last two personality dimensions, specifically labeled as _Extraversion_ and
_Neuroticism_ . Additionally, we conducted a comparative analysis of personality dimensions between
the US and UK, which have 8,753 and 1,531 observations, respectively. The computed _L_ _[US,UK]_ _i_
values are _{_ 0 _._ 302 _,_ 0 _._ 258 _,_ 0 _._ 109 _,_ 0 _._ 189 _,_ 0 _._ 088 _}_, indicating that no latent node is considered as having
undergone shifts between these two countries.

|Extraversion|Neuroticism|
|---|---|
|Agreeableness|Conscientiousness|
|Openness||



Figure 5: Intervention on the fourth component of the noise vector and subsequent re-mixing generate
a new observed space — a new score distribution. Notably, only _Extraversion_ exhibits significant
changes after intervention, leading us to label the fourth component of the noise vector (after sorting)
as _Extraversion_ .


17


|Extraversion|Neuroticism|
|---|---|
|Agreeableness|Conscientiousness|
|Openness||



Figure 6: Intervention on the fifth component of the noise vector and subsequent re-mixing generate
a new observed space — a new score distribution. Notably, only _Neuroticism_ exhibits significant
changes after intervention, leading us to label the fifth component of the noise vector (after sorting)
as _Neuroticism_ .

|Extraversion|Neuroticism|
|---|---|
|Agreeableness|Conscientiousness|
|Openness||



Figure 7: Intervention on the first component of the noise vector and subsequent re-mixing generate a
new observed space — a new score distribution. Notably, only _Agreeableness_ exhibits significant
changes after intervention, leading us to label the first component of the noise vector (after sorting)
as _Agreeableness_ .


18


|Extraversion|Neuroticism|
|---|---|
|Agreeableness|Conscientiousness|
|Openness||



Figure 8: Intervention on the third component of the noise vector and subsequent re-mixing generate a
new observed space — a new score distribution. Notably, only _Conscientiousness_ exhibits significant
changes after intervention, leading us to label the third component of the noise vector (after sorting)
as _Conscientiousness_ .

|Extraversion|Neuroticism|
|---|---|
|Agreeableness|Conscientiousness|
|Openness||



Figure 9: Intervention on the second component of the noise vector and subsequent re-mixing generate
a new observed space — a new score distribution. Notably, only _Openness_ exhibits significant changes
after intervention, leading us to label the second component of the noise vector (after sorting) as
_Openness_ .


19


