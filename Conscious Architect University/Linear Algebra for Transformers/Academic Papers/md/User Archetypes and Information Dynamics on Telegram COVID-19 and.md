**User Archetypes and Information Dynamics on Telegram: COVID-19 and**

**Climate Change Discourse in Singapore**


VAL ALVERN CUECO LIGO, Nimblemind, USA

LAM YIN CHEUNG, Nimblemind, USA

ROY KA-WEI LEE, Singapore University of Technology and Design, Singapore

KOUSTUV SAHA, University of Illinois Urbana-Champaign, USA

EDSON C. TANDOC JR., Nanyang Technological University, Singapore

NAVIN KUMAR, Nimblemind, USA


Social media platforms, particularly Telegram, play a pivotal role in shaping public perceptions and opinions on global and national


issues. Unlike traditional news media, Telegram allows for the proliferation of user-generated content with minimal oversight, mak

ing it a significant venue for the spread of controversial and misinformative content. During the COVID-19 pandemic, Telegram’s


popularity surged in Singapore, a country with one of the highest rates of social media use globally. We leverage Singapore-based


Telegram data to analyze information flows within groups focused on COVID-19 and climate change. Using k-means clustering, we


identified distinct user archetypes, including Strategic Disruptor, Empirical Enthusiast, Inquisitive Moderate, and Critical Examiner,


each contributing uniquely to the discourse. We developed a model to classify users into these clusters (Precision: Climate change:


0.99; COVID-19: 0.95).


CCS Concepts: • **Impact of Computing** → **Culture** ; • **Recognizing and Defining Computational Problems** ;


Additional Key Words and Phrases: Telegram, Information flow, Singapore, Misinformation


**ACM Reference Format:**


Val Alvern Cueco Ligo, Lam Yin Cheung, Roy Ka-Wei Lee, Koustuv Saha, Edson C. Tandoc Jr., and Navin Kumar. 2018. User Archetypes


and Information Dynamics on Telegram: COVID-19 and Climate Change Discourse in Singapore. In . ACM, New York, NY, USA,


