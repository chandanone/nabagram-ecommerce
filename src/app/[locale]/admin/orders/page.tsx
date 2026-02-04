"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

// Demo orders
const demoOrders = [
    { id: "ORD001", customer: "Priya Sharma", email: "priya@email.com", items: 2, total: 31000, status: "PAID", date: "2024-01-28" },
    { id: "ORD002", customer: "Rahul Verma", email: "rahul@email.com", items: 1, total: 18500, status: "PROCESSING", date: "2024-01-27" },
    { id: "ORD003", customer: "Anita Das", email: "anita@email.com", items: 3, total: 29500, status: "SHIPPED", date: "2024-01-26" },
    { id: "ORD004", customer: "Suresh Kumar", email: "suresh@email.com", items: 1, total: 22000, status: "DELIVERED", date: "2024-01-25" },
    { id: "ORD005", customer: "Meera Patel", email: "meera@email.com", items: 2, total: 17000, status: "PENDING", date: "2024-01-24" },
    { id: "ORD006", customer: "Amit Singh", email: "amit@email.com", items: 1, total: 35000, status: "CANCELLED", date: "2024-01-23" },
];

import { useTranslations, useLocale } from "next-intl";

export default function AdminOrdersPage() {
    const t = useTranslations("AdminOrders");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const statusConfig = {
        PENDING: { label: tCommon("status.PENDING"), icon: Clock, color: "bg-gray-100 text-gray-700" },
        PAID: { label: tCommon("status.PAID"), icon: CheckCircle, color: "bg-yellow-100 text-yellow-700" },
        PROCESSING: { label: tCommon("status.PROCESSING"), icon: Clock, color: "bg-blue-100 text-blue-700" },
        SHIPPED: { label: tCommon("status.SHIPPED"), icon: Truck, color: "bg-purple-100 text-purple-700" },
        DELIVERED: { label: tCommon("status.DELIVERED"), icon: CheckCircle, color: "bg-green-100 text-green-700" },
        CANCELLED: { label: tCommon("status.CANCELLED"), icon: XCircle, color: "bg-red-100 text-red-700" },
    };

    // Correcting statusConfig labels better
    const getStatusLabel = (status: string) => {
        return tCommon(`status.${status}`);
    }

    const filteredOrders = demoOrders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.customer.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t("stats.total"), value: demoOrders.length },
                    { label: t("stats.pending"), value: demoOrders.filter(o => o.status === "PENDING" || o.status === "PAID").length },
                    { label: t("stats.processing"), value: demoOrders.filter(o => o.status === "PROCESSING" || o.status === "SHIPPED").length },
                    { label: t("stats.completed"), value: demoOrders.filter(o => o.status === "DELIVERED").length },
                ].map((stat) => (
                    <Card key={stat.label} className="glass">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-[var(--silk-indigo)]">
                                {locale === 'bn' ? stat.value.toLocaleString('bn-BD') : stat.value}
                            </p>
                            <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="glass">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                            <Input
                                placeholder={t("search")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 px-4 rounded-lg border border-[var(--warm-gray)]/30 bg-white text-[var(--silk-indigo)] focus:outline-none focus:ring-2 focus:ring-[var(--deep-saffron)]"
                        >
                            <option value="">{t("allStatus")}</option>
                            <option value="PENDING">{tCommon("status.PENDING")}</option>
                            <option value="PAID">{tCommon("status.PAID")}</option>
                            <option value="PROCESSING">{tCommon("status.PROCESSING")}</option>
                            <option value="SHIPPED">{tCommon("status.SHIPPED")}</option>
                            <option value="DELIVERED">{tCommon("status.DELIVERED")}</option>
                            <option value="CANCELLED">{tCommon("status.CANCELLED")}</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="glass">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--warm-gray)]/20">
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">{t("table.orderId")}</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">{t("table.customer")}</th>
                                    <th className="text-center p-4 text-sm font-medium text-[var(--muted)]">{t("table.items")}</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--muted)]">{t("table.total")}</th>
                                    <th className="text-center p-4 text-sm font-medium text-[var(--muted)]">{t("table.status")}</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">{t("table.date")}</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--muted)]">{t("table.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const statusObj = statusConfig[order.status as keyof typeof statusConfig];
                                    return (
                                        <tr key={order.id} className="border-b border-[var(--warm-gray)]/10 last:border-0 hover:bg-[var(--cream)]/50 transition-colors">
                                            <td className="p-4 font-medium text-[var(--silk-indigo)]">{order.id}</td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-[var(--silk-indigo)]">{order.customer}</p>
                                                    <p className="text-xs text-[var(--muted)]">{order.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">{locale === 'bn' ? order.items.toLocaleString('bn-BD') : order.items}</td>
                                            <td className="p-4 text-right font-medium">{formatPrice(order.total, locale === 'bn' ? 'bn-IN' : 'en-IN')}</td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusObj.color}`}>
                                                    <statusObj.icon className="h-3 w-3" />
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[var(--muted)] text-sm">{order.date}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        {t("view")}
                                                    </Button>
                                                    {order.status === "PAID" && (
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Truck className="h-4 w-4" />
                                                            {t("ship")}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
