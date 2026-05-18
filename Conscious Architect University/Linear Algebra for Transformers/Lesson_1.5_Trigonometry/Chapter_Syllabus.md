# Lesson 1.5: Trigonometry — Chapter Syllabus

## Lesson Declaration

**Mathematical Goal:** The student can use sine and cosine to describe direction, compute cosine similarity between two vectors, and understand why these wave functions are the Transformer's clock — encoding position, measuring alignment, and generating the rhythmic patterns that let models perceive sequence.

**Transformer Goal:** The student understands two critical mechanisms: (1) cosine similarity strips away magnitude and measures pure directional alignment between embeddings, and (2) sinusoidal positional encoding gives each token a unique frequency fingerprint so the model knows WHERE in the sequence it sits — because attention itself is position-blind.

**CCP Goal:** The student understands why the Preplan-and-Anchor rhythm in attention heads follows a wave-like pattern (Paper #40), why attention head sparsity behaves differently at different sequence positions (Polar Sparsity, Paper #47), and why the residual stream can be understood as a dual of the sequence axis — operating along depth the same way attention operates along position (Paper #48).

**Prerequisites:** Lesson 1 (Vectors) — must understand vectors as positions in space and know what "direction" and "magnitude" mean.

**Estimated Time:** 4-5 hours across all 4 layers.

---

## The Core Narrative

Here is a question that should bother you: Transformers process all tokens in parallel. Unlike RNNs, there is no "first word, then second word, then third word." Everything arrives at once. So how does the model know that "the cat sat" is different from "sat the cat"?

The answer is sine and cosine.

The original Transformer paper injects a unique mathematical fingerprint into each token based on its position. That fingerprint is built from sine and cosine waves at different frequencies — low frequencies for coarse position (beginning vs end), high frequencies for fine position (word 47 vs word 48). It works because these wave patterns have a magical property: the RELATIVE distance between any two positions can be computed from their sine/cosine values alone. Position 5 "knows" that position 3 is two steps behind because the wave offsets encode that gap.

But there is a deeper reason you need trigonometry: cosine similarity. When you compare two vectors to ask "are these similar?", you need a measure that ignores how LOUD the signal is and only cares about which DIRECTION it points. That is exactly what cosine does. It strips away magnitude and returns a number from -1 (opposite) to +1 (identical). This is the engine behind every RAG retrieval, every embedding search, every similarity score in the CCP.

And when we look at what happens inside trained attention heads — the Preplan-and-Anchor rhythm discovered in Paper #40 — we see wave-like patterns in how the model allocates attention across layers. The model doesn't just attend uniformly. It generates a rhythmic pulse: a "preplan" token reaches far back for context, immediately followed by an "anchor" token that crystallizes the local decision. This rhythm IS a wave pattern. Understanding sine and cosine gives you the mathematical language to SEE what the model is doing when it reasons.

---

## CCP Research Paper Integration (3 Papers)

| # | Paper | Score | Role | Integration |
|---|-------|-------|------|-------------|
| 1 | **#47 Polar Sparsity — High Throughput Batched LLM Inferencing** | 85 | 🟢 Foundation | Polar Sparsity reveals that attention head activity follows periodic sparsity patterns — some heads activate densely at certain sequence positions and go sparse at others. This is wave-like behavior across the sequence axis. The student needs sine/cosine intuition to understand why sparsity is STABLE across batches (the structural periodicity of attention patterns). **Show:** How a head's activation across 2048 tokens resembles a damped sine wave — dense at critical reasoning positions, sparse at filler positions. |
| 2 | **#48 Residual Stream Duality** | 82 | 🟡 Mechanism | The residual stream paper proves that depth (layers) and sequence (tokens) are mathematical duals. Self-attention mixes along the sequence axis; the residual stream accumulates along the depth axis. Causal depth-wise attention IS the same operator as causal token-wise attention — just along a different axis. This duality is fundamentally about the same operation applied to orthogonal dimensions, which is the geometric core of sine/cosine: projecting onto perpendicular axes. **Show:** How the dual-axis framework mirrors sin(θ) = horizontal projection, cos(θ) = vertical projection — two orthogonal views of the same circle. |
| 3 | **#40 Preplan-and-Anchor Rhythm** | 93 | 🔴 Breakthrough | Preplan-and-Anchor reveals that reasoning models generate attention patterns with a RHYTHMIC structure. The model produces a "preplan" token (long-range contextual attention spike) followed by an "anchor" token (local semantic crystallization). This alternation creates a wave pattern in Windowed Average Attention Distance. The paper proposes three RL strategies that align credit assignment to this rhythm. The student now sees: attention dynamics ARE wave dynamics, and CCV steering must be injected at the correct phase of this rhythm to activate perceptual primitives. **Show:** The WAAD metric as a plotted wave, and WHY injecting a CCV steering vector at the preplan phase (broad context) vs the anchor phase (local focus) produces fundamentally different effects on the model's reasoning. |

---

## 🔵 Exposure Layer — Content Directives

**Intuition Hook:** Forget triangles. Think about a clock hand. As it sweeps around, its shadow on the wall moves left-right (cosine) and its shadow on the floor moves forward-back (sine). That's it. Cosine = how much are you pointing THIS way. Sine = how much are you pointing the PERPENDICULAR way. Two numbers completely describe any direction.

**Progressive Formalization Path:**
1. Unit circle: radius 1, angle θ sweeps from 0 to 360°
2. Any point on the circle = (cos(θ), sin(θ))
3. cos(θ) = alignment with horizontal. sin(θ) = alignment with vertical
4. Introduce cosine similarity: cos(θ) = (A · B) / (|A||B|) — the ONLY formula they need
5. Show: this removes magnitude, keeps only direction

**Worked Examples:**
1. **Perfect alignment:** A = (10, 0), B = (1, 0). Different magnitudes, same direction. Cosine = 1. "A whisper and a shout saying the same thing."
2. **Perpendicular:** A = (1, 0), B = (0, 1). Completely independent. Cosine = 0. "Speed and strength don't interfere with each other."
3. **Opposite:** A = (1, 0), B = (-1, 0). Cosine = -1. "Love and hate point in opposite directions in the same axis."

**Misconceptions to Address:**
1. ❌ "I need to memorize trig identities." → ✅ No. You need geometric intuition. sin²+cos²=1 means the point stays on the circle. That's ALL you need.
2. ❌ "Cosine similarity and dot product are the same thing." → ✅ Dot product mixes direction AND magnitude. Cosine REMOVES magnitude. A 100-dimensional vector and a 1-dimensional vector in the same direction have cosine = 1 but very different dot products.
3. ❌ "Sine and cosine only matter for positional encoding." → ✅ They appear everywhere: cosine similarity in RAG retrieval, cosine learning rate schedulers, periodic feature patterns, rotary position embeddings (RoPE).
4. ❌ "Angles don't exist in high dimensions." → ✅ Angles ALWAYS exist between two vectors, in any number of dimensions. Cosine measures that angle regardless of dimension count.

**Controlled Analogies:**
- ⚽ Running direction: cosine = how much forward, sine = how much sideways drift
- 🎵 Two instruments: cosine measures how much they play in the SAME frequency band vs different bands

**Compression Truth:** "Cosine measures alignment. Sine measures perpendicularity. Together they decompose any direction in the universe into two orthogonal components — and this decomposition is how Transformers encode position and measure meaning."

---

## 🟡 Mechanistic Layer — Content Directives

**Formal Definition:** 
- cos(θ) = adjacent/hypotenuse in a right triangle; equivalently, x-coordinate on the unit circle at angle θ
- sin(θ) = opposite/hypotenuse; equivalently, y-coordinate on the unit circle
- Cosine similarity: sim(A,B) = (A · B) / (||A|| · ||B||) ∈ [-1, 1]
- Positional encoding: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

**Derivation Path:** Why does positional encoding use DIFFERENT frequencies? Because a single frequency can only encode coarse position. Multiple frequencies at different scales create a unique "chord" for each position — like each position has its own fingerprint made of overlapping waves. The 10000 base creates exponentially spaced frequencies from very slow (captures global position) to very fast (captures local position).

**Transformer Mapping:**
- **Cosine similarity in RAG:** When the CCP retrieves Context Premises from Neo4j, it computes cosine similarity between the query embedding and stored premise embeddings. The highest cosine scores = the most relevant premises.
- **Attention and dot product:** Attention scores use raw dot product (QKᵀ), which is cosine × magnitudes. The scaling factor (1/√d_k) partially normalizes this, but attention is NOT pure cosine — magnitude matters.
- **Positional Encoding:** Without it, "the cat sat on the mat" and "mat the on sat cat the" produce identical attention patterns. Sine/cosine encoding makes each position UNIQUE.
- **CCP Paper 1 (Polar Sparsity):** Show head activation as periodic sparsity — dense at critical positions, sparse at filler — resembling damped waves across the sequence.
- **CCP Paper 2 (Residual Duality):** Show the sequence axis and depth axis as orthogonal dimensions — exactly like sine (vertical) and cosine (horizontal) projecting the same circular motion onto perpendicular walls.
- **CCP Paper 3 (Preplan-Anchor):** Plot the WAAD metric showing the rhythmic preplan (long-range spike) followed by anchor (local crystallization). Explain WHY CCV steering injected at the preplan phase activates broad perceptual scans, while injection at anchor phase locks specific perceptual primitives.

**Invariants:**
1. **Pythagorean identity:** sin²(θ) + cos²(θ) = 1 — the point always stays on the circle. Directional decomposition is COMPLETE — nothing is lost.
2. **Cosine similarity bounds:** Always in [-1, 1]. This makes it a stable, normalized comparison metric.
3. **Scale invariance:** cos_sim(αA, βB) = cos_sim(A, B). Scaling either vector doesn't change similarity.

---

## 🟣 Analogy Layer — Content Directives

### ⚽ Sports (FIFA / Inter Milan)
- **Vector =** player's movement direction on the pitch
- **Cosine =** how aligned two players' runs are. Barella and Çalhanoğlu running in perfect sync = cosine ≈ 1. One running forward while the other drifts wide = cosine ≈ 0. Two attackers running into each other = cosine < 0.
- **Sine =** the perpendicular component of a player's run. How much they drift OFF the main axis of play.
- **Break:** Players occupy physical 2D space. Embeddings occupy 768D space. The geometry is identical but unvisualizable.

### 🎮 Gaming (RPG)
- **Cosine =** build compatibility. Two characters with similar stat allocation = high cosine. A mage build and a warrior build = low cosine. A pure DPS build and a pure tank build = potentially negative cosine (optimized for opposing purposes).
- **Sine =** the "wasted stats" — investment in directions that don't help the party's current goal.
- **Break:** Game stats are integers with caps. Embedding dimensions are continuous with no cap.

### 🎵 Music
- **Cosine =** harmonic compatibility. Two instruments playing in the same key = high cosine. One playing C major, one playing F# = low cosine. Two perfectly out-of-phase waves = cosine = -1 (destructive interference).
- **Sine =** the perpendicular frequency content. What one instrument contributes that the other can't.
- **Position encoding analogy:** Sheet music IS positional encoding — bar numbers tell you WHEN each note plays. Without bar numbers, the score is just a bag of notes.
- **Break:** Sound has phase (timing within a cycle). Cosine similarity ignores phase.

### 🧑‍🍳 Cooking
- **Cosine =** flavor compatibility. Soy sauce and miso = high cosine (both umami). Lemon and chocolate = low cosine. Sugar and vinegar = potentially negative (counteract each other in perception).
- **Sine =** the orthogonal flavor contribution — what one ingredient adds that the other completely lacks.
- **Break:** Flavor perception is logarithmic and context-dependent. Mathematical cosine is linear.

### 🧠 Psychology
- **Cosine =** personality alignment. Two highly extraverted individuals = high cosine on that dimension. An introvert and an extravert = cosine ≈ -1 on that axis. Two people who differ on ALL Big Five dimensions = near-zero overall cosine (no alignment anywhere).
- **Break:** Psychology acknowledges non-linear interactions between traits. Cosine treats all dimensions equally.

### 🤖 AI Content Engine
- **Cosine =** semantic similarity between content embeddings. "How to overcome fear" and "Building courage" have high cosine similarity. "How to overcome fear" and "Best pasta recipes" have cosine ≈ 0. This is literally how the CCP's Context Premise engine retrieves relevant coaching history.
- **Position encoding =** the session number in a coaching engagement. Session 1 has different positional encoding than session 12 — the model knows WHERE in the journey the client is.
- **Break:** Cosine similarity between embeddings doesn't capture nuance. "The bank by the river" and "investment bank" might have moderate cosine despite completely different meanings (re: polysemy — addressed by contextual embeddings in Lesson 4).

---

## 🚀 Master Layer — Content Directives

**Integration Narrative:** Open with the clock hand metaphor — cosine/sine as orthogonal projections of circular motion. Formalize into the unit circle. Connect to cosine similarity ("how aligned are these two vectors?"). Then hit the first big reveal: Transformers don't know position, and sine/cosine waves at multiple frequencies are the solution. Then the second big reveal: inside trained attention heads, reasoning itself has a wave-like rhythm (Preplan-Anchor), and understanding this rhythm is the key to knowing WHERE to inject CCV steering vectors for maximum perceptual primitive activation.

**Paper Weaving (Section 9):**
- Start with Polar Sparsity (#47): "Attention heads don't fire uniformly — they exhibit periodic sparsity patterns across the sequence, dense at critical tokens and sparse at filler tokens."
- Progress to Residual Duality (#48): "The sequence axis and the depth axis are mathematical duals — the same operator (causal attention) written over two orthogonal dimensions. This mirrors sine/cosine: two projections of the same underlying structure."
- Culminate with Preplan-Anchor (#40): "Trained reasoning models develop a RHYTHMIC attention pattern. The preplan-and-anchor mechanism IS a wave. CCV steering must be synchronized to this rhythm — inject at the preplan phase for broad perceptual activation, inject at the anchor phase for precise primitive locking."

**Unlock Moment:** "Cosine similarity is the Transformer's compass — it tells the model which direction each concept points. Positional encoding is the Transformer's clock — it tells the model WHEN each concept appears. And inside the trained model, reasoning itself pulses like a wave, with anchor points the model learns through reinforcement. The math of waves IS the math of thought."

---

## Misconception Danger Zones

| # | What They'll Believe | Why It Feels Right | The Correction |
|---|---------------------|-------------------|----------------|
| 1 | "Cosine similarity is just another name for dot product" | They look similar in formulas | Dot product = direction × magnitude. Cosine = ONLY direction. A huge vector and a tiny vector pointing the same way have identical cosine (1) but vastly different dot products. Attention uses dot product ON PURPOSE — it wants magnitude to matter. |
| 2 | "Position encoding is learned" | GPT and modern models learn positions | ORIGINAL Transformers use sinusoidal (fixed). Modern ones use RoPE (rotary) or learned embeddings. All approaches encode the SAME idea: "where am I in the sequence." Sinusoids are the mathematically elegant version. |
| 3 | "Sin and cos are OLD math that AI reinvented" | Trig feels like high school, AI feels modern | Trig is not reinvented — it is the natural mathematical language for periodic patterns, orthogonal decomposition, and rotation. AI uses it because the PROBLEMS require it, not because of nostalgia. |

---

## Causal Bridge

**This lesson enables:** Lesson 2 (Dot Product) depends entirely on understanding that cosine measures alignment and that the dot product encodes BOTH alignment AND magnitude. Without cosine intuition, the dot product formula (A·B = |A||B|cos(θ)) is meaningless symbols.

**Without this lesson:** The student cannot understand WHY attention scores work, WHY positional encoding uses sine/cosine, or WHY cosine similarity is the standard for RAG retrieval. The entire attention mechanism remains a black box.