[9 pages. https://doi.org/XXXXXXX.XXXXXXX](https://doi.org/XXXXXXX.XXXXXXX)


**1** **INTRODUCTION**


Social media platforms play an increasingly central role in shaping public perceptions and opinions on global and


national issues [26]. Unlike traditional news media, which provides a curated flow of information, social media allows


for user-generated content to proliferate, often with minimal oversight [28]. This characteristic makes platforms like


Telegram particularly influential in forming public opinion on contentious topics [20]. Telegram is a free cloud-based


instant messaging platform [29]. Telegram offers several options for engagement, including private one-on-one con

versations, group chats, and both private and public channels controlled by administrators. Telegram does not partake


in extensive content-moderation policies compared to apps like Facebook, Instagram, and Twitter [32]. As a result,


Telegram tends to have significant controversial and misinformative content.


Permission to make digital or hard copies of all or part of this work for personal or classroom use is granted without fee provided that copies are not
made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for components
of this work owned by others than ACM must be honored. Abstracting with credit is permitted. To copy otherwise, or republish, to post on servers or
to redistribute to lists, requires prior specific permission and/or a fee. Request permissions from permissions@acm.org.


© 2018 Association for Computing Machinery.
Manuscript submitted to ACM


1


Conference acronym ’XX, June 03–05, 2018, Woodstock, NY Kumar et al.


During the COVID-19 pandemic, Telegram saw a significant rise in popularityin Singapore, becoming a major venue


for discussions about the pandemic and other pressing issues such as climate change [18]. Analyzing Singapore-based


social media data is of great importance as Singapore has one of the highest rates of social media use globally, making


it a rich data source for studying online information flows [27]. Moreover, the Singapore government plays a proactive


role in managing information dissemination, and thus better understanding of Telegram discussions in Singapore may


offer insights into effective misinformation management globally [1, 13]. As described, Telegram’s closed messaging


system and relatively lax moderation policies create a fertile ground for the spread of misinformation. This phenome

non was evident during the COVID-19 pandemic, where misinformation regarding the causes, remedies, and policies


related to the virus was rampant in Singapore-centric Telegram groups [18]. The spread of such misinformation has


significant implications, potentially undermining public health efforts and contributing to social discord [6, 17]. The


dynamics within these groups often reflect broader societal attitudes and behaviors, with some individuals actively


disseminating misinformation, while many others remain passive consumers, undecided about the accuracy of the


information they encounter. Understanding the flow of information within these closed systems is critical for develop

ing strategies to mitigate misinformation. Information pathways refer to the routes through which information travels


across different users and groups within a platform. Historically, disinformation campaigns, such as those concerning


AIDS in the 1980s and Ebola in 2014, have highlighted the importance of mapping these pathways to preempt and


counteract the spread of false information [14, 21]. These pathways often involve a few key individuals who set the


agenda, followed by others who propagate the information, whether accurately or not [16].


We seek to identify user archetypes within Telegram groups on COVID-19 and climate change, and examine how


these users contribute to the dissemination of information. By COVID-19, we refer to any discussion group which


relates to COVID-19. COVID-19 and climate change will be treated as independent topics throughout the paper. COVID

19 was selected as a topic given the rapid spread of COVID-19 misinformation in Singapore [8]. We selected climate


change as Singapore, a low-lying island, is directly influenced by the rising sea level caused by climate change [31]. By


analyzing user roles and information flow, we aim to uncover patterns that can inform effective strategies for combating


misinformation. We aim to provide a nuanced understanding of how digital interactions on closed messaging systems


shape perceptions around national issues in Singapore. We propose the following research question: What are the


archetypes of users in Singapore-based Telegram groups around COVID-19 and climate change? As an exploratory


analysis, we seek to develop a model to classify individuals into archetypes based on the preliminary clusters detailed


in the research question.


**2** **RELATED WORK**


**Information** **flow** **online** Understanding how information flows in online environments is essential for managing


misinformation effectively. Gomez Rodriguez et al. (2013) explored the dynamics of information pathways in online


media, highlighting how information spreads across networks [10]. They found that while information pathways for


recurring topics are stable, those for ongoing news events are more volatile, with clusters of media sites emerging


and vanishing rapidly. Similarly, Stewart et al. (2019) introduced the concept of information gerrymandering, where


network structures can distort collective decision-making [24]. Their analysis demonstrated that strategically placed


zealots within a network could bias outcomes, highlighting how the design of social networks can influence infor

mation flow and public opinion. Barriers to effective online collaboration were examined by Smithson et al. (2012),


who identified expectations of interaction, technological unfamiliarity, and differing academic norms as significant


hindrances [23]. They suggested focused forums and technical support to overcome these barriers, emphasizing the


2


User Archetypes and Information Dynamics on Telegram: COVID-19 and Climate Change Discourse in SingaporeConference acronym ’XX, June 03–05, 2018, Woodstock, NY


challenges of fostering productive online interactions. This is particularly relevant when considering the findings of


Singh et al. (2020), who analyzed COVID-19 discussions on Twitter and found a significant relationship between infor

mation flow and new COVID-19 cases [22]. They noted the presence of myths and poor-quality information, though


these were less dominant than other crisis-specific themes, underscoring the role of social media in pandemic informa

tion dissemination. The influence of fake news on political processes was highlighted by Bovet and Makse (2019), who


analyzed Twitter activity during the 2016 US presidential election [3]. They identified networks of influential spreaders


of fake news and traditional news, illustrating the dynamics of misinformation dissemination. Our study seeks to fill


the gap by analyzing how user archetypes are key to understanding information pathways within closed messaging


systems.


**Controversial information on Telegram** Telegram’s design prioritizes user security and minimal content mod

eration, making it appealing for communities banned from mainstream platforms, such as conspiracy content creators


and far-right movements[30]. This has led to the proliferation of controversial and often harmful content on the plat

form. Several studies have highlighted how deplatforming from mainstream social media can push users to alternative


platforms like Telegram, where they continue to propagate their ideologies. Bryanov et al. (2021) examined the mi

gration of right-wing users to Telegram following Donald Trump’s ban from major social media platforms, noting


a significant increase in user base and activity in right-wing communities [5]. Similarly, Zhong et al. (2024) focused


on the Proud Boys’ presence on Telegram, documenting their growth and interaction with other far-right groups,


which was catalyzed by deplatforming actions and significant events like the January 6th U.S. Capitol attack [32]. Tele

gram’s affordances also enable the proliferation of scams, fakes, and conspiracy movements [15]. Their large-scale


analysis revealed the presence of illegal activities and the spread of misinformation through fake and clone channels.


They highlighted the challenges of detecting and managing deceptive content on Telegram, even with automated


tools. Furthermore, Telegram facilitates the spread of hate speech and propaganda. Sulzhytski (2022) analyzed pro

government Telegram channels in Belarus, identifying the use of aggressive hate speech to demonize government


opponents [25]. The spread of misinformation and conspiracy theories is not limited to political contexts. Schlette et al.


(2023) studied Dutch anti-vaccination communities on Telegram, finding that messages often contained shared identity


elements and misinformation, with a significant portion promoting negative emotions [19]. This aligns with findings


from Farrell-Molloy (2022), who explored the eco-fascist subculture on Telegram, identifying dominant narratives that


blend environmentalism with far-right ideologies [9]. These studies collectively emphasize the complex ecosystem of


controversial information on Telegram. They show how deplatforming from mainstream social media can push users


to Telegram, where minimal moderation allows misinformation and extremist ideologies to thrive. Our study aims to


further understand these dynamics by analyzing user roles and information flow within Singapore-based Telegram


groups discussing COVID-19 and climate change.


**Telegram use in Singapore** Telegram has played a crucial role in information dissemination and public discourse in


Singapore, particularly during the COVID-19 pandemic. Several studies have explored this phenomenon, highlighting


the platform’s impact on public opinion, misinformation, and community engagement. Ng and Loke (2020) analyzed


a large Singapore-based COVID-19 Telegram group with over 10,000 participants [18]. They found that user participa

tion peaked following significant public health announcements, such as the Ministry of Health raising the disease alert


level. However, this heightened engagement was not sustained over time. The study also highlighted the prevalence


of criticism around government-identified misinformation, indicating a critical approach by the participants towards


the information presented on the platform. In a complementary study, Chen and Neo (2020) examined the content of


messages in several COVID-19-related Telegram groups using topic modeling [7]. They identified three main areas of


3


Conference acronym ’XX, June 03–05, 2018, Woodstock, NY Kumar et al.


concern among the public: buying and selling protective equipment, information about masks, and signs and symptoms


of the disease. Abidin (2020) conducted an ethnographic study on meme factories in Singapore and Malaysia [2]. This


study explored how these groups adapted their content and strategies in response to the pandemic. Meme factories,


which are coordinated networks of content creators, played a significant role in both spreading and countering misin

formation. They utilized various vernaculars to provide public service messaging and social critique, demonstrating the


diverse ways in which different actors on Telegram influence public opinion. These studies collectively illustrate the


multifaceted role of Telegram in Singapore during the COVID-19 pandemic. They show that Telegram serves not only


as a platform for information dissemination but also as a space for critical engagement, commerce, and socio-political


discourse. We seek to add to this work and develop user archetypes to better understand the information flow.


**3** **METHODS**


Dataset No. of Words
SG Covid-19 Recovery Support Group 540,412
LifeOfUnvaxxed Discussion 357,450
SG Corona Freedom Lounge 2,334,981
SG Defense against Vaxx 148,829
Healing the Divide Discussion 4,277,914
CovidSurvivors 577,351
SG The Other Side Of Climate Change 21,599,409

Table 1. Telegram Groups


**Data** **collection** **and** **preparation** We first selected three content experts who had published at least ten peer

reviewed articles in the last three years around COVID-19, and similarly chose another three experts on climate change.


We ensured the content experts conducted research on COVID-19/climate change in Singapore. Given the wide dis

ciplinary focus of COVID-19 and climate change research, we sought to select a range of experts across disciplines.


We recruited one expert from each of these disciplines: Public policy, medicine, computational social science. Select

ing experts from a range of fields allows results to be contextualized to fields where COVID-19 and climate change


research are concentrated, allowing for findings to be drawn on by stakeholders in a range of fields. Based on their


expertise, context experts separately developed lists of Telegram groups most relevant to COVID-19 or climate change


in Singapore. Groups were chosen based on the number of users in the group, how long the group had been active, and


group activity. Each expert developed a list of ten groups independently, and we selected only Telegram groups com

mon to the two groups of experts’ lists, within COVID-19 and climate change. The COVID-19 groups selected were:


CovidSurvivors, Healing the Divide Discussion, LifeOfUnvaxxed_Discussion, SG COVID-19 Recovery Support Group,


SG Defense against Vaxx, and SG Corona Freedom Lounge. There was a single climate change group: The Other Side


of Climate Change. Using tools within Telegram, we downloaded all chats in the groups since inception. Data from


the COVID-19 groups was merged into a single file. We analyzed the COVID-19 and climate change data separately


(See Table 1). The COVID-19 dataset had 201,438 rows (messages). The climate change dataset contained 2,394 rows.


**Data processing** Many users in the Telegram groups shared links, and we sought to add the text from these links


to our dataset (Newspaper3k). Some links were directed to news websites like Channel NewsAsia, The Straits Times,


ABC News, New York Post, Seattle Times, Today Online, and Yahoo Finance. The links also included government


websites, both Singapore-based and otherwise, and to other telegram groups such as SG Fighters, Village Hotel Sentosa,


4


User Archetypes and Information Dynamics on Telegram: COVID-19 and Climate Change Discourse in SingaporeConference acronym ’XX, June 03–05, 2018, Woodstock, NY


SGQuarantineOrder, SGVAXInjury, and sgFightScam. Some links could not be scraped due to permission restrictions,


and others did not contain any text [COVID-19: 28013/57369 (49%) links scraped; climate change: 945/1598 (59%)]. To


prepare the texts for model training, we tokenized, lemmatized, and normalized the corpus. See Table 2 for an overview


of the corpus.


Telegram topics Rows Tokens Normalized tokens Links present Successfully
scraped links



Users



COVID-19 201,438 450,667,326 21,599,409 57,369 28,013 5152
Climate Change 2,394 30,2853,025 13,462,608 1,598 945 70

Table 2. Data overview


**Feature engineering** We extracted two broad groups of features: 1) Behavioral (e.g., N of times links shared, N of


replies sent), and 2) text (e.g., ngrams, word embeddings). Table 3 denotes the behavioral features extracted.


