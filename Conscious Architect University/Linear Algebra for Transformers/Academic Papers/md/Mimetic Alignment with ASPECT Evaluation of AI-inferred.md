### **Mimetic Alignment with ASPECT: Evaluation of AI-inferred** **Personal Profiles**



Ruoxi Shang
rxshang@uw.edu
University of Washington
Seattle, Washington, USA


Edward Cutrell
cutrell@microsoft.com
Microsoft Research
Redmond, Washington, USA


**Abstract**


AI agents that communicate on behalf of individuals need to capture
how each person actually communicates, yet current approaches
either require costly per-person fine-tuning, produce generic outputs from shallow persona descriptions, or optimize preferences
without modeling communication style. We present ASPECT (Automated Social Psychometric Evaluation of Communication Traits),
a pipeline that directs LLMs to assess constructs from a validated
communication scale against behavioral evidence from workplace
data, without per-person training. In a case study with 20 participants (1,840 paired item ratings, 600 scenario evaluations), ASPECTgenerated profiles achieved moderate alignment with self-assessments,
and ASPECT-generated responses were preferred over generic and
self-report baselines on aggregate, with substantial variation across
individuals and scenarios. During the profile review phase, linked
evidence helped participants identify mischaracterizations, recalibrate their own self-ratings, and negotiate context-appropriate
representations. We discuss implications for building inspectable,
individually scoped communication profiles that let individuals
control how agents represent them at work.


**CCS Concepts**


- **Human-centered** **computing** → **Collaborative** **and** **social**
**computing systems and tools** ; **Empirical studies in collabora-**
**tive and social computing** ; _User studies_ .


**Keywords**


communication style, psychometric profiling, LLM personalization,
AI agents, mimetic alignment, user auditing


**1** **Introduction**


AI agents are increasingly expected to communicate not just _for_ people but _as_ them: auto-replying to messages, attending meetings on a
user’s behalf, or acting as conversational proxies when someone is
unavailable [9, 34, 43]. For these agents to be useful, they must capture how a specific individual communicates, not produce a generic
approximation [24, 33]. Unlike public figures with documented personas that models can learn from [1], ordinary individuals have
private, sparse, and context-dependent communication patterns. A
person may be direct with peers and diplomatic with leadership,
verbose in brainstorming and terse in status updates. Representing
someone faithfully means capturing these patterns from their actual



Dan Marshall
Dan.Marshall@microsoft.com
Microsoft Research
Redmond, Washington, USA


Denae Ford
denae@microsoft.com
Microsoft Research
Redmond, Washington, USA


behavior. To date, existing approaches to personalization fall short.
Persona prompting, where the model is given a short description
of who to imitate, produces outputs that look superficially different
but are similar across individuals [8, 52]. Per-person fine-tuning or
preference-based alignment (RLHF, DPO) can capture individual
patterns but requires substantial data and compute for each person,
does not scale, and produces opaque models that the individual
cannot inspect or adjust.
We introduce **ASPECT** **(Automated** **Social** **Psychometric**
**Evaluation** **of** **Communication** **Traits)**, a pipeline that uses
LLMs guided by a validated psychometric scale to extract representative snippets from a person’s social interaction data and build
a structured, evidence-grounded communication profile without
per-person training. As each dimension score is linked to specific
quotes and rationales, the profile is interpretable—the person can
inspect where it is aligned or not. Whether such a profile is socially
appropriate, however, can only be determined by the person it represents [9, 21, 25]. We therefore conducted a case study with 20
participants from a single organization to assess what the pipeline
captures and where it falls short (Section 3.3). Each participant
first reviewed their inferred profile against their own self-ratings,
inspecting the behavioral evidence and rationales behind each construct. They then evaluated scenario-based responses generated
under three conditions: _Profiled_ (from ASPECT-inferred profile),
_Self-Report_ (based upon self-ratings only), and _Generic_ (vanilla GPT
with no personalization).
Our evaluation reveals three key patterns: profiled responses
were preferred over both baselines on aggregate, though with substantial individual and scenario variation; LLMs exhibited a consistent positivity bias, over-rating socially desirable traits; and profile
review prompted participants to recalibrate their own self-ratings
and negotiate context-appropriate representations. This paper contributes:


(1) **ASPECT**, a profiling pipeline that operationalizes a validated psychometric instrument as a prompt-based data
compression method, generating structured communication profiles that are portable across models and inspectable
by the people they describe.



1


(2) **Empirical evidence** from 20 participants providing the
first systematic account of LLM-based communication profiling evaluated by the individuals being modeled, revealing that inference preserves relative profile shape but introduces predictable biases—findings that directly inform
calibration strategies for future systems.
(3) **Design implications** for human-in-the-loop profile negotiation: we demonstrate that evidence-linked review shifts
profiling from a classification task to a collaborative negotiation, where individuals decide not just whether a profile
is accurate but which version of themselves they want an
agent to represent.


**2** **Related Work**

**2.1** **From communication support to AI**
**representation**


AI-mediated communication (AI-MC) systems help users communicate more effectively by modifying, augmenting, or generating
messages for interpersonal objectives [21]. Applications include
rewriting for empathy [49], reframing negative perspectives [54],
smart reply suggestions [22], persuasion enhancement [26], conveying status [44] or trustworthiness [35], promoting democratic
discourse [2], and increasing affectionate communication between
partners [27]. In each case, the user remains the communicator; the
AI operates on the message, not on the person’s behalf.
A different line of work builds agents that communicate _as_ individuals. Dittos are personalized embodied agents that attend
meetings when users are unavailable [34]. Recent work has experimented with generative agents that simulate human behavior
in virtual environments [41] and mimetic models predict specific
individuals’ responses [37]. Platforms like Character.AI generate
representations of public figures and fictional characters [1]. Public figures have documented personas that models can learn from.
For ordinary individuals with private footprints, building an accurate representation remains an open problem, and these developments raise concerns about identity fragmentation, autonomy, and
whether individuals can recognize and approve how AI speaks for
them [33].
The dominant paradigm for aligning model behavior to users is
preference-based optimization. RLHF [40] and DPO [46] train models to produce outputs that humans prefer, and recent personalized
variants learn per-user reward functions from heterogeneous feedback [7, 45]. These methods address a different problem than ours.
Preference alignment optimizes which output a user likes; style
representation captures how a specific person communicates. A
person might prefer concise AI responses while writing lengthy, discursive emails themselves. Preference-based methods also require
hundreds to thousands of comparisons per individual, each encoding a binary signal along an unspecified axis, and produce opaque
reward functions tied to specific model weights. Representing someone’s communication style for social contexts requires a structured,
interpretable profile that the person can inspect and adjust. Closest
works to ours are agent simulations initialized from survey data reproduce behaviors for over 1,000 individuals [42], and general user
models infer structured beliefs from everyday computer use traces

[48]. However, these aforementioned approaches do not typically



Shang, et al.


use observational data and experiment with profiling for social
communication contexts as we do in our approach.


**2.2** **Building structured profiles of individuals**


Design personas compress user segments into qualitative narratives
that ground coordination across teams [39]. Psychometric instruments take a complementary approach: they decompose individual
behavior into quantitative, theory-backed constructs that can be
reliably measured and compared across people [13, 15]. The Big
Five personality model, for example, captures individual differences
across five broad domains and finer-grained facet-level traits using
standardized inventories [12, 20]. For communication specifically,
the Communication Styles Inventory (CSI) models six domains with
23 facets, each operationalized by behaviorally anchored items rated
on Likert scales, with validated internal consistency and convergent
evidence [14]. These instruments provide interpretable dimensions
with established reliability, making them candidates for structuring an individual’s profile. With foundation models, personality
prompting has been used to steer LLM behavior toward specific
trait configurations. Recent tests show, however, that personalityprompted LLMs often fail to behave consistently with the intended
persona in social decision paradigms [52]. A structured profile does
not guarantee appropriate downstream behavior; the person being
represented needs to verify it.
Behavioral data offers a complementary path to building individual profiles. Digital-footprint inference translates social media
traces into Big Five predictions that rival close acquaintances’ assessments [30, 51], and data-grounded methods reduce biases inherent in self-report [29]. These systems demonstrate that behavioral
traces carry stable personality signals, but they output broad trait
scores without linking them to specific behavioral evidence that the
person can review. General user models take a different approach,
accumulating calibrated, revisable beliefs about specific individuals from everyday computer use to drive context-aware assistants

[48]. They model what a person does across applications but do
not organize that knowledge around validated communication constructs. At the population scale, agent simulations initialized from
qualitative interviews can reproduce survey responses and behaviors for over 1,000 individuals [42], showing that it is possible to
represent many distinct people rather than a single average user,
though their profiles are derived from interview summaries rather
than observed interaction data. Domain-specific work has shown
the value of adapting communication style for particular contexts,
from culturally tailored persuasive agents [53] to health chatbots
adapted for multicultural caregivers [3], but these adapt style at the
group level rather than building individual profiles.
Across this landscape, a gap remains: no existing approach builds
structured communication profiles for individuals that are organized by validated psychometric constructs, grounded in behavioral
evidence from the person’s own data, and open to the person’s inspection and adjustment. We explore this direction with ASPECT,
which uses a psychometric scale as scaffolding to compress an individual’s workplace communication data into a structured, evidencelinked profile, and we assess what this approach captures and where
it falls short in one workplace setting.



2


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


**3** **System Design**


**ASPECT** constructs a structured communication profile for a given
individual from their workplace interaction data using a _psychome-_
_tric instrument_ as a novel prompt-based data compression method.


**3.1** **Conceptual Model**


Language models can simulate individual behaviors and preferences when provided with behavioral data [42, 48, 52]. We build on
this capability to construct communication profiles from observed
workplace interaction data. While several approaches can steer
LLM behavior with personal data, we use prompt-based context
engineering for two reasons.
First, it is lightweight. Fine-tuning requires substantial data
per person, is costly to maintain, and produces opaque models.
Retrieval-augmented generation (RAG) does not fit this task. Retrieval methods would weigh informational relevancy more, and
also lead to unstable and inconsistent characteristics across conversations. Second, the approach must be interpretable. As using AI to
represent individuals in social communications is still exploratory,
there is no consensus on what aspects of communication need to be
captured, what works, or why. Computed metrics cannot validate
this nuance, and only the individuals themselves can verify whether
their profile is socially appropriate. Hence, we need an approach
that can render the profile interpretable, allowing people to review
each component, identify where it succeeds or fails, and examine
probable causes. Given these requirements, we wanted to develop a
structured profile prompt with good coverage of communication dimensions. Our challenge was then to determine which dimensions
to include and how to extract them from data.
We draw inspiration from psychometric assessment, both as a
_method_ and as a _measurement instrument_ (Section 2.2). As a method,
psychometric assessment follows a structured procedure—trained
observers review behavioral evidence through specific constructs
and score standardized items—and we apply this same logic to
LLMs. Rather than asking the model to characterize a person openendedly, we direct it to scan communication data construct by
construct, collect behavioral evidence for each, and score individual
items against the collected evidence. As an instrument, a validated
psychometric scale provides the construct scaffolding that organizes
this process. A construct such as _Talkativeness_ in the CSI [14] is
operationalized by behaviorally anchored items, each rated on a
Likert scale. Such scales report continuous scores across dimensions
and facet-level subtraits rather than assigning a categorical “type.”
Their validated structure supports internal consistency and stability
across contexts.
The resulting profile is a set of construct-level ratings, each
linked to behavioral evidence. It aggregates across many interactions rather than reflecting a single event. We instantiate this
approach using the CSI; Section 4.1 details the specific instrument
and data.


**3.2** **Profile Pipeline Development**


