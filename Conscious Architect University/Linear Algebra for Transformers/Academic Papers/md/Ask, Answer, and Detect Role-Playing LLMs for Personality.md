## **Ask, Answer, and Detect: Role-Playing LLMs for Personality** **Detection with Question-Conditioned Mixture-of-Experts**



Yifan Lyu

The Hong Kong University of Science and Technology

(Guangzhou)

Guangzhou, China

University of International Business and Economics

Beijing, China

202293007@uibe.edu.cn


**Abstract**


Understanding human personality is crucial for web applications

such as personalized recommendation and mental health assess
ment. Existing studies on personality detection predominantly

adopt a “posts → user vector → labels” modeling paradigm, which

encodes social media posts into user representations for predicting

personality labels ( _e.g._, MBTI labels). While recent advances in large

language models (LLMs) have improved text encoding capacities,

these approaches remain constrained by limited supervision sig
nals due to label scarcity, and under-specified semantic mappings

between user language and abstract psychological constructs. We

address these challenges by proposing ROME, a novel framework

that explicitly injects psychological knowledge into personality

detection. Inspired by standardized self-assessment tests, ROME

leverages LLMs’ role-play capability to simulate user responses to

validated psychometric questionnaires. These generated question
level answers transform free-form user posts into interpretable,

questionnaire-grounded evidence linking linguistic cues to per
sonality labels, thereby providing rich intermediate supervision to

mitigate label scarcity while offering a semantic reasoning chain

that guides and simplifies the text-to-personality mapping learning.

A question-conditioned Mixture-of-Experts module then jointly

routes over post and question representations, learning to answer

questionnaire items under explicit supervision. The predicted an
swers are summarized into an interpretable answer vector and

fused with the user representation for final prediction within a

multi-task learning framework, where question answering serves

as a powerful auxiliary task for personality detection. Extensive

experiments on two real-world datasets demonstrate that ROME

consistently outperforms state-of-the-art baselines, achieving sub
stantial improvements ( **15.41%** on Kaggle dataset) while enhancing

interpretability through psychologically grounded predictions.


**CCS Concepts**


- **Information** **systems** → **User** **modeling** ; _Personalization_ ; **Computing methodologies** → _Natural language processing_ .


**1** **Introduction**


Understanding human personality is essential for explaining indi
vidual differences in cognition, emotion, and behavior and serves as


∗Corresponding author.


_arXiv’25,_

2026.



Liang Zhang [∗]


The Hong Kong University of Science and Technology

(Guangzhou)

Guangzhou, China

liangzhang@hkust-gz.edu.cn


the foundation for web applications such as personalized recommen
dation, mental-health assessment, and career development [Kern
berg 2016]. Among typological instruments, the Myers–Briggs Type

Indicator (MBTI) remains one of the most widely adopted, catego
rizing individuals into sixteen personality types along four binary

dimensions [Myers et al. 1998]. With the rapid growth of social me
dia, individuals increasingly share their thoughts and experiences

online, creating a rich source of behavioral signals for understand
ing human personality [Gottfried 2024]. There is now substantial

evidence that digital traces and linguistic expressions on social

media can reveal users’ personality traits [Schwartz et al. 2013;

Youyou et al. 2015]. These developments have spurred the emerg
ing task of _personality detection_, which aims to infer personality
labels ( _i.e._, MBTI labels) from social media posts automatically and

has attracted substantial research attention in recent years [Štajner

and Yenikent 2020].

These aforementioned studies typically formulate the task as

a text classification problem following the “posts → user vector
→ labels” paradigm as illustrated in Figure 1(a), where the cru
cial challenge is to learn a mapping function that encodes user

posts into a single user representation. In this line of work, various

strategies have been proposed. Traditional approaches primarily

rely on handcrafted features, such as those derived from the Lin
guistic Inquiry and Word Count (LIWC) lexicon [Mairesse et al.

2007; Pennebaker et al. 2015]. With the advent of deep learning,

subsequent approaches have shifted from handcrafted features to

neural architectures, which extract user representations from raw

text automatically in a data-driven manner. For example, building

on pretrained language models, some studies [Jiang et al. 2020a;

Keh and Cheng 2019b] adopt BERT [Devlin et al. 2019] to encode

user content, with strategies ranging from post-level encoding to

concatenating multiple posts into one sequence. Some alternative

methods [Yang et al. 2021a, 2023; Zhu et al. 2022] adopt a cross-post

perspective, using BERT to extract semantic features and graph

neural networks to further enhance post representations. Although

these methods have achieved notable progress, their limited repre
sentational capacity often produces suboptimal embeddings that

fail to fully exploit the rich personality signals embedded in user

posts, especially when the posts are heterogeneous and noisy.

Recently, large language models (LLMs) have shown remark
able text understanding abilities and strong performance across a

wide range of natural language processing tasks [Brown et al. 2020;

Kaplan et al. 2020; Wei et al. 2022a,b] compared with traditional

smaller models, which in turn has motivated their application to


arXiv’25, 2025, Yifan Lyu and Liang Zhang



the personality detection task. The typical modeling paradigm is

illustrated in Figure 1(b). Specifically, TAE [Hu et al. 2024] leverages

the generative capabilities of LLMs to produce multi-perspective

textual analyses of posts and labels within a contrastive learning

framework, thereby enriching post semantics and strengthening

user representations. Building on TAE, ETM [Bi et al. 2025] fur
ther employs LLMs as the post encoder to exploit their strong

embedding capacity, augmenting the user vector with long-text

embeddings directly and achieving state-of-the-art performance.

However, despite these advances, existing LLM-based approaches

largely adhere to the traditional “posts → user vector → labels”

paradigm, incorporating only limited augmentations. The semantic

mapping from user language to abstract psychological constructs

is achieved through simple text encoding and relies entirely on

supervision from coarse-grained personality labels which are often

scarce, costly to collect and prone to privacy concerns.

We observe that humans often infer their own personality by

completing standardized self-assessment tests. Inspired by this pro
cess, we posit that structured, well-validated psychometric question
naires provide a natural bridge between user language and abstract

psychological constructs. Beyond coarse-grained personality labels,

these questionnaires further decompose each label into multiple

semantically meaningful questions ( _i.e._, psychometric items), and

their fine-grained question–answer design provides rich intermedi
ate supervision to mitigate label scarcity while offering a semantic

reasoning chain that guides and simplifies the text-to-personality

mapping learning.

Building on this insight, we propose **ROME** (ROle-play enhanced

question-conditioned Mixture-of-Experts), an LLM role-play en
hanced, questionnaire-grounded framework for personality detec
tion, with its modeling paradigm illustrated in Figure 1(c). Our

key idea is to treat the standardized personality questionnaire as a

structured retrieval source and design a label-aware LLM agent to

role-play each user, generating question-level answers from their

free-form posts. These answers constitute _questionnaire-grounded_
_evidence_ that explicitly links linguistic cues to specific personality

labels, bringing psychological knowledge directly into the model
ing pipeline. We then design a question-conditioned Mixture-of
Experts (MoE) module that jointly routes over posts and question

representations and learns to answer the psychometric question
naire items under explicit supervision. These predicted answers

are then summarized into an answer vector, a compact represen
tation that captures the model’s question-by-question reasoning

chain for personality detection. This vector is finally fused with

the encoder’s user representation for prediction within a multi-task

learning framework.

In summary, our main contributions are as follows:


 - Conceptually, we are the first to leverage the strong role-play

capabilities of LLMs to explicitly inject psychological knowl
edge into personality detection and formulate an interpretable,

questionnaire-grounded modeling paradigm.

 - Methodologically, we design a multi-task learning framework

that treats question answering as a powerful auxiliary task

for personality detection and develop a question-conditioned

Mixture-of-Experts (MoE) architecture that learns to answer



**(c) Our LLM Role-Play Enhanced, Questionnaire-Grounded Model**


**Figure 1: Overview of modeling paradigms for personality**

**detection.**


questionnaire items through a post–question joint routing

mechanism.

 - Experimentally, extensive experimental results on two real
world datasets demonstrate that our ROME model significantly

and consistently outperforms state-of-the-art baselines, achiev
ing relative improvements of up to **15.41%** .


**2** **Related Work**

**2.1** **Personality Detection**


Early evidence shows that digital traces and language use carry

robust signals of human personality [Schwartz et al. 2013; Youyou

et al. 2015]. Classical approaches therefore relied on handcrafted or

lexicon-based features ( _e.g._, LIWC) to engineer user representations

for personality classification [Mairesse et al. 2007; Pennebaker et al.

2015]. With the advent of deep learning, the community has shifted

toward neural encoders that aggregate multiple posts into a unified

user vector automatically, typically built upon pretrained language

models such as BERT [Devlin et al. 2019], with strategies rang
ing from simple concatenation to hierarchical pooling [Jiang et al.

2020a; Keh and Cheng 2019b]. To better capture dependencies across

posts, subsequent studies further introduce cross-document model
ing and graph-based architectures ( _e.g._, multi-document transform
ers and dynamic graph convolution) to enhance user-level semantic

representations [Yang et al. 2021a, 2023; Zhu et al. 2022]. More re
cently, LLM-augmented pipelines have advanced the frontier by

leveraging LLMs to generate multi-perspective analyses of posts

and labels within contrastive learning frameworks (TAE) and by re
placing traditional post encoders with powerful LLM-derived long
text encoders directly (ETM) [Bi et al. 2025; Hu et al. 2024]. Despite

these advances, the prevailing modeling paradigm remains _posts_



<user vector>





<personality label>
{E/I, N/S, F/T, P/J}



**(a) Traditional Deep Learning Models for Personality Detection**


<user vector>















**(b) LLM-Enhanced Text Mapping Models for Personality Detection**


<user vector>
















Ask, Answer, and Detect: Role-Playing LLMs for Personality Detection with Question-Conditioned Mixture-of-Experts arXiv’25, 2025,



→ _user vector_ → _labels_, which learns text-to-personality mappings

only from coarse-grained labels, offering limited interpretability

and intermediate supervision.


**2.2** **Role-play Prompting**


Role-play has emerged as a popular prompt-based paradigm for

conditioning LLMs on personas, goals, and contextual constraints

across both simulation and evaluation settings, enabling coherent

agent behaviors and goal-directed reasoning in open-ended envi
ronments [Li et al. 2023; Park et al. 2023]. Recent studies have sys
tematized the use of role-play in LLMs by introducing benchmarks

to quantify role adherence [Wang et al. 2024] and domain-specific

frameworks that co-design standardized, faithful interactions such

