## Talk2AI: A Longitudinal Dataset of Human–AI Persuasive Conversations

Alexis Carrillo [1], Enrique Taietta [1], Ali Aghazadeh Ardebili [1], Giuseppe Alessandro Veltri [2] _[,]_ [3]

& Massimo Stella [1] _[,][∗]_


1CogNosco Lab, Department of Psychology and Cognitive Science, University of Trento, Rovereto, Italy.
2Department of Sociology and Social Research, University of Trento, Trento, Italy.
3Centre for Behavioural and Implementation Sciences in Medicine (BISI), Yong Loo Lin School of Medicine,
National University of Singapore, Singapore.


_∗_ Corresponding author: massimo.stella@unitn.it

### **Abstract**


Talk2AI is a large-scale longitudinal dataset of 3,080 conversations (totaling 30,800 turns) between
human participants and Large Language Models (LLMs), designed to support research on persuasion, opinion change, and human–AI interaction. The corpus was collected from 770 profiled Italian
adults across four weekly sessions in Spring 2025, using a within-subject design in which each participant conversed with a single model (GPT-4o, Claude Sonnet 3.7, DeepSeek-chat V3, or Mistral
Large) on three socially relevant topics: climate change, math anxiety, and health misinformation.
Each conversation is linked to rich contextual data, including sociodemographic characteristics and
psychometric profiles. After each session, participants reported on opinion change, conviction stability, perceived humanness of the AI, and behavioral intentions, enabling fine-grained longitudinal
analysis of how AI-mediated dialogue shapes beliefs and attitudes over time.

### **Background & Summary**


Large Language Models (LLMs) increasingly serve as routine conversational interfaces for navigating complex information and discussing personal or socio-political queries. Alongside this
widespread adoption, researchers have begun investigating how repeated interactions with conversational AI shape belief systems and cognitive organization [1, 2]. A growing body of evidence indicates that these models can function as persuasive agents, even after brief exposures

[3, 4, 5, 6, 7, 8]. These findings demonstrate that AI-generated dialogue can induce measurable
shifts in user preferences, raising important questions regarding the scalability and mechanisms of
algorithmic persuasion in digital communication ecosystems [9, 10].


However, current methodological approaches to algorithmic persuasion often operationalize attitude
change as a single end-point rather than a multidimensional, temporal process [2]. Existing studies


1


frequently focus on immediate post-interaction attitude shifts following one-shot exposures [3, 4].
Furthermore, interactive experimental designs routinely require participants to debate pre-specified
claims that may not accurately reflect their intrinsic baseline positions [5]. These structural constraints complicate efforts to disentangle how specific semantic content and syntactic structures
contribute to the persuasive efficacy of language models over time [7, 6, 8]. AI is increasingly
conceptualized as a continuous persuasive agent whose influence depends on system properties,
recipient characteristics, and the conversational context [11]. Meta-analytic evidence suggests that
while AI communicators are generally persuasive, repeated conversations likely alter social appraisal
and belief certainty to varying degrees, rather than producing a monolithic effect [12, 13, 14].


To address these methodological gaps, we introduce the Talk2AI dataset, a multi-wave corpus
designed to facilitate high-resolution analyses of persuasion, cognitive engagement, and trust dynamics over time. The dataset comprises interaction records from 770 participants—stratified to
represent the adult Italian population—who completed a four-wave longitudinal study. Participants
were randomly assigned to engage with one of four distinct computational architectures (GPT-4o

[15], Claude 3.7 Sonnet [16], DeepSeek-chat V3 [17], or Mistral Large [18]) to discuss a fixed topic
(climate change, math anxiety, or health misinformation) consistently across four weeks.


This resulting corpus provides a robust empirical foundation for research in cognitive science and
human-machine interaction. By linking over 30,000 raw conversational turns with high-granularity
psychometric profiles, sociodemographic metadata, and explicit session-by-session persuasion metrics, the dataset facilitates the investigation of individual differences in AI receptivity. Researchers
can leverage this resource to model the moderating effects of personality traits on persuasion, compare how varying training paradigms influence user trust, and develop interpretable, text-derived
measures of influence that extend beyond traditional agreement scales to capture structural changes
in human thought.

### **Methods**


An overview of the full methodological workflow, from participant recruitment through data collection and processing, is provided in Figure 1.


The study followed a within-subject longitudinal design across four distinct waves, with consecutive
sessions occurring at one-week intervals to capture temporal interaction dynamics. Approval for
the study protocol was granted by the Ethics Committee of the University of Trento. Informed
consent was obtained from all participants during the registration process. This procedure required
users to acknowledge their interaction with artificial intelligence interlocutors and affirmed their
right to withdraw from the collection at any point. To protect participant privacy, all personal
identifiers were fully anonymized prior to data processing.


Management of the recruitment occurred through a certified online panel provided by Bilendi Italia.
An initial invitation reached 2,545 individuals, stratified by age, gender, and geographic region to
represent the adult Italian population between 18 and 69 years of age. Data collection took place
during the Spring of 2025. The initial cohort included 2,644 registered users. From this group, 814
participants completed the full sequence of four conversational waves, ultimately yielding a final
validated dataset of 770 fully profiled users who met technical quality control criteria.


2


Data Usage examples



Modeling NLP and argumentation modeling persuasion analytics



Unsupervised
user typology clustering



