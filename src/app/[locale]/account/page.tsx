import { auth } from "@/lib/auth";
import { getOrders } from "@/actions/orders";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
    Package,
    User as UserIcon,
    Mail,
    Shield,
    Calendar,
    ChevronRight,
    LogOut,
    ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getTranslations } from "next-intl/server";

export default async function AccountPage() {
    const t = await getTranslations("Account");
    const tCommon = await getTranslations("AdminSidebar");
    const tStatus = await getTranslations("Common.status");
    const tDashboard = await getTranslations("AdminDashboard");

    const session = await auth();
    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    const orders = await getOrders();
    const user = session.user;

    return (
        <div className="min-h-screen bg-[var(--cream)]/30 pt-28 pb-20">
            <div className="container max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="glass overflow-hidden border-none">
                            <div className="h-24 bg-gradient-to-r from-[var(--silk-indigo)] to-[var(--deep-saffron)]" />
                            <CardContent className="relative pt-0 px-6 pb-6">
                                <div className="absolute -top-12 left-6">
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                                        <Image
                                            src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=FF9933&color=fff`}
                                            alt={user.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="pt-16">
                                    <h1 className="text-2xl font-bold text-[var(--silk-indigo)]">
                                        {user.name}
                                    </h1>
                                    <p className="text-[var(--muted)] flex items-center gap-2 mt-1">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--silk-indigo)]/10 text-[var(--silk-indigo)]">
                                            <Shield className="h-3 w-3" />
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[var(--warm-gray)]/10 space-y-3">
                                    <SignOutButton className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" />

                                    {user.role === "ADMIN" && (
                                        <Link href="/admin">
                                            <Button variant="ghost" className="w-full justify-start gap-3 mt-2">
                                                <Shield className="h-4 w-4" />
                                                {tCommon("panel")}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content / Order History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[var(--silk-indigo)]">
                                {t("orderHistory")}
                            </h2>
                            <span className="text-sm text-[var(--muted)]">
                                {t("ordersTotal", { count: orders.length })}
                            </span>
                        </div>

                        {orders.length === 0 ? (
                            <Card className="glass border-dashed border-2 border-[var(--warm-gray)]/30">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="w-16 h-16 rounded-full bg-[var(--warm-gray)]/10 flex items-center justify-center mb-4">
                                        <ShoppingBag className="h-8 w-8 text-[var(--warm-gray)]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[var(--silk-indigo)]">{t("noOrders")}</h3>
                                    <p className="text-[var(--muted)] mt-2 mb-6">{t("noOrdersDesc")}</p>
                                    <Link href="/products">
                                        <Button>{t("browse")}</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Link key={order.id} href={`/account/orders/${order.id}`}>
                                        <Card className="glass border-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="p-6 flex-1">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                                                                {t("orderNumber", { id: order.id.slice(-8).toUpperCase() })}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-[var(--silk-indigo)]">
                                                                <Calendar className="h-3.5 w-3.5 text-[var(--deep-saffron)]" />
                                                                <span className="font-bold text-sm">
                                                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${order.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                                'bg-blue-50 text-blue-700 border-blue-100'
                                                            }`}>
                                                            {tStatus(order.status)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex -space-x-3">
                                                            {(order.items || []).slice(0, 3).map((item, idx) => (
                                                                <div key={idx} className="relative w-12 h-14 rounded-xl border-2 border-white overflow-hidden shadow-md group-hover:rotate-3 transition-transform">
                                                                    <Image
                                                                        src={item.product.images[0]}
                                                                        alt={item.product.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ))}
                                                            {(order.items || []).length > 3 && (
                                                                <div className="relative w-12 h-14 rounded-xl border-2 border-white bg-[var(--cotton-white)] flex items-center justify-center text-[10px] font-black text-[var(--silk-indigo)] shadow-md">
                                                                    +{(order.items || []).length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-[var(--silk-indigo)] truncate">
                                                                {(order.items || []).map(item => item.product.name).join(', ')}
                                                            </p>
                                                            <p className="text-xs text-[var(--muted)] font-medium">
                                                                {t("items", { count: (order.items || []).length })}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-[var(--silk-indigo)] tabular-nums">
                                                                {formatPrice(order.total)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-[var(--silk-indigo)]/5 p-4 flex items-center justify-center group-hover:bg-[var(--deep-saffron)]/10 transition-colors">
                                                    <ChevronRight className="h-5 w-5 text-[var(--silk-indigo)] group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