as clinician-guided virtual patients and character-grounded agents

in text-based environments [Louie et al. 2024; Wang et al. 2025].

These developments, further synthesized in a recent survey [Tseng

et al. 2024], collectively underscore the growing interest in aligning

LLM behavior with contextual roles. In this paper, we do not employ

role-play for open-ended dialogue generation. Instead, we elicit

question-level answers to validated psychometric questionnaires

from users’ posts, providing psychologically grounded intermediate

supervision for personality detection. To the best of our knowledge,

this is the first work to harness LLM’s role-play capacity to con
struct an explicit questionnaire-grounded evidence space for this

task, tightly integrated with our question-conditioned Mixture
of-Experts architecture that learns to answer questionnaire items

before final personality classification.


**2.3** **Mixture-of-Experts (MoE)**


Mixture-of-Experts (MoE) realizes _conditional computation_ by rout
ing each input to a small subset of experts, thereby achieving scal
able model capacity through sparse activation [Du et al. 2022; Fedus

et al. 2021; Lepikhin et al. 2020; Shazeer et al. 2017]. Beyond sheer

scale, task- and signal-aware variants encourage functional spe
cialization. For instance, multi-gate MoE architectures have been

widely applied in multi-task learning scenarios [Ma et al. 2018].

More recent systems further develop different routing mechanisms

that address various aspects, including improving routing stabil
ity, load balance, and cross-task transferability [Jiang et al. 2024;

Liu et al. 2024; Qiu et al. 2024; Zhao et al. 2024]. These advances

collectively show that what conditions the router matters: condi
tioning on the appropriate structure enables experts to capture

distinct facets of the problem. Unlike prior work that conditions

primarily on token- or task-level signals to improve efficiency or

general accuracy, we repurpose the MoE framework for question
conditioned specialization: standardized questionnaire signals drive

routing and supervision at the item level, producing intermediate,

psychologically grounded evidence that is subsequently aggregated

for personality inference. This reframes the role of the MoE from

scaling the encoder to structuring the supervision and providing

an interpretable bridge for the under-specified text-to-personality

mapping emphasized in our introduction.



**3** **Method**

**3.1** **Problem Definition**


Personality detection from social media can be formulated as a

_user-level,_ _multi-label_ classification problem. Given a collection
of posts authored by a user _𝑢_, denoted as P _𝑢_ = { _𝑝𝑢,_ 1 _, . . ., 𝑝𝑢,𝑁𝑢_ },

where _𝑁𝑢_ represents the total number of posts, the goal of this
task is to infer the user’s _m_ -dimensional personality profile yˆ _𝑢_ =

- _𝑦_ ˆ _𝑢_ (1) _[,]_ _[𝑦]_ [ˆ] _𝑢_ [(][2][)] _[,]_ [ · · ·] _[,]_ _[𝑦]_ [ˆ] _𝑢_ [(] _[𝑚]_ [)] - based on posts P _𝑢_ .

Under the MBTI taxonomy, the personality dimension set is

M = {I/E _,_ S/N _,_ T/F _,_ P/J}. Each dimension _𝑚_ ∈M consists of two
opposing trait poles, and the ground-truth label _𝑦𝑢_ [(] _[𝑚]_ [)] ∈{0 _,_ 1} indi
cates which pole the user _𝑢_ aligns with. The objective is therefore

to learn the mapping function from P _𝑢_ to yˆ _𝑢_ :



_𝑓_ : P _𝑢_ ↦−→ yˆ _𝑢_ = [�] _𝑦_ ˆ _𝑢_ [(] _[𝑚]_ [)]            

**3.2** **Model Overview**



_𝑚_ ∈M _[.]_



To facilitate and ease the learning process from the free-form

user language space P _𝑢_ to the abstract psychological construct
space yˆ _𝑢_, we incorporate well-validated psychometric question
naires as a natural intermediate bridging layer, drawing inspi
ration from the standardized self-assessment procedure widely

adopted in human personality measurement in psychology studies.

Building on this insight, we propose **ROME** (ROle-play enhanced

question-conditioned Mixture-of-Experts), an LLM role-play en
hanced, questionnaire-grounded framework for personality detec
tion, with its overall architecture illustrated in Figure 2.

Conceptually, ROME comprises three key stages: _Ask_, _Answer_,
and _Detect_ . Specifically, in the Ask stage, a role-play LLM agent

is instructed to “take on the perspective of the user" and produce

answers to each questionnaire item [1] based on the user’s posts and

the corresponding personality label. These questionnaire-grounded

evidence serve as a structured and interpretable bridge between

raw linguistic expressions and psychological constructs. Impor
tantly, this evidence generation process is performed offline during

training only and is no longer required at inference time. Then,

in the Answer stage, we enable the model to reproduce these evi
dence directly from the user posts and the questionnaire item texts,

thereby establishing a psychology-informed semantic reasoning

chain that simplifies the text-to-personality mapping learning. To

account for the heterogeneity across psychometric questionnaire

items, we introduce a question-conditioned Mixture-of-Experts

(MoE) module, where each expert specializes in a particular type

of psycholinguistic cue and the gating network selects the most

relevant experts for answering each question. Finally, in the Detect

stage, the questionnaire-grounded evidence is aggregated with the

user representation learned from posts to perform the final predic
tion, preserving the expressive capacity of the post encoder while

injecting a concise and interpretable decision pathway grounded

in standardized psychological knowledge.


1Henceforth, we use the terms “questionnaire item(s)” and “question(s)” interchange
ably for convenience and readability throughout this paper.


arXiv’25, 2025, Yifan Lyu and Liang Zhang




























|Ask<br>ENEFNE PFNPFP 2 16 LLM learns to role-play<br>1<br>Personality label<br>QueEsNE 𝒬FN 𝒾PF 1P<br>2 M IE/SN/TF/PJ 1 2 M<br>Psychometric items Psychological construct assignment<br>ENEFNPFP<br>Encoder 1 2 M<br>PosEtN E 𝒫FNPF 1P 2 K Encoder ENEFNPFP 2 K|Col2|Answer<br>Role-play answering answerE 𝛼N ෤E (FN uP,F vP ) 1 2 M|Detect<br>Sample variance<br>𝑞𝐮E 𝐧N 𝐜E,𝐢FNP 1F P 2 M<br>𝐳𝐮,𝐢P 1P 2 M<br>𝑞𝐢𝐦E 𝐩NE,𝐢FNP 1F P 2 M<br>Information gain<br>Multiply Gated fusion<br>Fuse<br>Post embeddings<br>Classify<br>Personality ENFP|
|---|---|---|---|
|1<br>ENFP<br>ENFP<br>Post 𝒫<br>2 K<br>ENFP<br>ENFP<br>Ques𝒬𝒾1 2 M<br>LLM learns to role-play<br>ENFP<br>ENFP<br> 2 K<br>Ask<br>ENFP<br>ENFP<br>ENFP<br>1<br>2 16<br>Personality label<br>Psychometric items<br>Psychological construct assignment<br>IE/SN/TF/PJ1 2 M<br>Encoder<br>Encoder<br>ENFP<br>ENFP<br>1 2 M||||
|1<br>ENFP<br>ENFP<br>Post 𝒫<br>2 K<br>ENFP<br>ENFP<br>Ques𝒬𝒾1 2 M<br>LLM learns to role-play<br>ENFP<br>ENFP<br> 2 K<br>Ask<br>ENFP<br>ENFP<br>ENFP<br>1<br>2 16<br>Personality label<br>Psychometric items<br>Psychological construct assignment<br>IE/SN/TF/PJ1 2 M<br>Encoder<br>Encoder<br>ENFP<br>ENFP<br>1 2 M||ENFP<br>ENFP<br>predത𝛼(u, v)1 2 M<br>Supervise<br>Router<br>Q-conditioned<br>......<br>......<br>Predicted answers|ENFP<br>ENFP<br>predത𝛼(u, v)1 2 M<br>Supervise<br>Router<br>Q-conditioned<br>......<br>......<br>Predicted answers|
|1<br>ENFP<br>ENFP<br>Post 𝒫<br>2 K<br>ENFP<br>ENFP<br>Ques𝒬𝒾1 2 M<br>LLM learns to role-play<br>ENFP<br>ENFP<br> 2 K<br>Ask<br>ENFP<br>ENFP<br>ENFP<br>1<br>2 16<br>Personality label<br>Psychometric items<br>Psychological construct assignment<br>IE/SN/TF/PJ1 2 M<br>Encoder<br>Encoder<br>ENFP<br>ENFP<br>1 2 M||||



Experts











Digital traces







prediction



**Figure 2: The overall pipeline of ROME.**



**3.3** **Ask: Role-Play-Based Questionnaire**

**Response Generation**


To ease the learning of the mapping function _𝑓_ (·), we introduce

standardized psychometric questionnaires to decompose each per
sonality label into multiple semantically meaningful questions,

thereby providing rich, fine-grained intermediate supervision sig
nals for the model. Ideally, one could present these self-assessment

tests directly to each user _𝑢_ and collect their responses to obtain

such supervision; however, this procedure is costly, intrusive, and

often impractical. Motivated by the recent success of LLMs in simu
lating human behaviors across diverse contexts [Abbasiantaeb et al.

2024; Xie et al. 2024], we propose an LLM agent to role-play each

user with given characteristics ( _i.e._, user posts P _𝑢_ and personality
label yˆ _𝑢_ ) and produce question-level answers. The posts provide

evidence of the user’s linguistic patterns and behavioral tendencies,

while the label supplies a stable trait orientation; conditioning on

both enables the LLM agent to more accurately approximate how

the user would respond in a self-assessment setting. Here, it is im
portant to note that this generation process is performed offline

during training only to augment the training dataset and is not

required at inference time.

Formally, for each user _𝑢_ with posts P _𝑢_ = { _𝑝𝑢,_ 1 _, . . ., 𝑝𝑢,𝑁𝑢_ } and
each questionnaire item _𝑄𝑖_ ∈Q, we apply the prompt shown in

Figure 3 to simulate the user’s response. The LLM agent outputs

a score on an ordered scale that approximates how user _𝑢_ would

answer _𝑄𝑖_ . Since LLM generation is inherently stochastic, we draw

_𝑇_ samples and average them to reduce sampling variance and obtain

a more robust estimate, as follows.





|user_id|mbti|temp|Q1|Q2|…|Q59|Q60|
|---|---|---|---|---|---|---|---|
|1|INFJ|0.2|-1|3|…|1|-1|
|1|INFJ|0.3|-1|3|…|2|-1|
|…|…|…|…|…|…|…|…|
|8675|INFP|0.6|-2|2|…|2|-1|


