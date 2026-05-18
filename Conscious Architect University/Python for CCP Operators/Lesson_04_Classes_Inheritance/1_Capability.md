# 🔵 Layer 1: Capability — Classes & Inheritance

## THE CCP FAILURE SCENARIO

The JIT Skill Compiler has just been handed a new skill contract by a junior Architect. The requirement is simple: generate a coaching script aligned to a client's CBCS profile, enforce a minimum confidence score, and flag any session where the trigger array is empty. The Architect told the agent to "build a data structure for the output." The agent complied. It produced this:

```python
coaching_output = {
    "script": "You need to confront this pattern...",
    "cbcs_score": 0.91,
    "trigger_count": 3,
    "flagged": False
}
```

The agent used a plain dictionary. No class. No contract. No validation. No inheritance from any framework.

For three days, the platform ran without incident. Then a new LLM was rotated into the Laser Cutter slot — slightly more creative, slightly less constrained. On day four, it returned `"cbcs_score": "high"` instead of `0.91`. The dictionary accepted it. There was no class structure to reject it. No inherited `BaseModel` to enforce numerical bounds. No `@field_validator` method attached to any blueprint. The string `"high"` flowed into the Neo4j graph query that expected a float for CBCS trend analysis. The query crashed with a `TypeError`. The client's session state was partially written and then abandoned — a corrupted node dangling in the coaching graph.

The Architect reviewed the logs. The dictionary looked fine. The keys were all present. The data looked plausible. But there was no machine to catch the wrong type because there was no **blueprint** defining what the correct type was supposed to be.

This is the failure that happens when an Architect does not understand **classes and inheritance**. The dictionary is raw material. The class is the machine that shapes it, enforces it, validates it, and makes it reproducible across every session in every timezone on every coaching coach in the platform.

If you cannot read a class definition — if you cannot understand what a Pydantic `BaseModel` provides the moment a subclass inherits from it — your platform is operating on honor system data. And LLMs have no honor.

---

## THE ARCHITECTURAL DEFINITION: CONCEPT AS FORCE MULTIPLIER

### What Does This Concept Allow You To Do?

A **class** in Python is not a data container. A dictionary is a container. A class is a **Machine Blueprint** — a precise, reusable schematic that describes:

1. **What attributes an object must have** — and what types those attributes must carry.
2. **What operations an object can perform** — its methods, validators, serializers.
3. **What it inherits from its parent** — and therefore what capabilities it possesses before you write a single line of its own logic.

To a sovereign Architect operating the CCP, the class is the fundamental unit of **architectural repeatable behavior**. When you define a class, you are not describing data — you are issuing a manufacturing specification. Every instance of that class is a product that was produced to that specification. It either meets spec or it doesn't. There is no ambiguity.

By understanding classes and inheritance, you gain the ability to:

1. **Read any Pydantic schema and immediately know what it validates** — because you understand that `class CoachingOutput(BaseModel)` inherits validation, serialization, and type coercion machinery from its parent before you read a single field declaration.
2. **Read any DSPy Module and immediately understand its pipeline structure** — because you know that `class ScriptGenerator(dspy.Module)` inherits the `forward()` method contract, the optimization hooks, and the few-shot compilation pipeline from its parent.
3. **Detect architectural defects in agent-generated code** — not by tracing every line of logic, but by reading the class hierarchy. If the class doesn't inherit from the right parent, the entire capability layer it needs is simply absent.
4. **Command your agents to build composable machine blueprints** — every new feature in the CCP is a class that inherits from an existing contract, adding new fields or overriding specific behaviors without breaking what came before.

### The Factory Floor Metaphor: Machine Blueprints

On the factory floor, a **class is the CAD drawing** — the complete engineering specification for a machine. Before the physical machine exists, the blueprint tells you:

- The exact dimensions of every component.
- The tolerance specifications for each measurement.
- Which other machines this one is built upon.

