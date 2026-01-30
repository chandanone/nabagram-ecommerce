"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
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
    let total = new Prisma.Decimal(0);
    const orderItems = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const price = product.price;
        total = total.add(price.mul(item.quantity));

        return {
            productId: item.productId,
            quantity: item.quantity,
            price: price,
        };
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: total.mul(100).toNumber(), // Amount in paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
    });

    // Create order in database
    const order = await prisma.order.create({
        data: {
            userId: session.user.id,
            total,
            razorpayOrderId: razorpayOrder.id,
            shippingName: data.shipping.name,
            shippingEmail: data.shipping.email,
            shippingPhone: data.shipping.phone,
            shippingAddress: data.shipping.address,
            shippingCity: data.shipping.city,
            shippingState: data.shipping.state,
            shippingPincode: data.shipping.pincode,
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

export async function verifyPayment(
    orderId: string,
    razorpayData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }
) {
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
    });

    // Reduce stock
    const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
    });

    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.productId },
            data: {
                stock: { decrement: item.quantity },
            },
        });
    }

    return order;
}

export async function getOrders() {
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

    return orders;
}

export async function getAllOrders() {
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

    return orders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "USER") {
        throw new Error("Unauthorized");
    }

    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    return order;
}