Figure 1: **Talk2AI** **experiment** **workflow** **and** **data** **generation** **pipeline.** The data collection
workflow begins with participant registration (Step 1), recording sociodemographic metadata, topic
assignment, and LLM architecture assignment. The repeated session loop encompasses Steps 2
through 4. Step 2 records psychometric profiles, capturing Need for Cognition, Big Five personality
traits, and trust in LLMs (TILLMI). Step 3 logs the conversational interaction, comprising 10 turns
between the user and the model. Step 4 collects persuasion feedback. Users repeat this loop for four
sessions, with a one-week delay between each session. The data processing pipeline begins at Step
5; the system evaluates responses for completeness and variance, discarding data that fails these
criteria. Step 6 applies exploratory and confirmatory factor analysis and longitudinal measurement
invariance testing to generate the `data_table.csv` file. Step 7 translates the conversational logs
into English, Spanish, Dutch, German, Portuguese, and French. The bottom panel displays data
usage examples: longitudinal sequence modeling, NLP and argumentation modeling, predictive
persuasion analytics, and unsupervised user typology clustering.


3


To collect the data, we administered a custom web platform that integrated survey instruments
with a synchronous chat interface. During the initial registration, participants provided baseline
sociodemographic information, including self-reported gender, date of birth, household size, education level, and employment status. Socioeconomic standing was assessed using both an adaptation
of the MacArthur Scale of Subjective Social Status [19] and objective indicators of financial distress. Finally, baseline artificial intelligence awareness (recorded under the variable `knowLlms` ) was
assessed via a direct screening question: _"Have_ _you_ _ever_ _heard_ _of_ _language_ _models_ _like_ _ChatGPT?"_


During the subsequent longitudinal phase, participants completed a repeated weekly sequence of
psychometric profiling, conversational interaction, and post-interaction feedback. Assessment of
psychometric traits occurred before each chat using 5-point Likert scales, including the 8-item Trust
in Large Language Models Inventory (TILLMI) [20], the 6-item short-form Need for Cognition scale

[21], and the 10-item short version of the Big Five Inventory [22].


For the conversational phase, we randomly assigned participants to interact with one of four models:
GPT-4o [15], Claude Sonnet 3.7 [16], DeepSeek-chat V3 [17], or Mistral Large [18]. Each user
discussed a specific topic—climate change, math anxiety, or health misinformation. Both the
assigned model and topic remained constant across all four waves. Each session was fixed at ten
conversational turns.


To ensure argumentative depth, the chat interface imposed behavioral constraints. The platform
enforced a minimum length requirement of 50 words for the user’s first message. To assist users in
sustaining an active debate, the interface presented three domain-agnostic behavioral flashcards.
These prompts encouraged participants to actively challenge the assistant by: (1) demanding further details, (2) providing counter-reasoning, or (3) questioning the assistant’s certainty. This
design choice mitigated the "cold start" problem, prevented passive agreement, and ensured users
possessed the argumentative tools necessary to sustain the mandated ten-turn depth.


Concurrently, programmatic instructions were appended invisibly to the user’s textual inputs before
being processed by the respective LLM API. During the first turn, the prompt included the directive:
_"Please_ _identify_ _any_ _fallacies_ _in_ _my_ _arguments_ _and_ _point_ _them_ _out."_ For all subsequent turns, a
constraining wrapper instructed the model to: _"Please_ _provide_ _concise_ _responses_ _of_ _approximately_
_100_ _words_ _each._ _Keeping_ _responses_ _to_ _around_ _100_ _words_ _is_ _essential_ _for_ _effective_ _conversation._
_Remember:_ _never_ _allow_ _the_ _user_ _to_ _change_ _the_ _subject."_


Following the tenth turn, participants were redirected to a structured feedback module consisting
of four quantitative metrics (scored on a 1–100 scale) and one qualitative measure. Conviction
stability ( _Q_ 0) captured the persisting strength of the user’s initial arguments, while self-reported
opinion change ( _Q_ 1) quantified the extent to which the conversation altered their views. Perceived
humanness ( _Q_ 2) evaluated how closely the interaction resembled a human dialogue. To operationalize behavioral persuasion, personal endowment ( _Q_ 3) utilized a Dictator Game proxy [23] wherein
participants hypothetically allocated 100 Euros between themselves and a topic-relevant charity;
the recorded score indicates the exact amount the participant chose to keep. Finally, qualitative
feedback ( _Q_ 4) was collected via a mandatory open-ended text field, requiring participants to write
a minimum of 50 words detailing their updated thoughts on the assigned topic.


4


**Data** **Cleaning**


Following the data collection phase, raw records were exported from the platform in JSON format,
yielding an initial corpus of 2,644 user registries, 10,589 psychometric scale sessions, and 5,214 conversational sessions. To ensure data integrity and construct a robust final dataset, we implemented
a three-stage computational filtering pipeline in Python (see Section Code availability for codebase
details) summarized visually in Figure 2.


The first stage applied a session-level filter to evaluate the message array of each recorded conversation. Sessions failing to meet the 20-message threshold (10 user inputs and 10 system responses)
were discarded. This step excluded incomplete dialogues and sessions compromised by connection
interruptions, reducing the corpus to 4,447 valid conversational sessions.


The second stage enforced a user-level variance check on the psychometric questionnaires to validate intentional responding. For each session, we calculated the response variance across the 24
psychometric scale items. Participants exhibiting zero variance, an indicator of "straight-lining",
were excluded from the dataset. This filtering step preserves the analytical reliability of the corpus, given that uniform response patterns reflect inattention and compromise the validity of the
measured psychological constructs.


In the final stage, the remaining data were aggregated by user identifier to assess cumulative
longitudinal completion. Participants were retained only if they satisfied two concurrent thresholds:
submission of all assigned psychometric and feedback surveys (exactly 116 logged responses) and
successful completion of all four conversational waves (80 total messages). Through this algorithmic
curation, the initial pool of 2,644 registered users was distilled into a final cohort of 770 participants.

### **Data Records**