Feature Description
Messages N of times a user sent a message in the chat
Words N of words used
Function words N of function words
Links N of links sent by user
Percent links % of posts by a user that were links

Table 3. Behavioural features


We extracted text features as per Table 4. We extracted 71 Linguistic Inquiry and Word Count (LIWC)-based linguis

tic categories (e.g. friend, gender). The LIWC software is a computerized way to analyze the word use within a text [4].


LIWC calculates the percentage of usage of sets of words that define 80 different linguistic categories, generating an


output measure for each of these categories.


Name Description
Topics Median topic based on LDA
Sentiment Median sentiment value
Hate speech Median hate speech value
Similarity to COVID Cosine similarity to ’covid’
Similarity to climate Cosine similarity to ’climate’
2-grams Most common 2-gram
3-grams Most common 3-gram
4-grams Most common 4-gram
LIWC features LIWC-based features

Table 4. Text features


**Developing** **archetypes** We used principal component analysis (PCA) to create two features (scikit-learn). We


then used K-means clustering (scikit-learn), with the PCA features, to separately cluster the COVID-19 and climate


change data by users. To choose the optimal number of clusters for each topic, we used the elbow method, based on


the within-cluster sum of squares (WCSS) value. We did not include clusters with fewer than 10 users. Two content


5


Conference acronym ’XX, June 03–05, 2018, Woodstock, NY Kumar et al.


