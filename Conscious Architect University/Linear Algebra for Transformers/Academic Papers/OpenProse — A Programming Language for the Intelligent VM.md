# OpenProse — A Programming Language for the Intelligent VM

**Source:** https://openprose.ai/learn | https://github.com/openprose/prose/tree/main/skills/open-prose
**Author:** OpenProse (YC-backed, MIT Licensed)
**Date:** April 2026
**Type:** Open-source specification and framework
**License:** MIT
**Stats:** 1,000+ GitHub stars, 7,000+ installs

---

## Core Thesis

OpenProse's premise is stated directly: "A long-running AI session is a Turing-complete computer. OpenProse is a programming language for it."

The framing: "Last generation, you were a conversant with the model. This generation, you are a tool call to it."

### The Intelligent VM

OpenProse defines an "Intelligent VM" as a sufficiently intelligent model plus a harness. The harness needs three things: a loop (the clock), a REPL-like execution environment (the CPU), and a filesystem (memory and disk). "Give a capable model those three and it simulates a computer you can program — in English."

The observation: "Every SKILLS.md, every CLAUDE.md, every well-crafted system prompt is a program in English. Markdown is already the source. Coding agents are already the runtime. The discipline just doesn't have a name yet."

The problem OpenProse solves: "those programs are loosely typed. No dependency resolution. No inversion of control. No composition primitives. One file grows to a thousand lines and it starts to fray — the model loses the plot, agents collapse into each other, the same work gets done twice."

OpenProse proposes: "a subset of Markdown that supplies what's missing: contracts, shapes, semantic auto-wiring, and a catalog of composition patterns."

---

## Architecture: Two Concepts

### Component
A service with a contract. It may delegate to other components (via `shape`) or not. "There is no architectural distinction between a 'leaf' and a 'coordinator' — a component that delegates is just a component whose shape mentions other components. Same file format, same contract surface, same rules."

### Container
The intelligent orchestrator (`Forme` + harness) that reads all components, auto-wires them by contract matching, and executes the dependency graph. "Analogous to Spring's DI container, but wires by understanding rather than type matching."

### Mapping to Traditional Frameworks

| Traditional (Spring) | OpenProse Equivalent |
|---|---|
| `@Component` | `.md` file with `kind: service` |
| `@Autowired` | `requires` matched to `ensures` |
| `@SpringBootApplication` + `@ComponentScan` | `kind: program` with `services: [...]` |
| `@Test` | `kind: test` with `fixtures:`, `expects:`, `expects-not:` |
| `applicationContext.xml` | `manifest.md` |
| `new Service()` | `let` + `call` |

---

## Contract Markdown Format

Programs use valid Markdown with YAML frontmatter for metadata and Markdown sections for the contract. Multiple services per file via `##` headings. The entry point is whichever file has `kind: program`.

### Example Service Component

```yaml
---
name: researcher
kind: service
shape:
  self: [evaluate sources, score confidence]
  delegates:
    summarizer: [compression]
  prohibited: [direct web scraping]
---
```

```markdown
### Requires
- topic: a research question to investigate

### Ensures
- findings: sourced claims from 3+ distinct sources, each with confidence 0-1
- sources: all URLs consulted with relevance ratings
- if sources are unavailable: partial findings from cached data, flagged as stale

### Environment
- SEARCH_API_KEY: provided by the runtime for web search access

### Errors
- no-results: no relevant sources found for this topic

### Invariants
- audit log is appended with this invocation's outcome

### Strategies
- when few sources found: broaden search terms
- when many low-quality sources: prioritize academic and primary sources
```

### The Six Sections

The container wires on `requires` matched to `ensures`. The other four sections:

1. **requires** — inputs (what the service needs)
2. **ensures** — outputs (what the service commits to produce). "Ensures carries obligation. The VM reads it as a commitment to be evaluated, not a description of output shape."
3. **errors** — declared failure modes
4. **invariants** — truths that must hold
5. **strategies** — behavioral guidance for edge cases
6. **environment** — runtime infrastructure dependencies. "A service that `requires: api_key` is asking callers for credentials. A service with `environment: API_KEY` is declaring that the runtime must provide it — the program never constructs, passes, or logs the value."

---

## Three Levels of Specification

OpenProse offers three levels of control. "You trade adaptability for determinism, and you decide where on the spectrum to sit."

1. **Declarative (auto-wired):** `requires` + `ensures` only. Forme auto-wires like `@Autowired`.
2. **Declarative with explicit wiring:** Like `applicationContext.xml`. Manual binding specification.
3. **Imperative (pinned execution):** Explicit `let` + `call` sequences, like constructing with `new Service()`.