The Talk2AI dataset is publicly accessible through a dedicated GitHub repository (See Section
Data availability ). This collection comprises three primary files in JSON format, which preserve
the original Italian text of the interactions and survey responses for the 770 validated participants.
We organized the records into separate files to distinguish between participant demographics, psychological assessments, and conversation logs.


Demographic and experimental metadata reside in `talk2ai_registries.json`, which contains
770 unique records corresponding to each participant. Each object includes a unique user identifier
alongside a nested sociodemographic form. Variables include gender, date of birth, total household
size, educational attainment (via the European Qualifications Framework), and employment status.
The registry also captures prior AI familiarity, subjective socioeconomic standing, and a binary
indicator of objective financial distress. Finally, each record explicitly maps the discussion topic
and the specific language model assigned to the user. Table 1 present the questions and coded
values of the answers for demographic data. Table 2 presents a random sample of 10 records of the
registry data.


Psychometric and evaluative data are stored in `talk2ai_psyscales.json` . This file contains 6,160
records, representing eight entries per user (four pre-interaction psychometric batteries and four


5


**Excluded**

Incomplete / interrupted
sessions, _n_ = 767 sessions


**Excluded**

Straight-liners (zero variance)


**Excluded**

Incomplete participation, _n_ = 1 _,_ 874 users









**Final** **validated** **cohort**

_n_ = 770 fully profiled participants


Figure 2: PRISMA-style flow diagram of the data cleaning pipeline. Sequential filters excluded
incomplete conversational sessions (Filter 1), zero-variance psychometric responses (Filter 2), and
participants failing cumulative completion thresholds (Filter 3), yielding a final validated cohort of
770 fully profiled participants from an initial pool of 2,644 registrants.


post-interaction feedback sessions). Each record identifies the user, the session, and the specific
timestamp. Entries labeled as psychological scales contain the raw 1-5 Likert responses to the
24 items covering the TILLMI, Need for Cognition, and Big Five Inventory. A description of the
psyscales names and their correspondent scoring and questionary is presented in table 3. Conversely,
feedback records (see table 4) store the 0-100 scale responses regarding conviction stability ( _Q_ 0),
opinion change ( _Q_ 1), perceived humanness ( _Q_ 2), and the Dictator Game endowment proxy ( _Q_ 3),
alongside the 50-word minimum qualitative feedback ( _Q_ 4). A sample of the psyscales records can
be seen in table in a vertical format of data records samples in table 5.


To facilitate statistical analysis, we provide an aggregated tabular file named `data_table.csv` .
This compiled dataset consists of 3,080 rows representing the four interaction waves for each participant. It consolidates sociodemographic variables with session-specific metadata (topic and model
assignments). Importantly, this table includes the standardized factor scores derived from the
psychometric analysis (See Section Technical validation ), the unidimensional `TILLMI` score and
the two Need for Cognition subfactors ( `NFC_seek` and `NFC_diligence` ). These latent traits are
mapped directly against the post-interaction feedback metrics ( _Q_ 0– _Q_ 4) for each corresponding session, providing a ready-to-use format for longitudinal and predictive modeling without requiring
JSON parsing.


Comprising the core textual corpus, `talk2ai_conversations.json` holds 3,080 records representing the four synchronous chat waves completed by each user. Each record links a dialogue to specific


6


Table 1: **Sociodemographic** **profiling** **questionnaire** **and** **variable** **coding.** This table details the demographic and socioeconomic questions administered to participants during the initial
registration phase (Step 1). The **Question** **name** column corresponds to the variable identifiers
found in the `talk2ai_registries.json` and aggregated `data_table.csv` files. The **Text** column
provides the English translation of the original Italian survey items presented to the users. The
**Values** column outlines the available response options and their corresponding alphanumeric encodings within the dataset. Assessed metrics include standard demographic indicators (e.g., gender,
age, household size), educational attainment mapped to the European Qualifications Framework
(EQF), employment status, prior AI literacy, and both subjective (1–100 slider) and objective
measures of financial security.


**Question** **name** **Text** **Values**


gender Indicate your gender Male: M, Female: F, Other: A, Prefer
not to answer: N


age Indicate your date of birth _>_ 1900 _−_ 01 _−_ 01


family Members How many people are in your household? 1–15


eqf What is the highest level of education you have Primary school: 1, Middle school: 2,
completed? Secondary school: 3, Bachelor’s degree:
4, Master’s degree: 5, Single-cycle master’s degree: 6, PhD: 7


current Job What is your current job? Self-employment: 1, Employed: 2,
Parasubordinate employment: 3, Not
employed: 4, Other: 5


know Llms Have you ever heard of language models like Yes: 1, No: 0
ChatGPT?



Economic Auto Let’s do an imagination experiment: Imagine
Evaluation a ladder. At the top are people with the most
resources, such as money, education, and job
opportunities. At the bottom, are those with
the fewest resources. Where would you place
yourself? Move the cursor to the point that
best represents your position.



1–100



struggle In the last 12 months, have you had difficulty Yes: 1, No: 0
paying your bills?


session and user identifiers through a `messages` array. This array documents every turn in strict
chronological order, specifying the speaker role (user or assistant), the precise creation timestamp,
and the raw textual content.


To enable comparative linguistic analysis, the `translations` folder provides these same 3,080
dialogues translated into English, Spanish, Dutch, German, Portuguese, and French. Stored as
separate compressed archives for each language, these files maintain a one-to-one mapping with
the original Italian identifiers, ensuring that the message sequence and role-play dynamics remain
structurally identical across all seven languages.


7


