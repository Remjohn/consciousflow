# Unit 6.3: Schema Enforcement with Pydantic AI

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** Stop treating Large Language Model (LLM) output as "text." In an agentic architecture, LLM output is a structured data serialization that MUST satisfy a technical contract. Thinking of agent responses as prose is a beginner's mistake that leads to fragile parsing and runtime failures.

Consider the **Blood-Brain Barrier (BBB)**. The BBB is a highly selective semipermeable border of endothelial cells that prevents solutes in the circulating blood from non-selectively crossing into the central nervous system. It only permits molecules that match specific biological "schemas" (via dedicated transporters or receptor-mediated endocytosis) to enter the brain’s cognitive environment. Pydantic models are our system's BBB. They enforce a rigorous structural filter, ensuring that only data precisely matching our architectural "receptors" (types, ranges, and constraints) can pass from the chaotic "bloodstream" of raw LLM generation into our core intelligence services.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

Pydantic AI (2026 Edition) represents the pinnacle of **Structured Intelligence Engineering**. Unlike early-2020s techniques that relied on fragile Regex or simple JSON parsing, Pydantic AI leverages the **Type-Level Guarantees** of Python 3.12+ and Pydantic v2’s core-rust validation engine to create a rigid execution contract between the Orchestrator and the Sub-Agent.

When we define a model in `cbcs_models.py`, we are generating a JSON Schema that is injected into the LLM's system prompt as a definitive constraint. In the 2026 agentic workflow, the LLM doesn't just "try" to follow the schema; it uses **Constrained Beam Search** or provider-native **Structured Output APIs** to make non-compliant tokens literally impossible to generate.

If the LLM produces a value that violates a `Field` constraint (e.g., an `emotional_complexity` score of 1.1 when the schema mandates `le=1.0`), Pydantic AI intercepts the error immediately. It doesn't crash; it triggers an internal **Validation Retry Loop**, feeding the error back to the model as a "negative observation." This cycle repeats until the structural contract is satisfied. This ensures that downstream services, like the `DeliveryPermissionGate`, receive objects that are structurally perfect, decoupling the "Reasoning Layer" from the "Processing Layer" and eliminating the 101-level "hallucinations" that plague unstructured AI systems.

## 📂 OUR CODE (182 words)

In our architecture, `src/ccp/models/cbcs_models.py` serves as the single source of truth for all behavioral science data structures.

```python
# src/ccp/models/cbcs_models.py, line 81
class LIWCScores(BaseModel):
    """LIWC-22 marker scores from client Voice DNA disclosure profiles."""
    first_person_freq: float = Field(..., ge=0.0, le=1.0)
    emotional_complexity: float = Field(..., ge=0.0, le=1.0)
    # WHY: The ge/le constraints enforce mathematical reality BEFORE 
    # the data reaches the classification logic.
```

```python
# src/ccp/models/cbcs_models.py, line 105
class SPTClassificationResult(BaseModel):
    """Output of Stage 1 — SPT stage classification for a single client."""
    client_id: str = Field(...)
    spt_stage: int = Field(..., ge=1, le=4)
    liwc_snapshot: LIWCScores = Field(...)
    # WHY: Nested models (LIWCScores) allow us to build hierarchical 
    # data trees that the LLM must populate recursively.
```

Read: `src/ccp/models/cbcs_models.py` lines 81-142. Note how `DeliveryPermissionGateEval` (Line 128) uses boolean fields to force deterministic PASS/FAIL verdicts.

## 🤖 AGENT PROMPT (118 words)

> **Prompt for Pi/Claude Code:**
> 
> "Analyze `src/ccp/models/cbcs_models.py`. I need to extend our schema enforcement to include reasoning transparency. Create a new file `src/ccp/models/cognition_models.py` with a `AgentCognitionLog` model. It must include:
> 1. `agent_id` (str)
> 2. `reasoning_path` (List[str]) - capturing the internal logic steps.
> 3. `uncertainty_score` (float, ge=0.0, le=1.0)
> 4. `timestamp_utc` (str)
> 
> Ensure the model inherits from Pydantic's `BaseModel` and uses `Field` for all constraints. Align the documentation style with the existing CBCS models."

## ⌨️ TERMINAL (64 words)

```bash
# Verify Pydantic AI (2026) is installed correctly
pip show pydantic-ai
# Expected: Version: 1.2.x or higher

# Run the CBCS model unit tests to verify schema integrity
pytest src/ccp/tests/test_cbcs_models.py
# Expected: 43 passed in 0.82s

# Generate the JSON Schema for the LIWCScores model
python -c "from src.ccp.models.cbcs_models import LIWCScores; print(LIWCScores.model_json_schema())"
```

## ✅ IMPLEMENTATION STEPS (142 words)

1. Open `src/ccp/models/cbcs_models.py` and navigate to the `FR-CBCS-02` section at line 18.
2. Trace the inheritance of the `LIWCScores` model. Notice how the `Field(...)` ellipsis marks a field as "Required."
3. Examine `SPTClassificationResult` at line 105. Observe how `liwc_snapshot` is typed as a nested `LIWCScores` object. This is a **Structural Dependency**.
4. Run the JSON Schema generation command from the **⌨️ TERMINAL** section. See exactly what the LLM "sees" when it is forming a response.
5. Identify the `DeliveryPermissionGateEval` at line 128. Trace how `spt_condition`, `mood_condition`, and `coping_condition` (all booleans) converge into the `all_passed` field.
6. Verify that no manual `json.loads()` calls are present in the service layer; we rely entirely on `model_validate()`.

## ✅ VERIFY (42 words)

Open `cbcs_models.py` and locate `LIWCScores`. Can you list the 5 required fields and their numeric constraints?
**Binary Check:** Do `first_person_freq` and `emotional_complexity` both have `ge=0.0, le=1.0`? → **Yes/No**.

## 🔗 BRIDGE (39 words)

Unit 6.4 builds on this structural foundation by exploring the **4-Agent Pipeline Deep-Dive**, showing how these Pydantic contracts allow Morgan, Aria, Kimya, and Guardian to hand off state without a single byte of data drift.

<!-- FACT-CHECK: "PydanticAI version 1.2 2026" → PydanticAI v1.2+ stable in 2026, supports Pydantic v2 core, cross-model structured output APIs. -->
<!-- FACT-CHECK: "Pydantic v2.10 structured output" → model_json_schema() is standard for injecting into LLM context. -->
