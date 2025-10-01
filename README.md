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
- 📈 **Analytics**: Detailed problem statistics by time, location, and system

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.4**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript 5**: Static type checking

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (via shadcn/ui)
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

### Charts & Visualization
- **MUI X-Charts**: Material-UI charting library
- **Recharts**: React charting library

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

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/GearRata/reports-ui.git
cd reports-ui
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`.

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# .env file
NEXT_PUBLIC_API_BASE=http://your-backend-api-url
```

Replace `http://your-backend-api-url` with your actual backend API URL.

**Example**:
```
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

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

### Using Docker

#### Development
```bash
docker build -f Dockerfile.dev -t nopadol-dev .
docker run -p 3000:3000 nopadol-dev
```

#### Production
```bash
docker build -f Dockerfile -t nopadol-prod .
docker run -p 3000:3000 nopadol-prod
```

---

## 🏗️ Project Architecture

### High-Level Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │ ───▶ │  Next.js    │ ───▶ │  Backend    │
│  (Client)   │ ◀─── │  Frontend   │ ◀─── │     API     │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Folder Structure Overview

- **`app/`**: Next.js App Router pages and API integration
- **`components/`**: Reusable React components
- **`types/`**: TypeScript type definitions
- **`hooks/`**: Custom React hooks
- **`lib/`**: Utility functions
- **`public/`**: Static assets

For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

### Design Patterns

1. **Component Composition**: Small, reusable components
2. **Custom Hooks**: Encapsulate data fetching and state logic
3. **Type Safety**: Full TypeScript coverage
4. **Separation of Concerns**: API, UI, and business logic separated
5. **File-based Routing**: Next.js App Router conventions

---

## 🔌 API Integration

### API Base URL

All API calls use the environment variable `NEXT_PUBLIC_API_BASE`:

```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/endpoint`
);
```

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/v1/problem/*` | Task/problem management |
| `/api/v1/department/*` | Department CRUD |
| `/api/v1/branch/*` | Branch CRUD |
| `/api/v1/program/*` | Program CRUD |
| `/api/v1/ipphone/*` | IP Phone CRUD |
| `/api/v1/respons/*` | Supervisor assignments |
| `/api/v1/resolution/*` | Solution management |
| `/api/v1/progress/*` | Task progress/chat |
| `/api/v1/dashboard/data` | Dashboard analytics |
| `/api/authEntry/login` | User authentication |
| `/api/authEntry/users` | User management |

### API Hooks

The `app/api/` directory contains custom hooks for each API:

```typescript
// Example: Using the tasks API
import { useTasksNewPaginated, addTaskNew } from '@/app/api/tasks';

function MyComponent() {
  const { tasks, loading, error, refreshTasks } = useTasksNewPaginated({
    page: 1,
    limit: 10
  });
  
  // Use tasks data...
}
```

### Data Fetching Pattern

1. **Custom Hook**: Encapsulates fetch logic
2. **Loading State**: Shows loading indicator
3. **Error Handling**: Displays error messages
4. **Type Safety**: Strongly typed responses

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. User enters credentials on login page (`/`)
2. `useAuth` hook sends credentials to backend API
3. Backend validates and returns user data
4. User data stored in localStorage and cookies
5. Middleware validates authentication on protected routes

### Role-Based Access Control

Two user roles are supported:

- **Admin**: Full access to all features
- **User**: Limited access (cannot manage master data)

### Protected Routes

The `middleware.ts` file protects routes:

```typescript
// Admin-only routes
const adminOnlyPaths = ["/account", "/dashboard"]

// All /dashboard/* routes require authentication
export const config = {
  matcher: ["/account", "/dashboard/:path*"],
}
```

### Implementation

```typescript
// hooks/use-auth.ts
export function useAuth() {
  const { user, login, logout } = useAuth();
  
  // Login
  await login(username, password);
  
  // Logout
  logout();
}
```

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
- View all tasks in paginated table
- Search by ticket number, reporter, or description
- Filter by status (pending/in progress/done)
- Create new tasks
- Edit existing tasks
- Assign tasks to technicians
- Delete tasks

**Key Components**:
- `app/(dashboard)/tasks/page.tsx`: Task list page
- `components/tables/TasksTable.tsx`: Task data table
- `app/api/tasks.ts`: Task API integration

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
- `/supervisor` - Supervisor assignments

Features:
- Create, read, update, delete (CRUD) operations
- Paginated data tables
- Search and filter
- Form validation

**Key Components**:
- `components/tables/`: Data table components
- `app/api/`: API integration hooks

### 7. User Management

**Location**: `/account` (Admin only)

Features:
- Create new users (admin or user role)
- Edit user details
- Delete users
- View all users

**Key Components**:
- `app/(dashboard)/account/page.tsx`: Account list
- `app/api/account.ts`: Account API integration

---

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Always use TypeScript, no plain JavaScript
- **Naming**: 
  - Components: PascalCase (`TasksTable.tsx`)
  - Hooks: camelCase with 'use' prefix (`useAuth.ts`)
  - Utilities: kebab-case (`branch-chart-utils.ts`)
- **Imports**: Use path aliases (`@/` instead of `../../`)
- **Types**: Define types in `types/` directory

### Component Guidelines

1. **Keep components small**: Single responsibility principle
2. **Use TypeScript interfaces**: Strongly type all props
3. **Error handling**: Always handle loading and error states
4. **Accessibility**: Use semantic HTML and ARIA labels
5. **Responsive design**: Mobile-first approach

### API Integration Guidelines

1. **Use custom hooks**: Don't call fetch directly in components
2. **Type safety**: Use interfaces from `types/` directory
3. **Error handling**: Try-catch blocks with user-friendly messages
4. **Loading states**: Show loading indicators
5. **Abort controllers**: Cancel in-flight requests when needed

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

#### 3. Using PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start npm --name "nopadol-helpdesk" -- start
pm2 save
pm2 startup
```

### Environment Setup

Ensure these environment variables are set in production:

```bash
NEXT_PUBLIC_API_BASE=https://your-production-api.com
NODE_ENV=production
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. API Connection Errors

**Problem**: "Failed to fetch" errors

**Solution**:
- Verify `NEXT_PUBLIC_API_BASE` is set correctly
- Check backend API is running
- Verify CORS settings on backend
- Check network connectivity

#### 2. Build Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Clean build cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 3. Authentication Issues

**Problem**: Login fails or redirects loop

**Solution**:
- Clear browser cookies and localStorage
- Verify backend authentication endpoint
- Check middleware configuration
- Verify user role is correct

#### 4. Image Upload Failures

**Problem**: Images don't upload

**Solution**:
- Check image size (compression may be needed)
- Verify FormData is being sent correctly
- Check backend file upload limits
- Verify MIME types are supported

#### 5. Development Server Issues

**Problem**: Changes not reflecting

**Solution**:
```bash
# Restart dev server
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Debug Mode

Enable detailed logging:

```typescript
// Add to component
console.log('Debug:', { data, error, loading });
```

Check browser console for:
- Network requests (Network tab)
- Console errors (Console tab)
- React components (React DevTools)

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
- [Radix UI Documentation](https://www.radix-ui.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

## 📞 Support

### Getting Help

If you encounter issues:

1. Check this README and PROJECT_STRUCTURE.md
2. Review the CHANGELOG for recent changes
3. Check existing issues on GitHub
4. Contact the development team

---

## 📄 License

This project is proprietary software developed for internal use.

---

## 👥 Team

**Project**: NOPADOL Helpdesk System  
**Repository**: GearRata/reports-ui  
**Version**: 0.1.9  
**Last Updated**: 2025-10-01

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

## 📊 Project Statistics

- **Lines of Code**: ~15,000+
- **Components**: 100+
- **Pages**: 25+
- **API Endpoints**: 12+
- **UI Components**: 53 (shadcn/ui)
- **Type Definitions**: 18+ modules

---

**Happy Coding! 🚀**

For detailed architectural information, please refer to [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).
