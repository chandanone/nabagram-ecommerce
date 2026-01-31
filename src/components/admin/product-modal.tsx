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
import { SafeProduct, FabricType } from "@/lib/types";

// Define possible fabric types locally to avoid importing from @prisma/client in client components
// This fixes the 'Can't resolve .prisma/client/index-browser' build error
const FABRIC_TYPES = ["MUSLIN", "SILK_SAREE", "SILK_THAN"] as const;
type LocalFabricType = (typeof FABRIC_TYPES)[number];

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
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: "",
        fabricType: "MUSLIN",
        fabricCount: "",
        stock: "0",
        featured: false,
        images: [""]
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
                images: product.images?.length > 0 ? product.images : [""]
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
                images: [""]
            });
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                fabricType: formData.fabricType,
                fabricCount: formData.fabricCount ? parseInt(formData.fabricCount) : undefined,
                stock: parseInt(formData.stock),
                featured: formData.featured,
                images: formData.images.filter(img => img.trim() !== "")
            };

            if (product) {
                await updateProduct(product.id, data);
                toast.success("Product updated successfully");
            } else {
                await createProduct(data);
                toast.success("Product created successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length === 0 ? [""] : newImages });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fabricType">Fabric Type</Label>
                            <select
                                id="fabricType"
                                value={formData.fabricType}
                                onChange={(e) => setFormData({ ...formData, fabricType: e.target.value as FabricType })}
                                className="w-full h-10 px-3 rounded-md border border-[var(--warm-gray)]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                            >
                                {FABRIC_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type.replace("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fabricCount">Fabric Count (Optional)</Label>
                            <Input
                                id="fabricCount"
                                type="number"
                                value={formData.fabricCount}
                                onChange={(e) => setFormData({ ...formData, fabricCount: e.target.value })}
                                placeholder="e.g. 60, 80, 100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                            <Label htmlFor="featured">Featured Product</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full min-h-[100px] p-3 rounded-md border border-[var(--warm-gray)]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Images (URLs)</Label>
                        {formData.images.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    required={index === 0}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeImageField(index)}
                                    className="text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addImageField}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Image URL
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {product ? "Update Product" : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
