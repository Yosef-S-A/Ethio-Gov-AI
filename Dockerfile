# Use Python 3.10 as base
FROM python:3.10-slim

# Install system dependencies and Ollama
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://ollama.com/install.sh | sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a non-root user (Required by Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"
WORKDIR /home/user/app

# Copy requirements and install
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY --chown=user . .

# Expose the port HF expects
EXPOSE 7860

# Use a startup script to handle multiple processes
COPY --chown=user scripts/start.sh /home/user/app/start.sh
RUN chmod +x /home/user/app/start.sh

CMD ["./start.sh"]