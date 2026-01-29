"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useSearchParams, useRouter } from "next/navigation";

// Demo products
const demoProducts = [
    { id: "1", name: "Royal Muslin 100s Count", price: 12500, fabricType: "MUSLIN", fabricCount: 100, image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop", description: "Premium 100 count muslin fabric" },
    { id: "2", name: "Printed Silk Saree - Paisley", price: 18500, fabricType: "SILK_SAREE", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop", description: "Elegant printed silk saree" },
    { id: "3", name: "Heritage Muslin 80s", price: 9500, fabricType: "MUSLIN", fabricCount: 80, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop", description: "Traditional 80 count muslin" },
    { id: "4", name: "Artisan Silk Than", price: 22000, fabricType: "SILK_THAN", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop", description: "Premium silk than fabric" },
    { id: "5", name: "Classic White Muslin 60s", price: 7500, fabricType: "MUSLIN", fabricCount: 60, image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop", description: "Classic 60 count muslin" },
    { id: "6", name: "Bridal Silk Saree - Gold", price: 35000, fabricType: "SILK_SAREE", image: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&h=800&fit=crop", description: "Luxurious bridal silk saree" },
    { id: "7", name: "Festive Silk Saree - Red", price: 25000, fabricType: "SILK_SAREE", image: "https://images.unsplash.com/photo-1583391733975-9e4e8a4c0a28?w=600&h=800&fit=crop", description: "Festive collection silk" },
    { id: "8", name: "Pure Silk Than - Natural", price: 28000, fabricType: "SILK_THAN", image: "https://images.unsplash.com/photo-1617627143233-46df7b95c6ff?w=600&h=800&fit=crop", description: "Natural pure silk than" },
];

const fabricTypes = [
    { value: "", label: "All Types" },
    { value: "MUSLIN", label: "Cotton Muslin" },
    { value: "SILK_SAREE", label: "Silk Sarees" },
    { value: "SILK_THAN", label: "Silk Than" },
];

const fabricCounts = [
    { value: "", label: "All Counts" },
    { value: "60", label: "60s Count" },
    { value: "80", label: "80s Count" },
    { value: "100", label: "100s Count" },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const { addItem } = useCart();

    const typeFilter = searchParams.get("type") || "";
    const countFilter = searchParams.get("count") || "";

    const filteredProducts = demoProducts.filter((product) => {
        if (typeFilter && product.fabricType !== typeFilter) return false;
        if (countFilter && product.fabricCount !== parseInt(countFilter)) return false;
        return true;
    });

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    };

    const handleAddToCart = (product: typeof demoProducts[0]) => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            fabricType: product.fabricType,
            fabricCount: product.fabricCount,
        });
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-[var(--cream)] to-transparent">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--silk-indigo)] mb-4">
                            Our <span className="text-gradient">Collections</span>
                        </h1>
                        <p className="text-[var(--muted)] text-lg">
                            Explore our curated selection of premium handwoven textiles,
                            crafted by master artisans of Murshidabad.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Products */}
            <section className="section pt-0">
                <div className="container">
                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="gap-2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </Button>
                            <span className="text-[var(--muted)] text-sm">
                                {filteredProducts.length} products
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Grid className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <List className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass rounded-2xl p-6 mb-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                        Fabric Type
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => updateFilter("type", e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg border border-[var(--warm-gray)]/30 bg-white text-[var(--silk-indigo)] focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                                    >
                                        {fabricTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                        Thread Count
                                    </label>
                                    <select
                                        value={countFilter}
                                        onChange={(e) => updateFilter("count", e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg border border-[var(--warm-gray)]/30 bg-white text-[var(--silk-indigo)] focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                                    >
                                        {fabricCounts.map((count) => (
                                            <option key={count.value} value={count.value}>
                                                {count.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant="ghost"
                                        onClick={() => router.push("/products")}
                                        className="w-full"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                onAddToCart={() => handleAddToCart(product)}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Filter className="h-16 w-16 mx-auto text-[var(--warm-gray)] mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--silk-indigo)] mb-2">
                                No products found
                            </h3>
                            <p className="text-[var(--muted)] mb-6">
                                Try adjusting your filters to find what you&apos;re looking for.
                            </p>
                            <Button onClick={() => router.push("/products")}>
                                Clear Filters
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32">
                <div className="container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
