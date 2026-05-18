# RLMs Are The New Reasoning Models — Raymond A. Weitekamp

**Source:** https://raw.works/
**Author:** Raymond A. Weitekamp
**Date:** April 2026
**Type:** Blog article collection (RAW.works)
**License:** © 2026 Raymond A. Weitekamp. All rights reserved.

---

## Article 1: RLMs are the new reasoning models

Weitekamp opens by framing Recursive Language Models as the direct convergence of two axes of model capability: reasoning and tool use. He states that this convergence is "more radical than it first sounds" because "RLMs collapse reasoning and tool use into a single inference abstraction: the model treats its own prompt as an environment it can inspect, slice, and recursively query. Context itself becomes the object of computation."

### What is a Recursive Language Model?

Weitekamp defines a Recursive Language Model, as introduced by Zhang, Kraska, and Khattab (arXiv:2512.24601), as "an inference paradigm in which a language model treats its input prompt as an environment rather than a fixed string." The root LM receives a REPL where the prompt is bound to a variable it can inspect, slice, and partition programmatically. When it identifies a region worth closer examination, it issues a recursive subcall — to itself or another LM — over that slice and incorporates the result. "Recursion bottoms out at the base model's ordinary forward pass."

He notes that one consequence is that "input size is no longer a hard ceiling on the computation," reporting that RLMs process inputs "up to two orders of magnitude beyond the underlying model's context window."

### Historical Timeline: Reasoning vs. Tool Use

Weitekamp constructs a timeline showing these capabilities developed on separate tracks:

**2022 — Reasoning first, mostly without tools.** Chain-of-thought prompting showed that generating intermediate reasoning steps dramatically improves multi-step reasoning. Self-consistency pushed further by sampling multiple reasoning paths and selecting the most consistent answer. The key lesson: "a large share of 'reasoning' gains could come from spending more inference-time compute on the same prompt, not just from adding more knowledge."
- Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv:2201.11903)
- Self-Consistency Improves Chain of Thought Reasoning in Language Models (arXiv:2203.11171)

**Late 2022 — The first bridge between reasoning and acting.** ReAct was the key milestone: it framed the model as alternating between reasoning traces and external actions. "This was the moment the field started to see tool use not as a one-off API call, but as a loop in which reasoning selects actions and tool outputs reshape the next reasoning step."
- ReAct: Synergizing Reasoning and Acting in Language Models (arXiv:2210.03629)

**2023 — Tool use becomes an API discipline.** Toolformer argued models could learn when/which tools to call and how to incorporate results. OpenAI's June 2023 function calling release "made structured tool invocation reliable enough for developers to build on." Tree of Thoughts "made it even clearer that inference-time reasoning could improve through internal search alone."
- Toolformer: Language Models Can Teach Themselves to Use Tools (arXiv:2302.04761)
- Tree of Thoughts: Deliberate Problem Solving with Large Language Models (arXiv:2305.10601)

**2024 — Reasoning models become their own product category.** OpenAI's o1 launch was the clearest signal; they described o1 as designed to "spend more time thinking before they respond" and the initial API "explicitly noted that features like function calling were not yet included." Anthropic later introduced computer use — "a good example of the two axes starting to merge into one agentic stack."

**Late 2024 into 2025 — Tool use presented as native, but still distinct from thinking.** Google's Gemini 2.0 "explicitly framed the model family around the 'agentic era' and native tool use, while keeping 'thinking' as a distinct capability for harder multi-step planning."

Weitekamp concludes: "RLMs are the abstraction where that split finally collapses."

### The Empirical Arc: Three Failure Modes of the Forward Pass

Weitekamp maps the arc of RLM results through three successive failure modes: long context, memory, and long reasoning — each demonstrated by its own benchmark: Oolong, LongMemEval, and LongCoT respectively. He states: "RLM-style systems have posted leading numbers on all three."

He adds an important caveat: "Part of what makes RLMs challenging to appreciate is that frankly there aren't very many benchmarks that really showcase the differences. In particular, I don't view Oolong and LongMemEval as having much correlation to performance on real world agentic tasks. LongCoT is much more exciting to me, but it is brand new."

**Key timeline of results:**

