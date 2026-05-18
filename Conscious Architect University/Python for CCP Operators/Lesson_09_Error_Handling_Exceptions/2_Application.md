# 🟡 Layer 2: Application — Error Handling in CCP Production

## 1. SPACED RETRIEVAL INTERRUPT

Without looking: What is the fundamental architectural difference between an unhandled `json.JSONDecodeError` arising from a malformed LLM payload, and a specifically caught `json.JSONDecodeError` mapped to a fallback `session_state` dict? 

(Commit to your answer before reading further.)

*If you answered that the unhandled error severs the OODA loop and crashes the FastAPI pipeline, while the caught error isolates the defect and allows the factory floor to continue operating, proceed to the application layer.*

---

## 2. THE CCP ARTIFACT GALLERY

The previous layer demonstrated what exceptions *permit* you to do. This layer demonstrates exactly *where* they sit in the Conscious Coaching Platform. Error handling is not localized; it spans across all boundaries of the system to maintain strict quarantine over state variables.

### ARTIFACT 1: The QA Department — Pydantic Validation

**Subsystem:** JIT Skill Compiler — Trigger Validation Schema
**Strategic Source:** OpenProse Error Handling Protocol (P2)

The most frequent error in the CCP ecosystem is an LLM hallucinating its data structure. To prevent those hallucinations from poisoning the Chassis, the QA Department uses Pydantic to aggressively raise `ValidationError`.

```python
from pydantic import BaseModel, model_validator

class CoachingScript(BaseModel):
    coach_id: str
    trigger_count: int
    cbcs_alignment_score: float

    @model_validator(mode='after')
    def validate_triggers(self) -> 'CoachingScript':
        if self.trigger_count < 1:
            raise ValueError(f"CRITICAL: Script for {self.coach_id} has 0 triggers.")
        if self.cbcs_alignment_score < 0.6:
            raise ValueError("CBCS alignment is below the 0.6 baseline.")
        return self
```

**DATA FLOW TRACE:**
1. LLM synthesizes raw JSON string.
2. `json.loads` converts string to Python dictionary.
3. Dictionary is unpacked into the `CoachingScript` Pydantic model.
4. Python enforces the primitive types (`coach_id` is string, etc.).
5. The `@model_validator` executes contextually. 
6. If the LLM returned `trigger_count=0`, the `raise ValueError` is executed.
7. Pydantic natively wraps this `ValueError` into a structured `pydantic.ValidationError`, abruptly halting the forward pass.

> **PREDICTION GATE:** If the LLM generates `{"coach_id": "JP-1", "trigger_count": 0, "cbcs_alignment_score": 0.9}`, does the `cbcs_alignment_score` get validated before the code errors out?

**Reveal:** No. The `trigger_count < 1` check fires first and invokes `raise`. The function instantly ejects. The `cbcs_alignment_score` check is never reached. This is called *short-circuiting*.

**Orchestration Dichotomy:** This component lives exclusively in the **QA Department**. If removed, invalid trigger geometries leak into the Neo4j state, causing corrupt session dynamics. In non-sovereign architectures, this is typically replaced by messy regex string-matching blocks.

---

### ARTIFACT 2: The Chassis — FastAPI Exception Routing

**Subsystem:** Core HTTP API — Session Generation Endpoint
**Strategic Source:** Building Effective Terminal Agents (190/200)

When Pydantic or Neo4j raises an error, the FastAPI endpoint (The Chassis) must catch it and translate it into a standard HTTP code so the frontend or Pi agentic loop knows exactly what happened.

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import ValidationError

router = APIRouter()

@router.post("/generate-script")
async def generate_script(req: SessionRequest, db=Depends(get_db)):
    try:
        # Calls the DSPy machinist which might trigger a Pydantic QA failure
        script: CoachingScript = await run_dspy_pipeline(req.coach_id, req.context)
        return {"status": "success", "data": script.model_dump()}
        
    except ValidationError as e:
        # QA Department rejected the part
        print(f"Schema violation: {e.errors()}")
        raise HTTPException(status_code=422, detail="LLM failed to meet structure constraints")
        
    except Exception as e:
        # Catastrophic unknown error
        print(f"Fatal Engine Failure: {e}")
        raise HTTPException(status_code=500, detail="Internal Orchestrator Failure")
