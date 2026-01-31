import { type Product, type Order, type OrderItem, type User } from "@prisma/client";
import { FABRIC_TYPES } from "./constants";

export type SafeProduct = Omit<Product, "price"> & {
    price: number;
};

export type SafeOrderItem = Omit<OrderItem, "price"> & {
    price: number;
    product: SafeProduct;
};

export type SafeOrder = Omit<Order, "total"> & {
    total: number;
    trackingNumber?: string | null;
    carrier?: string | null;
    items?: SafeOrderItem[];
    user?: User;
};

export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export type FabricType = (typeof FABRIC_TYPES)[keyof typeof FABRIC_TYPES];

export interface ProductFilters {
    type?: string;
    count?: string;
    minPrice?: number;
    maxPrice?: number;
    priceRange?: [number, number];
    search?: string;
}
