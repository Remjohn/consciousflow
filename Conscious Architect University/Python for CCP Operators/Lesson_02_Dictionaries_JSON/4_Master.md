# Lesson 02: Dictionaries & JSON — Master Layer

## INSTRUCTIONS
This is the terminal capstone for the Dictionaries & JSON module. You will be evaluated strictly on your ability to enforce structural determinism over agentic workflows. 

* **Time limit:** 12 minutes (simulated).
* **Reference materials:** Prohibited.
* **Passing threshold:** 160 / 200 points.

You are expected to specify, triage, and structurally justify the JSON constraints of the Conscious Coaching Platform (CCP). If you cannot perform these operations under pressure, you are not authorized to deploy sovereign agents.

---

## SECTION 1: CONTRACT SPECIFICATION (60 Points)

You must translate natural language requirements directly into deterministic Python primitives. 

**Scenario 1: The OODA Loop Context Constraint (30 points)**
*The CCP agentic harness requires a data structure to maintain the active memory of its execution loop. The structure must contain:*
* *An execution ID (string)*
* *The current loop step (integer, minimum 1)*
* *A map of variables scraped from the OS terminal (dictionary)*
* *A boolean flag indicating if the agent has requested a human override.*
* *The agent must never be able to pass a loop step less than 1.*

**Your Task:** Specify this contract as a Pydantic `BaseModel`. Do not provide surrounding code. Only the class and exact field declarations.

**Grading Rubric:**
* `execution_id: str` (7.5 pts)
* `current_loop_step: int = Field(..., ge=1)` (7.5 pts)
* `os_variables: dict` (7.5 pts)
* `human_override_requested: bool` (7.5 pts)

**Scenario 2: The DSPy Output Mold (30 points)**
*The JIT Compiler has dynamically dispatched a Qwen 3.5 request to generate an emergency de-escalation protocol. You must bound the LLM's output. The LLM must return three specific pieces of information inside its generated JSON:*
* *The raw script the coach should read.*
* *A confidence array of numerical float scores (0.0 to 1.0).*
* *A dictionary mapping the identified risks to boolean flags.*

**Your Task:** Define the exact DSPy `OutputField` declarations required in the Signature class to compel the Machinist to retrieve this structure.

**Grading Rubric:**
* `de_escalation_script: str = dspy.OutputField(...)` (10 pts)
* `confidence_scores: list[float] = dspy.OutputField(...)` (10 pts)
* `risk_map: dict = dspy.OutputField(...)` (10 pts)

---

## SECTION 2: DEFECT TRIAGE (60 Points)

You are reviewing PRs and agent runtime logs. Classify the following 4 code snippets.
**Classifications:** ✅ Correct / 🔴 Omission / 🟡 Hallucination / 🔵 Misapplication

**Snippet 1: The Redis Cache Retrieval**
```python
def fetch_session_data(session_uuid: str) -> dict:
    raw_data = redis_client.get(f"session:{session_uuid}")
    if raw_data is None:
        return {}
    session_map = json.loads(raw_data)
    return session_map
```

* **Classification:** ✅ Correct (15 pts). 
* **Reasoning:** It checks if the Redis cache is empty. It safely returns an empty dictionary instead of throwing a `JSONDecodeError` on a `None` type. When the data exists, it correctly parses the shipping crate (`json.loads`) into a Python dictionary.

**Snippet 2: The WebSocket State Mutation**
```python
async def broadcast_state(websocket: WebSocket, state_update: str):
    # state_update arrives as "{"status": "active"}"
    current_status = state_update["status"]
    if current_status == "active":
        await websocket.send_text("PROCEED")
```

* **Classification:** 🔵 Misapplication (15 pts).
* **Defective Line:** `current_status = state_update["status"]`
* **Violated Contract:** The Shipping Crate rule. 
* **Fix Specification:** The `state_update` is explicitly typed as a `str`. You cannot use dictionary indexing (`["status"]`) on a raw string. The developer forgot to run `json.loads(state_update)` before attempting to extract the value.

**Snippet 3: The Missing Fallback**
```python
def extract_trigger_weight(voice_dna: dict, trigger_name: str) -> float:
    weights = voice_dna["trigger_weights"]
    return weights[trigger_name]
```

