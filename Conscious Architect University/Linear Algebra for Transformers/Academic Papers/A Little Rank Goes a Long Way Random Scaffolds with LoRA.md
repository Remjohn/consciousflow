## A Little Rank Goes a Long Way: Random Scaffolds with LoRA Adapters Are All You Need

Hananel Hazan [1] _[,][∗]_ Yanbo Zhang [1] Benedikt Hartl [1] _[,]_ [2] Michael Levin [1] _[,]_ [3]


1Allen Discovery Center at Tufts University, Medford, Massachusetts, USA
2Institute for Theoretical Physics, TU Wien, Wien, Austria
3Wyss Institute for Biologically Inspired Engineering,
Harvard University, Boston, Massachusetts, USA

### **Abstract**


How many of a neural network’s parameters actually encode task-specific information? We investigate this question with **LottaLoRA** _[‡]_, a training paradigm in which every backbone weight is drawn
at random and frozen; only low-rank LoRA adapters are trained. Across nine benchmarks spanning
diverse architecture families—from single-layer classifiers to 900 M-parameter Transformers—lowrank adapters over frozen random backbones recover 96–100% of fully trained performance while
training only 0.5–40% of the parameters. The task-specific signal therefore occupies a subspace
orders of magnitude smaller than the full parameter count suggests. Three mechanistic findings
underpin this result: (1) the frozen backbone is actively exploited when static—the learned scaling _β_ remains strictly positive across all architectures—but when the scaffold is destabilized, the
optimizer silences it and the LoRA factors absorb all task information; (2) the frozen backbone is
preferable but interchangeable—any random initialization works equally well, provided it remains
fixed throughout training; and (3) the minimum LoRA rank at which performance saturates estimates the intrinsic dimensionality of the task, reminiscent of the number of components retained in
Principal Component Analysis (PCA). The construction is formally analogous to Reservoir Computing unfolded along the depth axis of a feedforward network. Because the backbone is determined by
a random seed alone, models can be distributed as adapters plus seed—a footprint that grows with
task complexity, not model size, so that storage and memory savings compound as architectures
scale.


**Keywords:** Reservoir Computing, Low-Rank Adaptation, Large Language Models, ParameterEfficient Training, Random Networks, Hyperdimensional Computing


### **1 Introduction**

As neural networks grow larger, so does the
cost of training them. Low-Rank Adaptation
(LoRA) [2] has become the dominant method
for reducing this cost at fine-tuning time—freeze
a pre-trained backbone, inject small trainable
matrices, and fine-tune the network on a new
task. The frozen weights in that setting encode
rich semantic knowledge accumulated over pretraining; the low-rank adapters merely redirect
the network’s behavior toward the target task.
LoRA is more expressive than this framing


∗Corresponding author: [hananel@hazan.org.il](mailto:hananel@hazan.org.il)
‡A portmanteau of “LoRA” and “a lotta,” alluding to
the Lottery Ticket Hypothesis [1].



suggests: a product of two rank- _r_ matrices
can, given sufficient rank, represent any weight
matrix. The adapters can therefore encode the
full connectivity of every layer from scratch.
This observation connects to intrinsic dimensionality findings [3] and the Lottery Ticket
Hypothesis [1]: task-relevant structure may
occupy a surprisingly small subspace of the full
weight space. The bottleneck dimension _r_ of
the LoRA factorization (referred to as the _rank_
throughout this paper, since it upper-bounds
the matrix rank of the learned update _BA_ ) is
the only structural degree of freedom, reducing
the number of trainable variables per layer by
orders of magnitude.
Independently, the Reservoir Computing lit

_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 2



erature has long established that randomly initialized, fixed dynamical systems can serve as
powerful feature extractors—provided only that
a trained readout channels their dynamics toward the task [4, 5, 6]. This raises a natural question: if a frozen random network already computes, can LoRA serve as a low-dimensional controller that steers the random projections of this
substrate toward the task at each layer? _What_
_if_ _the_ _backbone_ _weights_ _are_ _never_ _pre-trained_ _at_
_all—what_ _if_ _they_ _are_ _simply_ _random?_ A related
principle has been demonstrated in spiking neural networks, where fixed random weights paired
with trained synaptic delays suffice for classification [7], suggesting that the learned component
of a network can be far smaller than conventionally assumed.
Here, we show that they can be: across
nine benchmarks, low-rank adapters over frozen
random backbones recover 96–100% of fully
trained performance under matched architectures and training protocols, while training only
0.5–40% of the parameters. This recovery metric
measures proximity to the fully trained ceiling,
not absolute efficiency; Section 6 analyzes the
full compute picture. The results suggest that
pre-training, while beneficial, is not strictly
necessary.
The implication extends beyond parameter
efficiency. If a frozen random backbone suffices,
then the vast majority of a network’s parameters
are _scaffolding_ —structurally necessary but
carrying no learned information. The taskspecific signal concentrates in a low-dimensional
subspace whose size reflects the problem, not
the architecture. This reframes the relationship
between model size and capability: the number
of parameters measures the capacity of the
scaffold, while the LoRA rank measures the
complexity of the task itself.
Figure 1 illustrates the three strategies. This
construction is formally analogous to Reservoir
Computing [4, 5], though it departs from the
classical framework in key respects developed
in Section 4. In our formulation the reservoir
unfolds along the depth axis in feedforward
architectures and along the temporal axis in
recurrent ones, and the LoRA adapter replaces
the linear readout with a low-dimensional
feedback controller. To demonstrate the power
of this approach, we investigate a progression



of experiments—from a single linear layer on
MNIST through reservoir RNNs, graph networks, CNNs, Decision Transformers, Vision
Transformers, and NLP sentiment classification with DistilBERT, up to 900 M-parameter
Transformers on WikiText-103. Across all tested
architectures, we find that LottaLoRA is competitive with full-weight training, given sufficient
adapter rank, while training only a small fraction
of the parameters. A key mechanistic finding
is that the role of the scaffold depends on its
stability: when static, the optimizer retains the
backbone contribution ( _β_ _>_ 0, with magnitude
varying by architecture); when the scaffold is
resampled during training, the optimizer drives
_β_ toward zero, pushing all task information into
the LoRA factors alone. The scaffold’s specific
values are interchangeable, but its fixedness is
essential.
These findings support a central hypothesis:
_the_ _minimum_ _LoRA_ _rank_ _at_ _which_ _the_ _adapter_
_matches fully trained performance provides an es-_
_timate_ _of_ _the_ _task’s_ _intrinsic_ _dimensionality_ reminiscent of the number of principal components retained in PCA. Because the frozen backbone is fully determined by a random seed, the
only artifact that must be saved, transmitted, or
updated is the compact LoRA factors. At the
900 M-parameter scale this yields a 21 _×_ reduction in distributable size versus fp16, 6 _×_ versus
4-bit quantization, and a 36% reduction in peak
GPU memory—savings that grow monotonically
with model size (Section 6).

### **2 Related Work**


**Reservoir** **Computing.** The idea of exploiting
a randomly initialized, fixed dynamical system
as a feature extractor originates in the Reservoir
Computing (RC) literature. Echo State Networks [4] and Liquid State Machines [5] both
demonstrate that a large, randomly connected
recurrent network can serve as a universal
temporal feature extractor provided that only
its linear readout is trained. The key condition
is that the reservoir dynamics satisfy the Echo
State Property (ESP)—the requirement that
the effect of initial conditions vanishes over
time—typically enforced by constraining the
spectral radius of the recurrent weight matrix
to be less than one. LottaLoRA builds upon


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 3



this philosophy. In feedforward architectures,
we re-interpret the reservoir as unfolding along
the depth dimension rather than along time,
replacing temporal recurrence with layer-to-layer
propagation. In our recurrent benchmarks (Section 5.4), the reservoir operates in the classical
temporal sense.


**Frozen** **and** **partially** **frozen** **Transformers.**
Prior work [8] has shown that interspersing
randomly initialized, permanently frozen layers
with fully trainable Transformer [9] layers maintains or even improves performance on machine
translation and masked language modeling,
while accelerating wall-clock convergence. A
complementary line of work [10] demonstrates
that a randomly initialized decoder-only Transformer, with only embedding layers optimized,
can already perform a variety of algorithmic
tasks. LottaLoRA extends both directions to
their extreme: the entire backbone is frozen,
and the trainable components can be restricted
to low-rank adapters alone.


**Parameter-efficient** **adaptation.** LoRA [2]
proposes to fine-tune a pre-trained model by
freezing its weights and adding trainable lowrank corrections to each linear layer. In the
standard setting, the frozen weights encode rich
semantic knowledge; the LoRA factors steer that
knowledge toward a new objective. LottaLoRA
asks what happens when the frozen weights
encode no prior knowledge at all. The adapters
must therefore serve a different function: rather
than steering pre-trained representations, they
provide a per-layer correction path that stabilizes the random projections of the frozen
backbone and channels its signals toward the
downstream task, as formalized in Section 4. A
parallel direction [11] applies rank- _r_ low-rank
structure to the perturbations of gradient-free
evolution strategies, showing that the same rank
bottleneck that enables parameter-efficient finetuning also enables efficient gradient estimation
at hyperscale.


**Intrinsic** **dimensionality.** The hypothesis
that neural network optimization operates in
a low-dimensional subspace has been explored
in several settings. Prior work [3, 12] has
shown that fine-tuning large models can be
effective even when restricted to a random



low-dimensional subspace of the full parameter
space. LottaLoRA pushes this observation
further: by training _from_ _scratch_ rather than
fine-tuning, we test whether the intrinsic dimensionality of a task can be captured by a low-rank
adapter over a random backbone that carries
no prior knowledge whatsoever. Concurrently,
EGGROLL [11] demonstrates that structuring
evolution-strategy perturbations as rank- _r_
matrices is sufficient to train billion-parameter
language models, providing independent evidence that effective updates are confined to a
low-dimensional subspace even when gradient
information is unavailable.


**Hyperdimensional** **Computing.** A complementary perspective comes from Hyperdimensional Computing (HDC) [13, 14]. HDC
represents data as high-dimensional random
vectors (typically thousands of dimensions)
and manipulates them with simple elementwise
operations such as binding and bundling. Because near-orthogonality is the norm in high
dimensions, these representations are inherently
robust to noise and hardware-level quantization.
While Reservoir Computing also exploits fixed
random projections, it fundamentally relies on
recurrent dynamics to create a temporal state
space. LottaLoRA’s frozen backbone is a purely
feedforward structure, making HDC—which
operates on static high-dimensional random
representations—the more precise analogy. LottaLoRA’s frozen scaffold plays an analogous role,
and the empirical finding that sign-binarized
backbones (each weight replaced by its sign,
_±_ 1) achieve comparable task performance to
Gaussian initialization (Section 5.2) echoes
HDC’s core noise-tolerance property. In both
cases, high-dimensional random representations
concentrate around near-orthogonality, so that
even aggressive per-element quantization (here,
sign binarization) preserves the geometric
structure the downstream learner relies on.
The seed-based reconstruction of the backbone
further parallels HDC’s approach, in which
the high-dimensional random space is specified
rather than learned.


**Converging** **evidence.** These converging lines
of evidence—from RC, frozen Transformers,
parameter-efficient adaptation, intrinsic dimensionality, and Hyperdimensional Computing—


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 4



suggest that the degrees of freedom needed to
solve a task may occupy a far smaller subspace
than the full parameter space. We now formalize this intuition by describing LottaLoRA, a
training paradigm in which the frozen random
backbone provides a high-dimensional substrate
and the low-rank subspace specifies how to
channel its representational capacity toward the
task.

### **3 Method**


Let _fθ_ denote a neural network with _n_ layers
and hidden dimension _d_, where _θ_ comprises all
parameters. In standard LoRA [2], the frozen
weight matrix _W_ 0 encodes knowledge from
pre-training; in LottaLoRA, we replace it with
_W_ seed drawn from a fixed random distribution
(e.g., a zero-mean Gaussian with variance
matched to the standard initialization heuristic
for the given depth and width) and never
updated. The parameter vector _θ_ is partitioned
into fixed random weights _{W_ seed [(] _[i]_ [)] _[}]_ _i_ _[n]_ =1 [layers] and a
trainable subset Θ (defined below). We refer
to the frozen backbone _W_ seed as the _scaffold_,
since it provides fixed structural support—a
high-dimensional substrate for the adapter—but
carries no learned, task-specific information.
For each linear layer with fixed random
weight matrix _W_ seed _∈_ R _[d]_ [out] _[×][d]_ [in], we introduce
a LoRA adapter _BA_ where _B_ _∈_ R _[d]_ [out] _[×][r]_ and
_A_ _∈_ R _[r][×][d]_ [in], together with a trainable scalar
_β_ _∈_ R and a fixed scaling hyperparameter _α >_ 0.
The effective forward computation at each such
layer (Figure 18c) is

_h_ out = _β W_ seed _h_ in + _[α]_ (1)

_r_ _[BA h]_ [in] _[,]_


where _h_ in and _h_ out are the input and output activations, respectively. The scaling factor _α/r_
follows the standard LoRA convention [2]: _α_ is
a fixed hyperparameter that controls the relative
magnitude of the adapter path (set to _α_ =1 for
MNIST and _α_ =16 for Transformer experiments;
see Appendix J). At fixed _α_ with increasing _r_,
the per-rank contribution is attenuated, stabilizing training at high ranks. Although we present
Equation (1) for fully connected layers, the decomposition applies to any layer whose forward
pass is governed by a weight matrix—attention
projections ( _WQ_, _WK_, _WV_, _WO_ ), convolutional
kernels (reshaped to two dimensions), recurrent



gates, and graph message-passing operators—as
demonstrated across nine benchmarks spanning
diverse architecture families in Section 5.
The full set of trainable parameters is
Θ = _{βi, Bi, Ai}_ _[n]_ _i_ =1 [layers] together with any taskspecific head (e.g., token embeddings and
language model head for Transformers, or a classification layer for MNIST). When LayerNorm
is present, its parameters are also trainable
and included in Θ; not all experiments use
LayerNorm (see Appendix J for details).
The adapter operates as follows: _A_ projects
the current state into a low-dimensional signal
and _B_ maps it back into the main pathway, providing a learned correction to the frozen backbone at each layer. The scalar _β_ provides perlayer amplitude control over the backbone contribution: it is initialized to 1 _._ 0 and left unconstrained. Empirically, _β_ remains strictly positive
across all tested architectures, indicating that the
optimizer never fully discards the backbone contribution (see Appendix J for the empirical _β_ distribution).
Because the backbone weights are never
subject to gradient updates, they can be initialized in any format convenient for the target
hardware—sparse, binary, ternary, or any other
low-precision scheme—and the adapter will
learn to channel the resulting representations
equally well (Section 5.2).


**Seed-based** **reconstruction.** Because _W_ seed is
fully determined by the random seed, architecture specification, and initialization distribution,
the backbone can be reconstructed on any
device without transmitting the weight matrices
themselves. The distributable artifact of a
LottaLoRA model is therefore: (1) the random
seed _s_ ; (2) the architecture configuration (layer
count, hidden dimensions, layer types); (3) the
initialization specification (distribution family,
variance schedule); (4) the LoRA state dictionary _{Ai, Bi, βi}_ _[n]_ _i_ =1 [layers] ; and (5) any task-specific
head parameters (embeddings, classification
layers). Note that the head itself can also be
parameterized as a frozen random layer with
LoRA adapters rather than a fully trainable
layer, further compressing the distributable
artifact (see Appendix B.4 for ablations).
Reconstruction proceeds by initializing the
framework’s pseudorandom number generator
(PRNG) with _s_ and drawing _W_ seed in layer order


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 5



using the specified distribution. The PRNG
algorithm must be recorded alongside the seed,
since different frameworks (PyTorch, JAX,
NumPy) use different generators; reproducibility
is guaranteed within a specified framework
and version. All experiments in this work use
PyTorch 2.11.0 with CUDA 12.8. Appendix K
provides framework-agnostic pseudocode for the
full procedure; Appendix L summarizes which
components are required versus optional.

### **4 Reservoir Computing Analogy:** **Where the Connection Holds** **and Diverges**


A classical Echo State Network (ESN) [4] evolves
a hidden state over time as


_ht_ +1 = _σ_ ( _WR ht_ + _U xt_ ) _,_ (2)


where _σ_ is a pointwise nonlinearity, _xt_ is the external input, _WR_ and _U_ are fixed random matrices, and only the linear readout _C_ in _yt_ = _Cht_ is
trained.
In LottaLoRA, treating the layer index _l_ as
the propagation dimension, the hidden state _hl_
propagates through the depth of the network as


_hl_ +1 = _σ_ - _β W_ seed _hl_ + _[α]_ _r_ _[B z][l]_ - _,_ _zl_ = _A hl_ _∈_ R _[r]_ _._

(3)
This is formally identical to the ESN update (2)
with the depth-wise propagation of Equation (3)
mapping to _WR_ = _βW_ seed, the injection matrix
replaced by ( _α/r_ ) _B_, and the exogenous input _xt_
replaced by the endogenous low-dimensional signal _zl_ = _A hl_ (Table 1). LottaLoRA is RC unfolded along the spatial depth axis of a network
rather than along the time axis.
Classical RC theory makes three claims
about systems with fixed random dynamics and
a trained readout: (i) the reservoir’s specific
weight values should not matter, only their
statistical properties; (ii) the reservoir must
remain fixed during training, because a plastic reservoir invalidates the readout’s learned
mapping; (iii) higher-dimensional reservoirs
should yield better performance, as the random
projections span a richer feature space. All three
predictions are supported by our experiments
in Sections 5.2–5.6: 22 initialization families
produce statistically indistinguishable accuracy
(prediction i); resampling the scaffold during



training collapses performance significantly
(prediction ii); and the loss gap narrows steadily
with increasing backbone size (prediction iii).
In all three cases, LottaLoRA behaves as RC
theory predicts, supporting the view that the
RC framing accurately describes the method’s
dynamics.
The analogy does have limits, however.
LottaLoRA departs from classical RC in two
respects: the backbone _W_ seed is not constrained
to satisfy the ESP, and the signal propagates
along the depth axis of a feedforward network rather than along time—so there is no
recurrence and no temporal dynamics. Our
empirical results show that the depth-wise
reservoir functions effectively even without enforcing classical ESP constraints. Characterizing
whether spectral-radius conditions and approximation guarantees of temporal RC transfer
to this setting—perhaps via fan-in scaling and
LayerNorm (Appendix J)—is a natural next
step. Nonetheless, the LoRA adapter at each
layer provides a parallel correction path: _A_
projects the state into a low-dimensional signal
and _B_ maps it back into the main pathway.
This per-layer correction can both counteract
unstable dynamics in the backbone and amplify
useful ones within the frozen backbone, even
when _W_ seed violates the ESP [4]. The trainable _β_
provides a further degree of freedom to attenuate
or amplify the reservoir contribution as needed.
The meta-LoRA experiment (Section 5.3)
provides direct evidence: at sufficiently high
rank, the adapter partially recovers performance
even when the scaffold is resampled during
training—suggesting that with enough capacity,
the adapter can compensate for an unstable
backbone, though at the cost of departing from
the RC regime.
The RC perspective also illuminates the seedgating result (Figure 3): in classical RC, distinct
reservoirs paired with the same readout produce
distinct input–output mappings, because the
reservoir geometry determines which features
are linearly accessible. Analogously, a single
shared LottaLoRA adapter paired with different
backbone seeds _s_ produces different classification
behavior—each seed realizes a different reservoir
geometry, exposing a different subspace of the
input to the trained readout. The points of
divergence from RC suggest a complementary


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 6


