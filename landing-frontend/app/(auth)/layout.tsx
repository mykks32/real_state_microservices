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

    return <main className="relative z-10 h-screen">
        <Image
            src="/images/city-bg.png"
            alt="City background"
            fill
            className="object-cover object-center opacity-50"
            priority
        />

        <div className="absolute inset-0 bg-amber-700/20 backdrop-blur-lg" />

        <div className="z-10 relative h-full flex flex-col">
            <Header className="z-10" />

            {/* Scrollable content */}
            <div className="flex-1">
                {children}
            </div>

            <Footer className="z-10" />
        </div>
    </main>
};

export default AuthLayout;