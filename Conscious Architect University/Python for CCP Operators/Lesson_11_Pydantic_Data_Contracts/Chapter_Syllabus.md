## 🧠 Lesson 11: Pydantic — Data Contracts

### 🎯 Goal

Understand Pydantic's `BaseModel` as the enforcement mechanism that turns type hints into strict validation — and see how the CCP uses it as the quality gate between every pipeline stage.

---

### Layer 1 — BaseModel: types that actually enforce

Remember from Lesson 01: Python's type hints don't enforce anything. Pydantic changes that:

```python
from pydantic import BaseModel, Field

class CoachingScript(BaseModel):
    coach_id: str
    trigger_count: int = Field(ge=1)
    cbcs_score: float = Field(ge=0.0, le=1.0)
```

If you try to create a `CoachingScript(coach_id="JP", trigger_count=0, cbcs_score=1.5)`, Pydantic immediately raises a `ValidationError` — `trigger_count` must be ≥ 1, and `cbcs_score` must be ≤ 1.0.

This is what makes Pydantic the QA Department of the Factory Floor. Every piece of data that enters or exits a pipeline stage must pass through a Pydantic model.

---

### Layer 2 — Validators: custom rules

Beyond field-level constraints, you can write custom validation logic:

```python
from pydantic import BaseModel, field_validator

class ScriptOutput(BaseModel):
    script_text: str
    triggers: list[str]
    
    @field_validator("triggers")
    @classmethod
    def must_have_triggers(cls, v: list[str]) -> list[str]:
        if len(v) < 3:
            raise ValueError("Script must contain at least 3 triggers")
        return v
```

This validator runs every time a `ScriptOutput` is created. If an LLM generates a script with only 2 triggers, the validation fails and the pipeline retries.

---

### Layer 3 — Pydantic in the CCP

Every data boundary in the CCP is a Pydantic model:

**LLM output validation** (Launch Manual Ch 07, Ch 09): When DSPy calls the LLM, the response is parsed into a Pydantic model. If parsing fails → retry. If validation fails → retry. If retries exhausted → fallback response.

**FastAPI request/response** (Launch Manual Ch 06): FastAPI uses Pydantic models to validate incoming requests AND outgoing responses automatically. Invalid JSON from a client → 422 error. Invalid data from the backend → caught before it reaches the client.

**Neo4j query results** (Launch Manual Ch 08): Graph query results are untyped dictionaries by default. The CCP wraps them in Pydantic models to enforce structure before they enter the coaching pipeline.

---

### Layer 4 — Nested models and Optional fields

Real CCP schemas are nested and include optional fields:

```python
class SessionState(BaseModel):
    coach_id: str
    client_id: str
    script: CoachingScript  # nested Pydantic model
    feedback: str | None = None  # optional
    history: list[dict] = []  # optional with default
```

The `| None` syntax means "this field can be a string OR null." The `= None` sets the default. This is how the CCP handles data that isn't always present.

---

### 🧩 Key questions

1. What's the difference between `int` (Python type hint) and `Field(ge=1)` (Pydantic constraint)?
2. Why does the CCP validate LLM output with Pydantic instead of trusting the prompt?
3. What does `str | None = None` mean?

### 🎯 Takeaway

Pydantic turns type hints into enforced contracts. `BaseModel` validates data on creation. Validators add custom rules. The CCP uses Pydantic at every data boundary — between the client and the API, between the API and the LLM, between the LLM and the database. It's the quality gate that catches bad data before it corrupts a coaching session.