**Figure 3: Prompt design for role-play-based questionnaire**

**response generation.**


user’s posts which are accessible during inference. By learning to

reproduce these answers, the model internalizes the psychology
informed semantic reasoning chain, thereby facilitating the text-to
personality mapping process.

A straightforward approach is to train a neural encoder to map

a user’s posts to each question-level answer. However, different

questionnaire items probe distinct psychological constructs (e.g.,

emotional stability vs. social expressiveness), and the linguistic

cues associated with these constructs may also differ substantially

across user’s posts. Therefore, a single shared encoder tends to

conflate heterogeneous semantic signals, which leads to entangled

representations and suboptimal generalization across questions.

To address these limitations, we propose a question-conditioned

Mixture-of-Experts (MoE) architecture. Instead of relying on a sin
gle shared encoder, the MoE structure allows different experts to

specialize in capturing distinct psychological constructs and their

associated linguistic cues, while still enabling shared experts to

model knowledge that is broadly useful across questions.

Formally, we assume a set of _𝐾_ experts E = { _𝐸_ 1 _, . . ., 𝐸𝐾_ }, each

parameterized as a neural encoder. Given a user _𝑢_ and a specific

question _𝑄𝑖_, the model should first identify the experts that are most

informative to generate the corresponding answer. This selection is

governed by a routing mechanism. Conceptually, effective routing



_𝑎_ ˜ _𝑢,𝑖_ = [1]

_𝑇_



_𝑇_
∑︁

_𝑎𝑢,𝑖_ [(] _[𝑡]_ [)] _[,]_ _𝑢_ ∈U _,_ _𝑄𝑖_ ∈Q _,_ (1)
_𝑡_ =1



where _𝑎𝑢,𝑖_ [(] _[𝑡]_ [)] [denotes] [the] _[ 𝑡]_ [-th] [sampled] [answer] [for] [the] [pair] [(] _[𝑢,𝑄][𝑖]_ [)][.]

These answers bring psychological knowledge explicitly into the

modeling framework.


**3.4** **Answer: Question-Conditioned**

**Mixture-of-Experts Framework**


The goal of the Answer stage is to enable the model to predict the

question-level answers produced in the Ask stage directly from the


Ask, Answer, and Detect: Role-Playing LLMs for Personality Detection with Question-Conditioned Mixture-of-Experts arXiv’25, 2025,



requires understanding _who_ is being assessed (the user’s linguistic
profile), _what_ is being asked (the content of the question), and _which_

psychological construct the question is designed to measure. Guided

by this intuition, we introduce a lightweight question-conditioned

router to dynamically select and aggregate experts as follows.


x _𝑢,𝑖_ = �v _𝑢_ ; q _𝑖_ ; e _𝑚𝑖_ )� _,_

(2)
g _𝑢,𝑖_ = softmax [�] MLP(x _𝑢,𝑖_ ) [�] _._


where v _𝑢_ and q _𝑖_ denote the text embeddings of the user’s posts P _𝑢_

and the question _𝑄𝑖_ respectively, computed by the shared textual
encoder _𝑡_ (·). The vector e _𝑚𝑖_ is a one-hot indicator specifying the

psychological construct that question _𝑄𝑖_ is designed to measure
( _e.g._, I/E or S/N personality dimension). In our implementation, we

employ an LLM to obtain the construct assignment once, and keep

this assignment fixed throughout training and evaluation.

Each expert _𝐸𝑘_ is a small MLP-based expert function denoted as
_𝑓𝑘_ (·). The final answer is then predicted as:



1
_𝜇𝑖,𝑚_ [−] [=]
|U _𝑚_ [−] [|]



where _𝑞_ rel _,𝑖_ denotes the reliability score associated with question
_𝑄𝑖_, and Norm(·) represents the min–max normalization operator.


_Importance Score._ While for the importance, our intuition is that

each question is primarily designed to probe a specific psychologi
cal construct ( _e.g._, I/E or S/N personality dimension). Thus, if the

LLM-generated answers for a question exhibit stronger separability

and induce larger between-class shifts with respect to its intended

construct, then that question should be considered more important

for personality detection. Formally, for each question _𝑄𝑖_, we first

retrieve its one-hot indicator vector **e** _𝑚𝑖_ which is a fixed mapping

introduced in the last section, and denote the corresponding psy
chological construct by _𝑚_ ∈M ( _e.g._, _𝑚_ = I/E). The importance is

then defined as:
1 ∑︁
_𝜇𝑖,𝑚_ [+] [=] _𝑎_ ˜ _𝑢,𝑖,_
|U _𝑚_ [+] [|]



∑︁



_𝑎_ ˜ _𝑢,𝑖,_
_𝑢_ ∈U _𝑚_ [+]


∑︁

_𝑎_ ˜ _𝑢,𝑖,_
_𝑢_ ∈U _𝑚_ [−]



∑︁



(6)



_𝑎_ ˆ _𝑢,𝑖_ =



_𝐾_
∑︁

_𝑔𝑢,𝑖_ [(] _[𝑘]_ [)] [·] _[ 𝑓][𝑘]_ [(][x] _[𝑢,𝑖]_ [)] _[.]_ (3)

_𝑘_ =1



This component is trained to predict the answer for a given

user and psychometric question pair ( _𝑢,𝑄𝑖_ ) using the role-played

target _𝑎_ ˜ _𝑢,𝑖_ as supervision, and optimized via a regression objective

function as follows.



1
L _𝑞_ =
|U| · |Q|



∑︁


_𝑢_ ∈U



∑︁ _ℓ_ [�] _𝑎_ ˆ _𝑢,𝑖,_ _𝑎_ ˜ _𝑢,𝑖_ - _,_ (4)


_𝑄𝑖_ ∈Q



_𝑞_ imp _,𝑖_ = �� _𝜇𝑖,𝑚_ + [−] _[𝜇]_ _𝑖,𝑚_ [−] �� _,_

where U _𝑚_ [+] [=] [{] _[𝑢]_ [|] _[𝑦]_ _𝑢_ [(] _[𝑚]_ [)] = 1} and U _𝑚_ [−] [=] [{] _[𝑢]_ [|] _[𝑦]_ _𝑢_ [(] _[𝑚]_ [)] = 0} and

_𝑞_ imp _,𝑖_ is the importance score associated with question _𝑄𝑖_, which is
min–max normalized to the range [0 _,_ 1].


_Adaptive_ _Weight._ For each question _𝑄𝑖_, the final weight _𝑤𝑖_ is

computed under the intuition that more important and more reliable

questions should contribute more to the final prediction, as follows.


_𝑤𝑖_ = _𝑞_ imp _,𝑖_           - _𝑞_ rel _,𝑖_ _._ (7)


And the final answer-based representation is obtained by:


**s** _𝑢_ = **w** ⊙ **a** ˆ _𝑢_ _._ (8)


where **a** ˆ _𝑢_ denotes the vector of predicted question-level answers
and ⊙ denotes element-wise multiplication.


_3.5.2_ _Personality_ _Prediction._ Each questionnaire item _𝑄𝑖_ is pri
marily designed to probe a specific psychological construct and

contributes only minimally to others. Directly applying question
level signals without regard to their associated constructs may

introduce irrelevant evidence and increase noise. To prevent such

cross-construct interference, we apply construct-specific binary

masks to ensure that each construct only integrates evidence from

its corresponding questions. Specifically, for each _𝑚_ ∈M ( _e.g._,
_𝑚_ = I/E), we define the mask vector _𝝁_ [(] _[𝑚]_ [)] ∈{0 _,_ 1} [| Q|] by:



where _ℓ_ (· _,_ ·) denotes a robust L1 regression loss. During inference,

the predicted _𝑎_ ˆ _𝑢,𝑖_ serves as a strong psychologically grounded evi
dence for final personality detection.


**3.5** **Detect: Psychological Evidence-Guided**

**Personality Prediction**


_3.5.1_ _Psychological Evidence Modulation._ Given the predicted _𝑎_ ˆ _𝑢,𝑖_

as psychologically grounded evidence, one may simply concate
nate them to form an evidence vector for personality prediction.

However, two critical challenges remain. First, the “ground truth”

answers used to supervise _𝑎_ ˆ _𝑢,𝑖_ are obtained through LLM role-play

generation. Due to the stochastic nature of LLM outputs, the aug
mented answers may contain noise, leading to varying levels of

uncertainty across questions. Second, not all questions in a ques
tionnaire are equally informative for personality inference. Some

questions provide strong diagnostic signals compared to others.

Therefore, we propose to adaptively weight the contribution of

each predicted answer based on both its reliability and its impor
tance when forming the final answer-based representation.


_Reliability Score._ Specifically, when estimating the reliability, our

intuition is that if the responses of a question exhibit high variance

across the _𝑇_ sampled role-play generations, the corresponding evi
dence is more likely to be unreliable. Formally, we can define it as

follows.



_𝝁𝑖_ [(] _[𝑚]_ [)] =



�1 _,_ arg max( **e** _𝑚𝑖_ ) = _𝑚,_

(9)

0 _,_ otherwise _._



1
_𝑞_ unc _,𝑖_ =
|U|



∑︁ - 
Var { _𝑎𝑢,𝑖_ [(] _[𝑡]_ [)] [}] _[𝑇]_ _𝑡_ =1 _,_
_𝑢_ ∈U



∑︁



_𝑢_ ∈U (5)

_𝑞_ rel _,𝑖_ = 1 − Norm [�] _𝑞_ unc _,𝑖_ - _._



And the construct-specific answer representation is then com
puted by applying the obtained binary mask that preserves only

the evidence associated with _𝑚_ as follows.


s _𝑢_ [(] _[𝑚]_ [)] = _𝝁_ [(] _[𝑚]_ [)] ⊙ s _𝑢_ _._ (10)


The post-derived representation **v** _𝑢_ captures broad linguistic

patterns across a user’s posts and is highly expressive, but it is not

explicitly aligned with psychological constructs. In contrast, the
construct-specific evidence s _𝑢_ [(] _[𝑚]_ [)] is questionnaire-grounded, provid
ing a semantic and interpretable reasoning pathway to psychologi
cal constructs. However, its quality can vary due to differences in


arXiv’25, 2025, Yifan Lyu and Liang Zhang



diagnostic strength across questionnaire items and the uncertainty

inherent in role-play supervision. Therefore, the two sources of
fer complementary advantages and with varying reliability. Their

contributions should be adaptively balanced during personality

