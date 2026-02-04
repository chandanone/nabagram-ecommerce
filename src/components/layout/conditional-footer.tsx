"use client";

import { usePathname } from "@/i18n/routing";
import { Footer } from "./footer";

export function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer on all admin pages
    const isAdminPage = pathname?.startsWith("/admin");

    if (isAdminPage) return null;

    return <Footer />;
}
