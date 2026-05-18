# Lesson 7: Change of Basis — Analogy / Multi-Domain Layer

## 1. Core Concept Recap

A basis is a set of independent measurement axes that define how you describe positions in a space. The same object — the same vector — has different coordinate representations in different bases. Changing basis = translating between measurement systems via a matrix multiplication. The object doesn't move; only its numerical description changes. The best basis is the one that makes your specific problem easiest to solve. Transformers learn their own bases at every layer, and the residual stream is the universal basis from which all layer-specific representations can be deterministically recovered.

## 2. The 6-Domain Analogy System

### 🎮 Gaming System (RPG / Strategy)

**The Map:**
In any RPG, a character exists independently of how you measure them. But the stat system you use to DESCRIBE that character determines how easy it is to make decisions. A mage is described differently in stat systems that prioritize physical stats vs. magical stats — but the mage's ACTUAL effectiveness in combat is a fixed geometric quantity, independent of how you record the numbers.

**The Operation in Action:**
A level 50 Battlemage in two stat systems:

**Physical Basis:** STR=5, DEX=7, CON=4, END=6
**Magical Basis:** SpellPower=9, ManaPool=8, CastSpeed=7, CooldownReduction=6

The same character, described in completely different numbers. The Physical Basis makes it HARDER to evaluate this character as a mage — the relevant information (spell effectiveness) is HIDDEN behind physical dimensions that don't directly measure magical capability. The Magical Basis makes it trivial: SpellPower=9 directly answers "how strong are their spells?"

**The Three Cases:**
* **Good Basis Choice:** When optimizing this character's DPS (damage per second) as a mage, the Magical Basis directly exposes the relevant axes. SpellPower and CastSpeed are the dominant factors. Optimization is straightforward: "increase SpellPower, increase CastSpeed."
* **Bad Basis Choice:** In the Physical Basis, optimizing mage DPS requires figuring out how STR, DEX, CON, and END MAP to spell damage — a complex, indirect relationship. The "conversion formula" between bases (the change-of-basis matrix) is hidden in the game's internal calculations.
* **Universal Basis (Residual Stream Analogy):** The game's internal engine stores the character as a unified data object with ALL attributes. The Physical Basis and Magical Basis are both VIEWS — projections of the same internal representation. The internal object IS the residual stream.

**The Math Tie-Back:** The game engine's internal character representation IS the universal basis (like the residual stream). Every stat screen is a change-of-basis operation (a projection matrix) that converts the universal representation into a human-readable view optimized for a specific use case.

### ⚽ Sports System (Positioning / Team Dynamics)

**The Map:**
A footballer's "true quality" is a fixed vector in some abstract ability space. Different scouting systems represent this vector using different axes. A transfer decision made using the wrong basis can be catastrophically wrong.

**The Operation in Action:**
Player X is described in three scouting bases:

| Metric System (Basis) | Stat 1 | Stat 2 | Stat 3 | Stat 4 |
|---|---|---|---|---|
| **Physical** | Speed: 9 | Strength: 4 | Acceleration: 8 | Stamina: 7 |
| **Technical** | Ball Control: 6 | Passing: 5 | Crossing: 3 | Dribbling: 8 |
| **Tactical** | Pressing: 8 | Positioning: 9 | Interceptions: 7 | Decision-making: 6 |

Same player, three completely different profiles. In the Physical Basis, this player looks like a speedster. In the Technical Basis, they look mediocre. In the Tactical Basis, they look like a defensive midfielder.

The scouting question: "Should we sign this player for our pressing system?"

**Answer from Physical Basis:** "Fast and stamina-rich. Yes." But this misses: "Can they press INTELLIGENTLY?" Speed without pressing intelligence is chaos.

**Answer from Tactical Basis:** "Pressing=8, Positioning=9. Yes — they'll press with discipline." This basis DIRECTLY answers the question.

**The Three Cases:**
* **Right Basis, Right Decision:** Using the Tactical Basis for a pressing-system decision. The relevant axes are directly exposed.
* **Wrong Basis, Wrong Decision:** The Technical Basis would reject this player (weak passing, crossing). But the question was about pressing, not passing.
* **Basis Completeness:** No single basis captures EVERYTHING. The Physical Basis misses intelligence. The Tactical Basis misses injury risk (a physical attribute). A complete evaluation requires data from multiple bases — or access to the universal basis that contains all attributes.

**The Math Tie-Back:** Different scouting databases are different bases for the same "player quality" space. The change-of-basis matrix converts between them. The "universal basis" would be a complete data model containing every measurable attribute — the equivalent of the residual stream. Each scouting report is a projection (basis change) from this universal model into a specific viewing angle.

### 🎵 Music System (Composition / Mixing)

