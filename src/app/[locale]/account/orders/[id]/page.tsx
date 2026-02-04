import { auth } from "@/lib/auth";
import { getOrderById } from "@/actions/orders";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    ExternalLink,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getFabricLabel } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";

interface OrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    // 3. Await the params to get the actual ID
    const { id } = await params;

    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const steps = [
        { status: "PENDING", label: "Order Placed", icon: Clock },
        { status: "PAID", label: "Payment Confirmed", icon: CreditCard },
        { status: "PROCESSING", label: "Processing", icon: Package },
        { status: "SHIPPED", label: "Shipped", icon: Truck },
        { status: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(step => step.status === order.status);

    // Status color mapping
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "DELIVERED": return "text-green-600 bg-green-50 border-green-200";
            case "CANCELLED": return "text-red-600 bg-red-50 border-red-200";
            case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-200";
            case "PROCESSING": case "PAID": return "text-orange-600 bg-orange-50 border-orange-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-[var(--cotton-white)] pt-28 pb-20">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href="/account" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--deep-saffron)] transition-colors mb-4 group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Account
                        </Link>
                        <h1 className="text-3xl font-bold text-[var(--silk-indigo)]">
                            Order #{order.id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-[var(--muted)] mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border font-bold text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tracking Timeline */}
                        <Card className="glass border-none overflow-hidden rounded-3xl">
                            <CardContent className="p-6 md:p-8">
                                <h2 className="text-lg font-bold text-[var(--silk-indigo)] mb-8 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-[var(--deep-saffron)]" />
                                    Order Tracking
                                </h2>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 md:left-2 md:right-2 md:top-[19px] md:bottom-auto md:w-auto md:h-0.5" />

                                    <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
                                        {steps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isCompleted = index <= currentStepIndex && order.status !== "CANCELLED";
                                            const isCurrent = index === currentStepIndex;

                                            return (
                                                <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1">
                                                    <div className={`
                                                        relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                                                        ${isCompleted ? "bg-[var(--deep-saffron)] text-white shadow-lg shadow-[var(--deep-saffron)]/20" : "bg-white text-gray-300 border-2 border-gray-100"}
                                                        ${isCurrent ? "scale-125 ring-4 ring-[var(--deep-saffron)]/10" : ""}
                                                    `}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="text-left md:text-center">
                                                        <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-[var(--silk-indigo)]" : "text-gray-300"}`}>
                                                            {step.label}
                                                        </p>
                                                        {isCurrent && (
                                                            <p className="text-[10px] text-[var(--deep-saffron)] font-medium md:mt-1 animate-pulse">
                                                                Current Status
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {order.trackingNumber && (
                                    <div className="mt-12 p-4 bg-[var(--cotton-white)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--warm-gray)]/10">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Tracking Details</p>
                                            <p className="text-sm font-bold text-[var(--silk-indigo)] mt-1">{order.carrier} • {order.trackingNumber}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-xl border-[var(--deep-saffron)] text-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)] hover:text-white transition-all font-bold">
                                            Track Order <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card className="glass border-none overflow-hidden rounded-3xl">
                            <CardContent className="p-6 md:p-8">
                                <h2 className="text-lg font-bold text-[var(--silk-indigo)] mb-6">Order Items</h2>
                                <div className="space-y-6">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex gap-4 md:gap-6 group">
                                            <div className="relative w-20 h-24 md:w-24 md:h-32 rounded-2xl overflow-hidden shadow-lg shrink-0">
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 py-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-[var(--deep-saffron)] uppercase tracking-widest mb-1">
                                                        {getFabricLabel(item.product.fabricType)}
                                                    </p>
                                                    <h3 className="text-lg font-bold text-[var(--silk-indigo)] leading-tight">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-xs text-[var(--muted)] line-clamp-1 mt-1">
                                                        Count: {item.product.fabricCount || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="flex items-end justify-between">
                                                    <p className="text-sm font-medium text-[var(--muted)]">
                                                        {formatPrice(item.price)} x {item.quantity}
                                                    </p>
                                                    <p className="text-lg font-bold text-[var(--silk-indigo)]">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-[var(--warm-gray)]/10 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--muted)] font-medium">Subtotal</span>
                                        <span className="font-bold text-[var(--silk-indigo)]">{formatPrice(order.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--muted)] font-medium">Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-[var(--silk-indigo)] pt-3">
                                        <span>Total Amount</span>
                                        <span className="text-[var(--deep-saffron)]">{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <Card className="glass border-none overflow-hidden rounded-3xl">
                            <CardContent className="p-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[var(--deep-saffron)]" />
                                    Shipping Address
                                </h2>
                                <div className="space-y-3">
                                    <p className="font-bold text-[var(--silk-indigo)]">{order.shippingName}</p>
                                    <div className="space-y-1 text-sm text-[var(--muted)] font-medium leading-relaxed">
                                        <p>{order.shippingAddress}</p>
                                        <p>{order.shippingCity}, {order.shippingState}</p>
                                        <p>{order.shippingPincode}</p>
                                    </div>
                                    <div className="pt-3 space-y-2 border-t border-[var(--warm-gray)]/10">
                                        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                                            <Phone className="h-3.5 w-3.5" />
                                            {order.shippingPhone}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                                            <Mail className="h-3.5 w-3.5" />
                                            {order.shippingEmail}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card className="glass border-none overflow-hidden rounded-3xl">
                            <CardContent className="p-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-[var(--deep-saffron)]" />
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-[var(--warm-gray)]/10">
                                        <div className="w-10 h-6 bg-[var(--silk-indigo)] rounded flex items-center justify-center text-[8px] font-bold text-white uppercase italic">
                                            Razorpay
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[var(--silk-indigo)]">Online Payment</p>
                                            <p className="text-[10px] text-[var(--muted)]">ID: {order.razorpayPaymentId || "Processing"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Card */}
                        <Card className="glass border-none overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--silk-indigo)] to-[var(--indigo-dark)] text-white">
                            <CardContent className="p-6">
                                <AlertCircle className="h-8 w-8 text-[var(--deep-saffron)] mb-4" />
                                <h3 className="text-lg font-bold mb-2">Need help?</h3>
                                <p className="text-xs text-white/70 mb-6 leading-relaxed">
                                    If you have any questions about your order or need assistance, our support team is here for you.
                                </p>
                                <Link href="/contact" className="block">
                                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-[var(--silk-indigo)] rounded-xl font-bold">
                                        Contact Support
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