The profiling pipeline implements this approach in two phases. We
used OpenAI’s o1 reasoning model for all inference tasks.



_Phase 1: Construct-guided Evidence Extraction._ The social interaction data contains authentic behavior but is vast, sparse, and noisy.
The challenge is how to compress it into a structured representation of an individual’s communication patterns. The pipeline first
preprocesses the user’s communication data (e.g., meeting transcripts, group chats) into batches organized by token budget. It
then scans the data _facet by facet_ : for each of the scale’s constructs,
the LLM receives one batch of communication files along with the
construct definition and its associated scale items. The model is
instructed to act as an objective observer and identify 2–5 concrete
instances where the user’s behavior demonstrates that specific construct. Scanning one facet at a time ensures that the model attends
to one behavioral pattern across the full breadth of the data, rather
than attempting to characterize the user holistically in a single
pass. Each evidence record pairs a context summary covering the
situation, social dynamics, setting, and behavioral analysis with a
conversational excerpt of 2–5 turns, keeping judgments traceable
to source data (Appendix A).


_Phase 2: Inferred Assessment from Item-level Scoring._ Once evidence has been collected for all constructs, the pipeline scores each
individual scale item independently. For a given item (e.g., “I always
have a lot to say”), the model receives the item text together with
the behavioral evidence extracted for its parent facet in Phase 1. It
then produces a numerical rating (1–5) and a brief rationale grounding the rating in the observed evidence. Items within the same facet
share the same evidence pool, ensuring scoring consistency within
constructs. When no behavioral evidence was found for a facet, the
pipeline assigns default ratings that reflect absence of the behavior
rather than leaving scores undefined.
An example item-level output:


