"use client";

import { motion } from "framer-motion";
import {
    Package,
    ShoppingCart,
    Users,
    IndianRupee,
    TrendingUp,
    TrendingDown,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import { useTranslations, useLocale } from "next-intl";
import { formatPrice, toBengaliDigits } from "@/lib/utils";

export default function AdminDashboard() {
    const t = useTranslations("AdminDashboard");
    const tCommon = useTranslations("Common");
    const locale = useLocale();

    const priceLocale = locale === 'bn' ? 'bn-IN' : 'en-IN';

    // Stats data moved inside component to use translations
    const stats = [
        {
            title: t("stats.revenue"),
            value: formatPrice(245000, priceLocale),
            change: locale === 'bn' ? "+১২%" : "+12%",
            trending: "up",
            icon: IndianRupee,
            color: "bg-green-500"
        },
        {
            title: t("stats.orders"),
            value: locale === 'bn' ? toBengaliDigits(48) : "48",
            change: locale === 'bn' ? "+৮%" : "+8%",
            trending: "up",
            icon: ShoppingCart,
            color: "bg-blue-500"
        },
        {
            title: t("stats.products"),
            value: locale === 'bn' ? toBengaliDigits(24) : "24",
            change: locale === 'bn' ? "+২" : "+2",
            trending: "up",
            icon: Package,
            color: "bg-purple-500"
        },
        {
            title: t("stats.customers"),
            value: locale === 'bn' ? toBengaliDigits(156) : "156",
            change: locale === 'bn' ? "+২৩%" : "+23%",
            trending: "up",
            icon: Users,
            color: "bg-orange-500"
        },
    ];

    const recentOrders = [
        { id: "ORD001", customer: "Priya Sharma", product: "Royal Muslin 100s", amount: 12500, status: "PAID" },
        { id: "ORD002", customer: "Rahul Verma", product: "Silk Saree - Paisley", amount: 18500, status: "PROCESSING" },
        { id: "ORD003", customer: "Anita Das", product: "Heritage Muslin 80s", amount: 9500, status: "SHIPPED" },
        { id: "ORD004", customer: "Suresh Kumar", product: "Artisan Silk Than", amount: 22000, status: "DELIVERED" },
    ];

    const lowStockProducts = [
        { name: "Royal Muslin 100s", stock: 3, threshold: 5 },
        { name: "Bridal Silk Saree", stock: 2, threshold: 5 },
        { name: "Printed Silk - Gold", stock: 4, threshold: 5 },
    ];

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
                    {t("welcome")}
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.trending === "up" ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {stat.trending === "up" ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--silk-indigo)]">
                                    {stat.value}
                                </h3>
                                <p className="text-sm text-[var(--muted)]">{stat.title}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2"
                >
                    <Card className="glass">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{t("recentOrders.title")}</CardTitle>
                            <Link href="/admin/orders">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    {t("recentOrders.viewAll")} <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[var(--warm-gray)]/20">
                                            <th className="text-left pb-3 text-sm font-medium text-[var(--muted)]">{t("recentOrders.orderId")}</th>
                                            <th className="text-left pb-3 text-sm font-medium text-[var(--muted)]">{t("recentOrders.customer")}</th>
                                            <th className="text-left pb-3 text-sm font-medium text-[var(--muted)]">{t("recentOrders.product")}</th>
                                            <th className="text-right pb-3 text-sm font-medium text-[var(--muted)]">{t("recentOrders.amount")}</th>
                                            <th className="text-right pb-3 text-sm font-medium text-[var(--muted)]">{t("recentOrders.status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-[var(--warm-gray)]/10 last:border-0">
                                                <td className="py-3 text-sm font-medium text-[var(--silk-indigo)]">{order.id}</td>
                                                <td className="py-3 text-sm text-[var(--muted)]">{order.customer}</td>
                                                <td className="py-3 text-sm text-[var(--muted)]">{order.product}</td>
                                                <td className="py-3 text-sm text-right font-medium">{formatPrice(order.amount, priceLocale)}</td>
                                                <td className="py-3 text-right">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${order.status === "PAID" ? "bg-yellow-100 text-yellow-700" :
                                                        order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                                                            order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
                                                                "bg-green-100 text-green-700"
                                                        }`}>
                                                        {tCommon(`status.${order.status}`)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Low Stock Alert */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="glass border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-orange-500" />
                                {t("lowStock.title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div key={product.name} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-[var(--silk-indigo)] text-sm">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-[var(--muted)]">
                                                {t("lowStock.leftInStock", { count: locale === 'bn' ? toBengaliDigits(product.stock) : product.stock })}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {t("lowStock.restock")}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Link href="/admin/products" className="block mt-6">
                                <Button variant="ghost" className="w-full gap-2">
                                    {t("lowStock.manage")} <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