```

**DATA FLOW TRACE:**
1. External caller triggers `/generate-script`.
2. Execution drops into the `try` block and summons `run_dspy_pipeline`.
3. If the pipeline yields a `ValidationError`, the first `except` block catches it.
4. The router uses `raise HTTPException` to terminate the route safely and hand a `422 Unprocessable Entity` back to the caller.
5. If a fundamentally untracked issue occurs (e.g., Redis disconnects), the `except Exception` block catches it, returning a generic `500` error.

> **PREDICTION GATE:** If `run_dspy_pipeline` crashes due to a `ConnectionRefusedError` (Redis going offline), does the caller receive a 422 or a 500 error?

**Reveal:** A 500. `ConnectionRefusedError` is not a `ValidationError`. It bypasses the first `except` block and falls into the `Exception` catch-all.

**Orchestration Dichotomy:** This is **The Chassis**. Without this, untrapped `ValidationError`s will crash the raw ASGI server layer silently. The entire frontend UX collapses because it assumes the server hung up the phone.

---

### ARTIFACT 3: The Robot Arm — Pi Harness Subprocess Signaling

**Subsystem:** Pi Agentic Harness — Bash Context
**Strategic Source:** Pi Agentic Harness (`pi-mono` by Mario Zechner) (190/200)

The Pi Agentic Harness communicates with the host OS by spawning bash subprocesses. A subprocess that runs forever freezes the agent. Catching timeouts is mathematically essential to preserving the deterministic loop.

```python
import subprocess
from pathlib import Path

def run_bash_tool(cmd: str, timeout: int = 15) -> str:
    workspace = Path("/agents/session_042")
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout,
            cwd=workspace
        )
        return result.stdout
        
    except subprocess.TimeoutExpired:
        error_file = workspace / "__error.md"
        error_file.write_text(f"Command timed out after {timeout} seconds.")
        return "ERROR: Pipeline Timeout Escapement."
```

**DATA FLOW TRACE:**
1. Agent commands a bash script to execute.
2. `subprocess.run` blocks execution waiting for the bash child process to conclude.
3. If the bash script takes 16 seconds, Python's O/S watcher cuts it off and raises `subprocess.TimeoutExpired`.
4. Execution diverts to the `except` block.
5. A deterministic `__error.md` file is written to the physical filesystem so that the Orchestrator loop (when it reads the directory state) physically sees the failure boundary.

> **PREDICTION GATE:** Look closely at the error handling block. What happens if the `cmd` is `ls -zzz` which instantly fails with an exit code of `1` (invalid flag), but finishes in 2 seconds?

**Reveal:** `subprocess.run` completes successfully within the timeout. It does not raise `TimeoutExpired`. The function simply returns the `result.stdout` (which will be blank), while the error message is silently stored in `result.stderr`. The `__error.md` is never generated.

**Orchestration Dichotomy:** This is the **Robot Arm**. If removed, any command that hangs (e.g., `apt-get install` waiting for a `y/n` prompt) permanently locks the thread. The agent effectively enters a coma.

---

### ARTIFACT 4: The Machinist — DSPy Fallback Synthesis

**Subsystem:** Declarative AI Pipelines — The Machinist
**Strategic Source:** Inside the Scaffold (182/200)

When DSPy optimizes a target, it relies on structured assertions. When an assertion fails, it generates an internal exception, traces it, and uses the exception text to force the LLM to rewrite the prompt.

```python
import dspy

