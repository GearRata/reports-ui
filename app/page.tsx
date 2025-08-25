/**
 * Login Page Component (Root Page)
 *
 * This is the main login page that serves as the entry point to the application.
 * Features include:
 *
 * - Two-column layout (form + image)
 * - FixTrack branding with logo
 * - LoginForm component integration
 * - Responsive design (mobile-first)
 * - Background image on desktop
 * - Dark mode support
 *
 * Route: / (root)
 * Access: Public (no authentication required)
 *
 */

"use client";
import Image from "next/image";

import { LoginForm } from "@/components/login-form";
import Version from "@/components/Version";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/logo-img.jpg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[1.2] "
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-center">
          <a
            href=""
            className="flex items-center gap-2 font-medium"
          >
            <div className="text-primary-foreground flex items-center justify-center gap-2">
              <Image
                src="/LOGO-NOPADOL.png"
                alt="Logo"
                width={45}
                height={40}
                className="drop-shadow-lg drop-shadow-blue-600"
              />
              <h1 className="text-4xl font-bold text-blue-700 drop-shadow-lg drop-shadow-blue-600">
                NOPADOL
              </h1>
            </div>
          </a>
        </div>
        {/* Login Form user and password */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
          <div className="flex flex-col mt-3 text-gray-500">
            <Version />
          </div>
        </div>
      </div>
    </div>
  );
}
