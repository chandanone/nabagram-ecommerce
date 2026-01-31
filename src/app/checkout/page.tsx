"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { formatPrice, getFabricLabel } from "@/lib/utils";
import { createOrder, verifyPayment } from "@/actions/orders";
import { toast } from "sonner";

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
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    notes: {
        orderId: string;
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

    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [items]);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            // 1. Create order in DB and get Razorpay Order ID
            const orderItems = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const result = await createOrder({
                items: orderItems,
                shipping: formData
            });

            if (!result.success || !result.data) {
                toast.error(result.error || "Failed to initiate checkout");
                return;
            }

            const { orderId, razorpayOrderId, amount, currency } = result.data;

            // 2. Open Razorpay checkout
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
                amount: amount as number,
                currency: currency,
                name: "Nabagram Seva Sangha",
                description: "Handwoven Textile Purchase",
                image: "/logo.png",
                order_id: razorpayOrderId,
                handler: async function (response: RazorpayResponse) {
                    try {
                        setIsLoading(true);
                        // 3. Verify payment on server
                        const verifyResult = await verifyPayment(orderId, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (!verifyResult.success) {
                            toast.error(verifyResult.error || "Payment verification failed");
                            return;
                        }

                        // 4. Cleanup and redirect
                        clearCart();
                        toast.success("Payment successful!");
                        router.push(`/account/orders/${orderId}`);
                    } catch (error: any) {
                        console.error("Payment verification failed:", error);
                        toast.error(error.message || "Payment verification failed");
                    } finally {
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    orderId: orderId,
                    address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                },
                theme: {
                    color: "#D35400",
                },
            };

            const loadRazorpay = () => {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Failed to load Razorpay. Please check your connection.");
                return;
            }

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            console.error("Checkout failed:", error);
            toast.error(error.message || "Failed to initiate checkout");
        } finally {
            setIsLoading(false);
        }
    };

    const [showMobileSummary, setShowMobileSummary] = useState(false);

    if (orderSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md glass p-8 rounded-3xl"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--silk-indigo)] mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-[var(--muted)] mb-8">
                        Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
                    </p>
                    <Link href="/products" className="block">
                        <Button size="lg" className="w-full">Continue Shopping</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center glass p-8 rounded-3xl max-w-xs w-full">
                    <h1 className="text-xl font-bold text-[var(--silk-indigo)] mb-6">
                        Your Cart is Empty
                    </h1>
                    <Link href="/products" className="block">
                        <Button className="w-full">Browse Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--cotton-white)]">
            {/* Mobile Sticky Total Bar */}
            <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--warm-gray)]/10 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Total Amount</p>
                        <p className="text-lg font-bold text-[var(--silk-indigo)] leading-none">{formatPrice(total)}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobileSummary(!showMobileSummary)}
                    className="text-xs font-bold border-[var(--deep-saffron)] text-[var(--deep-saffron)] rounded-full px-4"
                >
                    {showMobileSummary ? "Hide details" : "Show details"}
                </Button>
            </div>

            <div className="container py-4 md:py-8">
                {/* Desktop Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="hidden lg:flex mb-8 gap-2 hover:bg-white/50 rounded-full"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to shopping
                </Button>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 order-2 lg:order-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden lg:block text-4xl font-bold text-[var(--silk-indigo)] mb-8"
                        >
                            Checkout
                        </motion.h1>

                        {/* Shipping Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="glass rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--deep-saffron)]/5 rounded-full blur-3xl -mr-16 -mt-16" />

                                <h2 className="text-xl font-bold text-[var(--silk-indigo)] mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--deep-saffron)]/10 flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-[var(--deep-saffron)]" />
                                    </div>
                                    Shipping Information
                                </h2>

                                <div className="grid gap-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                                Full Name
                                            </label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter full name"
                                                className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                                Email Address
                                            </label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your@email.com"
                                                className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                            Phone Number
                                        </label>
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                            Delivery Address
                                        </label>
                                        <Input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House no., Street, Area"
                                            className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                                City
                                            </label>
                                            <Input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                                State
                                            </label>
                                            <Input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="State"
                                                className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] ml-1">
                                                Pincode
                                            </label>
                                            <Input
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="000000"
                                                className="h-12 bg-white/50 border-[var(--warm-gray)]/30 rounded-xl focus:ring-[var(--deep-saffron)]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Trust Badges - Hidden on mobile if redundant */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {[
                                { icon: Shield, label: "Secure Payment", desc: "256-bit encryption" },
                                { icon: Truck, label: "Fast Shipping", desc: "Murshidabad to you" },
                                { icon: CreditCard, label: "Easy Returns", desc: "7-day policy" },
                            ].map(({ icon: Icon, label, desc }) => (
                                <div
                                    key={label}
                                    className="glass rounded-2xl p-4 flex items-center gap-4 sm:flex-col sm:text-center sm:justify-center"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                                        <Icon className="h-5 w-5 text-[var(--deep-saffron)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--silk-indigo)]">{label}</p>
                                        <p className="text-[10px] text-[var(--muted)]">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Order Summary */}
                    <aside className={`lg:w-[380px] order-1 lg:order-2 ${showMobileSummary ? 'block' : 'hidden lg:block'}`}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:sticky lg:top-28"
                        >
                            <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-[var(--silk-indigo)]/5">
                                <h2 className="text-xl font-bold text-[var(--silk-indigo)] mb-6">
                                    Order Summary
                                </h2>

                                {/* Items Container */}
                                <div className="space-y-5 mb-8 max-h-[40vh] lg:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.productId} className="flex gap-4 group">
                                            <div className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <p className="text-[10px] font-bold text-[var(--deep-saffron)] uppercase tracking-wider mb-0.5">
                                                        {getFabricLabel(item.fabricType)}
                                                    </p>
                                                    <h3 className="font-bold text-[var(--silk-indigo)] text-sm line-clamp-2 leading-tight">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                <div className="flex justify-between items-end mt-2">
                                                    <p className="text-xs text-[var(--muted)] font-medium">Qty: {item.quantity}</p>
                                                    <p className="font-bold text-[var(--silk-indigo)]">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals Section */}
                                <div className="space-y-3.5 border-t border-[var(--warm-gray)]/10 pt-6 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--muted)] font-medium">Subtotal</span>
                                        <span className="font-bold text-[var(--silk-indigo)]">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--muted)] font-medium">Shipping Fee</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest pt-1">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--muted)] font-medium">GST (5%)</span>
                                        <span className="font-bold text-[var(--silk-indigo)]">{formatPrice(tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-[var(--silk-indigo)] pt-5 border-t border-[var(--warm-gray)]/10">
                                        <span>Total</span>
                                        <span className="text-[var(--deep-saffron)]">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 bg-[var(--silk-indigo)] hover:bg-[var(--indigo-dark)] text-white font-bold text-base shadow-lg shadow-[var(--silk-indigo)]/20 rounded-2xl transition-all active:scale-95 group"
                                    onClick={handleCheckout}
                                    disabled={isLoading || !formData.name || !formData.email || !formData.phone || !formData.address}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Authorizing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                            Proceed to Pay
                                        </span>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <Shield className="h-3 w-3 text-green-600" />
                                    <p className="text-[10px] text-center text-[var(--muted)] font-medium italic">
                                        Your payment is secured by Razorpay
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
