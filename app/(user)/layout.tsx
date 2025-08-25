import type React from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Toaster } from "react-hot-toast";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(30, 41, 59, 0.95)",
            color: "#f1f5f9",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "12px",
            backdropFilter: "blur(12px)",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "rgba(16, 185, 129, 0.95)",
              color: "#ffffff",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "rgba(239, 68, 68, 0.95)",
              color: "#ffffff",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            },
          },
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <BlurFade delay={0.2} inView>
            {children}
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