**Inheritance** is the ability to stamp "EXTENDS: STANDARD_MACHINE_V3" at the top of a new blueprint. Any machine built from that new blueprint automatically inherits all the precision engineering from the parent. The child machine doesn't have to re-specify how its motor works — it inherits the motor design. It only specifies what it adds or overrides.

In the CCP, the parent blueprint is almost always a framework class:

- **Pydantic `BaseModel`** — the QA Department's master inspection specification. Every schema that inherits from it automatically gets type coercion, `ValidationError` raising, JSON serialization, and the `.model_validate()` method. The child class adds fields; the parent class adds the entire inspection apparatus.
- **`dspy.Module`** — the Machinist's master assembly protocol. Every AI pipeline step that inherits from it automatically gets the `forward()` execution hook, the `__call__` orchestration wrapper, and the teleprompter optimization interface. The child module adds the _specific_ DSPy sub-modules it needs; the parent class adds the entire compilation infrastructure.

You never build these parent classes. They were engineered by framework teams who spent years designing the guarantee they provide. Your job is to understand what that guarantee is so you can command your agents to use the correct parent and build the correct child.

---

## THE MINIMAL CODE READING

Read the following three code blocks carefully. You are the Foreman reviewing blueprints before the machines are manufactured. Predict the outcome before reading the reveal.

### Reading 1: The Class Blueprint and Constructor

```python
class Coach:
    def __init__(self, name: str, specialty: str):
        self.name = name
        self.specialty = specialty

    def introduce(self) -> str:
        return f"I am {self.name}, specialized in {self.specialty}."

coach = Coach("Jean Pierre", "leadership")
```

This is a minimal class. Two attributes assigned in `__init__`. One method defined on the instance.

> **Prediction Gate:**
> What does `coach.introduce()` return?
> *Make your prediction before reading further.*

**The Reveal:** It returns `"I am Jean Pierre, specialized in leadership."` The `__init__` method ran when `Coach("Jean Pierre", "leadership")` was called, binding `"Jean Pierre"` to `self.name` and `"leadership"` to `self.specialty`. When `introduce()` is called later, `self` refers back to that specific `coach` instance, accessing those stored values.

**Architectural note:** The `__init__` is the construction contract. It declares what materials the factory requires before a machine can be manufactured. Without `name` and `specialty`, the construction halts. Python raises a `TypeError` immediately.

---

### Reading 2: Inheritance and `super()`

```python
class PremiumCoach(Coach):
    def __init__(self, name: str, specialty: str, tier: str):
        super().__init__(name, specialty)
        self.tier = tier
```

`PremiumCoach` inherits from `Coach`. The `super().__init__(name, specialty)` line calls the **parent's constructor** before adding the child's own attribute.

> **Prediction Gate:**
> If you create `pc = PremiumCoach("Audrey", "resilience", "Platinum")` and call `pc.introduce()`, what happens?
> *Make your prediction before reading further.*

**The Reveal:** It works. It returns `"I am Audrey, specialized in resilience."` The `PremiumCoach` class inherited the `introduce()` method from its parent `Coach`. The child did not define `introduce()` — but it didn't need to. Inheritance made the parent's method available on every instance of the child. The `self.tier = "Platinum"` attribute was added on top of the inherited structure.

**Architectural note:** This is precisely how `class CoachingOutput(BaseModel)` works. The child class `CoachingOutput` inherits the entire validation engine from `BaseModel` without defining it. Every field you add in the child is processed through the parent's machinery automatically.

---

### Reading 3: Pydantic Inheritance — The QA Machine

```python
from pydantic import BaseModel, Field
from typing import Optional

class CoachingOutput(BaseModel):
    coaching_script: str
    cbcs_score: float = Field(..., ge=0.0, le=1.0)
    trigger_count: int = Field(..., ge=1)
    flagged: bool = False
    coach_notes: Optional[str] = None
```

This class inherits from `BaseModel`. It adds five fields. It does not define any `__init__` method. It does not define a `.validate()` method. It does not define a `.json()` method.

> **Prediction Gate:**
> Where do validation, JSON serialization, and type coercion come from in this class?
> *Make your prediction before reading further.*

