# Unit 7.2: Audio Physics — Whisper + Demucs

## 🧠 THE SCIENCE (134 words)

**UNLEARN:** Audio is not "just text-to-speech" or a simple stream of raw data. In the CMF Pipeline, audio is a complex physical wave containing both signal (the coach's voice) and noise (background artifacts, music leakage, environmental hum).

Think of this like **Cochlear Hair Cells and Tonotopic Mapping** in the human inner ear. The cochlea doesn't just "hear" sound; it uses specialized hair cells arranged along a spiral membrane to decompose complex pressure waves into discrete frequency channels. High frequencies vibrate the base; low frequencies vibrate the apex. This biological "source separation" allows the auditory cortex to isolate a single voice in a crowded room—the "Cocktail Party Effect."

In the CMF, we replicate this biology via **Demucs** (for frequency decomposition) and **Whisper** (for semantic extraction). Without this physics layer, caption sync drifts, and the AI "hallucinates" words that were actually just background noise.

## 🧠 TECHNICAL KNOWLEDGE (232 words)

The CMF audio engine operates as a three-stage sequential pipeline designed for maximum word-level precision. At its core, we use **Whisper large-v3-turbo**, an 809M parameter Transformer model that provides word-level timestamps with sub-10ms accuracy. Unlike standard STT, we enforce `word_timestamps=True` to generate the frame-accurate JSON required for downstream karaoke-style captioning.

However, Whisper’s accuracy degrades significantly in low **Signal-to-Noise Ratio (SNR)** environments. To solve this, we implement a conditional gate using **Demucs (htdemucs_ft)**. Demucs is a four-stem source separation model (Vocals, Drums, Bass, Other) based on the Hybrid Transformer architecture. 

The logic is simple but governed by physics:
1. **SNR Gating**: We compute the RMS energy of the voiceover. If the SNR is below **20dB** (indicating high background interference), the gate triggers Stage 2.
2. **Vocal Isolation**: Demucs separates the "Vocal" stem, effectively stripping away background noise while preserving the coach's unique vocal DNA.
3. **Recursive Transcription**: If separation is triggered, we re-run Whisper on the *clean* stem. This increases word-level confidence scores (the `probability` field in our JSON) and prevents the "drifting caption" problem where background beats are mistaken for syllables.

This ensures that the `DEP-VID-004` (Whisper Transcript) output contains perfectly aligned `start_frame` and `end_frame` data, even if the coach recorded their voiceover in a noisy cafe or over a demo track.

## 📂 OUR CODE (148 words)

The entire audio logic lives in `cmf/apps/cmf-assembler/audio_engine.py`. Open it and trace these two critical logic gates:

```python
# audio_engine.py, line 181
# WHY: We MUST use large-v3 with word_timestamps=True. The 'large-v3-turbo' 
# model is preferred in 2026 for its 8x speed increase while maintaining 
# the timestamp precision required for Remotion timeline alignment.
result = model.transcribe(
    str(voiceover_path),
    word_timestamps=True,
    language=language,
)

# audio_engine.py, line 322
# WHY: SNR gating prevents 'GPU waste'. We only spend the 120-second 
# VRAM compute cost of Demucs if the audio quality strictly mandates it.
if snr_original > SNR_THRESHOLD_DB:
    logger.info("SNR %.1f dB > %.1f dB — skipping Demucs", snr_original, SNR_THRESHOLD_DB)
    return result
```

**🔧 EXTEND —** The `SNR_THRESHOLD_DB` is currently hardcoded at `20.0`. In a future unit, we will move this to a dynamic `PBAR` (Pipeline Behavioral Adaptive Result) based on the coach's specific microphone profile.

## 🤖 AGENT PROMPT (92 words)

> **Prompt for Claude Code:**
> `I need to audit my audio pipeline for VRAM efficiency. Open cmf/apps/cmf-assembler/audio_engine.py and examine the transcribed_voiceover function (lines 142-270). Identify if the Whisper model is being re-loaded into VRAM for every call or if it is properly cached as a global singleton. If it isn't cached, propose a refactor to move the 'whisper.load_model' call outside the function scope to prevent OOM (Out of Memory) errors during batch processing of 50+ video beats.`

## ⌨️ TERMINAL (65 words)

```bash
# Verify ffprobe can read your audio metadata
ffprobe -v quiet -show_streams -show_format input_audio.mp3

# Expected: codec_name=mp3, duration=..., sample_rate=44100

# Run the audio engine tests (requires GPU/NIM)
pytest tests/test_audio_engine.py -v
# Expected: test_transcribe_voiceover PASSED
# Expected: test_separate_stems_snr_gate PASSED
```

## ✅ IMPLEMENTATION STEPS (142 words)

1. Open `cmf/apps/cmf-assembler/audio_engine.py`.
2. Locate the `WHISPER_MODEL` constant (line 31) and ensure it is set to `large-v3` (or `large-v3-turbo` if optimizing for 2026 speed).
3. Trace the `transcribe_voiceover` function from line 142. Note how it converts seconds to frame numbers using the project `fps` (line 204)—this is the "bridge" between audio physics and video timing.
4. Locate `separate_stems` (line 279) and identify the `compute_snr_db` call.
5. Review the `subprocess.run` command (line 331) that invokes Demucs. Note the `--two-stems vocals` flag; this ensures we don't waste VRAM separating drums or bass when we only need the voice.
6. Verify the `SNR_THRESHOLD_DB` constant (line 33) is set to `20.0`. This is the constitutional boundary for audio quality.

## ✅ VERIFY (44 words)

Identify the `SNR_THRESHOLD_DB` value in `audio_engine.py`. If you provide an audio file with an SNR of `25.5 dB`, will `separate_stems` run Demucs? → **No**, it will skip separation because `25.5 > 20.0`, indicating the audio is already "high fidelity."

## 🔗 BRIDGE (39 words)

Unit 7.3 builds on this by introducing **Diffusion Model Theory**. Now that we have frame-accurate audio timestamps, we can use them to time our T2I prompts, ensuring that every visual "hit" matches the coach's vocal emphasis with mathematical precision.

<!-- FACT-CHECK: "Whisper large-v3-turbo on HuggingFace 2026" → Available as openai/whisper-large-v3-turbo, MIT license, supports word-level timestamps. -->
<!-- FACT-CHECK: "Demucs htdemucs_ft 2026" → Standard for 4-stem separation, MIT license, Hybrid Transformer architecture. -->
