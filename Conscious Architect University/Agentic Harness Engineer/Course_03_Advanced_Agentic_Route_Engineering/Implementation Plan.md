# Implementation Plan - Course 03, Module 07: Pheromone Trails and Hierarchical Context

## Goal Description
Authored Course 03 Module 07 on Pheromone Trails and Hierarchical Context based strictly on the syllabus constraints. Ensures alignment with 2026 web research (Prefix caching, PagedAttention, Context Hygiene) and strictly observes the 1600-2500 word limit.

## Proposed Changes

### Agentic Harness Engineer Course

#### [NEW] Module_07_Pheromone_Trails_and_Hierarchical_Context.md
The module will be structured as follows:

1.  **Phase I: The Context Anchor (100-150 words)**
    *   Grounding in the 76-agent CCP and its CMF autonomous video arm.
    *   Explicitly linking the need for memory hierarchy to the token-heavy reality of multi-modal generation.
    *   References: `docs/prd/prd.md`, `CMF_Pipeline_Documentation.md`, `prd-update-visual-control-layer.md`.

2.  **Phase II: The Negative Space (100-200 words)**
    *   Demolish the "Infinite Context" myth. Explain how massive histories dilute reasoning focus.

3.  **Phase III: First Principles & Systems Engineering (300-500 words)**
    *   **The 4-Level Memory Hierarchy:** Voice DNA → Coach Profile → Client Session → Ephemeral Override.
    *   **Context Forking:** Managing state via `fork_context` flags.
    *   **Technical Lexicon:** *Prefix Caching*, *PagedAttention*, *Context Hygiene*.

4.  **Phase IV: The Pedagogical Association (300-500 words)**
    *   **Primary Analogy (Entomology):** Ant Foraging and Pheromone Trails.
    *   **Reinforcement Analogy (Neuroscience):** Synaptic Pruning.

5.  **Phase V: Python Native Construction (400-600 words)**
    *   **Concept Definition:** What a Context Manager (`with` block) is.
    *   **CCP Implementation:** Writing an `AgentContext` manager that handles state inheritance.
    *   Code will use `with agent.spawn(fork=True):` logic and CCP variables.

6.  **Phase VI: Implementation Contract & Bridge (100-200 words)**
    *   **Falsifiable Gate:** Analysis of summary-vector efficiency vs. raw log injection.
    *   **Bridge:** Connecting memory isolation to Module 08's Token Economics.

## Verification Plan

### Automated Tests
- **Word Count Check:** Ensure the output is within the 1600-2500 word range.
- **Protocol Checklist:** Verify all 6 phases and required glossary terms are present.

### Manual Verification
- Walkthrough of the module logic and code structure to ensure pedagogical alignment with the CAU Governance Protocol.
