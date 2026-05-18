# 🐍 Python for CCP Operators — Lesson Outlines

> Each lesson outline is 400–500 words. These outlines are the **content blueprint** — they define WHAT each lesson teaches, the key analogies, and the CCP connections. The 4-layer prompt templates define HOW the content is delivered.

> **Accuracy Rule:** All CCP subsystem references must map to real architecture documented in the Launch Manual, PRD, or Strategic Decision papers. No invented module names, no hallucinated API surfaces. If a subsystem is referenced, it must correspond to an actual CCP component.

---

# Phase 1: The Language of Contracts (L01 – L05)

> You are a complete beginner. You've never written Python. These lessons start from absolute zero — what a variable even IS, what a dictionary looks like, how functions work. The CCP connection is present but secondary: first you understand the concept, then you see where it appears in the platform.

---

## 🧠 Lesson 01: Variables, Types & Type Hints

### 🎯 Goal

Understand that every piece of data in Python has a **name** and a **type** — and that type hints are how you tell both humans and machines what kind of data to expect.

---

### Layer 1 — What is a variable?

A variable is a label you stick on a piece of data.

```python
name = "Audrey"
age = 34
active = True
```

Three variables. Three types: text (`str`), number (`int`), true/false (`bool`).

The key insight: Python figures out the type automatically. You don't have to declare it like in Java or C. But that flexibility is also dangerous — if nobody specifies what type a variable should be, anything can get passed in, and nothing will complain until something breaks.

---

### Layer 2 — Type hints: labeling what you expect

Python lets you add type hints — annotations that say "this variable SHOULD be this type":

```python
name: str = "Audrey"
session_count: int = 12
is_active: bool = True
```

These hints don't actually enforce anything by themselves. Python just ignores them at runtime. But tools like **Pydantic** (which we'll learn in Lesson 11) use these hints to enforce strict validation.

Think of it this way: the type hint is a label on a box. Python doesn't check the label. Pydantic opens the box and rejects anything that doesn't match.

---

### Layer 3 — Where this appears in the CCP

Every data structure in the CCP platform starts with typed fields. When the JIT Skill Compiler (Launch Manual Ch 07) builds a coaching script, the output schema declares every field with a type hint:

- `coaching_script: str` — the generated text
- `trigger_count: int` — how many psychological triggers are embedded
- `cbcs_score: float` — alignment score between 0.0 and 1.0

If an LLM returns a `trigger_count` of `"twelve"` instead of `12`, the Pydantic validator catches it immediately. Without the type hint, the string `"twelve"` would silently flow through the entire pipeline and corrupt the coaching session.

---

### Layer 4 — Basic operations

The four fundamental types you'll see everywhere:

| Type | What it holds | CCP example |
|------|--------------|-------------|
| `str` | Text | Coach's name, script content, client feedback |
| `int` | Whole numbers | Session count, trigger count, retry attempts |
| `float` | Decimal numbers | CBCS score, confidence percentage, LoRA weight |
| `bool` | True/False | Is session active? Is client onboarded? Is trigger fired? |

You can also combine types:

- `list[str]` → a list of strings (like a list of trigger names)
- `dict[str, float]` → a dictionary mapping names to scores

---

### 🧩 Key questions

1. What happens if you assign `session_count = "twelve"` with no type hint?
2. Why doesn't Python enforce type hints by itself?
3. What CCP component actually enforces them?

### 🎯 Takeaway

Variables hold data. Types describe the data. Type hints declare what you expect. Python doesn't enforce them — but Pydantic does. This is the first building block of every data contract in the platform.

---

## 🧠 Lesson 02: Dictionaries & JSON

### 🎯 Goal

Understand dictionaries as Python's way of organizing data with named keys — and JSON as the universal format that every API, every LLM, and every database speaks.

---

### Layer 1 — What is a dictionary?

A dictionary is a collection of key-value pairs:

```python
coach = {
    "name": "Jean Pierre",
    "clients": 12,
    "active": True
}
```

You access values by their key: `coach["name"]` → `"Jean Pierre"`

Think of it as a labeled filing cabinet. Each drawer has a name (the key) and contains something (the value). Unlike a list, which is just items in order, a dictionary lets you find things by name.

---

### Layer 2 — Nesting and structure

Dictionaries can contain other dictionaries, lists, or any type:

```python
session = {
    "coach_id": "JP-001",
    "client_id": "CL-042",
    "triggers": ["confrontation", "humor", "reflection"],
    "scores": {
        "cbcs_alignment": 0.87,
        "engagement": 0.92
    }
}
```

This is a nested structure. The `"scores"` key contains another dictionary. The `"triggers"` key contains a list. Real-world data is almost always nested like this.

---

### Layer 3 — JSON: the dictionary's twin

JSON (JavaScript Object Notation) looks almost identical to a Python dictionary. In fact, when you receive data from an API or an LLM, it arrives as JSON — which Python converts directly into a dictionary:

```python
import json
raw_response = '{"script": "Hello", "triggers": 3}'
data = json.loads(raw_response)  # now it's a Python dict
```

Every LLM structured output in the CCP pipeline (Launch Manual Ch 09) returns JSON. The FastAPI endpoints (Ch 06) receive JSON from the client and send JSON back. The Neo4j graph queries (Ch 08) return results as dictionaries.

JSON IS the language of the CCP's data flow. If you can't read a nested JSON structure and trace where each value comes from, you can't supervise the platform.

---

### Layer 4 — Common operations

| Operation | Code | What it does |
|-----------|------|-------------|
| Access a value | `session["coach_id"]` | Gets `"JP-001"` |
| Add a new key | `session["duration"] = 45` | Adds duration |
| Check if key exists | `"triggers" in session` | Returns `True` |
| Get with default | `session.get("notes", "none")` | Returns `"none"` if missing |
| Convert to JSON | `json.dumps(session)` | Turns dict into JSON string |

---

### 🧩 Key questions

1. What's the difference between `session["notes"]` and `session.get("notes", "")` when `"notes"` doesn't exist?
2. Why does the CCP use JSON instead of, say, CSV or XML?
3. If an LLM returns malformed JSON (missing a closing brace), what happens when you call `json.loads()`?

### 🎯 Takeaway

Dictionaries organize data by name. JSON is the serialization format that dictionaries travel in. Every API call, every LLM response, every database result in the CCP is a dictionary that arrived as JSON. Learning to read nested structures is not optional — it's how all data moves through the platform.

---

## 🧠 Lesson 03: Functions & Signatures

### 🎯 Goal

Understand functions as reusable blocks of logic that take inputs, do something, and return an output — and see how this exact pattern maps to DSPy Signatures and FastAPI endpoints.

---

### Layer 1 — What is a function?

A function is a named block of code that you can call whenever you need it:

```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

Three parts:
- **Name:** `greet` — what you call it
- **Parameters:** `name: str` — what it needs to work
- **Return type:** `-> str` — what it gives back

This is the fundamental unit of reuse. Instead of writing the same logic 50 times, you write it once and call it 50 times.

---

### Layer 2 — Parameters in depth

Functions can accept different kinds of inputs:

```python
def build_script(
    coach_id: str,
    client_id: str,
    session_number: int = 1,
    use_humor: bool = False
) -> dict:
    ...
