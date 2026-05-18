# Unit 11.2: Schema Design & Migrations

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** Data architecture is not merely a "dumping ground" for JSON blobs. To treat your persistence layer as a stateless bucket is to condemn your CCP to digital Alzheimer’s. A database is the structural representation of reality; if the structure is porous, the intelligence is unreliable.

Think of it like the Biblical **Tabernacle architecture**—a series of concentric, guarded perimeters. There is the Outer Court (public content), the Holy Place (client-specific interaction history), and the Holy of Holies (private psychological DNA and clinical CBCS transcripts). Row-Level Security (RLS) acts as the high priest, enforcing the "who and how" of every entry. Without these sanctified perimeters, your agentic system cannot distinguish between a public tweet and a private confession. In the CCP, structure precedes consciousness. If the memory layer collapses into a single permission-less pool, the system’s integrity is permanently compromised.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

In the 2026 CCP stack, we deploy **Supabase Migrations** to manage the evolution of our relational and vector memory. A migration is a version-controlled SQL script that transforms the database from one state to another. Locally, the Supabase CLI uses a "Shadow Database"—a temporary Postgres instance in Docker—to validate that your SQL scripts are syntax-accurate and conflict-free before they ever touch production.

The core of our memory-augmented generation (RAG) is the **`pgvector`** extension. We don't store text; we store high-dimensional embeddings (vectors) that represent the semantic essence of a thought. To query this, we use the Cosine Distance operator (`<=>`) to find the nearest neighbors in 1536-dimensional space. However, raw search is insufficient for sovereign coaching. We enforce **Row-Level Security (RLS)**, a Postgres native firewall that intercepts every query at the kernel level. 

A production CCP schema must be **idempotent**. Since SQL commands like `CREATE POLICY` do not support `IF NOT EXISTS`, we wrap our DDL in `DO` blocks. This ensures that if a migration is re-run (during a disaster recovery or CI/CD test), the system doesn't error out trying to recreate an existing policy. For the CCP, this isn't just about clean code—it's about "Physically Isolated Tenants" (FR49). Even within a coach's silo, RLS ensures that Assistant Agent A cannot read Client B's vector history unless explicitly authorized.

## 📂 OUR CODE (142 words)

We are building the foundational memory registry for the CCP. This schema is mandated by `FR46_Universal_Asset_ID_Tech_Spec.md` and `FR49_Single_Tenant_Deployment_Tech_Spec.md`.

`⚠️ BUILD REQUIRED — supabase/migrations/00001_initial_schema.sql`

This migration must construct the following atomic infrastructure:
- **`receipt_chain`**: The hash-linked ledger for forensic auditability (FR48).
- **`fingerprint_archive`**: Skill-based performance tracking for cost/quality analysis.
- **`id_sequences`**: The global atomic counter required for human-readable Universal IDs.

```sql
# 00001_initial_schema.sql
# WHY: The 'users' table must anchor to the PID (Person ID) standard 
# defined in FR46 to ensure cross-agent traceability.
# WHY: RLS must be enabled on 'receipt_chain' by default to prevent 
# unauthenticated write-spoofing in the audit log.
```

## 🤖 AGENT PROMPT (128 words)

> **Prompt for Claude Code/Pi:**
> Act as a Principal Database Engineer. I need to create the initial Supabase migration for the CCP Persistence Layer.
> 1. Create a migration file that enables `uuid-ossp` and `vector` extensions.
> 2. Build the `users` table with `id (uuid)`, `person_id (text, unique)`, and `metadata (jsonb)`.
> 3. Build the `receipt_chain` table with `asset_id (text)`, `agent_id (text)`, `hash (text)`, and `created_at`.
> 4. Build the `id_sequences` table as defined in `FR46_Universal_Asset_ID_Tech_Spec.md` to track `client_count` and `daily_asset_count`.
> 5. Implement Row Level Security (RLS) on all tables. Wrap all policy creations in idempotent `DO $$ BEGIN ... END $$` blocks.
> 6. Output the raw SQL suitable for a file in `supabase/migrations/`.

## ⌨️ TERMINAL (68 words)

```bash
# Initialize the local Supabase environment
supabase init

# Start the local Docker-based database stack
supabase start

# Create the first version-controlled migration file
supabase migration new initial_schema

# Apply migrations and reset the local database to the target state
supabase db reset

# Verify the schema status
supabase migration list
# Expected: 00001_initial_schema | Applied
```

## ✅ IMPLEMENTATION STEPS (156 words)

1. **Initialize Supabase**: Run `supabase init` in your project root. This creates the `supabase/` directory and configuration files. Ensure Docker is running.
2. **Launch Local Stack**: Run `supabase start`. This pulls the 2026 Supabase images and spins up Postgres with `pgvector` pre-installed.
3. **Generate Migration**: Run `supabase migration new initial_schema`. This creates a timestamped SQL file in `supabase/migrations/`.
4. **Hydrate Schema**: Paste the SQL generated from the **Agent Prompt in Section 4** into this new file. Review it for the `id_sequences` logic mandated by `FR46`.
5. **Apply & Verify**: Run `supabase db reset`. This wipes the local DB and reapplies all migrations. 
6. **Access Studio**: Open `http://localhost:54323`. Navigate to the "Database" tab and verify the `users`, `receipt_chain`, and `id_sequences` tables exist with RLS enabled (indicated by the lock icon).

## ✅ VERIFY (42 words)

Run `supabase migration list` in your terminal. You must see the `00001_initial_schema` (or your timestamped equivalent) marked as `Applied`. Additionally, run `SELECT * FROM pg_extension WHERE extname = 'vector';` in the Supabase Studio SQL Editor to confirm vector capabilities.

## 🔗 BRIDGE (36 words)

Unit 11.3: Neo4j Production — Aura & Cypher builds on this by establishing the **Causal Memory Layer**, mapping the relational records we just created into a high-traversal graph for the CCP's Context Premise engine.

<!-- FACT-CHECK: "Supabase CLI 2026 migration workflow" → Verified local development loop (init, start, migration new, db reset) as the production standard. -->
<!-- FACT-CHECK: "pgvector idempotent policy creation" → Confirmed DO blocks are required as CREATE POLICY lacks IF NOT EXISTS as of late 2025/2026. -->
<!-- FACT-CHECK: "Supabase local studio port 2026" → Standard local studio port remains 54323. -->
