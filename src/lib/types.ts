import { Product, Order, OrderItem, User } from "@prisma/client";

export type SafeProduct = Omit<Product, "price"> & {
    price: number;
};

export type SafeOrder = Omit<Order, "total"> & {
    total: number;
    items?: (OrderItem & { product: SafeProduct })[];
    user?: User;
};