prediction. Specifically, we introduce a lightweight gating network
that learns to dynamically weight the contributions of **v** _𝑢_ and s _𝑢_ [(] _[𝑚]_ [)]

as follows.

_𝜸𝑢_ [(] _[𝑚]_ [)] = _𝜎_ �MLPgate [(] _[𝑚]_ [)] �v _𝑢_ ∥ s _𝑢_ ( _𝑚_ )      - [�] _,_

(11)
z _𝑢_ [(] _[𝑚]_ [)] = _𝜸𝑢_ [(] _[𝑚]_ [)] ⊙ v _𝑢_ + [�] 1 − _𝜸𝑢_ [(] _[𝑚]_ [)]       - ⊙ s _𝑢_ ( _𝑚_ ) _._


Subsequently, the personality prediction for a given _𝑚_ ∈M is

produced by a lightweight construct-specific classifier as follows.


_𝑦_ ˆ _𝑢_ [(] _[𝑚]_ [)] = _𝜎_ �MLPcls [(] _[𝑚]_ [)] �z _𝑢_ ( _𝑚_ )         - [�] _,_ (12)


which is optimized using a binary classification loss:



train/validation/test with a 60/20/20 split (no user overlap across

splits). Dataset statistics are summarized in Table 1.


**Dataset** **Types** **Train** **Validation** **Test**

I/E 4032/1173 1330/405 1314/421

Kaggle S/N 724/4481 230/1505 243/1492

T/F 2388/2817 802/933 791/944

P/J 3160/2045 1007/728 1074/661

I/E 4314/1126 1425/388 1403/411

Pandora S/N 621/4819 202/1611 205/1609

T/F 3527/1913 1160/653 1164/650

P/J 3211/2229 1064/749 1035/779

**Table** **1:** **Statistics** **of** **the** **Kaggle** **and** **Pandora**

**datasets.**


**4.2** **Baselines**


We compare our approach against several strong baseline methods

as follows:


 - **XGBoost [Chen and Guestrin 2016]** : This method concate
nates all posts of a user into a single document, encodes it with

bag-of-words, and applies an XGBoost classifier for user-level

prediction.

 - **BiLSTM [Tadesse et al. 2017]** : This method encodes each post

with a bidirectional LSTM and uses average pooling to aggregate

post embeddings into a single user-level representation for

personality prediction.

 - **BERTconcat [Jiang et al. 2020b]** : This method concatenates

all posts from a user into a single sequence, encodes the se
quence with BERT, and maps the resulting representation to

personality labels via fully connected layers.

 - **BERTmean [Keh and Cheng 2019a]** :This method encodes

each post with BERT, applies mean pooling across post-level

embeddings to form a user representation, and maps it to per
sonality labels via fully connected layers.

 - **AttRCNN [Xue et al. 2018]** :This method employs a hierar
chical architecture that couples an attention-augmented RCNN

with an Inception-style variant to extract deep semantic fea
tures from social-network text; these features are concatenated

with psycholinguistic statistics and passed to regression models

for personality prediction.

 - **AttnSeq [Lynn et al. 2020]** :This method builds a hierarchical

sequence model with word-level and message-level attention

to aggregate posts into a user representation for personality

prediction.

 - **Transformer-MD [Yang et al. 2021b]** :This method employs a

multi-document Transformer that mitigates order bias by using

memory tokens with shared positional embeddings, enabling

cross-post information access to form a coherent user-level

representation for personality prediction.

 - **TrigNet [Yang et al. 2021c]** :This method builds a psycholin
guistic tripartite graph over posts, words, and LIWC-style cat
egories, initializes node embeddings with BERT, and applies

graph attention to aggregate psychologically grounded signals

for personality prediction.



1
Lcls =
|U| · |M|



∑︁


_𝑢_ ∈U



∑︁ - 
BCE _𝑦_ ˆ _𝑢_ [(] _[𝑚]_ [)] _, 𝑦𝑢_ [(] _[𝑚]_ [)] _._ (13)

_𝑚_ ∈M



Together with the answer prediction loss defined in Equation (4),

the model is finally trained in a multi-task learning framework with

the following joint objective function:


L = _𝜆𝑞_ L _𝑞_ + _𝜆𝑐𝑙𝑠_ L _𝑐𝑙𝑠,_ (14)


where _𝜆𝑞_ and _𝜆𝑐𝑙𝑠_ are hyperparameters that balance the contribu
tions of the answer prediction and personality classification tasks,

respectively.

**Remark.** During training, we first pre-train the MoE module with

the answer prediction objective ( _i.e._, Equation (4)) to stabilize the

question-aligned reasoning space, and then fine-tune the entire

framework end-to-end using the joint objective in Equation (14). At

inference time, the user’s posts are encoded once, and the question
conditioned MoE module produces psychologically grounded evi
dence { _𝑎_ ˆ _𝑢,𝑖_ }, which is then fused with the encoded post representa
tions to generate the final personality prediction.


**4** **Experiment**

**4.1** **Datasets**


In line with prior work [Hu et al. 2024; Yang et al. 2021a, 2023], we

conduct our evaluation on two widely used personality datasets:

Kaggle [2] and Pandora [3] . Kaggle is collected from PersonalityCafe [4],

a forum where users disclose personality types and interact, and

contains 8,675 users with their 50 most recent posts. Pandora

is constructed from Reddit [5] ; personality labels are derived from

self-introductions explicitly mentioning types, yielding 9,067 users

with per-user post counts ranging from dozens to hundreds. Both

datasets adopt the MBTI taxonomy with four binary dimensions: In
troversion vs. Extroversion (I/E), Sensing vs. iNtuition (S/N), Think
ing vs. Feeling (T/F), and Perception vs. Judging (P/J). Given pro
nounced class imbalance, we report Macro-F1 per dimension and

the overall score as the average of the four Macro-F1s. Follow
ing [Yang et al. 2023], we shuffle users and partition data into


2https://www.kaggle.com/datasnaek/mbti-type

3https://psy.takelab.fer.hr/datasets/all

4http://personalitycafe.com/forum

5https://www.reddit.com


Ask, Answer, and Detect: Role-Playing LLMs for Personality Detection with Question-Conditioned Mixture-of-Experts arXiv’25, 2025,

|Methods|Kaggle|Col3|Pandora|Col5|
|---|---|---|---|---|
|**Methods**|**I/E**<br>**S/N**<br>**T/F**<br>**P/J**|**Avg**|**I/E**<br>**S/N**<br>**T/F**<br>**P/J**|**Avg**|
|XGBoost<br>BiLSTM<br>BERTconcat<br>BERTmean|56.67<br>52.85<br>75.42<br>65.94<br>57.82<br>57.87<br>69.97<br>57.01<br>58.33<br>53.88<br>69.36<br>60.88<br>64.05<br>57.82<br>77.06<br>65.25|62.72<br>60.67<br>60.61<br>66.04|45.99<br>48.93<br>63.51<br>55.55<br>48.01<br>52.01<br>63.48<br>56.21<br>54.22<br>49.15<br>58.31<br>53.14<br>56.60<br>48.71<br>64.70<br>56.07|53.50<br>54.93<br>53.91<br>56.52|
|AttRCNN<br>AttnSeq<br>Transformer-MD<br>TrigNet<br>D-DGCN<br>D-DGCN+_ℓ_0|59.74<br>64.08<br>78.77<br>66.44<br>65.43<br>62.15<br>78.05<br>63.92<br>66.08<br>69.10<br>79.19<br>67.50<br>69.54<br>67.17<br>79.06<br>67.69<br>68.41<br>65.66<br>79.56<br>67.22<br>69.52<br>67.19<br>80.53<br>68.16|67.25<br>67.39<br>70.47<br>70.86<br>70.21<br>71.35|48.55<br>56.19<br>64.39<br>57.26<br>56.98<br>54.78<br>60.95<br>54.81<br>55.26<br>58.77<br>69.26<br>60.90<br>56.69<br>55.57<br>66.38<br>57.27<br>61.55<br>55.46<br>71.07<br>59.96<br>59.98<br>55.52<br>70.53<br>59.56|56.60<br>56.88<br>61.05<br>58.98<br>62.01<br>61.40|
|TAE<br>ETM|70.90<br>66.21<br>81.17<br>70.20<br>68.97<br>71.21<br>86.19<br>**84.78**|72.07<br>77.79|62.57<br>61.01<br>69.28<br>59.34<br>**68.57**<br>64.91<br>66.07<br>**63.53**|63.05<br>65.77|
|**ROME**|**90.12**<br>**95.04**<br>**96.99**<br>76.95|**89.78**|49.05<br>**93.62**<br>**72.31**<br>61.12|**69.04**|
|**Improvement**|27.11% 33.46% 12.53%<br>-9.24%|15.41%|-28.47%<br>44.23%<br>1.74%<br>-3.79%|4.97%|



**Table 2: Performance comparison on Kaggle and Pandora datasets (F1%).**




 - **D-DGCN [Yang et al. 2023]** :This method dynamically induces

a multi-hop post graph and applies deep graph convolutions

over the learned topology, enabling order-agnostic evidence

fusion for personality prediction.

 - **TAE [Hu et al. 2024]** :This method leverages LLM-generated

multi-perspective augmentations—semantic, sentiment, and lin
guistic—and distills them into a lightweight encoder, using en
riched label representations to enhance personality detection.

 - **ETM [Bi et al. 2025]** :This method encodes posts with LLM
based embeddings to form a user representation, generates

multi-view textual descriptions of personality labels via an LLM,

and aligns users to labels through a contrastive objective in the

shared space.


**4.3** **Implementation Details**


All models are implemented using PyTorch, and all experiments

are conducted on a workstation equipped with eight NVIDIA RTX

5880 Ada GPU. We use BERT-base-uncased as the default post en
coder for our ROME model. In the Ask stage, we employ ChatGPT

(gpt-4o-2024-08-06) as a role-playing LLM to generate question
level answers to the MBTI-style questionnaire from user posts. The

LLM is used solely in an offline manner to generate supervisory

signals during training and is never queried at inference time. The

question-conditioned Mixture-of-Experts (MoE) module in the An
swer stage consists of 32 experts, each instantiated as a lightweight

MLP with a hidden dimension of 1024. We use Adam as the opti
mizer and adopt a two-stage training procedure. In the first stage,

we pretrain the Answer module with the regression loss L _𝑞_ using
a learning rate of 5 × 10 [−][4], a mini-batch size of 64, and 100 training

epochs. In the second stage, we jointly optimize the entire model