class CCPContextSynthesizer(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate = dspy.ChainOfThought("client_log -> target_trigger")
        
    def forward(self, client_log):
        prediction = self.generate(client_log=client_log)
        
        try:
            dspy.Suggest(
                prediction.target_trigger in ["confrontation", "humor", "empathy"],
                f"Invalid trigger: {prediction.target_trigger}. Must be one of the holy trinity."
            )
        except dspy.primitives.assertions.DSPySuggestionError as e:
            # The Machinist explicitly routes this defect back into the compiler
            print(f"Machinist caught deviation. Initiating pipeline retry. Reason: {e}")
            raise  # Re-raises to allow the teleprompter to backtrack
            
        return prediction
```

**DATA FLOW TRACE:**
1. The `client_log` flows into the forward pass.
2. The LLM hallucinates `target_trigger = "anger"`.
3. `dspy.Suggest` evaluates `False` and specifically raises `DSPySuggestionError`.
4. The exception is intercepted. We print a telemetry log to the console.
5. The empty `raise` statement takes the active exception and pushes it *back up the stack* directly into DSPy's teleprompter compiler, which uses the error text to literally instruct the LLM: *"You failed because target_trigger was 'anger'. Re-calculate."*

> **PREDICTION GATE:** What happens if the developer deletes the `raise` keyword on line 19?

**Reveal:** The exception is caught, printed to the terminal, and instantly destroyed. Execution drops to `return prediction`. The DSPy teleprompter compiler never knows an error occurred. The retry loop is entirely bypassed, and the hallucinated `"anger"` trigger proceeds into the downstream system. The Machinist's internal feedback loop is gutted.

**Orchestration Dichotomy:** This is **The Machinist**. Without it, self-healing generative architecture degrades into a standard fire-and-forget API call.

---

## 3. THE ORCHESTRATION DICHOTOMY MAPPING

By tracking how a single malformed payload travels, we can observe the load-bearing nature of Python exceptions.

* **Layer 4: The Laser Cutter (LLM)** makes a mistake.
* **Layer 3: The Machinist (DSPy)** attempts to validate via `dspy.Suggest` and realizes the error. It raises `DSPySuggestionError`. If the retry fails, it escalates further out.
* **Layer 2: The QA Department (Pydantic)** tries to deserialize the output. It unequivocally fails against the type contract. It raises `ValidationError`.
* **Layer 1: The Chassis (FastAPI)** catches the `ValidationError`, logs it, and gracefully returns a `422 Unprocessable Entity` to the requesting frontend, or routes it to the `__error.md` for the Pi loop.

**Rule of Sovereignty:** "Throw early, catch late." 
You want the deep layers of the factory (Pydantic, DSPy) to `raise` exceptions the literal millisecond a defect is detected. You want the highest layer of the factory (FastAPI) to `catch` the exception and route it safely. Plastering `try/except` in the deep sub-modules swallows telemetry and hides the rot.

---

## 4. DATA FLOW TRACING EXERCISE (LIVE SESSION FAILURE)

**Scenario:** A client on the mobile app pushes the "Generate New Module" button. The server receives the websocket burst.

1. **Client WebSocket message enters the Router.** 
2. **FastAPI (`@app.websocket`)** maps the payload and wraps the primary logic in a `try/except` block to prevent socket disconnection.
3. **Data flows into Neo4j Memory Engine.** The query is syntactically flawed because the `coach_id` string contains an illegal SQL character. 
4. **Neo4j driver** instantly drops the process and `raises CypherSyntaxError`.
5. **The Exception begins ascending.** It bypasses the unwritten database layer catch blocks.
6. **The FastAPI Chassis intercepts.** The overarching `except Exception as e:` catches the `CypherSyntaxError`.
7. **FastAPI transmits mitigation:** It sends a `{ "status": "error", "message": "Memory access fault." }` back across the websocket channel.
8. **The OODA loop resets.** The client sees an error toast popup. The app does not crash. The websocket remains open. The Foreman receives a Sentry alert containing the stack trace.

If *any* node in this tree swallowed the exception silently (`except Exception: pass`), the client would be waiting for a graph node to return that never will. 

---

## 5. PRODUCTION EDGE CASES

### Silent Failure: The Hidden Rot
When an Architect incorrectly writes error handling, they create silent failures.
```python
def update_voice_dna(new_weight: float):
    try:
        model.layers[1].weight = new_weight
    except Exception:
        pass # "I just want it to not crash."
```
If the layer index `1` doesn't exist, an `IndexError` fires. The `except Exception` indiscriminately absorbs it. The `pass` does nothing. The function returns. The platform thinks the Voice DNA is perfectly dialed in. The client receives terrible coaching. The Architect spends 8 hours debugging the LLM prompt, oblivious that the tensor update failed in Python.

### Explicit Catching: The Surgical Scalpel
```python
def update_voice_dna(new_weight: float):
    try:
        model.layers[1].weight = new_weight
    except IndexError as e:
        log_to_foreman(f"CRITICAL: Voice DNA Tensor mismatch. Arch divergence. {e}")
        raise SovereignArchitectError("Model blueprint corrupted.") from e
```
Here, not only is the exact error targeted (`IndexError`), but it is actively re-broadcast as a custom Sovereign error, ensuring the telemetry dashboard lights up.

---

## 6. STRATEGIC PAPER INTEGRATION

### The Orchestration Dichotomy
**Dictum 1: The OODA Loop Must Never Hang.**
Exceptions are the physical implementation of Dictum 1. A hanging OODA loop is a destroyed pipeline. Timeouts wrapping subprocesses and precise exception handling guarantee that the agent always completes its action cycle, even if that cycle results in a documented failure.

### OpenProse Contract Vocabulary (173/200)
Every exception explicitly raised maps exactly to an OpenProse **Invariant**. 
*"Requires: trigger_count > 0. Ensures: A valid script. Invariant: script must never contain hallucinated arrays."*
When Pydantic raises a `ValidationError` on `trigger_count`, it is enforcing the defined OpenProse `Requires` contract at runtime.

### Pi Harness Architecture (190/200)
In the Pi execution loop, the `__error.md` file generation (demonstrated in Artifact 3) is paramount. The Agent observes `__error.md` during its `Observe` phase if a terminal tool exception fired during the `Act` phase. 

---

## 7. APPLICATION GAUNTLET (PREDICTION CHALLENGE)

Here are 7 production snapshots you have never seen. Trace the data.

**Fragment 1:**
```python
# System: Core Context Graph
def fetch_client_node(client_id: str):
    try:
        return db.match(client_id).first()
    except KeyError:
        return None
```
**Q1: What concept is this code using, and what CCP subsystem does it belong to?**
*Answer:* It uses a safe dictionary key fallback mechanism mapped to an exception catch. It belongs to the **Memory Engine** (Neo4j/Graph).

**Fragment 2:**
```python
# System: Trigger Execution Engine
try:
    invoke_pi_tool("analyze_audio")
except subprocess.TimeoutExpired:
    fallback_invoke("text_only_transcription")
```
**Q2: If line 4 was completely removed, what happens?**
*Answer:* The code would be syntactically invalid Python (a `try` requires an `except` or `finally`). If the `except` block was removed, the entire execution engine would violently crash if `analyze_audio` timed out.

**Fragment 3:**
```python
# System: Verification Layer
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=400, content={"message": "Contract Breached"})
```
**Q3: Which layer of the Orchestration Dichotomy does this operate in?**
*Answer:* **The Chassis** (FastAPI). It serves as a global interceptor that listens for any QA Department (Pydantic) alarms and standardizes their outward HTTP manifestation.

**Fragment 4:**
```python
# System: Batch Inference Daemon
for state in batched_states:
    try:
        pipeline.forward(state)
    except TimeoutError:
        log.warning("Batch node delayed.")
        continue
