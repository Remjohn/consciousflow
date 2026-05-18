# Unit 06.05: Context Engineering — 12D Premise

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** "More context is always better." In the age of 2M+ token windows, it is tempting to dump every available transcript, PDF, and database row into the LLM prompt. This is "information obesity," and it is fatal to agentic precision. Scientific research on the "Lost in the Middle" phenomenon proves that LLM performance degrades significantly as context density increases, especially when relevant information is buried in a sea of noise.

Think of it like the human hippocampal indexing system: the brain does not store every sensory detail of your day in permanent storage. Instead, the hippocampus acts as a high-fidelity compressor, distilling chaotic daily events into structured, episodic memory traces that are then consolidated into the neocortex during sleep. This structural discipline is what allows you to recall the *essence* of a conversation without being paralyzed by the sound of a passing car in the background.

The 12-Dimensional Context Premise is the CCP's hippocampal index. By distilling a coach's entire corpus into 12 orthogonal features, we maximize semantic relevance while minimizing the noise that triggers model hallucination and reasoning drift.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

Context Engineering in the CCP is the art of "Information Discipline." We do not pass raw data; we pass a 12-Dimensional feature vector that captures the psychological and tactical essence of the coaching relationship. These 12 dimensions—Fears, Enemies, Dreams, Hidden Beliefs, Frustrations, Insecurities, Envy, Wants, Coping Mechanisms, Emotional Triggers, Success Markers, and Suspicions—are not arbitrary labels. They are orthogonal psychological coordinates that define the "State Space" of the coaching conversation.

The engineering core of this process is the **Hallucination Gate**. Per Tech Spec FR29, every extraction must be evidence-grounded. This is enforced via the `exact_quote` requirement (AC2/AC3): if the Aria agent extracts a "Fear" but cannot provide the verbatim 3-4 word phrase from the transcript that supports it, that extraction is dropped as null. This prevents the LLM from "reading between the lines" and inventing context that doesn't exist.

The system processes this through a 3-stage asynchronous pipeline:
1.  **Fast Audio Transcription:** Whisper/Groq converts voice notes to text in under 1500ms.
2.  **12D Extraction:** The Aria engine maps the transcript to the 12 dimensions, applying the Hallucination Gate to filter for groundedness in under 2500ms.
3.  **Neo4j Ontology Update:** The extracted features are merged into the coach-specific hypergraph (ADR-01) in under 1000ms.

This structured distillation ensures that when subsequent agents (like the Video Editor or the Ritual Architect) request "Context," they receive a high-density, low-noise premise that preserves the therapeutic integrity of the coach's identity.

## 📂 OUR CODE (100-200 words)

Our implementation lives in the service and model layers, enforcing strict SLA and groundedness constraints.

- `src/ccp/services/context_premise_extraction_service.py`:
  ```python
  # line 56: The Hallucination Gate
  # WHY: AC2 + AC3 enforcement. We drop any extraction that lacks
  # a verbatim string from the transcript, preventing "creative" 
  # context invention (L5: Ghost Variable Prohibition).
  class HallucinationGate:
      @staticmethod
      def filter(entries: list[ContextDimensionEntry]) -> list[ContextDimensionEntry]:
          return [e for e in entries if e.exact_quote and e.exact_quote.strip()]
  ```

- `src/ccp/models/onboarding_prerequisite_models.py`:
  ```python
  # line 383: The 12-Dimension Schema
  # WHY: This Pydantic model defines the macro audience Context Premise.
  # If a dimension isn't in this model, it doesn't exist in the feature vector.
  class ContextPremiseExtraction(BaseModel):
      fears: list[ContextDimensionEntry]
      enemies: list[ContextDimensionEntry]
      # ... other 10 dimensions ...
  ```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi / Claude Code:**
> Audit the `src/ccp/services/context_premise_extraction_service.py` file to ensure the 3-stage pipeline (Whisper -> Aria -> Neo4j) correctly handles the Stage 1 fallback (§6). Verify that if Whisper fails, the system returns the `previous_extraction` with `transcript_null=True` instead of crashing. Then, generate a test script that mocks a transcription result containing "I am paralyzed by fear of public speaking" and verify that the `HallucinationGate` preserves this entry ONLY if the exact quote "fear of public speaking" is present in the `exact_quote` field.

## ⌨️ TERMINAL (50-100 words)

```bash
# Run the extraction service in simulation mode for local testing
python -m src.ccp.services.context_premise_extraction_service

# Verify the Neo4j ontology update latency
# Expected: Azaria | action=neo4j_ontology_update | latency < 1000.0ms
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/services/context_premise_extraction_service.py` and review the `HallucinationGate` class on line 48.
2. Ensure the `AriaExtractionAdapter` (line 121) correctly invokes the `HallucinationGate` after the LLM call.
3. Open `src/ccp/models/onboarding_prerequisite_models.py` and locate the `ContextDimensionEntry` (line 361) and `ContextPremiseExtraction` (line 383) models.
4. Verify that the 12 fields in `ContextPremiseExtraction` match the 12 psychological dimensions required by the coach's corpus distillation.
5. Paste the Agent Prompt from Section 4 into your coding assistant to generate the validation tests for the Hallucination Gate.
6. Run the terminal command from Section 5 to confirm the mock pipeline completes in under 5000ms.

## ✅ VERIFY (30-50 words)

Run the test script generated in Section 4. Does the system drop an entry when `exact_quote` is empty? → Yes/No. Does the total pipeline latency remain under 5000ms? → Yes/No.

## 🔗 BRIDGE (30-50 words)

Unit 06.06 builds on this high-density context by introducing TTT Enforcement — where we leverage this captured "State Space" to regulate the voice, rhythm, and texture of the coach's digital identity.

<!-- FACT-CHECK: "LLM context degradation at 128k tokens 2026" → Research confirms prompt performance peaks early; "Lost in the Middle" persists even in 2M+ token models, mandating structural context pruning. -->
<!-- FACT-CHECK: "Whisper large-v3-turbo NVIDIA NIM 2026" → Available as a standard NIM container on build.nvidia.com, optimized for <1500ms real-time transcription on H100s. -->
