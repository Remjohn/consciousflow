Published as a conference paper at ICLR 2025

## LEARNING CLUSTERING-BASED PROTOTYPES FOR COMPOSITIONAL ZERO-SHOT LEARNING


**Hongyu Qu** [1][∗] **, Jianan Wei** [2][∗] **, Xiangbo Shu** [1][†] **, Wenguan Wang** [2] _[,]_ [3]

1Nanjing University of Science and Technology 2Zhejiang University
3National Key Laboratory of Human-Machine Hybrid Augmented Intelligence,
Xi’an Jiaotong University


ABSTRACT


Learning primitive ( _i_ . _e_ ., attribute and object) concepts from seen compositions
is the primary challenge of Compositional Zero-Shot Learning (CZSL). Existing
CZSL solutions typically rely on oversimplified data assumptions, _e_ . _g_ ., modeling each primitive with a single centroid primitive representation, ignoring the
natural diversities of the attribute ( _resp_ . object) when coupled with different objects ( _resp_ . attribute). In this work, we develop CLUSPRO, a robust clusteringbased prototype mining framework for CZSL that defines the conceptual boundaries of primitives through a set of diversified prototypes. Specifically, CLUSPRO
conducts within-primitive clustering on the embedding space for automatically
discovering and dynamically updating prototypes. These representative prototypes are subsequently used to repaint a well-structured and independent primitive
embedding space, ensuring intra-primitive separation and inter-primitive decorrelation through prototype-based contrastive learning and decorrelation learning. Moreover, CLUSPRO efficiently performs prototype clustering in a nonparametric fashion without the introduction of additional learnable parameters or
computational budget during testing. Experiments on three benchmarks demonstrate CLUSPRO outperforms various top-leading CZSL solutions under both
closed-world and open-world settings. [Our code is available at CLUSPRO.](https://github.com/quhongyu/ClusPro)


1 INTRODUCTION



Humans possess the unique ability to recognize
a potentially infinite number of novel combinations by associating known components [1],
_i_ . _e_ ., to make “infinite use of finite means” [2];
for instance, despite never having seen one,
people can easily imagine a unicorn by combining their concept of a horse with the idea
of a single horn. Inspired by such compositional generalization ability of human intelligence [3, 4], Compositional Zero-Shot Learning (CZSL) [5, 6, 7, 8, 9] is proposed, aiming to
recognize unseen attribute-object compositions
based on learned knowledge from seen ones.



Figure 1: (a) Previous CZSL methods model all samples of each primitive concept with only one centroid
primitive presentation, neglecting feature divergence
within each primitive when involved in different compositions. (b) Our method represents each primitive as
a set of prototypes to capture primitive diversities.













features prototypes primitives



Existing CZSL solutions [10, 11, 12, 13] typi
positions. (b) Our method represents each primitive as

cally achieve compositional learning by align
a set of prototypes to capture primitive diversities.

ing the visual representation from a pre-trained
image encoder backbone with the attribute-object textual representation derived from pre-trained
word embeddings. Rather than learning to align visual and textual representation from scratch, recent approaches [14, 15, 16, 17, 18] have pivoted towards leveraging large-scale pre-trained vision


∗Equal contribution
†Corresponding author



1


Published as a conference paper at ICLR 2025


language models ( _e_ . _g_ ., CLIP [1] [19]) by treating compositional labels as learnable tokens in a predefined prompt like “ _a photo of [attribute] [object]_ ”. Though impressive, these methods exhibit two
limitations: **First**, they struggle to learn visual concepts by modeling an “ideal” primitive ( _i_ . _e_ ., attribute and object), but ignore an essential issue: each visual concept ( _i_ . _e_ ., attribute-object pairs) can
be semantically similar but visually different. For example, the attribute “broken” combined with
“cord” typically signifies disconnection, but conveys the notion of a rugged landscape when applied
to “valley”. Thus, we argue that a single centroid primitive representation exhibits limited tolerance
to intra-primitive variance (Fig. 1a), and it is essential to incorporate more exemplars to capture
the natural diversities of primitive. **Second**, they endeavor to explore more effective disentangling
strategies ( _e_ . _g_ ., contrastive learning [20], knowledge distillation [21] or graph representation learning [22]) to achieve independent primitive modeling in a multi-branch manner, but typically present
representation disentanglement from a local view ( _i_ . _e_ ., a few images within a batch [20, 23] or a
small training subset [24]), thus failing to perceive underlying data distribution in the entire dataset.


In light of the above, we present CLUSPRO, a clustering-based prototype mining framework for
CZSL (Fig. 1b). Specifically, we propose to describe each primitive by abstracting it through a set of
representative prototypes, which are automatically discovered by performing within-primitive clustering on the visual representation. Based on these prototypes established across the entire dataset,
we introduce two complementary self-supervised learning strategies to repaint the attribute and object embedding spaces, prompting _intra-primitive separation_ and _inter-primitive decorrelation_ .


Specifically, CLUSPRO employs two disentangling adapters to project visual representation, extracted from a pre-trained image encoder, into separate attribute and object embedding spaces. Then,
each primitive is described by clustering _K_ centroids on primitive-wise features. This process ( _i_ . _e_ .,
**Local-aware Prototype Assignment** ) involves assigning the visual feature of each primitive to one
of a set of prototypes that share the same attribute or object category, while considering the intrinsic coherence of the feature distribution. For computational efficiency, we opt for Generalized
Conditional Gradient (GCG) algorithm [25] to enable fast prototype assignment. Additionally, to
keep non-learnable prototypes up-to-date, we employ a dynamic **Prototype Updating** mechanism,
which recomputes prototypes over the entire dataset in each iteration. The attribute embedding and
object embedding, derived from the same visual representation with compositional semantics, inherently exhibit entanglement, which is toxic for prototype construction within primitive. To learn
well-structured and independent attribute/object embedding space, we propose two complementary
metric learning mechanisms: **i)** _Prototype-based Contrastive Learning_ aims to encourage each primitive feature to be similar to its assigned prototype and dissimilar with all other prototypes from the
attribute and object branch. In this way, our model can not only capture intra-primitive discriminativeness within the group of attributes or objects, but also promote a clear distinction between attributes and objects. **ii)** _Prototype-based Decorrelation Learning_ is devised to shape an independent
primitive embedding space ( _i_ . _e_ ., object representation should be invariant to attribute alterations,
and vice versa) by exploring conditional-independence relations between attributes and objects.


CLUSPRO has several appealing merits: **First**, comprehensive modeling of _**data**_ _**distribution**_ : By
conducting within-primitive clustering on the visual embedding space across the entire dataset,
CLUSPRO can automatically mine the global data distribution of each primitive from a holistic view.
**Second**, explicit supervision of _**representation**_ _**disentanglement**_ : The clustering-based prototypes
enable CLUSPRO to directly shape well-structured yet independent attribute and object embedding
spaces via prototype-anchored contrastive learning and decorrelation learning. Such improved primitive embedding spaces, in turn, enable typical within-primitive variation pattern mining. **Third**,
high _**efficiency**_ : CLUSPRO perform prototype clustering in a non-parametric fashion without any
modification of network architecture or additional computational budget during testing.


To effectively assess our method, we conduct extensive experiments on three gold-standard CZSL
datasets ( _i_ . _e_ ., MIT-States [26], UT-Zappos [27], and C-GQA [28]). Experimental results demonstrate that CLUSPRO significantly exceeds existing state-of-the-arts in both _Close-world (CW)_ and
_Open-world (OW)_ settings (§4.3). Concretely, on the _CW_ setting, CLUSPRO achieves **+11.8%** and
**+20.2%** AUC gains on UT-Zappos and C-GQA, respectively. On the _OW_ settings, it also yields
solid improvements of **+19.7%** AUC on UT-Zappos and **+11.1%** AUC on C-GQA. In §4.4, a set of
ablative studies confirms the power of our idea and the efficacy of core model designs.


1Given that CLIP might be exposed to certain unseen compositions during pre-training, we provide detailed
data overlap discussion in §G of Appendix.


2


Published as a conference paper at ICLR 2025


2 RELATED WORK


**Compositional** **Zero-shot** **Learning (CZSL).** The goal of CZSL is to recognize unseen attributeobject compositions by combining learned concept knowledge from seen pairs. Early CZSL solutions can be summarized into two paradigms: the first paradigm [29, 28, 5, 30, 31, 32, 33] directly
compose attributes and objects with a transformation function and learn a classifier for recognition;
the second paradigm [23, 34, 20, 22, 35, 36, 21] mainly decomposes attribute and object in the
composition space by well-designed disentangling strategies, _e_ . _g_ ., contrastive learning [20], knowledge distillation [21] or graph representation learning [22], and employ two separate classifiers
to identify attributes and objects individually. Recent breakthroughs in Vision-Language Models
(VLM) [37, 38, 19] make it a promising direction to harness knowledge from pre-trained VLM
( _e_ . _g_ ., CLIP [19]) for zero-shot and open-vocabulary tasks. Pioneer works [17, 18, 16, 39] build
learnable soft prompts with a combined attribute and object vector representation. To capture the
contextual nuances in the composition space, recent works [14, 15, 24] jointly model the attribute,
object, and composition through vision-language alignments in multiple identification branches.


Despite these advancements, they generally focus on learning one single representative prototype
to model each primitive. This limits their ability to interpret the complex and subtle meanings
that arise from the combination of various visual concepts. Besides, these methods primarily focus
on disentangling attributes and objects with a restricted set of samples, neglecting the potential of
incorporating global information to reshape a well-structured and independent embedding space.


**Prototype** **Learning.** Studies in cognitive psychology evidence that people often explore prototypical knowledge as a foundation for learning and problem-solving across various domains, such
as natural language understanding and visual scene understanding [40, 41]. Unlike Softmax-based
methods [42, 43, 44], prototype-based classifiers [45, 46, 47, 48] make decisions by computing the
distance between new observations and prototype representations of each class. The prototypes
typically refer to the centroids of all samples belonging to the same category [49]. For its exemplardriven nature, a spectrum of recent works attempts to combine deep learning techniques and the idea
of prototype learning, boosting great potential in various learning paradigms, including supervised
learning [50, 51, 52, 53, 54, 55], few-shot learning [56, 57], and (compositional) zero-shot learning

[58, 22, 10]. These (compositional) zero-shot learning works [59, 60, 61, 58] extensively explore
prototype learning to enhance feature representation. However, they typically model each class with
only one prototype, and their prototypes are often learnable parameters.


Building upon these successes, we aim to advance CZSL by developing a cluster-based prototype
learning scheme. Different from previous works [20, 22], which employ one single learnable prototype for each primitive, CLUSPRO explicitly derives prototypes via clustering primitive features over
the entire dataset, which are subsequently used to repaint attribute and object embedding spaces.


**Self-supervised Representation Learning.** Self-supervised representation learning (SSRL) methods [62, 63, 64] aim to construct a well-structured embedding space without requiring extensively
annotated datasets. Recently, metric learning [65] has emerged as a prominent technique in SSRL,
which learns a distance function to reflect the relationships between data points based on their labels.
This approach results in more compact, interpretable, and versatile feature representations, which
could benefit subsequent tasks, _e_ . _g_ ., classification [66, 67, 68] or clustering [69, 70]. It aligns well
with CLUSPRO that seeks to automatically discover prototypes of primitive concepts by clustering
features associated with coarse-grained labels. Inspired by this, we raise a disentangled representation learning strategy that integrates two complementary self-supervised learning strategies to shape
a primitive embedding space with intra-primitive separation and inter-primitive decorrelation.


3 METHODOLOGY


3.1 PROBLEM STATEMENT


Given the attribute set A = { _a_ 1 _,a_ 2 _,...,aM_ } and the object set O = { _o_ 1 _,o_ 2 _,...,oN_ }, the compositional label set C can be defined as the Cartesian product between A and O, _i_ . _e_ ., C = A × O.
Subsequently, C is divided into two disjoint subsets: the seen composition set C _[s]_ and the unseen composition set C _[u]_, where C _[s]_ ∩C _[u]_ = ∅. During training, the model can only access images paired with
labels from the seen composition set C _[s]_, _i_ . _e_ ., the training set is defined as T = {( _x,c_ )∣ _x_ ∈X _,c_ ∈C _[s]_ },


3


Published as a conference paper at ICLR 2025





L _a_


L _c_




|Col1|ℎ<br>𝑎<br>Image<br>Encoder<br>ϕvis|ℎ<br>𝑎|𝑓𝑎|𝑓𝑎|
|---|---|---|---|---|
||Image<br>Encoder<br><br>ℎ𝑎<br>_ϕ_vis|ℎ𝑎|𝑜<br>𝑓𝑐|𝑓𝑐|







object


pair


attribute























Figure 2: The overview of CLUSPRO. **(a)** CLUSPRO is built upon a three-path paradigm to jointly recognize
attribute, object, and attribute-object composition (§3.2). **(b)** To capture the diversity within each primitive,
CLUSPRO describes each primitive with a set of prototypes, and conducts within-primitive clustering across
training data for prototype assignment and updating (§3.3). **(c)** CLUSPRO imposes two constraints based on
these constructed prototypes to promote intra-primitive separation and inter-primitive decorrelation (§3.4).