```

- `coach_id` and `client_id` are **required** — the function won't run without them
- `session_number` has a **default** value of `1` — optional, falls back to the default
- `use_humor` is a **flag** — changes behavior based on True/False

The signature itself tells you everything about what the function needs and what it produces. You don't even need to read the body to understand the contract.

---

### Layer 3 — Functions in the CCP

This pattern maps directly to two critical CCP components:

**DSPy Signatures** (Launch Manual Ch 07, MCDA DSPy Paper 185/200): A DSPy `Signature` is literally a function signature for an LLM. Instead of writing a prompt, you declare inputs and outputs as typed fields:

```python
class GenerateScript(dspy.Signature):
    """Generate a coaching script for a session."""
    coach_profile: str = dspy.InputField()
    client_state: str = dspy.InputField()
    script: str = dspy.OutputField(desc="The coaching script")
```

Same structure: named inputs, typed outputs, a clear purpose.

**FastAPI endpoints** (Launch Manual Ch 06): Every API route in the CCP is a function decorated with a route:

```python
@app.post("/generate-script")
async def generate_script(request: ScriptRequest) -> ScriptResponse:
    ...
```

Again: inputs (the request), outputs (the response), a clear contract.

---

### Layer 4 — Why signatures matter

The function signature IS the contract. If you look at a function's signature and understand its parameters and return type, you understand what it does without reading the implementation. This is how you supervise agent-generated code — you read the signature, verify the contract, and check that the implementation honors it.

---

### 🧩 Key questions

1. What happens if you call `build_script("JP-001")` without the required `client_id`?
2. Why does DSPy model its AI pipelines as function signatures instead of raw prompts?
3. What does `-> dict` tell you about what the function returns?

### 🎯 Takeaway

Functions package logic into reusable, inspectable contracts. The signature (name + parameters + return type) is the contract. DSPy Signatures and FastAPI endpoints are both applications of this same pattern. If you can read a function signature, you can read any CCP pipeline declaration.

---

## 🧠 Lesson 04: Classes & Inheritance

### 🎯 Goal

Understand classes as blueprints for creating objects — and see how Pydantic's `BaseModel`, DSPy's `Module`, and every CCP data contract is a class.

---

### Layer 1 — What is a class?

A class is a blueprint that describes what an object looks like and what it can do:

```python
class Coach:
    def __init__(self, name: str, specialty: str):
        self.name = name
        self.specialty = specialty
    
    def introduce(self) -> str:
        return f"I'm {self.name}, specializing in {self.specialty}"
```

The class `Coach` is the blueprint. When you write `coach = Coach("Jean Pierre", "leadership")`, you create an **instance** — a specific coach built from that blueprint.

Think of it this way: the class is the architectural drawing. The instance is the actual building. You can build many buildings from one drawing.

---

### Layer 2 — `__init__` and `self`

Two things confuse every beginner:

**`__init__`** is the constructor — the code that runs when you create a new instance. It sets up the initial state.

**`self`** is how the object refers to itself. Every method in a class takes `self` as its first parameter. It's how the object accesses its own data:

```python
self.name = name  # "store this name on myself"
```

You never pass `self` when calling — Python handles it automatically:

```python
coach = Coach("Audrey", "resilience")
coach.introduce()  # Python passes 'self' behind the scenes
```

---

### Layer 3 — Inheritance: building on blueprints

Inheritance lets you create a new class based on an existing one:

```python
class PremiumCoach(Coach):
    def __init__(self, name: str, specialty: str, tier: str):
        super().__init__(name, specialty)
        self.tier = tier
```

`PremiumCoach` inherits everything from `Coach` and adds a `tier` attribute. `super().__init__()` calls the parent's constructor.

This is critical because every data contract in the CCP is built through inheritance:

- **Pydantic `BaseModel`** (Launch Manual Ch 07): Every data schema inherits from `BaseModel`. That's what gives it automatic validation, serialization, and type enforcement.
- **DSPy `Module`** (Launch Manual Ch 07): Every AI pipeline step inherits from `dspy.Module`. That's what gives it the `forward()` method and optimization hooks.

You don't write `BaseModel` or `Module` from scratch. You inherit from them. Your job is to understand what the parent class provides so you know what your subclass gets for free.

---

### Layer 4 — Composition vs inheritance

Sometimes you don't inherit — you compose. A class can CONTAIN another class:

```python
class CoachingSession:
    def __init__(self, coach: Coach, client_id: str):
        self.coach = coach
        self.client_id = client_id
```

Here, `CoachingSession` doesn't inherit from `Coach` — it contains a `Coach` instance. This is the pattern used for building complex CCP objects that combine multiple data models.

---

### 🧩 Key questions

1. Why does `Pydantic BaseModel` give your class automatic validation just by inheriting it?
2. What does `super().__init__()` actually do?
3. When would you use composition (containing a class) instead of inheritance (extending a class)?

### 🎯 Takeaway

Classes are blueprints. Instances are objects built from those blueprints. Inheritance lets you extend existing blueprints — this is how Pydantic and DSPy work. Every data contract in the CCP is a class that inherits from a framework base class. If you understand classes, you understand how every schema, module, and agent contract in the platform is structured.

---

## 🧠 Lesson 05: Decorators & Validators

### 🎯 Goal

Understand decorators as wrappers that modify or extend a function's behavior — and see how FastAPI routes and Pydantic validators are both built on this exact pattern.

---

### Layer 1 — What is a decorator?

A decorator is a function that wraps another function to add behavior:

```python
@log_calls
def process_session(client_id: str) -> dict:
    ...
```

The `@log_calls` line means: "before running `process_session`, first run it through `log_calls`, which might log the call, time it, or add some extra logic."

You can think of it as a stamp on a document. The document (function) is the same, but the stamp adds a guarantee: "this was reviewed," "this was timed," "this is authorized."

---

### Layer 2 — How decorators actually work

Under the hood, `@decorator` is just syntactic sugar:

```python
@log_calls
def process_session(client_id: str):
    ...

# is exactly the same as:
process_session = log_calls(process_session)
```

The decorator takes a function as input and returns a new function (usually with added behavior). You don't need to write decorators yourself — but you need to recognize them when you see them, because the CCP is full of them.

---

### Layer 3 — Decorators in the CCP

Two critical uses:

**FastAPI route decorators** (Launch Manual Ch 06): Every API endpoint is a function wrapped with a route decorator:

```python
@app.post("/generate-script")
async def generate_script(request: ScriptRequest) -> ScriptResponse:
    ...
```

The `@app.post("/generate-script")` decorator registers this function as the handler for POST requests to that URL. Without the decorator, the function exists but FastAPI doesn't know about it — no requests would reach it.

**Pydantic validators** (Launch Manual Ch 07): Field validators enforce rules on specific fields:

```python
class ScriptOutput(BaseModel):
    trigger_count: int
    
    @field_validator("trigger_count")
    @classmethod
    def must_be_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Script must have at least 1 trigger")
        return v
