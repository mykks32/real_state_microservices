"use client";

import React, {useState, useEffect, FC, ReactNode} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {

    return <main className="relative z-10 min-h-screen h-full">
        <Header className="z-10" />
        {/* Background image */}
        <Image
            src="/images/city-bg.png"
            alt="City background"
            fill
            className="object-cover object-center opacity-50"
            priority
        />

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-amber-700/20 backdrop-blur-lg" />

        {/* Content */}
        <div className="z-10">{children}</div>
        <Footer className="relative z-10" />
    </main>
};

export default AuthLayout;