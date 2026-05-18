# Unit 9.2: Workspace Provisioning — Coach Isolation

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** The "SaaS Landlord" model where users occupy folders in your shared database. In the legacy paradigm, we built multi-tenant systems by adding a `tenant_id` column to every table, effectively turning our users into roommates in a single, crowded house. This architectural cheapness destroys the **Cognitive Ownership Effect** (Pierce et al., 2003), where human psychological attachment to a digital space scales with its perceived sovereignty.

Think of the human brain's memory architecture. The hippocampus doesn't dump all sensory data into a single "universal bin." Instead, it acts as a high-fidelity indexing system that orchestrates individual memory traces across distinct cortical columns. During REM sleep, these traces are isolated and consolidated into the neocortex, ensuring that your memory of "Yesterday's Breakfast" doesn't interfere with "First Grade Graduation." In the CCP, every coach is a sovereign entity. We enforce **Workspace Isolation** via separate AFFiNE instances to ensure that the coach's identity is the central axis of their digital sanctuary.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The AFFiNE dashboard is provisioned using a GraphQL-native architecture that decouples the workspace structure from the data it contains. When a coach completes the Genesis Pipeline, the `AFFiNEWorkspaceProvisioner` executes a transactional sequence that translates abstract brand soul into a concrete digital environment. 

At the systems level, we interact with the AFFiNE self-hosted instance via a single GraphQL endpoint. We primarily utilize the `CreateWorkspace` mutation, which accepts a sanitized JSON template representing the 8-section master structure. However, in 2026 production environments, we must respect the standard 120 requests per minute throttler. Provisioning a workspace is not just about creating an empty shell; it's about the **CSS Theme Injection**. 

Traditional dashboards use theming engines that require server-side reloads. We bypass this by injecting CSS custom properties directly into the workspace's metadata layer. These variables (`--ccp-primary`, `--ccp-accent`) are extracted from the `coach_soul.json` using behavioral mood state affinity mappings. If the extraction fails, the system defaults to the CCP Atomic Blue (#2E86AB) to maintain functional stability. The result is a dynamically branded workspace that feels like a custom-coded SaaS for every individual coach, with zero rendering overhead or database lock contention between the 76 background agents.

## 📂 OUR CODE (100-200 words)

The orchestration logic resides in `src/ccp/services/affine_workspace_provisioner.py`, where the **Pierre** agent (AFFiNE Workspace Orchestrator) ensures structural integrity.

- **`MasterTemplateValidator`** (line 73): Enforces the 8-section structural mandate. It iterates through the `REQUIRED_SECTIONS` list (defined in `ca11_models.py`) and rejects any template missing the "Command Center" or "Client Intelligence Hub."
- **`ThemeTokenExtractor`** (line 158): This is the bridge between the **Voice DNA** and the UI. It extracts hexadecimal color codes from `brand_aesthetics` on lines 222-224, mapping emotional resonance directly to visual identity.
- **`CSSThemeGenerator`** (line 255): Generates the `coach_theme_{ACRONYM}.css` file. Notice on lines 285-302 how it defines the `:root` pseudo-class containing all custom properties.

```python
# affine_workspace_provisioner.py, line 549
# WHY: Uses the mutation results to apply the brand theme 
# ONLY AFTER the workspace UUID is confirmed, preventing 
# orphaned theme files in the static assets directory.
```

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code:**
> Locate `src/ccp/services/affine_workspace_provisioner.py` and the `AFFiNEWorkspaceProvisioner` class. We need to abstract the template loading to support multiple program types (ELITE, CORE, GENESIS). Create a new `TemplateRegistry` class that reads from a `src/ccp/templates/registry.json` file. Update the `_load_template` method in `AFFiNEWorkspaceProvisioner` to accept a `program_type` argument and fetch the corresponding path from the registry. Ensure a fallback to the `DEFAULT_TEMPLATE_PATH` if the program type is not found.

## ⌨️ TERMINAL (50-100 words)

```bash
# Validate the master template structure locally
python -m src.ccp.tools.validate_template --path src/ccp/templates/coach_workspace_master.json
# Expected: VALIDATION SUCCESS — 8/8 sections found.

# Test the theme generation for a specific coach
python -m src.ccp.tools.test_theme_gen --acronym JP --soul tests/mocks/coach_soul_jp.json
# Expected: Generated coach_theme_JP.css in ./tmp/
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Create the `registry.json` file at `src/ccp/templates/` containing the mappings for `ELITE`, `CORE`, and `GENESIS` templates to their respective JSON paths.
2. Paste the **Agent Prompt** from Section 4 into your Claude Code session to generate the `TemplateRegistry` logic and integrate it into the provisioner.
3. Open `affine_workspace_provisioner.py` and verify that `AFFiNEWorkspaceProvisioner.__init__` now initializes the `TemplateRegistry`.
4. Modify the `provision_coach_workspace` method call in your deployment script to accept an optional `program_type` string.
5. Use the **Terminal command** from Section 5 to verify that the provisioner can still load the default master template successfully if no type is specified.

## ✅ VERIFY (30-50 words)

Run `pytest tests/test_provisioner.py -k test_multi_template_loading`. The test should confirm that passing `program_type="ELITE"` returns the elite template JSON, while an invalid or empty type returns the default master template.

## 🔗 BRIDGE (30-50 words)

Now that you've secured the coach's headquarters and enforced isolation, Unit 9.3: Client Workspace — Content Delivery introduces the other half of the ecosystem: provisioning client-facing wards for async content batches and progress tracking.

<!-- FACT-CHECK: "AFFiNE self-hosted GraphQL API 2026" → Mutations CreateWorkspace/UpdateWorkspace available via /graphql. Throttler defaults to 120 req/60s. -->