### Imperative Execution Block

```
### Execution
let { findings, sources } = call researcher
  topic: question
let evaluation = call critic
  findings: findings
  sources: sources
let report = call synthesizer
  findings: findings
  evaluation: evaluation
return report
```

Within execution blocks the full imperative grammar is available: `parallel:`, `loop until`, `for each`, `try/catch`, `if/elif/else`, `choice`.

---

## Forme: The Wiring Container

Forme is Phase 1 of a program run. It reads the contracts, resolves `requires` to `ensures`, and emits a manifest.

**Wiring algorithm:**
1. Read the entry point — find the file with `kind: program`
2. Resolve component files for each name in `services`
3. Read each component's contract — frontmatter, requires, ensures, errors, invariants, strategies, environment
4. Auto-wire — match requires to another component's ensures; exact name first, then semantic equivalence, then shape-informed signals
5. Build the dependency graph — topological sort for execution order; identify parallelization opportunities
6. Collect environment declarations with service attribution
7. Validate — circular dependencies, missing components, unresolvable requirements
8. Copy source files into the run directory at `services/{name}.md`
9. Write `manifest.md` — the complete wiring graph

---

## Composites: Parameterized Multi-Agent Topologies

A composite is a `kind: composite` program — a reusable structural pattern with named slots and config. Forme expands composites at wire time. Built-in patterns include:

- `worker-critic`
- `proposer-adversary`
- `dialectic`
- `ensemble-synthesizer`
- `witness`
- `ratchet`

A composite declares its shape with `### Slots` (what components it accepts), `### Config` (tunable parameters), and `### Delegation` (how slot components are invoked).

---

## Prose VM: Execution Engine

### Two-Phase Execution

| Phase | Who | Input | Output |
|---|---|---|---|
| Phase 1: Wiring | Forme | Component `.md` files | `manifest.md` |
| Phase 2: Execution | Prose VM | `manifest.md` | Program output |

### VM-Computer Mapping

| Traditional VM | OpenProse VM | Substrate |
|---|---|---|
| Instructions | Manifest graph entries | Host `spawn_session` calls |
| Program counter | Current position in execution order | Tracked in `state.md` |
| Working memory | Conversation history | Context window |
| Persistent storage | `.prose/` directory | Files on disk |
| Registers/variables | Named bindings | `bindings/{service}/{name}.md` |
| I/O | Tool calls and results | Host primitives |

### Key Design Principle

"Large language models are simulators. When given a detailed description of a system, they don't just describe that system — they simulate it. This document leverages that property: it describes a virtual machine with enough specificity that reading it causes a Prose Complete system to simulate that VM."

"But simulation with sufficient fidelity is implementation. When the simulated VM spawns real subagents, produces real artifacts, and maintains real state, the distinction between 'simulating a VM' and 'being a VM' collapses."

### Execution Steps

1. **Read the Manifest** — extract caller interface, graph, execution order, warnings
2. **Bind Caller Inputs** — from CLI args, config, calling program, or `ask_user`
3. **Create Working Directories** — `workspace/{service}/` and `bindings/{service}/`
4. **Execute Services** — for each service in order:
   - Check dependencies (all inputs must have bindings available)
   - Spawn session via `spawn_session` primitive
   - Receive confirmation
   - Copy declared outputs from workspace to bindings
   - Append completion marker to `state.md`
5. **Collect Program Output** — read final output from bindings
6. **Finalize** — append `---end` to `state.md`

### Host Primitive Adapter

| Primitive | Required Behavior |
|---|---|
| `spawn_session` | Start isolated agent/session with prompt, optional model, and access to declared I/O paths |
| `ask_user` | Pause execution for missing required caller input |
| `read_file` / `write_file` | Read and write `.prose/runs/{id}/` state artifacts |
| `copy_binding` | Copy declared output from `workspace/` to `bindings/` |
| `check_env` | Confirm environment variable exists without exposing value |

### Directory Structure

```
.prose/runs/{id}/
├── manifest.md
├── program.md
├── services/
│   ├── researcher.md
│   ├── critic.md
│   └── synthesizer.md
├── workspace/           (private working directories)
│   ├── researcher/
│   ├── critic/
│   └── synthesizer/
├── bindings/            (public outputs only)
│   ├── researcher/
│   ├── critic/
│   └── synthesizer/
├── state.md             (append-only execution log)
└── agents/              (persistent agent memory)
```

### Copy-on-Return Mechanism

