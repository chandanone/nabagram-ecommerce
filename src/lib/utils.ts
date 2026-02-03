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

export function getOptimizedImageUrl(url: string): string {
    if (!url || !url.includes('cloudinary')) return url;
    if (url.includes('f_auto') || url.includes('f_webp')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

export async function convertToWebP(file: File, quality = 0.95): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas to Blob failed"));
                    },
                    "image/webp",
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

