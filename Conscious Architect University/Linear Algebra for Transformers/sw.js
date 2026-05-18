const CACHE_NAME = "linear-algebra-offline-v1";
const PRECACHE_URLS = [
  "%F0%9F%94%B5%20PROMPT%201%20%E2%80%94%20EXPOSURE%20LAYER.md",
  "%F0%9F%9A%80%20PROMPT%204%20-%20MASTER%20PROMPT.md",
  "%F0%9F%9F%A1%20PROMPT%202%20%E2%80%94%20MECHANISTIC%20_%20TRANSFORMER%20LAYER.md",
  "%F0%9F%9F%A3%20PROMPT%203%20%E2%80%94%20ANALOGY%20_%20MULTI-DOMAIN%20LAYER.md",
  "%F0%9F%A7%A0%20Linear%20Algebra%20for%20Conscious%20Coaching%20Platform.md",
  "Academic%20Papers/A%20Little%20Rank%20Goes%20a%20Long%20Way%20Random%20Scaffolds%20with%20LoRA.md",
  "Academic%20Papers/Adam%27s%20Law%20Textual%20Frequency%20Law%20on%20Large%20Language%20Models.md",
  "Academic%20Papers/Bootstrapping%20Language%20Models%20with%20DPO%20Implicit%20Rewards.md",
  "Academic%20Papers/Building%20Effective%20AI%20Coding%20Agents%20for%20the%20Terminal%20Scaffolding%2C%20Harness%2C%20Context%20Engineering%2C%20and%20Lessons%20Learned.md",
  "Academic%20Papers/Critical%20Inker%20Scaffolding%20Critical%20Thinking%20in%20AI-Assisted.md",
  "Academic%20Papers/Curvature-Aligned%20Probing%20for%20Local%20Loss-Landscape%20Stabilization.md",
  "Academic%20Papers/DPO%20Meets%20PPO%20Reinforced%20Token%20Optimization%20for%20RLHF.md",
  "Academic%20Papers/DSPy_%20The%20End%20of%20Prompt%20Engineering%20-%20Kevin%20Madura%2C%20AlixPartners.md",
  "Academic%20Papers/Decision-Oriented%20Programming%20with%20Aporia.md",
  "Academic%20Papers/DeepSeekMath%20Pushing%20the%20Limits%20of%20Mathematical.md",
  "Academic%20Papers/Enhancing%20LLM%20Problem%20Solving%20via%20Tutor%E2%80%93Student%20Multi-Agent.md",
  "Academic%20Papers/From%20Passive%20Consumption%20to%20Active%20Interaction%20Exploring.md",
  "Academic%20Papers/Inside%20the%20Scaffold%20A%20Source-Code%20Taxonomy%20of%20Coding%20Agent%20Architectures.md",
  "Academic%20Papers/It%20Takes%20Two%20Your%20GRPO%20Is%20Secretly%20DPO.md",
  "Academic%20Papers/Landscape%20of%20Thoughts%20Visualizing%20the%20Reasoning%20Process%20of%20Large%20Language%20Models.md",
  "Academic%20Papers/MY%20QUESTIONS%20TO%20CHATGPT%20ABOUT%20RLVR%2C%20RLM%20and%20DSPy.md",
  "Academic%20Papers/Neural%20network%20optimization%20strategies%20and%20the%20topography%20of%20the%20loss%20landscape.md",
  "Academic%20Papers/OpenProse%20%E2%80%94%20A%20Programming%20Language%20for%20the%20Intelligent%20VM.md",
  "Academic%20Papers/RLMs%20Are%20The%20New%20Reasoning%20Models%20%E2%80%94%20Raymond%20A.%20Weitekamp%20(RAW.works).md",
  "Academic%20Papers/RM-R1%20Reward%20Modeling%20as%20Reasoning.md",
  "Academic%20Papers/Recursive%20Language%20Models%20Meet%20Uncertainty%20The%20Surprising%20Effectiveness%20of%20Self-Reflective%20Program%20Search%20for%20Long%20Context.md",
  "Academic%20Papers/Recursive%20Language%20Models.md",
  "Academic%20Papers/Recursive%20Models%20for%20Long-Horizon%20Reasoning.md",
  "Academic%20Papers/Reward%20Hacking%20in%20the%20Era%20of%20Large%20Models%20Mechanisms%2C%20Emergent%20Misalignment%2C%20Challenges.md",
  "Academic%20Papers/Scaf-GRPO%20Scaffolded%20Group%20Relative%20Policy%20Optimization%20for%20Enhancing%20LLM%20Reasoning.md",
  "Academic%20Papers/Scaffolding%20Human-AI%20Collaboration%20A%20Field%20Experiment%20on%20Behavioral%20Protocols%20and%20Cognitive%20Reframing.md",
  "Academic%20Papers/State%20of%20LLMs%202026_%20RLVR%2C%20GRPO%2C%20Inference%20Scaling%20%E2%80%94%20Sebastian%20Raschka.md",
  "Academic%20Papers/Step-DPO%20Step-wise%20Preference%20Optimization%20for%20Long-chain%20Reasoning%20of%20LLMs.md",
  "Academic%20Papers/Story2Proposal%20A%20Scaffold%20for%20Structured%20Scientific%20Paper%20Writing.md",
  "Academic%20Papers/TeachingCoach%20A%20Fine-Tuned%20Scaffolding%20Chatbot%20for%20Instructional%20Guidance%20to%20Instructors.md",
  "Academic%20Papers/What%20is%20the%20Alignment%20Objective%20of%20GRPO.md",
  "Academic%20Papers/abstracts.txt",
  "Academic%20Papers/abstracts_utf8.txt",
  "Academic%20Papers/md/Ask%2C%20Answer%2C%20and%20Detect%20Role-Playing%20LLMs%20for%20Personality.md",
  "Academic%20Papers/md/CAN%20WE%20GENERATE%20PORTABLE%20REPRESENTATIONS%20FOR.md",
  "Academic%20Papers/md/Characterizing%20user%20archetypes%20and%20discussions%20on%20Scored.co.md",
  "Academic%20Papers/md/Effective%20Clustering%20for%20Large%20Multi-Relational%20Graphs.md",
  "Academic%20Papers/md/Elder-Sim%20A%20Psychometrically%20Validated%20PlatformforPersonality-Stable%20Elderly%20Digital%20Twins.md",
  "Academic%20Papers/md/Identifying%20General%20Mechanism%20Shifts%20in%20Linear.md",
  "Academic%20Papers/md/Integrating%20Graphs%2C%20Large%20Language%20Models%2C%20and.md",
  "Academic%20Papers/md/Interpretable%20Clustering%20A%20Survey.md",
  "Academic%20Papers/md/Learning%20Clustering-based%20Prototypes%20for%20Compositional%20Zero-shot%20Learning.md",
  "Academic%20Papers/md/Measuring%20Human%20Behavior%20Through%20Controlled%20Perturbations%20A%20Framework.md",
  "Academic%20Papers/md/Mimetic%20Alignment%20with%20ASPECT%20Evaluation%20of%20AI-inferred.md",
  "Academic%20Papers/md/Semantic%20distance%20organizes%20social%20knowledge%20Insights%20from%20semantic%20dementia.md",
  "Academic%20Papers/md/Talk2AI%20A%20Longitudinal%20Dataset%20of%20Human%E2%80%93AI%20Persuasive.md",
  "Academic%20Papers/md/User%20Archetypes%20and%20Information%20Dynamics%20on%20Telegram%20COVID-19%20and.md",
  "Course_Syllabus.md",
  "Lesson_01_Vectors/1_Exposure.html",
  "Lesson_01_Vectors/1_Exposure.md",
  "Lesson_01_Vectors/2_Mechanistic.html",
  "Lesson_01_Vectors/2_Mechanistic.md",
  "Lesson_01_Vectors/2_Mechanistic_Notes.md",
  "Lesson_01_Vectors/3_Analogy.html",
  "Lesson_01_Vectors/3_Analogy.md",
  "Lesson_01_Vectors/4_Master.html",
  "Lesson_01_Vectors/4_Master.md",
  "Lesson_01_Vectors/Chapter_Syllabus.md",
  "Lesson_02_Dot_Product/1_Exposure.html",
  "Lesson_02_Dot_Product/1_Exposure.md",
  "Lesson_02_Dot_Product/2_Mechanistic.html",
  "Lesson_02_Dot_Product/2_Mechanistic.md",
  "Lesson_02_Dot_Product/3_Analogy.html",
  "Lesson_02_Dot_Product/3_Analogy.md",
  "Lesson_02_Dot_Product/4_Master.html",
  "Lesson_02_Dot_Product/4_Master.md",
  "Lesson_02_Dot_Product/Chapter_Syllabus.md",
  "Lesson_03_Linear_Combinations_Spans/1_Exposure.html",
  "Lesson_03_Linear_Combinations_Spans/1_Exposure.md",
  "Lesson_03_Linear_Combinations_Spans/2_Mechanistic.html",
  "Lesson_03_Linear_Combinations_Spans/2_Mechanistic.md",
  "Lesson_03_Linear_Combinations_Spans/3_Analogy.html",
  "Lesson_03_Linear_Combinations_Spans/3_Analogy.md",
  "Lesson_03_Linear_Combinations_Spans/4_Master.html",
  "Lesson_03_Linear_Combinations_Spans/4_Master.md",
  "Lesson_03_Linear_Combinations_Spans/Chapter_Syllabus.md",
  "Lesson_04_Linear_Transformations/1_Exposure.html",
  "Lesson_04_Linear_Transformations/1_Exposure.md",
  "Lesson_04_Linear_Transformations/2_Mechanistic.html",
  "Lesson_04_Linear_Transformations/2_Mechanistic.md",
  "Lesson_04_Linear_Transformations/3_Analogy.html",
  "Lesson_04_Linear_Transformations/3_Analogy.md",
  "Lesson_04_Linear_Transformations/4_Master.html",
  "Lesson_04_Linear_Transformations/4_Master.md",
  "Lesson_04_Linear_Transformations/Chapter_Syllabus.md",
  "Lesson_05_Matrix_Multiplication/1_Exposure.html",
  "Lesson_05_Matrix_Multiplication/1_Exposure.md",
  "Lesson_05_Matrix_Multiplication/2_Mechanistic.html",
  "Lesson_05_Matrix_Multiplication/2_Mechanistic.md",
  "Lesson_05_Matrix_Multiplication/3_Analogy.html",
  "Lesson_05_Matrix_Multiplication/3_Analogy.md",
  "Lesson_05_Matrix_Multiplication/4_Master.html",
  "Lesson_05_Matrix_Multiplication/4_Master.md",
  "Lesson_05_Matrix_Multiplication/Chapter_Syllabus.md",
  "Lesson_06_Orthogonal_Projections/1_Exposure.html",
  "Lesson_06_Orthogonal_Projections/1_Exposure.md",
  "Lesson_06_Orthogonal_Projections/2_Mechanistic.html",
  "Lesson_06_Orthogonal_Projections/2_Mechanistic.md",
  "Lesson_06_Orthogonal_Projections/3_Analogy.html",
  "Lesson_06_Orthogonal_Projections/3_Analogy.md",
  "Lesson_06_Orthogonal_Projections/4_Master.html",
  "Lesson_06_Orthogonal_Projections/4_Master.md",
  "Lesson_06_Orthogonal_Projections/Chapter_Syllabus.md",
  "Lesson_07_Change_of_Basis/1_Exposure.html",
  "Lesson_07_Change_of_Basis/1_Exposure.md",
  "Lesson_07_Change_of_Basis/2_Mechanistic.html",
  "Lesson_07_Change_of_Basis/2_Mechanistic.md",
  "Lesson_07_Change_of_Basis/3_Analogy.html",
  "Lesson_07_Change_of_Basis/3_Analogy.md",
  "Lesson_07_Change_of_Basis/4_Master.html",
  "Lesson_07_Change_of_Basis/4_Master.md",
  "Lesson_07_Change_of_Basis/Chapter_Syllabus.md",
  "Lesson_08_Eigen_Everything/1_Exposure.html",
  "Lesson_08_Eigen_Everything/1_Exposure.md",
  "Lesson_08_Eigen_Everything/2_Mechanistic.html",
  "Lesson_08_Eigen_Everything/2_Mechanistic.md",
  "Lesson_08_Eigen_Everything/3_Analogy.html",
  "Lesson_08_Eigen_Everything/3_Analogy.md",
  "Lesson_08_Eigen_Everything/4_Master.html",
  "Lesson_08_Eigen_Everything/4_Master.md",
  "Lesson_08_Eigen_Everything/Chapter_Syllabus.md",
  "Lesson_09_Clustering/1_Exposure.html",
  "Lesson_09_Clustering/1_Exposure.md",
  "Lesson_09_Clustering/2_Mechanistic.html",
  "Lesson_09_Clustering/2_Mechanistic.md",
  "Lesson_09_Clustering/3_Analogy.html",
  "Lesson_09_Clustering/3_Analogy.md",
  "Lesson_09_Clustering/4_Master.html",
  "Lesson_09_Clustering/4_Master.md",
  "Lesson_09_Clustering/Chapter_Syllabus.md",
  "Lesson_1.5_Trigonometry/1_Exposure.html",
  "Lesson_1.5_Trigonometry/1_Exposure.md",
  "Lesson_1.5_Trigonometry/2_Mechanistic.html",
  "Lesson_1.5_Trigonometry/2_Mechanistic.md",
  "Lesson_1.5_Trigonometry/3_Analogy.html",
  "Lesson_1.5_Trigonometry/3_Analogy.md",
  "Lesson_1.5_Trigonometry/4_Master.html",
  "Lesson_1.5_Trigonometry/4_Master.md",
  "Lesson_1.5_Trigonometry/Chapter_Syllabus.md",
  "Lesson_10_Applied_Clustering/1_Exposure.html",
  "Lesson_10_Applied_Clustering/1_Exposure.md",
  "Lesson_10_Applied_Clustering/2_Mechanistic.html",
  "Lesson_10_Applied_Clustering/2_Mechanistic.md",
  "Lesson_10_Applied_Clustering/3_Analogy.html",
  "Lesson_10_Applied_Clustering/3_Analogy.md",
  "Lesson_10_Applied_Clustering/4_Master.html",
  "Lesson_10_Applied_Clustering/4_Master.md",
  "Lesson_10_Applied_Clustering/Chapter_Syllabus.md",
  "Lesson_11_Gradients_Sensitivity/1_Exposure.html",
  "Lesson_11_Gradients_Sensitivity/1_Exposure.md",
  "Lesson_11_Gradients_Sensitivity/2_Mechanistic.html",
  "Lesson_11_Gradients_Sensitivity/2_Mechanistic.md",
  "Lesson_11_Gradients_Sensitivity/3_Analogy.html",
  "Lesson_11_Gradients_Sensitivity/3_Analogy.md",
  "Lesson_11_Gradients_Sensitivity/4_Master.html",
  "Lesson_11_Gradients_Sensitivity/4_Master.md",
  "Lesson_11_Gradients_Sensitivity/Chapter_Syllabus.md",
  "Lesson_12_Optimization_Policy_Learning/1_Exposure.html",
  "Lesson_12_Optimization_Policy_Learning/1_Exposure.md",
  "Lesson_12_Optimization_Policy_Learning/2_Mechanistic.html",
  "Lesson_12_Optimization_Policy_Learning/2_Mechanistic.md",
  "Lesson_12_Optimization_Policy_Learning/3_Analogy.html",
  "Lesson_12_Optimization_Policy_Learning/3_Analogy.md",
  "Lesson_12_Optimization_Policy_Learning/4_Master.html",
  "Lesson_12_Optimization_Policy_Learning/4_Master.md",
  "Lesson_12_Optimization_Policy_Learning/Chapter_Syllabus.md",
  "Lesson_13_Probability_Sampling_Entropy/1_Exposure.html",
  "Lesson_13_Probability_Sampling_Entropy/1_Exposure.md",
  "Lesson_13_Probability_Sampling_Entropy/2_Mechanistic.html",
  "Lesson_13_Probability_Sampling_Entropy/2_Mechanistic.md",
  "Lesson_13_Probability_Sampling_Entropy/3_Analogy.html",
  "Lesson_13_Probability_Sampling_Entropy/3_Analogy.md",
  "Lesson_13_Probability_Sampling_Entropy/4_Master.html",
  "Lesson_13_Probability_Sampling_Entropy/4_Master.md",
  "Lesson_13_Probability_Sampling_Entropy/Chapter_Syllabus.md",
  "OFFLINE_PWA_README.md",
  "Omar%20Khattab%20on%20the%20State%20of%20DSPy.md",
  "RL%20for%20Agents%20Workshop%20-%20Deep%20Dive%20on%20Training%20Agents%20with%20RL%20and%20Open%20Source.md",
  "Recursive%20Language%20Models%20w_%20Alex%20Zhang.md",
  "Reinforcement%20Learning%20and%20calculus%20in%20our%20Program.md",
  "SKILL.md",
  "app.js",
  "course_index.json",
  "icon.svg",
  "index.html",
  "learning_framework.html",
  "manifest.webmanifest",
  "styles.css",
  "sw.js",
  "vectors_learning.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }

          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});