"This is the 'return' in Prose."
- `workspace/` is private — the service writes freely, everything preserved for post-run inspection
- `bindings/` is public — only declared `ensures` outputs appear here
- "The copy is the publish step."

### State Tracking (state.md)

Event markers include:
- `N→ [input] name ✓` — Caller input bound
- `N→ service-name ✓` — Service completed
- `N→ ∥start a,b,c` — Parallel services started
- `N→ service-name ✗ error-name` — Service errored
- `N→ service ⇒ delegate` — Runtime delegation
- `---end TIMESTAMP` — Program completed
- `---error TIMESTAMP msg` — Program failed

### Runtime Delegation (Yield/Resume)

A running service can trigger another service at runtime via a yield/resume mechanism. Only services whose manifest entry includes a `delegates` block may delegate. A service yields by returning a delegation request instead of a completion message.

### Persistent Agents

Services can accumulate memory across sessions with three persistence scopes:

| Scope | Declaration | Path | Lifetime |
|---|---|---|---|
| Execution | `persist: true` | `.prose/runs/{id}/agents/{name}/` | Dies with run |
| Project | `persist: project` | `.prose/agents/{name}/` | Survives runs |
| User | `persist: user` | `~/.prose/agents/{name}/` | Survives projects |

### Composite Constraints Enforcement

| Constraint Type | Enforcement |
|---|---|
| Information firewall | Strip internal reasoning before copying to bindings |
| Termination bound | Count iterations; terminate at ceiling (e.g., `max_rounds`) |
| Monotonicity | Certified-progress ledger; each iteration must be superset of previous |
| Error propagation | If slot service errors during composite loop, terminate immediately |

---

## Prose Complete: Minimum Capability Threshold

"A System is Prose Complete if it can run a .prose program of arbitrary complexity."

Known Prose Complete harnesses run the same program on different "computers" (different agent hosts like Claude Code, Codex CLI, etc.).

---

## SKILL.md: Agent Activation Protocol

The SKILL.md defines when an agent should activate OpenProse:

### Recognition Signals
- ≥3 steps wanting different expertise
- A reuse signal ("every week," "each time a PR comes in")
- A natural retry loop (draft/critique/revise)
- Parallel exploration with synthesis step
- A "make sure X always happens" constraint
- Agent was already going to spawn subagents

### When OpenProse Is Wrong
- One-shot Q&A
- Real-time iteration tasks
- Anything finished in one response
- User explicitly said "just do it"

### Cognitive Model
"Think of OpenProse as a type system for agent workflows. A bare prompt is `any` — it runs, but nothing is checked. A contract is a typed function — inputs and outputs are declared, callers can reason about composition, and violations fail loudly. You would not write a 2,000-line TypeScript program in `any`. Multi-step agent workflows are the same."

---

## ProseScript: Imperative Layer

ProseScript provides imperative scripting for `.prose` files and `### Execution` blocks. Available constructs:
- `let` / `call` — variable binding and service invocation
- `parallel:` — concurrent execution
- `loop until` — bounded iteration
- `for each` — iteration over collections
- `try/catch` — error handling
- `if/elif/else` — conditional execution
- `choice` — selection logic
- `block` / `do` / `repeat` — flow control
- `agent` definitions — persistent agents within scripts

---

## Remote Programs & Dependencies

Resolution algorithm (shared between `prose run` and `use` statements):
1. Starts with `http://` or `https://` → fetch directly (no caching)
2. First path segment contains a dot → explicit git host; cache-first under `.deps/`
3. Ends with `@{version}` → pin to SHA or tag
4. Contains `/` → reserved for OpenProse registry (future)
5. Otherwise → local file path

Dependencies get pinned in `prose.lock` and installed into `.deps/` by `prose install`.

---

## Complete Command Reference

| Command | Action |
|---|---|
| `prose run <file.md>` | Execute a local `.md` program |
| `prose run <file.prose>` | Execute a ProseScript program |
| `prose run <host>/<owner>/<repo>` | Explicit git host |
| `prose run ...@<version>` | Pin to SHA or tag |
| `prose run ... --offline` | Never fetch; error if not in `.deps/` |
| `prose lint <file.md>` | Validate structure, schema, shapes, contracts |
| `prose preflight <file.md>` | Check dependencies and environment variables |
| `prose test <path>` | Run test(s) and report results |
| `prose install` | Install dependencies into `.deps/` |
| `prose inspect <run-id>` | Evaluate a completed run |
| `prose status` | Show recent runs |
| `prose status --graph` | Show run dependency graph |
| `prose help` | Show help and examples |
| `prose examples` | List or run bundled examples |
