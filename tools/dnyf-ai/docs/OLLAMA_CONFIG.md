# Ollama Configuration Guide - SmolLM:135m & Gemma3:270m

**Ultra-lightweight models perfect for Termux on Android**

---

## 🚀 Quick Setup (Copy-Paste Ready)

### Pull Both Models

```bash
# SmolLM (135M params - fastest)
ollama pull smollm:135m

# Gemma3 (270M params - better quality)
ollama pull gemma3:270m

# Verify installation
ollama list
```

**Output:**
```
smollm:135m     8.2 GB
gemma3:270m     12.5 GB
```

---

## ⚡ Start Ollama

```bash
# Default settings
ollama serve

# Or with environment variables
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

---

## 🔧 Configure Backend to Use SmolLM

### Option 1: Environment Variable (Simplest)

```bash
export OLLAMA_MODEL=smollm:135m
python app_backend.py
```

### Option 2: Hardcode in Backend

Edit `app_backend.py`, line ~20:

```python
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "smollm:135m")  # Change this
```

### Option 3: Runtime Selection

In the web UI, use the model dropdown to switch between:
- `smollm:135m` (fast, lightweight)
- `gemma3:270m` (better responses)

---

## 📊 Model Comparison

| Feature | SmolLM:135m | Gemma3:270m |
|---------|------------|-----------|
| **Size** | 135M params | 270M params |
| **Speed** | ⚡⚡⚡ Fastest | ⚡⚡ Fast |
| **Quality** | Good | Better |
| **RAM** | ~500MB | ~800MB |
| **Latency** | <100ms | <200ms |
| **Best for** | Speed/Termux | Balance |

---

## 🎯 Use Cases

### Use SmolLM:135m When
```bash
export OLLAMA_MODEL=smollm:135m
python app_backend.py
```
- ✅ Low RAM devices (Termux on Android)
- ✅ Mobile/battery-constrained
- ✅ Real-time chat needs
- ✅ Token counting/quick tasks
- ✅ Running multiple models

### Use Gemma3:270m When
```bash
export OLLAMA_MODEL=gemma3:270m
python app_backend.py
```
- ✅ Better quality responses
- ✅ Complex reasoning
- ✅ Document understanding
- ✅ More capable assistant

---

## 🔄 Easy Model Switching

### Via Environment Variable

```bash
# SmolLM session
export OLLAMA_MODEL=smollm:135m
python app_backend.py

# In another terminal, switch to Gemma3
export OLLAMA_MODEL=gemma3:270m
python app_backend.py
```

### Via Web UI (Recommended)

Just select the model from the dropdown in the chat interface. Both models are always loaded in Ollama.

---

## ⚙️ Performance Tuning

### For SmolLM (maximize speed)

```python
# In app_backend.py, modify the payload:
payload = {
    "model": "smollm:135m",
    "prompt": conversation,
    "temperature": 0.5,        # Lower = more predictable
    "num_predict": 256,        # Shorter responses (faster)
    "top_k": 20,              # More focused
    "top_p": 0.8,
    "repeat_penalty": 1.05,   # Reduce repetition
}
```

### For Gemma3 (quality)

```python
payload = {
    "model": "gemma3:270m",
    "prompt": conversation,
    "temperature": 0.7,        # More creative
    "num_predict": 512,        # Longer responses (better quality)
    "top_k": 40,
    "top_p": 0.9,
    "repeat_penalty": 1.1,
}
```

---

## 📱 Termux-Specific Setup

### 1. Install Ollama

```bash
# In Termux
curl https://ollama.ai/install.sh | sh

# Or for Termux specifically
pkg install ollama
```

### 2. Pull Models

```bash
# First model (go grab coffee ☕)
ollama pull smollm:135m

# Second model
ollama pull gemma3:270m

# List them
ollama list
```

### 3. Start Services (3 Termux Sessions)

**Session 1:**
```bash
ollama serve
```

**Session 2:**
```bash
export OLLAMA_MODEL=smollm:135m
python app_backend.py
```

**Session 3 (Optional - serve frontend separately):**
```bash
cd ~/claude-ai
python -m http.server 3000
```

### 4. Open Browser

```
http://localhost:8000
or
http://localhost:3000
```

**Pick model from dropdown → Chat!**

---

## 🧠 Model Details

### SmolLM:135m
- **Base**: OpenLM Research
- **Type**: Instruction-tuned
- **Best for**: Lightweight, fast inference
- **Recommended setting**: `temperature: 0.5`
- **Typical response time**: 50-100ms per token

```bash
ollama pull smollm:135m
# Size: ~300MB downloaded
# Extracted: ~800MB RAM
```

### Gemma3:270m
- **Base**: Google DeepMind
- **Type**: Instruction-tuned
- **Best for**: Balanced quality/speed
- **Recommended setting**: `temperature: 0.7`
- **Typical response time**: 100-150ms per token

```bash
ollama pull gemma3:270m
# Size: ~450MB downloaded
# Extracted: ~1.2GB RAM
```

---

## 🚄 Speed Comparison

Generate 100 tokens:

| Model | Time | Speed |
|-------|------|-------|
| SmolLM:135m | ~5-8s | ⚡⚡⚡ |
| Gemma3:270m | ~10-15s | ⚡⚡ |

---

## 📝 Custom System Prompt (for both models)

Edit `app_backend.py`, in the `chat()` function:

```python
# Add after building conversation
SYSTEM_PROMPT = """You are a helpful AI assistant.
Keep responses concise and direct.
Use clear language."""

