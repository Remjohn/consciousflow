## **Curvature-Aligned Probing for Local Loss-Landscape** **Stabilization**

**Nikita Kiselev, Andrey Grabovoy**
Department of Intelligent Systems
Moscow Institute of Physics and Technology
```
          {kiselev.ns,grabovoy.av}@phystech.edu

```

**Abstract**


Local loss-landscape stabilization under sample growth is typically measured either
pointwise or through isotropic averaging in the full parameter space. Despite
practical value, both choices probe directions that contribute little to the dominant
local deformation of strongly anisotropic neural landscapes. We recast stabilization
as an observational problem and introduce a unified family of criteria parameterized by an aggregation order and a probing distribution; within this family we
propose a curvature-aligned criterion ∆ [(] 2 _[D]_ [)] that probes the loss increment field in
the top- _D_ eigenspace of the empirical Hessian near a trained solution. Solely from
a local quadratic model, we prove that ∆ [(] 2 _[D]_ [)] preserves the _O_ ( _k_ _[−]_ [2] ) mean-squared
rate of the full-space criterion while replacing ambient-dimension curvature dependence with dependence on the subspace dimension _D_ ; a corollary gives a
closed-form spectral expression and a proposition identifies the top- _D_ eigenspace
as extremal within the eigenspace-aligned family. We also derive scalable estimators based on Hessian–vector products, subspace Monte Carlo, and a closed-form
Gaussian-moment proxy. On a decoder-only transformer, a curvature-aligned probe
occupying a tiny fraction of parameter space already reproduces the full-space
mean-squared signal to within numerical noise throughout the validated local
regime, and the closed-form estimator is orders of magnitude faster than direct
Monte Carlo after subspace construction.


**1** **Introduction**


Local loss geometry is often summarized through quantities such as sharpness, curvature, or Hessian
spectra, typically for a fixed trained model. Our setting is different: we ask how the empirical
objective deforms locally as the training set grows. In this regime, the issue is not only which
functional of the loss increment should be aggregated, but also which perturbation directions should
be used to observe it. Conventional wisdom holds that local criteria should probe parameter space
isotropically to avoid bias, or collapse to a single point for tractability [Kiselev and Grabovoy, 2024].
We argue that neither choice is necessary, and view local stabilization under sample growth as an
observational problem in which the probing law is an explicit design variable (Figure 1). Concretely,
this lets us ask a quantitative question that the pointwise and isotropic criteria cannot resolve: _how_
_much of one-sample landscape deformation is concentrated in the dominant curvature modes?_


This issue is especially relevant in deep networks, where local geometry is strongly anisotropic.
Empirical Hessian spectra typically concentrate much of their mass in a relatively small number
of dominant directions, while much of parameter space remains weakly curved or nearly flat [Li
et al., 2018a, Sagun et al., 2017, Ghorbani et al., 2019, Papyan, 2019, Xu et al., 2024]. Related
work also suggests that optimization often occupies low-dimensional effective subspaces and that
overparameterized models contain substantial geometric redundancy through flat or symmetryinduced directions [Gur-Ari et al., 2019, Li et al., 2018b, Simsek et al., 2021, Draxler et al., 2018,


Preprint.


(a) Unified stabilization criterion ∆ _p_ with probing
distribution _q_ ( **w** )



(b) Curvature-aware subspace criterion ∆ [(] 2 _[D]_ [)]



Figure 1: **Local stabilization as an observational problem.** Existing local criteria differ not only
in aggregation order, but also in how they probe the increment field. Our criterion ∆ [(] 2 _[D]_ [)] restricts
probing to the principal Hessian subspace spanned by the top- _D_ curvature directions.


Garipov et al., 2018]. These observations suggest that _how_ one probes local deformation should be
part of the definition of stabilization, not merely part of the estimator.


We study stabilization under one-sample growth. The object of interest is the increment field
_Lk_ +1( **w** ) _−Lk_ ( **w** ) near a trained solution **w** _k_ _[∗]_ [.] [This] [places] [our] [work] [next] [to,] [but] [distinct] [from,]
classical sample-growth viewpoints. Statistical learning theory and algorithmic stability study
convergence of empirical quantities, predictors, or generalization error under changes in the training
set [Vapnik, 1998, Shalev-Shwartz and Ben-David, 2014, Bousquet and Elisseeff, 2002, Hardt et al.,
2016, Bousquet et al., 2020]. Influence-function and infinitesimal-jackknife methods go one step
closer by linking data perturbations to local first- and second-order structure [Koh and Liang, 2017,
Giordano et al., 2019, Koh et al., 2019, Basu et al., 2020]. Our target is different: we study the local
deformation of the _empirical objective itself_ .


We formalize this viewpoint through a unified family of local stabilization criteria parameterized by
an aggregation order and a probing distribution; see Eq. (1). This places previously studied one-point
and isotropic mean-squared criteria into a common framework and makes the probing law part of the
observable. We then propose a curvature-aware specialization, the subspace mean-squared criterion
∆ [(] 2 _[D]_ [)] in Eq. (4), which restricts probing to the top- _D_ eigenspace of the empirical Hessian at **w** _k_ _[∗]_ [.]


Our main result shows that this geometric restriction does not incur a rate penalty under a local
quadratic model. Theorem 2 proves that ∆ [(] 2 _[D]_ [)] preserves the _O_ ( _k_ _[−]_ [2] ) mean-squared decay of the
full-space criterion, while replacing ambient-dimension curvature dependence by dependence on the
probing dimension _D_ . In a stable-principal-directions regime, Appendix A further gives a spectral
closed form and an extremality result for the top- _D_ choice within the eigenspace-aligned family.


We also derive scalable estimators based on Hessian–vector products, subspace Monte Carlo, and a
closed-form Gaussian-moment proxy. Empirically, we study how the proposed criteria decay with
sample size, when the subspace criterion preserves the full-space mean-squared signal, for which
perturbation scales the quadratic proxy is accurate, and how the three estimators trade fidelity against
efficiency.


**Contributions.** Our contributions are four-fold:


    - We recast local loss-landscape stabilization under sample growth as an observational problem
and introduce a unified family of criteria parameterized by an aggregation order and a probing
distribution.

    - We propose a curvature-aware subspace criterion ∆ [(] 2 _[D]_ [)] that probes the increment field in
the top- _D_ eigenspace of the empirical Hessian near a trained solution.


    - Under a local quadratic model, we prove that reducing the probe from R _[N]_ to a _D_     dimensional curvature-aligned subspace preserves the _O_ ( _k_ _[−]_ [2] ) mean-squared rate and
replaces an _N_ -dependent curvature constant by a _D_ -dependent one (Theorem 2).


2


Table 1: Positioning relative to adjacent directions. ✓ = central focus; ✗ = not a primary focus.


**Direction** **Data perturbation** **Local objective** **Geometric probe**


Statistical learning theory 12, 13 ✓ ✗ ✗
Algorithmic stability 14, 15, 21, 16 ✓ ✗ ✗
Influence / infinitesimal jack- ✓ ✗ ✗
knife 17, 18, 19, 20

Sharpness / SAM 22, 23, 24, 25, 26 ✗ ✗ ✓
Hessian spectrum / subspace analy- ✗ ✗ ✓
sis 2, 3, 4, 5, 6, 7, 8, 27, 28

Prior increment criteria (∆1, ∆2) 1 ✓ ✓ isotropic only
**This work** ✓ ✓ ✓


    - We develop scalable estimators for the criterion and show empirically that the quadratic
proxy is sufficient in its validated local regime and orders of magnitude faster than direct
Monte Carlo once the subspace has been constructed.


**2** **Related Work**


**Loss geometry and anisotropic local structure.** A large literature studies neural loss landscapes
through visualization, Hessian spectra, sharpness, and related curvature diagnostics. A recurring
empirical finding is strong anisotropy: a relatively small number of eigendirections often account
for much of the local second-order structure, while large parts of parameter space remain weakly
curved or nearly flat [Li et al., 2018a, Sagun et al., 2017, Ghorbani et al., 2019, Papyan, 2019, Xu
et al., 2024]. Related work further suggests that optimization can concentrate in low-dimensional
subspaces and that overparameterized models exhibit geometric redundancy through symmetry or
flat directions [Gur-Ari et al., 2019, Li et al., 2018b, Simsek et al., 2021, Draxler et al., 2018, Garipov
et al., 2018]. These works motivate geometry-aware probing, but they do not study sample-growth
deformation of the empirical objective.


**Data perturbation, stability, and influence.** Classical statistical learning theory and algorithmic
stability study how empirical risks, predictors, and generalization error behave as the training sample
changes [Vapnik, 1998, Shalev-Shwartz and Ben-David, 2014, Bousquet and Elisseeff, 2002, Hardt
et al., 2016, Feldman and Vondrák, 2019, Bousquet et al., 2020]. A closer neighboring literature analyzes infinitesimal or finite data perturbations through influence functions and infinitesimal-jackknife
approximations, linking changes in the training set to local gradient and Hessian information [Koh
and Liang, 2017, Giordano et al., 2019, Koh et al., 2019, Basu et al., 2020]. These are the closest
conceptual precursors to our sample-growth viewpoint. The key difference is the observable: prior
work typically measures the sensitivity of fitted parameters or predictions, whereas we measure the
local deformation of the empirical objective itself through the increment field _Lk_ +1( **w** ) _−Lk_ ( **w** ).