experts reviewed the text produced by users in each cluster, along with the mean and standard deviation of the features.


Content experts proposed archetypes for each cluster independently. Experts then reviewed the archetypes and decided


on final archetypes for each cluster. Disagreements were resolved by a third expert.


**Classification** We performed a multi-label classification using a decision tree classifier with the cluster features


(scikit-learn). We sought to classify users in the COVID-19 and climate change groups into their respective clusters,


with an 80/20 train-test split. The labels for the models were the clusters extracted from the k-means clustering.


**4** **RESULTS**



Climate Change COVID-19
Feature Strategic Dis- Empirical En- Inquisitive Critical
ruptor thusiast Moderate iner



Feature Strategic Dis- Empirical En- Inquisitive Critical Exam- Conspiratorial
ruptor thusiast Moderate iner Amplifier

Percent links 35.5 10.3 0 22 49
Function words 4255 28668 28 109533 36555
Messages 17 61.5 4 423 204
Words 10081 72649 70 263299 90084
Links 4 6 0 1 1
Users 57 12 4941 32 175

Table 5. Median cluster features



Empirical Enthusiast



Inquisitive
Moderate



Critical Examiner



We provide median features for the clusters in Table 5. Clusters were significantly different. For example, within


the climate change clusters, there was a noted difference in median percent links shared, 35.5% vs 10.3%. Similarly,