Table 2: **Illustrative** **sample** **of** **user** **registry** **records.** This table provides a representative
excerpt of two participant entries from the raw `talk2ai_registries.json` file. The rows detail
the specific variables generated during the initial registration phase (Step 1). These include universally unique identifiers (UUIDs) utilized for privacy-preserving longitudinal data linkage ( `userId`,
`registryId` ), the randomly assigned experimental conditions ( `llms`, `topic` ), raw sociodemographic
inputs, and system-generated chronological timestamps ( `insertDate` ).


**Variable** **Example** **1** **Example** **2**


userId `de68aea0-a84f-4252-aa16-ee38ed28f87c` `9d8f8267-2006-4cd0-833d-1911f585bad8`


registryId `b11f3254-e2ed-4598-9a5b-3a7e1a58b04f` `472ffbd1-258c-46a4-9807-2ee6a20fae26`


llms ANTHROPIC OPENAI
topic MATH CLIMATE
gender M F
age 1991-12-14 1962-10-30
family Members 2 3
eqf 6 3
current Job 2 2
knows Llms 1 1
economic Auto 75 48
Evaluation

struggle 0 0


insert Date 2025-05-08 14:37:21 2025-05-08 16:39:12

### **Technical Validation**


To evaluate the structural validity of the psychometric instruments at baseline (Time 1), the sample
was split into independent exploratory and confirmatory subsets using demographic-stratified sampling. Sample sizes varied across specific scale analyses due to construct-specific exclusion criteria.
Specifically, 69 participants who responded negatively to the baseline `knowLlms` screening question
( _"Have_ _you_ _ever_ _heard_ _of_ _language_ _models_ _like_ _ChatGPT?"_ ) were excluded from the baseline validation of the TILLMI scale, as they could not validly report a pre-existing attitude toward an
unknown technology. Consequently, the TILLMI models were validated on the remaining 701 participants (EFA subset _N_ = 336; CFA subset _N_ = 365). The Need for Cognition (NFC) scale, which
measures a general cognitive trait, did not require this domain-specific filtering and was validated
on the full baseline cohort (EFA subset _N_ = 368; CFA subset _N_ = 402). To preserve theoretical
continuity, item selection for all analyses heavily favored the previously validated structures of these
scales, tolerating minor statistical deviations where conceptually appropriate.


**Exploratory** **Factor** **Analysis** **(EFA)**


For the TILLMI scale ( _N_ = 336), initial diagnostics of the 8 items showed excellent overall suitability (Bartlett’s _χ_ [2] (28) = 1014 _._ 96, _p < ._ 001; KMO _MSA_ = _._ 88). However, Item 7 was removed due
to inadequate sampling adequacy ( _MSA_ = _._ 54) and problematic cross-loading. A subsequent EFA
on the remaining 7 items confirmed high suitability (KMO _MSA_ = _._ 89). Although initial eigenvalues suggested a secondary factor, scree plot inspection and significant cross-loadings in forced
two-factor solutions supported retaining a parsimonious, unidimensional 7-item model.


8


Table 3: **Psychometric** **profiling** **questionnaires** **and** **variable** **coding.** This table details the
24 items comprising the three psychometric instruments administered to participants during the
longitudinal study (Step 2): the Trust in Large Language Models Instrument (TILLMI), the Need
for Cognition (NFC) scale, and a short-form Big Five personality inventory. The **Column** **name**
denotes the variable identifiers located in the `talk2ai_psyscales.json` and `data_table.csv` files.
The **Item** column provides the English translation of the original Italian prompts presented to the
users. All items were evaluated on a 1–5 Likert scale. The **Scoring** column specifies whether the
raw response is direct or reverse-coded for factor analysis, while the **Max** **Score** **Interpretation**
column provides the psychological trait associated with a maximum Likert response (5).


**Scale** **Column** **Item** **Scoring** **Max** **Score**
**name** **Interpretation**


psyscale01Q1 I feel at ease with Large Language Models (LLMs) direct high trust
and can freely share my ideas with them.

psyscale01Q2 I would feel a sense of discomfort if my interactions direct high need
with an LLM were suddenly interrupted or blocked.

psyscale01Q3 If I share my wellness concerns with LLMs, I know direct high trust
they will respond constructively and thoughtfully.

psyscale01Q4 I spend a lot of time developing and improving my direct agree
prompts for interacting with LLMs.

psyscale01Q5 LLMs perform tasks mostly with competence and direct agree
precision, without hallucinations.

psyscale01Q6 I can rely on LLMs not to make my work more direct agree
difficult with careless work.

psyscale01Q7 Although I generally trust the results of LLMs, the direct high trust
final word is always mine.

psyscale01Q8 I tend to trust LLMs more than other people. direct high trust


psyscale01Q9 I prefer complex problems over simple ones. direct high need for cognition
psyscale01Q10 I like having the responsibility of dealing with a direct high need for cognition
situation that requires extensive reasoning.

psyscale01Q11 Thinking is not my idea of fun. reversed low need for cognition
psyscale01Q12 I would prefer to do something that requires little reversed low need for cognition
thought rather than something that would
definitely challenge my cognitive abilities.

psyscale01Q13 I really like tasks that require devising new direct high need for cognition
solutions to problems.



psyscale01Q14 I would prefer an intellectual, difficult, and
important task over one that, although important,
does not require much thought.



direct high need for cognition



psyscale01Q15 I am a reserved person. reversed low Extraversion
psyscale01Q16 I am a person who generally trusts others. direct high Agreeableness
psyscale01Q17 I am a person who tends to be lazy. reversed low Conscientiousness
psyscale01Q18 I am a relaxed person who handles stress well. direct high Emotional Stability
(low Neuroticism)
psyscale01Q19 I am a person with few artistic interests. reversed low Openness to Experience
psyscale01Q20 I am an outgoing, sociable person. direct high Extraversion
psyscale01Q21 I am a person who tends to find fault with others. reversed low Agreeableness
psyscale01Q22 I am a conscientious worker. direct high Conscientiousness
psyscale01Q23 I am a person who gets agitated easily. reversed low Emotional Stability
(high Neuroticism)
psyscale01Q24 I am a person with a vivid imagination. direct high Openness to
Experience