**Sharpness, dominant eigenspaces, and second-order methods.** Related work also studies flatness,
sharpness, sharpness-aware optimization, and dominant Hessian eigenspaces [Keskar et al., 2017,
Dinh et al., 2017, Foret et al., 2021, Dauphin et al., 2024, Luo et al., 2024, Singh et al., 2021, Wu
et al., 2020]. These works ask which curvature directions matter for optimization or robustness on a
fixed objective. Our question is different: given anisotropic local geometry, which probing law should
be used to observe _dataset-induced_ deformation? On the computational side, our estimators rely
on standard scalable second-order primitives—Hessian–vector products and iterative eigensolvers—
rather than explicit Hessian construction [Pearlmutter, 1994, Yao et al., 2020]. Thus, our contribution
is not a new second-order tool, but a geometry-aware observable for sample-growth stabilization.


**3** **Method**


**Notation.** Let D _m_ = _{_ ( **x** _i,_ **y** _i_ ) _}_ _[m]_ _i_ =1 [be] [a] [training] [sample] [of] [size] _[m]_ [,] [and] [let] _[L][m]_ [(] **[w]** [)] [=]
_m_ 1 - _mi_ =1 _[ℓ]_ - _f_ **w** ( **x** _i_ ) _,_ **y** _i_ - = _m_ [1] - _mi_ =1 _[ℓ][i]_ [(] **[w]** [)][ be the empirical risk of a parametric model, i.e., a neural]

network _f_ **w**, with minimizer **w** _m_ _[∗]_ _[∈]_ [arg min] **w** _∈_ R _[N]_ _[L][m]_ [(] **[w]** [)][.] [Throughout,] [subscripts] [denote] [per-]


3


sample quantities ( **g** _i_ := _∇ℓi_, **H** _i_ := _∇_ [2] _ℓi_ ), while parenthesized superscripts denote empirical
averages ( **g** [(] _[m]_ [)] := _∇Lm_ = _m_ [1] - _mi_ =1 **[g]** _[i]_ [,] **[ H]** [(] _[m]_ [)] [:=] _[ ∇]_ [2] _[L][m]_ [).] [Our object of interest is the one-sample]

increment field _Lk_ +1( **w** ) _−Lk_ ( **w** ), which measures how the empirical landscape changes when one
example is added. Since this increment is a scalar field over parameter space, any local notion of
stabilization depends both on what is aggregated and on how the field is probed.


**Unified family of stabilization criteria.** For _p ≥_ 1, we define a general criterion




     ∆ _p_ ( _k_ + 1) =

R _[N]_



_p_
�� _Lk_ +1( **w** ) _−Lk_ ( **w** )�� _q_ ( **w** ) _d_ **w** _,_ (1)



where _q_ is a probing distribution concentrated near **w** _k_ _[∗]_ [.] [This definition makes the probing law part of]
the criterion itself rather than part of the estimator. Previously studied criteria arise as special cases:
∆1( _k_ + 1) = �� _Lk_ +1( **w** _k∗_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)] �� _,_ _q_ = _δ_ **w** _k_ _[∗]_ _[,]_ (2)




     ∆2( _k_ + 1) =

R _[N]_




- _Lk_ +1( **w** ) _−Lk_ ( **w** )�2 _q_ ( **w** ) _d_ **w** _,_ _q_ = _N_ ( **w** _k_ _[∗][, σ]_ [2] **[I]** _[N]_ [)] _[.]_ (3)



**Curvature-aligned subspace probe.** In strongly anisotropic models, isotropic perturbations spread
mass across many directions that contribute little to the dominant local second-order structure [Sagun
et al., 2017, Ghorbani et al., 2019, Papyan, 2019, Gur-Ari et al., 2019]. We therefore align the
probe with the leading curvature directions at **w** _k_ _[∗]_ [.] [Let] **[ H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)] [=] **[UΛU]** _[⊤]_ [,] _[λ]_ [(] 1 _[k]_ [)] _≥· · ·_ _≥_ _λ_ [(] _N_ _[k]_ [)][,]
and let **U** _D_ = [ **u** 1 _, . . .,_ **u** _D_ ] denote the top- _D_ eigenvectors, with principal curvature subspace
_SD_ = Im( **U** _D_ ). We then define the _subspace mean-squared criterion_




      ∆ [(] 2 _[D]_ [)] ( _k_ + 1) =

**w** _k_ _[∗]_ [+] _[S][D]_




- _Lk_ +1( **w** ) _−Lk_ ( **w** )�2 _q_ ( **w** ) _d_ **w** _,_ (4)



with the parameterization **w** = **w** _k_ _[∗]_ [+] **[ U]** _[D]_ **[z]** [, where] **[ z]** _[∼N]_ [(] **[0]** _[, σ]_ [2] **[I]** _[D]_ [)][.] [The distinction between][ ∆][2]
and ∆ [(] 2 _[D]_ [)] is therefore not merely dimensional: ∆2 probes the increment isotropically in R _[N]_, whereas
∆ [(] 2 _[D]_ [)] probes it through the dominant local curvature modes of the empirical landscape.


**4** **Theoretical analysis**


Our central theoretical finding is that geometric compression is free in rate: under the local quadratic
model in Eqs. (6)–(8), the subspace criterion ∆ [(] 2 _[D]_ [)] preserves the _O_ ( _k_ _[−]_ [2] ) decay of the full-space
criterion while replacing ambient-dimension curvature dependence by dependence on the probing
dimension _D_ (Theorem 2). Within the eigenspace-aligned family, the top- _D_ choice is moreover
extremal among all _D_ -dimensional eigenspace-aligned probes (Proposition 3).


**Exact increment and local quadratic model.** Adding one training example to D _k_ gives the identity



1
_Lk_ +1( **w** ) _−Lk_ ( **w** ) =
_k_ + 1




- _ℓk_ +1( **w** ) _−Lk_ ( **w** ) _._ (5)



This factor ( _k_ + 1) _[−]_ [1] is the source of the _O_ ( _k_ _[−]_ [2] ) scaling for squared criteria. Fix **w** 0 _∈_ R _[N]_ and
assume that _Lk_ and _Lk_ +1 are twice continuously differentiable near **w** 0. Their second-order Taylor
expansions give



_Lm_ ( **w** ) _≈Lm_ ( **w** 0) + **g** [(] _[m]_ [)] ( **w** 0) _[⊤]_ ( **w** _−_ **w** 0) + [1]



(6)
2 [(] **[w]** _[ −]_ **[w]** [0][)] _[⊤]_ **[H]** [(] _[m]_ [)][(] **[w]** [0][)(] **[w]** _[ −]_ **[w]** [0][)] _[,]_



where **g** [(] _[m]_ [)] = _∇Lm_ and **H** [(] _[m]_ [)] = _∇_ [2] _Lm_ . Subtracting the two expansions yields a quadratic model
for the increment field:



_Lk_ +1( **w** ) _−Lk_ ( **w** ) _≈Lk_ +1( **w** 0) _−Lk_ ( **w** 0) +  - **g** [(] _[k]_ [+1)] ( **w** 0) _−_ **g** [(] _[k]_ [)] ( **w** 0)� _⊤_ ( **w** _−_ **w** 0)

+ [1] **H** [(] _[k]_ [+1)] ( **w** 0) _−_ **H** [(] _[k]_ [)] ( **w** 0)�( **w** _−_ **w** 0) _._ (7)

2 [(] **[w]** _[ −]_ **[w]** [0][)] _[⊤]_ [�]

We now set **w** 0 = **w** _k_ _[∗]_ [, where] **[ w]** _k_ _[∗]_ [is a local minimizer of] _[ L][k]_ [.] [Since] **[ g]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)] [=] **[0]** [, the increment]
simplifies to

_Lk_ +1( **w** ) _−Lk_ ( **w** ) _≈_ _ak_ + **g** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)] _[⊤]_ [(] **[w]** _[ −]_ **[w]** _k_ _[∗]_ [) +] [1] _k_ [)] _[⊤]_ **[A]** _[k]_ [(] **[w]** _[ −]_ **[w]** _k_ _[∗]_ [)] _[,]_ (8)

2 [(] **[w]** _[ −]_ **[w]** _[∗]_

where _ak_ = _Lk_ +1( **w** _k_ _[∗]_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)][,] **[ A]** _[k]_ [=] **[ H]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)] _[ −]_ **[H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)][.]


4


**Subspace reduction.** Restricting the probe to a _D_ -dimensional subspace turns the increment into a
low-dimensional quadratic form. In particular, for the principal curvature subspace _SD_ = Im( **U** _D_ )
with parameterization **w** = **w** _k_ _[∗]_ [+] **[ U]** _[D]_ **[z]** [, the criterion depends only on the compressed quantities]

**c** _k_ = **U** _[⊤]_ _D_ **[g]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)] _[,]_ **B** _k_ = **U** _[⊤]_ _D_ **[A]** _[k]_ **[U]** _[D][.]_


