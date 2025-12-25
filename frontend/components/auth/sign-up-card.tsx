"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { Chrome } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignUpCard() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await authClient.signUp.email({ email, password, name })
      if (!result.error) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await authClient.signIn.social({ provider: "google" })
    } catch (error) {
      console.error("Google sign in error:", error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-serif font-bold text-foreground">{"Create an account"}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {"Get started with EthioGov legal research"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              {"Full Name"}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              {"Email"}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              {"Password"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="bg-background"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{"Or continue with"}</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-border hover:bg-secondary bg-transparent"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          {"Continue with Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          {"Already have an account? "}
          <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
            {"Sign in"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
