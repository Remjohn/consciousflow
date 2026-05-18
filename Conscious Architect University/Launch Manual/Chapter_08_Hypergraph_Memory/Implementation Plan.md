# Implementation Plan - Authoring Unit 5.8: Graph Injection — Working Context

This plan outlines the process for authoring Unit 5.8 of Chapter 05 in the Conscious Architect University Launch Manual.

## User Review Required

> [!IMPORTANT]
> The unit will be authored using the **8-Section Expansion Protocol** and must maintain a word count between **700 and 1140 words**. It will strictly follow the **Launch Manual Governance Protocol** (L1-L11).
> 
> **Fact-Check Mandatory:** As per L10, a web search has been performed to verify 2026 trends in "Neo4j 5 subgraph extraction", "Maximum Effective Context Window (MECW)", and "Fractal context injection".

## Proposed Changes

### Launch Manual Content

#### [NEW] [Unit_5.8_Graph_Injection_Working_Context.md](file:///d:/Work/The%20Conscious%20Coaching%20Factory/Conscious%20Architect%20University/Launch%20Manual/Chapter_05_Hypergraph_Memory/Units/Unit_5.8_Graph_Injection_Working_Context.md)
- **Section 1: 🧠 THE SCIENCE**: Information Discipline vs. Context Suffocation. 1 UNLEARN statement: "Inject the whole graph." Analogy: Synaptic neighborhood activation (the brain doesn't fire every neuron to remember a name; it activates a specific, localized fractal).
- **Section 2: 🧠 TECHNICAL KNOWLEDGE**: MECW (Maximum Effective Context Window) reality. Why 2-hop is the "Goldilocks zone" for reasoning. Subgraph extraction physics: `apoc.path.subgraphAll` vs. `subgraphNodes`. Preventing "context distraction" (poisoning) in 2026-scale models.
- **Section 3: 📂 OUR CODE**: Mapping to `src/ccp/services/neo4j_graph_manager.py` (The Cypher Extraction Engine) and `src/ccp/services/context_premise_extraction_service.py` (The Prompt Formatter). Inline annotations for `get_subgraph_context()` logic.
- **Section 4: 🤖 AGENT PROMPT**: A prompt for Pi/Claude Code to implement the `GraphInjectionService` that takes a topic node and returns a formatted markdown fractal.
- **Section 5: ⌨️ TERMINAL**: Cypher commands for manual 2-hop verification in the Neo4j Browser.
- **Section 6: ✅ IMPLEMENTATION STEPS**: Concrete steps to: 1. Write the Cypher query. 2. Integrate with the injection service. 3. Format the JSON output into a readable Prompt Fragment.
- **Section 7: ✅ VERIFY**: Binary outcome: Does a query for "Alcoholism" return exactly the 1st and 2nd degree neighbors (e.g., [Sober], [Childhood_Trauma], [Father]) in a formatted prompt?
- **Section 8: 🔗 BRIDGE**: Connection to Chapter 11 (Persistence Layer) — how these temporary fractals become permanent consolidated memory states.

## Open Questions

- Should we include **PageRank**-based skeletonization for the 2-hop neighborhood to further reduce noise, or keep it as a pure 2-hop extraction for this level? (Current plan: Pure 2-hop for initial mastery).

## Verification Plan

### Automated Tests
- **Word Count Check**: Ensure 700-1140 words.
- **Forbidden Vocabulary Check**: Pass/Fail against the L6 forbidden list.
- **Structure Check**: All 8 sections in mandatory order.

### Manual Verification
- **Tone Audit**: Verify "Warm Precision" (L4).
- **Fact-Check Audit**: Ensure `<!-- FACT-CHECK: ... -->` HTML comments are present.
- **Code Mapping Audit**: Verify all file paths and line numbers cited are accurate.
- **Graph Verification**: Manual check of the 2-hop Cypher output against a test graph.
