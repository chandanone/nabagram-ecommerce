import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

const quickLinks = [
    { href: "/products", label: "All Collections" },
    { href: "/products?type=MUSLIN", label: "Cotton Muslin" },
    { href: "/products?type=SILK_SAREE", label: "Silk Sarees" },
    { href: "/about", label: "Our Heritage" },
    { href: "/contact", label: "Contact Us" },
];

const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/shipping", label: "Shipping & Returns" },
];

export function Footer() {
    return (
        <footer className="bg-[var(--silk-indigo)] text-white">
            {/* Main Footer */}
            <div className="container section">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-[var(--deep-saffron)] flex items-center justify-center text-white font-bold text-lg">
                                N
                            </div>
                            <div>
                                <h3 className="text-lg font-bold leading-tight">Nabagram</h3>
                                <p className="text-sm text-white/60">Seva Sangha (KVIC)</p>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Preserving the heritage of handwoven textiles. Our artisan community of 28 spinners
                            and 13 weavers craft premium muslin and silk with generations of expertise.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--deep-saffron)] transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--deep-saffron)] transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--deep-saffron)] transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/70 hover:text-[var(--deep-saffron)] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <MapPin className="h-5 w-5 text-[var(--deep-saffron)] flex-shrink-0 mt-0.5" />
                                <span className="text-white/70">
                                    Vill. & P.O.: Kanfala,<br />
                                    Dist.: Murshidabad,<br />
                                    West Bengal - 742184
                                </span>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <Phone className="h-5 w-5 text-[var(--deep-saffron)] flex-shrink-0" />
                                <a
                                    href="tel:+919732589805"
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    +91 97325 89805
                                </a>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <Mail className="h-5 w-5 text-[var(--deep-saffron)] flex-shrink-0" />
                                <a
                                    href="mailto:nabagramgss@gmail.com"
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    nabagramgss@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Find Us</h4>
                        <div className="rounded-xl overflow-hidden h-48">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.851567892345!2d88.2673!3d24.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKanfala%2C%20Murshidabad!5e0!3m2!1sen!2sin!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Nabagram Seva Sangha Location"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/60 text-sm">
                        © {new Date().getFullYear()} Nabagram Seva Sangha. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-white/60 hover:text-white text-sm transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