with the multi-task objective L = _𝜆𝑞_ L _𝑞_ + _𝜆_ clsLcls, where _𝜆𝑞_ = 1
and _𝜆_ cls = 0 _._ 05, using a learning rate of 1 × 10 [−][4] and a mini-batch

size of 32.



**4.4** **Overall results**


The main results on two datasets are provided in Table 2, where the

best performance is in boldface and the second best is underlined,

and the improvement of ROME over these second best methods is

also presented in the last row.

From Table 2, we observe that both traditional feature-based

models and standard PLM baselines perform poorly on the two

datasets. For example, the strongest non-LLM baseline, BERTmean,

achieves only 65.25% and 56.52% average Macro-F1 on Kaggle and

Pandora. In contrast, the LLM-augmented text-mapping model ETM

delivers substantially stronger performance, reaching 77.79% and

65.77% average Macro-F1 on the two datasets, which correspond to

relative improvements of 17.79% and 16.37% over BERTmean. These

gains can be largely attributed to ETM’s integration of an LLM
enhanced encoder, which offers stronger capacity for modeling

long and heterogeneous user posts.

Compared to these strong LLM-augmented baselines, our

proposed ROME model yields further substantial gains. As shown

in Table 2, ROME attains 89.78% and 69.04% average Macro-F1

on Kaggle and Pandora, respectively, corresponding to relative

improvements of 15.41% and 4.97% over ETM. On Kaggle dataset,

the improvements are particularly pronounced on the I/E, S/N,

and T/F dimensions, where ROME achieves markedly higher

F1 scores than all baseline methods while remaining competi
tive on P/J dimension prediction. Importantly, ROME surpasses

ETM even though it relies only on a small-scale text encoder

(BERT-base-uncased), whereas ETM exploits long-text embeddings from a much larger Meta-Llama-3-8B-Instruct model
(about 70× larger than BERT-base-uncased). This advantage

mainly stems from ROME’s questionnaire-grounded architecture.

ROME treats the standardized personality questionnaire as a

structured retrieval source, uses an LLM to role-play each user


arXiv’25, 2025, Yifan Lyu and Liang Zhang



and produce question-level soft answers, and employs a question
conditioned Mixture-of-Experts to fuse this psychologically

grounded evidence with user representations, thereby providing

substantially richer intermediate supervision than coarse-grained

personality labels alone.

Across the two datasets, the relative gains are more pronounced

on Kaggle, where users tend to produce longer and more coher
ent posts that enable the role-play LLM to generate higher-quality

questionnaire-grounded evidence. In contrast, the shorter and more

fragmented posts in Pandora make it more challenging to elicit sta
ble fine-grained personality cues, partially attenuating the benefits

of our questionnaire-grounded modeling.


**4.5** **Ablation Studies**


To assess the contribution of each component in our ROME frame
work, we conduct an ablation study on the Kaggle dataset, as

shown in Table 3.

**Benefits of adaptive weighting.** We first evaluate the impact of

the question-level weighting mechanism. Removing the reliability
and importance-based weights (ROMEw/o q-weighting) reduces the av
erage Macro-F1 from 89.78% to 88.47%. This degradation reflects the

heterogeneity across questionnaire items: different items vary in

their uncertainty in LLM-simulated answers and in their discrimina
tive power for distinguishing personality classes. Treating all items

as equally informative is therefore suboptimal. The observed drop

confirms that emphasizing stable, highly diagnostic items while

down-weighting noisy ones yields more effective psychological

evidence for the classification.

**Benefits of gated fusion.** We next examine the fusion mechanism

between post-derived and questionnaire-grounded representations.

Replacing the learnable gated fusion with a simple unweighted av
erage (ROMEw/o gated fusion) yields a similar decline in performance.

This result indicates that the relative contributions of posts and

questionnaire evidence should be adaptively determined rather

than fixed, as their reliability can vary across users and across

personality dimensions.

**Benefits** **of** **psychological** **knowledge.** We further ablate

each information source in isolation to examine their individ
ual contributions and complementarity. Specifically, using only

questionnaire-grounded evidence while discarding post represen
tations (ROMEw/o posts) reduces the average Macro-F1 to 75.12%.

Conversely, using only post representations (ROMEw/o evidence)

leads to an even larger drop to 65.77%, with particularly severe

degradation on the P/J dimension. This pattern aligns with our

intuition: post-derived features capture broad and expressive

linguistic cues, whereas questionnaire-grounded evidence provides

semantically aligned and psychologically meaningful signals.

ROME performs best when both sources are jointly leveraged,

indicating that these two perspectives are complementary rather

than interchangeable.

**Benefits of model pretraining.** Finally, skipping the pretraining

stage of the answer module (ROMEw/o pretrain) leads to a substan
tial performance reduction to 69.21%. This indicates that directly

optimizing the full model without first stabilizing the question
level prediction task makes it difficult for ROME to fully leverage

item-level supervision signals.



Taken together, these ablation results indicate that question-level

weighting, adaptive fusion of post and questionnaire evidence, and

pretraining of the answer module are all essential for realizing the

full performance gains of ROME.

|Methods|I/E S/N T/F P/J|Avg|
|---|---|---|
|ROMEw/o q-weighting<br>ROMEw/o gated fusion<br>ROMEw/o posts<br>ROMEw/o evidence<br>ROMEw/o pretrain|**90.13**<br>94.82<br>96.36<br>72.55<br>89.03<br>94.45<br>96.36<br>74.16<br>86.56<br>71.21<br>94.18<br>48.51<br>42.33<br>92.35<br>75.11<br>53.27<br>47.58<br>92.19<br>80.14<br>56.93|88.47<br>88.50<br>75.12<br>65.77<br>69.21|
|**ROME**|90.12<br>**95.04**<br>**96.99**<br>**76.95**|**89.78**|



**Table** **3:** **Results** **of** **ablation** **study** **on** **Kaggle**

**dataset (F1%).**


**4.6** **LLM Performance**


To analyze the standalone performance of LLMs on the person
ality detection task, we evaluate several variants of ChatGPT

on the Kaggle test set, as summarized in Table 4. Following

Hu et al. [2024], we consider two prompting configurations for

gpt-3.5-turbo (zero-shot and 3-shot) and additionally report
results for gpt-4o-2024-08-06 under the same zero-shot and

3-shot settings. Overall, these LLM variants perform comparably

to, or marginally better than the strongest LLM-based baseline

ETM, yet remain substantially below the performance of our ROME

model. Moreover, ROME queries GPT-4o only once in an offline

Ask stage to obtain question-level answers during training; while

inference is performed entirely by a compact supervised model

built upon BERT. This design yields significantly lower latency and

monetary cost compared with LLM-based prediction.

|Methods|I/E S/N T/F P/J|Avg|
|---|---|---|
|ChatGPT-3.5<br>ChatGPT-3.53-shot<br>ChatGPT-4o<br>ChatGPT-4o3-shot|65.86<br>51.69<br>78.60<br>63.93<br>70.61<br>58.35<br>76.58<br>65.43<br>81.70<br>78.15<br>85.13<br>74.67<br>80.55<br>76.53<br>84.87<br>**78.13**|66.89<br>67.74<br>79.91<br>80.02|
|**ROME**|**90.12**<br>**95.04**<br>**96.99**<br>76.95|**89.78**|



**Table** **4:** **LLM** **performances** **on** **Kaggle** **dataset**

**(F1%).**


**4.7** **Data Efficiency under Limited Supervision**


To examine how well ROME performs when labeled data are scarce,

a situation frequently encountered in practice because personal
ity annotation is costly and often subject to privacy concerns, we

simulate limited-supervision settings by down-sampling the Kag
gle training set while keeping the validation and test sets fixed.

Concretely, we train the same ROME configuration (60-item ques
tionnaire and 32 experts) using only 40%, 60%, 80%, or 100% of the

training data and report the resulting average Macro-F1 in Figure 5.

As the available training data increases, performance improves

smoothly from 78 _._ 01% (40%) to 79 _._ 91% (60%), 82 _._ 38% (80%), and

89 _._ 78% with the full dataset, indicating that the model behaves


Ask, Answer, and Detect: Role-Playing LLMs for Personality Detection with Question-Conditioned Mixture-of-Experts arXiv’25, 2025,



100


95


90


85


80


75



GPT-3.5 GPT-mix GPT-4o
Backbone LLM





100


95


90


85


80


75



**(a) Backbone LLM comparison on Kaggle dataset (F1%).**







92


90


88


86


84


82


80


78


76



|Col1|Avg<br>ETM (Avg)|Col3|89|.78|
|---|---|---|---|---|
||||||
||||||
||||||
|||82|.38||
||79|.90|||
|78|.01||||
||||||
||||||


0.4 0.6 0.8 1.0
Training fraction



**Figure 5: Effect of training data size on Kaggle dataset (F1%).**


stably across data scales and can effectively exploit additional su
pervision when it is available.

More importantly, ROME remains highly competitive even in

the most data-poor regime. With only 40% of the training data,

our model (78 _._ 01%) already slightly surpasses the best baseline

method ETM, whose average Macro-F1 under full-data training

is 77 _._ 79% (Table 2). These results highlight the data efficiency of

the Ask–Answer–Detect framework: by leveraging standardized

questionnaires and question-level supervision, ROME benefits from

a much denser and more structured training than traditional “posts

→ labels” models, and thus maintains strong performance even

when labeled users are very limited.


**4.8** **Effect of Backbone LLMs and Encoders**


To analyze the effect of backbone LLM choice, we vary the LLM

deployed as the agent in the _Ask_ stage while holding all other com
ponents of ROME fixed. Concretely, we consider GPT-3.5, GPT-4o,




arXiv’25, 2025, Yifan Lyu and Liang Zhang



100


95


90


85


80


75


70


65


60


|Col1|Col2|Col3|Col4|Col5|Col6|
|---|---|---|---|---|---|
|||||89.|78|
|84|16<br>86|33<br>~~87~~|~~76~~<br>~~88~~|~~12~~||
|||||||
|||||||
|||||||
|||||||
||||~~I/E~~<br>S/N|~~T/F~~<br>P/J<br>~~A~~|~~g~~|


|Col1|Col2|Col3|Col4|Col5|Col6|
|---|---|---|---|---|---|
||||89|.78<br>||
||84.|35<br>87.|41|~~88~~|~~21~~|
|79.|89|||||
|||||||
|||||||
|||||||
||||~~I/E~~<br>S/N|~~T/F~~<br>P/J<br>~~A~~|~~g~~|



12 24 36 48 60
#Questions



