"use client";

import { useEffect, useState } from "react";
import LandingHeader from "../components/landing/LandingHeader";
import LandingSection from "../components/landing/LandingSection";
import LandingFooter from "../components/landing/LandingFooter";
import Blob2 from "../assets/blob-2.svg";
import Footer from "@/components/common/Footer";

const sectionData = [
    {
        reverse: false,
        title: "Find Property",
        phrases: [
            "Modern apartments",
            "Luxury villas",
            "Office spaces",
            "And more"
        ],
        image: "/building-1.png",
        imageAlt: "Modern building exterior showcasing properties",
    },
    {
        reverse: true,
        title: "Easy Search",
        phrases: [
            "Filter options",
            "Compare listings",
            "Save favorites",
            "Get updates"
        ],
        image: "/living-room-1.png",
        imageAlt: "Stylish living room interior with modern decor",
    },
    {
        reverse: false,
        title: "Grow in Real Estate",
        phrases: [
            "Manage business",
            "Advertise properties",
            "Join community",
            "Maximize opportunities"
        ],
        image: "/business-1.png",
        imageAlt: "Professional businessman reviewing property portfolio",
    },
];

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // ✅ Only run this on the client
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        // set initial scroll
        handleScroll();
        window.addEventListener("scroll", handleScroll);

        // cleanup
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <main className="overflow-x-hidden">
            {/* landing bg */}
            <div
                className="w-screen h-dvh bg-cover bg-center opacity-35"
                style={{ backgroundImage: "url('/images/city-bg.png')" }}
            ></div>

            <LandingHeader scrolled={scrolled} />

            {/* SVG wave */}
            <svg
                id="wave"
                viewBox="0 0 1440 310"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className={`bg-slate-100 transition-all -mt-8`}
            >
                <defs>
                    <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
                        <stop stopColor="rgba(252, 208, 44, 1)" offset="0%"></stop>
                        <stop
                            stopColor="rgba(255, 243.309, 199.732, 1)"
                            offset="100%"
                        ></stop>
                    </linearGradient>
                </defs>
                <path
                    fill="url(#sw-gradient-0)"
                    d="M0,248L60,211.8C120,176,240,103,360,98.2C480,93,600,155,720,160.2C840,165,960,114,1080,124C1200,134,1320,207,1440,201.5C1560,196,1680,114,1800,98.2C1920,83,2040,134,2160,155C2280,176,2400,165,2520,175.7C2640,186,2760,217,2880,211.8C3000,207,3120,165,3240,139.5C3360,114,3480,103,3600,108.5C3720,114,3840,134,3960,155C4080,176,4200,196,4320,196.3C4440,196,4560,176,4680,170.5C4800,165,4920,176,5040,160.2C5160,145,5280,103,5400,113.7C5520,124,5640,186,5760,211.8C5880,238,6000,227,6120,222.2C6240,217,6360,217,6480,211.8C6600,207,6720,196,6840,170.5C6960,145,7080,103,7200,82.7C7320,62,7440,62,7560,98.2C7680,134,7800,207,7920,242.8C8040,279,8160,279,8280,253.2C8400,227,8520,176,8580,149.8L8640,124L8640,310L0,310Z"
                ></path>
            </svg>

            <div className="bg-theme-1 py-20 relative overflow-hidden">
                <img
                    src={Blob2.src}
                    alt="Blob image"
                    className="brightness-90 absolute top-28 -right-1/3 z-[0] w-[900px] h-[900px] max-w-none"
                />

                <div className="w-[80%] m-auto flex flex-col gap-40 relative">
                    {sectionData.map((section, index) => (
                        <LandingSection key={index} {...section} />
                    ))}
                </div>
            </div>

            <LandingFooter />
            <Footer />
        </main>
    );
};

export default Landing;