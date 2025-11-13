#!/bin/bash
set -e

# ------------------------------------------------------------------
# Script: run.sh
# Purpose: Start all Real State Microservices using Docker Compose
# Usage: ./script/run.sh
# ------------------------------------------------------------------

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
  echo "docker-compose.yml not found in the current directory!"
  exit 1
fi

# Start all services in detached mode
echo "Starting all services..."
docker compose up -d

# Wait a few seconds for containers to initialize
echo "Waiting for services to initialize..."
sleep 5

# Show status of running containers
echo "Current running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "All services started successfully."
echo "Frontend URL, API Gateway, and other services should now be accessible."