```

The `@field_validator("trigger_count")` decorator tells Pydantic: "run this check every time `trigger_count` is set." If the LLM generates a script with 0 triggers, this validator catches it immediately.

---

### Layer 4 — Why decorators matter for supervision

Decorators are the enforcement layer. They're how the CCP attaches rules to behavior without cluttering the core logic. When you read CCP code, the decorators tell you:

- What route handles this request (`@app.post`, `@app.get`)
- What validation runs on this field (`@field_validator`)
- What dependencies are injected (`@Depends`)
- What authorization is required (`@require_auth`)

---

### 🧩 Key questions

1. What happens if you write a FastAPI function without the `@app.post()` decorator?
2. Why use `@field_validator` instead of putting an `if` check inside the function body?
3. Can a function have multiple decorators stacked on top of each other?

### 🎯 Takeaway

Decorators wrap functions to add behavior — routes, validation, logging, authorization. They are the enforcement stamps of the CCP. You read them to understand what rules are attached to each function. You don't write them, but you need to recognize what each decorator does when reviewing agent-generated code.

---

# Phase 2: The Data Pipeline (L06 – L10)

> Now you know the building blocks: variables, dictionaries, functions, classes, decorators. Phase 2 teaches you how data actually MOVES — through lists, files, async streams, error handlers, and config systems. This is where Python stops being a language and starts being a pipeline.

---

## 🧠 Lesson 06: Lists, Comprehensions & Generators

### 🎯 Goal

Understand lists as ordered collections and comprehensions as a concise way to transform them — then see how generators enable memory-efficient streaming for large datasets.

---

### Layer 1 — Lists: ordered collections

A list is a sequence of items, accessed by position:

```python
triggers = ["confrontation", "humor", "reflection"]
triggers[0]  # → "confrontation"
triggers.append("empathy")  # adds to the end
len(triggers)  # → 4
```

Lists are everywhere: arrays of triggers, lists of client IDs, batches of coaching scripts. Any time you have "more than one of something," you use a list.

---

### Layer 2 — Comprehensions: transform in one line

A list comprehension is a compact way to build a new list from an existing one:

```python
scores = [0.85, 0.32, 0.91, 0.44, 0.78]
passing = [s for s in scores if s >= 0.7]
# → [0.85, 0.91, 0.78]
```

Read it as: "give me every `s` from `scores` where `s` is at least 0.7." It replaces a 4-line for-loop with 1 readable line.

You can also transform:

```python
labels = [f"score_{i}" for i in range(5)]
# → ["score_0", "score_1", "score_2", "score_3", "score_4"]
```

---

### Layer 3 — Generators: streaming without loading everything

A generator produces values one at a time instead of creating the entire list in memory:

```python
def stream_scripts(batch_size: int = 8):
    for i in range(batch_size):
        yield generate_one_script(i)
```

`yield` is the key word. Instead of `return` (which gives everything at once), `yield` gives one value, pauses, gives the next, pauses, and so on.

This matters in the CCP because batch processing (generating 8 coaching scripts per week per client, Launch Manual Ch 10) can't load all scripts into memory simultaneously. Generators let you process them one by one.

---

### Layer 4 — Slicing and enumeration

Two operations you'll see constantly:

```python
triggers = ["a", "b", "c", "d", "e"]
triggers[1:3]    # → ["b", "c"] — slice from index 1 to 3
triggers[-1]     # → "e" — last item
triggers[::-1]   # → ["e", "d", "c", "b", "a"] — reversed
```

```python
for i, trigger in enumerate(triggers):
    print(f"Trigger {i}: {trigger}")
```

`enumerate` gives you both the index and the value — essential when you need to know the position in a sequence.

---

### 🧩 Key questions

1. What's the difference between `return` and `yield`?
2. Why would the CCP use a generator instead of building a complete list of 8 scripts?
3. What does `scores[2:]` give you?

### 🎯 Takeaway

Lists hold ordered data. Comprehensions transform lists concisely. Generators stream data without loading everything into memory. In the CCP, you'll see lists of triggers, comprehensions filtering scores, and generators streaming batch outputs. These are the pipes that data flows through.

---

## 🧠 Lesson 07: File I/O & Pathlib

### 🎯 Goal

Understand how to read and write files in Python — and see how the CCP manages agent workspaces, session logs, LoRA adapter files, and configuration directories.

---

### Layer 1 — Reading and writing files

The simplest way to read a file:

```python
with open("config.json", "r") as f:
    content = f.read()
```

And write:

```python
with open("output.txt", "w") as f:
    f.write("Session complete")
```

The `with` block ensures the file is properly closed after you're done, even if an error occurs. Always use `with` — never `open()` without it.

---

### Layer 2 — Pathlib: modern file paths

Instead of manipulating file paths as raw strings, Python's `pathlib` gives you a proper object:

```python
from pathlib import Path

workspace = Path("agents/session_042")
config_file = workspace / "config.json"  # joins paths with /
config_file.exists()         # → True or False
config_file.read_text()      # reads the whole file
config_file.write_text("{}")  # writes to the file
```

Why `Path` instead of strings? Because path operations (`/`, `.parent`, `.suffix`, `.stem`) work across operating systems. No more worrying about `\` vs `/`.

---

### Layer 3 — Files in the CCP

The CCP uses file I/O in several critical places:

**Agent workspaces** (Launch Manual Ch 06): When the agentic harness runs a task, it creates a workspace directory. The agent reads files, writes outputs, and logs its actions. The operator needs to understand how these files are organized to debug stuck agents.

**LoRA adapter files** (Launch Manual Ch 03): Fine-tuned model weights are stored as files (`.safetensors`). Loading a LoRA adapter means reading a file and merging it with the base model. The file path must be correct or the model loads without the fine-tuning — silently reverting to generic behavior.

**Session logs**: Every coaching session generates logs — both for debugging and for CBCS alignment scoring. These are typically JSONL files (one JSON object per line).

---

### Layer 4 — Directory traversal

Sometimes you need to process all files in a directory:

```python
workspace = Path("agents/session_042")
for file in workspace.glob("*.json"):
    data = json.loads(file.read_text())
    process(data)
```

`glob("*.json")` finds all JSON files. `glob("**/*.json")` finds them recursively in subdirectories too.

---

### 🧩 Key questions

1. What happens if you use `open()` without `with` and an error occurs halfway through?
2. Why does the CCP use `.safetensors` files for LoRA adapters instead of, say, JSON?
3. What does `Path("a/b/c").parent` return?

### 🎯 Takeaway

Files are how data persists between sessions. `pathlib` makes file operations clean and cross-platform. The CCP uses files for agent workspaces, model weights, session logs, and configuration. Understanding file I/O is essential for debugging any platform component that reads from or writes to disk.

---

## 🧠 Lesson 08: Async/Await & Concurrency

### 🎯 Goal

Understand async/await as Python's way of doing multiple things "at the same time" without threads — and see why the CCP's real-time coaching sessions depend entirely on this pattern.

---

### Layer 1 — The problem: waiting

Normal (synchronous) code does one thing at a time:

```python
result_1 = call_llm("prompt 1")   # waits 2 seconds
result_2 = call_llm("prompt 2")   # waits 2 more seconds
# total: 4 seconds
```

If the first call takes 2 seconds, the program just sits there waiting. Then it waits again for the second call. That's 4 seconds of wall time for 2 independent tasks.

---

### Layer 2 — Async: don't wait, schedule

Async code says "start this task, but don't block — go do something else while waiting":

```python
import asyncio

async def call_llm(prompt: str) -> str:
    # this is non-blocking — Python can do other things while waiting
    response = await external_api_call(prompt)
    return response

async def main():
    result_1, result_2 = await asyncio.gather(
        call_llm("prompt 1"),
        call_llm("prompt 2")
    )
    # total: ~2 seconds (both ran concurrently)
