import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericPrice);
}

export function getFabricLabel(fabricType: string): string {
    const labels: Record<string, string> = {
        MUSLIN: "Cotton Muslin",
        SILK_SAREE: "Silk Saree",
        SILK_THAN: "Silk Than",
    };
    return labels[fabricType] || fabricType;
}

export function getCountLabel(count: number | null): string {
    if (!count) return "";
    return `${count}s Count`;
}