Table 1: LottaLoRA maps onto Reservoir Computing through a depth–time correspondence.


**Concept** **RC** **(time)** **LottaLoRA** **(depth)**


Propagation axis Time step _t_ Layer index _l_
System state Hidden state _ht_ Layer activation _hl_
Fixed dynamics Reservoir _WR_ Frozen backbone _βW_ seed
Injection matrix Input matrix _U_ Scaled up-projection ( _α/r_ ) _B_
Drive signal External input _xt_ Projection _zl_ = _A hl_
Trainable output Readout _C_ Head, embeddings, LoRA



connection to Hyperdimensional Computing [13]. The distribution robustness across
22 initialization families (Section 5.2) indicates
that the scaffold’s role is geometric—providing
a high-dimensional space to navigate—rather
than dynamic, which aligns with HDC’s framing
of random projections as an intrinsically useful
representational substrate. The seed-gated task
specialization (Figure 3) further echoes HDC’s
binding operation, in which combining two
high-dimensional representations produces a
distinct third.

### **5 What Do the Adapter and** **the Frozen Backbone Each** **Contribute?**


We evaluate LottaLoRA through a series of experiments, each building on the previous one. We
begin by asking whether the scaffold is necessary at all (Section 5.1), then test whether its
specific initialization distribution matters (Section 5.2), and ask whether the scaffold must remain fixed during training (Section 5.3). We
then extend the architecture survey to recurrent
reservoirs (Section 5.4) and test generalization
across architecture families spanning reinforcement learning, graph prediction, and vision (Section 5.5), before scaling to large Transformer language models (Section 5.6).


**5.1** **Does the scaffold contribute beyond**
**the** **adapter’s** **own** **capacity?**


To probe whether the frozen scaffold contributes
beyond what the adapter can achieve alone, we
evaluate LottaLoRA on MNIST digit classification under three conditions: _normal-scaffold_
( _W_ seed _∼_ _N_ (0 _, σ_ [2] ), _σ_ = 0 _._ 1), _zero-scaffold_
( _W_ seed = 0, removing the backbone entirely),
and _no-scaffold_ evaluation (trained with scaffold, then _W_ seed removed after training). For



reference, a linear classifier on MNIST reaches
approximately 85% accuracy; anything below that threshold is not learning nonlinear
structure. Table 2 summarizes the results.


Table 2: MNIST test accuracy (%) under three
backbone conditions. Mean over 5 seeds _±_
std, ReLU activation, ranks 1/2/4/8. Normal_W_ seed numbers are from the main evaluation
protocol (30 runs, range shows min–max across
seeds); zero- _W_ seed and no-backbone from the
supplementary protocol (15 runs each, ReLU;
see Appendix B). Rank 1 falls below the _∼_ 85%
linear-classifier threshold for zero- _W_ seed and nobackbone, indicating insufficient capacity for
nonlinear structure at that rank.

Test Accuracy (%)


Rank _W_ seed = 0 Normal- _W_ seed No- _W_ seed


1 82 _._ 9 _±_ 4 _._ 9 85.1–89.3 82 _._ 6 _±_ 5 _._ 6
2 91 _._ 0 _±_ 1 _._ 9 90.6–92.7 90 _._ 8 _±_ 2 _._ 1
4 94 _._ 5 _±_ 1 _._ 0 93.6–95.4 94 _._ 4 _±_ 1 _._ 0
8 96 _._ 3 _±_ 0 _._ 5 95.4–96.8 96 _._ 3 _±_ 0 _._ 6


Full 98.1–98.4


At rank 2 and above, the zero-scaffold condition matches the accuracy of the normal-scaffold
condition within fractions of a percentage point.
On MNIST, the scaffold contributes negligibly
to the learned representation—the LoRA factors
carry the task-specific signal. By rank 4 all
three conditions cross the 94% mark, indicating
that nonlinear task structure is captured within
the low-rank factors. Figure 2(A) plots accuracy
against LoRA rank for three model sizes: accuracy increases monotonically with rank and the
gap to fully trained baselines shrinks with model
size. Panel (B) shows that each LottaLoRA
configuration achieves comparable accuracy to
its fully trained counterpart using one to two
orders of magnitude fewer trainable parameters.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 7



**Seed-gated** **task** **specialization** **(poly-**
**computing).** The decoupling of adapter
and scaffold enables a striking form of
polycomputing—multiple computations sharing
the same physical substrate. We partition
the MNIST digit classes into three disjoint
subsets— _{_ 1 _,_ 2 _,_ 3 _}_, _{_ 4 _,_ 5 _,_ 6 _}_, and _{_ 7 _,_ 8 _,_ 9 _}_ —and
train a _single_ _shared_ LoRA adapter across all
three subsets simultaneously, cycling through all
three backbone seeds within each epoch: seed
_s_ =42 with labels _{_ 1 _,_ 2 _,_ 3 _}_, _s_ =43 with _{_ 4 _,_ 5 _,_ 6 _}_,
and _s_ =44 with _{_ 7 _,_ 8 _,_ 9 _}_ . The adapter parameters are identical for all three tasks; only the
seed that reconstructs _W_ seed differs at inference
time. Figure 3 shows the resulting per-digit
test accuracy under two evaluation protocols.
In Experiment 1 (10-class), each seed activates
97–99% accuracy on its assigned digits while
non-assigned digits are confidently misclassified
into in-partition classes. In Experiment 2,
non-assigned digits are mapped to an explicit
out-of-class (OOC) label: the model achieves
93–99% on assigned digits and classifies 95–99%
of non-assigned digits as OOC, demonstrating
that seed-gating enables both task specialization
and out-of-class rejection from a single shared
adapter. Digit 0, deliberately excluded from
all partitions, is consistently mapped to OOC
under every seed. This extreme specialization
arises because each seed produces a different
random scaffold _W_ seed; the shared adapter
channels each realization differently, producing
task-appropriate behavior only when the correct
scaffold is present. Although demonstrated
here on MNIST, the mechanism depends on the
seed-adapter coupling, not on the task.
Taken together, these results show that
on MNIST the LoRA factors alone suffice to
solve the task, but that a static scaffold—when
present—is actively incorporated into the computation. The seed-gating result demonstrates
this most directly: a single adapter produces
entirely different functions depending on which
scaffold it is paired with, confirming that the
adapter and scaffold jointly determine the
network’s behavior.



**5.2** **Does** **a** **random** **scaffold** **help,** **and**
**does** **its** **initialization** **distribution**
**matter?**


Section 5.1 showed that the LoRA adapter can
solve MNIST even without a scaffold. Here we
ask a different question: if a random scaffold is
present, does it matter _how_ it is initialized? We
test this by drawing _W_ seed from 22 different distributions and measuring whether the choice affects performance.


**Distribution** **robustness.** We tested 22
different _W_ seed distribution families on the
MNIST medium preset (four hidden layers,
_d_ =512 _,_ 256 _,_ 128 _,_ 64)—ranging from standard
continuous distributions to binary and sparse
extremes (see Appendix B for the full list and
definitions)—and measured accuracy at each
rank. Table 3 summarizes the results. At
rank 8, every initialization family stays above
95% accuracy, with a worst-to-best spread of at
most 0.30 percentage points (pp). Figure 2(C)
visualizes this as a heatmap across all families and ranks; panel (D) of the same figure
plots accuracy against rank for each family,
showing that all 22 curves converge tightly.
On MNIST, the initialization distribution has
negligible effect on performance—the scaffold’s
specific values are interchangeable. This does
not mean the scaffold is unused: under all
22 static distributions, the learned _β_ remains
strictly positive (Section 5.3), confirming that
the optimizer exploits the backbone regardless
of how it is initialized. We demonstrate this
robustness across 22 initialization families on
MNIST; extending it to larger-scale tasks is a
natural next step (see Section 8).


Table 3: MNIST test classification accuracy (%)
across 22 _W_ seed initialization families. Each family is evaluated over 15 seeds (3 architecture
sizes—tiny, small, medium— _×_ 5 seeds; see Appendix B for details). Range shows worst-to-best
family mean.


Rank Mean (%) Range (%) Spread (pp)


Full 98.03 97.91–98.21 0.30
_r_ =2 90.88 90.84–91.03 0.19
_r_ =4 94.45 94.33–94.48 0.14
_r_ =8 96.29 96.24–96.44 0.19


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 8



**Low-bit** **quantization.** On MNIST, bi_√_ _√_
nary _W_ seed (entries from _{−_ 1 _/_ _d,_ +1 _/_ _d}_ )



_√_
_d,_ +1 _/_



nary _W_ seed (entries from _{−_ 1 _/_ _d,_ +1 _/_ _d}_ )

and 2-bit quantized _W_ seed achieve test accuracy
on par with Gaussian initialization (96.4%
and 96.5% respectively at rank 8 vs 96.2% for
Gaussian). On this task, the scaffold can be
initialized with a single bit per weight without
accuracy loss.



**5.3** **Must** **the** **scaffold** **be** **static?**


To determine whether the scaffold must remain
fixed or whether its values can change during
training, we resample _W_ seed while training the
LoRA factors continuously. We call this ablation
_Meta-LoRA_ : the scaffold _W_ seed is resampled from
its initialization distribution at a fixed cadence
while LoRA factors are trained continuously. We
test three resampling schedules of increasing aggressiveness: (1) once per epoch, (2) at each optimizer step, cycling through _k_ =2 different scaffolds per update (gradients accumulated across
both), and (3) within each batch, splitting it
into _k_ =4 sub-batches each processed with a different _W_ seed. Table 4 summarizes the results.


Table 4: Resampling the scaffold during training
degrades performance progressively with resampling frequency (MNIST, medium preset). Standard = static _W_ seed.


Schedule _r_ =2 _r_ =4 _r_ =8


Standard (static) 92.61 95.53 96.80
Epoch 67.96 89.00 95.53
Batch ( _k_ =2) 42.46 54.94 91.19
Microbatch ( _k_ =4) 41.49 47.67 56.29


Performance collapses under aggressive
resampling (Table 4): at rank 2, microbatch
resampling drops accuracy from 92.6% to
41.5%—a 51 pp loss.
The learned _β_ scalars reveal whether the
backbone is exploited or silenced. Under static
scaffolds, _β_ remains strictly positive—the optimizer retains the backbone as a computational
substrate (magnitude varies by architecture:
median _≈_ 0 _._ 91 for Transformers and CfC reservoirs, _≈_ 0 _._ 99 for ViT, and _≈_ 0 _._ 48 for Decision
Transformers). Under aggressive resampling,
_β_ collapses toward zero at high rank: the
optimizer silences the unreliable scaffold and the
LoRA factors must carry all task information



alone. The scaffold provides a stable reference
frame against which the LoRA factors can learn;
resampling destroys that frame, analogous to
changing the reservoir mid-training in classical
RC.
Table 4 shows a rank-dependent recovery
pattern. At high rank, even aggressive resampling partially recovers performance (91.2% at
rank 8 under batch resampling), while at low
rank performance collapses entirely. This is
consistent with a compression interpretation: a
low-rank adapter has limited capacity, so it must
rely on the scaffold as a stable reference frame to
encode task-relevant structure efficiently. When
the scaffold is resampled, the adapter cannot
rely on it and must instead absorb all task
information into its own trainable parameters—
but at low rank it lacks the capacity to do
so. A high-rank adapter, by contrast, has
enough degrees of freedom to encode the task
independently, making the scaffold less critical.
This suggests a “sweet spot”: at intermediate
ranks, the adapter benefits from the reservoir’s
fixed dynamics; at high ranks, the adapter can
represent the task independently. This also
explains why higher ranks close the gap to full
training even under the fixed-scaffold condition:
the adapter progressively internalizes more of
the task structure rather than depending on the
scaffold’s structure. Note that under resampling,
the adapter faces an additional burden beyond
learning the task itself—it must also learn to
be robust to scaffold changes, which consumes
capacity that would otherwise serve the task.
The resampling experiment thus doubles as a
probe to identify the minimum rank at which
the LoRA factors alone are sufficient: the rank
at which resampled performance recovers to
match the fixed-scaffold condition marks the
point where the adapter’s capacity exceeds the
task’s requirements. This rank provides an
estimate of the number of trainable degrees of
freedom needed to represent the task (each rank
contributes _d_ in + _d_ out parameters per layer).
The scaffold must be static: its fixedness is
the necessary condition for the adapter to coadapt to its structure.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 9



**5.4** **Time-Series** **Prediction** **with** **Reser-**
**voir** **RNNs**


The MNIST experiments above apply LottaLoRA to feedforward architectures, where
the reservoir unfolds along depth. Here we test
whether the same principle works in the classical
RC setting: a frozen random _recurrent_ network
with LoRA adapters replacing the trained
readout. This directly connects LottaLoRA to
its RC roots, where the reservoir unfolds along
time.


**CfC** **reservoir** **on** **PhysioNet** **2012** **ICU**
**mortality.** To test LottaLoRA on a realworld recurrent task, we apply it to ICU
mortality prediction on PhysioNet 2012 [15]—a
binary classification benchmark with severe
class imbalance (11.7:1). The backbone is a
frozen Closed-form Continuous-time network
(CfC [16, 17]) with hidden size 256 and a
2-layer backbone of 64 units each, initialized
from a random seed. LoRA adapters replace
the trained weight matrices in each recurrent
layer; the backbone remains frozen throughout.
Performance is measured by AUROC (area
under the ROC curve; higher is better). We
compare against a fully trained CfC baseline
using identical architecture and hyperparameters
(Appendix C).


Table 5: **CfC** **reservoir** **on** **PhysioNet** **2012**
**ICU** **mortality** ( _h_ =256, backbone 64 units,
2 layers): AUROC and trainable parameter
count by LoRA rank. LottaLoRA uses a frozen
random CfC backbone; Full CfC is fully trained
from scratch. Mean _±_ std over 5 seeds. %Trainable is relative to the Full CfC parameter count
(92,930).


Rank AUROC % %Trainable


_r_ =1 0 _._ 832 _±_ 0 _._ 005 3,482 3.7%
_r_ =2 0 _._ 835 _±_ 0 _._ 005 5,292 5.7%
_r_ =4 0 _._ 834 _±_ 0 _._ 002 8,912 9.6%
_r_ =8 0 _._ 833 _±_ 0 _._ 001 16,152 17.4%


Full 0 _._ 836 _±_ 0 _._ 002 92,930 100%


Table 5 shows that LottaLoRA with rank 1
achieves AUROC = 0 _._ 832 _±_ 0 _._ 005, recovering 99.5% of the fully trained CfC baseline
(0 _._ 836 _±_ 0 _._ 002) while using only 3,482 trainable
parameters—3.7% of the baseline’s 92,930.
Performance saturates at rank 2 (Figure 4)



with no further gain at higher ranks, confirming
low intrinsic dimensionality for this clinical
prediction task.
However, because the published CfC architecture (92,930 parameters) is substantially
overparameterized for this binary-classification
task (3,200 samples, 37 features), the flat saturation curve may reflect architectural excess rather
than genuinely low intrinsic dimensionality. To
test this, we scaled the CfC hidden size and
backbone width by factors of 0 _._ 125 _×_, 0 _._ 25 _×_, and
0 _._ 5 _×_ and repeated the rank sweep (5 seeds each;
Appendix C). At 0 _._ 125 _×_ (2,210 parameters),
rank 1 recovers only 93 _._ 7% of the scaled baseline
(AUROC 0 _._ 778 _±_ 0 _._ 037), and saturation shifts
to _r_ =4; at 0 _._ 25 _×_ and above, rank 1 already
recovers _≥_ 98 _._ 8%. Meanwhile, the fully trained
baseline improves only from 0.831 to 0.836 across
a 42 _×_ parameter increase (Table 6), confirming
that the architecture is far larger than the task
requires. The saturation rank therefore reflects
an interaction between task complexity and
model capacity, not task complexity alone.


Table 6: **Reducing** **CfC** **capacity** **shifts** **rank**
**saturation** **rightward.** AUROC (mean _±_ std,
5 seeds) at each size scale and LoRA rank. At
0 _._ 125 _×_, rank 1 falls to 93 _._ 7% recovery; rank 4
restores 99 _._ 8%. Fully trained baselines (“Full”)
improve only 0.831–0.836 across a 42 _×_ parameter
range.


Scale _h_ Rank AUROC Recovery


0 _._ 125 _×_ 32 Full 0 _._ 831 _±_ 0 _._ 003  _r_ =1 0 _._ 778 _±_ 0 _._ 037 93.7%
_r_ =4 0 _._ 829 _±_ 0 _._ 005 99.8%


0 _._ 25 _×_ 64 Full 0 _._ 832 _±_ 0 _._ 002  _r_ =1 0 _._ 822 _±_ 0 _._ 009 98.8%
_r_ =2 0 _._ 831 _±_ 0 _._ 002 100.0%


0 _._ 5 _×_ 128 Full 0 _._ 833 _±_ 0 _._ 001   _r_ =1 0 _._ 827 _±_ 0 _._ 004 99.3%
_r_ =4 0 _._ 831 _±_ 0 _._ 002 99.8%


1 _×_ 256 Full 0 _._ 836 _±_ 0 _._ 002   _r_ =1 0 _._ 832 _±_ 0 _._ 005 99.5%


On real clinical time-series, LottaLoRA operates in the regime it inherits from RC: a frozen
recurrent backbone with a trained readout. At
the published architecture scale, rank-1 adapters
match the fully trained CfC on ICU mortality
prediction; the size-reduction ablation (Figure 5)
shows that this flat saturation reflects architec

_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 10



tural excess, not genuinely low task dimensionality. A randomly initialized frozen backbone
provides sufficient temporal mixing without taskadaptive training of its weights.


**5.5** **Generalization** **Across** **Architecture**
**Families**


A central claim of this work is that the low-rank
subspace phenomenon is architecture-general,
not an artifact of a specific model family. To
test this, we apply LottaLoRA to six additional domains spanning offline reinforcement
learning, convolutional image classification,
graph-level and node-level graph prediction,
fine-grained image classification, and natural
language sentiment classification (Table 7). In
each case, LoRA adapters replace the trainable weight matrices of the frozen backbone,
following the same _W_ eff = _β W_ seed + ( _α/r_ ) _BA_
formulation. **CIFAR-10** **Plain-20** **CNN** [18]:
10-class image classification using a 20-layer
convolutional network (3 seeds; Appendix H).
**Decision** **Transformers** [19]: offline RL on
HalfCheetah-expert-v2, with a rank sweep and
two scaffold stability conditions (5 seeds; Appendix I). **OGBG-MolHIV** [20]: graph-level
molecular property prediction (binary classification) using a GIN [21] (strictly more expressive
than GCN [22]) (5 seeds; Appendix D). **OGBN-**
**Arxiv** [20]: node-level citation classification
using a GCN [22] (10 seeds; Appendix E).
**Vision** **Transformer** **(ViT)** [23]: fine-grained
image classification on Flowers-102 [24], using
ViT-Base/16 with an ImageNet-1k pre-trained
backbone (5 seeds; Appendix F). **IMDB** **Sen-**
**timent** **Classification** [25]: binary sentiment
classification using a DistilBERT [26] backbone
(4 seeds; Appendix G).
Six findings stand out. First, LottaLoRA is
competitive across all six domains: on CIFAR-10
(Plain-20 CNN) it recovers 96.6% of baseline
accuracy at rank 16 with 38.3% of the parameters (Table 7); on Decision Transformers at
sufficient rank ( _r_ =32, small scale), LottaLoRA
matches the fully trained baseline (Val MSE
0.0271 vs 0.0272; paired difference not significant) while training 37.5% of the parameters,
and at extreme compression ( _r_ =8, large scale,
1.87% trainable) it trails by only 1.2% relative
MSE; on ViT Flowers-102 it recovers 97.6% of
baseline accuracy with 1.19% of the parameters;



