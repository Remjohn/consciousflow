## **TeachingCoach: A Fine-Tuned Scaffolding Chatbot for** **Instructional Guidance to Instructors**



Isabel Molnar [∗]

imolnar@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA


Sugana Chawla
schawla@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA



Peiyu Li [∗]

pli9@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA


James Lang
jlang4@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA



Si Chen
schen34@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA


Ronald Metoyer
rmetoyer@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA



Ting Hua
thua@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA


**Abstract**


Higher education instructors often lack timely and pedagogically
grounded support, as scalable instructional guidance remains limited and existing tools rely on generic chatbot advice or non-scalable
teaching center human-human consultations. We present _Teach-_
_ingCoach_, a pedagogically grounded chatbot designed to support
instructor professional development through real-time, conversational guidance. TeachingCoach is built on a data-centric pipeline
that extracts pedagogical rules from educational resources and uses
synthetic dialogue generation to fine-tune a specialized language
model that guides instructors through problem identification, diagnosis, and strategy development. Expert evaluations show TeachingCoach produces clearer, more reflective, and more responsive
guidance than a GPT-4o mini baseline, while a user study with
higher education instructors highlights trade-offs between conversational depth and interaction efficiency. Together, these results
demonstrate that pedagogically grounded, synthetic data driven
chatbots can improve instructional support and offer a scalable
design approach for future instructional chatbot systems.


**CCS Concepts**


- **Human-centered computing** → **Human computer interac-**
**tion** **(HCI)** ; - **Applied** **computing** → **Computer-assisted** **in-**
**struction** .


∗Both authors contributed equally to this work.