**The Map:**
Audio signal processing is built ENTIRELY on basis changes. The Fourier Transform — the single most important algorithm in signal processing — IS a change-of-basis matrix.

**The Operation in Action:**
A 3-second audio clip exists simultaneously in two representations:

**Time Basis:** Amplitude at each moment in time. A sequence of 132,300 numbers (at 44.1kHz sampling). Good for: editing waveforms, cutting, pasting, crossfading.

**Frequency Basis:** Energy at each frequency. A sequence of spectral coefficients showing how much energy is at 20Hz, 50Hz, 100Hz, ..., 20kHz. Good for: EQ, compression, spectral analysis, noise removal.

Same audio. Different numbers. The TIME BASIS shows you WHEN things happen. The FREQUENCY BASIS shows you WHAT frequencies are present.

$\text{FFT}(\text{time signal}) = \text{frequency signal}$

The Fast Fourier Transform IS the change-of-basis matrix. Its inverse (IFFT) converts back. The conversion is lossless — perfectly invertible.

**The Three Cases:**
* **Frequency Basis for EQ:** "Boost 3kHz by 2dB" is a trivial operation in the frequency basis — multiply the 3kHz coefficient by 1.26. In the time basis, this same operation requires convolving the entire signal with a filter kernel — massively more complex.
* **Time Basis for Editing:** "Cut the audio at 1.5 seconds" is trivial in the time basis — just truncate the array. In the frequency basis, this requires modifying EVERY frequency coefficient according to a complex phase relationship — nearly impossible without converting back.
* **KV-Direct Analogy:** The time domain IS the residual stream — the universal representation from which any frequency-domain analysis can be derived. You COULD store the spectrum, the spectrogram, and the cepstrum separately (like storing K, V per layer). Or you could store just the time-domain signal and re-derive any spectral view on demand — lossless, deterministic, and dramatically more storage-efficient.

**The Math Tie-Back:** The Fourier Transform is a change-of-basis matrix from time basis to frequency basis. Its columns are sinusoidal functions (sines and cosines at different frequencies). It is the most famous, most practically important basis change in all of science and engineering. Every audio effect, every noise cancellation, every music compression algorithm (MP3, AAC) uses it.

### 🤖 AI / Content Engine System (CCP Direct)

**The Map:**
The CCP's interpretability challenge IS a basis change problem. The model's internal representations are in a model-learned basis that humans cannot directly read. CCV steering, interpretability probing, and embedding analysis are all attempts to find — or exploit — the change-of-basis matrix between the model's basis and a human-readable basis.

**The Operation in Action:**
Qwen-3.5's hidden state at layer 12 for the coaching prompt "Your client is stuck" is:

**Model Basis (unreadable):** $\mathbf{h}_{12} = [0.31, -0.72, 0.18, 0.44, -0.55, \dots, 0.09]$ (2560 dimensions)

A human cannot extract meaning from these numbers. But if we had the change-of-basis matrix $P_{\text{model} \to \text{human}}$:

**Human Basis (readable):** $P \cdot \mathbf{h}_{12} = [\text{Frustration: 0.8}, \text{Stagnation: 0.9}, \text{Therapy-readiness: 0.3}, \dots]$

Finding this matrix $P$ IS the interpretability problem. In practice, we approximate it through:
- **Probing:** Train a linear layer $P$ to predict human labels from hidden states
- **CCV direction discovery:** Find single vectors that correspond to coaching concepts (conviction, empathy, provocation) and stack them as rows of a partial change-of-basis matrix
- **Activation patching:** Identify which dimensions activate for specific inputs, reverse-engineering individual axes of the model's basis

**The Three Cases:**
* **Successful Basis Discovery (CCV Steering):** Researchers find that $\mathbf{v}_\text{conviction} = [0.1, -0.3, 0.7, \dots]$ in the model's basis increases conviction in generated text when added to the residual stream. This vector IS a basis axis discovery — one column of the human-interpretable basis expressed in model coordinates.
* **KV-Direct Implementation:** Instead of storing K/V for all 24 layers during Pipecat Roleplay, the CCP stores only $\mathbf{h}_{l-1}$ (the residual stream). When layer $l$'s attention needs $K_{l,t}$, it computes $W_K^l \cdot \mathbf{h}_{l-1,t}$ — a real-time basis change from universal to layer-specific. Memory savings: 27×+. Quality loss: zero.
* **Thinking Sparks as Basis Expansion:** After GRPO training, 3-5 new attention heads specialize. Each new head defines a NEW direction in the model's attention space — a basis vector that didn't exist before. The model's "attention basis" has expanded to include coaching-specific axes. The pre-trained model didn't have a "conviction detection" direction; GRPO created it.

