import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import RootSkeletonServer from "@/components/common/root-skeleton";
import AppProvider from "@/components/providers/AppProvider";
import React from "react";

export const metadata: Metadata = {
    title: "Real State Application",
    description: "Find real estate in Nepal.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    // Render skeleton server-side
    return (
        <html lang="en">
        <body>
        <AppProvider
        >
            {/*<RootSkeletonServer/>*/}
            {children}
            {/* Replace with actual content on client */}
            <Toaster/>
        </AppProvider>
        </body>
        </html>
    );
}