across the climate change clusters, there was much variation in median number of messages (4 vs 423 vs 204). The


k-means clustering resulted in two clusters for climate change and three clusters for COVID-19. The climate change


data resulted in the following clusters: Strategic Disruptor; Empirical Enthusiast.


Strategic Disruptor: These users are characterized by active engagement with the intent to challenge mainstream


views, often sharing controversial or disruptive content. The texts from this cluster often questioned the integrity of


mainstream media and government narratives, suggesting that these entities served corporate interests rather than the


public. Common themes included criticism of "green energy" initiatives as profit-driven rather than environmentally


motivated and allegations of censorship by major tech companies. Examples: The world has woken up to the lies and


corruption of the elites; One of the first glaring lies about the climate agenda...


Empirical Enthusiast: Users in this cluster actively share data and empirical evidence to support their views on cli

mate change, often engaging in detailed discussions. This cluster’s texts reflected a blend of information dissemination


and opinion sharing. Examples: According to the WEF, why we need to give insects a chance in our diet; Chocolate

covered almonds and almond MnMs certainly aren’t healthier.


The COVID-19 data resulted in the following clusters: Inquisitive Moderate; Critical Examiner; Conspiratorial Am

plifier. Inquisitive Moderate: This cluster was characterized by moderately engaged users who seek clarifications and


share content without a strong bias. The median number of messages was four, perhaps indicating limited participation


in discussions. Users in this cluster may indicate interest more than actively contribute, occasionally sharing content


but not frequently engaging in in-depth discussions. Examples: Can someone explain what this means for us? I found


this article interesting, thought I’d share it here.


6


User Archetypes and Information Dynamics on Telegram: COVID-19 and Climate Change Discourse in SingaporeConference acronym ’XX, June 03–05, 2018, Woodstock, NY


Critical Examiner: These highly active users posted content that may be heavily data-driven and analytical. Users


in this cluster focused on demographic data, technological impacts, and societal trends. The discussions often included


statistical information, and were characterized by a logical and methodical approach to issues such as fertility rates,


elder care, and the impact of automation on jobs. Examples: Singapore’s total fertility rate has fallen from 1.82 births


per woman in 1990 to 1.14 births in 2020, indicating significant demographic shifts; Voice actors are losing their jobs