8 16 24 32 40
#Experts



100


95


90


85


80


75


70


65


60

























**Figure 6: Effect of questionnaire length on Kaggle dataset**

**(F1%).**


**4.9** **Parameters Analysis**


_4.9.1_ _Effect of questionnaire length._ We first investigate how many

questionnaire items are required for ROME to perform well. As

shown in Figure 6, we randomly subsample a fixed number of items

from the 60-item inventory (12, 24, 36, 48, or 60) and retrain the

model on Kaggle under each setting. The average Macro-F1 in
creases steadily from 84 _._ 16% with 12 items to 89 _._ 8% with all 60 items,

indicating that additional evidence systematically strengthens the

psychology-grounded reasoning process and yields more accurate

personality predictions. At the personality dimension level, S/N

and T/F remain strong across all settings, while P/J benefits most

from longer questionnaires, showing the largest performance gain

as more items are included.

Despite this clear upward trend, ROME remains highly competi
tive even with substantially shortened questionnaires. With 12 and

24 randomly sampled items, the model attains average Macro-F1s

of 84 _._ 16% and 86 _._ 33%, respectively, already outperforming the best

baseline method ETM (77 _._ 79%, Table 2) by around 8 _._ 19% and 10 _._ 98%.

This demonstrates that the Ask–Answer–Detect framework can

extract robust, psychology-aligned evidence even from incomplete

questionnaires.


_4.9.2_ _Effect of the number of experts._ We next study how the capac
ity of the question-conditioned MoE affects performance by varying

the number of experts while keeping all other settings fixed. As

shown in Figure 7, increasing the number of experts from 8 to 32

steadily improves the average Macro-F1 on Kaggle dataset from

79 _._ 89% to 89 _._ 78%, whereas further enlarging the expert pool to 40

yields a slight drop to 88 _._ 21%. This pattern suggests that a small

expert set provides insufficient capacity to capture the heteroge
neous psycholinguistic cues associated with different questionnaire

items and personality dimensions, while a moderately sized expert

pool enables more effective specialization. Beyond this regime, how
ever, the additional experts introduce extra complexity and routing

difficulty without translating into further gains.



**Figure 7: Effect of the number of experts on Kaggle dataset**

**(F1%).**


**4.10** **Case Study**


To understand how ROME integrates questionnaire items and tex
tual evidence to form personality predictions, we conduct a three
part interpretability analysis that examines the model’s behavior.

We begin with a fine-grained case study that illustrates how indi
vidual questionnaire items align with semantically relevant post

snippets to support model decisions. We then move to a quantitative

sensitivity analysis that measures the functional contribution of

each item by perturbing the evidence available at inference time. Fi
nally, we examine the routing behavior of the question-conditioned

MOE to reveal how ROME organizes its internal capacity in a

manner that reflects the structure of the MBTI psychometric ques
tionnaires.


_4.10.1_ _Question–Post Evidence Chains._ To make the Ask–Answer–

Detect pipeline more concrete, we present a qualitative case study

for a randomly selected test user whose true type is ISTJ and for

whom ROME correctly predicts all four MBTI dimensions. As shown

in Table 5, for each dimension we select a handful of questionnaire

items with the largest impact on the final decision, measured by

the change in the predicted logit when the item is removed from

the evidence aggregation. We then retrieve representative snippets

from the user’s posts that GPT-4o, in a post-hoc analysis, identifies

as semantically aligned with these high-impact items, with key

phrases highlighted for readability.

Across dimensions, the question–post pairs reveal coherent, psy
chologically plausible evidence patterns. For example, on the I/E

axis, the most influential items are supported by snippets describing

repeatedly turning down social invitations, a strong need for per
sonal space, and discomfort with close contact or crowded environ
ments, all pointing toward low social needs and a clear inclination

for solitude. And for P/J, the evidence clusters around perfection
istic attitudes toward assignments, ongoing self-evaluation, and a

strong drive to accomplish personally meaningful goals, reflecting

a structured, planful, and self-disciplined J-oriented pattern.


Ask, Answer, and Detect: Role-Playing LLMs for Personality Detection with Question-Conditioned Mixture-of-Experts arXiv’25, 2025,

























|Dim.|Q#|Question|Direction|𝚫logit|Text evidence (snippet)|
|---|---|---|---|---|---|
|I/E|Q21|You enjoy solitary hobbies or activities more<br>than group ones.|I|−3_._19|“...Feeling cozy in over sized sweaters, reading a good book in<br>a warm bed...”|
|I/E|Q43|You can easily connect with people you have<br>just met.|I|−0_._84|“I fnd myself turning down anyone who asks me out or shows<br>interest in me, even if we get along well...”|
|I/E|Q41|You avoid making phone calls.|I|−0_._62|“The very thought of having my personal space violated in that<br>manner by a complete stranger is terrifying to me.”|
|S/N|Q2|Complex and novel ideas excite you more than<br>simple and straightforward ones.|S|−1_._71|“Usually, I don’t really like discussing topics like these but the<br>posts here are so relatable.”|
|S/N|Q42|You enjoy exploring unfamiliar ideas and view-<br>points.|N|+0_._83|“That’s an interesting perspective – that we shouldn’t hold<br>others’ imperfections against them.”|
|S/N|Q57|You prefer tasks that require you to come up<br>with creative solutions rather than follow con-<br>crete steps.|S|−0_._45|“Try comparing your resume with the people you know who’ve<br>gotten hired. Try to follow their style...”|
|T/F|Q3|You usually feel more persuaded by what res-<br>onates emotionally with you than by factual<br>arguments.|T|−1_._54|“That map isn’t very reliable. I know INFPs who live outside<br>of Europe/Americas and there isn’t a single dot...”|
|T/F|Q58|You are more likely to rely on emotional in-<br>tuition than logical reasoning when making a<br>choice.|T|−1_._13|“I’ve recently read up on body language in an efort to improve<br>my social skills. I seem to be able to read people well.”|
|T/F|Q15|You rarely worry about whether you make a<br>good impression on people you meet.|F|+1_._05|“As a child and adolescent, I would lay awake for nights in a<br>row with my stomach knotting and turning out of guilt, even<br>if the person said it didn’t bother them.”|
|P/J|Q4|Your living and working spaces are clean and<br>organized.|J|+1_._02|“If an assignment, essay, or other work was not perfect in my<br>eyes, I really struggled just handing it in.”|
|P/J|Q34|You fnd it challenging to maintain a consistent<br>work or study schedule.|J|+1_._00|“Lately, I have been evaluating my behaviors and life and have<br>concluded that I need to step...”|
|P/J|Q44|If your plans are interrupted, your top priority<br>is to get back on track as soon as possible.|J|+0_._51|“I’d say that wanting to accomplish my goals because of what<br>is important to me keeps me going.”|


**Table 5: Illustrative question–post evidence for a representative ISTJ user.**



Overall, this case study demonstrates that ROME’s personal
ity predictions are supported by a layered chain of question-level

diagnostics and post-level linguistic cues.


_4.10.2_ _Sensitivity of Item Removal._ To evaluate the functional role

of individual questionnaire items in ROME’s inference process and

verify whether the learned question weights ( _𝑤𝑖_ in Equation (7))

capture truly diagnostic evidence, we conduct a sensitivity analysis

based on item removal where the trained model is kept fixed and

only the questionnaire evidence is altered. For each user and each

MBTI dimension, we remove exactly one item from the weighted

question summary in three ways: deleting the item with the highest

learned weight (ROMEdrop-max-question), deleting the item with the

lowest weight (ROMEdrop-rand-question), or randomly deleting one

item (ROMEdrop-min-question). As shown in Table 6, removing the

highest-weight item leads to the largest degradation, reducing the

average Macro-F1 from 89 _._ 78% to 86 _._ 95%, with the S/N dimension

dropping by more than 10 points. Random deletion produces a

milder decline (89 _._ 12%), while removing the lowest-weight item

leaves the overall performance almost unchanged. This pattern

indicates that the learned question weights meaningfully reflect the

diagnostic value of individual items: high-weight questions carry

indispensable evidence for the final decision, low-weight questions

play a marginal role, and the model remains reasonably robust

under mild evidence loss.



|Methods|I/E S/N T/F P/J|Avg|
|---|---|---|
|ROMEdrop-max-question<br>ROMEdrop-rand-question<br>ROMEdrop-min-question|89.91<br>84.09<br>96.73<br>**77.05**<br>**90.31**<br>93.45<br>96.56<br>76.14<br>90.19<br>94.28<br>96.64<br>76.73|86.95<br>89.12<br>89.46|
|**ROME**|90.12<br>**95.04**<br>**96.99**<br>76.95|**89.78**|


**Table 6: Sensitivity of item removal on Kaggle**

**dataset (F1%).**


_4.10.3_ _Expert_ _Activation_ _Analysis:_ _Internal_ _Specialization_ _in_ _the_
_MoE._ To further interpret our model, we analyze how the question
conditioned MoE allocates expert capacity across personality di
mensions. For each user and each questionnaire item, we record

the soft routing probabilities assigned to the experts and aggre
gate them over all users and all items associated with each MBTI

dimension. Normalizing these aggregated values yields a 32 × 4
matrix reflecting the _relative attention_ each expert devotes to the
four MBTI dimensions ( _i.e._, I/E, S/N, T/F, and P/J).

As visualized in Figure 8, many experts exhibit a clear domi
nant dimension, concentrating the majority of their attention on

one of the four MBTI axes, while others display more mixed rout
ing patterns across dimensions. This specialization suggests that

the MoE develops a meaningful division of labor, with different


arXiv’25, 2025, Yifan Lyu and Liang Zhang



experts focusing on distinct psychological constructs and person
ality dimensions, while a small group of shared experts capturing

cross-dimensional knowledge.


**5** **Conclusion**


In this paper, we propose a role-play–enhanced, question
conditioned Mixture-of-Experts framework for personality

detection that replaces the prevailing _posts_ → _user vector_ → _labels_

paradigm with an Ask–Answer–Detect pipeline. By leveraging an

LLM-based role-play agent to generate question-level answers and

treating these answers as questionnaire-grounded evidence, our

framework injects structured psychological knowledge into the

modeling process and provides an explicit question-level reasoning

chain from raw text to personality labels. Extensive experiments

on two real-world datasets demonstrate substantial and consistent

gains, with relative macro-F1 improvements of up to 15.41% and

4.97% over state-of-the-art baselines.


Expert-wise Attention over MBTI Dimensions



E0

E1

E2

E3

E4

E5

E6

E7

E8

E9

E10

E11

E12

