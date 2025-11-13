#!/bin/bash
set -e

# ------------------------------------------------------------------
# Script: create-env.sh
# Purpose: Create .env files for all Real State Microservices
# Note: Fill actual values manually after creation
# ------------------------------------------------------------------

ENV_DIR="./env"
mkdir -p "$ENV_DIR"

# ----------------------------
# Auth Service
# ----------------------------
cat > "$ENV_DIR/auth-service.env" <<EOL
# Auth Service port
PORT=

# PostgresSQL database URL for Auth service
DATABASE_URL=

# Redis URL for caching/session
REDIS_URL=
EOL

# ----------------------------
# Enquiry Service
# ----------------------------
cat > "$ENV_DIR/enquiry-service.env" <<EOL
# Enquiry Service port
PORT=

# PostgresSQL database URL for Enquiry service
DATABASE_URL=
EOL

# ----------------------------
# Property Service
# ----------------------------
cat > "$ENV_DIR/property-service.env" <<EOL
# Property Service port
SERVER_PORT=

# MySQL JDBC URL
SPRING_DATASOURCE_URL=

# MySQL username
SPRING_DATASOURCE_USERNAME=

# MySQL password
SPRING_DATASOURCE_PASSWORD=

# JDBC driver class
SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver

# Enable Flyway migrations
SPRING_FLYWAY_ENABLED=true

# Flyway baseline on migrate
SPRING_FLYWAY_BASELINE_ON_MIGRATE=true
EOL

# ----------------------------
# API Gateway
# ----------------------------
cat > "$ENV_DIR/api-gateway.env" <<EOL
# API Gateway port
PORT=

# Frontend URL
FRONTEND_URL=

# Auth service URL
AUTH_SERVICE_URL=

# Enquiry service URL
ENQUIRY_SERVICE_URL=

# Property service URL
PROPERTY_SERVICE_URL=
EOL

# ----------------------------
# Landing Frontend
# ----------------------------
cat > "$ENV_DIR/landing-frontend.env" <<EOL
# API Gateway URL used by frontend
NEXT_PUBLIC_API_URL=
EOL

echo "✅ .env files created in '$ENV_DIR/'. Fill in real values manually."
