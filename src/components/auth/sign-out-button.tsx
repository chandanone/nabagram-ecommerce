"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
    className?: string;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "glass";
    size?: "default" | "sm" | "lg" | "xl" | "icon";
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function SignOutButton({
    className,
    variant = "ghost",
    size = "default",
    showIcon = true,
    children
}: SignOutButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={cn("gap-3", className)}
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            {showIcon && <LogOut className="h-4 w-4" />}
            {children || "Sign Out"}
        </Button>
    );
}
