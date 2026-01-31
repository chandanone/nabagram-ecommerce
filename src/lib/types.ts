import { Product, Order, OrderItem, User } from "@prisma/client";
import { FABRIC_TYPES } from "./constants";

export type SafeProduct = Omit<Product, "price"> & {
    price: number;
};

export type SafeOrder = Omit<Order, "total"> & {
    total: number;
    items?: (OrderItem & { product: SafeProduct })[];
    user?: User;
};

export type FabricType = (typeof FABRIC_TYPES)[keyof typeof FABRIC_TYPES];

export interface ProductFilters {
    type?: FabricType | string;
    count?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}
