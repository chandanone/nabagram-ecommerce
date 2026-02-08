"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactForm } from "@/actions/contact";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function ContactForm() {
    const t = useTranslations("ContactForm");
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            setFormState("error");
            setErrorMessage("reCAPTCHA not yet available. Please try again.");
            return;
        }

        setFormState("submitting");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        try {
            const token = await executeRecaptcha("contact_form");

            const result = await submitContactForm(data, token);
            if (result.success) {
                setFormState("success");
                (e.target as HTMLFormElement).reset();
                // Reset form state after 3 seconds
                setTimeout(() => setFormState("idle"), 3000);
            } else {
                setFormState("error");
                setErrorMessage(result.error || t("error"));
            }
        } catch (error) {
            setFormState("error");
            setErrorMessage(t("unexpectedError"));
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[var(--silk-indigo)] mb-2">{t("title")}</h3>
            <p className="text-[var(--muted)] mb-8">{t("subtitle")}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-[var(--silk-indigo)]">
                            {t("name")}
                        </label>
                        <input
                            required
                            name="name"
                            type="text"
                            id="name"
                            placeholder={t("placeholderName")}
                            className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[var(--deep-saffron)] focus:ring-1 focus:ring-[var(--deep-saffron)] outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-[var(--silk-indigo)]">
                            {t("email")}
                        </label>
                        <input
                            required
                            name="email"
                            type="email"
                            id="email"
                            placeholder={t("placeholderEmail")}
                            className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[var(--deep-saffron)] focus:ring-1 focus:ring-[var(--deep-saffron)] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-[var(--silk-indigo)]">
                        {t("subject")}
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[var(--deep-saffron)] focus:ring-1 focus:ring-[var(--deep-saffron)] outline-none transition-all bg-white"
                    >
                        <option value="General Inquiry">{t("subjects.general")}</option>
                        <option value="Bulk Order">{t("subjects.bulk")}</option>
                        <option value="Custom Weave Request">{t("subjects.custom")}</option>
                        <option value="Visit Request">{t("subjects.visit")}</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-[var(--silk-indigo)]">
                        {t("message")}
                    </label>
                    <textarea
                        required
                        name="message"
                        id="message"
                        rows={6}
                        placeholder={t("placeholderMessage")}
                        className="w-full p-4 rounded-lg border border-gray-200 focus:border-[var(--deep-saffron)] focus:ring-1 focus:ring-[var(--deep-saffron)] outline-none transition-all resize-none"
                    />
                </div>

                {formState === "error" && (
                    <div className="p-4 rounded-lg bg-red-50 text-red-600 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={formState === "submitting" || formState === "success"}
                    className="w-full h-12 bg-[var(--silk-indigo)] hover:bg-[var(--silk-indigo)]/90 text-white gap-2"
                >
                    <AnimatePresence mode="wait">
                        {formState === "submitting" ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                {t("sending")}
                            </motion.div>
                        ) : formState === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <CheckCircle className="h-5 w-5" />
                                {t("success")}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                {t("send")}
                                <Send className="h-4 w-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </form>
        </div>
    );
}

