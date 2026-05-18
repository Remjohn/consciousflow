# Chapter 09: The Coach Dashboard (AFFiNE Fork)

**Chapter Goal:** Deploy and extend the AFFiNE-based coach dashboard as the central workspace where coaches access all CCP services, review client data, and trigger CMF pipelines
**Mastery Track:** CCP System Architect
**Launch Track:** AFFiNE dashboard deployed at URL, workspace provisioning live, sync engine operational
**Prerequisites:** Chapter 6 (Agentic Core — the agents that write TO the dashboard), Chapter 8 (Video Editor — embedded in the dashboard)
**Estimated Time:** 8-10 hours

---

## CCP/CMF Reality Anchor

AFFiNE is one of the 3 ALWAYS-ON services (alongside the Video Editor and API). It is the coach's operational headquarters — where they review client progress, trigger content batches, view accountability tracking results, and access AI-generated session recaps. The CCP's 76 agents write INTO AFFiNE workspaces via headless CRDT operations. The coach reads FROM AFFiNE via the browser UI. Without this dashboard, coaches have no interface to the intelligence layer.

---

## Codebase Map

| File | Location | Size | Status |
|------|----------|------|--------|
| `affine_workspace_provisioner.py` | `src/ccp/services/` | 32KB | ✅ EXISTS |
| `affine_client_workspace.py` | `src/ccp/services/` | 21KB | ✅ EXISTS |
| `affine_sync.py` | `src/ccp/services/` | 36KB | ✅ EXISTS |
| `learning_path_builder.py` | `src/ccp/services/` | 29KB | ✅ EXISTS |
| `session_recap_generator.py` | `src/ccp/services/` | 32KB | ✅ EXISTS |
| `accountability_visualizer.py` | `src/ccp/services/` | 14KB | ✅ EXISTS |
| `studio_block_service.py` | `src/ccp/services/` | 25KB | ✅ EXISTS |

**Files referenced: 7** ✅

---

## Science Sources

| Source | Location | Type |
|--------|----------|------|
| `FR-CA11-01_Coach_Workspace_Provisioning_Tech_Spec.md` (12KB) | `docs/architecture/` | Tech spec |
| `FR-CA11-02_AFFiNE_Sync_Service_Tech_Spec.md` (11KB) | `docs/architecture/` | Tech spec |
| `FR-CA11-03_Client_Workspace_Provisioning_Tech_Spec.md` (11KB) | `docs/architecture/` | Tech spec |
| `FR-CA11-05_AI_Session_Recap_Generator_Tech_Spec.md` (14KB) | `docs/architecture/` | Tech spec |
| `FR-CA11-09_Accountability_Visualization_Tech_Spec.md` (9KB) | `docs/architecture/` | Tech spec |
| `FR-CA11-16_CCP_Studio_Block_Tech_Spec.md` (18KB) | `docs/architecture/` | Tech spec |
| `MCDA_AFFiNE_Integration_Analysis.md` (18KB) | `docs/` | Analysis |
| `MCDA_CCP_Studio_Integration.md` (31KB) | `docs/` | Integration spec |
| `prd-update-CA11-quad-platform.md` (49KB) | `docs/prd/` | PRD update |
| All 22 `FR-CA11-*` specs | `docs/architecture/` | Full CA11 spec family |

---

## Unit Map

| Unit | Title | 🧠 Science Topic | UNLEARN | 📂 Code Files | 📄 Science Sources | Build Target | Verify |
|------|-------|-------------------|---------|---------------|-------------------|-------------|--------|
| 9.1 | AFFiNE Architecture — CRDT & BlockSuite | CRDT (Conflict-free Replicated Data Types): how multiple writers (76 agents + 1 coach) can edit the same document without locking or conflicts. BlockSuite as the editor framework. Why fork AFFiNE instead of embed a note app | "Use Notion API." False — Notion is a tenant in someone else's SaaS. AFFiNE is open-source, self-hosted, CRDT-native. Forking gives us full control over the editor, AI integration, and data sovereignty | AFFiNE source (external) | `MCDA_AFFiNE_Integration_Analysis.md`, `prd-update-CA11-quad-platform.md` §Architecture | — | Explain why CRDTs solve the concurrent-write problem for 76 agents |
| 9.2 | Workspace Provisioning — Coach Isolation | How each coach gets an isolated workspace with pre-built page templates (Session Recap, Client Dashboard, Content Calendar). Multi-tenant isolation: Coach A cannot see Coach B's data | "One big shared workspace." False — coaching data is deeply personal. Each coach gets an isolated workspace with strict permission boundaries. Cross-workspace access is prohibited by architecture | `affine_workspace_provisioner.py` (32KB) | `FR-CA11-01_Coach_Workspace_Provisioning_Tech_Spec.md` | 🤖 Extend provisioner for production with template library | Provision a new coach workspace → workspace accessible at unique URL |
| 9.3 | Client Workspace — Content Delivery | Client-facing workspace: session recaps, accountability tracking, learning path visualization. The coach triggers content delivery; clients receive it in their workspace. Async, NOT real-time | "Clients get a chat interface." False — clients get a structured workspace with AI-generated session recaps, visual accountability tracking, and personalized learning paths. This is a PRODUCT, not a chatlog | `affine_client_workspace.py` (21KB), `session_recap_generator.py` (32KB), `accountability_visualizer.py` (14KB) | `FR-CA11-03`, `FR-CA11-05`, `FR-CA11-09` | 🤖 Wire session recap generator to client workspace | Session recap appears in client workspace after batch processing |
| 9.4 | Sync Engine — Headless CRDT Writes | How 76 agents write to AFFiNE workspaces WITHOUT opening a browser. Headless CRDT operations: create blocks, update content, insert images. Yjs document model. Preventing database locking under concurrent agent writes | "Agents need a browser to edit AFFiNE." False — the sync engine performs headless CRDT operations via the Yjs document model. No browser, no UI, no rendering overhead | `affine_sync.py` (36KB), `studio_block_service.py` (25KB) | `FR-CA11-02_AFFiNE_Sync_Service_Tech_Spec.md`, `MCDA_CCP_Studio_Integration.md` (31KB) | 🤖 Harden sync engine for production (retry, conflict resolution) | Agent writes a session recap to AFFiNE → content appears without conflicts |

---

## Quality Gates

- [x] **Unit Count Gate:** 4 units ✅
- [x] **5-File Gate:** 7 codebase + 10 science sources ✅
- [x] **Schedule-Based Gate:** Units 9.3 correctly reflect async batch delivery ✅
