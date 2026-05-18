# Lesson 1: Vectors — Sovereign Architect Lecture Notes

## 1. The Geometry of Meaning (Latent Space)
Vectors are not just lists of numbers; they are **coordinates on an $n$-dimensional map** of human thought. 

*   **The GPS Analogy:** If $\mathbb{R}^2$ is a flat map of a city, $\mathbb{R}^{768}$ is a high-resolution map of all human concepts. To find the "meaning" of a word, you don't read its letters; you look up its 768-digit "GPS Address."
*   **Regions:** "Sentiment," "Tone," and "Logic" are not labels—they are actual **physical regions** in this space. During training, the model "drew the map" by grouping similar concepts into neighborhoods.

## 2. Tokens vs. Words (The Coordinate Anchor)
*   The 768D vector is attached to a **Token ID**, not a word. 
*   Complex words are chopped into multiple tokens, meaning they use multiple vectors to "spell out" their meaning in the coordinate space.
*   **Fixed vs. Contextual:** The initial "lookup" vector is a static dictionary entry. The Transformer’s job is to move that vector around the map based on the words surrounding it.

## 3. Attention = Geometric Alignment
The Attention Mechanism is the "Awareness Engine." It works via the **Dot Product** (Geometric Alignment):
*   **Query (Q):** A vector direction asking, "Who around here is related to X?"
*   **Key (K):** A vector direction saying, "I contain X."
*   **Awareness:** If a Query points in the same direction as a Key, they "align." The model then performs **Vector Addition**, pulling the information from the Key word into the Query word. This is how "Bank" becomes aware it is near "River."

## 4. Prompt Engineering as "Vector Invocation"
Prompting is the art of **Semantic Pressure**.
*   **Spellcasting:** Using precise, "radical" language is like launching a "Vector Invocation." Intense words have higher **Magnitudes** (longer vectors), which steer the model more powerfully than weak words.
*   **Summation:** Repeating concepts or tackling them from multiple angles "stacks" vectors in the same direction, creating a "gravity well" that the model cannot easily escape.
*   **The Landscape:** Few-shot prompting doesn't just "teach" the model; it **shifts the entire horizon** of the map so that the correct response is the most "downhill" (likely) path.

## 5. The "Cramped Map" Problem (Aliasing)
*   **Depth (Layers) vs. Width (Dimensions):** 
    *   **Layers** = Thinking Harder (Taking more hiking steps to find a path).
    *   **Dimensions** = Seeing Clearer (Having a higher-resolution map).
*   **Steer2Edit Law:** Increasing dimensionality from 512 to 1024 allows for **Surgical Editing**. In low dimensions, concepts "overlap" (Aliasing). In high dimensions, every concept has its own "private coordinate," allowing you to change a persona's `Tone` without accidentally ruining its `Logic`.

## 6. The RLHF "Black Hole" (The Death of Irony)
*   **Centroid Collapse:** RLHF (Reinforcement Learning from Human Feedback) creates a gravitational pull toward the **Origin (The Centroid)**—the most average, polite, and "neutral" region of the map.
*   **The Comedy Barrier:** True irony and humor exist at the "sharp edges" of the map. RLHF "sands down" these edges, which is why models often fail at being truly funny—they are mathematically "leashed" to the safe center.
*   **Architecture Choice:** This is why Sovereign Architects prefer **Open-Source Fine-Tuning** (Weight-Space Encoding) over closed-source prompting. You cannot "steer" against a gravitational pull forever; eventually, you have to move the center of the world.
