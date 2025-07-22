import type React from "react";
import { BlurFade } from "@/components/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Image from 'next/image'
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return <div className="">{children}</div>
  return (
    <div className=" flex min-h-screen  flex-col items-center justify-center dark:bg-gray-900">
      <div className=" ">
        <BlurFade delay={0.3} inView>
          <h2 className=" text-center text-3xl font-bold sm:text-5xl xl:text-6xl/none">
          <div className="flex items-center justify-center gap-2 ">
            <Image src="/LOGO-NOPADOL.png" alt="logo" width={50} height={30}/>
             <TypingAnimation>นพดลพานิช</TypingAnimation>
          </div>
          </h2>
          {children}
        </BlurFade>
      </div>
    </div>
  );
}