where X is the visual space. In the Closed-World ( _CW_ ) setting, the composition space for testing is
defined as C _[t]_ = C _[s]_ ∪C _[u]_, where only the known composition space is required. For the Open-World
( _OW_ ) setting, the composition space considers all potential attribute-object pairs, _i_ . _e_ ., C _[t]_ = C.


3.2 BASELINE ARCHITECTURE


**Encoding Visual Representations.** Our framework is built upon a three-path paradigm [14, 23, 34],
which jointly recognizes three kinds of semantic components, _i_ . _e_ ., attribute, object, and attributeobject composition. Given an input image _X_ ∈R _[H]_ [×] _[W]_ [ ×][3], we adopt a visual encoder _ϕ_ [vis] of CLIP [14]
to obtain visual representation _**f**_ ∈ R _[D]_ . We consider image representation _**f**_ as composition visual
representation _**f**_ _[c]_, and adopt attribute adapter _h_ _[a]_ and object adapter _h_ _[o]_ [71, 72], each implemented
as a separate MLP, to project _**f**_ into the discriminative attribute and object spaces respectively:

_**f**_ _[a]_ = _h_ _[a]_ ( _**f**_ ) _,_ _**f**_ _[o]_ = _h_ _[o]_ ( _**f**_ ) _,_ _**f**_ _[c]_ = _**f**_ _,_ (1)
where _**f**_ _[a]_ and _**f**_ _[o]_ are visual features extracted for attribute and object, respectively.


**Encoding Prompt Representations.** Following existing CZSL [18, 14], we construct prompt representation via a soft learnable prompt strategy for all candidate compositions, attributes, and objects.
Specifically, for each attribute-object composition _ci,j_ = ⟨ _ai,oj_ ⟩, we create three prompts for each
branch, _i_ . _e_ ., attribute prompt _**S**_ _i_ _[a]_ [= [] _**[s]**_ 1 _[a][,...,]_ _**[s]**_ _[a]_ _l_ _[,]_ _**[v]**_ _i_ _[a]_ []][, object prompt] _**[ S]**_ _j_ _[o]_ [= [] _**[s]**_ 1 _[o][,...,]_ _**[s]**_ _[o]_ _l_ _[,]_ _**[v]**_ _j_ _[o]_ []][, and com-]
position prompt _**S**_ _i,j_ _[c]_ [=] [[] _**[s]**_ _[c]_ 1 _[,...,]_ _**[s]**_ _[c]_ _l_ _[,]_ _**[v]**_ _i_ _[a][,]_ _**[v]**_ _j_ _[o]_ []][,] [where] _**[s]**_ _[a]_ 1∶ _l_ [,] _**[s]**_ _[o]_ 1∶ _l_ [,] [and] _**[s]**_ _[c]_ 1∶ _l_ [are] [learnable] [pretix] [contexts]
initialized by “ _a photo of_ ”. Additionally, _**v**_ _i_ _[a]_ [and] _**[ v]**_ _j_ _[o]_ [are trainable vocabulary tokens for the attribute]
_ai_ and object _oj_, respectively. These prompts are then fed into frozen text encoder _ϕ_ [txt] of CLIP to
obtain corresponding prompt features, formulated as:

_**t**_ _[a]_ _i_ [=] _[ ϕ]_ [txt][(] _**[S]**_ _i_ _[a]_ [)] _[,]_ _**t**_ _[o]_ _j_ [=] _[ ϕ]_ [txt][(] _**[S]**_ _j_ _[o]_ [)] _[,]_ _**t**_ _[c]_ _i,j_ [=] _[ ϕ]_ [txt][(] _**[S]**_ _i,j_ _[c]_ [)] _[.]_ (2)


**Three-path** **Learning** **Objective.** Given visual and prompt representations from three branches,
we compute the probabilities for attribute, object, and composition classes, denoted as _p_ ( _ai_ ∣ _**f**_ _n_ ),
_p_ ( _oj_ ∣ _**f**_ _n_ ), _p_ ( _ci,j_ ∣ _**f**_ _n_ ), respectively. To recognize primitive concepts and their compositions in each
branch, three cross-entropy loss functions are employed:



_N_ exp( _**f**_ _n_ _[a]_ [⋅] _**[t]**_ _i_ _[a]_ [/] _[τ]_ [)]
_N_ [1] [∑] _n_ =1 [−][log] _[ p]_ [(] _[a]_ [∣] _**[f]**_ _[n]_ [)] _[,]_ _p_ ( _ai_ ∣ _**f**_ _n_ ) = ∑∣A∣ _k_ =1 [exp][(] _**[f]**_ _n_ _[ a]_ [⋅] _**[t]**_ _[a]_ _k_

_N_ exp( _**f**_ _n_ _[o]_ [⋅] _**[t]**_ _j_ _[o]_ [/] _[τ]_ [)]
_N_ [1] [∑] _n_ =1 [−][log] _[ p]_ [(] _[o]_ [∣] _**[f]**_ _[n]_ [)] _[,]_ _p_ ( _oj_ ∣ _**f**_ _n_ ) = ∣O∣ _[o]_



L _[a]_ = [1]



L _[o]_ = [1]



∣A∣ _,_ (3)
∑ _k_ =1 [exp][(] _**[f]**_ _n_ _[ a]_ [⋅] _**[t]**_ _[a]_ _k_ [/] _[τ]_ [)]

exp( _**f**_ _n_ _[o]_ [⋅] _**[t]**_ _j_ _[o]_ [/] _[τ]_ [)]

∣O∣ _,_ (4)
∑ _k_ =1 [exp][(] _**[f]**_ _[ on]_ [ ⋅] _**[t]**_ _k_ _[o]_ [/] _[τ]_ [)]



_N_ exp( _**f**_ _n_ _[c]_ [⋅] _**[t]**_ _i,j_ _[c]_ [/] _[τ]_ [)]
_N_ [1] [∑] _n_ =1 [−][log] _[ p]_ [(] _[c]_ [∣] _**[f]**_ _[n]_ [)] _[,]_ _p_ ( _ci,j_ ∣ _**f**_ _n_ ) = ∣C∣ _[c]_



L _[c]_ = [1]



∣C∣ _,_ (5)
∑ _k_ =1 [exp][(] _**[f]**_ _[ cn]_ [ ⋅] _**[t]**_ _k_ _[c]_ [/] _[τ]_ [)]



where _τ_ ∈ R is pre-defined temperature parameter in CLIP. For simplicity, all the features are _ℓ_ 2normalized by default. Then, the three-path classification loss can be formulated as:


L [BAS] = _λ_ _[a]_ L _[a]_ + _λ_ _[o]_ L _[o]_ + _λ_ _[c]_ L _[c]_ _,_ (6)
where _λ_ _[a]_ _,λ_ _[o]_ _,λ_ _[c]_ are all set to 1, following [14].


4


Published as a conference paper at ICLR 2025


**Our** **Main** **Idea.** Though impressive, this three-branch paradigm only achieves implicit feature
disentanglement to a limited extent by using one single image, failing to perceive the potential
structures of the whole dataset. Moreover, it only considers an isolated centroid for each primitive, ignoring rich and diverse intra-primitive patterns. To address this limitation, we propose a
clustering-based prototype mining framework ( _i_ . _e_ ., CLUSPRO), as shown in Fig. 2. Our model not
only learns primitive recognition with pre-given semantic labels, but also automatically discovers
diverse and fine-grained sub-primitive patterns across the entire dataset. For training, our algorithm
alternates between two steps: **i)** perform primitive-wise online clustering to discover sub-primitive
prototypes (§3.3); **ii)** impose two prototype-anchored constraints to explicitly shape well-structured
and independent attribute/object feature spaces(§3.4). The improved features, in turn, facilitate more
reliable primitive-wise clustering, and eventually boost composition predictions.


3.3 CLUSTERING-BASED PROTOTYPE MINING


To model the natural diversities of primitives, we exploit rich dataset-level context knowledge to
automatically identify informative prototypes within each attribute or object, facilitating primitive
concept representation learning. Specifically, we first assign each attribute ( _resp_ . object) visual
feature to the prototypes belonging to the same attribute ( _resp_ . object) ( _i_ . _e_ ., **Local-aware Prototype**
**Assignment** ), and then continuously update prototypes online according to the assignments ( _i_ . _e_ .,
**Prototype** **Updating** ) with batch training. Such an online clustering strategy forces the model to
mine intra-primitive discriminativeness. Notably, we present the online primitive-wise clustering
process within both the attribute and object embedding spaces, so as to well represent rich and
diverse patterns within each primitive. For clarity, we only explain the prototype construction in the
attribute branch, while the object branch follows the same process.


**Local-aware** **Prototype** **Assignment.** For each attribute _a_ ∈A, we leverage _K_ prototypes
({ _**p**_ _[a]_ _k_ [}] _[K]_ _k_ =1 [)][2] [to represent its diverse semantic patterns, where] _**[ p]**_ _[a]_ _k_ [is] _[ k]_ [-th prototypes of attribute] _[ a]_ [.] [To]
get informative yet hidden prototypes, we perform clustering within each attribute on the attribute
embedding space. More specifically, for given a set of attribute features _**F**_ _[a]_ = { _**f**_ _n_ _[a]_ [}] _[N]_ _n_ = _[ a]_ 1 [∈] [R] _[D]_ [×] _[N]_ _[a]_

associated with attribute _a_, where _**f**_ _n_ _[a]_ [is] _[ n]_ [-th attribute features of attribute] _[ a]_ [ and] _[ N][ a]_ [is the number]
of attribute features, our goal is to assign these attribute features to the _K_ prototypes _**P**_ _[a]_ ={ _**p**_ _[a]_ _k_ [}] _[K]_ _k_ =1 [∈]
R _[D]_ [×] _[K]_ . The mapping matrix from _**F**_ _[a]_ to _**P**_ _[a]_ can be denoted as _**L**_ _[a]_ = [ _**l**_ _n_ _[a]_ []] _[N]_ _n_ = _[ a]_ 1 [∈{][0] _[,]_ [1][}] _[K]_ [×] _[N]_ _[a]_ [,] [where]
_**l**_ _n_ _[a]_ [∈{][0] _[,]_ [1][}] _[K]_ [is] [an] [one-hot] [assignment] [vector] [of] _[n]_ [-th] [attribute] [features] [over] _[K]_ [prototypes.] [Let]
_**S**_ _[a]_ ∈ R _[N]_ _[a]_ [×] _[N]_ _[a]_ denote cosine similarity among these attribute features _**F**_ _[a]_ ∈ R _[D]_ [×] _[N]_ _[a]_ in the attribute
embedding space. Thus, the clustering within each attribute can be achieved by the optimization
of the assignment matrix _**L**_ _[a]_, _i_ . _e_ ., maximizing the similarity _**Q**_ _[a]_ between attribute features _**F**_ _[a]_ and
the prototypes _**P**_ _[a]_ ( _i_ . _e_ ., _**Q**_ _[a]_ = Softmax( _**P**_ _[a]_ [⊺] _**F**_ _[a]_ ) ∈ R _[K]_ [×] _[N]_ _[a]_ ), while considering intrinsic coherence
structure of features:
min (7)
_**L**_ _[a]_ ∈L _[a]_ [⟨] _**[L]**_ _[a]_ [⊺] _[,]_ [ −] [log] _**[ Q]**_ _[a]_ [⟩+] _[ κ]_ [Ω][(] _**[L]**_ _[a]_ [⊺][)] _[,]_

where ⟨⋅⟩ is the Frobenius dot-product. Note that Ω( _**L**_ _[a]_ [⊺] ) = −⟨ _**S**_ _[a]_ _,_ ( _**L**_ _[a]_ ⊙ _**Q**_ _[a]_ ) [⊺] ( _**L**_ _[a]_ ⊙ _**Q**_ _[a]_ )⟩ is
local coherent regularized term [73], and _κ_ - 0 is the strength of the regularization, where ⊙ denotes element-wise multiplication. Different from the classical formulation in [50, 74], _i_ . _e_ ., Optimal
Transport with entropic constraints, our local-aware prototype assignment can produce superior assignments by fully considering the intrinsic coherence structure of attribute feature distribution, _i_ . _e_ .,
intra-distribution coherence. Specifically, this term promotes assigning higher weights to _**L**_ _[a]_ _k,i_ [and]
_**L**_ _[a]_ _k,j_ [if the] _[ i]_ [-th and] _[ j]_ [-th attribute feature are highly similar (indicated by a high value of] _**[ S]**_ _i,j_ _[a]_ [) and]
both exhibit a strong similarity, as measured by _**Q**_ _[a]_ _k,i_ [and] _**[ Q]**_ _k,j_ _[a]_ [, to the] _[ k]_ [-th prototype of attribute] _[ a]_ [.]

