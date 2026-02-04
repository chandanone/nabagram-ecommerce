"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the actual error to a logging service (like Sentry)
        console.error("Critical Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--cotton-white)] p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center space-y-8 glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
                {/* Background Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--deep-saffron)] to-[var(--silk-indigo)]" />

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-500 mb-4">
                    <AlertTriangle className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-[var(--silk-indigo)] tracking-tight">
                        Something went wrong
                    </h1>
                    <p className="text-[var(--muted)] text-sm leading-relaxed">
                        We encountered an unexpected error while processing your request.
                        Our master weavers are working to fix this thread.
                    </p>
                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-4 p-4 bg-red-50 rounded-xl text-left border border-red-100 overflow-auto max-h-40">
                            <p className="text-[10px] font-mono text-red-600 uppercase font-bold mb-1">Developer Notice (Dev Mode Only):</p>
                            <p className="text-xs font-mono text-red-700">{error.message}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => reset()}
                        className="w-full rounded-xl py-6 font-bold flex items-center justify-center gap-2 group"
                    >
                        <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </Button>

                    <Link href="/" className="w-full">
                        <Button
                            variant="outline"
                            className="w-full rounded-xl py-6 font-bold flex items-center justify-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <p className="text-[10px] text-[var(--muted)] font-medium">
                    Error Reference: <span className="font-mono">{error.digest?.slice(0, 8) || "N/A"}</span>
                </p>
            </motion.div>
        </div>
    );
}
