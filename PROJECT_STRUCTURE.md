# PROJECT STRUCTURE

## Overview
This document provides a comprehensive overview of the NOPADOL Helpdesk System's project structure, detailing the purpose and organization of each directory and key files.

---

## Directory Structure

```
project_test/
├── .next/                      # Next.js build output (auto-generated)
├── .vscode/                    # VS Code workspace settings
├── app/                        # Next.js App Router pages and API integration
│   ├── (dashboard)/           # Protected dashboard routes group
│   │   ├── account/           # User account management pages
│   │   │   ├── create/        # Create new user page
│   │   │   ├── edit/[id]/     # Edit user by ID page
│   │   │   └── page.tsx       # Account list page
│   │   ├── branches/          # Branch management pages
│   │   │   ├── create/        # Create branch page
│   │   │   ├── edit/[id]/     # Edit branch by ID page
│   │   │   └── page.tsx       # Branches list page
│   │   ├── dashboard/         # Dashboard analytics page
│   │   │   └── page.tsx       # Main dashboard view
│   │   ├── department/        # Department management pages
│   │   │   ├── create/        # Create department page
│   │   │   ├── edit/[id]/     # Edit department by ID page
│   │   │   └── page.tsx       # Departments list page
│   │   ├── phone/             # IP Phone management pages
│   │   │   ├── create/        # Create IP phone entry page
│   │   │   ├── edit/[id]/     # Edit IP phone by ID page
│   │   │   └── page.tsx       # IP phones list page
│   │   ├── program/           # Program/System management pages
│   │   │   ├── create/        # Create program page
│   │   │   ├── edit/[id]/     # Edit program by ID page
│   │   │   └── page.tsx       # Programs list page
│   │   ├── supervisor/        # Supervisor assignment pages
│   │   │   ├── create/        # Assign new supervisor page
│   │   │   ├── edit/[id]/     # Edit assignment by ID page
│   │   │   └── page.tsx       # Supervisors list page
│   │   └── tasks/             # Task/Problem management pages
│   │       ├── chat/          # Task chat/progress tracking
│   │       │   ├── admin/[id]/    # Admin chat view
│   │       │   └── user/[id]/     # User chat view
│   │       ├── create/        # Create new task page
│   │       ├── edit/[id]/     # Edit task by ID page
│   │       ├── show/[id]/     # View task details page
│   │       └── page.tsx       # Tasks list page
│   ├── (user)/                # User-specific routes group
│   │   ├── reports/           # Public reporting interface
│   │   └── success/           # Success confirmation pages
│   ├── api/                   # API integration layer (client-side hooks)
│   │   ├── account.ts         # User account management API
│   │   ├── assign.ts          # Supervisor assignment API
│   │   ├── branches.ts        # Branch CRUD API
│   │   ├── chat.ts            # Task progress/chat API
│   │   ├── dashboard.ts       # Dashboard analytics API
│   │   ├── departments.ts     # Department CRUD API
│   │   ├── phones.ts          # IP Phone CRUD API
│   │   ├── programs.ts        # Program CRUD API
│   │   ├── qr-pdf.ts          # QR code PDF generation API
│   │   ├── solution.ts        # Solution management API
│   │   ├── tasks.ts           # Task/Problem management API
│   │   └── type.ts            # Problem type API
│   ├── globals.css            # Global CSS with Tailwind + custom variables
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Login page (root route)
│
├── components/                # Reusable React components
│   ├── chat/                  # Chat/Progress tracking components
│   │   ├── chat-admin.tsx     # Admin chat interface
│   │   └── chat-user.tsx      # User chat interface
│   ├── dashboard/             # Dashboard visualization components
│   │   ├── branch-chart.tsx   # Branch statistics chart
│   │   ├── department-chart.tsx # Department statistics chart
│   │   ├── month-chart.tsx    # Monthly statistics chart
│   │   ├── stats-card.tsx     # Statistics cards
│   │   ├── year-chart.tsx     # Yearly statistics chart
│   │   └── year-selector.tsx  # Year selection dropdown
│   ├── downloadfile/          # File download utilities
│   ├── error-boundary/        # Error boundary components
│   ├── images/                # Image handling components
│   │   ├── CameraButton.tsx   # Camera capture button
│   │   ├── GalleryButton.tsx  # Gallery picker button
│   │   ├── ImageCompressor.tsx # Image compression utility
│   │   ├── ImageList.tsx      # Image list display
│   │   └── ShowImages.tsx     # Image viewer
│   ├── layout/                # Layout components
│   │   ├── app-sidebar.tsx    # Application sidebar navigation
│   │   ├── navbar.tsx         # Navigation bar
│   │   ├── site-header.tsx    # Site header
│   │   └── theme-provider.tsx # Dark mode theme provider
│   ├── login/                 # Authentication components
│   │   └── login-form.tsx     # Login form
│   ├── magicui/               # Magic UI components
│   ├── modetoggle/            # Dark mode toggle
│   ├── nav/                   # Navigation components
│   │   ├── nav-main.tsx       # Main navigation
│   │   └── nav-user.tsx       # User navigation
│   ├── pagination/            # Pagination components
│   │   ├── DataPagination.tsx # Data table pagination
│   │   ├── Pagination.tsx     # Generic pagination
│   │   └── SearchBar.tsx      # Search bar with debounce
│   ├── qrcode/                # QR code components
│   │   ├── GenerateQRCodePDF.tsx # QR code PDF generator
│   │   └── QRCodeGenerator.tsx   # QR code generator
│   ├── reports/               # Problem reporting components
│   │   ├── dialog-form.tsx    # Report submission form
│   │   └── success.tsx        # Success notification
│   ├── tables/                # Data table components
│   │   ├── AccountsTable.tsx  # Accounts data table
│   │   ├── BranchesTable.tsx  # Branches data table
│   │   ├── DepartmentsTable.tsx # Departments data table
│   │   ├── IPPhonesTable.tsx  # IP Phones data table
│   │   ├── ProgramsTable.tsx  # Programs data table
│   │   └── TasksTable.tsx     # Tasks data table
│   ├── ui/                    # shadcn/ui components (53 components)
│   │   ├── accordion.tsx      # Accordion component
│   │   ├── alert.tsx          # Alert component
│   │   ├── badge.tsx          # Badge component
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── dialog.tsx         # Dialog modal component
│   │   ├── input.tsx          # Input component
│   │   ├── select.tsx         # Select dropdown component
│   │   ├── table.tsx          # Table component
│   │   └── ...                # And 44 more UI primitives
│   ├── user/                  # User-specific components
│   └── version/               # Version display component
│
├── hooks/                     # Custom React hooks
│   └── use-auth.ts           # Authentication hook
│
├── lib/                       # Utility functions
│   ├── branch-chart-utils.ts # Chart utility functions
│   └── utils.ts              # General utilities (cn, formatters)
│
├── public/                    # Static assets
│   ├── fonts/                # Custom fonts
│   ├── LOGO-NOPADOL.png      # Application logo
│   ├── logo-img.jpg          # Login page background
│   ├── nopadol_logo.ico      # Favicon
│   ├── background.png        # Background images
│   └── correct.png           # Success icons
│
├── script/                    # Build and deployment scripts
│   └── update-version.js     # Version update script
│
├── types/                     # TypeScript type definitions
│   ├── account/              # Account/User types
│   │   └── model.ts
│   ├── assignto/             # Assignment types
│   │   └── model.ts
│   ├── branch/               # Branch types
│   │   └── model.ts
│   ├── chat/                 # Chat/Progress types
│   │   └── model.ts
│   ├── dashboard/            # Dashboard data types
│   │   └── model.ts
│   ├── department/           # Department types
│   │   └── model.ts
│   ├── pagination/           # Pagination types
│   │   └── model.ts
│   ├── phone/                # IP Phone types
│   │   └── model.ts
│   ├── program/              # Program types
│   │   └── model.ts
│   ├── qr-code/              # QR code types
│   │   └── model.ts
│   ├── report/               # Report types
│   │   └── model.ts
│   ├── solution/             # Solution types
│   │   └── model.ts
│   ├── task/                 # Task types
│   │   └── model.ts
│   ├── taskstate/            # Task state types
│   │   └── model.ts
│   ├── type/                 # Problem type types
│   │   └── model.ts
│   ├── entities.ts           # Core entity interfaces
│   ├── pagination.ts         # Pagination interfaces
│   └── user.ts               # User interface
│
├── .dockerignore             # Docker ignore file
├── .env                      # Environment variables (gitignored)
├── .env.development          # Development environment variables
├── .gitignore                # Git ignore rules
├── CHANGELOG.md              # Version changelog
├── Dockerfile                # Production Docker configuration
├── Dockerfile.dev            # Development Docker configuration
├── build-dev.sh              # Development build script
├── build-prod.sh             # Production build script
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint configuration
├── middleware.ts             # Next.js middleware (auth & routing)
├── next.config.ts            # Next.js configuration
├── package.json              # NPM dependencies and scripts
├── package-lock.json         # NPM lockfile
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── version.json              # Current version info
```

