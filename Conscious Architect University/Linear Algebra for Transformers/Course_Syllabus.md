# Linear Algebra for Transformers — Course Syllabus

## Course Declaration

**Title:** Linear Algebra for Transformers — A Sovereign Architect's Mathematical Foundation  
**Audience:** The Sovereign Architect — builders of AI coaching systems who need first-principles mathematical confidence to execute CCV, LoRA, activation steering, Transformer architecture decisions, and RL fine-tuning.  
**Duration:** ~70-80 hours across 14 lessons × 4 layers each  
**Methodology:** 4-Layer Deep Learning (Exposure → Mechanistic → Analogy → Master)  
**Research Integration:** 30+ curated papers from the MCDA Audit (Text Fine-Tuning + Clustering), 3 per chapter in progressive roles (Foundation → Mechanism → Breakthrough)

---

## Course Map

### Phase 1: Representation (L1 – L2)

| # | Lesson | Mathematical Core | Transformer Connection | CCP Connection | Papers |
|---|--------|------------------|----------------------|----------------|--------|
| 1 | [Vectors](./Lesson_01_Vectors/Chapter_Syllabus.md) | Representation as n-dimensional points | Embeddings, token identity | Voice DNA, CCV orthogonal axes | #11 CCV, #38 Steer2Edit, #1 LoRA Taxonomy |
| 1.5 | [Trigonometry](./Lesson_1.5_Trigonometry/Chapter_Syllabus.md) | Sine, cosine, cosine similarity | Positional encoding, similarity | RAG retrieval, attention rhythms | #47 Polar Sparsity, #48 Residual Duality, #40 Preplan-Anchor |
| 2 | [Dot Product](./Lesson_02_Dot_Product/Chapter_Syllabus.md) | Alignment × magnitude scoring | Attention QKᵀ, relevance | Head-level steering, entropy injection | #39 Attention Survey, #14 AUSteer, #12 EAST |

### Phase 2: Transformation (L3 – L5)

| # | Lesson | Mathematical Core | Transformer Connection | CCP Connection | Papers |
|---|--------|------------------|----------------------|----------------|--------|
| 3 | [Linear Combinations & Spans](./Lesson_03_Linear_Combinations_Spans/Chapter_Syllabus.md) | Weighted sums, span, independence | Attention output, LoRA rank | Dynamic steering, RISER router | #15 WAS, #16 HYPERSteer, #34 RISER |
| 4 | [Linear Transformations](./Lesson_04_Linear_Transformations/Chapter_Syllabus.md) | Structure-preserving vector maps | Layer operations, W_Q/W_K/W_V | ESR, pruning, selective steering | #19 ESR, #42 Fragile Knowledge, #35 Selective Steering |
| 5 | [Matrix Multiplication](./Lesson_05_Matrix_Multiplication/Chapter_Syllabus.md) | Matrices as encoded transformations | Weight matrices, LoRA decomposition | Dual-Stack mandate, SparseGrad | #31 LoRA Learns Less, #32 LoRA Illusion, #50 SparseGrad |

### Phase 3: Structure (L6 – L8)

| # | Lesson | Mathematical Core | Transformer Connection | CCP Connection | Papers |
|---|--------|------------------|----------------------|----------------|--------|
| 6 | [Orthogonal Projections](./Lesson_06_Orthogonal_Projections/Chapter_Syllabus.md) | Extracting directional components | Q/K/V projections, concept isolation | Hallucination detection, KV injection | #27 CASAL, #36 SV-RAG, #28 KV Cache Steering |
| 7 | [Change of Basis](./Lesson_07_Change_of_Basis/Chapter_Syllabus.md) | Same vector, different coordinates | Layer-specific representations | KV-Direct 27× compression | #52 Thinking Sparks, #53 RLKV, #51 KV-Direct |
| 8 | [Eigen-Everything](./Lesson_08_Eigen_Everything/Chapter_Syllabus.md) | Natural directions of transformations | Head importance, dominant features | Head ranking, DCoT, security | #46 HeadKV, #17 DCoT, #37 Rogue Scalpel |

### Phase 4: Intelligence (L9 – L10)

| # | Lesson | Mathematical Core | Transformer Connection | CCP Connection | Papers |
|---|--------|------------------|----------------------|----------------|--------|
| 9 | [Clustering Algorithms](./Lesson_09_Clustering/Chapter_Syllabus.md) | Distance metrics, K-Means, Silhouette | Hard attention, token grouping | CBCS archetype detection, Neo4j embedding | Clustering MCDA papers |
| 10 | [Applied Clustering on CCP Data](./Lesson_10_Applied_Clustering/Chapter_Syllabus.md) | Production pipelines, normalization, PCA, drift | LayerNorm ↔ Z-Score, attention ↔ PCA | CPSC Sales Pipeline, Mood-State Router, Voice DNA Isolation | Clustering MCDA papers |

### Phase 5: Learning (L11 – L12)

| # | Lesson | Mathematical Core | Transformer Connection | CCP Connection | Papers |
|---|--------|------------------|----------------------|----------------|--------|
| 11 | [Gradients & Sensitivity](./Lesson_11_Gradients_Sensitivity/Chapter_Syllabus.md) | Derivatives, partial derivatives, gradient vectors | Backpropagation, LoRA gradient dynamics | ALLoRA adaptive LR, Preplan-Anchor sensitivity, RISER gradient routing | #3 ALLoRA, #40 Preplan-Anchor, #34 RISER |
| 12 | [Optimization & Policy Learning](./Lesson_12_Optimization_Policy_Learning/Chapter_Syllabus.md) | Objective functions, GRPO, clipping, reward design | SFT → RLHF → GRPO training lifecycle | Perceptual Primitive training, RLKV head optimization, DPO for Voice DNA | #52 Thinking Sparks, #53 RLKV, #20 VLM Decision Agents |

