# Unit 2.3: S3 Object Storage — CMF Asset Layer

## 🧠 THE SCIENCE (154 words)

**UNLEARN:** S3 is not "cloud file storage." It is an object store — there are no folders, no directories, no hierarchy. Every object is a flat key in a massive hash map. What looks like `videos/project_001/final.mp4` is actually a single string key — the slashes are cosmetic.

Think of it like the human hippocampal indexing system: the brain doesn't store memories in folders labeled "childhood" and "work." It stores memory traces as distributed patterns across the neocortex, while the hippocampus maintains an index that *looks* hierarchical but is actually a flat associative map. This decoupling of the index from the physical storage allows the brain (and S3) to retrieve any object in near-constant time, regardless of how many "folders" deep it appears to be.

S3 is WHERE every CMF asset lives — every generated image, every rendered video, every audio stem, and every Remotion manifest. Without S3, the CMF pipeline has nowhere to write its output. The pipeline commander writes to S3; the editor reads from S3.

## 🧠 TECHNICAL KNOWLEDGE (238 words)

S3 operates on three primitives: Buckets (top-level containers), Objects (the files), and Keys (the path-like identifiers). Objects can be up to 5TB. Reads are eventually consistent for overwrite PUTs, but in 2026, AWS ensures that concurrent operations across multiple regions maintain ultra-low latency for the 3-phase CMF pipeline.

For the CMF, three critical S3 patterns are mandatory:
1. **Presigned URLs (SigV4):** These are temporary, expiring download links. The editor frontend uses them to load assets without exposing AWS credentials to the browser. The `api-client.ts` calculates these using the AWS Signature Version 4 protocol, ensuring that only authenticated users can view render previews.
2. **Lifecycle Policies:** The CMF generates massive amounts of intermediate data (T2I keyframes, raw audio stems). To prevent cost drift, we implement automated cleanup policies. Raw assets are transitioned to 'Infrequent Access' after 7 days and permanently deleted after 30, while final renders are persistent. 
3. **Cross-Origin Resource Sharing (CORS):** The Next.js editor at `editor.consciouscoaching.app` must be explicitly allowed to fetch binary assets from your sovereign bucket URL. Without a correctly scoped JSON CORS policy, the browser's security model will block every preview request.

Failures in the S3 layer are usually identity-based (S3 403 Forbidden) or networking-based (CORS block). In the CCP, we treat the S3 bucket as our "Eternal Memory" — the source of truth that survives even if every GPU instance is terminated.

## 📂 OUR CODE (142 words)

We have two integration points for S3 that must be wired: the backend pipeline that writes assets and the frontend client that reads them.

- `cmf/apps/cmf-assembler/pipeline_commander.py`: 
  ```python
  # ⚠️ BUILD REQUIRED — S3 upload after render
  # Line 342: Need to inject a 'cmf_s3_storage_service.py' call here.
  # WHY: After the 'RENDERING_PREVIEW' state completes at line 45, 
  # the local file must be pushed to S3 before transitioning to 'READY_FOR_REVIEW'.
  ```
- `cmf/apps/web/app/editor/api-client.ts`: 
  ```ts
  // ⚠️ BUILD REQUIRED — Presigned URL fetch logic
  // Line 222: Function 'uploadAsset' currently uses local multipart form.
  // 🔧 EXTEND: Must be rewritten to fetch a presigned PUT URL from 
  // the FastAPI backend to allow direct-to-S3 uploads, bypassing the web server.
  ```

## 🤖 AGENT PROMPT (118 words)

> **Prompt for Claude Code:**
> "I need to integrate AWS S3 storage into the `pipeline_commander.py`. First, create a new utility file at `cmf/apps/cmf-assembler/storage_service.py` using `boto3` that includes a `upload_to_s3(local_path, bucket, key)` function. Then, modify `pipeline_commander.py` to import this service. Find the state transition for 'RENDERING_PREVIEW' and 'RENDERING_FINAL', and add logic to upload the resulting `.mp4` files to our S3 bucket `cmf-production-assets`. Ensure the `total_generation_cost_usd` logic is updated if we need to track S3 PUT costs (approx $0.005 per 1,000 requests). Reference the environment variable `S3_BUCKET_NAME` for the target. Use the existing logging structure to report upload success."

## ⌨️ TERMINAL (82 words)

```bash
# Create the sovereign CMF assets bucket in your primary region
aws s3 mb s3://cmf-production-assets --region eu-west-1

# Apply the CORS policy for the web editor
# Expected: CORS update successful (JSON response)
aws s3api put-bucket-cors --bucket cmf-production-assets --cors-configuration file://cmf-s3-cors.json

# Apply the 30-day lifecycle cleanup policy for intermediate assets
aws s3api put-bucket-lifecycle-configuration --bucket cmf-production-assets --lifecycle-configuration file://cmf-s3-lifecycle.json

# Verify the bucket is live and accessible via CLI
aws s3 ls s3://cmf-production-assets/
```

## ✅ IMPLEMENTATION STEPS (165 words)

1. Create a file named `cmf-s3-cors.json` with your editor's domain (e.g., `https://editor.consciouscoaching.app`) in the `AllowedOrigins` list.
2. Create `cmf-s3-lifecycle.json` to move assets under the `intermediate/` prefix to `GLACIER` or delete them after 30 days.
3. Execute the terminal commands in Section 5 to provision the infrastructure.
4. Paste the Agent Prompt from Section 4 into your Claude Code terminal to generate the `storage_service.py` utility and patch `pipeline_commander.py`.
5. Open `cmf/apps/web/app/editor/api-client.ts` and verify that the `UPLOAD_URL` logic now targets the backend's presigned URL endpoint instead of the legacy `/upload` route.
6. Record the generated bucket ARN in your `cmf/apps/cmf-assembler/.env` file under `S3_BUCKET_NAME`.
7. Test the full loop by running a render job: the video should appear in the S3 bucket list within 5 seconds of the pipeline reaching the `READY_FOR_REVIEW` state.

## ✅ VERIFY (44 words)

Run `aws s3 ls s3://cmf-production-assets/` and check for the `test_render.mp4` file after a successful preview job. If the file is present and the `api-client.ts` can load it via a presigned URL, the asset layer is sovereign.

## 🔗 BRIDGE (39 words)

Unit 2.4 builds on this by introducing **VPC & Networking** — the infrastructure layer that ensures your GPU instances can securely write to this S3 bucket without exposing your storage layer to the public internet via open ports.

---

<!-- FACT-CHECK: "AWS S3 CORS configuration 2026" → Standard JSON format persists, wildcards strictly discouraged in production for security. -->
<!-- FACT-CHECK: "S3 presigned URLs 2026" → Signature Version 4 (SigV4) remains the mandatory authentication protocol for secure time-limited access. -->
<!-- FACT-CHECK: "S3 Lifecycle 2026" → Automated transitions to Glacier Deep Archive or deletion are configured via `put-bucket-lifecycle-configuration`. -->
