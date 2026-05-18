## **Adam’s Law: Textual Frequency Law on Large Language Models**

**Hongyuan Adam Lu** _[♣]_ [*] **, Z.L.** _[♣∗]_ **, Victor Wei** _[♣]_ **, Zefan Zhang** _[♣]_ **, Zhao Hong** _[♣]_ **, Qiqi Xiang** _[♣]_

**Bowen Cao** _[♡]_ **, Wai Lam** _[♡]_

_♣_ FaceMind Corporation
_♡_ The Chinese University of Hong Kong
hongyuanlu@outlook.com


**Abstract**



While textual frequency has been validated
as relevant to human cognition in reading
speed, its relatedness to Large Language Models (LLMs) is seldom studied. We propose a
novel research direction in terms of textual data
frequency, which is an understudied topic, to
the best of our knowledge. Our framework is
composed of three units. First, this paper proposes **T** extual **F** requency **L** aw (TFL), which
indicates that frequent textual data should be
preferred for LLMs for both prompting and
fine-tuning. Since many LLMs are closedsource in their training data, we propose using online resources to estimate the sentencelevel frequency. We then utilize an input paraphraser to paraphrase the input into a more frequent textual expression. Next, we propose
**T** extual **F** requency **D** istillation (TFD) by querying LLMs to conduct story completion by further extending the sentences in the datasets, and
the resulting corpora are used to adjust the initial estimation. Finally, we propose **C** urriculum
**T** extual **F** requency **T** raining (CTFT) that finetunes LLMs in an increasing order of sentencelevel frequency. Experiments are conducted on
our curated dataset **T** extual **F** requency **P** aired
**D** ataset (TFPD) on math reasoning, machine
translation, commonsense reasoning and agentic tool calling. Results show the effectiveness
of our framework. [1]


**1** **Introduction**


Large language models (LLMs) have demonstrated
many exciting abilities and applications, such as
chain-of-thought reasoning (Wang et al., 2023; Wei
et al., 2024), machine translation (Lu et al., 2023;
Zhu et al., 2024a), and spatial reasoning (Hu et al.,
2024), etc. More recently, increasing the length of
the reasoning processes has become another popular research direction (DeepSeek-AI et al., 2025;


  - Equal Contribution.
[1https://github.com/HongyuanLuke/frequencylaw](https://github.com/HongyuanLuke/frequencylaw)



Figure 1: **Top:** A simplified example of use case of
Textual Frequency Law, where the prompt contents
are rephrased and the prompt contents with higher frequency are selected. **Middle:** We achieve this by estimating sentence-level frequency with word-level frequency. **Bottom:** A toy example showing the effectiveness of our framework. Real case studies are available
in the Appendix in Figure 6. The paraphrasing can lead
to semantic drift, which is the reason why human annotation is necessary in this process.


Muennighoff et al., 2025). Another important factor for training is the order of training, where it
could be preferable from easy to hard in terms of
the data difficulty (Lu and Lam, 2023), or from
short to long in terms of data length (Zhu et al.,
2025). Yet, what kind of data should be favourable
during the training is an overlooked topic. Previous
works have explored and concluded that the qual

ity of the data is usually important (Iskander et al.,
2024; Jin and Wang, 2024). The amount of data is
also important (Grattafiori et al., 2024).

Oh et al. (2024) found that larger models predict
rare words better. In the era of LLMs, scaling factors usually mean that larger models can be better.
This then may mean that predicting rare (less frequent) words could be a harder task than predicting
frequent words. Cao et al. (2024) demonstrated
that when prompting LLMs, different prompts with
the same meaning could give very different results
in terms of quality.
This motivates us to investigate when the data
are paraphrased to each other with the same meaning but different language expressions. The use
of paraphrases has been explored in NLP research
for many cases, such as mitigating data contamination (Zhu et al., 2024b), evaluating generation
tasks (Tang et al., 2024) and data augmentation
(DA, Abaskohi et al. (2023)). As a DA method,
paraphrases are useful for training LLMs (Lu and
Lam, 2023), so this means that we might want to
include all the paraphrases in the training when
it is affordable. However, training resources are
usually limited, and we investigate whether the frequency matters when the meaning is kept, and the
computational resources are limited for fine-tuning.
Also, such investigation on paraphrased inputs into
LLMs can be important, as Cao et al. (2024) has
found that they usually give different performance,
but there isn’t a clear conclusion yet which factors
are relevant to this phenomenon.
In contrast, this paper proposes novel **T** extual
**F** requency **L** aw (TFL), which suggests that when
the meanings are kept the same, data with higher
sentence-level frequency should be preferred to the
ones with low frequency, for both prompting and
fine-tuning. The underlying motivation is that this
paper postulates that higher-frequency data occurs
more frequently than lower-frequency data in the
pre-training stage, so they are easier to understand
by LLMs. Based on such a law, this paper proposes
to calculate the frequency estimation through online open-source data corpora, as many LLMs are
closed-source and we usually do not have direct
access to their training data. To further enhance
the estimation, this paper proposes a novel method
called **F** requency **T** extual **D** istillation. TFD conducts story completion with a text dataset on the
target LLMs, and the completed story generation is
used to enhance the original frequency estimation.
Last, we propose **C** urriculum **T** extual **F** requency



**T** raining (CTFT) that fine-tunes LLMs in increasing order of sentence-level frequency with the training data, which yields better results.
Our frequency training framework is composed
of three units, and our contributions are three-fold:


  - We propose **T** extual **F** requency **L** aw, which
suggests that high-frequency textual data
should be preferred for LLMs when conducting prompting and fine-tuning, when the
meaning of the data is kept the same, i.e., they
are paraphrases.


  - We propose a novel method called **T** extual
**F** requency **D** istillation to further enhance the
frequency estimation (collected from online
resources) via conducting story completion to
collect model generation from those LLMs
that we do not have direct access to the training textual data.


  - We propose a novel method called **C** urriculum
**T** extual **F** requency **T** raining that fine-tunes
LLMs in an increasing order of sentence-level
frequency with the training data.


Figure 1 demonstrates a use case of our proposed
framework, where prompts are rephrased to achieve
higher accuracy.


**2** **Prior Works**


**2.1** **Textual Frequency**


Textual frequency is even related to human neural
activation. Desai et al. (2020) explored the neural activation differences between low-frequency
words and high-frequency words in reading tasks,
finding that high-frequency words generally evoke
stronger neural responses. Alexandrov et al. (2011)
explored the neural activation differences between
low-frequency words and high-frequency words in
reading tasks, finding that high-frequency words
generally evoke stronger neural responses. Mohan
and Weber (2019) also mentioned the impact of
word frequency on semantic retrieval.
Then, textual frequency plays an important role
in artificial intelligence. Heylen et al. (2008) investigated the semantic similarity between words of
different frequencies and found that high-frequency
target words have higher semantic similarity with
their nearest neighbour words. This indicates the
impact of word frequency on semantic relationship
retrieval. Oh et al. (2024) found that larger models predict rare words better. This then may mean


that predicting rare (less frequent) words could be
a harder task than predicting frequent words, as
larger models can usually be stronger.


**2.2** **Paraphrasing on Language Models**


Paraphrasing is an important language task that is
tackled well by language models (Witteveen and
Andrews, 2019; Goyal and Durrett, 2020). Yet,
paraphrasing can still be a useful method to improve language models from various aspects. Tang
et al. (2024) uses paraphrases to generate diverse
references, which helps in evaluating language
models. Zhu et al. (2024b) uses paraphrasing as a
method to cleanly evaluate the possibly contaminated large language models. Gao et al. (2020) uses
paraphrases as data augmentation to improve goaloriented dialogue systems. More recently, Guo
et al. (2023) also uses generative data augmentation, which reflects the usefulness of paraphrasing in enhancing model performance. One setting
in this paper compares the performance of LLMs
on paraphrases with the same meaning but different frequencies. Yet, there are some overlooks in
the previous setting. It is crucial as the computational budgets for training and prompting (Cao
et al., 2024) are usually limited. It raises questions:
which paraphrases are more useful? Should we
use all paraphrases? Our results suggest that highfrequency paraphrases should be preferred under
both prompting and fine-tuning scenarios.


**3** **Proposed Approach**


**3.1** **Task Formulation**


The large language model (LLM) can be regarded
as a Seq2Seq neural network (Sutskever et al.,
2014) to follow the instructions to conduct various tasks with additional inputs by maximising the
following likelihood:



contains the actual question. In contrast, for MT, **i**
is usually the instruction to ask LLMs to translate
the actual sentence **x** to the target language while
maintaining the actual meaning. For convenience,
we denote **x** as the concatenation of the instruction
and the actual input in the rest of this section.


**3.2** **Textual Frequency Law**


This paper proposes **T** extual **F** requency **L** aw (TFL)
to select the paraphrases with the highest sentencelevel textual frequency for both prompting and finetuning on LLMs:


argmax **x** _∈P_ (sfreq( **x** _, D_ )) _,_ (2)


where **x** corresponds to the textual input as in Equation 1. _P_ represents a set of paraphrases that contain the same meaning. sfreq represents a function
that evaluates a sentence-level textual frequency.
Such a frequency function freq can be obtained
and calculated given a corpus _D_ . In this paper, we
suggest that such sentence-level frequency can be
estimated by using a position-unaware multiplication of word-level frequency:


~~�~~
sfreq( **x** _, D_ ) = K �K 1 (3)
_k_ =1 [wfreq(] **[x]** _[k][,][ D]_ [)]


Here, wfreq is the word-level frequency calculator that we use to estimate the sentence-level frequency. In this paper, we suggest that there is no
need to obtain the actual training data of LLMs, and
an arbitrary text corpus can be adapted to obtain the
frequency. We obtain the sentence-level frequency
with the inverse normalised multiplication of the
word-level frequency.


**Prompting** When prompting with **x**, higher **x**
should be used to generate outputs from LLMs.


**Fine-tuning** For fine-tuning, **x** with a higher frequency should be used together with the desired
ground truth output **y** to fine-tune the LLMs.


**3.3** **Textual Frequency Distillation**


Note that the frequency we obtained in the previous section is an estimation from online resources
but not the actual data, as many LLMs are closedsource in their training data. This paper proposes
**T** extual **F** requency **D** istillation (TFD) to further enhance this estimation. TFD asks LLMs to generate
data by the following instructions:



_P_ ( **y** _|_ **i** _,_ **x** ) =



T


_P_ ( _yj_ _| y_ 1 _, ..., yj−_ 1 _,_ **i** _,_ **x** ) _,_ (1)

_j_ =1



where T represents the length of the generated output and _yj_ represents the word at the position _j_ that
has been inferenced. **i** represents the instruction to
guide the LLMs to process the inputs. **x** represents
the source sentences. Note that the actual format
could be case by case for different tasks. For example, we conduct experiments on math reasoning
and machine translation (MT). For math reasoning, there is no **x**, as the instruction itself already


, where <textual data> represents the data we
have in our training set. We denote this distilled
dataset as _D_ _[′]_ . We obtain a new frequency estimation:
_F_ 2 = sfreq( **x** _, D_ _[′]_ ) _,_ (4)


and we denote the original frequency estimation as
in Equation 3 as _F_ 1. Note that this step in obtaining
_F_ 2 is relatively computationally expensive, as the
data are distilled from the actual LLMs. This is,
therefore, optional, and our proposed method is
still effective even with _F_ 1 only. We then calculate
the final frequency _F_ as:


_F_ ( _x_ ) = _αF_ 1( _x_ ) + (1 + _ζ_ 1 ( _F_ 1( _x_ ) = 0)) _βF_ 2( _x_ ) _,_
(5)
where _α_, _β_, and _ζ_ are hyper-parameters. In the formula above, _ζ_ is a strengthening factor to increase
the effect of the distilled frequency when the words
yield an ignorable frequency in the original estimation from _F_ 1. The calculated frequency _F_ ( _x_ ) is
then used to choose the highest frequency instead
of the original estimated frequency as in Equation
2 and Equation 3.


**3.4** **Curriculum Textual Frequency Training**


Motivated by the fact that low-frequency expressions can be more diverse (Lu and Lam, 2023),
which should be trained first (Jiang et al., 2014), we
propose **C** urriculum **T** extual **F** requency **T** raining
(CTFT), a method that further uses the frequency
information beyond paraphrase selection during
prompting. For a training set _T_ that is composed
of N instances, we propose to arrange the data in
the following training order for each epoch:


sort _xn∈T_ ( _F_ ( _xn_ )) _,_ (6)


where sort is a sorting function that arranges the order from lower frequency sentence-level to higher
sentence-level frequency for each training instance
_xn_ in _T_ with a total number of N instances. Note
that the training instances are usual machine learning datasets here and do not have to be paraphrases
of each other. We experiment with CTFT on the
fine-tuning scenarios on LLMs. CTFT extends TFL
and TFD to a better fine-tuning scenario.


**3.5** **Textual Frequency Paired Dataset**


There is almost no such dataset for our the goal.
Therefore, we collect our own dataset, **T** extual



**Tasks** **MR** **MT** **CR** **TC**

_high-frequency_

#. Sentences 738 526 575 114
Avg Length 25.86 21.70 23.66 41.96

Max Length 71 60 64 73

Min Length 11 7 9 22

_low-frequency_

#. Sentences 738 526 575 114
Avg Length 25.28 24.78 22.43 47.82

Max Length 59 62 57 86

Min Length 10 9 8 25


Table 1: Statistics of **T** extual **F** requency **P** aired **D** ataset
(TFPD). We denote Math Reasoning as **MR**, Machine
Translation as **MT**, Commonsense Reasoning as **CR**,
and Tool Calling as **TC** . We denote the total instances
in the dataset as #. Sentences, and we report the length
in English words. The ground-truth answer from the
original datasets is directly adopted without modification. Each sentence in the high-frequency partition is
paired with one sentence in the low-frequency partition.


**F** requency **P** aired **D** ataset (TFPD), for this paper.
Based on the original datasets GSM8K (Cobbe
et al., 2021), FLORES-200 (NLLB-Team, 2022),
and CommonsenseQA (Talmor et al., 2019), we
use GPT-4o-mini to rephrase the English sentences
in GSM8K and FLORES-200. The rephrased sentences are sent to three human annotators. For human annotation, we hired three experienced annotators who have degrees relevant to English Linguistics to conduct a human validation on the generated
sentences. We discard the instances if the three
sentences do not have the same meaning by any human annotator. We use the following instructions
to rephrase the datasets automatically:




The above instructions on GPT-4o-mini then generate 20 paraphrases. We select the two sentences
with the lowest and highest frequency, respectively,
as in Equation 1. Those two sentences are sent
along with the original input sentence for succeeding human annotation to check whether all three
sentences have the same meaning:


  - The same meaning: I believe these three sentences have the same meaning.


  - Maybe the same meaning: Maybe these three
sentences have the same meaning, but I might
be wrong because of some reasons, for example, some rephrased words might not be
appropriate for the context.


  - Not the same meaning: I am sure that these
three sentences do not have the same meaning.


We only preserve those samples that all our annotators believe are authentically the same meaning.
Finally, we obtain 738 pairs out of 1,319 original
GSM8K test instances, and we obtain 526 pairs out
of 1,012 original FLORES-200 dev-test instances.
Note that for the fine-tuning experiments, we use
the constructed TFPD dataset as the training data
to check the impact of textual frequency on finetuning, and we randomly select 500 samples from
the FLORES-200 dev set for evaluation.
Table 1 presents the length statistics of the samples. For space reasons, we present frequency
statistics in Appendix in Table 17.


**4** **Experimental Setup**


**4.1** **Evaluation Metrics**


For the task of math reasoning, accuracy is adopted
as the evaluation metric (Cobbe et al., 2021). For
the task of machine translation, we report the
chrF (Popovi´c, 2015) and the BLEU (Papineni
et al., 2002) evaluations provided by the sacreBLEU repository. [2] We also adopt neural-based
evaluation using COMET scores versioned wmt22comet-da [3] (Rei et al., 2020). Note that there are
37 supported languages by COMET, out of 100
languages in this study. We release the full list
as in Appendix. We use chrF signature of the parameters with nworde=6, ncorder=6, beta=2. We
use BLEU signature of ngram=4, weights=(0.25,
0.25, 0.25, 0.25), smoothing=method1, smoothingfunction=SmoothingFunction().method1, tokenizer=nltkwordtokenize.


2https://github.com/mjpost/sacrebleu
[3https://github.com/Unbabel/COMET](https://github.com/Unbabel/COMET)



**4.2** **Baselines**


We conduct experiments on both closed-source
and open-source LLMs for better reproducibility
on GPT-4o-mini and DeepSeek-V3 (DeepSeek-AI
et al., 2024). DeepSeek-V3 is an MoE model with
671B model parameters. Both of them are widely
used LLMs with robust multilingual translation
capabilities. We also use doubao-1.5-pro-32k and
qwen2.5-7b-instruct as baselines for our translation
experiments. For the fine-tuning experiments validating the effectiveness of high-frequency data and
the usefulness of CTFT, all experiments are conducted on qwen2.5-7b-instruct, which is an opensource LLM. We use Llama-3.3-70B-Instruct in
our MR experiments (Grattafiori et al., 2024). We
use LoRA fine-tuning (Hu et al., 2022) throughout
the paper. The hyperparameters for fine-tuning are
presented in Appendix for better reproducibility.
We also compare our method for the reverse
setting (fine-tuning from high-frequenty to lowfrequency) as well as traditional curriculum learning (from easy-to-hard, (Lu and Lam, 2023)). For
the easy-to-hard baseline, we use Max Dependency
Tree Depth as the difficulty function. [4]


**4.3** **Off-the-shelf Frequency Estimation**


For off-the-shelf frequency estimation, we adopt
off-the-shelf resources for estimation [5] using Zipf
frequency (Speer, 2022). Since this project is further built on many resources such as ParaCrawl
(Bañón et al., 2020), we refer the readers to their
projects for more references.


**4.4** **Language Selection**


We randomly select 100 languages from the
FLORES-200 datasets for our prompting experiments, and we release their language class according to Joshi et al. (2020) in Table 20 in Appendix. More than half of the languages are relatively low-resource according to the class definition (class 0 or class 1). For the experiments on
CTFT, we use Kabuverdianu (kea_Latn), Kikuyu
(kik_Latn), Pangasinan (pag_Latn), and Standard
Latvian (lvs_Latn).


**4.5** **Translation Prompt**


We release our 1-shot prompt for translation for
better reproducibility:


4We use nlp = spacy.load("en_core_web_sm") to calculate
it.
5https://github.com/rspeer/wordfreq


|95<br>low-frequency<br>high-frequency<br>90 88.75<br>high-frequency low-frequency<br>85<br>80.49 80.49 (%)<br>80<br>rate<br>75 solve<br>71.54<br>GSM8K<br>70 68.70<br>65 63.55 63.55<br>60.70 60.70<br>60<br>55<br>DeepSeek-V3 GPT-4o-mini LLaMA3.3-70B-Instruct<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>∩low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|Col2|Col3|Col4|Col5|Col6|Col7|Col8|Col9|Col10|Col11|Col12|
|---|---|---|---|---|---|---|---|---|---|---|---|
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}||||
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|||||
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|||||||||||
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|||||||||||
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}||||||||||||
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}||||||||||||
|DeepSeek-V3<br>GPT-4o-mini<br>LLaMA3.3-70B-Instruct<br>55<br>60<br>65<br>70<br>75<br>80<br>85<br>90<br>95<br>GSM8K solve rate (%)<br>63.55<br>60.70<br>80.49<br>71.54<br>68.70<br>88.75<br>63.55<br>60.70<br>80.49<br>low-frequency<br>high-frequency<br>high-frequency low-frequency<br>Figure 2: The overall accuracy of TFPD on math re<br>soning for our proposed framework. It is obvious th<br>the high-frequency partition in TFPD has a higher acc<br>racy than the low-frequency partition. High-frequen<br>_∩_low-frequency denotes a model that is correct in bo<br>low-frequency and high-frequency partitions.<br>Translate the following sentence from En-<br>glish to {lang}.<br>For example:<br>sentence: Television reports show white<br>smoke coming from the plant.<br>translation: {trans}|Dee<br> Th<br> r ou<br> frequ<br> the<br>que<br>uenc<br>slat<br> to {<br> xam<br>nce<br>ke c<br>latio|pSeek<br>e ov<br> r pr<br> enc<br>  low<br>ncy<br>y an<br>e the<br> lan<br> ple<br>: T<br> omi<br>n: {|-V3<br> erall<br>  opose<br> y part<br>  -frequ<br> denot<br> d hig<br> foll<br> g}.<br> :<br>elevi<br> ng fr<br>tran|GP<br> accur<br>  d fra<br> ition<br>  ency<br> es a<br> h-fre<br> owin<br>sion <br> om t<br>s}|T-4o-m<br> acy<br>  mew<br>  in T<br>  par<br>  mode<br> quen<br> g s<br> rep<br>  he p|ini<br>  of T<br>  ork<br>  FPD<br>  titio<br>  l tha<br> cy p<br>  ente<br>orts<br>  lant.|LL<br>  F<br>  . <br> <br>  n.<br>  t<br>  a<br>  n<br> <br>|aMA3.<br>  PD<br>It is<br>   has a<br> Hig<br>   is co<br>  rtitio<br>  ce f<br>sho|3-70B<br>   on m<br> obvi<br>    hig<br>h-fr<br>   rrec<br>  ns.<br>  rom<br>w w|-Instru<br>   ath<br> ous<br>    her a<br>eque<br>   t in<br>   En-<br>hite|ct<br>    re<br>  th<br>    cc<br>n<br>    bo<br>|