**Lemma 1 (Reduction on the principal curvature subspace)** _Suppose_ supp( _q_ ) _⊂_ ( **w** _k_ _[∗]_ [+] _[ S][D]_ [)] _[ ∩]_
_UR_ ( **w** _k_ _[∗]_ [)] _[.]_ _[Under the parameterization]_ **[ w]** [ =] **[ w]** _k_ _[∗]_ [+] **[ U]** _[D]_ **[z]** _[, the induced probing law]_ _[q]_ [˜] _[ on]_ [ R] _[D]_ _[satisfies]_




      ∆ [(] 2 _[D]_ [)] ( _k_ + 1) =

R _[D]_




- �2
_ak_ + **c** _[⊤]_ _k_ **[z]** [ +] [1] _q_ ˜( **z** ) _d_ **z** _._ (9)

2 **[z]** _[⊤]_ **[B]** _[k]_ **[z]**



The proof is given in Appendix A.


**Main rate result.** The main rate bound requires only local boundedness at the sequential minimizers.


**Assumption 1 (Uniform boundedness at sequential minimizers)** _There_ _exist_ _constants_
_Mℓ, M_ **g** _, M_ **H** _>_ 0 _, independent of k, such that for all k_ _≥_ 1 _and all i_ = 1 _, . . ., k_ + 1 _,_
_|ℓi_ ( **w** _k_ _[∗]_ [)] _[| ≤]_ _[M][ℓ][,]_ _∥_ **g** _k_ +1( **w** _k_ _[∗]_ [)] _[∥]_ [2] _[≤]_ _[M]_ **[g]** _[,]_ _∥_ **H** _i_ ( **w** _k_ _[∗]_ [)] _[∥]_ [2] _[≤]_ _[M]_ **[H]** _[.]_


This assumption is used in the proof of Theorem 2; see Appendix A.


**Theorem 2 (Subspace mean-squared rate)** _Suppose_ _Lemma_ _1_ _and_ _Assumption_ _1_ _hold,_ _and_ _let_
_q_ ˜( **z** ) = _N_ ( **0** _, σ_ [2] **I** _D_ ) _._ _Then_

_ℓ_ [+ 3] _[σ]_ [2] _[M]_ [ 2] **g** [+ 3] _[σ]_ [4][(] _[D]_ [2] [+ 2] _[D]_ [)] _[M]_ **H** [ 2]
∆ [(] 2 _[D]_ [)] ( _k_ + 1) _≤_ [12] _[M]_ [ 2] ( _k_ + 1) [2] = _O_ ( _k_ _[−]_ [2] ) _._ (10)


The proof is given in Appendix A. Theorem 2 is a no-rate-loss statement under geometric compression.
The criterion is evaluated on a _D_ -dimensional curvature-aligned probe rather than under isotropic
perturbations in R _[N]_, yet its mean-squared decay matches that of the full-space criterion.


**Spectral interpretation.** Under an additional stable-principal-directions regime, the compressed
Hessian difference **B** _k_ becomes diagonal in the principal basis, and the criterion admits a closed form
in terms of leading eigenvalue increments; see Corollary 4 in Appendix A.


**Extremality of the top-** _D_ **eigenspace.** The following proposition formalizes the sense in which
the top- _D_ choice is canonical within the eigenspace-aligned family.


**Proposition 3 (Extremality of the top-curvature subspace; informal)** _Assume_ _ak_ = 0 _,_ **c** _k_ = **0** _,_
_and_ _that_ **H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)] _[and]_ **[H]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)] _[share]_ _[a]_ _[common]_ _[eigenbasis]_ _[with]_ _[non-negative]_ _[eigenvalue]_
_increments._ _Then_ _among_ _all_ _D-dimensional_ _eigenspace-aligned_ _subspaces,_ _the_ _top-D_ _principal_
_curvature subspace maximizes the pure quadratic stabilization signal_ ∆ [quad] 2 _,I_ [(] _[k]_ [ + 1)] _[.]_


A precise statement and proof are given in Appendix A.2.


**5** **Algorithmic estimation at scale**


Lemma 1 and Eq. (9) show that, once the probe is restricted to the principal curvature subspace, the
criterion is determined by three compressed objects: the scalar value gap _ak_, the projected gradient
**c** _k_ _∈_ R _[D]_, and the compressed Hessian difference **B** _k_ _∈_ R _[D][×][D]_ . This leads to a simple estimator
taxonomy. One estimator targets the true criterion directly. Two cheaper estimators target its local
quadratic surrogate. All three share the same first step: construct the principal curvature subspace at
**w** _k_ _[∗]_ [.]


**Cost notation.** Let _C_ fwd( _m_ ) denote the cost of one forward evaluation of _Lm_ ( **w** ), _C_ bwd( _m_ ) the
cost of one backward pass, and _C_ HVP( _m_ ) the cost of one Hessian–vector product with **H** [(] _[m]_ [)] ( **w** ).
We write _S_ for the Monte Carlo sample count, _D_ for the subspace dimension, and _T_ eig for the number
of eigensolver iterations.


5


**Shared step:** **principal curvature subspace.** For each _k_, we compute the top- _D_ eigenvectors of
**H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)] [using] [deflated] [power] [iteration] [on] [Hessian–vector] [products;] [other] [HVP-based] [iterative]
eigensolvers such as Lanczos or LOBPCG apply identically. These follow the standard scalable
second-order toolkit initiated by Pearlmutter and used in modern Hessian-analysis frameworks such
as PyHessian [Pearlmutter, 1994, Yao et al., 2020]. If each iteration requires _O_ ( _D_ ) Hessian–vector
products, the one-time subspace construction cost is _O_ - _T_ eig _D C_ HVP( _k_ )�. This cost is shared by all
subspace-based estimators below.


**Direct Monte Carlo for the true criterion.** The most faithful estimator samples directly from the
subspace probe: **z** _s_ _∼N_ ( **0** _, σ_ [2] **I** _D_ ), **w** _s_ = **w** _k_ _[∗]_ [+] **[ U]** _[D]_ **[z]** _[s]_ [,] _[ s]_ [ = 1] _[, . . ., S]_ [.] [This gives]



∆� [(] 2 _[D]_ _,_ dir [)] [(] _[k]_ [ + 1) =] [1]

_S_



_S_
�� _Lk_ +1( **w** _s_ ) _−Lk_ ( **w** _s_ )�2 _._ (11)


_s_ =1



It estimates the true criterion ∆ [(] 2 _[D]_ [)] and does not rely on the quadratic approximation. Its postsubspace cost is _O_ - _S_ - _ND_ + _C_ fwd( _k_ ) + _C_ fwd( _k_ + 1)��, typically dominated by the two forward
evaluations per sample.


**Quadratic surrogate and its coefficients.** Under the local quadratic model from Section 4, the increment restricted to the principal curvature subspace is approximated by _ak_ + **c** _[⊤]_ _k_ **[z]** [+] [1] 2 **[z]** _[⊤]_ **[B]** _[k]_ **[z]** [, where]

_ak_ = _Lk_ +1( **w** _k_ _[∗]_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)][,] **[ c]** _[k]_ [=] **[ U]** _[⊤]_ _D_ **[g]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)][, and] **[ B]** _[k]_ [=] **[ U]** _[⊤]_ _D_ - **H** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)] _[ −]_ **[H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)] - **U** _D_ .
Assembling these coefficients requires one additional setup step with cost


_O_  - _C_ fwd( _k_ ) + _C_ fwd( _k_ + 1) + _C_ bwd( _k_ + 1) + _D_ ( _C_ HVP( _k_ ) + _C_ HVP( _k_ + 1)) + _ND_ [2][�] _._ (12)


**Quadratic Monte Carlo.** Replacing the true increment in (11) by the quadratic surrogate yields



�2
_,_ **z** _s_ _∼N_ ( **0** _, σ_ [2] **I** _D_ ) _._ (13)



∆� [(] 2 _[D]_ _,_ quadMC [)] [(] _[k]_ [ + 1) =] [1]

_S_



_S_



_s_ =1




- _ak_ + **c** _[⊤]_ _k_ **[z]** _[s]_ [+] [1] _s_ **[B]** _[k]_ **[z]** _[s]_

2 **[z]** _[⊤]_



After the coefficient setup in (12), its evaluation cost is _O_ ( _SD_ [2] ).


**Gaussian-moment estimator.** Because the surrogate is quadratic in **z** and the probe is Gaussian,
its expectation can be evaluated in closed form:



∆� [(] 2 _[D]_ _,_ GM [)] [(] _[k]_ [ + 1) =][ E] **[z]** _[∼N]_ [ (] **[0]** _[,σ]_ [2] **[I]** _D_ [)]


Using Gaussian moment identities yields



�� �2 [�]
_ak_ + **c** _[⊤]_ _k_ **[z]** [ +] [1]

2 **[z]** _[⊤]_ **[B]** _[k]_ **[z]**



_._ (14)



