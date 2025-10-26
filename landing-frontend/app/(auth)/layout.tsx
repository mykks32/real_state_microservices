"use client";

import React, {FC, ReactNode} from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {

    return <main
        className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900/30 via-red-800/10 to-violet-900/30 backdrop-blur-lg">
        <Header/>
        {/* Content */}
        {children}
        <Footer/>
    </main>
};

export default AuthLayout;