```

Three keywords to know:
- `async def` — declares a function that can be paused and resumed
- `await` — pauses this function until the result comes back, letting other tasks run
- `asyncio.gather()` — runs multiple async tasks concurrently

---

### Layer 3 — Why the CCP needs this

The CCP's real-time coaching sessions (Launch Manual Ch 06) run over WebSocket connections via Pipecat. During a single coaching session, the platform might need to:

1. Stream audio from the client
2. Send text to the LLM for script generation
3. Query Neo4j for the client's coaching history
4. Check the CBCS alignment score
5. Stream the response back to the client

Without async, each of these happens one after another — the client experiences lag. With async, they happen concurrently — the experience feels real-time.

FastAPI is async by default. Every endpoint handler is an `async def` function. If you see a CCP endpoint that's NOT async, that's a problem — it blocks the entire server while waiting for one response.

---

### Layer 4 — Event loops

All async code runs inside an **event loop** — a scheduler that manages which tasks run when. You rarely interact with the event loop directly, but understanding it matters:

- The loop picks up a task
- Runs it until it hits an `await`
- Switches to another task
- Comes back when the first task's result is ready

This is cooperative multitasking — tasks voluntarily yield control at `await` points.

---

### 🧩 Key questions

1. What's the difference between `await call_llm()` and just `call_llm()`?
2. Why would a synchronous FastAPI endpoint degrade the entire server's performance?
3. What does `asyncio.gather()` do that two sequential `await` calls don't?

### 🎯 Takeaway

Async lets Python handle multiple waiting tasks concurrently — not in parallel (that's threads), but by switching between tasks at `await` points. The CCP's real-time coaching sessions, WebSocket streams, and concurrent LLM calls all depend on this pattern. If you see `async def` in CCP code, you know the function is designed to run without blocking.

---

## 🧠 Lesson 09: Error Handling & Exceptions

### 🎯 Goal

Understand how Python signals that something went wrong — and how the CCP uses structured error handling to build resilient pipelines that recover instead of crashing.

---

### Layer 1 — What is an exception?

When something goes wrong in Python, it raises an **exception** — an object that represents the error:

```python
result = int("hello")  # → ValueError: invalid literal
```

If you don't handle the exception, the program crashes. That's fine for a script, but unacceptable for a live coaching session serving a paying client.

---

### Layer 2 — try/except: catching errors

The `try/except` block lets you catch exceptions and decide what to do:

```python
try:
    data = json.loads(raw_response)
except json.JSONDecodeError:
    data = {"error": "Invalid JSON from LLM"}
```

You can catch specific exceptions (recommended) or catch everything (dangerous — it hides bugs):

```python
# BAD — hides ALL errors, including ones you didn't expect
try:
    risky_operation()
except Exception:
    pass  # silently swallows everything
```

The `finally` block runs no matter what — useful for cleanup:

```python
try:
    file = open("log.txt")
    process(file)
finally:
    file.close()  # runs even if process() crashes
```

---

### Layer 3 — Errors in the CCP

The CCP encounters errors constantly — LLMs return invalid JSON, APIs time out, Neo4j queries return empty results. The architecture doesn't try to prevent all errors; it handles them gracefully:

**Pydantic `ValidationError`** (Launch Manual Ch 07): When an LLM generates output that doesn't match the expected schema, Pydantic raises a `ValidationError`. The pipeline catches this and retries the LLM call — typically up to 3 times before falling back to a default response.

**DSPy retry loops** (Launch Manual Ch 07): DSPy modules have built-in retry behavior. When output validation fails, the module re-runs the LLM with adjusted context. This is error handling baked into the AI pipeline.

**`__error.md` signaling** (Pi Harness): The Pi agentic harness uses a file-based error protocol. When a subprocess fails, it writes an `__error.md` file that the orchestrator reads to decide whether to retry, escalate, or abort.

---

### Layer 4 — Custom exceptions

You can define your own exception types for specific error categories:

```python
class ScriptValidationError(Exception):
    def __init__(self, field: str, reason: str):
        self.field = field
        self.reason = reason
        super().__init__(f"{field}: {reason}")
```

Custom exceptions let a pipeline communicate WHAT went wrong, not just THAT something went wrong.

---

### 🧩 Key questions

1. Why is `except Exception: pass` dangerous?
2. What does the CCP do when an LLM returns invalid JSON — crash or retry?
3. When would you define a custom exception instead of using a built-in one?

### 🎯 Takeaway

Exceptions are Python's error signaling system. `try/except` catches them. The CCP never lets an error crash silently — it catches, retries, and falls back. Understanding error handling is essential because every production pipeline has a failure path, and you need to know what happens when the LLM returns garbage.

---

## 🧠 Lesson 10: Environment Variables & Config

### 🎯 Goal

Understand how Python reads configuration from the environment — and why the CCP never hardcodes API keys, model endpoints, or runtime settings in source code.

---

### Layer 1 — What is an environment variable?

An environment variable is a value stored outside your code, in the system's environment:

```python
import os
api_key = os.environ["OPENAI_API_KEY"]
```

Why outside the code? Because:
- API keys in source code get committed to Git → security breach
- Different environments (dev, staging, production) need different configs
- You can change behavior without modifying code

---

### Layer 2 — `.env` files and python-dotenv

In practice, you store environment variables in a `.env` file:

```
NIM_ENDPOINT=https://api.nvidia.com/v1
MODEL_NAME=qwen-3.5-72b
MAX_RETRIES=3
CBCS_THRESHOLD=0.7
```

And load them with `python-dotenv`:

```python
from dotenv import load_dotenv
load_dotenv()  # reads .env file into environment

endpoint = os.environ["NIM_ENDPOINT"]
max_retries = int(os.environ.get("MAX_RETRIES", "3"))
```

Note: `os.environ.get("KEY", "default")` provides a fallback if the variable isn't set. Always use this for optional configs.

---

### Layer 3 — Config in the CCP

The CCP's configuration layer manages:

**API keys and endpoints** (Launch Manual Ch 05): NIM endpoints, OpenAI fallback keys, Neo4j credentials, Redis connection strings — all stored as environment variables, never in code.

**Model routing configs**: Which model handles which task (Qwen-3.5 for reasoning, Gemma 4 for creative generation) is configured through environment variables, not hardcoded in the routing logic.

**RLM budget guardrails** (RAW.works ypi architecture): The maximum number of recursive reasoning turns, token budgets, and timeout limits are all configurable. This lets you tighten or loosen the model's reasoning depth without deploying new code.

---

### Layer 4 — Secrets vs config

Not all environment variables are equal:

| Category | Examples | Treatment |
|----------|----------|-----------|
| Secrets | API keys, database passwords | Never logged, never printed, rotated regularly |
| Config | Model names, retry counts, thresholds | Can be logged for debugging, safe to share |
| Feature flags | `ENABLE_HUMOR=true` | Controls feature availability at runtime |

The CCP treats secrets with strict isolation — they're loaded once at startup and never exposed in logs or error messages.

---

### 🧩 Key questions

1. What happens if you deploy to production and forget to set `NIM_ENDPOINT`?
2. Why use `os.environ.get("KEY", "default")` instead of `os.environ["KEY"]`?
3. Should `CBCS_THRESHOLD=0.7` be treated as a secret or as config?

### 🎯 Takeaway

Config and secrets live outside the code, in environment variables. `.env` files make local development convenient. The CCP uses environment variables for API keys, model routing, and runtime guardrails. Never hardcode credentials, never log secrets, and always provide sensible defaults for optional config.

---

# Phase 3: The CCP Toolkit (L11 – L16)

> You now know Python fundamentals and data pipeline mechanics. Phase 3 introduces the actual tools the CCP is built with — Pydantic for data contracts, FastAPI for HTTP endpoints, DSPy for AI pipelines, PyTorch for model operations, HuggingFace for model loading, and Neo4j for graph queries. Each lesson is a tool you'll encounter every time you read CCP code.

---

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
from pydantic import field_validator

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

---

## 🧠 Lesson 12: FastAPI — The HTTP Backbone

### 🎯 Goal

Understand FastAPI as the web framework that connects the CCP to the outside world — receiving requests, routing them to the right pipeline, and returning validated responses.

---

### Layer 1 — What is FastAPI?

FastAPI is a Python web framework for building APIs. An API is an interface — it lets external clients (the coaching app, the dashboard, the mobile app) communicate with the CCP backend.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}
```