to AI robots that can mimic human speech with startling accuracy.


Conspiratorial Amplifier: Highly active, possibly amplifying conspiracy theories, and interrogating the integrity of


mainstream narratives. Examples: Big Pharma and their government cronies have no interest in our health, it’s all


about the money; How can we trust the government’s narrative when they have been caught lying time and again?


Both COVID-19 and climate change clusters demonstrated distinct user engagement patterns and thematic foci. A


notable comparison between the clusters for both topics is the presence and tone of criticism. In climate change discus

sions, Strategic Disruptors express criticism by questioning the integrity and motives of mainstream environmental


narratives, focusing on criticisms of green energy initiatives and media portrayals. Their distrust is directed towards


the perceived economic and political interests behind environmental policies. In contrast, suspicion in COVID-19 dis

cussions, as seen in the Conspiratorial Amplifiers cluster, is broader and more intense. These users challenge the


credibility of public health narratives, government policies, and media reports, often promoting alternative theories


and distrustful of official sources. This reflects more profound and wide-ranging criticism compared to the climate


change context.


Model Accuracy Recall Precision F1-Score
COVID-19 0.93 0.93 0.95 0.93
Climate 0.99 0.99 0.99 0.99

Table 6. Model metrics


We presented classification metrics for the exploratory classification model in Table 6. The model performed well


at classifying users into clusters we previously developed. The classification model enhances our ability to identify


and understand these archetypes, offering valuable insights for future efforts to combat misinformation and enhance


public discourse on pressing global issues.


**5** **DISCUSSION**


**Implications of Findings** The clustering analysis reveals a complex ecosystem of user archetypes within Telegram


groups discussing climate change and COVID-19. Understanding these archetypes is crucial for developing targeted


interventions to mitigate misinformation and enhance public discourse. Although this project focuses on clustering


and classification models, these insights could inform future empirical investigations aimed at designing specific inter

ventions [11, 12].


**Limitations** The data is sourced from specific Telegram groups, which may not represent the broader population’s


views or behaviors. The clustering method used may not capture the full complexity of user behaviors and motivations,


as it relies on text and behavioral features that may not encompass all relevant factors. Additionally, while the classi

fication model demonstrated high accuracy, recall, precision, and F1-scores, it is based on the initial clusters and may


require further validation with new data to ensure its robustness and generalizability. Finally, the focus on COVID-19


7


Conference acronym ’XX, June 03–05, 2018, Woodstock, NY Kumar et al.


and climate change discussions means that the findings may not be directly applicable to other topics or contexts,


necessitating further research to explore user archetypes in different thematic areas.


**REFERENCES**


[1] Ahmed Mohammad Abdou. 2021. Good governance and COVID-19: The digital bureaucracy to response the pandemic (Singapore as a model).
Journal of Public Affairs 21, 4 (2021), e2656.

[2] Crystal Abidin. 2020. Meme factory cultures and content pivoting in Singapore and Malaysia during COVID-19. Harvard Kennedy School Misinformation Review 1, 3 (2020), 031.

[3] Alexandre Bovet and Hernán A Makse. 2019. Influence of fake news in Twitter during the 2016 US presidential election. Nature communications
10, 1 (2019), 7.

[4] Ryan L Boyd, Ashwini Ashokkumar, Sarah Seraj, and James W Pennebaker. 2022. The development and psychometric properties of LIWC-22.
Austin, TX: University of Texas at Austin (2022), 1–47.

[5] Kirill Bryanov, Dina Vasina, Yulia Pankova, and Victor Pakholkov. 2021. The other side of Deplatforming: right-wing telegram in the wake of
trump’s Twitter Ouster. In International Conference on Digital Transformation and Global Society. Springer, 417–428.

[6] Keyu Chen, Marzieh Babaeianjelodar, Yiwen Shi, Rohan Aanegola, Lam Yin Cheung, Preslav Ivanov Nakov, Shweta Yadav, Angus Bancroft,
Ashiqur R KhudaBukhsh, Munmun De Choudhury, et al. 2022. US news and social media framing around vaping. In International Conference
on Computational Data and Social Networks. Springer, 188–199.

