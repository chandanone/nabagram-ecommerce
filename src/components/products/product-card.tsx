"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getFabricLabel, getCountLabel, getOptimizedImageUrl } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface ProductCardProps {
    id: string;
    name: string;
    price: number | string;
    fabricType: string;
    fabricCount?: number | null;
    image: string;
    onAddToCart?: () => void;
}

export function ProductCard({
    id,
    name,
    price,
    fabricType,
    fabricCount,
    image,
    onAddToCart,
}: ProductCardProps) {
    const t = useTranslations("Common");
    const locale = useLocale();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group"
        >
            <div className="glass rounded-2xl overflow-hidden group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                        src={getOptimizedImageUrl(image)}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--silk-indigo)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick actions */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/products/${id}` as any} className="flex-1">
                            <Button variant="glass" className="w-full gap-2">
                                <Eye className="h-4 w-4" />
                                {t("view")}
                            </Button>
                        </Link>
                        <Button
                            variant="default"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart?.();
                            }}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Badge */}
                    {fabricCount && (
                        <div className="absolute top-4 left-4 glass-saffron rounded-full px-3 py-1 text-xs font-medium">
                            {getCountLabel(fabricCount)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-xs text-[var(--deep-saffron)] font-medium uppercase tracking-wider mb-1">
                        {getFabricLabel(fabricType)}
                    </p>
                    <h3 className="font-semibold text-[var(--silk-indigo)] text-lg mb-2 line-clamp-1 group-hover:text-[var(--deep-saffron)] transition-colors">
                        {name}
                    </h3>
                    <p className="text-xl font-bold text-[var(--silk-indigo)]">
                        {formatPrice(price, locale === 'bn' ? 'bn-IN' : 'en-IN')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// Skeleton for loading state
export function ProductCardSkeleton() {
    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="aspect-[3/4] bg-[var(--warm-gray)]/20 animate-shimmer" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-[var(--warm-gray)]/20 rounded animate-shimmer" />
                <div className="h-5 w-3/4 bg-[var(--warm-gray)]/20 rounded animate-shimmer" />
                <div className="h-6 w-24 bg-[var(--warm-gray)]/20 rounded animate-shimmer" />
            </div>
        </div>
    );
}

