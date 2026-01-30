"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { register, login } from "@/actions/auth";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            if (isLogin) {
                const result = await login(formData);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Welcome back!");
                    onOpenChange(false);
                }
            } else {
                const result = await register(formData);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Account created successfully!");
                    onOpenChange(false);
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-none shadow-2xl overflow-hidden">
                <DialogHeader className="text-center space-y-2">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[var(--deep-saffron)] flex items-center justify-center text-white font-bold text-xl mb-2">
                        N
                    </div>
                    <DialogTitle className="text-2xl font-bold text-[var(--charcoal)]">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {isLogin
                            ? "Sign in to access your account and exclusive collections"
                            : "Join us and discover the heritage of Murshidabad"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="h-10 text-sm font-medium border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                            className="h-10 text-sm font-medium border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                            onClick={() => signIn("instagram", { callbackUrl: "/" })}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#C13584" strokeWidth="2" />
                                <circle cx="12" cy="12" r="4" stroke="#C13584" strokeWidth="2" />
                                <circle cx="18" cy="6" r="1.5" fill="#C13584" />
                            </svg>
                            Instagram
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-semibold">
                            <span className="bg-white px-2 text-[var(--muted)]">Or with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1.5"
                                >
                                    <Label htmlFor="modal-name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                                        <Input
                                            id="modal-name"
                                            name="name"
                                            placeholder="John Doe"
                                            required={!isLogin}
                                            className="pl-9 h-10 text-sm focus-visible:ring-[var(--deep-saffron)]"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="space-y-1.5">
                            <Label htmlFor="modal-email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                                <Input
                                    id="modal-email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="pl-9 h-10 text-sm focus-visible:ring-[var(--deep-saffron)]"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="modal-password">Password</Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                                <Input
                                    id="modal-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pl-9 pr-9 h-10 text-sm focus-visible:ring-[var(--deep-saffron)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-10 bg-[var(--charcoal)] hover:bg-[var(--charcoal)]/90 text-white font-medium text-sm transition-all active:scale-[0.98] mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                isLogin ? "Sign In" : "Create Account"
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center pt-2 italic">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-[var(--deep-saffron)] font-semibold hover:underline"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>

                <p className="text-center text-[10px] text-[var(--muted)] pt-2 border-t border-gray-50">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-[var(--deep-saffron)] hover:underline">
                        Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[var(--deep-saffron)] hover:underline">
                        Privacy
                    </a>
                </p>
            </DialogContent>
        </Dialog>
    );
}

