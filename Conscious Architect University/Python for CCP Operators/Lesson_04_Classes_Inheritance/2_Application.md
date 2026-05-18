# 🟡 Layer 2: Application — Classes & Inheritance in Production

***

Without looking: What architectural mechanism allows you to reuse the entire validation and serialization engine of Pydantic without writing a single line of inspection logic yourself?

*(Commit your answer before proceeding.)*

**Answer:** Inheritance. By inheriting from `BaseModel`, a child class automatically incorporates the parent's entire validation framework as its own.

***

You now know that a Class is a Machine Blueprint and Inheritance is Blueprint Extension. In this layer, we leave the realm of theory. You will see exactly where these blueprints hold the Conscious Coaching Platform (CCP) together. We are going to step onto the factory floor and trace the execution of these systems in production code.

Each of the following artifacts represents a critical, load-bearing component of the Sovereign Stack. You will read them not as a Python developer, but as a Foreman. Your objective is not to write this code, but to supervise the coder agents who do, ensuring that they respect the Orchestration Dichotomy.

---

## THE CCP ARTIFACT GALLERY

### 1. The QA Department: Pydantic Validation Schema

The QA Department relies exclusively on classes that inherit from Pydantic's `BaseModel`. This is the single most important defense against LLM hallucination.

**Header:** The QA Department — Skill Execution Output Validation  
**Strategic Source:** Orchestration Dichotomy (Dictum 2) & OpenProse Contract Vocabulary (173/200)

```python
from pydantic import BaseModel, Field

class CoachingSkillOutput(BaseModel):
    """Base output structure for all compiled skills."""
    skill_name: str = Field(..., description="The exact registered name of the skill")
    execution_success: bool = Field(..., description="Did the skill meet its objective?")

class ConfrontationSkillOutput(CoachingSkillOutput):
    """Specific output enforcement for the Confrontation skill."""
    confrontation_intensity: float = Field(..., ge=0.0, le=1.0)
    defensive_response_detected: bool
    trigger_deployed: str = Field(..., min_length=3)
```

**DATA FLOW TRACE:**
1. The **Laser Cutter (LLM)** finishes generating the output for a Confrontation skill. The raw output is a JSON string.
2. The orchestrator feeds the raw JSON into the `ConfrontationSkillOutput` constructor via `.model_validate_json()`.
3. Because `ConfrontationSkillOutput` inherits from `CoachingSkillOutput`, Pydantic first checks if `skill_name` is present and is a string. If missing, it immediately throws a `ValidationError`.
4. It then inspects `execution_success`, forcing it to a boolean.
5. It then moves to the specific fields defined in the subclass: it checks that `confrontation_intensity` is a float between 0.0 and 1.0, that `defensive_response_detected` is a boolean, and that `trigger_deployed` is a string of at least 3 characters.
6. The validated instance now exists in memory. Any component that accesses this instance is 100% guaranteed that these data constraints represent reality.

> **PREDICTION GATE:**
> If the LLM generates `{"skill_name": "Confront", "execution_success": True, "confrontation_intensity": 1.5, "defensive_response_detected": False, "trigger_deployed": "silence"}`. What exactly happens on line 10?
> *(Commit your answer.)*
> **The Reveal:** Pydantic forcefully intercepts the `1.5` value, checks it against the inherited `BaseModel` logic executing the `le=1.0` constraint, and crashes the instantiation with a `ValidationError`. The invalid data is vaporized before it can pollute the system.

**Orchestration Dichotomy Mapping:**
- **Layer:** The QA Department.
- **If Removed:** The LLM's hallucinated `1.5` intensity score enters the Neo4j graph. A downstream analytic pipeline reading CBCS alignment scores crashes or, worse, miscalculates the patient's state silently because it assumes all scores are normalized between 0-1.
- **Non-Sovereign Replacement:** Generic platforms use prompt engineering ("Please make the score between 0 and 1") and hope the LLM complies. The CCP uses structural inheritance to legally enforce it before proceeding.

---

### 2. The Machinist: DSPy Module Composition

The Machinist does not use prompts; it uses multi-stage AI pipelines compiled and optimized by DSPy. These pipelines must inherit from `dspy.Module`.

**Header:** The Machinist — Dynamic Narrative Generation Pipeline  
**Strategic Source:** DSPy: The End of Prompt Engineering (185/200)

