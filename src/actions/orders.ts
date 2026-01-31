"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import type { Product, OrderStatus } from "@prisma/client";
import Razorpay from "razorpay";



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

export async function createOrder(data: CreateOrderData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
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
            status: "PENDING" as OrderStatus, // Explicit cast
            items: {
                create: orderItems,
            },
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    return {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
    };
}

import { SafeOrder } from "@/lib/types";

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
            product: {
                ...item.product,
                price: Number(item.product.price),
            },
        })),
    };
};

export async function verifyPayment(
    orderId: string,
    razorpayData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }
): Promise<SafeOrder> {
    const crypto = await import("crypto");

    const body = razorpayData.razorpay_order_id + "|" + razorpayData.razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpayData.razorpay_signature) {
        throw new Error("Invalid signature");
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

    return serializeOrder(order);
}

export async function getOrders(): Promise<SafeOrder[]> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

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
    if (!session?.user?.id || session.user.role === "USER") {
        throw new Error("Unauthorized");
    }

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

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<SafeOrder> {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "USER") {
        throw new Error("Unauthorized");
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

    return serializeOrder(order);
}