* **Classification:** 🔴 Omission (15 pts).
* **Defective Line:** `return weights[trigger_name]`
* **Violated Contract:** OpenProse safety bounds against hallucinated keys in live configuration dictionaries.
* **Fix Specification:** If `trigger_name` does not exist in the dictionary, this will throw a fatal `KeyError`. The operator must replace dictionary index bracket notation with `.get(trigger_name, 0.0)` to ensure the system defaults to zero rather than crashing the compiler.

**Snippet 4: The Chatty JSON Agent**
```python
# The LLM outputs this exact string:
llm_payload = """
Here is the trigger map you requested:
{
    "confrontation": true,
    "reflection": false
}
"""
parsed = json.loads(llm_payload)
return parsed
```

* **Classification:** 🟡 Hallucination (15 pts).
* **Defective Line:** `parsed = json.loads(llm_payload)`
* **Violated Contract:** MCDA Output Parsing / Terminal Agent isolation rule.
* **Fix Specification:** The LLM hallucinated conversational preamble text surrounding its JSON. `json.loads()` will violently crash because the string does not begin with an open curly brace. The string must be stripped via a regex "Rogue Scalpel" before passing to the parser.

---

## SECTION 3: ARCHITECTURAL REASONING (40 Points)

You must justify the structural rigidness of the CCP's Python pipelines. 

**Question 1: The Pydantic Immutable Decree (20 points)**
*Why does the CCP enforce the unpacking of LLM JSON outputs into strict Pydantic `BaseModel` classes, rather than just leaving them as generic Python dictionaries? Explain this using the Factory metaphor.*

* **Explanation:** A generic Python dictionary is a container with no lock and no inspector. Anyone can throw any key or value into it without system complaint. Pydantic is the **QA Department**. By forcing the dictionary into a `BaseModel`, we instantly verify the exact types, limits, and presences of every piece of data. 
* **Strategic Source:** Orchestration Dichotomy (Dictum 2), which mandates that deterministic code must never trust stochastic generation implicitly.
* **Orchestration Layer:** The QA Department validating materials before they hit the Chassis.

**Question 2: The DSPy Contract Constraint (20 points)**
*Why do we explicitly declare `dict` as the type in a DSPy `OutputField` instead of using string extraction techniques like Python's `.split()` or regex on raw paragraphs?*

* **Explanation:** The Machinist (DSPy) relies on programmatic optimization. Regex and `.split()` are fragile mechanisms that break if the model changes its prose slightly. By defining the `OutputField` type as a dictionary, we compel the LLM to serialize its logic into a rigid key-value matrix. 
* **Strategic Source:** DSPy: The End of Prompt Engineering, which abolishes manual string parsing in favor of programmatic signature alignment.
* **Orchestration Layer:** The Machinist establishing the casting mold for the Laser Cutter.

---

## SECTION 4: FEYNMAN COMPRESSION (40 Points)

You must compress the entire operational requirement of JSON and Dictionaries into a sovereign defense protocol.

**Prompt:**
*Explain in your own words why dictionaries and the `json.loads/dumps` pipeline are critical for maintaining sovereign control over the CCP's agentic systems. Your explanation must include these 3 structural elements: [Memory Engine], [hallucinated keys/types], [QA Department]. Minimum 4 sentences.*

**Feynman Response:**
"To maintain sovereign control over stochastic LLM agents, we can never allow raw text generation to interact directly with our backend logic. When a model returns a psychological analysis, we force it to pack that analysis into a universal JSON shipping crate. The FastAPI boundary uses `json.loads()` to unpack that crate into a Python dictionary, and immediately passes it to the **QA Department** (Pydantic). Here, the dictionary acts as an enforced filter against **hallucinated keys/types**; if the language model tries to invent a variable that isn't in our blueprint, the system crashes probabilistically before the rogue data can execute. This strict protocol ensures that when the data finally persists into the **Memory Engine** (Neo4j), we are logging deterministic, structurally verified facts, not the sprawling hallucinations of an unchecked neural net."

---
**END OF ASSESSMENT.**
If you achieved fewer than 160 points, you are not authorized to deploy or review FastAPI or Pydantic pipelines on the factory floor. Return to the Capability layer.