As in [69, 75, 76], we relax _**L**_ _[a]_ to an element of transportation polytopes, _i_ . _e_ ., _**L**_ _[a]_ ∈ R _[K]_ + [×] _[N]_ _[a]_ . Unlike offline clustering [77, 78] requiring multiple passes over the entire dataset, we cast prototype
assignment as an optimal transport problem, so as to scale our algorithm to massive data by online
clustering:
L _[a]_ ={ _**L**_ _[a]_ ∈ R+ _[K]_ [×] _[N]_ _[a]_ ∣ _**L**_ _[a]_ [⊺] **1** _K_ = **1** _N_ _[a]_ _,_ _**L**_ _[a]_ **1** _N_ _[a]_ = _[N][ a]_ (8)

_K_ **[1]** _[K]_ [}] _[,]_

where **1** _K_ denotes the vector of all ones in dimension _K_ . _**L**_ _[a]_ [⊺] **1** _K_ = **1** _N a_ is the assignment constraint
ensuring each attribute feature is assigned to exactly one prototype, and _**L**_ _[a]_ **1** _N_ _a_ = _[N]_ _K_ _[a]_ **[1]** _[K]_ [is] [the]

equipartition constraint, guaranteeing that, on average, each prototype is selected an equal number of


2For clarity, we slightly reuse _a_ and _o_ to define a certain attribute and object concept, respectively.


5


Published as a conference paper at ICLR 2025


times in the batch. With differentiable regularized term and soft assignment relaxation, the solution
of Prob. (8) can be given by efficient GCG algorithm [25], which relies on a few matrix-vector
multiplications via iterative Dykstra algorithm [79].


**Prototype** **Updating.** During iterative network training, primitive representations evolve continuously, necessitating offline clustering to recompute sub-primitive prototypes over the entire dataset
after each batch, which incurs substantial computational costs. To address this, we propose an _online_
clustering approach with momentum updates, where prototypes are dynamically updated using the
embeddings within the current mini-batch. In particular, after each training iteration, each prototype
_**p**_ _[a]_ _k_ [of the attribute] _[ a]_ [ ∈A][ is updated as:]
_**p**_ _[a]_ _k_ [←] _[µ]_ _**[p]**_ _k_ _[a]_ [+ (][1][ −] _[µ]_ [)] _**f**_ [ ¯] _k_ _[a][,]_ (9)

where _µ_ ∈[0 _,_ 1] is a momentum coefficient, and _**f**_ [¯] _k_ _[a]_ [∈] [R] _[D]_ [is] [the] [mean] [vector] [of] [the] [attribute] [fea-]
tures assigned to the prototype _**p**_ _[a]_ _k_ [by] [clustering.] [As] [such,] [the] [prototype] [updating] [scheme] [(Eq.] [9][)]
iteratively refines the prototype values in response to the evolving primitive feature representations,
thereby facilitating a smoother training process. This online clustering strategy enables our model
to effectively discover rich sub-primitive patterns over massive training data.


3.4 PROTOTYPE-ANCHORED PRIMITIVE REPRESENTATION LEARNING


By performing online within-primitive clustering separately in the attribute and object embedding
spaces, we construct a set of prototypes for each attribute, _i_ . _e_ ., { _**p**_ _[a]_ _k_ [}] _[K]_ _k_ =1 [,] [and] [each] [object,] _[i]_ [.] _[e]_ [.,]
{ _**p**_ _[o]_ _k_ [}] _[K]_ _k_ =1 [,] [to] [represent] [diverse] [sub-primitive] [patterns.] [Therefore,] [the] [following] [question] [naturally]
arises: _what should a well-structured and independent embedding with discriminative prototypes be_
_like?_ To answer this, we enhance the three-path classification loss (Eq. 6) by incorporating two complementary loss constraints based on these constructed prototypes: **Prototype-based** **Contrastive**
**Learning** and **Prototype-based** **Decorrelation** **Learning**, which fully exploits the relationships
between primitive features and sub-primitive centers in the embedding space.


**Prototype-based** **Contrastive** **Learning.** Our prototype-based contrastive learning strategy contrasts the similarities between each primitive feature, _i_ . _e_ ., _**f**_ _n_ ∈ _**F**_ _[a]_ ∪ _**F**_ _[o]_, where _**f**_ _n_ is _n_ -th primitive
features, _i_ . _e_ ., _**P**_ _[a]_ ∪ _**P**_ _[o]_ . This strategy encourages each primitive feature _**f**_ _n_ to be similar to its assigned prototype _**p**_ + and dissimilar to all other _K_ ( _M_ + _N_ )−1 irrelevant prototypes P−. Different
from only using _K_ ( _M_ + _N_ −1) irrelevant prototypes from other primitives as negative samples, our
strategy not only ensures inter-primitive separation to some extent, but also guarantee intra-primitive
separation. The corresponding training objective for each features _**f**_ _n_ is defined as:

exp( _**f**_ _n_ [⊺] [⋅] _**[p]**_ + [/] _[τ]_ [)]
LPCL =−log (10)
exp( _**f**_ _n_ [⊺] [⋅] _**[p]**_ + [/] _[τ]_ [)+] ∑ _**p**_ −∈P− [exp][(] _**[f]**_ _n_ [ ⊺] [⋅] _**[p]**_                - [/] _[τ]_ [))] _[,]_

where _τ_ - 0 is a temperature hyper-parameter. Notably, we treat both attributes and objects equally
as primitives to increase the scale and diversity of negative samples.


Our prototype-based contrastive learning exhibits two primary advantages: ❶ Traditional contrastive
learning approaches often rely on sophisticated negative sampling strategies to form contrasting
pairs, but inevitably yield negative pairs that share similar semantic meaning and should be closer
in the embedding space. In contrast, CLUSPRO avoids this long-standing challenge by constructing positive and negative pairs using clustering-based representative prototypes, thus effectively
shaping the embedding space by leveraging dataset-level contextual knowledge. ❷ Unlike previous
contrastive learning-based CZSL models [20, 80], which necessitate the extra processing for positive and negative feature extraction, our model leverages already constructed prototypes for contrast
computation, without incurring extra computational and storage budget.


**Prototype-based** **Decorrelation** **Learning.** By leveraging prototype-based contrastive learning,
CLUSPRO can effectively distinguish primitive prototypes by maximizing their distance to enhance
the independence of linear relationships. But, in CZSL, it is also essential to maintain independence
between the embeddings of attributes and objects, _i_ . _e_ ., inter-primitive decorrelation; for instance,
_apple_ should be distinguished from specific attributes, no matter whether _apple_ is _red_ or _green_ .
Thus, we propose a prototype-based decorrelation learning to enforce a distinct separation between
attribute and object prototypes, ensuring promising disentanglement results. Based on constructed
primitive prototypes, the conditional-independence relations can be captured by the following properties: **i)** _**f**_ _[a]_ - _**p**_ _[o]_ and **ii)** _**f**_ _[o]_ - _**p**_ _[a]_, where � denotes the independence between samples. Here, _**f**_ _[a]_
and _**f**_ _[o]_ are disentangled attribute and object features, respectively, with _**p**_ _[o]_ and _**p**_ _[a]_ representing the
corresponding sub-primitive prototypes entangled with these features.


6


Published as a conference paper at ICLR 2025


Table 1: **Quantitative results** (§4.3) on MIT-States [26], UT-Zappos [27] and C-GQA [28] within _**CW**_ setting.

|Closed-World<br>Method|Backbone|MIT-States<br>Seen↑ Unseen↑ HM↑ AUC↑|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|C-GQA<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|---|---|---|
|CLIP [19][ICML2021]<br>CoOp [82][IJCV2022]<br>PCVL [39][Arxiv2022]<br>CSP [17][ICLR2023]<br>DFSP(i2t) [18][CVPR2023]<br>DFSP(BiF) [18][CVPR2023]<br>DFSP(t2i) [18][CVPR2023]<br>GIPCOL [83][WACV2024]<br>CDS-CZSL [15][CVPR2024]<br>Troika [14][CVPR2024]<br>PLID [16][ECCV2024]|ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L|30.2<br>46.0<br>26.1<br>11.0<br>34.4<br>47.6<br>29.8<br>13.5<br>48.5<br>47.2<br>35.3<br>18.3<br>46.6<br>49.9<br>36.3<br>19.4<br>47.4<br>52.4<br>37.2<br>20.7<br>47.1<br>52.8<br>37.7<br>20.8<br>46.9<br>52.0<br>37.3<br>20.6<br>48.5<br>49.6<br>36.6<br>19.9<br>50.3<br>52.9<br>39.2<br>22.4<br>49.0<br>53.0<br>39.3<br>22.1<br>49.7<br>52.4<br>39.0<br>22.1|15.8<br>49.1<br>15.6<br>5.0<br>52.1<br>49.3<br>34.6<br>18.8<br>64.4<br>64.0<br>46.1<br>32.2<br>64.2<br>66.2<br>46.6<br>33.0<br>64.2<br>66.4<br>45.1<br>32.1<br>63.3<br>69.2<br>47.1<br>33.5<br>66.7<br>71.7<br>47.2<br>36.0<br>65.0<br>68.5<br>48.8<br>36.2<br>63.9<br>74.8<br>52.7<br>39.5<br>66.8<br>73.8<br>54.6<br>41.7<br>67.3<br>68.8<br>52.4<br>38.7|7.5<br>25.0<br>8.6<br>1.4<br>20.5<br>26.8<br>17.1<br>4.4<br>-<br>-<br>-<br>-<br>28.8<br>26.8<br>20.5<br>6.2<br>35.6<br>29.3<br>24.3<br>8.7<br>36.5<br>32.0<br>26.2<br>9.9<br>38.2<br>32.0<br>27.1<br>10.5<br>31.9<br>28.4<br>22.5<br>7.1<br>38.3<br>34.2<br>28.1<br>11.1<br>41.0<br>35.7<br>29.4<br>12.4<br>38.8<br>33.0<br>27.9<br>11.0|
|**CLUSPRO (Ours)**|ViT-L|**52.1**±0.6<br>**54.0**±0.3<br>**40.7**±0.2 **23.8**±0.2|**70.7**±1.0<br>**76.0**±1.2<br>**58.5**±0.6 **46.6**±0.5|**44.3**±0.2<br>**37.8**±0.2<br>**32.8**±0.2 **14.9**±0.1|



Specifically, we minimize the correlation between attribute and object embedding spaces by using
the Hilbert-Schmidt Independence Criterion (HSIC) [81]. HSIC is a non-parametric, kernel-based
statistical measure that evaluates the independence between two continuous random variables, yielding a value of zero if and only if the two variables are statistically independent in the infinite-sample
limit. Thus, our prototype-based decorrelation learning strategy can be achieved by minimizing:

L [PDL] = HSIC( _**f**_ _[a]_ _,_ _**p**_ _[o]_ ) + HSIC( _**f**_ _[o]_ _,_ _**p**_ _[a]_ ) _._ (11)


A similar approach is also adopted by [36]; however, our decorrelation strategy benefits from the
use of prototypes, which capture the intrinsic characteristics of primitives, thus more effectively
disentangling attribute features and object features in the compositional space.


**Overall Training Objective.** The final learning target of CLUSPRO combines the three-path classification loss L [BAS] (Eq. 6) with prototype-based loss constraints L [PCL] (Eq. 10) and L [PDL] (Eq. 11):


L=L [BAS] + _α_ L [PCL] + _β_ L [PDL] _,_ (12)
where the coefficients _α_ and _β_ are empirically set: _α_ =0 _._ 2, _β_ =0 _._ 5.


**Inference** **for** **CSZL.** During testing, the test image _x_ is fed into CLUSPRO to obtain prediction
scores for attribute _p_ ( _ai_ ∣ _x_ ), object _p_ ( _oi_ ∣ _x_ ), and composition prediction _p_ ( _ci,j_ ∣ _x_ ). Then the final
composition class can be predicted by incorporating three branch prediction results:

_c_ ˆ = arg max _ci,j_ ∈C _[t]_ _p_ ( _ci,j_ ∣ _x_ ) + _p_ ( _ai_ ∣ _x_ ) ⋅ _p_ ( _oj_ ∣ _x_ ) _._ (13)


4 EXPERIMENT


4.1 EXPERIMENTAL SETUP


**Datasets.** We conduct experiments on three widely-used CZSL benchmarks: MIT-States [26], UTZappos [27], and C-GQA [28]. MIT-States consists of 53 _,_ 753 natural images in total, with 115 states
and 245 objects. UT-Zappos contains 50 _,_ 025 fine-grain shoe images with 16 states, 12 objects and
116 state-object compositions. C-GQA is the most extensive CZSL dataset, containing 453 states
and 870 objects for 39 _,_ 298 images in total and over 9 _,_ 500 state-object compositions. More details
are provided in Table 5 ( _cf_ . §A in Appendix).


**Evaluation** **Metric.** Following the official evaluation protocol [28, 30, 15, 14], four metrics are
adopted for evaluation, _i_ . _e_ ., best-Seen accuracy (Seen), best-Unseen accuracy (Unseen), best Harmonic Mean (HM), and Area Under the Curve (AUC). Among them, AUC is the priority as it
evaluates the model comprehensively. Please see [84, 30] for full details about metrics.


4.2 IMPLEMENTATION DETAILS


**Network** **Architecture.** CLUSPRO adopts pre-trained CLIP ViT-L/14 model [19], serving as the
image and text encoder. The adapters of attribute _h_ _[a]_ and object _h_ _[o]_ are implemented by two individual MLPs. We group the features of each primitive into _K_ prototypes to describe intra-primitive
diversity. The number of prototypes _K_ and the momentum coefficient _µ_ in Eq. 9 are empirically set
to 5 and 0 _._ 99, respectively (ablation study in Table 4a and 4b). We follow [73] to set _κ_ =1 in Eq. 7.


