"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Store, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function SettingsPage() {
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
        localStorage.setItem("admin-upload-settings", JSON.stringify(settings));
        toast.success("Settings saved successfully");
    };
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-[var(--silk-indigo)] mb-2">
                    Settings
                </h1>
                <p className="text-[var(--muted)]">
                    Configure your store preferences, security, and notifications.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation */}
                <Card className="glass h-fit lg:col-span-1">
                    <CardContent className="p-2">
                        {[
                            { icon: Store, label: "General", active: true },
                            { icon: Bell, label: "Notifications", active: false },
                            { icon: Shield, label: "Security", active: false },
                            { icon: CreditCard, label: "Payments", active: false },
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
                            <CardTitle>Image Upload Settings</CardTitle>
                            <CardDescription>Configure how images are processed during upload.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--warm-gray)]/20 bg-white/30">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto-Optimize Large Images</Label>
                                    <p className="text-sm text-[var(--muted)]">
                                        Automatically convert images {'>'} 5MB to high-quality WebP.
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
                                <Label>Optimization Threshold</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        value={settings.threshold}
                                        onChange={(e) => setSettings({ ...settings, threshold: parseInt(e.target.value) })}
                                        className="max-w-[150px]"
                                    />
                                    <span className="text-sm text-[var(--muted)]">MB (Files larger than this will trigger optimization)</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">Cloudinary Usage Tip</h4>
                                <p className="text-xs text-blue-700">
                                    Free plan limit is usually 25 Transformation Credits or 25GB Storage. Enabling optimization saves storage space and transformation credits.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Store Information</CardTitle>
                            <CardDescription>Update your store details and contact info.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store Name</Label>
                                    <Input id="storeName" defaultValue="Nabagram Seva Sangha" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">Support Email</Label>
                                    <Input id="storeEmail" defaultValue="support@nabagram.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="storeDesc">Store Description</Label>
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
                            <CardTitle>Currency & Localization</CardTitle>
                            <CardDescription>Setup your preferred currency and timezone.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Input id="currency" defaultValue="INR (₹)" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Input id="timezone" defaultValue="GMT +5:30 (Kolkata)" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button
                            className="gap-2 bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white px-8"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
