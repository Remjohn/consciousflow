# 🚀 MASTER PROMPT LAYER: Configuration Capstone

---

## OVERVIEW
Welcome to the Terminal Capstone. You have trained strictly in capability, mapped directly onto application logic screens, and observed multi-context layer propagation globally. Everything you implement here acts directly against sovereign operational scenarios. 

*   You must generate precise specification contracts from raw abstraction.
*   You must triage heavily hallucinated defect blocks.
*   You must formulate architectural defense responses.
*   You must deliver your Feynman compression block.

You have 12 minutes. Proceed immediately. 

---

## SECTION 1: CONTRACT SPECIFICATION (60 Points)

You must translate high-level natural language descriptions of Conscious Coaching Platform (CCP) routing constraints directly into strict Configuration implementations. You may not utilize reference code. 

### Question 1.1: The Pi Harness Guardrails Interface (15 pts)
**Specification Context:** The CCP needs a strict Python dataclass wrapper or Pydantic `BaseSettings` object representing the RAW.works ypi configuration boundary for a recursive execution subprocess. 
**Requirement:** It must parse four attributes from the external environment dynamically at boot: 
1.  A numeric budget limit (float), ensuring the recursive limit never falls below `0.1`.
2.  A subprocess timeout length (integer), defaulting gracefully to `30`.
3.  An absolute maximum call depth (integer), utilizing a requirement validator so it must be present and at least `1`.
4.  The specific child model representation (string), accepting ONLY the literal variables `'qwen'` or `'gemma'`. 
**Action:** Define the complete `Pydantic BaseSettings` schema explicitly implementing this extraction constraint exactly.

### Question 2.2: The External Security Route (25 pts)
**Specification Context:** The FastAPI Chassis must provide a specific WebSocket configuration validation check. It must retrieve the `CCP_WSS_SECRET` key securely to authenticate incoming streaming traffic.
**Requirement:** 
1.  Retrieve the key directly from the operating system configuration.
2.  If the external key fails to load or resolves to None or an empty string, the application MUST crash safely and securely rather than boot the WebSocket without a secret.
3.  This must be expressed in a 4-line python control flow without utilizing specific Pydantic wrapping. 
**Action:** Detail the required variable lookup control flow contract. 

### Question 3.3: The DSPy Optimization Configurator (20 pts)
**Specification Context:** You supervise the execution environment for a newly spun-up DSPy logic compiler handling NLP summaries. 
**Requirement:** Model how you would utilize an OpenProse `Requires/Ensures` contract documentation block specifically verifying how the module interprets `os.environ["OPENAI_API_KEY"]` before it evaluates its `Signature` forward passes. 
**Action:** Synthesize the specific `Requires` block verifying string length properties and the `Ensures` block for downstream model logic. 

---

## SECTION 2: DEFECT TRIAGE (60 Points)

You are supervising agent-generated logic intended for the CCP codebase. Examine each block. Identify the primary structural defect dynamically.  

**Triage Categories:** 
*   ✅ Correct (Flawless)
*   🔴 Omission (Crucial logic was bypassed)
*   🟡 Hallucination (Fabricated methods or API concepts)
*   🔵 Misapplication (Wrong context logic for CCP)

### Block A: The Environment Loader (15 pts)

```python
import os
import dspy

def configure_dspy_model_routing():
    fallback_model = "qwen-3.5-72b"
    nim_key = os.environ.get("NIM_SECRET_KEY")
    agent_target = os.environ.get("DSPY_TARGET_MODEL")

    if agent_target is None:
        agent_target = fallback_model

    lm = dspy.LM(model=agent_target, api_key=nim_key)
    dspy.settings.configure(lm=lm)
```

**Task:** Classify the code exactly. Identify the specific defect or state it is Correct. Explain the reasoning if defective. 

### Block B: The RLM Subprocess Validation (20 pts)

```python
import os
import subprocess

def launch_rlm_child_node(prompt: str) -> None:
    timeout_constraint = os.environ.get("RLM_TIMEOUT_MAX", "45.5")
    
    # Process execution
    print(f"Booting recursive task with {timeout_constraint} second boundary.")
    result = subprocess.run(
        ["python", "tool_script.py", prompt],
        capture_output=True,
        timeout=timeout_constraint
    )
    return result.stdout
```

**Task:** Classify the code exactly. Identify the specific defect line. Name the CCP architecture contract violated. Describe the strict natural language fix.

### Block C: The Flag Enforcer (25 pts)

```python
import os

class ChassisFeatureRouter():
    def __init__(self):
        # Enforcing debug logic based strictly on environmental config parsing
        self.debug_mode = os.environ.get("ENABLE_CCP_DEBUG", False)
        self.log_level = os.environ["CCP_LOG_VERBOSITY"]
    
    def display_logs(self):
        if self.debug_mode:
            print(f"Log Output Triggered: Level {self.log_level}")
```

**Task:** Classify the code exactly. Identify the specific structural defect preventing precise operation. Name the natural language fix.

---

## SECTION 3: ARCHITECTURAL REASONING (40 Points)

You must defend the core operational structure of externalized logic configuration based on Sovereign AI principles.

### Question A: The Agentic Guardrail Logic (20 pts)
**Context:** When constructing the Pi Harness, why does the RAW.works ypi architecture explicitly dictate that `RLM_MAX_DEPTH` and `RLM_TIMEOUT` must be hard-enforced purely by retrieving environment variables in the parent process, rather than allowing the DSPy `GenerateScript` OutputField to intelligently declare its own recursive timeout budget via an LLM instruction?
*   Cite the relevant Strategic Decision Dictum or MCDA paper context.
*   Explain the catastrophic architectural consequence of allowing agent-controlled timing.
*   Connect the answer securely to the Orchestration Dichotomy layer model.

### Question B: The Pydantic Fallback Rule (20 pts)
**Context:** During the boot of the JIT Compiler, CCP engineering policies declare that authentication secrets (like `.env` loading `NIM_API_KEY`) MUST crash immediately on load using `os.environ["KEY"]`, whereas analytical constants like `CBCS_THRESHOLD` MUST utilize robust `.get("KEY", fallback)` functionality. 
*   Explain the exact architectural consequence of utilizing a fallback string on the API Key.
*   Explain the consequence of violently crashing if the CBCS threshold is missing. 
*   Identify which structural layer of the dictums protects this separation. 

---

## SECTION 4: FEYNMAN COMPRESSION (40 Points)

This is mandatory. Minimum 35 points graded on fidelity. 

**Prompt:** Explain in your own words why **Environment Configuration Separation** is absolutely critical for maintaining sovereign control over the CCP's agentic execution chains. Your explanation must intrinsically encompass these 3 structural elements: 
1.  **The Pi Harness Robot Arm Runtime Boundaries**
2.  **Unconstrained recursive execution failures (Financial/Token budgets)**
3.  **The Chassis (Determinism)**

*Requirement:* Do not just list them. Synthesize an operational logic chain describing how sovereign capability flows through these objects. Minimum 4 sentences.