**Training.** CLUSPRO is trained end-to-end for 15 epochs with Adam optimizer [85]. To manage the
learning rate, we initialize it at 1 _e_ −4 for all datasets and set weight decay to 5 _e_ −5. The coefficients


7


Published as a conference paper at ICLR 2025


Table 2: **Quantitative results** (§4.3) on MIT-States [26], UT-Zappos [27] and C-GQA [28] within _**OW**_ setting .

|Open-World<br>Method|Backbone|MIT-States<br>Seen↑ Unseen↑ HM↑ AUC↑|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|C-GQA<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|---|---|---|
|CLIP [19][ICML2021]<br>CoOp [82][IJCV2022]<br>PCVL [39][Arxiv2021]<br>CSP [17][ICLR2023]<br>DFSP(i2t) [18][CVPR2023]<br>DFSP(BiF) [18][CVPR2023]<br>DFSP(t2i) [18][CVPR2023]<br>GIPCOL [83][WACV2024]<br>CDS-CZSL [15][CVPR2024]<br>Troika [14][CVPR2024]<br>PLID [16][ECCV2024]|ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L<br>ViT-L|30.1<br>14.3<br>12.8<br>3.0<br>34.6<br>9.3<br>12.3<br>2.8<br>48.5<br>16.0<br>17.7<br>6.1<br>46.3<br>15.7<br>17.4<br>5.7<br>47.2<br>18.2<br>19.1<br>6.7<br>47.1<br>18.1<br>19.2<br>6.7<br>47.5<br>18.5<br>19.3<br>6.8<br>48.5<br>16.0<br>17.9<br>6.3<br>49.4<br>21.8<br>22.1<br>8.5<br>48.8<br>18.7<br>20.1<br>7.2<br>49.1<br>18.7<br>20.0<br>7.3|15.7<br>20.6<br>11.2<br>2.2<br>52.1<br>31.5<br>28.9<br>13.2<br>64.6<br>44.0<br>37.1<br>21.6<br>64.1<br>44.1<br>38.9<br>22.7<br>64.3<br>53.8<br>41.2<br>26.4<br>63.5<br>57.2<br>42.7<br>27.6<br>66.8<br>60.0<br>44.0<br>30.3<br>65.0<br>45.0<br>40.1<br>23.5<br>64.7<br>61.3<br>48.2<br>32.3<br>66.4<br>61.2<br>47.8<br>33.0<br>67.6<br>55.5<br>46.6<br>30.8|7.5<br>4.6<br>4.0<br>0.3<br>21.0<br>4.6<br>5.5<br>0.7<br>-<br>-<br>-<br>-<br>28.7<br>5.2<br>6.9<br>1.2<br>35.6<br>6.5<br>9.0<br>2.0<br>36.4<br>7.6<br>10.6<br>2.4<br>38.3<br>7.2<br>10.4<br>2.4<br>31.6<br>5.5<br>7.3<br>1.3<br>37.6<br>8.2<br>11.6<br>2.7<br>40.8<br>7.9<br>10.9<br>2.7<br>39.1<br>7.5<br>10.6<br>2.5|
|**CLUSPRO (Ours)**|ViT-L|**51.2**±0.4<br>**22.1**±0.2<br>**23.0**±0.1 **9.3**±0.2|**71.0**±1.1<br>**66.2**±1.0<br>**54.1**±0.7 **39.5**±0.8|**41.6**±0.3<br>**8.3**±0.2<br>**11.6**±0.3 **3.0**±0.1|



_α_ and _β_ in overall training objective (Eq. 12) are empirically set to 0 _._ 2 and 0 _._ 5, respectively (related
experiments in §D of Appendix). In Eq. 10, the temperature parameter _τ_ is maintained at 0 _._ 1.
CLUSPRO is implemented in PyTorch and trained on one NVIDIA RTX 4090 GPU.


**Testing.** Following previous works [17, 83], we apply the post-training calibration to filter out infeasible compositions in the open-world setting during testing. Note that, during model deployment,
there is no any network architectural modification or extra inference cost introduced to the base
model. The primitive prototypes, _**P**_ _[a]_ and _**P**_ _[o]_, are directly discarded after network training.


4.3 COMPARISON TO STATE-OF-THE-ARTS


In this section, we compare our method CLUSPRO with top-leading CZSL solutions on three dataset
( _i_ . _e_ ., MIT-States [26], UT-Zappos [27], and C-GQA [28]) in _CW_ and _OW_ settings.


**Performance** **on** _**CW**_ **Setting.** As summarized in Table 1, our approach CLUSPRO outperforms
recent state-of-the-art (SOTA) CZSL algorithms across all datasets [26, 27, 28] on _CW_ setting.
Concretely, in terms of AUC which is the priority metric for evaluating the model comprehensively,
CLUSPRO yields + **1.4**, + **4.9**, and + **2.5** AUC score gains compared with SOTA methods on MITStates, UT-Zappos, and C-GQA, respectively. Besides, CLUSPRO boosts HM to **40.7** (+ **3.6** %) on
MIT-States, **58.5** (+ **7.1** %) on UT-Zappos, and **32.8** (+ **11.6** %) on C-GQA. Moreover, CLUSPRO
earns consistent best Seen Accuracy (Seen) and Unseen Accuracy (Unseen) improvement. These
consistency improvements are attributed to the fact that our algorithm captures diverse sub-primitive
patterns, _i_ . _e_ ., intra-primitive variations, which improves generalization on unseen compositions.


**Performance** **on** _**OW**_ **Setting.** Table 2 reports comparison results on _OW_ setting. As seen, most
CZSL methods suffer a substantial performance drop due to vast search space in _OW_ setting. In
contrast, our method CLUSPRO still surpasses all published competitors across three datasets [26,
27, 28]. In particular, CLUSPRO attains the highest AUC scores: **9.3** (+ **9.4** %) on MIT-States, **39.5**
(+ **19.7** %) on UT-Zappos, and **3.0** (+ **11.1** %) on C-GQA. In terms of HM, best Seen Accuracy (Seen)
and Unseen Accuracy (Unseen), CLUSPRO still achieves the best results. This reinforces our belief
that learning a group of discriminative prototypes for each primitive helps our model to recognize
unseen compositions, even within challenging _OW_ setting.


4.4 DIAGNOSTIC EXPERIMENT


To evaluate our algorithm designs and gain further insights, we conduct ablation studies on UTZappos [26] and C-GQA [28] in _CW_ settings.


**Key** **Component** **Analysis.** We first investigate the effectiveness of our core idea, _i_ . _e_ ., clusteringbased prototype learning. To make use of discovered rich sub-primitive prototypes to shape attribute
and object embedding spaces, two key training objectives are proposed, _i_ . _e_ ., Prototype-based Contrast L [PCL] (Eq. 10) and Decorrelation L [PDL] (Eq. 11). As shown in Table 3, we build BASELINE that
trains in the three-branch paradigm, without within-primitive prototype clustering ( _i_ . _e_ ., prototype
assignment and updating). We can find that, adding L [PCL] or L [PDL] individually leads to a substantial
performance gain, _e_ . _g_ ., + **4.9** /+ **2.8** AUC on UT-Zappos [26], and + **2.4** /+ **1.9** AUC on C-GQA [28].
This verifies the efficacy of explicitly promoting inter-primitive prototype separation and attributeobject independence. Last, by combining L [PCL] and L [PDL], our full model yields the best results.


8


Published as a conference paper at ICLR 2025


Table 3: **Analysis of core components** (§4.4) on UT-Zappos [27] and C-GQA [28] within _**CW**_ setting.

|Col1|LPCL LPDL<br>(Eq.10) (Eq.11)|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|C-GQA<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|---|---|
|BASELINE (_w/o_ Clustering)||66.2<br>74.6<br>54.1<br>41.0|40.5<br>33.4<br>29.7<br>11.8|
|Prototype-bsaed Contrast<br>Prototype-bsaed Decorrelation<br>Contrast + Decorrelation|✓<br>✓<br>✓<br>✓|69.9<br>74.7<br>57.1<br>45.9<br>67.6<br>75.2<br>56.5<br>43.8<br>**70.7**<br>**76.0**<br>**58.5**<br>**46.6**|43.6<br>36.7<br>32.1<br>14.2<br>43.1<br>36.1<br>31.4<br>13.7<br>**44.3**<br>**37.8**<br>**32.8**<br>**14.9**|



Table 4: **A set of ablation studies** on UT-Zappos [27] (§4.4).



|Prototype K|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|
|_K_ = 1<br>_K_ = 3<br>_K_ = 5<br>_K_ = 10<br>_K_ = 20|68_._9<br>73_._6<br>55_._2<br>42_._8<br>70_._6<br>74_._6<br>56_._9<br>45_._1<br>**70**_._**7**<br>**76**_._**0**<br>**58**_._**5**<br>**46**_._**6**<br>69_._9<br>75_._4<br>58_._3<br>46_._0<br>70_._1<br>75_._2<br>58_._0<br>45_._9|


(a) Per-primitive Prototype Number

|Clustering Branch<br>Attribute Object|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|
|✓<br>✓<br>✓<br>✓|66_._2<br>74_._6<br>54_._1<br>41_._0<br>69_._7<br>74_._3<br>56_._5<br>44_._3<br>69_._5<br>73_._6<br>56_._4<br>44_._1<br>**70**_._**7**<br>**76**_._**0**<br>**58**_._**5**<br>**46**_._**6**|



(c) Clustering Branch



|Coefficient µ|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|
|_µ_ = 0<br>_µ_ = 0_._5<br>_µ_ = 0_._9<br>_µ_ = 0_._99<br>_µ_ = 0_._999|67_._2<br>74_._1<br>54_._9<br>42_._6<br>69_._8<br>75_._1<br>56_._0<br>43_._3<br>70_._5<br>74_._9<br>58_._1<br>46_._0<br>**70**_._**7**<br>**76**_._**0**<br>**58**_._**5**<br>**46**_._**6**<br>70_._5<br>74_._7<br>57_._0<br>45_._1|


(b) Prototype Updating Coefficient _µ_

|Clustering Strategy|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|
|None<br>Cosine Similarity<br>Classical OT<br>Ours|66_._2<br>74_._6<br>54_._1<br>41_._0<br>68_._9<br>74_._7<br>57_._7<br>45_._0<br>70_._1<br>75_._2<br>58_._2<br>45_._8<br>**70**_._**7**<br>**76**_._**0**<br>**58**_._**5**<br>**46**_._**6**|



(d) Clustering Strategy



**Prototype Number Per Primitive** _K_ **.** We next investigate the impact of the prototype number per
primitive. The results are reported in Table 4a. Note that for _K_ = 1, each primitive is directly
represented by the mean embedding of primitive features in the current batch without prototype
clustering. As shown in Table 4a, this baseline yields the HM score of 55.2 and AUC score of
42.8 on UT-Zappos [26], respectively. When representing one primitive concept with a group of
prototypes, we observe that our model CLUSPRO gains stable improvements ( _i_ . _e_ ., HM: 55.2→ **58.5**,
AUC: 42.8→ **46.6** ) as the number of prototypes grows ( _i_ . _e_ ., _K_ = 5). This supports our hypothesis that
leveraging a set of diversified prototypes to describe a primitive concept can capture diverse intraprimitive patterns. However, too many prototypes above _K_ = 5 results in negative gains. This may
be because CLUSPRO suffers from insignificant sub-primitive patterns produced by over-clustering.


**Momentum** **Coefficient** _µ_ **.** Table 4b probes the impact of momentum coefficient _µ_ (Eq.9), which
controls the speed of primitive prototype updating. We can clearly observe that, our algorithm
performs better with a relatively large coefficient ( _i_ . _e_ ., _µ_ = 0 _._ 99), verifying that slow updating is
beneficial, but not too slow ( _i_ . _e_ ., _µ_ = 0 _._ 999). When _µ_ is too small, the performance decreases. In
particular, our algorithm encounters a large decrease at the extreme of no momentum ( _i_ . _e_ ., _µ_ = 0).


**Multi-branch** **Clustering.** In Table 4c, we study the impact of attribute and object clustering
branches by removing one or more specific branches. Removing one branch clustering means that,
we discard primitive-wise clustering to mine sub-primitive patterns in the corresponding branch,
and remove the corresponding training objectives from Eq. 10 and 11. As shown in Table 4c, using attribute or object clustering branches individually only yields limited performance gains, _e_ . _g_ .,
+ **3.3** /+ **3.1** AUC score. By unifying the two clustering branches together, our full model achieves the
best performance across four metrics, confirming their complementarity.


**Clustering** **Strategy.** We examine the impact of our proposed local-aware clustering strategy
( _cf_ . Eq.7) by contrasting it with the model without primitive-wise clustering, the cosine similarity
updating [86], and classical Optional Transport (OT) [87, 88]. As shown in Table 4d, our localaware clustering strategy proves to be more effective: it outperforms the model without clustering,
the cosine similarity, and classical OT across all metrics, _e_ . _g_ ., + **4.7**, + **1.6**, and + **0.8** AUC scores on
UT-Zappos, respectively. This study confirms that considering the intrinsic coherence structure of
attribute/object feature distribution is beneficial for superior prototype assignment.