[7] Xingyu Ken Chen and Loo Seng Neo. 2020. What are the topics discussed by the Singaporean public on about COVID-19? An exploratory analysis
of telegram chats. An Exploratory Analysis of Telegram Chats (2020).

[8] Chew Han Ei and Chong Yen Kiat. 2023. Understanding the Nature of Misinformation on Publicly Accessible Messaging Platforms: The Case of
Ivermectin in Singapore. In Mobile Communication and Online Falsehoods in Asia: Trends, Impact and Practice. Springer, 149–172.

[9] Joshua Farrell-Molloy. 2022. From blood and soil to ecogram: A thematic analysis of eco-fascist subculture on Telegram. (2022).

[10] Manuel Gomez Rodriguez, Jure Leskovec, and Bernhard Schölkopf. 2013. Structure and dynamics of information pathways in online media. In
Proceedings of the sixth ACM international conference on Web search and data mining. 23–32.

[11] Abhay Goyal, Roger Ho Chun Man, Roy Ka-Wei Lee, Koustuv Saha, Frederick L. Altice, Christian Poellabauer, Orestis Papakyriakopoulos, Lam
Yin Cheung, Munmun De Choudhury, Kanica Allagh, et al. 2024. Using Voice Data to Facilitate Depression Risk Assessment in Primary Health
Care. In Companion Publication of the 16th ACM Web Science Conference. 17–18.

[12] Abhay Goyal, Nimay Parekh, Lam Yin Cheung, Koustuv Saha, Frederick L Altice, Robin O’hanlon, Roger Ho Chun Man, Chunki Fong, Christian
Poellabauer, Honoria Guarino, et al. 2023. Predicting Opioid Use Outcomes in Minoritized Communities. In Proceedings of the 14th ACM International
Conference on Bioinformatics, Computational Biology, and Health Informatics. 1–2.

[13] Tran Hien Van, Abhay Goyal, Muhammad Siddique, Lam Yin Cheung, Nimay Parekh, Jonathan Y Huang, Keri McCrickerd, Edson C Tandoc Jr,
Gerard Chung, and Navin Kumar. 2023. How is Fatherhood Framed Online in Singapore? arXiv e-prints (2023), arXiv–2307.

[14] Mark Kramer and D Savage. 2020. Lessons from Operation ‘Denver,’the KGB’s Massive AIDS Disinformation Campaign. Journal of Cold War
Studies 22, 1 (2020).

[15] Massimo La Morgia, Alessandro Mei, Alberto Maria Mongardini, and Jie Wu. 2021. Uncovering the dark side of Telegram: Fakes, clones, scams,
and conspiracy movements. arXiv preprint arXiv:2111.13530 (2021).

[16] Gilad Lotan, Erhardt Graeff, Mike Ananny, Devin Gaffney, Ian Pearce, et al. 2011. The Arab Spring| the revolutions were tweeted: Information
flows during the 2011 Tunisian and Egyptian revolutions. International journal of communication 5 (2011), 31.

[17] Yashna Nainani, Kaveh Khoshnood, Ashley Feng, Muhammad Siddique, Clara Broekaert, Allie Wong, Koustuv Saha, Roy Ka-Wei Lee, Zachary M
Schwitzky, Lam Yin Cheung, et al. 2022. Categorizing Memes about Abortion. In The International Conference on Weblogs and Social Media.

[18] Lynnette Hui Xian Ng and Jia Yuan Loke. 2020. Analyzing public opinion and misinformation in a COVID-19 telegram group chat. IEEE Internet
Computing 25, 2 (2020), 84–91.

[19] Anniek Schlette, Jan-Willem Van Prooijen, Arjan Blokland, and Fabienne Thijs. 2023. Information, identity, and action: The messages of the Dutch
anti-vaccination community on Telegram. New Media & Society (2023), 14614448231215735.