**The Reveal:** From the parent — `BaseModel`. By writing `class CoachingOutput(BaseModel)`, the class inherits Pydantic's entire inspection apparatus without writing a single line of its own machinery. When you call `CoachingOutput(coaching_script="...", cbcs_score=0.91, trigger_count=3)`, Pydantic's inherited constructor intercepts the call, validates every field against the declared types and `Field()` constraints, and raises a `ValidationError` if any value violates the contract. The Architect didn't write this logic — they **inherited** it.

---

## THE FACTORY FLOOR CONNECTION

### How Classes Flow Through the CCP Execution Chain

Understanding where the **Machine Blueprint** operates at each layer of the factory:

**1. Client request arrives — The Chassis (FastAPI)**
The request body is immediately parsed into a **Pydantic class** — `class SessionTriggerRequest(BaseModel)`. The class is the blueprint; the incoming JSON is the raw material. FastAPI feeds the JSON into the class constructor. If the JSON violates any field in the blueprint, the Chassis returns a `422 Unprocessable Entity` before the request reaches any business logic. The class is the first checkpoint on the factory floor.

**2. Validated data moves to the DSPy pipeline — The Machinist**
The validated Pydantic object is unpacked and passed into a `dspy.Module` subclass. The class structure of the module (`__init__` declaring sub-modules, `forward()` defining execution flow) tells DSPy how to wire the AI pipeline. The `forward()` method is inherited from `dspy.Module` — the specific coaching module only defines what goes inside it. The parent class handles the orchestration, callback management, and optimization tracking.

**3. The LLM executes — The Laser Cutter**
The LLM produces raw text output. That output is fed back into an **output Pydantic class** — `class CoachingOutput(BaseModel)`. The class blueprint validates the LLM's response before it touches anything else in the system. This is the QA gate that the failure scenario at the start of this chapter was missing.

**4. Validated output enters Neo4j — The Memory Engine**
The confirmed, validated class instance is serialized to a dictionary via its inherited `.model_dump()` method and written to the Neo4j graph. The graph node is always structurally compliant because the class enforced the structure before serialization.

### The Orchestration Dichotomy Layer

Classes serve the **QA Department (Dictum 2)** of the Orchestration Dichotomy. The Dictum states that non-deterministic modules — the LLM's raw output — must always pass through a deterministic enforcement layer before proceeding. The Pydantic class **is** that enforcement layer. Every `BaseModel` subclass in the CCP is a permanent QA inspection gate. Remove the class, and the deterministic enforcement disappears entirely.

Classes also serve the **Machinist (DSPy)** through the `dspy.Module` inheritance hierarchy — structuring how the optimization compiler understands and improves the AI pipeline.

---

## THE CONSEQUENCE MAP

### Consequence 1: Structureless Data Corruption (Silent)

**What happens:** An agent generates a function that returns a plain `dict` instead of a typed Pydantic class. The dictionary contains all required keys, but no validation logic exists to enforce types or constrain values.

**The specific impact:** When the LLM rotates or drifts (a common occurrence when model versions change), it may return `"cbcs_score": "excellent"` — a string instead of a float. The dictionary silently accepts it. The value flows into the Neo4j aggregation query that computes weekly performance trends. The Cypher query fails with a type error on data that had been written three sessions prior. The debugging is nearly impossible because the error appears downstream of where the corruption occurred.

**The client experience:** Three past coaching sessions display blank trend data in the weekly report. The coach loses credibility with the client. The Architect cannot pinpoint when the drift started because no validation error was ever raised.

**Strategic Source:** Orchestration Dichotomy, Dictum 2 — *"All LLM output must pass through an immutable structural gate before touching stateful systems."*

---

### Consequence 2: Broken DSPy Optimization Pipeline

**What happens:** An agent writes a DSPy module that does NOT inherit from `dspy.Module`. It defines a `forward()` method manually but doesn't inherit the parent class.