{"Item": "I sometimes toss bizarre ideas into a group
discussion.",
"Rating": "4/5",
"Rationale": "Across multiple brainstorming sessions, the
user
repeatedly suggests unconventional ideas (novel workflow
automations, experimental feature integrations). These
proposals
show a pattern of introducing unusual concepts, aligning
well
with the idea of occasionally tossing unexpected
suggestions
into group discussions."}


Evidence extraction and scoring address different questions (“what
did this person do?” vs. “how well does this item describe them?”),
and decoupling them allows each step to be inspected and validated
independently.
Our evaluation asks whether the profiling pipeline produces profiles that individuals recognize as capturing their communication
style, and whether those profiles generate appropriate AI behavior in context. The first does not guarantee the second, because a
person might accept their trait scores yet find AI responses generated from them stilted or situationally off. We therefore evaluate at
both the profile level and the behavioral level. Since representation



3


Shang, et al.

















**Figure 1: Profile Generation Pipeline and User Evaluation Overview. See text for detailed explanation for each phase**



preferences are personal [9, 21, 25], participants serve as the primary evaluators at both the profile and behavioral levels. We use
participant not as ground-truth accuracy measure of our system,
but to provide insight where the pipeline succeeds, fails, and what
alignment means if they were to use this in practice.



_Phase 3: User Self-Assessment._ To ground the profile review, participants first complete a self-assessment on the same instrument
the pipeline scored (the CSI we mentioned previously), providing
per-item comparison data. Both stages are implemented as a Flask
web application with standard HTML/JavaScript, served locally to



4


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles



SELF-assessed









each participant. The application guides participants through selfassessment, profile review with side-by-side score comparisons and
linked evidence, and blinded scenario evaluation. Participants can
flag factual errors or unrepresentative evidence during review, and
all responses and preferences are persisted as JSON for analysis.


**3.3** **User Profile Evaluation**


_Phase 4: User Profile Review._ The review interface mirrors the instrument’s ontological nature (Figure 2 mirrors Table 1). At the top
level, participants navigate the CSI’s dimension-facet-item structure (1). Expanding a dimension reveals individual items (2), the
statements that both participants and ASPECT rate directly. During self-assessment, participants see only raw items without the
ontological context, so they are not primed by construct labels.
Each item links to behavioral evidence extracted from the user’s
data (3): a representative conversational excerpt of 2–5 turns with
the model’s rationale.
Several interface elements support comparison and verification
as highlighted in Figure 2: (A)ASPECT and self-ratings appear side
by side, with red highlighting for disagreements of 2 or more points;
(B) percent agreement across ratings; (C) an example count per
construct shows where data coverage is thin; (D) the system’s
full rationale is displayed for each score; and (E) a reverse-coded
indicator flags items that measure the opposite direction of their
parent construct. Appendix B includes additional details.



_Phase 5: User Scenario-Based Evaluation._ Scenario-based evaluation tests whether the inferred profile produces appropriate responses in concrete workplace situations. Scenarios must be personally relevant so that participants can meaningfully judge whether a
response captures how they would communicate, but they must also
be structurally comparable across participants so that responses can
be analyzed across the sample. Fully personalized scenarios for each
participant would make cross-participant comparison impossible;
identical generic scenarios would lack ecological validity.
We separate scenario _structure_ from scenario _content_ . Structure comes from the APRACE taxonomy (Actor–Partner–Relation–
Activities–Context–Evaluation) [23], which decomposes interpersonal situations into independent dimensions that map to workplace communication constructs. We authored 10 scenario templates spanning the six CSI dimensions, each defined by a fixed
configuration of eleven APRACE factors such as hierarchy, familiarity, purpose, and stakes. Templates were stratified to balance
hierarchy × purpose × stakes, ensuring every attribute level appears at least once (Appendix C). Every participant’s Scenario 1
shares the same interpersonal setup: the same power dynamic, relational context, communication purpose, and stakes level. What
differs is the specific content.
Each template is instantiated with participant-specific details
drawn from recent work communication, such as team names, tools,
and terminology. In earlier pilot testing, participants struggled to
project themselves into generic workplace situations and could
not meaningfully assess which response best captured their style;



5


grounding scenarios in familiar details resolved this. Scenarios
remain hypothetical (“what if...”) rather than retrospective (“remember when...”), so participants judge potential behavior, not
recall. Every participant sees structurally equivalent scenarios set
in their own workplace context (Figure 3). Across participants, the
content varies but the interpersonal setup stays fixed.
For each scenario, three responses are generated under different conditions and presented in randomized order without labels.
Participants rank the responses and rate each on a 5-point alignment scale (1 = not aligned, 5 = very aligned), then may choose
to reveal which condition produced each. The conditions vary in
how much personal information the model receives. _Generic_ is a
scenario-only baseline where the model sees only the scenario and
partner message. _Self-Report_ adds a conversational style description derived from the participant’s self-ratings but no behavioral
examples. _Profiled_ uses a style description derived from the ASPECT profile and includes compact behavioral-evidence snippets
to ground the response.
The three conditions form a controlled comparison. Both _Self-_
_Report_ and _Profiled_ convert their respective CSI ratings into the
same style-description format using the same prompt; the difference is whether those ratings come from the participant or from the
pipeline’s analysis of their data, isolating the rating source while
holding instrument, format, and conversion constant. _Self-Report_
uses structured CSI ratings rather than free-form descriptions, so
any difference in response quality traces to rating source alone,
not input format. _Profiled_ also includes behavioral evidence because evidence extraction is how the pipeline arrives at its ratings:
the model scores each item against behavioral instances collected
from the person’s data, so evidence and ratings are not separable
components. All three conditions receive the same scenario and
partner message, and system role prompts are matched to minimize
confounds.
Ideally, scenario-based evaluation would follow one or more
rounds of profile review so that downstream behavior is tested on a
refined profile. Because the feasibility of our profiling method was
unknown, we treat this as a first-step feasibility study and condition
scenario responses on the initial, pre-review profile.


**4** **Study Design**

**4.1** **Evaluation in a Workplace Setting**


We evaluate in a workplace setting using communication traces
that participants can access through enterprise meeting and chat
systems. To capture natural, unstructured communication in everyday professional relationships, each session participant exported
the prior 90 days of their meeting transcripts, group messages,
and direct message chat histories and processed them locally on
their own devices. This was a deliberate choice motivated by a few
factors. Organizations routinely retain transcripts and chat logs,
offering a relatively easy way for participants to retrieve their own
data. Working within a single organization also introduces shared
norms of tone, tools, and schedules. Conversations are situated in
real teams, tools, and deadlines, yet share organizational norms.
This reduces cross-domain noise and supports more controlled comparisons. Next, workplace traces avoid many intimate topics that
arise in family and friend communications and are thus easier to



Shang, et al.


audit with minimal intrusion. Finally, we wanted participants to
retain control over their personal data.
Broad personality batteries (e.g., Big Five) capture stable dispositions yet remain one step removed from conversational behavior, and team instruments (e.g., FIRO-B, DiSC, TKI) are often
vendor-specific and scenario-bound. To model how people actually communicate, we use the Communication Styles Inventory
(CSI) [14], a behaviorally anchored measure developed from a lexical study of communication descriptors. CSI contains 92 items [1]

distributed across six domain-level scales— _Expressiveness_, _Precise-_
_ness_, _Verbal Aggressiveness_, _Questioningness_, _Emotionality_, and _Im-_
_pression_ _Manipulativeness_ —each split into four four-item facets,
yielding interpretable axes directly tied to observable speech behavior rather than intrapersonal cognitions. In the original validation, all domain reliabilities exceeded _𝛼_ =0 _._ 80, factor analyses
supported the six-domain, 24-facet structure in a large community
sample ( _𝑁_ =815) with replication in a student sample, and the scales
showed medium-to-high convergent validity with lexical marker
scales and behavior-oriented communication measures while remaining discriminant from nonbehavioral “about-communication”
cognitions [14]. CSI also shows coherent relations with personality
(medium-to-strong associations with HEXACO and NEO dimensions), and related work demonstrates incremental validity of communication styles for leadership criteria beyond extraversion and
conscientiousness, underscoring that styles add predictive signal
beyond broad traits [4]. These properties make CSI a theory-driven,
validated, and interpretable scaffold for compressing workplace
discourse into facet-level evidence that we can audit transparently
later in our pipeline.
The study protocol was reviewed and approved by the organization’s research ethics board.


**4.2** **Participants**


We recruited _𝑁_ =20 participants (11 men, 9 women) within a single
large organization, aged 18–54, spanning interns to senior-level
staff across research, engineering, and program/project management roles. Tenure at the organization ranged from _<_ 6 months to

_>_ 10 years; time-in-role ranged from _<_ 3 months to _>_ 3 years. Work
arrangements varied across fully in-office ( _𝑛_ =9), hybrid ( _𝑛_ =10), and
fully remote ( _𝑛_ =1). Recruitment was conducted via internal email
lists and group channels to intentionally sample diverse roles and
collaboration contexts. Participants were compensated $100 for a
single 2-hour session.


**4.3** **Procedure**


Each session lasted two hours and was conducted one-on-one via
enterprise videoconferencing. In the first ∼30 minutes, participants
installed the study application on their local laptop, processed their
exported workplace data locally for profiling, and completed the
92-item CSI self-assessment.
The remaining ∼90 minutes followed the two auditing processes
outlined in Section 3.3: in _profile auditing_, participants reviewed
model scores with linked behavioral evidence and refined interpretations; in _behavior auditing_, they evaluated personalized scenario


1The original CSI numbers items 1–96; we omit the Inscrutableness facet (4 items) due
to poor psychometric properties (see Appendix B).



6


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles



responses by rating alignment on a 1–5 scale and ranking three
anonymized responses generated from different personalization
sources, with the within-scenario order randomized. All collection
and processing occurred locally on participant devices, including
a locally hosted interface for the self-ratings, profile auditing, and
ranking and rating for the scenarios.
During the self-assessment, participants completed a 92-item
version of the CSI scale. Items were presented in the instrument’s
original interleaved questionnaire order (facets dispersed across
the 1–96 list rather than blocked by facet) to limit response-set
bias, and rated on a 1–5 Likert scale. See Appendix B for item order.



CSI is a behaviorally anchored measure validated across diverse
settings [14], so constraining ratings to workplace contexts is a
standard contextualization aligned with our downstream workplace
scenario evaluation. Participants were specifically instructed to
judge their work-self only—i.e., to base each rating on how they
typically communicate in professional settings and to exclude nonwork contexts.


**5** **Findings**


Participants generally described ASPECT-generated profile to be
meaningful and insightful, largely because the extracted evidence



7


Shang, et al.



**Dimension** **Facet** **Example Item**



**Expressiveness**


**Preciseness**


**Verbal**
**Aggressiveness**



Talkativeness “I like to talk a lot.”
Conv. Dominance “I often take the lead in a conversation.”
Humor “My jokes always draw a lot of attention.”
Informality “I address others in a very casual way.”


Structuredness “My stories always contain a logical structure.”
Thoughtfulness “I think carefully before I say something.”
Substantiveness “Conversations with me always involve some important topic.”
Conciseness “I don’t need a lot of words to get my message across.”


Angriness “I tend to snap at people when I get annoyed.”
Authoritarianism “I expect people to obey when I ask them to do something.”
Derogatoriness “I have at times made people look like fools.”
Nonsupportiveness “I always show a lot of understanding for other people’s problems.” (R)



**Table 1: A subset of the CSI scale we used for this system. The full CSI contains 6 dimensions, 23 facets, and 92 items rated on a**
**5-point scale (1=strongly disagree, 5=strongly agree). (R) indicates reverse-coded items. See Appendix B for full scale.**



felt concrete and on-point. Participants consistently commented:
“ _The examples are good..._ _it did a good job_ ” (P2); “ _I really love how_
_it took the data and the examples..._ _for each category_ ” (P6); “ _these_
_examples are actually really good_ ” and the social-dynamics analysis
was “ _very interesting_ ” (P12). P12 also noted the system correctly
surfaced multiple humor instances unique to them. Others explicitly
accepted the assessments: “ _I accept [it]..._ _that’s a correct assessment_ ”
(P14). P10 highlighted, “ _I think that its assessment of my personality_
_is_ _better_ _than_ _my_ _own_ _assessment_ _of_ _my_ _personality,_ _at_ _least_ _in_ _a_
_professional setting and that is delightful._ ”
Beyond surface-level linguistic cues, the system recovered latent
patterns and habits. P10 noted it correctly inferred a dispositional
tendency to “run meetings” even when not leading. P18 and P6 realized the “structured” assessments and examples correctly reflected
their consistent practice of pre-polishing messages before sending
them out, even though they considered themselves naturally unstructured; P13 made this explicit, “ _I try very hard to be structured..._
_drafted..._ _before sending_ ” and affirmed it generalizes to new-group
interactions “ _This is how I talk_ ”.
To understand how ASPECT works beyond these impressions,
we conducted a systematic mixed method evaluation for our entire
pipeline design through two evaluation axes: the accuracy of the
inferred profile and its downstream utility for response generation. The following sections (Section 5.1 and Section 5.2) will be
organized by two research questions.
_**RQ1**_ _**Inference**_ _**alignment**_ **-** **How** **accurately** **can** **an** **LLM**
**infer individuals’ communication-style profiles from work-**
**place data?** Compared to the self-report of over 92 items ( _𝑁_ =20;
1 _,_ 840 pairs), alignment is meaningful but imperfect (MAE=1 _._ 39,
weighted _𝜅_ =0 _._ 34, within-person mean _𝜌_ =0 _._ 39; dimension-level _𝜌_
up to 0 _._ 72). We analyzed the review process as an _analytic probe_
_and calibration_ of this initial inference: in ∼ 17 _._ 7% of facet reviews,
participants either adopted the AI score or negotiated a middle
ground, indicating that discrepancies often reflect self-bias, construct interpretation, or coverage limits rather than pure model
error.



_**RQ2 Behavioral alignment**_ **- Is social imitation via a AS-**
**PECT** **profile** _**sufficient**_ **to** **produce** **responses** **that** **partici-**
**pants judge as appropriate in real workplace scenarios?** In a
blinded, within-subject triad (600 evaluations), profile-conditioned
responses win 42 _._ 5% of first-place ranks (vs. 32 _._ 5% Generic, 25 _._ 0%
Self-Report), receive higher mean alignment ratings (3 _._ 33 vs. 3 _._ 09
vs. 2 _._ 95), and are preferred over Self-Report (Friedman _𝜒_ [2] =9 _._ 31,
_𝑝_ = _._ 0095; Wilcoxon _𝑝_ = _._ 0067) with a small but significant lift over
Generic (LMM _𝛽_ =0 _._ 24, _𝑝_ = _._ 045). Preferences depend on person and
scenario type.


**5.1** **RQ1: Inference Alignment**


_5.1.1_ _Statistical Results._


_What we measured and why._ To test whether the profiling stage
provides a good _starting profile_ (Evaluation frame), we compared
ASPECT ’s ratings to participants’ self-ratings. We analyze _𝑁_ =20
participants with 1,840 paired item ratings (92×20), aggregated to
23 facets and 6 dimensions. All self-ratings were anchored to the
_work-self_ and administered in the instrument’s interleaved order
to reduce response sets (Section 4.1).
We report: (i) _exact match_ and _mean absolute error_ (MAE) to summarize numeric closeness on the 1–5 scale; (ii) _bias_ (signed mean
difference) to detect systematic over-/under-estimation by ASPECT;
(iii) _agreement beyond chance_ using weighted _𝜅_ ; (iv) _rank correlations_
_𝜌_ to capture profile _shape_ (relative highs/lows) either within-person
(across items for each participant) or between-people (for a given
trait, does ASPECT order participants like self-reports?); and (v)
_ICCs_ [ICC(A,1) for absolute agreement; ICC(C,1) for consistency]
to summarize two-rater reliability. Items are treated as integers;
facets and dimensions are arithmetic means of their items.


_Overall alignment._ Across items, exact numeric matches occur
in 23 _._ 8% of cases; MAE is 1 _._ 39 on the 1–5 scale (95% CI [1 _._ 34 _,_ 1 _._ 45]),
indicating typical disagreements of about one category. Agreement
beyond chance is fair (weighted _𝜅_ = 0 _._ 34). Importantly, withinperson rank correlation averages _𝜌_ = 0 _._ 39 (95% CI [0 _._ 31 _,_ 0 _._ 44]):



8


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


**Table 2: Agreement Summary: Overall, Dimensions, and Facets (Side-by-side)**



**Overall and Dimensions**

Metric Value 95% CI


Exact Match % 23.8      MAE (absolute difference) 1.39 [1.34, 1.45]
Weighted Kappa 0.34      Mean Within-Person _𝜌_ 0.39 [0.31, 0.44]


Dimension MAE Bias _𝜌_


Verbal Aggressiveness 0.59 -0.40 0.39
Emotionality 0.74 -0.05 0.20
Questioningness 0.74 0.23 0.26
Impression Manipulativeness 0.82 -0.47 -0.03
Expressiveness 1.02 0.99 0.48
Preciseness 1.69 1.69 0.18


even when absolute values differ, ASPECT often recovers each
person’s relative highs and lows (Table 2).


_Dimension-level patterns._ Alignment is heterogeneous by dimension. Verbal Aggressiveness and Emotionality show the smallest
errors and fair reliability (e.g., Verbal Aggressiveness: MAE = 0 _._ 59,
bias = −0 _._ 40, between-person _𝜌_ = 0 _._ 39, ICC(A,1) = 0 _._ 35; Emotionality: MAE = 0 _._ 74, bias = −0 _._ 05, _𝜌_ = 0 _._ 20, ICC(A,1) = 0 _._ 31), suggesting ASPECT captures overt interpersonal tone reasonably well.
In contrast, Expressiveness (MAE = 1 _._ 03, bias = +0 _._ 99, _𝜌_ = 0 _._ 48)
and especially Preciseness (MAE = 1 _._ 69, bias = +1 _._ 69, _𝜌_ = 0 _._ 18,
ICCs ≈ 0) show larger numeric gaps with over-rating by ASPECT,
indicating a calibration need for structural/organizational traits.


_Facet-level patterns._ Facets with clear linguistic signals align better—for example, Angriness (MAE = 0 _._ 51, bias = −0 _._ 49, _𝜌_ = 0 _._ 34,
ICC(A,1) = 0 _._ 25), Charm (MAE = 0 _._ 65, bias = −0 _._ 08, ICC(A,1)
= 0 _._ 26), and Humor (MAE = 0 _._ 81, bias = −0 _._ 11, _𝜌_ = 0 _._ 43, ICC(A,1)
= 0 _._ 33). Facets that hinge on subtle intent or context, such as Nonsupportiveness (MAE = 0 _._ 89, bias = −0 _._ 49, low ICCs) and Inquisitiveness (MAE = 0 _._ 90, bias = +0 _._ 48, ICCs ≈ 0), are more challenging.
Bland–Altman limits typically span about ±2 points across facets,
reflecting genuine between-person variability.


_Item-level examples._ High agreement concentrates on directly
observable behavior (e.g., “Even when I’m angry, I won’t take it out
on someone else.”), where MAE runs ∼ 0 _._ 25–0 _._ 50 and exact matches
can exceed 60%. Lowest agreement arises for abstract tendencies
(e.g., “Conversations with me always involve some important matter.”), where MAE can exceed 2 and _𝜅_ ≈ 0.


_Response-style check._ To rule out scale-use artifacts (e.g., some
people avoid 1s/5s), we z-standardized ratings within participant
for both self and ASPECT and recomputed correlations. Results are
unchanged to three decimals at all levels (items: mean _𝜌_ = 0 _._ 386
raw vs. 0 _._ 386 standardized; facets: 0 _._ 466 vs. 0 _._ 466; dimensions: 0 _._ 720
vs. 0 _._ 720), indicating that discrepancies largely reflect substantive
differences rather than response styles. Cosine similarities (items
= 0 _._ 384, facets = 0 _._ 468, dimensions = 0 _._ 732) tell the same story.



**Facets (by** _𝜌_ **)**


_Highest agreement_
Facet MAE Bias _𝜌_


Humor 0.81 -0.11 0.43
Sentimentality 1.29 0.79 0.39
Defensiveness 1.80 -1.80 0.38
Angriness 0.51 -0.49 0.34
Worrisomeness 1.54 0.81 0.26


_Lowest agreement_


Thoughtfulness 1.27 1.27 -0.26
Informality 1.51 1.51 -0.21
Derogatoriness 0.91 -0.34 -0.17
Structuredness 1.39 1.39 -0.16
Inquisitiveness 0.90 0.47 -0.15


_Within- vs. between-participant agreement._ Within individuals,
ASPECT preserves profile shape (median _𝜌_ in Table 2: items =
0 _._ 46, facets = 0 _._ 55, dimensions = 0 _._ 72). Between participants, ASPECT better differentiates who is more _Expressive_ (dimension-level
_𝜌_ = 0 _._ 48) and moderately distinguishes _Emotionality_ ( _𝜌_ = 0 _._ 20).
Between-person discrimination at finer levels is weak (facet/item _𝜌_
often near zero), which is expected given limited observations per
facet.


_Reliability context._ Where underlying measures are internally
consistent, agreement improves. Several self facets have high _𝛼_
(≥ 0 _._ 80) while ASPECT ’s reliabilities vary (e.g., strong on Conversational Dominance, weaker on Talkativeness). Averaged across
items, ICC(A,1) = 0 _._ 345 and ICC(C,1) = 0 _._ 349 indicate fair two-rater
reliability, with the strongest dimension-level ICCs for Verbal Aggressiveness (up to 0 _._ 45) and the weakest for Preciseness (∼ 0),
mirroring MAE/bias patterns.


_Summary._ In this sample, ASPECT recovered recognizable communication patterns for most participants. Absolute alignment is
modest (MAE ≈ 1 _._ 4, _𝜅_ ≈ 0 _._ 34), but relative agreement is stronger,
especially at the dimension level, suggesting the pipeline preserves
the relative shape of individuals’ profiles even when absolute scores
diverge. Systematic biases (e.g., over-rating on Preciseness) signal
where calibration can help. As we show next, the auditing stage
leverages these signals: participants review evidence, negotiate
definitions, and adjust scores, turning the initial profile into a useraligned representation suited for downstream scenarios.


_5.1.2_ _Auditing as Bidirectional Alignment._ Through profile auditing, participants compared side-by-side scores, read evidence-linked
rationales, clarified how constructs were defined, recalled additional
context not captured in the examples, and assessed whether the
pipeline behaved consistently. We find that quantitative misalignment in Section 5.1.1 were often more nuanced than error alone,
and auditing operates as a calibration and reflection step rather
than a simple accept/reject check.
Participants examined ASPECT’s outputs for each of the 23 facets
against their self-assessments while thinking aloud and reviewing



9


ratings, linked examples, and rationales. This yielded 411 facetlevel evaluations (20 participants × 23 facets, minus cases without
explicit feedback). Three researchers independently coded a subset,
reconciled differences over three rounds, and one researcher verified
all instances before thematic analysis. The category counts below
are descriptive indicators of the overall distribution. These numbers
should be interpreted as approximate rather than exact. We estimate
that on the order of 5–10 cases per category could be borderline or
mislabeled despite reconciliation. Each audit decision was coded
into mutually exclusive categories:


   - _Totally Aligned_ ( _𝑛_ =141): Clear agreement; evidence accepted.

   - _Misalign–Disapprove_ ( _𝑛_ =142): Participants defended the
self-rating and rejected the model’s.

   - _Misalign–Middle Ground_ ( _𝑛_ =42): Participants deemed both
sides partly right and sought a compromise.

   - _Misalign–Approve AI_ ( _𝑛_ =31): Participants revised their selfrating to match the model after reviewing evidence.

   - _Unsure/Not Mentioned_ ( _𝑛_ =55): No clear decision or insufficient rationale (often due to limited evidence).


_Interpretation._ Through this process, we find auditing both _re-_
_duces resolvable error_ and _documents principled, context-dependent_
_differences_ . Participants _changed their initial self-ratings_ in ∼ 17 _._ 7%
(73/411) facet reviews: ∼ 7 _._ 5% (31/411) fully adopted the AI score
and ∼ 10 _._ 2% (42/411) negotiated an explicit middle ground. In our
coding process, we noticed a nontrivial share of “misalignments”
reflected individuals’ self-rating bias. This indicates auditing produces measurable movement toward evidence when accurately
provided. This also means that the pre-audit itemwise statistical
metrics (e.g., MAE, _𝜅_ in Section 5.1.1) are conservative lower bounds
on alignment. We conducted thematic analysis across these five
different audit decisions, and the following sections detail common
recurring themes.


_5.1.3_ _Where ASPECT matched participants’ self-assessments._ Direct, unambiguous alignments happened frequently when it was
assessing stable or salient communication styles of participants. For
example, P20 on talkativeness: “ _I think it aligns with me pretty well._
_I always have a lot to say..._ _I like to explain and elaborate things..._
_which are correct._ ” P14 on humor: “ _AI and I see face to face._ ” When
ASPECT surfaced structured chains (overviews, bullets, ordered
steps), participants confirmed these as accurate habits. P20: “ _Consis-_
_tently provides clear sequence..._ _bullet points..._ _This is what I would_
_love to do actually._ ” P10: “ _I like that it thinks that my stories always_
_have logical structure._ ” Participants who habitually ask questions
or float unconventional takes recognized themselves immediately.
P10 on unconventionality: “ _[I have] a very high rate of hot takes_
_per minute, and the AI seems to be capturing that._ ” P13 on inquisitiveness: “ _I matched the AI on this one._ ” P13 on charm: “ _This one is_
_actually pretty accurate..._ _This is how I talk, especially with a new_
_group of people._ ”
We also find a portion of exact matches when the system finds
_no behavioral examples_ for a facet and, by design, instantiated a low
(negative) endorsement. For example, for an item under _Angriness_,
“I tend to snap at people when I get annoyed.,” if no evidence is
retrieved the item is set to 1 (Strongly Disagree), reflecting a low
level of _Angriness_ . The pattern was clear for from the distribution



Shang, et al.


in Figure 5 in Appendix that these no-evidence cases cluster around
negative traits in the constructs. Take _Angriness_ as an example: P2
noted, “ _It rated me one. I rated myself 1.75..._ _I do believe I’ve never_
_been_ _angry_ _in_ _the_ _workplace_ ”, and P17 echoed, “ _I_ _feel_ _like_ _that_ _is_
_very reflective of me_ ”. P1 also commented that all the facets under
_Impression Manipulativeness_ are “ _largely in line_ ” by noting there
was “ _not as much data for these_ ”.


_5.1.4_ _Correct inference and self-rating bias emerge upon reflection._
In many cases, the examples reminded participants of behaviors
they had not fully considered. P13, when shown examples of tense
interactions, said “ _this actually happened and I actually felt really_
_uneasy at the time,_ ” acknowledging that they had initially underestimated their tension. P10 also expressed surprise at the system’s
evidence of humor, saying “ _I said that I don’t often make other people_
_laugh_ _and_ _it_ _says_ _actually_ _no,_ _you_ _do..._ _thanks_ _AI._ ” P4 described
underestimating their own talkativeness and concluded that “ _the_
_AI was right and I was maybe..._ _underestimating how much I speak._ ”
These cases show how surfacing forgotten or minimized evidence
led participants to adjust their self-view.
Through reflection, participants often realized they had been too
critical of themselves. After reviewing examples of their structured
communication, P15 noted “ _maybe I’m just a little harsh on myself_ ”.
The same participant reconsidered their ratings on conciseness and
tension, concluding they had been more capable than they had
acknowledged. P16 also recognized that their structured way of
“ _spelling out the steps_ ” was clearer than they had credited themselves
for and said they “ _would bump myself up._ ”
Participants noticed a discrepancy between how they see themselves or wish to be seen as versus how they present themselves
to others. Because participants sometimes self rate by referring to
an implicit “ideal self”, while ASPECT can observe only the latter
(the enacted, audience-shaped behavior in workplace traces), several “misalignments” led to interesting self reflection. P13 noted
that being talkative in meetings did not imply comfort: “ _it doesn’t_
_necessarily mean I’m very comfortable when I talk a lot._ ” They also
emphasized that their structured style was effortful and professional rather than natural: “ _This is..._ _not really who I am. It’s about_
_how I want to be presented._ ” P10 similarly recognized a gap between
aspiration and observation: they preferred to appear less sentimental or worried at work, yet the AI correctly identified higher levels
of sentimentality and worry in their communications. For P19, conversational dominance was behaviorally accurate but role-driven:
“ _part of my job is to direct the conversation,_ ” not a stable personal
style.


_5.1.5_ _Calibrations are needed to find middle ground._ Twenty-four
percent of facet evaluations (99/411) resulted in participants seeking
a middle ground between self and AI ratings. P4 made this explicit:
“ _I should have rated myself a point higher and it should have rated me_
_a point lower. And then we would have agreed._ ” These negotiations
occurred through mechanisms supported by information provided
in the auditing process, when participants could specify exactly
what made each assessment partially correct.
Participants recognized that their behavior varied systematically
across contexts and some of the misalignments come from that.
P13 on talkativeness: “ _The workplace situation would prompt me to_
_be very talkative during meetings. It doesn’t necessarily mean I’m_



10


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


_very comfortable._ ” They acknowledged the AI correctly captured
their meeting behavior (supporting a high rating) while their selfassessment reflected discomfort with that behavior (supporting a
lower rating). They eventually decided on a 4/5 compromise that
encode both contexts. P19 demonstrated the same pattern with
unconventionality: “ _I_ _do_ _[toy_ _with_ _wild_ _ideas]..._ _but_ _I_ _don’t_ _do_ _it_
_necessarily in conversation._ ”
When confronted with mixed behavioral evidence, some participants explicitly calculated averages. P15 on conciseness: “ _Is this like_
_75 examples of short and sustained versus one or two examples of very_
_lengthy? Therefore, four out of five._ ” They weren’t confused—-they
were computing a frequency-weighted score. P11 made the same
calculation for talkativeness, noting “ _many of the time I also respond_
_with a yes or a done,_ ” leading to 4/5 rather than AI’s 5/5. P17 similarly reasoned through multiple facets by weighing contradictory
evidence: extensive speaking in some meetings, silence in others.
Middle ground also emerged when participants discovered mismatches in measurement definitions. P12 initially rated themselves
1/5 on ingratiation, interpreting it as sycophancy. After seeing
examples of routine compliments, they did not fully accept the
AI’s 4/5 but chose 2-3 to reflect both their new understanding and
their moderate use of compliments. This pattern repeated across
constructs with loaded terms. P15 accepted being humorous but
rejected “ _teasing_ ” as a characterization. P19 agreed they used charm
but disputed “ _flirting._ ” Participants corrected their understanding
while maintaining boundaries around unwanted labels.


_5.1.6_ _Sources_ _of_ _mischaracterizations_ _and_ _errors._ To clearly lay
out and compare the types of mischaracterizations together, we
presented those in Table 3, summarizing sources of these issues and
reasons participants gave when self and model scores diverged.


**5.2** **RQ2: From Profiles to Social Performance**


While ASPECT demonstrates meaningful inference of communication styles (Section 4.1), accurate trait assessment does not automatically translate to appropriate social representation. We therefore
examined whether inferred profiles generated contextually appropriate responses across 10 workplace scenarios, comparing three
response conditions: _Generic_, _Self-Report_, and _Profiled_ .


_5.2.1_ _Statistical Results._ Across 600 evaluations (20 participants
× 10 scenarios × 3 conditions), responses generated from _Profiled_
were preferred over the alternatives on aggregate.


_Win rates._ _Profiled_ responses were ranked first in 42.5% of scenarios (85/200, 95% CI [35.9%, 49.4%]), compared to 32.5% for _Generic_ (65/200)
and 25.0% for _Self-Report_ (50/200, 95% CI [19.5%, 31.4%]).


_Rankings._ Mean ranks followed the same hierarchy: _Profiled_ ( _𝑀_ =
1 _._ 84 _,𝑆𝐷_ = 0 _._ 82), _Generic_ ( _𝑀_ = 2 _._ 00 _,𝑆𝐷_ = 0 _._ 81), _Self-Report_ ( _𝑀_ =
2 _._ 15 _,𝑆𝐷_ = 0 _._ 79). To test whether these differences were systematic, we conducted a Friedman test (a non-parametric alternative to
repeated-measures ANOVA appropriate for ordinal ranks). Results
showed a significant main effect of condition ( _𝜒_ [2] = 9 _._ 31, _𝑝_ = _._ 0095,
Kendall’s _𝑊_ = 0 _._ 023). Post-hoc Wilcoxon signed-rank tests with
Holm–Bonferroni correction were used to compare conditions pairwise. Only the comparison between _Profiled_ and _Self-Report_ remained significant ( _𝑝_ = _._ 0067, _𝑟_ = _._ 22), while differences between


11



_Profiled_ and _Generic_, and between _Generic_ and Self, did not reach
significance.


_Ratings._ On the 5-point alignment scale, _Profiled_ again led ( _𝑀_ =
3 _._ 33 _,𝑆𝐷_ = 1 _._ 29), followed by _Generic_ ( _𝑀_ = 3 _._ 09 _,𝑆𝐷_ = 1 _._ 28) and
_Self-Report_ ( _𝑀_ = 2 _._ 95 _,𝑆𝐷_ = 1 _._ 19). Because ratings are continuous
and approximately interval-scaled, we analyzed them using linear
mixed-effects models with random intercepts for participant and
scenario. The simplified model (due to convergence limits) revealed
that _Profiled_ were rated significantly higher than _Generic_ responses
( _𝛽_ = 0 _._ 24, _𝑝_ = _._ 045), while _Self-Report_ did not significantly differ
( _𝛽_ = −0 _._ 14, _𝑝_ = _._ 26). Pairwise Cohen’s _𝑑_ confirmed small but
consistent effects: _𝑑_ = 0 _._ 30 for _Profiled_ vs. _Self-Report_, _𝑑_ = 0 _._ 19 for
_Profiled_ vs. _Generic_ .


_Summary._ On aggregate, the data suggest a preference ordering
_**Profiled**_ _>_ _**Generic**_ _>_ _**Self-Report**_ . Participants’ own self-reported
profiles performed worst, even below _Generic_ baselines. This suggests that CSI ratings alone, without behavioral grounding, do not
translate into more aligned responses; adding behavioral evidence
from communication history improves alignment within our sample.


_5.2.2_ _Individual Variation Dominates Aggregate Patterns._ Despite
aggregate preferences for _Profiled_ -generated responses, individual differences were substantial. Random slopes analysis revealed
wide variability in condition effects (SD = 0.87 for _Self-Report_, SD
= 0.94 for _Profiled_ ), exceeding the conventional 0.5 threshold for
meaningful heterogeneity.
Nine participants (45%) showed strong preferences for _Profiled_,
two (10%) strongly preferred _Self-Report_, and the remaining nine
(45%) exhibited mixed or weak preferences. For example, Participant 2 consistently rated _Profiled_ responses over a point higher
than _Generic_ on the 5-point scale, whereas Participant 19 showed
the opposite, preferring _Self-Report_ by nearly a point.
Agreement across participants was extremely low (Kendall’s
_𝑊_ = 0 _._ 077), highlighting that individuals showed low concordance
on what constituted a good response. What one participant rated
as perfectly aligned (5/5), another might rate as misaligned (2/5).
Scenario-specific patterns were also observed (e.g., _Profiled_ dominated Scenario 1, whereas _Generic_ responses were favored in Scenario 9), though systematic scenario-type effects require further
analysis.
On aggregate, _**Profiled**_ **responses were preferred over** _**Self-**_
_**Report**_ **and** _**Generic**_ **responses, but individual variations dom-**
**inated the pattern** . However, the strong individual differences
observed here underscore the need for adaptive personalization,
allowing users to calibrate how much the system should rely on
behavioral inference versus self-report.


_5.2.3_ _Signals of Condition-based Preferences._ Figure 4 shows, for
each of ten scenarios, which condition won and how strong the
agreement was. Bar color is the winning condition ( _Generic_, _Self-_
_Report_, or _Profiled_ ) chosen by the majority of participants. Bar
height is the win margin, defined as the number of participants
who ranked the winner first minus the number who ranked the
runner-up first. The label “n=” on each bar is how many of the 20
participants selected the winner. Across 10 scenarios, _**Profiled**_ wins
in 5, _**Generic**_ wins in 4, and _**Self-Report**_ wins in 1. Large margins


Shang, et al.


**Theme** **Concise definition** **Typical signals** **Representative exemplar**



**T1. Coverage & observ-**
**ability gaps** _Data limita-_
_tion_


**T2.** **Situational** **norms**
**misread** **as** **traits**
_Method issue_


**T3.** **Tone** **&** **valence**
**misinterpretation** _Fun-_
_damental LLM limitation_
(amplified by data limits)


**T4.** **Construct** **/** **item**
**misalignment** _Method_
_issue_


**T5.** **Evidence** **use** **&**
**scoring integrity prob-**
**lems** _Method + tooling is-_
_sue_



Ratings inferred from a narrow slice of digital/recorded data; misses offline talk, pre-record
small talk, multimodal cues, _internal states_, and rarebut-salient incidents.


Role-, task-, or meeting-driven behavior (e.g., PM
leading, presentations, risk triage) inferred as stable
dispositional style.


Pragmatics are literalized: sarcasm, playful banter,
emojis, and praise are reinterpreted as aggression,
anxiety, manipulation, or command-giving.


Participant and instrument use different definitions
or item scopes (operationalization drift; ambiguous
boundaries).


Overreach from single examples; cherry-picking
brief messages; contradictory facet pairings; speaker
misattribution; contamination; inconsistent “no evidence → mid score” logic.



Channel/recording limits; observer effects; offline/inperson only; internalized affect; low-frequency
events not visible.


PM/presenter talk required; task-necessitated structure/precision; professional risk language ≠ personal
anxiety; discretion ≠ concealingness.


Sarcasm literalized; joking directives read as authoritarian; emoji/politeness read as stress; praise/cheerleading ≠ ingratiation/charm.


Constructive challenge ≠ argumentative; technical
theory ≠ philosophicalness; item asks about tears vs.
AI coding general emotion; politeness ≠ sentimentality.


Single-example inflation; brevity cherry-pick; logical contradictions; mic-host attribution; third-party
input contamination.



“We do 5 minutes of informal talk before recording; AI only sees recorded formal content.” [P15] “Philosophical discussions happen offline (in person), not on
Teams.” [P5] “Comments affect me emotionally, but I don’t show it in written
communication.” [P11]


“Presentations require me to talk; that
doesn’t mean I’m generally talkative.”

[P2] “‘Worry’ here reflects PM risk management, not personal anxiety.” [P15]
“Swap in any teammate in these meetings
and they’d also look dominant.” [P16]


“The ‘dirty green walls’ line was sarcasm,
not sentimentality.” [P14] “The ‘Don’t do
it’ interruption was playful banter with
close colleagues.” [P19] “Praise for interns was genuine appreciation, not a
manipulation tactic.” [P15]


“Constructive challenge ≠ argumentative.” [P1] “Theory/framework talk is
technical, not ‘philosophical.”’ [P2] “The
item asks about tears; the AI coded general emotion instead.” [P12]


“One worry example shouldn’t make
all worry items 5/5.” [P2] “The AI
rated me both concise and talks-alot—contradictory.” [P11] “As meeting
host, others’ comments were attributed
to me.” [P4]



**Table 3: Typology of sources of AI–self misalignment (RQ1), grouped by root cause:** _**Data limitations**_ **(T1),** _**Method issues**_ **(T2, T4,**
**T5), and** _**Fundamental LLM limitations**_ **(T3). Themes are not mutually exclusive; multi-coding is allowed.**


**Cluster** **N** **Mean Win Rate** **Mean Rating Margin** **Participants**


Prefers Profiled 10 0.60 0.73 P2, P4, P6, P10, P12, P13, P15, P16, P17, P18
Prefers Generic 4 0.57 0.75 P1, P5, P8, P9
Prefers Self-Report 2 0.70 0.85 P14, P19
Mixed / No Clear Preference 4 _–_ 0.05 P3, P7, P11, P20


**Table 4: Participant clusters. We clustered participants by comparing which condition (** _**Generic**_ **,** _**Self-Report**_ **,** _**Profiled**_ **) most**
**often “won” on three summary metrics: win rate (proportion of first-place ranks), mean rank, and mean rating. To avoid**
**over-interpreting small differences, we required either (a) a condition to win at least two of the three metrics and show a**
**meaningful margin (** ≥ 0 _._ 20 **in win rate,** ≥ 0 _._ 25 **in rating, or** ≥ 0 _._ 20 **in rank), or (b) to win one metric with a strong margin (** ≥ 0 _._ 30 **,**
≥ 0 _._ 40 **,** ≥ 0 _._ 30 **respectively). These thresholds were chosen to align with the observed separations in our data (median margins**
≈ 0 _._ 30 **for win rate, 0.55 for rating, 0.40 for rank, all with IQRs spanning 0.1–0.7), ensuring they capture differences larger**
**than typical within-participant variability. Participants without a clear advantage for any condition were labeled as Mixed.**
**Sensitivity checks with slightly stricter or looser cutoffs shifted at most one participant per cluster, suggesting our results are**
**robust.**



indicate strong agreement (e.g., S3 and S8); small margins (e.g., S9)
indicate mixed preferences despite a clear majority.
We cross-analyzed each scenario’s winner and margin against its
APRACE metadata (purpose, hierarchy, familiarity, stakes, formality,
and mode) to identify patterns between scenario type and preferred
condition. We focus on the preference for _Generic_ and _Profiled_ since
it is difficult to see pattern given _Self-Report_ has only one win
and the margin is minimal. Participants tend to prefer _**Profiled**_ in
scenarios when the task is tightly defined and success depends on



the usual way of organizing and speaking. This includes explaining
their work to a distant peer (S1), responding in chat when a peer
questions their approach (S3), planning a new initiative with a
manager in a formal setting (S4), giving a concise standup update
(S7), and discussing credit attribution with a distant peer (S9). These
settings reward structure, pacing, and the balance between firmness
and support that show up in a person’s real communication history.
On the other hand, participants tend to prefer _**Generic**_ when the
goal is light coordination or the emotional tone is unclear. This



12


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


**Figure 4: Win margin of each condition across participants and 10 scenarios.**



includes setting the tone at a weekly check-in (S1), handling a
last-minute schedule change (S5), acknowledging an unexpected
process change (S8), and planning a team celebration (S10). This
is likely because neutral, generic phrasing is _sufficient_ and _safer_ in
those scenarios. We further analyzed qualitative data of participants’
rationales to understand this.
Overall participants showed a general preference for responses
that sounded more like themselves or their personal style. However,
across the scenarios we noticed patterns of conditions that better
captured participants’ style. We noticed that participants who preferred _Profiled_ often also referenced how the scenario captured a
fuller perspective of how they wanted to be captured, including details on their enthusiasm or approach. For instance, P10 highlights
this by indicating that responses were “ _very specific about what we_
_would actually do, which I feel like is just...that’s how I would talk in_
_a hallway or like that’s how I would talk with a co-worker._ ” However,
this perspective varied across participants.
In fact, participants who preferred _Generic_ did not like the level
of excitement or emotion that may have been out of the norm
for how they communicate at work. Specifically, P9 highlighted
that “ _It is trying to be very personal to me, but it is the wrong per-_
_sonal. And so I am deeply uncomfortable with it because I’m like, this_
_isn’t my voice._ ” Finally, participants who preferred _Self-Report_ often
cited the low-jargon, more universally collegial way of connecting
with colleagues. P14 referred to the “ _safe_ ” or “ _corporate thing to do_ ”
when selecting responses. P19 also went on to highlight how these
responses were more aligned with their role as a leader. These divergent preferences suggest that no single personalization strategy
fits all users; effective systems must let individuals choose their
level of stylistic adaptation.



**6** **Discussion**

**6.1** **What we learned about building**
**data-grounded profiles**


Our design, implementation, and evaluation of ASPECT revealed
three factors that shaped profile quality in our study: (1) having
data to ground profile to concrete behavioral evidence; (2) a good
psychometric scale that fits the person’s profiling needs; and (3)
keeping users in the loop to add contextual insight into profile data
and provide profile evaluations.
**Data.** In our study, participants reviewed ASPECT’s construct
ratings by inspecting behavioral evidence and short rationales; this
grounded design led them to revise or negotiate their self-ratings.
Going forward, we can strengthen this process by showing uncertainty and coverage, preserving provenance for each example, or
keeping versioned audit trails. These directions align with work
on documentation and auditing—Model Cards for model reporting [38], Datasheets for dataset transparency [17], and internal
algorithmic auditing frameworks that support appropriate trust
calibration [32, 47].
**A good scale.** In this work, we used the Communication Styles
Inventory (CSI) to test the ASPECT framework, and our findings
show that not all CSI facets are equally observable in workplace text
and some invite interpretation mismatches at the facet level. This is
precisely where review helped participants clarify. The implication
is to support instrument interpretation alignment or even tailoring
with alternative communication scales when a construct is ill-fitted
for a user or communication channel. Prior validation work on CSI
provides the psychometric grounding and also highlights where
adaptations make sense; future versions of ASPECT can learn datadriven observability maps (i.e., which facets are detectable for a
given data source) and recommend the right instrument per context [14, 16].
**Users must stay in the loop as reviewers.** One finding from
our study is that the review workflow: side-by-side comparisons,



13


linked evidence, and explicit user actions to calibrate assessment
supported meaningful calibration. Future systems should extend
this approach with more features to support both profile and behavior review. For example, the system could implement more advanced
ways for counter-evidence retrieval to combat confirmation bias
and coverage diagnostics that surface missing data. Moreover, the
system could afford user examining the change in alignment by
showing instant change in response style across downstream tasks.
Automated evaluation could also be implemented based on some
user manual review history to help quickly flag problematic cases.
These features are consistent with established guidance on algorithmic auditing, documentation, and trust-calibrated human-AI
collaboration [17, 23, 32, 38, 47].


**6.2** **Representation boundaries and sources of**
**mischaracterization**


Besides the instances where users calibrated their own score, we
also found various types of true mischaracterizations (Table 3).
Interestingly, not all mischaracterizations should be completely
removed, as many participants wish their digital representation to
be not exactly like them. The specific design of ASPECT maps out
two boundaries in the generated profile through data input and the
specific choice of psychometric constructs. That means, the generated profile is constructing a person as how they would behave
in a socially constructed context, as P14 described as showing the
“local minima/maxima” of their characteristics. In our study, this
context is naturally the work version of self. We find that Participants often defended context-appropriate self-presentation and
drew lines between their natural tendency, learned professional
behavior, and desired workplace image. In these cases, “creating a
behavioral average” would actually be undesirable, as they would
want to hide away part of self at work. These findings argue for
boundary-respecting profiles: constrain by constructs (what to measure) and by data source (what type of behaviors to be profiled). This
aligns with classic accounts of impression management [19] and
politeness/face-work [6], as well as audience design and accommodation—people adapt style to addressees and power relations [5, 18].
Because our review process made these boundaries visible, future
work could explore context-scoped representations: allow users to
pin profiles per context and usage, preview responses under those
settings, and opt-in to downplay traits they can exhibit but prefer
not to signal in a given setting. For example, a “workplace casual
chat” agent tuned for warmth and humor.
Other divergences in Table 3 reflect actionable limits in our
current system. To address these issues, future work could explore
supplementing textual data with other modalities of data sources
as well as engineering more validations to model outputs.


_Systematic biases as a learned insight._ Our evaluation revealed
that the pipeline systematically over-rates certain dimensions, particularly Preciseness (MAE=1.69, bias=+1.69, ICC≈0) and Expressiveness (bias=+0.99). Two mechanisms explain this pattern. First,
when the pipeline finds no behavioral evidence for a construct, it assigns a low endorsement score. This is informative for traits whose
absence in workplace text is meaningful (e.g., no evidence of angry
outbursts likely indicates low Angriness), but less so for traits that
are simply hard to observe in text (e.g., internal deliberation before



Shang, et al.


speaking). Second, workplace communication is filtered through
professional norms: messages tend to be edited, structured, and
purposeful, which inflates ratings on constructs like Preciseness
regardless of the individual’s natural tendencies. These biases were
not predictable before the study; they emerged through review, as
participants flagged constructs where the data systematically overstated their traits. This finding directly informs future calibration
work: once bias patterns are identified across a population of users,
automated corrections become feasible (e.g., dimension-specific
shrinkage or coverage-based weighting). Our study provides an
initial empirical basis for designing such corrections in this setting.


**6.3** **Using ASPECT framework in practice**


**Mimetic agents you can review and deploy.** In our scenarios,
_Profiled_ responses were preferred over _Generic_ and _Self-Report_ conditions on aggregate, and participants generally considered the
response generated is aligned with their style. This means these
profiles are already actionable for context-specific agents. ASPECT
produces a “portable” profile that can be used directly as an agent
prompt once generated. However, we found that participants exhibited a threshold effect in their tolerance for misalignment. P9,
explains this uncanny valley of social representation in detail: “ _I can_
_wear a generic Halloween face mask that’s not molded to my face at_
_all, and that’s fine. But if I have something that’s molded improperly_
_to my face, it’s deeply uncomfortable._ ” This captures a fundamental
challenge for mimetic agents: imperfect personalization often feels
worse than no personalization at all. As participants reviewed the
scenarios, we noticed the formation of an implicit alignment with
interpretation. For instance, participants also mentioned 95% vs
70% type of alignment. There is an unspoken threshold of when
it could be better to go with the _Generic_ option vs. _Profiled_ the
profiled option. At times it felt like when it came down to accurate representation without achieving it, the more unsettling the
experience became. This suggests that mimetic AI systems must
either achieve very high fidelity or clearly signal their limitations
to avoid falling into this uncomfortable middle ground where users
experience their digital selves as distorted rather than absent. These
distortions and working through the evolutions of them is a field
of work that should continue to be studied across contexts.
**Evidence-based profile for self-reflection.** Although we did
not intend to design ASPECT as a reflection tool, participants repeatedly engaged in reflective practices: they reconsidered their
habits when reading linked examples and justifications. Interestingly, though the review involves reading lots of text, most participants found it engaging and interesting to “learn about themselves”.
This opens up opportunities to leverage the ASPECT framework
and this type of individual social profiles to support self-reflection
practices, aligning with literature on self-explanation effect for
deeper understanding [10], and feedback-intervention theory for
crafting feedback that improves performance without triggering
defensiveness [28].
**A de-biasing aid for psychometric assessments.** We found
that seeing evidence and rationales upon misalignment triggers
calibration and reduces bias in self-assessment. This is in line with



14


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


a large literature showing that self-assessments are noisy and biased, from classic meta-analysis on limited validity [36] to Dunning–Kruger miscalibration [31], and to SOKA results and metaanalyses where informants sometimes predict behavior better than
the self [11, 50]. ASPECT’s approach could make psychometric
self-assessments more valid by using data inference as an external
anchor and observer of an individuals’ actions.


**7** **Limitations**


_**Limited scope.**_ For practical reasons elaborated in Section 4.1,
we tested ASPECT on only one source of data (workplace conversations), one psychometric scale (CSI), and participants from a single
organization. Recruiting within one organization was necessary
for trust (participants knew their data stayed within enterprise
boundaries) but limits generalizability. Our 20 participants skewed
toward technical roles comfortable with AI systems. We cannot
claim it generalizes to all personal communication, other scales,
or different organizational cultures. The use of 90-day window
on textual data missed longer-term behavioral patterns and richer
information about the individual. Hence, we would recommend
carefully building upon findings of our work and also encourage
future work to explore this with more general populations, other
data sources, and more modalities of data.


_**Model constraints.**_ The choice of prompting instead of more
advanced techniques such as fine-tuning limited our ability to correct systematic biases; this choice was largely driven by the time
and cost of running the study with 20 participants. Also, although
we iterated our pipeline extensively before running the study, some
fundamental problems with LLMs could not be avoided via better
prompts alone. For example, we observed a few cases of hallucinated outputs as the LLM attributed other speakers’ words to
participants in meeting transcripts, and occasionally added sentences that didn’t exist in the data. However, these were mostly
surface-level additions, not fabrication of new data that would affect
assessments.


_**Longitudinal evaluation upon deployment.**_ Our 2-hour sessions captured only initial reactions. The 10 workplace scenarios
were hypothetical, but future work could explore if participants’
preferences hold when AI responses have real consequences for
their relationships and reputation. Participants also did not experience extended use in practice. Future work should deploy this in
real life and test whether the auditing improvements persist over
time or degrade as contexts change.


**8** **Conclusion**


We presented ASPECT, an approach for building social profiles
from communication data. ASPECT constructs social style profiles
that make inferences from observed social interactions to assess validated psychometric constructs. In a 20-participant case study with
workplace communication scenarios, ASPECT produced initial profiles that participants largely recognized as capturing their personal
communication patterns. Our findings also revealed systematic
biases on a few dimensions. The profile review phase supported
calibration, moving participants toward more aligned profiles. The
scenario-based evaluation shows that ASPECT-generated profiled



responses were preferred over generic and self-report baselines
on aggregate, with preferences varying across individuals and scenario types. We characterize sources of misalignment and surface
challenges around data coverage, boundaries of self-representation,
and the desirable degree of representation fidelity. Our findings
from one workplace setting provide an empirical starting point;
the natural next steps are to vary the psychometric instrument,
broaden the data sources, and study how profiles hold up over time
and across organizational cultures.


**References**


[1] Character.AI 2025. _Character.AI_ . Character.AI. [https://character.ai/](https://character.ai/) Founded
2021; public beta launched September 16, 2022; founders Noam Shazeer and
Daniel de Freitas.

[2] Lisa P Argyle, Christopher A Bail, Ethan C Busby, Joshua R Gubler, Thomas Howe,
Christopher Rytting, Taylor Sorensen, and David Wingate. 2023. Leveraging
AI for democratic discourse: Chat interventions can improve online political
conversations at scale. _Proceedings of the National Academy of Sciences_ 120, 41
(2023), e2311627120.

[3] Rebekah Lee Baik, Stephanie Lee, Serena Jinchen Xie, Wang Liao, Elina H Hwang,
and Weichao Yuwen. 2025. Adapting Communication Styles in Health Chatbot
using Large Language Models to Support Family Caregivers from Multicultural
Backgrounds. In _Proceedings of the Extended Abstracts of the CHI Conference on_
_Human Factors in Computing Systems_ . 1–8.

[4] Angelique Bakker-Pieper and Reinout E de Vries. 2013. The incremental validity
of communication styles over personality traits for leader outcomes. _Human_
_Performance_ 26, 1 (2013), 1–19.

[5] Allan Bell. 1984. Language style as audience design. _Language in society_ 13, 2
(1984), 145–204.

[6] Penelope Brown. 1987. Politeness: Some universals in language usage.

[7] Souradip Chakraborty, Jiahao Qin, Evrard Garcelon, Alessandro Lazaric, Matteo
Pirotta, and Andrea Zanette. 2024. MaxMin-RLHF: Alignment with diverse
human preferences. In _Proceedings of the 41st International Conference on Machine_
_Learning_ .

[8] Ti-Chung Cheng, Carmen Badea, Christian Bird, Thomas Zimmermann, Robert
DeLine, Nicole Forsgren, and Denae Ford. 2024. GEMS: Generative Expert
Metric System through Iterative Prompt Priming. [arXiv:2410.00880](https://arxiv.org/abs/2410.00880) [cs.SE]
[https://arxiv.org/abs/2410.00880](https://arxiv.org/abs/2410.00880)

[9] Yi Fei Cheng, Hirokazu Shirado, and Shunichi Kasahara. 2025. Conversational
Agents on Your Behalf: Opportunities and Challenges of Shared Autonomy in
Voice Communication for Multitasking. In _Proceedings of the 2025 CHI Conference_
_on Human Factors in Computing Systems_ . 1–18.

[10] Michelene TH Chi, Nicholas De Leeuw, Mei-Hung Chiu, and Christian LaVancher.
1994. Eliciting self-explanations improves understanding. _Cognitive science_ 18, 3
(1994), 439–477.

[11] Brian S Connelly and Deniz S Ones. 2010. An other perspective on personality: meta-analytic integration of observers’ accuracy and predictive validity.
_Psychological bulletin_ 136, 6 (2010), 1092.

[12] Paul T Costa and Robert R McCrae. 2008. The revised neo personality inventory
(neo-pi-r). _The SAGE handbook of personality theory and assessment_ 2, 2 (2008),
179–198.

[13] Lee J Cronbach and Paul E Meehl. 1955. Construct validity in psychological tests.
_Psychological bulletin_ 52, 4 (1955), 281.

[14] Reinout E De Vries, Angelique Bakker-Pieper, Femke E Konings, and Barbara
Schouten. 2013. The communication styles inventory (CSI) a six-dimensional
behavioral model of communication styles and its relation with personality.
_Communication Research_ 40, 4 (2013), 506–532.

[15] Robert F DeVellis and Carolyn T Thorpe. 2021. _Scale development: Theory and_
_applications_ . Sage publications.

[16] Pierluigi Diotaiuti, Giuseppe Valente, Stefania Mancone, and Angela Grambone.
2020. Psychometric properties and a preliminary validation study of the Italian
brief version of the communication styles inventory (CSI-B/I). _Frontiers_ _in_
_Psychology_ 11 (2020), 1421.

[17] Timnit Gebru, Jamie Morgenstern, Briana Vecchione, Jennifer Wortman Vaughan,
Hanna Wallach, Hal Daumé Iii, and Kate Crawford. 2021. Datasheets for datasets.
_Commun. ACM_ 64, 12 (2021), 86–92.

[18] Howard Giles, Nikolas Coupland, and Justine Coupland. 1991. Accommodation
theory: Communication, context, and consequence. _Contexts of accommodation:_
_Developments in applied sociolinguistics_ 1 (1991), 1–68.

[19] Erving Goffman. 1959. The presentation of self in everyday life, Double Day
Anchor. _Garden City, NY_ (1959).

[20] Lewis R Goldberg. 1993. The structure of phenotypic personality traits. _American_
_psychologist_ 48, 1 (1993), 26.



15


[21] Jeffrey T Hancock, Mor Naaman, and Karen Levy. 2020. AI-mediated communication: Definition, research agenda, and ethical considerations. _Journal_ _of_
_Computer-Mediated Communication_ 25, 1 (2020), 89–100.

[22] Jess Hohenstein and Malte Jung. 2018. AI-supported messaging: An investigation
of human-human text conversation with AI support. In _Extended abstracts of the_
_2018 CHI conference on human factors in computing systems_ . 1–6.

[23] Sarah Susanna Hoppler, Robin Segerer, and Jana Nikitin. 2022. The Six Components of Social Interactions: Actor, Partner, Relation, Activities, Context, and
Evaluation. _Frontiers in Psychology_ Volume 12 - 2021 (2022). [doi:10.3389/fpsyg.](https://doi.org/10.3389/fpsyg.2021.743074)
[2021.743074](https://doi.org/10.3389/fpsyg.2021.743074)

[24] Jessica Huang, Ig-Jae Kim, and Dongwook Yoon. 2025. Mirror to Companion:
Exploring Roles, Values, and Risks of AI Self-Clones through Story Completion.
In _Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems_ .
1–15.

[25] Angel Hsing-Chi Hwang, John Oliver Siy, Renee Shelby, and Alison Lentz. 2024.
In whose voice?: examining AI agent representation of people in social interaction through generative speech. In _Proceedings_ _of_ _the_ _2024_ _ACM_ _Designing_
_Interactive Systems Conference_ . 224–245.

[26] Maurice Jakesch, Megan French, Xiao Ma, Jeffrey T Hancock, and Mor Naaman.
2019. AI-mediated communication: How the perception that profile text was
written by AI affects trustworthiness. In _Proceedings of the 2019 CHI conference_
_on human factors in computing systems_ . 1–13.

[27] Taewook Kim, Jung Soo Lee, Zhenhui Peng, and Xiaojuan Ma. 2019. Love in
lyrics: An exploration of supporting textual manifestation of affection in social
messaging. _Proceedings of the ACM on Human-Computer Interaction_ 3, CSCW
(2019), 1–27.

[28] Avraham N Kluger and Angelo DeNisi. 1996. The effects of feedback interventions
on performance: a historical review, a meta-analysis, and a preliminary feedback
intervention theory. _Psychological bulletin_ 119, 2 (1996), 254.

[29] Michal Kosinski, Sandra C Matz, Samuel D Gosling, Vesselin Popov, and David
Stillwell. 2015. Facebook as a research tool for the social sciences: Opportunities,
challenges, ethical considerations, and practical guidelines. _American psychologist_
70, 6 (2015), 543.

[30] Michal Kosinski, David Stillwell, and Thore Graepel. 2013. Private traits and
attributes are predictable from digital records of human behavior. _Proceedings of_
_the national academy of sciences_ 110, 15 (2013), 5802–5805.

[31] Justin Kruger and David Dunning. 1999. Unskilled and unaware of it: how difficulties in recognizing one’s own incompetence lead to inflated self-assessments.
_Journal of personality and social psychology_ 77, 6 (1999), 1121.

[32] John D Lee and Katrina A See. 2004. Trust in automation: Designing for appropriate reliance. _Human factors_ 46, 1 (2004), 50–80.

[33] Patrick Yung Kang Lee, Ning F Ma, Ig-Jae Kim, and Dongwook Yoon. 2023.
Speculating on risks of AI clones to selfhood and relationships: Doppelgangerphobia, identity fragmentation, and living memories. _Proceedings of the ACM on_
_Human-computer Interaction_ 7, CSCW1 (2023), 1–28.

[34] Joanne Leong, John Tang, Edward Cutrell, Sasa Junuzovic, Gregory Paul Baribault,
and Kori Inkpen. 2024. Dittos: Personalized, embodied agents that participate in
meetings when you are unavailable. _Proceedings of the ACM on Human-Computer_
_Interaction_ 8, CSCW2 (2024), 1–28.

[35] Xiao Ma, Jeffrey T Hancock, Kenneth Lim Mingjie, and Mor Naaman. 2017. Selfdisclosure and perceived trustworthiness of Airbnb host profiles. In _Proceedings_
_of the 2017 ACM conference on computer supported cooperative work and social_
_computing_ . 2397–2409.

[36] Paul A Mabe and Stephen G West. 1982. Validity of self-evaluation of ability: A
review and meta-analysis. _Journal of applied Psychology_ 67, 3 (1982), 280.

[37] Reid McIlroy-Young, Jon Kleinberg, Siddhartha Sen, Solon Barocas, and Ashton
Anderson. 2022. Mimetic models: Ethical implications of ai that acts like you. In
_Proceedings of the 2022 AAAI/ACM Conference on AI, Ethics, and Society_ . 479–490.

[38] Margaret Mitchell, Simone Wu, Andrew Zaldivar, Parker Barnes, Lucy Vasserman,
Ben Hutchinson, Elena Spitzer, Inioluwa Deborah Raji, and Timnit Gebru. 2019.
Model cards for model reporting. In _Proceedings_ _of_ _the_ _conference_ _on_ _fairness,_
_accountability, and transparency_ . 220–229.

[39] Lene Nielsen and Kira Storgaard Hansen. 2014. Personas is applicable: a study
on the use of personas in Denmark. In _Proceedings of the SIGCHI Conference on_
_Human Factors in Computing Systems_ . 1665–1674.

[40] Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida, Carroll Wainwright, Pamela
Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, et al. 2022.
Training language models to follow instructions with human feedback. _Advances_
_in neural information processing systems_ 35 (2022), 27730–27744.

[41] Joon Sung Park, Joseph O’Brien, Carrie Jun Cai, Meredith Ringel Morris, Percy
Liang, and Michael S Bernstein. 2023. Generative agents: Interactive simulacra
of human behavior. In _Proceedings of the 36th annual acm symposium on user_
_interface software and technology_ . 1–22.

[42] Joon Sung Park, Carolyn Q Zou, Aaron Shaw, Benjamin Mako Hill, Carrie Cai,
Meredith Ringel Morris, Robb Willer, Percy Liang, and Michael S Bernstein. 2024.
Generative agent simulations of 1,000 people. _arXiv preprint arXiv:2411.10109_
(2024).



Shang, et al.


[43] Nilay Patel. 2024. _The_ _CEO_ _of_ _Zoom_ _wants_ _AI_ _clones_ _in_ _meet-_
_ings_ . [https://www.theverge.com/2024/6/3/24168733/zoom-ceo-ai-clones-digital-](https://www.theverge.com/2024/6/3/24168733/zoom-ceo-ai-clones-digital-twins-videoconferencing-decoder-interview)
[twins-videoconferencing-decoder-interview](https://www.theverge.com/2024/6/3/24168733/zoom-ceo-ai-clones-digital-twins-videoconferencing-decoder-interview) Accessed: 2024-09-04.

[44] Ellie Pavlick and Joel Tetreault. 2016. An empirical analysis of formality in online
communication. _Transactions of the association for computational linguistics_ 4
(2016), 61–74.

[45] Sriyash Poddar, Yanming Wan, Hamish Ivison, Siddharth Choudhury, and
Natasha Jaques. 2024. Personalizing Reinforcement Learning from Human
Feedback with Variational Preference Learning. In _NeurIPS 2024 Workshop on_
_Pluralistic Alignment_ .

[46] Rafael Rafailov, Archit Sharma, Eric Mitchell, Christopher D Manning, Stefano
Ermon, and Chelsea Finn. 2023. Direct preference optimization: Your language
model is secretly a reward model. _Advances in neural information processing_
_systems_ 36 (2023).

[47] Inioluwa Deborah Raji, Andrew Smart, Rebecca N White, Margaret Mitchell,
Timnit Gebru, Ben Hutchinson, Jamila Smith-Loud, Daniel Theron, and Parker
Barnes. 2020. Closing the AI accountability gap: Defining an end-to-end framework for internal algorithmic auditing. In _Proceedings of the 2020 conference on_
_fairness, accountability, and transparency_ . 33–44.

[48] Omar Shaikh, Shardul Sapkota, Shan Rizvi, Eric Horvitz, Joon Sung Park, Diyi
Yang, and Michael S Bernstein. 2025. Creating General User Models from Computer Use. _arXiv preprint arXiv:2505.10831_ (2025).

[49] Ashish Sharma, Inna W Lin, Adam S Miner, David C Atkins, and Tim Althoff. 2021.
Towards facilitating empathic conversations in online mental health support:
A reinforcement learning approach. In _Proceedings of the web conference 2021_ .
194–205.

[50] Simine Vazire. 2010. Who knows what about a person? The self–other knowledge
asymmetry (SOKA) model. _Journal of personality and social psychology_ 98, 2
(2010), 281.

[51] Wu Youyou, Michal Kosinski, and David Stillwell. 2015. Computer-based personality judgments are more accurate than those made by humans. _Proceedings_
_of the National Academy of Sciences_ 112, 4 (2015), 1036–1040.

[52] Ivan Zakazov, Mikolaj Boronski, Lorenzo Drudi, and Robert West. 2024. Assessing
Social Alignment: Do Personality-Prompted Large Language Models Behave
Like Humans? _arXiv preprint arXiv:2412.16772_ (2024).

[53] Shuo Zhou, Zhe Zhang, and Timothy Bickmore. 2017. Adapting a persuasive
conversational agent for the Chinese culture. In _2017 international conference on_
_culture and computing (culture and computing)_ . IEEE, 89–96.

[54] Caleb Ziems, Minzhi Li, Anthony Zhang, and Diyi Yang. 2022. Inducing positive
perspectives with text reframing. _arXiv preprint arXiv:2204.02952_ (2022).


**Appendix**

**A** **Evidence Extraction Schema**


For each behavioral evidence instance extracted during profiling
(Section 3.1), the pipeline produces a structured context summary
and a short conversational excerpt. Placeholders are shown in code
font.
**Context (per example)**


{
"situational_background": "What was happening (meeting
purpose, topic, timing)",
"social_dynamics": "Who was involved and their role
relative to {user_name}",
"communication_setting": "1-on-1 vs group; formal vs
informal; planned vs spontaneous; stakes",
"behavioral_analysis": "How context shaped {user_name}'s {
facet_name}; would it differ elsewhere?",
"contextual_significance": "Why this demonstrates {
facet_name} given the situation and dynamics"
}


**Conversational Excerpt (2–5 turns)**


[
{"speaker": "User", "message": "Target user's message
..."},
{"speaker": "OtherPartyName", "message": "Response ..."},
{"speaker": "User", "message": "Follow-up ..."}



16


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


]


**B** **Communication Styles Inventory (CSI) -**
**Complete Scale**


The Communication Styles Inventory (CSI) [14] consists of 92 items
organized into 6 dimensions and 23 facets. All items are rated on
a 5-point Likert scale (1 = strongly disagree, 5 = strongly agree).
Items marked with (R) are reverse-coded.


_Dimension 1: Expressiveness (X)._


_Talkativeness._


1. I always have a lot to say.
25. I have a hard time keeping myself silent when around other
people.
49. I am never the one who breaks a silence by starting to talk.
(R)
73. I like to talk a lot.


_Conversational Dominance._


7. I often take the lead in a conversation.
31. Most of the time, other people determine what the discussion is about, not me. (R)
55. I often determine which topics are talked about during a
conversation.
79. I often determine the direction of a conversation.


_Humor._


13. Because of my humor, I’m often the centre of attention
among a group of people.
37. I have a hard time being humorous in a group. (R)
61. My jokes always draw a lot of attention.
85. I often manage to make others burst out laughing.


_Informality._


19. I communicate with others in a distant manner. (R)
43. I behave somewhat formally when I meet someone. (R)
67. I address others in a very casual way.
91. I come across as somewhat stiff when dealing with people.
(R)


**Dimension 2: Preciseness (P)**


_Structuredness._


2. When I tell a story, the different parts are always clearly
related to each other.
26. I sometimes find it hard to tell a story in an organized way.
(R)
50. I always express a clear chain of thoughts when I argue a
point.
74. My stories always contain a logical structure.


_Thoughtfulness._


8. I think carefully before I say something.
32. I weigh my answers carefully.
56. The statements I make are not always well thought out. (R)
80. I choose my words with care.



_Substantiveness._


14. Conversations with me always involve some important
topic.
38. You won’t hear me jabbering about superficial or shallow
matters.
62. I am someone who can often talk about trivial things. (R)
86. I rarely if ever just chatter away about something.


_Conciseness._


20. I don’t need a lot of words to get my message across.
44. Most of the time, I only need a few words to explain something.
68. I am somewhat long-winded when I need to explain something. (R)
92. With a few words I can usually clarify my point to everybody.


**Dimension 3: Verbal Aggressiveness (VA)**


_Angriness._


3. If something displeases me, I sometimes explode with anger.
27. Even when I’m angry, I won’t take it out on someone else.
(R)
51. I tend to snap at people when I get annoyed.
75. I can sometimes react somewhat irritably to people.


_Authoritarianism._


9. I am not very likely to tell someone what they should do.
(R)
33. I sometimes insist that others do what I say.
57. I expect people to obey when I ask them to do something.
81. When I feel others should do something for me, I ask for it
in a demanding tone of voice.


_Derogatoriness._


15. I never make fun of anyone in a way that might hurt their
feelings. (R)
39. I have at times made people look like fools.
63. I have been known to be able to laugh at people in their
face.
87. I have humiliated someone in front of a crowd.


_Nonsupportiveness._


21. I can listen well. (R)
45. I always show a lot of understanding for other people’s
problems. (R)
69. I always take time for someone if they want to talk to me.
(R)
93. I always treat people with a lot of respect. (R)


**Dimension 4: Questioningness (Q)**


_Unconventionality._


4. I sometimes toss bizarre ideas into a group discussion.
28. I often say unexpected things.
52. In discussions, I often put forward unusual points of view.
76. In conversations, I often toy with some very wild ideas.



17


_Philosophicalness._


10. I never enter into discussions about the future of the human
race. (R)
34. I like to talk with others about the deeper aspects of our
existence.
58. I never engage in so-called philosophical conversations. (R)
82. I regularly have discussions with people about the meaning
of life.


_Inquisitiveness._


16. During a conversation, I always try to find out about the
background of somebody’s opinion.
40. I don’t bother asking a lot of questions just to find out why
people feel the way they do about something. (R)
64. I ask a lot of questions to uncover someone’s motives.
88. I always ask how people arrive at their conclusions.


_Argumentativeness._


22. To stimulate discussion, I sometimes express a view different from that of my conversation partner.
46. I like to provoke others by making bold statements.
70. I try to find out what people think about a topic by getting
them to debate with me about it.
94. By making controversial statements, I often force people to
express a clear opinion.


**Dimension 5: Emotionality (E)**


_Sentimentality._


5. When I see others cry, I have difficulty holding back my
tears.
29. During a conversation, I am not easily overcome by emotions. (R)
53. When describing my memories, I sometimes get visibly
emotional.
77. People can tell that I am emotionally touched by some
topics of conversation.


_Worrisomeness._


11. When I’m worried about something, I find it hard to talk
about anything else.
35. I tend to talk about my concerns a lot.
59. People can tell when I feel anxious.
83. When I worry, everybody notices.


_Tension._


17. Because of stress, I am sometimes unable to express myself
properly.
41. I can be visibly tense during a conversation.
65. I am able to address a large group of people very calmly.
(R)
89. I find it hard to talk in a relaxed manner when what I have
to say is valued highly.


_Defensiveness._


23. The comments of others have a noticeable effect on me.
47. Nasty remarks from other people do not bother me too
much. (R)
71. When people criticize me, I am visibly hurt.



Shang, et al.


95. I am not always able to cope easily with critical remarks.


**Dimension 6: Impression Manipulativeness (IM)**


_Ingratiation._


6. I sometimes praise somebody at great length, without being
really genuine, in order to make them like me.
30. In discussions I sometimes express an opinion I do not
support in order to make a good impression.
54. Sometimes I use flattery to get someone in a favorable
mood.
78. To be considered likeable, I sometimes say things my conversation partner likes to hear.


_Charm._


12. I sometimes use my charm to get something done.
36. I sometimes flirt a little bit to win somebody over.
60. I would not use my appearance to make people do things
for me. (R)
84. I sometimes put on a very seductive voice when I want
something.


_Concealingness._


24. I sometimes conceal information to make me look better.
48. I sometimes "forget" to tell something when this is more
convenient for me.
72. I tell people the whole story, even when this is probably
not good for me. (R)
96. Even if I would benefit from withholding information from
someone, I would find it hard to do so. (R)


**Scoring Instructions**


(1) Reverse code all items marked with (R) using the formula:
1→5, 2→4, 3→3, 4→2, 5→1
(2) Calculate facet scores by averaging the 4 items within each
facet
(3) Calculate dimension scores by averaging the facet scores
within each dimension
(4) Note: The original CSI had a fourth facet (Inscrutableness)
under Impression Manipulativeness that was removed due
to poor psychometric properties hence the highest number
here is 96, but the total number of items is 92.


**C** **Scenario templates used in study**


  - S1: Weekly team check-in opening - Target dimension: Expressiveness

  - S2: Explaining your work to interested colleague - Target
dimension: Preciseness

  - S3: Colleague questions your approach - Target dimension:
Verbal Aggressiveness

  - S4: New initiative announcement - Target dimension: Questioningness

  - S5: Last-minute schedule change - Target dimension: Emotionality

  - S6: Informal catch-up with influential colleague - Target
dimension: Impression Manipulativeness

  - S7: Sharing project update at standup - Target dimension:
Expressiveness × Preciseness



18


Mimetic Alignment with ASPECT: Evaluation of AI-inferred Personal Profiles


  - S8: Unexpected process change notification - Target dimension: Questioningness × Emotionality

  - S9: Credit attribution discussion - Target dimension: Verbal
Aggressiveness × Impression Manipulativeness

  - S10: Team celebration planning - Target dimension: Emotionality × Expressiveness


**D** **Data Collected**


**Definition.** We distinguish _raw_ data (participant-generated or
system-logged inputs as collected, after de-identification) from _de-_
_rived_ data (outputs produced by models or researchers).


**D.1** **Raw data from participants.**


(1) **Psychometric self-report (CSI).** 92 items across 6 dimensions/23 facets, Likert 1–5, plus optional free-text clarifications ( _𝑁_ =20; 1 _,_ 840 item–person pairs).
(2) **Scenario evaluations.** Within-subject triad comparisons
for each scenario: rank-order (1st/2nd/3rd) and Likert appropriateness ratings for _Profiled_, _Generic_, and _Self-Report_
responses (600 total evaluations), with optional short rationales.
(3) **Video** **recordings** **of** **audit** **interactions.** Think aloud
rationales and decisions for per-facet review actions during
auditing.


**D.2** **Derived data (model-produced).**


(1) **LLM-inferred initial profiles.** Item- and facet-level predictions from the communication corpus mapped to CSI
constructs.
(2) **Generated scenario responses.** Model outputs for each
condition (Profiled, Generic, Self-Report) per scenario template; canonicalized text with metadata.

**Note.** All raw text was never sent to the researchers; derived artifacts were produced by our pipeline installed on participants laptop
during the study and sent to researchers after review.



**E** **Figures**


Received 26 March 2026



19


Shang, et al.


**Table 5: APRACE Attributes by Scenario**


Scenario Hierarchy Familiarity Purpose Mode Stakes Formality Timing Audience Emotional Motivation Desired
State Outcome


S1 Peer Close Info. Sharing Video Call Low Informal Routine Small Group Neutral Social Positive Res.
S2 Peer Distant Info. Sharing Face-to-Face Low Informal Routine Private Neutral Achievement Neutral Comp.
S3 Peer Close Decision Making Chat Medium Informal Routine Private Neutral Achievement Positive Res.
S4 Manager Close Planning Face-to-Face Medium Formal Scheduled Small Group Confident Autonomy Neutral Comp.
S5 Collaborator Distant Problem Solving Video Call Medium Formal Urgent Private Stressed Security Conflict Avoid.
S6 Collaborator New Social Face-to-Face Low Informal Routine Private Neutral Social Positive Res.
S7 Peer Close Info. Sharing Video Call Low Informal Routine Small Group Confident Achievement Positive Res.
S8 Subordinate Close Info. Sharing Chat Medium Informal Routine Private Neutral Autonomy Neutral Comp.
S9 Peer Distant Problem Solving Face-to-Face Medium Informal Scheduled Private Frustrated Achievement Positive Res.
S10 Peer Close Social Face-to-Face Low Informal Routine Small Group Confident Social Positive Res.


**Figure 5: Distribution of occurrences of facets with no examples found in data across 20 participants. Each facet is assessed**
**once, so the maximum number of occurrences would be 20 per facet. This is evident of what traits tend to be lack of behavioral**
**evidence from workplace data.**


20


