import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check if user is authenticated and has admin/salesperson role
    if (!session?.user) {
        redirect("/");
    }

    if (session.user.role === "USER") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[var(--cream)]">
            <div className="flex">
                <AdminSidebar userRole={session.user.role} />
                <main className="flex-1 p-6 lg:p-8 lg:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
