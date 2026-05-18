## **From Passive Consumption to Active Interaction: Exploring** **Interactive LLM Scaffolding to Support Learning Engagement**



[Zixin Chen](https://orcid.org/0000-0001-8507-4399)
The Hong Kong University of Science
and Technology
Hong Kong, China
zchendf@connect.ust.hk



[Haotian Li](https://orcid.org/0000-0001-9547-3449)
Microsoft Research Asia
Beijing, China
haotian.li@microsoft.com



[Zhe Liu](https://orcid.org/0000-0002-1904-9045)
University of British Columbia
Vancouver, British Columbia, Canada
zheliu92@cs.ubc.ca



[Huamin Qu](https://orcid.org/0000-0002-3344-9694)
The Hong Kong University of Science
and Technology
Hong Kong, China
huamin@cse.ust.hk


**Abstract**

Large Language Models (LLMs) are increasingly used as learning
companions, providing scaffolded explanations, hints, or step-bystep guidance. However, in current LLM-based learning scenarios,
scaffolded content is primarily consumed passively, offering limited
support for active learner engagement. Learning science research
suggests that effective educational scaffolding depends not only on
what support is provided, but also on how learners engage with
it. In this work, we explore whether embedding lightweight interactive components into LLM-generated scaffolding responses can
promote learning-oriented engagement and improve short-term
learning outcomes. We evaluated this approach through a withinsubjects laboratory study (N=8). Results provide initial evidence
that interactive scaffolding increases learners’ perceived engagement and attentional focus, while supporting short-term learning
performance. We conclude with design implications for integrating interaction into LLM-generated scaffolding to support active
learning engagement.


**CCS Concepts**

- **Human-centered** **computing** → **Interactive** **systems** **and**
**tools** .


**Keywords**

Interactive scaffolding, large language model, learning engagement


**ACM Reference Format:**
Zixin Chen, Haotian Li, Zhe Liu, Huamin Qu, and Xing Xie. 2026. From
Passive Consumption to Active Interaction: Exploring Interactive LLM
Scaffolding to Support Learning Engagement. In _Extended Abstracts of the_
_2026 CHI Conference on Human Factors in Computing Systems (CHI EA ’26),_
_April_ _13–17,_ _2026,_ _Barcelona,_ _Spain._ ACM, New York, NY, USA, 6 pages.
[https://doi.org/10.1145/3772363.3798931](https://doi.org/10.1145/3772363.3798931)


[This work is licensed under a Creative Commons Attribution 4.0 International License.](https://creativecommons.org/licenses/by/4.0)
_CHI EA ’26, Barcelona, Spain_
© 2026 Copyright held by the owner/author(s).
ACM ISBN 978-1-4503-XXXX-X/2018/06
[https://doi.org/10.1145/3772363.3798931](https://doi.org/10.1145/3772363.3798931)



[Xing Xie](https://orcid.org/0009-0009-3257-3077)
Microsoft Research Asia
Beijing, China
xingx@microsoft.com


**1** **Introduction**

Large Language Models (LLMs) are increasingly integrated into
everyday activities, emerging as a common form of personal support [14]. In educational contexts, a growing number of learners
have begun to treat LLMs as personal tutors for real-time learning
support, using them to explain questions, assist with exercises, and
even recommend personalized learning materials [4, 5, 15, 20, 27].
In response to this trend, recent research has explored the development of LLM-powered intelligent tutoring systems that better
approximate effective human teaching practices by incorporating
principles from the learning sciences [22, 29]. Among various tutoring strategies, scaffolding has emerged as one of the most widely
adopted approaches, as its emphasis on adaptive and auxiliary support naturally aligns with learner–LLM interactions [31]. Prior work
has demonstrated that LLMs are capable of breaking down complex
ideas, providing partial guidance, and structuring solution processes
in ways that respond to learners’ needs [6, 7, 10, 17, 18, 26].
While these practices closely reflect long-established educational
theories of scaffolding, their delivery is often constrained by standard chatbot interfaces, which primarily rely on static textual responses [1]. As a result, LLM-based scaffolding is typically consumed through reading model outputs [2, 23], in contrast to traditional classroom settings where learners are encouraged to actively engage with instructional materials—for example, by filling
in missing steps, annotating key statements, or completing partially
worked solutions [9]. Consequently, current LLM-based scaffolding offers limited support for learners to _interact with_ scaffolded
content itself, beyond passively receiving it [3, 19].
This limitation is critical because decades of learning sciences
research suggest that effective learning outcomes depend not only
on the presence of scaffolding, but also on how learners engage
with instructional materials [16, 21, 33]. According to the widely
adopted ICAP framework [8], learner engagement ranges from passive to active, constructive, and interactive, depending on learners’
observable actions. In current LLM-based learning scenarios, engagement remains skewed toward passive consumption. While constructive and interactive engagement may occasionally occur when
learners generate new ideas or ask follow-up questions through
dialogue [8, 24, 25], the primary educational content in LLM-based
learning—the scaffolded content within LLM responses—is most


CHI EA ’26, April 13–17, 2026, Barcelona, Spain Trovato et al.


**Figure 1: Overview of the LLM-based tutoring prototype. (A) The Learning Material Zone presents the target proof and allows**
**learners to select the scaffolding condition. (B) The Chatbot Tutor Zone supports question-driven interaction with the LLM;**
**scaffolded** **content** **is** **revealed** **via** **scratch-off** **interaction** **in** **the** **interactive** **condition** **and** **shown** **as** **plain** **text** **in** **the** **non-**
**interactive condition.**



often consumed passively, for example through reading generated
explanations [15, 30]. Active engagement, which involves interacting or working directly with the provided instructional materials,
remains weakly supported in conventional conversational interfaces [11, 15]. As a result, the key challenge for future AI learning
scaffolding lies not in _what_ LLMs can generate, but in _how_ scaffolded content is presented to guide learners’ attention and promote
active leaarning engagement.
In this work, we empirically investigate whether embedding
lightweight interactive mechanisms into LLM-generated scaffolding responses can promote learners’ active engagement and benefit
short-term learning in conversation-based learning settings. We
treat interaction as a means to deliberately guide learners’ attention
to scaffolded content, inspired by recent interface designs that support targeted and dynamic interactions with LLM-generated content [28]. Specifically, we design an interactive LLM-based learning
system as a design probe. In this system, scaffolded content within
LLM responses (e.g., concept explanations) is initially masked and
can only be revealed through a simple scratch-off interaction, requiring learners to actively engage with the content before accessing
it.
We evaluate this design through a within-subjects laboratory
study (N = 8) using a college-level number theory proof comprehension task adapted from prior educational research [13]. Participants
learned two mathematical proofs with LLM support under two



conditions: interactive scaffolding and non-interactive (static) scaffolding. Learning outcomes were assessed using corresponding
comprehension quizzes, while learners’ engagement experiences
and perceptions were examined through post-task surveys. In addition, we conducted think-aloud interview studies to elicit participants’ interaction design ideas for enriching interactive scaffolding.
Together, this work provides initial empirical evidence and design
insights showing how lightweight interaction, serving as a design
probe, can guide learners’ attention to scaffolded content and support learning-oriented engagement in LLM-based learning.


**2** **Methods**

This study aims to empirically examine whether adding lightweight
interaction to LLM-generated scaffolding can influence learners’
engagement experiences and short-term learning outcomes. To this
end, we designed an interactive LLM tutoring prototype as a design
probe and conducted a controlled within-subject laboratory study
comparing interactive and non-interactive scaffolding conditions.


**2.1** **Prototype Design**

We developed an LLM-based tutoring prototype that supports both
_interactive_ and _non-interactive_ scaffolding variants in the LLM’s
responses. It allows learners to study mathematical proofs with
LLM support either through a standard chatbot interface or through


Exploring Interactive LLM Scaffolding to Support Learning Engagement CHI EA ’26, April 13–17, 2026, Barcelona, Spain


**Figure 2: (A) NASA-TLX workload ratings across conditions. (B) Proof comprehension quiz performance across conditions and**
**number of questions asked during the learning phase. (C) Perceived helpfulness and engagement of interactive scaffolding**
**(7-point Likert).**



an interactive mode in which scaffolded content is revealed via a
scratch-off interaction.
The interface consists of two main zones: a _Learning Material_
_Zone_ (fig. 1-A) and a _Chatbot Tutor Zone_ (fig. 1-B). In the Learning
Material Zone, learners view the target proof and select the scaffolding condition. In the Chatbot Tutor Zone, learners ask questions
about the proof and receive LLM responses. Under the interactive
condition, scaffolded content within the responses (e.g., definitions
or explanatory guidance) is initially masked and must be actively
revealed through a mouse-based scratch-off interaction (fig. 1-b1,
b3). Under the non-interactive condition, the same content is presented as plain text. When the learning phase ends (fig. 1-b2), the
Chatbot Tutor Zone switches to a quiz interface (fig. 1-b4), and
learners can no longer interact with the LLM.
The system uses the GPT-5.2 model with tailored prompts that
encourage established scaffolding practices, such as hints, explanations, and step-by-step guidance, following prior scaffolding theory [32]. To support interactive scaffolding, the LLM explicitly
marks scaffolded content segments in its responses, which are then
detected by a client-side script to enable scratch-off interaction. To
assess the reliability of LLM-identified scaffolding segments, we
conducted a pilot study with two participants prior to the main
experiment. Two authors independently annotated 36 scaffolded
segments identified by the LLM using definitions from prior scaffolding literature [32]. Among these segments, 75% were recognized
as scaffolding by both annotators and 83.33% by at least one annotator, indicating sufficient reliability for use in the main study.
Prompt templates are provided in the Appendix.


**2.2** **Experimental Design**

**Learning Task.** The learning task was adapted from prior educational research on proof comprehension [13]. We selected two
college-level number theory proofs (Proof A and Proof C from [13]),
each accompanied by a corresponding set of multiple-choice comprehension questions developed in the original study. The proofs
were presented line by line within the system interface. The quizzes
assessed learners’ understanding of proof structure, logical dependencies, and key reasoning steps, and were used as a measure of



short-term learning outcomes. Detailed materials are provided in
the Appendix.
**Design and Conditions.** We employed a within-subjects design to
compare two scaffolding conditions: _interactive scaffolding_ and _non-_
_interactive scaffolding_ . Each participant experienced both conditions,
learning one proof under each condition. To mitigate ordering
effects, the assignment of proof (A vs. C) to scaffolding condition
and the order in which participants encountered the two proofs
were counterbalanced across participants. This resulted in four
counterbalancing sequences, with two participants assigned to each
sequence. Across both conditions, the instructional content and
LLM behavior were held constant, with the only difference being
whether scaffolded content in the LLM’s responses was presented
with interactive masking or as plain text.
**Procedure.** The IRB-approved study procedure lasted approximately 60 minutes and consisted of five phases:
**1)** . After reviewing the study information and providing informed consent, participants first completed a brief exposure phase.
They were given three minutes to skim both Proof A and Proof C to
verify that they were not already familiar with either proof. Participants were explicitly instructed that this phase was not intended
for learning, but only to confirm unfamiliarity with the materials.
**2)** . Participants then completed two “learning–quiz” cycles, one
for each proof. First, participants studied a proof with LLM support for up to 15 minutes under the assigned scaffolding condition
(interactive or non-interactive). They worked through the proof
line by line and could freely ask questions to the LLM. Participants
could also end the learning phase early and proceed directly to the
quiz.
**3)** . Participants then completed a comprehension quiz corresponding to the studied proof. Each quiz consisted of 10 multiplechoice questions and was completed under a 10-minute time limit.
**4)** . Next, Participants proceeded to the second “learning–quiz”
cycle, in which they studied the remaining proof under the alternate
scaffolding condition, followed by its corresponding comprehension
quiz with the same time constraints.
**5)** . Finally, participants completed a post-study questionnaire
assessing their experiences with both scaffolding conditions, focusing on perceived engagement, attention allocation, and perceived


CHI EA ’26, April 13–17, 2026, Barcelona, Spain Trovato et al.


**Figure 3: Interaction design ideas proposed by participants during the think-aloud brainstorming. Designs are analyzed and**
**organized by** _**scaffolding means**_ **, illustrating how different interaction forms align with distinct pedagogical roles of scaffolding.**



usefulness for learning. Participants then took part in a 10-minute
think-aloud interview to brainstorm interaction design ideas for
LLM-generated scaffolding.
**Participants.** We recruited eight participants via email invitations
at the authors’ institution. All participants were computer science
PhD students with undergraduate-level mathematics backgrounds.
They reported prior experience learning mathematical proofs but
no prior familiarity with the two target theorems used in this study.
The study was conducted in a controlled laboratory setting.


**3** **Findings**

We report quantitative results from post-study questionnaires and
proof comprehension quizzes, complemented by participants’ openended feedback (N=8).
**Workload and Usability.** Overall, participants perceived the interactive scaffolding interface as usable and no more demanding
than the non-interactive chatbot condition. NASA-TLX ratings [12]
indicate that introducing interaction did not increase perceived
workload: the interactive condition showed slightly lower overall
workload (M=49.8, SD=14.9) than the non-interactive condition
(M=52.8, SD=17.3) (fig. 2-A). Across subscales, _Effort_ and _Frustration_
were lower with interactive scaffolding, while _Physical Demand_ was
slightly higher due to the additional mouse-based interaction. Usability was rated positively, with high SUS scores (M=81.6, SD=8.1;
range 70–95), indicating that the interactive interface was easy to
learn and use. It is possible that interaction structured learners’
attention and pacing when engaging with scaffolded content, reducing perceived effort and frustration despite the added physical
interaction.
**Learning Outcomes and Learning Behaviors.** Interactive scaffolding showed a positive trend in learning outcomes (fig. 2-B).
Participants achieved slightly higher quiz scores with interactive
scaffolding (M=80.0%, SD=11.95) than with non-interactive scaffolding (M=77.5%, SD=11.65). Learning behaviors also differed directionally: participants asked fewer questions under the interactive



condition (M=3.75, SD=1.75) than under the non-interactive condition (M=4.38, SD=3.02), suggesting that interaction may support
understanding with fewer conversational turns.
**Perceived** **Engagement** **and** **Helpfulness.** Survey responses
indicate that participants perceived interactive scaffolding as supportive of learning-oriented engagement (7-point Likert; fig. 2-C).
Participants agreed that the interaction helped them focus on relevant proof content (M=5.75, SD=0.46), increased active involvement
compared to plain text (M=6.13, SD=0.64), and was helpful for
learning overall (M=5.50, SD=0.76). Participants also reported a
clear preference for the interactive format over a standard chatbot
(M=5.75, SD=1.04).


**4** **Design Insights from Think-Aloud Interview**
**Study**

To move beyond a single interaction, we conducted a think-aloud
interview with a brief co-design component following the lab study.
Our goal was to elicit participants’ intuitions about how interaction could better support different forms of scaffolding in LLMbased learning. Guided by prior scaffolding literature [32], we organize these bottom-up ideas around six _scaffolding means_ —including
hinting, instructing, explaining, modeling, feedback, and questioning—and illustrate how each may benefit from distinct interaction
designs. In particular, we identify the scratch-off design probe as
most naturally aligned with _hinting_, as it delays access to partial
guidance while remaining lightweight.
**Explaining through Just-in-Time Micro-Annotations.** For scaffolding with an _explanatory_ role, our analysis highlights the value of
localized, on-demand interactions that clarify meaning without disrupting the learning flow. Across participants (e.g., P1, P4), a recurring pattern was to highlight key terms or phrases in the LLM’s response and allow learners to access brief explanations when needed.
Common examples included hover-based micro-annotations on
highlighted terms, which temporarily reveal concise definitions,
contextual reminders, or clarifications before fading back into the


Exploring Interactive LLM Scaffolding to Support Learning Engagement CHI EA ’26, April 13–17, 2026, Barcelona, Spain



main response (fig. 3-A). Participants also envisioned explicitly
linking explanations to learners’ original questions, for instance
through visual anchors pointing back to triggering keywords. Together, these designs frame explanation as just-in-time clarification
that supports focused attention within scaffolded content.
**Instructing through Sequencing and Matching Interactions.**
When scaffolding serves an _instructional_ purpose, particularly for
step-by-step procedures or worked examples, our analysis highlights interaction designs that require learners to actively organize or reconstruct instructional structure embedded in the LLM’s
response. Participants (e.g., P2, P5) described designs in which
instructional steps are presented out of order and learners must
reorder them, match steps to rationales, or drag key elements into
appropriate positions (fig. 3-B). These sequencing- and matchingbased interactions shift instruction from passive consumption to
procedural engagement, prompting learners to reason about order, dependency, and structure as they interact with scaffolded
guidance.
**Modeling through Progressive and Multimodal Exploration.**
For _modeling_ -oriented scaffolding, where the goal is to demonstrate
expert reasoning or solution processes, our synthesis highlights interaction designs that support progressive exposure and structured
exploration of modeled content. Participants proposed expandable
worked examples, stepwise reveals, and interactive visual structures such as concept maps that learners can unfold incrementally
(fig. 3-C). Participants also suggested complementing with additional modalities, including audio narration or short walkthrough
videos, to foreground reasoning flow and emphasis. Together, these
interaction forms support modeling by helping learners selectively
attend to expert strategies and reasoning patterns without being
overwhelmed by complete solutions.
**Questioning and Feeding Back through Checkpoints and Sig-**
**nals.** In addition to the interaction directions discussed above, our
analysis also connects participants’ ideas to the remaining scaffolding means. For example, lightweight pop-up checkpoints naturally
align with _questioning_ by prompting learners to articulate an answer, while immediate audio or visual cues can support _feedback_
by providing timely signals following learners’ actions (fig. 3-D).
Taken together, these insights suggest that interaction design
in LLM-based learning should not be treated as a one-size-fits-all
enhancement. Instead, different _scaffolding means_ call for distinct
interaction strategies that guide how learners attend to, engage
with, and act upon scaffolded content, pointing toward future work
on principled mappings between interaction design and pedagogical
intent.


**5** **Conclusion**

This work explored integrating lightweight interaction into LLMgenerated scaffolding and provide initial empirical evidence and
design insights for supporting learner engagement in conversationbased learning. Using a design probe, our results highlight interaction as a promising lever for rethinking how LLM-generated
scaffolding can guide learners’ attention and support learning engagement and outcomes across contexts. As an exploratory study,
our findings should be interpreted as preliminary, grounded in a
small-scale, short-term laboratory investigation with a relatively



homogeneous participant pool. While the interactive condition was
associated with higher perceived engagement and modest shortterm comprehension gains, the underlying cognitive mechanisms
remain to be further clarified—for instance, whether the effect reflects genuinely constructive engagement or simply slower, more
attentive reading induced by the interaction. Future work should
incorporate richer behavioral evidence and more diverse learner
populations to better understand the robustness and generalizability of these effects.


**References**

[1] Ibrahim Adeshola and Adeola Praise Adepoju. 2024. The opportunities and
challenges of ChatGPT in education. _Interactive Learning Environments_ 32, 10
(2024), 6159–6172.

[2] David Baidoo-Anu and Leticia Owusu Ansah. 2023. Education in the era of
generative artificial intelligence (AI): Understanding the potential benefits of
ChatGPT in promoting teaching and learning. _Journal of AI_ 7, 1 (2023), 52–62.

[3] Ananya Bhattacharjee, Yuchen Zeng, Sarah Yi Xu, Dana Kulzhabayeva, Minyi Ma,
Rachel Kornfield, Syed Ishtiaque Ahmed, Alex Mariakakis, Mary P Czerwinski,
Anastasia Kuzminykh, et al. 2024. Understanding the role of large language
models in personalizing and scaffolding strategies to combat academic procrastination. In _Proceedings of the 2024 CHI Conference on Human Factors in Computing_
_Systems_ . 1–18.

[4] Zixin Chen, Sicheng Song, Kashun Shum, Yanna Lin, Rui Sheng, Weiqi Wang,
and Huamin Qu. 2025. Unmasking deceptive visuals: Benchmarking multimodal
large language models on misleading chart question answering. In _Proceedings_
_of_ _the_ _2025_ _Conference_ _on_ _Empirical_ _Methods_ _in_ _Natural_ _Language_ _Processing_ .
13767–13800.

[5] Zixin Chen, Jiachen Wang, Yumeng Li, Haobo Li, Chuhan Shi, Rong Zhang, and
Huamin Qu. 2025. CoGrader: Transforming Instructors’ Assessment of Project
Reports through Collaborative LLM Integration. In _Proceedings of the 38th Annual_
_ACM Symposium on User Interface Software and Technology_ . 1–18.

[6] Zixin Chen, Jiachen Wang, Meng Xia, Kento Shigyo, Dingdong Liu, Rong Zhang,
and Huamin Qu. 2024. StuGPTViz: A visual analytics approach to understand
student-ChatGPT interactions. _IEEE Transactions on Visualization and Computer_
_Graphics_ 31, 1 (2024), 908–918.

[7] Zixin Chen, Yuhang Zeng, Sicheng Song, Yanna Lin, Xian Xu, Huamin Qu, and
Xia Meng. 2026. VizQStudio: Iterative Visualization Literacy MCQs Design with
Simulated Students. _arXiv preprint arXiv:2603.00994_ (2026).

[8] Michelene TH Chi and Ruth Wylie. 2014. The ICAP framework: Linking cognitive
engagement to active learning outcomes. _Educational psychologist_ 49, 4 (2014),
219–243.

[9] Louis Deslauriers, Logan S McCarty, Kelly Miller, Kristina Callaghan, and Greg
Kestin. 2019. Measuring actual learning versus feeling of learning in response to
being actively engaged in the classroom. _Proceedings of the National Academy of_
_Sciences_ 116, 39 (2019), 19251–19257.

[10] Alex Goslen, Yeo Jin Kim, Jonathan Rowe, and James Lester. 2025. Llm-based
student plan generation for adaptive scaffolding in game-based learning environments. _International journal of artificial intelligence in education_ 35, 2 (2025),
533–558.

[11] Zhanxin Hao, Jianxiao Jiang, Jifan Yu, Zhiyuan Liu, and Yu Zhang. 2025. Student
engagement in collaborative learning with AI agents in an LLM-empowered
learning environment: A cluster analysis. _arXiv preprint arXiv:2503.01694_ (2025).

[12] Sandra G Hart and Lowell E Staveland. 1988. Development of NASA-TLX (Task
Load Index): Results of empirical and theoretical research. In _Advances in psy-_
_chology_ . Vol. 52. Elsevier, 139–183.

[13] Mark Hodds, Lara Alcock, and Matthew Inglis. 2014. Self-explanation training
improves proof comprehension. _Journal for Research in Mathematics Education_
45, 1 (2014), 62–101.

[14] Yuanchun Li, Hao Wen, Weijun Wang, Xiangyu Li, Yizhen Yuan, Guohong Liu,
Jiacheng Liu, Wenxing Xu, Xiang Wang, Yi Sun, et al. 2024. Personal llm agents:
Insights and survey about the capability, efficiency and security. _arXiv preprint_
_arXiv:2401.05459_ (2024).

[15] Anna Lieb and Toshali Goel. 2024. Student interaction with newtbot: An llm-astutor chatbot for secondary physics education. In _Extended Abstracts of the CHI_
_Conference on Human Factors in Computing Systems_ . 1–8.

[16] Ming-Hung Lin, Huang-Cheng Chen, and Kuang-Sheng Liu. 2017. A study of the
effects of digital learning on learning motivation and learning outcome. _Eurasia_
_journal of mathematics, science and technology education_ 13, 7 (2017), 3553–3564.

[17] Zhengyuan Liu, Stella Xin Yin, Carolyn Lee, and Nancy F Chen. 2024. Scaffolding
language learning via multi-modal tutoring systems with pedagogical instructions. In _2024 IEEE conference on artificial intelligence (CAI)_ . IEEE, 1258–1265.

[18] Shuai Ma, Junling Wang, Yuanhao Zhang, Xiaojuan Ma, and April Yi Wang.
2025. Dbox: Scaffolding algorithmic programming learning through learner-llm


CHI EA ’26, April 13–17, 2026, Barcelona, Spain Trovato et al.



co-decomposition. In _Proceedings of the 2025 CHI Conference on Human Factors in_
_Computing Systems_ . 1–20.

[19] Rizwaan Malik, Dorna Abdi, Rose Wang, and Dorottya Demszky. 2025. Scaffolding
middle school mathematics curricula with large language models. _British Journal_
_of Educational Technology_ 56, 3 (2025), 999–1027.

[20] Alexander Tobias Neumann, Yue Yin, Sulayman Sowe, Stefan Decker, and
Matthias Jarke. 2024. An llm-driven chatbot in higher education for databases
and information systems. _IEEE Transactions on Education_ (2024).

[21] Anne-Mette Nortvig, Anne Kristine Petersen, and Søren Hattesen Balle. 2018. A
literature review of the factors influencing e-learning and blended learning in
relation to learning outcome, student satisfaction and engagement. _Electronic_
_Journal of E-learning_ 16, 1 (2018), pp46–55.

[22] Minju Park, Sojung Kim, Seunghyun Lee, Soonwoo Kwon, and Kyuseok Kim.
2024. Empowering personalized learning through a conversation-based tutoring
system with student modeling. In _Extended Abstracts of the CHI Conference on_
_Human Factors in Computing Systems_ . 1–10.

[23] Md Mostafizer Rahman and Yutaka Watanobe. 2023. ChatGPT for education
and research: Opportunities, threats, and strategies. _Applied sciences_ 13, 9 (2023),
5783.

[24] Alexander Scarlatos, Naiming Liu, Jaewook Lee, Richard Baraniuk, and Andrew
Lan. 2025. Training llm-based tutors to improve student learning outcomes
in dialogues. In _International Conference on Artificial Intelligence in Education_ .
Springer, 251–266.

[25] Tasmia Shahriar and Noboru Matsuda. 2024. “I Am Confused! How to Differentiate Between...?” Adaptive Follow-Up Questions Facilitate Tutor Learning with
Effective Time-On-Task. In _International Conference on Artificial Intelligence in_
_Education_ . Springer, 17–30.




[26] Zekai Shao, Siyu Yuan, Lin Gao, Yixuan He, Deqing Yang, and Siming Chen. 2025.
Unlocking Scientific Concepts: How Effective Are LLM-Generated Analogies for
Student Understanding and Classroom Practice?. In _Proceedings of the 2025 CHI_
_Conference on Human Factors in Computing Systems_ . 1–19.

[27] Sahil Sharma, Puneet Mittal, Mukesh Kumar, and Vivek Bhardwaj. 2025. The
role of large language models in personalized learning: a systematic review of
educational impact. _Discover Sustainability_ 6, 1 (2025), 1–24.

[28] Leixian Shen, Yifang Wang, Huamin Qu, Xing Xie, and Haotian Li. 2025.
Interaction-Augmented Instruction: Modeling the Synergy of Prompts and Interactions in Human-GenAI Collaboration. _arXiv preprint arXiv:2510.26069_ (2025).

[29] John Stamper, Ruiwei Xiao, and Xinying Hou. 2024. Enhancing llm-based feedback: Insights from intelligent tutoring systems and the learning sciences. In
_International Conference on Artificial Intelligence in Education_ . Springer, 32–43.

[30] Ratrapee Techawitthayachinda and Rafael Iriya. 2024. Automatic Assessment
of Active Learning in Online Discussions with Large Language Models. In _Inter-_
_national Conference on Artificial Intelligence in Education Technology_ . Springer,
34–42.

[31] Yuan Tian, Nan Xu, and Wenji Mao. 2024. A theory guided scaffolding instruction
framework for LLM-enabled metaphor reasoning. In _Proceedings_ _of_ _the_ _2024_
_Conference of the North American Chapter of the Association for Computational_
_Linguistics: Human Language Technologies (Volume 1: Long Papers)_ . 7731–7748.

[32] Janneke Van de Pol, Monique Volman, and Jos Beishuizen. 2010. Scaffolding in
teacher–student interaction: A decade of research. _Educational psychology review_
22, 3 (2010), 271–296.

[33] Xiaoming Xu, Zehua Shi, Nicolaas A Bos, and Hongbin Wu. 2023. Student engagement and learning outcomes: an empirical study applying a four-dimensional
framework. _Medical Education Online_ 28, 1 (2023), 2268347.


