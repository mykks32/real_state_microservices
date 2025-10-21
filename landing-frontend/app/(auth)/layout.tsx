"use client";

import React, {useState, useEffect, FC, ReactNode} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {

    return <div>
        <Image
            src="/images/city-bg.png"
            alt="City background"
            fill
            className="object-cover object-center opacity-50"
            priority
        />
        <div>{children}</div>
    </div>
};

export default AuthLayout;