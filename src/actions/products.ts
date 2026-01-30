"use server";

import { prisma } from "@/lib/prisma";
import { FabricType, Prisma } from "@prisma/client";

export interface ProductFilters {
    type?: FabricType | string;
    count?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export async function getProducts(filters: ProductFilters = {}) {
    const where: any = {};

    if (filters.type && Object.values(FabricType).includes(filters.type as FabricType)) {
        where.fabricType = filters.type as FabricType;
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

    return products.map(product => ({
        ...product,
        price: Number(product.price)
    }));
}

export async function getProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) return null;

    return {
        ...product,
        price: Number(product.price)
    };
}

export async function getFeaturedProducts() {
    const products = await prisma.product.findMany({
        where: { featured: true },
        take: 4,
        orderBy: { createdAt: "desc" },
    });

    return products.map(product => ({
        ...product,
        price: Number(product.price)
    }));
}

export async function createProduct(data: {
    name: string;
    description: string;
    price: number | string | Prisma.Decimal;
    fabricType: FabricType;
    fabricCount?: number;
    images: string[];
    stock: number;
    featured?: boolean;
}) {
    const product = await prisma.product.create({
        data,
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
        price: number | string | Prisma.Decimal;
        fabricType: FabricType;
        fabricCount: number;
        images: string[];
        stock: number;
        featured: boolean;
    }>
) {
    const product = await prisma.product.update({
        where: { id },
        data,
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