4.5 QUALITY ANALYSIS


**Success Cases.** The first four columns of Fig. 3 present success cases of our method CLUSPRO for
both seen and unseen compositions on UT-Zappos [27] and C-GQA [28]. As seen, compared with
the base model without primitive-wise prototype clustering, CLUSPRO works much better. Even for
the complex C-GQA dataset, CLUSPRO still correctly predicts labels. For example, CLUSPRO can


9


Published as a conference paper at ICLR 2025


**UT-Zappos**



Baseline

Ours

Ground Truth


**CGQA**


Baseline

Ours

Ground Truth



























Figure 3: Case study on UT-Zappos [27] and C-GQA [28]. We compare CLUSPRO with baseline without
primitive-wise prototype clustering.Correct and incorrect predictions are marked in **green** and **red**, respectively.


Figure 4: Visualization of attribute and object features learned by baseline and CLUSPRO on UT-Zappos [27].


calibrate _Suede_ to _Leather_ (materials) and _Yellow_ to _Orange_ (colors). This demonstrates CLUSPRO
can capture fine-grained primitive patterns ( _e_ . _g_ ., various materials and colors) by representing each
primitive as a set of prototypes. Moreover, benefiting from prototype clustering across the whole
dataset, CLUSPRO automatically mines the global data distribution of each primitive, leading to
generalizing well to unseen compositions. More success cases are provided in §E of Appendix.


**Failure** **Cases** **and** **Limitations.** The last two columns of Fig. 3 show failure cases, where the
attribute and object of images are highly entangled and visually confusing. However, CLUSPRO
still identifies the part of attribute-object compositions. In addition, though making mistakes on
attribute predictions ( _e_ . _g_ ., _Green_ _Vegetable_ in column 6, row 2), such wrong predictions interpret
another attribute ( _i_ . _e_ ., the color) of _Miniature Vegetable_ . Thus we will make use of large language
models to generate informative descriptions for each composition in the future, so as to emphasize
primary primitives. More failure cases are provided in §E of Appendix.


**Feature** **Distributions** **of** **Attribute** **and** **Object.** We visualize learned features of attribute and
object by LBAS (Eq. 6) and L (Eq. 12) in Fig. 4. We observe that, after considering clustering-based
prototype mining, learned attribute and object features become more compact and better separated.
This demonstrates that CLUSPRO can shape well-structured attribute/object embedding spaces by
clustering-based analysis across the whole dataset, hence ensuring better visual disentanglement.


5 CONCLUSION


In this work, we present CLUSPRO, a clustering-based prototype mining framework for Compositional Zero-Shot Learning. This framework aims to learn a well-structured and independent embedding space with multiple discriminative prototypes for each primitive, which alternates between two
steps: 1) within-primitive online clustering for automatically discovering and dynamically updating prototypes; 2) prototype-based primitive representation learning for promoting intra-primitive
separation and inter-primitive decorrelation. Experimental results on three gold-standard datasets
demonstrate the superiority of our clustering-based scheme against existing methods.


10


Published as a conference paper at ICLR 2025


6 ACKNOWLEDGEMENT


This work was supported by the National Natural Science Foundation of China (No. 62222207,
62332010, 62427808, and 62372405), the Fundamental Research Funds for the Central Universities
226-2024-00058, the National Key Laboratory of Human-Machine Hybrid Augmented Intelligence,
Xi’an Jiaotong University (No. HMHAI-202403), Bytedance Doubao Fund, and Earth System Big
Data Platform of the School of Earth Sciences, Zhejiang University.


REFERENCES


[1] Martin N Hebart, Charles Y Zheng, Francisco Pereira, and Chris I Baker. Revealing the multidimensional mental representations of natural objects underlying human similarity judgements.
_Nature human behaviour_, 4(11):1173–1185, 2020. 1


[2] Noam Chomsky. _Aspects of the Theory of Syntax_ . MIT press, 2014. 1


[3] Brenden M Lake, Tomer D Ullman, Joshua B Tenenbaum, and Samuel J Gershman. Building
machines that learn and think like people. _Behavioral and brain sciences_, 40:e253, 2017. 1


[4] Yuval Atzmon, Jonathan Berant, Vahid Kezami, Amir Globerson, and Gal Chechik. Learning
to generalize to new compositions in image understanding. _arXiv preprint arXiv:1608.07639_,
2016. 1


[5] Ishan Misra, Abhinav Gupta, and Martial Hebert. From red wine to red tomato: Composition
with context. In _CVPR_, pages 1792–1801, 2017. 1, 3, 18


[6] Zhe Liu, Yun Li, Lina Yao, Xiaojun Chang, Wei Fang, Xiaojun Wu, and Abdulmotaleb El Saddik. Simple primitives with feasibility-and contextuality-dependence for open-world compositional zero-shot learning. _IEEE TPAMI_, 2023. 1


[7] Yong-Lu Li, Yue Xu, Xiaohan Mao, and Cewu Lu. Symmetry and group in attribute-object
compositions. In _CVPR_, pages 11316–11325, 2020. 1, 18


[8] Hanjae Kim, Jiyoung Lee, Seongheon Park, and Kwanghoon Sohn. Hierarchical visual primitive experts for compositional zero-shot learning. In _ICCV_, pages 5675–5685, 2023. 1


[9] Massimiliano Mancini, Muhammad Ferjad Naeem, Yongqin Xian, and Zeynep Akata. Open
world compositional zero-shot learning. In _CVPR_, pages 5222–5230, 2021. 1, 18, 20


[10] Xiaoming Hu and Zilei Wang. Leveraging sub-class discimination for compositional zero-shot
learning. In _AAAI_, volume 37, pages 890–898, 2023. 1, 3


[11] Chenyi Jiang and Haofeng Zhang. Revealing the proximate long-tail distribution in compositional zero-shot learning. In _AAAI_, volume 38, pages 2498–2506, 2024. 1


[12] Qingsheng Wang, Lingqiao Liu, Chenchen Jing, Hao Chen, Guoqiang Liang, Peng Wang, and
Chunhua Shen. Learning conditional attributes for compositional zero-shot learning. In _CVPR_,
pages 11197–11206, 2023. 1, 18, 19


[13] Tian Zhang, Kongming Liang, Ruoyi Du, Xian Sun, Zhanyu Ma, and Jun Guo. Learning
invariant visual representations for compositional zero-shot learning. In _ECCV_, pages 339–
355, 2022. 1


[14] Siteng Huang, Biao Gong, Yutong Feng, Min Zhang, Yiliang Lv, and Donglin Wang. Troika:
Multi-path cross-modal traction for compositional zero-shot learning. In _CVPR_, pages 24005–
24014, 2024. 1, 3, 4, 7, 8, 16, 17, 18, 19


[15] Yun Li, Zhe Liu, Hang Chen, and Lina Yao. Context-based and diversity-driven specificity in
compositional zero-shot learning. In _CVPR_, pages 17037–17046, 2024. 1, 3, 7, 8, 17, 18, 20


[16] Wentao Bao, Lichang Chen, Heng Huang, and Yu Kong. Prompting language-informed distribution for compositional zero-shot learning. _arXiv preprint arXiv:2305.14428_, 2023. 1, 3, 7,
8, 18


11


Published as a conference paper at ICLR 2025


[17] Nihal V Nayak, Peilin Yu, and Stephen Bach. Learning to compose soft prompts for compositional zero-shot learning. In _ICLR_, 2023. 1, 3, 7, 8, 17, 18, 20


[18] Xiaocheng Lu, Song Guo, Ziming Liu, and Jingcai Guo. Decomposed soft prompt guided
fusion enhancing for compositional zero-shot learning. In _CVPR_, pages 23560–23569, 2023.
1, 3, 4, 7, 8, 17, 18, 20


[19] Alec Radford, Jong Wook Kim, Chris Hallacy, Aditya Ramesh, Gabriel Goh, Sandhini Agarwal, Girish Sastry, Amanda Askell, Pamela Mishkin, Jack Clark, et al. Learning transferable
visual models from natural language supervision. In _ICML_, pages 8748–8763, 2021. 2, 3, 7,
8, 16, 17, 18, 20


[20] Xiangyu Li, Xu Yang, Kun Wei, Cheng Deng, and Muli Yang. Siamese contrastive embedding
network for compositional zero-shot learning. In _CVPR_, pages 9326–9335, 2022. 2, 3, 6, 18,
19


[21] Yun Li, Zhe Liu, Saurav Jha, and Lina Yao. Distilled reverse attention network for open-world
compositional zero-shot learning. In _ICCV_, pages 1782–1791, 2023. 2, 3


[22] Frank Ruis, Gertjan Burghouts, and Doina Bucur. Independent prototype propagation for zeroshot compositionality. In _NeurIPS_, volume 34, pages 10641–10653, 2021. 2, 3


[23] Shaozhe Hao, Kai Han, and Kwan-Yee K Wong. Learning attention as disentangler for compositional zero-shot learning. In _CVPR_, pages 15315–15324, 2023. 2, 3, 4, 18, 19, 20


[24] Chenchen Jing, Yukun Li, Hao Chen, and Chunhua Shen. Retrieval-augmented primitive representations for compositional zero-shot learning. In _AAAI_, volume 38, pages 2652–2660,
2024. 2, 3, 17, 20


[25] Alain Rakotomamonjy, R´emi Flamary, and Nicolas Courty. Generalized conditional gradient:
analysis of convergence and applications. _arXiv preprint arXiv:1510.06567_, 2015. 2, 6


[26] Phillip Isola, Joseph J Lim, and Edward H Adelson. Discovering states and transformations in
image collections. In _CVPR_, pages 1383–1391, 2015. 2, 7, 8, 9, 16, 18, 19, 21


[27] Aron Yu and Kristen Grauman. Fine-grained visual comparisons with local learning. In _CVPR_,
pages 192–199, 2014. 2, 7, 8, 9, 10, 16, 17, 18, 19, 21


[28] Muhammad Ferjad Naeem, Yongqin Xian, Federico Tombari, and Zeynep Akata. Learning
graph embeddings for compositional zero-shot learning. In _CVPR_, pages 953–962, 2021. 2, 3,
7, 8, 9, 10, 16, 18, 19, 20, 21


[29] Tushar Nagarajan and Kristen Grauman. Attributes as operators: factorizing unseen attributeobject compositions. In _ECCV_, pages 169–185, 2018. 3, 18, 19


[30] Senthil Purushwalkam, Maximilian Nickel, Abhinav Gupta, and Marc’Aurelio Ranzato. Taskdriven modular networks for zero-shot compositional learning. In _ICCV_, pages 3593–3602,
2019. 3, 7, 18


[31] Muhammad Umer Anwaar, Zhihui Pan, and Martin Kleinsteuber. On leveraging variational
graph embeddings for open world compositional zero-shot learning. In _ACM MM_, pages 4645–
4654, 2022. 3, 18, 19


[32] Massimiliano Mancini, Muhammad Ferjad Naeem, Yongqin Xian, and Zeynep Akata. Learning graph embeddings for open world compositional zero-shot learning. _IEEE_ _TPAMI_,
46(3):1545–1560, 2022. 3, 18


[33] Muhammad Gul Zain Ali Khan, Muhammad Ferjad Naeem, Luc Van Gool, Alain Pagani, Didier Stricker, and Muhammad Zeshan Afzal. Learning attention propagation for compositional
zero-shot learning. In _WACV_, pages 3828–3837, 2023. 3, 18, 19


[34] Nirat Saini, Khoi Pham, and Abhinav Shrivastava. Disentangling visual embeddings for attributes and objects. In _CVPR_, pages 13658–13667, 2022. 3, 4, 19, 20


12


Published as a conference paper at ICLR 2025


[35] Muli Yang, Cheng Deng, Junchi Yan, Xianglong Liu, and Dacheng Tao. Learning unseen
concepts via hierarchical decomposition and composition. In _CVPR_, pages 10248–10256,
2020. 3


[36] Yuval Atzmon, Felix Kreuk, Uri Shalit, and Gal Chechik. A causal view of compositional
zero-shot recognition. In _NeurIPS_, volume 33, pages 1462–1473, 2020. 3, 7


[37] Junnan Li, Dongxu Li, Caiming Xiong, and Steven Hoi. Blip: Bootstrapping language-image
pre-training for unified vision-language understanding and generation. In _ICML_, pages 12888–
12900, 2022. 3


[38] Chao Jia, Yinfei Yang, Ye Xia, Yi-Ting Chen, Zarana Parekh, Hieu Pham, Quoc Le, YunHsuan Sung, Zhen Li, and Tom Duerig. Scaling up visual and vision-language representation
learning with noisy text supervision. In _ICML_, pages 4904–4916, 2021. 3


[39] Guangyue Xu, Parisa Kordjamshidi, and Joyce Chai. Prompting large pre-trained visionlanguage models for compositional concept learning. _arXiv preprint arXiv:2211.05077_, 2022.
3, 7, 8, 18


