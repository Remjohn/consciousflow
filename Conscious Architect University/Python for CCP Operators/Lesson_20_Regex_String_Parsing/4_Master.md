# Lesson 20: Regex & String Parsing — Master Assessor

## Mastery Gate
Secure the perimeter. You have 12 minutes to prove architectural command over structural boundaries. Fusing execution without structural constraints is engineering negligence.

---

### Q1: Contract Construction
The Pi harness uses `<bash>` tags. Write the **exact Python regex pattern string** required to extract the inner payload from these tags safely, without being greedy, using group extraction.
*(Do not include `re.DOTALL` code here, just the pure `r"..."` pattern string. Example: `r"<tag>(.*?)</tag>`)*

- **Expected Answer:** `r"<bash>(.*?)</bash>"`

---

### Q2: Defect Triage
An agent successfully generates a `<python>` code block. Your logs show the execution runner throws `NoneType has no attribute 'group'`. Which of the following is the **most likely architectural cause**?

A. The Pydantic Field constraint blocked the output before regex could parse it.
B. **The agent generated multi-line code, but the Python regex engine was called without the `re.DOTALL` flag, causing the match to fail silently.**
C. The LLM hallucinated the code block entirely.
D. The `re.IGNORECASE` flag was missing, so the tags were case-sensitive.

- **Correct Answer:** B. Without this flag, Regex stops capturing at the first newline character. Multi-line code returns no match, resulting in a None object.

---

### Q3: Schema Hardening
You are defining a Pydantic schema for a `user_uuid` field. You must enforce that the string starts with `USR-`, followed by exactly 4 digits. Write the EXACT regex pattern for the `Field(pattern=...)` argument.

- **Expected Answer:** `^USR-\d{4}$` (The anchors `^` and `$` are mandatory to prevent injection).

---

### Q4: Structural Philosophy
Why does the skill compiler use `match.group(1)` instead of returning the full string detected via native Python operators like `in`?

A. Because `match.group(1)` is native to C++, making it faster for GPU execution.
B. Because native Python operators cannot search inside strings.
C. **Because `in` is probabilistic and blind. Group extraction physically separates the specific algorithmic payload from the generative conversational noise surrounding it.**
D. Because the LLM requires group parameters to understand the prompt.

- **Correct Answer:** C. `group(1)` physically decouples valid algorithmic data from hallucinated conversation.

---

### Q5: Feynman Compression
Explain why Regex and exact String Parsing capabilities are structurally necessary for maintaining a sovereign architecture.

**Mandatory keywords:** `[Pi Agentic Harness]`, `[Silent execution timeouts]`, `[The Robot Arm]`

**Compression Example:**
Regex operates as the architectural boundary that protects deterministic logic from the chaotic output of generative models. In **The Robot Arm**, the extractor uses greedy constraints (`re.DOTALL`) to pull multi-line commands cleanly. If string parsing is omitted or fails on newlines within the **Pi Agentic Harness**, the system throws **silent execution timeouts** as the shell awaits strings it will never receive. Structural borders secure execution.