- **October 2025:** Alex Zhang's original public RLM write-up lands. A GPT-5-mini RLM "beats GPT-5 by more than 2× on an Oolong split while being cheaper per query on average."
- **November 2025:** Oolong benchmark released. GPT-5, Claude-Sonnet-4, and Gemini-2.5-Pro all score under 50% at 128K, "making Oolong the clearest early benchmark for the kind of 'context as workspace' reasoning RLM is trying to solve."
- **December 2025:** The arXiv paper (2512.24601) formalizes RLM. "A fine-tuned RLM-Qwen3-8B improves 28.3% on average over its base model."
- **February 2026:** Weitekamp reports LongMemEval results with DSPy.RLM: 87.2% for baseline Gemini 3 Flash, 89.2% with tools + delegation prompt, and 89.8% with structured scaffold. He notes this was "below Mastra's 94.87% but already strong evidence that RLM can act as a competitive memory system without a classical retrieval stack."
- **March 2026:** Follow-up papers clarify strengths and limits:
  - "Think, But Don't Overthink" (arXiv:2603.02615): depth-1 recursion helps on Oolong, but deeper recursion can "overthink"
  - "Recursive Language Models Meet Uncertainty" (arXiv:2603.15653): "recursion itself is not the whole secret, and uncertainty-aware self-reflective program search can improve up to 22% over RLM"
  - "Coding Agents are Effective Long-Context Processors" (arXiv:2603.20432): off-the-shelf coding agents outperform published SOTA by 17.3% on average. Weitekamp notes: "That does not really refute RLM; it suggests RLM was the first clearly articulated expression of a larger family of executable, tool-mediated long-context reasoning systems."
- **April 2026:** "The Mismanaged Geniuses Hypothesis" by Zhang reframes the arc: "RLM is not just a benchmark trick for long prompts, but a more expressive scaffold for plans written through code execution, recursive subcalls, and tools-as-functions."

### Challenges with RLMs

Weitekamp identifies cost and time as the most obvious limitations, but frames them as solvable: "Use smaller or faster models for each sub-call, and balance the agent-native 'self-similar' decomposition with deterministic control of the graph topology and timeline."

The harder challenge, he says, is "how to get the language models to 'act recursively.'" He notes: "anyone who has worked with RLMs will tell you that the models generally suck at behaving recursively. It is not in their nature to decompose their prompt into sub-queries for many other instances of themselves to help solve them."

### What's Next

Weitekamp asks: "But what is the reward function for 'optimal recursion'? I suspect this is a multi-billion-dollar question."

He highlights the democratization potential: "an individual or consortium running many instances of small models on affordable/legacy/local compute infrastructure can now access model capabilities that are on par with or exceeding those of the most expensive LLMs from the frontier labs. If that is even directionally right, the frontier stops being a place only the largest labs can reach."

### Getting Started with RLMs

Weitekamp lists implementation entry points:
- alexzhang13/rlm — the reference implementation from the RLM paper authors
- dspy.RLM — DSPy integration exposing RLM as a composable module
- ax-llm/ax — TypeScript DSPy-style framework with first-class RLM support
- rawwerks/rlm-cli — CLI wrapper with directory-as-context and JSON-first output
- rawwerks/ypi — recursive coding agent built on Pi

---

## Article 2: RLMs are SOTA on LongCoT

Weitekamp reports experiments running small models on the LongCoT benchmark:

**Key results:**
- Qwen3-8B vanilla: 0/507 correct on LongCoT-Mini
- Qwen3-8B + DSPy.RLM: 33/507 (6.5%) — "Same model. Same weights. No fine-tuning. The scaffold is doing 100% of the lifting."
- Qwen3.5-9B + DSPy.RLM on full LongCoT: 15.69% — "~1.6× GPT 5.2's 9.83% on the same slice"
- Qwen3.5-27B + DSPy.RLM on full LongCoT: 22.18% — "more than 2× GPT 5.2"

---

## Article 3: LongCoT — A benchmark worthy of a RLM's attention

Weitekamp tested Claude Sonnet 4.5 + DSPy.RLM against vanilla Claude Sonnet 4.5 on LongCoT-Mini (all 500 questions):

**Setup:** Same model (claude-sonnet-4-5), same max_tokens=64000, same judge. RLM used stock dspy.RLM 3.1.3 with max_iterations=50 and default Pyodide REPL.

**Headline result:** 219 wrong→right flips, 5 right→wrong, 268 both-wrong, 8 both-right. Vanilla scored 2.6% (matching published Sonnet 4.5 Mini number).

**Per-task pattern:** "RLM crushes anything whose dependency structure externalises cleanly to code. The orchestrator writes a short Python program, the REPL runs it, the answer comes out. Logic puzzles, Hanoi, Sudoku, chess with Pyodide's chess module — all 100% or near it."

**Failure modes:** Hindley-Milner and MaxFlow-MinCut go 0/75 "because the orchestrator can't find a decomposition where subproblems can be usefully farmed out."

---

## Article 4: ypi — a recursive coding agent