[40] Agnar Aamodt and Enric Plaza. Case-based reasoning: Foundational issues, methodological
variations, and system approaches. _AI communications_, 7(1):39–59, 1994. 3


[41] Yi Yang, Yueting Zhuang, and Yunhe Pan. Multiple knowledge representation for big data
artificial intelligence: framework, applications, and case studies. _Frontiers_ _of_ _Information_
_Technology & Electronic Engineering_, 22(12):1551–1558, 2021. 3


[42] Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun. Deep residual learning for image
recognition. In _CVPR_, pages 770–778, 2016. 3, 18


[43] Ze Liu, Yutong Lin, Yue Cao, Han Hu, Yixuan Wei, Zheng Zhang, Stephen Lin, and Baining
Guo. Swin transformer: Hierarchical vision transformer using shifted windows. In _ICCV_,
pages 10012–10022, 2021. 3


[44] Karen Simonyan and Andrew Zisserman. Very deep convolutional networks for large-scale
image recognition. In _ICLR_, 2015. 3


[45] Thomas Cover and Peter Hart. Nearest neighbor pattern classification. _IEEE TIT_, 13(1):21–27,
1967. 3


[46] Salvador Garcia, Joaquin Derrac, Jose Cano, and Francisco Herrera. Prototype selection for
nearest neighbor classification: Taxonomy and empirical study. _IEEE TPAMI_, 34(3):417–435,
2012. 3


[47] Jacob Goldberger, Geoffrey E Hinton, Sam Roweis, and Russ R Salakhutdinov. Neighbourhood components analysis. In _NeurIPS_, volume 17, 2004. 3


[48] Xiaofei He, Deng Cai, Shuicheng Yan, and Hong-Jiang Zhang. Neighborhood preserving
embedding. In _ICCV_, volume 2, pages 1208–1213, 2005. 3


[49] Jake Snell, Kevin Swersky, and Richard Zemel. Prototypical networks for few-shot learning.
In _NeurIPS_, volume 30, 2017. 3


[50] Tianfei Zhou, Wenguan Wang, Ender Konukoglu, and Luc Van Gool. Rethinking semantic
segmentation: A prototype view. In _CVPR_, pages 2582–2593, 2022. 3, 5


[51] Tuo Feng, Wenguan Wang, Xiaohan Wang, Yi Yang, and Qinghua Zheng. Clustering based
point cloud representation learning for 3d analysis. In _ICCV_, pages 8283–8294, 2023. 3


[52] Zheyun Qin, Cheng Han, Qifan Wang, Xiushan Nie, Yilong Yin, and Lu Xiankai. Unified 3d
segmenter as prototypical classifiers. In _NeuIPS_, volume 36, pages 46419–46432, 2023. 3


[53] Yuhang Ding, Liulei Li, Wenguan Wang, and Yi Yang. Clustering propagation for universal
medical image segmentation. In _CVPR_, pages 3357–3369, 2024. 3


13


Published as a conference paper at ICLR 2025


[54] James Chenhao Liang, Tianfei Zhou, Dongfang Liu, and Wenguan Wang. Clustseg: Clustering
for universal segmentation. In _ICML_, pages 20787–20809, 2023. 3


[55] Wenguan Wang, Yi Yang, and Yunhe Pan. Visual knowledge in the big model era: Retrospect
and prospect. _arXiv preprint arXiv:2404.04308_, 2024. 3


[56] Mingcheng Hou and Issei Sato. A closer look at prototype classifier for few-shot image classification. In _NeurIPS_, volume 35, pages 25767–25778, 2022. 3


[57] Hao Zhu and Piotr Koniusz. Transductive few-shot learning with prototype-based label propagation by iterative graph refinement. In _CVPR_, pages 23996–24006, 2023. 3


[58] Wenjia Xu, Yongqin Xian, Jiuniu Wang, Bernt Schiele, and Zeynep Akata. Attribute prototype
network for zero-shot learning. In _NeurIPS_, volume 33, pages 21969–21980, 2020. 3


[59] Chaoqun Wang, Shaobo Min, Xuejin Chen, Xiaoyan Sun, and Houqiang Li. Dual progressive
prototype network for generalized zero-shot learning. In _NeurIPS_, volume 34, pages 2936–
2948, 2021. 3


[60] Wenjin Hou, Shiming Chen, Shuhuang Chen, Ziming Hong, Yan Wang, Xuetao Feng, Salman
Khan, Fahad Shahbaz Khan, and Xinge You. Visual-augmented dynamic semantic prototype
for generative zero-shot learning. In _CVPR_, pages 23627–23637, 2024. 3


[61] Delong Chen, Zhao Wu, Fan Liu, Zaiquan Yang, Shaoqiu Zheng, Ying Tan, and Erjin Zhou.
Protoclip: Prototypical contrastive language image pretraining. _IEEE TNNLS_, 2023. 3


[62] Longlong Jing and Yingli Tian. Self-supervised visual feature learning with deep neural networks: A survey. _IEEE TPAMI_, 43(11):4037–4058, 2020. 3


[63] Linus Ericsson, Henry Gouk, Chen Change Loy, and Timothy M Hospedales. Self-supervised
representation learning: Introduction, advances, and challenges. _IEEE Signal Processing Mag-_
_azine_, 39(3):42–62, 2022. 3


[64] Chen Liang, Wenguan Wang, Jiaxu Miao, and Yi Yang. Gmmseg: Gaussian mixture based
generative semantic segmentation models. In _NeurIPS_, volume 35, pages 31360–31375, 2022.
3


[65] Mahmut Kaya and Hasan S¸akir Bilge. Deep metric learning: A survey. _Symmetry_, 11(9):1066,
2019. 3


[66] Andrew Zhai and Hao-Yu Wu. Classification is a strong baseline for deep metric learning.
_arXiv preprint arXiv:1811.12649_, 2018. 3


[67] Guikun Chen, Xia Li, Yi Yang, and Wenguan Wang. Neural clustering based visual representation learning. In _CVPR_, pages 5714–5725, 2024. 3


[68] James Liang, Yiming Cui, Qifan Wang, Tong Geng, Wenguan Wang, and Dongfang Liu. Clusterfomer: clustering as a universal visual learner. In _NeurIPS_, volume 36, 2024. 3


[69] Yuki Markus Asano, Christian Rupprecht, and Andrea Vedaldi. Self-labelling via simultaneous
clustering and representation learning. In _ICLR_, 2020. 3, 5


[70] Ruijie Quan, Wenguan Wang, Fan Ma, Hehe Fan, and Yi Yang. Clustering for protein representation learning. In _CVPR_, pages 319–329, 2024. 3


[71] Neil Houlsby, Andrei Giurgiu, Stanislaw Jastrzebski, Bruna Morrone, Quentin De Laroussilhe,
Andrea Gesmundo, Mona Attariyan, and Sylvain Gelly. Parameter-efficient transfer learning
for nlp. In _ICML_, pages 2790–2799, 2019. 4, 17


[72] Edward J Hu, Yelong Shen, Phillip Wallis, Zeyuan Allen-Zhu, Yuanzhi Li, Shean Wang,
Lu Wang, and Weizhu Chen. Lora: Low-rank adaptation of large language models. In _ICLR_,
2022. 4, 17


14


Published as a conference paper at ICLR 2025


[73] Wanxing Chang, Ye Shi, and Jingya Wang. Csot: Curriculum and structure-aware optimal
transport for learning with noisy labels. In _NeurIPS_, volume 36, pages 8528–8541, 2023. 5, 7,
20


[74] Guangyi Chen, Weiran Yao, Xiangchen Song, Xinyue Li, Yongming Rao, and Kun
Zhang. Prompt learning with optimal transport for vision-language models. _arXiv_ _preprint_
_arXiv:2210.01253_, 2022. 5


[75] Wenguan Wang, Cheng Han, Tianfei Zhou, and Dongfang Liu. Visual recognition with deep
nearest centroids. In _ICLR_, 2023. 5


[76] Tianfei Zhou and Wenguan Wang. Prototype-based semantic segmentation. _IEEE_ _TPAMI_,
2024. 5


[77] Mathilde Caron, Piotr Bojanowski, Armand Joulin, and Matthijs Douze. Deep clustering for
unsupervised learning of visual features. In _ECCV_, pages 132–149, 2018. 5


[78] Mathilde Caron, Ishan Misra, Julien Mairal, Priya Goyal, Piotr Bojanowski, and Armand
Joulin. Unsupervised learning of visual features by contrasting cluster assignments. In
_NeurIPS_, volume 33, pages 9912–9924, 2020. 5, 18, 19


[79] Richard L Dykstra. An algorithm for restricted least squares regression. _Journal of the Ameri-_
_can Statistical Association_, 78(384):837–842, 1983. 6


[80] Yanhua Yang, Rui Pan, Xiangyu Li, Xu Yang, and Cheng Deng. Dual-stream contrastive
learning for compositional zero-shot recognition. _IEEE TMM_, 26:1909–1919, 2023. 6


[81] Arthur Gretton, Kenji Fukumizu, Choon Teo, Le Song, Bernhard Sch¨olkopf, and Alex Smola.
A kernel statistical test of independence. In _NeurIPS_, volume 20, 2007. 7


[82] Kaiyang Zhou, Jingkang Yang, Chen Change Loy, and Ziwei Liu. Learning to prompt for
vision-language models. _IJCV_, 130(9):2337–2348, 2022. 7, 8, 18


[83] Guangyue Xu, Joyce Chai, and Parisa Kordjamshidi. Gipcol: Graph-injected soft prompting
for compositional zero-shot learning. In _WACV_, pages 5774–5783, 2024. 7, 8, 18


[84] Wei-Lun Chao, Soravit Changpinyo, Boqing Gong, and Fei Sha. An empirical study and
analysis of generalized zero-shot learning for object recognition in the wild. In _ECCV_, pages
52–68, 2016. 7


[85] Diederik P Kingma. Adam: A method for stochastic optimization. _arXiv_ _preprint_
_arXiv:1412.6980_, 2014. 7


[86] Guiyang Chan, Pengcheng Zhang, Hai Dong, Shunhui Ji, and Bainian Chen. Scribblesupervised semantic segmentation with prototype-based feature augmentation. In _ICML_, 2024.
9


[87] Leonid V Kantorovich. On the translocation of masses. _Journal_ _of_ _mathematical_ _sciences_,
133(4), 2006. 9


[88] Marco Cuturi. Sinkhorn distances: Lightspeed computation of optimal transport. In _NeurIPS_,
volume 26, 2013. 9


[89] Shyamgopal Karthik, Massimiliano Mancini, and Zeynep Akata. Kg-sp: Knowledge guided
simple primitives for open world compositional zero-shot learning. In _CVPR_, pages 9336–
9345, 2022. 18


[90] Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li, and Li Fei-Fei. Imagenet: A large-scale
hierarchical image database. In _CVPR_, pages 248–255, 2009. 18


[91] Tomas Mikolov, Ilya Sutskever, Kai Chen, Greg S Corrado, and Jeff Dean. Distributed representations of words and phrases and their compositionality. In _NeurIPS_, volume 26, 2013. 18,
19


[92] Meitar Ronen, Shahaf E Finder, and Oren Freifeld. Deepdpm: Deep clustering with an unknown number of clusters. In _CVPR_, pages 9861–9870, 2022. 20


15


Published as a conference paper at ICLR 2025


This appendix provides additional details for the ICLR 2025 submission, titled _“Learning_
_Clustering-based_ _Prototypes_ _for_ _Compositional_ _Zero-shot_ _Learning”_ . The appendix is organized
as follows:


    - §A Detailed data split statistics.


    - §B Algorithm overview.


    - §C More details about baseline model.


    - §D More quantitative results.


    - §E More qualitative visualization.


    - §F The pseudo-code of prototype assignment and updating.


    - §G More discussions.


A DETAILED DATA SPLIT STATISTICS


We conduct experiments on three widely-used CZSL benchmarks: MIT-States [26], UTZappos [27], and C-GQA [28]. MIT-States consists of 53 _,_ 753 natural images in total, with 115 states
and 245 objects. Following conventional procedures, 1 _,_ 962 available compositions in the dataset
are split into 1 _,_ 262 seen and 300/400 unseen compositions for train/validation/test, respectively. UT-Zappos contains 50 _,_ 025 fine-grain shoe images with 16 states, 12 objects and
116 state-object compositions. Following standard practices, the compositions are split into 83
seen compositions, 15 seen and 15 unseen compositions, 18 seen and 18 unseen compositions for
train/validation/test splits. C-GQA is the most extensive CZSL dataset, containing 453
states and 870 objects for 39 _,_ 298 images in total and over 9 _,_ 500 state-object compositions. The
dataset is divided into 5 _,_ 592 seen compositions for train, 1 _,_ 252 seen and 1 _,_ 040 unseen compositions for validation, and 888 and 923 unseen compositions for test. The detailed data
split statistics is provided in Table 5. Here ∣C _[s]_ ∣ and ∣C _[u]_ ∣ indicate the number of seen and unseen
compositions, respectively. ∣X∣ represents the number of images.


Table 5: The detailed data split statistics (§A) on MIT-States [26], UT-Zappos [27] and C-GQA [28].