### 🍳 Cooking System

**The Map:**
The same dish can be described in ingredient space (500g chicken, 100g butter, 50g garlic) or flavor space (umami=8, fat=7, pungent=6). These are two bases for the same "dish vector." Some culinary questions are easier in ingredient space; others are easier in flavor space.

**The Operation in Action:**
A ramen broth described in two bases:

**Ingredient Basis:** [pork bones: 2kg, miso: 100g, soy sauce: 50ml, garlic: 30g, ginger: 20g, tare: 80ml]

**Flavor Basis:** [umami: 9, salt: 7, fat: 8, pungent: 5, sweet: 2, acid: 1]

**The Three Cases:**
* **Scaling (Ingredient Basis):** "Make double the broth." In ingredient space, double every number. In flavor space, this operation is meaningless — doubling "umami=9" to "umami=18" doesn't describe a real dish.
* **Flavor Adjustment (Flavor Basis):** "The broth is too salty." In flavor space, reduce salt from 7 to 5 — directly actionable. In ingredient space, the same adjustment requires knowing which ingredients contribute salt (soy sauce, miso, tare) and by how much (the conversion matrix from flavor to ingredient).
* **Invertibility Failure:** Unlike mathematical basis changes, the ingredient→flavor mapping is NOT perfectly invertible. Different ingredient combinations can produce the same flavor profile — the mapping is many-to-one. The "change-of-basis matrix" from ingredients to flavors has a non-trivial null space (Lesson 6 concept).

**The Math Tie-Back:** Ingredient space and flavor space are two bases for describing food. The "conversion matrix" (how each ingredient contributes to each flavor dimension) IS a change-of-basis matrix — but an imperfect, non-linear one. Mathematical basis changes are linear and invertible. Culinary basis changes are non-linear and lossy.

### 🧠 Personality / Psychology System

**The Map:**
The same person described by different personality frameworks:

| Framework (Basis) | Dimensions | Type |
|---|---|---|
| **Big Five (OCEAN)** | Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism | 5 continuous axes |
| **MBTI** | E/I, S/N, T/F, J/P | 4 binary axes |
| **Enneagram** | Types 1-9 | 1 categorical axis |
| **DISC** | Dominance, Influence, Steadiness, Compliance | 4 continuous axes |

All four frameworks describe the SAME underlying psychological reality — the person's actual behavioral tendencies. Each framework is a different basis for "personality space."

**The Three Cases:**
* **Resolution Mismatch:** Big Five (5 continuous dimensions) has higher resolution than MBTI (4 binary dimensions). Converting from Big Five to MBTI LOSES information — it's a dimension-reducing projection, not a full basis change. The conversion is lossy.
* **Axis Alignment:** The Big Five axis "Extraversion" roughly corresponds to MBTI's "E/I" dichotomy. But it's not exact — Big Five Extraversion captures a continuous spectrum with subdimensions (gregariousness, assertiveness, activity level) that MBTI's binary E/I collapses into a single bit.
* **The Universal Basis:** The person's actual neural connectivity, hormonal profile, and developmental history IS the "universal basis" — the complete, high-resolution representation from which ALL personality frameworks are derived via projection (basis change with dimension reduction).

**The Math Tie-Back:** Personality frameworks are approximate, lossy basis changes applied to an unobservable universal representation. Mathematical basis changes are exact and lossless (for same-dimensional spaces). The gap between these is the gap between engineering and science — science works with the exact; engineering works with the approximate.

## 3. Scenario-Based Thinking

1. **The Translation Problem:** A French football scout sends you a player report using their proprietary 6-dimensional rating system. Your club uses a different 6-dimensional system. You need a "translation matrix" to convert their ratings to yours. How would you construct this matrix? How many players would you need to evaluate in BOTH systems to determine the conversion? (Hint: you need exactly 6 players evaluated in both bases to determine a unique 6×6 matrix.)

2. **The Compression Puzzle:** A music streaming service stores songs in frequency-domain representation (spectral coefficients). When you hit "play," it must convert to time-domain (audio samples). This is an IFFT — an inverse basis change. But suppose you only need to play a 10-second preview from the middle of a 3-minute song. In which basis is it easier to extract the preview? Why?

3. **The Interpretability Challenge:** You discover that adding vector $\mathbf{v} = [0.2, -0.4, 0.1, ...]$ to a Transformer's hidden state at layer 8 consistently makes the output more "formal." You have found ONE axis of a human-interpretable basis. How many such vectors do you need to find to construct a COMPLETE change-of-basis matrix from the model's 2560-dimensional basis to a human-readable basis? Is finding all 2,560 practical?

## 4. Cross-Domain Comparison

