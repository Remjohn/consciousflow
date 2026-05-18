# Unit 3.6: Deterministic Handoffs & A2A Protocol

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Agents can pass plain text to each other. Information entropy dictates that unstructured text decays with every transmission. If Agent A sends a 500-word paragraph to Agent B, 30% of the implicit structure (scores, array boundaries, boolean flags) will be hallucinated or omitted in translation. This is the "Telephone Game" failure mode, and it kills multi-agent swarms.

Think of it like synaptic neurotransmission in the human brain. A presynaptic neuron (Agent A) does not just release a generic cloud of electrical noise. It packages chemical signals into specific neurotransmitters like dopamine or serotonin. These molecules only bind to precisely configured postsynaptic receptors (Agent B). If the shape of the molecule doesn't match the receptor, the signal drops.

In a swarm, we must package data into precise "molecules." We achieve this through rigid JSON schema serialization, ensuring zero data loss and deterministic behavior as workflows leap across the architectural boundaries of the CCP.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The 2026 Google Agent-to-Agent (A2A) protocol standardizes how agents discover one another and communicate. Its core primitive is the Agent Card—a structured JSON metadata document that acts as an agent's "business card." When the `morgan_orchestrator` needs a specialized subagent, it doesn't prompt blindly; it reads the target's Agent Card to negotiate capabilities, stream requirements, and strictly defined input/output schemas.

When agents hand off computation, they transmit data via JSON payloads governed by Pydantic v2.10. Pydantic is not just a typing library; its core (`pydantic-core`) is written in Rust, moving heavy validation operations entirely out of Python. This enables sub-millisecond serialization speeds and prevents application blocking during massive JSON dumps.

The key to performance relies on using `model_validate_json()`. This function parses the raw string and validates the schema in a single Rust pass, avoiding the immense overhead of intermediate Python dictionary creation. Additionally, Pydantic's `@model_validator` decorators enforce complex semantic rules—like ensuring a 30-day roadmap precisely follows a 4-active, 1-reflection, 2-rest pattern—before the payload ever reaches the downstream agent.

Without these strict schemas, multi-agent architectures suffer catastrophic data drift. By enforcing deterministic handoffs via JSON Schema generation, we guarantee that when an agent requests a `CapacityTrack` enumeration, it receives exactly that, not a hallucinated approximation.

## 📂 OUR CODE (100-200 words)

Every data structure passed between our agents is defined in `src/ccp/models/`. Open `cross_system_models.py`.

```python
# cross_system_models.py, line 314
class DormancyRecoveryPayload(BaseModel):
    user_id: str
    coach_id: str = Field(min_length=2, max_length=4)
    trigger_timestamp: str = Field(...)
    dormancy_tier: DormancyTier
    # WHY: Strongly typed Enums prevent the generator agent
    # from hallucinating invalid tier values.
```

```python
# cross_system_models.py, line 397
class AtlasRoadmap(BaseModel):
    # ...
    @model_validator(mode="after")
    def validate_4_1_2_structure(self) -> "AtlasRoadmap":
    # WHY: This validation function executes instantly in Rust.
    # It mathematically enforces the 4+1+2 template distribution
    # across the entire 28-day array, instantly rejecting malformed outputs.
```

The orchestrator guarantees that the `DormancyStateUpdate` will always contain the exact `previous_state` and `new_state` enums, because the Pydantic schema acts as a mathematically rigid synapse receptor. No schema match, no handoff execution.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Open `src/ccp/models/cross_system_models.py` and inspect the `AtlasRoadmap` Pydantic model at line 397. Note the `@model_validator` logic that enforces the 4+1+2 constraint. Create a new file at `tests/test_atlas_roadmap.py` that instantiates this model using pytest. Create one passing test case with the correct 4 Active, 1 Reflection, 2 Rest day distribution, and one failing test case that violates it to prove the validation engine works.

## ⌨️ TERMINAL (50-100 words)

```bash
# Execute the Rust-powered validation tests
pytest tests/test_atlas_roadmap.py -v

# Expected:
# tests/test_atlas_roadmap.py::test_4_1_2_validation PASSED
# tests/test_atlas_roadmap.py::test_invalid_roadmap FAILED
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Open `src/ccp/models/cross_system_models.py` and navigate to line 397.
2. Read the `AtlasRoadmap` class, paying specific attention to the `@model_validator` methods that ensure the 28-day schedule matrix is mathematically perfect.
3. Observe how the `DormancyRecoveryPayload` strictly binds strings and booleans to the `DormancyRecoveryContext` schema, eliminating interpretation variance.
4. Paste the prompt from Section 4 into your Claude Code session to generate the `test_atlas_roadmap.py` file.
5. Watch the test execution output carefully. You will see how Pydantic's Rust core instantly rejects the second malformed payload without ever invoking an LLM.

## ✅ VERIFY (30-50 words)

Run `pytest tests/test_atlas_roadmap.py -v` in your terminal. The test must execute cleanly resulting in one PASSED and one FAILED constraint violation. If the Pydantic validation intercept triggers, the deterministic handoff logic is sound.

## 🔗 BRIDGE (30-50 words)

Unit 3.7 builds on these rigid data payloads by introducing Hierarchical Context & Pheromone Trails—teaching you how we persistently store and extract these identical JSON structures across multi-day conversational memory spans without degrading the LLM's working focus.

<!-- FACT-CHECK: "Google A2A protocol Agent Cards" → Linux Foundation standard, standardizes agent discovery via JSON schema metadata. "Pydantic v2 2026 performance model_validate_json" → Rust backend ensures sub-millisecond zero-copy validation processing. -->