and on OGBG-MolHIV it recovers 97.5% of
baseline ROC-AUC with 10.9% of the parameters. Second, the Decision Transformer sweep
confirms the resampling collapse observed on
MNIST (Section 5.3) on a second architecture:
resampling the scaffold each epoch drops D4RL
online score from 61% to 4% at rank 1, with
recovery following the same rank-dependent pattern (Appendix I). Third, the OGBG-MolHIV
result demonstrates generalization to graph-level
molecular property prediction: LottaLoRA at
_r_ =16 achieves ROC-AUC 0.7562, recovering
97.5% of the fully trained baseline (0.7755) while
training only 10.9% of the parameters. Notably,
the LottaLoRA score matches the published
OGB GIN baseline (0 _._ 7558 _±_ 0 _._ 0140 [20]),
meaning a frozen-backbone model with _∼_ 200 K
trainable parameters performs on par with a
fully trained GIN with _∼_ 1.8 M parameters.
Fourth, the ViT result quantifies the value
of a learned reservoir: replacing ImageNet-1k
weights with random noise costs _∼_ 40 pp, showing that while LottaLoRA works with random
backbones, learned reservoirs provide a substantial advantage on complex vision tasks. Fifth,
OGBN-Arxiv extends graph generalization from
graph-level (MolHIV, GIN) to node-level classification (GCN): LottaLoRA at _r_ =32 recovers
97.6% of the fully trained baseline (70 _._ 11% vs
71 _._ 86%) while training 35.6% of the parameters
(Table 7).
Sixth, IMDB sentiment classification extends
generalization to NLP: LottaLoRA at _r_ =8 recovers 99.3% of full fine-tuning accuracy (85 _._ 12%
vs 85 _._ 69%) while training only 0.48% of the
parameters—the lowest trainable ratio of any
benchmark in this paper (Table 7; Appendix G).
Across all nine benchmarks (MNIST, CfC
PhysioNet, CIFAR-10, OGBG-MolHIV, OGBNArxiv, Decision Transformer, ViT, IMDB,
WikiText—each representing a distinct architecture), a consistent pattern emerges: increasing
LoRA rank yields decreasing marginal gains,
and different tasks saturate at different ranks.


**5.6** **Scaling** **to** **Transformers**


The preceding experiments establish the scaffold’s role across feedforward, recurrent, and
graph architectures; we now ask whether the
method scales to modern language models. We
compare full-parameter training and LottaLoRA


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 11


Table 7: LottaLoRA is competitive across diverse architectures with 0.5–40% of trainable parameters. All comparisons use matched-protocol training; IMDB and ViT use pre-trained backbones,
others train from scratch. For DT, lower MSE is better. See appendices for full details per benchmark.
Benchmark Rank Metric Test LottaLoRA Baseline #seeds % trainable


CIFAR-10 Plain-20 16 acc 87 _._ 70 _±_ 0 _._ 26% 90 _._ 81 _±_ 0 _._ 20% 3 38.3%
OGBG-MolHIV (GIN) 16 ROC-AUC 0 _._ 7562 _±_ 0 _._ 0158 0 _._ 7755 _±_ 0 _._ 0060 5 10.9%
OGBN-Arxiv (GCN) 32 acc 70 _._ 11 _±_ 0 _._ 21% 71 _._ 86 _±_ 0 _._ 22% 10 35.6%
DT (small) 32 Val MSE _↓_ 0 _._ 0271 _±_ 0 _._ 0017 0 _._ 0272 _±_ 0 _._ 0017 5 37.5%
DT (large) 8 Val MSE _↓_ 0 _._ 0285 _±_ 0 _._ 0015 0 _._ 0281 _±_ 0 _._ 0019 5 1.87%
ViT Flowers-102 1 Top-1 acc 94 _._ 53 _±_ 0 _._ 35% 96 _._ 83 _±_ 0 _._ 08% 5 1.19%
IMDB (DistilBERT) 8 acc 85 _._ 12 _±_ 0 _._ 57% 85 _._ 69 _±_ 0 _._ 44% 4 0.48%



on decoder-only Transformer language models at
five backbone scales (3 M to 900 M total parameters) on WikiText-103 [27], training from scratch
under a single-epoch compute-optimal budget
following the Chinchilla protocol [28]. Neither
condition uses a pre-trained checkpoint, so the
comparison isolates the value of full weight
optimization against random frozen weights
steered by low-rank adapters (Appendix A).
Under the same sample budget, LottaLoRA
does not yet surpass full training at any scale,
but the gap narrows steadily from +0.94 nats at
300 M to +0.79 nats at 900 M (Table 8)—while
training fewer than 0.5% as many internal
parameters as the full model. The narrowing
trend is consistent with the RC literature [4, 5]:
a fixed random reservoir must be sufficiently
high-dimensional before its random projections
span the structure needed for effective learning,
and the trajectory suggests convergence at larger
scales.
These same-scale comparisons (each row
of Table 8) measure efficiency at matched
forward-pass cost: both conditions use the same
architecture with equal total parameter count,
but LottaLoRA freezes the backbone and trains
only a tiny fraction of its internal weights via
LoRA adapters. A complementary view compares models at matched _trainable_ _parameter_
_count_ (Figure 7). Consider two ways to spend
a budget of roughly 3 M trainable parameters:
(a) train all weights of a 3 M-parameter model
(loss 5.007), or (b) distribute them as rank-8
LoRA adapters over a 900 M frozen backbone
(loss 3.950). Option (b) achieves a loss more
than 1.0 lower than option (a), despite training
a comparable number of parameters. This
shows that the frozen backbone—even though



random—provides a useful computational substrate: a small adapter over a large random
scaffold extracts more from the same parameter
budget than a small fully trained model can.
This is the central practical result: the frozen
random backbone acts as a computational
amplifier, converting a fixed parameter budget
into substantially lower loss.
The gap between LottaLoRA and full
training narrows steadily with scale (Figure 6),
consistent with the RC prediction that larger
random reservoirs provide richer projections. At
900 M parameters, a random frozen backbone
with rank-8 adapters closes to within 0.79 nats
of full training while optimizing fewer than
0.5% of the internal parameters. Moreover,
at matched trainable parameter count, the
900 M LottaLoRA model (loss 3.950) substantially outperforms a fully trained 3 M model
(loss 5.007), demonstrating that the frozen
backbone amplifies the value of each trainable
parameter.

### **6 Computational Cost Analysis**


The results in Section 5 show a large reduction
in trainable parameter count: at large backbone
scales, LottaLoRA narrows the gap to full training while using fewer than 0.5% of the internal
trainable parameters of a same-scale fully trained
model. A natural question is whether this parametric advantage translates into a practical reduction in training cost, measured in floatingpoint operations (FLOPs) and memory. We analyze this question by deriving closed-form estimates for both quantities, comparing LottaLoRA
against full-parameter training first on conventional GPU hardware and then on dedicated accelerators. The central finding is that on conven

_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 12


Table 8: Transformer scaling on WikiText-103: full training versus LottaLoRA _r_ =8 at each backbone scale. Internal trainable ratio (“Ratio (%)”) counts only transformer-internal parameters (attention projections and feedforward layers, excluding token embeddings and the language-model
output head). Best loss per scale in **bold** ; ∆ is the gap LottaLoRA _−_ Full.


Scale Full loss LottaLoRA _r_ =8 loss Ratio (%) ∆


3M **5.007** 5.639 7.68 +0.63
30M **3.757** 4.681 1.39 +0.92
300M **3.252** 4.191 0.51 +0.94
600M **3.185** 4.058 0.40 +0.87
900M **3.156** 3.950 0.31 +0.79



tional hardware the savings are real but modest
in absolute terms; the full benefit of the parametric advantage is realized only when the frozen
backbone is executed on application-specific integrated circuit (ASIC) accelerators designed for
fixed-weight computation. The analysis follows
a physicist-style approximation that retains only
the dominant terms.


**FLOPs.** For a linear layer _y_ = _Wx_, a forward
pass requires _∼_ 2 _d_ in _d_ out FLOPs. The backward
pass adds another _∼_ 2 _d_ in _d_ out to compute input
gradients ( _dx_ = _W_ _[⊤]_ _dy_ ) and a further _∼_ 2 _d_ in _d_ out
to compute weight gradients ( _dW_ = _dy x_ _[⊤]_ ). In
full-parameter training all three terms apply to
every parameter, giving approximately 6 _MN_ total FLOPs for _M_ training tokens and _N_ total
parameters (Equation (4)):


_F_ full _≈_ 6 _MN._ (4)


In LottaLoRA, frozen parameters incur forward
and input-gradient costs but not weight-gradient
costs, since gradients must still flow through
them to reach the LoRA adapters. Denoting
trainable and frozen parameter counts by _N_ tr
and _N_ fr = _N −_ _N_ tr, respectively, the LottaLoRA
training FLOPs are (Equation (5)):



**Memory.** Training memory splits into three
components: (i) weight storage, (ii) optimizer
states and gradients for trainable parameters,
and (iii) activations. Under a standard mixedprecision setup (bf16 weights and gradients,
Adam with fp32 first and second moments and
fp32 master weights), each trainable parameter
requires approximately 2 + 2 + 8 + 4 = 16 bytes,
while each frozen parameter requires only 2
bytes for storage. Denoting memory in bytes
(Equations (7)–(8)):


Mem [param+opt] LottaLoRA _[≈]_ [2] _[N]_ [+ 14] _[N]_ [tr] _[,]_ (7)

Mem [param+opt] full _≈_ 16 _N,_ (8)


giving a ratio of



Mem [param+opt] LottaLoRA = [1]
Mem [param+opt] full 8




[1] [7]

8 [+] 8



_N_ tr

[7]

8 _N_



_N_



(9)



_−→_ [1] as _N_ tr _/N_ _→_ 0 _._

8



_F_ LottaLoRA _≈_ _M_ (4 _N_ fr + 6 _N_ tr) = _M_ (4 _N_ + 2 _N_ tr) _._
(5)
The ratio of LottaLoRA to full-training FLOPs
is therefore

_F_ LottaLoRA

[2] _[N]_ [tr]



LottaLoRA

= [2]
_F_ full 3




[2] _[N]_ [tr]

3 [+] 3 _N_



(6)
3 _N_ _[.]_



The dominant memory saving therefore comes
from eliminating optimizer states for frozen
parameters, approaching an 8 _×_ reduction when
_N_ tr _≪_ _N_ . Activation memory is comparable
in both settings because gradients must still
pass through the frozen backbone; it does not
contribute meaningfully to the advantage unless
gradient checkpointing is employed.


**Empirical** **GPU** **measurements.** Table 9 reports measured peak GPU memory and training
throughput for our WikiText-103 scaling runs on
an H200 GPU. At 900 M parameters, LottaLoRA
uses 19.1 GB versus 29.8 GB for full training—a
36% reduction in peak memory—consistent with
the theoretical prediction of Equation (9). Training throughput (steps per second) is identical
at 300 M and above, consistent with the FLOPs
analysis: the frozen backbone still performs a full



For a LLaMA-like architecture [29], _N_ _≈_ 12 _nd_ [2]

while _N_ LoRA _≈_ 18 _nrd_, so _N_ tr _/N_ _∼_ _r/d_ _→_ 0 as
the model scales at fixed rank _r_ . The FLOPs
ratio therefore converges to 2 _/_ 3: on conventional
GPU hardware, freezing the backbone saves at
most one third of training compute.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 13



forward and input-gradient pass, so wall-clock
time is not reduced. The memory saving is available on current hardware; the throughput saving
requires dedicated support for frozen-weight acceleration (see below).


**Implications** **on** **conventional** **hardware.**
The ratios in Equations (6) and (9) assume the
same total parameter count _N_ in both settings.
The results in Section 5, however, indicate
that LottaLoRA requires substantially more
total parameters than a fully trained model to
reach comparable loss, consistent with the RC
literature: a fixed random reservoir must be
considerably larger than a trained network to
achieve comparable expressive power, because
the random projection is not adapted to the
task. At _αN_ total parameters (where _α_ _≫_ 1),
the LottaLoRA training FLOPs become approximately _αN_ _×_ (2 _/_ 3), comparable to or worse
than full-parameter training at the target scale
_N_ . At inference time, where only a forward pass
is required, both regimes incur approximately
2 _N_ FLOPs at equal parameter count; the larger
LottaLoRA model therefore yields no inferencetime advantage either. On conventional GPU
hardware, a hardware-agnostic comparison does
not favor LottaLoRA in terms of raw compute
cost, whether at training or inference.


**6.1** **Precision** **and** **sparsity** **of** **the** **frozen**
**backbone**


Because _W_ seed is never updated, it can be stored
in any reduced-precision format without penalty.
On MNIST (2,640 runs, 22 initialization fami_√_ _√_
lies), binary _W_ seed ( _{−_ 1 _/_ _d,_ +1 _/_ _d}_ ) and 2-bit



_√_
_d,_ +1 _/_



lies), binary _W_ seed ( _{−_ 1 _/_ _d,_ +1 _/_ _d}_ ) and 2-bit

quantized _W_ seed match Gaussian initialization at
rank 8 with no statistically significant accuracy
difference. On IMDB sentiment classification
(408-run sweep; see also Appendix G for rank
sensitivity), lowbit2 _W_ seed is the best-performing
variant at ranks 4 and 8. The backbone can
be reduced to a _single_ _bit_ _per_ _weight_ with zero
degradation. A binary _W_ seed replaces every
multiply-accumulate with an add-or-subtract
operation, reducing the arithmetic cost of the
backbone forward pass by roughly 2 _×_ on hardware supporting efficient integer GEMM [30].
At 900 M parameters, binary storage requires
_∼_ 107 MB versus _∼_ 1 _._ 7 GB at fp16—a 16 _×_ reduction that is realizable on commodity GPUs



without custom silicon. This precision tolerance
is the empirical prerequisite for the ASIC
argument that follows.


**ASIC** **acceleration.** The picture changes
qualitatively on dedicated accelerators. A
binary backbone is not merely a compressed
weight matrix—it is a fixed sign pattern that
replaces floating-point multiply-accumulate with
integer add/subtract, the simplest possible
arithmetic primitive. The frozen backbone
performs exactly the same (binary) matrix
operations at every training step and every
inference call; the weights never change. This is
precisely the regime in which ASIC accelerators
excel: a circuit designed for a specific, fixed
set of operations executes them at far lower
energy and latency than a general-purpose
GPU performing the same FLOPs. A recent
survey [31] of LLM inference across CPU, GPU,
field-programmable gate array (FPGA), ASIC,
and processing-in-memory platforms demonstrates that ASIC and FPGA implementations
achieve substantially higher energy efficiency—
measured in tokens per joule—than GPU
baselines at comparable throughput. Large-scale
inference for commercial language services is
increasingly served by dedicated accelerators,
driven by the economics of sustaining high
query volumes at low cost. In such a setting,
the frozen computation in LottaLoRA is not
merely cheaper by the factor of 2 _/_ 3 identified
above but potentially by one to two orders of
magnitude, depending on the degree of hardware
specialization. Dedicated hardware for neural
network inference demonstrates the scale of
this efficiency gain empirically. Google’s Tensor
Processing Unit (TPU v1), an ASIC designed
specifically for fixed-weight matrix operations,
achieves 30–80 _×_ better performance-per-watt
than contemporary CPUs and GPUs on production ML workloads [32]; the key enabler is
that fixed weights can be kept in on-chip SRAM
and the dataflow hardcoded into the circuit.
LottaLoRA’s frozen backbone is precisely this
regime: the backbone matrix multiplications are
identical at every forward pass and therefore
amenable to the same weight-stationary ASIC
optimization. The trainable LoRA factors ( _A_,
_B_, _β_ ) constitute a small reconfigurable overlay
that fits entirely in on-chip buffers, mirroring
the architectural decomposition of emerging


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 14


Table 9: Measured peak GPU memory and training throughput on an H200 GPU (WikiText103, batch size 32, 128-token blocks, bf16 mixed precision, single epoch = 34,429 steps). Memory
reduction grows with scale as the frozen backbone dominates.


Scale Full (GB) LottaLoRA _r_ =8 (GB) Mem. red. Tput. ratio


3 M 1.6 1.6 1% 0.62 _×_
30 M 2.8 2.5 10% 0.73 _×_
300 M 10.7 7.7 28% 1.00 _×_
600 M 19.3 13.0 33% 1.00 _×_
900 M 29.8 19.1 36% 1.00 _×_



fixed-model accelerators into a hardwired backbone path and a lightweight adapter path [31].
The parametric advantage of LottaLoRA—a
vastly reduced trainable parameter count at
scale—thus translates into a practical cost
advantage primarily in hardware-co-designed
settings where fixed-weight computation can be
offloaded to dedicated circuits.


**Device** **Variability** **Becomes** **a** **Feature:**
**Implications** **for** **Neuromorphic** **Hardware.**
Beyond digital accelerators, LottaLoRA’s insensitivity to backbone values (Section 5.2) suggests
compatibility with computing substrates in
which fixed random connectivity arises naturally. In analog crossbar arrays, device-to-device
variation in memristive conductances produces
weight matrices that are effectively random
and difficult to reprogram; in neuromorphic
chips, threshold variability and synaptic noise
introduce similar stochastic structure. Our
results—in particular the finding that binary
and ternary backbones match continuous-valued
ones (Section 6.1)—indicate that such hardwareintrinsic randomness could serve directly as the
frozen scaffold, with only the compact LoRA
adapter implemented in a precise, reconfigurable digital pathway. This heterogeneous
architecture—an imprecise analog backbone
paired with a small digital adapter—mirrors the
LottaLoRA decomposition and may offer a route
toward integrating low-rank adaptation with
spiking and analog classifiers, where the physical
substrate provides the high-dimensional random
projection and the trainable adapter provides
the task-specific correction.


**Distributable** **model** **size:** **low-rank** **com-**
**pression** **as** **an** **alternative** **to** **quantization.**
Open-weight large language models are today
routinely distributed in quantized form (GPTQ,
AWQ, GGUF) to reduce storage and inference