∆� [(] 2 _[D]_ _,_ GM [)] [(] _[k]_ [ + 1) =] _[ a]_ _k_ [2] [+] _[ a][k][σ]_ [2][ Tr(] **[B]** _[k]_ [) +] _[ σ]_ [2] _[∥]_ **[c]** _[k][∥]_ 2 [2] [+] _[σ]_ [4] �2 Tr( **B** [2] _k_ [) + Tr(] **[B]** _[k]_ [)][2][�] _._ (15)

4



After setup, this estimator costs _O_ ( _D_ [2] ).


**Summary.** The three estimators differ only in where they sit on the fidelity–efficiency spectrum.
Direct subspace Monte Carlo targets the true criterion and is therefore the reference estimator for
∆ [(] 2 _[D]_ [)] . Quadratic Monte Carlo and the Gaussian-moment estimator are much cheaper after setup, but
they target only the local quadratic surrogate. Their empirical comparison therefore tests two things
at once: computational savings and the practical validity of the quadratic approximation.


**6** **Experiments**


We evaluate four questions [1] : how the proposed criteria decay with effective sample size, when the
subspace criterion preserves the full-space mean-squared signal, for which perturbation scales the


1Code for reproducing all figures and tables is available at `[https://github.com/kisnikser/](https://github.com/kisnikser/curvature-subspace-landscape)`
`[curvature-subspace-landscape](https://github.com/kisnikser/curvature-subspace-landscape)` .


6


Table 2: Subspace-based estimators for ∆ [(] 2 _[D]_ [)] . All methods share the one-time subspace construction
cost _O_ ( _T_ eig _D C_ HVP( _k_ )). The most efficient one is Gaussian-moment (GM) estimator.


**Estimator** **Target** **One-time setup** **Evaluation cost**


Direct MC true ∆ [(] 2 _[D]_ [)] none _O_   - _S_   - _ND_ + _C_ fwd( _k_ ) + _C_ fwd( _k_ + 1)��

Quadratic MC quadratic surrogate Eq. (12) _O_ ( _SD_ [2] )

GM quadratic surrogate Eq. (12) _O_ ( _D_ [2] )


quadratic proxy is accurate, and how the three estimators trade fidelity against efficiency. Surprisingly,
we observe that (i) a curvature-aligned probe occupying less than one part in a million of parameter
space ( _D/N_ _<_ 10 _[−]_ [6] ) already reproduces the full-space mean-squared signal to within numerical
noise throughout the validated local regime, and (ii) once the subspace has been constructed, the
closed-form Gaussian-moment estimator is roughly 18 _,_ 000 _×_ faster than direct Monte Carlo without
measurable loss of fidelity.


**Setup.** All experiments use the `nanochat` depth-6 model (tag `d6` ), a 107M-parameter decoderonly transformer with rotary position embeddings, grouped-query attention, ReLU activations, and
RMSNorm without learnable parameters, evaluated at training step 3500. We use this model because
it is small enough to make repeated full-model Hessian–vector products tractable in float32 precision
while still retaining nontrivial second-order structure. Autocast is disabled throughout, and we use the
SDPA math kernel for numerical stability. Throughout this section, _k_ denotes the number of training
sequences defining _Lk_ . Unless stated otherwise, we define _Lk_ and _Lk_ +1 from _k_ = 8 sequences
and construct the principal curvature subspace at **w** _k_ _[∗]_ [by deflated power iteration on Hessian–vector]
products; other HVP-based iterative eigensolvers such as Lanczos or LOBPCG apply identically.



**Criterion decay under sample growth.** We
first test whether the criteria from Sections 3–4
exhibit the predicted stabilization trend as the
effective sample size grows. To do so, we evaluate the pointwise criterion ∆1, the isotropic
mean-squared criterion ∆2, and the curvatureaware subspace criterion ∆ [(] 2 _[D]_ [)] across a range of
sample sizes _k_ .



10 1


10 3


10 5


10 7


10 9


10 11



















Figure 2 shows that all criteria decrease with _k_,

|Col1|Col2|Col3|1<br>2,<br>2,<br>2,<br>(21 ),<br>(21 ),<br>(21 ),<br>(24 ),|= 1e 4<br>= 1e 3<br>= 0.01<br>= 1e 4 (GM)<br>= 1e 3 (GM)<br>= 0.01 (GM)<br>= 1e 4 (GM)|(24 ), = 1e 3 (G<br>(24 ), = 0.01 (GM<br>(216), = 1e 4 (G<br>(216), = 1e 3 (G<br>(21 k6), = 0.01 (GM<br>1<br>k2|M)<br>)<br>M)<br>M)<br>)|
|---|---|---|---|---|---|---|
||||||||

but at different rates. The pointwise criterion 0 2000 k
decays more slowly, whereas the mean-squared
criteria are orders of magnitude smaller and fol
Figure 2: **Decay** **of**

low the steeper trend suggested by the quadratic

**sample size.**

scaling argument. The subspace criteria remain

functions of _k_ .

close in scale to the full-space mean-squared
criterion while restricting the probe to a much smaller set of directions.



0 2000 4000 6000 8000 10000
k (sequences consumed in training)



Figure 2: **Decay** **of** **stabilization** **criteria** **with**
**sample size.** Comparison of ∆1, ∆2, and ∆ [(] 2 _[D]_ [)] as
functions of _k_ .



103


102


101


100


10 1


10 2






|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||||||||
|||||||||
|||||||||
||||||= 1<br>D = 1, <br>= 1e<br>4<br>~~D = 4, ~~<br>~~= 1e~~<br>~~4~~|D = 1, <br>= 0.01<br>D = 4, <br>= 0.01<br>~~D = 16, ~~<br>~~= 0.01~~||
||||||<br> <br><br>D = 16, <br>= 1e<br>4<br>D = 1, <br>= 1e<br>3<br>D = 4, <br>= 1e<br>3|<br> <br>= 10<br>4 hues (pro<br>= 10<br>3 hues (pro<br> <br>2|xy)<br>  xy)<br>|



0 2000 4000 6000 8000 10000
k (sequences consumed in training)


Figure 3: **Subspace criterion relative to the full-**
**space** **criterion.** Ratio ∆ [(] 2 _[D]_ [)] _/_ ∆2 across sample
size _k_, for several dimensions _D_ and scales _σ_ .


7



**Subspace** **versus** **full-space** **criterion.** We
next test whether the curvature-aligned subspace
criterion preserves the full-space mean-squared
signal. For several values of _D_ and _σ_, we track
the ratio ∆ [(] 2 _[D]_ [)] _/_ ∆2 as a function of _k_ .


Figure 3 reveals a clear regime split. For _σ_ =
10 _[−]_ [4] and _σ_ = 10 _[−]_ [3], the ratio stays close to
1 across the full range of _k_, indicating that
curvature-aligned probing preserves essentially
the same stabilization signal as the full-space
criterion. For _σ_ = 10 _[−]_ [2], the ratio departs
strongly from 1, becomes much more variable,
and depends clearly on subspace dimension,


Table 3: Wall-clock times (seconds; mean _±_ sample standard deviation over five seeds) for the
three estimators of ∆ [(] 2 _[D]_ [)] on the nanochat `d6` model ( _D_ = 45, step 3500). Stage I: top- _D_ Hessian
eigenvectors (shared). Stage II: gradient and compressed Hessian assembly (proxy estimators only).
Stage III: criterion evaluation.


**Estimator** **Stage I (s)** **Stage II (s)** **Stage III (s)**


Direct MC 17 _._ 53 _±_ 0 _._ 53        - 2 _._ 197 _±_ 0 _._ 013
Quadratic MC 17 _._ 53 _±_ 0 _._ 53 1 _._ 777 _±_ 0 _._ 014 (3 _._ 68 _±_ 0 _._ 05) _×_ 10 _[−]_ [3]

GM 17 _._ 53 _±_ 0 _._ 53 1 _._ 777 _±_ 0 _._ 014 (1 _._ 22 _±_ 0 _._ 03) _×_ 10 _[−]_ [4]


with larger _D_ producing systematically larger values. This behavior is consistent with leaving
the local regime in which subspace compression remains faithful to the full-space observable.


**Quadratic** **proxy** **validity.** The theory and the proxy estimators of Section 5 rely on the local
quadratic model in Eqs. (6)–(8). Before using these estimators, we therefore identify the perturbation
scales for which the approximation is accurate. For a fixed checkpoint **w** _k_ _[∗]_ [, we draw isotropic Gaussian]
perturbations _**δ**_ _∼N_ ( **0** _, σ_ [2] **I** _N_ ) and compare the true local loss increment _Lk_ ( **w** _k_ _[∗]_ [+] _**[ δ]**_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)][ to]
its second-order Taylor approximation **g** [(] _[k]_ [)] _[⊤]_ _**δ**_ + [1] 2 _**[δ]**_ _[⊤]_ **[H]** [(] _[k]_ [)] _**[δ]**_ [.]



Figure 4 shows a clear local regime: the approximation error remains low and nearly flat
up to about _σ_ _≈_ 10 _[−]_ [3], and then rises sharply
for larger perturbations. We therefore restrict
the proxy-based estimators to _σ_ _≤_ 10 _[−]_ [3] in the
remaining experiments.