9


Table 4: **Post-interaction** **feedback** **questionnaire** **and** **variable** **coding.** This table details
the five feedback questions administered to participants immediately following their 10-turn conversational session with the assigned language model (Step 4). The **Feedback** **name** column aligns
with the variable identifiers located in the `talk2ai_psyscales.json` and `data_table.csv` files.
The **Text** column provides the English translation of the original Italian prompts presented to the
users. The programmatic placeholder `«topic»` was dynamically replaced during the experiment
with the user’s randomly assigned conversational subject (i.e., Climate Change, Math Anxiety, or
Health Misinformation). Variables `feedbackQ0` to `feedbackQ3` capture quantitative metrics of conviction, persuasion, perceived humanness, and behavioral endowment, whereas `feedbackQ4` records
qualitative, open-ended textual responses to evaluate the participant’s post-interaction stance.


**Feedback** **name** **Text**


feedbackQ0 On a scale of 1 to 100, how convinced are you of your initial arguments?


feedbackQ1 How much has this conversation changed your opinion on the topic
`«topic»` ?


feedbackQ2 How much did it feel like you were talking with a human?


feedbackQ3 Imagine you have €100 available. You can decide to keep a part of it and
donate the rest to an association that deals with `«topic»` . How much
would you choose to keep?


feedbackQ4 What do you think now about the topic `«topic»` ? (Write at least 50
words)


For the NFC scale ( _N_ = 368), the 6 items demonstrated adequate suitability (Bartlett’s _χ_ [2] (15) =
551 _._ 81, _p_ _<_ _._ 001; KMO _MSA_ = _._ 75). Item 3 exhibited marginal adequacy ( _MSA_ = _._ 52) but was
retained to preserve the established 6-item theoretical structure. Parallel and scree plot analyses
indicated a two-factor solution explaining 53.9% of the variance. Using an oblimin rotation, the
items separated cleanly into Factor 1 ( `NFC_seek` : items 1, 2, 5, 6; loadings _>_ _._ 68) and Factor 2
( `NFC_diligence` : items 3, 4; loadings _> ._ 65). This two-factor structure was retained as theoretically
superior to a unidimensional model.


**Confirmatory** **Factor** **Analysis** **(CFA)**


The EFA-derived models were tested on a separate confirmatory subset at Time 1 using the DWLS
estimator for ordered categorical data.


The 7-item unidimensional TILLMI model showed excellent fit (CFI = _._ 998, TLI = _._ 998, SRMR =
_._ 034, RMSEA = _._ 043 [90% CI: _._ 000 _, ._ 072]). Internal consistency, calculated via ordinal Cronbach’s
alpha from the polychoric correlation matrix, was high ( _α_ = _._ 902, 95% CI [ _._ 73 _, ._ 98]).


The two-factor NFC model yielded robust global fit indices (CFI = _._ 995, TLI = _._ 990, SRMR = _._ 041,
RMSEA = _._ 067 [90% CI: _._ 035 _, ._ 101]), outperforming a competing 1-factor model (CFI = _._ 834). The
model produced a warning of negative estimated residual variance for item 4, a known artifact for
factors indicated by only two items. Ordinal Cronbach’s alpha for `NFC-Seek` was strong ( _α_ = _._ 855).
The `NFC-Diligence` factor fell marginally below the standard .70 threshold ( _α_ = _._ 683), which is
statistically expected for a two-item construct and remains theoretically valuable.


10


Table 5: **Illustrative** **sample** **of** **psychometric** **and** **feedback** **records.** This table provides
a representative excerpt of two participant entries from the raw `talk2ai_psyscales.json` file,
demonstrating the structure of the longitudinal session data. The `name` variable distinguishes
between initial psychometric assessments (Step 2) and post-conversation feedback records (Step 4).
Because these assessments occur at distinct temporal stages of the experimental wave, variables not
applicable to the specific record type are stored as nulls (represented here as dashes). The excerpt
captures the 1–5 Likert responses for the psychometric items ( `psyscale01Q1` - `Q24` ), quantitative
persuasion metrics ( `feedbackQ0` - `Q3` ), and the original qualitative text ( `feedbackQ4` ). Universally
unique identifiers (UUIDs) ensure privacy-preserving data linkage.


**Variable** **Example** **1** **Example** **2**


userId `a1983b67-b48c-4c21-a90` `8c154903-5aee-4361-b6f4-06496d7decdf`
```
         8-7abb84ed4ddd

```

name psyscales feedback


psyscaleId `8406391e-9db7-475d-9de` `d2a41dad-3a95-4df2-b5b5-475a4d2d1db8`
```
         7-1558a90766f3

```

sessionId `552e0988-b168-4724-8bd` `b73decea-a0ef-4f16-808f-d1ffb446786d`
```
         9-029cc1794792

```

psyscale01Q1 4  psyscale01Q2 5  . . . . . . . . .
psyscale01Q23 3  psyscale01Q24 3  

