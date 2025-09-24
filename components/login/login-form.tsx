import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);

  function setUserCookie(user: { username: string; role: string }) {
    // Set cookie for middleware (expires in 1 day)
    document.cookie = `user=${encodeURIComponent(
      JSON.stringify(user)
    )}; path=/; max-age=86400`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const password = passwordRef.current?.value || "";
    const user = await login(username, password);
    if (user) {
      setError("");
      setUserCookie(user);
      // Clear password field for security
      if (passwordRef.current) {
        passwordRef.current.value = "";
      }
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
      // Clear password field on error for security
      if (passwordRef.current) {
        passwordRef.current.value = "";
      }
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
            ref={passwordRef}
            autoComplete="current-password"
            onCut={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            style={
              {
                WebkitTextSecurity: "disc",
                textSecurity: "disc",
              } as React.CSSProperties
            }
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer text-white">
          Login
        </Button>
      </div>
    </form>
  );
}
