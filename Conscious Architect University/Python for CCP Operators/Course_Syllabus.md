# Python for CCP Operators — Course Syllabus

## Course Declaration

**Title:** Python for CCP Operators — Code Literacy for Agentic Systems  
**Audience:** The Architect — builders of the Conscious Coaching Platform who must read, command, supervise, and validate AI-generated Python code. NOT developers. Architects who need enough Python literacy to operate the CCP without being at the mercy of their own agents.  
**Duration:** ~80-90 hours across 20 lessons × 4 layers each  
**Methodology:** 4-Layer Deep Learning (Capability → Application → Orchestration → Master)  
**Research Integration:** Strategic Decision Document (Orchestration Dichotomy), MCDA Agentic Scaffolding Audit, MCDA RL Optimization Audit, RAW.works RLM Articles, OpenProse Specification, Pi Agentic Harness (`pi-mono` by Mario Zechner)  
**Lesson Outlines:** See `🐍 Python for CCP Operators — Lesson Outlines.md` for 400-500 word outlines per lesson  
**Prerequisite:** Linear Algebra for Transformers (Lessons 1–8 minimum)

---

## Course Philosophy

> "We do not write Python. We read it, command it, and reject it when our agents get it wrong."

This course does NOT teach you to become a Python developer. It teaches you to become the **Foreman of the Factory Floor** — the person who reads the blueprints, inspects the output, catches the defects, and writes the contracts that the machines must follow.

Every lesson is taught through the lens of the CCP ecosystem. There are no generic "Hello World" examples. Every variable is a coaching state. Every function is a skill contract. Every class is a Pydantic schema. Every error is an agent hallucination you must catch.

---

## The 4-Layer Architecture (Adapted)

| Layer | Linear Algebra Equivalent | Python Course Version | Cognitive Function |
|-------|--------------------------|----------------------|-------------------|
| **Layer 1** | 🔵 Exposure | 🔵 **Capability** | What does this Python concept ALLOW you to do? Strip away tutorial fluff. Define the concept as an architectural force multiplier. |
| **Layer 2** | 🟡 Mechanistic | 🟡 **Application** | WHERE does this concept appear in the CCP? Map it directly to our papers, our PRD, our deployed features. |
| **Layer 3** | 🟣 Analogy | 🟣 **Orchestration** | WHERE ELSE does this concept appear? Multi-context case studies across 6 CCP subsystems — see the same principle from 6 angles so it becomes permanent. |
| **Layer 4** | 🚀 Master | 🚀 **Master** | How do you COMMAND the creation of correct code? Write the contracts, specifications, and Pydantic schemas that force agents to produce correct code. |

---

## Course Map

### Phase 1: The Language of Contracts (L01 – L05)

| # | Lesson | Python Core | CCP Connection | Strategic Source |
|---|--------|------------|----------------|-----------------|
| 01 | Variables, Types & Type Hints | `str`, `int`, `float`, `bool`, `list`, `dict`, type annotations | Every Pydantic `Field(...)` declaration is a type contract. Every LLM output must be typed. | Orchestration Dichotomy (Dictum 2) |
| 02 | Dictionaries & JSON | `dict`, `json.loads()`, `json.dumps()`, nested structures | Every API call, LLM structured output, Neo4j query result, and Redis session state is a dict/JSON | OpenProse Contract Vocabulary |
| 03 | Functions & Signatures | `def`, args, `*args`, `**kwargs`, return types, docstrings | DSPy `Signature` classes are Python function signatures for LLMs. FastAPI endpoint handlers are functions. | DSPy Paper (185/200) |
| 04 | Classes & Inheritance | `class`, `__init__`, inheritance, `super()`, composition | Pydantic `BaseModel` is a class. DSPy `Module` is a class. Every agent contract is a class hierarchy. | Orchestration Dichotomy (Dictum 2) |
| 05 | Decorators & Validators | `@decorator`, `@app.post()`, `@field_validator`, `@model_validator` | FastAPI route decorators and Pydantic validators — the two enforcement mechanisms of the JIT Compiler | Building Effective Terminal Agents (190/200) |

### Phase 2: The Data Pipeline (L06 – L10)

| # | Lesson | Python Core | CCP Connection | Strategic Source |
|---|--------|------------|----------------|-----------------|
| 06 | Lists, Comprehensions & Generators | `[x for x in ...]`, `yield`, slicing, `enumerate` | Batch processing 8 scripts/week, streaming token output, iterating over CA11 skill arrays | Inside the Scaffold (182/200) |
| 07 | File I/O & Pathlib | `open()`, `Path()`, `read_text()`, `write_text()`, directory traversal | Agent workspaces, LoRA adapter files, session logs, CMF asset directories | OpenProse filesystem state model |
| 08 | Async/Await & Concurrency | `async def`, `await`, `asyncio.gather()`, event loops | Pipecat WebSocket sessions, parallel DSPy agent calls, Redis pub/sub, real-time coaching | Sovereign NIM Routing Matrix |
| 09 | Error Handling & Exceptions | `try/except/finally`, custom exceptions, `raise`, error propagation | DSPy retry loops, Pydantic `ValidationError`, agent fallback chains, `__error.md` signaling | OpenProse Error Handling Protocol |
| 10 | Environment Variables & Config | `os.environ`, `.env` files, `python-dotenv`, secrets management | API keys, NIM endpoints, model routing configs, RLM budget/timeout guardrails | ypi Guardrail Architecture (RAW.works) |