feedbackQ0  - 100
feedbackQ1  - 50
feedbackQ2  - 25
feedbackQ3  - 93
feedbackQ4  - Il cambiamento climatico si riferisce a variazioni a lungo
termine delle temperature e dei modelli meteorologici. Queste
variazioni possono essere naturali, ad esempio a causa di
cambiamenti nell’attività solare                       - di grandi eruzioni vulcaniche.
Tuttavia, a partire dal 1800, le attività umane sono diventate il
principale motore del cambiamento climatico, principalmente a
causa della combustione di combustibili fossili come carbone,
petrolio e gas. Cause del cambiamento climatico:                           Combustione di combustibili fossili: La combustione di
carbone, petrolio e gas per produrre energia elettrica, calore e
trasporti rilascia grandi quantità di anidride carbonica (CO2) e
altri gas serra nell’atmosfera. Questi gas intrappolano il calore
del sole, portando a un aumento delle temperature globali.                           Deforestazione: Le foreste assorbono CO2 dall’atmosfera. Il
taglio degli alberi non solo elimina questo importante pozzo di
carbonio, ma il legno in decomposizione                         - bruciato rilascia
anche il carbonio immagazzinato nell’atmosfera.                       - Agr


insertDate 2025-05-24 08:00:10 2025-05-28 07:22:34


**Longitudinal** **Measurement** **Invariance**


Finally, the models were tested for longitudinal measurement invariance across all four waves using
the full sample ( _N_ = 770; Table 7).


11


Table 6: **Illustrative** **sample** **of** **conversational** **interaction** **records.** This table provides a
representative excerpt of two message entries from the raw `talk2ai_conversations.json` file, documenting the multi-turn dialogues between participants and their assigned large language models
(Step 3). The data structure utilizes universally unique identifiers (UUIDs) for privacy-preserving
linkage across users ( `userId` ), longitudinal phases ( `sessionId` ), and specific dialogue instances
( `conversationId` ). Each record represents a single utterance, defined by a unique `messageId`,
the chronological `msg_timestamp`, and the interlocutor’s `role` (either `user` or `assistant` ). The
`content` variable captures the raw, unedited Italian text exchanged during the session. Example
1 illustrates a user’s prompt regarding climate change, whereas Example 2 displays a language
model’s generated counter-argument concerning healthcare systems and misinformation.


**Variable** **Example** **1** **Example** **2**


sessionId `9d5f7607-d3dd-48e6-8eea-66d5037b9c7e` `84012abf-6ff3-4399-b871-83601b3b49b5`


userId `c549d78a-4066-4a9e-b8ac-12dcc8e64359` `aac8ea52-d791-412a-96ef-cb233e59e139`


conversationId `ae444a9e-6319-40d0-8b1f-04cf018e933d` `e79e7e24-14d2-49b4-82ef-6d6e73def149`


conv_start_date 2025-05-26 16:52:43 2025-05-09 14:13:19


messageId `2qvddqCtddUwPuRo` `msg-YN4FDDOZjuQMRtlM8HfREZ7b`


role `user` `assistant`



content La concentrazione di CO2 provoca
l’innalzamento globale della temperatura
che a sua volta rende sempre più frequenti
fenomeni di inondazioni, siccità, dissesto
idrogeologico, diffusione di malattie, crisi
dei sistemi agricoli, crisi idrica e estinzione
di specie animali e vegetali. Non possiamo
più attendere, dobbiamo invertire la rotta



Hai sollevato punti validi. È vero che le
"finte evidenze" confondono, ma il problema
non è solo il SSN: è sistemico. I social hanno
un impatto enorme (vedi teorie complottiste
virali), mentre l’istruzione, indebolita da
scelte politiche, non prepara a discernere le
fonti. Sul collasso del SSN, alcune regioni
(es. Emilia-Romagna) hanno performance
migliori, ma il finanziamento inadeguato e
la burocrazia soffocano l’efficienza. Il
privato è un tampone, ma il vero problema
è la mancanza di investimenti strutturali.
Gli anziani sono solo un sintomo: il sistema
non incentiva l’aggiornamento continuo,
nemmeno per i giovani. (100 parole)



msg_timestamp 2025-05-26 16:54:54 2025-05-09 14:16:16


For both scales, the change in CFI from the metric to the scalar model remained within the accepted
tolerance (∆CFI _≤_ _._ 011). The TILLMI model achieved scalar invariance (∆CFI = _−._ 010) despite
an elevated baseline configural RMSEA (.110), likely reflecting RMSEA’s known sensitivity to model
complexity. The NFC model showed acceptable configural fit (RMSEA = _._ 085) and passed scalar
invariance (∆CFI = _−._ 011). Establishing scalar invariance confirms that the factor structures,
loadings, and item intercepts remained equivalent across waves, ensuring the validity of latent
score comparisons over the course of the longitudinal study.


12


Table 7: **Longitudinal** **measurement** **invariance** **fit** **indices** **for** **psychometric** **scales.** This
table presents the model fit statistics establishing the structural consistency of the Trust in Large
Language Models Instrument (TILLMI; 7-item, 1-factor) and the Need for Cognition scale (NFC;
6-item, 2-factor) across the four experimental waves (full sample, _N_ = 770). Configural, metric, and
scalar invariance models were sequentially estimated to confirm that the psychometric properties
of the instruments remained stable over repeated longitudinal assessments. All reported fit indices
are robust scaled values ( `.scaled` ) extracted via the `lavaan` package. The ∆CFI column indicates
the change in CFI relative to the preceding, less constrained model (e.g., Metric vs. Configural).
Abbreviations: CFI, Comparative Fit Index; TLI, Tucker-Lewis Index; SRMR, Standardized Root
Mean Square Residual; RMSEA, Root Mean Square Error of Approximation; CI, Confidence Interval.


**Scale** **Model** **CFI** ∆ **CFI** **TLI** **SRMR** **RMSEA** **[90%** **CI]**


TILLMI Configural .891    - .880 .062 .110 [.107, .114]
(7-item, 1-factor) Metric .918 +.027 .914 .064 .093 [.090, .096]
Scalar .908 -.010 .922 .064 .089 [.086, .092]


