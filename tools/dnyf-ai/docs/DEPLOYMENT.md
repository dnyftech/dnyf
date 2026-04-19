# Claude AI Interface - Advanced Deployment Guide

## 🐳 Docker Deployment

### Quick Docker Start

```bash
# Prerequisites: Docker and Docker Compose installed

# 1. Build and start services
docker-compose up -d

# 2. Wait for Ollama to initialize
docker logs -f claude-ollama

# 3. Pull a model (in Ollama container)
docker exec claude-ollama ollama pull neural-chat

# 4. Check backend health
curl http://localhost:8000/health

# 5. Access the app
# Open: http://localhost:8000
```

### Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f ollama

# Stop all services
docker-compose down

# Remove all data
docker-compose down -v

# Restart services
docker-compose restart

# Check service status
docker-compose ps

# Execute command in container
docker exec claude-ollama ollama list
docker exec claude-backend curl http://localhost:8000/models
```

## 🔧 Advanced Backend Configuration

### Custom Model Parameters

Edit `app_backend.py` to modify model behavior:

```python
# In the generate endpoint, modify payload:
payload = {
    "model": model,
    "prompt": conversation,
    "temperature": 0.7,      # 0-2, higher = more creative
    "top_p": 0.9,           # nucleus sampling
    "top_k": 40,            # top-k sampling
    "num_predict": 1000,    # max tokens
    "repeat_penalty": 1.1,  # penalize repetition
    "repeat_last_n": 64,    # look-ahead window
}
```

### Add Authentication

```python
from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")

async def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != os.getenv("API_KEY", "your-secret-key"):
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

@app.post("/chat")
async def chat(request: ChatRequest, api_key: str = Depends(verify_api_key)):
    # ... existing code
```

### Add Rate Limiting

```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/chat")
@limiter.limit("30/minute")
async def chat(request: ChatRequest):
    # ... existing code
```

### Add System Prompts

```python
SYSTEM_PROMPT = """You are Claude, a helpful AI assistant made by Anthropic.
You are thoughtful, harmless, and honest.
You provide detailed, informative responses while being concise when appropriate."""

# In chat function:
conversation = f"{SYSTEM_PROMPT}\n\n" + conversation
```

### Enable HTTPS

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365

# Run with HTTPS
uvicorn app_backend:app \
  --host 0.0.0.0 \
  --port 8000 \
  --ssl-keyfile=key.pem \
  --ssl-certfile=cert.pem
```

### Custom Logging

```python
import logging
from logging.handlers import RotatingFileHandler

# Setup file logging
handler = RotatingFileHandler(
    filename='/tmp/claude.log',
    maxBytes=1000000,  # 1MB
    backupCount=5
)
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
handler.setFormatter(formatter)
logger.addHandler(handler)
```

## 🌐 Networking

### Remote Access (Caution: Security Risk!)

Make Ollama accessible remotely:

```bash
# Ollama default only listens on localhost
# To expose to network:
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# Then update backend:
export OLLAMA_URL=http://0.0.0.0:11434
python app_backend.py
```

**Security Warning**: Only expose to trusted networks!

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # For streaming
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```

### Load Balancing Multiple Backends

```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Backend 1
PORT=8001 python app_backend.py

# Terminal 3: Backend 2
PORT=8002 python app_backend.py

# Terminal 4: Nginx (round-robin)
# Configure nginx.conf with upstream
```

## 📊 Performance Optimization

### Model Quantization

Use quantized models for lower memory usage:

```bash
# Quantized versions (smaller, faster)
ollama pull neural-chat:q4_K_M
ollama pull mistral:q4_0
ollama pull llama2:q4_K_M
```

### Batch Processing

Add batch endpoint for multiple requests:

```python
@app.post("/chat/batch")
async def batch_chat(requests: list[ChatRequest]):
    results = []
    for req in requests:
        result = await chat(req)
        results.append(result)
    return {"results": results}
```

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
async def get_cached_response(prompt: str):
    # Get response with caching
    pass
```

### Response Streaming Optimization

```python
# Increase chunk size for faster transmission
async def generate():
    buffer = ""
    while True:
        buffer += chunk
        if len(buffer) > 100:
            yield buffer
            buffer = ""
```

## 📈 Monitoring & Debugging

### Health Monitoring

```bash
# Check health every 5 seconds
watch -n 5 'curl http://localhost:8000/health'

# Monitor resource usage
watch -n 1 'echo "=== Memory ===" && free -h && echo "=== CPU ===" && top -bn1 | head -20'
```

### Request Logging

Modify `app_backend.py` to log all requests:

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZIPMiddleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(GZIPMiddleware, minimum_size=1000)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

### Performance Profiling

```python
# Add to app_backend.py
import time

@app.middleware("http")
async def time_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## 🔄 CI/CD Integration

### GitHub Actions (for your DNYFappbuilder pattern)

```yaml
name: Deploy Claude AI

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-asyncio
      
      - name: Run tests
        run: pytest

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t claude-ai:latest .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag claude-ai:latest ${{ secrets.DOCKER_USERNAME }}/claude-ai:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/claude-ai:latest
```

## 🚀 Production Deployment

### systemd Service (Linux/Termux)

Create `/etc/systemd/system/claude-backend.service`:

```ini
[Unit]
Description=Claude AI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/claude-ai
Environment="OLLAMA_URL=http://localhost:11434"
Environment="OLLAMA_MODEL=neural-chat"
ExecStart=/usr/bin/python3 /root/claude-ai/app_backend.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
systemctl daemon-reload
systemctl enable claude-backend
systemctl start claude-backend
systemctl status claude-backend
```

## 🆘 Troubleshooting Advanced Issues

### High Memory Usage

```bash
# Check memory per process
ps aux --sort=-%mem | head -5

# Use smaller model
ollama pull orca-mini

# Set memory limits (Docker)
docker run --memory="2g" claude-backend
```

### Slow Responses

```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Monitor while running
time curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### Connection Issues

```bash
# Test connectivity
nc -zv localhost 11434
nc -zv localhost 8000

# Check open ports
netstat -tlnp | grep python
netstat -tlnp | grep ollama
```

---

For more help, check README.md or create an issue on GitHub.