```python
import dspy

class GenerateNarrativePivot(dspy.Module):
    """A pipeline that assesses a client block and generates a pivot."""
    
    def __init__(self):
        super().__init__()
        # Blueprinting the sub-components
        self.assess_block = dspy.ChainOfThought("transcript -> block_summary")
        self.generate_pivot = dspy.Predict("block_summary, coach_dna -> pivot_script")

    def forward(self, transcript: str, coach_dna: str) -> dspy.Prediction:
        # Executing the workflow
        assessment = self.assess_block(transcript=transcript)
        pivot = self.generate_pivot(
            block_summary=assessment.block_summary, 
            coach_dna=coach_dna
        )
        return dspy.Prediction(
            block_summary=assessment.block_summary, 
            pivot_script=pivot.pivot_script
        )
```

**DATA FLOW TRACE:**
1. The **Chassis** calls this module, passing in the raw `transcript` and the active `coach_dna`.
2. The `forward` method (which dictates execution flow via the inheritance contract of `dspy.Module`) intercepts the trace.
3. `transcript` flows into `self.assess_block`. This sub-module generates the `assessment.block_summary`.
4. Both the newly generated `assessment.block_summary` and the original `coach_dna` flow into the `self.generate_pivot` sub-module.
5. The final output is aggregated and returned through the `dspy.Prediction` standard container.

