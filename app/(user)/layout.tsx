import type React from "react";
// import { BlurFade } from "@/components/magicui/blur-fade";
import { Toaster } from "react-hot-toast";
import { GridBeams } from "@/components/magicui/grid-beams";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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

      <GridBeams
        gridSize={0}
        gridColor="rgba(255, 255, 255, 0.2)"
        rayCount={20}
        rayOpacity={0.6}
        raySpeed={3}
        rayLength="100vh"
        gridFadeStart={5}
        gridFadeEnd={90}
        className="min-h-screen w-full"
      >
        <div className="items-center justify-center">
          <div className="space-y-6 px-4 mt-20">{children}</div>
        </div>
      </GridBeams>
      </>
  );
}
