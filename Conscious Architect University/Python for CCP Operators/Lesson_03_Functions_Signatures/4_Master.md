# 🚀 Layer 4: Master — Capstone Assessment

## 📌 MASTER PROMPT: FUNCTIONS & SIGNATURES

**TIME LIMIT: 12 MINUTES** | **PASSING THRESHOLD: 160/200**

You are evaluating the capability and resilience of the Conscious Coaching Platform. You are not writing software. You are engineering sovereign control. The AI is the engine; you are designing the contracts that bind it. 

Follow the strict requirements. Auto-submission will execute when the timer concludes.

***

### SECTION 1: CONTRACT SPECIFICATION [60 Points]

*You must draft the strict signature architecture from a natural-language description. No hints are provided.*

**Scenario A: Pydantic State Schema [20 pts]**
*Context:* The CCP Memory Engine requires a data contract to manage a client's "Trigger Burst." 
*Requirements:* Construct the Pydantic field declarations. It must include:
1. `burst_id` (a strictly formatted string).
2. `severity` (an integer that cannot fall below 1, and cannot exceed 10).
3. `escalated_to_human` (a literal boolean flag).
4. `coach_notes` (a string, but it is explicitly allowed to be missing or null).

> **Architect Answer Construction:**
> ```python
> from pydantic import BaseModel, Field
> from typing import Optional
> 
> class TriggerBurstState(BaseModel):
>     burst_id: str = Field(...)
>     severity: int = Field(..., ge=1, le=10)
>     escalated_to_human: bool = Field(...)
>     coach_notes: Optional[str] = None
> ```

**Scenario B: DSPy Signature Declaration [20 pts]**
*Context:* The Machinist layer demands a predictive pipeline schema. The pipeline evaluates raw transcript text to summarize the user's primary psychological evasion tactic. 
*Requirements:* Construct the `dspy.Signature`. It must include:
1. The explicit docstring providing pipeline intention bounds.
2. The transcript funnel.
3. The generated evasion string (maximum size guidance provided to the LLM).
4. The confidence weight (an explicit floating-point).

> **Architect Answer Construction:**
> ```python
> import dspy
> 
> class EvaluateEvasionTactic(dspy.Signature):
>     """Analyze the user's raw transcript and isolate their primary psychological evasion tactic."""
>     
>     raw_transcript: str = dspy.InputField(desc="The last 5 conversational exchanges.")
>     
>     evasion_type: str = dspy.OutputField(desc="A single summary sentence constraint.")
>     confidence_weight: float = dspy.OutputField(desc="A float between 0.0 and 1.0.")
> ```

**Scenario C: FastAPI Boundary Endpoint [20 pts]**
*Context:* The Chassis needs to accept incoming requests from a specialized frontend widget designed to inject Voice DNA configurations into the platform on-the-fly.
*Requirements:* Construct the FastAPI route function signature (the logic inside the function is irrelevant). It must include:
1. A POST HTTP method referencing `/api/dna/inject`. 
2. A payload mapping to a `VoiceBody` Pydantic class.
3. A synchronous or asynchronous declaration.
4. A return signature promising an explicit `VoiceResponse` model.

> **Architect Answer Construction:**
> ```python
> from fastapi import FastAPI
> 
> app = FastAPI()
> 
> @app.post("/api/dna/inject", response_model=VoiceResponse)
> async def inject_voice_dna(payload: VoiceBody) -> VoiceResponse:
>     # Logic boundaries omitted
>     pass
> ```

------

### SECTION 2: DEFECT TRIAGE (UNDER PRESSURE) [60 Points]

*An autonomous coding agent has committed the following patches. You have 4 minutes to triage. Classify as ✅ Correct, 🔴 Omission, 🟡 Hallucination, or 🔵 Misapplication.*

**Defect Block 1: The Pi Subprocess Loop [15 pts]**
```python
# 01 import subprocess
# 02 
# 03 def run_agent_bash(cmd_string):
# 04     result = subprocess.run(cmd_string, shell=True, capture_output=True)
# 05     if result.stderr:
# 06         return {"error": result.stderr}
# 07     return {"success": result.stdout}
```
**Classification:** 🔴 Omission
**Specific Line:** Line 03
**Contract Violated:** OpenProse Requires / Ensures Strict Typing
**Fix Specification:** The `run_agent_bash` function completely lacks type hints. The input `cmd_string` lacks a `: str` binding, and the function lacks a `-> dict` return signature. This prevents static analysis, making the execution layer vulnerable to dictionary injections. Add explicit bounds to line 03.

**Defect Block 2: DSPy Float Processing [15 pts]**
```python
# 01 class GenerateSessionPacing(dspy.Signature):
# 02     """Calculates dynamic pacing delays based on user anxiety."""
# 03     transcript = dspy.InputField()
# 04     pacing_delay: FloatType = dspy.OutputField(desc="Millisecond delay")
```
**Classification:** 🟡 Hallucination
**Specific Line:** Line 04
**Contract Violated:** DSPy Field Declaration standard.
**Fix Specification:** The autonomous agent hallucinated `FloatType`, a construct that exists in some typed data languages but not fundamentally in standard Python typehint definitions natively mapped by Pydantic/DSPy without severe external importing. It should read `pacing_delay: float`.

