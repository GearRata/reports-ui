# NOPADOL Helpdesk System

**Version**: 0.1.9  
**Framework**: Next.js 15.3.4 with TypeScript  
**Repository**: GearRata/reports-ui

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Architecture](#project-architecture)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Key Features Guide](#key-features-guide)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

**NOPADOL Helpdesk System** is a comprehensive problem reporting and management system designed for IT helpdesk operations. It provides a complete workflow for reporting, tracking, and resolving technical issues across multiple branches, departments, and systems.

### What This System Does

- **Problem Reporting**: Users can report technical issues with image attachments
- **Task Management**: Admins can create, assign, and track problem resolution
- **Asset Management**: Manage branches, departments, IP phones, and systems
- **Real-time Updates**: Telegram integration for instant notifications
- **Analytics Dashboard**: Visual analytics showing problem statistics
- **Progress Tracking**: Chat-like interface for documenting resolution progress
- **Solution Database**: Store and retrieve solutions for recurring problems
- **QR Code Generation**: Generate QR codes for quick problem reporting

---

## ✨ Features

### For End Users
- 📱 **Mobile-Friendly Reporting**: Submit problems with photos via mobile device
- 📸 **Camera Integration**: Capture images directly from camera or gallery
- 🔍 **Status Tracking**: View problem status and progress updates
- ✅ **Success Confirmation**: Immediate feedback after submission

### For IT Staff
- 📊 **Comprehensive Dashboard**: Visual analytics with charts and statistics
- 🎫 **Ticket Management**: Full CRUD operations on problem tickets
- 👥 **Assignment System**: Assign tasks to responsible technicians
- 💬 **Progress Chat**: Document resolution steps with images
- 🔔 **Telegram Notifications**: Optional Telegram alerts for new assignments
- 🔍 **Advanced Search**: Search and filter by status, branch, department, etc.
- 📄 **Solution Library**: Add and retrieve solutions for problems

### For Administrators
- 👤 **User Management**: Create and manage user accounts (admin/user roles)
- 🏢 **Branch Management**: Manage office locations
- 🏛️ **Department Management**: Organize departments within branches
- ☎️ **IP Phone Management**: Track IP phone inventory
- 💻 **System Management**: Manage software/hardware systems
- 🏷️ **Type Management**: Manage problem types/categories
- 📈 **Analytics**: Detailed problem statistics by time, location, and system

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.4**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript 5**: Static type checking

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Framer Motion**: Animation library


### Forms & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Additional Libraries
- **date-fns**: Date manipulation
- **moment-timezone**: Timezone handling
- **pdf-lib**: PDF generation
- **qrcode**: QR code generation
- **axios**: HTTP client
- **react-hot-toast**: Toast notifications

### Development Tools
- **Turbopack**: Fast development bundler
- **ESLint**: Code linting
- **Standard-version**: Version management

### Deployment
- **Docker**: Containerization
- **Standalone Output**: Self-contained Next.js build

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Backend API**: This is a frontend application that requires a backend API

### Optional
- **Docker**: For containerized deployment
- **VS Code**: Recommended IDE

---

## 🚀 Installation & Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/GearRata/reports-ui.git
cd reports-ui
```

### Step 2: Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**What gets installed:**
- Next.js 15.3.4 framework
- React 19 with TypeScript
- Tailwind CSS 4 and UI components
- All dependencies from `package.json`

**Installation time:** ~2-5 minutes depending on your internet speed

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# .env file
NEXT_PUBLIC_API_BASE=http://your-backend-api-url
```

**Environment Configuration Examples:**

**Development (Local):**
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

**Development (Network):**
```env
NEXT_PUBLIC_API_BASE=http://192.168.1.100:8080
```

**Production:**
```env
NEXT_PUBLIC_API_BASE=https://api.nopadol.your-domain.com
```

### Step 4: Verify Installation

Check if everything is installed correctly:

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Next.js installation
npx next --version
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the login page.

**Default port:** 3000  
**Dev server features:** Hot reload, Fast Refresh, Turbopack

---

## 🐳 Docker Deployment

### Docker Hub Workflow (Recommended)

โปรเจกต์นี้ใช้ **Docker Hub** สำหรับเก็บ Docker images และใช้ **Shell Scripts** สำหรับ automated build & push pipeline

#### Prerequisites

1. **Docker Hub Account**: สมัครที่ https://hub.docker.com/
2. **Access Token**: สร้าง access token จาก Account Settings → Security
3. **Environment Files**: `.env.development` สำหรับ dev, `.env` สำหรับ prod

#### Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   Docker Hub Pipeline                        │
└─────────────────────────────────────────────────────────────┘

Local Machine                Docker Hub              Server
─────────────               ───────────              ──────

1. Edit code
   │
2. Run build-dev.sh
   │
   ├──> Check .env file
   │
   ├──> Docker Login ────────> Authenticate
   │
   ├──> Docker Build
   │    (Create image)
   │
   ├──> Docker Push ─────────> Store image ────────> Pull image
   │                          (username/reports-ui)   │
   ├──> Docker Logout                                 │
   │                                              Docker Run
   └──> ✅ Done!                                  (Start container)
```

**Tags:**
- `dev` → Development builds
- `latest` → Production builds
- `0.1.9` → Version-specific builds

---

### Build & Push to Docker Hub Scripts

#### Development Environment

**`build-dev.sh` - Build & Push Development Image:**

```bash
#!/bin/bash

# ---------- CONFIG ----------
IMAGE_NAME="your-dockerhub-username/reports-ui"
TAG="dev"
DOCKERFILE="Dockerfile.dev"
ENV_FILE=".env.development"
DOCKER_USERNAME="your-dockerhub-username"
DOCKER_TOKEN="your-docker-access-token"
# ----------------------------

# ตรวจสอบว่า .env.development มีอยู่หรือไม่
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file '$ENV_FILE' not found!"
  exit 1
fi

# Login เข้าสู่ Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

if [ $? -ne 0 ]; then
  echo "❌ Docker login failed!"
  exit 1
fi

# สร้าง Docker image
echo "🔧 Building Docker image: $IMAGE_NAME:$TAG"
docker build -f "$DOCKERFILE" -t "$IMAGE_NAME:$TAG" .

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  docker logout
  exit 1
fi

# Push ขึ้น Docker Hub
echo "📦 Pushing to Docker Hub..."
docker push "$IMAGE_NAME:$TAG"

if [ $? -eq 0 ]; then
  echo "✅ Push completed: $IMAGE_NAME:$TAG"
else
  echo "❌ Push failed"
  docker logout
  exit 1
fi

# Logout ออกจาก Docker Hub
echo "🚪 Logging out..."
docker logout

echo "🎉 Done!"
```

#### Production Environment

**`build-prod.sh` - Build & Push Production Image:**

```bash
#!/bin/bash

# ---------- CONFIG ----------
IMAGE_NAME="your-dockerhub-username/reports-ui"
TAG="latest"
DOCKERFILE="Dockerfile"
ENV_FILE=".env"
DOCKER_USERNAME="your-dockerhub-username"
DOCKER_TOKEN="your-docker-access-token"
# ----------------------------

# ตรวจสอบว่า .env มีอยู่หรือไม่
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file '$ENV_FILE' not found!"
  exit 1
fi

# Login เข้าสู่ Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

if [ $? -ne 0 ]; then
  echo "❌ Docker login failed!"
  exit 1
fi

# สร้าง Docker image
echo "🔧 Building Docker image: $IMAGE_NAME:$TAG"
docker build -f "$DOCKERFILE" -t "$IMAGE_NAME:$TAG" .

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  docker logout
  exit 1
fi

# Tag with version
VERSION=$(node -p "require('./package.json').version")
docker tag "$IMAGE_NAME:$TAG" "$IMAGE_NAME:$VERSION"

# Push ขึ้น Docker Hub
echo "📦 Pushing to Docker Hub..."
docker push "$IMAGE_NAME:$TAG"
docker push "$IMAGE_NAME:$VERSION"

if [ $? -eq 0 ]; then
  echo "✅ Push completed: $IMAGE_NAME:$TAG"
  echo "✅ Push completed: $IMAGE_NAME:$VERSION"
else
  echo "❌ Push failed"
  docker logout
  exit 1
fi

# Logout ออกจาก Docker Hub
echo "🚪 Logging out..."
docker logout

echo "🎉 Done!"
```

---

### How to Use

**1. Configuration**

แก้ไข config ใน script:
```bash
IMAGE_NAME="your-dockerhub-username/reports-ui"  # เปลี่ยนเป็น username ของคุณ
DOCKER_USERNAME="your-dockerhub-username"        # Docker Hub username
DOCKER_TOKEN="dckr_pat_xxxxxxxxxxxxx"            # Access token จาก Docker Hub
```

**2. Create Environment Files**

```bash
# Development
cat > .env.development << EOF
NEXT_PUBLIC_API_BASE=http://localhost:8080
EOF

# Production
cat > .env << EOF
NEXT_PUBLIC_API_BASE=https://api.your-domain.com
EOF
```

**3. Make Scripts Executable**

```bash
chmod +x build-dev.sh build-prod.sh
```

**4. Run Build & Push**

```bash
# Development
./build-dev.sh

# Production
./build-prod.sh
```

---

### Pull & Run from Docker Hub

หลังจาก push image ขึ้น Docker Hub แล้ว สามารถ pull และ run บน server อื่นได้:

**Development:**
```bash
# Pull image
docker pull your-dockerhub-username/reports-ui:dev

# Run container
docker run -d \
  --name nopadol-dev \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=http://localhost:8080 \
  your-dockerhub-username/reports-ui:dev
```

**Production:**
```bash
# Pull image
docker pull your-dockerhub-username/reports-ui:latest

# Run container
docker run -d \
  --name nopadol-prod \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=https://api.your-domain.com \
  --restart unless-stopped \
  --memory="1g" \
  --cpus="1.0" \
  your-dockerhub-username/reports-ui:latest
```

---

### Docker Compose with Docker Hub

**`docker-compose.yml`:**

```yaml
version: '3.8'

services:
  nopadol-frontend:
    image: your-dockerhub-username/reports-ui:latest
    container_name: nopadol-helpdesk
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE=https://api.your-domain.com
    restart: unless-stopped
    networks:
      - nopadol-network

networks:
  nopadol-network:
    driver: bridge
```

**Start:**
```bash
docker-compose pull  # Pull latest image from Docker Hub
docker-compose up -d
```

---

### Security Best Practices

**⚠️ Important: Never commit Docker credentials to Git!**

**Option 1: Use Environment Variables**

```bash
# build-dev.sh
DOCKER_TOKEN="${DOCKER_HUB_TOKEN}"  # จาก environment variable
```

**Option 2: Use .env file (gitignored)**

```bash
# .docker.env (add to .gitignore)
DOCKER_USERNAME=your-username
DOCKER_TOKEN=your-token

# Load in script
source .docker.env
```

**Option 3: Use Docker Credential Helper**

```bash
# Install credential helper
brew install docker-credential-helper  # macOS
apt-get install pass                   # Linux

# Configure
docker login  # จะเก็บ credentials อัตโนมัติ
```

---

### Quick Reference

**Complete Deployment Flow:**

```bash
# Step 1: Prepare environment
cat > .env.development << EOF
NEXT_PUBLIC_API_BASE=http://localhost:8080
EOF

# Step 2: Make script executable
chmod +x build-dev.sh

# Step 3: Build & Push (one command)
./build-dev.sh

# Step 4: Deploy on server
ssh user@server
docker pull your-username/reports-ui:dev
docker run -d --name nopadol -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=http://api-server:8080 \
  your-username/reports-ui:dev
```

**Update Existing Deployment:**

```bash
# On server
docker pull your-username/reports-ui:latest  # Pull new image
docker stop nopadol-prod                      # Stop old container
docker rm nopadol-prod                        # Remove old container
docker run -d --name nopadol-prod -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=https://api.domain.com \
  --restart unless-stopped \
  your-username/reports-ui:latest             # Start new container
```

---

### Common Issues & Solutions

#### ❌ Build Failed: "Environment file not found"

**Problem:** `.env.development` ไม่มี

**Solution:**
```bash
# สร้างไฟล์ .env.development
echo "NEXT_PUBLIC_API_BASE=http://localhost:8080" > .env.development
```

#### ❌ Docker Login Failed

**Problem:** Access token ไม่ถูกต้อง

**Solution:**
1. ไปที่ Docker Hub → Account Settings → Security
2. สร้าง Access Token ใหม่
3. อัพเดท `DOCKER_TOKEN` ใน script

#### ❌ Push Failed: "denied: requested access to the resource is denied"

**Problem:** Repository name ผิด หรือไม่มีสิทธิ์

**Solution:**
```bash
# ตรวจสอบว่า IMAGE_NAME ตรงกับ Docker Hub username
IMAGE_NAME="your-exact-username/reports-ui"  # ต้องตรงกับ Docker Hub
```

#### ❌ Build Failed: "Cannot find module"

**Problem:** Dependencies ไม่ครบ

**Solution:**
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
./build-dev.sh
```

#### ⚠️ Image Size Too Large (>1GB)

**Solution:** ใช้ multi-stage build (ทำไว้แล้วใน Dockerfile)

```bash
# ตรวจสอบขนาด image
docker images your-username/reports-ui

# Expected size: ~400-600MB
```

---

### Docker Management Commands

```bash
# List containers
docker ps -a

# Stop container
docker stop nopadol-prod

# Start container
docker start nopadol-prod

# Restart container
docker restart nopadol-prod

# Remove container
docker rm nopadol-prod

# View logs
docker logs -f nopadol-prod

# Monitor resources
docker stats nopadol-prod

# Execute commands in container
docker exec -it nopadol-prod sh

# Inspect container
docker inspect nopadol-prod

# Clean up unused images
docker image prune -a
```

---

### Docker Hub Repository Information

**View Your Images:**

Visit: `https://hub.docker.com/r/your-username/reports-ui`

**Available Tags:**
```bash
# List all tags on Docker Hub
curl -s https://hub.docker.com/v2/repositories/your-username/reports-ui/tags/ | jq '.results[].name'

# Pull specific tag
docker pull your-username/reports-ui:dev
docker pull your-username/reports-ui:latest
docker pull your-username/reports-ui:0.1.9
```

**Image Information:**

| Tag | Purpose | Size | Dockerfile |
|-----|---------|------|------------|
| `dev` | Development builds | ~500MB | `Dockerfile.dev` |
| `latest` | Latest production | ~400MB | `Dockerfile` |
| `0.1.9` | Version-specific | ~400MB | `Dockerfile` |

**Check Image Details:**
```bash
# View image details locally
docker images your-username/reports-ui

# View image history (layers)
docker history your-username/reports-ui:latest

# Inspect image
docker inspect your-username/reports-ui:latest
```

---

## 📦 Build & Deployment Pipeline

### Manual Build Process

**Step 1: Build Application**
```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Build for production
npm run build

# Test production build locally
npm start
```

**Build outputs:**
- `.next/` - Next.js build output
- `.next/standalone/` - Standalone server files (for Docker)
- `.next/static/` - Static assets

**Step 2: Deploy to Server**
```bash
# Copy files to server
scp -r .next package.json server.js user@server:/app/

# SSH into server
ssh user@server

# Start application
cd /app
NODE_ENV=production node server.js
```

### CI/CD Pipeline Examples

#### GitHub Actions Workflow

**`.github/workflows/deploy.yml`:**

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_API_BASE: ${{ secrets.API_BASE_URL }}
    
    - name: Run tests (if any)
      run: npm test --if-present

  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=sha
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /app/nopadol-helpdesk
          docker-compose pull
          docker-compose up -d
          docker image prune -f
```

#### GitLab CI/CD

**`.gitlab-ci.yml`:**

```yaml
stages:
  - install
  - lint
  - build
  - docker
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/
    - .next/cache/

install:
  stage: install
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

lint:
  stage: lint
  image: node:${NODE_VERSION}-alpine
  dependencies:
    - install
  script:
    - npm run lint

build:
  stage: build
  image: node:${NODE_VERSION}-alpine
  dependencies:
    - install
  script:
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

docker-build:
  stage: docker
  image: docker:latest
  services:
    - docker:dind
  only:
    - main
    - tags
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA -t $DOCKER_IMAGE:latest .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
    - docker push $DOCKER_IMAGE:latest

deploy-production:
  stage: deploy
  image: alpine:latest
  only:
    - main
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - |
      ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << EOF
        cd /app/nopadol-helpdesk
        docker pull $DOCKER_IMAGE:latest
        docker-compose up -d
        docker image prune -f
      EOF
```

### Deployment Checklist

**Pre-deployment:**
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Database migrations completed (backend)
- [ ] SSL certificates ready (for production)
- [ ] Backup current version

**Deployment:**
- [ ] Build application
- [ ] Run tests
- [ ] Create Docker image
- [ ] Push to registry
- [ ] Deploy to server
- [ ] Health check

**Post-deployment:**
- [ ] Verify application is running
- [ ] Check logs for errors
- [ ] Test core functionality
- [ ] Monitor performance
- [ ] Update documentation

---

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run release` | Bump version and update CHANGELOG |

---

## ⚙️ Configuration

### Environment Variables

The application requires the following environment variable:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE` | Backend API base URL | Yes | `http://localhost:8080` |

### Next.js Configuration

The `next.config.ts` file contains:
- **Standalone Output**: For Docker deployment
- **Allowed Dev Origins**: CORS configuration for development

### TypeScript Configuration

The `tsconfig.json` uses:
- **Strict Mode**: Enabled for type safety
- **Path Aliases**: `@/*` maps to project root
- **Target**: ES2017

---

## 🏃 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 🏗️ Project Architecture

### High-Level Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │ ───▶ │  Next.js    │ ───▶ │  Backend    │
│  (Client)   │ ◀─── │  Frontend   │ ◀─── │     API     │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Folder Structure Overview

- **`app/`**: Next.js App Router pages with shared layouts, loading & error states
- **`components/`**: Reusable React components organized by feature
- **`types/`**: TypeScript type definitions for all entities
- **`hooks/`**: Custom React hooks & API integration layer
- **`lib/`**: Utility functions for charts and formatting
- **`public/`**: Static assets (logos, icons, fonts)

For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

### Architecture Highlights (v0.1.9)

- ✨ **Shared Layout**: Single layout component for all dashboard pages
- ⚡ **Loading States**: Instant navigation feedback with skeleton UI
- 🛡️ **Error Boundaries**: Graceful error handling with retry functionality
- 🔄 **API Hooks**: Centralized in `hooks/` directory with type safety
- 📱 **Mobile-First**: Responsive design throughout

### Design Patterns

1. **Component Composition**: Small, reusable components
2. **Custom Hooks**: Encapsulate data fetching and state logic
3. **Type Safety**: Full TypeScript coverage
4. **Separation of Concerns**: API, UI, and business logic separated
5. **File-based Routing**: Next.js App Router conventions

---

## 📖 Key Features Guide

### 1. Problem Reporting

**Location**: `/reports`

Users can report problems by:
1. Selecting branch and department
2. Selecting IP phone (or entering custom number)
3. Selecting system/program
4. Describing the problem
5. Attaching images (camera or gallery)
6. Submitting the report

**Key Components**:
- `components/reports/dialog-form.tsx`: Main reporting form
- `components/images/CameraButton.tsx`: Camera capture
- `components/images/ImageCompressor.tsx`: Image compression

### 2. Task Management

**Location**: `/tasks`

Features:
- View all tasks in paginated table with instant loading states
- Search by ticket number, reporter, or description (debounced)
- Filter by status (pending/in progress/done)
- Create new tasks with image upload
- Edit existing tasks
- Assign tasks to technicians with Telegram notifications
- Delete tasks with confirmation
- URL state management for pagination and filters

**Key Components**:
- `app/(dashboard)/tasks/page.tsx`: Task list page (content only)
- `app/(dashboard)/tasks/loading.tsx`: Loading skeleton UI
- `app/(dashboard)/tasks/error.tsx`: Error boundary with retry
- `components/tables/tasks-new-table.tsx`: Task data table
- `hooks/useTasks.ts`: Task API integration

### 3. Progress Tracking

**Location**: `/tasks/chat/[id]`

Features:
- Chat-like interface for documenting progress
- Add progress updates with images
- Edit and delete progress entries
- Admin and user views

**Key Components**:
- `components/chat/chat-admin.tsx`: Admin chat view
- `components/chat/chat-user.tsx`: User chat view
- `app/api/chat.ts`: Chat API integration

### 4. Solution Management

**Location**: Task detail pages

Features:
- Add solutions to resolved problems
- Attach images to solutions
- Edit existing solutions
- View solution history

**Key Components**:
- `app/api/solution.ts`: Solution API integration

### 5. Dashboard Analytics

**Location**: `/dashboard`

Features:
- Visual charts showing:
  - Problems by branch
  - Problems by department
  - Monthly trends
  - Yearly statistics
- Interactive chart filtering
- Year selector
- Auto-refresh every 3 minutes

**Key Components**:
- `app/(dashboard)/dashboard/page.tsx`: Dashboard page
- `components/dashboard/`: Chart components
- `lib/branch-chart-utils.ts`: Chart utilities

### 6. Asset Management

**Locations**: 
- `/branches` - Branch management
- `/department` - Department management
- `/phone` - IP Phone management
- `/program` - Program/System management
- `/type` - Problem Type management
- `/supervisor` - Supervisor assignments

Features:
- Create, read, update, delete (CRUD) operations
- Paginated data tables
- Search and filter
- Form validation

**Key Components**:
- `components/tables/`: Data table components
- `hooks/`: API integration hooks

### 7. Problem Type Management

**Location**: `/type` (Admin only)

Features:
- Create new problem types/categories
- Edit existing types
- Delete types
- View all types in searchable table
- Used for categorizing problems in task creation

**Key Components**:
- `app/(dashboard)/type/page.tsx`: Type list page (with loading & error states)
- `app/(dashboard)/type/create/page.tsx`: Create type form
- `app/(dashboard)/type/edit/[id]/page.tsx`: Edit type form
- `components/tables/type-table.tsx`: Type data table
- `hooks/useTypes.ts`: Type API integration
- `types/type/model.ts`: TypeData, AddType, UpdateType interfaces

**API Endpoints**:
- `GET /api/v1/program/type/list` - Get all types
- `GET /api/v1/program/type/list/:id` - Get type by ID
- `POST /api/v1/program/type/create` - Create new type
- `PUT /api/v1/program/type/update/:id` - Update type
- `DELETE /api/v1/program/type/delete/:id` - Delete type

### 8. User Management

**Location**: `/account` (Admin only)

Features:
- Create new users (admin or user role)
- Edit user details
- Delete users
- View all users

**Key Components**:
- `app/(dashboard)/account/page.tsx`: Account list
- `hooks/useAccount.ts`: Account API integration

---

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Always use TypeScript, no plain JavaScript
- **Naming**: 
  - Components: PascalCase or kebab-case (`TasksTable.tsx` or `tasks-table.tsx`)
  - Hooks: camelCase with 'use' prefix (`useAuth.ts`, `useTypes.ts`)
  - Utilities: kebab-case (`branch-chart-utils.ts`)
- **Imports**: Use path aliases (`@/` instead of `../../`)
- **Types**: Define types in `types/` directory

### Component Guidelines

1. **Keep components small**: Single responsibility principle
2. **Use TypeScript interfaces**: Strongly type all props
3. **Error handling**: Use `error.tsx` files for error boundaries
4. **Loading states**: Use `loading.tsx` files for instant feedback
5. **No layout duplication**: Pages should only contain content
6. **Accessibility**: Use semantic HTML and ARIA labels
7. **Responsive design**: Mobile-first approach

### API Integration Guidelines

1. **Use custom hooks**: Import from `hooks/` directory
2. **Type safety**: Use interfaces from `types/` directory
3. **Error handling**: Try-catch blocks with user-friendly messages
4. **Loading states**: Leverage Next.js loading.tsx
5. **Abort controllers**: Cancel in-flight requests when needed
6. **Pagination**: Use URL state management pattern

### Best Practices

```typescript
// ✅ Good: Type-safe component with error handling
import { TaskWithPhone } from '@/types/entities';

interface Props {
  task: TaskWithPhone;
  onUpdate: (id: number) => void;
}

export function TaskCard({ task, onUpdate }: Props) {
  // Component logic...
}

// ❌ Bad: No types, no error handling
export function TaskCard({ task, onUpdate }) {
  // Component logic...
}
```

### Testing

While this project doesn't include automated tests, manual testing should cover:
- ✅ All CRUD operations
- ✅ Image upload functionality
- ✅ Pagination and search
- ✅ Mobile responsiveness
- ✅ Authentication flows
- ✅ Role-based access control

---

## 🚢 Deployment

### Docker Deployment (Recommended)

#### Build Production Image

```bash
docker build -f Dockerfile -t nopadol-helpdesk:latest .
```

#### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=http://your-backend-api \
  --name nopadol-helpdesk \
  nopadol-helpdesk:latest
```

#### Using Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE=http://your-backend-api
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

### Traditional Deployment

#### 1. Build the Application

```bash
npm run build
```

#### 2. Start Production Server

```bash
npm start
```


### Environment Setup

Ensure these environment variables are set in production:

```bash
NEXT_PUBLIC_API_BASE=https://your-production-api.com
NODE_ENV=production
```

---

## 🤝 Contributing

### Version Management

This project uses `standard-version` for versioning:

```bash
# Bump version and generate changelog
npm run release
```

This will:
1. Bump version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Commit changes

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit pull request
6. Wait for review

---

## 📚 Additional Resources

### Documentation Files

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**: Detailed project structure
- **[CHANGELOG.md](./CHANGELOG.md)**: Version history and changes

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

## 🎯 Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env` file with `NEXT_PUBLIC_API_BASE`
- [ ] Run `npm run dev`
- [ ] Access `http://localhost:3000`
- [ ] Test login with credentials
- [ ] Verify backend connectivity

---

## 🎯 What's New in v0.1.9

### Architecture Improvements

- ✅ **Migrated API hooks** from `app/api/` to `hooks/` directory
- ✅ **Created shared layout** at `(dashboard)/layout.tsx`
- ✅ **Added loading states** to all major routes
- ✅ **Added error boundaries** to all major routes
- ✅ **Eliminated code duplication** - No more repeated Sidebar/Header code
- ✅ **Improved UX** with instant navigation feedback
- ✅ **Better error handling** with retry functionality

### New Features

- 🏷️ **Problem Type Management** - New `/type` route for managing problem categories
  - Full CRUD operations with dedicated pages
  - Search and filter functionality
  - Loading states and error boundaries
  - API integration via `hooks/useTypes.ts`

### Benefits

- 🚀 **Faster development** - Less boilerplate code
- 🎨 **Better UX** - Instant loading feedback
- 🛡️ **More robust** - Graceful error handling
- 📦 **Cleaner code** - Single source of truth for layouts
- 🔄 **Easier maintenance** - Update layout once, affects all pages

---

**Happy Coding! 🚀**

For detailed architectural information, please refer to [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).
