# Scaffolding Human–AI Collaboration: A Field Experiment on Behavioral Protocols and Cognitive Reframing

#### Alex Farach [∗] Alexia Cambon Lev Tankelevitch Connie Hsueh Rebecca Janssen

Microsoft Corporation

#### March 2026


**Abstract**


Organizations have widely deployed generative AI tools, yet productivity gains re

main uneven, suggesting that _how_ people use AI matters as much as whether they have


access. We conducted a field experiment with 388 employees at a Fortune 500 retailer to


test two scaffolding interventions for human–AI collaboration. All participants had ac

cess to the same AI tool; we varied only the structure surrounding its use. A behavioral


scaffolding intervention (a structured protocol requiring joint AI use within pairs) was


associated with lower document quality relative to unstructured use and substantially


lower document production. A cognitive scaffolding intervention (partnership training


that reframed AI as a thought partner) was associated with higher individual docu

ment quality at the top of the distribution. Treatment participants also showed greater


positive belief change across the session, though sensitivity analyses suggest this likely


∗Corresponding author. Microsoft Corporation. Email: `alexfarach@microsoft.com`


1


reflects recovery from carry-over effects rather than genuine training-induced shifts.


Both findings are subject to design limitations including an AM/PM session confound,


differential attrition, and LLM grading sensitivity to document length.


**Keywords:** generative AI, human–AI collaboration, organizational adoption, field


experiment, scaffolding


2


### **1 Introduction**

#### **1.1 The AI Integration Challenge**

Generative AI tools are now available to most knowledge workers, yet organizations report


uneven adoption and uncertain returns on AI investments (Brynjolfsson et al., 2025). Unlike


previous enterprise technology where access was the primary barrier, the bottleneck appears


to have shifted from technical availability to human integration, meaning how people actually


incorporate AI into their work processes.


Early field evidence reveals substantial heterogeneity in productivity effects. Noy and


Zhang (2023) find that AI assistance improves writing task completion time by 40% on


average, but with considerable variance across workers. Dell’Acqua et al. (2026) demonstrate


that AI can improve consultant performance within the “jagged technological frontier” of


tasks where AI is capable, but harms performance when applied beyond AI’s competence.


Workers struggle to identify which tasks fall within this frontier, suggesting that effective AI


use requires not just access but judgment about when and how to deploy AI assistance.


This suggests a central question for organizational research: if access is no longer the


bottleneck, what interventions help people use AI more effectively?

#### **1.2 Two Approaches to Scaffolding AI Use**


We distinguish two forms of intervention (behavioral scaffolding and cognitive scaffolding)


drawing on the educational concept of scaffolding as temporary support that enables perfor

mance beyond independent capability (Vygotsky, 1978; Wood et al., 1976).


**Behavioral** **scaffolding** refers to explicit protocols that structure how humans interact


with AI systems. Drawing on socio-technical systems theory (Trist and Bamforth, 1951;


Orlikowski, 1992), we reason that without explicit guidance, users may default to famil

iar, low-risk interaction patterns, treating AI as an advanced search engine rather than


integrating it into collaborative work (Jasperson et al., 2005). As algorithms have become


3


more embedded in organizational workflows, they have reshaped expertise boundaries and


introduced new forms of control over worker behavior (Faraj et al., 2018; Kellogg et al.,


2020). Behavioral scaffolds create structural conditions for more sophisticated interaction,


particularly in team settings where AI mediates human-to-human collaboration.


**Cognitive** **scaffolding** refers to interventions that reshape users’ mental models of AI.


Building on research on technology frames (Orlikowski and Gash, 1994), we propose that


users’ implicit beliefs about AI (whether it is a “tool” to be operated or a “collaborator”


to engage with) may shape their interaction patterns. Cadario et al. (2021) demonstrate


across five experiments that brief cognitive reframing interventions can shift AI utilization,


and Lebovitz et al. (2022) find that only professionals who developed “engaged augmenta

tion” practices (actively interrogating AI outputs rather than passively accepting or rejecting


them) realized the benefits of AI integration. Cognitive scaffolds aim to shift users from a


transactional mental model (query-response, one-shot) to a dialogic one (iterative, conversa

tional). This distinction parallels the theoretical tension between structural and interpretive


approaches to technology adoption (DeSanctis and Poole, 1994; Weick, 1990).

#### **1.3 Human–AI Collaboration Beyond the Individual**


Most research on AI productivity focuses on individual human–AI interaction. Yet knowledge


work is fundamentally collaborative, with outcomes depending on collective intelligence—a


group’s ability to solve problems through distributed cognition (Woolley, 2025). A recent


meta-analysis of 106 studies finds that human–AI combinations actually perform _worse_ than


the best of humans or AI alone on average, though content creation tasks are a notable ex

ception where combinations show gains (Vaccaro et al., 2024). Dell’Acqua et al. (2025), in a


field experiment at Procter & Gamble, found that teams working with AI achieved the high

est performance, suggesting AI and human collaboration can be additive. However, Schmutz


et al. (2024) find that adding AI to teams often reduces coordination, communication, and


trust, which implies that simply inserting AI into collaborative workflows without addressing


4


team dynamics may undermine performance. Doshi and Hauser (2024) find that AI assis

tance improves individual creative output but homogenizes collective output, reducing the


diversity of ideas across a group.


These findings motivate our behavioral scaffolding intervention: a structured protocol


designed to maintain human-to-human connection while integrating AI as a shared tool,


rather than allowing each team member to use AI individually and then merge outputs.

#### **1.4 Present Study**


We report findings from a field experiment with 388 employees at Gap Inc., a Fortune 500


retailer. The experiment tested two interventions within a single day:


 - **Task** **A** (pair-level): A structured “Create-Out-Loud” collaborative protocol requiring


joint AI use, compared against naturalistic AI use where pairs worked however they


chose.


 - **Task** **B** (individual-level): Partnership training reframing AI as a “thought partner,”


compared against standard technical training on AI features.


Pairs were randomized into two bundled arms: the control arm completed Task A with


naturalistic AI use and Task B with basic Copilot training, while the treatment arm com

pleted Task A with the structured protocol and Task B with partnership training. Both


arms had full access to Microsoft Copilot. The study tests how people use AI, not whether


they have it. Outcomes include LLM-graded document quality, self-reported experience,


and belief change measured across the session. We assess all primary outcomes using OLS


regression with robust standard errors.


5


Figure 1: Experimental design. Treatment participants completed Task A using the CreateOut-Loud collaborative protocol and Task B with partnership (thought partner) training.
Control participants completed Task A with naturalistic AI use and Task B with standard
tool training. Both conditions had identical access to Microsoft Copilot.


6


### **2 Background and Related Work**

#### **2.1 Generative AI in Organizations**

The deployment of large language models in enterprise contexts represents a notable change


in organizational technology. Unlike previous waves of enterprise software requiring sub

stantial infrastructure and training, GenAI tools can be deployed rapidly with minimal


onboarding. Surveys indicated that over 70% of knowledge workers had access to GenAI


tools, yet only 20–30% reported regular productive use (Microsoft, 2024).


The heterogeneity in adoption patterns indicates that individual and organizational fac

tors beyond access determine whether AI tools translate to productivity gains. Brynjolfsson


et al. (2025) find that AI assistance is most beneficial for less-experienced workers, while


Dell’Acqua et al. (2026) show that performance depends critically on task–AI alignment.


These findings point to the need for structured interventions that help workers navigate the


complexities of AI integration.

#### **2.2 Scaffolding Theory**


The concept of scaffolding originates in developmental psychology (Vygotsky, 1978; Wood


et al., 1976) and has been extended to organizational technology adoption. Edmondson


et al. (2001) demonstrate that surgical teams adopt new technology more effectively when


psychological safety scaffolds enable learning from errors. Leonardi (2011) shows that tech

nology affordances are realized only when organizational routines scaffold appropriate usage


patterns. Both studies highlight that adoption requires alignment between organizational


context and technology demands.


We extend this tradition by distinguishing behavioral scaffolds (structural constraints


on interaction patterns) from cognitive scaffolds (interventions targeting mental models).


This distinction allows us to test whether different scaffold types have differential effects


depending on task structure.


7


#### **2.3 A Framework for Scaffold Effectiveness**

The distinction between behavioral and cognitive scaffolding generates differential predic

tions depending on task and organizational conditions.


**Behavioral** **scaffolding** imposes coordination costs ( _C_ )—synchronization overhead,


communication latency, protocol compliance effort—while potentially generating knowledge


aggregation benefits ( _B_ ) through structured information sharing. The net effect depends


on _B_ _−_ _C_ . Agrawal et al. (2024) formalize a related tension: AI increases decision varia

tion, which creates coordination challenges when decisions interact across an organization;


coordination mechanisms can facilitate adoption but impose their own costs. We expect


behavioral scaffolds to improve outcomes when: (a) partners possess complementary in

formation that structured exchange can surface, (b) the coordination infrastructure is reli

able, and (c) the task requires integration across perspectives rather than individual genera

tion. Conversely, we expect behavioral scaffolds to harm outcomes when coordination costs


dominate—particularly when infrastructure is unreliable, the task rewards domain-specific


depth over breadth, or the AI mediator lacks access to the organizational context needed to


synthesize inputs effectively.


**Cognitive** **scaffolding** shifts users’ mental models from transactional (query-response,


one-shot) to dialogic (iterative, conversational). The net effect depends on whether dialogic


interaction is more productive for the task. We expect cognitive scaffolds to improve out

comes when: (a) the task benefits from iterative refinement, (b) users’ default interaction


pattern under-utilizes AI capabilities, and (c) the shift toward dialogue does not impose