**The specific impact:** DSPy's teleprompter optimizer (`dspy.MIPROv2`, `dspy.BootstrapFewShot`) introspects module hierarchies by traversing the `dspy.Module` inheritance tree. A class that doesn't participate in that tree is invisible to the optimizer. When the operator runs the optimization pass to improve the 76-skill pipeline, those orphaned modules are silently skipped. The platform runs unoptimized AI for those specific skills, degrading coaching quality without any error signal.

**Strategic Source:** DSPy Paper (MCDA 185/200) — *"Module-based composition requires participation in the dspy.Module inheritance hierarchy for teleprompter-driven optimization."*

---

### Consequence 3: The Invisible Missing Validator

**What happens:** An agent builds a `BaseModel` subclass with a `@field_validator` but forgets to inherit from `BaseModel` — instead inheriting from an unrelated class or nothing at all.

**The specific impact:** The `@field_validator` decorator expects to operate inside the Pydantic class machinery. Without `BaseModel` in the inheritance chain, `@field_validator` is a no-op decorator attached to a plain Python class. No validation runs. The class accepts any value for any field. When agents write code that "looks like" Pydantic but doesn't inherit correctly, it is structurally identical to having no validation at all.

**Strategic Source:** Orchestration Dichotomy, Dictum 2 — *"The QA Department's power derives from its base class, not from its decorators."*

---

### Consequence 4: Composition Error — Nested Objects Without Inheritance Chains

**What happens:** The CCP's `CoachingSession` model contains a nested `Coach` object. An agent constructs both as plain dictionaries instead of typed class instances, eliminating the nested validation chain.

**The specific impact:** When Pydantic validates a nested model — `coach: Coach` inside `CoachingSession` — it recursively validates the nested `Coach` object against its own blueprint. If `Coach` is just a dict, Pydantic cannot apply nested validation, and arbitrary structures can be embedded. A client session record can contain a malformed coach profile without triggering any validation error. The Memory Engine writes the corrupt record to the graph where it persists across all future sessions for that client.

**Strategic Source:** OpenProse Contract Vocabulary — *"Composite contracts require typed composition. Every nested object must declare its own class contract."*

---

## PREDICTION EXERCISES (CAPABILITY GAUNTLET)

You are the Foreman reviewing seven code snippets generated by a coder agent. Sign off on each only after you have made and confirmed your prediction.

### Exercise 1

```python
class SessionState(BaseModel):
    session_id: str
    is_active: bool = True

state = SessionState(session_id="S-101")
```

> **What does `state.is_active` return?**
> `True`.
> **Why:** The field `is_active` was declared with a default value of `True` in the class blueprint. When the instance is created without providing `is_active`, Pydantic uses the class default. The parent `BaseModel` machinery handles the default injection automatically.

---

### Exercise 2

```python
class TriggerProfile(BaseModel):
    trigger_names: list[str]
    weight: float

profile = TriggerProfile(trigger_names=["confrontation"], weight="high")
```

> **What happens when this line executes?**
> Pydantic raises a `ValidationError` immediately.
> **Why:** The class blueprint declares `weight: float`. The inherited `BaseModel` validation machinery intercepts `"high"` — a `str` — and attempts type coercion to `float`. `float("high")` raises a `ValueError` internally. Pydantic converts this to a `ValidationError` and refuses to create the instance.

---

### Exercise 3

```python
class ScriptGenerator(dspy.Module):
    def __init__(self):
        super().__init__()
        self.predict = dspy.Predict("context -> coaching_script")

    def forward(self, context: str) -> dspy.Prediction:
        return self.predict(context=context)
```

> **What does `super().__init__()` accomplish here?**
> It initializes the parent `dspy.Module` machinery — specifically the internal state tracking, callback registration, and optimization metadata that the teleprompter needs to introspect this module.
> **Why:** Without calling `super().__init__()`, the `dspy.Module` parent class never sets up its internal infrastructure. The module will appear to work in simple calls, but DSPy's optimizer will be unable to traverse its structure, and callback tracking will be broken during compilation.

---

### Exercise 4

```python
class PremiumSession(CoachingSession):
    retention_score: float = Field(..., ge=0.0, le=1.0)
    vip_priority: bool = False
```