Need for Cognition Configural .945     - .933 .053 .085 [.081, .089]
(6-item, 2-factor) Metric .955 +.010 .947 .056 .075 [.071, .080]
Scalar .944 -.011 .950 .056 .073 [.070, .077]

### **Usage Notes**


To utilize the _Talk2AI_ dataset, researchers integrate the files using unique identifiers. The user
demographic data ( `talk2ai_registries.json` ), participant metadata ( `data_table.csv` ), psychometric evaluations ( `talk2ai_psyscales.json` ), and conversational transcripts ( `talk2ai_conv`
`ersations.json` ) merge at the user level using the `userId` key. For temporal analysis, researchers
link records across `talk2ai_conversations.json` and `talk2ai_psyscales.json` using the
`sessionId` key. Session records sort chronologically using session date values. This linkage permits
the analysis of user responses and interactions across the experiment waves.


When analyzing user traits, researchers utilize standardized factor scores rather than computations
of raw values or unweighted linear combinations of the Likert items. These scores originate from
Longitudinal Measurement Invariance (LMI) testing to ensure measurement stability across waves
(see Technical Validation). The Trust in Large Language Models Instrument (TILLMI) provides a
unidimensional factor score derived from exploratory and confirmatory factor analyses (see Section
Technical validation), supporting a single-factor solution for this dataset. However, the validation
study [20] posited a two-factor structure. The Need for Cognition (NFC) scale provides two subfactor scores: `NFC_seek` (motivation for cognitive tasks) and `NFC_diligence` (persistence in mental
discipline, derived from reverse-coded items `psyscale01Q11` and `psyscale01Q12` ). For both scales,
in all factors, increases in standardized scores correspond to increases in the target trait.


By linking categorical variables (demographics, assigned topics, LLM architecture) and psychometric baselines with session feedback ( `feedbackQ0` - `feedbackQ3` ) and textual data ( `content`,
`feedbackQ4` ), the dataset architecture facilitates multidimensional analytics. Researchers can apply Natural Language Processing (NLP) to the textual logs and feedback responses for feature
engineering. Because the system prompts instructed the models to identify argument flaws, the
resulting conversational data provides a foundation for fallacy detection, stance classification, and


13


adversarial argumentation modeling. The native `content` variable consists of unedited Italian
text, which requires Italian-compatible libraries (e.g., `spaCy` Italian models) for syntax parsing and
extraction. Alternatively, the machine-translated English subsets accommodate English-centric
computational tools. Finally, extracted features—such as syntax complexity, sentiment valence,
and lexical diversity—can be cross-referenced with metadata to profile interaction styles, allowing
researchers to test associations like the relationship between trust baselines and semantic density
across different LLM architectures.


Text embeddings combined with factor scores support unsupervised learning methodologies. Concatenating numerical arrays with vector representations of text permits dimensionality reduction
and clustering algorithms (e.g., K-Means, HDBSCAN). This approach clusters user typologies,
isolating profiles that display linguistic compliance alongside non-persuasion. Unsupervised topic
modeling applied across waves tracks semantic drift and argument evolution within the experiment
topics.


Baseline traits and textual sequences provide the feature space for supervised predictive modeling.
Researchers frame persuasion outcomes as regression or classification tasks using demographics,
factor scores, and NLP features as independent variables. These feature sets train algorithms to
forecast outcomes. Target variables include classification of stance shifts or regression of persuasion
metrics and model humanness evaluations ( `feedbackQ2` ).


The longitudinal design supports sequence modeling. Transforming conversational data into timeseries sequences anchored with session feedback allows researchers to train Recurrent Neural Networks (RNNs) or Markov chain models to predict argumentative trajectories. These models calculate how dialogue strategies associate with the stability of user convictions. The psychometric
variables permit Structural Equation Modeling (SEM) to test whether NLP features mediate the
relationship between baseline traits and persuasion outcomes.

### **Data Availability**


The Talk2AI dataset is publicly available in the GitHub repository at `https://github.com/Mas`
`simoStel/Talk2AI/tree/main/Data_paper` . The repository provides a primary `Data_files.zip`
archive containing the JSON datasets ( `talk2ai_registries.json`, `talk2ai_psyscales.json`,
and `talk2ai_conversations.json` ). Additionally, a `translations` directory is provided, containing the conversation logs computationally translated from the original Italian into English,
Spanish, Dutch, German, Portuguese, and French.

### **Code Availability**


The computational logic used to derive the final cohort is documented in the `talk2ai_1_1_`
`data_extraction.ipynb` Jupyter notebook, available within the GitHub repository ( `https:`
`//github.com/MassimoStel/Talk2AI/tree/main/Data_paper` ). This script outlines the steps
taken in Python to filter the initial sample of 2,644 registered participants down to the 770 users
who met the quality control and longitudinal completion criteria. Exploratory factor analysis, and


14


confirmatory factor analysis for technical validation were conducted using the `lavaan` and `psych`
packages in R, as presented in the `talk2ai_2_2_psychometric_FA.ipynb` file. Longitudinal
measurement invariance and structural equation modeling can be accessed in `talk2ai_2_3_long`
`itudinal_analysis.ipynb` .

### **References**


[1] Matz, S. C. _et_ _al._ The potential of generative ai for personalized persuasion at scale. _Scientific_
_Reports_ **14**, 4692 (2024).


[2] Carrasco-Farre, C. Large language models are as persuasive as humans, but how? about
the cognitive effort and moral-emotional language of llm arguments. _arXiv_ _preprint_
_arXiv:2404.09329_ (2024).


[3] Bai, H., Voelkel, J. G., Muldowney, S., Eichstaedt, J. C. & Willer, R. Llm-generated messages
can persuade humans on policy issues. _Nature_ _Communications_ **16**, 6037 (2025).