**Estimator fidelity and computational trade-**
**offs.** We finally compare the three estimators from Section 5: direct subspace Monte
Carlo, quadratic Monte Carlo, and the Gaussianmoment (GM) estimator. Direct MC targets the
true criterion ∆ [(] 2 _[D]_ [)], whereas Quadratic MC and
GM target its local quadratic surrogate.


Figure 5 shows that both Monte Carlo estimators
converge toward the GM value as _S_ increases.
Figure 6 shows that the discrepancy between
Direct MC and GM stays small throughout the
validated local regime, but grows at the largest
tested perturbation scale.



101


100


10 1


10 2


10 3




|Col1|mean<br>±1 std|Col3|Col4|Col5|Col6|Col7|
|---|---|---|---|---|---|---|
||||||||
||||||||
||||||||
||||||||
||||||||



10 7 10 6 10 5 10 4 10 3 10 2 10 1

Isotropic Gaussian scale


Figure 4: Relative error of the quadratic Taylor
approximation versus perturbation scale _σ_ (mean
and standard deviation across seeds, nanochat `d6`,
step 3500).



0.0015675


0.0015650


0.0015625


0.0015600


0.0015575


0.0015550




|Col1|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
||||||
||~~D~~|~~D~~|||
||~~D~~|~~D~~|~~rect MC~~||
|||<br>Q<br>~~G~~|<br>uadratic MC<br>~~ussian mome~~|~~ t (closed form)~~|
||||||
||||||
||||||
||||||
||||||



23 24 25 26

MC sample count S


Figure 5: Convergence of Direct MC
and Quadratic MC estimates of ∆ [�] [(] 2 _[D]_ [)] to
the Gaussian-moment closed form as the
sample count _S_ increases, at _D_ = 10
and _σ_ = 10 _[−]_ [3] .



Table 3 shows that the shared subspace-construction stage
dominates the total runtime. Once that cost has been paid,
GM is by far the cheapest estimator: its evaluation stage
is about 18 _,_ 000 _×_ faster than Direct MC. Taken together,
these results suggest a simple practical picture: Direct MC
is the reference estimator for the true criterion, but in the
validated local regime the GM proxy provides nearly the
same signal at negligible additional cost.


**7** **Limitations**


Our analysis is inherently local. The main theoretical result is derived under a second-order approximation of the
increment field near a trained solution **w** _k_ _[∗]_ [, so its interpre-]
tation is restricted to perturbation regimes in which that
approximation is accurate. Accordingly, the proxy estimators from Section 5 should be viewed as local surrogates
rather than globally faithful approximations. Theorem 2


8


is a one-sided rate statement: it certifies that geometric compression preserves the _O_ ( _k_ _[−]_ [2] ) decay,
but we do not claim tightness of the ( _k_ + 1) _[−]_ [2] bound or of its _σ_ [4] ( _D_ [2] + 2 _D_ ) dependence, and the
constant carries a _D_ [2] term that trades against the ambient-dimension factor only for moderate _D_ .



The top- _D_ principal-curvature subspace
is motivated by empirical anisotropy and
supported by Proposition 3, but this extremality result holds only in an idealized
simultaneously-diagonalizable quadratic
regime. More general non-quadratic or
rapidly drifting regimes may favor adaptive subspaces, and Assumption 1 is itself
a local statement whose plausibility near
sequential minimizers we do not prove beyond boundedness.



10 7



10 2


10 3


10 4


10 5


10 6



0 5 10 15 20 25 30

We focus on a 107M-parameter decoder
Subspace dimension D

only transformer because repeated fullmodel second-order computations are still
feasible in float32. Additional ablations on Figure 6: Relative error _|_ ∆ [�] direct _−_ GM _|/_ ( _|_ ∆ [�] direct _|_ + _ε_ )
other architectures and sizes showed a sim- over subspace dimension _D_ and perturbation scale _σ_ .
ilar qualitative picture, but are omitted for
brevity. This scope does not guarantee that the same geometric effects or computational trade-offs
transfer unchanged to much larger models or different training regimes. Finally, although Hessian–
vector products and iterative eigensolvers are far cheaper than explicit Hessian construction, they still
add nontrivial overhead, with subspace construction dominating the cost in our setting.



0 5 10 15 20 25 30
Subspace dimension D



0.035


0.030


0.025


0.020


0.015


0.010


0.005


0.000



Figure 6: Relative error _|_ ∆ [�] direct _−_ GM _|/_ ( _|_ ∆ [�] direct _|_ + _ε_ )
over subspace dimension _D_ and perturbation scale _σ_ .



**8** **Discussion**


Our main claim is conceptual as much as technical: under sample growth, stabilization depends not
only on which functional of the increment field is aggregated, but also on how the field is probed.
The proposed criterion is therefore not just a lower-dimensional version of an existing mean-squared
observable; it makes the probing law explicit and aligns it with the anisotropic local geometry of the
empirical landscape.

Within the local quadratic regime, this geometric restriction preserves the canonical _O_ ( _k_ _[−]_ [2] ) meansquared decay while replacing ambient-dimension curvature dependence by dependence on the
probing dimension _D_ . Empirically, the subspace criterion tracks the full-space mean-squared signal
throughout the validated local regime, and the Gaussian-moment proxy reproduces the same signal
much faster than direct Monte Carlo once the subspace is available.


More broadly, curvature-aligned probing is one instance of a larger family of geometry-aware local
observables. If stabilization is viewed as an observational problem, other structured probing laws
may reveal aspects of landscape deformation under data growth that curvature alone does not capture.
For example, data-dependent subspaces spanned by gradients of influential examples fit the same
framework and suggest a broader class of geometry- and data-aware observables compatible with the
estimator machinery developed here.


**9** **Conclusion**


We introduced a unified view of local loss-landscape stabilization and proposed a curvature-aligned
subspace criterion based on the top- _D_ Hessian eigenspace near a trained solution. Under a local
quadratic model, this criterion preserves the full-space mean-squared _O_ ( _k_ _[−]_ [2] ) rate with dependence
on the probing dimension _D_, and admits scalable estimators that are efficient in the valid local regime.
This enables a concrete quantitative question—how much of one-sample landscape deformation
is concentrated in the dominant curvature modes—to be answered with a closed-form observable.
We do not claim that the top- _D_ eigenspace is universally optimal beyond the eigenspace-aligned
quadratic regime, nor that a single _O_ ( _k_ _[−]_ [2] ) bound settles the sample-growth behavior of modern
training pipelines; both are natural directions for future work.


9


**References**


N. S. Kiselev and A. V. Grabovoy. Unraveling the Hessian: A Key to Smooth Convergence in Loss
Function Landscapes. _Doklady Mathematics_, 110(1):S49–S61, December 2024. ISSN 1531-8362.
doi: 10.1134/S1064562424601987. URL `[https://doi.org/10.1134/S1064562424601987](https://doi.org/10.1134/S1064562424601987)` .


Hao Li, Zheng Xu, Gavin Taylor, Christoph Studer, and Tom Goldstein. Visualizing the loss landscape of neural nets. In _Advances_ _in_ _Neural_ _Information_ _Pro-_
_cessing_ _Systems_, 2018a. URL `[https://proceedings.neurips.cc/paper/2018/hash/](https://proceedings.neurips.cc/paper/2018/hash/a41b3bb3e6b050b6c9067c67f663b915-Abstract.html)`
`[a41b3bb3e6b050b6c9067c67f663b915-Abstract.html](https://proceedings.neurips.cc/paper/2018/hash/a41b3bb3e6b050b6c9067c67f663b915-Abstract.html)` .


Levent Sagun, Utku Evci, Vincent Ugur Guney, Yann Dauphin, and Léon Bottou. Empirical analysis
of the hessian of over-parametrized neural networks, 2017.


Behrooz Ghorbani, Shankar Krishnan, and Ying Xiao. An investigation into neural net optimization
via hessian analysis, 2019.


Vardan Papyan. The full spectrum of deepnet hessians at scale: Dynamics with SGD training and
sample size, 2019.


Yichu Xu, Xin-Chun Li, Lan Li, and De-Chuan Zhan. Visualizing, rethinking, and mining the loss
landscape of deep neural networks, 2024.


Guy Gur-Ari, Daniel A. Roberts, and Ethan Dyer. Gradient descent happens in a tiny subspace. In
_International Conference on Learning Representations_, 2019.


Chunyuan Li, Heerad Farkhoor, Rosanne Liu, and Jason Yosinski. Measuring the intrinsic dimension
of objective landscapes. In _International Conference on Learning Representations_, 2018b.


Berfin Simsek, François Ged, Arthur Jacot, Francesco Spadaro, Clement Hongler, Wulfram Gerstner,
and Johanni Brea. Geometry of the loss landscape in overparameterized neural networks: Symmetries and invariances. In _Proceedings of the 38th International Conference on Machine Learning_,
volume 139 of _Proceedings of Machine Learning Research_, pages 9722–9732, 2021.


Felix Draxler, Kambis Veschgini, Manfred Salmhofer, and Fred A. Hamprecht. Essentially no
barriers in neural network energy landscape. In _Proceedings of the 35th International Conference_
_on Machine Learning_, volume 80 of _Proceedings of Machine Learning Research_, pages 1309–1318,
2018.


