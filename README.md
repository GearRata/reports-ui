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
- [Key Features Guide](#key-features-guide)
- [Deployment](#deployment)
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
- 👤 **User Management**: Create and manage user accounts
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

**OR:**
```yaml
services:
  frontend-dev:
    image: your-dockerhub-username/reports-ui:dev
    container_name: nopadol-helpdesk
    environment:
      - NODE_ENV=development
      - HOSTNAME=0.0.0.0
    ports:
      - "3000:3000"
    networks:
      - api-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy: 
      resources:
        limits:
          memory: 384m
        reservations:
          memory: 256M

networks:
  api-network:
    driver: bridge
```

**Start:**
```bash
docker-compose pull  # Pull latest image from Docker Hub
docker-compose up -d
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

**Location**: `/type` 

Features:
- Create new problem types/categories
- Edit existing types
- Delete types
- View all types in searchable table
- Used for categorizing problems in task creation

### Testing

While this project doesn't include automated tests, manual testing should cover:
- ✅ All CRUD operations
- ✅ Image upload functionality
- ✅ Pagination and search
- ✅ Mobile responsiveness
- ✅ Authentication flows

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