That's a complete API endpoint. When someone sends a GET request to `/health`, they get back `{"status": "ok"}`.

---

### Layer 2 — Request and response models

FastAPI works hand-in-hand with Pydantic (Lesson 11). You define what the client sends and what they get back using Pydantic models:

```python
class ScriptRequest(BaseModel):
    coach_id: str
    client_id: str
    session_number: int = Field(ge=1)

class ScriptResponse(BaseModel):
    script_text: str
    trigger_count: int
    cbcs_score: float

@app.post("/generate-script")
async def generate_script(request: ScriptRequest) -> ScriptResponse:
    # process the request...
    return ScriptResponse(
        script_text="...",
        trigger_count=5,
        cbcs_score=0.87
    )
```

FastAPI automatically validates the incoming request against `ScriptRequest`. If the client sends `{"session_number": -1}`, FastAPI returns a 422 error before the function even runs.

---

### Layer 3 — Dependency injection

FastAPI's `Depends()` system lets you inject shared logic into endpoints:

```python
from fastapi import Depends

async def get_db_session():
    session = await connect_to_neo4j()
    yield session
    await session.close()

@app.post("/query-history")
async def query_history(
    client_id: str,
    db = Depends(get_db_session)
):
    return await db.query(client_id)
```

`Depends(get_db_session)` means: "before running this endpoint, create a database session. After the endpoint finishes, close it." This is how the CCP manages database connections, authentication, and shared resources (Launch Manual Ch 06).

---

### Layer 4 — WebSocket endpoints

For real-time coaching sessions, the CCP uses WebSocket endpoints instead of standard HTTP:

```python
@app.websocket("/coaching-session")
async def coaching_session(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        response = await process_coaching_input(data)
        await websocket.send_text(response)
```

WebSockets maintain a persistent connection — unlike HTTP where each request is independent. This is how Pipecat streams audio and text in real-time during coaching sessions.

---

### 🧩 Key questions

1. What happens if a client sends a POST request to a `@app.get()` endpoint?
2. Why use `Depends()` instead of just calling `connect_to_neo4j()` inside the function?
3. When would you use a WebSocket endpoint instead of a regular HTTP endpoint?

### 🎯 Takeaway

FastAPI is the CCP's front door. It receives requests, validates them with Pydantic, routes them to the right pipeline, and returns validated responses. Dependency injection keeps the code clean. WebSocket endpoints enable real-time coaching. If Pydantic is the QA Department, FastAPI is the front desk — nothing enters the factory without going through it.

---

## 🧠 Lesson 13: DSPy — Declarative AI Pipelines

### 🎯 Goal

Understand DSPy as the framework that replaces manual prompt engineering with typed, optimizable AI pipeline declarations — and see how the CCP uses it to build reliable, repeatable AI operations.

---

### Layer 1 — The problem with prompt engineering

Traditional AI development means writing prompts by hand and hoping the LLM does what you want:

```
"You are a helpful coaching assistant. Given the client's emotional state, 
generate a coaching script that includes at least 3 psychological triggers..."
```

This is fragile. Change one word and the output changes unpredictably. There's no validation, no optimization, no way to systematically improve.

DSPy replaces this with typed Python declarations — function signatures for LLMs.

---

### Layer 2 — Signatures and Modules

A DSPy `Signature` declares what the LLM should receive and produce:

```python
import dspy

class GenerateScript(dspy.Signature):
    """Generate a coaching script for the given session context."""
    coach_profile: str = dspy.InputField()
    client_state: str = dspy.InputField()
    script: str = dspy.OutputField(desc="The coaching script text")
    trigger_count: int = dspy.OutputField(desc="Number of triggers embedded")
```

A DSPy `Module` uses the signature inside a processing pipeline:

```python
class ScriptGenerator(dspy.Module):
    def __init__(self):
        self.generate = dspy.Predict(GenerateScript)
    
    def forward(self, coach_profile: str, client_state: str):
        return self.generate(
            coach_profile=coach_profile,
            client_state=client_state
        )
```

Notice: it looks like a Python class with a `forward()` method — because it IS a Python class. Everything from Lesson 04 (classes, inheritance) applies directly.

---

### Layer 3 — DSPy in the CCP

The CCP's JIT Skill Compiler (Launch Manual Ch 07) uses DSPy to compile all 76 coaching skills into optimized pipelines. Instead of handwriting 76 prompts, each skill is a DSPy `Module` with a typed `Signature`.

Why this matters:
- **Type safety**: `OutputField` declarations match Pydantic models — if the LLM returns the wrong type, DSPy catches it
- **Optimization**: DSPy can automatically tune the prompt for each model (Qwen-3.5 vs Gemma 4) without manual rewriting
- **Composability**: Modules can chain — one module's output feeds into the next module's input

---

### Layer 4 — ChainOfThought

DSPy provides built-in reasoning patterns:

```python
self.reason = dspy.ChainOfThought(GenerateScript)
```

`ChainOfThought` automatically adds a reasoning step before the final output — the LLM shows its work. This is useful for complex coaching decisions where you want to see WHY the model chose a particular approach.

---

### 🧩 Key questions

1. What's the difference between a DSPy `Signature` and a regular Python function signature?
2. Why use DSPy instead of just writing prompts in strings?
3. What does `dspy.OutputField(desc="...")` actually do?

### 🎯 Takeaway

DSPy turns AI pipelines into typed, optimizable Python programs. Signatures declare inputs and outputs. Modules compose into pipelines. The CCP uses DSPy for all 76 coaching skills because it provides type safety, automatic optimization, and composability — things raw prompt engineering can never deliver.

---

## 🧠 Lesson 14: PyTorch Tensor Literacy

### 🎯 Goal

Understand tensors as multi-dimensional arrays that all neural networks operate on — and see enough PyTorch to read model loading, LoRA adapter injection, and activation steering operations.

---

### Layer 1 — What is a tensor?

A tensor is just a multi-dimensional array of numbers:

```python
import torch

# 1D tensor (vector)
v = torch.tensor([1.0, 2.0, 3.0])

# 2D tensor (matrix)
m = torch.tensor([[1.0, 2.0], [3.0, 4.0]])

# Shape tells you the dimensions
v.shape  # → torch.Size([3])
m.shape  # → torch.Size([2, 2])
```

If you completed the Linear Algebra course, you already know what these are — vectors and matrices. PyTorch tensors are Python's way of representing them, with GPU acceleration built in.

---

### Layer 2 — Why `.shape` matters

Every operation in a neural network depends on tensors having compatible shapes. If shapes don't match, the operation fails:

```python
a = torch.tensor([[1, 2, 3]])     # shape: (1, 3)
b = torch.tensor([[4], [5], [6]])  # shape: (3, 1)
result = a @ b                      # matrix multiply → shape: (1, 1)
```

