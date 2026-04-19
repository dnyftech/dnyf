# Claude AI Interface - Complete Documentation

A modern Claude-style web chat interface with FastAPI backend and Ollama LLM integration, optimized for Termux on Android.

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────┐
│          Web Browser (Port 3000)                        │
│  ┌────────────────────────────────────────────────┐    │
│  │  Claude AI Web Interface                       │    │
│  │  - Modern chat UI with streaming               │    │
│  │  - Real-time message rendering                 │    │
│  │  - Model selection                             │    │
│  └────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│  FastAPI Backend (Port 8000)                            │
│  ┌────────────────────────────────────────────────┐    │
│  │  - /chat (streaming)                           │    │
│  │  - /chat/complete (non-streaming)              │    │
│  │  - /models (list available models)             │    │
│  │  - /health (status check)                      │    │
│  └────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP API
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Ollama (Port 11434)                                    │
│  ┌────────────────────────────────────────────────┐    │
│  │  LLM Model Server (neural-chat, mistral, etc)  │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 📦 Files

```
claude-ai/
├── app_backend.py          # FastAPI backend server
├── index.html              # Web frontend (chat UI)
├── requirements.txt        # Python dependencies
├── SETUP_TERMUX.sh        # Initial setup script
├── quick-start.sh         # Quick start launcher
└── README.md              # This file
```

## 🚀 Quick Start (5 minutes)

### 1. Install & Setup (One time)

```bash
# Clone/download this app to Termux
cd ~
mkdir -p claude-ai
cd claude-ai

# Download files (or copy them)
# - app_backend.py
# - index.html
# - requirements.txt

# Run setup
bash SETUP_TERMUX.sh
```

### 2. Pull a Model (One time)

Open a **new** Termux session:

```bash
ollama pull neural-chat
# or: ollama pull mistral
```

### 3. Start Services

**Terminal 1 - Ollama (LLM Server):**
```bash
ollama serve
```

**Terminal 2 - Backend API:**
```bash
cd ~/claude-ai
python app_backend.py
```

**Terminal 3 - Frontend (Optional, if serving separately):**
```bash
cd ~/claude-ai/static
python -m http.server 3000
```

### 4. Open Browser

```
http://localhost:3000        # Frontend + Backend combined
or
http://localhost:8000        # Just backend (frontend embedded in API)
```

## 🔧 Configuration

### Environment Variables

```bash
# Set model
export OLLAMA_MODEL=mistral

# Set Ollama URL (if not localhost)
export OLLAMA_URL=http://192.168.1.10:11434

# Set backend port
export PORT=8000
export HOST=0.0.0.0

# Run backend
python app_backend.py
```

### Backend Port Configuration

Default: `8000`

```bash
# Custom port
PORT=5000 python app_backend.py

# All interfaces
HOST=0.0.0.0 PORT=8000 python app_backend.py
```

### Frontend Configuration

The frontend connects to the backend via:
```javascript
const API_BASE = 'http://localhost:8000';
```

To change, edit `index.html`:
```javascript
const API_BASE = 'http://your-backend-ip:8000';
```

## 📡 API Endpoints

### POST /chat (Streaming)
Stream chat responses chunk by chunk.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"}
  ],
  "model": "neural-chat",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Response (NDJSON - newline-delimited JSON):**
```json
{"content": "Hello", "done": false}
{"content": "!", "done": false}
{"content": "", "done": true, "full_response": "Hello!", "model": "neural-chat"}
```

### POST /chat/complete (Non-streaming)
Get complete response at once.

**Request:** Same as above

**Response:**
```json
{
  "content": "Hello! How can I help you?",
  "model": "neural-chat",
  "finish_reason": "stop"
}
```

### GET /models
Get list of available models.

**Response:**
```json
{
  "models": ["neural-chat", "mistral", "llama2"],
  "default": "neural-chat",
  "count": 3
}
```

### GET /health
Check server health and Ollama connection.

**Response:**
```json
{
  "status": "healthy",
  "ollama": "connected"
}
```

## 🎨 Frontend Features

- **Modern Chat UI**: Claude-inspired design with smooth animations
- **Streaming**: Real-time message rendering as they arrive
- **Model Selection**: Choose from available Ollama models
- **Status Indicator**: See if Ollama is connected
- **Responsive**: Works on desktop, tablet, and mobile
- **Message History**: Maintains conversation context
- **Error Handling**: Clear error messages and recovery
- **Auto-scroll**: Automatically scrolls to latest messages
- **Typing Indicator**: Shows when assistant is responding

