"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/login-modal";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useCart } from "@/lib/cart";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
    const t = useTranslations("Header");
    const locale = useLocale();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const { data: session } = useSession();
    const items = useCart((state) => state.items);

    const navLinks = [
        { href: "/", label: t("home") },
        { href: "/products", label: t("collections") },
        { href: "/about", label: t("ourHeritage") },
        { href: "/contact", label: t("contact") },
    ];

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        setCount(items.reduce((total, item) => total + item.quantity, 0));
    }, [items]);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass shadow-lg py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="container">
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-full bg-[var(--deep-saffron)] flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                N
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-[var(--silk-indigo)] leading-tight">
                                    {t("nabagram")}
                                </h1>
                                <p className="text-xs text-[var(--muted)] -mt-0.5">
                                    {t("sevaSangha")}
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href as any}
                                    className="text-[var(--silk-indigo)] font-medium relative group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--deep-saffron)] transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher />

                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                                <Search className="h-5 w-5" />
                                <span className="sr-only">{t("search")}</span>
                            </Button>

                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="sr-only">{t("cart")}</span>
                                    {mounted && count > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--deep-saffron)] text-white text-xs rounded-full flex items-center justify-center">
                                            {locale === 'bn' ? count.toLocaleString('bn-BD') : count}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {session ? (
                                <div className="flex items-center gap-2">
                                    <Link href="/account" className="hidden sm:block">
                                        <Button variant="glass" size="sm" className="gap-2">
                                            <User className="h-4 w-4" />
                                            {session.user?.name?.split(" ")[0]}
                                        </Button>
                                    </Link>
                                    <SignOutButton
                                        variant="ghost"
                                        size="icon"
                                        className="hidden sm:flex"
                                        showIcon={true}
                                    >
                                        <span className="sr-only">{t("signOut")}</span>
                                    </SignOutButton>
                                </div>
                            ) : (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="hidden sm:flex"
                                    onClick={() => setShowLogin(true)}
                                >
                                    {t("signIn")}
                                </Button>
                            )}

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </nav>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden glass-dark overflow-hidden"
                        >
                            <div className="container py-6 flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href as any}
                                        className="text-white font-medium text-lg py-2 border-b border-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {session ? (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link href="/account" onClick={() => setIsOpen(false)}>
                                            <Button variant="glass" className="w-full justify-start gap-3">
                                                <User className="h-4 w-4" />
                                                {t("myAccount")}
                                            </Button>
                                        </Link>
                                        <SignOutButton
                                            variant="ghost"
                                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        />
                                    </div>
                                ) : (
                                    <Button
                                        variant="default"
                                        className="mt-4"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setShowLogin(true);
                                        }}
                                    >
                                        {t("signIn")}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <LoginModal open={showLogin} onOpenChange={setShowLogin} />
        </>
    );
}