When reading CCP model code, you'll constantly check shapes to verify that layers connect correctly. A LoRA adapter with the wrong dimensions won't merge — `.shape` is your first diagnostic tool.

---

### Layer 3 — Model loading and LoRA

The most common PyTorch operations you'll see in the CCP:

**Loading a model** (Launch Manual Ch 03):
```python
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen3.5-72B")
```

**Loading a LoRA adapter**:
```python
from peft import PeftModel
model = PeftModel.from_pretrained(model, "path/to/voice_dna_adapter")
```

**Checking parameters**:
```python
for name, param in model.named_parameters():
    print(name, param.shape, param.requires_grad)
```

`requires_grad` tells you whether this parameter is being trained. In LoRA, most parameters have `requires_grad=False` (frozen) and only the adapter parameters are `True` (trainable).

---

### Layer 4 — `.eval()` vs `.train()`

Models have two modes:

```python
model.eval()   # inference mode — no gradient tracking, deterministic
model.train()  # training mode — tracks gradients, may use dropout
```

In production (CCP coaching sessions), the model MUST be in `.eval()` mode. If it's accidentally in `.train()` mode, behavior becomes non-deterministic — dropout layers randomly zero out neurons, producing inconsistent coaching responses.

---

### 🧩 Key questions

1. What does `torch.Size([4, 768])` tell you about a tensor?
2. Why would `requires_grad=False` on 99% of a model's parameters be a good thing?
3. What happens if you forget `model.eval()` during a live coaching session?

### 🎯 Takeaway

Tensors are the data format of neural networks. `.shape` tells you dimensions. `.requires_grad` tells you what's trainable. `.eval()` puts the model in production mode. You don't need to build models, but you need to read model-loading code and understand whether the LoRA adapter shapes match, the right parameters are frozen, and the model is in the right mode.

---

## 🧠 Lesson 15: HuggingFace & Transformers

### 🎯 Goal

Understand HuggingFace as the library ecosystem for loading, configuring, and running transformer models — and see how the CCP uses it to load Qwen, Gemma, and other models with LoRA adapters.

---

### Layer 1 — What is HuggingFace?

HuggingFace is not one tool — it's an ecosystem:

- **`transformers`** — the library for loading and running models
- **`tokenizers`** — converts text to token IDs (numbers the model understands)
- **`peft`** — Parameter-Efficient Fine-Tuning (LoRA adapters)
- **Hub** — a registry of pre-trained models you can download

Think of it as the model warehouse. You order a model by name, it arrives pre-built, and you configure it for your specific use case.

---

### Layer 2 — Loading a model and tokenizer

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen3.5-72B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)
```

The `Auto` classes automatically detect the model type and load the right architecture. `torch_dtype=torch.float16` loads the model in half-precision (uses half the GPU memory). `device_map="auto"` distributes the model across available GPUs.

---

### Layer 3 — Tokenization

Before text enters a model, it must be converted to tokens:

```python
text = "Generate a coaching script for resilience training"
tokens = tokenizer(text, return_tensors="pt")
# tokens["input_ids"] → tensor([[15496, 257, 13, ...]])
```

Each word (or sub-word) becomes a number. The model processes numbers, not text. After generation, you convert back:

```python
output = model.generate(**tokens, max_new_tokens=200)
decoded = tokenizer.decode(output[0], skip_special_tokens=True)
```

Understanding tokenization matters because token count determines cost, context window usage, and generation quality.

---

### Layer 4 — LoRA with PEFT

The CCP fine-tunes base models with LoRA adapters for Voice DNA (Launch Manual Ch 03):

```python
from peft import PeftModel, PeftConfig

config = PeftConfig.from_pretrained("adapters/voice_dna_coach_jp")
base_model = AutoModelForCausalLM.from_pretrained(config.base_model_name)
model = PeftModel.from_pretrained(base_model, "adapters/voice_dna_coach_jp")
```

The LoRA adapter is a small file (~50-200 MB) that modifies the base model's behavior without changing its core weights. Each coach can have their own adapter — same base model, different personality.

---

### 🧩 Key questions

1. Why use `AutoModelForCausalLM` instead of manually specifying the model class?
2. What does `torch_dtype=torch.float16` do and why is it important?
3. If a coach's LoRA adapter file is missing, what model does the system load?

### 🎯 Takeaway

HuggingFace is the CCP's model warehouse. `transformers` loads models. `tokenizers` converts text to numbers. `peft` applies LoRA adapters. You need to understand model loading, tokenization, and adapter injection to verify that the right model with the right fine-tuning is running for each coaching session.

---

## 🧠 Lesson 16: Neo4j & Graph Queries (Cypher)

### 🎯 Goal

Understand Neo4j as the graph database that stores coaching relationships, client states, and CA11 rules — and learn enough Cypher query language to read the CCP's Context Premise engine.

---

### Layer 1 — Why a graph database?

Relational databases (SQL) store data in tables. Graph databases store data as **nodes** and **relationships**:

```
(Coach:JP) --[COACHES]--> (Client:042)
(Client:042) --[HAS_STATE]--> (State:resilience_building)
(State:resilience_building) --[REQUIRES]--> (Trigger:confrontation)
```

This structure is natural for coaching relationships. A client has a state, a state requires triggers, triggers connect to skills, skills map to voice DNA profiles. These are all relationships — and graphs represent relationships natively.

---

### Layer 2 — Cypher basics

Cypher is Neo4j's query language. It reads like ASCII art:

```cypher
MATCH (c:Coach {name: "Jean Pierre"})-[:COACHES]->(client:Client)
RETURN client.name, client.session_count
```

Read it as: "Find the Coach node named Jean Pierre, follow the COACHES relationship to Client nodes, and return their names and session counts."

Key operations:

```cypher
// Create a node
CREATE (s:Session {coach_id: "JP", cbcs_score: 0.87})

// Create a relationship
MATCH (c:Client {id: "042"}), (s:Session {id: "S-001"})
CREATE (c)-[:ATTENDED]->(s)

// Update a property
MATCH (s:Session {id: "S-001"})
SET s.feedback = "Positive"

// Find connected data
MATCH (c:Client)-[:ATTENDED]->(s:Session)-[:USED]->(t:Trigger)
WHERE c.id = "042"
RETURN t.name, count(t) as usage_count
ORDER BY usage_count DESC
```

---

### Layer 3 — Neo4j in the CCP

The CCP uses Neo4j as the **Context Premise Engine** (Launch Manual Ch 08). This is the graph that stores ALL coaching state:

**Client profiles**: Every client is a node with properties (session count, emotional state, CBCS score history).

**Coaching history**: Every session is a node connected to the client, the coach, and the triggers used. This lets the platform query: "What triggers have been most effective for this client?"

**CA11 rules** (Launch Manual Ch 04): The coaching interaction rules (Socratic questioning, empathy, confrontation timing) are stored as relationship constraints in the graph. The JIT Skill Compiler queries these rules before generating a script.

**Voice DNA mapping**: Each coach's personality profile is a graph node connected to their LoRA adapter configuration, their preferred trigger sequences, and their humor style parameters.

---

### Layer 4 — Python + Neo4j

In the CCP, Cypher queries are wrapped in Python functions:

```python
from neo4j import AsyncGraphDatabase