excessive cognitive load. Cognitive scaffolds require no coordination infrastructure, making


them less affected by the organizational frictions that can undermine behavioral approaches.


These considerations suggest that the two scaffold types should have different effect


profiles depending on task conditions. Behavioral scaffolds are sensitive to coordination


infrastructure and compliance. Cognitive scaffolds operate through individual mental-model


shifts and are less dependent on organizational context. We return to this framework when


8


interpreting our results in Section 5.4.

#### **2.4 Mental Models and Technology Appropriation**


How users conceptualize a technology shapes how they interact with it. Orlikowski and


Gash (1994) introduce “technological frames” to describe assumptions and expectations users


bring to technology interaction. For generative AI, users may view it as a deterministic tool


(expecting reliable, consistent output under their control) or as a probabilistic collaborator


(expecting variability and treating outputs as starting points for refinement). This distinction


matters because it predicts how users respond to GenAI’s inherent variability. Whether users


resist or embrace algorithmic judgment depends on framing and experience: people reject


algorithms after observing errors (Dietvorst et al., 2015) but prefer algorithmic advice over


human advice when no errors are salient (Logg et al., 2019). Our cognitive scaffolding


intervention explicitly targets this frame by coaching users to treat AI as an intellectual


partner requiring context, iteration, and feedback.

### **3 Method**

#### **3.1 Participants**


A total of 388 employees from Gap Inc. participated, organized into 194 pairs (97 per condi

tion). Participants registered for a scheduled “AI Training Day” event; research participation


was part of the event protocol, and all participants provided informed consent. Selection


criteria required full-time employees with access to Microsoft Copilot licenses. Contractors,


temporary employees, and research assistants were excluded.


Participants completed a baseline survey capturing demographics, organizational role,


tenure, prior AI experience, and participation mode (in-person, remote, or hybrid). Pairs


were formed using constrained matching on functional area (coarsened into six categories;


see below), baseline AI comfort (Low/Medium/High on a 5-point scale), job level (Individ

9


ual Contributor, Manager/Senior Manager, Director+), and participation mode (remote or


hybrid). When an exact within-category match for functional area was not possible, cross

function pairs were permitted; in such cases, the pair selected one functional area by mutual


agreement for the Task A prompt.


Table 1: Participant Characteristics ( _N_ = 388)


Characteristic _N_ (%)


**Functional** **area**
Supply Chain, Operations, Strategy & Governance 70 (18%)
Stores, Customer Experience, Marketing & Communications 85 (22%)
Product, Merchandising, Design & Development 58 (15%)
People, Culture & Workplace 47 (12%)
Digital, Data & Technology 82 (21%)
Finance, Legal & Risk 46 (12%)


**Job** **Level**
Individual Contributor 163 (42%)
Manager / Senior Manager 147 (38%)
Director / Senior Director+ 78 (20%)


_Note:_ Functional areas were coarsened into six categories to ensure partners shared functional
context during pairing.

#### **3.2 Design**


The experiment used a pair-level randomized design. Pairs were randomized into treat

ment and control using stratified randomization within each functional area stratum, with


constrained balance on AI comfort and job level. The AM session served as the Control


condition and the PM session as the Treatment condition—a design constraint discussed as


a limitation below (see Section 5.5).


Both sessions included two sequential tasks designed to be as relevant as possible for


participants’ work:


**Task** **A** **(Pair** **Task):** Pairs produced a one-page “AI Adoption Action Plan” tailored to


their organizational function within a 30-minute time cap. To prevent generic outputs, the


task imposed an “anti-generic” constraint: every item required either a specific noun (e.g.,


10


a named system, dataset, or stakeholder) or a quantitative metric. Each pair produced a


single shared document.


**Task** **B** **(Individual** **Task):** Each participant independently developed a strategic com

munications response addressing three stakeholder concerns about AI adoption at Gap Inc.:


(a) data transparency and privacy, (b) labor displacement, and (c) environmental consider

ations related to AI energy footprint.

#### **3.3 Conditions**


**Control** **Condition** **(Naturalistic** **AI** **Use** **+** **Basic** **Training):** Pairs completed Task A


using their standard working methods. They were permitted to collaborate and use Microsoft


Copilot individually, but no specific workflow was enforced. For Task B, individuals received


standard functional training on Copilot’s interface, capabilities, and basic prompt syntax,


treating AI as a software tool requiring correct operation.


**Treatment** **Condition** **(Structured** **Protocol** **+** **Partnership** **Training):** For Task


A, pairs followed a structured “Create-Out-Loud” protocol with three sequential steps: (1)


meet synchronously via Microsoft Teams, (2) verbally discuss the strategic plan, generating


a conversation transcript, and (3) explicitly prompt Microsoft Copilot to draft the initial


document based on the transcript (“Copilot-as-Drafter”). For Task B, individuals received


partnership training (adapted from the “AI Mindset” curriculum developed by Conor Gren

nan; see Appendix 13 for curriculum details) designed to challenge the “search engine” mental


model, introduce the “thought partner” mental model, use the “smart intern” metaphor, and


include guided practice in iterative prompting.

#### **3.4 Measures**


**Document** **Quality** **(Primary).** Documents were graded using GPT-4o-mini (OpenAI,


temperature = 0) with structured JSON output, following the LLM-as-judge paradigm


(Zheng et al., 2023). Each document was graded three times independently; the median


11


score was used. Task A used a four-dimension rubric: Opportunities Identified (0–6), Risks


Identified (0–6), Action Plan Quality (1–5), and Strategic Insight (1–5), for a maximum of


22 points. Task B used: Problem Understanding (1–5), Internal Strategy (1–5), External


Strategy (1–5), and Completeness (1–5), for a maximum of 20 points. Full rubrics with


behaviorally anchored examples are in Appendix 9.


Cross-model validation on a random sample of 176 documents graded by both GPT-4o

mini and GPT-4o yielded: Pearson _r_ = 0 _._ 92, ICC(2,1) = 0 _._ 92, mean absolute difference


= 1 _._ 81 points (after correcting cases where the model’s reported total did not match the


sum of its individual dimension scores; all analyses use dimension sums as the authoritative


total). The systematic bias was 0.34 points (GPT-4o-mini slightly higher), consistent across


the score range.


**Human** **Validation.** A stratified sample of 96 documents (48 Task A, 48 Task B) was


independently graded by 8 trained human raters organized in 4 pairs, with each pair grading


the same 24 documents. Raters were blinded to condition assignment and LLM scores.


Inter-rater reliability and LLM–human agreement results are reported in Section 4.5 and


Appendix 10.


**Self-Reported** **Experience.** Post-Task A surveys assessed perceived productivity and


flow (4 items: productive/efficient, smooth collaboration, confident in output quality, mo

tivated to complete; Cronbach’s _α_ = 0 _._ 84, a measure of internal consistency reliability),


perceived Copilot helpfulness (6 items; _α_ = 0 _._ 87), and future AI intent (3 items; _α_ = 0 _._ 79).


Post-Task B surveys used adapted versions of the same scales: task experience (5 items;


the two team-specific items were replaced with individual-task items), Copilot helpfulness (5


items; the collaboration item was dropped since Task B was individual), and future AI intent


(3 items, identical). All items used 5-point Likert scales. Full item text is in Appendix 8.


**Belief** **Inventories.** Identical inventories at two time points (post-Task A/pre-Task B


and post-Task B) measured three constructs: AI as Thought Partner (3 items, ordinal _α_ =


0 _._ 86–0 _._ 90), Exploration & Experimentation (3 items, ordinal _α_ = 0 _._ 93), and Productivity &


12


Process (3 items, ordinal _α_ = 0 _._ 89–0 _._ 90). All items used 5-point Likert scales. Because no


belief inventory was administered before Task A, the first measurement reflects beliefs after


participants had already experienced their assigned Task A condition.

#### **3.5 Analytic Strategy**


All primary analyses use intent-to-treat (ITT) comparisons preserving the original random

ization. Task A document quality is analyzed at the pair level using OLS with HC2 robust


standard errors (since each pair produced one document, pair-level clustering is equivalent


to heteroskedasticity-robust inference). Task B document quality is analyzed at the individ

ual level using OLS with CR2 clustered standard errors at the pair level (Pustejovsky and


Tipton, 2018), accounting for within-pair correlation (ICC = 0 _._ 14, design effect = 1 _._ 05, ef

fective _N_ = 200 from 210 observations in 155 clusters). Survey outcomes are individual-level


responses (each participant completed their own survey, including for the pair task) and use


the same CR2 approach.


Belief change is assessed using two specifications. The change-score specification regresses


the within-person change from post-Task A to post-Task B beliefs on treatment assignment


with covariates and CR2 clustered standard errors at the pair level. The ANCOVA specifi

cation regresses post-Task B beliefs on treatment assignment, post-Task A beliefs, and co

variates. Both specifications use the same two belief measurements; they differ in functional


form. Because the first measurement was collected after Task A (not before randomization),


both baselines are post-treatment, and the change-score model captures belief movement


during and after Task B, including any recovery from Task A carry-over effects. Multiple


comparisons are addressed using Benjamini–Hochberg correction within three outcome fam

ilies: Survey ITT (3 outcomes), Grading ITT (2 outcomes), and Belief Change (4 outcomes:


three subscales plus an overall composite).


Compliance group analyses are reported as exploratory and descriptive. During the


experiment, many treatment pairs faced logistical and technical barriers to executing the


13


Create-Out-Loud protocol: some could not connect synchronously, others met but defaulted


to individual AI use. To characterize this variation, we constructed a post-hoc compliance


classification based on self-reported meeting behavior and Copilot usage patterns. Treatment


