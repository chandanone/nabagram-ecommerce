"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/contact-form";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations("Contact");

    return (
        <div className="-mt-20 pt-32 pb-20 bg-[var(--cream)]/20 min-h-screen">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <p className="text-[var(--deep-saffron)] font-medium tracking-wider uppercase text-sm mb-4">
                        {t("hero.badge")}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--silk-indigo)] mb-6">
                        {t("hero.title")}
                    </h1>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        {t("hero.description")}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--cream)]">
                            <h3 className="text-2xl font-bold text-[var(--silk-indigo)] mb-6">{t("info.title")}</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">{t("info.location")}</p>
                                        <p className="text-[var(--muted)]">
                                            {t("info.address")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">{t("info.phone")}</p>
                                        <p className="text-[var(--muted)]">+91 98765 43210</p>
                                        <p className="text-[var(--muted)]">+91 3482 123456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">{t("info.email")}</p>
                                        <p className="text-[var(--muted)]">contact@nabagramsevasangha.org</p>
                                        <p className="text-[var(--muted)]">sales@nabagramsevasangha.org</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">{t("info.hours")}</p>
                                        <p className="text-[var(--muted)]">{t("info.hoursDetail")}</p>
                                        <p className="text-[var(--muted)]">{t("info.sunday")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        {/* <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-[var(--warm-gray)]/20 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116345.92244247545!2d88.23235474335938!3d24.180126784379468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f977bd00000001%3A0xe530c34f0e75c58b!2sNabagram%20Seva%20Sangha!5e0!3m2!1sen!2sin!4v1706600000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            ></iframe>
                        </div> */}
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-lg"
                    >
                        <h3 className="text-2xl font-bold text-[var(--silk-indigo)] mb-2">Send us a Message</h3>
                        <p className="text-[var(--muted)] mb-8">We usually respond within 24 hours.</p>
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
