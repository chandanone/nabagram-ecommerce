"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";

const ContactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Please select a subject"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export async function submitContactForm(data: ContactFormData, token: string) {
    try {
        // Verify reCAPTCHA
        const recaptchaResult = await verifyRecaptcha(token);
        if (!recaptchaResult.success) {
            return { success: false, error: recaptchaResult.error || "Security check failed. Please try again." };
        }

        const validatedData = ContactSchema.parse(data);

        const message = await prisma.contactMessage.create({
            data: validatedData,
        });

        return { success: true, message: "Your message has been sent successfully!" };
    } catch (error) {
        console.error("Contact form error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Something went wrong. Please try again later." };
    }
}