participants were classified as: _Stranded_ (could not meet synchronously; _N_ = 77), _Parallel_


_Play_ (met but did not use Copilot jointly; _N_ = 51), or _True_ _Joint_ (met and used Copilot


jointly as intended; _N_ = 37). [1]


These classifications reflect post-randomization selection; we report estimated marginal


means with 95% confidence intervals but do not report _p_ -values for compliance group com

parisons.


**Attrition** **Sensitivity.** Because document production was differential by condition (see


Section 4.1), we compute Lee (2009) trimming bounds to characterize the identified set for


the ITT estimand under worst-case selection (Lee, 2009). Under a monotonicity assumption,


this procedure trims the observed outcome distribution in the higher-response group from its


tails, yielding upper and lower bounds on the treatment effect that are consistent with any


pattern of selective attrition. We also model non-production itself as a treatment outcome—


logistic regression of document production on treatment assignment—treating attrition as


an effect on the extensive margin rather than a nuisance condition.


**Word-Count** **Sensitivity.** We report the Oster (2019) coefficient stability bound ( _δ_ )


and a causal mediation model (Imai et al., 2010) decomposing the total treatment effect into


the indirect path through word count (ACME) and the direct path not through word count


(ADE), with bootstrap confidence intervals.


**Session-Effect Sensitivity.** Because treatment and session timing are confounded (AM


= Control, PM = Treatment), we report a calibration exercise comparing the observed


treatment effect size against the range of circadian performance effects documented in the


cognitive psychology literature (Monk, 2005; Blatter and Cajochen, 2007; Valdez et al., 2014).


1These counts sum to 165 rather than 194 because compliance classification was based on post-task
survey responses. Twenty-nine treatment participants (14.9%) did not complete the compliance items, so
their compliance status could not be determined.


14


We compute the residual treatment effect under a range of assumed session-effect magnitudes


and report the breakeven point.


This study was not pre-registered. Covariates were pre-specified based on theoretical


relevance (Lin, 2013). Appendix 12 provides a transparency table distinguishing pre-specified


from post-hoc analytical decisions.


Post-task surveys were completed by 370 of 388 participants (95.4%). Of these, 270 (73%)


were linked to pair IDs. All survey and belief-change analyses use this linked subset ( _N_ =


270), because CR2 clustering requires pair membership. The 27% unlinked were balanced


on treatment status (Fisher exact _p_ = _._ 638, logistic regression OR = 0 _._ 875, _p_ = _._ 571) and


covariates (all _p > ._ 22).

### **4 Results**

#### **4.1 Balance and Manipulation Checks**


Randomization balanced baseline characteristics across conditions. No significant differences


emerged in functional area distribution, job level, AI experience categories, baseline AI


comfort, or organizational tenure (all _p > ._ 40).


**Differential** **Attrition.** Although baseline characteristics were balanced, document


production was not. Attrition from the randomized sample to the analysis sample differed


significantly by condition:


Table 2: Differential Attrition by Task and Condition


Task Ctrl: Rand _→_ Prod Trt: Rand _→_ Prod Ctrl % Trt % Fisher _p_ OR


Task A (pairs) 97 _→_ 93 97 _→_ 71 4.1 26.8 _< ._ 001 8.43
Task B (indiv.) 194 _→_ 123 194 _→_ 87 36.6 55.2 _< ._ 001 2.13


Non-production was high even among controls (37% for Task B) reflecting a mix of


participant attrition from the event and non-submission among those who stayed. Task B


was the final exercise of a full-day training event with some participants leaving before or


15


during the task, while others remained but did not submit a document within the allotted


time. The _differential_ attrition between conditions is the identification concern. For Task A,


treatment pairs were over 8 times more likely to fail to produce a document, likely because


the coordination requirements of the Create-Out-Loud protocol made it harder to complete


work within the allotted time. For Task B, attrition was significantly higher in the treatment


condition (55% vs. 37%), though the mechanism is less clear. Treatment participants had


just completed the more demanding Task A protocol, and fatigue or frustration from that


experience may have carried over. We address this differential attrition formally using Lee


(2009) trimming bounds in Section 4.2.

#### **4.2 Task A: Document Quality (Pair-Level)**


In Task A, pairs collaboratively produced an AI Adoption Action Plan for their organizational


function. Treatment pairs followed the Create-Out-Loud protocol (synchronous discussion,


then joint AI drafting); control pairs used Copilot however they chose.


**ITT** **Analysis.** Treatment pairs, instructed to work jointly with AI, scored significantly


lower than control pairs, which worked without any enforced workflow:


Table 3: Task A Document Quality by Condition


_N_ (pairs) Mean SD


Control (AM) 93 15.63 5.92
Treatment (PM) 71 10.68 6.34
**Difference** _−_ **4.96**


OLS with HC2 robust standard errors: _b_ = _−_ 4 _._ 958, SE = 0 _._ 888, 95% CI [ _−_ 6 _._ 71 _, −_ 3 _._ 20],


_p_ _<_ _._ 001, _|d|_ = 0 _._ 81. The effect survives Benjamini–Hochberg correction (BH-adjusted


_p_ = 1 _._ 97 _×_ 10 _[−]_ [7] ).


The estimated treatment difference was uniform across all four rubric dimensions:


Control pairs also produced more document versions (3.28 vs. 2.44 mean versions) and


longer documents (740 vs. 454 mean words).


16


Table 4: Task A Treatment Effects by Rubric Dimension


Dimension (scale) Control Mean Treatment Mean Difference


Opportunities (0–6) 4.57 2.99 _−_ 1.58
Risks (0–6) 4.06 2.48 _−_ 1.58
Action Plan (1–5) 3.59 2.69 _−_ 0.90
Insight (1–5) 3.41 2.52 _−_ 0.89


**Lee** **Bounds.** Given severe differential attrition (4.1% control vs. 26.8% treatment), we


computed Lee (2009) trimming bounds by trimming 23.7% of control observations from the


tails of the control outcome distribution:


Table 5: Lee (2009) Trimming Bounds: Task A


Bound Estimate Bootstrap 95% CI


Lower (most conservative) _−_ 7.01 [ _−_ 8.70, _−_ 5.46]
Point estimate (naive ITT) _−_ 4.96        Upper (least conservative) _−_ 3.34 [ _−_ 5.24, _−_ 1.62]


Both bounds are negative and statistically significant. The sign and significance of the


treatment effect are robust to worst-case selective attrition.


**Non-production** **as** **outcome.** Modeling document production itself as a treatment


outcome on the full randomized sample: treatment pairs were significantly less likely to


produce a document (odds ratio [OR] = 0 _._ 12, 95% CI [0 _._ 04 _,_ 0 _._ 35], _p_ _<_ _._ 001). An OR


below 1 indicates lower odds of the outcome in the treatment group; here, treatment pairs


had roughly one-eighth the odds of producing a document compared to control pairs. The


structured protocol appears to have created barriers to task completion, an effect on the


extensive margin that accompanies the intensive-margin quality difference.


**Word-Count Sensitivity.** The LLM grader exhibits strong word-count bias: Spearman


_ρ_ = 0 _._ 646 between total score and document word count for Task A. When word count is


added as a covariate, the treatment effect reduces from _−_ 4 _._ 96 to _−_ 3 _._ 34, a 33% reduction.


The Oster (2019) coefficient stability bound: _δ_ = 3 _._ 67 under the recommended _R_ max [2] [=]


1 _._ 3 _× R_ controlled [2] [,] [and] _[δ]_ [= 0] _[.]_ [65] [under] _[R]_ max [2] [= 1.] [The] _[δ]_ [= 3] _[.]_ [67] [under] [the] [standard] [assumption]


17


indicates that unobservable confounding would need to be nearly four times as important as


the observed word-count confound to explain the entire treatment effect. However, _δ_ = 0 _._ 65


under the most conservative assumption ( _R_ max [2] [=] [1)] [falls] [below] [1,] [meaning] [that] [if] [the] [true]


_R_ [2] of a fully specified model were close to 1, unobservables proportional to word count


could plausibly account for the effect. A formal causal mediation analysis (Imai et al., 2010)


estimated that 32.6% of the total effect operates through the word-count channel (ACME


= _−_ 1 _._ 61, 95% CI [ _−_ 2 _._ 59 _, −_ 0 _._ 80], _p < ._ 001), while the remaining direct effect is _−_ 3 _._ 34 (ADE,


95% CI [ _−_ 4 _._ 95 _, −_ 1 _._ 72]) and remains statistically significant.


**Session-Effect** **Sensitivity.** Because treatment and control conditions were assigned to


different sessions (AM = Control, PM = Treatment), the treatment effect estimate is con

founded with time-of-day. If afternoon participants were more fatigued or less motivated,


some or all of the observed difference could reflect session timing rather than the intervention


itself. We investigate how large such a session effect would need to be to fully account for


our findings. The observed Task A effect ( _|d|_ = 0 _._ 81) would require a pure session effect


of _d_ = 0 _._ 81 to be fully explained by PM fatigue—approximately 3 times larger than the


largest circadian performance decrements documented in the cognitive psychology literature


( _d ≈_ 0 _._ 20–0 _._ 30; Blatter and Cajochen, 2007; Valdez et al., 2014). Even under the most con

servative literature-calibrated assumption ( _d_ = 0 _._ 30), the residual treatment effect remains


statistically significant. Within the PM session, compliance subgroups show a 2.7-point


spread in mean scores, suggesting protocol-related variation beyond time-of-day. The Task


B result provides a partial falsification: treatment participants (also PM) outperformed


control (AM) on the binary outcome (OR = 2 _._ 07), contradicting a uniform session-effect


explanation (see Appendix 11.5 for the full sensitivity table).