async def get_client_triggers(driver, client_id: str) -> list[dict]:
    async with driver.session() as session:
        result = await session.run(
            "MATCH (c:Client {id: $cid})-[:RESPONDED_TO]->(t:Trigger) "
            "RETURN t.name, t.effectiveness ORDER BY t.effectiveness DESC",
            cid=client_id
        )
        return [record.data() async for record in result]
```

Notice: the Cypher query is a string inside Python. Parameter binding (`$cid`) prevents injection attacks. The result comes back as dictionaries — which then get validated through Pydantic models (Lesson 11).

---

### 🧩 Key questions

1. Why does the CCP use a graph database instead of a regular SQL database?
2. What does `MATCH (a)-[:RELATIONSHIP]->(b)` read as in plain English?
3. Why use `$cid` parameter binding instead of f-string formatting in Cypher queries?

### 🎯 Takeaway

Neo4j stores the CCP's coaching state as a graph of nodes and relationships. Cypher queries navigate this graph. The Context Premise Engine uses it to know everything about a client before generating a coaching script. This is where all the platform's memory lives — coaching history, trigger effectiveness, CA11 rules, voice DNA mappings. If you can read a Cypher query, you can understand what context the AI has access to.

---

# Phase 4: The Agentic Harness (L17 – L20)

> These final lessons cover the execution engine — how the CCP actually RUNS commands, streams results, loops through agent turns, and parses LLM output. This phase is modeled on the `pi-mono` architecture by Mario Zechner, which is the blueprint for the CCP's agentic harness (Launch Manual Ch 06).

---

## 🧠 Lesson 17: Subprocesses & Shell Execution

### 🎯 Goal

Understand how Python runs external commands (shell commands, scripts, system tools) — and see how the CCP's agentic harness uses subprocesses to execute real actions on the operating system.

---

### Layer 1 — What is a subprocess?

Python can run external programs — just like you'd type a command in the terminal:

```python
import subprocess

result = subprocess.run(
    ["ls", "-la", "/workspace"],
    capture_output=True,
    text=True,
    timeout=30
)

print(result.stdout)   # the command's output
print(result.returncode)  # 0 = success, non-zero = error
```

`subprocess.run()` starts a program, waits for it to finish, and gives you the output. Three things matter: `stdout` (what the program printed), `stderr` (error messages), and `returncode` (did it succeed?).

---

### Layer 2 — Why subprocesses?

LLMs generate text. They can't actually DO anything — they can't create files, install packages, run tests, or deploy code. The agentic harness bridges this gap:

1. LLM generates a command (text)
2. Harness validates the command (safety check)
3. Harness executes it via `subprocess.run()`
4. Harness captures the output
5. Output is fed back to the LLM for the next step

This is the `bash` tool in the Pi architecture — the mechanism that gives the LLM "hands."

---

### Layer 3 — Subprocesses in the CCP

The CCP's agentic harness (Launch Manual Ch 06, modeled on `pi-mono`) uses subprocesses for:

**Agent task execution**: When the harness needs to run a Python script, execute a database migration, or validate a deployment — it spawns a subprocess. The agent never runs code in its own process; it always isolates execution.

**Timeout enforcement**: Every subprocess has a timeout. If a command hangs (infinite loop, network timeout, deadlock), the timeout kills it and the harness logs the failure:

```python
try:
    result = subprocess.run(cmd, timeout=60, capture_output=True, text=True)
except subprocess.TimeoutExpired:
    log_error("Command timed out after 60 seconds")