E13

E14

E15

E16

E17

E18

E19

E20

E21

E22

E23

E24

E25

E26

E27

E28

E29

E30

E31



I/E S/N T/F P/J
MBTI Dimension



0.45


0.40


0.35


0.30


0.25


0.20


0.15


0.10


0.05


0.00



**Figure 8: Expert activation analysis on Kaggle dataset.**


**References**


Zahra Abbasiantaeb, Yifei Yuan, Evangelos Kanoulas, and Mohammad Aliannejadi.

2024. Let the LLMs Talk: Simulating Human-to-Human Conversational QA via
Zero-Shot LLM-to-LLM Interactions. In _Proceedings of the 17th ACM International_
_Conference on Web Search and Data Mining (WSDM ’24)_ . Association for Computing

Machinery, New York, NY, USA, 8–17. [doi:10.1145/3616855.3635856](https://doi.org/10.1145/3616855.3635856)



Weihong Bi, Feifei Kou, Lei Shi, Yawen Li, Haisheng Li, Jinpeng Chen, and Mingying

Xu. 2025. Leveraging the Dual Capabilities of LLM: LLM-Enhanced Text Mapping
Model for Personality Detection. In _Proceedings of the AAAI Conference on Artificial_
_Intelligence_, Vol. 39. 23487–23495. [doi:10.1609/aaai.v39i22.34517](https://doi.org/10.1609/aaai.v39i22.34517)

Tom B. Brown, Benjamin Mann, Nick Ryder, et al. 2020. Language Models are Few-Shot Learners. In _Advances_ _in_ _Neural_ _Information_ _Processing_ _Sys-_
_tems_, Vol. 33. 1877–1901. [https://papers.nips.cc/paper_files/paper/2020/hash/](https://papers.nips.cc/paper_files/paper/2020/hash/1457c0d6bfcb4967418bfb8ac142f64a-Paper.pdf)

[1457c0d6bfcb4967418bfb8ac142f64a-Paper.pdf](https://papers.nips.cc/paper_files/paper/2020/hash/1457c0d6bfcb4967418bfb8ac142f64a-Paper.pdf)

Tianqi Chen and Carlos Guestrin. 2016. XGBoost: A Scalable Tree Boosting System.
In _Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge_
_Discovery and Data Mining_ . Association for Computing Machinery, New York, NY,

USA, 785–794. [doi:10.1145/2939672.2939785](https://doi.org/10.1145/2939672.2939785)

Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova. 2019. BERT:

Pre-training of Deep Bidirectional Transformers for Language Understanding. In
_Proceedings of the 2019 Conference of the North American Chapter of the Association_
_for Computational Linguistics: Human Language Technologies_ . 4171–4186. [doi:10.](https://doi.org/10.18653/v1/N19-1423)

[18653/v1/N19-1423](https://doi.org/10.18653/v1/N19-1423)

Nan Du, Yanping Huang, et al. 2022. GLaM: Efficient Scaling of Language Models
with Mixture-of-Experts. _arXiv preprint arXiv:2112.06905_ (2022). [arXiv:2112.06905](https://arxiv.org/abs/2112.06905)

[https://arxiv.org/abs/2112.06905](https://arxiv.org/abs/2112.06905)

William Fedus, Barret Zoph, and Noam Shazeer. 2021. Switch Transformers: Scaling
to Trillion Parameter Models with Simple and Efficient Sparsity. _arXiv preprint_
_arXiv:2101.03961_ (2021). [arXiv:2101.03961 doi:10.48550/arXiv.2101.03961](https://arxiv.org/abs/2101.03961)

Jeffrey Gottfried. 2024. Americans’ Social Media Use. [https://www.pewresearch.org/](https://www.pewresearch.org/internet/2024/01/31/americans-social-media-use/)

[internet/2024/01/31/americans-social-media-use/](https://www.pewresearch.org/internet/2024/01/31/americans-social-media-use/) Accessed 2025-10-02.

Linmei Hu, Hongyu He, Duokang Wang, Ziwang Zhao, Yingxia Shao, and Liqiang

Nie. 2024. LLM vs Small Model? Large Language Model Based Text Augmentation
Enhanced Personality Detection Model. In _Proceedings of the AAAI Conference on_
_Artificial Intelligence_, Vol. 38. 18234–18242. [doi:10.1609/aaai.v38i16.29782](https://doi.org/10.1609/aaai.v38i16.29782)

Albert Q. Jiang, Alexandre Sablayrolles, Antoine Roux, Arthur Mensch, Guillaume
Lample, et al. 2024. Mixtral of Experts. _arXiv_ _preprint_ _arXiv:2401.04088_ (2024).

[doi:10.48550/arXiv.2401.04088](https://doi.org/10.48550/arXiv.2401.04088)

Hang Jiang, Xianzhe Zhang, and Jinho D. Choi. 2020a. Automatic Text-based Per
sonality Recognition on Monologues and Multiparty Dialogues Using Attentive
Networks and Contextual Embeddings (Student Abstract). In _Proceedings of the_
_34th AAAI Conference on Artificial Intelligence: Student Abstract and Poster Program_,

Vol. 34. 13821–13822. [doi:10.1609/aaai.v34i10.7182](https://doi.org/10.1609/aaai.v34i10.7182)

Hang Jiang, Xianzhe Zhang, and Jinho D. Choi. 2020b. Automatic Text-based Per
sonality Recognition on Monologues and Multiparty Dialogues Using Attentive
Networks and Contextual Embeddings (Student Abstract). In _Proceedings of the_
_AAAI_ _Conference_ _on_ _Artificial_ _Intelligence:_ _Student_ _Abstract_ _and_ _Poster_ _Program_,

Vol. 34. 13821–13822. [doi:10.1609/aaai.v34i10.7182](https://doi.org/10.1609/aaai.v34i10.7182)

Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, et al. 2020. Scaling Laws for Neural Language Models. _arXiv_ _preprint_ _arXiv:2001.08361_ (2020).

[arXiv:2001.08361](https://arxiv.org/abs/2001.08361) [https://arxiv.org/abs/2001.08361](https://arxiv.org/abs/2001.08361)

Sedrick Scott Keh and I-Tsun Cheng. 2019a. Myers-Briggs Personality Classification

and Personality-Specific Language Generation Using Pre-trained Language Models.
_arXiv preprint arXiv:1907.06333_ (2019). [arXiv:1907.06333](https://arxiv.org/abs/1907.06333) [https://arxiv.org/abs/1907.](https://arxiv.org/abs/1907.06333)

[06333](https://arxiv.org/abs/1907.06333)

Sedrick Scott Keh and I-Tsun Cheng. 2019b. Myers-Briggs Personality Classification

and Personality-Specific Language Generation Using Pre-trained Language Models.
_CoRR_ abs/1907.06333 (2019). [arXiv:1907.06333 [cs.LG]](https://arxiv.org/abs/1907.06333) [https://arxiv.org/abs/1907.](https://arxiv.org/abs/1907.06333)

[06333](https://arxiv.org/abs/1907.06333)
Otto F. Kernberg. 2016. What Is Personality? _Journal of Personality Disorders_ 30, 2

(2016), 145–156. [doi:10.1521/pedi.2016.30.2.145](https://doi.org/10.1521/pedi.2016.30.2.145)

Dmitry Lepikhin, HyoukJoong Lee, et al. 2020. GShard: Scaling Giant Models with
Conditional Computation and Automatic Sharding. _arXiv preprint arXiv:2006.16668_

(2020). [arXiv:2006.16668 doi:10.48550/arXiv.2006.16668](https://arxiv.org/abs/2006.16668)

Guohao Li, Hasan Abed Al Kader Hammoud, Hani Itani, Dmitrii Khizbullin, and

Bernard Ghanem. 2023. CAMEL: Communicative Agents for “Mind” Exploration of
Large Language Model Society. _arXiv_ (2023). [arXiv:2303.17760 doi:10.48550/arXiv.](https://arxiv.org/abs/2303.17760)

[2303.17760](https://doi.org/10.48550/arXiv.2303.17760)

Aixin Liu, Bei Feng, Bin Wang, et al. 2024. DeepSeek-V2: A Strong, Economical,
and Efficient Mixture-of-Experts Language Model. _arXiv preprint arXiv:2405.04434_

(2024). [arXiv:2405.04434](https://arxiv.org/abs/2405.04434) [https://arxiv.org/abs/2405.04434](https://arxiv.org/abs/2405.04434)

Ryan Louie, Ananjan Nandi, William Fang, Cheng Chang, Emma Brunskill, and Diyi

Yang. 2024. Roleplay-doh: Enabling Domain-Experts to Create LLM-simulated Patients via Eliciting and Adhering to Principles. In _Proceedings of the 2024 Conference_
_on Empirical Methods in Natural Language Processing_ . Association for Computa
tional Linguistics, Miami, Florida, USA, 10570–10603. [doi:10.18653/v1/2024.emnlp-](https://doi.org/10.18653/v1/2024.emnlp-main.591)

[main.591](https://doi.org/10.18653/v1/2024.emnlp-main.591)

Veronica Lynn, Niranjan Balasubramanian, and H. Andrew Schwartz. 2020. Hier
archical Modeling for User Personality Prediction: The Role of Message-Level
Attention. In _Proceedings of the 58th Annual Meeting of the Association for Computa-_
_tional Linguistics_ . Association for Computational Linguistics, Online, 5306–5316.

[doi:10.18653/v1/2020.acl-main.472](https://doi.org/10.18653/v1/2020.acl-main.472)

Jiaqi Ma, Zhe Zhao, Xinyang Yi, Jilin Chen, Lichan Hong, and Ed H. Chi. 2018. Modeling

Task Relationships in Multi-task Learning with Multi-gate Mixture-of-Experts.


Ask, Answer, and Detect: Role-Playing LLMs for Personality Detection with Question-Conditioned Mixture-of-Experts arXiv’25, 2025,



In _Proceedings_ _of_ _the_ _24th_ _ACM_ _SIGKDD_ _International_ _Conference_ _on_ _Knowledge_
_Discovery and Data Mining_ . 1930–1939. [doi:10.1145/3219819.3220007](https://doi.org/10.1145/3219819.3220007)

François Mairesse, Marilyn A. Walker, Matthias R. Mehl, and Roger K. Moore. 2007.

Using linguistic cues for the automatic recognition of personality in conversation
and text. _Journal of Artificial Intelligence Research_ 30 (2007), 457–500. [doi:10.1613/](https://doi.org/10.1613/jair.2349)

[jair.2349](https://doi.org/10.1613/jair.2349)

Isabel Briggs Myers, Mary H. McCaulley, Naomi L. Quenk, and Allen L. Hammer.
1998. _MBTI_ _Manual:_ _A_ _Guide_ _to_ _the_ _Development_ _and_ _Use_ _of_ _the_ _Myers–Briggs_
_Type Indicator_ (3rd ed.). Consulting Psychologists Press, Palo Alto, CA. [https:](https://isbnsearch.org/isbn/9780891061304)

[//isbnsearch.org/isbn/9780891061304](https://isbnsearch.org/isbn/9780891061304)

Joon Sung Park, Joseph C. O’Brien, Carrie J. Cai, Meredith Ringel Morris, Percy Liang,

and Michael S. Bernstein. 2023. Generative Agents: Interactive Simulacra of Human
Behavior. In _Proceedings_ _of_ _the_ _36th_ _Annual_ _ACM_ _Symposium_ _on_ _User_ _Interface_
_Software and Technology (UIST ’23)_ . [doi:10.1145/3586183.3606763](https://doi.org/10.1145/3586183.3606763)

James W. Pennebaker, Roger J. Booth, Ryan L. Boyd, and Martha E. Francis. 2015.
_Linguistic Inquiry and Word Count: LIWC2015_ . Austin, TX. [https://liwc.app/static/](https://liwc.app/static/documents/LIWC2015%20Manual%20-%20Operation.pdf)

[documents/LIWC2015%20Manual%20-%20Operation.pdf](https://liwc.app/static/documents/LIWC2015%20Manual%20-%20Operation.pdf)

Zihan Qiu, Zeyu Huang, Shuang Cheng, Yizhi Zhou, Zili Wang, Ivan Titov, and Jie
Fu. 2024. Layerwise Recurrent Router for Mixture-of-Experts. _arXiv_ _preprint_
_arXiv:2408.06793_ (2024). [doi:10.48550/arXiv.2408.06793](https://doi.org/10.48550/arXiv.2408.06793) ICLR 2025 (Poster).

H. Andrew Schwartz, Johannes C. Eichstaedt, Margaret L. Kern, Lukasz Dziurzynski,

Stephanie M. Ramones, Megha Agrawal, Achal Shah, Michal Kosinski, David Still
well, Martin E. P. Seligman, and Lyle H. Ungar. 2013. Personality, Gender, and Age
in the Language of Social Media: The Open-Vocabulary Approach. _PLOS ONE_ 8, 9

(2013), e73791. [doi:10.1371/journal.pone.0073791](https://doi.org/10.1371/journal.pone.0073791)

Noam Shazeer, Azalia Mirhoseini, et al. 2017. Outrageously Large Neural Networks:
The Sparsely-Gated Mixture-of-Experts Layer. _arXiv_ _preprint_ _arXiv:1701.06538_

(2017). [arXiv:1701.06538](https://arxiv.org/abs/1701.06538) [https://arxiv.org/abs/1701.06538](https://arxiv.org/abs/1701.06538)

Sanja Štajner and Seren Yenikent. 2020. A Survey of Automatic Personality Detection
from Texts. In _Proceedings of the 28th International Conference on Computational_
_Linguistics_ . International Committee on Computational Linguistics, Barcelona,

Spain (Online), 6284–6295. [doi:10.18653/v1/2020.coling-main.553](https://doi.org/10.18653/v1/2020.coling-main.553)

Malede Mequanint Tadesse, Hongfei Lin, Bo Xu, and Liang Yang. 2017. Personality
Prediction System from Facebook Users. _Procedia_ _Computer_ _Science_ 116 (2017),

604–611. [doi:10.1016/j.procs.2017.10.016](https://doi.org/10.1016/j.procs.2017.10.016)

Yu-Min Tseng, Yu-Chao Huang, Teng-Yun Hsiao, Wei-Lin Chen, Chao-Wei Huang,

Yu Meng, and Yun-Nung Chen. 2024. Two Tales of Persona in LLMs: A Survey of
Role-Playing and Personalization. In _Findings of the Association for Computational_
_Linguistics: EMNLP 2024_ . Association for Computational Linguistics, Miami, Florida,

USA, 16612–16631. [doi:10.18653/v1/2024.findings-emnlp.969](https://doi.org/10.18653/v1/2024.findings-emnlp.969)

Lei Wang, Jianxun Lian, Yi Huang, Yanqi Dai, Haoxuan Li, Xu Chen, Xing Xie, and Ji
Rong Wen. 2025. CharacterBox: Evaluating the Role-Playing Capabilities of LLMs in
Text-Based Virtual Worlds. In _Proceedings of the 2025 Conference of the Nations of the_
_Americas Chapter of the Association for Computational Linguistics: Human Language_
_Technologies (Volume 1: Long Papers)_ . Association for Computational Linguistics,

Albuquerque, New Mexico, 6372–6391. [doi:10.18653/v1/2025.naacl-long.323](https://doi.org/10.18653/v1/2025.naacl-long.323)

Noah Wang, Z.y. Peng, Haoran Que, Jiaheng Liu, Wangchunshu Zhou, Yuhan Wu,

Hongcheng Guo, Ruitong Gan, Zehao Ni, Jian Yang, Man Zhang, Zhaoxiang Zhang,

Wanli Ouyang, Ke Xu, Wenhao Huang, Jie Fu, and Junran Peng. 2024. RoleLLM:

Benchmarking, Eliciting, and Enhancing Role-Playing Abilities of Large Language
Models. In _Findings_ _of_ _the_ _Association_ _for_ _Computational_ _Linguistics:_ _ACL_ _2024_ .

[Association for Computational Linguistics, Bangkok, Thailand, 14743–14777. doi:10.](https://doi.org/10.18653/v1/2024.findings-acl.878)

[18653/v1/2024.findings-acl.878](https://doi.org/10.18653/v1/2024.findings-acl.878)

Jason Wei, Maarten Bosma, Vincent Y. Zhao, et al. 2022a. Finetuned Language Models
are Zero-Shot Learners. _arXiv_ (2022). [arXiv:2109.01652](https://arxiv.org/abs/2109.01652) [https://arxiv.org/abs/2109.](https://arxiv.org/abs/2109.01652)

[01652](https://arxiv.org/abs/2109.01652)

Jason Wei, Xuezhi Wang, Dale Schuurmans, et al. 2022b. Chain-of-Thought Prompting
Elicits Reasoning in Large Language Models. _arXiv preprint arXiv:2201.11903_ (2022).

[arXiv:2201.11903 doi:10.48550/arXiv.2201.11903](https://arxiv.org/abs/2201.11903)

Chengxing Xie, Canyu Chen, Feiran Jia, Ziyu Ye, Shiyang Lai, Kai Shu, Jindong Gu,

Adel Bibi, Ziniu Hu, David Jurgens, et al. 2024. Can Large Language Model Agents
Simulate Human Trust Behavior?. In _Advances in Neural Information Processing_
_Systems_ _37_ . Neural Information Processing Systems Foundation, 15674–15729.

[doi:10.52202/079017-0501](https://doi.org/10.52202/079017-0501)

Di Xue, Lifa Wu, Zheng Hong, Shize Guo, Liang Gao, Zhiyong Wu, Xiaofeng Zhong,

and Jianshan Sun. 2018. Deep learning-based personality recognition from text
posts of online social networks. _Applied_ _Intelligence_ 48, 12 (2018), 4232–4246.

[doi:10.1007/s10489-018-1212-4](https://doi.org/10.1007/s10489-018-1212-4)

Feifan Yang, Xiaojun Quan, Yunyi Yang, and Jianxing Yu. 2021a. Multi-Document
Transformer for Personality Detection. In _Proceedings of the AAAI Conference on_
_Artificial Intelligence_, Vol. 35. 14221–14229. [doi:10.1609/aaai.v35i16.17673](https://doi.org/10.1609/aaai.v35i16.17673)

Feifan Yang, Xiaojun Quan, Yunyi Yang, and Jianxing Yu. 2021b. Multi-Document
Transformer for Personality Detection. In _Proceedings of the AAAI Conference on_
_Artificial Intelligence_ [, Vol. 35. AAAI Press, 14221–14229. doi:10.1609/aaai.v35i5.17771](https://doi.org/10.1609/aaai.v35i5.17771)

Tao Yang, Jinghao Deng, Xiaojun Quan, and Qifan Wang. 2023. Orders Are Unwanted:
Dynamic Deep Graph Convolutional Network for Personality Detection. In _Pro-_
_ceedings_ _of_ _the_ _AAAI_ _Conference_ _on_ _Artificial_ _Intelligence_, Vol. 37. 13896–13904.



[doi:10.1609/aaai.v37i11.26627](https://doi.org/10.1609/aaai.v37i11.26627)

Tao Yang, Feifan Yang, Haolan Ouyang, and Xiaojun Quan. 2021c. Psycholinguistic Tripartite Graph Network for Personality Detection. In _Proceedings of the 59th Annual_
_Meeting of the Association for Computational Linguistics and the 11th International_
_Joint Conference on Natural Language Processing (Volume 1: Long Papers)_ . Associa
tion for Computational Linguistics, Online, 4229–4239. [doi:10.18653/v1/2021.acl-](https://doi.org/10.18653/v1/2021.acl-long.326)

[long.326](https://doi.org/10.18653/v1/2021.acl-long.326)

Wu Youyou, Michal Kosinski, and David Stillwell. 2015. Computer-based personality
judgments are more accurate than those made by humans. _Proceedings_ _of_ _the_
_National Academy of Sciences of the United States of America_ 112, 4 (2015), 1036–

1040. [doi:10.1073/pnas.1418680112](https://doi.org/10.1073/pnas.1418680112)

Hao Zhao, Zihan Qiu, Huijia Wu, Zili Wang, Zhaofeng He, and Jie Fu. 2024. HyperMoE:
Towards Better Mixture of Experts via Transferring Among Experts. _arXiv preprint_
_arXiv:2402.12656_ (2024). [doi:10.48550/arXiv.2402.12656](https://doi.org/10.48550/arXiv.2402.12656)

Yangfu Zhu, Linmei Hu, Xinkai Ge, Wanrong Peng, and Bin Wu. 2022. Contrastive
Graph Transformer Network for Personality Detection. In _Proceedings of the 31st_
_International_ _Joint_ _Conference_ _on_ _Artificial_ _Intelligence_ _(IJCAI_ _2022)_ . 4559–4565.

[doi:10.24963/ijcai.2022/633](https://doi.org/10.24963/ijcai.2022/633)