**Compliance** **Patterns** **(Descriptive).** As described in Section 3.5, many treatment


pairs could not execute the Create-Out-Loud protocol as intended. Based on self-reported


meeting behavior and Copilot usage, treatment pairs were classified post-hoc as _True_ _Joint_


(met synchronously and used Copilot jointly), _Parallel_ _Play_ (met but used Copilot individ

18


ually), or _Stranded_ (could not meet synchronously). Among treatment pairs with available


compliance data, estimated marginal means by compliance group were:


Table 6: Task A Compliance Group Means (Descriptive)


Group _n_ Mean


Control 84 17.2
True Joint 22 12.5
Stranded 23 12.3
Parallel Play 17 9.8


_Note:_ Descriptive only;
compliance group membership reflects postrandomization selection.
Compliance data were
available for 146 of 164
pairs with documents.


All three treatment compliance subgroups scored below control, with a 2.7-point spread


within the treatment group (Parallel Play: 9.8 vs. True Joint: 12.5). This within-treatment


variation suggests that protocol execution, not just time of day, contributed to the outcome


pattern.


**Time-to-quality.** We examined version-level quality trajectories using document snap

shots captured at _T_ = 10, _T_ = 20, and _T_ = 30 minutes. Treatment pairs were half as likely


to reach the 70% quality threshold as controls (33.8% vs. 68.8%; Fisher exact _p_ _<_ _._ 0001),


though among those who reached it, the mean version was similar (3.08 vs. 3.12). The struc

tured protocol slowed not just final quality but also the rate at which quality accumulated.

#### **4.3 Task B: Document Quality (Individual-Level)**


In Task B, each participant independently developed a strategic communications response


addressing three stakeholder concerns about AI adoption. Treatment individuals received


partnership training reframing AI as a thought partner; control individuals received standard


Copilot training. The pre-specified primary outcome was continuous document quality.


19


**Continuous** **ITT** **Analysis.** Task B exhibited severe ceiling effects: 68.1% of all doc

uments scored 20/20 (the maximum). The task was more constrained than Task A (partic

ipants addressed three specific stakeholder concerns rather than generating an open-ended


strategy document) and with Copilot available, comprehensive responses could be produced


with relatively little iteration. The LLM grader’s leniency at the top of the scale likely


compounded the saturation.


Table 7: Task B Continuous Document Quality by Condition


_N_ Mean SD


Control (AM) 123 17.3 3.44
Treatment (PM) 87 18.1 3.60


OLS with CR2 clustered standard errors: _p_ = _._ 223. BH-adjusted _p_ = _._ 223. Treatment


participants scored slightly higher on average (18.1 vs. 17.3), but the difference was not sta

tistically significant. With the majority of scores concentrated at the ceiling, the continuous


model lacked the variance to detect treatment effects even if the intervention shifted the


probability of reaching the top of the distribution.


**Lee Bounds (Continuous).** Because attrition was differential (36.6% control vs. 55.2%


treatment), the continuous null could reflect selective survival rather than a true absence of


treatment effects. Lee bounds on the continuous ITT range from _−_ 1 _._ 58 to +1 _._ 90, spanning


zero, consistent with the null but not ruling out effects in either direction under worst-case


attrition.


**Binary Model.** When 68% of observations are at the ceiling, a continuous model cannot


detect differences in the probability of reaching the top. We estimated a binary logistic model:


did the participant produce a perfect-score document (20/20)?


The OR of 2.07 corresponds to a 15.2 percentage-point increase in the probability of


achieving a perfect score (from 61.8% to 77.0%), or a risk ratio of 1.25.


**Lee** **Bounds** **(Binary** _≥_ 20 **).** Given the positive binary result, we tested whether it


survives worst-case selective attrition. Lee bounds on the binary outcome range from _−_ 0 _._ 10


20


Table 8: Task B Binary Logistic Model: Threshold Sensitivity


Threshold Control Treatment OR CR2 95% CI CR2 _p_


Score = 20 61.8% (76/123) 77.0% (67/87) **2.07** [1.12, 3.83] **.022**
Score _≥_ 19    -    - **2.00** [1.08, 3.70] **.029**
Score _≥_ 18 64.2% (79/123) 77.0% (67/87) **1.87** [1.01, 3.45] **.049**
Score _≥_ 17    -    - 1.61 [0.87, 2.99] .131


to +0 _._ 31. The lower bound crosses zero, meaning the binary effect cannot be confirmed as


robust to worst-case attrition. This is an important caveat on the OR = 2 _._ 07 finding.


_Note_ _on_ _multiple_ _comparisons:_ The binary model is not included in the Grading ITT BH


family. If added to a 3-test family, the BH-adjusted _p_ would be .033, still below .05.


**Time-to-quality.** Task B showed no significant differences in time-to-quality: 89.7%


of treatment participants and 86.2% of controls reached the 70% threshold, with nearly


identical mean versions (2.36 vs. 2.39).

#### **4.4 Survey Outcomes**


Survey outcomes fall into two categories: post-task self-reports collected after Task A (ex

perience, Copilot helpfulness, and future AI use intent) and belief change measured between


the two post-task belief inventories (post-Task A and post-Task B). Task B collected adapted


versions of the same experience and helpfulness scales, but the primary survey outcome for


the cognitive scaffolding intervention is belief change, reported below.


**Self-Reported** **Experience** **(Post-Task** **A** **ITT).** No significant differences emerged


between treatment and control on Task A post-task survey outcomes:


Table 9: Post-Task A Survey ITT Results


Scale Ctrl Mean Trt Mean _d_ Raw _p_ BH _p_


Experience 3.38 3.50 0.14 .505 .757
Copilot Helpfulness 3.84 3.77 0.08 .254 .757
Future Use Likelihood 4.16 4.02 0.16 .797 .797


_Note:_ _p_ -values from covariate-adjusted OLS with CR2 clustered standard
errors; BH correction applied within the Survey ITT family.


21


**Belief** **Change** **(Pre-Post).** We assessed belief change using a difference-in-differences


approach. The overall belief composite showed a significant DiD interaction ( _p_ = _._ 023,


BH-adjusted _p_ = _._ 047).


As a robustness check, we estimated a cumulative link mixed model (CLMM; ordinal


logistic regression). The time _×_ group DiD interaction was significant: _β_ = 0 _._ 582, SE


= 0 _._ 153, _z_ = 3 _._ 81, _p < ._ 001, cumulative OR = 1 _._ 79, 95% CI [1 _._ 33 _,_ 2 _._ 41].


Table 10: Belief Change by Dimension (DiD Specification)


Dimension Trt ∆ Ctrl ∆ Raw _p_ BH _p_ _d_


Exploration & Experimentation +0.26 _−_ 0.02 .003 **.013** 0.41
Overall (composite)     -     - .023 **.047**     AI as Thought Partner +0.24 +0.08 .147 .150 0.34
Productivity & Process +0.17 +0.10 .150 .150 0.23


_Note:_ Raw _p_ -values from covariate-adjusted OLS on change scores with CR2
clustered standard errors. BH correction applied within the Belief Change
family (4 outcomes). Cohen’s _d_ values are signed: positive indicates greater
change in the treatment group.


Only Exploration & Experimentation survived BH correction at the individual subscale


level (BH _p_ = _._ 013). The overall belief composite also shifted significantly (BH _p_ = _._ 047),


driven primarily by the Exploration dimension. Post-hoc power analysis suggests the Pro

ductivity comparison was inadequately powered (achieved power = 0 _._ 35, requiring _N_ = 307


per group for 80% power at the observed effect size).


**Interpretive** **caveat** **and** **specification** **hierarchy.** Treatment participants entered


Task B with lower belief scores than control participants ( _d_ = 0 _._ 34, _p_ = _._ 008), reflecting a


carry-over effect from Task A friction. Because beliefs were first measured after Task A (not


before randomization), both specifications use a post-treatment baseline. The change-score


specification captures belief movement from post-Task A to post-Task B, which includes


both any recovery from the Task A depression and any genuine Task B training effect. This


is our primary specification.


The **ANCOVA** **specification** controls for post-Task A beliefs on treatment assignment


22


Exploration & Experimentation


AI as Thought Partner


Productivity & Process



**Treatment Effects on Belief Change by Dimension**
Positive values favor treatment; * = significant after BH correction (4−outcome family)


−0.2 0.0 0.2 0.4 0.6 0.8
Cohen's d (Treatment − Control)

n = 200 | Dashed line = no effect | Dotted lines = small (0.2) and medium (0.5) effect benchmarks



Figure 2: Treatment effects on belief change by dimension (Cohen’s _d_ ). Positive values
indicate greater belief change in the treatment group. Asterisks indicate significance after BH
correction within the 4-outcome Belief Change family. Only Exploration & Experimentation
survives correction (BH _p_ = _._ 013).


**Belief Trajectories by Training Condition**
Error bars show 95% confidence intervals

**Exploration & Experimentation** **AI as Thought Partner** **Productivity & Process**

4.8


4.6


4.4


4.2


4.0


3.8

Pre−Training Post−Training Pre−Training Post−Training Pre−Training Post−Training


Figure 3: Belief trajectories by training condition. Post-Task A and Post-Task B measurements shown. Error bars show 95% confidence intervals. Treatment participants start lower
due to carry-over from Task A friction but show steeper gains.


23


Treatment (AI Mindset)


Control (Basic Training)


Treatment (AI Mindset)


Control (Basic Training)


Treatment (AI Mindset)


Control (Basic Training)



**Distribution of Belief Change by Condition**
Density, box plots, and individual data points by dimension

**Exploration & Experimentation**


−2 0 2

**AI as Thought Partner**