cost. Quantization achieves this by irreversibly
reducing the bit-width of every learned parameter, trading precision for size. LottaLoRA’s
structure suggests an alternative compression
pathway that operates on a fundamentally
different axis. Because the frozen backbone
is fully determined by a pseudorandom seed,
the distributable footprint of a LottaLoRA
model is the seed plus the compact low-rank
adapter—with no precision loss whatsoever.
Table 10 quantifies this advantage. At 900 M
parameters with _r_ =8, the distributable artifact
(seed plus LoRA factors plus embeddings in
fp16) is 109 MB—6 _×_ smaller than 4-bit quantization (GGUF) and 21 _×_ smaller than fp16. The
advantage grows with scale because backbone
parameters—which dominate at large sizes—are
replaced by a single seed, while the adapter size
grows only as _O_ ( _r_ _·_ _d_ ). At small scales (3 M,
30 M), embeddings dominate the distributable
size and the advantage is negligible; at 300 M and
above, the backbone dominates and seed-based
reconstruction provides substantial compression.
The achievable compression ratio is ultimately
governed by the task’s intrinsic dimensionality
(Section 7): lower _r_ _[∗]_ means a smaller adapter
and greater compression, independent of the
architecture’s total parameter count.
If hardware or software infrastructure were
developed to exploit this structure (e.g. on-chip
PRNG generation of backbone weights, or optimized sparse-plus-low-rank kernels), the same
seed-plus-adapter representation could simultaneously reduce training cost (gradients flow
only through the adapter), accelerate inference
(the backbone is generated rather than loaded
from DRAM), and shrink storage—advantages
that quantization, which acts only on the
distributable artifact, cannot jointly provide.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 15


Table 10: Distributable model size at each scale. “fp16” stores all parameters in half precision; “4bit” uses group-quantized 4-bit format (GGUF-style, with fp16 scale factors per 32-weight group);
“LottaLoRA” stores only the random seed (8 B), LoRA adapters, and token embeddings in fp16.
Compression ratios are relative to fp16.


Scale fp16 (MB) 4-bit (MB) LottaLoRA (MB) vs. fp16 vs. 4-bit


3 M 5 1 4 1 _×_ 0.3 _×_
30 M 57 16 24 2 _×_ 0.7 _×_
300 M 586 165 103 6 _×_ 1.6 _×_
600 M 1,184 333 105 11 _×_ 3.2 _×_
900 M 2,312 650 109 21 _×_ 6.0 _×_


### **7 The Minimum-Rank Hypothe-** **sis: Toward a Measurement of** **Task Complexity**

The experiments point to a striking pattern: the
minimum LoRA rank required to solve a task
correlates with task complexity. We hypothesize
that this minimum rank estimates the task’s
intrinsic dimensionality—the effective number of
degrees of freedom the problem requires _relative_
_to_ _a_ _given_ _architecture_ . Crucially, the necessity
of the scaffold itself is rank-dependent. At
very low ranks, the LoRA factors have limited
capacity and benefit from the scaffold’s fixed
reference frame; at sufficiently high ranks, the
adapter can represent the task independently
of _W_ seed, as the resampling experiments in
Section 5.3 suggest. The transition rank—
where performance becomes insensitive to the
scaffold—marks the point at which the adapter’s
capacity matches the task’s intrinsic complexity.
Consider the progression on MNIST (medium
preset, 5 seeds): rank 1 reaches 89%, which
is near the performance of a linear classifier.
Rank 2 crosses into the nonlinear regime at 93%.
Rank 4 reaches 96%, rank 8 reaches 97%, and by
rank 16–32 accuracy saturates at _∼_ 98%—within
0.6 pp of the fully trained baseline—with only
3.6% of the parameters. Figure 8 shows this
pattern across eight tasks: each curve saturates
at a different rank, reflecting the task’s intrinsic complexity. Low-dimensional tasks (CfC
PhysioNet ICU mortality) saturate at rank 1
when the architecture is large relative to the
task—a size-reduction ablation confirms that
saturation shifts to _r_ =4 under a 0 _._ 125 _×_ model
(Table 6); medium tasks (MNIST, CIFAR-10;
Appendix H) saturate between ranks 8 and 32;
and on tasks where a pre-trained backbone
dominates (ViT Flowers-102), additional rank



provides decreasing marginal gains.
Consider the analogy to PCA: the number
of components needed to reconstruct a signal
depends on the intrinsic dimensionality of the
data, not on the ambient dimension (i.e., the
total number of parameters in the weight space).
Similarly, in LottaLoRA the minimum rank required to solve a task depends on the complexity
of the function the network must represent, not
on the number of parameters in the architecture.
To make this precise, we define the _minimum_
_sufficient_ _rank_ _r_ _[∗]_ ( _ε_ ) as the smallest rank _r_ such
that
_L_ LottaLoRA( _r_ ) _≤L_ full + _ε,_ (10)


where _L_ LottaLoRA( _r_ ) is the loss achieved by LottaLoRA at rank _r_ and _L_ full is the loss of a fully
trained baseline under the same training protocol. This parallels the PCA criterion of retaining
enough components to explain a (1 _−ε_ ) fraction
of total variance: in both cases, _ε_ controls the
acceptable approximation gap, and the required
number of dimensions reflects the data’s intrinsic
complexity rather than the ambient dimension.
The weight matrix _W_ seed provides the ambient
dimension; the LoRA factors _B_ and _A_ provide
the principal subspace.
This definition connects to the intrinsic
dimensionality literature. Prior work measures
the dimensionality of the fine-tuning subspace
by projecting into a random low-dimensional
space [3] or restricting optimization to random
subspaces [12]. LottaLoRA offers a complementary perspective: rather than projecting into an
_arbitrary_ random subspace, it trains a _structured_
low-rank factorization over a frozen random
backbone, so _r_ _[∗]_ reflects the rank structure
of the task-relevant update rather than the
dimensionality of an unconstrained subspace.
Our results position _r_ _[∗]_ as a complementary
measure of intrinsic dimensionality; establishing


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 16



formal relationships with these prior measures
on shared benchmarks is a natural extension.
The computational and storage advantages
of operating at reduced rank—including up to
8 _×_ memory reduction and 21 _×_ distributable-size
compression—are analyzed in Section 6; these
hold independent of the minimum-rank hypothesis. The hypothesis itself has two consequences
that go beyond cost savings:


1. **Task** **characterization.** The minimum
rank at which LottaLoRA approaches fulltraining performance provides a task-specific
measure of intrinsic dimensionality. Tasks that
require high rank have high-dimensional solution
spaces; tasks solvable at rank 1 (like Lorenz
prediction) have low intrinsic dimensionality
regardless of the model’s parameter count.


2. **Interpretability.** Because all task-specific
degrees of freedom are concentrated in the lowrank factors _{Ai, Bi}_, the learned function is described by far fewer parameters than in a fully
trained network. At rank _r_ _[∗]_, the number of parameters that must be examined to understand
the model’s behavior scales as _r_ _[∗]_ ( _d_ in + _d_ out) per
layer rather than _d_ in _×_ _d_ out—a reduction that
may enable direct analysis of what the network
has learned. The low-rank structure imposes a
bottleneck that is not merely a compression convenience but an insight into the functional subspace the task actually requires, potentially advancing mechanistic understanding of neural network representations.


Finding the minimum rank _r_ _[∗]_ ( _ε_ ) (Equation (10)) provides an empirical estimate of
task complexity under specific conditions: a
fixed architecture family (Transformers, RNNs),
a standard optimizer (SGD), and a training
budget. Within Transformers, _r_ _[∗]_ appears robust across initialization families (Section 5.2),
suggesting some architecture-independence.
Our experiments suggest _r_ _[∗]_ captures intrinsic
task complexity within a fixed architecture
family; characterizing its invariance across fundamentally different architectures (e.g., CNNs,
attention-free models), alternative optimizers
(Adam, second-order methods), and different
training regimes is a natural extension.


### **8 Discussion**

We presented LottaLoRA, a training paradigm
in which every backbone weight is drawn at
random and frozen while only low-rank LoRA
adapters are trained. Across nine benchmarks
spanning feedforward, recurrent, convolutional,
graph, and Transformer architectures, LottaLoRA recovers 96–100% of fully trained
performance while training 0.5–40% of the
parameters (Figure 9). Three mechanistic
findings emerged: (1) the frozen scaffold is
actively exploited ( _β_ _>_ 0 across all architectures) yet its initialization distribution is
interchangeable—any of 22 tested families, from
binary to Gaussian, yields equivalent performance, provided the specific instance remains
frozen throughout training; (2) scaffold stability
is necessary—resampling collapses performance
by up to 51 pp; and (3) the minimum LoRA
rank at which performance saturates varies by
task, providing an empirical estimate of intrinsic
dimensionality. On language modeling at 900 M
parameters, LottaLoRA achieves comparable
loss while training fewer than 0.5% of the
internal parameters, reducing optimizer-state
memory by up to 8 _×_ (Section 6).
On WikiText-103, the gap to full training
narrows from +0.94 nats at 300 M to +0.79 nats
at 900 M parameters. On other tasks (chaotic
dynamics, time series, graph-level and nodelevel classification), LottaLoRA matches or
approaches fully trained baselines, while on
vision tasks pre-trained backbones remain
substantially advantageous (Section 5.5). These
results challenge the assumption that fully
optimized weights are strictly necessary; a
random frozen backbone provides a useful
computational substrate whose effectiveness
is task and scale dependent. Three elements
support this interpretation: (1) the formal
equivalence to Reservoir Computing (Section 4),
(2) the minimum-rank hypothesis (Section 7),
and (3) systematic evaluation across multiple
benchmarks and architectures (Section 5).
Two results stand out. On the CfC PhysioNet ICU mortality benchmark, rank-1
adapters recover 99.5% of the fully trained
CfC baseline AUROC with 3.7% of its parameters. On OGBG-MolHIV, LottaLoRA at _r_ =16
matches the published OGB GIN baseline [20]


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 17



while training only 10.9% of the parameters,
demonstrating generalization from sequential
to graph-level molecular property prediction;
on OGBN-Arxiv, a complementary node-level
task, it recovers 97.6% of baseline with 35.6%
of parameters (Section 5.5). Conversely, on ViT
(Flowers-102), replacing the learned backbone
with random noise costs _∼_ 40 pp—this quantifies
when reservoir quality matters most.
The meta-LoRA collapse (Section 5.3) provides the sharpest evidence that the scaffold is
structurally necessary. Resampling the scaffold
even once per epoch destroys performance—
51 pp on MNIST—because modifying the
reservoir invalidates the reference frame the
readout has learned to exploit [4, 5]. The standard RC remedy—freeze the reservoir, train only
the readout—is not a simplifying assumption
but a necessary one, and LottaLoRA inherits
the same constraint for the same reason.
The learned _β_ scalars remain strictly positive
across all architectures, confirming that the
optimizer actively exploits the frozen backbone
rather than silencing it (Appendix J). The
adapter works _through_ the random weights—
selectively amplifying useful dynamics, much
as the Lottery Ticket Hypothesis [1] posits
that trainable subnetworks hide within random initializations; in LottaLoRA, low-rank
factorization replaces binary masking as the
selection mechanism. The seed-gated specialization experiment (Figure 3) provides the
strongest evidence: adapter and scaffold jointly
determine the network’s function, an instance
of polycomputing [33]. The two regimes are
cleanly separated by _β_ : static scaffolds yield
_β_ _>_ 0 (backbone exploited, with architecturedependent magnitude; Section 5.3), resampled
scaffolds drive _β_ _→_ 0 (backbone silenced).
This joint determination has a practical deployment consequence: because the backbone
is fully determined by a seed, the adapter and
scaffold can be distributed separately—the
LoRA state dictionary released independently
of the reconstruction parameters (seed, distribution specification, framework version)—enabling
polycomputing in practice. The adapter–scaffold
coupling demonstrated by seed-gating resembles
the binding operation central to Hyperdimensional Computing [13]: distinct backbone seeds
produce distinct high-dimensional geometries



that the same adapter navigates differently,
analogous to how bound hypervectors produce
dissimilar representations recoverable by their
components. The hardware implications of
LottaLoRA—tolerance of binary and ternary
backbones, compatibility with device variability
in analog crossbar arrays—connect directly to
HDC’s motivating use case of noise-tolerant
in-memory computing.
This mechanistic picture has a practical
consequence. Because the frozen backbone is
fully determined by a random seed, adapters
trained by different users against the same seed
are interchangeable. This enables a distribution
paradigm in which a single published seed
defines a universal backbone and task-specific
knowledge is exchanged as compact adapter
files—decoupling model distribution from model
training. Unlike standard LoRA, where adapters
are tied to a specific pre-trained checkpoint,
LottaLoRA adapters are portable across any
deployment that reconstructs the same backbone
from the same seed.


**The** **architectural** **ceiling** **and** **the** **role**
**of** **the** **optimizer.** Does the residual gap
between LottaLoRA and fully trained models
reflect fundamental limits of low-rank steering,
or limitations of gradient-based optimization?
Our scaling results show that the gap between
LottaLoRA and full training narrows asymptotically with increasing rank: each additional rank
recovers a decreasing fraction of the remaining
deficit. This implies that the fully trained baseline is the asymptotic ceiling—the maximum
performance the architecture can extract from
the data under a given optimizer—and that
low-rank adapters approach it from below with
diminishing returns. A striking asymmetry
follows: full training reaches this ceiling by
optimizing all _N_ [2] parameters, yet a low-rank
adapter arrives at essentially the same point
with orders of magnitude fewer degrees of
freedom. The surplus parameters in a fully
trained network therefore carry no task-specific
function—on simple tasks like MNIST, the
_W_ seed=0 ablation (Section 5.1) demonstrates
that the task can be encoded entirely in the
low-rank factors. On more complex tasks (e.g.,
ViT on Flowers-102), the scaffold’s structure
provides additional representational capacity
that the adapters exploit, but the task-specific


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 18



_signal_ still resides in the low-rank factors.


**Adapter** **scaling** **narrows** **the** **gap** **further.**
Replacing the standard _α/r_ LoRA scaling with
rank-stabilized scaling ( _α/_ _[√]_ _r_ ; rsLoRA [34])
reduces validation perplexity of the frozenbackbone configuration by 29% at rank 32 at
the 300 M scale (from 159.8 to 113.9, three-seed
mean _±_ std: 0 _._ 36), while standard scaling shows
no improvement beyond rank 8. DoRA [35]
adds only marginal benefit ( _∼_ 0 _._ 4 perplexity
points) on top of rsLoRA. These results indicate
that a substantial portion of the residual gap
is attributable to suboptimal adapter scaling
rather than a fundamental capacity limit of the
frozen backbone, and that the asymptotic ceiling
identified above is closer than standard LoRA
training suggests.


**8.1** **Limitations**


The present Transformer scaling results at four
of five scales represent single-seed runs evaluated
on training loss; multi-seed validation-perplexity
evaluation at the 300 M scale confirms the trend,
but replication across all scales is needed for a
definitive comparison. The ASIC co-design argument (Section 6)—that a fixed random backbone could be hardwired into silicon—rests on
an empirically validated foundation: binary and
2-bit backbones match full-precision performance
across benchmarks (Section 6.1), establishing the
algorithmic precondition for fixed-weight acceleration. The hardware realization itself is beyond
the scope of this work; the algorithmic preconditions are established, and wall-clock throughput
and energy measurements on dedicated accelerators are a natural next step.


**8.2** **Future** **Directions**


Structured rank allocation across layers, explicit
stability analysis of random frozen dynamics, empirical energy measurements on dedicated hardware, and a formal characterization of the relationship between minimum rank and task complexity are all natural next steps.
A deeper question follows naturally from
these results: do similar principles govern
computation in biological neural systems?
During development, neural circuits acquire
random connectivity through noisy developmental processes; during learning, specific



synaptic pathways are strengthened [36]. The
minimum-rank framework suggests a testable
analogy: biological circuits may face similar constraints, with high-dimensional developmental
connectivity steered by low-dimensional plastic
changes [37, 38].
A fundamental open question is why LottaLoRA consistently approaches but never
exceeds the fully trained baseline. The random
backbone provides a qualitatively different
computational substrate; there is no a priori
guarantee that its ceiling must coincide with that
of gradient-optimized weights. One hypothesis is
that the fully trained network already saturates
the architecture’s representational capacity for
a given task, leaving no room for improvement regardless of the backbone—the ceiling
is architectural, not weight-dependent. An
alternative is that gradient-based optimization
of the low-rank factors is itself the bottleneck:
the adapter’s loss landscape over a random
backbone may contain harder-to-navigate saddle
points or plateaus that prevent the optimizer
from finding solutions the architecture could in
principle express. Disentangling architectural
saturation from optimization difficulty is a
natural next step, with implications for both
adapter design and our understanding of what
fully trained networks actually learn.
A related finding concerns the relationship
between model capacity and minimum rank.
On CfC PhysioNet, the published architecture
(92,930 parameters) yields _r_ _[∗]_ =1, yet reducing
the model to 0 _._ 125 _×_ its original size shifts _r_ _[∗]_

to 4 (Table 6). The fully trained baselines themselves improve only from 0 _._ 831 to 0 _._ 836 across
a 42 _×_ parameter range, confirming substantial
overparameterization. This result indicates
that _r_ _[∗]_ measures task complexity _relative_ _to_ _a_
_given_ _architecture_ : an overparameterized model
compresses the task into a lower-rank subspace
than a right-sized one. Controlling for model
capacity is therefore necessary when comparing
_r_ _[∗]_ across tasks, and a capacity-normalized
variant of _r_ _[∗]_ is a natural next step.


**8.3** **Conclusion**


LottaLoRA demonstrates that the degrees of
freedom needed to solve a task concentrate
in a surprisingly small subspace: across nine
benchmarks spanning diverse architecture fam

_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 19



ilies, low-rank adapters over frozen random
backbones recover 96–100% of fully trained performance while training 0.5–40% of parameters.
The specific values of most weights serve as
scaffolding—structurally necessary and actively
exploited, yet interchangeable—implying that
a network’s learned function lives in a lowdimensional subspace whose dimension reflects
the task, not the architecture. This reframing
opens a new perspective: the minimum rank
_r_ _[∗]_ ( _ε_ ) is not merely a compression knob but an
empirical measure of task complexity itself. If
this view holds broadly, then the distributable
size of a neural network becomes a statement
about the problem it solves, not an engineering
choice—and the experimental framework presented here provides the empirical tools to make
that measurement.

### **Acknowledgments**


This publication was made possible through
the support of Grant 62212 from the John
Templeton Foundation and a grant from Templeton World Charity Foundation, Inc. We
also gratefully acknowledge support provided
through a sponsored research agreement with
Astonishing Labs. The opinions expressed
in this publication are those of the author(s)
and do not necessarily reflect the views of the
John Templeton Foundation. The authors
acknowledge the Tufts University High Performance Compute Cluster `[https://it.tufts.](https://it.tufts.edu/high-performance-computing)`
`[edu/high-performance-computing](https://it.tufts.edu/high-performance-computing)` which was
utilized for the research reported in this paper.

### **References**


[1] Jonathan Frankle and Michael Carbin. The
lottery ticket hypothesis: Finding sparse,
trainable neural networks. In _Interna-_
_tional_ _Conference_ _on_ _Learning_ _Representa-_
_tions_, 2019.