The basis change concept operates with full mathematical fidelity only when:
- The mapping between bases is LINEAR (each new axis is a fixed linear combination of old axes)
- The mapping is INVERTIBLE (no information is lost)
- The dimensions are INDEPENDENT (no coupling between axes)

| Domain | Linear? | Invertible? | Independent? | Fidelity |
|---|---|---|---|---|
| **Mathematics** | ✅ Yes | ✅ Yes | ✅ Yes | Perfect |
| **Audio (Fourier)** | ✅ Yes | ✅ Yes | ✅ Yes | Perfect |
| **Transformer Attention** | ✅ Yes | ❌ Projective | ✅ Yes (ideally) | High |
| **KV-Direct** | ✅ Yes | ✅ Yes | ✅ Yes | Perfect |
| **Football Scouting** | ~Linear | ~Invertible | ❌ Correlated | Moderate |
| **Cooking** | ❌ Non-linear | ❌ Many-to-one | ❌ Coupled | Low |
| **Psychology** | ❌ Approximate | ❌ Lossy | ❌ Overlapping | Low |

The key insight: the Fourier Transform and KV-Direct share PERFECT basis-change fidelity with pure mathematics because they operate on the exact same mathematical structure. Football scouting and cooking are ANALOGIES that break at the linearity and invertibility boundaries.

## 5. Logic Puzzles

1. **The Redundant Scout:** Your scouting department rates players on 8 dimensions. But after analysis, you discover that Dimension 5 = 0.5 × Dimension 1 + 0.3 × Dimension 3. Dimension 5 is NOT independent — it can be computed from Dimensions 1 and 3. How many INDEPENDENT dimensions does your scouting system actually have? Is it a valid basis for 8-dimensional player space?

2. **The Fourier Paradox:** A 1-second audio clip at 44.1kHz has 44,100 samples in time basis. The FFT produces 44,100 frequency coefficients. Same number of values. Same information. So why bother converting? (Hint: the VALUE of a basis is not in how many numbers it has, but in how SPARSE the representation becomes for typical signals.)

3. **The KV-Direct Savings:** A model has 24 layers, 32 heads per layer, head dimension 128, model dimension 2560. Session has 500 tokens. Calculate: (a) Total KV cache in standard approach. (b) Total storage with KV-Direct. (c) Number of re-derivation matrix multiplications needed when layer 12 processes a query attending to all 500 tokens.

## 6. Build-Your-Own Analogy Task

1. **Identify Two Bases** for a system you know well (e.g., time/frequency for audio, ingredient/flavor for food, physical/tactical for sports).
2. **Choose a Task** that is EASY in one basis and HARD in the other.
3. **Describe the Change-of-Basis Operation** — what does the "conversion matrix" represent in your domain?
4. **Assess Fidelity** — is the conversion linear? Invertible? Or does it lose information?
5. **Identify the "Universal Basis"** — is there a representation from which BOTH of your bases can be derived?

## 7. Common Analogy Failures

* **"Changing the measurement changes the thing."** Switching from Celsius to Fahrenheit doesn't change the temperature. Switching from Physical to Tactical rating systems doesn't change the player. Basis change is PURELY representational. **Fix:** Always distinguish between the object (the vector) and its description (the coordinates).

* **"Every conversion between representations is a basis change."** Non-linear conversions (ingredient→flavor), lossy conversions (Big Five→MBTI), and categorical conversions (continuous→discrete) are NOT proper basis changes. They are approximations, projections, or qualitatively different operations. **Fix:** Reserve "basis change" for linear, invertible, dimension-preserving operations.

* **"The standard basis is 'real' and alternatives are 'artificial.'"** The standard basis $\{[1,0], [0,1]\}$ has no mathematical privilege. It's convenient for human computation, but the model's learned basis is equally valid. The eigenvector basis (Lesson 8) may be more "natural" than either. **Fix:** Evaluate bases by their utility for specific tasks, not by their familiarity.

## 8. Compression Layer

Across all domains, a single principle operates: **the same object can be described using different measurement systems, and the choice of measurement system determines how easy or hard your problem is.** In audio, the Fourier basis makes EQ trivial. In Transformers, each layer's learned basis makes that layer's computation efficient. In scouting, the tactical basis makes pressing-system decisions direct. The mathematical operation that converts between systems — the change-of-basis matrix — is a matrix multiplication, and the conversion is lossless when the matrix is invertible.

The deepest application is KV-Direct: the residual stream is the universal basis, and every layer's K/V representation is a deterministic, lossless basis change from this universal format. Storing the universal instead of the derived saves 27× memory with zero quality loss. The mathematics of basis change transformed this from an abstract concept into a 27× infrastructure advantage for the CCP's sovereign Roleplay sessions.