−2 −1 0 1 2 3

**Productivity & Process**



−2 0 2

Belief Change (Post – Pre)


Figure 4: Distribution of belief change (Post-Task B – Post-Task A) by condition. Raincloud
plots show full distribution, box plots, and individual data points.


24


and post-Task A beliefs, adjusting for the level at which participants entered Task B. Because


the post-Task A baseline is itself post-treatment, conditioning on it risks collider bias (Angrist


and Pischke, 2009); we report it as a sensitivity check rather than a primary specification.


The ANCOVA was not significant for any dimension, which is informative: it suggests that


after adjusting for the depressed post-Task A starting point, the observed change-score effects


likely reflect recovery toward pre-intervention levels rather than genuine training-induced


belief shifts. This is consistent with the training transfer literature, where meta-analytic


evidence indicates that brief interventions often produce immediate attitudinal shifts that


decay without sustained reinforcement (Blume et al., 2010). We report both specifications


transparently.

#### **4.5 LLM Grading Integrity**


The LLM grader exhibited a systematic positive bias relative to human raters (+4 _._ 9 points;


ICC = 0 _._ 56), but rank ordering was preserved for Task A (Spearman _ρ_ = 0 _._ 79) and moderate


for Task B ( _ρ_ = 0 _._ 58). Crucially, the bias was symmetric across conditions (Task A: Wilcoxon


_p_ = _._ 18; Task B: _p_ = _._ 12), meaning treatment effect estimates are not distorted by differential


grading error. Human-human agreement was similarly modest (ICC = 0 _._ 47), suggesting


rubric ambiguity rather than LLM-specific failure. Full grading integrity results, including


determinism and score corrections, are in Appendix 10.

### **5 Discussion**

#### **5.1 Summary of Findings**


The experiment produced three principal findings:


1. **Mandating** **structured** **collaborative** **AI** **protocols** **was** **associated** **with** **lower**


**document** **quality** **among** **pairs** **that** **produced** **documents** (Task A: _b_ = _−_ 4 _._ 96,


25


_p_ _<_ _._ 001, confounded with time of day), **and** **with** **substantially** **lower** **docu-**


**ment** **production** (OR = 0 _._ 12). The Create-Out-Loud protocol was associated with


lower-scoring documents than allowing pairs to use AI however they naturally would.


This effect was uniform across rubric dimensions and partially attributable to the


LLM grader’s word-count sensitivity (33% reduction when controlling for length). The


quality analysis conditions on document production and thus estimates the intensive

margin effect; the full organizational cost includes both the quality difference and the


production shortfall.


2. **Partnership** **training** **was** **associated** **with** **higher** **odds** **of** **producing** **a** **top-**


**quality** **individual** **document** in an exploratory binary model (OR = 2 _._ 07, _p_ =


_._ 022, CR2 clustered SEs), though the pre-specified continuous ITT model was null


( _p_ = _._ 223). The binary threshold was chosen post-hoc in response to observed ceiling


saturation (Appendix 12). The effect was consistent across thresholds of 18–20 but


attenuated below 18.


3. **Partnership** **training** **was** **associated** **with** **greater** **positive** **change** **in** **explo-**


**ration** **beliefs** (BH-adjusted _p_ = _._ 013) and the overall belief composite (BH-adjusted


_p_ = _._ 047), though the AI as Thought Partner subscale did not reach significance after


correction (BH _p_ = _._ 150). The ANCOVA specification was not significant for any


dimension, suggesting that observed changes likely reflect recovery from the post-Task


A belief depression rather than genuine training-induced shifts.

#### **5.2 Interpreting the Task A Effect**


The Task A result requires careful interpretation given three considerations.


First, the LLM grader exhibits substantial word-count sensitivity ( _ρ_ = 0 _._ 65), and control


pairs wrote 63% longer documents (740 vs. 454 words). The grader may be penalizing


conciseness rather than detecting lower quality. Human validation confirmed a systematic


26


positive LLM calibration bias but found that treatment effect direction was preserved under


human scoring (Section 4.5).


Second, the protocol imposed real coordination costs. It required synchronous meetings,


verbal discussion, and sequential AI prompting, effort that control pairs could instead direct


toward content. The protocol positioned AI as the central drafter working from a conversa

tion transcript, but AI lacks access to participants’ organizational context. This pattern is


consistent with Kellogg et al. (2020) finding that algorithmic coordination mechanisms can


generate worker resistance when they restrict autonomy, and with meta-analytic evidence


that human–AI combinations underperform the best of humans or AI alone in most task


domains (Vaccaro et al., 2024).


Third, many treatment pairs could not execute the protocol at all. Of the 62 treatment


pairs with compliance data, 23 (37%) were classified as Stranded. The ITT estimate blends


the effect of the protocol itself with the cost of failed coordination.


The design confound between treatment and time of day (AM = Control, PM = Treat

ment) must also be acknowledged. However, comparisons within the treatment group pro

vide some leverage: the variation across compliance subgroups suggests the protocol itself


contributed to the outcome pattern.

#### **5.3 Task B: Ceiling Effects and the Binary Model**


The continuous null result on Task B ( _p_ = _._ 223) is difficult to interpret because the rubric


could not discriminate among the majority of participants. When 68% score 20/20, a linear


model lacks variance to detect treatment effects. The binary model estimates a statistically


significant association between training condition and document quality (OR = 2 _._ 07, 95% CI


[1 _._ 12 _,_ 3 _._ 83], _p_ = _._ 022). However, this finding should be interpreted cautiously: the continuous


model is null, the binary threshold was chosen post-hoc, and the effect is not robust below


score _≥_ 18, and differential attrition is an additional concern (see Section 5.5).


Human validation confirmed that human raters used a wider range of the scale. The


27


mean human score for Task B was 11.8 compared to the LLM’s 17.3, indicating that the


LLM’s generous scoring amplified the ceiling effect.

#### **5.4 Two Interventions in Two Contexts**


The Task A and Task B results should be read as two bounded operational lessons rather


than as evidence for a general scaffold taxonomy. The two interventions differ not only in


scaffold type (behavioral vs. cognitive) but also in unit of analysis (pair vs. individual), task


structure (open-ended vs. constrained), outcome saturation (no ceiling vs. severe ceiling),


attrition rates, and temporal sequencing. Attributing the pattern solely to the behavioral

vs.-cognitive distinction would be overinterpreting a confounded comparison. Task A speaks


to the risks of mandating synchronous AI-mediated protocols under infrastructure friction;


Task B speaks to the potential of partnership-style training for individual AI appropriation.


Each finding is bounded by its specific design features.


With that caveat, the framework from Section 2.3 helps organize the pattern of results:


**Behavioral** **scaffolding** was associated with lower output quality, consistent with coor

dination costs exceeding collaboration benefits. The framework suggests behavioral scaffold

ing should help when compliance is high and the task requires cross-perspective integration.


In our study, compliance was low (37% of treatment pairs were Stranded), infrastructure


was unreliable, and the task rewarded domain-specific depth—conditions under which the


framework anticipates net harm from imposed coordination.


**Cognitive** **scaffolding** showed a different pattern. The framework suggests cognitive


scaffolds should improve outcomes when users’ default interaction patterns under-utilize AI


capabilities. The continuous ITT was null ( _p_ = _._ 223), but the exploratory binary model


(OR = 2 _._ 07, _p_ = _._ 022) suggests a positive effect attenuated by ceiling saturation, consis

tent with cognitive reframing helping users reach the top of the quality distribution rather


than shifting the entire distribution. Treatment participants showed greater positive belief


change (Exploration BH _p_ = _._ 013), but the ANCOVA null for all dimensions suggests this


28


4.0


3.6


3.2


2.8



**Treatment Effect Heterogeneity by AI Experience**
Interaction not significant (CR2: F = 0.16, p = .855); visual pattern is noise


Newer Intermediate Experienced
AI Experience Level



Figure 5: Treatment effect heterogeneity by prior AI experience. The visual pattern of divergence at the “Experienced” level does not reach significance with CR2 clustered standard
errors (interaction _F_ = 0 _._ 16, _p_ = _._ 855).


reflects recovery from Task A carry-over rather than durable reframing. The belief results


are therefore consistent with this logic. Cognitive scaffolding may shift mental models but


the evidence for genuine training-induced change is not strong enough to confirm it.


One possible reading—that cognitive reframing may be more tractable than behavioral


mandates—should be treated as a hypothesis for future testing. This interpretation aligns


with Lebovitz et al.’s (2022) finding that “engaged augmentation” with AI emerged natu

rally in organizational units with the right cognitive orientation but could not be mandated


through structural interventions alone.


We examined treatment effect heterogeneity by prior AI experience. The visual pattern


of divergence at the “Experienced” level does not reach significance with CR2 clustered


standard errors (interaction _F_ = 0 _._ 16, _p_ = _._ 855).


29


#### **5.5 Limitations**

**Differential Attrition.** Treatment pairs were substantially less likely to produce documents


for both tasks, meaning the quality estimates condition on a selected sample. Lee trimming


bounds (reported in Section 4.2) confirm that the Task A quality effect survives worst-case


selective attrition, but the Task B binary effect cannot be distinguished from a selection


artifact.


**AM/PM** **Confound.** Treatment and control conditions were administered at different


times of day. The calibration exercise in Appendix 11.5 compares the observed effect against


circadian performance decrements ( _d ≈_ 0 _._ 20–0 _._ 30; Blatter and Cajochen, 2007; Valdez et al.,


2014), but the session-timing confound extends beyond circadian physiology. Operational


differences between AM and PM windows (IT infrastructure load, facilitator fatigue, room


logistics, or throughput constraints) could also differ systematically and are not captured by