Permission to make digital or hard copies of all or part of this work for personal or
classroom use is granted without fee provided that copies are not made or distributed
for profit or commercial advantage and that copies bear this notice and the full citation
on the first page. Copyrights for components of this work owned by others than the
author(s) must be honored. Abstracting with credit is permitted. To copy otherwise, or
republish, to post on servers or to redistribute to lists, requires prior specific permission
and/or a fee. Request permissions from permissions@acm.org.
_Learning@Scale ’26, Seoul, South Korea_
© 2026 Copyright held by the owner/author(s). Publication rights licensed to ACM.
ACM ISBN 978-x-xxxx-xxxx-x/YYYY/MM
[https://doi.org/10.1145/nnnnnnn.nnnnnnn](https://doi.org/10.1145/nnnnnnn.nnnnnnn)



Nitesh V. Chawla
nchawla@nd.edu
University of Notre Dame
Notre Dame, Indiana, USA


**Keywords**


Instructional Support, Chatbot, Conversational AI, Dialogue Systems


**ACM Reference Format:**
Isabel Molnar, Peiyu Li, Si Chen, Sugana Chawla, James Lang, Ronald
Metoyer, Ting Hua, and Nitesh V. Chawla. 2026. TeachingCoach: A FineTuned Scaffolding Chatbot for Instructional Guidance to Instructors. In
_Proceedings of ACM Learning at Scale conference (Learning@Scale ’26)._ ACM,
[New York, NY, USA, 5 pages. https://doi.org/10.1145/nnnnnnn.nnnnnnn](https://doi.org/10.1145/nnnnnnn.nnnnnnn)


**1** **Introduction**


Effective teaching requires not only subject-matter expertise but
also skillful use of instructional strategies. Although educational
research provides abundant rules and principles, instructors often
struggle to apply them systematically in classroom contexts. Universities operate teaching and learning centers that offer workshops
and consultations, but these resources face key limitations: (1) support may not be available at the moment of need, (2) feedback is
often generic rather than tailored to an instructor’s background,
and (3) some educators hesitate to seek direct help for fear of appearing unskilled. As a result, many lack scalable and accessible
support for their professional growth.
Prior research on intelligent tutoring systems [5, 8] shows that
dialogue can scaffold reasoning and reflection, approaching the
effectiveness of human tutors. More recently, educational chatbots
and LLM-based frameworks [4, 11, 16, 21] have been developed to
model or support students, but surveys note that these systems are
often weakly grounded in pedagogy and rarely address instructor
professional development [3, 13].
Recent work has focused on supporting instructors through AIenabled analytics, assessment scalability, and workload reduction.
For example, studies examined the use of AI-generated practice
questions to scale established learning effects [19], conversational
interfaces that help instructors interpret learning analytics [22],
and LLM-based assignment report summaries that support teacher


Learning@Scale ’26, June 30 – July 3, 2026, Seoul, South Korea Molnar*, Li* et al.



insight [10]. However, little work directly targets instructional support grounded in pedagogical practices for higher education instructors; instead, such support often relies on teaching center
consultants, which is difficult to scale and frequently unavailable
at smaller or less-resourced institutions, highly US-centric, where
instructional support may be limited or entirely absent. [1]

Meanwhile, general-purpose LLMs like ChatGPT have become
widely accessible, but their responses are typically generic and
rarely apply evidence-based principles in a pedagogically scaffolded
way. To bridge this gap, we introduce _TeachingCoach_, a chatbot
system that simulates the role of a teaching expert and delivers
conversational guidance on instructional practice. At its core is
a pipeline that grounds the system in evidence-based pedagogy
while enabling scalable data generation and model training. Figure 1
illustrates this process, which we detail in the following sections.


**2** **Related Works**


Large language models (LLMs) have been widely used as _data gen-_
_erators_ to synthesize labeled examples and structured interactions
for model training, motivated by the cost, scarcity, and privacy limitations of human-collected data, as well as its susceptibility to bias
and annotation noise [6]. LLM-based data generation has been successfully applied across domains such as code generation [12] and
instruction following [20], and has played a central role in training
mainstream models including Alpaca [17]. TeachingCoach builds
on this line of work by using LLMs to synthesize multi-turn instructional dialogues and training on curated synthetic data filtered by
experts.
Beyond their role as data generators, recent work has also explored the use of LLMs as interactive tutors and instructional agents
for learning support.
Recent work has examined LLMs for learning and tutoring, highlighting both their promise and limitations. Evaluations such as
EducationQ show that teaching effectiveness does not scale linearly with model size or general reasoning ability [16]. Systems
such as PACE and Agent4Edu incorporate pedagogical strategies
through Socratic questioning and learner modeling to enable personalized support [4, 11]. However, these systems primarily focus
on student-centered tutoring. In contrast, recent human-centered
design research explores AI-based pedagogical agents that directly
support instructors by fostering trust, social transparency, and
flexible engagement, particularly to encourage adoption among
AI-conservative educators [1].
Related work has also examined classroom uses of generative AI
with an emphasis on AI literacy. Studies with middle school English
Language Arts teachers show how scaffolded AI use can support
students’ understanding of AI concepts and ethical use [14], but
position instructors mainly as facilitators rather than recipients
of instructional support. Similarly, recent approaches that train
LLM-based tutors using student models and pedagogical rubrics
prioritize student outcomes and offer limited support for instructors’
reflective practices or instructional decision-making [15].


[1https://podnetwork.org/content/uploads/Wright_PNN_NoCTLs_Jan2019_](https://podnetwork.org/content/uploads/Wright_PNN_NoCTLs_Jan2019_update2pdf.pdf)
[update2pdf.pdf](https://podnetwork.org/content/uploads/Wright_PNN_NoCTLs_Jan2019_update2pdf.pdf)



**3** **Pipeline of TeachingCoach**

**3.1** **Rules Extraction**


We start by building a pedagogical knowledge base from authoritative education resources [2, 9], where experts extract 36 core instructional rules and encode them as structured system prompts. Each
rule functions as a guiding pedagogical principle in dialogue generation, ensuring that conversations remain anchored in evidencebased practices rather than drifting toward generic or unsupported
advice.


**3.2** **Data Collection**


To support realistic and diverse training data, we use GPT-4o [7]
to generate **teacher profiles** that specify years of experience and
teaching subject, as well as **teaching challenges** such as managing
classroom attention. Given the extracted rules, teacher profiles, and
challenges, GPT-4o produces **multi-turn conversations** between
a teacher and a simulated expert. These dialogues capture how
instructional principles may be applied in practice. To guarantee
quality, human experts then review the conversations, removing
those that are inconsistent, repetitive, or pedagogically unsound.
The dataset serves as high-quality input for fine-tuning the model.
After filtering, the dataset contains 406,183 training, 4,156 validation, and 4,143 test examples.
Specifically, each multi-turn conversation is generated by starting from a single validated teaching dilemma that implicitly violates
one of the 36 practices. This scenario is paired with a synthetic
instructor profile (e.g., course type, class size, teaching experience,
and personality cues) to ground the interaction in a realistic classroom context. The conversation then unfolds as a dialogue between
the instructor and an expert teaching consultant over 20–30 turns,
progressing through stages of clarifying the teaching challenge,
exploring possible instructional strategies, planning concrete next
steps, and reflecting on how those strategies might work in practice. Instructor turns are conditioned on the scenario and profile
to surface realistic concerns and follow-up questions, while expert
responses are constrained to be concise, supportive, and actionable,
mirroring authentic teaching-center consultations.


**3.3** **Pedagogically-Grounded Model Training**


We fine-tune a LLaMA-2-13B-Chat model [18] with full parameter
update on curated multi-turn dialogues. Each dialogue consists of
a **system** **message** (teaching rules for the current instructional
phase), a **user message** (profile and challenge), and an **assistant**
**message** that first predicts a step descriptor and then generates the
response. Steps follow the Eberly Center strategies [2] - _Step 1: Identify_
_the Problem_, _Step 2: Explore Reasons_, and _Step 3: Develop Strategies_ .
Here is an example:


System: [rules keyed by phase]
User: [profile + challenge]
Assistant: <step>Step 1</step> [response]
...
User: [follow-up]
Assistant: <step>Step 2</step> [response]


2https://www.cmu.edu/teaching/solveproblem/index.html.


Work-in-Progress Learning@Scale ’26, June 30 – July 3, 2026, Seoul, South Korea


**Figure 1: Pipeline of TeachingCoach. Teaching guidelines are extracted from education resources, while GPT-4o generates**
**teacher profiles and teaching challenges. These inputs prompt GPT-4o to produce synthetic multi-turn conversations, which,**
**after expert filtering, are used to fine-tune a LLaMA model deployed as the TeachingCoach chatbot.**



Let _𝐻𝑡_ [(] _[𝑖]_ [)] denote the full conversation history up to assistant turn
_𝑡_ in dialogue _𝑖_ (including all prior system/user/assistant turns). The
assistant is trained to (1) _identify the current instructional step 𝜎𝑡_ [(] _[𝑖]_ [)]
from _𝐻𝑡_ [(] _[𝑖]_ [)], and then (2) _generate the response 𝑦𝑡_ [(] _[𝑖]_ [)] conditioned on
both _𝐻𝑡_ [(] _[𝑖]_ [)] and _𝜎𝑡_ [(] _[𝑖]_ [)] . We optimize the next-token objective over the
entire assistant turn (step tokens + response tokens):


L( _𝜃_ ) = − ∑︁ log _𝑃𝜃_ �[ _𝜎𝑡_ ( _𝑖_ ) _[,𝑦]_ _𝑡_ [(] _[𝑖]_ [)] []] [|] _[ 𝐻]_ _𝑡_ [(] _[𝑖]_ [)]      - _,_


_𝑖,𝑡_


At inference, the model first generates <step>Step _𝑚_ </step>
by leveraging _𝐻𝑡_ (the dialogue so far), thereby _judging_ which instructional stage applies; it then produces a response guided by the
corresponding step-specific rules provided in the system prompt.
For the end-user interface, the step tag can be logged for analytics
and personalization while optionally being hidden from the visible
transcript.
Because the step label itself is generated by the model, TeachingCoach aligns dialogue progression with a structured pedagogical
scaffold, producing conversations that naturally advance from problem identification to diagnosis to strategy development.
We chose LLaMA-13B as the backbone model because it provides
sufficient capability to model structured, multi-turn instructional
dialogue while remaining feasible to fine-tune on academic compute resources. Its open-weight nature enables full supervision over
both instructional step predictions and response generation, which
is essential for implementing pedagogically grounded training objectives.
We compare against GPT-4o as a baseline because it represents a
strong, widely deployed general-purpose LLM. Evaluating GPT-4o
in a zero-shot setting highlights the impact of explicit pedagogical
supervision and step-aware training in TeachingCoach, independent of model scale or proprietary data.


**4** **Evaluation**


We asked teaching experts to evaluate 200 conversations generated
by _TeachingCoach_ and a GPT-4o baseline. Each dialogue turn was
rated on four dimensions: _E1 clarity of responses_, _E2 respectful tone_,
_E3 encouragement of reflection and reasoning_, and _E4 acknowledg-_
_ment of user input_ . Ratings used a 3-point scale (1 = poor, 3 = strong).
Table 1 summarizes the results, showing that TeachingCoach consistently outperformed GPT-4o.



**E1** **E2** **E3** **E4**
GPT-4o baseline 2.01 1.99 1.68 1.85
TeachingCoach **2.62** **2.55** **2.59** **2.56**


**Table** **1:** **Average** **expert** **ratings** **over** **200** **conversations** **(3-**
**point scale). Higher scores are marked in bold.**


**Figure 2: The onboarding asks users to specific their experi-**
**ence, current courses, and AI attitudes**


**Figure 3: The chatbot interface allows users to interact with**
**the TeachingCoach model, demonstrating multi-turn instruc-**
**tional support.**


Learning@Scale ’26, June 30 – July 3, 2026, Seoul, South Korea Molnar*, Li* et al.


**6.2** **Findings**



**Figure 4: The dashboard provides a window for users to sched-**
**ule consultations with live experts, view the resources they**
**have collected, and manage their stored data**


**5** **Demo System**


TeachingCoach provides three components: **onboarding**, the **chat-**
**bot interface**, and the **dashboard** . Onboarding collects lightweight
background information (e.g., experience, courses taught, key challenges), to enable personalization with minimal user burden. The
chatbot interface is the core feature, supporting multi-turn conversations about teaching challenges. Dialogues follow a structured flow—problem identification, cause exploration, and strategy
development—enabling targeted, pedagogically grounded suggestions. As shown in Figure 3, an instructor might raise a concern
such as student engagement, and the chatbot responds with strategies like low-stakes quizzes or technology-enabled check-ins. The
dashboard acts as a hub for reflection and resource management,
storing conversation summaries, generated suggestions, and user
data. Together, these components make TeachingCoach accessible,
personalized, and scalable for professional support.


**6** **Preliminary User Study and Results**

**6.1** **Study Design**


We conducted a remote user study in August 2025 in which participants interacted with two versions of a demo system: one powered
by _TeachingCoach_ and one by a GPT-4o-mini baseline. Participants
explored the same teaching challenge with each system for up to
10 minutes per condition, with order counterbalanced. After each
interaction, participants completed a brief survey and a 15-minute
post-study interview.
We recruited 41 higher education instructors through public
postings across U.S. research universities, community colleges, and
liberal arts colleges. The sample included 22 faculty members and 19
teaching assistants or instructional staff. Participants were informed
that two versions of the system existed but were not told how the
systems differed or which model powered each version. The session
concluded with a semi-structured interview focused on perceived
differences between systems, preferences, and perceived learning
support.



The results show a distinction between overall preference and perceived recall. While the baseline model was preferred overall (21 vs.
13), participants more often attributed learning to the fine-tuned
model (18 vs. 13). Agreement between preference and learning attribution was low (39%), indicating that features driving preference do
not always match perceived instructional value. Participants consistently distinguished the models on conversational engagement,
efficiency of interaction, and breadth of suggestions.
_Conversational_ _Engagement_ . The fine-tuned model was often
described as engaging in dialogue resembling interaction with a
human pedagogy expert. Participants noted its use of reflective
questions and follow-up prompts that encouraged examination of
teaching practices. This conversational depth supported learning
through reflection, though some participants found it slowed the
interaction when seeking quick answers.
_Efficiency_ _of_ _Interaction_ . Efficiency was a key strength of the
baseline model. Participants valued its ability to generate responses
quickly, enabling rapid access to ideas when seeking immediate
guidance. In contrast, the fine-tuned model often required more
conversational turns to reach concrete suggestions, which some
perceived as inefficient, though others found the slower pace helpful
for clarifying goals and context.
_Breadth of Suggestions_ . The baseline model was associated with
greater breadth, offering wide-ranging strategies across contexts,
which allowed users to scan for relevant ideas but several participants felt overwhelmed. By contrast, the fine-tuned model offered
a narrower, more focused set of suggestions centered on specific
classroom practices, improving coherence while reducing exposure
to diverse strategies.
Overall the findings highlight a trade-off between depth and efficiency: the fine-tuned model supported learning through sustained
engagement and reflection, while the baseline model prioritized
speed and breadth of suggestions.


**7** **Discussion and Conclusion**


_TeachingCoach_ demonstrates how LLMs can be trained to follow
explicit instructional guidance by encoding instructional steps directly into training dialogues. Rather than relying on large-scale
human-collected teaching conversations, we use fully synthetic
data generated from instructional guidelines, instructor profiles,
and teaching challenges, enabling scalable training while avoiding
privacy and ethical concerns.
To understand how this step-aware instructional behavior is
perceived in practice, we conducted a user study comparing TeachingCoach with a GPT-4o-mini baseline, which represents a widely
used general-purpose conversational model optimized for efficiency
and broad coverage. The study reveals a clear trade-off between
interaction efficiency and instructional depth: while the baseline
model was often valued for its speed and breadth of suggestions,
TeachingCoach was more frequently associated with deeper instructional support through reflective dialogue and structured reasoning.
Rather than viewing this trade-off as a limitation, it motivates the
development of hybrid instructional systems that balance breadth
and depth based on user needs and context. One promising direction is a multi-agent architecture, in which agents are specialized


Work-in-Progress Learning@Scale ’26, June 30 – July 3, 2026, Seoul, South Korea



for complementary roles—for example, one prioritizing rapid idea
generation and broad strategy exploration, and another providing
structured instructional guidance and reflective questioning. Hybrid
behavior can also be achieved within a single agent through adaptive interaction modes, such as beginning with concise, breadthoriented suggestions and transitioning into deeper instructional
guidance when users seek reflection or clarification. In addition,
explicit control options (e.g., quick suggestions versus guided reflection) or progressive disclosure strategies can allow instructors
to align system behavior with their immediate instructional goals.
This study has several limitations. The sample comprised selfselected higher education instructors, which may limit generalizability to K-12 settings, informal learning environments, or institutions with different cultural and technological infrastructures.
Additionally, the evaluation focused on instructors’ perceptions
and did not directly assess student learning outcomes; future work
should examine the effects of step-aware instructional dialogue on
classroom practice and learning over time.
Although our study focuses on higher education instructors, the
data generation pipeline and training formulation are not limited to
this context. By modifying instructor profiles, teaching challenges,
and contextual constraints, the same approach can be applied to
other instructor-facing settings, such as K–12 teaching, professional
training, instructional coaching, mentoring, and tutoring support.
More broadly, this work points toward a general approach for developing instructor-facing instructional dialogue systems that support
reflective teaching practice across domains, while preserving pedagogical consistency, scalability, and privacy.
[Please find conversation examples and our codebase at https://osf.](https://osf.io/n2xyu/overview?view_only=e5b85d85b4a842dea902d9714f6faa67)
[io/n2xyu/overview?view_only=e5b85d85b4a842dea902d9714f6faa67.](https://osf.io/n2xyu/overview?view_only=e5b85d85b4a842dea902d9714f6faa67)


**References**


[1] Si Chen, Reid Metoyer, Khiem Le, Adam Acunin, Izzy Molnar, Alex Ambrose,
James Lang, Nitesh Chawla, and Ronald Metoyer. 2025. Bridging the AI adoption
gap: Designing an interactive pedagogical agent for higher education instructors.
In _International Conference on Artificial Intelligence in Education_ . Springer, 171–
178.

[2] Flower Darby and James M Lang. 2019. _Small teaching online: Applying learning_
_science in online classes_ . John Wiley & Sons, San Fransisco, CA.

[3] Tim Debets, Seyyed Kazem Banihashem, Desirée Joosten-Ten Brinke, Tanja EJ
Vos, Gideon Maillette de Buy Wenniger, and Gino Camp. 2025. Chatbots in
education: A systematic review of objectives, underlying technology and theory,
evaluation criteria, and impacts. _Computers & Education_ (2025), 105323.

[4] Weibo Gao, Qi Liu, Linan Yue, Fangzhou Yao, Rui Lv, Zheng Zhang, Hao Wang,
and Zhenya Huang. 2025. Agent4edu: Generating learner response data by
generative agents for intelligent education systems. In _Proceedings of the AAAI_
_Conference on Artificial Intelligence_, Vol. 39. 23923–23932.

[5] Arthur C Graesser, Shulan Lu, George Tanner Jackson, Heather Hite Mitchell,
Mathew Ventura, Andrew Olney, and Max M Louwerse. 2004. AutoTutor: A tutor
with dialogue in natural language. _Behavior Research Methods, Instruments, &_
_Computers_ 36, 2 (2004), 180–192.

[6] Or Honovich, Thomas Scialom, Omer Levy, and Timo Schick. 2023. Unnatural
instructions: Tuning language models with (almost) no human labor. In _Proceed-_
_ings of the 61st Annual Meeting of the Association for Computational Linguistics_
_(Volume 1: Long Papers)_ . 14409–14428.

[7] Aaron Hurst, Adam Lerer, Adam P Goucher, Adam Perelman, Aditya Ramesh,
Aidan Clark, AJ Ostrow, Akila Welihinda, Alan Hayes, Alec Radford, et al. 2024.
Gpt-4o system card. _arXiv preprint arXiv:2410.21276_ (2024).

[8] W Lewis Johnson and James C Lester. 2018. Pedagogical agents: back to the
future. _AI Magazine_ 39, 2 (2018), 33–44.

[9] James M Lang. 2021. _Small teaching: Everyday lessons from the science of learning_ .
John Wiley & Sons, San Fransisco, CA.

[10] Wen-Chiang Ivan Lim, Neil T Heffernan III, Ivan Eroshenko, Wai Khumwang,
and Pei-Chen Chan. 2025. Leveraging LLMs for assignment report summaries
to support teacher insights in intelligent tutoring systems. In _Proceedings of the_
_Twelfth ACM Conference on Learning@ Scale_ . 356–360.




[11] Ben Liu, Jihai Zhang, Fangquan Lin, Xu Jia, and Min Peng. 2025. One size doesn’t
fit all: A personalized conversational tutoring agent for mathematics instruction.
In _Companion Proceedings of the ACM on Web Conference 2025_ . 2401–2410.

[12] Ziyang Luo, Can Xu, Pu Zhao, Qingfeng Sun, Xiubo Geng, Wenxiang Hu,
Chongyang Tao, Jing Ma, Qingwei Lin, and Daxin Jiang. 2023. Wizardcoder:
Empowering code large language models with evol-instruct. _arXiv_ _preprint_
_arXiv:2306.08568_ (2023).

[13] Chinedu Wilfred Okonkwo and Abejide Ade-Ibijola. 2021. Chatbots applications
in education: A systematic review. _Computers and Education: Artificial Intelligence_
2 (2021), 100033.

[14] Daniel Ritchie, Tamara Tate, Yi Zhang, Kristi Werry, and Mark Warschauer.
2025. Supporting Middle School English Teachers’ AI Literacy Goals Through
a Generative AI Tutor. In _International_ _Conference_ _on_ _Artificial_ _Intelligence_ _in_
_Education_ . Springer, 283–290.

[15] Alexander Scarlatos, Naiming Liu, Jaewook Lee, Richard Baraniuk, and Andrew
Lan. 2025. Training LLM-Based Tutors to Improve Student Learning Outcomes
in Dialogues. In _International Conference on Artificial Intelligence in Education_ .
Springer, 251–266.

[16] Yao Shi, Rongkeng Liang, and Yong Xu. 2025. EducationQ: Evaluating LLMs’
Teaching Capabilities Through Multi-Agent Dialogue Framework. _arXiv preprint_
_arXiv:2504.14928_ (2025).

[17] Rohan Taori, Ishaan Gulrajani, Tianyi Zhang, Yann Dubois, Xuechen Li, Carlos
Guestrin, Percy Liang, and Tatsunori B Hashimoto. 2023. Stanford alpaca: An
instruction-following llama model.

[18] Hugo Touvron, Louis Martin, Kevin Stone, Peter Albert, Amjad Almahairi, Yasmine Babaei, Nikolay Bashlykov, Soumya Batra, Prajjwal Bhargava, Shruti Bhosale, et al. 2023. Llama 2: Open foundation and fine-tuned chat models. _arXiv_
_preprint arXiv:2307.09288_ (2023).

[19] Rachel Van Campenhout, Kevin S Autry, Michelle W Clark, and Benny G Johnson.
2025. Scaling the doer effect: A replication analysis using AI-generated questions.
In _Proceedings of the Twelfth ACM Conference on Learning@ Scale_ . 24–34.

[20] Yizhong Wang, Yeganeh Kordi, Swaroop Mishra, Alisa Liu, Noah A Smith, Daniel
Khashabi, and Hannaneh Hajishirzi. 2023. Self-instruct: Aligning language models with self-generated instructions. In _Proceedings of the 61st annual meeting of_
_the association for computational linguistics (volume 1: long papers)_ . 13484–13508.

[21] Songlin Xu, Xinyu Zhang, and Lianhui Qin. 2024. Eduagent: Generative student
agents in learning. _arXiv preprint arXiv:2404.07963_ (2024).

[22] Chao Yang, Deliang Wang, and Gaowei Chen. 2025. Chat-LAD: Enhancing teacher
understanding of learning analytics dashboard with AI-empowered explanations.
In _Proceedings of the Twelfth ACM Conference on Learning@ Scale_ . 197–201.


