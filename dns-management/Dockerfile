# Multi-stage Docker build for DNS Management System
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    curl \
    dnsutils \
    openssl \
    jq \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    dnsutils \
    openssl \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 dnsmanager && \
    mkdir -p /app/backups /app/logs && \
    chown -R dnsmanager:dnsmanager /app

# Set working directory
WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /home/dnsmanager/.local

# Copy application files
COPY --chown=dnsmanager:dnsmanager . .

# Make scripts executable
RUN chmod +x *.py *.sh

# Switch to non-root user
USER dnsmanager

# Set Python path
ENV PATH=/home/dnsmanager/.local/bin:$PATH
ENV PYTHONPATH=/app:$PYTHONPATH

# Environment variables (will be overridden by docker-compose or runtime)
ENV CLOUDFLARE_API_TOKEN=""
ENV CANSPACE_USERNAME=""
ENV CANSPACE_PASSWORD=""
ENV CLICKUP_API_KEY=""
ENV HUBSPOT_API_KEY=""

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python3 dns-health-monitor.py check || exit 1

# Default command - run the automation menu
CMD ["./dns-automation.sh"]