### Phase 3: The CCP Toolkit (L11 – L16)

| # | Lesson | Python Core | CCP Connection | Strategic Source |
|---|--------|------------|----------------|-----------------|
| 11 | Pydantic: Data Contracts | `BaseModel`, `Field`, `@field_validator`, `@model_validator`, nested models | The `Requires/Ensures/Invariants/Strategies` contract system for every CCP skill. The QA Department of the Factory. | Orchestration Dichotomy (Dictum 2) |
| 12 | FastAPI: The HTTP Backbone | `@app.post()`, dependency injection, `Depends()`, middleware, WebSocket | The CCP's deterministic orchestrator. Every trigger enters through a FastAPI endpoint. The Foreman. | Building Effective Terminal Agents (190/200) |
| 13 | DSPy: Declarative AI Pipelines | `Signature`, `Module`, `Predict`, `ChainOfThought`, `OutputField` | The optimization compiler replacing prompt engineering for all 76 skills. The Machinist. | DSPy Paper (185/200), ChatGPT Origin Doc (186/200) |
| 14 | PyTorch Tensor Literacy | `torch.Tensor`, `.shape`, `autograd`, `model.load_state_dict()`, `.eval()` | Reading LoRA adapter dimensions, understanding activation steering vectors, loading checkpoints | Geron Ch 10-11, ALLoRA, RISER |
| 15 | HuggingFace & Transformers | `AutoModel`, `AutoTokenizer`, `pipeline()`, model cards, `peft` | Loading sovereign models (Qwen 3.5, Gemma 4), LoRA merging, tokenizer configuration | Sovereign NIM MCDA, LoRA Taxonomy |
| 16 | Neo4j & Graph Queries (Cypher) | `MATCH`, `CREATE`, `MERGE`, `RETURN`, relationships, node properties | The Context Premise engine. Every coaching state is a graph node, every CA11 rule is a relationship. | Hypergraph Memory (Ch 08), SemaClaw |

### Phase 4: The Agentic Harness — The `pi-mono` Architecture (L17 – L20)