---

## Key Architectural Patterns

### 1. App Router Structure
- **Route Groups**: `(dashboard)` and `(user)` for logical grouping without affecting URL structure
- **Dynamic Routes**: `[id]` folders for parameterized routes (e.g., `/edit/[id]`)
- **Nested Layouts**: Shared layouts within route groups
- **File-based Routing**: Automatic routing based on folder structure

### 2. API Layer (`app/api/`)
- **Client-side Integration**: Not server API routes, but client-side fetch hooks
- **Custom Hooks**: Each file exports custom React hooks and API functions
- **Consistent Pattern**: All use `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/` base URL
- **Type Safety**: Strongly typed with TypeScript interfaces

### 3. Component Organization
- **Feature-based**: Components grouped by feature (dashboard, tables, reports)
- **UI Primitives**: shadcn/ui components in `components/ui/`
- **Composition**: Higher-level components compose UI primitives
- **Reusability**: Designed for maximum reusability

### 4. Type System
- **Modular Types**: Organized by domain (task, user, pagination, etc.)
- **Model Files**: Each domain has a `model.ts` file
- **Shared Entities**: Common entities in `types/entities.ts`
- **Type Inference**: Proper TypeScript type inference throughout

### 5. State Management
- **React Hooks**: useState, useEffect for local state
- **Custom Hooks**: Encapsulate data fetching logic
- **URL State**: Pagination and filters stored in URL parameters
- **Local Storage**: Auth state persisted in localStorage