the circadian calibration. We cannot fully rule out session-specific artifacts as a contributor


to the Task A result.


**Carry-Over** **Effects.** Participants experienced both tasks sequentially, and beliefs were


first measured only after Task A—not before randomization. Treatment participants who


experienced Task A friction entered Task B with depressed beliefs relative to control ( _d_ =


0 _._ 34, _p_ = _._ 008). The change-score results may therefore reflect recovery from this depression


rather than a genuine training effect; the null ANCOVA results are consistent with this


interpretation.


**Word-Count** **Bias** **in** **LLM** **Grading.** The LLM grader’s word-count sensitivity ( _ρ_ =


0 _._ 65 for Task A) is a substantial measurement concern. The Oster coefficient stability bound


exceeds 1 under the standard assumption ( _δ_ = 3 _._ 67 at _R_ max [2] [= 1] _[.]_ [3] _[×][R]_ controlled [2] [) but falls below]


1 under the most conservative assumption ( _δ_ = 0 _._ 65 at _R_ max [2] [=] [1),] [meaning] [that] [under]


conservative conditions, unobservables proportional to word count could plausibly account


for the full effect. Human validation was consistent with symmetric LLM calibration bias


across conditions.


30


**Self-Reported Compliance.** Compliance classification relied on self-reported behavior.


This is why compliance analyses are descriptive only.


**Single Organization and Session.** All participants came from Gap Inc. and completed


both tasks in a single day.


**LLM** **Grading** **as** **Novel** **Methodology.** Human validation (61 of 96 assigned docu

ments with complete dual ratings from four rater pairs) revealed systematic positive calibra

tion bias (mean difference +4 _._ 9 points; ICC = 0 _._ 56, Krippendorff’s _α_ = 0 _._ 46). LLM–human


rank-order agreement was strong for Task A (Spearman _ρ_ = 0 _._ 79) but moderate for Task


B ( _ρ_ = 0 _._ 58), which may mean that the Task B grading rubric may not discriminate well


across the range of document quality—consistent with the ceiling effect that concentrates


68% of scores at the maximum. This lower rank-order fidelity for Task B reinforces our


framing of the binary threshold as an exploratory Task B outcome and the continuous ITT


as difficult to interpret. Human-human agreement was also modest (ICC = 0 _._ 47, weighted


_κ_ = 0 _._ 21), indicating that rubric ambiguity contributes substantially to measurement noise


beyond LLM-specific limitations.


**Power.** The study detects effects of _d_ _>_ 0 _._ 40 at 80% power. Survey null results may


reflect real effects below the detection floor.

### **6 Practical Implications**


**For** **AI** **deployment** **strategy:** Access to AI tools is necessary but insufficient. Our results


suggest that mandating rigid collaborative AI protocols may carry risks. Organizations


should consider piloting and evaluating such protocols before broad deployment.


**For training design:** Partnership training was associated with higher individual output


quality at the top of the distribution. Our results are consistent with the idea that cognitive


scaffolding for individual AI use may warrant attention before investing in structured team


protocols, though this inference rests on a cross-task comparison with multiple confounds.


31


**For** **measurement:** The Task B ceiling effect and Task A word-count sensitivity illus

trate that how we measure AI-augmented work quality can substantially affect conclusions.

### **7 Conclusion**


This experiment tested two approaches to helping employees use AI more effectively: man

dating a structured collaborative protocol, and reframing AI through partnership training.


The results complicate simple narratives about AI adoption.


Pairs assigned to the structured collaborative protocol (PM session) produced lower

scoring documents than those working naturally (AM session), a finding complicated by the


AM/PM confound, the LLM grader’s word-count sensitivity, and high non-compliance. The


partnership training condition was associated with higher odds of producing top-quality indi

vidual work (in the exploratory binary model, OR = 2 _._ 07, _p_ = _._ 022). Treatment participants


also showed greater positive belief change, supported by both OLS DiD and ordinal CLMM


(OR = 1 _._ 79, _p < ._ 001), but the ANCOVA null and the carry-over pattern suggest this likely


reflects recovery from Task A belief depression rather than genuine training-induced shifts.


The implication is not that collaboration with AI is harmful, but that mandating a


specific synchronous protocol under the infrastructure conditions of this study was associated


with worse outcomes than allowing flexible use. Separately, a brief training session that


reframed AI as a thought partner was associated with favorable patterns in individual output


quality, though the primary continuous specification was null. Belief change was observed


but likely reflects carry-over recovery rather than a durable training effect. These are two


bounded findings from a single organizational context, not a general verdict on behavioral


versus cognitive interventions. Organizations investing in AI adoption should attend to both


the structures that shape team collaboration and the mental models that shape individual


engagement, while recognizing that the appropriate intervention depends on task demands,


infrastructure reliability, and measurement sensitivity.


32


#### **Ethics Statement**

This study was conducted as part of a scheduled organizational training event at Gap Inc. All


participants provided informed consent. This study was not submitted to an Institutional


Review Board (IRB) for approval. No deception was involved; both conditions received


substantive AI training.

#### **Data Availability**


De-identified survey data and LLM grading scores cannot be shared publicly due to em

ployee confidentiality agreements with Gap Inc. Analysis code is available upon request


from the corresponding author. Grading rubrics, survey instruments, and all sensitivity


analysis scripts are provided in the appendices and supplementary materials.

#### **Acknowledgments**


We thank Conor Grennan for developing the “AI Mindset” partnership training curriculum


adapted for the cognitive scaffolding condition. We thank Gap Inc. for hosting the AI Learn

ing Day event and supporting the research. We are grateful to our human validation raters


for their careful document assessment. All authors are employees of Microsoft Corporation;


Microsoft Copilot is a product of Microsoft. The study was designed to evaluate scaffold

ing interventions for AI use, not to evaluate Microsoft Copilot itself—both conditions had


identical Copilot access.

### **References**


Agrawal, A., Gans, J., and Goldfarb, A. (2024). Artificial intelligence adoption and system

wide change. _Journal_ _of_ _Economics_ _&_ _Management_ _Strategy_, 33(2):327–337.


33


Angrist, J. D. and Pischke, J.-S. (2009). _Mostly_ _Harmless_ _Econometrics:_ _An_ _Empiricist’s_


_Companion_ . Princeton University Press.


Blatter, K. and Cajochen, C. (2007). Circadian rhythms in cognitive performance: Method

ological constraints, protocols, theoretical underpinnings. _Physiology_ _&_ _Behavior_, 90(2–


3):196–208.


Blume, B. D., Ford, J. K., Baldwin, T. T., and Huang, J. L. (2010). Transfer of training: A


meta-analytic review. _Journal_ _of_ _Management_, 36(4):1065–1105.


Brynjolfsson, E., Li, D., and Raymond, L. R. (2025). Generative AI at work. _The_ _Quarterly_


_Journal_ _of_ _Economics_, 140(2):889–942.


Cadario, R., Longoni, C., and Morewedge, C. K. (2021). Understanding, explaining, and


utilizing medical artificial intelligence. _Nature_ _Human_ _Behaviour_, 5(12):1636–1642.


Dell’Acqua, F., Ayoubi, C., Lifshitz-Assaf, H., Sadun, R., Mollick, E. R., Mollick, L., Han,


Y., Goldman, J., Nair, H., Taub, S., and Lakhani, K. R. (2025). The cybernetic teammate:


A field experiment on generative AI reshaping teamwork and expertise. _Harvard_ _Business_


_School_ _Working_ _Paper_ _No._ _25-043_ .


Dell’Acqua, F., McFowland, E., Mollick, E. R., Lifshitz-Assaf, H., Kellogg, K., Rajendran, S.,


Krayer, L., Candelon, F., and Lakhani, K. R. (2026). Navigating the jagged technological


frontier: Field experimental evidence of the effects of artificial intelligence on knowledge


worker productivity and quality. _Organization_ _Science_ .


DeSanctis, G. and Poole, M. S. (1994). Capturing the complexity in advanced technology


use: Adaptive structuration theory. _Organization_ _Science_, 5(2):121–147.


Dietvorst, B. J., Simmons, J. P., and Massey, C. (2015). Algorithm aversion: People er

roneously avoid algorithms after seeing them err. _Journal_ _of_ _Experimental_ _Psychology:_


_General_, 144(1):114–126.


34


Doshi, A. R. and Hauser, O. P. (2024). Generative AI enhances individual creativity but


reduces the collective diversity of novel content. _Science_ _Advances_, 10(28):eadn5290.


Edmondson, A. C., Bohmer, R. M., and Pisano, G. P. (2001). Disrupted routines: Team


learning and new technology implementation in hospitals. _Administrative_ _Science_ _Quar-_


_terly_, 46(4):685–716.


Faraj, S., Pachidi, S., and Sayegh, K. (2018). Working and organizing in the age of the


learning algorithm. _Information_ _and_ _Organization_, 28(1):62–70.


Grennan, C. (2023). AI mindset training curriculum.


Imai, K., Keele, L., and Tingley, D. (2010). A general approach to causal mediation analysis.


_Psychological_ _Methods_, 15(4):309–334.


Jasperson, J., Carter, P. E., and Zmud, R. W. (2005). A comprehensive conceptualization


of post-adoptive behaviors associated with information technology enabled work systems.


_MIS_ _Quarterly_, 29(3):525–557.


Kellogg, K. C., Valentine, M. A., and Christin, A. (2020). Algorithms at work: The new


contested terrain of control. _Academy_ _of_ _Management_ _Annals_, 14(1):366–410.


Lebovitz, S., Lifshitz-Assaf, H., and Levina, N. (2022). To engage or not to engage with


AI for critical judgments: How professionals deal with opacity when using AI for medical