# Before the payload:
conversation = f"System: {SYSTEM_PROMPT}\n\n" + conversation
```

---

## 🔍 Check Model Installation

```bash
# List all models
ollama list

# Show detailed info
ollama show smollm:135m
ollama show gemma3:270m

# Test a model directly
ollama run smollm:135m "Hello, who are you?"
ollama run gemma3:270m "Explain quantum computing in one sentence"
```

---

## 🐛 Troubleshooting

### "No such file or directory: smollm:135m"

```bash
# Model not installed yet
ollama pull smollm:135m
ollama list
```

### "Out of memory"

```bash
# Switch to smaller model
export OLLAMA_MODEL=smollm:135m
python app_backend.py

# Or check RAM
free -h
```

### "Connection refused"

```bash
# Ollama not running
ollama serve

# Or check if it's already running
ps aux | grep ollama
```

### Model Very Slow

```bash
# Reduce context/tokens
payload["num_predict"] = 128  # Shorter max output

# Lower temperature for faster inference
payload["temperature"] = 0.3
```

---

## 🎛️ Full Configuration Examples

### Example 1: Production Setup (SmolLM)

```bash
#!/bin/bash
# termux-session-1.sh
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

```bash
#!/bin/bash
# termux-session-2.sh
export OLLAMA_MODEL=smollm:135m
export PORT=8000
export HOST=0.0.0.0
cd ~/claude-ai
python app_backend.py
```

```bash
#!/bin/bash
# termux-session-3.sh (optional)
cd ~/claude-ai
python -m http.server 3000
```

### Example 2: Gemma3 for Better Quality

```bash
export OLLAMA_MODEL=gemma3:270m
python app_backend.py
```

### Example 3: Docker Compose (Both Models)

Edit `docker-compose.yml`:

```yaml
environment:
  - OLLAMA_MODEL=smollm:135m  # or gemma3:270m
  - OLLAMA_HOST=0.0.0.0:11434
```

```bash
docker-compose up -d
```

---

## ✅ Checklist

- [ ] Run `ollama pull smollm:135m`
- [ ] Run `ollama pull gemma3:270m`
- [ ] Run `ollama list` to verify both installed
- [ ] Start `ollama serve` in Terminal 1
- [ ] Set `export OLLAMA_MODEL=smollm:135m` in Terminal 2
- [ ] Run `python app_backend.py` in Terminal 2
- [ ] Open `http://localhost:8000` in browser
- [ ] Select model from dropdown
- [ ] Chat! 🎉

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Install models
ollama pull smollm:135m
ollama pull gemma3:270m

# Start Ollama
ollama serve

# Run backend with SmolLM
OLLAMA_MODEL=smollm:135m python app_backend.py

# Run backend with Gemma3
OLLAMA_MODEL=gemma3:270m python app_backend.py

# Test models directly
ollama run smollm:135m "Hello"
ollama run gemma3:270m "Hello"

# List models
ollama list

# Delete a model
ollama rm smollm:135m

# Pull specific version
ollama pull gemma3:270m:latest
```

---

## 📊 Live Monitoring

```bash
# Watch memory usage while running
watch -n 1 'free -h && echo "---" && ps aux | grep -E "ollama|python" | grep -v grep'

# Check model performance
time ollama run smollm:135m "What is 2+2?"
time ollama run gemma3:270m "What is 2+2?"
```

---

## 🚀 One-Liner Quick Start

```bash
# Terminal 1: Start Ollama with both models
ollama pull smollm:135m && ollama pull gemma3:270m && ollama serve

# Terminal 2: Start Backend (default SmolLM)
export OLLAMA_MODEL=smollm:135m && python ~/claude-ai/app_backend.py

# Then open: http://localhost:8000
```

---

**That's it! SmolLM for speed, Gemma3 for quality. Switch anytime via UI dropdown. 🎯**