[2] Edward J Hu, Yelong Shen, Phillip Wallis, Zeyuan Allen-Zhu, Yuanzhi Li, Shean
Wang, Lu Wang, and Weizhu Chen. LoRA:
Low-rank adaptation of large language models. _arXiv_ _preprint_ _arXiv:2106.09685_, 2021.
Presented at ICLR 2022.


[3] Armen Aghajanyan, Sonal Gupta, and Luke



Zettlemoyer. Intrinsic dimensionality explains the effectiveness of language model
fine-tuning. In _Proceedings_ _of_ _the_ _59th_ _An-_
_nual_ _Meeting_ _of_ _the_ _Association_ _for_ _Com-_
_putational_ _Linguistics_ _and_ _the_ _11th_ _Inter-_
_national_ _Joint_ _Conference_ _on_ _Natural_ _Lan-_
_guage_ _Processing_ _(Volume_ _1:_ _Long_ _Papers)_,
pages 7319–7328, Online, aug 2021. Association for Computational Linguistics.


[4] Herbert Jaeger. The “echo state” approach
to analysing and training recurrent neural
networks. GMD Report 148, GMD   - German National Research Center for Information Technology, 2001.


[5] Wolfgang Maass, Thomas Natschläger, and
Henry Markram. Real-time computing
without stable states: A new framework
for neural computation based on perturbations. _Neural_ _Computation_, 14(11):2531–
2560, 2002.


[6] Hananel Hazan and Larry M. Manevitz.
Topological constraints and robustness in
liquid state machines. _Expert_ _Systems_ _with_
_Applications_, 39(2):1597–1606, 2012.


[7] Hananel Hazan, Simon Caby, Christopher
Earl, Hava T. Siegelmann, and Michael
Levin. Memory via temporal delays in
weightless spiking neural network. _arXiv_
_preprint_ _arXiv:2202.07132_, 2022.


[8] Sheng Shen, Alexei Baevski, Ari Morcos,
Kurt Keutzer, Michael Auli, and Douwe
Kiela. Reservoir transformers. In _Pro-_
_ceedings_ _of_ _the_ _59th_ _Annual_ _Meeting_ _of_ _the_
_Association_ _for_ _Computational_ _Linguistics_
_and_ _the_ _11th_ _International_ _Joint_ _Conference_
_on_ _Natural_ _Language_ _Processing_ _(Volume_ _1:_
_Long_ _Papers)_, pages 4294–4309. Association
for Computational Linguistics, 2021.


[9] Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N
Gomez, Łukasz Kaiser, and Illia Polosukhin.
Attention is all you need. In _Advances_ _in_
_Neural Information Processing Systems_, volume 30, 2017.


[10] Ziqian Zhong and Jacob Andreas. Algorithmic capabilities of random transformers. In
_Advances_ _in_ _Neural_ _Information_ _Processing_
_Systems_, volume 37, 2024.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 20




[11] Bidipta Sarkar, Mattie Fellows,
Juan Agustin Duque, Alistair Letcher,
Antonio León Villares, Anya Sims, Clarisse
Wibault, Dmitry Samsonov, Dylan Cope,
Jarek Liesen, Kang Li, Lukas Seier, Theo
Wolf, Uljad Berdica, Valentin Mohl,
Alexander David Goldie, Aaron Courville,
Karin Sevegnani, Shimon Whiteson, and
Jakob Nicolaus Foerster. Evolution strategies at the hyperscale. _arXiv_ _preprint_
_arXiv:2511.16652_, 2025.


[12] Chunyuan Li, Heerad Farkhoor, Rosanne
Liu, and Jason Yosinski. Measuring the intrinsic dimension of objective landscapes. In
_International_ _Conference_ _on_ _Learning_ _Rep-_
_resentations_, 2018.


[13] Pentti Kanerva. Hyperdimensional computing: An introduction to computing
in distributed representation with highdimensional random vectors. _Cognitive_
_Computation_, 1(2):139–159, 2009.


[14] Denis Kleyko, Dmitri A. Rachkovskij,
Evgeny Osipov, and Abbas Rahimi. A
survey on hyperdimensional computing aka
vector symbolic architectures, part I: Models and data transformations. _ACM_ _Com-_
_puting_ _Surveys_, 55(6):130:1–130:40, 2022.


[15] Ikaro Silva, George Moody, Daniel J Scott,
Leo A Celi, and Roger G Mark. Predicting
in-hospital mortality of ICU patients: The
PhysioNet/Computing in Cardiology Challenge 2012. In _2012_ _Computing_ _in_ _Cardiol-_
_ogy_, pages 245–248. IEEE, 2012.


[16] Ramin Hasani, Mathias Lechner, Alexander
Amini, Daniela Rus, and Radu Grosu. Liquid time-constant networks. In _Proceedings_
_of_ _the_ _AAAI_ _Conference_ _on_ _Artificial_ _Intel-_
_ligence_, volume 35, pages 7657–7666. AAAI
Press, 2021.


[17] Ramin Hasani, Mathias Lechner, Alexander
Amini, Lucas Liebenwein, Aaron Ray, Max
Tschaikowski, and Daniela Rus. Closedform continuous-time neural networks. _Na-_
_ture Machine Intelligence_, 4:992–1003, 2022.


[18] Kaiming He, Xiangyu Zhang, Shaoqing Ren,
and Jian Sun. Deep residual learning for
image recognition. In _Proceedings_ _of_ _the_



_IEEE_ _Conference_ _on_ _Computer_ _Vision_ _and_
_Pattern_ _Recognition_, pages 770–778. IEEE,
2016.


[19] Lili Chen, Kevin Lu, Aravind Rajeswaran,
Kimin Lee, Aditya Grover, Michael Laskin,
Pieter Abbeel, Aravind Srinivas, and Igor
Mordatch. Decision transformer: Reinforcement learning via sequence modeling.
_Advances_ _in_ _Neural_ _Information_ _Processing_
_Systems_, 34:15084–15097, 2021.


[20] Weihua Hu, Matthias Fey, Marinka Zitnik, Yuxiao Dong, Hongyu Ren, Bowen Liu,
Michele Catasta, and Jure Leskovec. Open
graph benchmark: Datasets for machine
learning on graphs. In _Advances_ _in_ _Neural_
_Information_ _Processing_ _Systems_, volume 33,
pages 22118–22133. Curran Associates, Inc.,
2020.


[21] Keyulu Xu, Weihua Hu, Jure Leskovec, and
Stefanie Jegelka. How powerful are graph
neural networks? In _International_ _Confer-_
_ence_ _on_ _Learning_ _Representations_, 2019.


[22] Thomas N. Kipf and Max Welling. Semisupervised classification with graph convolutional networks. In _International_ _Confer-_
_ence_ _on_ _Learning_ _Representations_, 2017.


[23] Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn, Xiaohua Zhai, Thomas Unterthiner, Mostafa Dehghani, Matthias Minderer, Georg Heigold,
Sylvain Gelly, Jakob Uszkoreit, and Neil
Houlsby. An image is worth 16x16 words:
Transformers for image recognition at scale.
In _International_ _Conference_ _on_ _Learning_
_Representations_ . OpenReview.net, 2021.


[24] Maria-Elena Nilsback and Andrew Zisserman. Automated flower classification over
a large number of classes. In _Indian_ _Con-_
_ference_ _on_ _Computer_ _Vision,_ _Graphics_ _and_
_Image_ _Processing_, pages 722–729, 2008.


[25] Andrew L Maas, Raymond E Daly, Peter T Pham, Dan Huang, Andrew Y Ng,
and Christopher Potts. Learning word vectors for sentiment analysis. In _Proceedings of_
_the_ _49th_ _Annual_ _Meeting_ _of_ _the_ _Association_
_for Computational Linguistics:_ _Human Lan-_
_guage_ _Technologies_, pages 142–150. Association for Computational Linguistics, 2011.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 21




[26] Victor Sanh, Lysandre Debut, Julien Chaumond, and Thomas Wolf. DistilBERT, a
distilled version of BERT: smaller, faster,
cheaper and lighter. _arXiv_ _preprint_
_arXiv:1910.01108_, 2019.


[27] Stephen Merity, Caiming Xiong, James
Bradbury, and Richard Socher. Pointer
sentinel mixture models. _arXiv_ _preprint_
_arXiv:1609.07843_, 2016.


[28] Jordan Hoffmann, Sebastian Borgeaud,
Arthur Mensch, Elena Buchatskiy, Trevor
Cai, Eliza Rutherford, Amanda Askell, et al.
Training compute-optimal large language
models. _arXiv_ _preprint_ _arXiv:2203.15556_,
2022.


[29] Hugo Touvron, Thibaut Lavril, Gautier Izacard, Xavier Martinet, Marie-Anne
Lachaux, Timothée Lacroix, Baptiste Rozière, Naman Goyal, Eric Hambro, Faisal
Azhar, Aurelien Rodriguez, Armand Joulin,
Edouard Grave, and Guillaume Lample. LLaMA: Open and efficient foundation language models. _arXiv_ _preprint_
_arXiv:2302.13971_, 2023.


[30] Mohammad Rastegari, Vicente Ordonez,
Joseph Redmon, and Ali Farhadi. XNORNet: ImageNet classification using binary
convolutional neural networks. In _Computer_
_Vision_ _–_ _ECCV_ _2016_, volume 9908 of _Lec-_
_ture_ _Notes_ _in_ _Computer_ _Science_, pages 525–
542. Springer, 2016.


[31] Jinhao Li, Jiaming Xu, Shan Huang,
Yonghua Chen, Wen Li, Jun Liu, Yaoxiu
Lian, Jiayi Pan, Li Ding, Hao Zhou,
Yu Wang, and Guohao Dai. Large language
model inference acceleration: A comprehensive hardware perspective. _arXiv_ _preprint_
_arXiv:2410.04466_, 2024.


[32] Norman P. Jouppi, Cliff Young, Nishant
Patil, David Patterson, Gaurav Agrawal,
Raminder Bajwa, Sarah Bates, Suresh Bhatia, Nan Boden, Al Borchers, et al. Indatacenter performance analysis of a tensor
processing unit. In _Proceedings_ _of_ _the_ _44th_
_Annual_ _International_ _Symposium_ _on_ _Com-_
_puter_ _Architecture_, ISCA ’17, pages 1–12,
Toronto, ON, Canada, 2017. ACM.




[33] Joshua Bongard and Michael Levin. There’s
plenty of room right here: Biological systems as evolved, overloaded, multi-scale machines. _Biomimetics_, 8(1), 2023.


[34] Damjan Kalajdzievski. A rank stabilization
scaling factor for fine-tuning with LoRA.
_arXiv_ _preprint_ _arXiv:2312.03732_, 2024.


[35] Shih-Yang Liu, Chien-Yi Wang, Hongxu
Yin, Pavlo Molchanov, Yu-Chiang Frank
Wang, Kwang-Ting Cheng, and Min-Hung
Chen. DoRA: Weight-decomposed lowrank adaptation. In _Proceedings_ _of_ _the_
_41st_ _International_ _Conference_ _on_ _Machine_
_Learning_, volume 235 of _Proceedings_ _of_
_Machine_ _Learning_ _Research_, pages 32100–
32121. PMLR, 2024.


[36] Chris Fields and Michael Levin. Competency in navigating arbitrary spaces as an
invariant for analyzing cognition in diverse
embodiments. _Entropy_, 24(6), 2022.


[37] Anthony Thomas, Sanjoy Dasgupta, and
Tajana Rosing. A theoretical perspective
on hyperdimensional computing. _Journal_ _of_
_Artificial_ _Intelligence_ _Research_, 72:215–249,
2021.


[38] Juan A. Gallego, Matthew G. Perich, Lee E.
Miller, and Sara A. Solla. Neural manifolds for the control of movement. _Neuron_,
94(5):978–984, 2017.


[39] Menglin Jia, Luming Tang, Bor-Chun Chen,
Claire Cardie, Serge Belongie, Bharath Hariharan, and Ser-Nam Lim. Visual prompt
tuning. In _Computer_ _Vision_ _–_ _ECCV_ _2022:_
_17th_ _European_ _Conference,_ _Tel_ _Aviv,_ _Is-_
_rael, October 23–27, 2022, Proceedings, Part_
_XXXIII_, volume 13693 of _Lecture_ _Notes_ _in_
_Computer_ _Science_, pages 709–727. Springer,
2022.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 22

















































Trainable Frozen Seeded Frozen (reconstructable) Seed (number) Inputs Output


Figure 1: **LottaLoRA** **replaces** **pre-trained** **weights** **with** **seeded** **reservoirs.** Three parameterization strategies for a single network layer. **(a)** A conventional dense layer stores and trains
all _m × n_ weights. **(b)** Low-Rank Adaptation (LoRA) freezes a pre-trained weight matrix _W_ 0 and
learns only two small factors _A_ _∈_ R _[m][×][r]_ and _B_ _∈_ R _[r][×][n]_ ; the stored parameters are _W_ 0 plus the
adapters. **(c)** LottaLoRA (this work) replaces _W_ 0 with a random matrix _W_ seed generated from a
fixed seed, so the backbone is never pre-trained and need not be stored: only the seed and the
low-rank factors _A_, _B_ are saved. The distributable footprint therefore shrinks from the full weight
matrix to a single integer plus two rank- _r_ factors.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 23


Figure 2: **MNIST:** **LottaLoRA** **accuracy** **scales** **monotonically** **with** **LoRA** **rank,** **closing**
**the** **gap** **to** **fully** **trained** **baselines.** **(A)** Accuracy scales monotonically with LoRA rank across
three model sizes, closing the gap to fully trained baselines (dashed); the medium preset (4 layers, widths 512–64; see Appendix B for all presets) reaches 96.8% at rank 8 with only 3.65% of
the parameters of the fully trained counterpart. **(B)** Parameter efficiency shows that each LottaLoRA configuration (circles, squares, triangles) attains comparable accuracy to its fully trained
counterpart (diamonds) using one to two orders of magnitude fewer trainable parameters. **(C)** All
22 _W_ seed initialization families (aggregated across tiny, small, and medium presets) exceed 95% at
rank 8, indicating that on MNIST the specific distribution has negligible effect on performance.
**(D)** Accuracy-vs-rank curves for all 22 families converge tightly, showing that the scaffold is interchangeable on this task.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 24


Figure 3: **A** **single** **shared** **adapter** **produces** **seed-gated** **task** **specialization** **with** **out-**
**of-class** **rejection.** One LoRA adapter is trained across three disjoint MNIST label partitions
( _{_ 1 _,_ 2 _,_ 3 _}_, _{_ 4 _,_ 5 _,_ 6 _}_, _{_ 7 _,_ 8 _,_ 9 _}_ ), each paired with a distinct backbone seed _s_ . Columns show seeds
42, 43, 44; cells show row-normalized test accuracy (%); black rectangles mark assigned classes;
dashed orange columns highlight digit 0 (excluded from all partitions). **Top** **row** **(Experiment** **1,**
**10** **classes):** each seed activates 97–99% accuracy on its assigned digits while non-assigned digits
are confidently misclassified into the in-partition classes. **Bottom** **row** **(Experiment** **2,** **out-of-**
**class):** non-assigned digits are mapped to an explicit out-of-class label (OOC), achieving 93–99%
accuracy on assigned digits and 95–99% OOC classification on non-assigned digits. Digit 0 is
consistently mapped to OOC under all seeds. Configuration: medium preset, rank 4, 150 training
epochs.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 25


Figure 4: **LottaLoRA** **AUROC** **saturates** **at** **rank** **2** **on** **PhysioNet** **2012** **ICU** **mortality.**
Mean _±_ std AUROC over 5 seeds at ranks 1–32. Dashed line: fully trained CfC baseline (0.836).
Rank 1 recovers 99.5% of baseline with 3.7% of trainable parameters.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 26



102


100


98


96


94


92



(a) Rank saturation shifts rightward

as model capacity decreases



(b) Baseline AUROC is nearly flat:
the task does not need 93K parameters





|Col1|Col2|Col3|Col4|Col5|Col6|
|---|---|---|---|---|---|
|||||||
|||||||
|||||||
|~~ AURO~~|~~ AURO~~|~~ AURO~~|~~ AURO~~|h=2<br>~~ = 0.005~~|5|
|~~ AURO~~|~~ AURO~~|||||
|~~h=64~~<br> <br>across 42|~~h=64~~<br> <br>across 42|<br>across 42|<br>across 42|<br> × params||
|~~h=64~~<br> <br>across 42|~~h=64~~<br> <br>across 42|<br>across 42|~~64~~|~~64~~|~~64~~|
|h=|32<br>|32<br>||||
|||||||


10 [4] 10 [5]

Total Parameters (log scale)



0.8450


0.8425


0.8400


0.8375


0.8350


0.8325


0.8300


0.8275


0.8250






|Col1|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
||||||
||||||
||93.7%<br>(r = 1, h =|2)|99% recovery<br>h=32  (0.125×, 2,210 p<br>h=64  (0.25×, 7,106 pa|arams)<br>    ams)|



1 2 4 8
LoRA Rank r



Figure 5: **Overparameterization masks rank saturation on CfC PhysioNet.** **(a)** LottaLoRA
recovery (normalized to each scale’s fully trained baseline) vs. LoRA rank at four CfC sizes. At
0 _._ 125 _×_ ( _h_ =32, 2,210 parameters), rank 1 recovers only 93.7% and saturation shifts to _r_ =4; at larger
scales rank 1 already exceeds 98.8%. **(b)** Fully trained baselines improve only from 0.831 to 0.836
across a 42 _×_ parameter increase, confirming that the published CfC architecture is far larger than
this task requires. See Appendix C for the full overparameterization analysis.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 27


Figure 6: **LottaLoRA narrows the gap to full training as backbone size increases.** Training
loss curves on WikiText-103 at five scales (3 M to 900 M); colored curves show LottaLoRA (hue
encodes scale, lightness encodes rank), grayscale shows fully trained baselines. At 900 M, the best
LottaLoRA run (rank 8) reaches 3.950 vs 3.156 for full training, while training fewer than 0.5% of
the internal parameters.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 28


Figure 7: **A** **large** **frozen** **backbone** **with** **few** **LoRA** **parameters** **outperforms** **a** **small**
**fully** **trained** **model.** Each colored curve shows LottaLoRA at one backbone scale across ranks;
gray squares show fully trained baselines. At 900 M, rank-8 LottaLoRA (3.6 M trainable) achieves
loss 3.950, while the fully trained 3 M model (320 K trainable) reaches only 5.007.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 29


Rank Saturation Across Tasks:
Different Tasks Require Different Minimum Ranks



100


95


90


85


80


75


70


65


60