---

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **Components**: PascalCase (e.g., `DataPagination.tsx`)
- **Utilities**: kebab-case (e.g., `use-auth.ts`)
- **Types**: `model.ts` for type definitions
- **API Files**: kebab-case (e.g., `tasks.ts`)

---

## Important Configuration Files

### `next.config.ts`
- Standalone output for Docker deployment
- Development CORS origins
- TypeScript configuration

### `middleware.ts`
- Authentication middleware
- Role-based route protection
- Cookie-based session management
- Redirects for unauthorized access

### `tsconfig.json`
- Strict TypeScript mode enabled
- Path aliases: `@/*` maps to project root
- ES2017 target
- Incremental compilation

### `package.json`
- Next.js 15.3.4 with React 19
- Tailwind CSS 4
- Radix UI components
- MUI X-Charts and Recharts
- Standard-version for release management

### `Dockerfile` & `Dockerfile.dev`
- Multi-stage build for production
- Node.js 18 Alpine base
- Standalone Next.js output
- Development hot-reload support

---

## Data Flow

1. **User Action** → Component
2. **Component** → API Hook (`app/api/*.ts`)
3. **API Hook** → Backend REST API (via fetch)
4. **Response** → Type-safe parsing
5. **State Update** → Component re-render
6. **UI Update** → User sees result

---

## Build & Deployment

### Development
```bash
npm run dev          # Start dev server with Turbopack
```

### Production
```bash
npm run build        # Create production build
npm start            # Start production server
```

### Docker
```bash
docker build -f Dockerfile -t nopadol-helpdesk .
docker run -p 3000:3000 nopadol-helpdesk
```

### Versioning
```bash
npm run release      # Bump version, update CHANGELOG, tag commit
```

---

## Environment Variables

Required environment variables (stored in `.env`):

```env
NEXT_PUBLIC_API_BASE=http://your-backend-url
```

This variable defines the backend API base URL that all API calls connect to.

---

## Route Protection

The `middleware.ts` file implements authentication:

- **Public Routes**: `/` (login page), `/reports/*` (public reporting)
- **Protected Routes**: All `/dashboard/*` routes require authentication
- **Admin-only Routes**: `/account/*` requires admin role
- **Redirect Logic**: Unauthenticated users redirected to login

---

## Page Routes Reference

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Login page | No |
| `/dashboard` | Analytics dashboard | Yes (Admin) |
| `/tasks` | Task list & management | Yes |
| `/tasks/create` | Create new task | Yes |
| `/tasks/edit/[id]` | Edit task | Yes |
| `/tasks/show/[id]` | View task details | Yes |
| `/tasks/chat/admin/[id]` | Admin chat view | Yes (Admin) |
| `/branches` | Branch management | Yes (Admin) |
| `/department` | Department management | Yes (Admin) |
| `/phone` | IP Phone management | Yes (Admin) |
| `/program` | Program management | Yes (Admin) |
| `/supervisor` | Supervisor assignments | Yes (Admin) |
| `/account` | User account management | Yes (Admin) |
| `/reports` | Public problem reporting | No |

---

## Technology Stack Summary

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI (via shadcn/ui)
- **Charts**: MUI X-Charts, Recharts
- **State**: React Hooks
- **Forms**: React Hook Form
- **HTTP Client**: Fetch API
- **Build Tool**: Turbopack (dev), Webpack (prod)
- **Package Manager**: npm
- **Containerization**: Docker
- **Versioning**: Standard-version

---

## Notes for Developers

1. **Always use type-safe API calls** - Import types from `types/` directory
2. **Follow naming conventions** - Consistency is key
3. **Use existing hooks** - Check `app/api/` before creating new API calls
4. **Reuse UI components** - Check `components/ui/` for primitives
5. **Maintain pagination pattern** - Follow existing pagination implementation
6. **Handle errors gracefully** - Use try-catch and display user-friendly messages
7. **Test on mobile** - Responsive design is crucial
8. **Update CHANGELOG** - Document all changes
9. **Use environment variables** - Never hardcode API URLs
10. **Follow middleware rules** - Respect authentication and authorization

---

*Last Updated: 2025-10-01*
*Version: 0.1.9*