Now, please translate the following sentence to {lang}.
sentence: {question}
Your output format must be like this:
The translation result is:


**5** **Results**


**5.1** **Prompting on Math Reasoning**


Figure 2 presents the overall accuracy of TFPD on
the task of math reasoning with prompting experiments. Our proposed framework is effective on all
models that we experimented on. On DeepSeekV3, the accuracy goes from 63.55% to 71.54%. On
GPT-4o-mini, the accuracy goes from 60.70% to
68.70%. On LlaMA3.3-70B-Instruct, it goes from
80.49% to 88.75%. We also conduct deeper analyses. Specifically, we calculate the intersection of
low-frequency and high-frequency partitions. We
found that when a sample pair has a correct model
generation on its low-frequency partition, its highfrequency version is still correct. In other words,
using our proposed framework only improved those
samples which were originally answered incorrectly by the models on the low-frequency partition.



For those ones which were originally answered correctly by the models on the low frequency partition,
their performance is maintained with the high frequency partition.


For space reasons, Table 18 in the Appendix
represents that our method is consistently useful
and high-frequency data brings improvements on
different sizes of qwen-2.5 models across 0.5b to
72b on the task of MR.


Table 21 indicates that the chain-of-thought process is improved, which can be the reason why the
math reasoning capabilities are improved.


**5.2** **Prompting on Neural Machine**
**Translation**


Figure 3 demonstrates the results on Neural Machine Translation (NMT) on our TFPD dataset.
The orange line indicates the model using the highfrequency partition in our TFPD dataset on ChatGPT or DeepSeek models. The results follow our
proposed TFL, which suggests that high-frequency
rephrases should be preferred as inputs into LLMs.
Specifically, for all six results on all metrics we report and all baselines we conduct, high-frequency
partition gives the best results in overall. We also
found that ChatGPT and DeepSeek models are
close in their translation results on the language
pairs we conducted experiments on, as their Figure
seems to be relatively similar to each other. This is
reasonable, as both of them are strong LLMs. We
also report results on 37 languages supported by
the COMET model in use. The results also suggest
the effectiveness of our proposed law.


Table 3 summarises the improvements on NMT.
We can see that when compared to our best baseline
using the low-frequency partition, translation on
most of the language pairs is improved. For example, 99 out of 100 language pairs are improved for
BLEU on DeepSeek-V3. 63 of them are improved
by more than 1 point. 31 of them are improved by
more than 3 points, and 12 of them are improved
by more than 5 points. The observations are consistent across all metrics, namely, BLEU, chrF, and
COMET scores we use, across both DeepSeek-V3
and GPT-4o-mini, which suggests the effectiveness
of our proposed law. When there is any performance degradation, they are all less than 1 point
across the metrics and the models, which enhances
our claim and the usefulness of our law.


CHATGPT-CHRF



qwen
doubao
low frequency
synonym replacement
high frequency

CHATGPT-COMET



DEEPSEEK-COMET



min


min



kat


kat



CHATGPT-BLEU

|h sa w rn i m uh w kn ks a ab a y r rb a lit ars kac cqn|24 s s lhb aek lop rr mf syt o an<br>21 asagm kb dut<br>18 15 szhnm<br>12<br>9<br>6<br>3|
|---|---|
|l<br>a<br>lk<br>ukr<br>mlt<br>tgk<br>ckb<br>scn<br>mal<br>als<br>acm<br>lug<br>us<br>mr<br>a<br><br>|~~0~~<br><br><br><br>s<br>da<br>ma<br>sun<br>nno<br>nob<br>ayr<br>kas<br>ewe<br>luo<br>ssw<br>dzo<br>hr<br>c<br>s<br>|



DEEPSEEK-BLEU



est


est



lus


lus




|y d s a it sa n ma s w ln a i ug lao kab swh bultc|70 f m nhel osi tn ml<br>60 50 mkouigbelguc jys maf gib<br>40<br>30<br>20<br>10|
|---|---|
|b<br>ob<br>ukr<br>aeb<br>tgk<br>scn<br>srd<br>spa<br>arz<br>grn<br>eus<br>rp<br>at<br><br><br>|~~0~~<br><br><br>s<br>c<br>sn<br>luo<br>ayr<br>mai<br>kor<br>zho<br>nno<br>hrv<br>bjn<br>dz<br>m<br>k<br><br>|





dzo


dzo



DEEPSEEK-CHRF



kas


kas


|h sa w rn i m uh w kn ks a ab a y r rb a lit ars kac cqn|24 s s lhb aek lop rr mf syt o an<br>21 asagm kb dut<br>18 15 szhnm<br>12<br>9<br>6<br>3|
|---|---|
|l<br>a<br>lk<br>ukr<br>mlt<br>tgk<br>ckb<br>scn<br>mal<br>als<br>acm<br>lug<br>us<br>mr<br>a<br><br>|~~0~~<br><br><br><br>s<br>da<br>ma<br>sun<br>nno<br>nob<br>ayr<br>kas<br>ewe<br>luo<br>ssw<br>dzo<br>hr<br>c<br>s<br>|


|y d s a it sa n ma s w ln a i ug lao kab swh bultc|70 f m nhel osi tn ml<br>60 50 mkouigbelguc jys maf gib<br>40<br>30<br>20<br>10|
|---|---|
|b<br>ob<br>ukr<br>aeb<br>tgk<br>scn<br>srd<br>spa<br>arz<br>grn<br>eus<br>rp<br>at<br><br><br>|~~0~~<br><br><br>s<br>c<br>sn<br>luo<br>ayr<br>mai<br>kor<br>zho<br>nno<br>hrv<br>bjn<br>dz<br>m<br>k<br><br>|



