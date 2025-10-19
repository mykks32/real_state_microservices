"use client";

import React, {useState, useEffect, FC, ReactNode} from "react";
import {Skeleton} from "@/components/ui/skeleton";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) {
        return (
            <section
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                <div className="w-full max-w-md space-y-6 p-4">
                    {/* Title */}
                    <Skeleton className="h-8 w-2/3 mx-auto"/>

                    {/* Subtitle */}
                    <Skeleton className="h-4 w-full mx-auto"/>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>

                    {/* Checkbox & Link */}
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/3"/>
                        <Skeleton className="h-4 w-1/4"/>
                    </div>

                    {/* Button */}
                    <Skeleton className="h-10 w-full"/>

                    {/* Footer */}
                    <Skeleton className="h-3 w-3/4 mx-auto"/>
                </div>
            </section>
        );
    }

    return <>{children}</>;
};

export default AuthLayout;