```

**Sandboxing**: The harness controls WHICH commands the agent can run. Destructive commands (rm -rf, DROP TABLE) are blocked before execution — this is the safety boundary.

---

### Layer 4 — `Popen` for streaming

`subprocess.run()` waits for the command to finish before returning output. For long-running commands, you use `Popen` to stream output in real-time:

```python
process = subprocess.Popen(
    ["python", "train_model.py"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

for line in process.stdout:
    print(f"[TRAINING] {line.strip()}")
```

This is how the harness gives the operator visibility into long-running operations — you see each line as it's produced, not just the final result.

---

### 🧩 Key questions

1. Why does the harness run commands in a subprocess instead of using `os.system()` or `exec()`?
2. What does `returncode = 0` mean? What about `returncode = 1`?
3. Why is a timeout on every subprocess non-negotiable in production?

### 🎯 Takeaway

Subprocesses are how Python executes external programs. `subprocess.run()` for simple cases, `Popen` for streaming. The agentic harness uses subprocesses as the bridge between LLM-generated instructions and real-world execution. Timeouts prevent hangs. Sandboxing prevents destruction. If you can read subprocess code, you can understand how the agent actually does things.

---

## 🧠 Lesson 18: Generators & JSONL Event Streaming

### 🎯 Goal

Understand how the CCP streams structured events between the agentic harness and the coaching interface — using generators and JSONL (newline-delimited JSON) as the transport format.

---

### Layer 1 — Why streaming?

When an agent works on a task, it produces output over time — not all at once. Without streaming, the operator waits in silence until everything is done. With streaming, they see each step as it happens:

```
{"type": "thinking", "content": "Analyzing client emotional state..."}
{"type": "tool_call", "tool": "bash", "command": "python validate_triggers.py"}
{"type": "tool_result", "exit_code": 0, "output": "All 5 triggers valid"}
{"type": "response", "content": "Script generation complete with 5 triggers."}
```

Each line is a separate JSON object. This format is called **JSONL** (JSON Lines) — one JSON object per line, separated by newlines.

---

### Layer 2 — Generators for streaming

Remember generators from Lesson 06? They produce values one at a time with `yield`. That's exactly what streaming requires:

```python
async def stream_agent_events(task: str):
    async for event in agent.run(task):
        yield json.dumps(event) + "\n"
```

The calling code consumes events as they arrive:

```python
async for line in stream_agent_events("Generate coaching script"):
    event = json.loads(line)
    if event["type"] == "error":
        handle_error(event)
    elif event["type"] == "response":
        display_result(event["content"])
```

---

### Layer 3 — Streaming in the CCP

The Pi architecture streams events using this exact pattern (Launch Manual Ch 06):

**Agent thought stream**: The harness streams the agent's internal reasoning process — what it's thinking, which tools it's calling, what results it got. This gives the operator full visibility without waiting for the final answer.

**Pipecat WebSocket delivery**: The coaching interface (Pipecat) receives these events over a WebSocket connection. Each JSONL event maps to a UI update — "thinking" shows a spinner, "tool_call" shows the action, "response" shows the final coaching script.

**Server-Sent Events (SSE)**: For simpler integrations, the CCP can stream over HTTP using SSE — a protocol where the server pushes events to the client over a long-lived connection:

```python
from fastapi.responses import StreamingResponse

@app.get("/stream-session")
async def stream_session(client_id: str):
    return StreamingResponse(
        stream_coaching_events(client_id),
        media_type="text/event-stream"
    )
```

---

### Layer 4 — Buffer handling

Real-world streaming has a critical gotcha: **incomplete lines**. When reading from a stream, data arrives in chunks that don't always align with line boundaries:

```python
buffer = ""
async for chunk in raw_stream:
    buffer += chunk
    while "\n" in buffer:
        line, buffer = buffer.split("\n", 1)
        yield json.loads(line)
```

This buffer pattern ensures you only parse complete JSON objects — never partial ones.

---

### 🧩 Key questions

1. Why use JSONL instead of a single large JSON array?
2. What happens if you try to `json.loads()` a partial line?
3. Why does the CCP stream agent events instead of waiting for the complete response?

### 🎯 Takeaway

JSONL is the CCP's streaming format — one structured event per line. Generators produce events on-demand. WebSockets and SSE deliver them to the client. Buffer handling prevents partial parse errors. This is how the operator sees the agent working in real-time instead of staring at a blank screen.

---

## 🧠 Lesson 19: The Stateless Execution Loop

### 🎯 Goal

Understand the deterministic agent loop — observe, orient, decide, act — and see how the CCP's harness prevents infinite loops, manages context accumulation, and enforces turn limits.

---

### Layer 1 — The OODA loop

The agentic harness follows a simple loop (modeled on the Pi architecture):

```python
history = [system_prompt]
turn = 0

while turn < MAX_TURNS:
    # OBSERVE: send history to LLM
    response = await call_llm(history)
    
    # ORIENT: parse the response for tool calls
    tool_calls = parse_tool_calls(response)
    
    if not tool_calls:
        # DECIDE: no tools needed → we're done
        break
    
    # ACT: execute each tool call
    for call in tool_calls:
        result = await execute_tool(call)
        history.append({"role": "tool", "content": result})
    
    history.append({"role": "assistant", "content": response})
    turn += 1
```

This is the entire architecture of the Pi agent in ~15 lines. The agent:
1. Sends conversation history to the LLM
2. Parses the response for tool calls
3. Executes the tools
4. Appends results to history
5. Repeats until done or MAX_TURNS exceeded

---

### Layer 2 — Why stateless?

The loop is **stateless** — it has no memory beyond the `history` array. Every piece of context the agent needs must be explicitly in the history. This is deliberate:

- **Debuggable**: You can read the history and see exactly what the agent knew at each step
- **Reproducible**: Same history → same behavior (modulo LLM temperature)
- **Stoppable**: Kill the loop at any turn and nothing is lost — the history IS the state

---

### Layer 3 — Context management

The history array grows with each turn. Eventually it hits the model's context window limit. The CCP handles this with:

**Turn limits** (`MAX_TURNS`): A hard cap on how many turns the agent can take. In the Pi architecture (Launch Manual Ch 06), this defaults to 10-20 turns. If the agent can't finish by then, it's probably stuck.

**Context compaction**: When history gets too long, older entries are summarized or truncated. Critical information (system prompt, current task) is always preserved; tool results from 10 turns ago are compressed.

**Break conditions**: The loop breaks when:
- The LLM returns a response with no tool calls (task complete)
- MAX_TURNS is reached (timeout)
- A critical error occurs (subprocess failure, API timeout)
- The operator manually cancels (interrupt)

---

### Layer 4 — Why this matters for supervision

Understanding the execution loop is how you debug agent behavior:

- **Agent stuck in a loop?** → Check if it's repeating the same tool call. The history will show the pattern.
- **Agent finished too early?** → Check if it incorrectly decided no tools were needed (parse error).
- **Agent used too many turns?** → Check if MAX_TURNS is set too high or the task is too complex for one loop.
- **Context window exhausted?** → Check if old history entries are being compacted properly.

---

### 🧩 Key questions

1. Why is `MAX_TURNS` non-negotiable? What happens without it?
2. What does "stateless" mean if the agent clearly uses a `history` array?
3. How do you know when the agent is stuck vs. still working?

### 🎯 Takeaway

The execution loop is the heartbeat of the agentic harness. It observes, orients, decides, and acts — then repeats. It's stateless (all context is in the history array), bounded (MAX_TURNS prevents infinite loops), and debuggable (read the history to understand what happened). This is the most important pattern to understand because every agent action in the CCP flows through this loop.

---

## 🧠 Lesson 20: Regex & String Parsing

### 🎯 Goal

Understand regular expressions as pattern-matching tools for extracting structured data from unstructured text — and see how the CCP uses regex to parse LLM output into executable blocks.

---

### Layer 1 — What is regex?

A regular expression (regex) is a pattern that matches text:

```python
import re

text = "The session lasted 45 minutes with 5 triggers"
numbers = re.findall(r"\d+", text)
# → ["45", "5"]
```

`\d+` means "one or more digits." `re.findall()` returns ALL matches. Regex lets you extract structured information from messy, unstructured text.

---

### Layer 2 — Common patterns

The patterns you'll see most in CCP code:

```python
# Match a specific format
re.search(r"score: (\d+\.\d+)", "CBCS score: 0.87")
# → group(1) = "0.87"

# Extract content between tags
re.search(r"<bash>(.*?)</bash>", response, re.DOTALL)
# → group(1) = the command inside the tags

# Find all markdown code blocks
re.findall(r"```(\w+)\n(.*?)```", response, re.DOTALL)
# → [("python", "code here..."), ("json", "data here...")]

# Validate a format
re.match(r"^[A-Z]{2}-\d{3}$", "JP-001")
# → matches (valid coach ID format)
```

Key concepts:
- `()` captures a group — lets you extract the matched part
- `.*?` matches anything (non-greedy — stops at the first match)
- `re.DOTALL` makes `.` match newlines too

---

### Layer 3 — Regex in the CCP

The Pi architecture (Launch Manual Ch 06) uses regex as the **output parser** — the mechanism that converts raw LLM text into executable tool calls:

**Tool call extraction**: When the LLM generates a response with embedded tool calls, regex extracts them:

```python
# LLM output might contain:
# <bash>python validate_script.py --session S-001</bash>
# <edit path="config.json">{"max_retries": 5}</edit>

bash_match = re.search(r"<bash>(.*?)</bash>", llm_output, re.DOTALL)
if bash_match:
    command = bash_match.group(1).strip()
    execute_bash(command)
```

This is the critical parsing layer between what the LLM says and what the harness does. If the regex is wrong, commands either don't execute (missed match) or execute incorrectly (wrong extraction).

**Markdown block extraction**: Many LLM outputs contain code blocks in markdown format. The harness extracts them:

```python
code_blocks = re.findall(
    r"```(\w*)\n(.*?)```", 
    llm_output, 
    re.DOTALL
)
for language, code in code_blocks:
    if language == "python":
        save_and_run(code)
```

**Input sanitization**: Before feeding user input to the LLM or database, regex validates it:

```python
if not re.match(r"^[a-zA-Z0-9_-]+$", client_id):
    raise ValueError(f"Invalid client ID format: {client_id}")
```

---

### Layer 4 — Reading regex, not writing it

You don't need to compose complex regex patterns from scratch. But you need to READ them — because every agent's output parser uses regex, and if the parser has a bug, the agent breaks silently.

When reading a regex pattern, decode it symbol by symbol:
- `^` → start of string
- `$` → end of string
- `\d` → digit, `\w` → letter/number, `\s` → whitespace
- `+` → one or more, `*` → zero or more, `?` → zero or one
- `()` → capture group
- `[]` → character set

Practice: `r"^[A-Z]{2}-\d{3}$"` → "starts with 2 uppercase letters, then a dash, then 3 digits, then ends."

---

### 🧩 Key questions

1. What does `re.search(r"<bash>(.*?)</bash>", text)` extract?
2. What's the difference between `re.search()` (first match) and `re.findall()` (all matches)?
3. What happens if the LLM output doesn't contain the expected `<bash>` tags?

### 🎯 Takeaway

Regex is the CCP's scalpel for parsing LLM output. It extracts tool calls from tags, code from markdown blocks, and structured data from unstructured text. You don't need to write complex patterns, but you absolutely need to read them — because the output parser is the bridge between what the LLM says and what the agent does. If the regex is wrong, the agent is blind.
