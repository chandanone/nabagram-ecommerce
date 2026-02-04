"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getOptimizedImageUrl, convertToWebP, toBengaliDigits } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useTranslations, useLocale } from "next-intl";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const t = useTranslations("AdminProducts.upload");
    const locale = useLocale();
    const [isUploading, setIsUploading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processAndUpload = async (files: File[], forceOptimize = false) => {
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        // Settings from localStorage
        const savedSettings = localStorage.getItem("admin-upload-settings");
        const settings = savedSettings ? JSON.parse(savedSettings) : { autoOptimize: true, threshold: 5 };
        const thresholdInBytes = settings.threshold * 1024 * 1024;

        try {
            for (let i = 0; i < files.length; i++) {
                let fileToUpload = files[i];
                const isLarge = fileToUpload.size > thresholdInBytes;

                if (isLarge && (settings.autoOptimize || forceOptimize)) {
                    // Optimize
                    const blob = await convertToWebP(fileToUpload, 0.95);
                    fileToUpload = new File([blob], fileToUpload.name.replace(/\.[^/.]+$/, "") + ".webp", {
                        type: "image/webp",
                    });
                }

                const formData = new FormData();
                formData.append("file", fileToUpload);
                formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
                formData.append("folder", "assets/products");

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) throw new Error("Upload failed");
                const data = await response.json();
                uploadedUrls.push(data.secure_url);
            }

            onChange([...value, ...uploadedUrls]);
            toast.success(t("success", { count: locale === 'bn' ? toBengaliDigits(uploadedUrls.length) : uploadedUrls.length }));
        } catch (error) {
            console.error(error);
            toast.error(t("failed"));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Settings
        const savedSettings = localStorage.getItem("admin-upload-settings");
        const settings = savedSettings ? JSON.parse(savedSettings) : { autoOptimize: true, threshold: 5 };
        const thresholdInBytes = settings.threshold * 1024 * 1024;

        const hasLargeFiles = files.some(f => f.size > thresholdInBytes);

        if (hasLargeFiles && !settings.autoOptimize) {
            // Check last prompt date
            const lastPrompt = localStorage.getItem("last-optimization-prompt");
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const shouldPrompt = !lastPrompt || (Date.now() - parseInt(lastPrompt) > oneWeek);

            if (shouldPrompt) {
                setPendingFiles(files);
                setShowConfirm(true);
                localStorage.setItem("last-optimization-prompt", Date.now().toString());
                return;
            }
        }

        processAndUpload(files);
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
                        <span className="text-sm font-medium">{t("uploading")}</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-6 w-6 text-[var(--deep-saffron)]" />
                        <span className="text-sm font-medium text-gray-600">
                            {t("add")}
                        </span>
                        <span className="text-xs text-gray-400">
                            {t("multiple")}
                        </span>
                    </>
                )}
            </Button>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            {t("optimizeTitle")}
                        </DialogTitle>
                        <DialogDescription>
                            {t("optimizeDesc")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowConfirm(false);
                                processAndUpload(pendingFiles, false);
                            }}
                        >
                            {t("original")}
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                setShowConfirm(false);
                                processAndUpload(pendingFiles, true);
                            }}
                        >
                            {t("optimize")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
