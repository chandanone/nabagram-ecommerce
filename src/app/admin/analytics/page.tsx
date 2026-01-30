"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Download, PieChart, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-[var(--silk-indigo)] mb-2">
                        Analytics
                    </h1>
                    <p className="text-[var(--muted)]">
                        Detailed insights into your store performance and sales.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-[var(--warm-gray)]/30">
                        <Calendar className="h-4 w-4" /> This Month
                    </Button>
                    <Button className="gap-2 bg-[var(--charcoal)] hover:bg-[var(--charcoal)]/90 text-white">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Revenue Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-[var(--warm-gray)]/10">
                        <div className="text-center">
                            <LineChart className="h-12 w-12 text-[var(--warm-gray)]/30 mx-auto mb-4" />
                            <p className="text-[var(--muted)]">Revenue chart will be integrated here.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-blue-500" />
                            Category Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-[var(--warm-gray)]/10">
                        <div className="text-center">
                            <PieChart className="h-12 w-12 text-[var(--warm-gray)]/30 mx-auto mb-4" />
                            <p className="text-[var(--muted)]">Product categories data.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-500" />
                            Sales by Region
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                        <p className="text-[var(--muted)]">Regional performance data.</p>
                    </CardContent>
                </Card>
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                            Customer Growth
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                        <p className="text-[var(--muted)]">Monthly user acquisition trends.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