|Dataset|∣A∣ ∣O∣|train<br>s<br>∣C ∣ ∣X∣|validation<br>s u<br>∣C ∣ ∣C ∣ ∣X∣|test<br>s u<br>∣C ∣ ∣C ∣ ∣X∣|
|---|---|---|---|---|
|MIT-States [26]<br>UT-Zappos [27]<br>C-GQA [28]|115<br>245<br>16<br>12<br>413<br>674|1262<br>30k<br>83<br>23k<br>5592<br>27k|300<br>300<br>10k<br>15<br>15<br>3k<br>1252<br>1040<br>7k|400<br>400<br>13k<br>18<br>18<br>3k<br>888<br>923<br>5k|



B ALGORITHM OVERVIEW


Fig. 2 presents the architecture of our CLUSPRO. It takes a batch of images and all the semantic
labels ( _i_ . _e_ ., attributes, objects, and compositions) as input. CLUSPRO first utilizes the visual encoder of CLIP [19] along with attribute and object adapters to obtain attribute features _F_ _[a]_, object
features _F_ _[o]_, and composition features _F_ (Eq. 1). Besides, CLUSPRO constructs attribute, object,
and composition prompt representations (Eq. 2) via a soft learnable prompt strategy [14] based on
pre-given semantic labels. Based on these visual and prompt representations from three branches,
the three-path classification loss ( _i_ . _e_ ., L [BAS] ) in Eq. 6 are employed to recognize primitive concepts
and their compositions. Meanwhile, based on the obtained attribute and object visual feature representation ( _i_ . _e_ ., _F_ _[a]_ and _F_ _[o]_ ), CLUSPRO learn prototypes by within-primitive clustering (§3.3) and
then propose two complementary metric learning mechanisms ( _i_ . _e_ ., L [PCL] and L [PDL] ) based on these
prototypes, so as to explicitly shape well-structured and independent primitive embedding space
(§3.4). Finally, we assemble the three-path classification loss L [BAS] and our proposed prototypebased loss constraints ( _i_ . _e_ ., L [PCL] and L [PDL] ) as our final learning objective. Our algorithm not only
learns primitive recognition with pre-given semantic labels, but also automatically discovers diverse
and fine-grained intra-primitive patterns via a set of prototypes across the entire dataset.


16


Published as a conference paper at ICLR 2025


C MORE DETAILS ABOUT BASELINE MODEL


**Visual Feature Extraction.** Following [14, 15, 24], we adopt the visual encoder _ϕ_ [vis] of CLIP [19]
to splits the input image _X_ ∈ R _[H]_ [×] _[W]_ [ ×][3] into _Np_ = _HW_ / _P_ patches, where _P_ is the resolution of each
patch. Note that we following [14, 24] to tune the image encoder of CLIP with LoRA [71, 72], a
lightweight parameter efficient fine-tuning (PEFT) strategy. The encoder _ϕ_ [vis] projects these patches
into patch tokens along with a [cls] token, and then updates these tokens via Transformer blocks.
Finally, the [cls] token serves as the image representation _**f**_ _[c]_ . We adopt attribute adapter _h_ _[a]_ and
object adapter _h_ _[o]_ [71, 72], each implemented as a separate MLP, to project _**f**_ _[c]_ into the discriminative
attribute feature _**f**_ _[a]_ and object feature _**f**_ _[o]_, respectively.


**Prompt Feature Extraction.** We follow existing CZSL [18, 14] to employ an independent prompt
prefix for each branch. Specifically, for each attribute-object composition _ci,j_ = ⟨ _ai,oj_ ⟩, we create
three prompts for each branch, _i_ . _e_ ., attribute prompt _**S**_ _i_ _[a]_ [=] [[] _**[s]**_ _[a]_ 1 _[,...,]_ _**[s]**_ _[a]_ _l_ _[,]_ _**[v]**_ _i_ _[a]_ []][,] [object] [prompt] _**[S]**_ _j_ _[o]_ [=]

[ _**s**_ _[o]_ 1 _[,...,]_ _**[s]**_ _[o]_ _l_ _[,]_ _**[v]**_ _j_ _[o]_ []][,] [and] [composition] [prompt] _**[S]**_ _i,j_ _[c]_ [=] [[] _**[s]**_ _[c]_ 1 _[,...,]_ _**[s]**_ _[c]_ _l_ _[,]_ _**[v]**_ _i_ _[a][,]_ _**[v]**_ _j_ _[o]_ []][,] [where] _**[s]**_ _[a]_ 1∶ _l_ [,] _**[s]**_ _[o]_ 1∶ _l_ [,] [and] _**[s]**_ _[c]_ 1∶ _l_ [are]
learnable pretix contexts initialized by “ _a photo of_ ”. Then these prompts are then fed into the frozen
text encoder of CLIP [19] to obtain prompt features.


**Training** **Loss** L **[BAS]** **.** Following previous CZSL approaches [14, 15, 24], the parameters _θ_ of the
baseline model are learned by minimizing the three-path classification loss (Eq. 6) on the training
dataset. Note that we have omitted the weight decay in Eq. 6 for simplicity. We just follow [14] set
the weight decay as 5 _e_ −5 for all our experiments.


**Feasibility** **Calibration** **for** **Open-World** **Setting.** Following [17, 14, 24], we adopt post-training
feasibility calibration to filter out infeasible compositions that might be present in the open-world
setting. The calibration relies on the assumption that similar objects tend to share similar attributes,
while dissimilar objects are unlikely to exhibit shared attributes. Therefore, given a candidate pair
_c_ = ⟨ _a,o_ ⟩, We calculate the feasibility compositions by computing the relationships between the
objects and the attributes. First, we compute the similarities between the objects:


_ϕ_ ( _o_ ) ⋅ _ϕ_ ( _o_ ˆ)
_ρo_ ( _a, o_ ) = max (14)

_o_ ˆ∈O _[se]_ ∥ _ϕ_ ( _o_ )∥∥ _ϕ_ ( _o_ ˆ)∥ _[,]_

where _o_ ˆ is the other objects paired with the attribute _a_ in seen compositions, and _ϕ_ (⋅) is an embedding function that maps the primitive to a pre-trained embedding. We calculate the similarities _ρa_ ( _a,o_ ) between attributes as same. Next, we combine the two similarities ( _i_ . _e_ ., _ρo_ ( _a,o_ ) and
_ρa_ ( _a,o_ ) ) with a pooling function to obtain _ρ_ ( _a,o_ ).


Finally, we filter out infeasible compositions by only considering compositions above a threshold
_ρ_ ( _a,o_ ) > _T_ on the validation set to make the prediction:


_c_ ˆ = arg max _p_ ( _ci,j_ ∣ _x_ ) + _p_ ( _ai_ ∣ _x_ ) ⋅ _p_ ( _oj_ ∣ _x_ ) _._ (15)
_ci,j_ ∈C _[tgt]_ _,ρ_ ( _ai,oj_ )> _T_


D MORE QUANTITATIVE RESULTS


**Loss Coefficients** _α_ **and** _β_ **.** We further study the effect of loss coefficients _α_ and _β_ for loss functions
LPCL ( _cf_ . Eq.10) and LPDL ( _cf_ . Eq.11) on UT-Zappos [27]. In Table 6a, after fixing the loss coefficient
_β_, CLUSPRO achieves the best performance when _α_ is set to 0 _._ 2. Additionally, in Table 6b, we fix
_α_ and set _β_ with different values to test the impact of LPDL. We observe that setting _β_ as 0 _._ 5 leads
to the best results across all metrics. Accordingly, we set _α_ =0 _._ 2 and _β_ =0 _._ 5 in the training stage.


Table 6: The impact of loss coefficients _α_ and _β_ (§D).



|Coefficient α|UT-Zappos<br>Seen↑ Uneen↑ HM↑ AUC↑|
|---|---|
|_α_ = 0_._1<br>_α_ = 0_._2<br>_α_ = 0_._3<br>_α_ = 0_._4<br>_α_ = 0_._5|70_._5<br>74_._2<br>57_._0<br>45_._1<br>**70**_._**7**<br>**76**_._**0**<br>**58**_._**5**<br>**46**_._**6**<br>70_._6<br>75_._3<br>58_._6<br>46_._3<br>70_._4<br>75_._2<br>58_._2<br>46_._2<br>70_._5<br>74_._7<br>58_._2<br>45_._9|


(a) Loss Coefficient _α_



|Coefficient β|UT-Zappos<br>Seen↑ Uneen↑ HM↑ AUC↑|
|---|---|
|_β_ = 0<br>_β_ = 0_._5<br>_β_ = 1<br>_β_ = 5<br>_β_ = 10|67_._2<br>74_._1<br>54_._9<br>42_._6<br>**70**_._**7**<br>**76**_._**0**<br>**58**_._**5**<br>**46**_._**6**<br>70_._7<br>75_._0<br>58_._0<br>45_._9<br>70_._3<br>74_._9<br>56_._7<br>44_._6<br>67_._6<br>74_._0<br>54_._8<br>41_._7|


(b) Loss Coefficient _β_



17


Published as a conference paper at ICLR 2025


**More Comparison Results with Existing CZSL Methods.** Apart from CLIP-based methods, we
further compare our algorithm CLUSPRO with existing CZSL methods [29, 30, 7, 9, 32, 28, 20, 12,
31, 5] with a pre-trained ResNet18 [42] backbone across three datasets [26, 27, 28]. Table 7 and Table 8 report additional comparison results within _CW_ and _OW_ settings, respectively. As can be seen,
CLIP-based methods significantly outperform traditional vision-based methods. This evidences that
CLIP-based CZSL methods have stronger compositionality for zero-shot generalization. Notably,
CLUSPRO surpasses all other methods and achieves state-of-the-art performance.


Table 7: **More** **comparison** **results** (§D) on MIT-States [26], UT-Zappos [27] and C-GQA [28] within _**CW**_
setting.

|CLIP [19]<br>CoOp [82]<br>PCVL [39]<br>CSP [17]<br>DFSP(i2t) [18]<br>DFSP(BiF) [18]<br>DFSP(t2i) [18]<br>GIPCOL [83]<br>CDS-CZSL [15]<br>Troika [14]<br>PLID [16]|30.2 46.0 26.1 11.0<br>34.4 47.6 29.8 13.5<br>48.5 47.2 35.3 18.3<br>46.6 49.9 36.3 19.4<br>47.4 52.4 37.2 20.7<br>47.1 52.8 37.7 20.8<br>46.9 52.0 37.3 20.6<br>48.5 49.6 36.6 19.9<br>50.3 52.9 39.2 22.4<br>49.0 53.0 39.3 22.1<br>49.7 52.4 39.0 22.1|15.8 49.1 15.6 5.0<br>52.1 49.3 34.6 18.8<br>64.4 64.0 46.1 32.2<br>64.2 66.2 46.6 33.0<br>64.2 66.4 45.1 32.1<br>63.3 69.2 47.1 33.5<br>66.7 71.7 47.2 36.0<br>65.0 68.5 48.8 36.2<br>63.9 74.8 52.7 39.5<br>66.8 73.8 54.6 41.7<br>67.3 68.8 52.4 38.7|7.5 25.0 8.6 1.4<br>20.5 26.8 17.1 4.4<br>- - - -<br>28.8 26.8 20.5 6.2<br>35.6 29.3 24.3 8.7<br>36.5 32.0 26.2 9.9<br>38.2 32.0 27.1 10.5<br>31.9 28.4 22.5 7.1<br>38.3 34.2 28.1 11.1<br>41.0 35.7 29.4 12.4<br>38.8 33.0 27.9 11.0|
|---|---|---|---|
|**CLUSPRO (Ours) **|**52.1**±0.6<br>**54.0**±0.3<br>**40.7**±0.2 **23.8**±0.2|**70.7**±1.0<br>**76.0**±1.2<br>**58.5**±0.6 **46.6**±0.5|**44.3**±0.2<br>**37.8**±0.2<br>**32.8**±0.2 **14.9**±0.1|



Table 8: **More** **comparison** **results** (§D) on MIT-States [26], UT-Zappos [27] and C-GQA [28] within _**OW**_
setting.

