"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    BarChart3,
    LogOut,
    ChevronLeft,
    Menu
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AdminSidebarProps {
    userRole: string;
}

const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const filteredItems = menuItems.filter(
        (item) => !item.adminOnly || userRole === "ADMIN"
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-24 left-4 z-40 glass rounded-xl p-3"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-20 left-0 h-[calc(100vh-5rem)] bg-white shadow-lg transition-all duration-300 z-50",
                    collapsed ? "w-20" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        {!collapsed && (
                            <h2 className="font-bold text-[var(--silk-indigo)]">Admin Panel</h2>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-2 hover:bg-[var(--cream)] rounded-lg transition-colors"
                        >
                            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {filteredItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                        isActive
                                            ? "bg-[var(--deep-saffron)] text-white"
                                            : "text-[var(--muted)] hover:bg-[var(--cream)] hover:text-[var(--silk-indigo)]"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="pt-4 border-t border-[var(--warm-gray)]/20">
                        <Link href="/" className="block mb-2">
                            <Button
                                variant="ghost"
                                className={cn("w-full justify-start gap-3", collapsed && "justify-center")}
                            >
                                <Package className="h-5 w-5" />
                                {!collapsed && "View Store"}
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => signOut()}
                            className={cn("w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50", collapsed && "justify-center")}
                        >
                            <LogOut className="h-5 w-5" />
                            {!collapsed && "Sign Out"}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
