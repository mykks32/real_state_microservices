"use client";

import React, {FC, ReactNode} from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {

    return <main
        className="bg-gradient-to-br flex flex-col h-screen from-blue-900/30 via-red-800/10 to-violet-900/30 backdrop-blur-lg">
        <Header/>
        {/* Content */}
        <div className="flex-1">{children}</div>
        <Footer/>
    </main>
};

export default AuthLayout;