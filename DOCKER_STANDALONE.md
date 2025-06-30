# 🐳 PISA Standalone Docker Deployment

Hướng dẫn chạy ứng dụng PISA trong Docker container kết nối với PostgreSQL local.

## 📋 Prerequisites

- ✅ Docker 20.10+
- ✅ PostgreSQL running locally (port 5432)
- ✅ Database đã tạo sẵn

## 🚀 Quick Start

### 1. Setup Database

Đảm bảo PostgreSQL đang chạy và có database:

```sql
-- Connect to PostgreSQL
CREATE USER pisa_user WITH PASSWORD 'your_password';
CREATE DATABASE pisa_prod OWNER pisa_user;
GRANT ALL PRIVILEGES ON DATABASE pisa_prod TO pisa_user;
```

### 2. Setup Environment

```bash
# Copy environment template
cp env.production.example .env.production

# Edit với thông tin database local
nano .env.production
```

**Important:** Set `DATABASE_HOST=host.docker.internal` trong `.env.production`

### 3. Deploy

```bash
# Build và run container
yarn docker:run

# Hoặc manual:
yarn docker:build
docker run -d --name pisa-app -p 8080:8080 --env-file .env.production pisa-app:latest
```

### 4. Run Migrations

```bash
# Run migrations sau khi container đã start
yarn docker:migration
```

## 🔧 Configuration

### .env.production Example

```bash
# Application
NODE_ENV=production
PORT=8080

# Database (Local PostgreSQL)
DATABASE_HOST=host.docker.internal  # Important for Docker networking
DATABASE_PORT=5432
DATABASE_USERNAME=pisa_user
DATABASE_PASSWORD=your_strong_password
DATABASE_DB_NAME=pisa_prod

# JWT
JWT_SECRET_KEY=your_super_secure_32_character_secret_key
JWT_EXPIRES_IN=24h

# Optional: Firebase (relative or absolute path)
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./firebase-service-account-key.json
```

### Firebase Setup (Optional)

⚠️ **Firebase Confusion Clarification:**
- `firebase.json` = Firebase CLI config → **KHÔNG cần mount**
- `firebase-service-account-key.json` = Credentials → **CẦN mount** nếu dùng

#### Option 1: No Firebase (Recommended for simple setup)
```bash
# .env.production
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=
# App sẽ hoạt động bình thường, chỉ không có push notifications
```

#### Option 2: With Firebase (For push notifications)
```bash
# Get service account key từ Firebase Console
# Place in project directory
cp firebase-service-account-key.json ./firebase-service-account-key.json

# Update .env.production
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./firebase-service-account-key.json
```

**Why mount?** App cần đọc private key để authenticate với Firebase Admin SDK.

## 🛠️ Management Commands

### Container Management

```bash
# Build Docker image
yarn docker:build

# Run container
yarn docker:run

# View logs
yarn docker:logs

# Stop and remove container
yarn docker:stop

# Access container shell
yarn docker:shell

# Run migrations
yarn docker:migration
```

### Manual Docker Commands

```bash
# Build image
docker build -t pisa-app:latest .

# Run container
docker run -d \
  --name pisa-app \
  -p 8080:8080 \
  --env-file .env.production \
  pisa-app:latest

# View logs
docker logs -f pisa-app

# Stop container
docker stop pisa-app && docker rm pisa-app
```

## 🔌 Database Connection

### Network Configuration

Docker container sẽ connect với local PostgreSQL qua:

- **Windows/Mac Docker Desktop:** `host.docker.internal`
- **Linux:** Có thể cần dùng host IP thay vì `host.docker.internal`

### For Linux Users

Nếu `host.docker.internal` không work trên Linux:

```bash
# Tìm host IP
ip route show default | awk '/default/ {print $3}'

# Update .env.production
DATABASE_HOST=172.17.0.1  # Your host IP
```

### Hoặc dùng host network (Linux only):

```bash
docker run -d \
  --name pisa-app \
  --network host \
  --env-file .env.production \
  pisa-app:latest
```

## 🔒 Security Considerations

### PostgreSQL Configuration

Đảm bảo PostgreSQL accept connections từ Docker:

```bash
# Edit postgresql.conf
listen_addresses = 'localhost'  # Hoặc '*' nếu cần

# Edit pg_hba.conf - Add line:
host    pisa_prod    pisa_user    172.17.0.0/16    md5
```

### Firewall

```bash
# Allow PostgreSQL port (if needed)
sudo ufw allow 5432
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Cannot connect to database

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check container logs
yarn docker:logs

# Test connection from container
yarn docker:shell
# Inside container:
nc -zv host.docker.internal 5432
```

#### 2. Permission denied

```bash
# Check PostgreSQL user permissions
sudo -u postgres psql
\l  # List databases
\du # List users
```

#### 3. Container won't start

```bash
# Check Docker logs
docker logs pisa-app

# Check environment variables
docker exec pisa-app env | grep DATABASE
```

#### 4. Firebase volume mount error

```bash
# Check if Firebase key file exists
ls -la ./firebase-service-account-key.json

# Check Firebase environment variable
grep FIREBASE .env.production

# Test without Firebase (leave empty)
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=
```

### Debug Commands

```bash
# Check container status
docker ps -a

# Inspect container
docker inspect pisa-app

# Test database connection
docker exec pisa-app yarn migration

# Check app health
curl http://localhost:8080
```

## 📊 Monitoring

### Health Check

```bash
# Manual health check
curl http://localhost:8080

# Container health status
docker inspect pisa-app --format='{{.State.Health.Status}}'
```

### Performance

```bash
# Container stats
docker stats pisa-app

# Container logs with timestamps
docker logs -t pisa-app
```

## 🔄 Updates

### Update Application

```bash
# Stop current container
yarn docker:stop

# Rebuild with latest code
yarn docker:build

# Start new container
yarn docker:run

# Run new migrations (if any)
yarn docker:migration
```

### Backup Before Update

```bash
# Backup database
pg_dump -h localhost -U pisa_user pisa_prod > backup_$(date +%Y%m%d).sql

# Backup environment
cp .env.production .env.production.backup
```

## 💡 Tips

- Sử dụng `host.docker.internal` thay vì `localhost` trong Docker
- Test database connection trước khi run container
- Check PostgreSQL logs nếu có lỗi connection
- Monitor container logs khi deploy lần đầu
- Backup database before updates 