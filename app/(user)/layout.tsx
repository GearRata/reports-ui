import type React from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return <div className="">{children}</div>
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[url(/background.png)] bg-cover">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
      <div className="absolute top-6">
        <BlurFade delay={0.3} inView>
          <div className="flex items-center justify-center gap-2">
            <Image src="/LOGO-NOPADOL.png" alt="logo" width={50} height={50} style={{ width: "50px", height: "auto" }} />
            <TypingAnimation className="text-shadow-lg/20">
              นพดลพานิช
            </TypingAnimation>
          </div>
        </BlurFade>
      </div>
      <div>
        <BlurFade delay={0.3 * 2} inView>
          {children}
        </BlurFade>
      </div>
    </div>
  );
}
