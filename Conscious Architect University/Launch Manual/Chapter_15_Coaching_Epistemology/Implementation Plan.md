# Implementation Plan - Unit 12.1: Docker Compose — Service Orchestration

Authoring Unit 12.1 for Chapter 12: Launch & Hardening. This unit teaches the orchestration of the CCP stack using Docker Compose V4, focusing on multi-service interdependencies, GPU resource allocation, and production-grade health checks.

## User Review Required

> [!IMPORTANT]
> The unit will strictly follow the 8-section expansion protocol from `launch_unit_instructor_skill.md`. 
> It will be technically rigorous (700-1140 words).
> Fact-checking for 2026 Docker/Nvidia specs is mandatory.

## Proposed Changes

### Launch Manual

#### [NEW] [Unit_12.1_Docker_Compose_Service_Orchestration.md](file:///d:/Work/The%20Conscious%20Coaching%20Factory/Conscious%20Architect%20University/Launch%20Manual/Chapter_12_Launch_Hardening/Units/Unit_12.1_Docker_Compose_Service_Orchestration.md)
- **🧠 Section 1: THE SCIENCE**: Systemic orchestration from First Principles. Contrastive UNLEARN: "Run each service manually." Analogy: The human endocrine system.
- **🧠 Section 2: TECHNICAL KNOWLEDGE**: Docker Compose V4 infrastructure, health checks, restart policies, and GPU partitioning for NIM microservices.
- **📂 Section 3: OUR CODE**: Mapping to `cmf/cmf-docker/` and production `docker-compose.yml`.
- **🤖 Section 4: AGENT PROMPT**: [Pi/Claude Code] Prompt for building/configuring the stack.
- **⌨️ Section 5: TERMINAL**: Deployment and status check commands.
- **✅ Section 6: IMPLEMENTATION STEPS**: Action plan for go-live orchestration.
- **✅ Section 7: VERIFY**: Binary pass/fail (health check 200 OK).
- **🔗 Section 8: BRIDGE**: Unit 12.2 (The Batch Clock).

## Open Questions

- Should the `ccp-deploy.md` harness be integrated as a separate artifact or within the unit? (Syllabus says "Build production docker-compose.yml + commands/ccp-deploy.md").
- Any specific 2026 Docker Compose features you'd like highlighted?

## Verification Plan

### Automated Tests
- Word count verification (700-1140 words).
- All 8 sections present and correctly formatted.
- Fact-check comment included at the end.
