## **Effective Clustering for Large Multi-Relational Graphs**

Technical Report



Xiaoyang Lin

Hong Kong Baptist University

Hong Kong SAR, China

csxylin@comp.hkbu.edu.hk


**Abstract**



[Runhao Jiang](https://orcid.org/0009-0000-4841-9175)

Hong Kong Baptist University

Hong Kong SAR, China

csrhjiang@comp.hkbu.edu.hk


**Keywords**



[Renchi Yang](https://orcid.org/0000-0002-7284-3096) [∗]


Hong Kong Baptist University

Hong Kong SAR, China

renchi@hkbu.edu.hk



Multi-relational graphs (MRGs) are an expressive data structure

for modeling diverse interactions/relations among real objects (i.e.,

nodes), which pervade extensive applications and scenarios. Given

an MRG G with _𝑁_ nodes, partitioning the node set therein into

_𝐾_ disjoint clusters (referred to as MRGC) is a fundamental task

in analyzing MRGs, which has garnered considerable attention.

However, the majority of existing solutions towards MRGC either

yield severely compromised result quality by ineffective fusion of

heterogeneous graph structures and attributes, or struggle to cope

with sizable MRGs with millions of nodes and billions of edges due

to the adoption of sophisticated and costly deep learning models.

In this paper, we present DEMM and DEMM+, two effective MRGC

approaches to address the aforementioned limitations. Specifically,

our algorithms are built on novel two-stage optimization objec
tives, where the former seeks to derive high-caliber node feature

vectors by optimizing the _multi-relational Dirichlet energy_ specialized for MRGs, while the latter minimizes the _Dirichlet energy_ of
clustering results over the node affinity graph. In particular, DEMM+

achieves significantly higher scalability and efficiency over our

based method DEMM through a suite of well-thought-out optimiza
tions. Key technical contributions include (i) a highly efficient ap
proximation solver for constructing node feature vectors, and (ii) a

judicious and theoretically-grounded problem transformation to
gether with carefully-crafted techniques that enable the linear-time

clustering without explicitly materializing the _𝑁_ × _𝑁_ dense affinity
matrix. Further, we extend DEMM+ to handle attribute-less MRGs

through non-trivial adaptations. Extensive experiments, comparing

DEMM+ against 20 baselines over 11 real MRGs, exhibit that DEMM+

is consistently superior in terms of clustering quality measured

against ground-truth labels, while often being remarkably faster.


**CCS Concepts**


- **Computing** **methodologies** → **Cluster** **analysis** ; **Spectral**
**methods** ; • **Information systems** → **Clustering** .


∗Corresponding Author


Permission to make digital or hard copies of all or part of this work for personal or

classroom use is granted without fee provided that copies are not made or distributed

for profit or commercial advantage and that copies bear this notice and the full citation

on the first page. Copyrights for components of this work owned by others than ACM

must be honored. Abstracting with credit is permitted. To copy otherwise, or republish,

to post on servers or to redistribute to lists, requires prior specific permission and/or a

fee. Request permissions from permissions@acm.org.

_Conference’17, Washington, DC, USA_

© 2018 ACM.

ACM ISBN 978-1-4503-XXXX-X/18/06

[https://doi.org/XXXXXXX.XXXXXXX](https://doi.org/XXXXXXX.XXXXXXX)



multi-relational graphs, clustering, Dirichlet energy


**ACM Reference Format:**

Xiaoyang Lin, Runhao Jiang, and Renchi Yang. 2018. Effective Clustering

for Large Multi-Relational Graphs: Technical Report. In _._ ACM, New York,

[NY, USA, 23 pages. https://doi.org/XXXXXXX.XXXXXXX](https://doi.org/XXXXXXX.XXXXXXX)


**1** **Introduction**


_Multi-relational_ _graphs_ (MRGs) are data structures composed of

nodes interconnected via multiple types of relations, which ex
cel in modeling and capturing complex relations and associations

among real-world entities. Practical MRGs include social networks,

whose users are connected via friendships and varied interactive

activities, biological graphs where biological entities (proteins or

genes) are associated by interactions, regulatory relationships, or

metabolic pathways, as well as financial networks that encompass

diverse edges, such as transactions, ownerships, and contractual re
lationships. Due to the omnipresence of such multi-relational data

structures, MRGs find broad applications across various domains,

including recommendation systems [21, 43], biomedicine [44, 108],

financial risk control [84, 91], academic network mining [18, 105],

social network analysis [28, 52], etc.

As a fundamental analytical task, the goal of _multi-relational_
_graph clustering_ (MRGC) is to divide the MRG G into _𝐾_ disjoint

groups of nodes that are internally tightly-knit and similar, where

the number _𝐾_ of clusters is specified a priori. Two real-world appli
cation examples (depicted in Fig 1) of MRGC are as follows:

- **Detecting** **Social** **Communities:** On the video sharing web
site YouTube, as shown in Fig. 1, active users can connect via

contact, co-subscription, co-subscribed, sharing favorite videos,

and commenting, which form a multiple relational graph (MRG).

Through MRGC, we can extract high-quality communities of

users sharing similar interests by integrating such heterogeneous

interactions/relations [85], thereby facilitating video/YouTuber

recommendations and advertising.

- **Neuroscience:** In brain networks, there are structural (e.g., ax
onal pathways) and functional (e.g., correlations in activity) con
nections among brain regions (e.g., neurons or cortical areas).

The clustering over such multi-relational structures can help

identify functional modules and offer valuable insights into brain

structures and functions [2, 13].

Despite being superior in practical applications, compared to tradi
tional graph clustering, MRGC poses unique challenges in fusing

rich structures underlying heterogeneous relations, as well as ex
ploiting nodal attributes that are widely present in real MRGs.

A straightforward treatment for MRGC is to simply convert the

MRG G into a single-relational graph G through an equal weighting



1


**Tech** **Education**



**Contact**


**Co-subscription**


**Co-subscribed**


**Sharing favorite**

**videos**


**Commenting**



**Functional Modules**



**+**


**+**



**+**



**MVE**



**Music**
**Community**



**Food**
**Community**



**Figure 1: Real application examples of MRGC.**


of multiple-typed relations therein, followed by applying _attrib-_
_uted graph clustering_ techniques [58, 102] over G. This paradigm

overlooks the specific nuances and importance of different relation

types, engendering biased results and subpar clustering quality.

For instance, on social networks, treating relationships, including

friendships, family ties, and professional connections equally will

obscure the distinction between close family members and distant

acquaintances.

Over the past few years, there has been a surge of interest in

designing approaches specially catered for MRGC [29, 51, 63, 64]

(detailed in Section 6). The majority of them can be categorized

into two groups: _Multi-Relational Structure_ (MRS)-based and _Multi-_
_View Embedding_ (MVE)-based methods. Specifically, as depicted in

Figure 2, the MRS-based methodology [51, 53, 66] focuses on auto
matically adjusting weights for the integration of graph structures
{ _𝑨_ [(] _[𝑟]_ [)] } under heterogeneous relation types in MRGs, before incorporating node attributes _𝑿_ for subsequent clustering. However,

this category of methods primarily hinges on graph structures for

weight adjustment, which disregards or underexploits the attribute

information. Such an oversight results in inaccurate weights and

severe misalignment between graph structures and node attributes.

In contrast, the MVE-based models [54, 60, 65, 68, 70, 75, 76, 97] re
verse the above two steps (see Figure 2), where the former step turns
to encoding attributes _𝑿_ on each single-relational graph _𝑨_ [(] _[𝑟]_ [)] into
node feature vectors _𝑯_ [(] _[𝑟]_ [)] severally, whilst the latter step attends
to unifying these multi-typed feature vectors { _𝑯_ [(] _[𝑟]_ [)] } into the final
representations _𝑯_ for node clustering. Although this post-fusion

scheme enjoys better result effectiveness, it fails to adequately cap
ture the structural consistencies, disparities, and complementaries

of varied types of relations [118].

In summary, extant MRGC studies still have flaws in reconciling

multiplex relations and fusing information from heterogeneous

structures and attributes, and thus, incur sub-optimal performance.

On top of that, most solutions rely on sophisticated matrix solvers or

deep learning models that entail substantial memory and compute
intensive operations, which are rather expensive for even medium
sized MRGs.

To overcome the deficiencies of existing methods, we propose

DEMM and DEMM+ that achieve superb performance for MRGC over

multiple real MRG datasets, through the optimization of our novel

two-stage objective functions formulated based on the _Dirichlet_
_energy_ (DE) [116] in a principled way. As overviewed in Figure 2,
distinct from MRS- and MVE-based approaches, DEMM follows a two
stage pipeline, in which the first stage iteratively refines the node

feature vectors _𝑯_ by injecting information from node attributes
_𝑿_ and multiplex graph structures { _𝑨_ [(] _[𝑟]_ [)] }, while the second phase



**Figure 2: Workflows of existing MRGC methods and DEMM.**


constructs an affinity graph _𝑺_ from _𝑯_ and derives clusters therefrom. More concretely, in the first stage, the feature vectors _𝑯_ and
weights for integrating { _𝑨_ [(] _[𝑟]_ [)] } are alternatively updated towards
optimizing the notion of _multi-relational Dirichlet energy_ (MRDE)

and ancillary terms, which is a new extension of the DE to MRGs

dedicated to enforcing features of adjacent nodes of important rela
tion types to be close. In the same vein, DEMM obtains clusters by
minimizing their DE on _𝑺_ such that cluster assignments of nodes
with high affinity in _𝑺_ are similar. Unfortunately, DEMM suffers from a
quadratic complexity for the computation of _𝑯_ and materialization
of _𝑺_, rendering it incompetent for large MRGs.
To this end, we upgrade DEMM to a linear-time method DEMM+,

which obtains high efficiency without degrading result utility, via a

series of novel algorithmic designs, optimization tricks, and theoret
ical analyses. Under the hood, DEMM+ includes a carefully-designed
approximate solver FAAO for alternative updating of feature vectors
_𝑯_ and fusion weights, by uncovering computation bottlenecks and

capitalizing on their mathematical properties for fast estimation.

In addition, through theoretically-grounded problem transforma
tions along with our SSKC algorithm empowered by mathematical
apparatus _random Fourier features_ [72] and _Sinkhorn-Knopp nor-_
_malization_ [79], DEMM+ judiciously eliminates the need to material
ize a quadratic-sized affinity graph and its rear-mounted arduous

eigendecomposition in DEMM. Furthermore, we enable DEMM+ over
_attribute-less_ MRGs that are under-explored in previous works with

an additional orthogonality constraint. Our empirical studies evalu
ating DEMM+ against 20 competitors on 11 real MRG datasets demonstrate that DEMM+ consistently and conspicuously outperforms the

state-of-the-art solutions for MRGC in terms of clustering quality

at a fraction of their computational expenses.

The contributions of this paper can be summarized as follows:


- Conceptually, we introduce the new notion of MRDE on MRGs

and formulate the MRGC task as a two-stage optimization prob
lem based on the MRDE and DE.

- Methodologically, we develop a brute-force algorithm DEMM to

solve the above objectives for effective MRGC, and a compu
tationally tractable solver DEMM+ for practical scalability with
non-trivial theories and techniques FAAO and SSKC. DEMM+ is further extended as DEMM-NA to attribute-less MRGs.

- Empirically, we conduct extensive experiments on 9 real datasets

of various sizes to validate the effectiveness and efficiency of

proposed methods.



2


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



**Table 1: Frequently used symbols.**

|Symbol|Description|
|---|---|
|V_,_ E (_𝑟_)<br>_𝑁, 𝑀_(_𝑟_)_, 𝑀_|The node set and edge set of_ 𝑟_th relation type.<br>The numbers of nodes, edges in E (_𝑟_), and all the edges.|
|_𝑅, 𝐾_<br>_𝐷,𝑑_|The numbers of relation types and desired clusters.<br>The dimensions of the input attribute and feature vectors.|
|_𝑿, 𝑯_|Initial and target feature vectors of nodes.|
|_𝑫_(_𝑟_)|The diagonal degree matrix of E (_𝑟_) .|
|_𝑨_(_𝑟_)_,_ ˆ_𝑨_<br>(_𝑟_)|The adjacency matrix of E (_𝑟_) and its normalized version.|
|<br>_𝜔𝑟_<br>_𝒀 𝑺_|<br>The importance weight for_ 𝑟_th relation type.<br>The NCI and afnity matrix defned in Eq. (1) and Eq. (7).|
|_, _<br>D(_𝑯, 𝑨_(_𝑟_) )|<br>The DE of_ 𝑯_on_ 𝑨_(_𝑟_) defned in Eq. (2).|
|_𝛼, 𝛽_|The coefcients for terms LMRDE and Lreg in Eq. (4).<br>|
|_𝐿,𝑚_|The number of hops and sketching dimension in FAAO.|



**2** **Problem Formulation**


In this section, we set up the necessary preliminaries and provide a

formalization of the MRGC problem.


**2.1** **Symbol and Terminology**


**Matrix Notation.** Throughout this paper, sets are denoted by calligraphic letters, e.g., V. Matrices (resp. vectors) are written in bold
uppercase (resp. lowercase) letters, e.g., _𝑴_ (resp. x). We use _𝑴𝑖_ and
_𝑴_ - _,𝑖_ to represent the _𝑖_ [th] row and column of _𝑴_, respectively. ∥ _𝑴_ ∥ _𝐹_
denotes the Frobenius norm of matrix _𝑴_ and nnz( _𝑴_ ) is the number
of non-zero entries in _𝑴_ . A matrix _𝑴_ is said to be row-normalized
(resp. column-normalized) if each _𝑖_ [th] row (resp. column) is _𝐿_ 2 normalized, i.e., ∥ _𝑴𝑖_ ∥2=1 (resp. ∥ _𝑴_ - _,𝑖_ ∥2 = 1). For ease of exposition,
we say _𝑴_ ∈ Nrow if _𝑴_ is row-normalized. By “the first _𝐾_ eigenvec
tors”, we refer to the eigenvectors corresponding to the _𝐾_ largest

eigenvalues of a matrix.


**Graph Nomenclature.** A _multi-relational graph_ (MRG) is defined

as G = (V _,_ {E [(] _[𝑟]_ [)] } _𝑟_ _[𝑅]_ =1 [)][,] [where] [V] [denotes] [the] [set] [of] _[𝑁]_ [distinct]
nodes and E [(] _[𝑟]_ [)] contains a set of _𝑀_ [(] _[𝑟]_ [)] edges (or relations) between
nodes in V in the _𝑟_ [th] (1 ≤ _𝑟_ ≤ _𝑅_ ) type of relation. The total
number of edges in G is denoted by _𝑀_ = [�] _𝑟_ _[𝑅]_ =1 _[𝑀]_ [(] _[𝑟]_ [)] [. For each edge]
( _𝑣𝑖, 𝑣_ _𝑗_ ) ∈E [(] _[𝑟]_ [)] connecting nodes _𝑣𝑖_ and _𝑣_ _𝑗_, we say _𝑣𝑖_ and _𝑣_ _𝑗_ are

neighbors to each other under _𝑟_ [th] relation type. The degree of _𝑣𝑖_ (i.e.,
the neighbors of _𝑣𝑖_ ) in E [(] _[𝑟]_ [)] is symbolized by _𝑑𝑖_ [(] _[𝑟]_ [)] . In particular, we
refer to G as an _attributed_ MRG if each node _𝑣𝑖_ ∈V is endowed with
a _𝐷_ -dimensional attribute vector _𝑿𝑖_, and otherwise an _attribute-_
_less MRG_ . Unless specified otherwise, an MRG G is assumed to be

attributed by default.
We denote by _𝑨_ [(] _[𝑟]_ [)] ∈{0 _,_ 1} _[𝑁]_ [×] _[𝑁]_ the adjacency matrix constructed from the edges in E [(] _[𝑟]_ [)] and by _𝑫_ [(] _[𝑟]_ [)] the degree matrix
whose diagonal entry _𝑫𝑖,𝑖_ [(] _[𝑟]_ [)] = _𝑑𝑖_ [(] _[𝑟]_ [)] . Accordingly, the normalized


















|Col1|Col2|
|---|---|
|**14**<br>**0.48**<br><br>|**0.42**<br>|
|**21**<br>**0.14**<br>**62**<br>**0.33**|**0.27**<br>**0.16**|
|**20**<br>**0.27**<br>**18**<br>**0.14**|**0.16**<br>**0.11**|


|0.20 0|.68 0.5|
|---|---|
|**0.25**<br><br>**0.51**<br>|**0.17**<br>**0.3**<br>**0.27**<br>**0.1**|
|**0.20**<br><br>**0.25**<br>|**0.27**<br>**0.1**<br>**0.20**<br>**0.1**|




|0.28 0.96 0.84 0.36 0.24 0.46 0.14 0.48 0.42 0.20 0.68 0.59<br>0.21 0.14 0.27 0.250.17 0.33<br>0.34 0.42 0.82 0.88 0.46 0.22 0.62 0.33 0.16 0.510.27 0.13<br>0.20 0.27 0.16 0.200.27 0.16<br>0.18 0.14 0.11 0.250.20 0.16<br>0.36 0.28 0.22 0.34 0.46 0.28 0.17 0.21 0.41 0.240.30 0.58<br>MRG<br>0 0.14 0.32 0.12 0.21 0.07 0 0.33 0.48 0.35 0.42 0.15<br>0.14 0 0.29 0.03 0.03 0.03 0.33 0 0.12 0.04 0.04 0.14<br>0.32 0.29 0 0.18 0.35 0.28 0.48 0.12 0 0.10 0.07 0.28<br>0.12 0.03 0.18 0 0.02 0.03 0.35 0.04 0.10 0 0.01 0.18<br>0.21 0.03 0.35 0.02 0 0.10 0.42 0.04 0.07 0.01 0 0.19<br>0.07 0.03 0.28 0.03 0.10 0 0.15 0.14 0.28 0.18 0.19 0|Col2|Col3|Col4|Col5|
|---|---|---|---|---|
|**0**<br>**0.14 0.32 0.12 0.21 0.07**<br>**0.14**<br>**0**<br>**0.29 0.03 0.03 0.03**<br>**0.32 0.29**<br>**0**<br>**0.18 0.35 0.28**<br>**0.12 0.03 0.18**<br>**0**<br>**0.02 0.03**<br>**0.21 0.03 0.35 0.02**<br>**0**<br>**0.10**<br>**0.07 0.03 0.28 0.03 0.10**<br>**0**<br>**0.28**<br>**0**<br>**0.33 0.48 0.35 0.42 0.15**<br>**0.33**<br>**0**<br>**0.12 0.04 0.04 0.14**<br>**0.48 0.12**<br>**0**<br>**0.10 0.07 0.28**<br>**0.35 0.04 0.10**<br>**0**<br>**0.01 0.18**<br>**0.42 0.04 0.07 0.01**<br>**0**<br>**0.19**<br>**0.15 0.14 0.28 0.18 0.19**<br>**0**<br>**MRG**<br>**0.14**<br>**0.48**<br>**0.42**<br>**0.21**<br>**0.14**<br>**0.27**<br>**0.62**<br>**0.33**<br>**0.16**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.18**<br>**0.14**<br>**0.11**<br>**0.17**<br>**0.21**<br>**0.41**<br>**0.20 0.68**<br>**0.59**<br>**0.25**<br>**0.17**<br>**0.33**<br>**0.51**<br>**0.27**<br>**0.13**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.25**<br>**0.20**<br>**0.16**<br>**0.24**<br>**0.30**<br>**0.58**<br>**0.96**<br>**0.84**<br>**0.34**<br>**0.42**<br>**0.82**<br>**0.36**<br>**0.28**<br>**0.22**<br>**0.36**<br>**0.24**<br>**0.46**<br>**0.88**<br>**0.46**<br>**0.34**<br>**0.46**<br>**0.28**<br>**0.22**|**0.48 **|**0.35 **|**0.42 **|**0.15**|
|**0**<br>**0.14 0.32 0.12 0.21 0.07**<br>**0.14**<br>**0**<br>**0.29 0.03 0.03 0.03**<br>**0.32 0.29**<br>**0**<br>**0.18 0.35 0.28**<br>**0.12 0.03 0.18**<br>**0**<br>**0.02 0.03**<br>**0.21 0.03 0.35 0.02**<br>**0**<br>**0.10**<br>**0.07 0.03 0.28 0.03 0.10**<br>**0**<br>**0.28**<br>**0**<br>**0.33 0.48 0.35 0.42 0.15**<br>**0.33**<br>**0**<br>**0.12 0.04 0.04 0.14**<br>**0.48 0.12**<br>**0**<br>**0.10 0.07 0.28**<br>**0.35 0.04 0.10**<br>**0**<br>**0.01 0.18**<br>**0.42 0.04 0.07 0.01**<br>**0**<br>**0.19**<br>**0.15 0.14 0.28 0.18 0.19**<br>**0**<br>**MRG**<br>**0.14**<br>**0.48**<br>**0.42**<br>**0.21**<br>**0.14**<br>**0.27**<br>**0.62**<br>**0.33**<br>**0.16**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.18**<br>**0.14**<br>**0.11**<br>**0.17**<br>**0.21**<br>**0.41**<br>**0.20 0.68**<br>**0.59**<br>**0.25**<br>**0.17**<br>**0.33**<br>**0.51**<br>**0.27**<br>**0.13**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.25**<br>**0.20**<br>**0.16**<br>**0.24**<br>**0.30**<br>**0.58**<br>**0.96**<br>**0.84**<br>**0.34**<br>**0.42**<br>**0.82**<br>**0.36**<br>**0.28**<br>**0.22**<br>**0.36**<br>**0.24**<br>**0.46**<br>**0.88**<br>**0.46**<br>**0.34**<br>**0.46**<br>**0.28**<br>**0.22**|**0.12 **<br><br>**0**<br>|**0.04 **<br>**0.10 **|**0.04 **<br> **0.07 **|**0.14**<br> **0.28**|
|**0**<br>**0.14 0.32 0.12 0.21 0.07**<br>**0.14**<br>**0**<br>**0.29 0.03 0.03 0.03**<br>**0.32 0.29**<br>**0**<br>**0.18 0.35 0.28**<br>**0.12 0.03 0.18**<br>**0**<br>**0.02 0.03**<br>**0.21 0.03 0.35 0.02**<br>**0**<br>**0.10**<br>**0.07 0.03 0.28 0.03 0.10**<br>**0**<br>**0.28**<br>**0**<br>**0.33 0.48 0.35 0.42 0.15**<br>**0.33**<br>**0**<br>**0.12 0.04 0.04 0.14**<br>**0.48 0.12**<br>**0**<br>**0.10 0.07 0.28**<br>**0.35 0.04 0.10**<br>**0**<br>**0.01 0.18**<br>**0.42 0.04 0.07 0.01**<br>**0**<br>**0.19**<br>**0.15 0.14 0.28 0.18 0.19**<br>**0**<br>**MRG**<br>**0.14**<br>**0.48**<br>**0.42**<br>**0.21**<br>**0.14**<br>**0.27**<br>**0.62**<br>**0.33**<br>**0.16**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.18**<br>**0.14**<br>**0.11**<br>**0.17**<br>**0.21**<br>**0.41**<br>**0.20 0.68**<br>**0.59**<br>**0.25**<br>**0.17**<br>**0.33**<br>**0.51**<br>**0.27**<br>**0.13**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.25**<br>**0.20**<br>**0.16**<br>**0.24**<br>**0.30**<br>**0.58**<br>**0.96**<br>**0.84**<br>**0.34**<br>**0.42**<br>**0.82**<br>**0.36**<br>**0.28**<br>**0.22**<br>**0.36**<br>**0.24**<br>**0.46**<br>**0.88**<br>**0.46**<br>**0.34**<br>**0.46**<br>**0.28**<br>**0.22**|**0.10**|<br>**0**|<br>**0.01 **|<br> **0.18**|
|**0**<br>**0.14 0.32 0.12 0.21 0.07**<br>**0.14**<br>**0**<br>**0.29 0.03 0.03 0.03**<br>**0.32 0.29**<br>**0**<br>**0.18 0.35 0.28**<br>**0.12 0.03 0.18**<br>**0**<br>**0.02 0.03**<br>**0.21 0.03 0.35 0.02**<br>**0**<br>**0.10**<br>**0.07 0.03 0.28 0.03 0.10**<br>**0**<br>**0.28**<br>**0**<br>**0.33 0.48 0.35 0.42 0.15**<br>**0.33**<br>**0**<br>**0.12 0.04 0.04 0.14**<br>**0.48 0.12**<br>**0**<br>**0.10 0.07 0.28**<br>**0.35 0.04 0.10**<br>**0**<br>**0.01 0.18**<br>**0.42 0.04 0.07 0.01**<br>**0**<br>**0.19**<br>**0.15 0.14 0.28 0.18 0.19**<br>**0**<br>**MRG**<br>**0.14**<br>**0.48**<br>**0.42**<br>**0.21**<br>**0.14**<br>**0.27**<br>**0.62**<br>**0.33**<br>**0.16**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.18**<br>**0.14**<br>**0.11**<br>**0.17**<br>**0.21**<br>**0.41**<br>**0.20 0.68**<br>**0.59**<br>**0.25**<br>**0.17**<br>**0.33**<br>**0.51**<br>**0.27**<br>**0.13**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.25**<br>**0.20**<br>**0.16**<br>**0.24**<br>**0.30**<br>**0.58**<br>**0.96**<br>**0.84**<br>**0.34**<br>**0.42**<br>**0.82**<br>**0.36**<br>**0.28**<br>**0.22**<br>**0.36**<br>**0.24**<br>**0.46**<br>**0.88**<br>**0.46**<br>**0.34**<br>**0.46**<br>**0.28**<br>**0.22**|**0.07 **|**0.01**|**0**|**0.19**|
|**0**<br>**0.14 0.32 0.12 0.21 0.07**<br>**0.14**<br>**0**<br>**0.29 0.03 0.03 0.03**<br>**0.32 0.29**<br>**0**<br>**0.18 0.35 0.28**<br>**0.12 0.03 0.18**<br>**0**<br>**0.02 0.03**<br>**0.21 0.03 0.35 0.02**<br>**0**<br>**0.10**<br>**0.07 0.03 0.28 0.03 0.10**<br>**0**<br>**0.28**<br>**0**<br>**0.33 0.48 0.35 0.42 0.15**<br>**0.33**<br>**0**<br>**0.12 0.04 0.04 0.14**<br>**0.48 0.12**<br>**0**<br>**0.10 0.07 0.28**<br>**0.35 0.04 0.10**<br>**0**<br>**0.01 0.18**<br>**0.42 0.04 0.07 0.01**<br>**0**<br>**0.19**<br>**0.15 0.14 0.28 0.18 0.19**<br>**0**<br>**MRG**<br>**0.14**<br>**0.48**<br>**0.42**<br>**0.21**<br>**0.14**<br>**0.27**<br>**0.62**<br>**0.33**<br>**0.16**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.18**<br>**0.14**<br>**0.11**<br>**0.17**<br>**0.21**<br>**0.41**<br>**0.20 0.68**<br>**0.59**<br>**0.25**<br>**0.17**<br>**0.33**<br>**0.51**<br>**0.27**<br>**0.13**<br>**0.20**<br>**0.27**<br>**0.16**<br>**0.25**<br>**0.20**<br>**0.16**<br>**0.24**<br>**0.30**<br>**0.58**<br>**0.96**<br>**0.84**<br>**0.34**<br>**0.42**<br>**0.82**<br>**0.36**<br>**0.28**<br>**0.22**<br>**0.36**<br>**0.24**<br>**0.46**<br>**0.88**<br>**0.46**<br>**0.34**<br>**0.46**<br>**0.28**<br>**0.22**|**0.28 **|**0.18 **|**0.19**|**0**|


|Col1|0.14|0.32 0|.12 0.21|0.07|
|---|---|---|---|---|
||**0**<br> **0.29**|**0.29 0**<br>**0**<br>|**.03 0.03**<br>**.18 0.35**|**0.03**<br> **0.28**|
|<br>**0.12 **<br>**0.21 **<br>**0.07 **|<br> **0.03 **|**0.18**|<br>**0**<br>**0.02**|<br> **0.03**|
|<br>**0.12 **<br>**0.21 **<br>**0.07 **|**0.03 **|**0.35 0**|**.02**<br>**0**|**0.10**|
|<br>**0.12 **<br>**0.21 **<br>**0.07 **|**0.03 **|**0.28 0**|**.03 0.10**|**0**|



**Figure 3: A running example for MRDE.**


**Multi-Relational Graph Clustering (MRGC).** Given an MRG G

and the number _𝐾_ of clusters, the overreaching goal of MRGC is to

partition the node set V into _𝐾_ disjoint groups {C1 _, . . .,_ C _𝐾_ } (i.e.,

- _𝐾_
_𝑘_ =1 [C] _[𝑘]_ [=][ V][ and][ C] _[𝑖]_ [∩C] _[𝑗]_ [=][ ∅] [for] _[ 𝑖]_ [≠] _[𝑗]_ [), such that nodes with high]
attribute homogeneity and strong connectivity under _𝑅_ relation

types are in the same group, while dissimilar and distant ones fall

into distinct clusters.


This goal can typically be achieved through two subtasks. Firstly,

the task is to construct a feature matrix _𝑯_ that can accurately cap
ture the affinity between nodes in terms of attribute similarity and

multiplex structural connectivity in MRGs. Subsequently, clusters

{C1 _, . . .,_ C _𝐾_ } can be derived from _𝑯_ such that similar feature vectors in _𝑯_ are grouped into the same clusters. Particularly, clusters
{C1 _, . . .,_ C _𝐾_ } can be represented in matrix form using an _𝑁_ × _𝐾_
_node-cluster indicator_ (NCI) _𝒀_ in which



~~√~~ 1




_𝒀_ _𝑖,𝑘_ =





| C1 _𝑘_ | _[,]_ if _𝑣𝑖_ ∈C _𝑘,_



_𝑘_ (1)


0 _,_ otherwise _._



**2.2** **Multi-Relational Dirichlet Energy**

The _Dirichlet energy_ (DE) [116] of feature matrix _𝑯_ ∈ R _[𝑁]_ [×] _[𝑑]_ over a
graph with edges E [(] _[𝑟]_ [)] is defined by



∥ _𝑨_ [(] _𝑗_ _[𝑟]_ [)] ∥1



D( _𝑯, 𝑨_ [(] _[𝑟]_ [)] ) = [1]

2


= [1]

2



∑︁ _𝑨𝑖,𝑗_ [(] _[𝑟]_ [)] [·] _𝑯_ _𝑖_ /√︃

_𝑣𝑖,𝑣𝑗_ ∈V ����



∑︁


( _𝑣𝑖,𝑣𝑗_ ) ∈E [(] _[𝑟]_ [)]



√︃
∥ _𝑨𝑖_ [(] _[𝑟]_ [)] ∥1 - _𝑯_ _𝑗_ /



��2
��2



2


_,_ (2)

2



~~√~~
_𝑯_ _𝑖_ /
����



√︃
_𝑑𝑖_ [(] _[𝑟]_ [)] - _𝑯_ _𝑗_ /



_𝑑_ _𝑗_ [(] _[𝑟]_ [)]



����



adjacency matrix _𝑨_ [ˆ] [(] _[𝑟]_ [)] is defined as _𝑨_ [ˆ] [(] _[𝑟]_ [)] = _𝑫_ [(] _[𝑟]_ [)] [−] 2 [1]




[1] 2 ( _𝑟_ ) ( _𝑟_ ) [−] [1] 2

_𝑨_ _𝑫_



��
��



2



2 and



~~√~~
where _𝑯_ _𝑖_ /
����



~~√~~
_𝑑𝑖_ [(] _[𝑟]_ [)] - _𝑯_ _𝑗_ /



_𝑑_ [(] _[𝑟]_ [)]
_𝑗_



measures the dissimilarity of the

2



the normalized Laplacian matrix is _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] . Additionally, the oriented incidence matrix of E [(] _[𝑟]_ [)] is symbolized by _𝑬_ [(] _[𝑟]_ [)] ∈ R _[𝑁]_ [×] _[𝑀]_ [(] _[𝑟]_ [)],
and _𝑬_ [(] _[𝑟]_ [)] _𝑬_ [(] _[𝑟]_ [)⊤] = _𝑫_ [(] _[𝑟]_ [)] - _𝑨_ [(] _[𝑟]_ [)] . In Definition 2.1, we define the
( _ℓ_ 1 _, ℓ_ 2) _-order maximum eigengap_ (OME) of normalized adjacency
matrix _𝑨_ [ˆ] . Table 1 lists the frequently used symbols in this paper.


_Definition 2.1 (_ ( _ℓ_ 1 _, ℓ_ 2) _-Order Maximum Eigengap)._ Let _𝜆𝑖_ ( _𝑨_ [ˆ] ) be
the _𝑖_ [th] eigenvalue of _𝑨_ [ˆ] . The ( _ℓ_ 1 _, ℓ_ 2)-order maximum eigengap is
_𝜇ℓ_ 1 _,ℓ_ 2 = max _[𝑨]_ [ˆ][)] _[ℓ]_ [1] [−] _[𝜆][𝑖]_ [(] _[𝑨]_ [ˆ][)] _[ℓ]_ [2][ |][.]
1≤ _𝑖_ ≤ _𝑁_ [|] _[𝜆][𝑖]_ [(]



_𝑅_
∑︁

LMRDE = _𝜔𝑟_ - D( _𝑯, 𝑨_ [(] _[𝑟]_ [)] ) _._ (3)


_𝑟_ =1



features of two adjacent nodes _𝑣𝑖, 𝑣_ _𝑗_ in E [(] _[𝑟]_ [)] . Intuitively, D( _𝑯, 𝑨_ [(] _[𝑟]_ [)] )
assesses the overall _smoothness_ of _𝑯_ over E [(] _[𝑟]_ [)], indicating whether
node features in _𝑯_ are similar across adjacent nodes.
To quantify the smoothness of _𝑯_ over the MRG G, we extend the
Dirichlet energy to the _multi-relational Dirichlet energy_ (MRDE),

which is formulated as follows:



3


Conference’17, July 2017, Washington, DC, USA Lin et al.





_𝑅_
∑︁

_𝜔𝑟_ = 1 _,_ (4)

_𝑟_ =1





_𝑯_ ∈ Nrow by optimizing the following objective:


min [L][MRDE][ +] _[ 𝛽]_ [·] [L][reg] s.t.
_𝑯_ ∈Nrow _,_ _𝜔𝑟_ ∈R [L][fit][ +] _[ 𝛼]_ [·]







Lfit = ∥ _𝑯_ - _𝑿_ ∥ _𝐹_ [2] _[,]_ Lreg =









where the fitting and regularization terms Lfit, Lreg are defined

by



_𝑅_
∑︁

_𝜔𝑟_  - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] _[,]_
_𝑟_ =1



**Figure 4: Two-Stage Optimization Objectives for MRGC.**


_𝜔_ 1 _, . . .,𝜔𝑅_ represents the _relation type weights_ (hereafter RTWs),

which specify the importance of the edges under _𝑅_ relation types, re
spectively. Particularly, a low MRDE LMRDE reflects a high smoothness of _𝑯_ over G, while a high MRDE connotes a large divergence in

features of adjacent nodes. In other words, this implies that MRDE

can be used to measure the quality of feature matrix _𝑯_ in fusing
multiplex structural connectivity in MRG G.


_Example 2.2._ Figure 3 presents an MRG G that contains two types
of relations (E [(][1][)] and E [(][2][)] ) and six nodes (i.e., _𝑣_ 1- _𝑣_ 6). The first (resp.

second) type of relations is colored in purple (resp. blue). Each node

_𝑣𝑖_ in _𝑣_ 1- _𝑣_ 6 is associated with a 3-dimensional attribute vector _𝑯_ _𝑖_ . By

normalizing the attribute vectors by their respective node degrees in



~~√~~
two types of relations, i.e., _𝑯_ _𝑖_ /


~~√~~
new node feature matrices _𝑯_ /



~~√~~
_𝑑𝑖_ [(][1][)] and _𝑯_ _𝑖_ /

~~√~~
_𝑫_ [(][1][)] and _𝑯_ /



_𝑑_ [(][2][)], we obtain two
_𝑖_

_𝑫_ [(][2][)] . For each edge



√︃
( _𝑣𝑖, 𝑣_ _𝑗_ ) ∈E [(][1][)] (resp. E [(][2][)] ), we calculate ∥ _𝑯_ _𝑖_ /



_𝑑_ _𝑗_ [(][1][)] ∥ [2] 2



~~√~~
_𝑑𝑖_ [(][1][)] - _𝑯_ _𝑗_ /



and _𝛼, 𝛽_ are their respective coefficients. The constraint [�] _𝑟_ _[𝑅]_ =1 _[𝜔][𝑟]_ [=]
1 enforces a normalization on the _𝑅_ RTWs.

More specifically, the fitting term Lfit seeks to reduce the discrepancy between the target node feature vectors _𝑯_ and initial
features [1] _𝑿_ ∈ R _[𝑁]_ [×] _[𝑑]_, whereas the MRDE term LMRDE renders
feature vectors _𝑯_ _𝑖_ and _𝑯_ _𝑗_ of nodes _𝑣𝑖, 𝑣_ _𝑗_ close to each other when

they are connected via an edge of important types, i.e., its RTW

_𝜔𝑟_ is large. By minimizing MRDE, this stage seeks to obtain node
feature vectors _𝑯_ that are consistently smooth over the _𝑅_ types
of structural connectivity {E [(][1][)] _,_ E [(][1][)] _, . . .,_ E [(] _[𝑅]_ [)] } in MRGs. Notably,
we additionally incorporate Lreg to regularize RTWs { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [with]

the consideration of the volumes of their associated edges, thereby

preventing over-weighting (resp. under-weighting) the large (resp.

small) edge set E [(] _[𝑟]_ [)] (i.e., _𝑨_ [ˆ] [(] _[𝑟]_ [)] ). In a nutshell, the main goal of Stage
I is to compute RTWs { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [automatically by optimizing the ob-]
jective function to fuse {E [(] _[𝑟]_ [)] } _𝑟_ _[𝑅]_ =1 [, thereby obtaining node feature]
vectors _𝑯_ while minimizing MRDE.


**Stage II Objective.** In the second stage, the goal is to minimize the
DE of NCI _𝒀_ over an affinity graph _𝑺_ constructed from node feature
vectors _𝑯_, i.e.,

min D( _𝒀_ _, 𝑺_ ) _._ (5)
C1 _,...,_ C _𝐾_


Under certain assumptions on _𝑺_, it can be transformed into



√︃
(resp. ∥ _𝑯_ _𝑖_ /



_𝑑_ _𝑗_ [(][2][)] ∥ [2] 2 [).] [Summing] [up] [these] [values,] [re-]



~~√~~
_𝑑𝑖_ [(][2][)] - _𝑯_ _𝑗_ /



spectively, leads to DE D( _𝑯, 𝑨_ [(][1][)] ) = 2 _._ 2 and D( _𝑯, 𝑨_ [(][2][)] ) = 2 _._ 9.
Suppose that the RTWs are _𝜔_ 1 = 0 _._ 8 and _𝜔_ 2 = 0 _._ 2. The MRDE is
then LMRDE = 0 _._ 8 × D( _𝑯, 𝑨_ [(][1][)] ) + 0 _._ 2 × D( _𝑯, 𝑨_ [(][2][)] ) = 2 _._ 34.


**Table 2: The MRDE and ACC values by DEMM+ and BMGC [75].**

|Method|Metric|ACM D|BLP ACM2|Yelp|IMDB|
|---|---|---|---|---|---|
|BMGC|MRDE<br>ACC|1576.6<br>28<br>93.0<br>9|37.6<br>2765.4<br>3.4<br>91.3|2164.5<br>91.5|1456.8<br>51.0|
|DEMM+|MRDE<br>ACC|1380.6<br>26<br>93.6<br>9|35.6<br>2505.8<br>3.7<br>91.3|2072.1<br>92.7|1296.4<br>67.6|



Table 2 reports the MRDE values of feature matrices obtained

by a state-of-the-art MRGC approach BMGC [75] and our proposed
DEMM+, as well as the final clustering accuracies (ACC) on five real

datasets, respectively. The empirical results indicate that a smaller

MRDE yields a better clustering quality on MRGs.


**2.3** **Two-Stage Optimization Objectives**


Next, we define our two-stage objective functions schematized in

Figure 4 for MRGC, based on the notions of DE and MRDE defined

in Eq. (2) and Eq. (3).


**Stage I Objective.** As shown in Figure 4, the first task is to fuse the
attribute information in _𝑿_ and the graph structures underlying _𝑅_
types of relations {E [(][1][)] _,_ E [(][1][)] _, . . .,_ E [(] _[𝑅]_ [)] } into node feature vectors



where _𝜎_ is the _kernel width_ parameter (typically 1 or 2). To accu
rately discriminate similar and dissimilar node pairs, node feature

vectors _𝑯_ is normalized such that −1 ≤ _𝑯_ _𝑖_ - _𝑯_ _𝑗_ ≤ 1 ∀ _𝑣𝑖, 𝑣_ _𝑗_ ∈V
before constructing _𝑺_ . Intuitively, minimizing D( _𝒀_ _, 𝑺_ ) is to min
imize the Euclidean distances of feature vectors of nodes in the

same clusters.


1For notational convenience, we henceforth refer to the node attribute matrix denoised
via a principal component analysis as initial features _𝑿_ .



min
C1 _,...,_ C _𝐾_



_𝐾_
∑︁ ∑︁


_𝑘_ =1 _𝑣𝑖_ ∈C _𝑘_ _,𝑣𝑗_ ∈V\C _𝑘_



_𝑺𝑖,𝑗_
| C _𝑘_ | _[,]_ (6)



which is to identify a set {C1 _, . . .,_ C _𝐾_ } of _𝐾_ clusters that minimize

the external connectivity of clusters. As exemplified in Figure 4,

clusters _𝑣𝑎_ - _𝑣𝑐_, _𝑣𝑑_ - _𝑣_ _𝑓_, and _𝑣𝑔_ - _𝑣𝑘_ are an ideal partitioning of V over
_𝑺_ since the affinity values of inter-partition nodes are merely 0 _._ 1 or

0 _._ 2, while those of intra-partition nodes are mostly more than 1 _._ 0.

In particular, following the conventional choice for the affinity

matrix of feature vectors in Euclidean space [74, 78], we employ
the _Gaussian kernel_ with pairwise distance to measure the affinity
of node pair ( _𝑣𝑖, 𝑣_ _𝑗_ ):




      
_𝑺𝑖,𝑗_ = exp




- [∥] _[𝑯]_ _[𝑖]_ [−] _[𝑯]_ _[𝑗]_ [∥] 2 [2]
_𝜎_







_,_ (7)



4


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



**Algorithm 1:** DEMM Algorithm


**Input:** An MRG G, parameters _𝛼_, _𝛽_, and _𝐾_ .
**Output:** A set {C1 _,_ C2 _, . . .,_ C _𝐾_ } of _𝐾_ clusters.
/* Brute-Force Alternating Optimization */

**1** _𝜔𝑟_ ← _𝑅_ [1] [∀][1] [≤] _[𝑟]_ [≤] _[𝑅]_ [;]

**2** **do**

**3** Compute _𝑨_ [ˆ] according to Eq. (9);

**4** Compute _𝑯_ according to Eq.(10);

**5** Normalize _𝑯_ such that _𝑯_ ∈ Nrow;

**6** Update _𝜔𝑟_ according to Eq. (11) ∀1 ≤ _𝑟_ ≤ _𝑅_ ;

**7** **until** _𝑯_ _converges_ ;


/* Spectral Affinity Graph Clustering */

**8** Normalize _𝑯_ according to Eq.(13);

**9** Construct affinity matrix _𝑺_ according to Eq. (7);

**10** _𝑼_ ← the first _𝐾_ eigenvectors of _𝑺_ ;

**11** Run _𝐾_ -Means over _𝑼_ to generate {C1 _, . . .,_ C _𝐾_ };


**3** **The DEMM Method**


This section presents our first-cut solution DEMM for MRGC, shown
in Algorithm 1. At a high level, DEMM is an approximate method

towards optimizing our two-stage objective functions in Eq. (4)

and (5) using an alternative optimization and spectral clustering

under constraint relaxation, respectively. More concretely, DEMM
takes as input an MRG G, coefficients _𝛼_, _𝛽_, and the number _𝐾_

of clusters, and runs in two phases. In the following, Section 3.1

details our brute-force alternative optimization method for our

first objective in Eq. (4) to construct feature vectors _𝑯_ (Stage I). In

Section 3.2, we transform our clustering objective in Eq. (5) to its

theoretically equivalent problem and apply a spectral approach to

generate clusters {C1 _, . . .,_ C _𝑘_ } based on _𝑯_ (Stage II). Section 3.3
provides theoretical analyses of DEMM in terms of its correctness

and computational complexity.


**3.1** **Brute-Force Alternating Optimization**


Given the hardness of Eq. (4), we resort to an alternative optimiza
tion strategy to _approximately_ solve this problem. Specifically, we
update two variables, i.e., node feature vector _𝑯_ and relation type
weights { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [, alternatively, each time fixing one of them and]

updating the other, using the following rules.


**Update** _𝑯_ **with** { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 **[fixed.]** [ Firstly, for any relation type] _[ 𝑟]_ [, we]

have the following fact: D( _𝑯,_ E [(] _[𝑟]_ [)] ) = trace( _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ ).
Given fixed RTWs { _𝜔_ } _𝑟_ _[𝑅]_ =1 [, the original optimization objective in]

Eq. (4) can be simplified as the following partial objective function:
min _𝑯_ ∈Nrow ∥ _𝑯_ - _𝑿_ ∥ [2] _𝐹_ [+] _[𝛼]_ [·L][MRDE][, which is equivalent to optimizing]


min ∥ _𝑯_     - _𝑿_ ∥ [2] _𝐹_ [+] _[ 𝛼]_ [·][ trace][(] _[𝑯]_ [⊤] [(] _[𝑰]_ [−] _[𝑨]_ [ˆ][)] _[𝑯]_ [)] _[,]_ (8)
_𝑯_ ∈Nrow

where _𝑨_ [ˆ] is the weighted average of { _𝑨_ [ˆ] [(] _[𝑟]_ [)] } _𝑟_ _[𝑅]_ =1 [defined in Eq.][ (][9][)][,]
henceforth referred to as the _unified normalized adjacency matrix_ .



Lemma 3.1. _The closed-form solution to Eq._ (8) _is_


1             - _𝛼_             - −1
_𝑯_ = _𝑰_      - _𝑨_ ˆ _𝑿_ _._ (10)
1 + _𝛼_ [·] 1 + _𝛼_


Our Lemma 3.1 [2] reveals that the optimal _𝑯_ in Eq. (8) (interme
diate partial optimum to Eq. (4)) can be obtained through a matrix

inverse as in Eq. (10).


**Update** { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 **[with]** _[ 𝑯]_ **[fixed.]** [When] _[𝑯]_ [is] [at] [hand,] [the] [partial]

objective function of Eq. (4) can be rewritten as



_𝑅_
∑︁

_𝜔𝑟_  - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2]
_𝑟_ =1



min _𝛼_
{ _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1



_𝑅_
∑︁ - 
_𝜔𝑟_  - trace _𝑯_ [⊤] ( _𝑰_  - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ + _𝛽_

_𝑟_ =1



such that [1.] [By] [leveraging] [the] [Cauchy–Schwarz] [in-]

[�] _𝑟_ _[𝑅]_ =1 _[𝜔][𝑟]_ [=]
equality, we can prove that the above partial objective is optimized

when we set the RTW


          -          - �� −2
_𝛽_        - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] [+] _[ 𝛼]_ [·][ trace] _𝑯_ [⊤] ( _𝑰_        - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_



_𝜔𝑟_ =



(11)

- _𝑟𝑅_ =1 - _𝛽_ - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] [+] _[ 𝛼]_ [·][ trace] - _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ �� −2



for each relation type 1 ≤ _𝑟_ ≤ _𝑅_ . Notice that {∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [}] _𝑟_ _[𝑅]_ =1 [can be]

precomputed and reused in each iteration. We defer the detailed

derivative steps to Appendix B for the sake of space.
Based on the above rules for updating _𝑯_ and { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [,] [DEMM]
(Algorithm 1) begins by initializing RTWs _𝜔𝑟_ = _𝑅_ [1] [∀][1] [≤] _[𝑟]_ [≤] _[𝑅]_ [at]


Line 1. Continuing forth, Algorithm 1 starts an iterative process
to update _𝑯_ and { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [in an alternating fashion (Lines 2-7). To]
be specific, DEMM first fuses the normalized adjacency matrices of _𝑅_
relation types into the unified normalized adjacency matrix _𝑨_ [ˆ] by
Eq. (9), followed by an inverse of matrix _𝑰_ - 1+ _𝛼𝛼_ _[𝑨]_ [ˆ] [to get updated]
node feature vectors _𝑯_ in Eq. (10) (Lines 3-4). _𝑯_ is further rownormalized such that _𝑯_ ∈ Nrow at Line 5. After that, Algorithm 1
updates each relation type weight _𝜔𝑟_ with the latest _𝑯_ by Eq. (11)
at Line 6, and repeats the above procedure until _𝑯_ stabilizes.


**3.2** **Spectral Affinity Graph Clustering**


Lemma 3.2. _If 𝒀_ _is required to be an 𝑁_ × _𝐾_ _NCI as in Eq._ (1) _, then_

min [⇔] [max] trace( _𝒀_ [⊤] _𝑺𝒀_ ) _._ (12)
_𝒀_ [D(] _[𝒀]_ _[,][ 𝑺]_ [)] _𝒀_


According to Lemma 3.2, our second optimization objective in

Eq. (5) can be equivalently transformed to Eq. (12), which is es
sentially an Ncut problem [78]. Note that the N-cut problem has

been proven to be NP-hard [25, 89]. We resort to a standard way of

_spectral clustering_ [88] to _approximately_ solve it by first relaxing the
discrete constraint in Eq.(1) on _𝒀_, leading to the following objective

function:
max s.t. _𝒀_ [˜] [⊤] _𝒀_ [˜] = _𝑰_ _,_
_𝒀_ ˜ ∈R _𝑁_ × _𝐾_ [trace][(][ ˜] _[𝒀]_ [⊤] _[𝑺][𝒀]_ [˜] [)]


where _𝒀_ [˜] is a continuous version of NCI _𝒀_ . According to Ky Fan’s
trace maximization principle [19], the optimal solution is _𝑼_ that
contains the first _𝐾_ eigenvectors of the affinity matrix _𝑺_ as columns.
The remaining task is then the conversion from _𝑼_ into NCI _𝒀_
by minimizing their _distance_, which typically can be done using

rounding techniques [99, 107] or _𝐾_ -Means.

As illustrated at Lines 8-11 in Algorithm 1, DEMM proceeds to
derive clusters from node feature vectors _𝑯_ by first constructing


2All proofs appear in Appendix B.



_𝑨_ ˆ =



_𝑅_
∑︁

_𝜔𝑟_  - _𝑨_ [ˆ] [(] _[𝑟]_ [)] (9)

_𝑟_ =1



5


Conference’17, July 2017, Washington, DC, USA Lin et al.







**Algorithm 2:** FAAO Algorithm


**Input:** An MRG G, parameters _𝛼_, _𝛽_, and _𝐿_ .
**Output:** Node feature vectors _𝑯_



**1** _𝜔𝑟_ = [1]



_𝑅_ [1] [∀][1] [≤] _[𝑟]_ [≤] _[𝑅]_ [;]



**2** _𝑬_ [˜] [(] _[𝑟]_ [)] ← CountSketch( _𝑬_ [ˆ] [(] _[𝑟]_ [)] _,𝑚_ ) ∀1 ≤ _𝑟_ ≤ _𝑅_ ;











**Figure 5: Overview of** **DEMM+.**



the affinity matrix _𝑺_ according to Eq. (7) (Lines 8-9). Particularly,
before computing _𝑺_, for each node _𝑣𝑖_ ∈V, Algorithm 1 applies a
standardization _𝑯_ _𝑖_ - _ℎ𝑖_, followed by an _𝐿_ 2 normalization, i.e.,


_𝑯_ _𝑖_          - _ℎ𝑖_
_𝑯_ _𝑖_ = _,_ (13)
∥ _𝑯_ _𝑖_                  - _ℎ𝑖_ ∥2


where _ℎ𝑖_ is the mean of _𝑯_ _𝑖_, i.e., _𝑑_ [1] - _𝑑ℓ_ =1 _[𝑯]_ _[𝑖,ℓ]_ [. As stated in Theorem]

1 in [82], this operation ensures the affinity _𝑯_ _𝑖_ - _𝑯_ _𝑗_ ∈[−1 _,_ 1] for
any two nodes _𝑣𝑖, 𝑣_ _𝑗_ ∈V.
Afterwards, the first _𝐾_ eigenvectors _𝑼_ of _𝑺_ are then calculated
through the popular _Arnoldi iterative solver_ for partial eigendecom
position [41] at Line 10. Following common practice in spectral

clustering, we run _𝐾_ -Means over _𝑼_ to produce NCI _𝒀_, i.e., the _𝐾_
clusters {C1 _,_ C2 _, . . .,_ C _𝐾_ } at Line 11.


**3.3** **Complexity Analysis**


Since Lines 3, 5, and 8 of Algorithm 1 merely involve summation

of matrices and matrix normalizations, we focus on analyzing the

complexities of computationally intensive operations. Particularly,

inverting an _𝑁_ × _𝑁_ matrix followed by the multiplication with _𝑿_
at Line 4 incurs a time cost of _𝑂_ ( _𝑀𝑁_ + _𝑁_ [2] _𝑑_ ). Line 6 calculates

   -    trace _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ when updating each relation type weight


_𝜔𝑟_, leading to a total of _𝑂_ ( _𝑀𝑑_ + _𝑁𝑑_ [2] _𝑅_ ) time for _𝑅_ relation type

weights. In the second stage, Line 9 requires materializing the affin
ity matrix _𝑺_ in Eq. (7) for all node pairs, consuming _𝑂_ ( _𝑁_ [2] _𝑑_ ) time
cost, whereas extracting the first _𝐾_ eigenvectors of _𝑺_ at Line 10 can
be done in _𝑂_ ( _𝑁_ [2] _𝐾_ ) time [41]. Therefore, the overall time complexity of DEMM is bounded by _𝑂_ ( _𝑀𝑁_ + _𝑁_ [2] _𝑑_ + _𝑁𝑑_ [2] _𝑅_ ).

Regarding space overhead, since the matrix inversion in Eq. (11)

yields an _𝑁_ × _𝑁_ dense matrix and Line 9 materializes an _𝑁_ × _𝑁_
affinity matrix _𝑺_, the total space complexity of DEMM is _𝑂_ ( _𝑁_ [2] ).


**4** **The DEMM+ Algorithm**


Despite achieving high clustering quality as exhibited in experi
ments (Section 5), DEMM incurs quadratic computational cost and

space overhead, and thus, is incompetent for large MRGs. As pin
pointed in the preceding section, the colossal time and storage space

are ascribed to the materialization of _𝑁_ × _𝑁_ _dense_ matrices and

expensive matrix operations, including inversion, multiplication,

and eigendecomposition, in either the construction of node feature

vectors _𝑯_ or the generation of clusters {C1 _,_ C2 _, . . .,_ C _𝐾_ }. To alleviate such issues, this section further proposes DEMM+ for MRGC,



**3** **do**

**4** Compute _𝑨_ [ˆ] by Eq. (9);

**5** _𝑿_ - [(][0][)] ← 1+1 _𝛼_ [·] _[ 𝑿][,]_ _[𝑯]_ [←] _[𝑿]_ [�] [(][0][)] [;]

**6** **for** _ℓ_ ← 1 **to** _𝐿_ **do**

**7** _𝑿_ - [(] _[ℓ]_ [)] ← 1+ _𝛼𝛼_ [·] _[𝑨]_ [ˆ] _[𝑿]_ [�] [(] _[ℓ]_ [−][1][)] [;]

**8** _𝑯_ ← _𝑯_ + _𝑿_ [(] _[ℓ]_ [)] ;

[�]

**9** _𝑯_ ← _𝑯_ + _𝛼_ - _𝑿_ [(] _[𝐿]_ [)] ;

[�]

**10** Normalize _𝑯_ such that _𝑯_ ∈ Nrow;

**11** Update _𝜔𝑟_ according to Eq. (16) ∀1 ≤ _𝑟_ ≤ _𝑅_ ;

**12** **until** _𝑯_ _converges_ ;


which is able to advance MRG clustering performance in efficiency

without compromising the effectiveness.

Figure 5 depicts an overview of DEMM+. Akin to DEMM, DEMM+ consists of two secondary algorithms, FAAO and SSKC, for the constructions of _𝑯_ and {C1 _,_ C2 _, . . .,_ C _𝐾_ }, respectively. At a high level, DEMM+
develops a truncated approximation for _𝑯_ and sketching-based

estimations for RTWs in the first stage. Subsequently, it transforms

the costly spectral clustering in Stage II to a cheap _𝐾_ -Means by

adjusting _𝑺_ . In Section 4.1, we first elucidate the algorithmic details of FAAO, which approximately updates _𝑯_ and RTWs { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1

alternatively towards optimizing our objective in Eq. (4) using lin
ear time and space. In lieu of optimizing Eq. (12) to get clusters

{C1 _,_ C2 _, . . .,_ C _𝐾_ } via the explicit construction of the _𝑁_ × _𝑁_ affinity graph _𝑺_ and costly spectral clustering, Section 4.2 presents our
SSKC method that achieves a linear computational time complex
ity through a theoretically-grounded problem transformation and

innovative adoption of mathematical apparatus, i.e., orthogonal

random features and Sinkhorn-Knopp normalization. Lastly, we

further extend DEMM+ to handle attribute-less MRGs (dubbed as
DEMM-NA). The algorithmic details are deferred to Appendix A for

the interest of space.


**4.1** **Fast Approximate Alternating Optimization**


Recall that in Section 3.1, the leading cause of the immense computational burden of building _𝑯_ is the inversion of _𝑰_ - 1+ _𝛼𝛼_ _[𝑨]_ [ˆ] [in]
Eq. (10), which needs an _𝑂_ ( _𝑁_ [3] ) time. On top of that, although

{∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [}] _𝑟_ _[𝑅]_ =1 [can] [be] [precomputed] [and] [the] [exact] [calculation] [of]

    -    trace _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ for each relation type _𝑟_ in Eq. (11) takes a

linear time of _𝑂_ ( _𝑁𝑑_ [2] + _𝑀_ [(] _[𝑟]_ [)] _𝑑_ ) per iteration, the overall computational expenditure for updating _𝑅_ relation type weights { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [for]

multiple iterations is also significant. Subsequently, we delineate

the rationale behind FAAO for tackling these efficiency challenges.


Theorem 4.1 ([31]). _Let 𝑴_ _be a matrix whose dominant eigen-_
_value 𝜆_ ( _𝑴_ ) _satisfies_ | _𝜆_ ( _𝑴_ )| _<_ 1 _. Then, the inverse_ ( _𝑰_ - _𝑴_ ) [−][1] _can be_
_expanded as a Neumann series:_ ( _𝑰_ - _𝑴_ ) [−][1] = [�] _ℓ_ [∞] =0 _[𝑴][ℓ]_ _[.]_



6


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



Lemma 4.2. _Let 𝜆_ ( _𝑨_ [ˆ] ) _be the dominant eigenvalue of_ _𝑨_ [ˆ] _._ | _𝜆_ ( _𝑨_ [ˆ] )| ≤ 1 _._


**Basic Idea.** As per our theoretical outcome in Lemma 4.2, the dominant eigenvalue of 1 1 [1. Combining it]
1+ _𝛼_ _[𝑨]_ [ˆ] [is bounded by] 1+ _𝛼_ _[<]_

with Theorem 4.1 transforms Eq. (10) into an equivalent form:



0 _._ 8

0 _._ 4

0 _._ 2

0
0 1 2 4 6 8 10 15 20 30 50 70 90 100



1





**Figure 6: The OME** _𝜇𝐿,𝐿_ +1 **when varying** _𝐿_ **.**


**Algorithm.** Algorithm 2 displays the pseudo-code of FAAO. Similar

in spirit to the brute-force approach in Section 3.1, FAAO initializes
_𝜔𝑟_ as _𝑅_ [1] [for each relation type at Line 1, and iteratively updates]

_𝑯_ and { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [(Lines 3-12). The differences are as follows. Algo-]
rithm 2 takes as input additional parameters _𝑚, 𝐿_ and generates an

_𝑚_ -dimensional approximation _𝑬_ [˜] [(] _[𝑟]_ [)] of _𝑬_ [ˆ] [(] _[𝑟]_ [)] via CountSketch [11]

at Line 2 before entering the iterations. Moreover, in each iteration,

FAAO builds terms _𝑿_ [�] [(] _[ℓ]_ [)] = [�] 1+ _[𝛼]_ _𝛼_ - _ℓ_ _𝑨_ ˆ _ℓ_ _𝑿_ ∀0 ≤ _ℓ_ ≤ _𝐿_ using _𝐿_ rounds

of iterative sparse matrix multiplications (Lines 5-8), followed by

assembling them with _𝛼_ - _𝑿_ [(] _[𝐿]_ [)] into _𝑯_ as in Eq. (15) at Line 9.

[�]
On the basis of updated node feature vectors _𝑯_ and precomputed

{∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [}] _𝑟_ _[𝑅]_ =1 [,][ FAAO][ calculates matrix norm][ ∥] _[𝑯]_ [′⊤] _[𝑬]_ [˜] [(] _[𝑟]_ [)][ ∥][2] _𝐹_ [for each]
relation type and updates the estimated relation type weight _𝜔𝑟_ by


             -             - −2
_𝛽_          - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] [+] _[ 𝛼]_ [·] [∥] _[𝑯]_ [′⊤] _[𝑬]_ [˜] [(] _[𝑟]_ [)][ ∥] _𝐹_ [2]




- _ℓ_
_𝑨_ ˆ _[ℓ]_ _𝑿,_ (14)



1
_𝑯_ =
1 + _𝛼_



∞
∑︁


_ℓ_ =0




- 1

1 + _𝛼_



which remains the optimal solution to our conditional objective

function in Eq. (8) when RTWs are fixed. Although Eq. (14) offers

an iterative way of calculating _𝑯_, its exact computation requires

summing up an infinite series, which is infeasible.
Notice that _𝑨_ [ˆ] _[𝐿]_ can be interpreted as _𝐿_ -hop random walks over
G, wherein each entry _𝑨_ [ˆ] _𝑖,𝑗_ _[𝐿]_ [signifies the probability of a random]

walk originating from node _𝑣𝑖_ visiting node _𝑣_ _𝑗_ at the _𝐿_ -th hop.

Accordingly, the term [�] _ℓ_ [∞] =0 - 1+1 _𝛼_ - _ℓ_ _𝑨_ ˆ _ℓ_ in _𝑯_ can be perceived as

the total probabilities of random walks of various lengths, where

length- _ℓ_ random walks are weighted with - 1 - _ℓ_ . As such, one
1+ _𝛼_
potential solution to estimate _𝑯_ is to discard long random walks,

i.e., random walks beyond _𝐿_ ( _𝐿_ is a small integer) hops, as their

weights are lower.

Due to the _mixing time_ [42] of random walks on graphs, the _𝐿_  hop random walk probability _𝑨_ [ˆ] _𝑖,𝑗_ _[𝐿]_ [converges to an invariant value]

_𝑎𝑖,𝑗_ after a number of steps. Mathematically, the overall discrepancy

between ( _𝐿_ + 1)-hop and _𝐿_ -hop random walk probabilities ∥ _𝑨_ [ˆ] _[𝐿]_ [+][1] _𝑨_ ˆ _[𝐿]_ ∥2 can be proved to be equal to the ( _𝐿, 𝐿_ + 1)-OME _𝜇𝐿,𝐿_ +1:

∥ _𝑨_ [ˆ] _[𝐿]_ [+][1]            - _𝑨_ [ˆ] _[𝐿]_ ∥2 = _𝜇𝐿,𝐿_ +1 _._


As reported in Figure 6, ( _𝐿, 𝐿_ + 1)-OME of real MRGs _DBLP_ [112]
and _Yelp_ [77] dwindles to nearly zero when _𝐿_ is roughly 8, indicating that the convergence/mixing of _𝑨_ [ˆ] _[𝐿]_ can be achieved with

merely a handful of hops. Inspired by this, our idea is to compute
an approximate _𝑯_,



_𝜔𝑟_ =



(16)

- _𝑟𝑅_ =1 - _𝛽_ - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] [+] _[ 𝛼]_ [·] [∥] _[𝑯]_ [′⊤] _[𝑬]_ [˜] [(] _[𝑟]_ [)] [∥] _𝐹_ [2] - −2 _[.]_



**Correctness Analysis.** Denote by _𝑯_ [∗] the exact node feature vec
tors defined in Eq. (14). The following theorem establishes the

approximation guarantees of _𝑯_ obtained at Line 9 in Algorithm 2.



_𝛼_ _[ℓ]_ _ℓ_ _𝐿_
Theorem 4.4. ∥ _𝑯_ - _𝑯_ [∗] ∥ _𝐹_ ≤ [�] _ℓ_ [∞] = _𝐿_ +1 (1+ _𝛼_ ) _[ℓ]_ [+][1] ��� _𝑨_ ˆ - _𝑨_ ˆ ���2·∥ _𝑿_ ∥ _𝐹_ _,_



1+ _[𝛼]_ _𝛼_ - _𝐿_ +1 · ∥ _𝑿_ ∥ _𝐹_ - max _ℓ_ ≥1 _[𝜇][𝐿,𝐿]_ [+] _[ℓ]_ _[.]_



_which can be upper bounded by_ [�] 1+ _[𝛼]_



∞
∑︁


_ℓ_ = _𝐿_ +1




- _𝛼_

1 + _𝛼_




- _ℓ_ _𝑨_ ˆ _ℓ_ _𝑿_ + 1
1 + _𝛼_




- _ℓ_ _ℓ_ - _𝛼_ - _𝐿_ +1 _𝐿_
_𝑨_ ˆ _𝑿_ + _𝑨_ ˆ _𝑿,_ (15)
1 + _𝛼_




- _ℓ_ _𝑨_ ˆ _𝐿𝑿_



1
_𝑯_ ≈
1 + _𝛼_


1
=
1 + _𝛼_



_𝐿_
∑︁


_ℓ_ =0


_𝐿_
∑︁


_ℓ_ =0




- _𝛼_

1 + _𝛼_


- _𝛼_

1 + _𝛼_



Recall that in Figure 6, the empirical values of ( _𝐿, 𝐿_ + 1)-OME
are negligible when _𝐿_ is small, which implies that _𝑨_ [ˆ] _[𝐿]_ is close to
_𝑨_ ˆ _[𝐿]_ [+][1], and thus, _𝑨_ ˆ _[𝐿]_ [+] _[ℓ]_ for _ℓ_ _> 𝐿_ + 1, rendering approximation error
∥ _𝑯_ - _𝑯_ [∗] ∥ _𝐹_ = 0.
As for the relation type weights { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [in Eq.][ (][16][)][,][ FAAO][ har-]

nesses _𝑯_ ⊤ _𝑬_ ˜ ( _𝑟_ ) 2 - _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ �.
��� ��� _𝐹_ [as an approximation of][ trace]


Particularly, we can derive the following corollary using Theorem

11 in Ref. [11]:


Corollary 4.5. _Let_ _𝑸_ ∈ R _[𝑀]_ [×] _[𝑚]_ _be_ _a_ _count-sketch_ _matrix_ _and_
_𝑬_ ˜ [(] _[𝑟]_ [)] = _𝑬_ ˆ [(] _[𝑟]_ [)] _𝑸, where 𝑚_ = _𝑂_ ( _𝑟𝜖_ [−][4] log ( _𝑟_ / _𝜖𝛿_ ) · ( _𝑟_ + log (1/ _𝜖𝛿_ ))) _, 𝜖_ _is_

_an error threshold and 𝑟_ _is the rank of_ _𝑬_ [ˆ] [(] _[𝑟]_ [)] _. Then,_
_𝑯_ ⊤ _𝑬_ ˜ ( _𝑟_ ) 2 [(][1][ ±] _[ 𝜖]_ [)] [2] [·][ trace]    - _𝑯_ [⊤] ( _𝑰_    - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_    ��� ��� _𝐹_ [=]


_holds with a probability of at least_ 1 − _𝛿._


As empirically validated in Appendix D.4, a small _𝑚_ (e.g., 20)
leads to accurate approximation of _𝑬_ [ˆ] [(] _[𝑟]_ [)], ensuring excellent and

stable final clustering quality.


**Complexity Analysis.** Recall that the invocation of CountSketch

at Line 2 essentially computes _𝑬_ [ˆ] [(] _[𝑟]_ [)] R [⊤], where _𝑬_ [ˆ] [(] _[𝑟]_ [)] is the normalized oriented incidence matrix of E [(] _[𝑟]_ [)] with 2 _𝑀_ [(] _[𝑟]_ [)] non-zero entries



wherein the terms _𝑨_ [ˆ] _[ℓ]_ beyond _𝐿_ -th orders ( _ℓ_ ≥ _𝐿_ + 1) are estimated
using _𝑨_ [ˆ] _[𝐿]_ . In doing so, _𝑯_ can be efficiently calculated as _𝐿_ is merely

up to a few dozen in practice.


                          -                           
Lemma 4.3. _Let_ _𝑬_ [ˆ] [(] _[𝑟]_ [)] = _𝑫_ [(] _[𝑟]_ [)−] [1] 2 _𝑬_ [(] _[𝑟]_ [)] _._ trace _𝑯_ [⊤] ( _𝑰_  - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ =

∥ _𝑯_ [⊤] _𝑬_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [∀][1] [≤] _[𝑟]_ [≤] _[𝑅][.]_


On the other hand, Lemma 4.3 suggests that we can leverage
the matrix norm ∥ _𝑯_ [⊤] _𝑬_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [instead] [of] [the] [matrix] [trace] [for] [up-]
dating RTW _𝜔𝑟_ in Eq. (11) in _𝑂_ ( _𝑀_ [(] _[𝑟]_ [)] _𝑑_ ) time since the normalized
oriented incidence matrix _𝑬_ [ˆ] [(] _[𝑟]_ [)] contains 2 _𝑀_ [(] _[𝑟]_ [)] non-zero entries

and can be materialized in the preprocessing. This time cost can be
further reduced if a low-dimensional sparse matrix _𝑬_ [˜] [(] _[𝑟]_ [)] ∈ R _[𝑁]_ [×] _[𝑚]_

( _𝑚_ ≪ _𝑀_ [(] _[𝑟]_ [)] and nnz( _𝑬_ [˜] [(] _[𝑟]_ [)] ) ≪ _𝑀_ [(] _[𝑟]_ [)] ) can be created such that
∥ _𝑯_ [⊤] _𝑬_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [≈∥] _[𝑯]_ [⊤] _[𝑬]_ [˜] [(] _[𝑟]_ [)][ ∥][2] _𝐹_ [for estimating] _[ 𝜔][𝑟]_ [.]



7


Conference’17, July 2017, Washington, DC, USA Lin et al.



Stage II in


**Figure 7: Illustration of** **SSKC.**

(each column has two entries) and sketching matrix R ∈ R _[𝑚]_ [×] _[𝑀]_ [(] _[𝑟]_ [)]

( _𝑚_ ≪ _𝑀_ [(] _[𝑟]_ [)] ) solely has a single non-zero entry in each column.
The sparse matrix multiplication _𝑬_ [ˆ] [(] _[𝑟]_ [)] R [⊤] hence entails _𝑂_ ( _𝑀_ [(] _[𝑟]_ [)] )
time, summing up to _𝑂_ ( _𝑀_ ) time for all the _𝑅_ relation types. In

each iteration (Lines 4-11) of the alternative optimization, the dom
inant computational overhead lies in Lines 7 and 11. The former

costs _𝑂_ ( _𝑀𝑑_ ) time for each sparse matrix multiplication _𝑨_ [ˆ] _𝑿_ [�] [(] _[ℓ]_ [−][1][)],
and hence, _𝑂_ ( _𝑀𝐿𝑑_ ) time for _𝐿_ rounds, while the latter calculates
∥ _𝑯_ [⊤] _𝑬_ [˜] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [for updating each relation type weight] _[ 𝜔][𝑟]_ [, which needs]

_𝑁𝑑𝑚𝑅_ operations for all the _𝑅_ relation types. In short, the time cost
of each iteration for updating _𝑯_ and { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [is] _[ 𝑂]_ [(] _[𝑀𝐿𝑑]_ [+] _[ 𝑁𝑑𝑚𝑅]_ [)][.]

Given that _𝐿_, _𝑚_, and the number of iterations are at most a few

dozen in practice, and thus, can be considered as constants, the

overall time complexity of FAAO is _𝑂_ ( _𝑀𝑑_ + _𝑁𝑑𝑅_ ).

Algorithm 2 only needs incidence and adjacency matrices with

_𝑂_ ( _𝑀_ ) non-zero entries in total, sketched incidence matrix _𝑬_ [˜] [(] _[𝑟]_ [)] ∈

R _[𝑁]_ [×] _[𝑚]_, and _𝑁_ × _𝑑_ intermediate feature vectors _𝑿_ [(] _[ℓ]_ [)] and _𝑯_ in the

[�]
main memory. Consequently, its space cost is _𝑂_ ( _𝑀_ + _𝑁𝑑_ + _𝑁𝑚_ ),
which equals _𝑂_ ( _𝑀_ + _𝑁𝑑_ ) when _𝑚_ is regarded as a constant.
Let _𝑤𝑟_ [∗] be the new weight of the next iteration. Define **𝚫** as



**Algorithm 3:** SSKC Algorithm


**Input:** Node feature vectors _𝑯_ and the number _𝐾_ of clusters
**Output:** A set of _𝐾_ clusters {C1 _, . . .,_ C _𝐾_ }.

**1** Normalize _𝑯_ according to Eq.(13);

**2** _𝒁_ [◦] ← ORF( _𝑯_ );

**3** [←−] _𝒁_ ← _𝒁_ [◦] _,_ [−→] _𝒁_ ← _𝒁_ [◦] ;

**4** **do**

**5** v ← [←−] _𝒁_ - �−→ _𝒁_ ⊤ - 1�;

**6** ←− _𝒁_ ← diag(v) −1 · ←− _𝒁_ ;

       -        **7** v ← 1 [⊤] - [←−] _𝒁_ - [−→] _𝒁_ [⊤] ;



**8** −→ _𝒁_ ← diag(v) −1 · −→ _𝒁_ ;



**9** **until** [−→] _𝒁_ _converges_ ;



**10** Run _𝐾_ -Means over [−→] _𝒁_ to generate {C1 _, . . .,_ C _𝐾_ };



solve the NP-hard problem in Eq. (5), which takes _𝑂_ ( _𝑁_ [2] - ( _𝑑_ + _𝐾_ ))

time and is still prohibitively expensive. Our theoretical finding in

Theorem 4.6 pinpoints that the clustering objective is equivalent to

minimizing the _within-cluster sum of squares_ (WCSS) on a matrix
_𝒁_ ∈ R _[𝑁]_ [×] _[𝑧]_ that satisfies _𝒁𝒁_ [⊤] = _𝑺_ where _𝑺_ is _doubly stochastic_ . This
implies that the above spectral clustering over _𝑺_ can be further

transformed and simplified into a tractable task, i.e., running _𝐾_ 
Means over _𝒁_, if we make an adjustment to (a normalization) _𝑺_
and calculate _𝒁_ such that _𝒁𝒁_ [⊤] = _𝑺_ is doubly stochastic. Doing so

sidesteps the costly eigendecomposition, and hence, results in a

time cost of _𝑂_ ( _𝑁𝐾𝑧_ ), which is almost linear when _𝑧_ ≪ _𝑁_ .
To make _𝒁𝒁_ [⊤] = _𝑺_ doubly stochastic, a straightforward way is
to first materialize the affinity matrix _𝑺_ as in DEMM, apply a doubly
stochastic normalization of _𝑺_, and then decompose it into the product of _𝒁_ and its transpose, all of which, however, are rather costly.
Inspired by the _kernel tricks_ [55], the idea of SSKC is to eliminate
the need to explicitly materialize _𝑺_ via a mapping function _𝑓_ (·) on
_𝑯_ such that
_𝑺_ ≈ _𝑓_ ( _𝑯_ ) · _𝑓_ ( _𝑯_ ) [⊤] _,_


and _𝑓_ ( _𝑯_ ) can be used as _𝒁_ for subsequent _𝐾_ -Means clustering.
Since _𝑺_ is defined using a Gaussian kernel, such a mapping function _𝑓_ (·) can be derived via _random Fourier features_ (RFF) [72]. RFF

serves as an alternative to the Gaussian kernel, reducing the com
putational complexity of kernel methods from nonlinear to linear.

That is to say, RFF leverages the Bochner theorem [72] to map the

kernel function with _𝑓_ (·), which avoids computing Eq. (7) with
_𝑂_ ( _𝑁_ [2] ) computational complexity. Along this line, the next task is
to make _𝒁𝒁_ [⊤] doubly stochastic.


**Algorithm.** Figure 7 summarizes the core steps of SSKC. It first
constructs the mapping function _𝑓_ (·) and _𝒁_ [◦] = _𝑓_ ( _𝑯_ ), i.e., the
initial version of _𝒁_, using random Fourier features, followed by
a normalization of _𝒁_ [◦] into _𝒁_ for subsequent clustering, both of
which can be done in _𝑂_ ( _𝑁𝑑_ ) time.
In Algorithm 3, we present the details of SSKC. Initially, SSKC
leverages the _Orthogonal Random Features_ (ORF) technique [106]
as the mapping function _𝑓_ (·) to transform node feature vectors _𝑯_
to _𝒁_ [◦], an initial version of target _𝒁_, such that _𝒁_ [◦] _𝒁_ [◦⊤] ≈ _𝑺_ (Line 1).
More concretely, ORF first transforms _𝑯_ into _𝑯_ [˜] = _𝑯_ - _𝑸_ [⊤] _,_ using a



**𝚫** =



_𝑅_
∑︁

( _𝑤𝑟_ [∗] [−] _[𝑤][𝑟]_ [) ·] _[𝑨]_ [ˆ] [(] _[𝑟]_ [)] _[.]_ (17)

_𝑟_ =1



The new normalized adjacency matrix of the next iteration is

_𝑨_ ˆ [∗] = _𝑨_ ˆ + **𝚫** _._ (18)


**4.2** **Symmetric Sinkhorn-Knopp Clustering**

Theorem 4.6. _If 𝑺_ _is doubly stochastic and 𝑺_ = _𝒁𝒁_ [⊤] _, optimizing_
_Eq._ (5) _is equivalent to optimizing_ C1min _,...,_ C _𝐾_ - _𝑘𝐾_ =1 - _𝑣𝑖_ ∈C _𝑘_ [∥] _[𝒁]_ _𝑖_ [−] [c][(] _[𝑘]_ [)][ ∥][2] 2 _[,]_

_𝒁_ _𝑗_
_where_ c [(] _[𝑘]_ [)] = [�] _𝑣𝑗_ ∈C _𝑘_ | C _𝑘_ | _[stands for the center of cluster]_ [ C] _[𝑘]_ _[.]_


**Basic Idea.** As remarked in Figure 7, DEMM relies on a partial eigendecomposition of the _𝑁_ × _𝑁_ dense affinity matrix _𝑺_ to approximately



8


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



**v**



|Col1|0.17<br>0.17|0.160.17 0.14 0.18<br>0.170.18 0.14 0.18|Col4|Col5|Col6|
|---|---|---|---|---|---|
|0.16|0.17|0.17|0.18|0.14|0.18|
|0.17 <br>0.14|0.18 <br> 0.14|0.18<br> 0.14|0.28 <br>0.00|0.00 <br> 0.43|0.13<br> 0.07|


0.19 0.14 0.17



**Table 3: Statistics of Datasets.**


|1<br>4|2<br>5|3<br>6|
|---|---|---|
|7<br>1<br>0|8<br>0<br>1|9<br>1<br>0|
|2|2|2|


|0.01<br>0.01<br>0.02|0.02<br>0.02<br>0.02|0.03<br>0.02<br>0.02|
|---|---|---|
|<br>0.03 <br>0.00|<br>0.00 <br>0.06|<br> 0.03<br> 0.00|
|0.02|0.02|0 .02|


|1<br>4|Col2|Col3|
|---|---|---|
|7|8|9|
|1<br>0<br>|0<br>1<br>|1<br>0<br>|













0.18 0.18 0.18


**1**



**=1**










|1<br>4|2<br>5|3<br>6|
|---|---|---|
|7<br>1|8<br>0|9<br>1|
|0|1|0|
|2|2|2|


|1.45<br>2.38|2.9<br>2.98|4.35<br>3.57|
|---|---|---|
|2.63 <br>5.0|3.01 <br>0|3.38<br>5.0|
|0|7.69|0|
|3.03|3.03|3.03|







**Figure 8: A running example for the SK normalization.**


uniformly distributed random orthogonal matrix _𝑸_ ∈ R _[𝑑]_ [×] _[𝑑]_, and
then constructs _𝒁_ [◦] by


1
_𝒁_ [◦] = ~~√~~       - (sin( _𝑯_ [˜] ) ∥ cos( _𝑯_ [˜] )) _,_


_𝑑_


where ∥ denotes the horizontal concatenation operator for matri
ces. It is worth mentioning that the resulting feature dimension
_𝑧_ of _𝒁_ [◦] is 2 _𝑑_ and _𝑑_ ≪ _𝑁_ . Subsequently, SSKC begins the doubly
stochastic normalization of _𝒁_ [◦] _𝒁_ [◦⊤] . We introduce _Sinkhorn-Knopp_
_algorithm_ [79] (SK), which obtains a doubly stochastic matrix by

iteratively normalizing the rows and columns of the affinity matrix
_𝒁𝒁_ [⊤] . Instead of simply employing the SK that requires materializing _𝒁_ [◦] _𝒁_ [◦⊤] for normalization, Algorithm 3 initializes [←−] _𝒁_ and [−→] _𝒁_
as _𝒁_ [◦] at Line 2 and iteratively normalizes them alternately (Lines
3-8), thereby enforcing [←−] _𝒁_ [−→] _𝒁_ [⊤] bistochastic. Particularly, in each iteration, SSKC computes the row sum vector v of [←−] _𝒁_ [−→] _𝒁_ [⊤] using a trick
reordering the matrix multiplication as [←−] _𝒁_ - �−→ _𝒁_ ⊤ - 1� for higher

efficiency, followed by normalizing each row [←−] _𝒁_ by diag(v) [−][1] - [←−] _𝒁_
(Lines 4-5). In the same vein, [−→] _𝒁_ is normalized by the column sum
vector of [←−] _𝒁_ [−→] _𝒁_ [⊤] (Lines 6-7). As such, at the end of each iteration, a
symmetric normalization of rows and columns is imposed on [←−] _𝒁_ [−→] _𝒁_ [⊤] .
The following theorem indicates that [←−] _𝒁_ [−→] _𝒁_ [⊤] is doubly stochastic
with sufficient iterations and [←−] _𝒁_ = [−→] _𝒁_ = _𝑓_ ( _𝑯_ ).

Theorem 4.7. [←−] _𝒁_ [−→] _𝒁_ [⊤] _is doubly stochastic and_ [←−] _𝒁_ = [−→] _𝒁_ _._

Finally, Algorithm 3 applies the _𝐾_ -Means over [−→] _𝒁_ and generates
clusters {C1 _,_ C2 _, . . .,_ C _𝐾_ }.


_Example_ _4.8._ Figure 8 exemplifies how SSKC leverages the SK
normalization to achieve _𝑺_ = _𝒁𝒁_ [⊤] . Given a 6 × 3 feature matrix _𝒁_ [◦] output by ORF (see example in Appendix C.3), we initialize [←−] _𝒁_ = [−→] _𝒁_ = _𝒁_ [◦] . In the first iteration, SK calculates the sum of
entries in each row of [←−] _𝒁_ [−→] _𝒁_ [⊤], yielding a vector v with six rows

[114 _,_ 276 _,_ 438 _,_ 36 _,_ 18 _,_ 108] [⊤] . Afterwards, six rows in [←−] _𝒁_ are normalized by dividing their respective entries in v, e.g., [1 _,_ 2 _,_ 3]/114 =

[0 _._ 01 _,_ 0 _._ 02 _,_ 0 _._ 03]. Based on the updated [←−] _𝒁_, we start to normalize [−→] _𝒁_ .
SK then calculates the sum of entries in each column of [←−] _𝒁_ [−→] _𝒁_ [⊤], leading to a new length-6 vector v = [0 _._ 69 _,_ 1 _._ 68 _,_ 2 _._ 66 _,_ 0 _._ 2 _,_ 0 _._ 13 _,,_ 0 _._ 66] [⊤] .
−→
_𝒁_ is subsequently updated by dividing each row by its respective
entry in the new v. By repeating the above alternate procedure



|Dataset<br>ACM|𝑁<br>3K|Relation Types<br>Paper-Subject-Paper|𝑀<br>2.2M|𝐷<br>1,870|𝐾<br>3|
|---|---|---|---|---|---|
|_DBLP_|4K|Paper-Author-Paper<br>Author-Paper-Author<br>Author-Paper-Venue-Paper-Author<br>Author-Paper-Term-Paper-Author|29.3K<br>11.1K<br>5M<br>6.8M|334|4|
|_ACM2_|4K|Paper-Subject-Paper<br>Paper-Author-Paper<br>Business-User-Business|4.3M<br>58K<br>528.3K|1,902|3|
|_Yelp_|2.6K|Business-Rating-Business<br>Business-Service-Business|1.5M<br>2.5M|82|3|
|_IMDB_|3.6K|Movie-Actor-Movie<br>Movie-Director-Movie|66.4K<br>13.8K|2,000|3|
|_Protein_|18.8K|Protein-Protein<br>Protein-Gene-Protein<br>Protein-Disease-Protein|2.0M<br>18.9K<br>60.1K|1280|6|
|_Amazon_|11.9K|User-Product-User<br>User-Star-User<br>User-Review-User|363.2K<br>7.1M<br>2.1M|25|2|
|_MAG_|113.9K|Paper-Paper<br>Paper-Author-Paper|1.8M<br>10.1M|128|4|
|_OAG-ENG_|370.6K|Paper-Field-Paper<br>Paper-Author-Paper<br>Paper-Paper|14.6M<br>455.7K<br>2.1M|768|20|
|_OAG-CS_|546.7K|Paper-Field-Paper<br>Paper-Author-Paper<br>Paper-Paper|53.9M<br>1.6M<br>11.7M|768|20|
|_RCDD_|11.9M|Item-b-Item<br>Item-f-Item|421.1M<br>353.7M|256|2|


sufficiently, we can finally obtain [←−] _𝒁_ = [−→] _𝒁_ such that the entries
in each row and column of _𝑺_ = [←−] _𝒁_ [−→] _𝒁_ [⊤] sum up to 1 _._ 0, i.e., doubly

stochastic. As such, the clusters can be obtained by simply running
_𝐾_ -means over row vectors of [←−] _𝒁_ or [−→] _𝒁_ .


**Complexity Analysis.** According to [106], _𝒁_ [◦] can be obtained in

_𝑂_ ( _𝑁𝑑_ [2] ) time. By reordering the matrix multiplications as in Lines
5 and 7, v can be calculated using _𝑂_ ( _𝑁𝑑_ ) time. Since the normaliza
tions at Lines 6 and 8 involve _𝑁𝑑_ operations, each iteration (Lines

5-8) then takes _𝑂_ ( _𝑁𝑑_ ) time. Recall that _𝐾_ -Means runs in _𝑂_ ( _𝑁𝐾_ )
time per iteration. In sum, the total time cost of SSKC is bounded
by _𝑂_ ( _𝑁𝑑_ [2] + _𝑁𝐾_ ) when the numbers of iterations are considered
as constants. Its space cost is _𝑂_ ( _𝑁𝑑_ ) since _𝑯_ and _𝒁_ [◦] contain _𝑁𝑑_

and 2 _𝑁𝑑_ entries, respectively.


**5** **Experiments**


This section experimentally evaluates DEMM, DEMM+, and DEMM-NA

against 20 competitors regarding clustering quality and efficiency

on 9 real MRGs of varied volumes. All experiments are conducted

on a Linux machine with an NVIDIA Ampere A100 GPU (80 GB

memory), AMD EPYC 7513 CPUs (2.6 GHz), and 1TB RAM. The

codes of all algorithms are collected from their respective authors,

and all are implemented in Python, except LMVSC and MCGC. For

[reproducibility, the source code and datasets are available at https:](https://github.com/HKBU-LAGAS/DEMM)

[//github.com/HKBU-LAGAS/DEMM.](https://github.com/HKBU-LAGAS/DEMM)


**5.1** **Experimental Setup**


**Datasets.** We experiment with 11 benchmark MRG datasets of

varied volumes and types, whose statistics are presented in Table 3.

Amid them, _ACM_ [20], _ACM2_ [24], _DBLP_ [112], _MAG_ [33], _OAG-CS_,
and _OAG-ENG_ [109] are academic citation networks; _Yelp_ [77] and
_Amazon_ [67] are e-commerce review networks; _IMDB_ [93]is a movie











9


Conference’17, July 2017, Washington, DC, USA Lin et al.



review network; _RCDD_ [56] is risk commodity detection network;
and _Protein_ [27] is a biological network.


**Baselines and Parameters.** For a comprehensive evaluation, we

include 20 competing methods in the experiments, which can be

categorized into four types:


- MRGC: DMGI [66], MvAGC [51], MGDCR [59], BTGF [70], DuaLGR [53],
BMGC [75], and DMG [60];

- Multi-view graph clustering: MCGC [64], MMGC [82], and LMVSC [36];

- Attributed graph clustering: Dink-Net [56], DMoN [87], S3GC [17],
and S [2] CAG [50];

- Attribute-less graph clustering: LeadEigvec [61], SpecClust [88],
LabelProg [71], Louvain [4], node2vec [26], DeepWalk [69].


In attributed and attribute-less graph clustering baselines, we input

the single-relational graph converted from the MRG with equal

weights. For multi-view graph clustering methods, we use the same

parameters as in FAAO to generate the feature matrix for each relation type. The number of iterations in DEMM, DEMM+, and DEMM-NA is

fixed to 10 due to the rapid convergence. For a fair comparison, we

run grid searches on the parameters and report the best clustering

performance attained by each evaluated method. Table 4 summa
rizes the categories, complexities, objectives, and backbone models

of the main competitors and our methods.

|Col1|Table 4: Summary of evaluated method.|
|---|---|
||**Category**<br>**Complexity**<br>**Objective**<br>**Backbone**|
|DMG<br>DuaLGR<br>MGDCR<br>DMGI<br>MvAGC<br>MGDCR<br>BTGF<br>BMGC<br>MCGC<br>LMVSC<br>MMGC<br>DMoN<br>Dink-Net<br>S3GC<br>S2AGC|MRGC (MVE)<br>_𝑂_(_𝑅𝑁𝑑_+_ 𝑀𝑑_)<br>Reconstruction<br>GNN<br>MRGC (MRS)<br>_𝑂_(_𝑅𝑁_2)<br>Reconstruction<br>GNN<br>MRGC (MVE)<br>_𝑂_(_𝑅_2_𝑁𝑑_2 +_ 𝑀𝑑_)<br>Mutual Info. Max.<br>GNN<br>MRGC (MRS)<br>_𝑂_(_𝑅𝑁𝑑_2 +_ 𝑀𝑑_)<br>Modularity Max.<br>GNN<br>MRGC(MRS)<br>_𝑂_(_𝑁𝑑_2)<br>Subspace Clustering<br>-<br>MRGC(MVE)<br>_𝑂_(_𝑀𝑁_+_ 𝑁𝐾_2)<br>Subspace Clustering<br>-<br>MRGC(MVE)<br>_𝑂_(_𝑁_2_𝑑_+_ 𝑀_2_𝑁𝑑_2)<br>Reconstruction<br>GNN<br>MRGC(MVE)<br>_𝑂_(_𝑀𝑁_2 +_ 𝑀𝑁𝑑_)<br>Contrastive<br>GNN<br>MVGC<br>_𝑂_(_𝑀𝑁_2(_𝑑_+_ 𝐾_))<br>Contrastive<br>-<br>MVGC<br>_𝑂_(_𝑀𝑁_+_ 𝑁𝐾_2)<br>Subspace Clustering<br>-<br>MVGC<br>_𝑂_(_𝑀𝑁_2_𝐾_+_ 𝑀𝑁𝐾_)<br>Subspace Clustering<br>-<br>AGC<br>_𝑂_(_𝑁𝑑_2 +_ 𝑀𝑑_)<br>Contrastive<br>GNN<br>AGC<br>_𝑂_(_𝑁𝑑𝐾_+_ 𝑑𝐾_2)<br>Adversarial<br>GNN<br>AGC<br>_𝑂_(_𝑁𝑑_2)<br>Contrastive<br>GNN<br>AGC<br>_𝑂_(_𝑁𝐾𝑑_)<br>Subspace Clustering<br>-|
|DEMM<br>DEMM+|MRGC<br>_𝑂_(_𝑀𝑁_+_ 𝑁𝑑_(_𝑁_+_ 𝑑𝑅_))<br>MRDE<br>-<br>MRGC<br>_𝑂_(_𝑁𝑑_2 +_ 𝑀𝑑_)<br>MRDE<br>-|



**Evaluation Protocol.** Following previous works [3, 7], we adopt
three classic metrics _clustering accuracy_ (ACC), _Normalized Mutual_
_Information_ (NMI), _Adjusted Rand Index_ (ARI) to assess the quality of

output clusters. All of them are calculated against the ground-truth

cluster labels, and higher values indicate better quality. Particularly,

ACC and NMI scores range from 0 to 1 _._ 0, whereas ARI falls in the

range of [−0 _._ 5 _,_ 1 _._ 0].

For the interest of space, we refer interested readers to Appen
dix D for more details regarding datasets, baselines, parameters,

and evaluation metrics.


**5.2** **Clustering Quality Evaluation**


This set of experiments studies the clustering quality attained by

DEMM, DEMM+, DEMM-NA, and 20 competitors on all 9 MRG datasets.


|Col1|★|Col3|Col4|
|---|---|---|---|
||_★_|||
||_★_|||


|Col1|★|Col3|Col4|
|---|---|---|---|
||_★_|||


|ime|e (sec)|Col3|
|---|---|---|
||_★_|_★_|
||||


|ime (sec)|Col2|Col3|
|---|---|---|
|_★_|_★_|_★_|
||||



**Figure 10: Efficiency analysis of** **DEMM and DEMM+.**


Tables 5 and 6 report the ACC, NMI and ARI scores of all evalu
ated methods on small and large MRGs, respectively. Each table

is divided into two parts, where the top part compares DEMM-NA

against attribute-less graph clustering baselines by discarding the

attributes of all datasets. The best results are highlighted in blue,

and the best baselines are underlined.

From the tables, we can make the following observations. Firstly,

DEMM+ consistently and considerably outperforms the best baselines
in almost all cases. Particularly, on the large datasets, DEMM+ is able

to achieve significant gains of 16 _._ 6%, 17 _._ 3%, and 11 _._ 0% in ACC,



BMGC DuaLGR MGDCR S [2] CAG


BTGF MCGC LMVSC MvAGC


DMG DMGI DEMM+



_time_ (sec)



_time_ (sec)



10 [3]

10 [2]


10


1


0 _._ 1


10 [3]

10 [2]


10


1


0 _._ 1



**(a)** _**ACM**_


_time_ (sec)


**(d)** _**Yelp**_



**(b)** _**DBLP**_


**(e)** _**IMDB**_


**(h)** _**OAG-ENG**_



10 [4]

10 [3]

10 [2]


10


1


10 [4]


10 [3]


10 [2]







10 [3]

10 [2]


10


1


0 _._ 1



10 [3]

10 [2]


10


1


0 _._ 1


10 [3]

10 [2]


10


1


0 _._ 1


10 [4]


10 [3]


10 [2]


10



_time_ (sec)


**(c)** _**ACM2**_


_time_ (sec)


**(f)** _**MAG**_


_time_ (sec)



**(i)** _**RCDD**_





_time_ (sec)


10 [3]


10 [2]


10


**(g)** _**OAG-CS**_





**Figure 9: Computational efficiency comparison. (best base-**
**lines in Tables 5 and 6 are marked with** _★_ **)**


DEMM DEMM+



_time_ (sec)


1


0 _._ 1


0 _._ 01

Stage I Stage II Overall


**(a)** _**ACM2**_


_time_ (sec)

10


1


0 _._ 1

Stage I Stage II Overall


**(c)** _**IMDB**_



_time_ (sec)


1


0 _._ 1


0 _._ 01

Stage I Stage II Overall


**(b)** _**Yelp**_


10 [3]


10


0 _._ 1

Stage I Stage II Overall


**(d)** _**MAG**_



10


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA


**Table 5: Clustering quality on small MRGs (best is highlighted in blue and best baseline underlined).**

|Method|ACM|DBLP|ACM2|Yelp|IMDB|
|---|---|---|---|---|---|
|**Method**|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|
|w/o attributes<br>node2vec [26]<br>DeepWalk [69]<br>LeadEigvec [61]<br>LabelProg [71]<br>Louvain [4]<br>SpecClust [88]<br>Improv.<br>DEMM-NA|60_._8<br>40_._7<br>32_._1<br>61_._4<br>34_._9<br>31_._6<br>35_._2<br>0_._7<br>0_._0<br>57_._1<br>40_._3<br>39_._4<br>55_._3<br>40_._1<br>36_._4<br>35_._3<br>0_._4<br>0_._0|28_._5<br>0_._4<br>0_._3<br>75_._9<br>60_._4<br>55_._7<br>79_._3<br>66_._1<br>65_._7<br>29_._5<br>0_._0<br>0_._0<br>79_._3<br>67_._6<br>66_._1<br>91_._6<br>76_._7<br>80_._3|65_._1<br>39_._7<br>31_._5<br>56_._5<br>21_._1<br>15_._9<br>49_._5<br>0_._2<br>−0_._1<br>63_._2<br>40_._6<br>35_._0<br>60_._7<br>39_._3<br>34_._8<br>70_._3<br>51_._1<br>41_._0|35_._7<br>0_._2<br>0_._1<br>51_._7<br>14_._4<br>13_._5<br>66_._0<br>29_._7<br>35_._6<br>41_._4<br>0_._0<br>0_._0<br>60_._6<br>36_._6<br>40_._9<br>65_._2<br>37_._5<br>41_._4|35_._4<br>0_._3<br>0_._2<br>36_._2<br>0_._2<br>0_._1<br>36_._3<br>6_._8<br>0_._0<br>11_._3<br>10_._9<br>0_._6<br>13_._3<br>4_._9<br>1_._1<br>37_._9<br>0_._3<br>0_._0|
|w/o attributes<br>node2vec [26]<br>DeepWalk [69]<br>LeadEigvec [61]<br>LabelProg [71]<br>Louvain [4]<br>SpecClust [88]<br>Improv.<br>DEMM-NA|+6_._4<br>+4_._0<br>+3_._1<br>68_._0<br>44_._7<br>42_._5|+0_._6<br>+0_._9<br>+1_._7<br>92_._2<br>77_._6<br>82_._0|+2_._7<br>-9_._8<br>+1_._6<br>73_._0<br>41_._3<br>42_._6|+2_._5<br>-2_._2<br>-3_._7<br>68_._5<br>35_._3<br>37_._7|+0_._9<br>-10_._5<br>-1_._1<br>38_._8<br>0_._4<br>0_._0|
|w/ attributes<br>S3GC [17]<br>DMoN [87]<br>Dink-Net [56]<br>S2CAG [50]<br>DMGI [66]<br>LMVSC [36]<br>MvAGC [51]<br>MCGC [64]<br>MMGC [82]<br>MGDCR [59]<br>BTGF [70]<br>DuaLGR [53]<br>DMG [60]<br>BMGC [75]<br>DEMM<br>Improv.<br>DEMM+<br>Improv.|66_._7<br>41_._9<br>44_._7<br>70_._7<br>45_._6<br>49_._5<br>72_._3<br>49_._2<br>46_._1<br>88_._6<br>65<br>69_._5<br>84_._8<br>59_._6<br>61_._5<br>91_._6<br>72_._5<br>76_._7<br>89_._8<br>67_._4<br>72_._1<br>91_._5<br>71_._3<br>76_._3<br>86_._6<br>58_._1<br>64_._5<br>91_._9<br>72_._1<br>65_._1<br>93_._2<br>75_._8<br>80_._9<br>92_._7<br>73_._2<br>79_._4<br>93_._0<br>73_._6<br>80_._3<br>93_._0<br>75_._7<br>80_._4|54_._1<br>38<br>20_._3<br>80_._6<br>54_._6<br>60_._2<br>90_._6<br>74_._9<br>77_._4<br>83_._1<br>58_._1<br>63_._2<br>89_._0<br>68_._5<br>74_._5<br>70_._1<br>46_._6<br>39_._9<br>92_._8<br>77_._3<br>82_._8<br>92_._9<br>77_._5<br>83_._0<br>65_._8<br>29_._4<br>58_._5<br>91_._9<br>75_._9<br>80_._7<br>83_._1<br>62_._4<br>59_._7<br>92_._4<br>75_._5<br>81_._7<br>93_._4<br>79_._1<br>83_._3<br>93_._4<br>78_._3<br>84_._0|64_._2<br>50_._9<br>46_._6<br>69_._7<br>38_._7<br>37_._6<br>76_._9<br>48_._2<br>47_._8<br>80_._9<br>55_._2<br>55_._2<br>76_._0<br>46_._5<br>40_._0<br>89_._5<br>64_._5<br>70_._1<br>49_._6<br>0_._1<br>0_._0<br>70_._1<br>45_._8<br>36_._5<br>82_._3<br>48_._4<br>53_._1<br>66_._4<br>54_._3<br>50_._3<br>88_._3<br>64_._2<br>67_._6<br>87_._3<br>61_._3<br>64_._8<br>87_._9<br>67_._3<br>63_._4<br>91_._3<br>72_._0<br>74_._2|66_._5<br>41_._7<br>44_._3<br>75_._3<br>51_._5<br>52_._2<br>71_._8<br>42_._6<br>46_._1<br>87_._0<br>59_._9<br>64<br>69_._2<br>37_._3<br>39_._2<br>85_._7<br>58_._6<br>58_._4<br>74_._4<br>38_._7<br>40_._7<br>56_._6<br>20_._9<br>8_._8<br>54_._9<br>28_._0<br>55_._7<br>71_._6<br>38_._9<br>42_._6<br>73_._2<br>44_._2<br>45_._4<br>88_._1<br>63_._4<br>65_._0<br>56_._1<br>42_._6<br>39_._1<br>91_._5<br>71_._7<br>73_._8|44_._7<br>5_._5<br>5_._8<br>49_._4<br>12<br>9_._7<br>51_._2<br>10_._6<br>12_._5<br>53_._9<br>18_._0<br>18_._9<br>58_._5<br>19_._0<br>18_._9<br>51_._9<br>11_._9<br>12_._3<br>56_._3<br>3_._7<br>9_._7<br>61_._8<br>11_._5<br>18_._1<br>45_._2<br>19_._5<br>20_._1<br>56_._3<br>21_._2<br>19_._5<br>66_._8<br>22_._6<br>25_._7<br>52_._4<br>16_._0<br>14_._5<br>48_._3<br>11_._3<br>14_._5<br>51_._0<br>14_._3<br>14_._4|
|w/ attributes<br>S3GC [17]<br>DMoN [87]<br>Dink-Net [56]<br>S2CAG [50]<br>DMGI [66]<br>LMVSC [36]<br>MvAGC [51]<br>MCGC [64]<br>MMGC [82]<br>MGDCR [59]<br>BTGF [70]<br>DuaLGR [53]<br>DMG [60]<br>BMGC [75]<br>DEMM<br>Improv.<br>DEMM+<br>Improv.|93_._2<br>75_._6<br>80_._7<br>0_._0<br>-0_._2<br>-0_._2<br>93_._6<br>77_._2<br>81_._9<br>+0_._4<br>+1_._4<br>+1_._0|92_._6<br>76_._5<br>82_._1<br>-0_._8<br>-2_._6<br>-1_._9<br>93_._7<br>79_._6<br>84_._8<br>+0_._3<br>+0_._5<br>+0_._8|90_._8<br>70_._1<br>73_._2<br>-0_._5<br>-1_._9<br>-1_._0<br>91_._3<br>71_._2<br>74_._7<br>+0_._0<br>-0_._8<br>+0_._5|91_._7<br>69_._7<br>74_._7<br>+0_._2<br>-2_._0<br>+0_._9<br>92_._7<br>72_._6<br>77_._7<br>+1_._2<br>+1_._3<br>+3_._9|68_._5<br>25_._0<br>28_._1<br>+1_._7<br>+2_._4<br>+2_._4<br>67_._6<br>24_._4<br>26_._5<br>+0_._8<br>+1_._8<br>+0_._8|



**Table 6: Clustering quality on large MRGs (best is highlighted in blue and best baseline underlined).**

|Method|Protein|Amazon|MAG|OAG-ENG|OAG-CS|RCDD|
|---|---|---|---|---|---|---|
|**Method**|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|
|w/o attributes<br>node2vec [26]<br>DeepWalk [69]<br>LeadEigvec [61]<br>LabelProg [71]<br>Louvain [4]<br>SpecClust [88]<br>Improv.<br>DEMM-NA|27_._1<br>4_._9<br>2_._7<br>33_._5<br>4_._7<br>2_._5<br>32_._4<br>0_._3<br>−0_._1<br>31_._5<br>5_._5<br>0_._3<br>32_._6<br>11_._4<br>4_._6<br>35_._6<br>5_._8<br>2_._8|57_._2<br>3_._0<br>−2_._8<br>60_._2<br>1_._5<br>2_._0<br>61_._4<br>0_._7<br>−1_._9<br>91_._4<br>1_._2<br>4_._2<br>40_._1<br>0_._5<br>0_._2<br>76_._3<br>1_._6<br>−5_._6|52_._1<br>31_._8<br>19_._1<br>49_._9<br>35_._6<br>30_._1<br>27_._1<br>2_._1<br>0_._0<br>15_._7<br>24_._5<br>12_._6<br>40_._8<br>37_._5<br>28_._6<br>27_._2<br>0_._1<br>0_._0|19_._7<br>18_._4<br>2_._1<br>9_._1<br>3_._0<br>1_._1<br>7_._3<br>14_._8<br>0_._2<br>11_._4<br>36_._8<br>5_._5<br>23_._2<br>30_._0<br>10_._6<br>7_._5<br>0_._6<br>0_._0|19_._5<br>11_._8<br>6_._5<br>18_._3<br>12_._2<br>6_._1<br>9_._8<br>1_._7<br>0_._0<br>17_._0<br>19_._4<br>5_._3<br>18_._2<br>13_._7<br>5_._6<br>9_._8<br>0_._1<br>0_._0|50_._3<br>0_._0<br>0_._0<br>54_._7<br>0_._0<br>0_._2<br>−<br>−<br>−<br>4_._3<br>4_._9<br>0_._1<br>4_._1<br>4_._6<br>0_._1<br>−<br>−<br>−|
|w/o attributes<br>node2vec [26]<br>DeepWalk [69]<br>LeadEigvec [61]<br>LabelProg [71]<br>Louvain [4]<br>SpecClust [88]<br>Improv.<br>DEMM-NA|-3_._2<br>-9_._5<br>-4_._6<br>32_._3<br>1_._9<br>0_._0|+0_._2<br>+1_._4<br>+11_._2<br>91_._6<br>4_._4<br>15_._4|+11_._5<br>+24_._8<br>+21_._2<br>63_._6<br>62_._3<br>51_._3|+2_._8<br>-14_._7<br>-0_._3<br>26_._0<br>22_._1<br>10_._3|+9_._0<br>+18_._9<br>+10_._7<br>28_._5<br>38_._3<br>17_._2|-2_._6<br>-4_._9<br>-0_._2<br>52_._1<br>0_._0<br>0_._0|
|w/ attributes<br>S3GC [17]<br>DMoN [87]<br>Dink-Net [56]<br>S2CAG [50]<br>DMGI [66]<br>LMVSC [36]<br>MvAGC [51]<br>MGDCR [59]<br>DMG [60]<br>BMGC [75]<br>DEMM<br>Improv.<br>DEMM+<br>Improv.|37_._7<br>15_._5<br>9_._7<br>38_._0<br>6_._9<br>5_._5<br>33_._1<br>8_._7<br>4_._5<br>22_._8<br>1_._4<br>0_._6<br>23_._4<br>2_._1<br>0_._9<br>29_._6<br>3_._7<br>0_._0<br>35_._1<br>11_._5<br>8_._8<br>29_._1<br>0_._3<br>0_._0<br>32_._2<br>0_._2<br>0_._1<br>37_._5<br>17_._3<br>10_._3|87_._3<br>10_._3<br>2_._6<br>44_._5<br>5_._8<br>6_._7<br>76_._8<br>2_._3<br>2_._1<br>63_._7<br>1_._4<br>3_._6<br>56_._0<br>3_._8<br>1_._3<br>63_._7<br>0_._0<br>0_._0<br>75_._1<br>8_._8<br>14_._6<br>81_._6<br>2_._6<br>0_._0<br>90_._9<br>1_._4<br>7_._6<br>77_._5<br>0_._4<br>1_._8|64_._5<br>61_._5<br>51_._5<br>55_._8<br>43_._5<br>53_._7<br>64_._8<br>61_._7<br>49_._6<br>66_._7<br>62_._5<br>53_._5<br>29_._1<br>0_._7<br>1_._0<br>41_._7<br>19_._5<br>13_._1<br>54_._0<br>32_._7<br>27_._7<br>61_._4<br>54_._5<br>44_._0<br>55_._3<br>43_._1<br>34_._9<br>65_._3<br>57_._0<br>47_._8|5_._6<br>3_._7<br>3_._4<br>13_._0<br>8_._4<br>3_._9<br>−<br>−<br>−<br>6_._9<br>0_._1<br>0_._0<br>8_._2<br>1_._8<br>0_._6<br>18_._6<br>16_._4<br>9_._5<br>12_._2<br>5_._4<br>2_._0<br>25_._7<br>21_._0<br>13_._8<br>25_._2<br>24_._5<br>10_._9<br>16_._5<br>14_._3<br>4_._9|35_._4<br>38_._5<br>21_._4<br>11_._1<br>8_._5<br>6_._0<br>−<br>−<br>−<br>6_._8<br>0_._1<br>0_._0<br>9_._8<br>4_._7<br>1_._3<br>19_._3<br>14_._2<br>5_._7<br>10_._9<br>4_._4<br>1_._6<br>25_._3<br>25_._9<br>16_._8<br>25_._9<br>28_._3<br>13_._9<br>16_._5<br>16_._5<br>14_._3|−<br>−<br>−<br>−<br>−<br>−<br>−<br>−<br>−<br>69_._3<br>13_._2<br>16_._9<br>67_._7<br>2_._6<br>4_._2<br>69_._9<br>1_._6<br>1_._9<br>75_._1<br>4_._2<br>11_._3<br>−<br>−<br>−<br>−<br>−<br>−<br>−<br>−<br>−|
|w/ attributes<br>S3GC [17]<br>DMoN [87]<br>Dink-Net [56]<br>S2CAG [50]<br>DMGI [66]<br>LMVSC [36]<br>MvAGC [51]<br>MGDCR [59]<br>DMG [60]<br>BMGC [75]<br>DEMM<br>Improv.<br>DEMM+<br>Improv.|38_._9<br>14_._1<br>8_._2<br>+0_._9<br>-3_._2<br>-2_._1<br>39_._2<br>19_._4<br>12_._8<br>+1_._2<br>+2_._1<br>+2_._5|91_._2<br>14_._3<br>32_._4<br>+0_._3<br>+4_._0<br>+17_._8<br>92_._6<br>15_._7<br>34_._2<br>+1_._5<br>+5_._4<br>+19_._6|68_._0<br>64_._4<br>52_._6<br>+1_._3<br>+1_._9<br>-1_._1<br>67_._8<br>63_._3<br>52_._3<br>+1_._1<br>+0_._8<br>-1_._4|−<br>−<br>−<br>−<br>−<br>−<br>42_._3<br>41_._8<br>24_._8<br>+16_._6<br>+17_._3<br>+11_._0|−<br>−<br>−<br>−<br>−<br>−<br>40_._1<br>42_._7<br>24_._1<br>+4_._7<br>+4_._2<br>+2_._7|−<br>−<br>−<br>−<br>−<br>−<br>83_._4<br>18_._6<br>29_._0<br>+8_._3<br>+5_._4<br>+12_._1|



**Table 7: Ablation studies on small MRGs.**


|Method|ACM|DBLP|ACM2|Yelp|IMDB|
|---|---|---|---|---|---|
|**Method**|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|
|w/o {_𝜔𝑟_}_𝑅_<br>_𝑟_=1<br>w/o_ 𝛼_· b_𝑿_<br>(_𝐿_)<br>w/o Lreg|92_._5<br>73_._1<br>78_._8<br>93_._4<br>76_._6<br>81_._3<br>92_._9<br>75_._8<br>80_._1|93_._3<br>78_._2<br>83_._7<br>92_._9<br>76_._9<br>82_._8<br>91_._6<br>73_._5<br>79_._7|90_._8<br>68_._6<br>73_._5<br>91_._3<br>70_._2<br>74_._7<br>90_._0<br>69_._4<br>71_._0|92_._4<br>71_._6<br>76_._8<br>92_._3<br>71_._5<br>76_._4<br>92_._0<br>71_._6<br>75_._5|66_._8<br>23_._5<br>25_._6<br>67_._0<br>24_._1<br>24_._4<br>67_._4<br>24_._3<br>26_._2|
|DEMM+|93_._6<br>77_._2<br>81_._9|93_._7<br>79_._6<br>84_._8|91_._3<br>71_._2<br>74_._7|92_._7<br>72_._6<br>77_._7|67_._6<br>24_._4<br>26_._5|



NMI, and ARI on _OAG-ENG_ and remarkable improvements of 8 _._ 3%,
5 _._ 4%, and 12 _._ 1% on _RCDD_, respectively. On medium-sized datasets
_Protein_ and _Amazon_, DEMM+ also outperforms all baselines, yielding

notable gains of 1 _._ 2%, 2 _._ 1%, 2 _._ 5%, and 1 _._ 7%, 5 _._ 4%, and 19 _._ 6% in ACC,

NMI and ARI, respectively. In addition, it can be observed that

DEMM is comparable to DEMM+ on most small MRGs but slightly



better on _IMDB_ and _MAG_ . On larger datasets, DEMM fails to report

results due to the quadratic complexity analyzed in Section 3.3.

The superiority of DEMM and DEMM+ over MRGC, attributed graph

clustering, and multi-view graph clustering baselines substantiates

the effectiveness of our proposed two-stage objectives based on

MRDE and DE in fusing multi-relational graph structures.



11


Conference’17, July 2017, Washington, DC, USA Lin et al.


**Table 8: Ablation studies on large MRGs.**



_ACC_


0.7

0.6

0.5

0.4

0.3

0.2

0.1

20 30 40 50 60 70 80 90


**(b)** _**MAG**_ **and** _**OAG-CS**_





0.9


0.8


0.7


0.6

2.5 3 3.5 4 4.5 5 5.5 6


**(a)** _**ACM**_ **and** _**IMDB**_


|Method|OAG-ENG|MAG|OAG-CS|
|---|---|---|---|
|**Method**<br>|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|ACC ↑NMI ↑ARI ↑|
|w/o {_𝜔𝑟_}_𝑅_<br>_𝑟_=1<br>w/o_ 𝛼_· b_𝑿_<br>(_𝐿_)<br>w/o Lreg<br>DEMM+|36_._1<br>38_._6<br>20_._7<br>31_._7<br>33_._7<br>17_._4<br>24_._4<br>22_._8<br>10_._1<br>42_._3<br>41_._8<br>24_._8|65_._7<br>62_._5<br>50_._9<br>67_._7<br>61_._7<br>51_._3<br>67_._8<br>63_._4<br>52_._4<br>67_._8<br>63_._3<br>52_._3|36_._1<br>35_._9<br>20_._2<br>32_._7<br>32_._7<br>16_._8<br>20_._2<br>15_._5<br>5_._5<br>40_._1<br>42_._7<br>24_._1|



_ACC_



_ACM_ _IMDB_ _MAG_ _OAG-CS_


_ACC_


0.7


0.6


0.5


0.4



1.0


0.9


0.8


0.7


0.6



**Figure 12: Clustering accuracy when varying** _𝛽_



_ACC_


0.7


0.6


0.5


0.4


0.3

6 8 10 12 14 16 18 20


**(b)** _**MAG**_ **and** _**OAG-CS**_



0.5

1 2 3 4 5 6 7 8


**(a)** _**ACM**_ **and** _**IMDB**_



0.3

10 30 50 70 90 110 130 150


**(b)** _**MAG**_ **and** _**OAG-CS**_



**Figure 11: Clustering accuracy when varying** _𝛼_


On attribute-less MRGs, the variant DEMM-NA of DEMM+ surpasses
the best baselines in terms of ACC on all datasets except _RCDD_ .
Most notably, on _MAG_, DEMM-NA takes a lead of 11 _._ 5%, 24 _._ 8%, and
21 _._ 2% in ACC, NMI, and ARI. Notice that LabelProg and Louvain

determine the number of clusters automatically, which accidentally

leads to higher NMI and ARI values on _Yelp_, _IMDB_, and _OAG-ENG_
compared to DEMM-NA.


**5.3** **Clustering Efficiency Evaluation**


Figure 9 plots the runtime costs consumed by DEMM+ and 10 strong

baselines in Tables 5 and 6. Note that the _𝑦_ -axis is in log-scale

and the measurement unit for running time is seconds (sec). For

fairness, we exclude the time costs needed for loading input data

and outputting results in all methods, as well as their pre-training or

pre-processing costs. The baselines with the best clustering quality

are marked with _★_ . We exclude MCGC, MMGC, BTGF, and DuaLGR on

large MRGs as they are unable to terminate with valid outcomes.

As evidenced in Figure 9, DEMM+ consistently demonstrates higher

efficiency across all benchmark datasets. Compared to the best

baselines in Tables 5 and 6, DEMM+ is able to achieve remarkable
speedups of 62 _._ 5×, 23 _._ 9×, 25 _._ 6×, 21 _._ 4×, and 67 _._ 6× on small datasets
_ACM_, _DBLP_, _ACM2_, _Yelp_, and _IMDB_, respectively. Notably, on large
MRGs _OAG-CS_ and _OAG-ENG_ datasets with tens of millions of
edges, the accelerations achieved by DEMM+ are over 139× and 53×,
respectively. Even on the largest dataset _RCDD_ with 11 _._ 9 million

nodes and 0 _._ 78 billion edges, where most recent competitive MRGC

approaches BTGF, DuaLGR, MGDCR, DMG, and BMGC fail, DEMM+ is still
nearly 2× faster compared to the best viable baseline S [2] CAG, while

producing significant improvements of 14 _._ 1%, 5 _._ 4%, and 12 _._ 1% in

ACC, NMI, and ARI.

In Figure 10, we further corroborate the effectiveness of our pro
posed algorithms FAAO (Stage I) and SSKC (Stage II) in enhancing
computational efficiency. As reported, DEMM+ accelerates the computation of both stages in DEMM, i.e., the construction of _𝑯_ and the

generation of clusters. The acceleration is particularly pronounced

on the large MRG dataset _MAG_, where DEMM+ obtains an overall
speedup of 3 _,_ 252× than DEMM. Moreover, DEMM cannot handle larger
MRGs within 2 days, whereas DEMM+ finishes the clustering over
_RCDD_ using less than 30 minutes (see Figure 9).



**Figure 14: Clustering accuracy when varying** _𝑑_


**5.4** **Ablation Study**


In this set of experiments, we empirically analyze the efficiency of

three key ingredients in DEMM+, including the adjustments of RTWs

{ _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [, the estimator] _[ 𝛼]_ [·][ �] _[𝑿]_ [(] _[𝐿]_ [)] [of the terms beyond] _[ 𝐿]_ [hops in] _[ 𝑯]_
in Eq. (14), and the regularization term Lreg in Eq. (4).

According to Tables 7 and 8, compared to three ablated versions

that remove the three ingredients, the complete DEMM+ always ob
tains conspicuously superior ACC, NMI, and ARI results on all

MRGs. Notably, on the _ACM2_ and _DBLP_, the ACC scores increase by
1 _._ 3% and 2 _._ 1%, respectively, by including Lreg term, which indicates

the significance of the regularization term in balanced fusion of

multiplex graph structures. The improvements are more significant

on _OAG-NEG_ and _OAG-CS_, where substantial ACC improvements
of 17 _._ 9% and 19 _._ 9% can be gained. On _MAG_, the conducive effects

of the first and second ingredients are still noticeable, whereas the

Lreg term contributes minimally.


**5.5** **Parameter Analysis**


This section investigates the impact of parameters _𝛼_, _𝛽_, _𝐿_, and _𝑑_ in

DEMM+ on two small datasets _ACM_ and _IMDB_ and two large MRGs
_MAG_ and _OAG-CS_, respectively, by varying each parameter while

fixing others. We report ACC scores only as NMI and ARI results

are quantitatively similar, and thus, are deferred to Appendix D.


**Varying** _𝛼_ **.** Figure 11(a) shows the impact of varying _𝛼_ from 1 to 8
on the clustering performance on _ACM_ and _IMDB_, while Figure 11(b)



0.9


0.8


0.7


0.6

3 5 7 9 11 13 15 17


**(a)** _**ACM**_ **and** _**IMDB**_



**Figure 13: Clustering accuracy when varying** _𝐿_



0.9


0.8


0.7


0.6


0.5

8 16 32 64 128 256 512 1024


**(a)** _**ACM**_ **and** _**IMDB**_



_ACC_


0.7


0.6


0.5


0.4


0.3


0.2

4 8 16 32 64 128


**(b)** _**MAG**_ **and** _**OAG-CS**_



12


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



presents its effects on _MAG_ and _OAG-CS_ when varying it from 10 to
150. The results reveal that _𝛼_ has a negligible influence on _ACM_, but
a profound impact on _IMDB_, _MAG_, and _OAG-CS_ . Specifically, the
ACC scores of _IMDB_ improve monotonically with _𝛼_ until reaching
its maximum value at _𝛼_ = 7, whereas _MAG_ and _OAG-CS_ exhibit
oscillatory behaviors, attaining peak values at _𝛼_ = 50 and 110,

respectively. Recall that in Eq. (4), _𝛼_ is the weight assigned to the

MRDE term towards injecting graph topology information into

the node feature vectors _𝑯_ . Thus, a higher _𝛼_ indicates a larger
portion of structural features encoded into _𝑯_ . Generally, on the

four datasets, a large _𝛼_ is preferred, implying the importance of

graph structures in MRGC.


**Varying** _𝛽_ **.** Figure 12 displays the effects of the regularization

weight _𝛽_ on ACC scores in Eq.(4). In Figure 12(a), where _𝛽_ varies

within a short range from 2.5 to 6, the ACC scores of datasets _ACM_
and _IMDB_ exhibit divergent trends: the clustering performance of
_ACM_ deteriorates monotonically with increasing _𝛽_, whereas that
on _IMDB_ grows progressively. In Figure 12(b), when varying _𝛽_ from

20 to 90, it can be observed that increasing _𝛽_ has little impact on

_MAG_, but brings a considerable performance rise on _OAG-CS_ . The

differences can be ascribed to their unique structural disparities

and volume differences between edges of different relation types.


**Varying** _𝐿_ **.** Figures 13(a) and 13(b) depict how the ACC scores
change when _𝐿_ is varied from 3 to 17 on _ACM_ and _IMDB_, and from 6
to 20 on _MAG_ and _OAG-CS_ . It can be seen that increasing _𝐿_ has little
impact on ACC scores on _ACM_ and _IMDB_ . In comparison, on larger
MRGs _MAG_ and _OAG-CS_, the ACC scores first undergo upticks

when increasing _𝐿_ to roughly 12 or 14, followed by a decrease or

plateau. The results imply that estimating _𝑯_ as in Eq. (15) with up

to a small number _𝐿_ hops of terms is sufficiently accurate, consistent

with our empirical and theoretical analyses in Section 4.1.


**Varying** _𝑑_ **.** The parameter _𝑑_ represents the dimension of initial
feature vectors _𝑿_, which are reduced from the input attribute

matrix through a principal component analysis (Section 2.3). Fig
ures 14(a) and 14(b) illustrate the changes in ACC scores on all four

datasets when varying _𝑑_ in the ranges of [8 _,_ 1024] and [4 _,_ 128]. For

all datasets, we can see a clear rise in performance when enlarging

_𝑑_ from 4 to 128, meaning more features are retained. However, the

performance of DEMM+ starts to remain invariant or even undergoes minor drops when _𝑑_ exceeds 128, on either _ACM_ and _IMDB_
whose original attribute dimensions _𝐷_ are up to 2,000, or _MAG_ and
_OAG-CS_ with _𝐷_ = 128 and 768. The drops are caused by data noise

embodied in original attribute vectors, while the invariance can be

explained by the well-known Johnson-Lindenstrauss lemma.


**6** **Related Work**


**Multi-relational Graph Clustering.** MRGC focuses on generat
ing consistent node representation by integrating consistency infor
mation across different relation types. Previous methods typically

use adaptive weights to fuse each relation together and construct a

unified graph [29, 51, 64], SwMC [63] and MvAGC [51] are the represen
tative methods with a self-adjusting weight computation algorithm.

To further extract shared patterns from MRG, numerous methods

have incorporated consistency information during the fusion of

different relation types. DuaLGR [53] proposed a method where soft



labels derived from consistency information are used to refine the

graphs of each relation type before fusion. DMGI [66] reconstructs

MRG by maximizing the mutual information across relation types.

However, these methods cannot fully exploit the dependencies be
tween different relation types and the feature matrices, resulting in

their underperformance in MRGs.

Recently, many approaches generate node embeddings for each

relation type individually and identify cross-relational consistencies

from different relational graphs [54, 64, 65, 68, 76, 97]. BTGF [70]

designs filters with non-shared parameters for each relation type

to obtain node embeddings from diverse perspectives. DMG [60] dis
entangles consistent and redundant information from the features

of different relations. BMGC [75] introduces imbalanced multiview

learning to refine embeddings derived from less important relation

types. Nevertheless, these methods overlook the complementary

information introduced by fusing MRGs, thus hindering the ex
ploitation of MRGs.


**Attributed Graph Clustering.** Attributed graph clustering (AGC)

has been extensively studied nowadays [6, 40, 45, 47, 98, 102, 103,

114]. Most recent research has focused on integrating graph topol
ogy with node attributes to produce cohesive embeddings [1, 12,

46, 100, 117], which are then clustered by using classical clustering

methods to obtain the final results. With the widespread adop
tion of deep learning, methods that leverage deep learning mod
els like GNNs [73] to learn consistent node representations have

gained popularity [5, 15, 35, 57, 58], DMoN [87], Dink-Net [56], and
S3GC [17] are the representative methods among them. H-GCN [32]

introduces graph coarsening to capture long-range information,

thereby addressing the potential overfitting caused by increasing

the depth of GNN models. To fully integrate topological and at
tribute information of graphs, attention mechanisms [90, 96, 113]

and graph contrastive learning [29, 104, 111] have also been widely

employed in this process. Some recent approaches [22, 50] integrate

subspace clustering with spectral clustering techniques [62]. How
ever, AGC fails to account for the varying significance of distinct

relations, rendering it inapplicable to MRGs.


**Multi-View Graph Clustering.** Multi-view clustering is to group

data with heterogeneous feature representations. Due to dimen
sional differences across vertices, directly linearly combining fea
tures from different views is not feasible. Early graph-based ap
proaches rely on constructing similarity matrices followed by spec
tral clustering. [80, 81, 86, 115], LMVSC [36] enhances scalability

by introducing anchor graphs to replace fully connective graph.

GTLEC [9] and CGL [48] enhance multi-view consistency through

optimized affinity matrix construction. These methods often incur

significant memory consumption for similarity matrix construction.

To this end, UOMvSC [83] eliminates the need for explicit similarity

matrix construction. Matrix factorization-based methods extract

cross-view shared information through matrix decomposition and

integrate it into a unified representation [8, 14, 34, 92, 94, 95].

Recent deep learning-based approaches define and optimize spe
cific metrics such as MCGC [64] and MAGCN [10]. Despite effectively

integrating cross-dimensional features, they struggle to generalize

to MRG due to incompatible relation modeling.



13


Conference’17, July 2017, Washington, DC, USA Lin et al.



**Algorithm 4:** DEMM-NA Algorithm


**Input:** An attribute-less MRG G, parameters _𝛼_, _𝛽_, and _𝐾_
**Output:** A set of _𝐾_ clusters {C1 _, . . .,_ C _𝐾_ }

Lines 1-4 are the same as in Algorithm 2;

**5** _𝑯_ ← the first _𝑑_ eigenvectors of _𝑨_ [ˆ] ;

Lines 6-7 are the same as Lines 10-12 in Algorithm 2;


**8** {C1 _, . . .,_ C _𝐾_ } ← SSKC( _𝑯, 𝐾_ );


**7** **Conclusion**


This paper proposes two effective methods, DEMM and DEMM+, for
MRGC. DEMM achieves remarkable clustering performance on MRGs,

via our innovative two-stage optimization objectives formulated

upon the MRDE of MRGs and DE of affinity graphs. Based thereon,

we develop DEMM+, which significantly advances the efficiency and
scalability of DEMM via two elaborate secondary algorithms FAAO
and SSKC containing several non-trivial optimization techniques.

Our extensive evaluations experimentally manifest the consistent

superiority of DEMM+ over a wide range of baselines in clustering

quality and empirical efficiency. However, the proposed techniques

are mainly designed for static MRGs, which struggle to cope with

dynamic MRGs with frequent updates. In the future, our work

can be extended to dynamic MRGs by devising sampling and in
cremental techniques for structural changes (e.g., node/edge in
sertions/deletions). Moreover, the notion of MRDE can be further

generalized to heterogeneous graphs with multiple node types,

enabling broader applications in real-world scenarios.


**Acknowledgments**


This work is supported by the Hong Kong RGC ECS grant (No.

22202623), NSFC No. 62302414, and the Huawei gift fund.


**A** **Extension to Attribute-less MRGs**


In this section, we further extend DEMM+ to handle attribute-less
MRGs and dub the extended version as DEMM-NA.


**Idea.** Since in an attribute-less MRG G, attribute matrix _𝑿_ = 0, our

objective function in Eq. (4) then becomes



By Ky Fan’s trace maximization principle [19], the optimal _𝑯_ to this
problem is the first _𝑑_ eigenvectors of _𝑨_ [ˆ], which can be efficiently
computed via fast partial eigendecomposition solvers as _𝑑_ ≪ _𝑁_ .


**Algorithm.** As displayed in Algorithm 4, DEMM-NA takes as input an
attribute-less MRG G, parameters _𝛼, 𝛽_, and the number _𝐾_ of clusters.

As Lines 1-2 in Algorithm 2, Algorithm 4 begins by initializing

relation type weights { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [and building matrix] _[𝑬]_ [˜] [(] _[𝑟]_ [)] [. Afterwards,]
at Lines 3-7, DEMM-NA iteratively updates node feature vectors _𝑯_ and

relation type weights. In each iteration, Algorithm 4 computes the
unified normalized adjacency matrix _𝑨_ [ˆ] by Eq. (9) at Line 4, takes the
first _𝐾_ eigenvectors of _𝑨_ [ˆ] as _𝑯_ at Line 5 through the _Arnoldi iterative_
_solver_ [41], followed by normalizing _𝑯_ such that _𝑯_ ∈ Nrow at Line
6, respectively. Additionally, with _𝑯_ and _𝑬_ [˜] [(] _[𝑟]_ [)] at hand, we update
{ _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [in the same way as in Algorithm][ 2][ (Line 7). Eventually, the]
resulting node feature vectors _𝑯_ after convergence will be input to
SSKC (Algorithm 3) to derive the final clusters {C1 _, . . .,_ C _𝐾_ }.


**Complexity Analysis.** Lines 1-7 are identical to Algorithm 2 except for updating _𝑯_ at Line 5, which involves a partial eigendecomposition of sparse matrix _𝑨_ [ˆ] and consumes _𝑂_ ( _𝑀𝑑_ ) time [41].

Combined with the cost analysis in Section 4.1, the time overhead

for generating _𝑯_ in each iteration in the first stage is _𝑂_ ( _𝑀𝑑_ + _𝑁𝑑𝑅_ ).

Additionally, Algorithm 4 invokes Algorithm 3 at Line 8 for the

second stage. As per its cost analysis in Section 4.2, the overall time

complexity of DEMM-NA is bounded by _𝑂_ ( _𝑀𝑑_ + _𝑁_ ( _𝑑_ [2] + _𝑑𝑅_ + _𝐾_ ))

when the numbers of iterations are regarded as constants. The

space overhead is the same as DEMM+, i.e., _𝑂_ ( _𝑀_ + _𝑁_ ( _𝑑_ + _𝐾_ )).


**B** **Theoretical Proofs**


Lemma B.1 (Lidskii Ineqality [30, 49]). _Suppose 𝑨_ _is a random_
_matrix,_ _and_ _let_ _𝜆_ ( _𝑨_ ) _denote_ _the_ _largest_ _eigenvalue_ _of_ _𝑨,_ _For_ _any_
_Hermitian matrices 𝑨_ _and 𝑩, the following inequality holds:_


_𝜆_ ( _𝑨_ + _𝑩_ ) ≤ _𝜆_ ( _𝑨_ ) + _𝜆_ ( _𝑩_ )

Lemma B.2. ∥ _𝑨_ [ˆ] _[𝐿]_ [+] _[ℓ]_  - _𝑨_ [ˆ] _[𝐿]_ ∥2 = _𝜇𝐿,𝐿_ + _ℓ_ _._


**Proof of Eq.** (6) **.** Let _𝑠𝑖_ = ∥ _𝑺𝑖_ ∥1. By the definition of the DE, we
can rewrite D( _𝒀_ _, 𝑺_ ) in Eq. (5) as follows:



∑︁ ~~√~~ ~~√~~ 2

_𝑺𝑖,𝑗_      - �� _𝒀_ _𝑖_ / _𝑠𝑖_      - _𝒀_ _𝑗_ / _𝑠_ _𝑗_ ��2
_𝑣𝑖,𝑣𝑗_ ∈V



_𝐾_
∑︁


_𝑘_ =1


_𝐾_
∑︁


_𝑘_ =1



∑︁


_𝑣𝑖,𝑣𝑗_ ∈C _𝑘_



_𝑅_
∑︁

_𝜔𝑟_ = 1 _,_

_𝑟_ =1



min [L][MRDE][ +] _[ 𝛽]_ [·]
_𝑯_ ∈Nrow _,_ _𝜔𝑟_ ∈R _[𝛼]_ [·]



_𝑅_
∑︁

_𝜔𝑟_  - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] s.t.
_𝑟_ =1



consisting of two valid terms, MRDE and regularization. As per our
analysis in Section 3.1, LMRDE = trace( _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] ) _𝑯_ ), wherein
_𝑨_ ˆ denotes the unified normalized adjacency matrix. Although we

can analogously apply the alternating optimization scheme and
update relation type weights { _𝜔𝑟_ } _𝑟_ _[𝑅]_ =1 [efficiently as in Section][ 4.1][,]
the updating of node feature vectors _𝑯_ is still problematic.
Specifically, although the constraint _𝑯_ ∈ Nrow on _𝑯_ can avoid
trivial solutions to trace( _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] ) _𝑯_ ), e.g., 0, the direct optimiza
tion with such a constraint undergoes numerous iterations of time
consuming projected gradient ascent steps. As a workaround, the

idea of DEMM-NA is to impose an additional orthogonality constraint
_𝑯_ [⊤] _𝑯_ = _𝑰_ to _𝑯_, thereby facilitating the problem transformation
from minimizing trace( _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] ) _𝑯_ ) to

max trace( _𝑯_ [⊤] _𝑨𝑯_ [ˆ] ) _._
_𝑯_ [⊤] _𝑯_ = _𝑰_



D( _𝒀_ _, 𝑺_ ) = [1]

2


= [1]

2


= [1]

2







∑︁ - �2

_𝑺𝑖,𝑗_      - _𝒀_ _𝑖,𝑘_ / ~~[√]~~ _𝑠𝑖_      - _𝒀_ _𝑗,𝑘_ / ~~[√]~~ _𝑠_ _𝑗_

_𝑣𝑖,𝑣𝑗_ ∈V



�2



_𝑺𝑖,𝑗_ - 1 1
~~√~~   - ~~√~~
|C _𝑘_ | [·] _𝑠𝑖_ _𝑠_ _𝑗_



+ [1]

2



_𝐾_
∑︁ ∑︁ 1

_𝑺𝑖,𝑗_             - _._

_𝑘_ =1 _𝑣𝑖_ ∈C _𝑘_ _,𝑣𝑗_ ∈V\C _𝑘_ |C _𝑘_ | · _𝑠𝑖_



If we assume that _𝑠𝑖_ = _𝑠_ _𝑗_ ∀ _𝑣𝑖, 𝑣_ _𝑗_ ∈V, we can derive that the minimization of D( _𝒀_ _, 𝑺_ ) is equivalent to minimizing



_𝐾_
∑︁ ∑︁


_𝑘_ =1 _𝑣𝑖_ ∈C _𝑘_ _,𝑣𝑗_ ∈V\C _𝑘_



_𝑺𝑖,𝑗_
|C _𝑘_ | _[.]_



14


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



**Proof of Lemma 4.2.** Consider a vector x ∈ R _[𝑛]_ such that x _𝑖_ ≠
0 for all _𝑖_ ∈{1 _,_ 2 _, . . .,𝑛_ }. By the Courant-Fischer Theorem, we have:

_𝜆_ ( _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) = [x][⊤] _[𝑨]_ [ˆ] [(] _[𝑟]_ [)] [x] _._

x [⊤] x



Let y = _𝑫_ [(] _[𝑟]_ [) −] 2 [1] x. Substituting this into the above expression, we


obtain:



_𝜆_ ( _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) = [y][⊤] _[𝑨]_ [(] _[𝑟]_ [)] [y] _._

y [⊤] _𝑫_ [(] _[𝑟]_ [)] y



For any vector _𝑦_, applying the Cauchy-Schwarz inequality yields:



Equality holds if and only if [√] _𝜔𝑟_ _𝑐𝑟_ ∝ ~~√~~ 1 _𝑐𝑟_, i.e., _𝜔𝑟_ = _𝑝_ - _𝑐𝑟_ [−][2] for

some constant _𝑝_ . With the constraint [�] _𝑟_ _[𝑅]_ =1 _[𝜔][𝑟]_ [=][ 1, we can easily]
get _𝑝_ :


1
_𝑝_ =           - _𝑟𝑅_ =1 _[𝑐]_ _𝑟_ [−][2] _._

Substituting _𝑝_ into _𝜔𝑟_ = _𝑝_ - _𝑐𝑟_ [−][2] we can get _𝜔𝑟_ = - _𝑖𝑅𝑐_ = _𝑟_ 1 [−][2] _[𝑐]_ _𝑖_ [−][2], which

completes the proof. 

**Proof of Lemma 3.2.** Let _𝑠𝑖_ = ∥ _𝑺𝑖_ ∥1. We can expand D( _𝒀_ _, 𝑺_ )

as follows:



∑︁ 2

_𝑺𝑖,𝑗_ �� _𝒀_ _𝑖_ /√ _𝑠𝑖_      - _𝒀_ _𝑗_ /√ _𝑠_ _𝑗_ ��2
_𝑣𝑖,𝑣𝑗_ ∈V



D( _𝒀_ _, 𝑺_ ) = [1]

2



∑︁

_𝑨𝑖𝑗_ [(] _[𝑟]_ [)] [y] _[𝑖]_ [y] _[𝑗]_ [≤] [1] 2
_𝑖,𝑗_



∑︁
y [⊤] _𝑨_ [(] _[𝑟]_ [)] y =



2



∑︁ - 
_𝑨𝑖𝑗_ [(] _[𝑟]_ [)] y _𝑖_ [2] [+][ y][2] _𝑗_

_𝑖,𝑗_



∑︁
= _𝑑𝑖_ y _𝑖_ [2] [=][ y][⊤] _[𝑫]_ [(] _[𝑟]_ [)] [y] _[.]_


_𝑖_



=


=



∑︁ - _𝒀_ _𝑖,𝑘_ _𝒀_ _𝑗,𝑘_

_𝑺𝑖,𝑗_      - ~~√~~      - ~~√~~
_𝑠𝑖_ _𝑠_ _𝑗_
_𝑣𝑖,𝑣𝑗_ ∈V



�2



_𝐾_
∑︁


_𝑘_ =1



_𝐾_
∑︁

_𝒀_ [⊤]  - _,𝑘_ [(] _[𝑰]_ [−] _[𝑺]_ [)] _[𝒀]_ [·] _[,𝑘]_
_𝑘_ =1



1

2



From this, we conclude that _𝜆_ ( _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) ≤ 1.

Next, observe that:




- _𝑅_ ∑︁

_𝜔𝑟_ _𝑨_ [ˆ] [(] _[𝑟]_ [)]

_𝑟_ =1



_𝑨_ ˆ =



_𝑅_
∑︁

_𝜔𝑟_ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ⇒ _𝜆_ ( _𝑨_ [ˆ] ) = _𝜆_

_𝑟_ =1



_._



Since each _𝑨_ [ˆ] [(] _[𝑟]_ [)] is a symmetric normalized positive definite matrix,

it follows that _𝑨_ [ˆ] [(] _[𝑟]_ [)] = _𝑨_ [ˆ] [(] _[𝑟]_ [)⊤] and _𝑥_ [⊤] _𝑨_ [ˆ] [(] _[𝑟]_ [)] _𝑥_ ≥ 0 for any _𝑥_ . Thus,
_𝑨_ ˆ [(] _[𝑟]_ [)] is Hermitian. As _𝑨_ ˆ is a weighted sum of Hermitian matrices,

it is also Hermitian. By Lemma B.1, we have:



= trace( _𝒀_ [⊤] ( _𝑰_     - _𝑺_ ) _𝒀_ ) = trace( _𝒀_ [⊤] _𝒀_ ) − trace( _𝒀_ [⊤] _𝑺𝒀_ ) _._


By the definition of _𝒀_ in Eq. (1), _𝒀_ [⊤] _𝒀_ = _𝑰_, which is a constant. Thus,
the minimization of D( _𝒀_ _, 𝑺_ ) is equivalent to the maximization of
trace( _𝒀_ [⊤] _𝑺𝒀_ ). 

**Proof of Lemma 4.3.** According to the definition of the oriental incidence matrix, we have _𝑫_ [(] _[𝑟]_ [)] - _𝑨_ [(] _[𝑟]_ [)] = _𝑬_ [(] _[𝑟]_ [)] _𝑬_ [(] _[𝑟]_ [)⊤] . Hence,




[1] 2 _𝑯_ 


_𝑅_
∑︁

_𝜔𝑟_ = 1 _._

_𝑟_ =1



trace - _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ - = trace - _𝑯_ [⊤] _𝑫_ [(] _[𝑟]_ [)−] 2 [1]



= trace - _𝑯_ [⊤] _𝑫_ [(] _[𝑟]_ [)−] 2 [1]




[1] 2 _𝑬_ [(] _[𝑟]_ [)] _𝑬_ [(] _[𝑟]_ [) ⊤] _𝑫_ [(] _[𝑟]_ [)−] [1] 2



_𝑅_
∑︁

_𝜔𝑟_ _𝜆_ ( _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) ≤

_𝑟_ =1




[1] 2 ( _𝑫_ - _𝑨_ [(] _[𝑟]_ [)] ) _𝑫_ [(] _[𝑟]_ [)−] [1] 2



_𝜆_




- _𝑅_ ∑︁

_𝜔𝑟_ _𝑨_ [ˆ] [(] _[𝑟]_ [)]

_𝑟_ =1



≤




[1] 2 _𝑯_ 


This completes the proof. 

**Proof of Lemma 3.1.** By setting its derivative w.r.t. _𝑯_ to zero
and, we obtain the optimal _𝑯_ as:

_𝜕_ { _𝛼_      - trace( _𝑯_ [⊤] ( _𝑰_      - _𝑨_ [ˆ] ) _𝑯_ ) + ∥ _𝑯_      - _𝑿_ ∥ [2] _𝐹_ [}]

= 0
_𝜕𝑯_

=⇒ _𝛼_    - ( _𝑰_    - _𝑨_ [ˆ] ) _𝑯_ + ( _𝑯_    - _𝑿_ ) = 0


=⇒((1 + _𝛼_ ) _𝑰_     - _𝛼_     - _𝑨_ [ˆ] ) · _𝑯_ = _𝑿_


_𝛼_ 1
=⇒( _𝑰_    - _[𝑨]_ [ˆ][) ·] _[ 𝑯]_ [=]
1 + _𝛼_ [·] 1 + _𝛼_ _[𝑿]_

1           - _𝛼_           - −1
=⇒ _𝑯_ = _𝑰_    - _𝑨_ ˆ _𝑿_ _.,_ (19)
1 + _𝛼_ [·] 1 + _𝛼_


which seals the proof. 

**Proof of Eq** (11) **.** Assume _𝑯_ is fixed during the adjustment of

_𝜔𝑟_ . Let


                    -                     _𝑐𝑟_ = _𝛽_     - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] ∥ [2] _𝐹_ [+] _[ 𝛼]_ [·][ trace] _𝑯_ [⊤] ( _𝑰_     - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_ ≥ 0 _,_



1
≤
1 + _𝛼_


1
≤
1 + _𝛼_


1
≤
1 + _𝛼_



= trace             - _𝑯_ [⊤] _𝑬_ [ˆ] [(] _[𝑟]_ [)] _𝑬_ [ˆ] [(] _[𝑟]_ [)⊤] _𝑯_             - = ∥ _𝑯_ [⊤] _𝑬_ [ˆ] [(] _[𝑟]_ [)] ∥ _𝐹_ [2] _[,]_


which completes the proof. 

**Proof of Theorem 4.4.** According to Lines 5-8, we have



_𝛼_      - _𝛼_
_𝑯_ = _𝑿_ [�] [(][0][)] + _[𝑨]_ [ˆ] _[𝑿]_ [�] [(][0][)] [+]
1 + _𝛼_ [·] 1 + _𝛼_



�2

  - _𝑨_ [ˆ] [2] _𝑿_ [�] [(][0][)] + _. . ._




 - _𝛼_  - _𝐿_  - _𝛼_
+ - _𝑨_ [ˆ] _[𝐿]_ _𝑿_ [�] [(][0][)] + _𝛼_ 1 + _𝛼_ 1 + _𝛼_




- _𝐿_

   - _𝑨_ [ˆ] _[𝐿]_ _𝑿_ [�] [(][0][)]




- _𝐿_ +1 _𝑨_ ˆ _𝐿𝑿,_



1
=
1 + _𝛼_



_𝐿_
∑︁ - _𝛼_

1 + _𝛼_

_ℓ_ =0




- _ℓ_ _𝑨_ ˆ _ℓ_ _𝑿_ + - _𝛼_
1 + _𝛼_



which is exactly Eq. (15). By the definition of _𝑯_ [∗] in Eq. (14) and the

Frobenius norm and operator norm inequality,



∞
∑︁


_ℓ_ = _𝐿_ +1



����� _𝐹_



∥ _𝑯_ - _𝑯_ [∗] ∥ _𝐹_ =



1

1 + _𝛼_
�����




 - _𝛼_

1 + _𝛼_




 - _ℓ_

   - ( _𝑨_ [ˆ] _[ℓ]_   - _𝑨_ [ˆ] _[𝐿]_ ) · _𝑿_



∞
∑︁


_ℓ_ = _𝐿_ +1

∞
∑︁


_ℓ_ = _𝐿_ +1



∞
∑︁


_ℓ_ =1




- _𝛼_

1 + _𝛼_




- _𝛼_ - _ℓ_ - ( _𝑨_ ˆ _ℓ_ - _𝑨_ ˆ _𝐿_ ) · _𝑿_
1 + _𝛼_ ��� ��� _𝐹_


- _𝛼_ - _ℓ_ - _𝑨_ ˆ _ℓ_ - _𝑨_ ˆ _𝐿_ _𝑿_ ∥ _𝐹_
1 + _𝛼_ ��� ���2 · ∥



which simplifies the objective function to

[�] _𝑟_ _[𝑅]_ =1 _[𝜔][𝑟]_ _[𝑐][𝑟]_ [.]
Applying the Cauchy-Schwarz inequality:

 - _𝑅_ �� _𝑅_  -  - _𝑅_ �2  - _𝑅_
∑︁ ∑︁ 1 ∑︁ √ 1 ∑︁



≥ 1 _._



≥



=



√
_𝜔𝑟_



�2



�2



_𝑟_ =1







_𝑟_ =1




- _𝑅_
∑︁




- _𝑅_
∑︁



_𝜔𝑟_ _𝑐𝑟_

_𝑟_ =1



�� _𝑅_
∑︁



_𝑟_ =1



1

_𝑐𝑟_



√ 1
_𝜔𝑟_ _𝑐𝑟_ - ~~√~~
_𝑐𝑟_




- _𝐿_ + _ℓ_ - _𝑨_ ˆ _𝐿_ + _ℓ_ - _𝑨_ ˆ _𝐿_ _𝑿_ ∥ _𝐹_ _._
��� ���2 · ∥



15


Conference’17, July 2017, Washington, DC, USA Lin et al.



By Lemma B.2,


1
∥ _𝑯_ - _𝑯_ [∗] ∥ _𝐹_ ≤
1 + _𝛼_



∞
∑︁


_ℓ_ =1




- _𝛼_

1 + _𝛼_



_𝑇_

- diag( [←−] v [(] _[ℓ]_ [)] ) [−][1] - - _𝒁_ [◦] _𝒁_ [◦⊤][�] 

_ℓ_ =1



leading to


←− _𝒁_ −→ _𝒁_ ⊤ =



_𝑇_


diag( [−→] v [(] _[ℓ]_ [)] ) [−][1] _._

_ℓ_ =1




- _𝐿_ + _ℓ_

    - _𝜇𝐿,𝐿_ + _ℓ_     - ∥ _𝑿_ ∥ _𝐹_



∞
∑︁ - _𝛼_

1 + _𝛼_

_ℓ_ =1




- _ℓ_

  - ∥ _𝑿_ ∥ _𝐹_   - max
_ℓ_ ≥1 _[𝜇][𝐿,𝐿]_ [+] _[ℓ]_



This result is equivalent to the _Iterative Proportional Fitting Proce-_
_dure_ in the Sinkhorn-Knopp algorithm, and using the Birkhoff-von
Neumann theorem, we can conclude that [←−] _𝒁_ [−→] _𝒁_ [⊤] is doubly stochas
tic [37].
Since _𝒁_ [◦] _𝒁_ [◦] is a non-negative square matrix, according to Sinkhorn’s

theorem [79],

[�] _[𝑇]_ _ℓ_ =1 [diag][(←−][v][ (] _[ℓ]_ [)] [)] [−][1][ and][ �] _[𝑇]_ _ℓ_ =1 [diag][(−→][v][ (] _[ℓ]_ [)] [)] [−][1][ are unique]
modulo multiplying the first matrix by a positive number and di
viding the second one by the same number. By the symmetry of
_𝒁_ [◦] _𝒁_ [◦] and [←−] _𝒁_ [−→] _𝒁_ [⊤],



1   - _𝛼_
=
1 + _𝛼_ [·] 1 + _𝛼_




- _𝐿_

   



  - _𝛼_  - _𝐿_ +1
= - ∥ _𝑿_ ∥ _𝐹_ - max
1 + _𝛼_ _ℓ_ ≥1 _[𝜇][𝐿,𝐿]_ [+] _[ℓ]_ _[.]_



This completes the proof. 

**Proof of Theorem 4.6.** Let J = [�] _𝑘_ _[𝐾]_ =1  - _𝑣𝑖_ ∈C _𝑘_ [∥] _[𝒁]_ _𝑖_ [−] [c][(] _[𝑘]_ [)][ ∥][2][,]
and we can compute J as follows:



←− _𝒁_ −→ _𝒁_ ⊤ =



J =


=


=



_𝐾_
∑︁ ∑︁


_𝑘_ =1 _𝑣𝑖_ ∈C _𝑘_



|V|
∑︁

_𝒁𝑖_ _𝒁𝑖_ [⊤] [−]
_𝑖_ =1




_𝒁𝑖_ _𝒁𝑖_ [⊤] [−] [2] _[𝒁][𝑖]_ [c][(] _[𝑘]_ [)⊤] [+][ c][(] _[𝑘]_ [)] [c][(] _[𝑘]_ [)⊤][�]



_𝐾_
∑︁

|C _𝑘_ |c [(] _[𝑘]_ [)] c [(] _[𝑘]_ [)⊤] _._

_𝑘_ =1



_𝑇_


diag( [←−] v [(] _[ℓ]_ [)] ) [−][1] _,_

_ℓ_ =1



_𝑇_

- diag( [−→] v [(] _[ℓ]_ [)] ) [−][1] - - _𝒁_ [◦] _𝒁_ [◦⊤][�] 

_ℓ_ =1



|V| _𝐾_
∑︁ ∑︁

_𝒁𝑖_ _𝒁𝑖_ [⊤] [−] [2] |C _𝑘_ |c [(] _[𝑘]_ [)⊤] c [(] _[𝑘]_ [)] +
_𝑖_ =1 _𝑘_ =1



_𝐾_
∑︁

|C _𝑘_ |c [(] _[𝑘]_ [)] c [(] _[𝑘]_ [)⊤]

_𝑘_ =1



and the uniqueness of the two scaling matrices, we can conclude

that

_𝑇_ _𝑇_

  - [←−][(] _[ℓ]_ [)] [−][1]   - [−→][(] _[ℓ]_ [)] [−][1]



_𝑇_






diag( [−→] v [(] _[ℓ]_ [)] ) [−][1] _,_

_ℓ_ =1



_𝐾_
∑︁




- diag( [←−] v [(] _[ℓ]_ [)] ) [−][1] =


_ℓ_ =1



Since we have c [(] _[𝑘]_ [)] = | C1 _𝑘_ | - _𝑣𝑗_ ∈C _𝑘_ _[𝒁]_ _𝑗_ [:]



∑︁

_𝒁𝑖_ _𝒁_ [⊤] _𝑗_ _[.]_
_𝑣𝑖,𝑣𝑗_ ∈C _𝑘_



|C _𝑘_ | [2] c [(] _[𝑘]_ [)] c [(] _[𝑘]_ [)⊤] =

[�]                         
        


∑︁



_𝒁𝑖_ [�]

    _𝑣𝑖_ ∈C _𝑘_

    


��




∑︁ ∑︁

_𝒁_ [⊤] _𝑗_ =
��
_𝑣𝑗_ ∈C _𝑘_ _𝑣𝑖,𝑣𝑗_

    


∑︁



This allows us to rewrite J as:



_𝐾_
∑︁


_𝑘_ =1



∑︁

_𝒁𝑖_ _𝒁_ [⊤] _𝑗_
_𝑣𝑖,𝑣𝑗_ ∈C _𝑘_



J =



|V|
∑︁

_𝒁𝑖_ _𝒁𝑖_ [⊤] [−]
_𝑖_ =1



1

|C _𝑘_ |



Since _𝑺_ = _𝒁_ [⊤] _𝒁_, we can get that:



_𝐾_
∑︁


_𝑘_ =1



1

|C _𝑘_ |



∑︁

_𝑺𝑖,𝑗_ = trace( _𝒀_ [⊤] _𝑺𝒀_ )

_𝑣𝑖,𝑣𝑗_ ∈C _𝑘_



∑︁



So we can compute J by _𝑺_ using following function:

J = trace( _𝑺_ ) − trace( _𝒀_ [⊤] _𝑺𝒀_ )

where is a NCI _𝒀_ satisfying _𝒀𝒀_ [⊤] = _𝑰_ and _𝒀𝒀_ [⊤] 1 = 1. Thus, we

establish the equivalence:


min J ⇔ max trace( _𝒀_ [⊤] _𝑺𝒀_ ) _,_
C1 _,...,_ C _𝐾_ _𝒀_


By Lemma 3.2, this confirms the equivalence between optimizing
Eq. (5) and [�] _𝑘_ _[𝐾]_ =1 - _𝑣𝑖_ ∈C _𝑘_ [∥] _[𝒁]_ _𝑖_ [−] [c][(] _[𝑘]_ [)][ ∥][.] 
**Proof of Theorem 4.7.** Denote by [←−] v [(] _[ℓ]_ [)] (resp. [−→] v [(] _[ℓ]_ [)] ) the row
(resp. column) sum vector v at Line 4 (resp. Line 6) in the _ℓ_ -th
iteration. Suppose that SSKC terminates the iterative process in the

_𝑇_ -th iteration. At the end of the _𝑇_ -th iteration, we have



The theorem is then proved. 

**Proof of Lemma B.2.** By the definition of ∥ _𝑨_ [ˆ] _[𝐿]_ [+] _[ℓ]_  - _𝑨_ [ˆ] _[𝐿]_ ∥2, ∥ _𝑨_ [ˆ] _[𝐿]_ [+] _[ℓ]_  
         _𝑨_ ˆ _[𝐿]_ ∥2 = _𝜎_ max _𝑨_ ˆ _[𝐿]_ [+] _[ℓ]_ - _𝑨_ ˆ _[𝐿]_ [�], i.e., the maximum singular value of

_𝑨_ ˆ _[𝐿]_ [+] _[ℓ]_ - _𝑨_ ˆ _[𝐿]_ .
Further, let _𝑽_ diag( _𝝀_ ) _𝑽_ [⊤] be the full eigendecomposition of _𝑨_ [ˆ],
wherein eigenvalue _𝝀𝑖_ = _𝜆𝑖_ ( _𝑨_ [ˆ] ) ∀1 ≤ _𝑖_ ≤ _𝑁_ . Using the semi-unitary
property of _𝑽_, i.e., _𝑽_ [⊤] _𝑽_ = _𝑰_, we have _𝑨_ [ˆ] _[𝐿]_ [+] _[ℓ]_ = _𝑽_ diag( **𝚲** ) _[ℓ]_ [+] _[𝐿]_ _𝑽_ [⊤] and
_𝑨_ ˆ _[𝐿]_ = _𝑽_ diag( **𝚲** ) _[𝐿]_ _𝑽_ [⊤] . This leads to _𝑨_ ˆ _[𝐿]_ [+] _[ℓ]_ - _𝑨_ ˆ _[𝐿]_ = _𝑽_ (diag( **𝚲** ) _[ℓ]_ [+] _[𝐿]_ diag( **𝚲** ) _[𝐿]_ ) _𝑽_ [⊤] .


           _𝜎_ max _𝑨_ ˆ _[𝐿]_ [+] _[ℓ]_      - _𝑨_ ˆ _[𝐿]_ [�] = max _𝑖_      - _𝝀𝑖_ _[𝐿]_ [|] _[,]_
1≤ _𝑖_ ≤ _𝑁_ [|] _[𝝀][𝐿]_ [+] _[ℓ]_


which finishes the proof. 

**C** **Additional Algorithmic Details**

**C.1** **The CountSketch Algorithm**


Algorithm 5 displays the pseudo-code of CountSketch Algorithm,

at the beginning, it need to generate the oriented incidence matrix

_𝑬_ [(] _[𝑟]_ [)] ∈ R _[𝑁]_ [×][2] _[𝑀]_ [(] _[𝑟]_ [)] for _𝑨_ [ˆ] [(] _[𝑟]_ [)] (Line 1), and then, in Line 2 we normalized _𝑬_ [(] _[𝑟]_ [)] so that we can get _𝑬_ [ˆ] [(] _[𝑟]_ [)] which can eatimate

    -     trace _𝑯_ [⊤] ( _𝑰_ - _𝑨_ [ˆ] [(] _[𝑟]_ [)] ) _𝑯_, and then we can get count-sketch matrix

by following equation:



_𝑬_ ˜ [(] _[𝑟]_ [)] [ _𝑘, 𝑗_ ] =



_𝑛_
∑︁


_𝑖_ =1
_ℎ𝑘_ ( _𝑖_ )= _𝑗_



_𝑠𝑘_ ( _𝑖_ ) · _𝑬_ [ˆ] [(] _[𝑟]_ [)] [ _𝑖,_ :] (20)



←− - _𝑇_
_𝒁_ = diag( [←−] v [(] _[ℓ]_ [)] ) [−][1] - _𝒁_ [◦] and


_ℓ_ =1



Where _ℎ𝑘_ = {1 _,_ 2 _, . . .,𝑛_ } →{1 _,_ 2 _, . . .,𝑡_ } is the random hash function, and _𝑠𝑘_ = {1 _,_ 2 _, . . .,𝑛_ } →{±1} is the _𝑘_ -th Rademacher sign

function.



−→
_𝒁_ =



_𝑇_


diag( [−→] v [(] _[ℓ]_ [)] ) [−][1]  - _𝒁_ [◦] _,_

_ℓ_ =1



16


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



**Table 9: Parameter setting in DEMM+**


Datasets


Parameter _ACM_ _DBLP_ _ACM2_ _YELP_ _IMDB_ _MAG_ _OAG-CS_ _OAG-ENG_ _RCDD_


_𝛼_ 4 28 4 32 7 50 110 120 4

_𝛽_ 2.5 40 4.2 3 6 30 90 120 1.5

_𝐿_ 5 6 3 16 13 14 12 16 4

_𝑑_ 128 64 512 32 1024 32 128 128 128

_𝑚_ (10 _,_ 14) (10 _,_ 8 _,_ 10) 10 (14 _,_ 12 _,_ 16) 16 12 36 40 40


**Table 10: Parameter setting in DEMM-NA**


Datasets


Parameter _ACM_ _DBLP_ _ACM2_ _YELP_ _IMDB_ _MAG_ _OAG-CS_ _OAG-ENG_ _RCDD_


_𝑑_ 6 4 4 3 80 30 68 62 8

_𝛽_ 2 25 2 24 10 50 280 340 4

_𝑚_ 10 10 10 10 16 5 36 36 40


**Table 11: Parameter setting in DEMM**


Datasets


Parameter _ACM_ _DBLP_ _ACM2_ _YELP_ _IMDB_ _MAG_


_𝛼_ 2 1900 1.5 26 6 50

_𝛽_ 2 4200 2 50 8 6


**Algorithm 5:** CountSketch Algorithm


**Input:** Normalized oriented incidence matrix
_𝑬_ ˆ ∈{0 _,_ 1} _[𝑛]_ [×] _[𝑀]_, Target dimension _𝑘_
**Output:** Sketch matrix _𝑬_ [˜] ∈ R _[𝑛]_ [×] _[𝑚]_

**1** Initialize hash function _ℎ_ : {1 _, . . .,𝑛_ } →{1 _, . . .,𝑘_ } with

uniform randomness;

**2** Initialize diagonal sign matrix Δ ∈{−1 _,_ +1} _[𝑀]_ [×] _[𝑀]_ with
Δ _𝑖,𝑖_ ∼ Rademacher;

**3** Construct sparse bucket matrix Φ ∈{0 _,_ 1} _[𝑚]_ [×] _[𝑀]_ where
Φ _𝑗,𝑖_ = 1[ _ℎ_ ( _𝑖_ )= _𝑗_ ] ;

**4** Compute combined projection matrix _𝑹_ ← ΦΔ;

**5** _𝑬_ [˜] ← _𝑬𝑹_ [ˆ] [⊤] ;


**Algorithm 6:** ORF


**Input:** Node feature vectors _𝑯_, Feature dimension _𝑑_
**Output:** _𝒁_ [◦]

**1** Sample a Gaussian random matrix _𝑾_ ∈ R _[𝑑]_ [×] _[𝑑]_ ;



Where ∥ represent horizontal concatenation operator for matrices.



1 2 3


4 5 6


7 8 9


1 0 1


0 1 0


2 2 2








|0 -0.8|5 0.15|
|---|---|
|-0.4|8 -0.3|
|8 -0.2|0 -0.9|


|1.00|0.35|0.00|0.82|0.58|0.93|
|---|---|---|---|---|---|
|0.35|1.00|0.35|0.14|0.33|0.58|
|0.00|0.35|1.00|0.00|0.00|0.10|
|0.82|0.14|0.00|1.00|0.88|0.82|
|0.58|0.33|0.00|0.88|1.00|0.71|
|0.93|0.58|0.10|0.82|0.71|1.00|


|0.58|-0.32|0.22|0.00 -|0.51|0.54|
|---|---|---|---|---|---|
|0.58|0.54|0.24|0.00|0.22|0.52|
|0.58|0.49|0.55|0.00|0.32 -|0.20|
|0.41|0.49|0.29|-0.40 -|0.32|0.49|
|0.40|-0.51|-0.56|0.41 -|0.28 -|0.17|
|0.57|-0.33|0.00|0.03 -|0.50|0.58|


|1.00|0.37|-0.23|0.51|0.18|0.94|
|---|---|---|---|---|---|
|0.37|1.00|0.58|-0.06|0.32|0.47|
|-0.23|0.58|1.00|-0.42|0.3|-0.11|
|0.51|-0.06|-0.42|1.00|0.04|0.49|
|0.18|0.32|0.3|0.04|1.00|0.23|
|0.94|0.47|-0.11|0.49|0.23|1.00|
|||||||



**2** Compute _𝑸_ by a QR decomposition over _𝑾_ ;



~~√~~
**3** _𝒁_ ←



_𝑑_ - _𝑯𝑸_ [⊤] ;



**4** Compute _𝒁_ [◦] according to Eq. (6);


**C.2** **The ORF Algorithm**


Here, we describe the details of Orthogonal Random Features (ORF)
algorithm. First, we generate a Gaussian random matrix W ∈ R _[𝑁]_ [×] _[𝑑]_


(Line 1), followed by performing a QR decomposition of it to obtain

the orthogonal matrix Q (Line 2). Finally, we use the following
formula to derive Z [◦] :



2

[∥] _[𝑐𝑜𝑠]_ [(] _[𝒁]_ [))] [∈] [R] _[𝑁]_ [×][2] _[𝑑][,]_ (21)
_𝑑_ [· (] _[𝑠𝑖𝑛]_ [(] _[𝒁]_ [)]



**Figure 15: Running example for ORF.**


**C.3** **Illustrative Example for ORF**

In Fig 15, the feature matrix _𝑯_ ∈ R [6][×][3] is first multiplied by an
orthogonal random matrix _𝑸_, after that, the first row of _𝑯_ becomes

[−0 _._ 2 _,_ −1 _._ 36 _,_ −3 _._ 27]. Then, the mapping functions sin and cos are

applied to this feature matrix, to be more precise, the first row

of the multiplied feature matrix becomes [0 _._ 58 _,_ −0 _._ 32 _,_ 0 _._ 22] and

[0 _._ 0 _,_ −0 _._ 51 _,_ 0 _._ 54] after computing by sin and cos. Then we horizontally connect the mapped features to obtain _𝒁_ [◦] . The matrix
_𝑺_ obtained by _𝒁_ [◦] _𝒁_ [◦⊤] is closely resembles to the matrix _𝑺_ [∗] given
by Eq. (7). We can observe that in the first row of _𝑺_, the largest
element except for _𝑺_ 1 _,_ 1 is _𝑺_ 1 _,_ 6 = 0 _._ 93, and the smallest element is
_𝑺_ 1 _,_ 3 = 0 _._ 0. Similarly, in the first row of _𝑺_ [∗], the largest element except
for _𝑺_ [∗] 1 _,_ 1 [is] _[ 𝑺]_ 1 [∗] _,_ 6 [=][ 0] _[.]_ [94, and the smallest element is] _[ 𝑺]_ 1 [∗] _,_ 3 [=][ −][0] _[.]_ [23, that]

is to say, the overall distributions of the two matrices are similar.

Nevertheless, the error between the two matrices is still relatively

large, which is mainly because the dimension of _𝑯_ ( _𝑑_ = 3) in the

example is too small to well approximate the infinite-dimensional

kernel function.


**D** **Additional Experimental Settings and Results**

**D.1** **Datasets**


We describe the details of each dataset used in the experiments in

what follows:


  - _ACM_ [20] contains a paper collaboration network of 3 _,_ 025

publications with two relational edges: paper-subject con
nections (shared research subjects) and paper-author connec
tions (shared authorship). Node features are bag-of-words

representations of paper abstracts. Ground-truth labels clas
sify publications into three research domains: database, wire
less communication, and data mining.

  - _DBLP_ [112] contains an academic collaboration network

of 4 _,_ 057 papers with three relational edges: author-paper

connections (co-authorship), paper-conference associations

(shared venues), and paper-term linkages (shared technical

terms). Node features are bag-of-words representations of pa
per abstracts. Ground-truth labels classify publications into



_𝒁_ [◦] =



√︂



17


Conference’17, July 2017, Washington, DC, USA Lin et al.



_NMI_



_ACM_ _IMDB_ _MAG_ _OAG-CS_


_NMI_


0.7


0.5


0.3



0.8


0.6


0.4


0.2


0.8


0.6


0.4



1 2 3 4 5 6 7 8


**(a)** _**ACM**_ **and** _**IMDB**_



0.1

10 30 50 70 90 110 130 150


**(b)** _**MAG**_ **and** _**OAG-CS**_



**Figure 16: Clustering NMI when varying** _𝛼_



_NMI_



0.2

3 5 7 9 11 13 15 17


**(a)** _**ACM**_ **and** _**IMDB**_



_NMI_


0.7


0.6


0.5


0.4


0.3

6 8 10 12 14 16 18 20


**(b)** _**MAG**_ **and** _**OAG-CS**_



**Figure 17: Clustering NMI when varying** _𝐿_



0.6


0.4


0.2

2.5 3 3.5 4 4.5 5 5.5 6


**(a)** _**ACM**_ **and** _**IMDB**_



_NMI_


0.7


0.5


0.3


0.1

20 30 40 50 60 70 80 90


**(b)** _**MAG**_ **and** _**OAG-CS**_



**Figure 18: Clustering NMI when varying** _𝛽_


_NMI_


0.6

0.5


0.4


0.3


0.2



8 16 32 64 128 256 512 1024


**(a)** _**ACM**_ **and** _**IMDB**_



0.1

4 8 16 32 64 128


**(b)** _**MAG**_ **and** _**OAG-CS**_



0.8


0.6


0.4



**Figure 19: Clustering NMI when varying** _𝑑_


_ARI_ _ARI_


0.5


0.4


0.3


0.2



0.2

1 2 3 4 5 6 7 8


**(a)** _**ACM**_ **and** _**IMDB**_



0.1

10 30 50 70 90 110 130 150


**(b)** _**MAG**_ **and** _**OAG-CS**_



**Figure 20: Clustering ARI when varying** _𝛼_


four categories: database, data mining, machine learning,

and information retrieval.




- _ACM2_ [24] contains an enhanced paper network of 4 _,_ 019

publications with two relational edges: paper-subject con
nections (subject-based) and paper-author interactions (au
thor collaboration). Node features are bag-of-words repre
sentations of paper abstracts. Ground-truth labels classify

publications into three academic domains: database, wireless

communication, and data mining.

- _Yelp_ [77] contains a business interaction network of 2 _,_ 614

establishments with three relational edges: business-user in
teractions (shared customers), business-rating associations

(common ratings), and business-service relationships (shared

services). Node features are bag-of-words representations

of rating descriptions. Ground-truth labels categorize busi
nesses into three service types: Mexican flavor, hamburger,

and food bar.

- _IMDB_ [93] contains a movie collaboration network of 3 _,_ 550

films with two relational edges: movie-actor connections (co
starring) and movie-director connections (shared directors).

Node features are bag-of-words representations of movie

plots. Ground-truth labels categorize films into three genres:

Action, Comedy, and Drama.

- _Amazon_ [77] comprises a product review network of 11 _,_ 949

users under the musical instrument category, with three

types of relational edges: user-product interactions (shared

reviewed products), user-star associations (identical star rat
ings within a week), and user-review similarities (top 5%

review text similarity via TF-IDF). Each user node is repre
sented by a 25-dimensional feature vector, encompassing

attributes such as rating statistics, voting patterns, temporal

activity, username length, and sentiment analysis of com
ments. The dataset provides a binary ground-truth classifi
cation for fraud detection.

- _Protein_ [27] contains a protein interaction network of 18 _,_ 877

proteins, with three relational edge types: protein-protein

interactions (direct interactions), protein-gene associations

(shared genes), and protein-disease associations (related dis
eases). Each protein node is represented by a 1 _,_ 280-dimensional

feature vector generated from its molecular sequence. Ground
truth labels categorize proteins into six functional classes

according to their biological roles.

- _MAG_ [33] contains a citation network of 113 _,_ 919 papers with

two relational edges: paper-paper citations and paper-author

connections (co-authorship). Node features are Word2Vec

embeddings. Ground-truth labels classify publications into

four research domains from the original dataset.

- _OAG-ENG_ & _OAG-CS_ [109] contain academic citation net
works with 370 _,_ 623 (engineering) and 546 _,_ 704 (computer sci
ence) papers respectively. Relational edges include citations,

shared research fields, and shared authors. Node features

are Word2Vec embeddings of paper keywords. Ground-truth

labels preserve the 20 largest classes, with 77 _,_ 768 (OAG-ENG)

and 50 _,_ 247 (OAG-CS) labeled nodes.

- _RCDD_ [56] contains an anonymized e-commerce network of

421 _,_ 089 _,_ 810 items with relational connections (e.g., item-b
item). Node features are anonymized representations. Ground
truth labels provide a 9:1 imbalanced binary classification

task with 122 _,_ 487 labeled nodes.



18


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA



ACM IMDB MAG OAG-ENG



did not make a big difference for the experiment results, e.g. the _𝜎_ in

Eq. (7) is fixed as 1 for all datasets, and the iteration rounds of SSKC

is fixed as 2 for all small datasets and 10 for all large datasets. We

perform exhaustive grid search over the parameter space of DEMM,
DEMM+, and DEMM-NA to obtain optimal configurations, and analyze

the influence of _𝛼_, _𝛽_, _𝑑_ and _𝐿_ in Section 5.5, _𝑚_ is the dimension
of _𝑬_ [˜] [(] _[𝑟]_ [)] . In datasets with significant edge count disparity across
relations (e.g., _ACM_ ), we set different _𝑚_ for each relation. All the

parameters with the best performance are listed in Table 9, Table 10

and Table 11.


**D.3** **Evaluation Metrics**
The specific mathematical definitions of _Clustering Accuracy_ (ACC),
_Normalized_ _Mutual_ _Information_ (NMI), and _Adjusted_ _Rand_ _Index_

(ARI) are as follows:



0.9

0.8

0.7

0.6

0.5

0.4

10 20 40 80 160 320


**(a) Varying** _𝑚_ **in DEMM+**



0.65


0.55


0.45


0.35


0.25

10 20 40 80 160 320


**(b) Varying** _𝑚_ **in DEMM**



_𝐴𝐶𝐶_ =




- _𝑢𝑖_ ∈V [1] _𝑦𝑢𝑖_ =map( _𝑦𝑢𝑖_ [′] )

_,_
|V|



where _𝑦𝑢_ [′] _𝑖_ and _𝑦𝑢𝑖_ stand for the predicted and ground-truth cluster
labels of node _𝑢𝑖_, respectively, map( _𝑦𝑢_ [′] _𝑖_ ) is the permutation function
thatHungarianmaps eachalgorithm _𝑦𝑢_ [′] _𝑖_ to[39the], equivalentand the valueclusterof 1label _𝑦𝑢𝑖_ =mapprovided( _𝑦𝑢𝑖_ [′] ) is 1viaif
_𝑦𝑢𝑖_ = map( _𝑦𝑢_ [′] _𝑖_ ) and 0 otherwise,



_ARI_



**Figure 24: Varying** _𝑚_ **in DEMM and DEMM+.**


ACM IMDB MAG OAG-ENG


95

85

75

65

55

45

0.1 1 2 4 6 8 10


**Figure 25: Varying** _𝜎_ **in DEMM.**


_ARI_


0.5


0.4


0.3



0.8


0.6


0.4



_𝑁𝑀𝐼_ =




  - _𝑘𝑖_ =1  - _𝑘𝑗_ =1 [| C] _𝑖_ [∗] [∩C] _[𝑗]_ [|] [·][ log] |C|C _𝑖𝑖_ [∗][∗][|·|C][∩C] _[𝑗][𝑗]_ [|][|]

~~√~~



_,_




- _𝑘𝑖_ =1 [| C] _𝑖_ [∗] [|] [·][ log] |C|V| _𝑖_ [∗] [|] [·] ~~√~~ - _𝑘𝑖_ =1 [| C] _[𝑖]_ [|] [·][ log] [|C] |V| _[𝑖]_ [|]



|V|




 - _𝑘𝑖_ =1  - _𝑘𝑗_ =1 �|C _𝑖_ ∗ [∩C] 2 _[𝑗]_ [|]  -  - �� _𝑘𝑖_ =1 �|C2 _𝑖_ ∗ [|]  -  -  - _𝑘𝑗_ =1 �|C2 _𝑗_ |� [�] / [�][|V|] 2  
0 _._ 5 �� _𝑘𝑖_ =1 �|C2 _𝑖_ ∗ [|] - + - _𝑘𝑗_ =1 �|C2 _𝑗_ |� [�] - �� _𝑘𝑖_ =1 �|C2 _𝑖_ ∗ [|] - - - _𝑘𝑗_ =1 �|C2 _𝑗_ |� [�] / [�][|V|] 2 - _[,]_



0.2

3 5 7 9 11 13 15 17


**(a)** _**ACM**_ **and** _**IMDB**_



0.2

6 8 10 12 14 16 18 20


**(b)** _**MAG**_ **and** _**OAG-CS**_



and


_𝐴𝑅𝐼_ =



_ARI_



**Figure 21: Clustering ARI when varying** _𝐿_


_ARI_


0.5

0.4

0.3

0.2

0.1



0.8


0.6


0.4



0.2

2.5 3 3.5 4 4.5 5 5.5 6


**(a)** _**ACM**_ **and** _**IMDB**_



20 30 40 50 60 70 80 90


**(b)** _**MAG**_ **and** _**OAG-CS**_



_ARI_



**Figure 22: Clustering ARI when varying** _𝛽_


_ARI_


0.5


0.4


0.3


0.2



0.8


0.6


0.4


0.2



8 16 32 64 128 256 512 1024


**(a)** _**ACM**_ **and** _**IMDB**_



0.1

4 8 16 32 64 128


**(b)** _**MAG**_ **and** _**OAG-CS**_



**Figure 23: Clustering ARI when varying** _𝑑_


**D.2** **Parameter Settings**


In this section, we introduce the parameters that we did not mention

in the main text. Some parameters are fixed for each dataset since it



where C _𝑖_ [∗] [and] [C] _[𝑖]_ [represent the] _[ 𝑖]_ [-th ground-truth and predicted]
clusters for V in G, respectively.


**D.4** **Parameter Analysis**


We analyze the parameters for NMI and ARI, with results shown in

Figures 16–19 (NMI) and Figures 20–23 (ARI).

The variation trends of NMI and ARI closely align with ACC

across most datasets. In the majority of cases, these metrics attain

their optimal values under consistent conditions, e.g., the ACC,

NMI, and ARI metrics of _ACM_ all achieve their maximum values at
_𝐿_ = 5. However, in rare cases, parameter configurations maximizing

NMI/ARI differ slightly from those optimizing ACC, e.g., NMI and

ARI of _MAG_ peak at _𝐿_ = 16, while ACC get the highest score when
_𝐿_ = 14. In such conflicting situations, we adopt ACC as the decisive

criterion for performance evaluation.


We employ the CountSketch method to the approximate normalized oriented incidence matrix _𝑬_ [ˆ] as _𝑬_ [˜] . According to Corollary 4.5,

selecting an appropriate sketch size _𝑚_ can effectively minimize

the approximation error, we can minimize the approximation error.

From Fig. 24 and Fig. 25, for small and medium datasets _ACM_, _IMDB_
and _MAG_, when _𝑚_ is greater than 10, the results keep invariant
when increase _𝑚_ . For large dataset _OAG-ENG_ with with abundant

edges, the results keep unchanged when _𝑚_ _>_ 40.


Due to the time and space complexity limitations of DEMM (O( _𝑁_ [3] )
and O( _𝑁_ [2] )), we conduct _𝜎_ analysis only on two relatively small



19


Conference’17, July 2017, Washington, DC, USA Lin et al.



datasets _ACM_ and _IMDB_ . Specifically, we find that the performance
of _ACM_ is almost unaffected by the changes of _𝜎_, while the performance of _IMDB_ drops significantly when _𝜎_ is equal to 0 _._ 1. This
is mainly because _IMDB_ has a higher _𝑯_ dimension ( _𝑑_ = 1024).
According to the _distance concentration_ [38], for high-dimensional

data, when _𝜎_ is too small, the off-diagonal elements of the affinity

matrix will be close to 0, which causes the affinity matrix to become

invalid.


**D.5** **Comparison with General-purpose**
**Clustering Methods**


We fuse the MRGs into a single graph, and then use algorithms like

DeepWalk, Node2Vec, and PANE [101] to generate node embeddings

from graph structure, after that, we apply three clustering methods

DBSCAN, BIRCH [110], and K-Means on the embeddings to get the

clustering results. According to Table 12, we find that clustering

methods like DBSCAN, which do not specify the number of clus
ters, tend to result in poor clustering performance. On datasets

such as _ACM_ and _DBLP_, the ACC and ARI scores of clustering
with DBSCAN on embeddings generated by DeepWalk and Node2Vec

are both 0. Meanwhile, we can observe that clustering node em
beddings with K-Means performs better than DBSCAN and BIRCH.
Therefore, in DEMM+, we use K-Means to generate clusters. Additionally, NMF and GMM [16] models are applied on node embeddings

generated by FAAO algorithm with the same parameter settings

as DEMM+.Experimental results indicate that NMF generally outperforms GMM, as the latter tends to overfit when estimating Gaussian

distribution parameters in high-dimensional spaces [23].


**D.6** **Computational Efficiency on CPUs**


To demonstrate the computational advantage of DEMM+ over deep

learning methods, Figure 26 compares their running times on CPUs

across eight datasets of varying scales. Compared to running DEMM+

on GPUs, running it on CPUs achieves more significant acceleration.

Specifically, compared with the best baseline among the methods

listed in Figure 26, DEMM+ achieves speedups of 396×, 47×, 59×,
64×, and 52× on small datasets _ACM_, _DBLP_, _ACM2_, _Yelp_, and _IMDB_

using the CPUs. Compared to training on the GPUs, the average

improvement rate of using the CPU on small datasets is 169 _._ 2%. For

large datasets _MAG_, _Amazon_ and _Protein_, a substantial improvement
is also achieved: DEMM+ achieves speedups of 645×, 23×, and 45×

compared to their respective best baseline. This is mainly because

deep learning methods typically rely more heavily on the massively



parallel computing architecture of GPUs, which means DEMM+ can

operate more efficiently even with limited computational resources.


**E** **Extension to Property Graphs**


Recall that a _property_ _graph_ is typically represented as a tuple
G = (V _,_ E _, ℓ, 𝜋_ ), where V = { _𝑣_ 1 _, 𝑣_ 2 _, . . ., 𝑣𝑁_ } denotes a set of _𝑁_
nodes, E =⊂V × V is a set of _𝑀_ edges. _ℓ_ : V ∪E → 2 [L] is a

labeling function that maps nodes and edges to finite sets of la
bels in L, and _𝜋_ is a function that maps each node or edge to its

respective properties (i.e., key-value pairs). Note that the proper
ties of nodes and edges can be easily encoded as attribute vectors
_𝑿_ [(V)] and _𝑿_ [(E)] with pre-trained language models, respectively,
i.e., _𝜋_ ( _𝑣𝑖_ ) = _𝑿𝑖_ [(V)] or _𝜋_ (( _𝑣𝑖, 𝑣_ _𝑗_ )) = _𝑿_ [(E)] ( _𝑖,𝑗_ ) [. Suppose that there are]
_𝑆_ (resp. _𝑅_ ) distinct labels for nodes (resp. edges) in L. If we re
gard these labels for nodes and edges as their types, the origi
nal property graph can be transformed into an augmented MRG

where both nodes and edges are attributed and of various types, i.e.,
G = ({V [(] _[𝑠]_ [)] } _𝑠_ _[𝑆]_ =1 _[,]_ [ {E][ (] _[𝑟]_ [)] [}] _𝑟_ _[𝑅]_ =1 _[,][ 𝑿]_ [(V)] _[,][ 𝑿]_ [(E)] [)][, where][ V][ (] _[𝑠]_ [)] [(resp.][ E][ (] _[𝑟]_ [)] [)]

is the set of nodes (resp. edges) with the _𝑠_ -th (resp. _𝑟_ -th) labels.

To extend our DEMM and DEMM+ to such graphs, we can first adapt
the MRDE LMRDE in Eq. (3) to the _𝑆_ types of nodes with the _𝑅_ edge
sets {E [(] _[𝑟]_ [)] } _𝑟_ _[𝑅]_ =1 [in][ G][ as follows:]



_𝑅_
∑︁

_𝜔𝑠,𝑟_   - D( _𝑯, 𝑨_ [(] _[𝑟]_ [)] [V [(] _[𝑠]_ [)] _,_ V [(] _[𝑠]_ [)] ]) _,_ (22)

_𝑟_ =1



LMRDE =



_𝑆_
∑︁


_𝑠_ =1



where _𝜔𝑠,𝑟_ is the weight for node type _𝑠_ and edge type _𝑟_, and
_𝑨_ [(] _[𝑟]_ [)] [V [(] _[𝑠]_ [)] _,_ V [(] _[𝑠]_ [)] ] is the adjacency matrix constructed from edge
set E [(] _[𝑟]_ [)] and only contains nodes in V [(] _[𝑠]_ [)] . Accordingly, the other
two terms Lfit and Lreg in the Stage I objective in Eq. (4) can be

adjusted as



_𝑅_
∑︁

_𝜔𝑠,𝑟_   - ∥ _𝑨_ [ˆ] [(] _[𝑟]_ [)] [V [(] _[𝑠]_ [)] _,_ V [(] _[𝑠]_ [)] ]∥ _𝐹_ [2] _[.]_ [(23)]
_𝑟_ =1



Lfit = ∥ _𝑯_ - _𝑿_ [(V)] ∥ _𝐹_ [2] _[,]_ Lreg =



_𝑆_
∑︁


_𝑠_ =1



As for the attribute vectors of edges in _𝑿_ [(E)], one simple way

to incorporate such information into the objective function is to

replace the above fitting term by the following term:



∑︁


( _𝑣𝑖,𝑣𝑗_ )∈E [(] _[𝑟]_ [)]



Lfit = ∥ _𝑯_ - _𝑿_ ∥ [2] _𝐹_ [and] _[ 𝑿][𝑖]_ [=] _[ 𝑿]_ _𝑖_ [(V)] + _𝑅_ [1]



_𝑅_
∑︁


_𝑟_ =1



_𝑿_ [(E)] ( _𝑖,𝑗_ )

_._ (24)
_𝑑_ [(] _[𝑟]_ [)]
_𝑖_



In doing so, DEMM and DEMM+ follow the same updating rules for _𝑯_
and { _𝜔𝑠,𝑟_ } _𝑠_ _[𝑆,𝑅]_ =1 _,𝑟_ =1 [described in Sections][ 3][ and][ 4][.]



20


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA


**Table 12: Comparison with general-purpose clustering methods. (best is highlighted in blue and best baseline underlined)**



|Embddings|Method|Metric|ACM ACM2 DBLP IMDB Yelp Amazon MAG OAG-CS OAG-ENG Protein RCDD|
|---|---|---|---|
|DeepWalk|DBSCAN|ACC<br>NMI<br>ARI|0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>3_._02<br>2_._17<br>22_._5<br>-<br>24_._01<br>23_._34<br>28_._34<br>23_._54<br>23_._34<br>5_._2<br>22_._13<br>38_._2<br>28_._56<br>56_._1<br>-<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>1_._33<br>0_._84<br>16_._5<br>-|
|DeepWalk|BIRCH|ACC<br>NMI<br>ARI|64_._98<br>64_._82<br>81_._86<br>37_._92<br>64_._27<br>84_._24<br>55_._12<br>30_._42<br>28_._51<br>33_._2<br>-<br>41_._12<br>37_._75<br>53_._28<br>0_._0<br>38_._53<br>0_._0<br>46_._7<br>28_._56<br>22_._67<br>9_._6<br>-<br>34_._32<br>30_._28<br>59_._52<br>0_._0<br>42_._02<br>3_._4<br>39_._72<br>14_._23<br>11_._86<br>0_._0<br>-|
|DeepWalk|_𝐾_-Means|ACC<br>NMI<br>ARI|65_._52<br>64_._96<br>88_._51<br>37_._66<br>53_._18<br>67_._55<br>51_._27<br>31_._2<br>22_._43<br>28_._64<br>-<br>41_._83<br>37_._48<br>69_._09<br>0_._2<br>20_._72<br>0_._37<br>34_._6<br>33_._77<br>18_._97<br>9_._6<br>-<br>35_._66<br>30_._41<br>73_._01<br>0_._1<br>18_._57<br>0_._56<br>27_._93<br>16_._82<br>11_._34<br>5_._5<br>-|
|node2vec|DBSCAN|ACC<br>NMI<br>ARI|0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>2_._13<br>3_._45<br>12_._9<br>-<br>24_._01<br>22_._31<br>28_._34<br>23_._54<br>23_._34<br>5_._2<br>29_._23<br>41_._47<br>33_._56<br>28_._3<br>-<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._0<br>0_._57<br>0_._0<br>0_._0<br>-|
|node2vec|BIRCH|ACC<br>NMI<br>ARI|59_._45<br>62_._43<br>80_._52<br>33_._55<br>66_._39<br>63_._9<br>58_._64<br>32_._53<br>29_._43<br>24_._17<br>-<br>36_._25<br>38_._41<br>56_._46<br>0_._0<br>36_._78<br>0_._0<br>47_._12<br>32_._57<br>28_._64<br>4_._2<br>-<br>28_._86<br>29_._56<br>58_._46<br>0_._0<br>42_._15<br>0_._0<br>39_._52<br>17_._1<br>16_._8<br>0_._0<br>-|
|node2vec|_𝐾_-Means|ACC<br>NMI<br>ARI|62_._28<br>66_._54<br>85_._56<br>34_._25<br>58_._53<br>50_._37<br>50_._29<br>32_._82<br>30_._12<br>22_._1<br>-<br>35_._12<br>38_._02<br>68_._39<br>0_._0<br>21_._34<br>0_._0<br>33_._67<br>34_._4<br>31_._22<br>6_._8<br>-<br>28_._89<br>32_._55<br>71_._03<br>0_._0<br>22_._31<br>0_._0<br>26_._84<br>18_._6<br>18_._96<br>4_._3<br>-|
|PANE|DBSCAN|ACC<br>NMI<br>ARI|34_._37<br>25_._85<br>36_._87<br>18_._14<br>42_._16<br>92_._13<br>22_._03<br>2_._55<br>1_._17<br>23_._1<br>-<br>29_._9<br>23_._44<br>39_._48<br>16_._37<br>27_._06<br>0_._0<br>11_._26<br>28_._46<br>33_._54<br>30_._2<br>-<br>18_._37<br>6_._03<br>25_._33<br>0_._4<br>20_._57<br>0_._0<br>0_._0<br>0_._58<br>1_._21<br>10_._5<br>-|
|PANE|BIRCH|ACC<br>NMI<br>ARI|36_._63<br>49_._56<br>46_._04<br>38_._7<br>67_._41<br>91_._3<br>28_._1<br>29_._51<br>26_._54<br>29_._8<br>-<br>4_._38<br>0_._0<br>23_._12<br>0_._5<br>35_._81<br>0_._0<br>1_._18<br>21_._32<br>19_._51<br>8_._4<br>-<br>0_._53<br>0_._0<br>16_._44<br>0_._0<br>39_._76<br>0_._0<br>0_._0<br>11_._22<br>10_._56<br>2_._6<br>-|
|PANE|_𝐾_-Means|ACC<br>NMI<br>ARI|64_._69<br>67_._55<br>41_._63<br>37_._89<br>67_._52<br>91_._31<br>28_._14<br>30_._25<br>24_._84<br>30_._21<br>-<br>44_._62<br>43_._35<br>17_._94<br>0_._5<br>29_._51<br>0_._0<br>1_._1<br>31_._02<br>23_._67<br>10_._87<br>-<br>43_._37<br>32_._17<br>12_._18<br>0_._0<br>33_._41<br>0_._0<br>0_._0<br>15_._67<br>10_._98<br>6_._35<br>-|
|-|NMF|ACC<br>NMI<br>ARI|92_._07<br>90_._09<br>31_._08<br>53_._69<br>91_._06<br>67_._33<br>29_._48<br>18_._42<br>16_._55<br>27_._33<br>81_._25<br>72_._94<br>68_._92<br>2_._14<br>15_._52<br>69_._47<br>0_._13<br>4_._15<br>15_._12<br>10_._66<br>8_._7<br>0_._0<br>77_._92<br>73_._84<br>3_._94<br>16_._87<br>74_._15<br>0_._0<br>0_._01<br>6_._94<br>3_._98<br>4_._9<br>0_._0|
|-|GMMs|ACC<br>NMI<br>ARI|65_._82<br>83_._73<br>34_._78<br>37_._77<br>87_._11<br>82_._15<br>47_._67<br>10_._97<br>14_._38<br>29_._48<br>82_._3<br>61_._15<br>59_._03<br>2_._8<br>0_._16<br>60_._17<br>0_._0<br>36_._21<br>4_._07<br>9_._83<br>9_._61<br>0_._0<br>50_._72<br>58_._51<br>3_._15<br>0_._0<br>62_._6<br>0_._0<br>26_._64<br>1_._06<br>3_._26<br>6_._56<br>0_._0|
|DEMM+|DEMM+|ACC<br>NMI<br>ARI|93_._6<br>91_._3<br>93_._7<br>67_._6<br>92_._7<br>92_._6<br>67_._8<br>40_._1<br>42_._3<br>92_._6<br>83_._4<br>77_._2<br>71_._2<br>79_._6<br>24_._4<br>72_._0<br>15_._7<br>63_._3<br>42_._7<br>41_._8<br>19_._4<br>18_._6<br>81_._9<br>74_._7<br>84_._8<br>26_._5<br>77_._4<br>34_._2<br>52_._3<br>24_._1<br>24_._8<br>12_._8<br>29_._0|


BMGC BTGF DMG DuaLGR


MGDCR DMGI DEMM+







10 [3]


10 [2]


10


1



10 [3]


10 [2]


10


1


**(c)** _**DBLP**_


10 [3]


10 [2]


10


1


**(g)** _**MAG**_



10 [3]


10 [2]


10


1


**(d)** _**IMDB**_


10 [3]


10 [2]


10


1


**(h)** _**Protein**_



**(a)** _**ACM**_


10 [3]


10 [2]


10


1


**(e)** _**Yelp**_


**References**



10 [3]


10 [2]


10


1


**(b)** _**ACM2**_


10 [3]


10 [2]


10


1


**(f)** _**Amazon**_



**Figure 26: Computational efficiency comparison on CPUs.**




[1] Esra Akbas and Peixiang Zhao. 2017. Attributed Graph Clustering: an Attributeaware Graph Embedding Approach. _ASONAM_ (2017).

[2] Arian Ashourvan, Qawi K Telesford, Timothy Verstynen, Jean M Vettel, and

Danielle S Bassett. 2019. Multi-scale detection of hierarchical community architecture in structural and functional brain networks. _Plos one_ (2019), e0215520.




[3] Aritra Bhowmick, Mert Kosan, Zexi Huang, Ambuj Singh, and Sourav Medya.

2024. DGCLUSTER: A Neural Framework for Attributed Graph Clustering via
Modularity Maximization. In _AAAI_, Vol. 38. 11069–11077.

[4] Vincent D Blondel, Jean-Loup Guillaume, Renaud Lambiotte, and Etienne Lefebvre. 2008. Fast unfolding of communities in large networks. _Journal of statistical_
_mechanics: theory and experiment_ 2008, 10 (2008), P10008.

[5] Deyu Bo, Xiao Wang, Chuan Shi, Meiqi Zhu, Emiao Lu, and Peng Cui. 2020.
Structural Deep Clustering Network. In _Proceedings of The Web Conference 2020_ .



21


Conference’17, July 2017, Washington, DC, USA Lin et al.



Association for Computing Machinery, 1400–1410.

[6] Cécile Bothorel, Juan David Cruz, Matteo Magnani, and Barbora Micenkova.
2015. Clustering attributed graphs: models, measures and methods. _Network_
_Science_ 3, 3 (2015), 408–444.

[7] Jinyu Cai, Jicong Fan, Wenzhong Guo, Shiping Wang, Yunhe Zhang, and Zhao
Zhang. 2022. Efficient Deep Embedded Subspace Clustering. _CVPR_ (2022),

21–30.

[8] Kamalika Chaudhuri, Sham M. Kakade, Karen Livescu, and Karthik Sridharan.
2009. Multi-view clustering via canonical correlation analysis. In _International_
_Conference on Machine Learning_ .

[9] Mansheng Chen, Jia-Qi Lin, Changdong Wang, Wu-Dong Xi, and Dong Huang.

2023. On Regularizing Multiple Clusterings for Ensemble Clustering by Graph
Tensor Learning. _MM_ (2023).

[10] Jiafeng Cheng, Qianqian Wang, Zhiqiang Tao, Deyan Xie, and Quanxue Gao.

2020. Multi-View Attribute Graph Convolution Networks for Clustering. In
_International Joint Conference on Artificial Intelligence_ .

[11] Kenneth L Clarkson and David P Woodruff. 2017. Low-rank approximation and
regression in input sparsity time. _Journal of the ACM (JACM)_ 63, 6 (2017), 1–45.

[12] David Combe, Christine Largeron, Mathias Géry, and Elöd Egyed-Zsigmond.
2015. I-Louvain: An Attributed Graph Clustering Method. In _International_
_Symposium on Intelligent Data Analysis_ .

[13] J. J. Crofts, M. Forrester, S. Coombes, and R. D. O’Dea. 2022. Structure-Function
Clustering in Weighted Brain Networks. _Scientific Reports_ 12 (2022), 16793.

[14] Chenhang Cui, Yazhou Ren, Jingyu Pu, Xiaorong Pu, and Lifang He. 2023. Deep
multi-view subspace clustering with anchor graph. In _IJCAI_ . 3577–3585.

[15] Ganqu Cui, Jie Zhou, Cheng Yang, and Zhiyuan Liu. 2020. Adaptive Graph
Encoder for Attributed Graph Embedding. _KDD_ (2020).

[16] A. P. Dempster, N. M. Laird, and D. B. Rubin. 2018. Maximum Likelihood from
Incomplete Data Via the EM Algorithm. _JRSS_ 39, 1 (12 2018), 1–22.

[17] Fnu Devvrit, Aditya Sinha, Inderjit Dhillon, and Prateek Jain. 2022. S3GC:
scalable self-supervised graph clustering. _NeurIPS_ 35 (2022), 3248–3261.

[18] Ouxia Du and Ya Li. 2022. Academic Collaborator Recommendation Based on
Attributed Network Embedding. _J. Data Inf. Sci._ 7, 1 (2022), 37–56.

[19] Ky Fan. 1949. On a theorem of Weyl concerning eigenvalues of linear transformations I. _PNAS_ 35, 11 (1949), 652–655.

[20] Shaohua Fan, Xiao Wang, Chuan Shi, Emiao Lu, Ken Lin, and Bai Wang. 2020.
One2Multi Graph Autoencoder for Multi-view Graph Clustering. _WWW_ (2020).

[21] Wenqi Fan, Yao Ma, Qing Li, Jianping Wang, Guoyong Cai, Jiliang Tang, and

Dawei Yin. 2022. A Graph Neural Network Framework for Social Recommendations. _TKDE_ 34, 5 (2022), 2033–2047.

[22] Chakib Fettal, Lazhar Labiod, and Mohamed Nadif. 2023. Scalable AttributedGraph Subspace Clustering. In _AAAI_, Vol. 37.

[23] Chris Fraley and Adrian Raftery. 2002. Model-Based Clustering, Discriminant
Analysis, and Density Estimation. _JASA_ 97 (06 2002), 611–631.

[24] Xinyu Fu, Jiani Zhang, Ziqiao Meng, and Irwin King. 2020. MAGNN: Metap
ath Aggregated Graph Neural Network for Heterogeneous Graph Embedding.
_WWW_ (2020).

[25] Olivier Goldschmidt and Dorit S Hochbaum. 1988. Polynomial algorithm for
the k-cut problem. In _FOCS_ . 444–451.

[26] Aditya Grover and Jure Leskovec. 2016. node2vec: Scalable feature learning for
networks. In _KDD_ . 855–864.

[27] Yaowen Gu, Si Zheng, Qijin Yin, Rui Jiang, and Jiao Li. 2022. REDDA: Integrating

multiple biological relations to heterogeneous graph neural network for drugdisease association prediction. _Computers in Biology and Medicine_ 150 (2022),

106127.

[28] Soumaya Guesmi, Chiraz Trabelsi, and Chiraz Latiri. 2019. Community detection
in multi-relational social networks based on relational concept analysis. _PCS_

159 (2019), 291–300.

[29] Kaveh Hassani and Amir Hosein Khas Ahmadi. 2020. Contrastive Multi-View
Representation Learning on Graphs. In _ICML_ .

[30] Alfred Horn. 1962. Eigenvalues of sums of Hermitian matrices. (1962).

[31] Roger A Horn and Charles R Johnson. 2012. _Matrix_ _analysis_ . Cambridge

university press.

[32] Fenyu Hu, Yanqiao Zhu, Shu Wu, Liang Wang, and Tieniu Tan. 2019. Hierarchical
graph convolutional networks for semi-supervised node classification. In _IJCAI_ .

[33] Weihua Hu, Matthias Fey, Marinka Zitnik, Yuxiao Dong, Hongyu Ren, Bowen

Liu, Michele Catasta, and Jure Leskovec. 2020. Open Graph Benchmark: Datasets
for Machine Learning on Graphs. _ArXiv_ abs/2005.00687 (2020).

[34] Shudong Huang, Yixi Liu, Ivor Wai-Hung Tsang, Zenglin Xu, and Jiancheng Lv.

2023. Multi-View Subspace Clustering by Joint Measuring of Consistency and
Diversity. _TKDE_ 35 (2023), 8270–8281.

[35] Guangyu Huo, Yong Zhang, Junbin Gao, Boyue Wang, Yongli Hu, and Baocai Yin.

2021. CaEGCN: Cross-Attention Fusion Based Enhanced Graph Convolutional
Network for Clustering. _IEEE Transactions on Knowledge and Data Engineering_

35 (2021), 3471–3483.

[36] Zhao Kang, Wangtao Zhou, Zhitong Zhao, Junming Shao, Meng Han, and

Zenglin Xu. 2020. Large-scale multi-view subspace clustering in linear time. In
_AAAI_, Vol. 34. 4412–4419.




[37] Philip A Knight. 2008. The Sinkhorn–Knopp algorithm: convergence and applications. _SIAM J. Matrix Anal. Appl._ 30, 1 (2008), 261–275.

[38] Hans-Peter Kriegel, Peer Kröger, and Arthur Zimek. 2009. Clustering high
dimensional data: A survey on subspace clustering, pattern-based clustering,

and correlation clustering. 3, 1, Article 1 (2009), 58 pages.

[39] Harold W Kuhn. 1955. The Hungarian method for the assignment problem.
_Naval research logistics quarterly_ 2, 1-2 (1955), 83–97.

[40] Xinying Lai, Dingming Wu, Christian S Jensen, and Kezhong Lu. 2023. A Reevaluation of Deep Learning Methods for Attributed Graph Clustering. In _CIKM_ .

1168–1177.

[41] Richard B Lehoucq and Danny C Sorensen. 1996. Deflation techniques for an
implicitly restarted Arnoldi iteration. _SIAM J. Matrix Anal. Appl._ 17, 4 (1996),

789–821.

[42] David A Levin and Yuval Peres. 2017. _Markov chains and mixing times_ . Vol. 107.

American Mathematical Soc.

[43] Mingqi Li, Wenming Ma, and Zihao Chu. 2024. KGIE: Knowledge graph convolutional network for recommender system with interactive embedding. _Knowledge-_
_Based Systems_ 295 (2024), 111813.

[44] Rui Li, Xin Yuan, Mohsen Radfar, Peter Marendy, Wei Ni, Terrence J O’Brien, and

Pablo M Casillas-Espinosa. 2021. Graph signal processing, graph neural network
and graph learning on biological data: a systematic review. _IEEE Reviews in_
_Biomedical Engineering_ 16 (2021), 109–135.

[45] Yiran Li, Gongyao Guo, Jieming Shi, Renchi Yang, Shiqi Shen, Qing Li, and

Jun Luo. 2024. A versatile framework for attributed network clustering via
K-nearest neighbor augmentation. _VLDBJ_ (2024), 1–31.

[46] Ye Li, Chaofeng Sha, Xin Huang, and Yanchun Zhang. 2018. Community Detection in Attributed Graphs: An Embedding Approach. In _AAAI_ .

[47] Yiran Li, Renchi Yang, and Jieming Shi. 2023. Efficient and effective attributed
hypergraph clustering via k-nearest neighbor augmentation. _SIGMOD_ 1, 2

(2023), 1–23.

[48] Zhenglai Li, Chang Tang, Xinwang Liu, Xiao Zheng, Guanghui Yue, Wei Zhang,
and En Zhu. 2021. Consensus Graph Learning for Multi-View Clustering. _IEEE_
_Transactions on Multimedia_ 24 (2021), 2461–2472.

[49] Boris Viktorovich Lidskii. 1982. Spectral polyhedron of a sum of two Hermitian
matrices. _Functional Analysis and Its Applications_ 16, 2 (1982), 139–140.

[50] Xiaoyang Lin, Renchi Yang, Haoran Zheng, and Xiangyu Ke. 2025. Spectral
Subspace Clustering for Attributed Graphs. In _KDD_ . 789–799.

[51] Zhiping Lin and Zhao Kang. 2021. Graph Filter-based Multi-view Attributed
Graph Clustering. In _IJCAI_ .

[52] Zizheng Lin, Haowen Ke, Ngo-Yin Wong, Jiaxin Bai, Yangqiu Song, Huan Zhao,

and Junpeng Ye. 2021. Multi-relational graph based heterogeneous multi-task
learning in community question answering. In _CIKM_ . 1038–1047.

[53] Yawen Ling, Jianpeng Chen, Yazhou Ren, Xiaorong Pu, Jie Xu, Xiaofeng Zhu,

and Lifang He. 2023. Dual Label-Guided Graph Refinement for Multi-View
Graph Clustering. In _AAAI_ .

[54] Liang Liu, Zhao Kang, Ling Tian, Wenbo Xu, and Xixu He. 2021. Multilayer
Graph Contrastive Clustering Network. _ArXiv_ abs/2112.14021 (2021).

[55] Weifeng Liu, Jose C Principe, and Simon Haykin. 2011. _Kernel adaptive filtering:_
_a comprehensive introduction_ . John Wiley & Sons.

[56] Yue Liu, Ke Liang, Jun Xia, Sihang Zhou, Xihong Yang, Xinwang Liu, and Stan Z
Li. 2023. Dink-net: Neural clustering on large graphs. In _International Conference_
_on Machine Learning_ . PMLR, 21794–21812.

[57] Yue Liu, Wenxuan Tu, Sihang Zhou, Xinwang Liu, Linxuan Song, Xihong Yang,

and En Zhu. 2022. Deep Graph Clustering via Dual Correlation Reduction. In
_AAAI_, Vol. 36. 7603–7611.

[58] Yue Liu, Jun Xia, Sihang Zhou, Xihong Yang, Ke Liang, Chenchen Fan, Yan

Zhuang, Stan Z Li, Xinwang Liu, and Kunlun He. 2022. A Survey of Deep Graph
Clustering: Taxonomy, Challenge, Application, and Open Resource. _arXiv_
_preprint arXiv:2211.12875_ (2022).

[59] Yujie Mo, Yuhuan Chen, Yajie Lei, Liang Peng, Xiaoshuang Shi, Changan Yuan,

and Xiaofeng Zhu. 2023. Multiplex Graph Representation Learning Via Dual
Correlation Reduction. _TKDE_ 35 (2023), 12814–12827.

[60] Yujie Mo, Yajie Lei, Jialie Shen, Xiaoshuang Shi, Heng Tao Shen, and Xiaofeng
Zhu. 2023. Disentangled Multiplex Graph Representation Learning. In _Interna-_
_tional Conference on Machine Learning_ .

[61] Mark EJ Newman. 2006. Finding community structure in networks using the
eigenvectors of matrices. _Physical_ _Review_ _E—Statistical,_ _Nonlinear,_ _and_ _Soft_
_Matter Physics_ 74, 3 (2006), 036104.

[62] A. Ng, Michael I. Jordan, and Yair Weiss. 2001. On Spectral Clustering: Analysis
and an algorithm. In _Neural Information Processing Systems_ .

[63] Feiping Nie, Jing Li, and Xuelong Li. 2017. Self-weighted Multiview Clustering
with Multiple Graphs. In _IJCAI_ .

[64] Erlin Pan and Zhao Kang. 2021. Multi-view Contrastive Graph Clustering. In
_NIPS_ .

[65] Erlin Pan and Zhao Kang. 2023. Beyond Homophily: Reconstructing Structure
for Graph-agnostic Clustering. In _ICML_ .

[66] Chanyoung Park, Donghyun Kim, Jiawei Han, and Hwanjo Yu. 2019. Unsupervised Attributed Multiplex Network Embedding. In _AAAI_ .



22


Effective Clustering for Large Multi-Relational Graphs Conference’17, July 2017, Washington, DC, USA




[67] Hao Peng, Ruitong Zhang, Yingtong Dou, Renyu Yang, Jingyi Zhang, and Philip S.

Yu. 2021. Reinforced Neighborhood Selection Guided Multi-Relational Graph
Neural Networks. _ACM Trans. Inf. Syst._, Article 69 (Dec. 2021), 46 pages.

[68] Liang Peng, Xin Wang, and Xiaofeng Zhu. 2023. Unsupervised Multiplex Graph
learning with Complementary and Consistent Information. _MM_ (2023).

[69] Bryan Perozzi, Rami Al-Rfou, and Steven Skiena. 2014. Deepwalk: Online
learning of social representations. In _KDD_ . 701–710.

[70] Xiaowei Qian, Bingheng Li, and Zhao Kang. 2023. Upper Bounding Barlow
Twins: A Novel Filter for Multi-Relational Clustering. _ArXiv_ abs/2312.14066

(2023).

[71] Usha Nandini Raghavan, Réka Albert, and Soundar Kumara. 2007. Near linear
time algorithm to detect community structures in large-scale networks. _Physical_
_Review E—Statistical, Nonlinear, and Soft Matter Physics_ 76, 3 (2007), 036106.

[72] Ali Rahimi and Benjamin Recht. 2007. Random features for large-scale kernel
machines. _Advances in neural information processing systems_ 20 (2007).

[73] Franco Scarselli, Marco Gori, Ah Chung Tsoi, Markus Hagenbuchner, and
Gabriele Monfardini. 2009. The Graph Neural Network Model. _IEEE Transactions_
_on Neural Networks_ 20 (2009), 61–80.

[74] John Shawe-Taylor and Nello Cristianini. 2004. _Kernel_ _methods_ _for_ _pattern_
_analysis_ . Cambridge university press.

[75] Zhixiang Shen, Haolan He, and Zhao Kang. 2024. Balanced Multi-Relational
Graph Clustering. _ArXiv_ abs/2407.16863 (2024).

[76] Zhixiang Shen, Shuo Wang, and Zhao Kang. 2024. Beyond Redundancy:
Information-aware Unsupervised Multiplex Graph Structure Learning. _ArXiv_

abs/2409.17386 (2024).

[77] Chuan Shi, Yuanfu Lu, Linmei Hu, Zhiyuan Liu, and Huadong Ma. 2022. RHINE:

Relation Structure-Aware Heterogeneous Information Network Embedding.
_IEEE Transactions on Knowledge and Data Engineering_ 34 (2022), 433–447.

[78] Jianbo Shi and Jitendra Malik. 2000. Normalized cuts and image segmentation.
_TPAMI_ 22, 8 (2000), 888–905.

[79] Richard Sinkhorn and Paul Knopp. 1967. Concerning nonnegative matrices and
doubly stochastic matrices. _Pacific J. Math._ 21, 2 (1967), 343–348.

[80] Jeong-Woo Son, Junekey Jeon, Sang-Yun Lee, and Sun-Joong Kim. 2016. Adaptive
spectral co-clustering for multiview data. _2016 18th International Conference on_
_Advanced Communication Technology (ICACT)_ (2016), 447–450.

[81] Alexander Strehl and Joydeep Ghosh. 2003. Cluster ensembles — a knowledge
reuse framework for combining multiple partitions. _Journal of Machine Learning_
_Research_ 3 (2003), 583–617.

[82] Yuze Tan, Yixi Liu, Hongjie Wu, Jiancheng Lv, and Shudong Huang. 2023. Metric
multi-view graph clustering. In _AAAI_, Vol. 37. 9962–9970.

[83] Chang Tang, Zhenglai Li, J. Wang, Xinwang Liu, Wei Zhang, and En Zhu.
2023. Unified One-Step Multi-View Spectral Clustering. _IEEE Transactions on_
_Knowledge and Data Engineering_ 35 (2023), 6449–6460.

[84] Jiangnan Tang, Huanhuan Gu, Darko B Vuković, Guandong Xu, Youquan Wang,

Haicheng Tao, and Jie Cao. 2025. Fraud detection in multi-relation graph:
Contrastive Learning on Feature and Structural Levels. _Neurocomputing_ (2025),

130063.

[85] Lei Tang, Xufei Wang, and Huan Liu. 2012. Community detection via heterogeneous interaction analysis. _DMKD_ (2012), 1–33.

[86] Wei Tang, Zhengdong Lu, and Inderjit S. Dhillon. 2009. Clustering with Multiple
Graphs. _ICDM_ (2009), 1016–1021.

[87] Anton Tsitsulin, John Palowitch, Bryan Perozzi, and Emmanuel Müller. 2023.
Graph clustering with graph neural networks. _Journal of Machine Learning_
_Research_ 24, 127 (2023), 1–21.

[88] Ulrike Von Luxburg. 2007. A tutorial on spectral clustering. _Statistics_ _and_
_computing_ 17 (2007), 395–416.

[89] Dorothea Wagner and Frank Wagner. 1993. Between min cut and graph bisection. In _Mathematical Foundations of Computer Science 1993: 18th International_
_Symposium, MFCS’93 Gdańsk, Poland, August 30–September 3, 1993 Proceedings_
_18_ . Springer, 744–750.

[90] Chun Wang, Shirui Pan, Ruiqi Hu, Guodong Long, Jing Jiang, and Chengqi

Zhang. 2019. Attributed graph clustering: a deep attentional embedding approach. In _IJCAI_ . 3670–3676.

[91] Chenxu Wang, Mengqin Wang, Xiaoguang Wang, Luyue Zhang, and Yi Long.

2024. Multi-Relational Graph Representation Learning for Financial Statement
Fraud Detection. _Big Data Mining and Analytics_ 7, 3 (2024), 920–941.

[92] Xiaobo Wang, Xiaojie Guo, Zhen Lei, Changqing Zhang, and S. Li. 2017.
Exclusivity-Consistency Regularized Multi-view Subspace Clustering. _CVPR_

(2017), 1–9.




[93] Xiao Wang, Houye Ji, Chuan Shi, Bai Wang, Peng Cui, Philip S. Yu, and Yanfang
Ye. 2019. Heterogeneous Graph Attention Network. _The_ _World_ _Wide_ _Web_
_Conference_ (2019).

[94] Yunchao Wei, Yao Zhao, Zhenfeng Zhu, Yanhui Xiao, and Shikui Wei. 2014.
Learning a mid-level feature space for cross-media regularization. _ICME_ (2014),

1–6.

[95] Martha White, Yaoliang Yu, Xinhua Zhang, and Dale Schuurmans. 2012. Convex
Multi-view Subspace Learning. In _Neural Information Processing Systems_ .

[96] Hui Xia, Shu shu Shao, Chun qiang Hu, Rui Zhang, Tie Qiu, and Fu Xiao.

2023. Robust Clustering Model Based on Attention Mechanism and Graph
Convolutional Network. _TKDE_ 35 (2023), 5203–5215.

[97] Wei Xia, Sen Wang, Ming Yang, Quanxue Gao, Jungong Han, and Xinbo Gao.

2021. Multi-view graph embedding clustering network: Joint self-supervision
and block diagonal representation. _Neural networks : the official journal of the_
_International Neural Network Society_ 145 (2021), 1–9.

[98] Kun Xie, Renchi Yang, and Sibo Wang. 2025. Diffusion-based Graph-agnostic
Clustering. In _TheWebConf_ . 1353–1364.

[99] Renchi Yang and Jieming Shi. 2024. Efficient High-Quality Clustering for Large
Bipartite Graphs. _SIGMOD_ 2, 1 (2024), 1–27.

[100] Renchi Yang, Jieming Shi, Xiaokui Xiao, Yin Yang, Sourav S Bhowmick, and

Juncheng Liu. 2023. PANE: scalable and effective attributed network embedding.
_VLDBJ_ 32, 6 (2023), 1237–1262.

[101] Renchi Yang, Jieming Shi, Xiaokui Xiao, Yin Yang, Juncheng Liu, Sourav S

Bhowmick, et al. 2020. Scaling attributed network embedding to massive graphs.
_VLDB_ 14, 1 (2020), 37–49.

[102] Renchi Yang, Jieming Shi, Yin Yang, Keke Huang, Shiqi Zhang, and Xiaokui

Xiao. 2021. Effective and scalable clustering on massive attributed graphs. In
_TheWebConf_ . 3675–3687.

[103] Renchi Yang, Yidu Wu, Xiaoyang Lin, Qichen Wang, Tsz Nam Chan, and Jieming
Shi. 2024. Effective Clustering on Large Attributed Bipartite Graphs. In _KDD_ .

3782–3793.

[104] Xihong Yang, Yue Liu, Sihang Zhou, Siwei Wang, Wenxuan Tu, Qun Zheng,

Xinwang Liu, Liming Fang, and En Zhu. 2023. Cluster-guided Contrastive Graph
Clustering Network. _ArXiv_ abs/2301.01098 (2023).

[105] Zaihan Yang, Dawei Yin, and Brian D Davison. 2014. Recommendation in
academia: A joint multi-relational model. In _ASONAM 2014_ . IEEE, 566–571.

[106] Felix Xinnan X Yu, Ananda Theertha Suresh, Krzysztof M Choromanski,

Daniel N Holtmann-Rice, and Sanjiv Kumar. 2016. Orthogonal random features.
_Advances in neural information processing systems_ 29 (2016).

[107] Stella X. Yu and Jianbo Shi. 2003. Multiclass Spectral Clustering. In _ICCV_ .

313–319.

[108] Xiang Yue, Zhen Wang, Jingong Huang, Srinivasan Parthasarathy, Soheil

Moosavinasab, Yungui Huang, Simon M Lin, Wen Zhang, Ping Zhang, and

Huan Sun. 2019. Graph embedding on biomedical networks: methods, applications and evaluations. _Bioinformatics_ 36, 4 (10 2019), 1241–1251.

[109] Fanjin Zhang, Xiao Liu, Jie Tang, Yuxiao Dong, Peiran Yao, Jie Zhang, Xiaotao

Gu, Yan Wang, Bin Shao, Rui Li, and Kuansan Wang. 2019. OAG: Toward Linking
Large-scale Heterogeneous Entity Graphs. _KDD_ (2019).

[110] Tian Zhang, Raghu Ramakrishnan, and Miron Livny. 1996. BIRCH: an efficient
data clustering method for very large databases. _SIGMOD Rec._ 25, 2 (1996).

[111] Han Zhao, Xu Yang, Zhenru Wang, Erkun Yang, and Cheng Deng. 2021. Graph
Debiased Contrastive Learning with Joint Representation Clustering. In _Inter-_
_national Joint Conference on Artificial Intelligence_ .

[112] Jianan Zhao, Xiao Wang, Chuan Shi, Zekuan Liu, and Yanfang Ye. 2020. Network
Schema Preserving Heterogeneous Information Network Embedding.. In _IJCAI_ .

1366–1372. Scheduled for July 2020, Yokohama, Japan, postponed due to the

Corona pandemic..

[113] Qiqi Zhao, Huifang Ma, Lijun Guo, and Zhixin Li. 2022. Hierarchical attention
network for attributed community detection of joint representation. _Neural_
_Computing and Applications_ 34 (2022), 5587 – 5601.

[114] Haoran Zheng, Renchi Yang, and Jianliang Xu. 2025. Adaptive Local Clustering
over Attributed Graphs. In _ICDE_ . IEEE Computer Society, 2052–2065.

[115] Dengyong Zhou and Christopher J. C. Burges. 2007. Spectral clustering and
transductive learning with multiple views. In _ICML_ .

[116] Dengyong Zhou and Bernhard Schölkopf. 2005. Regularization on discrete
spaces. In _Joint Pattern Recognition Symposium_ . Springer, 361–368.

[117] Hao Zhu and Piotr Koniusz. 2021. Simple Spectral Graph Convolution. In _ICLR_ .

[118] Shuman Zhuang, Sujia Huang, Wei Huang, Yuhong Chen, Zhihao Wu, and

Ximeng Liu. 2024. Enhancing Multi-view Graph Neural Network with Crossview Confluent Message Passing. In _MM_ .



23


