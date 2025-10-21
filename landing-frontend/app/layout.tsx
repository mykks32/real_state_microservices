import type {Metadata} from "next";
import "./globals.css";
import {Toaster} from "sonner";
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
            <div className="relative">{children}</div>
            <Toaster/>
        </AppProvider>
        </body>
        </html>
    );
}