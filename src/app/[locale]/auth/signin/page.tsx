"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { register, getUserRole } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            if (isLogin) {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (result?.error) {
                    toast.error("Invalid email or password")
                } else {
                    toast.success("Welcome back!")
                    const role = await getUserRole(email);
                    if (role === "ADMIN" || role === "SALESPERSON") {
                        window.location.href = "/admin"
                    } else {
                        window.location.href = "/"
                    }
                }
            } else {
                const result = await register(formData)
                if (result?.error) {
                    toast.error(result.error)
                } else {
                    toast.success("Account created successfully!")
                    // Automatically log in after registration
                    const loginResult = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    })
                    if (loginResult?.error) {
                        router.push("/")
                    } else {
                        window.location.href = "/"
                    }
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--deep-saffron)] flex items-center justify-center text-white font-bold text-2xl mb-4">
                            N
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-[var(--charcoal)]">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {isLogin
                                ? "Enter your email to sign in to your account"
                                : "Join Nabagram-Ecomm and start shopping"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                                className="h-11 font-medium border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => signIn("instagram", { callbackUrl: "/" })}
                                className="h-11 font-medium border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#C13584" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" stroke="#C13584" strokeWidth="2" />
                                    <circle cx="18" cy="6" r="1.5" fill="#C13584" />
                                </svg>
                                Instagram
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-[var(--muted)]">Or continue with</span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                required={!isLogin}
                                                className="pl-10 h-11 focus-visible:ring-[var(--deep-saffron)]"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        className="pl-10 h-11 focus-visible:ring-[var(--deep-saffron)]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {isLogin && (
                                        <Button variant="link" className="px-0 font-normal text-xs text-[var(--deep-saffron)]">
                                            Forgot password?
                                        </Button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pl-10 pr-10 h-11 focus-visible:ring-[var(--deep-saffron)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-[var(--charcoal)] hover:bg-[var(--charcoal)]/90 text-white font-medium text-base transition-all active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    isLogin ? "Sign In" : "Create Account"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-center w-full text-sm text-[var(--muted)]">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-[var(--deep-saffron)] font-semibold hover:underline"
                            >
                                {isLogin ? "Sign up" : "Log in"}
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