[4] Goldstein, J. A., Chao, J., Grossman, S., Stamos, A. & Tomz, M. How persuasive is aigenerated propaganda? _PNAS_ _nexus_ **3**, pgae034 (2024).


[5] Salvi, F., Horta Ribeiro, M., Gallotti, R. & West, R. On the conversational persuasiveness of
gpt-4. _Nature_ _Human_ _Behaviour_ 1–9 (2025).


[6] Argyle, L. P. _et_ _al._ Leveraging ai for democratic discourse: Chat interventions can improve
online political conversations at scale. _Proceedings_ _of_ _the_ _National_ _Academy_ _of_ _Sciences_ **120**,
e2311627120 (2023).


[7] Simchon, A., Edwards, M. & Lewandowsky, S. The persuasive effects of political microtargeting
in the age of generative artificial intelligence. _PNAS_ _nexus_ **3**, pgae035 (2024).


[8] Hackenburg, K. _et_ _al._ The levers of political persuasion with conversational ai. _arXiv_ _preprint_
_arXiv:2507.13919_ (2025).


[9] Rossetti, G. _et_ _al._ Y social: an llm-powered social media digital twin. _arXiv_ _preprint_
_arXiv:2408.00818_ (2024).


[10] Argyle, L. P. _et_ _al._ Testing theories of political persuasion using ai. _Proceedings_ _of_ _the_ _National_
_Academy_ _of_ _Sciences_ **122**, e2412815122 (2025).


[11] Watson, J., Valsesia, F. & Segal, S. Assessing AI receptivity through a persuasion knowledge
lens. _Current_ _Opinion_ _in_ _Psychology_ **58**, 101834 (2024).


[12] Huang, G. & Wang, S. Is artificial intelligence more persuasive than humans? a meta-analysis.
_Journal_ _of_ _Communication_ **73**, 552–562 (2023).


[13] Brady, O., Nulty, P., Zhang, L., Ward, T. E. & McGovern, D. P. Dual-process theory and
decision-making in large language models. _Nature_ _Reviews_ _Psychology_ 1–16 (2025).


[14] Blankenship, K. L., Machacek, M. G. & Standefer, J. Resistance strategies and attitude
certainty in persuasion: bolstering vs. counterarguing. _Frontiers_ _in_ _Psychology_ **14**, 1191293
(2023).


15


[15] OpenAI _et_ _al._ Gpt-4o system card (2024). URL `https://arxiv.org/abs/2410.21276` .
`2410.21276` .


[16] Anthropic. Claude 3.7 sonnet system card. Tech. Rep., Anthropic (2025). URL `https:`
`//www-cdn.anthropic.com/9ff93dfa8f445c932415d335c88852ef47f1201e.pdf` . Accessed:
2025-02-24.


[17] Liu, A. _et_ _al._ Deepseek-v3 technical report. _arXiv_ _preprint_ _arXiv:2412.19437_ (2024).


[18] Mistral AI. Mistral large: Our new flagship model. Mistral AI Blog (2024). URL `https:`
`//mistral.ai/news/mistral-large` . Accessed: 2025-02-24.


[19] Adler, N. E., Epel, E. S., Castellazzo, G. & Ickovics, J. R. Relationship of subjective and
objective social status with psychological and physiological functioning: Preliminary data in
healthy, white women. _Health_ _Psychology_ **19**, 586–592 (2000). URL `https://doi.org/10.1`
`037/0278-6133.19.6.586` .


[20] Duro, E. S. D., Veltri, G. A., Golino, H. & Stella, M. Measuring and identifying factors of
individuals’ trust in large language models (2025). URL `https://arxiv.org/abs/2502.210`
`28` . `2502.21028` .


[21] de Holanda Coelho, G. L., Hanel, P. H. P. & Wolf, L. J. The very efficient assessment of
need for cognition: Developing a six-item version*. _Assessment_ **27**, 1870–1885 (2020). URL
`https://doi.org/10.1177/1073191118793208` . PMID: 30095000, `https://doi.org/10.1`
`177/1073191118793208` .


[22] Rammstedt, B. & John, O. P. Measuring personality in one minute or less: A 10-item short
version of the big five inventory in english and german. _Journal_ _of_ _Research_ _in_ _Personality_
**41**, 203–212 (2007). URL `https://www.sciencedirect.com/science/article/pii/S00926`
`56606000195` .


[23] Cartwright, E. & Thompson, A. Using dictator game experiments to learn about charitable
giving. _VOLUNTAS:_ _International_ _Journal_ _of_ _Voluntary_ _and_ _Nonprofit_ _Organizations_ **34**,
185–191 (2023). URL `https://doi.org/10.1007/s11266-022-00490-7` .

### **Acknowledgements**


The authors acknowledge Salvatore Citraro for preparing the CSV files for the data translations.

### **Author Contributions**


M.S. and G.A.V. conceptualized the study, developed the theoretical framework, designed the
methodology, and acquired the funding. M.S. acted as the principal investigator, providing resources and overall supervision with support from G.A.V. E.T. developed the custom experimental
software platform and executed the data gathering and data curation processes. A.C. and M.S. conducted the formal data and psychometric analyses. A.C., A.A.A. and M.S. drafted the manuscript.
All authors reviewed, edited, and approved the final manuscript.


16


### **Competing Interests**

The authors declare no competing interests.

### **Funding**


The authors acknowledge support from the following grants: Call for Research Grant 2023 funded
by University of Trento (ID: PS 22_27, A.C., E.T., G.A.V. and M.S.); CALCOLO project funded
by Fondazione VRT (M.S.); FIS project funded by Ministero dell’Università e della Ricerca, D.D.N.
23178, 10/12/2024, BANDO FIS2, ID: FIS-2023-02086 (M.S.).


17


