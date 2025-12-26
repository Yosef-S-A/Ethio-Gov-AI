#!/bin/bash

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be ready
sleep 5

# Pull the lightweight model for CPU efficiency
echo "--- Pulling Llama 3.2 1B ---"
ollama pull llama3.2:1b

# Start your FastAPI backend
# Note: Hugging Face uses port 7860 by default
exec uvicorn backend.api:app --host 0.0.0.0 --port 7860