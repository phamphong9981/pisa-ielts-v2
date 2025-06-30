#!/bin/bash

# =============================================================================
# Run PISA Docker Container (Standalone)
# Connect to local PostgreSQL database
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting PISA Docker Container...${NC}"

# Container and image names
CONTAINER_NAME="pisa-app"
IMAGE_NAME="pisa-app:latest"
PORT=${PORT:-8080}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating from example...${NC}"
    if [ -f "env.production.example" ]; then
        cp env.production.example .env.production
        echo -e "${RED}❗ Please edit .env.production with your actual values!${NC}"
        echo -e "${YELLOW}Important: Set DATABASE_HOST to 'host.docker.internal' for local PostgreSQL${NC}"
        echo -e "${BLUE}Note: Firebase is optional - leave FIREBASE_SERVICE_ACCOUNT_KEY_PATH empty if not needed${NC}"
        exit 1
    else
        echo -e "${RED}❌ env.production.example not found!${NC}"
        exit 1
    fi
fi

# Load environment variables
source .env.production

# Validate required variables
if [ -z "$DATABASE_PASSWORD" ] || [ -z "$JWT_SECRET_KEY" ]; then
    echo -e "${RED}❌ Missing required environment variables in .env.production${NC}"
    echo -e "${YELLOW}Required: DATABASE_PASSWORD, JWT_SECRET_KEY${NC}"
    exit 1
fi

# Stop and remove existing container
echo -e "${YELLOW}🛑 Stopping existing container (if any)...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Check if image exists
if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    echo -e "${YELLOW}📦 Image not found. Building...${NC}"
    docker build -t $IMAGE_NAME .
fi

# Prepare Docker host for database connection
DB_HOST=${DATABASE_HOST:-host.docker.internal}
if [ "$DB_HOST" = "localhost" ] || [ "$DB_HOST" = "127.0.0.1" ]; then
    echo -e "${YELLOW}⚠️  Converting localhost to host.docker.internal for Docker networking${NC}"
    DB_HOST="host.docker.internal"
fi

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Container: $CONTAINER_NAME"
echo -e "  Port: $PORT"
echo -e "  Database Host: $DB_HOST"
echo -e "  Database: ${DATABASE_DB_NAME:-pisa_prod}"

# Prepare Firebase volume mount if needed
FIREBASE_VOLUME=""
FIREBASE_CONTAINER_PATH=""
if [ -n "$FIREBASE_SERVICE_ACCOUNT_KEY_PATH" ]; then
    # Convert host path to absolute if relative
    if [[ "$FIREBASE_SERVICE_ACCOUNT_KEY_PATH" = /* ]]; then
        # Already absolute path
        FIREBASE_HOST_PATH="$FIREBASE_SERVICE_ACCOUNT_KEY_PATH"
        FIREBASE_CONTAINER_PATH="$FIREBASE_SERVICE_ACCOUNT_KEY_PATH"
    else
        # Convert relative to absolute path for host
        FIREBASE_HOST_PATH="$(pwd)/$FIREBASE_SERVICE_ACCOUNT_KEY_PATH"
        # Use absolute path in container
        FIREBASE_CONTAINER_PATH="/app/$FIREBASE_SERVICE_ACCOUNT_KEY_PATH"
    fi
    
    # Check if file exists on host
    if [ -f "$FIREBASE_HOST_PATH" ]; then
        FIREBASE_VOLUME="-v $FIREBASE_HOST_PATH:$FIREBASE_CONTAINER_PATH:ro"
        echo -e "${BLUE}🔥 Firebase key found: $FIREBASE_HOST_PATH${NC}"
        echo -e "${BLUE}   Mounting to container: $FIREBASE_CONTAINER_PATH${NC}"
        # Update environment variable to point to container path
        FIREBASE_ENV_PATH="$FIREBASE_CONTAINER_PATH"
    else
        echo -e "${YELLOW}⚠️  Firebase key not found: $FIREBASE_HOST_PATH${NC}"
        echo -e "${YELLOW}   Firebase features will be disabled${NC}"
        FIREBASE_ENV_PATH=""
    fi
else
    FIREBASE_ENV_PATH=""
fi

# Run container
echo -e "${GREEN}🏃 Starting container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_HOST="$DB_HOST" \
  -e DATABASE_PORT="${DATABASE_PORT:-5432}" \
  -e DATABASE_USERNAME="${DATABASE_USERNAME:-pisa_user}" \
  -e DATABASE_PASSWORD="$DATABASE_PASSWORD" \
  -e DATABASE_DB_NAME="${DATABASE_DB_NAME:-pisa_prod}" \
  -e JWT_SECRET_KEY="$JWT_SECRET_KEY" \
  -e JWT_EXPIRES_IN="${JWT_EXPIRES_IN:-24h}" \
  -e FIREBASE_SERVICE_ACCOUNT_KEY_PATH="${FIREBASE_ENV_PATH}" \
  -e BCRYPT_SALT="${BCRYPT_SALT:-12}" \
  $FIREBASE_VOLUME \
  $IMAGE_NAME

# Wait a moment for container to start
sleep 3

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    
    # Show container status
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker ps --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Wait for app to be ready and show logs
    echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
    sleep 5
    
    # Show recent logs
    echo -e "${BLUE}📋 Recent logs:${NC}"
    docker logs --tail=10 $CONTAINER_NAME
    
    echo -e "${GREEN}🎉 Deployment completed!${NC}"
    echo -e "${YELLOW}🔗 Access your application at: http://localhost:$PORT${NC}"
    
else
    echo -e "${RED}❌ Failed to start container!${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo -e "${BLUE}💡 Useful commands:${NC}"
echo -e "  View logs: docker logs -f $CONTAINER_NAME"
echo -e "  Stop container: docker stop $CONTAINER_NAME"
echo -e "  Remove container: docker rm $CONTAINER_NAME"
echo -e "  Access shell: docker exec -it $CONTAINER_NAME sh"
echo -e "  Run migration: docker exec $CONTAINER_NAME yarn migration" 