Timur Garipov, Pavel Izmailov, Dmitrii Podoprikhin, Dmitry P. Vetrov, and Andrew Gordon Wilson.
Loss surfaces, mode connectivity, and fast ensembling of dnns. In _Advances in Neural Information_
_Processing Systems_, volume 31, 2018.


Vladimir N. Vapnik. _Statistical Learning Theory_ . Wiley, 1998.


Shai Shalev-Shwartz and Shai Ben-David. _Understanding_ _Machine_ _Learning:_ _From_ _Theory_ _to_
_Algorithms_ . Cambridge University Press, 2014.


Olivier Bousquet and André Elisseeff. Stability and generalization. _Journal of Machine Learning_
_Research_, 2:499–526, 2002.


Moritz Hardt, Benjamin Recht, and Yoram Singer. Train faster, generalize better: Stability of
stochastic gradient descent. In _Proceedings_ _of_ _the_ _33rd_ _International_ _Conference_ _on_ _Machine_
_Learning_, volume 48 of _Proceedings of Machine Learning Research_, pages 1225–1234. PMLR,
2016. URL `[https://proceedings.mlr.press/v48/hardt16.html](https://proceedings.mlr.press/v48/hardt16.html)` .


Olivier Bousquet, Yegor Klochkov, and Nikita Zhivotovskiy. Sharper bounds for uniformly stable
algorithms. In _Proceedings of the Thirty Third Conference on Learning Theory_, volume 125 of
_Proceedings of Machine Learning Research_, pages 125–135. PMLR, 2020.


Pang Wei Koh and Percy Liang. Understanding black-box predictions via influence functions. In
_Proceedings of the 34th International Conference on Machine Learning_, volume 70 of _Proceedings_
_of Machine Learning Research_, pages 1885–1894, 2017.


10


Ryan Giordano, Tamara Broderick, and Michael I. Jordan. A swiss army infinitesimal jackknife. In
_Proceedings of Machine Learning Research_, volume 89, pages 1139–1147, 2019.


Pang Wei Koh, Kai-Siang Ang, Hubert H. K. Teo, and Percy Liang. On the accuracy of influence
functions for measuring group effects. In _Advances in Neural Information Processing Systems_,
volume 32, 2019.


Samyadeep Basu, Xuchen You, and Soheil Feizi. On second-order group influence functions for blackbox predictions. In _Proceedings of the 23rd International Conference on Artificial Intelligence and_
_Statistics_, volume 108 of _Proceedings of Machine Learning Research_, pages 2582–2591, 2020.


Vitaly Feldman and Jan Vondrák. High probability generalization bounds for uniformly stable
algorithms with applications. In _Proceedings of the Thirty-Second Conference on Learning Theory_,
volume 99 of _Proceedings of Machine Learning Research_, pages 1330–1349. PMLR, 2019.


Nitish Shirish Keskar, Dheevatsa Mudigere, Jorge Nocedal, Mikhail Smelyanskiy, and Ping Tak Peter
Tang. On large-batch training for deep learning: Generalization gap and sharp minima. In
_International Conference on Learning Representations_, 2017.


Laurent Dinh, Razvan Pascanu, Samy Bengio, and Yoshua Bengio. Sharp minima can generalize for
deep nets. In _International Conference on Machine Learning_, 2017.


Pierre Foret, Ariel Kleiner, Hossein Mobahi, and Behnam Neyshabur. Sharpness-aware minimization
for efficiently improving generalization. In _International Conference on Learning Representations_,
2021.


Yann N. Dauphin, Atish Agarwala, and Hossein Mobahi. Neglected Hessian component explains
mysteries in sharpness regularization. In _Advances in Neural Information Processing Systems_,
2024.


Haocheng Luo, Tuan Truong, Tung Pham, Mehrtash Harandi, Dinh Phung, and Trung Le. Explicit eigenvalue regularization improves sharpness-aware minimization. In _Advances in Neural_
_Information Processing Systems_, 2024.


Sidak Pal Singh, Gregor Bachmann, and Thomas Hofmann. Analytic insights into structure and
rank of neural network hessian maps. In _Advances in Neural Information Processing Systems_,
volume 34, 2021.


Yikai Wu, Xingyu Zhu, Chenwei Wu, Annie Wang, and Rong Ge. Dissecting hessian: Understanding
common structure of hessian in neural networks. _arXiv preprint arXiv:2010.04261_, 2020.


Barak A. Pearlmutter. Fast exact multiplication by the Hessian. _Neural Computation_, 6(1):147–160,
1994.


Zhewei Yao, Amir Gholami, Kurt Keutzer, and Michael W. Mahoney. PyHessian: Neural networks
through the lens of the Hessian. In _2020_ _IEEE_ _International_ _Conference_ _on_ _Big_ _Data_, pages
581–590, 2020. doi: 10.1109/BigData50022.2020.9378171.


**A** **Proofs**


**A.1** **Spectral interpretation under stable principal directions**


The rate bound in Theorem 2 does not require any alignment between the eigenspaces of **H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)]
and **H** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)][.] [For interpretation,] [it is useful to isolate a more structured regime in which the]
leading curvature directions remain stable across the one-sample increment.


**Assumption 2 (Stable principal directions)** _The eigenvectors_ **u** 1 _, . . .,_ **u** _D_ _associated with the D_
_largest eigenvalues of_ **H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)] _[ are also eigenvectors of]_ **[ H]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)] _[:]_


**H** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)] **[ u]** _[i]_ [=] _[ λ]_ [(] _i_ _[k]_ [+1)] **u** _i,_ _i_ = 1 _, . . ., D._


11


Under Assumption 2,


**B** _k_ = diag� _λ_ [(] 1 _[k]_ [+1)] _−_ _λ_ [(] 1 _[k]_ [)] _[, . . ., λ]_ _D_ [(] _[k]_ [+1)] _−_ _λ_ [(] _D_ _[k]_ [)]       - _,_


so the compressed Hessian difference becomes diagonal in the principal basis.


**Corollary 4 (Spectral closed form under vanishing value and linear terms)** _Suppose_ _Assump-_
_tion 2 holds,_ _q_ ˜( **z** ) = _N_ ( **0** _, σ_ [2] **I** _D_ ) _, and ak_ = 0 _,_ **c** _k_ = **0** _._ _Then_



_D_
�( _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] ) [2] +

_i_ =1



�2 []



 _._ (16)




- _D_

 


�( _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] )

_i_ =1



∆ [(] 2 _[D]_ [)] ( _k_ + 1) = _[σ]_ 4 [4]






2



Corollary 4 isolates the pure quadratic regime. The assumptions _ak_ = 0 and **c** _k_ = **0** are idealizations,
but they become increasingly natural when the value gap is small and **w** _k_ _[∗]_ [lies close to a minimizer]
of _Lk_ +1 as well. In that regime, the criterion becomes a direct function of the leading eigenvalue
increments.


**A.2** **Lemma:** **Extremality of the top-curvature subspace**


**Lemma 5 (Extremality of the top-curvature subspace)** _Assume_ _that_ _ak_ = 0 _,_ **c** _k_ = **0** _._ _Suppose_
_that_ **H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)] _[ and]_ **[H]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)] _[ are simultaneously diagonalizable with a common orthonormal]_
_eigenbasis {_ **u** _i}_ _[N]_ _i_ =1 _[, and let][ δ][i]_ [=] _[ λ]_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] _, i_ = 1 _, . . ., N_ _._ _Assume further that δ_ 1 _≥_ _δ_ 2 _≥· · · ≥_
_δN_ _≥_ 0 _._ _For any index set I_ _⊂{_ 1 _, . . ., N_ _} with |I|_ = _D, let SI_ = span _{_ **u** _i_ : _i ∈_ _I}, and define the_
_corresponding quadratic subspace criterion by restricting_ (4) _to_ **w** _k_ _[∗]_ [+] _[ S][I]_ _[under the local quadratic]_
_model, with Gaussian coordinates_ **z** _∼N_ ( **0** _, σ_ [2] **I** _D_ ) _._ _Then_



�2 []

 _,_ (17)



∆ [quad] 2 _,I_ [(] _[k]_ [ + 1) =] _[σ]_ [4]

4





2 - _δi_ [2] [+]

_i∈I_



��

_δi_

_i∈I_



_and the maximum over all index sets I_ _with |I|_ = _D is attained at I_ _[∗]_ = _{_ 1 _, . . ., D}._ _Equivalently,_
_the_ _top-D_ _eigenspace_ _of_ **H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)] _[maximizes]_ _[the]_ _[pure]_ _[quadratic]_ _[stabilization]_ _[signal]_ _[within]_ _[the]_
_eigenspace-aligned family._


Under the simultaneous diagonalizability assumption, **B** _k_ = diag( _δ_ 1 _, . . ., δN_ ) restricted to _SI_ gives
**B** _k,I_ = diag( _δi_ : _i_ _∈_ _I_ ). With _ak_ = 0, **c** _k_ = **0**, Lemma 1 and the Gaussian moment identities of
Theorem 2 yield (17). The function



�2



_f_ ( _I_ ) = 2 - _δi_ [2] [+]

_i∈I_



��

_δi_

_i∈I_