|CLIP [19]<br>CoOp [82]<br>PCVL [39]<br>CSP [17]<br>DFSP(i2t) [18]<br>DFSP(BiF) [18]<br>DFSP(t2i) [18]<br>GIPCOL [83]<br>CDS-CZSL [15]<br>Troika [14]<br>PLID [16]|30.1 14.3 12.8 3.0<br>34.6 9.3 12.3 2.8<br>48.5 16.0 17.7 6.1<br>46.3 15.7 17.4 5.7<br>47.2 18.2 19.1 6.7<br>47.1 18.1 19.2 6.7<br>47.5 18.5 19.3 6.8<br>48.5 16.0 17.9 6.3<br>49.4 21.8 22.1 8.5<br>48.8 18.7 20.1 7.2<br>49.1 18.7 20.0 7.3|15.7 20.6 11.2 2.2<br>52.1 31.5 28.9 13.2<br>64.6 44.0 37.1 21.6<br>64.1 44.1 38.9 22.7<br>64.3 53.8 41.2 26.4<br>63.5 57.2 42.7 27.6<br>66.8 60.0 44.0 30.3<br>65.0 45.0 40.1 23.5<br>64.7 61.3 48.2 32.3<br>66.4 61.2 47.8 33.0<br>67.6 55.5 46.6 30.8|7.5 4.6 4.0 0.3<br>21.0 4.6 5.5 0.7<br>- - - -<br>28.7 5.2 6.9 1.2<br>35.6 6.5 9.0 2.0<br>36.4 7.6 10.6 2.4<br>38.3 7.2 10.4 2.4<br>31.6 5.5 7.3 1.3<br>37.6 8.2 11.6 2.7<br>40.8 7.9 10.9 2.7<br>39.1 7.5 10.6 2.5|
|---|---|---|---|
|**CLUSPRO (Ours) **|**51.2**±0.4<br>**22.1**±0.2<br>**23.0**±0.1 **9.3**±0.2|**71.0**±1.1<br>**66.2**±1.0<br>**54.1**±0.7 **39.5**±0.8|**41.6**±0.3<br>**8.3**±0.2<br>**11.6**±0.3 **3.0**±0.1|



**Evaluation** **Results** **for** **Models** **Pre-trained** **on** **Datasets** **with** **No** **Overlap.** To further highlight
the robustness and superiority of our approach, we additionally present results under _CW_ setting that
utilize ViT-B backbone pre-trained with DINO [78] on ImageNet [90] in a self-supervised manner as
ADE [23] instead of CLIP model [19]. Besides, we encode text representation with word2vec [91]


18


Published as a conference paper at ICLR 2025


as [23, 12, 28] instead of the text encoder of CLIP. Table 9 reports the comparison results on UTZappos [27] and CGQA [28]. As seen, our algorithm also demonstrates better performance than the
baseline and SOTA non-CLIP methods [20, 31, 33, 23].


Table 9: **More comparison results** (§D) on UT-Zappos [27] and C-GQA [28] within _**CW**_ setting. Our algorithm
utilizes ViT-B backbone pre-trained with DINO [78] as the visual encoder and word2vec [91] as the text encoder
for a fair comparison with non-CLIP methods.

|Method|UT-Zappos<br>Seen↑ Unseen↑ HM↑ AUC↑|C-GQA<br>Seen↑ Unseen↑ HM↑ AUC↑|
|---|---|---|
|AoP [29]<br>SCEN [20]<br>CVGAE [31]<br>CANet [12]<br>CAPE [33]<br>ADE [23]<br>CGE [28]<br>OADis [34]|59.8<br>54.2<br>40.8<br>25.9<br>63.5<br>63.1<br>47.8<br>32.0<br>65.0<br>62.4<br>49.8<br>34.6<br>61.0<br>66.3<br>47.3<br>33.1<br>60.4<br>67.4<br>45.5<br>31.3<br>63.0<br>64.3<br>51.1<br>35.1<br>-<br>-<br>-<br>-<br>-<br>-<br>-<br>-|17.0<br>5.6<br>5.9<br>0.7<br>28.9<br>12.1<br>12.4<br>2.9<br>28.2<br>11.9<br>13.9<br>2.8<br>30.0<br>13.2<br>14.5<br>3.3<br>32.9<br>15.6<br>16.3<br>4.2<br>35.0<br>17.7<br>18.0<br>5.2<br>38.0<br>17.1<br>18.5<br>5.4<br>38.3<br>19.8<br>20.1<br>7.0|
|Baseline<br>**CLUSPRO (Ours)**|61.0<br>62.9<br>45.1<br>31.9<br>**65**_._**1**<br>**68**_._**0**<br>**52**_._**3**<br>**37**_._**2**|34.6<br>15.9<br>16.6<br>4.5<br>**39**_._**3**<br>**23**_._**0**<br>**22**_._**3**<br>**7**_._**6**|



**Efficiency** **Analysis.** The efficiency comparison results with the state-of-the-art Trokia [14] and
our baseline are reported in Table 10. Note that, CLUSPRO conducts within-primitive prototype
clustering in a nonparametric manner and discards these learned sub-primitive prototypes during the
testing phase. Thus, as shown in Table 10, CLUSPRO neither requires additional trainable parameters
nor causes any inference delay during testing compared to the base model. Though efficient in terms
of parameters and inference speed, our online clustering algorithm brings slight training delay (
∼ 11 _._ 5% on UT-Zappos [27]). Moreover, the effective clustering algorithm allows CLUSPRO to
outperform the state-of-the-art Trokia in terms of classification accuracy, trainable parameters, and
inference speed.


Table 10: Efficiency comparison on UT-Zappos [27]. Here, we report trainable parameters, training
time per epoch, and inference speed for each model. See in §D for more details.

|Method|Params↓|Memory↓|Training time↓|Inference Speed↓|AUC↑|
|---|---|---|---|---|---|
|Troika [14]<br>Baseline|21_._7M<br>8_._7M|19_._9G<br>18_._2G|4_._1min<br>4_._0min|14_._9ms<br>14_._6ms|41_._9<br>41_._0|
|**CLUSPRO (ours)**|8_._7M|18_._5G|4_._6min|14_._6ms|46_._6|



**Number** **of** **Prototypes** _K_ **.** In Table 11, we conduct the experiment by setting the number _K_ of
prototypes based on the proportion of training samples for each primitive. In UT-zappos [27] dataset,
training samples per primitive range from 0.2% to over 20%. Thus, we assign _K_ =1 to the primitive
with 0 _._ 2 ∼ 5% training samples, _K_ = 2 to the primitive with 5 ∼ 10% training samples, _K_ = 3 to the
primitive with 10 ∼ 15% training samples, _K_ = 4 to the primitive with 15 ∼ 20% training samples,
and _K_ =5 to the primitive with over 20% training samples. As seen, this approach results in slightly
better performance than setting a fixed value for all the primitives.


Table 11: **Ablative experiments regarding varying** _K_ on UT-Zappos [27]. See §D for more details.

|K range|UT-Zappos<br>Seen↑ Uneen↑ HM↑ AUC↑|
|---|---|
|unique value 5<br>[1_,_5]|70_._7<br>76_._0<br>58_._5<br>46_._6<br>**71**_._**0**<br>**76**_._**0**<br>**58**_._**6**<br>**46**_._**8**|



E MORE QUALITATIVE VISUALIZATION


**More Case Study.** We provide additional success and failure cases of our method CLUSPRO across
three CZSL benchmarks, _i_ . _e_ ., MIT-States [26] in Fig. 5, UT-Zappos [27] in Fig. 6 and C-GQA [28]


19


Published as a conference paper at ICLR 2025


in Fig. 7. We also compare our approach CLUSPRO with baseline without within-primitive clustering. As seen, by mining rich sub-primitive patterns via within-primitive clustering, CLUSPRO can
produce more accurate composition predictions, even recognizing fine-grained primitives, such as
various materials and colors. For failure cases, where the attribute and object of images are highly
entangled, CLUSPRO still identifies the part of the attribute-object composition.


F PSEUDO CODE OF PROTOTYPE ASSIGNMENT AND UPDATING


Algorithm 1 provides the pseudo-code of “Local-aware Prototype Assignment” and “Prototype Updating”. [To guarantee reproducibility, our code is available at CLUSPRO.](https://github.com/quhongyu/ClusPro)


G DISCUSSION


**Data** **Overlap** **Analysis.** Given that CLIP [19] is trained on millions of text-image pairs sourced
from the web, it is hard to know whether CLIP has been exposed to certain unseen compositions
during its pre-training, which violates the zero-shot learning setting factually. Most current researches [18, 17, 15, 24] in CZSL, including our work, report the performance in the Generalized
Zero-shot Learning [9] for both _CW_ and _OW_ settings, where test samples include both seen and
unseen compositions. Hence, it naturally brings up the question: _whether CLIP meets the definition_
_of_ _Generalized_ _Zero-shot_ _Learning_ . Based on the data overlap analysis on 35 datasets as reported
in [19], there is a median overlap of 2.2% and an average overlap of 3.2%. Due to this small amount
of overlap, the overall accuracy shift is less than 0.1% with the largest shift as 0.6%. As such, CLIP is
only exposed to a very small number of unseen compositions during pre-training, and the impact on
the performance is limited. However, the potential composition leaking in the pre-training of CLIP
indeed leads to an unfair comparison with other non-CLIP methods [23, 28, 34]. Thus, we argue that
it is important to emphasize the comparisons with other CLIP-based methods that share the same
pre-training (comparison results in Table 1 and 2). Moreover, where possible, it is also advisable to
report performance metrics for non-CLIP variants to ensure a comprehensive evaluation.


**Limitation.** One limitation of our algorithm is that it needs extra within-primitive prototype clustering from the perspective of optimal transport after each training iteration, leading to increasing
time complexity. However, in practice, our clustering algorithm only brings slight training delay
attributed to efficient GCG algorithm [73] for solving such clustering problem. Additionally, our
mined sub-primitive prototypes are subject to the data distribution of the training dataset. Thus rare
primitive concepts in the dataset ( _i_ . _e_ ., long-tail distribution), like many previous state-of-the-arts,
pose significant challenges for primitive-wise clustering to discover diverse sub-primitive patterns,
thus resulting in poor performance on unseen compositions about these primitives. Also, the number
of prototypes for each primitive currently is set to a fixed value, which may not be optimal given that
intra-primitive variability varies across primitives. Thus it is interesting to find ways to automatically
determine _K_ [92] for different primitives, which may further boost performance.


**Border Impact.** This work introduces CLUSPRO, a powerful clustering-based framework for Compositional Zero-Shot Learning via exploring dataset-level context, which overcomes the limitations
of previous solutions relying on single or paired images for visual disentanglement. This model provides a feasible way to discover diverse sub-primitive patterns in massive training data, and directly
shape well-structured embedding space based on these mined patterns. On the positive side, CLUSPRO pushes the boundary of CZSL algorithms, and can benefit a number of potential real-world
applications, _e_ . _g_ ., autonomous driving and robotics. For the potential negative societal impacts, our
CLUSPRO struggles in handling very rare primitives in the dataset, which is a common issue of
current CZSL algorithms, thus leading to inaccurate decisions or planning of systems. To avoid this
potential problem, it is crucial to develop a security protocol in case our approach fails to perform
as expected in real-world scenarios.


20


Published as a conference paper at ICLR 2025


**MIT-States**



Baseline

Ours

Ground Truth


**MIT-States**


Baseline

Ours
Ground Truth





















Figure 5: More case studies on MIT-States [26]. We compare CLUSPRO with baseline without primitive-wise
prototype clustering. Correct and incorrect predictions are marked in **green** and **red**, respectively.


**UT-Zappos**



Baseline

Ours

Ground Truth


**UT-Zappos**


Baseline

Ours

Ground Truth















Figure 6: More case studies on UT-Zappos [27]. We compare CLUSPRO with baseline without primitive-wise
prototype clustering. Correct and incorrect predictions are marked in **green** and **red**, respectively.


**CGQA**



Baseline

Ours
Ground Truth


**CGQA**


Baseline

Ours

Ground Truth





























Figure 7: More case studies on C-GQA [28]. We compare CLUSPRO with baseline without primitive-wise
prototype clustering. Correct and incorrect predictions are marked in **green** and **red**, respectively.


21


Published as a conference paper at ICLR 2025


**Algorithm 1** Pseudo-code of prototype assignment and updating in a PyTorch-like style.


"""
# P: primitive prototypes (C x K x D)
# F: primitive feature embeddings (N x D)
# y: labels for primitive features F (N)


# C: number of attribute or object primitives
# K: number of prototypes for each primitive
# N: batch size
# mu: momentum coefficient (Eq.8)
"""


#======= local-aware prototype assignment =======#
**def** **prototype** **assignment** (F, label):

# prototype assignment for each primitive feature (Eq.7)
Q = **torch.einsum** (’nd,ckd->nkc’, F, P)
S = **torch.einsum** (’nd,nd->nn’, F, F) # primitive self-similarity matrix


**for** c **in** range(C):

init_q = Q[...,c]
init_l = **local** ~~**o**~~ **nline** **clustering** (init_q, S) # one-hot matrix


# prototype assignments for features in primitive c
l_c = Q[label == c]
f_c = F[label == c, ...]


# find features that are assigned to each sub-primitive prototype
l_c_tile = **torch.einsum** (l_c, tile=K)
l_q = init_l    - l_c_tile


# find features with primitive c that are correctly classified
f_c_tile = **repeat** (l_c, tile=f_c. **shape** [-1])
f_c_q = f_c    - f_c_tile


# new cluster features for primitive c
a = **torch.mm** (l_q. **transpose** (),f_c_q)


# momentum updating for each primitive prototype (Eq.8)
**prototype** ~~**u**~~ **pdating** (l_q, a, c)


#======= prototype updating =======#
**def** **prototype** **updating** (l_q, a, c):

# num assignments for each prototype of primitive c
n = **torch.sum** (l_q, dim=0)
a = **normalize** (a)


# prototype updating
**if** **torch.sum(n)**  - 0:

P_c = P[c, n != 0,:]    - mu + a[n != 0,:]    - (1    - mu)
P[c, n != 0, :] = P_c


22


