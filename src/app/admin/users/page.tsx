"use client";

import { motion } from "framer-motion";
import { Users, Mail, Shield, MoreVertical, UserPlus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const users = [
    { id: "1", name: "Priya Sharma", email: "priya@example.com", role: "USER", joined: "Jan 12, 2024" },
    { id: "2", name: "Admin User", email: "admin@example.com", role: "ADMIN", joined: "Jan 01, 2024" },
    { id: "3", name: "Rahul Verma", email: "rahul@example.com", role: "USER", joined: "Jan 15, 2024" },
    { id: "4", name: "Anita Das", email: "anita@example.com", role: "SALESPERSON", joined: "Jan 18, 2024" },
    { id: "5", name: "Suresh Kumar", email: "suresh@example.com", role: "USER", joined: "Jan 20, 2024" },
];

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-[var(--silk-indigo)] mb-2">
                        User Management
                    </h1>
                    <p className="text-[var(--muted)]">
                        Manage your store customers and staff members.
                    </p>
                </div>
                <Button className="gap-2 bg-[var(--deep-saffron)] hover:bg-[var(--deep-saffron)]/90 text-white">
                    <UserPlus className="h-4 w-4" /> Add New User
                </Button>
            </motion.div>

            <Card className="glass">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle>All Users</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                            <Input placeholder="Search users..." className="pl-10 h-10 focus-visible:ring-[var(--deep-saffron)]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--warm-gray)]/20 text-[var(--muted)] text-sm">
                                    <th className="text-left pb-4 font-medium">User</th>
                                    <th className="text-left pb-4 font-medium">Role</th>
                                    <th className="text-left pb-4 font-medium">Joined</th>
                                    <th className="text-right pb-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-[var(--warm-gray)]/10 last:border-0 group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--cream)] border-2 border-white flex items-center justify-center text-[var(--deep-saffron)] font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--silk-indigo)]">{user.name}</p>
                                                    <p className="text-xs text-[var(--muted)]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.role === "ADMIN"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : user.role === "SALESPERSON"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}>
                                                <Shield className="h-3 w-3" />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-[var(--muted)]">
                                            {user.joined}
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button variant="ghost" size="icon" className="hover:bg-[var(--cream)]">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