is maximized by choosing the _D_ largest _δi_ values, i.e., _I_ _[∗]_ = _{_ 1 _, . . ., D}_, since all terms are nonnegative and _δ_ 1 _≥· · · ≥_ _δN_ _≥_ 0.


**A.3** **Proof of Lemma 1**


Since the columns of **U** _D_ _∈_ R _[N]_ _[×][D]_ are orthonormal, every point of **w** _k_ _[∗]_ [+] _[ S][D]_ [has a unique represen-]
tation
**w** = **w** _k_ _[∗]_ [+] **[ U]** _[D]_ **[z]** _[,]_ **z** _∈_ R _[D]_ _._

Substituting into the local quadratic model (8) and using **g** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [) =] **[ 0]** [ gives]

_Lk_ +1( **w** ) _−Lk_ ( **w** ) = _ak_ + **g** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)] _[⊤]_ **[U]** _[D]_ **[z]** [ +] [1]

2 [(] **[U]** _[D]_ **[z]** [)] _[⊤]_ **[A]** _[k]_ [(] **[U]** _[D]_ **[z]** [)]

= _ak_ + **c** _[⊤]_ _k_ **[z]** [ +] [1]

2 **[z]** _[⊤]_ **[B]** _[k]_ **[z]** _[.]_

Under the parameterization **w** = **w** _k_ _[∗]_ [+] **[ U]** _[D]_ **[z]** [, the density] _[ q]_ [ supported on] **[ w]** _k_ _[∗]_ [+] _[ S][D]_ [induces a density]
_q_ ˜ on R _[D]_ . Integrating yields (9).


12


**A.4** **Proof of Theorem 2**


By Lemma 1,


∆ [(] 2 _[D]_ [)] ( _k_ + 1) = E _q_ ˜( **z** )



�� �2 [�]
_ak_ + **c** _[⊤]_ _k_ **[z]** [ +] [1]

2 **[z]** _[⊤]_ **[B]** _[k]_ **[z]**



_,_ **z** _∼N_ ( **0** _, σ_ [2] **I** _D_ ) _._



For any _x, y, z_ _∈_ R,
( _x_ + _y_ + _z_ ) [2] _≤_ 3( _x_ [2] + _y_ [2] + _z_ [2] ) _,_

hence
∆ [(] 2 _[D]_ [)] ( _k_ + 1) _≤_ 3 _a_ [2] _k_ [+ 3][ E] �( **c** _[⊤]_ _k_ **[z]** [)][2][�] + 4 [3] [E] �( **z** _[⊤]_ **B** _k_ **z** ) [2][�] _._ (18)



**Zero-order term.** Using (5) at **w** _k_ _[∗]_ [,]


1
_ak_ = _Lk_ +1( **w** _k_ _[∗]_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [) =]
_k_ + 1




- _ℓk_ +1( **w** _k_ _[∗]_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)] _._



Therefore
1
_|ak| ≤_
_k_ + 1

Moreover,




- _|ℓk_ +1( **w** _k_ _[∗]_ [)] _[|]_ [ +] _[ |L][k]_ [(] **[w]** _k_ _[∗]_ [)] _[|]_ _._




- _ℓi_ ( **w** _k_ _[∗]_ [)]


_i_ =1



_k_

- _|ℓi_ ( **w** _k_ _[∗]_ [)] _[| ≤]_ _[M][ℓ][,]_


_i_ =1



1
_≤_
_k_
�����



_|Lk_ ( **w** _k_ _[∗]_ [)] _[|]_ [ =]


and also _|ℓk_ +1( **w** _k_ _[∗]_ [)] _[| ≤]_ _[M][ℓ]_ [.] [Hence]



1

_k_
�����



_k_




_|ak| ≤_ _k_ [2] + 1 _[M][ℓ]_ _[,]_ _a_ [2] _k_ _[≤]_ ( _k_ 4 + 1) _Mℓ_ [2] [2] _[.]_ (19)



**Linear term.** Since **g** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [) =] **[ 0]** [,]


1
**b** _k_ = **g** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [) =] _k_ [)] _[,]_ **c** _k_ = **U** _[⊤]_ _D_ **[b]** _[k][.]_
_k_ + 1 **[g]** _[k]_ [+1][(] **[w]** _[∗]_


Because **U** _D_ has orthonormal columns,



For **z** _∼N_ ( **0** _, σ_ [2] **I** _D_ ),



_∥_ **c** _k∥_ 2 _≤∥_ **U** _[⊤]_ _D_ _[∥]_ [2] _[∥]_ **[b]** _[k][∥]_ [2] _[≤]_ _[M]_ **[g]**

_k_ + 1 _[.]_


E�( **c** _[⊤]_ _k_ **[z]** [)][2][�] = **c** _[⊤]_ _k_ [E][[] **[zz]** _[⊤]_ []] **[c]** _[k]_ [=] _[ σ]_ [2] _[∥]_ **[c]** _[k][∥]_ [2] 2 _[≤]_ ( _kσ_ + 1) [2] _M_ **g** [2][2] _[.]_ (20)



**Quadratic term.** The matrix **B** _k_ is symmetric. For **z** _∼N_ ( **0** _, σ_ [2] **I** _D_ ),

E�( **z** _[⊤]_ **B** _k_ **z** ) [2][�] = 2 _σ_ [4] Tr( **B** [2] _k_ [) +] _[ σ]_ [4][ Tr(] **[B]** _[k]_ [)][2] _[.]_ (21)


For symmetric **B** _k_,
Tr( **B** [2] _k_ [)] _[ ≤]_ _[D][∥]_ **[B]** _[k][∥]_ [2] 2 _[,]_ _|_ Tr( **B** _k_ ) _| ≤_ _D∥_ **B** _k∥_ 2 _,_
so
E�( **z** _[⊤]_ **B** _k_ **z** ) [2][�] _≤_ _σ_ [4] ( _D_ [2] + 2 _D_ ) _∥_ **B** _k∥_ [2] 2 _[.]_ (22)


Next,
_∥_ **B** _k∥_ 2 = _∥_ **U** _[⊤]_ _D_ **[A]** _[k]_ **[U]** _[D][∥]_ [2] _[≤∥]_ **[U]** _[⊤]_ _D_ _[∥]_ [2] _[∥]_ **[A]** _[k][∥]_ [2] _[∥]_ **[U]** _[D][∥]_ [2] _[≤∥]_ **[A]** _[k][∥]_ [2] _[.]_
Using



**H** [(] _[m]_ [)] ( **w** _k_ _[∗]_ [) =] [1]

_m_



_m_

- **H** _i_ ( **w** _k_ _[∗]_ [)] _[,]_


_i_ =1



we obtain



**A** _k_ = **H** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)] _[ −]_ **[H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)]


13


1
=
_k_ + 1


1
=
_k_ + 1



_k_ +1





- **H** _i_ ( **w** _k_ _[∗]_ [)] _[ −]_ [1]

_k_

_i_ =1



_k_



_k_

- **H** _i_ ( **w** _k_ _[∗]_ [)]


_i_ =1




- **H** _k_ +1( **w** _k_ _[∗]_ [)] _[ −]_ **[H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)] _._



Hence


and therefore



_∥_ **B** _k∥_ 2 _≤_ [2] _[M]_ **[H]** E�( **z** _[⊤]_ **B** _k_ **z** ) [2][�] _≤_ [4] _[σ]_ [4][(] _[D]_ [2][ + 2] _[D]_ [)] _[M]_ **H** [ 2] _._ (23)

_k_ + 1 _[,]_ ( _k_ + 1) [2]



1
_∥_ **A** _k∥_ 2 _≤_
_k_ + 1




- _∥_ **H** _k_ +1( **w** _k_ _[∗]_ [)] _[∥]_ [2] [+] _[ ∥]_ **[H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [)] _[∥]_ [2] _≤_ [2] _[M]_ **[H]**

_k_ + 1 _[,]_



**Conclusion.** Substituting (19), (20), and (23) into (18), we obtain


_ℓ_ [+ 3] _[σ]_ [2] _[M]_ [ 2] **g** [+ 3] _[σ]_ [4][(] _[D]_ [2] [+ 2] _[D]_ [)] _[M]_ **H** [ 2]
∆ [(] 2 _[D]_ [)] ( _k_ + 1) _≤_ [12] _[M]_ [ 2] ( _k_ + 1) [2] _,_


which is exactly (10).


**A.5** **Proof of Corollary 4**


Under the assumptions _ak_ = 0 and **c** _k_ = **0**, Lemma 1 gives

∆ [(] 2 _[D]_ [)] ( _k_ + 1) = [1] 4 [E] �( **z** _[⊤]_ **B** _k_ **z** ) [2][�] _,_ **z** _∼N_ ( **0** _, σ_ [2] **I** _D_ ) _._


Using (21),
E�( **z** _[⊤]_ **B** _k_ **z** ) [2][�] = 2 _σ_ [4] Tr( **B** [2] _k_ [) +] _[ σ]_ [4][ Tr(] **[B]** _[k]_ [)][2] _[.]_


Under Assumption 2,


