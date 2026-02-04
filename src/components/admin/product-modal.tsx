"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct, updateProduct } from "@/actions/products";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { fromBengaliDigits, toBengaliDigits } from "@/lib/utils";
import { FABRIC_TYPES } from "@/lib/constants";
import { SafeProduct, FabricType } from "@/lib/types";
import { ImageUpload } from "./image-upload";
import { useTranslations, useLocale } from "next-intl";

interface ProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: SafeProduct | null;
    onSuccess: () => void;
}

interface ProductFormData {
    name: string;
    description: string;
    price: string;
    fabricType: FabricType;
    fabricCount: string;
    stock: string;
    featured: boolean;
    images: string[];
}

export function ProductModal({ open, onOpenChange, product, onSuccess }: ProductModalProps) {
    const t = useTranslations("AdminProducts.modal");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: "",
        fabricType: "MUSLIN",
        fabricCount: "",
        stock: "0",
        featured: false,
        images: []
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
                fabricType: product.fabricType || "MUSLIN",
                fabricCount: product.fabricCount?.toString() || "",
                stock: product.stock?.toString() || "0",
                featured: product.featured || false,
                images: product.images || []
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                fabricType: "MUSLIN",
                fabricCount: "",
                stock: "0",
                featured: false,
                images: []
            });
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Convert to standard digits before parsing
            const priceVal = locale === 'bn' ? fromBengaliDigits(formData.price) : formData.price;
            const stockVal = locale === 'bn' ? fromBengaliDigits(formData.stock) : formData.stock;
            const countVal = locale === 'bn' ? fromBengaliDigits(formData.fabricCount) : formData.fabricCount;

            const data = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(priceVal) || 0,
                fabricType: formData.fabricType,
                fabricCount: countVal ? parseInt(countVal) : undefined,
                stock: parseInt(stockVal) || 0,
                featured: formData.featured,
                images: formData.images.filter(img => img.trim() !== "")
            };

            if (product) {
                await updateProduct(product.id, data);
                toast.success(t("successUpdate"));
            } else {
                await createProduct(data);
                toast.success(t("successCreate"));
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error(t("error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleNumericChange = (field: keyof ProductFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? t("edit") : t("addNew")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("name")}</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">{t("price")}</Label>
                            <Input
                                id="price"
                                type="text"
                                inputMode="decimal"
                                value={locale === 'bn' ? toBengaliDigits(formData.price) : formData.price}
                                onChange={(e) => {
                                    const val = locale === 'bn' ? fromBengaliDigits(e.target.value) : e.target.value;
                                    setFormData({ ...formData, price: val.replace(/[^0-9.]/g, '') });
                                }}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fabricType">{t("fabricType")}</Label>
                            <select
                                id="fabricType"
                                value={formData.fabricType}
                                onChange={(e) => setFormData({ ...formData, fabricType: e.target.value as FabricType })}
                                className="w-full h-10 px-3 rounded-md border border-[var(--warm-gray)]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                            >
                                {Object.keys(FABRIC_TYPES).map((type) => (
                                    <option key={type} value={type}>
                                        {tCommon(`fabric.${type}`)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fabricCount">{t("fabricCount")}</Label>
                            <Input
                                id="fabricCount"
                                type="text"
                                inputMode="numeric"
                                value={locale === 'bn' ? toBengaliDigits(formData.fabricCount) : formData.fabricCount}
                                onChange={(e) => {
                                    const val = locale === 'bn' ? fromBengaliDigits(e.target.value) : e.target.value;
                                    setFormData({ ...formData, fabricCount: val.replace(/\D/g, '') });
                                }}
                                placeholder={t("fabricCountPlaceholder")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">{t("stock")}</Label>
                            <Input
                                id="stock"
                                type="text"
                                inputMode="numeric"
                                value={locale === 'bn' ? toBengaliDigits(formData.stock) : formData.stock}
                                onChange={(e) => {
                                    const val = locale === 'bn' ? fromBengaliDigits(e.target.value) : e.target.value;
                                    setFormData({ ...formData, stock: val.replace(/\D/g, '') });
                                }}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-[var(--deep-saffron)] focus:ring-[var(--deep-saffron)]"
                            />
                            <Label htmlFor="featured">{t("featured")}</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("description")}</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full min-h-[100px] p-3 rounded-md border border-[var(--warm-gray)]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t("images")}</Label>
                        <ImageUpload
                            value={formData.images}
                            onChange={(urls: string[]) => setFormData({ ...formData, images: urls })}
                            onRemove={(url: string) => setFormData({
                                ...formData,
                                images: formData.images.filter((img) => img !== url)
                            })}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? t("saving") : (product ? t("edit") : t("create"))}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
