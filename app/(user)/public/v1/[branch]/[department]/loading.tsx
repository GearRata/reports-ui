import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <span className="text-base text-muted-foreground">กำลังโหลดข้อมูล...</span>
            </div>
        </div>
    )
}
