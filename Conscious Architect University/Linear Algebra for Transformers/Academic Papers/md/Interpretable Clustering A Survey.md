INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 1

# Interpretable Clustering: A Survey


Lianyu Hu _[†]_, Mudi Jiang _[†]_, Junjie Dong, Xinying Liu, and Zengyou He _[∗]_


**Abstract** —In recent years, much of the research on clustering algorithms has primarily focused on enhancing their accuracy and
efficiency, frequently at the expense of interpretability. However, as these methods are increasingly being applied in high-stakes
domains such as healthcare, finance, and autonomous systems, the need for transparent and interpretable clustering outcomes has
become a critical concern. This is not only necessary for gaining user trust but also for satisfying the growing ethical and regulatory
demands in these fields. Ensuring that decisions derived from clustering algorithms can be clearly understood and justified is now a
fundamental requirement. To address this need, this paper provides a comprehensive and structured review of the current state of
explainable clustering algorithms, identifying key criteria to distinguish between various methods. These insights can effectively assist
researchers in making informed decisions about the most suitable explainable clustering methods for specific application contexts,
while also promoting the development and adoption of clustering algorithms that are both efficient and transparent. For convenient
access and reference, an open repository organizes representative and emerging interpretable clustering methods under the taxonomy
[proposed in this survey, available at https://github.com/hulianyu/Awesome-Interpretable-Clustering](https://github.com/hulianyu/Awesome-Interpretable-Clustering)


**Index Terms** —Interpretable Clustering, Algorithmic Interpretability, Interpretable Machine Learning and Data Mining, Explainable
Artificial Intelligence (XAI)


✦


**1** **INTRODUCTION**



Cluster analysis [1], [2] is a crucial task in the field of data
mining, which aims to partition data into distinct groups
based on the intrinsic characteristics and patterns within
the data. This process helps in uncovering meaningful
structures and relationships among data points, facilitating
various applications and further analysis.
For decades, numerous algorithms have been proposed
to solve clustering problems across different applications,
achieving high accuracy. However, in most cases, clustering
models exist as black boxes, leading to common questions such as: How are the clustering results formed? Can
people understand the logic behind the formation of the
clustering results? Is the model trustworthy? The clustering
model’s ability to explain such issues is tentatively defined
as model’s clustering interpretability or explainability [3].
Explainability is commonly defined as the extent to which
the internal mechanics of a machine learning system can be
clarified in human terms, i.e., explanations should be faithful to the model while providing information that is relevant
in the current context [4]. Given that most researchers in
data mining and machine learning use interpretability and
explainability interchangeably [5], this paper will use the
term interpretability throughout this paper.
To date, interpretability still lacks a precise or mathematical definition [6], [7], [8]. Different sources provide slightly
varying definitions – for instance, it is defined as “the ability
to explain or to present in understandable terms to a hu

_•_ _L._ _Hu_ _is_ _with_ _College_ _of_ _Information_ _Science_ _and_ _Engineering,_ _Henan_
_University of Technology, Zhengzhou, China._
_E-mail: hly4ml@gmail.com_

_•_ _M._ _Jiang,_ _X._ _Liu,_ _Z._ _He_ _are_ _with_ _School_ _of_ _Software,_ _Dalian_ _University_
_of_ _Technology,_ _Dalian,_ _China._ _J._ _Dong_ _is_ _with_ _Xinchang_ _Power_ _Supply_
_Company, State Grid Corporation of China, Shaoxing, China._
_E-mail: zyhe@dlut.edu.cn_


_†_ _These authors contributed equally to this work._
_∗_ _Corresponding author._



man” in [9], “the degree to which a human can understand
the cause of a decision” in [10], and “make the behavior and
predictions of machine learning systems understandable to
humans” in [4]. Collectively, these definitions can all capture
the essence of interpretability.
However, the interpretability of a model may vary depending on the user’s actual needs and can manifest in
different dimensions. In studies of specific diseases, physicians are often more concerned with identifying patient
characteristics that indicate a higher likelihood of having
the disease and whether these characteristics can assist in
early diagnosis. In contrast, data scientists focus on designing interpretable models that provide compelling explanations for patients and effectively elucidate the reasons
behind each patient’s assignment to a particular disease
type, thereby aiding in understanding the impact of various
characteristics on the outcomes. Therefore, although various
interpretable methods can provide different degrees of interpretability across multiple dimensions, it remains necessary
to provide a systematic summary and distinction of these
methods.
As far as we know, there have been several reviews
that summarize methods related to interpretability. However, most existing reviews are either too general [11], [12],

[13], [14] or focus on specific domains [15], [16], [17], [18],
and do not focus on the clustering domain. Moreover, the
only survey closely related to this topic [19] was published
relatively early and thus does not include the latest research
or emerging ideas in this field. To fill this gap, we have
comprehensively collected existing interpretable clustering
methods and proposed a set of criteria to classify them,
ensuring that all methods related to interpretable clustering
can be categorized under one of these criteria. Furthermore,
we divide the clustering process into three stages and classify all interpretable clustering methods according to their
interpretability at different stages, providing the overall


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 2



framework for this review: (1) the feature selection stage
(pre-clustering), (2) the model building stage (in-clustering),
and (3) the model explanation stage (post-clustering). We
believe this review will provide readers with a new understanding of interpretable clustering and lay a foundation for
future research in this area.
The rest of this paper is organized as follows. Section
2 discusses the need of interpretable clustering. Section
3 provides a taxonomy of interpretable clustering methods. Sections 5 to 7 review interpretable pre-clustering, inclustering, and post-clustering methods, respectively, based
on different stages of interpretability in the clustering process. Finally, Section 9 concludes the paper and discusses
future directions.


**2** **THE** **NEED** **FOR** **INTERPRETABLE** **CLUSTERING**


As artificial intelligence and machine learning algorithms
become more advanced and excel in various tasks, they are
increasingly being applied across multiple domains. However, their use remains limited in risk-sensitive areas such
as healthcare, justice, manufacturing, defense, and finance.
The application of AI systems and the underlying machine
learning algorithms in these fields involves three key human
roles [20]: developers, end users within the relevant domain,
and regulators at the societal level. For any of these roles,
it is crucial for humans to understand and trust how the
algorithm arrives at its results. For instance, developers
need to understand how the algorithm produces meaningful
outcomes and recognize its limitations, enabling them to
correct errors or conduct further assessments. End users
need to evaluate whether the algorithm’s results incorporate
domain-specific knowledge and are well-founded. Regulators need to consider the implications of the algorithm’s
outcomes, such as fairness, potential discrimination, and
where the risks and responsibilities lie. This necessitates
transparency and trustworthiness throughout the entire algorithmic process.
In response to these challenges, research in interpretable
machine learning has gained momentum [4]. Much of the
downstream analysis is typically built at the cluster level,
where clustering methods are designed to generate patterns
as the initial understanding of the data. At this stage, the
need for interpretability of clustering, along with the transparency of algorithmic mechanisms, becomes increasingly
pronounced.


**2.1** **What is interpretable clustering?**


Conventional clustering algorithms typically focus on delivering clustering results, treating accuracy and efficiency
as top priorities, especially in complex, high-dimensional
data. The models they employ are largely “black boxes”,
particularly in the case of advanced clustering methods
that often utilize representation learning techniques and
deep learning. These methods consider all dimensions and
feature values of the data, actively involving them in the
generation of clustering results. However, the reasoning behind “why” and “how” these results are generated remains
opaque to the algorithm designers, making it even more difficult for end users to comprehend. In contrast, interpretable



clustering methods explicitly aim to explain the clustering
results, enabling humans to understand why the algorithmic
process produces meaningful clustering outcomes.
For instance, in a loan evaluation scenario, a conventional clustering algorithm may integrate all applicant attributes such as age, gender, income, and credit score into
its objective function, treating them as equally important
in forming clusters. While this may produce well-separated
applicant groups, it remains unclear which attributes actually drive these distinctions. In contrast, an interpretable
clustering method can reveal the decisive factors such as
low credit scores or high debt-to-income ratios that define
a cluster, allowing the reasoning behind the grouping to be
clearly understood and validated.
Interpretable clustering, in general, aims to make such
reasoning explicit by incorporating mechanisms that expose
how cluster assignments are determined. Any approach
that provides interpretability during the clustering process
or makes the resulting outcomes easier to understand can
be categorized under this domain. A hallmark of these
methods is the integration of interpretable models [21] at
various stages of the clustering pipeline. These interpretable
components accompany the final clustering results, making
them understandable, trustworthy, and usable by humans.
Such components may include, but are not limited to, the
use of specific feature values (e.g., age, income) combined
with explicit model syntax (e.g., rules, trees) to identify key
factors that contribute to the clustering outcomes, allowing
end users to comprehend the results and validate the conclusions derived from these interpretable elements.


**2.2** **What is a good interpretable clustering method?**


An interpretable clustering method provides clear evidence
to explain how clustering results are derived, offering end
users the opportunity to understand both the behavior of
the algorithm and the logic behind the clustering outcomes.
However, whether end users ultimately choose to trust
this evidence may depend on application-driven needs or
expert knowledge. As machine learning researchers and
data scientists, we are primarily equipped to assess what
constitutes a good interpretable clustering method from a
data-driven perspective.
A good interpretable clustering method can therefore
be characterized by the following key properties, reflecting
its ability to provide explanations in two complementary
aspects:


_•_ **Simplicity and parsimony.** The form of interpretable
evidence should be as concise as possible, minimizing the number of feature values or conditions used
to define each cluster. A simpler explanatory form
not only reduces the cognitive load on end users
but also allows them to follow the reasoning process
more easily. In other words, the fewer features required to describe how a cluster is formed, the more
transparent and accessible the explanation becomes.

_•_ **Uniqueness** **and** **exclusivity.** Each cluster should
convey distinct and non-overlapping information,
reflecting its own functional role within the data.
Ideally, the same interpretable evidence should correspond to only one specific cluster, ensuring that the


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 3



**Decision Tree**












|Rules<br>Model<br>Prototype<br>Convex Polyhedral<br>Description Interp<br>Model-level<br>Level of Interpretability<br>Feature-level|Col2|Model|
|---|---|---|
|**Feature-level**|**Feature-level**|**Feature-level**|
|**Feature-level**|||



Fig. 1. Interpretable clustering taxonomy categorized by distinct criteria, most existing methods align with a single category per criterion.



explanation remains both credible and unambiguous. This exclusivity enhances trust, as end users can
be confident that the evidence is tightly linked to a
single, well-defined cluster, rather than ambiguously
shared among multiple clusters. Overlapping explanations across clusters would blur these distinctions
and risk confusion or misinterpretation.


These principles can further guide how the quality of
interpretability is evaluated in practice. To determine the
goodness of an interpretable clustering method, or even
to quantify it, one must consider the specific interpretable
model being used. For example, when utilizing decision
tree models, it is clear that the evidence used to define each
cluster is highly distinctive through the tree’s splits, thereby
satisfying the basic requirement of uniqueness. Additionally, one can measure how easily end users understand
the results by examining the structural parameters of the
tree [22], such as the number of leaf nodes (i.e., the number
of clusters) and the average depth of the tree. The process
from data to clusters is represented by paths from the root to
the leaf nodes, with each branching node recording the decision (splitting feature value) that leads to a cluster. Using
fewer feature values results in more concise interpretable
evidence, making it easier for end users to understand and
trust the clustering results.


**3** **A** **TAXONOMY** **OF** **INTERPRETABLE** **CLUSTERING**


**METHODS**


In this section, after collecting and systematically reviewing
existing interpretable clustering methods, we establish a
unified taxonomy that organizes them along four distinct
criteria, as illustrated in Fig. 1. This taxonomy provides
a structured framework for classifying interpretable clustering methods according to four complementary dimensions: **(1)** **Process** **stage**, **(2)** **Interpretable** **model**, **(3)** **In-**
**terpretability** **level**, and **(4)** **Data** **modality** . Together, these
dimensions comprehensively characterize how existing approaches achieve interpretability and serve as a foundation



for identifying appropriate methods under different analytical contexts and requirements.
**(1)** **Process** **stage.** Based on widely recognized clustering processes, interpretable clustering methods can be
categorized into three types: _pre-clustering_, _in-clustering_, and
_post-clustering_ . _Pre-clustering_ methods are typically executed
before the clustering process and focus on selecting or
extracting interpretable features, aiming to provide humanunderstandable representations for subsequent clustering.
_In-clustering_ methods integrate interpretability directly into
the model construction process, generating accurate partitions whose formation mechanisms are inherently transparent, without the need for additional post-hoc explanations.
_Post-clustering_ methods, in contrast, interpret the results of
existing black-box clustering models by constructing surrogate interpretable models that reveal the reasoning behind
previously opaque clustering outcomes.
**(2)** **Interpretable** **model.** A large proportion of inclustering and post-clustering approaches can be distinguished by the type of interpretable model they employ. As
illustrated in Fig. 2, four representative model families are
commonly used to construct explainable cluster structures,
each offering a distinct mechanism for generating humanunderstandable evidence of how clusters are formed.


_•_ _**Decision**_ _**tree.**_ The decision tree model is one of
the most widely recognized interpretable models
in machine learning and has long been used for
classification and regression tasks. Its interpretability
stems from the recursive, hierarchical splitting of
data based on feature values to generate intermediate
results, where the final outputs can be traced through
the sequence of splits. Instances are allocated to
different leaf nodes (clusters) according to specific
splitting criteria, following a transparent path from
the root node, which represents the entire dataset,
down through the branching nodes. This hierarchical
structure allows end users to understand both _why_
and _how_ each sample is assigned to a cluster, making
the reasoning process explicit and verifiable.

_•_ _**Rules.**_ In contrast to decision tree-based models,


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 4



where users must trace a hierarchical path from the
root to a leaf node, rule-based methods provide a
more direct way to understand how clusters are
defined. Interpretability arises from generating a set
of candidate rules based on feature values, typically
expressed as logical combinations (conjunctions or
disjunctions) of conditions at the same level, such
as “age _>_ 40 and income _<_ 30k.” These flat, nonhierarchical structures describe cluster-defining conditions in a way that is both concise and intuitive for
end users, avoiding the progressive complexity that
can arise in deep trees.

_•_ _**Prototype.**_ The concept of a prototype, also referred
to as an exemplar, can be understood analogously
to the centroid in the _k_ -means algorithm. Each prototype serves as a representative of its corresponding cluster, and samples that are sufficiently close
to a given prototype are considered members of
that cluster. Interpretability in this case arises from
identifying which representative instance or exemplar contributes most to defining the cluster. Unlike
hierarchical or rule-based models, prototype-based
approaches emphasize _representativeness_ rather than
logical structure, and may allow a certain degree of
overlap among the clusters being explained.

_•_ _**Convex polyhedral.**_ A convex polyhedral model generalizes the geometric intuition of convex polygons
to higher dimensions, where each cluster is represented as a convex region enclosed by bounding planes formed by the intersection of a finite
number of half-spaces. Interpretability arises from
the explicit geometric constraints that delineate each
region, allowing cluster membership to be visually
and spatially verified. Unlike prototype-based models with boundaries implicitly defined by similarity
measures, convex polyhedral models provide explicit
and well-defined geometric boundaries.

_•_ _**Description-based.**_ Beyond the four canonical forms,
data-type-dependent interpretable models exist that
do not fit neatly into a single category. A representative example is the description-based approach,
where clusters are defined by concise, humanreadable predicates or summaries derived directly
from data semantics. Unlike decision tree or rulebased models with fixed syntactic forms, or geometric models such as prototype- and polyhedral-based
methods that rely on spatial continuity, descriptionbased models are particularly common in relational
or graph-structured settings. In community analysis, for instance, explanations often rely on node
attributes, structural connectivity, or semantic relations, providing non-vector, structurally grounded
summaries that capture each community’s distinctive role and clearly distinguish it from other communities.


_**Illustrative**_ _**example.**_ Consider a two-dimensional
dataset with two features ( _F_ 1 _, F_ 2) and three natural clusters,
as illustrated in Fig. 2. This illustrative example is used to
show how different interpretable models provide transparent reasoning about the formation of clusters.




_•_ **Decision tree.** The decision tree partitions the feature
space through a sequence of hierarchical splits. For
example, the model may first divide the data based
on whether _F_ 2 _<_ 2 _._ 5, forming Cluster 1 for samples
that satisfy this condition (left branch). For the remaining samples with _F_ 2 _≥_ 2 _._ 5, a second split on
_F_ 1 _>_ 3 further separates them into Cluster 2 and
Cluster 3 ( _F_ 1 _≤_ 3). Each cluster can thus be traced
through an explicit decision path from root to leaf.
For instance, the path “ _F_ 2 _≥_ 2 _._ 5 (at the root node)
_→_ _F_ 1 _>_ 3 (at the right branch)” corresponds to
Cluster 2, clearly illustrating the sequential reasoning
behind the assignment.

_•_ **Rule.** Rule-based models describe clusters through a
set of flat logical conditions rather than hierarchical
decision paths. In this example, the three clusters
can be expressed as parallel rules operating at the
same logical level: samples satisfying _F_ 1 _<_ 2 _._ 5 and
_F_ 2 _<_ 2 _._ 5 form Cluster 1; those with _F_ 1 _>_ 3 and
_F_ 2 _>_ 2 form Cluster 2; and those with _F_ 1 _<_ 2 _._ 5
and _F_ 2 _>_ 3 form Cluster 3. Each rule provides a
self-contained, human-readable statement specifying
the feature-value combinations that define cluster
membership. Compared with the decision tree, rulebased models establish direct logical relations between features and clusters.

_•_ **Prototype.** Prototype-based models define each cluster through a representative exemplar. In this example, three prototypes **p** 1, **p** 2, and **p** 3 represent the
three clusters, each with its own influence region
in the feature space. For instance, samples near **p** 1
at ( _F_ 1 = 1 _, F_ 2 = 1) form Cluster 1, those around
**p** 2 at ( _F_ 1 = 4 _._ 5 _, F_ 2 = 4 _._ 5) form Cluster 2, and
those surrounding **p** 3 at ( _F_ 1 = 1 _, F_ 2 = 5) form
Cluster 3. Interpretability arises from how each prototype locally captures its cluster while all prototypes collectively outline the global cluster structure.
Unlike hierarchical or rule-based models relying on
logical structure, prototype-based approaches use exemplars as compact, interpretable representations of
clusters.

_•_ **Convex** **polyhedral.** Convex polyhedral models represent each cluster as a convex region enclosed by
a set of bounding planes. In this example, three
convex regions (rectangular in shape) are formed in
the ( _F_ 1 _, F_ 2) space, each defined by the intersection
of two half-planes. Samples falling within _−_ 0 _._ 5 _<_
_F_ 1 _<_ 2 _._ 5 and _−_ 0 _._ 75 _<_ _F_ 2 _<_ 2 _._ 75 form Cluster 1;
those within 2 _._ 75 _<_ _F_ 1 _<_ 6 and 2 _._ 5 _<_ _F_ 2 _<_ 6 form
Cluster 2; and those within _−_ 1 _<_ _F_ 1 _<_ 3 _._ 25 and
1 _._ 8 _< F_ 2 _<_ 5 _._ 5 form Cluster 3. Interpretability arises
from the explicit half-space boundaries that locally
define each cluster’s convex region, while all convex
polyhedra collectively establish a coherent geometric
representation of the global cluster structure.


_**Key**_ _**differences.**_ In terms of explanation, decision-tree
models yield hierarchical paths composed of sequential
decisions; rule-based models provide flat logical conditions
(conjunctions or disjunctions) without hierarchy; prototypebased models explain clustering through similarity to rep

INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 5


























|Col1|Cluster 1<br>Cluster 2<br>Cluster 3|Cluster 1<br>Cluster 2<br>Cluster 3|
|---|---|---|
||||





Fig. 2. Illustration of four interpretable clustering models applied to the same two-dimensional dataset with three Gaussian clusters. The upper
panels display how each model partitions the feature space, while the bottom panels show the feature values used for interpretability.



resentative exemplars; and convex polyhedral models provide explanations via explicit geometric constraints formed
by half-space intersections. All four approaches produce
human-readable descriptions but differ in both their representational form (path, flat rule, exemplar, or hyperplane)
and the aspect they make explicit, including decision order,
logical structure, representativeness, and geometric boundary.
**(3)** **Interpretability** **level.** Existing methods can be categorized into _model-level_ and _feature-level_ interpretability
based on their degree of explainability. While most of
the methods discussed in this paper focus on designing
interpretable models to obtain clustering results or fitting
the results of third-party algorithms, some methods also
emphasize the extraction of interpretable features from complex data, or the investigation of the relationships between
specific clusters and their associated features, thereby enhancing interpretability.
**(4) Data modality.** Finally, methods can also be classified
by the nature of data they are designed to process. Common
data modalities include tabular data (numerical, categorical,
or mixed), sequential data (e.g., discrete sequences or time
series), as well as formats such as images, text, and graphs.
The appropriate interpretable model and explanatory form
often depend on the structural characteristics of the underlying data.
Overall, these four criteria provide a structured taxonomy that systematizes existing interpretable clustering
methods, informs future methodological development, and
establishes a conceptual bridge to the taxonomies of supervised eXplainable AI (XAI).


**4** **CONCEPTUAL** **CORRESPONDENCE** **BETWEEN** **IN-**

**TERPRETABLE** **CLUSTERING** **AND** **SUPERVISED** **XAI**


Recent surveys in supervised XAI have proposed comprehensive taxonomies that categorize explanation techniques
according to their position in the learning pipeline, their



dependency on model internals, and the form or scope of
the explanations. Representative works include Adadi and
Berrada [24], Guidotti et al. [14], Gunning et al. [20], Burkart
and Huber [23], and Bodria et al. [13], along with more
recent efforts introducing refined evaluation frameworks
and new interpretability paradigms [27], [28], [29], [30].
These studies have largely focused on predictive models,
where the objective is to explain the mapping from input
features to labeled outcomes. However, in unsupervised
settings, no ground-truth labels exist, and the interpretive
goal shifts from explaining predictions to elucidating the
formation and meaning of discovered clusters. To highlight
this conceptual distinction, we establish a correspondence
between supervised XAI and interpretable clustering, illustrating how interpretability principles can be reformulated
when supervision is absent.


The correspondence summarized in Table 1 demonstrates that the foundational taxonomies of supervised XAI,
originally developed for labeled prediction tasks, can be
extended to unsupervised learning through careful reinterpretation of objectives and evaluation principles. For example, the distinction between intrinsic and post-hoc explanations parallels the in- and post-clustering categorization
discussed in Section 3. Similarly, explanation forms such
as trees, rules, and prototypes have direct counterparts in
interpretable clustering, as illustrated in Fig. 2.


Despite these conceptual parallels, interpretable clustering faces unique challenges that are not directly addressed in supervised XAI. The absence of ground-truth
labels makes it difficult to validate explanations against
reference outputs, shifting the emphasis toward internal
consistency, statistical significance, and domain plausibility.
These characteristics underscore the need for specialized
evaluation metrics and flexible explanatory frameworks, in
which in-clustering and post-clustering methods are often
intertwined. Overall, this conceptual bridge illustrates how
established XAI principles can inform interpretable cluster

INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 6


TABLE 1
Conceptual correspondence between supervised explainable AI (XAI) and interpretable clustering.


**Taxonomy** **in** **Meaning** **in** **Correspondence** **in**
**supervised** **XAI** **supervised** **learning** **interpretable** **clustering**



**Learning** **objective** [14] Predict labeled outcomes with explainable reasoning faithful to both
labels and features.


**Intrinsic** **(ante-hoc)** **vs.** Intrinsic models are interpretable
**post-hoc** [23] by design (e.g., decision trees,
linear models), while post-hoc
methods generate explanations for
already-trained black-box models.


**Model-specific** **vs.** Model-specific explanations de**model-agnostic** [24] pend on the internal mechanisms or
parameters of a particular model,
while model-agnostic approaches
can be applied to any model by analyzing its input-output behavior.


**Global** **vs.** Global explanations describe the
**local** **explanation** [13] overall decision logic of the model;
local explanations clarify individual predictions.


**Explanation** **form** [25] Typical forms include decision
trees, rules, prototypes, feature attributions, and counterfactuals.


**Evaluation** **criteria** [26] Faithfulness, fidelity, stability, simplicity, and completeness, focusing
on how well explanations align
with model behavior and human
reasoning.



Discover latent structures or groupings in unlabeled data while providing human-understandable rationales
for the resulting clusters.


In-clustering methods embed interpretability directly into the clustering process, whereas post-clustering
methods derive explanations for precomputed cluster partitions.


All in-clustering methods are modelspecific, as their interpretability stems
from the internal structure of the
clustering model itself, whereas postclustering approaches can employ
model-agnostic surrogate explainers
to interpret black-box clustering outcomes.


Cluster-level explanations correspond
to global understanding of group-level
patterns, whereas instance-level explanations clarify why a specific sample
belongs to a cluster.


Analogous interpretable forms include decision trees, rules, prototypes, geometric boundaries, and datadependent descriptions.


Coverage and uniqueness of cluster explanations, rule or path simplicity, prototype sparsity, geometrically intuitive
cluster boundaries (e.g., axis-aligned or
visually interpretable regions).



ing while highlighting the new methodological opportunities emerging in unsupervised interpretability research.


**5** **INTERPRETABLE** **PRE-CLUSTERING** **METHODS**


While most research on interpretable clustering focuses
on generating transparent clustering outcomes, the interpretability of input features also plays a crucial role in
ensuring understandable and trustworthy results. Existing
interpretable pre-clustering methods aim to enhance feature
interpretability at the data preparation stage and can be
broadly categorized into two complementary perspectives:
(1) _interpretable_ _feature_ _extraction_, which derives humanunderstandable representations from complex data, and (2)
_interpretable_ _feature_ _selection_, which identifies compact and
semantically meaningful subsets of features. Although both
topics have been widely studied in the field of machine
learning, they have rarely been systematically investigated
in connection with subsequent clustering tasks.
From the perspective of feature extraction, studies have
sought to obtain informative and human-understandable
representations from complex data before clustering. Bonifati et al. [31] proposed _Time2Feat_ to extract intra- and intersignal features from multivariate time series using interpretable metrics and dimension reduction via Principal Fea


ture Analysis or user annotation. Salles et al. [32] employed
adaptive gating with Gumbel-SoftMax sampling to identify
instance-relevant features that guide clustering, while Kang
et al. [33] introduced an interpretable hyperspectral bandselection algorithm based on Gestalt principles, aligning
extracted representations with human visual perception to
enhance the transparency of clustering outcomes.
From the perspective of feature selection, methods focus
on identifying compact and discriminative feature subsets
that preserve clustering accuracy while improving interpretability. Svirsky et al. [34] trained self-supervised local gates to produce instance-specific sparse feature sets,
revealing which attributes drive each cluster assignment.
Effenberger et al. [35] applied a greedy feature selection
strategy based on occurrence frequency and Jaccard similarity, generating concise and meaningful feature subsets that
clarify the logic behind cluster formation.


**6** **INTERPRETABLE** **IN-CLUSTERING** **METHODS**


Interpretable in-clustering methods constitute the core of interpretable clustering research, as they embed interpretability directly within the clustering process rather than applying it before or after clustering. In such methods, interpretability is treated as an explicit optimization objec

INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 7



tive jointly considered with traditional clustering criteria
such as the within-cluster sum of squared errors (SSE).
Some approaches formulate it as a multi-objective optimization [36], while others impose it as a structural regularization term [37].


_**Clarifying**_ _**methodological**_ _**distinctions.**_ In-clustering
methods are sometimes confused with pre- or postclustering approaches because of when interpretability is
introduced. Two criteria help clarify their methodological
scope:


_•_ _Dependence_ _on_ _third-party_ _algorithms._ This distinguishes in-clustering methods from post-clustering
ones. In-clustering integrates interpretability within
the clustering objective, either by inducing clusters
through interpretable models (e.g., tree-based clustering) or by jointly optimizing interpretability with
standard costs, without relying on externally generated cluster labels [38]. In contrast, post-clustering
methods explain reference partitions obtained from
black-box algorithms. For example, both [39] and [37]
optimize tree-based interpretability, yet the former
fits a tree to fixed clustering results (post-clustering),
whereas the latter jointly optimizes clustering and interpretability (in-clustering). Thus, in-clustering emphasizes exploratory clustering guided by interpretability, producing clusters directly through transparent models [21].

_•_ _Interpretability_ _during_ _the_ _clustering_ _process._ This criterion distinguishes in-clustering from pre-clustering
methods. Pre-clustering enhances feature interpretability before clustering, whereas in-clustering
jointly learns interpretable features and cluster
structures. For tabular data [40], interpretability is
straightforward through thresholds or categorical
inclusion. For more complex data such as networks [41], [42], images, and sequences, features
lack clear semantics; thus, in-clustering methods aim
to discover clusters and meaningful representations
simultaneously. In networks, concise node descriptors are extracted for interpretable community detection [43]; in images, semantic tags are identified via
descriptive clustering [44]; and deep models improve
interpretability through latent representation learning [45], [46]. For sequential data, vectorization often obscures meaning, motivating discriminative sequential pattern mining [47]. Some models integrate
feature interpretability directly into clustering objectives: Kim et al. [48] group binary dimensions into
logic-based interpretable sets, while Huang et al. [49]
jointly optimize feature selection and clustering via a
deep _K_ -parallel auto-reconstructive framework with
graph Laplacian regularization.


After clarifying these distinctions, the following subsections review representative in-clustering approaches, focusing on how interpretability objectives are embedded
within clustering algorithms and realized through various
interpretable models.



**6.1** **Decision tree-based methods**


The decision tree model is widely recognized as an interpretable model in machine learning [50] and is commonly
used for classification and regression tasks. Its interpretability stems from the recursive, hierarchical splitting of data
based on feature values to generate intermediate results,
and the final output is traceable through the feature values
used in the splits. Instances are distributed to different
leaf nodes (clusters) determined by specific splitting points
according to certain criteria, following a clear, transparent
path from the root node (representing the whole dataset)
down through the branch nodes, which is easily understood
by end users.
Early attempts to apply decision trees to clustering can
be found in [51], where uniformly distributed synthetic
data were introduced as auxiliary data to build a standard (supervised) decision tree. This approach aimed to
maximize the separation between the original data and the
synthetic data by modifying the standard splitting criterion,
such as information gain. Although this method used binary splits, which are relatively easy to understand, the
reliance on data generation introduced additional assumptions, making it difficult to claim that the splits were truly
interpretable. In contrast, [52] developed an unsupervised
decision tree directly based on the original features. The
authors proposed four different measures for selecting the
most appropriate feature and two algorithms for splitting
data at each branch node. However, to select a candidate
splitting point for calculating these measures, preliminary
steps were required to divide the numerical feature domain
into intervals [53], [54]. A simpler splitting criterion and a
more intuitive algorithmic framework is presented in [55]
with the introduction of CUBT, which was further extended
to categorical data in [56]. CUBT adopts a general approach
similar to CART [57], involving three steps: maximal tree
construction, followed by pruning and merging to simplify
the tree structure. This unsupervised decision tree-based
clustering model was also extended to the interpretable
fuzzy clustering domain in [58], where fuzzy splitting at
branch nodes was used to grow the initial tree, followed
by merging similar clusters to create a more compact tree
structure.
The aforementioned unsupervised decision tree-based
models adopt a top-down approach [59], [60], where all
possible candidate splitting points are considered at the
current branch node level, and criteria such as heterogeneity
are calculated so that the tree grows greedily (greedy search)
based on the optimal splits passed down from the parent
node. However, this type of algorithm lacks global guidance, meaning that each split is optimized locally rather than
achieving a globally optimized solution across the entire
dataset.
Some advanced interpretable in-clustering methods that
use decision trees leverage modern optimization techniques.
These modern optimization techniques include, but are
not limited to, Mixed-Integer linear Optimization (MIO)
techniques [61] used in [62], Tree Alternating Optimization (TAO) techniques [63] used in [38], and monotonic
optimization techniques such as the Branch-Reduce-andBound (BRB) algorithm [64] used in [37]. These methods


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 8



are designed to construct globally optimal clustering trees
by explicitly optimizing a well-defined objective function
applied to the entire dataset. Unlike traditional top-down
approaches, these methods directly establish a relationship
between the instances assigned to different leaf nodes (clusters) and the interpretability objective, which is explicitly
encoded in the objective function. These methods express
interpretability in a more quantitative and formalized manner, often by specifying tree structural metrics [22] (e.g.,
the number of leaf nodes), where a smaller number of leaf
nodes (nLeaf), as used in [37], [38], typically indicates lower
tree complexity and, correspondingly, better interpretability. Building on this global optimization framework, some
interpretable fuzzy clustering algorithms are presented as
well. For example, [65] employs kernel density decision
trees (KDDTs) for constructing fuzzy decision trees using
an alternating optimization strategy, while [66] incorporates
a soft (probabilistic) version of the split in their objective
function and obtains the optimal split via a Constrained
Continuous Optimization Model.


**6.2** **Rule-based methods**


The process of mining an optimal rule set to derive a specific
cluster is often inspired by the field of pattern mining [67].
To ensure that different rule sets effectively correspond to
their respective clusters, the rule set typically exhibits two
key characteristics [68]: (1) frequency (meaningful), indicating that the rule set should cover as many samples within
its corresponding cluster (true positives) as possible, and
(2) discriminative power (unique), meaning that the rule set
should minimize the number of samples mistakenly covered
by other clusters (false positives).
To obtain a rule set for the purpose of interpretable clustering, a common approach is to start by quantifying interpretability based on how well a rule covers a specific cluster.
For example, as demonstrated in [69], an interpretability
score is defined to assess a feature value’s relevance to a
cluster by considering the fraction of samples within the
cluster that share that feature value. Given all candidate
rules or rule sets (e.g., generated using frequent pattern
mining), these methods aim to derive clusters that maximize
the interpretability score while simultaneously optimizing
cluster quality. Since interpretability objectives often conflict
with cluster quality, existing methods typically incorporate
the interpretability score as a user-specified bound to balance interpretability and cluster quality, alongside standard
clustering objectives. The method in [36] introduces two
explainability criteria for each rule set associated with a
cluster: one similar to [69], and another that considers the
distinctiveness of the rule set, meaning how few samples it
covers outside the associated cluster. Optimizing these two
explainability objectives, together with cluster quality measures, is formulated into a multi-objective Mixed-Integer
linear Optimization problem (multi-MIO). Furthermore, the
method in [36] considers the maximum rule set length
(lenRule), i.e., the number of feature values in the combination, as a constraint, ensuring that the created clusters
are more interpretable by being represented through concise
rules.
Other interpretable rule-based methods may be customized, where the meaning of the rules is no longer



based solely on feature values. For instance, in document
datasets [70], the rules may take different forms. Methods
such as those in the field of fuzzy rule-based clustering [71],
have been summarized in the survey [19].


**6.3** **Other methods**


In addition to the two widely used interpretable models
mentioned above, other interpretable in-clustering methods
create clusters or determine cluster membership based on
representative elements [72], [73], which can generally be
categorized as boundary-based or centroid-like approaches.
However, for these representative elements to be interpretable, certain properties need to be maintained. The
following is a brief overview of these approaches.
_Convex-polyhedral_ : These methods constrain the cluster
boundaries to be axis-parallel (rectangular) in the feature
space, as in the method proposed in [74], which designs
a Probabilistic Discriminative Model (PDM) to define such
clusters. More generally, they may use hyperplanes that
allow for diagonal boundaries [75] to more accurately represent a cluster.
In either case, the goal is to create clusters with fewer
feature values, incorporating these as interpretability constraints within the standard clustering objective function.
For instance, [75] uses a Mixed-Integer nonlinear Optimization (nonlinear-MIO) programming formulation to jointly
identify clusters and define polytopes. For axis-parallel
boundaries, a single feature value is used per dimension,
while diagonal boundaries rely on linear combinations of
feature values. Although diagonal boundaries have greater
power to distinguish different clusters, they are less interpretable due to their increased complexity compared to
simpler axis-parallel boundaries.
_Prototype_ _(exemplar)_ : In datasets where the original features are non-interpretable and difficult to understand, such
as with images [76] and text, especially when deep embeddings are used, recent work on interpretable in-clustering
via exemplars has found that seeking high-level centroids
can be useful for characterizing clusters and facilitating
visualization. For example, [77] tackles the challenging
problem of finding the minimum number of exemplars
(nExemplar) without prior specification. Additionally, [46]
proposes a new end-to-end framework designed to enhance
scalability for larger datasets, making exemplar-based clustering more practical for real-world applications.


**6.4** **Summary**


Various interpretable models have been developed for inclustering methods, as summarized in Table 2. Currently,
most existing approaches in the literature either build upon
these representative methods or follow similar principles
that can be subsumed under them. These models consistently treat interpretability as a first-class objective, on par
with clustering quality, incorporating it as an optimization
target either directly or indirectly, depending on the model
type. For instance, tree-based models often prioritize reducing the number of branch or leaf nodes, rule-based models
focus on shorter rules, and geometric representation models, such as prototype-based models, aim to minimize the
number of exemplars. More refined structural parameters as


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 9


TABLE 2
Summary of various interpretable in-clustering methods, each listing the representative reference and corresponding criteria.


**Interpretable** **Representative** **Optimization** **Interpretability-related** **Axis-parallel**
**model** **reference** **approach** **structural** **metrics** **partitioning**



Decision Tree




[55] greedy search / Yes

[62] MIO / Yes

[37] BRB nLeaf Yes

[38] TAO nLeaf No




[69] greedy search / Yes
Rules

[36] multi-MIO lenRule Yes


[74] PDM / Yes
Convex-polyhedral

[75] nonlinear-MIO / No


[46] stochastic gradient / No
Prototype

[77] greedy search nExemplar No



optimization targets require further research. For example,
in literature [39], tree depth is considered an optimization
target; however, this approach, designed to explain a given
reference clustering result, belongs to post-clustering methods.
There is often a trade-off between interpretability and
clustering quality, where enhancing one may diminish the
other. This frequently addressed challenge could be less
daunting in post-clustering methods, which only need to
focus on one direction, specifically fitting given clustering
results. In contrast, in-clustering methods must account
for the simultaneous pursuit of both objectives. A critical
research direction for in-clustering methods is to balance
these objectives while ensuring scalability for real-world
data. As shown in Figure. 2, several interpretable models
cannot perfectly predict all samples with respect to their
clusters. While standard decision tree models generate partitions aligned with coordinate axes, more flexible oblique
decision trees [38] can improve clustering performance.
Similarly, convex-polyhedral approaches can benefit from
allowing diagonal boundaries [75], not limited to axisparallel rectangles, provided they remain convex. Further
research is needed to design new interpretable models that
can effectively handle complex data.


**7** **INTERPRETABLE** **POST-CLUSTERING** **METHODS**


Post-modeling interpretability is a crucial aspect of interpretable learning, focusing on elucidating the reasoning
behind decisions made by black-box models. In the context
of clustering, interpretable post-clustering refers to the use
of interpretable models, such as decision trees, to closely
approximate existing clustering results (also known as reference clustering results). This means that the labels assigned to samples by the interpretable model should align
as closely as possible with the original results. This kind
of method aids in understanding why certain samples are
assigned to specific clusters, thereby fostering trust in blackbox models. In the following subsections, we will categorize
existing interpretable post-clustering methods based on different interpretable models.


**7.1** **Decision tree-based methods**


Decision trees are the most widely used interpretable models for post-clustering analysis. In a decision tree, each



internal node splits the samples it contains into different
groups based on predefined criteria. The _k_ leaf nodes (not
necessarily the ground-truth cluster number) correspond to
the _k_ clusters in the reference clustering results. Each cluster
assignment can be interpreted by the path leading to its
respective leaf node.


In decsion tree-based post-clustering methods, the closer
the clustering results obtained by the constructed decision
tree are to the reference clustering results, the better its
interpretability performance. This metric is often defined
in existing research as “the price of interpretability” [78],
which is the ratio of the cost of the explainable clustering to
the cost of an optimal clustering (e.g., _k_ -means/medians).
Therefore, the goal is typically to build a decision tree _T_
such that _cost_ ( _T_ ) is not too large compared to the optimal
_k_ -means/medians cost. Specifically, an algorithm is said to
have an _x_ -approximation guarantee if the cost of the tree is
at most _x_ times the optimal cost, i.e., if the algorithm returns
a threshold tree _T_, then we have _cost_ ( _T_ ) _< x · cost_ ( _opt_ ).


Research on the quality of decison tree constructed by interpretable post-clustering methods began with the work of
Moshkovitz et al. [78]. They develop decision trees using a
greedy approach that aims to minimize the number of errors
at each split (i.e., the number of points separated from their
corresponding reference cluster centers), stopping when the
tree reaches _k_ leaf nodes. This method achieves an _O_ ( _k_ )
approximation for the optimal _k_ -medians and an _O_ ( _k_ [2] )
approximation to the optimal _k_ -means. Laber et al. [79]
improve the approximation, achieving an _O_ ( _d_ log _k_ ) approximation for optimal _k_ -medians and an _O_ ( _kd_ log _k_ ) approximation for the optimal _k_ -means. They accomplish this by
firstly constructing _d_ decision trees, where _d_ is the number
of dimensions in the data, then utilize these trees to build the
final decision tree. The feature for splitting a node within the
final decision tree is chosen based on the dimension with the
maximum range among the centers contained in the current
node. The specific feature value is associated with the node
in the corresponding dimension’s decision tree, which is the
least common ancestor (LCA) of the set of reference centers
that reach the current node. Makarychev et al. [80] take a
different approach by choosing splitting features and values
that differentiate centers with greater distances within each
node in a relatively random manner. This results in an
_O_ (log _k_ log log _k_ ) approximation for the optimal _k_ -medians


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 10



and an _O_ ( _k_ log _k_ log log _k_ ) approximation for the optimal
_k_ -means, with log log _k_ denoting the iterated logarithm
log(log _k_ ). In the decision tree constructed in [81], the choice
of cuts at each split node is entirely random, as long as it
can separate different reference centers into different child
nodes. It has been proven that this method can achieve
an _O_ (log [2] _k_ ) approximation for the optimal _k_ -medians and
an _O_ ( _k_ log [2] _k_ ) approximation for the optimal _k_ -means. Recentlty, Esfandiari et al. [82] focus on determining the maximum and minimum values of the reference centers along
each dimension, sorting these values, and then sampling a
split point that effectively separates the reference centers.
Their method achieves an _O_ (log _k_ log log _k_ ) approximation
for the optimal _k_ -medians and an _O_ ( _k_ log _k_ ) approximation
for _k_ -means. Several methods have been proposed to independently provide near-optimal algorithms for _k_ -means or
_k_ -medians [83], [84], [85], which will not be elaborated upon
here.
Unlike focusing on improving a decision tree model’s
ability to provide an approximation guarantee for optimal
clustering results, Frost et al. [86] adopt the method from

[39] to build a tree with _k_ leaf nodes and then use a
new surrogate cost to greedily expand the tree to _k_ _[′]_ _>_ _k_
leaves, proving that as _k_ _[′]_ increases, the surrogate cost is
non-increasing. This approach reduces clustering cost while
providing a flexible trade-off between interpretability and
accuracy. Laber et al. [39] focus on building decision trees
that yield short explanations (i.e., trees with smaller depth)
for the clusters of the partition while still inducing good partitions in terms of the _k_ -means cost function. Additionally,
they propose two structural metrics for measuring interpretability: Weighted Average Depth (WAD), which weighs
the depth of each leaf by the number of samples in its
associated cluster, and Weighted Average Explanation Size
(WAES), a variation of WAD. Inspired by robustness studies,
Bandyapadhyay et al. [87] explore constructing a decision
tree by removing the fewest points necessary to match the
reference clustering results exactly, where interpretability is
measured by the number of points removed.


**7.2** **Rule-based methods**


Distinct from decision trees, interpretable post-clustering
models constructed using if-then rules do not involve hierarchical relationships. Their explanations for clusters are
relatively concise and intuitive, providing a set of rules to
describe the samples within a cluster. To our knowledge, despite the fact that if-then rules have become widely accepted
as interpretable models and have been studied considerably,
most rule-based interpretable clustering methods focus on
extracting rules from data to form clusters. Consequently,
there is limited research on post-clustering methods that
generate rules and provide explanations for clusters that
have already been formed.
Carrizosa et al. [36] explain clusters with the objective of
maximizing the total number of true positive cases (i.e., the
number of samples within the cluster that satisfy the explanation) and minimizing the total number of false positive
cases (i.e., the number of individuals outside the cluster that
satisfy the explanation). Additionally, the length of the rules
is constrained to ensure strong interpretability.



De Weerdt et al. [88] investigate the search for explanations for event logs by first generating feature sets from
the data and then applying a best-first search procedure
with pruning to construct the set of explanations. Through
an iterative process, they continuously enhance the accuracy and conciseness of the explanations for the instances.
Building on this work, Koninck et al. [89] mine concise
rules for each individual instance from a black-box support
vector machine (SVM) model and discuss and evaluate
different alternative feature sets that can be used as inputs
for explanatory techniques.
Ofek et al. [90] introduced Cluster-Explorer, a posthoc framework that explains black-box clustering pipelines
through compact rule sets. The method formulates explanation generation as a multi-objective optimization over coverage, separation error, and conciseness, which is efficiently
solved using a generalized frequent itemset mining (gFIM)based search. By representing predicates as items and applying Pareto pruning, the algorithm derives minimal-length
rule sets that maximize cluster coverage while minimizing
overlap across clusters.


**7.3** **Other methods**


Besides the aforementioned decision trees and if-then rules,
several other interpretable models have been used in literature to explain existing clustering results. Given their
limited number, we will not review each interpretable model
individually but rather provide an overall summary here.
_Prototype_ . Carrizosa et al. [91] proposed a method for
using prototypes to explain each cluster. A prototype is
an individual that serves as a representative example of
its cluster, defined by its minimal dissimilarity to other
individuals within the same cluster. In their approach, they
solve a bi-objective optimization problem to identify these
prototypes. This problem aims to maximize the number of
true positive cases within each cluster while minimizing the
number of false positive cases in other clusters.
_Convex_ _polyhedral_ . In [92], a polyhedron is constructed
around each cluster to serve as its explanation. Each polyhedron is formed by intersecting a limited number of halfspaces (nHalfspace). The authors formulate the polyhedral
description problem as an integer program, where variables correspond to candidate half-spaces for the polyhedral
description of the clusters. Additionally, they present a
column generation approach to efficiently search through
the candidate half-spaces. Chen et al. [93] propose using
a hypercube coverage model to explain clustering results.
This model incorporates two objective functions: the number of hypercubes (nHypercube) and the compactness of
instances. A heuristic search method (NSGA-II) is employed
to identify a set of non-dominated solutions, defining an
ideal point to determine the most suitable solution, whereby
each cluster is covered by as few hypercubes as possible.
_Description_ . Davidson et al. [94] introduce the cluster
description problem, where each data point is associated
with a set of descriptions from a discrete set. The objective is
to find a set of non-overlapping descriptions for each cluster
that covers every instance within the cluster. The proposed
method allows for the specification of the maximum number
of descriptions per cluster and the maximum number of
clusters that any two descriptions can jointly cover.


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 11


TABLE 3
Summary of various interpretable post-clustering methods, each listing the representative reference and corresponding criteria.


**Interpretable** **Representative** **Optimization** **Interpretability-related** **Axis-parallel**
**model** **reference** **approach** **structural** **metrics** **partitioning**


[78] greedy search / Yes
Decision Tree

[39] greedy search WAD Yes


[36] MIO lenRule Yes
Rules

[90] gFIM-based lenRule Yes


[92] column generation nHalfspace No
Convex-polyhedral

[93] heuristic search nHypercube Yes


Prototype [91] MIO / No



**7.4** **Summary**


Several representative interpretable post-clustering methods are summarized in Table 3. Additionally, the following observations can be noted: firstly, most post-clustering
research utilizes decision trees as interpretable models to
explain clustering results. However, explanations derived
from decision trees have certain drawbacks, such as the
dependency of deep-layer decisions on shallow-layer decisions. Additionally, it is possible to consider using a hyperplane in a chosen number of dimensions instead of splitting
along only one feature. Moreover, the choice of a suitable
interpretable model may vary depending on the type of
data; for instance, descriptions may be more appropriate for
community analysis. Therefore, the post-clustering methods
involving other interpretable models require further investigation.
Secondly, existing methods primarily focus on approximating the optimal clustering cost of reference clustering
results using decision tree-based approaches, or aiming
for interpretable models with high true positive rates and
low false positive rates [36], [91]. However, few methods
emphasize the simplicity of explanations (except for [36],

[39]), which includes but is not limited to the depth of
decision trees, the number of leaf nodes, and the length
and quantity of rules. Thus, the balance between the accuracy and simplicity of interpretable models, as well as the
quantification of interpretability metrics, remains an area for
further research.


**8** **FUTURE** **DIRECTIONS**


To provide valuable insights for the future direction of this
field, we have classified various interpretable clustering
methods based on different aspects and further summarized
key technical criteria for readers’ reference, such as: (1) Optimization approaches, which illustrate how authors from
various domains have formalized the interpretability challenges in clustering and the methods they have employed to
solve these optimization problems, and (2) Interpretabilityrelated structural metrics, which are crucial as they could
potentially be utilized to evaluate the interpretability quality
of novel methods, similar to how accuracy is used to assess
clustering quality. The literature still lacks attention to a
greater diversity of these structural metrics. We believe that
researchers studying these different interpretable clustering
methods can complement and enhance each other’s work.
Moreover, methods from different clustering stages could be



combined, as relying solely on a single-stage interpretable
clustering method may be insufficient for complex and
challenging application scenarios. This is particularly true
in cases where obvious interpretable features do not exist,
making it difficult to construct interpretable clustering algorithms. Additionally, research on interpretable clustering
methods for intricate data, such as categorical data [95],

[96], discrete sequences [47], [97], time series [98], [99],
network (graph) [100], [101], and multi-view and multimodal data [102], [103], remains limited.


**9** **CONCLUSION**


This survey provides a comprehensive and systematic perspective on various interpretable clustering methods, highlighting both foundational research and the latest advancements in the field. It is the first to address the topic across
the full lifecycle of clustering analysis, encompassing Preclustering, In-clustering, and Post-clustering stages. At each
stage, relevant literature on interpretable clustering methods
is reviewed. Primarily, this work aims to clearly define
what interpretability means in the context of clustering
and how it is embedded in commonly used interpretable
models, such as decision trees, rules, prototypes, and convex polyhedral models. These models create interpretable
clusters with elements that are understandable to human
users and potentially enable these clustering results to be applied in high-risk domains, meeting essential prerequisites
of transparency and trustworthiness. The effort to endow
various clustering paradigms with explainability is still in
its infancy [104], [105], [106], [107].


**ACKNOWLEDGMENTS**


This work has been supported by the National Natural
Science Foundation of China under Grant No. 62472064.


**REFERENCES**


[1] A. K. Jain, “Data clustering: 50 years beyond k-means,” _Pattern_
_Recognition Letters_, vol. 31, no. 8, pp. 651–666, 2010.

[2] A. Saxena, M. Prasad, A. Gupta, N. Bharill, O. P. Patel, A. Tiwari,
M. J. Er, W. Ding, and C.-T. Lin, “A review of clustering techniques and developments,” _Neurocomputing_, vol. 267, pp. 664–
681, 2017.

[3] D. Bertsimas, A. Orfanoudaki, and H. Wiberg, “Interpretable
clustering via optimal trees,” _arXiv_ _preprint_ _arXiv:1812.00539_,
2018.

[4] C. Molnar, _Interpretable_ _machine_ _learning_, 3rd ed., 2025. [Online].
[Available: https://christophm.github.io/interpretable-ml-book](https://christophm.github.io/interpretable-ml-book)


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 12




[5] M. Atzmueller, J. F¨urnkranz, T. Kliegr, and U. Schmid, “Explainable and interpretable machine learning and data mining,” _Data_
_Mining_ _and_ _Knowledge_ _Discovery_, vol. 38, no. 5, pp. 2571–2595,
2024.

[6] W. J. Murdoch, C. Singh, K. Kumbier, R. Abbasi-Asl, and B. Yu,
“Definitions, methods, and applications in interpretable machine
learning,” _Proceedings of the National Academy of Sciences_, vol. 116,
no. 44, pp. 22 071–22 080, 2019.

[7] G. I. Allen, L. Gan, and L. Zheng, “Interpretable machine learning
for discovery: Statistical challenges and opportunities,” _Annual_
_Review of Statistics and Its Application_, vol. 11, 2023.

[8] S. Krishna, T. Han, A. Gu, S. Wu, S. Jabbari, and H. Lakkaraju,
“The disagreement problem in explainable machine learning:
a practitioner’s perspective,” _Transactions_ _on_ _Machine_ _Learning_
_Research_, 2024.

[9] F. Doshi-Velez and B. Kim, “Towards a rigorous science of interpretable machine learning,” _arXiv preprint arXiv:1702.08608_, 2017.

[10] T. Miller, “Explanation in artificial intelligence: Insights from the
social sciences,” _Artificial Intelligence_, vol. 267, pp. 1–38, 2019.

[11] N. Ullah, J. A. Khan, I. De Falco, and G. Sannino, “Explainable
artificial intelligence: importance, use domains, stages, output
shapes, and challenges,” _ACM_ _Computing_ _Surveys_, vol. 57, no. 4,
2024.

[12] S. Ali, T. Abuhmed, S. El-Sappagh, K. Muhammad, J. M. AlonsoMoral, R. Confalonieri, R. Guidotti, J. Del Ser, N. D´ıaz-Rodr´ıguez,
and F. Herrera, “Explainable artificial intelligence (xai): What we
know and what is left to attain trustworthy artificial intelligence,”
_Information fusion_, vol. 99, p. 101805, 2023.

[13] F. Bodria, F. Giannotti, R. Guidotti, F. Naretto, D. Pedreschi, and
S. Rinzivillo, “Benchmarking and survey of explanation methods
for black box models,” _Data_ _Mining_ _and_ _Knowledge_ _Discovery_,
vol. 37, no. 5, pp. 1719–1778, 2023.

[14] R. Guidotti, A. Monreale, S. Ruggieri, F. Turini, F. Giannotti, and
D. Pedreschi, “A survey of methods for explaining black box
models,” _ACM Computing Surveys_, vol. 51, no. 5, 2018.

[15] B. Xu and G. Yang, “Interpretability research of deep learning: A
literature survey,” _Information Fusion_, vol. 115, p. 102721, 2025.

[16] C. Glanois, P. Weng, M. Zimmer, D. Li, T. Yang, J. Hao, and
W. Liu, “A survey on interpretable reinforcement learning,”
_Machine Learning_, vol. 113, no. 8, pp. 5847–5890, 2024.

[17] G. Ciatto, F. Sabbatini, A. Agiollo, M. Magnini, and A. Omicini,
“Symbolic knowledge extraction and injection with sub-symbolic
predictors: A systematic literature review,” _ACM Computing Sur-_
_veys_, vol. 56, no. 6, 2024.

[18] Z. Li, Y. Zhu, and M. Van Leeuwen, “A survey on explainable
anomaly detection,” _ACM_ _Transactions_ _on_ _Knowledge_ _Discovery_
_from Data_, vol. 18, no. 1, pp. 1–54, 2023.

[19] H. Yang, L. Jiao, and Q. Pan, “A survey on interpretable clustering,” in _2021_ _40th_ _Chinese_ _Control_ _Conference_ . IEEE, 2021, pp.
7384–7388.

[20] D. Gunning, M. Stefik, J. Choi, T. Miller, S. Stumpf, and G.-Z.
Yang, “Xai—explainable artificial intelligence,” _Science_ _Robotics_,
vol. 4, no. 37, p. eaay7120, 2019.

[21] C. Rudin, “Stop explaining black box machine learning models
for high stakes decisions and use interpretable models instead,”
_Nature Machine Intelligence_, vol. 1, no. 5, pp. 206–215, 2019.

[22] R. Piltaver, M. Luˇstrek, M. Gams, and S. Martinˇci´c-Ipˇsi´c, “What
makes classification trees comprehensible?” _Expert_ _Systems_ _with_
_Applications_, vol. 62, pp. 333–346, 2016.

[23] N. Burkart and M. F. Huber, “A survey on the explainability
of supervised machine learning,” _Journal_ _of_ _Artificial_ _Intelligence_
_Research_, vol. 70, pp. 245–317, 2021.

[24] A. Adadi and M. Berrada, “Peeking inside the black-box: a survey
on explainable artificial intelligence (xai),” _IEEE Access_, vol. 6, pp.
52 138–52 160, 2018.

[25] L. Longo, M. Brcic, F. Cabitza, J. Choi, R. Confalonieri, J. Del Ser,
R. Guidotti, Y. Hayashi, F. Herrera, A. Holzinger _et_ _al._, “Explainable artificial intelligence (xai) 2.0: A manifesto of open
challenges and interdisciplinary research directions,” _Information_
_Fusion_, vol. 106, p. 102301, 2024.

[26] M. Pawlicki, A. Pawlicka, F. Uccello, S. Szelest, S. D’Antonio,
R. Kozik, and M. Chora´s, “Evaluating the necessity of the multiple metrics for assessing explainable ai: A critical examination,”
_Neurocomputing_, vol. 602, p. 128282, 2024.

[27] B. Chander, C. John, L. Warrier, and K. Gopalakrishnan, “Toward
trustworthy artificial intelligence (tai) in the context of explain


ability and robustness,” _ACM_ _Computing_ _Surveys_, vol. 57, no. 6,
pp. 1–49, 2025.

[28] C. Moreira, Y.-L. Chou, C. Hsieh, C. Ouyang, J. Pereira, and
J. Jorge, “Benchmarking instance-centric counterfactual algorithms for xai: from white box to black box,” _ACM_ _Computing_
_Surveys_, vol. 57, no. 6, pp. 1–37, 2025.

[29] M. I. Hossain, G. Zamzmi, P. R. Mouton, M. S. Salekin, Y. Sun,
and D. Goldgof, “Explainable ai for medical data: Current methods, limitations, and future directions,” _ACM Computing Surveys_,
vol. 57, no. 6, pp. 1–46, 2025.

[30] A. Bilal, D. Ebert, and B. Lin, “Llms for explainable ai: A comprehensive survey,” _arXiv preprint arXiv:2504.00125_, 2025.

[31] A. Bonifati, F. Del Buono, F. Guerra, and D. Tiano, “Time2feat:
Learning interpretable representations for multivariate time series clustering,” in _Proceedings_ _of_ _the_ _VLDB_ _Endowment_, vol. 16,
no. 2, 2022, pp. 193–201.

[32] I. Salles, P. Mejia, V. Swamy, J. Blackwell, and T. K¨aser, “Interpret3c: Interpretable student clustering through individualized
feature selection,” in _Proceedings of the 25th Conference on Artificial_
_Intelligence in Education_, 2024.

[33] Y. Kang, P. Ye, Y. Bai, and S. Qiu, “Hyperspectral image based
interpretable feature clustering algorithm,” _Computers,_ _Materials_
_& Continua_, vol. 79, no. 2, 2024.

[34] J. Svirsky and O. Lindenbaum, “Interpretable deep clustering
for tabular data,” in _Forty-first International Conference on Machine_
_Learning_ . PMLR, 2024.

[35] T. Effenberger and R. Pel´anek, “Interpretable clustering of students’ solutions in introductory programming,” in _Proceedings_ _of_
_the_ _International_ _Conference_ _on_ _Artificial_ _Intelligence_ _in_ _Education_ .
Springer, 2021, pp. 101–112.

[36] E. Carrizosa, K. Kurishchenko, A. Mar´ın, and D. Romero Morales,
“On clustering and interpreting with rules by means of mathematical optimization,” _Computers_ _&_ _Operations_ _Research_, vol. 154,
p. 106180, 2023.

[37] H. Hwang and S. E. Whang, “Xclusters: explainability-first clustering,” in _Proceedings_ _of_ _the_ _Thirty-Seventh_ _AAAI_ _Conference_ _on_
_Artificial Intelligence_, 2023.

[38] M. Gabidolla and M. ´A. Carreira-Perpi˜n´an, “Optimal interpretable clustering using oblique decision trees,” in _Proceedings_
_of_ _the_ _28th_ _ACM_ _SIGKDD_ _Conference_ _on_ _Knowledge_ _Discovery_ _and_
_Data Mining_, 2022, pp. 400–410.

[39] E. Laber, L. Murtinho, and F. Oliveira, “Shallow decision trees for
explainable k-means clustering,” _Pattern_ _Recognition_, vol. 137, p.
109239, 2023.

[40] C. Plant and C. B¨ohm, “Inconco: interpretable clustering of
numerical and categorical objects,” in _Proceedings of the 17th ACM_
_SIGKDD_ _International_ _Conference_ _on_ _Knowledge_ _Discovery_ _and_ _Data_
_Mining_, 2011, pp. 1127–1135.

[41] S. Pool, F. Bonchi, and M. v. Leeuwen, “Description-driven community detection,” _ACM_ _Transactions_ _on_ _Intelligent_ _Systems_ _and_
_Technology_, vol. 5, no. 2, pp. 1–28, 2014.

[42] S. Sadler, D. Greene, and D. Archambault, “Towards explainable
community finding,” _Applied_ _Network_ _Science_, vol. 7, no. 1, p. 81,
2022.

[43] M. Atzmueller, S. Doerfel, and F. Mitzlaff, “Description-oriented
community detection using exhaustive subgroup discovery,” _In-_
_formation Sciences_, vol. 329, pp. 965–984, 2016.

[44] T.-B.-H. Dao, C.-T. Kuo, S. Ravi, C. Vrain, and I. Davidson, “Descriptive clustering: Ilp and cp formulations with applications,”
in _Proceedings_ _of_ _the_ _27th_ _International_ _Joint_ _Conference_ _on_ _Artificial_
_Intelligence_, 2018, pp. 1263–1269.

[45] H. Zhang and I. Davidson, “Deep descriptive clustering,” in
_Proceedings of the Thirtieth International Joint Conference on Artificial_
_Intelligence_, 8 2021, pp. 3342–3348.

[46] Y. Pan, Y. Yao, and I. Tsang, “Pc-x: Profound clustering via slow
exemplars,” in _Conference_ _on_ _Parsimony_ _and_ _Learning_, 2024, pp.
1–19.

[47] J. Dong, X. Yang, M. Jiang, L. Hu, and Z. He, “Interpretable
sequence clustering,” _Information_ _Sciences_, vol. 689, p. 121453,
2025.

[48] B. Kim, J. A. Shah, and F. Doshi-Velez, “Mind the gap: A generative approach to interpretable feature selection and extraction,”
in _Advances in Neural Information Processing Systems_, vol. 28, 2015.

[49] H. Huang, F. Xue, W. Yan, T. Wang, S. Yoo, and C. Xu, “Learning
associations between features and clusters: an interpretable deep
clustering method,” in _Proceedings_ _of_ _the_ _2021_ _International_ _Joint_
_Conference on Neural Networks_ . IEEE, 2021, pp. 1–10.


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 13




[50] S. M. Lundberg, G. Erion, H. Chen, A. DeGrave, J. M. Prutkin,
B. Nair, R. Katz, J. Himmelfarb, N. Bansal, and S.-I. Lee, “From
local explanations to global understanding with explainable ai for
trees,” _Nature Machine Intelligence_, vol. 2, no. 1, pp. 56–67, 2020.

[51] B. Liu, Y. Xia, and P. S. Yu, “Clustering through decision tree
construction,” in _Proceedings_ _of_ _the_ _Ninth_ _International_ _Conference_
_on Information and Knowledge Management_, 2000, pp. 20–29.

[52] J. Basak and R. Krishnapuram, “Interpretable hierarchical clustering by constructing an unsupervised decision tree,” _IEEE_
_Transactions on Knowledge and Data Engineering_, vol. 17, no. 1, pp.
121–132, 2005.

[53] Y.-L. Chen, W.-H. Hsu, and Y.-H. Lee, “Tasc: Two-attribute-set
clustering through decision tree construction,” _European_ _Journal_
_Of Operational Research_, vol. 174, no. 2, pp. 930–944, 2006.

[54] A. E. Gutierrez-Rodr´ıguez, J. F. Martinez-Trinidad, M. Garc´ıaBorroto, and J. A. Carrasco-Ochoa, “Mining patterns for clustering on numerical datasets using unsupervised decision trees,”
_Knowledge-Based Systems_, vol. 82, pp. 70–79, 2015.

[55] R. Fraiman, B. Ghattas, and M. Svarc, “Interpretable clustering
using unsupervised binary trees,” _Advances_ _in_ _Data_ _Analysis_ _and_
_Classification_, vol. 7, pp. 125–145, 2013.

[56] B. Ghattas, P. Michel, and L. Boyer, “Clustering nominal data
using unsupervised binary decision trees: Comparisons with the
state of the art methods,” _Pattern Recognition_, vol. 67, pp. 177–185,
2017.

[57] M. Krzywinski and N. Altman, “Classification and regression
trees,” _Nature Methods_, vol. 14, no. 8, pp. 757–758, 2017.

[58] L. Jiao, H. Yang, Z.-g. Liu, and Q. Pan, “Interpretable fuzzy
clustering using unsupervised fuzzy decision trees,” _Information_
_Sciences_, vol. 611, pp. 540–563, 2022.

[59] H. Blockeel, L. D. Raedt, and J. Ramon, “Top-down induction
of clustering trees,” in _Proceedings_ _of_ _the_ _Fifteenth_ _International_
_Conference on Machine Learning_, 1998, p. 55–63.

[60] R. Guidotti, C. Landi, A. Beretta, D. Fadda, and M. Nanni, “Interpretable data partitioning through tree-based clustering methods,” in _International_ _Conference_ _on_ _Discovery_ _Science_ . Springer,
2023, pp. 492–507.

[61] D. Bertsimas and J. Dunn, “Optimal classification trees,” _Machine_
_Learning_, vol. 106, pp. 1039–1082, 2017.

[62] D. Bertsimas, A. Orfanoudaki, and H. Wiberg, “Interpretable
clustering: an optimization approach,” _Machine Learning_, vol. 110,
no. 1, pp. 89–138, 2021.

[63] M. A. Carreira-Perpinan and P. Tavallali, “Alternating optimization of decision trees, with application to learning sparse
oblique trees,” in _Advances_ _in_ _Neural_ _Information_ _Processing_ _Sys-_
_tems_, vol. 31, 2018.

[64] C. Hellings, M. Joham, M. Riemensberger, and W. Utschick,
“Minimal transmit power in parallel vector broadcast channels
with linear precoding,” _IEEE_ _Transactions_ _on_ _Signal_ _Processing_,
vol. 60, no. 4, pp. 1890–1898, 2012.

[65] J. Good, T. Kovach, K. Miller, and A. Dubrawski, “Feature learning for interpretable, performant decision trees,” in _Advances_ _in_
_Neural_ _Information_ _Processing_ _Systems_, vol. 36, 2023, pp. 66 571–
66 582.

[66] E. Cohen, “Interpretable clustering via soft clustering trees,” in
_International_ _Conference_ _on_ _Integration_ _of_ _Constraint_ _Programming,_
_Artificial Intelligence, and Operations Research_, 2023, pp. 281–298.

[67] J. Han, M. Kamber, and J. Pei, “7 - advanced pattern mining,” in
_Data Mining_, third edition ed. Boston: Morgan Kaufmann, 2012,
pp. 279–325.

[68] M. Guilbert, C. Vrain, and T.-B.-H. Dao, “A constrained declarative based approach for explainable clustering,” in _International_
_Symposium_ _on_ _Intelligent_ _Data_ _Analysis_ . Springer, 2025, pp. 469–
483.

[69] S. Saisubramanian, S. Galhotra, and S. Zilberstein, “Balancing
the tradeoff between clustering value and interpretability,” in
_Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society_,
2020, pp. 351–357.

[70] V. Balachandran, D. P, and D. Khemani, “Interpretable and reconfigurable clustering of document datasets by deriving wordbased rules,” in _Proceedings_ _of_ _the_ _18th_ _ACM_ _Conference_ _on_ _Infor-_
_mation and Knowledge Management_, 2009, pp. 1773–1776.

[71] S. Gu, Y. Chou, J. Zhou, Z. Jiang, and M. Lu, “Takagi–sugeno–kang fuzzy clustering by direct fuzzy inference on
fuzzy rules,” _IEEE_ _Transactions_ _on_ _Emerging_ _Topics_ _in_ _Computa-_
_tional Intelligence_, vol. 8, no. 2, pp. 1264–1279, 2024.




[72] X. Chen and S. G¨uttel, “Fast and explainable clustering based on
sorting,” _Pattern Recognition_, vol. 150, p. 110298, 2024.

[73] F. Sabbatini and R. Calegari, “Explainable clustering with cream,”
in _Proceedings_ _of_ _the_ _20th_ _International_ _Conference_ _on_ _Principles_ _of_
_Knowledge Representation and Reasoning_, 8 2023, pp. 593–603.

[74] J. Chen, Y. Chang, B. Hobbs, P. Castaldi, M. Cho, E. Silverman,
and J. Dy, “Interpretable clustering via discriminative rectangle
mixture model,” in _2016 IEEE 16th International Conference on Data_
_Mining_, 2016, pp. 823–828.

[75] C. Lawless, J. Kalagnanam, L. M. Nguyen, D. Phan, and C. Reddy,
“Interpretable clustering via multi-polytope machines,” in _Pro-_
_ceedings_ _of_ _the_ _AAAI_ _Conference_ _on_ _Artificial_ _Intelligence_, vol. 36,
no. 7, 2022, pp. 7309–7316.

[76] G. Chen, X. Li, Y. Yang, and W. Wang, “Neural clustering based
visual representation learning,” in _Proceedings_ _of_ _the_ _IEEE/CVF_
_Conference_ _on_ _Computer_ _Vision_ _and_ _Pattern_ _Recognition_, 2024, pp.
5714–5725.

[77] I. Davidson, M. Livanos, A. Gourru, P. Walker, and J. V. S. Ravi,
“An exemplars-based approach for explainable clustering: complexity and efficient approximation algorithms,” in _Proceedings of_
_the_ _2024_ _SIAM_ _International_ _Conference_ _on_ _Data_ _Mining_ . SIAM,
2024, pp. 46–54.

[78] M. Moshkovitz, S. Dasgupta, C. Rashtchian, and N. Frost, “Explainable k-means and k-medians clustering,” in _Proceedings of the_
_37th International Conference on Machine Learning_, vol. 119. PMLR,
2020, pp. 7055–7065.

[79] E. S. Laber and L. Murtinho, “On the price of explainability for
some clustering problems,” in _Proceedings of the 38th International_
_Conference on Machine Learning_, vol. 139. PMLR, 2021, pp. 5915–
5925.

[80] K. Makarychev and L. Shan, “Near-optimal algorithms for explainable k-medians and k-means,” in _Proceedings_ _of_ _the_ _38th_
_International_ _Conference_ _on_ _Machine_ _Learning_, vol. 139. PMLR,
2021, pp. 7358–7367.

[81] B. Gamlath, X. Jia, A. Polak, and O. Svensson, “Nearly-tight
and oblivious algorithms for explainable clustering,” _Advances in_
_Neural_ _Information_ _Processing_ _Systems_, vol. 34, pp. 28 929–28 939,
2021.

[82] H. Esfandiari, V. Mirrokni, and S. Narayanan, “Almost tight approximation algorithms for explainable clustering,” in _Proceedings_
_of_ _the_ _2022_ _Annual_ _ACM-SIAM_ _Symposium_ _on_ _Discrete_ _Algorithms_ .
SIAM, 2022, pp. 2641–2663.

[83] M. Charikar and L. Hu, “Near-optimal explainable k-means for
all dimensions,” in _Proceedings_ _of_ _the_ _2022_ _Annual_ _ACM-SIAM_
_Symposium on Discrete Algorithms_ . SIAM, 2022, pp. 2580–2606.

[84] J. Byrka, T. Pensyl, B. Rybicki, A. Srinivasan, and K. Trinh,
“An improved approximation for k-median and positive correlation in budgeted optimization,” _ACM_ _Transactions_ _on_ _Algorithms_,
vol. 13, no. 2, pp. 1–31, 2017.

[85] K. Makarychev and L. Shan, “Random cuts are optimal for
explainable k-medians,” _Advances in Neural Information Processing_
_Systems_, vol. 36, 2024.

[86] N. Frost, M. Moshkovitz, and C. Rashtchian, “Exkmc: Expanding
explainable k-means clustering,” _arXiv_ _preprint_ _arXiv:2006.02399_,
2020.

[87] S. Bandyapadhyay, F. V. Fomin, P. A. Golovach, W. Lochet,
N. Purohit, and K. Simonov, “How to find a good explanation
for clustering?” _Artificial Intelligence_, vol. 322, p. 103948, 2023.

[88] J. De Weerdt and S. vanden Broucke, “Secpi: Searching for
explanations for clustered process instances,” in _Business_ _Process_
_Management:_ _12th_ _International_ _Conference_ . Springer, 2014, pp.
408–415.

[89] P. De Koninck, J. De Weerdt, and S. K. vanden Broucke, “Explaining clusterings of process instances,” _Data_ _Mining_ _and_ _Knowledge_
_Discovery_, vol. 31, no. 3, pp. 774–808, 2017.

[90] S. Ofek and A. Somech, “Explaining black-box clustering
pipelines with cluster-explorer,” _Proceedings_ _of_ _the_ _VLDB_ _Endow-_
_ment_, vol. 18, no. 5, p. 1495–1508, 2025.

[91] E. Carrizosa, K. Kurishchenko, A. Mar´ın, and D. R. Morales,
“Interpreting clusters via prototype optimization,” _Omega_, vol.
107, p. 102543, 2022.

[92] C. Lawless and O. Gunluk, “Cluster explanation via polyhedral
descriptions,” in _Proceedings of the 40th International Conference on_
_Machine Learning_, vol. 202. PMLR, 2023, pp. 18 652–18 666.

[93] L. Chen, C. Zhong, and Z. Zhang, “Explanation of clustering
result based on multi-objective optimization,” _Plos_ _One_, vol. 18,
no. 10, p. e0292960, 2023.


INTERPRETABLE CLUSTERING: A SURVEY (OCTOBER 2025) 14


[94] I. Davidson, A. Gourru, and S. Ravi, “The cluster description
problem-complexity results, formulations and approximations,”
_Advances in Neural Information Processing Systems_, vol. 31, 2018.

[95] L. Hu, M. Jiang, J. Dong, X. Liu, and Z. He, “Interpretable categorical data clustering via hypothesis testing,” _Pattern_ _Recognition_,
vol. 162, p. 111364, 2025.

[96] L. Hu, M. Jiang, X. Liu, and Z. He, “Significance-based decision
tree for interpretable categorical data clustering,” _Information_
_Sciences_, vol. 690, p. 121588, 2025.

[97] Z. He, L. Hu, J. He, J. Dong, M. Jiang, and X. Liu, “Significancebased interpretable sequence clustering,” _Information_ _Sciences_,
vol. 704, p. 121972, 2025.

[98] Z. Huang, H. Hao, and L. Du, “Exploring the explainability of
time series clustering: A review of methods and practices,” in
_Proceedings_ _of_ _the_ _Eighteenth_ _ACM_ _International_ _Conference_ _on_ _Web_
_Search and Data Mining_, 2025, pp. 1005–1007.

[99] U. Schlegel, G. M. Tavares, and T. Seidl, “Towards explainable deep clustering for time series data,” _arXiv_ _preprint_
_arXiv:2507.20840_, 2025.

[100] X. Sun, L. Hu, X. Liu, M. Jiang, Y. Liu, and Z. He, “Explainable
community detection,” _Chaos,_ _Solitons_ _&_ _Fractals_, vol. 194, p.
116198, 2025.

[101] H. Li, F. Lou, Q. Wang, and G. Li, “Interpretable graph clustering
on massive attribute networks via multi-agent dynamic game,”
_Chaos, Solitons & Fractals_, vol. 199, p. 116654, 2025.

[102] M. Jiang, L. Hu, Z. He, and Z. Chen, “Interpretable multi-view
clustering,” _Pattern Recognition_, vol. 162, p. 111418, 2025.

[103] J. Wang, T. Deng, and M. Yang, “Interpretable multi-view clustering via anchor graph-based tensor decomposition with convergence guarantees,” _Pattern Recognition_, p. 112124, 2025.

[104] H. Lv, L. Hu, M. Jiang, X. Liu, and Z. He, “Interpretable clustering
ensemble,” _arXiv preprint arXiv:2506.05877_, 2025.

[105] G. Miller, R. L. Gleut, D. Thalmeier, H. Pelin, M. Piraud _et_ _al._,
“Forest-guided clustering–shedding light into the random forest
black box,” _arXiv preprint arXiv:2507.19455_, 2025.

[106] V. F. L. de Souza, K. Bakhti, S. Ramdani, D. Mottet, and
A. Imoussaten, “Explainable evidential clustering,” _arXiv preprint_
_arXiv:2507.12192_, 2025.

[107] W. Li, Q. Zhang, and X. Wang, “Interpretable clustering with
adaptive heterogeneous causal structure learning in mixed observational data,” _arXiv preprint arXiv:2509.04415_, 2025.


