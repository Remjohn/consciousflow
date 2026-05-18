# Unit 1.2: First Principles — The 4 Primitives

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** You do not need to master all 198 micro-services to understand the CCP. Complexity is an emergent property of simple primitives, and chasing the branches of the tree before understanding the root is a recipe for engineering paralysis.

In this unit, we apply **First Principles Thinking**. We strip the CCP of its modular complexity until we reach the irreducible "atoms" of the system. In the CCP universe, there are exactly four primitives: **Voice (TTT)**, **State (CBCS)**, **Identity (Context Premise)**, and **Delivery (CMF)**. Everything else—from the Morgan Orchestrator to the Video Editor—is simply a composition of these four.

Think of **The Trinity** in Christian theology: three distinct persons (Father, Son, Holy Spirit) sharing one indivisible essence. In our architecture, the "Essence" of a coaching transformation is a single goal, but it is realized through the distinct "persons" of our primitives. Voice provides the frequency; State provides the behavioral location; Identity provides the historical context; Delivery provides the sensory manifestation. When you master the primitives, the 198 services stop being a maze and start being a predictable arrangement of these four "divine" elements.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The 4 Primitives are not just concepts; they are the architectural anchors that define our API contracts and data schemas.

1.  **Voice (TTT - Thought-to-Tone):** This is the semantic fingerprint. It’s not what you say, but the linguistic "temperature" and "discourse markers" you use. Technical implementation involves extracting a **TTT Baseline**—a statistical profile of unique words and sentence structures that define the coach’s "Sovereign Authority."
2.  **State (CBCS - Cognitive-Behavioral Coaching State):** This is the system's "memory" of where the client is in their transformation. It is represented as a state machine where nodes are psychological stages (e.g., "Resistance," "Breakthrough," "Integration"). State dictates the **logic** of the next interaction.
3.  **Identity (Context Premise):** These are the irreducible facts of the client's life extracted from their voice notes. An Identity primitive (e.g., "CEO of a tech startup with 50 employees") is stored in the **Neo4j Hypergraph**, allowing agents to cross-reference facts across months of coaching history.
4.  **Delivery (CMF - Conscious Media Factory):** The physical byproduct. This is the conversion of Voice, State, and Identity into a high-fidelity video asset. It involves the 3-phase pipeline (Audio→Visual→Assembly) that renders the "invisible" coaching logic into "visible" media.

Every failure in the CCP can be traced back to a corruption of one of these primitives. If the Voice is "off," the client loses trust. If the Identity is "hallucinated," the coaching is irrelevant. If the State is "stuck," the program fails to facilitate change.

## 📂 OUR CODE (100-200 words)

The primitives are operationalized in the heart of our service layer. You can see the deconstruction happening in these specific files:

- `src/ccp/pipelines/ttt_enforcement_pipeline.py` line 107: `TTTEnforcementPipeline`
  ```python
  # WHY: This service enforces the "Voice" primitive.
  # It ensures that every generated word adheres to the coach's 
  # linguistic baseline (DEP-ENG-005), preventing "AI-speak" drift.
  ```
- `src/ccp/services/context_premise_extraction_service.py` line 282: `ContextPremiseExtractionService`
  ```python
  # WHY: This is the "Identity" primitive factory. 
  # It extracts 12-dimension context from raw audio and 
  # updates the Neo4j ontology to ensure perfect recall.
  ```
- `src/ccp/pipelines/voice_dna_pipeline.py` line 53: `VoiceDNAPipeline`
  ```python
  # WHY: The 10-step extraction pipeline that creates the 
  # "Voice" and "Identity" prerequisites (DEP-ENG-003, DEP-ENG-004)
  # required for production.
  ```

## ✅ IMPLEMENTATION STEPS (100-200 words)

Your task is to identify the "Primitive Signature" in the codebase—the specific line where a high-level orchestration is reduced to one of our 4 atoms.

1. Open `ttt_enforcement_pipeline.py` and find the `run` method (line 156). Trace how it loads the `ttt_baseline.json` (the Voice primitive's DNA).
2. Open `context_premise_extraction_service.py`. Find the `HallucinationGate` (line 48). Note how it protects the **Identity** primitive by dropping any data that isn't verbatim (exact_quote).
3. Open `voice_dna_pipeline.py`. Locate `Step 5: Negative Space Excavation` (line 304). This represents the "Definition of NOT" for the **Voice** primitive—the strings we are forbidden from saying.
4. Open the `docs/architecture/` folder and find `FR8_TTT_Enforcement_Rule_Tech_Spec.md`. Read the "Layer 2: Compilation Detection" section to see how the Voice primitive blocks invalid code.

## ✅ VERIFY (30-50 words)

Pick any service in the `src/ccp/` directory. Can you map its primary output to one of the 4 Primitives (Voice, State, Identity, or Delivery)? → **Yes/No**. If Yes, the architectural complexity has been reduced to first principles.

## 🔗 BRIDGE (30-50 words)

Unit 1.3 takes these 4 primitives and shows how they are orchestrated by the 15-agent matrix, moving from "atoms" to the "living organism" of the CCP's scheduled operational model.

<!-- FACT-CHECK: "MOSS-TTS and F5-TTS 2026 status" → Both remain top-tier open-source TTS models for voice cloning and prosody control in 2026, often deployed as NIM containers for low-latency batch processing. -->
<!-- FACT-CHECK: "Neo4j 5.x Hypergraph patterns" → Neo4j 5.x supports "GPM" (Graph Pattern Matching) and multi-labeled nodes which facilitate the hypergraph-like relationship mapping used in our Context Premise Extraction. -->