[20] Heidi Schulze, Julian Hohner, Simon Greipl, Maximilian Girgnhuber, Isabell Desta, and Diana Rieger. 2022. Far-right conspiracy groups on fringe
platforms: A longitudinal analysis of radicalization dynamics on Telegram. Convergence: The International Journal of Research into New Media
Technologies 28, 4 (2022), 1103–1126.

[21] Tara Kirk Sell, Divya Hosangadi, and Marc Trotochaud. 2020. Misinformation and the US Ebola communication crisis: analyzing the veracity and
content of social media messages related to a fear-inducing infectious disease outbreak. BMC Public Health 20 (2020), 1–10.

[22] Lisa Singh, Shweta Bansal, Leticia Bode, Ceren Budak, Guangqing Chi, Kornraphop Kawintiranon, Colton Padden, Rebecca Vanarsdall, Emily Vraga,
and Yanchen Wang. 2020. A first look at COVID-19 information and misinformation sharing on Twitter. arXiv preprint arXiv:2003.13907 (2020).

[23] Janet Smithson, Catherine Hennessy, and Robin Means. 2012. Online Interaction and" Real Information Flow": Contrasts Between Talking About
Interdisciplinarity and Achieving Interdisciplinary Collaboration. Journal of Research Practice 8, 1 (2012), P1–P1.


8


User Archetypes and Information Dynamics on Telegram: COVID-19 and Climate Change Discourse in SingaporeConference acronym ’XX, June 03–05, 2018, Woodstock, NY


[24] Alexander J Stewart, Mohsen Mosleh, Marina Diakonova, Antonio A Arechar, David G Rand, and Joshua B Plotkin. 2019. Information gerrymandering and undemocratic decisions. Nature 573, 7772 (2019), 117–121.

[25] Ilya Sulzhytski. 2022. Opposition as “A Mould on the Fatherland”: Hate Speech and Grassroots Telegram Propaganda in Belarus. Journal of
Belarusian Studies 12, 1-2 (2022), 5–34.

[26] Yunpeng Sun, Ruoya Jia, Asif Razzaq, and Qun Bao. 2024. Social network platforms and climate change in China: Evidence from TikTok. Technological Forecasting and Social Change 200 (2024), 123197.

[27] Edson C Tandoc Jr, Andrew ZH Yee, Jeremy Ong, James Chong Boi Lee, Duan Xu, Zheng Han, Chew Chee Han Matthew, Janelle Shaina Hui Yi Ng,
Cui Min Lim, Lydia Rui Jun Cheng, et al. 2021. Developing a perceived social media literacy scale: Evidence from Singapore. International Journal
of Communication 15 (2021), 22.

[28] Sijing Tu and Stefan Neumann. 2022. A viral marketing-based model for opinion dynamics in online social networks. In Proceedings of the ACM
Web Conference 2022. 1570–1578.

[29] Aleksandra Urman and Stefan Katz. 2022. What they do in the shadows: examining the far-rightnetworks on Telegram. Information, communication
& society 25, 7 (2022), 904–923.

[30] Darja Wischerath, Emily Godwin, Desislava Bocheva, Olivia Brown, Jonathan Francis Roscoe, and Brittany I Davidson. 2024. Spreading the Word:
Exploring a Network of Mobilizing Messages in a Telegram Conspiracy Group. In Extended Abstracts of the CHI Conference on Human Factors in
Computing Systems. 1–8.

[31] Xiaodong Yang, Lai Wei, and Qi Su. 2020. How is climate change knowledge distributed among the population in Singapore? A demographic
analysis of actual knowledge and illusory knowledge. Sustainability 12, 9 (2020), 3782.

[32] Wei Zhong, Catie Bailard, David Broniatowski, and Rebekah Tromble. 2024. Proud Boys on Telegram. Journal of Quantitative Description: Digital
Media 4 (2024), 1–47.


9


## This figure "sample-franklin.png" is available in "png"� format from: http://arxiv.org/ps/2406.06717v3