> **Source:** [`pi-mono`](https://github.com/badlogic/pi-mono) by Mario Zechner — the minimalist, stateless, deterministic terminal agent that is the architectural blueprint for the CCP Agentic Harness (Launch Manual Ch 06).

| # | Lesson | Python Core | CCP Connection | Strategic Source |
|---|--------|------------|----------------|------------------|
| 17 | Subprocesses & Shell Execution | `subprocess.run()`, `Popen`, `stdout`, `stderr`, `returncode`, pipes, timeouts | The Pi `bash` tool. How our harness actually executes commands on the OS, reads terminal output, and sandboxes dangerous operations. The operator must understand process spawning to debug stuck agents. | Pi Agentic Harness, Building Effective Terminal Agents (190/200) |
| 18 | Generators & JSONL Event Streaming | `yield`, Server-Sent Events, `ndjson`, stream buffering, `for line in stream` | How Pi streams its thought process and tool calls back to the terminal in real-time. How the CCP WebSocket layer (Pipecat) consumes agent events without blocking the coaching session. | Pi Agentic Harness, SkVM Execution Model |
| 19 | The Stateless Execution Loop | `while` loops, history arrays, `MAX_TURNS`, turn counting, context window management | The deterministic Pi OODA loop. The agent takes an action, reads the result, appends to history, and loops back. The operator must understand how context accumulates and when to force a loop break to prevent infinite execution. | Pi Agentic Harness, Orchestration Dichotomy (Dictum 1) |
| 20 | Regex & String Parsing | `re.search()`, `re.findall()`, capturing groups, markdown block extraction, XML tag parsing | The "Rogue Scalpel" defense. How Pi parses the LLM's raw markdown output to perfectly extract `<bash>`, `<edit>`, and `<file>` blocks. The operator must read regex patterns to verify that agent output parsing is airtight and cannot be injection-attacked. | Pi Agentic Harness, Rogue Scalpel MCDA (P2) |

---

## Causal Chain

```
PHASE 1: THE LANGUAGE OF CONTRACTS
L01 Types ──→ L02 JSON ──→ L03 Functions ──→ L04 Classes ──→ L05 Decorators
    │             │             │                │               │
    └─ what ARE    └─ how does   └─ how to        └─ how to      └─ how to
       types?        data flow?     define          compose        enforce
                                    behavior?       contracts?     rules?

PHASE 2: THE DATA PIPELINE
──→ L06 Lists ──→ L07 Files ──→ L08 Async ──→ L09 Errors ──→ L10 Config
       │             │             │             │              │
       └─ how to     └─ how to     └─ how to     └─ how to     └─ how to
          batch?        persist?      parallelize?   catch         secure?
                                                     failures?

PHASE 3: THE CCP TOOLKIT
──→ L11 Pydantic ──→ L12 FastAPI ──→ L13 DSPy ──→ L14 PyTorch ──→ L15 HF ──→ L16 Neo4j
       │                │              │             │              │           │
       └─ the QA        └─ the         └─ the        └─ the         └─ the     └─ the
          calipers        foreman        machinist     laser          model      memory
                                                       cutter         loader     engine

PHASE 4: THE AGENTIC HARNESS (pi-mono)
──→ L17 Subprocess ──→ L18 Streaming ──→ L19 OODA Loop ──→ L20 Regex
       │                  │                 │                 │
       └─ how to          └─ how to         └─ how to        └─ how to
          execute?           stream            loop              parse
                             events?           safely?           output?
```

---

## Research & Strategic Source Coverage

### Primary Strategic Documents

| Document | Score | Lessons |
|----------|-------|---------|
| Strategic Decision: Orchestration Dichotomy | — | L03, L04, L05, L11, L12, L13, L19 |
| MY QUESTIONS TO CHATGPT (Origin Doc) | 186/200 | L09, L13, L14 |
| Building Effective Terminal Agents | 190/200 | L05, L08, L12, L17 |
| Pi Agentic Harness (`pi-mono`) | 190/200 | L17, L18, L19, L20 |
| DSPy: The End of Prompt Engineering | 185/200 | L03, L13 |
| Inside the Scaffold | 182/200 | L06, L11 |
| RLMs Are The New Reasoning Models (RAW.works) | 176/200 | L08, L10, L13 |
| OpenProse Specification | 173/200 | L02, L07, L09, L11 |
| Recursive Language Models (MIT CSAIL) | 192/200 | L08, L13, L14 |

### MCDA Audit Papers Referenced Per Lesson

| Tier | Papers | Lessons |
|------|--------|---------|
| **P0 Core** | Terminal Agents, TeachingCoach, RLM, ChatGPT Origin, Pi Harness | L05, L08, L12, L13, L17, L18, L19 |
| **P1 Essential** | DSPy, Inside Scaffold, Tutor-Student, RAW.works, SkVM | L03, L06, L11, L13, L18 |
| **P2 Important** | OpenProse, Aporia, Story2Proposal, Rogue Scalpel | L02, L07, L09, L20 |

---

## Execution Protocol

For each lesson (depth-first):
1. Load `python_ccp_syllabus_architect_skill.md` (educator context)
2. Load `Chapter_Syllabus.md` for that lesson (content directives)
3. Load the relevant prompt template (🔵, 🟡, 🟣, or 🚀)
4. Generate the full chapter following Prompt structure + Syllabus content
5. Verify word count, section completeness, CCP integration, defect catalogue accuracy
6. Save into the lesson folder as `.md` files
7. Generate interactive `.html` versions per SKILL.md protocol
8. Move to next layer before next lesson (depth-first)

---

## File Structure Per Lesson

```
Lesson_XX_Topic_Name/
├── Chapter_Syllabus.md        # Content directives for this lesson
├── 1_Capability.md            # Layer 1: What does this concept allow?
├── 1_Capability.html          # Interactive version with prediction gates
├── 2_Application.md           # Layer 2: Where does this appear in CCP?
├── 2_Application.html         # Interactive version with code reading exercises
├── 3_Orchestration.md         # Layer 3: Multi-context case studies across 6 CCP subsystems
├── 3_Orchestration.html       # Interactive version with cross-context reasoning
├── 4_Master.md                # Layer 4: How to command correct code
└── 4_Master.html              # Timed assessment: write contracts under pressure
```

---

## Governance

- **Prompts are immutable.** The 4 prompt template files define HOW to write. Never modify them.
- **Syllabi define WHAT.** Each Chapter_Syllabus.md specifies the content. The prompt + syllabus together produce the chapter.
- **CCP ecosystem is the only domain.** Every example, every exercise, every case study must come from the CCP architecture. No generic tutorials.
- **Accuracy is non-negotiable.** All CCP subsystem references must map to real architecture documented in the Launch Manual, PRD, or Strategic Decision papers. No invented module names.
- **Anti-Draft.** Governed by `launch_manual_governance_skill.md` for vocabulary, tone, and quality constraints.
- **No code-writing assessments.** The Master layer tests the ability to SPECIFY contracts and REASON architecturally, not to write production Python.
