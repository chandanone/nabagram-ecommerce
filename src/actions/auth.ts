"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function register(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!name || !email || !password) {
        return { error: "Missing fields" }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "User already exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
            },
        })

        return { success: true }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "Failed to create account" }
    }
}

export async function getUserRole(email: string) {
    if (!email) return "USER";
    const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true }
    });
    return user?.role || "USER";
}