## 🛠️ Troubleshooting

### "Cannot reach Ollama server"
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not:
ollama serve

# Check if it's on a different machine
export OLLAMA_URL=http://192.168.1.10:11434
python app_backend.py
```

### "No models available"
```bash
# Pull a model
ollama pull neural-chat

# List all available models
ollama list
```

### Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:8000/health

# Check port
netstat -an | grep 8000
# or
lsof -i :8000
```

### "Address already in use"
```bash
# Kill process on port 8000
pkill -f "python app_backend.py"
pkill -f "http.server"

# Or use different port
PORT=5000 python app_backend.py
```

### Python/Package Issues
```bash
# Check Python version (need 3.7+)
python --version

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

## 📊 Supported Ollama Models

Fast & Good Quality:
- `neural-chat` (4.7B) - Recommended
- `mistral` (7B) - Fastest
- `orca-mini` (3.8B) - Smallest

Better Quality:
- `llama2` (7B/13B) - More capable
- `vicuna` (7B/13B) - Good instruction following
- `openchat` (3.5B/7B) - Fast and capable

Pull any model:
```bash
ollama pull neural-chat
ollama pull mistral
ollama pull llama2
ollama pull orca-mini
```

## 💻 Termux-Specific Tips

### Extend Storage
```bash
# If running out of space
termux-setup-storage
```

### Keep Running in Background
```bash
# Use nohup
nohup ollama serve > /tmp/ollama.log &
nohup python app_backend.py > /tmp/backend.log &

# Or use tmux
tmux new-session -d -s ollama "ollama serve"
tmux new-session -d -s backend "python app_backend.py"
```

### Monitor Performance
```bash
# Check RAM usage
free -h

# Check running processes
ps aux | grep python

# Monitor in real-time
watch -n 1 'free -h && ps aux | grep python'
```

### SSH into Termux
```bash
# On device
sshd

# From another machine
ssh -p 8022 user@device-ip
```

## 🚄 Performance Tips

1. **Use faster models** for better responsiveness:
   - `orca-mini` or `mistral` for speed
   - `neural-chat` for balance

2. **Reduce token limit**:
   ```python
   # In app_backend.py
   "num_predict": 256  # Shorter responses
   ```

3. **Lower temperature** for consistency:
   ```json
   {"temperature": 0.3}
   ```

4. **Quantize models** for less memory:
   ```bash
   ollama pull mistral:q4_K_M
   ```

5. **Monitor memory**:
   ```bash
   watch -n 1 'free -h'
   ```

## 🔐 Security Notes

- Backend is CORS-enabled (open to all origins)
- No authentication by default
- For production, add:
  - API keys
  - Rate limiting
  - HTTPS/TLS
  - CORS restrictions
  - Input validation

## 📝 Customization

### Change Default Model
```bash
export OLLAMA_MODEL=mistral
python app_backend.py
```

### Modify UI Colors
Edit `index.html` CSS variables:
```css
:root {
  --accent: #10a37f;        /* Main color */
  --bg-primary: #fff;       /* Background */
  --text-primary: #0d0d0d;  /* Text color */
}
```

### Add System Prompt
In `app_backend.py`, modify message building:
```python
system_prompt = "You are a helpful AI assistant..."
conversation = f"System: {system_prompt}\n" + conversation
```

### Enable HTTPS
```bash
pip install python-multipart python-dotenv

# Generate self-signed cert
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Run with HTTPS
uvicorn app_backend:app --host 0.0.0.0 --port 8000 --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

## 🆘 Getting Help

1. Check backend logs:
   ```bash
   python app_backend.py  # See error messages
   ```

2. Check Ollama status:
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. Check browser console:
   - Open DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for API requests

4. Useful commands:
   ```bash
   # List Ollama models
   ollama list
   
   # See Ollama version
   ollama --version
   
   # Pull with progress
   ollama pull neural-chat
   ```

## 📄 License

Free to use and modify.

## 🎓 Learning Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Ollama Docs](https://github.com/ollama/ollama)
- [Termux Wiki](https://wiki.termux.com/)
- [Python AsyncIO](https://docs.python.org/3/library/asyncio.html)

---

**Built for Director | Production-Ready | No Placeholders**
