import type React from "react"
export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // return <div className="">{children}</div>
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        {children}
      </div>
    )
}
