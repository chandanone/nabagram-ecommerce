"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { formatPrice, getFabricLabel } from "@/lib/utils";

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    notes: {
        address: string;
    };
    theme: {
        color: string;
    };
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        setIsLoading(true);

        // In production, this would create an order and get Razorpay order ID
        // For demo, we'll simulate the payment flow
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
            amount: Math.round(total * 100),
            currency: "INR",
            name: "Nabagram Seva Sangha",
            description: "Handwoven Textile Purchase",
            image: "/logo.png",
            handler: function (response: RazorpayResponse) {
                // Payment successful
                setOrderSuccess(true);
                clearCart();
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            notes: {
                address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            },
            theme: {
                color: "#D35400",
            },
        };

        // Load Razorpay script if not loaded
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
                setIsLoading(false);
            };
            document.body.appendChild(script);
        } else {
            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setIsLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--silk-indigo)] mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-[var(--muted)] mb-8">
                        Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
                    </p>
                    <Link href="/products">
                        <Button size="lg">Continue Shopping</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--silk-indigo)] mb-4">
                        Your Cart is Empty
                    </h1>
                    <Link href="/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-8 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)] mb-8"
                >
                    Checkout
                </motion.h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass rounded-2xl p-6 mb-6">
                            <h2 className="text-xl font-bold text-[var(--silk-indigo)] mb-6 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-[var(--deep-saffron)]" />
                                Shipping Details
                            </h2>

                            <div className="grid gap-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                            Full Name *
                                        </label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                            Email Address *
                                        </label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                        Phone Number *
                                    </label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                        Street Address *
                                    </label>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="House no., Street name, Landmark"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                            City *
                                        </label>
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                            State *
                                        </label>
                                        <Input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="State"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--silk-indigo)] mb-2">
                                            Pincode *
                                        </label>
                                        <Input
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="742184"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Shield, label: "Secure Payment" },
                                { icon: Truck, label: "Free Shipping" },
                                { icon: CreditCard, label: "Easy Returns" },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="glass rounded-xl p-4 text-center"
                                >
                                    <Icon className="h-6 w-6 mx-auto mb-2 text-[var(--deep-saffron)]" />
                                    <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="glass rounded-2xl p-6 sticky top-28">
                            <h2 className="text-xl font-bold text-[var(--silk-indigo)] mb-6">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex gap-3">
                                        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-[var(--deep-saffron)] uppercase">
                                                {getFabricLabel(item.fabricType)}
                                            </p>
                                            <p className="font-medium text-[var(--silk-indigo)] text-sm truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-[var(--muted)]">Qty: {item.quantity}</p>
                                            <p className="font-semibold text-sm">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t border-[var(--warm-gray)]/20 pt-4 mb-6">
                                <div className="flex justify-between text-sm text-[var(--muted)]">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--muted)]">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--muted)]">
                                    <span>Tax (GST 5%)</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-[var(--silk-indigo)] pt-3 border-t border-[var(--warm-gray)]/20">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full gap-2"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={isLoading || !formData.name || !formData.email || !formData.phone || !formData.address}
                            >
                                <CreditCard className="h-5 w-5" />
                                {isLoading ? "Processing..." : "Pay with Razorpay"}
                            </Button>

                            <p className="text-xs text-center text-[var(--muted)] mt-4">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
