# 🏗️ NOPADOL Helpdesk System - โครงสร้างโปรเจค

## 📋 ภาพรวม
```
Next.js 15 + TypeScript + Tailwind CSS + Radix UI
Backend: REST API (helpdesk.nopadol.com)
Deployment: Docker Standalone
```

## 📁 โครงสร้างหลัก
```
project_test/
├── 📄 ไฟล์ Config
│   ├── package.json              # Dependencies
│   ├── next.config.ts            # Next.js config
│   ├── tsconfig.json             # TypeScript config
│   ├── middleware.ts             # Route protection
│   └── .env                      # Environment variables
├── 🐳 Docker
│   ├── Dockerfile                # Production
│   ├── Dockerfile.dev            # Development
│   ├── build-dev.sh             # Dev build
│   └── build-prod.sh            # Prod build
├── 📱 แอปพลิเคชัน
│   ├── app/                      # Next.js App Router
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilities
│   ├── types/                    # TypeScript types
│   ├── public/                   # Static files
│   └── script/                   # Build scripts
```

## 🎯 App Directory
```
app/
├── 🔐 Authentication
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Login page
│   └── globals.css              # Global styles
├── 👨💼 Admin Routes
│   └── (dashboard)/
│       ├── dashboard/page.tsx   # Analytics dashboard
│       ├── account/page.tsx     # User management
│       ├── branches/            # สาขา CRUD
│       ├── department/          # แผนก CRUD
│       ├── phone/               # IP Phone CRUD
│       ├── program/             # โปรแกรม CRUD
│       ├── supervisor/          # ผู้ดูแล CRUD
│       └── tasks/               # งาน CRUD
├── 👥 Public Routes
│   └── (user)/public/[branch]/[department]/page.tsx
└── 🔌 API Hooks
    └── api/
        ├── departments.ts       # Department hooks ⭐
        ├── branches.ts          # Branch hooks
        ├── dashboard.ts         # Dashboard hooks
        ├── phones.ts            # Phone hooks
        ├── programs.ts          # Program hooks
        ├── tasks.ts             # Task hooks
        └── ...
```

## 🧩 Components
```
components/
├── 📊 Dashboard
│   ├── dashboard/card/stats-card.tsx
│   └── dashboard/charts/        # Bar, Pie charts
├── 🎨 Layout
│   ├── layout/app-sidebar.tsx   # Navigation
│   ├── layout/site-header.tsx   # Header
│   └── layout/theme-provider.tsx # Dark/Light theme
├── 📄 Tables
│   ├── tables/departments-table.tsx
│   ├── tables/branches-table.tsx
│   ├── tables/tasks-new-table.tsx
│   └── ...
├── 📋 Pagination
│   ├── pagination/pagination-controls.tsx
│   ├── pagination/page-size-selector.tsx
│   └── ...
├── 📱 UI Components (shadcn/ui)
│   ├── ui/button.tsx
│   ├── ui/input.tsx
│   ├── ui/table.tsx
│   ├── ui/dialog.tsx
│   └── ... (25+ components)
├── 📝 Forms
│   ├── login-form.tsx
│   └── users/reports/dialog-form.tsx ⭐
├── 📸 Media
│   ├── camera.tsx
│   └── qrcode/DownloadQrPdfButton.tsx
```

## 🏷️ Types
```
types/
├── entities.ts                  # Core entities ⭐
├── department/model.ts          # Department types ⭐
├── pagination/model.ts          # Pagination types ⭐
├── branch/model.ts
├── phone/model.ts
├── program/model.ts
├── task/model.ts
├── user.ts
└── ...
```

## 🛠️ Utils & Hooks
```
lib/
├── utils.ts                     # General utilities
└── branch-chart-utils.ts        # Chart helpers

hooks/
└── use-auth.ts                  # Authentication

script/
└── update-version.js            # Version automation
```

## 🎨 Static Assets
```
public/
├── LOGO-NOPADOL.png             # Company logo
├── logo-img.jpg                 # Logo image
├── nopadol_logo.ico             # Favicon
├── fonts/NotoSansThai-Light.ttf # Thai font
└── *.svg                        # Icons
```

## 🔐 Security
```
middleware.ts
├── Role-based access control
├── Cookie-based sessions
├── Admin routes: /account, /dashboard/*
└── Public routes: /public/[branch]/[department]
```

## 📊 Key Features
- **Dashboard**: Real-time analytics, charts, filtering
- **CRUD**: Branches, Departments, IP Phones, Programs, Tasks
- **Problem Reporting**: Public form, camera, QR codes
- **UI/UX**: Responsive, Thai support, dark/light theme

## 🚀 Deployment
```
Docker: Standalone build
Environment: helpdesk.nopadol.com
Version: 0.1.9
```