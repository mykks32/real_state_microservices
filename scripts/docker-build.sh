#!/bin/bash
set -e

# ------------------------------------------------------------------
# Script: docker-build.sh
# Purpose: Build all Docker images for Real State Microservices
# Usage: ./script/docker-build.sh
# ------------------------------------------------------------------

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
  echo "docker-compose.yml not found in the current directory!"
  exit 1
fi

# Build Auth service image
echo "Building Auth service image..."
docker compose build auth-service

# Build Enquiry service image
echo "Building Enquiry service image..."
docker compose build enquiry-service

# Build Property service image
echo "Building Property service image..."
docker compose build property-service

# Build API Gateway image
echo "Building API Gateway image..."
docker compose build api-gateway

# Build Landing Frontend image
echo "Building Landing Frontend image..."
docker compose build landing-frontend

echo "All Docker images built successfully."
echo "You can now start the services with: docker compose up -d"
