"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-2">
                    <Languages className="h-4 w-4 text-[var(--deep-saffron)]" />
                    <span className="text-xs font-bold uppercase">{locale}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-[var(--glass-border)]">
                <DropdownMenuItem
                    onClick={() => toggleLocale("en")}
                    className={locale === "en" ? "bg-[var(--deep-saffron)]/10 text-[var(--deep-saffron)]" : ""}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => toggleLocale("bn")}
                    className={locale === "bn" ? "bg-[var(--deep-saffron)]/10 text-[var(--deep-saffron)]" : ""}
                >
                    বাংলা (Bengali)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
