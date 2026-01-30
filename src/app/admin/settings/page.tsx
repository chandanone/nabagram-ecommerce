"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Store, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
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
                        <Button className="gap-2 bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white px-8">
                            <Save className="h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
