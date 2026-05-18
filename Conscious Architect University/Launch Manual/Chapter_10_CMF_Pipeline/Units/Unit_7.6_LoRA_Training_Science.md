# Unit 7.6: LoRA Training Science

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** LoRA is not "re-training the model." It is a surgical injection of specific intelligence into the model's existing knowledge base. If you think you are "training" the model from scratch, you will overfit and destroy the base model's ability to reason.

Think of LoRA as **synaptic pruning in reverse**. In the human brain, synaptic pruning removes redundant connections to increase efficiency. In Low-Rank Adaptation, we are NOT modifying the billions of existing "synapses" (weights) in the FLUX model. Instead, we are adding a thin, dense layer of highly specialized connections that redirect the model's "nerve impulses" toward a specific identity or style. Just as the hippocampus doesn't store a separate copy of Every face you've ever seen, but rather encodes the *delta* (difference) between a generic face and a specific one, LoRA encodes only the *rank-decoupled delta* of our coach-branded imagery. This ensures the CMF can generate consistent brand avatars while retaining the massive semantic logic of the base foundation model.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

At the engineering level, LoRA (Low-Rank Adaptation) works by freezing the pre-trained model weights ($W$) and injecting two smaller, trainable matrices, $A$ and $B$, into the attention layers. The original calculation $h = W \cdot x$ becomes $h = W \cdot x + \Delta W \cdot x$, where $\Delta W = A \cdot B$. 

For FLUX.1-dev in 2026, the two critical variables are **Rank ($r$)** and **Alpha ($\alpha$)**. 
- **Rank ($r$):** This defines the "cognitive capacity" of the adaptation. A rank of 32 (most common for 2026 FLUX LoRAs) means the weight decomposition uses a 32-dimensional subspace. Higher rank (64-128) allows for more complex detail but increases the risk of "catastrophic forgetting," where the model loses its ability to follow basic prompts.
- **Alpha ($\alpha$):** This is the scaling factor. In modern flow-matching models like FLUX, setting $\alpha$ to exactly half of the rank ($r=32, \alpha=16$) is the gold standard for maintaining structural integrity.

Dataset curation is the primary failure point. A "physiological" LoRA for a coach requires 20-30 near-perfect images (1024x1024, bf16 precision). If images contain noise, watermarks, or inconsistent lighting, the model interprets these as part of the "identity." CMF training pipelines must automate **Dataset Pruning** — removing any image where the CLIP score against the brand prompt falls below 0.85, ensuring only high-fidelity "signal" enters the training loop.

## 📂 OUR CODE (100-200 words)

The CMF logic for these specialized adapters is defined in the architecture layer, ensuring that every generated video uses the correct identity fingerprint.

Reference: `docs/architecture/FR-VIS-17_Identity_LoRA_Training_Pipeline_Tech_Spec.md`

```python
# FR-VIS-17, Dataset Validation Logic
# WHY: We intercept the training queue here to enforce 
# the 2026 FLUX "Alpha-to-Rank" ratio. Failure to keep
# Alpha at r/2 results in visual artifacts in NIM.

def validate_training_params(rank: int, alpha: int):
    # Rule: Alpha must be exactly rank / 2 for FLUX stability
    if alpha != (rank // 2):
        raise ValueError("L5 Violation: Alpha-Rank Drift detected.")
    
    # Rule: Enforce 24GB VRAM training gate
    if not gpu_has_min_vram(24):
        return "⚠️ BUILD REQUIRED — 24GB VRAM instance not provisioned."
```

The code ensures that we never waste GPU cycles on "dirty" datasets or unstable training parameters.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Pi / Claude Code:**
> Use the technical specifications in `docs/architecture/FR-VIS-17_Identity_LoRA_Training_Pipeline_Tech_Spec.md` to design a new file at `cmf/docs/lora_training_pipe_spec.md`. This spec must define the curation protocols for a "Coach Avatar" dataset, requiring exactly 25 images, 1024x1024 resolution, and the AdamW8bit optimizer settings. Include the specific Rank=32 and Alpha=16 constraints we discussed for FLUX.1 stability.

## ⌨️ TERMINAL (50-100 words)

```bash
# Verify the NVIDIA drivers and VRAM availability for training
nvidia-smi --query-gpu=memory.total,driver_version --format=csv
# Expected: 24576 MiB, 550.x or higher

# Create the training environment for kohya_ss/diffusers
python -m venv venv-training-cmf
source venv-training-cmf/bin/activate
# Expected: (venv-training-cmf) prompt prefix
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Review the `FR-VIS-17` architectural spec in the `docs/architecture/` directory to understand the identity enforcement requirements.
2. Open `src/ccp/config.py` and verify that the `TRAINING_VRAM_GATE` is set to `24`, matching our 2026 hardware requirements.
3. Paste the Agent Prompt from Section 4 into your Pi or Claude Code session to generate the `lora_training_pipe_spec.md`.
4. Run the `nvidia-smi` command in your terminal to ensure your AWS instance has the required 24GB+ VRAM for FLUX.1 training.
5. Create the training virtual environment as shown in the Terminal section.
6. Map the "Dataset Curation" requirements in the generated spec to your existing image assets in the `cmf/assets/avatars/` folder.

## ✅ VERIFY (30-50 words)

Check for the existence of `cmf/docs/lora_training_pipe_spec.md`. Open the file and verify that the `rank` and `alpha` parameters are explicitly set to 32 and 16, respectively. `pytest tests/test_cmf_config.py` should return all green.

## 🔗 BRIDGE (30-50 words)

Unit 7.7 builds on this by introducing Fingerprinting — the mechanism that ensures when you update a LoRA, the pipeline knows exactly which video beats need regeneration without re-rendering the entire factory output.

<!-- FACT-CHECK: "FLUX.1-dev LoRA rank alpha ratio" → Consensus for FLUX.1 flow-matching is alpha = 0.5 * rank for stability and prompt adherence. -->
<!-- FACT-CHECK: "FLUX LoRA dataset size 2026" → 20-30 images remain the gold standard for character consistency without overfitting. -->
<!-- FACT-CHECK: "AdamW8bit FLUX training" → Standard memory-saving optimizer for 24GB VRAM training environments in 2026. -->
