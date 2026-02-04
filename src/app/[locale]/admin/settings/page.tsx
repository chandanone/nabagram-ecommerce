"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Store, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { useTranslations, useLocale } from "next-intl";
import { fromBengaliDigits, toBengaliDigits } from "@/lib/utils";

export default function SettingsPage() {
    const t = useTranslations("AdminSettings");
    const locale = useLocale();
    const [settings, setSettings] = useState({
        autoOptimize: true,
        threshold: 5,
    });

    useEffect(() => {
        const saved = localStorage.getItem("admin-upload-settings");
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        if (settings.threshold < 2) {
            toast.error(locale === 'bn' ? "থ্রেশহোল্ড কমপক্ষে ২ মেগাবাইট হতে হবে" : "Threshold must be at least 2 MB");
            return;
        }
        localStorage.setItem("admin-upload-settings", JSON.stringify(settings));
        toast.success(locale === 'bn' ? "সেটিংস সফলভাবে সংরক্ষিত হয়েছে" : "Settings saved successfully");
    };
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-[var(--silk-indigo)] mb-2">
                    {t("title")}
                </h1>
                <p className="text-[var(--muted)]">
                    {t("subtitle")}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation */}
                <Card className="glass h-fit lg:col-span-1">
                    <CardContent className="p-2">
                        {[
                            { icon: Store, label: t("nav.general"), active: true },
                            { icon: Bell, label: t("nav.notifications"), active: false },
                            { icon: Shield, label: t("nav.security"), active: false },
                            { icon: CreditCard, label: t("nav.payments"), active: false },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                    ? "bg-[var(--deep-saffron)] text-white"
                                    : "text-[var(--muted)] hover:bg-[var(--cream)]"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>{t("upload.title")}</CardTitle>
                            <CardDescription>{t("upload.desc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--warm-gray)]/20 bg-white/30">
                                <div className="space-y-0.5">
                                    <Label className="text-base">{t("upload.optimize")}</Label>
                                    <p className="text-sm text-[var(--muted)]">
                                        {t("upload.optimizeDesc", { threshold: locale === 'bn' ? toBengaliDigits(settings.threshold) : settings.threshold })}
                                    </p>
                                </div>
                                <div className="flex items-center h-6">
                                    <input
                                        type="checkbox"
                                        id="optimizeToggle"
                                        checked={settings.autoOptimize}
                                        onChange={(e) => setSettings({ ...settings, autoOptimize: e.target.checked })}
                                        className="h-5 w-10 appearance-none rounded-full bg-[var(--warm-gray)]/30 checked:bg-[var(--deep-saffron)] relative transition-all cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all checked:before:left-[calc(100%-1.1rem)]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{t("upload.threshold")}</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={locale === 'bn' ? toBengaliDigits(settings.threshold) : settings.threshold}
                                        onChange={(e) => {
                                            const val = locale === 'bn' ? fromBengaliDigits(e.target.value) : e.target.value;
                                            const num = parseInt(val.replace(/\D/g, '')) || 0;
                                            setSettings({ ...settings, threshold: num });
                                        }}
                                        onBlur={() => {
                                            if (settings.threshold < 2) {
                                                setSettings({ ...settings, threshold: 2 });
                                            }
                                        }}
                                        className="max-w-[150px]"
                                    />
                                    <span className="text-sm text-[var(--muted)]">{t("upload.thresholdDesc")}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">{t("cloudinary.title")}</h4>
                                <p className="text-xs text-blue-700">
                                    {t("cloudinary.desc")}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>{t("storeInfo.title")}</CardTitle>
                            <CardDescription>{t("storeInfo.desc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">{t("storeInfo.name")}</Label>
                                    <Input id="storeName" defaultValue="Nabagram Seva Sangha" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">{t("storeInfo.email")}</Label>
                                    <Input id="storeEmail" defaultValue="support@nabagram.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="storeDesc">{t("storeInfo.description")}</Label>
                                <textarea
                                    id="storeDesc"
                                    className="w-full min-h-[100px] rounded-xl border border-[var(--warm-gray)]/30 bg-white/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                                    defaultValue="Preserving the heritage of handwoven textiles with Murshidabad's finest muslin and silk."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>{t("localization.title")}</CardTitle>
                            <CardDescription>{t("localization.desc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">{t("localization.currency")}</Label>
                                    <Input id="currency" defaultValue="INR (₹)" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">{t("localization.timezone")}</Label>
                                    <Input id="timezone" defaultValue="GMT +5:30 (Kolkata)" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline">{t("cancel")}</Button>
                        <Button
                            className="gap-2 bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white px-8"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4" /> {t("save")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