Figure 3: The figure demonstrating the performance of our proposed framework in using high-frequency partition
for translation. Results are reports on translating from English into other languages. Detailed numbers are reported
in Appendix in Table 8, 9, 10, 11, 12, and 13. Synonym is a baseline that replaces words randomly with their
[higher-frequency rephrases using NLTK: https://www.nltk.org/.](https://www.nltk.org/)

|Models|GPT-4o-mini DeepSeek-V3 Llama-3.3-70B-Instruct|
|---|---|
|Low-frequency partition<br>High-frequency partition|0.6747<br>0.7043<br>0.7530<br>**0.6974**<br>**0.7235**<br>**0.7704**|



Table 2: Results reported in accuracy on the partition of CR. We see that the high-frequency partition gives better
results on all baseline models.


**Models** **# improved** **> 1 pt** **> 3 pts** **> 5 pts** **# degraded** **> 1 pt** **> 3 pts** **> 5 pts**

_BLEU_
DeepSeek-V3 99/100 63/99 31/99 12/99 1/100 0/1 0/1 0/1
GPT-4o-mini 95/100 49/95 27/95 5/95 5/100 0/5 0/5 0/5
_chrF_
DeepSeek-V3 100/100 86/100 40/100 7/100 0/100 0/0 0/0 0/0
GPT-4o-mini 91/100 75/91 34/91 2/91 9/100 0/9 0/9 0/9
_COMET_
DeepSeek-V3 37/37 33/37 4/37 0/37 0/37 0/0 0/0 0/0
GPT-4o-mini 36/37 35/36 11/36 0/36 1/37 0/1 0/1 0/1


Table 3: Statistics of the changes on prompting experiments in BLEU, chrF, and COMET scores with the
high-frequency partition compared to the low-frequency partition on our established TFDP dataset. We evaluate
translation from English into other languages. Most translations have been clearly improved. When there is any
degradation, the degradation is less than 1 point. We denote ‘point’ as ‘pt’ and ‘points’ as ‘pts’.


**Models** **kea_Latn** **kik_Latn** **pag_Latn** **lvs_Latn**
_BLEU_
Original Model 0.9346 1.0342 1.2296 2.2646
Fine-tuned Model 4.6772 1.2811 4.5129 4.1954
Easy-to-hard Baseline 5.1674 1.3185 4.4955 3.5366
High-to-low Baseline 5.1179 1.5298 4.5365 3.7840
FT on LF w/o CTFT 4.3899 1.4223 3.9073 3.2221
FT on 1/2 LF 1/2 HF w/o CTFT 4.7928 1.4783 4.4291 3.4787
FT on HF w/o CTFT 5.2466 1.2432 3.7781 3.9156
FT on HF w/ CTFT **5.3992** **1.6570** **4.9102** **4.6027**
_chrF_
Original Model 26.9844 20.6636 29.4351 33.2322
Fine-tuned Model 39.3714 25.6175 34.4672 34.0584
FT on LF w/o CTFT 39.4022 26.2465 33.9848 33.5538
Easy-to-hard Baseline 40.6414 26.4981 35.5396 35.3337
High-to-low Baseline 41.0234 26.5316 35.8125 36.1577
FT on 1/2 LF 1/2 HF w/o CTFT 40.7831 26.8192 35.3375 34.2120
FT on HF w/o CTFT 40.6515 26.4975 33.4990 35.0732
FT on HF w/ CTFT **41.6206** **27.7719** **36.5285** **37.0171**


Table 4: Results of fine-tuning experiments on translation from English into other languages, tested on the original
FLORES-200 benchmark. Fine-tuned Model is tuned on the original FLORES-200 dataset. FT denotes fine-tuning,
LF denotes low-frequency, HF denotes high-frequency, and CTFT denotes Curriculum Textual Frequency Training.
1/2 LF 1/2 HF denotes a training set with half samples sampled from the low-frequency partition and half samples
sampled from the high-frequency partition. COMET is not reported due to unsupported languages.



**5.3** **Prompting on Commonsense Reasoning**


Table 2 reports addtional results on the commonse
reasoning partition CR. It clearly shows that the
high-frequency part surpasses the low-frequency
part. This experimentally validates the effectiveness of our proposed frequency law.


**5.4** **Fine-tuning on Neural Machine**
**Translation**


Table 4 presents our results for fine-tuning on NMT.
There are three takeaways from this Table.


**High-frequency** **partition** **is** **even** **better** **than**
**the ground-truth data** For the baseline of _Fine-_
_tuned Model_, _FT on HF w/o TFD w/o CTFT_ is even
better across the languages and the metrics. The
former one uses the original FLORES-200 dataset
for fine-tuning, and the latter uses our TFPD dataset
for fine-tuning without any TFD or CTFT. The improvements are obvious, for example, it improves
from 4.6772 (+0%) in BLEU to 5.2466 (+12.17%)
in BLEU on kea_Latn.


**High-frequency partition is better than the low-**
**frequency partition** By looking at the baselines
_FT_ _on_ _LF_ _w/o_ _CTFT_ and _FT_ _on_ _HF_ _w/o_ _CTFT_ .



It is first clear that the latter one, using the highfrequency partition, is better than the former one,
using a low-frequency partition. Interestingly, replacing half of the low-frequency partition randomly using the high-frequency partition can still
obviously improve the results. Specifically, the improvement can be from 3.9073 (+0%) to 4.4291
(+13.35%) in BLEU on pag_Latn.


**CTFT** **is** **useful** **for** **fine-tuning** **on** **translation**
By looking at the baseline _FT_ _on_ _HF_ _w/o_ _CTFT_
and _FT on HF w/ CTFT_, the latter one trains the
model using CTFT, from the order of low-to-high
in terms of the textual frequency. This yields 8/8
of the best metrics we got in all the experiments.
Specifically, the improvement can be from 3.7781
(+0%) to 4.9102 (+29.96%) in BLEU on pag_Latn.


**5.5** **Analysis on TFD**


Figure 4 presents the ablation study on TFD. It
is obvious that removing TFD causes a drop in
performance. For example, 100% of the language
pairs are better with TFD on COMET scores with
DeepSeek-V3. This validates the usefulness of
TFD. Figure 5 also demonstrates the relationship


**Metric** **High-Frequency** **Low-Frequency** ∆ **(HF-LF)** **Pearson Corr.** **Spearman Corr.**
_Math Reasoning_
Max Dependency Tree Depth 5.02 5.72 -0.70 -0.0447 -0.0285
Mean Dependency Distance 2.12 2.22 -0.10 -0.0086 0.0094
Flesch-Kincaid Grade Level 4.36 6.35 -1.99 -0.0799 -0.0545
_Machine Translation_
Max Dependency Tree Depth 5.52 7.51 -1.99 -0.2713 -0.2822
Mean Dependency Distance 2.31 2.47 -0.16 -0.1137 -0.1257
Flesch-Kincaid Grade Level 8.97 9.08 -0.11 -0.1673 -0.1528


Table 5: Textual complexity metrics and their correlation with frequency. Corr. denotes correlation. We use nlp =
spacy.load("en_core_web_sm") for calculation.

|Bin Range|N BLEU(HF) BLEU(LF) ∆BLEU(HF-LF) chrF(HF) chrF(LF) ∆chrF(HF-LF)|
|---|---|
|Strict Depth Match<br>[0%_,_ 5%)<br>[5%_,_ 10%)<br>[10%_,_ 15%)<br>[15%_,_ 20%)<br>[20%_,_ 25%)<br>[25%_,_ 30%)<br>[30%_,_ 35%)<br>[35%_,_ 40%)<br>[40%_,_ 45%)<br>[50%_,_ 55%)<br>[55%_,_ 60%)<br>[60%_,_ 65%)<br>[65%_,_ 70%)|144<br>20.82<br>16.04<br>+4.78<br>48.73<br>43.86<br>+4.87<br>144<br>20.82<br>16.04<br>+4.78<br>48.73<br>43.86<br>+4.87<br>6<br>22.45<br>14.79<br>+7.65<br>49.76<br>49.19<br>+0.57<br>71<br>19.12<br>15.38<br>+3.74<br>46.19<br>44.71<br>+1.47<br>65<br>20.93<br>14.77<br>+6.16<br>48.91<br>43.46<br>+5.45<br>53<br>24.08<br>18.52<br>+5.56<br>50.87<br>44.27<br>+6.60<br>65<br>19.75<br>12.54<br>+7.21<br>47.53<br>42.51<br>+5.01<br>41<br>19.90<br>12.61<br>+7.29<br>47.78<br>43.72<br>+4.05<br>17<br>19.03<br>14.13<br>+4.90<br>44.22<br>42.62<br>+1.60<br>28<br>16.53<br>9.76<br>+6.77<br>46.47<br>40.92<br>+5.55<br>21<br>13.89<br>16.20<br>-2.31<br>41.65<br>46.86<br>-5.21<br>9<br>10.93<br>3.33<br>+7.60<br>45.62<br>38.92<br>+6.70<br>4<br>17.13<br>12.18<br>+4.95<br>43.30<br>44.46<br>-1.16<br>2<br>15.54<br>4.36<br>+11.17<br>37.17<br>39.72<br>-2.56|



Table 6: Separated bins with those high-frequency and low-frequency samples with restricted tree depth difference.













100


80


60


40


20














|Col1|Col2|Col3|
|---|---|---|
||||
||||


|Col1|Col2|Col3|
|---|---|---|
||||
||||



Figure 4: The ablation study results of TFD on TFPD.
The results are compared on BLEU, chrf and COMET.
The bars are plotted in terms of the winning percentages.


between the amount of data used for frequency distillation and the performance improvement. Overall, with more data used for TFD, there is a greater
performance gain. This further validates the usefulness of TFD. Finally, combining prompting
with higher-frequency paraphrases on models with
CTFT as a whole framework is useful, as presented
in the Appendix in Table 15.


**5.6** **Correlation on Frequency**


For space reasons, we present a correlation analysis between textual frequency and final translation performance, even when the instances are not
paraphrases to each other using the full translation
dataset in TFPD. We present the final results in Appendix in Table 16. There is are strong correlation
(1.0) on multiple languages when translating from
English. This strengths our claim.



Table 5 represents the relationship between textual complexity and frequency, and we see that they
have very weak correlation. This enhances the usefulness of our method by distingushing TFL from
the traditional curriculum learning. Table 6 shows
that in most bins, high-frequency prompts are better. Only in 1 bin [50%-55%], the low-frequency
prompts are better on BLEU and chrF, but there
are only 21 samples in this bin. This means that
high-frequency prompts are consistently better.

Finally, we present a theoretical proof in Appendix to strength our claim.


**6** **Conclusions**


This paper proposed a framework for textual frequency on LLMs, which is composed of three units,
namely TFL, TFD, and CTFT. High-frequency
inputs are suggested by our framework, in both
tuning and training on LLMs, which can be combined with curriculum learning to improve final
performance. We conduct experiments on tasks of
Math Reasoning, Machine Translation on hundreds
of language pairs, Commonsense Reasoning, and
Agentic Tool Calling. Experimental results and
extensive analysis suggest the effectiveness of our
textual frequency framework. Extensive analysis
indicates that when inputs are even different, the final outputs of LLMs are positively related to textual
frequency, which further suggests the soundness of
our proposed framework.


**Limitations**


Using story completion to obtain frequency estimation can bring certain computational costs, yet
this workaround the necessity of obtaining closedresourced training corpora of LLMs, which is often
unrealistic.


**Ethical Statement**


We honour and support the ACL ARR Code of
Ethics. The datasets used in this work are wellknown and widely used, and the dataset preprocessing does not make use of any external textual resource. In our view, there is no known ethical
issue. End-to-end pre-trained LLMs are also used,
which are subjected to generating offensive context.
But the above-mentioned issues are widely known
to commonly exist for these models. Any content
generated do not reflect the view of the authors.


**References**


Amirhossein Abaskohi, Sascha Rothe, and Yadollah
Yaghoobzadeh. 2023. LM-CPPF: [Paraphrasing-](https://doi.org/10.18653/v1/2023.acl-short.59)
guided data [augmentation](https://doi.org/10.18653/v1/2023.acl-short.59) for contrastive promptbased [few-shot](https://doi.org/10.18653/v1/2023.acl-short.59) fine-tuning. In _Proceedings_ _of_ _the_
_61st Annual Meeting of the Association for Compu-_
_tational Linguistics (Volume 2:_ _Short Papers)_, pages
670–681, Toronto, Canada. Association for Computational Linguistics.


A. Alexandrov, D. Boricheva, F. Pulvermüller, and
Y Shtyrov. 2011. Strength of word-specific neural memory traces assessed electrophysiologically.
_PLoS ONE_, 6(8):e22999.


Marta Bañón, Pinzhen Chen, Barry Haddow, Kenneth
Heafield, Hieu Hoang, Miquel Esplà-Gomis, Mikel L.
Forcada, Amir Kamran, Faheem Kirefu, Philipp
Koehn, Sergio Ortiz Rojas, Leopoldo Pla Sempere,
Gema Ramírez-Sánchez, Elsa Sarrías, Marek Strelec,
Brian Thompson, William Waites, Dion Wiggins, and
Jaume Zaragoza. 2020. ParaCrawl: [Web-scale acqui-](https://doi.org/10.18653/v1/2020.acl-main.417)
[sition of parallel corpora.](https://doi.org/10.18653/v1/2020.acl-main.417) In _Proceedings of the 58th_
_Annual Meeting of the Association for Computational_
_Linguistics_, pages 4555–4567, Online. Association
for Computational Linguistics.


Bowen Cao, Deng Cai, Zhisong Zhang, Yuexian Zou,
and Wai Lam. 2024. On the worst [prompt](https://openreview.net/forum?id=Mi853QaJx6) performance of large [language](https://openreview.net/forum?id=Mi853QaJx6) models. In _The_ _Thirty-_
_eighth_ _Annual_ _Conference_ _on_ _Neural_ _Information_
_Processing Systems_ .


Karl Cobbe, Vineet Kosaraju, Mohammad Bavarian,
Mark Chen, Heewoo Jun, Lukasz Kaiser, Matthias
Plappert, Jerry Tworek, Jacob Hilton, Reiichiro
Nakano, Christopher Hesse, and John Schulman.
2021. [Training Verifiers to Solve Math Word Prob-](https://doi.org/10.48550/arXiv.2110.14168)
[lems.](https://doi.org/10.48550/arXiv.2110.14168) _arXiv e-prints_, arXiv:2110.14168.



DeepSeek-AI, Daya Guo, Dejian Yang, Haowei Zhang,
Junxiao Song, Ruoyu Zhang, Runxin Xu, Qihao Zhu,
Shirong Ma, Peiyi Wang, Xiao Bi, Xiaokang Zhang,
Xingkai Yu, Yu Wu, Z. F. Wu, Zhibin Gou, Zhihong
Shao, Zhuoshu Li, Ziyi Gao, Aixin Liu, Bing Xue,
Bingxuan Wang, Bochao Wu, Bei Feng, Chengda Lu,
Chenggang Zhao, Chengqi Deng, Chenyu Zhang,
Chong Ruan, Damai Dai, Deli Chen, Dongjie Ji,
Erhang Li, Fangyun Lin, Fucong Dai, Fuli Luo,
Guangbo Hao, Guanting Chen, Guowei Li, H. Zhang,
Han Bao, Hanwei Xu, Haocheng Wang, Honghui
Ding, Huajian Xin, Huazuo Gao, Hui Qu, Hui Li,
Jianzhong Guo, Jiashi Li, Jiawei Wang, Jingchang
Chen, Jingyang Yuan, Junjie Qiu, Junlong Li, J. L.
Cai, Jiaqi Ni, Jian Liang, Jin Chen, Kai Dong, Kai
Hu, Kaige Gao, Kang Guan, Kexin Huang, Kuai
Yu, Lean Wang, Lecong Zhang, Liang Zhao, Litong
Wang, Liyue Zhang, Lei Xu, Leyi Xia, Mingchuan
Zhang, Minghua Zhang, Minghui Tang, Meng Li,
Miaojun Wang, Mingming Li, Ning Tian, Panpan
Huang, Peng Zhang, Qiancheng Wang, Qinyu Chen,
Qiushi Du, Ruiqi Ge, Ruisong Zhang, Ruizhe Pan,
Runji Wang, R. J. Chen, R. L. Jin, Ruyi Chen,
Shanghao Lu, Shangyan Zhou, Shanhuang Chen,
Shengfeng Ye, Shiyu Wang, Shuiping Yu, Shunfeng
Zhou, Shuting Pan, S. S. Li, Shuang Zhou, Shaoqing
Wu, Shengfeng Ye, Tao Yun, Tian Pei, Tianyu Sun,
T. Wang, Wangding Zeng, Wanjia Zhao, Wen Liu,
Wenfeng Liang, Wenjun Gao, Wenqin Yu, Wentao
Zhang, W. L. Xiao, Wei An, Xiaodong Liu, Xiaohan
Wang, Xiaokang Chen, Xiaotao Nie, Xin Cheng, Xin
Liu, Xin Xie, Xingchao Liu, Xinyu Yang, Xinyuan Li,
Xuecheng Su, Xuheng Lin, X. Q. Li, Xiangyue Jin,
Xiaojin Shen, Xiaosha Chen, Xiaowen Sun, Xiaoxiang Wang, Xinnan Song, Xinyi Zhou, Xianzu Wang,
Xinxia Shan, Y. K. Li, Y. Q. Wang, Y. X. Wei, Yang
Zhang, Yanhong Xu, Yao Li, Yao Zhao, Yaofeng
Sun, Yaohui Wang, Yi Yu, Yichao Zhang, Yifan Shi,
Yiliang Xiong, Ying He, Yishi Piao, Yisong Wang,
Yixuan Tan, Yiyang Ma, Yiyuan Liu, Yongqiang Guo,
Yuan Ou, Yuduan Wang, Yue Gong, Yuheng Zou, Yujia He, Yunfan Xiong, Yuxiang Luo, Yuxiang You,
Yuxuan Liu, Yuyang Zhou, Y. X. Zhu, Yanhong Xu,
Yanping Huang, Yaohui Li, Yi Zheng, Yuchen Zhu,
Yunxian Ma, Ying Tang, Yukun Zha, Yuting Yan,
Z. Z. Ren, Zehui Ren, Zhangli Sha, Zhe Fu, Zhean
Xu, Zhenda Xie, Zhengyan Zhang, Zhewen Hao,
Zhicheng Ma, Zhigang Yan, Zhiyu Wu, Zihui Gu, Zijia Zhu, Zijun Liu, Zilin Li, Ziwei Xie, Ziyang Song,
Zizheng Pan, Zhen Huang, Zhipeng Xu, Zhongyu
Zhang, and Zhen Zhang. 2025. [DeepSeek-R1:](https://doi.org/10.48550/arXiv.2501.12948) Incen[tivizing Reasoning Capability in LLMs via Reinforce-](https://doi.org/10.48550/arXiv.2501.12948)
[ment Learning.](https://doi.org/10.48550/arXiv.2501.12948) _arXiv e-prints_, arXiv:2501.12948.


DeepSeek-AI, Aixin Liu, Bei Feng, Bing Xue, Bingxuan Wang, Bochao Wu, Chengda Lu, Chenggang
Zhao, Chengqi Deng, Chenyu Zhang, Chong Ruan,
Damai Dai, Daya Guo, Dejian Yang, Deli Chen,
Dongjie Ji, Erhang Li, Fangyun Lin, Fucong Dai,
Fuli Luo, Guangbo Hao, Guanting Chen, Guowei
Li, H. Zhang, Han Bao, Hanwei Xu, Haocheng
Wang, Haowei Zhang, Honghui Ding, Huajian Xin,
Huazuo Gao, Hui Li, Hui Qu, J. L. Cai, Jian Liang,
Jianzhong Guo, Jiaqi Ni, Jiashi Li, Jiawei Wang,


Jin Chen, Jingchang Chen, Jingyang Yuan, Junjie
Qiu, Junlong Li, Junxiao Song, Kai Dong, Kai Hu,
Kaige Gao, Kang Guan, Kexin Huang, Kuai Yu, Lean
Wang, Lecong Zhang, Lei Xu, Leyi Xia, Liang Zhao,
Litong Wang, Liyue Zhang, Meng Li, Miaojun Wang,
Mingchuan Zhang, Minghua Zhang, Minghui Tang,
Mingming Li, Ning Tian, Panpan Huang, Peiyi Wang,
Peng Zhang, Qiancheng Wang, Qihao Zhu, Qinyu
Chen, Qiushi Du, R. J. Chen, R. L. Jin, Ruiqi Ge,
Ruisong Zhang, Ruizhe Pan, Runji Wang, Runxin
Xu, Ruoyu Zhang, Ruyi Chen, S. S. Li, Shanghao
Lu, Shangyan Zhou, Shanhuang Chen, Shaoqing Wu,
Shengfeng Ye, Shengfeng Ye, Shirong Ma, Shiyu
Wang, Shuang Zhou, Shuiping Yu, Shunfeng Zhou,
Shuting Pan, T. Wang, Tao Yun, Tian Pei, Tianyu Sun,
W. L. Xiao, Wangding Zeng, Wanjia Zhao, Wei An,
Wen Liu, Wenfeng Liang, Wenjun Gao, Wenqin Yu,
Wentao Zhang, X. Q. Li, Xiangyue Jin, Xianzu Wang,
Xiao Bi, Xiaodong Liu, Xiaohan Wang, Xiaojin Shen,
Xiaokang Chen, Xiaokang Zhang, Xiaosha Chen,
Xiaotao Nie, Xiaowen Sun, Xiaoxiang Wang, Xin
Cheng, Xin Liu, Xin Xie, Xingchao Liu, Xingkai Yu,
Xinnan Song, Xinxia Shan, Xinyi Zhou, Xinyu Yang,
Xinyuan Li, Xuecheng Su, Xuheng Lin, Y. K. Li,
Y. Q. Wang, Y. X. Wei, Y. X. Zhu, Yang Zhang, Yanhong Xu, Yanhong Xu, Yanping Huang, Yao Li, Yao
Zhao, Yaofeng Sun, Yaohui Li, Yaohui Wang, Yi Yu,
Yi Zheng, Yichao Zhang, Yifan Shi, Yiliang Xiong,
Ying He, Ying Tang, Yishi Piao, Yisong Wang, Yixuan Tan, Yiyang Ma, Yiyuan Liu, Yongqiang Guo,
Yu Wu, Yuan Ou, Yuchen Zhu, Yuduan Wang, Yue
Gong, Yuheng Zou, Yujia He, Yukun Zha, Yunfan
Xiong, Yunxian Ma, Yuting Yan, Yuxiang Luo, Yuxiang You, Yuxuan Liu, Yuyang Zhou, Z. F. Wu, Z. Z.
Ren, Zehui Ren, Zhangli Sha, Zhe Fu, Zhean Xu,
Zhen Huang, Zhen Zhang, Zhenda Xie, Zhengyan
Zhang, Zhewen Hao, Zhibin Gou, Zhicheng Ma, Zhigang Yan, Zhihong Shao, Zhipeng Xu, Zhiyu Wu,
Zhongyu Zhang, Zhuoshu Li, Zihui Gu, Zijia Zhu,
Zijun Liu, Zilin Li, Ziwei Xie, Ziyang Song, Ziyi
Gao, and Zizheng Pan. 2024. [DeepSeek-V3 Techni-](https://doi.org/10.48550/arXiv.2412.19437)
[cal Report.](https://doi.org/10.48550/arXiv.2412.19437) _arXiv e-prints_, arXiv:2412.19437.


Rutvik H Desai, Wonil Choi, and John M Henderson. 2020. Word frequency [effects](https://doi.org/10.1080/23273798.2018.1527376) in naturalistic
[reading.](https://doi.org/10.1080/23273798.2018.1527376) _Language,_ _cognition_ _and_ _neuroscience_,
35(5):583—594.


David Freedman, Robert Pisani, and Roger Purves.
2007. Statistics (international student edition).
_Pisani, R. Purves, 4th edn. WW Norton & Company,_
_New York_ .


Silin Gao, Yichi Zhang, Zhijian Ou, and Zhou Yu. 2020.

[Paraphrase augmented task-oriented dialog genera-](https://doi.org/10.18653/v1/2020.acl-main.60)
[tion.](https://doi.org/10.18653/v1/2020.acl-main.60) In _Proceedings of the 58th Annual Meeting of_
_the Association for Computational Linguistics_, pages
639–649, Online. Association for Computational Linguistics.


Tanya Goyal and Greg Durrett. 2020. [Neural syntactic](https://doi.org/10.18653/v1/2020.acl-main.22)
[preordering for controlled paraphrase generation.](https://doi.org/10.18653/v1/2020.acl-main.22) In
_Proceedings of the 58th Annual Meeting of the Associ-_
_ation for Computational Linguistics_, pages 238–252,
Online. Association for Computational Linguistics.



Aaron Grattafiori, Abhimanyu Dubey, Abhinav Jauhri,
Abhinav Pandey, Abhishek Kadian, Ahmad AlDahle, Aiesha Letman, Akhil Mathur, Alan Schelten, Alex Vaughan, Amy Yang, Angela Fan, Anirudh
Goyal, Anthony Hartshorn, Aobo Yang, Archi Mitra, Archie Sravankumar, Artem Korenev, Arthur
Hinsvark, Arun Rao, Aston Zhang, Aurelien Rodriguez, Austen Gregerson, Ava Spataru, Baptiste
Roziere, Bethany Biron, Binh Tang, Bobbie Chern,
Charlotte Caucheteux, Chaya Nayak, Chloe Bi,
Chris Marra, Chris McConnell, Christian Keller,
Christophe Touret, Chunyang Wu, Corinne Wong,
Cristian Canton Ferrer, Cyrus Nikolaidis, Damien Allonsius, Daniel Song, Danielle Pintz, Danny Livshits,
Danny Wyatt, David Esiobu, Dhruv Choudhary,
Dhruv Mahajan, Diego Garcia-Olano, Diego Perino,
Dieuwke Hupkes, Egor Lakomkin, Ehab AlBadawy,
Elina Lobanova, Emily Dinan, Eric Michael Smith,
Filip Radenovic, Francisco Guzmán, Frank Zhang,
Gabriel Synnaeve, Gabrielle Lee, Georgia Lewis Anderson, Govind Thattai, Graeme Nail, Gregoire Mialon, Guan Pang, Guillem Cucurell, Hailey Nguyen,
Hannah Korevaar, Hu Xu, Hugo Touvron, Iliyan
Zarov, Imanol Arrieta Ibarra, Isabel Kloumann, Ishan Misra, Ivan Evtimov, Jack Zhang, Jade Copet,
Jaewon Lee, Jan Geffert, Jana Vranes, Jason Park,
Jay Mahadeokar, Jeet Shah, Jelmer van der Linde,
Jennifer Billock, Jenny Hong, Jenya Lee, Jeremy Fu,
Jianfeng Chi, Jianyu Huang, Jiawen Liu, Jie Wang,
Jiecao Yu, Joanna Bitton, Joe Spisak, Jongsoo Park,
Joseph Rocca, Joshua Johnstun, Joshua Saxe, Junteng Jia, Kalyan Vasuden Alwala, Karthik Prasad,
Kartikeya Upasani, Kate Plawiak, Ke Li, Kenneth
Heafield, Kevin Stone, Khalid El-Arini, Krithika Iyer,
Kshitiz Malik, Kuenley Chiu, Kunal Bhalla, Kushal
Lakhotia, Lauren Rantala-Yeary, Laurens van der
Maaten, Lawrence Chen, Liang Tan, Liz Jenkins,
Louis Martin, Lovish Madaan, Lubo Malo, Lukas
Blecher, Lukas Landzaat, Luke de Oliveira, Madeline
Muzzi, Mahesh Pasupuleti, Mannat Singh, Manohar
Paluri, Marcin Kardas, Maria Tsimpoukelli, Mathew
Oldham, Mathieu Rita, Maya Pavlova, Melanie Kambadur, Mike Lewis, Min Si, Mitesh Kumar Singh,
Mona Hassan, Naman Goyal, Narjes Torabi, Nikolay Bashlykov, Nikolay Bogoychev, Niladri Chatterji,
Ning Zhang, Olivier Duchenne, Onur Çelebi, Patrick
Alrassy, Pengchuan Zhang, Pengwei Li, Petar Vasic, Peter Weng, Prajjwal Bhargava, Pratik Dubal,
Praveen Krishnan, Punit Singh Koura, Puxin Xu,
Qing He, Qingxiao Dong, Ragavan Srinivasan, Raj
Ganapathy, Ramon Calderer, Ricardo Silveira Cabral,
Robert Stojnic, Roberta Raileanu, Rohan Maheswari,
Rohit Girdhar, Rohit Patel, Romain Sauvestre, Ronnie Polidoro, Roshan Sumbaly, Ross Taylor, Ruan
Silva, Rui Hou, Rui Wang, Saghar Hosseini, Sahana Chennabasappa, Sanjay Singh, Sean Bell, Seohyun Sonia Kim, Sergey Edunov, Shaoliang Nie, Sharan Narang, Sharath Raparthy, Sheng Shen, Shengye
Wan, Shruti Bhosale, Shun Zhang, Simon Vandenhende, Soumya Batra, Spencer Whitman, Sten
Sootla, Stephane Collot, Suchin Gururangan, Sydney Borodinsky, Tamar Herman, Tara Fowler, Tarek
Sheasha, Thomas Georgiou, Thomas Scialom, and
Tobias Speckbacher. 2024. The [Llama](https://doi.org/10.48550/arXiv.2407.21783) 3 Herd of


[Models.](https://doi.org/10.48550/arXiv.2407.21783) _arXiv e-prints_, arXiv:2407.21783.


Zhen Guo, Peiqi Wang, Yanwei Wang, and Shangdi Yu.
2023. Dr. llama: [Improving small language models](https://github.com/zguo0525/Dr.llama)
[in domain-specific qa via generative data augmenta-](https://github.com/zguo0525/Dr.llama)
[tion.](https://github.com/zguo0525/Dr.llama)


Yanjin He, Qingkai Zeng, and Meng Jiang. 2025. [Pre-](https://doi.org/10.18653/v1/2025.emnlp-main.1421)
trained models [perform the best](https://doi.org/10.18653/v1/2025.emnlp-main.1421) when token distributions [follow](https://doi.org/10.18653/v1/2025.emnlp-main.1421) Zipf’s law. In _Proceedings_ _of_ _the_
_2025 Conference on Empirical Methods in Natural_
_Language Processing_, pages 28009–28021, Suzhou,
China. Association for Computational Linguistics.


Kris Heylen, Yves Peirsman, Dirk Geeraerts, and Dirk
Speelman. 2008. [Modelling word similarity:](https://aclanthology.org/L08-1204/) an eval[uation of automatic synonymy extraction algorithms.](https://aclanthology.org/L08-1204/)
In _Proceedings of the Sixth International Conference_
_on Language Resources and Evaluation (LREC‘08)_,
Marrakech, Morocco. European Language Resources
Association (ELRA).


Edward J Hu, yelong shen, Phillip Wallis, Zeyuan AllenZhu, Yuanzhi Li, Shean Wang, Lu Wang, and Weizhu
Chen. 2022. LoRA: Low-rank [adaptation](https://openreview.net/forum?id=nZeVKeeFYf9) of large
[language](https://openreview.net/forum?id=nZeVKeeFYf9) models. In _International_ _Conference_ _on_
_Learning Representations_ .


Hanxu Hu, Hongyuan Lu, Huajian Zhang, Yun-Ze Song,
Wai Lam, and Yue Zhang. 2024. [Chain-of-symbol](https://openreview.net/forum?id=Hvq9RtSoHG)
prompting for spatial [reasoning](https://openreview.net/forum?id=Hvq9RtSoHG) in large language
[models.](https://openreview.net/forum?id=Hvq9RtSoHG) In _First Conference on Language Modeling_ .


Shadi Iskander, Sofia Tolmach, Ori Shapira, Nachshon
Cohen, and Zohar Karnin. 2024. Quality matters:
Evaluating synthetic [data](https://doi.org/10.18653/v1/2024.emnlp-main.285) for tool-using LLMs. In
_Proceedings_ _of_ _the_ _2024_ _Conference_ _on_ _Empirical_
_Methods_ _in_ _Natural_ _Language_ _Processing_, pages
4958–4976, Miami, Florida, USA. Association for
Computational Linguistics.


Lu Jiang, Deyu Meng, Shoou-I Yu, Zhenzhong Lan,
Shiguang Shan, and Alexander G. Hauptmann. 2014.
Self-paced learning with diversity. In _Proceedings_
_of the 28th International Conference on Neural In-_
_formation Processing Systems - Volume 2_, NIPS’14,
page 2078–2086, Cambridge, MA, USA. MIT Press.


Jing Jin and Houfeng Wang. 2024. [Select high-quality](https://aclanthology.org/2024.lrec-main.1267/)
synthetic QA pairs to [augment](https://aclanthology.org/2024.lrec-main.1267/) training data in
[MRC under the reward guidance of generative lan-](https://aclanthology.org/2024.lrec-main.1267/)
guage [models.](https://aclanthology.org/2024.lrec-main.1267/) In _Proceedings_ _of_ _the_ _2024_ _Joint_
_International Conference on Computational Linguis-_
_tics,_ _Language_ _Resources_ _and_ _Evaluation_ _(LREC-_
_COLING 2024)_, pages 14543–14554, Torino, Italia.
ELRA and ICCL.


Pratik Joshi, Sebastin Santy, Amar Budhiraja, Kalika
Bali, and Monojit Choudhury. 2020. [The state and](https://doi.org/10.18653/v1/2020.acl-main.560)
[fate of linguistic diversity and inclusion in the NLP](https://doi.org/10.18653/v1/2020.acl-main.560)
[world.](https://doi.org/10.18653/v1/2020.acl-main.560) In _Proceedings of the 58th Annual Meeting of_
_the Association for Computational Linguistics_, pages
6282–6293, Online. Association for Computational
Linguistics.



Goro Kobayashi, Tatsuki Kuribayashi, Sho Yokoi, and
Kentaro Inui. 2023. [Transformer language models](https://doi.org/10.18653/v1/2023.findings-acl.276)
[handle word frequency in prediction head.](https://doi.org/10.18653/v1/2023.findings-acl.276) In _Find-_
_ings of the Association for Computational Linguis-_
_tics:_ _ACL 2023_, pages 4523–4535, Toronto, Canada.
Association for Computational Linguistics.


Hongyuan Lu and Wai Lam. 2023. [PCC: Paraphrasing](https://doi.org/10.18653/v1/2023.eacl-main.5)
[with bottom-k sampling and cyclic learning for cur-](https://doi.org/10.18653/v1/2023.eacl-main.5)
riculum data [augmentation.](https://doi.org/10.18653/v1/2023.eacl-main.5) In _Proceedings_ _of_ _the_
_17th Conference of the European Chapter of the Asso-_
_ciation for Computational Linguistics_, pages 68–82,
Dubrovnik, Croatia. Association for Computational
Linguistics.


Hongyuan Lu, Haoran Yang, Haoyang Huang, Dongdong Zhang, Wai Lam, and Furu Wei. 2023.
Chain-of-Dictionary [Prompting](https://doi.org/10.48550/arXiv.2305.06575) Elicits Translation
in Large [Language](https://doi.org/10.48550/arXiv.2305.06575) Models. _arXiv_ _e-prints_,
arXiv:2305.06575.


Nikolay Mikhaylovskiy. 2025. [Zipf’s and heaps’ laws](https://doi.org/10.18653/v1/2025.findings-emnlp.837)
for tokens and [LLM-generated](https://doi.org/10.18653/v1/2025.findings-emnlp.837) texts. In _Findings_
_of_ _the_ _Association_ _for_ _Computational_ _Linguistics:_
_EMNLP 2025_, pages 15469–15481, Suzhou, China.
Association for Computational Linguistics.


Ranjini Mohan and Christine Weber. 2019. [Neural ac-](https://doi.org/10.1080/13825585.2018.1519105)
[tivity reveals effects of aging on inhibitory processes](https://doi.org/10.1080/13825585.2018.1519105)
[during word retrieval.](https://doi.org/10.1080/13825585.2018.1519105) _Aging, Neuropsychology, and_
_Cognition_, 26(5):660–687. PMID: 30223706.


Niklas Muennighoff, Zitong Yang, Weijia Shi, Xiang Lisa Li, Li Fei-Fei, Hannaneh Hajishirzi, Luke
Zettlemoyer, Percy Liang, Emmanuel Candès, and
Tatsunori Hashimoto. 2025. s1: [Simple](https://doi.org/10.48550/arXiv.2501.19393) test-time
[scaling.](https://doi.org/10.48550/arXiv.2501.19393) _arXiv e-prints_, arXiv:2501.19393.


NLLB-Team. 2022. No language left behind: Scaling
human-centered machine translation.


Byung-Doh Oh, Shisen Yue, and William Schuler. 2024.

[Frequency explains the inverse correlation of large](https://aclanthology.org/2024.eacl-long.162/)
language models’ size, [training](https://aclanthology.org/2024.eacl-long.162/) data amount, and
surprisal‘s fit [to](https://aclanthology.org/2024.eacl-long.162/) reading times. In _Proceedings_ _of_
_the 18th Conference of the European Chapter of the_
_Association for Computational Linguistics (Volume 1:_
_Long Papers)_, pages 2644–2663, St. Julian’s, Malta.
Association for Computational Linguistics.


Kishore Papineni, Salim Roukos, Todd Ward, and WeiJing Zhu. 2002. Bleu: [a method for automatic evalu-](https://doi.org/10.3115/1073083.1073135)
[ation of machine translation.](https://doi.org/10.3115/1073083.1073135) In _Proceedings of the_
_40th Annual Meeting of the Association for Compu-_
_tational_ _Linguistics_, pages 311–318, Philadelphia,
Pennsylvania, USA. Association for Computational
Linguistics.


Maja Popovi´c. 2015. [chrF: character n-gram F-score](https://doi.org/10.18653/v1/W15-3049)
[for automatic MT evaluation.](https://doi.org/10.18653/v1/W15-3049) In _Proceedings of the_
_Tenth Workshop on Statistical Machine Translation_,
pages 392–395, Lisbon, Portugal. Association for
Computational Linguistics.


Ricardo Rei, Craig Stewart, Ana C Farinha, and Alon
Lavie. 2020. [COMET: A neural framework for MT](https://doi.org/10.18653/v1/2020.emnlp-main.213)


[evaluation.](https://doi.org/10.18653/v1/2020.emnlp-main.213) In _Proceedings of the 2020 Conference_
_on Empirical Methods in Natural Language Process-_
_ing (EMNLP)_, pages 2685–2702, Online. Association
for Computational Linguistics.


Robyn Speer. 2022. [rspeer/wordfreq:](https://doi.org/10.5281/zenodo.7199437) v3.0.


Ilya Sutskever, Oriol Vinyals, and Quoc V. Le. 2014.
Sequence to sequence learning with neural networks.
In _Proceedings of the 27th International Conference_
_on Neural Information Processing Systems - Volume_
_2_, NIPS’14, page 3104–3112, Cambridge, MA, USA.
MIT Press.


Alon Talmor, Jonathan Herzig, Nicholas Lourie, and
Jonathan Berant. 2019. [CommonsenseQA: A ques-](https://doi.org/10.18653/v1/N19-1421)
tion answering [challenge](https://doi.org/10.18653/v1/N19-1421) targeting commonsense
[knowledge.](https://doi.org/10.18653/v1/N19-1421) In _Proceedings of the 2019 Conference_
_of the North American Chapter of the Association for_
_Computational Linguistics:_ _Human Language Tech-_
_nologies, Volume 1 (Long and Short Papers)_, pages
4149–4158, Minneapolis, Minnesota. Association for
Computational Linguistics.


Tianyi Tang, Hongyuan Lu, Yuchen Jiang, Haoyang
Huang, Dongdong Zhang, Xin Zhao, Tom Kocmi,
and Furu Wei. 2024. [Not all metrics are guilty:](https://doi.org/10.18653/v1/2024.naacl-long.367) Im[proving NLG evaluation by diversifying references.](https://doi.org/10.18653/v1/2024.naacl-long.367)
In _Proceedings of the 2024 Conference of the North_
_American Chapter of the Association for Computa-_
_tional Linguistics:_ _Human Language Technologies_
_(Volume 1:_ _Long Papers)_, pages 6596–6610, Mexico
City, Mexico. Association for Computational Linguistics.


Boshi Wang, Sewon Min, Xiang Deng, Jiaming Shen,
You Wu, Luke Zettlemoyer, and Huan Sun. 2023.
[Towards understanding chain-of-thought prompting:](https://doi.org/10.18653/v1/2023.acl-long.153)
[An empirical study of what matters.](https://doi.org/10.18653/v1/2023.acl-long.153) In _Proceedings_
_of_ _the_ _61st_ _Annual_ _Meeting_ _of_ _the_ _Association_ _for_
_Computational Linguistics (Volume 1:_ _Long Papers)_,
pages 2717–2739, Toronto, Canada. Association for
Computational Linguistics.


Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten
Bosma, Brian Ichter, Fei Xia, Ed H. Chi, Quoc V. Le,
and Denny Zhou. 2024. Chain-of-thought prompting elicits reasoning in large language models. In
_Proceedings of the 36th International Conference on_
_Neural Information Processing Systems_, NIPS ’22,
Red Hook, NY, USA. Curran Associates Inc.


Sam Witteveen and Martin Andrews. 2019. [Paraphras-](https://doi.org/10.18653/v1/D19-5623)
[ing with large language models.](https://doi.org/10.18653/v1/D19-5623) In _Proceedings of_
_the 3rd Workshop on Neural Generation and Trans-_
_lation_, pages 215–220, Hong Kong. Association for
Computational Linguistics.


Wenhao Zhu, Pinzhen Chen, Hanxu Hu, Shujian
Huang, Fei Yuan, Jiajun Chen, and Alexandra Birch.
2025. [Generalizing From Short to Long:](https://doi.org/10.48550/arXiv.2502.15592) Effective
[Data Synthesis for Long-Context Instruction Tuning.](https://doi.org/10.48550/arXiv.2502.15592)
_arXiv e-prints_, arXiv:2502.15592.


Wenhao Zhu, Hongyi Liu, Qingxiu Dong, Jingjing Xu,
Shujian Huang, Lingpeng Kong, Jiajun Chen, and



Lei Li. 2024a. [Multilingual machine translation with](https://doi.org/10.18653/v1/2024.findings-naacl.176)
large language models: [Empirical results and anal-](https://doi.org/10.18653/v1/2024.findings-naacl.176)
[ysis.](https://doi.org/10.18653/v1/2024.findings-naacl.176) In _Findings_ _of_ _the_ _Association_ _for_ _Computa-_
_tional Linguistics:_ _NAACL 2024_, pages 2765–2781,
Mexico City, Mexico. Association for Computational
Linguistics.


Wenhong Zhu, Hongkun Hao, Zhiwei He, Yun-Ze Song,
Jiao Yueyang, Yumeng Zhang, Hanxu Hu, Yiran
Wei, Rui Wang, and Hongyuan Lu. 2024b. [CLEAN–](https://doi.org/10.18653/v1/2024.findings-naacl.53)
[EVAL: Clean evaluation on contaminated large lan-](https://doi.org/10.18653/v1/2024.findings-naacl.53)
guage [models.](https://doi.org/10.18653/v1/2024.findings-naacl.53) In _Findings_ _of_ _the_ _Association_ _for_
_Computational Linguistics: NAACL 2024_, pages 835–
847, Mexico City, Mexico. Association for Computational Linguistics.


**Appendix**


_Supported Languages by COMET_

ell_Grek spa_Latn bel_Cyrl

acm_Arab hrv_Latn mar_Deva

srp_Cyrl uig_Arab est_Latn

pol_Latn ukr_Cyrl eus_Latn

ajp_Arab mkd_Cyrl swe_Latn

urd_Arab ind_Latn swh_Latn

uzn_Latn fin_Latn ita_Latn

kor_Hang lao_Laoo rus_Cyrl

arb_Arab bul_Cyrl nld_Latn

san_Deva ars_Arab lit_Latn

tha_Thai glg_Latn slk_Latn

cym_Latn dan_Latn snd_Arab

som_Latn   -   

Table 7: The list of 37 languages supported by our
COMET model for evaluation on machine translation.


100


95



90


85


80


75


70



Percentage of Data Used



Figure 5: The figure that demonstrates the relationship
between performance percentage and the amount of data
used for TFD. We can see that with more data used, the
performance improvement increases.


|Language|Low High|Language|Low High|Language|Low High|Language|Low High|Language|Low High|
|---|---|---|---|---|---|---|---|---|---|
|acm_Arab<br>arb_Arab<br>ayr_Latn<br>bul_Cyrl<br>dan_Latn<br>ewe_Latn<br>guj_Gujr<br>ita_Latn<br>kas_Deva<br>kor_Hang<br>ltz_Latn<br>mai_Deva<br>mlt_Latn<br>pbt_Arab<br>rus_Cyrl<br>sin_Sinh<br>spa_Latn<br>swe_Latn<br>tgl_Latn<br>ukr_Cyrl|2.54<br>**3.29**<br>6.15<br>**9.24**<br>0.41<br>**0.59**<br>10.61<br>**16.97**<br>12.58<br>**21.04**<br>1.18<br>**1.54**<br>4.17<br>**6.97**<br>9.86<br>**15.95**<br>0.16<br>**0.32**<br>2.95<br>**5.02**<br>6.69<br>**10.03**<br>2.97<br>**3.97**<br>7.73<br>**11.17**<br>2.29<br>**3.08**<br>9.42<br>**16.08**<br>2.46<br>**3.96**<br>10.36<br>**14.89**<br>11.7<br>**18.63**<br>14.73<br>**19.68**<br>7.8<br>**12.75**|acq_Arab<br>ars_Arab<br>ban_Latn<br>ceb_Latn<br>dzo_Tibt<br>fn_Latn<br>hne_Deva<br>kab_Latn<br>kat_Geor<br>lao_Laoo<br>lug_Latn<br>mal_Mlym<br>mya_Mymr<br>pol_Latn<br>sag_Latn<br>slk_Latn<br>srd_Latn<br>swh_Latn<br>tha_Thai<br>urd_Arab|3.07<br>**4.51**<br>5.2<br>**6.36**<br>3.7<br>**4.24**<br>13.06<br>**17.26**<br>0.03<br>**0.04**<br>5.42<br>**9.44**<br>2.08<br>**2.32**<br>1.03<br>**1.21**<br>2.77<br>**4.72**<br>1.46<br>**1.73**<br>1.47<br>**2.04**<br>2.12<br>**3.22**<br>0.54<br>**0.66**<br>6.74<br>**11.03**<br>0.67<br>**0.9**<br>8.49<br>**13.31**<br>7.44<br>**11.66**<br>10.76<br>**15.63**<br>0.95<br>**1.3**<br>6.26<br>**9.62**|aeb_Arab<br>ary_Arab<br>bel_Cyrl<br>ckb_Arab<br>ell_Grek<br>fon_Latn<br>hrv_Latn<br>kac_Latn<br>kea_Latn<br>lin_Latn<br>luo_Latn<br>mar_Deva<br>nld_Latn<br>prs_Arab<br>san_Deva<br>sna_Latn<br>srp_Cyrl<br>szl_Latn<br>tpi_Latn<br>uzn_Latn|2.36<br>**3.22**<br>0.73<br>**0.98**<br>3.7<br>**5.66**<br>1.54<br>**2.47**<br>7.97<br>**12.07**<br>0.26<br>**0.39**<br>8.74<br>**13.83**<br>1.36<br>**1.72**<br>3.84<br>**5.58**<br>3.83<br>**5.06**<br>1.04<br>**1.4**<br>3.04<br>**5.03**<br>8.65<br>**12.27**<br>5.27<br>**7.65**<br>0.11<br>**0.38**<br>2.94<br>**4.54**<br>8.61<br>**14.29**<br>3.45<br>**5.02**<br>8.8<br>**10.85**<br>4.1<br>**5.98**|ajp_Arab<br>arz_Arab<br>bho_Deva<br>crh_Latn<br>est_Latn<br>glg_Latn<br>ilo_Latn<br>kan_Knda<br>kmr_Latn<br>lit_Latn<br>lus_Latn<br>min_Latn<br>nno_Latn<br>quy_Latn<br>sat_Olck<br>snd_Arab<br>ssw_Latn<br>tat_Cyrl<br>twi_Latn<br>war_Latn|2.7<br>**4.14**<br>3.17<br>**4.66**<br>3.38<br>**4.43**<br>1.67<br>**2.32**<br>6.1<br>**9.81**<br>11.01<br>**16.84**<br>7.99<br>**10.89**<br>2.71<br>**4.57**<br>2.45<br>**3.03**<br>6.62<br>**10.15**<br>2.78<br>**3.26**<br>6.05<br>**7.8**<br>8.55<br>**14.01**<br>0.55<br>**0.68**<br>1.0<br>**1.71**<br>4.35<br>**6.15**<br>1.25<br>**1.53**<br>3.75<br>**5.86**<br>2.44<br>**3.08**<br>10.42<br>**13.29**|als_Latn<br>awa_Deva<br>bjn_Latn<br>cym_Latn<br>eus_Latn<br>grn_Latn<br>ind_Latn<br>kas_Arab<br>kon_Latn<br>lmo_Latn<br>mag_Deva<br>mkd_Cyrl<br>nob_Latn<br>run_Latn<br>scn_Latn<br>som_Latn<br>sun_Latn<br>tgk_Cyrl<br>uig_Arab<br>zho_Hans|9.36<br>**14.54**<br>1.93<br>**3.06**<br>5.31<br>**6.08**<br>15.06<br>**20.64**<br>3.94<br>**6.09**<br>1.6<br>**2.0**<br>13.91<br>**20.26**<br>0.4<br>**0.55**<br>3.16<br>**4.43**<br>2.99<br>**3.77**<br>4.2<br>**5.24**<br>10.06<br>**14.87**<br>8.54<br>**12.84**<br>1.47<br>**2.05**<br>4.08<br>**5.94**<br>2.5<br>**3.25**<br>5.6<br>**7.42**<br>4.5<br>**6.25**<br>1.5<br>**2.27**<br>**0.42**<br>0.26|


Table 8: Results on DEEPSEEK-V3 in BLEU scores on 100 languages from English into other languages.

|Language|Low High|Language|Low High|Language|Low High|Language|Low High|Language|Low High|
|---|---|---|---|---|---|---|---|---|---|
|acm_Arab<br>arb_Arab<br>ayr_Latn<br>bul_Cyrl<br>dan_Latn<br>ewe_Latn<br>guj_Gujr<br>ita_Latn<br>kas_Deva<br>kor_Hang<br>ltz_Latn<br>mai_Deva<br>mlt_Latn<br>pbt_Arab<br>rus_Cyrl<br>sin_Sinh<br>spa_Latn<br>swe_Latn<br>tgl_Latn<br>ukr_Cyrl|36.94<br>**38.42**<br>40.87<br>**45.4**<br>28.95<br>**30.13**<br>45.11<br>**50.17**<br>45.89<br>**51.74**<br>27.1<br>**27.87**<br>37.1<br>**40.45**<br>44.39<br>**48.37**<br>17.15<br>**17.88**<br>25.15<br>**29.23**<br>41.44<br>**45.1**<br>34.31<br>**36.05**<br>42.62<br>**47.33**<br>28.45<br>**30.04**<br>43.15<br>**47.97**<br>35.75<br>**38.05**<br>42.38<br>**46.18**<br>45.86<br>**51.3**<br>49.2<br>**51.62**<br>41.18<br>**45.68**|acq_Arab<br>ars_Arab<br>ban_Latn<br>ceb_Latn<br>dzo_Tibt<br>fn_Latn<br>hne_Deva<br>kab_Latn<br>kat_Geor<br>lao_Laoo<br>lug_Latn<br>mal_Mlym<br>mya_Mymr<br>pol_Latn<br>sag_Latn<br>slk_Latn<br>srd_Latn<br>swh_Latn<br>tha_Thai<br>urd_Arab|37.07<br>**39.17**<br>39.43<br>**41.77**<br>36.79<br>**38.27**<br>46.96<br>**49.72**<br>33.62<br>**33.99**<br>44.2<br>**48.79**<br>29.64<br>**30.44**<br>26.12<br>**27.1**<br>41.81<br>**44.9**<br>38.13<br>**39.98**<br>34.0<br>**35.39**<br>40.38<br>**43.88**<br>42.56<br>**44.17**<br>40.63<br>**44.69**<br>20.36<br>**21.52**<br>40.81<br>**45.41**<br>40.51<br>**43.96**<br>47.58<br>**50.84**<br>43.24<br>**47.0**<br>37.15<br>**40.79**|aeb_Arab<br>ary_Arab<br>bel_Cyrl<br>ckb_Arab<br>ell_Grek<br>fon_Latn<br>hrv_Latn<br>kac_Latn<br>kea_Latn<br>lin_Latn<br>luo_Latn<br>mar_Deva<br>nld_Latn<br>prs_Arab<br>san_Deva<br>sna_Latn<br>srp_Cyrl<br>szl_Latn<br>tpi_Latn<br>uzn_Latn|34.44<br>**36.79**<br>30.51<br>**31.48**<br>35.88<br>**38.77**<br>38.68<br>**40.8**<br>39.16<br>**43.04**<br>16.56<br>**17.63**<br>42.99<br>**48.09**<br>27.85<br>**29.04**<br>35.78<br>**37.61**<br>38.71<br>**40.32**<br>27.14<br>**27.33**<br>38.07<br>**40.93**<br>44.19<br>**47.9**<br>36.75<br>**39.93**<br>27.9<br>**29.61**<br>41.51<br>**43.93**<br>41.7<br>**47.09**<br>34.92<br>**36.88**<br>40.08<br>**40.7**<br>44.17<br>**46.69**|ajp_Arab<br>arz_Arab<br>bho_Deva<br>crh_Latn<br>est_Latn<br>glg_Latn<br>ilo_Latn<br>kan_Knda<br>kmr_Latn<br>lit_Latn<br>lus_Latn<br>min_Latn<br>nno_Latn<br>quy_Latn<br>sat_Olck<br>snd_Arab<br>ssw_Latn<br>tat_Cyrl<br>twi_Latn<br>war_Latn|37.79<br>**40.58**<br>36.87<br>**39.65**<br>31.92<br>**33.93**<br>34.55<br>**36.55**<br>44.16<br>**47.71**<br>43.55<br>**48.02**<br>43.98<br>**46.68**<br>40.54<br>**44.1**<br>33.7<br>**35.35**<br>42.62<br>**47.39**<br>33.3<br>**34.14**<br>41.89<br>**44.06**<br>42.43<br>**46.45**<br>35.37<br>**35.86**<br>28.63<br>**29.95**<br>33.16<br>**36.0**<br>36.89<br>**38.53**<br>39.43<br>**42.32**<br>31.6<br>**32.54**<br>44.35<br>**46.44**|als_Latn<br>awa_Deva<br>bjn_Latn<br>cym_Latn<br>eus_Latn<br>grn_Latn<br>ind_Latn<br>kas_Arab<br>kon_Latn<br>lmo_Latn<br>mag_Deva<br>mkd_Cyrl<br>nob_Latn<br>run_Latn<br>scn_Latn<br>som_Latn<br>sun_Latn<br>tgk_Cyrl<br>uig_Arab<br>zho_Hans|42.09<br>**45.98**<br>30.45<br>**31.84**<br>41.31<br>**42.63**<br>45.09<br>**49.54**<br>44.93<br>**48.09**<br>30.24<br>**31.04**<br>50.07<br>**55.44**<br>22.95<br>**23.67**<br>36.24<br>**37.43**<br>30.0<br>**31.49**<br>32.78<br>**33.65**<br>44.65<br>**48.62**<br>43.35<br>**46.56**<br>31.63<br>**33.21**<br>36.77<br>**39.9**<br>36.94<br>**38.57**<br>41.18<br>**44.26**<br>38.33<br>**40.6**<br>37.42<br>**39.42**<br>24.44<br>**30.46**|



Table 9: Results on DEEPSEEK-V3 in chrF scores on 100 languages from English into other languages.

|Language|Low High|Language|Low High|Language|Low High|Language|Low High|Language|Low High|
|---|---|---|---|---|---|---|---|---|---|
|acm_Arab<br>bul_Cyrl<br>eus_Latn<br>ita_Latn<br>mkd_Cyrl<br>slk_Latn<br>swe_Latn<br>urd_Arab|79.82<br>**80.02**<br>85.82<br>**88.27**<br>82.08<br>**84.12**<br>82.92<br>**85.22**<br>83.87<br>**86.4**<br>84.98<br>**87.64**<br>84.61<br>**87.69**<br>78.62<br>**80.58**|ajp_Arab<br>cym_Latn<br>fn_Latn<br>kor_Hang<br>nld_Latn<br>snd_Arab<br>swh_Latn<br>uzn_Latn|78.76<br>**79.16**<br>79.78<br>**82.84**<br>87.54<br>**90.23**<br>86.78<br>**88.26**<br>82.36<br>**85.33**<br>73.78<br>**75.95**<br>79.48<br>**81.43**<br>86.76<br>**88.09**|arb_Arab<br>82.95<br>**85.1**<br>ars_Arab<br>82.48<br>**83.41**<br>bel_Cyrl<br>83.02<br>**84.84**<br>dan_Latn<br>84.29<br>**87.59**<br>ell_Grek<br>84.76<br>**86.84**<br>est_Latn<br>87.09<br>**89.11**<br>glg_Latn<br>81.05<br>**83.64**<br>hrv_Latn<br>86.29<br>**88.58**<br>ind_Latn<br>86.74<br>**89.0**<br>lao_Laoo<br>80.56<br>**81.85**<br>lit_Latn<br>85.09<br>**88.26**<br>mar_Deva<br>69.13<br>**71.45**<br>pol_Latn<br>85.3<br>**87.72**<br>rus_Cyrl<br>85.49<br>**87.73**<br>san_Deva<br>70.71<br>**71.68**<br>som_Latn<br>75.33<br>**76.9**<br>spa_Latn<br>80.78<br>**83.2**<br>srp_Cyrl<br>84.27<br>**86.98**<br>tha_Thai<br>85.22<br>**86.79**<br>uig_Arab<br>80.28<br>**81.85**<br>ukr_Cyrl<br>85.55<br>**87.98**|arb_Arab<br>82.95<br>**85.1**<br>ars_Arab<br>82.48<br>**83.41**<br>bel_Cyrl<br>83.02<br>**84.84**<br>dan_Latn<br>84.29<br>**87.59**<br>ell_Grek<br>84.76<br>**86.84**<br>est_Latn<br>87.09<br>**89.11**<br>glg_Latn<br>81.05<br>**83.64**<br>hrv_Latn<br>86.29<br>**88.58**<br>ind_Latn<br>86.74<br>**89.0**<br>lao_Laoo<br>80.56<br>**81.85**<br>lit_Latn<br>85.09<br>**88.26**<br>mar_Deva<br>69.13<br>**71.45**<br>pol_Latn<br>85.3<br>**87.72**<br>rus_Cyrl<br>85.49<br>**87.73**<br>san_Deva<br>70.71<br>**71.68**<br>som_Latn<br>75.33<br>**76.9**<br>spa_Latn<br>80.78<br>**83.2**<br>srp_Cyrl<br>84.27<br>**86.98**<br>tha_Thai<br>85.22<br>**86.79**<br>uig_Arab<br>80.28<br>**81.85**<br>ukr_Cyrl<br>85.55<br>**87.98**|arb_Arab<br>82.95<br>**85.1**<br>ars_Arab<br>82.48<br>**83.41**<br>bel_Cyrl<br>83.02<br>**84.84**<br>dan_Latn<br>84.29<br>**87.59**<br>ell_Grek<br>84.76<br>**86.84**<br>est_Latn<br>87.09<br>**89.11**<br>glg_Latn<br>81.05<br>**83.64**<br>hrv_Latn<br>86.29<br>**88.58**<br>ind_Latn<br>86.74<br>**89.0**<br>lao_Laoo<br>80.56<br>**81.85**<br>lit_Latn<br>85.09<br>**88.26**<br>mar_Deva<br>69.13<br>**71.45**<br>pol_Latn<br>85.3<br>**87.72**<br>rus_Cyrl<br>85.49<br>**87.73**<br>san_Deva<br>70.71<br>**71.68**<br>som_Latn<br>75.33<br>**76.9**<br>spa_Latn<br>80.78<br>**83.2**<br>srp_Cyrl<br>84.27<br>**86.98**<br>tha_Thai<br>85.22<br>**86.79**<br>uig_Arab<br>80.28<br>**81.85**<br>ukr_Cyrl<br>85.55<br>**87.98**|arb_Arab<br>82.95<br>**85.1**<br>ars_Arab<br>82.48<br>**83.41**<br>bel_Cyrl<br>83.02<br>**84.84**<br>dan_Latn<br>84.29<br>**87.59**<br>ell_Grek<br>84.76<br>**86.84**<br>est_Latn<br>87.09<br>**89.11**<br>glg_Latn<br>81.05<br>**83.64**<br>hrv_Latn<br>86.29<br>**88.58**<br>ind_Latn<br>86.74<br>**89.0**<br>lao_Laoo<br>80.56<br>**81.85**<br>lit_Latn<br>85.09<br>**88.26**<br>mar_Deva<br>69.13<br>**71.45**<br>pol_Latn<br>85.3<br>**87.72**<br>rus_Cyrl<br>85.49<br>**87.73**<br>san_Deva<br>70.71<br>**71.68**<br>som_Latn<br>75.33<br>**76.9**<br>spa_Latn<br>80.78<br>**83.2**<br>srp_Cyrl<br>84.27<br>**86.98**<br>tha_Thai<br>85.22<br>**86.79**<br>uig_Arab<br>80.28<br>**81.85**<br>ukr_Cyrl<br>85.55<br>**87.98**|arb_Arab<br>82.95<br>**85.1**<br>ars_Arab<br>82.48<br>**83.41**<br>bel_Cyrl<br>83.02<br>**84.84**<br>dan_Latn<br>84.29<br>**87.59**<br>ell_Grek<br>84.76<br>**86.84**<br>est_Latn<br>87.09<br>**89.11**<br>glg_Latn<br>81.05<br>**83.64**<br>hrv_Latn<br>86.29<br>**88.58**<br>ind_Latn<br>86.74<br>**89.0**<br>lao_Laoo<br>80.56<br>**81.85**<br>lit_Latn<br>85.09<br>**88.26**<br>mar_Deva<br>69.13<br>**71.45**<br>pol_Latn<br>85.3<br>**87.72**<br>rus_Cyrl<br>85.49<br>**87.73**<br>san_Deva<br>70.71<br>**71.68**<br>som_Latn<br>75.33<br>**76.9**<br>spa_Latn<br>80.78<br>**83.2**<br>srp_Cyrl<br>84.27<br>**86.98**<br>tha_Thai<br>85.22<br>**86.79**<br>uig_Arab<br>80.28<br>**81.85**<br>ukr_Cyrl<br>85.55<br>**87.98**|arb_Arab<br>82.95<br>**85.1**<br>ars_Arab<br>82.48<br>**83.41**<br>bel_Cyrl<br>83.02<br>**84.84**<br>dan_Latn<br>84.29<br>**87.59**<br>ell_Grek<br>84.76<br>**86.84**<br>est_Latn<br>87.09<br>**89.11**<br>glg_Latn<br>81.05<br>**83.64**<br>hrv_Latn<br>86.29<br>**88.58**<br>ind_Latn<br>86.74<br>**89.0**<br>lao_Laoo<br>80.56<br>**81.85**<br>lit_Latn<br>85.09<br>**88.26**<br>mar_Deva<br>69.13<br>**71.45**<br>pol_Latn<br>85.3<br>**87.72**<br>rus_Cyrl<br>85.49<br>**87.73**<br>san_Deva<br>70.71<br>**71.68**<br>som_Latn<br>75.33<br>**76.9**<br>spa_Latn<br>80.78<br>**83.2**<br>srp_Cyrl<br>84.27<br>**86.98**<br>tha_Thai<br>85.22<br>**86.79**<br>uig_Arab<br>80.28<br>**81.85**<br>ukr_Cyrl<br>85.55<br>**87.98**|



Table 10: Results on DEEPSEEK-V3 in COMET scores on 37 supported languages from English into other
languages.

|Language|Low High|Language|Low High|Language|Low High|Language|Low High|Language|Low High|
|---|---|---|---|---|---|---|---|---|---|
|acm_Arab<br>arb_Arab<br>ayr_Latn<br>bul_Cyrl<br>dan_Latn<br>ewe_Latn<br>guj_Gujr<br>ita_Latn<br>kas_Deva<br>kor_Hang<br>ltz_Latn<br>mai_Deva<br>mlt_Latn<br>pbt_Arab<br>rus_Cyrl<br>sin_Sinh<br>spa_Latn<br>swe_Latn<br>tgl_Latn<br>ukr_Cyrl|2.83<br>**3.79**<br>5.77<br>**8.92**<br>0.52<br>**0.67**<br>10.5<br>**16.51**<br>13.1<br>**19.69**<br>0.61<br>**0.67**<br>2.58<br>**3.55**<br>9.64<br>**14.48**<br>0.09<br>**0.18**<br>3.45<br>**4.99**<br>4.46<br>**6.0**<br>3.09<br>**3.75**<br>5.7<br>**8.11**<br>2.14<br>**3.01**<br>8.82<br>**14.08**<br>0.66<br>**1.14**<br>10.31<br>**13.52**<br>11.57<br>**19.5**<br>15.29<br>**19.16**<br>7.91<br>**12.1**|acq_Arab<br>ars_Arab<br>ban_Latn<br>ceb_Latn<br>dzo_Tibt<br>fn_Latn<br>hne_Deva<br>kab_Latn<br>kat_Geor<br>lao_Laoo<br>lug_Latn<br>mal_Mlym<br>mya_Mymr<br>pol_Latn<br>sag_Latn<br>slk_Latn<br>srd_Latn<br>swh_Latn<br>tha_Thai<br>urd_Arab|3.41<br>**4.43**<br>4.76<br>**6.17**<br>2.7<br>**3.47**<br>12.3<br>**16.0**<br>0.08<br>**0.08**<br>5.24<br>**8.74**<br>2.36<br>**3.3**<br>0.36<br>**0.45**<br>2.23<br>**2.85**<br>**1.07**<br>0.8<br>1.3<br>**1.58**<br>0.64<br>**1.0**<br>0.21<br>**0.33**<br>6.26<br>**10.36**<br>**0.74**<br>0.66<br>8.02<br>**12.21**<br>3.05<br>**3.67**<br>10.94<br>**14.41**<br>1.24<br>**1.61**<br>5.38<br>**8.28**|aeb_Arab<br>ary_Arab<br>bel_Cyrl<br>ckb_Arab<br>ell_Grek<br>fon_Latn<br>hrv_Latn<br>kac_Latn<br>kea_Latn<br>lin_Latn<br>luo_Latn<br>mar_Deva<br>nld_Latn<br>prs_Arab<br>san_Deva<br>sna_Latn<br>srp_Cyrl<br>szl_Latn<br>tpi_Latn<br>uzn_Latn|2.12<br>**3.19**<br>1.27<br>**1.84**<br>3.07<br>**4.6**<br>0.2<br>**0.48**<br>7.42<br>**11.25**<br>0.26<br>**0.4**<br>7.88<br>**12.22**<br>0.39<br>**0.46**<br>2.54<br>**2.83**<br>2.77<br>**3.43**<br>0.98<br>**1.25**<br>2.45<br>**3.19**<br>8.38<br>**11.61**<br>5.24<br>**7.12**<br>**0.22**<br>0.2<br>2.28<br>**2.77**<br>7.26<br>**12.01**<br>2.34<br>**2.74**<br>5.91<br>**6.67**<br>3.76<br>**4.95**|ajp_Arab<br>arz_Arab<br>bho_Deva<br>crh_Latn<br>est_Latn<br>glg_Latn<br>ilo_Latn<br>kan_Knda<br>kmr_Latn<br>lit_Latn<br>lus_Latn<br>min_Latn<br>nno_Latn<br>quy_Latn<br>sat_Olck<br>snd_Arab<br>ssw_Latn<br>tat_Cyrl<br>twi_Latn<br>war_Latn|3.14<br>**4.28**<br>2.84<br>**4.6**<br>2.82<br>**4.06**<br>0.8<br>**1.08**<br>6.16<br>**9.59**<br>10.71<br>**15.36**<br>5.75<br>**7.02**<br>1.39<br>**1.84**<br>1.27<br>**1.67**<br>5.93<br>**9.37**<br>2.1<br>**2.19**<br>2.94<br>**3.51**<br>8.7<br>**13.66**<br>**0.53**<br>0.51<br>0.0<br>**0.15**<br>3.82<br>**5.65**<br>0.78<br>**0.93**<br>3.45<br>**5.06**<br>1.87<br>**2.06**<br>11.11<br>**13.62**|als_Latn<br>awa_Deva<br>bjn_Latn<br>cym_Latn<br>eus_Latn<br>grn_Latn<br>ind_Latn<br>kas_Arab<br>kon_Latn<br>lmo_Latn<br>mag_Deva<br>mkd_Cyrl<br>nob_Latn<br>run_Latn<br>scn_Latn<br>som_Latn<br>sun_Latn<br>tgk_Cyrl<br>uig_Arab<br>zho_Hans|8.96<br>**12.97**<br>2.23<br>**3.03**<br>2.71<br>**3.12**<br>12.34<br>**16.61**<br>2.49<br>**4.58**<br>1.07<br>**1.28**<br>13.96<br>**19.42**<br>0.3<br>**0.35**<br>1.35<br>**1.44**<br>1.75<br>**2.06**<br>3.97<br>**5.16**<br>9.08<br>**12.63**<br>8.77<br>**13.53**<br>1.84<br>**2.0**<br>3.05<br>**4.07**<br>2.97<br>**3.94**<br>4.62<br>**6.5**<br>3.43<br>**4.92**<br>0.31<br>**0.49**<br>**0.59**<br>0.33|



Table 11: Results on GPT4o-mini in BLEU scores on 100 languages from English into other languages.


|Language|Low High|Language|Low High|Language|Low High|Language|Low High|Language|Low High|
|---|---|---|---|---|---|---|---|---|---|
|acm_Arab<br>arb_Arab<br>ayr_Latn<br>bul_Cyrl<br>dan_Latn<br>ewe_Latn<br>guj_Gujr<br>ita_Latn<br>kas_Deva<br>kor_Hang<br>ltz_Latn<br>mai_Deva<br>mlt_Latn<br>pbt_Arab<br>rus_Cyrl<br>sin_Sinh<br>spa_Latn<br>swe_Latn<br>tgl_Latn<br>ukr_Cyrl|36.79<br>**38.99**<br>39.4<br>**43.97**<br>25.05<br>**25.17**<br>43.87<br>**48.82**<br>45.5<br>**50.65**<br>**19.29**<br>19.06<br>31.84<br>**34.51**<br>43.36<br>**47.28**<br>15.25<br>**15.67**<br>23.67<br>**27.85**<br>37.25<br>**40.18**<br>32.64<br>**34.48**<br>39.32<br>**42.66**<br>28.0<br>**29.61**<br>41.19<br>**45.64**<br>26.95<br>**28.23**<br>41.63<br>**45.04**<br>44.77<br>**50.2**<br>48.18<br>**50.73**<br>40.25<br>**44.27**|acq_Arab<br>ars_Arab<br>ban_Latn<br>ceb_Latn<br>dzo_Tibt<br>fn_Latn<br>hne_Deva<br>kab_Latn<br>kat_Geor<br>lao_Laoo<br>lug_Latn<br>mal_Mlym<br>mya_Mymr<br>pol_Latn<br>sag_Latn<br>slk_Latn<br>srd_Latn<br>swh_Latn<br>tha_Thai<br>urd_Arab|35.92<br>**38.38**<br>38.25<br>**40.32**<br>34.58<br>**36.19**<br>45.81<br>**48.45**<br>22.06<br>**22.24**<br>42.96<br>**47.34**<br>29.56<br>**30.68**<br>**18.8**<br>18.53<br>38.23<br>**40.15**<br>21.92<br>**22.96**<br>28.77<br>**29.4**<br>33.35<br>**35.19**<br>33.82<br>**34.75**<br>39.07<br>**42.88**<br>**15.51**<br>15.31<br>39.56<br>**44.11**<br>33.17<br>**33.97**<br>46.01<br>**49.52**<br>41.28<br>**44.1**<br>35.43<br>**38.62**|aeb_Arab<br>ary_Arab<br>bel_Cyrl<br>ckb_Arab<br>ell_Grek<br>fon_Latn<br>hrv_Latn<br>kac_Latn<br>kea_Latn<br>lin_Latn<br>luo_Latn<br>mar_Deva<br>nld_Latn<br>prs_Arab<br>san_Deva<br>sna_Latn<br>srp_Cyrl<br>szl_Latn<br>tpi_Latn<br>uzn_Latn|33.7<br>**36.16**<br>32.15<br>**34.47**<br>34.16<br>**36.62**<br>27.2<br>**28.15**<br>38.47<br>**42.19**<br>**13.41**<br>13.24<br>41.98<br>**46.32**<br>**20.99**<br>20.59<br>31.77<br>**32.95**<br>34.6<br>**35.08**<br>**24.04**<br>23.58<br>35.55<br>**37.93**<br>43.18<br>**46.85**<br>36.32<br>**39.37**<br>25.63<br>**26.42**<br>38.08<br>**39.71**<br>39.95<br>**44.62**<br>30.11<br>**31.39**<br>35.17<br>**35.32**<br>42.67<br>**45.03**|ajp_Arab<br>arz_Arab<br>bho_Deva<br>crh_Latn<br>est_Latn<br>glg_Latn<br>ilo_Latn<br>kan_Knda<br>kmr_Latn<br>lit_Latn<br>lus_Latn<br>min_Latn<br>nno_Latn<br>quy_Latn<br>sat_Olck<br>snd_Arab<br>ssw_Latn<br>tat_Cyrl<br>twi_Latn<br>war_Latn|37.53<br>**40.66**<br>35.72<br>**38.95**<br>29.98<br>**32.09**<br>27.31<br>**28.67**<br>42.39<br>**46.11**<br>42.29<br>**46.29**<br>39.6<br>**42.04**<br>33.04<br>**35.91**<br>28.39<br>**28.97**<br>41.27<br>**45.91**<br>28.41<br>**29.05**<br>33.55<br>**35.11**<br>41.2<br>**45.15**<br>**27.19**<br>27.12<br>**15.09**<br>14.84<br>32.23<br>**35.04**<br>31.16<br>**32.14**<br>37.31<br>**40.06**<br>27.28<br>**28.16**<br>43.92<br>**46.35**|als_Latn<br>awa_Deva<br>bjn_Latn<br>cym_Latn<br>eus_Latn<br>grn_Latn<br>ind_Latn<br>kas_Arab<br>kon_Latn<br>lmo_Latn<br>mag_Deva<br>mkd_Cyrl<br>nob_Latn<br>run_Latn<br>scn_Latn<br>som_Latn<br>sun_Latn<br>tgk_Cyrl<br>uig_Arab<br>zho_Hans|41.18<br>**44.51**<br>29.79<br>**31.08**<br>33.84<br>**35.02**<br>41.43<br>**45.22**<br>41.21<br>**44.4**<br>24.82<br>**25.43**<br>49.16<br>**53.94**<br>18.55<br>**18.61**<br>**26.63**<br>26.4<br>28.13<br>**29.46**<br>31.85<br>**33.36**<br>42.78<br>**46.41**<br>42.66<br>**46.2**<br>32.32<br>**33.95**<br>33.87<br>**36.14**<br>37.31<br>**39.34**<br>39.64<br>**42.83**<br>35.62<br>**37.94**<br>29.46<br>**30.7**<br>22.72<br>**27.62**|


Table 12: Results on GPT-4o-mini in chrF scores on 100 languages from English into other languages.

|Language|Low High|Language|Low High|Language|Low High|Language|Low High|Language|Low High|
|---|---|---|---|---|---|---|---|---|---|
|acm_Arab<br>bul_Cyrl<br>eus_Latn<br>ita_Latn<br>mkd_Cyrl<br>slk_Latn<br>swe_Latn<br>urd_Arab|**79.87**<br>79.66<br>83.77<br>**87.16**<br>77.48<br>**80.95**<br>81.69<br>**84.54**<br>81.63<br>**84.46**<br>83.36<br>**86.67**<br>83.02<br>**86.87**<br>77.2<br>**79.5**|ajp_Arab<br>cym_Latn<br>fn_Latn<br>kor_Hang<br>nld_Latn<br>snd_Arab<br>swh_Latn<br>uzn_Latn|77.15<br>**78.26**<br>75.39<br>**79.75**<br>86.45<br>**89.23**<br>85.16<br>**87.18**<br>81.21<br>**84.58**<br>72.46<br>**75.13**<br>78.6<br>**80.88**<br>84.76<br>**86.58**|arb_Arab<br>81.29<br>**83.8**<br>ars_Arab<br>81.23<br>**81.5**<br>bel_Cyrl<br>79.82<br>**82.32**<br>dan_Latn<br>83.2<br>**86.9**<br>ell_Grek<br>83.91<br>**86.36**<br>est_Latn<br>85.22<br>**87.48**<br>glg_Latn<br>79.21<br>**82.63**<br>hrv_Latn<br>85.04<br>**87.91**<br>ind_Latn<br>85.61<br>**88.27**<br>lao_Laoo<br>48.57<br>**51.22**<br>lit_Latn<br>84.51<br>**87.16**<br>mar_Deva<br>65.34<br>**68.35**<br>pol_Latn<br>83.65<br>**86.67**<br>rus_Cyrl<br>83.43<br>**86.25**<br>san_Deva<br>63.69<br>**64.82**<br>som_Latn<br>76.32<br>**77.52**<br>spa_Latn<br>79.84<br>**82.72**<br>srp_Cyrl<br>81.37<br>**85.24**<br>tha_Thai<br>83.69<br>**85.28**<br>uig_Arab<br>63.02<br>**65.16**<br>ukr_Cyrl<br>84.11<br>**86.82**|arb_Arab<br>81.29<br>**83.8**<br>ars_Arab<br>81.23<br>**81.5**<br>bel_Cyrl<br>79.82<br>**82.32**<br>dan_Latn<br>83.2<br>**86.9**<br>ell_Grek<br>83.91<br>**86.36**<br>est_Latn<br>85.22<br>**87.48**<br>glg_Latn<br>79.21<br>**82.63**<br>hrv_Latn<br>85.04<br>**87.91**<br>ind_Latn<br>85.61<br>**88.27**<br>lao_Laoo<br>48.57<br>**51.22**<br>lit_Latn<br>84.51<br>**87.16**<br>mar_Deva<br>65.34<br>**68.35**<br>pol_Latn<br>83.65<br>**86.67**<br>rus_Cyrl<br>83.43<br>**86.25**<br>san_Deva<br>63.69<br>**64.82**<br>som_Latn<br>76.32<br>**77.52**<br>spa_Latn<br>79.84<br>**82.72**<br>srp_Cyrl<br>81.37<br>**85.24**<br>tha_Thai<br>83.69<br>**85.28**<br>uig_Arab<br>63.02<br>**65.16**<br>ukr_Cyrl<br>84.11<br>**86.82**|arb_Arab<br>81.29<br>**83.8**<br>ars_Arab<br>81.23<br>**81.5**<br>bel_Cyrl<br>79.82<br>**82.32**<br>dan_Latn<br>83.2<br>**86.9**<br>ell_Grek<br>83.91<br>**86.36**<br>est_Latn<br>85.22<br>**87.48**<br>glg_Latn<br>79.21<br>**82.63**<br>hrv_Latn<br>85.04<br>**87.91**<br>ind_Latn<br>85.61<br>**88.27**<br>lao_Laoo<br>48.57<br>**51.22**<br>lit_Latn<br>84.51<br>**87.16**<br>mar_Deva<br>65.34<br>**68.35**<br>pol_Latn<br>83.65<br>**86.67**<br>rus_Cyrl<br>83.43<br>**86.25**<br>san_Deva<br>63.69<br>**64.82**<br>som_Latn<br>76.32<br>**77.52**<br>spa_Latn<br>79.84<br>**82.72**<br>srp_Cyrl<br>81.37<br>**85.24**<br>tha_Thai<br>83.69<br>**85.28**<br>uig_Arab<br>63.02<br>**65.16**<br>ukr_Cyrl<br>84.11<br>**86.82**|arb_Arab<br>81.29<br>**83.8**<br>ars_Arab<br>81.23<br>**81.5**<br>bel_Cyrl<br>79.82<br>**82.32**<br>dan_Latn<br>83.2<br>**86.9**<br>ell_Grek<br>83.91<br>**86.36**<br>est_Latn<br>85.22<br>**87.48**<br>glg_Latn<br>79.21<br>**82.63**<br>hrv_Latn<br>85.04<br>**87.91**<br>ind_Latn<br>85.61<br>**88.27**<br>lao_Laoo<br>48.57<br>**51.22**<br>lit_Latn<br>84.51<br>**87.16**<br>mar_Deva<br>65.34<br>**68.35**<br>pol_Latn<br>83.65<br>**86.67**<br>rus_Cyrl<br>83.43<br>**86.25**<br>san_Deva<br>63.69<br>**64.82**<br>som_Latn<br>76.32<br>**77.52**<br>spa_Latn<br>79.84<br>**82.72**<br>srp_Cyrl<br>81.37<br>**85.24**<br>tha_Thai<br>83.69<br>**85.28**<br>uig_Arab<br>63.02<br>**65.16**<br>ukr_Cyrl<br>84.11<br>**86.82**|arb_Arab<br>81.29<br>**83.8**<br>ars_Arab<br>81.23<br>**81.5**<br>bel_Cyrl<br>79.82<br>**82.32**<br>dan_Latn<br>83.2<br>**86.9**<br>ell_Grek<br>83.91<br>**86.36**<br>est_Latn<br>85.22<br>**87.48**<br>glg_Latn<br>79.21<br>**82.63**<br>hrv_Latn<br>85.04<br>**87.91**<br>ind_Latn<br>85.61<br>**88.27**<br>lao_Laoo<br>48.57<br>**51.22**<br>lit_Latn<br>84.51<br>**87.16**<br>mar_Deva<br>65.34<br>**68.35**<br>pol_Latn<br>83.65<br>**86.67**<br>rus_Cyrl<br>83.43<br>**86.25**<br>san_Deva<br>63.69<br>**64.82**<br>som_Latn<br>76.32<br>**77.52**<br>spa_Latn<br>79.84<br>**82.72**<br>srp_Cyrl<br>81.37<br>**85.24**<br>tha_Thai<br>83.69<br>**85.28**<br>uig_Arab<br>63.02<br>**65.16**<br>ukr_Cyrl<br>84.11<br>**86.82**|arb_Arab<br>81.29<br>**83.8**<br>ars_Arab<br>81.23<br>**81.5**<br>bel_Cyrl<br>79.82<br>**82.32**<br>dan_Latn<br>83.2<br>**86.9**<br>ell_Grek<br>83.91<br>**86.36**<br>est_Latn<br>85.22<br>**87.48**<br>glg_Latn<br>79.21<br>**82.63**<br>hrv_Latn<br>85.04<br>**87.91**<br>ind_Latn<br>85.61<br>**88.27**<br>lao_Laoo<br>48.57<br>**51.22**<br>lit_Latn<br>84.51<br>**87.16**<br>mar_Deva<br>65.34<br>**68.35**<br>pol_Latn<br>83.65<br>**86.67**<br>rus_Cyrl<br>83.43<br>**86.25**<br>san_Deva<br>63.69<br>**64.82**<br>som_Latn<br>76.32<br>**77.52**<br>spa_Latn<br>79.84<br>**82.72**<br>srp_Cyrl<br>81.37<br>**85.24**<br>tha_Thai<br>83.69<br>**85.28**<br>uig_Arab<br>63.02<br>**65.16**<br>ukr_Cyrl<br>84.11<br>**86.82**|



Table 13: Results on GPT-4o-mini in COMET scores on 37 supported languages from English into other languages.


**Models** **GPT-4o-mini** **DeepSeek-V3** **Qwen2.5-14B-Instruct**
_Tool Selection Accuracy_
Low-frequency partition 0.6053 0.6140 0.6316
High-frequency partition **0.6667** **0.6404** **0.6667**
_Accuracy with Correct Tool Using_
Low-frequency partition 0.4386 0.4649 0.4298
High-frequency partition **0.4912** **0.4737** **0.4474**


Table 14: Results reported in accuracy on the partition of TC. We see that the high-frequency partition gives better
results on all baseline models.


**Models** **kea_Latn** **kik_Latn** **lvs_Latn** **pag_Latn**

_BLEU_

low-frequency 0.9504 0.6983 0.7781 0.9814
high-frequency **1.1528** **0.7257** **1.2053** **1.0204**

_chrF_

low-frequency 28.6936 22.1032 29.0109 29.8830
high-frequency **29.8472** **22.9479** **29.0681** **30.4843**


Table 15: Results of using low-frequency and high-frequency partitions with fine-tuning models with CTFT on
translation from English into other languages. COMET is not reported due to unsupported languages. Results
indicate that prompting with higher-frequency paraphrases on the model tuned with CTFT is still useful.


|Ground-truth<br>Serbian Cyrillic|Две песме из филма су биле номиноване за најбољу оригиналну песму, а то су „Аудиција“ („Будале које<br>сањају“) и „Град звезда“. Лајонсгејт студио је имао 26 номинација — више него било који други студио.|
|---|---|
|High-frequency<br>Input|Two tunes from the film, Audition (The Fools Who Dream) and City of Stars, were in the running for best new<br>tune. Lionsgate studio scored 26 nominations — more than everyone else.|
|High-frequency<br>Output|Два нумера из филма, "Аудиција (Будале које сањају)" и "Град звезда", номинована су за најбољи нови<br>нумер. Студио Лајонсгејт добиоје 26 номинација — више од било ког другог студија.|
|**High-frequency**<br>**Scores**|**bleu：0.6189**<br>**chrf：51.7009**<br>**COMET Score: 0.887192964553833**|
|Low-frequency Input|Two musical selections from the cinematic production, Audition (The Fools Who Dream) and City of Stars, were<br>granted nods for the honor of best original track. Lionsgate production house secured 26 nominations —<br>surpassing all other studios.|
|Low-frequency<br>Output|ве музичке нумере из филмске продукције, Audition (The Fools Who Dream) и City of Stars, добиле су<br>номинације за награду за најбољу оригиналну песму. Продуцентска кућа Lionsgate обезбедилаје 26<br>номинација — надмашивши све остале студије.|
|Low-frequency<br>Scores|bleu：0.4717<br>chrf：36.6703COMET<br>Score: 0.8209505677223206|
|Original Input|Two songs from the movie, Audition (The Fools Who Dream) and City of Stars, received nominations for best<br>original song. Lionsgate studio received 26 nominations — more than any other studio.|
|Original Output|Две песме из филма, Audition (The Fools Who Dream) и City of Stars, добиле су номинације за најбољу <br>оригиналну песму. Студио Lionsgate добиоје 26 номинација — више од било ког другог студија.|
|Original Scores|bleu：0.5230<br>chrf：43.4805<br>COMET Score: 0.8451238870620728|













|Ground-truth<br>Serbian Cyrillic|Подивљала деца су можда доживела тешко злостављање у детињству или трауму пре него што су била<br>напуштена или што су побегла.|
|---|---|
|High-frequency<br>Input|Feral children may have faced severe child abuse or trauma before being deserted or running away.|
|High-frequency<br>Output|Деца дивљачи можда су се суочила са тешким злостављањем или траумом пре него што су напуштена<br>или побегла.|
|**High-frequency**<br>**Scores**|**bleu：0.6358**<br>**chrf：51.1210**<br>**COMET Score: 0.887217104434967**|
|Low-frequency Input|Untamed children may have undergone intense child exploitation or mental harm before their forsaking or<br>escape.|
|Low-frequency<br>Output|Неукрочена деца су можда претрпела интензивну експлоатацију или психичку штету прењиховог<br>напуштања или бекства.|
|Low-frequency<br>Scores|bleu：0.4026<br>chrf：29.9722<br>COMET Score: 0.7990109324455261|
|Original Input|Feral children may have experienced severe child abuse or trauma before being abandoned or running away.|
|Original Output|Деца дивљачи могу да су доживела тешко злостављање или трауму пре напуштања или бега.|
|Original Scores|bleu：0.5045<br>chrf：47.2366<br> COMET Score: 0.7920648455619812|


Figure 6: Case studies on translating following our proposed framework. Best results are bolded and highlighted.


|Language|Correlation|
|---|---|
|ilo_Latn<br>srp_Cyrl<br>bho_Deva<br>lao_Laoo<br>mya_Mymr<br>kab_Latn<br>kas_Deva|0.9278<br>0.8950<br>0.9506<br>1.0000<br>1.0000<br>1.0000<br>1.0000|


Table 16: The correlation between textual frequency
and the final translation BLEU scores on translating
from English into other languages. We compute Pearson
correlation coefficients (Freedman et al., 2007) using
numpy.corrcoef().


**Tasks** **high-freq** **low-freq**

_Math Reasoning_

#. Total 526 526
0.0-1.5 3 60
1.5-2.5 225 418
2.5-3.5 239 45
3.5-4.5 50 3
4.5-5.5 9 0

_Machine Translation_

#. Total 738 738
1.0-1.5 198 73
1.5-2.0 397 402
2.0-2.5 132 216
2.5-3.0 10 41
3.0-3.5 1 6


Table 17: The statistics are based on the TFD calculations: We first statistically calculate the occurrence
frequencies of unigrams and bigrams from both the web
resources and the generated corpus, then assign different weights to the two corpora, and finally calculate the
weighted geometric average of the unigram and bigram
frequencies.

|Model Size|Low|High|
|---|---|---|
|0.5b<br>1.5b<br>3b<br>7b<br>14b<br>32b<br>72b|0.273<br>0.442<br>0.528<br>0.595<br>0.600<br>0.612<br>0.610|0.325<br>0.484<br>0.581<br>0.671<br>0.690<br>0.680<br>0.686|



Table 18: The evaluation on different model sizes using
qwen-2.5. The results are reported on the task of MR.



|Hyperparameter|Value|
|---|---|
|quantization_bit<br>stage<br>do_train<br>fnetuning_type<br>lora_target<br>template<br>cutoff_len<br>max_samples<br>overwrite_cache<br>preprocessing_num_workers<br>logging_steps<br>save_steps<br>per_device_train_batch_size<br>gradient_accumulation_steps<br>learning_rate<br>num_train_epochs<br>lr_scheduler_type<br>warmup_ratio<br>bf16|4<br>sft<br>true<br>lora<br>all<br>qwen<br>1024<br>3000<br>true<br>16<br>10<br>500<br>1<br>8<br>1.0e-4<br>10.0<br>cosine<br>0.1<br>true|


Table 19: A list of hyperparameters used in our finetuning experiments.

|Language Class|Number|
|---|---|
|0<br>1<br>2<br>3<br>4<br>5|16<br>46<br>5<br>17<br>12<br>4|



Table 20: A list of language classes of the 100 languages used in our experiments. More than half of the
languages used in our study are relatively low-resource
according to Joshi et al. (2020).

|Metrics|Low|High|
|---|---|---|
|chrF<br>ROUGE<br>BERTScore|18.823<br>0.175<br>0.492|32.873<br>0.310<br>0.838|



Table 21: The evaluation of the chain-of-thought process on the MR partition of our proposed TFPD dataset.


**A** **Scope and Proof Strategy**


This document provides a self-contained formal proof for the Textual Frequency Law (TFL). The central
claim is:


_When two text sequences express the same meaning (i.e., are paraphrases), the one with higher sentence-_
_level frequency tends to incur a lower negative log-likelihood (NLL) loss under a language model trained_
_via cross-entropy minimisation._


The proof proceeds in two parts. Part I (Section D) establishes the relationship between token-level
NLL loss and token frequency rank under Zipf’s law. Part II (Section E) lifts the token-level result to
the sentence level by introducing a sentence-frequency measure and accounting for the gap between
marginal and conditional token predictions. Section F discusses the relationship between the mathematical
conclusion (loss ordering) and the empirical observation (task performance ordering). Section H catalogues
the limitations of the theoretical framework.
Throughout, all logarithms are natural logarithms (base _e_ ; units: nats).


**B** **Notation**


  - _V_ : vocabulary (finite set of tokens).


  - _w_ : a token in _V_ ; _wr_ denotes the token with frequency rank _r_ ( _r_ = 1 is the most frequent).


  - _P_ ( _w_ ): true marginal probability of token _w_ in the training distribution.


  - _Qθ_ ( _w_ ): marginal probability assigned to token _w_ by a language model with parameters _θ_ .


  - _Qθ_ ( _w_ _| c_ ): conditional probability of _w_ given context _c_ under the autoregressive model.


  - _ℓ_ [m] _θ_ [(] _[w]_ [)][ ≜] _[−]_ [ln] _[ Q][θ]_ [(] _[w]_ [)][:] **[marginal]** [ token-level NLL loss.]

  - _ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [)][ ≜] _[−]_ [ln] _[ Q][θ]_ [(] _[x][k]_ _[|][ x]_ [1] _[, . . ., x][k][−]_ [1][)][:] **[conditional]** [ token-level NLL loss in an autoregressive]
model.


  - _x_ = ( _x_ 1 _, x_ 2 _, . . ., xK_ ): a sentence (token sequence) of length _K_ .

  - _ℓθ_ ( _x_ ) ≜ _K_ 1   - _Kk_ =1 _[ℓ]_ _θ_ [c][(] _[x][k]_ _[|]_ _[x][<k]_ [)][:] [average conditional NLL loss of sentence] _[ x]_ [ — the quantity the]
autoregressive model actually computes.


  - sfreq( _x_ ): sentence-level frequency, defined in Assumption 4.

  - _Z_ = [�] _n_ _[|][V]_ =1 _[ |]_ _[n][−][s]_ [:] [Zipf normalisation constant;] _[ C]_ [≜] [ln] _[ Z]_ _[>]_ [ 0][.]


_Remark_ 1 (Marginal vs. conditional loss) _._ It is essential to distinguish the marginal loss _ℓ_ [m] _θ_ [(] _[w]_ [)][ from the]
conditional loss _ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [)][.] [The Zipf-based analysis in Part I operates on marginal quantities.] [Part II]
bridges to the conditional quantities that autoregressive models actually use, via an explicit error term.


**C** **Assumptions**


We state four formal assumptions that the proof depends on, followed by one contextual remark on the
training objective.


**Assumption 1** (Zipf’s Law for Token Frequencies) **.** The true marginal probability of token _wr_ with rank
_r_ satisfies



_P_ ( _wr_ ) = _[r][−][s]_ _s >_ 0 _,_ _Z_ =

_Z_ _[,]_



_|V |_


_n_ _[−][s]_ _._

_n_ =1



Zipf’s law is a well-documented empirical regularity for the marginal frequency of tokens aggregated
over a large corpus. It characterises the bulk of the vocabulary distribution accurately, though deviations
occur in the extreme tail (very rare tokens). We treat _s_ as a fixed positive constant.


**Assumption 2** (Rank-Dependent Log-Domain Approximation) **.** After training, for every token _wr_ _∈_ _V_
there exists a rank-dependent bound _ε_ ( _r_ ) _≥_ 0 such that

��ln _Qθ_ ( _wr_ ) _−_ ln _P_ ( _wr_ )�� _≤_ _ε_ ( _r_ ) _._ (7)


_Remark_ 2 (Strength and character of Assumption 2) _._ Equation (7) is equivalent to a multiplicative
approximation guarantee:

_e_ _[−][ε]_ [(] _[r]_ [)] _≤_ _[Q][θ]_ [(] _[w][r]_ [)] _∀_ _r._

_P_ ( _wr_ ) _[≤]_ _[e][ε]_ [(] _[r]_ [)] _[,]_


This is a _pointwise_ condition on every token — considerably stronger than merely controlling the expected
cross-entropy loss. Standard cross-entropy training minimises E _w∼P_ [ _−_ ln _Qθ_ ( _w_ )], which controls the
_P_ -weighted average loss but does not, by itself, guarantee pointwise log-domain accuracy for each
individual token.
We expect _ε_ ( _r_ ) to be small for high-frequency tokens (small _r_ ), because these tokens are observed
abundantly during training and the model receives strong gradient signal for them. For low-frequency
tokens (large _r_ ), the model may see very few training examples, and _ε_ ( _r_ ) is expected to grow. All
subsequent results are stated in terms of _ε_ ( _r_ ), so the reader can assess the strength of each conclusion as a
function of the model’s approximation quality at each frequency tier.
Assumption 2 is **not derivable** from the training objective alone. It is an empirical hypothesis about the
outcome of training — motivated by the fact that cross-entropy minimisation encourages _Qθ_ _→_ _P_, but
not logically entailed by it.

**Empirical** **motivation.** Although no existing study directly measures the pointwise bound _ε_ ( _r_ ) as a
function of rank, several independent lines of evidence support the plausibility of Assumption 2:


(a) _LLM_ _token_ _distributions_ _follow_ _Zipf’s_ _law._ Mikhaylovskiy (2025) shows that text generated by
large language models obeys Zipf’s law, though the fit quality depends on decoding temperature.
This indicates that the model’s output distribution _Qθ_ preserves the rank–frequency structure of the
training distribution _P_, a necessary (though not sufficient) condition for small _ε_ ( _r_ ).


(b) _LLMs encode token frequency in their prediction heads._ Kobayashi et al. (2023) demonstrate that the
bias terms in the prediction head of Transformer language models (BERT and GPT-2) significantly
reflect corpus word frequency, effectively encoding a frequency prior consistent with logit adjustment
in long-tail learning. This suggests that the model’s internal mechanism is structured in a way that
facilitates accurate frequency-based predictions.


(c) _Frequency modulates model–human surprisal alignment._ Oh et al. (2024) find that word frequency
systematically modulates the gap between LLM surprisal estimates and human reading times, with
larger models predicting low-frequency words “too accurately” relative to human expectations. This
is consistent with the view that well-trained models achieve small _ε_ ( _r_ ) for high-frequency tokens
and progressively larger errors in the tail.


(d) _Downstream performance correlates with Zipfian fit._ He et al. (2025) show that pre-trained models
consistently achieve optimal downstream performance when the vocabulary size is chosen so that the
resulting token frequency distribution follows Zipf’s law. Their experiments across NLP, genomics,
and chemistry establish a link between Zipfian alignment at the tokenisation level and model quality,
reinforcing the broader premise that power-law regularity in the token distribution — a key ingredient
of Assumption 2 — is conducive to effective language modelling.


These findings collectively support the hypothesis that _ε_ ( _r_ ) is small for high-frequency tokens and grows
with rank, but a direct empirical characterisation of the pointwise bound remains an open problem.


**Assumption** **3** (Bounded Marginal–Conditional Discrepancy) **.** For each token _xk_ in a sentence _x_ =
( _x_ 1 _, . . ., xK_ ), define the **contextual discrepancy** :


_ηxk_ ≜ _ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [)] _[ −]_ _[ℓ]_ [m] _θ_ [(] _[x][k]_ [) = ln] _[ Q][θ]_ [(] _[x][k]_ [)] _[ −]_ [ln] _[ Q][θ]_ [(] _[x][k]_ _[|][ x]_ [1] _[, . . ., x][k][−]_ [1][)] _[.]_


We assume that for each sentence _x_, the average contextual discrepancy is bounded:



_|η_ ¯ _x| ≤_ _ηx,_ where _η_ ¯ _x_ ≜ [1]

_K_



_K_


_ηxk_ _,_

_k_ =1



and _ηx_ _≥_ 0 is a sentence-dependent bound.


_Remark_ 3 (Nature of _ηxk_ ) _._ The sign and magnitude of _ηxk_ depend on how informative the context _x<k_ is
for predicting _xk_ :


  - _ηxk_ _<_ 0: the context makes _xk_ _more_ predictable than its marginal frequency suggests (conditional
probability exceeds marginal). This is typical for high-frequency function words in predictable
contexts (e.g., “of” after “United States”).


  - _ηxk_ _>_ 0: the context makes _xk_ _less_ predictable (e.g., a token that is common in isolation but
surprising in the given context).


  - _ηxk_ _≈_ 0: the context is approximately uninformative for _xk_ .


For sentences composed of common, high-frequency tokens (the “high-frequency paraphrases” central to
TFL), many constituent tokens have highly predictable collocations, so _ηxk_ tends to be negative. This
directional tendency is _favourable_ to TFL: it means the actual conditional loss is systematically lower
than the marginal-based estimate for high-frequency sentences. However, we do not rely on this tendency
in the proof; instead, we use the conservative absolute bound _|η_ ¯ _x| ≤_ _ηx_ .
Note that _ηx_ is **sentence-dependent** : different sentences may have different bounds. We do not assume
a single universal bound across all sentences.


**Assumption 4** (Sentence Frequency via Geometric Mean of Token Frequencies) **.** The sentence-level
frequency of _x_ = ( _x_ 1 _, . . ., xK_ ) is defined as


�� _[K]_ �1 _/K_
sfreq( _x_ ) ≜ _P_ ( _xk_ ) _,_


_k_ =1


or equivalently in log-space:



ln sfreq( _x_ ) = [1]

_K_



_K_


ln _P_ ( _xk_ ) _._ (8)

_k_ =1



This definition treats sentence frequency as the geometric mean of marginal token frequencies, corresponding to a unigram model for the sentence probability. It ignores word order and inter-token
dependencies, which is a deliberate simplification: the goal is a tractable frequency measure that correlates
with how “common” the constituent vocabulary of a sentence is. For comparing paraphrases with identical
meaning but different word choices, this measure captures precisely the relevant variation — the frequency
tier of the vocabulary used.


_Remark_ 4 (Role of the training objective) _._ Standard language model training minimises the expected
negative log-likelihood: min _θ_ E _w∼P_ [ _−_ ln _Qθ_ ( _w_ )]. This training objective _motivates_ Assumption 2: under
ideal conditions with sufficient capacity and data, the minimiser satisfies _Qθ_ ( _w_ ) = _P_ ( _w_ ) for all _w_,
which would give _ε_ ( _r_ ) = 0 everywhere. In practice, finite data and model capacity lead to nonzero _ε_ ( _r_ ),
particularly for low-frequency tokens. The training objective does **not** appear as a formal assumption
because the proof does not directly invoke it; it serves as the background justification for why Assumption 2
is plausible.


**D** **Part I: Token-Level Results**


**D.1** **Step 1:** **Self-Information under Zipf’s Law**


By Assumption 1, the self-information (ideal NLL) of token _wr_ is




      - _r−s_

_−_ ln _P_ ( _wr_ ) = _−_ ln

_Z_







= _−_ ( _−s_ ln _r −_ ln _Z_ )


= _s_ ln _r_ + ln _Z._ (9)


Setting _C_ ≜ ln _Z_ _>_ 0:

_−_ ln _P_ ( _wr_ ) = _s_ ln _r_ + _C._ (10)


This shows that the ideal NLL is _affine_ in ln _r_ with slope _s_ and intercept _C_ .


**D.2** **Step 2:** **Model Loss Bounded by Approximation Error**


By Assumption 2:
_−ε_ ( _r_ ) _≤_ ln _Qθ_ ( _wr_ ) _−_ ln _P_ ( _wr_ ) _≤_ _ε_ ( _r_ ) _._


Multiplying through by _−_ 1 (which reverses the inequalities):


_−_ ln _P_ ( _wr_ ) _−_ _ε_ ( _r_ ) _≤−_ ln _Qθ_ ( _wr_ ) _≤−_ ln _P_ ( _wr_ ) + _ε_ ( _r_ ) _._


Defining _ℓ_ [m] _θ_ [(] _[w][r]_ [)][ ≜] _[−]_ [ln] _[ Q][θ]_ [(] _[w][r]_ [)][, we can write:]


_ℓ_ [m] _θ_ [(] _[w][r]_ [) =] _[ −]_ [ln] _[ P]_ [(] _[w][r]_ [) +] _[ δ][w]_ _r_ _[,]_ _|δwr_ _| ≤_ _ε_ ( _r_ ) _,_ (11)


where _δwr_ ≜ _−_ ln _Qθ_ ( _wr_ ) _−_ ( _−_ ln _P_ ( _wr_ )) = ln _P_ ( _wr_ ) _−_ ln _Qθ_ ( _wr_ ) is the signed approximation error
for token _wr_ .


**D.3** **Step 3:** **Semi-Log Linear Relationship**


Substituting (10) into (11):


_ℓ_ [m] _θ_ [(] _[w][r]_ [) =] _[ s]_ [ ln] _[ r]_ [ +] _[ C]_ [ +] _[ δ][w]_ _r_ _[,]_ _|δwr_ _| ≤_ _ε_ ( _r_ ) _._ (12)


**Theorem 1** (Token-Level Semi-Log Linearity) **.** _Under Assumptions 1 and 2, the marginal token-level_
_NLL loss satisfies_
_ℓ_ [m] _θ_ [(] _[w][r]_ [) =] _[ s]_ [ ln] _[ r]_ [ +] _[ C]_ [ +] _[ δ][w]_ _r_ _[,]_ _|δwr_ _| ≤_ _ε_ ( _r_ ) _,_

_where s >_ 0 _is the Zipf exponent and C_ = ln _Z_ _>_ 0 _._ _In the semi-log plane (x-axis:_ ln _r; y-axis:_ _ℓ_ [m] _θ_ _[), the]_
_relationship is linear with slope s and intercept C, within a rank-dependent error band of half-width ε_ ( _r_ ) _._


_Proof._ Immediate from the chain of equalities in Steps 1–3.


_Remark_ 5 (Semi-log vs. log-log) _._ Equation (12) is a _semi-log_ linear relationship ( _ℓ_ [m] _θ_ [is affine in][ ln] _[ r]_ [),] **[ not]**
a log-log relationship (which would require ln _ℓ_ [m] _θ_ [to be affine in][ ln] _[ r]_ [, i.e., a power law for the loss itself).]


**D.4** **Token-Level Monotonicity**


**Theorem 2** (Sufficient Condition for Strict Token-Level Monotonicity) **.** _Let wi, wj_ _be two tokens with_
_ri_ _< rj_ _(i.e., P_ ( _wi_ ) _> P_ ( _wj_ ) _)._ _A sufficient condition for ℓ_ [m] _θ_ [(] _[w][i]_ [)] _[ < ℓ]_ _θ_ [m][(] _[w][j]_ [)] _[ is]_




      - _rj_
_ε_ ( _ri_ ) + _ε_ ( _rj_ ) _< s_ ln
_ri_




_._ (13)



_In the special case of a uniform bound ε_ ( _r_ ) _≡_ _ε, this reduces to_


_rj_

_> e_ [2] _[ε/s]_ _._ (14)
_ri_


_Proof._ We require the worst-case upper bound of _ℓ_ [m] _θ_ [(] _[w][i]_ [)][ to be strictly less than the worst-case lower]
bound of _ℓ_ [m] _θ_ [(] _[w][j]_ [)][:]

             - _s_ ln _ri_ + _C_ + _ε_ ( _ri_ )� _<_             - _s_ ln _rj_ + _C −_ _ε_ ( _rj_ )� _._


Cancelling _C_ and rearranging:




                   - _rj_
_ε_ ( _ri_ ) + _ε_ ( _rj_ ) _< s_ (ln _rj_ _−_ ln _ri_ ) = _s_ ln
_ri_


When _ε_ ( _r_ ) _≡_ _ε_, this becomes 2 _ε < s_ ln( _rj/ri_ ), i.e., _rj/ri_ _> e_ [2] _[ε/s]_ .




_._



_Remark_ 6 (When monotonicity fails) _._ For adjacent-rank tokens ( _rj_ = _ri_ +1), the rank ratio is 1+1 _/ri_ _→_ 1
as _ri_ _→∞_, so the left-hand side of (13) approaches zero while the right-hand side remains positive but
also approaches zero (as ln(1 + 1 _/ri_ ) _≈_ 1 _/ri_ ). Condition (13) fails whenever the approximation error
exceeds the Zipf-induced gap. Strict ordering between tokens of similar frequency **cannot be guaranteed**
in the tail of the distribution. This is an inherent limitation: cross-entropy training provides diminishing
approximation quality for rarer tokens.


**E** **Part II: Sentence-Level Extension**


This part bridges the token-level results to the sentence level.


**E.1** **Setup**

Let _x_ = ( _x_ 1 _, . . ., xK_ ) and _x_ _[′]_ = ( _x_ _[′]_ 1 _[, . . ., x][′]_ _K_ _[′]_ [)][ be two sentences.] [Their sentence-level losses (as computed]
by an autoregressive model) are



_ℓθ_ ( _x_ ) = [1]

_K_



_ℓθ_ ( _x_ _[′]_ ) = [1]

_K_ _[′]_



_K_


_ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [)] _[,]_ (15)
_k_ =1

_K_ _[′]_


_ℓ_ [c] _θ_ [(] _[x][′]_ _k_ _[|][ x]_ _<k_ _[′]_ [)] _[.]_ (16)
_k_ =1



Their log sentence-frequencies under Assumption 4 are



ln sfreq( _x_ ) = [1]

_K_



_K_






ln _P_ ( _xk_ ) _,_ ln sfreq( _x_ _[′]_ ) = [1]

_K_

_k_ =1



_K_ _[′]_



_K_ _[′]_


ln _P_ ( _x_ _[′]_ _k_ [)] _[.]_
_k_ =1



Note that _−_ ln sfreq( _x_ ) = _K_ [1]  - _Kk_ =1 [(] _[−]_ [ln] _[ P]_ [(] _[x][k]_ [))][, i.e., the negative log sentence-frequency equals the]

average ideal marginal NLL.


**E.2** **Step 4:** **Decomposing Sentence-Level Loss**


For each token _xk_ with rank _rk_, the conditional loss can be decomposed as follows:



_ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [) =] _−_ ln _P_ ( _xk_ )

        - ��         ideal marginal NLL



+ _δxk_
����
marginal approx. error



+ _ηxk_ _,_ (17)
����
contextual discrepancy



where:


  - _δxk_ = _ℓ_ [m] _θ_ [(] _[x][k]_ [)] _[ −]_ [(] _[−]_ [ln] _[ P]_ [(] _[x][k]_ [)) = ln] _[ P]_ [(] _[x][k]_ [)] _[ −]_ [ln] _[ Q][θ]_ [(] _[x][k]_ [)][, with] _[ |][δ][x]_ _k_ _[| ≤]_ _[ε]_ [(] _[r][k]_ [)][ by Assumption][ 2][;]


  - _ηxk_ = _ℓ_ [c] _θ_ [(] _[x][k]_ _[|]_ _[x][<k]_ [)] _[ −]_ _[ℓ]_ [m] _θ_ [(] _[x][k]_ [)] [=] [ln] _[ Q][θ]_ [(] _[x][k]_ [)] _[ −]_ [ln] _[ Q][θ]_ [(] _[x][k]_ _[|]_ _[x][<k]_ [)][, the contextual discrepancy from]
Assumption 3.


_Verification._ Adding the three terms on the right-hand side of (17):


_−_ ln _P_ ( _xk_ ) + [ln _P_ ( _xk_ ) _−_ ln _Qθ_ ( _xk_ )] + [ln _Qθ_ ( _xk_ ) _−_ ln _Qθ_ ( _xk_ _| x<k_ )]

(18)
= _−_ ln _Qθ_ ( _xk_ _| x<k_ ) = _ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [)] _[.]_ ✓


Averaging (17) over all tokens in _x_ :



_ℓθ_ ( _x_ ) = [1]

_K_



_._ (19)



= [1]

_K_



_K_


_ℓ_ [c] _θ_ [(] _[x][k]_ _[|][ x][<k]_ [)]
_k_ =1


_K_


( _−_ ln _P_ ( _xk_ ))

_k_ =1



_K_



+ [1]



_K_




_K_




+ [1]



_K_ _ηxk_

_k_ =1

- �� _η_ ¯ _x_



_K_




             - ��              = _−_ ln sfreq( _x_ )


Define the average marginal approximation bound:



_K_ _δxk_

_k_ =1

- �� _δ_ ¯ _x_



_ε_ ¯ _x_ ≜ [1]

_K_



_K_


_ε_ ( _rk_ ) _._

_k_ =1



By the triangle inequality, _|δ_ [¯] _x| ≤_ _ε_ ¯ _x_ . By Assumption 3, _|η_ ¯ _x| ≤_ _ηx_ .
Therefore:
_ℓθ_ ( _x_ ) = _−_ ln sfreq( _x_ ) + _δ_ [¯] _x_ + ¯ _ηx,_ _|δ_ [¯] _x| ≤_ _ε_ ¯ _x,_ _|η_ ¯ _x| ≤_ _ηx._ (20)


_Remark_ 7 (Tightness of the bound after averaging) _._ The bound _|δ_ [¯] _x| ≤_ _ε_ ¯ _x_ is worst-case (triangle inequality).
If the token-level errors _δxk_ have approximately zero mean and are weakly c _√_ orrelated across positions, a
central-limit-type argument gives the tighter practical estimate _|δ_ [¯] _x| ≈_ _O_ (¯ _εx/_ _K_ ). Similarly for _η_ ¯ _x_ . Thus



central-limit-type argument gives the tighter practical estimate _|δx| ≈_ _O_ (¯ _εx/_ _K_ ). Similarly for _η_ ¯ _x_ . Thus

the sufficient conditions derived below are conservative; in practice, the effective threshold for the TFL to
_√_
hold is likely smaller by a factor on the order of 1 _/_ _K_ .



_K_ .



**E.3** **Sentence-Level Results**


**Theorem** **3** (Sentence-Level Loss–Frequency Relationship) **.** _Under_ _Assumptions_ _1,_ _2,_ _3,_ _and_ _4,_ _the_
_sentence-level NLL loss satisfies_


_ℓθ_ ( _x_ ) = _−_ ln sfreq( _x_ ) + _δ_ [¯] _x_ + ¯ _ηx,_


_with_ _|δ_ [¯] _x_ + _η_ ¯ _x|_ _≤_ _ε_ ¯ _x_ + _ηx._ _That is,_ _the sentence-level loss is approximately equal to the negative log_
_sentence-frequency, up to a total error bounded by_ _ε_ ¯ _x_ + _ηx._


_Proof._ Equation (19) gives the exact decomposition. By the triangle inequality:


_|δ_ [¯] _x_ + ¯ _ηx| ≤|δ_ [¯] _x|_ + _|η_ ¯ _x| ≤_ _ε_ ¯ _x_ + _ηx._


**Theorem 4** (Textual Frequency Law — Sufficient Condition) **.** _Let x and x_ _[′]_ _be two paraphrases with_
sfreq( _x_ ) _>_ sfreq( _x_ _[′]_ ) _._ _A sufficient condition for ℓθ_ ( _x_ ) _< ℓθ_ ( _x_ _[′]_ ) _is_


ln [sfreq(] _[x]_ [)] [+] _[ η][x][′]_ [)] _[,]_ (21)

sfreq( _x_ _[′]_ ) _[>]_ [ (¯] _[ε][x]_ [ +] _[ η][x]_ [) + (¯] _[ε][x][′]_


_where_ _ε_ ¯ _x, ηx and_ _ε_ ¯ _x′, ηx′_ _are the approximation and contextual error bounds for x and x_ _[′]_ _, respectively._


_Proof._ By Theorem 3, the worst-case upper bound on _ℓθ_ ( _x_ ) and worst-case lower bound on _ℓθ_ ( _x_ _[′]_ ) are:


_ℓθ_ ( _x_ ) _≤−_ ln sfreq( _x_ ) + (¯ _εx_ + _ηx_ ) _,_

_ℓθ_ ( _x_ _[′]_ ) _≥−_ ln sfreq( _x_ _[′]_ ) _−_ (¯ _εx′_ + _ηx′_ ) _._


It suffices to require the upper bound on _ℓθ_ ( _x_ ) to be strictly less than the lower bound on _ℓθ_ ( _x_ _[′]_ ):


_−_ ln sfreq( _x_ ) + (¯ _εx_ + _ηx_ ) _< −_ ln sfreq( _x_ _[′]_ ) _−_ (¯ _εx′_ + _ηx′_ ) _._


Rearranging (add ln sfreq( _x_ ) and (¯ _εx′_ + _ηx′_ ) to both sides):


(¯ _εx_ + _ηx_ ) + (¯ _εx′_ + _ηx′_ ) _<_ ln sfreq( _x_ ) _−_ ln sfreq( _x_ _[′]_ ) = ln [sfreq(] _[x]_ [)]

sfreq( _x_ _[′]_ ) _[,]_


which is precisely condition (21).


_Remark_ 8 (Sufficient, not necessary) _._ Condition (21) is a sufficient condition. The TFL may hold even
when this condition is not met, because:


(i) The worst-case bounds are conservative — actual errors may partially cancel rather than compound.


(ii) The averaging effect across _K_ tokens (Remark 7) typically yields a much tighter effective error, on
_√_
the order of (¯ _εx_ + _ηx_ ) _/_ _K_ .


(iii) For high-frequency paraphrases, the contextual discrepancy _η_ ¯ _x_ tends to be negative (Remark 3),
which further reduces the actual sentence loss below the worst-case bound.


_Remark_ 9 (Practical magnitude of the condition) _._ The condition requires the log frequency ratio of the
two paraphrases to exceed the sum of all error bounds. In practice, paraphrases constructed by substituting
a few content words (e.g., “deserted” _→_ “abandoned”) while sharing most function words (“the”, “was”,
“in”) differ modestly in sentence frequency. Whether (21) is satisfied depends on:


  - How many tokens differ, and how large the frequency gap is for those tokens.


  - The model’s approximation quality ( _ε_ ( _r_ )) at the relevant frequency tiers.


  - The magnitude of the marginal–conditional discrepancy ( _η_ ).


The theorem provides the analytical framework; the empirical validation in the main paper demonstrates
that the TFL holds in practice across a wide range of settings, suggesting that the error terms are typically
small enough for the condition to be effectively met.


**F** **Discussion:** **From Loss Ordering to Task Performance**


Theorems 3 and 4 establish that, under the stated assumptions, higher-frequency paraphrases incur lower
NLL loss. The empirical claim of the Textual Frequency Law is stronger: higher-frequency paraphrases
lead to better _task performance_ (e.g., higher accuracy in math reasoning, higher BLEU/chrF in machine
translation). Bridging this gap requires additional reasoning that we outline here.


**For prompting.** When an LLM is prompted with input _x_, the model generates output _y_ = ( _y_ 1 _, . . ., yT_ )
by sampling from or maximising the conditional distribution _Qθ_ ( _y_ _| x_ ). Lower NLL loss on _x_ means the
model assigns higher probability to the token sequence _x_ . This implies that _x_ falls in a region of the input
space where the model’s internal representations are better calibrated — having been shaped by more
training examples with similar token distributions. An input that the model “understands” better (assigns
higher probability to) is more likely to activate the correct reasoning pathways and produce accurate
outputs. This argument is plausible and consistent with the empirical evidence, but it is not a formal proof:
the relationship between input perplexity and output quality depends on the model’s internal mechanism,
which is not captured by our framework.


**For fine-tuning.** In fine-tuning, the model optimises [�] _n_ [log] _[ Q][θ]_ [(] _[y][n]_ _[|][ x][n]_ [)][ over training pairs][ (] _[x][n][, y][n]_ [)][.]
If the model already assigns higher probability to the input tokens of high-frequency paraphrases, the
gradient signal from these examples is more stable and the effective learning rate for the output mapping
is higher. Additionally, high-frequency inputs are closer to the pre-training distribution, reducing the risk
of catastrophic forgetting.


**Status of this argument.** The connection from loss ordering to task performance is an **empirically**
**motivated hypothesis**, not a theorem. The formal contribution of this proof is the loss ordering result
(Theorem 4). The task performance connection is supported by extensive experiments in the main paper.


**G** **Summary of Results**


**Result** **Equation** **Assumptions Used**


Token semi-log linearity (Thm. 1) (12) 1, 2


Token strict monotonicity (Thm. 2) (13) 1, 2


Sentence loss–frequency (Thm. 3) (20) 1, 2, 3, 4


TFL sufficient condition (Thm. 4) (21) 1, 2, 3, 4


**H** **Limitations**


We catalogue the limitations of the theoretical framework for full transparency.


1. **Assumption 2 is not derivable from the training objective.** The pointwise log-domain approximation guarantee is stronger than what cross-entropy minimisation alone can ensure. Cross-entropy
training controls the _P_ -weighted expected loss, not the per-token log-domain error. The assumption
is empirically motivated but remains a hypothesis about the outcome of training. For low-frequency
tokens, _ε_ ( _r_ ) may be large, and the theorem’s guarantees weaken accordingly. While several studies
provide indirect support for the plausibility of this assumption (see Remark 2), a direct empirical
measurement of the pointwise bound _ε_ ( _r_ ) as a function of rank remains an open problem in the
literature.


2. **Contextual discrepancy** _ηx_ **is difficult to estimate.** The magnitude of _ηxk_ depends on the specific
sentence context and the model’s learned conditional distributions. No general data-independent
bound is available. In the proof, _ηx_ is treated as an axiomatically bounded quantity. Empirically, one
could estimate _ηx_ by comparing marginal and conditional perplexities on a held-out corpus, but such
estimates would be model- and data-specific.


3. **The sentence frequency measure is a unigram approximation.** The geometric-mean definition
(Assumption 4) ignores word order and inter-token dependencies. For paraphrase pairs that differ
mainly in word choice (not syntactic structure), this is a reasonable proxy. For paraphrases with
substantially different syntactic structures or lengths, the measure may not fully capture the relevant
notion of “commonness.”


4. **Sentence length differences.** When two paraphrases have different lengths _K_ = _K_ _[′]_, the averaging
effect differs: a longer sentence averages over more tokens, which may tighten or loosen the effective
error bounds. This interaction is not explicitly modelled; the theorem treats _ε_ ¯ _x_ and _ηx_ as given
quantities.


5. **Loss ordering does not formally imply task performance ordering.** The proven result is _ℓθ_ ( _x_ ) _<_
_ℓθ_ ( _x_ _[′]_ ) (lower NLL loss for higher-frequency paraphrases). The claim that this translates to better
downstream task performance (higher accuracy, higher BLEU) is empirically supported but not
formally established within this framework. See Section F for further discussion.


6. **Semantic equivalence is assumed, not verified.** The TFL compares paraphrases with “the same
meaning.” The proof assumes perfect semantic equivalence; in practice, paraphrasing inevitably
introduces subtle meaning shifts. A formal treatment would require a semantic similarity metric,
which is beyond the scope of a frequency-based theorem.


7. **Zipf’s law is approximate in the tail.** The power-law model fits well for the bulk of the vocabulary
but may deviate for extremely rare tokens. Such deviations are absorbed into _ε_ ( _r_ ) in the analysis,
but this means the error bound for tail tokens reflects both the model’s approximation error and the
inadequacy of the Zipf model itself.


**I** **Conclusion**


This document has established, under clearly stated assumptions, that:


(i) Token-level NLL loss is semi-log linear in frequency rank (Theorem 1).


(ii) Sentence-level NLL loss is approximately equal to the negative log sentence-frequency, with a
bounded error term (Theorem 3).


(iii) When the sentence-frequency ratio between two paraphrases is sufficiently large relative to the error
bounds, the higher-frequency paraphrase provably has lower model loss (Theorem 4).


These results provide the theoretical foundation for the Textual Frequency Law. The sufficient condition
is conservative; empirical evidence in the main paper demonstrates that the TFL holds broadly in practice,
consistent with the error terms being small enough for the condition to be effectively satisfied in typical
settings.


