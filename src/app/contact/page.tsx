"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/contact-form";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
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
                        Get in Touch
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--silk-indigo)] mb-6">
                        We'd Love to <span className="text-gradient">Hear From You</span>
                    </h1>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        Whether you are looking for a specific weave, want to place a bulk order,
                        or simply want to visit our weavers in Murshidabad.
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
                            <h3 className="text-2xl font-bold text-[var(--silk-indigo)] mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">Our Location</p>
                                        <p className="text-[var(--muted)]">
                                            Nabagram Seva Sangha,<br />
                                            Vill. & P.O. - Nabagram,<br />
                                            Dist. - Murshidabad, West Bengal, 742136
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">Phone</p>
                                        <p className="text-[var(--muted)]">+91 98765 43210</p>
                                        <p className="text-[var(--muted)]">+91 3482 123456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">Email</p>
                                        <p className="text-[var(--muted)]">contact@nabagramsevasangha.org</p>
                                        <p className="text-[var(--muted)]">sales@nabagramsevasangha.org</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[var(--cream)] text-[var(--deep-saffron)]">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--silk-indigo)]">Visiting Hours</p>
                                        <p className="text-[var(--muted)]">Mon - Sat: 10:00 AM - 6:00 PM</p>
                                        <p className="text-[var(--muted)]">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="aspect-video bg-[var(--silk-indigo)]/5 rounded-2xl flex items-center justify-center text-[var(--muted)] border border-[var(--cream)]">
                            <span className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Google Maps Integration
                            </span>
                        </div>
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