```
**Q4: Does this pipeline completely stop if one state computation times out?**
*Answer:* No. The `continue` statement within the localized exception block ensures that the generator simply skips the corrupted batch node and proceeds to the next state in the iteration.

**Fragment 5:**
```python
# System: File Asset Loader
try:
    weights = Path("lora_v3.safetensors").read_bytes()
except (FileNotFoundError, PermissionError) as e:
    raise LoRALoadError("Adapter absent or locked") from e
```
**Q5: Why is `from e` utilized here?**
*Answer:* To execute "Error Chaining." It explicitly raises the bespoke platform architecture error (`LoRALoadError`) while permanently appending the OS-level stack trace (`FileNotFoundError`) for the Foreman's telemetry.

**Fragment 6:**
```python
try:
    llm.generate()
except Exception:
    write___error_md()
```
**Q6: Identify the subtle defect in this Pi Harness tool implementation.**
*Answer:* While it attempts to implement the Pi Harness `__error.md` protocol, catching the global `Exception` is an anti-pattern. It will catch intentional interrupts (like keyboard `SIGINT`s) alongside standard logic errors, heavily muddying the OODA loop diagnostics. 

**Fragment 7:**
```python
def JIT_Compiler():
    try:
        assemble_voice_dna()
    finally:
        db.close_transaction()
```
**Q7: If `assemble_voice_dna()` throws a massive MemoryError that completely blows out the heap, does `db.close_transaction()` execute safely?**
*Answer:* Yes. `finally` blocks are structurally guaranteed to execute during the exception stack unwinding process, ensuring critical resources (specifically graph database transactions) are released before the orchestrator perishes.
