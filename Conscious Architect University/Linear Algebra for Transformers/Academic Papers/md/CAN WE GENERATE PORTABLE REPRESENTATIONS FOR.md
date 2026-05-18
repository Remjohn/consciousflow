Published as a conference paper at ICLR 2026

## CAN WE GENERATE PORTABLE REPRESENTATIONS FOR
### CLINICAL TIME SERIES DATA USING LLMS?


**Zongliang Ji** _[∗]_ [1] _[,]_ [3] **, Yifei Sun** _[∗]_ [1] _[,]_ [3] **, Andre Amaral** [1] _[,]_ [2] **, Anna Goldenberg** [1] _[,]_ [3] **, Rahul G. Krishnan** [1] _[,]_ [3]

1University of Toronto, Canada, 2Sunnybrook Health Sciences Centre, Canada,
3Vector Institute, Canada
_{_ jerryji, rahulgk _}_ @cs.toronto.edu


ABSTRACT


Deploying clinical ML is slow and brittle: models that work at one hospital often
degrade under distribution shifts at the next. In this work, we study a simple question – can large language models (LLMs) create _portable_ patient embeddings i.e.
representations of patients enable a downstream predictor built on one hospital to
be used elsewhere with minimal-to-no retraining and fine-tuning. To do so, we
map from irregular ICU time series onto concise natural language summaries using a frozen LLM, then embed each summary with a frozen text embedding model
to obtain a fixed length vector capable of serving as input to a variety of downstream predictors. Across three cohorts (MIMIC-IV, HIRID, PPICU), on multiple
clinically grounded forecasting and classification tasks, we find that our approach
is simple, easy to use and competitive with in-distribution with grid imputation,
self-supervised representation learning, and time series foundation models, while
exhibiting smaller relative performance drops when transferring to new hospitals. We study the variation in performance across prompt design, with structured
prompts being crucial to reducing the variance of the predictive models without altering mean accuracy. We find that using these portable representations improves
few-shot learning and does not increase demographic recoverability of age or sex
relative to baselines, suggesting little additional privacy risk. Our work points to
the potential that LLMs hold as tools to enable the scalable deployment of production grade predictive models by reducing the engineering overhead [1] .


1 INTRODUCTION


Clinical machine learning tools continue to be deployed one site at a time. Teams build a model
at Hospital A, run a silent trial, tune thresholds and features, and only then attempt deployment.
The process is repeated at Hospital B. Each iteration introduces distribution, population, and incidence shift as laboratory measurement policies, case mix, and disease prevalence change that can
degrade model performance. These changes inflate time to deployment, lengthen validation time
and calibration cycles, and slow the delivery of benefit to patients.


The status quo in healthcare treats the _model_ as the object that is transferrable across institutions.
Interoperability standards such as OMOP and FHIR reduce data wrangling but do not guarantee an
input representation that will remain predictive when moved to a new site. Domain adaptation and
invariant risk minimization typically adapt the model to the target hospital, which preserves accuracy
at the cost of additional data, labels, and calibration. Foundation models trained on electronic health
records improve in-distribution performance and reduce task-specific engineering, yet they are often coupled to a particular sensor schema or sampling profile, and model transfer across sites still
requires tuning. In short, current solutions standardize data formats, sometimes stripping clinically
salient context, or recalibrate models.


We adopt a complementary thesis: _portable_ _input_ _representations_ _enable_ _portable_ _models_ . i.e. if
heterogeneous electronic medical records can be mapped into a semantically aligned, site-agnostic
interface, then conventional predictors will require substantially less site-specific adaptation. Rather


[1Code is available at https://github.com/Jerryji007/Record2Vec-ICLR2026](https://github.com/Jerryji007/Record2Vec-ICLR2026)


1


Published as a conference paper at ICLR 2026


Figure 1: Motivation for Record2Vec. Numeric imputation loses clinical semantics and limits portability; human handoffs preserve meaning but are costly and variable. LLMs can create handoff-style
summaries that retain semantics and provide portable inputs for forecasting and classification.


than forcing each hospital’s raw schema into a shared syntactic format, we aim to produce a shared
semantic representation.


Clinicians already solve an analogous problem. When assuming care for a new patient or starting
a new shift, physicians interpret heterogeneous measurements through structured narrative handoffs
that foreground clinically salient context while abstracting away measurement idiosyncrasies. We
investigate whether large language models (LLMs) can analogously transform irregular multivariate patient histories into consistent, handoff-style summaries that serve as a portable intermediate
representation.


Concretely, we instantiate this idea with a summarize-then-embed pipeline. For each patient window, a frozen LLM converts the irregular time-series record into a concise natural-language summary. A frozen text embedding model then maps that summary into a fixed-length vector consumed
by standard forecasting and classification models without architectural modification.


This design leverages several properties of language models. First, summarization operates in a semantic space rather than a schema-bound numeric space, allowing normalization of units, resolution
of synonyms, and abstraction over site-specific coding artifacts. Second, natural language provides
a common representational substrate that aligns heterogeneous sampling policies and missingness
patterns into comparable clinical concepts. Third, fixed-length embeddings standardize the downstream interface, simplifying training budgets and enabling zero- or few-shot transfer. Freezing both
the summarizer and embedder further constrains overfitting to site-specific artifacts and improves
reproducibility by decoupling representation learning from downstream optimization.


Our contributions are threefold:


- We rethink how machine learning in healthcare should operate via a deployment-first framing of
prediction that focuses on creating portable input representations for healthcare, aiming to reduce
per-site engineering and calibration.


- We present Record2Vec, a practical summarize-then-embed pipeline using frozen language models to transform irregular ICU histories into fixed-length vectors consumed by standard predictors
without architectural changes.


- We conduct a multi-site evaluation across three cohorts and multiple tasks showing that the learned
representations are competitive in-distribution, more portable across hospitals, more data-efficient,
and match or improve on privacy preservation relative to established pipelines.


2 RELATED WORK


**Clinical** **schema** **and** **harmonization.** Common data models and interoperability standards such
as OMOP and HL7 FHIR have substantially reduced extract–transform–load burden and enabled
multi–institutional reuse of EHRs through shared schemas, vocabularies, and APIs (Stang et al.,
2010; Bender & Sartipi, 2013; Reich et al., 2024; Vorisek et al., 2022; Tabari et al., 2024). While
effective for data sharing and governance, these frameworks standardize _format_ rather than learn
task–optimized, site–invariant representations for predictive modeling.


2


Published as a conference paper at ICLR 2026


Figure 2: Methods to generate medical-record representations. Top to bottom: imputation pipeline;
self-supervised TS representation (TSDE); TS foundation model (TimesFM); and Record2Vec:
LLM summary followed by text embedding.


**Domain** **shift,** **generalization,** **and** **adaptation.** A large literature addresses distribution shift
by adapting model parameters to target environments. Domain–adversarial training encourages
site–invariant features via a domain classifier (Ganin & Lempitsky, 2016); correlation alignment matches second–order statistics across domains (Sun & Saenko, 2016). Domain generalization methods such as invariant risk minimization seek predictors stable across environments (Arjovsky et al., 2019; Subbaswamy et al., 2022), and distributionally robust optimization emphasizes
worst–case groups to improve reliability under shift (Sagawa et al., 2020). These approaches are
model–centric, often requiring environment labels, target–site data, or careful tuning. In contrast,
we study _input_ _level_ portability by learning a site–agnostic representation that standard predictors
can consume without architectural changes.


**EHR and** **self–supervised representation learning.** Representation learning on structured EHRs
and clinical time series has advanced rapidly. BEHRT pretrains Transformers over longitudinal
code sequences to learn patient timelines (Li et al., 2020b; Steinberg et al., 2020). Recent surveys
review concept and patient–level embeddings for EHRs (Kauffman et al., 2025). Time–series foundation models pretrained at scale demonstrate strong zero–/few–shot forecasting, notably TimesFM
(Das et al., 2024). Diffusion–style self–supervision for general time–series representation learning,
such as TSDE, learns versatile embeddings via imputation–interpolation–forecasting masking with
dual–encoder Transformers (Senane et al., 2024). These are strong baselines; however, portability
and deployment cost across hospitals are rarely treated as first–class evaluation endpoints.


**LLMs for clinical summarization and structuring.** Large language models have been applied to
clinical summarization and structuring tasks. Adapted LLMs can outperform experts on multiple
clinical text summarization tasks (Van Veen et al., 2024), and there is growing guidance on prompt
design for medical use (Zaghir et al., 2024). Evaluations of medical evidence summarization further
characterize strengths and limitations (Tang et al., 2023). Beyond notes, scoping reviews document
integrating standardized terminologies like SNOMED CT with LLMs for normalization and coding
(Chang & Sung, 2024; Luo et al., 2020). While prior work uses LLMs for text summarization or
coding, we repurpose them as an _information_ _transformation_ _layer_ for numeric ICU time series,
bridging structured and unstructured modalities.


Recent research investigates serializing structured EHR data for LLM processing. Approaches like
TabLLM (Hegselmann et al., 2023) and DeLLiriuM (Contreras et al., 2025) fine-tune LLMs on
text to perform direct prediction. Other studies (Lee et al., 2025; Gao et al., 2024; Hegselmann
et al., 2025) use frozen models to embed raw data serializations. A critical distinction lies in our
deployment philosophy. These prior methods optimize the model pipeline and often require the
transfer of site-tuned LLMs. In contrast, our approach focuses on preparing a transferable input
representation _X_ . We use a standard and locally deployed frozen LLM to summarize dense timeseries data. This step normalizes site-specific artifacts at the data level. Consequently, hospitals
can generate portable representations that allow any lightweight downstream classifier to function
effectively without porting entire end-to-end model pipelines.


3 METHODOLOGY AND SETUP


We design a controlled study to test whether natural language can serve as an _information_ _trans-_
_formation_ _layer_ that yields _portable_ _inputs_ for ICU prediction, formalizing sites, inputs, and tasks


3


Published as a conference paper at ICLR 2026


across four method families, three ICU cohorts, and seven prediction tasks, and presenting our
Record2Vec pipeline with baselines, data, and evaluation.


**Problem formalization.** Let sites be _S_ _∈{_ MIMIC-IV _,_ HiRID _,_ PPICU _}_ . For a stay _i_ at site _s_, the
irregular ICU record over a 48-hour window is _R_ [(] _i_ _[s]_ [)] = _{_ ( _c, {_ ( _tk, vk_ ) _}_ _[K]_ _k_ =1 _[c]_ [) :] _[ c][ ∈C]_ [(] _[s]_ [)] _[}]_ [, a dictionary]
from clinical concepts _c_ to time–value pairs ( _tk, vk_ ) observed in the window. We consider methods
that transform _R_ [(] _i_ _[s]_ [)] into either (i) a regular _grid_ _Xi_ _∈_ R _[D]_ [(] _[s]_ [)] _[×][T]_ with _T_ = 48 hours, or (ii) a fixedlength _vector zi_ _∈_ R _[d]_ . A downstream predictor _fθ_ maps inputs to task labels _yi_ across standard ICU
outcomes spanning different label-prevalence regimes.

3.1 RECORD2VEC


We treat language as an information transformation layer. Given the 48h irregular record _R_ [(] _i_ _[s]_ [)] for
stay _i_ at site _s_, Record2Vec first produces a concise clinical summary and then embeds that summary
into a fixed-length vector used by shared decoders.


**Summarization.** A frozen LLM _gϕ_ maps each irregular window and a prompt _π_ to a concise
summary, i.e., text _i_ = _gϕ_ ( _R_ [(] _i_ _[s]_ [)] _[, π]_ [)][.] [We] [compare] _[structured]_ [slot-based] [prompts] [that] [elicit] [vitals,]
labs, therapies, trajectories, salient events, and gaps with _free-form_ prompts that request a short
narrative of states and trends. We evaluate three summarizers representing different deployment
regimes: a large general model (Gemini-2.0 Flash Comanici et al. (2025)), a clinically tuned model
(MedGemma Sellergren et al. (2025)), and a small open model (Llama-3.1 Dubey et al. (2024)). All
LLMs remain frozen without finetuning.


**Embedding.** A frozen text encoder _hψ_ maps the summary to a fixed-length vector used by downstream predictors, _zi_ = _hψ_ (text _i_ ) _∈_ R _[d]_ . Unless noted, we use Qwen3 text-embedding as _hψ_
2 As a no-summarization control, we also embed a canonical serialization of the record directly
_zi_ [direct] = _hψ_ (serialize( _R_ [(] _i_ _[s]_ [)][))][.]
3.2 BASELINES


We compare Record2Vec to three strong families used for ICU time series, plus the direct-embed
control.

- **Grid** **imputation** **pipelines.** Irregular records are discretized into hourly grids _X_ _∈_ R _[D]_ [(] _[s]_ [)] _[×]_ [48],
then completed via (a) mean fill, (b) right-shift carry-forward, or (c) linear interpolation. Completed grids feed the shared decoders for forecasting, regression, and classification. Per-cohort
normalization uses training-split statistics and is applied only to grid methods.

- **Self-supervised** **representation** **learning** **(TSDE).** Time-Series Diffusion Embedding
(TSDE) (Senane et al., 2024) learns general-purpose embeddings via masked imputation/interpolation/forecasting objectives. We train TSDE on each cohort’s training split to
obtain one vector per example; vectors are converted to grids by the shared projection in the
downstream model and decoded with the same heads as other methods. Model selection uses
only training/validation within the source cohort.

- **Time-series foundation model (TimesFM).** TimesFM (Das et al., 2024) is a decoder-only attention model pretrained on diverse time series for strong zero-shot forecasting. We use TimesFM as
a _frozen encoder_ : after mean imputing each feature to form regular per-feature series, we extract
hidden representations feature-by-feature and average across features to obtain a window-level
embedding, which is then mapped to a grid by the shared projection and decoded. No TimesFM
finetuning is performed.

- **General** **healthcare** **predictive** **framework** **(GenHPF-variant).** GenHPF (Hur et al., 2024)
divides patient features hierarchically, encodes each medical event into an embedding followed
by a step to aggregate them. We create a variant of this method with minor modifications to their
textual templates and follow the same downstream learning pipeline. [3]


3.3 DATASETS AND PREPROCESSING


We use three ICU cohorts: MIMIC-IV (Johnson et al., 2023a), HiRID (Y`eche et al., 2021), and
PPICU. PPICU is an external dataset from a distinct hospital system. In total, the cohorts include


2We perform embedding model ablations; the results are recorded in Appendix L.
3Details on how mapping was done are shown in Appendix N.


4


Published as a conference paper at ICLR 2026


**Dataset** _→_ **HiRID** **MIMIC** **PPICU** **Wins**


**Tasks** _→_ Forecast LoS Mort Drug Lab Forecast LoS Mort Drug Lab Forecast LoS Mort Drug Lab
**Method** _↓_ MSE MAE AUROC Recall Recall MSE MAE AUROC Recall Recall MSE MAE AUROC Recall Recall


Mean 0.040 0.378 0.914 0.878 0.857 0.035 0.447 0.847 0.838 0.886 0.028 0.528 0.842 0.834 0.847 0
Right shift 0.041 **0.342** 0.923 0.884 0.858 0.037 0.409 0.886 0.841 0.884 0.031 0.490 0.868 0.831 0.846 1
Interpolation 0.435 0.370 0.918 0.879 0.853 0.103 0.430 0.873 0.844 0.893 0.133 0.493 0.857 0.837 0.847 0
TSDE 0.029 0.411 0.923 0.901 0.902 0.030 0.406 **0.915** 0.888 0.899 0.053 0.485 **0.890** 0.899 0.870 1
TimesFM 0.028 0.440 0.826 0.850 0.925 0.030 0.413 0.791 0.806 0.940 0.036 0.494 0.658 0.923 0.925 0
GenHPF - - 0.836 0.770 0.741 - - 0.776 0.720 0.713 - - 0.780 0.835 0.6773 0
Record2Vec **0.021** 0.347 **0.930** **0.911** **0.931** **0.027** **0.328** 0.888 **0.903** **0.947** **0.017** **0.358** **0.890** **0.937** **0.936** 13


Table 1: In-distribution Result (RQ1). Best (per column) in **bold** ; second-best underlined. _Wins_
counts the number of bests per method across all 15 downstream tasks.


57,212 stays with 60 variables for MIMIC-IV, 32,216 stays with 64 variables for HiRID, and 39,000
stays with 75 variables for PPICU. [4] We segment each stay into non-overlapping windows of 48
hours. The variables cover laboratory tests, vital signs, and clinical interventions.


For the grid baselines, we normalize values within each cohort using statistics computed on the
corresponding training split, consistent with prior benchmarks where normalization is crucial for
numeric model stability. For text-based transformations, we keep raw magnitudes and the native
clinical units to preserve meaning in the summaries i.e we do not perform further modification of
the raw data. For language inputs, we create a canonical serialization of the window. For each
variable present, the serialization lists the name and the full sequence of timestamps and raw values
observed during the window. This serialization is the input to the summarizers and also serves as the
no-summarization control described in Section 3.1. Additional details on concept mappings, unit
handling, and filtering rules, which were curated with practicing ICU clinicians to ensure correct
harmonization of variables, appear in Appendix C.2.


3.4 TASKS AND EVALUATION


We study five predictive tasks and two privacy probes. The tasks are: multivariate forecasting of all
variables over the next 24 hours; remaining length of stay at the window end; in-hospital mortality;
two treatment indicators for vasopressor and antibiotic use in the next 24 hours; and a multi-label
outcome for whether ten common blood tests will be ordered in the next 24 hours. The privacy
probes test demographic recoverability by predicting age (clipped to 18–90) and sex.


We use three settings. In-distribution trains and validates within one cohort and tests on its holdout
split. Cross-site trains on a source cohort and tests on a distinct target without target labels; we
report target accuracy and the drop relative to in-distribution. Few-shot starts from a source-trained
model and fine-tunes on 16, 64, or 512 labeled target examples, then tests on the target split.


We report MAE for length of stay and age, masked MSE for forecasting, and micro-averaged recall
(with precision and F1) for classification. Results average four seeds with mean and standard deviation. Budgets, early stopping, capacity, and regularization are matched within input type. TSDE
is trained on the training split with validation selection. TimesFM, _gϕ_, and _hψ_ remain frozen. Full
hyperparameters appear in Appendix D.


4 RESULTS

We organize the evaluation around seven research questions probing in-distribution performance
(RQ1), cross-cohort transfer (RQ2), the value of summarization and model choice (RQ3), prompt
sensitivity (RQ4), few-shot adaptation (RQ5), privacy (RQ6), and information analysis (RQ7). Unless noted, results tables report means over seeds with the top performer highlighted. For consistency, the results sections report numbers from a single downstream model (PatchTSMixer), except for mortality, where we report the best performance across all models tested in the mortality
benchmark (Y`eche et al., 2022); we verified the same trends hold with neural network architectures
including multi-layer perceptron (MLP), LSTM (Hochreiter & Schmidhuber, 1997), TimeMixer
(Wang et al., 2024b) in Appendix O.


4.1 HOW DO THE FOUR METHODS COMPARE IN DISTRIBUTION? (RQ1)


**Record2Vec** **achieves** **the** **strongest** **in-distribution** **results** **overall,** **winning** **13** **of** **15** **tasks** **and**
**ranking second on the remaining two.**


4Differences in EHR systems lead to different variable sets across sites.


5


Published as a conference paper at ICLR 2026


**Dataset** _→_ **HiRID** _→_ **PPICU** **MIMIC** _→_ **PPICU** **Wins**


**Tasks** _→_ Forecast LoS Mort Drug Lab Forecast LoS Mort Drug Lab
**Method** _↓_ MSE MAE AUROC Recall Recall MSE MAE AUROC Recall Recall


Mean 0.306 1.09 0.50 0.42 0.77 4.839 0.85 0.50 0.30 0.81 0
Right shift 0.417 1.03 0.50 0.53 0.88 6.344 0.76 0.50 0.23 0.82 0
Interpolation 24.80 0.91 0.50 0.34 0.81 13.41 0.71 0.50 0.21 0.80 0
TSDE 0.209 0.73 0.49 0.91 0.91 0.269 0.76 0.51 0.90 0.90 0
TimesFM 0.217 0.80 0.64 0.93 0.95 0.284 0.93 0.69 **0.95** **0.95** 2
GenHPF - - 0.582 0.699 0.316 - - 0.425 0.442 0.428 0
Record2Vec Template 0.195 0.98 0.72 0.96 0.96 0.263 0.77 0.71 **0.95** **0.95** 2
Record2Vec **0.183** **0.69** **0.72** **0.97** **0.97** **0.242** **0.49** **0.72** **0.95** **0.95** 10


Table 2: Transfer Learning Result (RQ2). Best per column in **bold** ; second-best underlined. Wins
counts tied bests.
Table 1 summarizes performance within each cohort. A clear pattern emerges: Record2Vec leads
on most outcomes in HiRID, sweeps all tasks in MIMIC, and again dominates in PPICU with one
exception. The two columns not led by Record2Vec are PPICU mortality, where TSDE is best, and
HiRID length of stay, where a simple right-shift imputation edges ahead. Representation-learning
baselines (TSDE, TimesFM) are consistently competitive and often place second, while classic grid
imputations rarely win and generally trail across cohorts and endpoints. These results indicate that a
language-mediated input yields robust utility across forecasting, regression, and classification without tailoring model architectures to a site.


We hypothesize three drivers. First, summarization captures clinically salient semantics—states,
trajectories, interventions, salient events—while aligning heterogeneous names, units, and sampling
policies into a shared space. This reduces reliance on ad hoc imputations and preserves meaning when measurements are sparse or irregular. Second, the fixed-length embedding offered by
Record2Vec stabilizes the downstream interface, limiting sensitivity to missingness patterns and local measurement habits that degrade grid-based inputs. Third, compared with TSDE and TimesFM,
which emphasize correlations and trends in numeric streams, Record2Vec adds a layer of clinical
context that appears to aid discrimination on classification endpoints while remaining competitive
on regression. Overall, the findings support the view that LLM-driven transformation produces more
informative and portable inputs than either imputation or purely numeric representation learning.


4.2 DOES THE LLM BASED REPRESENTATION IMPROVE TRANSFERABILITY ACROSS ICUS?
(RQ2)


**Record2Vec transfers best across ICUs, winning 10 of 10 columns in Table 2 with two ties by**
**TimesFM.**


When models are trained on HiRID or MIMIC and evaluated on PPICU, Record2Vec consistently
ranks first across forecasting, length of stay, mortality, treatment, and lab prediction. In contrast, grid
imputations degrade sharply under shift, and several classification scores collapse toward chance.
TSDE and TimesFM are stronger than imputation, yet they still trail Record2Vec in most settings.
TimesFM ties for the top position in two columns and, together with Record2Vec, benefits from the
larger MIMIC source when predicting common interventions and labs at PPICU. The pattern is clear:
methods that rely on site-specific numeric regularization or self-supervision on the source cohort do
not maintain accuracy when confronted with new variable sets, sampling habits, and missingness
regimes.


We attribute these results to three factors. First, natural-language summaries align heterogeneous
coding choices, units, and documentation styles into a shared clinical space before embedding. This
reduces the burden on downstream decoders to re-learn site-specific conventions and helps preserve
signal for tasks like mortality and treatment prediction. Second, the fixed-length embedding produced by Record2Vec offers a stable input interface that is less sensitive to irregular sampling and
missingness patterns than grids, which explains the large gap from imputation under distribution
shift. Third, compared with TSDE and TimesFM, Record2Vec injects semantic context about states,
trends, and salient events extracted by the summarizer. To better understand the gains from summarization, we compared against the strategy used by related work (Hur et al., 2024; Gao et al., 2024;
Hegselmann et al., 2025) to map patient data onto a fixed template. When comparing Record2Vec
with TSDE, and TFM, against fixed-template baselines, we observe additional performance gains
that can be attributed to summarization. We hypothesize these gains primarily come due to the standardization of heterogeneous patient profiles across sites while preserving biologically relevant in

6


Published as a conference paper at ICLR 2026


Rank 1 Rank 2 Rank 3 Rank 4















no-summary


llama 3.1


medgemma


gemini2.0-flash










































|8|Col2|Col3|Col4|Col5|Col6|3|Col8|4|Col10|
|---|---|---|---|---|---|---|---|---|---|
|1|4|4|4|2|8|8|8|8|8|
|2|2|3|3|6|6|6|6|4|4|
|4|4|4|6|6|6|6|2|2|3|


|3|3|6|Col4|18|Col6|Col7|Col8|
|---|---|---|---|---|---|---|---|
|6|6|6|6|12|12|6|6|
|9|9|9|15|15|15|3|3|
|12|12|12|12|6|9|9|3|



Figure 3: Rank distributions for No-summary vs. three LLM variants across 15 in-distribution tasks
(left) and 30 cross-site transfer tasks (right). Methods are ranked based on performance across
five downstream tasks: Forecast (MSE), LoS (MAE), Mortality (AUROC), Drug (Recall), and Lab
(Recall). See the Appendix M for the detailed values.


formation for making predictions.Foundation pretraining helps TimesFM transfer better than TSDE,
but it remains tied to numeric trends alone, whereas Record2Vec retains both numerical and clinical
meaning. Together, these properties yield robust portability across hospitals for a broad set of ICU
prediction tasks.


4.3 DO SUMMARIES HELP, AND WHICH SUMMARIZER WORKS BEST? (RQ3)


**Summarize-then-embed improves cross-site transfer while staying competitive in-distribution,**
**and** **among** **summarizers** **Gemini-2.0** **Flash** **and** **MedGemma** **perform** **best,** **with** **Llama-3.1**
**worse than both.**


Figure 3 shows rank distributions for four variants: _no-summary_ (directly embed the raw serialization), and three LLM summarizers (Llama-3.1, MedGemma, Gemini-2.0 Flash). On the left
(in-distribution; 15 tasks), _no-summary_ often attains the top rank, with the LLM-based variants
close behind. Within a single site, feeding the embedding model the full, unsummarized content appears advantageous and does not require normalization into prose. On the right (cross-site transfer;
30 tasks), the pattern reverses. _No-summary_ concentrates in the worst ranks overall, while the three
summarize-then-embed variants dominate first and second ranks. Comparing the LLMs, Gemini-2.0
Flash and MedGemma account for most of the top positions in both settings; their gap narrows under
transfer. Llama-3.1 accumulates the most last-place ranks among summarizers in both settings.


We think there are three reasons for these outcomes. First, summarization imposes a shared clinical language over heterogeneous variable names, units, and sampling practices, which removes
site-specific idiosyncrasies before embedding. This harmonization matters most under shift and
explains why Record2Vec transfers better than direct embedding of raw, site-specific streams. Second, within-site, direct embeddings preserve all numeric detail and local conventions, which can
make representations highly distinctive and strong on held-out splits from the same cohort; however,
precisely those site-specific details impair portability to other hospitals. Third, the choice of summarizer influences both fidelity and standardization. MedGemma’s medical pretraining promotes
clinically faithful phrasing that is stable across institutions, supporting transfer. Gemini-2.0 Flash’s
instruction following and planning yield concise, information-dense summaries that are marginally
stronger in-distribution and remain competitive under transfer, leading to a small gap between the
two. Llama-3.1, with smaller capacity and less domain specialization, tends to produce shorter or
less standardized summaries, which hurts both within-site utility and cross-site robustness. **A major**
**practical** **gain** **is** **efficiency:** **without** **summarization** **the** **raw** **serialization** **passes,** **on** **average,**
_∼_ **25** _×_ **more tokens to the embedder than the summarized version, cutting inference cost pro-**
**portionally while improving transfer.**


4.4 HOW SENSITIVE IS PERFORMANCE TO PROMPT DESIGN? (RQ4)


**Across** **four** **prompting** **strategies,** **performance** **is** **broadly** **similar** **in-distribution** **and** **under**
**transfer,** **with a slight edge for ICD-style prompts in transfer.** Figure 4 plots rank distributions
for zero-shot, chain-of-thought, trend-focused, and ICD-focused prompts using Gemini-2.0 Flash.
The bars span ranks fairly evenly on both the in-distribution side and the cross-site side, indicating
limited sensitivity to prompt choice at the aggregate level. We observe a small shift in transfer
where ICD-style prompts collect more top ranks, while the other three strategies remain closely
clustered. Within cohorts, no single prompt dominates consistently across forecasting, regression,
or classification.


7


Published as a conference paper at ICLR 2026


Rank 1 Rank 2 Rank 3 Rank 4

















Zero-shot


CoT


ICD


Trend








































|3|5|Col3|Col4|Col5|Col6|4|Col8|Col9|Col10|3|
|---|---|---|---|---|---|---|---|---|---|---|
|4|4|3|3|3|3|3|3|5|5|5|
|5|5|5|4|4|4|4|3|3|3|3|
|3|3|3|3|5|5|5|5|5|4|4|


|2|6|Col3|Col4|Col5|Col6|Col7|4|Col9|Col10|Col11|3|Col13|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|3|3|2|2|6|6|6|6|6|6|4|4|4|
|6|6|6|6|6|4|4|4|4|3|3|3|2|
|4|4|4|3|3|3|2|2|6|6|6|6|6|



Figure 4: Rank distributions for four prompt variants with Gemini 2.0-flash across 15 in-distribution
tasks (left) and 30 cross-site transfer tasks (right). Lower ranks indicate better performance. Methods are ranked based on performance across five downstream tasks: Forecast (MSE), LoS (MAE),
Mortality (AUROC), Drug (Recall), and Lab (Recall). See the Appendix M for the detailed values.


Figure 5: Few-shot finetuning with 16 labeled target samples for mortality prediction (RQ5) shown
across six transfer settings. All tasks are reported the same metric as previous section: Forecast:
masked mse, LOS: mae, Mortality: AUROC. The first row is the result of Hirid _→_ Ppicu and the
second row is Mimic _→_ Ppicu. Reference lines: blue = best in-distribution upper bound, orange
= best pre-finetune result, black = best finetuned baseline. Record2Vec surpassed baselines with a
large gap, reaching comparable performance to in-distribution.


We think two factors explain this pattern. First, the summarizer is strong enough that high-level
clinical content is retained under all four prompts, producing broadly comparable embeddings. Second, the ICD framing may aid transfer by nudging summaries toward standardized terminology that
travels better across sites. Overall, these results suggest that prompt choice is not the primary driver
of utility in our setup, and that more targeted prompt engineering could be a promising avenue for
future improvement. Detailed prompt templates appear in Appendix E.


4.5 DOES THE LLM BASED REPRESENTATION IMPROVE FEW-SHOT DOWNSTREAM
LEARNING? (RQ5)


**Record2Vec needs fewer samples to achieve generalization on small clinical datasets.** Hospitals
that are not part of large medical centers often lack sufficient patient data to train high-performing
models from scratch. In Appendix I, we compare models trained on 1,000 PPICU samples with
Record2Vec models that are pre-trained on HiRID or MIMIC and then fine-tuned on only 16 randomly selected PPICU samples. Beyond the gains from in-distribution training, Record2Vec delivers substantial improvements over its transfer variants and outperforms all competing methods under
the same supervision budget. In multiple settings, the adapted Record2Vec models approach the indistribution reference model trained on 36,019 samples, indicating that very limited supervision can
recover most of the performance lost under distribution shift.


These gains likely arise because Record2Vec produces a compact representation that is already
semantically aligned across hospitals, reducing the burden on the downstream head to learn sitespecific conventions from scratch. Finetuning can therefore act mainly as a light calibration of task
boundaries rather than a wholesale re-learning of measurement scales, missingness patterns, and
naming differences. In effect, the summary abstracts away local differences while preserving clinically salient signals—states, trends, and recent interventions—that are informative for mortality,
length of stay, and near-term actions. This combination of cross-site alignment and retained clinical


8


Published as a conference paper at ICLR 2026


Figure 6: In-distribution privacy prediction on **Gender** across three ICU datasets. Each bar is a
different method. The dashed horizontal line in each panel marks the least leaked classical baseline
among _{_ TimesFM, TSDE, Mean, Interpolation, Right shift _}_ for that metric/dataset. Our method
reached comparable and mostly reduced results in terms of privacy leakage. **Age** results have less
than 0.5% gap and can be inferred from Table 4


content makes Record2Vec especially data-efficient in shifted settings, enabling effective few-shot
learning when labeled target data are scarce.


4.6 DOES THE PORTABLE REPRESENTATION INCREASE PRIVACY RISKS? (RQ6)


**We find no evidence that Record2Vec increases demographic leakage risk:** **gender prediction**
**collapses** **to** **a** **constant** **baseline** **for** **all** **methods,** **and** **Record2Vec’s** **age** **error** **is** **similar** **to** **or**
**higher than baselines.** Record2Vec’s MAE is generally on par with competing approaches across
cohorts, suggesting that the portable representation does not make age easier to infer. Figure 6 visualizes demographic recoverability from learned representations. For _gender_ (binary), models trained
on embeddings from grids, TSDE, TimesFM, and Record2Vec all degenerate to predicting a single
class on held-out data, indicating near-chance information about gender regardless of method. We
additionally examined performance across minority diagnostic subgroups and found no disparate
impact, with Record2Vec tracking overall population trends without exhibiting worst-group performance degradation relative to baselines. Detailed numbers appear in Appendix O.


We think this outcome reflects how the pipeline shapes information. Record2Vec emphasizes clinical states, trends, and recent interventions needed for downstream tasks, rather than demographic
markers. Because the summarizer and text encoder are frozen and not trained to predict demographics, they do not amplify demographic signal beyond what is already present in the record windows.
In practice, the summaries in our setup rarely include explicit age or sex mentions, and the embedding stage is not optimized to capture them, which helps keep demographic recoverability low while
preserving clinical utility. However, we emphasize that these results are specific to demographic
leakage and do not preclude other privacy risks such as membership inference or embedding inversion.


4.7 WHAT INFORMATION IS OBTAINED OR LOST IN EACH EMBEDDING? (RQ7)


**Record2Vec captures semantically meaningful structure that improves in-distribution perfor-**
**mance and, importantly, encodes cross-site invariant patterns, while attenuating demographic**
**attributes.** We compare the Record2Vec embedding—MedGemma summaries prompted with ICD
codes—against imputation-based vectors to quantify task-specific information gain or loss (Figure 7). Unless stated otherwise, “gain” denotes the relative improvement (∆%) of a metric aligned
with task direction (e.g., lower for error; higher for AUROC/recall) with respect to the imputation
baseline.


For in-distribution, the largest gains are observed for _forecasting_ and _mortality_ prediction, indicating
that LLM-derived semantic abstractions, such as ICD-anchored summarization, improve outcome
modeling and strengthen associations with significant temporal features. For cross-site transfer,
We observe consistent improvements for _lab_, _drug_, _forecast_, _LOS_, and _mortality_, with the most
pronounced effect on future drug-use prediction. This implies that _Record2Vec_ captures patterns
that generalize across institutions and reduces sensitivity to site-specific artifacts. For demographic
attenuation, signals tied to _age_ and _gender_ are generally weakened or unchanged. This suggests


9


Published as a conference paper at ICLR 2026


Figure 7: **Information** **gained** **vs.** **lost** **with** **Record2Vec** **(heatmaps;** **in-distribution** **and** **cross-**
**site transfer).** Each cell shows the _task-aligned_ relative change (%) of _Record2Vec_ over representation vectors. Overall, _Record2Vec_ yields the largest gains for _drug_, _forecast_, and _mortality_, including
cross-site transfer, while demographic signals ( _age_, _gender_ ) are attenuated or unchanged.


_Record2Vec_ does not amplify, and mostly reduces, demographic attribute leakage relative to raw
time series, which is another significant advantage under healthcare settings.


5 LIMITATIONS


Our framework requires sending patient records to LLM services. Although all experiments were
conducted in a secure, IRB-compliant setting with strict controls, some patients and families may be
uncomfortable with external processing. At present, this confines the approach to research use unless on-prem or fully compliant deployments are available. Generating LLM-based representations
can be resource-intensive. Many hospitals may lack the compute or budget to support large-scale
or continuous inference without additional investment (see Appendix H for a detailed analysis of
token counts, latency, and costs). Finally, API-based or large local LLMs introduce non-trivial latency compared to lighter models, which can limit real-time applicability even if offline use remains
practical. We acknowledge that our study is primarily empirical; we believe developing the theory
for when and where this methodology works would significantly improve the reach of our work. We
rely on downstream task performance as a proxy for representation quality and do not currently utilize theoretical tools (such as causal diagrams) to formally derive the conditions for site-invariance.
Furthermore, we do not directly quantify end-to-end information loss (e.g., via mutual information
or per-feature fidelity checks). While our downstream accuracy suggests that our method preserves
important signals, a limitation of current work, it is challenging to characterize exactly what information is retained or lost during summarization.


6 CONCLUSION


Transforming irregular ICU records by first summarizing with an LLM and then embedding offers a promising route to portable, task-ready representations. Our results indicate competitive indistribution performance, strong transferability, and improved few-shot learning without increased
demographic leakage. We hypothesize that LLMs can leverage their learned priors to produce summaries that are standardized across sites, rich in biological information relevant to downstream decision making and close (in a distributional sense) across sites, enabling the portability of downstream
predictive models. Nevertheless, deployment risks remain, particularly around privacy, cost, and
latency. Future work should focus on creating compliant on-prem solutions, and prospective evaluations within clinical workflows. Assessing feature-level fidelity and developing theory to better
understand and control the properties of LLM-based standardization is an important direction to
understand how far this approach can be extended.


10


Published as a conference paper at ICLR 2026


REPRODUCIBILITY STATEMENT


We take several steps to enable independent verification of our results. Data preprocessing (filtering, resampling, normalization, masking, and label construction) is documented in Appendix C.2.
HiRID and MIMIC-IV are publicly accessible via PhysioNet; PPICU is a privately maintained
dataset that will be shared upon reasonable request to the authors once the paper is public and
de-anonymized, in accordance with institutional and data-use policies. Training details, including hardware requirements, software environment with pinned versions, all hyperparameters, and
early-stopping criteria, are provided in Appendix D. To assess robustness, we tune key hyperparameters and repeat training/evaluation across multiple random seeds; the resulting analyses indicate
our conclusions are stable to such variations. The code to reproduce our results is available at
[https://github.com/Jerryji007/Record2Vec-ICLR2026.](https://github.com/Jerryji007/Record2Vec-ICLR2026)


We take several steps to enable independent verification of our results. Data preprocessing (filtering,
resampling, normalization, masking, and label construction) is documented in Appendix C.2. HiRID
and MIMIC-IV are publicly accessible via PhysioNet; PPICU is a privately maintained dataset that
will be shared upon reasonable request to the authors once the paper is public and de-anonymized, in
accordance with institutional and data-use policies. Training details—including hardware requirements, software environment with pinned versions, all hyperparameters, and early-stopping criteria—are provided in Appendix D. To assess robustness, we tune key hyperparameters and repeat
training/evaluation across multiple random seeds; the resulting analyses indicate our conclusions
are stable to such variations.


ETHICS STATEMENT


**Scope** **and** **oversight.** Our work is in machine learning for healthcare and involves processing
de-identified patient records under institutional oversight. All activities complied with applicable
regulations and institutional policies (including HIPAA in the United States and the policies of our
institutional review/ethics board). Data use agreements were honored throughout.


**Training and authorization.** All authors completed required human-subjects and privacy training
and are certified/authorized to handle clinical data in secure research environments.


**Data protection and privacy.** We followed data-minimization and least-privilege principles; access
to protected health information (PHI) was restricted to approved personnel and audit-logged. Data
were stored on access-controlled servers with encryption in transit and at rest; exports outside secure
infrastructure were prohibited. When sharing intermediate artifacts (e.g., for internal review), we
ensured de-identification and suppression of quasi-identifiers.


**Risk assessment and mitigation.** We considered potential harms (privacy leakage, representational
bias, inequitable performance) and mitigated them via dataset curation checks, stratified evaluation
where applicable, and manual review of outputs used in the paper. No clinical decisions were made
using the research system.


**LLM usage.** We employed LLMs in strictly limited ways (see Section A): (i) locally hosted models
on institution-managed GPUs within secure, access-controlled servers; and (ii) third-party services
(Gemini and ChatGPT families) _only_ for grammar/wording polish of author-written text and for
generating small iconography within figures (not full figures and not scientific content). No methods,
ideas, analyses, code, or experiments were generated by LLMs, and all suggestions were manually
reviewed.


**Gemini** **2.0** **Flash** **configuration.** Under a dedicated research agreement, we used a sandboxed
deployment of the Gemini 2.0 Flash family strictly for research purposes. For any interactions
related to healthcare data:


    - prompts and inputs excluded PHI whenever possible; when unavoidable for evaluation,
only de-identified data were used;


    - inference occurred in an access-controlled environment with logging;


    - data-retention was disabled per our agreement; the model does not retain or use our prompts
or outputs for provider-side training or service improvement.


11


Published as a conference paper at ICLR 2026


**Author responsibility.** Beyond copy-editing and minor figure iconography, LLMs were not used.
All ideas, study design, algorithm development, experiments, analyses, and substantive writing were
performed by the authors, who take full responsibility for the work and its ethical conduct.


ACKNOWLEDGMENTS


RGK is supported by a Canada CIFAR AI Chair and a Canada Research Chair Tier II in Computational Medicine (CRC-2022-00049). This research was supported by an NFRF Special Call
NFRFR2022-00526. Resources used in preparing this research were provided, in part, by the
Province of Ontario, the Government of Canada through CIFAR, and companies sponsoring the
Vector Institute.


12


Published as a conference paper at ICLR 2026


REFERENCES


Monica Agrawal, Stefan Hegselmann, Hunter Lang, Yoon Kim, and David Sontag. Large language
models are few-shot clinical information extractors. In _Proceedings_ _of_ _the_ _2022_ _Conference_ _on_
_Empirical Methods in Natural Language Processing_, pp. 1998–2022, 2022.


Emily Alsentzer, John R. Murphy, Willie Boag, Wei-Hung Weng, Di Jindi, Tristan Naumann, and
Matthew McDermott. Publicly available clinical bert embeddings. In _Proceedings_ _of_ _the_ _2nd_
_Clinical NLP Workshop at NAACL_, pp. 72–78, 2019.


Ali F. Ansari, Luca Stella, Caglayan Turkmen, Xueyan Zhang, Pedro Mercado, Haoyin Shen, Oleksandr Shchur, Syama S. Rangapuram, Sigberto P. Arango, Somesh Kapoor, et al. Chronos: Learning the language of time series. _arXiv preprint arXiv:2403.07815_, 2024.


Martin Arjovsky, L´eon Bottou, Ishaan Gulrajani, and David Lopez-Paz. Invariant risk minimization.
_arXiv preprint arXiv:1907.02893_, 2019.


Mehala Balamurali. T-distributed stochastic neighbor embedding. In _Encyclopedia of Mathematical_
_Geosciences_, pp. 1527–1535. Springer, 2023.


Parishad BehnamGhader, Vaibhav Adlakha, Marius Mosbach, Dzmitry Bahdanau, Nicolas Chapados, and Siva Reddy. Llm2vec: Large language models are secretly powerful text encoders, 2024.
[URL https://arxiv.org/abs/2404.05961.](https://arxiv.org/abs/2404.05961)


Dirk Bender and Kamran Sartipi. HL7 FHIR: An agile and restful approach to healthcare information exchange. In _2013_ _IEEE_ _26th_ _International_ _Symposium_ _on_ _Computer-Based_ _Medical_
_Systems_, pp. 326–331. IEEE, 2013. doi: 10.1109/CBMS.2013.6627810.


Katherine E. Brown, Chao Yan, Zhuohang Li, Xinmeng Zhang, Benjamin X. Collins, You Chen,
Ellen W. Clayton, Murat Kantarcioglu, Yevgeniy Vorobeychik, and Bradley A. Malin. Large
language models are less effective at clinical prediction tasks than locally trained machine learning
models. _Journal of the American Medical Informatics Association_, 32(5):811–822, 2025.


Michael Burger, Fedor Sergeev, Martin Londschien, Dominique Chopard, Hugo Y`eche, Polina
Leshetkina, Andreas Morgenroth, Zeynep Bab¨ur, Jasmina Bogojeska, Martin Faltys, Rita
Kuznetsova, and Gunnar R¨atsch. Towards foundation models for critical care time series. _arXiv_
_preprint arXiv:2411.16346_, 2024.


Defu Cao, Furong Jia, Sercan O Arik, Tomas Pfister, Yixiang Zheng, Wen Ye, and Yan Liu. Tempo:
[Prompt-based generative pre-trained transformer for time series forecasting, 2024. URL https:](https://arxiv.org/abs/2310.04948)
[//arxiv.org/abs/2310.04948.](https://arxiv.org/abs/2310.04948)


Wei Cao, Dong Wang, Jian Li, Hao Zhou, Lei Li, and Yitan Li. Brits: Bidirectional recurrent
imputation for time series. In _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_ _(NeurIPS)_,
volume 31, pp. 6776–6786, 2018.


Ching Chang, Wei-Yao Wang, Wen-Chih Peng, and Tien-Fu Chen. Llm4ts: Aligning pre-trained
llms as data-efficient time-series forecasters. _ACM_ _Trans._ _Intell._ _Syst._ _Technol._, February 2025.
doi: 10.1145/3719207.


Eunsuk Chang and Sumi Sung. Use of snomed ct in large language models: Scoping review. _JMIR_
_Medical Informatics_, 12:e62924, 2024. doi: 10.2196/62924.


Zhengping Che, Sanjay Purushotham, Kyunghyun Cho, David Sontag, and Yan Liu. Recurrent
neural networks for multivariate time series with missing values. _Scientific_ _Reports_, 8(1):6085,
2018.


Gheorghe Comanici, Eric Bieber, Mike Schaekermann, Ice Pasupat, Noveen Sachdeva, Inderjit
Dhillon, Marcel Blistein, Ori Ram, Dan Zhang, Evan Rosen, et al. Gemini 2.5: Pushing the
frontier with advanced reasoning, multimodality, long context, and next generation agentic capabilities. _arXiv preprint arXiv:2507.06261_, 2025.


13


Published as a conference paper at ICLR 2026


Miguel Contreras, Sumit Kapoor, Jiaqing Zhang, Andrea Davidson, Yuanfang Ren, Ziyuan Guan,
Tezcan Ozrazgat-Baslanti, Jessica Sena, Subhash Nerella, Azra Bihorac, et al. Dellirium: A large
language model for delirium prediction in the icu using structured ehr. _Research Square_, pp. rs–3,
2025.


Abhimanyu Das, Weihao Kong, Rajat Sen, and Yichen Zhou. A decoder-only foundation model for
time-series forecasting. In _Forty-first International Conference on Machine Learning_, 2024.


Edward De Brouwer, Jaak Simm, Adam Arany, and Yves Moreau. Gru-ode-bayes: Continuous modeling of sporadic time series. In _Advances in Neural Information Processing Systems (NeurIPS)_,
pp. 7377–7388, 2019.


Abhimanyu Dubey, Abhinav Jauhri, Abhinav Pandey, Abhishek Kadian, Ahmad Al-Dahle, Aiesha
Letman, Akhil Mathur, Alan Schelten, Amy Yang, Angela Fan, et al. The llama 3 herd of models.
_arXiv e-prints_, pp. arXiv–2407, 2024.


Emadeldeen Eldele, Mohamed Ragab, Zhenghua Chen, Min Wu, Chee Keong Kwoh, Xiaoli Li, and
Cuntai Guan. Time-series representation learning via temporal and contextual contrasting. _arXiv_
_preprint arXiv:2106.14112_, 2021.


Len Feremans, Boris Cule, and Bart Goethals. PETSC: Pattern-based embedding for time series
classification. _Data_ _Mining_ _and_ _Knowledge_ _Discovery_, 36:1015–1061, 2022. doi: 10.1007/
s10618-022-00822-7.


Vincent Fortuin, Dmitry Baranchuk, Gunnar R¨atsch, and Stephan Mandt. Gp-vae: Deep probabilistic time series imputation. In _Proceedings of the 23rd International Conference on Artificial_
_Intelligence and Statistics (AISTATS)_, 2020.


Jean-Yves Franceschi, Aymeric Dieuleveut, and Martin Jaggi. Unsupervised scalable representation
learning for multivariate time series. In _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_
_(NeurIPS)_, volume 32, 2019.


Yaroslav Ganin and Victor Lempitsky. Domain-adversarial training of neural networks. _Journal of_
_Machine Learning Research_, 17(59):1–35, 2016.


Yanjun Gao, Skatje Myers, Shan Chen, Dmitriy Dligach, Timothy A Miller, Danielle Bitterman,
Matthew Churpek, and Majid Afshar. When raw data prevails: Are large language model embeddings effective in numerical data representation for medical machine learning applications? _arXiv_
_preprint arXiv:2408.11854_, 2024.


Martin Griot, Charlotte Hemptinne, Jean Vanderdonckt, and Deniz Yuksel. Large language models
lack essential metacognition for reliable medical reasoning. _Nature Communications_, 16(1):642,
2025.


Nate Gruver, Marc Finzi, Xuechen Qiu, and Andrew G. Wilson. Large language models are zeroshot time series forecasters. In _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_ _(NeurIPS)_,
volume 36, pp. 19622–19635, 2023.


Mehak Gupta, Brian M. Gallamoza, Nicholas Cutrona, Prakash Dhakal, Romain Poulain, and Reza
Beheshti. An extensive data processing pipeline for mimic-iv. In _Proceedings of Machine Learn-_
_ing for Health (ML4H) at NeurIPS_, pp. 311–325, 2022.


Thomas Hartvigsen, Walter Gerych, Jidapa Thadajarassiri, Xiangnan Kong, and Elke Rundensteiner.
Stop&hop: Early classification of irregular time series. In _Proceedings_ _of_ _the_ _31st_ _ACM_ _In-_
_ternational_ _Conference_ _on_ _Information_ _&_ _Knowledge_ _Management_, pp. 696–705, 2022. doi:
10.1145/3511808.3557460.


Hrayr Harutyunyan, Hrant Khachatrian, David C. Kale, Greg Ver Steeg, and Aram Galstyan. Multitask learning and benchmarking with clinical time series data. _Scientific Data_, 6(1):96, 2019.


Rui He and Jason N. Chiang. Simultaneous forecasting of vital sign trajectories in the icu. _Scientific_
_Reports_, 15:14996, 2025.


14


Published as a conference paper at ICLR 2026


Stefan Hegselmann, Alejandro Buendia, Hunter Lang, Monica Agrawal, Xiaoyi Jiang, and David
Sontag. Tabllm: Few-shot classification of tabular data with large language models. In _Interna-_
_tional conference on artificial intelligence and statistics_, pp. 5549–5581. PMLR, 2023.


Stefan Hegselmann, Georg von Arnim, Tillmann Rheude, Noel Kronenberg, David Sontag, Gerhard
Hindricks, Roland Eils, and Benjamin Wild. Large language models are powerful ehr encoders.
_arXiv e-prints_, pp. arXiv–2502, 2025.


Sepp Hochreiter and J¨urgen Schmidhuber. Long short-term memory. _Neural_ _computation_, 9(8):
1735–1780, 1997.


Kyunghoon Hur, Jungwoo Oh, Junu Kim, Jiyoun Kim, Min Jae Lee, Eunbyeol Cho, Seong-Eun
Moon, Young-Hak Kim, Louis Atallah, and Edward Choi. Genhpf: General healthcare predictive
framework for multi-task multi-source learning. _IEEE Journal of Biomedical and Health Infor-_
_matics_, 28(1):502–513, January 2024. ISSN 2168-2208. doi: 10.1109/jbhi.2023.3327951. URL
[http://dx.doi.org/10.1109/JBHI.2023.3327951.](http://dx.doi.org/10.1109/JBHI.2023.3327951)


Stephanie L. Hyland, Martin Faltys, Matthias H¨user, Xinrui Lyu, Thomas Gumbsch, Crist´obal Esteban, Christian Bock, Michael Moor, Gunnar R¨atsch, Finale Doshi-Velez, and Thomas Merz.
Early prediction of circulatory failure in the intensive care unit using machine learning. _Nature_
_Medicine_, 26(3):364–373, 2020.


Zongliang Ji, Anna Goldenberg, and Rahul G Krishnan. Measurement scheduling for icu patients
with offline reinforcement learning. _arXiv preprint arXiv:2402.07344_, 2024.


Zongliang Ji, Andre Carlos Kajdacsy-Balla Amaral, Anna Goldenberg, and Rahul G Krishnan. Exosito: Explainable off-policy learning with side information for intensive care unit blood test
orders. _arXiv preprint arXiv:2504.17277_, 2025.


Ming Jin, Shiyu Wang, Lintao Ma, Zhixuan Chu, James Y. Zhang, Xiaoming Shi, Pin-Yu Chen,
Yuxuan Liang, Yuan-Fang Li, Shirui Pan, and Qingsong Wen. Time-llm: Time series forecasting
by reprogramming large language models, 2024. URL [https://arxiv.org/abs/2310.](https://arxiv.org/abs/2310.01728)
[01728.](https://arxiv.org/abs/2310.01728)


Alistair E. W. Johnson, Tom J. Pollard, Lu Shen, Li-wei H. Lehman, Mengling Feng, Marzyeh
Ghassemi, Benjamin Moody, Peter Szolovits, Leo Anthony Celi, and Roger G. Mark. Mimic-iii,
a freely accessible critical care database. _Scientific Data_, 3(1):160035, 2016.


Alistair E. W. Johnson, Lucas Bulgarelli, Li-wei Shen, Anthony Gayles, Amogh Shammout, Steven
Horng, Tom J. Pollard, Sharon Hao, Benjamin Moody, Brian Gow, Li-wei H. Lehman, Leo Anthony Celi, and Roger G. Mark. Mimic-iv, a freely accessible electronic health record dataset.
_Scientific Data_, 10(1):1–11, 2023a.


Alistair E. W. Johnson, Lucas Bulgarelli, Lu Shen, Alvin Gayles, Ayad Shammout, Steven Horng,
Tom J. Pollard, Sicheng Hao, Benjamin Moody, Brian Gow, Li-wei H. Lehman, Leo Anthony
Celi, and Roger G. Mark. Mimic-iv, a freely accessible electronic health record dataset. _Scientific_
_Data_, 10(1):1, 2023b.


Witesyavwirwa Vianney Kambale, David Krame Kadurha, Ali Deeb, Fadi Al Machot, Taha Bernabia, and Kyandoghere Kyamakya. Transformers in time series forecasting: A brief analysis
of the autoformer transfer learning performance. In _2023_ _30th_ _IEEE_ _International_ _Conference_
_on Electronics,_ _Circuits and Systems (ICECS)_, pp. 1–6, 2023. doi: 10.1109/ICECS58634.2023.
10382781.


Justin Kauffman, Riccardo Miotto, Eyal Klang, Anthony Costa, Beau Norgeot, Marinka Zitnik,
Shameer Khader, Fei Wang, Girish N. Nadkarni, and Benjamin S. Glicksberg. Embedding methods for electronic health record research. _Annual Review of Biomedical Data Science_, 8(1):563–
590, 2025. doi: 10.1146/annurev-biodatasci-103123-094729.


Patrick Kidger, James Morrill, James Foster, and Terry Lyons. Neural controlled differential equations for irregular time series. In _Advances in Neural Information Processing Systems (NeurIPS)_,
pp. 6696–6707, 2020.


15


Published as a conference paper at ICLR 2026


Rita Kuznetsova, Aliz´ee Pace, Manuel Burger, Hugo Y`eche, and Gunnar R¨atsch. On the importance
of step-wise embeddings for heterogeneous clinical time-series. In _Machine Learning for Health_
_(ML4H)_, pp. 268–291. PMLR, 2023.


Hunter Lang, Monica N Agrawal, Yoon Kim, and David Sontag. Co-training improves promptbased learning for large language models. In _International Conference on Machine Learning_, pp.
11985–12003. PMLR, 2022.


Jinhyuk Lee, Zhuyun Dai, Xiaoqi Ren, Blair Chen, Daniel Cer, Jeremy R. Cole, Kai Hui, Michael
Boratko, Rajvi Kapadia, Wen Ding, Yi Luan, Sai Meher Karthik Duddu, Gustavo Hernandez
Abrego, Weiqiang Shi, Nithi Gupta, Aditya Kusupati, Prateek Jain, Siddhartha Reddy Jonnalagadda, Ming-Wei Chang, and Iftekhar Naim. Gecko: Versatile text embeddings distilled from
large language models, 2024. [URL https://arxiv.org/abs/2403.20327.](https://arxiv.org/abs/2403.20327)


Simon A Lee, Sujay Jain, Alex Chen, Kyoka Ono, Arabdha Biswas, Akos [´] Rudas, Jennifer Fang,
and Jeffrey N Chiang. Clinical decision support using pseudo-notes from multiple streams of ehr
data. _npj Digital Medicine_, 8(1):394, 2025.


Hailin Li. Multivariate time series clustering based on common principal component analysis. _Neu-_
_rocomputing_, 349:239–247, 2019. doi: 10.1016/j.neucom.2019.03.060.


Yikuan Li, Shishir Rao, Jose Roberto Ayala Solares, Abdelaali Hassaine, Rema Ramakrishnan,
Dexter Canoy, Yajie Zhu, Kazem Rahimi, and Gholamreza Salimi-Khorshidi. Behrt: Transformer
for electronic health records. _Scientific Reports_, 10(1):7155, 2020a.


Yikuan Li, Sudha Rao, Jose R. A. Solares, Abdelkader Hassaine, Rema Ramakrishnan, Dexter Canoy, Ying Zhu, Kazem Rahimi, and Gholamreza Salimi-Khorshidi. Behrt: Transformer for electronic health records. _Scientific_ _Reports_, 10(1):7155, 2020b. doi: 10.1038/
s41598-020-62922-y.


Peiyuan Liu, Hang Guo, Tao Dai, Naiqi Li, Jigang Bao, Xudong Ren, Yong Jiang, and Shu-Tao
Xia. Calf: Aligning llms for time series forecasting via cross-modal fine-tuning, 2024a. URL
[https://arxiv.org/abs/2403.07300.](https://arxiv.org/abs/2403.07300)


Pengjie Liu, Huazheng Guo, Tongtong Dai, Ninghao Li, Jianfeng Bao, Xiang Ren, Yifan Jiang, and
Shu-Tao Xia. Calf: Aligning llms for time series forecasting via cross-modal fine-tuning. In
_Proceedings of the AAAI Conference on Artificial Intelligence_, volume 39, 2025.


Xin Liu, Daniel McDuff, Geza Kovacs, Isaac Galatzer-Levy, Jacob Sunshine, Jiening Zhan, MingZher Poh, Shun Liao, Paolo Di Achille, and Shwetak Patel. Large language models are few-shot
health learners, 2023. [URL https://arxiv.org/abs/2305.15525.](https://arxiv.org/abs/2305.15525)


Yong Liu, Guo Qin, Xiangdong Huang, Jianmin Wang, and Mingsheng Long. Autotimes: Autoregressive time series forecasters via large language models. _arXiv preprint arXiv:2402.02370_,
2024b.


Vadim Liventsev and Tobias Fritz. Intensive care as one big sequence modeling problem. _arXiv_
_preprint arXiv:2402.17501_, 2024.


Renqian Luo, Luyu Sun, Yuxian Xia, Tao Qin, Shuo Zhang, Hoifung Poon, and Tie-Yan Liu. Biogpt:
Generative pre-trained transformer for biomedical text generation and mining. _Briefings in Bioin-_
_formatics_, 23(6):bbac409, 2022.


Yuanfang Luo, Samantha Henry, Yanshan Wang, Feifan Shen, Ozlem Uzuner, and Anna Rumshisky.
The 2019 n2c2/umass lowell shared task on clinical concept normalization. _Journal of the Amer-_
_ican Medical Informatics Association_, 27(8):1529–1537.e1, 2020. doi: 10.1093/jamia/ocaa166.


Matthew B. A. McDermott, Shirly Wang, Nikki Marinsek, Rajesh Ranganath, Luca Foschini, and
Marzyeh Ghassemi. Reproducibility in machine learning for health research: still a ways to go.
_Science Translational Medicine_, 13(586):eabb1655, 2021.


Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean. Efficient estimation of word representations in vector space, 2013. [URL https://arxiv.org/abs/1301.3781.](https://arxiv.org/abs/1301.3781)


16


Published as a conference paper at ICLR 2026


Michael Moor, Oishi Banerjee, Zeshan S. H. Abad, Harlan M. Krumholz, Jure Leskovec, Eric J.
Topol, and Pranav Rajpurkar. Foundation models for generalist medical artificial intelligence.
_Nature_, 616(7956):259–265, 2023.


Mohammad Amin Morid, Olivia R. Liu Sheng, and Joseph Dunbar. Time series prediction using
deep learning methods in healthcare. _CoRR_, abs/2108.13461, 2021. URL [https://arxiv.](https://arxiv.org/abs/2108.13461)
[org/abs/2108.13461.](https://arxiv.org/abs/2108.13461)


Niklas Muennighoff, Nouamane Tazi, Lo¨ıc Magne, and Nils Reimers. Mteb: Massive text embedding benchmark. _arXiv preprint arXiv:2210.07316_, 2022.


Harsha Nori, Nicholas King, Scott M. McKinney, David Carignan, and Eric Horvitz. Capabilities
of gpt-4 on medical challenge problems, 2023.


A. N´u˜nez Reiz, M. A. Armengol de la Hoz, and M. S´anchez Garc´ıa. Big data analysis and machine
learning in intensive care units. _Medicina Intensiva (English Edition)_, 43(7):416–426, 2019.


Mathieu Oliver, J´erˆome Allyn, Romain Carencotte, Nadhira Allou, and Cyril Ferdynus. Introducing the blendedicu dataset, the first harmonized, international intensive care dataset. _Journal_ _of_
_Biomedical Informatics_, 146:104502, 2023.


Srikant Panda, Hitesh Laxmichand Patel, Shahad Al-Khalifa, Amit Agarwal, Hend Al-Khalifa, and
Sharefah Al-Ghamdi. Daiq: Auditing demographic attribute inference from question in llms.
_arXiv preprint arXiv:2508.15830_, 2025.


Chengpeng Peng, Xiaoman Yang, Aoxiao Chen, et al. A study of generative large language
model for medical research and healthcare. _npj_ _Digital_ _Medicine_, 6:210, 2023. doi: 10.1038/
s41746-023-00958-w.


Jeffrey Pennington, Richard Socher, and Christopher Manning. Glove: Global vectors for word
representation. In _Proc. EMNLP_, pp. 1532–1543, 2014. doi: 10.3115/v1/D14-1162.


Tom J. Pollard, Alistair E. W. Johnson, Jesse D. Raffa, Leo Anthony Celi, Roger G. Mark, and
Omar Badawi. The eicu collaborative research database, a freely available multi-center database
for critical care research. _Scientific Data_, 5(1):1–13, 2018.


Alvin Rajkomar, Eyal Oren, Kai Chen, Peng Dai, Naim Hajaj, Peter J. Liu, Melody Sun, Pushpak
Sharma, et al. Scalable and accurate deep learning with electronic health records. _NPJ_ _Digital_
_Medicine_, 1:18, 2018.


Laila Rasmy, Yang Xiang, Ziqian Xie, Cui Tao, and Degui Zhi. Med-bert: pretrained contextualized
embeddings on large-scale structured electronic health records for disease prediction. _npj Digital_
_Medicine_, 4(1):86, 2021.


Christian Reich, Anna Ostropolets, Patrick Ryan, Peter Rijnbeek, Martijn Schuemie, Alexander
Davydov, Dmitry Dymshyts, and George Hripcsak. Ohdsi standardized vocabularies—a largescale centralized reference ontology for international data harmonization. _Journal of the American_
_Medical Informatics Association_, 31(3):583–590, 2024. doi: 10.1093/jamia/ocad247.


Nils Reimers and Iryna Gurevych. Sentence-bert: Sentence embeddings using siamese bertnetworks. _arXiv preprint arXiv:1908.10084_, 2019.


Yulia Rubanova, Ricky T. Q. Chen, and David Duvenaud. Latent ordinary differential equations
for irregularly-sampled time series. In _Advances_ _in_ _Neural_ _Information_ _Processing_ _Systems_
_(NeurIPS)_, volume 32, 2019.


Shiori Sagawa, Pang Wei Koh, Tatsunori B. Hashimoto, and Percy Liang. Distributionally robust neural networks for group shifts: On the importance of regularization for worst-case generalization. In _International_ _Conference_ _on_ _Learning_ _Representations_ _(ICLR)_, 2020. URL
[https://openreview.net/forum?id=ryxGuJrFvS.](https://openreview.net/forum?id=ryxGuJrFvS)


Andrew Sellergren, Sahar Kazemzadeh, Tiam Jaroensri, Atilla Kiraly, Madeleine Traverse, Timo
Kohlberger, Shawn Xu, Fayaz Jamil, C´ıan Hughes, Charles Lau, et al. Medgemma technical
report. _arXiv preprint arXiv:2507.05201_, 2025.


17


Published as a conference paper at ICLR 2026


Zineb Senane, Lele Cao, Valentin Leonhard Buchner, Yusuke Tashiro, Lei You, Pawel Andrzej
Herman, Mats Nordahl, Ruibo Tu, and Vilhelm Von Ehrenheim. Self-supervised learning of
time series representation via diffusion process and imputation-interpolation-forecasting mask. In
_Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining_,
pp. 2560–2571, 2024.


Benjamin Shickel, Patrick J. Tighe, Azra Bihorac, and Parisa Rashidi. Deep ehr: A survey of
recent advances in deep learning techniques for electronic health record analysis. _IEEE Journal_
_of Biomedical and Health Informatics_, 22(5):1589–1604, 2018.


Satya N. Shukla and Benjamin M. Marlin. Multi-time attention networks for irregularly sampled
time series. In _International Conference on Learning Representations (ICLR)_, 2021.


Sima Siami-Namini, Neda Tavakoli, and Akbar Siami Namin. The performance of lstm and bilstm
in forecasting time series. In _2019 IEEE International Conference on Big Data (Big Data)_, pp.
3285–3292, 2019. doi: 10.1109/BigData47090.2019.9005997.


Karan Singhal, Shekoofeh Azizi, Tao Tu, et al. Large language models encode clinical knowledge.
_Nature_, 620:172–180, 2023. doi: 10.1038/s41586-023-06291-2.


Karan Singhal, Shekoofeh Azizi, Tao Tu, et al. Toward expert-level medical question answering with
large language models. _Nature Medicine_, 30:225–234, 2024. doi: 10.1038/s41591-024-03423-7.


Congzheng Song and Ananth Raghunathan. Information leakage in embedding models. In _Pro-_
_ceedings of the 2020 ACM SIGSAC Conference on Computer and Communications Security_, pp.
377–390. ACM, 2020. doi: 10.1145/3372297.3417270.


Paul E. Stang, Patrick B. Ryan, Judith A. Racoosin, J. Marc Overhage, Abraham G. Hartzema,
Christian Reich, Emily Welebob, Thomas Scarnecchia, and Janet Woodcock. Advancing
the science for active surveillance: rationale and design for the observational medical outcomes partnership. _Annals_ _of_ _Internal_ _Medicine_, 153(9):600–606, 2010. doi: 10.7326/
0003-4819-153-9-201011020-00010.


Ethan Steinberg, Kenneth Jung, Jason A. Fries, Conor K. Corbin, Stephen R. Pfohl, and Nigam H.
Shah. Language models are an effective representation learning technique for electronic health
record data. _Journal_ _of_ _Biomedical_ _Informatics_, 113:103637, 2020. doi: 10.1016/j.jbi.2020.
103637.


Hongjin Su, Weijia Shi, Jungo Kasai, Yizhong Wang, Yushi Hu, Mari Ostendorf, Wen-tau Yih,
Noah A Smith, Luke Zettlemoyer, and Tao Yu. One embedder, any task: Instruction-finetuned
text embeddings. _arXiv preprint arXiv:2212.09741_, 2022.


Adarsh Subbaswamy, Bryant Chen, and Suchi Saria. A unifying causal framework for analyzing
dataset shift-stable learning algorithms. _Journal of Causal Inference_, 10(1):64–89, 2022.


Baochen Sun and Kate Saenko. Deep coral: Correlation alignment for deep domain adaptation. In
_Computer Vision – ECCV 2016 Workshops_, volume 9915 of _Lecture Notes in Computer Science_,
pp. 443–450, Cham, 2016. Springer. doi: 10.1007/978-3-319-49409-8 ~~3~~ 5.


Chenxi Sun, Hongyan Li, Yaliang Li, and Shenda Hong. Test: Text prototype aligned embedding to
activate llm’s ability for time series, 2024. [URL https://arxiv.org/abs/2308.08241.](https://arxiv.org/abs/2308.08241)


Harini Suresh, Nathan Hunt, Alistair Johnson, Leo Anthony Celi, Peter Szolovits, and Marzyeh
Ghassemi. Clinical intervention prediction and understanding with deep networks. In _Proceedings_
_of the Machine Learning for Healthcare Conference (MLHC)_, pp. 322–337, 2017.


Parinaz Tabari, Gennaro Costagliola, Mattia De Rosa, and Martin Boeker. State-of-the-art fast
healthcare interoperability resources (fhir)–based data model and structure implementations: Systematic scoping review. _JMIR medical informatics_, 12(1):e58445, 2024.


Sabera Talukder, Yisong Yue, and Georgia Gkioxari. Totem: Tokenized time series embeddings for
general time series analysis, 2025. [URL https://arxiv.org/abs/2402.16412.](https://arxiv.org/abs/2402.16412)


18


Published as a conference paper at ICLR 2026


Mingtian Tan, Mike A Merrill, Vinayak Gupta, Tim Althoff, and Tom Hartvigsen. Are language
models actually useful for time series forecasting? _arXiv preprint arXiv:2401.12345_, 2024.


Qingxiong Tan, Mang Ye, Andy Jinhua Ma, Baoyao Yang, Terry Cheuk-Fung Yip, Grace Lai-Hung
Wong, and Pong C. Yuen. Explainable uncertainty-aware convolutional recurrent neural network
for irregular medical time series. _IEEE Transactions on Neural Networks and Learning Systems_,
32(10):4665–4679, 2021. doi: 10.1109/TNNLS.2020.3025813.


Liyan Tang, Zhaoyi Sun, Betina Idnay, Jordan G. Nestor, Ali Soroush, Pierre A. Elias, Ziyang Xu,
Ying Ding, Greg Durrett, Justin F. Rousseau, Nigam H. Shah, and Fei Wang. Evaluating large
language models on medical evidence summarization. _npj Digital Medicine_, 6(1):158, 2023. doi:
10.1038/s41746-023-00896-7.


Yusuke Tashiro, Jiaming Song, Yang Song, and Stefano Ermon. Csdi: Conditional score-based
diffusion models for probabilistic time series imputation. In _Advances_ _in_ _Neural_ _Information_
_Processing Systems (NeurIPS)_, volume 34, pp. 24804–24816, 2021.


Peter J. Thoral, Jan M. Peppink, Rutger H. Driessen, Eric J. G. Sijbrands, Erwin J. O. Kompanje,
Lewis J. Kaplan, Helen Bailey, Jozef Kesecioglu, Maurizio Cecconi, Matthew Churpek, and Paul
Elbers. Sharing icu patient data responsibly under the sccm/esicm joint initiative: Amsterdamumcdb. _Critical Care_, 25(1):307, 2021.


Nenad Tomasev, Xavier Glorot, Jack W. Rae, Michal Zielinski, Harry Askham, Allan Saraiva,
Kayleigh Hajewski, and et al. A clinically applicable approach to continuous prediction of future
acute kidney injury. _Nature_, 572(7767):116–119, 2019.


Patara Trirat, Yooju Shin, Junhyeok Kang, Youngeun Nam, Jihye Na, Minyoung Bae, Joeun Kim,
Byunghyun Kim, and Jae-Gil Lee. Universal time-series representation learning: A survey, 2024.
[URL https://arxiv.org/abs/2401.03717.](https://arxiv.org/abs/2401.03717)


Robin van de Water, Hendrik Schmidt, Paul Elbers, Patrick Thoral, Bert Arnrich, and Patrick Rockenschaub. Yet another icu benchmark: A flexible multi-center framework for clinical ml, 2024.
[URL https://arxiv.org/abs/2306.05109.](https://arxiv.org/abs/2306.05109)


Dave Van Veen, Chris Van Uden, Leon Blankemeier, Jean-Benoit Delbrouck, Amin Aali, Christian
Bluethgen, and Ankit Pareek. Adapted large language models can outperform medical experts in
clinical text summarization, 2023.


Dave Van Veen, Cara Van Uden, Louis Blankemeier, Jean-Benoit Delbrouck, Asad Aali, Christian
Bluethgen, Anuj Pareek, Malgorzata Polacin, Eduardo Pontes Reis, Anna Seehofnerov´a, Nidhi
Rohatgi, Poonam Hosamani, William Collins, Neera Ahuja, Curtis P. Langlotz, Jason Hom, Sergios Gatidis, John Pauly, and Akshay S. Chaudhari. Adapted large language models can outperform medical experts in clinical text summarization. _Nature Medicine_, 30(4):1134–1142, 2024.
doi: 10.1038/s41591-024-02855-5.


Carina Nina Vorisek, Moritz Lehne, Sophie Anne Ines Klopfenstein, Paula Josephine Mayer,
Alexander Bartschke, Thomas Haese, and Sylvia Thun. Fast healthcare interoperability resources
(fhir) for interoperability in health research: systematic review. _JMIR medical informatics_, 10(7):
e35724, 2022.


Liang Wang, Nan Yang, Xiaolong Huang, Linjun Yang, Rangan Majumder, and Furu Wei. Improving text embeddings with large language models, 2024a. [URL https://arxiv.org/abs/](https://arxiv.org/abs/2401.00368)
[2401.00368.](https://arxiv.org/abs/2401.00368)


Shiyu Wang, Haixu Wu, Xiaoming Shi, Tengge Hu, Huakun Luo, Lintao Ma, James Y Zhang,
and Jun Zhou. Timemixer: Decomposable multiscale mixing for time series forecasting. _arXiv_
_preprint arXiv:2405.14616_, 2024b.


Gerald Woo, Chenghao Liu, Doyen Sahoo, Akshat Kumar, and Steven C. H. Hoi. Cost: Contrastive
learning of disentangled seasonal-trend representations for time series forecasting. In _Interna-_
_tional Conference on Learning Representations (ICLR)_, 2022.


19


Published as a conference paper at ICLR 2026


Chaoyi Wu, Peng Qiu, Jing Liu, Hao Gu, Ning Li, Yiyuan Zhang, Yixuan Wang, and Weidi Xie. Towards evaluating and building versatile large language models for medicine. _npj Digital Medicine_,
8(1):58, 2025.


Xiaoyang Yang, Aonan Chen, Neda PourNejatian, et al. A large language model for electronic
health records. _npj Digital Medicine_, 5:194, 2022. doi: 10.1038/s41746-022-00742-2.


Hugo Y`eche, Rita Kuznetsova, Marc Zimmermann, Matthias H¨user, Xinrui Lyu, Martin Faltys, and
Gunnar R¨atsch. Hirid-icu-benchmark: A comprehensive machine learning benchmark on highresolution icu data. In _NeurIPS 2021 Datasets and Benchmarks Track_, 2021.


Hugo Y`eche, Rita Kuznetsova, Marc Zimmermann, Matthias H¨user, Xinrui Lyu, Martin Faltys, and
Gunnar R¨atsch. Hirid-icu-benchmark: A comprehensive machine learning benchmark on highresolution icu data. In _NeurIPS Datasets and Benchmarks_, 2021.


Jinsung Yoon, Daniel Jarrett, and Mihaela Van der Schaar. Time-series generative adversarial networks. _Advances in neural information processing systems_, 32, 2019.


Zhihan Yue, Yue Wang, Yujing Sun, Yujin Zheng, Qing He, Jian Zeng, and Rong Jin. Ts2vec: Towards universal representation of time series. In _Proceedings of the AAAI Conference on Artificial_
_Intelligence_, volume 36, pp. 8982–8990, 2022.


Hugo Y`eche, Rita Kuznetsova, Marc Zimmermann, Matthias H¨user, Xinrui Lyu, Martin Faltys, and
Gunnar R¨atsch. Hirid-icu-benchmark – a comprehensive machine learning benchmark on highresolution icu data, 2022. [URL https://arxiv.org/abs/2111.08536.](https://arxiv.org/abs/2111.08536)


Jamil Zaghir, Marco Naguib, Mina Bjelogrli´c, Aur´elie N´ev´eol, Xavier Tannier, and Christian Lovis.
Prompt engineering paradigms for medical applications: Scoping review and recommendations
for better practices. _Journal of Medical Internet Research_, 26:e60501, 2024. doi: 10.2196/60501.


Georgios Zerveas, Srivatsan Jayaraman, Dheevatsa Patel, Arshan Bhamidipaty, and Carsten Eickhoff. A transformer-based framework for multivariate time series representation learning. _arXiv_
_preprint arXiv:2010.02803_, 2021.


Xi Zhang, Yuan Pu, Yuki Kawamura, Andrew Loza, Yoshua Bengio, Dennis L. Shung, and
Alexander Tong. Trajectory flow matching with applications to clinical time series modelling. In _Advances in Neural Information Processing Systems_, volume 37, pp. 107198–107224,
2024a. URL [https://proceedings.neurips.cc/paper_files/paper/2024/](https://proceedings.neurips.cc/paper_files/paper/2024/file/c1e67cde895c3c91edb43569ad0df260-Paper-Conference.pdf)
[file/c1e67cde895c3c91edb43569ad0df260-Paper-Conference.pdf.](https://proceedings.neurips.cc/paper_files/paper/2024/file/c1e67cde895c3c91edb43569ad0df260-Paper-Conference.pdf)


Xiyuan Zhang, Ranak R. Chowdhury, Rajesh K. Gupta, and Jingbo Shang. Large language models
for time series: A survey. In _Proceedings of the 33rd International Joint Conference on Artificial_
_Intelligence (IJCAI)_, 2024b.


Tian Zhou, PeiSong Niu, Xue Wang, Liang Sun, and Rong Jin. One fits all:power general time series
analysis by pretrained lm, 2023. [URL https://arxiv.org/abs/2302.11939.](https://arxiv.org/abs/2302.11939)


Zhihao Zhu, Ninglu Shao, Defu Lian, Chenwang Wu, Zheng Liu, Yi Yang, and Enhong Chen.
Understanding privacy risks of embeddings induced by large language models. _arXiv_ _preprint_
_arXiv:2404.16587_, 2024.


20


Published as a conference paper at ICLR 2026


A USAGE OF LARGE LANGUAGE MODELS


We used large language models (LLMs) in two strictly limited ways:


1. **Locally** **hosted** **models.** For development convenience, we ran LLMs on institutionmanaged GPUs within access-controlled, offline (or firewall-restricted) servers. These
models were used only for debugging assistance and rapid prototyping under our secure
computing environment; no research data were exported outside these servers.

2. **Third-party services for copy-editing and minor figure elements.** We used the Gemini
and ChatGPT families solely to polish grammar and wording of author-written text and
to generate small iconography embedded within figures (e.g., simple symbols), _not_ full
figures and not scientific content. We did not use these services to generate methods, ideas,
analyses, code, or experiments. No sensitive or identifying data were included in prompts.
All suggested edits were manually reviewed by the authors.


Beyond the above, LLMs were _not_ involved in the conception of ideas, study design, algorithm development, experiments, analyses, or writing of substantive content. All contributions—conceptual,
methodological, experimental, and explanatory—are entirely by the authors.


B EXTENDED RELATED WORK


**Privacy** **and** **attribute** **inference** **in** **embeddings.** Learned representations may inadvertently reveal sensitive attributes. Recent analyses show that embeddings can leak information via inversion,
membership, or attribute–inference attacks, even when protected features are not explicit (Song &
Raghunathan, 2020; Zhu et al., 2024). Emerging auditing frameworks evaluate demographic attribute inference from model outputs and intermediate representations (Panda et al., 2025). We
therefore adopt demographic recoverability (age and sex) from learned embeddings as a practical
proxy for privacy risk, situating our evaluation alongside this auditing literature.


**ICU** **Time** **Series** **and** **Clinical** **Benchmarks** Public ICU datasets drove clinical ML, notably
MIMIC and eICU (Johnson et al., 2016; Pollard et al., 2018; Johnson et al., 2023b). Early pipelines
were bespoke (Harutyunyan et al., 2019; McDermott et al., 2021), prompting standardized benchmarks: canonical MIMIC tasks (Harutyunyan et al., 2019), the HiRID ICU benchmark with high
frequency signals and evaluation code (Y`eche et al., 2021), and YAIB harmonizing MIMIC, eICU,
HiRID, and AmsterdamUMCdb (van de Water et al., 2024; Thoral et al., 2021). Aggregations such
as BlendedICU broaden multi center evaluation (Oliver et al., 2023), and foundation pretraining over
heterogeneous ICU series is emerging (Burger et al., 2024). Deep sequential models improve early
warning and trajectory modeling (Hyland et al., 2020; Tomasev et al., 2019; Ji et al., 2024; 2025),
and EHR sequence models reach expert level outcomes (Rajkomar et al., 2018). Persistent challenges include explainability, irregular sampling, and missingness (Morid et al., 2021), addressed by
interpretable modeling and transformer forecasting in clinical settings (Tan et al., 2021; Hartvigsen
et al., 2022; Zhang et al., 2024a). Surveys stress the influence of curation, task design, and preprocessing (N´u˜nez Reiz et al., 2019; Shickel et al., 2018; Suresh et al., 2017). Recent pipelines
underscore standardization needs (Gupta et al., 2022; He & Chiang, 2025).


**Imputation** **and** **Representation** **Learning** **for** **Time** **Series.** Irregular sampling and missingness
are central in clinical time series. Model based imputers encode absence patterns or learn imputation with prediction (Che et al., 2018; Cao et al., 2018), while generative methods improve accuracy
through diffusion and realistic dynamics (Tashiro et al., 2021; Yoon et al., 2019). Continuous time
and structure aware encoders address nonuniform sampling and uncertainty (Fortuin et al., 2020;
Rubanova et al., 2019; De Brouwer et al., 2019; Kidger et al., 2020; Shukla & Marlin, 2021). Self
supervised objectives and transformer encoders learn general purpose representations (Eldele et al.,
2021; Yue et al., 2022; Woo et al., 2022; Zerveas et al., 2021; Franceschi et al., 2019). Diffusion
style self supervision couples imputation, interpolation, and forecasting masks for transferable embeddings (Senane et al., 2024). Decoder only foundation pretraining yields strong forecasting across
domains (Das et al., 2024). Earlier work spans dimensionality reduction and deep recurrent networks
(Li, 2019; Balamurali, 2023; Siami-Namini et al., 2019). Recent ideas explore discrete tokenization
and approximating LLM embedding spaces (Talukder et al., 2025; Sun et al., 2024). In healthcare,
pattern based embeddings and semantic grouping improve interpretability (Feremans et al., 2022;


21


Published as a conference paper at ICLR 2026


Kuznetsova et al., 2023). Surveys advocate universal representations robust to noise, sparsity, and
shift (Trirat et al., 2024).


**Large Language Models in Healthcare and Time Series.** Large language models have advanced
clinical NLP and representation learning. Domain pretrained transformers on coded EHRs improve
disease prediction (Li et al., 2020a; Rasmy et al., 2021), clinical scale models achieve strong extraction and inference (Yang et al., 2022; Peng et al., 2023), and general medical systems perform
well on exams and challenges (Singhal et al., 2023; 2024; Nori et al., 2023). Early adaptations
demonstrated clinical question answering and discharge summarization (Agrawal et al., 2022; Lang
et al., 2022; Van Veen et al., 2023). For patient level prediction, audits report underperformance
and safety concerns (Brown et al., 2025; Wu et al., 2025; Griot et al., 2025; Moor et al., 2023).
Bridging modalities includes in modality pretraining, cross modality transfer and reprogramming,
prompt tuning, cross modal fine tuning, autoregressive prediction, and alignment with language
space (Kambale et al., 2023; Zhou et al., 2023; Chang et al., 2025; Jin et al., 2024; Cao et al., 2024;
Liu et al., 2024a;b; 2025). Textualization strategies often trail specialized forecasters (Ansari et al.,
2024; Gruver et al., 2023; Tan et al., 2024). Few shot models show gains, and surveys emphasize
formatting, scaling, and evaluation (Liu et al., 2023; Zhang et al., 2024b; Liventsev & Fritz, 2024).
Advances in embeddings and domain specific language models motivate LLM derived representations for ICU data (Pennington et al., 2014; Mikolov et al., 2013; Reimers & Gurevych, 2019; Su
et al., 2022; Muennighoff et al., 2022; Lee et al., 2024; BehnamGhader et al., 2024; Wang et al.,
2024a; Luo et al., 2022; Alsentzer et al., 2019).


Recent studies have also investigated serializing structured EHR data for LLM processing. Approaches like TabLLM (Hegselmann et al., 2023) and DeLLiriuM (Contreras et al., 2025) fine-tune
LLMs on serialized records for tabular classification or specific risk predictions. Others, such as
Lee et al. (2025), Gao et al. (2024), and Hegselmann et al. (2025), explore using frozen LLMs to
embed raw data serializations directly. While these methods demonstrate the utility of LLMs for
medical data, they primarily focus on sparse longitudinal records or single-site benchmarks. Our
work distinguishes itself by addressing dense, irregular ICU time-series, where we find that direct
serialization yields excessive sequence lengths and brittleness to distribution shifts, necessitating a
summarization step for effective cross-site portability.


Additionally, domain-specific foundation models like Med-BERT (Rasmy et al., 2021) and GenHPF
(Hur et al., 2024) apply Transformer-based pretraining to structured EHR codes. While effective for
longitudinal disease prediction within a specific health system, these models rely on fixed vocabularies that can be sensitive to schema variations and distribution shifts across institutions. Furthermore,
they often struggle to capture the high-frequency numeric dynamics of intensive care data compared
to generalist time-series models or semantic LLM representations, which offer greater flexibility and
transferability in diverse deployment settings.


C DATASET AND PROCESSING


C.1 GENERAL INFORMATION


**MIMIC** **(80,749** **samples).** The processed ICU time series comprises 60 features: ALP,
ALT, Bicarbonate, Bilirubin, BloodUreaNitrogen, Calcium, Creatinine,
CreatinineKinase, Hemoglobin, INR, Lactate, Magnesium, PaCO2, PaO2,
Phosphate, Platelets, Potassium, Sodium, Troponin, WBC, ph, AirwayPressure,
DiastolicBloodPressure, FiO2, GCS, HeartRate, ICDSC, MeanBloodPressure,
MinuteVentilation, PEEP, RespiratoryRate, SAS, SystolicBloodPressure,
Temperature, TidalVolume, UrineOutput, Analgesia, Antiarrhythmics,
Antibiotics, Anticoagulants, Antiepileptics, Antihypertensives,
Antipsychotics, CTScan, CaReplacement, Dialysis, Diuretics,
EnteralNutrition, ICPMonitor, KReplacement, MRI, MgReplacement, PPI,
Paralysis, TPN, Transfusions, UltraSound, Vasopressors, Ventilation, Xray.


**HiRID** **(36,019** **samples).** The processed ICU time series comprises 64 features: ALP,
ALT, AST, Bicarbonate, Bilirubin, BloodUreaNitrogen, Calcium, Chloride,
CreatineKinase, Creatinine, Glucose, Hemoglobin, INR, Lactate, Magnesium,
PaCO2, PaO2, Phosphate, Platelets, Potassium, Sodium, Troponin, WBC, ph,


22


Published as a conference paper at ICLR 2026


AirwayPressure, AirwayPressurePeak, DiastolicBloodPressure, FiO2,
FluidBalance, GCS, HeartRate, MeanBloodPressure, PEEP, RespiratoryRate,
SAS, Saturation, SystolicBloodPressure, Temperature, TidalVolume,
UrineOutput, Analgesia, Antiarrhythmics, Antibiotics, Anticoagulants,
Antiepileptics, Antihypertensives, Aspirin, CaReplacement, Dialysis,
Diuretics, ICPMonitor, Insulin, KReplacement, LiverToxicDrug,
MgReplacement, Neuroleptics, Paralysis, Saline, Sedation, Steroids,
TPN, Transfusions, Vasopressors, Ventilation.


**PPICU** **(47,119** **samples).** The processed ICU time series comprises 75 features:
ALP, ALT, AST, Bicarbonate, Bilirubin, BloodUreaNitrogen, Calcium,
Chloride, Creatinine, CreatinineKinase, GGT, Glucose, Hemoglobin,
INR, Lactate, Magnesium, PaCO2, PaO2, Phosphate, Platelets, Potassium,
Sodium, Troponin, WBC, ph, AirwayPressure, AirwayPressureIP,
AirwayPressurePeak, DiastolicBloodPressure, FiO2, FluidInput,
FluidOutput, GCS, HeartRate, ICDSC, MeanBloodPressure, MinuteVentilation,
PAVSupport, PC, PEEP, PlateauPressure, RespiratoryRate, SAS,
Saturation, SystolicBloodPressure, Temperature, TidalVolume,
UrineOutput, Analgesia, Antiarrhythmic, Antiarrhythmics, Antibiotics,
Anticoagulants, Antiepileptics, Antihypertensives, Aspirin, Dialysis,
Diuretics, EKG, EVD, ICPMonitor, InhaledVasodilator, Insulin,
Isoproterenol, MgReplacement, Neuroleptics, OsmoticTherapy, PPI, PS,
Paralysis, Sedation, Steroids, TPN, Transfusions, Vasopressors.


C.2 DATA PREPROCESSING DETAILS


We provide reproducible preprocessing pipelines for all ICU datasets considered in this work. This
appendix summarizes the steps at a high level, without referencing specific files or directories.


**Common** **setup.** We organize raw and processed data under a central data directory. Access to
each dataset follows the relevant data use agreements. Unless stated otherwise, per-stay sequences
are constructed at hourly resolution, and features are normalized using statistics computed on the
training split. All clinical features are selected in discussion with experienced practicing ICU clinicians.


HIRID


We first obtain authorized access and download the raw HiRID release. Because HiRID associates
each patient with a single ICU stay, we group all clinical and medication records by patient identifier
and construct a sparse, event-centric representation per patient. We then curate clinically meaningful
features and extend the feature dictionary to include start/end times and summary statistics for quality control and normalization. Using this curated set, we produce patient-level targets and serialize
time indices, value indices, and per-event counts for downstream modeling. Finally, we standardize
signals and combine them on a per-feature basis to ensure consistent scaling across patients and over
time.


MIMIC-IV


We begin by obtaining credentialed access and downloading the raw MIMIC-IV data, then convert
the raw tables into a columnar layout to improve I/O efficiency. Next, we filter to ICU stays that
exceed a minimum duration threshold, retaining this subset for further processing. In collaboration
with clinicians, we develop a mapping from measurement identifiers to a study feature set; this
mapping is intentionally decoupled so it can be revised without reprocessing earlier stages. We
restrict event tables to the curated features and carry forward only necessary metadata into a projectspecific processed area. Core administrative and ICU stay tables are merged to derive age, gender,
mortality, and length-of-stay labels, excluding pediatric subjects for adult-only cohorts. We then
materialize a subject-centric layout (diagnoses, events, procedures, stays), preferring numeric event
values where available, and write feature-separated storage to enable efficient access and validation
across tasks.


23


Published as a conference paper at ICLR 2026


PPICU


For PPICU, we convert all raw sources into a uniform, analysis-friendly tabular format and separate multi-signal streams into per-feature tables for efficient access; laboratory measurements are
processed analogously. We merge demographic and outcome information to construct a source
stay table with identifiers and key labels (age, gender, length of stay, mortality). The feature space
is restricted to the analysis cohort, with per-feature summary statistics computed for clinician review; clinician-verified filters are then applied to remove implausible or out-of-range values. From
the merged feature data, we generate per-stay tables sorted by measurement time and align feature
names to a harmonized schema. A global time index keyed by stay identifier is built with arrays
of time points at the chosen resolution. Each stay is finally converted into both a sparse dictionarybacked representation and a dense, zero-filled discrete representation, and we emit the resulting
artifacts alongside train/validation/test splits.


D TRAINING DETAILS


D.1 SYSTEM CONFIGURATION


All experiments were run on NVIDIA L40S GPUs. Unless noted, training and inference can be
paused and fully completed on a single L40S (24 GB); large-scale reference runs used 4 _×_ L40S for
throughput.


D.2 TSDE EMBEDDING EXTRACTION


The TSDE model is trained in a self-supervised manner on the same training split as downstream
tasks. We mask the final 24 h of each sequence and train the model to predict the masked segment.
After convergence, we extract the hidden representation as the TSDE embedding for each record.


D.3 TFM EMBEDDING EXTRACTION


We use the time-series foundation model google/timesfm-1.0-200m. We run inference on
the full HiRID/MIMIC/PPICU datasets and extract representations from the last two transformer
blocks. The penultimate layer yields consistently better downstream performance and is used in all
main results.


D.4 HYPERPARAMETER DETAILS


For baselines, we tune batch size and learning rate with early stopping and report the best configuration per method:


    - **right** ~~**s**~~ **hift:** batch size 512, learning rate 1 _×_ 10 _[−]_ [5]

    - **mean:** batch size 512, learning rate 4 _×_ 10 _[−]_ [5]

    - **interpolation:** batch size 256, learning rate 5 _×_ 10 _[−]_ [5]


_Record2Vec_ models are trained under a common setting: batch size 512, learning rate 1 _×_ 10 _[−]_ [5] .
All methods are trained with seeds _{_ 42 _,_ 84 _,_ 1005 _,_ 2025 _}_ ; we report the mean and standard deviation
across seeds.


D.5 FEW-SHOT FINETUNING (16-SAMPLE SETTING)


We study an extreme low-data regime with only 16 labeled target samples and no held-out validation
set. Finetuning is performed with AdamW and a warmup–cosine schedule; the learning rate scales
with the effective batch size:


batch ~~s~~ ize
LRscaled = BASE ~~L~~ R _×_ BASE ~~L~~ R = 1 _×_ 10 _[−]_ [6] _,_ REF ~~F~~ INETUNE ~~B~~ S = 16 _._
REF ~~F~~ INETUNE ~~B~~ S _[,]_


Weight decay is 0 _._ 01 with _β_ 1 = 0 _._ 9 _,_ _β_ 2 = 0 _._ 999. Let _S_ be the total number of optimization steps
( _S_ = num ~~e~~ pochs _×_ steps ~~p~~ er ~~e~~ poch) and _S_ w = max _{_ 10 _, ⌊_ 0 _._ 03 _S⌋}_ the warmup steps. In the final


24


Published as a conference paper at ICLR 2026


experiment, _S_ = 100 _×_ 16. The per-step multiplier is



_,_ _t < S_ w _,_
_S_ w



_t_ + 1



_λ_ ( _t_ ) =








MIN ~~L~~ R ~~R~~ ATIO + �1 _−_ MIN ~~L~~ R ~~R~~ ATIO� 1 + cos� _π_ _S_ _[t][−]_ _−_ _[S]_ _S_ [w]







w _,_ _t ≥_ _S_ w _,_

2




_[t][−][S]_ [w] 
_S−S_ w



with MIN ~~L~~ R ~~R~~ ATIO = 0 _._ 10. Unless otherwise specified, weight updates apply to both the backbone and the task decoder.


**Concrete finetuning setup (Shared across all methods).**


    - **Batch size:** batch ~~s~~ ize = 16, LRscaled = 1 _×_ 10 _[−]_ [6] .

    - **Optimizer:** AdamW(lr = LRscaled _,_ weight ~~d~~ ecay = 0 _._ 01 _,_ _β_ = (0 _._ 9 _,_ 0 _._ 999)).

    - **Scheduler:** Warmup (first max _{_ 10 _,_ 0 _._ 03 _S}_ steps) then cosine decay to 0 _._ 1 _×_ the peak LR.


E PROMPTS USED FOR LLM SUMMARIZATION AND A CASE STUDY


In RQ5, we discussed the effect of prompts on the quality of embedding. The patient data is summarized on a split-by-feature manner, raw text as following: ALP has value 66 in hour
31. ALT has value 22 in hour 31. AST has value 17 in hour 31.
Bilirubin has value 4 in hour 31. Blood Urea Nitrogen has value
5.6 in hour 31. Calcium has value 1.99 in hour 31. Chloride
has value 115 in hour 31. Creatinine has value 103 in hour 31.
Creatinine Kinase has value 316 in hour 31. Hemoglobin has value
134 in hour 31. INR has value 0.99 in hour 31. Lactate has value
1.4 in hour 31. Magnesium has value 1.03 in hour 31. Phosphate
has value 0.78 in hour 31. Platelets has value 303 in hour 31.
Potassium has value 3.4 in hour 31. Sodium has value 150 in hour
31. Troponin has value 8 in hour 31. WBC has value 8.4 in hour
31. Airway Pressure has value 7.36 in hour 31, value 7.21 in hour
32, value 7.13 in hour 33, value 7.1 in hour 34, value 7.36 in
hour 35, value 6.29 in hour 36, value 5.08 in hour 37, value 5.3
in hour 38. Diastolic Blood Pressure has value 59 in hour 31,
value 56 in hour 32, value 77 in hour 33, value 80 in hour 34,
value 75 in hour 35, value 82 in hour 36, value 75 in hour 37,
value 78 in hour 38, value 69 in hour 39, value 68 in hour 40,
value 59 in hour 41, value 67 in hour 42, value 65 in hour 44.
FiO2 has value 30 in hour 31, value 30 in hour 32, value 30 in
hour 33, value 30 in hour 34, value 30 in hour 35, value 30 in
hour 36, value 30 in hour 37, value 30 in hour 38, value 21 in
hour 39, value 21 in hour 40, value 21 in hour 41, value 21 in
hour 42, value 21 in hour 43, value 21 in hour 44. FluidInput has
value 80 in hour 34, value 160 in hour 39. FluidOutput has value
100 in hour 39. GCS has value 8 in hour 32, value 8 in hour 33,
value 8 in hour 34, value 8 in hour 35, value 7 in hour 36, value
8 in hour 37, value 14 in hour 39, value 14 in hour 40, value 14
in hour 44. Heart Rate has value 97 in hour 31, value 101 in hour
32, value 94 in hour 33, value 93 in hour 34, value 99 in hour
35, value 104.5 in hour 36, value 105 in hour 37, value 102 in
hour 38, value 109 in hour 39, value 107 in hour 40, value 106 in
hour 41, value 102 in hour 42, value 105 in hour 43. Mean Blood
Pressure has value 66 in hour 31, value 62 in hour 32, value 83
in hour 33, value 85 in hour 34, value 81 in hour 35, value 87
in hour 36, value 82 in hour 37, value 85 in hour 38, value 80
in hour 39, value 75 in hour 40, value 68 in hour 41, value 74 in
hour 42, value 72 in hour 44. Minute Ventilation has value 4 in
hour 31, value 3.7 in hour 32, value 3.84 in hour 33, value 4.05


25


Published as a conference paper at ICLR 2026


in hour 34, value 6.54 in hour 35, value 5.51 in hour 36, value
4.56 in hour 37, value 4.4 in hour 38. PC has value 0 in hour
31, value 0 in hour 32, value 0 in hour 33, value 0 in hour 34,
value 0 in hour 35, value 0 in hour 36, value 0 in hour 37, value
0 in hour 38. PEEP has value 5.88 in hour 31, value 5.88 in hour
32, value 5.88 in hour 33, value 5.88 in hour 34, value 5.88 in
hour 35, value 4.78 in hour 36, value 3.68 in hour 37, value 3.68
in hour 38. Respiratory Rate has value 12.5 in hour 31, value
7 in hour 32, value 7 in hour 33, value 6.5 in hour 34, value 8
in hour 35, value 8.38 in hour 36, value 7.5 in hour 37, value
4 in hour 38, value 20 in hour 39, value 21 in hour 40, value
16 in hour 41, value 15 in hour 42, value 22 in hour 43, value
26 in hour 44, value 20 in hour 47. SAS has value 5 in hour 32,
value 5 in hour 33, value 5 in hour 34, value 5 in hour 35, value
5 in hour 36, value 4 in hour 37, value 4 in hour 39, value 4 in
hour 40, value 4 in hour 44. Saturation has value 96 in hour 31,
value 95 in hour 32, value 99 in hour 33, value 100 in hour 34,
value 99 in hour 35, value 99.5 in hour 36, value 100 in hour
37, value 100 in hour 38, value 96 in hour 39, value 93 in hour
40, value 94 in hour 41, value 97 in hour 42, value 96 in hour
43, value 96 in hour 44, value 95 in hour 45, value 94 in hour
46, value 94 in hour 47. Systolic Blood Pressure has value 94
in hour 31, value 84 in hour 32, value 102 in hour 33, value 106
in hour 34, value 106 in hour 35, value 105 in hour 36, value 108
in hour 37, value 109 in hour 38, value 110 in hour 39, value 102
in hour 40, value 101 in hour 41, value 97 in hour 42, value 98
in hour 44. Temperature has value 36.4 in hour 33, value 35.9
in hour 37. Tidal Volume has value 230 in hour 31, value 215 in
hour 32, value 235 in hour 33, value 267.5 in hour 34, value 115
in hour 35, value 300 in hour 36, value 255 in hour 37, value 480
in hour 38. Urine Output has value 350 in hour 31, value 100 in
hour 32, value 35 in hour 33, value 60 in hour 34, value 55 in
hour 35, value 60 in hour 36, value 60 in hour 37, value 300 in
hour 38, value 100 in hour 39, value 100 in hour 40, value 100 in
hour 44. Patient receives Analgesia at hour 32, 33, 34, 35, 36,
37, 38, 39. Patient receives Anticoagulants at hour 31, 32, 33,
34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47. Patient
receives Neuroleptics at hour 38, 39, 40, 41, 42, 43, 44, 45, 46,
47. Patient receives PS at hour 31, 32, 33, 34, 35, 36, 37, 38.
Patient receives Sedation at hour 32, 33, 34, 35, 36, 37, 38, 39.
Patient receives TPN at hour 32.


The following is the detailed prompts and samples of summarization


ZERO-SHOT


You are a clinical agent that analyze and then provide the most concise summarization on
ICU time series data for forecasting.


'**Summary:**\n\nPatient exhibits fluctuating hemodynamics and respiratory status. Key
observations:\n* ** [Hemodynamics:] ** [Initial] [hypotension] [(MBP] [66,] [SBP] [94)] [improved,] [then]
showed variability (MBP 62-87, SBP 84-110). DBP increased significantly from hour 32-36
(56-82) then decreased. Heart rate is consistently elevated (97-109).\n* ** [Respiratory:] **
Airway pressure decreased (7.36 -> 5.08) then increased. PEEP decreased (5.88 -> 3.68).
Respiratory rate varied significantly (7-26). FiO2 decreased from 30 to 21. Saturation
generally stable (95-100), with a dip to 93 at hour 40.\n* ** [Renal:] ** [Creatinine] [is] [high]
(103). Urine output is variable (35-350). BUN is slightly elevated (5.6).\n* ** [Neurologic:] **
GCS initially low (8), improved to 14, then decreased.\n* ** [Labs:] ** [Sodium] [is] [high] [(150).]
Other labs (ALP, ALT, AST, Bilirubin, CK, Troponin, WBC) are relatively stable or within
normal limits.\n* ** [Interventions:] ** [Continuous] [anticoagulation,] [analgesia,] [sedation,] [and]
neuroleptics administered. TPN given at hour 32.\n\n**Overall:** Patient shows signs of
initial instability with subsequent fluctuations in hemodynamics, respiratory parameters, and
neurological status. High sodium and creatinine are notable.'


26


Published as a conference paper at ICLR 2026


ICD


You are a clinical analysis agent. Summarize ICU time-series patient data for forecasting
using this structure:


        - Trend — overall direction of vitals, labs, therapies, and organ support.

        - Seasonality — repeating cycles (e.g., circadian).

        - Irregularities — acute deviations or events.


Map each diagnosis to its affected organ system (cardiac, respiratory, hepatic, renal,
neurologic, etc.). For every system, assign a severity score from 1 (least affected) to
10 (most severe) based on data patterns and level of support required. Output only the
summary in clear clinical prose, concluding with a semicolon-separated list of organ
systems and scores (e.g., “Cardiovascular 7/10; Respiratory 8/10; Hepatic 3/10”). Do not
explain your reasoning.


'Overall, the patient exhibits a complex trajectory with periods of relative stability
punctuated by acute deteriorations and improvements. Trends show initial hemodynamic
instability with low blood pressure, followed by a period of hypertension and tachycardia,
then a return towards lower pressures. Respiratory status is marked by a significant decrease
in airway pressure and PEEP, alongside variable respiratory rates and tidal volumes,
suggesting evolving ventilation needs. Neurologic status initially shows depressed GCS, which
improves significantly before a potential decline. Renal function shows initial oliguria
followed by periods of increased output, but creatinine remains elevated. Liver function tests
are relatively stable. There is no clear circadian pattern evident in the provided data.
Irregularities include a sharp drop in respiratory rate and tidal volume around hour 35, a
subsequent increase in tidal volume at hour 38, a significant improvement in GCS around hour
39, and fluctuations in fluid balance. The patient received multiple therapies including
analgesia, anticoagulants, neuroleptics, pressors (PS), and sedation, alongside
TPN.\n\nCardiovascular 7/10; Respiratory 8/10; Hepatic 3/10; Renal 6/10; Neurologic 6/10'


TREND


Examine the data closely and describe the trend changes step by step over time. For
example: from [start] to [midpoint], what happened? Then from [midpoint] to [end], what
happened? After describing each phase, conclude with an overall summary in natural
language. Summarize as many feature as possible starting from the most significant ones
in concise words. Only include your description and summarization.


"**Phase 1: Hour 31 to Hour 38**\n\nFrom hour 31 to hour 38, the patient showed signs of
initial instability followed by some improvement. Airway Pressure decreased steadily from 7.36
to 5.08, then slightly increased to 5.3. Diastolic Blood Pressure initially decreased from 59
to 56, then significantly increased to 80, fluctuating between 75 and 78 before rising again
to 82. FiO2 remained stable at 30 until hour 39. GCS remained low at 8, then dropped to 7
before improving to 14 by hour 39. Heart Rate increased from 97 to 105, then slightly
decreased to 102. Mean Blood Pressure decreased from 66 to 62, then increased significantly to
87, fluctuating between 82 and 85. Minute Ventilation increased from 4 to 6.54, then decreased
to 4.56 and 4.4. PEEP decreased from 5.88 to 3.68. Respiratory Rate decreased significantly
from 12.5 to 4, then increased sharply to 20. Saturation improved from 96 to 100, then
decreased to 96. Systolic Blood Pressure decreased from 94 to 84, then increased significantly
to 109. Temperature decreased from 36.4 to 35.9. Tidal Volume decreased from 230 to 115, then
increased dramatically to 480. Urine Output decreased significantly from 350 to 35, then
increased to 300. The patient received analgesia, anticoagulants, PS, and sedation during this
period.\n\n**Phase 2: Hour 39 to Hour 47**\n\nFrom hour 39 to hour 47, the patient's condition
showed further fluctuations and potential deterioration. Airway Pressure decreased from 5.3 to
6.29, then decreased to 5.08. Diastolic Blood Pressure decreased from 82 to 69, then 68, 59,
67, 65. FiO2 decreased from 21 to 21. GCS remained at 14. Heart Rate increased from 102."


COT


You are a healthcare agent that summarizes ICU patients’ time series status for future time
series forecasting. Analyze this step by step.


1. Analyze the time series data to identify key trends.

2. Based on the identified trends, determine potential clinical implications.

3. Summarize the findings and suggest possible interventions.


Summarize as many feature as possible starting from the most significant ones in concise
words and only respond with your summarization.


27


Published as a conference paper at ICLR 2026


**Dataset** **Embedding** **Silhouette**


HiRID Raw time-series 0.372
HiRID CoT embedding 0.452
HiRID ICD embedding 0.408
HiRID zero ~~s~~ hot embedding 0.638
HiRID Trend embedding 0.540
MIMIC Raw time-series 0.332
MIMIC CoT embedding 0.618
MIMIC ICD embedding 0.322
MIMIC zero ~~s~~ hot embedding 0.472
MIMIC Trend embedding 0.681
PPICU Raw time-series 0.486
PPICU CoT embedding 0.573
PPICU ICD embedding 0.385
PPICU zero ~~s~~ hot embedding 0.375
PPICU Trend embedding 0.485


Table 3: Silhouette scores for different embeddings across datasets (higher is better).


'**Summary of ICU Patient Status (Hour 31-47):**\n\n* ** [Hemodynamics:] ** [Initial] [hypotension]
(SBP 94, MBP 66) improved significantly (SBP 110, MBP 87) but shows recent instability (DBP
fluctuations, MBP decrease in hour 40-41). Tachycardia (HR 97-109) persists. Airway pressure
decreased significantly (7.36 to 5.08) then increased slightly, suggesting potential
improvement in lung mechanics followed by possible deterioration or change in ventilation
strategy.\n* ** [Respiratory] [Status:] ** [Respiratory] [rate] [is] [variable] [(initially] [low] [7-6.5,] [then]
increased to 20-26). FiO2 decreased from 30 to 21, indicating potential improvement in
oxygenation. Saturation generally stable (96-100) but decreased recently (93-94). Tidal volume
shows significant fluctuations (230-480).\n* ** [Renal] [Function:] ** [Creatinine] [is] [elevated]
(103), BUN is borderline high (5.6). Urine output is highly variable (350-35, then
100-300).\n* ** [Metabolic/Electrolytes:] ** [Hypernatremia] [(Na] [150).] [Hypokalemia] [(K] [3.4).]
Hypocalcemia (Ca 1.99). Hypophosphatemia (Phos 0.78). Lactate is borderline elevated (1.4).\n*
** [Neurological] [Status:] ** [GCS] [initially] [low] [(8),] [improved] [to] [14,] [then] [decreased] [again.\n] ** [Liver] [Function:] ** [Liver] [enzymes] [(ALP,] [ALT,] [AST)] [are] [mildly] [elevated.] [Bilirubin] [is] [borderline]
high (4).\n* ** [Coagulation:] ** [INR] [is] [normal] [(0.99).\n] - ** [Other:] ** [Platelets] [are] [normal]
(303). WBC is normal (8.4). Troponin is elevated (8).\n\n**Clinical Implications:**\n\n*
Hemodynamic instability requires close monitoring and potential vasopressor adjustment.\n*
Variable respiratory status suggests ongoing lung injury or changing ventilation needs.\n*
Renal dysfunction (elevated creatinine, variable urine output) warrants monitoring and
potential intervention.\n* Electrolyte imbalances (hypernatremia, hypokalemia, hypocalcemia,
hypophosphatemia) need correction.\n*'


F EMBEDDING QUALITY ASSESSMENT


We assess representation quality by applying the unsupervised dimensionality-reduction method
UMAP to the raw time series and four _gemini-2.0-flash_ –based summaries ( _CoT_, _ICD_, _zero_ ~~_s_~~ _hot_,
_Trend_ ). Although UMAP is fit without labels, we color points by mortality status (0/1) and quantify
cluster separation using the Silhouette score (higher is better), as a proxy for discriminability on
the downstream _mortality classification_ task. Silhouette scores are reported in Table 3. Results are
averaged over target embedding dimensions of 128, 256, and 512.


G PRIVACY RESULT TABLE


Table referenced in RQ6 is shown in Table 4.


H TOKEN COUNT COMPARISON (QWEN3-EMBEDDING-8B)


We report tokenization statistics for two PPICU text corpora using the Qwen3-Embedding-8B
tokenizer (special tokens excluded) across raw text and summarization text. Table 5 summarizes
per-string token counts. Average tokens for raw text is 6,106.5 and average tokens (Summarization
from ICD) is 234.0. Token reduction: 5,872.48 (2,509.3% vs. B).


28


Published as a conference paper at ICLR 2026


**Dataset** _→_ **HiRID** **MIMIC** **PPICU**


**Tasks** _→_ Age Gender Age Gender Age Gender
**Method** _↓_ MAE AUROC MAE AUROC MAE AUROC


Mean 0.805017 0.754615 0.803168 0.678225 0.76247 0.707425
Right shift 0.803392 0.742055 0.798042 0.694878 0.767785 0.726552
Interpolation 0.800455 0.726648 0.799755 0.670795 0.76095 0.720293
TSDE 0.798725 0.662075 0.797682 0.733638 0.76362 0.764377
TimesFM 0.798495 0.64247 0.795795 0.566465 0.759935 0.63862
No-Summary 0.801658 0.653393 0.803828 0.640195 0.812675 0.666798
Llama 3.1 0.801658 0.64383 0.805292 0.623775 0.81619 0.643475
MedGemma 0.801207 0.645748 0.803142 0.61944 0.814385 0.652317
Gemini 2.0-Flash 0.801828 0.650965 0.805535 0.605605 0.813318 0.646813


**Dataset** _→_ **HiRID** _→_ **PPICU** **MIMIC** _→_ **PPICU** **PPICU** _→_ **PPICU**


**Tasks** _→_ Age Gender Age Gender Age Gender
**Method** _↓_ MAE AUROC MAE AUROC MAE AUROC


Mean 0.805353 0.63862 0.78551 0.48239 0.00 0.000
Right shift 0.791562 0.63101 0.77174 0.63016 0.00 0.000
Interpolation 0.78547 0.6317 0.778125 0.63008 0.00 0.000
TSDE 0.7615 0.452603 0.755202 0.457027 0.00 0.000
TimesFM 0.760583 0.63862 0.75289 0.6113 0.00 0.000
No-Summary 0.811862 0.643015 0.80723 0.635738 0.00 0.000
Llama 3.1 0.81223 0.63101 0.80953 0.63016 0.00 0.000
MedGemma 0.812695 0.64306 0.805072 0.633265 0.00 0.000
Gemini 2.0-Flash 0.813743 0.642868 0.809338 0.63083 0.00 0.000


Table 4: RQ6 (Privacy): Age and gender prediction. Age is evaluated with MAE; Gender with
AUROC.


Table 5: Per-string tokenization summary (Qwen3-Embedding-8B; no special tokens).


count total mean std max


File A (Raw Text) 46,818 285,894,402 6,106.51 3,328.77 13,233.00
File B (ICD Summarization) 47,119 11,027,274 234.03 60.52 567.00


We add a more detailed report of latency, GPU time, token usage and approximate costs across all of
methods in Record2Vec in Table 6. We report inference + embedding latency, GPU time per batch,
token counts and costs per patient. Specifically, the language models are served on 4 NVIDIA L40S
GPUs using vLLM inference; the embedding model is served on 1 L40S for the summarizationbased methods, while the no-summarization baseline uses 2 L40S. Additionally, we compare the
inference time using a deterministic template (no summarization). Balancing the results and costs,
we find Gemini-2.0-flash results the least latency/costs while maintaining high performance, with a
cost of 0.7 dollar per 1000 samples and 0.26s latency per patient.


I 16-SAMPLE FEW-SHOT FINETUNE RESULTS


In this section, we report the detailed mean _±_ std results under our 16-sample few-shot finetuning
scenario as Table 7. This is complementary to Figure 5.


J 1000 SAMPLES TRAINING RESULTS


In the section, we record the comparison between results of pre-training using 1000 in-distribution
samples and 16-sample few-shot finetuning result of Record2Vec. This is a simulation in real world
settings for smaller local hospitals, where they have less sample to train a robust model. The 1000
samples are chosen at random and shared across methods to ensure fair comparison.


29


Published as a conference paper at ICLR 2026


**Model** **Latency (per sample)** **GPU time (per batch)** **Token counts** **Cost (per 1k samples)**


MedGemma + Qwen 0 _._ 784 + 0 _._ 026 s 3959 _._ 41 + 119 _._ 61 ms 234 _._ 03 tks/sample Llama + Qwen 0 _._ 25406 + 0 _._ 023 s 1299 _._ 4 + 117 _._ 24 ms 254 _._ 17 tks/sample Gemini + Qwen 0 _._ 28 + 0 _._ 036 s - 293 _._ 44 tks/sample 0 _._ 7 $/1k samples
Qwen (no summarization) 2 _._ 9675 s 23608 _._ 14 ms 6106 _._ 56 tks/sample 

Table 6: Latency, GPU time, token usage, and approximate cost of different summarization/inference pipelines.


**Dataset** _→_ **HiRID** _→_ **PPICU** **MIMIC** _→_ **PPICU** **Wins**


**Task** _→_ Forecast LoS Mortality Forecast LoS Mortality
**Method** _↓_ MSE _↓_ MAE _↓_ AUROC _↑_ MSE _↓_ MAE _↓_ AUROC _↑_


Mean 0 _._ 133 _±_ 0 _._ 001 2 _._ 678 _±_ 0 _._ 229 0 _._ 600 _±_ 0 _._ 007 0 _._ 183 _±_ 0 _._ 003 1 _._ 171 _±_ 0 _._ 284 0 _._ 565 _±_ 0 _._ 050 0
Right shift 0 _._ 136 _±_ 0 _._ 002 1 _._ 803 _±_ 0 _._ 041 0 _._ 621 _±_ 0 _._ 036 0 _._ 181 _±_ 0 _._ 003 0 _._ 662 _±_ 0 _._ 056 0 _._ 606 _±_ 0 _._ 036 0
Interpolation 0 _._ 139 _±_ 0 _._ 001 1 _._ 999 _±_ 0 _._ 123 0 _._ 605 _±_ 0 _._ 033 0 _._ 183 _±_ 0 _._ 003 0 _._ 972 _±_ 0 _._ 090 0 _._ 563 _±_ 0 _._ 028 0
TFM 0 _._ 144 _±_ 0 _._ 005 0 _._ 896 _±_ 0 _._ 042 0 _._ 686 _±_ 0 _._ 003 0 _._ 163 _±_ 0 _._ 001 1 _._ 067 _±_ 0 _._ 028 0 _._ 683 _±_ 0 _._ 002 0
TSDE 0 _._ 302 _±_ 0 _._ 002 0 _._ 795 _±_ 0 _._ 036 0 _._ 507 _±_ 0 _._ 017 0 _._ 392 _±_ 0 _._ 016 0 _._ 643 _±_ 0 _._ 170 0 _._ 586 _±_ 0 _._ 025 0
Record2Vec **0** _._ **022** _±_ **0** _._ **000** **0** _._ **500** _±_ **0** _._ **005** **0** _._ **792** _±_ **0** _._ **002** **0** _._ **0215** _±_ **0** _._ **000** **0** _._ **448** _±_ **0** _._ **003** **0** _._ **750** _±_ **0** _._ **008** 6


Table 7: Transfer performance from HiRID/MIMIC to PPICU. Values are mean _±_ std. Best per
column in **bold** ; second-best underlined. Wins count the number of best results per method.


K STRONG MORTALITY TRANSFER RESULTS


In this section, we report transfer learning results for strong mortality baselines: LSTM, GRU,
TCN, Transformer as mentioned in Y`eche et al. (2022). We observe that none surpass our simple
downstream classifier, PatchTSMixer, which achieves an AUROC of 0.72. (Table 9). This suggests
that there is still a need to develop models better suited to transfer-learning settings.


L EMBEDDER ABLATIONS


We performed additional ablations on the choice of embedding model and pooling / normalization
strategy. Overall, we observe three main trends: (i) stronger embedding models generally yield
better performance, although the gains are modest across current SOTA models; (ii) a weaker, nonSOTA embedder degrades performance but still remains above our non-summarization baseline; and
(iii) our method is largely robust to changes in pooling and normalization, with the recommended
configuration from the model documentation giving the most consistent performance across benchmarks.


On our base embedder Qwen3-Embedding-8B, we tested the following pooling + normalization
pairs: _mean + L2_ (our default), _mean + none_, _CLS + L2_, _last + L2_, and _max + L2_ . In addition, we
replaced Qwen3 with the current MTEB leader nvidia/llama-embed-nemotron-8b and
the prior SOTA gte-Qwen2-7B-instruct. The in-distribution ablation results on PPICU are
reported in Table 10, and the HiRID _→_ PPICU transfer ablations are shown in Table 11.


M DETAILED RESULTS FOR COMPARING PROMPTING STRATEGIES AND

SUMMARIZATION METHODS


In this section, we provide the detailed performance values used to generate the rank distribution
plots in Figure 3 and Figure 4. These figures provide an intuitive visualization of how different
summarization and prompting strategies affect relative performance across our benchmark.


The rankings are determined by comparing the performance of the competing methods on five specific downstream tasks, using the same metrics reported in the main results (Tables 1 and 2). We
utilize Mean Squared Error (MSE) for forecasting, Mean Absolute Error (MAE) for length-of-stay
prediction, AUROC for mortality prediction, and Recall for both treatment planning (Drug) and measurement ordering (Lab). For the summarization analysis in Figure 3, ranks are computed across four
methods: No-summary, Llama 3.1, MedGemma, and Gemini 2.0 Flash. For the prompting analysis
in Figure 4, we compare four variants: Zero-shot, In-Context Learning (ICD), Chain-of-Thought
(CoT), and Trend.


30


Published as a conference paper at ICLR 2026


**Task** **Small PPICU** **Few-shot Finetune (Record2Vec)**


Mortality 0.6843 0.72
LoS 1.03 0.49
Forecast 0.62 0.183
Feature 0.901 0.97
Lab 0.94 0.97


Table 8: Performance comparison between models trained on a small PPICU subset vs. few-shot
finetuned models.


**LSTM** **GRU** **Transformer** **TCN**


H _→_ P Baseline 0.640 0.687 0.579 0.719
H _→_ P Record2Vec 0.69788 0.6838 0.679 0.684
M _→_ P Baseline 0.5235 0.5476 0.564 0.719
M _→_ P Record2Vec 0.722 0.685 0.682 0.695


Table 9: Model performance for HiRID _→_ PPICU (H _→_ P) and MIMIC _→_ PPICU (M _→_ P), comparing
baseline vs. Record2Vec representations.


The rank counts are aggregated across two distinct experimental settings. The “In-Distribution”
results (shown in the left subfigures) aggregate rankings over 15 total tasks, corresponding to five
tasks evaluated across three source datasets. The “Transfer Learning” results (shown in the right
subfigures) aggregate rankings over 30 total tasks, covering five tasks across six distinct transfer
directions. For the Figure 4, we only considered three sets of transfers (total 15 numbers). Table
12, Table 13 & 14, Table 15, and Table 16 present the exact performance numbers used to construct
these rank distributions, allowing for direct inspection of the underlying values.


N GENHPF MODIFICATION AND REPLICATION DETAILS


ICU data contain a far greater number of features observed over a much shorter time horizon, with
multiple events often occurring simultaneously. When converting ICU data into a textual representation following GenHPF (Hur et al., 2024), we adopt a simple hierarchy: features are first divided
into laboratory, vital, and binary (therapy / intervention) groups, and each feature is concatenated
with its group prefix. For example, the feature Hemoglobin is encoded as lab ~~H~~ emoglobin.
The feature groupings used for the three datasets are summarized in Table 17.


O DETAILED RESULTS


We provide detailed results and tables in this section for a comprehensive comparison between
LLM-based summarize-then-embed pipeline with the three baseline methods.


31


Published as a conference paper at ICLR 2026


**Ablations** **Forecast** **LoS** **Mort** **Drug** **Lab**


Qwen3-mean-l2 0.021 0.347 0.90 0.911 0.931
Qwen3-mean-none 0.027 0.371 0.88 0.871 0.919
Qwen3-cls-l2 0.024 0.530 0.89 0.900 0.940
Qwen3-last-l2 0.022 0.423 0.89 0.920 0.923
gte-Qwen2-instruct 0.028 0.480 0.88 0.886 0.918
llama-embed-nemotron 0.021 0.379 0.89 0.9097 0.929
Baseline 0.040 0.378 0.52 0.878 0.857


Table 10: Ablations on PPICU (in-distribution).


**Ablations** **Forecast** **LoS** **Mort** **Drug** **Lab**


Qwen3-mean-l2 0.183 0.69 0.72 0.97 0.97
Qwen3-mean-none 0.209 0.66 0.71 0.94 0.96
Qwen3-cls-l2 0.230 0.78 0.50 0.995 0.98
Qwen3-last-l2 0.190 0.78 0.73 0.94 0.96
gte-Qwen2-instruct 0.250 0.82 0.50 0.93 0.96
llama-embed-nemotron 0.190 0.72 0.713 0.96 0.998
Baseline 0.306 1.09 0.50 0.42 0.77


Table 11: Ablations for HiRID _→_ PPICU transfer.


Table 12: Summarization methods performance comparison across 15 in-distribution tasks (Figure
3 left subfgure)


HIRID MIMIC PPICU


Model Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab


no-summary 0.021 0.3538 0.9 0.899 0.931 0.027 0.328 0.82 0.886 0.947 0.0217 0.376 0.64 0.9308 0.923
llama 3.1 0.0214 0.381 0.8797 0.899 0.925 0.0288 0.406 0.8131 0.886 0.938 0.029 0.3752 0.63 0.937 0.9271
medgemma 0.0237 0.3682 0.83 0.911 0.925 0.0299 0.4005 0.7788 0.8946 0.9432 0.029 0.3626 0.6346 0.925 0.936
gemini 0.028 0.347 0.8302 0.9064 0.9307 0.03 0.3328 0.77 0.903 0.942 0.017 0.358 0.6377 0.9308 0.9328


Table 13: Summarization methods performance comparison across 30 transfer learning tasks (Part
1: Transfer Pairs 1-3)


H _→_ P M _→_ P H _→_ M


Model Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab


no-summary 0.21 0.98 0.66 0.92 0.96 0.263 0.77 0.7 0.92 0.92 0.1284 0.693 0.73 0.881 0.832
llama 3.1 0.1908 0.71 0.735 0.9243 0.9718 0.249 0.5522 0.7097 0.9415 0.9285 0.134 0.6464 0.82 0.878 0.851
medgemma 0.21 0.6981 0.74 0.97 0.98 0.239 0.5627 0.7145 0.9428 0.95 0.0922 0.537 0.81 0.891 0.83
gemini 0.183 0.7017 0.7001 0.92 0.9737 0.258 0.49 0.73 0.95 0.9372 0.089 0.6661 0.8044 0.852 0.842


Table 14: Summarization methods performance comparison across 30 transfer learning tasks (Part
2: Transfer Pairs 4-6)


P _→_ M M _→_ H P _→_ H


Model Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab


no-summary 0.15971 0.518 0.75 0.913 0.8669 0.135 0.5805 0.8277 0.816 0.8857 0.0954 0.494 0.76 0.892 0.7895
llama 3.1 0.141 0.443 0.752 0.877 0.8669 0.1741 0.572 0.83 0.903 0.9085 0.096 0.4393 0.7657 0.835 0.734
medgemma 0.1281 0.4493 0.81 0.88 0.9054 0.135 0.5805 0.8277 0.8653 0.877 0.089 0.4682 0.7725 0.8637 0.8042
gemini 0.127 0.4886 0.7942 0.901 0.919 0.167 0.5864 0.8037 0.8239 0.916 0.083 0.429 0.81 0.8627 0.812


Table 15: Prompting methods performance comparison across 15 in-distribution tasks (Figure 4 left
subfgure)


HIRID MIMIC PPICU


Model Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab


zero-shot 0.0244 0.354 0.8501 0.911 0.931 0.0282 0.3951 0.77 0.8894 0.9431 0.017 0.376 0.6367 0.9346 0.923
CoT 0.0268 0.381 0.8311 0.9078 0.925 0.0294 0.328 0.8101 0.886 0.938 0.029 0.358 0.6387 0.937 0.936
ICD 0.021 0.3517 0.83 0.899 0.9305 0.027 0.3844 0.8018 0.903 0.947 0.0284 0.3645 0.64 0.925 0.9234
Trend 0.028 0.347 0.9 0.9042 0.9263 0.03 0.406 0.82 0.8881 0.9469 0.0249 0.3713 0.63 0.9324 0.9308


32


Published as a conference paper at ICLR 2026


Table 16: Prompting methods performance comparison across 15 transfer learning tasks (Figure 4
right subfgure)


H _→_ P M _→_ P H _→_ M


Model Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab Forecast LOS Mort Drug Lab


zero-shot 0.183 0.6994 0.6888 0.9359 0.9758 0.2536 0.57 0.7045 0.949 0.95 0.1082 0.6467 0.73 0.8878 0.83
CoT 0.1996 0.69 0.66 0.92 0.9667 0.2461 0.49 0.7106 0.92 0.9375 0.089 0.693 0.7328 0.868 0.832
ICD 0.21 0.6989 0.6916 0.933 0.98 0.239 0.5199 0.73 0.926 0.9498 0.134 0.6564 0.82 0.891 0.851
Trend 0.1927 0.71 0.74 0.97 0.96 0.258 0.5595 0.7 0.95 0.92 — 0.1248 0.537 0.7629 0.852 0.847


Dataset Lab features Vital features Binary features



HiRID ALP, ALT, AST, Bicarbonate,
Bilirubin, BloodUreaNitrogen,
Calcium, Chloride, CreatineKinase, Creatinine, Glucose,
Hemoglobin, INR, Lactate,
Magnesium, PaCO2, PaO2,
Phosphate, Platelets, Potassium, Sodium, Troponin,
WBC, ph


MIMIC ALP, ALT, Bicarbonate,
Bilirubin, BloodUreaNitrogen,
Calcium, Creatinine, CreatinineKinase, Hemoglobin,
INR, Lactate, Magnesium,
PaCO2, PaO2, Phosphate,
Platelets, Potassium, Sodium,
Troponin, WBC, ph


PPICU ALP, ALT, AST, Bicarbonate,
Bilirubin, BloodUreaNitrogen,
Calcium, Chloride, Creatinine, CreatinineKinase, GGT,
Glucose, Hemoglobin, INR,
Lactate, Magnesium, PaCO2,
PaO2, Phosphate, Platelets,
Potassium, Sodium, Troponin,
WBC, ph



AirwayPressure, AirwayPressurePeak, DiastolicBloodPressure, FiO2, FluidBalance,
GCS, HeartRate, MeanBloodPressure, PEEP, RespiratoryRate, SAS, Saturation, SystolicBloodPressure,
Temperature, TidalVolume,
UrineOutput, ICPMonitor,
Ventilation


AirwayPressure, DiastolicBloodPressure, FiO2,
GCS, HeartRate, ICDSC,
MeanBloodPressure, MinuteVentilation, PEEP, RespiratoryRate, SAS, SystolicBloodPressure, Temperature, TidalVolume, UrineOutput


AirwayPressure, AirwayPressureIP, AirwayPressurePeak,
DiastolicBloodPressure, FiO2,
FluidInput, FluidOutput,
GCS, HeartRate, ICDSC,
MeanBloodPressure, MinuteVentilation, PAVSupport,
PC, PEEP, PlateauPressure,
RespiratoryRate, SAS, Saturation, SystolicBloodPressure,
Temperature, TidalVolume,
UrineOutput



Analgesia, Antiarrhythmics,
Antibiotics, Anticoagulants,
Antiepileptics, Antihypertensives, Aspirin, CaReplacement,
Dialysis, Diuretics, ICPMonitor, Insulin, KReplacement,
LiverToxicDrug, MgReplacement, Neuroleptics, Paralysis,
Saline, Sedation, Steroids,
TPN, Transfusions, Vasopressors, Ventilation


Analgesia, Antiarrhythmics,
Antibiotics, Anticoagulants,
Antiepileptics, Antihypertensives, Antipsychotics, CTScan,
CaReplacement, Dialysis,
Diuretics, EnteralNutrition,
ICPMonitor, KReplacement,
MRI, MgReplacement, PPI,
Paralysis, TPN, Transfusions,
UltraSound, Vasopressors,
Ventilation, Xray


Analgesia, Antiarrhythmic,
Antiarrhythmics, Antibiotics,
Anticoagulants, Antiepileptics,
Antihypertensives, Aspirin,
Dialysis, Diuretics, EKG,
EVD, ICPMonitor, InhaledVasodilator, Insulin, Isoproterenol, MgReplacement,
Neuroleptics, OsmoticTherapy,
PPI, PS, Paralysis, Sedation,
Steroids, TPN, Transfusions,
Vasopressors



Table 17: Feature groupings for converting ICU data into hierarchical textual representations.
Each feature is prefixed with its group label (e.g., lab ~~H~~ emoglobin, vital ~~H~~ eartRate,
bin ~~V~~ asopressors) before tokenization.


33


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**mae** **mse** **mae** **mse** **mae** **mse**


Llama-3.1 CoT +TFM lstm 0 _._ 799 _±_ 4 _._ 12e _−_ 4 1 _±_ 1 _._ 893e _−_ 4 0 _._ 802 _±_ 2 _._ 517e _−_ 5 1 _±_ 1 _._ 732e _−_ 5 0 _._ 808 _±_ 1 _._ 323e _−_ 3 1 _±_ 3 _._ 87e _−_ 4
Llama-3.1 CoT +TFM mlp 0 _._ 799 _±_ 5 _._ 4e _−_ 4 1 _±_ 1 _._ 888e _−_ 4 0 _._ 802 _±_ 6 _._ 557e _−_ 5 1 _±_ 7 _._ 572e _−_ 5 0 _._ 811 _±_ 1 _._ 514e _−_ 3 1 _._ 001 _±_ 1 _._ 177e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 808 _±_ 1 _._ 848e _−_ 3 1 _._ 018 _±_ 3 _._ 714e _−_ 3 0 _._ 806 _±_ 1 _._ 544e _−_ 3 1 _._ 01 _±_ 4 _._ 083e _−_ 3 0 _._ 818 _±_ 5 _._ 124e _−_ 3 1 _._ 015 _±_ 7 _._ 344e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 8 _±_ 1 _._ 198e _−_ 3 1 _±_ 2 _._ 955e _−_ 4 0 _._ 802 _±_ 1 _._ 229e _−_ 4 1 _±_ 1 _._ 528e _−_ 5 0 _._ 809 _±_ 2 _._ 309e _−_ 5 1 _±_ 1e _−_ 5
Llama-3.1 CoT lstm 0 _._ 799 _±_ 4 _._ 594e _−_ 4 1 _±_ 1 _._ 09e _−_ 4 0 _._ 802 _±_ 8 _._ 139e _−_ 5 1 _±_ 3 _._ 948e _−_ 5 0 _._ 808 _±_ 7 _._ 551e _−_ 4 1 _±_ 1 _._ 603e _−_ 4
Llama-3.1 CoT mlp 0 _._ 801 _±_ 1 _._ 066e _−_ 3 1 _._ 001 _±_ 4 _._ 061e _−_ 4 0 _._ 802 _±_ 8 _._ 124e _−_ 5 1 _±_ 3 _._ 742e _−_ 5 0 _._ 811 _±_ 8 _._ 279e _−_ 4 1 _._ 001 _±_ 3 _._ 531e _−_ 4
Llama-3.1 CoT patchtsmixer 0 _._ 802 _±_ 4 _._ 342e _−_ 3 1 _._ 009 _±_ 5 _._ 105e _−_ 3 0 _._ 805 _±_ 1 _._ 877e _−_ 3 1 _._ 004 _±_ 2 _._ 605e _−_ 3 0 _._ 814 _±_ 3 _._ 97e _−_ 3 1 _._ 007 _±_ 2 _._ 545e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 8 _±_ 1 _._ 173e _−_ 4 1 _±_ 2 _._ 363e _−_ 5 0 _._ 802 _±_ 6 _._ 351e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 81 _±_ 1 _._ 245e _−_ 3 1 _._ 001 _±_ 4 _._ 287e _−_ 4
Llama-3.1 ICD +TFM lstm 0 _._ 799 _±_ 2 _._ 33e _−_ 3 1 _±_ 7 _._ 342e _−_ 4 0 _._ 802 _±_ 1 _._ 25e _−_ 4 1 _±_ 5 _._ 292e _−_ 5 0 _._ 808 _±_ 4 _._ 464e _−_ 4 1 _±_ 2 _._ 193e _−_ 4
Llama-3.1 ICD +TFM mlp 0 _._ 8 _±_ 8 _._ 113e _−_ 4 1 _±_ 6 _._ 769e _−_ 4 0 _._ 802 _±_ 1 _._ 704e _−_ 4 1 _±_ 2 _._ 887e _−_ 5 0 _._ 811 _±_ 6 _._ 393e _−_ 4 1 _._ 001 _±_ 4 _._ 518e _−_ 4
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 803 _±_ 2 _._ 735e _−_ 3 1 _._ 015 _±_ 6 _._ 16e _−_ 3 0 _._ 807 _±_ 2 _._ 349e _−_ 3 1 _._ 01 _±_ 3 _._ 026e _−_ 3 0 _._ 818 _±_ 1 _._ 976e _−_ 3 1 _._ 013 _±_ 1 _._ 36e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 799 _±_ 5 _._ 401e _−_ 4 1 _±_ 9 _._ 165e _−_ 5 0 _._ 802 _±_ 1 _._ 528e _−_ 5 1 _±_ 0e0 0 _._ 809 _±_ 1 _._ 202e _−_ 3 1 _±_ 2 _._ 977e _−_ 4
Llama-3.1 ICD lstm 0 _._ 8 _±_ 1 _._ 023e _−_ 3 1 _±_ 2 _._ 974e _−_ 4 0 _._ 802 _±_ 1 _._ 299e _−_ 4 1 _±_ 1 _._ 291e _−_ 5 0 _._ 808 _±_ 3 _._ 73e _−_ 4 1 _±_ 2 _._ 109e _−_ 4
Llama-3.1 ICD mlp 0 _._ 801 _±_ 6 _._ 392e _−_ 4 1 _._ 001 _±_ 7 _._ 034e _−_ 4 0 _._ 802 _±_ 1 _._ 688e _−_ 4 1 _±_ 6 _._ 85e _−_ 5 0 _._ 811 _±_ 1 _._ 794e _−_ 3 1 _._ 001 _±_ 7 _._ 748e _−_ 4
Llama-3.1 ICD patchtsmixer 0 _._ 8 _±_ 4 _._ 883e _−_ 3 1 _._ 007 _±_ 2 _._ 973e _−_ 3 0 _._ 803 _±_ 9 _._ 965e _−_ 4 1 _._ 003 _±_ 1 _._ 069e _−_ 3 0 _._ 811 _±_ 3 _._ 361e _−_ 3 1 _._ 005 _±_ 1 _._ 447e _−_ 3
Llama-3.1 ICD timemixer 0 _._ 799 _±_ 1 _._ 554e _−_ 3 1 _±_ 1 _._ 954e _−_ 4 0 _._ 802 _±_ 1 _._ 087e _−_ 4 1 _±_ 1 _._ 155e _−_ 5 0 _._ 809 _±_ 2 _._ 757e _−_ 4 1 _±_ 7 _._ 632e _−_ 5
Llama-3.1 Trend +TFM lstm 0 _._ 799 _±_ 1 _._ 36e _−_ 3 1 _±_ 1 _._ 986e _−_ 4 0 _._ 802 _±_ 1 _._ 007e _−_ 4 1 _±_ 9 _._ 815e _−_ 5 0 _._ 808 _±_ 1 _._ 002e _−_ 3 1 _±_ 1 _._ 05e _−_ 4
Llama-3.1 Trend +TFM mlp 0 _._ 8 _±_ 7 _._ 948e _−_ 4 1 _._ 001 _±_ 5 _._ 086e _−_ 4 0 _._ 802 _±_ 2 _._ 108e _−_ 4 1 _±_ 6 _._ 506e _−_ 5 0 _._ 81 _±_ 9 _._ 158e _−_ 4 1 _._ 001 _±_ 7e _−_ 5
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 805 _±_ 1 _._ 46e _−_ 3 1 _._ 013 _±_ 1 _._ 356e _−_ 3 0 _._ 806 _±_ 3 _._ 252e _−_ 4 1 _._ 008 _±_ 2 _._ 559e _−_ 3 0 _._ 816 _±_ 2 _._ 077e _−_ 3 1 _._ 013 _±_ 1 _._ 48e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 799 _±_ 1 _._ 756e _−_ 3 1 _±_ 3 _._ 102e _−_ 4 0 _._ 802 _±_ 9 _._ 165e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 3 _._ 219e _−_ 4 1 _±_ 1 _._ 026e _−_ 4
Llama-3.1 Trend lstm 0 _._ 799 _±_ 7 _._ 871e _−_ 4 1 _±_ 1 _._ 794e _−_ 4 0 _._ 802 _±_ 2 _._ 5e _−_ 5 1 _±_ 4 _._ 573e _−_ 5 0 _._ 809 _±_ 1 _._ 105e _−_ 3 1 _±_ 3 _._ 561e _−_ 4
Llama-3.1 Trend mlp 0 _._ 801 _±_ 1 _._ 622e _−_ 3 1 _._ 001 _±_ 8 _._ 542e _−_ 4 0 _._ 802 _±_ 1 _._ 209e _−_ 4 1 _±_ 1 _._ 414e _−_ 5 0 _._ 81 _±_ 1 _._ 283e _−_ 3 1 _._ 001 _±_ 2 _._ 9e _−_ 4
Llama-3.1 Trend patchtsmixer 0 _._ 804 _±_ 4 _._ 987e _−_ 3 1 _._ 007 _±_ 2 _._ 488e _−_ 3 0 _._ 804 _±_ 1 _._ 247e _−_ 3 1 _._ 004 _±_ 1 _._ 947e _−_ 3 0 _._ 815 _±_ 2 _._ 49e _−_ 3 1 _._ 007 _±_ 1 _._ 752e _−_ 3
Llama-3.1 Trend timemixer 0 _._ 8 _±_ 1 _._ 757e _−_ 3 1 _._ 001 _±_ 5 _._ 354e _−_ 4 0 _._ 802 _±_ 5 _._ 058e _−_ 5 1 _±_ 5e _−_ 6 0 _._ 809 _±_ 1 _._ 221e _−_ 3 1 _._ 001 _±_ 3 _._ 344e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 799 _±_ 7 _._ 994e _−_ 4 1 _±_ 3 _._ 576e _−_ 4 0 _._ 802 _±_ 1 _._ 904e _−_ 4 1 _±_ 6 _._ 11e _−_ 5 0 _._ 808 _±_ 7 _._ 767e _−_ 4 1 _±_ 4 _._ 842e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 799 _±_ 1 _._ 048e _−_ 3 1 _±_ 8 _._ 607e _−_ 4 0 _._ 802 _±_ 7 _._ 767e _−_ 5 1 _±_ 1 _._ 914e _−_ 4 0 _._ 809 _±_ 6 _._ 928e _−_ 5 1 _._ 001 _±_ 8 _._ 336e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 806 _±_ 4 _._ 216e _−_ 3 1 _._ 018 _±_ 6 _._ 421e _−_ 3 0 _._ 807 _±_ 2 _._ 386e _−_ 3 1 _._ 011 _±_ 3 _._ 676e _−_ 3 0 _._ 82 _±_ 5 _._ 632e _−_ 3 1 _._ 02 _±_ 1 _._ 084e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 8 _±_ 2 _._ 454e _−_ 4 1 _±_ 5 _._ 568e _−_ 5 0 _._ 802 _±_ 3 _._ 464e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 9 _._ 822e _−_ 4 1 _±_ 2 _._ 2e _−_ 4
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 799 _±_ 6 _._ 685e _−_ 4 1 _±_ 2 _._ 419e _−_ 4 0 _._ 802 _±_ 1 _._ 103e _−_ 4 1 _±_ 3 _._ 594e _−_ 5 0 _._ 809 _±_ 9 _._ 524e _−_ 4 1 _±_ 2 _._ 787e _−_ 4
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 801 _±_ 5 _._ 996e _−_ 4 1 _._ 001 _±_ 3 _._ 377e _−_ 4 0 _._ 802 _±_ 1 _._ 721e _−_ 4 1 _±_ 6 _._ 272e _−_ 5 0 _._ 812 _±_ 2 _._ 202e _−_ 4 1 _._ 002 _±_ 3 _._ 597e _−_ 4
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 802 _±_ 3 _._ 087e _−_ 3 1 _._ 006 _±_ 1 _._ 034e _−_ 3 0 _._ 805 _±_ 2 _._ 653e _−_ 3 1 _._ 005 _±_ 3 _._ 432e _−_ 3 0 _._ 816 _±_ 4 _._ 356e _−_ 3 1 _._ 009 _±_ 6 _._ 16e _−_ 3
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 8 _±_ 1 _._ 042e _−_ 3 1 _±_ 2 _._ 07e _−_ 4 0 _._ 802 _±_ 2 _._ 217e _−_ 5 1 _±_ 5e _−_ 6 0 _._ 809 _±_ 8 _._ 542e _−_ 4 1 _±_ 2 _._ 232e _−_ 4
TFM lstm 0 _._ 794 _±_ 1 _._ 222e _−_ 3 0 _._ 995 _±_ 2 _._ 307e _−_ 4 0 _._ 793 _±_ 1 _._ 426e _−_ 4 0 _._ 978 _±_ 1 _._ 36e _−_ 4 0 _._ 752 _±_ 2 _._ 269e _−_ 4 0 _._ 934 _±_ 7 _._ 789e _−_ 5
TFM mlp 0 _._ 795 _±_ 1 _._ 084e _−_ 3 0 _._ 995 _±_ 2 _._ 241e _−_ 4 0 _._ 794 _±_ 1 _._ 422e _−_ 4 0 _._ 978 _±_ 2 _._ 623e _−_ 4 0 _._ 753 _±_ 8 _._ 388e _−_ 4 0 _._ 935 _±_ 1 _._ 005e _−_ 3
TFM patchtsmixer 0 _._ 798 _±_ 2 _._ 747e _−_ 3 1 _._ 007 _±_ 1 _._ 228e _−_ 3 0 _._ 796 _±_ 9 _._ 829e _−_ 4 0 _._ 985 _±_ 1 _._ 854e _−_ 3 0 _._ 76 _±_ 2 _._ 015e _−_ 3 0 _._ 947 _±_ 2 _._ 213e _−_ 3
TFM timemixer 0 _._ 795 _±_ 1 _._ 268e _−_ 3 0 _._ 994 _±_ 1 _._ 484e _−_ 4 0 _._ 794 _±_ 1 _._ 97e _−_ 4 0 _._ 978 _±_ 7 _._ 767e _−_ 5 0 _._ 753 _±_ 8 _._ 918e _−_ 4 0 _._ 934 _±_ 1 _._ 767e _−_ 4
TSDE lstm 0 _._ 794 _±_ 1 _._ 283e _−_ 3 0 _._ 994 _±_ 2 _._ 651e _−_ 4 0 _._ 793 _±_ 2 _._ 316e _−_ 4 0 _._ 977 _±_ 3 _._ 348e _−_ 4 0 _._ 752 _±_ 1 _._ 179e _−_ 4 0 _._ 934 _±_ 3 _._ 616e _−_ 4
TSDE mlp 0 _._ 795 _±_ 1 _._ 53e _−_ 3 0 _._ 995 _±_ 8 _._ 894e _−_ 4 0 _._ 793 _±_ 1 _._ 951e _−_ 4 0 _._ 977 _±_ 2 _._ 168e _−_ 4 0 _._ 753 _±_ 5 _._ 773e _−_ 4 0 _._ 934 _±_ 1 _._ 016e _−_ 3
TSDE patchtsmixer 0 _._ 799 _±_ 4 _._ 027e _−_ 3 1 _._ 012 _±_ 3 _._ 068e _−_ 3 0 _._ 798 _±_ 1 _._ 979e _−_ 3 0 _._ 987 _±_ 3 _._ 758e _−_ 3 0 _._ 764 _±_ 5 _._ 447e _−_ 3 0 _._ 951 _±_ 5 _._ 592e _−_ 3
TSDE timemixer 0 _._ 795 _±_ 1 _._ 15e _−_ 3 0 _._ 994 _±_ 1 _._ 347e _−_ 4 0 _._ 793 _±_ 1 _._ 949e _−_ 4 0 _._ 978 _±_ 6 _._ 702e _−_ 5 0 _._ 753 _±_ 9 _._ 068e _−_ 4 0 _._ 934 _±_ 1 _._ 663e _−_ 4
gemini-2.0-flash CoT +TFM lstm 0 _._ 798 _±_ 7 _._ 966e _−_ 4 1 _±_ 1 _._ 955e _−_ 4 0 _._ 802 _±_ 1 _._ 419e _−_ 4 1 _±_ 1 _._ 25e _−_ 4 0 _._ 807 _±_ 2 _._ 479e _−_ 4 0 _._ 999 _±_ 3 _._ 291e _−_ 4
gemini-2.0-flash CoT +TFM mlp 0 _._ 8 _±_ 8 _._ 967e _−_ 4 1 _±_ 2 _._ 458e _−_ 4 0 _._ 802 _±_ 8 _._ 021e _−_ 5 1 _±_ 1 _._ 656e _−_ 4 0 _._ 81 _±_ 1 _._ 556e _−_ 3 1 _._ 001 _±_ 1 _._ 334e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 802 _±_ 3 _._ 295e _−_ 3 1 _._ 015 _±_ 5 _._ 567e _−_ 3 0 _._ 806 _±_ 2 _._ 782e _−_ 3 1 _._ 011 _±_ 4 _._ 901e _−_ 3 0 _._ 818 _±_ 8 _._ 316e _−_ 3 1 _._ 017 _±_ 1 _._ 244e _−_ 2
gemini-2.0-flash CoT +TFM timemixer 0 _._ 8 _±_ 1 _._ 567e _−_ 3 1 _±_ 3 _._ 384e _−_ 4 0 _._ 802 _±_ 1 _._ 253e _−_ 4 1 _±_ 1 _._ 155e _−_ 5 0 _._ 809 _±_ 9 _._ 109e _−_ 4 1 _±_ 2 _._ 371e _−_ 4
gemini-2.0-flash CoT lstm 0 _._ 8 _±_ 7 _._ 464e _−_ 4 1 _±_ 2 _._ 128e _−_ 4 0 _._ 802 _±_ 1 _._ 795e _−_ 4 1 _±_ 7 _._ 719e _−_ 5 0 _._ 809 _±_ 1 _._ 255e _−_ 3 1 _±_ 2 _._ 233e _−_ 4
gemini-2.0-flash CoT mlp 0 _._ 801 _±_ 8 _._ 308e _−_ 4 1 _._ 001 _±_ 4 _._ 742e _−_ 4 0 _._ 802 _±_ 6 _._ 928e _−_ 5 1 _±_ 9 _._ 309e _−_ 5 0 _._ 812 _±_ 1 _._ 04e _−_ 3 1 _._ 001 _±_ 4 _._ 701e _−_ 4
gemini-2.0-flash CoT patchtsmixer 0 _._ 803 _±_ 5 _._ 182e _−_ 3 1 _._ 007 _±_ 3 _._ 614e _−_ 3 0 _._ 804 _±_ 1 _._ 278e _−_ 3 1 _._ 003 _±_ 8 _._ 689e _−_ 4 0 _._ 814 _±_ 5 _._ 678e _−_ 3 1 _._ 006 _±_ 3 _._ 776e _−_ 3
gemini-2.0-flash CoT timemixer 0 _._ 799 _±_ 4 _._ 21e _−_ 4 1 _±_ 6 _._ 683e _−_ 5 0 _._ 802 _±_ 1 _._ 17e _−_ 4 1 _±_ 9 _._ 574e _−_ 6 0 _._ 809 _±_ 1 _._ 109e _−_ 4 1 _±_ 2 _._ 646e _−_ 5
gemini-2.0-flash ICD +TFM lstm 0 _._ 798 _±_ 6 _._ 035e _−_ 4 1 _±_ 3 _._ 291e _−_ 4 0 _._ 802 _±_ 1 _._ 286e _−_ 4 0 _._ 999 _±_ 1 _._ 311e _−_ 4 0 _._ 808 _±_ 7 _._ 289e _−_ 4 1 _±_ 3 _._ 786e _−_ 5
gemini-2.0-flash ICD +TFM mlp 0 _._ 801 _±_ 1 _._ 713e _−_ 3 1 _._ 001 _±_ 9 _._ 697e _−_ 4 0 _._ 802 _±_ 1 _._ 443e _−_ 4 1 _±_ 1 _._ 752e _−_ 4 0 _._ 81 _±_ 9 _._ 042e _−_ 4 1 _±_ 4 _._ 102e _−_ 4
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 806 _±_ 6 _._ 972e _−_ 3 1 _._ 019 _±_ 9 _._ 015e _−_ 3 0 _._ 805 _±_ 1 _._ 407e _−_ 3 1 _._ 009 _±_ 3 _._ 682e _−_ 3 0 _._ 819 _±_ 6 _._ 351e _−_ 3 1 _._ 016 _±_ 5 _._ 938e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 799 _±_ 5 _._ 112e _−_ 4 1 _±_ 9 _._ 713e _−_ 5 0 _._ 802 _±_ 7 _._ 234e _−_ 5 1 _±_ 1 _._ 155e _−_ 5 0 _._ 81 _±_ 2 _._ 857e _−_ 4 1 _._ 001 _±_ 8 _._ 718e _−_ 5
gemini-2.0-flash ICD lstm 0 _._ 799 _±_ 1 _._ 504e _−_ 3 1 _±_ 3 _._ 638e _−_ 4 0 _._ 802 _±_ 5 _._ 909e _−_ 5 1 _±_ 2 _._ 38e _−_ 5 0 _._ 809 _±_ 1 _._ 431e _−_ 3 1 _±_ 3 _._ 902e _−_ 4
gemini-2.0-flash ICD mlp 0 _._ 802 _±_ 7 _._ 823e _−_ 4 1 _._ 001 _±_ 3 _._ 651e _−_ 4 0 _._ 802 _±_ 1 _._ 741e _−_ 4 1 _±_ 5 _._ 377e _−_ 5 0 _._ 811 _±_ 9 _._ 275e _−_ 4 1 _._ 001 _±_ 4 _._ 109e _−_ 4
gemini-2.0-flash ICD patchtsmixer 0 _._ 8 _±_ 2 _._ 129e _−_ 3 1 _._ 005 _±_ 1 _._ 943e _−_ 3 0 _._ 805 _±_ 2 _._ 47e _−_ 3 1 _._ 005 _±_ 7 _._ 609e _−_ 4 0 _._ 815 _±_ 4 _._ 102e _−_ 3 1 _._ 007 _±_ 1 _._ 912e _−_ 3
gemini-2.0-flash ICD timemixer 0 _._ 8 _±_ 1 _._ 003e _−_ 3 1 _±_ 2 _._ 123e _−_ 4 0 _._ 802 _±_ 2 _._ 708e _−_ 5 1 _±_ 5e _−_ 6 0 _._ 809 _±_ 6 _._ 5e _−_ 4 1 _±_ 1 _._ 513e _−_ 4
gemini-2.0-flash Trend +TFM lstm 0 _._ 798 _±_ 6 _._ 421e _−_ 4 1 _±_ 9 _._ 019e _−_ 5 0 _._ 802 _±_ 1 _._ 212e _−_ 4 1 _±_ 6 _._ 083e _−_ 5 0 _._ 807 _±_ 4 _._ 572e _−_ 4 1 _±_ 1 _._ 253e _−_ 4
gemini-2.0-flash Trend +TFM mlp 0 _._ 8 _±_ 1 _._ 213e _−_ 3 1 _±_ 9 _._ 142e _−_ 4 0 _._ 802 _±_ 5 _._ 292e _−_ 5 1 _±_ 1 _._ 389e _−_ 4 0 _._ 81 _±_ 9 _._ 521e _−_ 4 1 _±_ 1 _._ 044e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 809 _±_ 2 _._ 167e _−_ 3 1 _._ 021 _±_ 4 _._ 501e _−_ 3 0 _._ 806 _±_ 1 _._ 91e _−_ 3 1 _._ 011 _±_ 5 _._ 336e _−_ 3 0 _._ 816 _±_ 2 _._ 824e _−_ 3 1 _._ 017 _±_ 4 _._ 701e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 801 _±_ 7 _._ 143e _−_ 4 1 _._ 001 _±_ 2 _._ 248e _−_ 4 0 _._ 802 _±_ 1 _._ 039e _−_ 4 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 4 _._ 07e _−_ 4 1 _±_ 8 _._ 888e _−_ 5
gemini-2.0-flash Trend lstm 0 _._ 8 _±_ 2 _._ 157e _−_ 3 1 _._ 001 _±_ 5 _._ 701e _−_ 4 0 _._ 802 _±_ 7 _._ 089e _−_ 5 1 _±_ 5 _._ 477e _−_ 5 0 _._ 809 _±_ 1 _._ 029e _−_ 3 1 _±_ 3 _._ 321e _−_ 4
gemini-2.0-flash Trend mlp 0 _._ 8 _±_ 7 _._ 542e _−_ 4 1 _._ 001 _±_ 5 _._ 427e _−_ 4 0 _._ 802 _±_ 1 _._ 263e _−_ 4 1 _±_ 3 _._ 317e _−_ 5 0 _._ 811 _±_ 9 _._ 28e _−_ 4 1 _._ 001 _±_ 4 _._ 237e _−_ 4
gemini-2.0-flash Trend patchtsmixer 0 _._ 804 _±_ 5 _._ 877e _−_ 3 1 _._ 009 _±_ 8 _._ 576e _−_ 3 0 _._ 804 _±_ 2 _._ 883e _−_ 3 1 _._ 006 _±_ 2 _._ 217e _−_ 3 0 _._ 815 _±_ 3 _._ 544e _−_ 3 1 _._ 007 _±_ 2 _._ 735e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 8 _±_ 1 _._ 186e _−_ 3 1 _±_ 2 _._ 575e _−_ 4 0 _._ 802 _±_ 9 _._ 274e _−_ 5 1 _±_ 5e _−_ 6 0 _._ 81 _±_ 8 _._ 4e _−_ 4 1 _._ 001 _±_ 2 _._ 402e _−_ 4
gemini-2.0-flash zero shot +TFM lstm 0 _._ 798 _±_ 4 _._ 85e _−_ 4 1 _±_ 3 _._ 037e _−_ 4 0 _._ 802 _±_ 6 _._ 245e _−_ 5 1 _±_ 5 _._ 508e _−_ 5 0 _._ 808 _±_ 6 _._ 14e _−_ 4 0 _._ 999 _±_ 2 _._ 887e _−_ 5
gemini-2.0-flash zero shot +TFM mlp 0 _._ 8 _±_ 1 _._ 932e _−_ 3 1 _._ 001 _±_ 1 _._ 177e _−_ 3 0 _._ 803 _±_ 1 _._ 767e _−_ 4 1 _±_ 1 _._ 801e _−_ 4 0 _._ 81 _±_ 1 _._ 093e _−_ 3 1 _._ 001 _±_ 3 _._ 439e _−_ 4
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 803 _±_ 2 _._ 508e _−_ 3 1 _._ 014 _±_ 4 _._ 794e _−_ 3 0 _._ 806 _±_ 3 _._ 949e _−_ 3 1 _._ 009 _±_ 5 _._ 323e _−_ 3 0 _._ 817 _±_ 2 _._ 7e _−_ 3 1 _._ 013 _±_ 1 _._ 66e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 8 _±_ 1 _._ 125e _−_ 3 1 _±_ 2 _._ 359e _−_ 4 0 _._ 802 _±_ 3 _._ 205e _−_ 4 1 _±_ 5 _._ 774e _−_ 6 0 _._ 81 _±_ 8 _._ 261e _−_ 4 1 _._ 001 _±_ 2 _._ 601e _−_ 4
gemini-2.0-flash zero shot lstm 0 _._ 799 _±_ 1 _._ 286e _−_ 3 1 _±_ 2 _._ 53e _−_ 4 0 _._ 802 _±_ 8 _._ 583e _−_ 5 1 _±_ 3 _._ 594e _−_ 5 0 _._ 809 _±_ 8 _._ 283e _−_ 4 1 _±_ 1 _._ 135e _−_ 4
gemini-2.0-flash zero shot mlp 0 _._ 801 _±_ 7 _._ 43e _−_ 4 1 _._ 001 _±_ 3 _._ 448e _−_ 4 0 _._ 802 _±_ 5 _._ 944e _−_ 5 1 _±_ 5 _._ 354e _−_ 5 0 _._ 811 _±_ 1 _._ 49e _−_ 3 1 _._ 001 _±_ 8 _._ 31e _−_ 4
gemini-2.0-flash zero shot patchtsmixer 0 _._ 802 _±_ 2 _._ 607e _−_ 3 1 _._ 006 _±_ 3 _._ 524e _−_ 3 0 _._ 806 _±_ 4 _._ 285e _−_ 3 1 _._ 005 _±_ 3 _._ 005e _−_ 3 0 _._ 813 _±_ 1 _._ 74e _−_ 3 1 _._ 006 _±_ 1 _._ 151e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 8 _±_ 7 _._ 074e _−_ 4 1 _±_ 1 _._ 916e _−_ 4 0 _._ 802 _±_ 1 _._ 711e _−_ 4 1 _±_ 8 _._ 165e _−_ 6 0 _._ 809 _±_ 1 _._ 455e _−_ 3 1 _±_ 3 _._ 885e _−_ 4
interp lstm 0 _._ 795 _±_ 7 _._ 933e _−_ 4 0 _._ 994 _±_ 4 _._ 948e _−_ 4 0 _._ 793 _±_ 2 _._ 49e _−_ 4 0 _._ 977 _±_ 2 _._ 41e _−_ 4 0 _._ 754 _±_ 9 _._ 792e _−_ 4 0 _._ 934 _±_ 4 _._ 055e _−_ 4
interp mlp 0 _._ 796 _±_ 7 _._ 269e _−_ 4 0 _._ 996 _±_ 6 _._ 276e _−_ 4 0 _._ 793 _±_ 3 _._ 807e _−_ 4 0 _._ 978 _±_ 7 _._ 938e _−_ 4 0 _._ 754 _±_ 9 _._ 573e _−_ 4 0 _._ 935 _±_ 3 _._ 97e _−_ 4
interp patchtsmixer 0 _._ 8 _±_ 2 _._ 155e _−_ 3 1 _._ 013 _±_ 3 _._ 985e _−_ 3 0 _._ 8 _±_ 3 _._ 223e _−_ 3 0 _._ 989 _±_ 3 _._ 73e _−_ 3 0 _._ 761 _±_ 7 _._ 619e _−_ 3 0 _._ 947 _±_ 8 _._ 651e _−_ 3
interp timemixer 0 _._ 795 _±_ 1 _._ 088e _−_ 3 0 _._ 995 _±_ 1 _._ 42e _−_ 4 0 _._ 793 _±_ 8 _._ 104e _−_ 5 0 _._ 978 _±_ 3 _._ 109e _−_ 5 0 _._ 753 _±_ 8 _._ 277e _−_ 4 0 _._ 935 _±_ 1 _._ 857e _−_ 4
mean lstm 0 _._ 795 _±_ 6 _._ 998e _−_ 4 0 _._ 994 _±_ 7 _._ 05e _−_ 4 0 _._ 793 _±_ 2 _._ 029e _−_ 4 0 _._ 977 _±_ 4 _._ 399e _−_ 4 0 _._ 754 _±_ 7 _._ 075e _−_ 4 0 _._ 935 _±_ 2 _._ 757e _−_ 4
mean mlp 0 _._ 796 _±_ 5 _._ 046e _−_ 4 0 _._ 994 _±_ 7 _._ 89e _−_ 5 0 _._ 793 _±_ 3 _._ 061e _−_ 4 0 _._ 978 _±_ 3 _._ 035e _−_ 4 0 _._ 754 _±_ 1 _._ 199e _−_ 3 0 _._ 934 _±_ 1 _._ 003e _−_ 3
mean patchtsmixer 0 _._ 805 _±_ 2 _._ 516e _−_ 3 1 _._ 014 _±_ 5 _._ 21e _−_ 3 0 _._ 803 _±_ 4 _._ 826e _−_ 3 0 _._ 997 _±_ 5 _._ 996e _−_ 3 0 _._ 762 _±_ 8 _._ 643e _−_ 3 0 _._ 956 _±_ 8 _._ 724e _−_ 3
mean timemixer 0 _._ 795 _±_ 1 _._ 078e _−_ 3 0 _._ 995 _±_ 1 _._ 274e _−_ 4 0 _._ 793 _±_ 1 _._ 079e _−_ 4 0 _._ 978 _±_ 4 _._ 193e _−_ 5 0 _._ 753 _±_ 8 _._ 874e _−_ 4 0 _._ 935 _±_ 1 _._ 971e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 8 _±_ 4 _._ 027e _−_ 4 1 _±_ 7 _._ 5e _−_ 4 0 _._ 802 _±_ 9 _._ 292e _−_ 5 0 _._ 999 _±_ 2 _._ 042e _−_ 4 0 _._ 807 _±_ 2 _._ 136e _−_ 4 0 _._ 998 _±_ 8 _._ 445e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 8 _±_ 1 _._ 12e _−_ 3 1 _._ 001 _±_ 7 _._ 881e _−_ 4 0 _._ 802 _±_ 8 _._ 888e _−_ 5 1 _±_ 1 _._ 68e _−_ 4 0 _._ 81 _±_ 8 _._ 729e _−_ 4 1 _±_ 1 _._ 419e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 801 _±_ 1 _._ 353e _−_ 3 1 _._ 012 _±_ 3 _._ 439e _−_ 3 0 _._ 809 _±_ 3 _._ 78e _−_ 3 1 _._ 012 _±_ 5 _._ 47e _−_ 3 0 _._ 816 _±_ 4 _._ 633e _−_ 3 1 _._ 013 _±_ 2 _._ 616e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 8 _±_ 1 _._ 564e _−_ 3 1 _±_ 4 _._ 1e _−_ 4 0 _._ 802 _±_ 1 _._ 06e _−_ 4 1 _±_ 1e _−_ 5 0 _._ 81 _±_ 5 _._ 75e _−_ 4 1 _._ 001 _±_ 1 _._ 735e _−_ 4
No ~~s~~ um ~~C~~ oT lstm 0 _._ 799 _±_ 7 _._ 968e _−_ 4 1 _±_ 1 _._ 644e _−_ 4 0 _._ 802 _±_ 1 _._ 173e _−_ 4 1 _±_ 4 _._ 272e _−_ 5 0 _._ 808 _±_ 4 _._ 664e _−_ 4 1 _±_ 9 _._ 815e _−_ 5
No ~~s~~ um ~~C~~ oT mlp 0 _._ 802 _±_ 1 _._ 165e _−_ 3 1 _._ 001 _±_ 5 _._ 263e _−_ 4 0 _._ 802 _±_ 1 _._ 573e _−_ 4 1 _±_ 7 _._ 659e _−_ 5 0 _._ 811 _±_ 1 _._ 329e _−_ 3 1 _._ 001 _±_ 7 _._ 081e _−_ 4
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 8 _±_ 7 _._ 784e _−_ 3 1 _._ 008 _±_ 3 _._ 88e _−_ 3 0 _._ 805 _±_ 2 _._ 973e _−_ 3 1 _._ 004 _±_ 2 _._ 265e _−_ 3 0 _._ 813 _±_ 5 _._ 557e _−_ 3 1 _._ 007 _±_ 3 _._ 969e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 799 _±_ 8 _._ 839e _−_ 4 1 _±_ 1 _._ 209e _−_ 4 0 _._ 802 _±_ 1 _._ 038e _−_ 4 1 _±_ 5 _._ 774e _−_ 6 0 _._ 81 _±_ 1 _._ 31e _−_ 3 1 _._ 001 _±_ 3 _._ 4e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 797 _±_ 4 _._ 851e _−_ 4 0 _._ 999 _±_ 2 _._ 136e _−_ 4 0 _._ 802 _±_ 1 _._ 082e _−_ 4 0 _._ 999 _±_ 1 _._ 85e _−_ 4 0 _._ 808 _±_ 8 _._ 193e _−_ 4 0 _._ 999 _±_ 9 _._ 914e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 8 _±_ 5 _._ 373e _−_ 4 1 _._ 001 _±_ 5 _._ 696e _−_ 4 0 _._ 802 _±_ 1 _._ 572e _−_ 4 1 _±_ 2 _._ 651e _−_ 4 0 _._ 81 _±_ 2 _._ 277e _−_ 3 1 _±_ 3 _._ 089e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 808 _±_ 1 _._ 307e _−_ 3 1 _._ 021 _±_ 3 _._ 624e _−_ 3 0 _._ 805 _±_ 7 _._ 229e _−_ 4 1 _._ 007 _±_ 2 _._ 108e _−_ 3 0 _._ 821 _±_ 4 _._ 215e _−_ 3 1 _._ 018 _±_ 5 _._ 508e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 8 _±_ 1 _._ 246e _−_ 3 1 _±_ 2 _._ 969e _−_ 4 0 _._ 802 _±_ 5 _._ 033e _−_ 5 1 _±_ 0e0 0 _._ 809 _±_ 3 _._ 927e _−_ 4 1 _±_ 8 _._ 387e _−_ 5
No ~~s~~ um ~~I~~ CD lstm 0 _._ 8 _±_ 1 _._ 627e _−_ 3 1 _._ 001 _±_ 4 _._ 364e _−_ 4 0 _._ 802 _±_ 1 _._ 964e _−_ 4 1 _±_ 1 _._ 056e _−_ 4 0 _._ 809 _±_ 5 _._ 778e _−_ 4 1 _±_ 2 _._ 636e _−_ 4
No ~~s~~ um ~~I~~ CD mlp 0 _._ 801 _±_ 7 _._ 965e _−_ 4 1 _._ 001 _±_ 1 _._ 358e _−_ 4 0 _._ 802 _±_ 8 _._ 578e _−_ 5 1 _±_ 5 _._ 323e _−_ 5 0 _._ 811 _±_ 1 _._ 656e _−_ 3 1 _._ 001 _±_ 5 _._ 301e _−_ 4
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 798 _±_ 3 _._ 902e _−_ 3 1 _._ 005 _±_ 1 _._ 06e _−_ 3 0 _._ 803 _±_ 1 _._ 226e _−_ 3 1 _._ 004 _±_ 1 _._ 687e _−_ 3 0 _._ 814 _±_ 4 _._ 127e _−_ 3 1 _._ 007 _±_ 3 _._ 227e _−_ 3
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 799 _±_ 3 _._ 359e _−_ 4 1 _±_ 6 _._ 481e _−_ 5 0 _._ 802 _±_ 4 _._ 646e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 5 _._ 38e _−_ 4 1 _±_ 1 _._ 349e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 799 _±_ 6 _._ 553e _−_ 4 0 _._ 999 _±_ 4 _._ 143e _−_ 4 0 _._ 802 _±_ 8 _._ 083e _−_ 5 0 _._ 999 _±_ 1 _._ 908e _−_ 4 0 _._ 807 _±_ 5 _._ 631e _−_ 4 0 _._ 999 _±_ 5 _._ 116e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 8 _±_ 9 _._ 115e _−_ 4 1 _±_ 6 _._ 274e _−_ 4 0 _._ 802 _±_ 2 _._ 307e _−_ 4 1 _±_ 1 _._ 861e _−_ 4 0 _._ 81 _±_ 2 _._ 249e _−_ 3 1 _._ 001 _±_ 1 _._ 942e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 806 _±_ 8 _._ 208e _−_ 4 1 _._ 02 _±_ 7 _._ 728e _−_ 3 0 _._ 806 _±_ 7 _._ 015e _−_ 4 1 _._ 011 _±_ 1 _._ 952e _−_ 3 0 _._ 814 _±_ 1 _._ 981e _−_ 3 1 _._ 011 _±_ 1 _._ 88e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 8 _±_ 1 _._ 685e _−_ 3 1 _±_ 4 _._ 328e _−_ 4 0 _._ 802 _±_ 1e _−_ 4 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 6 _._ 892e _−_ 4 1 _±_ 1 _._ 815e _−_ 4


Table 18: In-distribution results - Age. (part 1/2)


34


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**mae** **mse** **mae** **mse** **mae** **mse**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 799 _±_ 1 _._ 177e _−_ 3 1 _±_ 2 _._ 004e _−_ 4 0 _._ 802 _±_ 5 _._ 188e _−_ 5 1 _±_ 1 _._ 5e _−_ 5 0 _._ 808 _±_ 6 _._ 139e _−_ 4 1 _±_ 2 _._ 061e _−_ 4
No ~~s~~ um ~~T~~ rend mlp 0 _._ 801 _±_ 1 _._ 357e _−_ 3 1 _._ 001 _±_ 6 _._ 168e _−_ 4 0 _._ 802 _±_ 2 _._ 016e _−_ 4 1 _±_ 1 _._ 005e _−_ 4 0 _._ 81 _±_ 1 _._ 434e _−_ 3 1 _±_ 5 _._ 804e _−_ 4
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 803 _±_ 2 _._ 482e _−_ 3 1 _._ 006 _±_ 2 _._ 681e _−_ 3 0 _._ 805 _±_ 1 _._ 96e _−_ 3 1 _._ 004 _±_ 7 _._ 381e _−_ 4 0 _._ 812 _±_ 1 _._ 637e _−_ 3 1 _._ 005 _±_ 1 _._ 892e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 8 _±_ 6 _._ 989e _−_ 4 1 _±_ 1 _._ 409e _−_ 4 0 _._ 802 _±_ 4 _._ 933e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 1 _._ 931e _−_ 4 1 _±_ 5 _._ 888e _−_ 5
medgemma CoT +TFM lstm 0 _._ 798 _±_ 3 _._ 301e _−_ 4 1 _±_ 5 _._ 014e _−_ 4 0 _._ 802 _±_ 1 _._ 617e _−_ 4 0 _._ 999 _±_ 1 _._ 401e _−_ 4 0 _._ 808 _±_ 1 _._ 51e _−_ 4 1 _±_ 2 _._ 768e _−_ 4
medgemma CoT +TFM mlp 0 _._ 8 _±_ 8 _._ 638e _−_ 4 1 _._ 001 _±_ 4 _._ 661e _−_ 4 0 _._ 802 _±_ 1 _._ 155e _−_ 5 1 _±_ 1 _._ 582e _−_ 4 0 _._ 81 _±_ 1 _._ 223e _−_ 3 1 _±_ 1 _._ 119e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 807 _±_ 3 _._ 471e _−_ 3 1 _._ 024 _±_ 1 _._ 068e _−_ 2 0 _._ 805 _±_ 8 _._ 303e _−_ 4 1 _._ 009 _±_ 2 _._ 689e _−_ 3 0 _._ 815 _±_ 1 _._ 743e _−_ 3 1 _._ 016 _±_ 4 _._ 846e _−_ 3
medgemma CoT +TFM timemixer 0 _._ 8 _±_ 1 _._ 343e _−_ 3 1 _._ 001 _±_ 3 _._ 816e _−_ 4 0 _._ 802 _±_ 8 _._ 021e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 1 _._ 636e _−_ 3 1 _._ 001 _±_ 5 _._ 227e _−_ 4
medgemma CoT lstm 0 _._ 799 _±_ 1 _._ 998e _−_ 3 1 _±_ 5 _._ 651e _−_ 4 0 _._ 802 _±_ 5 _._ 62e _−_ 5 1 _±_ 5 _._ 774e _−_ 5 0 _._ 809 _±_ 1 _._ 522e _−_ 3 1 _±_ 3 _._ 647e _−_ 4
medgemma CoT mlp 0 _._ 802 _±_ 1 _._ 233e _−_ 3 1 _._ 001 _±_ 7 _._ 105e _−_ 4 0 _._ 802 _±_ 1 _._ 242e _−_ 4 1 _±_ 2 _._ 16e _−_ 5 0 _._ 811 _±_ 1 _._ 828e _−_ 3 1 _._ 001 _±_ 1 _._ 194e _−_ 3
medgemma CoT patchtsmixer 0 _._ 801 _±_ 2 _._ 015e _−_ 3 1 _._ 005 _±_ 1 _._ 861e _−_ 3 0 _._ 805 _±_ 1 _._ 934e _−_ 3 1 _._ 005 _±_ 2 _._ 257e _−_ 3 0 _._ 815 _±_ 3 _._ 297e _−_ 3 1 _._ 006 _±_ 2 _._ 075e _−_ 3
medgemma CoT timemixer 0 _._ 8 _±_ 5 _._ 616e _−_ 4 1 _±_ 1 _._ 266e _−_ 4 0 _._ 802 _±_ 1 _._ 491e _−_ 4 1 _±_ 8 _._ 165e _−_ 6 0 _._ 809 _±_ 1 _._ 859e _−_ 3 1 _._ 001 _±_ 6 _._ 096e _−_ 4
medgemma ICD +TFM lstm 0 _._ 799 _±_ 7 _._ 548e _−_ 4 1 _±_ 2 _._ 272e _−_ 4 0 _._ 802 _±_ 1 _._ 249e _−_ 4 1 _±_ 2 _._ 627e _−_ 4 0 _._ 808 _±_ 7 _._ 91e _−_ 4 1 _±_ 2 _._ 363e _−_ 4
medgemma ICD +TFM mlp 0 _._ 8 _±_ 1 _._ 484e _−_ 3 1 _._ 001 _±_ 1 _._ 013e _−_ 3 0 _._ 802 _±_ 2 _._ 113e _−_ 4 1 _±_ 2 _._ 715e _−_ 4 0 _._ 81 _±_ 1 _._ 608e _−_ 3 1 _._ 001 _±_ 9 _._ 855e _−_ 4
medgemma ICD +TFM patchtsmixer 0 _._ 807 _±_ 3 _._ 378e _−_ 3 1 _._ 019 _±_ 4 _._ 825e _−_ 3 0 _._ 807 _±_ 1 _._ 582e _−_ 3 1 _._ 01 _±_ 5 _._ 048e _−_ 4 0 _._ 816 _±_ 5 _._ 003e _−_ 3 1 _._ 019 _±_ 3 _._ 843e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 799 _±_ 4 _._ 107e _−_ 4 1 _±_ 8 _._ 544e _−_ 5 0 _._ 802 _±_ 5 _._ 292e _−_ 5 1 _±_ 5 _._ 774e _−_ 6 0 _._ 809 _±_ 1 _._ 185e _−_ 3 1 _±_ 2 _._ 358e _−_ 4
medgemma ICD lstm 0 _._ 799 _±_ 1 _._ 006e _−_ 3 1 _±_ 2 _._ 429e _−_ 4 0 _._ 802 _±_ 1 _._ 48e _−_ 4 1 _±_ 1 _._ 291e _−_ 5 0 _._ 809 _±_ 8 _._ 411e _−_ 4 1 _±_ 1 _._ 823e _−_ 4
medgemma ICD mlp 0 _._ 802 _±_ 4 _._ 164e _−_ 4 1 _._ 001 _±_ 3 _._ 267e _−_ 4 0 _._ 802 _±_ 2 _._ 65e _−_ 4 1 _±_ 1 _._ 431e _−_ 4 0 _._ 81 _±_ 1 _._ 05e _−_ 3 1 _._ 001 _±_ 4 _._ 768e _−_ 4
medgemma ICD patchtsmixer 0 _._ 802 _±_ 1 _._ 518e _−_ 3 1 _._ 007 _±_ 2 _._ 384e _−_ 3 0 _._ 804 _±_ 1 _._ 19e _−_ 3 1 _._ 003 _±_ 9 _._ 347e _−_ 4 0 _._ 818 _±_ 4 _._ 967e _−_ 3 1 _._ 01 _±_ 4 _._ 364e _−_ 3
medgemma ICD timemixer 0 _._ 799 _±_ 6 _._ 545e _−_ 4 1 _±_ 1 _._ 09e _−_ 4 0 _._ 802 _±_ 5 _._ 477e _−_ 5 1 _±_ 5e _−_ 6 0 _._ 809 _±_ 8 _._ 681e _−_ 4 1 _±_ 1 _._ 848e _−_ 4
medgemma Trend +TFM lstm 0 _._ 798 _±_ 5 _._ 125e _−_ 4 1 _±_ 1 _._ 361e _−_ 4 0 _._ 802 _±_ 1 _._ 159e _−_ 4 1 _±_ 5 _._ 859e _−_ 5 0 _._ 807 _±_ 2 _._ 721e _−_ 4 1 _±_ 2 _._ 403e _−_ 4
medgemma Trend +TFM mlp 0 _._ 8 _±_ 1 _._ 693e _−_ 3 1 _._ 001 _±_ 1 _._ 002e _−_ 3 0 _._ 802 _±_ 1 _._ 531e _−_ 4 1 _±_ 4 _._ 041e _−_ 5 0 _._ 81 _±_ 2 _._ 434e _−_ 3 1 _._ 001 _±_ 1 _._ 474e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 806 _±_ 9 _._ 166e _−_ 4 1 _._ 018 _±_ 1 _._ 32e _−_ 3 0 _._ 806 _±_ 2 _._ 89e _−_ 3 1 _._ 011 _±_ 4 _._ 614e _−_ 3 0 _._ 815 _±_ 2 _._ 136e _−_ 3 1 _._ 015 _±_ 2 _._ 962e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 799 _±_ 1 _._ 216e _−_ 3 1 _±_ 2 _._ 237e _−_ 4 0 _._ 802 _±_ 9 _._ 539e _−_ 5 1 _±_ 1e _−_ 5 0 _._ 809 _±_ 1 _._ 571e _−_ 3 1 _._ 001 _±_ 5 _._ 096e _−_ 4
medgemma Trend lstm 0 _._ 799 _±_ 5 _._ 958e _−_ 4 1 _±_ 2 _._ 047e _−_ 4 0 _._ 802 _±_ 7 _._ 32e _−_ 5 1 _±_ 3 _._ 096e _−_ 5 0 _._ 808 _±_ 1 _._ 07e _−_ 3 1 _±_ 3 _._ 157e _−_ 4
medgemma Trend mlp 0 _._ 801 _±_ 1 _._ 054e _−_ 3 1 _._ 001 _±_ 7 _._ 023e _−_ 4 0 _._ 802 _±_ 1 _._ 398e _−_ 4 1 _±_ 1 _._ 742e _−_ 4 0 _._ 811 _±_ 6 _._ 312e _−_ 4 1 _._ 001 _±_ 4 _._ 551e _−_ 4
medgemma Trend patchtsmixer 0 _._ 799 _±_ 2 _._ 469e _−_ 3 1 _._ 004 _±_ 1 _._ 798e _−_ 3 0 _._ 804 _±_ 7 _._ 189e _−_ 4 1 _._ 003 _±_ 9 _._ 537e _−_ 4 0 _._ 813 _±_ 2 _._ 898e _−_ 3 1 _._ 006 _±_ 2 _._ 387e _−_ 3
medgemma Trend timemixer 0 _._ 799 _±_ 8 _._ 691e _−_ 4 1 _±_ 1 _._ 797e _−_ 4 0 _._ 802 _±_ 1 _._ 252e _−_ 4 1 _±_ 1 _._ 291e _−_ 5 0 _._ 808 _±_ 6 _._ 085e _−_ 4 1 _±_ 8 _._ 756e _−_ 5
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 799 _±_ 6 _._ 902e _−_ 4 1 _±_ 3 _._ 201e _−_ 4 0 _._ 802 _±_ 4 _._ 163e _−_ 5 1 _±_ 1 _._ 967e _−_ 4 0 _._ 807 _±_ 1 _._ 253e _−_ 4 1 _±_ 2 _._ 721e _−_ 4
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 8 _±_ 6 _._ 208e _−_ 4 1 _±_ 6 _._ 301e _−_ 4 0 _._ 802 _±_ 1 _._ 007e _−_ 4 1 _±_ 7 _._ 572e _−_ 5 0 _._ 81 _±_ 1 _._ 547e _−_ 3 1 _._ 001 _±_ 1 _._ 437e _−_ 3
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 806 _±_ 3 _._ 184e _−_ 3 1 _._ 019 _±_ 6 _._ 825e _−_ 3 0 _._ 805 _±_ 1 _._ 699e _−_ 3 1 _._ 008 _±_ 6 _._ 408e _−_ 4 0 _._ 818 _±_ 3 _._ 971e _−_ 3 1 _._ 016 _±_ 6 _._ 382e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 799 _±_ 1 _._ 214e _−_ 3 1 _±_ 2 _._ 055e _−_ 4 0 _._ 802 _±_ 2 _._ 517e _−_ 5 1 _±_ 0e0 0 _._ 809 _±_ 1 _._ 219e _−_ 3 1 _±_ 2 _._ 479e _−_ 4
medgemma zero ~~s~~ hot lstm 0 _._ 799 _±_ 1 _._ 36e _−_ 3 1 _±_ 3 _._ 178e _−_ 4 0 _._ 802 _±_ 1 _._ 184e _−_ 4 1 _±_ 2 _._ 944e _−_ 5 0 _._ 808 _±_ 3 _._ 326e _−_ 4 1 _±_ 1 _._ 36e _−_ 4
medgemma zero ~~s~~ hot mlp 0 _._ 8 _±_ 9 _._ 336e _−_ 4 1 _±_ 5 _._ 176e _−_ 4 0 _._ 802 _±_ 1 _._ 412e _−_ 4 1 _±_ 6e _−_ 5 0 _._ 811 _±_ 1 _._ 18e _−_ 3 1 _._ 001 _±_ 3 _._ 718e _−_ 4
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 801 _±_ 1 _._ 17e _−_ 3 1 _._ 006 _±_ 1 _._ 53e _−_ 3 0 _._ 803 _±_ 2 _._ 27e _−_ 3 1 _._ 005 _±_ 1 _._ 433e _−_ 3 0 _._ 814 _±_ 1 _._ 797e _−_ 3 1 _._ 005 _±_ 1 _._ 552e _−_ 3
medgemma zero ~~s~~ hot timemixer 0 _._ 799 _±_ 7 _._ 274e _−_ 4 1 _±_ 1 _._ 086e _−_ 4 0 _._ 802 _±_ 1 _._ 065e _−_ 4 1 _±_ 1 _._ 258e _−_ 5 0 _._ 808 _±_ 3 _._ 126e _−_ 4 1 _±_ 6 _._ 397e _−_ 5
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM lstm 0 _._ 799 _±_ 2 _._ 811e _−_ 4 1 _±_ 2 _._ 29e _−_ 4 0 _._ 802 _±_ 8 _._ 083e _−_ 5 0 _._ 999 _±_ 6 _._ 351e _−_ 5 0 _._ 807 _±_ 1 _._ 231e _−_ 3 0 _._ 999 _±_ 6 _._ 614e _−_ 4
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM mlp 0 _._ 8 _±_ 1 _._ 34e _−_ 3 1 _±_ 6 _._ 005e _−_ 4 0 _._ 802 _±_ 2 _._ 732e _−_ 4 1 _±_ 3 _._ 02e _−_ 4 0 _._ 81 _±_ 4 _._ 343e _−_ 4 1 _±_ 4 _._ 859e _−_ 4
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 803 _±_ 1 _._ 455e _−_ 3 1 _._ 016 _±_ 4 _._ 599e _−_ 3 0 _._ 806 _±_ 1 _._ 482e _−_ 3 1 _._ 011 _±_ 1 _._ 815e _−_ 3 0 _._ 82 _±_ 3 _._ 048e _−_ 3 1 _._ 016 _±_ 3 _._ 578e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM timemixer 0 _._ 8 _±_ 6 _._ 369e _−_ 4 1 _±_ 1 _._ 5e _−_ 4 0 _._ 802 _±_ 1 _._ 35e _−_ 4 1 _±_ 2 _._ 082e _−_ 5 0 _._ 809 _±_ 2 _._ 229e _−_ 3 1 _._ 001 _±_ 7 _._ 192e _−_ 4
No ~~s~~ um ~~z~~ ero shot lstm 0 _._ 801 _±_ 1 _._ 9e _−_ 3 1 _._ 001 _±_ 5 _._ 583e _−_ 4 0 _._ 802 _±_ 7 _._ 188e _−_ 5 1 _±_ 4 _._ 193e _−_ 5 0 _._ 809 _±_ 4 _._ 696e _−_ 4 1 _±_ 1 _._ 339e _−_ 4
No ~~s~~ um ~~z~~ ero shot mlp 0 _._ 801 _±_ 1 _._ 75e _−_ 3 1 _._ 001 _±_ 8 _._ 046e _−_ 4 0 _._ 802 _±_ 1 _._ 159e _−_ 4 1 _±_ 3 _._ 862e _−_ 5 0 _._ 811 _±_ 1 _._ 089e _−_ 3 1 _._ 001 _±_ 3 _._ 03e _−_ 4
No ~~s~~ um ~~z~~ ero shot patchtsmixer 0 _._ 802 _±_ 2 _._ 277e _−_ 3 1 _._ 005 _±_ 2 _._ 572e _−_ 3 0 _._ 804 _±_ 2 _._ 032e _−_ 3 1 _._ 004 _±_ 1 _._ 011e _−_ 3 0 _._ 813 _±_ 4 _._ 082e _−_ 3 1 _._ 005 _±_ 2 _._ 859e _−_ 3
No ~~s~~ um ~~z~~ ero shot timemixer 0 _._ 8 _±_ 6 _._ 189e _−_ 4 1 _±_ 1 _._ 24e _−_ 4 0 _._ 802 _±_ 1 _._ 409e _−_ 4 1 _±_ 1 _._ 893e _−_ 5 0 _._ 81 _±_ 5 _._ 082e _−_ 4 1 _._ 001 _±_ 1 _._ 623e _−_ 4
right lstm 0 _._ 795 _±_ 7 _._ 442e _−_ 4 0 _._ 994 _±_ 7 _._ 231e _−_ 4 0 _._ 793 _±_ 2 _._ 285e _−_ 4 0 _._ 977 _±_ 1 _._ 96e _−_ 4 0 _._ 754 _±_ 8 _._ 797e _−_ 4 0 _._ 934 _±_ 1 _._ 571e _−_ 4
right mlp 0 _._ 795 _±_ 7 _._ 886e _−_ 4 0 _._ 993 _±_ 2 _._ 05e _−_ 4 0 _._ 793 _±_ 1 _._ 916e _−_ 4 0 _._ 977 _±_ 2 _._ 916e _−_ 4 0 _._ 754 _±_ 2 _._ 142e _−_ 3 0 _._ 933 _±_ 9 _._ 933e _−_ 4
right patchtsmixer 0 _._ 803 _±_ 3 _._ 212e _−_ 3 1 _._ 015 _±_ 3 _._ 019e _−_ 3 0 _._ 798 _±_ 3 _._ 152e _−_ 3 0 _._ 988 _±_ 3 _._ 915e _−_ 3 0 _._ 768 _±_ 4 _._ 237e _−_ 3 0 _._ 947 _±_ 3 _._ 971e _−_ 3
right timemixer 0 _._ 795 _±_ 1 _._ 039e _−_ 3 0 _._ 995 _±_ 1 _._ 193e _−_ 4 0 _._ 793 _±_ 8 _._ 347e _−_ 5 0 _._ 978 _±_ 2 _._ 062e _−_ 5 0 _._ 753 _±_ 1 _._ 141e _−_ 3 0 _._ 935 _±_ 2 _._ 627e _−_ 4


Table 19: In-distribution results - Age. (part 2/2)


35


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**mae** **mse** **mae** **mse**


Llama-3.1 CoT +TFM lstm 0 _._ 808 _±_ 1 _._ 305e _−_ 3 1 _±_ 4 _._ 309e _−_ 4 0 _._ 806 _±_ 1 _._ 069e _−_ 4 1 _±_ 6 _._ 028e _−_ 5
Llama-3.1 CoT +TFM mlp 0 _._ 809 _±_ 7 _._ 101e _−_ 4 1 _._ 001 _±_ 6 _._ 509e _−_ 4 0 _._ 806 _±_ 1 _._ 457e _−_ 4 1 _±_ 3 _._ 215e _−_ 5
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 82 _±_ 2 _._ 642e _−_ 3 1 _._ 019 _±_ 4 _._ 362e _−_ 3 0 _._ 81 _±_ 2 _._ 535e _−_ 3 1 _._ 01 _±_ 6 _._ 56e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 809 _±_ 1 _._ 014e _−_ 3 1 _±_ 2 _._ 955e _−_ 4 0 _._ 806 _±_ 1 _._ 986e _−_ 4 1 _±_ 1e _−_ 5
Llama-3.1 CoT lstm 0 _._ 809 _±_ 2 _._ 399e _−_ 4 1 _±_ 9 _._ 274e _−_ 5 0 _._ 806 _±_ 1 _._ 097e _−_ 4 1 _±_ 2 _._ 944e _−_ 5
Llama-3.1 CoT mlp 0 _._ 811 _±_ 9 _._ 011e _−_ 4 1 _._ 001 _±_ 2 _._ 553e _−_ 4 0 _._ 806 _±_ 2 _._ 191e _−_ 4 1 _±_ 4 _._ 349e _−_ 5
Llama-3.1 CoT patchtsmixer 0 _._ 813 _±_ 3 _._ 711e _−_ 3 1 _._ 008 _±_ 3 _._ 914e _−_ 3 0 _._ 809 _±_ 3 _._ 074e _−_ 3 1 _._ 004 _±_ 3 _._ 167e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 809 _±_ 9 _._ 832e _−_ 5 1 _±_ 2 _._ 363e _−_ 5 0 _._ 806 _±_ 9 _._ 743e _−_ 5 1 _±_ 5 _._ 774e _−_ 6
Llama-3.1 ICD +TFM lstm 0 _._ 808 _±_ 1 _._ 906e _−_ 3 1 _._ 001 _±_ 6 _._ 766e _−_ 4 0 _._ 806 _±_ 1 _._ 652e _−_ 4 1 _±_ 1 _._ 193e _−_ 4
Llama-3.1 ICD +TFM mlp 0 _._ 81 _±_ 7 _._ 51e _−_ 4 1 _._ 001 _±_ 6 _._ 311e _−_ 4 0 _._ 806 _±_ 1 _._ 825e _−_ 4 1 _±_ 3 _._ 786e _−_ 5
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 815 _±_ 2 _._ 4e _−_ 3 1 _._ 016 _±_ 5 _._ 238e _−_ 3 0 _._ 811 _±_ 3 _._ 936e _−_ 3 1 _._ 01 _±_ 3 _._ 038e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 809 _±_ 4 _._ 583e _−_ 4 1 _±_ 8 _._ 544e _−_ 5 0 _._ 806 _±_ 2 _._ 517e _−_ 5 1 _±_ 0e0
Llama-3.1 ICD lstm 0 _._ 809 _±_ 8 _._ 811e _−_ 4 1 _±_ 3 _._ 636e _−_ 4 0 _._ 806 _±_ 2 _._ 156e _−_ 4 1 _±_ 1 _._ 258e _−_ 5
Llama-3.1 ICD mlp 0 _._ 811 _±_ 2 _._ 589e _−_ 4 1 _._ 001 _±_ 4 _._ 671e _−_ 4 0 _._ 806 _±_ 2 _._ 696e _−_ 4 1 _±_ 9 _._ 287e _−_ 5
Llama-3.1 ICD patchtsmixer 0 _._ 812 _±_ 3 _._ 624e _−_ 3 1 _._ 007 _±_ 1 _._ 829e _−_ 3 0 _._ 806 _±_ 2 _._ 141e _−_ 3 1 _._ 003 _±_ 5 _._ 351e _−_ 4
Llama-3.1 ICD timemixer 0 _._ 808 _±_ 1 _._ 322e _−_ 3 1 _±_ 1 _._ 954e _−_ 4 0 _._ 806 _±_ 1 _._ 735e _−_ 4 1 _±_ 1 _._ 155e _−_ 5
Llama-3.1 Trend +TFM lstm 0 _._ 808 _±_ 7 _._ 317e _−_ 4 1 _±_ 1 _._ 686e _−_ 4 0 _._ 806 _±_ 1 _._ 852e _−_ 4 1 _±_ 2 _._ 122e _−_ 4
Llama-3.1 Trend +TFM mlp 0 _._ 81 _±_ 5 _._ 956e _−_ 4 1 _._ 002 _±_ 7 _._ 123e _−_ 4 0 _._ 806 _±_ 2 _._ 358e _−_ 4 1 _±_ 1 _._ 332e _−_ 4
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 817 _±_ 1 _._ 749e _−_ 3 1 _._ 015 _±_ 1 _._ 827e _−_ 3 0 _._ 81 _±_ 1 _._ 337e _−_ 3 1 _._ 008 _±_ 2 _._ 62e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 809 _±_ 1 _._ 489e _−_ 3 1 _±_ 3 _._ 053e _−_ 4 0 _._ 806 _±_ 1 _._ 429e _−_ 4 1 _±_ 5 _._ 774e _−_ 6
Llama-3.1 Trend lstm 0 _._ 809 _±_ 6 _._ 381e _−_ 4 1 _±_ 1 _._ 916e _−_ 4 0 _._ 806 _±_ 6 _._ 055e _−_ 5 1 _±_ 1 _._ 204e _−_ 4
Llama-3.1 Trend mlp 0 _._ 81 _±_ 1 _._ 442e _−_ 3 1 _._ 001 _±_ 6 _._ 115e _−_ 4 0 _._ 806 _±_ 2 _._ 001e _−_ 4 1 _±_ 5 _._ 56e _−_ 5
Llama-3.1 Trend patchtsmixer 0 _._ 814 _±_ 5 _._ 117e _−_ 3 1 _._ 006 _±_ 2 _._ 978e _−_ 3 0 _._ 808 _±_ 2 _._ 131e _−_ 3 1 _._ 003 _±_ 8 _._ 315e _−_ 4
Llama-3.1 Trend timemixer 0 _._ 809 _±_ 1 _._ 561e _−_ 3 1 _._ 001 _±_ 5 _._ 321e _−_ 4 0 _._ 806 _±_ 7 _._ 544e _−_ 5 1 _±_ 5 _._ 774e _−_ 6
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 808 _±_ 1 _._ 195e _−_ 3 1 _±_ 2 _._ 488e _−_ 4 0 _._ 806 _±_ 2 _._ 303e _−_ 4 1 _±_ 6 _._ 245e _−_ 5
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 809 _±_ 1 _._ 027e _−_ 3 1 _._ 001 _±_ 5 _._ 934e _−_ 4 0 _._ 806 _±_ 6 _._ 986e _−_ 4 1 _±_ 4 _._ 151e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 818 _±_ 3 _._ 996e _−_ 3 1 _._ 017 _±_ 4 _._ 479e _−_ 3 0 _._ 81 _±_ 3 _._ 067e _−_ 3 1 _._ 011 _±_ 4 _._ 664e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 809 _±_ 2 _._ 103e _−_ 4 1 _±_ 5 _._ 568e _−_ 5 0 _._ 806 _±_ 5 _._ 774e _−_ 5 1 _±_ 5 _._ 774e _−_ 6
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 809 _±_ 6 _._ 559e _−_ 4 1 _±_ 1 _._ 919e _−_ 4 0 _._ 806 _±_ 1 _._ 746e _−_ 4 1 _±_ 3 _._ 5e _−_ 5
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 811 _±_ 6 _._ 466e _−_ 4 1 _._ 001 _±_ 3 _._ 994e _−_ 4 0 _._ 806 _±_ 2 _._ 325e _−_ 4 1 _±_ 1 _._ 041e _−_ 4
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 812 _±_ 2 _._ 08e _−_ 3 1 _._ 006 _±_ 1 _._ 313e _−_ 3 0 _._ 81 _±_ 2 _._ 757e _−_ 3 1 _._ 006 _±_ 2 _._ 814e _−_ 3
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 809 _±_ 8 _._ 806e _−_ 4 1 _±_ 2 _._ 117e _−_ 4 0 _._ 806 _±_ 2 _._ 986e _−_ 5 1 _±_ 0e0
TFM lstm 0 _._ 752 _±_ 8 _._ 624e _−_ 4 0 _._ 935 _±_ 1 _._ 439e _−_ 4 0 _._ 75 _±_ 1 _._ 715e _−_ 4 0 _._ 935 _±_ 2 _._ 179e _−_ 4
TFM mlp 0 _._ 753 _±_ 1 _._ 029e _−_ 3 0 _._ 935 _±_ 1 _._ 105e _−_ 4 0 _._ 75 _±_ 9 _._ 912e _−_ 5 0 _._ 935 _±_ 2 _._ 134e _−_ 4
TFM patchtsmixer 0 _._ 761 _±_ 3 _._ 671e _−_ 3 0 _._ 947 _±_ 1 _._ 981e _−_ 3 0 _._ 753 _±_ 1 _._ 024e _−_ 3 0 _._ 943 _±_ 1 _._ 584e _−_ 3
TFM timemixer 0 _._ 753 _±_ 8 _._ 952e _−_ 4 0 _._ 934 _±_ 2 _._ 106e _−_ 4 0 _._ 75 _±_ 2 _._ 007e _−_ 4 0 _._ 934 _±_ 4 _._ 435e _−_ 5
TSDE lstm 0 _._ 751 _±_ 4 _._ 323e _−_ 3 0 _._ 936 _±_ 9 _._ 137e _−_ 4 0 _._ 751 _±_ 3 _._ 034e _−_ 4 0 _._ 935 _±_ 7 _._ 839e _−_ 4
TSDE mlp 0 _._ 748 _±_ 1 _._ 451e _−_ 3 0 _._ 939 _±_ 5 _._ 069e _−_ 3 0 _._ 752 _±_ 8 _._ 398e _−_ 3 0 _._ 936 _±_ 5 _._ 379e _−_ 3
TSDE patchtsmixer 0 _._ 762 _±_ 2 _._ 922e _−_ 3 0 _._ 951 _±_ 3 _._ 481e _−_ 3 0 _._ 755 _±_ 2 _._ 716e _−_ 3 0 _._ 944 _±_ 6 _._ 36e _−_ 3
TSDE timemixer 0 _._ 753 _±_ 8 _._ 294e _−_ 4 0 _._ 934 _±_ 1 _._ 949e _−_ 4 0 _._ 75 _±_ 1 _._ 949e _−_ 4 0 _._ 934 _±_ 4 _._ 646e _−_ 5
gemini-2.0-flash CoT +TFM lstm 0 _._ 807 _±_ 1 _._ 032e _−_ 3 1 _±_ 6 _._ 643e _−_ 4 0 _._ 806 _±_ 1 _._ 493e _−_ 4 0 _._ 999 _±_ 3 _._ 544e _−_ 4
gemini-2.0-flash CoT +TFM mlp 0 _._ 81 _±_ 1 _._ 06e _−_ 3 1 _._ 001 _±_ 5 _._ 029e _−_ 4 0 _._ 806 _±_ 2 _._ 875e _−_ 4 1 _±_ 9 _._ 074e _−_ 5
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 814 _±_ 3 _._ 898e _−_ 3 1 _._ 016 _±_ 6 _._ 893e _−_ 3 0 _._ 809 _±_ 3 _._ 754e _−_ 3 1 _._ 011 _±_ 5 _._ 063e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 809 _±_ 1 _._ 33e _−_ 3 1 _±_ 3 _._ 384e _−_ 4 0 _._ 806 _±_ 1 _._ 955e _−_ 4 1 _±_ 1 _._ 528e _−_ 5
gemini-2.0-flash CoT lstm 0 _._ 809 _±_ 6 _._ 393e _−_ 4 1 _±_ 2 _._ 156e _−_ 4 0 _._ 806 _±_ 3 _._ 094e _−_ 4 1 _±_ 4 _._ 5e _−_ 5
gemini-2.0-flash CoT mlp 0 _._ 81 _±_ 5 _._ 832e _−_ 4 1 _._ 001 _±_ 1 _._ 909e _−_ 4 0 _._ 806 _±_ 9 _._ 032e _−_ 5 1 _±_ 1 _._ 152e _−_ 4
gemini-2.0-flash CoT patchtsmixer 0 _._ 813 _±_ 7 _._ 459e _−_ 3 1 _._ 007 _±_ 5 _._ 039e _−_ 3 0 _._ 808 _±_ 1 _._ 732e _−_ 3 1 _._ 003 _±_ 7 _._ 908e _−_ 4
gemini-2.0-flash CoT timemixer 0 _._ 808 _±_ 3 _._ 555e _−_ 4 1 _±_ 6 _._ 397e _−_ 5 0 _._ 806 _±_ 1 _._ 782e _−_ 4 1 _±_ 5 _._ 774e _−_ 6
gemini-2.0-flash ICD +TFM lstm 0 _._ 808 _±_ 4 _._ 688e _−_ 4 1 _±_ 7 _._ 38e _−_ 4 0 _._ 806 _±_ 1 _._ 361e _−_ 4 1 _±_ 1 _._ 32e _−_ 4
gemini-2.0-flash ICD +TFM mlp 0 _._ 81 _±_ 1 _._ 535e _−_ 3 1 _._ 001 _±_ 4 _._ 917e _−_ 4 0 _._ 806 _±_ 2 _._ 272e _−_ 4 1 _±_ 4 _._ 293e _−_ 4
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 818 _±_ 8 _._ 371e _−_ 3 1 _._ 02 _±_ 1 _._ 025e _−_ 2 0 _._ 809 _±_ 1 _._ 245e _−_ 3 1 _._ 009 _±_ 2 _._ 844e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 809 _±_ 4 _._ 362e _−_ 4 1 _±_ 9 _._ 539e _−_ 5 0 _._ 806 _±_ 1 _._ 127e _−_ 4 1 _±_ 1 _._ 155e _−_ 5
gemini-2.0-flash ICD lstm 0 _._ 809 _±_ 1 _._ 269e _−_ 3 1 _._ 001 _±_ 3 _._ 017e _−_ 4 0 _._ 806 _±_ 1 _._ 464e _−_ 4 1 _±_ 8 _._ 098e _−_ 5
gemini-2.0-flash ICD mlp 0 _._ 811 _±_ 8 _._ 003e _−_ 4 1 _._ 001 _±_ 2 _._ 453e _−_ 4 0 _._ 806 _±_ 2 _._ 757e _−_ 4 1 _±_ 4 _._ 031e _−_ 5
gemini-2.0-flash ICD patchtsmixer 0 _._ 812 _±_ 2 _._ 618e _−_ 3 1 _._ 006 _±_ 1 _._ 148e _−_ 3 0 _._ 809 _±_ 5 _._ 485e _−_ 3 1 _._ 005 _±_ 1 _._ 02e _−_ 3
gemini-2.0-flash ICD timemixer 0 _._ 809 _±_ 8 _._ 427e _−_ 4 1 _±_ 2 _._ 123e _−_ 4 0 _._ 806 _±_ 4 _._ 717e _−_ 5 1 _±_ 8 _._ 165e _−_ 6
gemini-2.0-flash Trend +TFM lstm 0 _._ 807 _±_ 6 _._ 799e _−_ 4 1 _±_ 4 _._ 355e _−_ 4 0 _._ 806 _±_ 2 _._ 787e _−_ 4 1 _±_ 1 _._ 25e _−_ 4
gemini-2.0-flash Trend +TFM mlp 0 _._ 81 _±_ 8 _._ 972e _−_ 4 1 _._ 001 _±_ 3 _._ 132e _−_ 4 0 _._ 806 _±_ 4 _._ 257e _−_ 4 1 _±_ 3 _._ 781e _−_ 4
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 821 _±_ 1 _._ 446e _−_ 3 1 _._ 02 _±_ 3 _._ 373e _−_ 3 0 _._ 809 _±_ 1 _._ 505e _−_ 3 1 _._ 012 _±_ 4 _._ 289e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 81 _±_ 6 _._ 006e _−_ 4 1 _._ 001 _±_ 2 _._ 248e _−_ 4 0 _._ 806 _±_ 1 _._ 589e _−_ 4 1 _±_ 1 _._ 155e _−_ 5
gemini-2.0-flash Trend lstm 0 _._ 809 _±_ 1 _._ 841e _−_ 3 1 _._ 001 _±_ 5 _._ 033e _−_ 4 0 _._ 806 _±_ 2 _._ 012e _−_ 4 1 _±_ 1 _._ 688e _−_ 4
gemini-2.0-flash Trend mlp 0 _._ 81 _±_ 7 _._ 437e _−_ 4 1 _._ 001 _±_ 5 _._ 1e _−_ 4 0 _._ 806 _±_ 2 _._ 729e _−_ 4 1 _±_ 4 _._ 573e _−_ 5
gemini-2.0-flash Trend patchtsmixer 0 _._ 814 _±_ 5 _._ 695e _−_ 3 1 _._ 009 _±_ 6 _._ 999e _−_ 3 0 _._ 807 _±_ 4 _._ 126e _−_ 3 1 _._ 005 _±_ 2 _._ 361e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 809 _±_ 1 _._ 008e _−_ 3 1 _±_ 2 _._ 575e _−_ 4 0 _._ 806 _±_ 1 _._ 406e _−_ 4 1 _±_ 5e _−_ 6
gemini-2.0-flash zero shot +TFM lstm 0 _._ 808 _±_ 4 _._ 114e _−_ 4 1 _±_ 3 _._ 051e _−_ 4 0 _._ 806 _±_ 4 _._ 583e _−_ 5 1 _±_ 1 _._ 825e _−_ 4
gemini-2.0-flash zero shot +TFM mlp 0 _._ 81 _±_ 1 _._ 831e _−_ 3 1 _._ 002 _±_ 5 _._ 443e _−_ 4 0 _._ 806 _±_ 2 _._ 179e _−_ 4 1 _±_ 2 _._ 193e _−_ 4
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 816 _±_ 2 _._ 724e _−_ 3 1 _._ 015 _±_ 4 _._ 367e _−_ 3 0 _._ 809 _±_ 4 _._ 541e _−_ 3 1 _._ 009 _±_ 5 _._ 198e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 809 _±_ 9 _._ 551e _−_ 4 1 _±_ 2 _._ 359e _−_ 4 0 _._ 806 _±_ 4 _._ 966e _−_ 4 1 _±_ 5 _._ 774e _−_ 6
gemini-2.0-flash zero shot lstm 0 _._ 808 _±_ 9 _._ 849e _−_ 4 1 _±_ 2 _._ 015e _−_ 4 0 _._ 806 _±_ 1 _._ 696e _−_ 4 1 _±_ 4 _._ 435e _−_ 5
gemini-2.0-flash zero shot mlp 0 _._ 81 _±_ 6 _._ 791e _−_ 4 1 _._ 001 _±_ 3 _._ 608e _−_ 4 0 _._ 806 _±_ 9 _._ 592e _−_ 5 1 _±_ 7 _._ 5e _−_ 5
gemini-2.0-flash zero shot patchtsmixer 0 _._ 814 _±_ 2 _._ 721e _−_ 3 1 _._ 007 _±_ 3 _._ 521e _−_ 3 0 _._ 809 _±_ 5 _._ 301e _−_ 3 1 _._ 005 _±_ 2 _._ 145e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 809 _±_ 6 _._ 028e _−_ 4 1 _±_ 1 _._ 916e _−_ 4 0 _._ 806 _±_ 2 _._ 674e _−_ 4 1 _±_ 8 _._ 165e _−_ 6
interp lstm 0 _._ 751 _±_ 8 _._ 926e _−_ 4 0 _._ 933 _±_ 1 _._ 031e _−_ 3 0 _._ 751 _±_ 1 _._ 276e _−_ 3 0 _._ 935 _±_ 7 _._ 468e _−_ 4
interp mlp 0 _._ 754 _±_ 6 _._ 643e _−_ 4 0 _._ 939 _±_ 3 _._ 273e _−_ 3 0 _._ 752 _±_ 1 _._ 327e _−_ 3 0 _._ 938 _±_ 4 _._ 643e _−_ 3
interp patchtsmixer 0 _._ 785 _±_ 2 _._ 196e _−_ 2 0 _._ 998 _±_ 2 _._ 299e _−_ 2 0 _._ 778 _±_ 6 _._ 66e _−_ 3 0 _._ 976 _±_ 8 _._ 186e _−_ 3
interp timemixer 0 _._ 753 _±_ 7 _._ 487e _−_ 4 0 _._ 934 _±_ 1 _._ 144e _−_ 4 0 _._ 75 _±_ 7 _._ 165e _−_ 5 0 _._ 935 _±_ 2 _._ 449e _−_ 5
mean lstm 0 _._ 752 _±_ 1 _._ 66e _−_ 3 0 _._ 934 _±_ 3 _._ 463e _−_ 4 0 _._ 75 _±_ 1 _._ 994e _−_ 3 0 _._ 934 _±_ 8 _._ 96e _−_ 4
mean mlp 0 _._ 752 _±_ 1 _._ 087e _−_ 3 0 _._ 933 _±_ 1 _._ 557e _−_ 3 0 _._ 751 _±_ 1 _._ 89e _−_ 3 0 _._ 936 _±_ 1 _._ 947e _−_ 3
mean patchtsmixer 0 _._ 805 _±_ 7 _._ 924e _−_ 3 1 _._ 022 _±_ 1 _._ 104e _−_ 2 0 _._ 786 _±_ 1 _._ 582e _−_ 2 0 _._ 991 _±_ 2 _._ 368e _−_ 2
mean timemixer 0 _._ 753 _±_ 7 _._ 514e _−_ 4 0 _._ 934 _±_ 1 _._ 1e _−_ 4 0 _._ 75 _±_ 1 _._ 05e _−_ 4 0 _._ 934 _±_ 2 _._ 363e _−_ 5
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 809 _±_ 2 _._ 112e _−_ 3 1 _±_ 6 _._ 208e _−_ 4 0 _._ 805 _±_ 7 _._ 478e _−_ 4 1 _±_ 4 _._ 276e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 809 _±_ 4 _._ 597e _−_ 4 1 _._ 001 _±_ 6 _._ 295e _−_ 4 0 _._ 806 _±_ 5 _._ 831e _−_ 4 1 _±_ 4 _._ 072e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 813 _±_ 2 _._ 364e _−_ 4 1 _._ 012 _±_ 1 _._ 163e _−_ 3 0 _._ 815 _±_ 5 _._ 372e _−_ 3 1 _._ 013 _±_ 5 _._ 639e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 809 _±_ 1 _._ 329e _−_ 3 1 _±_ 4 _._ 188e _−_ 4 0 _._ 806 _±_ 1 _._ 617e _−_ 4 1 _±_ 1e _−_ 5
No ~~s~~ um ~~C~~ oT lstm 0 _._ 809 _±_ 7 _._ 066e _−_ 4 1 _±_ 1 _._ 576e _−_ 4 0 _._ 806 _±_ 1 _._ 992e _−_ 4 1 _±_ 1 _._ 435e _−_ 4
No ~~s~~ um ~~C~~ oT mlp 0 _._ 811 _±_ 7 _._ 703e _−_ 4 1 _._ 001 _±_ 8 _._ 169e _−_ 4 0 _._ 806 _±_ 2 _._ 83e _−_ 4 1 _±_ 7 _._ 5e _−_ 5
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 811 _±_ 6 _._ 678e _−_ 3 1 _._ 007 _±_ 3 _._ 376e _−_ 3 0 _._ 809 _±_ 4 _._ 199e _−_ 3 1 _._ 003 _±_ 2 _._ 354e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 808 _±_ 7 _._ 487e _−_ 4 1 _±_ 1 _._ 182e _−_ 4 0 _._ 806 _±_ 1 _._ 556e _−_ 4 1 _±_ 9 _._ 574e _−_ 6
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 807 _±_ 8 _._ 242e _−_ 4 1 _±_ 6 _._ 817e _−_ 4 0 _._ 806 _±_ 1 _._ 559e _−_ 4 0 _._ 999 _±_ 1 _._ 57e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 81 _±_ 1 _._ 585e _−_ 3 1 _±_ 1 _._ 733e _−_ 3 0 _._ 806 _±_ 4 _._ 96e _−_ 4 1 _._ 001 _±_ 7 _._ 355e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 82 _±_ 5 _._ 856e _−_ 4 1 _._ 019 _±_ 2 _._ 224e _−_ 3 0 _._ 808 _±_ 1 _._ 143e _−_ 3 1 _._ 006 _±_ 3 _._ 275e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 809 _±_ 1 _._ 065e _−_ 3 1 _±_ 3 _._ 055e _−_ 4 0 _._ 806 _±_ 7 _._ 506e _−_ 5 1 _±_ 5 _._ 774e _−_ 6
No ~~s~~ um ~~I~~ CD lstm 0 _._ 809 _±_ 1 _._ 448e _−_ 3 1 _._ 001 _±_ 4 _._ 847e _−_ 4 0 _._ 806 _±_ 4 _._ 021e _−_ 4 1 _±_ 1 _._ 452e _−_ 4
No ~~s~~ um ~~I~~ CD mlp 0 _._ 81 _±_ 7 _._ 661e _−_ 4 1 _._ 001 _±_ 1 _._ 434e _−_ 4 0 _._ 806 _±_ 1 _._ 575e _−_ 4 1 _±_ 8 _._ 421e _−_ 5
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 81 _±_ 3 _._ 309e _−_ 3 1 _._ 006 _±_ 2 _._ 53e _−_ 3 0 _._ 807 _±_ 2 _._ 762e _−_ 3 1 _._ 004 _±_ 2 _._ 054e _−_ 3
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 809 _±_ 2 _._ 861e _−_ 4 1 _±_ 6 _._ 481e _−_ 5 0 _._ 806 _±_ 7 _._ 394e _−_ 5 1 _±_ 5 _._ 774e _−_ 6
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 807 _±_ 4 _._ 004e _−_ 4 0 _._ 999 _±_ 1 _._ 106e _−_ 3 0 _._ 806 _±_ 5 _._ 069e _−_ 4 0 _._ 999 _±_ 8 _._ 869e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 81 _±_ 8 _._ 718e _−_ 5 1 _._ 001 _±_ 1e _−_ 3 0 _._ 806 _±_ 3 _._ 279e _−_ 4 1 _±_ 3 _._ 315e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 818 _±_ 1 _._ 8e _−_ 3 1 _._ 02 _±_ 6 _._ 814e _−_ 3 0 _._ 808 _±_ 5 _._ 538e _−_ 4 1 _._ 009 _±_ 2 _._ 116e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 809 _±_ 1 _._ 429e _−_ 3 1 _±_ 4 _._ 236e _−_ 4 0 _._ 806 _±_ 1 _._ 501e _−_ 4 1 _±_ 1 _._ 155e _−_ 5


Table 20: Cross-site transfer results - Age. (part 1/2)


36


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**mae** **mse** **mae** **mse**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 808 _±_ 1 _._ 044e _−_ 3 1 _±_ 3 _._ 807e _−_ 4 0 _._ 806 _±_ 1 _._ 065e _−_ 4 1 _±_ 1 _._ 88e _−_ 4
No ~~s~~ um ~~T~~ rend mlp 0 _._ 81 _±_ 1 _._ 264e _−_ 3 1 _±_ 7 _._ 27e _−_ 4 0 _._ 806 _±_ 3 _._ 889e _−_ 4 1 _±_ 2 _._ 887e _−_ 5
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 814 _±_ 3 _._ 215e _−_ 3 1 _._ 007 _±_ 3 _._ 595e _−_ 3 0 _._ 808 _±_ 4 _._ 422e _−_ 3 1 _._ 005 _±_ 3 _._ 252e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 809 _±_ 5 _._ 934e _−_ 4 1 _±_ 1 _._ 409e _−_ 4 0 _._ 806 _±_ 7 _._ 5e _−_ 5 1 _±_ 5e _−_ 6
medgemma CoT +TFM lstm 0 _._ 807 _±_ 6 _._ 886e _−_ 4 1 _±_ 3 _._ 897e _−_ 4 0 _._ 806 _±_ 2 _._ 281e _−_ 4 1 _±_ 1 _._ 756e _−_ 4
medgemma CoT +TFM mlp 0 _._ 81 _±_ 9 _._ 819e _−_ 4 1 _._ 002 _±_ 4 _._ 46e _−_ 4 0 _._ 806 _±_ 7 _._ 937e _−_ 5 1 _±_ 3 _._ 215e _−_ 5
medgemma CoT +TFM patchtsmixer 0 _._ 819 _±_ 4 _._ 652e _−_ 3 1 _._ 026 _±_ 1 _._ 106e _−_ 2 0 _._ 809 _±_ 1 _._ 123e _−_ 3 1 _._ 009 _±_ 1 _._ 528e _−_ 3
medgemma CoT +TFM timemixer 0 _._ 81 _±_ 1 _._ 138e _−_ 3 1 _._ 001 _±_ 3 _._ 758e _−_ 4 0 _._ 806 _±_ 1 _._ 301e _−_ 4 1 _±_ 5 _._ 774e _−_ 6
medgemma CoT lstm 0 _._ 808 _±_ 1 _._ 51e _−_ 3 1 _±_ 4 _._ 267e _−_ 4 0 _._ 806 _±_ 5 _._ 745e _−_ 5 1 _±_ 4 _._ 573e _−_ 5
medgemma CoT mlp 0 _._ 811 _±_ 1 _._ 383e _−_ 3 1 _._ 001 _±_ 6 _._ 851e _−_ 4 0 _._ 806 _±_ 1 _._ 718e _−_ 4 1 _±_ 9 _._ 5e _−_ 5
medgemma CoT patchtsmixer 0 _._ 812 _±_ 2 _._ 312e _−_ 3 1 _._ 006 _±_ 1 _._ 899e _−_ 3 0 _._ 811 _±_ 2 _._ 944e _−_ 3 1 _._ 006 _±_ 2 _._ 257e _−_ 3
medgemma CoT timemixer 0 _._ 809 _±_ 4 _._ 816e _−_ 4 1 _±_ 1 _._ 329e _−_ 4 0 _._ 806 _±_ 2 _._ 278e _−_ 4 1 _±_ 9 _._ 574e _−_ 6
medgemma ICD +TFM lstm 0 _._ 809 _±_ 5 _._ 368e _−_ 4 1 _±_ 2 _._ 483e _−_ 4 0 _._ 806 _±_ 1 _._ 159e _−_ 4 1 _±_ 2 _._ 397e _−_ 4
medgemma ICD +TFM mlp 0 _._ 811 _±_ 1 _._ 223e _−_ 3 1 _._ 002 _±_ 1 _._ 109e _−_ 3 0 _._ 806 _±_ 1 _._ 345e _−_ 4 1 _±_ 4 _._ 107e _−_ 4
medgemma ICD +TFM patchtsmixer 0 _._ 819 _±_ 2 _._ 332e _−_ 3 1 _._ 018 _±_ 3 _._ 501e _−_ 3 0 _._ 81 _±_ 2 _._ 333e _−_ 3 1 _._ 009 _±_ 1 _._ 351e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 809 _±_ 3 _._ 502e _−_ 4 1 _±_ 7 _._ 506e _−_ 5 0 _._ 806 _±_ 7 _._ 572e _−_ 5 1 _±_ 1 _._ 155e _−_ 5
medgemma ICD lstm 0 _._ 808 _±_ 8 _._ 344e _−_ 4 1 _±_ 1 _._ 992e _−_ 4 0 _._ 806 _±_ 1 _._ 976e _−_ 4 1 _±_ 4 _._ 349e _−_ 5
medgemma ICD mlp 0 _._ 811 _±_ 5 _._ 262e _−_ 4 1 _._ 001 _±_ 5 _._ 917e _−_ 4 0 _._ 806 _±_ 3 _._ 189e _−_ 4 1 _±_ 1 _._ 192e _−_ 4
medgemma ICD patchtsmixer 0 _._ 813 _±_ 4 _._ 584e _−_ 4 1 _._ 007 _±_ 3 _._ 122e _−_ 3 0 _._ 809 _±_ 2 _._ 417e _−_ 3 1 _._ 004 _±_ 1 _._ 357e _−_ 3
medgemma ICD timemixer 0 _._ 808 _±_ 5 _._ 545e _−_ 4 1 _±_ 1 _._ 08e _−_ 4 0 _._ 806 _±_ 8 _._ 655e _−_ 5 1 _±_ 0e0
medgemma Trend +TFM lstm 0 _._ 807 _±_ 1 _._ 015e _−_ 3 1 _±_ 1 _._ 852e _−_ 4 0 _._ 806 _±_ 1 _._ 069e _−_ 4 1 _±_ 1 _._ 701e _−_ 4
medgemma Trend +TFM mlp 0 _._ 81 _±_ 1 _._ 065e _−_ 3 1 _._ 001 _±_ 9 _._ 487e _−_ 4 0 _._ 806 _±_ 1 _._ 931e _−_ 4 1 _±_ 1 _._ 222e _−_ 4
medgemma Trend +TFM patchtsmixer 0 _._ 818 _±_ 1 _._ 52e _−_ 3 1 _._ 017 _±_ 3 _._ 255e _−_ 3 0 _._ 809 _±_ 3 _._ 577e _−_ 3 1 _._ 011 _±_ 5 _._ 994e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 809 _±_ 1 _._ 036e _−_ 3 1 _±_ 2 _._ 227e _−_ 4 0 _._ 806 _±_ 1 _._ 501e _−_ 4 1 _±_ 1e _−_ 5
medgemma Trend lstm 0 _._ 808 _±_ 4 _._ 689e _−_ 4 1 _±_ 1 _._ 658e _−_ 4 0 _._ 806 _±_ 1 _._ 389e _−_ 4 1 _±_ 4 _._ 031e _−_ 5
medgemma Trend mlp 0 _._ 81 _±_ 9 _._ 645e _−_ 4 1 _._ 001 _±_ 5 _._ 056e _−_ 4 0 _._ 806 _±_ 1 _._ 05e _−_ 4 1 _±_ 1 _._ 323e _−_ 4
medgemma Trend patchtsmixer 0 _._ 811 _±_ 2 _._ 372e _−_ 3 1 _._ 006 _±_ 1 _._ 387e _−_ 3 0 _._ 807 _±_ 1 _._ 916e _−_ 3 1 _._ 004 _±_ 4 _._ 877e _−_ 4
medgemma Trend timemixer 0 _._ 809 _±_ 7 _._ 393e _−_ 4 1 _±_ 1 _._ 797e _−_ 4 0 _._ 806 _±_ 1 _._ 977e _−_ 4 1 _±_ 9 _._ 574e _−_ 6
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 808 _±_ 1 _._ 404e _−_ 3 1 _±_ 8 _._ 8e _−_ 4 0 _._ 806 _±_ 1 _._ 114e _−_ 4 1 _±_ 1 _._ 629e _−_ 4
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 81 _±_ 1 _._ 093e _−_ 3 1 _._ 001 _±_ 5 _._ 905e _−_ 4 0 _._ 806 _±_ 1 _._ 206e _−_ 4 1 _±_ 1 _._ 277e _−_ 4
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 819 _±_ 2 _._ 865e _−_ 3 1 _._ 019 _±_ 5 _._ 564e _−_ 3 0 _._ 809 _±_ 2 _._ 487e _−_ 3 1 _._ 008 _±_ 1 _._ 207e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 809 _±_ 1 _._ 033e _−_ 3 1 _±_ 2 _._ 088e _−_ 4 0 _._ 806 _±_ 3 _._ 606e _−_ 5 1 _±_ 5 _._ 774e _−_ 6
medgemma zero ~~s~~ hot lstm 0 _._ 808 _±_ 1 _._ 186e _−_ 3 1 _±_ 3 _._ 106e _−_ 4 0 _._ 806 _±_ 2 _._ 29e _−_ 4 1 _±_ 8 _._ 347e _−_ 5
medgemma zero ~~s~~ hot mlp 0 _._ 809 _±_ 7 _._ 985e _−_ 4 1 _±_ 4 _._ 812e _−_ 4 0 _._ 806 _±_ 2 _._ 216e _−_ 4 1 _±_ 4 _._ 272e _−_ 5
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 813 _±_ 2 _._ 217e _−_ 3 1 _._ 007 _±_ 3 _._ 561e _−_ 3 0 _._ 805 _±_ 4 _._ 02e _−_ 3 1 _._ 005 _±_ 1 _._ 791e _−_ 3
medgemma zero ~~s~~ hot timemixer 0 _._ 808 _±_ 6 _._ 186e _−_ 4 1 _±_ 1 _._ 103e _−_ 4 0 _._ 806 _±_ 1 _._ 676e _−_ 4 1 _±_ 1 _._ 291e _−_ 5
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM lstm 0 _._ 809 _±_ 3 _._ 194e _−_ 4 1 _._ 001 _±_ 4 _._ 528e _−_ 4 0 _._ 806 _±_ 1 _._ 311e _−_ 3 1 _±_ 1 _._ 171e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM mlp 0 _._ 81 _±_ 2 _._ 697e _−_ 3 1 _±_ 3 _._ 251e _−_ 3 0 _._ 805 _±_ 9 _._ 241e _−_ 4 1 _±_ 3 _._ 913e _−_ 4
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 816 _±_ 1 _._ 487e _−_ 3 1 _._ 016 _±_ 5 _._ 008e _−_ 3 0 _._ 81 _±_ 1 _._ 121e _−_ 3 1 _._ 01 _±_ 1 _._ 845e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM timemixer 0 _._ 809 _±_ 5 _._ 515e _−_ 4 1 _±_ 1 _._ 752e _−_ 4 0 _._ 806 _±_ 2 _._ 05e _−_ 4 1 _±_ 1 _._ 528e _−_ 5
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 81 _±_ 1 _._ 741e _−_ 3 1 _._ 001 _±_ 4 _._ 948e _−_ 4 0 _._ 806 _±_ 1 _._ 261e _−_ 4 1 _±_ 5 _._ 123e _−_ 5
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 81 _±_ 1 _._ 638e _−_ 3 1 _._ 001 _±_ 9 _._ 81e _−_ 4 0 _._ 806 _±_ 1 _._ 682e _−_ 4 1 _±_ 1 _._ 037e _−_ 4
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 812 _±_ 1 _._ 574e _−_ 3 1 _._ 007 _±_ 2 _._ 336e _−_ 3 0 _._ 807 _±_ 4 _._ 249e _−_ 3 1 _._ 004 _±_ 9 _._ 251e _−_ 4
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 809 _±_ 5 _._ 216e _−_ 4 1 _±_ 1 _._ 253e _−_ 4 0 _._ 806 _±_ 2 _._ 181e _−_ 4 1 _±_ 1 _._ 732e _−_ 5
right lstm 0 _._ 751 _±_ 9 _._ 323e _−_ 4 0 _._ 933 _±_ 1 _._ 35e _−_ 3 0 _._ 751 _±_ 1 _._ 816e _−_ 3 0 _._ 935 _±_ 5 _._ 847e _−_ 4
right mlp 0 _._ 753 _±_ 1 _._ 278e _−_ 3 0 _._ 933 _±_ 1 _._ 511e _−_ 3 0 _._ 75 _±_ 6 _._ 719e _−_ 4 0 _._ 934 _±_ 5 _._ 928e _−_ 4
right patchtsmixer 0 _._ 792 _±_ 1 _._ 487e _−_ 2 0 _._ 994 _±_ 1 _._ 356e _−_ 2 0 _._ 772 _±_ 2 _._ 593e _−_ 3 0 _._ 966 _±_ 5 _._ 168e _−_ 3
right timemixer 0 _._ 753 _±_ 7 _._ 362e _−_ 4 0 _._ 934 _±_ 1 _._ 1e _−_ 4 0 _._ 75 _±_ 1 _._ 352e _−_ 4 0 _._ 935 _±_ 4 _._ 655e _−_ 5


Table 21: Cross-site transfer results - Age. (part 2/2)


37


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc** **auprc** **auroc**


Llama-3.1 CoT +TFM lstm 0 _._ 682 _±_ 8 _._ 894e _−_ 3 0 _._ 555 _±_ 1 _._ 246e _−_ 2 0 _._ 655 _±_ 1 _._ 33e _−_ 2 0 _._ 585 _±_ 1 _._ 425e _−_ 2 0 _._ 693 _±_ 7 _._ 3e _−_ 3 0 _._ 573 _±_ 1 _._ 212e _−_ 2
Llama-3.1 CoT +TFM mlp 0 _._ 72 _±_ 7 _._ 983e _−_ 3 0 _._ 6 _±_ 1 _._ 015e _−_ 2 0 _._ 705 _±_ 1 _._ 309e _−_ 2 0 _._ 64 _±_ 1 _._ 339e _−_ 2 0 _._ 725 _±_ 1 _._ 677e _−_ 2 0 _._ 608 _±_ 2 _._ 07e _−_ 2
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 704 _±_ 3 _._ 667e _−_ 4 0 _._ 58 _±_ 1 _._ 341e _−_ 3 0 _._ 702 _±_ 8 _._ 468e _−_ 4 0 _._ 63 _±_ 2e _−_ 4 0 _._ 714 _±_ 5 _._ 538e _−_ 3 0 _._ 595 _±_ 6 _._ 329e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 707 _±_ 2 _._ 153e _−_ 3 0 _._ 588 _±_ 2 _._ 084e _−_ 3 0 _._ 696 _±_ 1 _._ 456e _−_ 2 0 _._ 631 _±_ 1 _._ 694e _−_ 2 0 _._ 7 _±_ 6 _._ 089e _−_ 3 0 _._ 584 _±_ 5 _._ 492e _−_ 3
Llama-3.1 CoT lstm 0 _._ 702 _±_ 3 _._ 827e _−_ 3 0 _._ 579 _±_ 5 _._ 909e _−_ 3 0 _._ 685 _±_ 2 _._ 532e _−_ 2 0 _._ 612 _±_ 2 _._ 763e _−_ 2 0 _._ 696 _±_ 6 _._ 709e _−_ 3 0 _._ 573 _±_ 1 _._ 042e _−_ 2
Llama-3.1 CoT mlp 0 _._ 704 _±_ 3 _._ 167e _−_ 3 0 _._ 581 _±_ 4 _._ 62e _−_ 3 0 _._ 702 _±_ 8 _._ 377e _−_ 3 0 _._ 634 _±_ 9 _._ 491e _−_ 3 0 _._ 707 _±_ 1 _._ 567e _−_ 2 0 _._ 586 _±_ 2 _._ 046e _−_ 2
Llama-3.1 CoT patchtsmixer 0 _._ 697 _±_ 3 _._ 109e _−_ 3 0 _._ 572 _±_ 3 _._ 425e _−_ 3 0 _._ 698 _±_ 1 _._ 118e _−_ 2 0 _._ 62 _±_ 1 _._ 096e _−_ 2 0 _._ 713 _±_ 1 _._ 649e _−_ 2 0 _._ 593 _±_ 2 _._ 004e _−_ 2
Llama-3.1 CoT timemixer 0 _._ 7 _±_ 8 _._ 593e _−_ 4 0 _._ 574 _±_ 9 _._ 507e _−_ 4 0 _._ 682 _±_ 6 _._ 902e _−_ 3 0 _._ 608 _±_ 6 _._ 689e _−_ 3 0 _._ 698 _±_ 1 _._ 743e _−_ 3 0 _._ 573 _±_ 2 _._ 178e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 681 _±_ 1 _._ 215e _−_ 2 0 _._ 555 _±_ 1 _._ 428e _−_ 2 0 _._ 624 _±_ 1 _._ 094e _−_ 2 0 _._ 554 _±_ 9 _._ 214e _−_ 3 0 _._ 692 _±_ 4 _._ 155e _−_ 3 0 _._ 567 _±_ 5 _._ 781e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 721 _±_ 1 _._ 447e _−_ 2 0 _._ 603 _±_ 1 _._ 76e _−_ 2 0 _._ 658 _±_ 1 _._ 66e _−_ 2 0 _._ 591 _±_ 1 _._ 936e _−_ 2 0 _._ 717 _±_ 8 _._ 973e _−_ 3 0 _._ 596 _±_ 1 _._ 237e _−_ 2
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 708 _±_ 5 _._ 577e _−_ 4 0 _._ 587 _±_ 3 _._ 686e _−_ 4 0 _._ 657 _±_ 8 _._ 486e _−_ 3 0 _._ 587 _±_ 8 _._ 952e _−_ 3 0 _._ 719 _±_ 7 _._ 324e _−_ 3 0 _._ 598 _±_ 8 _._ 555e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 705 _±_ 1 _._ 578e _−_ 3 0 _._ 586 _±_ 3 _._ 109e _−_ 3 0 _._ 662 _±_ 4 _._ 638e _−_ 3 0 _._ 597 _±_ 5 _._ 18e _−_ 3 0 _._ 695 _±_ 8 _._ 775e _−_ 3 0 _._ 571 _±_ 8 _._ 912e _−_ 3
Llama-3.1 ICD lstm 0 _._ 69 _±_ 3 _._ 973e _−_ 3 0 _._ 565 _±_ 6 _._ 009e _−_ 3 0 _._ 643 _±_ 5 _._ 652e _−_ 3 0 _._ 571 _±_ 5 _._ 622e _−_ 3 0 _._ 69 _±_ 5 _._ 427e _−_ 3 0 _._ 565 _±_ 7 _._ 829e _−_ 3
Llama-3.1 ICD mlp 0 _._ 698 _±_ 7 _._ 389e _−_ 3 0 _._ 575 _±_ 9 _._ 757e _−_ 3 0 _._ 645 _±_ 3 _._ 347e _−_ 3 0 _._ 575 _±_ 4 _._ 081e _−_ 3 0 _._ 699 _±_ 3 _._ 943e _−_ 3 0 _._ 574 _±_ 4 _._ 436e _−_ 3
Llama-3.1 ICD patchtsmixer 0 _._ 692 _±_ 1 _._ 261e _−_ 3 0 _._ 569 _±_ 2 _._ 164e _−_ 3 0 _._ 648 _±_ 9 _._ 119e _−_ 3 0 _._ 577 _±_ 8 _._ 647e _−_ 3 0 _._ 689 _±_ 2 _._ 35e _−_ 3 0 _._ 561 _±_ 3 _._ 104e _−_ 3
Llama-3.1 ICD timemixer 0 _._ 695 _±_ 1 _._ 662e _−_ 3 0 _._ 571 _±_ 1 _._ 684e _−_ 3 0 _._ 65 _±_ 2 _._ 146e _−_ 3 0 _._ 577 _±_ 2 _._ 153e _−_ 3 0 _._ 688 _±_ 1 _._ 409e _−_ 3 0 _._ 558 _±_ 2 _._ 071e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 683 _±_ 8 _._ 034e _−_ 3 0 _._ 556 _±_ 9 _._ 091e _−_ 3 0 _._ 62 _±_ 2 _._ 583e _−_ 3 0 _._ 553 _±_ 9 _._ 563e _−_ 4 0 _._ 697 _±_ 3 _._ 774e _−_ 3 0 _._ 575 _±_ 4 _._ 552e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 713 _±_ 1 _._ 134e _−_ 2 0 _._ 593 _±_ 1 _._ 302e _−_ 2 0 _._ 669 _±_ 1 _._ 752e _−_ 2 0 _._ 599 _±_ 2 _._ 069e _−_ 2 0 _._ 711 _±_ 5 _._ 604e _−_ 4 0 _._ 587 _±_ 7 _._ 629e _−_ 4
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 708 _±_ 3 _._ 699e _−_ 3 0 _._ 585 _±_ 5 _._ 518e _−_ 3 0 _._ 672 _±_ 6 _._ 595e _−_ 3 0 _._ 602 _±_ 7 _._ 253e _−_ 3 0 _._ 713 _±_ 7 _._ 321e _−_ 3 0 _._ 591 _±_ 9 _._ 864e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 707 _±_ 8 _._ 358e _−_ 3 0 _._ 589 _±_ 9 _._ 674e _−_ 3 0 _._ 661 _±_ 7 _._ 25e _−_ 3 0 _._ 591 _±_ 7 _._ 592e _−_ 3 0 _._ 713 _±_ 3 _._ 603e _−_ 3 0 _._ 596 _±_ 4 _._ 388e _−_ 3
Llama-3.1 Trend lstm 0 _._ 7 _±_ 4 _._ 246e _−_ 3 0 _._ 576 _±_ 6 _._ 409e _−_ 3 0 _._ 649 _±_ 4 _._ 433e _−_ 3 0 _._ 575 _±_ 4 _._ 399e _−_ 3 0 _._ 701 _±_ 5 _._ 662e _−_ 3 0 _._ 579 _±_ 7 _._ 719e _−_ 3
Llama-3.1 Trend mlp 0 _._ 699 _±_ 5 _._ 085e _−_ 3 0 _._ 574 _±_ 8 _._ 231e _−_ 3 0 _._ 663 _±_ 8 _._ 269e _−_ 3 0 _._ 592 _±_ 9 _._ 672e _−_ 3 0 _._ 7 _±_ 5 _._ 528e _−_ 3 0 _._ 576 _±_ 6 _._ 935e _−_ 3
Llama-3.1 Trend patchtsmixer 0 _._ 7 _±_ 9 _._ 98e _−_ 4 0 _._ 575 _±_ 1 _._ 986e _−_ 3 0 _._ 667 _±_ 1 _._ 93e _−_ 2 0 _._ 592 _±_ 1 _._ 845e _−_ 2 0 _._ 701 _±_ 3 _._ 676e _−_ 3 0 _._ 577 _±_ 4 _._ 355e _−_ 3
Llama-3.1 Trend timemixer 0 _._ 701 _±_ 5 _._ 141e _−_ 4 0 _._ 575 _±_ 8 _._ 269e _−_ 4 0 _._ 664 _±_ 9 _._ 245e _−_ 3 0 _._ 589 _±_ 1 _._ 015e _−_ 2 0 _._ 7 _±_ 1 _._ 113e _−_ 3 0 _._ 574 _±_ 1 _._ 374e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 687 _±_ 6 _._ 535e _−_ 3 0 _._ 56 _±_ 1 _._ 161e _−_ 2 0 _._ 64 _±_ 9 _._ 101e _−_ 3 0 _._ 573 _±_ 9 _._ 565e _−_ 3 0 _._ 687 _±_ 1 _._ 161e _−_ 2 0 _._ 564 _±_ 1 _._ 657e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 719 _±_ 1 _._ 746e _−_ 2 0 _._ 602 _±_ 2 _._ 091e _−_ 2 0 _._ 729 _±_ 8 _._ 446e _−_ 3 0 _._ 675 _±_ 9 _._ 738e _−_ 3 0 _._ 716 _±_ 1 _._ 302e _−_ 2 0 _._ 595 _±_ 1 _._ 367e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 704 _±_ 3 _._ 635e _−_ 4 0 _._ 581 _±_ 3 _._ 557e _−_ 4 0 _._ 702 _±_ 2 _._ 06e _−_ 2 0 _._ 64 _±_ 2 _._ 288e _−_ 2 0 _._ 716 _±_ 5 _._ 97e _−_ 3 0 _._ 595 _±_ 6 _._ 605e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 702 _±_ 2 _._ 551e _−_ 3 0 _._ 583 _±_ 5 _._ 376e _−_ 3 0 _._ 681 _±_ 1 _._ 312e _−_ 2 0 _._ 621 _±_ 1 _._ 569e _−_ 2 0 _._ 703 _±_ 3 _._ 164e _−_ 3 0 _._ 577 _±_ 5 _._ 926e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 697 _±_ 3 _._ 063e _−_ 3 0 _._ 575 _±_ 5 _._ 793e _−_ 3 0 _._ 67 _±_ 1 _._ 631e _−_ 2 0 _._ 605 _±_ 1 _._ 946e _−_ 2 0 _._ 7 _±_ 8 _._ 366e _−_ 3 0 _._ 578 _±_ 1 _._ 064e _−_ 2
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 7 _±_ 2 _._ 574e _−_ 3 0 _._ 577 _±_ 2 _._ 975e _−_ 3 0 _._ 693 _±_ 9 _._ 806e _−_ 3 0 _._ 635 _±_ 1 _._ 078e _−_ 2 0 _._ 698 _±_ 5 _._ 621e _−_ 3 0 _._ 573 _±_ 5 _._ 56e _−_ 3
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 698 _±_ 1 _._ 777e _−_ 3 0 _._ 575 _±_ 3 _._ 099e _−_ 3 0 _._ 709 _±_ 4 _._ 749e _−_ 3 0 _._ 651 _±_ 4 _._ 87e _−_ 3 0 _._ 699 _±_ 6 _._ 637e _−_ 3 0 _._ 574 _±_ 6 _._ 645e _−_ 3
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 702 _±_ 1 _._ 709e _−_ 3 0 _._ 579 _±_ 2 _._ 678e _−_ 3 0 _._ 699 _±_ 9 _._ 912e _−_ 3 0 _._ 639 _±_ 1 _._ 057e _−_ 2 0 _._ 696 _±_ 8 _._ 549e _−_ 3 0 _._ 569 _±_ 8 _._ 527e _−_ 3
TFM lstm 0 _._ 67 _±_ 5 _._ 001e _−_ 3 0 _._ 541 _±_ 4 _._ 894e _−_ 3 0 _._ 594 _±_ 4 _._ 994e _−_ 3 0 _._ 529 _±_ 3 _._ 431e _−_ 3 0 _._ 654 _±_ 5 _._ 393e _−_ 3 0 _._ 517 _±_ 3 _._ 594e _−_ 3
TFM mlp 0 _._ 671 _±_ 4 _._ 555e _−_ 3 0 _._ 545 _±_ 5 _._ 417e _−_ 3 0 _._ 586 _±_ 2 _._ 113e _−_ 3 0 _._ 532 _±_ 1 _._ 159e _−_ 3 0 _._ 661 _±_ 1 _._ 712e _−_ 3 0 _._ 528 _±_ 1 _._ 28e _−_ 3
TFM patchtsmixer 0 _._ 673 _±_ 1 _._ 693e _−_ 3 0 _._ 548 _±_ 8 _._ 308e _−_ 4 0 _._ 589 _±_ 1 _._ 442e _−_ 3 0 _._ 532 _±_ 5 _._ 452e _−_ 4 0 _._ 664 _±_ 6 _._ 923e _−_ 4 0 _._ 53 _±_ 1 _._ 105e _−_ 3
TFM timemixer 0 _._ 671 _±_ 3 _._ 346e _−_ 3 0 _._ 549 _±_ 3 _._ 121e _−_ 3 0 _._ 601 _±_ 3 _._ 253e _−_ 3 0 _._ 536 _±_ 1 _._ 391e _−_ 3 0 _._ 661 _±_ 2 _._ 082e _−_ 3 0 _._ 526 _±_ 1 _._ 573e _−_ 3
TSDE lstm 0 _._ 681 _±_ 6 _._ 848e _−_ 3 0 _._ 554 _±_ 1 _._ 058e _−_ 2 0 _._ 819 _±_ 2 _._ 7e _−_ 3 0 _._ 773 _±_ 2 _._ 974e _−_ 3 0 _._ 87 _±_ 5 _._ 957e _−_ 3 0 _._ 795 _±_ 8 _._ 274e _−_ 3
TSDE mlp 0 _._ 791 _±_ 3 _._ 345e _−_ 3 0 _._ 681 _±_ 3 _._ 648e _−_ 3 0 _._ 85 _±_ 2 _._ 178e _−_ 3 0 _._ 811 _±_ 2 _._ 348e _−_ 3 0 _._ 898 _±_ 1 _._ 83e _−_ 3 0 _._ 832 _±_ 3 _._ 731e _−_ 3
TSDE patchtsmixer 0 _._ 799 _±_ 7 _._ 006e _−_ 4 0 _._ 688 _±_ 2 _._ 859e _−_ 3 0 _._ 851 _±_ 1 _._ 679e _−_ 3 0 _._ 812 _±_ 2 _._ 108e _−_ 3 0 _._ 901 _±_ 2 _._ 816e _−_ 3 0 _._ 836 _±_ 4 _._ 382e _−_ 3
TSDE timemixer 0 _._ 767 _±_ 1 _._ 683e _−_ 2 0 _._ 65 _±_ 2 _._ 076e _−_ 2 0 _._ 846 _±_ 3 _._ 735e _−_ 3 0 _._ 804 _±_ 4 _._ 207e _−_ 3 0 _._ 885 _±_ 1 _._ 801e _−_ 3 0 _._ 815 _±_ 1 _._ 597e _−_ 3
gemini-2.0-flash CoT +TFM lstm 0 _._ 688 _±_ 5 _._ 348e _−_ 3 0 _._ 564 _±_ 5 _._ 267e _−_ 3 0 _._ 669 _±_ 1 _._ 464e _−_ 2 0 _._ 605 _±_ 1 _._ 303e _−_ 2 0 _._ 717 _±_ 1 _._ 128e _−_ 2 0 _._ 601 _±_ 1 _._ 495e _−_ 2
gemini-2.0-flash CoT +TFM mlp 0 _._ 718 _±_ 1 _._ 129e _−_ 3 0 _._ 597 _±_ 2 _._ 09e _−_ 3 0 _._ 712 _±_ 1 _._ 346e _−_ 2 0 _._ 653 _±_ 1 _._ 543e _−_ 2 0 _._ 75 _±_ 1 _._ 31e _−_ 2 0 _._ 637 _±_ 1 _._ 75e _−_ 2
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 72 _±_ 1 _._ 202e _−_ 3 0 _._ 6 _±_ 1 _._ 908e _−_ 4 0 _._ 695 _±_ 1 _._ 63e _−_ 3 0 _._ 631 _±_ 1 _._ 855e _−_ 3 0 _._ 747 _±_ 7 _._ 968e _−_ 4 0 _._ 632 _±_ 1 _._ 418e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 714 _±_ 2 _._ 798e _−_ 3 0 _._ 597 _±_ 1 _._ 736e _−_ 3 0 _._ 688 _±_ 5 _._ 022e _−_ 3 0 _._ 629 _±_ 5 _._ 829e _−_ 3 0 _._ 723 _±_ 8 _._ 138e _−_ 3 0 _._ 605 _±_ 1 _._ 228e _−_ 2
gemini-2.0-flash CoT lstm 0 _._ 706 _±_ 6 _._ 648e _−_ 3 0 _._ 585 _±_ 8 _._ 732e _−_ 3 0 _._ 691 _±_ 1 _._ 918e _−_ 2 0 _._ 628 _±_ 2 _._ 157e _−_ 2 0 _._ 721 _±_ 4 _._ 388e _−_ 3 0 _._ 604 _±_ 6 _._ 022e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 71 _±_ 4 _._ 685e _−_ 3 0 _._ 588 _±_ 5 _._ 742e _−_ 3 0 _._ 685 _±_ 8 _._ 121e _−_ 3 0 _._ 624 _±_ 8 _._ 335e _−_ 3 0 _._ 723 _±_ 5 _._ 409e _−_ 3 0 _._ 603 _±_ 6 _._ 741e _−_ 3
gemini-2.0-flash CoT patchtsmixer 0 _._ 707 _±_ 1 _._ 058e _−_ 3 0 _._ 585 _±_ 1 _._ 192e _−_ 3 0 _._ 692 _±_ 7 _._ 343e _−_ 3 0 _._ 627 _±_ 7 _._ 429e _−_ 3 0 _._ 723 _±_ 1 _._ 102e _−_ 2 0 _._ 601 _±_ 1 _._ 311e _−_ 2
gemini-2.0-flash CoT timemixer 0 _._ 707 _±_ 2 _._ 137e _−_ 3 0 _._ 584 _±_ 1 _._ 325e _−_ 3 0 _._ 683 _±_ 6 _._ 923e _−_ 3 0 _._ 617 _±_ 7 _._ 006e _−_ 3 0 _._ 724 _±_ 8 _._ 265e _−_ 3 0 _._ 601 _±_ 9 _._ 491e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 688 _±_ 8 _._ 135e _−_ 3 0 _._ 566 _±_ 1 _._ 118e _−_ 2 0 _._ 667 _±_ 1 _._ 216e _−_ 2 0 _._ 607 _±_ 1 _._ 217e _−_ 2 0 _._ 704 _±_ 1 _._ 131e _−_ 2 0 _._ 589 _±_ 1 _._ 698e _−_ 2
gemini-2.0-flash ICD +TFM mlp 0 _._ 725 _±_ 1 _._ 092e _−_ 2 0 _._ 605 _±_ 1 _._ 293e _−_ 2 0 _._ 709 _±_ 3 _._ 413e _−_ 3 0 _._ 653 _±_ 2 _._ 715e _−_ 3 0 _._ 732 _±_ 1 _._ 242e _−_ 2 0 _._ 615 _±_ 1 _._ 693e _−_ 2
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 727 _±_ 1 _._ 79e _−_ 2 0 _._ 606 _±_ 2 _._ 454e _−_ 2 0 _._ 703 _±_ 1 _._ 196e _−_ 2 0 _._ 642 _±_ 1 _._ 193e _−_ 2 0 _._ 741 _±_ 5 _._ 058e _−_ 3 0 _._ 627 _±_ 6 _._ 805e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 714 _±_ 8 _._ 728e _−_ 4 0 _._ 596 _±_ 2 _._ 768e _−_ 3 0 _._ 696 _±_ 4 _._ 552e _−_ 3 0 _._ 641 _±_ 5 _._ 327e _−_ 3 0 _._ 711 _±_ 1 _._ 125e _−_ 2 0 _._ 596 _±_ 1 _._ 01e _−_ 2
gemini-2.0-flash ICD lstm 0 _._ 706 _±_ 4 _._ 078e _−_ 3 0 _._ 584 _±_ 5 _._ 169e _−_ 3 0 _._ 681 _±_ 1 _._ 47e _−_ 2 0 _._ 621 _±_ 1 _._ 588e _−_ 2 0 _._ 719 _±_ 5 _._ 841e _−_ 3 0 _._ 601 _±_ 9 _._ 043e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 717 _±_ 8 _._ 876e _−_ 3 0 _._ 597 _±_ 1 _._ 284e _−_ 2 0 _._ 693 _±_ 2 _._ 445e _−_ 3 0 _._ 635 _±_ 2 _._ 166e _−_ 3 0 _._ 721 _±_ 6 _._ 321e _−_ 3 0 _._ 601 _±_ 8 _._ 13e _−_ 3
gemini-2.0-flash ICD patchtsmixer 0 _._ 707 _±_ 1 _._ 419e _−_ 3 0 _._ 583 _±_ 1 _._ 455e _−_ 3 0 _._ 696 _±_ 1 _._ 089e _−_ 2 0 _._ 637 _±_ 1 _._ 187e _−_ 2 0 _._ 718 _±_ 8 _._ 059e _−_ 3 0 _._ 597 _±_ 9 _._ 69e _−_ 3
gemini-2.0-flash ICD timemixer 0 _._ 707 _±_ 5 _._ 886e _−_ 4 0 _._ 581 _±_ 1 _._ 143e _−_ 3 0 _._ 688 _±_ 7 _._ 978e _−_ 3 0 _._ 628 _±_ 8 _._ 641e _−_ 3 0 _._ 714 _±_ 4 _._ 16e _−_ 3 0 _._ 592 _±_ 4 _._ 244e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 677 _±_ 4 _._ 555e _−_ 3 0 _._ 546 _±_ 8 _._ 996e _−_ 3 0 _._ 659 _±_ 7 _._ 126e _−_ 3 0 _._ 592 _±_ 7 _._ 249e _−_ 3 0 _._ 716 _±_ 5 _._ 095e _−_ 3 0 _._ 605 _±_ 6 _._ 79e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 719 _±_ 1 _._ 302e _−_ 3 0 _._ 596 _±_ 1 _._ 14e _−_ 3 0 _._ 701 _±_ 1 _._ 563e _−_ 3 0 _._ 638 _±_ 1 _._ 693e _−_ 3 0 _._ 719 _±_ 1 _._ 442e _−_ 3 0 _._ 599 _±_ 1 _._ 209e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 707 _±_ 7 _._ 753e _−_ 4 0 _._ 581 _±_ 1 _._ 084e _−_ 3 0 _._ 692 _±_ 1 _._ 293e _−_ 3 0 _._ 625 _±_ 1 _._ 285e _−_ 3 0 _._ 721 _±_ 7 _._ 448e _−_ 3 0 _._ 603 _±_ 9 _._ 94e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 707 _±_ 6 _._ 438e _−_ 4 0 _._ 588 _±_ 3 _._ 874e _−_ 4 0 _._ 685 _±_ 1 _._ 121e _−_ 2 0 _._ 623 _±_ 1 _._ 354e _−_ 2 0 _._ 715 _±_ 1 _._ 523e _−_ 3 0 _._ 601 _±_ 3 _._ 991e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 698 _±_ 1 _._ 22e _−_ 4 0 _._ 574 _±_ 1 _._ 025e _−_ 3 0 _._ 671 _±_ 7 _._ 364e _−_ 3 0 _._ 6 _±_ 7 _._ 048e _−_ 3 0 _._ 712 _±_ 2 _._ 628e _−_ 3 0 _._ 595 _±_ 4 _._ 96e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 7 _±_ 2 _._ 748e _−_ 3 0 _._ 576 _±_ 2 _._ 57e _−_ 3 0 _._ 68 _±_ 9 _._ 396e _−_ 3 0 _._ 612 _±_ 1 _._ 043e _−_ 2 0 _._ 709 _±_ 5 _._ 213e _−_ 3 0 _._ 587 _±_ 6 _._ 987e _−_ 3
gemini-2.0-flash Trend patchtsmixer 0 _._ 699 _±_ 1 _._ 321e _−_ 3 0 _._ 575 _±_ 1 _._ 197e _−_ 3 0 _._ 686 _±_ 7 _._ 111e _−_ 3 0 _._ 614 _±_ 7 _._ 194e _−_ 3 0 _._ 708 _±_ 2 _._ 187e _−_ 3 0 _._ 585 _±_ 3 _._ 249e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 7 _±_ 1 _._ 712e _−_ 3 0 _._ 576 _±_ 1 _._ 076e _−_ 3 0 _._ 678 _±_ 3 _._ 487e _−_ 3 0 _._ 608 _±_ 3 _._ 882e _−_ 3 0 _._ 707 _±_ 3 _._ 588e _−_ 3 0 _._ 583 _±_ 4 _._ 458e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 7 _±_ 1 _._ 392e _−_ 2 0 _._ 579 _±_ 2e _−_ 2 0 _._ 662 _±_ 1 _._ 173e _−_ 2 0 _._ 597 _±_ 1 _._ 356e _−_ 2 0 _._ 714 _±_ 6 _._ 285e _−_ 3 0 _._ 6 _±_ 8 _._ 373e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 742 _±_ 1 _._ 127e _−_ 2 0 _._ 627 _±_ 1 _._ 357e _−_ 2 0 _._ 694 _±_ 2 _._ 292e _−_ 2 0 _._ 634 _±_ 2 _._ 392e _−_ 2 0 _._ 749 _±_ 1 _._ 657e _−_ 3 0 _._ 637 _±_ 2 _._ 262e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 748 _±_ 5 _._ 132e _−_ 3 0 _._ 635 _±_ 6 _._ 363e _−_ 3 0 _._ 702 _±_ 1 _._ 048e _−_ 2 0 _._ 64 _±_ 1 _._ 122e _−_ 2 0 _._ 742 _±_ 1 _._ 007e _−_ 2 0 _._ 628 _±_ 1 _._ 227e _−_ 2
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 73 _±_ 1 _._ 432e _−_ 2 0 _._ 611 _±_ 1 _._ 471e _−_ 2 0 _._ 675 _±_ 2 _._ 83e _−_ 3 0 _._ 616 _±_ 3 _._ 266e _−_ 3 0 _._ 718 _±_ 9 _._ 66e _−_ 3 0 _._ 601 _±_ 1 _._ 524e _−_ 2
gemini-2.0-flash zero shot lstm 0 _._ 715 _±_ 9 _._ 405e _−_ 3 0 _._ 597 _±_ 1 _._ 684e _−_ 2 0 _._ 678 _±_ 7 _._ 654e _−_ 3 0 _._ 613 _±_ 8 _._ 143e _−_ 3 0 _._ 72 _±_ 7 _._ 176e _−_ 3 0 _._ 603 _±_ 1 _._ 028e _−_ 2
gemini-2.0-flash zero shot mlp 0 _._ 738 _±_ 9 _._ 791e _−_ 3 0 _._ 621 _±_ 1 _._ 109e _−_ 2 0 _._ 684 _±_ 5 _._ 914e _−_ 3 0 _._ 623 _±_ 7 _._ 038e _−_ 3 0 _._ 723 _±_ 6 _._ 817e _−_ 3 0 _._ 604 _±_ 8 _._ 556e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 749 _±_ 2 _._ 068e _−_ 3 0 _._ 63 _±_ 2 _._ 351e _−_ 3 0 _._ 687 _±_ 2 _._ 964e _−_ 3 0 _._ 624 _±_ 2 _._ 399e _−_ 3 0 _._ 725 _±_ 1 _._ 792e _−_ 3 0 _._ 606 _±_ 2 _._ 215e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 733 _±_ 1 _._ 782e _−_ 2 0 _._ 612 _±_ 2 _._ 063e _−_ 2 0 _._ 673 _±_ 7 _._ 553e _−_ 3 0 _._ 608 _±_ 7 _._ 632e _−_ 3 0 _._ 721 _±_ 6 _._ 148e _−_ 3 0 _._ 601 _±_ 7 _._ 37e _−_ 3
interp lstm 0 _._ 664 _±_ 4 _._ 33e _−_ 2 0 _._ 528 _±_ 5 _._ 538e _−_ 2 0 _._ 586 _±_ 3 _._ 228e _−_ 2 0 _._ 52 _±_ 3 _._ 973e _−_ 2 0 _._ 658 _±_ 3 _._ 933e _−_ 2 0 _._ 526 _±_ 5 _._ 13e _−_ 2
interp mlp 0 _._ 785 _±_ 3 _._ 045e _−_ 3 0 _._ 684 _±_ 6 _._ 478e _−_ 3 0 _._ 748 _±_ 2 _._ 634e _−_ 3 0 _._ 695 _±_ 3 _._ 103e _−_ 3 0 _._ 821 _±_ 3 _._ 047e _−_ 3 0 _._ 729 _±_ 3 _._ 135e _−_ 3
interp patchtsmixer 0 _._ 868 _±_ 4 _._ 851e _−_ 4 0 _._ 786 _±_ 1 _._ 611e _−_ 3 0 _._ 782 _±_ 1 _._ 957e _−_ 3 0 _._ 73 _±_ 2 _._ 016e _−_ 3 0 _._ 863 _±_ 2 _._ 761e _−_ 3 0 _._ 78 _±_ 2 _._ 455e _−_ 3
interp timemixer 0 _._ 739 _±_ 3 _._ 808e _−_ 3 0 _._ 612 _±_ 5 _._ 098e _−_ 3 0 _._ 664 _±_ 4 _._ 762e _−_ 4 0 _._ 6 _±_ 3 _._ 306e _−_ 3 0 _._ 732 _±_ 5 _._ 991e _−_ 3 0 _._ 612 _±_ 1 _._ 174e _−_ 2
mean lstm 0 _._ 684 _±_ 8 _._ 276e _−_ 2 0 _._ 555 _±_ 1 _._ 094e _−_ 1 0 _._ 61 _±_ 7 _._ 946e _−_ 2 0 _._ 545 _±_ 8 _._ 924e _−_ 2 0 _._ 639 _±_ 0e0 0 _._ 5 _±_ 0e0
mean mlp 0 _._ 837 _±_ 1 _._ 092e _−_ 3 0 _._ 751 _±_ 1 _._ 993e _−_ 3 0 _._ 731 _±_ 2 _._ 236e _−_ 3 0 _._ 684 _±_ 2 _._ 358e _−_ 3 0 _._ 854 _±_ 1 _._ 325e _−_ 3 0 _._ 763 _±_ 2 _._ 016e _−_ 3
mean patchtsmixer 0 _._ 879 _±_ 2 _._ 175e _−_ 3 0 _._ 81 _±_ 4 _._ 419e _−_ 3 0 _._ 79 _±_ 6 _._ 211e _−_ 3 0 _._ 741 _±_ 5 _._ 469e _−_ 3 0 _._ 847 _±_ 1 _._ 344e _−_ 3 0 _._ 756 _±_ 4 _._ 7e _−_ 3
mean timemixer 0 _._ 872 _±_ 1 _._ 497e _−_ 3 0 _._ 793 _±_ 1 _._ 085e _−_ 3 0 _._ 808 _±_ 1 _._ 141e _−_ 3 0 _._ 761 _±_ 2 _._ 156e _−_ 3 0 _._ 836 _±_ 1 _._ 65e _−_ 3 0 _._ 743 _±_ 2 _._ 735e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 723 _±_ 1 _._ 544e _−_ 3 0 _._ 619 _±_ 1 _._ 426e _−_ 3 0 _._ 75 _±_ 1 _._ 476e _−_ 2 0 _._ 695 _±_ 1 _._ 678e _−_ 2 0 _._ 777 _±_ 8 _._ 079e _−_ 3 0 _._ 688 _±_ 1 _._ 272e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 765 _±_ 1 _._ 529e _−_ 3 0 _._ 654 _±_ 2 _._ 325e _−_ 3 0 _._ 78 _±_ 8 _._ 862e _−_ 4 0 _._ 729 _±_ 2 _._ 401e _−_ 4 0 _._ 8 _±_ 1 _._ 956e _−_ 2 0 _._ 703 _±_ 2 _._ 468e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 762 _±_ 3 _._ 793e _−_ 3 0 _._ 649 _±_ 5 _._ 79e _−_ 3 0 _._ 774 _±_ 3 _._ 033e _−_ 2 0 _._ 711 _±_ 3 _._ 255e _−_ 2 0 _._ 814 _±_ 1 _._ 059e _−_ 2 0 _._ 716 _±_ 1 _._ 263e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 755 _±_ 1 _._ 472e _−_ 2 0 _._ 641 _±_ 2 _._ 036e _−_ 2 0 _._ 766 _±_ 2 _._ 158e _−_ 2 0 _._ 712 _±_ 2 _._ 287e _−_ 2 0 _._ 764 _±_ 2 _._ 202e _−_ 2 0 _._ 659 _±_ 2 _._ 382e _−_ 2
No ~~s~~ um ~~C~~ oT lstm 0 _._ 735 _±_ 3 _._ 67e _−_ 3 0 _._ 625 _±_ 3 _._ 715e _−_ 3 0 _._ 716 _±_ 1 _._ 338e _−_ 2 0 _._ 656 _±_ 1 _._ 607e _−_ 2 0 _._ 75 _±_ 8 _._ 467e _−_ 3 0 _._ 64 _±_ 1 _._ 349e _−_ 2
No ~~s~~ um ~~C~~ oT mlp 0 _._ 755 _±_ 9 _._ 858e _−_ 3 0 _._ 643 _±_ 1 _._ 27e _−_ 2 0 _._ 745 _±_ 3 _._ 568e _−_ 3 0 _._ 689 _±_ 4 _._ 358e _−_ 3 0 _._ 788 _±_ 3 _._ 896e _−_ 3 0 _._ 688 _±_ 5 _._ 356e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 755 _±_ 8 _._ 893e _−_ 3 0 _._ 64 _±_ 1 _._ 08e _−_ 2 0 _._ 746 _±_ 1 _._ 058e _−_ 2 0 _._ 686 _±_ 1 _._ 145e _−_ 2 0 _._ 782 _±_ 3 _._ 733e _−_ 3 0 _._ 673 _±_ 5 _._ 333e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 751 _±_ 2 _._ 922e _−_ 3 0 _._ 633 _±_ 3 _._ 603e _−_ 3 0 _._ 727 _±_ 1 _._ 61e _−_ 2 0 _._ 666 _±_ 1 _._ 753e _−_ 2 0 _._ 779 _±_ 1 _._ 016e _−_ 2 0 _._ 672 _±_ 1 _._ 441e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 714 _±_ 4 _._ 662e _−_ 3 0 _._ 604 _±_ 7 _._ 298e _−_ 3 0 _._ 755 _±_ 1 _._ 394e _−_ 3 0 _._ 702 _±_ 2 _._ 384e _−_ 3 0 _._ 771 _±_ 3 _._ 647e _−_ 3 0 _._ 677 _±_ 5 _._ 379e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 771 _±_ 6 _._ 736e _−_ 3 0 _._ 661 _±_ 8 _._ 792e _−_ 3 0 _._ 787 _±_ 7 _._ 887e _−_ 3 0 _._ 737 _±_ 9 _._ 344e _−_ 3 0 _._ 797 _±_ 1 _._ 163e _−_ 2 0 _._ 698 _±_ 1 _._ 555e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 762 _±_ 4 _._ 834e _−_ 3 0 _._ 649 _±_ 6 _._ 052e _−_ 3 0 _._ 798 _±_ 9 _._ 244e _−_ 3 0 _._ 74 _±_ 9 _._ 79e _−_ 3 0 _._ 814 _±_ 1 _._ 707e _−_ 2 0 _._ 714 _±_ 2 _._ 154e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 765 _±_ 6 _._ 781e _−_ 3 0 _._ 655 _±_ 9 _._ 045e _−_ 3 0 _._ 789 _±_ 1 _._ 89e _−_ 3 0 _._ 739 _±_ 3 _._ 565e _−_ 3 0 _._ 778 _±_ 3 _._ 037e _−_ 3 0 _._ 673 _±_ 2 _._ 51e _−_ 3
No ~~s~~ um ~~I~~ CD lstm 0 _._ 733 _±_ 1 _._ 321e _−_ 3 0 _._ 621 _±_ 2 _._ 176e _−_ 3 0 _._ 735 _±_ 7 _._ 334e _−_ 3 0 _._ 681 _±_ 9 _._ 124e _−_ 3 0 _._ 75 _±_ 3 _._ 354e _−_ 3 0 _._ 641 _±_ 4 _._ 25e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 751 _±_ 5 _._ 511e _−_ 3 0 _._ 636 _±_ 6 _._ 843e _−_ 3 0 _._ 751 _±_ 1 _._ 153e _−_ 2 0 _._ 696 _±_ 1 _._ 24e _−_ 2 0 _._ 781 _±_ 5 _._ 254e _−_ 3 0 _._ 675 _±_ 6 _._ 613e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 761 _±_ 5 _._ 675e _−_ 3 0 _._ 645 _±_ 7 _._ 142e _−_ 3 0 _._ 747 _±_ 3 _._ 78e _−_ 3 0 _._ 689 _±_ 4 _._ 212e _−_ 3 0 _._ 79 _±_ 9 _._ 069e _−_ 3 0 _._ 683 _±_ 1 _._ 25e _−_ 2
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 751 _±_ 1 _._ 169e _−_ 3 0 _._ 633 _±_ 1 _._ 206e _−_ 3 0 _._ 742 _±_ 1 _._ 722e _−_ 2 0 _._ 685 _±_ 1 _._ 817e _−_ 2 0 _._ 775 _±_ 3 _._ 997e _−_ 3 0 _._ 666 _±_ 5 _._ 715e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 722 _±_ 4 _._ 245e _−_ 3 0 _._ 614 _±_ 5 _._ 841e _−_ 3 0 _._ 758 _±_ 2 _._ 191e _−_ 2 0 _._ 703 _±_ 2 _._ 598e _−_ 2 0 _._ 787 _±_ 2 _._ 879e _−_ 2 0 _._ 702 _±_ 4 _._ 131e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 756 _±_ 1 _._ 644e _−_ 2 0 _._ 643 _±_ 2 _._ 253e _−_ 2 0 _._ 784 _±_ 1 _._ 677e _−_ 2 0 _._ 732 _±_ 1 _._ 867e _−_ 2 0 _._ 79 _±_ 1 _._ 126e _−_ 2 0 _._ 69 _±_ 1 _._ 437e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 754 _±_ 4 _._ 161e _−_ 3 0 _._ 639 _±_ 5 _._ 573e _−_ 3 0 _._ 797 _±_ 1 _._ 046e _−_ 2 0 _._ 735 _±_ 1 _._ 128e _−_ 2 0 _._ 808 _±_ 1 _._ 192e _−_ 2 0 _._ 707 _±_ 1 _._ 543e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 75 _±_ 1 _._ 1e _−_ 2 0 _._ 639 _±_ 8 _._ 155e _−_ 3 0 _._ 761 _±_ 3 _._ 013e _−_ 3 0 _._ 706 _±_ 3 _._ 665e _−_ 3 0 _._ 762 _±_ 2 _._ 516e _−_ 2 0 _._ 656 _±_ 2 _._ 332e _−_ 2


Table 22: In-distribution results - Gender. (part 1/2)


38


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc** **auprc** **auroc**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 74 _±_ 2 _._ 23e _−_ 3 0 _._ 63 _±_ 3 _._ 426e _−_ 3 0 _._ 722 _±_ 1 _._ 427e _−_ 2 0 _._ 663 _±_ 1 _._ 613e _−_ 2 0 _._ 778 _±_ 2 _._ 76e _−_ 3 0 _._ 681 _±_ 3 _._ 846e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 755 _±_ 3 _._ 027e _−_ 3 0 _._ 641 _±_ 3 _._ 93e _−_ 3 0 _._ 753 _±_ 1 _._ 008e _−_ 2 0 _._ 698 _±_ 1 _._ 139e _−_ 2 0 _._ 787 _±_ 9 _._ 173e _−_ 3 0 _._ 686 _±_ 1 _._ 275e _−_ 2
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 749 _±_ 4 _._ 704e _−_ 3 0 _._ 631 _±_ 5 _._ 715e _−_ 3 0 _._ 754 _±_ 6 _._ 242e _−_ 3 0 _._ 695 _±_ 7 _._ 373e _−_ 3 0 _._ 79 _±_ 1 _._ 108e _−_ 2 0 _._ 684 _±_ 1 _._ 554e _−_ 2
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 751 _±_ 2 _._ 802e _−_ 3 0 _._ 632 _±_ 3 _._ 398e _−_ 3 0 _._ 736 _±_ 1 _._ 755e _−_ 2 0 _._ 675 _±_ 1 _._ 889e _−_ 2 0 _._ 78 _±_ 2 _._ 308e _−_ 3 0 _._ 674 _±_ 2 _._ 988e _−_ 3
medgemma CoT +TFM lstm 0 _._ 701 _±_ 9 _._ 768e _−_ 3 0 _._ 582 _±_ 1 _._ 444e _−_ 2 0 _._ 659 _±_ 4 _._ 775e _−_ 3 0 _._ 598 _±_ 4 _._ 392e _−_ 3 0 _._ 724 _±_ 1 _._ 238e _−_ 2 0 _._ 615 _±_ 2 _._ 059e _−_ 2
medgemma CoT +TFM mlp 0 _._ 73 _±_ 1 _._ 005e _−_ 2 0 _._ 614 _±_ 1 _._ 175e _−_ 2 0 _._ 716 _±_ 1 _._ 392e _−_ 2 0 _._ 657 _±_ 1 _._ 404e _−_ 2 0 _._ 762 _±_ 1 _._ 148e _−_ 3 0 _._ 657 _±_ 2 _._ 568e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 74 _±_ 8 _._ 523e _−_ 3 0 _._ 626 _±_ 9 _._ 423e _−_ 3 0 _._ 714 _±_ 2 _._ 428e _−_ 3 0 _._ 651 _±_ 1 _._ 848e _−_ 3 0 _._ 741 _±_ 8 _._ 583e _−_ 3 0 _._ 627 _±_ 1 _._ 134e _−_ 2
medgemma CoT +TFM timemixer 0 _._ 718 _±_ 9 _._ 627e _−_ 3 0 _._ 598 _±_ 9 _._ 804e _−_ 3 0 _._ 71 _±_ 8 _._ 869e _−_ 3 0 _._ 653 _±_ 9 _._ 106e _−_ 3 0 _._ 726 _±_ 3 _._ 822e _−_ 3 0 _._ 612 _±_ 3 _._ 668e _−_ 3
medgemma CoT lstm 0 _._ 716 _±_ 5 _._ 031e _−_ 4 0 _._ 603 _±_ 1 _._ 864e _−_ 3 0 _._ 694 _±_ 8 _._ 079e _−_ 3 0 _._ 632 _±_ 8 _._ 779e _−_ 3 0 _._ 734 _±_ 2 _._ 271e _−_ 2 0 _._ 628 _±_ 3 _._ 664e _−_ 2
medgemma CoT mlp 0 _._ 717 _±_ 3 _._ 543e _−_ 3 0 _._ 598 _±_ 4 _._ 867e _−_ 3 0 _._ 719 _±_ 3 _._ 884e _−_ 3 0 _._ 66 _±_ 4 _._ 348e _−_ 3 0 _._ 753 _±_ 1 _._ 132e _−_ 2 0 _._ 647 _±_ 1 _._ 391e _−_ 2
medgemma CoT patchtsmixer 0 _._ 721 _±_ 2 _._ 206e _−_ 3 0 _._ 602 _±_ 2 _._ 562e _−_ 3 0 _._ 715 _±_ 9 _._ 317e _−_ 3 0 _._ 652 _±_ 9 _._ 335e _−_ 3 0 _._ 73 _±_ 2 _._ 966e _−_ 2 0 _._ 613 _±_ 3 _._ 604e _−_ 2
medgemma CoT timemixer 0 _._ 716 _±_ 3 _._ 997e _−_ 3 0 _._ 595 _±_ 4 _._ 219e _−_ 3 0 _._ 705 _±_ 5 _._ 001e _−_ 3 0 _._ 642 _±_ 5 _._ 563e _−_ 3 0 _._ 711 _±_ 2 _._ 667e _−_ 3 0 _._ 59 _±_ 3 _._ 162e _−_ 3
medgemma ICD +TFM lstm 0 _._ 704 _±_ 1 _._ 716e _−_ 2 0 _._ 586 _±_ 2 _._ 449e _−_ 2 0 _._ 674 _±_ 5 _._ 636e _−_ 3 0 _._ 61 _±_ 6 _._ 298e _−_ 3 0 _._ 688 _±_ 7 _._ 053e _−_ 3 0 _._ 564 _±_ 8 _._ 507e _−_ 3
medgemma ICD +TFM mlp 0 _._ 733 _±_ 1 _._ 209e _−_ 2 0 _._ 615 _±_ 1 _._ 689e _−_ 2 0 _._ 693 _±_ 1 _._ 062e _−_ 2 0 _._ 633 _±_ 1 _._ 192e _−_ 2 0 _._ 724 _±_ 1 _._ 222e _−_ 2 0 _._ 606 _±_ 1 _._ 465e _−_ 2
medgemma ICD +TFM patchtsmixer 0 _._ 736 _±_ 5 _._ 126e _−_ 3 0 _._ 615 _±_ 6 _._ 441e _−_ 3 0 _._ 691 _±_ 9 _._ 462e _−_ 3 0 _._ 628 _±_ 9 _._ 006e _−_ 3 0 _._ 721 _±_ 8 _._ 924e _−_ 3 0 _._ 604 _±_ 1 _._ 059e _−_ 2
medgemma ICD +TFM timemixer 0 _._ 716 _±_ 9 _._ 304e _−_ 3 0 _._ 597 _±_ 5 _._ 295e _−_ 3 0 _._ 69 _±_ 2 _._ 087e _−_ 3 0 _._ 631 _±_ 2 _._ 762e _−_ 3 0 _._ 718 _±_ 6 _._ 332e _−_ 3 0 _._ 602 _±_ 4 _._ 055e _−_ 3
medgemma ICD lstm 0 _._ 711 _±_ 4 _._ 333e _−_ 3 0 _._ 588 _±_ 6 _._ 317e _−_ 3 0 _._ 673 _±_ 1 _._ 307e _−_ 2 0 _._ 61 _±_ 1 _._ 482e _−_ 2 0 _._ 704 _±_ 6 _._ 042e _−_ 3 0 _._ 584 _±_ 7 _._ 67e _−_ 3
medgemma ICD mlp 0 _._ 717 _±_ 1 _._ 656e _−_ 3 0 _._ 593 _±_ 2 _._ 615e _−_ 3 0 _._ 693 _±_ 9 _._ 13e _−_ 3 0 _._ 634 _±_ 9 _._ 341e _−_ 3 0 _._ 713 _±_ 4 _._ 461e _−_ 3 0 _._ 595 _±_ 4 _._ 885e _−_ 3
medgemma ICD patchtsmixer 0 _._ 719 _±_ 1 _._ 953e _−_ 3 0 _._ 595 _±_ 2 _._ 597e _−_ 3 0 _._ 687 _±_ 8 _._ 396e _−_ 3 0 _._ 625 _±_ 8 _._ 509e _−_ 3 0 _._ 71 _±_ 7 _._ 246e _−_ 3 0 _._ 589 _±_ 8 _._ 342e _−_ 3
medgemma ICD timemixer 0 _._ 717 _±_ 3 _._ 023e _−_ 3 0 _._ 59 _±_ 3 _._ 521e _−_ 3 0 _._ 676 _±_ 3 _._ 96e _−_ 3 0 _._ 614 _±_ 3 _._ 539e _−_ 3 0 _._ 705 _±_ 4 _._ 061e _−_ 3 0 _._ 582 _±_ 4 _._ 864e _−_ 3
medgemma Trend +TFM lstm 0 _._ 69 _±_ 1 _._ 662e _−_ 3 0 _._ 568 _±_ 5 _._ 877e _−_ 4 0 _._ 666 _±_ 4 _._ 095e _−_ 2 0 _._ 599 _±_ 4 _._ 256e _−_ 2 0 _._ 69 _±_ 1 _._ 934e _−_ 2 0 _._ 567 _±_ 2 _._ 605e _−_ 2
medgemma Trend +TFM mlp 0 _._ 723 _±_ 9 _._ 772e _−_ 3 0 _._ 602 _±_ 1 _._ 185e _−_ 2 0 _._ 711 _±_ 1 _._ 28e _−_ 2 0 _._ 651 _±_ 1 _._ 555e _−_ 2 0 _._ 719 _±_ 3 _._ 211e _−_ 3 0 _._ 596 _±_ 4 _._ 299e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 709 _±_ 7 _._ 731e _−_ 4 0 _._ 585 _±_ 4 _._ 571e _−_ 4 0 _._ 715 _±_ 1 _._ 91e _−_ 3 0 _._ 649 _±_ 1 _._ 747e _−_ 3 0 _._ 715 _±_ 6 _._ 824e _−_ 4 0 _._ 592 _±_ 5 _._ 277e _−_ 4
medgemma Trend +TFM timemixer 0 _._ 709 _±_ 7 _._ 321e _−_ 4 0 _._ 59 _±_ 3 _._ 491e _−_ 3 0 _._ 689 _±_ 3 _._ 296e _−_ 3 0 _._ 627 _±_ 3 _._ 766e _−_ 3 0 _._ 713 _±_ 3 _._ 195e _−_ 4 0 _._ 598 _±_ 1 _._ 229e _−_ 3
medgemma Trend lstm 0 _._ 7 _±_ 6 _._ 957e _−_ 3 0 _._ 576 _±_ 7 _._ 229e _−_ 3 0 _._ 686 _±_ 7 _._ 68e _−_ 3 0 _._ 619 _±_ 8 _._ 363e _−_ 3 0 _._ 701 _±_ 9 _._ 49e _−_ 3 0 _._ 574 _±_ 1 _._ 131e _−_ 2
medgemma Trend mlp 0 _._ 707 _±_ 4 _._ 45e _−_ 3 0 _._ 583 _±_ 5 _._ 281e _−_ 3 0 _._ 7 _±_ 6 _._ 592e _−_ 3 0 _._ 635 _±_ 7 _._ 411e _−_ 3 0 _._ 705 _±_ 4 _._ 399e _−_ 3 0 _._ 578 _±_ 5 _._ 072e _−_ 3
medgemma Trend patchtsmixer 0 _._ 705 _±_ 2 _._ 01e _−_ 3 0 _._ 581 _±_ 2 _._ 071e _−_ 3 0 _._ 706 _±_ 9 _._ 576e _−_ 3 0 _._ 635 _±_ 9 _._ 128e _−_ 3 0 _._ 704 _±_ 1 _._ 071e _−_ 3 0 _._ 576 _±_ 1 _._ 102e _−_ 3
medgemma Trend timemixer 0 _._ 707 _±_ 1 _._ 524e _−_ 3 0 _._ 581 _±_ 1 _._ 171e _−_ 3 0 _._ 688 _±_ 1 _._ 065e _−_ 2 0 _._ 618 _±_ 1 _._ 111e _−_ 2 0 _._ 702 _±_ 9 _._ 072e _−_ 4 0 _._ 573 _±_ 1 _._ 085e _−_ 3
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 696 _±_ 2 _._ 587e _−_ 2 0 _._ 578 _±_ 3 _._ 51e _−_ 2 0 _._ 675 _±_ 1 _._ 045e _−_ 2 0 _._ 612 _±_ 1 _._ 099e _−_ 2 0 _._ 731 _±_ 1 _._ 36e _−_ 2 0 _._ 624 _±_ 2 _._ 043e _−_ 2
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 737 _±_ 1 _._ 751e _−_ 2 0 _._ 62 _±_ 2 _._ 358e _−_ 2 0 _._ 716 _±_ 1 _._ 13e _−_ 2 0 _._ 658 _±_ 1 _._ 286e _−_ 2 0 _._ 752 _±_ 7 _._ 858e _−_ 3 0 _._ 642 _±_ 1 _._ 103e _−_ 2
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 732 _±_ 2 _._ 435e _−_ 3 0 _._ 612 _±_ 4 _._ 336e _−_ 3 0 _._ 716 _±_ 2 _._ 947e _−_ 2 0 _._ 654 _±_ 3 _._ 129e _−_ 2 0 _._ 741 _±_ 7 _._ 613e _−_ 3 0 _._ 627 _±_ 8 _._ 152e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 728 _±_ 7 _._ 906e _−_ 3 0 _._ 611 _±_ 1 _._ 199e _−_ 2 0 _._ 692 _±_ 5 _._ 17e _−_ 3 0 _._ 633 _±_ 6 _._ 136e _−_ 3 0 _._ 722 _±_ 9 _._ 043e _−_ 3 0 _._ 609 _±_ 9 _._ 301e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 717 _±_ 4 _._ 841e _−_ 3 0 _._ 603 _±_ 9 _._ 247e _−_ 3 0 _._ 67 _±_ 9 _._ 442e _−_ 3 0 _._ 606 _±_ 1 _._ 063e _−_ 2 0 _._ 729 _±_ 1 _._ 197e _−_ 2 0 _._ 621 _±_ 2 _._ 029e _−_ 2
medgemma zero ~~s~~ hot mlp 0 _._ 723 _±_ 7 _._ 89e _−_ 3 0 _._ 602 _±_ 1 _._ 147e _−_ 2 0 _._ 696 _±_ 1 _._ 046e _−_ 2 0 _._ 636 _±_ 1 _._ 195e _−_ 2 0 _._ 733 _±_ 2 _._ 28e _−_ 3 0 _._ 621 _±_ 2 _._ 99e _−_ 3
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 722 _±_ 7 _._ 805e _−_ 3 0 _._ 602 _±_ 1 _._ 014e _−_ 2 0 _._ 709 _±_ 8 _._ 92e _−_ 3 0 _._ 647 _±_ 9 _._ 963e _−_ 3 0 _._ 735 _±_ 9 _._ 767e _−_ 3 0 _._ 621 _±_ 1 _._ 114e _−_ 2
medgemma zero ~~s~~ hot timemixer 0 _._ 723 _±_ 2 _._ 405e _−_ 3 0 _._ 599 _±_ 3 _._ 898e _−_ 3 0 _._ 687 _±_ 1 _._ 206e _−_ 2 0 _._ 622 _±_ 1 _._ 365e _−_ 2 0 _._ 736 _±_ 3 _._ 054e _−_ 3 0 _._ 621 _±_ 3 _._ 758e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM lstm 0 _._ 722 _±_ 5 _._ 1e _−_ 3 0 _._ 616 _±_ 1 _._ 094e _−_ 2 0 _._ 742 _±_ 4 _._ 867e _−_ 3 0 _._ 684 _±_ 5 _._ 837e _−_ 3 0 _._ 76 _±_ 2 _._ 029e _−_ 2 0 _._ 664 _±_ 2 _._ 82e _−_ 2
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM mlp 0 _._ 751 _±_ 9 _._ 506e _−_ 3 0 _._ 634 _±_ 1 _._ 456e _−_ 2 0 _._ 752 _±_ 9 _._ 467e _−_ 3 0 _._ 696 _±_ 1 _._ 189e _−_ 2 0 _._ 806 _±_ 6 _._ 152e _−_ 3 0 _._ 71 _±_ 8 _._ 249e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 753 _±_ 5 _._ 825e _−_ 3 0 _._ 639 _±_ 7 _._ 477e _−_ 3 0 _._ 773 _±_ 1 _._ 104e _−_ 2 0 _._ 71 _±_ 1 _._ 255e _−_ 2 0 _._ 81 _±_ 1 _._ 939e _−_ 2 0 _._ 709 _±_ 2 _._ 312e _−_ 2
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM timemixer 0 _._ 749 _±_ 5 _._ 594e _−_ 3 0 _._ 632 _±_ 7 _._ 303e _−_ 3 0 _._ 759 _±_ 1 _._ 388e _−_ 2 0 _._ 706 _±_ 1 _._ 614e _−_ 2 0 _._ 761 _±_ 1 _._ 982e _−_ 2 0 _._ 655 _±_ 2 _._ 072e _−_ 2
No ~~s~~ um ~~z~~ ero shot lstm 0 _._ 735 _±_ 1 _._ 049e _−_ 3 0 _._ 625 _±_ 3 _._ 211e _−_ 4 0 _._ 727 _±_ 1 _._ 031e _−_ 2 0 _._ 669 _±_ 1 _._ 276e _−_ 2 0 _._ 734 _±_ 9 _._ 081e _−_ 3 0 _._ 618 _±_ 1 _._ 173e _−_ 2
No ~~s~~ um ~~z~~ ero shot mlp 0 _._ 751 _±_ 6 _._ 221e _−_ 3 0 _._ 637 _±_ 8 _._ 498e _−_ 3 0 _._ 75 _±_ 8 _._ 165e _−_ 3 0 _._ 695 _±_ 9 _._ 902e _−_ 3 0 _._ 782 _±_ 6 _._ 794e _−_ 3 0 _._ 678 _±_ 9 _._ 684e _−_ 3
No ~~s~~ um ~~z~~ ero shot patchtsmixer 0 _._ 749 _±_ 3 _._ 79e _−_ 3 0 _._ 633 _±_ 4 _._ 857e _−_ 3 0 _._ 742 _±_ 8 _._ 508e _−_ 3 0 _._ 682 _±_ 8 _._ 934e _−_ 3 0 _._ 784 _±_ 6 _._ 863e _−_ 3 0 _._ 675 _±_ 9 _._ 66e _−_ 3
No ~~s~~ um ~~z~~ ero shot timemixer 0 _._ 749 _±_ 1 _._ 463e _−_ 3 0 _._ 631 _±_ 1 _._ 507e _−_ 3 0 _._ 727 _±_ 7 _._ 659e _−_ 3 0 _._ 666 _±_ 8 _._ 418e _−_ 3 0 _._ 742 _±_ 2 _._ 761e _−_ 2 0 _._ 626 _±_ 3 _._ 416e _−_ 2
right lstm 0 _._ 662 _±_ 3 _._ 943e _−_ 2 0 _._ 527 _±_ 5 _._ 419e _−_ 2 0 _._ 57 _±_ 0e0 0 _._ 5 _±_ 0e0 0 _._ 639 _±_ 0e0 0 _._ 5 _±_ 5e _−_ 6
right mlp 0 _._ 842 _±_ 1 _._ 711e _−_ 3 0 _._ 763 _±_ 4 _._ 486e _−_ 3 0 _._ 786 _±_ 8 _._ 476e _−_ 4 0 _._ 736 _±_ 1 _._ 542e _−_ 3 0 _._ 876 _±_ 1 _._ 087e _−_ 3 0 _._ 797 _±_ 1 _._ 703e _−_ 3
right patchtsmixer 0 _._ 875 _±_ 8 _._ 592e _−_ 4 0 _._ 802 _±_ 1 _._ 787e _−_ 3 0 _._ 809 _±_ 2 _._ 09e _−_ 3 0 _._ 764 _±_ 2 _._ 146e _−_ 3 0 _._ 876 _±_ 2 _._ 212e _−_ 3 0 _._ 795 _±_ 3 _._ 708e _−_ 3
right timemixer 0 _._ 755 _±_ 8 _._ 163e _−_ 3 0 _._ 633 _±_ 1 _._ 476e _−_ 2 0 _._ 727 _±_ 2 _._ 988e _−_ 3 0 _._ 681 _±_ 1 _._ 945e _−_ 3 0 _._ 768 _±_ 3 _._ 868e _−_ 3 0 _._ 66 _±_ 4 _._ 337e _−_ 3


Table 23: In-distribution results - Gender. (part 2/2)


39


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc**


Llama-3.1 CoT +TFM lstm 0 _._ 664 _±_ 6 _._ 426e _−_ 3 0 _._ 528 _±_ 5 _._ 865e _−_ 3 0 _._ 673 _±_ 2 _._ 82e _−_ 3 0 _._ 539 _±_ 4 _._ 609e _−_ 3
Llama-3.1 CoT +TFM mlp 0 _._ 673 _±_ 3 _._ 117e _−_ 3 0 _._ 535 _±_ 3 _._ 658e _−_ 3 0 _._ 674 _±_ 2 _._ 093e _−_ 3 0 _._ 54 _±_ 4 _._ 741e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 68 _±_ 1 _._ 007e _−_ 3 0 _._ 548 _±_ 1 _._ 27e _−_ 3 0 _._ 678 _±_ 4 _._ 151e _−_ 4 0 _._ 546 _±_ 1 _._ 174e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 677 _±_ 3 _._ 143e _−_ 3 0 _._ 544 _±_ 6 _._ 236e _−_ 3 0 _._ 675 _±_ 1 _._ 276e _−_ 3 0 _._ 542 _±_ 1 _._ 627e _−_ 3
Llama-3.1 CoT lstm 0 _._ 674 _±_ 5 _._ 913e _−_ 4 0 _._ 542 _±_ 2 _._ 421e _−_ 3 0 _._ 675 _±_ 3 _._ 617e _−_ 4 0 _._ 543 _±_ 8 _._ 516e _−_ 4
Llama-3.1 CoT mlp 0 _._ 676 _±_ 8 _._ 942e _−_ 4 0 _._ 543 _±_ 1 _._ 65e _−_ 3 0 _._ 677 _±_ 1 _._ 266e _−_ 3 0 _._ 543 _±_ 2 _._ 263e _−_ 3
Llama-3.1 CoT patchtsmixer 0 _._ 677 _±_ 1 _._ 087e _−_ 3 0 _._ 544 _±_ 1 _._ 92e _−_ 3 0 _._ 676 _±_ 1 _._ 235e _−_ 3 0 _._ 545 _±_ 1 _._ 534e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 677 _±_ 1 _._ 531e _−_ 3 0 _._ 545 _±_ 6 _._ 271e _−_ 4 0 _._ 674 _±_ 1 _._ 844e _−_ 3 0 _._ 543 _±_ 1 _._ 893e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 657 _±_ 2 _._ 57e _−_ 3 0 _._ 52 _±_ 1 _._ 982e _−_ 3 0 _._ 664 _±_ 2 _._ 207e _−_ 3 0 _._ 53 _±_ 3 _._ 553e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 664 _±_ 3 _._ 384e _−_ 3 0 _._ 526 _±_ 3 _._ 965e _−_ 3 0 _._ 667 _±_ 1 _._ 799e _−_ 3 0 _._ 535 _±_ 3 _._ 067e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 672 _±_ 6 _._ 484e _−_ 4 0 _._ 535 _±_ 1 _._ 28e _−_ 3 0 _._ 671 _±_ 7 _._ 286e _−_ 4 0 _._ 54 _±_ 1 _._ 842e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 669 _±_ 3 _._ 524e _−_ 3 0 _._ 533 _±_ 3 _._ 805e _−_ 3 0 _._ 67 _±_ 7 _._ 071e _−_ 4 0 _._ 538 _±_ 3 _._ 141e _−_ 3
Llama-3.1 ICD lstm 0 _._ 667 _±_ 1 _._ 733e _−_ 3 0 _._ 531 _±_ 1 _._ 912e _−_ 3 0 _._ 665 _±_ 1 _._ 754e _−_ 3 0 _._ 534 _±_ 1 _._ 14e _−_ 3
Llama-3.1 ICD mlp 0 _._ 667 _±_ 1 _._ 79e _−_ 3 0 _._ 532 _±_ 2 _._ 489e _−_ 3 0 _._ 668 _±_ 1 _._ 333e _−_ 3 0 _._ 536 _±_ 1 _._ 124e _−_ 4
Llama-3.1 ICD patchtsmixer 0 _._ 668 _±_ 2 _._ 909e _−_ 4 0 _._ 533 _±_ 1 _._ 122e _−_ 3 0 _._ 667 _±_ 1 _._ 141e _−_ 3 0 _._ 536 _±_ 6 _._ 438e _−_ 4
Llama-3.1 ICD timemixer 0 _._ 669 _±_ 7 _._ 352e _−_ 4 0 _._ 535 _±_ 7 _._ 313e _−_ 4 0 _._ 667 _±_ 1 _._ 223e _−_ 3 0 _._ 536 _±_ 4 _._ 909e _−_ 4
Llama-3.1 Trend +TFM lstm 0 _._ 662 _±_ 5 _._ 545e _−_ 3 0 _._ 527 _±_ 4 _._ 806e _−_ 3 0 _._ 663 _±_ 3 _._ 815e _−_ 3 0 _._ 528 _±_ 3 _._ 898e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 668 _±_ 2 _._ 891e _−_ 3 0 _._ 533 _±_ 6 _._ 51e _−_ 3 0 _._ 667 _±_ 4 _._ 11e _−_ 3 0 _._ 53 _±_ 3 _._ 45e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 677 _±_ 1 _._ 747e _−_ 3 0 _._ 541 _±_ 3 _._ 033e _−_ 3 0 _._ 672 _±_ 1 _._ 755e _−_ 3 0 _._ 537 _±_ 2 _._ 944e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 674 _±_ 1 _._ 827e _−_ 3 0 _._ 542 _±_ 3 _._ 232e _−_ 3 0 _._ 672 _±_ 1 _._ 816e _−_ 3 0 _._ 539 _±_ 1 _._ 319e _−_ 3
Llama-3.1 Trend lstm 0 _._ 669 _±_ 9 _._ 636e _−_ 4 0 _._ 534 _±_ 2 _._ 643e _−_ 3 0 _._ 667 _±_ 8 _._ 415e _−_ 4 0 _._ 534 _±_ 9 _._ 089e _−_ 4
Llama-3.1 Trend mlp 0 _._ 67 _±_ 2 _._ 436e _−_ 3 0 _._ 537 _±_ 4 _._ 101e _−_ 3 0 _._ 667 _±_ 3 _._ 737e _−_ 4 0 _._ 534 _±_ 8 _._ 304e _−_ 4
Llama-3.1 Trend patchtsmixer 0 _._ 672 _±_ 7 _._ 463e _−_ 4 0 _._ 537 _±_ 8 _._ 551e _−_ 4 0 _._ 667 _±_ 8 _._ 675e _−_ 4 0 _._ 533 _±_ 1 _._ 001e _−_ 3
Llama-3.1 Trend timemixer 0 _._ 673 _±_ 8 _._ 969e _−_ 4 0 _._ 54 _±_ 6 _._ 96e _−_ 4 0 _._ 667 _±_ 9 _._ 77e _−_ 4 0 _._ 533 _±_ 1 _._ 519e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 656 _±_ 2 _._ 526e _−_ 3 0 _._ 518 _±_ 3 _._ 192e _−_ 3 0 _._ 671 _±_ 3 _._ 138e _−_ 3 0 _._ 539 _±_ 1 _._ 484e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 662 _±_ 2 _._ 076e _−_ 3 0 _._ 521 _±_ 2 _._ 602e _−_ 3 0 _._ 672 _±_ 1 _._ 873e _−_ 3 0 _._ 539 _±_ 2 _._ 119e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 664 _±_ 1 _._ 153e _−_ 3 0 _._ 527 _±_ 1 _._ 649e _−_ 3 0 _._ 676 _±_ 1 _._ 949e _−_ 3 0 _._ 543 _±_ 2 _._ 982e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 667 _±_ 3 _._ 793e _−_ 3 0 _._ 534 _±_ 4 _._ 487e _−_ 3 0 _._ 673 _±_ 9 _._ 395e _−_ 4 0 _._ 542 _±_ 2 _._ 297e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 661 _±_ 1 _._ 774e _−_ 3 0 _._ 522 _±_ 1 _._ 272e _−_ 3 0 _._ 672 _±_ 2 _._ 568e _−_ 3 0 _._ 539 _±_ 2 _._ 97e _−_ 3
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 662 _±_ 2 _._ 248e _−_ 3 0 _._ 523 _±_ 2 _._ 711e _−_ 3 0 _._ 675 _±_ 1 _._ 282e _−_ 3 0 _._ 545 _±_ 2 _._ 477e _−_ 3
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 662 _±_ 1 _._ 64e _−_ 4 0 _._ 524 _±_ 7 _._ 276e _−_ 4 0 _._ 676 _±_ 8 _._ 784e _−_ 4 0 _._ 546 _±_ 7 _._ 578e _−_ 4
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 662 _±_ 1 _._ 446e _−_ 3 0 _._ 525 _±_ 1 _._ 079e _−_ 3 0 _._ 672 _±_ 6 _._ 774e _−_ 4 0 _._ 541 _±_ 1 _._ 045e _−_ 3
TFM lstm 0 _._ 647 _±_ 1 _._ 332e _−_ 3 0 _._ 514 _±_ 4 _._ 081e _−_ 3 0 _._ 647 _±_ 3 _._ 477e _−_ 3 0 _._ 513 _±_ 4 _._ 214e _−_ 3
TFM mlp 0 _._ 656 _±_ 4 _._ 364e _−_ 3 0 _._ 521 _±_ 3 _._ 65e _−_ 3 0 _._ 652 _±_ 2 _._ 906e _−_ 3 0 _._ 521 _±_ 1 _._ 976e _−_ 3
TFM patchtsmixer 0 _._ 661 _±_ 1 _._ 895e _−_ 3 0 _._ 527 _±_ 1 _._ 407e _−_ 3 0 _._ 651 _±_ 1 _._ 066e _−_ 3 0 _._ 522 _±_ 1 _._ 018e _−_ 3
TFM timemixer 0 _._ 664 _±_ 2 _._ 007e _−_ 3 0 _._ 529 _±_ 2 _._ 858e _−_ 3 0 _._ 658 _±_ 1 _._ 02e _−_ 3 0 _._ 526 _±_ 1 _._ 029e _−_ 3
TSDE lstm 0 _._ 638 _±_ 9 _._ 617e _−_ 4 0 _._ 496 _±_ 4 _._ 173e _−_ 3 0 _._ 64 _±_ 6 _._ 798e _−_ 3 0 _._ 502 _±_ 9 _._ 967e _−_ 3
TSDE mlp 0 _._ 653 _±_ 2 _._ 68e _−_ 2 0 _._ 516 _±_ 3 _._ 931e _−_ 2 0 _._ 691 _±_ 1 _._ 726e _−_ 2 0 _._ 571 _±_ 2 _._ 475e _−_ 2
TSDE patchtsmixer 0 _._ 65 _±_ 1 _._ 516e _−_ 2 0 _._ 521 _±_ 2 _._ 29e _−_ 2 0 _._ 695 _±_ 1 _._ 768e _−_ 2 0 _._ 574 _±_ 1 _._ 8e _−_ 2
TSDE timemixer 0 _._ 64 _±_ 2 _._ 737e _−_ 3 0 _._ 498 _±_ 3 _._ 735e _−_ 3 0 _._ 66 _±_ 3 _._ 474e _−_ 3 0 _._ 528 _±_ 4 _._ 731e _−_ 3
gemini-2.0-flash CoT +TFM lstm 0 _._ 667 _±_ 3 _._ 387e _−_ 3 0 _._ 534 _±_ 6 _._ 672e _−_ 3 0 _._ 684 _±_ 2 _._ 266e _−_ 3 0 _._ 553 _±_ 2 _._ 386e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 681 _±_ 3 _._ 592e _−_ 3 0 _._ 549 _±_ 4 _._ 444e _−_ 3 0 _._ 688 _±_ 2 _._ 068e _−_ 3 0 _._ 559 _±_ 3 _._ 566e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 687 _±_ 1 _._ 273e _−_ 3 0 _._ 558 _±_ 1 _._ 278e _−_ 3 0 _._ 695 _±_ 2 _._ 92e _−_ 3 0 _._ 567 _±_ 2 _._ 923e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 681 _±_ 2 _._ 181e _−_ 3 0 _._ 555 _±_ 1 _._ 612e _−_ 3 0 _._ 694 _±_ 1 _._ 233e _−_ 3 0 _._ 565 _±_ 1 _._ 432e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 68 _±_ 6 _._ 536e _−_ 3 0 _._ 552 _±_ 9 _._ 249e _−_ 3 0 _._ 685 _±_ 3 _._ 19e _−_ 3 0 _._ 558 _±_ 3 _._ 331e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 683 _±_ 4 _._ 006e _−_ 3 0 _._ 556 _±_ 4 _._ 798e _−_ 3 0 _._ 688 _±_ 1 _._ 267e _−_ 3 0 _._ 561 _±_ 1 _._ 209e _−_ 3
gemini-2.0-flash CoT patchtsmixer 0 _._ 681 _±_ 1 _._ 202e _−_ 3 0 _._ 553 _±_ 1 _._ 498e _−_ 3 0 _._ 69 _±_ 1 _._ 952e _−_ 3 0 _._ 563 _±_ 1 _._ 933e _−_ 3
gemini-2.0-flash CoT timemixer 0 _._ 679 _±_ 1 _._ 521e _−_ 3 0 _._ 552 _±_ 1 _._ 252e _−_ 3 0 _._ 687 _±_ 2 _._ 086e _−_ 3 0 _._ 561 _±_ 1 _._ 86e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 671 _±_ 6 _._ 3e _−_ 3 0 _._ 54 _±_ 1 _._ 002e _−_ 2 0 _._ 688 _±_ 1 _._ 499e _−_ 3 0 _._ 56 _±_ 3 _._ 216e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 681 _±_ 1 _._ 129e _−_ 3 0 _._ 549 _±_ 4 _._ 585e _−_ 3 0 _._ 691 _±_ 1 _._ 102e _−_ 3 0 _._ 564 _±_ 3 _._ 598e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 688 _±_ 2 _._ 907e _−_ 3 0 _._ 56 _±_ 1 _._ 108e _−_ 3 0 _._ 692 _±_ 2 _._ 075e _−_ 3 0 _._ 569 _±_ 2 _._ 007e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 686 _±_ 2 _._ 3e _−_ 3 0 _._ 561 _±_ 1 _._ 33e _−_ 3 0 _._ 69 _±_ 3 _._ 373e _−_ 3 0 _._ 565 _±_ 2 _._ 886e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 679 _±_ 3 _._ 447e _−_ 3 0 _._ 552 _±_ 5 _._ 017e _−_ 3 0 _._ 689 _±_ 1 _._ 697e _−_ 3 0 _._ 568 _±_ 1 _._ 536e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 686 _±_ 1 _._ 743e _−_ 3 0 _._ 559 _±_ 1 _._ 456e _−_ 3 0 _._ 688 _±_ 6 _._ 494e _−_ 4 0 _._ 567 _±_ 7 _._ 23e _−_ 4
gemini-2.0-flash ICD patchtsmixer 0 _._ 683 _±_ 6 _._ 85e _−_ 4 0 _._ 556 _±_ 6 _._ 835e _−_ 4 0 _._ 688 _±_ 2 _._ 879e _−_ 3 0 _._ 568 _±_ 3 _._ 261e _−_ 3
gemini-2.0-flash ICD timemixer 0 _._ 678 _±_ 1 _._ 054e _−_ 3 0 _._ 552 _±_ 1 _._ 234e _−_ 3 0 _._ 685 _±_ 8 _._ 961e _−_ 4 0 _._ 565 _±_ 1 _._ 171e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 664 _±_ 3 _._ 821e _−_ 3 0 _._ 529 _±_ 4 _._ 386e _−_ 3 0 _._ 677 _±_ 7 _._ 19e _−_ 4 0 _._ 543 _±_ 5 _._ 579e _−_ 4
gemini-2.0-flash Trend +TFM mlp 0 _._ 678 _±_ 6 _._ 497e _−_ 3 0 _._ 547 _±_ 6 _._ 906e _−_ 3 0 _._ 682 _±_ 4 _._ 529e _−_ 3 0 _._ 551 _±_ 5 _._ 453e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 681 _±_ 2 _._ 555e _−_ 3 0 _._ 552 _±_ 3 _._ 869e _−_ 3 0 _._ 685 _±_ 2 _._ 19e _−_ 3 0 _._ 554 _±_ 3 _._ 018e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 682 _±_ 6 _._ 809e _−_ 4 0 _._ 558 _±_ 2 _._ 641e _−_ 4 0 _._ 685 _±_ 5 _._ 95e _−_ 4 0 _._ 554 _±_ 5 _._ 81e _−_ 4
gemini-2.0-flash Trend lstm 0 _._ 677 _±_ 1 _._ 297e _−_ 3 0 _._ 547 _±_ 2 _._ 634e _−_ 3 0 _._ 682 _±_ 2 _._ 711e _−_ 3 0 _._ 554 _±_ 2 _._ 045e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 681 _±_ 1 _._ 482e _−_ 3 0 _._ 551 _±_ 2 _._ 168e _−_ 3 0 _._ 681 _±_ 1 _._ 688e _−_ 3 0 _._ 553 _±_ 1 _._ 432e _−_ 3
gemini-2.0-flash Trend patchtsmixer 0 _._ 68 _±_ 1 _._ 276e _−_ 3 0 _._ 551 _±_ 1 _._ 95e _−_ 3 0 _._ 681 _±_ 9 _._ 38e _−_ 4 0 _._ 554 _±_ 1 _._ 776e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 68 _±_ 1 _._ 174e _−_ 3 0 _._ 551 _±_ 7 _._ 688e _−_ 4 0 _._ 682 _±_ 6 _._ 751e _−_ 4 0 _._ 555 _±_ 1 _._ 328e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 673 _±_ 3 _._ 99e _−_ 3 0 _._ 541 _±_ 5 _._ 391e _−_ 3 0 _._ 684 _±_ 2 _._ 167e _−_ 3 0 _._ 556 _±_ 1 _._ 379e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 688 _±_ 4 _._ 124e _−_ 3 0 _._ 558 _±_ 5 _._ 348e _−_ 3 0 _._ 691 _±_ 1 _._ 859e _−_ 3 0 _._ 564 _±_ 3 _._ 858e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 691 _±_ 1 _._ 151e _−_ 3 0 _._ 559 _±_ 6 _._ 519e _−_ 4 0 _._ 693 _±_ 2 _._ 076e _−_ 3 0 _._ 566 _±_ 2 _._ 471e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 689 _±_ 2 _._ 983e _−_ 3 0 _._ 56 _±_ 1 _._ 665e _−_ 3 0 _._ 692 _±_ 1 _._ 139e _−_ 3 0 _._ 566 _±_ 1 _._ 297e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 682 _±_ 4 _._ 034e _−_ 3 0 _._ 553 _±_ 3 _._ 975e _−_ 3 0 _._ 692 _±_ 7 _._ 208e _−_ 4 0 _._ 565 _±_ 1 _._ 489e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 686 _±_ 2 _._ 353e _−_ 3 0 _._ 558 _±_ 2 _._ 876e _−_ 3 0 _._ 691 _±_ 1 _._ 573e _−_ 3 0 _._ 565 _±_ 1 _._ 388e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 685 _±_ 2 _._ 944e _−_ 3 0 _._ 557 _±_ 3 _._ 471e _−_ 3 0 _._ 693 _±_ 1 _._ 073e _−_ 3 0 _._ 566 _±_ 1 _._ 022e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 687 _±_ 5 _._ 444e _−_ 3 0 _._ 558 _±_ 5 _._ 147e _−_ 3 0 _._ 692 _±_ 1 _._ 375e _−_ 3 0 _._ 566 _±_ 1 _._ 655e _−_ 3
interp lstm 0 _._ 644 _±_ 1 _._ 164e _−_ 2 0 _._ 508 _±_ 1 _._ 574e _−_ 2 0 _._ 641 _±_ 3 _._ 775e _−_ 3 0 _._ 504 _±_ 7 _._ 525e _−_ 3
interp mlp 0 _._ 657 _±_ 1 _._ 27e _−_ 3 0 _._ 52 _±_ 9 _._ 396e _−_ 4 0 _._ 637 _±_ 4 _._ 554e _−_ 4 0 _._ 499 _±_ 6 _._ 287e _−_ 4
interp patchtsmixer 0 _._ 681 _±_ 3 _._ 759e _−_ 3 0 _._ 546 _±_ 5 _._ 672e _−_ 3 0 _._ 655 _±_ 2 _._ 889e _−_ 3 0 _._ 534 _±_ 4 _._ 291e _−_ 3
interp timemixer 0 _._ 659 _±_ 4 _._ 302e _−_ 3 0 _._ 524 _±_ 7 _._ 454e _−_ 3 0 _._ 662 _±_ 7 _._ 809e _−_ 4 0 _._ 526 _±_ 1 _._ 762e _−_ 3
mean lstm 0 _._ 638 _±_ 1 _._ 495e _−_ 3 0 _._ 499 _±_ 2 _._ 835e _−_ 3 0 _._ 643 _±_ 9 _._ 4e _−_ 3 0 _._ 507 _±_ 1 _._ 477e _−_ 2
mean mlp 0 _._ 66 _±_ 3 _._ 843e _−_ 3 0 _._ 528 _±_ 3 _._ 351e _−_ 3 0 _._ 667 _±_ 5 _._ 15e _−_ 3 0 _._ 549 _±_ 7 _._ 58e _−_ 3
mean patchtsmixer 0 _._ 694 _±_ 6 _._ 732e _−_ 3 0 _._ 567 _±_ 3 _._ 063e _−_ 3 0 _._ 663 _±_ 1 _._ 742e _−_ 2 0 _._ 542 _±_ 3 _._ 163e _−_ 2
mean timemixer 0 _._ 622 _±_ 2 _._ 893e _−_ 3 0 _._ 468 _±_ 1 _._ 83e _−_ 3 0 _._ 644 _±_ 1 _._ 102e _−_ 2 0 _._ 497 _±_ 1 _._ 143e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 689 _±_ 1 _._ 166e _−_ 3 0 _._ 56 _±_ 2 _._ 305e _−_ 3 0 _._ 711 _±_ 1 _._ 29e _−_ 3 0 _._ 583 _±_ 2 _._ 859e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 701 _±_ 1 _._ 357e _−_ 3 0 _._ 568 _±_ 1 _._ 455e _−_ 3 0 _._ 701 _±_ 1 _._ 873e _−_ 3 0 _._ 574 _±_ 3 _._ 119e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 701 _±_ 9 _._ 133e _−_ 4 0 _._ 568 _±_ 8 _._ 514e _−_ 4 0 _._ 711 _±_ 5 _._ 239e _−_ 3 0 _._ 586 _±_ 6 _._ 898e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 702 _±_ 1 _._ 437e _−_ 3 0 _._ 572 _±_ 3 _._ 253e _−_ 3 0 _._ 709 _±_ 3 _._ 145e _−_ 3 0 _._ 582 _±_ 2 _._ 542e _−_ 3
No ~~s~~ um ~~C~~ oT lstm 0 _._ 691 _±_ 1 _._ 583e _−_ 3 0 _._ 565 _±_ 1 _._ 564e _−_ 3 0 _._ 708 _±_ 2 _._ 701e _−_ 3 0 _._ 586 _±_ 3 _._ 573e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 694 _±_ 3 _._ 843e _−_ 3 0 _._ 572 _±_ 6 _._ 092e _−_ 3 0 _._ 697 _±_ 1 _._ 963e _−_ 3 0 _._ 576 _±_ 1 _._ 669e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 695 _±_ 2 _._ 291e _−_ 3 0 _._ 571 _±_ 3 _._ 742e _−_ 3 0 _._ 705 _±_ 1 _._ 04e _−_ 3 0 _._ 582 _±_ 2 _._ 895e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 696 _±_ 1 _._ 185e _−_ 3 0 _._ 57 _±_ 1 _._ 322e _−_ 3 0 _._ 697 _±_ 2 _._ 566e _−_ 3 0 _._ 577 _±_ 3 _._ 58e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 687 _±_ 7 _._ 433e _−_ 4 0 _._ 559 _±_ 9 _._ 199e _−_ 4 0 _._ 711 _±_ 2 _._ 782e _−_ 3 0 _._ 587 _±_ 3 _._ 324e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 703 _±_ 5 _._ 818e _−_ 3 0 _._ 572 _±_ 7 _._ 284e _−_ 3 0 _._ 712 _±_ 5 _._ 727e _−_ 3 0 _._ 586 _±_ 6 _._ 684e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 703 _±_ 1 _._ 164e _−_ 3 0 _._ 573 _±_ 2 _._ 192e _−_ 3 0 _._ 714 _±_ 2 _._ 505e _−_ 3 0 _._ 589 _±_ 1 _._ 042e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 702 _±_ 1 _._ 975e _−_ 3 0 _._ 57 _±_ 4 _._ 537e _−_ 4 0 _._ 709 _±_ 7 _._ 882e _−_ 3 0 _._ 583 _±_ 8 _._ 063e _−_ 3
No ~~s~~ um ~~I~~ CD lstm 0 _._ 695 _±_ 1 _._ 836e _−_ 3 0 _._ 573 _±_ 2 _._ 081e _−_ 3 0 _._ 707 _±_ 1 _._ 467e _−_ 3 0 _._ 584 _±_ 1 _._ 121e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 697 _±_ 2 _._ 346e _−_ 3 0 _._ 576 _±_ 3 _._ 113e _−_ 3 0 _._ 706 _±_ 6 _._ 114e _−_ 3 0 _._ 585 _±_ 6 _._ 285e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 699 _±_ 2 _._ 085e _−_ 3 0 _._ 578 _±_ 1 _._ 83e _−_ 3 0 _._ 711 _±_ 1 _._ 838e _−_ 3 0 _._ 589 _±_ 1 _._ 995e _−_ 3
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 703 _±_ 1 _._ 428e _−_ 3 0 _._ 58 _±_ 1 _._ 191e _−_ 3 0 _._ 705 _±_ 2 _._ 969e _−_ 3 0 _._ 584 _±_ 2 _._ 066e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 687 _±_ 2 _._ 651e _−_ 3 0 _._ 556 _±_ 3 _._ 955e _−_ 3 0 _._ 715 _±_ 3 _._ 465e _−_ 3 0 _._ 589 _±_ 4 _._ 91e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 698 _±_ 5 _._ 702e _−_ 3 0 _._ 568 _±_ 5 _._ 788e _−_ 3 0 _._ 699 _±_ 8 _._ 263e _−_ 3 0 _._ 572 _±_ 1 _._ 13e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 7 _±_ 1 _._ 456e _−_ 3 0 _._ 568 _±_ 3 _._ 095e _−_ 3 0 _._ 708 _±_ 4 _._ 263e _−_ 3 0 _._ 586 _±_ 5 _._ 725e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 701 _±_ 1 _._ 005e _−_ 3 0 _._ 569 _±_ 3 _._ 575e _−_ 3 0 _._ 714 _±_ 1 _._ 818e _−_ 3 0 _._ 588 _±_ 1 _._ 287e _−_ 3


Table 24: Cross-site transfer results - Gender. (part 1/2)


40


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 686 _±_ 2 _._ 715e _−_ 3 0 _._ 561 _±_ 3 _._ 173e _−_ 3 0 _._ 712 _±_ 2 _._ 536e _−_ 3 0 _._ 588 _±_ 2 _._ 901e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 687 _±_ 1 _._ 638e _−_ 3 0 _._ 563 _±_ 1 _._ 828e _−_ 3 0 _._ 707 _±_ 3 _._ 987e _−_ 3 0 _._ 588 _±_ 3 _._ 721e _−_ 3
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 691 _±_ 1 _._ 504e _−_ 3 0 _._ 566 _±_ 1 _._ 569e _−_ 3 0 _._ 702 _±_ 2 _._ 505e _−_ 3 0 _._ 584 _±_ 2 _._ 975e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 694 _±_ 1 _._ 373e _−_ 3 0 _._ 568 _±_ 1 _._ 335e _−_ 3 0 _._ 702 _±_ 1 _._ 888e _−_ 3 0 _._ 582 _±_ 3 _._ 587e _−_ 3
medgemma CoT +TFM lstm 0 _._ 674 _±_ 3 _._ 333e _−_ 3 0 _._ 542 _±_ 4 _._ 159e _−_ 3 0 _._ 68 _±_ 9 _._ 923e _−_ 4 0 _._ 55 _±_ 1 _._ 624e _−_ 3
medgemma CoT +TFM mlp 0 _._ 687 _±_ 2 _._ 608e _−_ 4 0 _._ 553 _±_ 5 _._ 26e _−_ 4 0 _._ 686 _±_ 1 _._ 44e _−_ 3 0 _._ 558 _±_ 2 _._ 216e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 69 _±_ 8 _._ 329e _−_ 4 0 _._ 556 _±_ 8 _._ 536e _−_ 4 0 _._ 687 _±_ 1 _._ 499e _−_ 3 0 _._ 56 _±_ 1 _._ 612e _−_ 3
medgemma CoT +TFM timemixer 0 _._ 685 _±_ 6 _._ 618e _−_ 3 0 _._ 555 _±_ 5 _._ 886e _−_ 3 0 _._ 685 _±_ 8 _._ 743e _−_ 4 0 _._ 559 _±_ 1 _._ 573e _−_ 3
medgemma CoT lstm 0 _._ 683 _±_ 6 _._ 904e _−_ 4 0 _._ 551 _±_ 1 _._ 304e _−_ 3 0 _._ 683 _±_ 1 _._ 401e _−_ 3 0 _._ 558 _±_ 1 _._ 623e _−_ 3
medgemma CoT mlp 0 _._ 685 _±_ 1 _._ 403e _−_ 3 0 _._ 555 _±_ 2 _._ 095e _−_ 3 0 _._ 685 _±_ 9 _._ 946e _−_ 5 0 _._ 561 _±_ 6 _._ 614e _−_ 4
medgemma CoT patchtsmixer 0 _._ 687 _±_ 7 _._ 489e _−_ 4 0 _._ 558 _±_ 8 _._ 431e _−_ 4 0 _._ 686 _±_ 6 _._ 106e _−_ 4 0 _._ 561 _±_ 3 _._ 438e _−_ 4
medgemma CoT timemixer 0 _._ 686 _±_ 1 _._ 536e _−_ 3 0 _._ 556 _±_ 2 _._ 005e _−_ 3 0 _._ 681 _±_ 1 _._ 419e _−_ 3 0 _._ 556 _±_ 1 _._ 152e _−_ 3
medgemma ICD +TFM lstm 0 _._ 67 _±_ 2 _._ 968e _−_ 3 0 _._ 539 _±_ 6 _._ 595e _−_ 3 0 _._ 675 _±_ 1 _._ 207e _−_ 3 0 _._ 543 _±_ 1 _._ 559e _−_ 3
medgemma ICD +TFM mlp 0 _._ 677 _±_ 1 _._ 649e _−_ 3 0 _._ 548 _±_ 2 _._ 954e _−_ 3 0 _._ 676 _±_ 3 _._ 333e _−_ 3 0 _._ 547 _±_ 3 _._ 011e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 682 _±_ 9 _._ 678e _−_ 4 0 _._ 551 _±_ 1 _._ 749e _−_ 3 0 _._ 679 _±_ 7 _._ 088e _−_ 4 0 _._ 55 _±_ 1 _._ 454e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 681 _±_ 7 _._ 295e _−_ 4 0 _._ 552 _±_ 1 _._ 295e _−_ 3 0 _._ 68 _±_ 1 _._ 527e _−_ 3 0 _._ 55 _±_ 9 _._ 28e _−_ 4
medgemma ICD lstm 0 _._ 673 _±_ 2 _._ 193e _−_ 3 0 _._ 546 _±_ 1 _._ 734e _−_ 3 0 _._ 676 _±_ 1 _._ 544e _−_ 3 0 _._ 55 _±_ 9 _._ 854e _−_ 4
medgemma ICD mlp 0 _._ 676 _±_ 9 _._ 677e _−_ 4 0 _._ 551 _±_ 6 _._ 531e _−_ 4 0 _._ 673 _±_ 1 _._ 987e _−_ 3 0 _._ 546 _±_ 2 _._ 311e _−_ 3
medgemma ICD patchtsmixer 0 _._ 679 _±_ 2 _._ 547e _−_ 4 0 _._ 554 _±_ 2 _._ 541e _−_ 4 0 _._ 674 _±_ 1 _._ 957e _−_ 3 0 _._ 548 _±_ 2 _._ 653e _−_ 3
medgemma ICD timemixer 0 _._ 68 _±_ 5 _._ 372e _−_ 4 0 _._ 554 _±_ 1 _._ 056e _−_ 3 0 _._ 675 _±_ 6 _._ 08e _−_ 4 0 _._ 549 _±_ 6 _._ 74e _−_ 4
medgemma Trend +TFM lstm 0 _._ 67 _±_ 5 _._ 701e _−_ 4 0 _._ 538 _±_ 3 _._ 443e _−_ 4 0 _._ 676 _±_ 3 _._ 496e _−_ 3 0 _._ 544 _±_ 4 _._ 863e _−_ 3
medgemma Trend +TFM mlp 0 _._ 682 _±_ 3 _._ 816e _−_ 3 0 _._ 546 _±_ 4 _._ 199e _−_ 3 0 _._ 683 _±_ 3 _._ 324e _−_ 3 0 _._ 554 _±_ 5 _._ 511e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 685 _±_ 1 _._ 427e _−_ 3 0 _._ 552 _±_ 1 _._ 289e _−_ 3 0 _._ 683 _±_ 2 _._ 212e _−_ 3 0 _._ 554 _±_ 1 _._ 831e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 683 _±_ 3 _._ 498e _−_ 3 0 _._ 553 _±_ 4 _._ 794e _−_ 3 0 _._ 684 _±_ 1 _._ 091e _−_ 3 0 _._ 555 _±_ 1 _._ 287e _−_ 3
medgemma Trend lstm 0 _._ 68 _±_ 3 _._ 709e _−_ 3 0 _._ 547 _±_ 4 _._ 37e _−_ 3 0 _._ 683 _±_ 2 _._ 223e _−_ 3 0 _._ 557 _±_ 1 _._ 936e _−_ 3
medgemma Trend mlp 0 _._ 683 _±_ 2 _._ 096e _−_ 3 0 _._ 551 _±_ 2 _._ 115e _−_ 3 0 _._ 685 _±_ 8 _._ 504e _−_ 4 0 _._ 56 _±_ 1 _._ 115e _−_ 3
medgemma Trend patchtsmixer 0 _._ 683 _±_ 1 _._ 228e _−_ 3 0 _._ 551 _±_ 8 _._ 638e _−_ 4 0 _._ 685 _±_ 9 _._ 167e _−_ 4 0 _._ 56 _±_ 1 _._ 063e _−_ 3
medgemma Trend timemixer 0 _._ 684 _±_ 1 _._ 472e _−_ 3 0 _._ 553 _±_ 6 _._ 251e _−_ 4 0 _._ 68 _±_ 1 _._ 174e _−_ 3 0 _._ 557 _±_ 1 _._ 081e _−_ 3
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 671 _±_ 6 _._ 166e _−_ 3 0 _._ 538 _±_ 5 _._ 835e _−_ 3 0 _._ 681 _±_ 2 _._ 502e _−_ 3 0 _._ 552 _±_ 2 _._ 85e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 679 _±_ 6 _._ 633e _−_ 3 0 _._ 548 _±_ 9 _._ 38e _−_ 3 0 _._ 683 _±_ 3 _._ 667e _−_ 3 0 _._ 555 _±_ 3 _._ 361e _−_ 3
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 684 _±_ 2 _._ 966e _−_ 3 0 _._ 553 _±_ 4 _._ 421e _−_ 3 0 _._ 688 _±_ 4 _._ 088e _−_ 3 0 _._ 56 _±_ 5 _._ 639e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 681 _±_ 1 _._ 818e _−_ 3 0 _._ 55 _±_ 2 _._ 888e _−_ 3 0 _._ 684 _±_ 7 _._ 047e _−_ 4 0 _._ 558 _±_ 9 _._ 539e _−_ 4
medgemma zero ~~s~~ hot lstm 0 _._ 68 _±_ 1 _._ 026e _−_ 3 0 _._ 553 _±_ 1 _._ 347e _−_ 3 0 _._ 682 _±_ 8 _._ 385e _−_ 4 0 _._ 558 _±_ 1 _._ 123e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 68 _±_ 1 _._ 632e _−_ 3 0 _._ 555 _±_ 2 _._ 142e _−_ 3 0 _._ 685 _±_ 1 _._ 068e _−_ 3 0 _._ 56 _±_ 2 _._ 674e _−_ 3
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 681 _±_ 1 _._ 601e _−_ 3 0 _._ 557 _±_ 1 _._ 468e _−_ 3 0 _._ 683 _±_ 1 _._ 665e _−_ 3 0 _._ 557 _±_ 2 _._ 348e _−_ 3
medgemma zero ~~s~~ hot timemixer 0 _._ 682 _±_ 7 _._ 89e _−_ 4 0 _._ 556 _±_ 5 _._ 766e _−_ 4 0 _._ 681 _±_ 1 _._ 748e _−_ 3 0 _._ 556 _±_ 3 _._ 155e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM lstm 0 _._ 687 _±_ 2 _._ 507e _−_ 3 0 _._ 555 _±_ 2 _._ 461e _−_ 3 0 _._ 709 _±_ 1 _._ 499e _−_ 3 0 _._ 582 _±_ 2 _._ 53e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM mlp 0 _._ 699 _±_ 1 _._ 001e _−_ 3 0 _._ 567 _±_ 4 _._ 949e _−_ 4 0 _._ 701 _±_ 6 _._ 731e _−_ 3 0 _._ 573 _±_ 8 _._ 181e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 7 _±_ 5 _._ 422e _−_ 3 0 _._ 567 _±_ 6 _._ 611e _−_ 3 0 _._ 709 _±_ 7 _._ 127e _−_ 4 0 _._ 58 _±_ 1 _._ 602e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM timemixer 0 _._ 698 _±_ 1 _._ 78e _−_ 3 0 _._ 57 _±_ 2 _._ 616e _−_ 3 0 _._ 709 _±_ 8 _._ 243e _−_ 3 0 _._ 584 _±_ 6 _._ 554e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 689 _±_ 8 _._ 802e _−_ 4 0 _._ 562 _±_ 8 _._ 527e _−_ 4 0 _._ 699 _±_ 2 _._ 181e _−_ 3 0 _._ 573 _±_ 3 _._ 481e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 688 _±_ 1 _._ 266e _−_ 3 0 _._ 564 _±_ 2 _._ 873e _−_ 3 0 _._ 701 _±_ 1 _._ 758e _−_ 3 0 _._ 579 _±_ 2 _._ 061e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 689 _±_ 1 _._ 275e _−_ 3 0 _._ 564 _±_ 1 _._ 727e _−_ 3 0 _._ 698 _±_ 1 _._ 747e _−_ 3 0 _._ 575 _±_ 1 _._ 635e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 688 _±_ 1 _._ 633e _−_ 3 0 _._ 563 _±_ 1 _._ 083e _−_ 3 0 _._ 691 _±_ 2 _._ 098e _−_ 3 0 _._ 568 _±_ 2 _._ 346e _−_ 3
right lstm 0 _._ 642 _±_ 6 _._ 967e _−_ 3 0 _._ 506 _±_ 1 _._ 217e _−_ 2 0 _._ 639 _±_ 0e0 0 _._ 5 _±_ 0e0
right mlp 0 _._ 65 _±_ 1 _._ 583e _−_ 3 0 _._ 511 _±_ 2 _._ 671e _−_ 3 0 _._ 64 _±_ 1 _._ 61e _−_ 3 0 _._ 504 _±_ 2 _._ 429e _−_ 3
right patchtsmixer 0 _._ 682 _±_ 2 _._ 058e _−_ 3 0 _._ 55 _±_ 1 _._ 6e _−_ 3 0 _._ 649 _±_ 5 _._ 373e _−_ 3 0 _._ 519 _±_ 2 _._ 978e _−_ 3
right timemixer 0 _._ 662 _±_ 6 _._ 162e _−_ 3 0 _._ 528 _±_ 6 _._ 041e _−_ 3 0 _._ 67 _±_ 2 _._ 405e _−_ 3 0 _._ 534 _±_ 7 _._ 208e _−_ 3


Table 25: Cross-site transfer results - Gender. (part 2/2)


41


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro**


Llama-3.1 CoT +TFM lstm 0 _._ 759 _±_ 1 _._ 504e _−_ 3 0 _._ 848 _±_ 5 _._ 911e _−_ 3 0 _._ 76 _±_ 4 _._ 839e _−_ 3 0 _._ 836 _±_ 2 _._ 494e _−_ 3 0 _._ 808 _±_ 2 _._ 843e _−_ 3 0 _._ 917 _±_ 5 _._ 773e _−_ 3
Llama-3.1 CoT +TFM mlp 0 _._ 771 _±_ 2 _._ 913e _−_ 3 0 _._ 847 _±_ 3 _._ 027e _−_ 3 0 _._ 77 _±_ 7 _._ 323e _−_ 3 0 _._ 831 _±_ 4 _._ 135e _−_ 3 0 _._ 814 _±_ 3 _._ 384e _−_ 3 0 _._ 915 _±_ 2 _._ 589e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 736 _±_ 1 _._ 973e _−_ 2 0 _._ 859 _±_ 1 _._ 498e _−_ 2 0 _._ 753 _±_ 7 _._ 457e _−_ 3 0 _._ 82 _±_ 6 _._ 964e _−_ 3 0 _._ 798 _±_ 8 _._ 902e _−_ 3 0 _._ 921 _±_ 4 _._ 925e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 747 _±_ 6 _._ 439e _−_ 3 0 _._ 854 _±_ 1 _._ 833e _−_ 3 0 _._ 737 _±_ 1 _._ 381e _−_ 2 0 _._ 811 _±_ 1 _._ 056e _−_ 2 0 _._ 805 _±_ 8 _._ 986e _−_ 3 0 _._ 925 _±_ 2 _._ 113e _−_ 3
Llama-3.1 CoT lstm 0 _._ 733 _±_ 9 _._ 055e _−_ 3 0 _._ 855 _±_ 3 _._ 436e _−_ 3 0 _._ 692 _±_ 6 _._ 113e _−_ 3 0 _._ 815 _±_ 4 _._ 863e _−_ 3 0 _._ 793 _±_ 3 _._ 488e _−_ 3 0 _._ 935 _±_ 4 _._ 021e _−_ 3
Llama-3.1 CoT mlp 0 _._ 738 _±_ 8 _._ 59e _−_ 3 0 _._ 854 _±_ 2 _._ 156e _−_ 3 0 _._ 69 _±_ 4 _._ 948e _−_ 3 0 _._ 811 _±_ 4 _._ 759e _−_ 3 0 _._ 793 _±_ 2 _._ 72e _−_ 3 0 _._ 935 _±_ 7 _._ 473e _−_ 3
Llama-3.1 CoT patchtsmixer 0 _._ 725 _±_ 6 _._ 203e _−_ 3 0 _._ 855 _±_ 1 _._ 603e _−_ 2 0 _._ 683 _±_ 3 _._ 666e _−_ 3 0 _._ 813 _±_ 2 _._ 29e _−_ 3 0 _._ 787 _±_ 2 _._ 354e _−_ 3 0 _._ 937 _±_ 5 _._ 183e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 728 _±_ 4 _._ 499e _−_ 3 0 _._ 855 _±_ 1 _._ 809e _−_ 2 0 _._ 684 _±_ 3 _._ 584e _−_ 3 0 _._ 813 _±_ 3 _._ 468e _−_ 3 0 _._ 79 _±_ 2 _._ 229e _−_ 3 0 _._ 939 _±_ 2 _._ 984e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 782 _±_ 2 _._ 866e _−_ 3 0 _._ 86 _±_ 4 _._ 17e _−_ 3 0 _._ 784 _±_ 6 _._ 085e _−_ 3 0 _._ 858 _±_ 7 _._ 348e _−_ 3 0 _._ 82 _±_ 3 _._ 275e _−_ 3 0 _._ 919 _±_ 2 _._ 594e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 791 _±_ 6 _._ 305e _−_ 3 0 _._ 86 _±_ 3 _._ 877e _−_ 3 0 _._ 786 _±_ 7 _._ 182e _−_ 3 0 _._ 845 _±_ 6 _._ 57e _−_ 3 0 _._ 826 _±_ 5 _._ 987e _−_ 3 0 _._ 91 _±_ 3 _._ 833e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 77 _±_ 1 _._ 35e _−_ 2 0 _._ 854 _±_ 1 _._ 041e _−_ 2 0 _._ 767 _±_ 4 _._ 433e _−_ 3 0 _._ 84 _±_ 4 _._ 443e _−_ 3 0 _._ 805 _±_ 9 _._ 498e _−_ 3 0 _._ 917 _±_ 5 _._ 297e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 759 _±_ 9 _._ 084e _−_ 3 0 _._ 856 _±_ 3 _._ 575e _−_ 3 0 _._ 768 _±_ 5 _._ 454e _−_ 3 0 _._ 846 _±_ 6 _._ 041e _−_ 3 0 _._ 816 _±_ 2 _._ 132e _−_ 3 0 _._ 922 _±_ 4 _._ 818e _−_ 3
Llama-3.1 ICD lstm 0 _._ 752 _±_ 8 _._ 791e _−_ 3 0 _._ 857 _±_ 5 _._ 166e _−_ 3 0 _._ 728 _±_ 4 _._ 776e _−_ 3 0 _._ 834 _±_ 6 _._ 282e _−_ 3 0 _._ 804 _±_ 2 _._ 747e _−_ 3 0 _._ 932 _±_ 7 _._ 23e _−_ 3
Llama-3.1 ICD mlp 0 _._ 756 _±_ 7 _._ 923e _−_ 3 0 _._ 86 _±_ 2 _._ 418e _−_ 3 0 _._ 733 _±_ 5 _._ 609e _−_ 3 0 _._ 827 _±_ 2 _._ 671e _−_ 3 0 _._ 803 _±_ 4 _._ 286e _−_ 3 0 _._ 93 _±_ 6 _._ 317e _−_ 3
Llama-3.1 ICD patchtsmixer 0 _._ 744 _±_ 9 _._ 307e _−_ 3 0 _._ 853 _±_ 4 _._ 546e _−_ 3 0 _._ 719 _±_ 8 _._ 979e _−_ 3 0 _._ 821 _±_ 2 _._ 673e _−_ 3 0 _._ 795 _±_ 2 _._ 433e _−_ 3 0 _._ 934 _±_ 6 _._ 717e _−_ 3
Llama-3.1 ICD timemixer 0 _._ 748 _±_ 6 _._ 901e _−_ 3 0 _._ 864 _±_ 3 _._ 019e _−_ 3 0 _._ 723 _±_ 7 _._ 084e _−_ 3 0 _._ 826 _±_ 1 _._ 007e _−_ 3 0 _._ 803 _±_ 3 _._ 418e _−_ 3 0 _._ 935 _±_ 8 _._ 746e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 809 _±_ 5 _._ 031e _−_ 3 0 _._ 861 _±_ 1 _._ 306e _−_ 3 0 _._ 792 _±_ 5 _._ 698e _−_ 3 0 _._ 85 _±_ 4 _._ 228e _−_ 3 0 _._ 853 _±_ 3 _._ 27e _−_ 3 0 _._ 905 _±_ 1 _._ 584e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 817 _±_ 2 _._ 262e _−_ 3 0 _._ 858 _±_ 5 _._ 886e _−_ 3 0 _._ 797 _±_ 8 _._ 779e _−_ 3 0 _._ 833 _±_ 4 _._ 905e _−_ 3 0 _._ 856 _±_ 6 _._ 346e _−_ 3 0 _._ 906 _±_ 5 _._ 637e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 789 _±_ 1 _._ 251e _−_ 2 0 _._ 847 _±_ 1 _._ 06e _−_ 2 0 _._ 781 _±_ 6 _._ 412e _−_ 3 0 _._ 828 _±_ 5 _._ 052e _−_ 3 0 _._ 831 _±_ 1 _._ 194e _−_ 2 0 _._ 896 _±_ 6 _._ 258e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 788 _±_ 8 _._ 871e _−_ 3 0 _._ 852 _±_ 6 _._ 465e _−_ 4 0 _._ 776 _±_ 9 _._ 525e _−_ 4 0 _._ 832 _±_ 8 _._ 903e _−_ 4 0 _._ 827 _±_ 1 _._ 403e _−_ 2 0 _._ 898 _±_ 5 _._ 407e _−_ 3
Llama-3.1 Trend lstm 0 _._ 777 _±_ 1 _._ 378e _−_ 2 0 _._ 837 _±_ 1 _._ 26e _−_ 2 0 _._ 744 _±_ 5 _._ 898e _−_ 3 0 _._ 816 _±_ 4 _._ 685e _−_ 3 0 _._ 835 _±_ 6 _._ 602e _−_ 3 0 _._ 901 _±_ 4 _._ 228e _−_ 3
Llama-3.1 Trend mlp 0 _._ 781 _±_ 1 _._ 431e _−_ 2 0 _._ 847 _±_ 6 _._ 816e _−_ 3 0 _._ 747 _±_ 7 _._ 288e _−_ 3 0 _._ 815 _±_ 1 _._ 982e _−_ 3 0 _._ 836 _±_ 7 _._ 237e _−_ 3 0 _._ 903 _±_ 2 _._ 543e _−_ 3
Llama-3.1 Trend patchtsmixer 0 _._ 766 _±_ 1 _._ 143e _−_ 2 0 _._ 845 _±_ 3 _._ 502e _−_ 3 0 _._ 733 _±_ 6 _._ 448e _−_ 3 0 _._ 807 _±_ 2 _._ 011e _−_ 3 0 _._ 824 _±_ 5 _._ 114e _−_ 3 0 _._ 899 _±_ 3 _._ 857e _−_ 3
Llama-3.1 Trend timemixer 0 _._ 771 _±_ 1 _._ 132e _−_ 2 0 _._ 844 _±_ 3 _._ 25e _−_ 3 0 _._ 738 _±_ 8 _._ 357e _−_ 3 0 _._ 814 _±_ 2 _._ 792e _−_ 3 0 _._ 828 _±_ 5 _._ 605e _−_ 3 0 _._ 898 _±_ 4 _._ 965e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 809 _±_ 2 _._ 576e _−_ 3 0 _._ 872 _±_ 7 _._ 616e _−_ 3 0 _._ 778 _±_ 3 _._ 649e _−_ 3 0 _._ 856 _±_ 4 _._ 224e _−_ 3 0 _._ 822 _±_ 5 _._ 651e _−_ 3 0 _._ 917 _±_ 1 _._ 668e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 819 _±_ 2 _._ 948e _−_ 3 0 _._ 872 _±_ 5 _._ 474e _−_ 3 0 _._ 782 _±_ 5 _._ 126e _−_ 3 0 _._ 844 _±_ 3 _._ 205e _−_ 3 0 _._ 824 _±_ 3 _._ 438e _−_ 3 0 _._ 914 _±_ 1 _._ 721e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 791 _±_ 5 _._ 223e _−_ 3 0 _._ 865 _±_ 3 _._ 37e _−_ 3 0 _._ 76 _±_ 5 _._ 657e _−_ 3 0 _._ 836 _±_ 3 _._ 153e _−_ 3 0 _._ 804 _±_ 3 _._ 756e _−_ 3 0 _._ 915 _±_ 4 _._ 702e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 793 _±_ 8 _._ 257e _−_ 3 0 _._ 865 _±_ 4 _._ 343e _−_ 3 0 _._ 77 _±_ 5 _._ 763e _−_ 3 0 _._ 845 _±_ 9 _._ 868e _−_ 4 0 _._ 815 _±_ 3 _._ 645e _−_ 3 0 _._ 923 _±_ 4 _._ 415e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 778 _±_ 9 _._ 139e _−_ 3 0 _._ 858 _±_ 7 _._ 707e _−_ 3 0 _._ 72 _±_ 9 _._ 989e _−_ 3 0 _._ 825 _±_ 5 _._ 409e _−_ 3 0 _._ 805 _±_ 1 _._ 598e _−_ 3 0 _._ 931 _±_ 2 _._ 449e _−_ 3
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 785 _±_ 1 _._ 097e _−_ 2 0 _._ 862 _±_ 7 _._ 484e _−_ 3 0 _._ 72 _±_ 8 _._ 082e _−_ 3 0 _._ 82 _±_ 4 _._ 275e _−_ 3 0 _._ 804 _±_ 3 _._ 139e _−_ 3 0 _._ 93 _±_ 4 _._ 183e _−_ 3
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 772 _±_ 1 _._ 008e _−_ 2 0 _._ 861 _±_ 5 _._ 025e _−_ 3 0 _._ 71 _±_ 6 _._ 547e _−_ 3 0 _._ 824 _±_ 1 _._ 434e _−_ 3 0 _._ 799 _±_ 1 _._ 577e _−_ 3 0 _._ 934 _±_ 8 _._ 589e _−_ 4
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 773 _±_ 1 _._ 038e _−_ 2 0 _._ 853 _±_ 1 _._ 372e _−_ 2 0 _._ 708 _±_ 5 _._ 895e _−_ 3 0 _._ 823 _±_ 5 _._ 838e _−_ 3 0 _._ 8 _±_ 4 _._ 755e _−_ 4 0 _._ 934 _±_ 1 _._ 143e _−_ 3
TFM lstm 0 _._ 741 _±_ 9 _._ 034e _−_ 4 0 _._ 848 _±_ 4 _._ 087e _−_ 3 0 _._ 722 _±_ 1 _._ 278e _−_ 3 0 _._ 817 _±_ 5 _._ 07e _−_ 3 0 _._ 801 _±_ 1 _._ 61e _−_ 3 0 _._ 924 _±_ 2 _._ 687e _−_ 3
TFM mlp 0 _._ 742 _±_ 4 _._ 86e _−_ 4 0 _._ 85 _±_ 7 _._ 832e _−_ 3 0 _._ 726 _±_ 1 _._ 487e _−_ 3 0 _._ 813 _±_ 3 _._ 211e _−_ 3 0 _._ 801 _±_ 1 _._ 695e _−_ 3 0 _._ 922 _±_ 2 _._ 964e _−_ 3
TFM patchtsmixer 0 _._ 721 _±_ 7 _._ 536e _−_ 3 0 _._ 85 _±_ 1 _._ 464e _−_ 2 0 _._ 713 _±_ 1 _._ 868e _−_ 3 0 _._ 806 _±_ 2 _._ 089e _−_ 3 0 _._ 794 _±_ 1 _._ 514e _−_ 3 0 _._ 923 _±_ 4 _._ 105e _−_ 3
TFM timemixer 0 _._ 728 _±_ 3 _._ 021e _−_ 3 0 _._ 844 _±_ 3 _._ 174e _−_ 3 0 _._ 719 _±_ 1 _._ 011e _−_ 3 0 _._ 805 _±_ 8 _._ 749e _−_ 3 0 _._ 797 _±_ 1 _._ 061e _−_ 3 0 _._ 927 _±_ 6 _._ 955e _−_ 3
TSDE mlp 0 _._ 882 _±_ 5 _._ 15e _−_ 3 0 _._ 9 _±_ 6 _._ 275e _−_ 3 0 _._ 858 _±_ 3 _._ 274e _−_ 3 0 _._ 889 _±_ 2 _._ 551e _−_ 3 0 _._ 914 _±_ 3 _._ 144e _−_ 3 0 _._ 897 _±_ 4 _._ 171e _−_ 3
TSDE lstm 0 _._ 885 _±_ 4 _._ 684e _−_ 3 0 _._ 902 _±_ 5 _._ 807e _−_ 3 0 _._ 862 _±_ 2 _._ 948e _−_ 3 0 _._ 89 _±_ 2 _._ 344e _−_ 3 0 _._ 915 _±_ 2 _._ 896e _−_ 3 0 _._ 899 _±_ 3 _._ 746e _−_ 3
TSDE patchtsmixer 0 _._ 882 _±_ 2 _._ 559e _−_ 3 0 _._ 901 _±_ 3 _._ 322e _−_ 3 0 _._ 864 _±_ 1 _._ 931e _−_ 3 0 _._ 888 _±_ 1 _._ 861e _−_ 3 0 _._ 917 _±_ 5 _._ 714e _−_ 4 0 _._ 899 _±_ 1 _._ 961e _−_ 3
TSDE timemixer 0 _._ 887 _±_ 4 _._ 508e _−_ 3 0 _._ 904 _±_ 5 _._ 48e _−_ 3 0 _._ 866 _±_ 2 _._ 983e _−_ 3 0 _._ 892 _±_ 2 _._ 44e _−_ 3 0 _._ 914 _±_ 4 _._ 716e _−_ 3 0 _._ 902 _±_ 3 _._ 798e _−_ 3
gemini-2.0-flash CoT +TFM lstm 0 _._ 823 _±_ 7 _._ 215e _−_ 3 0 _._ 879 _±_ 2 _._ 338e _−_ 3 0 _._ 803 _±_ 5 _._ 517e _−_ 3 0 _._ 866 _±_ 3 _._ 885e _−_ 3 0 _._ 858 _±_ 3 _._ 412e _−_ 3 0 _._ 911 _±_ 2 _._ 789e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 826 _±_ 6 _._ 77e _−_ 3 0 _._ 874 _±_ 2 _._ 381e _−_ 3 0 _._ 801 _±_ 5 _._ 121e _−_ 3 0 _._ 854 _±_ 2 _._ 831e _−_ 3 0 _._ 863 _±_ 8 _._ 082e _−_ 3 0 _._ 907 _±_ 1 _._ 713e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 799 _±_ 6 _._ 955e _−_ 3 0 _._ 872 _±_ 2 _._ 665e _−_ 4 0 _._ 774 _±_ 3 _._ 663e _−_ 2 0 _._ 837 _±_ 2 _._ 663e _−_ 2 0 _._ 846 _±_ 9 _._ 188e _−_ 4 0 _._ 9 _±_ 3 _._ 033e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 816 _±_ 5 _._ 945e _−_ 3 0 _._ 875 _±_ 8 _._ 525e _−_ 3 0 _._ 79 _±_ 3 _._ 963e _−_ 3 0 _._ 855 _±_ 1 _._ 119e _−_ 3 0 _._ 839 _±_ 2 _._ 197e _−_ 3 0 _._ 897 _±_ 3 _._ 462e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 8 _±_ 8 _._ 11e _−_ 3 0 _._ 869 _±_ 7 _._ 762e _−_ 3 0 _._ 759 _±_ 8 _._ 907e _−_ 3 0 _._ 823 _±_ 6 _._ 927e _−_ 3 0 _._ 842 _±_ 7 _._ 014e _−_ 3 0 _._ 909 _±_ 5 _._ 895e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 805 _±_ 9 _._ 615e _−_ 3 0 _._ 868 _±_ 4 _._ 96e _−_ 3 0 _._ 762 _±_ 8 _._ 676e _−_ 3 0 _._ 827 _±_ 9 _._ 066e _−_ 3 0 _._ 845 _±_ 7 _._ 499e _−_ 3 0 _._ 909 _±_ 4 _._ 946e _−_ 3
gemini-2.0-flash CoT patchtsmixer 0 _._ 794 _±_ 8 _._ 547e _−_ 3 0 _._ 867 _±_ 1 _._ 346e _−_ 3 0 _._ 753 _±_ 8 _._ 305e _−_ 3 0 _._ 82 _±_ 9 _._ 924e _−_ 3 0 _._ 833 _±_ 5 _._ 914e _−_ 3 0 _._ 907 _±_ 2 _._ 657e _−_ 3
gemini-2.0-flash CoT timemixer 0 _._ 794 _±_ 8 _._ 417e _−_ 3 0 _._ 868 _±_ 2 _._ 328e _−_ 3 0 _._ 752 _±_ 6 _._ 761e _−_ 3 0 _._ 821 _±_ 7 _._ 768e _−_ 3 0 _._ 839 _±_ 5 _._ 666e _−_ 3 0 _._ 914 _±_ 4 _._ 218e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 819 _±_ 5 _._ 572e _−_ 3 0 _._ 885 _±_ 5 _._ 662e _−_ 3 0 _._ 783 _±_ 6 _._ 991e _−_ 3 0 _._ 85 _±_ 5 _._ 63e _−_ 3 0 _._ 825 _±_ 3 _._ 245e _−_ 3 0 _._ 905 _±_ 2 _._ 993e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 821 _±_ 3 _._ 211e _−_ 3 0 _._ 877 _±_ 1 _._ 819e _−_ 3 0 _._ 782 _±_ 6 _._ 43e _−_ 3 0 _._ 838 _±_ 5 _._ 876e _−_ 3 0 _._ 83 _±_ 5 _._ 002e _−_ 4 0 _._ 905 _±_ 5 _._ 133e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 806 _±_ 2 _._ 056e _−_ 3 0 _._ 87 _±_ 5 _._ 716e _−_ 3 0 _._ 767 _±_ 6 _._ 095e _−_ 3 0 _._ 832 _±_ 4 _._ 4e _−_ 3 0 _._ 81 _±_ 8 _._ 236e _−_ 3 0 _._ 907 _±_ 2 _._ 886e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 804 _±_ 7 _._ 385e _−_ 3 0 _._ 878 _±_ 1 _._ 637e _−_ 3 0 _._ 771 _±_ 7 _._ 967e _−_ 3 0 _._ 841 _±_ 4 _._ 318e _−_ 3 0 _._ 813 _±_ 9 _._ 3e _−_ 3 0 _._ 91 _±_ 3 _._ 109e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 799 _±_ 7 _._ 573e _−_ 3 0 _._ 873 _±_ 8 _._ 271e _−_ 3 0 _._ 73 _±_ 6 _._ 661e _−_ 3 0 _._ 829 _±_ 4 _._ 84e _−_ 3 0 _._ 809 _±_ 4 _._ 763e _−_ 3 0 _._ 913 _±_ 5 _._ 972e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 803 _±_ 9 _._ 185e _−_ 3 0 _._ 875 _±_ 6 _._ 48e _−_ 3 0 _._ 733 _±_ 6 _._ 468e _−_ 3 0 _._ 822 _±_ 3 _._ 005e _−_ 3 0 _._ 809 _±_ 5 _._ 461e _−_ 3 0 _._ 912 _±_ 6 _._ 076e _−_ 3
gemini-2.0-flash ICD patchtsmixer 0 _._ 794 _±_ 1 _._ 271e _−_ 2 0 _._ 875 _±_ 5 _._ 899e _−_ 3 0 _._ 717 _±_ 1 _._ 344e _−_ 2 0 _._ 819 _±_ 5 _._ 034e _−_ 3 0 _._ 802 _±_ 4 _._ 614e _−_ 3 0 _._ 916 _±_ 1 _._ 032e _−_ 2
gemini-2.0-flash ICD timemixer 0 _._ 789 _±_ 4 _._ 491e _−_ 3 0 _._ 873 _±_ 3 _._ 424e _−_ 3 0 _._ 719 _±_ 5 _._ 836e _−_ 3 0 _._ 822 _±_ 2 _._ 4e _−_ 3 0 _._ 806 _±_ 2 _._ 704e _−_ 3 0 _._ 918 _±_ 4 _._ 693e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 805 _±_ 2 _._ 186e _−_ 3 0 _._ 869 _±_ 3 _._ 724e _−_ 3 0 _._ 804 _±_ 7 _._ 659e _−_ 3 0 _._ 857 _±_ 7 _._ 629e _−_ 3 0 _._ 851 _±_ 7 _._ 153e _−_ 3 0 _._ 906 _±_ 5 _._ 343e _−_ 4
gemini-2.0-flash Trend +TFM mlp 0 _._ 814 _±_ 1 _._ 586e _−_ 3 0 _._ 864 _±_ 4 _._ 928e _−_ 3 0 _._ 811 _±_ 3 _._ 376e _−_ 3 0 _._ 85 _±_ 6 _._ 824e _−_ 4 0 _._ 851 _±_ 3 _._ 532e _−_ 3 0 _._ 908 _±_ 1 _._ 825e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 79 _±_ 1 _._ 242e _−_ 2 0 _._ 851 _±_ 7 _._ 54e _−_ 3 0 _._ 789 _±_ 5 _._ 27e _−_ 3 0 _._ 84 _±_ 4 _._ 126e _−_ 3 0 _._ 837 _±_ 7 _._ 07e _−_ 3 0 _._ 896 _±_ 2 _._ 298e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 795 _±_ 4 _._ 414e _−_ 3 0 _._ 864 _±_ 1 _._ 924e _−_ 3 0 _._ 788 _±_ 3 _._ 605e _−_ 3 0 _._ 843 _±_ 4 _._ 348e _−_ 3 0 _._ 83 _±_ 1 _._ 029e _−_ 2 0 _._ 904 _±_ 2 _._ 206e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 786 _±_ 1 _._ 001e _−_ 2 0 _._ 854 _±_ 5 _._ 272e _−_ 3 0 _._ 76 _±_ 9 _._ 8e _−_ 3 0 _._ 824 _±_ 2 _._ 86e _−_ 3 0 _._ 838 _±_ 7e _−_ 3 0 _._ 91 _±_ 5 _._ 622e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 79 _±_ 8 _._ 753e _−_ 3 0 _._ 852 _±_ 6 _._ 831e _−_ 3 0 _._ 762 _±_ 9 _._ 526e _−_ 3 0 _._ 821 _±_ 4 _._ 046e _−_ 3 0 _._ 838 _±_ 7 _._ 23e _−_ 3 0 _._ 912 _±_ 7 _._ 303e _−_ 3
gemini-2.0-flash Trend patchtsmixer 0 _._ 775 _±_ 6 _._ 171e _−_ 3 0 _._ 853 _±_ 1 _._ 358e _−_ 2 0 _._ 757 _±_ 1 _._ 251e _−_ 2 0 _._ 816 _±_ 8 _._ 842e _−_ 3 0 _._ 827 _±_ 3 _._ 24e _−_ 3 0 _._ 916 _±_ 5 _._ 829e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 776 _±_ 1 _._ 131e _−_ 2 0 _._ 849 _±_ 1 _._ 048e _−_ 2 0 _._ 746 _±_ 4 _._ 479e _−_ 3 0 _._ 817 _±_ 7 _._ 589e _−_ 3 0 _._ 825 _±_ 4 _._ 43e _−_ 3 0 _._ 914 _±_ 7 _._ 294e _−_ 4
gemini-2.0-flash zero shot +TFM lstm 0 _._ 863 _±_ 4 _._ 987e _−_ 3 0 _._ 917 _±_ 5 _._ 998e _−_ 3 0 _._ 864 _±_ 5 _._ 265e _−_ 3 0 _._ 913 _±_ 5 _._ 542e _−_ 3 0 _._ 896 _±_ 1 _._ 43e _−_ 3 0 _._ 92 _±_ 8 _._ 127e _−_ 4
gemini-2.0-flash zero shot +TFM mlp 0 _._ 862 _±_ 2 _._ 848e _−_ 3 0 _._ 902 _±_ 2 _._ 268e _−_ 3 0 _._ 864 _±_ 3 _._ 762e _−_ 3 0 _._ 903 _±_ 2 _._ 7e _−_ 3 0 _._ 901 _±_ 6 _._ 656e _−_ 3 0 _._ 924 _±_ 2 _._ 546e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 816 _±_ 2 _._ 215e _−_ 2 0 _._ 877 _±_ 1 _._ 103e _−_ 2 0 _._ 847 _±_ 3 _._ 211e _−_ 3 0 _._ 897 _±_ 2 _._ 887e _−_ 3 0 _._ 886 _±_ 4 _._ 837e _−_ 3 0 _._ 911 _±_ 2 _._ 735e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 849 _±_ 2 _._ 128e _−_ 3 0 _._ 895 _±_ 3 _._ 301e _−_ 3 0 _._ 848 _±_ 4 _._ 601e _−_ 3 0 _._ 902 _±_ 1 _._ 879e _−_ 3 0 _._ 876 _±_ 1 _._ 335e _−_ 2 0 _._ 904 _±_ 6 _._ 197e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 843 _±_ 9 _._ 137e _−_ 3 0 _._ 897 _±_ 5 _._ 75e _−_ 3 0 _._ 852 _±_ 8 _._ 835e _−_ 3 0 _._ 903 _±_ 3 _._ 167e _−_ 3 0 _._ 889 _±_ 9 _._ 931e _−_ 3 0 _._ 918 _±_ 7 _._ 836e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 846 _±_ 7 _._ 775e _−_ 3 0 _._ 894 _±_ 6 _._ 53e _−_ 3 0 _._ 851 _±_ 9 _._ 353e _−_ 3 0 _._ 9 _±_ 1 _._ 722e _−_ 3 0 _._ 889 _±_ 1 _._ 015e _−_ 2 0 _._ 914 _±_ 5 _._ 727e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 832 _±_ 1 _._ 033e _−_ 2 0 _._ 89 _±_ 2 _._ 778e _−_ 3 0 _._ 838 _±_ 7 _._ 206e _−_ 3 0 _._ 894 _±_ 2 _._ 895e _−_ 3 0 _._ 869 _±_ 8 _._ 608e _−_ 3 0 _._ 907 _±_ 2 _._ 16e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 832 _±_ 6 _._ 102e _−_ 3 0 _._ 89 _±_ 4 _._ 892e _−_ 3 0 _._ 842 _±_ 7 _._ 26e _−_ 3 0 _._ 895 _±_ 5 _._ 414e _−_ 3 0 _._ 876 _±_ 7 _._ 177e _−_ 3 0 _._ 91 _±_ 3 _._ 559e _−_ 3
interp lstm 0 _._ 899 _±_ 9 _._ 323e _−_ 4 0 _._ 886 _±_ 3 _._ 813e _−_ 3 0 _._ 882 _±_ 1 _._ 06e _−_ 3 0 _._ 875 _±_ 5 _._ 809e _−_ 3 0 _._ 923 _±_ 1 _._ 772e _−_ 3 0 _._ 882 _±_ 5 _._ 66e _−_ 3
interp mlp 0 _._ 898 _±_ 9 _._ 976e _−_ 4 0 _._ 889 _±_ 2 _._ 19e _−_ 3 0 _._ 869 _±_ 2 _._ 169e _−_ 3 0 _._ 84 _±_ 4 _._ 341e _−_ 3 0 _._ 925 _±_ 6 _._ 745e _−_ 4 0 _._ 887 _±_ 4 _._ 192e _−_ 3
interp patchtsmixer 0 _._ 887 _±_ 1 _._ 387e _−_ 3 0 _._ 879 _±_ 6 _._ 754e _−_ 3 0 _._ 848 _±_ 2 _._ 734e _−_ 3 0 _._ 844 _±_ 1 _._ 791e _−_ 2 0 _._ 848 _±_ 4 _._ 845e _−_ 3 0 _._ 837 _±_ 1 _._ 682e _−_ 2
interp timemixer 0 _._ 889 _±_ 3 _._ 617e _−_ 3 0 _._ 89 _±_ 6 _._ 172e _−_ 3 0 _._ 857 _±_ 2 _._ 195e _−_ 3 0 _._ 843 _±_ 7 _._ 52e _−_ 3 0 _._ 851 _±_ 3 _._ 304e _−_ 3 0 _._ 846 _±_ 1 _._ 36e _−_ 2
mean lstm 0 _._ 905 _±_ 1 _._ 05e _−_ 3 0 _._ 892 _±_ 3 _._ 051e _−_ 3 0 _._ 888 _±_ 2 _._ 364e _−_ 3 0 _._ 884 _±_ 4 _._ 763e _−_ 3 0 _._ 924 _±_ 7 _._ 926e _−_ 4 0 _._ 881 _±_ 2 _._ 693e _−_ 3
mean mlp 0 _._ 901 _±_ 6 _._ 388e _−_ 4 0 _._ 887 _±_ 2 _._ 212e _−_ 3 0 _._ 875 _±_ 1 _._ 632e _−_ 3 0 _._ 855 _±_ 4 _._ 365e _−_ 3 0 _._ 926 _±_ 2 _._ 396e _−_ 4 0 _._ 887 _±_ 1 _._ 678e _−_ 3
mean patchtsmixer 0 _._ 883 _±_ 3 _._ 368e _−_ 3 0 _._ 878 _±_ 1 _._ 275e _−_ 2 0 _._ 844 _±_ 5 _._ 126e _−_ 3 0 _._ 838 _±_ 1 _._ 595e _−_ 2 0 _._ 844 _±_ 2 _._ 806e _−_ 3 0 _._ 834 _±_ 1 _._ 359e _−_ 2
mean timemixer 0 _._ 892 _±_ 2 _._ 522e _−_ 3 0 _._ 898 _±_ 5 _._ 943e _−_ 3 0 _._ 861 _±_ 2 _._ 061e _−_ 3 0 _._ 854 _±_ 4 _._ 307e _−_ 3 0 _._ 863 _±_ 9 _._ 474e _−_ 4 0 _._ 859 _±_ 4 _._ 567e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 9 _±_ 4 _._ 496e _−_ 3 0 _._ 915 _±_ 1 _._ 419e _−_ 3 0 _._ 892 _±_ 9 _._ 205e _−_ 4 0 _._ 907 _±_ 2 _._ 807e _−_ 3 0 _._ 931 _±_ 3 _._ 132e _−_ 3 0 _._ 915 _±_ 2 _._ 932e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 879 _±_ 0e0 0 _._ 905 _±_ 0e0 0 _._ 875 _±_ 0e0 0 _._ 903 _±_ 0e0 0 _._ 92 _±_ 0e0 0 _._ 913 _±_ 0e0
No ~~s~~ um ~~C~~ oT lstm 0 _._ 879 _±_ 3 _._ 153e _−_ 3 0 _._ 911 _±_ 1 _._ 34e _−_ 3 0 _._ 876 _±_ 2 _._ 63e _−_ 3 0 _._ 903 _±_ 2 _._ 297e _−_ 3 0 _._ 92 _±_ 4 _._ 208e _−_ 3 0 _._ 911 _±_ 2 _._ 396e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 88 _±_ 5 _._ 433e _−_ 3 0 _._ 911 _±_ 3 _._ 895e _−_ 3 0 _._ 875 _±_ 2 _._ 234e _−_ 3 0 _._ 901 _±_ 8 _._ 699e _−_ 4 0 _._ 922 _±_ 4 _._ 788e _−_ 3 0 _._ 913 _±_ 4 _._ 862e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 868 _±_ 1 _._ 84e _−_ 3 0 _._ 91 _±_ 2 _._ 465e _−_ 3 0 _._ 867 _±_ 1 _._ 265e _−_ 3 0 _._ 9 _±_ 2 _._ 293e _−_ 3 0 _._ 915 _±_ 6 _._ 256e _−_ 3 0 _._ 914 _±_ 5 _._ 206e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 866 _±_ 4 _._ 418e _−_ 3 0 _._ 912 _±_ 3 _._ 306e _−_ 3 0 _._ 864 _±_ 2 _._ 326e _−_ 3 0 _._ 902 _±_ 2 _._ 705e _−_ 3 0 _._ 91 _±_ 1 _._ 786e _−_ 3 0 _._ 913 _±_ 1 _._ 181e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 9 _±_ 1 _._ 977e _−_ 3 0 _._ 915 _±_ 1 _._ 642e _−_ 3 0 _._ 895 _±_ 2 _._ 344e _−_ 3 0 _._ 909 _±_ 1 _._ 955e _−_ 3 0 _._ 932 _±_ 2 _._ 082e _−_ 3 0 _._ 916 _±_ 2 _._ 257e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 883 _±_ 0e0 0 _._ 906 _±_ 0e0 0 _._ 867 _±_ 0e0 0 _._ 897 _±_ 0e0 0 _._ 908 _±_ 0e0 0 _._ 906 _±_ 0e0
No ~~s~~ um ~~I~~ CD lstm 0 _._ 876 _±_ 2 _._ 698e _−_ 3 0 _._ 91 _±_ 2 _._ 129e _−_ 3 0 _._ 873 _±_ 1 _._ 294e _−_ 3 0 _._ 902 _±_ 1 _._ 303e _−_ 3 0 _._ 92 _±_ 3 _._ 666e _−_ 3 0 _._ 91 _±_ 1 _._ 341e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 873 _±_ 2 _._ 943e _−_ 3 0 _._ 908 _±_ 2 _._ 162e _−_ 3 0 _._ 873 _±_ 4 _._ 679e _−_ 3 0 _._ 901 _±_ 1 _._ 18e _−_ 3 0 _._ 922 _±_ 3 _._ 821e _−_ 3 0 _._ 911 _±_ 3 _._ 056e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 868 _±_ 2 _._ 209e _−_ 3 0 _._ 911 _±_ 1 _._ 463e _−_ 3 0 _._ 867 _±_ 1 _._ 446e _−_ 3 0 _._ 9 _±_ 2 _._ 08e _−_ 3 0 _._ 911 _±_ 4 _._ 231e _−_ 3 0 _._ 91 _±_ 2 _._ 351e _−_ 3
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 861 _±_ 3 _._ 385e _−_ 3 0 _._ 911 _±_ 1 _._ 886e _−_ 3 0 _._ 861 _±_ 3 _._ 087e _−_ 3 0 _._ 901 _±_ 2 _._ 361e _−_ 3 0 _._ 909 _±_ 5 _._ 276e _−_ 3 0 _._ 91 _±_ 3 _._ 126e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 899 _±_ 3 _._ 564e _−_ 3 0 _._ 913 _±_ 1 _._ 287e _−_ 3 0 _._ 893 _±_ 4 _._ 497e _−_ 3 0 _._ 908 _±_ 1 _._ 725e _−_ 3 0 _._ 933 _±_ 2 _._ 694e _−_ 3 0 _._ 917 _±_ 2 _._ 875e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 891 _±_ 0e0 0 _._ 91 _±_ 0e0 0 _._ 88 _±_ 0e0 0 _._ 904 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 921 _±_ 0e0
No ~~s~~ um ~~T~~ rend lstm 0 _._ 879 _±_ 6 _._ 174e _−_ 3 0 _._ 91 _±_ 3 _._ 441e _−_ 3 0 _._ 877 _±_ 3 _._ 142e _−_ 3 0 _._ 901 _±_ 1 _._ 489e _−_ 3 0 _._ 919 _±_ 5 _._ 606e _−_ 3 0 _._ 91 _±_ 2 _._ 737e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 882 _±_ 3 _._ 976e _−_ 3 0 _._ 91 _±_ 2 _._ 915e _−_ 3 0 _._ 877 _±_ 3 _._ 551e _−_ 3 0 _._ 901 _±_ 7 _._ 657e _−_ 4 0 _._ 922 _±_ 5 _._ 061e _−_ 3 0 _._ 914 _±_ 3 _._ 682e _−_ 3
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 869 _±_ 5 _._ 659e _−_ 3 0 _._ 909 _±_ 2 _._ 656e _−_ 3 0 _._ 869 _±_ 2 _._ 656e _−_ 3 0 _._ 9 _±_ 1 _._ 744e _−_ 3 0 _._ 914 _±_ 2 _._ 523e _−_ 3 0 _._ 911 _±_ 3 _._ 485e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 862 _±_ 3 _._ 996e _−_ 3 0 _._ 912 _±_ 3 _._ 809e _−_ 3 0 _._ 869 _±_ 1 _._ 694e _−_ 3 0 _._ 901 _±_ 1 _._ 501e _−_ 3 0 _._ 91 _±_ 3 _._ 811e _−_ 3 0 _._ 911 _±_ 1 _._ 347e _−_ 3
medgemma CoT +TFM lstm 0 _._ 845 _±_ 3 _._ 854e _−_ 3 0 _._ 893 _±_ 3 _._ 063e _−_ 3 0 _._ 822 _±_ 7 _._ 75e _−_ 3 0 _._ 886 _±_ 5 _._ 495e _−_ 3 0 _._ 853 _±_ 2 _._ 784e _−_ 3 0 _._ 914 _±_ 9 _._ 8e _−_ 4
medgemma CoT +TFM mlp 0 _._ 845 _±_ 7 _._ 988e _−_ 3 0 _._ 893 _±_ 5 _._ 966e _−_ 3 0 _._ 828 _±_ 8 _._ 741e _−_ 4 0 _._ 874 _±_ 2 _._ 578e _−_ 3 0 _._ 859 _±_ 5 _._ 718e _−_ 3 0 _._ 914 _±_ 2 _._ 687e _−_ 3


Table 26: In-distribution results - Drug. (part 1/2)


42


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro**


medgemma CoT +TFM patchtsmixer 0 _._ 816 _±_ 1 _._ 606e _−_ 2 0 _._ 876 _±_ 6 _._ 866e _−_ 3 0 _._ 811 _±_ 6 _._ 325e _−_ 3 0 _._ 867 _±_ 3 _._ 918e _−_ 3 0 _._ 833 _±_ 1 _._ 357e _−_ 2 0 _._ 912 _±_ 5 _._ 332e _−_ 3
medgemma CoT +TFM timemixer 0 _._ 824 _±_ 4 _._ 624e _−_ 3 0 _._ 887 _±_ 2 _._ 053e _−_ 3 0 _._ 805 _±_ 6 _._ 915e _−_ 3 0 _._ 873 _±_ 6 _._ 623e _−_ 3 0 _._ 841 _±_ 8 _._ 596e _−_ 3 0 _._ 904 _±_ 7 _._ 508e _−_ 3
medgemma CoT lstm 0 _._ 821 _±_ 8 _._ 278e _−_ 3 0 _._ 88 _±_ 5 _._ 981e _−_ 3 0 _._ 787 _±_ 1 _._ 078e _−_ 2 0 _._ 855 _±_ 2 _._ 705e _−_ 3 0 _._ 84 _±_ 7 _._ 288e _−_ 3 0 _._ 919 _±_ 4 _._ 913e _−_ 3
medgemma CoT mlp 0 _._ 824 _±_ 7 _._ 467e _−_ 3 0 _._ 884 _±_ 2 _._ 531e _−_ 3 0 _._ 788 _±_ 1 _._ 038e _−_ 2 0 _._ 849 _±_ 4 _._ 009e _−_ 3 0 _._ 841 _±_ 6 _._ 244e _−_ 3 0 _._ 918 _±_ 3 _._ 274e _−_ 3
medgemma CoT patchtsmixer 0 _._ 816 _±_ 6 _._ 976e _−_ 3 0 _._ 882 _±_ 1 _._ 833e _−_ 3 0 _._ 773 _±_ 8 _._ 922e _−_ 3 0 _._ 848 _±_ 5 _._ 822e _−_ 3 0 _._ 828 _±_ 4 _._ 332e _−_ 3 0 _._ 919 _±_ 3 _._ 551e _−_ 3
medgemma CoT timemixer 0 _._ 81 _±_ 4 _._ 429e _−_ 3 0 _._ 88 _±_ 1 _._ 775e _−_ 3 0 _._ 775 _±_ 5 _._ 807e _−_ 3 0 _._ 847 _±_ 2 _._ 43e _−_ 3 0 _._ 833 _±_ 5 _._ 616e _−_ 3 0 _._ 922 _±_ 3 _._ 817e _−_ 3
medgemma ICD +TFM lstm 0 _._ 833 _±_ 5 _._ 142e _−_ 3 0 _._ 893 _±_ 6 _._ 274e _−_ 3 0 _._ 832 _±_ 5 _._ 928e _−_ 3 0 _._ 891 _±_ 4 _._ 639e _−_ 3 0 _._ 863 _±_ 3 _._ 365e _−_ 3 0 _._ 916 _±_ 3 _._ 334e _−_ 3
medgemma ICD +TFM mlp 0 _._ 835 _±_ 4 _._ 035e _−_ 3 0 _._ 89 _±_ 1 _._ 505e _−_ 3 0 _._ 831 _±_ 3 _._ 681e _−_ 3 0 _._ 877 _±_ 2 _._ 38e _−_ 3 0 _._ 869 _±_ 3 _._ 292e _−_ 3 0 _._ 914 _±_ 2 _._ 275e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 821 _±_ 5 _._ 796e _−_ 3 0 _._ 882 _±_ 2 _._ 384e _−_ 3 0 _._ 816 _±_ 1 _._ 204e _−_ 2 0 _._ 87 _±_ 4 _._ 382e _−_ 3 0 _._ 847 _±_ 1 _._ 173e _−_ 2 0 _._ 907 _±_ 3 _._ 869e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 824 _±_ 9 _._ 086e _−_ 3 0 _._ 891 _±_ 2 _._ 021e _−_ 3 0 _._ 82 _±_ 2 _._ 987e _−_ 3 0 _._ 876 _±_ 5 _._ 201e _−_ 3 0 _._ 846 _±_ 2 _._ 419e _−_ 3 0 _._ 912 _±_ 2 _._ 627e _−_ 3
medgemma ICD lstm 0 _._ 814 _±_ 8 _._ 569e _−_ 3 0 _._ 888 _±_ 3 _._ 051e _−_ 3 0 _._ 79 _±_ 6 _._ 621e _−_ 3 0 _._ 869 _±_ 2 _._ 355e _−_ 3 0 _._ 854 _±_ 9 _._ 239e _−_ 3 0 _._ 916 _±_ 3 _._ 989e _−_ 3
medgemma ICD mlp 0 _._ 812 _±_ 7 _._ 204e _−_ 3 0 _._ 882 _±_ 2 _._ 433e _−_ 3 0 _._ 797 _±_ 9 _._ 16e _−_ 3 0 _._ 863 _±_ 8 _._ 231e _−_ 4 0 _._ 856 _±_ 7 _._ 955e _−_ 3 0 _._ 914 _±_ 4 _._ 12e _−_ 3
medgemma ICD patchtsmixer 0 _._ 801 _±_ 5 _._ 345e _−_ 3 0 _._ 887 _±_ 5 _._ 366e _−_ 3 0 _._ 782 _±_ 5 _._ 648e _−_ 3 0 _._ 861 _±_ 5 _._ 315e _−_ 3 0 _._ 843 _±_ 7 _._ 95e _−_ 3 0 _._ 916 _±_ 2 _._ 581e _−_ 3
medgemma ICD timemixer 0 _._ 804 _±_ 7 _._ 716e _−_ 3 0 _._ 883 _±_ 2 _._ 69e _−_ 3 0 _._ 784 _±_ 6 _._ 648e _−_ 3 0 _._ 86 _±_ 2 _._ 863e _−_ 3 0 _._ 848 _±_ 6 _._ 34e _−_ 3 0 _._ 916 _±_ 1 _._ 932e _−_ 3
medgemma Trend +TFM lstm 0 _._ 807 _±_ 5 _._ 339e _−_ 3 0 _._ 878 _±_ 4 _._ 003e _−_ 3 0 _._ 791 _±_ 5 _._ 387e _−_ 3 0 _._ 856 _±_ 4 _._ 259e _−_ 3 0 _._ 826 _±_ 9 _._ 506e _−_ 4 0 _._ 915 _±_ 5 _._ 121e _−_ 3
medgemma Trend +TFM mlp 0 _._ 825 _±_ 5 _._ 077e _−_ 3 0 _._ 875 _±_ 3 _._ 013e _−_ 3 0 _._ 792 _±_ 4 _._ 857e _−_ 3 0 _._ 842 _±_ 1 _._ 411e _−_ 3 0 _._ 83 _±_ 7 _._ 246e _−_ 3 0 _._ 911 _±_ 2 _._ 66e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 791 _±_ 3 _._ 926e _−_ 3 0 _._ 871 _±_ 3 _._ 617e _−_ 3 0 _._ 769 _±_ 6 _._ 276e _−_ 3 0 _._ 829 _±_ 6 _._ 85e _−_ 3 0 _._ 812 _±_ 1 _._ 385e _−_ 2 0 _._ 912 _±_ 6 _._ 464e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 797 _±_ 1 _._ 197e _−_ 2 0 _._ 872 _±_ 3 _._ 333e _−_ 3 0 _._ 776 _±_ 3 _._ 095e _−_ 3 0 _._ 838 _±_ 2 _._ 689e _−_ 3 0 _._ 818 _±_ 9 _._ 05e _−_ 3 0 _._ 915 _±_ 3 _._ 635e _−_ 3
medgemma Trend lstm 0 _._ 789 _±_ 9 _._ 638e _−_ 3 0 _._ 872 _±_ 4 _._ 757e _−_ 3 0 _._ 737 _±_ 8 _._ 961e _−_ 3 0 _._ 818 _±_ 5 _._ 73e _−_ 3 0 _._ 813 _±_ 4 _._ 827e _−_ 3 0 _._ 924 _±_ 1 _._ 156e _−_ 2
medgemma Trend mlp 0 _._ 794 _±_ 9 _._ 509e _−_ 3 0 _._ 868 _±_ 5 _._ 495e _−_ 3 0 _._ 74 _±_ 9 _._ 047e _−_ 3 0 _._ 82 _±_ 4 _._ 334e _−_ 3 0 _._ 812 _±_ 3 _._ 613e _−_ 3 0 _._ 923 _±_ 8 _._ 403e _−_ 3
medgemma Trend patchtsmixer 0 _._ 781 _±_ 6 _._ 313e _−_ 3 0 _._ 87 _±_ 7 _._ 499e _−_ 3 0 _._ 73 _±_ 6 _._ 975e _−_ 3 0 _._ 821 _±_ 5 _._ 311e _−_ 3 0 _._ 809 _±_ 2 _._ 999e _−_ 3 0 _._ 926 _±_ 9 _._ 635e _−_ 3
medgemma Trend timemixer 0 _._ 781 _±_ 5 _._ 326e _−_ 3 0 _._ 87 _±_ 9 _._ 221e _−_ 3 0 _._ 728 _±_ 6 _._ 475e _−_ 3 0 _._ 822 _±_ 2 _._ 376e _−_ 3 0 _._ 81 _±_ 3 _._ 251e _−_ 3 0 _._ 927 _±_ 1 _._ 016e _−_ 2
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 853 _±_ 3 _._ 201e _−_ 3 0 _._ 908 _±_ 2 _._ 792e _−_ 3 0 _._ 863 _±_ 7 _._ 753e _−_ 4 0 _._ 914 _±_ 6 _._ 976e _−_ 4 0 _._ 89 _±_ 5 _._ 206e _−_ 3 0 _._ 919 _±_ 3 _._ 282e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 871 _±_ 5 _._ 77e _−_ 3 0 _._ 908 _±_ 2 _._ 679e _−_ 3 0 _._ 855 _±_ 4 _._ 225e _−_ 3 0 _._ 899 _±_ 1 _._ 999e _−_ 3 0 _._ 891 _±_ 5 _._ 443e _−_ 3 0 _._ 917 _±_ 3 _._ 266e _−_ 3
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 84 _±_ 7 _._ 043e _−_ 3 0 _._ 897 _±_ 7 _._ 143e _−_ 4 0 _._ 844 _±_ 7 _._ 993e _−_ 3 0 _._ 893 _±_ 6 _._ 471e _−_ 3 0 _._ 87 _±_ 9 _._ 705e _−_ 3 0 _._ 904 _±_ 5 _._ 752e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 837 _±_ 5 _._ 705e _−_ 3 0 _._ 892 _±_ 4 _._ 526e _−_ 3 0 _._ 842 _±_ 2 _._ 596e _−_ 3 0 _._ 896 _±_ 3 _._ 402e _−_ 3 0 _._ 869 _±_ 7 _._ 885e _−_ 3 0 _._ 907 _±_ 6 _._ 656e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 838 _±_ 7 _._ 46e _−_ 3 0 _._ 901 _±_ 3 _._ 792e _−_ 3 0 _._ 838 _±_ 9 _._ 671e _−_ 3 0 _._ 895 _±_ 9 _._ 065e _−_ 3 0 _._ 874 _±_ 9 _._ 389e _−_ 3 0 _._ 915 _±_ 3 _._ 963e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 84 _±_ 8 _._ 177e _−_ 3 0 _._ 899 _±_ 1 _._ 083e _−_ 2 0 _._ 839 _±_ 9 _._ 327e _−_ 3 0 _._ 893 _±_ 6 _._ 112e _−_ 3 0 _._ 878 _±_ 8 _._ 874e _−_ 3 0 _._ 91 _±_ 3 _._ 853e _−_ 3
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 825 _±_ 2 _._ 188e _−_ 3 0 _._ 887 _±_ 3 _._ 195e _−_ 3 0 _._ 828 _±_ 1 _._ 111e _−_ 2 0 _._ 883 _±_ 6 _._ 946e _−_ 3 0 _._ 866 _±_ 8 _._ 997e _−_ 3 0 _._ 907 _±_ 4 _._ 078e _−_ 3
medgemma zero ~~s~~ hot timemixer 0 _._ 828 _±_ 9 _._ 289e _−_ 3 0 _._ 895 _±_ 5 _._ 052e _−_ 3 0 _._ 83 _±_ 8 _._ 241e _−_ 3 0 _._ 888 _±_ 4 _._ 706e _−_ 3 0 _._ 868 _±_ 8 _._ 289e _−_ 3 0 _._ 911 _±_ 3 _._ 518e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM lstm 0 _._ 901 _±_ 6 _._ 503e _−_ 3 0 _._ 912 _±_ 1 _._ 125e _−_ 3 0 _._ 891 _±_ 4 _._ 215e _−_ 3 0 _._ 906 _±_ 1 _._ 323e _−_ 3 0 _._ 932 _±_ 3 _._ 949e _−_ 3 0 _._ 916 _±_ 3 _._ 882e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 875 _±_ 0e0 0 _._ 903 _±_ 0e0 0 _._ 883 _±_ 0e0 0 _._ 905 _±_ 0e0 0 _._ 921 _±_ 0e0 0 _._ 914 _±_ 0e0
No ~~s~~ um ~~z~~ ero shot lstm 0 _._ 884 _±_ 3 _._ 829e _−_ 3 0 _._ 908 _±_ 2 _._ 785e _−_ 3 0 _._ 878 _±_ 5 _._ 327e _−_ 3 0 _._ 902 _±_ 2 _._ 01e _−_ 3 0 _._ 921 _±_ 6 _._ 224e _−_ 3 0 _._ 911 _±_ 2 _._ 664e _−_ 3
No ~~s~~ um ~~z~~ ero shot mlp 0 _._ 884 _±_ 4 _._ 159e _−_ 3 0 _._ 911 _±_ 3 _._ 471e _−_ 3 0 _._ 875 _±_ 5 _._ 187e _−_ 3 0 _._ 901 _±_ 6 _._ 915e _−_ 4 0 _._ 923 _±_ 5 _._ 792e _−_ 3 0 _._ 913 _±_ 4 _._ 059e _−_ 3
No ~~s~~ um ~~z~~ ero shot patchtsmixer 0 _._ 872 _±_ 4 _._ 123e _−_ 3 0 _._ 907 _±_ 3 _._ 57e _−_ 3 0 _._ 867 _±_ 1 _._ 975e _−_ 3 0 _._ 903 _±_ 3 _._ 036e _−_ 3 0 _._ 913 _±_ 3 _._ 249e _−_ 3 0 _._ 914 _±_ 1 _._ 405e _−_ 3
No ~~s~~ um ~~z~~ ero shot timemixer 0 _._ 864 _±_ 1 _._ 586e _−_ 3 0 _._ 912 _±_ 1 _._ 225e _−_ 3 0 _._ 867 _±_ 1 _._ 081e _−_ 3 0 _._ 902 _±_ 2 _._ 729e _−_ 3 0 _._ 908 _±_ 3 _._ 663e _−_ 3 0 _._ 915 _±_ 3 _._ 573e _−_ 3
right lstm 0 _._ 903 _±_ 9 _._ 254e _−_ 4 0 _._ 891 _±_ 2 _._ 123e _−_ 3 0 _._ 886 _±_ 2 _._ 159e _−_ 3 0 _._ 882 _±_ 5 _._ 877e _−_ 3 0 _._ 924 _±_ 1 _._ 166e _−_ 3 0 _._ 883 _±_ 3 _._ 702e _−_ 3
right mlp 0 _._ 901 _±_ 2 _._ 061e _−_ 4 0 _._ 89 _±_ 1 _._ 767e _−_ 3 0 _._ 88 _±_ 8 _._ 09e _−_ 4 0 _._ 86 _±_ 3 _._ 343e _−_ 3 0 _._ 927 _±_ 6 _._ 405e _−_ 4 0 _._ 892 _±_ 1 _._ 716e _−_ 3
right patchtsmixer 0 _._ 888 _±_ 2 _._ 581e _−_ 3 0 _._ 884 _±_ 6 _._ 439e _−_ 3 0 _._ 849 _±_ 3 _._ 944e _−_ 3 0 _._ 841 _±_ 2 _._ 423e _−_ 2 0 _._ 848 _±_ 6 _._ 675e _−_ 3 0 _._ 831 _±_ 2 _._ 645e _−_ 2
right timemixer 0 _._ 9 _±_ 1 _._ 44e _−_ 3 0 _._ 895 _±_ 4 _._ 593e _−_ 3 0 _._ 863 _±_ 3 _._ 713e _−_ 4 0 _._ 85 _±_ 2 _._ 895e _−_ 3 0 _._ 859 _±_ 4 _._ 092e _−_ 3 0 _._ 846 _±_ 1 _._ 355e _−_ 2


Table 27: In-distribution results - Drug. (part 2/2)


43


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro**


Llama-3.1 CoT +TFM lstm 0 _._ 769 _±_ 1 _._ 565e _−_ 3 0 _._ 931 _±_ 1 _._ 886e _−_ 3 0 _._ 777 _±_ 2 _._ 04e _−_ 3 0 _._ 931 _±_ 1 _._ 593e _−_ 3
Llama-3.1 CoT +TFM mlp 0 _._ 763 _±_ 1 _._ 471e _−_ 3 0 _._ 933 _±_ 1 _._ 939e _−_ 3 0 _._ 774 _±_ 1 _._ 628e _−_ 3 0 _._ 938 _±_ 4 _._ 576e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 75 _±_ 2 _._ 781e _−_ 3 0 _._ 945 _±_ 4 _._ 113e _−_ 3 0 _._ 767 _±_ 3 _._ 535e _−_ 3 0 _._ 932 _±_ 1 _._ 907e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 764 _±_ 3 _._ 39e _−_ 3 0 _._ 937 _±_ 5 _._ 739e _−_ 3 0 _._ 772 _±_ 1 _._ 664e _−_ 3 0 _._ 936 _±_ 6 _._ 964e _−_ 4
Llama-3.1 CoT lstm 0 _._ 761 _±_ 3 _._ 771e _−_ 3 0 _._ 944 _±_ 3 _._ 279e _−_ 3 0 _._ 766 _±_ 4 _._ 793e _−_ 4 0 _._ 95 _±_ 7 _._ 115e _−_ 3
Llama-3.1 CoT mlp 0 _._ 762 _±_ 2 _._ 565e _−_ 3 0 _._ 944 _±_ 7 _._ 042e _−_ 3 0 _._ 765 _±_ 1 _._ 757e _−_ 3 0 _._ 95 _±_ 6 _._ 242e _−_ 3
Llama-3.1 CoT patchtsmixer 0 _._ 757 _±_ 2 _._ 87e _−_ 3 0 _._ 953 _±_ 8 _._ 317e _−_ 3 0 _._ 764 _±_ 1 _._ 703e _−_ 3 0 _._ 949 _±_ 6 _._ 546e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 76 _±_ 3 _._ 443e _−_ 3 0 _._ 951 _±_ 6 _._ 63e _−_ 3 0 _._ 764 _±_ 9 _._ 235e _−_ 4 0 _._ 952 _±_ 8 _._ 599e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 769 _±_ 1 _._ 131e _−_ 3 0 _._ 927 _±_ 4 _._ 855e _−_ 3 0 _._ 78 _±_ 2 _._ 845e _−_ 4 0 _._ 934 _±_ 3 _._ 966e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 772 _±_ 3 _._ 155e _−_ 3 0 _._ 937 _±_ 1 _._ 884e _−_ 3 0 _._ 78 _±_ 1 _._ 354e _−_ 3 0 _._ 937 _±_ 3 _._ 736e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 754 _±_ 1 _._ 392e _−_ 3 0 _._ 935 _±_ 4 _._ 183e _−_ 3 0 _._ 774 _±_ 2 _._ 245e _−_ 3 0 _._ 928 _±_ 2 _._ 228e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 76 _±_ 6 _._ 022e _−_ 3 0 _._ 934 _±_ 4 _._ 85e _−_ 3 0 _._ 779 _±_ 1 _._ 468e _−_ 3 0 _._ 937 _±_ 5 _._ 118e _−_ 3
Llama-3.1 ICD lstm 0 _._ 773 _±_ 1 _._ 46e _−_ 3 0 _._ 947 _±_ 3 _._ 975e _−_ 3 0 _._ 776 _±_ 1 _._ 883e _−_ 3 0 _._ 948 _±_ 8 _._ 712e _−_ 3
Llama-3.1 ICD mlp 0 _._ 774 _±_ 1 _._ 227e _−_ 3 0 _._ 942 _±_ 6 _._ 249e _−_ 3 0 _._ 775 _±_ 2 _._ 145e _−_ 3 0 _._ 947 _±_ 3 _._ 594e _−_ 3
Llama-3.1 ICD patchtsmixer 0 _._ 771 _±_ 2 _._ 857e _−_ 3 0 _._ 941 _±_ 4 _._ 237e _−_ 3 0 _._ 774 _±_ 2 _._ 882e _−_ 3 0 _._ 952 _±_ 3 _._ 825e _−_ 3
Llama-3.1 ICD timemixer 0 _._ 774 _±_ 2 _._ 123e _−_ 3 0 _._ 946 _±_ 2 _._ 746e _−_ 3 0 _._ 776 _±_ 2 _._ 973e _−_ 3 0 _._ 95 _±_ 2 _._ 51e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 789 _±_ 1 _._ 766e _−_ 3 0 _._ 925 _±_ 2 _._ 241e _−_ 3 0 _._ 789 _±_ 1 _._ 162e _−_ 3 0 _._ 922 _±_ 3 _._ 262e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 786 _±_ 3 _._ 692e _−_ 3 0 _._ 931 _±_ 1 _._ 383e _−_ 3 0 _._ 79 _±_ 2 _._ 015e _−_ 3 0 _._ 93 _±_ 3 _._ 038e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 771 _±_ 2 _._ 673e _−_ 3 0 _._ 923 _±_ 3 _._ 235e _−_ 3 0 _._ 784 _±_ 1 _._ 017e _−_ 3 0 _._ 926 _±_ 6 _._ 444e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 785 _±_ 2 _._ 486e _−_ 3 0 _._ 932 _±_ 2 _._ 821e _−_ 3 0 _._ 788 _±_ 1 _._ 255e _−_ 3 0 _._ 921 _±_ 2 _._ 751e _−_ 3
Llama-3.1 Trend lstm 0 _._ 789 _±_ 1 _._ 779e _−_ 3 0 _._ 935 _±_ 3 _._ 835e _−_ 3 0 _._ 785 _±_ 1 _._ 248e _−_ 3 0 _._ 925 _±_ 1 _._ 794e _−_ 3
Llama-3.1 Trend mlp 0 _._ 789 _±_ 1 _._ 819e _−_ 3 0 _._ 937 _±_ 2 _._ 334e _−_ 3 0 _._ 784 _±_ 2 _._ 716e _−_ 3 0 _._ 929 _±_ 5 _._ 426e _−_ 3
Llama-3.1 Trend patchtsmixer 0 _._ 786 _±_ 2 _._ 478e _−_ 3 0 _._ 939 _±_ 8 _._ 783e _−_ 4 0 _._ 779 _±_ 4 _._ 816e _−_ 3 0 _._ 934 _±_ 4 _._ 188e _−_ 3
Llama-3.1 Trend timemixer 0 _._ 789 _±_ 2 _._ 811e _−_ 3 0 _._ 939 _±_ 3 _._ 333e _−_ 3 0 _._ 782 _±_ 2 _._ 986e _−_ 3 0 _._ 932 _±_ 2 _._ 18e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 77 _±_ 2 _._ 102e _−_ 3 0 _._ 94 _±_ 2 _._ 732e _−_ 3 0 _._ 779 _±_ 2 _._ 321e _−_ 3 0 _._ 933 _±_ 2 _._ 519e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 767 _±_ 2 _._ 487e _−_ 3 0 _._ 942 _±_ 1 _._ 719e _−_ 3 0 _._ 778 _±_ 1 _._ 441e _−_ 3 0 _._ 94 _±_ 4 _._ 035e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 747 _±_ 1 _._ 155e _−_ 3 0 _._ 941 _±_ 3 _._ 095e _−_ 3 0 _._ 771 _±_ 2 _._ 038e _−_ 3 0 _._ 928 _±_ 4 _._ 455e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 763 _±_ 3 _._ 452e _−_ 3 0 _._ 941 _±_ 1 _._ 541e _−_ 3 0 _._ 773 _±_ 1 _._ 115e _−_ 3 0 _._ 934 _±_ 3 _._ 409e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 774 _±_ 4 _._ 573e _−_ 3 0 _._ 951 _±_ 6 _._ 489e _−_ 4 0 _._ 773 _±_ 3 _._ 396e _−_ 3 0 _._ 95 _±_ 3 _._ 991e _−_ 3
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 773 _±_ 3 _._ 335e _−_ 3 0 _._ 95 _±_ 4 _._ 034e _−_ 3 0 _._ 774 _±_ 2 _._ 273e _−_ 3 0 _._ 95 _±_ 2 _._ 508e _−_ 3
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 772 _±_ 4 _._ 054e _−_ 3 0 _._ 952 _±_ 2 _._ 209e _−_ 3 0 _._ 774 _±_ 2 _._ 935e _−_ 3 0 _._ 949 _±_ 4 _._ 178e _−_ 3
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 775 _±_ 3 _._ 184e _−_ 3 0 _._ 952 _±_ 2 _._ 072e _−_ 3 0 _._ 775 _±_ 2 _._ 595e _−_ 3 0 _._ 953 _±_ 1 _._ 233e _−_ 3
TFM lstm 0 _._ 792 _±_ 6 _._ 625e _−_ 4 0 _._ 934 _±_ 3 _._ 326e _−_ 3 0 _._ 788 _±_ 2 _._ 603e _−_ 4 0 _._ 941 _±_ 2 _._ 725e _−_ 3
TFM mlp 0 _._ 79 _±_ 1 _._ 096e _−_ 3 0 _._ 932 _±_ 1 _._ 591e _−_ 3 0 _._ 783 _±_ 1 _._ 592e _−_ 3 0 _._ 944 _±_ 2 _._ 947e _−_ 3
TFM patchtsmixer 0 _._ 779 _±_ 1 _._ 063e _−_ 3 0 _._ 935 _±_ 2 _._ 672e _−_ 3 0 _._ 781 _±_ 1 _._ 161e _−_ 3 0 _._ 947 _±_ 2 _._ 087e _−_ 3
TFM timemixer 0 _._ 785 _±_ 1 _._ 221e _−_ 3 0 _._ 943 _±_ 3 _._ 055e _−_ 3 0 _._ 787 _±_ 9 _._ 39e _−_ 4 0 _._ 941 _±_ 1 _._ 408e _−_ 3
TSDE mlp 0 _._ 731 _±_ 5 _._ 055e _−_ 4 0 _._ 916 _±_ 1 _._ 303e _−_ 3 0 _._ 731 _±_ 1 _._ 478e _−_ 3 0 _._ 939 _±_ 3 _._ 459e _−_ 3
TSDE lstm 0 _._ 732 _±_ 5 _._ 055e _−_ 4 0 _._ 917 _±_ 1 _._ 159e _−_ 3 0 _._ 733 _±_ 1 _._ 27e _−_ 3 0 _._ 905 _±_ 2 _._ 959e _−_ 3
TSDE patchtsmixer 0 _._ 732 _±_ 5 _._ 084e _−_ 4 0 _._ 909 _±_ 9 _._ 785e _−_ 4 0 _._ 733 _±_ 3 _._ 643e _−_ 4 0 _._ 899 _±_ 2 _._ 846e _−_ 4
TSDE timemixer 0 _._ 732 _±_ 5 _._ 027e _−_ 4 0 _._ 918 _±_ 1 _._ 937e _−_ 3 0 _._ 734 _±_ 1 _._ 911e _−_ 3 0 _._ 904 _±_ 3 _._ 655e _−_ 3
gemini-2.0-flash CoT +TFM lstm 0 _._ 795 _±_ 2 _._ 031e _−_ 4 0 _._ 922 _±_ 4 _._ 589e _−_ 3 0 _._ 797 _±_ 1 _._ 453e _−_ 3 0 _._ 919 _±_ 4 _._ 039e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 792 _±_ 9 _._ 546e _−_ 4 0 _._ 927 _±_ 4 _._ 131e _−_ 3 0 _._ 799 _±_ 2 _._ 066e _−_ 3 0 _._ 926 _±_ 1 _._ 863e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 77 _±_ 6 _._ 553e _−_ 4 0 _._ 912 _±_ 3 _._ 054e _−_ 3 0 _._ 778 _±_ 6 _._ 061e _−_ 3 0 _._ 916 _±_ 4 _._ 519e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 779 _±_ 2 _._ 736e _−_ 3 0 _._ 921 _±_ 2 _._ 092e _−_ 3 0 _._ 793 _±_ 1 _._ 69e _−_ 3 0 _._ 921 _±_ 2 _._ 353e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 79 _±_ 3 _._ 174e _−_ 3 0 _._ 93 _±_ 1 _._ 465e _−_ 3 0 _._ 798 _±_ 2 _._ 544e _−_ 4 0 _._ 934 _±_ 4 _._ 794e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 791 _±_ 2 _._ 826e _−_ 3 0 _._ 93 _±_ 2 _._ 745e _−_ 3 0 _._ 798 _±_ 1 _._ 862e _−_ 3 0 _._ 931 _±_ 6 _._ 755e _−_ 3
gemini-2.0-flash CoT patchtsmixer 0 _._ 788 _±_ 2 _._ 483e _−_ 3 0 _._ 93 _±_ 2 _._ 14e _−_ 3 0 _._ 797 _±_ 1 _._ 708e _−_ 3 0 _._ 932 _±_ 5 _._ 13e _−_ 3
gemini-2.0-flash CoT timemixer 0 _._ 793 _±_ 1 _._ 82e _−_ 3 0 _._ 93 _±_ 2 _._ 094e _−_ 3 0 _._ 799 _±_ 2 _._ 242e _−_ 3 0 _._ 929 _±_ 1 _._ 58e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 76 _±_ 1 _._ 129e _−_ 3 0 _._ 929 _±_ 1 _._ 224e _−_ 3 0 _._ 774 _±_ 1 _._ 572e _−_ 3 0 _._ 936 _±_ 2 _._ 818e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 761 _±_ 1 _._ 293e _−_ 3 0 _._ 937 _±_ 3 _._ 918e _−_ 3 0 _._ 777 _±_ 1 _._ 703e _−_ 3 0 _._ 935 _±_ 1 _._ 565e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 736 _±_ 2 _._ 042e _−_ 3 0 _._ 968 _±_ 2 _._ 401e _−_ 3 0 _._ 766 _±_ 7 _._ 831e _−_ 4 0 _._ 929 _±_ 1 _._ 971e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 753 _±_ 4 _._ 107e _−_ 3 0 _._ 947 _±_ 6 _._ 716e _−_ 3 0 _._ 773 _±_ 8 _._ 622e _−_ 4 0 _._ 933 _±_ 1 _._ 654e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 749 _±_ 2 _._ 683e _−_ 3 0 _._ 954 _±_ 5 _._ 802e _−_ 3 0 _._ 781 _±_ 2 _._ 21e _−_ 3 0 _._ 938 _±_ 7 _._ 867e _−_ 4
gemini-2.0-flash ICD mlp 0 _._ 749 _±_ 3 _._ 572e _−_ 3 0 _._ 956 _±_ 2 _._ 767e _−_ 3 0 _._ 781 _±_ 2 _._ 93e _−_ 3 0 _._ 939 _±_ 4 _._ 633e _−_ 3
gemini-2.0-flash ICD patchtsmixer 0 _._ 749 _±_ 5 _._ 385e _−_ 3 0 _._ 959 _±_ 4 _._ 889e _−_ 3 0 _._ 779 _±_ 2 _._ 487e _−_ 3 0 _._ 94 _±_ 4 _._ 035e _−_ 3
gemini-2.0-flash ICD timemixer 0 _._ 757 _±_ 1 _._ 928e _−_ 3 0 _._ 949 _±_ 3 _._ 16e _−_ 3 0 _._ 78 _±_ 2 _._ 748e _−_ 3 0 _._ 94 _±_ 4 _._ 242e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 781 _±_ 4 _._ 03e _−_ 3 0 _._ 928 _±_ 5 _._ 388e _−_ 3 0 _._ 783 _±_ 6 _._ 712e _−_ 4 0 _._ 93 _±_ 1 _._ 714e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 777 _±_ 2 _._ 635e _−_ 3 0 _._ 931 _±_ 4 _._ 03e _−_ 3 0 _._ 784 _±_ 4 _._ 19e _−_ 3 0 _._ 933 _±_ 2 _._ 811e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 759 _±_ 5 _._ 442e _−_ 3 0 _._ 925 _±_ 6 _._ 722e _−_ 3 0 _._ 774 _±_ 2 _._ 541e _−_ 3 0 _._ 923 _±_ 2 _._ 473e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 774 _±_ 3 _._ 092e _−_ 3 0 _._ 934 _±_ 3 _._ 535e _−_ 3 0 _._ 783 _±_ 9 _._ 199e _−_ 4 0 _._ 928 _±_ 6 _._ 544e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 786 _±_ 1 _._ 8e _−_ 3 0 _._ 935 _±_ 4 _._ 027e _−_ 3 0 _._ 785 _±_ 2 _._ 572e _−_ 3 0 _._ 941 _±_ 4 _._ 679e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 785 _±_ 2 _._ 353e _−_ 3 0 _._ 935 _±_ 4 _._ 557e _−_ 3 0 _._ 787 _±_ 1 _._ 862e _−_ 3 0 _._ 94 _±_ 3 _._ 453e _−_ 3
gemini-2.0-flash Trend patchtsmixer 0 _._ 783 _±_ 2 _._ 399e _−_ 3 0 _._ 939 _±_ 5 _._ 041e _−_ 3 0 _._ 786 _±_ 1 _._ 849e _−_ 3 0 _._ 943 _±_ 3 _._ 641e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 788 _±_ 1 _._ 085e _−_ 3 0 _._ 941 _±_ 2 _._ 566e _−_ 3 0 _._ 787 _±_ 2 _._ 902e _−_ 3 0 _._ 941 _±_ 1 _._ 593e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 805 _±_ 4 _._ 417e _−_ 4 0 _._ 934 _±_ 2 _._ 364e _−_ 3 0 _._ 803 _±_ 8 _._ 592e _−_ 4 0 _._ 931 _±_ 1 _._ 903e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 802 _±_ 1 _._ 462e _−_ 3 0 _._ 937 _±_ 3 _._ 03e _−_ 3 0 _._ 805 _±_ 1 _._ 826e _−_ 3 0 _._ 935 _±_ 1 _._ 732e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 777 _±_ 4 _._ 705e _−_ 3 0 _._ 917 _±_ 4 _._ 439e _−_ 3 0 _._ 791 _±_ 2 _._ 184e _−_ 3 0 _._ 924 _±_ 1 _._ 232e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 792 _±_ 3 _._ 123e _−_ 3 0 _._ 927 _±_ 2 _._ 555e _−_ 3 0 _._ 801 _±_ 1 _._ 244e _−_ 3 0 _._ 929 _±_ 1 _._ 953e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 808 _±_ 1 _._ 19e _−_ 3 0 _._ 946 _±_ 1 _._ 719e _−_ 3 0 _._ 808 _±_ 1 _._ 656e _−_ 3 0 _._ 936 _±_ 2 _._ 038e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 807 _±_ 8 _._ 551e _−_ 4 0 _._ 941 _±_ 2 _._ 503e _−_ 3 0 _._ 808 _±_ 1 _._ 284e _−_ 3 0 _._ 935 _±_ 3 _._ 185e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 804 _±_ 1 _._ 035e _−_ 3 0 _._ 941 _±_ 3 _._ 829e _−_ 3 0 _._ 806 _±_ 1 _._ 31e _−_ 3 0 _._ 936 _±_ 3 _._ 405e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 808 _±_ 4 _._ 102e _−_ 4 0 _._ 947 _±_ 3 _._ 22e _−_ 3 0 _._ 808 _±_ 5 _._ 868e _−_ 4 0 _._ 938 _±_ 2 _._ 419e _−_ 3
interp lstm 0 _._ 742 _±_ 7 _._ 07e _−_ 3 0 _._ 87 _±_ 5 _._ 803e _−_ 2 0 _._ 516 _±_ 1 _._ 005e _−_ 2 0 _._ 4 _±_ 1 _._ 348e _−_ 2
interp mlp 0 _._ 723 _±_ 5 _._ 267e _−_ 3 0 _._ 834 _±_ 3 _._ 155e _−_ 2 0 _._ 621 _±_ 1 _._ 595e _−_ 2 0 _._ 554 _±_ 2 _._ 712e _−_ 2
interp patchtsmixer 0 _._ 461 _±_ 3 _._ 294e _−_ 2 0 _._ 345 _±_ 3 _._ 335e _−_ 2 0 _._ 325 _±_ 3 _._ 759e _−_ 2 0 _._ 213 _±_ 3 _._ 304e _−_ 2
interp timemixer 0 _._ 646 _±_ 1 _._ 65e _−_ 2 0 _._ 609 _±_ 3 _._ 489e _−_ 2 0 _._ 343 _±_ 1 _._ 279e _−_ 2 0 _._ 227 _±_ 1 _._ 028e _−_ 2
mean lstm 0 _._ 669 _±_ 9 _._ 804e _−_ 3 0 _._ 629 _±_ 1 _._ 499e _−_ 2 0 _._ 682 _±_ 2 _._ 045e _−_ 2 0 _._ 663 _±_ 4 _._ 92e _−_ 2
mean mlp 0 _._ 711 _±_ 8 _._ 323e _−_ 3 0 _._ 712 _±_ 2 _._ 228e _−_ 2 0 _._ 662 _±_ 7 _._ 924e _−_ 4 0 _._ 621 _±_ 1 _._ 92e _−_ 3
mean patchtsmixer 0 _._ 511 _±_ 5 _._ 235e _−_ 2 0 _._ 422 _±_ 7 _._ 283e _−_ 2 0 _._ 424 _±_ 3 _._ 362e _−_ 2 0 _._ 303 _±_ 3 _._ 908e _−_ 2
mean timemixer 0 _._ 7 _±_ 4 _._ 65e _−_ 3 0 _._ 719 _±_ 1 _._ 265e _−_ 2 0 _._ 497 _±_ 7 _._ 052e _−_ 3 0 _._ 384 _±_ 1 _._ 168e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 831 _±_ 8 _._ 552e _−_ 4 0 _._ 953 _±_ 2 _._ 666e _−_ 3 0 _._ 8 _±_ 4 _._ 439e _−_ 3 0 _._ 91 _±_ 8 _._ 198e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 808 _±_ 0e0 0 _._ 93 _±_ 0e0 0 _._ 779 _±_ 0e0 0 _._ 922 _±_ 0e0
No ~~s~~ um ~~C~~ oT lstm 0 _._ 839 _±_ 1 _._ 693e _−_ 3 0 _._ 961 _±_ 2 _._ 933e _−_ 3 0 _._ 819 _±_ 1 _._ 368e _−_ 3 0 _._ 946 _±_ 2 _._ 732e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 837 _±_ 3 _._ 725e _−_ 4 0 _._ 957 _±_ 4 _._ 288e _−_ 3 0 _._ 819 _±_ 2 _._ 082e _−_ 3 0 _._ 946 _±_ 4 _._ 004e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 836 _±_ 1 _._ 488e _−_ 3 0 _._ 963 _±_ 1 _._ 443e _−_ 3 0 _._ 818 _±_ 6 _._ 36e _−_ 4 0 _._ 944 _±_ 3 _._ 774e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 837 _±_ 1 _._ 145e _−_ 3 0 _._ 966 _±_ 2 _._ 013e _−_ 3 0 _._ 824 _±_ 3 _._ 503e _−_ 3 0 _._ 949 _±_ 2 _._ 709e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 828 _±_ 1 _._ 955e _−_ 3 0 _._ 947 _±_ 3 _._ 566e _−_ 3 0 _._ 801 _±_ 4 _._ 128e _−_ 3 0 _._ 916 _±_ 1 _._ 229e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 81 _±_ 0e0 0 _._ 931 _±_ 0e0 0 _._ 781 _±_ 0e0 0 _._ 924 _±_ 0e0
No ~~s~~ um ~~I~~ CD lstm 0 _._ 836 _±_ 5 _._ 28e _−_ 4 0 _._ 963 _±_ 4 _._ 649e _−_ 3 0 _._ 82 _±_ 1 _._ 416e _−_ 3 0 _._ 95 _±_ 2 _._ 91e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 836 _±_ 9 _._ 8e _−_ 4 0 _._ 963 _±_ 2 _._ 615e _−_ 3 0 _._ 817 _±_ 1 _._ 021e _−_ 3 0 _._ 944 _±_ 2 _._ 966e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 836 _±_ 1 _._ 277e _−_ 3 0 _._ 965 _±_ 1 _._ 212e _−_ 3 0 _._ 818 _±_ 1 _._ 81e _−_ 3 0 _._ 946 _±_ 2 _._ 933e _−_ 3
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 836 _±_ 1 _._ 503e _−_ 3 0 _._ 971 _±_ 9 _._ 228e _−_ 4 0 _._ 825 _±_ 2 _._ 262e _−_ 3 0 _._ 954 _±_ 2 _._ 281e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 83 _±_ 3 _._ 097e _−_ 3 0 _._ 952 _±_ 5 _._ 162e _−_ 3 0 _._ 805 _±_ 6 _._ 704e _−_ 3 0 _._ 929 _±_ 2 _._ 766e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 806 _±_ 0e0 0 _._ 925 _±_ 0e0 0 _._ 781 _±_ 0e0 0 _._ 925 _±_ 0e0
No ~~s~~ um ~~T~~ rend lstm 0 _._ 836 _±_ 2e _−_ 3 0 _._ 961 _±_ 4 _._ 458e _−_ 3 0 _._ 823 _±_ 1 _._ 1e _−_ 3 0 _._ 948 _±_ 2 _._ 113e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 833 _±_ 8 _._ 873e _−_ 4 0 _._ 953 _±_ 3 _._ 464e _−_ 3 0 _._ 821 _±_ 3 _._ 409e _−_ 3 0 _._ 945 _±_ 2 _._ 64e _−_ 3
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 836 _±_ 1 _._ 59e _−_ 3 0 _._ 962 _±_ 2 _._ 871e _−_ 3 0 _._ 82 _±_ 1 _._ 466e _−_ 3 0 _._ 944 _±_ 3 _._ 025e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 836 _±_ 1 _._ 247e _−_ 3 0 _._ 97 _±_ 1 _._ 808e _−_ 3 0 _._ 826 _±_ 1 _._ 335e _−_ 3 0 _._ 949 _±_ 2 _._ 029e _−_ 3
medgemma CoT +TFM lstm 0 _._ 791 _±_ 4 _._ 491e _−_ 4 0 _._ 912 _±_ 1 _._ 675e _−_ 3 0 _._ 796 _±_ 1 _._ 672e _−_ 3 0 _._ 908 _±_ 9 _._ 96e _−_ 4
medgemma CoT +TFM mlp 0 _._ 79 _±_ 1 _._ 493e _−_ 3 0 _._ 909 _±_ 5 _._ 324e _−_ 3 0 _._ 798 _±_ 2 _._ 988e _−_ 3 0 _._ 911 _±_ 7 _._ 002e _−_ 3


Table 28: Cross-site transfer results - Drug. (part 1/2)


44


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**f1** **micro** **recall** **micro** **f1** ~~**m**~~ **icro** **recall** **micro**


medgemma CoT +TFM patchtsmixer 0 _._ 772 _±_ 2 _._ 573e _−_ 3 0 _._ 907 _±_ 3 _._ 85e _−_ 3 0 _._ 784 _±_ 9 _._ 672e _−_ 4 0 _._ 916 _±_ 9 _._ 366e _−_ 4
medgemma CoT +TFM timemixer 0 _._ 783 _±_ 1 _._ 245e _−_ 3 0 _._ 912 _±_ 4 _._ 037e _−_ 3 0 _._ 793 _±_ 2 _._ 516e _−_ 4 0 _._ 91 _±_ 2 _._ 613e _−_ 3
medgemma CoT lstm 0 _._ 788 _±_ 2 _._ 26e _−_ 3 0 _._ 924 _±_ 1 _._ 781e _−_ 3 0 _._ 797 _±_ 6 _._ 506e _−_ 4 0 _._ 923 _±_ 5 _._ 205e _−_ 3
medgemma CoT mlp 0 _._ 79 _±_ 6 _._ 558e _−_ 4 0 _._ 924 _±_ 3 _._ 799e _−_ 3 0 _._ 795 _±_ 6 _._ 553e _−_ 4 0 _._ 926 _±_ 7 _._ 525e _−_ 4
medgemma CoT patchtsmixer 0 _._ 791 _±_ 1 _._ 586e _−_ 3 0 _._ 922 _±_ 8 _._ 402e _−_ 4 0 _._ 793 _±_ 1 _._ 714e _−_ 3 0 _._ 924 _±_ 3 _._ 783e _−_ 3
medgemma CoT timemixer 0 _._ 796 _±_ 1 _._ 224e _−_ 3 0 _._ 926 _±_ 6 _._ 978e _−_ 4 0 _._ 795 _±_ 1 _._ 366e _−_ 3 0 _._ 927 _±_ 5 _._ 454e _−_ 3
medgemma ICD +TFM lstm 0 _._ 803 _±_ 1 _._ 08e _−_ 3 0 _._ 936 _±_ 1 _._ 261e _−_ 3 0 _._ 805 _±_ 1 _._ 541e _−_ 3 0 _._ 927 _±_ 2 _._ 397e _−_ 3
medgemma ICD +TFM mlp 0 _._ 803 _±_ 2 _._ 028e _−_ 3 0 _._ 94 _±_ 3 _._ 247e _−_ 3 0 _._ 809 _±_ 6 _._ 264e _−_ 4 0 _._ 937 _±_ 3 _._ 902e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 781 _±_ 6 _._ 616e _−_ 4 0 _._ 919 _±_ 1 _._ 42e _−_ 3 0 _._ 794 _±_ 2 _._ 607e _−_ 3 0 _._ 919 _±_ 5 _._ 06e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 792 _±_ 6 _._ 278e _−_ 3 0 _._ 927 _±_ 7 _._ 214e _−_ 3 0 _._ 803 _±_ 1 _._ 484e _−_ 3 0 _._ 928 _±_ 2 _._ 035e _−_ 3
medgemma ICD lstm 0 _._ 805 _±_ 1 _._ 005e _−_ 3 0 _._ 94 _±_ 1 _._ 491e _−_ 3 0 _._ 808 _±_ 8 _._ 141e _−_ 4 0 _._ 94 _±_ 1 _._ 442e _−_ 3
medgemma ICD mlp 0 _._ 805 _±_ 7 _._ 957e _−_ 4 0 _._ 941 _±_ 2 _._ 369e _−_ 3 0 _._ 808 _±_ 8 _._ 444e _−_ 4 0 _._ 938 _±_ 1 _._ 166e _−_ 3
medgemma ICD patchtsmixer 0 _._ 803 _±_ 8 _._ 531e _−_ 4 0 _._ 939 _±_ 3 _._ 272e _−_ 3 0 _._ 805 _±_ 4 _._ 692e _−_ 4 0 _._ 94 _±_ 3 _._ 634e _−_ 3
medgemma ICD timemixer 0 _._ 806 _±_ 7 _._ 406e _−_ 4 0 _._ 943 _±_ 3 _._ 666e _−_ 3 0 _._ 808 _±_ 2 _._ 176e _−_ 4 0 _._ 94 _±_ 8 _._ 943e _−_ 4
medgemma Trend +TFM lstm 0 _._ 772 _±_ 9 _._ 801e _−_ 4 0 _._ 94 _±_ 1 _._ 071e _−_ 3 0 _._ 779 _±_ 2 _._ 408e _−_ 3 0 _._ 928 _±_ 2 _._ 555e _−_ 3
medgemma Trend +TFM mlp 0 _._ 768 _±_ 4 _._ 294e _−_ 3 0 _._ 945 _±_ 3 _._ 258e _−_ 3 0 _._ 781 _±_ 1 _._ 895e _−_ 3 0 _._ 934 _±_ 1 _._ 827e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 75 _±_ 6 _._ 952e _−_ 4 0 _._ 943 _±_ 4 _._ 219e _−_ 3 0 _._ 769 _±_ 1 _._ 597e _−_ 3 0 _._ 927 _±_ 8 _._ 167e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 764 _±_ 2 _._ 796e _−_ 3 0 _._ 94 _±_ 5 _._ 22e _−_ 3 0 _._ 776 _±_ 1 _._ 255e _−_ 3 0 _._ 934 _±_ 2 _._ 515e _−_ 3
medgemma Trend lstm 0 _._ 775 _±_ 2 _._ 571e _−_ 3 0 _._ 945 _±_ 4 _._ 016e _−_ 3 0 _._ 782 _±_ 1 _._ 714e _−_ 3 0 _._ 94 _±_ 3 _._ 073e _−_ 3
medgemma Trend mlp 0 _._ 777 _±_ 2 _._ 475e _−_ 3 0 _._ 944 _±_ 4 _._ 09e _−_ 3 0 _._ 782 _±_ 2 _._ 611e _−_ 3 0 _._ 941 _±_ 2 _._ 659e _−_ 3
medgemma Trend patchtsmixer 0 _._ 774 _±_ 3 _._ 23e _−_ 3 0 _._ 945 _±_ 1 _._ 613e _−_ 3 0 _._ 78 _±_ 2 _._ 85e _−_ 3 0 _._ 94 _±_ 3 _._ 268e _−_ 3
medgemma Trend timemixer 0 _._ 777 _±_ 3 _._ 206e _−_ 3 0 _._ 948 _±_ 3 _._ 016e _−_ 3 0 _._ 782 _±_ 2 _._ 468e _−_ 3 0 _._ 942 _±_ 4 _._ 638e _−_ 3
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 805 _±_ 1 _._ 895e _−_ 3 0 _._ 922 _±_ 1 _._ 735e _−_ 3 0 _._ 807 _±_ 4 _._ 661e _−_ 4 0 _._ 924 _±_ 3 _._ 651e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 804 _±_ 9 _._ 958e _−_ 4 0 _._ 929 _±_ 1 _._ 815e _−_ 3 0 _._ 807 _±_ 6 _._ 479e _−_ 4 0 _._ 929 _±_ 3 _._ 858e _−_ 3
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 785 _±_ 1 _._ 413e _−_ 3 0 _._ 914 _±_ 4 _._ 07e _−_ 3 0 _._ 794 _±_ 2 _._ 091e _−_ 3 0 _._ 917 _±_ 3 _._ 716e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 792 _±_ 8 _._ 399e _−_ 3 0 _._ 918 _±_ 5 _._ 264e _−_ 3 0 _._ 803 _±_ 2 _._ 323e _−_ 3 0 _._ 919 _±_ 1 _._ 728e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 805 _±_ 9 _._ 658e _−_ 4 0 _._ 927 _±_ 2 _._ 208e _−_ 3 0 _._ 807 _±_ 7 _._ 651e _−_ 4 0 _._ 927 _±_ 1 _._ 444e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 807 _±_ 7 _._ 138e _−_ 4 0 _._ 931 _±_ 2 _._ 173e _−_ 3 0 _._ 807 _±_ 9 _._ 693e _−_ 4 0 _._ 926 _±_ 1 _._ 236e _−_ 3
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 805 _±_ 1 _._ 884e _−_ 4 0 _._ 931 _±_ 2 _._ 154e _−_ 3 0 _._ 804 _±_ 2 _._ 671e _−_ 3 0 _._ 926 _±_ 8 _._ 539e _−_ 4
medgemma zero ~~s~~ hot timemixer 0 _._ 809 _±_ 7 _._ 505e _−_ 4 0 _._ 935 _±_ 1 _._ 256e _−_ 3 0 _._ 805 _±_ 1 _._ 626e _−_ 3 0 _._ 928 _±_ 3 _._ 542e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM lstm 0 _._ 83 _±_ 2 _._ 291e _−_ 3 0 _._ 953 _±_ 3 _._ 83e _−_ 3 0 _._ 789 _±_ 2 _._ 903e _−_ 3 0 _._ 909 _±_ 7 _._ 136e _−_ 4
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 812 _±_ 0e0 0 _._ 933 _±_ 0e0 0 _._ 773 _±_ 0e0 0 _._ 918 _±_ 0e0
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 829 _±_ 1 _._ 474e _−_ 3 0 _._ 955 _±_ 2 _._ 431e _−_ 3 0 _._ 813 _±_ 2 _._ 133e _−_ 3 0 _._ 943 _±_ 3 _._ 385e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 829 _±_ 7 _._ 801e _−_ 4 0 _._ 952 _±_ 1 _._ 673e _−_ 3 0 _._ 814 _±_ 2 _._ 352e _−_ 3 0 _._ 943 _±_ 1 _._ 866e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 832 _±_ 1 _._ 151e _−_ 3 0 _._ 958 _±_ 3 _._ 689e _−_ 3 0 _._ 816 _±_ 1 _._ 81e _−_ 3 0 _._ 945 _±_ 3 _._ 023e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 835 _±_ 1 _._ 135e _−_ 3 0 _._ 966 _±_ 2 _._ 589e _−_ 3 0 _._ 821 _±_ 2 _._ 119e _−_ 3 0 _._ 947 _±_ 4 _._ 018e _−_ 3
right lstm 0 _._ 725 _±_ 2 _._ 011e _−_ 2 0 _._ 769 _±_ 9 _._ 362e _−_ 2 0 _._ 526 _±_ 1 _._ 089e _−_ 2 0 _._ 41 _±_ 1 _._ 39e _−_ 2
right mlp 0 _._ 739 _±_ 8 _._ 853e _−_ 4 0 _._ 882 _±_ 9 _._ 386e _−_ 3 0 _._ 601 _±_ 6 _._ 53e _−_ 3 0 _._ 517 _±_ 8 _._ 03e _−_ 3
right patchtsmixer 0 _._ 578 _±_ 2 _._ 89e _−_ 2 0 _._ 529 _±_ 5 _._ 019e _−_ 2 0 _._ 346 _±_ 2 _._ 33e _−_ 2 0 _._ 234 _±_ 2 _._ 131e _−_ 2
right timemixer 0 _._ 685 _±_ 9 _._ 987e _−_ 3 0 _._ 722 _±_ 5 _._ 086e _−_ 2 0 _._ 37 _±_ 5 _._ 214e _−_ 2 0 _._ 256 _±_ 4 _._ 913e _−_ 2


Table 29: Cross-site transfer results - Drug. (part 2/2)


45


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro**


Llama-3.1 CoT +TFM lstm 0 _._ 872 _±_ 2 _._ 001e _−_ 3 0 _._ 92 _±_ 8 _._ 798e _−_ 4 0 _._ 895 _±_ 2 _._ 53e _−_ 3 0 _._ 936 _±_ 1 _._ 722e _−_ 3 0 _._ 847 _±_ 7 _._ 912e _−_ 4 0 _._ 917 _±_ 6 _._ 809e _−_ 4
Llama-3.1 CoT +TFM mlp 0 _._ 881 _±_ 2 _._ 75e _−_ 3 0 _._ 926 _±_ 8 _._ 832e _−_ 4 0 _._ 903 _±_ 1 _._ 691e _−_ 3 0 _._ 94 _±_ 4 _._ 133e _−_ 4 0 _._ 857 _±_ 1 _._ 235e _−_ 3 0 _._ 925 _±_ 6 _._ 144e _−_ 4
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 857 _±_ 6 _._ 165e _−_ 3 0 _._ 919 _±_ 5 _._ 505e _−_ 4 0 _._ 892 _±_ 1 _._ 797e _−_ 3 0 _._ 938 _±_ 2 _._ 665e _−_ 4 0 _._ 839 _±_ 7 _._ 46e _−_ 3 0 _._ 922 _±_ 1 _._ 361e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 856 _±_ 6 _._ 02e _−_ 3 0 _._ 923 _±_ 1 _._ 165e _−_ 3 0 _._ 87 _±_ 1 _._ 593e _−_ 3 0 _._ 935 _±_ 8 _._ 472e _−_ 4 0 _._ 811 _±_ 3 _._ 494e _−_ 3 0 _._ 928 _±_ 1 _._ 361e _−_ 3
Llama-3.1 CoT lstm 0 _._ 846 _±_ 0e0 0 _._ 928 _±_ 0e0 0 _._ 881 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 831 _±_ 0e0 0 _._ 931 _±_ 0e0
Llama-3.1 CoT mlp 0 _._ 863 _±_ 0e0 0 _._ 925 _±_ 0e0 0 _._ 89 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 847 _±_ 0e0 0 _._ 924 _±_ 0e0
Llama-3.1 CoT patchtsmixer 0 _._ 845 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 883 _±_ 0e0 0 _._ 947 _±_ 0e0 0 _._ 838 _±_ 0e0 0 _._ 93 _±_ 0e0
Llama-3.1 CoT timemixer 0 _._ 844 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 873 _±_ 0e0 0 _._ 948 _±_ 0e0 0 _._ 826 _±_ 0e0 0 _._ 935 _±_ 0e0
Llama-3.1 ICD +TFM lstm 0 _._ 873 _±_ 2 _._ 458e _−_ 4 0 _._ 922 _±_ 1 _._ 169e _−_ 3 0 _._ 889 _±_ 2 _._ 848e _−_ 3 0 _._ 936 _±_ 1 _._ 269e _−_ 3 0 _._ 83 _±_ 2 _._ 191e _−_ 3 0 _._ 919 _±_ 1 _._ 804e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 877 _±_ 2 _._ 737e _−_ 3 0 _._ 926 _±_ 7 _._ 136e _−_ 4 0 _._ 899 _±_ 2 _._ 145e _−_ 3 0 _._ 94 _±_ 9 _._ 086e _−_ 4 0 _._ 848 _±_ 4 _._ 533e _−_ 3 0 _._ 923 _±_ 7 _._ 047e _−_ 4
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 858 _±_ 4 _._ 406e _−_ 3 0 _._ 92 _±_ 1 _._ 552e _−_ 3 0 _._ 886 _±_ 1 _._ 498e _−_ 3 0 _._ 939 _±_ 1 _._ 021e _−_ 3 0 _._ 822 _±_ 1 _._ 137e _−_ 3 0 _._ 925 _±_ 1 _._ 746e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 851 _±_ 4 _._ 439e _−_ 3 0 _._ 923 _±_ 9 _._ 093e _−_ 4 0 _._ 861 _±_ 2 _._ 613e _−_ 3 0 _._ 936 _±_ 1 _._ 537e _−_ 4 0 _._ 811 _±_ 6 _._ 069e _−_ 3 0 _._ 93 _±_ 7 _._ 52e _−_ 4
Llama-3.1 ICD lstm 0 _._ 841 _±_ 0e0 0 _._ 931 _±_ 0e0 0 _._ 872 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 811 _±_ 0e0 0 _._ 936 _±_ 0e0
Llama-3.1 ICD mlp 0 _._ 856 _±_ 0e0 0 _._ 924 _±_ 0e0 0 _._ 881 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 826 _±_ 0e0 0 _._ 93 _±_ 0e0
Llama-3.1 ICD patchtsmixer 0 _._ 841 _±_ 0e0 0 _._ 925 _±_ 0e0 0 _._ 875 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 816 _±_ 0e0 0 _._ 936 _±_ 0e0
Llama-3.1 ICD timemixer 0 _._ 837 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 863 _±_ 0e0 0 _._ 943 _±_ 0e0 0 _._ 805 _±_ 0e0 0 _._ 942 _±_ 0e0
Llama-3.1 Trend +TFM lstm 0 _._ 878 _±_ 3 _._ 433e _−_ 3 0 _._ 922 _±_ 1 _._ 257e _−_ 3 0 _._ 896 _±_ 6 _._ 165e _−_ 4 0 _._ 937 _±_ 6 _._ 24e _−_ 4 0 _._ 845 _±_ 2 _._ 67e _−_ 3 0 _._ 914 _±_ 8 _._ 072e _−_ 4
Llama-3.1 Trend +TFM mlp 0 _._ 88 _±_ 1 _._ 597e _−_ 3 0 _._ 925 _±_ 6 _._ 38e _−_ 4 0 _._ 9 _±_ 1 _._ 567e _−_ 3 0 _._ 941 _±_ 7 _._ 65e _−_ 4 0 _._ 858 _±_ 1 _._ 94e _−_ 3 0 _._ 922 _±_ 3 _._ 614e _−_ 4
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 844 _±_ 2 _._ 049e _−_ 2 0 _._ 92 _±_ 2 _._ 313e _−_ 3 0 _._ 893 _±_ 2 _._ 192e _−_ 3 0 _._ 939 _±_ 1 _._ 601e _−_ 4 0 _._ 845 _±_ 6 _._ 878e _−_ 3 0 _._ 918 _±_ 6 _._ 352e _−_ 4
Llama-3.1 Trend +TFM timemixer 0 _._ 848 _±_ 2 _._ 145e _−_ 2 0 _._ 929 _±_ 1 _._ 162e _−_ 2 0 _._ 875 _±_ 4 _._ 022e _−_ 3 0 _._ 937 _±_ 2 _._ 89e _−_ 3 0 _._ 819 _±_ 1 _._ 003e _−_ 2 0 _._ 926 _±_ 1 _._ 526e _−_ 3
Llama-3.1 Trend lstm 0 _._ 844 _±_ 0e0 0 _._ 928 _±_ 0e0 0 _._ 88 _±_ 0e0 0 _._ 943 _±_ 0e0 0 _._ 824 _±_ 0e0 0 _._ 932 _±_ 0e0
Llama-3.1 Trend mlp 0 _._ 861 _±_ 0e0 0 _._ 926 _±_ 0e0 0 _._ 892 _±_ 0e0 0 _._ 941 _±_ 0e0 0 _._ 847 _±_ 0e0 0 _._ 923 _±_ 0e0
Llama-3.1 Trend patchtsmixer 0 _._ 845 _±_ 0e0 0 _._ 924 _±_ 0e0 0 _._ 886 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 838 _±_ 0e0 0 _._ 929 _±_ 0e0
Llama-3.1 Trend timemixer 0 _._ 841 _±_ 0e0 0 _._ 922 _±_ 0e0 0 _._ 875 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 8 _±_ 0e0 0 _._ 94 _±_ 0e0
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 883 _±_ 2 _._ 982e _−_ 3 0 _._ 924 _±_ 7 _._ 996e _−_ 4 0 _._ 895 _±_ 1 _._ 667e _−_ 3 0 _._ 938 _±_ 1 _._ 127e _−_ 3 0 _._ 849 _±_ 1 _._ 869e _−_ 3 0 _._ 919 _±_ 1 _._ 553e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 881 _±_ 1 _._ 58e _−_ 3 0 _._ 928 _±_ 7 _._ 543e _−_ 4 0 _._ 904 _±_ 7 _._ 637e _−_ 4 0 _._ 941 _±_ 3 _._ 35e _−_ 4 0 _._ 859 _±_ 2 _._ 73e _−_ 3 0 _._ 927 _±_ 7 _._ 239e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 861 _±_ 2 _._ 916e _−_ 3 0 _._ 922 _±_ 2 _._ 016e _−_ 3 0 _._ 891 _±_ 9 _._ 815e _−_ 4 0 _._ 94 _±_ 7 _._ 253e _−_ 4 0 _._ 842 _±_ 1 _._ 746e _−_ 3 0 _._ 921 _±_ 1 _._ 172e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 863 _±_ 1 _._ 131e _−_ 3 0 _._ 923 _±_ 7 _._ 984e _−_ 4 0 _._ 881 _±_ 2 _._ 739e _−_ 3 0 _._ 939 _±_ 7 _._ 721e _−_ 4 0 _._ 816 _±_ 8 _._ 775e _−_ 3 0 _._ 929 _±_ 1 _._ 99e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 854 _±_ 0e0 0 _._ 929 _±_ 0e0 0 _._ 883 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 839 _±_ 0e0 0 _._ 931 _±_ 0e0
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 867 _±_ 0e0 0 _._ 929 _±_ 0e0 0 _._ 891 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 847 _±_ 0e0 0 _._ 931 _±_ 0e0
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 856 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 884 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 841 _±_ 0e0 0 _._ 933 _±_ 0e0
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 852 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 875 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 826 _±_ 0e0 0 _._ 936 _±_ 0e0
TFM lstm 0 _._ 85 _±_ 8 _._ 96e _−_ 4 0 _._ 924 _±_ 1 _._ 793e _−_ 3 0 _._ 877 _±_ 1 _._ 198e _−_ 3 0 _._ 939 _±_ 9 _._ 594e _−_ 4 0 _._ 83 _±_ 2 _._ 181e _−_ 3 0 _._ 923 _±_ 2 _._ 089e _−_ 3
TFM mlp 0 _._ 852 _±_ 1 _._ 475e _−_ 3 0 _._ 924 _±_ 1 _._ 063e _−_ 3 0 _._ 879 _±_ 8 _._ 396e _−_ 4 0 _._ 937 _±_ 1 _._ 356e _−_ 3 0 _._ 831 _±_ 1 _._ 002e _−_ 3 0 _._ 925 _±_ 7 _._ 676e _−_ 4
TFM patchtsmixer 0 _._ 842 _±_ 2 _._ 252e _−_ 3 0 _._ 925 _±_ 2 _._ 263e _−_ 3 0 _._ 869 _±_ 2 _._ 4e _−_ 3 0 _._ 94 _±_ 1 _._ 253e _−_ 3 0 _._ 82 _±_ 5 _._ 108e _−_ 3 0 _._ 925 _±_ 1 _._ 576e _−_ 3
TFM timemixer 0 _._ 834 _±_ 1 _._ 109e _−_ 2 0 _._ 927 _±_ 3 _._ 234e _−_ 3 0 _._ 857 _±_ 7 _._ 105e _−_ 3 0 _._ 941 _±_ 2 _._ 644e _−_ 3 0 _._ 808 _±_ 4 _._ 268e _−_ 3 0 _._ 933 _±_ 1 _._ 69e _−_ 3
TSDE lstm 0 _._ 869 _±_ 1 _._ 638e _−_ 3 0 _._ 924 _±_ 2 _._ 297e _−_ 3 0 _._ 902 _±_ 4 _._ 602e _−_ 4 0 _._ 94 _±_ 3 _._ 792e _−_ 4 0 _._ 857 _±_ 2 _._ 576e _−_ 3 0 _._ 924 _±_ 2 _._ 547e _−_ 3
TSDE mlp 0 _._ 875 _±_ 4 _._ 566e _−_ 4 0 _._ 928 _±_ 5 _._ 67e _−_ 4 0 _._ 908 _±_ 1 _._ 662e _−_ 4 0 _._ 941 _±_ 1 _._ 076e _−_ 3 0 _._ 874 _±_ 1 _._ 086e _−_ 3 0 _._ 93 _±_ 5 _._ 558e _−_ 4
TSDE patchtsmixer 0 _._ 741 _±_ 5e _−_ 6 0 _._ 902 _±_ 6 _._ 5e _−_ 5 0 _._ 763 _±_ 1 _._ 915e _−_ 3 0 _._ 899 _±_ 2 _._ 885e _−_ 3 0 _._ 733 _±_ 5e _−_ 6 0 _._ 870 _±_ 0e0
TSDE timemixer 0 _._ 744 _±_ 3 _._ 397e _−_ 3 0 _._ 913 _±_ 1 _._ 622e _−_ 3 0 _._ 763 _±_ 3 _._ 499e _−_ 4 0 _._ 919 _±_ 1 _._ 35e _−_ 4 0 _._ 734 _±_ 7 _._ 172e _−_ 4 0 _._ 939 _±_ 3 _._ 318e _−_ 3
gemini-2.0-flash CoT +TFM lstm 0 _._ 88 _±_ 2 _._ 886e _−_ 3 0 _._ 924 _±_ 8 _._ 207e _−_ 4 0 _._ 903 _±_ 1 _._ 52e _−_ 3 0 _._ 935 _±_ 1 _._ 495e _−_ 3 0 _._ 85 _±_ 2 _._ 026e _−_ 3 0 _._ 913 _±_ 1 _._ 696e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 886 _±_ 2 _._ 639e _−_ 3 0 _._ 928 _±_ 5 _._ 889e _−_ 4 0 _._ 906 _±_ 9 _._ 991e _−_ 4 0 _._ 941 _±_ 3 _._ 564e _−_ 4 0 _._ 861 _±_ 1 _._ 612e _−_ 3 0 _._ 921 _±_ 7 _._ 276e _−_ 4
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 864 _±_ 1 _._ 437e _−_ 3 0 _._ 919 _±_ 8 _._ 718e _−_ 4 0 _._ 897 _±_ 9 _._ 968e _−_ 4 0 _._ 94 _±_ 9 _._ 819e _−_ 4 0 _._ 84 _±_ 1 _._ 2e _−_ 2 0 _._ 919 _±_ 2 _._ 696e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 859 _±_ 4 _._ 816e _−_ 3 0 _._ 924 _±_ 9 _._ 548e _−_ 4 0 _._ 878 _±_ 5 _._ 403e _−_ 3 0 _._ 936 _±_ 2 _._ 136e _−_ 3 0 _._ 814 _±_ 8 _._ 623e _−_ 3 0 _._ 929 _±_ 4 _._ 58e _−_ 4
gemini-2.0-flash CoT lstm 0 _._ 854 _±_ 6 _._ 322e _−_ 3 0 _._ 923 _±_ 2 _._ 85e _−_ 3 0 _._ 893 _±_ 3 _._ 543e _−_ 3 0 _._ 944 _±_ 1 _._ 556e _−_ 3 0 _._ 84 _±_ 6 _._ 074e _−_ 3 0 _._ 923 _±_ 5 _._ 77e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 865 _±_ 0e0 0 _._ 924 _±_ 0e0 0 _._ 896 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 854 _±_ 0e0 0 _._ 921 _±_ 0e0
gemini-2.0-flash CoT patchtsmixer 0 _._ 849 _±_ 0e0 0 _._ 929 _±_ 0e0 0 _._ 891 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 845 _±_ 0e0 0 _._ 924 _±_ 0e0
gemini-2.0-flash CoT timemixer 0 _._ 844 _±_ 0e0 0 _._ 923 _±_ 0e0 0 _._ 878 _±_ 0e0 0 _._ 947 _±_ 0e0 0 _._ 828 _±_ 0e0 0 _._ 928 _±_ 0e0
gemini-2.0-flash ICD +TFM lstm 0 _._ 882 _±_ 4 _._ 025e _−_ 3 0 _._ 923 _±_ 1 _._ 314e _−_ 3 0 _._ 9 _±_ 5 _._ 27e _−_ 3 0 _._ 935 _±_ 1 _._ 442e _−_ 3 0 _._ 85 _±_ 1 _._ 027e _−_ 3 0 _._ 917 _±_ 1 _._ 417e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 88 _±_ 2 _._ 633e _−_ 3 0 _._ 926 _±_ 1 _._ 237e _−_ 3 0 _._ 905 _±_ 2 _._ 309e _−_ 3 0 _._ 941 _±_ 6 _._ 612e _−_ 4 0 _._ 859 _±_ 1 _._ 837e _−_ 3 0 _._ 923 _±_ 1 _._ 311e _−_ 4
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 831 _±_ 2 _._ 852e _−_ 2 0 _._ 923 _±_ 5 _._ 748e _−_ 3 0 _._ 894 _±_ 2 _._ 291e _−_ 3 0 _._ 94 _±_ 9 _._ 271e _−_ 4 0 _._ 844 _±_ 6 _._ 047e _−_ 3 0 _._ 92 _±_ 1 _._ 276e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 864 _±_ 2 _._ 421e _−_ 3 0 _._ 922 _±_ 4 _._ 196e _−_ 4 0 _._ 876 _±_ 4 _._ 371e _−_ 3 0 _._ 936 _±_ 7 _._ 193e _−_ 4 0 _._ 824 _±_ 3 _._ 774e _−_ 3 0 _._ 926 _±_ 1 _._ 046e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 851 _±_ 7 _._ 425e _−_ 3 0 _._ 923 _±_ 1 _._ 202e _−_ 3 0 _._ 887 _±_ 7 _._ 99e _−_ 4 0 _._ 945 _±_ 7 _._ 212e _−_ 4 0 _._ 838 _±_ 7 _._ 34e _−_ 3 0 _._ 925 _±_ 4 _._ 172e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 863 _±_ 0e0 0 _._ 924 _±_ 0e0 0 _._ 895 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 853 _±_ 0e0 0 _._ 924 _±_ 0e0
gemini-2.0-flash ICD patchtsmixer 0 _._ 847 _±_ 0e0 0 _._ 925 _±_ 0e0 0 _._ 888 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 841 _±_ 0e0 0 _._ 928 _±_ 0e0
gemini-2.0-flash ICD timemixer 0 _._ 843 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 875 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 83 _±_ 0e0 0 _._ 93 _±_ 0e0
gemini-2.0-flash Trend +TFM lstm 0 _._ 88 _±_ 1 _._ 391e _−_ 3 0 _._ 923 _±_ 1 _._ 364e _−_ 3 0 _._ 905 _±_ 2 _._ 185e _−_ 3 0 _._ 936 _±_ 9 _._ 111e _−_ 4 0 _._ 867 _±_ 3 _._ 576e _−_ 4 0 _._ 914 _±_ 1 _._ 105e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 883 _±_ 1 _._ 555e _−_ 3 0 _._ 928 _±_ 7e _−_ 5 0 _._ 909 _±_ 9 _._ 385e _−_ 4 0 _._ 94 _±_ 2 _._ 974e _−_ 4 0 _._ 875 _±_ 1 _._ 33e _−_ 3 0 _._ 925 _±_ 1 _._ 106e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 862 _±_ 5 _._ 485e _−_ 3 0 _._ 918 _±_ 1 _._ 886e _−_ 3 0 _._ 897 _±_ 1 _._ 479e _−_ 3 0 _._ 94 _±_ 2 _._ 685e _−_ 4 0 _._ 86 _±_ 2 _._ 408e _−_ 3 0 _._ 918 _±_ 3 _._ 602e _−_ 4
gemini-2.0-flash Trend +TFM timemixer 0 _._ 864 _±_ 3 _._ 814e _−_ 3 0 _._ 922 _±_ 2 _._ 445e _−_ 3 0 _._ 885 _±_ 4 _._ 067e _−_ 3 0 _._ 937 _±_ 1 _._ 064e _−_ 3 0 _._ 837 _±_ 3 _._ 347e _−_ 3 0 _._ 923 _±_ 1 _._ 102e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 859 _±_ 9 _._ 192e _−_ 3 0 _._ 922 _±_ 2 _._ 001e _−_ 3 0 _._ 897 _±_ 3 _._ 486e _−_ 3 0 _._ 94 _±_ 1 _._ 881e _−_ 3 0 _._ 858 _±_ 7 _._ 637e _−_ 3 0 _._ 921 _±_ 1 _._ 57e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 869 _±_ 0e0 0 _._ 923 _±_ 0e0 0 _._ 904 _±_ 0e0 0 _._ 94 _±_ 0e0 0 _._ 87 _±_ 0e0 0 _._ 924 _±_ 0e0
gemini-2.0-flash Trend patchtsmixer 0 _._ 854 _±_ 0e0 0 _._ 92 _±_ 0e0 0 _._ 895 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 861 _±_ 0e0 0 _._ 923 _±_ 0e0
gemini-2.0-flash Trend timemixer 0 _._ 847 _±_ 0e0 0 _._ 921 _±_ 0e0 0 _._ 884 _±_ 0e0 0 _._ 941 _±_ 0e0 0 _._ 845 _±_ 0e0 0 _._ 927 _±_ 0e0
gemini-2.0-flash zero shot +TFM lstm 0 _._ 888 _±_ 6 _._ 233e _−_ 3 0 _._ 925 _±_ 3 _._ 482e _−_ 3 0 _._ 9 _±_ 4 _._ 405e _−_ 3 0 _._ 938 _±_ 9 _._ 188e _−_ 4 0 _._ 864 _±_ 1 _._ 14e _−_ 3 0 _._ 915 _±_ 1 _._ 201e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 886 _±_ 2 _._ 223e _−_ 3 0 _._ 927 _±_ 6 _._ 502e _−_ 4 0 _._ 906 _±_ 2 _._ 027e _−_ 3 0 _._ 942 _±_ 6 _._ 099e _−_ 4 0 _._ 87 _±_ 5 _._ 372e _−_ 4 0 _._ 924 _±_ 1 _._ 206e _−_ 4
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 87 _±_ 5 _._ 808e _−_ 3 0 _._ 918 _±_ 3 _._ 325e _−_ 3 0 _._ 897 _±_ 1 _._ 201e _−_ 3 0 _._ 941 _±_ 5 _._ 901e _−_ 4 0 _._ 85 _±_ 3 _._ 66e _−_ 3 0 _._ 919 _±_ 9 _._ 218e _−_ 4
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 864 _±_ 1 _._ 514e _−_ 3 0 _._ 921 _±_ 2 _._ 516e _−_ 3 0 _._ 879 _±_ 1 _._ 897e _−_ 3 0 _._ 938 _±_ 2 _._ 642e _−_ 3 0 _._ 828 _±_ 2 _._ 471e _−_ 3 0 _._ 925 _±_ 6 _._ 238e _−_ 4
gemini-2.0-flash zero shot lstm 0 _._ 864 _±_ 1 _._ 317e _−_ 2 0 _._ 926 _±_ 1 _._ 541e _−_ 3 0 _._ 893 _±_ 7 _._ 425e _−_ 4 0 _._ 942 _±_ 4 _._ 455e _−_ 4 0 _._ 846 _±_ 9 _._ 744e _−_ 3 0 _._ 924 _±_ 2 _._ 984e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 874 _±_ 0e0 0 _._ 928 _±_ 0e0 0 _._ 9 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 861 _±_ 0e0 0 _._ 926 _±_ 0e0
gemini-2.0-flash zero shot patchtsmixer 0 _._ 855 _±_ 0e0 0 _._ 926 _±_ 0e0 0 _._ 894 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 848 _±_ 0e0 0 _._ 927 _±_ 0e0
gemini-2.0-flash zero shot timemixer 0 _._ 853 _±_ 0e0 0 _._ 923 _±_ 0e0 0 _._ 881 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 834 _±_ 0e0 0 _._ 93 _±_ 0e0
interp lstm 0 _._ 862 _±_ 4 _._ 524e _−_ 4 0 _._ 863 _±_ 7 _._ 691e _−_ 3 0 _._ 897 _±_ 1 _._ 071e _−_ 3 0 _._ 905 _±_ 6 _._ 778e _−_ 3 0 _._ 866 _±_ 1 _._ 449e _−_ 3 0 _._ 872 _±_ 7 _._ 24e _−_ 3
interp mlp 0 _._ 864 _±_ 3 _._ 877e _−_ 4 0 _._ 867 _±_ 2 _._ 024e _−_ 3 0 _._ 898 _±_ 4 _._ 303e _−_ 4 0 _._ 908 _±_ 1 _._ 671e _−_ 3 0 _._ 872 _±_ 6 _._ 682e _−_ 4 0 _._ 873 _±_ 2 _._ 105e _−_ 3
interp patchtsmixer 0 _._ 86 _±_ 4 _._ 162e _−_ 3 0 _._ 853 _±_ 1 _._ 984e _−_ 2 0 _._ 891 _±_ 1 _._ 864e _−_ 3 0 _._ 893 _±_ 6 _._ 767e _−_ 3 0 _._ 859 _±_ 3 _._ 309e _−_ 3 0 _._ 847 _±_ 1 _._ 608e _−_ 2
interp timemixer 0 _._ 864 _±_ 1 _._ 179e _−_ 3 0 _._ 868 _±_ 4 _._ 322e _−_ 3 0 _._ 895 _±_ 1 _._ 871e _−_ 4 0 _._ 907 _±_ 1 _._ 987e _−_ 3 0 _._ 865 _±_ 2 _._ 192e _−_ 3 0 _._ 864 _±_ 1 _._ 057e _−_ 2
mean lstm 0 _._ 857 _±_ 4 _._ 039e _−_ 4 0 _._ 859 _±_ 4 _._ 395e _−_ 3 0 _._ 889 _±_ 5 _._ 677e _−_ 4 0 _._ 893 _±_ 4 _._ 161e _−_ 3 0 _._ 84 _±_ 1 _._ 046e _−_ 3 0 _._ 833 _±_ 6 _._ 055e _−_ 3
mean mlp 0 _._ 852 _±_ 7 _._ 397e _−_ 4 0 _._ 853 _±_ 4 _._ 183e _−_ 3 0 _._ 888 _±_ 2 _._ 311e _−_ 4 0 _._ 894 _±_ 1 _._ 562e _−_ 3 0 _._ 846 _±_ 1 _._ 859e _−_ 3 0 _._ 844 _±_ 5 _._ 339e _−_ 3
mean patchtsmixer 0 _._ 86 _±_ 1 _._ 873e _−_ 3 0 _._ 857 _±_ 1 _._ 018e _−_ 2 0 _._ 89 _±_ 3 _._ 296e _−_ 3 0 _._ 886 _±_ 9 _._ 38e _−_ 3 0 _._ 858 _±_ 3 _._ 78e _−_ 3 0 _._ 847 _±_ 1 _._ 71e _−_ 2
mean timemixer 0 _._ 867 _±_ 1 _._ 337e _−_ 3 0 _._ 871 _±_ 4 _._ 503e _−_ 3 0 _._ 9 _±_ 1 _._ 135e _−_ 3 0 _._ 903 _±_ 5 _._ 124e _−_ 3 0 _._ 869 _±_ 2 _._ 332e _−_ 3 0 _._ 87 _±_ 6 _._ 14e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 899 _±_ 1 _._ 882e _−_ 3 0 _._ 931 _±_ 9 _._ 36e _−_ 4 0 _._ 913 _±_ 1 _._ 828e _−_ 3 0 _._ 938 _±_ 7 _._ 171e _−_ 4 0 _._ 887 _±_ 4 _._ 298e _−_ 3 0 _._ 926 _±_ 1 _._ 93e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 898 _±_ 1 _._ 646e _−_ 4 0 _._ 935 _±_ 6 _._ 165e _−_ 4 0 _._ 917 _±_ 1 _._ 911e _−_ 3 0 _._ 942 _±_ 7 _._ 07e _−_ 4 0 _._ 888 _±_ 3 _._ 313e _−_ 3 0 _._ 933 _±_ 6 _._ 611e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 88 _±_ 4 _._ 753e _−_ 3 0 _._ 923 _±_ 1 _._ 892e _−_ 3 0 _._ 907 _±_ 1 _._ 434e _−_ 3 0 _._ 942 _±_ 6 _._ 495e _−_ 4 0 _._ 871 _±_ 2 _._ 433e _−_ 3 0 _._ 924 _±_ 1 _._ 167e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 874 _±_ 5 _._ 09e _−_ 3 0 _._ 925 _±_ 5 _._ 211e _−_ 3 0 _._ 895 _±_ 4 _._ 736e _−_ 3 0 _._ 941 _±_ 5 _._ 895e _−_ 4 0 _._ 855 _±_ 2 _._ 125e _−_ 3 0 _._ 924 _±_ 1 _._ 743e _−_ 3
No ~~s~~ um ~~C~~ oT lstm 0 _._ 878 _±_ 3 _._ 551e _−_ 4 0 _._ 929 _±_ 9 _._ 75e _−_ 4 0 _._ 905 _±_ 9 _._ 539e _−_ 5 0 _._ 942 _±_ 3 _._ 9e _−_ 4 0 _._ 873 _±_ 2 _._ 108e _−_ 4 0 _._ 932 _±_ 7 _._ 855e _−_ 4
No ~~s~~ um ~~C~~ oT mlp 0 _._ 888 _±_ 0e0 0 _._ 933 _±_ 0e0 0 _._ 914 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 884 _±_ 0e0 0 _._ 933 _±_ 0e0
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 877 _±_ 1 _._ 922e _−_ 4 0 _._ 931 _±_ 8 _._ 355e _−_ 4 0 _._ 906 _±_ 3 _._ 812e _−_ 4 0 _._ 944 _±_ 6 _._ 991e _−_ 4 0 _._ 876 _±_ 4 _._ 941e _−_ 4 0 _._ 934 _±_ 1 _._ 795e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 871 _±_ 1 _._ 175e _−_ 3 0 _._ 931 _±_ 1 _._ 531e _−_ 4 0 _._ 893 _±_ 1 _._ 317e _−_ 3 0 _._ 944 _±_ 1 _._ 362e _−_ 3 0 _._ 867 _±_ 5 _._ 472e _−_ 4 0 _._ 926 _±_ 1 _._ 09e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 899 _±_ 6 _._ 612e _−_ 4 0 _._ 931 _±_ 3 _._ 923e _−_ 4 0 _._ 916 _±_ 1 _._ 685e _−_ 3 0 _._ 939 _±_ 5 _._ 954e _−_ 4 0 _._ 881 _±_ 5 _._ 792e _−_ 3 0 _._ 924 _±_ 3 _._ 529e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 899 _±_ 2 _._ 172e _−_ 3 0 _._ 935 _±_ 1 _._ 401e _−_ 3 0 _._ 916 _±_ 1 _._ 139e _−_ 3 0 _._ 943 _±_ 3 _._ 055e _−_ 4 0 _._ 885 _±_ 2 _._ 285e _−_ 3 0 _._ 932 _±_ 1 _._ 292e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 882 _±_ 3 _._ 476e _−_ 3 0 _._ 923 _±_ 1 _._ 524e _−_ 3 0 _._ 906 _±_ 1 _._ 865e _−_ 3 0 _._ 941 _±_ 5 _._ 905e _−_ 4 0 _._ 871 _±_ 2 _._ 455e _−_ 3 0 _._ 925 _±_ 1 _._ 528e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 877 _±_ 2 _._ 363e _−_ 3 0 _._ 925 _±_ 3 _._ 242e _−_ 3 0 _._ 898 _±_ 2 _._ 777e _−_ 3 0 _._ 941 _±_ 6 _._ 577e _−_ 4 0 _._ 855 _±_ 2 _._ 207e _−_ 3 0 _._ 923 _±_ 6 _._ 616e _−_ 4
No ~~s~~ um ~~I~~ CD lstm 0 _._ 877 _±_ 4 _._ 917e _−_ 4 0 _._ 93 _±_ 7 _._ 455e _−_ 4 0 _._ 903 _±_ 4 _._ 43e _−_ 4 0 _._ 944 _±_ 6 _._ 883e _−_ 4 0 _._ 871 _±_ 2 _._ 558e _−_ 4 0 _._ 931 _±_ 1 _._ 154e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 886 _±_ 0e0 0 _._ 934 _±_ 0e0 0 _._ 911 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 88 _±_ 0e0 0 _._ 933 _±_ 0e0
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 875 _±_ 7 _._ 904e _−_ 4 0 _._ 93 _±_ 1 _._ 542e _−_ 3 0 _._ 904 _±_ 7 _._ 81e _−_ 5 0 _._ 943 _±_ 8 _._ 528e _−_ 4 0 _._ 871 _±_ 6 _._ 478e _−_ 4 0 _._ 935 _±_ 1 _._ 466e _−_ 3
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 869 _±_ 7 _._ 434e _−_ 4 0 _._ 932 _±_ 3 _._ 365e _−_ 4 0 _._ 9 _±_ 3 _._ 281e _−_ 4 0 _._ 943 _±_ 1 _._ 146e _−_ 3 0 _._ 862 _±_ 1 _._ 177e _−_ 3 0 _._ 928 _±_ 1 _._ 409e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 897 _±_ 2 _._ 179e _−_ 3 0 _._ 93 _±_ 8 _._ 698e _−_ 4 0 _._ 915 _±_ 9 _._ 572e _−_ 4 0 _._ 937 _±_ 1 _._ 264e _−_ 3 0 _._ 885 _±_ 1 _._ 388e _−_ 3 0 _._ 924 _±_ 1 _._ 125e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 901 _±_ 5 _._ 023e _−_ 3 0 _._ 934 _±_ 1 _._ 867e _−_ 3 0 _._ 917 _±_ 2 _._ 971e _−_ 3 0 _._ 943 _±_ 2 _._ 888e _−_ 4 0 _._ 887 _±_ 6e _−_ 5 0 _._ 933 _±_ 4 _._ 277e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 881 _±_ 5 _._ 503e _−_ 3 0 _._ 923 _±_ 1 _._ 202e _−_ 3 0 _._ 907 _±_ 8 _._ 208e _−_ 4 0 _._ 941 _±_ 8 _._ 731e _−_ 4 0 _._ 877 _±_ 2 _._ 42e _−_ 3 0 _._ 925 _±_ 1 _._ 415e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 875 _±_ 6 _._ 816e _−_ 3 0 _._ 924 _±_ 2 _._ 757e _−_ 3 0 _._ 892 _±_ 3 _._ 244e _−_ 3 0 _._ 94 _±_ 8 _._ 564e _−_ 4 0 _._ 856 _±_ 1 _._ 993e _−_ 3 0 _._ 924 _±_ 1 _._ 675e _−_ 3


Table 30: In-distribution results - Lab. (part 1/2)


46


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 878 _±_ 2 _._ 658e _−_ 4 0 _._ 928 _±_ 6 _._ 463e _−_ 4 0 _._ 906 _±_ 2 _._ 312e _−_ 4 0 _._ 943 _±_ 6 _._ 671e _−_ 4 0 _._ 875 _±_ 1 _._ 3e _−_ 4 0 _._ 932 _±_ 1 _._ 242e _−_ 4
No ~~s~~ um ~~T~~ rend mlp 0 _._ 895 _±_ 0e0 0 _._ 933 _±_ 0e0 0 _._ 914 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 883 _±_ 0e0 0 _._ 933 _±_ 0e0
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 879 _±_ 7 _._ 515e _−_ 4 0 _._ 929 _±_ 1 _._ 331e _−_ 3 0 _._ 905 _±_ 2 _._ 403e _−_ 4 0 _._ 942 _±_ 7 _._ 504e _−_ 4 0 _._ 875 _±_ 1 _._ 472e _−_ 3 0 _._ 936 _±_ 2 _._ 444e _−_ 4
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 873 _±_ 3 _._ 395e _−_ 4 0 _._ 93 _±_ 4 _._ 888e _−_ 4 0 _._ 896 _±_ 8 _._ 228e _−_ 4 0 _._ 942 _±_ 6 _._ 2e _−_ 4 0 _._ 864 _±_ 3 _._ 47e _−_ 4 0 _._ 926 _±_ 1 _._ 854e _−_ 3
medgemma CoT +TFM lstm 0 _._ 889 _±_ 5 _._ 13e _−_ 3 0 _._ 926 _±_ 4 _._ 828e _−_ 4 0 _._ 904 _±_ 2 _._ 248e _−_ 3 0 _._ 936 _±_ 1 _._ 293e _−_ 3 0 _._ 861 _±_ 2 _._ 565e _−_ 3 0 _._ 916 _±_ 1 _._ 212e _−_ 3
medgemma CoT +TFM mlp 0 _._ 889 _±_ 2 _._ 26e _−_ 3 0 _._ 93 _±_ 4 _._ 419e _−_ 4 0 _._ 909 _±_ 1 _._ 791e _−_ 3 0 _._ 942 _±_ 3 _._ 538e _−_ 4 0 _._ 869 _±_ 7 _._ 267e _−_ 4 0 _._ 927 _±_ 7 _._ 617e _−_ 4
medgemma CoT +TFM patchtsmixer 0 _._ 843 _±_ 2 _._ 567e _−_ 2 0 _._ 921 _±_ 4 _._ 432e _−_ 3 0 _._ 899 _±_ 2 _._ 595e _−_ 3 0 _._ 941 _±_ 1 _._ 213e _−_ 3 0 _._ 844 _±_ 1 _._ 187e _−_ 2 0 _._ 922 _±_ 8 _._ 976e _−_ 4
medgemma CoT +TFM timemixer 0 _._ 87 _±_ 2 _._ 113e _−_ 3 0 _._ 923 _±_ 7 _._ 391e _−_ 4 0 _._ 883 _±_ 7 _._ 948e _−_ 3 0 _._ 938 _±_ 1 _._ 643e _−_ 3 0 _._ 833 _±_ 2 _._ 474e _−_ 3 0 _._ 926 _±_ 8 _._ 26e _−_ 4
medgemma CoT lstm 0 _._ 868 _±_ 8 _._ 252e _−_ 3 0 _._ 925 _±_ 2 _._ 256e _−_ 3 0 _._ 896 _±_ 4 _._ 759e _−_ 3 0 _._ 944 _±_ 2 _._ 836e _−_ 3 0 _._ 851 _±_ 0e0 0 _._ 928 _±_ 0e0
medgemma CoT mlp 0 _._ 879 _±_ 0e0 0 _._ 929 _±_ 0e0 0 _._ 903 _±_ 0e0 0 _._ 943 _±_ 0e0 0 _._ 864 _±_ 0e0 0 _._ 928 _±_ 0e0
medgemma CoT patchtsmixer 0 _._ 866 _±_ 0e0 0 _._ 925 _±_ 0e0 0 _._ 895 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 855 _±_ 0e0 0 _._ 932 _±_ 0e0
medgemma CoT timemixer 0 _._ 86 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 888 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 84 _±_ 0e0 0 _._ 927 _±_ 0e0
medgemma ICD +TFM lstm 0 _._ 877 _±_ 3 _._ 05e _−_ 3 0 _._ 923 _±_ 1 _._ 422e _−_ 3 0 _._ 895 _±_ 4 _._ 337e _−_ 3 0 _._ 937 _±_ 1 _._ 362e _−_ 3 0 _._ 844 _±_ 1 _._ 449e _−_ 3 0 _._ 912 _±_ 1 _._ 579e _−_ 3
medgemma ICD +TFM mlp 0 _._ 884 _±_ 3 _._ 329e _−_ 3 0 _._ 928 _±_ 1 _._ 335e _−_ 3 0 _._ 906 _±_ 2 _._ 99e _−_ 3 0 _._ 941 _±_ 1 _._ 008e _−_ 3 0 _._ 858 _±_ 3 _._ 321e _−_ 3 0 _._ 922 _±_ 2 _._ 843e _−_ 4
medgemma ICD +TFM patchtsmixer 0 _._ 863 _±_ 8 _._ 107e _−_ 3 0 _._ 918 _±_ 1 _._ 423e _−_ 3 0 _._ 894 _±_ 1 _._ 985e _−_ 3 0 _._ 942 _±_ 3 _._ 724e _−_ 4 0 _._ 832 _±_ 1 _._ 02e _−_ 2 0 _._ 923 _±_ 3 _._ 201e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 862 _±_ 2 _._ 257e _−_ 3 0 _._ 921 _±_ 8 _._ 469e _−_ 4 0 _._ 876 _±_ 8 _._ 269e _−_ 3 0 _._ 938 _±_ 2 _._ 769e _−_ 3 0 _._ 811 _±_ 1 _._ 756e _−_ 3 0 _._ 927 _±_ 8 _._ 819e _−_ 4
medgemma ICD lstm 0 _._ 856 _±_ 8 _._ 966e _−_ 3 0 _._ 924 _±_ 1 _._ 209e _−_ 3 0 _._ 885 _±_ 3 _._ 698e _−_ 3 0 _._ 946 _±_ 4 _._ 313e _−_ 4 0 _._ 832 _±_ 7 _._ 7e _−_ 3 0 _._ 926 _±_ 3 _._ 097e _−_ 3
medgemma ICD mlp 0 _._ 868 _±_ 0e0 0 _._ 926 _±_ 0e0 0 _._ 895 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 843 _±_ 0e0 0 _._ 925 _±_ 0e0
medgemma ICD patchtsmixer 0 _._ 852 _±_ 0e0 0 _._ 92 _±_ 0e0 0 _._ 888 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 832 _±_ 0e0 0 _._ 931 _±_ 0e0
medgemma ICD timemixer 0 _._ 85 _±_ 0e0 0 _._ 922 _±_ 0e0 0 _._ 876 _±_ 0e0 0 _._ 948 _±_ 0e0 0 _._ 808 _±_ 0e0 0 _._ 936 _±_ 0e0
medgemma Trend +TFM lstm 0 _._ 88 _±_ 4 _._ 772e _−_ 3 0 _._ 924 _±_ 5 _._ 742e _−_ 4 0 _._ 903 _±_ 8 _._ 193e _−_ 4 0 _._ 936 _±_ 5 _._ 575e _−_ 4 0 _._ 861 _±_ 1 _._ 843e _−_ 3 0 _._ 917 _±_ 2 _._ 003e _−_ 3
medgemma Trend +TFM mlp 0 _._ 885 _±_ 1 _._ 961e _−_ 3 0 _._ 929 _±_ 2 _._ 15e _−_ 4 0 _._ 908 _±_ 3 _._ 774e _−_ 4 0 _._ 94 _±_ 4 _._ 464e _−_ 4 0 _._ 869 _±_ 1 _._ 008e _−_ 3 0 _._ 925 _±_ 4 _._ 424e _−_ 4
medgemma Trend +TFM patchtsmixer 0 _._ 864 _±_ 1 _._ 666e _−_ 3 0 _._ 919 _±_ 3 _._ 332e _−_ 4 0 _._ 896 _±_ 2 _._ 969e _−_ 3 0 _._ 939 _±_ 1 _._ 372e _−_ 3 0 _._ 849 _±_ 4 _._ 349e _−_ 3 0 _._ 919 _±_ 6 _._ 379e _−_ 4
medgemma Trend +TFM timemixer 0 _._ 861 _±_ 4 _._ 282e _−_ 3 0 _._ 923 _±_ 1 _._ 442e _−_ 3 0 _._ 886 _±_ 6 _._ 317e _−_ 4 0 _._ 94 _±_ 1 _._ 53e _−_ 3 0 _._ 825 _±_ 1 _._ 56e _−_ 2 0 _._ 925 _±_ 3 _._ 355e _−_ 3
medgemma Trend lstm 0 _._ 861 _±_ 6 _._ 64e _−_ 3 0 _._ 925 _±_ 2 _._ 885e _−_ 3 0 _._ 896 _±_ 3 _._ 507e _−_ 3 0 _._ 94 _±_ 2 _._ 503e _−_ 3 0 _._ 85 _±_ 6 _._ 937e _−_ 3 0 _._ 924 _±_ 7 _._ 354e _−_ 4
medgemma Trend mlp 0 _._ 871 _±_ 0e0 0 _._ 925 _±_ 0e0 0 _._ 9 _±_ 0e0 0 _._ 941 _±_ 0e0 0 _._ 859 _±_ 0e0 0 _._ 926 _±_ 0e0
medgemma Trend patchtsmixer 0 _._ 855 _±_ 0e0 0 _._ 924 _±_ 0e0 0 _._ 894 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 851 _±_ 0e0 0 _._ 925 _±_ 0e0
medgemma Trend timemixer 0 _._ 85 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 88 _±_ 0e0 0 _._ 944 _±_ 0e0 0 _._ 837 _±_ 0e0 0 _._ 928 _±_ 0e0
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 886 _±_ 1 _._ 048e _−_ 3 0 _._ 923 _±_ 6 _._ 421e _−_ 4 0 _._ 902 _±_ 2 _._ 546e _−_ 3 0 _._ 937 _±_ 7 _._ 805e _−_ 4 0 _._ 853 _±_ 5 _._ 101e _−_ 3 0 _._ 915 _±_ 1 _._ 43e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 891 _±_ 2 _._ 723e _−_ 3 0 _._ 929 _±_ 1 _._ 725e _−_ 3 0 _._ 909 _±_ 2 _._ 35e _−_ 3 0 _._ 942 _±_ 6 _._ 171e _−_ 4 0 _._ 865 _±_ 2 _._ 928e _−_ 3 0 _._ 924 _±_ 9 _._ 504e _−_ 5
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 866 _±_ 1 _._ 713e _−_ 3 0 _._ 917 _±_ 3 _._ 412e _−_ 4 0 _._ 896 _±_ 8 _._ 122e _−_ 4 0 _._ 942 _±_ 3 _._ 317e _−_ 4 0 _._ 843 _±_ 1 _._ 467e _−_ 2 0 _._ 921 _±_ 2 _._ 999e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 847 _±_ 2 _._ 482e _−_ 2 0 _._ 926 _±_ 7 _._ 219e _−_ 3 0 _._ 88 _±_ 3 _._ 121e _−_ 3 0 _._ 939 _±_ 1 _._ 32e _−_ 3 0 _._ 828 _±_ 4 _._ 5e _−_ 3 0 _._ 925 _±_ 1 _._ 935e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 867 _±_ 1 _._ 014e _−_ 2 0 _._ 925 _±_ 3 _._ 571e _−_ 3 0 _._ 893 _±_ 4 _._ 589e _−_ 3 0 _._ 944 _±_ 2 _._ 22e _−_ 3 0 _._ 847 _±_ 8 _._ 4e _−_ 3 0 _._ 924 _±_ 4 _._ 363e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 878 _±_ 0e0 0 _._ 927 _±_ 0e0 0 _._ 9 _±_ 0e0 0 _._ 943 _±_ 0e0 0 _._ 858 _±_ 0e0 0 _._ 926 _±_ 0e0
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 858 _±_ 0e0 0 _._ 923 _±_ 0e0 0 _._ 894 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 852 _±_ 0e0 0 _._ 93 _±_ 0e0
medgemma zero ~~s~~ hot timemixer 0 _._ 852 _±_ 0e0 0 _._ 924 _±_ 0e0 0 _._ 882 _±_ 0e0 0 _._ 947 _±_ 0e0 0 _._ 83 _±_ 0e0 0 _._ 931 _±_ 0e0
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM lstm 0 _._ 899 _±_ 1 _._ 292e _−_ 3 0 _._ 931 _±_ 1 _._ 177e _−_ 3 0 _._ 915 _±_ 2 _._ 725e _−_ 3 0 _._ 937 _±_ 3 _._ 164e _−_ 4 0 _._ 884 _±_ 1 _._ 782e _−_ 3 0 _._ 926 _±_ 1 _._ 312e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM mlp 0 _._ 899 _±_ 3 _._ 993e _−_ 4 0 _._ 935 _±_ 9 _._ 4e _−_ 4 0 _._ 917 _±_ 1 _._ 582e _−_ 3 0 _._ 942 _±_ 3 _._ 988e _−_ 4 0 _._ 888 _±_ 2 _._ 399e _−_ 3 0 _._ 933 _±_ 8 _._ 827e _−_ 4
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 883 _±_ 1 _._ 917e _−_ 3 0 _._ 923 _±_ 1 _._ 105e _−_ 3 0 _._ 907 _±_ 7 _._ 06e _−_ 4 0 _._ 941 _±_ 4 _._ 992e _−_ 4 0 _._ 875 _±_ 2 _._ 033e _−_ 3 0 _._ 925 _±_ 1 _._ 18e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM timemixer 0 _._ 874 _±_ 3 _._ 213e _−_ 3 0 _._ 926 _±_ 4 _._ 367e _−_ 3 0 _._ 892 _±_ 3 _._ 519e _−_ 3 0 _._ 941 _±_ 7 _._ 862e _−_ 4 0 _._ 853 _±_ 4 _._ 922e _−_ 3 0 _._ 923 _±_ 1 _._ 54e _−_ 3
No ~~s~~ um ~~z~~ ero shot lstm 0 _._ 877 _±_ 5 _._ 33e _−_ 4 0 _._ 931 _±_ 1 _._ 281e _−_ 3 0 _._ 905 _±_ 1 _._ 286e _−_ 4 0 _._ 942 _±_ 2 _._ 501e _−_ 4 0 _._ 873 _±_ 1 _._ 518e _−_ 4 0 _._ 933 _±_ 7 _._ 503e _−_ 4
No ~~s~~ um ~~z~~ ero shot mlp 0 _._ 891 _±_ 0e0 0 _._ 934 _±_ 0e0 0 _._ 912 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 881 _±_ 0e0 0 _._ 933 _±_ 0e0
No ~~s~~ um ~~z~~ ero shot patchtsmixer 0 _._ 877 _±_ 5 _._ 975e _−_ 4 0 _._ 93 _±_ 4 _._ 858e _−_ 4 0 _._ 905 _±_ 2 _._ 001e _−_ 4 0 _._ 943 _±_ 9 _._ 239e _−_ 4 0 _._ 874 _±_ 8 _._ 505e _−_ 5 0 _._ 936 _±_ 1 _._ 778e _−_ 3
No ~~s~~ um ~~z~~ ero shot timemixer 0 _._ 869 _±_ 5 _._ 951e _−_ 4 0 _._ 932 _±_ 5 _._ 065e _−_ 4 0 _._ 898 _±_ 8 _._ 837e _−_ 4 0 _._ 942 _±_ 4 _._ 535e _−_ 4 0 _._ 86 _±_ 7 _._ 794e _−_ 4 0 _._ 93 _±_ 1 _._ 172e _−_ 3
right lstm 0 _._ 87 _±_ 8 _._ 813e _−_ 4 0 _._ 881 _±_ 3 _._ 199e _−_ 3 0 _._ 899 _±_ 4 _._ 968e _−_ 4 0 _._ 908 _±_ 3 _._ 32e _−_ 3 0 _._ 87 _±_ 1 _._ 011e _−_ 3 0 _._ 882 _±_ 3 _._ 608e _−_ 3
right mlp 0 _._ 873 _±_ 4 _._ 173e _−_ 4 0 _._ 88 _±_ 2 _._ 961e _−_ 3 0 _._ 9 _±_ 2 _._ 41e _−_ 4 0 _._ 91 _±_ 3 _._ 03e _−_ 3 0 _._ 876 _±_ 6 _._ 405e _−_ 4 0 _._ 879 _±_ 4 _._ 391e _−_ 3
right patchtsmixer 0 _._ 863 _±_ 6 _._ 473e _−_ 3 0 _._ 858 _±_ 2 _._ 645e _−_ 2 0 _._ 89 _±_ 2 _._ 222e _−_ 3 0 _._ 884 _±_ 9 _._ 048e _−_ 3 0 _._ 858 _±_ 2 _._ 851e _−_ 3 0 _._ 846 _±_ 1 _._ 492e _−_ 2
right timemixer 0 _._ 874 _±_ 8 _._ 987e _−_ 4 0 _._ 884 _±_ 3 _._ 664e _−_ 3 0 _._ 899 _±_ 8 _._ 577e _−_ 4 0 _._ 911 _±_ 6 _._ 399e _−_ 3 0 _._ 869 _±_ 4 _._ 859e _−_ 4 0 _._ 868 _±_ 2 _._ 748e _−_ 3


Table 31: In-distribution results - Lab. (part 2/2)


47


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro** **f1** ~~**m**~~ **icro** **recall** ~~**m**~~ **icro**


Llama-3.1 CoT +TFM lstm 0 _._ 774 _±_ 6 _._ 907e _−_ 4 0 _._ 959 _±_ 3 _._ 078e _−_ 3 0 _._ 766 _±_ 1 _._ 933e _−_ 3 0 _._ 95 _±_ 5 _._ 956e _−_ 4
Llama-3.1 CoT +TFM mlp 0 _._ 78 _±_ 2 _._ 159e _−_ 3 0 _._ 956 _±_ 2 _._ 175e _−_ 3 0 _._ 761 _±_ 1 _._ 398e _−_ 3 0 _._ 956 _±_ 1 _._ 442e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 777 _±_ 2 _._ 362e _−_ 3 0 _._ 959 _±_ 4 _._ 087e _−_ 3 0 _._ 755 _±_ 1 _._ 652e _−_ 3 0 _._ 961 _±_ 2 _._ 694e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 773 _±_ 1 _._ 304e _−_ 3 0 _._ 962 _±_ 2 _._ 365e _−_ 3 0 _._ 775 _±_ 3 _._ 476e _−_ 3 0 _._ 94 _±_ 5 _._ 293e _−_ 3
Llama-3.1 CoT lstm 0 _._ 786 _±_ 0e0 0 _._ 954 _±_ 0e0 0 _._ 775 _±_ 0e0 0 _._ 952 _±_ 0e0
Llama-3.1 CoT mlp 0 _._ 781 _±_ 0e0 0 _._ 955 _±_ 0e0 0 _._ 765 _±_ 0e0 0 _._ 951 _±_ 0e0
Llama-3.1 CoT patchtsmixer 0 _._ 785 _±_ 0e0 0 _._ 959 _±_ 0e0 0 _._ 775 _±_ 0e0 0 _._ 953 _±_ 0e0
Llama-3.1 CoT timemixer 0 _._ 786 _±_ 0e0 0 _._ 957 _±_ 0e0 0 _._ 78 _±_ 0e0 0 _._ 949 _±_ 0e0
Llama-3.1 ICD +TFM lstm 0 _._ 769 _±_ 2 _._ 365e _−_ 3 0 _._ 967 _±_ 2 _._ 211e _−_ 3 0 _._ 77 _±_ 1 _._ 332e _−_ 3 0 _._ 944 _±_ 1 _._ 466e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 776 _±_ 2 _._ 135e _−_ 3 0 _._ 96 _±_ 2 _._ 754e _−_ 3 0 _._ 761 _±_ 1 _._ 713e _−_ 3 0 _._ 955 _±_ 1 _._ 754e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 775 _±_ 2 _._ 289e _−_ 3 0 _._ 959 _±_ 3 _._ 655e _−_ 3 0 _._ 76 _±_ 1 _._ 61e _−_ 3 0 _._ 956 _±_ 3 _._ 691e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 774 _±_ 7 _._ 144e _−_ 4 0 _._ 962 _±_ 3 _._ 057e _−_ 4 0 _._ 773 _±_ 1 _._ 563e _−_ 3 0 _._ 941 _±_ 1 _._ 077e _−_ 3
Llama-3.1 ICD lstm 0 _._ 788 _±_ 0e0 0 _._ 948 _±_ 0e0 0 _._ 775 _±_ 0e0 0 _._ 947 _±_ 0e0
Llama-3.1 ICD mlp 0 _._ 788 _±_ 0e0 0 _._ 947 _±_ 0e0 0 _._ 77 _±_ 0e0 0 _._ 945 _±_ 0e0
Llama-3.1 ICD patchtsmixer 0 _._ 789 _±_ 0e0 0 _._ 954 _±_ 0e0 0 _._ 776 _±_ 0e0 0 _._ 95 _±_ 0e0
Llama-3.1 ICD timemixer 0 _._ 787 _±_ 0e0 0 _._ 951 _±_ 0e0 0 _._ 777 _±_ 0e0 0 _._ 947 _±_ 0e0
Llama-3.1 Trend +TFM lstm 0 _._ 773 _±_ 4 _._ 59e _−_ 3 0 _._ 962 _±_ 6 _._ 862e _−_ 3 0 _._ 771 _±_ 2 _._ 454e _−_ 3 0 _._ 946 _±_ 1 _._ 418e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 778 _±_ 1 _._ 86e _−_ 3 0 _._ 96 _±_ 1 _._ 412e _−_ 3 0 _._ 77 _±_ 2 _._ 548e _−_ 3 0 _._ 948 _±_ 1 _._ 384e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 778 _±_ 1 _._ 755e _−_ 3 0 _._ 957 _±_ 7 _._ 842e _−_ 4 0 _._ 762 _±_ 2 _._ 552e _−_ 3 0 _._ 956 _±_ 3 _._ 489e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 779 _±_ 5 _._ 526e _−_ 3 0 _._ 959 _±_ 6 _._ 212e _−_ 3 0 _._ 771 _±_ 4 _._ 247e _−_ 3 0 _._ 945 _±_ 7 _._ 923e _−_ 3
Llama-3.1 Trend lstm 0 _._ 79 _±_ 0e0 0 _._ 952 _±_ 0e0 0 _._ 77 _±_ 0e0 0 _._ 948 _±_ 0e0
Llama-3.1 Trend mlp 0 _._ 788 _±_ 0e0 0 _._ 949 _±_ 0e0 0 _._ 768 _±_ 0e0 0 _._ 947 _±_ 0e0
Llama-3.1 Trend patchtsmixer 0 _._ 787 _±_ 0e0 0 _._ 956 _±_ 0e0 0 _._ 769 _±_ 0e0 0 _._ 953 _±_ 0e0
Llama-3.1 Trend timemixer 0 _._ 789 _±_ 0e0 0 _._ 953 _±_ 0e0 0 _._ 769 _±_ 0e0 0 _._ 95 _±_ 0e0
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 774 _±_ 1 _._ 044e _−_ 4 0 _._ 962 _±_ 1 _._ 739e _−_ 4 0 _._ 77 _±_ 4 _._ 499e _−_ 3 0 _._ 946 _±_ 1 _._ 427e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 779 _±_ 5 _._ 577e _−_ 4 0 _._ 959 _±_ 2 _._ 524e _−_ 4 0 _._ 766 _±_ 4 _._ 885e _−_ 3 0 _._ 957 _±_ 3 _._ 664e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 78 _±_ 4 _._ 661e _−_ 4 0 _._ 954 _±_ 1 _._ 319e _−_ 3 0 _._ 765 _±_ 4 _._ 887e _−_ 4 0 _._ 954 _±_ 6 _._ 074e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 78 _±_ 2 _._ 402e _−_ 3 0 _._ 957 _±_ 3 _._ 382e _−_ 3 0 _._ 769 _±_ 2 _._ 373e _−_ 3 0 _._ 948 _±_ 2 _._ 451e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 791 _±_ 0e0 0 _._ 949 _±_ 0e0 0 _._ 781 _±_ 0e0 0 _._ 945 _±_ 0e0
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 791 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 775 _±_ 0e0 0 _._ 945 _±_ 0e0
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 793 _±_ 0e0 0 _._ 953 _±_ 0e0 0 _._ 78 _±_ 0e0 0 _._ 948 _±_ 0e0
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 794 _±_ 0e0 0 _._ 949 _±_ 0e0 0 _._ 781 _±_ 0e0 0 _._ 945 _±_ 0e0
TFM lstm 0 _._ 799 _±_ 2 _._ 24e _−_ 3 0 _._ 94 _±_ 2 _._ 723e _−_ 3 0 _._ 787 _±_ 1 _._ 781e _−_ 3 0 _._ 934 _±_ 1 _._ 136e _−_ 3
TFM mlp 0 _._ 798 _±_ 8 _._ 308e _−_ 4 0 _._ 942 _±_ 2 _._ 808e _−_ 3 0 _._ 786 _±_ 1 _._ 065e _−_ 3 0 _._ 934 _±_ 2 _._ 918e _−_ 3
TFM patchtsmixer 0 _._ 794 _±_ 1 _._ 727e _−_ 3 0 _._ 946 _±_ 4 _._ 452e _−_ 4 0 _._ 778 _±_ 1 _._ 301e _−_ 3 0 _._ 945 _±_ 1 _._ 541e _−_ 3
TFM timemixer 0 _._ 802 _±_ 2 _._ 974e _−_ 3 0 _._ 943 _±_ 2 _._ 743e _−_ 3 0 _._ 782 _±_ 2 _._ 503e _−_ 3 0 _._ 941 _±_ 6 _._ 271e _−_ 3
TSDE lstm 0 _._ 746 _±_ 4 _._ 069e _−_ 4 0 _._ 898 _±_ 3 _._ 86e _−_ 4 0 _._ 738 _±_ 6 _._ 399e _−_ 3 0 _._ 929 _±_ 6 _._ 829e _−_ 3
TSDE mlp 0 _._ 742 _±_ 9 _._ 998e _−_ 4 0 _._ 898 _±_ 5 _._ 68e _−_ 4 0 _._ 734 _±_ 4 _._ 081e _−_ 3 0 _._ 908 _±_ 1 _._ 485e _−_ 3
TSDE patchtsmixer 0 _._ 734 _±_ 0e0 0 _._ 909 _±_ 2 _._ 5e _−_ 5 0 _._ 721 _±_ 2 _._ 765e _−_ 3 0 _._ 899 _±_ 1 _._ 2e _−_ 4
TSDE timemixer 0 _._ 734 _±_ 4 _._ 349e _−_ 5 0 _._ 889 _±_ 0e0 0 _._ 72 _±_ 4 _._ 75e _−_ 4 0 _._ 879 _±_ 4 _._ 7e _−_ 4
gemini-2.0-flash CoT +TFM lstm 0 _._ 779 _±_ 1 _._ 157e _−_ 3 0 _._ 952 _±_ 1 _._ 509e _−_ 3 0 _._ 77 _±_ 1 _._ 024e _−_ 3 0 _._ 941 _±_ 1 _._ 253e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 781 _±_ 2 _._ 019e _−_ 3 0 _._ 955 _±_ 3 _._ 218e _−_ 3 0 _._ 765 _±_ 1 _._ 35e _−_ 3 0 _._ 951 _±_ 1 _._ 08e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 781 _±_ 1 _._ 446e _−_ 3 0 _._ 955 _±_ 2 _._ 37e _−_ 3 0 _._ 758 _±_ 7 _._ 211e _−_ 4 0 _._ 961 _±_ 1 _._ 573e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 778 _±_ 5 _._ 45e _−_ 4 0 _._ 958 _±_ 1 _._ 473e _−_ 3 0 _._ 771 _±_ 5 _._ 743e _−_ 3 0 _._ 945 _±_ 5 _._ 898e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 793 _±_ 1 _._ 584e _−_ 3 0 _._ 945 _±_ 3 _._ 267e _−_ 3 0 _._ 773 _±_ 5 _._ 346e _−_ 3 0 _._ 941 _±_ 4 _._ 391e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 792 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 772 _±_ 0e0 0 _._ 945 _±_ 0e0
gemini-2.0-flash CoT patchtsmixer 0 _._ 791 _±_ 0e0 0 _._ 952 _±_ 0e0 0 _._ 774 _±_ 0e0 0 _._ 948 _±_ 0e0
gemini-2.0-flash CoT timemixer 0 _._ 792 _±_ 0e0 0 _._ 95 _±_ 0e0 0 _._ 777 _±_ 0e0 0 _._ 945 _±_ 0e0
gemini-2.0-flash ICD +TFM lstm 0 _._ 775 _±_ 3 _._ 041e _−_ 3 0 _._ 96 _±_ 4 _._ 06e _−_ 3 0 _._ 77 _±_ 2 _._ 096e _−_ 3 0 _._ 945 _±_ 3 _._ 438e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 777 _±_ 1 _._ 871e _−_ 3 0 _._ 96 _±_ 1 _._ 876e _−_ 3 0 _._ 764 _±_ 1 _._ 075e _−_ 3 0 _._ 954 _±_ 2 _._ 623e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 771 _±_ 5 _._ 129e _−_ 4 0 _._ 965 _±_ 1 _._ 344e _−_ 3 0 _._ 759 _±_ 3 _._ 777e _−_ 3 0 _._ 962 _±_ 5 _._ 819e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 771 _±_ 2 _._ 899e _−_ 3 0 _._ 966 _±_ 5 _._ 001e _−_ 3 0 _._ 772 _±_ 7 _._ 667e _−_ 3 0 _._ 949 _±_ 8 _._ 648e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 772 _±_ 7 _._ 707e _−_ 4 0 _._ 974 _±_ 8 _._ 825e _−_ 3 0 _._ 772 _±_ 1 _._ 838e _−_ 4 0 _._ 948 _±_ 1 _._ 344e _−_ 4
gemini-2.0-flash ICD mlp 0 _._ 772 _±_ 0e0 0 _._ 965 _±_ 0e0 0 _._ 772 _±_ 0e0 0 _._ 946 _±_ 0e0
gemini-2.0-flash ICD patchtsmixer 0 _._ 777 _±_ 0e0 0 _._ 969 _±_ 0e0 0 _._ 772 _±_ 0e0 0 _._ 953 _±_ 0e0
gemini-2.0-flash ICD timemixer 0 _._ 772 _±_ 0e0 0 _._ 975 _±_ 0e0 0 _._ 776 _±_ 0e0 0 _._ 949 _±_ 0e0
gemini-2.0-flash Trend +TFM lstm 0 _._ 784 _±_ 4 _._ 197e _−_ 3 0 _._ 942 _±_ 7 _._ 127e _−_ 3 0 _._ 776 _±_ 5 _._ 278e _−_ 4 0 _._ 94 _±_ 1 _._ 476e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 789 _±_ 2 _._ 121e _−_ 3 0 _._ 947 _±_ 2 _._ 406e _−_ 3 0 _._ 773 _±_ 6 _._ 574e _−_ 4 0 _._ 944 _±_ 8 _._ 593e _−_ 4
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 789 _±_ 1 _._ 383e _−_ 3 0 _._ 944 _±_ 1 _._ 347e _−_ 3 0 _._ 765 _±_ 2 _._ 892e _−_ 3 0 _._ 951 _±_ 3 _._ 808e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 781 _±_ 1 _._ 092e _−_ 3 0 _._ 954 _±_ 2 _._ 578e _−_ 3 0 _._ 773 _±_ 1 _._ 482e _−_ 3 0 _._ 946 _±_ 4 _._ 805e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 801 _±_ 3 _._ 111e _−_ 3 0 _._ 938 _±_ 3 _._ 458e _−_ 3 0 _._ 781 _±_ 2 _._ 178e _−_ 3 0 _._ 935 _±_ 6 _._ 838e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 799 _±_ 0e0 0 _._ 939 _±_ 0e0 0 _._ 777 _±_ 0e0 0 _._ 941 _±_ 0e0
gemini-2.0-flash Trend patchtsmixer 0 _._ 802 _±_ 0e0 0 _._ 945 _±_ 0e0 0 _._ 783 _±_ 0e0 0 _._ 94 _±_ 0e0
gemini-2.0-flash Trend timemixer 0 _._ 8 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 785 _±_ 0e0 0 _._ 938 _±_ 0e0
gemini-2.0-flash zero shot +TFM lstm 0 _._ 778 _±_ 2 _._ 447e _−_ 3 0 _._ 952 _±_ 3 _._ 203e _−_ 3 0 _._ 77 _±_ 1 _._ 228e _−_ 3 0 _._ 945 _±_ 2 _._ 536e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 778 _±_ 1 _._ 966e _−_ 3 0 _._ 957 _±_ 9 _._ 836e _−_ 4 0 _._ 761 _±_ 3 _._ 949e _−_ 3 0 _._ 956 _±_ 3 _._ 297e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 775 _±_ 1 _._ 757e _−_ 3 0 _._ 959 _±_ 9 _._ 166e _−_ 4 0 _._ 758 _±_ 2 _._ 899e _−_ 3 0 _._ 962 _±_ 4 _._ 923e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 774 _±_ 3 _._ 55e _−_ 3 0 _._ 964 _±_ 6 _._ 95e _−_ 3 0 _._ 768 _±_ 3 _._ 997e _−_ 3 0 _._ 952 _±_ 4 _._ 818e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 793 _±_ 7 _._ 071e _−_ 4 0 _._ 943 _±_ 5 _._ 19e _−_ 3 0 _._ 765 _±_ 3 _._ 309e _−_ 3 0 _._ 955 _±_ 9 _._ 115e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 794 _±_ 0e0 0 _._ 942 _±_ 0e0 0 _._ 762 _±_ 0e0 0 _._ 957 _±_ 0e0
gemini-2.0-flash zero shot patchtsmixer 0 _._ 795 _±_ 0e0 0 _._ 953 _±_ 0e0 0 _._ 767 _±_ 0e0 0 _._ 954 _±_ 0e0
gemini-2.0-flash zero shot timemixer 0 _._ 787 _±_ 0e0 0 _._ 957 _±_ 0e0 0 _._ 767 _±_ 0e0 0 _._ 957 _±_ 0e0
interp lstm 0 _._ 708 _±_ 1 _._ 932e _−_ 3 0 _._ 886 _±_ 6 _._ 243e _−_ 3 0 _._ 657 _±_ 9 _._ 491e _−_ 3 0 _._ 813 _±_ 2 _._ 445e _−_ 2
interp mlp 0 _._ 733 _±_ 1 _._ 943e _−_ 3 0 _._ 955 _±_ 3 _._ 448e _−_ 3 0 _._ 702 _±_ 7 _._ 303e _−_ 3 0 _._ 911 _±_ 2 _._ 16e _−_ 2
interp patchtsmixer 0 _._ 702 _±_ 9 _._ 913e _−_ 3 0 _._ 808 _±_ 1 _._ 83e _−_ 2 0 _._ 678 _±_ 7 _._ 828e _−_ 3 0 _._ 8 _±_ 1 _._ 262e _−_ 2
interp timemixer 0 _._ 641 _±_ 8 _._ 843e _−_ 3 0 _._ 654 _±_ 1 _._ 769e _−_ 2 0 _._ 638 _±_ 3 _._ 367e _−_ 3 0 _._ 733 _±_ 8 _._ 544e _−_ 3
mean lstm 0 _._ 649 _±_ 4 _._ 088e _−_ 3 0 _._ 8 _±_ 1 _._ 151e _−_ 2 0 _._ 623 _±_ 9 _._ 661e _−_ 3 0 _._ 726 _±_ 1 _._ 935e _−_ 2
mean mlp 0 _._ 691 _±_ 3 _._ 43e _−_ 3 0 _._ 885 _±_ 6 _._ 064e _−_ 3 0 _._ 642 _±_ 1 _._ 942e _−_ 3 0 _._ 772 _±_ 2 _._ 956e _−_ 3
mean patchtsmixer 0 _._ 686 _±_ 1 _._ 272e _−_ 2 0 _._ 775 _±_ 2 _._ 779e _−_ 2 0 _._ 679 _±_ 7 _._ 18e _−_ 3 0 _._ 81 _±_ 1 _._ 601e _−_ 2
mean timemixer 0 _._ 667 _±_ 5 _._ 537e _−_ 3 0 _._ 708 _±_ 1 _._ 183e _−_ 2 0 _._ 649 _±_ 6 _._ 057e _−_ 3 0 _._ 754 _±_ 1 _._ 358e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 795 _±_ 4 _._ 985e _−_ 3 0 _._ 936 _±_ 5 _._ 18e _−_ 3 0 _._ 775 _±_ 1 _._ 182e _−_ 3 0 _._ 943 _±_ 2 _._ 763e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 793 _±_ 2 _._ 168e _−_ 3 0 _._ 951 _±_ 5 _._ 7e _−_ 4 0 _._ 771 _±_ 1 _._ 56e _−_ 3 0 _._ 951 _±_ 2 _._ 646e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 788 _±_ 1 _._ 265e _−_ 3 0 _._ 947 _±_ 7 _._ 808e _−_ 4 0 _._ 769 _±_ 1 _._ 909e _−_ 3 0 _._ 945 _±_ 2 _._ 385e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 794 _±_ 8 _._ 153e _−_ 4 0 _._ 94 _±_ 3 _._ 354e _−_ 3 0 _._ 772 _±_ 1 _._ 13e _−_ 3 0 _._ 948 _±_ 2 _._ 62e _−_ 3
No ~~s~~ um ~~C~~ oT lstm 0 _._ 806 _±_ 6 _._ 248e _−_ 4 0 _._ 948 _±_ 4 _._ 444e _−_ 4 0 _._ 786 _±_ 8 _._ 689e _−_ 4 0 _._ 951 _±_ 5 _._ 341e _−_ 4
No ~~s~~ um ~~C~~ oT mlp 0 _._ 803 _±_ 0e0 0 _._ 948 _±_ 0e0 0 _._ 778 _±_ 0e0 0 _._ 948 _±_ 0e0
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 805 _±_ 1 _._ 274e _−_ 4 0 _._ 95 _±_ 1 _._ 266e _−_ 3 0 _._ 781 _±_ 4 _._ 933e _−_ 4 0 _._ 95 _±_ 1 _._ 188e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 807 _±_ 9 _._ 986e _−_ 4 0 _._ 943 _±_ 5 _._ 289e _−_ 4 0 _._ 796 _±_ 1 _._ 695e _−_ 3 0 _._ 938 _±_ 4 _._ 941e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 798 _±_ 3 _._ 219e _−_ 3 0 _._ 937 _±_ 1 _._ 662e _−_ 3 0 _._ 783 _±_ 7 _._ 751e _−_ 4 0 _._ 938 _±_ 1 _._ 566e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 793 _±_ 6 _._ 338e _−_ 4 0 _._ 951 _±_ 1 _._ 252e _−_ 3 0 _._ 771 _±_ 2 _._ 683e _−_ 3 0 _._ 951 _±_ 2 _._ 63e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 787 _±_ 1 _._ 883e _−_ 3 0 _._ 95 _±_ 2 _._ 141e _−_ 3 0 _._ 773 _±_ 8 _._ 41e _−_ 4 0 _._ 942 _±_ 1 _._ 64e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 792 _±_ 3 _._ 412e _−_ 4 0 _._ 945 _±_ 1 _._ 421e _−_ 3 0 _._ 777 _±_ 1 _._ 567e _−_ 3 0 _._ 941 _±_ 5 _._ 876e _−_ 3
No ~~s~~ um ~~I~~ CD lstm 0 _._ 805 _±_ 3 _._ 356e _−_ 4 0 _._ 942 _±_ 6 _._ 258e _−_ 4 0 _._ 79 _±_ 1 _._ 22e _−_ 3 0 _._ 941 _±_ 2 _._ 926e _−_ 4
No ~~s~~ um ~~I~~ CD mlp 0 _._ 802 _±_ 0e0 0 _._ 948 _±_ 0e0 0 _._ 782 _±_ 0e0 0 _._ 945 _±_ 0e0
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 805 _±_ 9 _._ 485e _−_ 4 0 _._ 953 _±_ 8 _._ 13e _−_ 4 0 _._ 785 _±_ 1 _._ 948e _−_ 3 0 _._ 947 _±_ 7 _._ 304e _−_ 4
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 811 _±_ 3 _._ 35e _−_ 4 0 _._ 942 _±_ 3 _._ 166e _−_ 4 0 _._ 794 _±_ 3 _._ 853e _−_ 4 0 _._ 936 _±_ 7 _._ 954e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 8 _±_ 7 _._ 995e _−_ 4 0 _._ 936 _±_ 1 _._ 19e _−_ 3 0 _._ 776 _±_ 2 _._ 982e _−_ 3 0 _._ 939 _±_ 6 _._ 048e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 791 _±_ 2 _._ 368e _−_ 3 0 _._ 951 _±_ 1 _._ 239e _−_ 3 0 _._ 771 _±_ 4 _._ 85e _−_ 3 0 _._ 947 _±_ 2 _._ 446e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 789 _±_ 1 _._ 329e _−_ 3 0 _._ 946 _±_ 2 _._ 136e _−_ 3 0 _._ 769 _±_ 1 _._ 466e _−_ 3 0 _._ 945 _±_ 1 _._ 707e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 791 _±_ 3 _._ 189e _−_ 3 0 _._ 943 _±_ 2 _._ 13e _−_ 3 0 _._ 777 _±_ 4 _._ 916e _−_ 3 0 _._ 939 _±_ 6 _._ 115e _−_ 3


Table 32: Cross-site transfer results - Lab. (part 1/2)


48


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**f1** **micro** **recall** **micro** **f1** ~~**m**~~ **icro** **recall** **micro**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 805 _±_ 8 _._ 298e _−_ 4 0 _._ 944 _±_ 1 _._ 776e _−_ 3 0 _._ 78 _±_ 3 _._ 98e _−_ 4 0 _._ 953 _±_ 5 _._ 442e _−_ 4
No ~~s~~ um ~~T~~ rend mlp 0 _._ 8 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 779 _±_ 0e0 0 _._ 946 _±_ 0e0
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 807 _±_ 7 _._ 472e _−_ 4 0 _._ 95 _±_ 9 _._ 666e _−_ 4 0 _._ 779 _±_ 2 _._ 562e _−_ 3 0 _._ 948 _±_ 1 _._ 084e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 808 _±_ 1 _._ 079e _−_ 3 0 _._ 941 _±_ 4 _._ 553e _−_ 4 0 _._ 789 _±_ 7 _._ 168e _−_ 4 0 _._ 937 _±_ 1 _._ 581e _−_ 3
medgemma CoT +TFM lstm 0 _._ 779 _±_ 3 _._ 345e _−_ 3 0 _._ 955 _±_ 5 _._ 752e _−_ 3 0 _._ 775 _±_ 1 _._ 652e _−_ 3 0 _._ 94 _±_ 2 _._ 151e _−_ 3
medgemma CoT +TFM mlp 0 _._ 783 _±_ 4 _._ 335e _−_ 4 0 _._ 957 _±_ 7 _._ 516e _−_ 4 0 _._ 771 _±_ 1 _._ 904e _−_ 3 0 _._ 949 _±_ 2 _._ 446e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 778 _±_ 4 _._ 118e _−_ 3 0 _._ 958 _±_ 2 _._ 585e _−_ 3 0 _._ 766 _±_ 2 _._ 887e _−_ 3 0 _._ 952 _±_ 4 _._ 626e _−_ 3
medgemma CoT +TFM timemixer 0 _._ 78 _±_ 1 _._ 849e _−_ 3 0 _._ 956 _±_ 3 _._ 352e _−_ 3 0 _._ 772 _±_ 5 _._ 854e _−_ 3 0 _._ 944 _±_ 8 _._ 061e _−_ 3
medgemma CoT lstm 0 _._ 797 _±_ 2 _._ 765e _−_ 3 0 _._ 946 _±_ 1 _._ 407e _−_ 3 0 _._ 774 _±_ 2 _._ 348e _−_ 3 0 _._ 951 _±_ 9 _._ 214e _−_ 3
medgemma CoT mlp 0 _._ 797 _±_ 0e0 0 _._ 947 _±_ 0e0 0 _._ 774 _±_ 0e0 0 _._ 949 _±_ 0e0
medgemma CoT patchtsmixer 0 _._ 799 _±_ 0e0 0 _._ 954 _±_ 0e0 0 _._ 774 _±_ 0e0 0 _._ 949 _±_ 0e0
medgemma CoT timemixer 0 _._ 796 _±_ 0e0 0 _._ 952 _±_ 0e0 0 _._ 776 _±_ 0e0 0 _._ 946 _±_ 0e0
medgemma ICD +TFM lstm 0 _._ 77 _±_ 8 _._ 732e _−_ 4 0 _._ 966 _±_ 2 _._ 587e _−_ 3 0 _._ 772 _±_ 1 _._ 314e _−_ 3 0 _._ 944 _±_ 2 _._ 011e _−_ 3
medgemma ICD +TFM mlp 0 _._ 774 _±_ 2 _._ 889e _−_ 3 0 _._ 963 _±_ 2 _._ 689e _−_ 3 0 _._ 764 _±_ 7 _._ 353e _−_ 4 0 _._ 957 _±_ 1 _._ 034e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 771 _±_ 8 _._ 649e _−_ 4 0 _._ 964 _±_ 1 _._ 031e _−_ 3 0 _._ 76 _±_ 3 _._ 556e _−_ 3 0 _._ 958 _±_ 4 _._ 775e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 77 _±_ 6 _._ 629e _−_ 4 0 _._ 968 _±_ 8 _._ 445e _−_ 4 0 _._ 771 _±_ 2 _._ 011e _−_ 3 0 _._ 949 _±_ 1 _._ 917e _−_ 3
medgemma ICD lstm 0 _._ 791 _±_ 3 _._ 62e _−_ 3 0 _._ 946 _±_ 1 _._ 039e _−_ 3 0 _._ 777 _±_ 5 _._ 636e _−_ 3 0 _._ 945 _±_ 4 _._ 801e _−_ 3
medgemma ICD mlp 0 _._ 789 _±_ 0e0 0 _._ 95 _±_ 0e0 0 _._ 771 _±_ 0e0 0 _._ 95 _±_ 0e0
medgemma ICD patchtsmixer 0 _._ 788 _±_ 0e0 0 _._ 957 _±_ 0e0 0 _._ 775 _±_ 0e0 0 _._ 952 _±_ 0e0
medgemma ICD timemixer 0 _._ 786 _±_ 0e0 0 _._ 958 _±_ 0e0 0 _._ 776 _±_ 0e0 0 _._ 949 _±_ 0e0
medgemma Trend +TFM lstm 0 _._ 779 _±_ 5 _._ 745e _−_ 3 0 _._ 954 _±_ 1 _._ 007e _−_ 2 0 _._ 773 _±_ 4 _._ 056e _−_ 3 0 _._ 94 _±_ 2 _._ 083e _−_ 3
medgemma Trend +TFM mlp 0 _._ 78 _±_ 1 _._ 057e _−_ 3 0 _._ 958 _±_ 1 _._ 437e _−_ 3 0 _._ 773 _±_ 1 _._ 767e _−_ 3 0 _._ 944 _±_ 8 _._ 65e _−_ 4
medgemma Trend +TFM patchtsmixer 0 _._ 784 _±_ 6 _._ 558e _−_ 4 0 _._ 951 _±_ 1 _._ 35e _−_ 4 0 _._ 764 _±_ 1 _._ 626e _−_ 3 0 _._ 952 _±_ 3 _._ 448e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 775 _±_ 5 _._ 554e _−_ 4 0 _._ 963 _±_ 1 _._ 068e _−_ 3 0 _._ 77 _±_ 1 _._ 111e _−_ 3 0 _._ 947 _±_ 2 _._ 364e _−_ 4
medgemma Trend lstm 0 _._ 797 _±_ 2 _._ 411e _−_ 3 0 _._ 942 _±_ 2 _._ 284e _−_ 3 0 _._ 784 _±_ 6 _._ 873e _−_ 3 0 _._ 938 _±_ 1 _._ 287e _−_ 3
medgemma Trend mlp 0 _._ 793 _±_ 0e0 0 _._ 946 _±_ 0e0 0 _._ 781 _±_ 0e0 0 _._ 936 _±_ 0e0
medgemma Trend patchtsmixer 0 _._ 796 _±_ 0e0 0 _._ 951 _±_ 0e0 0 _._ 785 _±_ 0e0 0 _._ 941 _±_ 0e0
medgemma Trend timemixer 0 _._ 796 _±_ 0e0 0 _._ 95 _±_ 0e0 0 _._ 787 _±_ 0e0 0 _._ 94 _±_ 0e0
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 772 _±_ 2 _._ 638e _−_ 3 0 _._ 964 _±_ 5 _._ 331e _−_ 3 0 _._ 775 _±_ 3 _._ 988e _−_ 3 0 _._ 942 _±_ 3 _._ 711e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 777 _±_ 9 _._ 697e _−_ 4 0 _._ 962 _±_ 1 _._ 42e _−_ 3 0 _._ 769 _±_ 1 _._ 61e _−_ 3 0 _._ 953 _±_ 1 _._ 657e _−_ 3
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 773 _±_ 3 _._ 995e _−_ 4 0 _._ 963 _±_ 5 _._ 138e _−_ 4 0 _._ 761 _±_ 1 _._ 3e _−_ 3 0 _._ 96 _±_ 2 _._ 928e _−_ 4
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 774 _±_ 6 _._ 375e _−_ 3 0 _._ 961 _±_ 7 _._ 042e _−_ 3 0 _._ 768 _±_ 3 _._ 265e _−_ 3 0 _._ 952 _±_ 2 _._ 319e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 793 _±_ 2 _._ 093e _−_ 3 0 _._ 947 _±_ 7 _._ 361e _−_ 3 0 _._ 777 _±_ 8 _._ 91e _−_ 4 0 _._ 943 _±_ 8 _._ 026e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 791 _±_ 0e0 0 _._ 952 _±_ 0e0 0 _._ 773 _±_ 0e0 0 _._ 95 _±_ 0e0
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 791 _±_ 0e0 0 _._ 958 _±_ 0e0 0 _._ 776 _±_ 0e0 0 _._ 951 _±_ 0e0
medgemma zero ~~s~~ hot timemixer 0 _._ 793 _±_ 0e0 0 _._ 953 _±_ 0e0 0 _._ 78 _±_ 0e0 0 _._ 946 _±_ 0e0
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM lstm 0 _._ 797 _±_ 5 _._ 88e _−_ 4 0 _._ 936 _±_ 4 _._ 818e _−_ 4 0 _._ 772 _±_ 9 _._ 725e _−_ 4 0 _._ 945 _±_ 2 _._ 726e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM mlp 0 _._ 787 _±_ 3 _._ 481e _−_ 3 0 _._ 954 _±_ 2 _._ 038e _−_ 3 0 _._ 772 _±_ 5 _._ 512e _−_ 3 0 _._ 943 _±_ 4 _._ 855e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 787 _±_ 1 _._ 369e _−_ 3 0 _._ 948 _±_ 7 _._ 006e _−_ 4 0 _._ 768 _±_ 6 _._ 24e _−_ 4 0 _._ 947 _±_ 1 _._ 247e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM timemixer 0 _._ 793 _±_ 4 _._ 514e _−_ 3 0 _._ 941 _±_ 3 _._ 638e _−_ 3 0 _._ 774 _±_ 2 _._ 981e _−_ 3 0 _._ 942 _±_ 4 _._ 471e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 808 _±_ 9 _._ 673e _−_ 4 0 _._ 939 _±_ 1 _._ 164e _−_ 3 0 _._ 787 _±_ 4 _._ 993e _−_ 4 0 _._ 95 _±_ 8 _._ 082e _−_ 4
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 8 _±_ 0e0 0 _._ 947 _±_ 0e0 0 _._ 775 _±_ 0e0 0 _._ 946 _±_ 0e0
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 807 _±_ 1 _._ 189e _−_ 3 0 _._ 948 _±_ 5 _._ 173e _−_ 4 0 _._ 781 _±_ 1 _._ 305e _−_ 3 0 _._ 946 _±_ 1 _._ 944e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 807 _±_ 9 _._ 704e _−_ 4 0 _._ 941 _±_ 1 _._ 385e _−_ 3 0 _._ 789 _±_ 5 _._ 1e _−_ 4 0 _._ 943 _±_ 1 _._ 549e _−_ 3
right lstm 0 _._ 711 _±_ 1 _._ 256e _−_ 3 0 _._ 913 _±_ 1 _._ 471e _−_ 3 0 _._ 715 _±_ 7 _._ 657e _−_ 3 0 _._ 955 _±_ 1 _._ 734e _−_ 2
right mlp 0 _._ 723 _±_ 8 _._ 389e _−_ 3 0 _._ 938 _±_ 2 _._ 397e _−_ 2 0 _._ 663 _±_ 1 _._ 991e _−_ 2 0 _._ 813 _±_ 5 _._ 145e _−_ 2
right patchtsmixer 0 _._ 719 _±_ 3 _._ 188e _−_ 3 0 _._ 879 _±_ 1 _._ 593e _−_ 2 0 _._ 692 _±_ 1 _._ 36e _−_ 2 0 _._ 823 _±_ 2 _._ 478e _−_ 2
right timemixer 0 _._ 689 _±_ 9 _._ 4e _−_ 3 0 _._ 8 _±_ 4 _._ 114e _−_ 2 0 _._ 671 _±_ 8 _._ 889e _−_ 3 0 _._ 797 _±_ 2 _._ 827e _−_ 2


Table 33: Cross-site transfer results - Lab. (part 2/2)


49


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**masked** **mae** **masked** ~~**m**~~ **se** **masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se** **masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se**


Llama-3.1 CoT +TFM lstm 0 _._ 073 _±_ 1 _._ 4e _−_ 3 0 _._ 014 _±_ 3 _._ 704e _−_ 4 0 _._ 093 _±_ 8 _._ 415e _−_ 4 0 _._ 018 _±_ 2 _._ 152e _−_ 4 0 _._ 074 _±_ 8 _._ 799e _−_ 4 0 _._ 015 _±_ 2 _._ 152e _−_ 4
Llama-3.1 CoT +TFM mlp 0 _._ 078 _±_ 2 _._ 696e _−_ 4 0 _._ 013 _±_ 7 _._ 234e _−_ 5 0 _._ 096 _±_ 3 _._ 704e _−_ 4 0 _._ 018 _±_ 1 _._ 193e _−_ 4 0 _._ 08 _±_ 8 _._ 415e _−_ 4 0 _._ 015 _±_ 2 _._ 801e _−_ 4
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 125 _±_ 7 _._ 892e _−_ 4 0 _._ 028 _±_ 3 _._ 819e _−_ 4 0 _._ 139 _±_ 9 _._ 019e _−_ 4 0 _._ 033 _±_ 4 _._ 1e _−_ 4 0 _._ 455 _±_ 7 _._ 315e _−_ 2 0 _._ 339 _±_ 9 _._ 426e _−_ 2
Llama-3.1 CoT +TFM timemixer 0 _._ 077 _±_ 7 _._ 422e _−_ 4 0 _._ 013 _±_ 2 _._ 196e _−_ 4 0 _._ 094 _±_ 3 _._ 646e _−_ 4 0 _._ 018 _±_ 2 _._ 452e _−_ 4 0 _._ 109 _±_ 6 _._ 269e _−_ 4 0 _._ 021 _±_ 2 _._ 065e _−_ 4
Llama-3.1 CoT lstm 0 _._ 075 _±_ 4 _._ 255e _−_ 4 0 _._ 015 _±_ 1 _._ 569e _−_ 4 0 _._ 094 _±_ 4 _._ 84e _−_ 4 0 _._ 019 _±_ 1 _._ 787e _−_ 4 0 _._ 077 _±_ 6 _._ 466e _−_ 4 0 _._ 017 _±_ 1 _._ 758e _−_ 4
Llama-3.1 CoT mlp 0 _._ 077 _±_ 6 _._ 316e _−_ 4 0 _._ 015 _±_ 1 _._ 471e _−_ 4 0 _._ 095 _±_ 5 _._ 053e _−_ 4 0 _._ 019 _±_ 1 _._ 637e _−_ 4 0 _._ 078 _±_ 4 _._ 155e _−_ 4 0 _._ 016 _±_ 1 _._ 392e _−_ 4
Llama-3.1 CoT patchtsmixer 0 _._ 114 _±_ 1 _._ 501e _−_ 3 0 _._ 024 _±_ 4 _._ 802e _−_ 4 0 _._ 131 _±_ 1 _._ 895e _−_ 4 0 _._ 03 _±_ 2 _._ 291e _−_ 4 0 _._ 102 _±_ 5 _._ 067e _−_ 3 0 _._ 021 _±_ 1 _._ 382e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 079 _±_ 1 _._ 151e _−_ 3 0 _._ 015 _±_ 3 _._ 293e _−_ 4 0 _._ 098 _±_ 1 _._ 675e _−_ 3 0 _._ 02 _±_ 5 _._ 097e _−_ 4 0 _._ 09 _±_ 9 _._ 862e _−_ 4 0 _._ 018 _±_ 2 _._ 485e _−_ 4
Llama-3.1 ICD +TFM lstm 0 _._ 074 _±_ 7 _._ 703e _−_ 4 0 _._ 014 _±_ 1 _._ 793e _−_ 4 0 _._ 094 _±_ 3 _._ 676e _−_ 4 0 _._ 019 _±_ 1 _._ 301e _−_ 4 0 _._ 074 _±_ 1 _._ 087e _−_ 3 0 _._ 015 _±_ 2 _._ 811e _−_ 4
Llama-3.1 ICD +TFM mlp 0 _._ 079 _±_ 1 _._ 656e _−_ 4 0 _._ 014 _±_ 3 _._ 786e _−_ 5 0 _._ 097 _±_ 4 _._ 725e _−_ 4 0 _._ 019 _±_ 1 _._ 769e _−_ 4 0 _._ 08 _±_ 1 _._ 747e _−_ 4 0 _._ 015 _±_ 6 _._ 11e _−_ 5
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 125 _±_ 2 _._ 646e _−_ 5 0 _._ 028 _±_ 1 _._ 473e _−_ 4 0 _._ 14 _±_ 1 _._ 908e _−_ 4 0 _._ 034 _±_ 1 _._ 058e _−_ 4 0 _._ 453 _±_ 9 _._ 85e _−_ 2 0 _._ 338 _±_ 1 _._ 324e _−_ 1
Llama-3.1 ICD +TFM timemixer 0 _._ 077 _±_ 4 _._ 784e _−_ 4 0 _._ 013 _±_ 1 _._ 877e _−_ 4 0 _._ 095 _±_ 2 _._ 836e _−_ 4 0 _._ 018 _±_ 2 _._ 001e _−_ 4 0 _._ 109 _±_ 8 _._ 773e _−_ 4 0 _._ 021 _±_ 3 _._ 139e _−_ 4
Llama-3.1 ICD lstm 0 _._ 074 _±_ 3 _._ 806e _−_ 4 0 _._ 015 _±_ 7 _._ 848e _−_ 5 0 _._ 095 _±_ 5 _._ 013e _−_ 4 0 _._ 02 _±_ 1 _._ 673e _−_ 4 0 _._ 076 _±_ 7 _._ 454e _−_ 4 0 _._ 016 _±_ 2 _._ 512e _−_ 4
Llama-3.1 ICD mlp 0 _._ 077 _±_ 6 _._ 549e _−_ 4 0 _._ 015 _±_ 2 _._ 034e _−_ 4 0 _._ 096 _±_ 5 _._ 709e _−_ 4 0 _._ 02 _±_ 1 _._ 431e _−_ 4 0 _._ 078 _±_ 4 _._ 151e _−_ 4 0 _._ 016 _±_ 1 _._ 066e _−_ 4
Llama-3.1 ICD patchtsmixer 0 _._ 115 _±_ 9 _._ 215e _−_ 4 0 _._ 024 _±_ 2 _._ 721e _−_ 4 0 _._ 13 _±_ 1 _._ 749e _−_ 3 0 _._ 03 _±_ 6 _._ 951e _−_ 4 0 _._ 1 _±_ 5 _._ 492e _−_ 3 0 _._ 021 _±_ 1 _._ 42e _−_ 3
Llama-3.1 ICD timemixer 0 _._ 079 _±_ 5 _._ 826e _−_ 4 0 _._ 015 _±_ 2 _._ 47e _−_ 4 0 _._ 098 _±_ 8 _._ 147e _−_ 4 0 _._ 02 _±_ 1 _._ 876e _−_ 4 0 _._ 088 _±_ 4 _._ 189e _−_ 4 0 _._ 017 _±_ 1 _._ 237e _−_ 4
Llama-3.1 Trend +TFM lstm 0 _._ 074 _±_ 1 _._ 042e _−_ 3 0 _._ 014 _±_ 1 _._ 662e _−_ 4 0 _._ 094 _±_ 4 _._ 75e _−_ 4 0 _._ 019 _±_ 1 _._ 803e _−_ 4 0 _._ 073 _±_ 8 _._ 15e _−_ 4 0 _._ 014 _±_ 2 _._ 974e _−_ 4
Llama-3.1 Trend +TFM mlp 0 _._ 079 _±_ 6 _._ 755e _−_ 4 0 _._ 014 _±_ 2 _._ 344e _−_ 4 0 _._ 097 _±_ 3 _._ 592e _−_ 4 0 _._ 019 _±_ 1 _._ 127e _−_ 4 0 _._ 08 _±_ 1 _._ 446e _−_ 3 0 _._ 015 _±_ 4 _._ 917e _−_ 4
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 125 _±_ 1 _._ 351e _−_ 3 0 _._ 028 _±_ 4 _._ 681e _−_ 4 0 _._ 14 _±_ 1 _._ 02e _−_ 3 0 _._ 034 _±_ 3 _._ 47e _−_ 4 0 _._ 39 _±_ 1 _._ 236e _−_ 2 0 _._ 275 _±_ 1 _._ 994e _−_ 2
Llama-3.1 Trend +TFM timemixer 0 _._ 077 _±_ 3 _._ 602e _−_ 4 0 _._ 013 _±_ 4e _−_ 5 0 _._ 095 _±_ 2 _._ 159e _−_ 4 0 _._ 018 _±_ 2 _._ 517e _−_ 5 0 _._ 108 _±_ 1 _._ 084e _−_ 3 0 _._ 021 _±_ 4 _._ 368e _−_ 4
Llama-3.1 Trend lstm 0 _._ 074 _±_ 3 _._ 203e _−_ 4 0 _._ 014 _±_ 9 _._ 574e _−_ 6 0 _._ 094 _±_ 4 _._ 096e _−_ 4 0 _._ 019 _±_ 1 _._ 576e _−_ 4 0 _._ 076 _±_ 1 _._ 132e _−_ 3 0 _._ 016 _±_ 2 _._ 965e _−_ 4
Llama-3.1 Trend mlp 0 _._ 076 _±_ 1 _._ 679e _−_ 4 0 _._ 014 _±_ 9 _._ 179e _−_ 5 0 _._ 096 _±_ 2 _._ 505e _−_ 4 0 _._ 019 _±_ 1 _._ 044e _−_ 4 0 _._ 078 _±_ 6 _._ 638e _−_ 4 0 _._ 016 _±_ 1 _._ 73e _−_ 4
Llama-3.1 Trend patchtsmixer 0 _._ 114 _±_ 1 _._ 396e _−_ 3 0 _._ 024 _±_ 3 _._ 739e _−_ 4 0 _._ 13 _±_ 9 _._ 261e _−_ 4 0 _._ 029 _±_ 3 _._ 314e _−_ 4 0 _._ 095 _±_ 4 _._ 376e _−_ 3 0 _._ 019 _±_ 9 _._ 721e _−_ 4
Llama-3.1 Trend timemixer 0 _._ 078 _±_ 1 _._ 254e _−_ 3 0 _._ 015 _±_ 2 _._ 831e _−_ 4 0 _._ 097 _±_ 1 _._ 196e _−_ 3 0 _._ 02 _±_ 2 _._ 822e _−_ 4 0 _._ 089 _±_ 9 _._ 46e _−_ 4 0 _._ 017 _±_ 2 _._ 888e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 072 _±_ 7 _._ 624e _−_ 4 0 _._ 013 _±_ 2 _._ 021e _−_ 4 0 _._ 089 _±_ 1 _._ 266e _−_ 4 0 _._ 017 _±_ 6 _._ 807e _−_ 5 0 _._ 073 _±_ 4 _._ 245e _−_ 4 0 _._ 014 _±_ 1 _._ 677e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 075 _±_ 1 _._ 989e _−_ 3 0 _._ 012 _±_ 6 _._ 351e _−_ 4 0 _._ 092 _±_ 1 _._ 021e _−_ 3 0 _._ 017 _±_ 2 _._ 914e _−_ 4 0 _._ 077 _±_ 8 _._ 995e _−_ 4 0 _._ 014 _±_ 3 _._ 153e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 126 _±_ 9 _._ 015e _−_ 4 0 _._ 028 _±_ 2 _._ 178e _−_ 4 0 _._ 14 _±_ 1 _._ 091e _−_ 3 0 _._ 034 _±_ 3 _._ 46e _−_ 4 0 _._ 276 _±_ 1 _._ 287e _−_ 1 0 _._ 149 _±_ 1 _._ 026e _−_ 1
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 074 _±_ 3 _._ 95e _−_ 4 0 _._ 012 _±_ 1 _._ 015e _−_ 4 0 _._ 091 _±_ 2 _._ 234e _−_ 4 0 _._ 017 _±_ 1 _._ 274e _−_ 4 0 _._ 107 _±_ 1 _._ 173e _−_ 3 0 _._ 02 _±_ 5 _._ 33e _−_ 4
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 072 _±_ 3 _._ 809e _−_ 4 0 _._ 014 _±_ 9 _._ 106e _−_ 5 0 _._ 091 _±_ 2 _._ 923e _−_ 4 0 _._ 018 _±_ 1 _._ 134e _−_ 4 0 _._ 076 _±_ 1 _._ 052e _−_ 3 0 _._ 016 _±_ 2 _._ 92e _−_ 4
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 074 _±_ 4 _._ 196e _−_ 4 0 _._ 014 _±_ 9 _._ 946e _−_ 5 0 _._ 093 _±_ 3 _._ 957e _−_ 4 0 _._ 019 _±_ 1 _._ 445e _−_ 4 0 _._ 076 _±_ 4 _._ 853e _−_ 4 0 _._ 016 _±_ 1 _._ 447e _−_ 4
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 114 _±_ 1 _._ 306e _−_ 3 0 _._ 024 _±_ 5 _._ 302e _−_ 4 0 _._ 129 _±_ 2 _._ 36e _−_ 3 0 _._ 029 _±_ 8 _._ 739e _−_ 4 0 _._ 093 _±_ 3 _._ 283e _−_ 3 0 _._ 019 _±_ 5 _._ 885e _−_ 4
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 076 _±_ 1 _._ 425e _−_ 3 0 _._ 014 _±_ 3 _._ 643e _−_ 4 0 _._ 095 _±_ 1 _._ 243e _−_ 3 0 _._ 019 _±_ 2 _._ 466e _−_ 4 0 _._ 088 _±_ 1 _._ 194e _−_ 3 0 _._ 017 _±_ 3 _._ 195e _−_ 4
TFM lstm 0 _._ 075 _±_ 6 _._ 816e _−_ 4 0 _._ 015 _±_ 1 _._ 303e _−_ 4 0 _._ 094 _±_ 6 _._ 191e _−_ 5 0 _._ 019 _±_ 5 _._ 715e _−_ 5 0 _._ 075 _±_ 6 _._ 752e _−_ 4 0 _._ 016 _±_ 1 _._ 608e _−_ 4
TFM mlp 0 _._ 077 _±_ 3 _._ 99e _−_ 4 0 _._ 015 _±_ 8 _._ 921e _−_ 5 0 _._ 095 _±_ 3 _._ 025e _−_ 4 0 _._ 019 _±_ 5 _._ 737e _−_ 5 0 _._ 076 _±_ 4 _._ 834e _−_ 4 0 _._ 016 _±_ 6 _._ 683e _−_ 5
TFM patchtsmixer 0 _._ 126 _±_ 1 _._ 558e _−_ 3 0 _._ 028 _±_ 5 _._ 498e _−_ 4 0 _._ 132 _±_ 7 _._ 469e _−_ 3 0 _._ 03 _±_ 3 _._ 232e _−_ 3 0 _._ 142 _±_ 3 _._ 861e _−_ 3 0 _._ 036 _±_ 1 _._ 391e _−_ 3
TFM timemixer 0 _._ 076 _±_ 5 _._ 576e _−_ 4 0 _._ 014 _±_ 1 _._ 573e _−_ 4 0 _._ 095 _±_ 3 _._ 951e _−_ 4 0 _._ 019 _±_ 4 _._ 546e _−_ 5 0 _._ 102 _±_ 3 _._ 706e _−_ 3 0 _._ 02 _±_ 1 _._ 618e _−_ 3
TSDE lstm 0 _._ 066 _±_ 3 _._ 204e _−_ 4 0 _._ 012 _±_ 7 _._ 047e _−_ 5 0 _._ 072 _±_ 1 _._ 936e _−_ 4 0 _._ 012 _±_ 3 _._ 916e _−_ 5 0 _._ 052 _±_ 4 _._ 738e _−_ 4 0 _._ 009 _±_ 3 _._ 317e _−_ 5
TSDE mlp 0 _._ 067 _±_ 2 _._ 139e _−_ 4 0 _._ 011 _±_ 2 _._ 16e _−_ 5 0 _._ 073 _±_ 2 _._ 428e _−_ 4 0 _._ 012 _±_ 1 _._ 414e _−_ 5 0 _._ 054 _±_ 1 _._ 744e _−_ 4 0 _._ 008 _±_ 2 _._ 754e _−_ 5
TSDE patchtsmixer 0 _._ 127 _±_ 1 _._ 484e _−_ 3 0 _._ 029 _±_ 5 _._ 634e _−_ 4 0 _._ 103 _±_ 1 _._ 141e _−_ 2 0 _._ 02 _±_ 3 _._ 797e _−_ 3 0 _._ 177 _±_ 1 _._ 168e _−_ 2 0 _._ 053 _±_ 6 _._ 641e _−_ 3
TSDE timemixer 0 _._ 069 _±_ 8 _._ 416e _−_ 4 0 _._ 012 _±_ 7 _._ 416e _−_ 5 0 _._ 073 _±_ 2 _._ 546e _−_ 4 0 _._ 012 _±_ 2 _._ 944e _−_ 5 0 _._ 091 _±_ 4 _._ 927e _−_ 4 0 _._ 015 _±_ 1 _._ 533e _−_ 4
gemini-2.0-flash CoT +TFM lstm 0 _._ 07 _±_ 4 _._ 102e _−_ 4 0 _._ 012 _±_ 1 _._ 716e _−_ 4 0 _._ 091 _±_ 8 _._ 102e _−_ 4 0 _._ 017 _±_ 1 _._ 607e _−_ 4 0 _._ 072 _±_ 2 _._ 073e _−_ 3 0 _._ 014 _±_ 5 _._ 859e _−_ 4
gemini-2.0-flash CoT +TFM mlp 0 _._ 076 _±_ 2 _._ 954e _−_ 4 0 _._ 013 _±_ 8 _._ 888e _−_ 5 0 _._ 095 _±_ 1 _._ 234e _−_ 4 0 _._ 018 _±_ 6 _._ 429e _−_ 5 0 _._ 079 _±_ 2 _._ 364e _−_ 4 0 _._ 014 _±_ 4 _._ 933e _−_ 5
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 125 _±_ 1 _._ 115e _−_ 3 0 _._ 028 _±_ 3 _._ 247e _−_ 4 0 _._ 133 _±_ 1 _._ 085e _−_ 2 0 _._ 031 _±_ 4 _._ 64e _−_ 3 0 _._ 425 _±_ 3 _._ 751e _−_ 2 0 _._ 288 _±_ 5 _._ 694e _−_ 2
gemini-2.0-flash CoT +TFM timemixer 0 _._ 075 _±_ 4 _._ 59e _−_ 4 0 _._ 012 _±_ 1 _._ 058e _−_ 4 0 _._ 092 _±_ 8 _._ 083e _−_ 4 0 _._ 017 _±_ 2 _._ 371e _−_ 4 0 _._ 107 _±_ 8 _._ 752e _−_ 4 0 _._ 021 _±_ 4 _._ 05e _−_ 4
gemini-2.0-flash CoT lstm 0 _._ 072 _±_ 6 _._ 472e _−_ 4 0 _._ 013 _±_ 1 _._ 982e _−_ 4 0 _._ 091 _±_ 3 _._ 33e _−_ 4 0 _._ 018 _±_ 8 _._ 884e _−_ 5 0 _._ 072 _±_ 8 _._ 141e _−_ 4 0 _._ 014 _±_ 2 _._ 108e _−_ 4
gemini-2.0-flash CoT mlp 0 _._ 073 _±_ 4 _._ 444e _−_ 4 0 _._ 013 _±_ 1 _._ 389e _−_ 4 0 _._ 092 _±_ 2 _._ 359e _−_ 4 0 _._ 018 _±_ 9 _._ 815e _−_ 5 0 _._ 073 _±_ 3 _._ 309e _−_ 4 0 _._ 014 _±_ 6 _._ 551e _−_ 5
gemini-2.0-flash CoT patchtsmixer 0 _._ 112 _±_ 8 _._ 465e _−_ 4 0 _._ 023 _±_ 2 _._ 616e _−_ 4 0 _._ 128 _±_ 8 _._ 426e _−_ 4 0 _._ 029 _±_ 3 _._ 549e _−_ 4 0 _._ 097 _±_ 1 _._ 014e _−_ 2 0 _._ 019 _±_ 3 _._ 068e _−_ 3
gemini-2.0-flash CoT timemixer 0 _._ 076 _±_ 1 _._ 872e _−_ 3 0 _._ 014 _±_ 4 _._ 269e _−_ 4 0 _._ 093 _±_ 8 _._ 366e _−_ 4 0 _._ 018 _±_ 1 _._ 911e _−_ 4 0 _._ 084 _±_ 1 _._ 191e _−_ 3 0 _._ 015 _±_ 2 _._ 974e _−_ 4
gemini-2.0-flash ICD +TFM lstm 0 _._ 072 _±_ 6 _._ 045e _−_ 4 0 _._ 013 _±_ 2 _._ 179e _−_ 4 0 _._ 091 _±_ 5 _._ 595e _−_ 4 0 _._ 017 _±_ 8 _._ 963e _−_ 5 0 _._ 073 _±_ 2 _._ 059e _−_ 3 0 _._ 014 _±_ 6 _._ 668e _−_ 4
gemini-2.0-flash ICD +TFM mlp 0 _._ 078 _±_ 4 _._ 842e _−_ 4 0 _._ 013 _±_ 1 _._ 528e _−_ 4 0 _._ 094 _±_ 2 _._ 538e _−_ 4 0 _._ 017 _±_ 7 _._ 55e _−_ 5 0 _._ 08 _±_ 1 _._ 065e _−_ 3 0 _._ 014 _±_ 3 _._ 148e _−_ 4
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 124 _±_ 1 _._ 068e _−_ 3 0 _._ 028 _±_ 3 _._ 609e _−_ 4 0 _._ 139 _±_ 7 _._ 686e _−_ 4 0 _._ 033 _±_ 4 _._ 2e _−_ 4 0 _._ 379 _±_ 2 _._ 04e _−_ 2 0 _._ 229 _±_ 2 _._ 503e _−_ 2
gemini-2.0-flash ICD +TFM timemixer 0 _._ 074 _±_ 4 _._ 486e _−_ 4 0 _._ 012 _±_ 2 _._ 301e _−_ 4 0 _._ 093 _±_ 7 _._ 472e _−_ 4 0 _._ 017 _±_ 2 _._ 74e _−_ 4 0 _._ 107 _±_ 1 _._ 184e _−_ 3 0 _._ 021 _±_ 5 _._ 147e _−_ 4
gemini-2.0-flash ICD lstm 0 _._ 072 _±_ 1 _._ 111e _−_ 3 0 _._ 013 _±_ 2 _._ 629e _−_ 4 0 _._ 092 _±_ 1 _._ 443e _−_ 4 0 _._ 018 _±_ 8 _._ 287e _−_ 5 0 _._ 073 _±_ 4 _._ 526e _−_ 4 0 _._ 015 _±_ 9 _._ 142e _−_ 5
gemini-2.0-flash ICD mlp 0 _._ 074 _±_ 5 _._ 099e _−_ 4 0 _._ 013 _±_ 1 _._ 425e _−_ 4 0 _._ 093 _±_ 3 _._ 266e _−_ 4 0 _._ 018 _±_ 9 _._ 032e _−_ 5 0 _._ 074 _±_ 4 _._ 188e _−_ 4 0 _._ 015 _±_ 1 _._ 209e _−_ 4
gemini-2.0-flash ICD patchtsmixer 0 _._ 113 _±_ 5 _._ 735e _−_ 4 0 _._ 023 _±_ 1 _._ 782e _−_ 4 0 _._ 129 _±_ 5 _._ 676e _−_ 4 0 _._ 029 _±_ 3 _._ 551e _−_ 4 0 _._ 093 _±_ 1 _._ 037e _−_ 2 0 _._ 018 _±_ 2 _._ 615e _−_ 3
gemini-2.0-flash ICD timemixer 0 _._ 078 _±_ 2 _._ 33e _−_ 3 0 _._ 014 _±_ 4 _._ 438e _−_ 4 0 _._ 095 _±_ 1 _._ 849e _−_ 3 0 _._ 019 _±_ 4 _._ 16e _−_ 4 0 _._ 085 _±_ 7 _._ 941e _−_ 4 0 _._ 016 _±_ 1 _._ 919e _−_ 4
gemini-2.0-flash Trend +TFM lstm 0 _._ 072 _±_ 9 _._ 879e _−_ 4 0 _._ 013 _±_ 2 _._ 553e _−_ 4 0 _._ 093 _±_ 3 _._ 412e _−_ 4 0 _._ 018 _±_ 9e _−_ 5 0 _._ 073 _±_ 1 _._ 085e _−_ 3 0 _._ 014 _±_ 3 _._ 667e _−_ 4
gemini-2.0-flash Trend +TFM mlp 0 _._ 077 _±_ 1 _._ 128e _−_ 3 0 _._ 013 _±_ 3 _._ 963e _−_ 4 0 _._ 096 _±_ 3 _._ 723e _−_ 4 0 _._ 018 _±_ 1 _._ 345e _−_ 4 0 _._ 08 _±_ 9 _._ 753e _−_ 4 0 _._ 014 _±_ 3 _._ 279e _−_ 4
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 126 _±_ 4 _._ 194e _−_ 4 0 _._ 028 _±_ 2 _._ 052e _−_ 4 0 _._ 139 _±_ 3 _._ 086e _−_ 4 0 _._ 034 _±_ 2 _._ 179e _−_ 4 0 _._ 339 _±_ 3 _._ 58e _−_ 2 0 _._ 201 _±_ 3 _._ 404e _−_ 2
gemini-2.0-flash Trend +TFM timemixer 0 _._ 074 _±_ 1 _._ 176e _−_ 3 0 _._ 012 _±_ 3 _._ 675e _−_ 4 0 _._ 093 _±_ 8 _._ 504e _−_ 4 0 _._ 017 _±_ 1 _._ 986e _−_ 4 0 _._ 108 _±_ 3 _._ 383e _−_ 4 0 _._ 021 _±_ 1 _._ 557e _−_ 4
gemini-2.0-flash Trend lstm 0 _._ 072 _±_ 8 _._ 606e _−_ 4 0 _._ 014 _±_ 3 _._ 057e _−_ 4 0 _._ 092 _±_ 4 _._ 894e _−_ 4 0 _._ 018 _±_ 1 _._ 394e _−_ 4 0 _._ 073 _±_ 6 _._ 635e _−_ 4 0 _._ 015 _±_ 1 _._ 718e _−_ 4
gemini-2.0-flash Trend mlp 0 _._ 073 _±_ 2 _._ 54e _−_ 4 0 _._ 013 _±_ 9 _._ 747e _−_ 5 0 _._ 093 _±_ 6 _._ 64e _−_ 4 0 _._ 018 _±_ 2 _._ 25e _−_ 4 0 _._ 074 _±_ 3 _._ 777e _−_ 4 0 _._ 015 _±_ 1 _._ 139e _−_ 4
gemini-2.0-flash Trend patchtsmixer 0 _._ 114 _±_ 1 _._ 558e _−_ 3 0 _._ 024 _±_ 5 _._ 443e _−_ 4 0 _._ 129 _±_ 7 _._ 93e _−_ 4 0 _._ 029 _±_ 3 _._ 429e _−_ 4 0 _._ 089 _±_ 2 _._ 222e _−_ 3 0 _._ 017 _±_ 4 _._ 8e _−_ 4
gemini-2.0-flash Trend timemixer 0 _._ 077 _±_ 9 _._ 486e _−_ 4 0 _._ 014 _±_ 2 _._ 533e _−_ 4 0 _._ 094 _±_ 5 _._ 857e _−_ 4 0 _._ 018 _±_ 1 _._ 921e _−_ 4 0 _._ 086 _±_ 3 _._ 859e _−_ 4 0 _._ 016 _±_ 2 _._ 121e _−_ 4
gemini-2.0-flash zero shot +TFM lstm 0 _._ 07 _±_ 1 _._ 208e _−_ 3 0 _._ 012 _±_ 5 _._ 456e _−_ 4 0 _._ 091 _±_ 5 _._ 216e _−_ 4 0 _._ 017 _±_ 1 _._ 674e _−_ 4 0 _._ 071 _±_ 9 _._ 767e _−_ 4 0 _._ 013 _±_ 3 _._ 25e _−_ 4
gemini-2.0-flash zero shot +TFM mlp 0 _._ 076 _±_ 7 _._ 953e _−_ 4 0 _._ 012 _±_ 2 _._ 754e _−_ 4 0 _._ 093 _±_ 5 _._ 311e _−_ 4 0 _._ 017 _±_ 1 _._ 45e _−_ 4 0 _._ 078 _±_ 6 _._ 503e _−_ 4 0 _._ 014 _±_ 1 _._ 682e _−_ 4
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 125 _±_ 1 _._ 584e _−_ 3 0 _._ 028 _±_ 4 _._ 748e _−_ 4 0 _._ 138 _±_ 1 _._ 492e _−_ 3 0 _._ 033 _±_ 6 _._ 374e _−_ 4 0 _._ 316 _±_ 1 _._ 156e _−_ 2 0 _._ 182 _±_ 1 _._ 268e _−_ 2
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 073 _±_ 4 _._ 336e _−_ 4 0 _._ 012 _±_ 1 _._ 443e _−_ 4 0 _._ 091 _±_ 2 _._ 318e _−_ 4 0 _._ 017 _±_ 1 _._ 015e _−_ 4 0 _._ 105 _±_ 9e _−_ 5 0 _._ 02 _±_ 7 _._ 506e _−_ 5
gemini-2.0-flash zero shot lstm 0 _._ 07 _±_ 5 _._ 497e _−_ 4 0 _._ 013 _±_ 1 _._ 687e _−_ 4 0 _._ 09 _±_ 4 _._ 867e _−_ 4 0 _._ 018 _±_ 1 _._ 187e _−_ 4 0 _._ 071 _±_ 6 _._ 809e _−_ 4 0 _._ 014 _±_ 7 _._ 455e _−_ 5
gemini-2.0-flash zero shot mlp 0 _._ 073 _±_ 1 _._ 195e _−_ 3 0 _._ 013 _±_ 3 _._ 206e _−_ 4 0 _._ 091 _±_ 4 _._ 109e _−_ 4 0 _._ 018 _±_ 1 _._ 258e _−_ 4 0 _._ 072 _±_ 7 _._ 889e _−_ 4 0 _._ 014 _±_ 2 _._ 163e _−_ 4
gemini-2.0-flash zero shot patchtsmixer 0 _._ 112 _±_ 7 _._ 7e _−_ 4 0 _._ 023 _±_ 3 _._ 372e _−_ 4 0 _._ 128 _±_ 8 _._ 403e _−_ 4 0 _._ 028 _±_ 2 _._ 666e _−_ 4 0 _._ 088 _±_ 6 _._ 003e _−_ 3 0 _._ 017 _±_ 1 _._ 257e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 074 _±_ 1 _._ 52e _−_ 3 0 _._ 013 _±_ 3 _._ 207e _−_ 4 0 _._ 093 _±_ 1 _._ 556e _−_ 3 0 _._ 018 _±_ 3 _._ 88e _−_ 4 0 _._ 083 _±_ 1 _._ 11e _−_ 3 0 _._ 015 _±_ 3 _._ 31e _−_ 4
interp lstm 0 _._ 051 _±_ 5 _._ 768e _−_ 4 0 _._ 008 _±_ 7 _._ 958e _−_ 5 0 _._ 068 _±_ 1 _._ 974e _−_ 4 0 _._ 011 _±_ 4 _._ 992e _−_ 5 0 _._ 048 _±_ 2 _._ 052e _−_ 4 0 _._ 008 _±_ 2 _._ 217e _−_ 5
interp mlp 0 _._ 06 _±_ 2 _._ 003e _−_ 3 0 _._ 009 _±_ 2 _._ 888e _−_ 4 0 _._ 075 _±_ 1 _._ 632e _−_ 4 0 _._ 013 _±_ 3 _._ 916e _−_ 5 0 _._ 054 _±_ 2 _._ 749e _−_ 4 0 _._ 009 _±_ 4 _._ 243e _−_ 5
interp patchtsmixer 0 _._ 184 _±_ 4 _._ 418e _−_ 3 0 _._ 435 _±_ 2 _._ 706e _−_ 2 0 _._ 142 _±_ 2 _._ 662e _−_ 2 0 _._ 103 _±_ 7 _._ 948e _−_ 2 0 _._ 117 _±_ 1 _._ 12e _−_ 2 0 _._ 133 _±_ 4 _._ 628e _−_ 2
interp timemixer 0 _._ 231 _±_ 1 _._ 652e _−_ 2 0 _._ 121 _±_ 1 _._ 241e _−_ 2 0 _._ 19 _±_ 4 _._ 754e _−_ 3 0 _._ 082 _±_ 3 _._ 223e _−_ 3 0 _._ 319 _±_ 3 _._ 802e _−_ 3 0 _._ 22 _±_ 4 _._ 306e _−_ 3
mean lstm 0 _._ 05 _±_ 3 _._ 677e _−_ 4 0 _._ 007 _±_ 6 _._ 557e _−_ 5 0 _._ 069 _±_ 1 _._ 621e _−_ 4 0 _._ 012 _±_ 6 _._ 455e _−_ 5 0 _._ 049 _±_ 4 _._ 51e _−_ 4 0 _._ 008 _±_ 4 _._ 193e _−_ 5
mean mlp 0 _._ 054 _±_ 3 _._ 937e _−_ 4 0 _._ 008 _±_ 3 _._ 697e _−_ 5 0 _._ 072 _±_ 6 _._ 137e _−_ 5 0 _._ 012 _±_ 2 _._ 16e _−_ 5 0 _._ 051 _±_ 7 _._ 141e _−_ 5 0 _._ 008 _±_ 1 _._ 414e _−_ 5
mean patchtsmixer 0 _._ 106 _±_ 3 _._ 928e _−_ 4 0 _._ 04 _±_ 2 _._ 229e _−_ 4 0 _._ 108 _±_ 2 _._ 447e _−_ 4 0 _._ 035 _±_ 4 _._ 372e _−_ 4 0 _._ 082 _±_ 4 _._ 109e _−_ 4 0 _._ 028 _±_ 2 _._ 391e _−_ 4
mean timemixer 0 _._ 195 _±_ 1 _._ 005e _−_ 2 0 _._ 09 _±_ 7 _._ 819e _−_ 3 0 _._ 165 _±_ 1 _._ 271e _−_ 3 0 _._ 06 _±_ 7 _._ 447e _−_ 4 0 _._ 262 _±_ 3 _._ 148e _−_ 2 0 _._ 167 _±_ 2 _._ 992e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 065 _±_ 5 _._ 46e _−_ 4 0 _._ 011 _±_ 9 _._ 165e _−_ 5 0 _._ 083 _±_ 5 _._ 05e _−_ 4 0 _._ 015 _±_ 1 _._ 514e _−_ 4 0 _._ 064 _±_ 1 _._ 559e _−_ 3 0 _._ 011 _±_ 4 _._ 406e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 068 _±_ 1 _._ 489e _−_ 3 0 _._ 01 _±_ 3 _._ 9e _−_ 4 0 _._ 084 _±_ 1 _._ 162e _−_ 3 0 _._ 014 _±_ 2 _._ 957e _−_ 4 0 _._ 067 _±_ 1 _._ 8e _−_ 3 0 _._ 011 _±_ 4 _._ 652e _−_ 4
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 124 _±_ 4 _._ 937e _−_ 4 0 _._ 027 _±_ 5 _._ 429e _−_ 4 0 _._ 13 _±_ 1 _._ 521e _−_ 2 0 _._ 03 _±_ 6 _._ 112e _−_ 3 0 _._ 095 _±_ 2 _._ 757e _−_ 2 0 _._ 02 _±_ 1 _._ 131e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 069 _±_ 1 _._ 213e _−_ 3 0 _._ 011 _±_ 2 _._ 967e _−_ 4 0 _._ 084 _±_ 3 _._ 821e _−_ 4 0 _._ 014 _±_ 8 _._ 387e _−_ 5 0 _._ 1 _±_ 3 _._ 803e _−_ 4 0 _._ 018 _±_ 1 _._ 442e _−_ 4
No ~~s~~ um ~~C~~ oT lstm 0 _._ 068 _±_ 1 _._ 919e _−_ 4 0 _._ 012 _±_ 2 _._ 517e _−_ 5 0 _._ 087 _±_ 9 _._ 539e _−_ 4 0 _._ 017 _±_ 1 _._ 947e _−_ 4 0 _._ 066 _±_ 7 _._ 127e _−_ 4 0 _._ 013 _±_ 1 _._ 836e _−_ 4
No ~~s~~ um ~~C~~ oT mlp 0 _._ 068 _±_ 4 _._ 33e _−_ 4 0 _._ 011 _±_ 1 _._ 034e _−_ 4 0 _._ 087 _±_ 2 _._ 246e _−_ 4 0 _._ 016 _±_ 6 _._ 245e _−_ 5 0 _._ 068 _±_ 5 _._ 267e _−_ 4 0 _._ 013 _±_ 1 _._ 916e _−_ 4
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 11 _±_ 4 _._ 16e _−_ 4 0 _._ 022 _±_ 2 _._ 835e _−_ 4 0 _._ 126 _±_ 3 _._ 01e _−_ 4 0 _._ 028 _±_ 1 _._ 877e _−_ 4 0 _._ 091 _±_ 7 _._ 053e _−_ 3 0 _._ 017 _±_ 1 _._ 781e _−_ 3
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 071 _±_ 1 _._ 913e _−_ 3 0 _._ 012 _±_ 3 _._ 332e _−_ 4 0 _._ 088 _±_ 1 _._ 554e _−_ 3 0 _._ 016 _±_ 4 _._ 282e _−_ 4 0 _._ 078 _±_ 5 _._ 167e _−_ 4 0 _._ 014 _±_ 1 _._ 441e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 064 _±_ 1 _._ 066e _−_ 3 0 _._ 011 _±_ 2 _._ 75e _−_ 4 0 _._ 082 _±_ 3 _._ 418e _−_ 4 0 _._ 015 _±_ 1 _._ 05e _−_ 4 0 _._ 063 _±_ 9 _._ 255e _−_ 4 0 _._ 011 _±_ 1 _._ 724e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 068 _±_ 4 _._ 036e _−_ 4 0 _._ 01 _±_ 1 _._ 106e _−_ 4 0 _._ 084 _±_ 3 _._ 98e _−_ 4 0 _._ 014 _±_ 1 _._ 531e _−_ 4 0 _._ 067 _±_ 1 _._ 261e _−_ 3 0 _._ 011 _±_ 3 _._ 371e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 123 _±_ 4 _._ 822e _−_ 4 0 _._ 027 _±_ 3 _._ 707e _−_ 4 0 _._ 123 _±_ 1 _._ 306e _−_ 2 0 _._ 027 _±_ 5 _._ 384e _−_ 3 0 _._ 282 _±_ 1 _._ 625e _−_ 1 0 _._ 164 _±_ 1 _._ 377e _−_ 1
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 068 _±_ 3 _._ 485e _−_ 4 0 _._ 01 _±_ 1 _._ 882e _−_ 4 0 _._ 084 _±_ 1 _._ 168e _−_ 3 0 _._ 014 _±_ 3 _._ 993e _−_ 4 0 _._ 099 _±_ 1 _._ 084e _−_ 3 0 _._ 018 _±_ 3 _._ 851e _−_ 4
No ~~s~~ um ~~I~~ CD lstm 0 _._ 068 _±_ 8 _._ 225e _−_ 4 0 _._ 012 _±_ 2 _._ 161e _−_ 4 0 _._ 086 _±_ 1 _._ 076e _−_ 3 0 _._ 016 _±_ 2 _._ 791e _−_ 4 0 _._ 066 _±_ 5 _._ 363e _−_ 4 0 _._ 013 _±_ 1 _._ 179e _−_ 4
No ~~s~~ um ~~I~~ CD mlp 0 _._ 068 _±_ 1 _._ 764e _−_ 3 0 _._ 012 _±_ 4 _._ 181e _−_ 4 0 _._ 087 _±_ 8 _._ 077e _−_ 4 0 _._ 016 _±_ 2 _._ 247e _−_ 4 0 _._ 068 _±_ 6 _._ 574e _−_ 4 0 _._ 013 _±_ 1 _._ 47e _−_ 4
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 112 _±_ 1 _._ 053e _−_ 3 0 _._ 023 _±_ 3 _._ 8e _−_ 4 0 _._ 126 _±_ 3 _._ 79e _−_ 4 0 _._ 028 _±_ 1 _._ 564e _−_ 4 0 _._ 089 _±_ 3 _._ 511e _−_ 3 0 _._ 017 _±_ 6 _._ 877e _−_ 4
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 071 _±_ 1 _._ 266e _−_ 3 0 _._ 012 _±_ 3 _._ 096e _−_ 4 0 _._ 087 _±_ 8 _._ 752e _−_ 4 0 _._ 016 _±_ 2 _._ 513e _−_ 4 0 _._ 079 _±_ 7 _._ 487e _−_ 4 0 _._ 014 _±_ 2 _._ 395e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 064 _±_ 3e _−_ 3 0 _._ 01 _±_ 7 _._ 238e _−_ 4 0 _._ 082 _±_ 4 _._ 706e _−_ 4 0 _._ 015 _±_ 1 _._ 732e _−_ 4 0 _._ 064 _±_ 1 _._ 618e _−_ 3 0 _._ 011 _±_ 4 _._ 07e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 067 _±_ 1 _._ 328e _−_ 3 0 _._ 01 _±_ 3 _._ 251e _−_ 4 0 _._ 084 _±_ 8 _._ 851e _−_ 4 0 _._ 014 _±_ 2 _._ 506e _−_ 4 0 _._ 067 _±_ 4 _._ 674e _−_ 4 0 _._ 011 _±_ 1 _._ 365e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 124 _±_ 1 _._ 31e _−_ 3 0 _._ 027 _±_ 3 _._ 134e _−_ 4 0 _._ 131 _±_ 7 _._ 397e _−_ 3 0 _._ 03 _±_ 3 _._ 107e _−_ 3 0 _._ 264 _±_ 1 _._ 202e _−_ 1 0 _._ 145 _±_ 1 _._ 013e _−_ 1
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 069 _±_ 9 _._ 413e _−_ 4 0 _._ 01 _±_ 1 _._ 45e _−_ 4 0 _._ 084 _±_ 6 _._ 694e _−_ 4 0 _._ 014 _±_ 1 _._ 818e _−_ 4 0 _._ 1 _±_ 1 _._ 34e _−_ 3 0 _._ 018 _±_ 5 _._ 112e _−_ 4


Table 34: In-distribution results - Forecast. (part 1/2)


50


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se** **masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se** **masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 068 _±_ 1 _._ 317e _−_ 3 0 _._ 012 _±_ 3 _._ 116e _−_ 4 0 _._ 085 _±_ 4 _._ 437e _−_ 4 0 _._ 016 _±_ 1 _._ 175e _−_ 4 0 _._ 066 _±_ 5 _._ 187e _−_ 4 0 _._ 013 _±_ 1 _._ 835e _−_ 4
No ~~s~~ um ~~T~~ rend mlp 0 _._ 068 _±_ 6 _._ 357e _−_ 4 0 _._ 011 _±_ 1 _._ 617e _−_ 4 0 _._ 087 _±_ 1 _._ 297e _−_ 3 0 _._ 016 _±_ 3 _._ 724e _−_ 4 0 _._ 067 _±_ 8 _._ 032e _−_ 4 0 _._ 012 _±_ 2 _._ 634e _−_ 4
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 111 _±_ 8 _._ 596e _−_ 4 0 _._ 022 _±_ 2 _._ 076e _−_ 4 0 _._ 126 _±_ 1 _._ 205e _−_ 3 0 _._ 028 _±_ 5 _._ 758e _−_ 4 0 _._ 089 _±_ 6 _._ 671e _−_ 3 0 _._ 017 _±_ 1 _._ 798e _−_ 3
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 072 _±_ 2 _._ 463e _−_ 3 0 _._ 012 _±_ 5 _._ 846e _−_ 4 0 _._ 088 _±_ 1 _._ 163e _−_ 3 0 _._ 016 _±_ 3 _._ 008e _−_ 4 0 _._ 079 _±_ 1 _._ 129e _−_ 3 0 _._ 014 _±_ 3 _._ 756e _−_ 4
medgemma CoT +TFM lstm 0 _._ 069 _±_ 2 _._ 873e _−_ 4 0 _._ 012 _±_ 5 _._ 686e _−_ 5 0 _._ 088 _±_ 6 _._ 381e _−_ 4 0 _._ 016 _±_ 1 _._ 65e _−_ 4 0 _._ 069 _±_ 1 _._ 11e _−_ 3 0 _._ 013 _±_ 3 _._ 317e _−_ 4
medgemma CoT +TFM mlp 0 _._ 073 _±_ 5 _._ 965e _−_ 4 0 _._ 012 _±_ 1 _._ 747e _−_ 4 0 _._ 093 _±_ 3 _._ 061e _−_ 4 0 _._ 017 _±_ 1 _._ 136e _−_ 4 0 _._ 077 _±_ 1 _._ 177e _−_ 3 0 _._ 013 _±_ 3 _._ 378e _−_ 4
medgemma CoT +TFM patchtsmixer 0 _._ 126 _±_ 1 _._ 701e _−_ 4 0 _._ 028 _±_ 2 _._ 136e _−_ 4 0 _._ 138 _±_ 1 _._ 191e _−_ 3 0 _._ 033 _±_ 4 _._ 423e _−_ 4 0 _._ 426 _±_ 2 _._ 746e _−_ 2 0 _._ 295 _±_ 3 _._ 72e _−_ 2
medgemma CoT +TFM timemixer 0 _._ 072 _±_ 1 _._ 163e _−_ 3 0 _._ 011 _±_ 2 _._ 166e _−_ 4 0 _._ 09 _±_ 7 _._ 181e _−_ 4 0 _._ 016 _±_ 2 _._ 615e _−_ 4 0 _._ 106 _±_ 1 _._ 041e _−_ 3 0 _._ 02 _±_ 4 _._ 748e _−_ 4
medgemma CoT lstm 0 _._ 069 _±_ 6 _._ 06e _−_ 4 0 _._ 013 _±_ 1 _._ 515e _−_ 4 0 _._ 088 _±_ 6 _._ 359e _−_ 4 0 _._ 017 _±_ 1 _._ 708e _−_ 4 0 _._ 07 _±_ 6 _._ 807e _−_ 4 0 _._ 014 _±_ 1 _._ 799e _−_ 4
medgemma CoT mlp 0 _._ 071 _±_ 5 _._ 875e _−_ 4 0 _._ 013 _±_ 1 _._ 431e _−_ 4 0 _._ 09 _±_ 7 _._ 285e _−_ 4 0 _._ 017 _±_ 2 _._ 234e _−_ 4 0 _._ 072 _±_ 4 _._ 666e _−_ 4 0 _._ 014 _±_ 1 _._ 45e _−_ 4
medgemma CoT patchtsmixer 0 _._ 112 _±_ 1 _._ 6e _−_ 3 0 _._ 023 _±_ 4 _._ 853e _−_ 4 0 _._ 128 _±_ 6 _._ 378e _−_ 4 0 _._ 028 _±_ 1 _._ 309e _−_ 4 0 _._ 092 _±_ 4 _._ 877e _−_ 3 0 _._ 018 _±_ 1 _._ 024e _−_ 3
medgemma CoT timemixer 0 _._ 075 _±_ 2 _._ 101e _−_ 3 0 _._ 013 _±_ 3 _._ 557e _−_ 4 0 _._ 091 _±_ 8 _._ 831e _−_ 4 0 _._ 017 _±_ 2 _._ 701e _−_ 4 0 _._ 083 _±_ 8 _._ 314e _−_ 4 0 _._ 015 _±_ 3 _._ 74e _−_ 4
medgemma ICD +TFM lstm 0 _._ 072 _±_ 1 _._ 752e _−_ 3 0 _._ 013 _±_ 6 _._ 251e _−_ 4 0 _._ 09 _±_ 1 _._ 406e _−_ 3 0 _._ 017 _±_ 3 _._ 769e _−_ 4 0 _._ 072 _±_ 1 _._ 18e _−_ 3 0 _._ 014 _±_ 3 _._ 703e _−_ 4
medgemma ICD +TFM mlp 0 _._ 076 _±_ 6 _._ 813e _−_ 4 0 _._ 013 _±_ 1 _._ 93e _−_ 4 0 _._ 094 _±_ 2 _._ 524e _−_ 4 0 _._ 018 _±_ 9 _._ 504e _−_ 5 0 _._ 079 _±_ 1 _._ 08e _−_ 3 0 _._ 014 _±_ 3 _._ 46e _−_ 4
medgemma ICD +TFM patchtsmixer 0 _._ 125 _±_ 1 _._ 208e _−_ 3 0 _._ 028 _±_ 3 _._ 5e _−_ 4 0 _._ 139 _±_ 3 _._ 731e _−_ 4 0 _._ 033 _±_ 2 _._ 201e _−_ 4 0 _._ 419 _±_ 3 _._ 58e _−_ 2 0 _._ 279 _±_ 4 _._ 63e _−_ 2
medgemma ICD +TFM timemixer 0 _._ 074 _±_ 1 _._ 771e _−_ 3 0 _._ 012 _±_ 3 _._ 913e _−_ 4 0 _._ 092 _±_ 7 _._ 543e _−_ 4 0 _._ 017 _±_ 2 _._ 829e _−_ 4 0 _._ 107 _±_ 3 _._ 934e _−_ 4 0 _._ 02 _±_ 1 _._ 861e _−_ 4
medgemma ICD lstm 0 _._ 071 _±_ 4 _._ 095e _−_ 4 0 _._ 013 _±_ 1 _._ 193e _−_ 4 0 _._ 091 _±_ 3 _._ 183e _−_ 4 0 _._ 018 _±_ 1 _._ 303e _−_ 4 0 _._ 072 _±_ 7 _._ 333e _−_ 4 0 _._ 015 _±_ 1 _._ 498e _−_ 4
medgemma ICD mlp 0 _._ 073 _±_ 9 _._ 869e _−_ 4 0 _._ 013 _±_ 2 _._ 471e _−_ 4 0 _._ 091 _±_ 5 _._ 297e _−_ 4 0 _._ 018 _±_ 1 _._ 841e _−_ 4 0 _._ 074 _±_ 4 _._ 049e _−_ 4 0 _._ 015 _±_ 1 _._ 207e _−_ 4
medgemma ICD patchtsmixer 0 _._ 113 _±_ 3 _._ 482e _−_ 4 0 _._ 023 _±_ 1 _._ 571e _−_ 4 0 _._ 128 _±_ 5 _._ 202e _−_ 4 0 _._ 029 _±_ 2 _._ 037e _−_ 4 0 _._ 093 _±_ 6 _._ 342e _−_ 3 0 _._ 018 _±_ 1 _._ 394e _−_ 3
medgemma ICD timemixer 0 _._ 076 _±_ 1 _._ 618e _−_ 3 0 _._ 014 _±_ 2 _._ 87e _−_ 4 0 _._ 094 _±_ 1 _._ 292e _−_ 3 0 _._ 018 _±_ 3 _._ 181e _−_ 4 0 _._ 085 _±_ 8 _._ 767e _−_ 4 0 _._ 016 _±_ 1 _._ 905e _−_ 4
medgemma Trend +TFM lstm 0 _._ 07 _±_ 4 _._ 701e _−_ 4 0 _._ 012 _±_ 1 _._ 778e _−_ 4 0 _._ 09 _±_ 9 _._ 335e _−_ 4 0 _._ 017 _±_ 2 _._ 538e _−_ 4 0 _._ 071 _±_ 1 _._ 38e _−_ 3 0 _._ 014 _±_ 4 _._ 46e _−_ 4
medgemma Trend +TFM mlp 0 _._ 075 _±_ 5 _._ 048e _−_ 4 0 _._ 012 _±_ 1 _._ 498e _−_ 4 0 _._ 092 _±_ 6 _._ 178e _−_ 4 0 _._ 017 _±_ 1 _._ 562e _−_ 4 0 _._ 078 _±_ 1 _._ 407e _−_ 3 0 _._ 014 _±_ 4 _._ 779e _−_ 4
medgemma Trend +TFM patchtsmixer 0 _._ 126 _±_ 1 _._ 025e _−_ 3 0 _._ 028 _±_ 1 _._ 95e _−_ 4 0 _._ 134 _±_ 1 _._ 056e _−_ 2 0 _._ 031 _±_ 4 _._ 599e _−_ 3 0 _._ 375 _±_ 4 _._ 543e _−_ 2 0 _._ 238 _±_ 4 _._ 575e _−_ 2
medgemma Trend +TFM timemixer 0 _._ 073 _±_ 1 _._ 142e _−_ 3 0 _._ 012 _±_ 4 _._ 309e _−_ 4 0 _._ 091 _±_ 3 _._ 443e _−_ 4 0 _._ 017 _±_ 1 _._ 277e _−_ 4 0 _._ 107 _±_ 1 _._ 32e _−_ 3 0 _._ 021 _±_ 5 _._ 525e _−_ 4
medgemma Trend lstm 0 _._ 071 _±_ 4 _._ 996e _−_ 4 0 _._ 013 _±_ 1 _._ 388e _−_ 4 0 _._ 09 _±_ 2 _._ 858e _−_ 4 0 _._ 018 _±_ 7 _._ 789e _−_ 5 0 _._ 073 _±_ 3 _._ 869e _−_ 4 0 _._ 015 _±_ 1 _._ 958e _−_ 4
medgemma Trend mlp 0 _._ 072 _±_ 7 _._ 023e _−_ 4 0 _._ 013 _±_ 1 _._ 992e _−_ 4 0 _._ 092 _±_ 3 _._ 242e _−_ 4 0 _._ 018 _±_ 7 _._ 724e _−_ 5 0 _._ 074 _±_ 4 _._ 473e _−_ 4 0 _._ 015 _±_ 1 _._ 184e _−_ 4
medgemma Trend patchtsmixer 0 _._ 113 _±_ 1 _._ 433e _−_ 3 0 _._ 023 _±_ 3 _._ 029e _−_ 4 0 _._ 128 _±_ 1 _._ 315e _−_ 3 0 _._ 029 _±_ 4 _._ 507e _−_ 4 0 _._ 095 _±_ 4 _._ 215e _−_ 3 0 _._ 019 _±_ 9 _._ 673e _−_ 4
medgemma Trend timemixer 0 _._ 075 _±_ 1 _._ 406e _−_ 3 0 _._ 014 _±_ 3 _._ 356e _−_ 4 0 _._ 094 _±_ 9 _._ 093e _−_ 4 0 _._ 018 _±_ 3 _._ 172e _−_ 4 0 _._ 086 _±_ 2 _._ 637e _−_ 4 0 _._ 016 _±_ 1 _._ 499e _−_ 4
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 069 _±_ 2 _._ 157e _−_ 4 0 _._ 012 _±_ 7 _._ 095e _−_ 5 0 _._ 09 _±_ 2 _._ 8e _−_ 4 0 _._ 017 _±_ 8 _._ 718e _−_ 5 0 _._ 071 _±_ 2 _._ 487e _−_ 3 0 _._ 014 _±_ 6 _._ 589e _−_ 4
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 075 _±_ 1 _._ 15e _−_ 3 0 _._ 012 _±_ 3 _._ 724e _−_ 4 0 _._ 093 _±_ 8 _._ 479e _−_ 4 0 _._ 017 _±_ 2 _._ 829e _−_ 4 0 _._ 078 _±_ 5 _._ 486e _−_ 4 0 _._ 014 _±_ 1 _._ 484e _−_ 4
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 125 _±_ 1 _._ 021e _−_ 3 0 _._ 028 _±_ 5 _._ 116e _−_ 4 0 _._ 13 _±_ 1 _._ 54e _−_ 2 0 _._ 03 _±_ 6 _._ 322e _−_ 3 0 _._ 439 _±_ 4 _._ 731e _−_ 2 0 _._ 31 _±_ 4 _._ 83e _−_ 2
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 073 _±_ 7 _._ 679e _−_ 4 0 _._ 012 _±_ 2 _._ 409e _−_ 4 0 _._ 091 _±_ 7 _._ 674e _−_ 4 0 _._ 017 _±_ 2 _._ 663e _−_ 4 0 _._ 105 _±_ 1 _._ 015e _−_ 3 0 _._ 02 _±_ 3 _._ 544e _−_ 4
medgemma zero ~~s~~ hot lstm 0 _._ 07 _±_ 3 _._ 414e _−_ 4 0 _._ 013 _±_ 6 _._ 782e _−_ 5 0 _._ 09 _±_ 1 _._ 015e _−_ 3 0 _._ 018 _±_ 2 _._ 858e _−_ 4 0 _._ 071 _±_ 5 _._ 2e _−_ 4 0 _._ 014 _±_ 1 _._ 564e _−_ 4
medgemma zero ~~s~~ hot mlp 0 _._ 072 _±_ 2 _._ 818e _−_ 4 0 _._ 013 _±_ 1 _._ 03e _−_ 4 0 _._ 091 _±_ 6 _._ 299e _−_ 4 0 _._ 018 _±_ 1 _._ 88e _−_ 4 0 _._ 073 _±_ 9 _._ 287e _−_ 4 0 _._ 014 _±_ 2 _._ 866e _−_ 4
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 112 _±_ 1 _._ 105e _−_ 3 0 _._ 023 _±_ 2 _._ 934e _−_ 4 0 _._ 128 _±_ 9 _._ 704e _−_ 4 0 _._ 028 _±_ 2 _._ 298e _−_ 4 0 _._ 092 _±_ 8 _._ 414e _−_ 3 0 _._ 018 _±_ 2 _._ 275e _−_ 3
medgemma zero ~~s~~ hot timemixer 0 _._ 074 _±_ 2 _._ 111e _−_ 3 0 _._ 013 _±_ 4 _._ 833e _−_ 4 0 _._ 093 _±_ 5 _._ 915e _−_ 4 0 _._ 018 _±_ 1 _._ 072e _−_ 4 0 _._ 084 _±_ 7 _._ 86e _−_ 4 0 _._ 016 _±_ 1 _._ 688e _−_ 4
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM lstm 0 _._ 065 _±_ 1 _._ 6e _−_ 3 0 _._ 011 _±_ 4 _._ 01e _−_ 4 0 _._ 083 _±_ 1 _._ 504e _−_ 3 0 _._ 015 _±_ 3 _._ 972e _−_ 4 0 _._ 064 _±_ 1 _._ 191e _−_ 3 0 _._ 011 _±_ 2 _._ 845e _−_ 4
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM mlp 0 _._ 067 _±_ 6 _._ 681e _−_ 4 0 _._ 01 _±_ 1 _._ 626e _−_ 4 0 _._ 084 _±_ 8 _._ 605e _−_ 4 0 _._ 015 _±_ 2 _._ 631e _−_ 4 0 _._ 068 _±_ 1 _._ 01e _−_ 3 0 _._ 011 _±_ 2 _._ 639e _−_ 4
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 124 _±_ 1 _._ 164e _−_ 3 0 _._ 027 _±_ 5 _._ 45e _−_ 4 0 _._ 124 _±_ 1 _._ 319e _−_ 2 0 _._ 027 _±_ 5 _._ 462e _−_ 3 0 _._ 256 _±_ 1 _._ 429e _−_ 1 0 _._ 144 _±_ 1 _._ 174e _−_ 1
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM timemixer 0 _._ 068 _±_ 1 _._ 837e _−_ 3 0 _._ 01 _±_ 4 _._ 328e _−_ 4 0 _._ 085 _±_ 1 _._ 501e _−_ 3 0 _._ 015 _±_ 3 _._ 487e _−_ 4 0 _._ 1 _±_ 7 _._ 862e _−_ 4 0 _._ 018 _±_ 2 _._ 641e _−_ 4
No ~~s~~ um ~~z~~ ero shot lstm 0 _._ 067 _±_ 1 _._ 073e _−_ 3 0 _._ 012 _±_ 2 _._ 413e _−_ 4 0 _._ 086 _±_ 1 _._ 129e _−_ 3 0 _._ 016 _±_ 3 _._ 381e _−_ 4 0 _._ 066 _±_ 8 _._ 154e _−_ 4 0 _._ 013 _±_ 2 _._ 403e _−_ 4
No ~~s~~ um ~~z~~ ero shot mlp 0 _._ 068 _±_ 8 _._ 283e _−_ 4 0 _._ 012 _±_ 2 _._ 077e _−_ 4 0 _._ 086 _±_ 9 _._ 896e _−_ 4 0 _._ 016 _±_ 2 _._ 701e _−_ 4 0 _._ 068 _±_ 4 _._ 37e _−_ 4 0 _._ 013 _±_ 1 _._ 22e _−_ 4
No ~~s~~ um ~~z~~ ero shot patchtsmixer 0 _._ 11 _±_ 4 _._ 895e _−_ 4 0 _._ 022 _±_ 2 _._ 851e _−_ 4 0 _._ 126 _±_ 5 _._ 631e _−_ 4 0 _._ 028 _±_ 2 _._ 757e _−_ 4 0 _._ 089 _±_ 8 _._ 783e _−_ 3 0 _._ 017 _±_ 2 _._ 339e _−_ 3
No ~~s~~ um ~~z~~ ero shot timemixer 0 _._ 072 _±_ 2 _._ 877e _−_ 3 0 _._ 012 _±_ 7 _._ 297e _−_ 4 0 _._ 088 _±_ 8 _._ 869e _−_ 4 0 _._ 016 _±_ 2 _._ 265e _−_ 4 0 _._ 08 _±_ 1 _._ 347e _−_ 3 0 _._ 014 _±_ 3 _._ 821e _−_ 4
right lstm 0 _._ 049 _±_ 3 _._ 421e _−_ 4 0 _._ 007 _±_ 5 _._ 62e _−_ 5 0 _._ 067 _±_ 9 _._ 956e _−_ 4 0 _._ 011 _±_ 1 _._ 228e _−_ 4 0 _._ 047 _±_ 1 _._ 752e _−_ 4 0 _._ 008 _±_ 2 _._ 646e _−_ 5
right mlp 0 _._ 056 _±_ 1 _._ 771e _−_ 4 0 _._ 008 _±_ 2 _._ 646e _−_ 5 0 _._ 072 _±_ 1 _._ 945e _−_ 4 0 _._ 012 _±_ 1 _._ 258e _−_ 5 0 _._ 052 _±_ 2 _._ 052e _−_ 4 0 _._ 008 _±_ 1 _._ 893e _−_ 5
right patchtsmixer 0 _._ 109 _±_ 5 _._ 173e _−_ 4 0 _._ 041 _±_ 3 _._ 377e _−_ 4 0 _._ 11 _±_ 3 _._ 675e _−_ 4 0 _._ 037 _±_ 5 _._ 371e _−_ 4 0 _._ 083 _±_ 9 _._ 554e _−_ 4 0 _._ 031 _±_ 6 _._ 364e _−_ 4
right timemixer 0 _._ 156 _±_ 2 _._ 139e _−_ 3 0 _._ 068 _±_ 1 _._ 209e _−_ 3 0 _._ 134 _±_ 7 _._ 387e _−_ 4 0 _._ 046 _±_ 9 _._ 389e _−_ 4 0 _._ 228 _±_ 4 _._ 642e _−_ 3 0 _._ 141 _±_ 3 _._ 671e _−_ 3


Table 35: In-distribution results - Forecast. (part 2/2)


51


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se** **masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se**


Llama-3.1 CoT +TFM lstm 0 _._ 233 _±_ 1 _._ 151e _−_ 2 0 _._ 12 _±_ 8 _._ 28e _−_ 3 0 _._ 263 _±_ 5 _._ 289e _−_ 4 0 _._ 151 _±_ 2 _._ 991e _−_ 3
Llama-3.1 CoT +TFM mlp 0 _._ 257 _±_ 1 _._ 285e _−_ 3 0 _._ 138 _±_ 2 _._ 024e _−_ 3 0 _._ 266 _±_ 8 _._ 977e _−_ 4 0 _._ 155 _±_ 1 _._ 573e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 309 _±_ 1 _._ 042e _−_ 2 0 _._ 209 _±_ 2 _._ 272e _−_ 2 0 _._ 36 _±_ 6 _._ 736e _−_ 3 0 _._ 267 _±_ 1 _._ 614e _−_ 2
Llama-3.1 CoT +TFM timemixer 0 _._ 264 _±_ 5 _._ 936e _−_ 3 0 _._ 141 _±_ 4 _._ 233e _−_ 3 0 _._ 27 _±_ 1 _._ 086e _−_ 3 0 _._ 155 _±_ 1 _._ 749e _−_ 3
Llama-3.1 CoT lstm 0 _._ 249 _±_ 3 _._ 484e _−_ 3 0 _._ 14 _±_ 4 _._ 978e _−_ 3 0 _._ 265 _±_ 1 _._ 101e _−_ 3 0 _._ 159 _±_ 1 _._ 279e _−_ 3
Llama-3.1 CoT mlp 0 _._ 254 _±_ 1 _._ 175e _−_ 3 0 _._ 144 _±_ 1 _._ 125e _−_ 3 0 _._ 266 _±_ 4 _._ 836e _−_ 4 0 _._ 16 _±_ 5 _._ 539e _−_ 4
Llama-3.1 CoT patchtsmixer 0 _._ 301 _±_ 3 _._ 518e _−_ 3 0 _._ 203 _±_ 1 _._ 327e _−_ 2 0 _._ 35 _±_ 1 _._ 025e _−_ 2 0 _._ 255 _±_ 7 _._ 716e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 257 _±_ 2 _._ 158e _−_ 3 0 _._ 147 _±_ 1 _._ 634e _−_ 3 0 _._ 273 _±_ 1 _._ 845e _−_ 3 0 _._ 165 _±_ 1 _._ 135e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 244 _±_ 3 _._ 883e _−_ 3 0 _._ 129 _±_ 2 _._ 99e _−_ 3 0 _._ 259 _±_ 6 _._ 222e _−_ 3 0 _._ 146 _±_ 7 _._ 989e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 255 _±_ 7 _._ 535e _−_ 4 0 _._ 139 _±_ 8 _._ 615e _−_ 4 0 _._ 262 _±_ 7 _._ 825e _−_ 4 0 _._ 148 _±_ 1 _._ 253e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 302 _±_ 7 _._ 799e _−_ 3 0 _._ 19 _±_ 1 _._ 528e _−_ 2 0 _._ 368 _±_ 1 _._ 021e _−_ 2 0 _._ 279 _±_ 2 _._ 077e _−_ 2
Llama-3.1 ICD +TFM timemixer 0 _._ 258 _±_ 3 _._ 675e _−_ 3 0 _._ 139 _±_ 2 _._ 935e _−_ 3 0 _._ 268 _±_ 4 _._ 168e _−_ 3 0 _._ 154 _±_ 6 _._ 667e _−_ 3
Llama-3.1 ICD lstm 0 _._ 248 _±_ 6 _._ 559e _−_ 4 0 _._ 14 _±_ 9 _._ 291e _−_ 4 0 _._ 265 _±_ 8 _._ 688e _−_ 4 0 _._ 16 _±_ 1 _._ 093e _−_ 3
Llama-3.1 ICD mlp 0 _._ 248 _±_ 8 _._ 898e _−_ 4 0 _._ 14 _±_ 9 _._ 803e _−_ 4 0 _._ 267 _±_ 9 _._ 823e _−_ 4 0 _._ 161 _±_ 9 _._ 952e _−_ 4
Llama-3.1 ICD patchtsmixer 0 _._ 296 _±_ 4 _._ 522e _−_ 3 0 _._ 191 _±_ 1 _._ 087e _−_ 2 0 _._ 349 _±_ 5 _._ 127e _−_ 3 0 _._ 259 _±_ 1 _._ 508e _−_ 2
Llama-3.1 ICD timemixer 0 _._ 254 _±_ 1 _._ 418e _−_ 3 0 _._ 144 _±_ 1 _._ 737e _−_ 3 0 _._ 272 _±_ 1 _._ 191e _−_ 3 0 _._ 165 _±_ 1 _._ 344e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 241 _±_ 9 _._ 205e _−_ 3 0 _._ 127 _±_ 8 _._ 831e _−_ 3 0 _._ 265 _±_ 2 _._ 777e _−_ 3 0 _._ 154 _±_ 4 _._ 278e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 255 _±_ 2 _._ 103e _−_ 3 0 _._ 136 _±_ 3 _._ 044e _−_ 3 0 _._ 264 _±_ 1 _._ 337e _−_ 3 0 _._ 152 _±_ 1 _._ 552e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 309 _±_ 2 _._ 944e _−_ 3 0 _._ 212 _±_ 1 _._ 078e _−_ 2 0 _._ 35 _±_ 6 _._ 284e _−_ 3 0 _._ 244 _±_ 1 _._ 247e _−_ 2
Llama-3.1 Trend +TFM timemixer 0 _._ 255 _±_ 3 _._ 634e _−_ 3 0 _._ 135 _±_ 4 _._ 983e _−_ 3 0 _._ 27 _±_ 7 _._ 901e _−_ 4 0 _._ 153 _±_ 2 _._ 791e _−_ 3
Llama-3.1 Trend lstm 0 _._ 249 _±_ 2 _._ 012e _−_ 3 0 _._ 141 _±_ 2 _._ 458e _−_ 3 0 _._ 265 _±_ 9 _._ 183e _−_ 4 0 _._ 16 _±_ 6 _._ 172e _−_ 4
Llama-3.1 Trend mlp 0 _._ 251 _±_ 6 _._ 926e _−_ 4 0 _._ 142 _±_ 7 _._ 046e _−_ 4 0 _._ 268 _±_ 1 _._ 058e _−_ 3 0 _._ 161 _±_ 8 _._ 152e _−_ 4
Llama-3.1 Trend patchtsmixer 0 _._ 299 _±_ 7 _._ 225e _−_ 3 0 _._ 207 _±_ 2 _._ 734e _−_ 2 0 _._ 343 _±_ 6 _._ 525e _−_ 3 0 _._ 242 _±_ 8 _._ 377e _−_ 3
Llama-3.1 Trend timemixer 0 _._ 254 _±_ 2 _._ 033e _−_ 3 0 _._ 144 _±_ 1 _._ 564e _−_ 3 0 _._ 273 _±_ 1 _._ 936e _−_ 3 0 _._ 165 _±_ 1 _._ 44e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 236 _±_ 9 _._ 481e _−_ 3 0 _._ 122 _±_ 9 _._ 524e _−_ 3 0 _._ 263 _±_ 2 _._ 426e _−_ 3 0 _._ 151 _±_ 2 _._ 222e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 254 _±_ 9 _._ 672e _−_ 4 0 _._ 133 _±_ 2 _._ 668e _−_ 3 0 _._ 259 _±_ 1 _._ 655e _−_ 3 0 _._ 142 _±_ 3 _._ 406e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 307 _±_ 1 _._ 225e _−_ 3 0 _._ 208 _±_ 5 _._ 803e _−_ 3 0 _._ 359 _±_ 1 _._ 014e _−_ 2 0 _._ 259 _±_ 1 _._ 957e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 258 _±_ 4 _._ 549e _−_ 3 0 _._ 135 _±_ 3 _._ 992e _−_ 3 0 _._ 27 _±_ 2 _._ 229e _−_ 3 0 _._ 155 _±_ 3 _._ 77e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 248 _±_ 2 _._ 096e _−_ 3 0 _._ 139 _±_ 3 _._ 128e _−_ 3 0 _._ 265 _±_ 8 _._ 146e _−_ 4 0 _._ 16 _±_ 8 _._ 607e _−_ 4
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 252 _±_ 1 _._ 013e _−_ 3 0 _._ 143 _±_ 1 _._ 042e _−_ 3 0 _._ 266 _±_ 3 _._ 319e _−_ 4 0 _._ 16 _±_ 4 _._ 706e _−_ 4
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 293 _±_ 3 _._ 942e _−_ 3 0 _._ 183 _±_ 5 _._ 569e _−_ 3 0 _._ 353 _±_ 4 _._ 407e _−_ 3 0 _._ 254 _±_ 1 _._ 169e _−_ 2
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 254 _±_ 1 _._ 517e _−_ 3 0 _._ 143 _±_ 1 _._ 546e _−_ 3 0 _._ 274 _±_ 3 _._ 347e _−_ 3 0 _._ 165 _±_ 2 _._ 725e _−_ 3
TFM lstm 0 _._ 256 _±_ 1 _._ 187e _−_ 3 0 _._ 148 _±_ 8 _._ 907e _−_ 4 0 _._ 271 _±_ 2 _._ 313e _−_ 3 0 _._ 165 _±_ 1 _._ 201e _−_ 3
TFM mlp 0 _._ 252 _±_ 2 _._ 536e _−_ 4 0 _._ 142 _±_ 3 _._ 369e _−_ 4 0 _._ 273 _±_ 7 _._ 091e _−_ 4 0 _._ 167 _±_ 7 _._ 996e _−_ 4
TFM patchtsmixer 0 _._ 313 _±_ 5 _._ 429e _−_ 3 0 _._ 217 _±_ 1 _._ 902e _−_ 2 0 _._ 365 _±_ 1 _._ 016e _−_ 2 0 _._ 284 _±_ 2 _._ 297e _−_ 2
TFM timemixer 0 _._ 255 _±_ 1 _._ 952e _−_ 3 0 _._ 144 _±_ 2 _._ 339e _−_ 3 0 _._ 272 _±_ 1 _._ 852e _−_ 3 0 _._ 165 _±_ 1 _._ 846e _−_ 3
TSDE lstm 0 _._ 441 _±_ 5 _._ 705e _−_ 2 0 _._ 284 _±_ 7 _._ 197e _−_ 2 0 _._ 317 _±_ 7 _._ 954e _−_ 2 0 _._ 172 _±_ 7 _._ 826e _−_ 2
TSDE mlp 0 _._ 329 _±_ 3 _._ 907e _−_ 2 0 _._ 169 _±_ 3 _._ 646e _−_ 2 0 _._ 425 _±_ 3 _._ 644e _−_ 2 0 _._ 313 _±_ 4 _._ 37e _−_ 2
TSDE patchtsmixer 0 _._ 311 _±_ 4 _._ 882e _−_ 3 0 _._ 209 _±_ 9 _._ 028e _−_ 3 0 _._ 361 _±_ 4 _._ 177e _−_ 3 0 _._ 269 _±_ 1 _._ 2e _−_ 2
TSDE timemixer 0 _._ 379 _±_ 4 _._ 678e _−_ 2 0 _._ 23 _±_ 6 _._ 628e _−_ 2 0 _._ 309 _±_ 1 _._ 989e _−_ 2 0 _._ 167 _±_ 1 _._ 677e _−_ 2
gemini-2.0-flash CoT +TFM lstm 0 _._ 245 _±_ 7 _._ 668e _−_ 3 0 _._ 129 _±_ 8 _._ 157e _−_ 3 0 _._ 264 _±_ 7 _._ 638e _−_ 3 0 _._ 152 _±_ 1 _._ 099e _−_ 2
gemini-2.0-flash CoT +TFM mlp 0 _._ 256 _±_ 2 _._ 95e _−_ 4 0 _._ 137 _±_ 6 _._ 799e _−_ 4 0 _._ 271 _±_ 5 _._ 314e _−_ 4 0 _._ 158 _±_ 4 _._ 912e _−_ 4
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 303 _±_ 5 _._ 928e _−_ 3 0 _._ 194 _±_ 1 _._ 536e _−_ 2 0 _._ 35 _±_ 1 _._ 437e _−_ 2 0 _._ 249 _±_ 1 _._ 319e _−_ 2
gemini-2.0-flash CoT +TFM timemixer 0 _._ 262 _±_ 4 _._ 926e _−_ 3 0 _._ 14 _±_ 1 _._ 162e _−_ 3 0 _._ 271 _±_ 4 _._ 388e _−_ 3 0 _._ 152 _±_ 3 _._ 192e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 248 _±_ 2 _._ 401e _−_ 3 0 _._ 137 _±_ 2 _._ 332e _−_ 3 0 _._ 266 _±_ 6 _._ 472e _−_ 4 0 _._ 16 _±_ 1 _._ 095e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 251 _±_ 1 _._ 123e _−_ 4 0 _._ 142 _±_ 1 _._ 458e _−_ 4 0 _._ 267 _±_ 8 _._ 293e _−_ 4 0 _._ 16 _±_ 8 _._ 07e _−_ 4
gemini-2.0-flash CoT patchtsmixer 0 _._ 297 _±_ 1 _._ 961e _−_ 3 0 _._ 194 _±_ 6 _._ 499e _−_ 3 0 _._ 345 _±_ 8 _._ 73e _−_ 3 0 _._ 243 _±_ 1 _._ 871e _−_ 2
gemini-2.0-flash CoT timemixer 0 _._ 259 _±_ 1 _._ 743e _−_ 3 0 _._ 147 _±_ 1 _._ 713e _−_ 3 0 _._ 272 _±_ 3 _._ 148e _−_ 3 0 _._ 163 _±_ 3 _._ 351e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 242 _±_ 1 _._ 895e _−_ 3 0 _._ 128 _±_ 1 _._ 697e _−_ 3 0 _._ 263 _±_ 5 _._ 395e _−_ 3 0 _._ 148 _±_ 6 _._ 053e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 254 _±_ 1 _._ 227e _−_ 3 0 _._ 131 _±_ 1 _._ 766e _−_ 3 0 _._ 269 _±_ 1 _._ 092e _−_ 3 0 _._ 156 _±_ 1 _._ 055e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 309 _±_ 2 _._ 339e _−_ 3 0 _._ 202 _±_ 6 _._ 27e _−_ 3 0 _._ 359 _±_ 1 _._ 048e _−_ 2 0 _._ 258 _±_ 1 _._ 893e _−_ 2
gemini-2.0-flash ICD +TFM timemixer 0 _._ 263 _±_ 1 _._ 018e _−_ 3 0 _._ 136 _±_ 1 _._ 011e _−_ 3 0 _._ 267 _±_ 5 _._ 24e _−_ 3 0 _._ 149 _±_ 6 _._ 799e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 247 _±_ 5 _._ 091e _−_ 3 0 _._ 138 _±_ 6 _._ 117e _−_ 3 0 _._ 263 _±_ 1 _._ 068e _−_ 3 0 _._ 157 _±_ 1 _._ 731e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 25 _±_ 1 _._ 183e _−_ 3 0 _._ 14 _±_ 1 _._ 361e _−_ 3 0 _._ 266 _±_ 8 _._ 483e _−_ 4 0 _._ 159 _±_ 8 _._ 67e _−_ 4
gemini-2.0-flash ICD patchtsmixer 0 _._ 299 _±_ 8 _._ 339e _−_ 3 0 _._ 2 _±_ 1 _._ 925e _−_ 2 0 _._ 342 _±_ 6 _._ 903e _−_ 3 0 _._ 243 _±_ 1 _._ 72e _−_ 2
gemini-2.0-flash ICD timemixer 0 _._ 259 _±_ 2 _._ 312e _−_ 3 0 _._ 147 _±_ 2 _._ 326e _−_ 3 0 _._ 272 _±_ 3 _._ 99e _−_ 3 0 _._ 164 _±_ 3 _._ 513e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 223 _±_ 2 _._ 934e _−_ 3 0 _._ 112 _±_ 1 _._ 287e _−_ 3 0 _._ 258 _±_ 5 _._ 156e _−_ 3 0 _._ 144 _±_ 6 _._ 115e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 255 _±_ 7 _._ 559e _−_ 4 0 _._ 132 _±_ 2 _._ 128e _−_ 3 0 _._ 265 _±_ 6 _._ 888e _−_ 4 0 _._ 15 _±_ 1 _._ 064e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 304 _±_ 4 _._ 473e _−_ 3 0 _._ 195 _±_ 9 _._ 066e _−_ 3 0 _._ 362 _±_ 9 _._ 5e _−_ 3 0 _._ 267 _±_ 1 _._ 868e _−_ 2
gemini-2.0-flash Trend +TFM timemixer 0 _._ 259 _±_ 2 _._ 829e _−_ 3 0 _._ 141 _±_ 5 _._ 123e _−_ 3 0 _._ 271 _±_ 2 _._ 502e _−_ 3 0 _._ 152 _±_ 4 _._ 551e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 246 _±_ 2 _._ 201e _−_ 3 0 _._ 138 _±_ 2 _._ 734e _−_ 3 0 _._ 264 _±_ 6 _._ 985e _−_ 4 0 _._ 158 _±_ 8 _._ 871e _−_ 4
gemini-2.0-flash Trend mlp 0 _._ 248 _±_ 9 _._ 524e _−_ 4 0 _._ 14 _±_ 9 _._ 351e _−_ 4 0 _._ 268 _±_ 2 _._ 051e _−_ 3 0 _._ 161 _±_ 1 _._ 963e _−_ 3
gemini-2.0-flash Trend patchtsmixer 0 _._ 304 _±_ 2 _._ 698e _−_ 3 0 _._ 216 _±_ 1 _._ 305e _−_ 2 0 _._ 347 _±_ 1 _._ 166e _−_ 2 0 _._ 244 _±_ 1 _._ 992e _−_ 2
gemini-2.0-flash Trend timemixer 0 _._ 254 _±_ 1 _._ 467e _−_ 3 0 _._ 144 _±_ 1 _._ 907e _−_ 3 0 _._ 272 _±_ 2 _._ 424e _−_ 3 0 _._ 164 _±_ 2 _._ 789e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 237 _±_ 8 _._ 483e _−_ 3 0 _._ 123 _±_ 8 _._ 268e _−_ 3 0 _._ 269 _±_ 7 _._ 437e _−_ 3 0 _._ 157 _±_ 8 _._ 831e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 257 _±_ 2 _._ 318e _−_ 4 0 _._ 14 _±_ 3 _._ 055e _−_ 4 0 _._ 27 _±_ 1 _._ 445e _−_ 3 0 _._ 158 _±_ 1 _._ 491e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 322 _±_ 1 _._ 483e _−_ 3 0 _._ 237 _±_ 1 _._ 498e _−_ 2 0 _._ 349 _±_ 2 _._ 874e _−_ 3 0 _._ 241 _±_ 7 _._ 466e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 257 _±_ 2 _._ 596e _−_ 3 0 _._ 137 _±_ 4 _._ 234e _−_ 3 0 _._ 271 _±_ 1 _._ 195e _−_ 3 0 _._ 152 _±_ 1 _._ 976e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 25 _±_ 2 _._ 993e _−_ 3 0 _._ 141 _±_ 3 _._ 455e _−_ 3 0 _._ 267 _±_ 5 _._ 898e _−_ 4 0 _._ 16 _±_ 5 _._ 229e _−_ 4
gemini-2.0-flash zero shot mlp 0 _._ 253 _±_ 1 _._ 152e _−_ 3 0 _._ 144 _±_ 8 _._ 367e _−_ 4 0 _._ 27 _±_ 1 _._ 568e _−_ 3 0 _._ 163 _±_ 1 _._ 278e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 297 _±_ 8 _._ 402e _−_ 3 0 _._ 193 _±_ 2 _._ 072e _−_ 2 0 _._ 353 _±_ 1 _._ 37e _−_ 2 0 _._ 261 _±_ 2 _._ 067e _−_ 2
gemini-2.0-flash zero shot timemixer 0 _._ 256 _±_ 6 _._ 253e _−_ 4 0 _._ 146 _±_ 4 _._ 215e _−_ 4 0 _._ 272 _±_ 1 _._ 866e _−_ 3 0 _._ 164 _±_ 1 _._ 651e _−_ 3
interp lstm 0 _._ 326 _±_ 7 _._ 263e _−_ 3 0 _._ 217 _±_ 5 _._ 938e _−_ 3 0 _._ 383 _±_ 4 _._ 215e _−_ 3 0 _._ 276 _±_ 2 _._ 743e _−_ 3
interp mlp 0 _._ 509 _±_ 5 _._ 545e _−_ 2 0 _._ 466 _±_ 9 _._ 495e _−_ 2 0 _._ 507 _±_ 1 _._ 317e _−_ 2 0 _._ 427 _±_ 1 _._ 943e _−_ 2
interp patchtsmixer 0 _._ 601 _±_ 4 _._ 662e _−_ 2 24 _._ 8 _±_ 7 _._ 965e0 0 _._ 83 _±_ 3 _._ 299e _−_ 2 13 _._ 411 _±_ 3 _._ 412e0
interp timemixer 0 _._ 59 _±_ 2 _._ 228e _−_ 2 0 _._ 614 _±_ 7 _._ 488e _−_ 2 0 _._ 56 _±_ 1 _._ 332e _−_ 2 0 _._ 561 _±_ 4 _._ 048e _−_ 2
mean lstm 0 _._ 297 _±_ 3 _._ 83e _−_ 3 0 _._ 197 _±_ 1 _._ 58e _−_ 3 0 _._ 38 _±_ 9 _._ 415e _−_ 4 0 _._ 261 _±_ 1 _._ 091e _−_ 3
mean mlp 0 _._ 412 _±_ 9 _._ 945e _−_ 3 0 _._ 292 _±_ 9 _._ 692e _−_ 3 0 _._ 402 _±_ 1 _._ 338e _−_ 2 0 _._ 282 _±_ 1 _._ 586e _−_ 2
mean patchtsmixer 0 _._ 259 _±_ 4 _._ 115e _−_ 3 0 _._ 306 _±_ 1 _._ 698e _−_ 2 0 _._ 448 _±_ 3 _._ 38e _−_ 2 4 _._ 839 _±_ 1 _._ 345e0
mean timemixer 0 _._ 575 _±_ 3 _._ 447e _−_ 3 0 _._ 541 _±_ 1 _._ 402e _−_ 2 0 _._ 557 _±_ 7 _._ 886e _−_ 3 0 _._ 51 _±_ 1 _._ 44e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 241 _±_ 4 _._ 677e _−_ 3 0 _._ 125 _±_ 5 _._ 111e _−_ 3 0 _._ 263 _±_ 2 _._ 178e _−_ 3 0 _._ 15 _±_ 2 _._ 378e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 26 _±_ 3 _._ 366e _−_ 3 0 _._ 144 _±_ 4 _._ 77e _−_ 3 0 _._ 271 _±_ 3 _._ 026e _−_ 3 0 _._ 155 _±_ 4 _._ 368e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 31 _±_ 6 _._ 41e _−_ 3 0 _._ 208 _±_ 1 _._ 751e _−_ 2 0 _._ 361 _±_ 1 _._ 783e _−_ 3 0 _._ 269 _±_ 5 _._ 946e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 258 _±_ 5 _._ 222e _−_ 3 0 _._ 133 _±_ 2 _._ 969e _−_ 3 0 _._ 267 _±_ 6 _._ 478e _−_ 3 0 _._ 145 _±_ 9 _._ 273e _−_ 3
No ~~s~~ um ~~C~~ oT lstm 0 _._ 245 _±_ 1 _._ 906e _−_ 3 0 _._ 138 _±_ 1 _._ 487e _−_ 3 0 _._ 271 _±_ 2 _._ 812e _−_ 3 0 _._ 163 _±_ 3 _._ 417e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 252 _±_ 9 _._ 53e _−_ 4 0 _._ 145 _±_ 6 _._ 666e _−_ 4 0 _._ 283 _±_ 2 _._ 47e _−_ 3 0 _._ 174 _±_ 2 _._ 155e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 302 _±_ 3 _._ 796e _−_ 3 0 _._ 214 _±_ 1 _._ 484e _−_ 2 0 _._ 351 _±_ 1 _._ 451e _−_ 2 0 _._ 25 _±_ 3 _._ 05e _−_ 2
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 251 _±_ 2 _._ 86e _−_ 3 0 _._ 141 _±_ 2 _._ 135e _−_ 3 0 _._ 274 _±_ 4 _._ 468e _−_ 3 0 _._ 163 _±_ 5 _._ 064e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 245 _±_ 2 _._ 003e _−_ 3 0 _._ 132 _±_ 2 _._ 688e _−_ 3 0 _._ 265 _±_ 3 _._ 819e _−_ 3 0 _._ 152 _±_ 5 _._ 225e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 264 _±_ 6 _._ 594e _−_ 3 0 _._ 148 _±_ 7 _._ 287e _−_ 3 0 _._ 277 _±_ 2 _._ 85e _−_ 3 0 _._ 163 _±_ 2 _._ 906e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 311 _±_ 9 _._ 231e _−_ 3 0 _._ 22 _±_ 3 _._ 153e _−_ 2 0 _._ 353 _±_ 2 _._ 39e _−_ 3 0 _._ 267 _±_ 1 _._ 882e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 258 _±_ 3 _._ 285e _−_ 3 0 _._ 139 _±_ 5 _._ 799e _−_ 3 0 _._ 272 _±_ 5 _._ 074e _−_ 3 0 _._ 155 _±_ 8 _._ 076e _−_ 3
No ~~s~~ um ~~I~~ CD lstm 0 _._ 243 _±_ 10e _−_ 4 0 _._ 138 _±_ 1 _._ 574e _−_ 3 0 _._ 272 _±_ 1 _._ 379e _−_ 3 0 _._ 163 _±_ 9 _._ 315e _−_ 4
No ~~s~~ um ~~I~~ CD mlp 0 _._ 248 _±_ 1 _._ 423e _−_ 3 0 _._ 141 _±_ 1 _._ 563e _−_ 3 0 _._ 276 _±_ 2 _._ 058e _−_ 3 0 _._ 168 _±_ 1 _._ 711e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 3 _±_ 5 _._ 824e _−_ 3 0 _._ 216 _±_ 2 _._ 673e _−_ 2 0 _._ 356 _±_ 7 _._ 101e _−_ 3 0 _._ 263 _±_ 1 _._ 785e _−_ 2
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 248 _±_ 2 _._ 058e _−_ 3 0 _._ 14 _±_ 1 _._ 885e _−_ 3 0 _._ 28 _±_ 4 _._ 925e _−_ 3 0 _._ 17 _±_ 3 _._ 804e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 243 _±_ 2 _._ 09e _−_ 3 0 _._ 129 _±_ 3 _._ 814e _−_ 3 0 _._ 266 _±_ 1 _._ 709e _−_ 3 0 _._ 154 _±_ 8 _._ 954e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 261 _±_ 2 _._ 61e _−_ 3 0 _._ 145 _±_ 3 _._ 731e _−_ 3 0 _._ 277 _±_ 3 _._ 419e _−_ 3 0 _._ 163 _±_ 3 _._ 859e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 308 _±_ 2 _._ 055e _−_ 3 0 _._ 204 _±_ 4 _._ 42e _−_ 3 0 _._ 362 _±_ 1 _._ 132e _−_ 2 0 _._ 277 _±_ 3 _._ 123e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 262 _±_ 2 _._ 033e _−_ 3 0 _._ 138 _±_ 4 _._ 333e _−_ 3 0 _._ 272 _±_ 1 _._ 25e _−_ 3 0 _._ 149 _±_ 1 _._ 171e _−_ 3


Table 36: Cross-site transfer results - Forecast. (part 1/2)


52


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se** **masked** ~~**m**~~ **ae** **masked** ~~**m**~~ **se**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 249 _±_ 2 _._ 623e _−_ 3 0 _._ 143 _±_ 2 _._ 817e _−_ 3 0 _._ 271 _±_ 1 _._ 111e _−_ 3 0 _._ 163 _±_ 1 _._ 111e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 253 _±_ 2 _._ 225e _−_ 3 0 _._ 145 _±_ 2 _._ 026e _−_ 3 0 _._ 284 _±_ 2 _._ 136e _−_ 3 0 _._ 175 _±_ 1 _._ 803e _−_ 3
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 293 _±_ 5 _._ 256e _−_ 3 0 _._ 19 _±_ 1 _._ 041e _−_ 2 0 _._ 345 _±_ 9 _._ 259e _−_ 3 0 _._ 243 _±_ 1 _._ 885e _−_ 2
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 253 _±_ 2 _._ 217e _−_ 3 0 _._ 144 _±_ 2 _._ 074e _−_ 3 0 _._ 277 _±_ 2 _._ 751e _−_ 3 0 _._ 169 _±_ 3 _._ 138e _−_ 3
medgemma CoT +TFM lstm 0 _._ 24 _±_ 6 _._ 816e _−_ 3 0 _._ 125 _±_ 8 _._ 342e _−_ 3 0 _._ 269 _±_ 7 _._ 465e _−_ 4 0 _._ 157 _±_ 3 _._ 317e _−_ 3
medgemma CoT +TFM mlp 0 _._ 257 _±_ 1 _._ 504e _−_ 3 0 _._ 137 _±_ 9 _._ 943e _−_ 4 0 _._ 268 _±_ 1 _._ 119e _−_ 3 0 _._ 154 _±_ 1 _._ 309e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 305 _±_ 1 _._ 024e _−_ 2 0 _._ 193 _±_ 2 _._ 069e _−_ 2 0 _._ 365 _±_ 1 _._ 438e _−_ 2 0 _._ 281 _±_ 3 _._ 208e _−_ 2
medgemma CoT +TFM timemixer 0 _._ 262 _±_ 3 _._ 617e _−_ 3 0 _._ 138 _±_ 2 _._ 563e _−_ 3 0 _._ 267 _±_ 3 _._ 583e _−_ 3 0 _._ 15 _±_ 5 _._ 676e _−_ 3
medgemma CoT lstm 0 _._ 249 _±_ 7 _._ 646e _−_ 4 0 _._ 141 _±_ 4 _._ 029e _−_ 4 0 _._ 265 _±_ 1 _._ 296e _−_ 3 0 _._ 16 _±_ 1 _._ 675e _−_ 3
medgemma CoT mlp 0 _._ 251 _±_ 2 _._ 272e _−_ 4 0 _._ 142 _±_ 1 _._ 186e _−_ 4 0 _._ 267 _±_ 1 _._ 201e _−_ 3 0 _._ 16 _±_ 1 _._ 024e _−_ 3
medgemma CoT patchtsmixer 0 _._ 302 _±_ 5 _._ 299e _−_ 3 0 _._ 2 _±_ 5 _._ 499e _−_ 3 0 _._ 353 _±_ 9 _._ 822e _−_ 3 0 _._ 261 _±_ 1 _._ 398e _−_ 2
medgemma CoT timemixer 0 _._ 258 _±_ 2 _._ 634e _−_ 3 0 _._ 147 _±_ 7 _._ 614e _−_ 4 0 _._ 271 _±_ 1 _._ 594e _−_ 3 0 _._ 163 _±_ 1 _._ 808e _−_ 3
medgemma ICD +TFM lstm 0 _._ 242 _±_ 3 _._ 343e _−_ 3 0 _._ 127 _±_ 5 _._ 492e _−_ 3 0 _._ 268 _±_ 2 _._ 749e _−_ 3 0 _._ 156 _±_ 3 _._ 411e _−_ 3
medgemma ICD +TFM mlp 0 _._ 256 _±_ 1 _._ 712e _−_ 3 0 _._ 137 _±_ 1 _._ 293e _−_ 3 0 _._ 269 _±_ 5 _._ 604e _−_ 4 0 _._ 156 _±_ 6 _._ 755e _−_ 4
medgemma ICD +TFM patchtsmixer 0 _._ 309 _±_ 4 _._ 25e _−_ 3 0 _._ 204 _±_ 1 _._ 313e _−_ 2 0 _._ 358 _±_ 1 _._ 76e _−_ 3 0 _._ 259 _±_ 3 _._ 414e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 264 _±_ 8 _._ 753e _−_ 3 0 _._ 143 _±_ 3 _._ 938e _−_ 3 0 _._ 265 _±_ 1 _._ 113e _−_ 3 0 _._ 149 _±_ 3 _._ 272e _−_ 3
medgemma ICD lstm 0 _._ 247 _±_ 1 _._ 964e _−_ 3 0 _._ 138 _±_ 3 _._ 509e _−_ 3 0 _._ 265 _±_ 1 _._ 511e _−_ 3 0 _._ 159 _±_ 1 _._ 315e _−_ 3
medgemma ICD mlp 0 _._ 249 _±_ 6 _._ 003e _−_ 4 0 _._ 141 _±_ 6 _._ 605e _−_ 4 0 _._ 267 _±_ 1 _._ 313e _−_ 3 0 _._ 161 _±_ 1 _._ 376e _−_ 3
medgemma ICD patchtsmixer 0 _._ 301 _±_ 8 _._ 083e _−_ 3 0 _._ 204 _±_ 2 _._ 75e _−_ 2 0 _._ 351 _±_ 1 _._ 059e _−_ 2 0 _._ 257 _±_ 2 _._ 034e _−_ 2
medgemma ICD timemixer 0 _._ 255 _±_ 2 _._ 058e _−_ 3 0 _._ 145 _±_ 2 _._ 054e _−_ 3 0 _._ 272 _±_ 2 _._ 285e _−_ 3 0 _._ 164 _±_ 2 _._ 24e _−_ 3
medgemma Trend +TFM lstm 0 _._ 245 _±_ 4 _._ 502e _−_ 3 0 _._ 129 _±_ 5 _._ 574e _−_ 3 0 _._ 268 _±_ 8 _._ 775e _−_ 4 0 _._ 157 _±_ 3 _._ 522e _−_ 3
medgemma Trend +TFM mlp 0 _._ 254 _±_ 4 _._ 188e _−_ 4 0 _._ 133 _±_ 1 _._ 285e _−_ 3 0 _._ 267 _±_ 1 _._ 403e _−_ 3 0 _._ 154 _±_ 1 _._ 471e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 312 _±_ 3 _._ 208e _−_ 3 0 _._ 221 _±_ 1 _._ 173e _−_ 2 0 _._ 352 _±_ 1 _._ 223e _−_ 3 0 _._ 253 _±_ 1 _._ 052e _−_ 2
medgemma Trend +TFM timemixer 0 _._ 265 _±_ 5 _._ 529e _−_ 3 0 _._ 139 _±_ 1 _._ 168e _−_ 3 0 _._ 271 _±_ 1 _._ 898e _−_ 3 0 _._ 154 _±_ 4 _._ 041e _−_ 3
medgemma Trend lstm 0 _._ 25 _±_ 1 _._ 1e _−_ 3 0 _._ 142 _±_ 1 _._ 041e _−_ 3 0 _._ 264 _±_ 4 _._ 763e _−_ 4 0 _._ 158 _±_ 3 _._ 932e _−_ 4
medgemma Trend mlp 0 _._ 251 _±_ 7 _._ 036e _−_ 4 0 _._ 143 _±_ 5 _._ 268e _−_ 4 0 _._ 267 _±_ 8 _._ 651e _−_ 4 0 _._ 161 _±_ 6 _._ 607e _−_ 4
medgemma Trend patchtsmixer 0 _._ 299 _±_ 6 _._ 688e _−_ 4 0 _._ 195 _±_ 4 _._ 897e _−_ 3 0 _._ 346 _±_ 1 _._ 116e _−_ 2 0 _._ 246 _±_ 2 _._ 384e _−_ 2
medgemma Trend timemixer 0 _._ 256 _±_ 1 _._ 805e _−_ 3 0 _._ 146 _±_ 1 _._ 074e _−_ 3 0 _._ 272 _±_ 2 _._ 892e _−_ 3 0 _._ 164 _±_ 2 _._ 426e _−_ 3
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 25 _±_ 2 _._ 708e _−_ 3 0 _._ 139 _±_ 4 _._ 651e _−_ 3 0 _._ 264 _±_ 9 _._ 359e _−_ 3 0 _._ 151 _±_ 9 _._ 994e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 257 _±_ 1 _._ 904e _−_ 3 0 _._ 138 _±_ 2 _._ 683e _−_ 3 0 _._ 268 _±_ 9 _._ 304e _−_ 4 0 _._ 155 _±_ 1 _._ 016e _−_ 3
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 309 _±_ 8 _._ 308e _−_ 3 0 _._ 207 _±_ 1 _._ 436e _−_ 2 0 _._ 356 _±_ 2 _._ 022e _−_ 2 0 _._ 26 _±_ 2 _._ 808e _−_ 2
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 259 _±_ 4 _._ 9e _−_ 3 0 _._ 139 _±_ 7 _._ 448e _−_ 3 0 _._ 271 _±_ 3 _._ 455e _−_ 3 0 _._ 153 _±_ 4 _._ 72e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 248 _±_ 1 _._ 353e _−_ 3 0 _._ 141 _±_ 1 _._ 412e _−_ 3 0 _._ 267 _±_ 1 _._ 275e _−_ 3 0 _._ 16 _±_ 8 _._ 217e _−_ 4
medgemma zero ~~s~~ hot mlp 0 _._ 249 _±_ 7 _._ 299e _−_ 4 0 _._ 141 _±_ 5 _._ 935e _−_ 4 0 _._ 267 _±_ 1 _._ 14e _−_ 3 0 _._ 16 _±_ 1 _._ 277e _−_ 3
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 295 _±_ 4 _._ 016e _−_ 3 0 _._ 192 _±_ 1 _._ 876e _−_ 2 0 _._ 349 _±_ 7 _._ 039e _−_ 3 0 _._ 247 _±_ 1 _._ 202e _−_ 2
medgemma zero ~~s~~ hot timemixer 0 _._ 254 _±_ 4 _._ 558e _−_ 3 0 _._ 144 _±_ 3 _._ 587e _−_ 3 0 _._ 271 _±_ 2 _._ 25e _−_ 3 0 _._ 163 _±_ 2 _._ 291e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM lstm 0 _._ 245 _±_ 4 _._ 863e _−_ 3 0 _._ 131 _±_ 6 _._ 715e _−_ 3 0 _._ 264 _±_ 2 _._ 851e _−_ 3 0 _._ 15 _±_ 4 _._ 289e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM mlp 0 _._ 262 _±_ 4 _._ 131e _−_ 3 0 _._ 146 _±_ 4 _._ 051e _−_ 3 0 _._ 273 _±_ 3 _._ 846e _−_ 3 0 _._ 158 _±_ 4 _._ 645e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 304 _±_ 2 _._ 445e _−_ 3 0 _._ 194 _±_ 9 _._ 183e _−_ 3 0 _._ 356 _±_ 2 _._ 551e _−_ 3 0 _._ 265 _±_ 1 _._ 22e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM timemixer 0 _._ 26 _±_ 9 _._ 804e _−_ 3 0 _._ 134 _±_ 3 _._ 106e _−_ 3 0 _._ 273 _±_ 3 _._ 046e _−_ 3 0 _._ 156 _±_ 4 _._ 517e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 246 _±_ 1 _._ 023e _−_ 3 0 _._ 139 _±_ 4 _._ 635e _−_ 4 0 _._ 27 _±_ 1 _._ 73e _−_ 3 0 _._ 162 _±_ 2 _._ 37e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 251 _±_ 2 _._ 359e _−_ 3 0 _._ 143 _±_ 1 _._ 861e _−_ 3 0 _._ 282 _±_ 2 _._ 943e _−_ 3 0 _._ 173 _±_ 2 _._ 678e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 296 _±_ 1 _._ 026e _−_ 2 0 _._ 195 _±_ 2 _._ 108e _−_ 2 0 _._ 351 _±_ 3 _._ 333e _−_ 3 0 _._ 259 _±_ 2 _._ 272e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 249 _±_ 3 _._ 272e _−_ 3 0 _._ 14 _±_ 3 _._ 473e _−_ 3 0 _._ 28 _±_ 2 _._ 941e _−_ 3 0 _._ 169 _±_ 1 _._ 838e _−_ 3
right lstm 0 _._ 32 _±_ 9 _._ 703e _−_ 3 0 _._ 212 _±_ 5 _._ 96e _−_ 3 0 _._ 379 _±_ 3 _._ 51e _−_ 3 0 _._ 27 _±_ 2 _._ 655e _−_ 3
right mlp 0 _._ 432 _±_ 3 _._ 094e _−_ 2 0 _._ 317 _±_ 3 _._ 616e _−_ 2 0 _._ 409 _±_ 9 _._ 342e _−_ 3 0 _._ 28 _±_ 1 _._ 177e _−_ 2
right patchtsmixer 0 _._ 303 _±_ 1 _._ 23e _−_ 2 0 _._ 417 _±_ 4 _._ 725e _−_ 2 0 _._ 547 _±_ 3 _._ 435e _−_ 2 6 _._ 344 _±_ 1 _._ 676e0
right timemixer 0 _._ 537 _±_ 4 _._ 212e _−_ 2 0 _._ 593 _±_ 2 _._ 114e _−_ 1 0 _._ 487 _±_ 1 _._ 123e _−_ 2 0 _._ 431 _±_ 2 _._ 56e _−_ 2


Table 37: Cross-site transfer results - Forecast. (part 2/2)


53


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**mae** **mse** **mae** **mse** **mae** **mse**


Llama-3.1 CoT +TFM lstm 0 _._ 302 _±_ 1 _._ 48e _−_ 2 0 _._ 379 _±_ 3 _._ 635e _−_ 2 0 _._ 322 _±_ 8 _._ 197e _−_ 3 0 _._ 567 _±_ 4 _._ 639e _−_ 3 0 _._ 351 _±_ 4 _._ 62e _−_ 3 0 _._ 937 _±_ 8 _._ 33e _−_ 3
Llama-3.1 CoT +TFM mlp 0 _._ 304 _±_ 9 _._ 901e _−_ 3 0 _._ 372 _±_ 1 _._ 076e _−_ 2 0 _._ 304 _±_ 3 _._ 403e _−_ 3 0 _._ 505 _±_ 1 _._ 562e _−_ 2 0 _._ 343 _±_ 9 _._ 457e _−_ 3 0 _._ 922 _±_ 1 _._ 08e _−_ 2
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 524 _±_ 2 _._ 093e _−_ 2 0 _._ 691 _±_ 3 _._ 479e _−_ 2 0 _._ 47 _±_ 2 _._ 87e _−_ 2 0 _._ 766 _±_ 1 _._ 297e _−_ 1 0 _._ 416 _±_ 9 _._ 236e _−_ 3 1 _._ 011 _±_ 3 _._ 858e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 348 _±_ 3 _._ 617e _−_ 3 0 _._ 38 _±_ 1 _._ 789e _−_ 3 0 _._ 338 _±_ 1 _._ 84e _−_ 2 0 _._ 519 _±_ 3 _._ 783e _−_ 2 0 _._ 337 _±_ 5 _._ 955e _−_ 3 0 _._ 924 _±_ 7 _._ 734e _−_ 3
Llama-3.1 CoT lstm 0 _._ 378 _±_ 1 _._ 686e _−_ 2 0 _._ 527 _±_ 1 _._ 747e _−_ 2 0 _._ 396 _±_ 1 _._ 467e _−_ 2 0 _._ 692 _±_ 9 _._ 725e _−_ 3 0 _._ 358 _±_ 6 _._ 408e _−_ 3 0 _._ 958 _±_ 7 _._ 056e _−_ 3
Llama-3.1 CoT mlp 0 _._ 378 _±_ 1 _._ 342e _−_ 2 0 _._ 537 _±_ 1 _._ 634e _−_ 2 0 _._ 383 _±_ 7 _._ 868e _−_ 3 0 _._ 679 _±_ 1 _._ 381e _−_ 2 0 _._ 353 _±_ 5 _._ 766e _−_ 3 0 _._ 957 _±_ 7 _._ 114e _−_ 3
Llama-3.1 CoT patchtsmixer 0 _._ 45 _±_ 9 _._ 321e _−_ 3 0 _._ 603 _±_ 1 _._ 17e _−_ 2 0 _._ 436 _±_ 1 _._ 907e _−_ 2 0 _._ 726 _±_ 1 _._ 54e _−_ 2 0 _._ 371 _±_ 5 _._ 441e _−_ 3 0 _._ 948 _±_ 4 _._ 508e _−_ 3
Llama-3.1 CoT timemixer 0 _._ 428 _±_ 9 _._ 948e _−_ 3 0 _._ 608 _±_ 1 _._ 768e _−_ 2 0 _._ 4 _±_ 1 _._ 577e _−_ 2 0 _._ 745 _±_ 4 _._ 069e _−_ 2 0 _._ 348 _±_ 1 _._ 209e _−_ 2 0 _._ 959 _±_ 3 _._ 893e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 305 _±_ 3 _._ 202e _−_ 3 0 _._ 38 _±_ 6 _._ 206e _−_ 3 0 _._ 315 _±_ 7 _._ 487e _−_ 3 0 _._ 54 _±_ 2 _._ 976e _−_ 2 0 _._ 346 _±_ 1 _._ 467e _−_ 3 0 _._ 93 _±_ 6 _._ 941e _−_ 4
Llama-3.1 ICD +TFM mlp 0 _._ 291 _±_ 1 _._ 751e _−_ 2 0 _._ 338 _±_ 4 _._ 194e _−_ 2 0 _._ 307 _±_ 1 _._ 124e _−_ 2 0 _._ 512 _±_ 2 _._ 612e _−_ 2 0 _._ 338 _±_ 5 _._ 783e _−_ 3 0 _._ 907 _±_ 2 _._ 877e _−_ 2
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 467 _±_ 6 _._ 059e _−_ 2 0 _._ 549 _±_ 1 _._ 337e _−_ 1 0 _._ 443 _±_ 3 _._ 829e _−_ 2 0 _._ 667 _±_ 1 _._ 191e _−_ 1 0 _._ 409 _±_ 7 _._ 221e _−_ 3 0 _._ 998 _±_ 9 _._ 691e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 352 _±_ 2 _._ 81e _−_ 3 0 _._ 393 _±_ 3 _._ 153e _−_ 2 0 _._ 343 _±_ 9 _._ 235e _−_ 3 0 _._ 544 _±_ 2 _._ 314e _−_ 2 0 _._ 339 _±_ 8 _._ 263e _−_ 3 0 _._ 931 _±_ 1 _._ 72e _−_ 3
Llama-3.1 ICD lstm 0 _._ 373 _±_ 1 _._ 35e _−_ 2 0 _._ 507 _±_ 1 _._ 465e _−_ 2 0 _._ 396 _±_ 4 _._ 652e _−_ 3 0 _._ 671 _±_ 1 _._ 096e _−_ 2 0 _._ 343 _±_ 1 _._ 374e _−_ 2 0 _._ 943 _±_ 1 _._ 831e _−_ 2
Llama-3.1 ICD mlp 0 _._ 375 _±_ 7 _._ 018e _−_ 3 0 _._ 519 _±_ 1 _._ 186e _−_ 2 0 _._ 386 _±_ 1 _._ 069e _−_ 2 0 _._ 662 _±_ 2 _._ 48e _−_ 2 0 _._ 346 _±_ 1 _._ 124e _−_ 2 0 _._ 945 _±_ 7 _._ 691e _−_ 3
Llama-3.1 ICD patchtsmixer 0 _._ 44 _±_ 1 _._ 366e _−_ 2 0 _._ 567 _±_ 2 _._ 372e _−_ 2 0 _._ 414 _±_ 3 _._ 289e _−_ 3 0 _._ 694 _±_ 1 _._ 099e _−_ 2 0 _._ 363 _±_ 8 _._ 136e _−_ 3 0 _._ 951 _±_ 7 _._ 857e _−_ 3
Llama-3.1 ICD timemixer 0 _._ 415 _±_ 7 _._ 205e _−_ 3 0 _._ 598 _±_ 1 _._ 578e _−_ 2 0 _._ 394 _±_ 7 _._ 977e _−_ 3 0 _._ 735 _±_ 1 _._ 667e _−_ 2 0 _._ 346 _±_ 8 _._ 294e _−_ 3 0 _._ 952 _±_ 5 _._ 613e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 288 _±_ 4 _._ 85e _−_ 3 0 _._ 357 _±_ 2 _._ 131e _−_ 2 0 _._ 294 _±_ 9 _._ 581e _−_ 3 0 _._ 519 _±_ 2 _._ 705e _−_ 2 0 _._ 352 _±_ 1 _._ 563e _−_ 3 0 _._ 94 _±_ 9 _._ 196e _−_ 4
Llama-3.1 Trend +TFM mlp 0 _._ 291 _±_ 1 _._ 039e _−_ 2 0 _._ 342 _±_ 2 _._ 252e _−_ 2 0 _._ 304 _±_ 8e _−_ 3 0 _._ 539 _±_ 1 _._ 464e _−_ 2 0 _._ 354 _±_ 6 _._ 17e _−_ 3 0 _._ 919 _±_ 2 _._ 627e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 488 _±_ 3 _._ 853e _−_ 2 0 _._ 598 _±_ 6 _._ 89e _−_ 2 0 _._ 469 _±_ 2 _._ 486e _−_ 2 0 _._ 724 _±_ 7 _._ 989e _−_ 2 0 _._ 414 _±_ 1 _._ 17e _−_ 2 0 _._ 993 _±_ 4 _._ 875e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 335 _±_ 3 _._ 325e _−_ 3 0 _._ 374 _±_ 9 _._ 667e _−_ 3 0 _._ 33 _±_ 8 _._ 606e _−_ 3 0 _._ 532 _±_ 1 _._ 417e _−_ 2 0 _._ 341 _±_ 1 _._ 1e _−_ 2 0 _._ 935 _±_ 1 _._ 23e _−_ 2
Llama-3.1 Trend lstm 0 _._ 317 _±_ 7 _._ 011e _−_ 3 0 _._ 417 _±_ 1 _._ 042e _−_ 2 0 _._ 32 _±_ 7 _._ 124e _−_ 3 0 _._ 587 _±_ 1 _._ 364e _−_ 2 0 _._ 349 _±_ 4 _._ 507e _−_ 3 0 _._ 944 _±_ 1 _._ 046e _−_ 2
Llama-3.1 Trend mlp 0 _._ 313 _±_ 1 _._ 212e _−_ 2 0 _._ 411 _±_ 2 _._ 107e _−_ 2 0 _._ 311 _±_ 4 _._ 869e _−_ 3 0 _._ 579 _±_ 1 _._ 221e _−_ 2 0 _._ 351 _±_ 3 _._ 812e _−_ 3 0 _._ 938 _±_ 1 _._ 169e _−_ 2
Llama-3.1 Trend patchtsmixer 0 _._ 383 _±_ 9 _._ 965e _−_ 3 0 _._ 473 _±_ 1 _._ 785e _−_ 2 0 _._ 369 _±_ 7 _._ 19e _−_ 3 0 _._ 616 _±_ 1 _._ 752e _−_ 2 0 _._ 374 _±_ 9 _._ 925e _−_ 3 0 _._ 943 _±_ 1 _._ 132e _−_ 2
Llama-3.1 Trend timemixer 0 _._ 359 _±_ 7 _._ 483e _−_ 3 0 _._ 479 _±_ 1 _._ 367e _−_ 2 0 _._ 338 _±_ 6 _._ 444e _−_ 3 0 _._ 625 _±_ 7 _._ 808e _−_ 3 0 _._ 353 _±_ 6 _._ 539e _−_ 3 0 _._ 952 _±_ 9 _._ 052e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 31 _±_ 9 _._ 545e _−_ 3 0 _._ 398 _±_ 2 _._ 841e _−_ 2 0 _._ 32 _±_ 4 _._ 846e _−_ 3 0 _._ 57 _±_ 1 _._ 255e _−_ 2 0 _._ 342 _±_ 1 _._ 128e _−_ 3 0 _._ 93 _±_ 1 _._ 504e _−_ 4
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 307 _±_ 5 _._ 449e _−_ 3 0 _._ 383 _±_ 2 _._ 041e _−_ 2 0 _._ 315 _±_ 7 _._ 42e _−_ 3 0 _._ 545 _±_ 1 _._ 806e _−_ 2 0 _._ 348 _±_ 8 _._ 502e _−_ 3 0 _._ 917 _±_ 1 _._ 885e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 489 _±_ 2 _._ 735e _−_ 2 0 _._ 615 _±_ 6 _._ 752e _−_ 2 0 _._ 398 _±_ 1 _._ 701e _−_ 2 0 _._ 547 _±_ 3 _._ 993e _−_ 2 0 _._ 408 _±_ 6 _._ 968e _−_ 3 1 _._ 002 _±_ 2 _._ 556e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 343 _±_ 5 _._ 445e _−_ 3 0 _._ 387 _±_ 1 _._ 905e _−_ 2 0 _._ 348 _±_ 2 _._ 792e _−_ 3 0 _._ 565 _±_ 2 _._ 677e _−_ 2 0 _._ 333 _±_ 8 _._ 801e _−_ 3 0 _._ 935 _±_ 9 _._ 816e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 353 _±_ 7 _._ 614e _−_ 3 0 _._ 493 _±_ 1 _._ 717e _−_ 2 0 _._ 391 _±_ 1 _._ 006e _−_ 2 0 _._ 701 _±_ 2 _._ 087e _−_ 2 0 _._ 345 _±_ 6 _._ 4e _−_ 3 0 _._ 944 _±_ 4 _._ 13e _−_ 3
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 36 _±_ 1 _._ 207e _−_ 2 0 _._ 495 _±_ 1 _._ 645e _−_ 2 0 _._ 377 _±_ 1 _._ 374e _−_ 2 0 _._ 659 _±_ 5 _._ 663e _−_ 3 0 _._ 338 _±_ 8 _._ 451e _−_ 3 0 _._ 944 _±_ 3 _._ 195e _−_ 3
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 421 _±_ 4 _._ 832e _−_ 3 0 _._ 549 _±_ 1 _._ 19e _−_ 2 0 _._ 411 _±_ 1 _._ 348e _−_ 2 0 _._ 709 _±_ 1 _._ 73e _−_ 2 0 _._ 36 _±_ 6 _._ 219e _−_ 3 0 _._ 947 _±_ 2 _._ 512e _−_ 3
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 397 _±_ 1 _._ 102e _−_ 2 0 _._ 568 _±_ 2 _._ 333e _−_ 2 0 _._ 392 _±_ 1 _._ 076e _−_ 2 0 _._ 707 _±_ 6 _._ 456e _−_ 3 0 _._ 333 _±_ 8 _._ 444e _−_ 3 0 _._ 95 _±_ 9 _._ 248e _−_ 3
TFM lstm 0 _._ 313 _±_ 6 _._ 465e _−_ 3 0 _._ 438 _±_ 6 _._ 413e _−_ 3 0 _._ 322 _±_ 4 _._ 787e _−_ 3 0 _._ 823 _±_ 1 _._ 426e _−_ 3 0 _._ 419 _±_ 1 _._ 588e _−_ 2 0 _._ 889 _±_ 1 _._ 232e _−_ 2
TFM mlp 0 _._ 319 _±_ 9 _._ 517e _−_ 3 0 _._ 442 _±_ 5 _._ 719e _−_ 3 0 _._ 336 _±_ 7 _._ 05e _−_ 3 0 _._ 837 _±_ 3 _._ 961e _−_ 3 0 _._ 416 _±_ 7 _._ 481e _−_ 3 0 _._ 9 _±_ 9 _._ 927e _−_ 3
TFM patchtsmixer 0 _._ 44 _±_ 3 _._ 117e _−_ 2 0 _._ 565 _±_ 4 _._ 867e _−_ 2 0 _._ 413 _±_ 8 _._ 228e _−_ 3 0 _._ 882 _±_ 1 _._ 314e _−_ 2 0 _._ 494 _±_ 1 _._ 073e _−_ 2 0 _._ 957 _±_ 2 _._ 818e _−_ 2
TFM timemixer 0 _._ 345 _±_ 2 _._ 447e _−_ 2 0 _._ 49 _±_ 5 _._ 165e _−_ 2 0 _._ 355 _±_ 1 _._ 015e _−_ 2 0 _._ 848 _±_ 4 _._ 638e _−_ 3 0 _._ 418 _±_ 5 _._ 579e _−_ 3 0 _._ 89 _±_ 1 _._ 031e _−_ 2
TSDE lstm 0 _._ 293 _±_ 7 _._ 301e _−_ 3 0 _._ 382 _±_ 4 _._ 77e _−_ 3 0 _._ 325 _±_ 1 _._ 299e _−_ 2 0 _._ 743 _±_ 1 _._ 35e _−_ 2 0 _._ 399 _±_ 5 _._ 013e _−_ 3 0 _._ 806 _±_ 4 _._ 848e _−_ 3
TSDE mlp 0 _._ 298 _±_ 6 _._ 89e _−_ 3 0 _._ 378 _±_ 5 _._ 964e _−_ 3 0 _._ 326 _±_ 1 _._ 834e _−_ 2 0 _._ 729 _±_ 4 _._ 613e _−_ 3 0 _._ 412 _±_ 6 _._ 807e _−_ 3 0 _._ 806 _±_ 6 _._ 799e _−_ 3
TSDE patchtsmixer 0 _._ 411 _±_ 2 _._ 723e _−_ 2 0 _._ 484 _±_ 5 _._ 127e _−_ 2 0 _._ 406 _±_ 1 _._ 342e _−_ 2 0 _._ 801 _±_ 2 _._ 698e _−_ 2 0 _._ 485 _±_ 5 _._ 896e _−_ 3 0 _._ 877 _±_ 1 _._ 835e _−_ 2
TSDE timemixer 0 _._ 331 _±_ 1 _._ 209e _−_ 2 0 _._ 403 _±_ 1 _._ 16e _−_ 2 0 _._ 343 _±_ 1 _._ 109e _−_ 2 0 _._ 742 _±_ 8 _._ 187e _−_ 3 0 _._ 4 _±_ 9 _._ 397e _−_ 3 0 _._ 821 _±_ 2 _._ 762e _−_ 2
gemini-2.0-flash CoT +TFM lstm 0 _._ 311 _±_ 5 _._ 765e _−_ 3 0 _._ 401 _±_ 1 _._ 682e _−_ 2 0 _._ 299 _±_ 4 _._ 825e _−_ 3 0 _._ 501 _±_ 2 _._ 849e _−_ 3 0 _._ 346 _±_ 1 _._ 309e _−_ 3 0 _._ 934 _±_ 5 _._ 717e _−_ 4
gemini-2.0-flash CoT +TFM mlp 0 _._ 293 _±_ 1 _._ 353e _−_ 2 0 _._ 341 _±_ 2 _._ 886e _−_ 2 0 _._ 311 _±_ 1 _._ 27e _−_ 2 0 _._ 519 _±_ 3 _._ 552e _−_ 2 0 _._ 353 _±_ 6 _._ 034e _−_ 3 0 _._ 916 _±_ 1 _._ 346e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 515 _±_ 5 _._ 591e _−_ 2 0 _._ 648 _±_ 1 _._ 144e _−_ 1 0 _._ 473 _±_ 2 _._ 76e _−_ 2 0 _._ 744 _±_ 7 _._ 319e _−_ 2 0 _._ 417 _±_ 2 _._ 119e _−_ 3 0 _._ 994 _±_ 4 _._ 372e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 342 _±_ 2 _._ 814e _−_ 3 0 _._ 392 _±_ 7 _._ 927e _−_ 3 0 _._ 353 _±_ 1 _._ 326e _−_ 3 0 _._ 537 _±_ 3 _._ 793e _−_ 2 0 _._ 333 _±_ 2 _._ 434e _−_ 3 0 _._ 916 _±_ 3 _._ 93e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 364 _±_ 9 _._ 354e _−_ 3 0 _._ 503 _±_ 1 _._ 154e _−_ 2 0 _._ 364 _±_ 5 _._ 208e _−_ 3 0 _._ 641 _±_ 6 _._ 085e _−_ 3 0 _._ 348 _±_ 2 _._ 818e _−_ 3 0 _._ 944 _±_ 5 _._ 052e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 375 _±_ 8 _._ 365e _−_ 3 0 _._ 514 _±_ 1 _._ 245e _−_ 2 0 _._ 358 _±_ 1 _._ 419e _−_ 2 0 _._ 614 _±_ 1 _._ 426e _−_ 2 0 _._ 345 _±_ 7 _._ 564e _−_ 3 0 _._ 943 _±_ 8 _._ 451e _−_ 3
gemini-2.0-flash CoT patchtsmixer 0 _._ 438 _±_ 9 _._ 928e _−_ 3 0 _._ 563 _±_ 5 _._ 535e _−_ 3 0 _._ 396 _±_ 2 _._ 093e _−_ 3 0 _._ 646 _±_ 4 _._ 094e _−_ 2 0 _._ 363 _±_ 6 _._ 436e _−_ 3 0 _._ 935 _±_ 1 _._ 274e _−_ 2
gemini-2.0-flash CoT timemixer 0 _._ 398 _±_ 3 _._ 311e _−_ 3 0 _._ 555 _±_ 9 _._ 959e _−_ 3 0 _._ 366 _±_ 1 _._ 037e _−_ 2 0 _._ 651 _±_ 3 _._ 209e _−_ 2 0 _._ 341 _±_ 7 _._ 12e _−_ 3 0 _._ 943 _±_ 5 _._ 792e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 314 _±_ 1 _._ 145e _−_ 2 0 _._ 406 _±_ 2 _._ 45e _−_ 2 0 _._ 304 _±_ 1 _._ 338e _−_ 2 0 _._ 526 _±_ 4 _._ 775e _−_ 2 0 _._ 347 _±_ 2 _._ 497e _−_ 3 0 _._ 932 _±_ 1 _._ 617e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 295 _±_ 1 _._ 323e _−_ 2 0 _._ 341 _±_ 3 _._ 493e _−_ 2 0 _._ 309 _±_ 7 _._ 168e _−_ 3 0 _._ 511 _±_ 3 _._ 592e _−_ 2 0 _._ 353 _±_ 5 _._ 594e _−_ 3 0 _._ 916 _±_ 1 _._ 94e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 499 _±_ 3 _._ 616e _−_ 2 0 _._ 626 _±_ 8 _._ 963e _−_ 2 0 _._ 445 _±_ 3 _._ 464e _−_ 2 0 _._ 661 _±_ 1 _._ 563e _−_ 1 0 _._ 409 _±_ 5 _._ 918e _−_ 3 0 _._ 998 _±_ 8 _._ 959e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 351 _±_ 8 _._ 9e _−_ 3 0 _._ 395 _±_ 1 _._ 877e _−_ 2 0 _._ 342 _±_ 3 _._ 224e _−_ 2 0 _._ 508 _±_ 4 _._ 002e _−_ 2 0 _._ 331 _±_ 1 _._ 488e _−_ 2 0 _._ 937 _±_ 3 _._ 433e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 377 _±_ 7 _._ 773e _−_ 3 0 _._ 51 _±_ 1 _._ 163e _−_ 2 0 _._ 379 _±_ 9 _._ 69e _−_ 3 0 _._ 655 _±_ 2 _._ 066e _−_ 2 0 _._ 345 _±_ 4 _._ 67e _−_ 3 0 _._ 943 _±_ 6 _._ 364e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 37 _±_ 6 _._ 721e _−_ 3 0 _._ 508 _±_ 8 _._ 322e _−_ 3 0 _._ 384 _±_ 1 _._ 658e _−_ 2 0 _._ 666 _±_ 2 _._ 546e _−_ 2 0 _._ 347 _±_ 7 _._ 267e _−_ 3 0 _._ 932 _±_ 1 _._ 746e _−_ 2
gemini-2.0-flash ICD patchtsmixer 0 _._ 425 _±_ 1 _._ 65e _−_ 2 0 _._ 554 _±_ 2 _._ 298e _−_ 2 0 _._ 436 _±_ 5 _._ 942e _−_ 3 0 _._ 72 _±_ 1 _._ 483e _−_ 2 0 _._ 368 _±_ 1 _._ 732e _−_ 2 0 _._ 943 _±_ 1 _._ 599e _−_ 2
gemini-2.0-flash ICD timemixer 0 _._ 412 _±_ 4 _._ 38e _−_ 3 0 _._ 578 _±_ 1 _._ 692e _−_ 2 0 _._ 395 _±_ 1 _._ 056e _−_ 2 0 _._ 709 _±_ 1 _._ 757e _−_ 2 0 _._ 337 _±_ 1 _._ 046e _−_ 2 0 _._ 943 _±_ 4 _._ 178e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 301 _±_ 4 _._ 708e _−_ 3 0 _._ 384 _±_ 1 _._ 742e _−_ 2 0 _._ 307 _±_ 6 _._ 442e _−_ 3 0 _._ 55 _±_ 2 _._ 156e _−_ 2 0 _._ 344 _±_ 6 _._ 558e _−_ 3 0 _._ 92 _±_ 8 _._ 059e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 305 _±_ 7 _._ 051e _−_ 3 0 _._ 385 _±_ 3 _._ 715e _−_ 3 0 _._ 307 _±_ 1 _._ 223e _−_ 2 0 _._ 523 _±_ 2 _._ 544e _−_ 2 0 _._ 347 _±_ 6 _._ 139e _−_ 3 0 _._ 903 _±_ 1 _._ 67e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 492 _±_ 6 _._ 942e _−_ 2 0 _._ 6 _±_ 1 _._ 178e _−_ 1 0 _._ 491 _±_ 3 _._ 313e _−_ 2 0 _._ 798 _±_ 9 _._ 88e _−_ 2 0 _._ 41 _±_ 4 _._ 623e _−_ 3 0 _._ 999 _±_ 7 _._ 724e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 336 _±_ 1 _._ 257e _−_ 3 0 _._ 396 _±_ 2 _._ 114e _−_ 2 0 _._ 337 _±_ 7 _._ 226e _−_ 3 0 _._ 54 _±_ 1 _._ 294e _−_ 2 0 _._ 338 _±_ 4 _._ 963e _−_ 3 0 _._ 928 _±_ 9 _._ 852e _−_ 4
gemini-2.0-flash Trend lstm 0 _._ 321 _±_ 4 _._ 403e _−_ 3 0 _._ 436 _±_ 4 _._ 094e _−_ 3 0 _._ 324 _±_ 8 _._ 987e _−_ 3 0 _._ 603 _±_ 6 _._ 258e _−_ 3 0 _._ 343 _±_ 5 _._ 967e _−_ 3 0 _._ 937 _±_ 7 _._ 98e _−_ 4
gemini-2.0-flash Trend mlp 0 _._ 333 _±_ 5 _._ 068e _−_ 3 0 _._ 453 _±_ 6 _._ 094e _−_ 3 0 _._ 32 _±_ 4 _._ 738e _−_ 3 0 _._ 592 _±_ 1 _._ 639e _−_ 2 0 _._ 348 _±_ 1 _._ 258e _−_ 2 0 _._ 929 _±_ 1 _._ 13e _−_ 2
gemini-2.0-flash Trend patchtsmixer 0 _._ 379 _±_ 3 _._ 72e _−_ 3 0 _._ 479 _±_ 3 _._ 638e _−_ 3 0 _._ 37 _±_ 5 _._ 582e _−_ 3 0 _._ 615 _±_ 9 _._ 403e _−_ 3 0 _._ 366 _±_ 8 _._ 984e _−_ 3 0 _._ 934 _±_ 9 _._ 468e _−_ 3
gemini-2.0-flash Trend timemixer 0 _._ 35 _±_ 8 _._ 609e _−_ 3 0 _._ 471 _±_ 1 _._ 277e _−_ 2 0 _._ 349 _±_ 1 _._ 801e _−_ 2 0 _._ 615 _±_ 1 _._ 997e _−_ 2 0 _._ 326 _±_ 5 _._ 127e _−_ 3 0 _._ 921 _±_ 6 _._ 568e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 31 _±_ 6 _._ 208e _−_ 3 0 _._ 399 _±_ 1 _._ 677e _−_ 2 0 _._ 308 _±_ 8 _._ 873e _−_ 3 0 _._ 556 _±_ 1 _._ 445e _−_ 2 0 _._ 348 _±_ 3 _._ 44e _−_ 3 0 _._ 93 _±_ 5 _._ 467e _−_ 4
gemini-2.0-flash zero shot +TFM mlp 0 _._ 299 _±_ 4 _._ 766e _−_ 3 0 _._ 351 _±_ 4 _._ 897e _−_ 3 0 _._ 302 _±_ 7 _._ 655e _−_ 3 0 _._ 52 _±_ 3 _._ 221e _−_ 2 0 _._ 344 _±_ 1 _._ 348e _−_ 2 0 _._ 891 _±_ 3 _._ 461e _−_ 2
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 516 _±_ 4 _._ 704e _−_ 2 0 _._ 659 _±_ 9 _._ 077e _−_ 2 0 _._ 438 _±_ 3 _._ 328e _−_ 2 0 _._ 635 _±_ 1 _._ 248e _−_ 1 0 _._ 407 _±_ 1 _._ 049e _−_ 2 0 _._ 975 _±_ 1 _._ 336e _−_ 2
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 339 _±_ 6 _._ 364e _−_ 3 0 _._ 391 _±_ 3 _._ 247e _−_ 2 0 _._ 333 _±_ 4 _._ 202e _−_ 3 0 _._ 544 _±_ 9 _._ 495e _−_ 3 0 _._ 325 _±_ 8 _._ 249e _−_ 3 0 _._ 944 _±_ 1 _._ 064e _−_ 2
gemini-2.0-flash zero shot lstm 0 _._ 343 _±_ 6 _._ 846e _−_ 3 0 _._ 464 _±_ 5 _._ 354e _−_ 3 0 _._ 338 _±_ 2 _._ 042e _−_ 3 0 _._ 597 _±_ 6 _._ 937e _−_ 3 0 _._ 352 _±_ 1 _._ 166e _−_ 2 0 _._ 936 _±_ 9 _._ 862e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 347 _±_ 8 _._ 917e _−_ 3 0 _._ 459 _±_ 1 _._ 166e _−_ 2 0 _._ 339 _±_ 3 _._ 727e _−_ 3 0 _._ 59 _±_ 8 _._ 758e _−_ 3 0 _._ 347 _±_ 1 _._ 1e _−_ 2 0 _._ 941 _±_ 5 _._ 464e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 414 _±_ 1 _._ 191e _−_ 2 0 _._ 509 _±_ 2 _._ 031e _−_ 2 0 _._ 378 _±_ 1 _._ 284e _−_ 2 0 _._ 631 _±_ 2 _._ 204e _−_ 2 0 _._ 364 _±_ 6 _._ 278e _−_ 3 0 _._ 922 _±_ 8 _._ 645e _−_ 3
gemini-2.0-flash zero shot timemixer 0 _._ 378 _±_ 1 _._ 103e _−_ 2 0 _._ 51 _±_ 2 _._ 382e _−_ 2 0 _._ 35 _±_ 1 _._ 269e _−_ 2 0 _._ 624 _±_ 1 _._ 051e _−_ 2 0 _._ 347 _±_ 8 _._ 378e _−_ 3 0 _._ 939 _±_ 8 _._ 521e _−_ 3
interp lstm 0 _._ 29 _±_ 1 _._ 648e _−_ 3 0 _._ 38 _±_ 6 _._ 123e _−_ 3 0 _._ 309 _±_ 1 _._ 547e _−_ 2 0 _._ 756 _±_ 4 _._ 973e _−_ 3 0 _._ 412 _±_ 5 _._ 721e _−_ 3 0 _._ 861 _±_ 3 _._ 341e _−_ 2
interp mlp 0 _._ 301 _±_ 7 _._ 762e _−_ 3 0 _._ 366 _±_ 5 _._ 698e _−_ 3 0 _._ 332 _±_ 7 _._ 038e _−_ 3 0 _._ 775 _±_ 3 _._ 284e _−_ 3 0 _._ 425 _±_ 1 _._ 774e _−_ 2 0 _._ 79 _±_ 1 _._ 397e _−_ 2
interp patchtsmixer 0 _._ 37 _±_ 1 _._ 346e _−_ 3 0 _._ 46 _±_ 1 _._ 034e _−_ 2 0 _._ 43 _±_ 1 _._ 757e _−_ 2 0 _._ 914 _±_ 1 _._ 501e _−_ 2 0 _._ 493 _±_ 9 _._ 374e _−_ 3 0 _._ 891 _±_ 2 _._ 526e _−_ 2
interp timemixer 0 _._ 337 _±_ 1 _._ 468e _−_ 2 0 _._ 426 _±_ 1 _._ 816e _−_ 3 0 _._ 373 _±_ 9 _._ 808e _−_ 3 0 _._ 86 _±_ 9 _._ 56e _−_ 3 0 _._ 437 _±_ 1 _._ 081e _−_ 2 0 _._ 889 _±_ 2 _._ 57e _−_ 2
mean lstm 0 _._ 278 _±_ 6 _._ 395e _−_ 3 0 _._ 364 _±_ 5 _._ 147e _−_ 3 0 _._ 336 _±_ 1 _._ 411e _−_ 2 0 _._ 786 _±_ 9 _._ 499e _−_ 3 0 _._ 402 _±_ 9 _._ 46e _−_ 3 0 _._ 858 _±_ 2 _._ 289e _−_ 2
mean mlp 0 _._ 289 _±_ 7 _._ 444e _−_ 3 0 _._ 357 _±_ 2 _._ 237e _−_ 3 0 _._ 343 _±_ 7 _._ 519e _−_ 3 0 _._ 822 _±_ 6 _._ 117e _−_ 3 0 _._ 393 _±_ 2 _._ 354e _−_ 3 0 _._ 801 _±_ 1 _._ 183e _−_ 2
mean patchtsmixer 0 _._ 38 _±_ 4 _._ 793e _−_ 3 0 _._ 486 _±_ 1 _._ 508e _−_ 2 0 _._ 447 _±_ 9 _._ 717e _−_ 3 0 _._ 928 _±_ 9 _._ 854e _−_ 3 0 _._ 528 _±_ 8 _._ 409e _−_ 3 0 _._ 954 _±_ 1 _._ 272e _−_ 2
mean timemixer 0 _._ 328 _±_ 8 _._ 1e _−_ 3 0 _._ 409 _±_ 3 _._ 781e _−_ 3 0 _._ 357 _±_ 8 _._ 922e _−_ 3 0 _._ 82 _±_ 1 _._ 152e _−_ 2 0 _._ 439 _±_ 1 _._ 902e _−_ 2 0 _._ 848 _±_ 1 _._ 813e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 29 _±_ 7 _._ 114e _−_ 3 0 _._ 369 _±_ 1 _._ 166e _−_ 2 0 _._ 281 _±_ 1 _._ 775e _−_ 3 0 _._ 532 _±_ 2 _._ 267e _−_ 3 0 _._ 327 _±_ 8 _._ 959e _−_ 4 0 _._ 908 _±_ 1 _._ 299e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 283 _±_ 9 _._ 061e _−_ 3 0 _._ 337 _±_ 1 _._ 212e _−_ 2 0 _._ 265 _±_ 2 _._ 853e _−_ 3 0 _._ 45 _±_ 1 _._ 279e _−_ 2 0 _._ 332 _±_ 5 _._ 21e _−_ 3 0 _._ 849 _±_ 2 _._ 953e _−_ 3
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 5 _±_ 4 _._ 685e _−_ 2 0 _._ 628 _±_ 1 _._ 227e _−_ 1 0 _._ 44 _±_ 4 _._ 554e _−_ 2 0 _._ 686 _±_ 1 _._ 143e _−_ 1 0 _._ 423 _±_ 1 _._ 273e _−_ 2 0 _._ 986 _±_ 1 _._ 659e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 324 _±_ 4 _._ 28e _−_ 3 0 _._ 377 _±_ 7 _._ 914e _−_ 3 0 _._ 31 _±_ 6 _._ 657e _−_ 3 0 _._ 545 _±_ 1 _._ 486e _−_ 2 0 _._ 336 _±_ 1 _._ 661e _−_ 2 0 _._ 894 _±_ 1 _._ 348e _−_ 2
No ~~s~~ um ~~C~~ oT lstm 0 _._ 301 _±_ 5 _._ 112e _−_ 3 0 _._ 4 _±_ 1 _._ 102e _−_ 2 0 _._ 288 _±_ 1 _._ 314e _−_ 2 0 _._ 532 _±_ 1 _._ 009e _−_ 2 0 _._ 34 _±_ 8 _._ 861e _−_ 3 0 _._ 919 _±_ 7 _._ 784e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 299 _±_ 3 _._ 81e _−_ 3 0 _._ 396 _±_ 7 _._ 231e _−_ 3 0 _._ 28 _±_ 3 _._ 344e _−_ 3 0 _._ 537 _±_ 7 _._ 668e _−_ 3 0 _._ 342 _±_ 4 _._ 967e _−_ 3 0 _._ 917 _±_ 1 _._ 435e _−_ 2
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 353 _±_ 1 _._ 188e _−_ 2 0 _._ 432 _±_ 1 _._ 909e _−_ 2 0 _._ 328 _±_ 7 _._ 745e _−_ 3 0 _._ 562 _±_ 1 _._ 088e _−_ 2 0 _._ 364 _±_ 9 _._ 251e _−_ 3 0 _._ 927 _±_ 2 _._ 058e _−_ 2
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 338 _±_ 1 _._ 152e _−_ 2 0 _._ 436 _±_ 7 _._ 67e _−_ 3 0 _._ 308 _±_ 1 _._ 879e _−_ 2 0 _._ 56 _±_ 2 _._ 424e _−_ 2 0 _._ 321 _±_ 6 _._ 086e _−_ 3 0 _._ 92 _±_ 7 _._ 261e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 256 _±_ 1 _._ 28e _−_ 2 0 _._ 284 _±_ 2 _._ 642e _−_ 2 0 _._ 274 _±_ 1 _._ 719e _−_ 3 0 _._ 494 _±_ 1 _._ 944e _−_ 2 0 _._ 324 _±_ 3 _._ 583e _−_ 3 0 _._ 905 _±_ 2 _._ 221e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 269 _±_ 9 _._ 898e _−_ 3 0 _._ 309 _±_ 1 _._ 739e _−_ 2 0 _._ 249 _±_ 1 _._ 39e _−_ 2 0 _._ 39 _±_ 8 _._ 124e _−_ 2 0 _._ 331 _±_ 1 _._ 195e _−_ 2 0 _._ 846 _±_ 2 _._ 891e _−_ 3
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 506 _±_ 5 _._ 949e _−_ 2 0 _._ 628 _±_ 1 _._ 194e _−_ 1 0 _._ 448 _±_ 4 _._ 995e _−_ 2 0 _._ 701 _±_ 1 _._ 086e _−_ 1 0 _._ 428 _±_ 1 _._ 259e _−_ 2 0 _._ 999 _±_ 1 _._ 091e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 324 _±_ 6 _._ 1e _−_ 4 0 _._ 37 _±_ 1 _._ 659e _−_ 2 0 _._ 313 _±_ 1 _._ 024e _−_ 2 0 _._ 522 _±_ 1 _._ 691e _−_ 2 0 _._ 338 _±_ 1 _._ 838e _−_ 2 0 _._ 909 _±_ 4 _._ 097e _−_ 3
No ~~s~~ um ~~I~~ CD lstm 0 _._ 297 _±_ 5 _._ 216e _−_ 3 0 _._ 386 _±_ 6 _._ 314e _−_ 3 0 _._ 298 _±_ 1 _._ 215e _−_ 2 0 _._ 546 _±_ 1 _._ 543e _−_ 2 0 _._ 336 _±_ 1 _._ 041e _−_ 2 0 _._ 918 _±_ 5 _._ 768e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 309 _±_ 4 _._ 016e _−_ 3 0 _._ 411 _±_ 6 _._ 651e _−_ 3 0 _._ 291 _±_ 8 _._ 175e _−_ 3 0 _._ 547 _±_ 7 _._ 513e _−_ 3 0 _._ 348 _±_ 1 _._ 28e _−_ 2 0 _._ 915 _±_ 9 _._ 047e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 347 _±_ 5 _._ 559e _−_ 3 0 _._ 432 _±_ 7 _._ 443e _−_ 3 0 _._ 339 _±_ 9 _._ 858e _−_ 3 0 _._ 565 _±_ 3 _._ 923e _−_ 3 0 _._ 364 _±_ 7 _._ 45e _−_ 3 0 _._ 915 _±_ 1 _._ 019e _−_ 2
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 362 _±_ 5 _._ 646e _−_ 3 0 _._ 459 _±_ 1 _._ 286e _−_ 2 0 _._ 32 _±_ 6 _._ 855e _−_ 3 0 _._ 574 _±_ 8 _._ 25e _−_ 3 0 _._ 321 _±_ 1 _._ 326e _−_ 2 0 _._ 931 _±_ 5 _._ 679e _−_ 3
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 279 _±_ 9 _._ 944e _−_ 3 0 _._ 343 _±_ 1 _._ 686e _−_ 2 0 _._ 283 _±_ 8 _._ 561e _−_ 3 0 _._ 53 _±_ 1 _._ 1e _−_ 2 0 _._ 329 _±_ 1 _._ 937e _−_ 3 0 _._ 908 _±_ 9 _._ 878e _−_ 4
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 271 _±_ 1 _._ 802e _−_ 2 0 _._ 307 _±_ 4 _._ 645e _−_ 2 0 _._ 267 _±_ 5 _._ 543e _−_ 3 0 _._ 469 _±_ 2 _._ 384e _−_ 2 0 _._ 33 _±_ 7 _._ 231e _−_ 3 0 _._ 819 _±_ 5 _._ 575e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 522 _±_ 7 _._ 286e _−_ 2 0 _._ 65 _±_ 1 _._ 428e _−_ 1 0 _._ 478 _±_ 5 _._ 07e _−_ 2 0 _._ 731 _±_ 8 _._ 215e _−_ 2 0 _._ 404 _±_ 8 _._ 409e _−_ 3 0 _._ 985 _±_ 1 _._ 298e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 321 _±_ 6 _._ 699e _−_ 3 0 _._ 349 _±_ 1 _._ 516e _−_ 2 0 _._ 307 _±_ 4 _._ 901e _−_ 3 0 _._ 531 _±_ 1 _._ 704e _−_ 2 0 _._ 347 _±_ 7 _._ 004e _−_ 3 0 _._ 904 _±_ 1 _._ 368e _−_ 3


Table 38: In-distribution results - Los. (part 1/2)


54


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**mae** **mse** **mae** **mse** **mae** **mse**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 301 _±_ 6 _._ 829e _−_ 3 0 _._ 399 _±_ 1 _._ 76e _−_ 2 0 _._ 283 _±_ 5 _._ 464e _−_ 3 0 _._ 538 _±_ 7 _._ 988e _−_ 3 0 _._ 339 _±_ 5 _._ 337e _−_ 3 0 _._ 92 _±_ 6 _._ 172e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 3 _±_ 9 _._ 631e _−_ 3 0 _._ 386 _±_ 2 _._ 206e _−_ 2 0 _._ 294 _±_ 1 _._ 381e _−_ 2 0 _._ 539 _±_ 1 _._ 816e _−_ 2 0 _._ 343 _±_ 1 _._ 163e _−_ 2 0 _._ 929 _±_ 2 _._ 489e _−_ 3
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 348 _±_ 3 _._ 213e _−_ 3 0 _._ 428 _±_ 8 _._ 989e _−_ 3 0 _._ 329 _±_ 9 _._ 072e _−_ 3 0 _._ 563 _±_ 6 _._ 203e _−_ 3 0 _._ 37 _±_ 1 _._ 121e _−_ 2 0 _._ 93 _±_ 1 _._ 805e _−_ 2
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 363 _±_ 1 _._ 044e _−_ 2 0 _._ 457 _±_ 1 _._ 057e _−_ 2 0 _._ 326 _±_ 1 _._ 872e _−_ 2 0 _._ 575 _±_ 8 _._ 601e _−_ 3 0 _._ 325 _±_ 9 _._ 516e _−_ 3 0 _._ 916 _±_ 6 _._ 562e _−_ 3
medgemma CoT +TFM lstm 0 _._ 312 _±_ 6 _._ 866e _−_ 3 0 _._ 405 _±_ 2 _._ 334e _−_ 2 0 _._ 312 _±_ 1 _._ 294e _−_ 2 0 _._ 569 _±_ 2 _._ 844e _−_ 2 0 _._ 346 _±_ 3 _._ 115e _−_ 3 0 _._ 929 _±_ 4 _._ 153e _−_ 4
medgemma CoT +TFM mlp 0 _._ 299 _±_ 1 _._ 399e _−_ 2 0 _._ 355 _±_ 3 _._ 591e _−_ 2 0 _._ 288 _±_ 9 _._ 295e _−_ 3 0 _._ 486 _±_ 3 _._ 863e _−_ 2 0 _._ 339 _±_ 2 _._ 546e _−_ 3 0 _._ 912 _±_ 1 _._ 611e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 485 _±_ 3 _._ 325e _−_ 2 0 _._ 601 _±_ 9 _._ 309e _−_ 2 0 _._ 403 _±_ 1 _._ 52e _−_ 2 0 _._ 543 _±_ 1 _._ 788e _−_ 2 0 _._ 412 _±_ 6 _._ 571e _−_ 3 0 _._ 993 _±_ 1 _._ 227e _−_ 2
medgemma CoT +TFM timemixer 0 _._ 344 _±_ 5 _._ 178e _−_ 3 0 _._ 405 _±_ 1 _._ 659e _−_ 2 0 _._ 339 _±_ 2 _._ 904e _−_ 3 0 _._ 542 _±_ 7 _._ 279e _−_ 3 0 _._ 32 _±_ 6 _._ 392e _−_ 3 0 _._ 933 _±_ 1 _._ 025e _−_ 2
medgemma CoT lstm 0 _._ 341 _±_ 4 _._ 005e _−_ 3 0 _._ 463 _±_ 7 _._ 062e _−_ 3 0 _._ 332 _±_ 7 _._ 19e _−_ 3 0 _._ 603 _±_ 8 _._ 312e _−_ 3 0 _._ 347 _±_ 5 _._ 449e _−_ 3 0 _._ 939 _±_ 6 _._ 47e _−_ 3
medgemma CoT mlp 0 _._ 343 _±_ 6 _._ 417e _−_ 3 0 _._ 477 _±_ 1 _._ 229e _−_ 2 0 _._ 333 _±_ 1 _._ 285e _−_ 2 0 _._ 609 _±_ 8 _._ 441e _−_ 3 0 _._ 343 _±_ 5 _._ 861e _−_ 3 0 _._ 937 _±_ 5 _._ 103e _−_ 3
medgemma CoT patchtsmixer 0 _._ 408 _±_ 8 _._ 074e _−_ 3 0 _._ 518 _±_ 2 _._ 414e _−_ 2 0 _._ 386 _±_ 3 _._ 992e _−_ 3 0 _._ 647 _±_ 9 _._ 512e _−_ 3 0 _._ 359 _±_ 3 _._ 952e _−_ 3 0 _._ 929 _±_ 8 _._ 375e _−_ 3
medgemma CoT timemixer 0 _._ 387 _±_ 1 _._ 108e _−_ 2 0 _._ 529 _±_ 2 _._ 851e _−_ 2 0 _._ 347 _±_ 7 _._ 617e _−_ 3 0 _._ 615 _±_ 1 _._ 594e _−_ 2 0 _._ 336 _±_ 7 _._ 898e _−_ 3 0 _._ 946 _±_ 2 _._ 82e _−_ 3
medgemma ICD +TFM lstm 0 _._ 319 _±_ 1 _._ 329e _−_ 2 0 _._ 422 _±_ 2 _._ 758e _−_ 2 0 _._ 307 _±_ 6 _._ 127e _−_ 3 0 _._ 528 _±_ 2 _._ 618e _−_ 2 0 _._ 348 _±_ 2 _._ 002e _−_ 3 0 _._ 935 _±_ 6 _._ 341e _−_ 4
medgemma ICD +TFM mlp 0 _._ 322 _±_ 3 _._ 012e _−_ 3 0 _._ 421 _±_ 1 _._ 392e _−_ 2 0 _._ 3 _±_ 1 _._ 038e _−_ 2 0 _._ 498 _±_ 3 _._ 683e _−_ 2 0 _._ 349 _±_ 6 _._ 55e _−_ 3 0 _._ 916 _±_ 1 _._ 648e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 484 _±_ 4 _._ 294e _−_ 2 0 _._ 587 _±_ 9 _._ 281e _−_ 2 0 _._ 492 _±_ 2 _._ 757e _−_ 2 0 _._ 799 _±_ 6 _._ 441e _−_ 2 0 _._ 415 _±_ 5 _._ 771e _−_ 3 1 _._ 012 _±_ 9 _._ 506e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 345 _±_ 6 _._ 85e _−_ 3 0 _._ 405 _±_ 2 _._ 674e _−_ 2 0 _._ 343 _±_ 3 _._ 796e _−_ 3 0 _._ 543 _±_ 1 _._ 663e _−_ 2 0 _._ 344 _±_ 6 _._ 094e _−_ 3 0 _._ 949 _±_ 8 _._ 038e _−_ 3
medgemma ICD lstm 0 _._ 355 _±_ 2 _._ 561e _−_ 3 0 _._ 494 _±_ 1 _._ 149e _−_ 2 0 _._ 356 _±_ 6 _._ 237e _−_ 3 0 _._ 609 _±_ 1 _._ 937e _−_ 2 0 _._ 35 _±_ 9 _._ 343e _−_ 3 0 _._ 938 _±_ 6 _._ 572e _−_ 3
medgemma ICD mlp 0 _._ 352 _±_ 5 _._ 407e _−_ 3 0 _._ 499 _±_ 1 _._ 063e _−_ 2 0 _._ 349 _±_ 6 _._ 459e _−_ 3 0 _._ 618 _±_ 1 _._ 178e _−_ 2 0 _._ 349 _±_ 6 _._ 77e _−_ 3 0 _._ 944 _±_ 8 _._ 925e _−_ 3
medgemma ICD patchtsmixer 0 _._ 424 _±_ 1 _._ 153e _−_ 2 0 _._ 549 _±_ 1 _._ 159e _−_ 2 0 _._ 399 _±_ 2 _._ 139e _−_ 2 0 _._ 653 _±_ 3 _._ 121e _−_ 2 0 _._ 368 _±_ 1 _._ 218e _−_ 2 0 _._ 942 _±_ 1 _._ 61e _−_ 2
medgemma ICD timemixer 0 _._ 396 _±_ 4 _._ 963e _−_ 3 0 _._ 549 _±_ 8 _._ 559e _−_ 3 0 _._ 381 _±_ 6 _._ 995e _−_ 3 0 _._ 679 _±_ 1 _._ 414e _−_ 2 0 _._ 334 _±_ 9 _._ 54e _−_ 3 0 _._ 934 _±_ 2 _._ 482e _−_ 3
medgemma Trend +TFM lstm 0 _._ 291 _±_ 1 _._ 051e _−_ 2 0 _._ 366 _±_ 1 _._ 907e _−_ 2 0 _._ 301 _±_ 1 _._ 494e _−_ 2 0 _._ 528 _±_ 3 _._ 878e _−_ 2 0 _._ 346 _±_ 5 _._ 352e _−_ 4 0 _._ 931 _±_ 8 _._ 166e _−_ 4
medgemma Trend +TFM mlp 0 _._ 287 _±_ 1 _._ 007e _−_ 2 0 _._ 346 _±_ 2 _._ 704e _−_ 2 0 _._ 281 _±_ 6 _._ 273e _−_ 3 0 _._ 474 _±_ 1 _._ 746e _−_ 2 0 _._ 344 _±_ 1 _._ 023e _−_ 2 0 _._ 902 _±_ 1 _._ 618e _−_ 2
medgemma Trend +TFM patchtsmixer 0 _._ 512 _±_ 3 _._ 909e _−_ 2 0 _._ 657 _±_ 8 _._ 499e _−_ 2 0 _._ 456 _±_ 3 _._ 573e _−_ 2 0 _._ 727 _±_ 1 _._ 408e _−_ 1 0 _._ 412 _±_ 3 _._ 71e _−_ 3 0 _._ 999 _±_ 2 _._ 558e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 345 _±_ 5 _._ 339e _−_ 3 0 _._ 412 _±_ 3 _._ 851e _−_ 3 0 _._ 33 _±_ 1 _._ 176e _−_ 2 0 _._ 508 _±_ 2 _._ 546e _−_ 2 0 _._ 333 _±_ 1 _._ 622e _−_ 2 0 _._ 93 _±_ 5 _._ 742e _−_ 3
medgemma Trend lstm 0 _._ 316 _±_ 2 _._ 651e _−_ 3 0 _._ 437 _±_ 3 _._ 236e _−_ 3 0 _._ 316 _±_ 7 _._ 792e _−_ 3 0 _._ 601 _±_ 1 _._ 346e _−_ 2 0 _._ 35 _±_ 8 _._ 86e _−_ 3 0 _._ 94 _±_ 6 _._ 694e _−_ 3
medgemma Trend mlp 0 _._ 321 _±_ 2 _._ 304e _−_ 3 0 _._ 433 _±_ 9 _._ 588e _−_ 3 0 _._ 322 _±_ 8 _._ 1e _−_ 3 0 _._ 599 _±_ 1 _._ 109e _−_ 2 0 _._ 342 _±_ 9 _._ 51e _−_ 3 0 _._ 933 _±_ 7 _._ 875e _−_ 3
medgemma Trend patchtsmixer 0 _._ 383 _±_ 9 _._ 782e _−_ 3 0 _._ 478 _±_ 8 _._ 87e _−_ 3 0 _._ 37 _±_ 1 _._ 515e _−_ 2 0 _._ 637 _±_ 2 _._ 943e _−_ 2 0 _._ 36 _±_ 9 _._ 033e _−_ 3 0 _._ 935 _±_ 1 _._ 177e _−_ 2
medgemma Trend timemixer 0 _._ 357 _±_ 6 _._ 686e _−_ 3 0 _._ 481 _±_ 8 _._ 074e _−_ 3 0 _._ 349 _±_ 2 _._ 561e _−_ 2 0 _._ 636 _±_ 2 _._ 673e _−_ 2 0 _._ 33 _±_ 6 _._ 434e _−_ 3 0 _._ 935 _±_ 9 _._ 01e _−_ 3
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 306 _±_ 1 _._ 331e _−_ 2 0 _._ 391 _±_ 3 _._ 787e _−_ 2 0 _._ 31 _±_ 9 _._ 843e _−_ 3 0 _._ 555 _±_ 1 _._ 442e _−_ 2 0 _._ 343 _±_ 7 _._ 858e _−_ 4 0 _._ 932 _±_ 1 _._ 795e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 291 _±_ 6 _._ 487e _−_ 3 0 _._ 333 _±_ 1 _._ 188e _−_ 2 0 _._ 304 _±_ 1 _._ 345e _−_ 2 0 _._ 53 _±_ 3 _._ 875e _−_ 2 0 _._ 343 _±_ 1 _._ 195e _−_ 2 0 _._ 902 _±_ 2 _._ 005e _−_ 2
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 516 _±_ 6 _._ 151e _−_ 2 0 _._ 631 _±_ 1 _._ 278e _−_ 1 0 _._ 452 _±_ 2 _._ 158e _−_ 2 0 _._ 706 _±_ 7 _._ 779e _−_ 2 0 _._ 411 _±_ 1 _._ 256e _−_ 2 0 _._ 995 _±_ 1 _._ 312e _−_ 2
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 345 _±_ 2 _._ 781e _−_ 3 0 _._ 412 _±_ 1 _._ 626e _−_ 2 0 _._ 33 _±_ 4 _._ 14e _−_ 3 0 _._ 553 _±_ 1 _._ 265e _−_ 2 0 _._ 335 _±_ 6 _._ 177e _−_ 3 0 _._ 918 _±_ 1 _._ 864e _−_ 2
medgemma zero ~~s~~ hot lstm 0 _._ 345 _±_ 8 _._ 007e _−_ 3 0 _._ 469 _±_ 5 _._ 448e _−_ 3 0 _._ 348 _±_ 4 _._ 531e _−_ 3 0 _._ 608 _±_ 1 _._ 119e _−_ 2 0 _._ 343 _±_ 4 _._ 79e _−_ 3 0 _._ 933 _±_ 3 _._ 1e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 35 _±_ 8 _._ 235e _−_ 3 0 _._ 473 _±_ 2 _._ 061e _−_ 2 0 _._ 343 _±_ 9 _._ 584e _−_ 3 0 _._ 596 _±_ 9 _._ 739e _−_ 3 0 _._ 341 _±_ 8 _._ 908e _−_ 3 0 _._ 937 _±_ 1 _._ 26e _−_ 2
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 422 _±_ 8 _._ 425e _−_ 3 0 _._ 53 _±_ 3 _._ 072e _−_ 2 0 _._ 384 _±_ 6 _._ 472e _−_ 3 0 _._ 633 _±_ 1 _._ 235e _−_ 2 0 _._ 364 _±_ 4 _._ 605e _−_ 3 0 _._ 927 _±_ 8 _._ 179e _−_ 3
medgemma zero ~~s~~ hot timemixer 0 _._ 399 _±_ 6 _._ 156e _−_ 3 0 _._ 557 _±_ 1 _._ 604e _−_ 2 0 _._ 359 _±_ 1 _._ 415e _−_ 2 0 _._ 622 _±_ 2 _._ 514e _−_ 2 0 _._ 333 _±_ 9 _._ 835e _−_ 3 0 _._ 935 _±_ 4 _._ 769e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM lstm 0 _._ 297 _±_ 5 _._ 776e _−_ 3 0 _._ 373 _±_ 1 _._ 361e _−_ 2 0 _._ 282 _±_ 8 _._ 444e _−_ 3 0 _._ 521 _±_ 2 _._ 444e _−_ 2 0 _._ 327 _±_ 1 _._ 642e _−_ 3 0 _._ 906 _±_ 2 _._ 524e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM mlp 0 _._ 267 _±_ 1 _._ 307e _−_ 2 0 _._ 308 _±_ 3 _._ 37e _−_ 2 0 _._ 272 _±_ 1 _._ 423e _−_ 2 0 _._ 478 _±_ 2 _._ 572e _−_ 2 0 _._ 333 _±_ 4 _._ 563e _−_ 3 0 _._ 847 _±_ 4 _._ 354e _−_ 3
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 511 _±_ 6 _._ 612e _−_ 2 0 _._ 648 _±_ 1 _._ 607e _−_ 1 0 _._ 406 _±_ 1 _._ 438e _−_ 2 0 _._ 597 _±_ 4 _._ 365e _−_ 2 0 _._ 415 _±_ 1 _._ 439e _−_ 2 0 _._ 986 _±_ 1 _._ 714e _−_ 2
No ~~s~~ um ~~z~~ ero shot zero ~~s~~ hot +TFM timemixer 0 _._ 324 _±_ 4 _._ 604e _−_ 3 0 _._ 395 _±_ 1 _._ 705e _−_ 2 0 _._ 31 _±_ 3 _._ 484e _−_ 3 0 _._ 52 _±_ 1 _._ 671e _−_ 2 0 _._ 323 _±_ 3 _._ 841e _−_ 3 0 _._ 897 _±_ 1 _._ 225e _−_ 2
No ~~s~~ um ~~z~~ ero shot lstm 0 _._ 313 _±_ 5 _._ 513e _−_ 3 0 _._ 419 _±_ 1 _._ 07e _−_ 2 0 _._ 28 _±_ 1 _._ 149e _−_ 2 0 _._ 534 _±_ 1 _._ 308e _−_ 2 0 _._ 337 _±_ 6 _._ 522e _−_ 3 0 _._ 921 _±_ 5 _._ 607e _−_ 3
No ~~s~~ um ~~z~~ ero shot mlp 0 _._ 303 _±_ 4 _._ 134e _−_ 3 0 _._ 398 _±_ 8 _._ 519e _−_ 3 0 _._ 281 _±_ 1 _._ 109e _−_ 2 0 _._ 528 _±_ 9 _._ 66e _−_ 3 0 _._ 338 _±_ 1 _._ 255e _−_ 2 0 _._ 92 _±_ 4 _._ 317e _−_ 3
No ~~s~~ um ~~z~~ ero shot patchtsmixer 0 _._ 364 _±_ 1 _._ 151e _−_ 2 0 _._ 445 _±_ 1 _._ 28e _−_ 2 0 _._ 331 _±_ 1 _._ 281e _−_ 2 0 _._ 562 _±_ 1 _._ 346e _−_ 2 0 _._ 358 _±_ 9 _._ 935e _−_ 3 0 _._ 914 _±_ 1 _._ 942e _−_ 2
No ~~s~~ um ~~z~~ ero shot timemixer 0 _._ 348 _±_ 1 _._ 641e _−_ 2 0 _._ 451 _±_ 1 _._ 311e _−_ 2 0 _._ 313 _±_ 1 _._ 207e _−_ 2 0 _._ 566 _±_ 9 _._ 761e _−_ 3 0 _._ 324 _±_ 6 _._ 311e _−_ 3 0 _._ 917 _±_ 4 _._ 715e _−_ 3
right lstm 0 _._ 28 _±_ 7 _._ 312e _−_ 3 0 _._ 36 _±_ 6 _._ 177e _−_ 3 0 _._ 299 _±_ 1 _._ 479e _−_ 2 0 _._ 751 _±_ 8 _._ 077e _−_ 3 0 _._ 41 _±_ 1 _._ 044e _−_ 2 0 _._ 847 _±_ 7 _._ 172e _−_ 3
right mlp 0 _._ 276 _±_ 4 _._ 021e _−_ 3 0 _._ 341 _±_ 1 _._ 953e _−_ 3 0 _._ 295 _±_ 1 _._ 189e _−_ 2 0 _._ 752 _±_ 4 _._ 509e _−_ 3 0 _._ 408 _±_ 1 _._ 236e _−_ 2 0 _._ 786 _±_ 1 _._ 062e _−_ 2
right patchtsmixer 0 _._ 342 _±_ 2 _._ 115e _−_ 3 0 _._ 44 _±_ 6 _._ 682e _−_ 3 0 _._ 409 _±_ 2 _._ 039e _−_ 2 0 _._ 897 _±_ 5 _._ 624e _−_ 3 0 _._ 49 _±_ 1 _._ 099e _−_ 2 0 _._ 918 _±_ 8 _._ 367e _−_ 3
right timemixer 0 _._ 299 _±_ 5 _._ 797e _−_ 3 0 _._ 405 _±_ 5 _._ 026e _−_ 3 0 _._ 333 _±_ 1 _._ 573e _−_ 2 0 _._ 852 _±_ 7 _._ 719e _−_ 3 0 _._ 426 _±_ 1 _._ 061e _−_ 2 0 _._ 881 _±_ 1 _._ 795e _−_ 2


Table 39: In-distribution results - Los. (part 2/2)


55


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**mae** **mse** **mae** **mse**


Llama-3.1 CoT +TFM lstm 0 _._ 343 _±_ 6 _._ 473e _−_ 3 1 _._ 017 _±_ 4 _._ 164e _−_ 3 0 _._ 347 _±_ 1 _._ 144e _−_ 3 0 _._ 988 _±_ 2 _._ 541e _−_ 3
Llama-3.1 CoT +TFM mlp 0 _._ 373 _±_ 3 _._ 751e _−_ 3 1 _._ 047 _±_ 9 _._ 349e _−_ 3 0 _._ 351 _±_ 2 _._ 08e _−_ 3 1 _._ 014 _±_ 1 _._ 484e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 516 _±_ 1 _._ 446e _−_ 2 1 _._ 113 _±_ 1 _._ 521e _−_ 2 0 _._ 489 _±_ 1 _._ 7e _−_ 2 1 _._ 091 _±_ 1 _._ 069e _−_ 2
Llama-3.1 CoT +TFM timemixer 0 _._ 425 _±_ 6 _._ 04e _−_ 3 1 _._ 043 _±_ 3 _._ 039e _−_ 3 0 _._ 392 _±_ 2 _._ 021e _−_ 2 1 _._ 015 _±_ 1 _._ 283e _−_ 2
Llama-3.1 CoT lstm 0 _._ 795 _±_ 3 _._ 91e _−_ 2 1 _._ 544 _±_ 5 _._ 866e _−_ 2 0 _._ 558 _±_ 2 _._ 002e _−_ 2 1 _._ 267 _±_ 5 _._ 593e _−_ 2
Llama-3.1 CoT mlp 0 _._ 788 _±_ 9 _._ 331e _−_ 3 1 _._ 522 _±_ 1 _._ 23e _−_ 2 0 _._ 57 _±_ 1 _._ 623e _−_ 2 1 _._ 299 _±_ 3 _._ 296e _−_ 2
Llama-3.1 CoT patchtsmixer 0 _._ 736 _±_ 2 _._ 019e _−_ 2 1 _._ 365 _±_ 3 _._ 218e _−_ 2 0 _._ 598 _±_ 4 _._ 047e _−_ 2 1 _._ 255 _±_ 5 _._ 565e _−_ 2
Llama-3.1 CoT timemixer 0 _._ 736 _±_ 2 _._ 372e _−_ 2 1 _._ 402 _±_ 3 _._ 504e _−_ 2 0 _._ 541 _±_ 1 _._ 175e _−_ 2 1 _._ 21 _±_ 1 _._ 633e _−_ 2
Llama-3.1 ICD +TFM lstm 0 _._ 355 _±_ 7 _._ 647e _−_ 3 1 _±_ 1 _._ 835e _−_ 3 0 _._ 345 _±_ 2 _._ 242e _−_ 3 0 _._ 972 _±_ 5 _._ 06e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 386 _±_ 2 _._ 413e _−_ 3 1 _._ 042 _±_ 1 _._ 282e _−_ 2 0 _._ 347 _±_ 5 _._ 083e _−_ 3 0 _._ 993 _±_ 4 _._ 004e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 516 _±_ 1 _._ 217e _−_ 2 1 _._ 11 _±_ 5 _._ 535e _−_ 3 0 _._ 535 _±_ 3 _._ 187e _−_ 3 1 _._ 154 _±_ 1 _._ 118e _−_ 2
Llama-3.1 ICD +TFM timemixer 0 _._ 427 _±_ 7 _._ 748e _−_ 3 1 _._ 037 _±_ 6 _._ 871e _−_ 3 0 _._ 425 _±_ 7 _._ 496e _−_ 3 1 _._ 016 _±_ 4 _._ 586e _−_ 3
Llama-3.1 ICD lstm 0 _._ 824 _±_ 2 _._ 439e _−_ 2 1 _._ 715 _±_ 4 _._ 504e _−_ 2 0 _._ 683 _±_ 2 _._ 758e _−_ 2 1 _._ 474 _±_ 7 _._ 487e _−_ 2
Llama-3.1 ICD mlp 0 _._ 803 _±_ 2 _._ 404e _−_ 2 1 _._ 632 _±_ 5 _._ 696e _−_ 2 0 _._ 677 _±_ 5 _._ 667e _−_ 2 1 _._ 452 _±_ 1 _._ 538e _−_ 1
Llama-3.1 ICD patchtsmixer 0 _._ 807 _±_ 2 _._ 36e _−_ 2 1 _._ 583 _±_ 4 _._ 903e _−_ 2 0 _._ 645 _±_ 2 _._ 377e _−_ 2 1 _._ 29 _±_ 4 _._ 463e _−_ 2
Llama-3.1 ICD timemixer 0 _._ 756 _±_ 1 _._ 606e _−_ 2 1 _._ 515 _±_ 2 _._ 635e _−_ 2 0 _._ 577 _±_ 7 _._ 892e _−_ 3 1 _._ 208 _±_ 1 _._ 812e _−_ 2
Llama-3.1 Trend +TFM lstm 0 _._ 366 _±_ 1 _._ 907e _−_ 3 1 _._ 004 _±_ 5 _._ 751e _−_ 3 0 _._ 363 _±_ 1 _._ 113e _−_ 2 0 _._ 976 _±_ 4 _._ 142e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 393 _±_ 3 _._ 876e _−_ 3 1 _._ 037 _±_ 1 _._ 453e _−_ 2 0 _._ 378 _±_ 4 _._ 262e _−_ 3 0 _._ 995 _±_ 1 _._ 128e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 563 _±_ 1 _._ 006e _−_ 2 1 _._ 152 _±_ 1 _._ 473e _−_ 2 0 _._ 543 _±_ 3 _._ 772e _−_ 2 1 _._ 125 _±_ 3 _._ 512e _−_ 2
Llama-3.1 Trend +TFM timemixer 0 _._ 463 _±_ 1 _._ 657e _−_ 2 1 _._ 049 _±_ 1 _._ 219e _−_ 2 0 _._ 441 _±_ 6 _._ 405e _−_ 3 1 _._ 023 _±_ 6 _._ 917e _−_ 3
Llama-3.1 Trend lstm 1 _._ 075 _±_ 1 _._ 984e _−_ 2 2 _._ 233 _±_ 5 _._ 925e _−_ 2 0 _._ 677 _±_ 7 _._ 822e _−_ 3 1 _._ 389 _±_ 1 _._ 461e _−_ 2
Llama-3.1 Trend mlp 1 _._ 041 _±_ 2 _._ 621e _−_ 2 2 _._ 128 _±_ 5 _._ 849e _−_ 2 0 _._ 621 _±_ 1 _._ 222e _−_ 2 1 _._ 278 _±_ 3 _._ 591e _−_ 2
Llama-3.1 Trend patchtsmixer 0 _._ 985 _±_ 2 _._ 71e _−_ 2 1 _._ 874 _±_ 6 _._ 315e _−_ 2 0 _._ 663 _±_ 2 _._ 518e _−_ 2 1 _._ 285 _±_ 4 _._ 798e _−_ 2
Llama-3.1 Trend timemixer 0 _._ 971 _±_ 4 _._ 939e _−_ 2 1 _._ 889 _±_ 1 _._ 276e _−_ 1 0 _._ 62 _±_ 1 _._ 656e _−_ 2 1 _._ 228 _±_ 2 _._ 602e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 347 _±_ 3 _._ 392e _−_ 3 0 _._ 991 _±_ 1 _._ 087e _−_ 2 0 _._ 355 _±_ 3 _._ 006e _−_ 3 0 _._ 976 _±_ 4 _._ 357e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 373 _±_ 5 _._ 138e _−_ 3 1 _._ 018 _±_ 7 _._ 934e _−_ 3 0 _._ 349 _±_ 6 _._ 696e _−_ 3 0 _._ 992 _±_ 3 _._ 06e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 517 _±_ 1 _._ 5e _−_ 2 1 _._ 107 _±_ 8 _._ 694e _−_ 3 0 _._ 482 _±_ 1 _._ 316e _−_ 2 1 _._ 071 _±_ 1 _._ 003e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 418 _±_ 9 _._ 84e _−_ 3 1 _._ 025 _±_ 8 _._ 069e _−_ 3 0 _._ 429 _±_ 6 _._ 42e _−_ 3 1 _._ 013 _±_ 7 _._ 363e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 834 _±_ 1 _._ 674e _−_ 2 1 _._ 618 _±_ 4 _._ 316e _−_ 2 0 _._ 722 _±_ 4 _._ 193e _−_ 2 1 _._ 446 _±_ 6 _._ 508e _−_ 2
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 872 _±_ 2 _._ 293e _−_ 2 1 _._ 673 _±_ 3 _._ 933e _−_ 2 0 _._ 721 _±_ 5 _._ 726e _−_ 2 1 _._ 477 _±_ 1 _._ 215e _−_ 1
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 824 _±_ 9 _._ 857e _−_ 3 1 _._ 509 _±_ 2 _._ 648e _−_ 2 0 _._ 693 _±_ 3 _._ 927e _−_ 2 1 _._ 314 _±_ 6 _._ 808e _−_ 2
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 776 _±_ 2 _._ 656e _−_ 2 1 _._ 448 _±_ 5 _._ 02e _−_ 2 0 _._ 703 _±_ 4 _._ 272e _−_ 2 1 _._ 381 _±_ 8 _._ 666e _−_ 2
TFM lstm 0 _._ 908 _±_ 4 _._ 184e _−_ 2 1 _._ 523 _±_ 9 _._ 286e _−_ 2 1 _._ 082 _±_ 3 _._ 76e _−_ 2 2 _._ 178 _±_ 1 _._ 497e _−_ 1
TFM mlp 0 _._ 895 _±_ 1 _._ 446e _−_ 2 1 _._ 427 _±_ 3 _._ 894e _−_ 2 1 _._ 082 _±_ 4 _._ 853e _−_ 2 2 _._ 196 _±_ 2 _._ 061e _−_ 1
TFM patchtsmixer 0 _._ 797 _±_ 6 _._ 325e _−_ 2 1 _._ 206 _±_ 1 _._ 132e _−_ 1 0 _._ 929 _±_ 8 _._ 13e _−_ 2 1 _._ 585 _±_ 2 _._ 215e _−_ 1
TFM timemixer 0 _._ 814 _±_ 1 _._ 252e _−_ 1 1 _._ 28 _±_ 2 _._ 451e _−_ 1 0 _._ 99 _±_ 7 _._ 457e _−_ 2 1 _._ 944 _±_ 2 _._ 091e _−_ 1
TSDE lstm 0 _._ 551 _±_ 2 _._ 465e _−_ 2 1 _._ 205 _±_ 1 _._ 036e _−_ 1 0 _._ 766 _±_ 1 _._ 867e _−_ 1 1 _._ 144 _±_ 2 _._ 156e _−_ 1
TSDE mlp 1 _._ 454 _±_ 4 _._ 611e _−_ 1 3 _._ 135 _±_ 1 _._ 268e0 0 _._ 85 _±_ 2 _._ 359e _−_ 1 1 _._ 323 _±_ 3 _._ 066e _−_ 1
TSDE patchtsmixer 0 _._ 729 _±_ 7 _._ 139e _−_ 2 1 _._ 147 _±_ 5 _._ 025e _−_ 2 0 _._ 758 _±_ 3 _._ 708e _−_ 2 1 _._ 163 _±_ 3 _._ 816e _−_ 2
TSDE timemixer 0 _._ 888 _±_ 2 _._ 711e _−_ 1 1 _._ 446 _±_ 3 _._ 929e _−_ 1 1 _._ 42 _±_ 6 _._ 94e _−_ 2 2 _._ 369 _±_ 1 _._ 759e _−_ 1
gemini-2.0-flash CoT +TFM lstm 0 _._ 357 _±_ 3 _._ 759e _−_ 3 1 _._ 016 _±_ 4 _._ 572e _−_ 3 0 _._ 333 _±_ 4 _._ 676e _−_ 3 0 _._ 986 _±_ 4 _._ 933e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 383 _±_ 5 _._ 032e _−_ 4 1 _._ 07 _±_ 1 _._ 139e _−_ 2 0 _._ 348 _±_ 4 _._ 266e _−_ 3 0 _._ 998 _±_ 4 _._ 574e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 524 _±_ 7 _._ 045e _−_ 3 1 _._ 119 _±_ 4 _._ 735e _−_ 3 0 _._ 506 _±_ 1 _._ 762e _−_ 2 1 _._ 093 _±_ 1 _._ 268e _−_ 2
gemini-2.0-flash CoT +TFM timemixer 0 _._ 413 _±_ 6 _._ 516e _−_ 3 1 _._ 034 _±_ 8 _._ 604e _−_ 3 0 _._ 418 _±_ 3 _._ 945e _−_ 3 1 _._ 023 _±_ 2 _._ 46e _−_ 3
gemini-2.0-flash CoT lstm 1 _._ 031 _±_ 1 _._ 665e _−_ 2 2 _._ 036 _±_ 3 _._ 139e _−_ 2 0 _._ 51 _±_ 9 _._ 334e _−_ 3 1 _._ 167 _±_ 1 _._ 83e _−_ 2
gemini-2.0-flash CoT mlp 1 _._ 053 _±_ 3 _._ 363e _−_ 2 2 _._ 053 _±_ 7 _._ 408e _−_ 2 0 _._ 525 _±_ 2 _._ 298e _−_ 2 1 _._ 178 _±_ 2 _._ 304e _−_ 2
gemini-2.0-flash CoT patchtsmixer 0 _._ 981 _±_ 4 _._ 818e _−_ 2 1 _._ 82 _±_ 1 _._ 047e _−_ 1 0 _._ 537 _±_ 2 _._ 603e _−_ 2 1 _._ 138 _±_ 4 _._ 755e _−_ 2
gemini-2.0-flash CoT timemixer 1 _._ 043 _±_ 3 _._ 713e _−_ 2 2 _._ 007 _±_ 7 _._ 049e _−_ 2 0 _._ 52 _±_ 2 _._ 384e _−_ 2 1 _._ 15 _±_ 3 _._ 186e _−_ 2
gemini-2.0-flash ICD +TFM lstm 0 _._ 359 _±_ 2 _._ 204e _−_ 3 1 _._ 016 _±_ 1 _._ 085e _−_ 2 0 _._ 331 _±_ 2 _._ 327e _−_ 3 0 _._ 979 _±_ 4 _._ 021e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 385 _±_ 5 _._ 553e _−_ 3 1 _._ 062 _±_ 2 _._ 03e _−_ 2 0 _._ 343 _±_ 4 _._ 33e _−_ 3 0 _._ 986 _±_ 4 _._ 732e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 521 _±_ 1 _._ 868e _−_ 2 1 _._ 132 _±_ 2 _._ 618e _−_ 2 0 _._ 491 _±_ 7 _._ 453e _−_ 3 1 _._ 071 _±_ 1 _._ 968e _−_ 2
gemini-2.0-flash ICD +TFM timemixer 0 _._ 464 _±_ 1 _._ 75e _−_ 2 1 _._ 072 _±_ 1 _._ 602e _−_ 2 0 _._ 397 _±_ 2 _._ 892e _−_ 2 0 _._ 997 _±_ 6 _._ 933e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 67 _±_ 7 _._ 942e _−_ 2 1 _._ 369 _±_ 1 _._ 18e _−_ 1 0 _._ 507 _±_ 8 _._ 186e _−_ 3 1 _._ 15 _±_ 1 _._ 919e _−_ 2
gemini-2.0-flash ICD mlp 0 _._ 657 _±_ 1 _._ 122e _−_ 1 1 _._ 317 _±_ 1 _._ 588e _−_ 1 0 _._ 502 _±_ 1 _._ 481e _−_ 2 1 _._ 123 _±_ 1 _._ 053e _−_ 2
gemini-2.0-flash ICD patchtsmixer 0 _._ 688 _±_ 4 _._ 246e _−_ 2 1 _._ 277 _±_ 4 _._ 596e _−_ 2 0 _._ 545 _±_ 1 _._ 764e _−_ 2 1 _._ 125 _±_ 2 _._ 547e _−_ 2
gemini-2.0-flash ICD timemixer 0 _._ 706 _±_ 3 _._ 749e _−_ 2 1 _._ 324 _±_ 6 _._ 35e _−_ 2 0 _._ 506 _±_ 2 _._ 247e _−_ 2 1 _._ 113 _±_ 3 _._ 125e _−_ 2
gemini-2.0-flash Trend +TFM lstm 0 _._ 366 _±_ 3 _._ 201e _−_ 3 1 _._ 004 _±_ 4 _._ 439e _−_ 3 0 _._ 356 _±_ 3 _._ 593e _−_ 3 0 _._ 972 _±_ 6 _._ 498e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 384 _±_ 1 _._ 284e _−_ 2 1 _._ 035 _±_ 5 _._ 205e _−_ 3 0 _._ 361 _±_ 1 _._ 506e _−_ 2 0 _._ 987 _±_ 4 _._ 302e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 527 _±_ 2 _._ 383e _−_ 2 1 _._ 12 _±_ 9 _._ 917e _−_ 3 0 _._ 496 _±_ 1 _._ 71e _−_ 2 1 _._ 076 _±_ 1 _._ 597e _−_ 2
gemini-2.0-flash Trend +TFM timemixer 0 _._ 448 _±_ 1 _._ 2e _−_ 2 1 _._ 042 _±_ 8 _._ 75e _−_ 3 0 _._ 433 _±_ 1 _._ 054e _−_ 2 1 _._ 016 _±_ 7 _._ 269e _−_ 3
gemini-2.0-flash Trend lstm 1 _._ 078 _±_ 2 _._ 93e _−_ 2 2 _._ 209 _±_ 7 _._ 425e _−_ 2 0 _._ 52 _±_ 3 _._ 029e _−_ 2 1 _._ 157 _±_ 4 _._ 75e _−_ 2
gemini-2.0-flash Trend mlp 1 _._ 115 _±_ 3 _._ 582e _−_ 2 2 _._ 265 _±_ 9 _._ 766e _−_ 2 0 _._ 545 _±_ 2 _._ 363e _−_ 2 1 _._ 187 _±_ 3 _._ 69e _−_ 2
gemini-2.0-flash Trend patchtsmixer 1 _._ 059 _±_ 4 _._ 256e _−_ 2 2 _._ 041 _±_ 1 _._ 149e _−_ 1 0 _._ 576 _±_ 2 _._ 366e _−_ 2 1 _._ 165 _±_ 3 _._ 035e _−_ 2
gemini-2.0-flash Trend timemixer 1 _._ 083 _±_ 5 _._ 359e _−_ 2 2 _._ 152 _±_ 1 _._ 607e _−_ 1 0 _._ 539 _±_ 1 _._ 149e _−_ 2 1 _._ 141 _±_ 2 _._ 25e _−_ 2
gemini-2.0-flash zero shot +TFM lstm 0 _._ 361 _±_ 5 _._ 824e _−_ 3 1 _._ 017 _±_ 1 _._ 433e _−_ 3 0 _._ 353 _±_ 4 _._ 76e _−_ 3 0 _._ 971 _±_ 3 _._ 582e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 375 _±_ 2 _._ 239e _−_ 3 1 _._ 054 _±_ 5 _._ 46e _−_ 3 0 _._ 348 _±_ 4 _._ 035e _−_ 3 0 _._ 982 _±_ 1 _._ 185e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 544 _±_ 1 _._ 187e _−_ 2 1 _._ 144 _±_ 2 _._ 683e _−_ 2 0 _._ 511 _±_ 2 _._ 272e _−_ 2 1 _._ 092 _±_ 2 _._ 521e _−_ 2
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 429 _±_ 5 _._ 633e _−_ 3 1 _._ 045 _±_ 5 _._ 555e _−_ 3 0 _._ 405 _±_ 9 _._ 436e _−_ 4 0 _._ 995 _±_ 3 _._ 062e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 927 _±_ 3 _._ 896e _−_ 2 1 _._ 869 _±_ 8 _._ 006e _−_ 2 0 _._ 476 _±_ 1 _._ 601e _−_ 2 1 _._ 084 _±_ 2 _._ 417e _−_ 2
gemini-2.0-flash zero shot mlp 0 _._ 973 _±_ 1 _._ 181e _−_ 2 1 _._ 93 _±_ 3 _._ 46e _−_ 2 0 _._ 481 _±_ 4 _._ 471e _−_ 3 1 _._ 067 _±_ 6 _._ 673e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 912 _±_ 1 _._ 512e _−_ 2 1 _._ 692 _±_ 3 _._ 892e _−_ 2 0 _._ 491 _±_ 1 _._ 926e _−_ 2 1 _._ 046 _±_ 1 _._ 578e _−_ 2
gemini-2.0-flash zero shot timemixer 0 _._ 888 _±_ 3 _._ 834e _−_ 2 1 _._ 699 _±_ 9 _._ 643e _−_ 2 0 _._ 484 _±_ 2 _._ 025e _−_ 2 1 _._ 063 _±_ 2 _._ 581e _−_ 2
interp lstm 2 _._ 313 _±_ 1 _._ 543e _−_ 1 6 _._ 444 _±_ 9 _._ 518e _−_ 1 1 _._ 01 _±_ 1 _._ 029e _−_ 1 2 _._ 33 _±_ 3 _._ 167e _−_ 1
interp mlp 2 _._ 398 _±_ 6 _._ 509e _−_ 2 7 _._ 078 _±_ 3 _._ 312e _−_ 1 1 _._ 465 _±_ 1 _._ 149e _−_ 1 3 _._ 839 _±_ 6 _._ 104e _−_ 1
interp patchtsmixer 0 _._ 908 _±_ 8 _._ 378e _−_ 2 1 _._ 395 _±_ 1 _._ 569e _−_ 1 0 _._ 71 _±_ 5 _._ 453e _−_ 2 1 _._ 219 _±_ 5 _._ 595e _−_ 2
interp timemixer 0 _._ 845 _±_ 3 _._ 561e _−_ 2 1 _._ 263 _±_ 4 _._ 676e _−_ 2 0 _._ 556 _±_ 5 _._ 435e _−_ 3 1 _._ 122 _±_ 4 _._ 275e _−_ 2
mean lstm 3 _._ 13 _±_ 2 _._ 202e _−_ 1 10 _._ 631 _±_ 1 _._ 473e0 1 _._ 293 _±_ 3 _._ 09e _−_ 1 3 _._ 012 _±_ 1 _._ 482e0
mean mlp 2 _._ 745 _±_ 6 _._ 051e _−_ 2 8 _._ 177 _±_ 3 _._ 628e _−_ 1 2 _._ 204 _±_ 1 _._ 503e _−_ 1 6 _._ 225 _±_ 6 _._ 756e _−_ 1
mean patchtsmixer 1 _._ 092 _±_ 6 _._ 323e _−_ 2 1 _._ 822 _±_ 1 _._ 841e _−_ 1 0 _._ 849 _±_ 5 _._ 7e _−_ 2 1 _._ 393 _±_ 9 _._ 83e _−_ 2
mean timemixer 0 _._ 982 _±_ 4 _._ 65e _−_ 2 1 _._ 503 _±_ 1 _._ 194e _−_ 1 0 _._ 61 _±_ 3 _._ 178e _−_ 2 0 _._ 978 _±_ 3 _._ 169e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM lstm 0 _._ 404 _±_ 9 _._ 289e _−_ 3 0 _._ 994 _±_ 3 _._ 007e _−_ 3 0 _._ 467 _±_ 1 _._ 512e _−_ 2 1 _._ 021 _±_ 1 _._ 776e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM mlp 0 _._ 411 _±_ 1 _._ 161e _−_ 2 1 _._ 019 _±_ 6 _._ 541e _−_ 3 0 _._ 435 _±_ 2 _._ 834e _−_ 2 1 _._ 032 _±_ 3 _._ 57e _−_ 2
No ~~s~~ um ~~C~~ oT CoT +TFM patchtsmixer 0 _._ 585 _±_ 2 _._ 176e _−_ 2 1 _._ 181 _±_ 4 _._ 043e _−_ 2 0 _._ 594 _±_ 6 _._ 436e _−_ 2 1 _._ 176 _±_ 1 _._ 01e _−_ 1
No ~~s~~ um ~~C~~ oT CoT +TFM timemixer 0 _._ 527 _±_ 2 _._ 021e _−_ 2 1 _._ 099 _±_ 2 _._ 189e _−_ 2 0 _._ 581 _±_ 4 _._ 402e _−_ 2 1 _._ 194 _±_ 7 _._ 407e _−_ 2
No ~~s~~ um ~~C~~ oT lstm 0 _._ 844 _±_ 5 _._ 067e _−_ 2 1 _._ 724 _±_ 1 _._ 236e _−_ 1 0 _._ 967 _±_ 3 _._ 653e _−_ 2 2 _._ 018 _±_ 1 _._ 216e _−_ 1
No ~~s~~ um ~~C~~ oT mlp 0 _._ 931 _±_ 4 _._ 334e _−_ 2 1 _._ 89 _±_ 1 _._ 096e _−_ 1 0 _._ 915 _±_ 2 _._ 2e _−_ 2 1 _._ 851 _±_ 5 _._ 932e _−_ 2
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 959 _±_ 4 _._ 675e _−_ 2 1 _._ 843 _±_ 1 _._ 004e _−_ 1 0 _._ 84 _±_ 4 _._ 783e _−_ 2 1 _._ 58 _±_ 1 _._ 046e _−_ 1
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 917 _±_ 2 _._ 341e _−_ 2 1 _._ 848 _±_ 5 _._ 82e _−_ 2 0 _._ 81 _±_ 8 _._ 9e _−_ 2 1 _._ 578 _±_ 2 _._ 312e _−_ 1
No ~~s~~ um ~~I~~ CD ICD +TFM lstm 0 _._ 367 _±_ 1 _._ 105e _−_ 2 0 _._ 989 _±_ 7 _._ 262e _−_ 4 0 _._ 387 _±_ 1 _._ 494e _−_ 2 0 _._ 962 _±_ 9 _._ 855e _−_ 4
No ~~s~~ um ~~I~~ CD ICD +TFM mlp 0 _._ 414 _±_ 2 _._ 747e _−_ 2 1 _._ 024 _±_ 2 _._ 568e _−_ 2 0 _._ 374 _±_ 6 _._ 777e _−_ 3 1 _._ 005 _±_ 2 _._ 132e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM patchtsmixer 0 _._ 605 _±_ 1 _._ 834e _−_ 2 1 _._ 208 _±_ 5 _._ 107e _−_ 2 0 _._ 565 _±_ 2 _._ 557e _−_ 2 1 _._ 13 _±_ 3 _._ 813e _−_ 2
No ~~s~~ um ~~I~~ CD ICD +TFM timemixer 0 _._ 533 _±_ 1 _._ 226e _−_ 2 1 _._ 112 _±_ 1 _._ 019e _−_ 2 0 _._ 508 _±_ 2 _._ 526e _−_ 2 1 _._ 065 _±_ 2 _._ 561e _−_ 2
No ~~s~~ um ~~I~~ CD lstm 0 _._ 886 _±_ 1 _._ 93e _−_ 2 1 _._ 811 _±_ 4 _._ 878e _−_ 2 0 _._ 897 _±_ 5 _._ 587e _−_ 2 1 _._ 733 _±_ 1 _._ 361e _−_ 1
No ~~s~~ um ~~I~~ CD mlp 0 _._ 989 _±_ 2 _._ 553e _−_ 2 2 _._ 024 _±_ 7 _._ 196e _−_ 2 0 _._ 873 _±_ 3 _._ 112e _−_ 2 1 _._ 675 _±_ 6 _._ 143e _−_ 2
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 926 _±_ 3 _._ 175e _−_ 2 1 _._ 804 _±_ 8 _._ 536e _−_ 2 0 _._ 887 _±_ 3 _._ 278e _−_ 2 1 _._ 639 _±_ 6 _._ 911e _−_ 2
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 796 _±_ 8 _._ 071e _−_ 2 1 _._ 562 _±_ 1 _._ 722e _−_ 1 0 _._ 766 _±_ 5 _._ 493e _−_ 2 1 _._ 435 _±_ 1 _._ 114e _−_ 1
No ~~s~~ um ~~T~~ rend Trend +TFM lstm 0 _._ 379 _±_ 1 _._ 126e _−_ 2 0 _._ 978 _±_ 2 _._ 533e _−_ 3 0 _._ 452 _±_ 2 _._ 965e _−_ 2 1 _._ 01 _±_ 3 _._ 527e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM mlp 0 _._ 403 _±_ 2 _._ 194e _−_ 2 1 _._ 012 _±_ 2 _._ 18e _−_ 3 0 _._ 423 _±_ 1 _._ 988e _−_ 2 1 _._ 013 _±_ 4 _._ 05e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM patchtsmixer 0 _._ 594 _±_ 1 _._ 385e _−_ 2 1 _._ 177 _±_ 1 _._ 88e _−_ 3 0 _._ 605 _±_ 1 _._ 428e _−_ 2 1 _._ 179 _±_ 2 _._ 521e _−_ 2
No ~~s~~ um ~~T~~ rend Trend +TFM timemixer 0 _._ 519 _±_ 4 _._ 6e _−_ 3 1 _._ 089 _±_ 1 _._ 016e _−_ 2 0 _._ 522 _±_ 2 _._ 55e _−_ 2 1 _._ 086 _±_ 3 _._ 986e _−_ 2


Table 40: Cross-site transfer results - Los. (part 1/2)


56


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**mae** **mse** **mae** **mse**


No ~~s~~ um ~~T~~ rend lstm 0 _._ 704 _±_ 8 _._ 339e _−_ 2 1 _._ 389 _±_ 1 _._ 546e _−_ 1 0 _._ 742 _±_ 4 _._ 071e _−_ 2 1 _._ 461 _±_ 9 _._ 049e _−_ 2
No ~~s~~ um ~~T~~ rend mlp 0 _._ 754 _±_ 3 _._ 342e _−_ 2 1 _._ 496 _±_ 4 _._ 605e _−_ 2 0 _._ 794 _±_ 3 _._ 188e _−_ 2 1 _._ 568 _±_ 6 _._ 687e _−_ 2
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 853 _±_ 3 _._ 164e _−_ 2 1 _._ 606 _±_ 6 _._ 786e _−_ 2 0 _._ 776 _±_ 6 _._ 463e _−_ 2 1 _._ 468 _±_ 1 _._ 277e _−_ 1
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 802 _±_ 5 _._ 126e _−_ 2 1 _._ 562 _±_ 1 _._ 056e _−_ 1 0 _._ 753 _±_ 3 _._ 791e _−_ 2 1 _._ 451 _±_ 8 _._ 137e _−_ 2
medgemma CoT +TFM lstm 0 _._ 369 _±_ 5 _._ 866e _−_ 3 1 _._ 007 _±_ 5 _._ 832e _−_ 3 0 _._ 352 _±_ 6 _._ 795e _−_ 3 0 _._ 963 _±_ 3 _._ 323e _−_ 3
medgemma CoT +TFM mlp 0 _._ 382 _±_ 3 _._ 831e _−_ 3 1 _._ 042 _±_ 1 _._ 398e _−_ 2 0 _._ 343 _±_ 6 _._ 876e _−_ 3 0 _._ 988 _±_ 1 _._ 181e _−_ 2
medgemma CoT +TFM patchtsmixer 0 _._ 528 _±_ 1 _._ 409e _−_ 3 1 _._ 126 _±_ 3 _._ 894e _−_ 3 0 _._ 48 _±_ 6 _._ 525e _−_ 3 1 _._ 07 _±_ 2 _._ 149e _−_ 2
medgemma CoT +TFM timemixer 0 _._ 428 _±_ 5 _._ 554e _−_ 3 1 _._ 025 _±_ 9 _._ 87e _−_ 3 0 _._ 416 _±_ 1 _._ 092e _−_ 2 1 _±_ 6 _._ 901e _−_ 3
medgemma CoT lstm 1 _._ 116 _±_ 2 _._ 962e _−_ 2 2 _._ 313 _±_ 8 _._ 62e _−_ 2 0 _._ 535 _±_ 9 _._ 297e _−_ 3 1 _._ 181 _±_ 3 _._ 171e _−_ 2
medgemma CoT mlp 1 _._ 063 _±_ 2 _._ 839e _−_ 2 2 _._ 121 _±_ 8 _._ 412e _−_ 2 0 _._ 539 _±_ 2 _._ 816e _−_ 2 1 _._ 153 _±_ 3 _._ 959e _−_ 2
medgemma CoT patchtsmixer 1 _±_ 5 _._ 994e _−_ 2 1 _._ 878 _±_ 1 _._ 566e _−_ 1 0 _._ 554 _±_ 2 _._ 224e _−_ 2 1 _._ 118 _±_ 2 _._ 79e _−_ 2
medgemma CoT timemixer 1 _._ 018 _±_ 8 _._ 012e _−_ 2 1 _._ 97 _±_ 2 _._ 173e _−_ 1 0 _._ 556 _±_ 1 _._ 472e _−_ 2 1 _._ 165 _±_ 1 _._ 833e _−_ 2
medgemma ICD +TFM lstm 0 _._ 367 _±_ 2 _._ 197e _−_ 3 1 _._ 021 _±_ 1 _._ 355e _−_ 2 0 _._ 334 _±_ 8 _._ 282e _−_ 3 0 _._ 972 _±_ 2 _._ 582e _−_ 3
medgemma ICD +TFM mlp 0 _._ 375 _±_ 5 _._ 707e _−_ 3 1 _._ 042 _±_ 6 _._ 535e _−_ 3 0 _._ 345 _±_ 7 _._ 011e _−_ 3 0 _._ 987 _±_ 3 _._ 264e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 547 _±_ 1 _._ 076e _−_ 2 1 _._ 16 _±_ 2 _._ 469e _−_ 2 0 _._ 507 _±_ 6 _._ 239e _−_ 3 1 _._ 093 _±_ 2 _._ 527e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 424 _±_ 4 _._ 215e _−_ 3 1 _._ 065 _±_ 7 _._ 981e _−_ 3 0 _._ 4 _±_ 1 _._ 227e _−_ 3 1 _±_ 6 _._ 85e _−_ 3
medgemma ICD lstm 0 _._ 969 _±_ 3 _._ 308e _−_ 2 1 _._ 936 _±_ 8 _._ 443e _−_ 2 0 _._ 607 _±_ 2 _._ 19e _−_ 2 1 _._ 315 _±_ 3 _._ 69e _−_ 2
medgemma ICD mlp 0 _._ 9 _±_ 2 _._ 985e _−_ 2 1 _._ 773 _±_ 6 _._ 322e _−_ 2 0 _._ 59 _±_ 1 _._ 878e _−_ 2 1 _._ 247 _±_ 3 _._ 427e _−_ 2
medgemma ICD patchtsmixer 0 _._ 904 _±_ 3 _._ 217e _−_ 2 1 _._ 681 _±_ 5 _._ 134e _−_ 2 0 _._ 608 _±_ 3 _._ 347e _−_ 2 1 _._ 213 _±_ 3 _._ 086e _−_ 2
medgemma ICD timemixer 0 _._ 892 _±_ 2 _._ 006e _−_ 2 1 _._ 71 _±_ 4 _._ 965e _−_ 2 0 _._ 585 _±_ 3 _._ 202e _−_ 2 1 _._ 21 _±_ 4 _._ 16e _−_ 2
medgemma Trend +TFM lstm 0 _._ 364 _±_ 5 _._ 091e _−_ 3 0 _._ 993 _±_ 8 _._ 769e _−_ 3 0 _._ 37 _±_ 2 _._ 093e _−_ 2 0 _._ 98 _±_ 1 _._ 068e _−_ 2
medgemma Trend +TFM mlp 0 _._ 385 _±_ 1 _._ 412e _−_ 3 1 _._ 03 _±_ 8 _._ 041e _−_ 3 0 _._ 349 _±_ 2 _._ 607e _−_ 3 0 _._ 99 _±_ 7 _._ 04e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 565 _±_ 2 _._ 129e _−_ 2 1 _._ 149 _±_ 1 _._ 421e _−_ 2 0 _._ 502 _±_ 1 _._ 755e _−_ 3 1 _._ 082 _±_ 3 _._ 905e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 453 _±_ 6 _._ 806e _−_ 3 1 _._ 033 _±_ 6 _._ 152e _−_ 3 0 _._ 424 _±_ 1 _._ 422e _−_ 2 1 _._ 014 _±_ 9 _._ 086e _−_ 3
medgemma Trend lstm 0 _._ 979 _±_ 3 _._ 445e _−_ 2 1 _._ 975 _±_ 1 _._ 007e _−_ 1 0 _._ 628 _±_ 1 _._ 822e _−_ 2 1 _._ 334 _±_ 2 _._ 749e _−_ 2
medgemma Trend mlp 1 _._ 054 _±_ 2 _._ 43e _−_ 2 2 _._ 158 _±_ 8 _._ 046e _−_ 2 0 _._ 646 _±_ 2 _._ 782e _−_ 2 1 _._ 358 _±_ 6 _._ 475e _−_ 2
medgemma Trend patchtsmixer 0 _._ 998 _±_ 3 _._ 545e _−_ 2 1 _._ 899 _±_ 7 _._ 864e _−_ 2 0 _._ 641 _±_ 1 _._ 909e _−_ 2 1 _._ 267 _±_ 4 _._ 206e _−_ 2
medgemma Trend timemixer 0 _._ 974 _±_ 2 _._ 663e _−_ 2 1 _._ 885 _±_ 5 _._ 929e _−_ 2 0 _._ 627 _±_ 2 _._ 08e _−_ 2 1 _._ 271 _±_ 1 _._ 604e _−_ 2
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 351 _±_ 6 _._ 479e _−_ 3 1 _._ 023 _±_ 6 _._ 784e _−_ 3 0 _._ 342 _±_ 4 _._ 256e _−_ 3 0 _._ 968 _±_ 4 _._ 758e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 385 _±_ 8 _._ 864e _−_ 3 1 _._ 077 _±_ 1 _._ 426e _−_ 2 0 _._ 343 _±_ 6 _._ 275e _−_ 4 0 _._ 979 _±_ 1 _._ 358e _−_ 2
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 533 _±_ 8 _._ 593e _−_ 3 1 _._ 131 _±_ 1 _._ 83e _−_ 2 0 _._ 501 _±_ 2 _._ 225e _−_ 2 1 _._ 083 _±_ 2 _._ 194e _−_ 2
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 413 _±_ 6 _._ 214e _−_ 3 1 _._ 045 _±_ 2 _._ 5e _−_ 3 0 _._ 394 _±_ 4 _._ 21e _−_ 3 0 _._ 987 _±_ 4 _._ 679e _−_ 3
medgemma zero ~~s~~ hot lstm 1 _._ 094 _±_ 4 _._ 891e _−_ 2 2 _._ 266 _±_ 1 _._ 103e _−_ 1 0 _._ 51 _±_ 8 _._ 577e _−_ 3 1 _._ 137 _±_ 1 _._ 391e _−_ 2
medgemma zero ~~s~~ hot mlp 1 _._ 075 _±_ 1 _._ 523e _−_ 2 2 _._ 132 _±_ 6 _._ 644e _−_ 2 0 _._ 518 _±_ 2 _._ 548e _−_ 2 1 _._ 125 _±_ 4 _._ 125e _−_ 2
medgemma zero ~~s~~ hot patchtsmixer 1 _._ 003 _±_ 7 _._ 105e _−_ 2 1 _._ 86 _±_ 1 _._ 89e _−_ 1 0 _._ 52 _±_ 1 _._ 337e _−_ 2 1 _._ 087 _±_ 1 _._ 572e _−_ 2
medgemma zero ~~s~~ hot timemixer 0 _._ 956 _±_ 7 _._ 827e _−_ 2 1 _._ 802 _±_ 1 _._ 906e _−_ 1 0 _._ 492 _±_ 6 _._ 012e _−_ 3 1 _._ 088 _±_ 7 _._ 534e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM lstm 0 _._ 408 _±_ 1 _._ 453e _−_ 2 0 _._ 996 _±_ 1 _._ 043e _−_ 2 0 _._ 485 _±_ 3 _._ 59e _−_ 2 1 _._ 06 _±_ 4 _._ 806e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM mlp 0 _._ 409 _±_ 9 _._ 729e _−_ 3 1 _._ 025 _±_ 1 _._ 152e _−_ 2 0 _._ 456 _±_ 3 _._ 514e _−_ 2 1 _._ 054 _±_ 3 _._ 852e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM patchtsmixer 0 _._ 573 _±_ 1 _._ 885e _−_ 2 1 _._ 159 _±_ 2 _._ 325e _−_ 2 0 _._ 576 _±_ 3 _._ 064e _−_ 2 1 _._ 144 _±_ 4 _._ 679e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot zero ~~s~~ hot +TFM timemixer 0 _._ 533 _±_ 1 _._ 621e _−_ 2 1 _._ 118 _±_ 1 _._ 32e _−_ 2 0 _._ 56 _±_ 3 _._ 409e _−_ 2 1 _._ 15 _±_ 5 _._ 566e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 907 _±_ 2 _._ 519e _−_ 2 1 _._ 867 _±_ 5 _._ 855e _−_ 2 0 _._ 973 _±_ 3 _._ 373e _−_ 2 2 _._ 067 _±_ 9 _._ 612e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 978 _±_ 2 _._ 412e _−_ 2 2 _._ 032 _±_ 7 _._ 958e _−_ 2 0 _._ 979 _±_ 2 _._ 353e _−_ 2 2 _._ 071 _±_ 7 _._ 347e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 983 _±_ 5 _._ 443e _−_ 2 1 _._ 898 _±_ 1 _._ 248e _−_ 1 0 _._ 931 _±_ 4 _._ 189e _−_ 2 1 _._ 836 _±_ 9 _._ 39e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 824 _±_ 5 _._ 054e _−_ 2 1 _._ 623 _±_ 1 _._ 238e _−_ 1 0 _._ 873 _±_ 3 _._ 693e _−_ 2 1 _._ 753 _±_ 9 _._ 175e _−_ 2
right lstm 2 _._ 116 _±_ 4 _._ 78e _−_ 2 6 _._ 35 _±_ 2 _._ 965e _−_ 1 0 _._ 692 _±_ 6 _._ 11e _−_ 2 1 _._ 542 _±_ 2 _._ 375e _−_ 1
right mlp 2 _._ 011 _±_ 1 _._ 23e _−_ 1 5 _._ 654 _±_ 7 _._ 344e _−_ 1 1 _._ 09 _±_ 8 _._ 253e _−_ 2 2 _._ 449 _±_ 3 _._ 128e _−_ 1
right patchtsmixer 1 _._ 03 _±_ 6 _._ 371e _−_ 2 1 _._ 643 _±_ 1 _._ 166e _−_ 1 0 _._ 759 _±_ 7 _._ 229e _−_ 2 1 _._ 268 _±_ 5 _._ 882e _−_ 2
right timemixer 0 _._ 963 _±_ 6 _._ 711e _−_ 2 1 _._ 487 _±_ 9 _._ 134e _−_ 2 0 _._ 599 _±_ 3 _._ 729e _−_ 2 1 _._ 03 _±_ 2 _._ 153e _−_ 2


Table 41: Cross-site transfer results - Los. (part 2/2)


57


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc** **auprc** **auroc**


Llama-3.1 CoT +TFM lstm 0 _._ 434 _±_ 4 _._ 047e _−_ 2 0 _._ 888 _±_ 1 _._ 253e _−_ 2 0 _._ 539 _±_ 1 _._ 934e _−_ 2 0 _._ 851 _±_ 8 _._ 073e _−_ 3 0 _._ 573 _±_ 2 _._ 554e _−_ 2 0 _._ 796 _±_ 1 _._ 254e _−_ 2
Llama-3.1 CoT +TFM mlp 0 _._ 443 _±_ 2 _._ 504e _−_ 2 0 _._ 89 _±_ 1 _._ 262e _−_ 2 0 _._ 514 _±_ 2 _._ 709e _−_ 2 0 _._ 847 _±_ 1 _._ 626e _−_ 2 0 _._ 546 _±_ 4 _._ 932e _−_ 2 0 _._ 789 _±_ 3 _._ 076e _−_ 2
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 351 _±_ 4 _._ 992e _−_ 3 0 _._ 847 _±_ 2 _._ 807e _−_ 3 0 _._ 412 _±_ 4 _._ 796e _−_ 3 0 _._ 776 _±_ 4 _._ 092e _−_ 3 0 _._ 247 _±_ 1 _._ 763e _−_ 3 0 _._ 506 _±_ 1 _._ 556e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 343 _±_ 1 _._ 168e _−_ 2 0 _._ 847 _±_ 4 _._ 997e _−_ 3 0 _._ 488 _±_ 4 _._ 005e _−_ 3 0 _._ 834 _±_ 2 _._ 875e _−_ 3 0 _._ 537 _±_ 3 _._ 13e _−_ 2 0 _._ 788 _±_ 1 _._ 751e _−_ 2
Llama-3.1 CoT lstm 0 _._ 341 _±_ 9 _._ 298e _−_ 3 0 _._ 843 _±_ 5 _._ 597e _−_ 3 0 _._ 451 _±_ 5 _._ 876e _−_ 3 0 _._ 815 _±_ 3 _._ 777e _−_ 3 0 _._ 457 _±_ 2 _._ 569e _−_ 2 0 _._ 731 _±_ 1 _._ 79e _−_ 2
Llama-3.1 CoT mlp 0 _._ 346 _±_ 1 _._ 218e _−_ 2 0 _._ 844 _±_ 7 _._ 496e _−_ 3 0 _._ 441 _±_ 7 _._ 156e _−_ 3 0 _._ 81 _±_ 4 _._ 386e _−_ 3 0 _._ 481 _±_ 1 _._ 72e _−_ 2 0 _._ 751 _±_ 1 _._ 171e _−_ 2
Llama-3.1 CoT patchtsmixer 0 _._ 271 _±_ 4 _._ 8e _−_ 2 0 _._ 779 _±_ 4 _._ 136e _−_ 2 0 _._ 27 _±_ 8 _._ 385e _−_ 2 0 _._ 671 _±_ 6 _._ 974e _−_ 2 0 _._ 254 _±_ 1 _._ 391e _−_ 2 0 _._ 519 _±_ 2 _._ 568e _−_ 2
Llama-3.1 CoT timemixer 0 _._ 346 _±_ 8 _._ 836e _−_ 3 0 _._ 838 _±_ 3 _._ 985e _−_ 3 0 _._ 438 _±_ 1 _._ 006e _−_ 2 0 _._ 801 _±_ 6 _._ 004e _−_ 3 0 _._ 427 _±_ 3 _._ 391e _−_ 2 0 _._ 707 _±_ 2 _._ 318e _−_ 2
Llama-3.1 ICD +TFM lstm 0 _._ 413 _±_ 1 _._ 303e _−_ 2 0 _._ 882 _±_ 5 _._ 344e _−_ 3 0 _._ 499 _±_ 2 _._ 606e _−_ 2 0 _._ 829 _±_ 1 _._ 53e _−_ 2 0 _._ 589 _±_ 8 _._ 374e _−_ 3 0 _._ 793 _±_ 2 _._ 423e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 431 _±_ 1 _._ 249e _−_ 2 0 _._ 885 _±_ 5 _._ 047e _−_ 3 0 _._ 494 _±_ 2 _._ 567e _−_ 2 0 _._ 832 _±_ 1 _._ 578e _−_ 2 0 _._ 563 _±_ 2 _._ 534e _−_ 2 0 _._ 795 _±_ 1 _._ 56e _−_ 2
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 367 _±_ 1 _._ 159e _−_ 2 0 _._ 85 _±_ 4 _._ 922e _−_ 3 0 _._ 414 _±_ 1 _._ 644e _−_ 2 0 _._ 764 _±_ 1 _._ 01e _−_ 2 0 _._ 252 _±_ 2 _._ 609e _−_ 3 0 _._ 515 _±_ 3 _._ 33e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 316 _±_ 4 _._ 6e _−_ 2 0 _._ 833 _±_ 3 _._ 057e _−_ 2 0 _._ 467 _±_ 9 _._ 826e _−_ 3 0 _._ 816 _±_ 7 _._ 494e _−_ 3 0 _._ 529 _±_ 1 _._ 666e _−_ 2 0 _._ 772 _±_ 9 _._ 703e _−_ 3
Llama-3.1 ICD lstm 0 _._ 358 _±_ 5 _._ 344e _−_ 3 0 _._ 851 _±_ 3 _._ 623e _−_ 3 0 _._ 426 _±_ 5 _._ 02e _−_ 3 0 _._ 786 _±_ 4 _._ 125e _−_ 3 0 _._ 485 _±_ 1 _._ 091e _−_ 2 0 _._ 735 _±_ 6 _._ 719e _−_ 3
Llama-3.1 ICD mlp 0 _._ 36 _±_ 1 _._ 804e _−_ 2 0 _._ 85 _±_ 9 _._ 91e _−_ 3 0 _._ 405 _±_ 3 _._ 751e _−_ 3 0 _._ 777 _±_ 2 _._ 018e _−_ 3 0 _._ 484 _±_ 1 _._ 949e _−_ 2 0 _._ 74 _±_ 1 _._ 339e _−_ 2
Llama-3.1 ICD patchtsmixer 0 _._ 184 _±_ 1 _._ 02e _−_ 1 0 _._ 668 _±_ 1 _._ 099e _−_ 1 0 _._ 265 _±_ 6 _._ 944e _−_ 2 0 _._ 672 _±_ 4 _._ 457e _−_ 2 0 _._ 276 _±_ 2 _._ 049e _−_ 2 0 _._ 56 _±_ 3 _._ 181e _−_ 2
Llama-3.1 ICD timemixer 0 _._ 373 _±_ 5 _._ 533e _−_ 3 0 _._ 848 _±_ 2 _._ 639e _−_ 3 0 _._ 416 _±_ 8 _._ 855e _−_ 3 0 _._ 777 _±_ 5 _._ 424e _−_ 3 0 _._ 437 _±_ 1 _._ 335e _−_ 2 0 _._ 707 _±_ 7 _._ 682e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 477 _±_ 1 _._ 975e _−_ 2 0 _._ 905 _±_ 5 _._ 623e _−_ 3 0 _._ 516 _±_ 1 _._ 085e _−_ 2 0 _._ 848 _±_ 6 _._ 583e _−_ 3 0 _._ 553 _±_ 1 _._ 918e _−_ 2 0 _._ 782 _±_ 1 _._ 068e _−_ 2
Llama-3.1 Trend +TFM mlp 0 _._ 488 _±_ 1 _._ 448e _−_ 2 0 _._ 907 _±_ 5 _._ 459e _−_ 3 0 _._ 5 _±_ 1 _._ 744e _−_ 3 0 _._ 845 _±_ 3 _._ 669e _−_ 4 0 _._ 55 _±_ 1 _._ 294e _−_ 2 0 _._ 786 _±_ 9 _._ 126e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 397 _±_ 2 _._ 262e _−_ 2 0 _._ 875 _±_ 1 _._ 143e _−_ 2 0 _._ 422 _±_ 7 _._ 062e _−_ 3 0 _._ 786 _±_ 4 _._ 757e _−_ 3 0 _._ 249 _±_ 1 _._ 022e _−_ 3 0 _._ 507 _±_ 3 _._ 733e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 383 _±_ 3 _._ 465e _−_ 2 0 _._ 867 _±_ 1 _._ 702e _−_ 2 0 _._ 451 _±_ 6 _._ 875e _−_ 3 0 _._ 819 _±_ 6 _._ 305e _−_ 3 0 _._ 529 _±_ 1 _._ 622e _−_ 2 0 _._ 776 _±_ 8 _._ 389e _−_ 3
Llama-3.1 Trend lstm 0 _._ 379 _±_ 9 _._ 086e _−_ 3 0 _._ 861 _±_ 5 _._ 678e _−_ 3 0 _._ 432 _±_ 9 _._ 522e _−_ 3 0 _._ 808 _±_ 8 _._ 114e _−_ 3 0 _._ 509 _±_ 1 _._ 237e _−_ 2 0 _._ 755 _±_ 9 _._ 144e _−_ 3
Llama-3.1 Trend mlp 0 _._ 383 _±_ 1 _._ 052e _−_ 2 0 _._ 86 _±_ 5 _._ 351e _−_ 3 0 _._ 437 _±_ 5 _._ 673e _−_ 3 0 _._ 813 _±_ 4 _._ 773e _−_ 3 0 _._ 494 _±_ 1 _._ 749e _−_ 2 0 _._ 748 _±_ 1 _._ 242e _−_ 2
Llama-3.1 Trend patchtsmixer 0 _._ 32 _±_ 6 _._ 834e _−_ 2 0 _._ 817 _±_ 5 _._ 205e _−_ 2 0 _._ 246 _±_ 1 _._ 042e _−_ 2 0 _._ 669 _±_ 1 _._ 561e _−_ 2 0 _._ 256 _±_ 1 _._ 661e _−_ 2 0 _._ 525 _±_ 2 _._ 969e _−_ 2
Llama-3.1 Trend timemixer 0 _._ 414 _±_ 2 _._ 107e _−_ 2 0 _._ 866 _±_ 9 _._ 814e _−_ 3 0 _._ 429 _±_ 1 _._ 088e _−_ 2 0 _._ 8 _±_ 8e _−_ 3 0 _._ 487 _±_ 8 _._ 158e _−_ 3 0 _._ 739 _±_ 5 _._ 146e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 479 _±_ 1 _._ 003e _−_ 2 0 _._ 904 _±_ 2 _._ 183e _−_ 3 0 _._ 57 _±_ 1 _._ 765e _−_ 2 0 _._ 867 _±_ 6 _._ 438e _−_ 3 0 _._ 564 _±_ 1 _._ 818e _−_ 2 0 _._ 787 _±_ 7 _._ 777e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 493 _±_ 7 _._ 385e _−_ 3 0 _._ 907 _±_ 1 _._ 986e _−_ 3 0 _._ 498 _±_ 1 _._ 421e _−_ 2 0 _._ 84 _±_ 8 _._ 639e _−_ 3 0 _._ 54 _±_ 3 _._ 381e _−_ 2 0 _._ 783 _±_ 1 _._ 955e _−_ 2
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 359 _±_ 2 _._ 186e _−_ 2 0 _._ 863 _±_ 1 _._ 464e _−_ 2 0 _._ 428 _±_ 8 _._ 876e _−_ 3 0 _._ 786 _±_ 5 _._ 617e _−_ 3 0 _._ 251 _±_ 2 _._ 901e _−_ 3 0 _._ 511 _±_ 7 _._ 165e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 37 _±_ 5 _._ 431e _−_ 3 0 _._ 867 _±_ 1 _._ 671e _−_ 3 0 _._ 479 _±_ 2 _._ 191e _−_ 2 0 _._ 833 _±_ 1 _._ 254e _−_ 2 0 _._ 48 _±_ 1 _._ 758e _−_ 2 0 _._ 749 _±_ 1 _._ 067e _−_ 2
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 398 _±_ 2 _._ 089e _−_ 2 0 _._ 873 _±_ 9 _._ 164e _−_ 3 0 _._ 437 _±_ 1 _._ 317e _−_ 2 0 _._ 813 _±_ 9 _._ 215e _−_ 3 0 _._ 492 _±_ 2 _._ 239e _−_ 2 0 _._ 746 _±_ 1 _._ 226e _−_ 2
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 407 _±_ 3 _._ 909e _−_ 3 0 _._ 876 _±_ 1 _._ 509e _−_ 3 0 _._ 441 _±_ 6 _._ 955e _−_ 3 0 _._ 816 _±_ 4 _._ 737e _−_ 3 0 _._ 465 _±_ 2 _._ 571e _−_ 2 0 _._ 736 _±_ 1 _._ 543e _−_ 2
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 316 _±_ 8 _._ 626e _−_ 2 0 _._ 823 _±_ 6 _._ 232e _−_ 2 0 _._ 281 _±_ 8 _._ 333e _−_ 2 0 _._ 689 _±_ 6 _._ 299e _−_ 2 0 _._ 262 _±_ 1 _._ 707e _−_ 2 0 _._ 537 _±_ 3 _._ 236e _−_ 2
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 394 _±_ 8 _._ 982e _−_ 3 0 _._ 866 _±_ 1 _._ 953e _−_ 3 0 _._ 434 _±_ 1 _._ 654e _−_ 2 0 _._ 805 _±_ 8 _._ 895e _−_ 3 0 _._ 473 _±_ 1 _._ 179e _−_ 2 0 _._ 736 _±_ 6 _._ 462e _−_ 3
TFM lstm 0 _._ 363 _±_ 8 _._ 238e _−_ 3 0 _._ 856 _±_ 1 _._ 688e _−_ 3 0 _._ 485 _±_ 2 _._ 578e _−_ 3 0 _._ 797 _±_ 2 _._ 742e _−_ 3 0 _._ 402 _±_ 1 _._ 312e _−_ 2 0 _._ 676 _±_ 1 _._ 54e _−_ 2
TFM mlp 0 _._ 361 _±_ 1 _._ 466e _−_ 2 0 _._ 851 _±_ 3 _._ 699e _−_ 3 0 _._ 474 _±_ 6 _._ 051e _−_ 3 0 _._ 792 _±_ 3 _._ 642e _−_ 3 0 _._ 412 _±_ 1 _._ 503e _−_ 2 0 _._ 689 _±_ 1 _._ 612e _−_ 2
TFM patchtsmixer 0 _._ 266 _±_ 8 _._ 085e _−_ 3 0 _._ 793 _±_ 3 _._ 754e _−_ 3 0 _._ 435 _±_ 6 _._ 064e _−_ 3 0 _._ 753 _±_ 3 _._ 762e _−_ 3 0 _._ 279 _±_ 1 _._ 976e _−_ 3 0 _._ 511 _±_ 3 _._ 903e _−_ 3
TFM timemixer 0 _._ 263 _±_ 7 _._ 734e _−_ 3 0 _._ 815 _±_ 3 _._ 212e _−_ 3 0 _._ 417 _±_ 4 _._ 331e _−_ 2 0 _._ 77 _±_ 1 _._ 75e _−_ 2 0 _._ 377 _±_ 1 _._ 22e _−_ 3 0 _._ 664 _±_ 2 _._ 151e _−_ 3
TSDE lstm 0 _._ 539 _±_ 1 _._ 805e _−_ 2 0 _._ 92 _±_ 3 _._ 511e _−_ 3 0 _._ 708 _±_ 2 _._ 806e _−_ 3 0 _._ 913 _±_ 3 _._ 496e _−_ 4 0 _._ 745 _±_ 7 _._ 439e _−_ 3 0 _._ 885 _±_ 4 _._ 187e _−_ 3
TSDE mlp 0 _._ 528 _±_ 1 _._ 921e _−_ 2 0 _._ 921 _±_ 2 _._ 489e _−_ 3 0 _._ 705 _±_ 2 _._ 821e _−_ 3 0 _._ 913 _±_ 1 _._ 258e _−_ 3 0 _._ 751 _±_ 4 _._ 275e _−_ 3 0 _._ 888 _±_ 1 _._ 822e _−_ 3
TSDE patchtsmixer 0 _._ 324 _±_ 1 _._ 226e _−_ 1 0 _._ 806 _±_ 1 _._ 361e _−_ 1 0 _._ 494 _±_ 2 _._ 136e _−_ 1 0 _._ 793 _±_ 1 _._ 772e _−_ 1 0 _._ 583 _±_ 2 _._ 046e _−_ 1 0 _._ 765 _±_ 1 _._ 73e _−_ 1
TSDE timemixer 0 _._ 48 _±_ 2 _._ 2e _−_ 2 0 _._ 909 _±_ 2 _._ 952e _−_ 3 0 _._ 679 _±_ 1 _._ 438e _−_ 2 0 _._ 906 _±_ 4 _._ 163e _−_ 3 0 _._ 741 _±_ 3 _._ 528e _−_ 3 0 _._ 884 _±_ 3 _._ 234e _−_ 3
gemini-2.0-flash CoT +TFM lstm 0 _._ 545 _±_ 1 _._ 623e _−_ 2 0 _._ 92 _±_ 5 _._ 141e _−_ 3 0 _._ 57 _±_ 3 _._ 002e _−_ 3 0 _._ 868 _±_ 1 _._ 086e _−_ 3 0 _._ 667 _±_ 2 _._ 369e _−_ 2 0 _._ 843 _±_ 1 _._ 084e _−_ 2
gemini-2.0-flash CoT +TFM mlp 0 _._ 533 _±_ 1 _._ 684e _−_ 2 0 _._ 913 _±_ 5 _._ 039e _−_ 3 0 _._ 556 _±_ 1 _._ 724e _−_ 2 0 _._ 865 _±_ 8 _._ 301e _−_ 3 0 _._ 629 _±_ 2 _._ 831e _−_ 3 0 _._ 83 _±_ 1 _._ 045e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 464 _±_ 2 _._ 736e _−_ 2 0 _._ 894 _±_ 6 _._ 52e _−_ 3 0 _._ 469 _±_ 2 _._ 338e _−_ 2 0 _._ 811 _±_ 1 _._ 472e _−_ 2 0 _._ 568 _±_ 2 _._ 321e _−_ 2 0 _._ 782 _±_ 9 _._ 886e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 463 _±_ 2 _._ 377e _−_ 2 0 _._ 897 _±_ 7 _._ 053e _−_ 3 0 _._ 506 _±_ 1 _._ 608e _−_ 2 0 _._ 845 _±_ 6 _._ 596e _−_ 3 0 _._ 611 _±_ 1 _._ 684e _−_ 2 0 _._ 827 _±_ 7 _._ 697e _−_ 3
gemini-2.0-flash CoT lstm 0 _._ 488 _±_ 1 _._ 318e _−_ 2 0 _._ 898 _±_ 5 _._ 601e _−_ 3 0 _._ 535 _±_ 1 _._ 128e _−_ 2 0 _._ 849 _±_ 6 _._ 038e _−_ 3 0 _._ 609 _±_ 2 _._ 214e _−_ 2 0 _._ 813 _±_ 1 _._ 378e _−_ 2
gemini-2.0-flash CoT mlp 0 _._ 495 _±_ 5 _._ 355e _−_ 3 0 _._ 9 _±_ 2 _._ 406e _−_ 3 0 _._ 543 _±_ 4 _._ 201e _−_ 3 0 _._ 855 _±_ 2 _._ 708e _−_ 3 0 _._ 599 _±_ 2 _._ 296e _−_ 2 0 _._ 811 _±_ 1 _._ 515e _−_ 2
gemini-2.0-flash CoT patchtsmixer 0 _._ 46 _±_ 7 _._ 063e _−_ 3 0 _._ 886 _±_ 2 _._ 332e _−_ 3 0 _._ 352 _±_ 8 _._ 72e _−_ 2 0 _._ 737 _±_ 5 _._ 631e _−_ 2 0 _._ 358 _±_ 1 _._ 421e _−_ 1 0 _._ 627 _±_ 1 _._ 101e _−_ 1
gemini-2.0-flash CoT timemixer 0 _._ 515 _±_ 1 _._ 074e _−_ 2 0 _._ 897 _±_ 3 _._ 754e _−_ 3 0 _._ 527 _±_ 5 _._ 431e _−_ 3 0 _._ 84 _±_ 3 _._ 986e _−_ 3 0 _._ 583 _±_ 4 _._ 305e _−_ 3 0 _._ 795 _±_ 2 _._ 4e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 542 _±_ 1 _._ 859e _−_ 2 0 _._ 92 _±_ 5 _._ 373e _−_ 3 0 _._ 575 _±_ 3 _._ 127e _−_ 3 0 _._ 869 _±_ 1 _._ 216e _−_ 3 0 _._ 617 _±_ 1 _._ 63e _−_ 2 0 _._ 819 _±_ 8 _._ 116e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 539 _±_ 1 _._ 848e _−_ 2 0 _._ 917 _±_ 5 _._ 173e _−_ 3 0 _._ 558 _±_ 1 _._ 31e _−_ 2 0 _._ 865 _±_ 7 _._ 865e _−_ 3 0 _._ 656 _±_ 1 _._ 286e _−_ 2 0 _._ 849 _±_ 9 _._ 153e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 463 _±_ 4 _._ 079e _−_ 2 0 _._ 893 _±_ 1 _._ 05e _−_ 2 0 _._ 494 _±_ 4 _._ 833e _−_ 3 0 _._ 819 _±_ 5 _._ 417e _−_ 3 0 _._ 446 _±_ 1 _._ 682e _−_ 1 0 _._ 683 _±_ 1 _._ 509e _−_ 1
gemini-2.0-flash ICD +TFM timemixer 0 _._ 414 _±_ 2 _._ 549e _−_ 2 0 _._ 884 _±_ 1 _._ 156e _−_ 2 0 _._ 521 _±_ 1 _._ 206e _−_ 2 0 _._ 849 _±_ 8 _._ 343e _−_ 3 0 _._ 592 _±_ 2 _._ 55e _−_ 2 0 _._ 817 _±_ 1 _._ 571e _−_ 2
gemini-2.0-flash ICD lstm 0 _._ 491 _±_ 9 _._ 256e _−_ 3 0 _._ 903 _±_ 3 _._ 847e _−_ 3 0 _._ 519 _±_ 2 _._ 924e _−_ 3 0 _._ 844 _±_ 1 _._ 835e _−_ 3 0 _._ 601 _±_ 1 _._ 177e _−_ 2 0 _._ 812 _±_ 9 _._ 131e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 488 _±_ 9 _._ 744e _−_ 3 0 _._ 902 _±_ 4 _._ 768e _−_ 3 0 _._ 522 _±_ 6 _._ 623e _−_ 3 0 _._ 847 _±_ 4 _._ 112e _−_ 3 0 _._ 582 _±_ 2 _._ 098e _−_ 2 0 _._ 804 _±_ 1 _._ 415e _−_ 2
gemini-2.0-flash ICD patchtsmixer 0 _._ 372 _±_ 1 _._ 737e _−_ 1 0 _._ 798 _±_ 1 _._ 752e _−_ 1 0 _._ 384 _±_ 1 _._ 383e _−_ 1 0 _._ 749 _±_ 9 _._ 318e _−_ 2 0 _._ 265 _±_ 1 _._ 408e _−_ 2 0 _._ 542 _±_ 2 _._ 714e _−_ 2
gemini-2.0-flash ICD timemixer 0 _._ 507 _±_ 1 _._ 638e _−_ 2 0 _._ 9 _±_ 5 _._ 618e _−_ 3 0 _._ 518 _±_ 1 _._ 333e _−_ 2 0 _._ 839 _±_ 7 _._ 76e _−_ 3 0 _._ 552 _±_ 2 _._ 55e _−_ 2 0 _._ 781 _±_ 1 _._ 502e _−_ 2
gemini-2.0-flash Trend +TFM lstm 0 _._ 506 _±_ 4 _._ 189e _−_ 3 0 _._ 911 _±_ 1 _._ 254e _−_ 3 0 _._ 547 _±_ 1 _._ 392e _−_ 2 0 _._ 86 _±_ 5 _._ 845e _−_ 3 0 _._ 659 _±_ 2 _._ 17e _−_ 2 0 _._ 839 _±_ 7 _._ 601e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 526 _±_ 2 _._ 121e _−_ 2 0 _._ 917 _±_ 7 _._ 035e _−_ 3 0 _._ 541 _±_ 6 _._ 958e _−_ 3 0 _._ 863 _±_ 2 _._ 501e _−_ 3 0 _._ 611 _±_ 1 _._ 525e _−_ 2 0 _._ 827 _±_ 9 _._ 683e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 389 _±_ 3 _._ 568e _−_ 2 0 _._ 866 _±_ 1 _._ 646e _−_ 2 0 _._ 454 _±_ 5 _._ 615e _−_ 3 0 _._ 805 _±_ 6 _._ 018e _−_ 3 0 _._ 448 _±_ 1 _._ 73e _−_ 1 0 _._ 686 _±_ 1 _._ 545e _−_ 1
gemini-2.0-flash Trend +TFM timemixer 0 _._ 428 _±_ 6 _._ 544e _−_ 2 0 _._ 883 _±_ 2 _._ 307e _−_ 2 0 _._ 504 _±_ 1 _._ 568e _−_ 2 0 _._ 848 _±_ 8 _._ 365e _−_ 3 0 _._ 569 _±_ 3 _._ 539e _−_ 2 0 _._ 809 _±_ 1 _._ 971e _−_ 2
gemini-2.0-flash Trend lstm 0 _._ 455 _±_ 2 _._ 345e _−_ 2 0 _._ 891 _±_ 1 _._ 043e _−_ 2 0 _._ 502 _±_ 8 _._ 363e _−_ 3 0 _._ 845 _±_ 3 _._ 571e _−_ 3 0 _._ 557 _±_ 2 _._ 188e _−_ 2 0 _._ 791 _±_ 1 _._ 465e _−_ 2
gemini-2.0-flash Trend mlp 0 _._ 453 _±_ 3 _._ 441e _−_ 2 0 _._ 888 _±_ 1 _._ 365e _−_ 2 0 _._ 496 _±_ 2 _._ 96e _−_ 3 0 _._ 842 _±_ 1 _._ 153e _−_ 3 0 _._ 556 _±_ 2 _._ 65e _−_ 2 0 _._ 793 _±_ 1 _._ 715e _−_ 2
gemini-2.0-flash Trend patchtsmixer 0 _._ 345 _±_ 1 _._ 025e _−_ 1 0 _._ 826 _±_ 7 _._ 356e _−_ 2 0 _._ 304 _±_ 1 _._ 152e _−_ 1 0 _._ 701 _±_ 8 _._ 825e _−_ 2 0 _._ 318 _±_ 1 _._ 327e _−_ 1 0 _._ 581 _±_ 1 _._ 204e _−_ 1
gemini-2.0-flash Trend timemixer 0 _._ 46 _±_ 2 _._ 204e _−_ 2 0 _._ 884 _±_ 8 _._ 693e _−_ 3 0 _._ 499 _±_ 9 _._ 007e _−_ 3 0 _._ 838 _±_ 4 _._ 022e _−_ 3 0 _._ 537 _±_ 7 _._ 438e _−_ 3 0 _._ 775 _±_ 4 _._ 428e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 559 _±_ 1 _._ 48e _−_ 2 0 _._ 92 _±_ 4 _._ 149e _−_ 3 0 _._ 59 _±_ 1 _._ 774e _−_ 2 0 _._ 877 _±_ 8 _._ 688e _−_ 3 0 _._ 671 _±_ 1 _._ 047e _−_ 2 0 _._ 848 _±_ 3 _._ 791e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 588 _±_ 1 _._ 514e _−_ 2 0 _._ 926 _±_ 4 _._ 635e _−_ 3 0 _._ 577 _±_ 2 _._ 385e _−_ 3 0 _._ 875 _±_ 9 _._ 789e _−_ 4 0 _._ 661 _±_ 1 _._ 407e _−_ 2 0 _._ 85 _±_ 9 _._ 313e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 529 _±_ 3 _._ 47e _−_ 2 0 _._ 913 _±_ 7 _._ 443e _−_ 3 0 _._ 481 _±_ 3 _._ 513e _−_ 2 0 _._ 818 _±_ 1 _._ 429e _−_ 2 0 _._ 585 _±_ 3 _._ 289e _−_ 2 0 _._ 801 _±_ 1 _._ 514e _−_ 2
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 482 _±_ 4 _._ 511e _−_ 2 0 _._ 897 _±_ 1 _._ 444e _−_ 2 0 _._ 545 _±_ 1 _._ 157e _−_ 2 0 _._ 859 _±_ 1 _._ 057e _−_ 2 0 _._ 61 _±_ 1 _._ 279e _−_ 2 0 _._ 825 _±_ 6 _._ 485e _−_ 3
gemini-2.0-flash zero shot lstm 0 _._ 52 _±_ 6 _._ 046e _−_ 3 0 _._ 909 _±_ 1 _._ 438e _−_ 3 0 _._ 548 _±_ 5 _._ 271e _−_ 3 0 _._ 858 _±_ 3 _._ 121e _−_ 3 0 _._ 611 _±_ 1 _._ 238e _−_ 2 0 _._ 822 _±_ 6 _._ 855e _−_ 3
gemini-2.0-flash zero shot mlp 0 _._ 514 _±_ 8 _._ 721e _−_ 3 0 _._ 905 _±_ 2 _._ 253e _−_ 3 0 _._ 55 _±_ 6 _._ 146e _−_ 3 0 _._ 862 _±_ 3 _._ 469e _−_ 3 0 _._ 59 _±_ 1 _._ 971e _−_ 2 0 _._ 811 _±_ 1 _._ 093e _−_ 2
gemini-2.0-flash zero shot patchtsmixer 0 _._ 502 _±_ 6 _._ 089e _−_ 3 0 _._ 903 _±_ 3 _._ 096e _−_ 3 0 _._ 367 _±_ 1 _._ 597e _−_ 1 0 _._ 724 _±_ 1 _._ 452e _−_ 1 0 _._ 252 _±_ 6 _._ 236e _−_ 3 0 _._ 518 _±_ 1 _._ 4e _−_ 2
gemini-2.0-flash zero shot timemixer 0 _._ 53 _±_ 7 _._ 372e _−_ 3 0 _._ 904 _±_ 2 _._ 18e _−_ 3 0 _._ 556 _±_ 8 _._ 705e _−_ 3 0 _._ 86 _±_ 5 _._ 361e _−_ 3 0 _._ 588 _±_ 3 _._ 082e _−_ 3 0 _._ 804 _±_ 1 _._ 6e _−_ 3
interp lstm 0 _._ 531 _±_ 8 _._ 932e _−_ 2 0 _._ 891 _±_ 4 _._ 505e _−_ 2 0 _._ 635 _±_ 9 _._ 586e _−_ 3 0 _._ 888 _±_ 5 _._ 944e _−_ 3 0 _._ 704 _±_ 4 _._ 107e _−_ 2 0 _._ 844 _±_ 4 _._ 157e _−_ 2
interp mlp 0 _._ 552 _±_ 9 _._ 912e _−_ 3 0 _._ 909 _±_ 1 _._ 25e _−_ 2 0 _._ 631 _±_ 5 _._ 08e _−_ 3 0 _._ 89 _±_ 2 _._ 156e _−_ 3 0 _._ 715 _±_ 7 _._ 563e _−_ 3 0 _._ 863 _±_ 4 _._ 351e _−_ 3
interp patchtsmixer 0 _._ 09 _±_ 0e0 0 _._ 5 _±_ 0e0 0 _._ 161 _±_ 0e0 0 _._ 5 _±_ 0e0 0 _._ 273 _±_ 0e0 0 _._ 5 _±_ 0e0
interp timemixer 0 _._ 44 _±_ 5 _._ 277e _−_ 2 0 _._ 873 _±_ 1 _._ 352e _−_ 2 0 _._ 536 _±_ 1 _._ 41e _−_ 2 0 _._ 842 _±_ 9 _._ 574e _−_ 3 0 _._ 614 _±_ 7 _._ 715e _−_ 3 0 _._ 804 _±_ 9 _._ 152e _−_ 3
mean lstm 0 _._ 522 _±_ 1 _._ 259e _−_ 1 0 _._ 898 _±_ 4 _._ 499e _−_ 2 0 _._ 59 _±_ 6 _._ 604e _−_ 2 0 _._ 862 _±_ 3 _._ 451e _−_ 2 0 _._ 678 _±_ 1 _._ 46e _−_ 2 0 _._ 843 _±_ 1 _._ 883e _−_ 2
mean mlp 0 _._ 549 _±_ 2 _._ 305e _−_ 2 0 _._ 912 _±_ 5 _._ 273e _−_ 3 0 _._ 583 _±_ 4 _._ 494e _−_ 2 0 _._ 863 _±_ 2 _._ 267e _−_ 2 0 _._ 683 _±_ 6 _._ 58e _−_ 3 0 _._ 852 _±_ 1 _._ 164e _−_ 2
mean patchtsmixer 0 _._ 09 _±_ 7 _._ 05e _−_ 4 0 _._ 5 _±_ 3 _._ 5e _−_ 4 0 _._ 161 _±_ 0e0 0 _._ 5 _±_ 0e0 0 _._ 273 _±_ 0e0 0 _._ 5 _±_ 0e0
mean timemixer 0 _._ 59 _±_ 8 _._ 689e _−_ 3 0 _._ 927 _±_ 2 _._ 573e _−_ 3 0 _._ 62 _±_ 1 _._ 842e _−_ 2 0 _._ 881 _±_ 9 _._ 053e _−_ 3 0 _._ 654 _±_ 1 _._ 856e _−_ 2 0 _._ 827 _±_ 1 _._ 538e _−_ 2
No ~~s~~ um ~~C~~ oT lstm 0 _._ 634 _±_ 8 _._ 476e _−_ 3 0 _._ 93 _±_ 2 _._ 699e _−_ 3 0 _._ 621 _±_ 3 _._ 847e _−_ 3 0 _._ 888 _±_ 1 _._ 819e _−_ 3 0 _._ 681 _±_ 5 _._ 061e _−_ 3 0 _._ 852 _±_ 3 _._ 018e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 603 _±_ 1 _._ 558e _−_ 2 0 _._ 925 _±_ 3 _._ 711e _−_ 3 0 _._ 615 _±_ 6 _._ 819e _−_ 3 0 _._ 888 _±_ 2 _._ 711e _−_ 3 0 _._ 682 _±_ 8 _._ 652e _−_ 3 0 _._ 856 _±_ 5 _._ 444e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 427 _±_ 1 _._ 858e _−_ 1 0 _._ 829 _±_ 1 _._ 538e _−_ 1 0 _._ 405 _±_ 1 _._ 571e _−_ 1 0 _._ 768 _±_ 1 _._ 107e _−_ 1 0 _._ 38 _±_ 1 _._ 891e _−_ 1 0 _._ 638 _±_ 1 _._ 454e _−_ 1
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 595 _±_ 1 _._ 814e _−_ 2 0 _._ 92 _±_ 4 _._ 36e _−_ 3 0 _._ 593 _±_ 4 _._ 734e _−_ 3 0 _._ 876 _±_ 2 _._ 179e _−_ 3 0 _._ 653 _±_ 6 _._ 419e _−_ 3 0 _._ 833 _±_ 4 _._ 429e _−_ 3
No ~~s~~ um ~~I~~ CD lstm 0 _._ 601 _±_ 1 _._ 16e _−_ 2 0 _._ 924 _±_ 2 _._ 787e _−_ 3 0 _._ 611 _±_ 3 _._ 797e _−_ 3 0 _._ 885 _±_ 2 _._ 014e _−_ 3 0 _._ 664 _±_ 5 _._ 689e _−_ 3 0 _._ 843 _±_ 3 _._ 831e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 587 _±_ 8 _._ 258e _−_ 3 0 _._ 922 _±_ 1 _._ 93e _−_ 3 0 _._ 592 _±_ 1 _._ 31e _−_ 2 0 _._ 88 _±_ 5 _._ 193e _−_ 3 0 _._ 665 _±_ 1 _._ 535e _−_ 2 0 _._ 847 _±_ 9 _._ 774e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 44 _±_ 1 _._ 527e _−_ 1 0 _._ 868 _±_ 7 _._ 703e _−_ 2 0 _._ 365 _±_ 1 _._ 131e _−_ 1 0 _._ 751 _±_ 6 _._ 852e _−_ 2 0 _._ 28 _±_ 2 _._ 339e _−_ 2 0 _._ 562 _±_ 2 _._ 774e _−_ 2
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 58 _±_ 4 _._ 962e _−_ 3 0 _._ 918 _±_ 1 _._ 255e _−_ 3 0 _._ 588 _±_ 7 _._ 78e _−_ 3 0 _._ 873 _±_ 3 _._ 758e _−_ 3 0 _._ 651 _±_ 1 _._ 578e _−_ 2 0 _._ 834 _±_ 9 _._ 552e _−_ 3
No ~~s~~ um ~~T~~ rend lstm 0 _._ 629 _±_ 4 _._ 602e _−_ 3 0 _._ 928 _±_ 1 _._ 935e _−_ 3 0 _._ 614 _±_ 5 _._ 217e _−_ 3 0 _._ 887 _±_ 2 _._ 218e _−_ 3 0 _._ 687 _±_ 9 _._ 539e _−_ 3 0 _._ 856 _±_ 5 _._ 409e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 598 _±_ 7 _._ 807e _−_ 3 0 _._ 924 _±_ 1 _._ 88e _−_ 3 0 _._ 613 _±_ 1 _._ 319e _−_ 2 0 _._ 889 _±_ 5 _._ 065e _−_ 3 0 _._ 679 _±_ 1 _._ 49e _−_ 2 0 _._ 853 _±_ 8 _._ 805e _−_ 3
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 467 _±_ 1 _._ 18e _−_ 1 0 _._ 883 _±_ 4 _._ 873e _−_ 2 0 _._ 359 _±_ 1 _._ 188e _−_ 1 0 _._ 746 _±_ 7 _._ 483e _−_ 2 0 _._ 258 _±_ 1 _._ 191e _−_ 2 0 _._ 532 _±_ 2 _._ 675e _−_ 2
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 602 _±_ 8 _._ 593e _−_ 3 0 _._ 921 _±_ 2 _._ 787e _−_ 3 0 _._ 605 _±_ 1 _._ 238e _−_ 2 0 _._ 882 _±_ 5 _._ 221e _−_ 3 0 _._ 642 _±_ 2 _._ 953e _−_ 3 0 _._ 827 _±_ 1 _._ 822e _−_ 3
medgemma CoT +TFM lstm 0 _._ 592 _±_ 1 _._ 745e _−_ 2 0 _._ 927 _±_ 4 _._ 496e _−_ 3 0 _._ 624 _±_ 1 _._ 678e _−_ 2 0 _._ 89 _±_ 6 _._ 438e _−_ 3 0 _._ 68 _±_ 2 _._ 922e _−_ 2 0 _._ 853 _±_ 1 _._ 525e _−_ 2
medgemma CoT +TFM mlp 0 _._ 6 _±_ 3 _._ 052e _−_ 2 0 _._ 929 _±_ 9 _._ 352e _−_ 3 0 _._ 593 _±_ 1 _._ 427e _−_ 3 0 _._ 882 _±_ 1 _._ 475e _−_ 3 0 _._ 638 _±_ 1 _._ 244e _−_ 2 0 _._ 839 _±_ 7 _._ 595e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 485 _±_ 2 _._ 384e _−_ 2 0 _._ 903 _±_ 7 _._ 847e _−_ 3 0 _._ 503 _±_ 8 _._ 196e _−_ 3 0 _._ 833 _±_ 5 _._ 26e _−_ 3 0 _._ 562 _±_ 3 _._ 098e _−_ 2 0 _._ 786 _±_ 1 _._ 93e _−_ 2
medgemma CoT +TFM timemixer 0 _._ 523 _±_ 1 _._ 243e _−_ 2 0 _._ 91 _±_ 2 _._ 409e _−_ 3 0 _._ 568 _±_ 1 _._ 704e _−_ 2 0 _._ 874 _±_ 8 _._ 405e _−_ 3 0 _._ 615 _±_ 2 _._ 055e _−_ 2 0 _._ 832 _±_ 1 _._ 059e _−_ 2
medgemma CoT lstm 0 _._ 556 _±_ 9 _._ 648e _−_ 3 0 _._ 917 _±_ 3 _._ 49e _−_ 3 0 _._ 577 _±_ 8 _._ 543e _−_ 3 0 _._ 874 _±_ 3 _._ 529e _−_ 3 0 _._ 604 _±_ 1 _._ 558e _−_ 2 0 _._ 818 _±_ 1 _._ 096e _−_ 2
medgemma CoT mlp 0 _._ 542 _±_ 2 _._ 072e _−_ 2 0 _._ 912 _±_ 6 _._ 416e _−_ 3 0 _._ 583 _±_ 1 _._ 125e _−_ 2 0 _._ 879 _±_ 5 _._ 863e _−_ 3 0 _._ 589 _±_ 6 _._ 352e _−_ 3 0 _._ 81 _±_ 4 _._ 491e _−_ 3
medgemma CoT patchtsmixer 0 _._ 407 _±_ 1 _._ 298e _−_ 1 0 _._ 854 _±_ 7 _._ 869e _−_ 2 0 _._ 357 _±_ 9 _._ 654e _−_ 2 0 _._ 742 _±_ 6 _._ 527e _−_ 2 0 _._ 304 _±_ 1 _._ 14e _−_ 2 0 _._ 591 _±_ 1 _._ 576e _−_ 2
medgemma CoT timemixer 0 _._ 543 _±_ 1 _._ 328e _−_ 2 0 _._ 906 _±_ 3 _._ 944e _−_ 3 0 _._ 57 _±_ 1 _._ 39e _−_ 2 0 _._ 866 _±_ 6 _._ 891e _−_ 3 0 _._ 568 _±_ 1 _._ 264e _−_ 2 0 _._ 789 _±_ 7 _._ 697e _−_ 3


Table 42: In-distribution results - Mort. (part 1/2)


58


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **hirid** **mimic** _→_ **mimic** **ppicu** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc** **auprc** **auroc**


medgemma ICD +TFM lstm 0 _._ 582 _±_ 6 _._ 357e _−_ 3 0 _._ 927 _±_ 2 _._ 878e _−_ 3 0 _._ 572 _±_ 1 _._ 236e _−_ 2 0 _._ 87 _±_ 5 _._ 52e _−_ 3 0 _._ 66 _±_ 2 _._ 533e _−_ 2 0 _._ 844 _±_ 1 _._ 297e _−_ 2
medgemma ICD +TFM mlp 0 _._ 582 _±_ 2 _._ 505e _−_ 2 0 _._ 929 _±_ 8 _._ 287e _−_ 3 0 _._ 571 _±_ 4 _._ 68e _−_ 3 0 _._ 874 _±_ 4 _._ 162e _−_ 4 0 _._ 634 _±_ 1 _._ 234e _−_ 2 0 _._ 837 _±_ 7 _._ 092e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 467 _±_ 5 _._ 098e _−_ 3 0 _._ 899 _±_ 2 _._ 98e _−_ 3 0 _._ 489 _±_ 2 _._ 237e _−_ 2 0 _._ 821 _±_ 1 _._ 109e _−_ 2 0 _._ 582 _±_ 1 _._ 334e _−_ 2 0 _._ 786 _±_ 8 _._ 672e _−_ 3
medgemma ICD +TFM timemixer 0 _._ 453 _±_ 6 _._ 038e _−_ 2 0 _._ 894 _±_ 1 _._ 792e _−_ 2 0 _._ 526 _±_ 1 _._ 474e _−_ 2 0 _._ 853 _±_ 7 _._ 344e _−_ 3 0 _._ 609 _±_ 1 _._ 786e _−_ 2 0 _._ 827 _±_ 1 _._ 059e _−_ 2
medgemma ICD lstm 0 _._ 506 _±_ 2 _._ 012e _−_ 2 0 _._ 906 _±_ 7 _._ 309e _−_ 3 0 _._ 547 _±_ 1 _._ 449e _−_ 2 0 _._ 858 _±_ 7 _._ 275e _−_ 3 0 _._ 594 _±_ 8 _._ 807e _−_ 3 0 _._ 81 _±_ 5 _._ 606e _−_ 3
medgemma ICD mlp 0 _._ 492 _±_ 1 _._ 938e _−_ 2 0 _._ 901 _±_ 7 _._ 272e _−_ 3 0 _._ 538 _±_ 5 _._ 229e _−_ 3 0 _._ 858 _±_ 2 _._ 935e _−_ 3 0 _._ 586 _±_ 1 _._ 356e _−_ 2 0 _._ 807 _±_ 9 _._ 684e _−_ 3
medgemma ICD patchtsmixer 0 _._ 381 _±_ 1 _._ 088e _−_ 1 0 _._ 85 _±_ 6 _._ 58e _−_ 2 0 _._ 385 _±_ 1 _._ 089e _−_ 1 0 _._ 764 _±_ 6 _._ 721e _−_ 2 0 _._ 28 _±_ 1 _._ 13e _−_ 2 0 _._ 564 _±_ 1 _._ 614e _−_ 2
medgemma ICD timemixer 0 _._ 504 _±_ 1 _._ 269e _−_ 2 0 _._ 899 _±_ 4 _._ 643e _−_ 3 0 _._ 53 _±_ 1 _._ 274e _−_ 2 0 _._ 847 _±_ 6 _._ 164e _−_ 3 0 _._ 574 _±_ 5 _._ 149e _−_ 3 0 _._ 794 _±_ 2 _._ 91e _−_ 3
medgemma Trend +TFM lstm 0 _._ 524 _±_ 3 _._ 32e _−_ 2 0 _._ 911 _±_ 1 _._ 015e _−_ 2 0 _._ 549 _±_ 1 _._ 372e _−_ 2 0 _._ 864 _±_ 5 _._ 829e _−_ 3 0 _._ 643 _±_ 3 _._ 179e _−_ 2 0 _._ 827 _±_ 1 _._ 416e _−_ 2
medgemma Trend +TFM mlp 0 _._ 573 _±_ 1 _._ 708e _−_ 2 0 _._ 928 _±_ 6 _._ 287e _−_ 3 0 _._ 532 _±_ 1 _._ 378e _−_ 2 0 _._ 86 _±_ 7 _._ 304e _−_ 3 0 _._ 595 _±_ 1 _._ 673e _−_ 2 0 _._ 813 _±_ 9 _._ 188e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 371 _±_ 5 _._ 494e _−_ 3 0 _._ 863 _±_ 3 _._ 222e _−_ 3 0 _._ 456 _±_ 2 _._ 658e _−_ 2 0 _._ 818 _±_ 1 _._ 328e _−_ 2 0 _._ 25 _±_ 5 _._ 324e _−_ 3 0 _._ 509 _±_ 4 _._ 151e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 396 _±_ 3 _._ 892e _−_ 2 0 _._ 87 _±_ 1 _._ 642e _−_ 2 0 _._ 499 _±_ 1 _._ 572e _−_ 2 0 _._ 85 _±_ 7 _._ 941e _−_ 3 0 _._ 56 _±_ 2 _._ 041e _−_ 2 0 _._ 796 _±_ 1 _._ 352e _−_ 2
medgemma Trend lstm 0 _._ 44 _±_ 2 _._ 584e _−_ 2 0 _._ 884 _±_ 8 _._ 082e _−_ 3 0 _._ 501 _±_ 6 _._ 582e _−_ 3 0 _._ 846 _±_ 3 _._ 181e _−_ 3 0 _._ 565 _±_ 1 _._ 96e _−_ 2 0 _._ 788 _±_ 1 _._ 193e _−_ 2
medgemma Trend mlp 0 _._ 454 _±_ 2 _._ 115e _−_ 2 0 _._ 886 _±_ 6 _._ 986e _−_ 3 0 _._ 492 _±_ 1 _._ 114e _−_ 2 0 _._ 843 _±_ 5 _._ 195e _−_ 3 0 _._ 522 _±_ 2 _._ 362e _−_ 2 0 _._ 767 _±_ 1 _._ 326e _−_ 2
medgemma Trend patchtsmixer 0 _._ 365 _±_ 4 _._ 961e _−_ 3 0 _._ 858 _±_ 3 _._ 198e _−_ 3 0 _._ 369 _±_ 8 _._ 7e _−_ 2 0 _._ 769 _±_ 6 _._ 259e _−_ 2 0 _._ 334 _±_ 1 _._ 194e _−_ 1 0 _._ 608 _±_ 1 _._ 03e _−_ 1
medgemma Trend timemixer 0 _._ 441 _±_ 1 _._ 48e _−_ 2 0 _._ 875 _±_ 4 _._ 638e _−_ 3 0 _._ 495 _±_ 3 _._ 069e _−_ 3 0 _._ 843 _±_ 2 _._ 361e _−_ 3 0 _._ 522 _±_ 8 _._ 734e _−_ 3 0 _._ 762 _±_ 6 _._ 247e _−_ 3
medgemma zero ~~s~~ hot +TFM lstm 0 _._ 579 _±_ 2 _._ 183e _−_ 2 0 _._ 924 _±_ 5 _._ 858e _−_ 3 0 _._ 602 _±_ 1 _._ 126e _−_ 2 0 _._ 884 _±_ 5 _._ 661e _−_ 3 0 _._ 644 _±_ 1 _._ 1e _−_ 2 0 _._ 836 _±_ 4 _._ 788e _−_ 3
medgemma zero ~~s~~ hot +TFM mlp 0 _._ 57 _±_ 1 _._ 762e _−_ 2 0 _._ 921 _±_ 5 _._ 704e _−_ 3 0 _._ 579 _±_ 2 _._ 067e _−_ 2 0 _._ 876 _±_ 1 _._ 088e _−_ 2 0 _._ 65 _±_ 2 _._ 438e _−_ 2 0 _._ 846 _±_ 1 _._ 564e _−_ 2
medgemma zero ~~s~~ hot +TFM patchtsmixer 0 _._ 418 _±_ 6 _._ 342e _−_ 2 0 _._ 881 _±_ 2 _._ 308e _−_ 2 0 _._ 478 _±_ 2 _._ 752e _−_ 2 0 _._ 818 _±_ 1 _._ 679e _−_ 2 0 _._ 572 _±_ 1 _._ 182e _−_ 2 0 _._ 79 _±_ 7 _._ 234e _−_ 3
medgemma zero ~~s~~ hot +TFM timemixer 0 _._ 459 _±_ 4 _._ 196e _−_ 2 0 _._ 892 _±_ 1 _._ 27e _−_ 2 0 _._ 553 _±_ 1 _._ 822e _−_ 2 0 _._ 868 _±_ 1 _._ 061e _−_ 2 0 _._ 614 _±_ 1 _._ 171e _−_ 2 0 _._ 829 _±_ 4 _._ 433e _−_ 3
medgemma zero ~~s~~ hot lstm 0 _._ 546 _±_ 6 _._ 857e _−_ 3 0 _._ 913 _±_ 2 _._ 359e _−_ 3 0 _._ 551 _±_ 9 _._ 915e _−_ 3 0 _._ 863 _±_ 4 _._ 472e _−_ 3 0 _._ 606 _±_ 1 _._ 032e _−_ 2 0 _._ 818 _±_ 6 _._ 156e _−_ 3
medgemma zero ~~s~~ hot mlp 0 _._ 545 _±_ 8 _._ 764e _−_ 3 0 _._ 913 _±_ 3 _._ 428e _−_ 3 0 _._ 559 _±_ 6 _._ 325e _−_ 3 0 _._ 868 _±_ 2 _._ 58e _−_ 3 0 _._ 598 _±_ 1 _._ 61e _−_ 2 0 _._ 815 _±_ 1 _._ 05e _−_ 2
medgemma zero ~~s~~ hot patchtsmixer 0 _._ 462 _±_ 7 _._ 816e _−_ 3 0 _._ 887 _±_ 4 _._ 008e _−_ 3 0 _._ 463 _±_ 8 _._ 225e _−_ 2 0 _._ 814 _±_ 5 _._ 34e _−_ 2 0 _._ 3 _±_ 1 _._ 767e _−_ 2 0 _._ 592 _±_ 1 _._ 908e _−_ 2
medgemma zero ~~s~~ hot timemixer 0 _._ 543 _±_ 6 _._ 09e _−_ 3 0 _._ 908 _±_ 2 _._ 577e _−_ 3 0 _._ 562 _±_ 1 _._ 155e _−_ 2 0 _._ 862 _±_ 6 _._ 347e _−_ 3 0 _._ 585 _±_ 5 _._ 476e _−_ 3 0 _._ 801 _±_ 3 _._ 374e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 615 _±_ 2 _._ 522e _−_ 2 0 _._ 925 _±_ 6 _._ 661e _−_ 3 0 _._ 606 _±_ 6 _._ 168e _−_ 3 0 _._ 883 _±_ 2 _._ 376e _−_ 3 0 _._ 686 _±_ 9 _._ 426e _−_ 3 0 _._ 855 _±_ 5 _._ 876e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 603 _±_ 9 _._ 87e _−_ 3 0 _._ 924 _±_ 2 _._ 557e _−_ 3 0 _._ 616 _±_ 1 _._ 695e _−_ 2 0 _._ 89 _±_ 6 _._ 911e _−_ 3 0 _._ 669 _±_ 2 _._ 192e _−_ 2 0 _._ 847 _±_ 1 _._ 442e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 468 _±_ 1 _._ 222e _−_ 1 0 _._ 882 _±_ 5 _._ 065e _−_ 2 0 _._ 479 _±_ 1 _._ 207e _−_ 1 0 _._ 823 _±_ 7 _._ 118e _−_ 2 0 _._ 267 _±_ 3 _._ 135e _−_ 2 0 _._ 54 _±_ 4 _._ 644e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 587 _±_ 1 _._ 445e _−_ 2 0 _._ 917 _±_ 4 _._ 193e _−_ 3 0 _._ 579 _±_ 2 _._ 141e _−_ 2 0 _._ 871 _±_ 9 _._ 394e _−_ 3 0 _._ 647 _±_ 1 _._ 746e _−_ 2 0 _._ 83 _±_ 1 _._ 127e _−_ 2
right lstm 0 _._ 572 _±_ 1 _._ 18e _−_ 1 0 _._ 898 _±_ 6 _._ 297e _−_ 2 0 _._ 675 _±_ 1 _._ 337e _−_ 2 0 _._ 901 _±_ 4 _._ 097e _−_ 3 0 _._ 726 _±_ 2 _._ 893e _−_ 2 0 _._ 863 _±_ 2 _._ 959e _−_ 2
right mlp 0 _._ 625 _±_ 2 _._ 227e _−_ 2 0 _._ 918 _±_ 6 _._ 474e _−_ 3 0 _._ 665 _±_ 9 _._ 48e _−_ 3 0 _._ 896 _±_ 4 _._ 352e _−_ 3 0 _._ 742 _±_ 7 _._ 615e _−_ 3 0 _._ 874 _±_ 7 _._ 008e _−_ 3
right patchtsmixer 0 _._ 09 _±_ 0e0 0 _._ 5 _±_ 1 _._ 15e _−_ 4 0 _._ 161 _±_ 0e0 0 _._ 5 _±_ 0e0 0 _._ 273 _±_ 0e0 0 _._ 5 _±_ 0e0
right timemixer 0 _._ 54 _±_ 2 _._ 507e _−_ 2 0 _._ 907 _±_ 1 _._ 645e _−_ 2 0 _._ 589 _±_ 1 _._ 16e _−_ 2 0 _._ 867 _±_ 3 _._ 511e _−_ 3 0 _._ 648 _±_ 5 _._ 734e _−_ 3 0 _._ 821 _±_ 2 _._ 964e _−_ 3


Table 43: In-distribution results - Mort. (part 2/2)


59


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc**


Llama-3.1 CoT +TFM lstm 0 _._ 365 _±_ 5 _._ 073e _−_ 3 0 _._ 656 _±_ 2 _._ 368e _−_ 3 0 _._ 392 _±_ 2 _._ 422e _−_ 3 0 _._ 681 _±_ 9 _._ 8e _−_ 4
Llama-3.1 CoT +TFM mlp 0 _._ 373 _±_ 8 _._ 213e _−_ 4 0 _._ 664 _±_ 1 _._ 107e _−_ 3 0 _._ 383 _±_ 7 _._ 763e _−_ 3 0 _._ 67 _±_ 6 _._ 792e _−_ 3
Llama-3.1 CoT +TFM patchtsmixer 0 _._ 342 _±_ 2 _._ 198e _−_ 3 0 _._ 625 _±_ 1 _._ 408e _−_ 3 0 _._ 361 _±_ 4 _._ 654e _−_ 3 0 _._ 633 _±_ 5 _._ 435e _−_ 3
Llama-3.1 CoT +TFM timemixer 0 _._ 369 _±_ 4 _._ 226e _−_ 3 0 _._ 662 _±_ 3 _._ 855e _−_ 3 0 _._ 376 _±_ 2 _._ 861e _−_ 3 0 _._ 665 _±_ 2 _._ 893e _−_ 3
Llama-3.1 CoT lstm 0 _._ 362 _±_ 3 _._ 588e _−_ 3 0 _._ 653 _±_ 1 _._ 988e _−_ 3 0 _._ 365 _±_ 1 _._ 458e _−_ 3 0 _._ 652 _±_ 1 _._ 682e _−_ 3
Llama-3.1 CoT mlp 0 _._ 361 _±_ 4 _._ 063e _−_ 3 0 _._ 65 _±_ 4 _._ 195e _−_ 3 0 _._ 365 _±_ 2 _._ 772e _−_ 3 0 _._ 652 _±_ 2 _._ 356e _−_ 3
Llama-3.1 CoT patchtsmixer 0 _._ 32 _±_ 3 _._ 425e _−_ 2 0 _._ 602 _±_ 4 _._ 628e _−_ 2 0 _._ 314 _±_ 3 _._ 019e _−_ 2 0 _._ 6 _±_ 3 _._ 221e _−_ 2
Llama-3.1 CoT timemixer 0 _._ 357 _±_ 1 _._ 49e _−_ 3 0 _._ 647 _±_ 1 _._ 388e _−_ 3 0 _._ 357 _±_ 1 _._ 373e _−_ 3 0 _._ 647 _±_ 1 _._ 679e _−_ 3
Llama-3.1 ICD +TFM lstm 0 _._ 36 _±_ 1 _._ 051e _−_ 3 0 _._ 656 _±_ 1 _._ 813e _−_ 3 0 _._ 389 _±_ 4 _._ 147e _−_ 3 0 _._ 674 _±_ 4 _._ 169e _−_ 3
Llama-3.1 ICD +TFM mlp 0 _._ 367 _±_ 3 _._ 983e _−_ 3 0 _._ 661 _±_ 3 _._ 915e _−_ 3 0 _._ 393 _±_ 3 _._ 627e _−_ 3 0 _._ 676 _±_ 3 _._ 508e _−_ 3
Llama-3.1 ICD +TFM patchtsmixer 0 _._ 347 _±_ 9 _._ 868e _−_ 4 0 _._ 632 _±_ 2 _._ 735e _−_ 3 0 _._ 361 _±_ 2 _._ 17e _−_ 3 0 _._ 637 _±_ 2 _._ 782e _−_ 3
Llama-3.1 ICD +TFM timemixer 0 _._ 368 _±_ 2 _._ 004e _−_ 3 0 _._ 664 _±_ 6 _._ 352e _−_ 3 0 _._ 388 _±_ 1 _._ 479e _−_ 3 0 _._ 675 _±_ 1 _._ 013e _−_ 3
Llama-3.1 ICD lstm 0 _._ 359 _±_ 1 _._ 49e _−_ 3 0 _._ 657 _±_ 9 _._ 47e _−_ 4 0 _._ 385 _±_ 4 _._ 528e _−_ 3 0 _._ 674 _±_ 2 _._ 962e _−_ 3
Llama-3.1 ICD mlp 0 _._ 361 _±_ 2 _._ 11e _−_ 3 0 _._ 657 _±_ 7 _._ 309e _−_ 4 0 _._ 386 _±_ 1 _._ 053e _−_ 3 0 _._ 674 _±_ 4 _._ 826e _−_ 4
Llama-3.1 ICD patchtsmixer 0 _._ 291 _±_ 4 _._ 389e _−_ 2 0 _._ 578 _±_ 5 _._ 288e _−_ 2 0 _._ 31 _±_ 3 _._ 568e _−_ 2 0 _._ 604 _±_ 3 _._ 397e _−_ 2
Llama-3.1 ICD timemixer 0 _._ 362 _±_ 1 _._ 846e _−_ 3 0 _._ 658 _±_ 1 _._ 467e _−_ 4 0 _._ 388 _±_ 3 _._ 129e _−_ 3 0 _._ 672 _±_ 1 _._ 952e _−_ 3
Llama-3.1 Trend +TFM lstm 0 _._ 355 _±_ 3 _._ 702e _−_ 3 0 _._ 655 _±_ 3 _._ 368e _−_ 3 0 _._ 388 _±_ 7 _._ 469e _−_ 3 0 _._ 677 _±_ 5 _._ 3e _−_ 3
Llama-3.1 Trend +TFM mlp 0 _._ 36 _±_ 4 _._ 772e _−_ 3 0 _._ 66 _±_ 3 _._ 541e _−_ 3 0 _._ 391 _±_ 9 _._ 703e _−_ 3 0 _._ 677 _±_ 4 _._ 798e _−_ 3
Llama-3.1 Trend +TFM patchtsmixer 0 _._ 341 _±_ 5 _._ 777e _−_ 3 0 _._ 624 _±_ 4 _._ 799e _−_ 3 0 _._ 375 _±_ 2 _._ 775e _−_ 3 0 _._ 652 _±_ 3 _._ 665e _−_ 3
Llama-3.1 Trend +TFM timemixer 0 _._ 364 _±_ 4 _._ 571e _−_ 3 0 _._ 663 _±_ 1 _._ 511e _−_ 3 0 _._ 385 _±_ 3 _._ 674e _−_ 3 0 _._ 672 _±_ 4 _._ 213e _−_ 3
Llama-3.1 Trend lstm 0 _._ 366 _±_ 2 _._ 342e _−_ 3 0 _._ 663 _±_ 4 _._ 979e _−_ 4 0 _._ 385 _±_ 7 _._ 211e _−_ 3 0 _._ 669 _±_ 3 _._ 003e _−_ 3
Llama-3.1 Trend mlp 0 _._ 369 _±_ 1 _._ 656e _−_ 3 0 _._ 667 _±_ 2 _._ 262e _−_ 4 0 _._ 384 _±_ 2 _._ 798e _−_ 3 0 _._ 669 _±_ 1 _._ 983e _−_ 3
Llama-3.1 Trend patchtsmixer 0 _._ 344 _±_ 3 _._ 142e _−_ 2 0 _._ 642 _±_ 4 _._ 051e _−_ 2 0 _._ 282 _±_ 7 _._ 166e _−_ 3 0 _._ 565 _±_ 1 _._ 115e _−_ 2
Llama-3.1 Trend timemixer 0 _._ 364 _±_ 6 _._ 515e _−_ 4 0 _._ 662 _±_ 9 _._ 032e _−_ 4 0 _._ 385 _±_ 3 _._ 325e _−_ 3 0 _._ 665 _±_ 1 _._ 772e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM lstm 0 _._ 346 _±_ 2 _._ 309e _−_ 3 0 _._ 65 _±_ 8 _._ 195e _−_ 4 0 _._ 398 _±_ 3 _._ 998e _−_ 3 0 _._ 674 _±_ 1 _._ 957e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM mlp 0 _._ 348 _±_ 4 _._ 011e _−_ 3 0 _._ 653 _±_ 8 _._ 969e _−_ 4 0 _._ 403 _±_ 2 _._ 312e _−_ 3 0 _._ 688 _±_ 2 _._ 442e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM patchtsmixer 0 _._ 333 _±_ 1 _._ 884e _−_ 3 0 _._ 612 _±_ 5 _._ 934e _−_ 3 0 _._ 381 _±_ 2 _._ 406e _−_ 3 0 _._ 652 _±_ 2 _._ 807e _−_ 3
Llama-3.1 zero ~~s~~ hot +TFM timemixer 0 _._ 361 _±_ 1 _._ 536e _−_ 3 0 _._ 665 _±_ 1 _._ 248e _−_ 3 0 _._ 397 _±_ 1 _._ 288e _−_ 3 0 _._ 683 _±_ 5 _._ 83e _−_ 3
Llama-3.1 zero ~~s~~ hot lstm 0 _._ 362 _±_ 2 _._ 002e _−_ 3 0 _._ 654 _±_ 5 _._ 816e _−_ 4 0 _._ 39 _±_ 9 _._ 319e _−_ 4 0 _._ 671 _±_ 1 _._ 87e _−_ 3
Llama-3.1 zero ~~s~~ hot mlp 0 _._ 362 _±_ 1 _._ 834e _−_ 3 0 _._ 654 _±_ 1 _._ 988e _−_ 3 0 _._ 39 _±_ 2 _._ 984e _−_ 3 0 _._ 672 _±_ 1 _._ 651e _−_ 3
Llama-3.1 zero ~~s~~ hot patchtsmixer 0 _._ 336 _±_ 3 _._ 817e _−_ 2 0 _._ 632 _±_ 4 _._ 132e _−_ 2 0 _._ 321 _±_ 4 _._ 617e _−_ 2 0 _._ 614 _±_ 4 _._ 224e _−_ 2
Llama-3.1 zero ~~s~~ hot timemixer 0 _._ 361 _±_ 2 _._ 158e _−_ 3 0 _._ 657 _±_ 1 _._ 538e _−_ 3 0 _._ 389 _±_ 2 _._ 366e _−_ 3 0 _._ 673 _±_ 2 _._ 809e _−_ 3
TFM lstm 0 _._ 408 _±_ 1 _._ 68e _−_ 3 0 _._ 686 _±_ 1 _._ 911e _−_ 3 0 _._ 393 _±_ 3 _._ 643e _−_ 3 0 _._ 683 _±_ 1 _._ 977e _−_ 3
TFM mlp 0 _._ 409 _±_ 4 _._ 157e _−_ 3 0 _._ 678 _±_ 3 _._ 606e _−_ 3 0 _._ 409 _±_ 4 _._ 364e _−_ 3 0 _._ 694 _±_ 2 _._ 94e _−_ 3
TFM patchtsmixer 0 _._ 375 _±_ 1 _._ 74e _−_ 3 0 _._ 637 _±_ 8 _._ 51e _−_ 3 0 _._ 415 _±_ 9 _._ 513e _−_ 3 0 _._ 688 _±_ 2 _._ 668e _−_ 3
TFM timemixer 0 _._ 39 _±_ 1 _._ 764e _−_ 3 0 _._ 662 _±_ 1 _._ 212e _−_ 3 0 _._ 397 _±_ 1 _._ 115e _−_ 2 0 _._ 679 _±_ 1 _._ 147e _−_ 2
TSDE lstm 0 _._ 311 _±_ 9 _._ 39e _−_ 2 0 _._ 521 _±_ 1 _._ 192e _−_ 1 0 _._ 231 _±_ 2 _._ 691e _−_ 2 0 _._ 399 _±_ 6 _._ 764e _−_ 2
TSDE mlp 0 _._ 412 _±_ 1 _._ 143e _−_ 1 0 _._ 596 _±_ 1 _._ 218e _−_ 1 0 _._ 273 _±_ 1 _._ 937e _−_ 2 0 _._ 466 _±_ 2 _._ 423e _−_ 2
TSDE patchtsmixer 0 _._ 265 _±_ 6 _._ 186e _−_ 3 0 _._ 49 _±_ 8 _._ 424e _−_ 3 0 _._ 274 _±_ 2 _._ 561e _−_ 3 0 _._ 503 _±_ 2 _._ 375e _−_ 3
TSDE timemixer 0 _._ 255 _±_ 1 _._ 379e _−_ 2 0 _._ 466 _±_ 2 _._ 595e _−_ 2 0 _._ 276 _±_ 4 _._ 016e _−_ 2 0 _._ 5 _±_ 6 _._ 036e _−_ 2
gemini-2.0-flash CoT +TFM lstm 0 _._ 44 _±_ 5 _._ 224e _−_ 3 0 _._ 711 _±_ 2 _._ 302e _−_ 3 0 _._ 481 _±_ 3 _._ 247e _−_ 3 0 _._ 743 _±_ 1 _._ 26e _−_ 3
gemini-2.0-flash CoT +TFM mlp 0 _._ 443 _±_ 8 _._ 222e _−_ 3 0 _._ 714 _±_ 6 _._ 119e _−_ 3 0 _._ 478 _±_ 8 _._ 296e _−_ 3 0 _._ 742 _±_ 3 _._ 99e _−_ 3
gemini-2.0-flash CoT +TFM patchtsmixer 0 _._ 404 _±_ 2 _._ 595e _−_ 3 0 _._ 672 _±_ 3 _._ 237e _−_ 3 0 _._ 436 _±_ 2e _−_ 3 0 _._ 699 _±_ 7 _._ 007e _−_ 3
gemini-2.0-flash CoT +TFM timemixer 0 _._ 439 _±_ 3 _._ 451e _−_ 3 0 _._ 717 _±_ 1 _._ 775e _−_ 3 0 _._ 466 _±_ 4 _._ 676e _−_ 3 0 _._ 736 _±_ 8 _._ 95e _−_ 4
gemini-2.0-flash CoT lstm 0 _._ 447 _±_ 2 _._ 148e _−_ 3 0 _._ 715 _±_ 1 _._ 988e _−_ 3 0 _._ 492 _±_ 4 _._ 484e _−_ 3 0 _._ 741 _±_ 3 _._ 722e _−_ 3
gemini-2.0-flash CoT mlp 0 _._ 453 _±_ 1 _._ 266e _−_ 3 0 _._ 716 _±_ 1 _._ 248e _−_ 3 0 _._ 489 _±_ 3 _._ 167e _−_ 3 0 _._ 739 _±_ 1 _._ 827e _−_ 3
gemini-2.0-flash CoT patchtsmixer 0 _._ 443 _±_ 1 _._ 368e _−_ 3 0 _._ 714 _±_ 1 _._ 423e _−_ 3 0 _._ 382 _±_ 5 _._ 961e _−_ 2 0 _._ 662 _±_ 4 _._ 915e _−_ 2
gemini-2.0-flash CoT timemixer 0 _._ 455 _±_ 2 _._ 492e _−_ 3 0 _._ 714 _±_ 5 _._ 74e _−_ 4 0 _._ 493 _±_ 2 _._ 823e _−_ 3 0 _._ 741 _±_ 1 _._ 451e _−_ 3
gemini-2.0-flash ICD +TFM lstm 0 _._ 372 _±_ 1 _._ 011e _−_ 2 0 _._ 662 _±_ 8 _._ 436e _−_ 3 0 _._ 484 _±_ 3 _._ 49e _−_ 3 0 _._ 739 _±_ 1 _._ 642e _−_ 3
gemini-2.0-flash ICD +TFM mlp 0 _._ 373 _±_ 5 _._ 795e _−_ 3 0 _._ 668 _±_ 2 _._ 982e _−_ 3 0 _._ 479 _±_ 4 _._ 541e _−_ 3 0 _._ 738 _±_ 4 _._ 24e _−_ 3
gemini-2.0-flash ICD +TFM patchtsmixer 0 _._ 35 _±_ 4 _._ 79e _−_ 3 0 _._ 631 _±_ 3 _._ 774e _−_ 3 0 _._ 431 _±_ 5 _._ 018e _−_ 3 0 _._ 689 _±_ 4 _._ 109e _−_ 3
gemini-2.0-flash ICD +TFM timemixer 0 _._ 393 _±_ 1 _._ 423e _−_ 2 0 _._ 675 _±_ 8 _._ 435e _−_ 3 0 _._ 47 _±_ 3 _._ 658e _−_ 3 0 _._ 73 _±_ 2 _._ 716e _−_ 3
gemini-2.0-flash ICD lstm 0 _._ 385 _±_ 1 _._ 991e _−_ 3 0 _._ 671 _±_ 2 _._ 031e _−_ 3 0 _._ 478 _±_ 2 _._ 194e _−_ 3 0 _._ 735 _±_ 1 _._ 021e _−_ 3
gemini-2.0-flash ICD mlp 0 _._ 386 _±_ 4 _._ 339e _−_ 3 0 _._ 67 _±_ 3 _._ 934e _−_ 3 0 _._ 476 _±_ 2 _._ 665e _−_ 3 0 _._ 734 _±_ 1 _._ 832e _−_ 3
gemini-2.0-flash ICD patchtsmixer 0 _._ 359 _±_ 7 _._ 454e _−_ 2 0 _._ 633 _±_ 8 _._ 33e _−_ 2 0 _._ 394 _±_ 7 _._ 93e _−_ 2 0 _._ 671 _±_ 6 _._ 795e _−_ 2
gemini-2.0-flash ICD timemixer 0 _._ 392 _±_ 1 _._ 708e _−_ 3 0 _._ 671 _±_ 1 _._ 699e _−_ 3 0 _._ 478 _±_ 2 _._ 165e _−_ 3 0 _._ 735 _±_ 1 _._ 052e _−_ 3
gemini-2.0-flash Trend +TFM lstm 0 _._ 406 _±_ 1 _._ 599e _−_ 3 0 _._ 693 _±_ 8 _._ 598e _−_ 4 0 _._ 436 _±_ 7 _._ 652e _−_ 3 0 _._ 708 _±_ 5 _._ 305e _−_ 3
gemini-2.0-flash Trend +TFM mlp 0 _._ 402 _±_ 2 _._ 571e _−_ 3 0 _._ 69 _±_ 1 _._ 739e _−_ 3 0 _._ 423 _±_ 4 _._ 072e _−_ 3 0 _._ 696 _±_ 2 _._ 111e _−_ 3
gemini-2.0-flash Trend +TFM patchtsmixer 0 _._ 376 _±_ 1 _._ 085e _−_ 3 0 _._ 659 _±_ 2 _._ 212e _−_ 3 0 _._ 402 _±_ 2 _._ 707e _−_ 3 0 _._ 674 _±_ 1 _._ 87e _−_ 3
gemini-2.0-flash Trend +TFM timemixer 0 _._ 403 _±_ 2 _._ 033e _−_ 3 0 _._ 692 _±_ 7 _._ 048e _−_ 3 0 _._ 422 _±_ 7 _._ 139e _−_ 3 0 _._ 698 _±_ 5 _._ 21e _−_ 3
gemini-2.0-flash Trend lstm 0 _._ 4 _±_ 4 _._ 035e _−_ 3 0 _._ 687 _±_ 5 _._ 04e _−_ 3 0 _._ 405 _±_ 8 _._ 401e _−_ 3 0 _._ 692 _±_ 6 _._ 798e _−_ 3
gemini-2.0-flash Trend mlp 0 _._ 411 _±_ 1 _._ 205e _−_ 3 0 _._ 693 _±_ 4 _._ 034e _−_ 3 0 _._ 412 _±_ 4 _._ 631e _−_ 3 0 _._ 696 _±_ 3 _._ 027e _−_ 3
gemini-2.0-flash Trend patchtsmixer 0 _._ 378 _±_ 7 _._ 402e _−_ 2 0 _._ 662 _±_ 7 _._ 818e _−_ 2 0 _._ 326 _±_ 6 _._ 116e _−_ 2 0 _._ 613 _±_ 5 _._ 775e _−_ 2
gemini-2.0-flash Trend timemixer 0 _._ 409 _±_ 2 _._ 988e _−_ 3 0 _._ 694 _±_ 2 _._ 309e _−_ 3 0 _._ 398 _±_ 7 _._ 758e _−_ 3 0 _._ 689 _±_ 5 _._ 446e _−_ 3
gemini-2.0-flash zero shot +TFM lstm 0 _._ 46 _±_ 2 _._ 592e _−_ 3 0 _._ 724 _±_ 1 _._ 031e _−_ 3 0 _._ 486 _±_ 4 _._ 692e _−_ 3 0 _._ 75 _±_ 2 _._ 913e _−_ 3
gemini-2.0-flash zero shot +TFM mlp 0 _._ 455 _±_ 1 _._ 591e _−_ 3 0 _._ 721 _±_ 1 _._ 511e _−_ 3 0 _._ 486 _±_ 6 _._ 096e _−_ 3 0 _._ 747 _±_ 4 _._ 234e _−_ 3
gemini-2.0-flash zero shot +TFM patchtsmixer 0 _._ 414 _±_ 2 _._ 556e _−_ 3 0 _._ 68 _±_ 2 _._ 316e _−_ 3 0 _._ 453 _±_ 5 _._ 93e _−_ 3 0 _._ 717 _±_ 4 _._ 403e _−_ 3
gemini-2.0-flash zero shot +TFM timemixer 0 _._ 446 _±_ 2 _._ 195e _−_ 3 0 _._ 716 _±_ 2 _._ 61e _−_ 3 0 _._ 469 _±_ 3 _._ 844e _−_ 3 0 _._ 742 _±_ 6 _._ 946e _−_ 4
gemini-2.0-flash zero shot lstm 0 _._ 462 _±_ 3 _._ 317e _−_ 3 0 _._ 725 _±_ 2 _._ 439e _−_ 3 0 _._ 492 _±_ 7 _._ 376e _−_ 4 0 _._ 75 _±_ 6 _._ 335e _−_ 4
gemini-2.0-flash zero shot mlp 0 _._ 467 _±_ 1 _._ 358e _−_ 3 0 _._ 726 _±_ 1 _._ 781e _−_ 3 0 _._ 491 _±_ 3 _._ 966e _−_ 3 0 _._ 745 _±_ 2 _._ 92e _−_ 3
gemini-2.0-flash zero shot patchtsmixer 0 _._ 454 _±_ 4 _._ 39e _−_ 3 0 _._ 723 _±_ 2 _._ 019e _−_ 3 0 _._ 39 _±_ 1 _._ 129e _−_ 1 0 _._ 66 _±_ 1 _._ 138e _−_ 1
gemini-2.0-flash zero shot timemixer 0 _._ 463 _±_ 1 _._ 015e _−_ 3 0 _._ 722 _±_ 9 _._ 899e _−_ 4 0 _._ 487 _±_ 4 _._ 665e _−_ 3 0 _._ 741 _±_ 4 _._ 708e _−_ 3
interp lstm 0 _._ 336 _±_ 2 _._ 386e _−_ 2 0 _._ 612 _±_ 3 _._ 01e _−_ 2 0 _._ 327 _±_ 3 _._ 616e _−_ 2 0 _._ 557 _±_ 3 _._ 184e _−_ 2
interp mlp 0 _._ 308 _±_ 8 _._ 673e _−_ 3 0 _._ 573 _±_ 2 _._ 125e _−_ 2 0 _._ 233 _±_ 5 _._ 897e _−_ 3 0 _._ 445 _±_ 1 _._ 573e _−_ 2
interp patchtsmixer 0 _._ 273 _±_ 1 _._ 45e _−_ 4 0 _._ 5 _±_ 9 _._ 5e _−_ 5 0 _._ 273 _±_ 0e0 0 _._ 5 _±_ 0e0
interp timemixer 0 _._ 299 _±_ 2 _._ 289e _−_ 2 0 _._ 536 _±_ 4 _._ 692e _−_ 2 0 _._ 272 _±_ 1 _._ 66e _−_ 2 0 _._ 496 _±_ 2 _._ 654e _−_ 2
mean lstm 0 _._ 35 _±_ 8 _._ 786e _−_ 3 0 _._ 6 _±_ 9 _._ 442e _−_ 3 0 _._ 358 _±_ 5 _._ 789e _−_ 2 0 _._ 573 _±_ 4 _._ 881e _−_ 2
mean mlp 0 _._ 341 _±_ 2 _._ 137e _−_ 2 0 _._ 588 _±_ 2 _._ 935e _−_ 2 0 _._ 313 _±_ 3 _._ 221e _−_ 2 0 _._ 505 _±_ 5 _._ 15e _−_ 2
mean patchtsmixer 0 _._ 273 _±_ 1 _._ 7e _−_ 4 0 _._ 5 _±_ 2 _._ 05e _−_ 4 0 _._ 273 _±_ 1 _._ 45e _−_ 4 0 _._ 5 _±_ 9 _._ 5e _−_ 5
mean timemixer 0 _._ 348 _±_ 1 _._ 908e _−_ 2 0 _._ 615 _±_ 1 _._ 567e _−_ 2 0 _._ 284 _±_ 1 _._ 763e _−_ 2 0 _._ 516 _±_ 2 _._ 608e _−_ 2
No ~~s~~ um ~~C~~ oT lstm 0 _._ 522 _±_ 7 _._ 255e _−_ 3 0 _._ 757 _±_ 3 _._ 119e _−_ 3 0 _._ 477 _±_ 3 _._ 339e _−_ 3 0 _._ 735 _±_ 3 _._ 721e _−_ 3
No ~~s~~ um ~~C~~ oT mlp 0 _._ 522 _±_ 3 _._ 581e _−_ 4 0 _._ 76 _±_ 7 _._ 204e _−_ 4 0 _._ 449 _±_ 7 _._ 005e _−_ 3 0 _._ 7 _±_ 6 _._ 358e _−_ 3
No ~~s~~ um ~~C~~ oT patchtsmixer 0 _._ 408 _±_ 9 _._ 767e _−_ 2 0 _._ 68 _±_ 9 _._ 853e _−_ 2 0 _._ 396 _±_ 1 _._ 008e _−_ 1 0 _._ 674 _±_ 8 _._ 421e _−_ 2
No ~~s~~ um ~~C~~ oT timemixer 0 _._ 502 _±_ 8 _._ 977e _−_ 3 0 _._ 75 _±_ 2 _._ 818e _−_ 3 0 _._ 446 _±_ 1 _._ 245e _−_ 2 0 _._ 702 _±_ 1 _._ 019e _−_ 2
No ~~s~~ um ~~I~~ CD lstm 0 _._ 509 _±_ 4 _._ 305e _−_ 3 0 _._ 753 _±_ 7 _._ 202e _−_ 4 0 _._ 492 _±_ 6 _._ 297e _−_ 3 0 _._ 744 _±_ 1 _._ 324e _−_ 3
No ~~s~~ um ~~I~~ CD mlp 0 _._ 504 _±_ 7 _._ 52e _−_ 3 0 _._ 755 _±_ 2 _._ 455e _−_ 3 0 _._ 512 _±_ 1 _._ 189e _−_ 2 0 _._ 751 _±_ 6 _._ 433e _−_ 3
No ~~s~~ um ~~I~~ CD patchtsmixer 0 _._ 407 _±_ 7 _._ 366e _−_ 2 0 _._ 7 _±_ 7 _._ 045e _−_ 2 0 _._ 359 _±_ 8 _._ 137e _−_ 2 0 _._ 655 _±_ 7 _._ 15e _−_ 2
No ~~s~~ um ~~I~~ CD timemixer 0 _._ 482 _±_ 5 _._ 592e _−_ 3 0 _._ 747 _±_ 1 _._ 144e _−_ 3 0 _._ 483 _±_ 1 _._ 094e _−_ 2 0 _._ 739 _±_ 5 _._ 264e _−_ 3
No ~~s~~ um ~~T~~ rend lstm 0 _._ 549 _±_ 2 _._ 184e _−_ 3 0 _._ 768 _±_ 1 _._ 26e _−_ 3 0 _._ 489 _±_ 8 _._ 991e _−_ 3 0 _._ 752 _±_ 4 _._ 14e _−_ 3
No ~~s~~ um ~~T~~ rend mlp 0 _._ 551 _±_ 1 _._ 711e _−_ 3 0 _._ 772 _±_ 3 _._ 869e _−_ 4 0 _._ 489 _±_ 1 _._ 771e _−_ 2 0 _._ 739 _±_ 1 _._ 1e _−_ 2
No ~~s~~ um ~~T~~ rend patchtsmixer 0 _._ 461 _±_ 7 _._ 405e _−_ 2 0 _._ 723 _±_ 4 _._ 69e _−_ 2 0 _._ 379 _±_ 8 _._ 544e _−_ 2 0 _._ 672 _±_ 6 _._ 206e _−_ 2
No ~~s~~ um ~~T~~ rend timemixer 0 _._ 525 _±_ 6 _._ 96e _−_ 3 0 _._ 759 _±_ 3 _._ 27e _−_ 3 0 _._ 453 _±_ 1 _._ 791e _−_ 2 0 _._ 723 _±_ 1 _._ 081e _−_ 2
medgemma CoT +TFM lstm 0 _._ 461 _±_ 2 _._ 095e _−_ 3 0 _._ 721 _±_ 6 _._ 483e _−_ 4 0 _._ 495 _±_ 7 _._ 993e _−_ 3 0 _._ 737 _±_ 4 _._ 285e _−_ 3
medgemma CoT +TFM mlp 0 _._ 46 _±_ 2 _._ 703e _−_ 3 0 _._ 722 _±_ 5 _._ 972e _−_ 4 0 _._ 491 _±_ 3 _._ 25e _−_ 3 0 _._ 727 _±_ 3 _._ 272e _−_ 3
medgemma CoT +TFM patchtsmixer 0 _._ 419 _±_ 3 _._ 118e _−_ 3 0 _._ 677 _±_ 6 _._ 207e _−_ 4 0 _._ 453 _±_ 1 _._ 679e _−_ 3 0 _._ 698 _±_ 7 _._ 701e _−_ 4
medgemma CoT +TFM timemixer 0 _._ 451 _±_ 2 _._ 571e _−_ 3 0 _._ 721 _±_ 4 _._ 86e _−_ 4 0 _._ 481 _±_ 2 _._ 674e _−_ 3 0 _._ 722 _±_ 3 _._ 019e _−_ 3
medgemma CoT lstm 0 _._ 482 _±_ 1 _._ 635e _−_ 3 0 _._ 731 _±_ 1 _._ 264e _−_ 3 0 _._ 501 _±_ 6 _._ 132e _−_ 3 0 _._ 737 _±_ 4 _._ 484e _−_ 3
medgemma CoT mlp 0 _._ 477 _±_ 2 _._ 855e _−_ 3 0 _._ 73 _±_ 1 _._ 213e _−_ 3 0 _._ 497 _±_ 6 _._ 07e _−_ 3 0 _._ 733 _±_ 3 _._ 784e _−_ 3
medgemma CoT patchtsmixer 0 _._ 416 _±_ 8 _._ 737e _−_ 2 0 _._ 683 _±_ 7 _._ 765e _−_ 2 0 _._ 391 _±_ 6 _._ 036e _−_ 2 0 _._ 658 _±_ 5 _._ 204e _−_ 2
medgemma CoT timemixer 0 _._ 473 _±_ 2 _._ 42e _−_ 3 0 _._ 726 _±_ 1 _._ 035e _−_ 3 0 _._ 486 _±_ 4 _._ 948e _−_ 3 0 _._ 728 _±_ 2 _._ 753e _−_ 3


Table 44: Cross-site transfer results - Mort. (part 1/2)


60


Published as a conference paper at ICLR 2026


**Method** **hirid** _→_ **ppicu** **mimic** _→_ **ppicu**
**auprc** **auroc** **auprc** **auroc**


medgemma ICD +TFM lstm 0 _._ 459 _±_ 2 _._ 197e _−_ 3 0 _._ 715 _±_ 1 _._ 475e _−_ 3 0 _._ 489 _±_ 4 _._ 21e _−_ 3 0 _._ 741 _±_ 2 _._ 302e _−_ 3
medgemma ICD +TFM mlp 0 _._ 46 _±_ 7 _._ 566e _−_ 3 0 _._ 717 _±_ 3 _._ 012e _−_ 3 0 _._ 484 _±_ 9 _._ 579e _−_ 3 0 _._ 736 _±_ 6 _._ 33e _−_ 3
medgemma ICD +TFM patchtsmixer 0 _._ 408 _±_ 2 _._ 124e _−_ 3 0 _._ 675 _±_ 2 _._ 087e _−_ 3 0 _._ 449 _±_ 2 _._ 893e _−_ 3 0 _._ 7 _±_ 5 _._ 408e _−_ 4
medgemma ICD +TFM timemixer 0 _._ 438 _±_ 1 _._ 577e _−_ 2 0 _._ 712 _±_ 4 _._ 393e _−_ 3 0 _._ 482 _±_ 3 _._ 808e _−_ 3 0 _._ 735 _±_ 6 _._ 012e _−_ 4
medgemma ICD lstm 0 _._ 455 _±_ 7 _._ 277e _−_ 3 0 _._ 715 _±_ 1 _._ 228e _−_ 3 0 _._ 49 _±_ 4 _._ 828e _−_ 3 0 _._ 741 _±_ 2 _._ 204e _−_ 3
medgemma ICD mlp 0 _._ 461 _±_ 2 _._ 622e _−_ 3 0 _._ 717 _±_ 1 _._ 017e _−_ 3 0 _._ 487 _±_ 2 _._ 734e _−_ 3 0 _._ 74 _±_ 1 _._ 132e _−_ 3
medgemma ICD patchtsmixer 0 _._ 416 _±_ 5 _._ 818e _−_ 2 0 _._ 692 _±_ 4 _._ 581e _−_ 2 0 _._ 403 _±_ 7 _._ 541e _−_ 2 0 _._ 685 _±_ 5 _._ 847e _−_ 2
medgemma ICD timemixer 0 _._ 453 _±_ 2 _._ 641e _−_ 3 0 _._ 714 _±_ 7 _._ 776e _−_ 4 0 _._ 485 _±_ 3 _._ 375e _−_ 3 0 _._ 737 _±_ 1 _._ 735e _−_ 3
medgemma Trend +TFM lstm 0 _._ 411 _±_ 3 _._ 69e _−_ 3 0 _._ 694 _±_ 2 _._ 313e _−_ 3 0 _._ 422 _±_ 7 _._ 35e _−_ 3 0 _._ 695 _±_ 4 _._ 394e _−_ 3
medgemma Trend +TFM mlp 0 _._ 407 _±_ 8 _._ 281e _−_ 3 0 _._ 691 _±_ 7 _._ 451e _−_ 3 0 _._ 423 _±_ 4 _._ 594e _−_ 3 0 _._ 697 _±_ 4 _._ 121e _−_ 3
medgemma Trend +TFM patchtsmixer 0 _._ 368 _±_ 2 _._ 699e _−_ 3 0 _._ 641 _±_ 5 _._ 89e _−_ 3 0 _._ 382 _±_ 2 _._ 051e _−_ 3 0 _._ 653 _±_ 3 _._ 541e _−_ 3
medgemma Trend +TFM timemixer 0 _._ 401 _±_ 1 _._ 04e _−_ 2 0 _._ 696 _±_ 3 _._ 943e _−_ 3 0 _._ 409 _±_ 7 _._ 085e _−_ 3 0 _._ 686 _±_ 9 _._ 073e _−_ 3
medgemma Trend lstm 0 _._ 417 _±_ 5 _._ 283e _−_ 3 0 _._ 701 _±_ 2 _._ 298e _−_ 3 0 _._ 396 _±_ 8 _._ 327e _−_ 3 0 _._ 694 _±_ 2 _._ 259e _−_ 3
medgemma Trend mlp 0 _._ 425 _±_ 1 _._ 544e _−_ 3 0 _._ 705 _±_ 1 _._ 227e _−_ 3 0 _._ 402 _±_ 4 _._ 629e _−_ 3 0 _._ 696 _±_ 1 _._ 47e _−_ 3
medgemma Trend patchtsmixer 0 _._ 411 _±_ 1 _._ 628e _−_ 3 0 _._ 7 _±_ 1 _._ 69e _−_ 3 0 _._ 373 _±_ 4 _._ 873e _−_ 2 0 _._ 666 _±_ 4 _._ 055e _−_ 2
medgemma Trend timemixer 0 _._ 419 _±_ 8 _._ 68e _−_ 4 0 _._ 701 _±_ 6 _._ 009e _−_ 4 0 _._ 389 _±_ 2 _._ 712e _−_ 3 0 _._ 693 _±_ 1 _._ 612e _−_ 3
medgemma zero shot +TFM lstm 0 _._ 463 _±_ 3 _._ 495e _−_ 3 0 _._ 718 _±_ 2 _._ 008e _−_ 3 0 _._ 483 _±_ 4 _._ 484e _−_ 3 0 _._ 736 _±_ 1 _._ 781e _−_ 3
medgemma zero shot +TFM mlp 0 _._ 468 _±_ 4 _._ 851e _−_ 4 0 _._ 726 _±_ 7 _._ 529e _−_ 4 0 _._ 49 _±_ 6 _._ 615e _−_ 3 0 _._ 737 _±_ 3 _._ 856e _−_ 3
medgemma zero shot +TFM patchtsmixer 0 _._ 424 _±_ 1 _._ 662e _−_ 2 0 _._ 681 _±_ 9 _._ 491e _−_ 3 0 _._ 446 _±_ 7 _._ 676e _−_ 3 0 _._ 698 _±_ 7 _._ 654e _−_ 3
medgemma zero shot +TFM timemixer 0 _._ 446 _±_ 3 _._ 23e _−_ 3 0 _._ 72 _±_ 1 _._ 113e _−_ 3 0 _._ 476 _±_ 1 _._ 064e _−_ 2 0 _._ 728 _±_ 7 _._ 495e _−_ 3
medgemma zero shot lstm 0 _._ 455 _±_ 2 _._ 794e _−_ 3 0 _._ 717 _±_ 2 _._ 637e _−_ 4 0 _._ 496 _±_ 6 _._ 549e _−_ 3 0 _._ 74 _±_ 3 _._ 214e _−_ 3
medgemma zero shot mlp 0 _._ 462 _±_ 2 _._ 986e _−_ 3 0 _._ 715 _±_ 2 _._ 225e _−_ 3 0 _._ 492 _±_ 2 _._ 232e _−_ 3 0 _._ 735 _±_ 1 _._ 473e _−_ 3
medgemma zero shot patchtsmixer 0 _._ 458 _±_ 3 _._ 019e _−_ 3 0 _._ 716 _±_ 2 _._ 53e _−_ 3 0 _._ 447 _±_ 4 _._ 454e _−_ 2 0 _._ 709 _±_ 3 _._ 68e _−_ 2
medgemma zero shot timemixer 0 _._ 454 _±_ 1 _._ 164e _−_ 3 0 _._ 713 _±_ 1 _._ 441e _−_ 3 0 _._ 485 _±_ 8 _._ 093e _−_ 3 0 _._ 731 _±_ 4 _._ 914e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot lstm 0 _._ 54 _±_ 1 _._ 203e _−_ 2 0 _._ 764 _±_ 6 _._ 374e _−_ 3 0 _._ 477 _±_ 3 _._ 603e _−_ 3 0 _._ 734 _±_ 4 _._ 113e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot mlp 0 _._ 548 _±_ 6 _._ 611e _−_ 3 0 _._ 77 _±_ 3 _._ 377e _−_ 3 0 _._ 46 _±_ 7 _._ 96e _−_ 3 0 _._ 718 _±_ 6 _._ 132e _−_ 3
No ~~s~~ um ~~z~~ ero ~~s~~ hot patchtsmixer 0 _._ 434 _±_ 6 _._ 888e _−_ 2 0 _._ 709 _±_ 5 _._ 228e _−_ 2 0 _._ 44 _±_ 7 _._ 164e _−_ 2 0 _._ 719 _±_ 5 _._ 262e _−_ 2
No ~~s~~ um ~~z~~ ero ~~s~~ hot timemixer 0 _._ 508 _±_ 1 _._ 576e _−_ 2 0 _._ 75 _±_ 6 _._ 17e _−_ 3 0 _._ 444 _±_ 2 _._ 188e _−_ 2 0 _._ 713 _±_ 1 _._ 891e _−_ 2
right lstm 0 _._ 377 _±_ 3 _._ 521e _−_ 2 0 _._ 632 _±_ 3 _._ 204e _−_ 2 0 _._ 369 _±_ 4 _._ 221e _−_ 2 0 _._ 605 _±_ 4 _._ 497e _−_ 2
right mlp 0 _._ 38 _±_ 1 _._ 781e _−_ 2 0 _._ 646 _±_ 2 _._ 192e _−_ 2 0 _._ 216 _±_ 9 _._ 502e _−_ 3 0 _._ 383 _±_ 2 _._ 84e _−_ 2
right patchtsmixer 0 _._ 273 _±_ 1 _._ 85e _−_ 4 0 _._ 5 _±_ 1 _._ 2e _−_ 4 0 _._ 273 _±_ 0e0 0 _._ 5 _±_ 0e0
right timemixer 0 _._ 332 _±_ 2 _._ 488e _−_ 2 0 _._ 59 _±_ 3 _._ 827e _−_ 2 0 _._ 231 _±_ 4 _._ 167e _−_ 3 0 _._ 424 _±_ 1 _._ 226e _−_ 2


Table 45: Cross-site transfer results - Mort. (part 2/2)


61


