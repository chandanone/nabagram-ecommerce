"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { SafeProduct } from "@/lib/types";

export const FABRIC_TYPES = {
    MUSLIN: "MUSLIN",
    SILK_SAREE: "SILK_SAREE",
    SILK_THAN: "SILK_THAN"
} as const;

export type FabricType = (typeof FABRIC_TYPES)[keyof typeof FABRIC_TYPES];

export interface ProductFilters {
    type?: FabricType | string;
    count?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export async function getProducts(filters: ProductFilters = {}): Promise<SafeProduct[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters.type && Object.values(FABRIC_TYPES).includes(filters.type as FabricType)) {
        where.fabricType = filters.type as "MUSLIN" | "SILK_SAREE" | "SILK_THAN";
    }

    if (filters.count) {
        where.fabricCount = parseInt(filters.count);
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return products.map((product) => ({
        ...product,
        price: Number(product.price)
    }));
}

export async function getProductById(id: string): Promise<SafeProduct | null> {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) return null;

    return {
        ...product,
        price: Number(product.price)
    };
}

export async function getFeaturedProducts(): Promise<SafeProduct[]> {
    const products = await prisma.product.findMany({
        where: { featured: true },
        take: 4,
        orderBy: { createdAt: "desc" },
    });

    return products.map((product) => ({
        ...product,
        price: Number(product.price)
    }));
}

export async function createProduct(data: {
    name: string;
    description: string;
    price: number | string;
    fabricType: FabricType;
    fabricCount?: number;
    images: string[];
    stock: number;
    featured?: boolean;
}): Promise<SafeProduct> {
    const product = await prisma.product.create({
        data: {
            ...data,
            price: data.price,
        } as Prisma.ProductCreateInput,
    });

    return {
        ...product,
        price: Number(product.price)
    };
}

export async function updateProduct(
    id: string,
    data: Partial<{
        name: string;
        description: string;
        price: number | string;
        fabricType: FabricType;
        fabricCount: number;
        images: string[];
        stock: number;
        featured: boolean;
    }>
): Promise<SafeProduct> {
    const product = await prisma.product.update({
        where: { id },
        data: data as Prisma.ProductUpdateInput,
    });

    return {
        ...product,
        price: Number(product.price)
    };
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });
}
