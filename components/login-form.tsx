import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  function setUserCookie(user: { username: string; role: string }) {
    // Set cookie for middleware (expires in 1 day)
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const user = await login(username, password)
    if (user) {
      setError("")
      setUserCookie(user)
      router.push("/dashboard")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Login
        </Button>
      </div>
    </form>
  )
}
