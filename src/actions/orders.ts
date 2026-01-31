"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma, type Product, type OrderStatus } from "@prisma/client";
import Razorpay from "razorpay";
import { SafeOrder, ActionResponse } from "@/lib/types";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface CreateOrderData {
    items: { productId: string; quantity: number }[];
    shipping: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
}

// Define the type for the order with its relations
type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
        user: true;
    };
}>;

// Helper to serialize order data
const serializeOrder = (order: Omit<OrderWithItems, "user"> & { user?: OrderWithItems["user"] }): SafeOrder => {
    return {
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
            product: {
                ...item.product,
                price: Number(item.product.price),
            },
        })),
    };
};

export async function createOrder(data: CreateOrderData): Promise<ActionResponse<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
}>> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Authentication required. Please sign in." };
        }

        // Handle staleness after db:seed
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user) {
            return { success: false, error: "Your session has expired. Please logout and login again." };
        }

        // Get product prices
        const products = await prisma.product.findMany({
            where: { id: { in: data.items.map((i) => i.productId) } },
        });

        // Calculate total
        let total = 0;
        const orderItems = data.items.map((item) => {
            const product = products.find((p: Product) => p.id === item.productId);
            if (!product) throw new Error(`Product not found: ${item.productId}`);

            const price = Number(product.price);
            total += price * item.quantity;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price,
            };
        });

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(total * 100), // Amount in paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
        });

        // Create order in database
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total: total,
                razorpayOrderId: razorpayOrder.id,
                shippingName: data.shipping.name,
                shippingEmail: data.shipping.email,
                shippingPhone: data.shipping.phone,
                shippingAddress: data.shipping.address,
                shippingCity: data.shipping.city,
                shippingState: data.shipping.state,
                shippingPincode: data.shipping.pincode,
                status: "PENDING" as OrderStatus,
                items: {
                    create: orderItems,
                },
            },
        });

        return {
            success: true,
            data: {
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount as number,
                currency: razorpayOrder.currency,
            }
        };
    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return {
            success: false,
            error: error.message.includes("prisma")
                ? "A database error occurred. Our team has been notified."
                : error.message || "Failed to initialize checkout"
        };
    }
}

export async function verifyPayment(
    orderId: string,
    razorpayData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }
): Promise<ActionResponse<SafeOrder>> {
    try {
        const crypto = await import("crypto");

        const body = razorpayData.razorpay_order_id + "|" + razorpayData.razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpayData.razorpay_signature) {
            return { success: false, error: "Payment verification failed: Invalid signature" };
        }

        // Update order status
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                razorpayPaymentId: razorpayData.razorpay_payment_id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Reduce stock
        for (const item of order.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }

        return { success: true, data: serializeOrder(order) };
    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return { success: false, error: "Failed to verify payment. Please contact support if your account was debited." };
    }
}

export async function getOrderById(orderId: string): Promise<SafeOrder | null> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });

    if (!order) return null;

    if (order.userId !== session.user.id && session.user.role === "USER") {
        throw new Error("Unauthorized");
    }

    return serializeOrder(order);
}

export async function getOrders(): Promise<SafeOrder[]> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return orders.map(serializeOrder);
}

export async function getAllOrders(): Promise<SafeOrder[]> {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "USER") throw new Error("Unauthorized");

    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return orders.map(serializeOrder);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResponse<SafeOrder>> {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role === "USER") {
            return { success: false, error: "Unauthorized" };
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return { success: true, data: serializeOrder(order) };
    } catch (error: any) {
        console.error("Update Order Status Error:", error);
        return { success: false, error: "Failed to update order status" };
    }
}