> **Does `PremiumSession` require Pydantic's `BaseModel` import to validate fields?**
> No — as long as `CoachingSession` already inherits from `BaseModel`.
> **Why (counter-intuitive):** Inheritance is transitive. If `CoachingSession(BaseModel)` inherits from `BaseModel`, then `PremiumSession(CoachingSession)` also possesses all of `BaseModel`'s machinery — two levels deep. The Pydantic validation chain extends automatically through every layer of the hierarchy.

---

### Exercise 5

```python
class VoiceDNAConfig(BaseModel):
    intensity: float
    warmth: float
    directness: float

config_a = VoiceDNAConfig(intensity=0.9, warmth=0.6, directness=0.7)
config_b = VoiceDNAConfig(intensity=0.9, warmth=0.6, directness=0.7)
```

> **Is `config_a == config_b` true?**
> Yes.
> **Why (counter-intuitive for Python beginners):** Plain Python objects use identity equality — two separate instances would not be equal. But `BaseModel` overrides the `__eq__` method so that two instances are equal if their **field values** are equal. Pydantic provides this behavior through inheritance. Without the `BaseModel` parent, `config_a == config_b` would be `False` because they are separate objects in memory.

---

### Exercise 6

```python
class CoachBase(BaseModel):
    name: str
    id: str

class ActiveCoach(CoachBase):
    session_count: int = 0

coach = ActiveCoach(name="Jean Pierre", id="JP-001")
```

> **Can you call `coach.model_dump()`?**
> Yes, and it returns all fields from both the parent and child classes.
> **Why:** `model_dump()` is inherited from `BaseModel` — two levels up. It traverses the entire class hierarchy and serializes every declared field, including those inherited from parent classes. The result is `{"name": "Jean Pierre", "id": "JP-001", "session_count": 0}`.

---

### Exercise 7

```python
class SessionHandler(dspy.Module):
    def __init__(self):
        self.predictor = dspy.Predict("transcript -> summary")

    def forward(self, transcript: str) -> dspy.Prediction:
        return self.predictor(transcript=transcript)
```

> **What critical error exists in this class definition, even though it will appear to run correctly in simple tests?**
> The `__init__` method does not call `super().__init__()`.
> **Why (counter-intuitive):** The module will run in direct execution mode without error. But when a DSPy optimizer attempts to compile or fine-tune this module, it will fail to recognize `self.predictor` as a registered DSPy sub-module because the parent class never initialized the internal sub-module registry. The optimizer will skip this module silently, leaving it unoptimized in a production pipeline. This defect is invisible in unit testing and only emerges at optimization time.

---

## COMPRESSION LAYER

Every concept you have mastered so far — variables, dictionaries, functions — operates at the level of **individual instructions** on the factory floor. A variable is one labeled box. A function is one work station. A class is the engineering specification for an **entire machine** — an object with its own data, its own capabilities, and its own place in the manufacturing hierarchy.

**Inheritance is the mechanism that prevents you from building every machine from scratch.** When you write `class CoachingOutput(BaseModel)`, you are standing on the shoulders of the Pydantic engineering team. You get their entire quality inspection system — type coercion, field validation, serialization, `ValidationError` raising — for free, before you write a single field.

The next lesson — Decorators and Validators (Lesson 05) — teaches you the mechanisms that the class machinery uses to attach enforcement rules to specific fields. Decorators are the stamps that the QA Department places on individual components inside a class blueprint.

**Factory Floor metaphor summary:** The class is the master engineering blueprint of the factory floor. Without it, every machine must be built from scratch, to no standard, with no guaranteed tolerance. Without inheritance, every blueprint re-invents every component. With both, you build sovereign-grade machines that interlock, validate each other, and can be upgraded without tearing down the factory.

**Sovereign truth:** You do not write `BaseModel` and `dspy.Module` — you inherit from them. Your job is to understand so precisely what those parents provide that you can immediately detect when an agent has inherited from the wrong parent, or from nothing at all.
