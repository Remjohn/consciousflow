# Lesson 20: Regex & String Parsing — Application Layer

## 01 — SPACED RETRIEVAL INTERRUPT: The OODA Stateless Loop

Before mastering string payload extraction, we must recall the environment in which extraction happens. 

In Lesson 19, we proved that the CCP's Agentic execution loop is **stateless**. It runs purely on the OODA (Observe, Orient, Decide, Act) loop. We inject the `MAX_TURNS` constraint to prevent hallucination looping during extraction phases.

**Memory Recall:** If the `MAX_TURNS` parameter is hit before the Regex extraction matches the required payload, what is the safest architectural fallback action?
- *Answer:* Halt execution and throw a deterministic Extraction Timeout error. We never extend the loop dynamically or corrupt validation. The loop terminates cleanly via Error Handling, maintaining sovereign execution boundaries.

> **Insight:** Extraction inherently fails over time if the model refuses to output structured syntax. Bounding execution prevents infinite compute waste when Regex continuously fails to match.

---

## 02 — PRODUCTION ARTIFACT 1: JIT Skill Compiler (Trigger Validation)

When an Agent uses the `<run_skill>` capability, it must specify the skill name EXACTLY. If the skill is `skill_math_v2`, anything else is invalid. The compiler validates the request via Regex.

```python
import re

pattern = r"^<run_skill>([a-zA-Z0-9_]+)</run_skill>"
match = re.search(pattern, llm_response)

if match:
    skill_name = match.group(1)
```

- `^` Anchors the match. It MUST be the very first thing.
- `[a-zA-Z0-9_]+` Restricts the skill name to alphanumeric characters and underscores ONLY. (No spaces, no quotes, no conversational filler).
- `match.group(1)` Physically extracts the interior string, immediately divorcing the data from the XML tags.

---

## 03 — PRODUCTION ARTIFACT 2: Pydantic & Neo4j Sanitization

In Lesson 11, we built Pydantic data contracts. Here, Regex is injected *directly* into the Pydantic `Field()` constraint.

```python
from pydantic import BaseModel, Field

class NodeIdentifier(BaseModel):
    hex_id: str = Field(..., pattern=r"^[0-9a-fA-F]{8}$")
    neo4j_label: str = Field(..., pattern=r"^[A-Z][a-zA-Z0-9]+$")
```

If Neo4j attempts to execute an injection payload masquerading as a node label, the Pydantic Regex hook blocks the execution before the GraphQL resolver even boots up.

> **Validation Isolation:** We decouple the extraction logic from the validation logic. Extraction uses regex to find payloads buried in noise. Validation uses regex to assert strict formatting over an already isolated field.

---

## 04 — PRODUCTION ARTIFACT 3: The Robot Arm Bash Extractor

The Pi Agent writes its commands inside `<bash>` blocks. The extraction engine uses a non-greedy regex to perfectly isolate the code for execution.

```python
# FAILS BECAUSE DOT DOES NOT SPAN NEWLINES
engine_regex = r"<bash>(.*?)</bash>"

# SAFE - MULTI-LINE EXTRACTION
safe_regex = re.compile(r"<bash>(.*?)</bash>", re.DOTALL)
```

**The Trailing Noise Problem:** Bash scripts span multiple lines. The standard `.` character matches any character *except a newline*. If you omit the `re.DOTALL` parameter, the Python matcher fails instantly on multi-line scripts. This is the #1 point of failure in Agentic Harnesses.

> Without `re.DOTALL`, the agent's code is silent, unparsed, and never executed. The pipeline hangs waiting on terminal output that will never occur.

---

## 05 — CHECKPOINT (Application Gauntlet)

**1. In a JIT Skill compilation sequence, why do we use `match.group(1)` rather than `match.group(0)` to retrieve the payload?**
- `group(0)` returns the entire matched string including XML tags; `group(1)` isolates just the interior captured payload, divorcing the data from the shell syntax.

**2. What is the functional difference between `re.match(pattern, string)` and `re.search(pattern, string)`?**
- `match` implicitly anchors to the START of the string. `search` will find the pattern anywhere in the volume. For Agent logic, `re.search` is critically necessary to locate tags embedded deeply in outputs.

**3. Why do we use the `?` character in the non-greedy payload capture `.*?`?**
- It forces the regex to stop searching immediately at the *first* closing tag, rather than swallowing the entire document until the *last* closing tag.

**4. If a Neo4j query variable is validated against `^[A-Za-z_][A-Za-z0-9_]*$`, which of these node labels achieves validation?**
- `User_Profile_22` (Starts with letter/underscore, followed only by alphanumeric/underscores).

**5. If `MAX_TURNS` hits 0 in the Stateless Engine, and Regex has still failed to match `<extraction>`, what occurs architecturally?**
- The execution chain raises an Exception and halts the sequence cleanly. Predictable systemic breakage is safer than executing corrupted hallucinations.

**6. When Pydantic validates an LLM-supplied dictionary, how does its internal Regex integration differ from standard Python string assertion?**
- If the constraint fails, Pydantic throws a structured `ValidationError` blocking instantiation completely. It guarantees downstream layers ALWAYS receive flawlessly mapped strings.

**7. Which of the following regex flags is MANDATORY when parsing LLM code blocks?**
- `re.DOTALL`. Without it, `.` stops at the first newline, destroying extraction of multi-line scripts.
