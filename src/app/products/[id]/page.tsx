"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, getFabricLabel, getCountLabel } from "@/lib/utils";
import { toast } from "sonner";

// Demo product data
const demoProducts: Record<string, any> = {
    "1": { id: "1", name: "Royal Muslin 100s Count", price: 12500, fabricType: "MUSLIN", fabricCount: 100, images: ["https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=1000&fit=crop", "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800&h=1000&fit=crop"], description: "Experience the pinnacle of muslin craftsmanship with our Royal 100s Count collection. Each piece is meticulously handwoven by our master artisans, featuring an incredibly fine thread count that results in a fabric so light and translucent, it was once reserved for royalty. The natural breathability and soft drape make it perfect for elegant occasions.", stock: 5 },
    "2": { id: "2", name: "Printed Silk Saree - Paisley", price: 18500, fabricType: "SILK_SAREE", images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop", "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&h=1000&fit=crop"], description: "A masterpiece of traditional artistry, this printed silk saree features intricate paisley motifs inspired by Mughal heritage. The pure mulberry silk base provides a luxurious sheen, while the hand-printed patterns add depth and character. Perfect for weddings, festivals, and special celebrations.", stock: 3 },
    "3": { id: "3", name: "Heritage Muslin 80s", price: 9500, fabricType: "MUSLIN", fabricCount: 80, images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&h=1000&fit=crop"], description: "Our Heritage 80s Count muslin represents the perfect balance between tradition and everyday elegance. Crafted using time-honored techniques, this versatile fabric offers exceptional comfort while maintaining the classic muslin characteristics that have been celebrated for centuries.", stock: 8 },
    "4": { id: "4", name: "Artisan Silk Than", price: 22000, fabricType: "SILK_THAN", images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1000&fit=crop"], description: "Premium Artisan Silk Than represents the finest in silk fabric production. This uncut silk material allows you to create custom designs while ensuring the highest quality raw material. The natural luster and strength of our silk make it ideal for both traditional and contemporary garments.", stock: 4 },
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const { addItem } = useCart();

    const product = demoProducts[params.id as string];

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--silk-indigo)] mb-4">
                        Product Not Found
                    </h1>
                    <Button onClick={() => router.push("/products")}>
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            fabricType: product.fabricType,
            fabricCount: product.fabricCount,
        }, quantity);
        toast.success(`${product.name} added to cart`);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-8 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-4">
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-4">
                                {product.images.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? "border-[var(--deep-saffron)]"
                                            : "border-transparent hover:border-[var(--warm-gray)]"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[var(--deep-saffron)] font-medium tracking-wider uppercase text-sm mb-2">
                                    {getFabricLabel(product.fabricType)}
                                    {product.fabricCount && ` • ${getCountLabel(product.fabricCount)}`}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)] mb-4">
                                    {product.name}
                                </h1>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Heart className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <p className="text-4xl font-bold text-[var(--silk-indigo)] mb-6">
                            {formatPrice(product.price)}
                        </p>

                        <p className="text-[var(--muted)] leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-6">
                            {product.stock > 0 ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-green-600 text-sm font-medium">
                                        In Stock ({product.stock} available)
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-red-600 text-sm font-medium">
                                        Out of Stock
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-medium text-[var(--silk-indigo)]">Quantity:</span>
                            <div className="flex items-center glass rounded-xl">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-[var(--silk-indigo)]/10 rounded-l-xl transition-colors"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-6 font-medium min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-3 hover:bg-[var(--silk-indigo)]/10 rounded-r-xl transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                size="xl"
                                className="flex-1 gap-2"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || isAdded}
                            >
                                {isAdded ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            <Link href="/checkout">
                                <Button size="xl" variant="secondary">
                                    Buy Now
                                </Button>
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="mt-12 grid grid-cols-2 gap-6">
                            {[
                                { label: "Handwoven", value: "100% Artisan Made" },
                                { label: "Material", value: getFabricLabel(product.fabricType) },
                                { label: "Origin", value: "Murshidabad, WB" },
                                { label: "KVIC Certified", value: "Government Approved" },
                            ].map((feature) => (
                                <div key={feature.label} className="glass rounded-xl p-4">
                                    <p className="text-sm text-[var(--muted)]">{feature.label}</p>
                                    <p className="font-medium text-[var(--silk-indigo)]">{feature.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
