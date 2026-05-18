## **Decision-Oriented Programming with Aporia**



Saketh Ram Kasibatla [*]
UC San Diego
La Jolla, CA, USA
skasibatla@ucsd.edu


Benjamin C. Pierce
University of Pennsylvania
Philadelphia, PA, USA
bcpierce@cis.upenn.edu



Raven Rothkopf [*]
UC San Diego
La Jolla, CA, USA
rrothkopf@ucsd.edu


Sorin Lerner
Cornell University
Ithaca, NY, USA
sorin.lerner@cornell.edu


Nadia Polikarpova
UC San Diego
La Jolla, CA, USA
npolikarpova@ucsd.edu



Hila Peleg
Technion
Haifa, Israel
hilap@cs.technion.ac.il


Harrison Goldstein
University at Buffalo, SUNY
Buffalo, NY, USA
hgoldste@buffalo.edu







































**Figure 1: We describe Decision-Oriented Programming, a paradigm for supporting human decision-making in AI-assisted**

**programming, and its instantiation in a system called Aporia. In Aporia, the programmer communicates with the agent via a**

**structured representation of design decisions, called a** _**Decision Bank**_ **. The agent elicits decisions from the programmer** **1, and**

**the programmer responds and manages the decisions** **2 . The agent then uses the Decision Bank to generate code** **3, and the**

**programmer relies on the bank when validating the system behavior** **4 .**



**Abstract**


AI agents allow developers to express computational intent abstractly, reducing cognitive effort and helping achieve flow during
programming. Increased abstraction, however, comes at a cost: developers cede decision-making authority to agents, often without
realizing that important design decisions are being made without
them. We aim to bring these decisions to the foreground in a paradigm we dub _decision-oriented programming_ . In DOP, (1) decisions
are _explicit and structured_, serving as the shared medium between
the programmer and the agent; (2) decisions are _co-authored interac-_
_tively_, with the agent proactively eliciting them from the programmer; and (3) each decision is _traceable to code_ . As a step towards this
vision, we have built Aporia, a design probe that tracks decisions in


- Equal contribution.


_Conference’17, Washington, DC, USA_

