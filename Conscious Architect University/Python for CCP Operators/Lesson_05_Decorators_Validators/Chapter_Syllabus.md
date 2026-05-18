# 🧠 Lesson 05: Decorators & Validators

## 🎯 Goal
Understand decorators as wrappers that modify or extend a function's behavior — and see how FastAPI routes and Pydantic validators are both built on this exact pattern.

---

## 🧱 Layer 1 — What is a decorator?
A decorator is a function that wraps another function to add behavior:

```python
@log_calls
def process_session(client_id: str) -> dict:
    ...
```

The `@log_calls` line means: "before running `process_session`, first run it through `log_calls`, which might log the call, time it, or add some extra logic."

You can think of it as a stamp on a document. The document (function) is the same, but the stamp adds a guarantee: "this was reviewed," "this was timed," "this is authorized."

---

## ⚙️ Layer 2 — How decorators actually work
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

## 🏗️ Layer 3 — Decorators in the CCP
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

## 🛡️ Layer 4 — Why decorators matter for supervision
Decorators are the enforcement layer. They're how the CCP attaches rules to behavior without cluttering the core logic. When you read CCP code, the decorators tell you:

- What route handles this request (`@app.post`, `@app.get`)
- What validation runs on this field (`@field_validator`)
- What dependencies are injected (`@Depends`)
- What authorization is required (`@require_auth`)

---

## 🧩 Key questions
1. What happens if you write a FastAPI function without the `@app.post()` decorator?
2. Why use `@field_validator` instead of putting an `if` check inside the function body?
3. Can a function have multiple decorators stacked on top of each other?

## 🎯 Takeaway
Decorators wrap functions to add behavior — routes, validation, logging, authorization. They are the enforcement stamps of the CCP. You read them to understand what rules are attached to each function. You don't write them, but you need to recognize what each decorator does when reviewing agent-generated code.