> **PREDICTION GATE:**
> An agent forgets to type `super().__init__()` on line 7 but leaves everything else exactly the same. The code executes perfectly in manual terminal tests. What catastrophic failure occurs later during DSPy's BootstrapFewShot optimization?
> *(Commit your answer.)*
> **The Reveal:** The DSPy optimizer traverses the inheritance tree (specifically relying on `dspy.Module`'s internal tracking mechanisms) to discover the `self.assess_block` and `self.generate_pivot` parameters to adjust their few-shot examples automatically. Because the superclass was not initialized, the tracking list is empty. The optimizer silently skips this entire pipeline module. You run highly-expensive optimization cycles yielding absolutely zero improvement, and generate no error logs.

**Orchestration Dichotomy Mapping:**
- **Layer:** The Machinist.
- **If Removed:** Without `dspy.Module` classes orchestrating predictable paths, the AI logic becomes a single massive prompt sequence.
- **Non-Sovereign Replacement:** Hard-coded `requests.post()` calls to the OpenAI API using enormous, brittle string templates that cannot be mathematically optimized.

---

### 3. The Chassis: FastAPI Injection Endpoint

The FastAPI application determines how external triggers enter the system. Class inheritance via Pydantic is explicitly tied directly into the function route handlers to establish the boundary.

**Header:** The Chassis — Voice DNA API Gateway  
**Strategic Source:** Building Effective Terminal Agents (190/200)

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

app = FastAPI()

class VoiceDNAUpdate(BaseModel):
    coach_id: str
    aggression_modifier: float = Field(..., ge=-1.0, le=1.0)
    humor_style: str

@app.post("/api/v1/dna/update")
async def update_voice_dna(
    payload: VoiceDNAUpdate, 
    db: Session = Depends(get_db)
):
    # Retrieve current active logic
    current_profile = db.query(Profile).filter(Profile.id == payload.coach_id).first()
    if not current_profile:
        raise HTTPException(status_code=404, detail="Coach ID missing from Memory Engine.")
        
    # Execute injection
    current_profile.aggression += payload.aggression_modifier
    db.commit()
    return {"status": "success", "new_aggression": current_profile.aggression}
```

**DATA FLOW TRACE:**
1. An external tool dashboard fires a POST request bridging an update to the system. The payload is raw JSON.
2. Before the logic in `update_voice_dna` runs, FastAPI examines the `payload: VoiceDNAUpdate` boundary declaration.
3. FastAPI implicitly runs the JSON through the `VoiceDNAUpdate` constructor (a `BaseModel` inheritance).
4. If validation passes, the resulting verified class instance is passed into the function as `payload`.
5. The logic extracts `payload.coach_id` to query the database, mathematically adjusts the aggression, commits to the persistent state, and returns.

> **PREDICTION GATE:**
> A junior developer sends a POST request without the `humor_style` key in the JSON body. Does the script throw an `HTTPException` on line 19?
> *(Commit your answer.)*
> **The Reveal:** It never reaches line 19. It never reaches line 18. FastAPI recognizes that the `VoiceDNAUpdate` blueprint demands a `humor_style` parameter. Because it is absent, the Pydantic inheritance mechanism rejects the instantiation immediately. FastAPI catches this inherently and returns a `422 Unprocessable Entity` error directly to the API caller, protecting the internal logic from dealing with missing keys entirely. 

**Orchestration Dichotomy Mapping:**
- **Layer:** The Chassis.
- **If Removed:** If a standard `dict` were used instead of the `VoiceDNAUpdate` class, the function would execute, attempt to adjust internal parameters blindly, and potentially crash during database commitments if raw shapes were incorrect, leading to a sprawling internal crash (`500 Internal Server Error`).
- **Non-Sovereign Replacement:** Writing dozens of lines of `if 'humor_style' not in payload:` explicitly for every single route input—drastically slowing cycle time and guaranteeing unhandled omissions.

---

### 4. The Robot Arm: The Pi Harness Executable Loop

The Pi Harness executes local terminal scripts. It isolates the subprocess commands dynamically inside strict OOP state representations to guarantee safe shell boundaries.

**Header:** The Robot Arm — Shell Tool Validation Blueprint  
**Strategic Source:** Pi Agentic Harness Architectures (`pi-mono`) (190/200)

```python
import subprocess
import shlex

class BashExecutionBoundary:
    """Isolate and execute bash commands specifically returned by the agent."""
    def __init__(self, command: str, timeout_seconds: int = 10):
        self.command = command
        self.timeout_seconds = timeout_seconds
        
    def _sanitize(self) -> str:
        # Internal security enforcement
        parts = shlex.split(self.command)
        if parts[0] in ["rm", "sudo", "mv"]:
            raise PermissionError("Disallowed root or destructive command.")
        return shlex.join(parts)

    def execute(self) -> dict:
        safe_cmd = self._sanitize()
        try:
            result = subprocess.run(
                safe_cmd, shell=True, capture_output=True, text=True, timeout=self.timeout_seconds
            )
            return {"std_out": result.stdout, "std_err": result.stderr}
        except subprocess.TimeoutExpired:
            return {"std_err": "TIMEOUT EXPIRED. EXECUTION KILLED."}
```

**DATA FLOW TRACE:**
1. The AI decides it needs to explore the workspace and outputs `<bash>ls -la</bash>`.
2. The orchestrator uses regular expressions to extract `ls -la`.
3. The string `ls -la` is passed into the `BashExecutionBoundary` constructor. A formal physical instance is created.
4. The orchestrator issues the `.execute()` command against the class instance.
5. The instance routes the data through `._sanitize()`, confirming it does not violate hard-coded limits.
6. The instance triggers the subprocess, captures the output, mathematically tracks the timeout, and returns a safely formatted dictionary.

> **PREDICTION GATE:**
> If an LLM hallucinates and outputs `<bash>rm -rf /</bash>`, what happens when `.execute()` is triggered?
> *(Commit your answer.)*
> **The Reveal:** The `execute()` function passes the command through `self._sanitize()`. `shlex.split` identifies `rm` as the first command target. The conditional `if parts[0] in ["rm"...]` identifies the violation, forcefully throwing a `PermissionError`. The subprocess is completely aborted before native code accesses the shell context layer.

**Orchestration Dichotomy Mapping:**
- **Layer:** The Robot Arm.
- **If Removed:** If just using raw `subprocess.run(command)` in an unstructured loop without encapsulation, there is no standardized location to apply sanitation pipelines or isolated timeout tracking. You surrender control of the container.
- **Non-Sovereign Replacement:** Executing `os.system()` and praying the LLM was "aligned" enough not to hallucinate a destructive command.

---

### 5. The Memory Engine: Neo4j Node State Schema

Graph databases can rapidly devolve into corrupt datasets if the nodes being written do not follow precise type structures. Pydantic classes map to exact node properties.

**Header:** The Memory Engine — Semantic Context Persistence  
**Strategic Source:** OpenProse State Persistence Model (173/200)

```python
class Neo4jNode(BaseModel):
    """Abstract parent for database nodes."""
    node_id: str
    timestamp: int

class CoachingStateNode(Neo4jNode):
    """Explicit semantic data for the Graph Context Engine."""
    client_ref: str
    dominant_emotion: str
    is_evading: bool

def flush_to_graph(node_data: CoachingStateNode):
    # Ensures the class instance dictates the graph mapping structure
    cypher_query = """
    MERGE (n:CoachingState {node_id: $node_id})
    SET n.timestamp = $timestamp,
        n.client_ref = $client_ref,
        n.dominant_emotion = $dominant_emotion,
        n.is_evading = $is_evading
    """
    execute_cypher(cypher_query, parameters=node_data.model_dump())
```

**DATA FLOW TRACE:**
1. The dynamic processing layers assemble data and construct a `CoachingStateNode`, inheriting the `node_id` and `timestamp` from `Neo4jNode`.
2. The `CoachingStateNode` ensures the exact boundary definitions are met.
3. The instance is passed into the `flush_to_graph` mechanism.
4. The instance invokes `.model_dump()` locally—which is an inherited behavior—converting its structural form into a flat dictionary precisely matching the parameters the Neo4j Cypher protocol requires.

> **PREDICTION GATE:**
> If `node_data.model_dump()` is called, what does the resulting dictionary look like?
> *(Commit your answer.)*
> **The Reveal:** `{"node_id": "...", "timestamp": 1234567, "client_ref": "...", "dominant_emotion": "...", "is_evading": True}`. Inherited fields (`node_id`, `timestamp`) are dumped seamlessly alongside child fields, providing a complete packet to the database layer.

**Orchestration Dichotomy Mapping:**
- **Layer:** The Memory Engine.
- **If Removed:** Cypher queries executed raw against arbitrary LLM JSON output guarantee Type Error explosions within the database layer.
- **Non-Sovereign Replacement:** Trying to manually sync JSON schemas to Neo4j validation boundaries independently, resulting in database migrations failing silently and destroying historical coaching data integrity.

***

## DATA FLOW TRACING EXERCISE (STEP-BY-STEP)

You must now trace how a specific, single concept traverses the classes across an entire workflow boundary. 

**The Full Scope CCP Session Trigger Simulation**

1. **Client Action (Web App):** The user clicks "Help, I'm stuck" in the app. The WebSocket transmits `{"event": "friction", "severity": 0.85, "context": "writer's block"}`.
2. **The Chassis:** The WebSocket ingest layer utilizes a Pydantic Blueprint inherited from `BaseModel` called `FrictionEventInput`. It intercepts the data, confirming `severity` is exactly a float `<= 1.0` and `event` maps to the explicitly expected internal schema strings.
3. **The Memory Engine Integration:** The verified class transfers to the memory engine query function, which instantiates a `HistoricalStateLookup` blueprint to construct a safe context array query from Neo4j.
4. **The Machinist:** DSPy instantiates a `DetermineCoachingManeuver` object inheriting from `dspy.Module`. Within its constructor `__init__`, it declares a specific `dspy.Predict` block invoking an inherited instruction set. 
5. **The Laser Cutter:** DSPy passes the variables through the `forward()` invocation over to the LLM (e.g. Qwen 3.5). The LLM processes the raw language and returns unstructured narrative JSON back.
6. **The QA Department Pipeline Return:** DSPy’s internal validation schema inherently demands parsing the JSON back against its `dspy.OutputField` typings. DSPy extracts the raw target variables.
7. **The Hard Output Gate:** The final data is shoved into `CoachingScriptResponse(BaseModel)`. A `@model_validator` executes over the unified object to ensure the confrontation scale matched the original API severity constraint before transmission.
8. **Client Execution:** The chassis extracts the final validated script from the class instance and pipelines it to the TTS output engine, streaming zero-latency voice audio back to the user interface.

Every single movement inside the system was governed by a Class instance built directly upon a trusted, mathematical inheritance layer (`BaseModel`, `Module`). There is no naked data traveling directly through the application.

***

## PRODUCTION EDGE CASES

Classes execute rigidly. This rigidity leads to specific behaviors when the AI or the human operator disrupts the standard expected flow. Here is how you identify class operational behaviors at the boundary conditions.

### Edge Case A: The Inheritance Misuse Validation Error

**The Condition:** An agent builds a schema:
```python
class SubSkill(PydanticSkillBase):
    sub_intensity: str = Field(..., max_length=2)
```
The inherited `PydanticSkillBase` forces all string fields to pass through an aggressive capitalization parser. 

**The Result:** The system attempts to run `.model_validate` passing `sub_intensity: 95`. The field expects a string. The validation converts it to `"95"`. But the parent inheritance immediately capitalizes and trims it. The validation doesn't just fail; it mathematically transforms and then asserts the string's length `< 2`. Due to the manipulation, there's an aggressive error cascade if the parameters change unpredictably from what the subclass author specifically anticipated.
**Why CCP Does This:** Inherited validators execute implicitly. You do not just inherit types; you inherit behavior.

### Edge Case B: The Silent Class Pass

**The Condition:** An operator builds a standard Python class (no inheritance).
```python
class ArbitraryState:
    def __init__(self, trust: float):
        self.trust = trust

state = ArbitraryState(trust="None")
```

**The Result:** The code does absolutely nothing wrong algorithmically. It silently passes `"None"` to the `self.trust` variable despite the `float` type hint.
**Why CCP Rejects This:** Standard Python type hints (`: float`) are merely suggestions. They do not raise exceptions at runtime. Pydantic is an absolute requirement for The QA Department because it overwrites this behavior to enforce hard runtime evaluations. Never trust a naked Python class constructed without a validation master blueprint in front of an LLM.

### Edge Case C: FastAPI 422 Immediate Rejection

**The Condition:** The API expects an inherited `BaseModel` for the POST target wrapper. The UI sends malformed JSON to the CCP.

**The Result:** The system bypasses all Python logic paths in your execution function entirely. It throws a generic `422 Unprocessable Entity` immediately.
**Why CCP Handles It This Way:** FastAPI evaluates the Pydantic class before invoking your actual code. If the structural integrity of the input data is missing, executing the application is mathematically hazardous. Therefore, FastAPI constructs an automated 422 HTTP response, cleanly outlining the missing validation components, and aborts the pipeline, preserving the backend.

### Edge Case D: The DSPy Optimization Retry Loop

**The Condition:** The `dspy.Predict` block requires `"rationale, solution -> response"`. The LLM's stochastic output deviates and omits the solution completely.

**The Result:** DSPy internally intercepts the JSON, attempts to evaluate it against the OutputField expectations generated conceptually from the module class structure, realizes the specific parameters cannot be matched, and instantly fires a recursive `Retry` prompt to the LLM (with exponential backoff) informing it of the validation failure so the LLM can rewrite the response dynamically.
**Why CCP Handles It This Way:** LLMs are erratic (Dictum 1). A hard 500 error aborts real-time coaching directly. The Machinist attempts autonomous recovery against the class signature before escalating a catastrophic error to the Chassis.

***

## STRATEGIC PAPER INTEGRATION

Your Sovereign understanding of classes must track back mathematically to the core architecture principles laid out in the Platform’s foundation documents:

### 1. Orchestration Dichotomy (Strategic Decision Dictum 2)
The dichotomy mandates the strict separation between non-deterministic execution (AI output) and deterministic behavior (Code logic). The Pydantic class (`BaseModel`) acts exclusively to ensure deterministic boundaries are impenetrable. This Dictum requires that all cross-layer transmissions enforce a typed object constraint. The `BaseModel` class structure is the legal framework enforcing Dictum 2. Nullifying `BaseModel` inherently voids the Dictum.

### 2. MCDA Scaffolding Audit (P1 Essential Papers)
*Inside the Scaffold (182/200)* heavily documents why programmatic structuring surrounding black-box APIs outperforms iterative logic checks. By abstracting control logic into unified class definitions instead of looping `regex` extractions across bare dictionaries, the Sovereign Stack gains resilience without ballooning codebase complexity. Classes scale logarithmically; custom `dict` validation code blocks scale exponentially leading to collapse.

### 3. Pi Harness Architecture
*Building Effective Terminal Agents (190/200)* heavily informs the stateless operational loop of the Pi Agentic Harness (`pi-mono`). The Robot Arm executes within a `while` loop iteration. Each loop operates entirely statelessly against external targets. The only mechanism preventing execution context bleed across those isolation layers is tracking history natively inside structurally sound object classes wrapping the command interfaces, like `ShellEnvironment(BaseModel)`.

### 4. OpenProse Contract Vocabulary
The OpenProse mechanism details `Requires / Ensures / Invariants`. This methodology maps linearly to the `__init__`, `@field_validator`, and parent/child behaviors of python inheritance structures.
- **Requires:** `def __init__(self, mandatory_var)`
- **Ensures:** Return Object schemas.
- **Invariants:** Pydantic `@model_validator` parameters verifying state representations dynamically block contradictory variable associations throughout the object's entire lifespan.

***

## APPLICATION GAUNTLET (7 QUESTIONS)

You are the Foreman. We are running rapid inspections on foreign agent artifacts attempting to merge into the main Sovereign Stack branch. You have less than a minute per artifact. Assess the structure. Trace the flow. State your conclusions.

### Snippet 1
```python
class CoachConfig(ServerConfig):
    max_retry: int = Field(default=3, le=5)
    
app_config = CoachConfig(max_retry=4)
```
**Q1: What structural concept asserts the `server_url` field internally exists upon the `app_config` instance?**
*(Commit answer)*
**Answer:** Inheritance. `ServerConfig` possesses that specific parent attribute structure. `CoachConfig` gains those properties invisibly via extension.

### Snippet 2
```python
def route_call(session_data: dict) -> None:
    internal_data = session_data["client_metric"] * 2.0
```
**Q2: Which CCP subsystem inherently collapses under this specific approach to incoming data structures?**
*(Commit answer)*
**Answer:** The Chassis. Incoming data routed as raw `dict` structures creates an unverified type coercion parameter. If `client_metric` evaluates as missing (creating a `KeyError`) or a string (leading to an erratic duplication `str * 2.0`), it triggers catastrophic state errors internally. Pydantic objects must police the gates instead.

### Snippet 3
```python
class RAGPipeline(dspy.Module):
    def retrieve(self, query):
        pass
    def generate(self, ctx):
        pass
```
**Q3: What specific architectural element required by the Machinist is entirely absent, causing the teleprompter optimization suite to fail?**
*(Commit answer)*
**Answer:** The `def __init__(self):` combined with `super().__init__()` and explicit object mappings. Without the instantiation module and structural initialization, DSPy cannot map its compiler tracking hooks directly onto the target algorithms. The class logic is effectively isolated and untouchable by the AI fine-tuning tools. 

### Snippet 4
```python
class Neo4jIntegrator:
    def execute(self, payload: PipelineOut):
        driver.session().run("...", **payload.model_dump())
```
**Q4: Which subsystem is this artifact designated for, and what dictates the shape of the data inserted?**
*(Commit answer)*
**Answer:** The Memory Engine. The insertion data shape is formally dictated by the Pydantic class definition generating `PipelineOut`, enforced through the `model_dump()` serialization execution.

### Snippet 5
```python
class ScriptGen(BaseModel):
    script_content: str
    
    @field_validator("script_content")
    @classmethod
    def prevent_hallucinated_breaks(cls, v: str):
        if "<STOP>" in v: raise ValueError("AI output artifact break.")
        return v
```
**Q5: What happens if line 3 (`@classmethod`) is randomly removed by an incompetent coding agent?**
*(Commit answer)*
**Answer:** Because Pydantic internal methodologies demand validators possess class-level behaviors allowing manipulation across varying fields independently, omitting `@classmethod` causes the python execution engine to instantly encounter runtime errors (`TypeError`) while attempting to pass variables sequentially matching the implicit arguments during Pydantic compilation mapping. 

### Snippet 6
```python
class TerminalWrapper(PiHarnessBase):
    command_log: list[str] = []
```
**Q6: If the Robot Arm executes `TerminalWrapper` inside an asynchronous polling loop, why does `PiHarnessBase` exist as the parent class?**
*(Commit answer)*
**Answer:** `PiHarnessBase` guarantees execution sanitization and context history formatting native to the stateless `pi-mono` scaffolding array. `TerminalWrapper` uses extension to prevent duplicating complex terminal security controls every time a single subsystem requires a new specific terminal action configuration.

### Snippet 7
```python
class ExecuteBlock(dspy.Module):
    def __init__(self):
        super().__init__()
        self.block_chain = dspy.ChainOfThought(AnalyzeBlockSignature)
```
**Q7: If `AnalyzeBlockSignature` fails downstream due to LLM hallucinations matching the `OutputField`, does the failure trigger in `dspy.ChainOfThought` or the `ExecuteBlock` parent?**
*(Commit answer)*
**Answer:** The failure fundamentally registers inside the parameter schema mappings assigned structurally through `AnalyzeBlockSignature`. DSPy evaluates the compiled contract internally at the `ChainOfThought` execution target level. Any integrated retry cascades attempt recovery independently at the sub-module node before bubbling extreme unrecoverable format failures up to the parent `ExecuteBlock` wrapper level.
