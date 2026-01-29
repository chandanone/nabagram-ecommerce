"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, getFabricLabel } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
    const [mounted, setMounted] = useState(false);

    // Handle hydration
    useState(() => {
        setMounted(true);
    });

    if (!mounted) {
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <ShoppingBag className="h-24 w-24 mx-auto text-[var(--warm-gray)] mb-6" />
                    <h1 className="text-2xl font-bold text-[var(--silk-indigo)] mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-[var(--muted)] mb-8 max-w-md">
                        Looks like you haven&apos;t added anything to your cart yet.
                        Explore our collections and find something you love.
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="gap-2">
                            Explore Collections
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)] mb-8"
                >
                    Shopping Cart
                </motion.h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-4 flex gap-4"
                            >
                                <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-[var(--deep-saffron)] font-medium uppercase tracking-wider mb-1">
                                                {getFabricLabel(item.fabricType)}
                                            </p>
                                            <h3 className="font-semibold text-[var(--silk-indigo)]">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="text-[var(--muted)] hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center glass rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="p-2 hover:bg-[var(--silk-indigo)]/10 transition-colors"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-4 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="p-2 hover:bg-[var(--silk-indigo)]/10 transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-[var(--silk-indigo)]">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-2xl p-6 sticky top-28"
                        >
                            <h2 className="text-xl font-bold text-[var(--silk-indigo)] mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[var(--muted)]">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-[var(--muted)]">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-[var(--muted)]">
                                    <span>Tax (GST 5%)</span>
                                    <span>{formatPrice(getTotalPrice() * 0.05)}</span>
                                </div>
                            </div>

                            <div className="border-t border-[var(--warm-gray)]/20 pt-4 mb-6">
                                <div className="flex justify-between text-lg font-bold text-[var(--silk-indigo)]">
                                    <span>Total</span>
                                    <span>{formatPrice(getTotalPrice() * 1.05)}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            <Link href="/products">
                                <Button variant="ghost" className="w-full mt-2">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