diagnosis. _Organization_ _Science_, 33(1):126–148.


Lee, D. S. (2009). Training, wages, and sample selection: Estimating sharp bounds on


treatment effects. _Review_ _of_ _Economic_ _Studies_, 76(3):1071–1102.


Leonardi, P. M. (2011). When flexible routines meet flexible technologies: Affordance, con

straint, and the imbrication of human and material agencies. _MIS_ _Quarterly_, 35(1):147–


167.


35


Lin, W. (2013). Agnostic notes on regression adjustments to experimental data: Reexamining


Freedman’s critique. _Annals_ _of_ _Applied_ _Statistics_, 7(1):295–318.


Logg, J. M., Minson, J. A., and Moore, D. A. (2019). Algorithm appreciation: People prefer


algorithmic to human judgment. _Organizational_ _Behavior_ _and_ _Human_ _Decision_ _Processes_,


151:90–103.


Microsoft (2024). Work trend index annual report. Technical report, Microsoft Corporation.


Monk, T. H. (2005). The post-lunch dip in performance. _Clinics_ _in_ _Sports_ _Medicine_,


24(2):e15–e23.


Noy, S. and Zhang, W. (2023). Experimental evidence on the productivity effects of gener

ative artificial intelligence. _Science_, 381(6654):187–192.


Orlikowski, W. J. (1992). The duality of technology: Rethinking the concept of technology


in organizations. _Organization_ _Science_, 3(3):398–427.


Orlikowski, W. J. and Gash, D. C. (1994). Technological frames: Making sense of information


technology in organizations. _ACM_ _Transactions_ _on_ _Information_ _Systems_, 12(2):174–207.


Oster, E. (2019). Unobservable selection and coefficient stability: Theory and evidence.


_Journal_ _of_ _Business_ _&_ _Economic_ _Statistics_, 37(2):187–204.


Pustejovsky, J. E. and Tipton, E. (2018). Small-sample methods for cluster-robust variance


estimation and hypothesis testing in fixed effects models. _Journal of Business & Economic_


_Statistics_, 36(4):672–683.


Schmutz, J. B., Outland, N., Kerstan, S., Georganta, E., and Ulfert, A.-S. (2024). AI

Teaming: Redefining collaboration in the digital era. _Current_ _Opinion_ _in_ _Psychology_,


58:101837.


Trist, E. L. and Bamforth, K. W. (1951). Some social and psychological consequences of the


longwall method of coal-getting. _Human_ _Relations_, 4(1):3–38.


36


Vaccaro, M., Almaatouq, A., and Malone, T. W. (2024). When combinations of humans


and AI are useful: A systematic review and meta-analysis. _Nature_ _Human_ _Behaviour_,


8(12):2293–2303.


Valdez, P., Ramírez, C., and García, A. (2014). Circadian rhythms in cognitive processes:


Implications for school learning. _Mind,_ _Brain,_ _and_ _Education_, 8(4):161–168.


Vygotsky, L. S. (1978). _Mind in Society:_ _The Development of Higher Psychological Processes_ .


Harvard University Press.


Weick, K. E. (1990). Technology as equivoque: Sensemaking in new technologies. In Good

man, P. S. and Sproull, L. S., editors, _Technology_ _and_ _Organizations_, pages 1–44. Jossey

Bass.


Wood, D., Bruner, J. S., and Ross, G. (1976). The role of tutoring in problem solving.


_Journal_ _of_ _Child_ _Psychology_ _and_ _Psychiatry_, 17(2):89–100.


Woolley, A. W. (2025). Generative AI and collaboration: Opportunities for cultivating


collective intelligence. _Journal_ _of_ _Organization_ _Design_ .


Zheng, L., Chiang, W.-L., Sheng, Y., Zhuang, S., Wu, Z., Zhuang, Y., Lin, Z., Li, Z., Li, D.,


Xing, E. P., Zhang, H., Gonzalez, J. E., and Stoica, I. (2023). Judging LLM-as-a-judge


with MT-Bench and Chatbot Arena. _Advances in Neural Information Processing Systems_,


36.

### **8 Survey Instruments**

#### **8.1 Baseline Survey (Pre-Study)**


_Demographics:_ Current role/title, job level (IC, Manager, Director+), functional area, tenure.


37


_AI_ _Experience:_ Duration of AI tool usage (never, _<_ 1 month, 1–2 months, 3–5 months,


6–12 months, _>_ 1 year), frequency of use (daily, several times/week, weekly, monthly, rarely,


never), comfort with Microsoft Copilot (1–5 scale).

#### **8.2 Post-Task A Survey**


_Task_ _Experience_ _(4_ _items,_ _5-point_ _Likert):_ Productive and efficient, smooth collaboration


flow, confident in output quality, motivated to complete well.


_Copilot_ _Helpfulness_ _(6_ _items,_ _5-point_ _Likert_ _+_ _“Did_ _not_ _use”):_ Made work faster, im

proved quality, supported collaboration, made work more engaging, produced trustworthy


outputs, easy to use.


_Behavioral Items (checkbox):_ Copilot usage mode (not used, individually, jointly), actions


(summarize, generate, edit, brainstorm, learn, get feedback, roleplay).

#### **8.3 Intermission Survey (Post-Task A, Pre-Task B)**


_AI Beliefs (9 items,_ _5-point Likert):_ AI as Thought Partner (3 items), Exploration & Exper

imentation (3 items), Productivity & Process (3 items). This was the first administration of


the belief inventory.

#### **8.4 Post-Task B Survey**


_Task_ _Experience_ _(5_ _items,_ _5-point_ _intensity_ _scale):_


Stem: “To which extent did you feel. . . ”


 - . . . engaged during the task?


 - . . . motivated during the task?


 - . . . confident in the quality of your final output?


 - . . . that the instructions were clear?


38


 - . . . that the workload was manageable?


_Copilot_ _Helpfulness_ _(5_ _items,_ _5-point_ _intensity_ _scale):_


Stem: “To which extent did Copilot. . . ”


 - . . . help you work faster?


 - . . . help you produce higher quality work?


 - . . . make the task more engaging?


 - . . . feel trustworthy for this task?


 - . . . feel easy to use for this task?


_Future_ _AI_ _Intent_ (3 items, parallel to Post-Task A).


_AI_ _Beliefs_ (9 items, repeated; identical to Section 8.3).


_Open-Ended:_ What was most valuable about today’s training? What would you change?

### **9 Document Grading Rubrics**

#### **9.1 Task A Rubric: AI Adoption Action Plan**


_Opportunities_ _Identified_ _(0–6_ _points):_ For each opportunity (max 3, 2 points each): +0.5


clear description, +0.5 specific noun (named system/stakeholder), +0.5 detailed impact,


+0.5 feasibility assessment.


_Risks_ _Identified_ _(0–6_ _points):_ Parallel structure: description, specificity, impact, testa

bility.


_Action_ _Plan_ _Quality_ _(1–5):_ 5 = Executive-ready with timeframes, owners, success crite

ria; 3 = Steps present but missing details; 1 = Buzzwords only.


_Strategic_ _Insight_ _(1–5):_ 5 = Non-obvious insight with downstream effects; 3 = Some


organizational awareness; 1 = No strategic thinking.


39


#### **9.2 Task B Rubric: Strategic Communications Response**

_Problem_ _Understanding_ _(1–5):_ 5 = All three concerns mapped to specific Gap operations; 3


= High-level identification; 1 = Generic response.


_Internal_ _Strategy_ _(1–5):_ 5 = Executive-ready with audiences, talking points, actions; 3


= Named audiences; 1 = No useful guidance.


_External_ _Strategy_ _(1–5):_ 5 = Constructive, proactive narrative; 3 = Generic “responsible


AI”; 1 = Dismissive.


_Completeness_ _(1–5):_ 5 = Fully developed; 3 = Partially developed; 1 = Outline only.

### **10 LLM Grading Validation**

#### **10.1 Grading Protocol**


Total documents graded: 887 (478 Task A, 409 Task B). Final versions: 164 pairs (Task A),


210 individuals (Task B). Primary model: GPT-4o-mini (temperature = 0, 3 runs, median


score). Validation model: GPT-4o.

#### **10.2 Determinism**


Table 11 summarizes run-to-run score consistency across the three independent grading


passes.


Table 11: Grading Determinism Across Three Runs


Task A Task B


Perfectly deterministic 53.1% 90.7%
Mean score range (non-deterministic) 0.99 pts 0.22 pts


40


#### **10.3 Cross-Model Reliability**

We validated the primary grader (GPT-4o-mini) against a larger model (GPT-4o) on a


random sample of 176 documents. Table 12 reports agreement metrics.


Table 12: GPT-4o-mini vs. GPT-4o Agreement ( _N_ = 176)


Metric Value


Pearson _r_ 0.922
Spearman _ρ_ 0.875
ICC(2,1) 0.921
Mean absolute difference 1.81 pts
Systematic bias (4o-mini _−_ 4o) +0.34 pts

#### **10.4 Word-Count Sensitivity**


Table 13 reports the correlation between document length and total grading score, along


with per-condition mean word counts.


Table 13: Word-Count Correlation with Quality Scores


Task A Task B


Spearman _ρ_ (score _∼_ word count) 0.646 0.436
Control mean word count 740          Treatment mean word count 454         Word count difference _p_ .0001 .017

#### **10.5 Human Validation Results**


Human validation used 8 trained raters organized in 4 pairs, each pair grading the same


24 documents (61 of 96 assigned documents received complete dual ratings). Raters were


blinded to condition and to LLM scores. Tables 14–16 report the full set of agreement,


calibration, and rank-order results.


