"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getOptimizedImageUrl, convertToWebP } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Convert to WebP client-side
                const webpBlob = await convertToWebP(file);
                const webpFile = new File([webpBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                    type: "image/webp",
                });

                const formData = new FormData();
                formData.append("file", webpFile);
                formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
                formData.append("folder", "assets/products");

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error("Upload failed");
                }

                const data = await response.json();
                uploadedUrls.push(data.secure_url);
            }

            onChange([...value, ...uploadedUrls]);
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image(s)");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url) => (
                    <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border">
                        <img
                            src={getOptimizedImageUrl(url)}
                            alt="Product"
                            className="object-cover w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={onUpload}
                disabled={isUploading}
            />

            <Button
                type="button"
                disabled={isUploading}
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-dashed border-2 flex flex-col gap-2 hover:border-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/5 transition-all"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="h-6 w-6 animate-spin text-[var(--deep-saffron)]" />
                        <span className="text-sm font-medium">Uploading images...</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-6 w-6 text-[var(--deep-saffron)]" />
                        <span className="text-sm font-medium text-gray-600">
                            Add Images (Gallery/Camera)
                        </span>
                        <span className="text-xs text-gray-400">
                            You can select multiple images
                        </span>
                    </>
                )}
            </Button>
        </div>
    );
}