**B** _k_ = diag� _λ_ [(] 1 _[k]_ [+1)] _−_ _λ_ [(] 1 _[k]_ [)] _[, . . ., λ]_ _D_ [(] _[k]_ [+1)] _−_ _λ_ [(] _D_ _[k]_ [)]       - _._


Therefore,



_D_
�� _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] �2 _._

_i_ =1



Tr( **B** _k_ ) =



_D_
�� _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] - _,_ Tr( **B** [2] _k_ [) =]

_i_ =1



Substituting these identities into the previous display yields



_D_
�( _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] ) [2] +

_i_ =1



�2 []



 _,_




- _D_

 


�( _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] )

_i_ =1



∆ [(] 2 _[D]_ [)] ( _k_ + 1) = _[σ]_ 4 [4]






2



_D_




which is exactly (16).


**A.6** **Proof of Lemma 5**


Fix an index set _I_ _⊂{_ 1 _, . . ., N_ _}_ with _|I|_ = _D_ and consider the eigenspace-aligned subspace


_SI_ = span _{_ **u** _i_ : _i ∈_ _I}._


Under the assumptions of the lemma, the linear and value terms vanish, and the Hessian difference is
diagonal in the common eigenbasis:



**A** _k_ = **H** [(] _[k]_ [+1)] ( **w** _k_ _[∗]_ [)] _[ −]_ **[H]** [(] _[k]_ [)][(] **[w]** _k_ _[∗]_ [) =]



_N_

- _δi_ **u** _i_ **u** _[⊤]_ _i_ _[,]_ _δi_ = _λ_ [(] _i_ _[k]_ [+1)] _−_ _λ_ [(] _i_ _[k]_ [)] _._

_i_ =1



Let **U** _I_ denote the matrix whose columns are the vectors **u** _i_, _i ∈_ _I_ . Then the compressed Hessian
difference on _SI_ is
**B** _k,I_ = **U** _[⊤]_ _I_ **[A]** _[k]_ **[U]** _[I]_ [= diag(] _[δ][i]_ [:] _[i][ ∈]_ _[I]_ [)] _[.]_


14


With Gaussian coordinates **z** _∼N_ ( **0** _, σ_ [2] **I** _D_ ), the local quadratic reduction (same argument as in
Lemma 1, with **U** _D_ replaced by **U** _I_ ) and _ak_ = 0, **c** _k_ = **0** give

∆ [quad] 2 _,I_ [(] _[k]_ [ + 1) =] 4 [1] [E] �( **z** _[⊤]_ **B** _k,I_ **z** ) [2][�] _._


Applying the Gaussian quadratic-form identity (21),

E�( **z** _[⊤]_ **B** _k,I_ **z** ) [2][�] = 2 _σ_ [4] Tr( **B** [2] _k,I_ [) +] _[ σ]_ [4][ Tr(] **[B]** _[k,I]_ [)][2] _[.]_


Since **B** _k,I_ is diagonal,



Tr( **B** [2] _k,I_ [) =] 



- _δi_ [2] _[,]_ Tr( **B** _k,I_ ) = 
_i∈I_ _i∈I_



_δi._

_i∈I_



Therefore


which proves (17).



�2 []

 _,_



∆ [quad] 2 _,I_ [(] _[k]_ [ + 1) =] _[σ]_ [4]

4





2 - _δi_ [2] [+]

_i∈I_



��

_δi_

_i∈I_



��



It remains to show that this quantity is maximized when _I_ = _{_ 1 _, . . ., D}_ . Define



�2



_._



_F_ ( _I_ ) = 2 - _δi_ [2] [+]

_i∈I_



��

_δi_

_i∈I_



��



Since _δ_ 1 _≥_ _δ_ 2 _≥· · · ≥_ _δN_ _≥_ 0, both terms in _F_ ( _I_ ) are monotone with respect to replacing a smaller
selected _δj_ by a larger unselected _δi_ . More explicitly, suppose _i_ _∈/_ _I_, _j_ _∈_ _I_, and _δi_ _≥_ _δj_, and define


_I_ _[′]_ = ( _I \ {j}_ ) _∪{i}._



Then

     



- _δℓ_ _−_ _δj_ + _δi_ _≥_ 

_ℓ∈I_ _ℓ∈I_




- _δℓ_ = 
_ℓ∈I_ _[′]_ _ℓ∈I_



_δℓ,_

_ℓ∈I_



and similarly

     



- _δℓ_ [2] _[−]_ _[δ]_ _j_ [2] [+] _[ δ]_ _i_ [2] _[≥]_ 
_ℓ∈I_ _ℓ∈I_




- _δℓ_ [2] _[.]_

_ℓ∈I_




- _δℓ_ [2] [=] 
_ℓ∈I_ _[′]_ _ℓ∈I_



Hence
_F_ ( _I_ _[′]_ ) _≥_ _F_ ( _I_ ) _._


By repeatedly exchanging smaller selected indices for larger unselected ones, one reaches the set
_I_ _[∗]_ = _{_ 1 _, . . ., D}_ without decreasing _F_ . Therefore _F_ ( _I_ ), and hence ∆ [quad] 2 _,I_ [(] _[k]_ [ + 1)][, is maximized at]
_I_ _[∗]_ = _{_ 1 _, . . ., D}_ . This proves the lemma.


**B** **Additional experimental details**


**Model and numerical setup.** All main-text experiments use the `nanochat` depth-6 model (tag `d6` )
evaluated at training step 3500. The model is a decoder-only transformer with rotary position embeddings, grouped-query attention, ReLU activations, and RMSNorm without learnable parameters.
We use this setup because it is small enough to make repeated full-model Hessian–vector products
feasible in float32 precision while still retaining nontrivial transformer loss geometry. Autocast is
disabled throughout, and the SDPA math kernel is used for numerical stability.


**Losses, checkpoints, and local quantities.** Unless stated otherwise, the local criteria are evaluated
at a checkpoint denoted by **w** _k_ _[∗]_ [.] [The empirical risks] _[ L][k]_ [and] _[ L][k]_ [+1] [are formed from the corresponding]
nested sequence subsets used in the experiment under consideration. The local quadratic quantities in
Sections 4 and 5 are computed at the same checkpoint:


_ak_ = _Lk_ +1( **w** _k_ _[∗]_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)] _[,]_ **c** _k_ = **U** _[⊤]_ _D_ **[g]** [(] _[k]_ [+1)][(] **[w]** _k_ _[∗]_ [)] _[,]_ **B** _k_ = **U** _[⊤]_ _D_  - **H** [(] _[k]_ [+1)] _−_ **H** [(] _[k]_ [)][�] **U** _D._


15


**Subspace** **construction.** Top- _D_ Hessian eigendirections are computed from **H** [(] _[k]_ [)] ( **w** _k_ _[∗]_ [)] [using]
Hessian–vector products and iterative eigensolvers, as described in Section 5. Unless stated otherwise,
the principal curvature subspace is recomputed for each evaluated checkpoint.


**Criterion** **estimation.** For ∆1, we evaluate the one-point increment directly at **w** _k_ _[∗]_ [.] [For] [∆][2]
and ∆ [(] 2 _[D]_ [)], Monte Carlo estimates use Gaussian perturbations with the perturbation scales and
sample counts reported in the corresponding figure captions. Direct subspace Monte Carlo samples
perturbations in the principal curvature subspace, while Quadratic MC and the Gaussian-moment
estimator use the compressed surrogate coefficients ( _ak,_ **c** _k,_ **B** _k_ ). Unless stated otherwise, proxybased estimators are used only in the perturbation regime where the quadratic approximation is
empirically validated.


**Quadratic proxy validation.** For the proxy-validity experiment in the main text, we draw isotropic
Gaussian perturbations
_**δ**_ _∼N_ ( **0** _, σ_ [2] **I** _N_ )

and compare the true local loss increment

_Lk_ ( **w** _k_ _[∗]_ [+] _**[ δ]**_ [)] _[ −L][k]_ [(] **[w]** _k_ _[∗]_ [)]


to its second-order Taylor approximation

**g** [(] _[k]_ [)] _[⊤]_ _**δ**_ + [1]

2 _**[δ]**_ _[⊤]_ **[H]** [(] _[k]_ [)] _**[δ]**_ _[.]_


The reported relative errors are averaged over random seeds and perturbation samples.


**Decay under sample growth.** For the sample-growth experiment in the main text, we evaluate
∆1, ∆2, and ∆ [(] 2 _[D]_ [)] across a grid of effective sample sizes _k_ . The corresponding curves are intended
to test the predicted decay of the stabilization criteria and to compare pointwise, isotropic, and
curvature-aligned probes on the same training trajectory. When the experiment uses multiple random
seeds, the plotted values are averaged across seeds and displayed with the uncertainty convention
specified in the figure caption.


**Runtime measurements.** Wall-clock times in Table 3 are measured separately for three stages:
subspace construction, surrogate-coefficient assembly, and criterion evaluation. The first stage is
shared by all estimators. Reported values are averaged over five random seeds and shown as mean _±_
sample standard deviation.


**Recorded outputs.** For each run, we record the estimated criteria, proxy-validation diagnostics,
subspace-comparison results, and estimator timing statistics needed to generate the figures and tables
in the main text.


16