_Overall_ _Agreement_ _Metrics._ Table 14 reports inter-rater reliability among human raters


and LLM–human agreement.


41


Table 14: Human–Human and LLM–Human Agreement


Metric Overall Task A Task B


ICC (two-way, agreement) 0.56 0.61 0.48
Krippendorff’s _α_ 0.46 0.45 0.45
Human-Human weighted _κ_ 0.21 0.28 0.12
LLM-Human weighted _κ_ (rater 1) _−_ 0.40 _−_ 0.41 _−_ 0.24
LLM-Human weighted _κ_ (rater 2) _−_ 0.21 _−_ 0.26 _−_ 0.14


_Calibration Bias (LLM −_ _Human Average)._ Table 15 compares mean LLM scores against


mean human averages. The LLM runs systematically generous relative to humans, with


larger bias on Task B.


Table 15: LLM vs. Human Score Calibration


Task LLM Mean Human Avg Mean Mean Difference


Task A 13.8 9.6 +4.2
Task B 17.3 11.8 +5.5
Overall 15.6 10.7 +4.9


_Note:_ Mean differences are computed on paired observations
and may not equal the difference of rounded column means.


_Rank-Order_ _Correlation_ _(Spearman_ _ρ,_ _LLM_ _vs._ _Human_ _Average)._ Table 16 reports rank

order agreement at the total-score and per-dimension level. Rank-order preservation is sub

stantially stronger for Task A than for Task B, consistent with the Task B ceiling effect.


Table 16: LLM–Human Rank-Order Correlation


Task A Task B


Total score 0.79 0.58
Dimension 1 0.72 (Opportunities) 0.54 (Problem Understanding)
Dimension 2 0.78 (Risks) 0.49 (Internal Strategy)
Dimension 3 0.83 (Action Plan) 0.49 (External Strategy)
Dimension 4 0.78 (Insight) 0.51 (Completeness)


_Condition_ _Symmetry._ The LLM-human gap did not differ significantly by treatment


condition (Task A: Wilcoxon _p_ = _._ 18; Task B: _p_ = _._ 12).


42


### **11 Sensitivity Analyses**

#### **11.1 Lee (2009) Trimming Bounds**

Lee bounds address differential attrition by trimming the group with higher response rates


from the tails of its outcome distribution, yielding worst-case upper and lower bounds on


the ITT effect under a monotonicity assumption.


Table 17: Lee (2009) Trimming Bounds: All Tasks


Task Bound Estimate Bootstrap 95% CI Trim % Trim Group


Task A (cont.) Lower _−_ 7.01 [ _−_ 8.70, _−_ 5.46] 23.7% Control
Task A (cont.) Point est. _−_ 4.96 - - Task A (cont.) Upper _−_ 3.34 [ _−_ 5.24, _−_ 1.62] 23.7% Control


Task B (cont.) Lower _−_ 1.58 [ _−_ 2.62, _−_ 0.58] 29.3% Control
Task B (cont.) Point est. +0.77 - - Task B (cont.) Upper +1.90 [0.54, 3.34] 29.3% Control


Task B (binary _≥_ 20) Lower _−_ 0.10 [ _−_ 0.25, 0.05] 29.3% Control
Task B (binary _≥_ 20) Point est. +0.15 - - Task B (binary _≥_ 20) Upper +0.31 [0.16, 0.47] 29.3% Control


_Monotonicity_ _assumption:_ For Task A, treatment monotonically reduced the probability of
producing a document (see Table 18). For Task B, the assumption is less clear-cut; bounds
should be interpreted with additional caution.

#### **11.2 Non-Production as Treatment Outcome**


Treatment significantly reduced document production for both tasks, representing an effect


on the extensive margin.


Table 18: Non-Production as Treatment Outcome


Task _N_ Ctrl _N_ Trt Prod (Ctrl) Prod (Trt) OR 95% CI _p_


Task A (pairs) 97 97 93 71 0.12 [0.04, 0.35] _<_ .001
Task B (indiv.) 194 194 123 87 0.47 [0.31, 0.71] _<_ .001


43


#### **11.3 Oster (2019) Coefficient Stability**

Oster bounds quantify how large selection on unobservables would need to be, relative to


observed controls, to explain away a coefficient. The _δ_ column reports the proportional se

lection required to drive the treatment effect to zero under two assumptions about maximum


attainable _R_ [2] .


Table 19: Oster (2019) Coefficient Stability Bounds


Task _β_ (no ctrl) _β_ (+ wc) _R_ [2] (no ctrl) _R_ [2] (+ wc) _δ_ (1.3 _×_ ) _δ_ ( _R_ [2] = 1)


Task A _−_ 4.96 _−_ 3.34 0.173 0.370 **3.67** 0.65
Task B +0.77 +0.21 0.007 0.126 **1.17**   
#### **11.4 Causal Mediation (Imai et al., 2010)**


The mediation decomposition separates the total treatment effect into the indirect path


through word count (ACME) and the direct path (ADE), with bootstrap 95% confidence


intervals. Estimates address how much of the observed treatment effect on quality scores


operates through document length rather than content.


Table 20: Causal Mediation via Word Count


Task Component Estimate 95% CI _p_


Task A ACME (via word count) _−_ 1.61 [ _−_ 2.59, _−_ 0.80] _< ._ 001
Task A ADE (direct) _−_ 3.34 [ _−_ 4.95, _−_ 1.72] _< ._ 001
Task A Total _−_ 4.96 [ _−_ 6.74, _−_ 3.33] _< ._ 001
Task A % Mediated 32.6% [17.7%, 52.8%]     

Task B ACME (via word count) +0.56 [0.16, 1.05] .016
Task B ADE (direct) +0.21 [ _−_ 0.90, 1.37] .714
Task B % Mediated 72.9%     -     

_Caveat:_ Mediation analysis assumes sequential ignorability—that word
count is not itself affected by unmeasured confounders that also affect quality. This assumption is strong and may not hold.


44


#### **11.5 Session-Effect Sensitivity**

The calibration exercise computes the residual Task A treatment effect under a range of


assumed pure session effects (in Cohen’s _d_ ), identifying the breakeven point at which a pure


session-timing effect would fully account for the observed difference.


Table 21: Session-Effect Sensitivity Analysis


Assumed PM Effect ( _d_ ) Residual Diff. Residual _d_ % Explained Significant?


0.00 (none) _−_ 4.96 _−_ 0.81 0% Yes
0.10 _−_ 4.35 _−_ 0.71 12.3% Yes
0.20 _−_ 3.74 _−_ 0.61 24.7% Yes
0.30 (literature max) _−_ 3.13 _−_ 0.51 37.0% Yes
0.40 _−_ 2.52 _−_ 0.41 49.4% Yes
0.50 _−_ 1.91 _−_ 0.31 61.7% Yes
0.81 (breakeven) 0.00 0.00 100% No


_Note:_ _d_ values computed using pooled SD = 6 _._ 11 from the primary analysis. The
observed effect ( _|d|_ = 0 _._ 81) is approximately 3 _×_ larger than the largest circadian decrements in the cognitive psychology literature.


45


### **12 Pre-Specified vs. Post-Hoc Analytical Decisions**

Table 22: Analytical Decision Transparency


Decision Status Rationale


Covariates (AI duration, baseline Pre-specified Lin (2013); theoretical relevance
confidence, innovation speed)

Outcome families (Survey: 3; Pre-specified Grouped by outcome type
Grading: 2; Belief: 4)

BH correction within families Pre-specified Planned MCP strategy
ITT as primary specification Pre-specified Standard for RCT
HC2 for Task A, CR2 for Task Pre-specified Unit of analysis
B/Survey

Binary threshold for Task B **Post-hoc** Based on observed 68.1% ceiling
( _≥_ 20)

Compliance group definitions **Post-hoc** Based on observed patterns
CLMM for belief change **Post-hoc** Robustness check for ordinal outcomes
Lee bounds **Post-hoc** Motivated by observed attrition
Oster bounds and mediation **Post-hoc** Motivated by word-count sensitivity
Session-effect calibration **Post-hoc** Motivated by AM/PM confound


_Note:_ This study was not pre-registered. All post-hoc analyses are labeled as such
and interpreted accordingly.

### **13 Partnership Training Curriculum**


The cognitive scaffolding condition used the “AI Mindset” training curriculum (Grennan,


2023), a behavioral intervention designed to shift participants’ mental models of AI from


a transactional frame (AI as search tool or software feature) to a dialogic frame (AI as


collaborative thought partner). The training is grounded in the premise that effective AI


use is primarily a behavioral challenge rather than a technical one—that is, performance


differences stem less from knowledge of system features than from the interaction patterns


users adopt.


The curriculum comprised three core components:


1. **Cognitive** **reframing:** Participants were introduced to behavioral frameworks that


46


challenged default assumptions about AI capabilities and interaction norms, reposition

ing AI as a collaborator warranting the same iterative engagement one would extend


to a human thought partner—including context-setting, follow-up questioning, and


real-time course correction.


2. **Mental** **model** **replacement:** The training explicitly contrasted a “search engine”


mental model (single-query, extractive) with a “thought partner” mental model (multi

turn, generative), using analogies such as the “smart intern” metaphor to make the


dialogic frame intuitive and actionable.


3. **Guided** **practice:** Participants engaged in structured prompting exercises designed


to build fluency with iterative, conversational AI interaction patterns rather than op

timizing individual prompt syntax.


The intervention did not introduce any additional system features or technical capabilities


beyond what was available to the control condition. The sole differentiator was behavioral:


how participants were trained to conceptualize and engage with the AI system. For further


information, see `[https://www.ai-mindset.ai](https://www.ai-mindset.ai)` .


47


