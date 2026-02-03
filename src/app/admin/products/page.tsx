"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, getFabricLabel, getCountLabel, getOptimizedImageUrl } from "@/lib/utils";
import { getProducts, deleteProduct } from "@/actions/products";
import { ProductModal } from "@/components/admin/product-modal";
import { toast } from "sonner";
import { SafeProduct } from "@/lib/types";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<SafeProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<SafeProduct | null>(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleEdit = (product: SafeProduct) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setModalOpen(true);
    };

    const filteredProducts = products.filter((product) => {
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
                <Button className="gap-2 bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white" onClick={handleAdd}>
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
                                className="pl-10 h-11 focus-visible:ring-[var(--deep-saffron)]"
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
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[var(--deep-saffron)] mb-2" />
                                                <p className="text-sm text-[var(--muted)]">Loading products...</p>
                                            </td>
                                        </tr>
                                    ) : filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-[var(--muted)]">
                                                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                                No products found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <motion.tr
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="border-b border-[var(--warm-gray)]/10 last:border-0 hover:bg-[var(--cream)]/50 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                            {product.images?.[0] ? (
                                                                <Image
                                                                    src={getOptimizedImageUrl(product.images[0])}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[var(--warm-gray)]">
                                                                    <Package className="h-6 w-6" />
                                                                </div>
                                                            )}
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
                                                        <span className="text-[var(--warm-gray)] text-lg">☆</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(product)}
                                                            className="hover:bg-blue-50 hover:text-blue-600"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <ProductModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
}