### Phase 6: Deployment (L13)

| # | Lesson | Mathematical Core | Transformer Connection | CCP Connection | Papers |
|---|--------|------------------|----------------------|----------------|--------|
| 13 | [Probability, Sampling & Entropy](./Lesson_13_Probability_Sampling_Entropy/Chapter_Syllabus.md) | Distributions, softmax, entropy, KL divergence, sampling algorithms | Softmax in attention & output, temperature, top-p, inference pipeline | Pipecat parameter tuning, entropy-based CCV injection timing, KL monitoring | #40 Preplan-Anchor, #52 Thinking Sparks, #53 RLKV |

---

## Causal Chain

```
PHASE 1: REPRESENTATION
L1 Vectors ──→ L1.5 Trig ──→ L2 Dot Product
    │               │              │
    └─ what ARE      └─ how to      └─ how to
       vectors?        measure        COMPARE?
                       direction?

PHASE 2: TRANSFORMATION
──→ L3 LinComb ──→ L4 LinTrans ──→ L5 MatMul
        │               │              │
        └─ how to       └─ what's a    └─ how to
           COMBINE?        "rule" for     encode a
                           changing       rule as
                           vectors?       numbers?

PHASE 3: STRUCTURE
──→ L6 Projections ──→ L7 Basis ──→ L8 Eigen
        │                │            │
        └─ extracting    └─ different  └─ natural
           components       coordinate    directions
                           systems       of a system

PHASE 4: INTELLIGENCE
──→ L9 Clustering ──→ L10 Applied Clustering
        │                │
        └─ finding        └─ engineering
           groups            production
           in data           pipelines

PHASE 5: LEARNING
──→ L11 Gradients ──→ L12 Optimization
        │                │
        └─ how does       └─ how does the
           error flow        model LEARN
           backward?         from reward?
```

---

## Research Paper Coverage

### Original MCDA Text Fine-Tuning Papers (27 papers, score >80)

| Tier | Papers | Lessons |
|------|--------|---------|
| **P0 Core (93-98)** | RISER, AUSteer, HYPERSteer, EAST, CCV, Selective Steering, Preplan-Anchor | L1, L1.5, L2, L3, L4, L11 |
| **P1 Essential (88-92)** | ALLoRA, ASA, BottleHumor, Attention Survey, ESR, Thinking Sparks, KV-Direct, RLKV, LoRA Illusion, CASAL, KV Cache Steering, HeadKV | L2, L4, L5, L6, L7, L8, L11, L12 |
| **P2 Important (81-87)** | LoRA Taxonomy, Steer2Edit, Polar Sparsity, Residual Duality, WAS, Fragile Knowledge, LoRA Learns Less, SparseGrad, SV-RAG, DCoT, Rogue Scalpel, VLM Decision Agents | All lessons |

### Clustering MCDA Papers (L9 – L10)

| Tier | Papers | Lessons |
|------|--------|---------|
| **Top-6 (188-198)** | Telegram Archetypes, Portable Time Series, Mimetic ASPECT, Graph+LLM, CLUSPRO, Elder-Sim | L9, L10 |

### RL/Optimization Papers — Re-used from Prior Allocations + Gaps

| Paper | Original Allocation | Re-used In | Status |
|-------|-------------------|------------|--------|
| #3 ALLoRA (91) | — | **L11** (Foundation) | ✅ Available |
| #40 Preplan-Anchor (93) | L1.5 | **L11** (Mechanism) | ♻️ Re-used |
| #34 RISER (98) | L3 | **L11** (Breakthrough) | ♻️ Re-used |
| #52 Thinking Sparks (92) | L7 | **L12** (Foundation) | ♻️ Re-used |
| #53 RLKV (90) | L7 | **L12** (Mechanism) | ♻️ Re-used |
| #20 VLM Decision Agents (81) | — | **L12** (Breakthrough) | ✅ Available |
| GRPO Foundation Paper | — | — | ❌ **RESEARCH GAP** |
| Loss Landscape Geometry Paper | — | — | ❌ **RESEARCH GAP** |
| DPO Foundation Paper | — | — | ⚠️ **RESEARCH GAP** |

---

## Execution Protocol

For each lesson (depth-first):
1. Load `linear_algebra_syllabus_architect_skill.md` (educator context)
2. Load `Chapter_Syllabus.md` for that lesson (content directives)
3. Load the relevant prompt template (🔵, 🟡, 🟣, or 🚀)
4. Generate the full chapter following Prompt structure + Syllabus content
5. Verify word count, section completeness, paper integration, causal bridge
6. Save into the lesson folder
7. Move to next layer before next lesson (depth-first)

---

## Governance

- **Prompts are immutable.** The 4 prompt template files define HOW to write. Never modify them.
- **Syllabi define WHAT.** Each Chapter_Syllabus.md specifies the content. The prompt + syllabus together produce the chapter.
- **Papers are progressive.** Foundation → Mechanism → Breakthrough within each chapter. No paper is primary in more than one chapter (re-use in L11-L12 is permitted as these papers are now explored through a fundamentally different mathematical lens).
- **Anti-Draft.** Governed by `launch_manual_governance_skill.md` for vocabulary, tone, and quality constraints.
