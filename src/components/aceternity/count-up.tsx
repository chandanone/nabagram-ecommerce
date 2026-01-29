"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
}

export function CountUp({
    end,
    duration = 2,
    suffix = "",
    prefix = "",
    decimals = 0,
}: CountUpProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, duration, isInView]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="tabular-nums"
        >
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </motion.span>
    );
}

interface StatCardProps {
    value: number;
    label: string;
    suffix?: string;
    icon?: React.ReactNode;
    delay?: number;
}

export function StatCard({ value, label, suffix = "", icon, delay = 0 }: StatCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="glass rounded-2xl p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            {icon && (
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--deep-saffron)]/10 flex items-center justify-center text-[var(--deep-saffron)] group-hover:bg-[var(--deep-saffron)] group-hover:text-white transition-all duration-300">
                    {icon}
                </div>
            )}
            <div className="text-4xl md:text-5xl font-bold text-[var(--deep-saffron)] mb-2">
                <CountUp end={value} suffix={suffix} duration={2.5} />
            </div>
            <p className="text-[var(--muted)] font-medium">{label}</p>
        </motion.div>
    );
}