2026. ACM ISBN 978-x-xxxx-xxxx-x/YYYY/MM
[https://doi.org/10.1145/nnnnnnn.nnnnnnn](https://doi.org/10.1145/nnnnnnn.nnnnnnn)



a persistent, editable Decision Bank; elicits them by asking programmers design questions; and encodes each decision as an executable
test suite that can be used to validate the implementation.
In a user study of 14 programmers, Aporia increased _engagement_
in the design process and _scaffolded_ both exploration and validation.
Participants also gained a more _accurate_ understanding of their
implementations, with their mental models 5 _𝑥_ less likely to disagree
with the code than a baseline coding agent.


**1** **Introduction**


“A language that doesn’t affect the way you think about
programming is not worth knowing.”


Alan Perlis


AI is changing the way people think about programming. The
transformation began with GitHub Copilot [28] in 2022; as of 2025,
84% of developers used AI tools, 47% daily [29]. Modern tools go far
beyond auto-completion, with _AI agents_ [15, 30, 44] autonomously
modifying codebases, executing shell commands, etc.


Conference’17, July 2017, Washington, DC, USA Kasibatla et al.



Studies exploring developer use of these tools report that using
natural language and letting AI deal with implementation details
reduces cognitive effort [45] and that using agents can help developers achieve flow states [18, 45] and improve productivity [18, 27, 45].
These experiences demonstrate the potential of AI programming
tools to further a fundamental design goal of programming languages: _to express computation at a level of abstraction that is closer_
_to the way humans think and talk_ [24, 25].
The downside of expressing intent at a high level is that crucial
details are left out. Without user intervention, agents fill in these
details on their own, sometimes incorrectly. The default interaction
model of today’s coding agents—prompt, generate, review—makes
it easy to let the agent drive, and studies have found that “vibe
coding” often means ceding decision-making authority to the agent
altogether [45]. Researchers and practitioners are increasingly worried about the resulting _cognitive debt_ [9, 48]: the erosion of a team’s
understanding and mental models of their own system. Professional
developers resist this tendency, but doing so requires discipline and
workarounds like restricting the scope of each agent change, reviewing generated code line by line, and manually authoring plans
and design documents [27]. In other words, developers who want
to stay in control must work against the grain of their tools!
How might we design the interaction model itself to _support_
programmer decision-making, rather than leaving developers to
maintain control in spite of their assistant? The approach we explore
is to reify programmer decisions as first-class objects, a programming paradigm we dub _decision-oriented programming_ (DOP, Fig. 1),
characterized by three design goals:


**DG1** Decisions are _explicit and structured_ . Rather than being buried
in prompts, plans, or code, decisions are reified as first-class
objects in a persistent, editable record; this record is the
shared medium through which programmer and agent negotiate the design.
**DG2** Decisions are _co-authored_ _interactively_ . In particular, the
agent proactively elicits design decisions from the programmer, which keeps them engaged rather than passively reviewing agent output.
**DG3** Decisions are _traceable_ _to_ _code_ . Each decision is formally
connected to the implementation, giving programmers a
concrete way to validate that the code reflects their intent.

As a foray into decision-oriented programming, we have built a
concrete design probe called Aporia, [1] embodying all three of the
design goals above:


(1) It _tracks_ decisions in a _Decision Bank_ : a persistent, structured
record that programmers can view and edit at any time via
a UI.
(2) It _elicits_ decisions by asking programmers _design questions_
about the software they are seeking to build.
(3) It encodes each decision formally in a _test suite_, giving users
an unambiguous interpretation of their decisions and providing executable feedback that helps validate the agent’s
implementation.

To evaluate Aporia, we conducted a within-subjects user study
with _𝑁_ = 14 participants, which involved adding new features to


1 From the socratic term referring to the suspension of views on a subject, accompanied
by a continuous questioning in an effort to better understand.



an existing codebase with the help of either Aporia or a baseline
coding agent (Claude Code). The results show that DOP promoted
_engagement_ in the design process: participants using Aporia articulated significantly more design decisions and exhibited continuous
reflection throughout the development process. DOP also provided
_scaffolding_ for the design process, helping programmers organize
and track their decisions during both exploration and validation
phases and giving them a more thorough and accurate understanding of their code, with **79%** lower likelihood of mismatches between
their mental model and the actual implementation compared to the
baseline coding agent.
In summary, our contributions are:


(1) We articulate _decision-oriented_ _programming_, a paradigm
which supports programmer decision-making when working
with AI coding agents.
(2) We instantiate DOP with Aporia, a design probe that elicits
decisions through questions and formalizes those decisions
in test suites, giving programmers a concrete way to validate
that their intent is reflected in the final product.
(3) We evaluate Aporia through a user study, showing that DOP
promotes programmer engagement in the design process
and provides structure that helps scaffold both design and
validation.


**2** **Related Work**


_Empirical studies of AI assistants._ There are several studies exploring how users interact with completion models. Grounded Copilot [6], found that programmers use GitHub Copilot in two main
modes: exploration, where programmers consider their options,
and acceleration, where programmers’ goal is clear. Expectation
vs. experience [53] found that while users preferred using GitHub
Copilot, it impeded their ability to complete tasks.
Recent research has also examined how users interact with AI
agents [46]. Pimenova et. al. [45] note that at their best, programming agents can support flow, but that agentic programming has
many pain points, such as difficulty communicating intent. Fawzy
et. al. [18] find that coding with agents has a speed-quality tradeoff,
where developers use agents for enhanced flow, but overlook common quality assurance practices. Sarkar and Drosos [47] identify
an iterative process between prompting, reviewing, and manually editing AI-generated code. They note a shift of programmer
expertise to evaluating outputs and deciding when to transition
between prompting and editing, rather than writing code from
scratch. Huang et. al. [27] study how experienced developers use AI
agents. They observe that developers adopt a variety of strategies
to exercise agency while programming with AI, and suggest that
carefully designed interfaces can help guide software developers
to interact with agents more productively. We believe that DOP
and Aporia can serve such a role, keeping agents’ benefits while
mitigating the pitfalls described in these studies.


_Eliciting and exploring design intent._ A growing body of work
tackles the challenge of helping users clarify and communicate their
intent to AI systems. Several systems support _intention formation_ by
involving users in an interactive process of refining goals. CoLadder [56] supports users generating code with LLMs by providing a
UI for structuring prompts hierarchically. Stepwise [32] facilitates


than by components under test. These testing strategies have been
explored as a means to improve correctness of AI programming
agents [10, 22, 26, 36, 54], but not with developers in the loop.
TiCoder [16] formalizes user intent with LLMs by generating
test cases and asking users to confirm or deny whether each matches
their intention. Aporia also generates test cases with a human in
the loop. However, Aporia does so using AI agents, which operate
on the scale of a whole codebase rather than individual functions.


_Design rationales._ When articulating DOP, we drew on the tradition of design rationale: structured representations of the reasoning



_Eliciting decisions via question generation._ In response, Aporia
generates yes/no questions meant to elicit design decisions relevant
to the goal (in this case, about the access control policy); these
appear as _Question_ _Bubbles_ ( **2** ) in the editor, inside an Aporiamanaged plan file. Nikos can decide to engage with or dismiss any
question. In this example, he clicks on the first question (“Should
reviewer identities be hidden from authors?”), which opens the
_Question Detail View_ ( **3** ) on the right, where he can see Aporia’s
rationale for answering “yes” _vs._ “no” underneath the Detail View
header. (“In a blind review process, authors should not learn who






author identities. He enters this as a comment into the response
field ( **4** ) and clicks “yes” to answer the question positively.


_Persistent_ _decisions_ _via_ _the_ _Decision_ _Bank._ Nikos’s decision to
make the review process double-blind now appears in Aporia’s
_Decision Bank_ ( **5** ) below the goal. This allows Nikos to keep track
of the decisions he’s made and easily change his mind later by
clicking on the decision and editing his answer. He answers a few
more questions, and his decisions accumulate in the Bank. At some
point, it occurs to him that admins should be always able to see all
the details of all papers; this is not something Aporia had asked
about, but he can add this decision to the Bank via the Custom
Decision field ( **6** ).


_Traceability via test suites._ Every time Nikos commits a decision
to the Bank, Aporia generates a test suite to validate the (future)
implementation against that decision. Fig. 3 ( **7** ) shows the test
suite generated for the double-blind review decision. Nikos sees
that each test case is preceded by a natural-language comment
summarizing its inputs and outputs and can inspect any test case if
he wants to see what exactly is being checked.



all its generated tests to validate the implementation against the
user’s decisions. When it finishes, Nikos runs the app and evaluates
its behavior manually, using the Decision Bank as a checklist of his
desired access control policies.


In the foregoing, we’ve seen Aporia embodying the three core
design goals of DOP: (i) by accumulating decisions as editable
entries in the Decision Bank, it makes them _explicit and structured_ ;
and (ii) by generating design questions, it actively engages the
user in the design process and _elicits decisions_ ; (iii) by generating
test suites for each decision, it makes decisions _traceable to code_,
lowering the effort involved in validating the implementation.


_Comparison with plan-oriented programming._ In contrast to Aporia, state-of-the-art coding agents [15, 30, 44] typically organize
their communication with users around natural-language _plans_ . [2]

Imagine that Nikos uses a plan-oriented agent instead of Aporia
for the same task. He prompts the agent with the same high-level


2 Although some commercial agents also incorporate questions into their interaction
model, questions do not play a central role; we describe a pure plan-oriented workflow
here for the sake of comparison.


Decision-Oriented Programming with Aporia Conference’17, July 2017, Washington, DC, USA



goal and in response receives a plan: a linear document of natural
language and pseudocode describing the design decisions the agent
made—for example, “Reviewer identities should be hidden from
authors to ensure a blind review process.” Nikos reviews the plan,
but the design decisions are buried in a long document, and the
easiest action is to accept the plan as-is. He thus doesn’t notice that
the agent chose a single-blind review process—or even that single_vs._ double-blind is something worth thinking about.


**3.2** **Design Considerations**


As mentioned in Sec. 2, Aporia draws on QOC notation [38], which
structures design rationale around _Questions_ that identify key issues
(our design questions), _Options_ that provide possible answers (in
our case just yes/no), and _Criteria_ for evaluating those options (our
arguments and relevant code in the Detail View).
Through several pilot studies, we iterated on Aporia’s design,
identifying several key lessons. **Binary questions reduce over-**
**load:** Early prototypes required participants to write responses to
all design questions; pilots showed that yes/no questions with optional comments struck the right balance between expressiveness
and cognitive cost. As noted in Sec. 2, binary responses are in line
with QOC notation’s _Options_, which provide possible answers to
questions. **Progressive disclosure:** Displaying too many questions
at once overwhelmed our pilot participants, so we settled on five
at a time. We also added a short summary of each test case’s inputs
and outputs ( _e.g.,_ reviewer_a (assigned to papers 2 & 3)
+ GET /papers/3 -> 200) in a preceding comment. These summaries show the gist of what is being tested while test bodies are
collapsed in the editor. **Grounding in code:** Programmers wanted
to consider questions in the context of the codebase rather than in
the abstract, which prompted us to include relevant code references
in the Detail View. Relevant code references are in line with QOC
which includes _Criteria_ for evaluating possible answers. **Parallel**
**structure** **between** **questions,** **decisions,** **and** **test** **suites:** To
address observed difficulties connecting questions to their corresponding decisions, we introduced a consistent parallel structure
across three levels of our interface. First, we rewrote decision titles
to match the linguistic structure of the questions that produced
them. Second, inspired by property-based testing [13], we reorganized tests into suites grouped by the decisions they validate rather
than the components they test. Finally, we preceded each test suite
with its corresponding question bubble, making it easier to trace
the connections between the two.


**3.3** **Implementation**


Aporia is implemented as an extension for Visual Studio Code [3]
and is written in Typescript. All UI elements are implemented
using React. The Aporia sidebar and Question Detail View are
displayed in Webviews, while Question Bubbles are displayed in
WebviewEditorInset _s_ (only available in the insiders’ build).
Aporia orchestrates three specialized agents—a _questioner_, a
_planner_, and an _implementer_ —each an instance of Claude Code
controlled using the Agent Client Protocol [1]. The questioner generates design questions and supporting arguments based on the
goal; the planner formalizes decisions into test suites; and the implementer changes the codebase in line with the goal, decisions,



and tests. Agents run concurrently, with Aporia managing asynchronous state updates by queueing and batching requests that are
made while an agent is working.
Agents communicate with the extension via a custom Model Context Protocol (MCP) [2] server featuring two tools. submit_argument
stores questions and arguments in a shared database, which the
extension renders as Question Bubbles. submit_uuid_to_test_
suite_mapping, is used by the planner to map test suite names
( _e.g.,_ TestReviewerAccess in Fig. 3) to decisions. The extension
uses this mapping to render Question Bubbles for each decision
next to its test suite ( _e.g.,_ the green Question Bubble in Fig. 3).


**4** **User Study**


We describe the design of our user study, which was intended to
answer two research questions:


**RQ1** How does Aporia affect developers’ ability to _discover and_
_articulate_ the design decisions relevant to a given programming task?
**RQ2** How does Aporia affect developers’ _perceived_ _and_ _actual_
_understanding_ of the agent’s implementation and their strategies for validating their understanding?


**4.1** **Participants**


We recruited 14 participants, 8 self-identified as men and 6 as
women. 2 were undergraduate students, 6 were graduate students,
and 6 were professional software engineers. We required participants to have at least some familiarity working with Python and
AI agents. All reported moderate to high Python proficiency and
said they used AI programming agents at least a few times a week.


**4.2** **Study Procedure**


We conducted a comparative structured observation study [37],
guiding participants to complete two programming tasks, one with
Aporia and one with our baseline, Claude Code [4], a state-ofthe-art agentic coding tool which mainly follows the plan-oriented
paradigm described in Sec. 3.1. (Although it can ask clarifying
questions, it does so sporadically.)
We ran a counterbalanced within-subjects study across two factors, assistant order (Aporia first vs. Claude Code first) and task
order (Task A first vs. Task B first), resulting in four configurations.
All studies were conducted remotely over Zoom and facilitated
by one of the first two authors. Participants completed tasks in
a browser-based code-server [14] VS Code IDE [41] running in
an isolated Docker container [40]. Both assistants used the same
underlying model, Claude Sonnet 4.6 [5], to isolate the effect of
Aporia’s interface. Each session took approximately 90 minutes,
and participants were compensated with a $35 Amazon gift card.
Participants began their session by signing an informed consent
form compliant with our IRB approval. They were then given a brief
introduction and told they would be completing programming tasks
with two different AI programming assistants, renamed Assistant-1
(Aporia) and Assistant-2 (Claude Code) to minimize bias.


_4.2.1_ _Assistant tutorial._ Before beginning each task, participants
completed a 10-minute tutorial explaining their assigned assistant,


Conference’17, July 2017, Washington, DC, USA Kasibatla et al.



**Task A (Paper detail access control)**


- **Survey Question:** In your implementation, which users (admins, authors, reviewers,
other users) can see what Paper data (pdf, status, paper authors, assigned reviewers,
reviews) and when can they see it?


- **P12’s answer:**

_“Admins can see everything. Authors can see all paper details, except pending reviews._

_Reviewers can’t see author names, but they can see other reviewers’ submissions._

_Unrelated users can see nothing.”_


- **Encoded as:**



**Task B (Reviewer assignment algorithm)**


- **Survey** **Question:** In your implementation, which users (admins, users) can
be assigned to review which papers, and under what conditions (author/coauthor/institutional conflicts, workload, already assigned, etc.) is assignment prevented?


- **P3’s answer:**

_“Authors can’t be assigned to the papers they submitted, but they can be assigned_

_to papers from others; reviewers from the same university as the authors can’t be_

_assigned to their papers.”_


- **Encoded as:**



**Description Grid**


Adm. Auth. Rev. Unrel.


PDF Yes Yes Yes No
Status Yes Yes N/D No
Authors Yes Yes No No
Reviewers Yes Yes N/D No
Reviews Yes No Yes No



**Implementation Grid**


Adm. Auth. Rev. Unrel.



**Description Grid**


Eligibility Ranking


Not an author N/D
Different institution



**Implementation Grid**


Eligibility Ranking



**Figure** **4:** **Sample** **correctness** **analysis** **of** **post-task** **survey** **responses** **from** **P12** **(Task** **A,** **left)** **and** **P3** **(Task** **B,** **right).** **Free-**

**form** **answers** **are** **encoded** **into** **a** **Description** **Grid,** **which** **is** **then** **compared** **to** **the** **actual** **implementation** **encoded** **in** **the**

**Implementation Grid. Policy alignment is classified into** **matches,** **mismatches, or** **not described** **(N/D).**



illustrated with in-situ screenshots. The tutorial remained available
to participants throughout the task for reference.


_4.2.2_ _Programming_ _task_ _and_ _post-task_ _survey._ Participants completed a 25-minute programming task with each assistant, modifying the NotCRP conference management system (Sec. 3.1). Each
task was intentionally open ended, involving multiple subjective
design decisions:


**Task A** _(Paper detail access control)_ : “Currently, any authenticated
user can view every paper and all of its associated data.
Modify the Paper detail page to add explicit access control
for which users can view which paper’s information.” (This
task inspired our user scenario in Sec. 3.1.)
**Task B** _(Reviewer assignment algorithm)_ : “Currently, the reviewer
assignment form requires conference admins to manually
type in a reviewer’s username to assign them to a paper. Modify the form to display a filtered and ranked list of eligible
reviewers for admins to select from.”


For each task, participants were given one of the task descriptions
above, the NotCRP repository, a prepopulated database of users
and papers for testing, and a running instance of NotCRP. After
each task, participants completed a post-task survey that collected
data as detailed in Sec. 4.3.


_4.2.3_ _Post-study survey and semi-structured Interview._ After finishing the two tasks and surveys, participants completed a post-study
survey and a set of semi-structured interview questions asking
them to reflect on their experience with both assistants.


**4.3** **Data Collection and Analysis**


We now describe our methods for data collection and analysis, with
our results to be found in Sec. 5.


_4.3.1_ _Systematic mental review._ In designing our post-task surveys,
we were interested in how participants’ _subjective_ _confidence_ in
their solutions varied after they were guided through a systematic



mental review of their work. This review comprised a series of
questions designed to probe aspects of their implementation that
they might not have considered. Participants were asked to list up
to three _design decisions_ that shaped their solution and, for each,
say (a) what helped them realize there was a decision to make and
(b) who made the decision, from “entirely myself” (1) to “entirely
the assistant” (5). We also asked a _policy question_ (see the top part of
Fig. 4), which prompted them to explain the access control policies
they implemented for Task A and the reviewer eligibility policies
they implemented for Task B; we then asked which strategies they
used to validate that the code indeed implemented those policies.
We assessed participants’ confidence that their implementation
matched their intent both before and after this review. Critically,
participants completed the surveys without access to their code
or the app, so that responses reflected what they believed about
their implementation, not what they were able to validate in the
moment. We also measured cognitive load using NASA-TLX [23].


_4.3.2_ _Correctness analysis._ We used the policy questions from the
post-task survey to conduct a _correctness analysis_ comparing participants’ descriptions of their implemented policies to the actual
behavior of their code. Fig. 4 shows the full pipeline: starting from
the participant’s natural-language description of the policies, we
manually encoded it into a Description Grid, where each cell represents an atomic policy. For Task A, an atomic policy states whether
a given role (Admin, Author, Reviewer, Unrelated user) can view
a given paper data (PDF, status, author names, reviewer names,
reviews), marked as “Yes,” “No,” or “Conditional” for policies with
temporal constraints ( _e.g., “authors can see reviews only after a deci-_
_sion has been made”_ ). Task B’s grid captures what properties make
a reviewer eligible to review a paper and how reviewers are ranked.
We then independently encoded each participant’s submitted
code onto the same grid format (the Implementation grid) and compared the two. Each grid cell was classified as either: a match if
the two grids had equivalent values, a mismatch if they conflicted,


Decision-Oriented Programming with Aporia Conference’17, July 2017, Washington, DC, USA



or not described if a cell in the Implementation grid had no corresponding cell in the Description grid ( _i.e.,_ the behavior was present
in the code but absent from the participant’s description ).


_4.3.3_ _Decision_ _categorization._ After conducting the studies, we
used telemetry to identify moments where participants actively
made decisions with each tool. For Aporia, we considered answering a question or entering a custom decision to be an active decision.
For Claude Code, we manually separated participants’ messages
and answers to questions into decisions of similar granularity to
those made using Aporia, considering each to be a separate active decision. We also distinguished _elicited decisions_ ( _i.e.,_ decisions
made in response to a question from Aporia or Claude Code) from
decisions overall, which included participants’ messages to Claude
Code and custom decisions in Aporia.


_4.3.4_ _Quantitative analysis._ To estimate the quantitative relation
between the used assistant _𝑎_ (0 for Claude Code, 1 for Aporia)
and each of the performance metrics while accounting for possible learning effects, we fit Generalized Linear Models (GLMs) [39]
using pymer4 [31]. Each GLM uses a performance metric _𝑚_ as outcome variable, _𝑎_ as main predictor, and the task (Task A or Task
B) and whether it occurred first or second as further covariate predictors. For performance metrics that are count data ( _e.g.,_ number
of elicited decisions), the model uses a Poisson distribution with
log link function; for performance metrics that are ratios ( _e.g.,_ percent of described criteria that were successfully implemented), the
model uses a Binomial distribution with log link function.
After fitting each GLM on the experimental data, we report the
mean, p-value, and 95% probability interval for the estimate of the
coefficient of _𝑎_ on the outcome scale (that is, after inverting the
link function), which can be interpreted as an estimate of the effect
of using Aporia over Claude Code on the performance metric.
As is customary, we interpret a _𝑝_ -value below 0 _._ 05 to denote a
"significant" difference between the two sets of measures.


_4.3.5_ _Thematic analysis._ We recorded and transcribed each participant’s session and semi-structured interview. Participants were
encouraged to think aloud while they completed each task, verbalizing their problem-solving process, reactions to code suggestions,
general feelings, etc. We used thematic analysis [11, 50] to identify themes from the task and interview transcripts. Two authors
individually coded participant quotes from the transcripts related
to our research questions and collaboratively grouped these codes
into broader themes to present with our quantitative results.


**5** **Results**


Our results show how Aporia helps developers make informed decisions and build a more accurate understanding of code. We present a
qualitative and quantitative analysis answering two RQs (see Sec. 4).
Overall, participants had positive general impressions of Aporia’s various affordances (see Fig. 5). The Decision Bank was rated
most favorably ( _𝑀_ = 4 _._ 4/5), with all but one participant agreeing or
strongly agreeing that it was useful. The question bubbles were similarly well-received ( _𝑀_ = 4 _._ 1/5). Participants were more divided on
the test suites ( _𝑀_ = 3 _._ 3/5): three disagreed and seven were neutral,
a finding we explore further in Sec. 5.2.3.




 - **(Post-study) Survey Question:** I found the following feature of Aporia useful:


Strongly Disagree Disagree Neutral Agree Strongly Agree


Answering questions 4 6 5


The generated test suites 3 7 2 3


The Decision Bank 1 7 7


**Figure 5: Distribution of participants’ post-study survey lik-**

**ert responses after using Aporia.**


 - **Survey Question:** For each design decision you described, what helped you realize
there was a decision to make there? (select up to two)


Aporia Claude Code *User-written response



Prior knowledge or experience


Assistant’s questions


Read the generated plan


Ran or tested the program


Did not explicitly think about this decision


Read the generated code

_“Read the context/evidence the_
_AI assistant gave me”_            
_“I let Claude think of the criteria all together”_ 

_“I asked Claude to come up with_
_a ranking strategy”_             
















**Figure 6: Participants’ self-reported decision-making strate-**

**gies as described in Sec. 4.3.1**


Using Wilcoxon signed-rank tests [55] to compare NASA-TLX
scores revealed no significant differences between Aporia and
Claude Code across any of the five subscales. Participants reported similarly low levels of mental demand ( _𝑀_ Aporia = 2 _._ 50,
_𝑀_ Claude = 2 _._ 43), temporal demand ( _𝑀_ Aporia = 2 _._ 64, _𝑀_ Claude = 2 _._ 64),
effort ( _𝑀_ Aporia = 1 _._ 86, _𝑀_ Claude = 2 _._ 14), and frustration ( _𝑀_ Aporia =
1 _._ 79, _𝑀_ Claude = 1 _._ 43), and similarly high levels of perceived success ( _𝑀_ Aporia = 3 _._ 71, _𝑀_ Claude = 3 _._ 50). Task-level comparisons also
showed no significant differences though Task B trended marginally
toward higher effort ( _𝑀𝐴_ = 1 _._ 79, _𝑀𝐵_ = 2 _._ 21; _𝑝_ = 0 _._ 058).


**5.1** **RQ1: Discovering & articulating decisions**


_5.1.1_ _Aporia helped participants_ **discover** _design considerations._
Nine participants (P1, P4, P7, P8, P9, P10, P11, P12, P16) noted that
Aporia surfaced considerations they had not thought of on their
own. P4 reflected that the questions _“made me realize ..._ _edge cases_
_or ..._ _issues that a user could face while using the program,”_ and P1
remarked that without the questions, they would _“miss at least 5_
_of [their decisions].”_ This observation is supported by participants’
self-reported decision-making strategies, as shown in Fig. 6. When
asked “What helped you realize there was a decision to make here?”
in the post-task survey, Aporia users most frequently reported
that the assistant’s questions brought decisions to their attention,
while Claude Code users had to rely mainly on their own prior
knowledge or experience.


_5.1.2_ _Aporia helped participants_ **articulate** _design decisions._ Even
when participants were already (vaguely) aware of a design consideration, Aporia’s questions made it easier for them to articulate


Conference’17, July 2017, Washington, DC, USA Kasibatla et al.



and document their decisions. This is consistent with the principle
of recognition over recall [43]: recognizing a question that aligns
with your intent is easier than recalling and verbalizing that intent.
We observed Aporia surfacing questions that resonated with
the existing intuitions of six participants (P1, P4, P11, P12, P16, P19).
For example, while answering questions, P19 remarked _“I had a_
_specific question in mind.”_ After reading a newly generated question,
they followed with _“Oh ...okay, so that question is already generated.”_
Reflecting on their task, P12 noted that _“because [Aporia] kept lining_

_up with things that I thought were appropriate, ..._ _I trust this process._

_It seems to be doing what I would have done anyway.”_

As noted in Sec. 3.2, we chose to make Aporia’s design question
binary as opposed to open-ended. Five participants (P3, P7, P12, P16,
P19) noted that this made it easier for them to quickly approve of
decisions that were in line with their thinking. When asked if they
found Aporia’s questions useful, P12 said that they appreciated

_“just being able to ..._ _say yes or no to something, as opposed to coming_

_up with a question and then answering it.”_

Aporia’s questions were not always on the mark. P7, P8, P10,
and P11 found some questions irrelevant, with P7 noting at different moments that the questions were either “too detailed” or
“too obvious.” When Aporia’s questions resonated, however, they
seemed to lighten the cognitive demand of programming. While
the NASA-TLX scores did not reveal a significant difference in cognitive load between assistants, four participants (P3, P4, P9, P12)
noted that they felt Aporia was less demanding to use than Claude
Code. P4 said that Aporia required less effort because _“it asked me_

_questions about the decisions, and I didn’t really have to think about_

_..._ _are there decisions to make, and what are they?”_ .
**Claude** **Code** **comparison:** In contrast, seven participants
(P4, P7, P8, P10, P15, P16, P19) struggled to articulate their decisions
when working with Claude Code. P8 reflected: _“It’s kind of tricky,_

_because [Aporia] broke it down into the design decisions for me, but_

_for [Aporia], it’s more like everything together.”_

While Claude Code occasionally asked questions of participants,
it did not do so as frequently or systematically as Aporia: we found
that on average, participants using Aporia made 13.5 times more
elicited decisions (95% CI [10 _._ 9 _,_ 16 _._ 7], _𝑝_ _<_ 0 _._ 001) than those using
Claude Code. More interestingly, Aporia users also made **2.99**
**times** **more** **decisions** **overall** (95% CI [2 _._ 69 _,_ 3 _._ 32], _𝑝_ _<_ 0 _._ 001)
than Claude Code users. This suggests that elicited decisions are
less costly to make than proactive ones, and that decision elicitation
increases overall engagement with the design process. (We note
the caveat that there is some subjectivity in how we counted nonelicited decisions with Claude Code; see Sec. 4.3.3.)


_5.1.3_ _Aporia helped participants make_ **more informed** _decisions._
Five participants (P1, P4, P9, P11, P12) observed that Aporia’s
questions made them think deeper about decisions they had already
been considering. P9, when reflecting on a decision about how
admins should be ranked in the reviewer assignment, noted: _“I was_

_bringing in my own experience...the question the assistant asked me_

_was..._ _asking me to think deeper myself.”_

When participants were unsure how to answer a question, Aporia’s Question Detail View (Fig. 3, **3** ) provided the necessary context with rationale and code references. After seeing the Detail View,
P3 noted that normally, when using Claude Code, they _“explicitly_



_asked_ _[the_ _agent]_ _to_ _think_ _about_ _the_ _rationale_ _before_ _the_ _decision._

_But here..._ _I don’t need to explicitly ask.”_ Five participants (P4, P7,
P9, P12, P19) used the relevant code references to ground their
decisions in the codebase. In one case, P4 was directly influenced
by seeing Aporia’s reference to existing code that instantiated a
three-reviewer limit on papers: _“normally..._ _I would have said no..._

_but I guess since the code already has these constraints that it told me_

_about..._ _I’m gonna go with what it says.”_

Together, questions and grounding helped participants reflect on
their decisions in the context of the codebase. For example, P11 had
never used a paper management system and initially assumed that

_“There is, like a class of..._ _admins..._ _who are..._ _the reviewers of all_

_the papers”_, but upon reflection, decided that: _“Basically, anyone can_

_probably be a reviewer, anyone can be a submitter, and then that’s_

_completely separate from who’s an admin.”_

We still observed instances where participants did not think
deeply about their decisions or ground them in the codebase. P9
illustrated two failure modes: they made a custom decision to _“Ex-_

_clude people who provided mentorship and/or funding to the paper_

_authors”_ despite no data about mentorship or funding existing in
the codebase (no grounding) and later admitted _“I was just kind of_

_clicking yes on the assistant for some of them, ..._ _I wasn’t thinking,_

_as deeply about all the questions”_ (no deeper thinking).


_5.1.4_ _Aporia helped participants_ **track** _and_ **tweak** _their decisions._
Once participants articulated decisions, Aporia _tracked_ them in
the Decision Bank (Fig. 3, **5** ). The Bank was the most positively
received of Aporia’s affordances (Fig. 5); ten participants (P1, P3,
P4, P7, P8, P9, P10, P11, P16, P17) specifically credited it with helping
them keep track of what they had decided. P17 appreciated it as _“a_
_**quick mental map**_ _of the overarching decisions that we’ve made.”_,
and P7 valued being able to _“just go back to it at any time”_ .
Participants took advantage of decisions being laid out in front of
them in a variety of ways. P3 came back to the Bank to confirm that
their decisions were not in conflict. After making a few decisions
in quick succession, P11 used the Bank to step back and review.
Participants also _tweaked_ their decisions, in addition to tracking
them. Four participants (P3, P4, P10, P16) appreciated the ability
to revise decisions, and three (P3, P8, P17) did so during the study.
Seconds after answering questions, P3 and P8 reversed their decisions to correct misunderstandings. P17 initially accepted a decision
about displaying admin UI but later returned to add a caveat: _“We_
_don’t need to worry about it.”_ While these tweaks were not major
revisions, they demonstrate that participants could correct course
and keep the plan aligned with their intent.
**Claude Code comparison:** Five participants (P1, P3, P16, P17,
P19) found Claude Code’s unstructured chat history harder to
understand than Aporia’s Decision Bank. P16 noted that Aporia

_“definitely felt more systematic..._ _I felt more confident about what_

_[Aporia] was doing..._ _reading through a plan on text is a lot of effort.”_

In contrast, five participants (P4, P7, P8, P9, P16) struggled to
recall key aspects of their Claude Code chats. P9 described _“so_

_much..._ _chain_ _of_ _thought_ _being_ _generated..._ _you_ _just_ _can’t_ _really_

_always see previous decisions,”_ and P3 noted that with everything
mixed together in the chats, _“it’s not easy for me to go back to find_

_the_ _information_ _I_ _need._ _..._ _[Aporia]_ _collects_ _all_ _the_ _same_ _type_ _of_

_information together, so it’s better.”_ Prior studies corroborate this


Decision-Oriented Programming with Aporia Conference’17, July 2017, Washington, DC, USA



difficulty, finding that developers resort to organizing their thoughts
in separate files to compensate for unstructured chat interfaces [27].


**5.2** **RQ2: Perceived vs. actual understanding**


_5.2.1_ _Participants_ _had_ _a_ **more** **accurate** _understanding_ _of_ _their_
_code_ _using_ _Aporia._ Through our correctness analysis described
in Sec. 4.3.2 and illustrated in Fig. 4, we compared participants’
descriptions of their implementation (the Description grid) against
the code they submitted (the Implementation grid). Participants
described a similar number of policies (red or green cells in Fig. 4)
with both assistants ( _𝑀_ Aporia = 10 _._ 93, _𝑀_ Claude = 10 _._ 43; _𝑝_ = 0 _._ 68),
but their Description grids were more accurate with Aporia.
For instance, P12 wrote that _“unrelated users can see nothing,”_ for
Task A, but their code lacked an access control check on the PDF
endpoint, allowing unrelated users to bypass the policy—this was a

mismatch at the PDF/Unrelated intersection in Fig. 4. Mismatches
like these were **79% less likely with Aporia** ( _𝑅𝑅_ = 0 _._ 21, 95% CI

[0 _._ 08 _,_ 0 _._ 55], _𝑝_ _<_ 0 _._ 001). On average, 4.7% of described policies were
mismatches with Aporia vs. 12.1% with Claude Code.
P3 wrote that _“reviewers from the same university as the authors_
_can’t be assigned to their papers”_ and their code enforced this ( match
at the Different institution cell in Fig. 4). Such matches were
**14%** **more** **likely** **with** **Aporia** ( _𝑅𝑅_ = 1 _._ 14, 95% CI [1 _._ 06 _,_ 1 _._ 23],
_𝑝_ _<_ 0 _._ 001). On average, 94% of described policies were successfully
implemented with Aporia vs. 88% with Claude Code.
P3 did not mention a reviewer ranking strategy, but their code
sorted them alphabetically ( not described at the Alphabetical cell
in Fig. 4). Such undescribed policies were less common with Aporia,
though this difference was not statistically significant ( _𝑀_ Aporia =
1 _._ 71, _𝑀_ Claude = 2 _._ 57; _𝐼𝑅𝑅_ = 0 _._ 67, 95% CI [0 _._ 40 _,_ 1 _._ 12], _𝑝_ = 0 _._ 124).


_5.2.2_ _Participants had a significantly_ **more thorough** _understand-_
_ing of their solutions with Aporia._ As described in Sec. 4, participants
rated their confidence twice: once before and once after completing
the systematic mental review described in Sec. 4.3.1. We used the
relationship between these two ratings (measured using Spearman
rank-order correlation [33]) to assess whether reflection during the
post-task surveys changed participants’ subjective assessment of
their implementation. With Aporia, we found a significant positive correlation between participants’ initial and final confidence
( _𝜌_ = 0 _._ 70, _𝑝_ = 0 _._ 005), indicating that their confidence did not
shift much during the systematic mental review. We attribute this
stability to Aporia’s emphasis on reflection during the whole implementation process; participants had already thought through
their decisions before they were explicitly asked to.
Qualitatively, participants (P1, P4, P12, P16, P19) remarked that
the breadth of Aporia’s questions led to more calibrated confidence,
with P4 noting _“because [Aporia] asked me all those questions and I_
_made that decision, I would be pretty confident.”_ P1 described how
the volume of questions facilitated a _“pretty well-rounded implemen-_
_tation”_ : _“I would definitely stop after 5 or 6, but it kept generating, so_

_I’m like, oh, maybe this is a good thing to think about too.”_

Participants (P1, P3, P4, P7, P9, P10, P16, P17) also cited the
Decision Bank as another key affordance, serving as what P9 called
_“a trace of those decisions that were made”_ . We observed participants
actively returning to the bank to reflect on their understanding
during the tasks. For example, P8 walked through each decision




- **Survey Question:** What strategies did you use to validate your understanding of
your implementation? (select up to two)


Aporia Claude Code *User-written response



**Figure** **7:** **Participants’** **self-reported** **validation** **strategies.**

**Each bar indicates the number of responses for each strategy.**


while waiting for Aporia’s implementation to finish, rephrasing
them in their own words: _“Oh, so this is for admin, which we weren’t_

_really clear on the policies... okay, this is kind of covering the thing_

_that a person can have multiple roles... And this is for the PDF files? So,_

_I think this is handling the ambiguity of what paper details covers.”_

**Claude** **Code** **comparison:** For participants working with
Claude Code, the correlation between their initial and final confidence was not significant ( _𝜌_ = 0 _._ 26, _𝑝_ = 0 _._ 37), indicating variability
in their confidence upon reflection. For some participants, the posttask survey was the first time they reflected on their implementation
at all, and seven (P3, P7, P8, P10, P16, P18, P19) verbalized doubts
when having to describe their implementation (see Fig. 4). P3 noted
mid-survey: _“I’m thinking oh, the plan was not as good... because_

_there’s so many statuses, like, before submission, after submission,_

_and, for each role...I was not careful enough to approve the plan.”_ P8
echoed, _“There’s_ _**some decisions I feel like I didn’t really get into**_ _..._
_I just [thought] of that when I was filling out the form.”_ P10 simply
said, _“I think I should have not, uh, I think I should have spent more_
_time.”_ when questioning whether reviewers can see other reviews.
This phenomenon was not observed with Aporia.


_5.2.3_ _Aporia_ **scaffolded participants’ validation** _of their imple-_
_mentation._ As shown in Fig. 7, participants using both assistants
reported in the post-task surveys that their primary strategy for
checking that their NotCRP code aligned with their intent was
manual testing. Their secondary strategies differed, though: Aporia participants tended to rely on test suites, while Claude Code
participants relied on reading the generated plan and code.
We observed that Aporia’s test suites often directly influenced
how participants approached manual testing. Five participants (P4,
P8, P12, P15, P17) mapped test suites back to the Decision Bank
to validate that their intent was reflected. P4, while reviewing the
generated tests, noted _“Okay, yeah, these seem like they’re related to_
_the answers I selected.”_ P15 similarly observed that _“the comments_

_are very clear about what’s happening... I can kind of map it back to_

_the questions that I answered over here.”_

Five participants (P3, P4, P8, P12, P16) used Aporia-generated
test suites to _identify_ _what_ _to_ _validate_ . For example, before P12
began testing some new functionality in NotCRP, they said _“What_

_did I add since last time?... [reads test suite names aloud]... Okay, so I_

_should go to the draft [page].”_ Afterwards, they reflected that the
test suites _“complement... looking at the website... if I want to check a_



Manually tested the web app


Read the generated plan


Read the generated code


Ran unit tests


Read the generated tests


Did not verify (trusted the agent)


_“Asked the agent to sanity check_
_my understanding of the tests”_  













Conference’17, July 2017, Washington, DC, USA Kasibatla et al.



_specific decision... it’s nice to be able to_ _**pinpoint where this came**_
_**from and why it exists**_ _... and instead of looking at test names and_

_kind of guessing what it is, it says...I did this for this reason.”_

Despite these use cases, a majority of participants (P1, P3, P4,
P7, P8, P9, P12, P15, P16, P17, P18) stated that they did not always
engage with the test suites produced by either assistant. P17 put it
most directly: it was _“very useful that Aporia generated [test suites]._
_But I didn’t really use them.”_ P7 found the tests too verbose: “ _it’s_

_not so helpful [because I don’t] inspect [the tests] in...detail, and it’s_

_hard to...verify...whether it is actually correct._ Instead of using the
test suites to aid in their own thought process, many saw the tests
more as a _“mechanized way for theagent to double-check itself”_ (P9).
**Claude Code comparison:** Participants using Claude Code
relied primarily on reading the generated plan and code to supplement manual testing, but as discussed in Sec. 5.1.4, many participants expressed difficulty in locating and tracking their decisions
within the plan. Claude Code only generated test suites for five
participants (P4, P8, P12, P15, P18), and all but one had to explicitly
prompt the agent to do so. As with Aporia, participants did not
engage with the tests in detail— _“I told [Aporia] to make tests, and_
_then I didn’t really look at the tests”_ (P15)—but without traceability
to the plan, the tests offered little scaffolding support for validation.


**6** **Discussion & Limitations**


We structured our results in Sec. 5 around two research questions:
how Aporia affected decision discovery and articulation (RQ1) and
developers’ perceived vs. actual understanding of their code (RQ2).
We further discuss two cross-cutting themes from our thematic
analysis: how Aporia _scaffolded_ participants’ workflows and how
its interactivity promoted _engagement_ with the design process.


**6.1** **Scaffolding**


One common cross-cutting theme is that Aporia scaffolded participants’ workflow around decisions at every phase. Question bubbles
scaffolded intent formalization, surfacing decisions participants
might have missed (Sec. 5.2.1). The Decision Bank scaffolded those
decisions into a persistent, navigable record participants could
return to (Sec. 5.1.4). And per-decision test suites scaffolded validation, giving participants traceable anchors to the code(Sec. 5.2.3).
Together, these affordances embody DG1 (Sec. 1) by providing a
structured medium through which programmer and agent negotiate
the design. This organization also reflects the parallel structure between questions, decisions, and test suites we discussed in Sec. 3.2.
Participants generally appreciated this structure. P3 preferred
Aporia’s interface to Claude Code’s conversational mode, noting
that _“things_ _are_ _organized_ _in_ _chunks...I_ _feel_ _psychologically_ _more_
_patient...”_ P16 noted that Aporia’s organization helped them feel
confident: _“[I normally] just accept...what [coding agents] give me_
_and then check after the fact...[with Aporia] I feel more confident_ _**a**_
_**priori**_ _, before the agent even does anything.”_
However, participants also expressed frustrations with Aporia’s
organization. Some (P7, P11, P15) wanted more flexibility; P15 was
nervous about changing their goal, saying _“it feels like you can’t_
_re-steer it too easily,”_ . This is in contrast to Claude Code’s ability
to handle mid-implementation changes. Others (P9, P10) were confused by the relationship between questions, tests, and code; P9



described being _“confused about the state of the universe”_ as new
questions appeared before previous decisions were implemented.
These issues point to usability limitations of our probe, such as the
lack of progress indicators for implementation state.
Two participants (P7, P9), noted that they prefered Claude
Code’s “streamlined flow” (P9), aligning with other findings that
programmers who execute predefined strategies view their work
as more organized, yet more constrained [35].


**6.2** **Engagement**


A second common cross-cutting theme is that Aporia encouraged
_active engagement_ from participants at every phase. Participants
articulated three times as many decisions as with Claude Code,
leveraging both the Question Bubbles and custom decision input
(Sec. 5.1.2). They maintained and revised their Decision Banks
between rounds of implementation (Sec. 5.1.4, Sec. 5.2.2). They
grounded their decisions in the codebase through the Question Detail View’s relevant code references (Sec. 5.1.3). They later validated
their implementations, mapping test suites back to decisions to
guide integration testing (Sec. 5.2.3). Together, these interactions
embody DG2 (Sec. 1), by demonstrating interactive co-authoring.
Participants found this active participation empowering. P4 liked
managing their Decision Bank, saying that _“[Aporia] makes you_

_think about things that the AI would have normally just made its own_

_assumptions ...[you never] would have had an opportunity to ...make_

_those decisions yourself.”_ And P17 enjoyed using the Decision Bank
for code review, saying _“It’s easier to review the code, which I think_

_is a very important step for trusting the agent more automatically.”_

In contrast, participants experienced a loss of agency with Claude
Code. They struggled to identify and articulate their decisions
(5.1.2), parsed through verbose plans (5.1.4), and felt like they missed
key decisions (5.2.2). P1 summed this up, saying that _“[Aporia] re-_
_moves a lot of thinking, ..._ _**I don’t think anymore...I just prompt**_ _”_ .
Aporia impeded participants’ engagement as well. Seven participants (P1, P3, P4, P7, P10, P12) commented that Aporia’s high
latency broke their flow. In P12’s words, _“you sort of have this dead_
_time of, ...I’ve made all the decisions, and now I’m waiting”_ . Some
(P4, P7, P8, P10) said that Aporia’s UI was too complex, with P4
noting that _“there are...too many panels you need to navigate”_ . P7
suggested merging the Decision Bank and test suites into a consolidated interface to remedy these usability issues.


**6.3** **Future Work**


Some participants found aspects of Aporia’s interface challenging,
and their comments reveal productive directions for future work.
Several participants said they did not know which questions to
prioritize, and when they had answered “enough” of them to start
implementing. These difficulties suggest that Aporia could organize
questions hierarchically rather than linearly, flowing from highlevel decisions down to lower-level details. Similarly, participants
suggested a navigable “goal history” that clusters decisions under
different goals, giving programmers an editable record of how their
intent evolved while implementing a larger feature.
Other participants wondered about a “saturation point” where
most key decisions around a feature had been addressed, motivating
a UI indicator that suggests transitions to related features.


Decision-Oriented Programming with Aporia Conference’17, July 2017, Washington, DC, USA



We are also interested in helping participants _assess_ decisions
after they make them. Aporia occasionally discovered flaws in its
tests, but we did not allow it to edit them in order to preserve user
intent. Aporia could surface Question Bubbles at these moments to
create opportunities for users to iterate on the interpretation of their
decisions. Finally, we would like to explore other UI techniques for
eliciting decisions beyond questions, such as selecting from a list
of alternatives or inferring user intent from manual code edits.


**7** **Conclusion**


In this work, we explored decision-oriented programming (DOP), a
paradigm which seeks to support programmer decision-making by
reifying decisions as first-class objects. We instantiated DOP in a
design probe called Aporia, which elicits decisions with questions,
tracks them, and encodes them as test suites.
After evaluating Aporia in a user study, we found that tracking
decisions helped participants externalize their mental model of
the program design space; asking questions helped participants
discover and articulate design decisions; and encoding decisions as
test suites scaffolded participants’ validation process. Participants
used Aporia to make more informed decisions and develop more
accurate understandings of their code.
Our experience building and evaluating Aporia indicates that
DOP’s design goals have the potential to support programmer
decision-making and promote agency while retaining many of
agentic programming’s advantages. We are excited to continue
exploring how best to instantiate decision-oriented programming
in future research.


**Acknowledgments**


This work was supported in part by the NSF under Grant No. CCF2107397. This material is based upon work supported by the National Science Foundation Graduate Research Fellowship under
Grant No. DGE-2038238. Any opinions, findings, and conclusions
or recommendations expressed in this publication are those of the
authors, and do not necessarily reflect the views of the sponsoring
entities.
We would like to thank Carlo Furia, Brian Hempel, Aaron Broukhim,
Devamardeep Hayatpur, and Matthew Beaudouin-Lafon for their
invaluable feedback.


**References**


[1] [n. d.]. Agent Context Protocol. [https://zed.dev/acp](https://zed.dev/acp)

[2] [n. d.]. Model Context Protocol. [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)

[3] [n. d.]. Visual Studio Code. [https://code.visualstudio.com](https://code.visualstudio.com)

[4] Anthropic. 2026. _Claude Code CLI_ . [https://code.claude.com/docs/en/cli-reference](https://code.claude.com/docs/en/cli-reference)

[5] Anthropic. 2026. _Introducing Claude Sonnet 4.6_ . [https://www.anthropic.com/](https://www.anthropic.com/news/claude-sonnet-4-6)
[news/claude-sonnet-4-6](https://www.anthropic.com/news/claude-sonnet-4-6)

[6] Shraddha Barke, Michael B. James, and Nadia Polikarpova. 2023. Grounded
Copilot: How Programmers Interact with Code-Generating Models. _Proceedings_
_of the ACM on Programming Languages_ 7, OOPSLA1 (April 2023), 85–111. [doi:10.](https://doi.org/10.1145/3586030)
[1145/3586030](https://doi.org/10.1145/3586030)

[7] Kent Beck. 2002. _Test Driven Development. By Example_ . Addison-Wesley Longman,
Amsterdam.

[8] Kent Beck. 2015. _Test-driven development: by example_ (20. printing ed.). AddisonWesley, Boston.

[9] Markus Borg, Dave Hewett, Nadim Hagatulah, Noric Couderc, Emma Söderberg,
Donald Graham, Uttam Kini, and Dave Farley. 2026. Echoes of AI: Investigating the Downstream Effects of AI Assistants on Software Maintainability.
[arXiv:2507.00788 [cs.SE]](https://arxiv.org/abs/2507.00788) [https://arxiv.org/abs/2507.00788](https://arxiv.org/abs/2507.00788)




[10] Dibyendu Brinto Bose. 2025. From prompts to properties: Rethinking llm code
generation with property-based testing. In _Proceedings of the 33rd ACM Interna-_
_tional Conference on the Foundations of Software Engineering_ . 1660–1665.

[11] Virginia Braun and Victoria Clarke. 2006. Using thematic analysis in psychology.
_Qualitative research in psychology_ 3, 2 (2006), 77–101.

[12] Ruijia Cheng, Titus Barik, Alan Leung, Fred Hohman, and Jeffrey Nichols. 2024.
BISCUIT: Scaffolding LLM-Generated Code with Ephemeral UIs in Computational
Notebooks. In _2024 IEEE Symposium on Visual Languages and Human-Centric_
_Computing (VL/HCC)_ . 13–23. [doi:10.1109/VL/HCC60511.2024.00012](https://doi.org/10.1109/VL/HCC60511.2024.00012)

[13] Koen Claessen and John Hughes. 2000. QuickCheck: a lightweight tool for
random testing of Haskell programs. In _Proceedings of the Fifth ACM SIGPLAN_

_International Conference on Functional Programming (ICFP ’00), Montreal, Canada,_
_September 18-21, 2000_, Martin Odersky and Philip Wadler (Eds.). ACM, 268–279.
[doi:10.1145/351240.351266](https://doi.org/10.1145/351240.351266)

[14] Coder. 2026. _code-server: VS Code in the browser_ . [https://github.com/coder/code-](https://github.com/coder/code-server)
[server](https://github.com/coder/code-server)

[15] Cursor. 2023. Cursor. [https://cursor.com](https://cursor.com)

[16] Sarah Fakhoury, Aaditya Naik, Georgios Sakkas, Saikat Chakraborty, and Shuvendu K. Lahiri. 2024. LLM-Based Test-Driven Interactive Code Generation: User
Study and Empirical Evaluation. _IEEE Transactions on Software Engineering_ 50, 9
(2024), 2254–2268. [doi:10.1109/TSE.2024.3428972](https://doi.org/10.1109/TSE.2024.3428972)

[17] Muhammad Shoaib Farooq, Uzma Omer, Amna Ramzan, Mansoor Ahmad
Rasheed, and Zabihullah Atal. 2023. Behavior Driven Development: A Systematic Literature Review. _IEEE_ _Access_ 11 (2023), 88008–88024. [doi:10.1109/](https://doi.org/10.1109/ACCESS.2023.3302356)
[ACCESS.2023.3302356](https://doi.org/10.1109/ACCESS.2023.3302356)

[18] Ahmed Fawzy, Amjed Tahir, and Kelly Blincoe. 2025. Vibe Coding in Practice: Motivations, Challenges, and a Future Outlook – a Grey Literature Review.
[arXiv:2510.00328 [cs.SE]](https://arxiv.org/abs/2510.00328) [https://arxiv.org/abs/2510.00328](https://arxiv.org/abs/2510.00328)

[19] K. J. Kevin Feng, Kevin Pu, Matt Latzke, Tal August, Pao Siangliulue, Jonathan
Bragg, Daniel S. Weld, Amy X. Zhang, and Joseph Chee Chang. 2026. Cocoa:
Co-Planning and Co-Execution with AI Agents. [arXiv:2412.10999 [cs.HC]](https://arxiv.org/abs/2412.10999) [https:](https://arxiv.org/abs/2412.10999)
[//arxiv.org/abs/2412.10999](https://arxiv.org/abs/2412.10999)

[20] Katy Ilonka Gero, Chelse Swoopes, Ziwei Gu, Jonathan K. Kummerfeld, and
Elena L. Glassman. 2024. Supporting Sensemaking of Large Language Model
Outputs at Scale. In _Proceedings_ _of_ _the_ _CHI_ _Conference_ _on_ _Human_ _Factors_ _in_
_Computing Systems, CHI 2024, Honolulu, HI, USA, May 11-16, 2024_, Florian ’Floyd’
Mueller, Penny Kyburz, Julie R. Williamson, Corina Sas, Max L. Wilson, Phoebe
O. Toups Dugas, and Irina Shklovski (Eds.). ACM, 838:1–838:21. [doi:10.1145/](https://doi.org/10.1145/3613904.3642139)
[3613904.3642139](https://doi.org/10.1145/3613904.3642139)

[21] Emmanuel Anaya González, Raven Rothkopf, Sorin Lerner, and Nadia Polikarpova. 2025. HiLDE: Intentional Code Generation via Human-in-the-Loop Decoding. In _2025 IEEE Symposium on Visual Languages and Human-Centric Computing_
_(VL/HCC)_ . 222–233. [doi:10.1109/VL-HCC65237.2025.00032](https://doi.org/10.1109/VL-HCC65237.2025.00032)

[22] Kevin Han, Siddharth Maddikayala, Tim Knappe, Om Patel, Austen Liao, and Amir
Barati Farimani. 2026. TDFlow: Agentic Workflows for Test Driven Development.
In _Proceedings of the 19th Conference of the European Chapter of the Association_
_for Computational Linguistics (Volume 1: Long Papers)_, Vera Demberg, Kentaro
Inui, and Lluís Marquez (Eds.). Association for Computational Linguistics, Rabat,
Morocco, 1511–1527. [doi:10.18653/v1/2026.eacl-long.70](https://doi.org/10.18653/v1/2026.eacl-long.70)

[23] Sandra G Hart and Lowell E Staveland. 1988. Development of NASA-TLX (Task
Load Index): Results of empirical and theoretical research. In _Advances in psy-_
_chology_ . Vol. 52. Elsevier, 139–183.

[24] Grace Murray Hopper. 1952. The education of a computer. In _Proceedings of the_
_1952 ACM National Meeting (Pittsburgh)_ (Pittsburgh, Pennsylvania) _(ACM ’52)_ .
Association for Computing Machinery, New York, NY, USA, 243–249. [doi:10.](https://doi.org/10.1145/609784.609818)
[1145/609784.609818](https://doi.org/10.1145/609784.609818)

[25] Grace Murray Hopper. 1969. Standardization of high-level languages. In _Pro-_
_ceedings of the May 14-16, 1969, Spring Joint Computer Conference_ (Boston, Massachusetts) _(AFIPS_ _’69_ _(Spring))_ . Association for Computing Machinery, New
York, NY, USA, 608–609. [doi:10.1145/1476793.1476890](https://doi.org/10.1145/1476793.1476890)

[26] Yiran Hu, Nan Jiang, Shanchao Liang, Yi Wu, and Lin Tan. 2025. TENET: Leveraging Tests Beyond Validation for Code Generation. [arXiv:2509.24148 [cs.SE]](https://arxiv.org/abs/2509.24148)
[https://arxiv.org/abs/2509.24148](https://arxiv.org/abs/2509.24148)

[27] Ruanqianqian Huang, Avery Reyna, Sorin Lerner, Haijun Xia, and Brian Hempel.
2025. Professional Software Developers Don’t Vibe, They Control: AI Agent Use
for Coding in 2025. [arXiv:2512.14012 [cs.SE]](https://arxiv.org/abs/2512.14012) [https://arxiv.org/abs/2512.14012](https://arxiv.org/abs/2512.14012)

[28] GitHub Inc. 2022. GitHub Copilot. [https://github.com/features/copilot](https://github.com/features/copilot)

[29] Stack Exchange Inc. [n. d.]. 2025 Stack Overflow Developer Survey. [https:](https://survey.stackoverflow.co/2025)
[//survey.stackoverflow.co/2025](https://survey.stackoverflow.co/2025)

[30] Windsurf Inc. 2024. Windsurf. [https://windsurf.com](https://windsurf.com)

[31] Eshin Jolly. 2018. Pymer4: Connecting R and Python for linear mixed modeling.
_Journal of Open Source Software_ 3, 31 (2018), 862.

[32] Majeed Kazemitabaar, Jack Williams, Ian Drosos, Tovi Grossman, Austin Z. Henley, Carina Negreanu, and Advait Sarkar. 2024. Improving Steering and Verification in AI-Assisted Data Analysis with Interactive Task Decomposition. In

_Proceedings of the 37th Annual ACM Symposium on User Interface Software and_
_Technology (UIST ’24)_ . ACM. [doi:10.1145/3654777.3676345](https://doi.org/10.1145/3654777.3676345)


Conference’17, July 2017, Washington, DC, USA Kasibatla et al.




[33] Maurice George Kendall and Jean Dickinson Gibbons. 1962. Rank correlation
methods. (1962).

[34] Werner Kunz and Horst W. J. Rittel. 1970. _Issues_ _as_ _Elements_ _of_ _Information_
_Systems_ . Technical Report 131. Institute of Urban and Regional Development,
University of California, Berkeley, California.

[35] Thomas D. LaToza, Maryam Arab, Dastyni Loksa, and Amy J. Ko. 2020. Explicit
programming strategies. _Empir. Softw. Eng._ 25, 4 (2020), 2416–2449. [doi:10.1007/](https://doi.org/10.1007/S10664-020-09810-1)
[S10664-020-09810-1](https://doi.org/10.1007/S10664-020-09810-1)

[36] Yunhao Liang, Ruixuan Ying, Shiwen Ni, and Zhe Cui. 2026. Scaling TestDriven Code Generation from Functions to Classes: An Empirical Study.
[arXiv:2602.03557 [cs.SE]](https://arxiv.org/abs/2602.03557) [https://arxiv.org/abs/2602.03557](https://arxiv.org/abs/2602.03557)

[37] Wendy E. Mackay and Joanna McGrenere. 2025. Comparative Structured Observation. _ACM Trans. Comput.-Hum. Interact._ 32, 2, Article 14 (April 2025), 27 pages.
[doi:10.1145/3711838](https://doi.org/10.1145/3711838)

[38] Allan MacLean, Richard M. Young, Victoria Bellotti, and Thomas P. Moran. 1991.
Questions, Options, and Criteria: Elements of Design Space Analysis. _Hum._
_Comput. Interact._ 6, 3-4 (1991), 201–250. [doi:10.1080/07370024.1991.9667168](https://doi.org/10.1080/07370024.1991.9667168)

[39] Richard McElreath. 2018. _Statistical rethinking: A Bayesian course with examples_
_in R and Stan_ . Chapman and Hall/CRC.

[40] Dirk Merkel. 2014. Docker: lightweight linux containers for consistent development and deployment. _Linux journal_ 2014, 239 (2014), 2.

[41] Microsoft Corporation. 2026. _Visual Studio Code_ . [https://visualstudio.com Version](https://visualstudio.com)
1.109.

[42] Thomas P Moran and John M Carroll. 1996. _Design rationale: Concepts, techniques,_
_and use_ . CRC Press.

[43] Jakob Neilsen. 1994. _Heuristic Evaluation_ . John Wiley & Sons, Inc., USA. 25–62
pages.

[44] Anthropic PBC. 2025. Claude Code. [https://claude.com/product/claude-code](https://claude.com/product/claude-code)

[45] Veronica Pimenova, Sarah Fakhoury, Christian Bird, Margaret-Anne Storey, and
Madeline Endres. 2025. Good Vibrations? A Qualitative Study of Co-Creation,
Communication, Flow, and Trust in Vibe Coding. [arXiv:2509.12491 [cs.SE]](https://arxiv.org/abs/2509.12491) [https:](https://arxiv.org/abs/2509.12491)
[//arxiv.org/abs/2509.12491](https://arxiv.org/abs/2509.12491)

[46] Kevin Pu, Daniel Lazaro, Ian Arawjo, Haijun Xia, Ziang Xiao, Tovi Grossman,
and Yan Chen. 2025. Assistance or disruption? exploring and evaluating the
design and trade-offs of proactive ai programming support. In _Proceedings of the_
_2025 CHI conference on human factors in computing systems_ . 1–21.

[47] Advait Sarkar and Ian Drosos. 2025. Vibe coding: programming through conversation with artificial intelligence. [arXiv:2506.23253 [cs.HC]](https://arxiv.org/abs/2506.23253) [https://arxiv.org/](https://arxiv.org/abs/2506.23253)
[abs/2506.23253](https://arxiv.org/abs/2506.23253)

[48] Margaret-Anne Storey. 2026. From Technical Debt to Cognitive and Intent
Debt: Rethinking Software Health in the Age of AI. [arXiv:2603.22106 [cs.SE]](https://arxiv.org/abs/2603.22106)
[https://arxiv.org/abs/2603.22106](https://arxiv.org/abs/2603.22106)

[49] Sangho Suh, Meng Chen, Bryan Min, Toby Jia-Jun Li, and Haijun Xia. 2024.
Luminate: Structured Generation and Exploration of Design Space with Large
Language Models for Human-AI Co-Creation. In _Proceedings of the CHI Conference_

_on Human Factors in Computing Systems, CHI 2024, Honolulu, HI, USA, May 11-_
_16,_ _2024_, Florian ’Floyd’ Mueller, Penny Kyburz, Julie R. Williamson, Corina
Sas, Max L. Wilson, Phoebe O. Toups Dugas, and Irina Shklovski (Eds.). ACM,
644:1–644:26. [doi:10.1145/3613904.3642400](https://doi.org/10.1145/3613904.3642400)

[50] Mojtaba Vaismoradi, Hannele Turunen, and Terese Bondas. 2013. Content analysis and thematic analysis: Implications for conducting a qualitative descriptive
study. _Nursing & health sciences_ 15, 3 (2013), 398–405.

[51] Priyan Vaithilingam, Elena L. Glassman, Jeevana Priya Inala, and Chenglong
Wang. 2024. DynaVis: Dynamically Synthesized UI Widgets for Visualization
Editing. In _Proceedings of the 2024 CHI Conference on Human Factors in Computing_
_Systems_ (Honolulu, HI, USA) _(CHI ’24)_ . Association for Computing Machinery,
New York, NY, USA, Article 985, 17 pages. [doi:10.1145/3613904.3642639](https://doi.org/10.1145/3613904.3642639)

[52] Priyan Vaithilingam, Munyeong Kim, Frida-Cecilia Acosta-Parenteau, Daniel Lee,
Amine Mhedhbi, Elena L. Glassman, and Ian Arawjo. 2025. Semantic Commit:
Helping Users Update Intent Specifications for AI Memory at Scale. In _Proceedings_

_of the 38th Annual ACM Symposium on User Interface Software and Technology,_
_UIST_ _2025,_ _Busan,_ _Korea,_ _28_ _September_ _2025_ _-_ _1_ _October_ _2025_, Andrea Bianchi,
Elena L. Glassman, Wendy E. Mackay, Shengdong Zhao, Jeeeun Kim, and Ian
Oakley (Eds.). ACM, 137:1–137:18. [doi:10.1145/3746059.3747778](https://doi.org/10.1145/3746059.3747778)

[53] Priyan Vaithilingam, Tianyi Zhang, and Elena L. Glassman. 2022. Expectation vs.
Experience: Evaluating the Usability of Code Generation Tools Powered by Large
Language Models. In _CHI Conference on Human Factors in Computing Systems Ex-_
_tended Abstracts_ . ACM, New Orleans LA USA, 1–7. [doi:10.1145/3491101.3519665](https://doi.org/10.1145/3491101.3519665)

[54] Vasudev Vikram, Caroline Lemieux, Joshua Sunshine, and Rohan Padhye. 2023.
Can large language models write good property-based tests? _arXiv_ _preprint_
_arXiv:2307.04346_ (2023).

[55] Frank Wilcoxon. 1992. _Individual Comparisons by Ranking Methods_ . Springer
New York, New York, NY, 196–202. [doi:10.1007/978-1-4612-4380-9_16](https://doi.org/10.1007/978-1-4612-4380-9_16)

[56] Ryan Yen, Jiawen Stefanie Zhu, Sangho Suh, Haijun Xia, and Jian Zhao. 2024.
CoLadder: Manipulating Code Generation via Multi-Level Blocks. In _Proceedings_

_of the 37th Annual ACM Symposium on User Interface Software and Technology,_
_UIST 2024, Pittsburgh, PA, USA, October 13-16, 2024_, Lining Yao, Mayank Goel,
Alexandra Ion, and Pedro Lopes (Eds.). ACM, 11:1–11:20. [doi:10.1145/3654777.](https://doi.org/10.1145/3654777.3676357)



[3676357](https://doi.org/10.1145/3654777.3676357)

[57] J. D. Zamfirescu-Pereira, Eunice Jun, Michael Terry, Qian Yang, and Bjoern
Hartmann. 2025. Beyond Code Generation: LLM-supported Exploration of the
Program Design Space. In _Proceedings of the 2025 CHI Conference on Human Factors_
_in_ _Computing_ _Systems,_ _CHI_ _2025,_ _YokohamaJapan,_ _26_ _April_ _2025-_ _1_ _May_ _2025_,
Naomi Yamashita, Vanessa Evers, Koji Yatani, Sharon Xianghua Ding, Bongshin
Lee, Marshini Chetty, and Phoebe O. Toups Dugas (Eds.). ACM, 153:1–153:17.
[doi:10.1145/3706598.3714154](https://doi.org/10.1145/3706598.3714154)

[58] Wenshuo Zhang, Leixian Shen, Shuchang Xu, Jindu Wang, Jian Zhao, Huamin Qu,
and Linping Yuan. 2025. NeuroSync: Intent-Aware Code-Based Problem Solving
via Direct LLM Understanding Modification. In _Proceedings of the 38th Annual_

_ACM Symposium on User Interface Software and Technology, UIST 2025, Busan,_
_Korea, 28 September 2025 - 1 October 2025_, Andrea Bianchi, Elena L. Glassman,
Wendy E. Mackay, Shengdong Zhao, Jeeeun Kim, and Ian Oakley (Eds.). ACM,
30:1–30:19. [doi:10.1145/3746059.3747668](https://doi.org/10.1145/3746059.3747668)