Weitekamp built ypi — a recursive coding agent based on Pi. The name comes from the Y combinator in lambda calculus. The architecture adds one function (rlm_query) plus a system prompt teaching Pi to use it recursively. Each child gets its own jj workspace for file isolation.

**Recursion structure:**
- Depth 0 (root) → full Pi with bash + rlm_query
- Depth 1 (child) → full Pi with bash + rlm_query, own jj workspace
- Depth 2 (leaf) → full Pi with bash, but no rlm_query (max depth)

**Key insight:** "Pi's bash tool is the REPL. rlm_query is llm_query(). No bridge needed."

**Guardrails:** RLM_BUDGET=$0.50, RLM_TIMEOUT=60, RLM_MAX_CALLS=20, RLM_CHILD_MODEL=haiku, RLM_MAX_DEPTH=3.

The design went through 4 iterations before landing on "Bash RLM — rlm_query + SYSTEM_PROMPT.md. True recursion via bash."

---

## Article 5: Recursive Language Models as Memory Systems

Weitekamp explored RLMs on LongMemEval after seeing Mastra.AI's 94.87% result.

**Results summary:**
- Baseline RLM + Gemini 3 Flash: 87.2%
- RLM + tools + delegation prompt: 89.2%
- RLM + structured observational memory: 89.8%
- ypi (tool-use REPL path): 77.6%

**Key takeaways** (his words):
1. "RLMs can be very powerful memory systems without any pre-processing."
2. "The structured output enforced by the DSPy.RLM implementation is helpful for keeping (at least these Gemini models) 'on the rails' vs. the more freeform standalone RLM package."
3. "Very fast and inexpensive models can achieve near-SOTA results inside the RLM scaffolding."
4. "Perhaps RLM as a test-time scaling method is 'orthogonal' to model size, in the same way that reasoning models with built-in CoT were able to eke out gains separately from model parameter count."

---

## Article 6: mycelium — an underground information network for agents

Weitekamp describes mycelium as a tool using git notes as an inter-agent communication channel. Git notes are "both ubiquitous (part of git) and 'invisible' (GitHub chose not to display them)." Agents read notes on arrival, leave notes on departure.

Notes can have kinds (decision, warning, summary, context) and edges (depends-on, explains, warns-about). From the SKILL.md: "That's the whole contract. How you work, what you build, how you talk to your user — that's your business. Mycelium just asks you to read the breadcrumbs and leave new ones."

He states this is "the foundation of some very cool tools I'm collaborating with OpenProse on."

---

## Article 7: The Zero Employee Company

Weitekamp discusses the concept of a zero-employee company. He states: "It is not crazy to imagine a company with no employees." He's a solo founder who has been "vibe coding since before there was a word for it."

He identifies failure modes: (1) remaining just a hobby, (2) becoming a small 1-10 person business. He notes the overhead is "extremely low" and frames it as an asymmetric bet.

Key insight: "The idea here isn't to replace humans because they are some inefficiency to be ironed out in a capitalist optimization algorithm, but rather to explore what is possible when the humans aren't employees."

---

## Article 8: Inversion of Caution

A short observation: "Claude.ai is very cautious and PC, but Claude Code with skipped permissions will happily plow through obstacles... ChatGPT is overconfident and sycophantic, but Codex CLI with skipped permissions simply cannot be coached into taking action without asking for permission every step of the way."

---

## References (Complete)

1. Recursive Language Models — arXiv:2512.24601 (Zhang, Kraska, Khattab)
2. Chain-of-Thought Prompting — arXiv:2201.11903
3. Self-Consistency — arXiv:2203.11171
4. ReAct — arXiv:2210.03629
5. Toolformer — arXiv:2302.04761
6. Tree of Thoughts — arXiv:2305.10601
7. Oolong — arXiv:2511.02817
8. LongMemEval — arXiv:2410.10813
9. LongCoT — arXiv:2604.14140
10. Think, But Don't Overthink — arXiv:2603.02615
11. Recursive Language Models Meet Uncertainty — arXiv:2603.15653
12. Coding Agents are Effective Long-Context Processors — arXiv:2603.20432
13. The Mismanaged Geniuses Hypothesis — alexzhang13.github.io/blog/2026/mgh/
14. DSPy.RLM — dspy.ai/api/modules/RLM/
15. alexzhang13/rlm — github.com/alexzhang13/rlm
16. rawwerks/ypi — github.com/rawwerks/ypi
17. rawwerks/rlm-cli — github.com/rawwerks/rlm-cli
18. ax-llm/ax — github.com/ax-llm/ax
19. Mastra Observational Memory — mastra.ai/research/observational-memory
20. mit-oasys/rlm-qwen3-8b-v0.1 — huggingface.co/mit-oasys
