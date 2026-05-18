## **Building Effective AI Coding Agents for the Terminal:** **Scaffolding, Harness, Context Engineering, and Lessons Learned**

**Nghi D. Q. Bui**


OpenDev


       - [https://github.com/opendev-to/opendev](https://github.com/opendev-to/opendev)


          - Codebase written in Rust


          - bdqnghi@gmail.com


**Abstract**


The landscape of AI coding assistance is undergoing a fundamental shift from complex IDE plugins to
versatile, terminal-native agents. Operating directly where developers manage source control, execute builds,
and deploy environments, CLI-based agents offer unprecedented autonomy for long-horizon development
tasks. In this paper, we present OPENDEV, an open-source, command-line coding agent written in **Rust**,
engineered specifically for this new paradigm. Effective autonomous assistance requires strict safety controls
and highly efficient context management to prevent context bloat and reasoning degradation. OPENDEV
overcomes these challenges through a compound AI system architecture [103] with workload-specialized
model routing, a dual-agent architecture separating planning from execution, lazy tool discovery, and
adaptive context compaction that progressively reduces older observations. Furthermore, it employs
an automated memory system to accumulate project-specific knowledge across sessions and counteracts
instruction fade-out through event-driven system reminders. By enforcing explicit reasoning phases and
prioritizing context efficiency, OPENDEV provides a secure, extensible foundation for terminal-first AI
assistance, offering a blueprint for robust autonomous software engineering.


**1** **Introduction**


The rapid advancement of large language models (LLMs) has catalyzed a new paradigm in software
development: AI-powered coding assistants that operate as autonomous agents [95, 99, 105]. Unlike
traditional code completion tools that suggest inline snippets, agentic coding assistants can reason about
complex tasks, execute multi-step plans, and interact with the development environment through tool use.
Comprehensive surveys have documented the explosive growth of code intelligence research [46, 47], and
roadmaps for Agentic Software Engineering [35] have formalized the methodological principles governing
human–AI collaboration. Systems such as SWE-Agent [95], OpenHands [84], and HyperAgent [69] have
demonstrated the potential of autonomous agents on standardized benchmarks. The commercial impact has
been equally dramatic, with GitHub Copilot surpassing 15 million developers [30], rapid revenue growth for
AI-native editors [4], and major labs launching autonomous coding agents [18, 65], signaling that agentic
coding has moved from research prototype to industrial deployment.


**The rise of terminal-native agents.** For the past few years, AI coding assistants have been tightly integrated
into IDEs, acting as reactive copilots requiring constant human oversight. Recently, a major shift has
begun, moving away from complex IDE plugins toward simpler command-line interfaces. Claude Code [2]
led this shift, demonstrating that a terminal-native agent could match or exceed IDE-integrated tools in
real-world software engineering tasks. The terminal is the operational heart of software development,
natively supporting source control, build systems, remote SSH sessions, and headless server environments.
Early systems such as Aider [28], CodeAct [83], and Open Interpreter [63] demonstrated the viability of
terminal-based AI pair programming and executable code actions. Today, every major AI lab offers a CLI
agent [2, 32, 65], alongside open-source alternatives such as Goose [10], OpenCode [19], and Crush [13].
However, realizing this potential is non-trivial. Benchmarks such as Terminal-Bench [57] and LongCLI

Figure 1: Overview of OPENDEV. Work is organized into concurrent sessions, each composed of multiple
specialized sub-agents; each agent executes typed workflows (Execution, Thinking, Compaction) that
independently bind to a user-configured LLM. This four-level hierarchy (session _→_ agent _→_ workflow _→_
LLM) enables fine-grained model selection, allowing cost, latency, and capability trade-offs to be optimized
per workflow.


Bench [25] demonstrate that even frontier models struggle with continuous terminal operation, underscoring
the need for purpose-built engineering solutions.


These benchmark results point to three fundamental engineering challenges that any long-running terminal
agent must solve: managing finite context windows over sessions that routinely exceed the model’s token
budget, preventing destructive operations when the agent can execute arbitrary shell commands, and
extending capabilities without overwhelming the agent’s prompt budget. We organize the architectural
response around two phases: _scaffolding_, which assembles the agent (system prompt, tool schemas, subagent
registry) before the first prompt, and the _harness_, which orchestrates tool dispatch, context management,
and safety enforcement at runtime [102] (Section 2.2). Yet the design space for terminal-native agentic tools
remains largely underexplored: most production systems are closed-source with undocumented architectural
decisions, and existing open-source frameworks either target benchmarks rather than interactive use or
lack published technical reports [39, 56]. Three critical open questions motivate this work: How should
multi-model architectures balance cost, latency, and capability across different cognitive tasks? What safety
mechanisms prevent destructive operations without hampering developer productivity? And how can
systems sustain long-running conversations within finite context limits?


In this paper, we present OPENDEV, an open AI-powered command-line agent for software engineering. To
the best of our knowledge, this is the first comprehensive technical report for an open-source, terminal-native,
interactive coding agent. Existing systems occupy one of two categories: benchmark-oriented frameworks
such as SWE-Agent [95] have published research papers but are primarily designed for automated evaluation
rather than interactive daily use; OpenHands [84] is both production-grade and well-documented but
operates through a browser-based UI rather than a terminal interface; CLI-native agents such as Aider [28],
Goose [10], OpenCode [19], Crush [13], and Gemini CLI [32] lack published technical reports documenting
their design decisions; and Claude Code [2] is CLI-native but neither open-source nor accompanied by a
published technical report. **The purpose of this paper is not to present a novel algorithmic breakthrough,**
**but rather to share the design decisions, trade-offs, and lessons learned from engineering a production-**
**ready, agentic coding system that bridges the gap between closed-source industrial practice and open**
**academic discourse.**


2


A central design principle of OPENDEV is that it is a **compound AI system** [103]: not a single monolithic
LLM, but a structured ensemble of agents and workflows, each independently bound to a user-configured
LLM (Section 2.2.5). This framing, articulated by Zaharia et al., argues that state-of-the-art AI results are
increasingly achieved by systems that compose multiple models, retrievers, and tools rather than relying
on a single model call. OPENDEV operationalizes this principle: its decoupled architecture makes the
system model-agnostic by construction, and techniques like learned model routing [62] can be applied at the
workflow level. Switching providers or optimizing cost requires only a configuration change, not a code
change. The system’s capabilities are therefore not fixed at deployment but continuously upgradeable as
better models emerge.


**Design principles and contributions.** The design of OPENDEV is guided by three overarching principles.
First, _separation of concerns_ : each architectural decision (model selection, context management, safety enforcement, tool dispatch) should be independently configurable and replaceable without affecting the others.
Second, _progressive degradation_ : the system should function gracefully as resources are exhausted, whether
that means token budget, iteration count, or network connectivity. Third, _transparency over magic_ : every
system action (tool calls, safety vetoes, context compaction, memory updates) should be observable and
overridable by the developer. These principles manifest in five concrete contributions:


1. **Per-workflow LLM configurability via a compound architecture.** Different execution phases impose
different demands on model capability, latency, and cost. We present a per-workflow LLM binding architecture where each cognitive workflow independently selects a model via user configuration (Section 2.2.5),
informed by the compound AI systems perspective [103] and model routing research [62].
2. **Extended ReAct execution pipeline.** We extend the standard ReAct cycle [99] with explicit thinking and
optional self-critique phases that separate deliberation from action (hereafter, the _ReAct loop_ ; Section 2.2.6),
and integrate staged context compaction directly into the reasoning loop, drawing on insights from context
engineering research [39, 56].
3. **Behavioral** **steering** **over** **long** **horizons.** We present event-driven system reminders that counteract
instruction fade-out in long-running sessions by injecting targeted guidance at the point of decision rather
than relying solely on the initial system prompt (Section 2.3.4). A conditional prompt composition pipeline
assembles agent instructions from independent, priority-ordered sections that load only when contextually
relevant, reducing prompt overhead while preserving comprehensive guidance (Section 2.3.1).
4. **Token-efficient extensibility and defense-in-depth safety.** We present a registry-based tool architecture
with lazy-discovered external tools via MCP [1] (Section 2.4.7) and a five-layer safety architecture that
enforces constraints at progressively lower levels of abstraction: prompt-level guardrails, schema-level tool
gating through dual-agent separation (Section 2.2), a runtime approval system with persistent permissions,
tool-level validation, and user-defined lifecycle hooks (Section 2.1).
5. **Context engineering as a first-class concern.** We treat context management as a first-class engineering
concern [3, 56], presenting Adaptive Context Compaction (Section 2.3.6), event-driven system reminders to
counteract attention decay (Section 2.3.4), and an experience-driven memory pipeline [66, 106] that accumulates project-specific knowledge. Our compaction and memory strategies align with the entropy-reduction
and minimal-sufficiency principles identified in recent theoretical work on context engineering [39, 101].


**Paper** **organization.** The remainder of this paper follows the path from construction to reflection to
context. Section 2 details what was built: the four-layer system architecture spanning agent reasoning,
context engineering, tooling, and persistence. Section 3 examines what was learned: five cross-cutting
design tensions that emerged during iterative development and the transferable lessons they yield. Section 4
positions these decisions within the broader research landscape, and Section 5 identifies future directions. The
appendix provides reference-level catalogs of tools, prompts, configuration schemas, and implementation
constants.


3


Figure 2: System architecture of OPENDEV, organized into four layers: Entry & UI, Agent, Tool & Context,
and Persistence. Arrows indicate primary data-flow directions.


**2** **System Architecture**


**2.1** **Overview**


Figure 2 illustrates the architecture of OPENDEV across four principal layers: Entry & UI, Agent, Tool &
Context, and Persistence. A user query flows through this pipeline sequentially, from the entry point through
agent reasoning and tool execution, before results are persisted and rendered.


**Entry & UI Layer.** The _CLI Entry Point_ parses arguments and bootstraps four shared managers (ConfigManager, SessionManager, ModeManager, and ApprovalManager), which are injected into all downstream
components. OPENDEV supports two frontends: a _TUI_ built on Textual using blocking modal approvals,
and a _Web UI_ backed by FastAPI and WebSockets using asynchronous polling approvals. Both implement a
shared UICallback contract, keeping the agent layer UI-agnostic.


**Agent Layer.** OPENDEV assigns five specialized model roles to distinct LLMs (Section 2.2.5), each lazily
initialized and informed by a locally cached capability registry. The system operates in two modes: _Normal_
_Mode_ with full read-write tool access for execution, and _Plan_ _Mode_ restricted to read-only tools for safe
planning (Section 2.2). Reasoning proceeds through the _Extended_ _ReAct_ _Loop_ (Section 2.2.6), which runs
four phases per turn: automatic context compaction when the token budget nears exhaustion; an optional
thinking phase for pre-action reasoning at configurable depth; an optional self-critique phase; and the
standard Reason-Act-Execute-Observe action phase.


**Tool** **&** **Context** **Layers.** The _Tool_ _Execution_ _Layer_ is built around a ToolRegistry that dispatches calls
to typed handlers covering file operations, process execution, and web access, with support for batch
parallel execution and on-demand MCP tool discovery (Section 2.4.7). A Skills system lazily injects reusable,
domain-specific prompt templates from a three-tier hierarchy (built-in, project, user). The _Context Engineering_
_Layer_ manages the LLM context window through four subsystems: System Reminders (Section 2.3.4) for
context-aware behavioral guidance, Prompt Composer for modular system-prompt assembly, Memory for
cross-session continuity, and Compaction (Section 2.3.6) for reclaiming token budget.


4


**Persistence** **Layer.** OPENDEV persists state across four stores: a _Config_ _Manager_ that resolves settings
through a project-local, user-global, environment-variable, and built-in default hierarchy; a _Session Manager_
that saves full conversation histories as JSON; a _Provider Cache_ that stores model capability metadata locally;
and an operation log that tracks file changes for rollback.


**Safety Architecture.** Because the agent can execute arbitrary shell commands, overwrite files, and spawn
persistent processes, a single safety mechanism is insufficient. OPENDEV therefore employs a _defense-in-_
_depth_ architecture with five independent safety layers (Figure 3), each designed to prevent a class of harm
independently so that no single point of failure compromises the system.





Figure 3: Defense-in-depth safety architecture. Five independent layers intercept dangerous actions at
progressively lower levels of abstraction, from model reasoning (Layer 1) to user-defined scripts (Layer 5).
Each layer operates independently; failure of any single layer does not compromise the remaining four.


Having established the four-layer overview, we now examine each layer in detail, beginning with the agent
core that implements the reasoning loop driving all agent behavior.


**2.2** **Agent Core Layer**


The agent layer sits between the UI and the tool execution layers (Figure 2). At its center is a single entry
point, MainAgent, which receives every user prompt and decides how to process it. Understanding this layer
requires two perspectives: how agents are _assembled_ before the first prompt arrives (scaffolding), and how
the assembled agent _processes_ user messages at runtime (the harness). In this context, a _harness_ is the runtime
orchestration layer that wraps the core reasoning loop and coordinates tool execution, context management,
safety enforcement, and session persistence around it [102]. Where scaffolding is concerned with constructing
the agent before the first prompt, the harness is concerned with everything that happens after: dispatching
tools, compacting context, enforcing safety invariants, and persisting state across turns. The subsections
below present these two phases in order, then detail each supporting component individually.


_**2.2.1**_ _**Agent Scaffolding**_


Before the agent can process user prompts, it must be fully assembled. Every agent in OPENDEV is
constructed (system prompt compiled, tool schemas built, subagents registered) before the conversation
lifecycle begins (Section 2.2.3). Understanding this construction pipeline clarifies why the runtime can treat
all agents uniformly regardless of their role.


**Type foundation:** **BaseAgent and AgentInterface.** All agents inherit from BaseAgent, an abstract base
class that accepts three constructor arguments (config, tool_registry, mode_manager) and defines four abstract methods: build_system_prompt() assembles the system prompt string, build_tool_schemas() returns
OpenAI-format tool schemas, call_llm() executes a single LLM call, and run_sync() runs a full ReAct loop.
The critical design choice is _eager construction_ : BaseAgent.__init__() calls both build_system_prompt() and


5


build_tool_schemas() before the constructor returns. By the time __init__() completes, the agent is fully
ready to serve requests, with no lazy prompt assembly, no first-call latency. A concrete refresh_tools()
method re-invokes both build methods when the tool registry changes (e.g., after MCP server discovery
or dynamic skill loading). Downstream code depends not on BaseAgent directly but on AgentInterface,
a @runtime_checkable Protocol requiring the same surface (system_prompt, tool_schemas, refresh_tools,
call_llm, run_sync), which decouples the factory from the concrete agent class.


**Single** **concrete** **agent** **class.** There is no class hierarchy of agent types. MainAgent is the only concrete
subclass of BaseAgent, and every agent in the system (the main agent, all builtin subagents, and any
user-defined custom agents) is an instance of this single class. Behavioral variation comes entirely from
construction parameters: allowed_tools (a list that filters which tool schemas appear in the agent’s schema,
or None for full access), _subagent_system_prompt (an override prompt set after construction), and an
is_subagent flag derived from whether allowed_tools is non-null. Within __init__, MainAgent sets four
HTTP client slots to None for lazy initialization, one each for the normal, thinking, critique, and VLM
providers, deferring API key validation until the first LLM call. It creates a ToolSchemaBuilder(registry,
allowed_tools) for schema generation and a bounded Queue(maxsize=10) for thread-safe message injection
from the Web UI. The lazy client slots correspond to the model roles described in Section 2.2.5: each
slot materializes a provider-specific HTTP client on first access, allowing agents to be constructed before
credentials are configured.


**Factory assembly.** AgentFactory is the single entry point for agent construction. Both the TUI and Web
UI invoke the same create_agents() method, ensuring identical setup regardless of frontend. The factory
executes three phases in strict order:


_Phase_ _1_ _(Skills)._ The factory discovers skill definitions from three directories (builtin, user global, and
project-local), creates a SkillLoader, and registers it with the tool registry so that the use_skill tool becomes
available.


_Phase 2 (Subagents)._ The factory creates a SubAgentManager, calls register_defaults() to compile the builtin
subagent specifications, then calls _register_custom_agents() to load any user-defined agents from configuration files. Finally, it registers the manager with the tool registry via set_subagent_manager(), which
makes the spawn_subagent tool available.


_Phase 3 (Main agent)._ The factory constructs a MainAgent with no tool filtering (full access to all registered
tools, including those added in Phases 1 and 2).


The ordering constraint is essential: Phase 2 must complete before Phase 3 because the spawn_subagent tool
description is dynamically built from the set of registered agents, and it must be present in the main agent’s
schema. The factory returns an AgentSuite dataclass bundling the main agent, the SubAgentManager, and
the SkillLoader.


**Subagent** **compilation.** Each subagent begins as a SubAgentSpec, a TypedDict containing a name, description, system prompt, optional tool allowlist, optional model override, and optional Docker configuration. When SubAgentManager.register_subagent(spec) is called, it executes a four-step pipeline: (1) resolve the tool list, defaulting to a hardcoded set of safe tools if none is specified; (2) create an AppConfig
copy with the model override if one is provided; (3) construct a MainAgent with allowed_tools set to
the resolved list, triggering the eager build of a filtered system prompt and tool schema; and (4) set
agent._subagent_system_prompt to the spec’s prompt override. The result is stored as a CompiledSubAgent
(name, description, agent instance, tool list). Construction is cheap because all subagents share the same
tool registry reference, with no cloning or deep copying. Runtime isolation comes from two mechanisms:
schema filtering at build time (the subagent never sees tools outside its allowlist) and message_history=None
at execution time (each invocation starts with a fresh context, as detailed in Section 2.2.7).


**Dependency** **injection.** Agent construction produces agents; runtime execution requires _services_ .
AgentDependencies is a Pydantic model carrying seven fields that tools need at execution time: mode_manager,


6


approval_manager, undo_manager, session_manager, working_dir, console, and config. The REPL or Web
UI constructs this object with all managers and passes it to agent.run_sync(). Inside the ReAct loop
(Section 2.2.6), individual managers are unpacked from the dependencies object and passed as keyword arguments to execute_tool(), keeping the tool registry interface flat: it does not depend on the
AgentDependencies model directly. Subagents receive a lightweight SubAgentDeps dataclass with only three
fields: mode_manager, approval_manager, and undo_manager. The omitted fields enforce an isolation boundary: subagents do not get session_manager (their messages are not persisted), console (output flows through
ui_callback), or config (each subagent carries its own configuration from construction).


**Design evolution.** Three design pivots shaped the current scaffolding architecture. First, an early class
hierarchy, with separate classes for planning agents, code-exploration agents, and web-generation agents,
was replaced by the single parameterized MainAgent. The hierarchy created a diamond problem when
subagents needed mixed capabilities (e.g., a web generator that also plans), and the parameterized approach
eliminated it entirely. Second, lazy prompt building (constructing the system prompt on the first run_sync
call) was replaced by the eager-build pattern. The lazy approach introduced first-call latency visible to the
user and caused race conditions with MCP server discovery: tools registered after the first call would not
appear in the prompt until a manual refresh. Eager building guarantees that every agent is complete at
construction time. Third, inline subagent definitions, where hardcoded agent construction within the main
agent’s code, were replaced by the SubAgentSpec registration system. This refactoring enabled custom agents
defined in configuration files to go through the same compilation path as builtin agents, unifying the two
code paths.


_**2.2.2**_ _**Agent Runtime Architecture**_


With scaffolding complete, the assembled agent is ready to process user messages. The runtime behavior is
governed by the agent harness, the orchestration infrastructure introduced in Section 2.2 that turns a stateless
LLM into a persistent, tool-using, self-correcting agent. Figure 4 maps this harness architecture: the ReAct
execution loop at the center, surrounded by the subsystems that feed it, constrain it, and persist its work.


**The central execution cycle.** The ReAct loop at the center of Figure 4 executes six phases per iteration:
pre-check and compaction, thinking, self-critique, action, tool execution, and post-processing. Each phase is
a distinct stage in the executor pipeline: pre-check drains injected messages and compacts under memory
pressure, thinking and self-critique produce optional chain-of-thought traces, the action phase calls the
LLM with full tool schemas, tool execution dispatches calls through the registry with approval checks, and
post-processing decides whether to iterate or return. The cycle repeats until the agent produces a final text
response with no tool calls, or until a safety cap is reached. Section 2.2.6 details the per-phase algorithms
and control flow.


**Input** **and** **output** **boundaries.** At the top of Figure 4, the Input Layer accepts user messages through
a thread-safe bounded queue, allowing follow-up messages to arrive while the agent is mid-execution.
Configuration and settings flow in alongside the message queue, providing the agent with its runtime
parameters (model selection, approval level, working directory). At the bottom, the Post-Processing path
handles three responsibilities after the loop terminates: persisting the updated conversation to the session
store, executing any registered Stop hooks, and returning the agent’s final response to the UI layer for
rendering.


**Supporting subsystems.** The periphery of Figure 4 shows seven subsystems, each addressing a distinct
concern and detailed in a dedicated section. The Prompt Composition engine (Section 2.3.1) assembles the
system prompt from modular sections (identity, safety policy, tool guidance, workflow rules, and dynamic
context), split into cacheable and non-cacheable segments for efficient API caching. The Tool Registry
(Section 2.4.1) dispatches each tool call to specialized handlers, with MCP tools discovered lazily at runtime.
The Safety System (Section 2.1) provides defense in depth through multiple independent layers, where
no single layer is relied upon exclusively and each catches a different failure mode. Context Engineering


7


Figure 4: The agent harness architecture: a detailed view of the Agent layer from Figure 2. The central ReAct
loop (six phases: pre-check and compaction, thinking, self-critique, action, tool execution, post-processing)
is surrounded by seven supporting subsystems. User messages enter through a message injection queue
(top). The Prompt Composition engine assembles modular sections by priority into the system prompt.
The Tool Registry dispatches to specialized handlers, with MCP tools discovered lazily. The Safety System
enforces multiple independent layers (approval, dangerous command detection, hooks, stale-read detection,
plan mode restrictions, doom loop detection, iteration cap, cooperative cancellation). Context Engineering
applies five-stage progressive compaction as the conversation grows. Memory and Session services provide
persistent strategy memory (playbook), session storage, and per-step undo via git snapshots. Subagent
Orchestration spawns isolated agent instances with filtered tool access for parallel exploration or specialized
tasks.


(Section 2.3.6) manages the conversation as a finite resource, applying progressively aggressive compaction
as token usage grows. Memory and Session services (Section 2.5) persist both the conversation transcript
and a playbook of learned strategies that evolve based on feedback. Subagent Orchestration (Section 2.2.7)
enables the main agent to delegate specialized tasks (code exploration, security review, web generation)
to isolated agent instances that share the same tool infrastructure but operate with filtered tool access and
independent conversation histories.


The key architectural decision is that the system operates in two distinct modes, _Plan Mode_ and _Normal Mode_,
with the agent transitioning between them based on user commands or prompt triggers. Figure 5 illustrates
this dual-mode flow.


**Routing:** **plan or execute.** When a user prompt arrives, the MainAgent checks whether it should enter Plan
Mode or proceed directly in Normal Mode. Two triggers activate Plan Mode: an explicit /plan command
from the user, or a heuristic that detects planning intent in the prompt (e.g., requests to “design,” “architect,”
or “plan” a change). All other prompts proceed in Normal Mode by default. This routing is a one-time
decision per prompt; the agent does not switch modes mid-execution unless the user explicitly requests it.


**Plan Mode:** **subagent-based planning.** Rather than switching the main agent into a restricted mode via
dedicated plan-management tools, OPENDEV delegates planning to a first-class Planner subagent. When
planning is needed, the main agent calls spawn_subagent(type="Planner"), which launches a subagent with
read-only tools and a specialized planning prompt. Write operations are excluded from the subagent’s


8


Figure 5: Dual-mode operation within the Agent layer (Figure 4). A user prompt enters the MainAgent, which
routes to either Plan Mode (left, read-only) or Normal Mode (right, full access). Plan Mode spawns a Planner
subagent that explores the codebase, analyzes patterns, and produces a structured plan for user approval.
Upon approval, the system transitions to Normal Mode, where the agent executes the planned steps with
full tool access. The user can re-enter Plan Mode at any point if unexpected results require re-planning.


tool schema entirely: the LLM never sees tool definitions it cannot use, eliminating the possibility of write
attempts during planning.


The Planner subagent executes in three stages visible in Figure 5. First, it _explores_ the codebase using readonly tools: reading files, searching code, listing directory contents, and resolving symbol definitions. Second,
it _analyzes_ the findings, identifying patterns, evaluating risks, considering trade-offs, and determining the
sequence of changes needed. Third, it _writes a structured plan_ to a file in the scratch directory, containing
seven sections: goal, context, files to modify, new files to create, implementation steps, verification criteria,
and risks.


Upon completion, the Planner returns the plan file path to the main agent. The main agent then calls
present_plan(plan_file_path), which displays the plan to the user for review. The user has two choices:
_revise_ (the main agent can spawn the Planner again with feedback) or _approve_ (the agent proceeds to execution
in Normal Mode). This design eliminates the need for a separate mode manager state: the main agent stays
in Normal Mode throughout, and planning is simply a subagent delegation.


**Normal Mode:** **full execution.** Normal Mode is the default and only operating state. The agent has full
access to all tools, including file reading, file writing, code editing, command execution, and subagent
spawning. After a plan is approved via present_plan, the agent works through the planned steps, using the
task management tools to track progress.


During execution, if the agent encounters unexpected results (such as a test failure that reveals a deeper
issue, a dependency conflict, or a scope change), it can spawn the Planner subagent again with the current
codebase state as context, producing a revised plan that accounts for what has changed since the original
plan was approved.


9


**Rationale** **for** **subagent-based** **planning.** The initial design used a four-tool state machine
(enter_plan_mode, exit_plan_mode, create_plan, edit_plan) that switched the main agent into a restricted
planning state. This was brittle: the agent sometimes failed to exit plan mode, leaving the system stuck in a
read-only state requiring manual intervention.


The current design eliminates this state machine entirely. Planning is delegated to a Planner subagent with a
schema that contains only read-only tools, enforcing the separation at the schema level rather than through
runtime permission checks. The Planner cannot write because write tools do not exist in its schema, not
because a runtime check blocks the attempt. This yields three advantages: (1) no state machine means no
risk of getting stuck in plan mode; (2) the Planner can be spawned concurrently with other subagents (e.g., a
Code Explorer for parallel analysis); and (3) the tool surface is reduced from four tools to one (present_plan),
reducing cognitive load on the LLM.


_**2.2.3**_ _**Conversation Lifecycle**_


Figure 6 traces the end-to-end path of a single user message through the system, from initial input to final
session persistence.


Figure 6: Sequence diagram of a single conversation turn in OPENDEV. A user message enters through one
of three interfaces, passes through query processing, and enters the ReAct iteration loop. Each iteration
comprises context management, optional thinking, an action LLM call, and tool dispatch through the registry.
The loop continues until the agent signals completion or a termination condition is met, after which the
conversation state is persisted.


**Input** **ingestion** **and** **query** **processing.** User input arrives through one of three entry paths: a noninteractive CLI invocation that creates a one-shot session, the TUI that wraps an interactive REPL, or the
Web UI that accepts messages over WebSocket. All three paths converge on the same agent execution core.
The TUI path applies a pre-processing stage before entering the ReAct loop: persisting the message to the
session store, firing lifecycle hooks that can inspect or modify the query, expanding inline file references (e.g.,
@file) into their contents, and assembling the message list in the format expected by the LLM API. The Web
and CLI paths invoke the agent directly without pre-processing.


**The iteration cycle.** Each iteration of the ReAct loop follows a fixed sequence. First, the executor drains any
messages that the UI thread injected since the last iteration, such as follow-up instructions or system signals


10


delivered through a thread-safe queue. Second, the context compactor checks token utilization against the
context window and applies reduction strategies if pressure is rising (Section 2.3.6 describes the compaction
mechanism). Third, if thinking mode is enabled, a separate LLM call produces a reasoning trace without
tool access, preventing premature action. Fourth, the action model receives the full conversation, including
any thinking trace, along with the available tool schemas, and returns a response that may contain text, tool
calls, or both. When tool calls are present, the executor dispatches them through the tool registry: read-only
tools run in parallel via a thread pool (up to five concurrent calls), while write tools run sequentially. If a tool
call delegates to a subagent, that subagent runs in an isolated context with filtered tool access and returns a
summary to the parent agent.


**Completion and persistence.** The loop terminates through one of four paths: the agent responds with
text and no tool calls (implicit completion), the agent explicitly signals done via a completion tool, the
error-recovery budget is exhausted (the system injects up to three targeted recovery messages per error
sequence (Section 2.3.5)), or the iteration count reaches the safety limit. Before accepting termination, the
system checks for incomplete task items and pending messages in the injection queue (a thread-safe channel
through which the UI can deliver messages mid-execution), deferring completion if either condition holds.
Once accepted, the final conversation state is saved to the session store.


**Lifecycle** **hooks.** OPENDEV exposes lifecycle events that external scripts can observe or intercept: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PostToolUseFailure, SubagentStart,
SubagentStop, Stop, PreCompact, and SessionEnd. Hook commands are configured via JSON in global or
project settings and receive event context on stdin as JSON. Blocking events (PreToolUse, UserPromptSubmit,
SubagentStart) can prevent the operation (exit code 2 returns a block reason to the agent), mutate tool arguments (stdout JSON with tool_input key), or override approval decisions. Non-blocking events fire asynchronously after the operation completes. Global and project hooks merge by appending project matchers
after global matchers per event type, enabling organization-wide policies combined with repository-specific
hooks (e.g., “run eslint after file edits”).


**Cross-cutting concerns.** Three mechanisms operate across all phases of the lifecycle.


_Interrupt tokens_ propagate cancellation requests from the UI to the agent thread, polled at six phase boundaries
within each iteration (before and after thinking, before action, during tool execution, and at iteration
boundaries). The interrupt system addresses several race conditions through targeted fixes: modal controllers
(ask-user dialogs, plan approval) take priority over agent interrupts to prevent orphaned UI state; subprocess
creation uses process groups (start_new_session=True) so that os.killpg reliably terminates child processes;
and a one-shot guard prevents duplicate interrupt messages from rapid key presses.


A _thread-safe injection queue_ allows users to send follow-up messages while the agent is mid-execution; these
messages are drained at iteration boundaries and checked before completion, ensuring that no user input is
silently dropped.


_Session cost tracking_ records cumulative token usage and cost after each LLM call via a CostTracker service
that computes cost from the API’s reported token counts and the model’s pricing metadata; running totals
are displayed in the TUI status bar and persisted in session metadata for resumption across --continue
invocations.


_**2.2.4**_ _**REPL Command Dispatch**_


The conversation lifecycle described above assumes that user input enters the agent reasoning loop. However,
not all input requires LLM involvement. Session management, mode switching, model selection, and MCP
server configuration are deterministic operations that can be handled directly by the REPL without invoking
the agent. The system therefore implements a dual-path dispatch at the input boundary: if the input begins
with a “/” prefix, it is routed to a registered command handler; otherwise, it proceeds to the query processor
and enters the agent loop. Figure 7 illustrates this architecture.


11


Figure 7: Dual-path input dispatch in OPENDEV. User input is classified at the REPL boundary: slash
commands (top path) are routed through the REPL Command Dispatcher to one of nine registered command
handlers, each of which modifies system state directly and returns a CommandResult. Natural language
queries (bottom path) pass through the Query Processor into the Agent Loop, which interacts with system
state through tool execution. Both paths ultimately produce side effects on shared system state, but through
fundamentally different mechanisms: commands execute deterministically without LLM involvement, while
queries are processed through the full reasoning loop.


**Command handler abstraction.** All command handlers extend a common abstract base class that provides
the handler interface and standardized output formatting. Each handler receives a reference to the REPL
instance at construction, granting access to the shared managers (session, mode, configuration, MCP)
through explicit dependency injection rather than global state. The handler’s handle(args) method performs
argument parsing, executes the operation, and returns a CommandResult containing a success flag, a humanreadable message, and optional structured data. Commands with subcommands (e.g., /mcp connect, /agents
create) perform a second-level split on the argument string and dispatch internally to the appropriate
method.


**Handler** **categories.** As shown in Figure 7, nine handler classes cover the system’s interactive control
surface. _Session commands_ (/clear, /compact) manage conversation state: clearing saves the current session
and starts fresh, while compacting triggers context reduction on demand. _Mode commands_ (/mode) switch
between normal and plan mode by setting a pending flag that the query processor reads on the next user
query. _Configuration commands_ (/models) present an interactive model selector that, upon selection, triggers a
full agent rebuild with the new model configuration. _MCP commands_ (/mcp) expose eleven subcommands
for managing Model Context Protocol servers: connecting, disconnecting, listing tools, and testing server
health. _Agent_, _skills_, and _plugin commands_ manage custom agent definitions, reusable prompt templates, and
third-party extensions, respectively. _Tool commands_ (/init) initialize codebase context, and a _help command_
lists all available commands.


**Side effects on system state.** Commands do not produce isolated outputs; they modify shared state that
subsequent agent interactions depend on. As depicted in the right column of Figure 7, both command
handlers and the agent loop converge on the same system state. For example, /models triggers a full
reconstruction of the agent factory, rebuilding tool registries and system prompts with the new model’s
capabilities. /mcp connect discovers and registers new tools from the connected server, expanding the tool
schemas available to the agent on its next turn. /mode plan sets a flag that causes the query processor to
activate planning behavior on the next query. These side effects are the primary mechanism through which
commands influence agent behavior without directly entering the reasoning loop.


12


**Separation from agent tools.** The distinction between REPL commands and agent tools is architectural,
not incidental. Commands are triggered by the user typing a slash prefix, executed synchronously by the
REPL, and require no LLM involvement, no tool-use hooks, no approval gates, and no undo tracking. Agent
tools, by contrast, are selected by the LLM during reasoning, executed through the tool registry with preand post-execution hooks, subject to user approval based on the configured autonomy level, and tracked by
the undo manager. Commands operate on the REPL instance; tools operate within a run context that carries
agent dependencies. This separation ensures that system-level operations (changing models, managing
servers, resetting sessions) remain fast and predictable, while delegating open-ended problem-solving to the
agent loop.


_**2.2.5**_ _**Workload-Optimized Multi-Model Architecture**_


A core realization of the compound AI systems paradigm [103] is that different execution phases benefit
from different model capabilities. Reasoning tasks benefit from extended thinking without tool distraction.
Visual tasks require vision-language models. Bulk summarization benefits from cheaper, faster models.
Using a single model for all tasks either wastes cost (using expensive models for simple tasks) or sacrifices
quality (using cheap models for complex reasoning). Three approaches were considered: a single model
for everything (simple but inflexible), task-specific routing (adopted here, which introduces complexity
in selection logic but enables workload optimization), and ensemble execution (maximum quality but
prohibitive latency and cost).


**Five model roles with fallback chains.** Five distinct workload categories route to specialized models:


_•_ **Action model:** Primary execution model for tool-based reasoning. Default for all workloads unless a
specialized model is specified.

_•_ **Thinking model:** Optional model for extended reasoning without tool access. Enables focus on strategic
planning without tool-calling pressure. Fallback: action model.

_•_ **Critique model:** Optional model for self-evaluation. Inspired by Reflexion [74] but applied selectively
rather than on every turn. Fallback: thinking model _→_ action model.

_•_ **Vision model:** Vision-language model for processing screenshots and images. Essential for visual debugging tasks. Fallback: action model if vision-capable.

_•_ **Compact model:** Smaller, faster model for summarization during context compaction. Prioritizes speed
and cost over reasoning depth. Fallback: action model.


**Provider abstraction and caching.** Each model selection triggers lazy initialization of provider-specific API
clients, reducing startup latency, as only models actually used in a session are initialized. Model capabilities
(context length, vision support, reasoning features) are cached locally with time-to-live refresh, enabling
offline startup and background updates following a stale-while-revalidate pattern. The cache trades potential
staleness for startup reliability, with background refresh ensuring eventual consistency.


_**2.2.6**_ _**Extended ReAct Execution Loop**_


Once a mode is selected, the agent processes each user query through the ReactExecutor, which implements
an extended version of the Reason-Act loop [99] (referred to simply as the _ReAct loop_ throughout this paper).
Figure 8 illustrates the full execution pipeline.


Standard ReAct [99] interleaves reasoning and action in the same turn, which limits deliberation. Tool
schemas consume context and create pressure to act quickly rather than think deeply. Four approaches were
considered: pure ReAct (simple but biased toward premature action), chain-of-thought prompting (inflexible
because it cannot adapt depth to task complexity), a separate thinking phase (enables depth control and
prevents premature tool use), and Reflexion-inspired self-critique loops (maximum quality but doubles
thinking latency). OPENDEV combines the latter two: an explicit thinking phase before action, with optional
self-critique for complex tasks.


13


Figure 8: Detailed view of the ReAct loop at the center of Figure 4. Each user query passes through an
initialization stage that creates an IterationContext, then enters an iteration loop (_run_iteration_inner)
consisting of four phases: context management, thinking, action, and decision. The loop continues until the
agent produces a final response, explicitly signals completion, or exhausts its iteration budget.


**Initialization.** When a query arrives, the executor clears any pending injection queue, creates an interrupt
token for cancellation support, wraps the conversation history in a ValidatedMessageList (which enforces
correct message alternation), and bundles everything into an IterationContext. This context object carries
all per-query state: iteration counters, one-shot guard flags (to prevent duplicate signals), and references to
shared services such as the tool registry and approval manager.


**Phase 0:** **Staged context management.** At the start of each iteration, the executor drains the injection queue
and runs the _staged compactor_ . The compactor monitors token utilization against the context window and
applies five progressively aggressive reduction strategies as pressure rises: warning (70%), observation
masking (80%), fast pruning (85%), aggressive masking (90%), and full LLM-based compaction (99%).
Section 2.3.6 details each stage; the key property is that cheaper strategies (masking, pruning) often reclaim
sufficient space, avoiding the cost of full LLM summarization.


**Phase 1:** **Thinking.** If thinking mode is enabled, the executor calls a separate thinking LLM with a tool-free
copy of the conversation. This model produces a reasoning trace (a structured analysis of the current situation,
potential approaches, and risks) without access to tools, so it cannot take premature action. Separating
thinking from action prevents premature tool use: when tools are available, models tend to act quickly
rather than think deeply. Four configurable depth levels (OFF, LOW, MEDIUM, HIGH) let users balance
latency against deliberation quality on a per-task basis. At the HIGH level, self-critique is automatically
included: a critique model evaluates the initial trace, and the thinking model refines its reasoning with the
critique as additional input. An earlier design exposed self-critique as a separate fifth level, but users found
the distinction confusing; merging it into HIGH simplified the interface without reducing capability, since
users who want deep thinking invariably benefit from critique as well. The final trace is injected into the
conversation as a system reminder, making the reasoning visible to the action model in the next phase.


**Phase** **2:** **Action.** The executor assembles the full action prompt: the system prompt (composed by
PromptComposer from priority-ordered sections), selected memory bullets from the ACE playbook (Section 2.3.6), all tool schemas, and the conversation history including any injected thinking trace. This prompt


14


**Algorithm 1** Extended ReAct Loop with Five-Stage Compaction and Doom-Loop Detection


**Require:** User message _m_, Agent _A_, Tool registry _T_, Session _S_
**Ensure:** Response summary, error status, latency

1: _S_ .add( _m_ ); nudge_count _←_ 0; fingerprints _←_ deque(maxlen = 20)
2: **repeat**
3: **// Phase 0:** **Staged Context Management**
4: _p ←_ token_count( _S_ )/max_context _▷_ Context pressure
5: **if** _p >_ 0.99 **then** _S_ _←_ compact( _S_ ) _▷_ Full LLM summarization
6: **else if** _p >_ 0.85 **then** prune_old_tool_outputs( _S_ ) _▷_ Fast pruning pass
7: **else if** _p >_ 0.80 **then** mask_old_observations( _S_ ) _▷_ Replace old tool results with refs
8: **else if** _p >_ 0.70 **then** log_warning( _p_ )
9: **end if**
10: **// Phase 1:** **Thinking (if enabled)**
11: **if** thinking_level _̸_ = OFF **then**
12: trace _←A_ .call_thinking_llm( _S_ ) _▷_ No tools
13: **if** thinking_level = HIGH **then** _▷_ HIGH includes self-critique
14: critique _←A_ .call_critique_llm(trace)
15: trace _←A_ .refine(trace, critique)
16: **end if**
17: _S_ .add_trace(trace)
18: **end if**
19: **// Phase 2:** **Action**
20: response, tool_calls _←A_ .call_llm( _S_, _T_ ) _▷_ With tools
21: **if** tool_calls _̸_ = ∅ **then**
22: **// Doom-loop detection**
23: **for** tc _∈_ tool_calls **do**
24: fingerprints.append(md5(tc.name, tc.args))
25: **end for**
26: **if** max(Counter(fingerprints).values()) _≥_ 3 **then**
27: approval_pause(“repeated tool call detected”)
28: **else**
29: **for** tc _∈_ tool_calls **do**
30: result _←T_ .execute(tc); _S_ .add(tc, result)
31: **end for**
32: **end if**
33: **else**
34: **if** last tool failed _∧_ nudge_count _<_ 3 **then**
35: _S_ .add(get_smart_nudge(error)); nudge_count += 1
36: **else break** _▷_ Implicit completion
37: **end if**
38: **end if**
39: **until** task_complete called _∨_ max iterations reached
40: **return** summary, error, latency


is sent to the action LLM, which returns a response that may contain text, tool calls, or both. The API’s
reported token count is used to calibrate the compactor’s utilization estimates for Phase 0 of the next iteration.


**Phase** **3:** **Decision,** **dispatch,** **and** **doom-loop** **detection.** The executor branches based on whether the
action model produced tool calls. If no tool calls are present: when the previous tool failed, the executor
classifies the error (permission denied, file not found, syntax error, rate limit, etc.) and injects a targeted


15


recovery nudge (Section 2.3.5); when there are incomplete todos, it nudges the agent to continue; otherwise,
a text-only response with no error signals task completion, and the loop terminates.


If tool calls are present, the executor first performs _doom-loop detection_ with a two-tier escalation: each tool
call is fingerprinted as an MD5 hash of the tool name and its arguments, and fingerprints are tracked in a
sliding window of the 20 most recent calls. If any fingerprint appears 3 or more times, the system injects a

[SYSTEM WARNING] message into the conversation (e.g., “ _the agent has called_ read_file _with the same arguments_
_3 times; try a different approach_ ”) and skips tool execution for that turn. If the same fingerprint recurs after
the warning, the system escalates to an _approval-based pause_ via the ApprovalManager, presenting the user
with “ _Agent is repeating the same action._ _Allow / Break?_ ” On “Allow,” execution resumes with a one-shot guard
that permits the action once before re-arming detection. On “Break,” a guidance message is injected into the
conversation and the loop resets.


This two-tier approach is more robust than warnings alone: LLMs can ignore injected text, but they cannot
bypass a genuine execution halt. Pre-existing safeguards (iteration caps, consecutive-read counters) are too
coarse: they trigger on any repeated tool type rather than on identical _(tool, arguments)_ pairs, and they activate
only after many more iterations. Fingerprint-based detection catches stuck loops within 3 repetitions.


When no doom loop is detected, the executor selects an execution strategy (parallel via thread pool for
independent calls, sequential for dependent ones), runs the tools through the registry, and records each
outcome. After execution, the results feed into the ACE memory pipeline, where a Reflector analyzes what
worked and a Curator updates the playbook with new lessons for future queries. The loop then returns to
Phase 0 for the next iteration.


**Termination and completion detection.** The loop ends through one of four paths: the agent explicitly calls
a completion tool with a summary and status (success or failure); the agent produces a text response with
no tool calls and no error condition (implicit completion); the error-recovery nudge budget is exhausted
(three consecutive failed attempts); or the iteration count reaches a configurable safety limit. If outstanding
task items remain when the agent signals completion, the system injects additional nudges to address them
before accepting termination to prevent premature completion with incomplete work. In all cases, the final
conversation state is persisted to the session store.


**Design evolution.** Early experiments applied self-critique on every thinking output; this proved too slow
for routine operations, motivating selective activation only at the HIGH thinking level. Doom-loop detection
was added after observing agents repeatedly calling the same tool with identical arguments (e.g., reading a
non-existent file in a loop); existing safeguards based on iteration counts and consecutive-read counters were
too coarse to catch this pattern. Staged compaction (Section 2.3.6) and todo-based completion validation
(Section 2.3.4) addressed additional failure modes discovered during this phase.


_**2.2.7**_ _**Subagent Orchestration**_


Some tasks benefit from focused expertise (codebase exploration, user clarification) while others require
coordination with main agent state (task management). The main agent can spawn specialized subagents
for specific subtasks, each with filtered tool access and specialized prompts. Subagents execute in isolated
contexts with their own iteration budgets, preventing unbounded execution.


**Subagent specialization.** Different subagents serve different roles:


_•_ **Code explorer:** Read-only tools for codebase navigation. Specialized for understanding existing code
structure.

_•_ **Strategic planner:** Read-only tools plus extended reasoning. Focuses on high-level planning without
execution.

_•_ **Web tools:** Web fetching and file writing for cloning web content. Combines retrieval with persistence.

_•_ **User clarification:** Minimal toolset for gathering input. Focuses on eliciting information without distraction.


16


**Tool** **filtering** **rationale.** Subagent capabilities are deliberately restricted for three reasons. First, task
management tools are excluded from subagents so that only the main agent coordinates todo lists, preventing
race conditions and inconsistent state. Second, limited tool access reduces context size and focuses each
subagent on its specific role, meaning an exploration subagent does not need write capabilities. Third,
restricted tools limit the blast radius of errors: an exploration subagent cannot accidentally modify files.


**Parallel execution.** The main agent can spawn multiple subagents concurrently (each in its own thread) for
independent queries such as parallel file searches, codebase exploration, or web fetches. The system prompt
explicitly guides the agent on when and how to parallelize: when the user requests multiple independent
analyses, when exploring a large codebase, or when tasks have no data dependencies. Making multiple
spawn_subagent calls in the same response triggers automatic parallel execution. Upon completion, the
agent is instructed to synthesize all subagent results into a single unified response organized by topic, rather
than summarizing each agent separately. This trades thread overhead for latency reduction on independent
operations.


**Subagent prompt refinements.** Subagent prompts include explicit termination conditions to prevent overexploration. The Code Explorer subagent has stop conditions (“ _stop when evidence is clear_,” “ _stop if progress_
_stalls_,” “ _prefer depth over breadth_ ”) and an anti-loop instruction (“ _re-reading the same file triggers immediate stop_ ”).
The Planner subagent is instructed to include the plan_file_path in its completion summary so the main
agent can immediately pass it to present_plan. The thinking-mode prompts encourage spawning Code
Explorer subagents for tasks requiring deep codebase analysis.


**Design evolution.** Early versions gave subagents the same tools as the main agent. This caused context
pollution, role confusion, and conflicts when both agents attempted to update todos simultaneously. Restricting each subagent’s tool set to its specific role improved both focus and efficiency. Early subagent prompts
lacked clear stop conditions, leading to unbounded exploration where the Code Explorer would read the
same files repeatedly; adding explicit stop conditions and anti-loop instructions resolved this.


The agent core produces reasoning traces and tool calls; the Context Engineering Layer, described next,
manages what the model sees at each step, shaping the inputs that determine every decision the agent
makes.


**2.3** **Context Engineering Layer**


LLM-based agents do not simply send user messages to a model and receive responses. The quality of
every response is determined primarily by what the model is allowed to see in its context window: which
instructions it receives, how much conversation history is retained, what it has learned from prior interactions,
and how relevant external information is assembled before each call [39, 56, 101]. We refer to the set of
mechanisms that manage this window collectively as the _Context Engineering Layer_ [39, 56, 101].


Figure 9 shows the subsystems and their interactions. A user query enters via the QueryProcessor, which
hands off to ContextPicker for context assembly. The assembled context passes through ContextCompactor
for token-budget enforcement before entering the ReAct reasoning loop. Each turn, the result flows back to
the SessionManager for persistence, and tool outcomes that represent learning opportunities are processed
by the adaptive memory subsystem. The remainder of this section presents each subsystem in the order
it first influences the context window within a session. A final subsection (Section 2.3.7) synthesizes these
components into a unified end-to-end pipeline from user query to LLM API call.


_**2.3.1**_ _**Dynamic System Prompt Construction**_


In an LLM-based agent, the system prompt is the primary instrument of behavioral control: it encodes the
agent’s identity, capability boundaries, safety constraints, and task conventions. Every behavioral property
that cannot be enforced through code, how the agent reasons, which tools it prefers, how it recovers from


17


Figure 9: Expanded view of the Tool & Context layer from Figure 2. Six subsystems cooperate to fill
and maintain the model’s context window across a session. The subsystems are presented in lifecycle
order: dynamic system prompt construction initializes behavioral instructions; dual-memory and tool result
optimization shape what enters the context; system reminders and error recovery inject targeted guidance at
runtime; and adaptive context compaction manages overflow when the token budget nears exhaustion.


errors, is expressed as natural language in the system prompt. Getting this prompt right at startup is
therefore not a minor configuration detail; it is the central initialization problem.


A naive approach loads a single monolithic prompt containing every possible instruction. This has two
compounding costs. First, sections that are irrelevant to the current session (such as git workflow rules in
a non-repository directory, subagent orchestration guidance when subagents are unused, or task-tracking
instructions when the feature is disabled) consume context-window budget without contributing any
behavioral value. Second, irrelevant instructions dilute the sections that _do_ matter, making the agent’s
behavior noisier. The fix is not to trim the prompt by hand, but to make loading _context-sensitive_ from the
start.


**Priority-ordered conditional composition.** OPENDEV assembles each agent’s system prompt at runtime
through the pipeline illustrated in Figure 10. Behavioral instructions are factored into independent _sections_,
each stored as a separate markdown file and registered with two metadata fields: a _condition_ predicate over a
runtime context dictionary (None means always include), and a _priority_ integer that controls reading order.
At initialization the PromptComposer executes four steps:


1. **Filter.** Evaluate each section’s predicate against the current environment snapshot. Sections that return False are excluded before any file I/O occurs. For example, main-git-workflow.md is gated on
in_git_repo; it is never loaded when the working directory is not a repository.
2. **Sort.** Order the surviving sections by ascending priority: lower values appear earlier, placing identity and
persona rules before environment-derived context.
3. **Load.** Read each markdown file, strip human-readable frontmatter, and resolve ${VAR} placeholders via a
centralized name registry that decouples template prose from concrete tool identifiers.
4. **Join.** Concatenate loaded sections and append to the core role text and dynamically collected environment
block, producing the complete system prompt.


18


Figure 10: Detailed view of the prompt composition subsystem from Figure 9. Sections are registered with
optional condition predicates and priority values. At agent initialization the PromptComposer evaluates
each predicate against the runtime environment, sorts surviving sections by ascending priority, loads their
markdown templates, and joins them into the final system prompt. Four logical tiers, Core Identity, Tool
Definitions, Safety & Rules, and Dynamic Context, which organize sections by function. Dashed borders
indicate conditionally loaded sections that are included only when their predicate is satisfied.


The default action-mode agent registers modular sections across five functional tiers: _Core_ _Identity_ for
persona and non-negotiable constraints, _Tool_ _Definitions_ for tool-use and code-quality guidance needed
during execution, _Safety & Rules_ for conditionally loaded policies such as git conventions and task-tracking
instructions, _Provider-Specific Guidance_ for LLM-provider-specific behavioral hints, and _Dynamic Context_ for
session-specific metadata. The thinking-mode agent registers fewer sections, deliberately omitting tool-use
guidance to avoid biasing tool-free reasoning toward premature action. Section C provides the complete
section registry with conditions and summaries for all main and thinking sections; Section K reproduces the
verbatim content of every template.


**Mode-specific variants and variable substitution.** Different reasoning phases require fundamentally different prompts. Normal (action) mode loads all registered sections across five tiers. Thinking mode, a tool-free
reasoning pre-phase, loads only a small set of purpose-built sections: available-tool awareness (so the model
knows what actions are possible without being tempted to invoke them), subagent guidance, code-reference
conventions, and output-format rules. Planning mode uses a standalone template optimized for read-only exploration. This mode specialization is achieved through a factory function: create_composer(templates_dir,
mode="system/main") returns the full action composer, while mode="system/thinking" returns the minimal
thinking composer.


Templates use ${VAR} placeholders resolved at render time by a PromptRenderer. A centralized
PromptVariables registry maps symbolic names to concrete tool identifiers; for example, ${EDIT_TOOL.name}
resolves to edit_file. This indirection decouples template prose from tool naming: renaming a tool requires
changing one registry entry rather than editing every template.


**Provider-specific conditional sections.** Different LLM providers have meaningfully different capabilities
and conventions: Anthropic models support tool_use content blocks and extended thinking, OpenAI
models use function calling with structured output support, and inference providers like Fireworks have
different context window limits. Without provider-specific guidance, the agent may reference capabilities
it does not have. The PromptComposer addresses this with mutually exclusive conditional sections gated
on the model_provider field from the runtime environment context. Exactly one provider section (OpenAI,


19


Anthropic, Fireworks) is included per prompt based on the active provider, and unknown providers receive
no section (graceful degradation).


**Provider-level** **prompt** **caching.** For providers that support input caching (currently Anthropic), the
PromptComposer offers a compose_two_part() method that splits the assembled prompt into a _stable_ part and a
_dynamic_ part. Each section is annotated with a cacheable flag (defaulting to True); sections marked cacheable
(base instructions, tool descriptions, safety policy) are concatenated into the stable part, and the remainder
(environment metadata, session-specific context) into the dynamic part. The AnthropicAdapter structures
these as a two-element content array: the stable block carries a cache_control: {"type": "ephemeral"}
header, while the dynamic block carries none. Since the system prompt is re-sent on every LLM call and
the stable portion typically comprises 80–90% of the total, caching it yields substantial cost savings over a
multi-turn session (approximately 88% reduction in input token cost for the cached portion). Providers that
do not support this mechanism receive the full concatenated prompt as a single string, with no behavioral
difference.


**Two-tier fallback.** If an individual section file is missing, the composer skips it and proceeds, so the agent
starts with a slightly reduced prompt rather than failing. If modular composition fails wholesale (e.g., the
templates directory is absent), the builder falls back to a monolithic core template. This guarantees agent
startup under partial-deployment conditions.


_**2.3.2**_ _**Tool Result Optimization**_


Raw tool outputs consume far more tokens than their informational value warrants. A single read_file
may return 2,000–3,000 tokens of source code, a directory listing may enumerate hundreds of entries, and
a test-runner invocation may produce thousands of lines of TAP output. Left unchecked, verbose results
dominate the context window within a few iterations, crowding out the user query and system instructions
that drive the agent’s behavior. Tool result optimization addresses this by transforming raw outputs into
compact, semantically preserving representations before they enter the conversation history.


**Per-tool-type summarization.** Each tool result passes through a dedicated summarizer that maps the tool
name and raw output to a concise summary (typically 50–200 characters). The summarizer is dispatched by
tool name and applies a type-specific compression strategy:


_•_ **File** **reads** are replaced with metadata: “✓ Read file (142 lines, 4,831 chars)”. The full content
remains available through re-reading, but the context carries only the proof that the read occurred and the
file’s approximate size.

_•_ **Search results** report match counts rather than matched lines: “✓ Search completed (23 matches found)”.
When a search returns no results, the summary reflects this explicitly so the agent can redirect.

_•_ **Directory** **listings** are collapsed to item counts: “✓ Listed directory (47 items)”. The raw listing,
which often contains deeply nested paths, is replaced by a single-line summary.

_•_ **Command** **execution** adapts to output length: short outputs ( _≤_ 100 characters) are retained verbatim;
longer outputs report line counts: “✓ Command executed (312 lines of output)”.

_•_ **Errors** are truncated to 200 characters with a classified prefix: “ _×_ Error: FileNotFoundError: ...”.
This ensures the agent receives enough information for error recovery (Section 2.3.5) without consuming
excessive context on stack traces.


**Large** **output** **offloading.** For outputs that exceed 8,000 characters (approximately 2,000 tokens), the
summarizer is insufficient: the full output would still dominate the context even after summarization. These
outputs are _offloaded_ to scratch files before entering the conversation history. The system writes the full
output to a session-specific scratch directory (~/.opendev/scratch/<session_id>/) and replaces the output
in the conversation with a 500-character preview plus a reference path: “[Output offloaded: 2,341 lines,
48,203 chars _→_ <path>]. Use read_file to see full output if needed.” This creates a natural tiering


20


system: the agent sees enough to understand the content and can read_file the full output on demand,
which is itself subject to the same offloading threshold.


**Agent-aware truncation hints.** When output is offloaded to a scratch file, the truncation message includes a
tailored recovery hint based on the current agent’s capabilities. If the agent has access to subagent delegation
(the spawn_subagent tool), the hint suggests: “ _Delegate to a Code Explorer subagent to process the full output via_
_search and read tools._ ” If the agent lacks subagent capability (e.g., it _is_ a subagent), the hint instead suggests:
“ _Use the search tool with offset/limit parameters to process the output incrementally._ ” This agent-aware advice
prevents the common failure mode where an agent attempts a recovery strategy unavailable in its tool set,
for example, a Code Explorer subagent trying to spawn another subagent.


**Interaction with compaction.** Tool result summaries and offloaded outputs serve complementary roles.
At ingestion, they provide immediate context savings by replacing the full result in the conversation
history. During compaction (Section 2.3.6), the compactor preferentially uses pre-computed summaries
when sanitizing messages for LLM-based summarization, avoiding redundant re-processing. This synergy
means that even when emergency compaction is triggered, the input to the summarizer LLM is already
substantially compressed, improving both the speed and quality of the compaction output.


**Design evolution.** Early versions stored full tool output in the conversation history regardless of length.
A single long-running test suite could consume 30,000 tokens of context in one tool call. The per-tool
summarizer reduced this to under 100 tokens in most cases. Adding the 8,000-character offloading threshold
addressed the remaining outliers (large file reads, verbose command outputs) that exceeded the summarizer’s
compression ratio, extending typical session length from 15–20 turns (before context overflow) to 30–40 turns
without compaction.


_**2.3.3**_ _**Dual-Memory Architecture for Bounded Thinking**_


The thinking phase (Phase 1 of the ReAct loop, Section 2.2.6) requires conversation context for strategic
reasoning, but the full conversation history can grow to hundreds of thousands of tokens. Providing the
thinking model with unbounded history is infeasible: it would exceed the model’s context window and
waste budget on stale detail. Providing only recent messages loses strategic context, causing the agent to
“forget” its overall goals. We resolve this tension through a dual-memory architecture inspired by human
cognitive science, which separates compressed long-range context from detailed short-range context.


**Episodic memory.** An LLM-generated summary of the full conversation history captures strategic, longrange context: decisions already made, overall goals, key findings, and important file paths. The summarizer
is instructed to preserve actionable identifiers (file paths, function names, variable names, error codes) while
omitting verbose tool outputs and redundant exchanges. This summary is regenerated periodically (every 5
new messages, controlled by a regenerate_threshold parameter) rather than on every turn. Periodic regeneration serves two purposes: it amortizes the cost of the summarization call, and it prevents _summary drift_, a
phenomenon where iteratively summarizing a summary causes accumulated distortion. By regenerating
from the full history, each episodic memory snapshot is a fresh compression rather than a compression of a
compression.


**Working** **memory.** The last several message pairs (the most recent 6 exchanges by default, controlled
by exclude_last_n) are reproduced verbatim. These recent messages contain the fine-grained operational
details needed for immediate decision-making: exact file contents read in the last few turns, specific error
messages, precise line numbers, and the outcome of the most recent tool calls. Summarization would destroy
exactly the details that matter most for the next action.


**Combined injection.** Before each thinking LLM call, the system constructs the thinking context by concatenating: (1) the episodic memory summary, providing the “big picture”; (2) the working memory messages,
providing operational detail; and (3) the current user query. This structure mirrors the distinction between


21


episodic and working memory in cognitive architecture [7]: episodic memory stores the gist of past experience for long-range planning, while working memory holds detailed, recently acquired information
for immediate use. The thinking token budget remains bounded regardless of conversation length, since
the episodic summary has a fixed maximum length (500 characters) and the working memory window is
constant.


**Design evolution.** Early attempts used pure summarization for the entire history, but critical identifiers
(file paths, variable names) were lost, causing the agent to reference non-existent files or misname functions.
The opposite extreme, using only recent messages, lost long-range strategic context: the agent would “forget”
the user’s original goal after 10 turns. The hybrid architecture addresses both failure modes. We also
discovered that summarizing a previous summary (incremental summarization) accumulates errors over
multiple rounds; periodic regeneration from the full history corrects this drift.


_**2.3.4**_ _**Context-Aware System Reminders**_


Figure 11: Detailed view of the reminder subsystem from Figure 9. Without reminders (left), an agent with
one incomplete todo declares completion, forcing the user to intervene and causing a loss of trust. With
reminders (right), the ReactExecutor detects the unfinished state, injects a targeted user-role message listing
the outstanding item, and the agent resumes work and completes the task correctly.


System reminders address a fundamental reliability problem in long-running agent sessions: as the conversation grows, the model’s attention drifts away from the initial system-prompt instructions, leading to silent
failures such as premature task completion, abandoned error recovery, and unchecked exploration spirals
(Figure 11).


22


Consider a coding agent that is told, in its system prompt, to always run tests after editing code. For the first
few turns, it does. But after 20 tool calls, with file contents, search results, and command outputs piling up
in the conversation, it quietly stops. The instruction is still there in the system prompt, but the model no
longer pays attention to it. The same pattern appears in other forms: an agent told to “ _finish all tasks before_
_stopping_ ” declares victory with half the list incomplete; an agent that hits a file-editing error gives up instead
of re-reading the file and retrying, even though its instructions say to retry.


The root cause is simple: the system prompt sits at the very beginning of the conversation. As the conversation
grows longer, the model’s attention shifts toward recent messages and away from that initial block of
instructions. The rules are still present in the context window, but their influence fades with distance. This is
not a hypothetical concern; it is a predictable, reproducible failure mode that we observed consistently in
sessions exceeding 15 tool calls.


Putting all instructions up front works initially but degrades over long sessions. Re-injecting the entire
system prompt every few turns wastes tokens on instructions the agent does not currently need. OPENDEV
addresses this with _system reminders_ : short, single-purpose messages injected _exactly when the agent needs them_,
right before the decision point where it would otherwise go wrong. Each reminder is a brief role: user
message placed at maximum recency in the conversation, immediately before the next LLM call. Figure 12
illustrates the architecture.


Figure 12: Architecture of the Reminder Injection Layer. After each iteration of the ReAct Executor Loop
(top), eight event detectors examine the conversation state. When a detector fires, the corresponding reminder template is resolved via get_reminder() from reminders.md (with .txt fallbacks for longer prompts),
checked against guardrail counters that cap how many times each reminder can fire, and appended to
the message list as a role: user message. The next LLM call sees this reminder as the most recent input,
maximizing its influence on the model’s next decision.


**Event detectors.** As shown in Figure 12, the injection layer monitors eight conditions at the boundary
between tool execution and the next LLM call: tool failure without retry (with six error-specific recovery
templates), exploration spirals (5+ consecutive reads), denied tool re-attempts, premature completion
with incomplete todos, continued work after all todos are done, plan approval without follow-through,
unprocessed subagent results, and empty completion messages. Each detector fires its corresponding


23


reminder template from a catalog of named reminders organized into several categories: phase control, task
lifecycle, todo enforcement, error recovery, behavioral correction, and JSON retry (Section F provides the full
catalog and injection timing).


**Template resolution.** All reminder text lives outside source code. A single file (reminders.md) stores short
templates in named sections delimited by --- section_name --- markers. Longer prompts fall back to
standalone .txt files. The entry point get_reminder(name, **kwargs) parses the file once into a modulelevel cache on first call, looks up the section by name, and fills placeholders (e.g., {count}, {todo_list}) via
str.format(). Keeping templates in plain text makes them auditable and editable without touching Python
code.


**Guardrail counters.** A reminder that fires on every iteration stops being helpful and becomes noise the
model learns to ignore. To prevent this, each reminder type is governed by a counter or a one-shot flag
tracked in the per-session IterationContext (right column of Figure 12). Incomplete-todo nudges fire at
most twice (MAX_TODO_NUDGES = 2); error-recovery nudges fire at most three times (MAX_NUDGE_ATTEMPTS = 3);
plan-approved, all-todos-complete, and completion-summary signals each fire exactly once. If the agent
does not respond to a capped nudge, the system accepts the agent’s judgment and moves on rather than
looping.


**Rationale for role:** **user.** Reminders are injected as role: user messages rather than role: system. After
40 turns of conversation, another system message blends into the background that the model has already
partially forgotten. A user message appears at the position of highest recency in the dialogue flow; the
model treats it as something that just happened, something requiring a response. Early experiments with
role: system injection confirmed this: user-role reminders produced noticeably higher compliance rates.


**Graceful degradation.** If a reminder template is missing or retrieval fails, the agent still has its system
prompt. Reminders reinforce existing instructions; they do not introduce new ones. The system works
without them, but it works measurably better with them.


**Design** **evolution.** The initial system relied entirely on the system prompt. In long sessions (30+ tool
calls), agents reliably exhibited attention-decay failures: premature completion, exploration loops, and
failure to recover from errors. Adding just-in-time reminders resolved each failure mode. Early error
recovery used a single generic “ _try again_ ” message; classifying errors into six types with specific guidance
substantially improved recovery rates, as “ _read the file again_ ” is more actionable than “ _fix the issue_ .” Before
one-shot flags and attempt budgets, some reminders fired on every iteration, causing the agent to loop on the
nudge itself; guards were essential for stability. Early experiments also injected reminders as role: system
messages, which were less effective because the model treated them as background instructions rather than
conversational prompts demanding a response.


_**2.3.5**_ _**Context-Injected Error Recovery**_


When a tool call fails, the raw error message enters the conversation as a tool result. Without intervention,
the agent often responds with an apology rather than a recovery attempt, because the error message alone
does not convey _how_ to recover. Template-based error recovery addresses this by injecting targeted recovery
guidance directly into the context window, turning error messages into actionable instructions that the model
can follow.


The mechanism operates in four steps: (1) classify the error by pattern-matching the message to one of six
categories (permission error, file not found, edit mismatch, syntax error, rate limit, timeout); (2) retrieve the
corresponding recovery template from a centralized template store; (3) format the template with contextspecific details (the failing file path, the mismatched content, the specific error message); and (4) inject the
formatted template as a system message immediately before the next LLM call, placing it at maximum
recency in the conversation. For example, an edit-mismatch error produces the guidance: “ _the file has changed_


24


_since_ _you_ _last_ _read_ _it;_ _re-read_ _the_ _file_ _and_ _retry_ _your_ _edit_ _with_ _the_ _current_ _content._ ” This is substantially more
actionable than a generic retry instruction, because it tells the model _what changed_ and _what to do next_ .


A budget of 3 nudge attempts per error sequence prevents infinite retry loops: after three consecutive failed
recovery attempts on the same error, the system accepts the failure and allows the agent to proceed or ask
the user for help. Templates are stored as plain text outside the source code, making recovery strategies
extensible (new error categories require adding a template, not modifying code) and customizable (users can
override templates for project-specific recovery patterns).


_**2.3.6**_ _**Adaptive Context Compaction**_


As an agent operates within a ReAct loop, tool observations, such as file contents and command outputs,
accumulate and quickly dominate the context window, frequently consuming 70–80% of the available token
budget. Standard systems rely on a binary emergency compaction threshold (typically triggered at 95–99%
capacity) that performs a lossy summarization of the conversation history. This approach results in late
activation, severe information loss, and compounding errors upon subsequent compactions.


To mitigate these issues, OPENDEV monitors token usage incrementally, using the API’s reported
prompt_tokens count as a calibration anchor, and implements _Adaptive Context Compaction (ACC)_, a framework that manages context pressure through a five-stage pipeline of progressively aggressive reduction
strategies (Figure 13).


Figure 13: Detailed view of the compaction subsystem from Figure 9. Five stages activate at progressive
pressure thresholds (70%, 80%, 85%, 90%, 99%), transitioning observations between active, faded, and
archived states before emergency summarization is required.


Rather than waiting for the context window to fill, ACC monitors context pressure at the start of every ReAct
iteration and applies five graduated stages:


_•_ **Stage 1 - Warning (70%):** Context pressure is logged for monitoring. No data reduction occurs, but the
system begins tracking utilization trends.

_•_ **Stage 2 - Observation Masking (80%):** Older tool result messages are replaced in-place with compact
reference pointers (e.g., [output offloaded to scratch file]), preserving the conversation structure
required by the LLM API while reducing token footprint from thousands of tokens to approximately 15
per observation. The most recent tool outputs are preserved at full fidelity.


25


_•_ **Stage 2.5 - Fast Pruning (85%):** Before resorting to aggressive masking, a lightweight pruning pass walks
backward through tool result messages. Results within a protected recency budget are preserved; older
results are replaced with [pruned] markers. Unlike observation masking (which replaces with reference
pointers to offloaded files), pruning is a deletion-class operation (content is discarded rather than offloaded)
but it targets only outputs well beyond the recency window. This is substantially cheaper than LLM-based
compaction and often reclaims enough space to avoid the more disruptive stages entirely.

_•_ **Stage** **3** **-** **Aggressive** **Masking** **(90%):** The preservation window shrinks to only the most recent tool
outputs. All other observations are masked.

_•_ **Stage 4 - Full Compaction (99%):** The entire conversation history is serialized to a scratch file (ensuring no
historical detail is permanently lost), and an LLM-based summarizer compresses the middle portion of the
conversation while preserving recent messages verbatim.


ACC’s compaction pipeline additionally maintains an _Artifact Index_, a structured registry of all files touched
and operations performed during the session (read, created, modified, deleted). This index is serialized
into the compaction summary, ensuring the agent remembers what files it has worked with even after context
is compressed. The history archive path is also injected into the summary (“ _Full conversation history archived_
_at_ <path> _._ _Use_ read_file _to recover details if needed._ ”), making compaction effectively non-lossy: the agent
can recover any detail by reading the archive. Quantitative evaluations demonstrate that ACC reduces
peak context consumption of observations by approximately 54%, often eliminating the need for emergency
compaction entirely over typical 30-turn sessions.


Figure 14: Detailed view of the memory subsystem from Figure 9. Stage 1: the BulletSelector scores playbook
bullets by effectiveness, recency, and semantic similarity to the current query, and the selected bullets
are injected into the Generator’s system prompt alongside the user query. Stage 2: an episodic memory
mechanism triggers the Reflector every five messages of interaction; the Reflector analyzes accumulated
experience and produces a reasoning trace, error identification, root-cause analysis, and correct approach.
Stage 3: a Curator reads the reflection and plans concrete playbook mutations (add, update, tag, or remove
bullets). Stage 4: the mutations are applied to the Playbook’s bullet table and persisted to a session-scoped
JSON file.


**Adaptive memory.** Agents working in a project over multiple sessions accumulate experience about which
approaches succeed and which do not. The _Agentic_ _Context_ _Engineering_ (ACE) subsystem captures this
experience as a _playbook_ : a collection of natural-language bullets, each tagged with effectiveness counters
(helpful, harmful, or neutral) and a creation timestamp. Figure 14 illustrates the four-stage pipeline that
keeps the playbook current. In Stage 1, the BulletSelector ranks every bullet by a weighted score combining
effectiveness (0.5), recency decay (0.3), and semantic similarity to the current query via cosine similarity over


26


cached embeddings (0.2); the top-ranked bullets are injected into the Generator’s system prompt so the agent
can act on prior experience. Stage 2 is governed by an _episodic memory_ mechanism: every five messages of
agent interaction, the system activates the Reflector to analyze the accumulated experience. The Reflector
produces a reasoning trace, error identification, root-cause analysis, and correct approach, which are then
distilled into bullet-level effectiveness tags (helpful / harmful / neutral), without proposing any structural
changes to the playbook. Stage 3’s Curator reads the reflection and plans concrete mutations: adding new
bullets, updating existing ones, re-tagging effectiveness counters, or removing stale entries, emitted as a
DeltaBatch. Finally, in Stage 4 the mutations are applied to the Playbook’s bullet table and the updated state
is persisted to a session-scoped JSON file, ready for the next query cycle.


_**2.3.7**_ _**Context Retrieval and Assembly Pipeline**_


Figure 15: End-to-end synthesis of the retrieval and context components from Figure 9. Four layers transform
a user query into a fully assembled LLM API call: (1) retrieval tools gather raw code artifacts, (2) the Code
Explorer subagent orchestrates multi-step searches in an isolated context, (3) the context assembler merges
retrieved material with conversation history and system instructions, and (4) the context optimizer enforces
the token budget through staged compaction before the final API call.


Context retrieval is the single most consequential capability of a coding agent: the quality of every downstream action (editing, testing, planning) is bounded by whether the agent has located the right code in
the first place. In traditional RAG pipelines [44], retrieval is a static, one-shot operation: embed the query,
fetch top- _k_ documents, and generate. This works reasonably well for factual question answering over
homogeneous corpora, but codebases are fundamentally different. A single user request (“fix the login bug”)
may require cross-referencing an authentication handler, a database schema, a test file, and a configuration
module, none of which share obvious lexical overlap with the query. Recent work on _agentic search_ [88]
has shown that effective retrieval in complex environments requires the agent to dynamically control _when_,
_what_, and _how_ to retrieve, interleaving reasoning with search rather than treating retrieval as a preprocessing
step [80, 99]. OPENDEV instantiates this principle for software engineering through a four-layer pipeline
(Figure 15) that progressively escalates from simple lookups to multi-step agentic search to full context
assembly and optimization.


27


**Layer 1: Anchor-based retrieval tool selection.** Five tools form the retrieval surface: read_file for targeted
file access, list_files for glob-based discovery, text_search (ripgrep) for pattern matching, find_symbol
for LSP-based semantic resolution, and ast_search (ast-grep) for structural pattern matching (Sections 2.4.2
and 2.4.5). The central design question is not what tools to provide, but how the agent selects among them.
A naive agent defaults to text search for every lookup, a failure mode analogous to the “retrieve-everything”
antipattern in traditional RAG [5]. Effective retrieval instead begins by identifying the _strongest anchor_ in
the query: the most specific, highest-signal element that constrains the search space. Symbol names (e.g.,
AuthController.validate) route to find_symbol, which resolves the definition semantically via LSP; string
literals and error messages route to text_search, which performs exact pattern matching; structural patterns
(e.g., “all Python if-statements that check is_admin”) route to ast_search, which matches language-aware
templates; and file-path conventions route to list_files for glob-based discovery. By matching the retrieval
tool to the anchor type, the agent avoids noisy, low-precision searches and reaches the relevant code in
fewer steps. This is the coding-agent analog of Self-Ask’s [70] decomposition strategy: rather than searching
with the raw user query, the agent reasons about what kind of information it needs and selects the retrieval
mechanism accordingly.


**Layer 2:** **Multi-step agentic search via the Code Explorer.** Single-tool retrieval suffices when the agent
knows exactly what to look for, but many tasks require _exploratory_ retrieval: the agent must follow crossreferences, discover unexpected dependencies, and iteratively narrow a broad search space. This is where the
system transitions from static tool invocation to the interleaved reasoning-and-retrieval loop characteristic of
agentic search [80, 99]. When the main agent needs broad codebase understanding rather than a pinpoint
lookup, it delegates to the Code Explorer subagent (Sections 2.2.7 and 2.4.8), which runs in an isolated
context window with access to the same five retrieval tools in read-only mode. The subagent performs
multi-step searches autonomously: it might start with find_symbol to locate a class definition, read the file
to discover its dependencies, then use text_search to trace how those dependencies are used across the
project. Each step is guided by the subagent’s own reasoning about what it has found so far and what it
still needs, embodying the “interleaving retrieval with chain-of-thought” pattern [80]. Context isolation is
critical: intermediate search results (potentially thousands of lines of code) stay in the subagent’s window,
and only the distilled summary is returned to the main agent. This prevents the retrieval process itself from
consuming the context budget that the main agent needs for reasoning and action.


**Layer 3: Context assembly.** Retrieved code artifacts alone are insufficient; the agent also needs its behavioral
instructions, accumulated experience, and conversation history. Before each model call, ContextPicker
assembles the final message list from six ordered sources: (1) the system prompt augmented with selected
playbook strategies from the adaptive memory (Section 2.3.6), (2) project-level and user-level persistent rules,
(3) inline @file references and image blocks supplied by the user, (4) the conversation history retrieved from
SessionManager, (5) system reminders injected at the point of decision (Section 2.3.4), and (6) the current
user query. Each piece of context is wrapped in a ContextPiece that tracks its provenance (source subsystem,
priority, token cost), enabling downstream components to make informed retention decisions when the
budget is tight. The assembled structure is validated by ValidatedMessageList, which enforces structural
integrity (every assistant message with tool calls must be followed by matching tool results before the next
user turn) and auto-repairs violations with synthetic error placeholders rather than failing outright.


**Layer 4:** **Context optimization.** The assembled context passes through the staged compaction pipeline
described in Section 2.3.6. Observations follow a lifecycle from _active_ (recent, fully retained) through _faded_
(eligible for masking after the 80% threshold) to _archived_ (serialized to disk and replaced with a reference).
Token budgets are calibrated against API-reported prompt_tokens from the previous turn rather than local
estimates, correcting for provider-side injections (safety preambles, tool schemas) that are invisible to
the client. This final optimization step ensures that regardless of how much context was retrieved and
assembled, the payload submitted to the LLM respects the model’s context window while preserving the
most decision-relevant material.


28


**End-to-end flow.** The four layers form a retrieval pipeline that mirrors the escalation pattern seen in agentic
search systems [88]: simple queries resolve at Layer 1 with a single tool call; complex queries escalate to
Layer 2’s multi-step search; all results converge at Layer 3’s assembly; and Layer 4 enforces the token budget.
This progressive escalation means that straightforward lookups (“read file X”) incur minimal overhead,
while open-ended exploration (“how does the authentication system work?”) can leverage the full agentic
search loop without the cost bleeding into the main agent’s context.


The context engineering layer shapes what the model sees; the tool system defines what the model can
_do_ : the concrete actions through which the agent modifies code, runs commands, and interacts with the
development environment.


**2.4** **Tool System**


The tools through which the agent interacts with the development environment form an extensible ecosystem
that balances comprehensive capability with context efficiency, safety with flexibility, and built-in tools with
dynamic discovery. Table 1 in Section A provides a complete catalog of all 35 built-in tools; the remainder of
this section describes the registry architecture that organizes them into handler categories, then details each
category: file operations, shell execution, web interaction, semantic code analysis via LSP, user interaction
and task management, external tool discovery via MCP, and subagent delegation. A defense-in-depth safety
architecture spans all categories.


_**2.4.1**_ _**Registry Architecture and Schema Construction**_


A flat namespace of tools becomes unmanageable as capabilities grow: hard-coded dispatch logic is inflexible,
and dynamic plugin loading without structure is unsafe. Alternatives range from hardcoded tool sets (simple
but cannot add capabilities without code changes) to flat dynamic loading (flexible but chaotic, leading to
namespace collisions, lack of organization, and difficult safety management). OPENDEV adopts a registry
with handler categories, organizing tools into handler classes with schema-based registration.


**Three separated concerns.** Figure 16 illustrates the architecture. The tool system separates schema construction, dispatch routing, and lifecycle hooks into distinct components.


**ToolSchemaBuilder** assembles JSON schemas from three sources: (1) static _BUILTIN_TOOL_SCHEMAS
defining approximately 40 built-in tools, with descriptions loaded from markdown templates via
load_tool_description(); (2) dynamically discovered MCP schemas, including only those tools in the
_discovered_mcp_tools set to avoid context bloat; and (3) subagent schemas injected by the SubAgentManager
when present. The assembled schemas are injected into the LLM prompt, giving the model awareness of
available capabilities.


**ToolRegistry** serves as the central dispatcher, mapping tool names to handler methods across 12 handler
classes organized by category (file, process, web, notebook, user interaction, task management, thinking,
MCP discovery, batch execution; see Table 1 in Section A for the complete mapping). Each handler receives a
ToolExecutionContext that bundles cross-cutting services: mode manager, approval manager, undo manager,
task monitor, session manager, UI callback, and file-time tracker. The registry enforces mode restrictions by
blocking write operations in plan mode with informative errors before dispatching to handlers.


**Lifecycle hooks** provide extensibility without modifying handler code. The hook system defines ten lifecycle events (SESSION_START, USER_PROMPT_SUBMIT, PRE_TOOL_USE, POST_TOOL_USE, POST_TOOL_USE_FAILURE,
SUBAGENT_START, SUBAGENT_STOP, PRE_COMPACT, SESSION_END, and STOP) covering the full agent lifecycle from
session initialization to shutdown. PreToolUse hooks fire synchronously before execution: a hook returning
exit code 2 hard-blocks the tool call, returning an error to the model that no amount of prompt engineering
or approval configuration can override. Hooks can also mutate tool arguments by returning a JSON object with an updatedInput field, enabling transparent command rewriting (e.g., injecting --dry-run flags).
PostToolUse and PostToolUseFailure hooks fire asynchronously via a thread pool after execution, suitable
for auditing and logging without delaying the agent. External scripts registered as hooks receive full event


29


Figure 16: Expanded view of the Tool layer from Figure 2. **ToolSchemaBuilder** assembles JSON schemas
from three sources (static built-in definitions, dynamically discovered MCP tools, subagent schemas) and
injects them into the LLM prompt. **ToolRegistry** dispatches tool calls to category-based handlers, each
receiving a ToolExecutionContext with cross-cutting services. Pre/post lifecycle hooks intercept calls for
safety enforcement and extensibility.


context as JSON on stdin (including session ID, working directory, tool name, tool input, and (for post-hooks)
tool response), enabling project-specific policies such as blocking writes to protected paths, enforcing naming
conventions, or streaming audit logs to external systems. Hook matchers use compiled regex patterns against
tool names, allowing fine-grained targeting from single-tool rules to catch-all policies.


**Design evolution.** Early versions registered tools directly in a global namespace, causing naming collisions
and complex per-tool safety configuration. Category-based handlers solved both: safety rules apply at the
category level, and each category provides implicit namespacing.


**Runtime approval.** Before any tool call reaches its handler, the runtime approval system gates execution
based on user-configured trust boundaries. Three autonomy levels control the default posture: _Manual_
requires explicit approval for every tool call; _Semi-Auto_ auto-approves read-only operations (a curated
allowlist of commands such as ls, cat, git status) while prompting for writes; and _Auto_ approves all
operations for trusted workflows. Beyond the default level, an ApprovalRulesManager evaluates each
command against a prioritized rule set with four rule types: PATTERN (regex match against the full command
string), COMMAND (exact match), PREFIX (prefix match, e.g., git matching git push), and DANGER (regex
match with auto-deny semantics). Default danger rules at priority 100 (matching patterns such as rm -rf /,
rm -rf *, and chmod 777) are always active and cannot be overridden by user configuration or approvallevel changes. Rules are evaluated in priority order; the first match determines the action (auto-approve,
auto-deny, require approval, or require the user to edit the command before execution).


Approval rules persist across sessions via two JSON stores: user-global rules at
˜/.opendev/permissions.json and project-scoped rules at .opendev/permissions.json. When both
exist, project rules take priority for the same pattern, enabling per-repository trust boundaries (e.g., a shared
project can restrict docker commands that a user’s personal config allows). The approval flow adapts to the
active frontend: the TUI presents a blocking prompt_toolkit menu with keyboard navigation, while the
Web UI broadcasts an approval_required WebSocket event and polls a threading event with a 300-second


30


timeout, rendering an approval dialog in the browser. Every approval decision (command, action taken,
matching rule, and timestamp) is recorded in a CommandHistory for audit.


_**2.4.2**_ _**File Operations**_


Five tools handle all file-system interactions (see File Ops category in Table 1), from reading and writing to
structured editing and searching. Together they form the agent’s primary means of code manipulation.


**read_file:** **Line-numbered file reading.** Reads file contents with cat -n style line numbering, providing
the agent with precise positional references for subsequent edits. Three parameters control the read window:
file_path (required), offset (1-based line start, default 1), and max_lines (default 2000). The handler applies
several output transformations before returning content to the agent:


_•_ **Binary detection:** Non-text files are detected and rejected with descriptive errors rather than returning
corrupted byte sequences.

_•_ **Output** **truncation:** Content exceeding 30,000 characters is truncated using a head-tail strategy that
preserves the first 10,000 and last 10,000 characters with a truncation marker between them. This ensures
the agent sees both the beginning (imports, class declarations) and end (recent additions) of long files.

_•_ **Per-line truncation:** Individual lines exceeding 2,000 characters are truncated to prevent minified code or
data files from consuming excessive context.

_•_ **Stale-read** **tracking:** A FileTimeTracker records the timestamp of each read. The tracker records
datetime.now() keyed by (session_id, file_path) on every successful read. Before any edit,
assert_fresh() verifies that os.path.getmtime(file_path) _≤_ read_time + 50ms, where the 50ms tolerance accommodates filesystem timestamp granularity (FAT32 rounds to 2-second boundaries; NTFS and
ext4 offer sub-millisecond precision, but network filesystems introduce jitter). If the assertion fails, the edit
is rejected with an error instructing the agent to re-read the file, preventing silent overwrites of concurrent
user edits. A threading.Lock per file path serializes concurrent write attempts to the same file.


**write_file:** **New** **file** **creation.** Creates new files only by rejecting attempts to overwrite existing files,
directing the agent to use edit_file instead. This constraint prevents accidental full-file overwrites, which
are a common failure mode when agents reconstruct files from memory rather than applying targeted edits.
Parameters: file_path, content, and create_dirs (which auto-creates parent directories when set). The
handler runs the approval workflow for write operations, records the action with the undo manager for
rollback capability, and returns the file path and byte count on success.


**edit_file:** **9-pass fuzzy matching.** When an LLM-based agent edits a file, it specifies old_content to find
and new_content to replace. In practice, the LLM frequently produces old_content that differs slightly from
the actual file: trailing whitespace variations, indentation mismatches, escape sequence differences, or minor
reformatting from reconstructing code from memory rather than verbatim copy. A strict exact-match edit
tool fails on these cases, producing “content not found” errors that consume context with error messages
and recovery attempts.


The edit tool implements a chain-of-responsibility pattern with nine replacer classes, each addressing a specific mismatch category, from exact match through whitespace normalization, indentation flexibility, escape
handling, and context-aware anchor matching (Section D enumerates all nine passes with descriptions). Each
replacer returns the _actual substring found in the original file_ (not the search query), so the replacement preserves the file’s original formatting. Debug logging records which pass succeeded. The chain short-circuits
on first match, so exact matches incur zero overhead from the fuzzy passes.


Beyond matching, the edit handler enforces several safety and observability measures. Stale-read validation
rejects edits to files modified since the agent’s last read. Uniqueness verification ensures the match is
unambiguous: multiple matches produce errors rather than silent mis-edits. Backup state is created for
undo tracking. After a successful edit, the handler calls lsp.touch_file(filepath) to notify the running
language server of the change, then waits up to 3 seconds (debounced) for diagnostics. Only Error-severity


31


diagnostics are included; warnings and hints are suppressed to avoid context noise. Up to 20 diagnostics
are appended to the tool output as structured feedback (e.g., “LSP errors detected: line 42: undefined
variable ‘foo’”), giving the agent immediate feedback and enabling self-correction in the same turn. If no
LSP server is running for the file type, the check is silently skipped. A unified diff is generated for display to
the user.


**list_files:** **Directory listing and glob search.** Lists directory contents or performs glob-based file search.
Parameters: path (directory to list), pattern (glob expression for filtering), max_results (default 100). Results
render as a tree display showing directory structure. Common ignore patterns are excluded by default:
node_modules, .git, __pycache__, .venv, .DS_Store, and other platform-specific artifacts. Output is capped
at 500 entries to prevent context overflow from large repositories.


**search:** **Dual-mode content search.** Supports two search modes addressing complementary needs. With
type="text", the tool delegates to ripgrep for high-performance regex-based content search with configurable
context lines, supporting the full PCRE2 pattern syntax. With type="ast", the tool delegates to ast-grep for
structural code search using language-aware pattern templates with $VAR wildcards (e.g., if $COND: $BODY
matches any Python if-statement regardless of specific condition or body content). Parameters: pattern
(regex or ast-grep template), path (search root), type (“text” or “ast”), lang (language hint for ast mode).
Results are capped at 50 matches and 30,000 characters total output.


**Design evolution.** The initial edit tool used a two-pass strategy (exact match, then whitespace-stripped
match). This was the single largest source of “content not found” errors. Analyzing failure logs revealed
that LLM formatting drift falls into distinct, predictable categories (whitespace normalization, indentation
shifts, escape sequence differences, partial-context anchoring), each addressable by a targeted matching pass.
Generalizing this observation into a chain-of-responsibility architecture with nine progressively relaxed
replacers resolved the vast majority of edit failures while preserving exact-match performance through
short-circuit evaluation.


_**2.4.3**_ _**Shell Execution and Background Tasks**_


Four tools handle shell execution and background task management (see Process category in Table 1). The
agent needs to run arbitrary shell commands for testing, building, and system interaction, but must do so
safely; long-running processes like development servers require background execution with output capture.


**run_command:** **Six-stage** **shell** **execution.** Figure 17 illustrates the pipeline, which processes every shell
command through six stages: (1) safety gates that block dangerous patterns with no override, (2) command
preparation that auto-confirms package manager prompts and unbuffers Python output, (3) server detection
via regex match against 16 framework patterns (Section E.2) that auto-promotes long-running servers to
background mode, (4) execution fork between PTY-based background and piped foreground with processgroup isolation, (5) output management with 30k-character head-tail truncation and 100ms polling, and
(6) timeout handling with 60-second idle and 600-second absolute limits. Section E provides the full stageby-stage details and the complete server pattern table.


Commands promoted to background are registered with the BackgroundTaskManager, which assigns 7character hex IDs (from uuid4().hex[:7], providing _∼_ 268M unique values). Registration creates the task
record, opens an output file at /tmp/opendev/{sanitized-dir}/tasks/{id}.output, writes any initial startup
output captured during the first 20 seconds, and spawns a daemon thread that continuously streams
PTY output to the file via select.select() polling. Tasks transition through four states: RUNNING _→_
COMPLETED (exit code 0), FAILED (non-zero exit), or KILLED (via signal). Listener callbacks notify the UI
of each state transition, enabling real-time status display in the TUI footer.


**list_processes:** **Background task listing.** Returns all tracked background tasks with PID, status (running/completed/failed/killed), and wall-clock runtime. This gives the agent visibility into what processes


32


Figure 17: Detailed pipeline for the Process handler (Figure 16). Commands pass through three safety gates
(permission config, allowed-command matching, dangerous pattern blocking), then command preparation
(auto-confirm, unbuffered Python), server detection (regex match against 16 patterns for auto-background
promotion), execution fork (PTY-based background or piped foreground with process-group isolation),
output management (30k char limit with head/tail truncation, 100ms polling), and timeout/interrupt
handling (60s idle, 600s absolute, InterruptToken integration).


are active, enabling it to check on long-running servers, identify stalled builds, or determine which tasks
need attention.


**get_process_output:** **Task output retrieval.** Retrieves the last 100 lines from a background task’s output
file by task ID, giving the agent access to server logs, build output, and error messages without needing
to re-run the command. This is essential for monitoring development servers, inspecting test results from
background runs, and diagnosing failures in long-running processes.


**kill_process:** **Graceful process termination.** Terminates a running background task using graceful escalation: send SIGTERM to the entire process group via os.killpg(), wait 5 seconds for graceful shutdown,
then escalate to SIGKILL if the process is still running. The daemon output thread is signaled to stop, and
the PTY master file descriptor is closed. Process group killing ensures that child processes spawned by the
command (e.g., webpack dev server spawning file watchers) are terminated along with the parent.


**Design evolution.** The initial implementation used subprocess.run() with a fixed timeout. Development
servers invariably hit the timeout and were killed. Activity-based idle timeout solved the server problem,
and PTY-based execution solved output buffering issues where programs would produce no visible output
until process termination.


_**2.4.4**_ _**Web Interaction**_


Four tools provide web interaction capabilities (see Web category in Table 1) for documentation research,
content inspection, and browser-based testing. All web tools are read-only and safe for use in plan mode.


**fetch_url:** **Browser-engine** **web** **fetching.** Retrieves web content using Crawl4AI, a browser-engine
crawling library built on Playwright. The browser-engine approach handles JavaScript-rendered content that
simple HTTP clients would miss (single-page applications, dynamically loaded documentation). HTML is


33


converted to markdown for context-efficient consumption by the LLM. Output is capped at 50,000 characters
with a 30-second per-page timeout. File downloads are blocked to prevent disk abuse.


For multi-page exploration, the tool supports deep crawling with three configurable strategies: breadth-first
(BFS), depth-first (DFS), or best-first (priority by content relevance). Parameters control maximum crawl
depth, page limit, and domain filters to prevent crawling beyond the target site. Playwright Chromium is
auto-installed on first use, with the installation triggered transparently when the tool is first invoked.


**web_search:** **Privacy-respecting** **search.** Searches the web via DuckDuckGo, chosen for its privacyrespecting design (no user tracking or search history retention). Returns up to 10 results, each containing
title, URL, and text snippet. Domain filters allow restricting results to specific sites (e.g., searching only
official documentation domains). The tool returns structured results that the agent can then follow up on
with fetch_url for full content retrieval.


**capture_web_screenshot:** **Visual** **page** **capture.** Takes full-page screenshots via Playwright’s headless
browser. Configurable viewport dimensions (default 1920 _×_ 1080) allow capturing pages at different responsive breakpoints. Optional PDF output mode produces paginated documents. Timeout extends up to 180
seconds for complex pages with heavy JavaScript initialization. Returns the screenshot file path, which the
agent can reference in subsequent analysis or present to the user.


**open_browser:** **System** **browser** **launch.** Opens a URL or local file in the system’s default browser via
platform-native commands. Local file paths are automatically converted to file:// URIs. This tool bridges
the gap between the agent’s headless environment and the user’s visual workflow, making it useful for
previewing generated HTML, reviewing web applications under development, or opening documentation
links that require authentication the agent cannot provide.


**Design evolution.** The initial implementation used simple HTTP requests via the requests library, which
failed on JavaScript-rendered single-page applications that dominate modern documentation and web
frameworks. Switching to Crawl4AI with Playwright’s browser engine solved this, enabling full DOM
rendering before content extraction.


_**2.4.5**_ _**Multi-Language Semantic Code Analysis via LSP**_


Six tools provide multi-language semantic code analysis via LSP (see Symbols category in Table 1), split into
two read-only navigation tools and four structural editing tools. Text-based tools can search for strings but
miss semantic structure: finding all usages of a method requires distinguishing method calls from variable
names, handling overloading, and tracking references across files. Building custom parsers for each language
is infeasible, so OPENDEV adopts Language Server Protocol integration via standard language servers [58],
reusing a mature ecosystem where each server is maintained by domain experts.


**Four-layer LSP abstraction.** Figure 18 illustrates the architecture, organized into four layers that progressively translate between agent-facing tool calls and language-server-specific protocol messages. The _Agent_
_Tool Layer_ exposes the six tools described below; each accepts a file path and a symbol name, with language
detection, server selection, and protocol translation handled transparently by the lower layers. The _Symbol_
_Retriever_ provides a unified API that resolves symbol names to positions using a NamePathMatcher supporting exact match (MyClass.method), partial path match (method matching any symbol whose path ends with
.method), and wildcard match (My* matching MyClass, MyModule). The _LSP Server Wrapper_ handles language
detection (30+ file extensions; see Figure 18) and server lifecycle via a singleton pool: one server per language,
started lazily, with automatic liveness checks and transparent restart on crash. The _Solid Language Server_
manages the low-level LSP protocol through a subprocess handler communicating via JSON-RPC 2.0 over
stdio, with two daemon threads per server for I/O, thread-safe request IDs, and configurable per-request
timeouts. Each language server extends a common base class with language-specific overrides (initialization
parameters, ignored directories, cross-file reference wait times), allowing new languages to be added by
dropping in a server class without modifying the core framework.


34


Figure 18: Detailed architecture for the Symbols handler (Figure 16). The system is organized into four
layers: Agent Tool Layer (six symbol tools), Symbol Retriever (unified API), LSP Server Wrapper (language
detection, per-language server pool, symbol conversion), and Solid Language Server (two-level cache, file
buffer management, LSP protocol operations). The Language Server Handler manages subprocess lifecycle
and JSON-RPC 2.0 communication with external language server processes. Language detection maps 30+
file extensions to their respective servers, which are started lazily on first query and reused across subsequent
requests.


To avoid redundant LSP round-trips, each language server maintains a two-level cache keyed by file content
hash (MD5). Level 1 caches raw LSP responses; Level 2 caches processed symbol trees with parent-child
relationships and body previews. When a file has not changed, queries return from Level 2 without contacting
the server. When a file has changed but the raw response schema has not, only Level 2 is recomputed from
cached Level 1 data. Cache storage uses pickle serialization in the project’s .solidlsp/cache/<language_id>/
directory, with a version field that ensures incompatible caches are discarded.


**find_symbol:** **Symbol** **definition** **lookup.** Parameters: symbol_name (supports qualified names like
MyClass.method, partial matches, and wildcards), optional file_path to scope the search. Returns symbol definitions with kind (function, class, variable, etc.), location (file, line, column), name path (e.g.,
module.Class.method), and body preview (first 200 characters). When multiple matches exist, all are returned with their full paths, letting the agent disambiguate.


**find_referencing_symbols:** **Cross-file reference search.** Parameters: symbol_name, file_path (where defined), include_declaration (whether to include the definition itself). Semantically finds all references
(calls, imports, type annotations) grouped by file. Used for impact analysis before refactoring and for
understanding how a symbol is consumed across the codebase.


**rename_symbol:** **Workspace-wide semantic rename.** Parameters: symbol_name, file_path, new_name (validated as a legal identifier: starts with letter or underscore, contains only alphanumeric characters). Applies
workspace edits returned by the LSP server’s textDocument/rename in reverse order (bottom-to-top within
each file) so that earlier edits do not shift the line numbers of later ones. Only renames code references;
strings and comments are left unchanged.


**replace_symbol_body:** **Body-preserving** **rewrite.** Parameters: symbol_name, file_path, new_body,
preserve_signature (default true). Detects the body boundary (colon for Python, opening brace for C-like


35


languages) and replaces only the body while keeping the signature, decorators, and docstring intact. This
enables the agent to rewrite function implementations without accidentally altering their public interface.


**insert_before_symbol** **and** **insert_after_symbol:** **Positional** **code** **insertion.** Parameters: symbol_name,
file_path, content. Inserts content before or after a named symbol at matching indentation level with
blank-line separation. Useful for adding methods adjacent to related code, inserting helper functions near
their callers, or placing test cases next to the functions they exercise.


**Design evolution.** The initial approach considered building custom AST-based analysis using tree-sitter
grammars. While tree-sitter provides fast, incremental parsing, it lacks the semantic understanding that
language servers provide: type resolution, cross-file reference tracking, and workspace-wide renaming. LSP
integration leverages a mature ecosystem where each language server is maintained by domain experts, and
the on-demand server lifecycle ensures that resource consumption scales with actual usage rather than the
number of supported languages.


_**2.4.6**_ _**User Interaction, Task Management, and Planning**_


Eight tools enable user interaction, task management, and plan-based workflows (see Task Mgmt, User
Input, Planning, and Completion categories in Table 1). They form the human-in-the-loop backbone of the
system, ensuring the agent can gather requirements, report progress, and obtain approval at critical decision
points.


**ask_user:** **Structured multi-choice questions.** Presents up to four questions per invocation, each with
a structured format designed for efficient user interaction. Every question includes: a header label (max
12 characters, displayed as a compact chip/tag for visual scanning), 2–4 options each with a label and
description explaining implications, and an optional multiSelect flag for non-exclusive choices. An “Other”
option with free-text input is auto-appended to every question, ensuring users are never constrained to the
agent’s proposed choices.


The rendering adapts to the active UI: the TUI presents questions as a modal dialog with keyboard navigation,
while the Web UI uses a polling-based survey component where the agent’s thread blocks until the user
submits a response via WebSocket. This blocking-with-timeout design ensures the agent waits for user input
without consuming CPU or progressing with assumptions.


**Task** **tracking** **(write_todos,** **update_todo,** **complete_todo,** **list_todos):** **Lightweight** **kanban** **task** **list.**
Four tools manage a lightweight kanban-style task list that persists across agent iterations:


_•_ write_todos: Creates or replaces the entire task list from a structured definition. Each task has a title,
description, and status (todo, doing, done).

_•_ update_todo: Modifies an existing task by numeric ID, title, or slug. Enforces the constraint that at most
one task can have “doing” status at a time: setting a new task to “doing” automatically returns the
previously active task to “todo”.

_•_ complete_todo: Marks a task as done with an optional completion log message recording what was
accomplished.

_•_ list_todos: Returns all tasks sorted by status priority: doing first, then todo, then done. This ordering
ensures the agent’s attention is drawn to active and pending work.


**present_plan:** **Plan review and approval.** Reads the plan file (written by the agent during plan mode),
displays its contents to the user, and requests explicit approval before proceeding to implementation. The
user responds with one of three outcomes:


_•_ _approve_auto_ : Approve the plan and auto-approve all subsequent edits that implement it, minimizing
approval friction for trusted plans.


36


_•_ _approve_ : Approve the plan but review each individual edit during implementation, maintaining finegrained control.

_•_ _modify_ : Reject with feedback, providing specific changes the agent should incorporate before re-presenting.


On approval, plan steps are automatically extracted into the todo list, creating a structured execution tracker
that the agent uses to methodically implement each step and report progress.


**task_complete:** **Explicit completion signal.** Signals that the agent has finished its current task, providing a
summary message and success/failure status. This tool serves a critical architectural role: it gives the ReAct
executor a structured termination signal, distinguishing intentional completion from iteration exhaustion
(hitting the maximum iteration limit). Without this tool, the agent would either loop until cut off or produce
an unstructured final message, making it difficult for the system to determine whether the task was actually
completed.


**Design evolution.** Early versions lacked structured user interaction; the agent output free-text questions
that were difficult to parse reliably. Introducing the structured multi-choice format with typed options and
descriptions improved response quality, reduced misunderstanding, and enabled the UI to render consistent
survey-style dialogs across both TUI and Web interfaces.


_**2.4.7**_ _**Token-Efficient External Tool Discovery via MCP**_


One tool, search_tools, provides token-efficient external tool discovery via the Model Context Protocol [1]
(see Discovery category in Table 1). External tools discovered through search are then invoked via the
McpToolHandler, which dispatches calls to the appropriate server. The core problem is context efficiency: a
system with 100 external tools, each schema averaging 200 tokens, consumes 20,000 tokens purely for tool
definitions. Including all schemas is wasteful; excluding external tools entirely limits capability. OPENDEV
adopts lazy discovery: tools are found on-demand through keyword search, and only discovered tool
schemas are included in the context.


Figure 19 illustrates the three-component interaction. The system integrates MCP for dynamic tool connectivity. Users configure external tool servers (database clients, API services, etc.) via management commands.
The system maintains a set of discovered tools, including only schemas for tools explicitly searched for or previously invoked. Initial context contains zero external tool schemas. When the agent calls search_tools (e.g.,
with query "database query tools"), the SearchToolsHandler builds a vocabulary from all registered MCP
tool names and descriptions, extracts keywords (tokens of 3+ characters), and scores each tool against the
query using vocabulary matching. Top matches are returned to the LLM with names and descriptions. The
ToolRegistry then marks matched tools as discovered via discover_mcp_tool(), adding their schemas to the
discovered set so that the next LLM call includes them. Directly invoking an MCP tool by its qualified name
(e.g., mcp__github__create_issue) auto-discovers it without requiring a prior search. The McpToolHandler
forwards invocations to the appropriate external server, managing serialization and error handling.


**search_tools:** **Keyword-scored** **tool** **discovery.** Three detail levels control context investment: names
returns only tool names (minimal tokens), brief adds short descriptions, and full triggers full schema
inclusion in subsequent LLM calls. Name matches score 2 points and description matches score 1 point;
results rank by total score, surfacing the most relevant tools first. This trades discovery overhead (the agent
must search, then invoke) for context savings (only relevant tools are loaded). For workflows using few
external tools, the savings are substantial; for workflows using many, the overhead accumulates but remains
bounded.


**Design evolution.** The initial implementation included all external tool schemas in every call, consuming
up to 40% of the context before the first user message. Lazy discovery reduced baseline overhead to nearly
zero ( _<_ 5%), growing only as capabilities are actually used.


37


Figure 19: Sequence within the Tool layer (Figure 16). The LLM issues a search_tools call with a naturallanguage query. The SearchToolsHandler builds a keyword vocabulary from all registered MCP tool names
and descriptions, scores each tool against the query, and returns top matches. The ToolRegistry marks
matched tools as discovered, including their schemas in subsequent LLM calls. Only discovered tools incur
schema cost, reducing baseline token overhead of MCP integration to near zero.


_**2.4.8**_ _**Subagent Delegation, Skills, and Batch Execution**_


This section describes three tools that extend the agent’s capabilities beyond single-tool invocations: subagent
delegation for complex subtasks, skill loading for on-demand domain expertise, and batch execution for
multi-tool efficiency.


**Subagent delegation via spawn_subagent.** Launches an isolated subagent with its own ReAct loop and
filtered tool registry. Each of the eight subagent types restricts available tools to its domain: Code-Explorer
(read-only navigation), Planner (read + write for plans), PR-Reviewer (code review with diff analysis),
Security-Reviewer (vulnerability scanning), Web-Clone (website replication), Web-Generator (site creation
from specifications), Project-Init (scaffold generation), and Ask-User (UI-only structured surveys). The tool
isolation ensures subagents cannot accidentally interfere with each other or exceed their intended scope.
Section G provides the complete capability matrix with per-subagent tool lists.


A key design property is automatic parallelization: when the main agent emits multiple spawn_subagent
calls in the same LLM response, the SubAgentManager executes them concurrently via asyncio.gather(),
with each subagent running in a separate thread with its own iteration budget and tool worker pool. This
enables the agent to fan out work naturally (e.g., “investigate the authentication module” and “review the
database schema” in parallel) without explicit concurrency management.


Additional parameters provide flexibility: model override (haiku for fast, low-cost tasks; sonnet for balanced
capability; opus for complex reasoning), background execution (agent continues without waiting for completion), and session resume by agent ID (enabling multi-turn subagent workflows where context is preserved
across invocations).


**On-demand skills via invoke_skill.** Skills are modular knowledge units stored as markdown files with
YAML frontmatter, providing domain-specific expertise (git conventions, code review checklists, deployment
procedures) that would waste context if loaded unconditionally. The system processes skills in two phases:


38


**Phase 1:** **Metadata discovery.** At startup, the SkillLoader scans all skill directories, parsing only the YAML
frontmatter to extract names and descriptions. This lightweight index is included in the system prompt,
enabling the agent to discover available expertise without loading instructional content. Descriptions follow
a “Claude Search Optimization” convention where each begins with “Use when...” to specify trigger
conditions (e.g., “Use when writing bash scripts that need to wait for external conditions”), optimizing for
agent discoverability.


**Phase** **2:** **On-demand** **loading.** When the agent determines a skill is relevant, it invokes invoke_skill
with the skill name. The loader reads the full markdown content, strips the frontmatter, and injects the
instructional body into the conversation context. A deduplication cache ensures each skill loads at most once
per session, preventing context pollution from redundant invocations.


Skills are discovered from three tiers with strict priority ordering: project-local (.opendev/skills/, highest
priority) for repository-specific conventions, user-global (˜/.opendev/skills/) for personal preferences
across all projects, and built-in (shipped with the package, lowest priority) for default expertise. When two
skills share the same name, the higher-priority source takes precedence, enabling project-specific overrides
of default behavior.


**Batch execution via batch_tool.** Enables multiple tool calls in a single agent turn, reducing round-trip
overhead. The agent specifies the execution mode: _parallel_ (thread pool with max 5 concurrent workers)
for independent operations like reading multiple files or running multiple searches, or _serial_ for dependent
operations like creating a directory then writing a file into it. The agent specifies the mode because only it
knows the dependency relationships from context, as the system cannot reliably infer whether operations are
independent. Automatic dependency detection was attempted but proved unreliable; explicit agent-specified
mode delegating the decision to the entity with full context knowledge solved this cleanly.


**Design evolution.** The initial design had no batch execution; every tool required a full LLM round-trip,
and multiple file reads took multiple turns. Skills were originally loaded at startup, consuming context on
expertise never used in the session. Subagents initially ran sequentially, even when tasks were independent.
The current architecture addresses all three issues: batch execution eliminates unnecessary round-trips, twophase skill loading reduces baseline overhead to a compact metadata index, and automatic parallelization of
subagent calls exploits task independence without requiring the agent to manage concurrency explicitly.


The tools above produce artifacts and side effects; the persistence layer ensures these survive across sessions
and provides rollback when the agent makes mistakes.


**2.5** **Persistence Layer**


The persistence layer stores conversation histories, configuration, model metadata, and file-operation logs
using ordinary files on disk: JSON for structured data, JSONL (one JSON object per line) for append-heavy
streams, and plain text where simplicity matters. No external database is required.


All persistent state lives under two root directories. User-global state (settings, caches, installed plugins)
goes to ~/.opendev/. Project-scoped state (session transcripts, project-specific settings) goes to a subdirectory
derived from the project path: ~/.opendev/projects/{encoded-path}/, where the project’s absolute path is
encoded by replacing path separators with dashes (e.g., /Users/alice/myapp becomes -Users-alice-myapp).
This separation ensures that conversations about one repository never appear alongside conversations about
another, and that project-specific settings do not leak across unrelated codebases.


_**2.5.1**_ _**Session Storage**_


Each conversation is stored as two files: a .json metadata file and a .jsonl transcript file. The metadata file
records the session identifier, creation and last-activity timestamps, working directory, title, and summary,
but contains no messages. The transcript file stores the actual messages, one per line, each serialized as a
JSON object with role, content, timestamp, tool calls, and token counts. Splitting metadata from messages


39


means that listing all sessions (to show the user a session picker) requires reading only the small metadata
files rather than loading potentially large transcript histories.


**Writing sessions safely.** Sessions are saved through a write flow designed to prevent data loss even under
concurrent access. Before writing, the system acquires an exclusive file lock (fcntl.flock) on the metadata
file with a 10-second timeout to prevent deadlocks. The metadata is then written to a temporary file and
atomically renamed into place using os.rename(), which on POSIX systems guarantees that the file is either
fully written or untouched, never half-written. The transcript file follows the same locking protocol. After
both files are updated, the session index is also updated atomically.


**Auto-save.** Rather than requiring explicit save commands, the system auto-saves the conversation every
5 turns (configurable via auto_save_interval). Each auto-save writes both the metadata and the full
transcript. Between auto-saves, messages exist only in memory. For multi-channel deployments (such as
a web interface), a separate append-only path writes each new message individually to the transcript file
under an exclusive lock, providing immediate durability at the cost of one file-system call per message.


**Session index.** Listing sessions by scanning every metadata file in the project directory is slow when many
sessions accumulate. A lightweight index file (sessions-index.json) caches the essential fields (session ID,
title, message count, last-modified timestamp) at roughly 200 bytes per entry, enabling instant session listing.
The index is updated atomically whenever a session is saved. If the index file is missing, corrupted, or has a
permission error, the system rebuilds it automatically by scanning all metadata files in the directory, creating
entries for each valid session and deleting empty ones. This self-healing behavior means the index never
becomes a single point of failure: even if the file is accidentally deleted or corrupted, the next list_sessions
call regenerates it transparently.


**Session titles and resumption.** When a new session is first saved, it has no meaningful title. A lightweight
topic-detection model generates a short title (capped at 50 characters) by examining the last 4 messages. This
runs on a background daemon thread so that it never blocks the main conversation loop. When the user
starts the agent in a project directory without specifying a session, the system defaults to the most recent
session for that project, enabling a “continue where I left off” workflow. Sessions from nested subprojects do
not appear in the parent project’s list because each project root produces a distinct encoded path.


**Session cost metadata.** Each session’s metadata file includes a cost_tracking object that records cumulative API usage: total input tokens, total output tokens, total cost in USD (computed from model pricing
metadata), and the number of API calls. This metadata is updated after every LLM call and persisted with
the session. When the user resumes a session via --continue, the CostTracker service restores its state from
this metadata, ensuring that the running cost display reflects the full session history rather than only the
current invocation.


**Legacy** **migration.** Earlier versions stored messages inline in the metadata JSON file rather than in a
separate JSONL transcript. When the system encounters a session with inline messages and no JSONL file, it
automatically migrates the messages to a new JSONL file, clears the inline messages from the metadata, and
saves a backup of the original file. This one-time migration is transparent to the user.


_**2.5.2**_ _**Operation Log and Undo**_


Agents make mistakes: they write to the wrong file, make an edit that breaks something, or delete a file the
user did not intend to remove. Rather than requiring users to manually undo these changes with version
control commands, OPENDEV tracks every file operation (create, modify, delete) in a log and provides a
single-command undo.


Each operation record contains the operation type, file path, timestamp, a unique identifier, and the file’s
content before the operation. These records are stored in two places: an in-memory list for fast undo during
the current session, and a JSONL file (operations.jsonl) in the session directory for durability. The JSONL


40


log is best-effort: if writing to it fails (for example, due to a permission issue), the failure is logged but does
not interrupt the agent’s work. The in-memory list is the primary data source for undo operations.


When the user invokes undo, the system pops the most recent operation from the in-memory list and reverses
it: created files are deleted, modified files are reverted to their backed-up content, and deleted files are
restored from the saved copy. The in-memory history is capped at 50 operations to prevent unbounded
memory growth. When the cap is reached, the oldest entries are evicted first. In practice, users rarely need
to undo operations older than the last dozen or so, so this bound has not been a limitation.


The undo system works alongside version control rather than replacing it. It handles uncommitted changes
without requiring the user to know git, and provides lower friction than typing git restore for quick
corrections after agent mistakes.


**Shadow git snapshots.** The in-memory undo log tracks only file operations performed through the agent’s
tools. It cannot capture side effects from shell commands (e.g., npm install modifying package-lock.json)
or build processes. For comprehensive per-step undo, the system maintains a _shadow git repository_, a bare
repository at ~/.opendev/snapshot/<project-id>/ that shares no history with the user’s actual repository.
At every agent step that modifies files, the snapshot system runs git add . && git write-tree against the
project working directory using the shadow repository’s object store, recording a tree hash in the session
metadata. The /undo command computes a git diff between the current tree and the snapshot tree,
identifies changed files, and restores them via git checkout <hash> -- <file>. The shadow repository’s
.gitignore is synchronized from the real repository to avoid tracking build artifacts. A scheduled cleanup
(git gc --prune=7.days) keeps the shadow repository compact. This approach leverages git’s contentaddressable storage for perfect file-level restoration without interfering with the user’s version control
workflow.


_**2.5.3**_ _**Configuration**_


Configuration follows a four-tier hierarchy designed so that users get reasonable behavior out of the box but
can customize anything at the right scope:


1. **Built-in defaults** provide a working configuration without any user setup (default model, temperature,
auto-save interval, and so on).
2. **Environment variables** supply API credentials and CI/CD-specific overrides. API keys are _only_ loaded
from environment variables, never from configuration files, to prevent accidental exposure in version
control. If a key is found in a configuration file, it is automatically stripped during loading.
3. **User-global settings** (~/.opendev/settings.json) store cross-project preferences such as the user’s preferred model, UI settings, and tool auto-approval rules.
4. **Project-local settings** (<project>/.opendev/settings.json) store repository-specific overrides, such as a
different model for a particular codebase or project-specific coding standards.


Each tier overrides the one above it: project settings take precedence over user-global settings, which take
precedence over environment variables, which take precedence over built-in defaults. The configuration is
loaded once at startup and cached in memory; subsequent reads return the cached value without re-reading
files.


Context window limits are derived automatically from model capabilities rather than requiring explicit
configuration. When the user selects a model, the system looks up its maximum context length from the
provider cache (described below) and sets the token budget accordingly. This avoids a common source of
misconfiguration where users set a context limit that does not match their model’s actual capacity.


41


_**2.5.4**_ _**Provider and Model Cache**_


The system needs to know what models are available from each provider, along with their capabilities
(context length, vision support, pricing). Rather than hardcoding this information, OPENDEV fetches it from
an external catalog API and caches the results locally under ~/.opendev/cache/.


The cache uses a stale-while-revalidate strategy with a 24-hour time-to-live. On startup, the system checks
when the cache was last refreshed by examining the modification time of a .last_sync marker file. If the
cache is less than 24 hours old, it is used as-is. If it is stale or missing, the system fetches fresh data from
the API, transforms it into per-provider JSON files (one file per provider, containing model names, context
lengths, capabilities, and pricing), and updates the marker. If the network fetch fails, the system falls back
to the stale cache if one exists, or proceeds without capability information if no cache is available at all.
This ensures that the agent can start even when offline: the cache file from the last successful sync provides
enough information to operate normally.


Environment overrides (OPENDEV_MODELS_DEV_PATH for a local catalog file, OPENDEV_DISABLE_REMOTE_MODELS
to skip network entirely) allow the cache to be populated without network access, which is useful in
air-gapped environments or for testing with a fixed model set.


The architecture described above embodies numerous design decisions whose rationale is not always selfevident from the component descriptions alone. The next section steps back from per-component detail to
examine the cross-cutting design tensions (context pressure, behavioral steering, safety enforcement, LLM
imprecision, and resource bounding) that shaped these choices and extracts transferable lessons for builders
of similar systems.


**3** **Discussion**


The preceding sections describe the architecture and tool ecosystem of OPENDEV in detail. Here we step back
from per-component descriptions and examine five cross-cutting design tensions that shaped the system.
Each subsection synthesizes insights that span multiple components and extracts transferable lessons for
builders of similar agentic systems.


**3.1** **Context Pressure as the Central Design Constraint**


Unlike CPU or memory, context is consumed by both the system (prompts, tool schemas, safety preambles)
and the agent’s own actions (tool outputs, conversation history). Every capability added to the system
prompt and every tool result returned to the agent competes for the same finite budget. In our experience,
tool outputs (file contents, command results, search hits) consume 70–80% of the context in a typical session,
dwarfing the system prompt and the agent’s own reasoning. This makes context utilization the single
most important metric for agent longevity, and it imposes a pervasive tension: richer tool outputs improve
per-turn accuracy but shorten the session’s useful life.


42


**Prompt structure for caching.** For providers that support prompt caching, splitting the system prompt
into a stable prefix and a dynamic suffix, marking the prefix with a cache control header, yields significant
input cost savings over a multi-turn session (Section 2.3.1). Since the system prompt is re-sent on every LLM
call, caching the stable portion amortizes the cost of the system’s richest instructions.


**Dual-memory for thinking contexts.** When providing conversation context to a thinking model, separating
compressed long-range context (an LLM summary of the full history) from detailed short-range context (the
last several exchanges verbatim) keeps the thinking budget bounded regardless of conversation length while
preserving both strategic goals and operational details (Section 2.3.3). A subtlety: iteratively summarizing a
summary accumulates distortion over multiple rounds. Periodically regenerating the summary from the full
conversation history, rather than compressing the previous summary, corrects this drift.





**3.2** **Steering Behavior Over Long Horizons**


System prompt influence decays as conversations grow. Instructions that reliably govern the agent’s first
few turns are routinely violated after 30 or more tool calls, when the instruction is far from the model’s
attention window and buried under dozens of tool results. Behavioral guidance is therefore a signal-to-noise
engineering problem: how to maintain compliance without drowning the context in repeated directives.







**Explicit decision trees for tool selection.** Agents default to text search (grep) for nearly every lookup, even
when a more precise tool exists. This wastes iterations and floods the context with false positives. Encoding
a retrieval-tool decision tree directly into the agent’s prompt (routing symbol names to semantic search,


43


string patterns to text search, structural patterns to AST search, and file-name conventions to glob) reduced
unnecessary grep calls and improved first-attempt retrieval accuracy. The key is that the decision criteria
must be concrete and anchored to observable features of the query (“if the target is a function or class name,
use find_symbol”), not abstract (“use the most appropriate tool”).


**Provider-conditional prompt sections.** Different LLM providers have meaningfully different capabilities:
extended thinking, function calling conventions, context limits. Rather than cluttering the system prompt
with provider-agnostic instructions, registering provider-specific sections that load only when the corresponding provider is active keeps the prompt budget focused (Section 2.3.1). Unknown providers receive no
section; graceful degradation is better than incorrect guidance.


**3.3** **Safety Through Architectural Constraints**


Runtime permission checks are the wrong primary abstraction for agent safety. A model that sees a dangerous
tool in its schema can reason about invoking it, argue for why it should be allowed, and probe for edge cases
in the permission logic. The more robust approach is to make violations structurally impossible: if write
tools are absent from the agent’s schema, the agent cannot attempt writes because it never sees a way to
invoke them (Section 2.2). This is the difference between a guard rail and a missing road: the model cannot
reason about capabilities it does not know exist.





**Approval persistence prevents fatigue.** When a user marks an approval rule as “always allow,” persisting
it to disk so it survives session restarts is critical. Without persistence, users must re-approve the same
operations every session, causing approval fatigue that leads to blanket auto-approval, defeating the safety
system entirely.


**Lifecycle hooks as extensibility.** External scripts that observe or intercept agent lifecycle events enable
custom policies, logging, CI integration, and security enforcement without modifying agent code. The hook
interface must be designed early: blocking vs. non-blocking semantics, input mutation support, and merged
global/project-level configurations are all necessary for hooks to be useful rather than decorative.


**Modal priority during interrupt.** When the user presses an interrupt key while a modal dialog (approval
prompt, user question) is active, the system should cancel the dialog rather than interrupting the agent.
Interrupting the agent while a dialog is pending creates orphaned UI state (dangling spinners, stale futures,
unresolved promises) that requires manual cleanup.


44


**3.4** **Designing for Approximate Outputs**


LLMs reliably produce approximately-correct outputs. Edit targets drift from actual file content: trailing
whitespace, indentation differences, escape sequence variations. Recovery strategies reference tools the
agent does not have. Search queries route to suboptimal tools. A system that demands exact correctness
from the model will spend most of its time in error-recovery loops. The alternative is to design tools and
interfaces that absorb LLM imprecision as a first-class property.





**Auto-promoting server-like commands.** Development servers, build watchers, and test suites that run
indefinitely will hit any foreground timeout. Detecting server-like commands via regex patterns and
automatically promoting them to background execution with output capture prevents the agent from
blocking on a process that was never meant to terminate (Section 2.4.3).


**Auto-installing missing dependencies.** Tools that depend on external runtimes should auto-install the
dependency on first use rather than failing with an opaque error. Check for the dependency, install if missing,
and retry. This eliminates a common class of setup-related failures that confuse both the agent and the user,
and is another instance of designing tools to absorb environmental imprecision.


**3.5** **Lazy Loading and Bounded Growth**


Eager loading fails at scale. Loading all MCP tool schemas at startup consumed 40% of the context budget
before the agent processed its first user message. Loading all skill definitions populated the prompt with
content the agent would never use in most sessions. The solution in both cases is lazy discovery: load
metadata indexes at startup, defer full content to the point of use (Section 2.4.7).


For MCP tools, lazy discovery reduces the startup context cost from 40% to under 5%. The agent receives
a compact summary of available servers and their capabilities; full tool schemas are loaded only when
the agent selects a server for a specific task. For skills, a two-phase approach serves the same purpose: a
metadata index (name, description, trigger conditions) is loaded at startup, while the full skill content (which
may include multi-page prompt templates) is loaded only when the agent decides to invoke the skill.


External metadata (model capabilities, pricing, context limits) benefits from a stale-while-revalidate caching
strategy (Section 2.5.4): on startup, serve from cache if fresh; if stale, serve the stale data and refresh in the
background; if the refresh fails, continue with stale data. This guarantees offline startup and eliminates
“cannot connect” failures that block the entire system.


45


**Self-healing indexes.** Caching frequently-accessed metadata in a lightweight index file enables fast listing
without scanning underlying data files (Section 2.5.1). If the index is missing or corrupted, automatically
rebuilding it from the underlying data makes the index a performance optimization rather than a single
point of failure. The same principle applies to any derived data structure: design it so that loss triggers
regeneration, not failure.


**Deterministic operations outside the agent loop.** Not everything needs to go through the agent. Session
management, mode switching, model selection, and server configuration are deterministic operations that
should be handled directly at the input boundary (via slash-prefix dispatch or equivalent) with no approval
gates, no undo tracking, and no token cost (Section 2.2.4). Routing these through the LLM wastes context
and introduces unnecessary nondeterminism.


These five design tensions (context as a budget, behavioral steering over long horizons, safety through
architectural constraints, designing for approximate outputs, and bounding unbounded growth) are not
unique to OPENDEV. They reflect fundamental challenges in building any long-running agentic system.
The following section surveys how the broader research community has approached these same challenges,
positioning OPENDEV’s design decisions within the evolving landscape of code intelligence, autonomous
software engineering, and context engineering.


**4** **Related Work**


The development of terminal-centric AI coding agents draws upon a rich and rapidly evolving body of work
spanning code intelligence, autonomous software engineering, and interactive agent design. In this section,
we survey the key research streams that inform our system design and contextualize OPENDEV within the
broader landscape.


**4.1** **Code Generation and Code LLMs**


The application of LLMs to programming has progressed from function-level generation, benchmarked
by HumanEval [15] and MBPP [6], through class-level tasks such as ClassEval [23], to repository-level
challenges that demand cross-file planning and multi-step reasoning [47]. Specialized code LLMs including
DeepSeek-Coder [33], StarCoder [48], CodeLlama [72], and CodeT5+ [87] have driven this progression,
supported by unified toolkits such as CodeTF [11] that standardize training and inference across models,
while Retrieval-Augmented Generation [44] and reinforcement learning address the gap between isolated
generation and realistic repository-scale tasks [47]. OPENDEV builds on this foundation by embedding code


46


LLMs within an agentic loop that provides the navigation, editing, and execution capabilities necessary to
apply generated code in real repositories.


**4.2** **Autonomous Issue Resolution**


SWE-bench [40] defined the task of autonomous issue resolution, catalyzing a research frontier that spans
single-agent, multi-agent, and workflow-based approaches [46]. Single-agent frameworks such as SWEAgent [94] pioneered autonomous file navigation and code editing, while AutoCodeRover [108] and HyperAgent [69] extended this to iterative refinement and generalist task solving. Multi-agent systems distribute the
problem across specialized roles: MAGIS [78] assigns role-playing collaboration, CodeR [14] introduces taskgraph execution, and platforms such as OpenHands [84] orchestrate heterogeneous agents through ensemble
selection [46]. Workflow-based approaches like Agentless [89] enforce structured pipelines (localization,
repair, validation) for improved reproducibility.


Beyond architectural choices, the community has explored both training-based and inference-time methods
to improve agent capabilities. Supervised fine-tuning with curriculum learning [91] and synthetic data [68],
combined with RL algorithms leveraging process-oriented rewards [53], equip models with stronger issueresolution skills. At inference time, Monte Carlo Tree Search [112] enables flexible backtracking over repair
trajectories, while parallel exploration strategies such as CodeMonkeys [86] maximize solution coverage [46].
OPENDEV draws on these advances, combining single-agent autonomy with structured subagent delegation
and workflow-based safety enforcement. Across these paradigms, agents increasingly rely on code itself as
their primary medium of reasoning and action.


**4.3** **Code as a Core Medium for Generalist Agents**


Recent work has highlighted a paradigm shift from pure natural language reasoning to code-driven agent
interactions [47]. Using code as a universal medium gives agents precise tool invocation, reproducible state
management, and composable action primitives.


**Interaction protocols.** Standardized tool-use patterns such as ReAct [99] and ReWOO [92] enable precise
tool invocation and state management. The Model Context Protocol (MCP) [1] introduces structured
message formats for reliable multi-turn tool orchestration, while multi-agent coordination schemes such as
Agent-to-Agent (A2A) enable direct inter-agent communication [47].


**Thinking and acting in code.** _Reasoning methods_ such as Program-Aided Language Models (PAL) [27],
Program-of-Thoughts [47], and Chain-of-Code [47] enable LLMs to generate and execute code for structured
reasoning. _Action execution_ frameworks translate plans into runnable code: CodeAct [83] enables interactive
operations through executable Python, TaskWeaver [71] converts requests into plugin-based function calls,
and CodeAgents [77] provides additional orchestration patterns. _Domain applications_ extend this paradigm
beyond software engineering, from healthcare (EHRAgent [36]) to robotic control (Code as Policies [52]).


**Memory with code.** Code-based storage strategies have proven effective for managing LLM context constraints. Voyager [81] stores validated skills as executable code for later reuse, while Reasoning Bank [54]
enables rule-based learning from repair trajectories. MemGPT [66] and ExpeRepair [106] introduce hierarchical and dual-memory architectures for context management, both discussed further in the context
engineering subsection below.


By operating within terminal environments and embracing execution feedback through shell commands,
OpenDev directly aligns with the “Acting in Code” philosophy, leveraging the shell as a universal interpreter
to orchestrate complex, multi-step workflows.


47


**4.4** **Agentic Software Engineering Workflows**


Agentic Software Engineering formalizes the workflows through which human engineers and LLMs collaborate on software tasks. Hassan et al. [35] provide a comprehensive research roadmap that identifies
foundational pillars including agent orchestration, environment design, and lifecycle management.


**Iterative and prompt-driven workflows.** The Plan–Do–Assess–Review (PDAR) loop formalizes a single
task’s lifecycle: planning through Product Requirement Prompts (PRPs), implementation by a dev-agent, selfassessment, and human review [35]. CLI toolkits such as SuperClaude template these loops for consistency
and convenience, but stop short of a team-level methodology.


**Spec-driven development.** A growing family of frameworks treats structured specifications, rather than
source code, as the primary source of truth for AI-assisted development. GitHub’s Spec Kit [31] introduces a four-phase workflow (Specify, Plan, Tasks, Implement) where a formal spec.md and optional
constitution.md govern every agent-driven change, ensuring that AI-generated code aligns with explicitly declared intent and architectural constraints. OpenSpec [26] takes a complementary brownfield-first
approach, designed for evolving existing codebases rather than greenfield projects: each proposed change
generates spec deltas (ADDED/MODIFIED/REMOVED requirements in GIVEN/WHEN/THEN format)
against a persistent specification baseline, making modifications auditable before any code is written. Both
frameworks are agent-agnostic, integrating with 17+ coding assistants via slash commands and filesystem
conventions rather than tool-specific APIs.


**Multi-agent and agile-inspired frameworks.** BMAD [9] takes the team metaphor further by organizing
agents into agile roles (Product Owner, Architect, Developer, Scrum Master, Tester), with PRDs and story
files enabling parallel execution across isolated Git branches [35]. A key architectural decision is work
sharding: the Scrum Master agent decomposes tasks into self-contained story files, each carrying exactly the
context a Developer agent needs, which addresses context-window limitations by design rather than through
compression. A crucial delineation in the broader SASE roadmap proposes separating workspaces into an
Agent Command Environment (ACE) for human supervision and orchestration, and an Agent Execution
Environment (AEE) for scalable agent operations [35].


**Mentorship and lifecycle management.** The SASE roadmap [35] introduces the concept of Mentorship-asCode, where review feedback becomes version-controlled, testable MentorScript rules, enabling cumulative
improvement across tasks. Agent lifecycle management shifts agents from stateless contractors to persistent
teammates with memory, observability, and secure execution.


OPENDEV embodies the characteristics of an execution-focused terminal hub, bridging iterative development cycles natively via command-line interactivity and treating command outputs as direct signals for
autonomous debugging and loop refinement.


**4.5** **Agent Tool Systems and Modular Components**


In training-free frameworks, LLMs rely on specialized tools to augment reasoning without fine-tuning.
These tools are organized along the repair pipeline: bug reproduction, fault localization, code search, patch
generation, validation, and test generation [46].


Bug reproduction tools like AEGIS [51] provide automated environment setup and reproduction workflows,
ensuring consistent execution contexts. Fault localization tools include Spectrum-Based Fault Localization
(SBFL) and graph-based methods that construct code dependency graphs [46]. Code search tools range from
interactive retrieval using BM25 and AST-based APIs to graph-based understanding via Knowledge Graphs
and Language Server Protocols [46, 58]. Patch generation tools employ robust editing formats (e.g., AutoDiff)
and ensemble selection through regression testing [46]. SpecRover [16] uses specification-guided search
for high-quality patches. Test generation tools such as Otter [109] and Issue2Test [82] use feedback-driven
mechanisms to synthesize failing tests that reproduce reported defects [46].


48


OPENDEV adopts a registry-based tool architecture with lazy discovery, hierarchical skill templates, and
defense-in-depth safety mechanisms, balancing comprehensive capability with token efficiency.


**4.6** **Context Engineering for Long-Horizon Agents**


Context management is a fundamental challenge for long-running agent systems. Issue resolution tasks
often require long-horizon, multi-turn interaction that raises both API cost and performance degradation
from context rot [46].


**Formal** **foundations** **and** **taxonomy.** Mei et al. [56] provide the first comprehensive survey of context engineering (CE) for LLMs, formalizing the context supplied to a model as a structured tuple
_C_ = _A_ ( _c_ instr, _c_ know, _c_ tools, _c_ mem, _c_ state, _c_ query), where _A_ is an assembly function that orchestrates instructional context, external knowledge, tool schemas, memory, execution state, and the user query. The survey
organizes the field around three pillars: _context retrieval_ (selecting relevant information from external sources),
_context processing_ (transforming, compressing, or restructuring retrieved content), and _context management_
(maintaining coherence and relevance across turns). OPENDEV’s architecture maps directly onto this taxonomy: its prompt composer assembles _c_ instr from modular markdown sections, the tool registry manages
_c_ tools with lazy MCP discovery, the memory pipeline maintains _c_ mem, and adaptive compaction handles
_c_ state across long sessions.


**Historical and theoretical perspective.** Hua et al. [39] situate context engineering within a broader intellectual history, tracing four eras of development: early prompt engineering focused on single-turn instruction,
retrieval-augmented generation that introduced external knowledge, tool-augmented agents that expanded
the action space, and the current CE 2.0 era that treats context as a first-class engineering concern. Drawing
on Dey’s formal definition of context from ubiquitous computing and Weiser’s vision of calm technology,
they articulate three guiding principles: _entropy reduction_ (each context element should reduce uncertainty
about the desired output), _minimal sufficiency_ (include only what is necessary to avoid attention dilution),
and _semantic_ _continuity_ (context should evolve coherently across turns rather than being reconstructed
from scratch). They also identify a narrowness gap in current systems, which overwhelmingly focus on
chat history management while neglecting holistic context dimensions such as tool state, environmental
signals, and cross-session knowledge. OPENDEV’s system reminders, which inject event-driven context at
attention-critical positions, directly address the semantic continuity principle, while its staged compaction
implements entropy reduction by progressively summarizing low-value history.


**Context** **processing** **and** **compression** **techniques.** The survey literature documents substantial quantitative gains from structured context processing [56]. Chain-of-thought variants (tree-of-thought [98],
graph-of-thought [8]) improve multi-step reasoning by structuring intermediate context, while compression
methods reduce token costs without proportional quality loss: the In-context Autoencoder [29] achieves
4 _×_ compression, and PREMISE reduces prompt length by 87.5% while preserving task performance. On
the retrieval side, Self-RAG [5] introduces self-reflective retrieval that adaptively decides when to retrieve
and critiques its own outputs, RAPTOR [73] builds recursive tree-structured summaries for hierarchical
retrieval, and GraphRAG leverages knowledge graph structures (e.g., HippoRAG [34]) to improve retrieval
precision for complex queries. These advances reveal a fundamental asymmetry: LLMs are more robust to
compressed context during understanding tasks than during generation tasks, suggesting that aggressive
compression is most viable for context that informs reasoning rather than context that directly shapes output
text. OPENDEV’s compaction strategy exploits this asymmetry by aggressively summarizing tool outputs
and historical turns (understanding context) while preserving system instructions and recent user messages
(generation context) verbatim.


**Meta-level context optimization.** Ye et al. [101] introduce Meta Context Engineering (MCE), a framework
that treats context engineering itself as an optimization problem rather than a manual design task. They
formalize the agent’s context as a bi-level optimization: the outer loop searches over context configurations
(system prompts, tool schemas, memory strategies) while the inner loop evaluates agent performance on


49


downstream tasks. A key insight is that fixed evaluation harnesses introduce systematic bias into agent
benchmarks, as the harness itself shapes the context in ways that may advantage certain strategies over others.
MCE addresses this by co-evolving the agent’s context and evaluation setup using a (1+1)-ES with crossover,
an evolutionary strategy that mutates and recombines context configurations. On SWE-bench Verified, MCE
achieves 89.1% resolve rate compared to 70.7% for the hand-engineered baseline, while also being 13.6 _×_
faster due to more efficient context utilization. The optimized configurations transfer across tasks, suggesting
that meta-learned context strategies capture general principles rather than task-specific artifacts. This line
of work implies that hand-designed context engineering, including the strategies employed by OPENDEV,
could eventually be complemented or replaced by learned optimization of context assembly.


Memory integration empowers agents to transcend isolated problem-solving by accumulating historical
context. Approaches range from hierarchical storage separating general knowledge from repository-specific
details [46], to cognitive architectures that partition knowledge into episodic, semantic, and procedural
stores [38, 56, 111]. Building on the memory primitives discussed above (MemGPT’s virtual paging [66],
ExpeRepair’s dual-memory [106]), more recent work explores population-level memory: agent variant populations [17] maintain diverse exploration histories for robust decision-making, while experience banks [85]
guide search through accumulated knowledge. Current frontiers prioritize distilling transferable reasoning
strategies, shifting from storing raw data to abstracting high-level policies from trajectories [46].


Memory-driven scaling approaches complement the inference-time strategies discussed above by integrating
persistent context to reduce redundant exploration, enabling agents to build on past attempts rather than
starting fresh. Context compression for long-horizon agents has seen notable advances: ACON [41] optimizes
compression policies for extended agent sessions, while Context-Folding [76] scales agent capabilities
through recursive context summarization. At the frontier, Agentic Context Engineering [107] enables models
to evolve their own contexts through self-improvement loops. Multi-agent communication has matured
through a progression of standardized protocols, from early knowledge-sharing languages (KQML, FIPA
ACL) to modern interoperability standards including MCP [1] for tool integration, Agent-to-Agent (A2A)
for direct inter-agent messaging, and Agent Communication Protocol (ACP) for structured multi-agent
coordination [56]. OPENDEV addresses these challenges through automatic compaction that preserves
critical information while summarizing history, combined with dual-memory architecture and templatebased error recovery. Young [102] formalizes the notion of an agent _harness_ as the runtime framework that
coordinates these concerns (tool dispatch, context lifecycle, progress tracking, and clean handoffs between
context windows) for agents operating over extended timeframes.


**4.7** **Benchmarks for Evaluating Agentic Coding Systems**


Having introduced foundational code generation benchmarks above, we focus here on the evaluation
ecosystem around agentic systems. The scope of benchmarks has progressively widened: from function- and
class-level generation (APPS [37], CodeContests [50]), through repository-level issue resolution anchored
by SWE-bench [40] and its variants (SWE-bench Verified [64], Multi-SWE-bench [104], SWE-bench Multimodal [96], SWE-bench Pro [21], SWE-Lancer [59]), to environment-grounded interaction tasks such as
WebArena [113], OSWorld [90], and EnvBench [24]. Complementary benchmarks target specific dimensions:
SWT-Bench [60] for testing workflows, FEA-Bench [49] for feature implementation, NL2Repo-Bench [22] for
repository generation, DevEval [45] for the full development lifecycle, and SWE-EVO [79] for long-horizon
software evolution.


Specialized benchmarks evaluate capabilities beyond general code editing. _τ_ -Bench [97] and the Berkeley
Function Calling Leaderboard [67] assess tool-use and function-calling proficiency. In scientific and ML
engineering, ReplicationBench [100] targets research replication, MLGym [61] and MLE-Bench [12] evaluate
ML research and engineering tasks, and CORE-Bench [75] measures computational reproducibility. For
long-horizon terminal interaction, Terminal-Bench [57] demonstrates that frontier agents resolve fewer
than 65% of curated CLI tasks, while LongCLI-Bench [25] finds pass rates below 20% for multi-category
programming tasks spanning development, feature addition, bug fixing, and refactoring.


50


**4.8** **Evaluation Methodology and Best Practices**


Rigorous evaluation of agentic systems requires careful benchmark design beyond simple accuracy metrics. The Agentic Benchmark Checklist [114, 115] formalizes best practices including clear task definition,
reproducibility guarantees, contamination prevention, and efficiency-aware metrics. LLM-as-Judge approaches such as MT-Bench [110] enable scalable quality assessment when traditional metrics fail to capture
semantic correctness, though data contamination remains a critical concern requiring continuous benchmark
renewal [20, 93]. Efficiency metrics (API costs, inference time, and token consumption [55]) and long-task
completion measurement [42, 43] provide holistic assessment of agent practicality for real-world deployment.


**4.9** **Human–Agent Collaboration**


LongCLI-Bench provides compelling evidence that human–agent collaboration significantly improves task
completion. Static plan injection, where key plans are provided before execution, outperforms self-correction
in both pass rate and efficiency. Dynamic interactive guidance, where agents request human intervention
based on their current state, achieves even higher performance. The combined setting yields the best results
while reducing the need for human intervention [25]. These findings strongly indicate that rather than
exclusively pursuing full autonomy, future systems should develop collaborative workflows that leverage
synergy between efficient agent execution and human strategic guidance. OPENDEV supports this paradigm
through its approval workflows, interactive command execution, and structured feedback loops.


The research landscape surveyed above reveals a clear trajectory: from isolated code generation toward
integrated, long-horizon agent systems that must balance capability, safety, and context efficiency. The
benchmarks increasingly demand sustained multi-step reasoning in realistic environments, while the
methods progressively address the engineering challenges (context management, tool orchestration, memory,
and safety) that such sustained operation requires. The following section synthesizes the specific future
directions that emerge from the intersection of OPENDEV’s architectural experience and these broader
research trends.


**5** **Conclusion and Future Directions**


This paper presented OPENDEV, an open AI-powered command-line agent for software engineering, and
documented the architectural decisions, design trade-offs, and lessons learned from building a productionready system. Key contributions include a compound AI system architecture [103] with multi-model routing
(Section 2.2.5), an extended ReAct pipeline with thinking and critique phases (Section 2.2.6), Adaptive
Context Compaction (Section 2.3.6), event-driven system reminders (Section 2.3.4), an experience-driven
memory pipeline, lazy tool discovery via MCP (Section 2.4.7), and a dual-interface abstraction.


The central architectural insight is that per-workflow LLM binding (Section 2.2.5) yields model-agnosticity:
adapting to new models requires only configuration changes, not code changes. Schema-level safety
enforcement (Section 2.2) proved more robust than runtime permission checks, as removing write tools from
the planning agent’s schema eliminates an entire class of bypass attempts. Conditional prompt composition
(Section 2.3.1) reduced overhead by excluding irrelevant instructions while preserving comprehensive
guidance when needed. On the context engineering side, managing the finite context window emerged
as a first-class engineering concern rather than a secondary optimization. Adaptive Context Compaction
(Section 2.3.6), which transitions observations through active, faded, and archived states, reduced peak
context consumption by approximately 54% and often eliminated the need for emergency summarization.
The three-tier context architecture (static system prompt, dynamic just-in-time reminders (Section 2.3.4), and
long-horizon persistence) addressed the attention-decay problem where agents reliably violated instructions
after 30+ tool calls. The Agentic Context Engineering memory pipeline enables the agent to learn from tool
outcomes within and across sessions without hardcoding strategies into prompts.


The cross-cutting design tensions and transferable lessons that emerged from this work are synthesized
in Section 3, which examines context pressure as a first-class constraint, behavioral steering over long


51


horizons, safety through architectural enforcement rather than runtime checks, tool design that absorbs LLM
imprecision, and resource bounding strategies for long-running sessions.


Several capabilities previously identified as future work, such as per-step undo via shadow git snapshots
(Section 2.5.2), has been implemented during continued development, demonstrating the extensibility of the
layered architecture.


Several promising research directions emerge from the challenges identified in this work:


_•_ **Quantitative** **evaluation** **on** **established** **benchmarks.** This paper documents architectural decisions
and design rationale but lacks systematic quantitative evaluation. Benchmarking on SWE-bench [95],
Terminal-Bench [57], and LongCLI-Bench [25], part of the broader evaluation ecosystem surveyed in
Section 4, would validate the architecture against established baselines and identify specific improvement
areas. Terminal-Bench’s finding that frontier agents resolve fewer than 65% of tasks, and LongCLIBench’s observation that pass rates remain below 20% for long-horizon tasks, suggest substantial room for
improvement in context management and multi-step reasoning.

_•_ **Adaptive resource allocation.** Current parameters - the 70% compaction threshold, 3 nudge attempts, 6
thinking depth levels - are globally fixed. Adaptive approaches that dynamically adjust based on task
complexity, current context pressure, and error history could optimize the cost–quality–latency triangle per
task rather than relying on one-size-fits-all constants. For instance, a simple debugging task should skip
the thinking phase entirely, while a complex architectural refactoring may benefit from deeper deliberation
and a more conservative compaction strategy.

_•_ **Scaling** **the** **memory** **pipeline.** The ACE playbook currently operates per-project with effectiveness
scoring and semantic retrieval. Cross-project knowledge transfer - where lessons learned in one repository
inform behavior in similar projects - hierarchical bullet organization that separates general programming
heuristics from project-specific conventions, and active learning that selectively requests user feedback on
uncertain bullets could substantially improve the agent’s ability to accumulate and apply experience over
time.

_•_ **Structured** **code** **representations** **for** **memory.** The current memory pipeline stores experience as flat
natural-language bullets. Richer representations, such as code dependency graphs that capture relationships between modules, call graphs that track function interactions, and project-level ontologies that
encode domain concepts, could enable more precise retrieval and reasoning. Combining graph-structured
code understanding with long-term persistent memory that spans not just sessions but entire project
lifecycles would allow the agent to build deep, evolving models of codebases rather than accumulating
isolated observations.

_•_ **Multi-agent coordination beyond hierarchical delegation.** Current subagents execute independently
under main-agent coordination, communicating only through completion markers. Richer coordination
patterns - peer-to-peer communication between subagents, shared blackboard architectures for collaborative problem-solving, and negotiation protocols for resolving conflicting tool outcomes - could enable
more sophisticated workflows such as concurrent code review and implementation, or parallel exploration
with result synthesis.

_•_ **Learned system reminder optimization.** The 24-template reminder catalog and its injection timing were
manually engineered based on observed failure modes. Automated discovery of effective reminder
patterns - through reinforcement learning on attention-decay metrics, learned injection timing based on
conversation dynamics, or adaptive template selection conditioned on agent state - could improve nudge
effectiveness while reducing the manual engineering burden of designing and maintaining reminder
templates.

_•_ **Hybrid CLI–IDE integration.** The dual-interface architecture demonstrates that a shared callback protocol
can serve fundamentally different frontends. Extending this to IDE plugins  - where the same agent
logic powers both terminal workflows and rich editor integration - would serve users who want visual
affordances (inline diffs, symbol navigation, test result overlays) alongside terminal autonomy, without
duplicating agent logic across environments.


52


Building effective agentic coding systems requires navigating competing concerns: capability versus complexity, autonomy versus safety, generality versus token efficiency. The design space is rich with trade-offs
where no single choice dominates. We hope that the architectural patterns, engineering lessons, and candid
reflections on what worked and what did not, documented in this paper, help future builders of agentic
systems make more informed decisions as they navigate these choices.


**References**


[1] Anthropic. Model context protocol. [https://modelcontextprotocol.io, 2024.](https://modelcontextprotocol.io) Accessed: 2025-01-15.


[2] Anthropic. Claude code: An agentic coding tool. [https://docs.anthropic.com/en/docs/](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
[agents-and-tools/claude-code/overview, 2025.](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) Accessed: 2025-01-15.


[3] Anthropic. Effective context engineering for ai agents. [https://www.anthropic.com/engineering/](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
[effective-context-engineering-for-ai-agents, 2025.](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)


[4] Anysphere. Cursor: The ai code editor. [https://cursor.com, 2025.](https://cursor.com)


[5] Akari Asai, Zeqiu Wu, Yizhong Wang, Avirup Sil, and Hannaneh Hajishirzi. Self-rag: Learning to retrieve, generate, and critique through self-reflection. _International Conference on Learning Representations_,
2024.


[6] Jacob Austin et al. Program synthesis with large language models. _arXiv preprint arXiv:2108.07732_,
2021.


[7] Alan Baddeley. Working memory. _Science_, 255(5044):556–559, 1992.


[8] Maciej Besta, Nils Blach, Aleš Kubíˇcek, Robert Gerstenberger, Lukas Gianinazzi, Joanna Gajda, Tomasz
Lehmann, Michal Podstawski, Hubert Niewiadomski, Piotr Nyczyk, and Torsten Hoefler. Graph
of thoughts: Solving elaborate problems with large language models. _AAAI Conference on Artificial_
_Intelligence_, 2024.


[9] Adam Blackington. BMAD-METHOD: Breakthrough method for agile AI-driven development. [https:](https://github.com/bmad-code-org/BMAD-METHOD)
[//github.com/bmad-code-org/BMAD-METHOD, 2025.](https://github.com/bmad-code-org/BMAD-METHOD)


[10] Block. Goose: An open-source ai agent. [https://github.com/block/goose, 2025.](https://github.com/block/goose)


[11] Nghi D. Q. Bui, Hung Le, Yue Wang, Junnan Li, Akhilesh Deepak Gotmare, and Steven C. H. Hoi.
Codetf: One-stop transformer library for state-of-the-art code llm. _arXiv preprint arXiv:2306.00029_,
2023.


[12] Jun Shern Chan, Neil Chowdhury, Oliver Jaffe, James Aung, Dane Sherburn, Evan Mays, Giulio Starace,
Kevin Liu, Leon Maksin, Tejal Patwardhan, et al. MLE-bench: Evaluating machine learning agents on
machine learning engineering. In _The Thirteenth International Conference on Learning Representations_,
2025.


[13] Charm. Crush: An agentic coding tool for the terminal. [https://github.com/charmbracelet/crush,](https://github.com/charmbracelet/crush)
2025.


[14] et al. Chen. Coder: Issue resolving with multi-agent and task graphs. _arXiv preprint arXiv:2406.01304_,
2024.


[15] Mark Chen et al. Evaluating large language models trained on code. _arXiv preprint arXiv:2107.03374_,
2021.


[16] Yuhao Chen, Xin Zhang, Tao Wang, et al. Specrover: Specification-guided patch generation. _arXiv_
_preprint_, 2024.


[17] Jeff Clune, Kenneth Stanley, et al. Diverse agent populations for more robust exploration. _arXiv_
_preprint_, 2024.


53


[18] Cognition. Introducing devin, the first ai software engineer. [https://cognition.ai/blog/](https://cognition.ai/blog/introducing-devin)
[introducing-devin, 2024.](https://cognition.ai/blog/introducing-devin)


[19] OpenCode Contributors. Opencode: Ai-powered terminal assistant. [https://github.com/](https://github.com/opencode-ai/opencode)
[opencode-ai/opencode, 2025.](https://github.com/opencode-ai/opencode)


[20] Chunyuan Deng, Yilun Zhao, Xiangru Tang, Mark Gerstein, and Arman Cohan. Investigating data
contamination in modern benchmarks for large language models. _NAACL_, pages 8706–8719, 2024.


[21] Xiang Deng, Jeff Da, Edwin Pan, Yannis Yiming He, Charles Ide, Kanak Garg, Niklas Lauffer,
et al. Swe-bench pro: Can ai agents solve long-horizon software engineering tasks? _arXiv preprint_
_arXiv:2509.16941_, 2025.


[22] Jingzhe Ding, Shengda Long, Changxin Pu, Huan Zhou, Hongwan Gao, Xiang Gao, Chao He, Yue Hou,
Fei Hu, Zhaojian Li, et al. Nl2repo-bench: Towards long-horizon repository generation evaluation of
coding agents, 2025.


[23] Xueying Du, Mingwei Liu, Kaixin Wang, Hanlin Wang, Junwei Liu, Yixuan Chen, Jiayi Feng, Chaofeng
Sha, Xin Peng, and Yiling Lou. Evaluating large language models in class-level code generation. In
_Proceedings of the 46th IEEE/ACM International Conference on Software Engineering (ICSE 2024)_, pages
81:1–81:13. ACM, 2024.


[24] Aleksandra Eliseeva, Alexander Kovrigin, Ilia Kholkin, Egor Bogomolov, and Yaroslav Zharov. Envbench: A benchmark for automated environment setup. In _ICLR 2025 Third Workshop on Deep Learning_
_for Code_, 2025.


[25] Yukang Feng, Jianwen Sun, Zelai Yang, et al. Longcli-bench: A preliminary benchmark and study for
long-horizon agentic programming in command-line interfaces. _arXiv preprint_, 2025.


[26] Fission AI. OpenSpec: Spec-driven development framework. [https://github.com/Fission-AI/](https://github.com/Fission-AI/OpenSpec)
[OpenSpec, 2025.](https://github.com/Fission-AI/OpenSpec)


[27] Luyu Gao et al. Pal: Program-aided language models. In _ICML_, 2023.


[28] Paul Gauthier. Aider: Ai pair programming in your terminal. [https://aider.chat, 2024.](https://aider.chat) Accessed:
2025-01-15.


[29] Tao Ge, Jing Hu, Xun Wang, Si-Qing Chen, and Furu Wei. In-context autoencoder for context
compression in a large language model. _International Conference on Learning Representations_, 2024.


[30] GitHub. Github copilot: Meet the new coding agent. [https://github.blog/news-insights/](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/)
[product-news/github-copilot-meet-the-new-coding-agent/, 2025.](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/)


[31] GitHub. Spec kit: Toolkit for spec-driven development. [https://github.com/github/spec-kit, 2025.](https://github.com/github/spec-kit)


[32] Google. Gemini cli. [https://github.com/google-gemini/gemini-cli, 2025.](https://github.com/google-gemini/gemini-cli)


[33] Daya Guo et al. Deepseek-coder: When the large language model meets programming. _arXiv preprint_
_arXiv:2401.14196_, 2024.


[34] Bernal Jimenez Gutierrez, Yiheng Shu, Yu Gu, Michihiro Yasunaga, and Yu Su. Hipporag: Neurobiologically inspired long-term memory for large language models. _Advances in Neural Information_
_Processing Systems_, 37, 2024.


[35] Ahmed E. Hassan, Hao Li, Dayi Lin, Bram Adams, Tse-Hsun Chen, Yutaro Kashiwa, and Dong
Qiu. Agentic software engineering, foundational pillars and a research roadmap. _arXiv_ _preprint_
_arXiv:2509.06216_, 2025.


[36] Wenqi He, Zonghai Chen, Xianwei Li, et al. Ehragent: Code empowers large language models for
few-shot complex tabular reasoning on electronic health records. _arXiv preprint arXiv:2401.07128_, 2024.


54


[37] Dan Hendrycks, Steven Basart, Saurav Kadavath, Mantas Mazeika, Akul Arora, Ethan Guo, Collin
Burns, Samir Puranik, Horace He, and Dawn Song. Measuring coding challenge competence with
apps. _arXiv preprint arXiv:2105.09938_, 2021.


[38] Yuyang Hu, Shichun Liu, Yanwei Yue, Guibin Zhang, Boyang Liu, Fangyi Zhu, Jiahang Lin, Honglin
Guo, Shihan Dou, Zhiheng Xi, et al. Memory in the age of ai agents. _arXiv preprint arXiv:2512.13564_,
2025.


[39] Qishuo Hua, Lyumanshan Ye, Dayuan Fu, Yang Xiao, Xiaojie Cai, Yunze Wu, Jifan Lin, Junfei
Wang, and Pengfei Liu. Context engineering 2.0: The context of context engineering. _arXiv preprint_
_arXiv:2510.26493_, 2025.


[40] Carlos E Jimenez et al. Swe-bench: Can language models resolve real-world github issues? In _ICLR_,
2024.


[41] Minki Kang, Wei-Ning Chen, Dongge Han, Huseyin A. Inan, Lukas Wutschitz, Yanzhi Chen, Robert
Sim, and Saravan Rajmohan. Acon: Optimizing context compression for long-horizon llm agents.
_arXiv preprint arXiv:2510.00615_, 2025.


[42] Thomas Kwa, Ben West, Joel Becker, Amy Deng, Katharyn Garcia, Max Hasin, Sami Jawhar, Megan
Kinniment, Nate Rush, Sydney von Arx, et al. Measuring ai ability to complete long tasks. _arXiv_
_preprint arXiv:2503.14499_, 2025.


[43] Thomas Kwa, Ben West, Joel Becker, Amy Deng, Katharyn Garcia, Max Hasin, Sami Jawhar, Megan
Kinniment, Nate Rush, Sydney von Arx, et al. Measuring ai ability to complete long tasks. _arXiv_
_preprint arXiv:2503.14499_, 2025.


[44] Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal,
Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, and Douwe Kiela.
Retrieval-augmented generation for knowledge-intensive nlp tasks. In _NeurIPS_, 2020.


[45] Bowen Li, Wenhan Wu, Ziwei Tang, Lin Shi, John Yang, Jinyang Li, Shunyu Yao, Chen Qian, Binyuan
Hui, Qicheng Zhang, et al. Prompting large language models to tackle the full software development
lifecycle: A case study. In _Proceedings of the 31st International Conference on Computational Linguistics_,
pages 7511–7531, Abu Dhabi, UAE, 2025. Association for Computational Linguistics.


[46] Caihua Li et al. Advances and frontiers of llm-based issue resolution in software engineering: A
comprehensive survey. _arXiv preprint_, 2025.


[47] Caihua Li et al. From code foundation models to agents and applications, a comprehensive survey
and practical guide to code intelligence. _arXiv preprint_, 2025.


[48] Raymond Li et al. Starcoder: May the source be with you! _arXiv preprint arXiv:2305.06161_, 2023.


[49] Wei Li, Xin Zhang, Zhongxin Guo, Shaoguang Mao, Wen Luo, Guangyue Peng, Yangyu Huang,
Houfeng Wang, and Scarlett Li. Fea-bench: A benchmark for evaluating repository-level code generation for feature implementation. _arXiv preprint arXiv:2503.06680_, 2025.


[50] Yujia Li, David Choi, Junyoung Chung, Nate Kushman, Julian Schrittwieser, Rémi Leblond, Tom
Eccles, James Keeling, Felix Gimeno, Agustin Dal Lago, et al. Competition-level code generation with
alphacode. _Science_, 378(6624):1092–1097, 2022.


[51] Yuntong Li, Yanjie Zhou, Zheng Liu, et al. Aegis: Automated environment setup for bug reproduction.
_arXiv preprint_, 2024.


[52] Jacky Liang, Wenlong Huang, Fei Xia, Peng Xu, Karol Hausman, Brian Ichter, Pete Florence, and Andy
Zeng. Code as policies: Language model programs for embodied control. _ICRA_, 2023.


55


[53] Hunter Lightman, Vineet Kosaraju, Yura Burda, Harri Edwards, Bowen Baker, Teddy Lee, Jan
Leike, John Schulman, Ilya Sutskever, and Karl Cobbe. Let’s verify step by step. _arXiv_ _preprint_
_arXiv:2305.20050_, 2023.


[54] Tianyu Liu, Daoguang Zan, Bei Chen, et al. Reasoning bank: Learning from trajectories for program
repair. _arXiv preprint_, 2024.


[55] Yuchen Liu, Tianyi Zhang, Yiming Wang, et al. Efficient evaluation of llm agents: Cost, latency, and
token consumption. _arXiv preprint_, 2024.


[56] Lingrui Mei, Jiayu Yao, Yuyao Ge, Yiwei Wang, Baolong Bi, Yujun Cai, Jiazhi Liu, Mingyu Li, ZhongZhi Li, Duzhen Zhang, et al. A survey of context engineering for large language models. _arXiv preprint_
_arXiv:2507.13334_, 2025.


[57] Mike A. Merrill, Alexander G. Shaw, Nicholas Carlini, et al. Terminal-bench: Benchmarking agents on
hard, realistic tasks in command line interfaces. _arXiv preprint_, 2025.


[58] Microsoft. Language server protocol specification. [https://microsoft.github.io/](https://microsoft.github.io/language-server-protocol/)
[language-server-protocol/, 2016.](https://microsoft.github.io/language-server-protocol/) Accessed: 2025-01-15.


[59] Samuel Miserendino, Michele Wang, Tejal Patwardhan, and Johannes Heidecke. SWE-lancer: Can
frontier LLMs earn $1 million from real-world freelance software engineering? In _Forty-second_
_International Conference on Machine Learning_, 2025.


[60] Niels Mündler, Mark Niklas Mueller, Jingxuan He, and Martin Vechev. SWT-bench: Testing and
validating real-world bug-fixes with code agents. In _The Thirty-eighth Annual Conference on Neural_
_Information Processing Systems_, 2024.


[61] Deepak Nathani, Lovish Madaan, Nicholas Roberts, Nikolay Bashlykov, Ajay Menon, Vincent Moens,
Mikhail Plekhanov, et al. MLGym: A new framework and benchmark for advancing AI research
agents. In _Second Conference on Language Modeling_, 2025.


[62] Isaac Ong, Amjad Almahairi, Vincent Wu, Wei-Lin Chiang, Tianhao Wu, Joseph E Gonzalez, M Waleed
Kadous, and Ion Stoica. Routellm: Learning to route llms with preference data. _arXiv_ _preprint_
_arXiv:2406.18665_, 2024.


[63] Open Interpreter. Open interpreter. [https://github.com/OpenInterpreter/open-interpreter, 2023.](https://github.com/OpenInterpreter/open-interpreter)
Accessed: 2025-01-15.


[64] OpenAI. Introducing swe-bench verified. [https://openai.com/index/](https://openai.com/index/introducing-swe-bench-verified/)
[introducing-swe-bench-verified/, 2024.](https://openai.com/index/introducing-swe-bench-verified/)


[65] OpenAI. Introducing codex. [https://openai.com/index/introducing-codex/, 2025.](https://openai.com/index/introducing-codex/)


[66] Charles Packer et al. Memgpt: Towards llms as operating systems. _arXiv preprint arXiv:2310.08560_,
2023.


[67] Shishir G. Patil, Huanzhi Mao, Charlie Cheng-Jie Ji, Fanjia Yan, Vishnu Suresh, Ion Stoica, and Joseph
E. Gonzalez. The berkeley function calling leaderboard (bfcl): From tool use to agentic evaluation of
large language models. In _Forty-second International Conference on Machine Learning_, 2025.


[68] Minh VT Pham, Huy N Phan, Hoang N Phan, Cuong Le Chi, Tien N Nguyen, and Nghi DQ Bui. Swesynth: Synthesizing verifiable bug-fix data to enable large language models in resolving real-world
bugs. _arXiv preprint arXiv:2504.14757_, 2025.


[69] Huy Nhat Phan, Tien N Nguyen, Phong X Nguyen, and Nghi DQ Bui. Hyperagent: Generalist
software engineering agents to solve coding tasks at scale. _arXiv preprint arXiv:2409.16299_, 2024.


[70] Ofir Press, Muru Zhang, Sewon Min, Ludwig Schmidt, Noah A. Smith, and Mike Lewis. Measuring
and narrowing the compositionality gap in language models. _arXiv preprint arXiv:2210.03350_, 2022.


56


[71] Bo Qiao et al. Taskweaver: A code-first agent framework. _arXiv preprint arXiv:2311.17541_, 2023.


[72] Baptiste Rozière et al. Code llama: Open foundation models for code. _arXiv preprint arXiv:2308.12950_,
2023.


[73] Parth Sarthi, Salman Abdullah, Aditi Tuli, Shubh Khanna, Anna Goldie, and Christopher D. Manning.
Raptor: Recursive abstractive processing for tree-organized retrieval. _International_ _Conference_ _on_
_Learning Representations_, 2024.


[74] Noah Shinn, Federico Cassano, Ashwin Gopinath, Karthik Narasimhan, and Shunyu Yao. Reflexion:
Language agents with verbal reinforcement learning. _Advances in Neural Information Processing Systems_,
36:8634–8652, 2023.


[75] Zachary S Siegel, Sayash Kapoor, Nitya Nadgir, Benedikt Stroebl, and Arvind Narayanan. COREbench: Fostering the credibility of published research through a computational reproducibility agent
benchmark. _Transactions on Machine Learning Research_, 2024.


[76] Weiwei Sun, Miao Lu, Zhan Ling, Kang Liu, Xuesong Yao, Yiming Yang, and Jiecao Chen. Scaling
long-horizon llm agent via context-folding. _arXiv preprint arXiv:2510.11967_, 2025.


[77] Zhiyu Tang, Yue Wang, Xu Zhou, Xin Eric Wang, et al. Codeagents: Interactive code generation
through multi-agent programming. _arXiv preprint_, 2024.


[78] Wei Tao et al. Magis: Llm-based multi-agent framework for github issue resolution. _arXiv preprint_
_arXiv:2403.17927_, 2024.


[79] Minh VT Thai, Tue Le, Dung Nguyen Manh, Huy Phan Nhat, and Nghi DQ Bui. Swe-evo: Benchmarking coding agents in long-horizon software evolution scenarios. _arXiv preprint arXiv:2512.18470_,
2025.


[80] Harsh Trivedi, Niranjan Balasubramanian, Tushar Khot, and Ashish Sabharwal. Interleaving retrieval with chain-of-thought reasoning for knowledge-intensive multi-step questions. _arXiv preprint_
_arXiv:2212.10509_, 2022.


[81] Guanzhi Wang et al. Voyager: An open-ended embodied agent with large language models. _arXiv_
_preprint arXiv:2305.16291_, 2023.


[82] Shuang Wang, Bowen Li, Yong Chen, et al. Issue2test: From issue reports to test cases. _arXiv preprint_,
2024.


[83] Xingyao Wang et al. Executable code actions elicit better llm agents. _arXiv preprint arXiv:2402.01030_,
2024.


[84] Xingyao Wang et al. Openhands: An open platform for ai software developers as generalist agents.
_arXiv preprint arXiv:2407.16741_, 2024.


[85] Yiming Wang, Jun Zhang, Yizhe Li, et al. Experience-driven monte carlo tree search. _arXiv preprint_,
2024.


[86] Yiming Wang, Tianyi Zhang, Zhengyang Chen, et al. Codemonkeys: Massively parallel state machines
for inference-time scaling. _arXiv preprint_, 2024.


[87] Yue Wang, Hung Le, Akhilesh Deepak Gotmare, Nghi D. Q. Bui, Junnan Li, and Steven C. H. Hoi.
Codet5+: Open code large language models for code understanding and generation. In _Proceedings of_
_the 2023 Conference on Empirical Methods in Natural Language Processing (EMNLP)_, 2023.


[88] Tianxin Wei, Ting-Wei Li, Zhining Liu, Xuying Ning, Ze Yang, Jiaru Zou, Zhichen Zeng, Ruizhong Qiu,
Xiao Lin, Dongqi Fu, et al. Agentic reasoning for large language models. _arXiv preprint arXiv:2601.12538_,
2026.


57


[89] Chunqiu Steven Xia et al. Agentless: Demystifying llm-based software engineering agents. _arXiv_
_preprint arXiv:2407.01489_, 2024.


[90] Tianbao Xie, Danyang Zhang, Jixuan Chen, Xiaochuan Li, Siheng Zhao, Ruisheng Cao, Toh Jing Hua,
Zhoujun Cheng, Dongchan Shin, Fangyu Lei, et al. OSWorld: Benchmarking multimodal agents for
open-ended tasks in real computer environments. In _The Thirty-eight Conference on Neural Information_
_Processing Systems Datasets and Benchmarks Track_, 2024.


[91] Benfeng Xu, Licheng Zhang, Zhendong Mao, Quan Wang, Hongtao Xie, and Yongdong Zhang.
Curriculum learning for natural language understanding. _ACL_, 2020.


[92] Binfeng Xu et al. Rewoo: Decoupling reasoning from observations for efficient augmented language
models. _arXiv preprint arXiv:2305.18323_, 2023.


[93] Cheng Xu, Shuhao Guan, Derek Greene, and M-Tahar Kechadi. Benchmark data contamination of
large language models: A survey. _arXiv preprint arXiv:2406.04244_, 2024.


[94] John Yang et al. Swe-agent: Agent-computer interfaces enable automated software engineering. _arXiv_
_preprint arXiv:2405.15793_, 2024.


[95] John Yang, Carlos E Jimenez, Alexander Wettig, Kilian Lieret, Shunyu Yao, Karthik Narasimhan, and
Ofir Press. Swe-agent: Agent-computer interfaces enable automated software engineering. _Advances_
_in Neural Information Processing Systems_, 37:50528–50652, 2024.


[96] John Yang, Carlos E Jimenez, Alex L Zhang, Kilian Lieret, Joyce Yang, Xindi Wu, Ori Press, Niklas
Muennighoff, Gabriel Synnaeve, Karthik R Narasimhan, et al. SWE-bench multimodal: Do AI
systems generalize to visual software domains? In _The Thirteenth International Conference on Learning_
_Representations_, 2025.


[97] Shunyu Yao, Noah Shinn, Pedram Razavi, and Karthik R Narasimhan. {$\tau$}-bench: A benchmark
for \underline{T}ool-\underline{A}gent-\underline{U}ser interaction in real-world domains. In _The_
_Thirteenth International Conference on Learning Representations_, 2025.


[98] Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, and Karthik
Narasimhan. Tree of thoughts: Deliberate problem solving with large language models. _Advances in_
_Neural Information Processing Systems_, 36, 2023.


[99] Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, and Yuan Cao.
React: Synergizing reasoning and acting in language models. In _International Conference on Learning_
_Representations (ICLR)_, 2023.


[100] Christine Ye, Sihan Yuan, Suchetha Cooray, Steven Dillmann, Ian L. V. Roque, Dalya Baron, Philipp
Frank, Sergio Martin-Alvarez, et al. Replicationbench: Can ai agents replicate astrophysics research
papers? _arXiv preprint arXiv:2510.24591_, 2025.


[101] Haoran Ye, Xuning He, Vincent Arak, Haonan Dong, and Guojie Song. Meta context engineering via
agentic skill evolution. _arXiv preprint arXiv:2601.21557_, 2026.


[102] Justin Young. Effective harnesses for long-running agents. [https://www.anthropic.com/engineering/](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
[effective-harnesses-for-long-running-agents, 2025.](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) Anthropic Engineering Blog.


[103] Matei Zaharia, Omar Khattab, Lingjiao Chen, Jared Quincy Davis, Heather Miller, Chris Potts, James
Zou, Michael Carbin, Jonathan Frankle, Naveen Rao, and Ali Ghodsi. The shift from models to
compound ai systems. [https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/, 2024.](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)


[104] Daoguang Zan, Zhirong Huang, Wei Liu, Hanwu Chen, Shulin Xin, Linhao Zhang, Qi Liu, Aoyan Li,
Lu Chen, Xiaojian Zhong, et al. Multi-swe-bench: A multilingual benchmark for issue resolving. _arXiv_
_preprint arXiv:2504.02605_, 2025.


58


[105] Genghan Zhang, Weixin Liang, Olivia Hsu, and Kunle Olukotun. Adaptive self-improvement llm
agentic system for ml library development. _arXiv preprint arXiv:2502.02534_, 2025.


[106] Lei Zhang, Weizheng Chen, Yuting Liu, et al. Experepair: Dual-memory architecture for autonomous
program repair. _arXiv preprint_, 2024.


[107] Qizheng Zhang, Changran Hu, Shubhangi Upasani, Boyuan Ma, Fenglu Hong, Vamsidhar Kamanuru,
Jay Rainton, Chen Wu, Mengmeng Ji, Hanchen Li, et al. Agentic context engineering: Evolving contexts
for self-improving language models. _The Fourteenth International Conference on Learning Representations_
_(ICLR)_, 2026.


[108] Yuntong Zhang, Haifeng Ruan, Zhiyu Fan, and Abhik Roychoudhury. Autocoderover: Autonomous
program improvement. In _Proceedings of the 33rd ACM SIGSOFT International Symposium on Software_
_Testing and Analysis_, pages 1592–1604. ACM, 2024.


[109] Yuting Zhang, Zhiyuan Fan, Wei Liu, et al. Otter: Generating failing tests from issue descriptions.
_arXiv preprint_, 2024.


[110] Lianmin Zheng, Wei-Lin Chiang, Ying Sheng, Siyuan Zhuang, Zhanghao Wu, Yonghao Zhuang, Zi Lin,
Zhuohan Li, Dacheng Li, Eric Xing, et al. Judging LLM-as-a-judge with MT-bench and chatbot arena.
In _Thirty-seventh Conference on Neural Information Processing Systems Datasets and Benchmarks Track_, 2023.


[111] Wanjun Zhong, Lianghong Guo, Qiqi Gao, He Ye, and Yanlin Wang. Memorybank: Enhancing large
language models with long-term memory. _AAAI Conference on Artificial Intelligence_, 2024.


[112] Jieyi Zhou, Shreyas Agarwal, Kiante Brantley, et al. Tree search for language model agents. _arXiv_
_preprint arXiv:2407.01476_, 2024.


[113] Shuyan Zhou, Frank F. Xu, Hao Zhu, Xuhui Zhou, Robert Lo, Abishek Sridhar, Xianyi Cheng, Tianyue
Ou, Yonatan Bisk, Daniel Fried, Uri Alon, and Graham Neubig. Webarena: A realistic web environment
for building autonomous agents. In _The Twelfth International Conference on Learning Representations_,
2024.


[114] Yuxuan Zhu, Tengjun Jin, Yada Pruksachatkun, Andy Zhang, Shu Liu, Sasha Cui, Sayash Kapoor, et al.
Establishing best practices for building rigorous agentic benchmarks. _arXiv preprint arXiv:2507.02825_,
2025.


[115] Yuxuan Zhu, Tengjun Jin, Yada Pruksachatkun, Andy Zhang, Shu Liu, Sasha Cui, Sayash Kapoor, et al.
Establishing Best Practices for Building Rigorous Agentic Benchmarks, 2025.


59


**A** **Complete Tool Catalog**


Table 1 provides the complete catalog of all built-in tools available in OPENDEV, organized by handler
category. Each tool is described in the main text (Section 2.4); this appendix serves as a quick reference.
In addition to these built-in tools, any number of external tools can be dynamically discovered via MCP
(Section 2.4.7).


**B** **LSP Language Server Matrix**


Table 2 lists all programming languages supported through LSP integration with their corresponding
language servers. The system supports a wide range of standard languages plus several experimental
servers, all defined in ls_config.py.


**C** **Modular System Prompt Composition**


This appendix documents the complete prompt section registry used by OPENDEV’s PromptComposer (Section 2.3.1). The main text describes the filter–sort–load–join pipeline and its rationale; this appendix provides
the full inventory of sections, their conditions, and their roles. The verbatim content of every template is
reproduced in Section K.


**C.1** **Main Agent Prompt Sections**


The default action-mode agent registers its sections via create_default_composer(). Table 3 lists each
section with its activation condition, cacheability for Anthropic prompt caching, and a brief summary.


**C.2** **Thinking Mode Prompt Sections**


The thinking-mode agent registers only 4 sections via create_thinking_composer(), deliberately omitting
tool-use and code-quality guidance to avoid biasing tool-free reasoning toward premature action.


**C.3** **Specialized Templates**


Five standalone templates serve specific roles outside the normal section registry. These are loaded directly
by their respective subsystems rather than through PromptComposer auto-registration.


**C.4** **Composition Mechanics**


The composition pipeline operates as follows:


_•_ **Filter** _→_ **Sort** _→_ **Load** _→_ **Join:** Each registered section’s condition predicate is evaluated against the
runtime context dictionary. Sections returning False are excluded before any file I/O. Surviving sections
are sorted by ascending priority, loaded from their markdown files (with frontmatter stripped), and
concatenated with double-newline separators.

_•_ **Two-part** **composition** **for** **prompt** **caching:** The compose_two_part() method partitions sections into
_stable_ (cacheable) and _dynamic_ parts. For Anthropic’s API, the stable part receives a cache_control header,
yielding approximately 88% cost reduction on the cached portion across multi-turn sessions. Typically 19
of 21 sections are stable; only scratchpad and reminders-note are dynamic.

_•_ **Mode-specific composers:** A factory function create_composer(templates_dir, mode) returns the appropriate composer: "system/main" yields the 21-section action composer; "system/thinking" yields
the 4-section thinking composer. Planning mode uses a standalone template optimized for read-only
exploration.


60


_•_ **Variable** **substitution:** Templates use ${VAR} placeholders resolved at render time by PromptRenderer.
A centralized PromptVariables registry maps symbolic names to concrete tool identifiers (e.g.,
${EDIT_TOOL.name} _→_ edit_file), decoupling template prose from tool naming.

_•_ **Two-tier** **fallback:** If an individual section file is missing, the composer skips it and proceeds with a
reduced prompt. If modular composition fails wholesale (e.g., templates directory absent), the builder
falls back to a monolithic core template, guaranteeing agent startup under partial-deployment conditions.


**D** **Edit Tool Fuzzy Matching Chain**


The edit_file tool (Section 2.4.2) implements a chain-of-responsibility pattern with nine replacer classes,
each addressing a specific mismatch category between the LLM’s specified old_content and the actual file
content. The chain short-circuits on first match, so exact matches incur zero overhead from the fuzzy passes.
Each replacer returns the _actual substring found in the original file_ (not the search query), preserving the file’s
original formatting.


1. **Simple:** Exact string match (baseline).
2. **Line-trimmed:** Strip trailing whitespace per line before comparing.
3. **Block-anchor:** Use first and last lines as anchors; score middle region via SequenceMatcher with a 0.3
similarity threshold for multi-candidate matches.
4. **Whitespace-normalized:** Collapse all whitespace runs to single spaces.
5. **Indentation-flexible:** Ignore all leading whitespace, skip blank lines.
6. **Escape-normalized:** Unescape common sequences (\n, \t, \\).
7. **Trimmed-boundary:** Try trimmed content; expand to full line boundaries if partial match found.
8. **Context-aware:** Use first and last non-empty lines as anchors, score all candidate regions with a 0.5
similarity threshold.
9. **Multi-occurrence:** Trimmed line-by-line exact match as last resort across all occurrences.


**E** **Shell Execution Pipeline**


The shell execution pipeline (Section 2.4.3) processes every run_command invocation through six stages,
illustrated in Figure 17.


**E.1** **Six-Stage Pipeline Details**


1. **Safety gates.** Three checks run before any command executes: (a) permission configuration determines
whether the command class requires approval; (b) allowed-command matching checks against userconfigured safe patterns; (c) dangerous pattern blocking rejects catastrophic operations (rm -rf /, sudo,
fork bombs, curl|bash pipe chains, dd to device files) with no user override.
2. **Command preparation.** Interactive prompts are auto-confirmed for known package managers (npm init,
npx) by prepending yes |. Python commands receive PYTHONUNBUFFERED=1 to prevent output buffering
that would defeat real-time streaming.
3. **Server detection.** A regex match against 16 server patterns (Table 6) auto-promotes matching commands
to background mode regardless of the caller’s setting.
4. **Execution** **fork.** Background commands spawn in a pseudo-terminal (pty.openpty() with Popen attached to the slave file descriptor) for terminal-emulated output that correctly handles ANSI codes,
progress bars, and interactive programs. Foreground commands use subprocess.Popen with pipes and
start_new_session=True for process-group isolation, ensuring that killing the command kills all child
processes.
5. **Output management.** Output is capped at 30,000 characters using head-tail truncation (first 10,000 + last
10,000 on overflow). Real-time streaming delivers output to the UI via callback. select.select() polls at
100ms intervals, balancing responsiveness against CPU overhead.


61


6. **Timeout and interrupt.** Idle timeout kills commands after 60 seconds of no output. Absolute timeout caps
execution at 600 seconds. The InterruptToken (shared per user query) is checked each polling cycle; when
triggered, the handler kills the entire process group via os.killpg().


**E.2** **Server Detection Patterns**


Table 6 lists the 16 regex patterns used to auto-promote commands to background mode. All patterns are
matched with re.IGNORECASE.


**F** **System Reminder Catalog**


This appendix provides the complete catalog of the 24 named system reminders described in Section 2.3.4,
organized by category, along with the 9-step injection timing within each ReAct iteration.


**F.1** **Reminder Categories**


The 24 reminders are organized into six functional categories:


_•_ **Phase control** (4 reminders): Manage thinking/action phase transitions. Inject thinking traces into the
action phase context; control whether the agent should reason deeply or act directly.

_•_ **Task lifecycle** (5 reminders): Steer phase transitions in multi-step workflows. After a subagent returns,
nudge the main agent to synthesize results. After plan approval, restate the plan and todos with explicit
workflow instructions. On session resume, reference the existing plan file.

_•_ **Todo enforcement** (2 reminders): Gate premature completion. When the agent calls task_complete with
incomplete todos, reject the call and list remaining items. When all todos are done, signal finalization.
Capped at 2 nudges per run.

_•_ **Error recovery** (8 reminders): One generic nudge plus six type-specific nudges selected by error classification (permission, file-not-found, syntax, rate-limit, timeout, edit-mismatch) and one Docker-specific
nudge. Capped at 3 attempts per error sequence.

_•_ **Behavioral** (5 reminders): Correct observable anti-patterns. After 5+ consecutive read-only tool calls,
break the exploration spiral. After the user denies a tool call, prevent re-attempt. On empty completion,
request a brief outcome summary. At the iteration safety limit, force summarization.

_•_ **JSON retry** (2 reminders): Specialized parse-retry prompts for the memory system’s Reflector and Curator
components when JSON output fails to parse.


**F.2** **Injection Timing**


Reminders are injected by the ReAct executor in a strict 9-step ordering within each iteration:


1. Auto-compaction check (context pressure evaluation).
2. Interrupt check (user cancellation).
3. Thinking phase with optional trace injection into action context.
4. Subagent-completion signal (if a subagent returned results).
5. Drain UI-thread messages (approval results, user input).
6. Interrupt check (second gate before LLM call).
7. Action phase LLM call.
8. Response dispatch: reminders diverge based on response type:


_•_ _No tool calls path:_ check for failed-tool nudges, incomplete-todo nudges, and empty-completion nudges,
in that order.

_•_ _Has_ _tool_ _calls_ _path:_ after tool execution, check for plan-approved signals, all-todos-complete signals,
tool-denied nudges, and consecutive-reads nudges.


9. Session persistence (auto-save).


62


**Safety guards.** Two mechanisms prevent reminder degeneration into noise: (1) _one-shot flags_ ensure certain
reminders fire at most once per agent run (plan_approved_signal_injected, all_todos_complete_nudged,
completion_nudge_sent); and (2) _attempt_ _budgets_ cap repeatable reminders (MAX_TODO_NUDGES = 2,
MAX_NUDGE_ATTEMPTS = 3).


**G** **Subagent Capability Matrix**


Table 7 documents the complete subagent registry. Each subagent receives a filtered tool set restricted to
its domain, preventing scope creep and limiting blast radius. All subagents run with unlimited iteration
budgets by default; the ask-user subagent is a special case that bypasses the LLM execution path entirely.


**H** **Configuration Schema**


Table 8 describes the key configuration fields in OPENDEV’s AppConfig model.


**I** **Implementation Constants**


This section documents key implementation constants with their rationale.


**J** **CLI Command Reference**


Common command-line options and interactive commands:


**Launch options:**


_•_ opendev - Start interactive terminal UI

_•_ opendev -p "prompt" - Non-interactive single prompt execution

_•_ opendev –continue - Resume most recent session

_•_ opendev –working-dir /path - Set project context

_•_ opendev run ui - Start web UI


**Interactive commands (slash commands):**


_•_ /mode - Toggle between normal and plan mode

_•_ /undo - Undo recent file operations

_•_ /clear - Clear conversation history

_•_ /sessions - List available sessions

_•_ /thinking - Configure thinking level

_•_ /exit - Exit the session


**MCP server management:**


_•_ opendev mcp list - List configured MCP servers

_•_ opendev mcp add <name> <command> - Add MCP server

_•_ opendev mcp enable <name> - Enable MCP server

_•_ opendev mcp disable <name> - Disable MCP server


**Keyboard shortcuts (TUI):**


_•_ Shift+Tab - Toggle normal/plan mode

_•_ Ctrl+C - Interrupt agent execution


63


_•_ Ctrl+L - Clear screen

_•_ / + text - Trigger command autocomplete


**K** **Full System Prompt Templates**


This appendix reproduces the verbatim content of every system prompt template used by OPENDEV. Each
template is a Markdown file stored under templates/system/ and loaded by the PromptComposer after
stripping HTML frontmatter (Section C). The content shown here is exactly what the LLM receives as part
of its system prompt. Templates are grouped by their role: core identity (Section K.1), the 21 main agent
sections sorted by priority band (Section K.2), the 4 thinking mode sections (Section K.3), and 3 specialized
standalone templates (Section K.4).


**K.1** **Core Identity Template**


The core identity template establishes the agent’s persona and is loaded as a wrapper before the modular
sections are appended.


**K.2** **Main Agent Prompt Sections**


The following 21 sections are registered by create_default_composer() and assembled via the filter–sort–
load–join pipeline described in Section C.4. They are presented here in priority order (lower priority number
= earlier in the composed prompt).


_**K.2.1**_ _**Core Identity and Policies (Priority 10–30)**_









64


**IMPORTANT**: Never generate or guess URLs unless you are confident they
help with programming tasks. You may use URLs provided by the user or
found in local files.





_**K.2.2**_ _**Interaction and Tool Guidance (Priority 40–50)**_









65


_**K.2.3**_ _**Code Quality and Safety (Priority 55–65)**_







66


67


68


_**K.2.4**_ _**Conditional Sections (Priority 70–80)**_


These sections are included only when their runtime condition evaluates to True (e.g., the project is a Git
repository, todo tracking is enabled, or a specific model provider is in use).







69


commits
3. Analyze ALL commits (not just the latest) and draft a concise PR title
(<70 chars)
4. Push to remote with ``` -u ``` flag if needed
5. Create PR using:
```
   ```
```

gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>


## Test plan

   - [ ] Testing step 1

   - [ ] Testing step 2
EOF
)"
```
   ```
```

6. Return the PR URL to the user









70


_**K.2.5**_ _**Context Awareness (Priority 85–95)**_













**K.3** **Thinking Mode Templates**


The thinking mode uses a separate prompt composition with a standalone wrapper template and 4 focused
sections. These are deliberately minimal to avoid biasing tool-free reasoning toward premature action.


71


72


**K.4** **Specialized Standalone Templates**


These templates are loaded directly by their respective subsystems rather than through the PromptComposer
auto-registration pipeline.







73


3. Determine what is still relevant vs. what can be safely omitted
4. Identify the immediate next step


Then produce the summary outside the tags.


# Output Template


You MUST produce your summary using EXACTLY the following template.
Include every section header. If a section has no content, write "None."
under it.

```
```
```

## Objective
<What the user is trying to accomplish, stated clearly in 1-3 sentences.>


## Key Decisions & Rationale

- Decision: <what was decided>
Rationale: <why>


## Technical Context


### Files Modified or Referenced

- <file_path> -- <what was done or discussed about this file>


### Code Artifacts

- Functions/classes created, modified, or referenced: <name> in
<file_path:line>

- Key code patterns or conventions observed


### Commands Executed & Results

- ``` <command> ``` -> <outcome (success/failure + key output)>


### Dependencies & Environment

- Language/framework versions, packages installed, config changes


## User Messages
<Preserve ALL non-tool-result user messages verbatim or near-verbatim.>


## Progress Tracker

- [x] <completed step>

- [ ] <remaining step>


## Open Issues & Errors

- <error message or issue> -> <resolution status>

 - If resolved: <how it was resolved>

 - If unresolved: <last attempted fix, what to try next>


## Working State
<Describe the exact state of the workspace when the conversation was
paused.>


## Next Step
<The IMMEDIATE next action to take.>
```
```

```

# Rules


## What to PRESERVE (high priority)

- The user's original objective and any refinements to it

- ALL file paths, function names, class names, variable names, and line
numbers

- Exact error messages and stack traces that are still relevant

- Decisions and their rationale -- never drop the "why"

- Tool call results that produced actionable information

- Configuration values, environment variables, API keys (redacted)

- Any constraints or requirements the user specified

- The current progress state -- what is done vs. what remains

- All user messages that contain instructions or requirements


## What to OMIT (low priority)

- Greetings, acknowledgments, and filler

- Intermediate reasoning that led to a dead end

- Redundant tool calls (keep only the final state)

- Verbose tool output when a short summary captures the essential info

- Repetitive back-and-forth that can be collapsed


## Formatting Rules

- Use Markdown formatting consistently

- Use backticks for all code references

- Keep the total summary under 800 words

- Use present tense for current state, past tense for completed actions


74


75


# Run the application
<actual run command(s)>


# Code quality
<actual lint/format/typecheck commands>


# Tests
<actual test commands: all tests, single file, single test, with coverage>
```
```

```

## Architecture Overview

```
```
```

<ASCII diagram showing the main layers/components>
Entry Point (file.ext)
|
Layer 1 (directory/)

 - component: description
|
Layer 2 (directory/)

 - component: description
```
```

```

## Key Patterns


**Pattern Name** ( ``` relevant_file.ext ``` ): Brief explanation.


## Code Style


- Line length, formatter, linter used

- Naming conventions

- Import ordering

- Docstring style
```
```

```

CRITICAL RULES:

- Use REAL commands discovered from config files -- never guess

- If a section has no applicable content, omit it entirely

- Architecture diagram should reflect the ACTUAL directory structure

- Keep descriptions concise -- max 500 words total

- Format all file paths, commands, and code references with backticks


76


Table 1: Complete catalog of built-in tools in OPENDEV (organized by handler category). Tools marked with

- are read-only and available in plan mode.


**Category** **Tool** **Description**



File Ops


Process


Web


Symbols (LSP)



read_file [†] Read file contents with linenumbered output and optional
offset/limit
write_file Create new files (rejects overwrites;
directs to edit_file)
edit_file Apply targeted edits via 9-pass
fuzzy matching chain
list_files [†] Directory listing and glob-based
file search
search [†] Dual-mode search: regex (ripgrep)
or structural (ast-grep)


run_command Execute shell commands with autobackground for servers
list_processes [†] List tracked background tasks with
status and runtime
get_process_output [†] Retrieve last 100 lines from a background task
kill_process Terminate a running task
(SIGTERM _→_ SIGKILL escalation)

fetch_url [†] Browser-engine web fetching with
deep crawl support
web_search [†] Privacy-respecting web search via
DuckDuckGo
capture_web_screenshot [†] Full-page screenshot via Playwright headless browser
open_browser [†] Open URL or local file in system
default browser

find_symbol [†] Find symbol definitions with wildcard matching
find_referencing_symbols [†] Find all references to a symbol
across files
rename_symbol Rename a symbol across all references
replace_symbol_body Replace function/method body
preserving signature
insert_before_symbol Insert code before a symbol definition
insert_after_symbol Insert code after a symbol definition



capture_screenshot [†] Capture desktop screenshot with
Visual
optional region
analyze_image [†] Analyze images via vision language model

PDF read_pdf [†] Extract text and metadata from
PDF files


Notebooks notebook_edit Create, modify, or delete Jupyter
notebook cells



Task Mgmt



write_todos Create or replace the task list
update_todo Update a task by ID (enforces single “doing” constraint)
complete_todo Mark a task as done with optional
completion log
list_todos [†] List all tasks sorted by status priority



User Input ask_user [†] Present structured multi-choice
questions to the user

Discovery search_tools [†] Search MCP tools by keyword with
scored ranking

77

Batch batch_tool Execute multiple tools in parallel
or serial mode


spawn_subagent Launch isolated subagent with filSubagents
tered tool registry


Table 2: Supported LSP language servers in OPENDEV. Servers marked with † are experimental and must be
explicitly specified. Alternative servers for the same language (e.g., Jedi for Python, Solargraph for Ruby)
are omitted.


**Language** **Server** **Language** **Server**


Python Pyright Perl Perl::LanguageServer
TypeScript/JS tsserver Clojure clojure-lsp
Rust rust-analyzer Elm elm-language-server
Go gopls Terraform terraform-ls
Java Eclipse JDT LS Bash bash-language-server
C/C++ clangd Nix nixd
C# csharp-ls Erlang erlang_ls
Ruby Ruby LSP AL AL Language Extension
PHP Intelephense Rego Regal
Swift SourceKit-LSP Fortran fortls
Kotlin kotlin-language-server OCaml ocamllsp
Lua lua-language-server Markdown [†] Marksman
Elixir ElixirLS YAML [†] yaml-language-server
Haskell haskell-language-server Dart dart analyze
Scala Metals Zig zls
Julia LanguageServer.jl R languageserver


78


Table 3: Complete registry of main agent prompt sections (21 sections). Conditions: _always_ = unconditional;
others evaluate a runtime context predicate. Cache: whether the section is included in the stable (cacheable)
partition for Anthropic prompt caching.


**Section** **Condition** **Cache** **Summary**


mode-awareness always ✓ Guides planner subagent usage for
non-trivial tasks
security-policy always ✓ Authorized security testing boundaries
tone-and-style always ✓ Communication standards: concise,
direct, no emojis
no-time-estimates always ✓ Never provide duration estimates
interaction-pattern always ✓ ReAct loop: Think _→_ Act _→_ Observe _→_ Complete
available-tools always ✓ Tool category overview and descriptions
tool-selection always ✓ When to use direct tools vs. subagents
code-quality always ✓ Follow conventions, minimal
changes, no scope creep
action-safety always ✓ Risk assessment for destructive/irreversible actions
read-before-edit always ✓ Always read files before editing
error-recovery always ✓ Error pattern _→_ resolution strategy
mapping
subagent-guide has_subagents ✓ Subagent reference: 8 types with
when/how guidance
git-workflow in_git_repo ✓ Git safety protocol, commit/PR
workflows
task-tracking todo_enabled ✓ Todo lifecycle: create _→_ in_progress
_→_ complete
provider-openai openai ✓ Function calling, reasoning models,
vision format
provider-anthropic anthropic ✓ Tool_use blocks, extended thinking,
cache control
provider-fireworks fireworks ✓ Smaller contexts, fast inference, no
thinking
output-awareness always ✓ Tool output truncation limits and
pagination
scratchpad session_id set ✗ Session-specific scratch directory
path
code-references always ✓ file_path:line_number format for
navigation
reminders-note always ✗ Explains <system-reminder> tags


Table 4: Thinking mode prompt sections (4 sections). All are unconditional and cacheable.


**Section** **Summary**


thinking-available-tools Tool awareness without invocation pressure
thinking-subagent-guide Delegation reasoning: when and which subagent
thinking-code-references Code reference format for navigation
thinking-output-rules No actions, only reasoning; concise trace
( _≤_ 100 words)


79


Table 5: Specialized prompt templates (not auto-registered).


**Template** **Role** **Key Output**


compaction.md Conversation compactor Structured summary ( _≤_ 800 words) with
artifact index
critique.md Reasoning critic Actionable feedback on thinking traces
( _≤_ 100 words)
init.md Session initializer OPENDEV.md generation via CodeExplorer
main.md Core identity wrapper Senior engineer persona with full tool
access
thinking.md Thinking wrapper Concise internal reasoning trace ( _≤_ 100
words)


Table 6: Server detection patterns for automatic background promotion.


**#** **Regex Pattern** **Framework**


1 flask\s+run Flask
2 python.*app\.py Generic Python app
3 python.*manage\.py\s+runserver Django (manage.py)
4 django.*runserver Django (direct)
5 uvicorn Uvicorn (ASGI)
6 gunicorn Gunicorn (WSGI)
7 python.*-m\s+http\.server Python http.server
8 npm\s+(run\s+)?(start|dev|serve) npm
9 yarn\s+(run\s+)?(start|dev|serve) Yarn
10 node.*server Node.js
11 nodemon Nodemon
12 next\s+(dev|start) Next.js
13 rails\s+server Ruby on Rails
14 php.*artisan\s+serve Laravel
15 hugo\s+server Hugo
16 jekyll\s+serve Jekyll


Table 7: Subagent types with tool access and use cases. Tool counts reflect the filtered registry; the main
agent has access to all 35 built-in tools.


**Subagent** **Tools Available** **Use Case**



Code-Explorer read_file, search,
list_files, find_symbol,
find_referencing_symbols


Planner All read-only + write_file,
edit_file, spawn_subagent,
ask_user, task_complete


PR-Reviewer read_file, search,
list_files, find_symbol,
find_referencing_symbols,
run_command


Security-Reviewer read_file, search,
list_files, find_symbol,
find_referencing_symbols,
run_command


Web-Clone capture_web_screenshot, analyze_image, write_file, read_file,
run_command, list_files


Web-Generator write_file, edit_file,
run_command, list_files,
read_file



Deep codebase exploration, architectural analysis, pattern discovery


Implementation planning with
codebase analysis and plan file
writing


Pull request code review, diff
analysis, pre-merge review


Security audits, vulnerability assessment, severity/confidence
scoring


Visual website analysis and UI
replication


Create web applications from
specifications (React/TypeScript/Tailwind)



Project-Init read_file, search, list_files, Generate OPENDEV.md project
run_command, write_file instruction files from codebase
analysis


Ask-User (none; UI only) Present structured multi-choice
surveys; bypasses LLM execution


80


Table 8: Key configuration fields in OPENDEV.


**Field** **Type** **Description**


model str LLM model identifier
provider str API provider (openai, azure, etc.)
max_context_tokens int Max context window size
temperature float LLM sampling temperature
max_tokens int Max response tokens
thinking_model str Model for thinking phase
thinking_provider str Provider for thinking model
auto_approve bool Skip approval dialogs
web_search_provider str Web search backend
mcp_servers dict MCP server configurations
blocked_commands list Additional blocked shell commands


Table 9: Implementation constants in OPENDEV with justification.


**Constant** **Value** **Rationale**


Compaction stages 70/80/90/99% Four graduated thresholds: warn, mask,
aggressive mask, full compaction
Max undo history 50 ops Bounded growth prevents OOM in long
sessions
Max nudge attempts 3 Balance recovery opportunity vs. forcing progress
Doom-loop threshold 3 repeats Same (tool, args) fingerprint 3 _×_ in sliding window triggers warning
Doom-loop window 20 calls Sliding window of recent tool call fingerprints
Thinking levels 4 (OFF–HIGH) OFF, LOW, MEDIUM, HIGH (includes
self-critique)
Edit fuzzy passes 9 Chain-of-responsibility (Section D)
Tool output offload 8,000 chars Written to scratch files; 500-char preview
retained
Observation masking 6/3 recent Full-fidelity outputs at 80%/90% compaction
Subagent iteration limit 15 Bounds exploration while allowing thorough investigation
Max concurrent tools 5 Balances parallelism overhead vs. utilization
Session ID length 8 chars Human-readable, 62 [8] unique values
Provider cache TTL 24 hours Balance staleness vs. network calls
Summary regeneration Every 5 msgs Amortizes cost, prevents drift accumulation
Recent message tail 3–10 msgs Adaptive based on conversation length
Max tool result length 300 tokens Prevents context pollution from verbose
output


81


