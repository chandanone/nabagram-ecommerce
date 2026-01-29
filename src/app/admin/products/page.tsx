"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, getFabricLabel, getCountLabel } from "@/lib/utils";

// Demo products
const demoProducts = [
    { id: "1", name: "Royal Muslin 100s Count", price: 12500, fabricType: "MUSLIN", fabricCount: 100, stock: 5, image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop", featured: true },
    { id: "2", name: "Printed Silk Saree - Paisley", price: 18500, fabricType: "SILK_SAREE", stock: 3, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop", featured: true },
    { id: "3", name: "Heritage Muslin 80s", price: 9500, fabricType: "MUSLIN", fabricCount: 80, stock: 8, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200&h=200&fit=crop", featured: false },
    { id: "4", name: "Artisan Silk Than", price: 22000, fabricType: "SILK_THAN", stock: 4, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=200&fit=crop", featured: true },
    { id: "5", name: "Classic White Muslin 60s", price: 7500, fabricType: "MUSLIN", fabricCount: 60, stock: 12, image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=200&h=200&fit=crop", featured: false },
    { id: "6", name: "Bridal Silk Saree - Gold", price: 35000, fabricType: "SILK_SAREE", stock: 2, image: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=200&h=200&fit=crop", featured: true },
];

export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const filteredProducts = demoProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = !filter || product.fabricType === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-[var(--silk-indigo)] mb-2">
                        Products
                    </h1>
                    <p className="text-[var(--muted)]">
                        Manage your product inventory
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </motion.div>

            {/* Filters */}
            <Card className="glass">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                            <Input
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="h-11 px-4 rounded-lg border border-[var(--warm-gray)]/30 bg-white text-[var(--silk-indigo)] focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                        >
                            <option value="">All Types</option>
                            <option value="MUSLIN">Cotton Muslin</option>
                            <option value="SILK_SAREE">Silk Sarees</option>
                            <option value="SILK_THAN">Silk Than</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="glass">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--warm-gray)]/20">
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">Product</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">Type</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--muted)]">Price</th>
                                    <th className="text-center p-4 text-sm font-medium text-[var(--muted)]">Stock</th>
                                    <th className="text-center p-4 text-sm font-medium text-[var(--muted)]">Featured</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--muted)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-[var(--warm-gray)]/10 last:border-0 hover:bg-[var(--cream)]/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--silk-indigo)]">{product.name}</p>
                                                    {product.fabricCount && (
                                                        <p className="text-xs text-[var(--muted)]">{getCountLabel(product.fabricCount)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-[var(--cream)] text-[var(--silk-indigo)]">
                                                {getFabricLabel(product.fabricType)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium">{formatPrice(product.price)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${product.stock < 5 ? "bg-red-100 text-red-700" :
                                                    product.stock < 10 ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-green-100 text-green-700"
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {product.featured ? (
                                                <span className="text-[var(--deep-saffron)]">★</span>
                                            ) : (
                                                <span className="text-[var(--warm-gray)]">☆</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center">
                            <Package className="h-12 w-12 mx-auto text-[var(--warm-gray)] mb-4" />
                            <p className="text-[var(--muted)]">No products found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
