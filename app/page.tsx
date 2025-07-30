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
 * @author Kiro AI Assistant
 * @created 2025-01-24
 */

"use client"
import Image from 'next/image'

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex items-center justify-center gap-2">
              <Image src="/LOGO-NOPADOL.png" alt="Logo" width={40} height={30} />
              <h1 className='text-2xl font-bold text-blue-700'>NOPADOL</h1>
            </div>
          
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block"> 
        <Image
          src="/logo-img.jpg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[1.2] "
          style={{objectFit: 'cover'}}
        />
      </div>
    </div>
  )
}