**Defect Block 3: FastAPI Dependency Injection [15 pts]**
```python
# 01 @app.get("/system/status", response_model=SystemStatus)
# 02 async def get_system_status(
# 03    token: str = Depends(verify_master_key)
# 04 ) -> SystemStatus:
# 05    return fetch_db_status()
```
**Classification:** ✅ Correct
**Specific Line:** N/A
**Contract Violated:** None.
**Fix Specification:** The execution boundary is flawless. The parameter signature catches the dependency token exactly as expected, and the return annotation securely matches the response model.

**Defect Block 4: The Validation Override [15 pts]**
```python
# 01 class CoachingSchema(BaseModel):
# 02     skill_name: str
# 03     
# 04     @field_validator("skill_name")
# 05     def clean_string(skill_name) -> str:
# 06         return skill_name.lower().strip()
```
**Classification:** 🔵 Misapplication
**Specific Line:** Line 05
**Contract Violated:** Pydantic Classmethod Architecture
**Fix Specification:** The agent applied the `@field_validator` but misapplied the fundamental signature architecture for a Pydantic class validator. It missing the `@classmethod` decorator entirely above line 04 (or functionally line 05 representation). Furthermore, the signature in line 05 is missing the required `cls` first argument, making it `def clean_string(cls, skill_name: str) -> str:`. This will throw a runtime trace error instantly upon compilation.

------

### SECTION 3: ARCHITECTURAL REASONING [40 Points]

*Provide the fundamental "WHY" behind the architecture, not the syntax.*

**Question 1: Pydantic vs DSPy Outputs [20 pts]**
*Prompt:* Why does the CCP strictly enforce Pydantic output validation (The QA Department) on LLM responses *after* trusting the `dspy.OutputField` type constraints during pipeline generation?
*Answer Constraint:* Cite MCDA / Dictums. 

> **Architect Response:** 
> According to **Strategic Decision Dictum 2 (The QA Department)**, an LLM evaluation structure (DSPy) is an optimization compiler, not an absolute data firewall. While `dspy.OutputField` dictates intention and attempts casting via the *Machinist* layer, LLMs perfectly emulate chaos. Mathematical validation functions in an explicit Pydantic `BaseModel` are required to guarantee exact constraint conformity (e.g., `< 1.0` logic), ensuring stochastic hallucinations are physically rejected before touching the database.

**Question 2: Terminal Function Architecture [20 pts]**
*Prompt:* Why must the Pi harness inside the CCP utilize specific Python wrapper functions (e.g., `def run_bash(cmd: str, timeout: int) -> str`) utilizing `subprocess.run(timeout=X)` instead of simply executing `os.system()`?
*Answer Constraint:* Cite Pi Agentic Harness architecture.

> **Architect Response:** 
> Drawing from the **Pi Agentic Harness (`pi-mono`)** architectural blueprint, the sovereign system operates a strictly stateless execution loop (OODA). Using a raw `os.system()` abandons the execution entirely to the host with zero boundary guarantees. The explicit Python function signature `run_bash` forces a timeout parameter, protecting the thread from infinite blockages caused by hallucinated loops (`while true`) and uses `capture_output=True` to explicitly route data *back* into the function's strict `-> str` return signature to feed the observation loop.

------

### SECTION 4: FEYNMAN COMPRESSION [40 Points]

*Explain the sovereign truth. This is the terminal layer. Minimum: 4 sentences.*

**Prompt:** Explain in your own words why **Function Signatures** are absolute necessities for maintaining sovereign control over the CCP's agentic systems. Your explanation must explicitly integrate these 3 structural elements:

1. **The JIT Skill Compiler** (Subsystem)
2. **Infinite Execution Hallucinations** (Failure Mode)
3. **The QA Department** (Orchestration Dichotomy Layer)

***
> **Architect Compression Synthesis:**
> Function signatures are the sovereign iron walls that encase the chaos of a language model. When the platform routes requests through the **JIT Skill Compiler**, it relies entirely on programmatic signatures to dynamically assemble dozens of skills without data bleeding or corrupting the template context. If we abandoned strict input and output signatures, the system would immediately suffer from **Infinite Execution Hallucinations**, as agents would return unstructured raw data capable of freezing the entire WebSocket communication loop. To prevent this entropy, the Orchestration Dichotomy enforces **The QA Department**, utilizing rigidly-typed Pydantic schemas as absolute verification gates. By using function signatures as mathematical boundaries, we sever the LLM’s ability to act randomly, forcing its high-IQ reasoning exclusively through channels we completely control.
***

### CAPSTONE EVALUATION COMPLETE.
*(Auto-Submit Engaged. Scoring processing...)*
