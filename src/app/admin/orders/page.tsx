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

const statusConfig = {
    PENDING: { label: "Pending", icon: Clock, color: "bg-gray-100 text-gray-700" },
    PAID: { label: "Paid", icon: CheckCircle, color: "bg-yellow-100 text-yellow-700" },
    PROCESSING: { label: "Processing", icon: Clock, color: "bg-blue-100 text-blue-700" },
    SHIPPED: { label: "Shipped", icon: Truck, color: "bg-purple-100 text-purple-700" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700" },
};

export default function AdminOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

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
                    Orders
                </h1>
                <p className="text-[var(--muted)]">
                    Track and manage customer orders
                </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Orders", value: demoOrders.length },
                    { label: "Pending", value: demoOrders.filter(o => o.status === "PENDING" || o.status === "PAID").length },
                    { label: "Processing", value: demoOrders.filter(o => o.status === "PROCESSING" || o.status === "SHIPPED").length },
                    { label: "Completed", value: demoOrders.filter(o => o.status === "DELIVERED").length },
                ].map((stat) => (
                    <Card key={stat.label} className="glass">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-[var(--silk-indigo)]">{stat.value}</p>
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
                                placeholder="Search by order ID or customer..."
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
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
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
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">Order ID</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">Customer</th>
                                    <th className="text-center p-4 text-sm font-medium text-[var(--muted)]">Items</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--muted)]">Total</th>
                                    <th className="text-center p-4 text-sm font-medium text-[var(--muted)]">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-[var(--muted)]">Date</th>
                                    <th className="text-right p-4 text-sm font-medium text-[var(--muted)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const status = statusConfig[order.status as keyof typeof statusConfig];
                                    return (
                                        <tr key={order.id} className="border-b border-[var(--warm-gray)]/10 last:border-0 hover:bg-[var(--cream)]/50 transition-colors">
                                            <td className="p-4 font-medium text-[var(--silk-indigo)]">{order.id}</td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-[var(--silk-indigo)]">{order.customer}</p>
                                                    <p className="text-xs text-[var(--muted)]">{order.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">{order.items}</td>
                                            <td className="p-4 text-right font-medium">{formatPrice(order.total)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                    <status.icon className="h-3 w-3" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[var(--muted)] text-sm">{order.date}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                    {order.status === "PAID" && (
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Truck className="h-4 w-4" />
                                                            Ship
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
