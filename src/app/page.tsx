"use client";

import { motion } from "framer-motion";
import { HeroParallax } from "@/components/aceternity/hero-parallax";
import { StatCard } from "@/components/aceternity/count-up";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Award, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Demo products for hero parallax
const heroProducts = [
  { title: "Royal Muslin 100s", link: "/products/1", thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop" },
  { title: "Silk Saree Collection", link: "/products/2", thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop" },
  { title: "Heritage Muslin 80s", link: "/products/3", thumbnail: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop" },
  { title: "Printed Silk Elegance", link: "/products/4", thumbnail: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop" },
  { title: "Classic White Muslin", link: "/products/5", thumbnail: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop" },
  { title: "Artisan Silk Than", link: "/products/6", thumbnail: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&h=800&fit=crop" },
  { title: "Premium Muslin 60s", link: "/products/7", thumbnail: "https://images.unsplash.com/photo-1585128903994-9788298932a6?w=600&h=800&fit=crop" },
  { title: "Bridal Silk Saree", link: "/products/8", thumbnail: "https://images.unsplash.com/photo-1583391733975-9e4e8a4c0a28?w=600&h=800&fit=crop" },
  { title: "Festive Collection", link: "/products/9", thumbnail: "https://images.unsplash.com/photo-1617627143233-46df7b95c6ff?w=600&h=800&fit=crop" },
  { title: "Daily Wear Muslin", link: "/products/10", thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop" },
  { title: "Designer Silk", link: "/products/11", thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop" },
  { title: "Traditional Weave", link: "/products/12", thumbnail: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop" },
  { title: "Pure Cotton Muslin", link: "/products/13", thumbnail: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop" },
  { title: "Wedding Collection", link: "/products/14", thumbnail: "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=600&h=800&fit=crop" },
  { title: "Casual Elegance", link: "/products/15", thumbnail: "https://images.unsplash.com/photo-1617627143233-46df7b95c6ff?w=600&h=800&fit=crop" },
];

// Demo featured products
const featuredProducts = [
  { id: "1", name: "Royal Muslin 100s Count", price: 12500, fabricType: "MUSLIN", fabricCount: 100, image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop" },
  { id: "2", name: "Printed Silk Saree - Paisley", price: 18500, fabricType: "SILK_SAREE", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop" },
  { id: "3", name: "Heritage Muslin 80s", price: 9500, fabricType: "MUSLIN", fabricCount: 80, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop" },
  { id: "4", name: "Artisan Silk Than", price: 22000, fabricType: "SILK_THAN", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop" },
];

export default function HomePage() {
  return (
    <div className="-mt-20">
      {/* Hero Parallax Section */}
      <HeroParallax products={heroProducts} />

      {/* Artisan Pulse Section */}
      <section className="section bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--cream)]/50 to-transparent" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[var(--deep-saffron)] font-medium tracking-wider uppercase text-sm mb-4">
              Our Artisan Community
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--silk-indigo)] mb-4">
              The Pulse of <span className="text-gradient">Tradition</span>
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Behind every thread lies the dedication of our master craftspeople,
              preserving techniques passed down through generations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              value={28}
              label="Master Spinners"
              icon={<Sparkles className="h-6 w-6" />}
              delay={0}
            />
            <StatCard
              value={13}
              label="Skilled Weavers"
              icon={<Heart className="h-6 w-6" />}
              delay={0.1}
            />
            <StatCard
              value={50}
              suffix="+"
              label="Years of Heritage"
              icon={<Award className="h-6 w-6" />}
              delay={0.2}
            />
            <StatCard
              value={100}
              suffix="%"
              label="Handcrafted"
              icon={<Leaf className="h-6 w-6" />}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <p className="text-[var(--deep-saffron)] font-medium tracking-wider uppercase text-sm mb-4">
                Curated Selection
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)]">
                Featured <span className="text-gradient">Collections</span>
              </h2>
            </div>
            <Link href="/products">
              <Button variant="outline" className="mt-6 md:mt-0 gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => console.log("Added to cart:", product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Story Section */}
      <section className="section bg-[var(--silk-indigo)] text-white overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[var(--saffron-light)] font-medium tracking-wider uppercase text-sm mb-4">
                Our Heritage
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Weaving Stories <br />
                <span className="text-[var(--saffron-light)]">Since Generations</span>
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Nabagram Seva Sangha stands as a testament to the rich textile heritage
                of Murshidabad. Under the Khadi and Village Industries Commission (KVIC),
                we empower local artisans while preserving the ancient art of muslin and
                silk weaving.
              </p>
              <p className="text-white/70 mb-8 leading-relaxed">
                From the finest 100-count muslin that once graced royal courts to
                intricately printed silk sarees, each piece tells a story of patience,
                skill, and unwavering dedication to quality.
              </p>
              <Link href="/about">
                <Button variant="glass" size="lg" className="gap-2 text-white border-white/20 hover:bg-white/10">
                  Discover Our Story
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&h=1000&fit=crop"
                  alt="Artisan at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--silk-indigo)] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-saffron rounded-xl p-6 max-w-xs">
                <p className="font-bold text-2xl mb-1">KVIC Certified</p>
                <p className="text-white/80 text-sm">
                  Authentic Khadi products with government certification
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[var(--deep-saffron)] font-medium tracking-wider uppercase text-sm mb-4">
              Shop By Category
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--silk-indigo)]">
              Explore Our <span className="text-gradient">Collections</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Cotton Muslin", desc: "60s to 100s count", href: "/products?type=MUSLIN", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop" },
              { title: "Silk Sarees", desc: "Printed & Plain", href: "/products?type=SILK_SAREE", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop" },
              { title: "Silk Than", desc: "Premium Fabric", href: "/products?type=SILK_THAN", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=400&fit=crop" },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href} className="group block">
                  <div className="relative aspect-[3/2] rounded-2xl overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--silk-indigo)] via-[var(--silk-indigo)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[var(--saffron-light)] transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-white/70 text-sm">{category.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-gradient-to-r from-[var(--deep-saffron)] to-[var(--saffron-light)]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Heritage Circle
            </h2>
            <p className="text-white/80 mb-8">
              Be the first to know about new collections, artisan stories, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-6 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="secondary" size="lg" className="bg-white text-[var(--deep-saffron)] hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