|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|ViT: flat from<br>(backbone do|r = 4<br>minate|
|---|---|---|---|---|---|---|---|---|---|
|||||||MNIST: satura<br> <br>|MNIST: satura<br> <br>|tes||
||~~IMDB: 99.3%~~<br>(0.48% para|~~  atr = 8~~<br> ms)|MolHIV:<br>97.5% r|covery||<br>atr<br>16--32|<br>atr<br>16--32|||
|||||||OGB<br>satu|OGB<br>satu|N-Arxiv:<br>rates nearr = 16--32||
||||||||M<br>C<br>~~C~~<br>|NIST MLP (medium<br>IFAR-10 Plain-20<br>~~fC PhysioNet~~<br>|)|
||||||||<br>(I<br>C<br>(I<br>|<br>CU mortality, 1 × )<br>fC PhysioNet<br>CU mortality, 0.12<br>|5 × )|
|||||||||<br>olHIV (GIN)<br>GBN-Arxiv (GCN)<br>T HalfCheetah<br>||
||CfC 0.<br>(overp|125 × : saturates atr <br>arameterization rem|= 4<br> oved)||||<br>~~(~~<br>V<br>(p<br>|<br>~~oise_lora)~~<br>iT Flowers-102<br>retrained backbon<br>|e)|
||CfC 1|× : flat fromr = 1|||||~~I~~<br>(<br>9<br>|~~DB Sentiment~~<br>DistilBERT)<br>5% recovery<br>||
||||||||~~9~~|~~% recovery~~||



1 2 4 8 16 32 64 128
LoRA Rank r


Figure 8: **Different** **tasks** **saturate** **at** **different** **minimum** **ranks,** **reflecting** **intrinsic** **di-**
**mensionality.** Each curve shows LottaLoRA performance (normalized as % of fully trained baseline recovered) against LoRA rank. CfC PhysioNet (ICU mortality) is flat from _r_ =1 at the published architecture scale; a size-reduction ablation (Table 6) shows that saturation shifts rightward
when model capacity is reduced, indicating that overparameterization contributes to the flat curve;
MNIST and CIFAR-10 saturate between _r_ =8 and _r_ =32; Decision Transformer (offline RL) reaches
100% recovery near _r_ =16–32; ViT with a pre-trained backbone is nearly flat from _r_ =4, indicating the backbone—not the adapter rank—limits performance. MolHIV recovers 97.5% at _r_ =16 on
molecular property prediction. OGBN-Arxiv (node classification) saturates near _r_ =16–32, recovering 98.5% of baseline. IMDB sentiment (DistilBERT) recovers 99.3% at _r_ =8 with 0.48% trainable
parameters.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 30


Figure 9: **LottaLoRA** **recovers** **96–100%** **of** **baseline** **performance** **across** **eight** **bench-**
**marks.** Each bar shows the ratio of LottaLoRA to baseline performance (accuracy, _R_ [2], or inverted
MSE as appropriate); annotations give the trainable parameter ratio. Data from Tables 14, 5, 7,
and 21.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 31

### **Use of Large Language Models**


Claude (Opus 4.6, Anthropic) and Gemini (3 Pro, Google) were used as agentic coding assistants
throughout this project: for experiment orchestration (SLURM script generation, result intake
pipelines), data visualization, manuscript drafting and structural revision, and compilation of technical details from the codebase into appendix material. These tools were not used for research
ideation or experimental design. All AI-generated outputs—including code, prose, and technical
specifications—were reviewed, verified, and refined by the authors, who take full responsibility for
the accuracy and integrity of this work.

### **A Transformer Quantitative Comparison**


All five Transformer scales use a LlamaForCausalLM architecture with RMSNorm, rotary positional
embeddings (RoPE), SiLU activations, and tied word embeddings (vocabulary size 32,000). Table 11
specifies the architecture at each scale.


Table 11: Transformer architecture specifications for the WikiText-103 scaling experiments. All
scales share the same tokenizer (TinyLlama, 32,000 vocabulary), RMSNorm, and RoPE.


Scale Layers Hidden dim Heads MLP dim Total params


3 M 6 64 4 192 2.4 M
30 M 10 384 6 1,024 30.0 M
300 M 22 1,024 16 2,816 315.4 M
600 M 30 1,344 21 3,584 693.4 M
900 M 34 1,664 26 4,608 1,212.0 M


Training uses AdamW (learning rate 10 _[−]_ [4], weight decay 0.1) with cosine learning rate schedule
and 200-step warmup. LoRA adapters (ranks _r_ _∈{_ 1 _,_ 2 _,_ 4 _,_ 8 _}_, _α_ =16, dropout 0.0) are applied to
all attention projections ( _WQ_, _WK_, _WV_, _WO_ ); the backbone is frozen with a trainable per-layer _β_
scalar. Batch size is 32 with 128-token blocks; each run trains for one epoch (34,429 steps).
Table 12 reports final training loss and trainable parameter counts for every configuration.

### **B MNIST Full Results**


**Training** **configuration.** All MNIST experiments use AdamW (learning rate 10 _[−]_ [3], weight decay
10 _[−]_ [2] ), batch size 128, 20 epochs, and cosine annealing learning rate schedule. Input images (28 _×_ 28)
are normalized (mean = 0 _._ 1307, std = 0 _._ 3081) and flattened. The train set is split 90/10 into
training/validation.


**Architecture** **presets.** Four fully connected architectures are tested, all with ReLU activations
and dropout 0.1: **tiny** : 2 hidden layers ( _d_ = 128 _,_ 64); **small** : 3 layers ( _d_ = 256 _,_ 128 _,_ 64); **medium** :
4 layers ( _d_ = 512 _,_ 256 _,_ 128 _,_ 64); **large** : 5 layers ( _d_ = 1024 _,_ 512 _,_ 256 _,_ 128 _,_ 64). Input dimension is 784
(flattened 28 _×_ 28); output is a 10-class softmax.


_W_ **seed** **initialization** **families** **(22** **total).** Table 13 lists all 22 initialization families with their
definitions and default parameters. All families use fan-in scaling ( _σ_ = 1 _/_ _[√]_ _d_ in) unless the family
defines its own variance schedule (e.g., Kaiming, Xavier).


**B.1** **Full** **vs** **LottaLoRA** **rank** **sweep** **(30** **runs)**


The four architecture presets differ in depth and width: **tiny** uses two hidden layers ( _d_ =128 _,_ 64),
**small** three layers ( _d_ =256 _,_ 128 _,_ 64), **medium** four layers ( _d_ =512 _,_ 256 _,_ 128 _,_ 64), and **large** five layers
( _d_ =1024 _,_ 512 _,_ 256 _,_ 128 _,_ 64), all with ReLU activations and dropout 0.1. Gap shrinks with model size


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 32


Table 12: Final training loss on WikiText-103 and parameter counts for full training and LottaLoRA
across all backbone scales and ranks. “Internal” denotes transformer-internal trainable parameters.
Ratio is the internal count as a percentage of the same-scale full baseline.


Method Rank Total params Internal trainable Ratio (%) Final loss


Full (3M)      - 2,368,320 320,320 100.00 5.007
LottaLoRA (3M) 1 2,371,416 3,096 0.97 5.855
LottaLoRA (3M) 2 2,374,488 6,168 1.93 5.781
LottaLoRA (3M) 4 2,380,632 12,312 3.84 5.682
LottaLoRA (3M) 8 2,392,920 24,600 7.68 5.639


Full (30M)      - 29,990,784 17,702,784 100.00 3.757
LottaLoRA (30M) 1 30,021,544 30,760 0.17 4.870
LottaLoRA (30M) 2 30,052,264 61,480 0.35 4.798
LottaLoRA (30M) 4 30,113,704 122,920 0.69 4.728
LottaLoRA (30M) 8 30,236,584 245,800 1.39 4.681


Full (300M)      - 315,405,312 282,637,312 100.00 3.252
LottaLoRA (300M) 1 315,585,624 180,312 0.06 4.368
LottaLoRA (300M) 2 315,765,848 360,536 0.13 4.286
LottaLoRA (300M) 4 316,126,296 720,984 0.26 4.227
LottaLoRA (300M) 8 316,847,192 1,441,880 0.51 4.191


Full (600M)      - 693,370,944 650,362,944 100.00 3.185
LottaLoRA (600M) 1 693,693,624 322,680 0.05 4.229
LottaLoRA (600M) 2 694,016,184 645,240 0.10 4.146
LottaLoRA (600M) 4 694,661,304 1,290,360 0.20 4.099
LottaLoRA (600M) 8 695,951,544 2,580,600 0.40 4.058


Full (900M)      - 1,212,039,296 1,158,791,296 100.00 3.156
LottaLoRA (900M) 1 1,212,492,040 452,744 0.04 4.160
LottaLoRA (900M) 2 1,212,944,648 905,352 0.08 4.096
LottaLoRA (900M) 4 1,213,849,864 1,810,568 0.16 3.989
LottaLoRA (900M) 8 1,215,660,296 3,621,000 0.31 3.950


at fixed rank: _−_ 2 _._ 65 pp (tiny) to _−_ 1 _._ 58 pp (medium) at _r_ =8, consistent with the control-theoretic
prediction that larger reservoirs are easier to steer via low-rank feedback.


**B.2** _W_ **seed** **distribution** **robustness** **(2,640** **runs,** **22** **families)**


Figure 10 reproduces the full heatmap and rank-scaling curves for all 22 _W_ seed initialization families summarized in Table 3 of Section 5.2. Each family was tested across four LoRA ranks
( _r_ _∈{_ 2 _,_ 4 _,_ 8 _,_ full _}_ ) using the **medium** preset (four hidden layers: _d_ =512 _,_ 256 _,_ 128 _,_ 64), 5 seeds
per family (120 runs per rank, 2,640 total).


**B.3** **LoRA** **B-matrix** **initialization** **(32** **runs)**


Two B-matrix initialization strategies are compared: **zeros** (standard, preserving the pre-trained
trajectory at initialization) and **kaiming_uniform** (breaking symmetry).
Table 15 shows that at rank 1, kaiming causes severe underfitting that worsens with model size
( _−_ 2 _._ 35 pp for tiny, _−_ 30 _._ 77 pp for large). By rank 8, both initializations converge to within 0.2 pp.
Under 3-seed robust evaluation (varying the reservoir seed), kaiming shows _higher_ mean accuracy
at rank 8 (e.g. tiny: 85.2% vs 60.0%), suggesting that symmetry-breaking at initialization produces
solutions less dependent on the specific reservoir realization.


**B.4** **Output** **head** **configuration** **(48** **runs)**


Three output-layer configurations are compared: **full** (standard trainable linear head, 650 params
for 10 classes), **lora** (LoRA-parameterized output, 0 output params), and **lora_bias** (LoRA output


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 33


Table 13: The 22 _W_ seed initialization families used in the distribution robustness experiment (Section 5.2).


Family Distribution Key parameters


_Standard_
Normal _N_ (0 _, σ_ [2] ) _σ_ = 1 _._ 0
Trunc. Normal _N_ (0 _, σ_ [2] ) clipped at _±_ 2 _σ_ _σ_ = 1 _._ 0
Uniform _U_ ( _−a, a_ ) _a_ = 0 _._ 1
Orthogonal Orthogonal matrix gain = 1 _._ 0



_Scale-aware_
_√_
Kaiming Normal _N_ (0 _,_ 2 _/_ fan_in(1 + _a_ [2] )) _a_ =



Kaiming Normal _N_ (0 _,_ 2 _/_ fan_in(1 + _a_ )) _a_ = 5

_√_
Kaiming Uniform _U_ ( _−b, b_ ), _b_ = �6 _/_ fan_in(1 + _a_ [2] ) _a_ = 5



Kaiming Uniform _U_ ( _−b, b_ ), _b_ = 6 _/_ fan_in(1 + _a_ [2] ) _a_ = 5

Xavier Normal _N_ (0 _,_ 2 _/_ (fan_in + fan_out)) gain = 1 _._ 0
Xavier Uniform _U_ ( _−b, b_ ), _b_ = �6 _/_ (fan_in + fan_out) gain = 1 _._ 0
Spectral Radius _N_ (0 _,_ 1) rescaled to _ρ_ max = _ρ_ _ρ_ = 0 _._ 95



_Heavy-tailed_
Cauchy Cauchy(0 _, s_ ), clipped at _±_ 10 _s_ _s_ = 0 _._ 1
Laplace Laplace(0 _, b_ ) _b_ = 0 _._ 1
Student- _t_ _tν_ _ν_ = 3


_Mixture_ _/_ _Sparse_
Gaussian Mixture 0 _._ 9 _N_ (0 _,_ 0 _._ 05 [2] ) + 0 _._ 1 _N_ (0 _,_ 0 _._ 5 [2] )       Sparse Normal (1 _−_ _p_ ) _N_ (0 _, σ_ [2] ) + _p δ_ 0 _p_ = 0 _._ 2
Sparse Erdős-Rényi Same as sparse normal _p_ = 0 _._ 2


_Other_ _distributions_
Beta Beta( _α, β_ ) scaled to [ _−_ 0 _._ 1 _,_ 0 _._ 1] _α_ = _β_ = 2
Exponential Exp( _λ_ ) _−_ 1 _/λ_ (centered) _λ_ = 10


_Low-bit_ _quantized_
16-bit _N_ (0 _,_ 1) quantized to 2 [16] levels        8-bit _N_ (0 _,_ 1) quantized to 2 [8] levels        4-bit _N_ (0 _,_ 1) quantized to 2 [4] levels        2-bit _N_ (0 _,_ 1) quantized to 2 [2] levels        Binary sign( _N_ (0 _,_ 1)) _∈{−_ 1 _,_ +1 _}_       

with 10 trainable bias terms).
Table 16 shows that at rank 1, replacing the full output head with a LoRA-parameterized version
costs 4–18 pp (large model: catastrophic drop from 92.2% to 74.1% for lora, 69.3% for lora+bias).
At rank _≥_ 4, all modes converge within _∼_ 1 pp. The parameter savings are modest ( _∼_ 650 params,
3–7% of the trainable budget at rank 4), so the full output head remains the recommended default.
Under robust evaluation, the full head also maintains significantly better reservoir robustness at
rank _≥_ 4 (tiny _r_ =8: 60.0% vs 32.1%/26.7%), suggesting the standard output head helps generalize
across reservoir realizations.

### **C CfC Reservoir on PhysioNet 2012 ICU Mortality**


**Dataset.** PhysioNet 2012 [15] is a real-world ICU benchmark derived from the MIMIC-II database.
Each record consists of 37 clinical variables (vital signs and lab measurements) recorded during the
first 48 hours of an ICU stay; the prediction target is in-hospital mortality (binary; positive rate
_≈_ 8%, class imbalance 11.7:1). We use 3,200 train / 800 test records.


**Architecture.** The backbone is a Closed-form Continuous-time network (CfC [17]) with hidden
size 256 and 2 backbone layers of 64 units each (backbone parameter count: 91,264). A linear
readout maps the final hidden state to a scalar logit. For LottaLoRA, the backbone weights are


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 34


Table 14: MNIST full-vs-LottaLoRA comparison across three presets and multiple ranks. Medium
preset values are means over 2 runs; tiny and small are from 2 runs (seed 42, normal _W_ seed, scale
0.1).


Method Test Acc (%) Trainable Ratio (%)


Full_tiny 98.06 109,386 100.00
Full_small 98.37 242,762 100.00
Full_medium 98.38 575,050 100.00


LottaLoRA_tiny_r1 85.06 1,756 1.49
LottaLoRA_tiny_r2 90.60 2,860 2.42
LottaLoRA_tiny_r4 93.56 5,068 4.28
LottaLoRA_tiny_r8 95.41 9,484 8.02


LottaLoRA_small_r1 87.51 2,269 0.93
LottaLoRA_small_r8 96.19 13,581 5.31


LottaLoRA_medium_r1 89.33 3,294 0.57
LottaLoRA_medium_r2 92.73 5,934 1.03
LottaLoRA_medium_r4 95.44 11,214 1.95
LottaLoRA_medium_r8 96.80 21,774 3.65
LottaLoRA_medium_r16 97.53 42,894 7.46
LottaLoRA_medium_r32 97.80 85,134 14.80


Table 15: MNIST test accuracy (%) by LoRA B-init and rank (seed 42). Zeros dominates at rank 1;
the gap closes at higher ranks.


Preset B-init _r_ =1 _r_ =2 _r_ =4 _r_ =8


tiny zeros 86.47 90.38 93.47 95.65
tiny kaiming 84.12 90.03 92.73 95.53


small zeros 87.68 91.07 94.64 96.24
small kaiming 75.23 89.93 93.27 96.03


medium zeros 89.40 92.92 95.74 96.94
medium kaiming 70.59 90.19 94.38 96.96


large zeros 92.08 94.83 96.70 97.37
large kaiming 61.31 92.10 95.73 97.29


frozen at random initialization; LoRA adapters (∆ _W_ = _BA_, rank _r_ ) are inserted into each recurrent
layer. The readout and learnable scalar _β_ are the only additional trainable parameters.


**Training.** All runs use AdamW (base learning rate 2 _×_ 10 _[−]_ [3], exponential decay 0 _._ 9 per epoch, weight
decay 4 _×_ 10 _[−]_ [6], batch size 128) for a fixed 100 epochs. Positive-class weighting of 11 _._ 69 compensates
for the class imbalance. Seeds: 42, 100, 123, 200, 300 (5 per rank).


**Rank** **sensitivity.** AUROC is flat from rank 1 onward (Table 17, Figure 11); the gap between the
best LottaLoRA configuration ( _r_ =2, AUROC 0 _._ 835) and the full baseline (0 _._ 836) is 0 _._ 001—within
one standard deviation of either estimate.

### **D OGBG-MolHIV Molecular Property Prediction**


**Setup.** We use a Graph Isomorphism Network (GIN) [21] with GINEConv layers [20] that encode
both atom and bond features, hidden dimension 300, 5 layers, dropout 0.5, and skip connections for
layers 1–4. The standard OGB scaffold split is used (binary classification: HIV activity prediction,
41,127 molecular graphs). Training uses Adam (learning rate 1 _×_ 10 _[−]_ [3] ) for 300 epochs with batch size


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 35


Table 16: MNIST test accuracy (%) by output head mode and rank (seed 42). Full output dominates
at low rank; all modes converge by rank 4.


Preset Output _r_ =1 _r_ =2 _r_ =4 _r_ =8


tiny full 86.46 90.38 93.47 95.65
tiny lora 75.74 87.96 92.70 95.40
tiny lora+bias 77.83 88.30 92.90 95.47


small full 87.68 91.07 94.64 96.26
small lora 83.20 90.15 94.27 96.21
small lora+bias 85.06 90.92 94.24 96.27


medium full 89.40 92.92 95.68 96.94
medium lora 87.08 93.01 95.09 97.24
medium lora+bias 88.65 93.10 94.75 97.06


large full 92.16 94.83 96.70 97.37
large lora 74.05 94.84 96.61 97.37
large lora+bias 69.25 94.92 96.32 97.40


Table 17: CfC PhysioNet rank sensitivity: mean AUROC _±_ std over 5 seeds. %Trainable is relative
to the Full CfC parameter count (92,930).


Rank AUROC #Trainable params %Trainable


1 0 _._ 8321 _±_ 0 _._ 0047 3,482 3.7%
2 0 _._ 8351 _±_ 0 _._ 0046 5,292 5.7%
4 0 _._ 8344 _±_ 0 _._ 0020 8,912 9.6%
8 0 _._ 8327 _±_ 0 _._ 0013 16,152 17.4%
16 0 _._ 8337 _±_ 0 _._ 0006 30,632 25.1%
32 0 _._ 8330 _±_ 0 _._ 0028 59,592 39.5%


Full CfC 0 _._ 8364 _±_ 0 _._ 0017 92,930 100%


64 and gradient clipping (norm 1.0). Class imbalance ( _∼_ 4:1 negative-to-positive ratio) is handled
via `pos_weight` scaling in the binary cross-entropy loss. In the LottaLoRA condition, all GIN MLP
linear layers are frozen and replaced with _W_ eff = _β W_ seed + _BA_ ; _W_ seed is initialized with fan-in-scaled
Gaussian noise ( _σ_ = 1 _/_ _[√]_ _d_ in _≈_ 0 _._ 058). The classification head remains a plain `nn.Linear(300,` `1)`,
always fully trainable. We sweep ranks _r_ _∈{_ 8 _,_ 16 _,_ 32 _}_ . Results are averaged over 5 seeds (42, 100,
123, 456, 789).


**Results.** Table 18 reports the full results. The fully trained baseline achieves ROC-AUC 0 _._ 7755 _±_
0 _._ 0060, which closely matches the published OGB GIN+virtual-node result (0 _._ 7707 _±_ 0 _._ 0149 [20]),
validating our implementation despite not using a virtual node. LottaLoRA at _r_ =16 achieves
0 _._ 7562 _±_ 0 _._ 0158, recovering 97.5% of baseline while training only 10.9% of the parameters (203 K of
1.86 M). This score matches the published OGB GIN baseline (0 _._ 7558 _±_ 0 _._ 0140 [20]), demonstrating
that a frozen-backbone GIN with low-rank adapters performs on par with a fully trained GIN.
Figure 12 visualizes these results alongside the published OGB baselines. Rank _r_ =16 is the sweet
spot: _r_ =8 slightly underperforms due to limited adapter capacity, while _r_ =32 shows decreasing
marginal gains—and slight degradation, likely from overfitting the small positive class ( _∼_ 20% of
training graphs). This non-monotonic pattern is consistent with the minimum-rank hypothesis
(Section 7): the intrinsic dimensionality of molecular HIV activity prediction lies near _r_ _≈_ 16.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 36


Table 18: **LottaLoRA** **matches** **the** **published** **OGB** **GIN** **baseline** **on** **OGBG-MolHIV**
**while** **training** **10.9%** **of** **the** **parameters.** Test ROC-AUC (5 seeds). Published GIN baseline:
0 _._ 7558 _±_ 0 _._ 0140 [20].


Method Rank Mean ROC-AUC Std Trainable


Baseline (fully trained)       - 0.7755 0.0060 1,863,906 (100%)
LottaLoRA _r_ =8 0.7520 0.0194 131,416 (7.1%)
LottaLoRA _r_ =16 **0.7562** 0.0158 203,416 (10.9%)
LottaLoRA _r_ =32 0.7456 0.0152 347,416 (18.6%)

### **E OGBN-Arxiv Node Classification**


**Setup.** We replicate the exact OGB GCN baseline protocol [20]: a Graph Convolutional Network
(GCN) [22] with 3 layers, hidden dimension 256, BatchNorm, dropout 0.5, and the standard OGB
temporal split (40-class node classification on 169,343 nodes from a citation graph). Training uses
Adam (learning rate 1 _×_ 10 _[−]_ [2], weight decay 0) for 500 epochs. The published reference accuracy
is 71 _._ 74 _±_ 0 _._ 29%. In the LottaLoRA condition, all GCN linear layers are frozen and replaced with
_W_ eff = _β W_ seed + _BA_ ; _W_ seed is initialized with fan-in-scaled Gaussian noise. The classification head
remains fully trainable. We sweep ranks _r_ _∈{_ 1 _,_ 2 _,_ 4 _,_ 8 _,_ 16 _,_ 32 _}_ . Results are averaged over 10 seeds.


**Results.** Table 19 reports the full results. Our fully trained baseline achieves 71 _._ 86 _±_ 0 _._ 22% test
accuracy, closely matching the published OGB GCN baseline (71 _._ 74 _±_ 0 _._ 29% [20]), validating our
reproduction. LottaLoRA at _r_ =32 achieves 70 _._ 11 _±_ 0 _._ 21%, recovering 97.6% of baseline while
training only 39,171 parameters (35.6% of the baseline’s 110,120). Rank 1 degrades substantially
( _∼_ 57%), consistent with the minimum-rank hypothesis: 40-class node classification requires more
adapter capacity than binary molecular classification (MolHIV). Figure 13 visualizes the rank sweep.


Table 19: **LottaLoRA** **recovers** **97.6%** **of** **baseline** **GCN** **accuracy** **on** **OGBN-Arxiv** **while**
**training** **35.6%** **of** **the** **parameters.** Test accuracy (10 seeds). Published OGB GCN baseline:
71 _._ 74 _±_ 0 _._ 29% [20].


Rank Acc (%) Std % Trainable


Baseline 71.86 0.22 100%


_r_ =32 **70.11** 0.21 35.6%
_r_ =16 69.04 0.14 18.3%
_r_ =8 67.51 0.24 9.6%
_r_ =4 65.21 0.40 5.3%
_r_ =2 61.96 0.53 3.1%
_r_ =1 57.48 1.40 2.0%

### **F Vision Transformer (Flowers-102)**


All prior benchmarks in this paper operate on sequential or graph-structured domains. To assess whether the reservoir-control framework extends to dense spatial representations, we apply
LottaLoRA to a Vision Transformer (ViT-Base/16) [23] on Oxford Flowers-102 [24], a 102-class
fine-grained image classification dataset (2,040 training images after merging the official train and
validation splits, 6,149 test images).


**Setup.** The backbone is initialized from an ImageNet-1k pre-trained ViT-B/16 checkpoint. In the
LottaLoRA condition, the six projection matrices per transformer block ( _WQ, WK, WV, WO_ and the


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 37


two MLP projections) are replaced with frozen random noise matrices _W_ seed _∼N_ (0 _,_ 1 _/d_ ) plus trainable low-rank adapters _AB_ of rank _r_ . The patch embedding, positional embedding, layer norms,
and classification head remain trainable in all conditions. The baseline is standard full fine-tuning
of all 85.9 M parameters. Both conditions share the same training protocol: AdamW (learning rate
2 _×_ 10 _[−]_ [4], weight decay 0.05, batch size 64, gradient accumulation 2 steps) with cosine learning rate
schedule (10% warmup), label smoothing 0.1, and strong augmentation (RandAugment: 2 ops, magnitude 9; Mixup _α_ =0 _._ 2, probability 0.8; CutMix _α_ =1 _._ 0, probability 0.5; random erasing probability
0.25). Evaluation uses EMA (decay 0.9997) and horizontal-flip TTA. Training runs for 300 epochs
with early stopping (patience 12). Pre-trained weights are from torchvision (IMAGENET1K_V1).


**Results.** Table 20 reports Top-1 accuracy (5 seeds per condition). LottaLoRA with _r_ =1 (1.19%
trainable parameters) already reaches 94.53%, recovering **97.6%** of the full fine-tuning baseline
accuracy. At _r_ =64 (11.89%), the gap narrows to 1.9 pp. All ranks from _r_ =1 to _r_ =64 fall within a
0.9 pp band, confirming extreme rank insensitivity.


Table 20: ViT-Base/16 on Flowers-102 (5 seeds, 300 epochs, pre-trained ImageNet-1k init).
LottaLoRA replaces attention and MLP projections with frozen random matrices plus low-rank
adapters. The random backbone condition uses a randomly initialized (non-pre-trained) ViT.


Method Rank Mean Top-1 Std Trainable Ratio


Baseline (full fine-tune)       - 96.83% 0.08% 100%


LottaLoRA (pre-trained) 1 94.53% 0.35% 1.19%
LottaLoRA (pre-trained) 4 93.99% 0.28% 1.76%
LottaLoRA (pre-trained) 8 94.01% 0.35% 2.51%
LottaLoRA (pre-trained) 32 94.68% 0.22% 6.76%
LottaLoRA (pre-trained) 64 94.89% 0.16% 11.89%


LottaLoRA (random backbone) 16 54.27% 0.72% 3.97%
LottaLoRA (random bk + LN) 16 55.56% 0.73% 4.15%


**Rank** **sensitivity.** Accuracy is nearly flat across ranks: _r_ =1 (94.53%) to _r_ =64 (94.89%) spans
only 0.9 pp despite a 10 _×_ increase in trainable parameters (Figure 14A). This contrasts with the
monotonic rank–accuracy relationship observed on MNIST and NCP tasks, suggesting that on
Flowers-102 the learned backbone already provides features rich enough that even a single-rank
adapter suffices.


**Reservoir** **quality** **decomposition.** Replacing the learned backbone with a randomly initialized
one (holding all other settings constant) drops accuracy from 94.01% to 54.27%—a _∼_ 40 pp gap
(Figure 14C). Adding composed-path LayerNorm to the random backbone recovers only +1.3 pp
(55.56%). This decomposition directly quantifies the _reservoir_ _quality_ hypothesis: the learned
attention weights constitute a high-quality reservoir whose structured representations are exploited
by the low-rank controller, whereas a random reservoir lacks the spatial inductive biases needed for
fine-grained visual classification.


**Relation** **to** **published** **parameter-efficient** **methods.** These results are not state of the art on
Flowers-102. Standard LoRA [2] achieves 96–98% and Visual Prompt Tuning (VPT) [39] exceeds
98%, both by _preserving_ the full pre-trained weight manifold and adding small learned corrections. Importantly, those pre-trained backbones themselves required thousands of GPU hours on
ImageNet-scale data—resources that embody the very “intelligence” our experiment aims to localize. Our goal is not to compete with methods that inherit this investment intact, but to answer a
different question: _how_ _much_ _of_ _the_ _learned_ _reservoir_ _structure_ _is_ _actually_ _needed,_ _and_ _where_ _does_ _it_
_reside?_


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 38


LottaLoRA _replaces_ six dense projection matrices per block with uncorrelated Gaussian noise,
retaining only the patch embedding, positional encoding, layer norms, and classification head. Because these projections are fully connected layers—precisely the layer type where LottaLoRA excels
across all benchmarks in this paper—the adapter can reconstruct most of the functional pathway
from scratch (Figure 14D). The 2.8 pp gap at _r_ =4 quantifies the cost of discarding the learned
attention structure: it is the residual information that the low-rank controller cannot recover from
a noisy medium. The dominant factor is therefore not the adapter but the _reservoir_ : the structured
spatial dynamics of a learned reservoir—analogous to the neuroscience observation that cortical
“smart areas” (e.g., visual cortex) require far more developmental resources than relay nuclei, even
though the total information flow through both is comparable.
Across the full experimental arc, reservoir quality requirements form a task-dependent spectrum.
On low-dimensional tasks (Lorenz: _R_ [2] = 0 _._ 9999 at rank 1; MNIST: 96% at rank 8), random reservoirs already provide sufficient mixing and a learned reservoir is unnecessary. On high-dimensional
tasks such as fine-grained 102-class visual classification from 2,040 training images, the reservoir
must encode spatial inductive biases that random projections cannot supply. This spectrum is itself
a contribution: it provides a principled framework for predicting _when_ random initialization will
suffice and when a learned reservoir remains essential—a question that existing parameter-efficient
methods do not address because they never discard the pre-trained weights.

### **G IMDB Sentiment Classification**


All prior benchmarks in this paper operate on vision, time-series, graph, or reinforcement learning domains. IMDB sentiment classification extends LottaLoRA to _natural_ _language_ _processing_ :
binary classification of movie reviews using a pre-trained DistilBERT [26] backbone on the IMDB
dataset [25] (25,000 training reviews, 25,000 test reviews).


**Setup.** The model is a 3-layer Transformer decoder (embedding dimension 256, 4 heads, FFN multiplier 4) initialized from a DistilBERT tokenizer ( `bert-base-uncased`, max length 512). In the LottaLoRA condition, all attention projection matrices are replaced with fan-in-scaled frozen random
matrices _W_ seed _∼N_ (0 _,_ 1 _/d_ in) plus trainable low-rank adapters of rank _r_ _∈{_ 1 _,_ 2 _,_ 4 _,_ 8 _,_ 16 _,_ 32 _}_ . LoRA
is applied to attention projections only (not FFN). The classification head and all bias/normalization
parameters remain trainable. The baseline is full fine-tuning of all 10.3 M parameters. Both conditions share the same training protocol: AdamW (learning rate 5 _×_ 10 _[−]_ [4], weight decay 0.01, batch
size 32, gradient clipping 1.0) with 10% linear warmup, LoRA dropout 0.05, model dropout 0.1,
and early stopping (patience 7, _δ_ = 10 _[−]_ [4] ) over a maximum of 30 epochs. _α_ = 2 _r_ throughout. Each
configuration is evaluated over 4 seeds (42–45). All runs executed on CPU (16 cores, _∼_ 10 hours per
run).


**Results.** Table 21 reports test accuracy across all ranks (Figure 15). LottaLoRA at _r_ =8 achieves
85 _._ 12 _±_ 0 _._ 57%, recovering **99.3%** of the full fine-tuning baseline (85 _._ 69 _±_ 0 _._ 44%) while training only
**0.48%** of the parameters (49,681 out of 10.36 M). Performance saturates near _r_ =8; higher ranks
( _r_ =16, _r_ =32) yield no additional gain, consistent with the minimum-rank hypothesis (Section 7).


**Baseline** **context.** Our full fine-tuning baseline (85 _._ 69%) falls several percentage points below
published DistilBERT accuracy on IMDB ( _∼_ 87–88%), likely because our 3-layer architecture is
smaller than the full 6-layer DistilBERT and our training budget is constrained. The comparison
is therefore protocol-fair: under matched architecture and training conditions, LottaLoRA at _r_ =8
essentially matches full fine-tuning at 0.48% of the parameters.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 39


Table 21: IMDB sentiment classification: test accuracy (%) by LoRA rank (4 seeds, fan-in-scaled
_W_ seed, DistilBERT backbone). LottaLoRA at _r_ =8 recovers 99.3% of full fine-tuning with 0.48%
trainable parameters.


Method Rank Mean Acc Std Trainable % Trainable


Baseline (full)        - 85.69% 0.44% 10,315,030 100%


LottaLoRA (fan-in) 1 83.30% 0.48% 6,673 0.06%
LottaLoRA (fan-in) 2 84.39% 0.28% 12,817 0.12%
LottaLoRA (fan-in) 4 84.59% 0.53% 25,105 0.24%
LottaLoRA (fan-in) 8 85.12% 0.57% 49,681 0.48%
LottaLoRA (fan-in) 16 84.93% 0.46% 98,833 0.95%
LottaLoRA (fan-in) 32 84.94% 0.26% 197,137 1.88%

### **H CIFAR-10 Plain-20 CNN**


**Setup.** We apply LottaLoRA to a Plain-20 CNN [18] on CIFAR-10 (50,000 training, 10,000 test
images, 10 classes). The backbone consists of 20 convolutional layers organized in three stages
(16 _,_ 32 _,_ 64 channels) with a final average-pooling and linear classifier (269,722 total parameters). In
the LottaLoRA condition, all convolutional weight matrices are frozen and replaced with _W_ eff =
_β W_ seed + _BA_ ; _W_ seed is initialized with fan-in-scaled Gaussian noise. Training uses AdamW for 164
epochs with cosine learning rate schedule. Results are averaged over 3 seeds (42, 123, 7).


**Results.** Table 22 reports test accuracy across LoRA ranks and configurations. At rank 8, vanilla
LottaLoRA (no DoRA, with residual connections) achieves 86.20%, recovering 94.9% of the 90.81%
baseline. Adding DoRA [35] improves this to 88.12% (97.0% recovery). At rank 32, DoRA+residual
reaches 89.66% (98.7% recovery) with remarkably tight variance ( _±_ 0 _._ 03% across 3 seeds), the best
LottaLoRA result on this benchmark—within 1.15 pp of the fully trained baseline. Dropout hurts
performance at all ranks, unlike MNIST where it is benign.


Table 22: CIFAR-10 Plain-20 test accuracy (%) by LoRA rank and configuration (3 seeds; _r_ _∈_
_{_ 1 _,_ 4 _,_ 8 _,_ 16 _}_ : 150 epochs, _r_ _∈{_ 2 _,_ 32 _}_ : 164 epochs). Residual = residual connection around frozen
layer. DoRA = weight-decomposed low-rank adaptation. Baseline (full training): 90 _._ 81% _±_ 0 _._ 20%.


Rank Vanilla +Residual +DoRA+Res Trainable ratio


1 61 _._ 08 _±_ 1 _._ 42 61 _._ 57 _±_ 1 _._ 67 76 _._ 70 _±_ 0 _._ 54 3.1%
2 75 _._ 02 _±_ 0 _._ 39 76 _._ 31 _±_ 0 _._ 83 82 _._ 24 _±_ 0 _._ 50 5.2%
4 82 _._ 40 _±_ 0 _._ 09 82 _._ 59 _±_ 0 _._ 11 85 _._ 43 _±_ 0 _._ 08 10.1%
8 86 _._ 18 _±_ 0 _._ 41 86 _._ 20 _±_ 0 _._ 25 88 _._ 12 _±_ 0 _._ 31 19.5%
16 87 _._ 70 _±_ 0 _._ 26 88 _._ 76 _±_ 0 _._ 09 89 _._ 39 _±_ 0 _._ 17 38.3%
32 88 _._ 01 _±_ 0 _._ 34 88 _._ 48 _±_ 0 _._ 38 89 _._ 66 _±_ 0 _._ 03 43.3%


**DoRA** **effect.** DoRA provides a dramatic improvement at rank 1 (+15.6 pp over vanilla), where
the direction normalization compensates for the extremely limited capacity of a single-rank adapter.
The effect generally diminishes at higher ranks: +7.2 pp at rank 2, +3.0 pp at rank 4, +1.9 pp at
rank 8, +0.6 pp at rank 16, and +1.7 pp at rank 32. Residual connections alone provide negligible
benefit ( _<_ 1 pp at all ranks), suggesting that on this architecture the adapter path, not the skip
connection, is the primary mechanism.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 40

### **I Decision Transformer (HalfCheetah-Expert)**


**Setup.** We apply LottaLoRA to a Decision Transformer [19] trained on the HalfCheetah-expertv2 offline RL dataset at two scales: **small** (embedding dimension 128, 3 layers, 1 attention head,
MLP ratio 4 _×_ ) and **large** (embedding dimension 1024, 12 layers, 8 heads, MLP ratio 4 _×_ ). Context
length is _K_ =20 timesteps (state–action–reward triples, yielding 60 tokens per sequence). Return-togo values are scaled by 6,000. Training uses AdamW (learning rate 10 _[−]_ [4], weight decay 10 _[−]_ [4], batch
size 64, 120 epochs) with 5% linear warmup and early stopping (patience 15). In the LottaLoRA
condition, all attention projections are frozen and replaced with LoRA adapters ( _α_ = _r_, dropout
0.05); _W_ seed uses fan-in-scaled Gaussian initialization. Results are averaged over 5 seeds.


**Extended** **rank** **sweep** **(small** **scale).** We extend the small-scale analysis with a rank sweep
_r_ _∈{_ 1 _,_ 2 _,_ 4 _,_ 8 _,_ 16 _,_ 32 _}_ under two scaffold conditions: _static_ (frozen _W_ seed, denoted `noise_lora` ) and
_resampled_ ( _W_ seed redrawn from its initialization distribution at the start of each epoch, denoted
`meta_lora` ). All other hyperparameters match the static condition. Online evaluation uses D4RLnormalized returns from HalfCheetah-v4 rollouts (1,000 timesteps, 10 episodes per seed). The
large-scale result ( _r_ =8, 1024-d / 12-layer) is from the original sweep and does not include online
evaluation.


Table 23: Decision Transformer on HalfCheetah-expert-v2 (5 seeds). Val MSE is offline prediction
error (lower is better); D4RL (%) is normalized online return from HalfCheetah-v4 rollouts (higher
is better; 10 episodes _×_ 1,000 timesteps per seed). _Static_ = frozen _W_ seed; _Resampled_ = _W_ seed
redrawn each epoch. Large-scale baseline and LottaLoRA from the original sweep ( _r_ =8 only).


Method _r_ Val MSE Std D4RL (%) Ratio


_Small_ _scale_ _(128-d,_ _3-layer)_
Baseline (full)           - 0.02718 0.00173 91 _._ 86 _±_ 0 _._ 55 100.00%


_Static_ _scaffold_ _(_ _`noise_lora`_ _)_
LottaLoRA 1 0.03482 0.00169 61 _._ 10 _±_ 21 _._ 46 19.23%
LottaLoRA 2 0.03221 0.00169 84 _._ 29 _±_ 5 _._ 74 19.98%
LottaLoRA 4 0.02985 0.00173 89 _._ 13 _±_ 3 _._ 29 21.44%
LottaLoRA 8 0.02832 0.00179 91 _._ 75 _±_ 2 _._ 35 24.22%
LottaLoRA 16 0.02761 0.00173 93 _._ 47 _±_ 0 _._ 94 29.22%
LottaLoRA 32 0.02713 0.00171 94 _._ 33 _±_ 0 _._ 83 37.47%


_Resampled_ _scaffold_ _(_ _`meta_lora`_ _)_
LottaLoRA 1 0.05116 0.00338 4 _._ 38 _±_ 0 _._ 59 19.23%
LottaLoRA 2 0.04421 0.00248 13 _._ 26 _±_ 11 _._ 26 19.98%
LottaLoRA 4 0.03580 0.00166 51 _._ 72 _±_ 17 _._ 18 21.44%
LottaLoRA 8 0.02974 0.00180 91 _._ 00 _±_ 1 _._ 23 24.22%
LottaLoRA 16 0.02804 0.00183 91 _._ 75 _±_ 1 _._ 65 29.22%
LottaLoRA 32 0.02731 0.00179 93 _._ 34 _±_ 2 _._ 68 37.47%


_Large_ _scale_ _(1024-d,_ _12-layer)_
Baseline (full)           - 0.02812 0.00188           - 99.97%
LottaLoRA (static) 8 0.02847 0.00149         - 1.87%


**Rank** **progression** **at** **small** **scale.** Under the static scaffold, validation MSE decreases monotonically with rank from 0.03482 ( _r_ =1) to 0.02713 ( _r_ =32). At _r_ =32 the paired mean difference versus
the baseline is _−_ 0.00004 (0.15% relative), which is not statistically significant—LottaLoRA matches
the fully trained baseline while training 37.47% of the parameters (Table 23, Figure 16). On the
online D4RL evaluation, static-scaffold LottaLoRA at _r_ _≥_ 16 exceeds the baseline score (93.47%
vs 91.86% at _r_ =16; 94.33% vs 91.86% at _r_ =32), suggesting that the frozen scaffold may provide a
regularization benefit during offline-to-online transfer.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 41


**Resampling** **collapse** **confirms** **Section** **5.3.** The `meta_lora` condition replicates the resampling
collapse observed on MNIST (Table 4). At _r_ =1, resampling drops D4RL score from 61.1% (static) to
4.4% (resampled)—a near-complete collapse. Recovery follows the same rank-dependent pattern: by
_r_ =8, `meta_lora` recovers to D4RL 91.0% (vs 91.75% static), and by _r_ =32 the gap narrows to 1.0 pp
(93.34% vs 94.33%). This confirms across a second architecture and domain that scaffold stability
is critical at low rank but becomes less important as adapter capacity increases, consistent with
the compression interpretation in Section 5.3. The learned _β_ scalars confirm this mechanistically:
under the static scaffold _β_ averages _≈_ 0 _._ 48 across layers—strictly positive in all seeds, though lower
than the _≈_ 0 _._ 91–0 _._ 99 range seen in Transformers and ViT (Section 5.3)—while under resampled
scaffolds _β_ collapses to _|β|_ _<_ 0 _._ 001, confirming backbone silencing across this second architecture
and domain.


**Large-scale** **result.** At large scale (1024-d / 12-layer), LottaLoRA ( _r_ =8) trails the matched baseline by +0.00035 MSE (1.2% relative) while training only 1.87% of parameters—a 53 _×_ reduction. A
paired _t_ -test across 5 seeds yields _t_ (4) = 4 _._ 29, _p_ = 0 _._ 013 (Cohen’s _d_ = 1 _._ 92): the gap is statistically
significant but small, representing the extreme-compression regime where a tiny adapter steers a
large frozen backbone.

### J Engineering: LayerNorm, Fan-In Scaling, β Distribution


**LayerNorm** **on** **combined** **path.** A controlled 2 _×_ 2 experiment (16 points, fan-in vs explicit scaling _×_ LayerNorm on/off) shows that applying LayerNorm to _W_ seed _x_ +∆ _Wx_ before the nonlinearity
adds +1.01 pp over fan-in scaling alone (95.0% vs 94.0%). Enabling LayerNorm introduces a trainable gain _γ_ _∈_ R _[d]_ and bias _b_ _∈_ R _[d]_ per normalized layer, adding 2 _d_ trainable parameters. This
overhead is negligible relative to the LoRA factors (2 _rd_ per layer) at any rank _r_ _≥_ 2, but is included
in all reported trainable counts for experiments that enable it. Configurations without LayerNorm
(e.g., the **no-LN** ablations from prior NCP experiments) omit these parameters entirely.

**Fan-in** _W_ **seed** **scaling.** Setting _σW_ seed = 1 _/_ _[√]_ _d_ in is necessary for stable training in deep/wide networks. Without it, activation variance compounds geometrically across layers, causing loss explosion
(observed on deep GNN training at _L_ = 8, _d_ = 1024: initial loss _≈_ 1 _._ 7 _×_ 10 [11] ). Fan-in scaling resolves
the instability entirely and is the confirmed default for all experiments.


_β_ **distribution.** As discussed in Section 3, _β_ is a secondary amplitude control whose primary role
is to modulate the overall backbone gain; the adapter matrices _A_ and _B_ channel the scaffold’s representational capacity toward the task. Across 1,632 learned _β_ values from Transformer experiments
(Figure 17, left): mean 0.894, median 0.915, IQR [0 _._ 837 _,_ 0 _._ 946]. Across 360 ViT layer pairs the
median is 0.993 (IQR [0 _._ 992 _,_ 0 _._ 995]). In both architectures every _β_ value remains strictly positive:
the optimizer consistently attenuates but never zeros or inverts the frozen backbone contribution.


_β_ **by** **layer** **depth** **and** **spectral** **norm** **(ViT).** Figure 17 (center and right) shows _σ_ 1( _W_ seed)
across all five backbone scales and _β_ by transformer block depth for ViT (5 seeds, 72 layer pairs per
seed). Two findings are notable. First, _σ_ 1( _W_ seed) _≫_ 1 at every layer and every scale—the frozen
backbone violates the Echo State Property by a wide margin (100% of ViT layers), yet the system
trains stably because the adapter compensates. Second, _β_ shows no systematic depth trend and
remains near 0.993 regardless of layer depth or _σ_ 1( _W_ seed), indicating that _β_ is not the compensation
mechanism: the adapter matrices handle spectral correction while _β_ provides only a mild global
attenuation.

### **K General LottaLoRA Algorithm**


Algorithm 19 provides a framework-agnostic pseudocode description of the LottaLoRA training
procedure applicable to any architecture with linear layers.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 42

### **L Design Choices: Required vs. Optional Components**


Table 24 summarizes the architectural components of LottaLoRA and their necessity, as established
by the ablation experiments across MNIST and Transformer benchmarks.


Table 24: Required and optional design choices in LottaLoRA.


**Component** **Status** **Notes**


Frozen _W_ seed Required Any distribution; values interchangeable but actively exploited when static ( _β_ _>_ 0, magnitude varies by architecture; Sections 5.2, 5.3)
LoRA factors ( _A_, _B_ ) Required Core trainable parameters
_β_ scalar Recommended Stabilizes training; can be fixed at 1.0
_α/r_ scaling Standard Follows LoRA convention [2]
LayerNorm Optional Adds 2 _d_ params/layer; helps at low rank
Fan-in scaling Req. if no LN Either fan-in or LN needed; both removed _→_ divergence
_B_ -init = 0 Recommended Kaiming hurts at low rank; converges at high rank (Appendix B.3)
Trainable head Recommended LoRA-only head viable at sufficient rank; taskdependent (Appendix B.4)


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 43


Figure 10: **Every** _W_ **seed** **initialization** **family** **exceeds** **95%** **at** **rank** **8** **on** **MNIST.** **Left:**
Every initialization family exceeds 95% at rank 8, showing that the scaffold’s specific distribution
has negligible effect. **Right:** All 22 families converge tightly as rank increases, confirming that the
scaffold is interchangeable on this task.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 44


Figure 11: **LottaLoRA** **matches** **the** **fully** **trained** **CfC** **baseline** **on** **PhysioNet** **2012** **ICU**
**mortality** **at** **every** **rank.** Mean _±_ std AUROC over 5 seeds at ranks 1–32. Dashed line: Full
CfC baseline (AUROC = 0 _._ 836).


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 45



0.80


0.78


0.76


0.74


0.72



OGBG-MolHIV: LottaLoRA recovers 97.5% of baseline

with 10.9% trainable parameters


|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|OGB GIN baseline (0.7558)<br>OGB GIN+vn (0.7707)|Col11|Col12|Col13|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|0.7755<br>|
|||0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|0.7520<br>0.7562|
||||||||||||||
|||||||||0.7456|0.7456|0.7456|0.7456|0.7456|
||||||||||||||
||||||||||||||
||||||||||||||
||||||||||||||
||1,863,906<br>(100%)|1,863,906<br>(100%)||131,416<br>(7.1%)|131,416<br>(7.1%)||203,416<br>(10.9%)|203,416<br>(10.9%)||347,416<br>(18.6%)|347,416<br>(18.6%)||



Baseline LottaLoRA

r=8







LottaLoRA

r=32



LottaLoRA

r=16



Figure 12: **LottaLoRA** **recovers** **97.5%** **of** **baseline** **ROC-AUC** **on** **molecular** **property**
**prediction.** Test ROC-AUC on OGBG-MolHIV (5 seeds, error bars show _±_ 1 std). Dashed lines
mark published OGB baselines [20]: GIN (red) and GIN+virtual node (green).


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 46


72.5


70.0



67.5


65.0


62.5


60.0


57.5


55.0



1 2 4 8 16 32
LoRA Rank r



Figure 13: **LottaLoRA** **recovers** **97.6%** **of** **baseline** **GCN** **accuracy** **on** **OGBN-Arxiv** **node**
**classification.** Test accuracy (10 seeds, error bars show _±_ 1 std). Dashed line marks the fully
trained GCN baseline (71 _._ 86%).


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 47


Figure 14: **Learned** **reservoir** **quality** **accounts** **for** **a** _∼_ **40 pp** **advantage** **over** **random** **back-**
**bones.** **(A)** Pre-trained backbone rank sweep: under extended training (300 epochs), LottaLoRA
reaches 94–95% across _r_ =1–64, within 1.9–2.8 pp of full fine-tuning (dashed). Even _r_ =1 (1.19%
trainable) achieves 94.53%. **(B)** Training budget effect: extending from 100 to 300 epochs yields
+39–40 pp for LottaLoRA ranks and +12 pp for the baseline. **(C)** Random backbone with and
without composed-path LayerNorm: LayerNorm adds +1.0–1.7 pp across all ranks, but the random
backbone ceiling remains _∼_ 56%, showing that learned reservoir quality accounts for a _∼_ 40 pp advantage. **(D)** Parameter efficiency: at _r_ =1 (1.19% trainable parameters), LottaLoRA recovers 97.6%
of baseline accuracy; random backbone conditions cluster near 57%, quantifying the information
contributed by the frozen learned projection layers.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 48



87


86


85


84


83


82



IMDB Sentiment: LottaLoRA matches full fine-tuning

at rank 8 with 0.48% trainable parameters








|Col1|Col2|Col3|Col4|Col5|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|||||||||
|||||||||
|||||||||
|||||||||
||||0.4|8%<br>0.9|8%<br>0.9|5%<br>1.8|5%<br>1.8|
||0.1|2%<br>0.2|4%|||||
|0.0|6%|||<br> <br>F<br>|<br> <br>F<br>|r=8: 99.3% recov<br>(0.48% trainable)<br>|r=8: 99.3% recov<br>(0.48% trainable)<br>|
|0.0|6%|||<br> <br>F<br>|F<br>|ull fine-tune (85.6<br>|9%)|
|||||<br>L|<br>L|<br>ottaLoRA (fan-in)||
|||||<br>L|<br>L|||



1 2 4 8 16 32
LoRA Rank r


Figure 15: **LottaLoRA** **matches** **full** **fine-tuning** **on** **IMDB** **sentiment** **at** **rank** **8** **with**
**0.48%** **trainable** **parameters.** Error bars show _±_ 1 standard deviation over 4 seeds. Dashed line
and shaded band indicate the full fine-tuning baseline (85 _._ 69 _±_ 0 _._ 44%). Performance saturates at
_r_ =8, with higher ranks providing no additional gain.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 49


Figure 16: **LottaLoRA** **matches** **the** **fully** **trained** **Decision** **Transformer** **at** **sufficient** **rank.**
Left: validation MSE by method and rank at small scale (128-d, 3-layer). The static scaffold
( `noise_lora` ) closes the gap monotonically with rank; at _r_ =32 the difference is not statistically significant. Right: val MSE vs trainable parameter ratio. The large-scale _r_ =8 result (1.87% trainable)
trails the baseline by 1.2% relative MSE; the small-scale _r_ =32 result (37.47% trainable) matches
the baseline.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 50


Figure 17: **The** **frozen** **backbone** **violates** **the** **Echo** **State** **Property** **at** **every** **layer,** **yet** _β_
**remains** **strictly** **positive** **(near** **1** **in** **ViT,** **median** _≈_ 0 _._ 99 **;** **see** **Section** **5.3** **for** **architecture-**
**dependent** **values).** **Left:** Empirical distribution of learned _β_ values from all Transformer checkpoints (1,632 values). Mass concentrates below 1.0; all values remain positive, confirming the
backbone always contributes. **Center:** Spectral norm _σ_ 1( _W_ seed) b _√_ y backbone scale (bars, reconstructed from seed) versus the Random Matrix Theory prediction 2 _d σ_ init (red dashed). All scales

violate the ESP boundary (dotted line at 1). **Right:** Learned _β_ (blue, left axis) and _σ_ 1( _W_ seed) (red,
right axis) by transformer block depth in ViT (5 seeds). _β_ is flat across depth and near 1 despite
_σ_ 1( _W_ seed) _≈_ 60–80, indicating that _β_ does not compensate for spectral structure—the adapter matrices do.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 51



























Trainable Frozen Seed (reconstructible) Learnable scalar Optional module


Figure 18: **LottaLoRA** **replaces** **the** **frozen** **pre-trained** **backbone** **with** **a** **seed-**
**reconstructible** **random** **scaffold.** **(a)** Standard training: all weights in _W_ are trainable and
must be stored. **(b)** LoRA: a frozen pre-trained backbone _W_ 0 is augmented with trainable lowrank adapters _A_ and _B_ ; both _W_ 0 and the adapters must be stored. **(c)** LottaLoRA (ours): the
backbone _W_ seed is generated from a random seed and frozen; a learnable scalar _β_ modulates its
amplitude. The adapter path (trainable _A_, _B_ with _α/r_ or rsLoRA scaling, optional dropout) and
backbone path merge at a summation node; optional DoRA renormalises the combined output, and
a residual skip connection may be added thereafter. An optional LayerNorm follows before the final
output. Only the seed, adapter weights, and _β_ need to be stored or distributed.


_A_ _Little_ _Rank_ _Goes_ _a_ _Long_ _Way:_ _Random_ _Scafolds_ _with_ _LoRA_ _Adapters_ _Are_ _All_ _You_ _Need_ 52


**Algorithm** **1:** LottaLoRA Training


**Input:** Architecture spec _A_, random seed _s_, LoRA rank _r_, scaling hyperparameter _α_, initialization
distribution _D_ (any; see Section 5.2)
**Output:** Trained LoRA state _{Ai, Bi, βi}_ _[n]_ _i_ =1 [,] [head] [parameters] _[θ]_ [head]


_//_ _Phase_ _1:_ _Backbone_ _construction_
1. Initialize PRNG with seed _s_
2. **for** each linear layer _i_ in _A_ **do**
3. Draw _W_ seed [(] _[i]_ [)] _[∼D]_ [;] [freeze] [(] `[requires_grad]` [ =] `[ False]` [)]
4. Initialize _A_ [(] _[i]_ [)] _∈_ R _[r][×][d]_ [in] with Kaiming uniform
5. Initialize _B_ [(] _[i]_ [)] _∈_ R _[d]_ [out] _[×][r]_ with zeros
6. Initialize _β_ [(] _[i]_ [)] = 1 _._ 0 (trainable scalar)
7. **end** **for**
8. Initialize task-specific head _θ_ head (embeddings, classification layer, LayerNorm)


_//_ _Phase_ _2:_ _Training_
9. Θ _←{Ai, Bi, βi}_ _[n]_ _i_ =1 _[∪]_ _[θ]_ [head]
10. Train Θ with standard optimizer; _W_ seed [(] _[i]_ [)] [never] [updated]


_//_ _Forward_ _pass_ _per_ _layer_ _i:_
_h_ out = _β_ [(] _[i]_ [)] _W_ seed [(] _[i]_ [)] _[h]_ [in][ +] _[α]_ _r_ _[B]_ [(] _[i]_ [)] _[A]_ [(] _[i]_ [)] _[ h]_ [in]


_//_ _Phase_ _3:_ _Distribution_
11. Save: seed _s_, architecture _A_, distribution _D_, PRNG algorithm, _{Ai, Bi, βi}_, _θ_ head


_//_ _Note:_ _D_ _may_ _be_ _any_ _distribution—Gaussian,_
_//_ _binary,_ _sparse,_ _quantized,_ _or_ _spectral-radius-controlled_
_//_ _(Section_ _5.2)._ _The_ _LoRA_ _adapter_ _compensates_ _for_
_//_ _the_ _specific_ _choice;_ _only_ _the_ _seed_ _must_ _be_ _recorded._


Figure 19: The LottaLoRA training procedure.


