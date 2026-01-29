"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Heart, Leaf, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
    { label: "Master Spinners", value: "28", icon: Users },
    { label: "Skilled Weavers", value: "13", icon: Heart },
    { label: "Years Heritage", value: "50+", icon: Award },
    { label: "Natural Fibers", value: "100%", icon: Leaf },
];

const values = [
    {
        title: "Heritage Preservation",
        description: "Keeping the ancient art of Muslin weaving alive in its purest form, passed down through generations in Murshidabad.",
        image: "https://images.unsplash.com/photo-1606913084603-3e7702b01627?w=600&h=400&fit=crop"
    },
    {
        title: "Artisan Empowerment",
        description: "Ensuring fair chances and sustainable livelihoods for our community of weavers under KVIC certification.",
        image: "https://images.unsplash.com/photo-1596253406385-d6c5c00e6205?w=600&h=400&fit=crop"
    },
    {
        title: "Eco-Conscious",
        description: "Using only natural fibers and traditional hand-operated looms that leave zero carbon footprint.",
        image: "https://images.unsplash.com/photo-1617627143233-46df7b95c6ff?w=600&h=400&fit=crop"
    }
];

export default function AboutPage() {
    return (
        <div className="-mt-20">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&h=900&fit=crop"
                    alt="Weaving loom"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--silk-indigo)] via-transparent to-transparent" />

                <div className="container relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[var(--saffron-light)] font-medium tracking-wider uppercase text-sm mb-4">
                            Since 1974
                        </p>
                        <h1 className="text-4xl md:text-7xl font-bold mb-6">
                            Weaving <span className="text-gradient">History</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Nabagram Seva Sangha is more than a cooperative. It is a guardian of
                            Bengal's textile legacy, weaving dreams in silk and muslin.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Origin Story */}
            <section className="section bg-white">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)] mb-6">
                                From the Heart of <br />
                                <span className="text-gradient">Murshidabad</span>
                            </h2>
                            <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                                <p>
                                    In the historic district of Murshidabad, where the Nawabs once patronized the finest arts,
                                    Nabagram Seva Sangha was born with a singular mission: to revive the glory of authentic Khadi.
                                </p>
                                <p>
                                    Certified by the Khadi and Village Industries Commission (KVIC), we operate as a
                                    direct-benefit community. Every thread bought from us contributes directly to the
                                    household of a master weaver or spinner.
                                </p>
                                <p>
                                    Specializing in 100-count Muslin and pure Silk, our fabrics are not manufactured;
                                    they are birthed through the rhythm of handlooms that clack from dawn to dusk.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-10">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="bg-[var(--cream)] rounded-xl p-4">
                                        <stat.icon className="h-6 w-6 text-[var(--deep-saffron)] mb-2" />
                                        <p className="text-2xl font-bold text-[var(--silk-indigo)]">{stat.value}</p>
                                        <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&h=1000&fit=crop"
                                    alt="Senior artisan"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section bg-[var(--cream)]/30">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)] mb-4">
                            Our <span className="text-gradient">Core Values</span>
                        </h2>
                        <p className="text-[var(--muted)] max-w-2xl mx-auto">
                            Principles that guide every warp and weft of our existence.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-[var(--silk-indigo)] mb-3">{item.title}</h3>
                                    <p className="text-[var(--muted)] text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[var(--silk-indigo)] text-white text-center">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Experience the Authenticity
                    </h2>
                    <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
                        Visit us in Murshidabad to see the magic unfold, or bring a piece of heritage home today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg" className="bg-[var(--deep-saffron)] text-white hover:bg-[var(--deep-saffron)]/90">
                                Shop Collection
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
