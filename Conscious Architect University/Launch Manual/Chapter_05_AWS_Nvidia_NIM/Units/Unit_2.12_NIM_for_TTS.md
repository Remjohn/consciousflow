# Unit 2.12: NIM for TTS — Deploying Voice

## 🧠 THE SCIENCE (120-160 words)

**UNLEARN:** Text-to-Speech (TTS) is not a playback library of pre-recorded phonemes. It is a neural simulation of the human vocal apparatus. Treating TTS as a static asset library leads to robotic, "uncanny valley" outputs that fail the CCP's adversarial validation gates.

Think of the **Primary Motor Cortex** (M1) in the human brain: it doesn't store words; it stores the motor programs required to orchestrate over 100 muscles in the tongue, lips, larynx, and diaphragm. When you speak, M1 translates abstract linguistic intent into a continuous flow of physical tension and airflow. 

In the CCP architecture, we deploy **Neural Flow-Matching**. Instead of picking sound clips, the system models the probability distribution of acoustic features. This allows for sovereign **Zero-Shot Voice Cloning**, where the system learns the "motor program" of a coach's voice from a mere 6 seconds of audio, ensuring our client accountability notes carry the exact emotional resonance of the human mentor.

## 🧠 TECHNICAL KNOWLEDGE (220-240 words)

The **Nvidia NIM Magpie TTS** microservice is our production standard for sovereign voice synthesis. Unlike generic Docker containers, NIM (Nvidia Inference Microservice) includes pre-optimized **TensorRT** inference engines specifically tuned for AWS G5 (A10G) and G6 (L4) hardware.

Magpie TTS operates via three primary synthesis modes:
1.  **Multilingual Standard:** High-fidelity synthesis in 20+ languages using a pre-defined library of high-quality base voices.
2.  **Zero-Shot Cloning:** The "Magpie-Zeroshot" engine takes a short reference `.wav` (3-10s) and generates a latent embedding that biases the entire synthesis flow toward the speaker's unique prosody and timbre.
3.  **Prompt-Driven Synthesis:** Uses natural language descriptors (e.g., "A calm, authoritative male voice with a slight gravelly edge") to generate entirely new synthetic identities.

For the CMF, the critical constraint is **VRAM Tiering**. A Magpie TTS NIM requires ~16GB of VRAM, leaving 8GB headroom on a standard 24GB G5.xlarge instance for the calling orchestrator. We utilize the **OpenAI-compatible API spec**, allowing our `voice_dna_pipeline.py` to communicate with the NIM over local HTTP (`localhost:8000`). This decoupling allows the GPU instance to spin up, process a 50-client voice tracking batch in parallel streams, and terminate within minutes, maintaining our strict batch-oriented cost model of ~$0.10 per client tracking session.

## 📂 OUR CODE (100-200 words)

The TTS integration is a critical dependency for **Step 10: Adversarial Validation** in our extraction pipeline.

- `src/ccp/pipelines/voice_dna_pipeline.py` line 455: The `adversarial_validator` is invoked here. 
- `src/ccp/services/adversarial_validator.py`: This service currently uses a mock generator. 

```python
# src/ccp/pipelines/voice_dna_pipeline.py, line 456
# WHY: We generate 5 adversarial samples using the NIM TTS client.
# These samples are compared against the Sacred Audio baseline 
# to ensure the 'Voice DNA' captures invariant stylometry (TTT drift <15%).
validation = self.adversarial_validator.validate(
    positive_space=session.positive_space,
    negative_space=session.negative_space,
    ttt_baseline_hash=baseline_hash,
)
```

🔧 **EXTEND** — Replace the mock generator in `adversarial_validator.py` with a `nim_tts_client.py` that targets the Magpie NIM endpoint. Use the reference audio from Step 1 (Corpus Assembly) as the zero-shot prompt.

## 🤖 AGENT PROMPT (50-150 words)

> **Prompt for Claude Code/Gemini CLI:**
> Create a new file at `src/ccp/services/nim_tts_client.py`. This client must interface with a local Nvidia NIM Magpie TTS container running at `http://localhost:8000/v1/audio/speech`. Implement a `synthesize_cloned_voice` method that accepts `text: str` and `reference_audio_path: Path`. It should use the `Magpie-Zeroshot` model. Ensure it handles streaming responses and saves the output to the `coach_dir/renders/tts/` directory. Reference the standard OpenAI TTS Python SDK structure but override the base URL.

## ⌨️ TERMINAL (50-100 words)

```bash
# Pull the Magpie TTS NIM container from NVIDIA NGC
docker pull nvcr.io/nvidia/nim/magpie-tts:2026.1

# Run the container on your G5 instance (Gpus=all for TensorRT)
docker run -it --rm --runtime=nvidia --gpus all \
  -e NGC_API_KEY=$NGC_API_KEY \
  -p 8000:8000 \
  nvcr.io/nvidia/nim/magpie-tts:2026.1

# Verify synthesis via cURL
curl http://localhost:8000/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{ "model": "magpie-zeroshot", "input": "Sovereignty is the first principle of the CCP architecture.", "voice": "reference_audio_base64_string" }' \
  --output test_voice.wav
```

## ✅ IMPLEMENTATION STEPS (100-200 words)

1. Generate your **NVIDIA NGC API Key** at build.nvidia.com and export it to your environment as `NGC_API_KEY`.
2. Launch a **G5.xlarge** instance using the VPC and Security Group defined in Unit 2.4 (allow port 8000 for internal VPC traffic).
3. Execute the `docker run` command from the Terminal section to deploy the Magpie NIM.
4. Paste the **Agent Prompt** from Section 4 into your coding agent to build the `nim_tts_client.py`.
5. Integrate the client into `adversarial_validator.py` at the designated synthesis hook.
6. Run a test extraction for a coach and verify that Step 10 generates `.wav` samples in the `/renders/tts/` folder.

## ✅ VERIFY (30-50 words)

`curl http://localhost:8000/v1/health/ready` → returns `{"status":"ready"}`. Run a synthesis call and verify `test_voice.wav` exists and contains recognizable, non-robotic speech from the provided zero-shot reference.

## 🔗 BRIDGE (30-50 words)

Unit 2.13 builds on this audio mastery by introducing the **Visual Factory** — where we deploy NIM-optimized ComfyUI and FLUX containers to generate the cinematic counterparts to your sovereign high-fidelity voices.

<!-- FACT-CHECK: "Magpie TTS NIM available 2026" → Confirmed available on build.nvidia.com with Zeroshot and Multilingual support. -->
<!-- FACT-CHECK: "MOSS-TTS 2026 HuggingFace" → Active flagship open-source TTS from OpenMOSS-Team, Apache 2.0. -->
<!-- FACT-CHECK: "AWS G5 instance 24GB VRAM" → Confirmed G5.xlarge uses A10G with 24GB VRAM. -->
